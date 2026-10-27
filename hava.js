/* hava.js — gecenin bulut tahmini (Open-Meteo, CC BY 4.0; ticari olmayan kullanım için
   anahtar gerekmez). Yanıt cihazda 1 saat taze sayılır; ağ yoksa 48 saate kadar eski
   kayıt "son güncelleme" notuyla gösterilir. */
(function () {
  'use strict';
  const U = window.Urania;
  const TAZE = 3600e3, EN_ESKI = 48 * 3600e3;
  const DEGISKEN = 'cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,relative_humidity_2m,wind_speed_10m,precipitation_probability,precipitation';

  /* Yanıtın biçimi: hourly.time sayı dizisi; her değişken aynı uzunlukta, sayı ya da null dizisi */
  function yanitGecerli(j) {
    const h = j && j.hourly;
    if (!h || !Array.isArray(h.time) || !h.time.length || !h.time.every(Number.isFinite)) return false;
    return ['cloud_cover', 'cloud_cover_low', 'cloud_cover_mid', 'cloud_cover_high', 'relative_humidity_2m', 'wind_speed_10m']
      .every(a => Array.isArray(h[a]) && h[a].length === h.time.length && h[a].every(x => x === null || Number.isFinite(x)));
  }
  /* Bellekte de tutulur: depo doluyken her gece değişiminde yeniden istek gitmesin */
  const bellek = {};
  /* hava2_: yağış alanları eklendi; eski (yağışsız) önbellek kullanılmaz */
  function anahtar(enlem, boylam) { return 'hava2_' + enlem.toFixed(2) + '_' + boylam.toFixed(2); }

  function coz(j) {
    const h = j.hourly;
    return h.time.map((t, i) => ({
      t: new Date(t * 1000),
      bulut: h.cloud_cover[i], alcak: h.cloud_cover_low[i], orta: h.cloud_cover_mid[i], yuksek: h.cloud_cover_high[i],
      nem: h.relative_humidity_2m[i], ruzgar: h.wind_speed_10m[i],
      /* Open-Meteo: ikisi de bu saate kadarki (önceki) bir saat için — olasılık eşiği 0,1 mm */
      yagisOl: h.precipitation_probability ? h.precipitation_probability[i] : null,
      yagis: h.precipitation ? h.precipitation[i] : null
    }));
  }

  /* Hata sonrası 10 dk yeniden sorulmaz (sınır aşımı 429'da servisi yormamak için) */
  const HATA_BEKLE = 10 * 60e3;
  let sonHata = 0;
  /* Döndürür: { saatler, alindi: Date, eski: bool } ya da hata fırlatır */
  async function getir(enlem, boylam) {
    const k = anahtar(enlem, boylam);
    /* Gelecekte alınmış görünen kayıt (cihaz saati geri alındı) bayat sayılır */
    let kayit = [U.oku(k, null), bellek[k]].filter(x => x && x.j && yanitGecerli(x.j) && Date.now() - x.alindi >= -60e3).sort((a, b) => b.alindi - a.alindi)[0] || null;
    if (!(Date.now() - sonHata >= 0)) sonHata = 0;
    if (kayit && Date.now() - kayit.alindi < TAZE) return { saatler: coz(kayit.j), alindi: new Date(kayit.alindi), eski: false };
    if (Date.now() - sonHata < HATA_BEKLE) {
      if (kayit && Date.now() - kayit.alindi < EN_ESKI) return { saatler: coz(kayit.j), alindi: new Date(kayit.alindi), eski: true };
      throw new Error('servis az önce yanıt vermedi; birkaç dakika sonra yeniden denenecek');
    }
    /* Konum 2 basamakla (~1 km) gönderilir: önbellek hücresiyle aynı, gereğinden hassas değil */
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + enlem.toFixed(2) + '&longitude=' + boylam.toFixed(2) +
      '&hourly=' + DEGISKEN + '&timezone=GMT&timeformat=unixtime&forecast_days=3';
    try {
      const ctl = new AbortController();
      const zs = setTimeout(() => ctl.abort(), 8000);
      let r, j;
      try {
        r = await fetch(url, { signal: ctl.signal });
        /* Hata gövdesi JSON olmayabilir: önce durum kodu */
        if (!r.ok) { let neden = ''; try { neden = (await r.json()).reason || ''; } catch (h) { /* gövde JSON değil */ } throw new Error('HTTP ' + r.status + (neden ? ': ' + neden : '')); }
        j = await r.json();
      } finally { clearTimeout(zs); }
      if (!j || j.error || !j.hourly) throw new Error((j && j.reason) || 'beklenmeyen yanıt');
      /* Yapı doğrulanmadan önbelleğe yazılmaz: bozuk yanıt defter kaydını ve gece özetini bozmasın */
      if (!yanitGecerli(j)) throw new Error('beklenmeyen yanıt biçimi');
      /* 48 saatten eski hava önbelleklerini sil (her ~1 km hücre ~3,5 KB) */
      U.anahtarlar('hava2_').forEach(a => { const x = U.oku(a, null); if (!x || Date.now() - x.alindi > EN_ESKI) U.sil(a); });
      U.anahtarlar('hava_').forEach(a => U.sil(a)); // eski biçim
      bellek[k] = { alindi: Date.now(), j };
      U.yaz(k, bellek[k]);
      if (window.Tani) Tani.servis('Open-Meteo (hava)', 'tamam');
      return { saatler: coz(j), alindi: new Date(), eski: false };
    } catch (e) {
      sonHata = Date.now();
      if (window.Tani) Tani.servis('Open-Meteo (hava)', 'hata', e.message);
      if (kayit && Date.now() - kayit.alindi < EN_ESKI) return { saatler: coz(kayit.j), alindi: new Date(kayit.alindi), eski: true };
      throw e;
    }
  }

  /* Bir aralıktaki saatlik değerler + en uzun açık (bulut ≤ esik) dönem */
  function geceOzeti(saatler, bas, son, esik) {
    const ls = saatler.filter(s => s.t >= new Date(bas.getTime() - 30 * 60e3) && s.t <= new Date(son.getTime() + 30 * 60e3));
    if (!ls.length) return null;
    let enIyi = null, cur = null;
    ls.forEach(s => {
      if (s.bulut <= esik) {
        if (!cur) cur = { bas: s.t, son: s.t, n: 0 };
        cur.son = s.t; cur.n++;
        if (!enIyi || cur.n > enIyi.n) enIyi = Object.assign({}, cur);
      } else cur = null;
    });
    const ort = ls.reduce((a, s) => a + s.bulut, 0) / ls.length;
    /* Yağış: en yüksek olasılık, toplam miktar ve olasılığın %40'ı aştığı saatler */
    const olas = ls.filter(s => s.yagisOl != null);
    const yagis = olas.length ? {
      enCok: Math.max(...olas.map(s => s.yagisOl)),
      toplam: olas.reduce((a, s) => a + (s.yagis || 0), 0),
      riskli: olas.filter(s => s.yagisOl >= 40)
    } : null;
    return { ls, acik: enIyi, ort, yagis };
  }

  /* Belirli bir saatin önbellekteki tahmini (defter kaydı için) */
  function saatDegeri(enlem, boylam, zaman) {
    const k = [U.oku(anahtar(enlem, boylam), null), bellek[anahtar(enlem, boylam)]].find(x => x && x.j && yanitGecerli(x.j));
    if (!k) return null;
    const h = k.j.hourly;
    /* Bulut anlık değer: en yakın saat. Yağış "önceki bir saat" için: o anı kapsayan saat = yukarı yuvarla */
    const ib = h.time.indexOf(Math.round(zaman.getTime() / 3600e3) * 3600);
    const iy = h.time.indexOf(Math.ceil(zaman.getTime() / 3600e3) * 3600);
    if (ib < 0 && iy < 0) return null;
    return { bulut: ib >= 0 ? h.cloud_cover[ib] : null, yagisOl: iy >= 0 && h.precipitation_probability ? h.precipitation_probability[iy] : null };
  }
  window.Hava = { getir, geceOzeti, saatDegeri, anahtar };
})();
