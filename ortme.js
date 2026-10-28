/* ortme.js — Ay örtmeleri ve Algol'ün kararmaları. DOM'a dokunmaz; tarayıcıda
   window.Ortme, Node'da module.exports (doğrulama testleri buradan çağırır).

   Ay örtmesi: Ay bir yıldızın ya da gezegenin önünden geçer; yıldız Ay'ın kenarında bir anda
   kaybolur (giriş) ve öbür kenarda bir anda belirir (çıkış). Hesap J2000 çerçevesinde,
   gözlemcinin bulunduğu yerden (topos): Ay'ın merkezi Astronomy Engine GeoMoonState (ışık süresi
   kadar geriye), gözlemcinin yeri ObserverVector; yıldız Hipparcos konumu + öz hareket + yıllık
   sapınç (Dünya'nın hızı, ≈20″). Ay için yıllık sapınç ile ışık süresindeki Dünya hareketi birbirini
   götürür; bu yüzden sapınç yalnız yıldıza uygulanır (Skyfield/DE421 ile karşılaştırıldı: testler/ortme.spec.js).
   Ay yarıçapı: k = 0,2725076 × Dünya ekvator yarıçapı (IAU; örtme tahminlerinde kullanılan değer).
   Ay'ın kenarındaki dağlar ve vadiler gerçek anı birkaç saniye kaydırabilir. */
