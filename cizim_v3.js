/* cizim_v3.js — d20–d24 ders çizimleri (cizim.js kayıtları).
   Dersler: d20 (astronominin kısa tarihi), d21 (takımyıldızlar), d22 (zaman ve takvim), d23 (uzaya çıkmak), d24 (gökyüzünü fotoğraflamak).
   Sayılar ders metninden (kaynaklı) gelir ya da burada formülle hesaplanır; gömülü tablolar (zaman denklemi, analemma,
   Güneş'in takımyıldız ve burç geçişleri, yıldız konumları) Astronomy Engine ve uygulamanın yıldız kataloğuyla hesaplandı.
   Her değerin kaynağı: arastirma/cizim_v3_kaynak.md. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  const rad = Math.PI / 180;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti, binlik nokta */
  const tr = (x, d) => {
    const s = Math.abs(x).toFixed(d == null ? 0 : d).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 ? '−' : '') + s.join(',');
  };
  const KAYNAK = {
    eratosthenes: { ad: 'Wikipedia: Earth\'s circumference', url: 'https://en.wikipedia.org/wiki/Earth%27s_circumference' },
    parisSozluk: { ad: 'Observatoire de Paris: Eratosthenes\' method', url: 'https://dictionary.obspm.fr/terms/eratosthenes-method/' },
    aristarkhos: { ad: 'Wikipedia: Aristarchus of Samos', url: 'https://en.wikipedia.org/wiki/Aristarchus_of_Samos' },
    babil: { ad: 'Wikipedia: Astronomical Diaries', url: 'https://en.wikipedia.org/wiki/Astronomical_Diaries' },
    almagest: { ad: 'Wikipedia: Almagest', url: 'https://en.wikipedia.org/wiki/Almagest' },
    tycho: { ad: 'Wikipedia: Tycho Brahe', url: 'https://en.wikipedia.org/wiki/Tycho_Brahe' },
    kepler: { ad: 'Wikipedia: Kepler\'s laws', url: 'https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion' },
    battani: { ad: 'MacTutor: al-Battani', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Al-Battani/' },
    ulugbey: { ad: 'Wikipedia: Ulugh Beg', url: 'https://en.wikipedia.org/wiki/Ulugh_Beg' },
    takiyuddin: { ad: 'TDV İslâm Ansiklopedisi: Takıyyüddin er-Râsıd', url: 'https://islamansiklopedisi.org.tr/takiyyuddin-er-rasid' },
    kopernik: { ad: 'Wikipedia: Nicolaus Copernicus', url: 'https://en.wikipedia.org/wiki/Nicolaus_Copernicus' },
    galileo: { ad: 'Wikipedia: Sidereus Nuncius', url: 'https://en.wikipedia.org/wiki/Sidereus_Nuncius' },
    newton: { ad: 'Wikipedia: Newton\'s law of universal gravitation', url: 'https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation' },
    rob: { ad: 'Royal Observatory of Belgium: burç geçişleri 2026', url: 'https://robinfo.oma.be/en/astro-info/sun/passing-of-the-sun-through-the-zodiac-signs-in-2026/' },
    earthskyOph: { ad: 'EarthSky: Sun in Ophiuchus', url: 'https://earthsky.org/astronomy-essentials/sun-in-ophiuchus-november-30-to-december-18/' },
    astronomyEngine: { ad: 'Astronomy Engine (Don Cross)', url: 'https://github.com/cosinekitty/astronomy' },
    polaris: { ad: 'EarthSky: Big Dipper to Polaris', url: 'https://earthsky.org/tonight/use-big-dipper-to-locate-polaris-the-north-star' },
    arcturus: { ad: 'EarthSky: Follow the arc to Arcturus', url: 'https://earthsky.org/tonight/follow-the-arc-to-arcturus-in-may' },
    wgsn: { ad: 'IAU WGSN yıldız adları', url: 'https://exopla.net/star-names/modern-iau-star-names/' },
    zd: { ad: 'Wikipedia: Equation of time', url: 'https://en.wikipedia.org/wiki/Equation_of_time' },
    analemma: { ad: 'J. Denker: Analemma', url: 'https://www.av8n.com/physics/analemma.htm' },
    yildizZamani: { ad: 'Wikipedia: Sidereal time', url: 'https://en.wikipedia.org/wiki/Sidereal_time' },
    nasaDunya: { ad: 'NASA Earth Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
    nasaMars: { ad: 'NASA Mars Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html' },
    tsiolkovsky: { ad: 'Wikipedia: Tsiolkovsky rocket equation', url: 'https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation' },
    esaYorunge: { ad: 'ESA: Types of orbits', url: 'https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits' },
    sso: { ad: 'Wikipedia: Sun-synchronous orbit', url: 'https://en.wikipedia.org/wiki/Sun-synchronous_orbit' },
    heavensAbove: { ad: 'Heavens-Above: ISS', url: 'https://www.heavens-above.com/SatInfo.aspx?satid=25544' },
    imece: { ad: 'TÜBİTAK: İMECE', url: 'https://tubitak.gov.tr/tr/haber/imece-uzaya-basariyla-firlatildi' },
    nasaBsf: { ad: 'NASA Basics of Space Flight, Bölüm 4', url: 'https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/' },
    deltaV: { ad: 'Wikipedia: Delta-v budget', url: 'https://en.wikipedia.org/wiki/Delta-v_budget' },
    fSayisi: { ad: 'Wikipedia: F-number', url: 'https://en.wikipedia.org/wiki/F-number' },
    photographyLife: { ad: 'Photography Life: 500 rule vs NPF rule', url: 'https://photographylife.com/500-rule-vs-npf-rule' },
    googleGece: { ad: 'Google Research: Night Sight astrofotoğraf', url: 'https://research.google/blog/astrophotography-with-night-sight-on-pixel-phones/' },
    petapixel: { ad: 'PetaPixel: yığınlama ve gürültü', url: 'https://petapixel.com/2020/10/28/eli5-this-is-how-image-stacking-reduces-noise-and-recovers-signal' }
  };

  /* ================================================================ d20 ================================================================ */

  /* d20 · bölüm 0: Babil günlüklerinden Principia'ya ölçekli zaman çizelgesi (MÖ 700–MS 1700). Tarihler ders metninden. */
  C.ekle('d20-zaman-cizelgesi', {
    ders: 'd20', bolum: 0, oran: 1.15,
    baslik: 'Babil günlüklerinden Newton\'a: gökbilimin zaman çizelgesi',
    aciklama: 'Zaman yukarıdan aşağı akar ve eksen ölçeklidir: her çentik 300 yıl. Babil\'in astronomik günlükleri yaklaşık MÖ 652 ile 61 arasında altı yüzyıla yakın sürer. Aristarkhos, Eratosthenes ve Hipparkhos MÖ 3. ve 2. yüzyıldadır, Almagest yaklaşık MS 150\'de. İslam dünyasının gözlemcileri el-Battani\'den Uluğ Bey\'e ve İstanbul Rasathanesi\'ne uzanır. Kopernik\'ten Newton\'a kadarki büyük adımlar ise yalnızca 144 yıla, çizelgenin en altındaki dar bir dilime sığar; yazılar sığsın diye yana açıldı, ince çizgiler her olayın gerçek yerine gider.',
    kaynak: [KAYNAK.babil, KAYNAK.aristarkhos, KAYNAK.almagest, KAYNAK.battani, KAYNAK.ulugbey, KAYNAK.takiyuddin, KAYNAK.kopernik, KAYNAK.tycho, KAYNAK.kepler, KAYNAK.galileo, KAYNAK.newton],
    ciz(S) {
      const R = S.R, ax = 92, Y = yil => 40 + (yil + 700) / 2400 * 400;
      const renk = { mez: R.mavi, yun: R.vurgu, isl: R.iyi, avr: R.gezegen };
      let s = '';
      /* gösterge */
      [['Mezopotamya', renk.mez, 8], ['Yunan', renk.yun, 112], ['İslam dünyası', renk.isl, 176], ['Avrupa', renk.avr, 300]].forEach(([ad, r, x]) => {
        s += S.daire(x + 5, 13, 4.5, { dolgu: r, renk: 'none' }) + S.yazi(x + 14, 18, ad, { boy: 13, renk: R.metin });
      });
      s += S.cizgi(ax, Y(-700), ax, Y(1700), { renk: R.soluk, kalin: 2 });
      [[-600, 'MÖ 600'], [-300, 'MÖ 300'], [1, 'MS 1'], [300, '300'], [600, '600'], [900, '900'], [1200, '1200'], [1500, '1500']].forEach(([yil, t]) => {
        s += S.cizgi(ax - 5, Y(yil), ax, Y(yil), { renk: R.soluk, kalin: 1 }) + S.yazi(ax - 9, Y(yil) + 4, t, { boy: 13, hiza: 'end', renk: R.soluk });
      });
      /* olaylar: [başlangıç, bitiş, sütun, etiket y, yazı, kültür] */
      const olay = [
        [-652, -61, 0, 60, 'Babil günlükleri: MÖ 652–61', 'mez'],
        [-310, -230, 1, 92, 'Aristarkhos: ≈MÖ 310–230', 'yun'],
        [-276, -194, 2, 112, 'Eratosthenes: ≈MÖ 276–194', 'yun'],
        [-135, -135, 0, 134, 'Hipparkhos\'un kataloğu: ≈MÖ 135', 'yun'],
        [150, 150, 0, 178, 'Almagest: ≈MS 150', 'yun'],
        [877, 918, 0, 262, 'el-Battani, Rakka: 877–918', 'isl'],
        [973, 1048, 1, 288, 'el-Biruni: 973–1048', 'isl'],
        [1437, 1437, 0, 322, 'Uluğ Bey\'in zici: 1437', 'isl'],
        [1543, 1543, 0, 342, 'Kopernik, De revolutionibus: 1543', 'avr'],
        [1576, 1580, 0, 362, 'Tycho, Uraniborg: 1576–1580', 'avr'],
        [1577, 1580, 0, 382, 'İstanbul Rasathanesi: 1577–1580', 'isl'],
        [1609, 1609, 0, 402, 'Kepler\'in elips yasası: 1609', 'avr'],
        [1610, 1610, 0, 422, 'Galileo, Yıldız Habercisi: 1610', 'avr'],
        [1687, 1687, 0, 442, 'Newton, Principia: 1687', 'avr']
      ];
      const lx = 150;
      olay.forEach(([a, b, sut, ly, metin, k]) => {
        const r = renk[k], x = ax + sut * 9, ym = (Y(a) + Y(b)) / 2;
        s += S.yol(`M${x + 4},${ym} L${ax + 30},${ym} L${lx - 6},${ly - 4}`, { renk: r, kalin: 1 });
        if (Y(b) - Y(a) > 3) s += S.cizgi(x, Y(a), x, Y(b), { renk: r, kalin: 6, uc: 'round' });
        else s += S.daire(x, ym, 4, { dolgu: r, renk: R.zemin, kalin: 1.2 });
        s += S.yazi(lx, ly, metin, { boy: 13, renk: R.metin });
      });
      return s;
    }
  });

  /* d20 · bölüm 3: Eratosthenes'in geometrisi. 7,2° gerçek açıyla çizildi; Dünya'nın boyu ve çubuklar şematik. */
  C.ekle('d20-eratosthenes', {
    ders: 'd20', bolum: 3, oran: 0.98,
    baslik: 'Eratosthenes Dünya\'nın çevresini ölçüyor',
    aciklama: 'Güneş ışınları iki kente paralel gelir. Syene\'de öğle Güneşi tam tepededir, çubuk gölge yapmaz. Kuzeydeki İskenderiye\'de çubuğun gölgesi dikeyle 7,2 derecelik açı yapar. Paralel ışınları kesen doğru eşit açılar yaptığı için Dünya\'nın merkezinde iki kent arasındaki açı da 7,2 derecedir, yani çemberin ellide biri. İki kent arası 5000 stadion ise çevre 250.000 stadion eder; stadion 155 ile 185 metre arasında alınırsa bu yaklaşık 39.000 ile 46.000 kilometredir. Bugünkü kutup çevresi 40.008 kilometre. Açılar ölçeklidir; Dünya\'nın boyu ve çubuklar şematiktir.',
    kaynak: [KAYNAK.eratosthenes, KAYNAK.parisSozluk, KAYNAK.nasaDunya],
    ciz(S) {
      const R = S.R, cx = 196, cy = 384, Rd = 262, aci = 7.2, cub = 44;
      const P = (a, r) => [cx + r * Math.cos(a * rad), cy - r * Math.sin(a * rad)];
      let s = '';
      /* Dünya yayı ve merkez */
      s += S.yay(cx, cy, Rd, 62, 118, { renk: R.metin, kalin: 2 });
      s += S.daire(cx, cy, 4, { dolgu: R.metin, renk: 'none' });
      s += S.yazi(cx + 10, cy + 4, 'Dünya\'nın merkezi', { boy: 13, renk: R.soluk });
      /* Güneş ışınları: paralel, dikey */
      [74, 114, 256, 300].forEach(x => s += S.ok(x, 40, x, (cy - Math.sqrt(Rd * Rd - (x - cx) * (x - cx))) - 3, { renk: R.gunes, kalin: 1.4, boy: 7 }));
      s += S.yazi(8, 22, 'paralel Güneş ışınları', { boy: 13, renk: R.gunes });
      /* yarıçaplar */
      const sy = P(90, Rd), is = P(90 + aci, Rd);
      s += S.cizgi(cx, cy, sy[0], sy[1], { renk: R.soluk, kalin: 1, kesik: '4 4' });
      s += S.cizgi(cx, cy, is[0], is[1], { renk: R.soluk, kalin: 1, kesik: '4 4' });
      s += S.yay(cx, cy, 70, 90, 90 + aci, { renk: R.vurgu, kalin: 2 });
      s += S.cizgi(cx - 6, cy - 72, 150, cy - 88, { renk: R.vurgu, kalin: 1 });
      s += S.yazi(146, cy - 84, '7,2°', { boy: 15, hiza: 'end', renk: R.vurgu, kalin: true });
      s += S.yazi(146, cy - 66, 'merkezde', { boy: 13, hiza: 'end', renk: R.soluk });
      /* çubuklar */
      const sUc = P(90, Rd + cub), iUc = P(90 + aci, Rd + cub);
      /* çubuk uçlarına gelen ışınlar */
      s += S.ok(sUc[0], 40, sUc[0], sUc[1] - 3, { renk: R.gunes, kalin: 1.4, boy: 7 }) + S.cizgi(iUc[0], 40, iUc[0], iUc[1], { renk: R.gunes, kalin: 1.4 });
      s += S.cizgi(sy[0], sy[1], sUc[0], sUc[1], { renk: R.metin, kalin: 3.5 });
      s += S.cizgi(is[0], is[1], iUc[0], iUc[1], { renk: R.metin, kalin: 3.5 });
      /* İskenderiye'de gölge: çubuk ucundan geçen dikey ışın yere çarpar */
      const gx = iUc[0], gy = cy - Math.sqrt(Rd * Rd - (gx - cx) * (gx - cx));
      s += S.cizgi(gx, iUc[1], gx, gy, { renk: R.gunes, kalin: 1.6 });
      s += S.yol(`M${is[0]},${is[1]} L${gx},${gy}`, { renk: R.soluk, kalin: 4, uc: 'round' });
      /* çubuk ucundaki açı: dikey ile çubuk arası */
      s += S.yay(iUc[0], iUc[1], 24, 270, 270 + aci, { renk: R.vurgu, kalin: 2.4 });
      s += S.cizgi(iUc[0] - 2, iUc[1] + 30, 124, iUc[1] + 22, { renk: R.vurgu, kalin: 1 });
      s += S.zeminliYazi(122, iUc[1] + 27, '7,2°', { boy: 15, hiza: 'end', renk: R.vurgu, kalin: true });
      s += S.yazi(is[0] - 12, is[1] + 22, 'İskenderiye', { boy: 14, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(is[0] - 12, is[1] + 38, 'gölge var', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(sy[0] + 10, sy[1] + 22, 'Syene', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(sy[0] + 10, sy[1] + 38, 'gölge yok', { boy: 13, renk: R.soluk });
      s += S.zeminliYazi((sy[0] + is[0]) / 2, sy[1] + 66, '5000 stadion', { boy: 13, hiza: 'middle', renk: R.metin });
      /* hesap */
      const hx = 262;
      [['7,2° = 360°\'nin 1/50\'si', R.vurgu], ['çevre = 50 × 5000', R.metin], ['= 250.000 stadion', R.metin], ['stadion 155–185 m ise', R.soluk], ['≈39.000–46.000 km', R.metin], ['bugün: 40.008 km', R.iyi]].forEach(([t, r], i) => {
        s += S.yazi(hx, 190 + i * 20, t, { boy: 13, renk: r, kalin: i === 4 });
      });
      return s;
    }
  });

  /* d20 · bölüm 4: Aristarkhos'un dik üçgeni, 87° ile ölçekli; altta açının oranı nasıl değiştirdiği (1 / cos θ, hesap). */
  C.ekle('d20-aristarkhos', {
    ders: 'd20', bolum: 4, oran: 0.74,
    baslik: 'Aristarkhos\'un üçgeni: küçük açı farkı, büyük oran farkı',
    aciklama: 'Ay tam yarımken Dünya, Ay ve Güneş bir dik üçgen kurar; dik açı Ay\'dadır. Üstteki üçgen Aristarkhos\'un 87 derecelik açısıyla ölçekli çizildi: Güneş, Ay\'dan yaklaşık 19 kat uzak çıkar. Alttaki çubuklar logaritmik eksende aynı hesabı başka açılarla gösterir: 86 derece 14,3 kat, 88 derece 28,7 kat, gerçek açı olan 89,85 derece ise yaklaşık 382 kat verir. Dik açıya yakın küçük bir ölçüm hatası sonucu katlarca değiştirir.',
    kaynak: [KAYNAK.aristarkhos],
    ciz(S) {
      const R = S.R, th = 87, ea = 19.6;
      const E = [16, 96], es = ea / Math.cos(th * rad);           // Dünya–Güneş = Dünya–Ay / cos θ
      const M = [E[0] + ea * Math.cos(th * rad), E[1] - ea * Math.sin(th * rad)], G = [E[0] + es, E[1]];
      let s = '';
      s += S.yol(`M${E[0]},${E[1]} L${M[0]},${M[1]} L${G[0]},${G[1]} Z`, { renk: R.soluk, kalin: 1.4 });
      /* dik açı işareti Ay'da */
      const u = [(G[0] - M[0]) / Math.hypot(G[0] - M[0], G[1] - M[1]), (G[1] - M[1]) / Math.hypot(G[0] - M[0], G[1] - M[1])], v = [(E[0] - M[0]) / ea, (E[1] - M[1]) / ea];
      const k = 6;
      s += S.yol(`M${M[0] + u[0] * k},${M[1] + u[1] * k} L${M[0] + u[0] * k + v[0] * k},${M[1] + u[1] * k + v[1] * k} L${M[0] + v[0] * k},${M[1] + v[1] * k}`, { renk: R.metin, kalin: 1 });
      s += S.yay(E[0], E[1], 12, 0, th, { renk: R.vurgu, kalin: 1.6 });
      s += S.daire(E[0], E[1], 5, { dolgu: R.mavi, renk: 'none' }) + S.daire(M[0], M[1], 4, { dolgu: R.ay, renk: 'none' }) + S.daire(G[0], G[1], 9, { dolgu: R.gunes, renk: 'none' });
      s += S.yazi(E[0] - 4, E[1] + 20, 'Dünya', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(M[0] + 8, M[1] - 4, 'Ay (yarım)', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(G[0] + 6, G[1] + 26, 'Güneş', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(74, E[1] + 20, 'θ = 87° (Aristarkhos)', { boy: 13, renk: R.vurgu });
      s += S.cizgi(E[0] + 11, E[1] - 5, 70, E[1] + 14, { renk: R.vurgu, kalin: 1 });
      s += S.yazi(200, 30, 'Güneş / Ay uzaklığı = 1 / cos θ ≈ ' + tr(1 / Math.cos(th * rad), 1), { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(200, 48, 'üçgen ölçekli', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* alt: oranlar, log eksen */
      const x0 = 150, x1 = 380, X = v => x0 + (Math.log10(v) - 1) / 2 * (x1 - x0);
      s += S.yazi(8, 140, 'Güneş, Ay\'dan kaç kat uzak? (logaritmik)', { boy: 13, renk: R.soluk });
      [[86, '86°'], [87, '87° Aristarkhos'], [88, '88°'], [89.85, '89,85° gerçek']].forEach(([a, t], i) => {
        const y = 164 + i * 26, o = 1 / Math.cos(a * rad);
        s += S.yazi(x0 - 8, y + 5, t, { boy: 13, hiza: 'end', renk: R.metin, kalin: i === 1 || i === 3 });
        s += S.kutu(x0, y - 7, X(o) - x0, 14, { dolgu: i === 3 ? R.iyi : R.vurgu, renk: 'none', saydam: 0.85 }, 2);
        s += S.yazi(X(o) + 5, y + 5, tr(o, o < 100 ? 1 : 0), { boy: 13, renk: R.metin });
      });
      const ey = 266;
      s += S.cizgi(x0, ey, x1, ey, { renk: R.soluk, kalin: 1 });
      [[10, '10'], [100, '100'], [1000, '1000']].forEach(([v, t], i) => s += S.cizgi(X(v), ey, X(v), ey + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(v), ey + 19, t, { boy: 13, hiza: i === 2 ? 'end' : 'middle', renk: R.soluk }));
      return s;
    }
  });

  /* ================================================================ d21 ================================================================ */

  /* Güneş'in 2026'da IAU takımyıldızlarına girişi ve tropik burçlara girişi (Astronomy Engine, Türkiye saati; yılın günü, 0 = 1 Ocak).
     Takımyıldız: 20 Oca 06:00, 16 Şub 16:00, 12 Mar 18:00, 19 Nis 06:00, 14 May 18:00, 22 Haz 01:00, 21 Tem 06:00, 11 Ağu 05:00,
     17 Eyl 06:00, 31 Eki 18:00, 23 Kas 21:00, 30 Kas 09:00, 18 Ara 17:00. Burç (tutulum boylamı 30°'nin katı): 20 Oca, 18 Şub, 20 Mar,
     20 Nis, 21 May, 21 Haz, 22 Tem, 23 Ağu, 23 Eyl, 23 Eki, 22 Kas, 21 Ara. */
  const gunu = (ay, gun, saat) => (Date.UTC(2026, ay - 1, gun, saat || 0) - Date.UTC(2026, 0, 1)) / 864e5;
  const AYLAR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

  /* d21 · bölüm 5: tutulum boyunca Güneş: IAU takımyıldızları (13) ile eşit burç dilimleri (12) yan yana. */
  C.ekle('d21-tutulum-takvimi', {
    ders: 'd21', bolum: 5, oran: 1.12,
    baslik: '2026\'da Güneş\'in önünden geçtiği takımyıldızlar ve burç dilimleri',
    aciklama: 'Yıl yukarıdan aşağı akar. Soldaki sütun Güneş\'in IAU sınırlarına göre hangi takımyıldızın önünde olduğunu, sağdaki sütun astrolojinin eşit 30 derecelik burç dilimlerini gösterir; ikisi de uygulamanın hesap çekirdeğiyle 2026 için hesaplandı. Tutulum 13 takımyıldızdan geçer: Akrep\'e yalnızca yaklaşık 6,5 gün düşer, Başak\'a 44 gün, Yılancı\'ya 30 Kasım ile 18 Aralık arası. Burçlar yaklaşık bir ay önden gider: Koç burcu 20 Mart\'ta başlar, Güneş Koç takımyıldızına 19 Nisan\'da girer. Kesikli çizgi 28 Ekim: burç Akrep, Güneş\'in arkasındaki yıldızlar Başak\'ın.',
    kaynak: [KAYNAK.rob, KAYNAK.earthskyOph, KAYNAK.astronomyEngine],
    ciz(S) {
      const R = S.R, y0 = 46, k = 396 / 365, Y = g => y0 + g * k;
      const sol = [56, 186], sag = [252, 386];
      const tk = [[0, 'Yay'], [gunu(1, 20, 6), 'Oğlak'], [gunu(2, 16, 16), 'Kova'], [gunu(3, 12, 18), 'Balıklar'], [gunu(4, 19, 6), 'Koç'], [gunu(5, 14, 18), 'Boğa'],
        [gunu(6, 22, 1), 'İkizler'], [gunu(7, 21, 6), 'Yengeç'], [gunu(8, 11, 5), 'Aslan'], [gunu(9, 17, 6), 'Başak'], [gunu(10, 31, 18), 'Terazi'], [gunu(11, 23, 21), 'Akrep'],
        [gunu(11, 30, 9), 'Yılancı'], [gunu(12, 18, 17), 'Yay'], [365, '']];
      const bu = [[0, 'Oğlak'], [gunu(1, 20, 5), 'Kova'], [gunu(2, 18, 19), 'Balık'], [gunu(3, 20, 18), 'Koç'], [gunu(4, 20, 5), 'Boğa'], [gunu(5, 21, 4), 'İkizler'],
        [gunu(6, 21, 11), 'Yengeç'], [gunu(7, 22, 22), 'Aslan'], [gunu(8, 23, 5), 'Başak'], [gunu(9, 23, 3), 'Terazi'], [gunu(10, 23, 13), 'Akrep'], [gunu(11, 22, 10), 'Yay'],
        [gunu(12, 21, 24), 'Oğlak'], [365, '']];
      let s = '';
      s += S.yazi((sol[0] + sol[1]) / 2, 18, 'IAU takımyıldızı', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi((sol[0] + sol[1]) / 2, 34, '(Güneş\'in arkası)', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi((sag[0] + sag[1]) / 2, 18, 'Burç dilimi', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi((sag[0] + sag[1]) / 2, 34, '(eşit 30°)', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* ay çizgileri */
      AYLAR.forEach((a, i) => {
        const y = Y(gunu(i + 1, 1));
        s += S.cizgi(40, y, 392, y, { renk: R.cizgi, kalin: 0.8 });
        s += S.yazi(8, y + 14, a, { boy: 13, renk: R.soluk });
      });
      const sutun = (ls, [xa, xb], vurgu) => {
        let o = '';
        for (let i = 0; i < ls.length - 1; i++) {
          const [g0, ad] = ls[i], g1 = ls[i + 1][0], ya = Y(g0), yb = Y(g1);
          o += S.kutu(xa, ya, xb - xa, yb - ya, { dolgu: ad === vurgu ? R.vurguSoluk : (i % 2 ? R.yuzey2 : R.yuzey), renk: R.cizgi, kalin: 0.8 });
          if (yb - ya >= 15) o += S.yazi(xa + 7, (ya + yb) / 2 + 5, ad, { boy: 13, renk: ad === vurgu ? R.vurgu : R.metin, kalin: ad === vurgu });
        }
        return o;
      };
      s += sutun(tk, sol, 'Yılancı') + sutun(bu, sag);
      /* süreler */
      const sure = (g0, g1, t) => S.yazi(sol[1] - 6, (Y(g0) + Y(g1)) / 2 + 5, t, { boy: 13, hiza: 'end', renk: R.soluk });
      s += sure(gunu(9, 17, 6), gunu(10, 31, 18), '44 gün');
      s += sure(gunu(11, 30, 9), gunu(12, 18, 17), '18 gün');
      /* Akrep: dar dilim, yazı dışarıda */
      const ya = (Y(gunu(11, 23, 21)) + Y(gunu(11, 30, 9))) / 2;
      s += S.cizgi(sol[1], ya, sol[1] + 10, ya, { renk: R.metin, kalin: 1 });
      s += S.yazi(sol[1] + 13, ya + 5, 'Akrep', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(sol[1] + 13, ya + 21, '6,5 gün', { boy: 13, renk: R.soluk });
      /* Koç: burç ile takımyıldız başlangıcı arasındaki kayma */
      const k1 = Y(gunu(4, 19, 6)), k2 = Y(gunu(3, 20, 18));
      s += S.ok(sag[0], k2, sol[1] + 2, k1, { renk: R.vurgu, kalin: 1.5, boy: 7 });
      s += S.zeminliYazi(219, (k1 + k2) / 2 - 4, '≈1 ay', { boy: 13, hiza: 'middle', renk: R.vurgu });
      /* 28 Ekim */
      const y28 = Y(gunu(10, 28, 20));
      s += S.cizgi(sol[0], y28, sag[1], y28, { renk: R.vurgu, kalin: 1.4, kesik: '4 3' });
      s += S.zeminliYazi(219, y28 - 5, '28 Eki', { boy: 13, hiza: 'middle', renk: R.vurgu });
      return s;
    }
  });

  /* Kutup çevresi ve bahar haritaları için katalog konumları (veri/yildizlar.json, J2000: sağ açıklık °, dik açıklık °, kadir) */
  const YIL = {
    Dubhe: [165.932, 61.751, 1.81], Merak: [165.4603, 56.3824, 2.34], Phecda: [178.4577, 53.6948, 2.41], Megrez: [183.8565, 57.0326, 3.32],
    Alioth: [193.5073, 55.9598, 1.76], Mizar: [200.9814, 54.9254, 2.23], Alkaid: [206.8852, 49.3133, 1.85], Polaris: [37.9545, 89.2641, 1.97],
    Caph: [2.2945, 59.1498, 2.28], Schedar: [10.1268, 56.5373, 2.24], gCas: [14.1772, 60.7167, 2.15], Ruchbah: [21.454, 60.2353, 2.66], Segin: [28.5989, 63.6701, 3.35],
    Arcturus: [213.9153, 19.1824, -0.05], Spica: [201.2982, -11.1613, 0.98]
  };
  const KEPCE = ['Alkaid', 'Mizar', 'Alioth', 'Megrez', 'Dubhe', 'Merak', 'Phecda', 'Megrez'];
  const yildizR = m => Math.max(2.2, 6.2 - 1.3 * m);

  /* d21 · bölüm 8: göstergeç yıldızlardan Kutup Yıldızı'na ve Kraliçe'ye. Kutup merkezli stereografik izdüşüm; 15 Ekim 2026 saat 22.00'de
     İstanbul'dan kuzeye bakınca görünen dönüşle (yerel yıldız zamanı 338,28°, Astronomy Engine). Yukarısı başucu, aşağısı kuzey ufku. */
  C.ekle('d21-kutup-atlama', {
    ders: 'd21', bolum: 8, oran: 0.86,
    baslik: 'Göstergeç yıldızlardan Kutup Yıldızı\'na ve Kraliçe\'ye',
    aciklama: 'Gökyüzü 15 Ekim saat 22.00\'de İstanbul\'dan kuzeye bakarken göründüğü gibi döndürüldü: Büyük Kepçe aşağıda, ufka yakın; Kraliçe yukarıda. Kepçenin ağzındaki Merak\'tan Dubhe\'ye çizgi çek: aralık 5,4 derece. Bu aralığı yaklaşık beş kez uzatınca, 28,7 derece ötede, yaklaşık üç yumrukta Kutup Yıldızı\'na varırsın. Aynı yönde 32,8 derece daha gidince Kraliçe\'nin Schedar yıldızındasın. Açılar uygulamanın yıldız kataloğundan hesaplandı; izdüşüm kutup çevresinde açıları korur, kenarlarda boylar yüzde birkaç büyür.',
    kaynak: [KAYNAK.polaris, KAYNAK.wgsn, KAYNAK.astronomyEngine],
    ciz(S) {
      const R = S.R, cx = 196, cy = 150, k = 172, lst = 338.28;
      const P = n => {
        const [ra, de] = YIL[n], r = k * 2 * Math.tan((90 - de) / 2 * rad), H = (lst - ra) * rad;
        return [cx - r * Math.sin(H), cy - r * Math.cos(H)];
      };
      let s = '';
      /* yön okları */
      s += S.ok(14, 300, 14, 330, { renk: R.soluk, kalin: 1.2, boy: 7 }) + S.yazi(24, 326, 'kuzey ufkuna doğru', { boy: 13, renk: R.soluk });
      s += S.ok(14, 46, 14, 16, { renk: R.soluk, kalin: 1.2, boy: 7 }) + S.yazi(24, 30, 'başucuna doğru', { boy: 13, renk: R.soluk });
      /* çizgiler */
      s += S.egri(KEPCE.map(P), { renk: R.soluk, kalin: 1.4 });
      s += S.egri(['Caph', 'Schedar', 'gCas', 'Ruchbah', 'Segin'].map(P), { renk: R.soluk, kalin: 1.4 });
      const me = P('Merak'), du = P('Dubhe'), po = P('Polaris'), sc = P('Schedar');
      s += S.cizgi(me[0], me[1], du[0], du[1], { renk: R.vurgu, kalin: 3 });
      s += S.ok(du[0], du[1], po[0] + (du[0] - po[0]) * 0.06, po[1] + (du[1] - po[1]) * 0.06, { renk: R.vurgu, kalin: 1.6, kesik: '6 4', boy: 8 });
      s += S.ok(po[0], po[1], sc[0] + (po[0] - sc[0]) * 0.07, sc[1] + (po[1] - sc[1]) * 0.07, { renk: R.mavi, kalin: 1.6, kesik: '6 4', boy: 8 });
      Object.keys(YIL).filter(n => n !== 'Arcturus' && n !== 'Spica').forEach(n => { const p = P(n); s += S.daire(p[0], p[1], yildizR(YIL[n][2]), { dolgu: R.yildiz, renk: R.zemin, kalin: 1 }); });
      /* etiketler */
      s += S.yazi(po[0] + 10, po[1] - 8, 'Kutup Yıldızı', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(du[0] + 9, du[1] + 4, 'Dubhe', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(me[0] + 9, me[1] + 4, 'Merak', { boy: 13, renk: R.metin, kalin: true });
      const al = P('Alkaid'); s += S.yazi(al[0] - 8, al[1] + 18, 'Alkaid', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(sc[0] + 9, sc[1] + 14, 'Schedar', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(P('Segin')[0] - 20, P('Segin')[1] - 14, 'Kraliçe', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(120, 318, 'Büyük Kepçe', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* uzaklıklar */
      s += S.zeminliYazi((me[0] + du[0]) / 2 + 22, (me[1] + du[1]) / 2 + 14, '5,4°', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.zeminliYazi((du[0] + po[0]) / 2 - 10, (du[1] + po[1]) / 2 + 4, '28,7° ≈ 3 yumruk', { boy: 13, hiza: 'end', renk: R.vurgu });
      s += S.zeminliYazi((po[0] + sc[0]) / 2 + 12, (po[1] + sc[1]) / 2 + 12, '32,8°', { boy: 13, renk: R.mavi });
      /* ölçek: 10° (kutup yakınında) */
      const L = k * 2 * Math.tan(5 * rad);
      s += S.cizgi(312, 300, 312 + L, 300, { renk: R.metin, kalin: 2 }) + S.cizgi(312, 295, 312, 305, { renk: R.metin, kalin: 1 }) + S.cizgi(312 + L, 295, 312 + L, 305, { renk: R.metin, kalin: 1 });
      s += S.yazi(312 + L / 2, 322, '10° ≈ yumruk', { boy: 13, hiza: 'middle', renk: R.metin });
      return s;
    }
  });

  /* d21 · bölüm 10: "Kavisi izle Arcturus'a, kazık çak Spica'ya". Stereografik izdüşüm, merkez sağ açıklık 200°, dik açıklık +22°;
     kuzey yukarıda, doğu solda (gök haritası düzeni). Uzaklıklar ve kadirler katalogdan, doruk yükseklikleri ders metninden. */
  C.ekle('d21-arcturus-spica', {
    ders: 'd21', bolum: 10, oran: 0.97,
    baslik: 'Kavisi izle Arcturus\'a, kazık çak Spica\'ya',
    aciklama: 'Büyük Kepçe\'nin sapı hafifçe kıvrılır. Bu kavisi aynı yönde sürdürünce 30,7 derece ötede, üç yumruktan biraz fazla, turuncu Arcturus\'a varırsın. Aynı doğrultuda 32,8 derece daha gidince Başak\'ın Spica\'sındasın. Arcturus Spica\'dan yaklaşık 2,6 kat parlaktır ve İstanbul\'da doruğunda 68 derece yükselir; Spica yalnızca 37,8 derece. Harita gök haritası düzenindedir: kuzey yukarıda, doğu solda; gökte bu şekil saate göre döner. Açılar uygulamanın yıldız kataloğundan hesaplandı.',
    kaynak: [KAYNAK.arcturus, KAYNAK.wgsn],
    ciz(S) {
      const R = S.R, a0 = 200 * rad, d0 = 22 * rad, sk = 248, cx = 150, cy = 216;
      const P = n => {
        const a = YIL[n][0] * rad, d = YIL[n][1] * rad;
        const kk = 2 / (1 + Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(a - a0));
        return [cx - sk * kk * Math.cos(d) * Math.sin(a - a0), cy - sk * kk * (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(a - a0))];
      };
      let s = '';
      s += S.egri(KEPCE.map(P), { renk: R.soluk, kalin: 1.4 });
      /* kavis: sap (Alioth → Mizar → Alkaid) yönünü koruyarak Arcturus'a kıvrılan eğri */
      const al = P('Alioth'), mi = P('Mizar'), ak = P('Alkaid'), ar = P('Arcturus'), sp = P('Spica');
      const yon = [ak[0] - mi[0], ak[1] - mi[1]], uz = Math.hypot(yon[0], yon[1]);
      const kt = [ak[0] + yon[0] / uz * 70, ak[1] + yon[1] / uz * 70];
      s += S.yol(`M${ak[0]},${ak[1]} Q${kt[0]},${kt[1]} ${ar[0] + 4},${ar[1] - 8}`, { renk: R.vurgu, kalin: 2, kesik: '6 4' });
      s += S.ok(ar[0] + 1, ar[1] + 9, sp[0] - 0.5, sp[1] - 9, { renk: R.mavi, kalin: 2, kesik: '6 4', boy: 8 });
      Object.keys(YIL).filter(n => ['Dubhe', 'Merak', 'Phecda', 'Megrez', 'Alioth', 'Mizar', 'Alkaid', 'Arcturus', 'Spica'].includes(n)).forEach(n => {
        const p = P(n); s += S.daire(p[0], p[1], yildizR(YIL[n][2]), { dolgu: n === 'Arcturus' ? R.uyari : R.yildiz, renk: R.zemin, kalin: 1 });
      });
      s += S.yazi(P('Dubhe')[0] + 10, P('Dubhe')[1] + 5, 'Büyük Kepçe', { boy: 13, renk: R.soluk });
      s += S.yazi(ak[0] + 9, ak[1] + 4, 'Alkaid', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(al[0] - 10, al[1] - 10, 'sap', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(ar[0] - 12, ar[1] + 5, 'Arcturus', { boy: 14, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(ar[0] - 12, ar[1] + 21, '−0,05 kadir', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(sp[0] + 12, sp[1] + 5, 'Spica', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(sp[0] + 12, sp[1] + 21, '0,98 kadir', { boy: 13, renk: R.soluk });
      s += S.zeminliYazi(kt[0] + 8, (ak[1] + ar[1]) / 2 - 6, 'kavisi izle: 30,7°', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.zeminliYazi((ar[0] + sp[0]) / 2 + 12, (ar[1] + sp[1]) / 2 + 4, 'kazık çak: 32,8°', { boy: 13, renk: R.mavi, kalin: true });
      /* sağ: doruk yükseklikleri (İstanbul) */
      const hx = 268;
      s += S.yazi(hx, 286, 'İstanbul\'da doruk:', { boy: 13, renk: R.soluk });
      s += S.yazi(hx, 304, 'Arcturus 68°', { boy: 13, renk: R.metin });
      s += S.yazi(hx, 322, 'Spica 37,8°', { boy: 13, renk: R.metin });
      s += S.yazi(hx, 340, 'parlaklık oranı ≈2,6', { boy: 13, renk: R.metin });
      /* yön gülü */
      s += S.ok(370, 60, 370, 30, { renk: R.soluk, kalin: 1.2, boy: 6 }) + S.yazi(370, 22, 'K', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.ok(370, 60, 340, 60, { renk: R.soluk, kalin: 1.2, boy: 6 }) + S.yazi(332, 65, 'D', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d22 ================================================================ */

  /* d22 · bölüm 0: yıldız günü ile güneş günü. Şematik: Dünya'nın bir günde yörüngede aldığı yol (≈0,986°) çizimde büyütüldü. */
  C.ekle('d22-yildiz-gunes-gunu', {
    ders: 'd22', bolum: 0, oran: 0.78,
    baslik: 'Yıldız günü ile güneş günü arasındaki dört dakika',
    aciklama: 'Birinci gün öğlende Güneş ve çok uzak bir yıldız aynı yöndedir. Dünya kendi çevresinde bir tur atıp aynı yıldızı yeniden tam karşısına aldığında 23 saat 56 dakika 4 saniye geçmiştir; buna yıldız günü denir. Ama Dünya bu sürede yörüngesinde yaklaşık 1 derece, tam olarak 360 bölü 365,256, yani 0,986 derece ilerlemiştir; Güneş\'i yeniden meridyene getirmek için bu kadar daha dönmesi gerekir. Bu fazladan dönüş yaklaşık 3 dakika 56 saniye sürer ve güneş gününü ortalama 24 saate tamamlar. Yörüngedeki açı okunsun diye büyütüldü; çizim şematiktir.',
    kaynak: [KAYNAK.yildizZamani, KAYNAK.nasaDunya],
    ciz(S) {
      const R = S.R, gx = 120, gy = 180, ro = 130, b = 28;          // b: çizimde büyütülmüş günlük açı (derece)
      const E1 = [gx + ro, gy], E2 = [gx + ro * Math.cos(b * rad), gy - ro * Math.sin(b * rad)];
      const gunAci = 360 / 365.256, fark = gunAci * 4;              // derece, dakika (1° = 4 dk)
      let s = '';
      s += S.yay(gx, gy, ro, -40, 70, { renk: R.soluk, kalin: 1, kesik: '4 4' });
      s += S.daire(gx, gy, 18, { dolgu: R.gunes, renk: 'none' }) + S.yazi(gx, gy + 38, 'Güneş', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      { const p = [gx + ro * Math.cos(55 * rad), gy - ro * Math.sin(55 * rad)], q = [gx + ro * Math.cos(64 * rad), gy - ro * Math.sin(64 * rad)];
        s += S.ok(p[0], p[1], q[0], q[1], { renk: R.soluk, kalin: 1.4, boy: 7 }); }
      s += S.yazi(gx + ro * Math.cos(60 * rad) - 10, gy - ro * Math.sin(60 * rad) - 8, 'dolanma yönü', { boy: 13, hiza: 'end', renk: R.soluk });
      const dunya = (p, ad, alt) => S.daire(p[0], p[1], 13, { dolgu: R.mavi, renk: R.zemin, kalin: 1.5 }) + S.yazi(p[0] + 18, p[1] + (alt ? 22 : -14), ad, { boy: 13, renk: R.metin, kalin: true });
      /* 1. gün: Güneş ve uzak yıldız aynı yönde */
      s += S.ok(E1[0] - 15, E1[1], E1[0] - 48, E1[1], { renk: R.vurgu, kalin: 2.4, boy: 8 });
      s += dunya(E1, '1. gün öğle', true);
      /* 2. gün: yıldız günü sonunda ok yine aynı yönü (uzak yıldızı) gösterir; Güneş için biraz daha dönmek gerekir */
      s += S.ok(E2[0] - 15, E2[1], E2[0] - 50, E2[1], { renk: R.vurgu, kalin: 2.4, boy: 8 });
      const ug = Math.atan2(gy - E2[1], gx - E2[0]);
      s += S.ok(E2[0] + 15 * Math.cos(ug), E2[1] + 15 * Math.sin(ug), E2[0] + 50 * Math.cos(ug), E2[1] + 50 * Math.sin(ug), { renk: R.gunes, kalin: 2, boy: 8, kesik: '5 3' });
      s += dunya(E2, '1 gün sonra', false);
      s += S.yay(E2[0], E2[1], 40, 180, 180 + b, { renk: R.uyari, kalin: 2 });
      s += S.zeminliYazi(E2[0] - 50, E2[1] + 38, 'fazladan dönüş', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      s += S.yazi(E2[0] - 50, E2[1] + 56, '≈' + tr(gunAci, 3) + '° ≈ 3 dk 56 sn', { boy: 13, hiza: 'end', renk: R.uyari });
      /* uzak yıldız yönü */
      s += S.yazi(12, 24, '← uzak yıldızın yönü (iki ok paralel)', { boy: 13, renk: R.vurgu });
      /* özet */
      const ox = 236;
      s += S.yazi(ox, 248, 'yıldız günü: 23 sa 56 dk 4 sn', { boy: 13, renk: R.metin });
      s += S.yazi(ox, 266, '+ ' + tr(fark, 2) + ' dk fazladan dönüş', { boy: 13, renk: R.uyari });
      s += S.yazi(ox, 284, '= güneş günü ≈ 24 sa', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(12, 300, 'açı büyütüldü: şematik', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* Zaman denklemi 2026, 4 günde bir (gün 0, 4, …, 364): Greenwich'te 12:00 UT'de Güneş'in saat açısı × 60 (dakika; Astronomy Engine).
     Artı: güneş saati kol saatinden ileride. */
  const ZD = [-3.56, -5.39, -7.1, -8.67, -10.07, -11.29, -12.3, -13.09, -13.67, -14.02, -14.17, -14.12, -13.87, -13.44, -12.84, -12.09, -11.21, -10.22, -9.15, -8.02,
    -6.84, -5.64, -4.43, -3.24, -2.09, -1.01, -0.01, 0.9, 1.7, 2.38, 2.92, 3.33, 3.58, 3.68, 3.62, 3.41, 3.06, 2.59, 2.01, 1.32, 0.55, -0.29, -1.16, -2.03, -2.89,
    -3.7, -4.44, -5.11, -5.67, -6.11, -6.41, -6.55, -6.54, -6.36, -6.02, -5.53, -4.88, -4.09, -3.16, -2.11, -0.94, 0.32, 1.64, 3.02, 4.43, 5.85, 7.28, 8.67, 10.02,
    11.29, 12.46, 13.52, 14.44, 15.2, 15.8, 16.22, 16.43, 16.42, 16.18, 15.72, 15.04, 14.14, 13.03, 11.72, 10.22, 8.56, 6.77, 4.88, 2.92, 0.94, -1.03, -2.97];

  /* d22 · bölüm 1: zaman denklemi eğrisi (hesap) ve iki yaklaşık bileşeni (Wikipedia: −7,659 sin D ve 9,863 sin(2D + 3,5932)). */
  C.ekle('d22-zaman-denklemi', {
    ders: 'd22', bolum: 1, oran: 0.74,
    baslik: 'Zaman denklemi: güneş saati ile kol saati arasındaki fark',
    aciklama: 'Kalın eğri 2026 için hesaplandı: sıfırın üstünde güneş saati kol saatinden ileride, altında geridedir. En büyük fark 3 Kasım\'da yaklaşık artı 16 dakika 27 saniye, en derin çukur 11 Şubat\'ta eksi 14 dakika 11 saniye; aradaki küçük tepeler 13 Mayıs\'ta artı 3 dakika 41 saniye ve 26 Temmuz\'da eksi 6 dakika 34 saniye. Ders metnindeki 16 dakika 33 saniye ve 14 dakika 6 saniye, Wikipedia\'nın genel değerleridir; yıldan yıla birkaç saniye oynar. İnce kesikli eğriler iki yaklaşık bileşendir: yörünge basıklığından gelen yıllık dalga, yaklaşık 7,66 dakika, ve eksen eğikliğinden gelen yarım yıllık dalga, yaklaşık 9,87 dakika. Toplamları kalın eğriyi bir dakika içinde verir.',
    kaynak: [KAYNAK.zd, KAYNAK.astronomyEngine],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 54, y: 52, w: 330, h: 196 }, { x0: 0, x1: 365, y0: -17, y1: 18 }, {
        yIsaret: [[-15, '−15'], [-10, '−10'], [-5, '−5'], [0, '0'], [5, '+5'], [10, '+10'], [15, '+15']]
      });
      let s = ek.svg;
      s += S.yazi(8, 16, 'dakika: + güneş saati önde, − geride', { boy: 13, renk: R.soluk });
      [-15, -10, -5, 5, 10, 15].forEach(v => s += S.cizgi(54, ek.Y(v), 384, ek.Y(v), { renk: R.cizgi, kalin: 0.8 }));
      s += S.cizgi(54, ek.Y(0), 384, ek.Y(0), { renk: R.soluk, kalin: 1.2 });
      /* aylar */
      AYLAR.forEach((a, i) => { const x = ek.X(gunu(i + 1, 1)); s += S.cizgi(x, 248, x, 253, { renk: R.soluk, kalin: 1 }); if (i % 2 === 0) s += S.yazi(x, 268, a, { boy: 13, hiza: 'start', renk: R.soluk }); });
      /* bileşenler: D = 6,24004077 + 0,01720197 × (2000'den beri gün); 2026-01-01 = J2000 + 9497 gün */
      const D = g => 6.24004077 + 0.01720197 * (9497 + g);
      s += S.fonk(ek, g => -7.659 * Math.sin(D(g)), 0, 365, 120, { renk: R.mavi, kalin: 1.4, kesik: '5 4' });
      s += S.fonk(ek, g => 9.863 * Math.sin(2 * D(g) + 3.5932), 0, 365, 120, { renk: R.iyi, kalin: 1.4, kesik: '2 3' });
      s += S.egri(ZD.map((v, i) => [ek.X(i * 4), ek.Y(v)]), { renk: R.vurgu, kalin: 2.8 });
      /* uç noktalar */
      const nok = (g, v, t, dx, dy, hz) => S.daire(ek.X(g), ek.Y(v), 4.5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 }) + S.zeminliYazi(ek.X(g) + dx, ek.Y(v) + dy, t, { boy: 13, hiza: hz || 'middle', renk: R.metin });
      s += nok(gunu(11, 3), 16.45, '3 Kas +16:27', -8, -10, 'end');
      s += nok(gunu(2, 11), -14.18, '11 Şub −14:11', 8, 4, 'start');
      s += nok(gunu(5, 13), 3.68, '13 May +3:41', 0, -10);
      s += nok(gunu(7, 26), -6.56, '26 Tem −6:34', 0, 22);
      /* gösterge */
      const gx = 214;
      s += S.cizgi(gx, 34, gx + 22, 34, { renk: R.vurgu, kalin: 2.8 }) + S.yazi(gx + 28, 39, 'toplam (2026)', { boy: 13, renk: R.metin });
      s += S.cizgi(54, 34, 76, 34, { renk: R.mavi, kalin: 1.4, kesik: '5 4' }) + S.yazi(82, 39, 'basıklık ≈7,7', { boy: 13, renk: R.mavi });
      s += S.cizgi(214, 280, 236, 280, { renk: R.iyi, kalin: 1.4, kesik: '2 3' }) + S.yazi(242, 285, 'eğiklik ≈9,9', { boy: 13, renk: R.iyi });
      return s;
    }
  });

  /* Analemma: İstanbul (41,01° K, 28,955° D), 2026, yerel ortalama öğle (10:04:11 UT = 13:04 TRT), 5 günde bir.
     [doğu-batı açısı (°, batı +), yükseklik (°)]; Astronomy Engine, kırılmasız. */
  const ANALEMMA = [[-0.81, 26], [-1.34, 26.5], [-1.83, 27.19], [-2.27, 28.05], [-2.65, 29.08], [-2.96, 30.26], [-3.2, 31.58], [-3.35, 33.04], [-3.43, 34.61], [-3.43, 36.28],
    [-3.36, 38.05], [-3.21, 39.89], [-3, 41.78], [-2.74, 43.72], [-2.43, 45.69], [-2.08, 47.68], [-1.72, 49.67], [-1.34, 51.65], [-0.96, 53.6], [-0.6, 55.52], [-0.25, 57.38],
    [0.05, 59.19], [0.32, 60.92], [0.54, 62.57], [0.7, 64.12], [0.81, 65.57], [0.87, 66.91], [0.86, 68.13], [0.8, 69.21], [0.69, 70.14], [0.54, 70.93], [0.35, 71.56],
    [0.13, 72.02], [-0.11, 72.31], [-0.36, 72.42], [-0.61, 72.36], [-0.85, 72.13], [-1.06, 71.73], [-1.25, 71.16], [-1.4, 70.43], [-1.5, 69.56], [-1.55, 68.54], [-1.53, 67.4],
    [-1.46, 66.13], [-1.33, 64.75], [-1.14, 63.26], [-0.89, 61.67], [-0.59, 60], [-0.24, 58.26], [0.15, 56.45], [0.57, 54.59], [1.01, 52.68], [1.46, 50.75], [1.9, 48.79],
    [2.33, 46.83], [2.73, 44.87], [3.09, 42.94], [3.4, 41.03], [3.65, 39.18], [3.84, 37.39], [3.95, 35.67], [3.97, 34.05], [3.92, 32.53], [3.78, 31.12], [3.56, 29.85],
    [3.26, 28.73], [2.9, 27.76], [2.47, 26.96], [1.98, 26.33], [1.46, 25.88], [0.91, 25.62], [0.34, 25.55], [-0.23, 25.67], [-0.81, 26]];

  /* d22 · bölüm 2: analemma. Solda ölçekli (her iki eksende aynı derece), sağda yatay eksen 5 kat büyütülmüş. */
  C.ekle('d22-analemma', {
    ders: 'd22', bolum: 2, oran: 1.0,
    baslik: 'İstanbul\'un analemması: her gün saat 13.04\'te Güneş',
    aciklama: 'Her nokta, 2026\'da İstanbul\'da kol saati 13.04\'ü, yani yerel ortalama öğleyi gösterirken Güneş\'in güney gökteki yeridir; uygulamanın hesap çekirdeğiyle hesaplandı. Soldaki sekiz ölçeklidir: boyu Haziran\'daki 72,4 dereceden Aralık\'taki 25,5 dereceye yaklaşık 47 derece, eni ise yalnızca yaklaşık 7,4 derece. Sağdaki aynı sekizdir, yalnız yatayı 5 kat büyütüldü. Güneş saati öndeyken, örneğin 3 Kasım\'da, Güneş batıya, sağa kayar; gerideyken, 11 Şubat\'ta, doğuya, sola. Halkalar eşit değildir: üstteki küçük, alttaki büyük.',
    kaynak: [KAYNAK.analemma, KAYNAK.zd, KAYNAK.astronomyEngine],
    ciz(S) {
      const R = S.R, k = 5.6, Y = h => 30 + (76 - h) * k;
      let s = '';
      /* yükseklik ekseni */
      const ax = 50;
      s += S.cizgi(ax, Y(75), ax, Y(22), { renk: R.soluk, kalin: 1 });
      [30, 40, 50, 60, 70].forEach(h => { s += S.cizgi(ax - 5, Y(h), ax, Y(h), { renk: R.soluk, kalin: 1 }) + S.yazi(ax - 8, Y(h) + 4, h + '°', { boy: 13, hiza: 'end', renk: R.soluk }); s += S.cizgi(ax, Y(h), 392, Y(h), { renk: R.cizgi, kalin: 0.6 }); });
      s += S.yazi(8, 16, 'yükseklik', { boy: 13, renk: R.soluk });
      /* ölçekli sekiz */
      const x1 = 104, x2 = 270, B = 5;
      const egri = (xm, f) => S.egri(ANALEMMA.map(([x, h]) => [xm + x * k * f, Y(h)]), { renk: R.gunes, kalin: 2.2 });
      s += S.cizgi(x1, Y(74), x1, Y(23), { renk: R.soluk, kalin: 1, kesik: '2 4' }) + S.cizgi(x2, Y(74), x2, Y(23), { renk: R.soluk, kalin: 1, kesik: '2 4' });
      s += egri(x1, 1) + egri(x2, B);
      s += S.yazi(x1, 394, 'ölçekli', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(x2, 394, 'yatay 5 kat büyütüldü', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      /* ölçekli çizimin yanında 47° ok */
      s += S.ok(x1 + 30, Y(49), x1 + 30, Y(72.4) + 2, { renk: R.soluk, kalin: 1, boy: 6 }) + S.ok(x1 + 30, Y(49), x1 + 30, Y(25.5) - 2, { renk: R.soluk, kalin: 1, boy: 6 });
      s += S.zeminliYazi(x1 + 36, Y(49) + 5, '≈47°', { boy: 13, renk: R.soluk });
      /* büyütülmüşte tarihler */
      const nok = (x, h, t, dx, dy, hz) => S.daire(x2 + x * k * B, Y(h), 3.6, { dolgu: R.metin, renk: R.zemin, kalin: 1 }) + S.zeminliYazi(x2 + x * k * B + dx, Y(h) + dy, t, { boy: 13, hiza: hz, renk: R.metin });
      s += nok(-0.41, 72.42, '21 Haz 72,4°', 8, -6, 'start');
      s += nok(0.45, 25.55, '21 Ara 25,5°', 8, 18, 'start');
      s += nok(3.97, 33.73, '3 Kas', 8, 5, 'start');
      s += nok(-3.44, 34.94, '11 Şub', -8, 5, 'end');
      s += nok(-1.87, 48.88, '20 Mar', -8, 5, 'end');
      s += nok(1.9, 48.79, '23 Eyl', 8, 5, 'start');
      /* yönler */
      s += S.yazi(x2 - 70, 54, '← doğu', { boy: 13, hiza: 'middle', renk: R.soluk }) + S.yazi(x2 + 70, 54, 'batı →', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(x2, 372, 'güneye bakarken', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d23 ================================================================ */

  /* d23 · bölüm 1: Tsiolkovsky; yakıt payı = 1 − e^(−Δv / v_e). v_e = 4,5 km/s (Wikipedia örneği) ve 3 km/s (dersteki varsayım). */
  C.ekle('d23-roket-denklemi', {
    ders: 'd23', bolum: 1, oran: 0.72,
    baslik: 'Roket denklemi: istenen hız arttıkça yakıt payı',
    aciklama: 'Eğriler Tsiolkovsky denkleminden hesaplandı: dikey eksen kalkış kütlesinin yüzde kaçının yakıt olması gerektiğini gösterir. Egzoz hızı saniyede 4,5 kilometre olan tek aşamalı bir roket alçak yörünge için saniyede 9,7 kilometrelik delta-v isterse kalkış kütlesinin yüzde 88,4\'ü yakıt olmalıdır. Egzoz hızı yalnızca 3 kilometre olsaydı, 9,4 kilometre için yakıt payı yüzde 95,6\'ya çıkardı. Eğriler yüzde 100\'e yaklaştıkça yassılaşır: biraz daha hız, orantısız biçimde çok daha fazla yakıt demektir.',
    kaynak: [KAYNAK.tsiolkovsky],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 56, y: 30, w: 320, h: 190 }, { x0: 0, x1: 12, y0: 0, y1: 100 }, {
        xIsaret: [[0, '0'], [3, '3'], [6, '6'], [9, '9'], [12, '12']],
        yIsaret: [[0, '%0'], [25, '%25'], [50, '%50'], [75, '%75'], [100, '%100']],
        xAd: 'istenen delta-v (km/s)'
      });
      let s = ek.svg;
      [25, 50, 75, 100].forEach(v => s += S.cizgi(56, ek.Y(v), 376, ek.Y(v), { renk: R.cizgi, kalin: 0.8 }));
      s += S.yazi(8, 16, 'kalkış kütlesinde yakıt payı', { boy: 13, renk: R.soluk });
      const pay = (dv, ve) => 100 * (1 - Math.exp(-dv / ve));
      s += S.fonk(ek, d => pay(d, 4.5), 0, 12, 80, { renk: R.vurgu, kalin: 2.6 });
      s += S.fonk(ek, d => pay(d, 3), 0, 12, 80, { renk: R.mavi, kalin: 2.2, kesik: '7 4' });
      const n1 = pay(9.7, 4.5), n2 = pay(9.4, 3);
      s += S.cizgi(ek.X(9.7), ek.Y(0), ek.X(9.7), ek.Y(n1), { renk: R.vurgu, kalin: 1, kesik: '2 3' });
      s += S.daire(ek.X(9.7), ek.Y(n1), 5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 }) + S.daire(ek.X(9.4), ek.Y(n2), 5, { dolgu: R.mavi, renk: R.zemin, kalin: 1.2 });
      s += S.zeminliYazi(ek.X(9.7) + 4, ek.Y(n1) + 28, '9,7 km/s → %' + tr(n1, 1), { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.zeminliYazi(ek.X(9.4) - 8, ek.Y(n2) - 8, '9,4 km/s → %' + tr(n2, 1), { boy: 13, hiza: 'end', renk: R.metin });
      /* gösterge */
      s += S.cizgi(150, 160, 174, 160, { renk: R.vurgu, kalin: 2.6 }) + S.yazi(180, 165, 'egzoz hızı 4,5 km/s', { boy: 13, renk: R.metin });
      s += S.cizgi(150, 182, 174, 182, { renk: R.mavi, kalin: 2.2, kesik: '7 4' }) + S.yazi(180, 187, 'egzoz hızı 3 km/s', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* d23 · bölüm 4: yörünge haritası. Üstte ölçekli yarım kesit (Dünya 6371 km, LEO < 2000 km, GEO 35.786 km); altta LEO büyütülmüş. */
  C.ekle('d23-yorunge-haritasi', {
    ders: 'd23', bolum: 4, oran: 0.98,
    baslik: 'Yörünge haritası: alçak, orta ve yerdurgun',
    aciklama: 'Üstteki yarım kesit ölçeklidir: Dünya\'nın 6371 kilometrelik yarıçapına göre alçak yörünge kuşağı, 2000 kilometrenin altı, yüzeye yapışık ince bir halkadır; yerdurgun yörünge ise 35.786 kilometre yukarıda, Dünya yarıçapının yaklaşık 5,6 katı ötededir. Aradaki geniş bölge orta yörüngedir. Alttaki şerit alçak yörüngeyi büyütür: uydular genellikle 180 kilometrenin altına inmez; Tiangong yaklaşık 382 ile 386, Uluslararası Uzay İstasyonu 415 ile 424, Hubble 468 ile 471 kilometrede; güneş eşzamanlı yörüngeler 600 ile 800 kilometrede, İMECE 680 kilometrede. Hız 400 kilometrede saniyede yaklaşık 7,7, yerdurgun yörüngede yaklaşık 3,1 kilometredir.',
    kaynak: [KAYNAK.esaYorunge, KAYNAK.heavensAbove, KAYNAK.sso, KAYNAK.imece, KAYNAK.nasaDunya],
    ciz(S) {
      const R = S.R, GM = 398600, Rd = 6371, cx = 200, cy = 236, k = 186 / (Rd + 35786);
      const r = h => (Rd + h) * k, v = h => Math.sqrt(GM / (Rd + h));
      let s = '';
      /* MEO bölgesi, LEO halkası, GEO çemberi */
      const halka = (r1, r2, o) => S.yol(`M${cx - r2},${cy} A${r2},${r2} 0 0 1 ${cx + r2},${cy} L${cx + r1},${cy} A${r1},${r1} 0 0 0 ${cx - r1},${cy} Z`, o);
      s += halka(r(2000), r(35786), { dolgu: R.yuzey2, renk: 'none' });
      s += halka(r(180), r(2000), { dolgu: R.vurgu, renk: 'none', saydam: 0.85 });
      s += S.yay(cx, cy, r(35786), 0, 180, { renk: R.mavi, kalin: 2.4 });
      s += S.yol(`M${cx - Rd * k},${cy} A${Rd * k},${Rd * k} 0 0 1 ${cx + Rd * k},${cy} Z`, { dolgu: R.mavi, renk: 'none', saydam: 0.85 });
      s += S.cizgi(8, cy, 392, cy, { renk: R.soluk, kalin: 1 });
      s += S.yazi(cx, cy - 6, 'Dünya', { boy: 13, hiza: 'middle', renk: R.zemin, kalin: true });
      s += S.zeminliYazi(cx, cy - r(35786) - 8, 'Yerdurgun (GEO): 35.786 km, ' + tr(v(35786), 2) + ' km/s, 1 yıldız günü', { boy: 13, hiza: 'middle', renk: R.mavi, kalin: true });
      s += S.zeminliYazi(cx, cy - 110, 'Orta yörünge (MEO)', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true, zemin: R.yuzey2 });
      s += S.zeminliYazi(cx, cy - 92, 'Galileo seyrüsefer uyduları', { boy: 13, hiza: 'middle', renk: R.soluk, zemin: R.yuzey2 });
      const p = [cx + r(1000) * Math.cos(35 * rad), cy - r(1000) * Math.sin(35 * rad)];
      s += S.cizgi(p[0], p[1], 268, cy - 50, { renk: R.vurgu, kalin: 1 });
      s += S.zeminliYazi(272, cy - 46, 'Alçak (LEO) < 2000 km', { boy: 13, renk: R.vurgu, kalin: true, zemin: R.yuzey2 });
      s += S.yazi(8, cy + 18, 'üstte ölçekli kesit', { boy: 13, renk: R.soluk });
      /* alt: LEO büyütmesi 0–2000 km */
      const x0 = 30, x1 = 376, X = h => x0 + h / 2000 * (x1 - x0), sy = 316;
      s += S.yazi(8, cy + 40, 'alçak yörünge büyütüldü (km)', { boy: 13, renk: R.metin, kalin: true });
      s += S.kutu(X(0), sy - 10, X(180) - X(0), 20, { dolgu: R.yuzey2, renk: 'none' });
      s += S.kutu(X(600), sy - 10, X(800) - X(600), 20, { dolgu: R.iyi, renk: 'none', saydam: 0.4 });
      s += S.cizgi(x0, sy, x1, sy, { renk: R.soluk, kalin: 1.2 });
      [0, 500, 1000, 1500, 2000].forEach((h, i) => s += S.cizgi(X(h), sy + 10, X(h), sy + 15, { renk: R.soluk, kalin: 1 }) + S.yazi(X(h), sy + 30, tr(h), { boy: 13, hiza: i === 0 ? 'start' : i === 4 ? 'end' : 'middle', renk: R.soluk }));
      const cubuk = (a, b, renk) => S.kutu(X(a), sy - 6, Math.max(2.5, X(b) - X(a)), 12, { dolgu: renk, renk: 'none' });
      s += cubuk(382, 386, R.uyari) + cubuk(415, 424, R.vurgu) + cubuk(468, 471, R.mavi) + S.cizgi(X(680), sy - 10, X(680), sy + 10, { renk: R.metin, kalin: 2.4 });
      const et = (h, ly, t, renk, hz) => S.cizgi(X(h), sy - 10, X(h) + (hz === 'end' ? -6 : 6), ly + 4, { renk: R.soluk, kalin: 1 }) + S.yazi(X(h) + (hz === 'end' ? -8 : 8), ly, t, { boy: 13, hiza: hz || 'start', renk });
      s += et(384, sy - 46, 'Tiangong', R.uyari, 'end');
      s += et(420, sy - 28, 'ISS', R.vurgu, 'end');
      s += et(470, sy - 46, 'Hubble', R.mavi);
      s += et(680, sy - 28, 'İMECE 680', R.metin);
      s += S.yazi(X(700), sy + 48, 'güneş eşzamanlı 600–800', { boy: 13, hiza: 'middle', renk: R.iyi });
      s += S.yazi(X(90), sy + 48, 'sürtünme', { boy: 13, hiza: 'start', renk: R.soluk });
      s += S.yazi(x1, sy - 28, '400 km: ' + tr(v(400), 2) + ' km/s', { boy: 13, hiza: 'end', renk: R.metin });
      return s;
    }
  });

  /* d23 · bölüm 7: Dünya → Mars Hohmann aktarımı. Yörüngeler dairesel ve ölçekli (1 AB ve 227,956 / 149,598 AB); süre ve Mars'ın
     kalkıştaki önde oluşu Kepler III ve NASA dönemleriyle (365,256 ve 686,980 gün) hesaplandı. */
  C.ekle('d23-hohmann', {
    ders: 'd23', bolum: 7, oran: 0.96,
    baslik: 'Hohmann aktarımı: Dünya\'dan Mars\'a en ucuz yol',
    aciklama: 'Yörüngeler dairesel varsayılarak ölçekli çizildi. Araç, Dünya\'nın dolanma yönünde hızlanarak günberisi Dünya\'nın, günötesi Mars\'ın yörüngesinde olan elipse girer ve elipsin yarısını dolanır: Kepler\'in üçüncü yasasıyla yaklaşık 259 gün. Mars o sürede yörüngesinde yaklaşık 136 derece ilerlediği için kalkış anında Dünya\'dan yaklaşık 44 derece önde olmalıdır; bu diziliş yaklaşık 26 ayda bir gelir. Delta-v bedelleri ders metninden: alçak Dünya yörüngesinden aktarıma yaklaşık 4,3, Mars\'ta yakalanmaya yaklaşık 0,9 kilometre bölü saniye.',
    kaynak: [KAYNAK.nasaBsf, KAYNAK.nasaMars, KAYNAK.nasaDunya, KAYNAK.deltaV],
    ciz(S) {
      const R = S.R, gx = 214, gy = 168, au = 96;
      const rM = 227.956 / 149.598, a = (1 + rM) / 2, c = a - 1, b = Math.sqrt(rM);
      const gun = 0.5 * Math.pow(a, 1.5) * 365.256, oncu = 180 - gun / 686.980 * 360, dunyaVaris = gun / 365.256 * 360;
      const P = (aci, r) => [gx + r * au * Math.cos(aci * rad), gy - r * au * Math.sin(aci * rad)];
      let s = '';
      s += S.daire(gx, gy, 1 * au, { renk: R.mavi, kalin: 1.4 });
      s += S.daire(gx, gy, rM * au, { renk: R.uyari, kalin: 1.4 });
      /* aktarım elipsi: üst yarı dolu (yol), alt yarı soluk */
      const ecx = gx - c * au;
      s += S.yol(`M${gx + au},${gy} A${a * au},${b * au} 0 0 0 ${gx - rM * au},${gy}`, { renk: R.vurgu, kalin: 2.8 });
      s += S.yol(`M${gx - rM * au},${gy} A${a * au},${b * au} 0 0 0 ${gx + au},${gy}`, { renk: R.vurgu, kalin: 1, kesik: '3 5', saydam: 0.6 });
      s += S.ok(ecx + a * au * Math.cos(100 * rad), gy - b * au * Math.sin(100 * rad), ecx + a * au * Math.cos(104 * rad), gy - b * au * Math.sin(104 * rad), { renk: R.vurgu, kalin: 2.8, boy: 9 });
      s += S.daire(gx, gy, 9, { dolgu: R.gunes, renk: 'none' }) + S.yazi(gx + 13, gy + 5, 'Güneş', { boy: 13, renk: R.metin });
      /* cisimler */
      const d0 = P(0, 1), m0 = P(oncu, rM), m1 = P(180, rM), d1 = P(dunyaVaris, 1);
      s += S.cizgi(gx, gy, m0[0], m0[1], { renk: R.uyari, kalin: 1, kesik: '2 3' });
      s += S.yay(gx, gy, 40, 0, oncu, { renk: R.uyari, kalin: 1.6 });
      s += S.zeminliYazi(gx + 46, gy - 14, tr(oncu, 0) + '°', { boy: 13, renk: R.uyari, kalin: true });
      s += S.daire(d0[0], d0[1], 6.5, { dolgu: R.mavi, renk: R.zemin, kalin: 1.5 }) + S.daire(m0[0], m0[1], 5.5, { dolgu: R.uyari, renk: R.zemin, kalin: 1.5 });
      s += S.daire(m1[0], m1[1], 5.5, { dolgu: R.uyari, renk: R.zemin, kalin: 1.5 }) + S.daire(d1[0], d1[1], 6.5, { dolgu: 'none', renk: R.mavi, kalin: 1.6 });
      s += S.yazi(d0[0] + 10, d0[1] + 20, 'kalkış: Dünya', { boy: 13, renk: R.mavi, kalin: true });
      s += S.yazi(d0[0] + 10, d0[1] + 36, '≈4,3 km/s', { boy: 13, renk: R.metin });
      s += S.yazi(m0[0] + 10, m0[1] - 6, 'Mars, kalkışta', { boy: 13, renk: R.uyari, kalin: true });
      s += S.yazi(m1[0] + 10, m1[1] + 22, 'varış', { boy: 13, renk: R.uyari, kalin: true });
      s += S.yazi(m1[0] + 10, m1[1] + 38, '≈0,9 km/s', { boy: 13, renk: R.metin });
      s += S.yazi(d1[0] + 12, d1[1] + 16, 'Dünya, varışta', { boy: 13, renk: R.mavi });
      s += S.zeminliYazi(gx - 40, gy - b * au - 8, 'yolculuk ≈' + tr(gun, 0) + ' gün', { boy: 14, hiza: 'middle', renk: R.vurgu, kalin: true });
      /* gösterge */
      s += S.yazi(8, 352, 'Dünya yörüngesi 1 AB', { boy: 13, renk: R.mavi });
      s += S.yazi(8, 370, 'Mars yörüngesi ' + tr(rM, 3) + ' AB', { boy: 13, renk: R.uyari });
      s += S.yazi(392, 352, 'dairesel yörüngeler,', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(392, 370, 'ölçekli', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d24 ================================================================ */

  /* d24 · bölüm 1: üç ayar, aynı para birimi: durak. Diyafram tam durakları (ders), enstantane ve ISO iki katlık adımlar. */
  C.ekle('d24-durak', {
    ders: 'd24', bolum: 1, oran: 0.74,
    baslik: 'Diyafram, enstantane ve ISO: her adım bir durak',
    aciklama: 'Üç sıra aynı ölçekle dizildi: her sütun bir durak, yani ışığın iki katı ya da yarısı. Diyaframda f sayısı sağa doğru yaklaşık kök iki kat büyür ve ışık her adımda yarıya iner. Enstantanede süre sağa doğru iki katına çıkar, ışık da. ISO\'da duyarlılık iki katına çıkar ve görüntü parlaklaşır, ama gürültü de görünür olur. Vurgulu kutular dersteki örnektir: f/8 ile 250\'de 1 saniye, f/11 ile 125\'te 1 saniyeye eşdeğerdir, çünkü diyaframda bir durak kaybedilen ışık sürede bir durak geri kazanılır. Enstantane değerleri fotoğrafçılıktaki yuvarlak değerlerdir.',
    kaynak: [KAYNAK.fSayisi],
    ciz(S) {
      const R = S.R, x0 = 104, w = 41;
      const sira = [
        ['Diyafram', ['f/2', 'f/2,8', 'f/4', 'f/5,6', 'f/8', 'f/11', 'f/16'], 'daha az ışık →', 4, 5],
        ['Enstantane', ['1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15'], 'daha çok ışık →', 2, 3],
        ['ISO', ['100', '200', '400', '800', '1600', '3200', '6400'], 'daha parlak, daha çok gürültü →', -1, -1]
      ];
      let s = '';
      sira.forEach(([ad, ls, yon, e1, e2], i) => {
        const y = 52 + i * 70;
        s += S.yazi(8, y + 22, ad, { boy: 14, renk: R.metin, kalin: true });
        s += S.yazi(x0, y - 8, yon, { boy: 13, renk: R.soluk });
        ls.forEach((t, j) => {
          const x = x0 + j * w, vur = j === e1 || j === e2;
          s += S.kutu(x, y, w - 3, 30, { dolgu: vur ? R.vurguSoluk : R.yuzey2, renk: vur ? R.vurgu : 'none', kalin: 1.6 }, 3);
          s += S.yazi(x + (w - 3) / 2, y + 20, t, { boy: 13, hiza: 'middle', renk: vur ? R.vurgu : R.metin, kalin: vur });
        });
      });
      /* eşdeğerlik okları: f/8 → f/11 (−1 durak), 1/250 → 1/125 (+1 durak) */
      const cx = j => x0 + j * w + (w - 3) / 2;
      s += S.ok(cx(4), 88, cx(5) - 6, 88, { renk: R.vurgu, kalin: 1.6, boy: 6 }) + S.ok(cx(2), 158, cx(3) - 6, 158, { renk: R.vurgu, kalin: 1.6, boy: 6 });
      s += S.yazi(8, 270, 'f/8 + 1/250 sn = f/11 + 1/125 sn', { boy: 14, renk: R.vurgu, kalin: true });
      s += S.yazi(8, 290, 'ISO 100 → 400: 2 durak, süre 4\'e bölünebilir', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* d24 · bölüm 7: sabit üçayakta yıldızın kayması (piksel) = t × 15,04 × cos δ / 74,4 (dersin varsayımlı telefonu: 24 mm, 4000 piksel). */
  C.ekle('d24-yildiz-kaymasi', {
    ders: 'd24', bolum: 7, oran: 0.76,
    baslik: 'Poz süresi uzadıkça yıldızın kayması',
    aciklama: 'Doğrular dersin varsayımlı telefonu için hesaplandı: 24 milimetre eşdeğer odak ve 4000 piksel genişlik, yani piksel başına yaklaşık 74,4 yay saniyesi. Gök ekvatorundaki yıldız saniyede 15,04 yay saniyesi kayar ve bir pikseli yaklaşık 4,9 saniyede geçer; dik açıklığı 41 derece olan yıldız 6,6, kutba 10 derece uzaklıktaki yıldız yaklaşık 28 saniyede. 500 kuralının 20,8 saniyesi ekvatora bakarken yaklaşık 4,2 piksellik bir çizgi bırakır; Google\'ın gece modundaki 16 saniyelik kare sınırı yaklaşık 3,2 piksele denk gelir.',
    kaynak: [KAYNAK.photographyLife, KAYNAK.googleGece, KAYNAK.nasaDunya],
    ciz(S) {
      const R = S.R, ps = 74.4, hz = 15.04;
      const ek = S.eksen({ x: 50, y: 36, w: 330, h: 190 }, { x0: 0, x1: 30, y0: 0, y1: 7 }, {
        xIsaret: [[0, '0'], [5, '5'], [10, '10'], [15, '15'], [20, '20'], [25, '25'], [30, '30']],
        yIsaret: [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [7, '7']],
        xAd: 'poz süresi (saniye)'
      });
      let s = ek.svg + S.yazi(8, 18, 'kayma (piksel)', { boy: 13, renk: R.soluk });
      [1, 3].forEach(v => s += S.cizgi(50, ek.Y(v), 380, ek.Y(v), { renk: R.cizgi, kalin: 1, kesik: '3 4' }));
      const kay = (t, d) => t * hz * Math.cos(d * rad) / ps;
      [[0, R.vurgu, null, 'ekvator, δ = 0°'], [41, R.mavi, '7 4', 'δ = 41°'], [80, R.iyi, '2 3', 'δ = 80°']].forEach(([d, r, k, t]) => {
        s += S.fonk(ek, x => kay(x, d), 0, 30, 2, { renk: r, kalin: 2.4, kesik: k });
        s += S.zeminliYazi(ek.X(30) - 2, ek.Y(kay(30, d)) - 8, t, { boy: 13, hiza: 'end', renk: r, kalin: true });
      });
      /* 500 kuralı ve gece modu */
      const t5 = 500 / 24;
      [[t5, '500 kuralı: ' + tr(t5, 1) + ' sn → ' + tr(kay(t5, 0), 1) + ' px', 52], [16, 'gece modu 16 sn → ' + tr(kay(16, 0), 1) + ' px', 72]].forEach(([t, metin, ly]) => {
        s += S.cizgi(ek.X(t), ek.Y(0), ek.X(t), ek.Y(kay(t, 0)), { renk: R.soluk, kalin: 1, kesik: '2 3' });
        s += S.daire(ek.X(t), ek.Y(kay(t, 0)), 4.5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 });
        s += S.zeminliYazi(62, ly, metin, { boy: 13, renk: R.metin });
      });
      s += S.zeminliYazi(ek.X(30) - 2, ek.Y(1) + 16, 'k = 1 piksel', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d24 · bölüm 10: yığınlama; sinyal-gürültü oranı √N kat artar. Tek kare değerleri dersin uydurma örneğinden:
     karanlık gök 400 / √800 ≈ 14,1; kent göğü 400 / √4000 ≈ 6,3. Log-log eksen. */
  C.ekle('d24-yiginlama', {
    ders: 'd24', bolum: 10, oran: 0.76,
    baslik: 'Yığınlama: kare sayısı arttıkça görüntü temizlenir',
    aciklama: 'İki eksen de logaritmiktir, bu yüzden karekök ilişkisi düz bir çizgi olur: kare sayısı 9 katına çıkınca sinyal-gürültü oranı 3 katına, 100 katına çıkınca 10 katına çıkar. Başlangıç değerleri dersteki uydurma örnekten: aynı sönük yıldızın tek karesi karanlık gökte yaklaşık 14,1, kent göğünde yaklaşık 6,3 oran verir. Kentte karanlık göğün tek karesine yetişmek için yaklaşık 5 kare, 16 kareyle yaklaşık 25\'lik orana ulaşılır.',
    kaynak: [KAYNAK.petapixel, KAYNAK.googleGece],
    ciz(S) {
      const R = S.R, kar = 400 / Math.sqrt(800), ken = 400 / Math.sqrt(4000);
      const ek = S.eksen({ x: 56, y: 30, w: 320, h: 196 }, { x0: 1, x1: 100, y0: 4, y1: 200 }, {
        logX: true, logY: true,
        xIsaret: [[1, '1'], [5, '5'], [10, '10'], [16, '16'], [50, '50'], [100, '100']],
        yIsaret: [[5, '5'], [10, '10'], [20, '20'], [50, '50'], [100, '100'], [200, '200']],
        xAd: 'yığındaki kare sayısı'
      });
      let s = ek.svg + S.yazi(8, 16, 'sinyal-gürültü oranı', { boy: 13, renk: R.soluk });
      [10, 20, 50, 100].forEach(v => s += S.cizgi(56, ek.Y(v), 376, ek.Y(v), { renk: R.cizgi, kalin: 0.8 }));
      s += S.fonk(ek, n => kar * Math.sqrt(n), 1, 100, 30, { renk: R.mavi, kalin: 2.4 }, true);
      s += S.fonk(ek, n => ken * Math.sqrt(n), 1, 100, 30, { renk: R.vurgu, kalin: 2.4, kesik: '7 4' }, true);
      /* kentte 5 kare = karanlıkta 1 kare */
      const n5 = Math.pow(kar / ken, 2);
      s += S.cizgi(ek.X(1), ek.Y(kar), ek.X(n5), ek.Y(kar), { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.cizgi(ek.X(n5), ek.Y(kar), ek.X(n5), ek.Y(4), { renk: R.soluk, kalin: 1, kesik: '2 3' });
      const nk = (x, y, r) => S.daire(ek.X(x), ek.Y(y), 4.5, { dolgu: r, renk: R.zemin, kalin: 1.2 });
      s += nk(1, kar, R.mavi) + nk(1, ken, R.vurgu) + nk(n5, kar, R.vurgu) + nk(16, ken * 4, R.vurgu);
      s += S.zeminliYazi(ek.X(1) + 8, ek.Y(kar) - 10, 'karanlık gök, 1 kare: ' + tr(kar, 1), { boy: 13, renk: R.mavi });
      s += S.zeminliYazi(ek.X(1) + 8, ek.Y(ken) + 20, 'kent, 1 kare: ' + tr(ken, 1), { boy: 13, renk: R.vurgu });
      s += S.zeminliYazi(ek.X(n5) + 8, ek.Y(kar) + 20, 'kentte ' + tr(n5, 0) + ' kare', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(ek.X(16) + 8, ek.Y(ken * 4) + 18, '16 kare: ' + tr(ken * 4, 0), { boy: 13, renk: R.metin });
      s += S.zeminliYazi(370, ek.Y(kar * 10) - 10, 'karanlık gök', { boy: 13, hiza: 'end', renk: R.mavi, kalin: true });
      s += S.zeminliYazi(370, ek.Y(ken * 10) + 20, 'kent göğü', { boy: 13, hiza: 'end', renk: R.vurgu, kalin: true });
      s += S.yazi(216, 286, '9 kare → 3 kat, 100 kare → 10 kat', { boy: 13, hiza: 'middle', renk: R.metin });
      return s;
    }
  });
})();
