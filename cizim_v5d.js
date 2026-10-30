/* cizim_v5d.js — ders çizimleri (d45, d46, d47, d48, d49). cizim.js kayıtları.
   Sayılar ders metninden (kaynaklı) gelir ya da burada formülle hesaplanır (Kepler yörüngesi, v = √(GM/r), Salpeter büyümesi,
   gelgit yarıçapı ve Schwarzschild yarıçapı, görünür yanal hız, termal Sunyaev–Zeldovich tayf biçimi).
   Her değerin kaynağı: arastirma/cizim_v5d_kaynak.md. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti, binlik nokta */
  const tr = (x, d) => {
    const s = Math.abs(x).toFixed(d == null ? 0 : d).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 ? '−' : '') + s.join(',');
  };
  /* "10ⁿ" etiketi */
  const UST = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const on = n => '10' + String(n).split('').map(c => UST[c]).join('');
  /* Sabitler: IAU GM☉ ve tanımlı c; kiloparsek (IAU parsek); ışık günü; Güneş yarıçapı (NASA) */
  const GM = 1.32712440018e20, CI = 299792458, KPC = 3.0857e19, R_GUNES = 695700, AB = 1.495978707e8;
  const RS_KM = 2 * GM / (CI * CI) / 1000;          // 1 Güneş kütlesinin Schwarzschild yarıçapı ≈ 2,953 km
  const ISIK_GUNU_KM = CI * 86400 / 1000;           // ≈ 2,59 × 10¹⁰ km
  const KAYNAK = {
    notronYildizi: { ad: 'Wikipedia: Neutron star', url: 'https://en.wikipedia.org/wiki/Neutron_star' },
    tov: { ad: 'Wikipedia: Tolman–Oppenheimer–Volkoff limit', url: 'https://en.wikipedia.org/wiki/Tolman%E2%80%93Oppenheimer%E2%80%93Volkoff_limit' },
    makarna: { ad: 'Science News: Nuclear pasta', url: 'https://www.sciencenews.org/article/nuclear-pasta-neutron-stars-may-be-strongest-material-universe' },
    miller19: { ad: 'Miller ve ark. 2019 (NICER J0030+0451)', url: 'https://pages.astro.umd.edu/~mcmiller/reprints/miller19e.pdf' },
    hulseTaylor: { ad: 'Wikipedia: Hulse–Taylor pulsar', url: 'https://en.wikipedia.org/wiki/Hulse%E2%80%93Taylor_pulsar' },
    nasaGunes: { ad: 'NASA Sun Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html' },
    shen: { ad: 'Yue Shen, The Mass of Quasars (NED)', url: 'https://ned.ipac.caltech.edu/level5/Sept13/Shen/Shen1.html' },
    j0313: { ad: 'Wikipedia: QSO J0313−1806', url: 'https://en.wikipedia.org/wiki/QSO_J0313%E2%88%921806' },
    smbh: { ad: 'Wikipedia: Supermassive black hole', url: 'https://en.wikipedia.org/wiki/Supermassive_black_hole' },
    tde: { ad: 'Wikipedia: Tidal disruption event', url: 'https://en.wikipedia.org/wiki/Tidal_disruption_event' },
    stone: { ad: 'Stone ve ark., TDE in General Relativity (arXiv:1801.10180)', url: 'https://arxiv.org/pdf/1801.10180' },
    schwarzschild: { ad: 'Wikipedia: Schwarzschild radius', url: 'https://en.wikipedia.org/wiki/Schwarzschild_radius' },
    au: { ad: 'Wikipedia: Astronomical unit', url: 'https://en.wikipedia.org/wiki/Astronomical_unit' },
    eso2612: { ad: 'ESO eso2612 (2026)', url: 'https://www.eso.org/public/news/eso2612/' },
    m106: { ad: 'Wikipedia: Messier 106', url: 'https://en.wikipedia.org/wiki/Messier_106' },
    ngc5548: { ad: 'Lu ve ark. 2025, NGC 5548 (arXiv:2511.05851)', url: 'https://arxiv.org/pdf/2511.05851' },
    atNali: { ad: 'Sci.News: Kozmik At Nalı (2025)', url: 'https://www.sci.news/astronomy/cosmic-horseshoe-black-hole-14122.html' },
    oj287: { ad: 'Komossa ve ark. 2021, OJ 287 (arXiv:2104.12901)', url: 'https://ar5iv.labs.arxiv.org/html/2104.12901' },
    samanyolu: { ad: 'Wikipedia: Milky Way', url: 'https://en.wikipedia.org/wiki/Milky_Way' },
    kapteyn: { ad: 'Wikipedia: Jacobus Kapteyn', url: 'https://en.wikipedia.org/wiki/Jacobus_Kapteyn' },
    freeman: { ad: 'Freeman, NED: thin and thick disks', url: 'https://ned.ipac.caltech.edu/level5/Sept15/Freeman/Freeman2.html' },
    jiao: { ad: 'Jiao ve ark. 2023 (arXiv:2309.00048)', url: 'https://arxiv.org/abs/2309.00048' },
    donmeEgrisi: { ad: 'Wikipedia: Galaxy rotation curve', url: 'https://en.wikipedia.org/wiki/Galaxy_rotation_curve' },
    shields: { ad: 'J. Shields, A Brief History of AGN: unification (NED)', url: 'https://ned.ipac.caltech.edu/level5/Sept04/Shields/Shields4_7.html' },
    seyfert: { ad: 'Wikipedia: Seyfert galaxy', url: 'https://en.wikipedia.org/wiki/Seyfert_galaxy' },
    k3c273: { ad: 'Wikipedia: 3C 273', url: 'https://en.wikipedia.org/wiki/3C_273' },
    nasaNeptun: { ad: 'NASA Neptune Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html' },
    isiktanHizli: { ad: 'Wikipedia: Superluminal motion', url: 'https://www.wikiwand.com/en/articles/Superluminal_motion' },
    yerelGrup: { ad: 'Wikipedia: Local Group', url: 'https://en.wikipedia.org/wiki/Local_Group' },
    laniakea: { ad: 'Tully ve ark. 2014, Laniakea (arXiv:1409.0880)', url: 'https://arxiv.org/pdf/1409.0880' },
    sloan: { ad: 'Wikipedia: Sloan Great Wall', url: 'https://en.wikipedia.org/wiki/Sloan_Great_Wall' },
    coban: { ad: 'Wikipedia: Boötes Void', url: 'https://en.wikipedia.org/wiki/Bo%C3%B6tes_Void' },
    bao: { ad: 'Wikipedia: Baryon acoustic oscillations', url: 'https://en.wikipedia.org/wiki/Baryon_acoustic_oscillations' },
    millennium: { ad: 'Virgo Consortium: Millennium Simulation', url: 'https://virgo.dur.ac.uk/2005/06/02/Millennium/' },
    cautun: { ad: 'Cautun ve ark. 2014 (arXiv:1401.7866)', url: 'https://arxiv.org/abs/1401.7866' },
    planckSz: { ad: 'Planck 2013 XX (arXiv:1303.5080)', url: 'https://arxiv.org/abs/1303.5080' },
    carlstrom: { ad: 'Carlstrom, Holder ve Reese 2002 (arXiv:astro-ph/0208192)', url: 'https://arxiv.org/abs/astro-ph/0208192' }
  };

  /* ================================================================ d45 ================================================================ */

  /* d45 · bölüm 6: dıştan içe katmanlar. Üstte 12 km'lik yarıçap ölçekli (kabuk ≈1 km: makarna ≈1 km derinlikte, bölüm 7);
     altta kabuk büyütüldü, katman genişlikleri şematik (kalınlıklar yazıyla). Dış ve iç çekirdek sınırı şematik. */
  C.ekle('d45-ic-yapi', {
    ders: 'd45', bolum: 6, oran: 0.98,
    baslik: 'Nötron yıldızının içi: yüzeyden merkeze',
    aciklama: 'Üstteki şerit yüzeyden merkeze yaklaşık 12 kilometrelik yolu ölçekli gösterir: katı kabuk bunun yalnızca ilk kilometresi kadardır, gerisi çekirdektir ve iç çekirdeğin neden yapıldığı bilinmez. Alttaki şerit kabuğu büyütür; buradaki genişlikler şematiktir, kalınlıklar altlarında yazar. En dışta milimetrelerle santimetreler kalınlığında bir atmosfer, altında metrelerle onlarca metre derinlikte sıvı gibi bir okyanus, sonra sert dış kabuk gelir. Nötron damlamasından sonra iç kabukta çekirdeklerin arasını serbest nötronlar doldurur ve yaklaşık bir kilometre derinlikte nükleer makarna bulunur. Yoğunluk kabukta metreküp başına yaklaşık bir milyar kilogramdan merkezde 6 ile 8 çarpı 10 üzeri 17 kilograma çıkar; ortalaması bir atom çekirdeğininkiyle aynı mertebededir.',
    kaynak: [KAYNAK.notronYildizi, KAYNAK.makarna, KAYNAK.miller19],
    ciz(S) {
      const R = S.R, x0 = 20, x1 = 380;
      let s = '';
      /* --- üst şerit: ölçekli 0–12 km --- */
      const X = km => x0 + km / 12 * (x1 - x0), y0 = 44, h0 = 34;
      s += S.yazi(8, 20, 'Ölçekli: yüzeyden merkeze ≈12 km', { boy: 14, renk: R.metin, kalin: true });
      s += S.kutu(X(0), y0, X(1) - X(0), h0, { dolgu: R.vurgu, renk: R.metin, kalin: 1.2 });
      s += S.kutu(X(1), y0, X(7) - X(1), h0, { dolgu: R.yuzey2, renk: R.metin, kalin: 1.2 });
      s += S.kutu(X(7), y0, X(12) - X(7), h0, { dolgu: R.yuzey, renk: R.metin, kalin: 1.2 });
      s += S.cizgi(X(7), y0, X(7), y0 + h0, { renk: R.metin, kalin: 1.2, kesik: '4 3' });
      s += S.yazi((X(1) + X(7)) / 2, y0 + 22, 'dış çekirdek', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi((X(7) + X(12)) / 2, y0 + 22, 'iç çekirdek: ?', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      [0, 3, 6, 9, 12].forEach(k => { s += S.cizgi(X(k), y0 + h0, X(k), y0 + h0 + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(k), y0 + h0 + 19, k + (k === 12 ? ' km' : ''), { boy: 13, hiza: k === 0 ? 'start' : k === 12 ? 'end' : 'middle', renk: R.soluk }); });
      s += S.yazi(X(0), y0 - 6, 'yüzey', { boy: 13, renk: R.soluk });
      s += S.yazi(X(12), y0 - 6, 'merkez', { boy: 13, hiza: 'end', renk: R.soluk });
      /* kabuk → alt şerit oku */
      s += S.ok(X(0.5), y0 + h0 + 2, X(0.5), 146, { renk: R.vurgu, kalin: 2, boy: 7 });
      s += S.yazi(X(0.5) + 10, y0 + h0 + 40, 'kabuk ≈1 km: aşağıda büyütüldü', { boy: 13, renk: R.vurgu, kalin: true });
      /* --- alt şerit: kabuk, şematik genişlik --- */
      const y1 = 172, h1 = 38, w = (x1 - x0) / 5;
      const kat = [
        ['atmosfer', R.yuzey, ['mm–cm']],
        ['okyanus', R.mavi, ['metreler–', 'onlarca m']],
        ['dış kabuk', R.vurguSoluk, ['katı, sert']],
        ['iç kabuk', R.vurguSoluk, ['serbest', 'nötronlar']],
        ['makarna', R.vurgu, ['≈1 km', 'derinlikte']]
      ];
      kat.forEach(([ad, dolgu, alt], i) => {
        const xa = x0 + i * w;
        s += S.kutu(xa, y1, w, h1, { dolgu, renk: R.metin, kalin: 1 });
        s += S.zeminliYazi(xa + w / 2, y1 + 24, ad, { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
        alt.forEach((t, j) => { s += S.yazi(xa + w / 2, y1 + h1 + 18 + j * 17, t, { boy: 13, hiza: 'middle', renk: R.soluk }); });
      });
      /* nötron damlaması: dış ve iç kabuk sınırı */
      const xd = x0 + 3 * w;
      s += S.cizgi(xd, y1 - 10, xd, y1 + h1 + 2, { renk: R.metin, kalin: 2, kesik: '4 3' });
      s += S.yazi(xd, y1 - 14, 'nötron damlaması', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(x0, y1 - 14, 'yüzey', { boy: 13, renk: R.soluk });
      /* --- alt bilgi satırları --- */
      const sat = [
        ['yoğunluk: kabukta ≈10⁹ kg/m³', R.metin, true],
        ['merkezde 6–8 × 10¹⁷ kg/m³', R.metin, true],
        ['ortalama 3,7–5,9 × 10¹⁷: atom çekirdeği ≈3 × 10¹⁷', R.vurgu, false],
        ['basınç: iç kabuk ≈3,2 × 10³¹ → merkez ≈1,6 × 10³⁴ Pa', R.soluk, false]
      ];
      sat.forEach(([t, r, k], i) => { s += S.yazi(8, 290 + i * 22, t, { boy: 13, renk: r, kalin: k }); });
      s += S.yazi(392, 384, 'alt şerit ve çekirdek sınırı şematik', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d45 · bölüm 9: kütle ekseni (Güneş kütlesi, doğrusal 0–5,6). Sınır tahminleri, ölçülen kütleler, kütle boşluğu (2–5). */
  C.ekle('d45-kutle-siniri', {
    ders: 'd45', bolum: 9, oran: 1.06,
    baslik: 'Nötron yıldızının kütle sınırı ve kütle boşluğu',
    aciklama: 'Yatay eksen Güneş kütlesi cinsinden kütledir. Üstteki çubuklar en büyük kütle için yapılan tahminlerdir: 1939\'da Oppenheimer ve Volkoff\'un 0,7\'si, GW170817 birleşmesinden çıkan 2,01 ile 2,17 arası, 2026 çalışmasının 2,2 ile 2,3 arası, Kalogera ve Baym\'ın 2,2 ile 2,9 arası ve NASA\'nın kabaca 3\'ü. Ortadaki noktalar ölçülmüş nötron yıldızlarıdır; yatay çizgiler belirsizliktir. En ağırları 2\'nin biraz üstündedir; bu yüzden 0,7\'lik ilk sınır yanlış çıktı. Gölgeli bölge 2 ile 5 arasındaki kütle boşluğudur: burada çok az cisim gözlenmiştir. GW190814\'ün 2,59\'luk cismi bu boşluktadır ve büyük olasılıkla bir kara deliktir; GW170817\'den kalan yaklaşık 2,74\'lük cisim de saniyeler içinde kara deliğe çöktü.',
    kaynak: [KAYNAK.tov, KAYNAK.notronYildizi, KAYNAK.miller19],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 20, y: 30, w: 362, h: 340 }, { x0: 0, x1: 5.6, y0: 0, y1: 1 }, {
        xIsaret: [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']],
        xAd: 'kütle (Güneş kütlesi)'
      });
      let s = '';
      /* kütle boşluğu */
      s += S.kutu(ek.X(2), 30, ek.X(5) - ek.X(2), 340, { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.4 });
      s += S.yazi((ek.X(2) + ek.X(5)) / 2, 362, 'kütle boşluğu: 2–5', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += ek.svg.replace(/<line[^>]*x1="20" y1="30"[^>]*\/>/, '');
      const yz = (x, y, t, o) => S.yazi(x, y + 5, t, Object.assign({ boy: 13, renk: R.metin }, o));
      /* sınır tahminleri: çubuk */
      s += S.yazi(8, 20, 'En büyük kütle tahminleri', { boy: 14, renk: R.metin, kalin: true });
      const sinir = [[0.7, 0.7, '1939: 0,7 (etkileşimsiz gaz)'], [2.01, 2.17, 'GW170817: 2,01–2,17'], [2.2, 2.3, '2026 çalışması: 2,2–2,3'], [2.2, 2.9, 'Kalogera–Baym: 2,2–2,9'], [3, 3, 'NASA: kabaca 3']];
      sinir.forEach(([a, b, t], i) => {
        const y = 48 + i * 25, xa = ek.X(a), xb = Math.max(ek.X(b), xa + 5);
        s += S.kutu(xa, y - 6, xb - xa, 12, { dolgu: R.uyari, renk: R.metin, kalin: 1 }, 2);
        s += yz(xb + 8, y, t, i === 0 ? { renk: R.uyari, kalin: true } : {});
      });
      /* ölçülen kütleler: nokta ve hata çubuğu */
      s += S.yazi(8, 188, 'Ölçülen nötron yıldızları', { boy: 14, renk: R.metin, kalin: true });
      const olcum = [[1.44, 1.29, 1.58, 'J0030+0451 (NICER): 1,44'], [2.01, 1.97, 2.05, 'J0348+0432: 2,01 ± 0,04'], [2.08, 2.01, 2.15, 'J0740+6620: 2,08 ± 0,07'], [2.35, 2.18, 2.52, 'J0952−0607: 2,35 ± 0,17']];
      olcum.forEach(([m, a, b, t], i) => {
        const y = 210 + i * 25;
        s += S.cizgi(ek.X(a), y, ek.X(b), y, { renk: R.metin, kalin: 2 }) + S.cizgi(ek.X(a), y - 5, ek.X(a), y + 5, { renk: R.metin, kalin: 1.5 }) + S.cizgi(ek.X(b), y - 5, ek.X(b), y + 5, { renk: R.metin, kalin: 1.5 });
        s += S.daire(ek.X(m), y, 5, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
        s += yz(ek.X(b) + 9, y, t);
      });
      /* boşluktaki cisimler: içi boş kare */
      [[2.59, 'GW190814: 2,59', 'muhtemelen kara delik', 318], [2.74, 'GW170817 sonrası ≈2,74', 'çöktü: kara delik', 340]].forEach(([m, sol, sag, y]) => {
        s += S.kutu(ek.X(m) - 5, y - 5, 10, 10, { dolgu: R.zemin, renk: R.metin, kalin: 1.8 });
        s += yz(ek.X(m) - 10, y, sol, { hiza: 'end', kalin: true }) + yz(ek.X(m) + 10, y, sag);
      });
      return s;
    }
  });

  /* d45 · bölüm 13: Hulse–Taylor yörüngeleri, ölçekli. Göreli yörünge: en yakın 746.600 km, en uzak 3,15 milyon km;
     a = (rp + ra) / 2, e = (ra − rp) / (ra + rp). Her yıldız ortak kütle merkezi çevresinde, öbürünün kütle payı kadar
     küçültülmüş bir elips çizer (1,441 ve 1,387 Güneş kütlesi). Güneş diski (695.700 km) aynı ölçekte. */
  C.ekle('d45-hulse-taylor', {
    ders: 'd45', bolum: 13, oran: 0.98,
    baslik: 'Hulse–Taylor çifti: iki nötron yıldızı Güneş boyunda bir alanda dolanır',
    aciklama: 'İki yıldızın ortak kütle merkezi çevresindeki yolları ölçekli çizildi; kesikli büyük daire aynı ölçekte Güneş\'tir. Atarca ile eşinin kütleleri neredeyse eşit olduğu için yolları neredeyse aynı büyüklükte, birbirinin aynası iki elipstir. Çizimde iki yıldız da en yakın noktadadır: aralarında yaklaşık 746.600 kilometre, yani Güneş\'in yarıçapı kadar uzaklık vardır. En uzak noktada aralık 3,15 milyon kilometreye çıkar. Bir tur 7,75 saat sürer. Yörüngenin en yakın noktası her yıl yaklaşık 4,2 derece döner; kütleçekim dalgaları yörüngeyi her yıl yaklaşık 3,5 metre küçültür ve iki yıldız yaklaşık 300 milyon yıl sonra birleşecek.',
    kaynak: [KAYNAK.hulseTaylor, KAYNAK.nasaGunes],
    ciz(S) {
      const R = S.R, rp = 746600, ra = 3.15e6, a = (rp + ra) / 2, e = (ra - rp) / (ra + rp);
      const mp = 1.441, mc = 1.387, ap = a * mc / (mp + mc), ac = a * mp / (mp + mc);
      const k = 340 / (ap * (1 + e) + ac * (1 + e)), cx = 30 + ap * (1 + e) * k, cy = 150;
      let s = '';
      /* Güneş, ölçekli */
      s += S.daire(cx, cy, R_GUNES * k, { dolgu: R.gunes, renk: R.gunes, kalin: 1.6, saydam: 0.18 });
      s += S.daire(cx, cy, R_GUNES * k, { renk: R.gunes, kalin: 1.6, kesik: '6 4' });
      s += S.zeminliYazi(cx, cy - R_GUNES * k - 8, 'Güneş, aynı ölçekte', { boy: 13, hiza: 'middle', renk: R.metin });
      /* yörüngeler: atarca (periastron sağda), eş (periastron solda); elips merkezleri odaktan ae kadar kayık */
      const bp = ap * Math.sqrt(1 - e * e), bc = ac * Math.sqrt(1 - e * e);
      s += S.elips(cx - ap * e * k, cy, ap * k, bp * k, { renk: R.metin, kalin: 2.2 });
      s += S.elips(cx + ac * e * k, cy, ac * k, bc * k, { renk: R.metin, kalin: 1.6, kesik: '7 4' });
      /* kütle merkezi */
      s += S.cizgi(cx - 5, cy - 5, cx + 5, cy + 5, { renk: R.metin, kalin: 1.5 }) + S.cizgi(cx - 5, cy + 5, cx + 5, cy - 5, { renk: R.metin, kalin: 1.5 });
      /* yıldızlar en yakın noktada */
      const xp = cx + ap * (1 - e) * k, xc = cx - ac * (1 - e) * k;
      s += S.daire(xp, cy, 6, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
      s += S.daire(xc, cy, 6, { dolgu: R.zemin, renk: R.metin, kalin: 2 });
      /* en yakın aralık */
      const ya = cy + 28;
      s += S.cizgi(xc, cy + 9, xc, ya + 4, { renk: R.vurgu, kalin: 1 }) + S.cizgi(xp, cy + 9, xp, ya + 4, { renk: R.vurgu, kalin: 1 });
      s += S.ok((xc + xp) / 2, ya, xc + 1, ya, { renk: R.vurgu, kalin: 1.6, boy: 6 }) + S.ok((xc + xp) / 2, ya, xp - 1, ya, { renk: R.vurgu, kalin: 1.6, boy: 6 });
      s += S.zeminliYazi((xc + xp) / 2, ya + 20, '746.600 km', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      /* etiketler */
      s += S.yazi(xp + 8, cy - 10, 'atarca 1,441', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(xc - 8, cy - 10, 'eş 1,387', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(8, 20, 'kalın: atarcanın yolu · kesikli: eşin yolu', { boy: 13, renk: R.soluk });
      /* en uzak aralık, alt ölçek */
      const yb = cy + bc * k + 26, xl = cx - ap * (1 + e) * k, xr = cx + ac * (1 + e) * k;
      s += S.ok((xl + xr) / 2, yb, xl, yb, { renk: R.soluk, kalin: 1.2, boy: 6 }) + S.ok((xl + xr) / 2, yb, xr, yb, { renk: R.soluk, kalin: 1.2, boy: 6 });
      s += S.zeminliYazi((xl + xr) / 2, yb + 20, 'en uzak aralık: 3,15 milyon km', { boy: 13, hiza: 'middle', renk: R.metin });
      const satir = ['1 tur: 7,75 saat (dış merkezlik 0,617)', 'en yakın nokta yılda ≈4,2° döner', 'yörünge yılda ≈3,5 m küçülür: ≈300 milyon yılda birleşme'];
      satir.forEach((t, i) => { s += S.yazi(8, yb + 52 + i * 20, t, { boy: 13, renk: i === 2 ? R.vurgu : R.metin, kalin: i === 2 }); });
      return s;
    }
  });

  /* ================================================================ d46 ================================================================ */

  /* d46 · bölüm 9: Eddington sınırında üstel büyüme M = M₀ e^(t/t_S); t_S = 4,5 × 10⁸ yıl × ε / (1 − ε) (λ = 1). */
  C.ekle('d46-tohum-buyume', {
    ders: 'd46', bolum: 9, oran: 0.98,
    baslik: 'Tohum sorunu: hafif tohum zamanında yetişemez',
    aciklama: 'Dikey eksen kara deliğin kütlesi, logaritmik: her çentik yüz kat. Yatay eksen tohum doğduktan sonra geçen süredir. Eğriler Eddington sınırında kesintisiz beslenen kara deliklerdir. Verim yüzde 10 iken kütle her 50 milyon yılda e katına çıkar. 100 Güneş kütleli hafif tohum 1,6 milyar Güneş kütlesine ancak yaklaşık 830 milyon yılda ulaşır; oysa J0313–1806 kuasarının ışığı yola çıktığında evren yalnızca yaklaşık 680 milyon yaşındaydı ve tohum Büyük Patlama\'yla aynı anda doğamaz. 100 bin Güneş kütleli ağır tohum aynı kütleye yaklaşık 480 milyon yılda varır. Noktalı eğri ağır tohumun hızlı dönen, verimi yüzde 42 olan hâlidir: ışığa giden kütle kara deliğe eklenmediği için çok daha yavaş büyür.',
    kaynak: [KAYNAK.shen, KAYNAK.j0313, KAYNAK.smbh],
    ciz(S) {
      const R = S.R, ts = eps => 4.5e8 * eps / (1 - eps) / 1e6;
      const ek = S.eksen({ x: 58, y: 30, w: 322, h: 236 }, { x0: 0, x1: 900, y0: 10, y1: 1e10 }, {
        logY: true,
        xIsaret: [[0, '0'], [200, '200'], [400, '400'], [600, '600'], [800, '800']],
        yIsaret: [[100, on(2)], [1e4, on(4)], [1e6, on(6)], [1e8, on(8)], [1e10, on(10)]],
        xAd: 'tohumdan sonra geçen süre (milyon yıl)', yAd: 'kütle (Güneş kütlesi)', yAdUzak: 46
      });
      let s = '';
      /* evrenin yaşı çizgisi */
      s += S.kutu(ek.X(680), 30, ek.X(900) - ek.X(680), 236, { dolgu: R.uyari, renk: 'none', saydam: 0.12 });
      s += ek.svg;
      s += S.cizgi(ek.X(680), 30, ek.X(680), 266, { renk: R.uyari, kalin: 2, kesik: '6 4' });
      /* hedef kütle */
      s += S.cizgi(ek.X(0), ek.Y(1.6e9), ek.X(900), ek.Y(1.6e9), { renk: R.metin, kalin: 1, kesik: '3 3' });
      s += S.zeminliYazi(ek.X(10), ek.Y(1.6e9) - 6, 'J0313–1806: 1,6 milyar', { boy: 13, renk: R.metin, kalin: true });
      const egri = (M0, eps, o) => S.fonk(ek, t => { const M = M0 * Math.exp(t / ts(eps)); return M <= 1e10 ? M : NaN; }, 0, 900, 200, o);
      s += egri(100, 0.1, { renk: R.vurgu, kalin: 3 });
      s += egri(1e5, 0.1, { renk: R.metin, kalin: 2.4, kesik: '8 4' });
      s += egri(1e5, 0.42, { renk: R.mavi, kalin: 2.4, kesik: '2 4' });
      /* kesişmeler */
      const tH = ts(0.1) * Math.log(1.6e9 / 100), tA = ts(0.1) * Math.log(1.6e9 / 1e5);
      s += S.daire(ek.X(tH), ek.Y(1.6e9), 5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.5 });
      s += S.daire(ek.X(tA), ek.Y(1.6e9), 5, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
      /* etiketler */
      s += S.zeminliYazi(ek.X(470), ek.Y(3e3), 'hafif tohum: 100', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(ek.X(470), ek.Y(3e3) + 17, 'yetişme ≈' + tr(tH) + ' milyon yıl', { boy: 13, renk: R.vurgu });
      s += S.zeminliYazi(ek.X(tA) - 8, ek.Y(1.6e9) + 22, 'ağır tohum: ≈' + tr(Math.round(tA / 10) * 10), { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.zeminliYazi(ek.X(250), ek.Y(1e5) - 16, 'ağır, ε = 0,1 (kesikli)', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(ek.X(470), ek.Y(2.2e6) + 4, 'ağır, ε = 0,42 (noktalı)', { boy: 13, renk: R.mavi });
      s += S.zeminliYazi(ek.X(680) - 6, 48, 'evren 680 milyon yaşında', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      s += S.yazi(8, 344, 'Eddington sınırında beslenme: kütle her', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 362, tr(ts(0.1)) + ' milyon yılda (ε = 0,1) e ≈ 2,718 katına çıkar', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 380, 'ε = 0,42 ile bu süre ≈' + tr(Math.round(ts(0.42) / 10) * 10) + ' milyon yıl', { boy: 13, renk: R.mavi });
      return s;
    }
  });

  /* d46 · bölüm 11: Güneş benzeri yıldız (R = 695.700 km, M = 1 Güneş kütlesi). r_t = R × M_kd^(1/3); r_s = 2GM/c². AB cinsinden. */
  C.ekle('d46-gelgit-hills', {
    ders: 'd46', bolum: 11, oran: 0.96,
    baslik: 'Gelgit yarıçapı ile olay ufku yarışı: Hills kütlesi',
    aciklama: 'Güneş benzeri bir yıldız için hesaplandı; iki eksen de logaritmiktir ve dikey eksen astronomik birim cinsindendir. Kalın çizgi gelgit yarıçapıdır: yıldız bundan içeri girerse parçalanır. Kara delik bin kat ağırlaşınca bu yarıçap yalnızca on kat büyür. Kesikli çizgi olay ufkudur ve kütleyle doğru orantılı, yani çok daha dik büyür. İki çizgi yaklaşık 110 milyon Güneş kütlesinde kesişir: Hills kütlesi. Soldaki kara deliklerde yıldız ufka varmadan parçalanır ve aylarca süren bir parlama görülür; Sgr A* ve 2011 olayındaki milyon Güneş kütleli kara delik buradadır. Sağdakiler yıldızı parçalamadan bütün yutar, parlama olmaz. Göreli hesap ve dönme bu sınırı biraz kaydırır.',
    kaynak: [KAYNAK.tde, KAYNAK.stone, KAYNAK.schwarzschild, KAYNAK.nasaGunes],
    ciz(S) {
      const R = S.R, rt = M => R_GUNES * Math.cbrt(M) / AB, rs = M => RS_KM * M / AB;
      const MH = Math.pow(R_GUNES / RS_KM, 1.5);
      const ek = S.eksen({ x: 62, y: 30, w: 318, h: 250 }, { x0: 1e5, x1: 1e10, y0: 1e-3, y1: 1e3 }, {
        logX: true, logY: true,
        xIsaret: [[1e5, on(5)], [1e6, on(6)], [1e7, on(7)], [1e8, on(8)], [1e9, on(9)], [1e10, on(10)]],
        yIsaret: [[1e-3, '0,001'], [0.1, '0,1'], [10, '10'], [1000, '1000']],
        xAd: 'kara deliğin kütlesi (Güneş kütlesi)', yAd: 'yarıçap (AB)', yAdUzak: 50
      });
      let s = '';
      s += S.kutu(ek.X(MH), 30, ek.X(1e10) - ek.X(MH), 250, { dolgu: R.yuzey2, renk: 'none', saydam: 0.7 });
      s += ek.svg;
      s += S.fonk(ek, rt, 1e5, 1e10, 60, { renk: R.vurgu, kalin: 3 }, true);
      s += S.fonk(ek, rs, 1e5, 1e10, 60, { renk: R.metin, kalin: 2.2, kesik: '8 4' }, true);
      s += S.cizgi(ek.X(MH), 30, ek.X(MH), 280, { renk: R.metin, kalin: 1, kesik: '3 3' });
      s += S.daire(ek.X(MH), ek.Y(rt(MH)), 5.5, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
      s += S.zeminliYazi(ek.X(MH) + 8, ek.Y(rt(MH)) + 20, 'Hills kütlesi ≈' + tr(MH / 1e6, 0) + ' milyon', { boy: 13, renk: R.metin, kalin: true });
      /* eğri adları */
      s += S.zeminliYazi(ek.X(2e5), ek.Y(rt(2e5)) - 10, 'gelgit yarıçapı', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(ek.X(1.2e6), ek.Y(rs(1.2e6)) + 18, 'olay ufku (kesikli)', { boy: 13, renk: R.metin });
      /* bölgeler */
      s += S.zeminliYazi(ek.X(1.3e5), 50, 'yıldız parçalanır: parlama', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(376, 270, 'bütün yutulur', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      /* Sgr A* ve 2011 olayı */
      [[4.3e6, 'Sgr A*'], [1e6, '2011 olayı']].forEach(([m, t], i) => {
        const x = ek.X(m), y = ek.Y(rt(m));
        s += S.kutu(x - 4, y - 4, 8, 8, { dolgu: R.zemin, renk: R.metin, kalin: 1.6 });
        s += S.yazi(x + (i ? -6 : 6), y + 20, t, { boy: 13, hiza: i ? 'end' : 'start', renk: R.metin });
      });
      s += S.yazi(8, 340, 'Güneş benzeri yıldız: yarıçap 695.700 km', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 358, 'gelgit: × 10 kütle → × 2,15 yarıçap; ufuk: × 10 → × 10', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d46 · bölüm 13: kara delik kütle merdiveni (log). Değerler ders metninden; yöntem satırın yanında. */
  C.ekle('d46-kutle-merdiveni', {
    ders: 'd46', bolum: 13, oran: 1.02,
    baslik: 'Milyonlardan on milyarlara: dev kara deliklerin kütleleri ve tartma yolları',
    aciklama: 'Yatay eksen Güneş kütlesi cinsinden, logaritmik: her çentik on kat. Her satır bu dersteki bir kara deliktir; altında hangi yöntemle tartıldığı yazar. Samanyolu\'nun Sgr A*\'ı yaklaşık 4,3 milyon, maserle tartılan M106 yaklaşık 39 milyon, Andromeda yaklaşık 140 milyon, yankı haritalamayla tartılan NGC 5548 yaklaşık 260 milyon Güneş kütlesidir. M87 için iki nokta vardır: 1994\'te gazdan 2,4 milyar, 2019\'da EHT\'den 6,5 milyar; aynı kara delik için yöntemler iki üç kat ayrışır. En sağda on milyarlar: OJ 287\'nin modeldeki ana kara deliği 18, Kozmik At Nalı 36, TON 618 yaklaşık 41 milyar. İçi boş işaretler dolaylı ve belirsizliği büyük tahminlerdir. Kesikli çizgi King\'in hesapladığı yaklaşık 50 milyarlık doğal üst sınırdır.',
    kaynak: [KAYNAK.smbh, KAYNAK.eso2612, KAYNAK.m106, KAYNAK.ngc5548, KAYNAK.oj287, KAYNAK.atNali],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 14, y: 26, w: 370, h: 340 }, { x0: 1e6, x1: 1e11, y0: 0, y1: 1 }, {
        logX: true,
        xIsaret: [[1e6, '1 milyon'], [1e7, on(7)], [1e8, on(8)], [1e9, '1 milyar'], [1e10, on(10)], [1e11, on(11)]],
        xAd: 'kütle (Güneş kütlesi, logaritmik)'
      });
      let s = ek.svg.replace(/<line[^>]*x1="14" y1="26"[^>]*\/>/, '');
      /* üst sınır */
      s += S.cizgi(ek.X(5e10), 26, ek.X(5e10), 366, { renk: R.uyari, kalin: 1.6, kesik: '6 4' });
      s += S.zeminliYazi(ek.X(5e10) - 4, 18, 'King: üst sınır ≈5 × 10¹⁰', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      const sat = [
        [[4.3e6], null, 'Sgr A*: 4,3 milyon', 'yıldız yörüngeleri (S2)', true],
        [[3.9e7], null, 'M106: 39 milyon', 'maser diski', true],
        [[1.4e8], [0.95e8, 2.05e8], 'Andromeda: 140 milyon', 'yıldız hareketleri', true],
        [[2.58e8], [1.46e8, 3.7e8], 'NGC 5548: 260 milyon', 'yankı haritalama (±%43)', true],
        [[2.4e9, 6.5e9], null, 'M87: 2,4 ve 6,5 milyar', 'gaz 1994 · EHT 2019', true],
        [[1.8e10], null, 'OJ 287: 18 milyar', 'çift modeli', false],
        [[3.6e10], null, 'Kozmik At Nalı: 36 milyar', 'mercek + yıldız hızları', true],
        [[4.07e10], null, 'TON 618: ≈41 milyar', 'çizgi genişliği, belirsiz', false]
      ];
      sat.forEach(([ms, hata, ad, yon, dogrudan], i) => {
        const y = 52 + i * 38, xs = ms.map(m => ek.X(m));
        if (hata) s += S.cizgi(ek.X(hata[0]), y, ek.X(hata[1]), y, { renk: R.metin, kalin: 2 }) + S.cizgi(ek.X(hata[0]), y - 5, ek.X(hata[0]), y + 5, { renk: R.metin, kalin: 1.4 }) + S.cizgi(ek.X(hata[1]), y - 5, ek.X(hata[1]), y + 5, { renk: R.metin, kalin: 1.4 });
        if (xs.length > 1) s += S.cizgi(xs[0], y, xs[1], y, { renk: R.metin, kalin: 1.4, kesik: '3 3' });
        xs.forEach(x => { s += S.daire(x, y, 6, dogrudan ? { dolgu: R.vurgu, renk: R.zemin, kalin: 1.5 } : { dolgu: R.zemin, renk: R.vurgu, kalin: 2.2 }); });
        const sag = xs[xs.length - 1] < 230, tx = sag ? Math.max(...xs) + (hata ? Math.max(0, ek.X(hata[1]) - Math.max(...xs)) : 0) + 11 : Math.min(...xs) - 11;
        s += S.zeminliYazi(tx, y + 4, ad, { boy: 13, hiza: sag ? 'start' : 'end', renk: R.metin, kalin: true });
        s += S.zeminliYazi(tx, y + 21, yon, { boy: 13, hiza: sag ? 'start' : 'end', renk: R.soluk });
      });
      return s;
    }
  });

  /* ================================================================ d47 ================================================================ */

  /* d47 · bölüm 1: Kapteyn Evreni (1922) ile toz düzeltmesinden sonraki galaksi, aynı ölçekte (yandan, kalınlıklar şematik). */
  C.ekle('d47-kapteyn', {
    ders: 'd47', bolum: 1, oran: 0.86,
    baslik: 'Toz bizi yanılttı: Kapteyn\'in galaksisi ve gerçeği',
    aciklama: 'İki galaksi aynı ölçekte, yandan çizildi; kalınlıklar şematiktir. Üstte Kapteyn\'in 1922 modeli: yaklaşık 40.000 ışık yılı büyüklüğünde, Güneş merkeze yalnızca yaklaşık 2000 ışık yılı uzakta. Altta yıldızlararası tozun ışığı söndürdüğü hesaba katıldıktan sonraki tablo: galaksi yaklaşık 100.000 ışık yılına büyür, Güneş merkezden yaklaşık 30.000 ışık yılı uzağa taşınır; bugünkü GRAVITY ölçümü yaklaşık 26.700 ışık yılıdır. Altta kesikli çizilen mercek, Kapteyn\'in modelinin Güneş\'in çevresine konmuş hâlidir: sisli ormandaki gibi, toz her yönde görüşü aşağı yukarı aynı uzaklıkta keser ve kendini merkezde sanırsın. Bu son karşılaştırma ders metnindeki sis benzetmesinin çizimidir.',
    kaynak: [KAYNAK.kapteyn, KAYNAK.samanyolu],
    ciz(S) {
      const R = S.R, k = 360 / 100000, cx = 200;
      let s = '';
      /* Kapteyn */
      const y1 = 74;
      s += S.yazi(8, 20, 'Kapteyn, 1922', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(8, 38, '≈40.000 ışık yılı; Güneş merkeze ≈2000 ışık yılı', { boy: 13, renk: R.soluk });
      s += S.elips(cx, y1, 20000 * k, 15, { dolgu: R.yildiz, renk: R.metin, kalin: 1, saydam: 0.55 });
      s += S.elips(cx, y1, 20000 * k, 15, { renk: R.metin, kalin: 1.2 });
      s += S.cizgi(cx, y1 - 22, cx, y1 + 22, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.daire(cx - 2000 * k, y1, 4.5, { dolgu: R.gunes, renk: R.zemin, kalin: 1.5 });
      s += S.zeminliYazi(cx - 2000 * k - 10, y1 + 34, 'Güneş: neredeyse merkezde', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.cizgi(cx - 2000 * k - 4, y1 + 22, cx - 2000 * k, y1 + 5, { renk: R.metin, kalin: 1 });
      /* gerçek */
      const y2 = 196;
      s += S.yazi(8, 134, 'Toz hesaba katılınca (Trumpler)', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(8, 152, '≈100.000 ışık yılı', { boy: 13, renk: R.soluk });
      s += S.elips(cx, y2, 50000 * k, 18, { dolgu: R.yildiz, renk: R.metin, kalin: 1, saydam: 0.55 });
      s += S.elips(cx, y2, 9000 * k, 11, { dolgu: R.yildiz, renk: 'none', saydam: 0.6 });
      s += S.cizgi(cx, y2 - 30, cx, y2 + 30, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.yazi(cx + 4, y2 - 34, 'merkez', { boy: 13, renk: R.soluk });
      const xg = cx - 30000 * k, xb = cx - 26700 * k;
      /* Kapteyn merceği Güneş'in çevresinde (yorum) */
      s += S.elips(xg + 2000 * k, y2, 20000 * k, 15, { renk: R.vurgu, kalin: 2, kesik: '6 4' });
      s += S.daire(xg, y2, 4.5, { dolgu: R.gunes, renk: R.zemin, kalin: 1.5 });
      s += S.cizgi(xb, y2 - 6, xb, y2 + 6, { renk: R.metin, kalin: 2 });
      /* ölçü okları */
      const yo = y2 + 40;
      s += S.ok(cx, yo, xg, yo, { renk: R.metin, kalin: 1.2, boy: 6 });
      s += S.zeminliYazi((cx + xg) / 2, yo + 18, 'Güneş: ≈30.000 ışık yılı', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi((cx + xg) / 2, yo + 36, 'bugün GRAVITY: ≈26.700 (kısa çizgi)', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.zeminliYazi(xg + 2000 * k + 20000 * k + 6, y2 - 22, 'kesikli: tozun izin verdiği görüş', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(392, 336, 'yatay ölçekli, kalınlıklar şematik', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d47 · bölüm 4: yandan anatomi, YATAY VE DİKEY AYNI ÖLÇEK. D25 çapı 26,8 kpc ≈ 87.400 ışık yılı; ince disk ≤1500 ışık yılı
     kalın; kalın diskin ölçek yüksekliği ≈1000 pc (≈3260 ışık yılı; çizgi ±1 ölçek yüksekliği); şişkinlik ≈10.000 ışık yılı;
     Güneş 26.700 ışık yılı. Hale çizime sığmaz (küresel kümeler 200.000 ışık yılının ötesine). */
  C.ekle('d47-anatomi', {
    ders: 'd47', bolum: 4, oran: 0.96,
    baslik: 'Samanyolu\'nun anatomisi, yandan ve ölçekli',
    aciklama: 'Galaksi yandan, yatay ve dikey yönde aynı ölçekle çizildi. Genişlik yaklaşık 87.400 ışık yılıdır. Ortadaki ince parlak çizgi ince disktir: kalınlığı en çok 1500 ışık yılı, yani genişliğinin altmışta birinden az; Güneş, genç yıldızlar, gaz ve sarmal kollar buradadır. Onu saran soluk katman yaşlı ve metalce fakir yıldızların kalın diskidir; yoğunluğu düzlemden yaklaşık 1000 parsek, yani 3260 ışık yılı uzaklaştıkça 2,7 kat azalır. Merkezdeki şişkin bölge en içteki yaklaşık 10.000 ışık yılını kaplar ve yaşlı yıldızlarla doludur. Hepsini saran hale bu çizime sığmaz: küresel kümelerin bazıları merkezden 200.000 ışık yılından uzaktadır. Güneş düzlemin 5 ile 30 parsek kadar üstündedir; bu ölçekte o fark görünmez.',
    kaynak: [KAYNAK.samanyolu, KAYNAK.freeman],
    ciz(S) {
      const R = S.R, k = 340 / 87400, cx = 200, cy = 170, rx = 43700 * k;
      let s = '';
      /* hale: büyük kesikli yay ve küresel kümeler (konumlar şematik) */
      s += S.daire(cx, cy, 150, { renk: R.soluk, kalin: 1.2, kesik: '2 5' });
      [[-110, -80], [96, -96], [-40, -132], [130, 40], [-128, 60], [60, 118], [-70, 112], [20, -60]].forEach(([dx, dy]) => { s += S.daire(cx + dx, cy + dy, 2.6, { dolgu: R.yildiz, renk: 'none' }); });
      /* kalın disk ±1 ölçek yüksekliği */
      s += S.elips(cx, cy, rx, 3260 * k, { dolgu: R.yildiz, renk: R.soluk, kalin: 1, saydam: 0.25 });
      s += S.elips(cx, cy, rx, 3260 * k, { renk: R.soluk, kalin: 1, kesik: '4 3' });
      /* şişkinlik (biçim şematik) */
      s += S.elips(cx, cy, 10000 * k, 10000 * k * 0.75, { dolgu: R.yildiz, renk: 'none', saydam: 0.55 });
      /* ince disk */
      s += S.elips(cx, cy, rx, 750 * k, { dolgu: R.yildiz, renk: R.yildiz, kalin: 1 });
      /* Güneş */
      const xg = cx - 26700 * k;
      s += S.daire(xg, cy, 4, { dolgu: R.gunes, renk: R.zemin, kalin: 1.5 });
      /* etiketler */
      const etk = (x1, y1, x2, y2, t, o) => S.cizgi(x1, y1, x2, y2, { renk: R.soluk, kalin: 1 }) + S.zeminliYazi(x2 + (o && o.hiza === 'end' ? -3 : 3), y2 + (y2 < y1 ? -2 : 13), t, Object.assign({ boy: 13, renk: R.metin }, o));
      s += etk(xg, cy - 5, xg - 16, cy - 46, 'Güneş', { hiza: 'end', kalin: true });
      s += etk(cx + 30000 * k, cy + 1, cx + 30000 * k + 8, cy + 46, 'ince disk ≤1500 ışık yılı', { hiza: 'end', kalin: true });
      s += etk(cx + 34000 * k, cy - 3260 * k + 2, cx + 34000 * k + 10, cy - 44, 'kalın disk ±1000 parsek', { hiza: 'end' });
      s += etk(cx, cy - 10000 * k * 0.75, cx + 20, cy - 66, 'şişkinlik ≈10.000 ışık yılı', {});
      s += S.zeminliYazi(cx, 14, 'hale ve küresel kümeler: 200.000 ışık yılının', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.zeminliYazi(cx, 31, 'ötesine uzanır (çizime sığmaz)', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* ölçek */
      const yo = 340;
      s += S.ok(cx, yo, cx - rx, yo, { renk: R.soluk, kalin: 1, boy: 7 }) + S.ok(cx, yo, cx + rx, yo, { renk: R.soluk, kalin: 1, boy: 7 });
      s += S.zeminliYazi(cx, yo + 20, '≈87.400 ışık yılı (D25 çapı)', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(8, 376, 'yatay ve dikey ölçek aynı; şişkinliğin biçimi şematik', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d47 · bölüm 10: dönme eğrisi. Gözlenen ≈200–220 km/s bandı; Gaia 2023 dış bölgesi v = √(GM/r), M = 2,06 × 10¹¹;
     "yalnız yıldız ve gaz" kaba eğrisi: M = 6,43 × 10¹⁰ × 1,15 (üst değerler), bütün kütle içerideymiş gibi. */
  C.ekle('d47-donme-egrisi', {
    ders: 'd47', bolum: 10, oran: 0.94,
    baslik: 'Dönme eğrisi: düz kalan hız ve dış kenardaki düşüş',
    aciklama: 'Yatay eksen merkeze uzaklık, kiloparsek cinsinden; dikey eksen yıldızların ve gazın dönme hızıdır. Taralı bant gözlenen hızdır: geniş bir aralıkta saniyede yaklaşık 200 ile 220 kilometrede düz kalır, Güneş de bu banttadır. Kesikli eğri kaba bir hesaptır: yalnız görünen yıldızlar ve gaz olsaydı ve kütlenin hepsi içeride toplansaydı hız dışa doğru Kepler yasasıyla düşerdi; dış kenarda saniyede 110 kilometreye inerdi. Gözlenen hızın bu kadar yüksek kalması görünmeyen kütleye işaret eder. Kalın eğri Gaia verisiyle 2023\'te bulunan düşüştür: 19,5 ile 26,5 kiloparsek arasında yaklaşık 30 kilometre. Bu düşüşü 206 milyar Güneş kütlesi verir; bu, 2019 tahmininin yedide birinden azdır, ama yine de yıldızların toplam kütlesinin üç dört katıdır.',
    kaynak: [KAYNAK.jiao, KAYNAK.donmeEgrisi, KAYNAK.samanyolu],
    ciz(S) {
      const R = S.R, v = (M, r) => Math.sqrt(GM * M / (r * KPC)) / 1000;
      const ek = S.eksen({ x: 54, y: 30, w: 326, h: 230 }, { x0: 0, x1: 30, y0: 0, y1: 300 }, {
        xIsaret: [[0, '0'], [5, '5'], [10, '10'], [15, '15'], [20, '20'], [25, '25'], [30, '30']],
        yIsaret: [[0, '0'], [100, '100'], [200, '200'], [300, '300']],
        xAd: 'merkeze uzaklık (kiloparsek)', yAd: 'dönme hızı (km/s)', yAdUzak: 40
      });
      let s = '';
      s += S.kutu(ek.X(5), ek.Y(220), ek.X(19.5) - ek.X(5), ek.Y(200) - ek.Y(220), { dolgu: R.vurguSoluk, renk: R.vurgu, kalin: 1 });
      s += ek.svg;
      const Mg = 6.43e10 * 1.15, Mj = 2.06e11;
      s += S.fonk(ek, r => v(Mg, r), 8, 30, 80, { renk: R.metin, kalin: 2, kesik: '7 5' });
      s += S.fonk(ek, r => v(Mj, r), 19.5, 26.5, 40, { renk: R.vurgu, kalin: 3.4 });
      /* Güneş */
      s += S.daire(ek.X(8.178), ek.Y(210), 5, { dolgu: R.gunes, renk: R.zemin, kalin: 1.5 });
      s += S.zeminliYazi(ek.X(8.178) - 8, ek.Y(210) - 12, 'Güneş', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      /* etiketler */
      s += S.zeminliYazi(ek.X(6), ek.Y(242), 'gözlenen: ≈200–220 km/s', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(ek.X(19.6), ek.Y(242), 'Gaia 2023: ≈30 km/s düşüş', { boy: 13, renk: R.vurgu });
      s += S.cizgi(ek.X(23), ek.Y(232), ek.X(23), ek.Y(v(Mj, 23)) - 5, { renk: R.vurgu, kalin: 1 });
      s += S.zeminliYazi(ek.X(29.6), ek.Y(v(Mg, 29)) - 14, 'yalnız yıldız + gaz', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.zeminliYazi(ek.X(29.6), ek.Y(v(Mg, 29)) + 3, 'olsaydı (kaba hesap)', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(8, 330, 'toplam kütle: 2,06 × 10¹¹ (2023) ile 1,54 × 10¹² (2019)', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(8, 348, 'iki tahmin arasında 7 kattan fazla fark', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 366, 'yıldızların toplamı: 4,6–6,4 × 10¹⁰ Güneş kütlesi', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d48 ================================================================ */

  /* d48 · bölüm 6: birleşik model, şematik kesit. Gözlemci yönleri: kenardan (tip 2), eğik (tip 1), jet ekseninden (blazar). */
  C.ekle('d48-birlesik-model', {
    ders: 'd48', bolum: 6, oran: 1.04,
    baslik: 'Birleşik model: aynı canavar, farklı açılar',
    aciklama: 'Ölçeksiz bir kesit. Ortada kara delik ve onu besleyen ince yığılma diski var; çevresindeki küçük bulutlar hızla dönen geniş çizgi bölgesidir. Onu, kesitte iki yanda görünen kalın ve tozlu bir simit sarar. Simidin açık bıraktığı iki koni boyunca daha uzaktaki, yavaş hareket eden büyük bulutlar dar çizgi bölgesini oluşturur; eksen boyunca jetler fırlar. Simide kenardan bakan gözlemci merkezi göremez, yalnız dar çizgileri görür: tip 2. Eğik bakan, simidin üstünden merkezi ve geniş çizgileri de görür: tip 1. Jetin namlusuna bakan blazar görür. Noktalı yol Antonucci ile Miller\'in aynasıdır: merkezin ışığı simidin üstündeki elektronlardan saçılıp kutuplanmış olarak kenardaki gözlemciye ulaşır.',
    kaynak: [KAYNAK.shields, KAYNAK.seyfert],
    ciz(S) {
      const R = S.R, cx = 216, cy = 214;
      let s = '';
      /* jetler */
      s += `<polygon points="${cx - 4},${cy - 12} ${cx + 4},${cy - 12} ${cx + 13},${cy - 190} ${cx - 13},${cy - 190}" fill="${R.vurgu}" opacity="0.55"/>`;
      s += `<polygon points="${cx - 4},${cy + 12} ${cx + 4},${cy + 12} ${cx + 13},${cy + 150} ${cx - 13},${cy + 150}" fill="${R.vurgu}" opacity="0.55"/>`;
      /* iyonlaşma konileri (kesik kenar) */
      [[-1], [1]].forEach(([y]) => {
        s += S.cizgi(cx, cy, cx - 110, cy + y * 130, { renk: R.soluk, kalin: 1, kesik: '3 4' }) + S.cizgi(cx, cy, cx + 110, cy + y * 130, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      });
      /* dar çizgi bulutları */
      [[-62, -100], [52, -112], [-20, -128], [70, -78], [-60, 96], [48, 110], [10, 122], [-24, 84]].forEach(([dx, dy]) => { s += S.daire(cx + dx, cy + dy, 7, { dolgu: R.yuzey2, renk: R.metin, kalin: 1.2 }); });
      /* simit */
      [-1, 1].forEach(y => { s += S.elips(cx + y * 70, cy, 40, 28, { dolgu: R.yuzey2, renk: R.metin, kalin: 2 }); });
      s += S.elips(cx - 70, cy, 22, 14, { renk: R.metin, kalin: 1, kesik: '2 3' }) + S.elips(cx + 70, cy, 22, 14, { renk: R.metin, kalin: 1, kesik: '2 3' });
      /* geniş çizgi bulutları */
      [[-18, -14], [16, -16], [-24, 10], [22, 12], [0, -22], [-6, 20]].forEach(([dx, dy]) => { s += S.daire(cx + dx, cy + dy, 3.2, { dolgu: R.metin, renk: 'none' }); });
      /* disk ve kara delik */
      s += S.elips(cx, cy, 18, 3.5, { dolgu: R.gunes, renk: 'none' });
      s += S.daire(cx, cy, 4.5, { dolgu: R.zemin, renk: R.metin, kalin: 1.5 });
      /* gözlemciler */
      const goz = (x, y, ad, alt, o) => {
        let t = S.elips(x, y, 9, 5.5, { dolgu: R.zemin, renk: R.metin, kalin: 1.5 }) + S.daire(x, y, 2.5, { dolgu: R.metin, renk: 'none' });
        t += S.zeminliYazi(o.tx, o.ty, ad, { boy: 13, hiza: o.hiza || 'start', renk: R.metin, kalin: true });
        t += S.zeminliYazi(o.tx, o.ty + 17, alt, { boy: 13, hiza: o.hiza || 'start', renk: R.soluk });
        return t;
      };
      /* kenardan: tip 2 */
      s += S.ok(36, cy, cx - 118, cy, { renk: R.metin, kalin: 1.6, boy: 7 });
      s += S.cizgi(cx - 116, cy, cx - 36, cy, { renk: R.metin, kalin: 1, kesik: '2 4' });
      s += goz(24, cy, 'tip 2', 'yalnız dar çizgiler', { tx: 8, ty: cy + 34 });
      /* eğik: tip 1 */
      const ex = 40, ey = 64;
      s += S.ok(ex + 12, ey + 9, cx - 22, cy - 18, { renk: R.metin, kalin: 1.6, boy: 7 });
      s += goz(ex, ey, 'tip 1', 'geniş + dar çizgiler', { tx: 8, ty: ey - 30 });
      /* jet ekseni: blazar */
      s += goz(cx, 10, 'blazar', 'jete önden', { tx: cx + 18, ty: 14 });
      /* Antonucci–Miller aynası: merkez → elektron bulutu → kenardaki gözlemci */
      const ax = cx - 36, ay = cy - 78;
      s += S.yol(`M${cx - 3},${cy - 8} L${ax},${ay} L${48},${cy - 8}`, { renk: R.mavi, kalin: 1.8, kesik: '2 3' });
      s += S.daire(ax, ay, 5, { dolgu: R.mavi, renk: R.zemin, kalin: 1 });
      s += S.zeminliYazi(ax - 8, ay - 10, 'elektron aynası', { boy: 13, hiza: 'end', renk: R.mavi, kalin: true });
      /* sağdaki adlar */
      const ad = (x1, y1, y2, t) => S.cizgi(x1, y1, 300, y2, { renk: R.soluk, kalin: 1 }) + S.zeminliYazi(304, y2 + 5, t, { boy: 13, renk: R.metin });
      s += ad(cx + 108, cy + 6, cy + 46, 'tozlu simit');
      s += ad(cx + 9, cy - 120, 84, 'jet');
      s += ad(cx + 74, cy - 81, 128, 'dar çizgi');
      s += S.zeminliYazi(304, 150, 'bulutları', { boy: 13, renk: R.metin });
      s += ad(cx + 22, cy + 12, cy + 92, 'geniş çizgi');
      s += S.zeminliYazi(304, cy + 114, 'bölgesi', { boy: 13, renk: R.metin });
      s += S.yazi(392, 410, 'ölçeksiz', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d48 · bölüm 5: boyut merdiveni, ışık günü (log). 3C 273 olay ufku r_s = 2GM/c², M = 8,86 × 10⁸; Neptün 4,495 × 10⁹ km;
     NGC 5548 15,6 ışık günü; geniş çizgi bölgesi 0,1–1 pc; NGC 1068 dar çizgi > 1000 ışık yılı; 3C 273 jeti 200.000 ışık yılı. */
  C.ekle('d48-boyut-merdiveni', {
    ders: 'd48', bolum: 5, oran: 0.96,
    baslik: 'Bir aktif çekirdeğin katmanları: ışık saatlerinden yüz binlerce ışık yılına',
    aciklama: 'Yatay eksen ışık günü cinsinden ve logaritmiktir: her çentik yüz kat. 3C 273\'ün yaklaşık 890 milyon Güneş kütleli kara deliğinin olay ufku yaklaşık 17 astronomik birim, yani 0,1 ışık günüdür; Neptün\'ün yörüngesiyle aynı mertebede. NGC 5548\'in geniş çizgi bölgesi yankı haritalamaya göre 15,6 ışık günü ötededir; geniş çizgi bölgeleri galaksiden galaksiye 0,1 ile 1 parsek arasında değişir. NGC 1068\'in dar çizgi bölgesi bin ışık yılını aşar. 3C 273\'ün jeti ise yaklaşık 200.000 ışık yılı uzunluğundadır. Böylece aynı canavarın parçaları olay ufkundan jetin ucuna kadar yaklaşık bir milyar kat büyüklük aralığına yayılır.',
    kaynak: [KAYNAK.seyfert, KAYNAK.k3c273, KAYNAK.ngc5548, KAYNAK.schwarzschild, KAYNAK.nasaNeptun],
    ciz(S) {
      const R = S.R, PC_LD = 3.2616 * 365.25, LY = 365.25;
      const ek = S.eksen({ x: 14, y: 28, w: 368, h: 300 }, { x0: 0.01, x1: 1e8, y0: 0, y1: 1 }, {
        logX: true,
        xIsaret: [[0.01, '0,01'], [1, '1'], [100, '100'], [1e4, on(4)], [1e6, on(6)], [1e8, on(8)]],
        xAd: 'boyut (ışık günü, logaritmik)'
      });
      let s = ek.svg.replace(/<line[^>]*x1="14" y1="28"[^>]*\/>/, '');
      /* ışık yılı ve parsek işaretleri */
      [[LY, '1 ışık yılı'], [1000 * LY, '1000 ışık yılı']].forEach(([d, t]) => {
        s += S.cizgi(ek.X(d), 28, ek.X(d), 328, { renk: R.cizgi, kalin: 1, kesik: '2 4' });
        s += S.yazi(ek.X(d) + 3, 22, t, { boy: 13, renk: R.soluk });
      });
      const rs = RS_KM * 8.86e8 / ISIK_GUNU_KM, nep = 4.495e9 / ISIK_GUNU_KM;
      const sat = [
        [[rs], '3C 273 olay ufku', '≈' + tr(RS_KM * 8.86e8 / AB) + ' AB'],
        [[nep], 'Neptün\'ün yörüngesi', 'yarıçap ≈30 AB'],
        [[15.6], 'NGC 5548 geniş çizgi', '15,6 ışık günü (yankı)'],
        [[0.1 * PC_LD, PC_LD], 'geniş çizgi bölgeleri', '0,1–1 parsek'],
        [[1000 * LY, null], 'NGC 1068 dar çizgi', '1000 ışık yılından büyük'],
        [[2e5 * LY], '3C 273 jeti', '≈200.000 ışık yılı']
      ];
      sat.forEach(([d, ad, alt], i) => {
        const y = 62 + i * 46, x = ek.X(d[0]);
        if (d.length > 1 && d[1]) s += S.kutu(x, y - 6, ek.X(d[1]) - x, 12, { dolgu: R.vurgu, renk: R.metin, kalin: 1 }, 3);
        else if (d.length > 1) s += S.ok(x, y, x + 34, y, { renk: R.vurgu, kalin: 2.4, boy: 8 }) + S.daire(x, y, 5.5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.5 });
        else s += S.daire(x, y, 5.5, { dolgu: i === 1 ? R.zemin : R.vurgu, renk: i === 1 ? R.metin : R.zemin, kalin: 1.6 });
        const xs = d.length > 1 && d[1] ? ek.X(d[1]) : x, sol = x > 250;
        const tx = sol ? x - 11 : xs + (d.length > 1 && !d[1] ? 44 : 11);
        s += S.zeminliYazi(tx, y + 5, ad, { boy: 13, hiza: sol ? 'end' : 'start', renk: R.metin, kalin: true });
        s += S.zeminliYazi(tx, y + 22, alt, { boy: 13, hiza: sol ? 'end' : 'start', renk: R.soluk });
      });
      s += S.yazi(8, 390, '1 ışık günü ≈ 173 AB ≈ 2,59 × 10¹⁰ km', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d48 · bölüm 8: görünür yanal hız β_g = β sin θ ÷ (1 − β cos θ); β → 1 sınırında cot(θ/2). */
  C.ekle('d48-isiktan-hizli', {
    ders: 'd48', bolum: 8, oran: 0.98,
    baslik: 'Işıktan hızlı yanılsama: görünen hız bakış açısına bağlıdır',
    aciklama: 'Yatay eksen düğümün hareketi ile bizim bakış doğrultumuz arasındaki açıdır; dikey eksen gökte görünen yanal hızın ışık hızına oranı. Eğriler dersteki formülden hesaplandı. Kesikli yatay çizginin üstü ışıktan hızlı görünür. Işık hızının yüzde 99\'uyla giden bir düğüm 8 derecelik açıda yaklaşık 7 kat ışık hızıyla gidiyormuş gibi görünür, ama aynı düğüm 60 derecede yavaş görünür. Işık hızının yüzde 90\'ında etki zayıftır. Noktalı eğri, hızın ışık hızına sınırsız yaklaştığı uçtur: hiçbir düğüm onun üstüne çıkamaz. M87\'de görülen 6 kat bu yüzden açının 19 dereceden küçük olmasını ister; oysa başka kanıtların söylediği 43 derecede sınır yaklaşık 2,5\'tir. 3C 273\'teki 9,6 katı ise ışık hızının yaklaşık yüzde 99,5\'ini gerektirir.',
    kaynak: [KAYNAK.isiktanHizli, KAYNAK.k3c273],
    ciz(S) {
      const R = S.R, rad = Math.PI / 180, bg = (b, t) => b * Math.sin(t * rad) / (1 - b * Math.cos(t * rad));
      const ek = S.eksen({ x: 46, y: 30, w: 334, h: 260 }, { x0: 0, x1: 90, y0: 0, y1: 12 }, {
        xIsaret: [[0, '0°'], [15, '15°'], [30, '30°'], [45, '45°'], [60, '60°'], [75, '75°'], [90, '90°']],
        yIsaret: [[0, '0'], [2, '2'], [4, '4'], [6, '6'], [8, '8'], [10, '10'], [12, '12']],
        xAd: 'hareket ile bakış doğrultusu arasındaki açı', yAd: 'görünen hız ÷ ışık hızı', yAdUzak: 32
      });
      let s = ek.svg;
      s += S.cizgi(ek.X(0), ek.Y(1), ek.X(90), ek.Y(1), { renk: R.uyari, kalin: 1.6, kesik: '6 4' });
      s += S.zeminliYazi(ek.X(89), ek.Y(1) - 6, 'ışık hızı', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      s += S.fonk(ek, t => { const y = 1 / Math.tan(t * rad / 2); return y <= 12 ? y : NaN; }, 9.5, 90, 160, { renk: R.metin, kalin: 1.8, kesik: '2 4' });
      s += S.fonk(ek, t => bg(0.9, t), 0, 90, 180, { renk: R.soluk, kalin: 2 });
      s += S.fonk(ek, t => bg(0.99, t), 0, 90, 360, { renk: R.vurgu, kalin: 3 });
      /* örnekler */
      const p = [8, bg(0.99, 8)];
      s += S.daire(ek.X(p[0]), ek.Y(p[1]), 5.5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.5 });
      s += S.zeminliYazi(ek.X(p[0]) + 10, ek.Y(p[1]) - 6, '%99 c, 8°: ≈' + tr(p[1], 1) + ' kat', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.cizgi(ek.X(0), ek.Y(9.6), ek.X(12), ek.Y(9.6), { renk: R.metin, kalin: 1.4 });
      s += S.zeminliYazi(ek.X(12) + 6, ek.Y(9.6) + 5, '3C 273: 9,6 kat', { boy: 13, renk: R.metin, kalin: true });
      [[19, 6, 'M87: 6 kat, 19°'], [43, 1 / Math.tan(21.5 * rad), '43°: en çok ≈2,5']].forEach(([t, y, m], i) => {
        s += S.kutu(ek.X(t) - 4.5, ek.Y(y) - 4.5, 9, 9, { dolgu: R.zemin, renk: R.metin, kalin: 1.8 });
        s += S.zeminliYazi(ek.X(t) + 9, ek.Y(y) - (i ? 10 : 4), m, { boy: 13, renk: R.metin });
      });
      s += S.zeminliYazi(ek.X(60), ek.Y(bg(0.99, 60)) + 22, 'hız: %99 c', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(ek.X(68), ek.Y(bg(0.9, 68)) + 26, '%90 c', { boy: 13, renk: R.soluk, kalin: true });
      s += S.zeminliYazi(ek.X(35), ek.Y(5), 'noktalı: c\'ye sınırsız yakın', { boy: 13, renk: R.metin });
      s += S.yazi(8, 376, 'görünen hız = β sin θ ÷ (1 − β cos θ)', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d49 ================================================================ */

  /* d49 · bölüm 0: ölçek merdiveni, ışık yılı (log). Değerler ders bölümlerinden ve d47 (D25 çapı). */
  C.ekle('d49-olcek-merdiveni', {
    ders: 'd49', bolum: 0, oran: 1.0,
    baslik: 'Galaksiden kozmik ağa: ölçeklerin merdiveni',
    aciklama: 'Yatay eksen ışık yılı cinsinden ve logaritmiktir: her çentik on kat. En solda Samanyolu\'nun çapı, yaklaşık 87.400 ışık yılı. Yerel Grup\'un iki ucu, Samanyolu ile Andromeda, yaklaşık 2,6 milyon ışık yılı ayrıdır. Başak Kümesi\'nin merkezi 53,8 milyon ışık yılı ötededir. Çoban Boşluğu\'nun yarıçapı yaklaşık 200 milyon, Büyük Duvar en az 500 milyon, baryon akustik salınım cetveli 490 milyon, Laniakea\'nın çapı yaklaşık 520 milyon ışık yılıdır. Sloan Büyük Duvarı 1,37 milyar, Millennium benzetiminin küpünün kenarı yaklaşık 2 milyar ışık yılıdır. Samanyolu ile Sloan Büyük Duvarı arasında yaklaşık on altı bin kat vardır. Kimi sayılar uzunluk, kimi uzaklıktır; satırda hangisi olduğu yazar.',
    kaynak: [KAYNAK.yerelGrup, KAYNAK.laniakea, KAYNAK.sloan, KAYNAK.coban, KAYNAK.bao, KAYNAK.millennium, KAYNAK.samanyolu],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 14, y: 24, w: 368, h: 316 }, { x0: 1e4, x1: 1e10, y0: 0, y1: 1 }, {
        logX: true,
        xIsaret: [[1e4, on(4)], [1e5, on(5)], [1e6, '1 milyon'], [1e7, on(7)], [1e8, on(8)], [1e9, '1 milyar'], [1e10, on(10)]],
        xAd: 'ışık yılı (logaritmik)'
      });
      let s = ek.svg.replace(/<line[^>]*x1="14" y1="24"[^>]*\/>/, '');
      const sat = [
        [87400, 'Samanyolu çapı', '≈87.400'],
        [800e3 * 3.2616, 'Samanyolu–Andromeda', '≈2,6 milyon (800 kpc)'],
        [53.8e6, 'Başak Kümesi\'ne uzaklık', '53,8 milyon'],
        [62e6 * 3.2616, 'Çoban Boşluğu yarıçapı', '≈200 milyon (62 Mpc)'],
        [490e6, 'BAO cetveli', '≈490 milyon (150 Mpc)'],
        [500e6, 'Büyük Duvar', 'en az 500 milyon'],
        [160e6 * 3.2616, 'Laniakea çapı', '≈520 milyon (160 Mpc)'],
        [1.37e9, 'Sloan Büyük Duvarı', '1,37 milyar'],
        [2e9, 'Millennium küpü kenarı', '≈2 milyar']
      ];
      sat.forEach(([d, ad, alt], i) => {
        const y = 44 + i * 33, x = ek.X(d), sol = x > 230;
        s += S.cizgi(x, y, x, 340, { renk: R.cizgi, kalin: 1, kesik: '2 4' });
        s += S.daire(x, y, 5.5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.5 });
        const tx = sol ? x - 10 : x + 10;
        s += S.zeminliYazi(tx, y + 5, ad, { boy: 13, hiza: sol ? 'end' : 'start', renk: R.metin, kalin: true });
        s += S.zeminliYazi(tx, y + 21, alt, { boy: 13, hiza: sol ? 'end' : 'start', renk: R.soluk });
      });
      return s;
    }
  });

  /* d49 · bölüm 10: madde ve hacim payları (Cautun ve ark. 2014): kütle lif 50, duvar 25, boşluk 15, küme 10;
     hacim boşluk 78, duvar 18, lif 6, küme ≈0. Hacim sütunu yuvarlama yüzünden 102'ye ölçeklendi. */
  C.ekle('d49-pay-hacim', {
    ders: 'd49', bolum: 10, oran: 1.0,
    baslik: 'Kozmik ağ: madde nerede, hacim nerede?',
    aciklama: 'Soldaki sütun evrendeki maddenin, sağdaki hacmin bileşenlere bölünüşüdür; aradaki şeritler aynı bileşeni birleştirir. Maddenin yarısı liflerde, yüzde 25\'i duvarlarda, yüzde 15\'i boşluklarda, yüzde 10\'u küme bölgelerindedir. Hacimde tablo tersine döner: boşluklar yüzde 78\'ini, duvarlar yüzde 18\'ini, lifler yalnızca yüzde 6\'sını kaplar; kümelerin hacmi önemsizdir, bu yüzden şeridi sağda bir çizgiye iner. Kütle payının hacim payına bölümü yoğunluğu verir: lifler ortalamadan yaklaşık 8 kat yoğun, duvarlar kabaca ortalama, boşluklar ortalamanın beşte biri kadardır. Hacim yüzdelerinin toplamı yuvarlama yüzünden 102 eder.',
    kaynak: [KAYNAK.cautun],
    ciz(S) {
      const R = S.R, ust = 50, H = 270, xl = 84, xr = 276, w = 40;
      const kat = [['küme', 10, 0, R.vurgu, 0.95], ['lif', 50, 6, R.vurgu, 0.6], ['duvar', 25, 18, R.vurgu, 0.35], ['boşluk', 15, 78, R.soluk, 0.25]];
      const tm = 100, th = 102;
      let s = '';
      s += S.yazi(xl + w / 2, 22, 'madde', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(xr + w / 2, 22, 'hacim', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      let ym = ust, yh = ust;
      kat.forEach(([ad, m, h, r, op], i) => {
        const hm = m / tm * H, hh = h / th * H;
        /* akış şeridi */
        s += `<polygon points="${xl + w},${ym.toFixed(1)} ${xr},${yh.toFixed(1)} ${xr},${(yh + hh).toFixed(1)} ${xl + w},${(ym + hm).toFixed(1)}" fill="${r}" opacity="${(op * 0.45).toFixed(2)}"/>`;
        s += S.kutu(xl, ym, w, hm, { dolgu: r, renk: R.zemin, kalin: 1.5, saydam: op });
        if (hh > 0.5) s += S.kutu(xr, yh, w, hh, { dolgu: r, renk: R.zemin, kalin: 1.5, saydam: op });
        s += S.kutu(xl, ym, w, hm, { renk: R.metin, kalin: 1 });
        if (hh > 0.5) s += S.kutu(xr, yh, w, hh, { renk: R.metin, kalin: 1 });
        s += S.yazi(xl - 8, ym + hm / 2 + 5, '%' + m, { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
        s += S.yazi(xr + w + 8, yh + Math.max(hh, 0) / 2 + 5 + (i === 0 ? -4 : 0), h ? '%' + h : '≈0', { boy: 13, renk: R.metin, kalin: true });
        /* bileşen adı şeridin ortasında */
        const mx = (xl + w + xr) / 2, my = (ym + hm / 2 + yh + hh / 2) / 2;
        s += S.zeminliYazi(mx, my + 5, ad, { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
        ym += hm; yh += hh;
      });
      s += S.yazi(8, 348, 'yoğunluk ÷ ortalama ≈ kütle payı ÷ hacim payı:', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 368, 'lif ≈' + tr(50 / 6, 0) + ' · duvar ≈' + tr(25 / 18, 1) + ' · boşluk ≈' + tr(15 / 78, 2), { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(392, 392, 'Cautun ve ark. 2014, benzetim', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d49 · bölüm 6: termal SZ tayf biçimi g(x) = x⁴eˣ/(eˣ−1)² × [x(eˣ+1)/(eˣ−1) − 4], x = hν/kT, T = 2,725 K (Carlstrom ve ark. 2002).
     Genlik göreli (büyütülmüş). Noktalı: arka plan ışımasının kendi tayfı x³/(eˣ−1), ayrı ölçekte. */
  C.ekle('d49-sz-etkisi', {
    ders: 'd49', bolum: 6, oran: 0.92,
    baslik: 'Sunyaev–Zeldovich etkisi: küme, arka plan ışımasında gölge ve leke',
    aciklama: 'Yatay eksen frekanstır. Kalın eğri, sıcak küme gazının arka plan ışımasında yaptığı değişikliktir; biçimi formülden hesaplandı, yüksekliği ise çok büyütüldü, çünkü gerçek etki küçüktür. Fotonlar sıcak elektronlardan enerji kaptığı için düşük frekanslardan yüksek frekanslara kayar. Bu yüzden yaklaşık 217 gigahertzin altında küme yönünde arka plan sönükleşir, küme bir gölge gibi görünür; 217 gigahertzte etki sıfırdır; üstünde küme parlak bir leke olur. Noktalı eğri arka plan ışımasının kendi tayfıdır ve ayrı ölçekte çizildi: etki tam bu ışığın bulunduğu frekanslarda ortaya çıkar.',
    kaynak: [KAYNAK.carlstrom, KAYNAK.planckSz],
    ciz(S) {
      const R = S.R, kh = 1.380649e-23 * 2.725 / 6.62607015e-34 / 1e9;   // GHz başına x
      const g = nu => { const x = nu / kh, ex = Math.exp(x); return Math.pow(x, 4) * ex / Math.pow(ex - 1, 2) * (x * (ex + 1) / (ex - 1) - 4); };
      const b = nu => { const x = nu / kh; return Math.pow(x, 3) / (Math.exp(x) - 1); };
      let gmax = 0, bmax = 0;
      for (let nu = 5; nu <= 700; nu += 5) { gmax = Math.max(gmax, Math.abs(g(nu))); bmax = Math.max(bmax, b(nu)); }
      const ek = S.eksen({ x: 30, y: 36, w: 350, h: 236 }, { x0: 0, x1: 700, y0: -1.15, y1: 1.15 }, {
        xIsaret: [[0, '0'], [100, '100'], [200, '200'], [300, '300'], [400, '400'], [500, '500'], [600, '600'], [700, '700']],
        xAd: 'frekans (gigahertz)', yAd: 'değişim (büyütülmüş)', yAdUzak: 14
      });
      /* alt ekseni sıfır çizgisine taşı: eksen svg'sinin yatay çizgisini kaldır, sıfıra çiz */
      let s = ek.svg;
      const y0 = ek.Y(0);
      /* gölge ve leke alanları */
      let alan1 = `M${ek.X(1)},${y0}`, alan2 = '';
      for (let nu = 1; nu <= 217; nu += 3) alan1 += ` L${ek.X(nu).toFixed(1)},${ek.Y(g(nu) / gmax).toFixed(1)}`;
      alan1 += ` L${ek.X(217.5)},${y0} Z`;
      alan2 = `M${ek.X(217.5)},${y0}`;
      for (let nu = 218; nu <= 700; nu += 3) alan2 += ` L${ek.X(nu).toFixed(1)},${ek.Y(g(nu) / gmax).toFixed(1)}`;
      alan2 += ` L${ek.X(700)},${y0} Z`;
      s += S.yol(alan1, { renk: 'none', dolgu: R.mavi, saydam: 0.3 }) + S.yol(alan2, { renk: 'none', dolgu: R.vurgu, saydam: 0.3 });
      s += S.cizgi(ek.X(0), y0, ek.X(700), y0, { renk: R.metin, kalin: 1.2 });
      s += S.fonk(ek, nu => b(nu) / bmax * 1.05, 2, 700, 200, { renk: R.soluk, kalin: 1.8, kesik: '2 4' });
      s += S.fonk(ek, nu => g(nu) / gmax, 1, 700, 280, { renk: R.metin, kalin: 3 });
      s += S.daire(ek.X(217.5), y0, 5, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
      s += S.zeminliYazi(ek.X(217.5) + 4, y0 + 22, '≈217 GHz: etki sıfır', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.zeminliYazi(ek.X(130), ek.Y(-0.85), 'gölge: arka plan sönük', { boy: 13, hiza: 'middle', renk: R.mavi, kalin: true });
      s += S.zeminliYazi(ek.X(470), ek.Y(0.95), 'leke: arka plan parlak', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(ek.X(560), ek.Y(0.35), 'noktalı: arka plan', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.zeminliYazi(ek.X(560), ek.Y(0.35) + 17, 'ışımasının tayfı', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(8, 352, 'T = 2,725 K; biçim hesap, yükseklik göreli', { boy: 13, renk: R.soluk });
      return s;
    }
  });
})();