(function (kok) {
  'use strict';
  const Gok = (typeof module !== 'undefined' && module.exports) ? require('./gok.js') : kok.Gok;
  const A = Gok.A;
  const DER = Math.PI / 180;
  const AB_KM = 149597870.7;
  const AY_R_KM = 0.2725076 * 6378.1366;     // 1738,09 km
  const ISIK_AB_SN = 499.004784;             // ışığın 1 AB'yi aşma süresi (sn), IAU 2012 B2 AB tanımından

  function birim(v) { const n = Math.hypot(v.x, v.y, v.z); return [v.x / n, v.y / n, v.z / n, n]; }
  function nokta(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function aci(a, b) {
    /* küçük açılarda acos yerine atan2(|a×b|, a·b): saniye düzeyinde kararlı */
    const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    return Math.atan2(Math.hypot(c[0], c[1], c[2]), nokta(a, b));
  }

  const C_AB_GUN = 173.1446326846693;     // ışık hızı, AB/gün
  /* Yıldızın t anındaki görünen J2000 yönü: doğrusal öz hareket + yıllık sapınç */
  function yildizYon(y, t) {
    const yil = (t.getTime() - Date.UTC(2000, 0, 1, 12)) / (365.25 * 86400e3);
    const dec = y.dec + (y.pd || 0) * yil / 3.6e6;
    const ra = y.ra + (y.pa || 0) * yil / 3.6e6 / Math.cos(y.dec * DER);
    const u = Gok.birimVektor(ra, dec);
    const e = A.BaryState('Earth', t);
    const v = [e.vx / C_AB_GUN, e.vy / C_AB_GUN, e.vz / C_AB_GUN];
    const w = [u[0] + v[0], u[1] + v[1], u[2] + v[2]], n = Math.hypot(w[0], w[1], w[2]);
    return [w[0] / n, w[1] / n, w[2] / n];
  }

  /* Gözlemciden Ay: [birim yön, uzaklık km]; ışık yolu süresi (~1,3 sn) kadar önceki konum */
  function ayTopo(t, gzl) {
    const s = A.GeoMoonState(t), o = A.ObserverVector(t, gzl, false);
    const d = Math.hypot(s.x - o.x, s.y - o.y, s.z - o.z), lt = d / C_AB_GUN;
    const b = birim({ x: s.x - s.vx * lt - o.x, y: s.y - s.vy * lt - o.y, z: s.z - s.vz * lt - o.z });
    return { yon: [b[0], b[1], b[2]], km: b[3] * AB_KM };
  }
  function gezegenTopo(c, t, gzl) {
    const p = A.GeoVector(c, t, true), o = A.ObserverVector(t, gzl, false);
    const b = birim({ x: p.x - o.x, y: p.y - o.y, z: p.z - o.z });
    return [b[0], b[1], b[2]];
  }

  /* f(t) = (yıldız–Ay merkezi açısı) − Ay'ın görünen yarıçapı, radyan. < 0: yıldız Ay'ın arkasında.
     sabit: birkaç saatlik pencere için önceden hesaplanmış yıldız yönü (öz hareket ve sapınç
     saatler içinde 0,05″'ten az değişir; her adımda yeniden hesaplamak telefonu yorar). */
  function fark(hedef, t, gzl, sabit) {
    const ay = ayTopo(t, gzl);
    const y = hedef.gezegen ? gezegenTopo(hedef.gezegen, t, gzl) : (sabit || yildizYon(hedef, t));
    return aci(y, ay.yon) - Math.asin(AY_R_KM / ay.km);
  }
  function kok2(f, a, b) {
    /* ikiye bölme, 0,5 sn */
    let fa = f(a);
    for (let i = 0; i < 40 && b - a > 500; i++) {
      const m = Math.round((a + b) / 2), fm = f(m);
      if ((fa < 0) === (fm < 0)) { a = m; fa = fm; } else b = m;
    }
    return new Date(Math.round((a + b) / 2000) * 1000);
  }
  /* [a, b] aralığında f'nin en küçüğü (altın oran araması, ~2 sn) */
  function enKucuk(f, a, b) {
    const g = (Math.sqrt(5) - 1) / 2;
    let c = b - g * (b - a), d = a + g * (b - a), fc = f(c), fd = f(d);
    while (b - a > 2000) {
      if (fc < fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = f(c); }
      else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = f(d); }
    }
    return fc < fd ? [c, fc] : [d, fd];
  }
  /* Bir pencerede giriş/çıkış kökleri: 5 dk'lık tarama; işaret değişimi ya da sıfıra yakın yerel
     en küçük (kısa, sıyırıcı geçişler iki örnek arasında kalabilir) altın oranla incelenir. */
  const TARAMA = 5 * 60e3, YAKIN = 1.2e-3; // rad: Ay'ın yıldızlara göre 5 dk'lık yolundan biraz fazla
  function kokler(f, bas, son) {
    const t = [], v = [];
    for (let ms = bas; ms <= son + TARAMA - 1; ms += TARAMA) { t.push(ms); v.push(f(ms)); }
    const ls = [];
    for (let i = 1; i < t.length; i++) {
      if ((v[i - 1] < 0) !== (v[i] < 0)) { ls.push({ tur: v[i] < 0 ? 'giris' : 'cikis', t: kok2(f, t[i - 1], t[i]) }); continue; }
      if (i < t.length - 1 && v[i] > 0 && v[i] < YAKIN && v[i] <= v[i - 1] && v[i] <= v[i + 1]) {
        const [tm, fm] = enKucuk(f, t[i - 1], t[i + 1]);
        if (fm < 0) {
          ls.push({ tur: 'giris', t: kok2(f, t[i - 1], tm) });
          ls.push({ tur: 'cikis', t: kok2(f, tm, t[i + 1]) });
        }
      }
    }
    return ls;
  }

  /* Örtmenin olduğu kenar: Ay'ın Güneş'e bakan yarısı aydınlık kenardır.
     Yıldızın Ay merkezine göre konum açısı (kuzeyden doğuya) da verilir. */
  function kenar(hedef, t, gzl) {
    const ay = ayTopo(t, gzl).yon;
    const y = hedef.gezegen ? gezegenTopo(hedef.gezegen, t, gzl) : yildizYon(hedef, t);
    const g = birim(A.GeoVector('Sun', t, false));
    const izd = v => { const d = nokta(v, ay); const p = [v[0] - d * ay[0], v[1] - d * ay[1], v[2] - d * ay[2]]; const n = Math.hypot(p[0], p[1], p[2]) || 1; return [p[0] / n, p[1] / n, p[2] / n]; };
    const yy = izd(y), gg = izd([g[0], g[1], g[2]]);
    const dogu = izd([-ay[1], ay[0], 0]), kuzey = izd([-ay[2] * ay[0], -ay[2] * ay[1], ay[0] * ay[0] + ay[1] * ay[1]]);
    let kA = Math.atan2(nokta(yy, dogu), nokta(yy, kuzey)) / DER; if (kA < 0) kA += 360;
    /* Uç açısı (Occult'taki "cusp angle"): olay noktasının Ay'ın en yakın boynuzuna (aydınlık ile karanlığın
       kenarda buluştuğu nokta) açısal uzaklığı. Güneş'e bakan noktadan açı 90°'de boynuzdur. */
    const gunesten = Math.acos(Math.max(-1, Math.min(1, nokta(yy, gg)))) / DER;
    return { aydinlik: nokta(yy, gg) > 0, konumAcisi: kA, ucAcisi: Math.abs(gunesten - 90) };
  }

  /* Ufuk yüksekliği (kırılmalı) — J2000 yönünden */
  function yukseklik(yon, t, gzl) {
    const ra = Math.atan2(yon[1], yon[0]) / DER, dec = Math.asin(yon[2]) / DER;
    return Gok.sabitAltAz((ra + 360) % 360, dec, t, gzl);
  }

  /* Ana arama. hedefler: Hipparcos listesi (veri/ortme_yildiz.json'daki y) — gezegenler eklenir.
     Döndürür: görünür (Ay ve yıldız ufkun ≥5° üstünde, Güneş −6°'nin altında) giriş/çıkış olayları. */
  const GEZ = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  function ortmeler(yildizlar, gzl, bas, gun, secenek) {
    const sec = Object.assign({ enSonukKadir: 4.5, minYuk: 5, gunesSinir: -6 }, secenek || {});
    const hedefler = yildizlar.filter(y => y.v <= sec.enSonukKadir || y.u)
      .map(y => Object.assign({ tur: 'yildiz' }, y));
    GEZ.forEach(c => hedefler.push({ tur: 'gezegen', gezegen: c, ad: Gok.TR_AD[c] }));
    const son = bas.getTime() + gun * 86400e3;
    const ESIK = 1.9 * DER;              // jeosantrik ayrım; topos ıraklığı ≤ 1,02° + yarıçap + yarım saatlik yol
    const adayPencere = new Map();       // hedef indeksi → [başlangıç saatleri]
    const yYon = hedefler.map(h => h.gezegen ? null : yildizYon(h, new Date((bas.getTime() + son) / 2)));
    let gezYon = null, gezZaman = 0;
    /* Dilim sınırında kesilmesin: aday saatler 3 saat önceden ve sonradan da taranır; bir pencere yalnız
       başladığı dilime aittir (bas ≤ başlangıç < son). Böylece kayboluş bir dilimde, belirişi ötekinde kalmaz. */
    /* Tarama sondan 9 saat sonraya kadar: yer merkezli pencere ~7 saat sürebilir, topos ıraklığı ±1,9 saat kaydırır */
    for (let ms = bas.getTime() - 3 * 3600e3; ms <= son + 9 * 3600e3; ms += 3600e3) {
      const t = new Date(ms);
      const ay = birim(A.GeoMoon(t));
      if (!gezYon || ms - gezZaman >= 6 * 3600e3) {
        gezZaman = ms;
        gezYon = {};
        GEZ.forEach(c => { const b = birim(A.GeoVector(c, t, false)); gezYon[c] = [b[0], b[1], b[2]]; });
      }
      hedefler.forEach((h, i) => {
        const y = h.gezegen ? gezYon[h.gezegen] : yYon[i];
        if (aci(y, ay) < (h.gezegen ? ESIK + 0.8 * DER : ESIK)) {
          if (!adayPencere.has(i)) adayPencere.set(i, []);
          adayPencere.get(i).push(ms);
        }
      });
    }
    const olaylar = [];
    adayPencere.forEach((saatler, i) => {
      const h = hedefler[i];
      /* ardışık saatleri tek pencerede birleştir */
      const pencereler = [];
      saatler.forEach(ms => {
        const p = pencereler[pencereler.length - 1];
        if (p && ms - p[1] <= 3600e3) p[1] = ms; else pencereler.push([ms, ms]);
      });
      pencereler.forEach(([a, b]) => {
        if (a < bas.getTime() || a >= son) return;
        const sabit = h.gezegen ? null : yildizYon(h, new Date((a + b) / 2));
        const ls = kokler(ms => fark(h, new Date(ms), gzl, sabit), a - 90 * 60e3, b + 90 * 60e3);
        if (!ls.length) return;
        const giris = ls.find(x => x.tur === 'giris'), cikis = ls.find(x => x.tur === 'cikis');
        const olay = { hedef: h, giris: giris ? giris.t : null, cikis: cikis ? cikis.t : null };
        const ornek = olay.giris || olay.cikis;
        olay.ayOran = A.Illumination('Moon', ornek).phase_fraction;
        olay.buyuyen = A.MoonPhase(ornek) < 180;
        ['giris', 'cikis'].forEach(k => {
          if (!olay[k]) return;
          const t = olay[k];
          const ay = ayTopo(t, gzl);
          const yuk = yukseklik(ay.yon, t, gzl);
          const gunes = Gok.cisimAltAz('Sun', t, gzl).alt;
          const ken = kenar(h, t, gzl);
          olay[k + 'Bilgi'] = { alt: yuk.alt, az: yuk.az, gunes, aydinlik: ken.aydinlik, konumAcisi: ken.konumAcisi, ucAcisi: ken.ucAcisi,
            gorunur: yuk.alt >= sec.minYuk && gunes <= sec.gunesSinir };
        });
        olay.gorunur = !!((olay.girisBilgi && olay.girisBilgi.gorunur) || (olay.cikisBilgi && olay.cikisBilgi.gorunur));
        olaylar.push(olay);
      });
    });
    return olaylar.sort((x, y) => (x.giris || x.cikis) - (y.giris || y.cikis));
  }

  /* Ülker üyelerinin aynı geceki örtmelerini tek olayda topla */
  function ulkerGrupla(olaylar) {
    const sonuc = [], ulker = [];
    olaylar.forEach(o => { if (o.hedef.u) ulker.push(o); else sonuc.push(o); });
    ulker.forEach(o => {
      const t = (o.giris || o.cikis).getTime();
      let g = sonuc.find(x => x.ulker && Math.abs(x.zaman - t) < 8 * 3600e3);
      if (!g) { g = { ulker: true, zaman: t, uyeler: [] }; sonuc.push(g); }
      g.uyeler.push(o);
      g.zaman = Math.min(g.zaman, t);
    });
    sonuc.forEach(g => { if (g.ulker) { g.uyeler.sort((a, b) => (a.giris || a.cikis) - (b.giris || b.cikis)); g.gorunur = g.uyeler.some(u => u.gorunur); } });
    return sonuc.sort((a, b) => (a.ulker ? a.zaman : (a.giris || a.cikis)) - (b.ulker ? b.zaman : (b.giris || b.cikis)));
  }

  /* ---- Algol (β Persei) ----
     Doğrusal efemeris: en küçük parlaklık anı HJD = E0 + n·P (güneş merkezli). Dünya'dan görülen an
     ışığın Güneş ile Dünya arasındaki yol farkı kadar kayar (en çok ±8,3 dk):
     JD(Dünya) = HJD − (r⊕ · n̂) / c. Değerler ve kaynakları veri/algol.json'da. */
  function hjdDuzeltme(t, ra, dec) {
    const r = A.HelioVector('Earth', t);
    const n = Gok.birimVektor(ra, dec);
    return (r.x * n[0] + r.y * n[1] + r.z * n[2]) * ISIK_AB_SN; // saniye; HJD − JD
  }
  const JD_UNIX = 2440587.5;
  function algolMinimumlari(ef, bas, son) {
    const p = ef.periyot, e0 = ef.donem_hjd;
    const jdBas = bas.getTime() / 86400e3 + JD_UNIX - 0.01, jdSon = son.getTime() / 86400e3 + JD_UNIX + 0.01;
    const ls = [];
    for (let n = Math.ceil((jdBas - e0) / p); e0 + n * p <= jdSon; n++) {
      const hjd = e0 + n * p;
      let t = new Date((hjd - JD_UNIX) * 86400e3);
      t = new Date(t.getTime() - hjdDuzeltme(t, ef.ra, ef.dec) * 1000);
      if (t >= bas && t <= son) ls.push({ n, hjd, zaman: t });
    }
    return ls;
  }
  /* Gözlenebilir minimumlar: en küçük parlaklık anında Algol ≥ 15° ve Güneş ≤ −12° */
  function algolGozlenebilir(ef, gzl, bas, son) {
    return algolMinimumlari(ef, bas, son).map(m => {
      const k = Gok.sabitAltAz(ef.ra, ef.dec, m.zaman, gzl);
      const g = Gok.cisimAltAz('Sun', m.zaman, gzl).alt;
      return Object.assign(m, { alt: k.alt, az: k.az, gunes: g, gorunur: k.alt >= 15 && g <= -12 });
    });
  }

  const Ortme = { ortmeler, ulkerGrupla, fark, kenar, yildizYon, ayTopo, algolMinimumlari, algolGozlenebilir, hjdDuzeltme, AY_R_KM };
  if (typeof module !== 'undefined' && module.exports) module.exports = Ortme;
  else kok.Ortme = Ortme;
})(typeof self !== 'undefined' ? self : this);
