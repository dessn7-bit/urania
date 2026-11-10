/* ay.js — "Bu gece Ay'da" rehberinin hesap ve çizim çekirdeği (v47). DOM'a yalnız ciz() dokunur.
   Hesaplar Astronomy Engine ile, cihazda:
   - Ay'ın evresi (Illumination, MoonPhase);
   - librasyon = alt gözlemci noktası: Ay'ın merkezinden gözlemciye bakan yönün Ay gövde çerçevesindeki boylam/enlemi
     (RotationAxis: IAU kutup ve dönme açısı; yerel konum, paralaks dahil). Libration() yer merkezli optik librasyonu da verir;
   - alt Güneş noktası; terminator (aydınlık–karanlık sınırı) Ay boylamı = alt Güneş boylamı ∓ 90° (sabah/akşam);
   - dürbünde görünen yön: dürbün görüntüyü ters çevirmez; ekranın üstü tepe (başucu) yönüdür. Ay'ın kuzey kutbunun gök
     kuzeyine göre konum açısı (NP) ve paralaktik açı q (Meeus, Astronomical Algorithms, 2. bs., denk. 14.1):
     tan q = sin H / (tan φ · cos δ − sin δ · cos H). Ekrandaki dönüklük doğrudan vektörlerle hesaplanır.
   Doğrulama: testler/veri/ay/horizons_ay.json (JPL Horizons: ObsSub-LON/LAT, SunSub-LON/LAT, NP.ang, yerel saat açısı).
   Yapılar: veri/ay_yapilari.json (IAU/USGS). Doku: img/ay/lroc_color_2k.jpg (NASA SVS CGI Moon Kit; eşdikdörtgen,
   sol kenar −180°, orta 0°, doğu sağda). Tarayıcıda window.AyRehber, Node'da module.exports. */
