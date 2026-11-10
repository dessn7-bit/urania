/* apophis.js — 99942 Apophis'in 13 Nisan 2029 yakın geçişi: cihazda yerel konum, yükseklik, parlaklık.
   Veri: veri/apophis2029.json — JPL Horizons yer merkezli ICRF (J2000 ekvator) konum vektörleri, 2 dk adımla,
   12 Nis 18.00 – 14 Nis 06.00 UT (araclar/apophis_horizons.py). Cihaz:
   (1) kübik Lagrange aradeğerlemesiyle o anın yer merkezli vektörü,
   (2) gözlemcinin yer merkezli konum vektörü (Astronomy Engine ObserverVector) çıkarılır → yerel (topocentric) yön;
       Apophis 38 000 km'ye yaklaştığı için paralaks birkaç derecedir, ihmal edilemez,
   (3) ufuk koordinatı (Rotation_EQJ_HOR; kırılma eklenmez, Horizons "airless" ile karşılaştırılır),
   (4) parlaklık H–G modeliyle (Bowell ve ark. 1989; Horizons'un formülü: APmag = H + 5 log10(Δ) + 5 log10(r)
       − 2,5 log10((1−G) Φ1 + G Φ2), Φ1 = exp(−3,33 tan(α/2)^0,63), Φ2 = exp(−1,87 tan(α/2)^1,22)).
   Doğrulama: testler/veri/apophis_horizons_yerel.json (Horizons topocentric, İstanbul / Ankara / Madrid).
   Tarayıcıda window.Apophis, Node'da module.exports. */
