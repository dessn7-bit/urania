/* ar.js — "Gökyüzüne bak": telefonu gökyüzüne tut, ekranda o yöndeki yıldızlar,
   takımyıldızlar, gezegenler ve Ay. Telefonun yön algılayıcıları (pusula + jiroskop)
   kullanılır; algılayıcı yoksa parmakla sürükleyerek gezilir.

   Koordinatlar (W3C DeviceOrientation): dünya çerçevesi x Doğu, y Kuzey, z Yukarı.
   R = Rz(α)·Rx(β)·Ry(γ) cihaz eksenlerini dünya çerçevesine taşır. Arka kamera
   cihazın −z yönüne bakar; ekranın sağı +x, üstü +y. */
(function () {
  'use strict';
  const G = window.Gok, U = window.Urania;
  const DER = Math.PI / 180;

  let el = null, cv = null, ctx = null, video = null;
  let veri = null;
  let calisiyor = false, kare = null, sayac = null, kilit = null;
  const st = {
    mod: 'bekliyor',          // 'algilayici' | 'dokunma' | 'bekliyor'
    R: null,                  // süzülmüş dönüş matrisi (3x3, satır dizileri)
    sonOlay: 0,
    manyetik: true,           // α manyetik kuzeye göre mi (sapma düzeltmesi uygulanır)
    sapma: 0,                 // manyetik sapma (°, doğu +) — WMM-2025
    kal: U.oku('arKalibrasyon', 0), // kullanıcı hizalaması (°)
    az0: 180, alt0: 30,       // dokunma modunda bakış yönü
    gorus: 62,                // dikey görüş açısı (°), iki parmakla değişir
    kamera: false,
    hedef: null,              // aranan cisim
    hizalama: false,
    zaman: null,
    nesneler: null            // saniyede bir yenilenen ENU vektörleri
  };

  /* ---------- Matematik ---------- */
  function eulerdenMatris(a, b, g) {
    const cA = Math.cos(a * DER), sA = Math.sin(a * DER), cB = Math.cos(b * DER), sB = Math.sin(b * DER), cG = Math.cos(g * DER), sG = Math.sin(g * DER);
    return [
      [cA * cG - sA * sB * sG, -cB * sA, cG * sA * sB + cA * sG],
      [cG * sA + cA * sB * sG, cA * cB, sA * sG - cA * cG * sB],
      [-cB * sG, sB, cB * cG]
    ];
  }
  /* Titremeyi azaltan süzgeç: matrisler harmanlanır, sonra yeniden diklik sağlanır (Gram-Schmidt). */
  function suz(eski, yeni, k) {
    if (!eski) return yeni;
    const m = eski.map((r, i) => r.map((v, j) => v + (yeni[i][j] - v) * k));
    let x = [m[0][0], m[1][0], m[2][0]], y = [m[0][1], m[1][1], m[2][1]];
    const n = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return v.map(c => c / l); };
    x = n(x);
    const d = x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
    y = n([y[0] - d * x[0], y[1] - d * x[1], y[2] - d * x[2]]);
    const z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
    return [[x[0], y[0], z[0]], [x[1], y[1], z[1]], [x[2], y[2], z[2]]];
  }
  function enu(alt, az) {
    const c = Math.cos(alt * DER);
    return [c * Math.sin(az * DER), c * Math.cos(az * DER), Math.sin(alt * DER)];
  }
  function bakisYonu(R) {
    const e = -R[0][2], n = -R[1][2], u = -R[2][2];
    let az = Math.atan2(e, n) / DER; if (az < 0) az += 360;
    return { az, alt: Math.asin(Math.max(-1, Math.min(1, u))) / DER };
  }
  function ekranAcisi() {
    const a = (screen.orientation && typeof screen.orientation.angle === 'number') ? screen.orientation.angle : (window.orientation || 0);
    return ((a % 360) + 360) % 360;
  }

  /* ---------- Algılayıcılar ---------- */
  function yonOlayi(e, mutlak) {
    if (e.alpha == null && e.webkitCompassHeading == null) return;
    let alfa;
    if (typeof e.webkitCompassHeading === 'number') {
      alfa = 360 - e.webkitCompassHeading;   // iOS: manyetik pusula başlığı
      st.manyetik = true;
    } else {
      alfa = e.alpha;
      st.manyetik = mutlak;
    }
    /* Manyetik kuzeyden gerçek kuzeye (sapma) + kullanıcı hizalaması: başlık = 360 − α */
    const a = alfa - (st.manyetik ? st.sapma : 0) - st.kal;
    const yeni = eulerdenMatris(a, e.beta || 0, e.gamma || 0);
    st.R = suz(st.R, yeni, 0.25);
    st.sonOlay = performance.now();
    if (st.mod !== 'algilayici') {
      st.mod = 'algilayici'; durumYaz();
      const pd = el && el.querySelector('#arPusula'); if (pd) pd.hidden = true; // veri geliyorsa izin düğmesine gerek yok
    }
  }
  const mutlakDinle = e => yonOlayi(e, true);
  /* Göreli olay: mutlak olay hiç gelmiyorsa (pusulasız cihaz) kullanılır; kuzey için "Hizala" gerekir */
  const goreliDinle = e => {
    if (e.absolute || typeof e.webkitCompassHeading === 'number') { yonOlayi(e, true); return; }
    if (e.alpha != null) st.goreliVar = true;
    if (!('ondeviceorientationabsolute' in window) || st.goreliKabul) yonOlayi(e, false);
  };

  /* iOS: izin isteği doğrudan bir dokunuşla tetiklenmeli; bu yüzden "Pusulayı aç" düğmesi gösterilir */
  function izinGerekli() { return typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function'; }
  async function izinIste() {
    try {
      const r = await DeviceOrientationEvent.requestPermission();
      st.izinYok = r !== 'granted';
      el.querySelector('#arPusula').hidden = r === 'granted';
      if (r === 'granted') { st.mod = 'bekliyor'; durumYaz('Telefonu gökyüzüne tut.'); }
      else durumYaz('Yön algılayıcı izni verilmedi; parmağınla sürükleyerek gezebilirsin.');
    } catch (h) { durumYaz('Pusula izni istenemedi; parmağınla sürükleyerek gezebilirsin.'); }
  }
  function algilayicilariBaslat() {
    if (izinGerekli()) el.querySelector('#arPusula').hidden = false;
    if ('ondeviceorientationabsolute' in window) window.addEventListener('deviceorientationabsolute', mutlakDinle);
    window.addEventListener('deviceorientation', goreliDinle);
    /* 1,5 sn içinde veri gelmezse (masaüstü, algılayıcısız cihaz) dokunma moduna geç */
    setTimeout(() => {
      if (st.mod === 'algilayici') return;
      if (st.goreliVar) { st.goreliKabul = true; durumYaz('Bu cihazın pusulası kuzeyi bildirmiyor. Telefonu gökyüzüne tut ve bir kez "Hizala"ya bas.'); return; }
      if (izinGerekli() && !el.querySelector('#arPusula').hidden) { dokunmaModu('Pusulayı kullanmak için üstteki "Pusulayı aç"a dokun; o zamana kadar parmağınla sürükleyebilirsin.'); return; }
      dokunmaModu(st.izinYok ? 'Yön algılayıcı izni verilmedi; parmağınla sürükleyerek gezebilirsin.' : 'Bu cihazda yön algılayıcısı yanıt vermedi; parmağınla sürükleyerek gezebilirsin.');
    }, 1500);
  }
  function algilayicilariDurdur() {
    window.removeEventListener('deviceorientationabsolute', mutlakDinle);
    window.removeEventListener('deviceorientation', goreliDinle);
  }
  function dokunmaModu(mesaj) {
    if (st.mod === 'algilayici') return;
    st.mod = 'dokunma';
    st.R = eulerdenMatris(-st.az0, 90 + st.alt0, 0);
    durumYaz(mesaj);
  }

  /* ---------- Dokunma: sürükleme ve iki parmakla yakınlaştırma ---------- */
  let surukle = null, kistirma = null;
  function dokunmaBagla() {
    cv.addEventListener('pointerdown', e => {
      cv.setPointerCapture(e.pointerId);
      surukle = { x: e.clientX, y: e.clientY, az: st.az0, alt: st.alt0, id: e.pointerId, t: performance.now(), hareket: 0 };
    });
    cv.addEventListener('pointermove', e => {
      if (!surukle || e.pointerId !== surukle.id || kistirma) return;
      const dx = e.clientX - surukle.x, dy = e.clientY - surukle.y;
      surukle.hareket = Math.max(surukle.hareket, Math.hypot(dx, dy));
      if (st.mod !== 'dokunma') return;
      const derPx = st.gorus / cv.clientHeight;
      st.az0 = ((surukle.az - dx * derPx) % 360 + 360) % 360;
      st.alt0 = Math.max(-30, Math.min(90, surukle.alt + dy * derPx));
      st.R = eulerdenMatris(-st.az0, 90 + st.alt0, 0);
    });
    cv.addEventListener('pointerup', e => {
      if (surukle && surukle.hareket < 8) dokunusTanimla(e.clientX, e.clientY);
      surukle = null;
    });
    cv.addEventListener('touchstart', e => {
      if (e.touches.length === 2) kistirma = { d: mesafe(e.touches), g: st.gorus };
    }, { passive: true });
    cv.addEventListener('touchmove', e => {
      if (kistirma && e.touches.length === 2) st.gorus = Math.max(15, Math.min(110, kistirma.g * kistirma.d / mesafe(e.touches)));
    }, { passive: true });
    cv.addEventListener('touchend', e => { if (e.touches.length < 2) kistirma = null; }, { passive: true });
    cv.addEventListener('wheel', e => { e.preventDefault(); st.gorus = Math.max(15, Math.min(110, st.gorus * (1 + Math.sign(e.deltaY) * 0.08))); }, { passive: false });
  }
  function mesafe(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }

  /* ---------- Gök verisi: saniyede bir ENU vektörleri ---------- */
  function nesneleriYenile() {
    const k = U.konum();
    const gzl = G.gozlemci(k.enlem, k.boylam, k.yukseklik || 0);
    const an = new Date();
    st.zaman = an;
    const m = G.ufukMatrisi(an, gzl);
    /* HOR (x kuzey, y batı, z yukarı) → ENU (x doğu, y kuzey, z yukarı) */
    const hor2enu = v => {
      const x = m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2];
      const y = m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2];
      const z = m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2];
      return [-y, x, z];
    };
    const ys = veri.yildizlar.y;
    if (!st.yildizV) st.yildizV = ys.map(s => G.birimVektor(s[0], s[1]));
    if (!st.tyV) st.tyV = veri.takimyildizlar.map(t => ({ ad: t.ad, r: t.r || 3, m: G.birimVektor(t.m[0], t.m[1]), c: t.c.map(c => c.map(n => G.birimVektor(n[0], n[1]))) }));
    const yildiz = new Float32Array(ys.length * 3);
    st.yildizV.forEach((v, i) => { const e = hor2enu(v); yildiz[i * 3] = e[0]; yildiz[i * 3 + 1] = e[1]; yildiz[i * 3 + 2] = e[2]; });
    const ty = st.tyV.map(t => ({ ad: t.ad, r: t.r, m: hor2enu(t.m), c: t.c.map(c => c.map(hor2enu)) }));
    const hedefler = veri.hedefler.map(h => ({ ad: h.ad, kisa: h.kisa, tur: h.turAd, kadir: h.kadir, v: hor2enu(G.birimVektor(h.ra, h.dec)) }));
    const cisimler = ['Sun', 'Moon'].concat(G.GEZEGENLER).map(c => {
      const p = G.cisimAltAz(c, an, gzl);
      const kadir = G.A.Illumination(c, an).mag;
      return { id: c, ad: G.TR_AD[c], alt: p.alt, az: p.az, kadir, v: enu(p.alt, p.az) };
    });
    const ay = G.ayDurumu(an, gzl);
    st.nesneler = { yildiz, ty, hedefler, cisimler, ay };
    st.konum = k;
    /* Uydular: yaklaşan/süren geçişlerin yolu dakikada bir yenilenir */
    if (st.uydular && window.Uydu && (!st.issZaman || an - st.issZaman > 60e3)) {
      st.uyduGecis = st.uydular.map(u => { try { return Uydu.yakinGecis(u, k, an); } catch (h) { return null; } });
      st.issZaman = an;
    }
    if (!st.sapmaHesaplandi && window.Geomag) {
      try { st.sapma = window.Geomag.sapma(k.enlem, k.boylam, an); } catch (h) { st.sapma = 0; }
      st.sapmaHesaplandi = true;
    }
  }

  /* ---------- Çizim ---------- */
  function renk(ad) { return getComputedStyle(document.documentElement).getPropertyValue(ad).trim(); }
  let olcu = null, isabet = [];

  function ciz() {
    if (!calisiyor) return;
    kare = requestAnimationFrame(ciz);
    if (!st.R || !st.nesneler) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const kir = document.documentElement.classList.contains('kirmizi');
    const f = (H / 2) / Math.tan(st.gorus / 2 * DER);
    const R = st.R, ang = ekranAcisi() * DER, cA = Math.cos(ang), sA = Math.sin(ang);
    const cx = W / 2, cy = H / 2;
    olcu = { W, H, f };
    isabet = [];

    /* ENU vektörü → ekran (arkadaysa null) */
    function yansit(v) {
      const dx = R[0][0] * v[0] + R[1][0] * v[1] + R[2][0] * v[2];
      const dy = R[0][1] * v[0] + R[1][1] * v[1] + R[2][1] * v[2];
      const dz = R[0][2] * v[0] + R[1][2] * v[1] + R[2][2] * v[2];
      if (dz > -0.02) return null;
      /* Ekran döndüyse (yatay tutuş) cihaz eksenleri −θ kadar döndürülür:
         θ=90° (saat yönünün tersine yatırılmış) → kullanıcının "yukarı"sı cihazın +x'i */
      const x = dx * cA - dy * sA, y = dx * sA + dy * cA;
      return { x: cx + f * x / -dz, y: cy - f * y / -dz };
    }

    /* Zemin: kamera açıksa saydam; değilse gökyüzü rengi */
    ctx.clearRect(0, 0, W, H);
    const gunes = st.nesneler.cisimler[0];
    if (!st.kamera) {
      let gok = kir ? '#000' : '#0B1626';
      if (!kir) { if (gunes.alt > 0) gok = '#2F5378'; else if (gunes.alt > -6) gok = '#203A58'; else if (gunes.alt > -12) gok = '#162A42'; }
      ctx.fillStyle = gok; ctx.fillRect(0, 0, W, H);
    }

    /* Ufuk altı karartma: ufuk çizgisini örnekle, altını boya */
    const ufuk = [];
    for (let az = 0; az <= 360; az += 3) ufuk.push(yansit(enu(0, az)));
    ctx.strokeStyle = renk('--pirinc'); ctx.lineWidth = 1.5;
    ctx.beginPath();
    let acik = false;
    ufuk.forEach(p => { if (!p) { acik = false; return; } if (acik) ctx.lineTo(p.x, p.y); else { ctx.moveTo(p.x, p.y); acik = true; } });
    ctx.stroke();
    /* Bakış yönü ufkun altındaysa zemin tonu */
    const bakis = bakisYonu(R);
    if (bakis.alt < -5 && !st.kamera) { ctx.fillStyle = kir ? 'rgba(40,0,0,.5)' : 'rgba(10,14,10,.55)'; ctx.fillRect(0, 0, W, H); }

    /* Yön harfleri ufukta */
    ctx.font = '600 15px Plex, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    [['K', 0], ['KD', 45], ['D', 90], ['GD', 135], ['G', 180], ['GB', 225], ['B', 270], ['KB', 315]].forEach(([h, az]) => {
      const p = yansit(enu(0, az)); if (!p) return;
      ctx.fillStyle = h.length === 1 ? renk('--pirinc') : renk('--soluk');
      ctx.fillText(h, p.x, p.y + 14);
    });

    /* Takımyıldız çizgileri ve adları */
    ctx.strokeStyle = kir ? 'rgba(194,58,46,.4)' : 'rgba(200,164,93,.45)'; ctx.lineWidth = 1;
    st.nesneler.ty.forEach(t => {
      t.c.forEach(cz => {
        let o = null;
        cz.forEach(v => { const p = yansit(v); if (o && p && Math.abs(o.x - p.x) < W && Math.abs(o.y - p.y) < H) { ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(p.x, p.y); ctx.stroke(); } o = p; });
      });
    });
    ctx.font = 'italic 400 15px Spectral, Georgia, serif';
    ctx.fillStyle = kir ? 'rgba(194,58,46,.7)' : 'rgba(233,226,208,.55)';
    st.nesneler.ty.forEach(t => {
      if (st.gorus > 70 && t.r > 2) return;
      const p = yansit(t.m); if (!p || p.x < 0 || p.x > W || p.y < 0 || p.y > H) return;
      ctx.fillText(t.ad, p.x, p.y);
      isabet.push({ x: p.x, y: p.y, o: 0, ad: t.ad, alt: 'takımyıldızı' });
    });

    /* Yıldızlar */
    const limit = U.oku('limitKadir', 4) + (st.gorus < 40 ? 1 : 0);
    const ys = veri.yildizlar.y, Y = st.nesneler.yildiz;
    const olc = Math.min(1.6, Math.max(0.8, 62 / st.gorus));
    ctx.textAlign = 'left';
    for (let i = 0; i < ys.length; i++) {
      const m = ys[i][2];
      if (m > limit) break; // dizi parlaklığa göre sıralı
      const p = yansit([Y[i * 3], Y[i * 3 + 1], Y[i * 3 + 2]]);
      if (!p || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;
      const r = Math.max(0.7, (limit + 1.4 - m) * 0.75 * olc);
      const altta = Y[i * 3 + 2] < 0;
      ctx.globalAlpha = altta ? 0.3 : 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = renk('--yildiz'); ctx.fill();
      const ad = veri.yildizlar.adlar[i];
      if (ad && m < 2.2) {
        ctx.font = '500 13px Plex, system-ui, sans-serif'; ctx.fillStyle = kir ? renk('--soluk') : 'rgba(233,226,208,.8)';
        ctx.fillText(ad, p.x + r + 4, p.y);
      }
      ctx.globalAlpha = 1;
      if (m < 4) isabet.push({ x: p.x, y: p.y, o: 1, ad: ad || 'Yıldız', alt: U.kadir(m) + ' kadir' + (altta ? ' · ufkun altında' : '') });
    }

    /* Dürbün hedefleri */
    st.nesneler.hedefler.forEach(h => {
      const p = yansit(h.v); if (!p) return;
      ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.strokeStyle = renk('--hedef'); ctx.lineWidth = 1.3; ctx.stroke();
      ctx.font = '500 12px Plex, system-ui, sans-serif'; ctx.fillStyle = renk('--hedef');
      ctx.fillText(h.kisa, p.x + 10, p.y);
      isabet.push({ x: p.x, y: p.y, o: 2, ad: h.ad, alt: h.tur + ' · ' + U.kadir(h.kadir) + ' kadir' });
    });

    /* Güneş, Ay, gezegenler */
    st.nesneler.cisimler.forEach(c => {
      if (c.id !== 'Sun' && c.id !== 'Moon' && c.kadir > 6.5) return;
      const p = yansit(c.v); if (!p) return;
      const altta = c.alt < 0;
      ctx.globalAlpha = altta ? 0.4 : 1;
      if (c.id === 'Sun') {
        ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.fillStyle = kir ? renk('--pirinc') : '#FFD77A'; ctx.fill();
      } else if (c.id === 'Moon') {
        ayCiz(p, yansit(st.nesneler.cisimler[0].v) || { x: p.x + 1, y: p.y }, 13, kir);
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(3, (3.5 - c.kadir) * 1.2), 0, Math.PI * 2); ctx.fillStyle = renk('--gezegen'); ctx.fill();
      }
      ctx.font = '600 15px Plex, system-ui, sans-serif'; ctx.fillStyle = c.id === 'Sun' ? '#FFD77A' : renk('--gezegen');
      if (kir) ctx.fillStyle = renk('--pirinc');
      ctx.fillText(c.ad, p.x + 16, p.y);
      ctx.globalAlpha = 1;
      const not = c.id === 'Sun' ? 'Güneşe dürbünle asla bakma' : (c.id === 'Moon' ? st.nesneler.ay.ad + ', %' + Math.round(st.nesneler.ay.oran * 100) : U.kadir(c.kadir) + ' kadir');
      isabet.push({ x: p.x, y: p.y, o: 4, ad: c.ad, alt: not + (altta ? ' · ufkun altında' : '') });
    });

    /* Uzay İstasyonu: anlık konum (ışıkta dolu, gölgede boş halka) ve yaklaşan geçişin yolu */
    issCiz(yansit, W, H, kir);

    /* Aranan cisim: görünüyorsa halka, değilse kenarda ok */
    if (st.hedef) hedefGoster(yansit, W, H, cx, cy);

    /* Nişangâh ve merkezdeki cisim */
    ctx.strokeStyle = renk('--parsomen'); ctx.globalAlpha = 0.6; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.moveTo(cx - 28, cy); ctx.lineTo(cx - 20, cy); ctx.moveTo(cx + 20, cy); ctx.lineTo(cx + 28, cy); ctx.moveTo(cx, cy - 28); ctx.lineTo(cx, cy - 20); ctx.moveTo(cx, cy + 20); ctx.lineTo(cx, cy + 28); ctx.stroke();
    ctx.globalAlpha = 1;
    merkezYaz(bakis, cx, cy);
  }

  function uyduAnlik(id) {
    if (!st.uydular || !st.konum || !window.Uydu) return null;
    const u = st.uydular.find(x => x.id === id); if (!u) return null;
    try { return Uydu.anlik(u, st.konum, new Date()); } catch (h) { return null; }
  }
  function issCiz(yansit, W, H, kir) {
    if (!st.uydular) return;
    st.uydular.forEach((u, i) => uyduCiz(u, st.uyduGecis && st.uyduGecis[i], yansit, kir));
  }
  function uyduCiz(u, g, yansit, kir) {
    const renkI = kir ? renk('--pirinc') : '#9FE3C7';
    if (g && g.gorunur && g.bitis.t > new Date() && g.yol.length > 1) {
      ctx.save(); ctx.setLineDash([5, 6]); ctx.strokeStyle = renkI; ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5;
      ctx.beginPath(); let o = null;
      g.yol.forEach(d => { const p = yansit(enu(d.alt, d.az)); if (o && p) ctx.lineTo(p.x, p.y); else if (p) ctx.moveTo(p.x, p.y); o = p; });
      ctx.stroke(); ctx.restore();
      ctx.font = '500 12px Plex, system-ui, sans-serif'; ctx.fillStyle = renkI; ctx.textAlign = 'left';
      g.yol.forEach(d => {
        if (d.t.getSeconds() !== 0 || d.alt < 0) return;
        const p = yansit(enu(d.alt, d.az)); if (!p) return;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillText(U.saat(d.t), p.x + 6, p.y - 8);
      });
    }
    const d = uyduAnlik(u.id);
    if (!d || d.alt < -2) return;
    const p = yansit(enu(d.alt, d.az)); if (!p) return;
    ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.strokeStyle = renkI; ctx.lineWidth = 2; ctx.stroke();
    if (d.isikli) { ctx.fillStyle = renkI; ctx.fill(); }
    ctx.font = '600 14px Plex, system-ui, sans-serif'; ctx.fillStyle = renkI; ctx.textAlign = 'left';
    ctx.fillText(u.kisa, p.x + 10, p.y);
    isabet.push({ x: p.x, y: p.y, o: 5, ad: u.ad, alt: (d.isikli ? 'Güneş ışığı alıyor' : 'Dünya\'nın gölgesinde, görünmez') + ' · ' + U.sayi(d.uzaklik, 0) + ' km uzakta' });
  }

  function ayCiz(p, gs, r, kir) {
    const yon = Math.atan2(gs.y - p.y, gs.x - p.x);
    const k = st.nesneler.ay.oran;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(yon);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = kir ? '#2A0505' : '#3A4558'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.ellipse(0, 0, Math.abs(1 - 2 * k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k < 0.5);
    ctx.fillStyle = renk('--ay'); ctx.fill();
    ctx.restore();
  }

  function hedefGoster(yansit, W, H, cx, cy) {
    const v = hedefVektor(st.hedef);
    if (!v) return;
    const p = yansit(v);
    const ic = p && p.x > 30 && p.x < W - 30 && p.y > 80 && p.y < H - 120;
    ctx.strokeStyle = renk('--uyari'); ctx.fillStyle = renk('--uyari'); ctx.lineWidth = 2;
    if (ic) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 24, 0, Math.PI * 2); ctx.stroke();
      return;
    }
    /* Ok: ekran düzlemindeki yön (arkadaysa ters çevrilmiş izdüşümü kullan) */
    const R = st.R, ang = ekranAcisi() * DER;
    const dx = R[0][0] * v[0] + R[1][0] * v[1] + R[2][0] * v[2];
    const dy = R[0][1] * v[0] + R[1][1] * v[1] + R[2][1] * v[2];
    let x = dx * Math.cos(ang) - dy * Math.sin(ang), y = dx * Math.sin(ang) + dy * Math.cos(ang);
    if (Math.hypot(x, y) < 1e-6) x = 1;
    const a = Math.atan2(-y, x);
    /* Ok, nişangâhın çevresindeki bir çemberde: üst menü ve alt bilgiyle çakışmaz */
    const yc = Math.min(W / 2 - 40, H / 2 - 170, 140);
    const ox = cx + Math.cos(a) * yc, oy = cy + Math.sin(a) * yc;
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(-10, -15); ctx.lineTo(-4, 0); ctx.lineTo(-10, 15); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function hedefVektor(h) {
    const n = st.nesneler; if (!n) return null;
    if (h.tur === 'cisim') { const c = n.cisimler.find(x => x.id === h.id); return c && c.v; }
    if (h.tur === 'hedef') { const c = n.hedefler.find(x => x.ad === h.id); return c && c.v; }
    if (h.tur === 'yildiz') { const i = h.id; return [n.yildiz[i * 3], n.yildiz[i * 3 + 1], n.yildiz[i * 3 + 2]]; }
    if (h.tur === 'ty') { const t = n.ty.find(x => x.ad === h.id); return t && t.m; }
    if (h.tur === 'iss') { const d = uyduAnlik(h.id); return d && enu(d.alt, d.az); }
    return null;
  }

  /* Aranan cisme yön tarifi: sağa/sola ve yukarı/aşağı kaç derece */
  let sonTarif = '';
  function tarifYaz(bakis) {
    if (!st.hedef) return;
    const v = hedefVektor(st.hedef); if (!v) return;
    const hAz = (Math.atan2(v[0], v[1]) / DER + 360) % 360, hAlt = Math.asin(v[2]) / DER;
    const dAz = ((hAz - bakis.az + 540) % 360) - 180, dAlt = hAlt - bakis.alt;
    let m;
    if (Math.abs(dAz) < 3 && Math.abs(dAlt) < 3) m = 'tam karşında';
    else {
      const p = [];
      if (Math.abs(dAz) >= 3) p.push((dAz > 0 ? 'sağa ' : 'sola ') + U.derece(Math.abs(dAz)));
      if (Math.abs(dAlt) >= 3) p.push((dAlt > 0 ? 'yukarı ' : 'aşağı ') + U.derece(Math.abs(dAlt)));
      m = p.join(', ');
    }
    if (hAlt < 0) m += ' · ufkun altında';
    if (m !== sonTarif) { el.querySelector('#arTarif').textContent = m; sonTarif = m; }
  }

  /* Merkezdeki en yakın cisim + bakılan yön */
  let sonMerkez = '', sonDuyuru = '';
  function merkezYaz(bakis, cx, cy) {
    tarifYaz(bakis);
    let en = null;
    isabet.forEach(h => { const d = Math.hypot(h.x - cx, h.y - cy) - h.o * 3; if (d < 40 && (!en || d < en.d)) en = { d, h }; });
    const yonMetin = Urania.derece(bakis.az) + ' ' + G.yon(bakis.az) + ' · yükseklik ' + Urania.derece(bakis.alt);
    const html = (en ? '<b>' + U.kacis(en.h.ad) + '</b> · ' + U.kacis(en.h.alt) : '<span class="soluk">Nişangâhı bir cisme getir</span>') + '<span class="ar-yon">' + yonMetin + '</span>';
    if (html !== sonMerkez) { el.querySelector('#arMerkez').innerHTML = html; sonMerkez = html; }
    /* Ekran okuyucuya yalnız nişangâhtaki cisim değişince söyle (her derecede değil) */
    const ad = en ? en.h.ad : '';
    if (ad !== sonDuyuru) { sonDuyuru = ad; el.querySelector('#arDuyuru').textContent = ad ? 'Nişangâhta: ' + ad : ''; }
  }

  function dokunusTanimla(x, y) {
    const b = cv.getBoundingClientRect();
    const px = x - b.left, py = y - b.top;
    let en = null;
    isabet.forEach(h => { const d = Math.hypot(h.x - px, h.y - py) - h.o * 3; if (d < 30 && (!en || d < en.d)) en = { d, h }; });
    const k = el.querySelector('#arBilgi');
    if (!en) { k.hidden = true; return; }
    k.innerHTML = '<b>' + U.kacis(en.h.ad) + '</b> · ' + U.kacis(en.h.alt);
    k.hidden = false;
    clearTimeout(k._t); k._t = setTimeout(() => { k.hidden = true; }, 5000);
  }

  /* ---------- Arama ---------- */
  function aramaListesi() {
    const n = st.nesneler; if (!n) return [];
    const ls = [];
    n.cisimler.forEach(c => { if (c.id === 'Sun' || c.kadir <= 8) ls.push({ tur: 'cisim', id: c.id, ad: c.ad, alt: c.alt, grup: 'Güneş Sistemi' }); });
    (st.uydular || []).forEach(u => { const d = uyduAnlik(u.id); if (d) ls.push({ tur: 'iss', id: u.id, ad: u.ad, alt: d.alt, grup: 'Güneş Sistemi' }); });
    n.hedefler.forEach(h => ls.push({ tur: 'hedef', id: h.ad, ad: h.ad, alt: Math.asin(h.v[2]) / DER, grup: 'Dürbün hedefleri' }));
    Object.keys(veri.yildizlar.adlar).forEach(i => {
      if (veri.yildizlar.y[i][2] > 3) return;
      const z = n.yildiz[i * 3 + 2];
      ls.push({ tur: 'yildiz', id: Number(i), ad: veri.yildizlar.adlar[i], alt: Math.asin(z) / DER, grup: 'Parlak yıldızlar' });
    });
    n.ty.forEach(t => ls.push({ tur: 'ty', id: t.ad, ad: t.ad, alt: Math.asin(t.m[2]) / DER, grup: 'Takımyıldızlar' }));
    return ls;
  }
  function aramaAc() {
    const d = el.querySelector('#arArama');
    const yaz = () => {
      const q = el.querySelector('#arAra').value.trim().toLocaleLowerCase('tr-TR');
      const ls = aramaListesi().filter(x => !q || x.ad.toLocaleLowerCase('tr-TR').includes(q));
      const gruplar = {};
      ls.forEach(x => { (gruplar[x.grup] = gruplar[x.grup] || []).push(x); });
      el.querySelector('#arSonuc').innerHTML = Object.keys(gruplar).map(g => `<li class="ar-grup">${g}</li>` + gruplar[g]
        .sort((a, b) => (b.alt > 0) - (a.alt > 0) || a.ad.localeCompare(b.ad, 'tr'))
        .map(x => `<li><button type="button" data-tur="${x.tur}" data-id="${U.kacis(String(x.id))}" data-ad="${U.kacis(x.ad)}">${U.kacis(x.ad)}<span class="soluk">${x.alt > 0 ? Urania.derece(x.alt) + ' yükseklikte' : 'ufkun altında'}</span></button></li>`).join('')).join('');
    };
    el.querySelector('#arAra').value = '';
    yaz();
    if (!d._bagli) {
      d._bagli = true;
      el.querySelector('#arAra').addEventListener('input', yaz);
      el.querySelector('#arSonuc').addEventListener('click', e => {
        const b = e.target.closest('button[data-tur]'); if (!b) return;
        const tur = b.dataset.tur;
        st.hedef = { tur, id: tur === 'yildiz' ? Number(b.dataset.id) : b.dataset.id, ad: b.dataset.ad };
        el.querySelector('#arHedefAd').textContent = st.hedef.ad;
        el.querySelector('#arHedefSerit').hidden = false;
        d.close();
        if (st.mod === 'dokunma') { const v = hedefVektor(st.hedef); if (v) { st.alt0 = Math.asin(v[2]) / DER; st.az0 = (Math.atan2(v[0], v[1]) / DER + 360) % 360; st.R = eulerdenMatris(-st.az0, 90 + st.alt0, 0); } }
      });
    }
    d.showModal ? d.showModal() : d.setAttribute('open', '');
  }

  /* ---------- Hizalama: pusula hatasını parlak bir cisimle düzelt ---------- */
  function hizalamaCismi() {
    const n = st.nesneler;
    const adaylar = n.cisimler.filter(c => c.id !== 'Sun' && c.alt > 5 && c.kadir < 1.5).sort((a, b) => a.kadir - b.kadir);
    if (adaylar.length) return { ad: adaylar[0].ad, v: adaylar[0].v };
    for (let i = 0; i < 40; i++) {
      if (n.yildiz[i * 3 + 2] > Math.sin(10 * DER) && veri.yildizlar.adlar[i]) return { ad: veri.yildizlar.adlar[i], v: [n.yildiz[i * 3], n.yildiz[i * 3 + 1], n.yildiz[i * 3 + 2]] };
    }
    return null;
  }
  function hizalamaBaslat() {
    const p = el.querySelector('#arHizala');
    if (st.mod !== 'algilayici') { durumYaz('Hizalama yalnız telefonun yön algılayıcılarıyla çalışır; sürükleme modunda gerekmez.'); return; }
    const c = hizalamaCismi();
    if (!c) { durumYaz('Hizalamak için ufkun üstünde parlak bir cisim yok.'); return; }
    st.hizalamaCismi = c;
    st.hedef = null; el.querySelector('#arHedefSerit').hidden = true;
    el.querySelector('#arHizalaMetin').innerHTML = `Gökyüzünde <b>${U.kacis(c.ad)}</b>'i bul, telefonu ona doğrult ve tam ortadaki halkaya getir. Sonra "Ortaladım"a bas. Ekrandaki işaret ile gerçek gökyüzü arasındaki fark pusulanın hatasıdır; bu adım onu sıfırlar.`;
    p.hidden = false;
  }
  function hizalamaBitir() {
    const c = st.hizalamaCismi; if (!c || !st.R) return;
    const bakis = bakisYonu(st.R);
    const hedefAz = (Math.atan2(c.v[0], c.v[1]) / DER + 360) % 360;
    let fark = hedefAz - bakis.az; fark = ((fark + 540) % 360) - 180;
    /* başlık = 360 − (α − sapma − kal): başlığı fark kadar artırmak için kal += fark */
    st.kal = ((st.kal + fark + 540) % 360) - 180;
    /* Pusulasız (göreli) modda referans yön her oturumda keyfi: hizalama yalnız bu oturum için */
    if (st.manyetik) U.yaz('arKalibrasyon', st.kal);
    st.R = null; // yeni ayarla hemen yeniden kurulsun
    el.querySelector('#arHizala').hidden = true;
    durumYaz('Hizalandı (' + (fark >= 0 ? '+' : '−') + U.sayi(Math.abs(fark), 1) + '°). İstersen başka bir cisimle tekrarla.');
  }

  /* ---------- Kamera ---------- */
  async function kameraAc(ac) {
    const b = el.querySelector('#arKamera');
    if (!ac) {
      st.kamera = false; b.setAttribute('aria-pressed', 'false');
      if (video.srcObject) { video.srcObject.getTracks().forEach(t => t.stop()); video.srcObject = null; }
      video.hidden = true; return;
    }
    try {
      const akis = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      video.srcObject = akis; video.hidden = false; await video.play();
      st.kamera = true; b.setAttribute('aria-pressed', 'true');
      durumYaz('Kamera açık. Yıldızlar kameranın görüntüsüyle tam örtüşmüyorsa iki parmakla yakınlaştırıp uzaklaştır.');
    } catch (h) {
      st.kamera = false; b.setAttribute('aria-pressed', 'false');
      durumYaz(h && h.name === 'NotAllowedError' ? 'Kamera izni verilmedi.' : 'Kamera açılamadı.');
    }
  }

  function durumYaz(mesaj) {
    const d = el.querySelector('#arDurum');
    let m = mesaj;
    if (!m) {
      if (st.mod === 'algilayici') m = st.manyetik ? 'Telefonu gökyüzüne tut. Pusula manyetik sapmaya göre düzeltildi (' + (st.sapma >= 0 ? '+' : '−') + U.sayi(Math.abs(st.sapma), 1) + '°).' : 'Telefonu gökyüzüne tut. Bu cihaz kuzeyi bildirmiyor: bir kez "Hizala"ya bas.';
      else if (st.mod === 'dokunma') m = 'Parmağınla sürükle, iki parmakla yakınlaştır.';
      else m = 'Yön algılayıcıları başlatılıyor…';
    }
    d.textContent = m;
    d.hidden = false;
    clearTimeout(d._t); d._t = setTimeout(() => { d.hidden = true; }, 7000);
  }

  /* ---------- Açılış / kapanış ---------- */
  function iskelet() {
    el.innerHTML = `
      <video id="arVideo" class="ar-video" playsinline muted hidden></video>
      <canvas id="arKanvas" class="ar-kanvas" aria-label="Telefonun baktığı yöndeki gökyüzü"></canvas>
      <div class="ar-ust">
        <a class="ar-kapat" href="#gok" aria-label="Kapat">×</a>
        <span class="cip-grup">
          <button type="button" class="dugme dolu" id="arPusula" hidden>Pusulayı aç</button>
          <button type="button" class="dugme" id="arBul">Bul</button>
          <button type="button" class="dugme" id="arHizalaDugme">Hizala</button>
          <button type="button" class="dugme" id="arKamera" aria-pressed="false">Kamera</button>
        </span>
      </div>
      <div class="ar-serit" id="arHedefSerit" hidden><span>Aranan: <b id="arHedefAd"></b> · <span id="arTarif"></span></span><button type="button" class="bag" id="arHedefKapat">bırak</button></div>
      <div class="ar-durum" id="arDurum" role="status" hidden></div>
      <div class="ar-bilgi" id="arBilgi" aria-live="polite" hidden></div>
      <div class="ar-merkez" id="arMerkez"></div>
      <div class="gorunmez" id="arDuyuru" aria-live="polite"></div>
      <div class="ar-hizala" id="arHizala" hidden>
        <p id="arHizalaMetin"></p>
        <div class="cip-grup"><button type="button" class="dugme dolu" id="arOrtaladim">Ortaladım</button><button type="button" class="dugme" id="arHizalaIptal">Vazgeç</button><button type="button" class="dugme" id="arHizalaSifirla">Hizalamayı sıfırla</button></div>
      </div>
      <dialog id="arArama" class="ar-arama">
        <form method="dialog">
          <div class="alan"><label for="arAra">Ne arıyorsun?</label><input id="arAra" autocomplete="off" placeholder="Jüpiter, Vega, Ülker, Avcı…"></div>
          <ul class="ar-sonuc" id="arSonuc"></ul>
          <button value="kapat" class="dugme" style="width:100%;margin-top:10px">Kapat</button>
          <p class="kucuk" style="margin-top:10px">Pusula ya da görüntü tutarsızsa: <a href="#tani">Tanı ekranı</a></p>
        </form>
      </dialog>`;
    cv = el.querySelector('#arKanvas'); ctx = cv.getContext('2d'); video = el.querySelector('#arVideo');
    dokunmaBagla();
    el.querySelector('#arBul').addEventListener('click', aramaAc);
    el.querySelector('#arPusula').addEventListener('click', izinIste);
    el.querySelector('#arHizalaDugme').addEventListener('click', hizalamaBaslat);
    el.querySelector('#arOrtaladim').addEventListener('click', hizalamaBitir);
    el.querySelector('#arHizalaIptal').addEventListener('click', () => { el.querySelector('#arHizala').hidden = true; });
    el.querySelector('#arHizalaSifirla').addEventListener('click', () => { st.kal = 0; U.yaz('arKalibrasyon', 0); st.R = null; el.querySelector('#arHizala').hidden = true; durumYaz('Hizalama sıfırlandı.'); });
    el.querySelector('#arKamera').addEventListener('click', () => kameraAc(!st.kamera));
    el.querySelector('#arHedefKapat').addEventListener('click', () => { st.hedef = null; el.querySelector('#arHedefSerit').hidden = true; });
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos" style="padding:20px">Gökyüzü hazırlanıyor…</p>';
    const [yildizlar, takimyildizlar, hedefler] = await Promise.all([U.veri('yildizlar'), U.veri('takimyildiz'), U.veri('hedefler')]);
    veri = { yildizlar, takimyildizlar, hedefler: hedefler.hedefler };
    iskelet();
    baslat();
  }

  function baslat() {
    if (calisiyor || !veri) return;
    calisiyor = true;
    document.body.classList.add('ar-acik');
    if (window.Uydu && !st.uydular) Uydu.uydular().then(t => { st.uydular = t; st.issZaman = null; if (calisiyor) nesneleriYenile(); }).catch(() => { /* uydu verisi yoksa da çalışır */ });
    st.mod = 'bekliyor'; st.R = null; st.sapmaHesaplandi = false; st.goreliVar = false; st.goreliKabul = false; st.izinYok = false;
    nesneleriYenile();
    sayac = setInterval(nesneleriYenile, 1000);
    algilayicilariBaslat();
    durumYaz();
    if (navigator.wakeLock) navigator.wakeLock.request('screen').then(k => { kilit = k; }).catch(() => { /* ekran kilidi engeli yoksa sorun değil */ });
    kare = requestAnimationFrame(ciz);
  }
  function durdur() {
    if (!calisiyor) return;
    calisiyor = false;
    document.body.classList.remove('ar-acik');
    cancelAnimationFrame(kare); clearInterval(sayac);
    algilayicilariDurdur();
    kameraAc(false);
    if (kilit) { kilit.release().catch(() => {}); kilit = null; }
  }

  function goster() { if (veri) baslat(); }
  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#ar')) durdur(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (st.kamera) kameraAc(false); }
    else if (calisiyor && navigator.wakeLock) navigator.wakeLock.request('screen').then(k => { kilit = k; }).catch(() => {});
  });

  U.modul('ar', { ilk, goster });
  /* Testler için: iç durum ve saf matematik */
  /* Testler için: geçerli dönüşümle bir yükseklik/azimutu ekrana yansıt */
  function yansitTest(alt, az) {
    const R = st.R; if (!R) return null;
    const v = enu(alt, az), ang = ekranAcisi() * DER, cA = Math.cos(ang), sA = Math.sin(ang);
    const dx = R[0][0] * v[0] + R[1][0] * v[1] + R[2][0] * v[2], dy = R[0][1] * v[0] + R[1][1] * v[1] + R[2][1] * v[2], dz = R[0][2] * v[0] + R[1][2] * v[1] + R[2][2] * v[2];
    if (dz > -0.02) return null;
    return { x: (dx * cA - dy * sA) / -dz, y: (dx * sA + dy * cA) / -dz }; // merkeze göre, y yukarı pozitif
  }
  window.UraniaAR = { st, eulerdenMatris, bakisYonu, enu, yansitTest };
})();
