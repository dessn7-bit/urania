/* gok.js — Urania'nın hesap çekirdeği.
   Tüm konum/zaman hesapları Astronomy Engine (Don Cross, MIT) üzerinden yapılır;
   bu dosya yalnız onu uygulamanın ihtiyacına göre sarar. DOM'a dokunmaz:
   tarayıcıda window.Gok, Node'da module.exports olur (testler buradan çağırır). */
(function (kok) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports)
    ? require('./lib/astronomy.browser.min.js')
    : kok.Astronomy;

  /* ΔT = TT − UT1 (saniye). Astronomy Engine'in varsayılanı (Espenak–Meeus 2006 polinomu) 2026 için
     ≈75,6 sn veriyor; gerçek değer ≈69,2 sn. Fark Ay'ı ≈3″ kaydırır, örtme saatlerini ≈6 sn.
     IERS Bulletin A (Vol. XXXIX No. 043, 22 Ekim 2026; datacenter.iers.org, maia.usno.navy.mil):
     TT = TAI + 32,184 sn; TAI − UTC = 37 sn (1 Ocak 2017'den beri; Aralık 2026'da artık saniye yok);
     UT1 − UTC = −0,1106 − 0,00040·(MJD − 61342) sn (bültenin uzatma formülü; ±0,03 sn'lik
     mevsimsel UT2−UT1 terimi ihmal). Formül yalnız MJD 61000–62200 (Kas 2025 – Şub 2029) aralığında;
     dışında kütüphanenin varsayılanı. ut: J2000'den bu yana UT gün. */
  const DT_VARSAYILAN = A.DeltaT_EspenakMeeus;
  A.SetDeltaTFunction(ut => {
    const mjd = ut + 51544.5;
    if (mjd >= 61000 && mjd <= 62200) return 32.184 + 37 - (-0.1106 - 0.00040 * (mjd - 61342));
    return DT_VARSAYILAN(ut);
  });

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
    /* Bütün geçişler bu gecenin içinde olmalı (öğleden ertesi öğleye): yüksek enlemde eşiğe o gece ulaşılmazsa
       arama ertesi gecenin geçişini bulmasın. */
    const sinir = ogle.getTime() + 86400e3;
    const icinde = t => (t && t.getTime() < sinir ? t : null);
    const ara = (yon, alt) => icinde(tarih(A.SearchAltitude('Sun', gzl, yon, ogle, 1, alt)));
    const batis = icinde(tarih(A.SearchRiseSet('Sun', gzl, -1, ogle, 1)));
    const dogus = batis ? icinde(tarih(A.SearchRiseSet('Sun', gzl, +1, batis, 1))) : null;
    const g = {
      ogle,
      batis,
      sivilSon: ara(-1, -6),
      denizciSon: ara(-1, -12),
      astroSon: ara(-1, -18),
      dogus
    };
    g.astroBas = g.astroSon ? icinde(tarih(A.SearchAltitude('Sun', gzl, +1, g.astroSon, 1, -18))) : null;
    g.sivilBas = g.sivilSon ? icinde(tarih(A.SearchAltitude('Sun', gzl, +1, g.sivilSon, 1, -6))) : null;
    if (g.astroSon && !g.astroBas) g.astroSon = null;      // eşiğin altına inip çıkışı bu gece değilse yok say
    if (g.sivilSon && !g.sivilBas) g.sivilSon = null;
    /* Karanlık pencere: astronomik gece varsa o; yoksa (yaz ortası yüksek enlem)
       denizci, o da yoksa sivil alacakaranlık. */
    g.karanlikBas = g.astroSon || g.denizciSon || g.sivilSon || batis;
    g.karanlikSon = g.astroBas || (g.denizciSon ? icinde(tarih(A.SearchAltitude('Sun', gzl, +1, g.denizciSon, 1, -12))) : null) || g.sivilBas || dogus;
    if (g.karanlikBas && g.karanlikSon && g.karanlikSon <= g.karanlikBas) { g.karanlikBas = null; g.karanlikSon = null; }
    /* Gök sivil alacakaranlığın ötesine hiç geçmiyorsa derin gök hedefleri için karanlık yok */
    g.karanlikYok = !g.sivilSon;
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
    const ic = t => (t && t.getTime() < bas.getTime() + 86400e3 ? t : null);
    const dogus = ic(tarih(A.SearchRiseSet('Moon', gzl, +1, bas, 1)));
    const batis = ic(tarih(A.SearchRiseSet('Moon', gzl, -1, bas, 1)));
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

  /* ---- Gezegen parlaklığı (kadir) ----
     Mallama ve Hilton 2018, "Computing apparent planetary magnitudes for The Astronomical Almanac",
     Astronomy and Computing 25, 10–24 (arXiv:1808.01973), denklem 2–17; JPL Horizons ve Astronomical Almanac
     bu modeli kullanır. Katsayılar makaleden ve Skyfield 1.55 magnitudelib uygulamasından karşılaştırıldı.
     Mars'ın dönme/mevsim düzeltmesi (±0,06 kadir) Skyfield'deki gibi dahil değil. Satürn halkalı model α ≤ 6,5°
     için geçerli (Dünya'dan bakınca hep öyle); geçerlilik dışında Astronomy Engine'in değeri kullanılır. */
  const SATURN_KUTUP = [0.08547883, 0.07323576, 0.99364475];   // IAU kutbu α0 = 40,589°, δ0 = 83,537° (J2000)
  const URANUS_KUTUP = [-0.21199958, -0.94155916, -0.26176809]; // IAU kutbu α0 = 257,311°, δ0 = −15,175°
  const uzun = v => Math.hypot(v[0], v[1], v[2]);
  const aciArasi = (a, b) => Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / uzun(a) / uzun(b)))) / DER;
  function gezegenKadir(c, t) {
    const yedek = () => A.Illumination(c, t).mag;
    try {
      const g = A.GeoVector(c, t, true), gv = [g.x, g.y, g.z];
      /* Işık süresi kadar önceki güneş merkezli konum (gözlenen an) */
      const h = A.HelioVector(c, new Date(t.getTime() - uzun(gv) * 499.004784e3)), hv = [h.x, h.y, h.z];
      const r = uzun(hv), d = uzun(gv), a = aciArasi(hv, gv);
      const L = 5 * Math.log10(r * d);
      switch (c) {
        case 'Mercury': return L - 0.613 + 6.3280e-02 * a - 1.6336e-03 * a ** 2 + 3.3644e-05 * a ** 3 - 3.4265e-07 * a ** 4 + 1.6893e-09 * a ** 5 - 3.0334e-12 * a ** 6;
        case 'Venus': return a <= 163.7 ? L - 4.384 - 1.044e-03 * a + 3.687e-04 * a ** 2 - 2.814e-06 * a ** 3 + 8.938e-09 * a ** 4
          : L + 236.05828 - 2.81914 * a + 8.39034e-03 * a ** 2;
        case 'Mars': return a <= 50 ? L - 1.601 + 0.02267 * a - 0.0001302 * a ** 2 : L - 0.367 - 0.02573 * a + 0.0003445 * a ** 2;
        case 'Jupiter': {
          if (a <= 12) return L - 9.395 - 3.7e-04 * a + 6.16e-04 * a ** 2;
          const x = a / 180;
          return L - 9.428 - 2.5 * Math.log10(1 - 1.507 * x - 0.363 * x ** 2 - 0.062 * x ** 3 + 2.809 * x ** 4 - 1.876 * x ** 5);
        }
        case 'Saturn': {
          /* β: Güneş'in ve Dünya'nın Satürn merkezli enlemlerinin geometrik ortalaması; işaretleri zıtsa 0 */
          const bS = aciArasi(SATURN_KUTUP, hv) - 90, bE = aciArasi(SATURN_KUTUP, gv) - 90;
          const b = bS * bE >= 0 ? Math.sqrt(bS * bE) : 0;
          if (a > 6.5 || b > 27) return yedek();
          const sb = Math.sin(b * DER);
          return L - 8.914 - 1.825 * sb + 0.026 * a - 0.378 * sb * Math.exp(-2.25 * a);
        }
        case 'Uranus': {
          const f = (Math.abs(aciArasi(URANUS_KUTUP, hv) - 90) + Math.abs(aciArasi(URANUS_KUTUP, gv) - 90)) / 2;
          return L - 7.110 - 8.4e-04 * f + (a > 3.1 ? 6.587e-3 * a + 1.045e-4 * a ** 2 : 0);
        }
        case 'Neptune': {
          const yil = 2000 + (t.getTime() - Date.UTC(2000, 0, 1, 12)) / (365.25 * 86400e3);
          const m0 = Math.max(-7.00, Math.min(-6.89, -6.89 - 0.0054 * (yil - 1980)));
          return L + m0 + (a > 1.9 ? 7.944e-3 * a + 9.617e-5 * a ** 2 : 0);
        }
      }
    } catch (h) { /* aşağıda yedek */ }
    return yedek();
  }

  /* ---- Gezegenler: bu gece ---- */
  function gezegenlerBuGece(gun, gzl, gece) {
    const simdi = new Date(gun);
    /* Gezegenler parlak: sivil alacakaranlık sonundan başlangıcına kadar bakılır. */
    let bas = gece.sivilSon || gece.batis;
    let son = gece.sivilBas || gece.dogus;
    /* Kutup gecesi (Güneş hiç doğmuyor): bütün gün */
    if (!gece.batis && !gece.dogus && cisimAltAz('Sun', gece.ogle, gzl).alt < 0) { bas = gece.ogle; son = new Date(gece.ogle.getTime() + 86400e3); }
    return GEZEGENLER.map(c => {
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
        kadir: gezegenKadir(c, simdi),
        alt: k.alt, az: k.az, ra: k.ra, dec: k.dec,
        takimyildiz: takimyildiz(c, simdi, gzl),
        tepe,
        gorunur: !!(tepe && tepe.alt >= 10),
        dogus, batis,
        gunesAcisi: uzanim,
        ciplakGoz: gezegenKadir(c, simdi) <= 6
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
  function enYuksekSabit(v, orn, gzl) {
    let enIyi = null, i0 = -1;
    orn.forEach((o, i) => {
      const h = ufkaCevir(o.m, v);
      if (!enIyi || h.alt > enIyi.alt) { enIyi = { zaman: o.zaman, alt: h.alt, az: h.az }; i0 = i; }
    });
    /* Örnek aralığında yerel iyileştirme: 15 dk örnekleme başucu yakınında birkaç derece eksik bulabilir,
       20° eşiğinin hemen altında kalıp hedefi yanlış eleyebilir */
    if (enIyi && gzl && orn.length > 1 && (Math.abs(enIyi.alt - 20) < 2 || enIyi.alt > 75)) {   // eşik yakınında ve başucunda
      let a = orn[Math.max(0, i0 - 1)].zaman.getTime(), b = orn[Math.min(orn.length - 1, i0 + 1)].zaman.getTime();
      const f = t => ufkaCevir(ufukMatrisi(new Date(t), gzl), v);
      for (let k = 0; k < 12; k++) {
        const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3;
        if (f(m1).alt < f(m2).alt) a = m1; else b = m2;
      }
      const t = (a + b) / 2, h = f(t);
      if (h.alt > enIyi.alt) enIyi = { zaman: new Date(t), alt: h.alt, az: h.az };
    }
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
      const tepe = gece.karanlikYok ? null : enYuksekSabit(hv, orn, gzl);
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
      /* IMO tarihleri UT: sınır cihazın saat diliminden bağımsız olsun */
      const b = new Date(m.baslangic + 'T00:00:00Z'), s = new Date(m.bitis + 'T23:59:59Z');
      return zaman >= b && zaman <= s;
    }
    const [ba, bg] = m.baslangic.split('-').map(Number);
    const [sa, sg] = m.bitis.split('-').map(Number);
    const bugun = gunNo(zaman.getMonth() + 1, zaman.getDate());
    const b = gunNo(ba, bg), s = gunNo(sa, sg);
    return b <= s ? (bugun >= b && bugun <= s) : (bugun >= b || bugun <= s);
  }
  /* ---- Meteor takvimi: verideki son yıldan sonrası ----
     IMO zirveyi Güneş boylamıyla (λ☉, J2000 ekinoksu) verir; yağmurun zirvesi her yıl aşağı yukarı aynı λ☉'dadır.
     Verinin bittiği yıldan sonraki yıllar için zirve, son yılın λ☉ değerinden hesaplanır (Draconid gibi düzensiz
     yağmurların gücü değişebilir; IMO o yılın takvimini yayımlayınca veri yenilenmeli). Etkinlik aralığı aynı
     ay-güne kaydırılır. */
  function gunesBoylamJ2000(t) {
    const v = A.GeoVector('Sun', t, true), e = 23.4392911 * DER;   // J2000 ekliptiğinin eğikliği
    return ((Math.atan2(v.y * Math.cos(e) + v.z * Math.sin(e), v.x) / DER) % 360 + 360) % 360;
  }
  function boylamAni(lam, yaklasik) {
    const f = t => ((gunesBoylamJ2000(new Date(t)) - lam + 540) % 360) - 180;
    let a = yaklasik.getTime() - 6 * 86400e3, b = yaklasik.getTime() + 6 * 86400e3;
    if (f(a) * f(b) > 0) return null;
    for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; }
    return new Date(Math.round((a + b) / 2 / 60e3) * 60e3);
  }
  const meteorOnbellek = new Map();
  function meteorTakvimi(veri, zaman) {
    const ls = veri.yagmurlar;
    const yil = m => new Date(m.zirve_utc).getUTCFullYear();
    const sonYil = Math.max(...ls.map(yil)), ilkYil = Math.min(...ls.map(yil));
    const y0 = new Date(zaman).getUTCFullYear() - 1, y1 = y0 + 2;   // seçili yılın bir öncesi ve sonrası
    if (y1 <= sonYil && y0 >= ilkYil) return ls;
    const an = ilkYil + '|' + sonYil + '|' + y0;
    if (meteorOnbellek.has(an)) return meteorOnbellek.get(an);
    const kaydir = (s, k) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCFullYear(d.getUTCFullYear() + k); return d.toISOString().slice(0, 10); };
    const ek = [];
    /* İleriye son veri yılından, geriye (geçmiş bir tarih seçilince) ilk veri yılından */
    const yillar = [];
    for (let y = Math.max(y0, sonYil + 1); y <= y1; y++) yillar.push([y, sonYil]);
    for (let y = y0; y <= Math.min(y1, ilkYil - 1); y++) yillar.push([y, ilkYil]);
    yillar.forEach(([y, kaynakYil]) => {
      ls.filter(m => yil(m) === kaynakYil && m.gunes_boylami != null).forEach(m => {
        const k = y - kaynakYil, z0 = new Date(m.zirve_utc);
        const yak = new Date(z0); yak.setUTCFullYear(z0.getUTCFullYear() + k);
        const zirve = boylamAni(m.gunes_boylami, yak);
        if (!zirve) return;
        ek.push(Object.assign({}, m, { zirve_utc: zirve.toISOString().replace('.000Z', 'Z'), baslangic: kaydir(m.baslangic, k), bitis: kaydir(m.bitis, k), tahmini: kaynakYil }));
      });
    });
    const sonuc = ls.concat(ek);
    meteorOnbellek.set(an, sonuc);
    return sonuc;
  }

  /* Radyantın en yüksek konumu: etkin yağmurda bu gecenin, değilse zirve gecesinin karanlık saatlerinde */
  const zirveGecesi = {};
  function meteorDurumu(liste, zaman, gzl, gece, secenek) {
    const zirveHesapla = !secenek || secenek.zirveGecesi !== false;
    const orn = gece && !gece.karanlikYok ? ornekler(gece.karanlikBas, gece.karanlikSon, 20, gzl) : [];
    return liste.map(m => {
      const zirve = new Date(m.zirve_utc);
      const gunFark = (zirve - zaman) / 86400e3;
      const aktif = aktifMi(m, zaman);
      let radyantTepe = null, radyantGece = aktif ? 'bu gece' : 'zirve gecesi';
      if (m.radyant_ra != null) {
        let o = orn;
        if (!aktif && !zirveHesapla) o = [];
        else if (!aktif) {
          const an = m.zirve_utc + '|' + gzl.latitude.toFixed(2) + '|' + gzl.longitude.toFixed(2);
          if (!zirveGecesi[an]) { const g = geceAraligi(new Date(zirve.getTime() - 12 * 3600e3), gzl); zirveGecesi[an] = g.karanlikYok ? [] : ornekler(g.karanlikBas, g.karanlikSon, 20, gzl); }
          o = zirveGecesi[an];
        }
        if (o.length) radyantTepe = enYuksekSabit(birimVektor(m.radyant_ra, m.radyant_dec), o);
      }
      return Object.assign({}, m, { aktif, gunFark, radyantTepe, radyantGece });
    });
  }

  /* Karşı konum: yer merkezli görünen ekliptik boylam farkı 180° (almanak tanımı). Güneş merkezli kavuşum
     yakın bir başlangıç verir; ±3 gün içinde ikiye bölmeyle iyileştirilir. */
  function karsiKonum(c, t0) {
    if (!t0) return null;
    const fark = t => {
      const p = A.Ecliptic(A.GeoVector(c, t, true)).elon, g = A.Ecliptic(A.GeoVector('Sun', t, true)).elon;
      return ((p - g - 180) % 360 + 540) % 360 - 180;
    };
    let a = new Date(t0.getTime() - 3 * 86400e3), b = new Date(t0.getTime() + 3 * 86400e3);
    let fa = fark(a), fb = fark(b);
    if (fa * fb > 0) return t0;
    for (let i = 0; i < 40; i++) {
      const m = new Date((a.getTime() + b.getTime()) / 2), fm = fark(m);
      if (fa * fm <= 0) { b = m; fb = fm; } else { a = m; fa = fm; }
    }
    return new Date((a.getTime() + b.getTime()) / 2);
  }

  /* ---- Yaklaşan olaylar ---- */
  function olaylar(zaman, gzl, gunSayisi) {
    const son = new Date(zaman.getTime() + (gunSayisi || 120) * 86400e3);
    const ls = [];
    ayCeyrekleri(zaman, Math.ceil((gunSayisi || 120) / 7.38) + 2).forEach(q => {
      if ((q.ceyrek === 0 || q.ceyrek === 2) && q.zaman <= son) ls.push({ tur: 'ay', zaman: q.zaman, baslik: q.ad });
    });
    /* Ay tutulması: Türkiye'den görünürlüğü, tutulmanın ortasında Ay'ın ufkun üstünde olup olmadığıyla kontrol edilir. */
    let le = A.SearchLunarEclipse(zaman);
    for (let i = 0; i < 3 && le && tarih(le.peak) < son; i++) {
      const tepe = tarih(le.peak);
      const ayAlt = cisimAltAz('Moon', tepe, gzl).alt;
      const tur = { penumbral: 'Yarıgölge ay tutulması', partial: 'Parçalı ay tutulması', total: 'Tam ay tutulması' }[le.kind] || 'Ay tutulması';
      /* Ortada ufkun altındaysa bile başında ya da sonunda Ay ufkun üstünde olabilir */
      const yd = (le.sd_partial || le.sd_penum || 0) * 60e3;
      const kenar = yd ? [cisimAltAz('Moon', new Date(tepe.getTime() - yd), gzl).alt, cisimAltAz('Moon', new Date(tepe.getTime() + yd), gzl).alt] : [];
      const kismen = ayAlt <= 0 && kenar.some(a => a > 0);
      ls.push({ tur: 'tutulma', zaman: tepe, baslik: tur, not: ayAlt > 0 ? 'Buradan görünür (tutulma ortasında Ay ufkun ' + Math.round(ayAlt) + '° üstünde).' : (kismen ? 'Kısmen görünür: tutulmanın ' + (kenar[0] > 0 ? 'başında Ay batmadan önce' : 'sonunda Ay doğduktan sonra') + ' izlenebilir.' : 'Tutulma boyunca Ay buradan ufkun altında.'), gorunur: ayAlt > 0 || kismen });
      le = A.NextLunarEclipse(le.peak);
    }
    let se = A.SearchLocalSolarEclipse(zaman, gzl);
    for (let i = 0; i < 2 && se && tarih(se.peak.time) < son; i++) {
      const tur = { partial: 'Parçalı güneş tutulması', annular: 'Halkalı güneş tutulması', total: 'Tam güneş tutulması' }[se.kind] || 'Güneş tutulması';
      const alt = se.peak.altitude;
      const basAlt = se.partial_begin ? se.partial_begin.altitude : -90, sonAlt = se.partial_end ? se.partial_end.altitude : -90;
      const kismen = alt <= 0 && (basAlt > 0 || sonAlt > 0);
      ls.push({ tur: 'tutulma', zaman: tarih(se.peak.time), baslik: tur, not: alt > 0 ? 'Buradan görünür; en büyük anda Güneş ' + Math.round(alt) + '° yükseklikte. Güneşe asla filtresiz bakma.' : (kismen ? 'Kısmen görünür: ' + (basAlt > 0 ? 'Güneş batarken' : 'Güneş doğarken') + ' tutulmuş hâlde. Güneşe asla filtresiz bakma.' : 'Buradan görünmez (Güneş ufkun altında).'), gorunur: alt > 0 || kismen, ortulme: se.obscuration });
      se = A.NextLocalSolarEclipse(se.peak.time, gzl);
    }
    const yil = zaman.getFullYear();
    [yil, yil + 1].forEach(y => {
      const s = A.Seasons(y);
      [['mar_equinox', 'İlkbahar ekinoksu'], ['jun_solstice', 'Yaz gündönümü'], ['sep_equinox', 'Sonbahar ekinoksu'], ['dec_solstice', 'Kış gündönümü']]
        .forEach(([k, ad]) => ls.push({ tur: 'mevsim', zaman: tarih(s[k]), baslik: ad }));
    });
    ['Mercury', 'Venus'].forEach(c => {
      for (let e = A.SearchMaxElongation(c, zaman), n = 0; e && tarih(e.time) <= son && n < 6; e = A.SearchMaxElongation(c, new Date(tarih(e.time).getTime() + 86400e3)), n++)
        ls.push({ tur: 'gezegen', zaman: tarih(e.time), baslik: TR_AD[c] + ' en büyük uzanımda', not: (e.visibility === 'morning' ? 'Sabah gökyüzünde' : 'Akşam gökyüzünde') + ', Güneş\'ten ' + e.elongation.toFixed(1).replace('.', ',') + '° uzakta.' });
    });
    ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].forEach(c => {
      const t = karsiKonum(c, tarih(A.SearchRelativeLongitude(c, 0, zaman)));
      if (t) ls.push({ tur: 'gezegen', zaman: t, baslik: TR_AD[c] + ' karşı konumda', not: 'Bütün gece görünür, yılın en parlak ve en yakın hâli.' });
    });
    return ls.filter(o => o.zaman && o.zaman >= zaman && o.zaman <= son).sort((a, b) => a.zaman - b.zaman);
  }

  /* ---- Jüpiter'in Galileo uyduları: gökyüzündeki konumları (yay saniyesi) ----
     Astronomy Engine JupiterMoons (EQJ, Jüpiter merkezli, AU). Işık süresi düzeltmesi:
     uydular Jüpiter'den ışığın çıktığı anda hesaplanır. doğu > 0: gökte Jüpiter'in doğusu
     (kuzey yukarıdayken SOLDA). derinlik > 0: Jüpiter'in arkasında (Dünya'dan uzakta). */
  const UYDU_AD = { io: 'Io', europa: 'Europa', ganymede: 'Ganymede', callisto: 'Callisto' };
  function jupiterUydulari(zaman) {
    const J = A.GeoVector('Jupiter', zaman, true);
    const d = Math.hypot(J.x, J.y, J.z);
    const lt = d * 149597870.7 / 299792.458 / 86400; // gün
    const t = new Date(zaman.getTime() - lt * 86400e3);
    const ay = A.JupiterMoons(t);
    const u = [J.x / d, J.y / d, J.z / d];
    const ra = Math.atan2(u[1], u[0]), dec = Math.asin(u[2]);
    const dogu = [-Math.sin(ra), Math.cos(ra), 0];
    const kuzey = [-Math.sin(dec) * Math.cos(ra), -Math.sin(dec) * Math.sin(ra), Math.cos(dec)];
    const nokta = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const yaySn = 180 / Math.PI * 3600 / d;
    return Object.keys(UYDU_AD).map(k => {
      const m = [ay[k].x, ay[k].y, ay[k].z];
      return { ad: UYDU_AD[k], dogu: nokta(m, dogu) * yaySn, kuzey: nokta(m, kuzey) * yaySn, derinlik: nokta(m, u) };
    });
  }
  /* Jüpiter'in görünen ekvator yarıçapı (yay saniyesi); yarıçap IAU 2015 B3 nominal 71 492 km */
  function jupiterYaricap(zaman) {
    const J = A.GeoVector('Jupiter', zaman, true);
    return Math.atan(71492 / (Math.hypot(J.x, J.y, J.z) * 149597870.7)) * 180 / Math.PI * 3600;
  }

  const Gok = {
    A, DER, GEZEGENLER, TR_AD, YON_UZUN,
    gozlemci, yon, ufukMatrisi, birimVektor, ufkaCevir, sabitAltAz, cisimAltAz, takimyildiz,
    yerelOgle, geceAraligi, ayDurumu, ayCeyrekleri, evreAdi, enYuksek, ornekler, enYuksekSabit, gezegenlerBuGece, hedeflerBuGece,
    meteorDurumu, meteorTakvimi, gunesBoylamJ2000, aktifMi, olaylar, gezegenKadir, jupiterUydulari, jupiterYaricap
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Gok;
  else kok.Gok = Gok;
})(typeof self !== 'undefined' ? self : this);
