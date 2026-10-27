/* gok.js — Urania'nın hesap çekirdeği.
   Tüm konum/zaman hesapları Astronomy Engine (Don Cross, MIT) üzerinden yapılır;
   bu dosya yalnız onu uygulamanın ihtiyacına göre sarar. DOM'a dokunmaz:
   tarayıcıda window.Gok, Node'da module.exports olur (testler buradan çağırır). */
(function (kok) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports)
    ? require('./lib/astronomy.browser.min.js')
    : kok.Astronomy;

  const DER = Math.PI / 180;
  const GEZEGENLER = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  const TR_AD = {
    Sun: 'Güneş', Moon: 'Ay', Mercury: 'Merkür', Venus: 'Venüs', Mars: 'Mars',
    Jupiter: 'Jüpiter', Saturn: 'Satürn', Uranus: 'Uranüs', Neptune: 'Neptün', Pluto: 'Plüton'
  };

  function gozlemci(enlem, boylam, yukseklik) {
    return new A.Observer(enlem, boylam, yukseklik || 0);
  }

  function tarih(t) { return t ? (t.date ? t.date : t) : null; }

  /* ---- Yön ---- */
  const YONLER = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
  const YON_UZUN = { K: 'kuzey', KD: 'kuzeydoğu', D: 'doğu', GD: 'güneydoğu', G: 'güney', GB: 'güneybatı', B: 'batı', KB: 'kuzeybatı' };
  function yon(az) { return YONLER[Math.round((((az % 360) + 360) % 360) / 45) % 8]; }

  /* ---- Sabit cisimler (J2000) için hızlı ufuk dönüşümü ----
     Astronomy Engine'in EQJ→HOR dönüşüm matrisi bir kez kurulur, her yıldız
     için yalnız 3x3 çarpım yapılır. HOR çerçevesi: x kuzey, y batı, z başucu. */
  function ufukMatrisi(zaman, gzl) {
    return A.Rotation_EQJ_HOR(zaman, gzl).rot;
  }
  function birimVektor(raDer, decDer) {
    const r = raDer * DER, d = decDer * DER, c = Math.cos(d);
    return [c * Math.cos(r), c * Math.sin(r), Math.sin(d)];
  }
  /* Döndürür: {alt, az} derece; az kuzeyden saat yönünde. Kırılma eklenmez
     (harita için 0,5°'lik ufuk kırılması önemsiz; listelerde Horizon kullanılır). */
  function ufkaCevir(m, v) {
    const x = m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2];
    const y = m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2];
    const z = m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2];
    let az = -Math.atan2(y, x) / DER;
    if (az < 0) az += 360;
    return { alt: Math.asin(Math.max(-1, Math.min(1, z))) / DER, az };
  }
  function sabitAltAz(raDer, decDer, zaman, gzl) {
    const s = new A.Spherical(decDer, raDer, 1);
    const v = A.RotateVector(A.Rotation_EQJ_HOR(zaman, gzl), A.VectorFromSphere(s, zaman));
    const h = A.HorizonFromVector(v, 'normal');
    return { alt: h.lat, az: h.lon };
  }

  /* ---- Gezegen / Güneş / Ay konumu ---- */
  function cisimAltAz(cisim, zaman, gzl) {
    const eq = A.Equator(cisim, zaman, gzl, true, true);
    const h = A.Horizon(zaman, gzl, eq.ra, eq.dec, 'normal');
    return { alt: h.altitude, az: h.azimuth, ra: eq.ra, dec: eq.dec };
  }
  function takimyildiz(cisim, zaman, gzl) {
    const eqj = A.Equator(cisim, zaman, gzl, false, true);
    return A.Constellation(eqj.ra, eqj.dec).symbol;
  }

  /* ---- Gece aralığı ----
     Seçilen günün yerel öğlesinden başlayıp ertesi öğleye kadar:
     gün batımı, sivil/denizci/astronomik alacakaranlık sonu ve başlangıcı, gün doğumu. */
  /* "Bu gece"nin başladığı günün öğlesi — GÖZLEMCİNİN ortalama güneş saatine göre
     (boylam/15 saat), cihazın saat diliminden bağımsız: Tokyo seçiliyken İstanbul'daki
     telefon da Tokyo'nun gecesini hesaplar. Sabah 08:00'den önce bakılıyorsa hâlâ dün
     akşam başlayan gecedeyiz. boylam verilmezse cihazın yerel saati kullanılır. */
  function yerelOgle(gun, boylam) {
    if (boylam == null) {
      const o = new Date(gun);
      if (o.getHours() < 8) o.setDate(o.getDate() - 1);
      o.setHours(12, 0, 0, 0);
      return o;
    }
    const ofs = boylam / 15 * 3600e3;
    const s = new Date(new Date(gun).getTime() + ofs);
    if (s.getUTCHours() < 8) s.setUTCDate(s.getUTCDate() - 1);
    s.setUTCHours(12, 0, 0, 0);
    /* Tam saate yuvarla (±30 dk): kaydırıcı saatleri 21:00, 03:00 gibi okunur kalsın */
    return new Date(Math.round((s.getTime() - ofs) / 3600e3) * 3600e3);
  }
  function geceAraligi(gun, gzl) {
    const ogle = yerelOgle(gun, gzl.longitude);
    const ara = (yon, alt) => tarih(A.SearchAltitude('Sun', gzl, yon, ogle, 1.5, alt));
    const batis = tarih(A.SearchRiseSet('Sun', gzl, -1, ogle, 1.5));
    const dogus = batis ? tarih(A.SearchRiseSet('Sun', gzl, +1, batis, 1.5)) : null;
    const g = {
      ogle,
      batis,
      sivilSon: ara(-1, -6),
      denizciSon: ara(-1, -12),
      astroSon: ara(-1, -18),
      dogus
    };
    g.astroBas = g.astroSon ? tarih(A.SearchAltitude('Sun', gzl, +1, g.astroSon, 1.5, -18)) : null;
    g.sivilBas = g.sivilSon ? tarih(A.SearchAltitude('Sun', gzl, +1, g.sivilSon, 1.5, -6)) : null;
    /* Karanlık pencere: astronomik gece varsa o; yoksa (yaz ortası yüksek enlem)
       denizci, o da yoksa sivil alacakaranlık. */
    g.karanlikBas = g.astroSon || g.denizciSon || g.sivilSon || batis;
    g.karanlikSon = g.astroBas || (g.denizciSon ? tarih(A.SearchAltitude('Sun', gzl, +1, g.denizciSon, 1.5, -12)) : null) || g.sivilBas || dogus;
    return g;
  }

  /* ---- Ay ---- */
  const EVRE_ADLARI = [
    [0, 'Yeni Ay'], [1, 'Hilal (büyüyen)'], [2, 'İlk dördün'], [3, 'Şişkin Ay (büyüyen)'],
    [4, 'Dolunay'], [5, 'Şişkin Ay (küçülen)'], [6, 'Son dördün'], [7, 'Hilal (küçülen)']
  ];
  function evreAdi(aci) {
    /* Ana evreler ±7,5° (≈ ±14 saat) içinde ana adla anılır; aradakiler ara evre. */
    const yakin = (h) => Math.abs(((aci - h + 540) % 360) - 180) <= 7.5;
    if (yakin(0)) return EVRE_ADLARI[0][1];
    if (yakin(90)) return EVRE_ADLARI[2][1];
    if (yakin(180)) return EVRE_ADLARI[4][1];
    if (yakin(270)) return EVRE_ADLARI[6][1];
    if (aci < 90) return EVRE_ADLARI[1][1];
    if (aci < 180) return EVRE_ADLARI[3][1];
    if (aci < 270) return EVRE_ADLARI[5][1];
    return EVRE_ADLARI[7][1];
  }
  function ayDurumu(zaman, gzl) {
    const aci = A.MoonPhase(zaman);
    const isik = A.Illumination('Moon', zaman);
    const konum = cisimAltAz('Moon', zaman, gzl);
    /* Seçili günün öğlesinden sonraki ilk doğuş ve ilk batış: "bu gece" penceresi. */
    const bas = yerelOgle(zaman, gzl.longitude);
    const dogus = tarih(A.SearchRiseSet('Moon', gzl, +1, bas, 1.5));
    const batis = tarih(A.SearchRiseSet('Moon', gzl, -1, bas, 1.5));
    return {
      aci,
      oran: isik.phase_fraction,
      kadir: isik.mag,
      ad: evreAdi(aci),
      buyuyen: aci < 180,
      alt: konum.alt, az: konum.az,
      ra: konum.ra, dec: konum.dec,
      dogus, batis,
      takimyildiz: takimyildiz('Moon', zaman, gzl)
    };
  }
  const CEYREK_AD = ['Yeni Ay', 'İlk dördün', 'Dolunay', 'Son dördün'];
  function ayCeyrekleri(zaman, adet) {
    const sonuc = [];
    let q = A.SearchMoonQuarter(zaman);
    for (let i = 0; i < adet; i++) {
      sonuc.push({ ad: CEYREK_AD[q.quarter], zaman: tarih(q.time), ceyrek: q.quarter });
      q = A.NextMoonQuarter(q);
    }
    return sonuc;
  }

  /* ---- Bir aralıkta en yüksek irtifa (örnekleme + yerel iyileştirme) ---- */
  function enYuksek(fn, bas, son, adimDk) {
    if (!bas || !son || son <= bas) return null;
    const adim = (adimDk || 10) * 60e3;
    let enIyi = null;
    for (let t = bas.getTime(); t <= son.getTime(); t += adim) {
      const d = new Date(t);
      const k = fn(d);
      if (!enIyi || k.alt > enIyi.alt) enIyi = Object.assign({ zaman: d }, k);
    }
    const sonK = fn(son);
    if (sonK.alt > enIyi.alt) enIyi = Object.assign({ zaman: son }, sonK);
    return enIyi;
  }

  /* ---- Gezegenler: bu gece ---- */
  function gezegenlerBuGece(gun, gzl, gece) {
    const simdi = new Date(gun);
    /* Gezegenler parlak: sivil alacakaranlık sonundan başlangıcına kadar bakılır. */
    const bas = gece.sivilSon || gece.batis;
    const son = gece.sivilBas || gece.dogus;
    return GEZEGENLER.map(c => {
      const isik = A.Illumination(c, simdi);
      const k = cisimAltAz(c, simdi, gzl);
      const tepe = enYuksek(d => cisimAltAz(c, d, gzl), bas, son, 10);
      const ogle = gece.ogle;
      /* Öğleden sonraki ilk doğuş; batış o doğuştan sonraki ilk batış (sıra karışmasın). */
      const dogus = tarih(A.SearchRiseSet(c, gzl, +1, ogle, 1));
      const batis = tarih(A.SearchRiseSet(c, gzl, -1, dogus || ogle, 1.5));
      const uzanim = A.AngleFromSun(c, simdi);
      return {
        cisim: c,
        ad: TR_AD[c],
        kadir: isik.mag,
        alt: k.alt, az: k.az, ra: k.ra, dec: k.dec,
        takimyildiz: takimyildiz(c, simdi, gzl),
        tepe,
        gorunur: !!(tepe && tepe.alt >= 10),
        dogus, batis,
        gunesAcisi: uzanim,
        ciplakGoz: isik.mag <= 6
      };
    });
  }

  /* ---- Sabit cisimler için gece boyu örnekleme ----
     Her örnek anı için dönüşüm matrisi BİR kez kurulur, tüm hedefler onu paylaşır. */
  function ornekler(bas, son, adimDk, gzl) {
    if (!bas || !son || son <= bas) return [];
    const ls = [];
    const adim = adimDk * 60e3;
    for (let t = bas.getTime(); t < son.getTime() + adim; t += adim) {
      const d = new Date(Math.min(t, son.getTime()));
      ls.push({ zaman: d, m: ufukMatrisi(d, gzl) });
    }
    return ls;
  }
  function enYuksekSabit(v, orn) {
    let enIyi = null;
    orn.forEach(o => {
      const h = ufkaCevir(o.m, v);
      if (!enIyi || h.alt > enIyi.alt) enIyi = { zaman: o.zaman, alt: h.alt, az: h.az };
    });
    return enIyi;
  }

  /* ---- Dürbün hedefleri: bu gece ---- */
  function hedeflerBuGece(hedefler, gzl, gece, zaman) {
    const orn = ornekler(gece.karanlikBas, gece.karanlikSon, 15, gzl);
    const mSimdi = ufukMatrisi(zaman, gzl);
    const ay = A.Equator('Moon', zaman, gzl, false, true); // J2000 — hedeflerle aynı çerçeve
    const ayV = birimVektor(ay.ra * 15, ay.dec);
    return hedefler.map(h => {
      const hv = birimVektor(h.ra, h.dec);
      const simdi = ufkaCevir(mSimdi, hv);
      const tepe = enYuksekSabit(hv, orn);
      const ayAcisi = Math.acos(Math.max(-1, Math.min(1, hv[0] * ayV[0] + hv[1] * ayV[1] + hv[2] * ayV[2]))) / DER;
      return Object.assign({}, h, { simdi, tepe, ayAcisi, gorunur: !!(tepe && tepe.alt >= 20) });
    });
  }

  /* ---- Meteor yağmurları ----
     Liste veri/meteor.json'dan gelir (IMO takvimi). Etkinlik tarih aralığı
     yıl atlayabilir (Ursidler Aralık→Ocak, Quadrantidler Aralık→Ocak). */
  function gunNo(ay, gun) { return ay * 100 + gun; }
  function aktifMi(m, zaman) {
    if (m.baslangic.length === 10) {
      /* Tam tarih (YYYY-AA-GG): o yılın takvimi, bitiş günü dahil */
      const b = new Date(m.baslangic + 'T00:00:00'), s = new Date(m.bitis + 'T23:59:59');
      return zaman >= b && zaman <= s;
    }
    const [ba, bg] = m.baslangic.split('-').map(Number);
    const [sa, sg] = m.bitis.split('-').map(Number);
    const bugun = gunNo(zaman.getMonth() + 1, zaman.getDate());
    const b = gunNo(ba, bg), s = gunNo(sa, sg);
    return b <= s ? (bugun >= b && bugun <= s) : (bugun >= b || bugun <= s);
  }
  function meteorDurumu(liste, zaman, gzl, gece) {
    const orn = gece ? ornekler(gece.karanlikBas, gece.karanlikSon, 20, gzl) : [];
    return liste.map(m => {
      const zirve = new Date(m.zirve_utc);
      const gunFark = (zirve - zaman) / 86400e3;
      let radyantTepe = null;
      if (m.radyant_ra != null && orn.length) {
        radyantTepe = enYuksekSabit(birimVektor(m.radyant_ra, m.radyant_dec), orn);
      }
      return Object.assign({}, m, { aktif: aktifMi(m, zaman), gunFark, radyantTepe });
    });
  }

  /* ---- Yaklaşan olaylar ---- */
  function olaylar(zaman, gzl, gunSayisi) {
    const son = new Date(zaman.getTime() + (gunSayisi || 120) * 86400e3);
    const ls = [];
    ayCeyrekleri(zaman, 8).forEach(q => {
      if (q.ceyrek === 0 || q.ceyrek === 2) ls.push({ tur: 'ay', zaman: q.zaman, baslik: q.ad });
    });
    /* Ay tutulması: Türkiye'den görünürlüğü, tutulmanın ortasında Ay'ın ufkun üstünde olup olmadığıyla kontrol edilir. */
    let le = A.SearchLunarEclipse(zaman);
    for (let i = 0; i < 3 && le && tarih(le.peak) < son; i++) {
      const tepe = tarih(le.peak);
      const ayAlt = cisimAltAz('Moon', tepe, gzl).alt;
      const tur = { penumbral: 'Yarıgölge ay tutulması', partial: 'Parçalı ay tutulması', total: 'Tam ay tutulması' }[le.kind] || 'Ay tutulması';
      ls.push({ tur: 'tutulma', zaman: tepe, baslik: tur, not: ayAlt > 0 ? 'Buradan görünür (tutulma ortasında Ay ufkun ' + Math.round(ayAlt) + '° üstünde).' : 'Tutulma ortasında Ay buradan ufkun altında.', gorunur: ayAlt > 0 });
      le = A.NextLunarEclipse(le.peak);
    }
    let se = A.SearchLocalSolarEclipse(zaman, gzl);
    for (let i = 0; i < 2 && se && tarih(se.peak.time) < son; i++) {
      const tur = { partial: 'Parçalı güneş tutulması', annular: 'Halkalı güneş tutulması', total: 'Tam güneş tutulması' }[se.kind] || 'Güneş tutulması';
      const alt = se.peak.altitude;
      ls.push({ tur: 'tutulma', zaman: tarih(se.peak.time), baslik: tur, not: alt > 0 ? 'Buradan görünür; en büyük anda Güneş ' + Math.round(alt) + '° yükseklikte. Güneşe asla filtresiz bakma.' : 'Buradan görünmez (Güneş ufkun altında).', gorunur: alt > 0, ortulme: se.obscuration });
      se = A.NextLocalSolarEclipse(se.peak.time, gzl);
    }
    const yil = zaman.getFullYear();
    [yil, yil + 1].forEach(y => {
      const s = A.Seasons(y);
      [['mar_equinox', 'İlkbahar ekinoksu'], ['jun_solstice', 'Yaz gündönümü'], ['sep_equinox', 'Sonbahar ekinoksu'], ['dec_solstice', 'Kış gündönümü']]
        .forEach(([k, ad]) => ls.push({ tur: 'mevsim', zaman: tarih(s[k]), baslik: ad }));
    });
    ['Mercury', 'Venus'].forEach(c => {
      const e = A.SearchMaxElongation(c, zaman);
      if (e) ls.push({ tur: 'gezegen', zaman: tarih(e.time), baslik: TR_AD[c] + ' en büyük uzanımda', not: (e.visibility === 'morning' ? 'Sabah gökyüzünde' : 'Akşam gökyüzünde') + ', Güneş\'ten ' + e.elongation.toFixed(1).replace('.', ',') + '° uzakta.' });
    });
    ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].forEach(c => {
      const t = tarih(A.SearchRelativeLongitude(c, 0, zaman));
      if (t) ls.push({ tur: 'gezegen', zaman: t, baslik: TR_AD[c] + ' karşı konumda', not: 'Bütün gece görünür, yılın en parlak ve en yakın hâli.' });
    });
    return ls.filter(o => o.zaman && o.zaman >= zaman && o.zaman <= son).sort((a, b) => a.zaman - b.zaman);
  }

  const Gok = {
    A, DER, GEZEGENLER, TR_AD, YON_UZUN,
    gozlemci, yon, ufukMatrisi, birimVektor, ufkaCevir, sabitAltAz, cisimAltAz, takimyildiz,
    yerelOgle, geceAraligi, ayDurumu, ayCeyrekleri, evreAdi, enYuksek, ornekler, enYuksekSabit, gezegenlerBuGece, hedeflerBuGece,
    meteorDurumu, aktifMi, olaylar
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Gok;
  else kok.Gok = Gok;
})(typeof self !== 'undefined' ? self : this);
