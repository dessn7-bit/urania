/* cizim_v6.js — kuramlar ünitesi ders çizimleri (d50–d56). cizim.js kayıtları.
   Ölçülen şeyler önce: NGC 3198'in dönme eğrisi ve baryonik Tully–Fisher noktaları (SPARC veri dosyaları), DESI DR2'nin w(z) sonucu
   ve belirsizlik bandı (makaledeki w0, wa, pivot değerleriyle), Hawking sıcaklığı ve ömrü (ders formülleri), Planck ölçekleri,
   n_s–r düzlemi (Planck, ACT, BICEP/Keck), evrenin olası gelecekleri. Varsayımsal nesnelerin (beyaz delik, solucan deliği,
   çoklu evren, ek boyutlar) çizimleri kavramsal çizimdir ve alt yazıları bunu dersin kesinlik sözleriyle söyler.
   Her değerin kaynağı: arastirma/cizim_v6_kaynak.md. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti, binlik nokta */
  const tr = (x, d) => {
    const s = Math.abs(x).toFixed(d == null ? 0 : d).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 ? '−' : '') + s.join(',');
  };
  const USTK = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
  const on = e => '10' + String(e).replace(/./g, c => USTK[c] || c);
  const L10 = Math.log10;
  /* Kesinlik etiketi: ünitenin dört basamağı (ve "askıda") çizgi biçimiyle ayrılır; renge dayanmaz (kırmızı mod) */
  const KES = {
    kesin: { kalin: 2.4, kesik: null }, guclu: { kalin: 1.2, kesik: null }, kuram: { kalin: 1.5, kesik: '6 3' },
    askida: { kalin: 1.6, kesik: '2 3' }, spek: { kalin: 1.6, kesik: '9 3 2 3' }
  };
  const etiket = (S, x, y, metin, tur, o) => {
    o = o || {};
    const boy = o.boy || 13, w = metin.length * boy * 0.53 + 14;
    const x0 = o.hiza === 'end' ? x - w : o.hiza === 'middle' ? x - w / 2 : x;
    return S.kutu(x0, y - boy - 3, w, boy + 9, { dolgu: S.R.yuzey, renk: S.R.metin, kalin: KES[tur].kalin, kesik: KES[tur].kesik }, 5) +
      S.yazi(x0 + 7, y + 1, metin, { boy, renk: S.R.metin });
  };
  const nokta = ls => ls.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const cokgen = (ls, dolgu, saydam) => `<polygon points="${nokta(ls)}" fill="${dolgu}" opacity="${saydam}"/>`;

  const KAYNAK = {
    sparc: { ad: 'SPARC veri tabanı (Lelli, McGaugh, Schombert)', url: 'https://astroweb.case.edu/SPARC/' },
    lelli2016: { ad: 'Lelli ve ark. 2016, SPARC (arXiv:1606.09251)', url: 'https://arxiv.org/abs/1606.09251' },
    btfr: { ad: 'Lelli, McGaugh, Schombert 2016, baryonik Tully–Fisher (ApJ 816, L14)', url: 'https://ui.adsabs.harvard.edu/abs/2016ApJ...816L..14L/abstract' },
    rotWiki: { ad: 'Wikipedia: Galaxy rotation curve', url: 'https://en.wikipedia.org/wiki/Galaxy_rotation_curve' },
    mond: { ad: 'Wikipedia: Modified Newtonian dynamics', url: 'https://en.wikipedia.org/wiki/Modified_Newtonian_dynamics' },
    axion: { ad: 'Wikipedia: Axion', url: 'https://en.wikipedia.org/wiki/Axion' },
    admx: { ad: 'ADMX 2025 (arXiv:2504.07279)', url: 'https://arxiv.org/html/2504.07279v2' },
    wimp: { ad: 'Wikipedia: Weakly interacting massive particle', url: 'https://en.wikipedia.org/wiki/Weakly_interacting_massive_particle' },
    lz: { ad: 'LZ 2025 (arXiv:2410.17036)', url: 'https://www.arxiv.org/abs/2410.17036' },
    bulbul: { ad: 'Bulbul ve ark. 2014 (arXiv:1402.2301)', url: 'https://www.arxiv.org/abs/1402.2301' },
    baur: { ad: 'Baur ve ark. 2015, Lyman-alfa (arXiv:1512.01981)', url: 'https://www.arxiv.org/pdf/1512.01981v1' },
    carr: { ad: 'Carr ve ark. 2026, ilkel kara delikler (arXiv:2601.06024)', url: 'https://arxiv.org/pdf/2601.06024' },
    nist: { ad: 'NIST CODATA sabitleri', url: 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt' },
    planck18: { ad: 'Planck 2018 VI: kozmolojik parametreler', url: 'https://arxiv.org/pdf/1807.06209v4' },
    frieman: { ad: 'Frieman: Lectures on Dark Energy (arXiv:0904.1832)', url: 'https://arxiv.org/pdf/0904.1832' },
    ccWiki: { ad: 'Wikipedia: Cosmological constant problem', url: 'https://en.wikipedia.org/wiki/Cosmological_constant_problem' },
    martin: { ad: 'Martin 2012 (arXiv:1205.3365)', url: 'https://arxiv.org/abs/1205.3365' },
    desi: { ad: 'DESI DR2 Results II (arXiv:2503.14738)', url: 'https://arxiv.org/abs/2503.14738' },
    unite: { ad: 'Camilleri ve ark. 2026, Supernovae Unite (ön baskı)', url: 'https://arxiv.org/abs/2609.05053' },
    hawkingWiki: { ad: 'Wikipedia: Hawking radiation', url: 'https://en.wikipedia.org/wiki/Hawking_radiation' },
    ay: { ad: 'NASA Moon Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html' },
    hawc: { ad: 'HAWC 2020, ilkel kara delik patlamaları', url: 'https://ar5iv.labs.arxiv.org/html/1911.04356' },
    page93: { ad: 'Page 1993 (arXiv:hep-th/9306083)', url: 'https://arxiv.org/abs/hep-th/9306083' },
    page13: { ad: 'Page 2013, ışınım entropisinin zamanla değişimi (arXiv:1301.4995)', url: 'https://arxiv.org/abs/1301.4995' },
    planckUz: { ad: 'NIST CODATA 2022: Planck uzunluğu', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?plkl' },
    planckBirim: { ad: 'Wikipedia: Planck units', url: 'https://en.wikipedia.org/wiki/Planck_units' },
    kaluza: { ad: 'Wikipedia: Kaluza–Klein theory', url: 'https://en.wikipedia.org/wiki/Kaluza%E2%80%93Klein_theory' },
    eotwash: { ad: 'Lee, Adelberger ve ark. 2020 (arXiv:2002.11761)', url: 'https://arxiv.org/pdf/2002.11761' },
    ekBoyut: { ad: 'Wikipedia: Large extra dimensions', url: 'https://en.wikipedia.org/wiki/Large_extra_dimensions' },
    planckX: { ad: 'Planck 2018 X: şişme sınırları (arXiv:1807.06211)', url: 'https://arxiv.org/abs/1807.06211' },
    planck13: { ad: 'Planck 2013 XXII: şişme (arXiv:1303.5082)', url: 'https://arxiv.org/abs/1303.5082' },
    bk: { ad: 'BICEP/Keck 2021, PRL 127, 151301', url: 'https://link.aps.org/accepted/10.1103/PhysRevLett.127.151301' },
    physToday: { ad: 'Physics Today 2015: BICEP2 işaretinin çöküşü', url: 'https://physicstoday.aip.org/news/last-years-evidence-for-primordial-gravitational-waves-negated' },
    act: { ad: 'ACT DR6 (arXiv:2503.14452)', url: 'https://www.arxiv.org/pdf/2503.14452v2' },
    sisme: { ad: 'Wikipedia: Cosmic inflation', url: 'https://en.wikipedia.org/wiki/Cosmic_inflation' },
    tegmark: { ad: 'Tegmark 2003, Parallel Universes', url: 'https://ar5iv.labs.arxiv.org/html/astro-ph/0302131' },
    gelecek: { ad: 'Wikipedia: Future of an expanding universe', url: 'https://en.wikipedia.org/wiki/Future_of_an_expanding_universe' },
    isilOlum: { ad: 'Wikipedia: Heat death of the universe', url: 'https://en.wikipedia.org/wiki/Heat_death_of_the_universe' },
    andreassen: { ad: 'Andreassen, Frost, Schwartz 2018 (arXiv:1707.08124)', url: 'https://arxiv.org/abs/1707.08124v2' },
    caldwell: { ad: 'Caldwell, Kamionkowski, Weinberg 2003', url: 'https://ar5iv.labs.arxiv.org/html/astro-ph/0302506' },
    cornell: { ad: 'Cornell Chronicle 2025: 33 milyar yıl ve Büyük Çöküş', url: 'https://news.cornell.edu/node/331616' },
    beyazDelik: { ad: 'Wikipedia: White hole', url: 'https://en.wikipedia.org/wiki/White_hole' },
    solucan: { ad: 'Wikipedia: Wormhole', url: 'https://wikiwand.com/en/Wormhole' },
    morris: { ad: 'Morris ve Thorne 1988', url: 'https://www.osti.gov/biblio/5435651' },
    krikalev: { ad: 'Universe Today 2013: Krikalev', url: 'https://www.universetoday.com/105650/cosmonaut-sergei-krikalev-the-worlds-most-prolific-time-traveler' },
    zamanGen: { ad: 'Wikipedia: Time dilation (CERN müonları)', url: 'https://en.wikipedia.org/wiki/Time_dilation' },
    interstellar: { ad: 'Space.com: The Science of Interstellar', url: 'https://www.space.com/28075-science-of-interstellar-book-review.html' }
  };

  /* ================================================================ d50 ================================================================ */

  /* SPARC MassModels_Lelli2016c.mrt, NGC 3198 (13,8 Mpc): [R kpc, Vobs, e_Vobs, Vbar]; Vbar = √(|Vgaz|·Vgaz + 0,5·Vdisk²) (bulge yok) */
  const N3198 = [[0.32, 24.4, 35.9, 44.7], [0.64, 43.3, 16.3, 52.1], [0.96, 45.5, 16.1, 55.8], [1.28, 58.5, 15.4, 58.5], [1.61, 68.8, 7.61, 59.6], [1.93, 76.9, 10.3, 58.8], [2.24, 82.0, 8.09, 61.5], [2.57, 86.9, 7.6, 62.9], [2.89, 97.6, 3.03, 62.9], [3.21, 100.0, 5.31, 66.3], [3.54, 107.0, 7.51, 71.6], [3.85, 113.0, 7.32, 76.7], [4.17, 117.0, 5.21, 81.7], [4.5, 119.0, 5.67, 85.3], [4.82, 127.0, 5.39, 88.8], [5.15, 132.0, 4.34, 91.7], [5.46, 134.0, 2.36, 94.4], [5.78, 137.0, 0.89, 96.8], [6.1, 140.0, 2.84, 99.0], [6.43, 142.0, 0.88, 100.9], [6.74, 144.0, 1.23, 101.3], [7.06, 146.0, 1.57, 100.5], [8.04, 147.0, 3.0, 97.3], [9.04, 148.0, 3.0, 94.6], [10.04, 152.0, 2.0, 93.6], [11.04, 155.0, 2.0, 93.6], [12.05, 156.0, 2.0, 93.4], [14.05, 157.0, 2.0, 90.4], [16.07, 153.0, 2.0, 84.8], [18.13, 153.0, 2.0, 80.8], [20.05, 154.0, 2.0, 78.9], [22.12, 153.0, 2.0, 76.6], [24.03, 150.0, 2.0, 74.4], [26.1, 149.0, 2.0, 73.0], [28.16, 148.0, 2.0, 72.0], [30.08, 146.0, 2.0, 70.3], [32.14, 147.0, 2.0, 68.3], [34.06, 148.0, 2.0, 67.2], [36.12, 148.0, 2.0, 66.8], [38.19, 149.0, 2.0, 66.4], [40.1, 150.0, 2.0, 66.0], [42.17, 150.0, 3.0, 66.2], [44.08, 149.0, 3.0, 64.7]];

  /* d50 · bölüm 1: ölçülen dönme eğrisi ile görünen maddenin Newton'a göre vereceği hız */
  C.ekle('d50-donme-egrisi', {
    ders: 'd50', bolum: 1, oran: 0.82,
    baslik: "NGC 3198'in ölçülen dönme eğrisi ve görünen maddenin payı",
    aciklama: "Noktalar sarmal galaksi NGC 3198'in ölçülen dönüş hızıdır, dikey çizgiler ölçüm belirsizliğidir; veriler SPARC kataloğundan, radyo ve H-alfa ölçümleridir. Kesikli eğri, yalnızca görünen maddenin, yani yıldızların ve gazın Newton yasasıyla vereceği hızdır; yıldızların kütle ışık oranı SPARC'ın önerdiği 0,5 alındı. Görünen maddenin hızı yaklaşık 7 kiloparsekte saniyede 101 kilometreyle en yükseğe çıkıp düşer; ölçülen hız ise saniyede 150 kilometre civarında düz kalır. En dıştaki noktada, 44 kiloparsekte, ölçülen 149 kilometreye karşılık hesap 65 verir: içerideki kütle görünenin yaklaşık 5 katı olmalıdır. Gölgeli fark, karanlık maddenin gözlemle kesinleşmiş kütleçekim etkisidir.",
    kaynak: [KAYNAK.sparc, KAYNAK.lelli2016, KAYNAK.rotWiki],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 58, y: 34, w: 322, h: 216 }, { x0: 0, x1: 46, y0: 0, y1: 180 }, {
        xIsaret: [[0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40']],
        yIsaret: [[0, '0'], [50, '50'], [100, '100'], [150, '150']],
        xAd: 'merkeze uzaklık (kiloparsek)', yAd: 'dönüş hızı (km/s)', yAdUzak: 42
      });
      let s = '';
      const ust = N3198.map(r => [ek.X(r[0]), ek.Y(r[1])]), alt = N3198.map(r => [ek.X(r[0]), ek.Y(r[3])]);
      s += cokgen(ust.concat(alt.slice().reverse()), R.vurguSoluk, 0.75);
      s += ek.svg;
      s += S.egri(alt, { renk: R.metin, kalin: 2.4, kesik: '7 5' });
      N3198.forEach(r => {
        const x = ek.X(r[0]);
        s += S.cizgi(x, ek.Y(Math.min(180, r[1] + r[2])), x, ek.Y(Math.max(0, r[1] - r[2])), { renk: R.metin, kalin: 1 });
        s += S.daire(x, ek.Y(r[1]), 2.6, { dolgu: R.metin, renk: 'none' });
      });
      s += S.yazi(58, 20, 'NGC 3198, uzaklık 13,8 Mpc', { boy: 13, renk: R.soluk });
      s += S.zeminliYazi(ek.X(17), ek.Y(167), '● ölçülen: düz kalıyor', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(ek.X(29), ek.Y(114), 'aradaki fark: karanlık madde', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.zeminliYazi(ek.X(19), ek.Y(47), '– – görünen madde tek başına', { boy: 13, renk: R.metin });
      s += S.yazi(ek.X(19), ek.Y(47) + 17, '(yıldız + gaz, Newton)', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d50 · bölüm 3: aday kütleleri, logaritmik eV ekseninde (ders örneği: ≈ 64 basamak) */
  C.ekle('d50-aday-kutleleri', {
    ders: 'd50', bolum: 3, oran: 1.0,
    baslik: 'Karanlık madde adaylarının kütleleri: 64 basamaklık bir aralık',
    aciklama: "Yatay eksen logaritmiktir: her çentik 10 milyar kat demektir ve kütleler elektronvolt cinsindendir. En solda, bazı senaryolarda 1 pikoelektronvolta kadar inebilen aksiyonlar var; ADMX'in 2020'den bu yana parça parça taradığı 2,8 ile 5,4 mikroelektronvolt arası küçük üçgenle gösterildi. Nötrinoların kütleleri toplamı 0,12 elektronvolttan küçüktür, bu yüzden karanlık maddenin ana bileşeni olamazlar. Steril nötrino için 3,5 keV çizgisinden doğan 7,1 keV adayı askıdadır. WIMP'ler birkaç GeV ile 100 GeV civarındadır; proton yaklaşık 0,94 GeV'dir. En sağda ilkel kara deliklerin tek açık penceresi, Güneş kütlesinin 10 üzeri eksi 17 ile 10 üzeri eksi 10 katı arası. En hafif aksiyonla bu pencerenin alt ucu arasında yaklaşık 64 basamak var. Adayların hepsi kuram ya da hipotez basamağındadır.",
    kaynak: [KAYNAK.axion, KAYNAK.admx, KAYNAK.bulbul, KAYNAK.baur, KAYNAK.wimp, KAYNAK.lz, KAYNAK.carr, KAYNAK.nist],
    ciz(S) {
      const R = S.R, X = l => 22 + (l + 16) / 84 * 362, ya = 318;
      let s = '';
      s += S.yazi(22, 16, 'kütle, elektronvolt cinsinden (logaritmik)', { boy: 13, renk: R.soluk });
      /* 64 basamak köşeli ayracı */
      s += S.cizgi(X(-15), 46, X(49.04), 46, { renk: R.metin, kalin: 1.2 }) + S.cizgi(X(-15), 40, X(-15), 52, { renk: R.metin, kalin: 1.2 }) + S.cizgi(X(49.04), 40, X(49.04), 52, { renk: R.metin, kalin: 1.2 });
      s += S.zeminliYazi((X(-15) + X(49.04)) / 2, 40, '≈ 64 basamak', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      /* kıyas çizgileri: proton ve Güneş */
      [[8.97, 'proton'], [66.05, 'Güneş']].forEach(([l, t]) => {
        s += S.cizgi(X(l), 66, X(l), ya, { renk: R.soluk, kalin: 1, kesik: '3 4' });
        s += S.yazi(X(l), 64, t, { boy: 13, hiza: l > 60 ? 'end' : 'middle', renk: R.soluk });
      });
      /* aksiyon */
      let y = 96;
      s += S.zeminliYazi(X(-15), y - 12, 'aksiyon: en hafifi 1 peV', { boy: 13, renk: R.metin, kalin: true });
      s += S.cizgi(X(-15), y, X(-5.27), y, { renk: R.metin, kalin: 3, kesik: '2 4', uc: 'round' });
      s += S.daire(X(-15), y, 4, { dolgu: R.metin, renk: 'none' });
      s += `<polygon points="${X(-5.4) - 6},${y + 14} ${X(-5.4) + 6},${y + 14} ${X(-5.4)},${y + 3}" fill="${R.metin}"/>`;
      s += S.zeminliYazi(X(-5.4) + 10, y + 16, 'ADMX: 2,8–5,4 μeV arası, parça parça', { boy: 13, renk: R.soluk });
      /* nötrino */
      y = 150;
      s += S.zeminliYazi(X(-12), y - 12, 'nötrinolar: toplam < 0,12 eV', { boy: 13, renk: R.metin, kalin: true });
      s += S.ok(X(-0.92), y, X(-6), y, { renk: R.metin, kalin: 2, boy: 8 });
      s += S.daire(X(-0.92), y, 4.5, { dolgu: R.zemin, renk: R.metin, kalin: 2 });
      s += S.zeminliYazi(X(-0.92) + 9, y + 5, 'sıcak: ana bileşen olamaz', { boy: 13, renk: R.soluk });
      /* steril nötrino */
      y = 200;
      s += S.zeminliYazi(X(1), y - 12, 'steril nötrino: 7,1 keV adayı (askıda)', { boy: 13, renk: R.metin, kalin: true });
      s += `<polygon points="${X(3.85)},${y - 6} ${X(3.85) + 6},${y} ${X(3.85)},${y + 6} ${X(3.85) - 6},${y}" fill="${R.metin}"/>`;
      s += S.cizgi(X(3.64), y + 10, X(3.64), y - 10, { renk: R.soluk, kalin: 1.2 });
      s += S.zeminliYazi(X(3.85) + 10, y + 5, 'ılık sınır > 4,35 keV', { boy: 13, renk: R.soluk });
      /* WIMP */
      y = 250;
      s += S.zeminliYazi(X(5), y - 12, 'WIMP: birkaç GeV ile 100 GeV civarı', { boy: 13, renk: R.metin, kalin: true });
      s += S.cizgi(X(9.48), y, X(11), y, { renk: R.metin, kalin: 9, uc: 'round' });
      /* ilkel kara delik */
      y = 296;
      s += S.yazi(X(56.04), y - 14, 'ilkel kara delik: tek açık pencere', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.kutu(X(49.04), y - 6, X(56.04) - X(49.04), 12, { dolgu: R.metin, renk: 'none' }, 2);
      s += S.yazi(X(48.4), y + 5, 'Güneş kütlesinin ' + on(-17) + '–' + on(-10) + ' katı', { boy: 13, hiza: 'end', renk: R.soluk });
      /* eksen */
      s += S.cizgi(X(-16), ya, X(68), ya, { renk: R.soluk, kalin: 1 });
      [-10, 0, 10, 20, 30, 40, 50, 60].forEach(l => {
        s += S.cizgi(X(l), ya, X(l), ya + 5, { renk: R.soluk, kalin: 1 });
        s += S.yazi(X(l), ya + 20, l === 0 ? '1 eV' : on(l), { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.yazi(200, ya + 42, 'her çentik 10 milyar kat', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += etiket(S, 200, ya + 72, 'Adayların hepsi: kuram ya da hipotez', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* SPARC BTFR_Lelli2016a.mrt: [log Mb (Güneş kütlesi, M/L = 0,5), log Vf (km/s)], 118 galaksi */
  const BTFR = [[8.68, 1.76], [8.59, 1.67], [9.32, 1.82], [8.81, 1.73], [9.1, 1.78], [10.47, 2.24], [9.55, 2.04], [11.27, 2.5], [9.72, 2.05], [9.87, 2.15], [9.9, 1.99], [9.52, 1.93], [9.28, 1.82], [11.03, 2.38], [8.29, 1.53], [9.45, 2.03], [9.64, 1.93], [9.78, 2.02], [10.86, 2.21], [9.43, 1.97], [11.27, 2.34], [10.88, 2.33], [10.05, 2.04], [10.68, 2.22], [9.97, 2.12], [10.62, 2.19], [11.03, 2.45], [10.65, 2.27], [9.0, 1.92], [9.2, 1.93], [11.03, 2.32], [8.86, 1.82], [10.53, 2.18], [10.67, 2.32], [10.64, 2.23], [8.41, 1.7], [10.22, 2.07], [10.58, 2.23], [10.57, 2.24], [10.13, 2.13], [10.37, 2.21], [10.87, 2.34], [9.94, 2.12], [11.13, 2.38], [10.09, 2.1], [10.64, 2.24], [10.71, 2.2], [10.1, 2.12], [10.81, 2.23], [10.53, 2.2], [10.38, 2.17], [10.8, 2.27], [10.0, 2.04], [10.66, 2.26], [10.96, 2.42], [10.85, 2.29], [10.96, 2.25], [11.27, 2.32], [11.25, 2.38], [9.57, 1.96], [11.06, 2.33], [10.38, 2.19], [11.35, 2.4], [9.94, 2.07], [11.18, 2.38], [10.61, 2.22], [11.15, 2.38], [10.26, 2.21], [10.59, 2.34], [10.2, 2.11], [9.45, 1.92], [9.8, 2.03], [9.41, 1.87], [9.18, 1.94], [11.43, 2.52], [11.41, 2.46], [10.97, 2.26], [11.15, 2.42], [10.84, 2.34], [10.73, 2.29], [10.1, 2.1], [9.28, 1.96], [9.35, 1.86], [11.03, 2.33], [9.24, 1.86], [9.01, 1.9], [9.77, 2.05], [9.31, 1.93], [9.37, 1.91], [10.96, 2.3], [9.25, 1.92], [10.64, 2.34], [10.75, 2.39], [9.35, 1.85], [9.79, 2.04], [9.4, 1.9], [9.94, 2.03], [10.47, 2.24], [9.82, 2.04], [9.88, 1.81], [9.29, 1.87], [9.2, 2.01], [9.55, 1.9], [8.73, 1.79], [8.98, 1.76], [9.17, 1.92], [9.17, 1.9], [8.72, 1.76], [10.98, 2.26], [10.78, 2.18], [11.29, 2.36], [9.39, 1.85], [11.31, 2.43], [10.88, 2.46], [11.07, 2.37], [9.47, 1.86], [8.62, 1.75], [7.98, 1.57]];

  /* d50 · bölüm 12: baryonik Tully–Fisher ilişkisi ve MOND'un ayarsız öngörüsü v⁴ = G M a0 */
  C.ekle('d50-tully-fisher', {
    ders: 'd50', bolum: 12, oran: 0.9,
    baslik: "Baryonik Tully–Fisher ilişkisi: 118 galaksi ve MOND'un öngörüsü",
    aciklama: "Her daire bir galaksidir: yatay eksen görünen, yani yıldız ve gazdan gelen kütlesi, dikey eksen dönme eğrisinin düz kısmındaki hızıdır. İki eksen de logaritmiktir. Veriler SPARC kataloğundan, yıldızların kütle ışık oranı 0,5 alınarak. Kesikli çizgi MOND'un öngörüsüdür: hızın dördüncü kuvveti, G çarpı kütle çarpı a0'a eşittir, a0 da saniye kareye 1,2 çarpı 10 üzeri eksi 10 metredir. Çizgi verilere uydurulmadı, yalnızca formülden çizildi; yine de noktalar onun çevresinde dar bir şerit oluşturur, ortalamada yaklaşık yüzde 7 yukarıda. Dolu karo dersin örneğidir: 5 çarpı 10 üzeri 10 Güneş kütlesi için saniyede 168 kilometre. Bu ilişki ölçülmüştür; MOND ise kuram ya da hipotez basamağındadır ve karanlık madde modelleri de aynı ilişkiyi açıklamaya çalışır.",
    kaynak: [KAYNAK.btfr, KAYNAK.sparc, KAYNAK.mond],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 58, y: 52, w: 322, h: 220 }, { x0: 7.8, x1: 11.7, y0: 1.45, y1: 2.65 }, {
        xIsaret: [[8, on(8)], [9, on(9)], [10, on(10)], [11, on(11)]],
        yIsaret: [[L10(30), '30'], [L10(50), '50'], [2, '100'], [L10(200), '200'], [L10(300), '300']],
        xAd: 'görünen kütle (Güneş kütlesi)', yAd: 'düz dönme hızı (km/s)', yAdUzak: 42
      });
      let s = ek.svg;
      const mond = m => 0.25 * m - 0.4495;              // log v = ¼ log(G M☉ a0 M) − 3
      s += S.cizgi(ek.X(7.8), ek.Y(mond(7.8)), ek.X(11.7), ek.Y(mond(11.7)), { renk: R.vurgu, kalin: 2.6, kesik: '9 6' });
      BTFR.forEach(p => s += S.daire(ek.X(p[0]), ek.Y(p[1]), 2.7, { renk: R.metin, kalin: 1.1 }));
      const ex = ek.X(10.699), ey = ek.Y(2.2252);
      s += `<polygon points="${ex},${ey - 7} ${ex + 7},${ey} ${ex},${ey + 7} ${ex - 7},${ey}" fill="${R.vurgu}" stroke="${R.zemin}" stroke-width="1.2"/>`;
      s += S.cizgi(ex + 4, ey + 6, 330, ek.Y(1.9) - 14, { renk: R.vurgu, kalin: 1 });
      s += S.zeminliYazi(376, ek.Y(1.9), '5 × 10¹⁰ → 168 km/s', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      /* gösterge */
      s += S.daire(64, 14, 3, { renk: R.metin, kalin: 1.2 }) + S.yazi(74, 19, '118 galaksi: ölçüm (SPARC)', { boy: 13, renk: R.metin });
      s += S.cizgi(56, 35, 74, 35, { renk: R.vurgu, kalin: 2.6, kesik: '6 4' }) + S.yazi(80, 40, 'MOND: hız⁴ = G × M × a0 (ayarsız)', { boy: 13, renk: R.metin });
      s += etiket(S, ek.X(11.68), ek.Y(1.53), 'MOND: kuram ya da hipotez', 'kuram', { hiza: 'end' });
      return s;
    }
  });

  /* ================================================================ d51 ================================================================ */

  /* d51 · bölüm 4: madde a⁻³ ile seyrelir, kozmolojik sabit sabit kalır; Planck 2018 Ωm = 0,3153, ΩΛ = 0,6847 */
  C.ekle('d51-seyrelme', {
    ders: 'd51', bolum: 4, oran: 0.94,
    baslik: 'Madde seyrelir, kozmolojik sabit yerinde durur',
    aciklama: "Yatay eksen evrenin bugüne göre boyudur, dikey eksen yoğunluk; ikisi de logaritmiktir, bugünkü kritik yoğunluk 1 sayıldı. Madde çizgisi dik iner: evren iki kat büyüyünce madde sekiz kat seyrelir, çünkü w sıfırdır. Kozmolojik sabit çizgisi yataydır: w eksi 1 olduğu için hiç seyrelmez. Planck 2018 değerleriyle iki çizgi z yaklaşık 0,30'da, yaklaşık 3,5 milyar yıl önce kesişir. Hızlanma ondan önce, madde yoğunluğu karanlık enerjininkinin iki katına indiğinde, z yaklaşık 0,63'te, yaklaşık 6,1 milyar yıl önce başladı. Kesikli çizgi w eksi 1,5 olan varsayımsal fantom enerjidir: evren büyüdükçe yoğunluğu artar; bu bir hipotezdir.",
    kaynak: [KAYNAK.frieman, KAYNAK.planck18],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 58, y: 30, w: 322, h: 220 }, { x0: 0.1, x1: 10, y0: 0.01, y1: 1000 }, {
        logX: true, logY: true,
        xIsaret: [[0.1, '0,1'], [1, '1 (bugün)'], [10, '10']],
        yIsaret: [[0.01, '0,01'], [0.1, '0,1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1000']],
        xAd: 'evrenin boyu, a (bugün = 1)', yAd: 'yoğunluk (bugünkü kritik = 1)', yAdUzak: 44
      });
      let s = ek.svg;
      s += S.cizgi(ek.X(1), ek.Y(1000), ek.X(1), ek.Y(0.01), { renk: R.soluk, kalin: 1, kesik: '2 4' });
      s += S.fonk(ek, a => 0.6847 * Math.pow(a, 1.5), 0.1, 10, 60, { renk: R.uyari, kalin: 2, kesik: '8 5' }, true);
      s += S.fonk(ek, () => 0.6847, 0.1, 10, 2, { renk: R.vurgu, kalin: 3 }, true);
      s += S.fonk(ek, a => 0.3153 / Math.pow(a, 3), 0.1, Math.pow(31.53, 1 / 3), 60, { renk: R.metin, kalin: 2.6 }, true);
      /* eşitlik ve hızlanma */
      const ex = ek.X(0.7701), ey = ek.Y(0.6847);
      s += S.daire(ex, ey, 5, { dolgu: R.metin, renk: R.zemin, kalin: 1.2 });
      s += S.cizgi(ex, ey + 5, ex - 10, ek.Y(0.36), { renk: R.metin, kalin: 1 });
      s += S.zeminliYazi(ex - 12, ek.Y(0.33), 'eşitlik: z ≈ 0,30', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.zeminliYazi(ex - 12, ek.Y(0.33) + 17, '≈ 3,5 milyar yıl önce', { boy: 13, hiza: 'end', renk: R.soluk });
      const hx = ek.X(0.613), hy = ek.Y(1.3694);
      s += S.daire(hx, hy, 5, { dolgu: R.zemin, renk: R.metin, kalin: 2 });
      s += S.cizgi(hx - 3, hy - 5, 150, ek.Y(170) + 6, { renk: R.metin, kalin: 1 });
      s += S.yazi(118, ek.Y(330), 'hızlanma başlar: z ≈ 0,63', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(118, ek.Y(330) + 17, '≈ 6,1 milyar yıl önce', { boy: 13, renk: R.soluk });
      /* gösterge: çizim alanının altında */
      const g = (y, o, metin) => S.cizgi(60, y - 4, 88, y - 4, o) + S.yazi(96, y, metin, { boy: 13, renk: R.metin });
      s += g(320, { renk: R.metin, kalin: 2.6 }, 'madde, w = 0: a³ ile seyrelir');
      s += g(340, { renk: R.vurgu, kalin: 3 }, 'kozmolojik sabit Λ, w = −1: seyrelmez');
      s += g(360, { renk: R.uyari, kalin: 2, kesik: '8 5' }, 'fantom, w = −1,5: yoğunlaşır (hipotez)');
      return s;
    }
  });

  /* d51 · bölüm 7: 10¹²⁰ sorunu; logaritmik yoğunluk merdiveni (ders örneği ve Martin 2012) */
  C.ekle('d51-120-basamak', {
    ders: 'd51', bolum: 7, oran: 1.05,
    baslik: 'Kozmolojik sabit sorunu: tahmin ile ölçüm arasındaki basamaklar',
    aciklama: "Dikey eksen yoğunluktur, metreküpte kilogram, ve logaritmiktir: her çentik 10 üzeri 20 kat. En altta ölçülen karanlık enerji yoğunluğu var, metreküpte yaklaşık 6 çarpı 10 üzeri eksi 27 kilogram; hemen üstünde, kıyas için, Samanyolu'ndaki yerel karanlık madde, yaklaşık yüz bin kat daha yoğun. En üstte boşluk enerjisinin Planck ölçeğinde kesilen kaba tahmini: bir Planck kütlesinin bir Planck küpüne sıkışması, yaklaşık 5 çarpı 10 üzeri 96. Aradaki fark yaklaşık 123 basamaktır; sık anılan 120 bunun yuvarlak hâlidir. Ortadaki nokta, Lorentz değişmezliğini koruyan hesapların vardığı fark: Martin'e göre yaklaşık 55 basamak. Sorunun varlığı yaygın kabul görür; sayısı tartışmalıdır, çözümü bilinmiyor.",
    kaynak: [KAYNAK.ccWiki, KAYNAK.martin, KAYNAK.nist, KAYNAK.planck18],
    ciz(S) {
      const R = S.R, ax = 76, Y = l => 34 + (100 - l) / 130 * 360;
      let s = '';
      s += S.cizgi(ax, Y(100), ax, Y(-30), { renk: R.soluk, kalin: 1.5 });
      [100, 80, 60, 40, 20, 0, -20].forEach(l => {
        s += S.cizgi(ax - 5, Y(l), ax, Y(l), { renk: R.soluk, kalin: 1 });
        s += S.yazi(ax - 8, Y(l) + 4, l === 0 ? '1' : on(l), { boy: 13, hiza: 'end', renk: R.soluk });
      });
      s += S.yazi(16, Y(35), 'yoğunluk (kg/m³)', { boy: 13, hiza: 'middle', renk: R.soluk, yan: -90 });
      /* köşeli ayraçlar */
      const ayrac = (x, l1, l2, l3, metin) => S.cizgi(x, Y(l1), x, Y(l2), { renk: R.metin, kalin: 1.5 }) + S.cizgi(x - 6, Y(l1), x, Y(l1), { renk: R.metin, kalin: 1.5 }) + S.cizgi(x - 6, Y(l2), x, Y(l2), { renk: R.metin, kalin: 1.5 }) +
        S.yazi(x + 14, Y(l3), metin, { boy: 13, hiza: 'middle', renk: R.metin, kalin: true, yan: -90 });
      s += ayrac(94, -26.23, 28.77, 8, '≈ 55 basamak');
      s += ayrac(124, -26.23, 96.72, 62, '≈ 123 basamak');
      const nok = [
        [96.72, ['Planck kesmesiyle kaba tahmin', '≈ 5 × 10⁹⁶ kg/m³'], 'dolu', 0],
        [28.77, ['Lorentz değişmezliğini koruyan', 'hesap: ölçülenin ≈ 10⁵⁵ katı'], 'bos', 0],
        [-21.15, ['Samanyolu: yerel karanlık madde', '≈ 7 × 10⁻²² kg/m³'], 'bos', -38],
        [-26.23, ['ölçülen karanlık enerji', '≈ 6 × 10⁻²⁷ kg/m³'], 'dolu', 4]
      ];
      nok.forEach(([l, t, tur, dy]) => {
        const y = Y(l);
        s += S.daire(ax, y, 5, tur === 'dolu' ? { dolgu: R.metin, renk: R.zemin, kalin: 1 } : { dolgu: R.zemin, renk: R.metin, kalin: 2 });
        s += S.yol(`M${ax + 6},${y} L148,${y + dy}`, { renk: R.soluk, kalin: 1 });
        s += S.yazi(152, y + dy - 1, t[0], { boy: 13, renk: R.metin, kalin: true });
        s += S.yazi(152, y + dy + 16, t[1], { boy: 13, renk: R.soluk });
      });
      return s;
    }
  });

  /* d51 · bölüm 11: DESI DR2 + CMB + DESY5, w(z) = w0 + wa(1 − a); pivot bağımsızlığıyla %68 bant */
  C.ekle('d51-desi-w', {
    ders: 'd51', bolum: 11, oran: 0.92,
    baslik: "DESI'nin w ölçümü: karanlık enerji zamanla değişiyor mu?",
    aciklama: "Yatay eksen kırmızıya kaymadır, sağa doğru geçmişe gidilir; dikey eksen karanlık enerjinin w sayısıdır. Yatay ince çizgi w eksi 1, yani kozmolojik sabittir. Kalın çizgi DESI'nin ikinci veri sürümünün arka plan ışıması ve DES süpernovalarıyla birleşik en iyi uyumudur: bugün w eksi 0,75, geçmişe doğru eksi 1'in altına iner. Gölgeli şerit yüzde 68'lik belirsizlik bandıdır; makalenin verdiği w0, wa ve en iyi ölçülen noktadan hesaplandı. Bant en dar yerde, z 0,31'de, w eksi 0,954 artı eksi 0,024'tür. Kesikli çizgi 2026'daki Unite ön baskısının değeridir. Kozmolojik sabitten ayrılık 4,2 sigma, keşif eşiği olan 5 sigmanın altında: işaret askıda.",
    kaynak: [KAYNAK.desi, KAYNAK.unite],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 60, y: 54, w: 320, h: 218 }, { x0: 0, x1: 2.5, y0: -1.7, y1: -0.5 }, {
        xIsaret: [[0, '0'], [0.5, '0,5'], [1, '1'], [1.5, '1,5'], [2, '2'], [2.5, '2,5']],
        yIsaret: [[-1.6, '−1,6'], [-1.4, '−1,4'], [-1.2, '−1,2'], [-1, '−1'], [-0.8, '−0,8'], [-0.6, '−0,6']],
        xAd: 'kırmızıya kayma z (sağa doğru geçmiş)', yAd: 'durum denklemi w', yAdUzak: 44
      });
      const w0 = -0.752, wa = -0.86, swa = 0.215, ap = 1 / 1.31, wp = -0.954, swp = 0.024;
      const w = z => w0 + wa * (1 - 1 / (1 + z)), sg = z => Math.sqrt(swp * swp + Math.pow(ap - 1 / (1 + z), 2) * swa * swa);
      const zs = []; for (let i = 0; i <= 50; i++) zs.push(i * 0.05);
      let s = cokgen(zs.map(z => [ek.X(z), ek.Y(w(z) + sg(z))]).concat(zs.slice().reverse().map(z => [ek.X(z), ek.Y(w(z) - sg(z))])), R.vurguSoluk, 0.9);
      s += ek.svg;
      s += S.cizgi(ek.X(0), ek.Y(-1), ek.X(2.5), ek.Y(-1), { renk: R.metin, kalin: 1.3 });
      s += S.fonk(ek, z => -0.861 - 0.60 * (1 - 1 / (1 + z)), 0, 2.5, 50, { renk: R.metin, kalin: 1.6, kesik: '6 4' });
      s += S.fonk(ek, w, 0, 2.5, 50, { renk: R.vurgu, kalin: 3 });
      const px = ek.X(0.31), py = ek.Y(wp);
      s += S.cizgi(px, ek.Y(wp + swp), px, ek.Y(wp - swp), { renk: R.metin, kalin: 2 }) + S.daire(px, py, 4.5, { dolgu: R.metin, renk: R.zemin, kalin: 1.2 });
      s += S.cizgi(px + 3, py - 4, ek.X(0.5) - 4, ek.Y(-0.8) + 4, { renk: R.metin, kalin: 1 });
      s += S.yazi(ek.X(0.5), ek.Y(-0.8), 'en iyi ölçülen yer: z = 0,31', { boy: 13, renk: R.metin });
      s += S.yazi(ek.X(0.5), ek.Y(-0.8) - 17, 'w = −0,954 ± 0,024', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(ek.X(2.48), ek.Y(-1) - 5, 'w = −1: kozmolojik sabit', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(ek.X(2.48), ek.Y(-0.56), '−1 üstü: zayıflayan', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(ek.X(0.04), ek.Y(-1.47), '−1 altı: fantom gibi', { boy: 13, renk: R.soluk });
      s += etiket(S, ek.X(2.48), ek.Y(-1.62), 'Kesinlik: askıda (4,2 sigma)', 'askida', { hiza: 'end' });
      /* gösterge */
      s += S.kutu(60, 8, 22, 12, { dolgu: R.vurguSoluk, renk: 'none' }) + S.cizgi(60, 14, 82, 14, { renk: R.vurgu, kalin: 3 });
      s += S.yazi(88, 19, 'DESI DR2 + CMB + DESY5: uyum ve %68 bandı', { boy: 13, renk: R.metin });
      s += S.cizgi(60, 35, 82, 35, { renk: R.metin, kalin: 1.6, kesik: '6 4' }) + S.yazi(88, 40, 'Unite 2026 (ön baskı, hakemsiz)', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* ================================================================ d52 ================================================================ */

  const MG = 1.988e30, TG = 6.17e-8;                 // Güneş kütlesi (kg), 1 M☉'lik kara deliğin Hawking sıcaklığı (K)
  const kgEks = (S, alan, y0, y1, yIs, yAd) => S.eksen(alan, { x0: 1e10, x1: 1e42, y0, y1 }, {
    logX: true, logY: true,
    xIsaret: [[1e10, on(10)], [1e20, on(20)], [1e30, on(30)], [1e40, on(40)]], yIsaret: yIs,
    xAd: 'kara deliğin kütlesi (kg)', yAd, yAdUzak: 46
  });

  /* d52 · bölüm 3: Hawking sıcaklığı T ≈ 6,17 × 10⁻⁸ K × (M☉ ÷ M), kozmik arka plan çizgisiyle (bölüm 4) */
  C.ekle('d52-hawking-sicakligi', {
    ders: 'd52', bolum: 3, oran: 0.96,
    baslik: 'Hawking sıcaklığı: kütle büyüdükçe soğuyan kara delik',
    aciklama: "İki eksen de logaritmiktir; çizgi dersin kısayol formülünden hesaplandı: sıcaklık, 6,17 çarpı 10 üzeri eksi 8 kelvinin Güneş kütlesi bölü kütleyle çarpımıdır. Kütle on kat artınca sıcaklık on kat düşer. Güneş kütleli bir kara delik 62 nanokelvin, Sgr A yıldız yaklaşık 10 üzeri eksi 14 kelvin, M87'nin dev kara deliği yaklaşık 10 üzeri eksi 17 kelvindir. Kesikli yatay çizgi 2,725 kelvinlik kozmik arka plandır. Onu kestiği kütle yaklaşık 4,5 çarpı 10 üzeri 22 kilogram, Ay kütlesinin yaklaşık yüzde 61'i: bundan hafif kara delikler arka plandan sıcaktır ve bugün küçülebilir, bilinen bütün kara delikler ise sağdadır ve büyür. Hawking ışıması kuram ya da hipotez düzeyindedir: hesap sağlam ama hiç gözlenmedi.",
    kaynak: [KAYNAK.hawkingWiki, KAYNAK.ay, KAYNAK.nist],
    ciz(S) {
      const R = S.R;
      const ek = kgEks(S, { x: 64, y: 24, w: 316, h: 270 }, 1e-20, 1e14, [[1e10, on(10)], [1, '1'], [1e-10, on(-10)], [1e-20, on(-20)]], 'Hawking sıcaklığı (kelvin)');
      const T = m => TG * MG / m;
      let s = ek.svg;
      s += S.cizgi(ek.X(1e10), ek.Y(2.725), ek.X(1e42), ek.Y(2.725), { renk: R.uyari, kalin: 1.8, kesik: '7 5' });
      s += S.cizgi(ek.X(4.5e22), ek.Y(1e14), ek.X(4.5e22), ek.Y(1e-20), { renk: R.soluk, kalin: 1, kesik: '2 4' });
      s += S.fonk(ek, T, 1e10, 1e42, 40, { renk: R.metin, kalin: 2.8 }, true);
      s += S.yazi(ek.X(1.2e10), ek.Y(2.725) + 18, 'arka plan 2,725 K', { boy: 13, renk: R.uyari, kalin: true });
      s += S.yazi(ek.X(1.2e10), ek.Y(2.725) + 35, '← küçülür', { boy: 13, renk: R.metin });
      s += S.yazi(ek.X(1e42) - 4, ek.Y(2.725) - 28, 'büyür →', { boy: 13, hiza: 'end', renk: R.metin });
      const isaret = (m, metin, dx, dy, hiza, bos) => {
        const x = ek.X(m), y = ek.Y(T(m));
        let r = S.daire(x, y, 4.5, bos ? { dolgu: R.zemin, renk: R.metin, kalin: 2 } : { dolgu: R.metin, renk: R.zemin, kalin: 1 });
        if (Math.abs(dx) > 14) r += S.cizgi(x + Math.sign(dx) * 5, y, x + dx - Math.sign(dx) * 3, y + dy - 4, { renk: R.soluk, kalin: 1 });
        return r + (dx > 0 ? S.zeminliYazi : S.yazi)(x + dx, y + dy, metin, { boy: 13, hiza, renk: R.metin });
      };
      s += isaret(5e11, 'bugün biten ilkel kara delik', 30, -6, 'start', true);
      s += S.zeminliYazi(ek.X(5e11) + 30, ek.Y(T(5e11)) + 11, '(varsayımsal): 2,5 × 10¹¹ K', { boy: 13, renk: R.soluk });
      s += isaret(4.5e22, "Ay'ın %61'i: 2,725 K", 12, -8, 'start');
      s += isaret(5.97e24, 'Dünya kütlesi: 0,02 K', 34, 10, 'start');
      s += isaret(MG, 'Güneş kütlesi: 62 nK', -12, 4, 'end');
      s += isaret(4.297e6 * MG, 'Sgr A*: 1,4 × 10⁻¹⁴ K', -12, 4, 'end');
      s += isaret(6.5e9 * MG, 'M87*: 9,5 × 10⁻¹⁸ K', -12, 4, 'end');
      s += etiket(S, 200, 372, 'Kuram / hipotez: hiç gözlenmedi', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* d52 · bölüm 5: ömür ≈ 2,1 × 10⁶⁷ yıl × (M ÷ M☉)³ ve evrenin yaşı */
  C.ekle('d52-buharlasma-omru', {
    ders: 'd52', bolum: 5, oran: 0.92,
    baslik: 'Buharlaşma ömrü kütlenin küpüyle büyür',
    aciklama: "İki eksen de logaritmiktir; çizgi dersin basit formülüdür: ömür, 2,1 çarpı 10 üzeri 67 yılın kütle bölü Güneş kütlesinin küpüyle çarpımı. Kütle on kat artınca ömür bin kat artar, bu yüzden çizgi diktir. Kesikli yatay çizgi evrenin yaşı, 13,8 milyar yıl. Onu kestiği yer, bugün bitmekte olan bir kara deliğin başlangıç kütlesidir: basit formülle yaklaşık 1,7 çarpı 10 üzeri 11 kilogram, bütün parçacık türleri katılınca HAWC ekibine göre yaklaşık 5 çarpı 10 üzeri 11 kilogram, yani bir dağ kütlesi. Güneş kütleli bir kara delik 2,1 çarpı 10 üzeri 67 yıl, Sgr A yıldız 1,7 çarpı 10 üzeri 87 yıl, yüz milyar Güneş kütleli dev bir kara delik 10 üzeri 100 yıl mertebesinde yaşar. Hesaplar Hawking ışımasına dayanır: kuram ya da hipotez.",
    kaynak: [KAYNAK.hawkingWiki, KAYNAK.hawc],
    ciz(S) {
      const R = S.R;
      const ek = kgEks(S, { x: 64, y: 24, w: 316, h: 256 }, 1, 1e105, [[1, '1'], [1e20, on(20)], [1e40, on(40)], [1e60, on(60)], [1e80, on(80)], [1e100, on(100)]], 'buharlaşma ömrü (yıl)');
      const om = m => 2.1e67 * Math.pow(m / MG, 3);
      let s = ek.svg;
      s += S.cizgi(ek.X(1e10), ek.Y(1.38e10), ek.X(1e42), ek.Y(1.38e10), { renk: R.uyari, kalin: 1.8, kesik: '7 5' });
      s += S.fonk(ek, om, 1e10, 1.25e42, 40, { renk: R.metin, kalin: 2.8 }, true);
      s += S.yazi(ek.X(1e42), ek.Y(1.38e10) + 18, 'evrenin yaşı: 13,8 milyar yıl', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      const x1 = ek.X(1.7e11), x2 = ek.X(5e11), yy = ek.Y(1.38e10);
      s += S.daire(x1, yy, 4.5, { dolgu: R.metin, renk: R.zemin, kalin: 1 });
      s += `<polygon points="${x2},${yy - 6} ${x2 + 6},${yy} ${x2},${yy + 6} ${x2 - 6},${yy}" fill="${R.zemin}" stroke="${R.metin}" stroke-width="1.8"/>`;
      s += S.cizgi(x2 + 5, yy - 5, 142, ek.Y(1e18) + 3, { renk: R.soluk, kalin: 1 });
      s += S.yazi(146, ek.Y(1e25), '● basit formül: 1,7 × 10¹¹ kg', { boy: 13, renk: R.metin });
      s += S.yazi(146, ek.Y(1e18), '◇ HAWC, tüm parçacıklar: 5 × 10¹¹ kg', { boy: 13, renk: R.metin });
      const isaret = (m, metin) => {
        const x = ek.X(m), y = ek.Y(om(m));
        return S.daire(x, y, 4.5, { dolgu: R.metin, renk: R.zemin, kalin: 1 }) + S.yazi(x - 12, y + 4, metin, { boy: 13, hiza: 'end', renk: R.metin });
      };
      s += isaret(MG, 'Güneş kütlesi: 2,1 × 10⁶⁷ yıl');
      s += isaret(4.297e6 * MG, 'Sgr A*: 1,7 × 10⁸⁷ yıl');
      s += isaret(1e11 * MG, '10¹¹ Güneş kütlesi: ≈ 10¹⁰⁰ yıl');
      s += etiket(S, 200, 352, 'Kuram / hipotez: Hawking ışımasına bağlı', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* d52 · bölüm 9: Page eğrisi; Page 2013'ün fotonlu ve gravitonlu büyük kara delik hesabı (1,4847 çarpanı) */
  C.ekle('d52-page-egrisi', {
    ders: 'd52', bolum: 9, oran: 0.82,
    baslik: "Page eğrisi ve Hawking'in hep artan eğrisi",
    aciklama: "Yatay eksen buharlaşmanın ne kadarının geçtiği, dikey eksen ışınımın entropisidir; başlangıçtaki kara delik entropisi 1 sayıldı. Noktalı çizgi kara deliğin kalan entropisidir ve ışınımın entropisi için bir tavan gibidir. Kesikli çizgi Hawking'in hesabıdır: ışınım baştan sona ısıl olduğu için entropi hep artar ve sonunda yaklaşık 1,48'de kalır. Kalın çizgi Page eğrisidir: bilgi dışarı çıkıyorsa ışınımın entropisi tavanı aşamaz; ömrün yaklaşık yüzde 54'ünde, 0,60 değerinde döner ve sıfıra iner. Dönüm noktası Page zamanıdır. Eğriler Page'in 2013'teki hesabının varsayımlarıyla çizildi: yalnız foton ve graviton yayan, hızlı karışan büyük bir kara delik. Page eğrisi kuram ya da hipotez düzeyindedir; hiç ölçülmedi.",
    kaynak: [KAYNAK.page93, KAYNAK.page13],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 58, y: 30, w: 322, h: 214 }, { x0: 0, x1: 1, y0: 0, y1: 1.6 }, {
        xIsaret: [[0, '0'], [0.25, '0,25'], [0.5, '0,5'], [0.75, '0,75'], [1, '1']],
        yIsaret: [[0, '0'], [0.5, '0,5'], [1, '1'], [1.5, '1,5']],
        xAd: 'geçen zaman (buharlaşma ömrünün kesri)', yAd: 'entropi (başta = 1)', yAdUzak: 40
      });
      const kd = x => Math.pow(Math.max(0, 1 - x), 2 / 3), hw = x => 1.4847 * (1 - kd(x)), pg = x => Math.min(kd(x), hw(x));
      let s = ek.svg;
      s += S.fonk(ek, kd, 0, 1, 200, { renk: R.metin, kalin: 2, kesik: '2 4' });
      s += S.fonk(ek, hw, 0, 1, 200, { renk: R.uyari, kalin: 2.2, kesik: '8 5' });
      s += S.fonk(ek, pg, 0, 1, 400, { renk: R.vurgu, kalin: 3.4 });
      const tp = 0.5381;
      s += S.cizgi(ek.X(tp), ek.Y(0), ek.X(tp), ek.Y(0.5975), { renk: R.soluk, kalin: 1, kesik: '3 3' });
      s += S.daire(ek.X(tp), ek.Y(0.5975), 4.5, { dolgu: R.metin, renk: R.zemin, kalin: 1 });
      s += S.zeminliYazi(ek.X(tp), ek.Y(0.27), 'Page zamanı', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.zeminliYazi(ek.X(tp), ek.Y(0.27) + 17, "ömrün ≈ %54'ü", { boy: 13, hiza: 'middle', renk: R.metin });
      /* gösterge */
      const g = (y, o, metin) => S.cizgi(64, y - 4, 92, y - 4, o) + S.yazi(98, y, metin, { boy: 13, renk: R.metin });
      s += g(ek.Y(1.5), { renk: R.vurgu, kalin: 3.4 }, 'Page eğrisi: bilgi dışarı çıkarsa');
      s += g(ek.Y(1.5) + 19, { renk: R.uyari, kalin: 2.2, kesik: '8 5' }, "Hawking'in hesabı: hep artar");
      s += g(ek.Y(1.5) + 38, { renk: R.metin, kalin: 2, kesik: '2 4' }, 'kara deliğin entropisi (tavan)');
      s += etiket(S, 200, 312, 'Kuram / hipotez: hiç ölçülmedi', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* ================================================================ d53 ================================================================ */

  /* d53 · bölüm 2: uzunluk merdiveni, 1 m'den Planck uzunluğuna (NIST CODATA 2022) */
  C.ekle('d53-uzunluk-merdiveni', {
    ders: 'd53', bolum: 2, oran: 1.1,
    baslik: "Doğanın cetveli: insandan Planck uzunluğuna 35 basamak",
    aciklama: "Dikey eksen uzunluktur, metre cinsinden ve logaritmik: her çentik 100 bin kat. Yukarıda 1,7 metrelik bir insan, sonra Eöt-Wash deneyinin ek boyutlara koyduğu 30 mikrometrelik sınır, sonra 8,4 çarpı 10 üzeri eksi 16 metrelik proton. LHC 13,6 teraelektronvoltla yaklaşık 1,5 çarpı 10 üzeri eksi 20 metreye kadar yoklayabilir; sol kenardaki şerit deneylerin ulaştığı bölgedir. Ondan aşağıdaki yaklaşık 15 basamağa hiçbir deney ulaşmadı. En altta Klein'ın 1926'da beşinci boyut için önerdiği yaklaşık 10 üzeri eksi 32 metre ve 1,616 çarpı 10 üzeri eksi 35 metrelik Planck uzunluğu var. Proton, Planck uzunluğundan yaklaşık 5 çarpı 10 üzeri 19 kat büyüktür. Planck uzunluğunun doğadaki en küçük uzunluk olduğu kanıtlanmadı: kuram ya da hipotez.",
    kaynak: [KAYNAK.planckUz, KAYNAK.planckBirim, KAYNAK.nist, KAYNAK.kaluza, KAYNAK.eotwash],
    ciz(S) {
      const R = S.R, ax = 80, Y = l => 40 + (1 - l) / 37 * 346;
      let s = '';
      s += S.kutu(ax + 4, Y(0.23), 7, Y(-19.84) - Y(0.23), { dolgu: R.vurguSoluk, renk: R.vurgu, kalin: 1 }, 2);
      s += S.cizgi(ax, Y(1), ax, Y(-36), { renk: R.soluk, kalin: 1.5 });
      [0, -5, -10, -15, -20, -25, -30, -35].forEach(l => {
        s += S.cizgi(ax - 5, Y(l), ax, Y(l), { renk: R.soluk, kalin: 1 });
        s += S.yazi(ax - 8, Y(l) + 4, l === 0 ? '1 m' : on(l), { boy: 13, hiza: 'end', renk: R.soluk });
      });
      const nok = [
        [0.23, 'insan boyu: 1,7 m', 0], [-4.52, 'Eöt-Wash ek boyut sınırı: 30 μm', 0], [-15.08, 'proton: 8,4 × 10⁻¹⁶ m', 0],
        [-19.84, "LHC'nin ulaştığı: ≈ 1,5 × 10⁻²⁰ m", 0], [-32, "Klein'ın önerisi (1926): ≈ 10⁻³² m", -6], [-34.79, 'Planck uzunluğu: 1,616 × 10⁻³⁵ m', 6]
      ];
      nok.forEach(([l, t, dy]) => {
        const y = Y(l);
        s += S.daire(ax, y, 4.5, { dolgu: R.metin, renk: R.zemin, kalin: 1 });
        s += S.yol(`M${ax + 14},${y} L${118},${y + dy}`, { renk: R.soluk, kalin: 1 });
        s += S.yazi(122, y + dy + 4, t, { boy: 13, renk: R.metin, kalin: l < -34 });
      });
      s += S.yazi(122, Y(-9.6), 'bu aralık deneyle yoklandı', { boy: 13, renk: R.soluk, italik: true });
      s += S.yazi(122, Y(-25.2), 'bu ≈ 15 basamağa hiçbir', { boy: 13, renk: R.soluk, italik: true });
      s += S.yazi(122, Y(-25.2) + 17, 'deney ulaşmadı', { boy: 13, renk: R.soluk, italik: true });
      s += etiket(S, 200, 428, 'En küçük uzunluk mu? Kuram ya da hipotez', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* d53 · bölüm 3: yoklanan uzunluk ile gereken enerji; E = ħc ÷ L, ħc = 197,327 MeV fm (NIST) */
  C.ekle('d53-uzunluk-enerji', {
    ders: 'd53', bolum: 3, oran: 0.82,
    baslik: 'Küçüğü görmenin bedeli: uzunluk kısaldıkça gereken enerji',
    aciklama: "İki eksen de logaritmiktir. Çizgi dersteki bağıntıdır: gereken enerji, 197,327 milyon elektronvolt çarpı femtometrenin yoklanacak uzunluğa bölümü; uzunluk on kat kısalınca enerji on kat artar. Sağ altta protonun boyu yaklaşık 0,23 GeV ister. LHC 13,6 teraelektronvoltla yaklaşık 1,5 çarpı 10 üzeri eksi 20 metreye iner. Sol üstte Planck uzunluğu 1,22 çarpı 10 üzeri 19 GeV ister: LHC'nin yaklaşık 9 çarpı 10 üzeri 14 katı. Bu enerji joule olarak yaklaşık 2 milyar joule, bir otomobil deposundaki yakıt kadardır, ama tek bir parçacıkta toplanması gerekir. Soldaki kısa yatay çizgi 1991'de gözlenen en enerjik kozmik ışın parçacığıdır, yaklaşık 50 joule; o da Planck enerjisinin çok altındadır.",
    kaynak: [KAYNAK.nist, KAYNAK.planckBirim],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 66, y: 28, w: 314, h: 240 }, { x0: 1e-36, x1: 1e-14, y0: 1e-2, y1: 1e21 }, {
        logX: true, logY: true,
        xIsaret: [[1e-35, on(-35)], [1e-30, on(-30)], [1e-25, on(-25)], [1e-20, on(-20)], [1e-15, on(-15)]],
        yIsaret: [[1, '1'], [1e5, on(5)], [1e10, on(10)], [1e15, on(15)], [1e20, on(20)]],
        xAd: 'yoklanan uzunluk (metre)', yAd: 'gereken enerji (GeV)', yAdUzak: 44
      });
      const E = l => 1.97327e-16 / l;
      let s = ek.svg;
      s += S.fonk(ek, E, 1e-36, 1e-14, 30, { renk: R.metin, kalin: 2.4 }, true);
      s += S.fonk(ek, E, 1.616e-35, 1.45e-20, 10, { renk: R.uyari, kalin: 6, kesik: '4 4' }, true);
      const kr = 50 / 1.602176634e-10;
      s += S.cizgi(ek.X(1e-36), ek.Y(kr), ek.X(1e-33), ek.Y(kr), { renk: R.metin, kalin: 2, kesik: '3 3' });
      s += S.yazi(ek.X(1e-36) + 4, ek.Y(kr) + 18, 'en enerjik kozmik ışın', { boy: 13, renk: R.metin });
      s += S.yazi(ek.X(1e-36) + 4, ek.Y(kr) + 35, '(1991): 50 J', { boy: 13, renk: R.soluk });
      const nk = (l, r) => S.daire(ek.X(l), ek.Y(E(l)), r, { dolgu: R.metin, renk: R.zemin, kalin: 1.2 });
      const px = ek.X(1.616e-35), py = ek.Y(E(1.616e-35));
      s += nk(1.616e-35, 6);
      s += S.yazi(px + 14, py - 4, 'Planck: 1,22 × 10¹⁹ GeV', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(px + 40, py + 13, '≈ 2 milyar J: bir yakıt deposu', { boy: 13, renk: R.soluk });
      const lx = ek.X(1.45e-20), ly = ek.Y(E(1.45e-20));
      s += nk(1.45e-20, 5) + S.yazi(lx + 10, ly - 6, 'LHC: 13,6 TeV', { boy: 13, renk: R.metin, kalin: true });
      const mx = ek.X(1.5e-27), my = ek.Y(E(1.5e-27));
      s += S.zeminliYazi(mx + 14, my - 10, '≈ 9 × 10¹⁴ kat: ulaşılamaz', { boy: 13, renk: R.uyari, kalin: true });
      const rx = ek.X(8.41e-16), ry = ek.Y(E(8.41e-16));
      s += nk(8.41e-16, 4.5) + S.yazi(rx - 10, ry + 4, 'proton boyu: 0,23 GeV', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(ek.X(1e-35), ek.Y(1e4), '10 kat kısa uzunluk', { boy: 13, renk: R.soluk });
      s += S.yazi(ek.X(1e-35), ek.Y(1e4) + 17, '10 kat enerji ister', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d53 · bölüm 6: ek boyutlar; bahçe hortumu benzetmesi (kavramsal) ve deneysel sınırın bıraktığı aralık (ölçekli) */
  C.ekle('d53-ek-boyut', {
    ders: 'd53', bolum: 6, oran: 1.0,
    baslik: 'Kıvrılmış ek boyutlar: benzetme ve deneylerin bıraktığı aralık',
    aciklama: "Üst yarı kavramsal bir çizimdir, ölçeksizdir. Bahçe hortumu uzaktan tek boyutlu bir çizgi gibi görünür; yaklaşınca çevresinin de bir boyut olduğu, yüzeyindeki bir karıncanın iki boyutta dolaşabildiği anlaşılır. Kıvrılmış ek boyut fikri budur; benzetmenin sınırı, ek boyutların bizim uzayımızın içinde değil, kendi başına yönler olmasıdır. Alt yarı logaritmik ve ölçeklidir: en büyük ek boyutun yarıçapı. Eöt-Wash deneyi 2020'de 30 mikrometreden büyük ek boyutları dışladı; taralı bölge budur. Sicim kuramının doğal ölçeği Planck uzunluğu ise 1,6 çarpı 10 üzeri eksi 35 metredir; arada yaklaşık 30 basamaklık sınanmamış bir aralık kalır. Ek boyutlar kanıtlanmamış bir fikirdir: kuram ya da hipotez.",
    kaynak: [KAYNAK.ekBoyut, KAYNAK.kaluza, KAYNAK.eotwash, KAYNAK.planckUz],
    ciz(S) {
      const R = S.R;
      let s = '';
      s += S.yazi(8, 18, 'bahçe hortumu benzetmesi', { boy: 13, renk: R.soluk });
      s += etiket(S, 392, 18, 'kavramsal çizim', 'spek', { hiza: 'end' });
      /* uzaktan: çizgi */
      s += S.cizgi(14, 96, 150, 96, { renk: R.metin, kalin: 3, uc: 'round' });
      s += S.yazi(14, 76, 'uzaktan: bir çizgi', { boy: 13, renk: R.metin, kalin: true });
      s += S.daire(112, 96, 15, { renk: R.vurgu, kalin: 1.5, kesik: '4 3' });
      s += S.cizgi(124, 87, 210, 54, { renk: R.vurgu, kalin: 1, kesik: '4 3' }) + S.cizgi(124, 105, 210, 138, { renk: R.vurgu, kalin: 1, kesik: '4 3' });
      /* yakından: silindir */
      s += S.cizgi(216, 58, 368, 58, { renk: R.metin, kalin: 2 }) + S.cizgi(216, 134, 368, 134, { renk: R.metin, kalin: 2 });
      s += S.elips(216, 96, 12, 38, { renk: R.metin, kalin: 2 });
      s += S.yol(`M368,58 A12,38 0 0 1 368,134`, { renk: R.metin, kalin: 2 });
      s += S.elips(300, 96, 12, 38, { renk: R.vurgu, kalin: 2, kesik: '5 4' });
      s += S.ok(312, 92, 310, 112, { renk: R.vurgu, kalin: 2, boy: 7 });
      s += S.elips(286, 68, 4, 3, { dolgu: R.metin, renk: 'none' }) + S.daire(291, 66, 2, { dolgu: R.metin, renk: 'none' });
      s += S.yazi(292, 158, 'yakından: çevresi de bir boyut', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(292, 175, 'karınca iki boyutta dolaşır', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.cizgi(8, 196, 392, 196, { renk: R.cizgi, kalin: 1 });
      /* ölçekli alt yarı */
      const X = l => 26 + (l + 36) / 34 * 348, ya = 270;
      s += S.yazi(8, 218, 'en büyük ek boyutun yarıçapı (ölçekli)', { boy: 13, renk: R.soluk });
      s += S.kutu(X(-34.79), ya - 16, X(-4.52) - X(-34.79), 32, { dolgu: R.vurguSoluk, renk: 'none' });
      s += S.kutu(X(-4.52), ya - 16, X(-2) - X(-4.52), 32, { renk: R.metin, kalin: 1.2 });
      /* tarama: 45° çizgiler, kutuya kırpılmış */
      const k0 = X(-4.52), k1 = X(-2);
      for (let c = k0 - 32 + 6; c < k1; c += 7) {
        const xa = Math.max(k0, c), xb = Math.min(k1, c + 32);
        if (xb > xa) s += S.cizgi(xa, ya + 16 - (xa - c), xb, ya + 16 - (xb - c), { renk: R.metin, kalin: 1 });
      }
      s += S.zeminliYazi(X(-19.5), ya + 5, 'henüz sınanmadı: ≈ 30 basamak', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(392, ya - 24, 'dışlandı: Eöt-Wash 2020', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.cizgi(X(-36), ya + 16, X(-2), ya + 16, { renk: R.soluk, kalin: 1 });
      [-35, -30, -25, -20, -15, -10, -5].forEach(l => {
        s += S.cizgi(X(l), ya + 16, X(l), ya + 21, { renk: R.soluk, kalin: 1 });
        s += S.yazi(X(l), ya + 35, on(l), { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.yazi(X(-2), ya + 35, 'm', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.ok(X(-34.79), ya + 70, X(-34.79), ya + 40, { renk: R.metin, kalin: 1.5, boy: 6 }) + S.yazi(X(-34.79) - 2, ya + 84, 'Planck uzunluğu', { boy: 13, renk: R.metin });
      s += S.ok(X(-4.52), ya + 70, X(-4.52), ya + 40, { renk: R.metin, kalin: 1.5, boy: 6 }) + S.yazi(X(-4.52) + 4, ya + 84, '30 μm', { boy: 13, hiza: 'end', renk: R.metin });
      s += etiket(S, 200, 390, 'Kesinlik: kuram ya da hipotez', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* ================================================================ d54 ================================================================ */

  /* d54 · bölüm 4: yavaş yuvarlanma; biçim Starobinsky tipi bir örnek, V = (1 − e^−φ)², ölçeksiz */
  C.ekle('d54-yokus', {
    ders: 'd54', bolum: 4, oran: 0.78,
    baslik: 'Şişme nasıl biter: yokuştan yuvarlanan alan',
    aciklama: "Bu kavramsal bir çizimdir, eksenlerde sayı yoktur. Yatay eksen şişirici alanın değeri, dikey eksen alanın enerjisidir; eğrinin biçimi Planck verileriyle uyumlu iç bükey modellerden birinin, Starobinsky tipi bir potansiyelin örneğidir. Solda uzun ve neredeyse düz bir yokuş var: alan burada çok yavaş yuvarlandığı sürece şişme sürer. Sağda yokuş dikleşir, alan hızlanır ve dibin çevresinde salınır; bu salınımın enerjisi sıcak parçacıklara dönüşür, buna yeniden ısınma denir ve sıcak Büyük Patlama evresi buradan başlar. Top uzayda bir cisim değildir, uzayın her noktasındaki alanın değeridir. Hangi alanın hangi yokuştan yuvarlandığı bilinmiyor: kuram ya da hipotez. Ardından gelen sıcak evre ise gözlemle kesinleşmiştir.",
    kaynak: [KAYNAK.sisme, KAYNAK.planckX],
    ciz(S) {
      const R = S.R, X = f => 360 - (f + 0.55) / 6.05 * 300, Yv = v => 236 - v * 150, V = f => Math.pow(1 - Math.exp(-f), 2);
      let s = '';
      s += S.ok(48, 246, 388, 246, { renk: R.soluk, kalin: 1.5, boy: 8 }) + S.ok(48, 246, 48, 52, { renk: R.soluk, kalin: 1.5, boy: 8 });
      s += S.yazi(388, 264, 'alanın değeri', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(36, 150, 'alanın enerjisi', { boy: 13, hiza: 'middle', renk: R.soluk, yan: -90 });
      const ls = []; for (let i = 0; i <= 120; i++) { const f = 5.5 - i * 6.05 / 120; ls.push([X(f), Yv(V(f))]); }
      s += S.egri(ls, { renk: R.metin, kalin: 3 });
      const bx = X(4.2), by = Yv(V(4.2)) - 9;
      s += S.daire(bx, by, 8, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 });
      s += S.ok(bx + 14, by - 6, bx + 70, by - 4, { renk: R.vurgu, kalin: 2, boy: 8 });
      s += S.yazi(64, 50, 'yavaş yuvarlanır:', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(64, 67, 'şişme sürer', { boy: 13, renk: R.metin });
      const mx = X(0), my = Yv(0);
      s += S.yay(mx, my - 14, 14, 200, 340, { renk: R.vurgu, kalin: 2 });
      s += S.yay(mx, my - 14, 22, 205, 335, { renk: R.vurgu, kalin: 1.5 });
      s += S.yazi(64, 192, 'dipte salınır: yeniden ısınma', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(64, 209, '→ sıcak Büyük Patlama başlar', { boy: 13, renk: R.metin });
      s += S.cizgi(258, 196, mx - 26, my - 14, { renk: R.soluk, kalin: 1 });
      s += etiket(S, 392, 20, 'kavramsal çizim', 'spek', { hiza: 'end' });
      s += etiket(S, 200, 300, 'Kesinlik: kuram ya da hipotez', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* d54 · bölüm 7: n_s–r düzlemi; Planck 2018, ACT 2025, r sınırları, BICEP2 2014 duyurusu, φ² ve R² öngörüleri (N = 50–60) */
  C.ekle('d54-ns-r', {
    ders: 'd54', bolum: 7, oran: 1.0,
    baslik: 'Şişmenin karnesi: n_s ölçüldü, r için yalnız üst sınır var',
    aciklama: "Yatay eksen spektral indeks, dikey eksen tensör skaler oranı, yani ilksel kütleçekim dalgalarının gücüdür. Dikey dolu şerit Planck 2018'in ölçümüdür, 0,9649 artı eksi 0,0042; kesikli şerit ACT'nin 2025 değeri, 0,974 artı eksi 0,003. İkisi de sağ kenardaki 1 çizgisinden belirgin biçimde küçüktür. Yatay çizgiler r için konan üst sınırlardır: Planck tek başına 0,10, BICEP ve Keck ile 0,056, BICEP ve Keck 2021'de 0,036; bunun üstü gölgeli bölgedir ve yüzde 95 güvenle dışlandı. En üstteki kesikli çizgi BICEP2'nin 2014'te duyurduğu 0,20'dir; işaretin galaktik tozdan geldiği anlaşıldı. Kalın kısa çizgiler Planck makalelerindeki formüllerle, 50 ile 60 e katlanma için hesaplandı: fi kare modeli dışlanan bölgede, Starobinsky modeli sınırın altında kalır. İlksel kütleçekim dalgaları henüz gözlenmedi: kuram ya da hipotez.",
    kaynak: [KAYNAK.planckX, KAYNAK.planck13, KAYNAK.act, KAYNAK.bk, KAYNAK.physToday],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 60, y: 30, w: 320, h: 270 }, { x0: 0.94, x1: 1.0, y0: 0, y1: 0.25 }, {
        xIsaret: [[0.94, '0,94'], [0.95, '0,95'], [0.96, '0,96'], [0.97, '0,97'], [0.98, '0,98'], [0.99, '0,99'], [1, '1']],
        yIsaret: [[0, '0'], [0.05, '0,05'], [0.1, '0,10'], [0.15, '0,15'], [0.2, '0,20'], [0.25, '0,25']],
        xAd: 'spektral indeks n_s', yAd: 'tensör-skaler oranı r', yAdUzak: 44
      });
      let s = '';
      s += S.kutu(ek.X(0.94), ek.Y(0.25), 320, ek.Y(0.036) - ek.Y(0.25), { dolgu: R.soluk, renk: 'none', saydam: 0.13 });
      s += S.kutu(ek.X(0.9607), ek.Y(0.25), ek.X(0.9691) - ek.X(0.9607), 270, { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.95 });
      s += S.kutu(ek.X(0.971), ek.Y(0.25), ek.X(0.977) - ek.X(0.971), 270, { renk: R.metin, kalin: 1.2, kesik: '5 4' });
      s += ek.svg;
      s += S.cizgi(ek.X(1), ek.Y(0), ek.X(1), ek.Y(0.25), { renk: R.metin, kalin: 1, kesik: '2 3' });
      [[0.10, 'Planck tek başına: r < 0,10', '3 4', 1], [0.056, 'Planck + BICEP/Keck: r < 0,056', '3 4', 1], [0.036, 'BICEP/Keck 2021: r < 0,036', null, 2.2]].forEach(([r, t, k, kl]) => {
        s += S.cizgi(ek.X(0.94), ek.Y(r), ek.X(1), ek.Y(r), { renk: R.metin, kalin: kl, kesik: k });
        s += S.zeminliYazi(ek.X(0.998), ek.Y(r) - 5, t, { boy: 13, hiza: 'end', renk: R.metin, kalin: r < 0.04 });
      });
      s += S.cizgi(ek.X(0.94), ek.Y(0.2), ek.X(1), ek.Y(0.2), { renk: R.uyari, kalin: 2, kesik: '8 5' });
      s += S.zeminliYazi(ek.X(0.9415), ek.Y(0.2) - 6, 'BICEP2, 2014: r = 0,20 → galaktik toz', { boy: 13, renk: R.uyari, kalin: true });
      s += S.zeminliYazi(ek.X(0.9415), ek.Y(0.236), 'Planck 2018: n_s = 0,9649 ± 0,0042', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(ek.X(0.9716), ek.Y(0.13), 'ACT 2025: 0,974 ± 0,003', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(ek.X(0.999), ek.Y(0.236), 'n_s = 1', { boy: 13, hiza: 'end', renk: R.soluk });
      /* model öngörüleri (N = 50 … 60) */
      const fi2 = N => [1 - 4 / (2 * N + 1), 16 / (2 * N + 1)], r2 = N => [1 - 2 / N, 12 / (N * N)];
      [fi2, r2].forEach(f => {
        const a = f(50), b = f(60);
        s += S.cizgi(ek.X(a[0]), ek.Y(a[1]), ek.X(b[0]), ek.Y(b[1]), { renk: R.metin, kalin: 5, uc: 'round' });
      });
      s += S.zeminliYazi(ek.X(0.9675) + 8, ek.Y(0.163), 'φ² modeli: elendi', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(ek.X(0.9618), ek.Y(0.016), 'Starobinsky R² (N = 50–60)', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(ek.X(0.9415), ek.Y(0.085), 'gölgeli: dışlandı', { boy: 13, renk: R.soluk });
      s += etiket(S, 200, 386, 'r henüz ölçülmedi: kuram ya da hipotez', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* d54 · bölüm 10: Tegmark'ın dört düzeyi; kavramsal simgeler ve dersin kesinlik etiketleri */
  C.ekle('d54-tegmark', {
    ders: 'd54', bolum: 10, oran: 1.3,
    baslik: "Tegmark'ın dört düzeyi ve kesinlik etiketleri",
    aciklama: "Bu kavramsal bir çizimdir; simgeler yalnızca fikri anlatır, hiçbir başka evren gözlenmedi. Birinci düzey ufkumuzun ötesindeki bölgelerdir: ortadaki dolu daire bizim gözlenebilir evrenimiz, kesikli daireler ışığı bize hiç ulaşmayacak komşu bölgeler. Ufkun ötesinde uzay olması güçlü kanıtlı ama açık sorulu bir çıkarımdır; orada kopyalarımızın bulunması spekülasyondur. İkinci düzey sonsuz şişmenin baloncuklarıdır, yasaları farklı olabilir: spekülasyon. Üçüncü düzey Everett'in haberleşmeyen kuantum dallarıdır: kuram ya da hipotez. Dördüncü düzey her matematiksel yapının fiziksel olarak da var olduğu fikridir: spekülasyon. Etiketler dersin değerlendirmesidir, Tegmark'ın değil.",
    kaynak: [KAYNAK.tegmark],
    ciz(S) {
      const R = S.R, sat = 118;
      let s = S.yazi(8, 18, 'kavramsal çizim; simgeler ölçeksiz', { boy: 13, renk: R.soluk, italik: true });
      const satir = [
        ['I. Düzey: ufkun ötesi', ['Aynı yasalar, başka başlangıçlar.', 'Kopyalar ancak uzay sonsuzsa.'], [['ufkun ötesi: güçlü kanıtlı', 'guclu'], ['kopyalar: spekülasyon', 'spek']]],
        ['II. Düzey: şişme baloncukları', ['Sonsuz şişmenin cep evrenleri;', 'sabitler farklı olabilir.'], [['spekülasyon', 'spek']]],
        ['III. Düzey: kuantum dalları', ['Everett: ölçüm evreni', 'haberleşmeyen dallara ayırır.'], [['kuram ya da hipotez', 'kuram']]],
        ['IV. Düzey: matematiksel yapılar', ['Her matematiksel yapı gerçek mi?', 'Felsefeye en yakın düzey.'], [['spekülasyon', 'spek']]]
      ];
      satir.forEach(([bas, satirlar, et], i) => {
        const y0 = 30 + i * sat, cx = 56, cy = y0 + 56;
        if (i) s += S.cizgi(8, y0, 392, y0, { renk: R.cizgi, kalin: 1 });
        s += S.yazi(112, y0 + 22, bas, { boy: 14, renk: R.metin, kalin: true });
        satirlar.forEach((t, k) => s += S.yazi(112, y0 + 42 + k * 17, t, { boy: 13, renk: R.soluk }));
        et.forEach(([t, tur], k) => s += etiket(S, 112, y0 + 84 + k * 27, t, tur));
        if (i === 0) {
          for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; s += S.daire(cx + 30 * Math.cos(a), cy + 30 * Math.sin(a), 13, { renk: R.soluk, kalin: 1.2, kesik: '3 3' }); }
          s += S.daire(cx, cy, 14, { dolgu: R.vurguSoluk, renk: R.metin, kalin: 2 }) + S.yazi(cx, cy + 4, 'biz', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
        } else if (i === 1) {
          s += S.kutu(10, y0 + 12, 92, 88, { renk: R.soluk, kalin: 1, kesik: '2 3' }, 10);
          [[34, cy - 18, 15, null], [74, cy - 14, 11, '5 3'], [40, cy + 22, 10, '2 3'], [76, cy + 24, 14, '8 3 2 3'], [56, cy + 2, 6, null]].forEach(([x, y, r, k]) => s += S.daire(x, y, r, { renk: R.metin, kalin: 1.6, kesik: k }));
        } else if (i === 2) {
          s += S.cizgi(14, cy, 40, cy, { renk: R.metin, kalin: 2 });
          [[-24], [24]].forEach(([d]) => {
            s += S.cizgi(40, cy, 68, cy + d, { renk: R.metin, kalin: 2 });
            [-11, 11].forEach(e => s += S.cizgi(68, cy + d, 98, cy + d + e, { renk: R.metin, kalin: 1.6 }));
          });
          s += S.daire(40, cy, 3.5, { dolgu: R.metin, renk: 'none' }) + S.daire(68, cy - 24, 3, { dolgu: R.metin, renk: 'none' }) + S.daire(68, cy + 24, 3, { dolgu: R.metin, renk: 'none' });
        } else {
          s += S.daire(32, cy - 18, 13, { renk: R.metin, kalin: 1.8 });
          s += S.yol(`M66,${cy - 31} L82,${cy - 5} L50,${cy - 5} Z`, { renk: R.metin, kalin: 1.8 });
          s += S.kutu(20, cy + 6, 24, 24, { renk: R.metin, kalin: 1.8 });
          const ls = []; for (let k = 0; k <= 30; k++) ls.push([54 + k * 1.4, cy + 18 - 10 * Math.sin(k / 30 * 2 * Math.PI)]);
          s += S.egri(ls, { renk: R.metin, kalin: 1.8 });
        }
      });
      return s;
    }
  });

  /* ================================================================ d55 ================================================================ */

  /* d55 · bölüm 8: uzak geleceğin takvimi, logaritmik zaman (karanlık enerji sabit varsayımıyla; Wikipedia ve ders bölümleri 8, 9, 12) */
  C.ekle('d55-gelecek-takvimi', {
    ders: 'd55', bolum: 8, oran: 1.42,
    baslik: 'Uzak geleceğin takvimi: logaritmik bir zaman çizelgesi',
    aciklama: "Zaman yukarıdan aşağı akar ve eksen logaritmiktir: her çentik 10 üzeri 20 kat. Bugün evren 13,8 milyar yaşında. Yaklaşık 150 milyar yılda Yerel Üstküme dışındaki galaksiler ufkun ardına geçer, 2 trilyon yılda ışıkları görülemez olur. Kırmızı cüceler yaklaşık 10 üzeri 13 yılda söner, yıldız oluşumu 10 üzeri 14 yılda biter: bütün bunlar çizelgenin en üstündeki ince dilime sığar. Sonra 10 üzeri 40 yıla kadar yozlaşmış çağ gelir; proton bozunuyorsa yarılanma ömrü en az 10 üzeri 34 yıldır. 10 üzeri 40 ile 10 üzeri 100 yıl arası kara delik çağıdır; en büyükleri 10 üzeri 106 yıla dek buharlaşır. Vakum bozunması için Standart Model hesabı yaklaşık 10 üzeri 139 yıl, yüzde 95 alt sınır 10 üzeri 58 yıl verir. Proton bozunmuyorsa demir yıldızlar 10 üzeri 1500 yılda oluşur, çizelgenin çok dışında. Hepsi bugünkü fiziğin ve sabit karanlık enerjinin sürdüğü varsayımına dayanır: kuram ya da hipotez.",
    kaynak: [KAYNAK.gelecek, KAYNAK.isilOlum, KAYNAK.andreassen],
    ciz(S) {
      const R = S.R, ax = 78, Y = l => 44 + (l - 10) / 130 * 430;
      let s = '';
      /* çağ şeritleri */
      const cag = [[10.14, 14, { dolgu: R.vurgu, renk: 'none' }], [14, 40, { dolgu: R.vurguSoluk, renk: R.metin, kalin: 1 }], [40, 100, { dolgu: R.soluk, renk: 'none', saydam: 0.55 }], [100, 140, { renk: R.metin, kalin: 1.2, kesik: '3 3' }]];
      cag.forEach(([a, b, o]) => s += S.kutu(ax + 4, Y(a), 9, Y(b) - Y(a), o, 2));
      s += S.cizgi(ax, Y(10), ax, Y(140), { renk: R.soluk, kalin: 1.5 });
      [20, 40, 60, 80, 100, 120, 140].forEach(l => {
        s += S.cizgi(ax - 5, Y(l), ax, Y(l), { renk: R.soluk, kalin: 1 });
        s += S.yazi(ax - 8, Y(l) + 4, on(l), { boy: 13, hiza: 'end', renk: R.soluk });
      });
      [[27, 'yozlaşmış çağ'], [70, 'kara delik çağı'], [120, 'karanlık çağ']].forEach(([l, t]) => s += S.yazi(20, Y(l), t, { boy: 13, hiza: 'middle', renk: R.soluk, yan: -90, italik: true }));
      s += S.yazi(8, 22, 'yıl', { boy: 13, renk: R.soluk });
      const olay = [
        [10.14, 'bugün: 13,8 milyar yıl', 30, true], [11.18, '150 milyar yıl: uzak galaksiler ufukta', 48], [12.3, '2 trilyon yıl: ışıkları görülemez', 66],
        [13, '10¹³ yıl: kırmızı cüceler söner', 84], [14, '10¹⁴ yıl: yıldız oluşumu biter', 102], [34, '≥ 10³⁴ yıl: proton bozunursa (hipotez)', 150],
        [40, '10⁴⁰ yıl: yozlaşmış çağ biter', 172], [58, '10⁵⁸ yıl: vakum bozunması, %95 alt sınır', 230],
        [100, '10¹⁰⁰ yıl: dev kara delikler buharlaşır', 371], [106, '10¹⁰⁶ yıl: en büyükleri de biter', 392], [139, '10¹³⁹ yıl: vakum bozunması, SM tahmini', 474]
      ];
      olay.forEach(([l, t, yl, k]) => {
        const y = Y(l);
        s += S.daire(ax, y, 3.5, { dolgu: R.metin, renk: R.zemin, kalin: 1 });
        s += S.yol(`M${ax + 15},${y} L112,${yl - 4}`, { renk: R.soluk, kalin: 1 });
        s += S.yazi(116, yl, t, { boy: 13, renk: R.metin, kalin: !!k });
      });
      s += S.ok(ax, Y(140) + 2, ax, Y(140) + 24, { renk: R.metin, kalin: 1.5, boy: 7 });
      s += S.yazi(ax + 10, Y(140) + 32, '10¹⁵⁰⁰ yıl: demir yıldızlar (çok dışarıda)', { boy: 13, renk: R.metin });
      s += etiket(S, 200, 552, 'Kesinlik: kuram ya da hipotez', 'kuram', { hiza: 'middle' });
      return s;
    }
  });

  /* d55 · bölüm 10: evrenin boyu a(t); ΛCDM (Planck 2018, analitik), fantom w = −1,5 (Caldwell ve ark.: H0 = 70, Ωm = 0,3; sayısal),
     Tye ve ark. çöküşü (şematik: yalnız +11 ve +20 milyar yıl duyurudan) */
  C.ekle('d55-olcek-carpani', {
    ders: 'd55', bolum: 10, oran: 0.88,
    baslik: "Üç son: ısıl ölüm, Büyük Yırtılma ve Büyük Çöküş",
    aciklama: "Yatay eksen bugünden itibaren milyar yıl, dikey eksen evrenin bugüne göre boyudur. Sol alttan gelen ortak eğri, Planck 2018 değerleriyle hesaplanan geçmiştir: Büyük Patlama 13,8 milyar yıl önce. Kalın eğri karanlık enerji kozmolojik sabitse sonsuza dek hızlanan genişlemedir, ısıl ölüme gider. Kesikli eğri w eksi 1,5 olan fantom enerjidir, Caldwell ve arkadaşlarının örneğiyle hesaplandı: boy sonsuza giderek yaklaşık 22 milyar yıl sonra Büyük Yırtılma'ya varır. Noktalı eğri Tye ve arkadaşlarının 2025 modelindeki Büyük Çöküş'tür; şematiktir, yalnızca en büyük boyun yaklaşık 11 milyar yıl, çöküşün yaklaşık 20 milyar yıl sonra olacağı bilgisi duyurudan alındı. Isıl ölüm ve Büyük Yırtılma kuram ya da hipotez, 20 milyar yıl sonraki çöküş spekülasyondur.",
    kaynak: [KAYNAK.caldwell, KAYNAK.cornell, KAYNAK.planck18, KAYNAK.isilOlum],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 56, y: 30, w: 324, h: 230 }, { x0: -14, x1: 36, y0: 0, y1: 7 }, {
        xIsaret: [[-10, '−10'], [0, '0'], [10, '10'], [20, '20'], [30, '30']],
        yIsaret: [[0, '0'], [1, '1'], [2, '2'], [4, '4'], [6, '6']],
        xAd: 'bugünden itibaren zaman (milyar yıl)', yAd: 'evrenin boyu (bugün = 1)', yAdUzak: 36
      });
      const Om = 0.3153, OL = 0.6847, tH = 977.8 / 67.36, k = 1.5 * Math.sqrt(OL) / tH;
      const tAsinh = x => Math.log(x + Math.sqrt(x * x + 1));
      const yas = tAsinh(Math.sqrt(OL / Om)) / k;                    // ≈ 13,80 milyar yıl
      const aL = t => Math.pow(Om / OL, 1 / 3) * Math.pow(Math.sinh(k * (t + yas)), 2 / 3);
      let s = ek.svg;
      s += S.cizgi(ek.X(0), ek.Y(0), ek.X(0), ek.Y(7), { renk: R.soluk, kalin: 1, kesik: '2 4' });
      const gec = []; for (let t = -yas; t <= 0.001; t += 0.1) gec.push([ek.X(t), ek.Y(aL(t))]);
      s += S.egri(gec, { renk: R.metin, kalin: 3 });
      const ileri = []; for (let t = 0; t <= 36; t += 0.25) { const a = aL(t); if (a > 7) break; ileri.push([ek.X(t), ek.Y(a)]); }
      s += S.egri(ileri, { renk: R.metin, kalin: 3 });
      /* fantom: t(a) = ∫ da / (a H), H = H0 √(Ωm a⁻³ + ΩΛ a^1,5) */
      const tH7 = 977.8 / 70, Hf = a => Math.sqrt(0.3 / (a * a * a) + 0.7 * Math.pow(a, 1.5));
      const fan = [[ek.X(0), ek.Y(1)]]; let tt = 0;
      for (let a = 1; a < 7; a += 0.01) { tt += tH7 * 0.01 / ((a + 0.005) * Hf(a + 0.005)); fan.push([ek.X(tt), ek.Y(a + 0.01)]); }
      s += S.egri(fan, { renk: R.uyari, kalin: 2.6, kesik: '8 5' });
      s += S.cizgi(ek.X(21.7), ek.Y(0), ek.X(21.7), ek.Y(7), { renk: R.uyari, kalin: 1, kesik: '3 3' });
      /* çöküş (şematik) */
      const H0g = 1 / tH, amax = 1.45, cok = [];
      for (let t = 0; t <= 20.0001; t += 0.1) {
        let a;
        if (t <= 11) { const u = t / 11, h00 = 2 * u * u * u - 3 * u * u + 1, h10 = u * u * u - 2 * u * u + u, h01 = -2 * u * u * u + 3 * u * u; a = h00 * 1 + h10 * 11 * H0g + h01 * amax; }
        else a = amax * Math.pow(Math.max(0, Math.sin(Math.PI / 2 * (20 - t) / 9)), 2 / 3);
        cok.push([ek.X(t), ek.Y(Math.max(0, a))]);
      }
      s += S.egri(cok, { renk: R.metin, kalin: 2.4, kesik: '2 4' });
      s += S.yazi(ek.X(22.2), ek.Y(0.3), 'Yırtılma: 22', { boy: 13, renk: R.uyari, kalin: true });
      s += S.yazi(ek.X(18.6), ek.Y(0.14), 'Çöküş: 20 →', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(ek.X(-13.6), ek.Y(1.4), 'Büyük Patlama: −13,8', { boy: 13, renk: R.metin });
      s += S.cizgi(ek.X(-13.4), ek.Y(1.2), ek.X(-13.75), ek.Y(0.08), { renk: R.soluk, kalin: 1 });
      /* gösterge */
      const g = (a, o, t) => S.cizgi(ek.X(-13.5), ek.Y(a) - 4, ek.X(-10), ek.Y(a) - 4, o) + S.yazi(ek.X(-9.4), ek.Y(a), t, { boy: 13, renk: R.metin });
      s += g(6.6, { renk: R.metin, kalin: 3 }, 'sabit Λ: ısıl ölüm');
      s += g(6.0, { renk: R.uyari, kalin: 2.6, kesik: '8 5' }, 'fantom: Büyük Yırtılma');
      s += g(5.4, { renk: R.metin, kalin: 2.4, kesik: '2 4' }, 'çöküş (şematik)');
      s += S.yazi(ek.X(-13.5), ek.Y(4.75), 'ilk ikisi kuram ya da hipotez,', { boy: 13, renk: R.soluk });
      s += S.yazi(ek.X(-13.5), ek.Y(4.75) + 17, 'çöküş spekülasyon', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d55 · bölüm 14: başlangıç ve son senaryoları kesinlik ölçeğinde (ders bölüm 14'ün tablosu) */
  C.ekle('d55-kesinlik-haritasi', {
    ders: 'd55', bolum: 14, oran: 1.17,
    baslik: 'Başlangıç ve son: senaryoların kesinlik haritası',
    aciklama: "Satırlar ünitenin kesinlik ölçeğidir, yukarıdan aşağı azalan kesinlikle; sol sütun evrenin başlangıcı, sağ sütun sonu için. Her satırın çerçevesi farklı çizgiyle çizildi: düz kalın gözlemle kesinleşmiş, düz ince güçlü kanıtlı ama açık sorulu, kesikli kuram ya da hipotez, noktalı askıda, kesik noktalı spekülasyon. Gözlemle kesinleşmiş olanlar 13,8 milyar yıllık sıcak evrim, genişleme ve hızlanması, Higgs ve üst kuark kütleleridir. Başlangıç senaryolarının hepsi kuram ya da hipotez ya da spekülasyon basamağındadır. Sonda ısıl ölüm, Büyük Yırtılma ve vakum bozunması hesabı kuram ya da hipotez, DESI'nin işareti askıda, 20 milyar yıl sonraki çöküş spekülasyondur. Basamak bir sıralama değil, bugün eldeki gözlemin ölçüsüdür.",
    kaynak: [KAYNAK.gelecek, KAYNAK.caldwell, KAYNAK.andreassen, KAYNAK.cornell],
    ciz(S) {
      const R = S.R;
      let s = '';
      s += S.yazi(104, 20, 'BAŞLANGIÇ', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(298, 20, 'SON', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      const satir = [
        ['Gözlemle kesinleşmiş', 'kesin', ['sıcak, yoğun bir hâlden', '13,8 milyar yıllık evrim'], ['bugünkü genişleme', 'genişlemenin hızlanması', 'Higgs, üst kuark kütleleri']],
        ['Güçlü kanıtlı ama açık sorulu', 'guclu', [], ['karanlık enerjinin varlığı', 'yıldızların sönmesi']],
        ['Kuram ya da hipotez', 'kuram', ['Hartle–Hawking önerisi', 'sıçrayan evren', 'ekpirotik model'], ['ısıl ölüm', 'Büyük Yırtılma', 'vakum bozunması hesabı', 'proton bozunması', 'kara delik buharlaşması']],
        ['Askıda', 'askida', [], ['zayıflayan karanlık enerji']],
        ['Spekülasyon', 'spek', ['Penrose döngüleri', 'Hawking noktaları', 'sıçramanın yaşanmışlığı'], ['20 milyar yıl sonra çöküş']]
      ];
      let y = 32;
      satir.forEach(([ad, tur, b, son]) => {
        const n = Math.max(b.length, son.length, 1), h = 30 + n * 18;
        s += S.kutu(6, y, 388, h, { renk: R.metin, kalin: KES[tur].kalin, kesik: KES[tur].kesik }, 6);
        s += S.yazi(16, y + 19, ad, { boy: 13, renk: R.metin, kalin: true });
        s += S.cizgi(200, y + 26, 200, y + h - 6, { renk: R.cizgi, kalin: 1 });
        (b.length ? b : ['—']).forEach((t, i) => s += S.yazi(16, y + 42 + i * 18, (b.length ? '• ' : '') + t, { boy: 13, renk: b.length ? R.metin : R.soluk }));
        son.forEach((t, i) => s += S.yazi(210, y + 42 + i * 18, '• ' + t, { boy: 13, renk: R.metin }));
        y += h + 8;
      });
      return s;
    }
  });

  /* ================================================================ d56 ================================================================ */

  /* d56 · bölüm 1: Kruskal–Szekeres haritası, kavramsal; ufuklar 45°, tekillikler T² − X² = 1 */
  C.ekle('d56-schwarzschild-haritasi', {
    ders: 'd56', bolum: 1, oran: 0.98,
    baslik: "Schwarzschild çözümünün bütün haritası: dört bölge",
    aciklama: "Bu kavramsal bir çizimdir: Kruskal ve Szekeres'in haritasıdır, zaman yukarı doğru akar ve ışık 45 derecelik çizgilerle yol alır. Çapraz iki çizgi olay ufuklarıdır, üstteki ve alttaki kalın kesikli eğriler tekilliklerdir. Sağdaki birinci bölge bizim dış evrenimizdir: gözlemle kesinleşmiş. Üstteki ikinci bölge kara deliğin içidir; girilir ama çıkılmaz, ince oklu eğri ufku geçip tekilliğe düşen bir gözlemcidir. Alttaki üçüncü bölge beyaz deliğin içidir: içinden her şey dışarı çıkar ama girilemez. Soldaki dördüncü bölge ikinci bir dış bölgedir. Yatay noktalı çizgi bir anlık kesittir; iki dış bölgeyi birleştiren Einstein-Rosen köprüsü burada görünür. Üçüncü ve dördüncü bölgeler yalnız ebedî, boş bir kara delikte vardır; çökmeyle doğan gerçek kara deliklerde kalkar. Beyaz deliklerin ve ikinci evrenin gerçekte var olması spekülasyondur.",
    kaynak: [KAYNAK.beyazDelik, KAYNAK.solucan],
    ciz(S) {
      const R = S.R, cx = 200, cy = 198, u = 104, P = (X, T) => [cx + X * u, cy - T * u];
      let s = '';
      const a = P(-1.45, -1.45), b = P(1.45, 1.45), c = P(-1.45, 1.45), d = P(1.45, -1.45);
      s += S.cizgi(a[0], a[1], b[0], b[1], { renk: R.metin, kalin: 2 }) + S.cizgi(c[0], c[1], d[0], d[1], { renk: R.metin, kalin: 2 });
      [1, -1].forEach(sg => {
        const ls = []; for (let X = -1.04; X <= 1.0401; X += 0.04) ls.push(P(X, sg * Math.sqrt(1 + X * X)));
        s += S.egri(ls, { renk: R.metin, kalin: 4, kesik: '6 4' });
      });
      s += S.yazi(cx, cy - 1.3 * u - 26, 'tekillik', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(cx, cy + 1.3 * u + 34, 'tekillik', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.cizgi(P(-1.45, 0)[0], cy, P(1.45, 0)[0], cy, { renk: R.soluk, kalin: 1.5, kesik: '2 4' });
      const bolge = (X, T, satirlar) => satirlar.map((t, i) => S.yazi(P(X, T)[0], P(X, T)[1] + i * 17, t, { boy: i ? 13 : 16, hiza: 'middle', renk: R.metin, kalin: !i })).join('');
      s += bolge(1.13, 0.4, ['I', 'bizim dış', 'evrenimiz']);
      s += bolge(-1.13, 0.4, ['IV', 'ikinci dış', 'bölge']);
      s += bolge(0, 0.86, ['II', 'kara delik içi']);
      s += bolge(0, -0.58, ['III', 'beyaz delik içi']);
      s += S.zeminliYazi(cx, cy + 22, 'Einstein-Rosen köprüsü (bir an)', { boy: 13, hiza: 'middle', renk: R.metin });
      /* düşen gözlemci: I'den II'ye */
      const g1 = P(0.66, -0.55), g2 = P(0.6, 0.45), g3 = P(0.25, 1.03);
      s += S.yol(`M${g1[0]},${g1[1]} Q${g2[0]},${g2[1]} ${g3[0]},${g3[1]}`, { renk: R.vurgu, kalin: 2 });
      s += S.ok(P(0.33, 0.95)[0], P(0.33, 0.95)[1], g3[0], g3[1], { renk: R.vurgu, kalin: 2, boy: 8 });
      /* beyaz delikten çıkan */
      const w1 = P(0.15, -1.0), w2 = P(1.05, -0.38);
      s += S.ok(w1[0], w1[1], w2[0], w2[1], { renk: R.metin, kalin: 1.5, boy: 7, kesik: '5 3' });
      s += S.ok(16, 372, 16, 330, { renk: R.soluk, kalin: 1.2, boy: 6 }) + S.ok(16, 372, 58, 372, { renk: R.soluk, kalin: 1.2, boy: 6 });
      s += S.yazi(22, 334, 'zaman', { boy: 13, renk: R.soluk }) + S.yazi(62, 376, 'uzay', { boy: 13, renk: R.soluk });
      s += etiket(S, 8, 22, 'I: gözlemle kesinleşmiş', 'kesin');
      s += etiket(S, 392, 22, 'II: kuramın sağlam sonucu', 'guclu', { hiza: 'end' });
      s += etiket(S, 392, 384, 'III ve IV: Spekülasyon', 'spek', { hiza: 'end' });
      return s;
    }
  });

  /* d56 · bölüm 6: Flamm paraboloidi; r(z) = rs + z² ÷ (4 rs), bir anlık kesitin gömme çizimi */
  C.ekle('d56-einstein-rosen', {
    ders: 'd56', bolum: 6, oran: 0.95,
    baslik: 'Einstein-Rosen köprüsü: bir anlık kesitin biçimi',
    aciklama: "Bu kavramsal bir çizimdir, ama biçimi Flamm'ın 1916 formülünden hesaplandı: Schwarzschild çözümünün bir anlık kesitinde, iki boyuta indirgenmiş uzay huni gibi bükülür. Üst yaprak bizim dış evrenimizdir, alt yaprak haritadaki ikinci dış bölgedir; ikisi en dar yerde, Schwarzschild yarıçapındaki boğazda birleşir. Dışarıdaki üçüncü boyut yalnızca bükülmeyi gösterebilmek içindir, eğrilik uzay-zamanın kendi içinde tanımlanır. Fuller ve Wheeler 1962'de bu köprünün ışık bile geçemeden kapandığını gösterdi: içinden geçilemez. Bu köprü yalnız ebedî kara delik çözümünde vardır; evrende böyle bir köprünün bulunması spekülasyondur.",
    kaynak: [KAYNAK.solucan, KAYNAK.beyazDelik, KAYNAK.morris],
    ciz(S) {
      const R = S.R, cx = 200, cy = 188, rs = 34, zm = 128, ez = 0.16, r = z => rs + z * z / (4 * rs);
      let s = '';
      const yan = sg => { const ls = []; for (let z = -zm; z <= zm + 0.01; z += 4) ls.push([cx + sg * r(z), cy - z]); return S.egri(ls, { renk: R.metin, kalin: 2.4 }); };
      [-zm, -78, -36, 36, 78, zm].forEach(z => s += S.elips(cx, cy - z, r(z), r(z) * ez, { renk: R.metin, kalin: Math.abs(z) === zm ? 2 : 1, kesik: Math.abs(z) === zm ? null : '3 3' }));
      [30, 90, 150].forEach(a => {
        const ls = []; for (let z = -zm; z <= zm + 0.01; z += 4) ls.push([cx + r(z) * Math.cos(a * Math.PI / 180), cy - z + r(z) * ez * Math.sin(a * Math.PI / 180)]);
        s += S.egri(ls, { renk: R.soluk, kalin: 1 });
      });
      s += yan(1) + yan(-1);
      s += S.elips(cx, cy, rs, rs * ez, { renk: R.vurgu, kalin: 3 });
      s += S.ok(260, cy - 4, cx + rs + 6, cy, { renk: R.vurgu, kalin: 1.5, boy: 7 });
      s += S.yazi(264, cy - 6, 'boğaz:', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(264, cy + 11, 'Schwarzschild', { boy: 13, renk: R.metin });
      s += S.yazi(264, cy + 28, 'yarıçapı', { boy: 13, renk: R.metin });
      s += S.yazi(10, cy - 8, 'ışık bile geçemeden', { boy: 13, renk: R.soluk });
      s += S.yazi(10, cy + 9, 'kapanır (1962)', { boy: 13, renk: R.soluk });
      s += S.yazi(392, 22, 'üst yaprak: bizim evrenimiz', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(392, 370, 'alt yaprak: ikinci dış bölge', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(8, 22, 'kavramsal çizim', { boy: 13, renk: R.soluk, italik: true });
      s += etiket(S, 8, 370, 'Spekülasyon', 'spek');
      return s;
    }
  });

  /* d56 · bölüm 10: 1 yıl yolculuk edenin dönüşte ne kadar ileride olduğu (γ − 1) × 1 yıl; logaritmik saniye */
  C.ekle('d56-gelecege-yolculuk', {
    ders: 'd56', bolum: 10, oran: 0.8,
    baslik: 'Geleceğe yolculuk: bir yıllık yolculuğun kazancı',
    aciklama: "Çubuklar, kendi saatine göre bir yıl yolculuk eden birinin döndüğünde Dünya'ya göre ne kadar ileride olacağını gösterir; eksen logaritmiktir. Uluslararası Uzay İstasyonu'nun saniyede 7,7 kilometrelik hızında kazanç yalnızca yaklaşık 0,01 saniyedir; Krikalev 803 günde yaklaşık 0,02 saniye ileri gitti. CERN'de 1977'de çember üstünde döndürülen müonların Lorentz çarpanı 29,3'tü ve ömürleri bu kadar uzun ölçüldü: o hızda bir yıl, Dünya'da yaklaşık 29 yıl eder, yani yaklaşık 28 yıl ileri. Kesikli çubuk Interstellar filmindeki Miller gezegenidir: orada bir saat Dünya'da yedi yıl eder, bir yıl ise yaklaşık 61 bin yıl; bu ancak çok hızlı dönen bir kara delikle mümkün olan, filmin seçtiği bir durumdur. Hız ve kütleçekiminin zamanı yavaşlattığı gözlemle kesinleşmiştir.",
    kaynak: [KAYNAK.krikalev, KAYNAK.zamanGen, KAYNAK.interstellar],
    ciz(S) {
      const R = S.R, X = l => 124 + (l + 3) / 16 * 258, yil = 3.15576e7;
      let s = '';
      const satir = [
        [L10(7700 * 7700 / (2 * 299792458 * 299792458) * yil), 'ISS hızı', '7,7 km/s', '≈ 0,01 s', 'Krikalev 803 günde: ≈ 0,02 s', 'dolu'],
        [L10(28.327 * yil), 'CERN müonları', 'γ = 29,3', '≈ 28 yıl', 'ölçüldü: CERN 1977', 'dolu'],
        [L10((7 * 365.25 * 24 - 1) * yil), 'Miller gezegeni', '(film)', '≈ 61.000 yıl', 'kurgu: çok hızlı dönen kara delik ister', 'bos']
      ];
      satir.forEach(([l, a1, a2, deger, alt, tur], i) => {
        const y = 40 + i * 62;
        s += S.yazi(8, y + 4, a1, { boy: 13, renk: R.metin, kalin: true });
        s += S.yazi(8, y + 21, a2, { boy: 13, renk: R.soluk });
        if (tur === 'dolu') s += S.kutu(X(-3), y - 8, X(l) - X(-3), 18, { dolgu: R.vurgu, renk: 'none' }, 2);
        else s += S.kutu(X(-3), y - 8, X(l) - X(-3), 18, { renk: R.metin, kalin: 1.8, kesik: '6 4' }, 2);
        if (i === 2) s += S.zeminliYazi(X(l) - 8, y + 6, deger, { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
        else s += S.yazi(X(l) + 6, y + 6, deger, { boy: 13, renk: R.metin, kalin: true });
        s += S.yazi(X(-3), y + 28, alt, { boy: 13, renk: R.soluk });
      });
      const ya = 222;
      s += S.cizgi(X(-3), ya, X(13), ya, { renk: R.soluk, kalin: 1 });
      [[-3, '1 ms'], [0, '1 s'], [L10(3600), '1 saat'], [L10(yil), '1 yıl'], [L10(1000 * yil), '1000 yıl']].forEach(([l, t]) => {
        s += S.cizgi(X(l), ya, X(l), ya + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(l), ya + 20, t, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.yazi(200, ya + 42, 'dönüşte ne kadar ileride (logaritmik)', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += etiket(S, 200, 304, 'Zaman genişlemesi: gözlemle kesinleşmiş', 'kesin', { hiza: 'middle' });
      return s;
    }
  });
})();
