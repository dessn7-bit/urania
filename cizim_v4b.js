/* cizim_v4b.js — fizik ünitesi ders çizimleri (d25, d26). cizim.js kayıtları.
   Dersler: d25 (özel görelilik), d26 (genel görelilik). Sayılar ders metninden (arastirma/dersler_v2/d25.json, d26.json;
   kendi kaynakları dNN_kaynak.md'de) gelir ya da burada derste yazılı formülle hesaplanır.
   Her değerin kaynağı: arastirma/cizim_v4b_kaynak.md. */
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
  const gama = b => 1 / Math.sqrt(1 - b * b);       // Lorentz çarpanı, b = v / c
  const KAYNAK = {
    zamanGen: { ad: 'Wikipedia: Time dilation', url: 'https://en.wikipedia.org/wiki/Time_dilation' },
    lorentz: { ad: 'Wikipedia: Lorentz factor', url: 'https://en.wikipedia.org/wiki/Lorentz_factor' },
    parker: { ad: 'JHUAPL: Parker Solar Probe en yakın geçişi', url: 'https://www.jhuapl.edu/news/news-releases/241227-parker-closest-approach' },
    ikizler: { ad: 'Wikipedia: Twin paradox', url: 'https://en.wikipedia.org/wiki/Twin_paradox' },
    minkowski: { ad: 'Wikisource: Minkowski, Space and Time', url: 'https://en.wikisource.org/wiki/Translation:Space_and_Time' },
    elma: { ad: 'arXiv 0903.3768: Einstein\'s Apple', url: 'https://arxiv.org/pdf/0903.3768' },
    mikroG: { ad: 'NASA: What Is Microgravity?', url: 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-grades-5-8/' },
    gr: { ad: 'Wikipedia (arşiv): Tests of general relativity', url: 'https://webarchive.library.unt.edu/web/20141206100325/http://en.wikipedia.org/wiki/Tests_of_general_relativity' },
    caltech: { ad: 'Caltech Einstein Papers Project: Merkür\'ün açıklaması', url: 'https://einstein.caltech.edu/news/one-hundred-years-of-einsteins-field-equations-and-of-the-explanation-of-mercurys-perihelion' },
    merkur: { ad: 'NASA Mercury Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html' },
    gps: { ad: 'Wikipedia: Error analysis for the GPS', url: 'https://en.wikipedia.org/wiki/Error_analysis_for_the_Global_Positioning_System' }
  };

  /* ================================================================ d25 ================================================================ */

  /* d25 · bölüm 5: ışık saati. Dersin örneği: aynalar 3 m arayla, tren 0,6 c, c ≈ 3 × 10⁸ m/s. Ölçekli: 1 m = 40 birim. */
  C.ekle('d25-isik-saati', {
    ders: 'd25', bolum: 5, oran: 0.84,
    baslik: 'Işık saati: hareket eden saat yavaş tıklar',
    aciklama: 'Solda saat trendeki yolcunun gözünden: ışık atımı 3 metre arayla duran iki ayna arasında dimdik gider ve üst aynaya 10 nanosaniyede varır. Sağda aynı saat raydan bakan birinin gözünden, tren ışık hızının yüzde 60\'ıyla sağa giderken. Atım üst aynaya varana kadar tren 2,25 metre ilerlemiştir, bu yüzden ışık eğik ve 3,75 metrelik bir yol izler: dik üçgende 3 ile 2,25\'ten Pisagor 3,75 verir. Işık herkes için aynı hızla gittiğine göre bu yol 12,5 nanosaniye sürer. 12,5 bölü 10, yani 1,25, tam da bu hızın Lorentz çarpanıdır. Uzunluklar ölçeklidir.',
    kaynak: [KAYNAK.zamanGen],
    ciz(S) {
      const R = S.R, m = 40, L = 3, b = 0.6;                    // 1 m = 40 birim
      const ct = L / Math.sqrt(1 - b * b), ilerle = b * ct;     // ışığın eğik yolu (m) ve trenin ilerlemesi (m)
      const t0 = L / 3e8 * 1e9, t1 = ct / 3e8 * 1e9;            // ns (c ≈ 3 × 10⁸ m/s, dersteki gibi)
      const ya = 70, yu = ya + L * m;                           // üst ayna, alt ayna
      const ayna = (x, sol) => S.cizgi(x - 20, ya, x + 20, ya, { renk: R.metin, kalin: 4, uc: 'round', saydam: sol }) + S.cizgi(x - 20, yu, x + 20, yu, { renk: R.metin, kalin: 4, uc: 'round', saydam: sol }) +
        S.cizgi(x - 20, ya, x - 20, yu, { renk: R.soluk, kalin: 1, kesik: '3 4', saydam: sol }) + S.cizgi(x + 20, ya, x + 20, yu, { renk: R.soluk, kalin: 1, kesik: '3 4', saydam: sol });
      let s = '';
      /* sol: trende */
      const xs = 52;
      s += S.yazi(8, 20, 'Trende', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(8, 38, 'yolcunun gözü', { boy: 13, renk: R.soluk });
      s += ayna(xs, 1);
      s += S.ok(xs, yu - 3, xs, ya + 4, { renk: R.vurgu, kalin: 2.4, boy: 9 });
      s += S.yazi(xs + 26, (ya + yu) / 2 + 5, tr(L) + ' m', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(xs, yu + 22, tr(t0, 0) + ' ns', { boy: 14, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.cizgi(112, 14, 112, yu + 30, { renk: R.cizgi, kalin: 1 });
      /* sağ: raydan */
      const x1 = 176, x2 = x1 + ilerle * m, x3 = x2 + ilerle * m;
      s += S.yazi(124, 20, 'Raydan bakınca', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(124, 38, 'tren ışık hızının %60\'ıyla sağa', { boy: 13, renk: R.soluk });
      s += ayna(x1, 0.45) + ayna(x2, 1) + ayna(x3, 0.45);
      s += S.yazi(x1, ya - 10, '0 ns', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(x2, ya - 10, tr(t1, 1) + ' ns', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(x3, ya - 10, tr(2 * t1, 0) + ' ns', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* dik üçgen: taban = trenin ilerlemesi, dik kenar = 3 m, hipotenüs = ışığın yolu */
      s += S.cizgi(x1, yu, x2, yu, { renk: R.soluk, kalin: 1.6, kesik: '6 4' });
      s += S.cizgi(x2, yu, x2, ya, { renk: R.soluk, kalin: 1.2, kesik: '2 3' });
      s += S.yol(`M${x2 - 9},${yu} L${x2 - 9},${yu - 9} L${x2},${yu - 9}`, { renk: R.soluk, kalin: 1 });
      s += S.ok(x1 + 2, yu - 3, x2 - 2, ya + 4, { renk: R.vurgu, kalin: 2.4, boy: 9 });
      s += S.ok(x2 + 2, ya + 4, x3 - 2, yu - 3, { renk: R.vurgu, kalin: 2.4, boy: 9, saydam: 0.5 });
      s += S.zeminliYazi(x1 + (x2 - x1) * 0.42 - 8, ya + (yu - ya) * 0.48, tr(ct, 2) + ' m', { boy: 14, hiza: 'end', renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(x2 - 6, (ya + yu) / 2 + 26, tr(L) + ' m', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi((x1 + x2) / 2, yu + 20, tr(ilerle, 2) + ' m', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.ok(x3 - 50, yu + 18, x3 + 14, yu + 18, { renk: R.soluk, kalin: 1.6, boy: 7 });
      s += S.yazi(x3 - 56, yu + 23, 'tren', { boy: 13, hiza: 'end', renk: R.soluk });
      /* hesap */
      const hy = yu + 56;
      s += S.yazi(8, hy, 'Pisagor: ' + tr(ct, 2) + '² = ' + tr(L) + '² + ' + tr(ilerle, 2) + '²', { boy: 13, renk: R.metin });
      s += S.yazi(8, hy + 20, 'yolcu: ' + tr(L) + ' m ÷ c = ' + tr(t0, 0) + ' ns', { boy: 13, renk: R.metin });
      s += S.yazi(8, hy + 40, 'ray: ' + tr(ct, 2) + ' m ÷ c = ' + tr(t1, 1) + ' ns', { boy: 13, renk: R.metin });
      s += S.yazi(8, hy + 62, tr(t1, 1) + ' ÷ ' + tr(t0, 0) + ' = ' + tr(t1 / t0, 2) + ' = γ  (v = 0,6 c)', { boy: 14, renk: R.vurgu, kalin: true });
      s += S.yazi(392, hy + 62, 'c ≈ 3 × 10⁸ m/s', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d25 · bölüm 6: Lorentz çarpanının eğrisi γ = 1 / √(1 − v²/c²); işaretli noktalar dersteki tablodan (hepsi formülle sınandı). */
  C.ekle('d25-lorentz-egrisi', {
    ders: 'd25', bolum: 6, oran: 0.82,
    baslik: 'Lorentz çarpanı: ışık hızına yaklaşınca birden yükselir',
    aciklama: 'Yatay eksen hızın ışık hızına oranı, dikey eksen Lorentz çarpanı, yani hareket eden saatin kaç kat yavaş işlediği. Eğri yolun büyük kısmında 1\'e yapışık gider: ışık hızının yüzde 10\'unda 1,005, yarısında yalnızca 1,155. Yüzde 86,6\'da 2\'ye çıkar, yüzde 90\'da 2,29\'dur; sonra neredeyse dikleşir: yüzde 99\'da 7,09, yüzde 99,5\'te 10. Yüzde 99,99\'daki 70,7 grafiğin çok üstünde kalır. Sağdaki kesikli çizgi ışık hızıdır; eğri ona hiç değmez. Sol üstteki gündelik örneklerde çarpanın 1\'den farkı en fazla on milyonda iki kadardır.',
    kaynak: [KAYNAK.lorentz, KAYNAK.zamanGen, KAYNAK.parker],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 52, y: 22, w: 316, h: 230 }, { x0: 0, x1: 1, y0: 1, y1: 10.6 }, {
        xIsaret: [[0, '0'], [0.2, '0,2'], [0.4, '0,4'], [0.6, '0,6'], [0.8, '0,8'], [1, '1']],
        yIsaret: [[1, '1'], [2, '2'], [4, '4'], [6, '6'], [8, '8'], [10, '10']],
        xAd: 'hız ÷ ışık hızı'
      });
      let s = ek.svg + S.yazi(12, ek.Y(5.5), 'γ', { boy: 18, renk: R.soluk, kalin: true });
      [2, 4, 6, 8, 10].forEach(v => s += S.cizgi(52, ek.Y(v), 368, ek.Y(v), { renk: R.cizgi, kalin: 0.8 }));
      /* ışık hızı */
      s += S.cizgi(ek.X(1), ek.Y(10.6), ek.X(1), ek.Y(1), { renk: R.soluk, kalin: 1.4, kesik: '5 4' });
      /* eğri: c'ye yaklaştıkça sık örnek */
      const ls = [];
      for (let i = 0; i <= 120; i++) { const b = i / 120 * 0.9; ls.push([ek.X(b), ek.Y(gama(b))]); }
      for (let i = 1; i <= 60; i++) { const b = 0.9 + (0.99556 - 0.9) * i / 60; ls.push([ek.X(b), ek.Y(gama(b))]); }
      s += S.egri(ls, { renk: R.vurgu, kalin: 2.6 });
      /* tablo noktaları: [v/c, etiket, etiket x, etiket y, hiza] */
      const nk = [
        [0.1, '%10: 1,005', ek.X(0.1) - 4, ek.Y(1) - 14, 'start'],
        [0.5, '%50: 1,155', ek.X(0.5) - 24, ek.Y(1) - 22, 'start'],
        [0.866, '%86,6: 2', ek.X(0.8) - 4, ek.Y(2.75), 'end'],
        [0.9, '%90: 2,29', ek.X(0.8) - 4, ek.Y(3.6), 'end'],
        [0.99, '%99: 7,09', ek.X(0.99) - 14, ek.Y(gama(0.99)) + 5, 'end'],
        [0.995, '%99,5: 10', ek.X(0.995) - 14, ek.Y(gama(0.995)) + 5, 'end']
      ];
      nk.forEach(([b, t, lx, ly, h]) => {
        if (b > 0.8 && b < 0.95) s += S.cizgi(lx + 3, ly - 5, ek.X(b) - 4, ek.Y(gama(b)) - 3, { renk: R.soluk, kalin: 1 });
        s += S.daire(ek.X(b), ek.Y(gama(b)), 4.5, { dolgu: R.metin, renk: R.zemin, kalin: 1.2 });
        s += S.zeminliYazi(lx, ly, t, { boy: 13, hiza: h, renk: R.metin, kalin: true });
      });
      /* %99,99 grafiğin üstünde */
      s += S.zeminliYazi(ek.X(1) - 6, 14, '%99,99: 70,7 ↑', { boy: 13, hiza: 'end', renk: R.vurgu });
      s += S.zeminliYazi(ek.X(0.8) - 4, ek.Y(5.6), 'ışık hızı: erişilmez', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.ok(ek.X(0.8), ek.Y(5.6) - 5, ek.X(1) - 3, ek.Y(5.6) - 5, { renk: R.soluk, kalin: 1.2, boy: 6 });
      /* gündelik hızlar: γ − 1 ≈ v² / (2c²) */
      const c = 299792458, ucak = 250 * 250 / (2 * c * c), park = 192e3 * 192e3 / (2 * c * c);
      s += S.yazi(64, 56, 'Gündelik hızlarda γ − 1:', { boy: 13, renk: R.soluk });
      s += S.yazi(64, 76, 'yolcu uçağı ≈ ' + tr(ucak * 1e13, 1) + ' × 10⁻¹³', { boy: 13, renk: R.metin });
      s += S.yazi(64, 96, 'Parker sondası ≈ ' + tr(park * 1e7, 0) + ' × 10⁻⁷', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* d25 · bölüm 10: ikizler paradoksu uzay-zaman çizgesinde. Dersin örneği: 4 ışık yılı, %80 hız. Birimler yıl ve ışık yılı;
     iki eksen aynı ölçekte (1 birim = 26), ışık 45° gider. */
  C.ekle('d25-ikizler', {
    ders: 'd25', bolum: 10, oran: 0.86,
    baslik: 'İkizler uzay-zamanda: dolambaçlı yol, daha az zaman',
    aciklama: 'Bu bir uzay-zaman çizgesidir: yukarısı zaman, yatay uzaklık; ışık yılı ve yıl aynı ölçekte olduğu için ışık 45 derecelik kesikli çizgide gider. Ayşe İstanbul\'da kalır, dünya çizgisi dümdüz yukarı çıkar; her nokta onun saatinde bir yıldır ve Can döndüğünde 10 yıl geçmiştir. Can ışık hızının yüzde 80\'iyle 4 ışık yılı ötedeki yıldıza gidip döner. Kâğıtta onun yolu daha uzun görünür, ama uzay-zamanda süre, sürenin karesinden uzaklığın karesi çıkarılıp karekök alınarak bulunur: her bacak için 25 eksi 16\'nın karekökü, 3 yıl. Can\'ın saatinde toplam 6 yıl geçer; döndüğünde kardeşinden 4 yaş küçüktür.',
    kaynak: [KAYNAK.ikizler, KAYNAK.minkowski],
    ciz(S) {
      const R = S.R, k = 26, ox = 64, oy = 300;               // 1 yıl = 1 ışık yılı = 26 birim
      const P = (x, t) => [ox + x * k, oy - t * k];
      let s = '';
      /* eksenler */
      s += S.ok(ox, oy, ox, P(0, 10.9)[1], { renk: R.soluk, kalin: 1, boy: 7 }) + S.ok(ox, oy, P(5.6, 0)[0], oy, { renk: R.soluk, kalin: 1, boy: 7 });
      s += S.yazi(ox + 10, 16, 'zaman (yıl)', { boy: 13, renk: R.soluk });
      [0, 5, 10].forEach(t => s += S.yazi(ox - 8, P(0, t)[1] + 5, tr(t), { boy: 13, hiza: 'end', renk: R.soluk }));
      [2, 4].forEach(x => s += S.cizgi(P(x, 0)[0], oy, P(x, 0)[0], oy + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(P(x, 0)[0], oy + 20, tr(x), { boy: 13, hiza: 'middle', renk: R.soluk }));
      s += S.yazi(ox, oy + 38, 'uzaklık (ışık yılı)', { boy: 13, renk: R.soluk });
      /* yıldızın dünya çizgisi ve ışık */
      s += S.cizgi(P(4, 0)[0], oy, P(4, 0)[0], P(4, 10.6)[1], { renk: R.cizgi, kalin: 1, kesik: '2 4' });
      s += S.yazi(P(4, 0)[0], P(4, 10.6)[1] - 4, 'yıldız', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.cizgi(ox, oy, P(4.7, 4.7)[0], P(4.7, 4.7)[1], { renk: R.gunes, kalin: 1.4, kesik: '6 4' });
      s += S.zeminliYazi(P(4.7, 4.7)[0] + 6, P(4.7, 4.7)[1] + 8, 'ışık', { boy: 13, renk: R.gunes });
      /* Ayşe: dümdüz, her yıl bir nokta */
      s += S.cizgi(ox, oy, ox, P(0, 10)[1], { renk: R.mavi, kalin: 3.5 });
      for (let t = 1; t <= 10; t++) s += S.daire(ox, P(0, t)[1], 3.2, { dolgu: R.zemin, renk: R.mavi, kalin: 1.6 });
      /* Can: gidiş ve dönüş, kendi saatinde her yıl bir çentik (her bacak 3 yıl) */
      const A = P(0, 0), D = P(4, 5), B = P(0, 10);
      s += S.yol(`M${A[0]},${A[1]} L${D[0]},${D[1]} L${B[0]},${B[1]}`, { renk: R.vurgu, kalin: 3.5 });
      [[A, D], [D, B]].forEach(([p, q]) => {
        for (let i = 1; i <= 3; i++) {
          const x = p[0] + (q[0] - p[0]) * i / 3, y = p[1] + (q[1] - p[1]) * i / 3;
          s += S.kutu(x - 4.5, y - 4.5, 9, 9, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 });
        }
      });
      s += S.zeminliYazi(D[0] + 10, D[1] - 6, 'dönüş', { boy: 13, renk: R.metin });
      /* etiketler */
      s += S.yazi(ox + 12, P(0, 10)[1] + 5, 'buluşma', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(ox - 10, P(0, 7.5)[1] + 5, 'Ayşe', { boy: 13, hiza: 'end', renk: R.mavi, kalin: true });
      s += S.yazi(P(1.3, 4.2)[0], P(1.3, 4.2)[1], 'Can', { boy: 13, renk: R.vurgu, kalin: true });
      /* açıklama sütunu */
      const hx = 226;
      s += S.daire(hx + 5, 48, 4, { dolgu: R.zemin, renk: R.mavi, kalin: 1.6 }) + S.yazi(hx + 16, 53, 'Ayşe evde: 10 yıl', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(hx + 16, 71, 'her nokta 1 yıl', { boy: 13, renk: R.soluk });
      s += S.kutu(hx + 0.5, 92.5, 9, 9, { dolgu: R.vurgu, renk: 'none' }) + S.yazi(hx + 16, 102, 'Can, %80 hız: 6 yıl', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(hx + 16, 120, 'her kare 1 yıl', { boy: 13, renk: R.soluk });
      s += S.yazi(hx, 200, 'Can\'ın her bacağı:', { boy: 13, renk: R.metin });
      s += S.yazi(hx, 219, '5 yıl, 4 ışık yılı', { boy: 13, renk: R.metin });
      s += S.yazi(hx, 240, '√(5² − 4²) = 3 yıl', { boy: 14, renk: R.vurgu, kalin: true });
      s += S.yazi(hx, 274, 'kâğıtta uzun yol,', { boy: 13, renk: R.soluk });
      s += S.yazi(hx, 292, 'saatte kısa süre', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d26 ================================================================ */

  /* d26 · bölüm 2: eşdeğerlik ilkesi. Şematik; 9,8 m/s² ve gelgit dipnotu ders metninden. */
  C.ekle('d26-asansor', {
    ders: 'd26', bolum: 2, oran: 0.92,
    baslik: 'Penceresiz asansör: Dünya\'da durmak ile uzayda hızlanmak',
    aciklama: 'Solda asansör Dünya\'nın yüzeyinde duruyor ve kütleçekimi her şeyi aşağı çekiyor. Sağda aynı asansör derin uzayda, bir roketle her saniye hızı saniyede 9,8 metre artacak biçimde yukarı hızlanıyor. İçerideki kişi iki durumda da zeminin ayağını ittiğini hisseder; bıraktığı top iki durumda da aynı biçimde, her an biraz daha hızlanarak yere iner. Topun art arda konumları aralıklar büyüyerek çizildi. İçeriden yapılacak hiçbir deney ikisini ayıramaz: buna eşdeğerlik ilkesi denir. Kayıt şudur: bu yalnızca küçük bir bölgede geçerlidir. Dünya\'ya düşen 2 metrelik bir asansörde iki top 10 saniyede yaklaşık 0,3 milimetre ayrılır; bu gelgit farkı silinemez. Çizim şematiktir.',
    kaynak: [KAYNAK.elma, KAYNAK.mikroG],
    ciz(S) {
      const R = S.R, w = 120, h = 176, yk = 46;
      const kabin = x => {
        let o = S.kutu(x, yk, w, h, { dolgu: R.yuzey2, renk: R.metin, kalin: 2.2 }, 4);
        /* kişi: çöp adam, zeminde */
        const px = x + 36, zy = yk + h;
        o += S.daire(px, zy - 92, 10, { renk: R.metin, kalin: 2 });
        o += S.cizgi(px, zy - 82, px, zy - 42, { renk: R.metin, kalin: 2 });
        o += S.cizgi(px, zy - 42, px - 12, zy - 2, { renk: R.metin, kalin: 2 }) + S.cizgi(px, zy - 42, px + 12, zy - 2, { renk: R.metin, kalin: 2 });
        o += S.cizgi(px, zy - 72, px - 16, zy - 50, { renk: R.metin, kalin: 2 }) + S.cizgi(px, zy - 72, px + 32, zy - 78, { renk: R.metin, kalin: 2 });
        /* top: eşit zaman aralıklarında art arda konumlar; yol 0 : 1 : 4 */
        const tx = px + 46, ty0 = zy - 78, dus = 72;
        [0, 1, 4].forEach((k, i) => {
          const yy = ty0 + dus * k / 4;
          o += S.daire(tx, yy, 6, i === 2 ? { dolgu: R.vurgu, renk: 'none' } : { renk: R.vurgu, kalin: 1.4, kesik: '2 2' });
        });
        return o;
      };
      let s = '';
      const xl = 10, xr = 270;
      /* sol: Dünya'da */
      s += S.yazi(xl + w / 2, 22, 'Dünya\'da duruyor', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      s += kabin(xl);
      s += S.kutu(0, yk + h, 150, 34, { dolgu: R.mavi, renk: 'none', saydam: 0.35 });
      s += S.cizgi(0, yk + h, 150, yk + h, { renk: R.mavi, kalin: 2 });
      s += S.yazi(xl + w / 2, yk + h + 54, 'Dünya\'nın yüzeyi', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.ok(142, yk + 24, 142, yk + 96, { renk: R.soluk, kalin: 2, boy: 8 });
      s += S.yazi(150, yk + 48, 'çekim', { boy: 13, renk: R.soluk });
      s += S.yazi(150, yk + 66, '9,8 m/s²', { boy: 13, renk: R.soluk });
      /* sağ: uzayda hızlanıyor */
      s += S.yazi(xr + w / 2, 22, 'Uzayda hızlanıyor', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      [[262, 64], [396, 92], [396, 200], [282, 262], [384, 268], [300, 288]].forEach(([x, y]) => s += S.daire(x, y, 1.6, { dolgu: R.yildiz, renk: 'none' }));
      s += kabin(xr);
      /* roket alevi: iç içe iki üçgen */
      const ax = xr + w / 2, ay = yk + h;
      s += S.yol(`M${ax - 30},${ay} L${ax},${ay + 44} L${ax + 30},${ay} Z`, { renk: R.gunes, kalin: 1.6, dolgu: R.vurguSoluk });
      s += S.yol(`M${ax - 14},${ay} L${ax},${ay + 26} L${ax + 14},${ay} Z`, { renk: R.gunes, kalin: 1.2, dolgu: R.gunes });
      s += S.yazi(ax, ay + 62, 'roket', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.ok(258, yk + 170, 258, yk + 100, { renk: R.soluk, kalin: 2, boy: 8 });
      s += S.yazi(250, yk + 146, 'ivme', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(250, yk + 164, '9,8 m/s²', { boy: 13, hiza: 'end', renk: R.soluk });
      /* orta: eşittir */
      s += S.yazi(200, yk + 116, '=', { boy: 30, hiza: 'middle', renk: R.vurgu, kalin: true });
      /* alt: sonuç ve kayıt */
      const hy = 318;
      s += S.yazi(200, hy, 'İçeriden hiçbir deney ikisini ayıramaz.', { boy: 14, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(200, hy + 22, 'Kayıt: küçük bölgede. 2 m\'lik düşen asansörde', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(200, hy + 40, 'iki top 10 s\'de ≈ 0,3 mm ayrılır: gelgit.', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d26 · bölüm 7: Merkür'ün günberi kayması. Üst: yörünge ve kayma şematik (abartılı). Alt: yüzyıllık bütçe ölçekli. */
  C.ekle('d26-merkur', {
    ders: 'd26', bolum: 7, oran: 0.98,
    baslik: 'Merkür\'ün günberisi kayıyor: 43 yay saniyelik açık',
    aciklama: 'Üstte Merkür\'ün yörüngesi şematik: Güneş\'e en yakın nokta olan günberi her turda biraz ileri kayar, elips yavaşça döner. Çizimde hem basıklık hem dönüş açısı okunsun diye çok abartıldı; gerçekte göreli kayma tur başına yalnızca yaklaşık 0,1 yay saniyesidir ve tek başına günberiyi yaklaşık 3 milyon yılda bir tam tur döndürür. Alttaki çubuk ölçeklidir: gözlenen kayma yüzyılda 574,10 yay saniyesi. Bunun 531,63\'ünü diğer gezegenlerin çekimi açıklar. Geriye kalan yaklaşık 43 yay saniyesini Le Verrier\'in aradığı Vulkan gezegeni değil, Einstein\'ın Kasım 1915\'teki genel görelilik hesabı açıkladı; bugünkü hesap 42,98 verir ve ölçüm belirsizlikleri içinde kalana uyar.',
    kaynak: [KAYNAK.gr, KAYNAK.caltech, KAYNAK.merkur],
    ciz(S) {
      const R = S.R, gx = 200, gy = 150, a = 84, e = 0.55;           // şematik yörünge: a ve e abartılı
      const c = a * e, b = a * Math.sqrt(1 - e * e);
      let s = '';
      /* üç tur: günberi yönü 200°, 225°, 250° (matematik yönü; çizimde abartılı adımlar) */
      const yonler = [190, 225, 260];
      yonler.forEach((y, i) => {
        const ux = Math.cos(y * rad), uy = -Math.sin(y * rad);
        const mx = gx - ux * c, my = gy - uy * c;                      // elips merkezi: günberinin tersi yönde
        const svgAci = Math.atan2(uy, ux) / rad;
        s += S.elips(mx, my, a, b, { renk: i === 2 ? R.metin : R.soluk, kalin: i === 2 ? 2 : 1.3, kesik: i === 2 ? null : (i === 0 ? '2 4' : '6 4') }, n2(svgAci));
        const px = gx + ux * (a - c), py = gy + uy * (a - c);
        s += S.cizgi(gx, gy, px, py, { renk: R.vurgu, kalin: 1, kesik: '3 3' });
        s += S.daire(px, py, 5, { dolgu: i === 2 ? R.vurgu : R.zemin, renk: R.vurgu, kalin: 1.6 });
      });
      /* günberinin ilerleme oku */
      s += S.yay(gx, gy, (a - c) + 22, 192, 256, { renk: R.vurgu, kalin: 2 });
      { const t = 260 * rad, r = (a - c) + 22, p = [gx + r * Math.cos(t), gy - r * Math.sin(t)], q = [gx + r * Math.cos(t - 0.12), gy - r * Math.sin(t - 0.12)];
        s += S.ok(q[0], q[1], p[0], p[1], { renk: R.vurgu, kalin: 2, boy: 8 }); }
      s += S.daire(gx, gy, 11, { dolgu: R.gunes, renk: 'none' });
      s += S.zeminliYazi(gx + 16, gy - 6, 'Güneş', { boy: 13, renk: R.metin, kalin: true });
      { const t = 190 * rad, r = a - c; s += S.zeminliYazi(gx + r * Math.cos(t) - 12, gy - r * Math.sin(t) + 5, 'günberi', { boy: 13, hiza: 'end', renk: R.vurgu, kalin: true }); }
      s += S.yazi(8, 20, 'günberi her turda', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(8, 38, 'ileri kayar', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(8, 214, 'şematik, çok abartılı;', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 232, 'gerçekte tur başına ≈ 0,1″', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 250, 'tam tur: ≈ 3 milyon yıl', { boy: 13, renk: R.soluk });
      /* alt: yüzyıllık bütçe (ölçekli) */
      const x0 = 16, w = 368, top = 574.10, gez = 531.63, gr = 42.98, X = v => x0 + v / top * w, by = 294, bh = 30;
      s += S.yazi(x0, by - 14, 'Yüzyılda kayma: ' + tr(top, 2) + '″ (gözlenen, ölçekli)', { boy: 13, renk: R.metin, kalin: true });
      s += S.kutu(x0, by, X(gez) - x0, bh, { dolgu: R.yuzey2, renk: R.metin, kalin: 1.2 });
      s += S.kutu(X(gez), by, X(top) - X(gez), bh, { dolgu: R.vurgu, renk: R.metin, kalin: 1.2 });
      s += S.yazi(x0 + 10, by + 20, 'diğer gezegenler: ' + tr(gez, 2) + '″', { boy: 13, renk: R.metin });
      s += S.cizgi(X(gez) + (X(top) - X(gez)) / 2, by + bh, X(gez) + (X(top) - X(gez)) / 2, by + bh + 14, { renk: R.vurgu, kalin: 1.4 });
      s += S.yazi(X(top), by + bh + 30, 'kalan ≈ 43″, genel görelilik: ' + tr(gr, 2) + '″', { boy: 14, hiza: 'end', renk: R.vurgu, kalin: true });
      s += S.yazi(X(top), by + bh + 48, 'Le Verrier 1859: ≈ 38″, Vulkan aranır', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });
  function n2(x) { return Math.round(x * 100) / 100; }

  /* d26 · bölüm 11: GPS uydu saatinin günlük farkı (μs). Değerler ders metninden; ölçekli şelale grafiği. */
  C.ekle('d26-gps', {
    ders: 'd26', bolum: 11, oran: 0.86,
    baslik: 'GPS uydusunun saati: iki göreli etki, bir net fark',
    aciklama: 'Çubuklar bir GPS uydusunun saatinin yerdeki saate göre bir günde ne kadar kaydığını mikrosaniye olarak gösterir ve ölçeklidir. Yükseklik etkisi, yani genel görelilik, saati günde 45,85 mikrosaniye ileri götürür. Hız etkisi, yani özel görelilik, 7,21 mikrosaniye geri çeker; bu çubuk aşağı doğru, taralı çizildi. Net sonuç günde 38,64 mikrosaniye ileri. Işık bu sürede yaklaşık 11,6 kilometre yol alır; düzeltilmeseydi konum hatası her gün kabaca 11 kilometre büyürdü. Bu yüzden uydu saatleri fabrikada 10,23 megahertz yerine 10,22999999543 megahertz\'e ayarlanır.',
    kaynak: [KAYNAK.gps],
    ciz(S) {
      const R = S.R, gr = 45.85, sr = 7.21, net = gr - sr;
      const ek = S.eksen({ x: 50, y: 30, w: 330, h: 200 }, { x0: 0, x1: 3, y0: 0, y1: 50 }, {
        yIsaret: [[0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40'], [50, '50']]
      });
      let s = ek.svg + S.yazi(8, 16, 'günlük fark (mikrosaniye, μs)', { boy: 13, renk: R.soluk });
      [10, 20, 30, 40, 50].forEach(v => s += S.cizgi(50, ek.Y(v), 380, ek.Y(v), { renk: R.cizgi, kalin: 0.8 }));
      const bw = 74, xs = i => ek.X(i + 0.5) - bw / 2;
      /* 1: yükseklik (+) */
      s += S.kutu(xs(0), ek.Y(gr), bw, ek.Y(0) - ek.Y(gr), { dolgu: R.vurgu, renk: R.metin, kalin: 1.2 }, 2);
      s += S.zeminliYazi(xs(0) + bw / 2, ek.Y(gr) - 8, '+' + tr(gr, 2), { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      /* 2: hız (−), yükseklik çubuğunun tepesinden aşağı; taralı */
      const y1 = ek.Y(gr), y2 = ek.Y(net), x2 = xs(1);
      s += S.kutu(x2, y1, bw, y2 - y1, { dolgu: R.yuzey2, renk: R.metin, kalin: 1.2 }, 2);
      for (let i = -2; i < 8; i++) {
        const xa = x2 + i * 12, xb = xa + (y2 - y1);
        const k1 = Math.max(xa, x2), k2 = Math.min(xb, x2 + bw);
        if (k2 > k1) s += S.cizgi(k1, y2 - (k1 - xa), k2, y2 - (k2 - xa), { renk: R.soluk, kalin: 1 });
      }
      s += S.cizgi(xs(0) + bw, y1, x2, y1, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.zeminliYazi(x2 + bw / 2, y1 - 8, '−' + tr(sr, 2), { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.ok(x2 + bw + 8, y1 + 2, x2 + bw + 8, y2, { renk: R.metin, kalin: 1.6, boy: 6 });
      /* 3: net (+) */
      s += S.cizgi(x2 + bw, y2, xs(2), y2, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.kutu(xs(2), y2, bw, ek.Y(0) - y2, { dolgu: R.iyi, renk: R.metin, kalin: 2 }, 2);
      s += S.zeminliYazi(xs(2) + bw / 2, y2 - 8, '+' + tr(net, 2), { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      /* sütun adları */
      [['yükseklik', 'genel görelilik'], ['hız', 'özel görelilik'], ['net', 'ileri']].forEach(([a, b], i) => {
        s += S.yazi(ek.X(i + 0.5), ek.Y(0) + 20, a, { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
        s += S.yazi(ek.X(i + 0.5), ek.Y(0) + 37, b, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      /* sonuç */
      const km = net * 1e-6 * 299792.458;
      s += S.yazi(8, 298, 'Işık ' + tr(net, 1) + ' μs\'de ≈ ' + tr(km, 1) + ' km yol alır:', { boy: 13, renk: R.metin });
      s += S.yazi(8, 316, 'düzeltilmese hata günde ≈ 11 km büyürdü.', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(8, 336, 'Fabrika ayarı: 10,23 yerine 10,22999999543 MHz', { boy: 13, renk: R.vurgu });
      return s;
    }
  });
})();
