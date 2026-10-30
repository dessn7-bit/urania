/* cizim_v5c.js — ders çizimleri (d41, d42, d43). cizim.js kayıtları.
   Sayılar ders metninden (arastirma/dersler_v2/d41–d43.json, kaynaklı) gelir ya da burada formülle hesaplanır
   (elips ve hiperbol yörünge denklemi, Kepler'in üçüncü yasası, ışık süresi, joule'dan kilotona çevirme).
   Her değerin kaynağı: arastirma/cizim_v5c_kaynak.md. */
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
  /* Sabit tohumlu sözde rastgele sayı (mulberry32): çizim her açılışta aynı görünür */
  const rastgele = tohum => () => {
    tohum |= 0; tohum = tohum + 0x6D2B79F5 | 0;
    let t = Math.imul(tohum ^ tohum >>> 15, 1 | tohum);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const KAYNAK = {
    plutoNasa: { ad: 'NASA NSSDCA: Pluto Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html' },
    plutoWiki: { ad: 'Wikipedia: Pluto', url: 'https://en.wikipedia.org/wiki/Pluto' },
    erisPhys: { ad: 'Phys.org: Eris, Plüton\'un ikizi (2011 örtülmesi)', url: 'https://m.phys.org/news/2011-10-faraway-eris-pluto-twin-dwarf.html' },
    erisWiki: { ad: 'Wikipedia: Eris', url: 'https://en.wikipedia.org/wiki/Eris_(dwarf_planet)' },
    haumea: { ad: 'Wikipedia: Haumea', url: 'https://en.wikipedia.org/wiki/Haumea' },
    makemake: { ad: 'NASA SVS: Makemake\'in uydusu MK 2', url: 'https://svs.gsfc.nasa.gov/12248' },
    ceres: { ad: 'NASA NSSDCA: Asteroid Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/asteroidfact.html' },
    sedna: { ad: 'Wikipedia: Sedna', url: 'https://en.wikipedia.org/wiki/Sedna_(dwarf_planet)' },
    arrokoth: { ad: 'Open University: Arrokoth', url: 'https://research.open.ac.uk/news/why-most-distant-object-ever-visited-looks-snowman-flyby-delivers-results' },
    kuiperWiki: { ad: 'Wikipedia: Kuiper belt', url: 'https://en.wikipedia.org/wiki/Kuiper_belt' },
    kuiperNasa: { ad: 'NASA Science: Kuiper Belt Facts', url: 'https://science.nasa.gov/solar-system/kuiper-belt/facts/' },
    rubin: { ad: 'SLAC: Rubin\'in ilk cüce gezegen adayı (2026)', url: 'https://www6.slac.stanford.edu/news/2026-10-27-nsf-doe-vera-c-rubin-observatory-reveals-its-first-dwarf-planet-candidate-our-solar' },
    patzold: { ad: 'ESA: Pätzold ve ark., 67P\'nin yoğunluğu ve gözenekliliği', url: 'https://sci.esa.int/web/rosetta/-/57310-patzold-et-al-2015' },
    jorda: { ad: 'IAA: Jorda ve ark., 67P\'nin biçimi', url: 'https://www.iaa.es/node/12759' },
    oortNasa: { ad: 'NASA Science: Oort Cloud Facts', url: 'https://science.nasa.gov/solar-system/oort-cloud/facts' },
    gaiaGliese: { ad: 'ESA: Close encounters of the stellar kind', url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia/Close_encounters_of_the_stellar_kind' },
    oumuamua: { ad: 'Wikipedia: 1I/ʻOumuamua', url: 'https://en.wikipedia.org/wiki/1I/%CA%BBOumuamua' },
    borisov: { ad: 'Wikipedia: 2I/Borisov', url: 'https://en.wikipedia.org/wiki/2I/Borisov' },
    atlas3i: { ad: 'Wikipedia: 3I/ATLAS', url: 'https://en.wikipedia.org/wiki/3I/ATLAS' },
    halley: { ad: 'NASA Science: Comet 1P/Halley', url: 'https://science.nasa.gov/solar-system/comets/1p-halley/' },
    towner: { ad: 'Towner ve ark. 2022: Dark flight (Murrili)', url: 'https://dfn.gfo.rocks/documents/papers_reprints/Towner_2022_Dark_Flight.pdf' },
    msfc: { ad: 'NASA MSFC: Meteorites and Craters', url: 'https://planetary.msfc.nasa.gov/Meteorites_and_Craters.html' },
    dusus: { ad: 'Wikipedia: Meteorite fall statistics', url: 'https://en.wikipedia.org/wiki/Meteorite_fall_statistics' },
    widman: { ad: 'Wikipedia: Widmanstätten pattern', url: 'https://en.wikipedia.org/wiki/Widmanst%C3%A4tten_pattern' },
    celyabinsk: { ad: 'Wikipedia: Chelyabinsk meteor', url: 'https://en.wikipedia.org/wiki/Chelyabinsk_meteor' },
    tunguska: { ad: 'Wikipedia: Tunguska event', url: 'https://en.wikipedia.org/wiki/Tunguska_event' },
    chicxulub: { ad: 'Wikipedia: Chicxulub crater', url: 'https://en.wikipedia.org/wiki/Chicxulub_crater' },
    meteorNasa: { ad: 'NASA Science: Meteors and Meteorites Facts', url: 'https://science.nasa.gov/solar-system/meteors-meteorites/facts/' }
  };

  /* ================================================================ d41 ================================================================ */

  /* d41 · bölüm 3: Plüton'un yörüngesi tepeden, ölçekli (en yakın 29,6, en uzak 48,8 AB; Neptün 30,2 AB) ve 3:2 sayacı. */
  C.ekle('d41-pluton-yorunge', {
    ders: 'd41', bolum: 3, oran: 1.05,
    baslik: 'Plüton ile Neptün: yollar kesişir gibi görünür, ama ikisi hiç buluşmaz',
    aciklama: 'Üstteki çizim ölçeklidir ve Güneş Sistemi\'ne tepeden bakar. Düz çember Neptün\'ün yaklaşık 30,2 astronomi birimlik yörüngesidir. Kesikli elips Plüton\'un yörüngesidir: en yakın noktası 29,6, en uzak noktası 48,8 astronomi birimi. Solda kalın çizilen kısa yay, Plüton\'un Neptün\'ün çemberinin içine girdiği bölümdür; Plüton o yıllarda Güneş\'e Neptün\'den daha yakındır. Son günberi geçişi 1989\'daydı. Yine de ikisi çarpışmaz, çünkü 3\'e 2 rezonansındadırlar: alttaki şeritte Neptün 495 yılda 3 tur atarken Plüton 2 tur atar, ve aralarındaki uzaklık hiçbir zaman 17 astronomi biriminin altına inmez. Plüton\'un yörüngesi 17 derece eğiktir; tepeden bakışta bu eğiklik görünmez.',
    kaynak: [KAYNAK.plutoNasa, KAYNAK.plutoWiki],
    ciz(S) {
      const R = S.R, q = 29.6, Q = 48.8, a = (q + Q) / 2, e = (Q - q) / (Q + q), p = a * (1 - e * e), nep = 30.2, k = 3.6;
      const gx = 30 + q * k, gy = 168;
      /* ν = 0 günberi, solda */
      const nokta = nu => { const r = p / (1 + e * Math.cos(nu * rad)); return [gx - r * k * Math.cos(nu * rad), gy - r * k * Math.sin(nu * rad)]; };
      const nuIc = Math.acos((p / nep - 1) / e) / rad;              // Neptün çemberinin içinde kalan yarı açı
      let s = '';
      s += S.daire(gx, gy, nep * k, { renk: R.mavi, kalin: 2 });
      const yol = []; for (let nu = 0; nu <= 360; nu += 2) yol.push(nokta(nu));
      s += S.egri(yol, { renk: R.metin, kalin: 1.6, kesik: '6 4' });
      const ic = []; for (let nu = -nuIc; nu <= nuIc + 0.01; nu += 1) ic.push(nokta(nu));
      s += S.egri(ic, { renk: R.uyari, kalin: 5 });
      s += S.daire(gx, gy, 7, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(gx + 12, gy + 5, 'Güneş', { boy: 13, kalin: true });
      /* günberi ve günöte */
      const [px, py] = nokta(0), [ax, ay] = nokta(180);
      s += S.daire(px, py, 4.5, { dolgu: R.metin, renk: R.zemin, kalin: 1 });
      s += S.cizgi(gx, gy, px, py, { renk: R.soluk, kalin: 1, kesik: '2 3' }) + S.cizgi(gx, gy, ax, ay, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.zeminliYazi(px + 8, py - 30, 'en yakın 29,6 AB', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(px + 8, py - 14, 'son günberi 1989', { boy: 13, renk: R.soluk });
      s += S.daire(ax, ay, 3, { dolgu: R.metin, renk: 'none' });
      s += S.zeminliYazi(ax - 6, ay + 22, 'en uzak', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.zeminliYazi(ax - 6, ay + 38, '48,8 AB', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      /* etiketler */
      s += S.zeminliYazi(gx, gy - nep * k - 8, 'Neptün: 30,2 AB (düz)', { boy: 13, hiza: 'middle', renk: R.mavi, kalin: true });
      s += S.yazi(392, 290, 'Plüton (kesikli)', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      const [ix, iy] = nokta(nuIc + 4);
      s += S.cizgi(ix - 2, iy - 2, 14, 36, { renk: R.uyari, kalin: 1 });
      s += S.yazi(8, 30, 'Neptün\'ün içinde', { boy: 13, renk: R.uyari, kalin: true });
      s += S.yazi(392, 22, 'arada en az 17 AB', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(392, 40, 'ölçekli, tepeden', { boy: 13, hiza: 'end', renk: R.soluk });
      /* 3:2 şeridi */
      const x0 = 74, w = 314, T = 495, yN = 350, yP = 380, X = t => x0 + t / T * w;
      s += S.yazi(8, 330, '3:2 rezonansı: ≈495 yılda bir tekrar', { boy: 13, renk: R.vurgu, kalin: true });
      const serit = (y, n, P, ad, r) => {
        let o = S.yazi(8, y + 5, ad, { boy: 13, renk: R.metin, kalin: true });
        for (let i = 0; i < n; i++) {
          const a1 = X(i * P), a2 = Math.min(X((i + 1) * P), x0 + w + 2);
          o += S.kutu(a1 + 1.5, y - 9, a2 - a1 - 3, 18, { renk: r, kalin: 2 }, 4);
          o += S.yazi((a1 + a2) / 2, y + 5, (i + 1) + '. tur', { boy: 13, hiza: 'middle', renk: R.metin });
        }
        return o;
      };
      s += serit(yN, 3, T / 3, 'Neptün', R.mavi);
      s += serit(yP, 2, 247.94, 'Plüton', R.vurgu);
      s += S.yazi(x0 + w, yP + 26, '2 × 247,94 ≈ 3 × 165 yıl', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d41 · bölüm 8: cüce gezegenler ve büyük Neptün ötesi cisimler aynı ölçekte; dolgu yoğunluğa göre. */
  C.ekle('d41-boyutlar', {
    ders: 'd41', bolum: 8, oran: 0.9,
    baslik: 'Buzlu dünyalar aynı ölçekte: boyları ve yoğunlukları',
    aciklama: 'Bütün cisimler aynı ölçekte çizildi; altlarında çapları ve gram bölü santimetreküp cinsinden ortalama yoğunlukları var. Dolgu ne kadar belirginse yoğunluk o kadar yüksektir, yani cisim o kadar çok kaya içerir. Plüton 2.376 kilometredir, Eris 2.326 kilometreyle biraz küçüktür ama daha yoğundur: kütlesi Plüton\'unkinden yüzde 27 fazladır. Haumea hızlı dönüşü yüzünden uzun bir elipsoittir; en uzun ve en kısa ekseni çizildi. Makemake ile Sedna\'nın yoğunluğu henüz bilinmiyor, bu yüzden içleri boş ve kesikli çizgilidir; Sedna\'nın çapı da iki yöntemle 906 ile 1.025 kilometre arasında çıkar. Ceres asteroit kuşağındadır. New Horizons\'ın ziyaret ettiği Arrokoth yalnızca 36 kilometredir; bu ölçekte sağ üst köşedeki bir noktadan ibarettir.',
    kaynak: [KAYNAK.plutoNasa, KAYNAK.erisPhys, KAYNAK.erisWiki, KAYNAK.haumea, KAYNAK.makemake, KAYNAK.ceres, KAYNAK.sedna, KAYNAK.arrokoth],
    ciz(S) {
      const R = S.R, k = 0.042;                                     // birim / km
      const sd = r => Math.round((0.25 + (r - 1.6) / (2.6 - 1.6) * 0.7) * 100) / 100;   // yoğunluk → dolgu saydamlığı
      const cisim = (x, y, ad, dx, dy, cap, yog, ek) => {
        let o = '';
        const rx = dx * k / 2, ry = dy * k / 2, bil = yog != null;
        const st = bil ? { dolgu: R.ay, saydam: sd(yog), renk: 'none' } : { dolgu: 'none', renk: R.metin, kalin: 1.4, kesik: '4 3' };
        o += S.elips(x, y, rx, ry, st);
        if (bil) o += S.elips(x, y, rx, ry, { renk: R.metin, kalin: 1.2 });
        if (ek) o += ek;
        const yb = y + 66;
        o += S.yazi(x, yb, ad, { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
        o += S.yazi(x, yb + 17, cap, { boy: 13, hiza: 'middle', renk: R.metin });
        o += S.yazi(x, yb + 34, bil ? tr(yog, 2) : 'bilinmiyor', { boy: 13, hiza: 'middle', renk: bil ? R.vurgu : R.soluk, kalin: bil });
        return o;
      };
      let s = '';
      s += S.yazi(8, 18, 'aynı ölçek · yoğunluk g/cm³', { boy: 13, renk: R.soluk });
      const y1 = 84, y2 = 250;
      s += cisim(64, y1, 'Plüton', 2376, 2376, '2.376 km', 1.854);
      s += cisim(192, y1, 'Eris', 2326, 2326, '2.326 km', 2.52);
      s += S.yazi(192, y1 + 117, '(yeni değer 2,43)', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += cisim(322, y1, 'Haumea', 2322, 1026, '2.322 × 1.026 km', 2.05);
      s += cisim(50, y2, 'Makemake', 1400, 1400, '≈1.400 km', null);
      s += cisim(146, y2, 'Charon', 1212, 1212, '1.212 km', 1.70);
      /* Sedna: 906 (ısıl) ve 1025 (örtülme) km */
      s += cisim(246, y2, 'Sedna', 1025, 1025, '906–1.025 km', null, S.daire(246, y2, 906 * k / 2, { renk: R.metin, kalin: 1, kesik: '2 2' }));
      s += cisim(344, y2, 'Ceres', 965, 891, '965 × 891 km', 2.17);
      /* Arrokoth: 36 km → 1,5 birim, nokta */
      s += S.yazi(380, 18, 'Arrokoth, 36 km:', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.daire(388, 13, 1.5, { dolgu: R.metin, renk: 'none' });
      return s;
    }
  });

  /* d41 · bölüm 11: Kuiper kuşağının yarı büyük eksen – eğiklik haritası (bölgeler ders metninden; nokta Plüton ve 2026 ED138). */
  C.ekle('d41-kuiper-haritasi', {
    ders: 'd41', bolum: 11, oran: 0.86,
    baslik: 'Kuiper kuşağının haritası: rezonanslar, iki klasik nüfus ve uçurum',
    aciklama: 'Yatay eksen bir cismin Güneş\'e ortalama uzaklığı, yani yarı büyük ekseni, dikey eksen yörüngesinin eğikliğidir. Neptün 30,2 astronomi biriminde, eğikliği neredeyse sıfır. 39,4 astronomi birimindeki kesikli dikey çizgi 3\'e 2 rezonansıdır: yaklaşık 200 plütino ve Plüton burada dolanır. 47,7\'deki kesikli çizgi 1\'e 2 rezonansıdır. Klasik kuşak 42 ile 48 astronomi birimi arasındadır: düz çerçeveli alçak kutu, eğikliği 10 dereceye kadar olan soğuk nüfus, koyu dikey şerit ise 44 ile 44,5 astronomi birimindeki yığılmadır; kesikli çerçeveli yüksek kutu, eğikliği 30 dereceye kadar çıkan sıcak nüfustur. 50 astronomi biriminin ötesinde büyük cisimler aniden azalır: Kuiper uçurumu. İçi boş baklava, Rubin\'in 2026\'da bulduğu 2026 ED138\'dir; onun için yarı büyük eksen yerine bugünkü uzaklığı kullanıldı. Bölgelerin sınırları yaklaşıktır.',
    kaynak: [KAYNAK.kuiperWiki, KAYNAK.kuiperNasa, KAYNAK.plutoNasa, KAYNAK.rubin],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 58, y: 44, w: 324, h: 218 }, { x0: 29, x1: 55, y0: 0, y1: 36 }, {
        xIsaret: [[30, '30'], [35, '35'], [40, '40'], [45, '45'], [50, '50'], [55, '55']],
        yIsaret: [[0, '0°'], [10, '10°'], [20, '20°'], [30, '30°']],
        xAd: 'Güneş\'e ortalama uzaklık (AB)', yAd: 'eğiklik', yAdUzak: 46
      });
      const X = ek.X, Y = ek.Y;
      let s = '';
      /* uçurum */
      s += S.kutu(X(50), Y(36), X(55) - X(50), Y(0) - Y(36), { dolgu: R.yuzey2, renk: 'none' });
      for (let v = 50.6; v < 55; v += 0.9) s += S.cizgi(X(v), Y(36), X(v), Y(0), { renk: R.cizgi, kalin: 1 });
      s += S.yazi(X(52.5) + 5, Y(18), 'Kuiper uçurumu', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true, yan: -90 });
      /* sıcak ve soğuk klasik */
      s += S.kutu(X(42), Y(30), X(48) - X(42), Y(0) - Y(30), { dolgu: R.vurguSoluk, saydam: 0.35, renk: R.vurgu, kalin: 1.4, kesik: '5 4' });
      s += S.kutu(X(42), Y(10), X(48) - X(42), Y(0) - Y(10), { dolgu: R.vurguSoluk, saydam: 0.9, renk: R.vurgu, kalin: 2 });
      s += S.kutu(X(44), Y(10), X(44.5) - X(44), Y(0) - Y(10), { dolgu: R.vurgu, renk: 'none' });
      s += ek.svg;
      /* rezonanslar */
      s += S.cizgi(X(39.4), Y(36), X(39.4), Y(0), { renk: R.mavi, kalin: 2, kesik: '6 4' });
      s += S.cizgi(X(47.7), Y(36), X(47.7), Y(0), { renk: R.mavi, kalin: 2, kesik: '6 4' });
      s += S.zeminliYazi(X(39.4) - 4, Y(33.5), '3:2', { boy: 13, hiza: 'end', renk: R.mavi, kalin: true });
      s += S.zeminliYazi(X(47.7) - 4, Y(33.5), '1:2', { boy: 13, hiza: 'end', renk: R.mavi, kalin: true });
      /* ana gövde parantezi */
      const yb = 26;
      s += S.cizgi(X(39.5), yb, X(48), yb, { renk: R.metin, kalin: 1.2 }) + S.cizgi(X(39.5), yb, X(39.5), yb + 6, { renk: R.metin, kalin: 1.2 }) + S.cizgi(X(48), yb, X(48), yb + 6, { renk: R.metin, kalin: 1.2 });
      s += S.yazi((X(39.5) + X(48)) / 2, yb - 7, 'ana gövde 39,5–48 AB', { boy: 13, hiza: 'middle', renk: R.metin });
      /* sol açıklamalar */
      s += S.yazi(66, Y(31), 'plütinolar (≈200)', { boy: 13, renk: R.mavi });
      s += S.yazi(66, Y(26), 'sıcak klasik:', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(66, Y(26) + 16, 'eğiklik ≤ 30°', { boy: 13, renk: R.metin });
      s += S.cizgi(162, Y(26) + 4, X(42) - 2, Y(24), { renk: R.soluk, kalin: 1 });
      s += S.yazi(66, Y(9.5), 'soğuk klasik:', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(66, Y(9.5) + 16, 'eğiklik ≤ 10°', { boy: 13, renk: R.metin });
      s += S.cizgi(160, Y(9.5) + 4, X(42) - 2, Y(6), { renk: R.soluk, kalin: 1 });
      /* Neptün, Plüton, 2026 ED138 */
      s += S.daire(X(30.2), Y(0), 6, { dolgu: R.mavi, renk: R.zemin, kalin: 1.5 });
      s += S.yazi(X(30.2) + 2, Y(0) - 12, 'Neptün', { boy: 13, renk: R.mavi, kalin: true });
      s += S.daire(X(39.48), Y(17.16), 5.5, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
      s += S.zeminliYazi(X(39.48) - 10, Y(17.16) + 5, 'Plüton', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      const dx = X(46), dy = Y(25);
      s += `<polygon points="${dx},${dy - 7} ${dx + 6},${dy} ${dx},${dy + 7} ${dx - 6},${dy}" fill="${R.zemin}" stroke="${R.metin}" stroke-width="2"/>`;
      s += S.zeminliYazi(dx - 10, dy - 4, '2026 ED138', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.zeminliYazi(dx - 10, dy + 13, 'bugün ≈46 AB', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(8, 340, 'Eris (≈67,7 AB, 44°) bu çizimin çok dışında kalır', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d42 ================================================================ */

  /* d42 · bölüm 1: 67P'nin hacmi 100 kareye bölündü: %73 boşluk, kalan 27'nin hacimce 2'si toz, 1'i buz → 18 ve 9. */
  C.ekle('d42-67p-gozenek', {
    ders: 'd42', bolum: 1, oran: 0.74,
    baslik: '67P\'nin çekirdeği: dörtte üçü boşluk olan buzlu bir toz yığını',
    aciklama: 'Soldaki 100 kare, Rosetta\'nın incelediği 67P çekirdeğinin hacmini temsil eder. Rosetta\'nın çekim ölçümüne göre hacmin yüzde 72 ile 74\'ü boşluktur; burada 73 kare boş bırakıldı ve içlerinde yalnızca küçük birer nokta var. Kalan 27 karenin hacimce yaklaşık üçte ikisi toz, üçte biri buzdur: 18 dolu kare toz, içinde çarpı olan 9 kare buzdur. Kütlece toz buzdan yaklaşık dört kat fazladır. Karelerin yerleri rastgele seçildi; ölçümler çekirdeğin içinin büyük ölçekte türdeş olduğunu, büyük mağaralar içermediğini gösterir. Sağdaki çubuklar ortalama yoğunluğu karşılaştırır: 67P metreküp başına 533 kilogramdır, suyun 1.000 kilogramlık yoğunluğunun neredeyse yarısı. Bu yüzden kirli kartopu yerine buzlu toz yığını demek daha doğrudur.',
    kaynak: [KAYNAK.patzold, KAYNAK.jorda],
    ciz(S) {
      const R = S.R, rnd = rastgele(67), n = 10, h = 15, x0 = 14, y0 = 40;
      /* 100 hücre: 9 buz, 18 toz, 73 boşluk; sabit tohumla karıştır */
      const tur = [].concat(Array(9).fill(2), Array(18).fill(1), Array(73).fill(0));
      for (let i = tur.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [tur[i], tur[j]] = [tur[j], tur[i]]; }
      let s = S.yazi(x0, 24, 'hacim: 100 kare', { boy: 14, renk: R.metin, kalin: true });
      tur.forEach((t, i) => {
        const x = x0 + (i % n) * h, y = y0 + Math.floor(i / n) * h;
        if (t === 1) s += S.kutu(x + 1, y + 1, h - 2, h - 2, { dolgu: R.metin, renk: 'none' }, 1);
        else if (t === 2) s += S.kutu(x + 1.5, y + 1.5, h - 3, h - 3, { dolgu: R.mavi, saydam: 0.35, renk: R.mavi, kalin: 1.2 }, 1) + S.cizgi(x + 4, y + 4, x + h - 4, y + h - 4, { renk: R.mavi, kalin: 1.4 }) + S.cizgi(x + h - 4, y + 4, x + 4, y + h - 4, { renk: R.mavi, kalin: 1.4 });
        else s += S.kutu(x + 0.5, y + 0.5, h - 1, h - 1, { renk: R.cizgi, kalin: 0.6 }) + S.daire(x + h / 2, y + h / 2, 0.9, { dolgu: R.soluk, renk: 'none' });
      });
      /* gösterge */
      const gy = y0 + n * h + 22;
      s += S.kutu(x0, gy - 11, 12, 12, { renk: R.cizgi, kalin: 1 }) + S.yazi(x0 + 18, gy, 'boşluk: 73', { boy: 13, renk: R.metin });
      s += S.kutu(x0, gy + 9, 12, 12, { dolgu: R.metin, renk: 'none' }, 1) + S.yazi(x0 + 18, gy + 20, 'toz: 18', { boy: 13, renk: R.metin });
      s += S.kutu(x0 + 82, gy + 9, 12, 12, { dolgu: R.mavi, saydam: 0.35, renk: R.mavi, kalin: 1.2 }, 1) + S.cizgi(x0 + 85, gy + 12, x0 + 91, gy + 18, { renk: R.mavi, kalin: 1.4 }) + S.cizgi(x0 + 91, gy + 12, x0 + 85, gy + 18, { renk: R.mavi, kalin: 1.4 });
      s += S.yazi(x0 + 100, gy + 20, 'buz: 9', { boy: 13, renk: R.metin });
      /* sağ: yoğunluk çubukları */
      const bx = 196, bw = 180, by = 70, K = bw / 1000;
      s += S.yazi(bx, 24, 'ortalama yoğunluk', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(bx, 42, '(kg/m³)', { boy: 13, renk: R.soluk });
      s += S.yazi(bx, by - 4, 'su: 1.000', { boy: 13, renk: R.metin, kalin: true });
      s += S.kutu(bx, by + 2, 1000 * K, 18, { dolgu: R.mavi, saydam: 0.35, renk: R.mavi, kalin: 1.4 }, 2);
      s += S.yazi(bx, by + 40, '67P: 533', { boy: 13, renk: R.metin, kalin: true });
      s += S.kutu(bx, by + 46, 533 * K, 18, { dolgu: R.metin, renk: 'none' }, 2);
      s += S.yazi(bx, by + 90, 'sudan neredeyse 2 kat hafif', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(bx, by + 118, 'boşluk %72–74', { boy: 13, renk: R.metin });
      s += S.yazi(bx, by + 136, 'hacimce: toz ≈ 2 × buz', { boy: 13, renk: R.metin });
      s += S.yazi(bx, by + 154, 'kütlece: toz ≈ 4 × buz', { boy: 13, renk: R.metin });
      s += S.yazi(bx, by + 184, 'çekirdek 4,34 × 2,60 × 2,12 km', { boy: 13, renk: R.soluk });
      s += S.yazi(bx, by + 202, 'kare yerleri temsilî', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d42 · bölüm 6: Oort bulutu yandan, logaritmik yarıçap: düz Kuiper kuşağı (±10°) ve küresel kabuk. */
  C.ekle('d42-oort-kabugu', {
    ders: 'd42', bolum: 6, oran: 1.12,
    baslik: 'Oort bulutu yandan: düz bir kuşak değil, Güneş\'i saran küresel bir kabuk',
    aciklama: 'Güneş Sistemi\'ne yandan bakıyoruz; Güneş ortadadır ve merkezden uzaklık logaritmiktir: alttaki cetvelde her çentik on kat demektir, yani dış halkalar gerçekte çok daha geniştir. Merkeze yakın, iki yana açılan dar kama Kuiper kuşağıdır: 30 ile 50 astronomi birimi arasında, cisimlerinin çoğu gezegenlerin düzleminden 10 dereceden fazla uzaklaşmaz. Noktalı çember heliopozdur, Güneş ışığı oraya yaklaşık 17 saatte varır. Dış halka Oort bulutudur ve her yönü sarar; uzun dönemli kuyruklu yıldızların gökyüzünün her yönünden gelmesi bu yüzdendir. İç kenarı 2.000 ile 5.000, dış kenarı 10.000 ile 100.000 astronomi birimi arasında tahmin edilir; soluk şeritler bu belirsizliktir. Işık iç kenara 10 ile 28 günde varır. Yıldız işareti Gliese 710\'dur: yaklaşık 1,3 milyon yıl sonra Güneş\'e, ESA\'ya göre yaklaşık 16.000, daha yeni bir hesaba göre yaklaşık 12.800 astronomi birimi yaklaşacak ve bulutun içinden geçecek. Oort bulutu hiç doğrudan görülmedi; noktalar temsilîdir.',
    kaynak: [KAYNAK.oortNasa, KAYNAK.kuiperNasa, KAYNAK.gaiaGliese],
    ciz(S) {
      const R = S.R, cx = 200, cy = 184, r0 = 12, K = 30, rnd = rastgele(1950);
      const r = au => r0 + K * Math.log10(au);
      const halka = (a1, a2, sd) => S.daire(cx, cy, (r(a1) + r(a2)) / 2, { renk: R.ay, kalin: r(a2) - r(a1), saydam: sd });
      let s = '';
      s += halka(2000, 5000, 0.22) + halka(5000, 10000, 0.5) + halka(10000, 100000, 0.22);
      s += S.daire(cx, cy, r(2000), { renk: R.soluk, kalin: 1, kesik: '3 4' }) + S.daire(cx, cy, r(100000), { renk: R.soluk, kalin: 1, kesik: '3 4' });
      /* buzlu cisimler: her yönde */
      for (let i = 0; i < 170; i++) {
        const a = rnd() * 2 * Math.PI, rr = r(Math.pow(10, 3.4 + rnd() * 1.6));
        s += S.daire(cx + rr * Math.cos(a), cy + rr * Math.sin(a), 1.1, { dolgu: R.metin, renk: 'none' });
      }
      /* heliopoz: 17 ışık saati = 17 × 3600 ÷ 499 AB */
      const hp = 17 * 3600 / 499;
      s += S.daire(cx, cy, r(hp), { renk: R.mavi, kalin: 1.6, kesik: '1 4', uc: 'round' });
      /* Kuiper kuşağı: ±10° kama, 30–50 AB */
      const kama = yon => {
        const p = (au, d) => [cx + yon * r(au) * Math.cos(d * rad), cy - r(au) * Math.sin(d * rad)];
        const a = p(30, 10), b = p(50, 10), c = p(50, -10), d = p(30, -10);
        return `<polygon points="${a.map(Math.round)} ${b.map(Math.round)} ${c.map(Math.round)} ${d.map(Math.round)}" fill="${R.vurgu}" stroke="${R.vurgu}" stroke-width="1.5"/>`;
      };
      s += kama(1) + kama(-1);
      s += S.cizgi(cx - r(50) - 8, cy, cx + r(50) + 8, cy, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.daire(cx, cy, 5, { dolgu: R.gunes, renk: R.gunes });
      /* Gliese 710: ESA 16.000 AB (2026 hesabı 12.800 AB), sol altta */
      const ga = 214 * rad, gr = r(16000), gx = cx + gr * Math.cos(ga), gy = cy - gr * Math.sin(ga);
      s += `<polygon points="${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => { const rr = i % 2 ? 3.2 : 8, aa = -Math.PI / 2 + i * Math.PI / 5; return Math.round((gx + rr * Math.cos(aa)) * 10) / 10 + ',' + Math.round((gy + rr * Math.sin(aa)) * 10) / 10; }).join(' ')}" fill="${R.yildiz}" stroke="${R.zemin}" stroke-width="1"/>`;
      s += S.cizgi(gx - 5, gy + 6, 40, 358, { renk: R.soluk, kalin: 1 });
      s += S.yazi(8, 374, 'Gliese 710 yıldızı', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(8, 390, '≈1,3 milyon yıl sonra', { boy: 13, renk: R.metin });
      s += S.yazi(8, 406, '12.800–16.000 AB\'ye gelecek', { boy: 13, renk: R.metin });
      /* etiketler */
      s += S.yazi(8, 20, 'Oort bulutu (hiç görülmedi)', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(8, 38, 'iç kenar 2.000–5.000 AB', { boy: 13, renk: R.metin });
      s += S.yazi(392, 20, 'dış kenar', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(392, 38, '10.000–100.000 AB', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.cizgi(330, 44, cx + r(60000) * Math.cos(45 * rad), cy - r(60000) * Math.sin(45 * rad), { renk: R.soluk, kalin: 1 });
      s += S.cizgi(70, 44, cx + r(3500) * Math.cos(135 * rad), cy - r(3500) * Math.sin(135 * rad), { renk: R.soluk, kalin: 1 });
      s += S.yazi(cx, cy + 34, 'Kuiper kuşağı', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(cx, cy + 51, '30–50 AB, ±10°', { boy: 13, hiza: 'middle', renk: R.vurgu });
      s += S.yazi(cx, cy - r(hp) - 7, 'heliopoz', { boy: 13, hiza: 'middle', renk: R.mavi, kalin: true });
      s += S.yazi(cx, cy - r(hp) + 19, '≈17 ışık saati', { boy: 13, hiza: 'middle', renk: R.mavi });
      /* cetvel: merkezden sağa yarıçap */
      const yc = 384, ux = au => cx + r(au);
      s += S.cizgi(cx, yc, ux(100000), yc, { renk: R.soluk, kalin: 1.2 });
      s += S.ok(cx + 2, yc, cx, yc, { renk: R.soluk, kalin: 1.2, boy: 0.1 });
      [[1, '1'], [10, '10'], [100, '100'], [1000, '10³'], [10000, '10⁴'], [100000, '10⁵']].forEach(([au, t]) => {
        s += S.cizgi(ux(au), yc - 4, ux(au), yc + 4, { renk: R.soluk, kalin: 1 }) + S.yazi(ux(au), yc + 20, t, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.yazi(cx, yc - 10, 'Güneş\'ten uzaklık, AB (log)', { boy: 13, renk: R.soluk });
      s += S.yazi(cx, 428, 'ışık iç kenara 10–28 günde', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* d42 · bölüm 14: üç yıldızlararası cismin yörüngesi ölçekli (r = q(1+e) ÷ (1 + e cos ν)), günberileri sola hizalı; Halley karşılaştırma. */
  C.ekle('d42-hiperbol', {
    ders: 'd42', bolum: 14, oran: 1.0,
    baslik: 'Yıldızlararası ziyaretçiler: kapalı elips yerine açık yollar',
    aciklama: 'Dört yol aynı ölçekte çizildi ve Güneş\'e en yakın noktaları aynı yöne, sola çevrildi; ince çember Dünya\'nın 1 astronomi birimlik yörüngesidir. Noktalı çizgi Halley\'nin yoludur: dışmerkezliği 1\'den küçük, yani kapalı bir elipstir ve yaklaşık 35 astronomi biriminde geri döner. Öteki üçünün dışmerkezliği 1\'den büyüktür, yolları açık hiperbollerdir ve bir daha dönmezler. Kalın düz çizgi Oumuamua\'dır: dışmerkezliği 1,20, Güneş\'e 0,255 astronomi birimine kadar yaklaştı ve yönü 113 derece kadar büküldü. Kesikli çizgi 2I Borisov\'dur, dışmerkezliği 3,36. Kesik noktalı çizgi 3I ATLAS\'tır: dışmerkezliği 6,14 ve Güneş\'ten uzaktaki hızı saniyede 58 kilometre olduğu için yolu neredeyse düzdür, yalnızca 19 derece kadar bükülür. Hız arttıkça Güneş\'in çekimi yolu daha az büker.',
    kaynak: [KAYNAK.oumuamua, KAYNAK.borisov, KAYNAK.atlas3i, KAYNAK.halley],
    ciz(S) {
      const R = S.R, k = 46, gx = 236, gy = 176, alt = 300;
      const yol = (q, e, o) => {
        const p = q * (1 + e), lim = e >= 1 ? Math.acos(-1 / e) / rad - 0.5 : 180, parca = [];
        let cur = [];
        for (let nu = -lim; nu <= lim; nu += 0.25) {
          const r = p / (1 + e * Math.cos(nu * rad)), x = gx - r * k * Math.cos(nu * rad), y = gy - r * k * Math.sin(nu * rad);
          if (x < 4 || x > 396 || y < 6 || y > alt) { if (cur.length > 1) parca.push(cur); cur = []; } else cur.push([x, y]);
        }
        if (cur.length > 1) parca.push(cur);
        return parca.map(ls => S.egri(ls, o)).join('');
      };
      const bukul = e => 2 * Math.acos(-1 / e) / rad - 180;      // yön değişimi (derece)
      let s = '';
      s += S.daire(gx, gy, k, { renk: R.mavi, kalin: 1 });
      s += S.yazi(gx + k * 0.72 + 4, gy - k * 0.72 - 2, 'Dünya, 1 AB', { boy: 13, renk: R.mavi });
      const qH = 0.5871, QH = 35.25, eH = (QH - qH) / (QH + qH);
      s += yol(qH, eH, { renk: R.soluk, kalin: 2, kesik: '1 4', uc: 'round' });
      s += yol(2.0, 3.36, { renk: R.metin, kalin: 2, kesik: '8 5' });
      s += yol(1.36, 6.14, { renk: R.vurgu, kalin: 2.2, kesik: '10 4 2 4' });
      s += yol(0.255, 1.20, { renk: R.metin, kalin: 3.2 });
      s += S.daire(gx, gy, 6, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(gx + 9, gy + 18, 'Güneş', { boy: 13, kalin: true });
      /* etiketler: günberi noktaları */
      s += S.zeminliYazi(gx - 2.0 * k - 6, gy - 50, 'Borisov', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.zeminliYazi(gx - 1.36 * k + 4, gy + 84, '3I/ATLAS', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(gx + 34, gy + 74, 'ʻOumuamua', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(306, 30, 'Halley: geri döner', { boy: 13, hiza: 'middle', renk: R.soluk, kalin: true });
      /* gösterge */
      const gsat = (y, o, ad, ek2) => S.cizgi(8, y - 4, 44, y - 4, o) + S.yazi(52, y, ad, { boy: 13, renk: R.metin, kalin: true }) + S.yazi(392, y, ek2, { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(392, 316, 'dışmerkezlik · bükülme', { boy: 13, hiza: 'end', renk: R.soluk });
      s += gsat(334, { renk: R.metin, kalin: 3.2 }, 'ʻOumuamua 26 km/s', '1,20 · ' + tr(bukul(1.20)) + '°');
      s += gsat(352, { renk: R.metin, kalin: 2, kesik: '8 5' }, '2I/Borisov 32 km/s', '3,36 · ' + tr(bukul(3.36)) + '°');
      s += gsat(370, { renk: R.vurgu, kalin: 2.2, kesik: '10 4 2 4' }, '3I/ATLAS 58 km/s', '6,14 · ' + tr(bukul(6.14)) + '°');
      s += gsat(388, { renk: R.soluk, kalin: 2, kesik: '1 4', uc: 'round' }, 'Halley (kapalı elips)', tr(eH, 2) + ' · döner');
      return s;
    }
  });

  /* ================================================================ d43 ================================================================ */

  /* d43 · bölüm 2: parlak uçuş, karanlık uçuş, rüzgâr kayması ve saçılma alanı. Yükseklik ekseni ölçekli, yatay ölçeksiz. */
  C.ekle('d43-karanlik-ucus', {
    ders: 'd43', bolum: 2, oran: 0.95,
    baslik: 'Göktaşının son dakikaları: parlak uçuş, karanlık uçuş ve rüzgâr',
    aciklama: 'Dikey eksen kilometre cinsinden yüksekliktir ve ölçeklidir; yatay uzaklık ölçeksizdir. Taş havaya saniyede en az 11 kilometre hızla girer. Kalın çizgi parlak uçuştur: yüzey erir ve akan havayla sıyrılır, buna ablasyon denir. Gölgeli şerit, parlak uçuşun tipik olarak bittiği 20 ile 30 kilometrelik yüksekliktir; çizimdeki yol Murrili örneğidir, 18 kilometrede saniyede 3,3 kilometre hızla söndü. Kesikli çizgi karanlık uçuştur: taş artık ışık saçmaz, yavaşlayıp dikleşerek düşer ve yüksek irtifa rüzgârları onu birkaç kilometre sürükler. Bu yüzden taş, söndüğü noktanın tam altında değildir; parçalar yerde uzun ve dar bir saçılma alanına yayılır. Sol alttaki kesit füzyon kabuğudur: ısı yalnızca birkaç milimetre içeri işler, taşın içi soğuk kalır.',
    kaynak: [KAYNAK.towner, KAYNAK.msfc, KAYNAK.meteorNasa],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 46, y: 18, w: 336, h: 300 }, { x0: 0, x1: 1, y0: 0, y1: 50 }, {
        yIsaret: [[0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40'], [50, '50']],
        yAd: 'yükseklik (km)', yAdUzak: 34
      });
      const X = ek.X, Y = ek.Y;
      let s = '';
      s += S.kutu(X(0), Y(30), 336, Y(20) - Y(30), { dolgu: R.vurguSoluk, saydam: 0.45, renk: 'none' });
      s += S.zeminliYazi(X(1) - 4, Y(30) + 16, 'parlak uçuş tipik', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.zeminliYazi(X(1) - 4, Y(30) + 32, 'olarak 20–30 km\'de biter', { boy: 13, hiza: 'end', renk: R.metin });
      s += ek.svg;
      /* parlak uçuş: 50 km → 18 km */
      const a = [X(0.04), Y(50)], b = [X(0.46), Y(18)];
      s += S.cizgi(a[0], a[1], b[0], b[1], { renk: R.gunes, kalin: 6, uc: 'round' });
      s += S.yazi(X(0.04) + 20, Y(47.6), '≥11 km/s ile girer', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(X(0.27) + 12, Y(36.5), 'parlak uçuş: ablasyon', { boy: 13, renk: R.gunes, kalin: true });
      s += S.daire(b[0], b[1], 6, { dolgu: R.zemin, renk: R.metin, kalin: 2 });
      s += S.zeminliYazi(b[0] + 12, b[1] - 2, 'söndü: 18 km, 3,3 km/s', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(b[0] + 12, b[1] + 14, '(Murrili örneği)', { boy: 13, renk: R.soluk });
      /* karanlık uçuş: dikleşerek iner, rüzgârla sağa kayar */
      const ls = [];
      for (let t = 0; t <= 1.0001; t += 0.02) {
        const h = 18 * (1 - t), x = 0.46 + 0.10 * Math.sin(t * Math.PI / 2) + 0.16 * t * t;
        ls.push([X(x), Y(h)]);
      }
      s += S.egri(ls, { renk: R.metin, kalin: 2.4, kesik: '7 5' });
      s += S.zeminliYazi(X(0.62) + 8, Y(10), 'karanlık uçuş', { boy: 13, renk: R.metin, kalin: true });
      /* rüzgâr okları */
      [[14, 0.66], [6, 0.70]].forEach(([h, x]) => { s += S.ok(X(x) + 52, Y(h), X(x) + 92, Y(h), { renk: R.mavi, kalin: 2, boy: 8 }); });
      s += S.zeminliYazi(X(1) - 4, Y(3.3), 'rüzgâr sürükler', { boy: 13, hiza: 'end', renk: R.mavi });
      /* söndüğü yerin altı: taş burada değil */
      s += S.cizgi(b[0], b[1] + 8, b[0], Y(0) - 8, { renk: R.uyari, kalin: 1.2, kesik: '2 4' });
      s += S.cizgi(b[0] - 6, Y(0) - 12, b[0] + 6, Y(0), { renk: R.uyari, kalin: 2.2 }) + S.cizgi(b[0] + 6, Y(0) - 12, b[0] - 6, Y(0), { renk: R.uyari, kalin: 2.2 });
      s += S.zeminliYazi(b[0] - 10, Y(0) - 20, 'taş burada değil', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      /* saçılma alanı */
      const sx = X(0.72);
      s += S.elips(sx, Y(0) - 1, 34, 6, { dolgu: R.vurguSoluk, renk: R.metin, kalin: 1.4 });
      s += S.yazi(sx, Y(0) + 22, 'saçılma alanı', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(X(0.02), Y(0) + 22, 'yer', { boy: 13, renk: R.soluk });
      /* füzyon kabuğu kesiti */
      const fx = 360, fy = 66;
      s += S.daire(fx, fy, 24, { dolgu: R.soluk, saydam: 0.45, renk: 'none' }) + S.daire(fx, fy, 24, { renk: R.metin, kalin: 4 });
      s += S.yazi(fx - 32, fy + 5, 'taş kesiti', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(392, fy + 42, 'füzyon kabuğu:', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(392, fy + 58, 'birkaç mm; içi soğuk', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(392, 366, 'yatay uzaklık ölçeksiz', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d43 · bölüm 5: katmanlaşmış gezegenciğin kesiti ve göktaşı aileleri; düşüş sayıları 1.062 düşüşlük tablodan. Şematik. */
  C.ekle('d43-ana-cisim', {
    ders: 'd43', bolum: 5, oran: 1.04,
    baslik: 'Göktaşı aileleri: parçalanmış bir gezegenciğin dilimleri',
    aciklama: 'Üstteki kesit bir zamanlar erimiş ve katmanlaşmış bir gezegenciktir: ağır demir-nikel merkeze çökerek çekirdeği, hafif kaya da çevresinde mantoyu ve kabuğu oluşturmuştur. Böyle bir cisim parçalanınca kabuğundan akondritler, çekirdeğinden demir göktaşları, çekirdekle manto arasındaki sınırdan taş-demirler, örneğin palasitler gelir. Çekirdekteki çapraz çizgiler, demir göktaşlarında görülen Widmanstätten desenini simgeler. Alttaki cisim hiç erimemiştir; içindeki küçük daireler kondrüllerdir ve bu cisimlerden kondritler gelir. Sayılar Haziran 2012\'ye kadar düşerken görülmüş 1.062 göktaşından: 915\'i, yani yaklaşık yüzde 86\'sı kondrit, 86\'sı yaklaşık yüzde 8 ile akondrit, 49\'u yüzde 4,6 ile demir, 11\'i yüzde 1 ile taş-demir. Çizim şematiktir, katmanların kalınlıkları ölçekli değildir.',
    kaynak: [KAYNAK.dusus, KAYNAK.widman],
    ciz(S) {
      const R = S.R, cx = 124, cy = 150, rnd = rastgele(1969);
      const kat = { kabuk: 104, manto: 92, sinir: 50, cekirdek: 40 };
      let s = '';
      s += S.yazi(8, 22, 'erimiş ve katmanlaşmış gezegencik', { boy: 14, renk: R.metin, kalin: true });
      s += S.daire(cx, cy, kat.kabuk, { dolgu: R.vurguSoluk, renk: R.metin, kalin: 1.4 });
      s += S.daire(cx, cy, kat.manto, { dolgu: R.yuzey2, renk: R.metin, kalin: 1 });
      /* çekirdek sınırı: metal içinde kaya taneleri (palasit) */
      s += S.daire(cx, cy, kat.sinir, { dolgu: R.soluk, saydam: 0.55, renk: R.metin, kalin: 1 });
      for (let i = 0; i < 26; i++) { const a = i / 26 * 2 * Math.PI + 0.1, rr = 45; s += S.daire(cx + rr * Math.cos(a), cy + rr * Math.sin(a), 2.6, { dolgu: R.vurgu, renk: 'none' }); }
      s += S.daire(cx, cy, kat.cekirdek, { dolgu: R.soluk, renk: R.metin, kalin: 1.2 });
      /* çekirdekte Widmanstätten benzeri çapraz çizgiler (simge) */
      [-16, -6, 4, 14].forEach(d => {
        s += S.cizgi(cx - 26, cy + d - 10, cx + 26, cy + d + 10, { renk: R.zemin, kalin: 1, saydam: 0.6 });
        s += S.cizgi(cx - 26, cy + d + 10, cx + 26, cy + d - 10, { renk: R.zemin, kalin: 1, saydam: 0.6 });
      });
      /* etiketler: sağda */
      const lx = 244;
      const etiket = (ry, ang, ty, bas, alt, r) => {
        const px = cx + ry * Math.cos(ang * rad), py = cy - ry * Math.sin(ang * rad);
        return S.cizgi(px, py, lx - 6, ty - 4, { renk: R.soluk, kalin: 1 }) + S.daire(px, py, 2.5, { dolgu: R.metin, renk: 'none' }) +
          S.yazi(lx, ty, bas, { boy: 13, renk: r || R.metin, kalin: true }) + S.yazi(lx, ty + 16, alt, { boy: 13, renk: R.metin });
      };
      s += etiket(98, 52, 54, 'kabuk → akondrit', '86 düşüş, %8', R.metin);
      s += etiket(72, 20, 106, 'manto (kaya)', '', R.soluk);
      s += etiket(45, -22, 168, 'çekirdek sınırı →', 'taş-demir: 11, %1', R.vurgu);
      s += etiket(20, -60, 226, 'çekirdek → demir', '49 düşüş, %4,6', R.metin);
      /* alt: hiç erimemiş cisim */
      const ux = 82, uy = 342, ur = 50;
      s += S.yazi(8, 280, 'hiç erimemiş cisim', { boy: 14, renk: R.metin, kalin: true });
      s += S.daire(ux, uy, ur, { dolgu: R.yuzey2, renk: R.metin, kalin: 1.4 });
      for (let i = 0; i < 34; i++) {
        const a = rnd() * 2 * Math.PI, rr = Math.sqrt(rnd()) * (ur - 7), r2 = 2.5 + rnd() * 2.5;
        s += S.daire(ux + rr * Math.cos(a), uy + rr * Math.sin(a), r2, { renk: R.metin, kalin: 1 });
      }
      s += S.yazi(150, 326, 'kondrit: 915 düşüş, %86', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(150, 344, 'küçük daireler: kondrüller', { boy: 13, renk: R.metin });
      s += S.yazi(150, 362, 'Güneş Sistemi\'nin en eski malzemesi', { boy: 13, renk: R.soluk });
      s += S.yazi(392, 410, '1.062 gözlenmiş düşüş · şematik', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d43 · bölüm 12: enerji (kiloton, logaritmik) ve sıklık. Chicxulub: 10²³–10²⁵ J ÷ 4,18 × 10¹² J/kt. */
  C.ekle('d43-siklik', {
    ders: 'd43', bolum: 12, oran: 0.92,
    baslik: 'Büyüdükçe seyrekleşir: gökten gelenlerin enerjisi ve sıklığı',
    aciklama: 'Yatay eksen açığa çıkan enerjidir, kiloton TNT cinsinden ve logaritmik: her çentik on kat değil bin kat demektir. Her satır bir sıklıktır ve aşağı indikçe olaylar seyrekleşir. Yaklaşık 5 kilotonluk havada patlamalar yılda bir kez olur; bu, Hiroşima bombasının üçte biri kadardır. Yaklaşık 20 metrelik Çelyabinsk taşı yaklaşık 500 kilotonla ortalama 60 yılda bir beklenir; kısa yatay çizgi başka tahminlerin 200 ile 500 kiloton arasında olduğunu gösterir. Tunguska ölçeğindeki olaylar 3 ile 30 megaton arasındadır ve 300 ile 1.000 yılda bir olur. Chicxulub\'u açan yaklaşık 10 kilometrelik cisim 10 üzeri 23 ile 10 üzeri 25 joule, yani 24 milyar ile 2,4 trilyon kiloton arası enerji taşıyordu; böyle bir olay insanlık tarihinde hiç yaşanmadı. İlk üç olayda cisim havada patlar, sonuncusunda yere çarpar.',
    kaynak: [KAYNAK.celyabinsk, KAYNAK.tunguska, KAYNAK.chicxulub, KAYNAK.meteorNasa],
    ciz(S) {
      const R = S.R, KT = 4.18e12;
      const ek = S.eksen({ x: 14, y: 40, w: 372, h: 256 }, { x0: 1, x1: 1e13, y0: 0, y1: 1 }, {
        logX: true,
        xIsaret: [[1, '1'], [1e3, '10³'], [1e6, '10⁶'], [1e9, '10⁹'], [1e12, '10¹²']],
        xAd: 'enerji (kiloton TNT, logaritmik)'
      });
      const X = ek.X;
      let s = ek.svg.replace(/<line[^>]*x1="14" y1="40"[^>]*\/>/, '');
      [1e3, 1e6, 1e9, 1e12].forEach(v => { s += S.cizgi(X(v), 40, X(v), 296, { renk: R.cizgi, kalin: 1, kesik: '2 4' }); });
      /* Hiroşima: 500 kt ÷ 30 (ders: Çelyabinsk ≈ Hiroşima'nın 30 katı) */
      const hir = 500 / 30;
      s += S.cizgi(X(hir), 36, X(hir), 46, { renk: R.soluk, kalin: 1.4, kesik: '6 3' }) + S.cizgi(X(hir), 92, X(hir), 296, { renk: R.soluk, kalin: 1.4, kesik: '6 3' });
      s += S.yazi(X(hir) + 4, 30, 'Hiroşima ≈' + tr(hir) + ' kt', { boy: 13, renk: R.soluk });
      const satir = (y, e1, e2, ad, sik, alt, sekil) => {
        const x1 = X(e1), x2 = Math.max(X(e2), x1 + 10);
        let o = S.kutu(x1, y - 9, x2 - x1, 18, sekil === 'yer' ? { dolgu: R.uyari, renk: R.metin, kalin: 1.2 } : { renk: R.metin, kalin: 2 }, 4);
        const sag = x2 < 250, tx = sag ? x2 + 8 : x1 - 8, h = sag ? 'start' : 'end';
        o += S.yazi(tx, y - 2, ad, { boy: 13, hiza: h, renk: R.metin, kalin: true });
        o += S.yazi(tx, y + 15, sik, { boy: 13, hiza: h, renk: R.vurgu, kalin: true });
        if (alt) o += S.yazi(tx, y + 31, alt, { boy: 13, hiza: h, renk: R.soluk });
        return o;
      };
      s += satir(64, 4, 6, 'havada patlama ≈5 kt', 'yılda bir', '');
      /* Çelyabinsk: ≈500 kt, başka tahminler 200–470 kt */
      s += S.cizgi(X(200), 128, X(500), 128, { renk: R.metin, kalin: 1.4 }) + S.cizgi(X(200), 123, X(200), 133, { renk: R.metin, kalin: 1.4 });
      s += satir(128, 450, 550, 'Çelyabinsk ≈20 m', '60 yılda bir', '≈500 kt');
      s += satir(192, 3000, 30000, 'Tunguska', '300–1.000 yılda bir', '3–30 Mt');
      s += satir(256, 1e23 / KT, 1e25 / KT, 'Chicxulub ≈10 km', 'insanlık hiç görmedi', '10²³–10²⁵ J', 'yer');
      s += S.ok(24, 70, 24, 262, { renk: R.soluk, kalin: 1.5, boy: 8 });
      s += S.yazi(30, 166, 'daha seyrek', { boy: 13, renk: R.soluk, yan: 90 });
      s += S.yazi(392, 360, 'açık kutu: havada patlar · dolu: yere çarpar', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });
})();
