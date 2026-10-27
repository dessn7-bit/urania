/* uydu.js — Uzay istasyonları (ISS, Tiangong) ve yeni fırlatılmış Starlink dizileri.
   Yörünge öğeleri CelesTrak'tan OMM/JSON olarak (TLE biçimi 99999'dan büyük katalog
   numaralarını taşıyamıyor); yörünge SGP4 ile (satellite.js 6, MIT) cihazda hesaplanır.
   Görünür geçiş: uydu ufkun ≥10° üstünde, Güneş ışığı alıyor ve gözlemcide Güneş −6°'nin
   altında (gökyüzü yeterince karanlık; Heavens-Above da aynı eşiği kullanır). Gölge silindir modeliyle.
   CelesTrak kuralları (gp-data-formats, 2026-06-23): veri 2 saatte bir güncellenir, aynı veri
   ikinci kez indirilirse 403 döner, hatalar birikince IP engellenir. Bu yüzden: 12 saat önbellek,
   200 dışı yanıtta 2 saat yeniden denememe. Kaynaklar: arastirma/uydu_kaynaklar.md */
(function () {
  'use strict';
  const U = window.Urania, G = window.Gok;
  const DER = Math.PI / 180;
  const GP = 'https://celestrak.org/NORAD/elements/gp.php?';
  const TAZE = 12 * 3600e3;              // önbellek bu kadar tazeyken yeniden indirme
  const HATA_BEKLE = 2 * 3600e3;         // başarısız istekten sonra bu kadar deneme
  const EN_ESKI = 14 * 86400e3;          // bundan eski öğelerle tahmin güvenilmez
  const YER_R = 6378.137;                // km, WGS-84 ekvator yarıçapı
  const MU = 398600.4418;                // km³/s², Dünya'nın kütleçekim parametresi (WGS-84)

  /* İstasyonlar: CelesTrak "stations" grubu (20 nesne, ~8 KB). İçsel parlaklık Heavens-Above
     (1000 km uzaklıkta, %50 aydınlık): ISS −1,8, Tiangong 0,0 kadir. */
  try { U.sil('tle_iss'); } catch (e) { /* v10'un ISS TLE önbelleği: artık kullanılmıyor */ }

  const ISTASYONLAR = [
    { id: 'iss', norad: 25544, ad: 'Uzay İstasyonu (ISS)', kisa: 'ISS', icsel: -1.8 },
    { id: 'css', norad: 48274, ad: 'Tiangong (Çin Uzay İstasyonu)', kisa: 'Tiangong', icsel: 0.0 }
  ];

  /* ---- İndirme (önbellekli, kurala uyan) ---- */
  const sozler = {};
  /* Depoya yazılamazsa (dolu, gizli sekme) önbellek ve hata zamanı bellekte de tutulur:
     yoksa her çağrı CelesTrak'a yeniden gider ve IP engellenebilir. */
  const bellek = {}, hataBellek = {};
  function grupGetir(grup, anahtar, isle) {
    if (!sozler[grup]) sozler[grup] = grupGetirAsil(grup, anahtar, isle).finally(() => { sozler[grup] = null; });
    return sozler[grup];
  }
  async function grupGetirAsil(grup, anahtar, isle) {
    /* Depodaki kayıt beklenen biçimde değilse yok sayılır (bozuk kayıt 12 saat "taze" sayılmasın) */
    let depodaki = U.oku(anahtar, null);
    if (!depodaki || typeof depodaki !== 'object' || !Number.isFinite(depodaki.alindi) || (depodaki.ls !== undefined && !Array.isArray(depodaki.ls)) || (depodaki.diziler !== undefined && !Array.isArray(depodaki.diziler)) || (depodaki.ls === undefined && depodaki.diziler === undefined)) depodaki = null;
    /* Cihaz saati bir ara ileri gidip düzeltildiyse "gelecekte alınmış" kayıt ve hata damgası yok sayılır
       (yoksa yıllarca taze sayılıp hiç yenilenmez) */
    const yas = x => Date.now() - x.alindi;
    const kayit = [depodaki, bellek[anahtar]].filter(x => x && yas(x) >= -60e3).sort((a, b) => b.alindi - a.alindi)[0] || null;
    let hata = Math.max(U.oku(anahtar + '_hata', 0) || 0, hataBellek[anahtar] || 0);
    if (!(Date.now() - hata >= 0)) hata = 0;
    const kullanilir = kayit && yas(kayit) < EN_ESKI;
    if (kayit && yas(kayit) < TAZE) return kayit;
    if (Date.now() - hata < HATA_BEKLE) {
      if (kullanilir) return Object.assign({ eski: true }, kayit);
      throw new Error('CelesTrak bir süre önce yanıt vermedi; 2 saat sonra yeniden denenecek');
    }
    const ad = 'CelesTrak (' + grup + ')';
    try {
      const ctl = new AbortController();
      const zs = setTimeout(() => ctl.abort(), 10000);
      let veri;
      try {
        const r = await fetch(GP + 'GROUP=' + grup + '&FORMAT=json', { signal: ctl.signal });
        if (r.status !== 200) throw new Error('HTTP ' + r.status);
        veri = await r.json();   // gövde inerken bağlantı takılırsa da zaman aşımı geçerli
      } finally { clearTimeout(zs); }
      if (!Array.isArray(veri)) throw new Error('beklenmeyen yanıt');
      const yeni = Object.assign({ alindi: Date.now() }, isle(veri));
      bellek[anahtar] = yeni;
      U.yaz(anahtar, yeni);
      if (window.Tani) Tani.servis(ad, 'tamam');
      return yeni;
    } catch (e) {
      hataBellek[anahtar] = Date.now();
      U.yaz(anahtar + '_hata', Date.now());
      if (window.Tani) Tani.servis(ad, 'hata', e.message);
      if (kullanilir) return Object.assign({ eski: true }, kayit);
      throw e;
    }
  }

  /* OMM'den ortalama yükseklik (km): a = (μ/n²)^(1/3) − R */
  function yukseklik(omm) {
    const n = omm.MEAN_MOTION * 2 * Math.PI / 86400;
    return Math.cbrt(MU / (n * n)) - YER_R;
  }

  /* Yeni Starlink dizileri: "last-30-days" grubundan (~120 KB). Bir fırlatmanın uyduları
     ≥10 tane, ortanca yükseklikleri 357 km'nin altında (Mallama ve ark. 2024: bu yükseklikte
     ortalama 2,7 kadir; yükseldikten sonra 6,5) ve hâlâ birbirine yakınsa (yörüngede
     ortanca açıklık ≤25°) "dizi" sayılır. Temsilci: yüksekliği ortanca olan uydu. */
  const DIZI_YUKSEKLIK = 357, DIZI_ACIKLIK = 25;
  function dizileriAyikla(veri, simdi) {
    const gruplar = {};
    veri.forEach(o => {
      if (!/^STARLINK/.test(o.OBJECT_NAME || '') || !o.OBJECT_ID) return;
      (gruplar[o.OBJECT_ID.slice(0, 8)] = gruplar[o.OBJECT_ID.slice(0, 8)] || []).push(o);
    });
    const t = simdi || new Date();
    const diziler = [];
    Object.keys(gruplar).forEach(kod => {
      const ls = gruplar[kod];
      if (ls.length < 10) return;
      const yuk = ls.map(yukseklik).sort((a, b) => a - b);
      const orta = yuk[Math.floor(yuk.length / 2)];
      if (orta >= DIZI_YUKSEKLIK) return;
      /* Aynı anda konumlar: ağırlık merkezinden ortanca açı */
      const p = ls.map(o => { try { const r = satellite.propagate(satellite.json2satrec(o), t); return r && r.position; } catch (h) { return null; } }).filter(Boolean);
      if (p.length < 10) return;
      const m = p.reduce((a, v) => [a[0] + v.x, a[1] + v.y, a[2] + v.z], [0, 0, 0]);
      const mn = Math.hypot(m[0], m[1], m[2]);
      const acilar = p.map(v => Math.acos(Math.max(-1, Math.min(1, (v.x * m[0] + v.y * m[1] + v.z * m[2]) / mn / Math.hypot(v.x, v.y, v.z)))) / DER).sort((a, b) => a - b);
      const acik = acilar[Math.floor(acilar.length / 2)];
      if (acik > DIZI_ACIKLIK) return;
      const temsil = ls.slice().sort((a, b) => Math.abs(yukseklik(a) - orta) - Math.abs(yukseklik(b) - orta))[0];
      const periyotDk = 1440 / temsil.MEAN_MOTION;
      diziler.push({ kod, adet: ls.length, yukseklik: Math.round(orta), aralikDk: Math.round(acilar[acilar.length - 1] / 360 * periyotDk * 2), omm: temsil });
    });
    return diziler;
  }

  /* Tüm uydular: [{id, ad, kisa, omm, alindi, eski, dizi?}] — biri alınamazsa ötekiler yine gelir */
  async function uydular() {
    const [ist, yeni] = await Promise.allSettled([
      grupGetir('stations', 'gp_istasyon', v => ({ ls: v.filter(o => ISTASYONLAR.some(s => s.norad === o.NORAD_CAT_ID)) })),
      grupGetir('last-30-days', 'gp_dizi', v => ({ diziler: dizileriAyikla(v), ham: v.filter(o => /^STARLINK/.test(o.OBJECT_NAME || '')) }))
    ]);
    const ls = [];
    if (ist.status === 'fulfilled') {
      ISTASYONLAR.forEach(s => {
        const omm = ist.value.ls.find(o => o.NORAD_CAT_ID === s.norad);
        if (omm) ls.push(Object.assign({ omm, alindi: ist.value.alindi, eski: !!ist.value.eski }, s));
      });
    }
    if (yeni.status === 'fulfilled') {
      /* Diziler birkaç günde dağılır: önbellekteki veri bir günden eskiyse dizi ölçütü bugünkü konumlarla yeniden sınanır */
      const yv = yeni.value;
      const diziler = Date.now() - yv.alindi > 86400e3 && Array.isArray(yv.ham) ? dizileriAyikla(yv.ham) : yv.diziler;
      diziler.forEach(d => ls.push({ id: 'dizi-' + d.kod, ad: 'Starlink dizisi (' + d.kod + ' fırlatması)', kisa: 'Starlink', omm: d.omm,
        dizi: { adet: d.adet, yukseklik: d.yukseklik, aralikDk: d.aralikDk }, alindi: yeni.value.alindi, eski: !!yeni.value.eski }));
    }
    if (!ls.length && ist.status !== 'fulfilled') throw (ist.reason || new Error('yörünge verisi yok'));
    if (!ls.length && yeni.status !== 'fulfilled') throw (yeni.reason || new Error('yörünge verisi yok'));
    /* Bir grup alınamadıysa liste bunu söylesin ("görünür geçiş yok" yanıltmasın) */
    ls.eksik = [];
    if (ist.status !== 'fulfilled') ls.eksik.push('ISS ve Tiangong');
    if (yeni.status !== 'fulfilled') ls.eksik.push('Yeni Starlink dizileri');
    return ls;
  }

  /* OMM EPOCH "2026-10-27T04:14:31.558560" (UTC, saat dilimi yazılmaz) */
  function donem(uydu) {
    const e = String(uydu.omm.EPOCH);
    return new Date(/Z$/.test(e) ? e : e + 'Z');
  }

  const satrecler = {};
  function satrec(uydu) {
    const k = uydu.id + '|' + uydu.omm.EPOCH;
    return satrecler[k] || (satrecler[k] = satellite.json2satrec(uydu.omm));
  }

  /* Anlık parlaklık (kadir): m = içsel + 5·log10(d / 1000 km) − 2,5·log10(2·(1 − φ/π)), φ faz açısı
     (Güneş–uydu–gözlemci). Uzaklık terimi ve "%50 aydınlık = φ 90°" tanımı birçok kaynakta ortak
     (Matson/SeeSat-L, Karpov & Peloton 2022, Mallama 2021). Faz terimi için yayımlanmış modeller
     (Lambert küre, (1+cos φ)/2) Heavens-Above'ın verdiği değerlerden 0,7–1,5 kadir sapıyor; bu doğrusal
     terim ise 40 Heavens-Above noktasında 0,04 kadir ortalama sapmayla aynı sonucu veriyor
     (arastirma/uydu_parlaklik.md). Yani bu bir fizik yasası değil, Heavens-Above ile uyumlu bir tahmin;
     uydunun duruşu bilinmediği için HA da değerlerini "kaba yol gösterici" sayıyor. */
  function parlaklik(icsel, r, s, gd, gmst, uzaklik) {
    const o = satellite.ecfToEci(satellite.geodeticToEcf(gd), gmst);
    const ob = [o.x - r.x, o.y - r.y, o.z - r.z], n = Math.hypot(ob[0], ob[1], ob[2]);
    const cosf = (ob[0] * s[0] + ob[1] * s[1] + ob[2] * s[2]) / n;
    const fi = Math.acos(Math.max(-1, Math.min(1, cosf)));
    const k = 2 * (1 - fi / Math.PI);
    return k > 1e-6 ? icsel + 5 * Math.log10(uzaklik / 1000) - 2.5 * Math.log10(k) : null;
  }

  function durumHesapla(sat, gd, t, yalnizYon, icsel) {
    const pv = satellite.propagate(sat, t);
    if (!pv || !pv.position) return null;
    const gmst = satellite.gstime(t);
    const la = satellite.ecfToLookAngles(gd, satellite.eciToEcf(pv.position, gmst));
    if (yalnizYon) return { t, alt: la.elevation / DER, az: la.azimuth / DER };
    /* Güneş ışığı: Güneş yönüne izdüşüm ve gölge silindirine uzaklık.
       Güneş yönü J2000'den tarihin ekvatoruna döndürülür (SGP4 konumu TEME: tarihin ekvatoru) */
    const g = G.A.RotateVector(G.A.Rotation_EQJ_EQD(t), G.A.GeoVector('Sun', t, true));
    const gl = Math.hypot(g.x, g.y, g.z);
    const s = [g.x / gl, g.y / gl, g.z / gl];
    const r = pv.position;
    const izd = r.x * s[0] + r.y * s[1] + r.z * s[2];
    const dik = Math.hypot(r.x - izd * s[0], r.y - izd * s[1], r.z - izd * s[2]);
    const isikli = izd > 0 || dik > YER_R;
    const d = { t, alt: la.elevation / DER, az: la.azimuth / DER, isikli, uzaklik: la.rangeSat };
    if (icsel != null && isikli) d.kadir = parlaklik(icsel, r, s, gd, gmst, la.rangeSat);
    return d;
  }
  function yerKonum(konum) { return { latitude: konum.enlem * DER, longitude: konum.boylam * DER, height: (konum.yukseklik || 0) / 1000 }; }

  /* Gelecek `gun` gün içindeki geçişler (ufkun 10° üstü) */
  function gecisler(uydu, konum, bas, gun) {
    const sat = satrec(uydu);
    const gd = yerKonum(konum);
    const gzl = G.gozlemci(konum.enlem, konum.boylam, konum.yukseklik || 0);
    const ESIK = 10, ADIM = 20e3;
    const son = bas.getTime() + gun * 86400e3;
    const ls = [];
    let gecis = null;
    for (let ms = bas.getTime(); ms <= son; ms += ADIM) {
      const d = durumHesapla(sat, gd, new Date(ms), true); // kaba tarama: gölge hesabı gereksiz
      if (!d) continue;
      if (d.alt >= ESIK) {
        if (!gecis) gecis = { noktalar: [] };
        gecis.noktalar.push(d);
      } else if (gecis) {
        ls.push(gecis); gecis = null;
      }
    }
    if (gecis) ls.push(gecis);
    /* Her geçiş: 1 sn çözünürlükle başlangıç, tepe, bitiş; görünür bölüm */
    return ls.map(g => {
      const n = g.noktalar;
      const ince = (a, b) => { const out = []; for (let ms = a; ms <= b; ms += 1000) { const d = durumHesapla(sat, gd, new Date(ms), false, uydu.icsel); if (d) out.push(d); } return out; };
      const tumu = ince(n[0].t.getTime() - ADIM, n[n.length - 1].t.getTime() + ADIM).filter(d => d.alt >= ESIK);
      if (!tumu.length) return null;
      const tepe = tumu.reduce((a, d) => d.alt > a.alt ? d : a);
      /* Alacakaranlık tanımı geometrik yüksekliğe göredir (kırılma eklenmez) */
      const karanlik = d => { const e = G.A.Equator('Sun', d.t, gzl, true, true); return G.A.Horizon(d.t, gzl, e.ra, e.dec).altitude < -6; };
      const gercekGorunen = tumu.filter(d => d.isikli && karanlik(d));
      let basNeden = null, sonNeden = null;
      if (gercekGorunen.length) {
        const i = tumu.indexOf(gercekGorunen[0]), j = tumu.indexOf(gercekGorunen[gercekGorunen.length - 1]);
        basNeden = i === 0 ? 'ufuk' : (!tumu[i - 1].isikli ? 'golge' : 'karanlik');
        sonNeden = j === tumu.length - 1 ? 'ufuk' : (!tumu[j + 1].isikli ? 'golge' : 'aydinlik');
      }
      return {
        uydu, basNeden, sonNeden,
        bas: tumu[0], tepe, bitis: tumu[tumu.length - 1],
        gorunur: gercekGorunen.length > 0,
        gBas: gercekGorunen[0] || null, gBit: gercekGorunen[gercekGorunen.length - 1] || null,
        gTepe: gercekGorunen.length ? gercekGorunen.reduce((a, d) => d.alt > a.alt ? d : a) : null,
        /* görünür bölümdeki en parlak an (çoğu zaman tepeye yakın ama her zaman değil) */
        enParlak: gercekGorunen.filter(d => d.kadir != null).reduce((a, d) => (!a || d.kadir < a.kadir) ? d : a, null)
      };
    }).filter(Boolean);
  }

  function anlik(uydu, konum, t) { return durumHesapla(satrec(uydu), yerKonum(konum), t, false, uydu.icsel); }

  /* Bir penceredeki (saat) bütün geçişler ve yolları; gök levhası kaydırıcıda bunları süzer */
  function yakinGecisler(uydu, konum, bas, saat) {
    const gd = yerKonum(konum), sr = satrec(uydu);
    return gecisler(uydu, konum, bas, saat / 24).map(g => {
      const yol = [];
      for (let ms = Math.floor((g.bas.t.getTime() - 60e3) / 10e3) * 10e3; ms <= g.bitis.t.getTime() + 60e3; ms += 10e3) {
        const d = durumHesapla(sr, gd, new Date(ms)); if (d) yol.push(d);
      }
      return Object.assign({ yol }, g);
    });
  }

  /* 60 dk içinde başlayan ya da süren geçiş ve yolu (10 sn adım, tam dakikaya hizalı) */
  function yakinGecis(uydu, konum, simdi) {
    const ls = gecisler(uydu, konum, new Date(simdi.getTime() - 15 * 60e3), 75 / 1440);
    const g = ls.find(x => x.bitis.t > simdi && x.bas.t < new Date(simdi.getTime() + 60 * 60e3));
    if (!g) return null;
    const gd = yerKonum(konum), yol = [];
    for (let ms = Math.floor((g.bas.t.getTime() - 60e3) / 10e3) * 10e3; ms <= g.bitis.t.getTime() + 60e3; ms += 10e3) {
      const d = durumHesapla(satrec(uydu), gd, new Date(ms)); if (d) yol.push(d);
    }
    return Object.assign({ yol }, g);
  }

  /* Ana iş parçacığını kilitlememek için gün gün hesap; aralarda tarayıcıya nefes aldırır.
     Gün sınırına denk gelen geçişler için 20 dk örtüşme, tepe anına göre tekilleştirme. */
  async function gecislerParcali(uydu, konum, bas, gun) {
    const ls = [];
    for (let d = 0; d < gun; d++) {
      /* Her dilim 20 dk önceden başlar, sonuncusu 20 dk taşar: pencerenin iki ucunda da geçiş kesik kalmaz */
      const b = new Date(bas.getTime() + d * 86400e3 - 20 * 60e3);
      /* Dilim kenarında kesilmiş geçiş, komşu dilimdeki tamamıyla örtüşür: uzun olan kalır */
      gecisler(uydu, konum, b, 20 / 1440 + 1 + (d === gun - 1 ? 20 / 1440 : 0)).forEach(g => {
        const i = ls.findIndex(x => x.bas.t <= g.bitis.t && g.bas.t <= x.bitis.t);
        if (i < 0) ls.push(g);
        else if (g.bitis.t - g.bas.t > ls[i].bitis.t - ls[i].bas.t) ls[i] = g;
      });
      await new Promise(r => setTimeout(r, 0));
    }
    return ls.sort((a, b) => a.tepe.t - b.tepe.t);
  }

  window.Uydu = { ISTASYONLAR, uydular, dizileriAyikla, yukseklik, donem, gecisler, gecislerParcali, durumHesapla, anlik, yakinGecis, yakinGecisler };
})();