(function (kok) {
  'use strict';
  const NODE = typeof module !== 'undefined' && module.exports;
  if (NODE) require('./gok.js');     // ΔT ayarı (IERS) aynı kütüphane örneğine uygulanır
  const A = NODE ? require('./lib/astronomy.browser.min.js') : kok.Astronomy;
  const D = Math.PI / 180;
  const R_AY = 1737.4;      // km, IAU yarıçapı (Horizons Moon fiziksel verisi "Radius (IAU), km = 1737.4")

  const V = (x, y, z) => ({ x, y, z });
  const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const cr = (a, b) => V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  const nrm = a => { const l = Math.hypot(a.x, a.y, a.z) || 1; return V(a.x / l, a.y / l, a.z / l); };
  const sub = (a, b) => V(a.x - b.x, a.y - b.y, a.z - b.z);
  const sc = (a, k) => V(a.x * k, a.y * k, a.z * k);
  const ekle = (a, b) => V(a.x + b.x, a.y + b.y, a.z + b.z);
  const boy180 = x => ((x + 540) % 360) - 180;

  /* Ay gövde çerçevesinin eksenleri (J2000 ekvator koordinatlarında): z kuzey kutbu, x ana meridyen (W dönme açısı) */
  function govde(t) {
    const ax = A.RotationAxis(A.Body.Moon, t);
    const z = nrm(ax.north);
    const q = nrm(cr(V(0, 0, 1), z)), qy = cr(z, q), W = ax.spin * D;
    const x = nrm(ekle(sc(q, Math.cos(W)), sc(qy, Math.sin(W))));
    return { x, y: cr(z, x), z };
  }
  const gvd = (v, g) => V(dot(v, g.x), dot(v, g.y), dot(v, g.z));
  const lonlat = (v, g) => { const b = nrm(gvd(v, g)); return { lon: boy180(Math.atan2(b.y, b.x) / D), lat: Math.asin(Math.max(-1, Math.min(1, b.z))) / D }; };
  const normal = (lon, lat) => V(Math.cos(lat * D) * Math.cos(lon * D), Math.cos(lat * D) * Math.sin(lon * D), Math.sin(lat * D));

  /* Paralaktik açı (Meeus denk. 14.1); H saat açısı, φ enlem, δ dik açıklık (derece) */
  function paralaktik(Hderece, fi, dek) {
    const H = Hderece * D, f = fi * D, d = dek * D;
    return Math.atan2(Math.sin(H), Math.tan(f) * Math.cos(d) - Math.sin(d) * Math.cos(H)) / D;
  }

  /* zaman: Date; gzl: Astronomy Observer (enlem, boylam, yükseklik) */
  function hesap(zaman, gzl) {
    const t = A.MakeTime(zaman);
    const ayG = A.GeoVector(A.Body.Moon, t, true), ov = A.ObserverVector(t, gzl, false);
    const topo = sub(ayG, ov);                                      // gözlemciden Ay'a (AU, J2000)
    const s = nrm(topo);
    const gunesG = A.GeoVector(A.Body.Sun, t, true);
    const gunes = nrm(sub(gunesG, ayG));                             // Ay'dan Güneş'e
    const g = govde(t);
    const altGoz = lonlat(sc(topo, -1), g), altGunes = lonlat(gunes, g);
    /* tepe (başucu) yönü J2000'de: HOR çerçevesinde z; ekran: üst = tepenin gök düzlemine izdüşümü, sağ = s × üst */
    const RH = A.Rotation_HOR_EQJ(t, gzl);
    const tepeV = A.RotateVector(RH, new A.Vector(0, 0, 1, t));
    const tepe = V(tepeV.x, tepeV.y, tepeV.z);
    const ust = nrm(sub(tepe, sc(s, dot(tepe, s))));
    const sag = nrm(cr(s, ust));
    /* Ay'ın kuzeyinin ekrandaki açısı: üstten sağa doğru (saat yönünde) pozitif */
    const kp = sub(g.z, sc(s, dot(g.z, s)));
    const donukluk = Math.atan2(dot(kp, sag), dot(kp, ust)) / D;
    /* NP: kutbun gök kuzeyinden doğuya konum açısı (tarih ekvatoru) — Horizons NP.ang ile karşılaştırılır */
    const RD = A.Rotation_EQJ_EQD(t);
    const r = v => { const w = A.RotateVector(RD, new A.Vector(v.x, v.y, v.z, t)); return V(w.x, w.y, w.z); };
    const sd = r(s), pd = r(g.z);
    const kuzey = nrm(sub(V(0, 0, 1), sc(sd, sd.z))), dogu = nrm(cr(V(0, 0, 1), sd));
    const pp = sub(pd, sc(sd, dot(pd, sd)));
    const npAci = (Math.atan2(dot(pp, dogu), dot(pp, kuzey)) / D + 360) % 360;
    const eq = A.Equator(A.Body.Moon, t, gzl, true, true);
    const yer = A.Horizon(t, gzl, eq.ra, eq.dec, null);
    const saatAcisi = boy180((A.SiderealTime(t) + gzl.longitude / 15 - eq.ra) * 15);
    const q = paralaktik(saatAcisi, gzl.latitude, eq.dec);
    const ill = A.Illumination(A.Body.Moon, t);
    const evreAci = A.MoonPhase(t);
    const buyuyor = evreAci < 180;
    const sabah = boy180(altGunes.lon - 90), aksam = boy180(altGunes.lon + 90);
    return {
      zaman, t, s, gunes, g, ust, sag,
      libBoylam: altGoz.lon, libEnlem: altGoz.lat, gunesBoylam: altGunes.lon, gunesEnlem: altGunes.lat,
      terminatorSabah: sabah, terminatorAksam: aksam, buyuyor, terminator: buyuyor ? sabah : aksam,
      aydinlik: ill.phase_fraction, evreAci, npAci, paralaktik: q, donukluk, saatAcisi,
      yukseklik: yer.altitude, azimut: yer.azimuth, uzaklikKm: Math.hypot(topo.x, topo.y, topo.z) * A.KM_PER_AU, ra: eq.ra, dec: eq.dec
    };
  }

  /* Bir yapı için: o noktada Güneş'in yüksekliği (derece) ve yapının yere göre bakış açısı (görünür mü) */
  function yapiDurumu(d, y) {
    const n = normal(y.boylam, y.enlem);
    const gn = normal(d.gunesBoylam, d.gunesEnlem), on = normal(d.libBoylam, d.libEnlem);
    const gunesYuk = Math.asin(Math.max(-1, Math.min(1, dot(n, gn)))) / D;
    const bakis = dot(n, on);                                        // 1: diskin ortasında, 0: kenarda
    return { gunesYuk, bakis, gorunur: bakis > 0.15 };              // Urania'nın seçimi: kenara 81°'den yakın olanlar çok basık
  }

  /* Sınıra yakın, gölgeleri belirgin yapılar. Urania'nın seçimi: Güneş yapının üstünde 0–10° yüksekte (alçak Güneş uzun
     gölge düşürür) ve yapı görünür yüzde. Kraterler ve sıradağlar, görünen boyca büyükten küçüğe en çok 8 tane; terminatorun
     geçtiği (|Güneş yüksekliği| ≤ 10°) en çok 2 deniz/göl/körfez/bataklık eklenir. */
  const KIRMIZI_KOYU = 0.6;   // Urania'nın seçimi: kırmızı modda doku %60 parlaklıkta çizilir
  const GOLGE = { en: 0, boy: 10 };
  function seckinler(d, yapilar, enCok) {
    const ls = yapilar.map(y => Object.assign({}, y, yapiDurumu(d, y))).filter(y => y.gorunur);
    const golgeli = ls.filter(y => (y.tur === 'krater' || y.tur === 'sıradağ') && y.gunesYuk > GOLGE.en && y.gunesYuk <= GOLGE.boy)
      .sort((a, b) => b.cap * b.bakis - a.cap * a.bakis).slice(0, enCok || 8);
    const duz = ls.filter(y => y.tur !== 'krater' && y.tur !== 'sıradağ' && Math.abs(y.gunesYuk) <= GOLGE.boy)
      .sort((a, b) => Math.abs(a.gunesYuk) - Math.abs(b.gunesYuk)).slice(0, 2);
    return golgeli.concat(duz);
  }

  /* Ekran koordinatı: disk merkezi (0,0), yarıçap 1; x sağa, y yukarı. Görünmüyorsa null. */
  function ekranXY(d, boylam, enlem) {
    const n = normal(boylam, enlem);
    const p = ekle(ekle(sc(d.g.x, n.x), sc(d.g.y, n.y)), sc(d.g.z, n.z));   // J2000 yön
    if (dot(p, d.s) > 0) return null;                                        // arka yüz
    return { x: dot(p, d.sag), y: dot(p, d.ust) };
  }

  /* Bir gece uygun mu: Ay en az 15° yüksekte, gök karanlık (Güneş −6°'nin altında), aydınlık %5–%97 (Urania'nın seçimi:
     yeni Ay'da görülecek bir şey yok, dolunayda terminator kenarda, gölge yok). Gece aralığını gok.js verir. */
  const UYGUN = { alt: 15, enAz: 0.05, enCok: 0.97 };
  function geceEnIyi(gece, gzl) {
    if (!gece || !gece.geceBas || !gece.geceSon) return null;
    let en = null;
    for (let t = gece.geceBas.getTime(); t <= gece.geceSon.getTime(); t += 15 * 60e3) {
      const tt = A.MakeTime(new Date(t));
      const eq = A.Equator(A.Body.Moon, tt, gzl, true, true);
      const h = A.Horizon(tt, gzl, eq.ra, eq.dec, null).altitude;
      if (!en || h > en.alt) en = { zaman: new Date(t), alt: h };
    }
    if (!en) return null;
    const f = A.Illumination(A.Body.Moon, A.MakeTime(en.zaman)).phase_fraction;
    return Object.assign(en, { aydinlik: f, uygun: en.alt >= UYGUN.alt && f >= UYGUN.enAz && f <= UYGUN.enCok,
      neden: f < UYGUN.enAz ? 'yeni' : f > UYGUN.enCok ? 'dolunay' : en.alt < UYGUN.alt ? 'ufuk' : null });
  }
  /* geceAraligi: gok.js Gok.geceAraligi(gun, gzl); gün gün en çok 40 gece ilerler */
  function sonrakiUygun(gun, gzl, geceAraligi) {
    for (let i = 1; i <= 40; i++) {
      const g = geceAraligi(new Date(gun.getTime() + i * 86400e3), gzl);
      const e = geceEnIyi(g, gzl);
      if (e && e.uygun) return e;
    }
    return null;
  }

  /* ---------- çizim ---------- */
  let dokuVeri = null, sonEtiketler = [];
  function dokuHazirla(img) {
    if (dokuVeri && dokuVeri.img === img) return dokuVeri;
    const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
    dokuVeri = { img, w: c.width, h: c.height, p: x.getImageData(0, 0, c.width, c.height).data };
    return dokuVeri;
  }
  /* cv: canvas; d: hesap(); img: yüklenmiş doku (yoksa düz gri); s: { yapilar (numaralı), vurgu (ad), renk(fn), kirmizi } */
  function ciz(cv, d, img, s) {
    s = s || {};
    const W = cv.width, H = cv.height, R = Math.min(W, H) / 2 - 2, cx = W / 2, cy = H / 2;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    const out = ctx.createImageData(W, H), o = out.data;
    const T = img ? dokuHazirla(img) : null;
    const gx = d.g.x, gy = d.g.y, gz = d.g.z, sg = d.sag, us = d.ust, ss = d.s, gn = d.gunes;
    for (let py = 0; py < H; py++) {
      const y = (cy - py) / R;
      for (let px = 0; px < W; px++) {
        const x = (px - cx) / R, r2 = x * x + y * y;
        if (r2 > 1) continue;
        const zz = Math.sqrt(1 - r2);
        const P = V(x * sg.x + y * us.x - zz * ss.x, x * sg.y + y * us.y - zz * ss.y, x * sg.z + y * us.z - zz * ss.z);
        const bx = dot(P, gx), by = dot(P, gy), bz = dot(P, gz);
        const lon = Math.atan2(by, bx), lat = Math.asin(Math.max(-1, Math.min(1, bz)));
        let rr = 150, gg = 150, bb = 150;
        if (T) {
          const tx = Math.min(T.w - 1, Math.floor((lon / (2 * Math.PI) + 0.5) * T.w)), ty = Math.min(T.h - 1, Math.floor((0.5 - lat / Math.PI) * T.h));
          const k = (ty * T.w + tx) * 4; rr = T.p[k]; gg = T.p[k + 1]; bb = T.p[k + 2];
        }
        /* aydınlatma: gece yüzü %8 (Urania'nın seçimi: dünya ışığıyla seçilebilen soluk yüz), sınırda yumuşak geçiş */
        const c = dot(P, gn); let isik = c > 0.03 ? 1 : c < -0.03 ? 0.08 : 0.08 + 0.92 * (c + 0.03) / 0.06;
        const i = (py * W + px) * 4;
        if (s.kirmizi) isik *= KIRMIZI_KOYU;   // kırmızı süzgeçte aydınlık yüz doymasın, halkalar seçilsin
        o[i] = rr * isik; o[i + 1] = gg * isik; o[i + 2] = bb * isik; o[i + 3] = 255;
      }
    }
    ctx.putImageData(out, 0, 0);
    const renk = s.renk || (() => '#E8C27A');
    const halkalar = [];
    (s.yapilar || []).forEach((y, i) => {
      const e = ekranXY(d, y.boylam, y.enlem); if (!e) return;
      const X = cx + e.x * R, Y = cy - e.y * R;
      const rr = Math.max(4, (y.cap / 2) / R_AY * R * Math.max(0.35, y.bakis || 1));
      const vurgu = s.vurgu === y.ad;
      /* koyu hale + renkli halka: aydınlık yüzde de seçilsin (kırmızı modda renk farkı kalmaz) */
      ctx.beginPath(); ctx.arc(X, Y, rr, 0, 2 * Math.PI);
      ctx.lineWidth = (vurgu ? 3 : 1.4) + 2.5; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.stroke();
      ctx.lineWidth = vurgu ? 3 : 1.4;
      ctx.strokeStyle = vurgu ? renk('--pirinc') : renk('--hedef');
      ctx.stroke();
      halkalar.push({ i, X, Y, rr, vurgu });
    });
    /* Numara etiketleri: önce dışa doğru (Ay merkezinden uzağa), çakışırsa 45° adımlarla dönen, sonra biraz daha uzak
       yerler denenir; etiket kutuları (fs × fs) birbirine ve küçük halkaların merkezine binmez. */
    const fs = Math.round(Math.max(11, R / 14)), yer = [];
    const cakisir = (x, y) => yer.some(q => Math.abs(q.x - x) < fs * 1.1 && Math.abs(q.y - y) < fs * 0.95)
      || halkalar.some(h => h.rr < fs && Math.hypot(h.X - x, h.Y - y) < fs * 0.7);
    halkalar.forEach(h => {
      const dis = Math.atan2(h.Y - cy, h.X - cx);
      let en = null;
      for (const ek of [0, fs * 0.9, fs * 1.8]) {
        for (const da of [0, 1, -1, 2, -2, 3, -3, 4]) {
          const a = dis + da * Math.PI / 4, r0 = h.rr + fs * 0.6 + ek;
          const x = h.X + Math.cos(a) * r0, y = h.Y + Math.sin(a) * r0;
          if (x < fs / 2 || x > W - fs / 2 || y < fs / 2 || y > H - fs / 2) continue;
          if (!cakisir(x, y)) { en = { x, y }; break; }
        }
        if (en) break;
      }
      if (!en) en = { x: h.X + Math.cos(dis) * (h.rr + fs * 0.6), y: h.Y + Math.sin(dis) * (h.rr + fs * 0.6) };
      yer.push({ x: en.x, y: en.y, no: h.i + 1 });
      ctx.font = (h.vurgu ? '600 ' : '500 ') + fs + 'px Plex, sans-serif';
      ctx.fillStyle = h.vurgu ? renk('--pirinc') : renk('--parsomen');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.strokeText(String(h.i + 1), en.x, en.y);
      ctx.fillText(String(h.i + 1), en.x, en.y);
    });
    sonEtiketler = yer;
    /* tepe işareti: dürbünde yukarısı */
    ctx.fillStyle = renk('--soluk'); ctx.font = '500 ' + Math.round(Math.max(10, R / 16)) + 'px Plex, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('↑ tepe', 3, 3);
    return { R, cx, cy, etiketler: yer };
  }

  const AyRehber = { sonEtiketler: () => sonEtiketler, hesap, govde, lonlat, normal, ekranXY, yapiDurumu, seckinler, geceEnIyi, sonrakiUygun, paralaktik, ciz, GOLGE, UYGUN, R_AY };
  if (NODE) module.exports = AyRehber;
  else kok.AyRehber = AyRehber;
})(typeof self !== 'undefined' ? self : this);