(function (kok) {
  'use strict';
  const NODE = typeof module !== 'undefined' && module.exports;
  const A = NODE ? require('./lib/astronomy.browser.min.js') : kok.Astronomy;
  const DER = Math.PI / 180;
  const KM = A.KM_PER_AU;

  /* Yer merkezli vektör (km) — veri aralığı dışında null */
  function konum(V, zaman) {
    const jd = zaman.getTime() / 864e5 + 2440587.5;
    const f = (jd - V.basJD_UT) * 1440 / V.adimDakika;
    if (!(f >= 0 && f <= V.sayi - 1)) return null;
    const i = Math.max(1, Math.min(V.sayi - 3, Math.floor(f))), u = f - i;
    const p = k => [V.xyz[3 * k], V.xyz[3 * k + 1], V.xyz[3 * k + 2]];
    const P = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const w = [-u * (u - 1) * (u - 2) / 6, (u + 1) * (u - 1) * (u - 2) / 2, -(u + 1) * u * (u - 2) / 2, (u + 1) * u * (u - 1) / 6];
    return [0, 1, 2].map(c => w[0] * P[0][c] + w[1] * P[1][c] + w[2] * P[2][c] + w[3] * P[3][c]);
  }

  /* gzl: A.Observer (ya da {latitude, longitude, height}) */
  function yerel(V, zaman, gzl) {
    const g = konum(V, zaman); if (!g) return null;
    const t = A.MakeTime(zaman);
    const obs = gzl instanceof A.Observer ? gzl : new A.Observer(gzl.latitude, gzl.longitude, gzl.height || 0);
    const o = A.ObserverVector(t, obs, false);
    const v = new A.Vector(g[0] / KM - o.x, g[1] / KM - o.y, g[2] / KM - o.z, t);
    const eq = A.EquatorFromVector(v);
    const h = A.HorizonFromVector(A.RotateVector(A.Rotation_EQJ_HOR(t, obs), v), null);
    /* faz açısı: asteroitten Güneş'e ve asteroitten gözlemciye giden yönler arası */
    const s = A.GeoVector(A.Body.Sun, t, false);
    const ax = g[0] / KM - s.x, ay = g[1] / KM - s.y, az = g[2] / KM - s.z;
    const r = Math.hypot(ax, ay, az), dl = v.Length();
    const alfa = Math.acos(Math.max(-1, Math.min(1, (ax * v.x + ay * v.y + az * v.z) / (r * dl))));
    const tt = Math.tan(alfa / 2);
    const f1 = Math.exp(-3.33 * Math.pow(tt, 0.63)), f2 = Math.exp(-1.87 * Math.pow(tt, 1.22));
    const kadir = V.H + 5 * Math.log10(r * dl) - 2.5 * Math.log10((1 - V.G) * f1 + V.G * f2);
    return { zaman, ra: eq.ra * 15, dec: eq.dec, az: h.lon, alt: h.lat, kadir, alfa: alfa / DER, uzaklikKm: dl * KM, yerMerkezKm: Math.hypot(g[0], g[1], g[2]) };
  }

  /* Yer merkezine en yakın an (veriden: 2 dk örneklerde en küçük, sonra parabolle inceltilir) */
  function enYakin(V) {
    let en = 0, d = Infinity;
    for (let k = 0; k < V.sayi; k++) { const r = Math.hypot(V.xyz[3 * k], V.xyz[3 * k + 1], V.xyz[3 * k + 2]); if (r < d) { d = r; en = k; } }
    const r = k => Math.hypot(V.xyz[3 * k], V.xyz[3 * k + 1], V.xyz[3 * k + 2]);
    let ofs = 0;
    if (en > 0 && en < V.sayi - 1) { const a = r(en - 1), b = r(en), c = r(en + 1); const den = a - 2 * b + c; if (den > 0) ofs = 0.5 * (a - c) / den; }
    const zaman = new Date(((V.basJD_UT + (en + ofs) * V.adimDakika / 1440) - 2440587.5) * 864e5);
    const g = konum(V, zaman);
    return { zaman, km: Math.hypot(g[0], g[1], g[2]) };
  }

  /* Gece boyunca yol: adimDk aralıkla yerel konumlar + Güneş yüksekliği */
  function yol(V, gzl, bas, son, adimDk) {
    const ls = [];
    for (let t = bas.getTime(); t <= son.getTime(); t += (adimDk || 5) * 60e3) {
      const z = new Date(t), y = yerel(V, z, gzl); if (!y) continue;
      const tz = A.MakeTime(z), se = A.Equator(A.Body.Sun, tz, gzl, true, true), gn = A.Horizon(tz, gzl, se.ra, se.dec, null);
      y.gunesAlt = gn.altitude;
      ls.push(y);
    }
    return ls;
  }

  /* Bu yer için özet: karanlıkta (Güneş −12°'nin altı, Urania'nın seçimi: denizci alacakaranlığı biter) ve ufkun 10° üstünde
     görünür olduğu aralık, o aralıkta en parlak an, en yakın an ve bir gökcismine (ör. M44) en yakın geçiş. */
  const KARANLIK = -12, ALCAK = 10, PENCERE = 6;
  function ozet(V, gzl, secenek) {
    secenek = secenek || {};
    /* Pencere: en yakın andan ±PENCERE saat (geçişin gecesi; öncesi ve sonrası çok sönük) */
    const yakin = enYakin(V);
    const bas = new Date(yakin.zaman.getTime() - PENCERE * 3600e3), son = new Date(yakin.zaman.getTime() + PENCERE * 3600e3);
    const ls = yol(V, gzl, bas, son, 5);
    const gor = ls.filter(y => y.gunesAlt < KARANLIK && y.alt >= ALCAK);
    const yakinYerel = yerel(V, yakin.zaman, gzl);
    const out = { yakin, yakinYerel, gorunur: gor.length > 0, ilk: gor[0] || null, son: gor[gor.length - 1] || null, enParlak: null, hedef: null };
    if (gor.length) {
      out.enParlak = gor.reduce((a, b) => (b.kadir < a.kadir ? b : a));
      /* en parlak anı 1 dk adımla incelt */
      const t0 = out.enParlak.zaman.getTime();
      for (let t = t0 - 5 * 60e3; t <= t0 + 5 * 60e3; t += 60e3) {
        if (t < out.ilk.zaman.getTime() || t > out.son.zaman.getTime()) continue;   // karanlık ve ufkun üstündeki aralıkta kal
        const y = yerel(V, new Date(t), gzl); if (y && y.alt >= ALCAK && y.kadir < out.enParlak.kadir) out.enParlak = y;
      }
    }
    if (secenek.hedef && gor.length) {
      const h = secenek.hedef, hv = [Math.cos(h.dec * DER) * Math.cos(h.ra * DER), Math.cos(h.dec * DER) * Math.sin(h.ra * DER), Math.sin(h.dec * DER)];
      let en = null;
      for (let t = gor[0].zaman.getTime(); t <= gor[gor.length - 1].zaman.getTime(); t += 60e3) {
        const y = yerel(V, new Date(t), gzl); if (!y) continue;
        const v = [Math.cos(y.dec * DER) * Math.cos(y.ra * DER), Math.cos(y.dec * DER) * Math.sin(y.ra * DER), Math.sin(y.dec * DER)];
        const c = Math.max(-1, Math.min(1, v[0] * hv[0] + v[1] * hv[1] + v[2] * hv[2]));
        const a = Math.acos(c) / DER;
        if (!en || a < en.aci) en = { aci: a, zaman: y.zaman, alt: y.alt, kadir: y.kadir };
      }
      out.hedef = en;
    }
    /* Ay o an ufkun üstünde mi */
    const ref = out.enParlak ? out.enParlak.zaman : yakin.zaman;
    const ayEq = A.Equator(A.Body.Moon, A.MakeTime(ref), gzl, true, true);
    out.ayAlt = A.Horizon(A.MakeTime(ref), gzl, ayEq.ra, ayEq.dec, null).altitude;
    out.ayOran = A.Illumination(A.Body.Moon, A.MakeTime(ref)).phase_fraction;
    return out;
  }

  const Apophis = { konum, yerel, enYakin, yol, ozet, KARANLIK, ALCAK, PENCERE };
  if (NODE) module.exports = Apophis;
  else kok.Apophis = Apophis;
})(typeof self !== 'undefined' ? self : this);
