/* cizim_gokyuzu.js — "Gökyüzünü okumak" ünitesinin ders çizimleri (cizim.js kayıtları).
   Dersler: d1 (koordinatlar, mevsimler, kadir), d2 (ışık ve tayf), d12 (teleskoplar), d11 (dürbün).
   Çizimdeki sayılar ders metninden (kaynaklı) ya da burada formülle hesaplanır; ek kaynaklar kayıtlarda. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  const rad = Math.PI / 180;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti */
  const tr = (x, d) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(d == null ? 0 : d).replace('.', ',');
  const KAYNAK = {
    nasaDunya: { ad: 'NASA Earth Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
    istanbul: { ad: 'Wikipedia: Istanbul', url: 'https://en.wikipedia.org/wiki/Istanbul' },
    ufuk: { ad: 'Wikipedia: Horizontal coordinate system', url: 'https://en.wikipedia.org/wiki/Horizontal_coordinate_system' },
    kadir: { ad: 'Wikipedia: Apparent magnitude', url: 'https://en.wikipedia.org/wiki/Apparent_magnitude' },
    nasaAy: { ad: 'NASA Moon Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html' },
    nasaTayf: { ad: 'NASA Imagine the Universe: EM spectrum chart', url: 'https://imagine.gsfc.nasa.gov/science/toolbox/spectrum_chart.html' },
    nasaGorunur: { ad: 'NASA: Visible Light', url: 'https://science.nasa.gov/ems/09_visiblelight/' },
    nist: { ad: 'NIST CODATA (h, c, k, b)', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?h' },
    wien: { ad: 'Wikipedia: Wien\'s displacement law', url: 'https://en.wikipedia.org/wiki/Wien%27s_displacement_law' },
    nasaGunes: { ad: 'NASA Sun Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html' },
    balmer: { ad: 'Wikipedia: Balmer series', url: 'https://en.wikipedia.org/wiki/Balmer_series' },
    fraunhofer: { ad: 'Wikipedia: Fraunhofer lines', url: 'https://en.wikipedia.org/wiki/Fraunhofer_lines' },
    optikPencere: { ad: 'Wikipedia: Optical window', url: 'https://en.wikipedia.org/wiki/Optical_window' },
    radyoPencere: { ad: 'Wikipedia: Radio window', url: 'https://en.wikipedia.org/wiki/Radio_window' },
    teleskop: { ad: 'Astronomy Notes: Telescopes', url: 'https://www.astronomynotes.com/telescop/s2.htm' },
    ayirma: { ad: 'Resolution (eckop.com)', url: 'https://www.eckop.com/resources/optics/resolution/' },
    gorus: { ad: 'Wikipedia: Astronomical seeing', url: 'https://en.wikipedia.org/wiki/Astronomical_seeing' },
    dag: { ad: 'DAG teleskobu (arXiv 2510.23339)', url: 'https://arxiv.org/pdf/2510.23339' },
    hubble: { ad: 'NASA: Hubble 30 yıl', url: 'https://science.nasa.gov/missions/hubble/30-years-ago-hubble-launched-to-unlock-the-secrets-of-the-universe/' },
    gozPlak: { ad: 'Wikipedia: Naked eye', url: 'https://en.wikipedia.org/wiki/Naked_eye' },
    cikis: { ad: 'Wikipedia: Exit pupil', url: 'https://en.wikipedia.org/wiki/Exit_pupil' },
    el: { ad: 'timeanddate: Measuring the sky by hand', url: 'https://www.timeanddate.com/astronomy/measuring-the-sky-by-hand.html' },
    atlama: { ad: 'Wikipedia: Star hopping', url: 'https://en.wikipedia.org/wiki/Star_hopping' },
    messier: { ad: 'NASA Hubble Messier Catalog', url: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/' }
  };

  /* ================================================================ d1 ================================================================ */

  /* d1 · bölüm 1: ufuk koordinatları. Gözlemcinin ufku eğik bakışla (dik izdüşüm); örnek yıldız azimut 135°, yükseklik 40°. Ölçeksiz. */
  C.ekle('d1-ufuk-koordinat', {
    ders: 'd1', bolum: 1, oran: 0.64,
    baslik: 'Yükseklik ve azimut',
    aciklama: 'Ufuk çemberinin ortasında sen duruyorsun. Azimut ufuk boyunca kuzeyden doğuya doğru ölçülür: kuzey 0°, doğu 90°, güney 180°, batı 270°. Yükseklik ise ufuktan yıldıza doğru yukarı ölçülen açıdır; örnekteki yıldız güneydoğuda, azimutu 135°, yüksekliği 40°. Değerler örnektir, çizim ölçeksizdir.',
    kaynak: [KAYNAK.ufuk],
    ciz(S) {
      const R = S.R, cx = 200, cy = 170, r = 120, e = 22 * rad;
      /* 3B → ekran: x doğu, y kuzey, z yukarı; güneyden e kadar yukarıdan bakış */
      const P = (A, h, k) => {
        k = k == null ? 1 : k;
        const x = Math.cos(h * rad) * Math.sin(A * rad), y = Math.cos(h * rad) * Math.cos(A * rad), z = Math.sin(h * rad);
        return [cx + k * r * x, cy - k * r * (z * Math.cos(e) + y * Math.sin(e))];
      };
      const yayA = (A1, A2, h, k) => { const ls = []; for (let i = 0; i <= 40; i++) ls.push(P(A1 + (A2 - A1) * i / 40, h, k)); return ls; };
      const yayH = (A, h1, h2, k) => { const ls = []; for (let i = 0; i <= 40; i++) ls.push(P(A, h1 + (h2 - h1) * i / 40, k)); return ls; };
      const A = 135, H = 40;
      let s = '';
      /* gök kubbesinin dış hattı (üst yarım daire) ve ufuk elipsi */
      s += S.yay(cx, cy, r, 0, 180, { renk: R.soluk, kalin: 1 });
      s += S.elips(cx, cy, r, r * Math.sin(e), { renk: 'none', dolgu: R.yuzey2, saydam: 0.9 });
      s += S.elips(cx, cy, r, r * Math.sin(e), { renk: R.metin, kalin: 2 });
      /* başucu */
      const bz = P(0, 90);
      s += S.cizgi(cx, cy, bz[0], bz[1], { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.daire(bz[0], bz[1], 3, { dolgu: R.soluk, renk: R.soluk });
      s += S.cizgi(bz[0], bz[1] - 4, bz[0], cy - r - 4, { renk: R.soluk, kalin: 1 });          // yazı kubbenin dışında: kubbe çizgisi yazıyı kesmesin
      s += S.yazi(bz[0], cy - r - 8, 'Başucu (90°)', { boy: 13, renk: R.soluk, hiza: 'middle' });
      /* ana yönler */
      const yon = [[0, 'K 0°', 0, -8, 'middle'], [90, 'D 90°', 8, 5, 'start'], [180, 'G 180°', 0, 20, 'middle'], [270, 'B 270°', -8, 5, 'end']];
      yon.forEach(([a, ad, dx, dy, hz]) => { const p = P(a, 0); s += S.daire(p[0], p[1], 3, { dolgu: R.metin, renk: R.metin }); s += S.yazi(p[0] + dx, p[1] + dy, ad, { boy: 14, renk: R.metin, hiza: hz, kalin: true }); });
      /* azimut yayı: kuzeyden doğuya 135° (ufuk düzleminde, gözlemcinin çevresinde) */
      const az = yayA(0, A, 0, 0.3);
      s += S.egri(az.slice(0, -1), { renk: R.vurgu, kalin: 2.4 });
      const a1 = az[az.length - 4], a2 = az[az.length - 1];
      s += S.ok(a1[0], a1[1], a2[0], a2[1], { renk: R.vurgu, kalin: 2.4, boy: 9 });
      /* gözlemciden yıldızın ayağına ve yıldıza */
      const ayak = P(A, 0), yil = P(A, H);
      s += S.cizgi(cx, cy, ayak[0], ayak[1], { renk: R.soluk, kalin: 1.2, kesik: '5 4' });
      s += S.cizgi(cx, cy, yil[0], yil[1], { renk: R.soluk, kalin: 1.2 });
      /* yükseklik: yıldızın dikey çemberi boyunca ufuktan yıldıza */
      s += S.egri(yayH(A, H, 90), { renk: R.soluk, kalin: 1, kesik: '4 4' });
      s += S.egri(yayH(A, 0, H), { renk: R.mavi, kalin: 3.2 });
      s += S.daire(yil[0], yil[1], 5, { dolgu: R.yildiz, renk: R.yildiz });
      s += S.daire(ayak[0], ayak[1], 3, { dolgu: R.mavi, renk: R.mavi });
      s += S.yazi(yil[0] + 9, yil[1] - 9, 'Yıldız', { boy: 15, renk: R.metin, kalin: true });
      /* etiketler */
      const ym = P(A, H / 2);
      s += S.cizgi(ym[0] + 3, ym[1], 334, ym[1] - 26, { renk: R.mavi, kalin: 1 });
      s += S.yazi(338, ym[1] - 38, 'yükseklik', { boy: 14, renk: R.mavi, kalin: true });
      s += S.yazi(338, ym[1] - 22, '40°', { boy: 14, renk: R.mavi, kalin: true });
      const am = az[34];
      s += S.cizgi(am[0] + 2, am[1] + 3, 262, cy + 56, { renk: R.vurgu, kalin: 1 });
      s += S.yazi(256, cy + 70, 'azimut 135°', { boy: 14, renk: R.vurgu, kalin: true });
      s += S.daire(cx, cy, 4.5, { dolgu: R.metin, renk: R.metin });
      s += S.yazi(cx - 10, cy - 6, 'Sen', { boy: 13, renk: R.soluk, hiza: 'end' });
      return s;
    }
  });

  /* d1 · bölüm 3: Kutup Yıldızı'nın yüksekliği enleme eşittir (İstanbul 41°). Yan kesit, ölçeksiz. */
  C.ekle('d1-kutup-enlem', {
    ders: 'd1', bolum: 3, oran: 0.5,
    baslik: 'Kutup Yıldızı\'nın yüksekliği = enlem',
    aciklama: 'İstanbul\'da (41° kuzey) gök kutbu kuzey ufkunun 41° üstündedir. Gök ekvatoru güney ufkundan 90° − 41° = 49° yükselir. Gökyüzü bu eksen çevresinde döner: kutba yakın yıldızlar hiç batmaz. Çizim ölçeksizdir.',
    ciz(S) {
      const R = S.R, cx = 200, cy = 160, r = 120, enlem = 41, rad = Math.PI / 180;
      let s = '';
      s += S.yay(cx, cy, r, 0, 180, { renk: R.soluk, kalin: 1 });                       // gök küresinin ufuk üstü yarısı
      s += S.cizgi(cx - r - 22, cy, cx + r + 22, cy, { renk: R.metin, kalin: 2 });        // ufuk
      s += S.yazi(cx - r - 20, cy + 20, 'Kuzey', { boy: 14, renk: R.soluk });
      s += S.yazi(cx + r + 20, cy + 20, 'Güney', { boy: 14, renk: R.soluk, hiza: 'end' });
      s += S.cizgi(cx, cy, cx, cy - r, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.yazi(cx + 5, cy - r - 8, 'Başucu', { boy: 13, renk: R.soluk });   // sola değil sağa: yeşil yay başucunun 8° solunda biter
      /* hiç batmayanlar: kutup çevresinde 41° yarıçaplı bölge; meridyen kesitinde kuzey ufkundan 82° yüksekliğe */
      s += S.yay(cx, cy, r + 9, 180 - 2 * enlem, 180, { renk: R.iyi, kalin: 4, uc: 'round' });
      s += S.yazi(cx - r - 4, cy - r + 4, 'Hiç batmayanlar', { boy: 13, renk: R.iyi, hiza: 'middle' });
      /* gök kutbu: kuzey ufkundan 41° yukarı */
      const px = cx - r * Math.cos(enlem * rad), py = cy - r * Math.sin(enlem * rad);
      s += S.ok(cx, cy, px, py, { renk: R.vurgu, kalin: 2 });
      s += S.daire(px, py, 4.5, { dolgu: R.yildiz, renk: R.yildiz });
      s += S.yazi(px + 10, py - 6, 'Kutup Yıldızı', { boy: 15, renk: R.metin, kalin: true });
      s += S.yay(cx, cy, 46, 180 - enlem, 180, { renk: R.vurgu, kalin: 1.5 });
      s += S.yazi(cx - 52, cy - 12, '41°', { boy: 16, renk: R.vurgu, kalin: true, hiza: 'end' });
      /* gök ekvatoru: kutba dik, güney ufkundan 49° yukarı */
      const ea = 90 - enlem, ex = cx + r * Math.cos(ea * rad), ey = cy - r * Math.sin(ea * rad);
      s += S.cizgi(cx, cy, ex, ey, { renk: R.mavi, kalin: 1.8, kesik: '6 4' });
      s += S.yazi(ex + 8, ey - 6, 'Gök ekvatoru', { boy: 14, renk: R.mavi });   // çemberin dışında, çizgiyle kesişmesin
      s += S.yay(cx, cy, 70, 0, ea, { renk: R.mavi, kalin: 1.2 });
      s += S.yazi(cx + 76, cy - 22, '49°', { boy: 15, renk: R.mavi });
      s += S.daire(cx, cy, 5, { dolgu: R.metin, renk: R.metin });
      s += S.yazi(cx, cy + 22, 'Sen (İstanbul, 41° K)', { boy: 13, renk: R.soluk, hiza: 'middle' });
      return s;
    }
  });

  /* d1 · bölüm 5: İstanbul'da öğle Güneşi'nin yüksekliği (h = 90° − |φ − δ☉|, φ = 41,01°) ve aynı ışık demetinin yere yayılışı. */
  C.ekle('d1-ogle-gunesi', {
    ders: 'd1', bolum: 5, oran: 0.86,
    baslik: 'İstanbul\'da öğle Güneşi: yaz, ekinoks, kış',
    aciklama: 'Üstte güneye bakan bir yan kesit var: öğle Güneşi Haziran gündönümünde 72,4°, ekinokslarda 49°, Aralık gündönümünde 25,6° yükseğe çıkar; aradaki farkları eksenin 23,44° eğikliği yaratır. Altta aynı genişlikte bir ışık demeti yere çarpıyor: Aralık\'ta yere yatık geldiği için yaklaşık 2,2 kat geniş bir alana yayılır, yani her metrekareye daha az enerji düşer. Açılar ölçeklidir.',
    kaynak: [KAYNAK.nasaDunya, KAYNAK.istanbul],
    ciz(S) {
      const R = S.R, phi = 41.01, eg = 23.44;
      const hY = 90 - Math.abs(phi - eg), hE = 90 - phi, hK = 90 - (phi + eg);      // 72,4 · 49,0 · 25,6
      const cx = 150, cy = 182, r = 128;
      let s = '';
      s += S.yay(cx, cy, r, 0, 180, { renk: R.soluk, kalin: 1 });
      s += S.cizgi(cx - r - 14, cy, cx + r + 30, cy, { renk: R.metin, kalin: 2 });
      s += S.yazi(cx - r - 12, cy + 20, 'Kuzey', { boy: 14, renk: R.soluk });
      s += S.yazi(cx + r + 28, cy + 20, 'Güney', { boy: 14, renk: R.soluk, hiza: 'end' });
      s += S.cizgi(cx, cy, cx, cy - r, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.yazi(cx, cy - r - 8, 'Başucu', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* Güneş'in öğle yüksekliğinin yıl içindeki aralığı */
      s += S.yay(cx, cy, r, hK, hY, { renk: R.gunes, kalin: 5, uc: 'round', saydam: 0.45 });
      /* etiketlerdeki değerler dersin örneğinden (72,4 · 49 · 25,6); konumlar formülden */
      const gunesler = [[hY, 'Haziran 72,4°'], [hE, 'Ekinoks 49°'], [hK, 'Aralık 25,6°']];
      gunesler.forEach(([h, ad], i) => {
        const x = cx + r * Math.cos(h * rad), y = cy - r * Math.sin(h * rad);
        s += S.cizgi(cx, cy, x, y, { renk: R.gunes, kalin: 1.4, kesik: i === 1 ? '6 4' : null });
        s += S.daire(x, y, 8, { dolgu: R.gunes, renk: R.gunes });
        s += S.yazi(x + 14, y + 5, ad, { boy: 14, renk: R.metin, kalin: true });
      });
      { const t = 40, o = 13, a = hE * rad;   // ekinoks çizgisi gök ekvatorudur: yazı çizginin hemen altında, ona paralel
        s += S.yazi(cx + t * Math.cos(a) + o * Math.sin(a), cy - t * Math.sin(a) + o * Math.cos(a), 'gök ekvatoru', { boy: 13, renk: R.soluk, yan: -hE }); }
      s += S.daire(cx, cy, 4.5, { dolgu: R.metin, renk: R.metin });
      /* alt: aynı demet, iki geliş açısı */
      const zem = 318, w = 30;
      const demet = (x1, h, L) => {
        const iz = w / Math.sin(h * rad), d = [Math.cos(h * rad), -Math.sin(h * rad)];
        const p1 = [x1, zem], p2 = [x1 + iz, zem], p3 = [x1 + iz + L * d[0], zem + L * d[1]], p4 = [x1 + L * d[0], zem + L * d[1]];
        let t = S.yol(`M${p1} L${p2} L${p3} L${p4} Z`, { renk: R.gunes, kalin: 1.2, dolgu: R.gunes, saydam: 0.35 });
        t += S.cizgi(p1[0], zem, p2[0], zem, { renk: R.gunes, kalin: 5, uc: 'butt' });
        t += S.yay(x1, zem, 22, 0, h, { renk: R.metin, kalin: 1.2 });
        return { svg: t, iz };
      };
      s += S.cizgi(14, zem, 186, zem, { renk: R.metin, kalin: 1.5 });
      s += S.cizgi(214, zem, 392, zem, { renk: R.metin, kalin: 1.5 });
      const dY = demet(64, hY, 82), dK = demet(222, hK, 90);
      s += dY.svg + dK.svg;
      s += S.yazi(100, 236, 'Haziran öğlesi, 72,4°', { boy: 14, renk: R.metin, hiza: 'middle', kalin: true });
      s += S.yazi(300, 236, 'Aralık öğlesi, 25,6°', { boy: 14, renk: R.metin, hiza: 'middle', kalin: true });
      s += S.yazi(64 + dY.iz / 2, zem + 22, 'dar iz', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.yazi(222 + dK.iz / 2, zem + 22, tr(dK.iz / dY.iz, 1) + ' kat geniş iz', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.cizgi(200, 228, 200, 340, { renk: R.cizgi, kalin: 1 });
      return s;
    }
  });

  /* d1 · bölüm 6: kadir ölçeği sayı doğrusu (ders metnindeki kaynaklı değerler), üstte tüm aralık, altta −6…+11 büyütülmüş. */
  C.ekle('d1-kadir-dogrusu', {
    ders: 'd1', bolum: 6, oran: 0.78,
    baslik: 'Kadir ölçeği bir sayı doğrusu',
    aciklama: 'Sola gittikçe cisim parlaklaşır, sağa gittikçe sönükleşir. Üst doğru Güneş\'ten (−26,8) Hubble\'ın en derin görüntüsüne (+31,5) kadar uzanır; alttaki doğru eksi 6 ile artı 11 arasını büyütür: Venüs −4,92, Jüpiter −2,94, Sirius −1,46, Vega +0,03, Kutup Yıldızı +1,98, Andromeda +3,44, göz sınırı +6,5, 10×50 dürbün sınırı +9,5. Her 5 kadirlik adım 100 kat parlaklık farkıdır.',
    kaynak: [KAYNAK.kadir, KAYNAK.nasaAy],
    ciz(S) {
      const R = S.R;
      /* üst doğru: −30 … +35 */
      const u0 = -30, u1 = 35, ux0 = 20, ux1 = 380, uy = 64;
      const UX = m => ux0 + (m - u0) / (u1 - u0) * (ux1 - ux0);
      /* alt doğru: −6 … +11 */
      const a0 = -6, a1 = 11, ax0 = 22, ax1 = 378, ay = 190;
      const AX = m => ax0 + (m - a0) / (a1 - a0) * (ax1 - ax0);
      let s = '';
      s += S.cizgi(ux0, uy, ux1, uy, { renk: R.metin, kalin: 1.6 });
      for (let m = -30; m <= 30; m += 10) {
        s += S.cizgi(UX(m), uy - 4, UX(m), uy + 4, { renk: R.soluk, kalin: 1 });
        s += S.yazi(UX(m), uy + 20, tr(m), { boy: 13, renk: R.soluk, hiza: 'middle' });
      }
      /* büyütülen bölge ve bağlantı */
      s += S.cizgi(UX(a0), uy, UX(a1), uy, { renk: R.vurgu, kalin: 5, saydam: 0.6 });
      s += S.yazi(200, 108, 'kalın bölge yakından:', { boy: 13, renk: R.vurgu, hiza: 'middle', italik: true });
      const ust = [[-26.8, 'Güneş', R.gunes, 'start', 8], [-12.74, 'Dolunay', R.ay, 'middle', 0], [31.5, 'Hubble XDF', R.mavi, 'end', -4]];
      ust.forEach(([m, ad, renk, hz, dx]) => {
        const x = UX(m);
        s += S.cizgi(x, 38, x, uy, { renk: R.soluk, kalin: 1 });
        s += S.daire(x, uy, 4.5, { dolgu: renk, renk });
        s += S.yazi(x + dx - (hz === 'start' ? 10 : 0), 16, ad, { boy: 13, renk: R.metin, hiza: hz, kalin: true });
        s += S.yazi(x + dx - (hz === 'start' ? 10 : 0), 32, (m > 0 ? '+' : '') + tr(m, m === -26.8 || m === 31.5 ? 1 : 2), { boy: 13, renk: R.soluk, hiza: hz });
      });
      /* alt doğru */
      s += S.cizgi(ax0, ay, ax1, ay, { renk: R.metin, kalin: 1.6 });
      for (let m = a0; m <= a1; m++) s += S.cizgi(AX(m), ay - 3, AX(m), ay + 3, { renk: R.soluk, kalin: 1 });
      s += S.yazi(ax0, ay + 20, '−6', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.yazi(ax1, ay + 20, '+11', { boy: 13, renk: R.soluk, hiza: 'end' });
      /* [kadir, ad, renk, katman: 0 üst-yüksek, 1 alt] */
      const ogeler = [
        [-4.92, 'Venüs', R.gezegen, 0], [-2.94, 'Jüpiter', R.gezegen, 1], [-1.46, 'Sirius', R.yildiz, 0], [0.03, 'Vega', R.yildiz, 1],
        [1.98, 'Kutup Yıldızı', R.yildiz, 0], [3.44, 'Andromeda', R.yildiz, 1], [6.5, 'Göz sınırı', R.iyi, 0], [9.5, '10×50 dürbün', R.mavi, 1]
      ];
      ogeler.forEach(([m, ad, renk, k]) => {
        const x = AX(m), d = (m > 0 ? '+' : '') + tr(m, 2).replace(/,?0$/, m === 6.5 || m === 9.5 ? '' : '0');
        if (k === 0) {
          s += S.cizgi(x, 152, x, ay, { renk: R.soluk, kalin: 1 });
          s += S.yazi(x, 128, ad, { boy: 13, renk: R.metin, hiza: 'middle', kalin: true });
          s += S.yazi(x, 144, d, { boy: 13, renk: R.soluk, hiza: 'middle' });
        } else {
          s += S.cizgi(x, ay, x, 214, { renk: R.soluk, kalin: 1 });
          const hz = x > 340 ? 'end' : 'middle', xx = x > 340 ? x + 14 : x;
          s += S.yazi(xx, 230, ad, { boy: 13, renk: R.metin, hiza: hz, kalin: true });
          s += S.yazi(xx, 246, d, { boy: 13, renk: R.soluk, hiza: hz });
        }
        s += S.daire(x, ay, 4.5, { dolgu: renk, renk });
      });
      /* yön ve kural */
      s += S.ok(150, 278, 22, 278, { renk: R.vurgu, kalin: 1.8, boy: 8 });
      s += S.yazi(24, 270, 'daha parlak', { boy: 13, renk: R.vurgu });
      s += S.ok(250, 278, 378, 278, { renk: R.soluk, kalin: 1.8, boy: 8 });
      s += S.yazi(376, 270, 'daha sönük', { boy: 13, renk: R.soluk, hiza: 'end' });
      s += S.yazi(200, 304, '5 kadir fark = 100 kat parlaklık', { boy: 14, renk: R.metin, hiza: 'middle' });
      return s;
    }
  });

  /* ================================================================ d2 ================================================================ */

  /* Logaritmik dalga boyu ekseni (d2-tayf ve d2-pencereler ortak): 1 pm … 1 km */
  const L0 = -12, L1 = 3;
  const lx = (lam, x0, x1) => x0 + (Math.log10(lam) - L0) / (L1 - L0) * (x1 - x0);
  /* NASA tayf çizelgesindeki bant sınırları (metre) */
  const BANT = [
    ['Gama', 1e-12, 1e-11, 'ust'], ['X ışını', 1e-11, 1e-8, 'ic'], ['Morötesi', 1e-8, 4e-7, 'ust'], ['', 4e-7, 7e-7, 'gorunur'],
    ['Kızılötesi', 7e-7, 1e-3, 'ic'], ['Mikrodalga', 1e-3, 1e-1, 'ust'], ['Radyo', 1e-1, 1e3, 'ic']
  ];

  /* d2 · bölüm 1: elektromanyetik tayf şeridi ve görünür ışık. */
  C.ekle('d2-tayf', {
    ders: 'd2', bolum: 1, oran: 0.62,
    baslik: 'Elektromanyetik tayf',
    aciklama: 'Şerit soldan sağa dalga boyunun büyüdüğü sırayla gama, X ışını, morötesi, görünür ışık, kızılötesi, mikrodalga ve radyo bantlarını gösterir; eksen logaritmiktir, her çentik bin kat demektir. Görünür ışık bu şeritte ince bir dilimdir; altta büyütülmüş hâli var: göz yaklaşık 380 nm mordan 700 nm kırmızıya kadar görür. Bant sınırları NASA çizelgesinden alınmıştır ve yaklaşıktır.',
    kaynak: [KAYNAK.nasaTayf, KAYNAK.nasaGorunur],
    ciz(S) {
      const R = S.R, x0 = 20, x1 = 380, y = 64, hb = 30;
      const X = l => lx(l, x0, x1);
      let s = '';
      BANT.forEach(([ad, a, b, yer], i) => {
        const xa = X(a), xb = X(b);
        s += S.kutu(xa, y, xb - xa, hb, { renk: R.cizgi, kalin: 1, dolgu: yer === 'gorunur' ? R.vurgu : (i % 2 ? R.yuzey2 : R.yuzey) });
        if (yer === 'ic') s += S.yazi((xa + xb) / 2, y + 20, ad, { boy: 13, renk: R.metin, hiza: 'middle' });
        if (yer === 'ust') { s += S.yazi((xa + xb) / 2, y - 10, ad, { boy: 13, renk: R.metin, hiza: 'middle' }); }
      });
      s += S.kutu(x0, y, x1 - x0, hb, { renk: R.soluk, kalin: 1 });
      /* eksen çentikleri */
      [[1e-12, '1 pm'], [1e-9, '1 nm'], [1e-3, '1 mm'], [1, '1 m'], [1e3, '1 km']].forEach(([l, t], i, d) => {
        const x = X(l);
        s += S.cizgi(x, y + hb, x, y + hb + 5, { renk: R.soluk, kalin: 1 });
        s += S.yazi(x, y + hb + 19, t, { boy: 13, renk: R.soluk, hiza: i === 0 ? 'start' : i === d.length - 1 ? 'end' : 'middle' });
      });
      for (let k = L0; k <= L1; k += 3) { const x = X(Math.pow(10, k)); s += S.cizgi(x, y + hb, x, y + hb + 5, { renk: R.soluk, kalin: 1 }); }
      /* görünür ışık büyütmesi: 380–700 nm */
      const g0 = 60, g1 = 340, gy = 156, gh = 20, G = nm => g0 + (nm - 380) / (700 - 380) * (g1 - g0);
      const yk = y + hb + 26;            // bağlantı, eksen yazılarının altından yelpazelenir
      s += S.cizgi(X(4e-7), y + hb, X(4e-7), yk, { renk: R.vurgu, kalin: 1, saydam: 0.7 }) + S.cizgi(X(7e-7), y + hb, X(7e-7), yk, { renk: R.vurgu, kalin: 1, saydam: 0.7 });
      s += S.cizgi(X(4e-7), yk, g0, gy, { renk: R.vurgu, kalin: 1, saydam: 0.7 });
      s += S.cizgi(X(7e-7), yk, g1, gy, { renk: R.vurgu, kalin: 1, saydam: 0.7 });
      s += S.kutu(g0, gy, g1 - g0, gh, { renk: R.vurgu, kalin: 1.2, dolgu: R.vurguSoluk });
      [400, 500, 600, 700].forEach(nm => {
        s += S.cizgi(G(nm), gy + gh, G(nm), gy + gh + 5, { renk: R.soluk, kalin: 1 });
        s += S.yazi(G(nm), gy + gh + 19, nm + (nm === 700 ? ' nm' : ''), { boy: 13, renk: R.soluk, hiza: nm === 700 ? 'end' : 'middle' });
      });
      s += S.yazi(g0 - 6, gy + 15, 'mor', { boy: 13, renk: R.metin, hiza: 'end' });
      s += S.yazi(g1 + 6, gy + 15, 'kırmızı', { boy: 13, renk: R.metin });
      s += S.yazi(200, gy + 15, 'görünür ışık', { boy: 13, renk: R.metin, hiza: 'middle', kalin: true });
      /* yön */
      s += S.ok(150, 234, 22, 234, { renk: R.soluk, kalin: 1.5, boy: 8 });
      s += S.yazi(24, 226, 'kısa dalga, yüksek enerji', { boy: 13, renk: R.soluk });
      s += S.ok(250, 234, 378, 234, { renk: R.soluk, kalin: 1.5, boy: 8 });
      s += S.yazi(376, 226, 'uzun dalga, düşük enerji', { boy: 13, renk: R.soluk, hiza: 'end' });
      return s;
    }
  });

  /* d2 · bölüm 4: Planck yasasıyla hesaplanan kara cisim eğrileri; Rigel 12.100 K, Güneş 5772 K, Betelgeuse 3800 K. */
  C.ekle('d2-kara-cisim', {
    ders: 'd2', bolum: 4, oran: 0.72,
    baslik: 'Üç sıcaklıkta kara cisim eğrisi',
    aciklama: 'Eğriler Planck yasasıyla hesaplandı: Rigel 12.100 K, Güneş 5772 K, Betelgeuse 3800 K. Sıcak cisim her dalga boyunda daha çok ışır ve tepesi kısa dalgaya kayar: Rigel 239 nanometrede, yani morötesinde, Güneş 502 nanometrede, Betelgeuse 763 nanometrede, yani kızılötesinin başında tepe yapar. Dikey eksen logaritmiktir, her çentik 10 kat demektir; gölgeli şerit görünür ışıktır.',
    kaynak: [KAYNAK.nist, KAYNAK.wien, KAYNAK.nasaGunes],
    ciz(S) {
      const R = S.R;
      /* veri/fizik.json'daki NIST CODATA değerleri */
      const h = 6.62607015e-34, c = 299792458, k = 1.380649e-23, b = 2.897771955e-3;
      const B = (lnm, T) => { const l = lnm * 1e-9; return 2 * h * c * c / Math.pow(l, 5) / (Math.exp(h * c / (l * k * T)) - 1); };
      const yildizlar = [[12100, 'Rigel', R.mavi, null], [5772, 'Güneş', R.gunes, null], [3800, 'Betelgeuse', R.uyari, '7 4']];
      const ref = B(b / 12100 * 1e9, 12100);
      const alan = { x: 62, y: 32, w: 320, h: 200 }, ar = { x0: 100, x1: 2000, y0: 1e-4, y1: 2 };
      const ek = S.eksen(alan, ar, {
        logY: true,
        xIsaret: [[500, '500'], [1000, '1000'], [1500, '1500'], [2000, '2000 nm']],
        yIsaret: [[1, '1'], [0.1, '0,1'], [0.01, '0,01'], [0.001, '0,001'], [1e-4, '0,0001']],
        xAd: 'dalga boyu (nm)'
      });
      let s = S.yazi(8, 14, 'ışınım (göreli, logaritmik)', { boy: 13, renk: R.soluk });
      s += S.kutu(ek.X(380), alan.y, ek.X(700) - ek.X(380), alan.h, { renk: 'none', dolgu: R.vurguSoluk, saydam: 0.55 });
      s += S.yazi((ek.X(380) + ek.X(700)) / 2, alan.y + alan.h - 8, 'görünür', { boy: 13, renk: R.vurgu, hiza: 'middle' });
      s += ek.svg.replace(/(<text[^>]*>2000 nm<\/text>)/, m => m.replace('text-anchor="middle"', 'text-anchor="end"'));
      /* açıklama kutusu sağ üstte (eğrilerin üstünde boş bölge); kırmızı modda çizgi kalınlığı ve kesikle ayırt edilir */
      yildizlar.forEach(([T, ad, renk, kes], i) => {
        const y = 50 + i * 20;
        s += S.cizgi(238, y - 4, 262, y - 4, { renk, kalin: T === 5772 ? 2.6 : 2, kesik: kes });
        s += S.yazi(268, y, ad + ' ' + (T >= 10000 ? '12.100' : T) + ' K', { boy: 13, renk: R.metin, kalin: true });
      });
      yildizlar.forEach(([T, ad, renk, kes]) => {
        const ls = [];
        for (let i = 0; i <= 240; i++) {
          const l = ar.x0 + (ar.x1 - ar.x0) * i / 240, v = B(l, T) / ref;
          if (v >= ar.y0) ls.push([ek.X(l), ek.Y(Math.min(v, ar.y1))]);
        }
        s += S.egri(ls, { renk, kalin: T === 5772 ? 2.6 : 2, kesik: kes });
        const lt = b / T * 1e9, xt = ek.X(lt), yt = ek.Y(B(lt, T) / ref);
        s += S.cizgi(xt, yt, xt, alan.y + alan.h, { renk, kalin: 1, kesik: '2 3', saydam: 0.8 });
        s += S.daire(xt, yt, 4, { dolgu: renk, renk });
        s += S.yazi(xt, yt - 10, Math.round(lt) + ' nm', { boy: 13, renk: R.metin, hiza: 'middle', kalin: true });
      });
      return s;
    }
  });

  /* d2 · bölüm 6: Kirchhoff düzeni ve hidrojenin Balmer çizgileri (havada, Wikipedia: Balmer series). */
  C.ekle('d2-cizgiler', {
    ders: 'd2', bolum: 6, oran: 0.86,
    baslik: 'Sürekli tayf, soğurma ve salma',
    aciklama: 'Sıcak, yoğun bir kaynağa doğrudan bakarsan kesintisiz bir tayf görürsün. Aynı kaynağa önündeki daha soğuk, seyrek hidrojen gazının ardından bakarsan belirli dalga boylarında karanlık soğurma çizgileri çıkar. Gaza yandan, kaynağı görmeden bakarsan tam aynı dalga boylarında parlak salma çizgileri görürsün; en kırmızısı 656,28 nanometredeki H-alfa çizgisidir. Yalnız hidrojen çizgileri gösterildi; üst düzen ölçeksizdir.',
    kaynak: [KAYNAK.balmer, KAYNAK.fraunhofer],
    ciz(S) {
      const R = S.R;
      let s = '';
      /* üst: düzen */
      const kx = 52, ky = 72, gx = 196, gy = 72;
      s += S.daire(kx, ky, 22, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(kx, ky + 42, 'sıcak, yoğun', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.yazi(kx, ky + 58, 'kaynak', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.elips(gx, gy, 44, 22, { renk: R.mavi, kalin: 1.5, kesik: '4 3', dolgu: R.mavi, saydam: 0.25 });
      s += S.elips(gx, gy, 44, 22, { renk: R.mavi, kalin: 1.5, kesik: '4 3' });
      s += S.yazi(gx - 18, gy + 40, 'soğuk, seyrek gaz', { boy: 13, renk: R.mavi, hiza: 'middle' });
      /* üç bakış */
      const goz = (x, y, ad, hz) => S.daire(x, y, 4, { dolgu: R.metin, renk: R.metin }) + S.yazi(x + (hz === 'end' ? -10 : 10), y + 5, ad, { boy: 13, renk: R.metin, hiza: hz || 'start', kalin: true });
      s += S.ok(kx + 24, ky - 8, 298, 22, { renk: R.gunes, kalin: 1.5, boy: 8 }) + goz(304, 20, '1 sürekli');
      s += S.ok(kx + 24, ky, 300, ky, { renk: R.gunes, kalin: 1.5, boy: 8 }) + goz(306, ky, '2 soğurma');
      s += S.ok(gx + 22, gy + 20, 296, 132, { renk: R.mavi, kalin: 1.5, boy: 8 }) + goz(302, 134, '3 salma');
      /* alt: üç şerit, 380–700 nm */
      const x0 = 20, x1 = 380, X = nm => x0 + (nm - 380) / (700 - 380) * (x1 - x0), sh = 24;
      const balmer = [656.279, 486.135, 434.0472, 410.1734, 397.0075];
      const seritY = [182, 234, 286];
      ['1 Sürekli', '2 Soğurma', '3 Salma'].forEach((ad, i) => s += S.yazi(x0, seritY[i] - 7, ad, { boy: 13, renk: R.metin, kalin: true }));
      s += S.kutu(x0, seritY[0], x1 - x0, sh, { renk: R.soluk, kalin: 1, dolgu: R.metin, saydam: 0.85 });
      s += S.kutu(x0, seritY[1], x1 - x0, sh, { renk: R.soluk, kalin: 1, dolgu: R.metin, saydam: 0.85 });
      s += S.kutu(x0, seritY[2], x1 - x0, sh, { renk: R.soluk, kalin: 1, dolgu: R.zemin });
      balmer.forEach(l => {
        s += S.cizgi(X(l), seritY[1], X(l), seritY[1] + sh, { renk: R.zemin, kalin: 3 });
        s += S.cizgi(X(l), seritY[2], X(l), seritY[2] + sh, { renk: R.metin, kalin: 3 });
      });
      /* H-alfa ve H-beta adları ile dalga boyu ekseni */
      s += S.yazi(X(656.279), seritY[1] - 7, 'H-alfa 656,28', { boy: 13, renk: R.vurgu, hiza: 'middle' });
      s += S.yazi(X(486.135), seritY[1] - 7, 'H-beta', { boy: 13, renk: R.vurgu, hiza: 'middle' });
      const ay = seritY[2] + sh;
      [400, 500, 600, 700].forEach(nm => {
        s += S.cizgi(X(nm), ay, X(nm), ay + 5, { renk: R.soluk, kalin: 1 });
        s += S.yazi(X(nm), ay + 19, nm + (nm === 700 ? ' nm' : ''), { boy: 13, renk: R.soluk, hiza: nm === 700 ? 'end' : 'middle' });
      });
      return s;
    }
  });

  /* d2 · bölüm 8: atmosfer pencereleri (optik 300 nm–2 μm, kızılötesi 8–14 μm, radyo 0,3 mm–30 m). */
  C.ekle('d2-pencereler', {
    ders: 'd2', bolum: 8, oran: 0.56,
    baslik: 'Atmosfer pencereleri',
    aciklama: 'Yukarıdan gelen oklar tayfın her bölgesinden ışığı temsil eder; çoğu atmosfer katmanında durur. Yere ulaşanlar üç pencereden geçer: yaklaşık 300 nm ile 2 μm arasındaki optik pencere, 8 ile 14 μm arasındaki kızılötesi pencere ve 0,3 mm ile 30 metre arasındaki radyo penceresi. Yatay eksen logaritmiktir; aradaki kısmi geçirgenlikler gösterilmedi.',
    kaynak: [KAYNAK.optikPencere, KAYNAK.radyoPencere, KAYNAK.nasaTayf],
    ciz(S) {
      const R = S.R, x0 = 20, x1 = 380, X = l => lx(l, x0, x1);
      const pencere = [[3e-7, 2e-6], [8e-6, 1.4e-5], [3e-4, 30]];
      const acik = l => pencere.some(([a, b]) => l >= a && l <= b);
      let s = '';
      const kay = { 'Morötesi': -6, 'Kızılötesi': -2, 'Mikrodalga': 10 };      // komşu adlar birbirine değmesin
      BANT.forEach(([ad, a, b]) => { if (ad) s += S.yazi((X(a) + X(b)) / 2 + (kay[ad] || 0), 16, ad, { boy: 13, renk: R.soluk, hiza: 'middle' }); });
      const ust = 82, alt = 112, zem = 152;
      /* atmosfer katmanı: pencerelerde boşluk */
      let bas = x0;
      pencere.forEach(([a, b]) => { s += S.kutu(bas, ust, X(a) - bas, alt - ust, { renk: 'none', dolgu: R.yuzey2 }); bas = X(b); });
      s += S.kutu(bas, ust, x1 - bas, alt - ust, { renk: 'none', dolgu: R.yuzey2 });
      s += S.yazi(70, alt - 10, 'atmosfer', { boy: 13, renk: R.soluk, hiza: 'middle' });
      for (let x = 26; x <= 374; x += 11.6) {
        const l = Math.pow(10, L0 + (x - x0) / (x1 - x0) * (L1 - L0));
        if (acik(l)) s += S.ok(x, 30, x, zem - 4, { renk: R.vurgu, kalin: 1.6, boy: 6 });
        else s += S.ok(x, 30, x, ust - 3, { renk: R.soluk, kalin: 1.2, boy: 6 });
      }
      /* dar kızılötesi penceresinden tek ok */
      const xi = X(Math.sqrt(8e-6 * 1.4e-5));
      s += S.ok(xi, 30, xi, zem - 4, { renk: R.vurgu, kalin: 1.6, boy: 6 });
      s += S.cizgi(x0, zem, x1, zem, { renk: R.metin, kalin: 2 });
      /* etiketler */
      const xo = X(2e-6);
      s += S.yazi(xo, zem + 18, 'Optik pencere', { boy: 13, renk: R.metin, hiza: 'end', kalin: true });
      s += S.yazi(xo, zem + 34, '300 nm–2 μm', { boy: 13, renk: R.soluk, hiza: 'end' });
      const xr = (X(3e-4) + X(30)) / 2 + 10;
      s += S.yazi(xr, zem + 18, 'Radyo penceresi', { boy: 13, renk: R.metin, hiza: 'middle', kalin: true });
      s += S.yazi(xr, zem + 34, '0,3 mm–30 m', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.cizgi(xi, zem, xi, zem + 44, { renk: R.soluk, kalin: 1 });
      s += S.yazi(xi - 4, zem + 60, '8–14 μm kızılötesi pencere', { boy: 13, renk: R.metin, hiza: 'start' });
      return s;
    }
  });

  /* =============================================================== d12 ================================================================ */

  /* d12 · bölüm 1: mercekli, Newton ve Cassegrain teleskoplarında ışın yolu (ölçeksiz). */
  C.ekle('d12-teleskop-tipleri', {
    ders: 'd12', bolum: 1, oran: 1.08,
    baslik: 'Mercekli ve aynalı teleskopta ışın yolu',
    aciklama: 'Üstte mercekli teleskop: cam maviyi kırmızıdan daha çok büktüğü için mavi ışık merceğe daha yakın, kırmızı daha uzak bir noktada odaklanır; bu renk sapmasıdır. Ortada Newton tipi: çukur ana ayna ışığı geri yansıtır, küçük düz ikincil ayna 90° saptırıp tüpün yanındaki göz merceğine yollar. Altta Cassegrain tipi: tümsek ikincil ayna ışığı geri gönderir, ışık ana aynadaki delikten geçip arkada odaklanır. Çizim ölçeksizdir.',
    kaynak: [KAYNAK.teleskop],
    ciz(S) {
      const R = S.R;
      let s = '';
      /* ---- 1. mercekli ---- */
      const c1 = 74, lx1 = 74;
      s += S.yazi(10, 18, 'Mercekli', { boy: 15, renk: R.metin, kalin: true });
      s += S.elips(lx1, c1, 8, 44, { renk: R.mavi, kalin: 1.5, dolgu: R.mavi, saydam: 0.3 });
      s += S.elips(lx1, c1, 8, 44, { renk: R.mavi, kalin: 1.5 });
      const fMavi = 268, fKirmizi = 318;
      [-34, 34].forEach(d => {
        s += S.cizgi(14, c1 + d, lx1, c1 + d, { renk: R.metin, kalin: 1.4 });
        s += S.cizgi(lx1, c1 + d, fMavi, c1, { renk: R.mavi, kalin: 1.6 });
        s += S.cizgi(lx1, c1 + d, fKirmizi, c1, { renk: R.uyari, kalin: 1.6, kesik: '6 4' });
      });
      s += S.daire(fMavi, c1, 3.5, { dolgu: R.mavi, renk: R.mavi });
      s += S.daire(fKirmizi, c1, 3.5, { dolgu: R.uyari, renk: R.uyari });
      s += S.yazi(fMavi, c1 + 30, 'mavi odak', { boy: 13, renk: R.mavi, hiza: 'middle' });
      s += S.yazi(fKirmizi + 8, c1 + 5, 'kırmızı', { boy: 13, renk: R.uyari });
      s += S.yazi(fKirmizi + 8, c1 + 21, 'odak', { boy: 13, renk: R.uyari });
      s += S.yazi(lx1, c1 + 62, 'mercek', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.cizgi(10, 140, 390, 140, { renk: R.cizgi, kalin: 1 });
      /* ---- 2. Newton ---- */
      const c2 = 214, ax2 = 330, F2 = [186, c2], kx2 = 230;
      s += S.yazi(10, 162, 'Newton tipi aynalı', { boy: 15, renk: R.metin, kalin: true });
      s += S.kutu(40, c2 - 40, ax2 - 34, 80, { renk: R.soluk, kalin: 1 });
      s += S.kutu(kx2 - 9, c2 - 58, 18, 18, { renk: R.metin, kalin: 1.5, dolgu: R.yuzey2 });
      s += S.yazi(kx2 + 16, c2 - 47, 'göz merceği', { boy: 13, renk: R.soluk });
      s += S.yol(`M${ax2 - 4},${c2 - 38} Q${ax2 + 14},${c2} ${ax2 - 4},${c2 + 38}`, { renk: R.vurgu, kalin: 3 });
      s += S.yazi(ax2 + 14, c2 + 5, 'ana ayna', { boy: 13, renk: R.vurgu });
      s += S.cizgi(kx2 - 11, c2 - 11, kx2 + 11, c2 + 11, { renk: R.vurgu, kalin: 3.4 });
      s += S.yazi(kx2, c2 + 58, 'düz ikincil ayna', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.cizgi(kx2, c2 + 44, kx2 + 2, c2 + 13, { renk: R.soluk, kalin: 1 });
      const odak2 = [kx2, c2 - (kx2 - F2[0])];     // F2'nin ikincil aynadaki yansıması
      [-28, 28].forEach(d => {
        const yA = c2 + d, ayn = [ax2, yA];
        /* ana aynadan F2'ye giden ışın ikincil aynayı (y − c2 = x − kx2 doğrusu) keser */
        const dx = F2[0] - ayn[0], dy = F2[1] - ayn[1];
        const t = ((ayn[0] - kx2) - (ayn[1] - c2)) / (dy - dx);
        const P = [ayn[0] + dx * t, ayn[1] + dy * t];
        s += S.cizgi(14, yA, ayn[0], yA, { renk: R.metin, kalin: 1.4 });
        s += S.cizgi(ayn[0], yA, P[0], P[1], { renk: R.gunes, kalin: 1.4 });
        s += S.cizgi(P[0], P[1], odak2[0], odak2[1], { renk: R.gunes, kalin: 1.4 });
      });
      s += S.cizgi(10, 284, 390, 284, { renk: R.cizgi, kalin: 1 });
      /* ---- 3. Cassegrain ---- */
      const c3 = 360, ax3 = 318, sx3 = 196, f3 = 168, odak3 = [366, c3];
      s += S.yazi(10, 306, 'Cassegrain tipi aynalı', { boy: 15, renk: R.metin, kalin: true });
      s += S.kutu(40, c3 - 40, ax3 - 34, 80, { renk: R.soluk, kalin: 1 });
      s += S.yol(`M${ax3 - 4},${c3 - 38} Q${ax3 + 4},${c3 - 20} ${ax3 + 5},${c3 - 7}`, { renk: R.vurgu, kalin: 3 });
      s += S.yol(`M${ax3 + 5},${c3 + 7} Q${ax3 + 4},${c3 + 20} ${ax3 - 4},${c3 + 38}`, { renk: R.vurgu, kalin: 3 });
      s += S.yol(`M${sx3},${c3 - 10} Q${sx3 + 7},${c3} ${sx3},${c3 + 10}`, { renk: R.vurgu, kalin: 3 });
      s += S.kutu(odak3[0] - 4, c3 - 9, 18, 18, { renk: R.metin, kalin: 1.5, dolgu: R.yuzey2 });
      s += S.yazi(ax3 + 2, c3 - 46, 'ana ayna (delikli)', { boy: 13, renk: R.vurgu, hiza: 'middle' });
      s += S.yazi(sx3, c3 + 56, 'tümsek ikincil ayna', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.yazi(odak3[0] + 5, c3 + 30, 'göz', { boy: 13, renk: R.soluk, hiza: 'middle' });
      s += S.yazi(odak3[0] + 5, c3 + 46, 'merceği', { boy: 13, renk: R.soluk, hiza: 'middle' });
      [-28, 28].forEach(d => {
        const yA = c3 + d;
        const yS = yA + (c3 - yA) * (ax3 - sx3) / (ax3 - f3);
        s += S.cizgi(14, yA, ax3, yA, { renk: R.metin, kalin: 1.4 });
        s += S.cizgi(ax3, yA, sx3 + 4, yS, { renk: R.gunes, kalin: 1.4 });
        s += S.cizgi(sx3 + 4, yS, odak3[0], c3, { renk: R.gunes, kalin: 1.4 });
      });
      return s;
    }
  });

  /* d12 · bölüm 2: açıklıklar ölçekli daireler (göz 7 mm, dürbün 50 mm, teleskop 200 mm); oran (D/d)², Δm = 2,5 log(oran). */
  C.ekle('d12-isik-kovasi', {
    ders: 'd12', bolum: 2, oran: 0.73,
    baslik: 'Açıklık büyüdükçe toplanan ışık',
    aciklama: 'Üç daire aynı ölçekte çizildi: karanlıkta 7 mm açılan göz bebeği, 50 milimetrelik dürbün objektifi ve 200 milimetrelik teleskop aynası. Toplanan ışık alanla, yani çapın karesiyle artar: dürbün gözden yaklaşık 51 kat, teleskop yaklaşık 816 kat ışık toplar. Bu da sırasıyla yaklaşık 4,3 ve 7,3 kadir daha sönük yıldızlar demektir.',
    kaynak: [KAYNAK.teleskop],
    ciz(S) {
      const R = S.R, k = 0.9, cy = 112, goz = 7;
      const ac = [[200, 112, 'Teleskop'], [50, 252, 'Dürbün'], [7, 346, 'Göz bebeği']];
      let s = '';
      ac.forEach(([D, x, ad]) => {
        const oran = (D / goz) * (D / goz), dm = 2.5 * Math.log10(oran);
        s += S.daire(x, cy, D * k / 2, { renk: D === goz ? R.metin : R.vurgu, kalin: 1.5, dolgu: R.vurguSoluk });
        s += S.yazi(x, 226, ad, { boy: 14, renk: R.metin, hiza: 'middle', kalin: true });
        s += S.yazi(x, 243, D + ' mm', { boy: 13, renk: R.metin, hiza: 'middle' });
        s += S.yazi(x, 262, D === goz ? '1 kat' : tr(oran, 0) + ' kat ışık', { boy: 13, renk: R.vurgu, hiza: 'middle', kalin: true });
        if (D !== goz) s += S.yazi(x, 280, '+' + tr(dm, 1) + ' kadir', { boy: 13, renk: R.soluk, hiza: 'middle' });
      });
      s += S.cizgi(346, cy + 10, 346, 208, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      return s;
    }
  });

  /* d12 · bölüm 3: iki noktasal yıldızın kırınım (Airy) profilleri; aralık 2θ, θ (Rayleigh), θ/2. I = [2 J1(x)/x]², ilk sıfır x = 3,8317. */
  C.ekle('d12-rayleigh', {
    ders: 'd12', bolum: 3, oran: 0.58,
    baslik: 'Kırınım ve iki yıldızın ayrılma sınırı',
    aciklama: 'Her yıldızın görüntüsü kırınım yüzünden bir tepe biçiminde yayılır; eğriler bunun kesitidir ve hesapla çizildi. İki yıldızın arası θ = 1,22 × λ / D açısının iki katıysa iki ayrı tepe görürsün; tam bu açıya eşitse ortada küçük bir çukur kalır ve yıldızlar zar zor ayrılır; yarısı kadarsa tek bir tepe görünür.',
    kaynak: [KAYNAK.ayirma],
    ciz(S) {
      const R = S.R;
      const J1 = x => { let t = x / 2, top = t, m = 0; const x2 = -(x * x) / 4; while (Math.abs(t) > 1e-14 && m < 80) { m++; t *= x2 / (m * (m + 1)); top += t; } return top; };
      const I = u => { const x = 3.8317 * u; return Math.abs(x) < 1e-6 ? 1 : Math.pow(2 * J1(x) / x, 2); };
      const panel = [[2, 'aralık 2θ', 'ayrı görünür'], [1, 'aralık θ', 'zar zor ayrılır'], [0.5, 'aralık θ/2', 'tek leke']];
      const pw = 116, taban = 170, yuk = 112;
      let s = '';
      panel.forEach(([ar, ust, alt], i) => {
        const x0 = 8 + i * (pw + 18), xm = x0 + pw / 2, umax = 2.6;
        const f = u => I(u - ar / 2) + I(u + ar / 2);
        let mx = 0; for (let j = 0; j <= 200; j++) mx = Math.max(mx, f(-umax + 2 * umax * j / 200));
        const top = [], t1 = [], t2 = [];
        for (let j = 0; j <= 160; j++) {
          const u = -umax + 2 * umax * j / 160, x = xm + u / umax * (pw / 2);
          top.push([x, taban - f(u) / mx * yuk]); t1.push([x, taban - I(u - ar / 2) / mx * yuk]); t2.push([x, taban - I(u + ar / 2) / mx * yuk]);
        }
        s += S.egri(t1, { renk: R.soluk, kalin: 1, kesik: '3 3' }) + S.egri(t2, { renk: R.soluk, kalin: 1, kesik: '3 3' });
        s += S.egri(top, { renk: R.yildiz, kalin: 2.2 });
        s += S.cizgi(x0, taban, x0 + pw, taban, { renk: R.soluk, kalin: 1 });
        /* yıldızların konumu */
        [-ar / 2, ar / 2].forEach(u => { const x = xm + u / umax * (pw / 2); s += S.cizgi(x, taban, x, taban + 6, { renk: R.vurgu, kalin: 2 }); });
        s += S.yazi(xm, 30, ust, { boy: 14, renk: R.vurgu, hiza: 'middle', kalin: true });
        s += S.yazi(xm, taban + 26, alt, { boy: 13, renk: R.metin, hiza: 'middle' });
      });
      s += S.yazi(200, 224, 'θ = 1,22 × λ / D', { boy: 14, renk: R.soluk, hiza: 'middle' });
      return s;
    }
  });

  /* d12 · bölüm 6: ayırma gücü karşılaştırması (log eksen) ve atmosferin görüş bandı 0,4–1″. */
  C.ekle('d12-ayirma-gorus', {
    ders: 'd12', bolum: 6, oran: 0.68,
    baslik: 'Aletlerin keskinliği ve atmosfer',
    aciklama: 'Çubuk ne kadar kısaysa alet o kadar ince ayrıntı seçer; eksen logaritmiktir. Göz yaklaşık 60 yay saniyesi, Galileo\'nun 37 milimetrelik objektifi 3,7, 100 milimetrelik teleskop 1,38, Hubble 0,05, Doğu Anadolu Gözlemevi\'nin 4 metrelik teleskobu görünür ışıktaki kırınım sınırıyla yaklaşık 0,03 yay saniyesi. Gölgeli şerit atmosferin en iyi yerlerdeki 0,4 ile 1 yay saniyelik titreşimidir: yerdeki büyük teleskobun keskinliğini aynası değil havası belirler, Hubble ise bunun altına iner.',
    kaynak: [KAYNAK.ayirma, KAYNAK.gozPlak, KAYNAK.gorus, KAYNAK.dag, KAYNAK.hubble],
    ciz(S) {
      const R = S.R, x0 = 132, x1 = 384, l0 = -2, l1 = 2;
      const X = v => x0 + (Math.log10(v) - l0) / (l1 - l0) * (x1 - x0);
      const sat = [
        ['Çıplak göz', 60, '60″'], ['Galileo 37 mm', 138 / 37, tr(138 / 37, 1) + '″'], ['Teleskop 100 mm', 1.38, '1,38″'],
        ['Hubble 2,4 m', 0.052, '0,05″'], ['DAG 4 m', 138 / 4000, tr(138 / 4000, 2) + '″']
      ];
      const y0 = 54, dy = 36, eks = y0 + sat.length * dy - 8;
      let s = '';
      s += S.kutu(X(0.4), 30, X(1) - X(0.4), eks - 30, { renk: 'none', dolgu: R.mavi, saydam: 0.22 });
      s += S.yazi((X(0.4) + X(1)) / 2, 22, 'atmosfer 0,4–1″', { boy: 13, renk: R.mavi, hiza: 'middle', kalin: true });
      sat.forEach(([ad, v, t], i) => {
        const y = y0 + i * dy;
        s += S.kutu(x0, y - 8, X(v) - x0, 14, { renk: 'none', dolgu: i === 3 ? R.iyi : R.vurgu, saydam: 0.85 });
        s += S.yazi(x0 - 8, y - 2, ad, { boy: 13, renk: R.metin, hiza: 'end', kalin: true });
        s += S.yazi(x0 - 8, y + 14, t, { boy: 13, renk: R.soluk, hiza: 'end' });
      });
      s += S.cizgi(x0, eks, x1, eks, { renk: R.soluk, kalin: 1 });
      s += S.cizgi(x0, 30, x0, eks, { renk: R.soluk, kalin: 1 });
      [[0.01, '0,01″'], [0.1, '0,1″'], [1, '1″'], [10, '10″'], [100, '100″']].forEach(([v, t], i) => {
        s += S.cizgi(X(v), eks, X(v), eks + 5, { renk: R.soluk, kalin: 1 });
        s += S.yazi(X(v), eks + 19, t, { boy: 13, renk: R.soluk, hiza: i === 4 ? 'end' : 'middle' });
      });
      s += S.yazi((x0 + x1) / 2, eks + 40, 'kısa çubuk = ince ayrıntı', { boy: 13, renk: R.soluk, hiza: 'middle' });
      return s;
    }
  });

  /* =============================================================== d11 ================================================================ */

  /* d11 · bölüm 1: çıkış göz bebeği ile göz bebeği (ölçekli). 7×50 → 7,14 mm; 10×50 → 5 mm; göz bebeği 20 yaşta 7,3, 50 yaşta 5,8 mm. */
  C.ekle('d11-cikis-gozbebegi', {
    ders: 'd11', bolum: 1, oran: 0.58,
    baslik: 'Çıkış göz bebeği ve senin göz bebeğin',
    aciklama: 'Dolu daire dürbünden çıkan ışık demeti, kesikli çember senin göz bebeğin; ikisi aynı ölçekte. 7×50\'nin 7,14 milimetrelik demeti 20 yaşındaki ortalama 7,3 milimetrelik göz bebeğine tümüyle girer. 50 yaşında göz bebeği ortalama 5,8 milimetredir: demetin dış halkası irise çarpar ve ışığın yaklaşık üçte biri boşa gider. 10×50\'nin 5 milimetrelik demeti ise aynı göze tümüyle girer.',
    kaynak: [KAYNAK.cikis],
    ciz(S) {
      const R = S.R, k = 12, cy = 92;
      const panel = [[70, '7×50, 20 yaş', 50 / 7, 7.3], [200, '7×50, 50 yaş', 50 / 7, 5.8], [330, '10×50, 50 yaş', 5, 5.8]];
      let s = '';
      panel.forEach(([x, ad, demet, goz]) => {
        const rd = demet * k / 2, rg = goz * k / 2, tasar = demet > goz;
        s += S.yazi(x, 22, ad, { boy: 14, renk: R.metin, hiza: 'middle', kalin: true });
        if (tasar) {
          s += S.daire(x, cy, rd, { renk: R.uyari, kalin: 1.2, dolgu: R.uyari, saydam: 0.35 });
          s += S.daire(x, cy, rg, { renk: 'none', dolgu: R.vurgu, saydam: 0.55 });
        } else s += S.daire(x, cy, rd, { renk: 'none', dolgu: R.vurgu, saydam: 0.55 });
        s += S.daire(x, cy, rg, { renk: R.metin, kalin: 1.6, kesik: '4 3' });
        s += S.yazi(x, 162, 'demet ' + tr(demet, demet === 5 ? 0 : 2) + ' mm', { boy: 13, renk: R.vurgu, hiza: 'middle' });
        s += S.yazi(x, 180, 'göz bebeği ' + tr(goz, 1) + ' mm', { boy: 13, renk: R.metin, hiza: 'middle' });
        const kayip = tasar ? 1 - (goz / demet) * (goz / demet) : 0;
        s += S.yazi(x, 202, tasar ? '%' + tr(kayip * 100, 0) + ' boşa gider' : 'hepsi girer', { boy: 13, renk: tasar ? R.uyari : R.iyi, hiza: 'middle', kalin: true });
      });
      s += S.cizgi(135, 30, 135, 205, { renk: R.cizgi, kalin: 1 });
      s += S.cizgi(265, 30, 265, 205, { renk: R.cizgi, kalin: 1 });
      return s;
    }
  });

  /* d11 · bölüm 5: 6°'lik örnek görüş alanı, içine sığan 12 dolunay ve el ölçüleri (ölçekli çubuklar). */
  C.ekle('d11-gorus-alani', {
    ders: 'd11', bolum: 5, oran: 0.85,
    baslik: 'Dürbün görüş alanı, dolunay ve el ölçüleri',
    aciklama: 'Daire 6°\'lik örnek bir dürbün görüş alanıdır; içinden yan yana yarımşar derecelik 12 dolunay geçer. Alttaki çubuklar aynı ölçekte: kol uzunluğunda yumruk yaklaşık 10°, üç parmak 5°, serçe parmak 1°, dolunay 0,5°. Görüş alanı bir yumruktan küçük, üç parmaktan biraz büyüktür.',
    kaynak: [KAYNAK.el, KAYNAK.atlama],
    ciz(S) {
      const R = S.R, k = 26, cx = 200, cy = 100, alan = 6, ay = 0.5;
      let s = '';
      const r = alan * k / 2;
      s += S.daire(cx, cy, r, { renk: R.vurgu, kalin: 2, dolgu: R.yuzey2 });
      const n = Math.round(alan / ay), ra = ay * k / 2;
      for (let i = 0; i < n; i++) s += S.daire(cx - r + ra + i * 2 * ra, cy, ra - 0.4, { renk: R.ay, kalin: 1, dolgu: R.ay, saydam: 0.85 });
      s += S.yazi(cx, cy + r + 20, 'örnek görüş alanı: 6°', { boy: 14, renk: R.vurgu, hiza: 'middle', kalin: true });
      s += S.yazi(cx, cy + 36, n + ' dolunay', { boy: 14, renk: R.metin, hiza: 'middle' });
      const x0 = 112, cub = [['Yumruk', 10, R.soluk], ['Dürbün alanı', 6, R.vurgu], ['Üç parmak', 5, R.soluk], ['Serçe parmak', 1, R.soluk], ['Dolunay', 0.5, R.ay]];
      cub.forEach(([ad, d, renk], i) => {
        const y = 224 + i * 24;
        s += S.yazi(x0 - 8, y + 5, ad, { boy: 13, renk: R.metin, hiza: 'end' });
        s += S.kutu(x0, y - 5, d * k, 10, { renk: 'none', dolgu: renk, saydam: 0.85 });
        s += S.yazi(x0 + d * k + 6, y + 5, tr(d, d < 1 ? 1 : 0) + '°', { boy: 13, renk: R.soluk });
      });
      return s;
    }
  });

  /* d11 · bölüm 7: İstanbul'dan (41°) hedeflerin meridyendeki yüksekliği A = 90° − 41° + δ. Açılar ölçekli. */
  C.ekle('d11-hedef-yukseklik', {
    ders: 'd11', bolum: 7, oran: 0.56,
    baslik: 'Dürbün hedeflerinin İstanbul\'daki en yüksek konumu',
    aciklama: 'Güneye bakan yan kesitte her hedef gökte en yükseğe çıktığı anda gösterildi: Deniz Kulağı Bulutsusu (M8) yalnızca 24,6°, Orion Bulutsusu (M42) 43,6°, Ülker 73,1°, M13 85,5° yükselir; Andromeda (M31) başucunun 0,3° kuzeyinden geçer. Alçaktaki M8 için güney ufku açık bir yer gerekir.',
    kaynak: [KAYNAK.messier],
    ciz(S) {
      const R = S.R, cx = 190, cy = 180, r = 118, enlem = 41;
      const hedef = [[-24.4, 'M8'], [-5.4, 'M42'], [24.1, 'Ülker'], [36.5, 'M13'], [41.3, 'M31']];
      let s = '';
      s += S.yay(cx, cy, r, 0, 180, { renk: R.soluk, kalin: 1 });
      s += S.cizgi(cx - r - 22, cy, cx + r + 40, cy, { renk: R.metin, kalin: 2 });
      s += S.yazi(cx - r - 20, cy + 20, 'Kuzey', { boy: 14, renk: R.soluk });
      s += S.yazi(cx + r + 38, cy + 20, 'Güney', { boy: 14, renk: R.soluk, hiza: 'end' });
      s += S.cizgi(cx, cy, cx, cy - r, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.yazi(cx, 16, 'Başucu', { boy: 13, renk: R.soluk, hiza: 'middle' });
      hedef.forEach(([dec, ad]) => {
        const A = 90 - enlem + dec, a = A * rad;           // güney ufkundan ölçülen açı (90°'yi aşarsa başucunun kuzeyi)
        const x = cx + r * Math.cos(a), y = cy - r * Math.sin(a);
        s += S.cizgi(cx, cy, x, y, { renk: R.vurgu, kalin: 1.2, saydam: 0.8 });
        s += S.daire(x, y, 4.5, { dolgu: R.yildiz, renk: R.yildiz });
        let t, tx, ty, hz = 'start';
        if (A > 90) { t = ad + ' ≈ başucu'; tx = x - 10; ty = y - 18; hz = 'end'; s += S.cizgi(x, y, x - 8, y - 14, { renk: R.soluk, kalin: 1 }); }
        else if (A > 80) { t = ad + ' ' + tr(A, 1) + '°'; tx = x + 10; ty = y - 22; s += S.cizgi(x, y, x + 8, y - 18, { renk: R.soluk, kalin: 1 }); }
        else { t = ad + ' ' + tr(A, 1) + '°'; tx = x + 10; ty = y + (A > 60 ? -4 : 0); }
        s += S.yazi(tx, ty, t, { boy: 14, renk: R.metin, hiza: hz, kalin: true });
      });
      s += S.daire(cx, cy, 4.5, { dolgu: R.metin, renk: R.metin });
      s += S.yazi(cx, cy + 22, 'Sen (İstanbul, 41° K)', { boy: 13, renk: R.soluk, hiza: 'middle' });
      return s;
    }
  });

})();
