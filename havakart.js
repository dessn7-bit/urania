/* havakart.js — "Bu gece" bölümündeki hava kartları (v44):
   1) Şu an gökyüzü: EUMETSAT uydu görüntüsü (EUMETView WMS) + bulut maskesinden "şu an üstünde: açık / bulutlu" rozeti
   2) Tahmin güveni: Open-Meteo Ensemble'da bu gecenin her saati için bulutu %30'un altında kalan senaryo sayısı + modellerin tek tek tahmini
   3) Şeffaflık (CAMS aerosol optik derinliği → kadir kaybı), çiğ riski, hissedilen sıcaklık, rüzgâr, sis/pus
   4) Kutup ışığı uyarısı: NOAA SWPC Kp tahmini önümüzdeki 3 günde 8 ya da üstü
   Ortak kurallar: dış servise giden konum iki ondalığa yuvarlanır (~1 km); servis yanıt vermezse kart sessizce gizlenir;
   çevrimdışıyken son başarılı veri "şu saatteki veri" etiketiyle gösterilir. Kaynaklar ve şart alıntıları: arastirma/hava_kaynak.md.
   Saf hesaplar (DOM'suz) HavaKart.hesap altında; testler bunları doğrudan çağırır. */
(function () {
  'use strict';
  const U = window.Urania;

  /* ---------------- sabitler ---------------- */
  const WMS = 'https://view.eumetsat.int/geoserver/';
  /* Katmanlar (GetCapabilities, 2026-11-08): mtg_fd = MTG-I 0° tam disk (10 dk), msg_fes = MSG 0° (15 dk) */
  const KATMAN = {
    renk: { ad: 'Gerçek renk', katman: 'mtg_fd:rgb_geocolour', yol: 'mtg_fd/rgb_geocolour', uydu: 'Meteosat (MTG)', urun: 'GeoColour RGB' },
    kizilotesi: { ad: 'Kızılötesi', katman: 'mtg_fd:ir105_hrfi', yol: 'mtg_fd/ir105_hrfi', uydu: 'Meteosat (MTG)', urun: 'FCI 10,5 μm' },
    maske: { ad: 'Bulut maskesi', katman: 'msg_fes:clm', yol: 'msg_fes/clm', uydu: 'Meteosat (MSG)', urun: 'Cloud Mask' },
    yagis: { ad: 'Yağış', katman: 'mtg_fd:h40b', yol: 'mtg_fd/h40b', uydu: 'Meteosat (MTG)', urun: 'H40B yağış oranı', alt: 'mtg_fd:ir105_hrfi' }
  };
  const KIYI = 'backgrounds:ne_10m_coastline';
  /* Görüntü kutusu: konum ortada, kuzey–güney ±2,5° (~280 km); 4:3 en-boy, boylam aralığı cos(enlem) ile düzeltilir */
  const YARIM_ENLEM = 2.5, GEN = 800, YUK = 600;

  /* Open-Meteo Ensemble modelleri (https://open-meteo.com/en/docs/ensemble-api, 2026-11-08; üye sayıları belgeden) */
  const ENS_MODEL = ['ecmwf_ifs025_ensemble', 'dwd_icon_seamless_eps', 'ncep_gefs_seamless', 'gem_global_ensemble', 'ukmo_global_ensemble_20km'];
  /* Tek tek modeller (forecast API models=) */
  const TEK_MODEL = ['ecmwf_ifs025', 'ncep_gfs_seamless', 'dwd_icon_seamless', 'ukmo_seamless', 'meteofrance_seamless', 'cmc_gem_seamless'];
  const MODEL_AD = {
    ecmwf_ifs025: 'ECMWF (Avrupa)', ncep_gfs_seamless: 'GFS (ABD)', dwd_icon_seamless: 'ICON (Almanya)', ukmo_seamless: 'UKMO (Birleşik Krallık)',
    meteofrance_seamless: 'ARPEGE (Fransa)', cmc_gem_seamless: 'GEM (Kanada)',
    ecmwf_ifs025_ensemble: 'ECMWF', dwd_icon_seamless_eps: 'ICON', ncep_gefs_seamless: 'GFS', gem_global_ensemble: 'GEM', ukmo_global_ensemble_20km: 'UKMO'
  };
  const ACIK_ESIK = 30;   // bulut %30'un altı "açık": uygulamanın bulut cümlesi ve gece kararıyla aynı eşik

  /* Önbellek süreleri */
  const S3 = 3 * 3600e3, EN_ESKI = 48 * 3600e3;
  /* WMO: sis = yatay görüş 1 km'nin altında (Cloud Atlas); pus (mist) en az 1 km, en çok 5 km (WMO-No. 49 Cilt II 4.4.2.3) */
  const SIS = 1000, PUS = 5000;
  /* Beer–Lambert: m = −2,5 log10(e^−τ) = 2,5 τ log10(e) = 1,0857 τ kadir (başucunda, hava kütlesi 1) */
  const KADIR_TAU = 2.5 * Math.LOG10E;

  const C = x => { const r = Math.round(x); return (r < 0 ? '−' : '') + U.sayi(Math.abs(r), 0); };   // sıcaklık: eksi işareti (U+2212), "−0" olmaz
  const yuvarla = x => Math.round(x * 100) / 100;
  const iki = x => yuvarla(x).toFixed(2);

  /* ---------------- saf hesaplar ---------------- */
  function kutu(enlem, boylam) {
    const e = yuvarla(enlem), b = yuvarla(boylam);
    const yb = YARIM_ENLEM * (GEN / YUK) / Math.max(0.2, Math.cos(e * Math.PI / 180));
    const g = Math.max(-80, e - YARIM_ENLEM), k = Math.min(80, e + YARIM_ENLEM);
    /* WMS 1.3.0 + EPSG:4326: eksen sırası enlem, boylam */
    return { bbox: [g, b - yb, k, b + yb].map(x => x.toFixed(2)).join(','), enlem: e, boylam: b, gen: GEN, yuk: YUK };
  }
  /* GetCapabilities: <Dimension name="time" default="2026-11-08T18:30:00Z" …>…/2026-11-08T18:30:00.000Z/PT10M</Dimension> */
  function sonZaman(xml) {
    const m = String(xml || '').match(/<Dimension[^>]*name="time"[^>]*>([^<]*)<\/Dimension>/);
    const d = String(xml || '').match(/<Dimension[^>]*name="time"[^>]*default="([^"]+)"/);
    let t = d ? Date.parse(d[1]) : NaN;
    if (!isFinite(t) && m) { const p = m[1].trim().split('/'); t = Date.parse(p.length >= 2 ? p[1] : p[0].split(',').pop()); }
    return isFinite(t) ? new Date(t) : null;
  }
  function haritaUrl(tur, kt, zaman) {
    const K = KATMAN[tur];
    const kat = (K.alt ? [K.alt] : []).concat([K.katman, KIYI]).join(',');
    return WMS + 'ows?service=WMS&version=1.3.0&request=GetMap&layers=' + kat + '&styles=&crs=EPSG:4326&bbox=' + kt.bbox +
      '&width=' + kt.gen + '&height=' + kt.yuk + '&format=image/jpeg&time=' + zaman.toISOString().replace('.000Z', 'Z');
  }
  /* Bulut maskesi noktası: 3×3 piksellik küçük kutunun ortası (~0,01°) */
  function maskeUrl(enlem, boylam, zaman) {
    const e = yuvarla(enlem), b = yuvarla(boylam);
    return WMS + 'ows?service=WMS&version=1.3.0&request=GetFeatureInfo&layers=msg_fes:clm&query_layers=msg_fes:clm&styles=&crs=EPSG:4326&bbox=' +
      [e - 0.01, b - 0.01, e + 0.01, b + 0.01].map(x => x.toFixed(2)).join(',') + '&width=3&height=3&i=1&j=1&info_format=application/json&time=' + zaman.toISOString().replace('.000Z', 'Z');
  }
  /* Lejant (GetLegendGraphic, 2026-11-08): mavi (0,0,255) denizde açık, yeşil (0,192,0) karada açık, beyaz (255,255,255) bulut */
  function maskeSinif(j) {
    const p = j && Array.isArray(j.features) && j.features[0] && j.features[0].properties;
    if (!p) return null;
    const r = p.RED_BAND, g = p.GREEN_BAND, b = p.BLUE_BAND;
    if (![r, g, b].every(Number.isFinite)) return null;
    if (r === 0 && g === 0 && b === 255) return 'acik-deniz';
    if (r === 0 && g === 192 && b === 0) return 'acik-kara';
    if (r === 255 && g === 255 && b === 255) return 'bulut';
    return null;   // işlenmemiş / disk dışı / bilinmeyen renk: rozet yok
  }

  /* Ensemble yanıtı: hourly.time + her senaryo için "cloud_cover…" dizisi (control ve member01…, modele göre ekli) */
  function senaryoDizileri(j) {
    const h = j && j.hourly;
    if (!h || !Array.isArray(h.time)) return null;
    const ls = Object.keys(h).filter(k => /^cloud_cover(?:_|$)/.test(k) && !/_(?:low|mid|high)(?:_|$)/.test(k) && Array.isArray(h[k]) && h[k].length === h.time.length);
    return ls.length ? { time: h.time, diziler: ls.map(k => ({ ad: k, d: h[k] })) } : null;
  }
  function modelAdi(anahtar) { const m = ENS_MODEL.find(x => anahtar.endsWith('_' + x)); return m || 'tek'; }
  /* Her saat için: kaç senaryo bulutu %30'un ALTINDA görüyor; null değerli senaryo o saat sayılmaz */
  function ensembleSay(j, bas, son) {
    const s = senaryoDizileri(j); if (!s) return null;
    const out = [];
    s.time.forEach((t, i) => {
      const an = new Date(t * 1000);
      if (an < new Date(bas.getTime() - 30 * 60e3) || an > new Date(son.getTime() + 30 * 60e3)) return;
      let acik = 0, toplam = 0; const model = {};
      s.diziler.forEach(x => {
        const v = x.d[i]; if (!Number.isFinite(v)) return;
        toplam++; const m = modelAdi(x.ad); model[m] = model[m] || { acik: 0, toplam: 0 }; model[m].toplam++;
        if (v < ACIK_ESIK) { acik++; model[m].acik++; }
      });
      if (toplam) out.push({ t: an, acik, toplam, model });
    });
    return out.length ? out : null;
  }
  /* Tek modeller: cloud_cover_<model> dizileri; gecenin belirli saatlerindeki değerleri */
  function modelTahmin(j, saatler) {
    const h = j && j.hourly; if (!h || !Array.isArray(h.time)) return null;
    const ls = TEK_MODEL.filter(m => Array.isArray(h['cloud_cover_' + m])).map(m => ({
      model: m, ad: MODEL_AD[m],
      deger: saatler.map(t => { const i = h.time.indexOf(Math.round(t.getTime() / 1000)); const v = i >= 0 ? h['cloud_cover_' + m][i] : null; return Number.isFinite(v) ? v : null; })
    })).filter(x => x.deger.some(v => v != null));
    return ls.length ? ls : null;
  }

  /* Şeffaflık: gece saatlerinin ortalama AOD'si → başucunda kadir kaybı */
  function aodKadir(aod) { return Number.isFinite(aod) ? KADIR_TAU * aod : null; }
  function aqGece(j, bas, son) {
    const h = j && j.hourly; if (!h || !Array.isArray(h.time) || !Array.isArray(h.aerosol_optical_depth)) return null;
    const ls = [];
    h.time.forEach((t, i) => {
      const an = new Date(t * 1000);
      if (an < new Date(bas.getTime() - 30 * 60e3) || an > new Date(son.getTime() + 30 * 60e3)) return;
      const a = h.aerosol_optical_depth[i]; if (!Number.isFinite(a)) return;
      ls.push({ t: an, aod: a, toz: h.dust && Number.isFinite(h.dust[i]) ? h.dust[i] : null });
    });
    if (!ls.length) return null;
    const ort = ls.reduce((s, x) => s + x.aod, 0) / ls.length;
    const tozlu = ls.filter(x => x.toz != null);
    return { aod: ort, kadir: aodKadir(ort), enCokAod: Math.max(...ls.map(x => x.aod)), toz: tozlu.length ? Math.max(...tozlu.map(x => x.toz)) : null, n: ls.length };
  }
  /* Çiğ (BAA "Dealing with dew": açık gökte yüzeyler havadan 1–2 °C soğur; az rüzgârda ısınma da az olur):
     sıcaklık − çiy noktası ≤ 2 °C VE gök açık (bulut < %30). Rüzgâr için kaynaklı bir sayısal eşik bulunamadı: değeri yanında gösterilir. */
  function cigSaatleri(saatler) {
    return saatler.filter(s => Number.isFinite(s.sicaklik) && Number.isFinite(s.ciy) && s.bulut != null && s.bulut < ACIK_ESIK && s.sicaklik - s.ciy <= 2);
  }
  function sisDurumu(gorus) { if (!Number.isFinite(gorus)) return null; return gorus < SIS ? 'sis' : gorus <= PUS ? 'pus' : null; }
  /* Kp: önümüzdeki 72 saatteki tahmin ("predicted"/"estimated") ve gözlenen son değerler; en büyük ≥ 8 ise uyarı */
  function kpUyari(liste, simdi) {
    if (!Array.isArray(liste)) return null;
    const ls = liste.map(x => (Array.isArray(x) ? { time_tag: x[0], kp: Number(x[1]), observed: x[2] } : x))
      .filter(x => x && Number.isFinite(Number(x.kp)) && typeof x.time_tag === 'string')
      .map(x => ({ t: new Date(x.time_tag.replace(' ', 'T') + (/Z|[+-]\d\d:?\d\d$/.test(x.time_tag) ? '' : 'Z')), kp: Number(x.kp), tur: x.observed }))
      .filter(x => isFinite(x.t) && x.t.getTime() + 3 * 3600e3 > simdi.getTime() && x.t.getTime() <= simdi.getTime() + 72 * 3600e3);
    if (!ls.length) return { enCok: null, uyari: false };
    const en = ls.reduce((a, b) => (b.kp > a.kp ? b : a));
    return { enCok: en.kp, zaman: en.t, tur: en.tur, uyari: en.kp >= 8 };
  }

  /* ---------------- ağ ve önbellek ---------------- */
  const bellek = {};
  const hataZamani = {};
  const HATA_BEKLE = 10 * 60e3;
  async function zamanli(url, secenek, sure) {
    const ctl = new AbortController(); const zs = setTimeout(() => ctl.abort(), sure || 10000);
    try { return await fetch(url, Object.assign({ signal: ctl.signal }, secenek || {})); } finally { clearTimeout(zs); }
  }
  /* JSON getir: taze kayıt varsa ağa gidilmez; ağ hata verirse 48 saate kadar eski kayıt "eski" bayrağıyla döner */
  async function jsonGetir(anahtar, url, taze, dogrula, servis) {
    const kayit = [U.oku(anahtar, null), bellek[anahtar]].filter(x => x && x.j && dogrula(x.j) && Date.now() - x.alindi >= -60e3).sort((a, b) => b.alindi - a.alindi)[0] || null;
    if (kayit && Date.now() - kayit.alindi < taze) return { j: kayit.j, alindi: new Date(kayit.alindi), eski: false };
    const eskiDon = () => (kayit && Date.now() - kayit.alindi < EN_ESKI ? { j: kayit.j, alindi: new Date(kayit.alindi), eski: true } : null);
    if (hataZamani[servis] && Date.now() - hataZamani[servis] < HATA_BEKLE) { const e = eskiDon(); if (e) return e; throw new Error('bekleniyor'); }
    try {
      const r = await zamanli(url);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      /* Open-Meteo X-RateLimit-Cost: bu isteğin kaç "çağrı" sayıldığı (görünürse tanı ekranına yazılır) */
      const bedel = r.headers.get('x-ratelimit-cost'); if (bedel != null) { try { U.yaz('havaBedel_' + servis, { bedel: Number(bedel), t: Date.now() }); } catch (h) { /* depo yok */ } }
      const j = await r.json();
      if (!dogrula(j)) throw new Error('beklenmeyen yanıt');
      bellek[anahtar] = { alindi: Date.now(), j };
      U.yaz(anahtar, bellek[anahtar]);
      if (window.Tani) Tani.servis(servis, 'tamam', bedel != null ? 'bedel ' + bedel : '');
      return { j, alindi: new Date(), eski: false };
    } catch (e) {
      hataZamani[servis] = Date.now();
      if (window.Tani) Tani.servis(servis, 'hata', e.message);
      const es = eskiDon(); if (es) return es;
      throw e;
    }
  }
  function eskiKayitlariSil(onek) {
    U.anahtarlar(onek).forEach(a => { const x = U.oku(a, null); if (!x || !(Date.now() - x.alindi <= EN_ESKI)) U.sil(a); });
  }
  const hucre = (e, b) => iki(e) + '_' + iki(b);

  function ensembleGetir(e, b) {
    eskiKayitlariSil('ens1_');
    const url = 'https://ensemble-api.open-meteo.com/v1/ensemble?latitude=' + iki(e) + '&longitude=' + iki(b) + '&hourly=cloud_cover&models=' + ENS_MODEL.join(',') +
      '&timezone=GMT&timeformat=unixtime&forecast_days=3';
    return jsonGetir('ens1_' + hucre(e, b), url, S3, j => !!senaryoDizileri(j), 'Open-Meteo (ensemble)');
  }
  function modellerGetir(e, b) {
    eskiKayitlariSil('mdl1_');
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + iki(e) + '&longitude=' + iki(b) + '&hourly=cloud_cover&models=' + TEK_MODEL.join(',') +
      '&timezone=GMT&timeformat=unixtime&forecast_days=3';
    return jsonGetir('mdl1_' + hucre(e, b), url, S3, j => !!(j && j.hourly && Array.isArray(j.hourly.time) && TEK_MODEL.some(m => Array.isArray(j.hourly['cloud_cover_' + m]))), 'Open-Meteo (modeller)');
  }
  function aqGetir(e, b) {
    eskiKayitlariSil('aq1_');
    const url = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + iki(e) + '&longitude=' + iki(b) + '&hourly=aerosol_optical_depth,dust&timezone=GMT&timeformat=unixtime&forecast_days=5';
    return jsonGetir('aq1_' + hucre(e, b), url, S3, j => !!(j && j.hourly && Array.isArray(j.hourly.time) && Array.isArray(j.hourly.aerosol_optical_depth)), 'Open-Meteo (hava kalitesi)');
  }
  function kpGetir() {
    return jsonGetir('kp1', 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json', S3, j => Array.isArray(j) && j.length > 0, 'NOAA SWPC (Kp)');
  }
  /* Yetenekler (katmanın en son görüntü zamanı): 10 dk bellekte */
  const yetenek = {};
  async function sonGoruntu(yol) {
    const y = yetenek[yol];
    if (y && Date.now() - y.alindi < 10 * 60e3) return y.zaman;
    const r = await zamanli(WMS + yol + '/ows?service=WMS&version=1.3.0&request=GetCapabilities');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const z = sonZaman(await r.text());
    if (!z) throw new Error('zaman yok');
    yetenek[yol] = { zaman: z, alindi: Date.now() };
    return z;
  }
  /* Uydu görüntüsü: tarayıcının HTTP önbelleğine yazılmaz (sunucu 7 gün önbellek başlığı gönderiyor; cache:'no-store').
     Çevrimdışı gösterim için yalnız SON başarılı görüntü (her katmandan bir tane, en çok 24 saat) Cache API'de tutulur. */
  const UYDU_ONBELLEK = 'urania-uydu-son';
  async function goruntuAl(tur, kt) {
    const meta = 'uydu1_' + tur;
    try {
      const zaman = await sonGoruntu(KATMAN[tur].yol);
      const url = haritaUrl(tur, kt, zaman);
      const r = await zamanli(url, { cache: 'no-store' }, 15000);
      if (!r.ok || !/^image\//.test(r.headers.get('content-type') || '')) throw new Error('HTTP ' + r.status);
      const blob = await r.blob();
      try {
        const c = await caches.open(UYDU_ONBELLEK);
        const eskiler = await c.keys();
        await Promise.all(eskiler.filter(q => q.url.indexOf('?tur=' + tur) > 0).map(q => c.delete(q)));
        await c.put(new Request('./uydu-son.jpg?tur=' + tur), new Response(blob, { headers: { 'content-type': blob.type } }));
      } catch (h) { /* Cache API yok ya da kota dolu: yalnız çevrimdışı kopya olmaz */ }
      U.yaz(meta, { zaman: zaman.getTime(), alindi: Date.now(), bbox: kt.bbox });
      if (window.Tani) Tani.servis('EUMETSAT (uydu)', 'tamam');
      return { blob, zaman, eski: false };
    } catch (e) {
      if (window.Tani) Tani.servis('EUMETSAT (uydu)', 'hata', e.message);
      const m = U.oku(meta, null);
      if (!m || !(Date.now() - m.alindi < 24 * 3600e3) || m.bbox !== kt.bbox) throw e;
      try {
        const c = await caches.open(UYDU_ONBELLEK);
        const r = await c.match(new Request('./uydu-son.jpg?tur=' + tur));
        if (!r) throw e;
        return { blob: await r.blob(), zaman: new Date(m.zaman), eski: true, alindi: new Date(m.alindi) };
      } catch (h) { throw e; }
    }
  }
  async function maskeAl(e, b) {
    const k = 'maske1_' + hucre(e, b);
    try {
      const zaman = await sonGoruntu('msg_fes/clm');
      const r = await zamanli(maskeUrl(e, b, zaman));
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const sinif = maskeSinif(await r.json());
      if (!sinif) return null;
      U.yaz(k, { sinif, zaman: zaman.getTime(), alindi: Date.now() });
      return { sinif, zaman, eski: false };
    } catch (h) {
      const m = U.oku(k, null);
      if (m && Date.now() - m.alindi < 24 * 3600e3) return { sinif: m.sinif, zaman: new Date(m.zaman), eski: true };
      return null;
    }
  }

  /* ---------------- görünüm ---------------- */
  const yil = d => new Intl.DateTimeFormat('tr-TR', { year: 'numeric', timeZone: 'UTC' }).format(d);
  const eskiNot = zaman => `<span class="hk-eski">Çevrimdışı: ${U.ek(U.saat(zaman), 'de')}ki veri (${U.gun(zaman)})</span>`;
  /* Open-Meteo lisansı: verinin yanında open-meteo.com bağlantısı; CC BY 4.0 bağlantısı ve değişiklik notu */
  const OM = '<a href="https://open-meteo.com/" target="_blank" rel="noopener">Hava verisi: Open-Meteo.com</a> (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>; sayım ve özetler Urania\'nın hesabı)';

  let uyduTur = (() => { try { return U.oku('uyduTur', 'renk'); } catch (h) { return 'renk'; } })();
  if (!KATMAN[uyduTur]) uyduTur = 'renk';
  let objeUrl = null, uyduSira = 0;
  async function uyduYaz(kap, ctx) {
    const sira = ++uyduSira;
    const kt = kutu(ctx.enlem, ctx.boylam);
    let g, maske;
    try { [g, maske] = await Promise.all([goruntuAl(uyduTur, kt), maskeAl(ctx.enlem, ctx.boylam)]); } catch (e) {
      if (sira === uyduSira) { kap.hidden = true; kap.innerHTML = ''; }
      return;
    }
    if (sira !== uyduSira) return;
    if (objeUrl) URL.revokeObjectURL(objeUrl);
    objeUrl = URL.createObjectURL(g.blob);
    const rozet = maske ? (maske.sinif === 'bulut' ? '<span class="rozet uyari" id="gkUyduRozet" data-durum="bulut">Şu an üstünde: bulutlu</span>'
      : `<span class="rozet iyi" id="gkUyduRozet" data-durum="acik">Şu an üstünde: açık</span>`) : '';
    const maskeNot = maske ? `Rozet: bulut maskesi, ${U.saat(maske.zaman)} görüntüsü, konumunun tam üstündeki nokta (${maske.sinif === 'acik-deniz' ? 'denizde açık' : maske.sinif === 'acik-kara' ? 'karada açık' : 'bulut'}).` : '';
    const K = KATMAN[uyduTur];
    const lejant = {
      renk: 'Gündüz gerçek renk; gece bulutlar soluk mavi-gri, şehir ışıkları sarı noktalar.',
      kizilotesi: 'Kızılötesi görüntü ışığı değil sıcaklığı ölçer, bu yüzden gece de çalışır: bulut tepeleri yerden ve denizden soğuktur ve bu görüntüde soğuk olan açık renkte çizilir; geceleri bulutlar beyaz, açık gökteki sıcak kara ve deniz koyu görünür.',
      maske: 'Mavi: denizde açık gök · Yeşil: karada açık gök · Beyaz: bulut (EUMETSAT lejantı).',
      yagis: 'Kızılötesi görüntünün üstünde renkli alanlar yağış oranı (uydu tahmini; radar değil).'
    }[uyduTur];
    const dugmeler = Object.keys(KATMAN).map(k => `<button type="button" class="dugme" data-uydu="${k}" aria-pressed="${k === uyduTur}">${KATMAN[k].ad}</button>`).join('');
    /* EUMETSAT Data Policy madde 6.3: "[Contains modified] EUMETSAT [Meteosat/Metop] [data/product] [Year]"; görüntü kırpılıp
       kıyı çizgisi bindirildiği için "Contains modified". Lisans: Core veri, CC BY 4.0 (madde 5.1). */
    const atif = `Değiştirilmiş EUMETSAT Meteosat verisi içerir, ${yil(g.zaman)} (Contains modified EUMETSAT Meteosat data ${yil(g.zaman)}); <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. Görüntü: <a href="https://view.eumetsat.int/" target="_blank" rel="noopener">EUMETView</a> (${U.kacis(K.uydu)}, ${U.kacis(K.urun)}); kıyı çizgisi Natural Earth.`;
    kap.hidden = false;
    kap.innerHTML = `<h3 class="hk-bas okunur" data-ses="Şu an gökyüzü.">Şu an gökyüzü ${rozet}</h3>
      <div class="cip-grup hk-sec" role="group" aria-label="Uydu görüntüsü türü">${dugmeler}</div>
      <figure class="hk-uydu"><div class="hk-cerceve"><img id="gkUyduImg" src="${objeUrl}" width="${kt.gen}" height="${kt.yuk}" alt="${U.kacis(K.ad)} uydu görüntüsü, ${U.saat(g.zaman)}; konumun ortada, artı işaretiyle" decoding="async"><span class="hk-arti" aria-hidden="true"></span></div>
      <figcaption class="kucuk"><b>Görüntü saati ${U.saat(g.zaman)}</b> (${U.gun(g.zaman)}). Uydu görüntüleri 20–30 dakika gecikmeli gelir. ${g.eski ? eskiNot(g.zaman) : ''}</figcaption></figure>
      <p class="kucuk hk-lejant okunur">${lejant}${uyduTur === 'kizilotesi' ? ' <a href="#ders/d44">Ders: Dünya: Bir Gezegen Olarak (sera etkisi, kızılötesi)</a>' : ''}</p>
      ${maskeNot ? `<p class="soluk kucuk">${maskeNot}</p>` : ''}
      <p class="kaynak">${atif}</p>`;
    kap.querySelectorAll('[data-uydu]').forEach(b => b.addEventListener('click', () => { uyduTur = b.dataset.uydu; U.yaz('uyduTur', uyduTur); uyduYaz(kap, ctx); }));
  }

  /* Tahmin güveni kartı */
  async function guvenYaz(kap, ctx) {
    const { enlem, boylam, bas, son } = ctx;
    let ens = null, mdl = null;
    await Promise.all([
      ensembleGetir(enlem, boylam).then(x => { ens = x; }, () => {}),
      modellerGetir(enlem, boylam).then(x => { mdl = x; }, () => {})
    ]);
    const saatler = ens && ensembleSay(ens.j, bas, son);
    /* modeller: gecenin başı, ortası, sonu (tam saat) */
    const ornek = [];
    for (let t = Math.ceil(bas.getTime() / 3600e3) * 3600e3; t <= son.getTime(); t += 3 * 3600e3) ornek.push(new Date(t));
    const modeller = mdl && ornek.length ? modelTahmin(mdl.j, ornek) : null;
    if (!saatler && !modeller) { kap.hidden = true; kap.innerHTML = ''; return; }
    let html = '<h3 class="hk-bas okunur" data-ses="Tahmin güveni.">Tahmin güveni</h3>';
    if (saatler) {
      const enIyi = saatler.reduce((a, b) => (b.acik / b.toplam > a.acik / a.toplam ? b : a));
      const ort = saatler.reduce((s, x) => s + x.acik / x.toplam, 0) / saatler.length;
      const ozetMetin = `${U.saat(enIyi.t)}: ${enIyi.toplam} senaryodan ${enIyi.acik}'${ekI(enIyi.acik)} açık diyor`;
      html += `<p class="oz-satir okunur" data-ses="${U.kacis('Tahmin güveni. Bu gecenin en umutlu saati ' + ozetMetin + '. Gece boyunca senaryoların ortalama yüzde ' + Math.round(ort * 100) + ' kadarı açık.')}"><span class="oz-et">Senaryolar</span><span class="oz-d" id="gkGuvenOzet"><strong>${ozetMetin}</strong><span class="oz-not">En umutlu saat. Gece boyunca ortalama %${Math.round(ort * 100)}. "Açık" = bulut %30'un altında.</span></span></p>`;
      html += '<ol class="hk-ens" aria-label="Saat saat açık diyen senaryo sayısı">' + saatler.map(s => {
        const o = s.acik / s.toplam;
        const metin = `${U.saat(s.t)}: ${s.toplam} senaryodan ${s.acik}'${ekI(s.acik)} açık diyor`;
        return `<li data-saat="${s.t.toISOString()}" data-acik="${s.acik}" data-toplam="${s.toplam}"><span class="hk-ens-saat">${U.saat(s.t)}</span><span class="hk-ens-iz" aria-hidden="true"><span class="hk-ens-dolu" style="width:${Math.round(o * 100)}%"></span></span><span class="hk-ens-sayi">${s.acik}/${s.toplam}</span><span class="gorsel-gizli">${metin}</span></li>`;
      }).join('') + '</ol>';
      html += `<p class="soluk kucuk">Senaryo: aynı hava modelinin başlangıç koşulları biraz değiştirilerek tekrar tekrar çalıştırılmış hâli (ECMWF 51, ICON 40, GFS 31, GEM 21, UKMO 18 senaryo). Çoğu açık diyorsa tahmin güvenilir; yarı yarıya bölünüyorsa belirsiz. ${ens.eski ? eskiNot(ens.alindi) : ''}</p>`;
    }
    if (modeller) {
      html += `<table class="hk-model"><caption class="kucuk soluk">Modeller tek tek: bulut oranı</caption><thead><tr><th scope="col">Model</th>${ornek.map(t => `<th scope="col">${U.saat(t)}</th>`).join('')}</tr></thead><tbody>` +
        modeller.map(m => `<tr data-model="${m.model}"><th scope="row">${m.ad}</th>${m.deger.map(v => `<td class="${v == null ? '' : v < ACIK_ESIK ? 'iyi' : v >= 70 ? 'uyari' : ''}">${v == null ? '—' : '%' + Math.round(v)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
      if (mdl.eski) html += `<p class="soluk kucuk">${eskiNot(mdl.alindi)}</p>`;
    }
    html += `<p class="kaynak">${OM} Ensemble API ve modeller. 3 saatte bir yenilenir.</p>`;
    kap.hidden = false; kap.innerHTML = html;
  }
  /* Belirtme hâli eki (okunuşa uyar): 40'ı, 3'ü, 1'i, 6'yı, 2'yi, 100'ü, 0'ı */
  const SON_SOZ = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
  const ONLAR = { 1: 'on', 2: 'yirmi', 3: 'otuz', 4: 'kırk', 5: 'elli', 6: 'altmış', 7: 'yetmiş', 8: 'seksen', 9: 'doksan' };
  function ekI(n) {
    n = Math.round(Number(n)); let soz;
    if (n === 0) soz = 'sıfır'; else if (n % 1000 === 0) soz = 'bin'; else if (n % 100 === 0) soz = 'yüz'; else if (n % 10 === 0) soz = ONLAR[(n % 100) / 10]; else soz = SON_SOZ[n % 10];
    const v = soz.match(/[aeıioöuü](?=[^aeıioöuü]*$)/)[0];
    return (/[aeıioöuü]$/.test(soz) ? 'y' : '') + { a: 'ı', ı: 'ı', o: 'u', u: 'u', e: 'i', i: 'i', ö: 'ü', ü: 'ü' }[v];
  }

  /* Şeffaflık, çiğ, hissedilen sıcaklık, rüzgâr, sis */
  async function seffafYaz(kap, ctx) {
    const { enlem, boylam, bas, son, havaSaatler } = ctx;
    let aq = null;
    try { aq = await aqGetir(enlem, boylam); } catch (e) { aq = null; }
    const a = aq && aqGece(aq.j, bas, son);
    /* v45: gece ortalaması AOD görünürlük hesabının sönümleme katsayısına girer (gozlem.js dinler) */
    const yeniAod = a ? a.aod : null;
    if (window.HavaKart && window.HavaKart.sonAod !== yeniAod) { window.HavaKart.sonAod = yeniAod; try { document.dispatchEvent(new CustomEvent('urania:aod')); } catch (h) { /* eski tarayıcı */ } }
    const gece = (havaSaatler || []).filter(s => s.t >= new Date(bas.getTime() - 30 * 60e3) && s.t <= new Date(son.getTime() + 30 * 60e3));
    const satir = [];
    if (a) {
      const k = a.kadir;
      satir.push({ et: 'Şeffaflık', id: 'gkSeffaflik', gor: `Bu gece havadaki toz ve pus (aerosol) yüzünden yıldızlar başucunda yaklaşık <strong>${U.sayi(k, 2)} kadir</strong> sönük.<span class="oz-not">Aerosol optik derinliği ${U.sayi(a.aod, 2)} (550 nm, gece ortalaması); Beer–Lambert: kayıp ≈ 1,086 × AOD kadir. Ufka yakın yıldızlarda kayıp daha büyüktür.${a.toz != null && a.toz >= 1 ? ` Yerde (10 m) Sahra tozu en çok ${U.sayi(a.toz, 0)} μg/m³.` : ''}</span>`,
        ses: `Şeffaflık: bu gece havadaki toz ve pus yüzünden yıldızlar başucunda yaklaşık ${U.sayi(k, 2)} kadir sönük.` });
    }
    if (gece.length && gece.some(s => Number.isFinite(s.ciy))) {
      const cig = cigSaatleri(gece);
      const ruz = cig.length ? cig : gece;
      const r = ruz.filter(s => Number.isFinite(s.ruzgar));
      const ruzMetin = r.length ? `rüzgâr ${Math.round(Math.min(...r.map(s => s.ruzgar)))}–${Math.round(Math.max(...r.map(s => s.ruzgar)))} km/sa` : '';
      const ilk = cig[0];
      satir.push({ et: 'Çiğ', id: 'gkCig', gor: cig.length
        ? `<strong>Dürbün camı buğulanabilir</strong>: ${U.ek(U.saat(ilk.t), 'den')} itibaren sıcaklık ile çiy noktası arası 2 °C ya da daha az, gök açık (${ruzMetin}; rüzgâr azsa buğu daha olası).<span class="oz-not">Yaklaşık kural: açık gökte yüzeyler havadan 1–2 °C soğuk olur (BAA). Hafif rüzgâr için kaynaklı bir sayısal eşik bulunamadı; rüzgâr değeri bu yüzden yanında.</span>`
        : `Buğu beklenmiyor: gece boyunca sıcaklık ile çiy noktası arası en az ${U.sayi(Math.min(...gece.filter(s => Number.isFinite(s.ciy) && Number.isFinite(s.sicaklik)).map(s => s.sicaklik - s.ciy)), 1)} °C ya da gök kapalı.<span class="oz-not">Yaklaşık kural (BAA): açık gökte yüzeyler havadan 1–2 °C soğur; fark 2 °C'ye inince cam buğulanabilir.</span>`,
        ses: cig.length ? `Çiğ: ${U.ek(U.saat(ilk.t), 'den')} itibaren dürbün camı buğulanabilir. Yaklaşık kural.` : 'Çiğ: buğu beklenmiyor.' });
    }
    const his = gece.filter(s => Number.isFinite(s.hissedilen));
    if (his.length) {
      const enAz = his.reduce((a, b) => (b.hissedilen < a.hissedilen ? b : a));
      const ruz = gece.filter(s => Number.isFinite(s.hamle));
      const hamle = ruz.length ? Math.max(...ruz.map(s => s.hamle)) : null;
      satir.push({ et: 'Hissedilen', id: 'gkHissedilen', gor: `Gece en soğuk <strong>${C(enAz.hissedilen)} °C</strong> gibi hissedilecek (${U.saat(enAz.t)}; termometrede ${C(enAz.sicaklik)} °C).${hamle != null ? `<span class="oz-not">Rüzgâr hamlesi en çok ${Math.round(hamle)} km/sa.</span>` : ''}`,
        ses: `Hissedilen sıcaklık gece en düşük ${C(enAz.hissedilen)} derece.` + (hamle != null ? ` Rüzgâr hamlesi en çok saatte ${Math.round(hamle)} kilometre.` : '') });
    }
    const gor = gece.filter(s => Number.isFinite(s.gorus));
    if (gor.length) {
      const enAz = gor.reduce((a, b) => (b.gorus < a.gorus ? b : a));
      const d = sisDurumu(enAz.gorus);
      if (d) satir.push({ et: d === 'sis' ? 'Sis' : 'Pus', id: 'gkSis', uyari: true, gor: `<strong>${d === 'sis' ? 'Sis' : 'Pus'} bekleniyor</strong>: ${U.saat(enAz.t)} civarı görüş ${enAz.gorus < 1000 ? Math.round(enAz.gorus) + ' m' : U.sayi(enAz.gorus / 1000, 1) + ' km'}.<span class="oz-not">WMO: görüş 1 km'nin altında sis; 1–5 km pus.</span>`,
        ses: `${d === 'sis' ? 'Sis' : 'Pus'} bekleniyor: ${U.saat(enAz.t)} civarı görüş düşük.` });
    }
    if (!satir.length) { kap.hidden = true; kap.innerHTML = ''; return; }
    kap.hidden = false;
    kap.innerHTML = '<h3 class="hk-bas okunur" data-ses="Şeffaflık ve nem.">Şeffaflık ve nem</h3>' + satir.map(x => `<p class="oz-satir okunur${x.uyari ? ' hk-uyari' : ''}" id="${x.id}" data-ses="${U.kacis(x.ses)}"><span class="oz-et">${x.et}</span><span class="oz-d">${x.gor}</span></p>`).join('') +
      `<p class="kaynak">${a ? `Aerosol: Generated using Copernicus Atmosphere Monitoring Service information ${yil(new Date())}. Neither the European Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains. Kaynak: CAMS küresel atmosfer bileşimi tahmini (Copernicus Atmosphere Monitoring Service 2021, CAMS Atmosphere Data Store, DOI: 10.24381/04a0b097), Open-Meteo Air Quality API üzerinden; gece ortalaması ve kadir hesabı Urania'nındır. ${aq.eski ? eskiNot(aq.alindi) + ' ' : ''}` : ''}${OM}</p>`;
  }

  /* Kutup ışığı uyarısı */
  async function kpYaz(kap) {
    let k;
    try { k = await kpGetir(); } catch (e) { kap.hidden = true; kap.innerHTML = ''; return; }
    const u = kpUyari(k.j, new Date());
    if (!u || !u.uyari) { kap.hidden = true; kap.innerHTML = ''; return; }
    kap.hidden = false;
    kap.innerHTML = `<p class="hk-kp okunur" data-ses="Kutup ışığı uyarısı: önümüzdeki üç günde Kp ${U.sayi(u.enCok, 1)} bekleniyor. Kuzey ufkunda, şehir ışıklarından uzakta, telefon kamerasıyla bakmaya değer; İstanbul'dan çok nadir görülür."><b>Kutup ışığı olasılığı</b> · Önümüzdeki 3 günde tahmini Kp <strong>${U.sayi(u.enCok, 1)}</strong> (${U.gun(u.zaman)} ${U.saat(u.zaman)}). Kuzey ufkunda, şehir ışıklarından uzakta, telefon kamerasıyla bakmaya değer; İstanbul'dan çok nadir görülür.
      <span class="kaynak">Kp tahmini: NOAA Uzay Hava Tahmin Merkezi (SWPC), kamu malı veri; uyarıyı Urania hesaplar, NOAA'nın değildir. ${k.eski ? eskiNot(k.alindi) : ''}</span></p>`;
  }

  /* Ana giriş: gozlem.js her gece hesabında çağırır */
  let sira = 0;
  function yaz(el, ctx) {
    const s = ++sira;
    const kpKap = el.querySelector('#gkKp'), uKap = el.querySelector('#gkUydu'), gKap = el.querySelector('#gkGuven'), sKap = el.querySelector('#gkSeffaf');
    if (!kpKap) return;
    if (!ctx || !ctx.bas || !ctx.son) { [kpKap, uKap, gKap, sKap].forEach(k => { k.hidden = true; k.innerHTML = ''; }); return; }
    const guard = f => (...a) => (s === sira ? f(...a) : null);
    /* uydu ve Kp yalnız "bu gece" (canlı) için: başka gecenin "şu an" görüntüsü anlamsız */
    if (ctx.canli) { guard(kpYaz)(kpKap); guard(uyduYaz)(uKap, ctx); } else { [kpKap, uKap].forEach(k => { k.hidden = true; k.innerHTML = ''; }); }
    guard(guvenYaz)(gKap, ctx);
    guard(seffafYaz)(sKap, ctx);
  }
  /* 7 gecelik şerit için ortak gece kararı (gozlem.js kararYaz ile aynı ölçüt) */
  function geceKarari(oz) {
    if (!oz || typeof oz !== 'object') return null;
    const n = oz.ls.length, a = oz.acik;
    let seviye, neden;
    if (a && a.n >= n - 1) { seviye = 'iyi'; neden = 'gece boyunca açık'; }
    else if (a && a.n >= 2) { seviye = 'iyi'; neden = `${U.saat(a.bas)}–${U.saat(new Date(a.son.getTime() + 3600e3))} açık`; }
    else if (oz.ort >= 70) { seviye = 'kotu'; neden = `kapalı (bulut %${Math.round(oz.ort)})`; }
    else { seviye = 'idare'; neden = `parçalı (bulut %${Math.round(oz.ort)})`; }
    if (oz.yagis && oz.yagis.riskli && oz.yagis.riskli.length >= Math.ceil(n / 2)) { seviye = 'kotu'; neden += ', yağış riski'; }
    return { seviye, ad: { iyi: 'iyi', idare: 'idare eder', kotu: 'kötü' }[seviye], neden };
  }

  window.HavaKart = {
    yaz, geceKarari, sonAod: null,
    hesap: { kutu, sonZaman, haritaUrl, maskeUrl, maskeSinif, ensembleSay, modelTahmin, aodKadir, aqGece, cigSaatleri, sisDurumu, kpUyari, senaryoDizileri, ekI },
    sabit: { ENS_MODEL, TEK_MODEL, ACIK_ESIK, SIS, PUS, KADIR_TAU, KATMAN, UYDU_ONBELLEK }
  };
})();
