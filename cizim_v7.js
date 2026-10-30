/* cizim_v7.js — ders çizimleri (d57 Büyük Patlama, d58 kozmik mikrodalga arka plan). cizim.js kayıtları.
   d57: merkezi olmayan genişleme (harita benzetmesi ve sınırları), hafif element bollukları ve lityum açığı, Büyük Patlama ile
   Kararlı Durum tartışmasının kesinlik çizgileriyle zaman çizelgesi. d58: 3000 K'den 2,725 K'ye aynı biçimde kayan tayf,
   COBE FIRAS ölçümleri ile hesaplanmış 2,725 K kara cisim eğrisi (LAMBDA veri dosyası), Planck 2018 sıcaklık güç tayfı
   (Planck Legacy Archive dosyaları). Her değerin kaynağı: arastirma/cizim_v7_kaynak.md. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti, binlik nokta */
  const tr = (x, d) => {
    const s = Math.abs(x).toFixed(d == null ? 0 : d).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 ? '−' : '') + s.join(',');
  };
  const L10 = Math.log10;
  /* Kesinlik çizgileri: ünitenin basamakları çizgi biçimiyle ayrılır; renge dayanmaz (kırmızı mod) */
  const KES = {
    kesin: { kalin: 2.6, kesik: null }, guclu: { kalin: 1.2, kesik: null }, kuram: { kalin: 1.6, kesik: '6 3' },
    askida: { kalin: 1.6, kesik: '2 3' }
  };
  const etiket = (S, x, y, metin, tur, o) => {
    o = o || {};
    const boy = o.boy || 13, w = metin.length * boy * 0.6 + 14;
    const x0 = o.hiza === 'end' ? x - w : o.hiza === 'middle' ? x - w / 2 : x;
    return S.kutu(x0, y - boy - 3, w, boy + 9, { dolgu: S.R.yuzey, renk: S.R.metin, kalin: KES[tur].kalin, kesik: KES[tur].kesik }, 5) +
      S.yazi(x0 + 7, y + 1, metin, { boy, renk: S.R.metin });
  };

  /* Planck yasası (SI). Sabitler: NIST CODATA (h, k, c tam değerler) */
  const H = 6.62607015e-34, K = 1.380649e-23, CI = 299792458;
  const Bnu = (nu, T) => 2 * H * nu * nu * nu / (CI * CI) / Math.expm1(H * nu / (K * T));             // W m⁻² Hz⁻¹ sr⁻¹
  const Blam = (l, T) => 2 * H * CI * CI / Math.pow(l, 5) / Math.expm1(H * CI / (l * K * T));          // W m⁻³ sr⁻¹
  const WIEN = 2.897771955e-3;                                                                          // m·K (NIST)

  const KAYNAK = {
    bbWiki: { ad: 'Wikipedia: Big Bang', url: 'https://en.wikipedia.org/wiki/Big_Bang' },
    bbnWiki: { ad: 'Wikipedia: Big Bang nucleosynthesis', url: 'https://en.wikipedia.org/wiki/Big_Bang_nucleosynthesis' },
    hubbleWiki: { ad: "Wikipedia: Hubble's law", url: 'https://en.wikipedia.org/wiki/Hubble%27s_law' },
    friedmann: { ad: 'Wikipedia: Friedmann equations', url: 'https://en.wikipedia.org/wiki/Friedmann_equations' },
    lemaitre: { ad: 'Wikipedia: Georges Lemaître', url: 'https://en.wikipedia.org/wiki/Georges_Lema%C3%AEtre' },
    abg: { ad: 'Wikipedia: Alpher–Bethe–Gamow paper', url: 'https://en.wikipedia.org/wiki/Alpher%E2%80%93Bethe%E2%80%93Gamow_paper' },
    steady: { ad: 'Wikipedia: Steady-state model', url: 'https://en.wikipedia.org/wiki/Steady-state_model' },
    hoyle: { ad: 'Wikipedia: Fred Hoyle', url: 'https://en.wikipedia.org/wiki/Fred_Hoyle' },
    quasar: { ad: 'Wikipedia: Quasar', url: 'https://en.wikipedia.org/wiki/Quasar' },
    cmbWiki: { ad: 'Wikipedia: Cosmic microwave background', url: 'https://en.wikipedia.org/wiki/Cosmic_microwave_background' },
    firas: { ad: 'NASA LAMBDA: COBE FIRAS monopol tayfı (Fixsen ve ark. 1996, Tablo 4)', url: 'https://lambda.gsfc.nasa.gov/data/cobe/firas/monopole_spec/firas_monopole_spec_v1.txt' },
    fixsen96: { ad: 'Fixsen ve ark. 1996, ApJ 473, 576 (arXiv:astro-ph/9605054)', url: 'https://arxiv.org/abs/astro-ph/9605054' },
    nobel2006: { ad: 'Nobel 2006 Fizik basın bülteni', url: 'https://www.nobelprize.org/prizes/physics/2006/press-release/' },
    nist: { ad: 'NIST CODATA sabitleri', url: 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt' },
    planckSc: { ad: 'Wikipedia: Planck (spacecraft)', url: 'https://en.wikipedia.org/wiki/Planck_(spacecraft)' },
    pla: { ad: 'Planck Legacy Archive, 2018 TT güç tayfı (IRSA kopyası)', url: 'https://irsa.ipac.caltech.edu/data/Planck/release_3/ancillary-data/cosmoparams/COM_PowerSpect_CMB-TT-binned_R3.01.txt' },
    plaTeori: { ad: 'Planck Legacy Archive, 2018 en iyi uyum ΛCDM tayfı', url: 'https://irsa.ipac.caltech.edu/data/Planck/release_3/ancillary-data/cosmoparams/COM_PowerSpect_CMB-base-plikHM-TTTEEE-lowl-lowE-lensing-minimum-theory_R3.01.txt' },
    planck18: { ad: 'Planck 2018 VI: kozmolojik parametreler (arXiv:1807.06209)', url: 'https://arxiv.org/abs/1807.06209' },
    silk: { ad: 'Silk 2002, The Cosmic Microwave Background (arXiv:astro-ph/0212305)', url: 'https://arxiv.org/abs/astro-ph/0212305' },
    recomb: { ad: 'Wikipedia: Recombination (cosmology)', url: 'https://en.wikipedia.org/wiki/Recombination_(cosmology)' },
    gorunur: { ad: 'Wikipedia: Visible spectrum', url: 'https://en.wikipedia.org/wiki/Visible_spectrum' },
    mikro: { ad: 'Wikipedia: Microwave', url: 'https://en.wikipedia.org/wiki/Microwave' },
    kesif: { ad: 'Wikipedia: Discovery of cosmic microwave background radiation', url: 'https://en.wikipedia.org/wiki/Discovery_of_cosmic_microwave_background_radiation' }
  };

  /* ================================================================ d57 ================================================================ */

  /* d57 · bölüm 12: merkezi olmayan genişleme. Aynı 4 × 4 şehir ızgarası, ölçek 1,6 kat (örnek değer); iki ayrı şehirden bakış. */
  C.ekle('d57-merkez-yok', {
    ders: 'd57', bolum: 12, oran: 0.86,
    baslik: 'Merkezi olmayan genişleme: hangi şehirden bakarsan bak aynı desen',
    aciklama: "Dersteki harita benzetmesi: aynı 16 şehir, haritanın ölçeği büyüyünce gerçek uzaklıklar 1,6 katına çıkıyor; 1,6 yalnızca örnek bir değer. İçi boş halkalar şehirlerin dünkü, dolu noktalar bugünkü uzaklıklarını gösteriyor, oklar aradaki farktır. Solda A şehrinden, sağda B şehrinden bakılıyor ve iki desen aynıdır: her şehir ötekilerin kendisinden uzaklaştığını görür, iki kat uzaktaki şehir iki kat fazla uzaklaşır. Hubble–Lemaître yasası budur ve hiçbir şehir merkez değildir. Benzetmenin sınırları alttaki satırlarda: harita iki boyutludur ve ona dışarıdan bakarsın, evrenin ise dışı yoktur; kütleçekimiyle birbirine bağlı galaksiler, yıldızlar ve gezegenler genişlemeyle büyümez.",
    kaynak: [KAYNAK.bbWiki, KAYNAK.hubbleWiki],
    ciz(S) {
      const R = S.R, s0 = 26, k = 1.6;
      let s = S.yazi(200, 18, 'Aynı harita, ölçeği 1,6 kat büyüdükten sonra', { boy: 13, hiza: 'middle', renk: R.soluk });
      const panel = (px, oi, oj, harf, ek, oteki) => {
        let o = S.kutu(px, 28, 188, 206, { dolgu: 'none', renk: R.cizgi, kalin: 1 }, 6);
        o += S.yazi(px + 94, 47, harf + ek + ' bakınca', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
        /* gözlemciye göre konumlar; kutunun ortasına yerleştir */
        const lo = -oi * s0 * k, hi = (3 - oi) * s0 * k, lo2 = -oj * s0 * k, hi2 = (3 - oj) * s0 * k;
        const cx = px + 94 - (lo + hi) / 2, cy = 145 - (lo2 + hi2) / 2;
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          const dx = (i - oi) * s0, dy = (j - oj) * s0;
          if (!dx && !dy) continue;
          const x1 = cx + dx, y1 = cy + dy, x2 = cx + dx * k, y2 = cy + dy * k;
          o += S.daire(x1, y1, 3.2, { renk: R.soluk, kalin: 1.2 });
          const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
          o += S.ok(x1 + ux * 4, y1 + uy * 4, x2 - ux * 4.5, y2 - uy * 4.5, { renk: R.metin, kalin: 1.3, boy: 6 });
          o += S.daire(x2, y2, 3.8, { dolgu: R.metin, renk: 'none' });
          if (i === oteki[0] && j === oteki[1]) o += S.daire(x2, y2, 8, { renk: R.metin, kalin: 1.2, kesik: '2 2' }) + S.yazi(x2 + 11, y2 + 5, oteki[2], { boy: 13, renk: R.metin, kalin: true });
        }
        o += S.daire(cx, cy, 4.6, { dolgu: R.metin, renk: 'none' }) + S.daire(cx, cy, 9, { renk: R.metin, kalin: 1.6 });
        o += S.yazi(cx - 12, cy - 11, harf, { boy: 14, hiza: 'end', renk: R.metin, kalin: true });
        return o;
      };
      s += panel(8, 1, 1, 'A', "'dan", [2, 2, 'B']) + panel(204, 2, 2, 'B', "'den", [1, 1, 'A']);
      /* gösterge */
      const gy = 252;
      s += S.daire(16, gy - 4, 3.2, { renk: R.soluk, kalin: 1.2 }) + S.yazi(26, gy, 'dün', { boy: 13, renk: R.metin });
      s += S.daire(72, gy - 4, 3.8, { dolgu: R.metin, renk: 'none' }) + S.yazi(82, gy, 'bugün', { boy: 13, renk: R.metin });
      s += S.ok(136, gy - 4, 162, gy - 4, { renk: R.metin, kalin: 1.3, boy: 6 }) + S.yazi(170, gy, 'aradaki kayma', { boy: 13, renk: R.metin });
      s += S.yazi(12, 276, 'İki kat uzaktaki şehir iki kat uzaklaşır: v = H0 × d.', { boy: 13, renk: R.metin });
      s += S.yazi(12, 294, 'Hiçbir şehir merkez değil; her biri aynı deseni görür.', { boy: 13, renk: R.metin });
      s += S.yazi(12, 316, 'Sınır: harita iki boyutlu, sen dışarıdan bakıyorsun;', { boy: 13, renk: R.soluk });
      s += S.yazi(12, 334, 'evrenin dışı yok. Çekimle bağlı galaksiler büyümez.', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d57 · bölüm 9: hafif element bollukları (hidrojene göre kütle oranı) ve lityum açığı. Değerler dersin örneğinden. */
  C.ekle('d57-hafif-elementler', {
    ders: 'd57', bolum: 9, oran: 0.99,
    baslik: 'Hafif elementler: 250 milyon katlık aralık ve lityumdaki açık',
    aciklama: "Üstteki eksen logaritmiktir, her çentik yüz kat demektir. Halkalar Büyük Patlama'nın tek bir baryon foton oranından öngördüğü kütle oranlarıdır, hepsi hidrojene göre: helyum-4 yaklaşık 0,25, döteryum 10 üzeri eksi 3, helyum-3 10 üzeri eksi 4, lityum-7 10 üzeri eksi 9. En büyükle en küçük arasında 250 milyon kat var. Döteryumda uyum mükemmel, helyumda yakındır; bu ikisinin Büyük Patlama'dan geldiği gözlemle kesinleşmiştir. Alttaki doğrusal yakın plan lityumu gösterir: ölçülen değer öngörünün 2 ile 4 kat altında, yani milyarda 0,25 ile 0,5 arasında kalıyor. Logaritmik eksende küçük görünen bu fark, ölçüm hatalarından büyük olduğu için ciddiye alınır. Lityum sorunu açık bir sorudur, nedeni henüz bilinmiyor; noktalı çerçeve bunu gösterir.",
    kaynak: [KAYNAK.bbWiki, KAYNAK.bbnWiki],
    ciz(S) {
      const R = S.R, X = l => 122 + (l + 10) / 10 * 258, ya = 214;
      let s = S.yazi(8, 14, 'hidrojene göre kütle oranı, logaritmik', { boy: 13, renk: R.soluk });
      /* 250 milyon kat ayracı */
      const xa = X(-9), xb = X(L10(0.25));
      s += S.cizgi(xa, 34, xb, 34, { renk: R.metin, kalin: 1.2 }) + S.cizgi(xa, 28, xa, 40, { renk: R.metin, kalin: 1.2 }) + S.cizgi(xb, 28, xb, 40, { renk: R.metin, kalin: 1.2 });
      s += S.zeminliYazi((xa + xb) / 2, 38, '250 milyon kat', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      /* eksen */
      s += S.cizgi(122, ya, 380, ya, { renk: R.soluk, kalin: 1 });
      [[-10, '10⁻¹⁰'], [-8, '10⁻⁸'], [-6, '10⁻⁶'], [-4, '10⁻⁴'], [-2, '10⁻²'], [0, '1']].forEach(([l, t]) => {
        s += S.cizgi(X(l), ya, X(l), ya + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(l), ya + 20, t, { boy: 13, hiza: 'middle', renk: R.soluk });
        s += S.cizgi(X(l), 50, X(l), ya, { renk: R.cizgi, kalin: 1, kesik: '2 4' });
      });
      const satir = (y, ad, l, deger, tur, tag) => {
        let o = S.yazi(8, y + 5, ad, { boy: 13, renk: R.metin, kalin: true });
        o += S.cizgi(80, y, X(l) - 7, y, { renk: R.soluk, kalin: 1, kesik: '1 4' });
        o += S.daire(X(l), y, 5.5, { dolgu: R.zemin, renk: R.metin, kalin: 2 });
        o += S.zeminliYazi(X(l) + (l > -2 ? -10 : 10), y - 9, deger, { boy: 13, hiza: l > -2 ? 'end' : 'start', renk: R.metin });
        if (tag) o += etiket(S, 86, y + 5, tag, tur);
        return o;
      };
      s += satir(64, 'helyum-4', L10(0.25), '≈ 0,25', 'kesin', 'yakın uyum');
      s += satir(110, 'döteryum', -3, '≈ 10⁻³', 'kesin', 'mükemmel uyum');
      s += satir(154, 'helyum-3', -4, '≈ 10⁻⁴', null, null);
      s += satir(190, 'lityum-7', -9, '≈ 10⁻⁹', null, null);
      /* lityumun ölçülen aralığı üst eksende: 0,25–0,5 × 10⁻⁹ */
      s += S.kutu(X(L10(2.5e-10)), 185, X(L10(5e-10)) - X(L10(2.5e-10)), 10, { dolgu: R.metin, renk: 'none' }, 2);
      /* yakın plan */
      const y0 = 268, X2 = v => 40 + v / 1.2 * 340, ax = 366;
      s += S.cizgi(X(-9), 196, X(-9), 206, { renk: R.soluk, kalin: 1 });
      s += S.yol(`M${X(-9)},${ya + 26} L${X(-9)},${y0 - 12}`, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.zeminliYazi(X(-9) + 8, y0 - 14, 'lityum-7 yakından: doğrusal, birim 10⁻⁹', { boy: 13, renk: R.soluk });
      s += S.cizgi(40, ax, 380, ax, { renk: R.soluk, kalin: 1 });
      [0, 0.25, 0.5, 0.75, 1].forEach(v => { s += S.cizgi(X2(v), ax, X2(v), ax + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X2(v), ax + 20, tr(v, v === 0 || v === 1 ? 0 : 2), { boy: 13, hiza: 'middle', renk: R.soluk }); });
      /* öngörü */
      s += S.cizgi(X2(1), 290, X2(1), ax, { renk: R.metin, kalin: 1, kesik: '3 3' });
      s += S.daire(X2(1), 290, 5.5, { dolgu: R.zemin, renk: R.metin, kalin: 2 });
      s += S.yazi(X2(1) + 10, 295, 'öngörü ≈ 1', { boy: 13, renk: R.metin });
      /* ölçülen */
      s += S.kutu(X2(0.25), 300, X2(0.5) - X2(0.25), 14, { dolgu: R.metin, renk: 'none' }, 3);
      s += S.yazi(X2(0.25) - 8, 312, 'ölçülen', { boy: 13, hiza: 'end', renk: R.metin });
      /* açık */
      s += S.ok(X2(0.5) + 5, 307, X2(1) - 7, 307, { renk: R.metin, kalin: 1.4, boy: 7 }) + S.ok(X2(1) - 7, 307, X2(0.5) + 5, 307, { renk: R.metin, kalin: 1.4, boy: 7 });
      s += etiket(S, (X2(0.5) + X2(1)) / 2, 342, '2–4 kat eksik: açık soru', 'askida', { hiza: 'middle' });
      return s;
    }
  });

  /* d57 · bölüm 14: tartışmanın zaman çizelgesi; her fikir bir çizgi, çizginin biçimi o yıllardaki kesinliği. Yıllar ders metninden. */
  C.ekle('d57-tartisma-zaman', {
    ders: 'd57', bolum: 14, oran: 1.25,
    baslik: 'Büyük Patlama ile Kararlı Durum: fikirler basamak değiştiriyor',
    aciklama: "Zaman yukarıdan aşağı akıyor, 1915'ten 1995'e. Üç dikey çizgi üç fikirdir: genişleyen evren, sıcak başlangıçtan kalan artık ışıma ve Kararlı Durum. Çizginin biçimi o yıllardaki kesinliği gösterir: kesik çizgi kuram ya da hipotez, ince düz çizgi güçlü kanıtlı, kalın çizgi gözlemle kesinleşmiş. Genişleme 1922'de Friedmann'ın denklemlerinde kâğıt üstündedir, 1929'da Hubble'ın ölçümüyle gözleme bağlanır. Artık ışıma 1948'de yaklaşık 5 kelvinlik bir öngörüdür, 1965'te ölçülür, tayfı ve her yönde aynılığı 1968 ile 1970 arasında gösterilince kesinleşir. Kararlı Durum 1948'de doğar; 1961'deki radyo sayımları, 1967'deki kuasar sayımı ve arka plan ışıması onu 1960'ların sonunda çürütür. Hoyle'un 1993'teki yarı kararlı durum modeli kabul görmedi.",
    kaynak: [KAYNAK.friedmann, KAYNAK.lemaitre, KAYNAK.hubbleWiki, KAYNAK.abg, KAYNAK.steady, KAYNAK.hoyle, KAYNAK.quasar, KAYNAK.cmbWiki],
    ciz(S) {
      const R = S.R, Y = yr => 112 + (yr - 1915) / 80 * 318, eks = 58, T1 = 78, T2 = 100, T3 = 122, lx = 146;
      let s = '';
      /* yıl ekseni */
      s += S.cizgi(eks, Y(1915), eks, Y(1995), { renk: R.soluk, kalin: 1 });
      for (let yr = 1920; yr <= 1990; yr += 10) s += S.cizgi(eks - 5, Y(yr), eks, Y(yr), { renk: R.soluk, kalin: 1 }) + S.yazi(eks - 8, Y(yr) + 4, String(yr), { boy: 13, hiza: 'end', renk: R.soluk });
      /* başlıklar (dikey) */
      [[T1, 'genişleme'], [T2, 'artık ışıma'], [T3, 'Kararlı Durum']].forEach(([x, t]) => { s += S.yazi(x + 5, 100, t, { boy: 13, renk: R.metin, kalin: true, yan: -90 }); });
      const parca = (x, a, b, tur) => S.cizgi(x, Y(a), x, Y(b), { renk: R.metin, kalin: KES[tur].kalin, kesik: KES[tur].kesik });
      s += parca(T1, 1922, 1929, 'kuram') + parca(T1, 1929, 1995, 'kesin');
      s += parca(T2, 1948, 1965, 'kuram') + parca(T2, 1965, 1970, 'guclu') + parca(T2, 1970, 1995, 'kesin');
      s += parca(T3, 1948, 1968, 'kuram');
      const xk = (x, y, r) => S.cizgi(x - r, y - r, x + r, y + r, { renk: R.metin, kalin: 2.4 }) + S.cizgi(x - r, y + r, x + r, y - r, { renk: R.metin, kalin: 2.4 });
      s += xk(T3, Y(1968), 5);
      s += S.daire(T3, Y(1993), 4, { dolgu: R.zemin, renk: R.metin, kalin: 1.5, kesik: '2 2' });
      /* olaylar: [yıl, çizgi x, metin, nokta] — etiketler sırayla, üst üste binmesin diye en az 17 birim aralıkla */
      const OL = [
        [1917, eks, '1917 Einstein: durağan evren'],
        [1922, T1, '1922 Friedmann: genişleyen çözüm'],
        [1927, T1, '1927 Lemaître: 625 km/s/Mpc'],
        [1929, T1, '1929 Hubble: 500 km/s/Mpc, ölçüm'],
        [1931, T1, '1931 Lemaître: ilkel atom'],
        [1948, T2, '1948 Alpher–Herman: ≈ 5 K öngörü'],
        [1948, T3, '1948 Bondi, Gold, Hoyle'],
        [1949, T3, '1949 Hoyle radyoda “Big Bang” der'],
        [1961, T3, '1961 radyo sayımları ona karşı'],
        [1965, T2, '1965 arka plan ışıması ölçüldü'],
        [1967, T3, '1967 kuasarlar erken evrende bol', true],
        [1970, T2, '1968–70 kara cisim, her yönde aynı'],
        [1968, T3, "1960'ların sonu: çoğunluk vazgeçer", true],
        [1993, T3, '1993 yarı kararlı durum: tutmadı', true]
      ];
      let onceki = -99;
      OL.forEach(([yr, x, t, isaretsiz]) => {
        const py = Y(yr), ly = Math.max(py + 4, onceki + 17); onceki = ly;
        if (!isaretsiz) s += S.daire(x, py, 3.6, { dolgu: R.metin, renk: R.zemin, kalin: 1 });
        s += S.yol(`M${x + 5},${py} L${lx - 14},${py} L${lx - 4},${ly - 4}`, { renk: R.soluk, kalin: 1 });
        s += S.yazi(lx, ly, t, { boy: 13, renk: R.metin });
      });
      /* gösterge */
      const g = (x, y, tur, t) => S.cizgi(x, y - 4, x + 28, y - 4, { renk: R.metin, kalin: KES[tur].kalin, kesik: KES[tur].kesik }) + S.yazi(x + 36, y, t, { boy: 13, renk: R.metin });
      s += g(12, 462, 'kesin', 'gözlemle kesinleşmiş') + g(206, 462, 'guclu', 'güçlü kanıtlı');
      s += g(12, 486, 'kuram', 'kuram ya da hipotez');
      s += xk(220, 482, 5) + S.yazi(242, 486, 'gözlemle çürütüldü', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* ================================================================ d58 ================================================================ */

  /* d58 · bölüm 4: 3000 K ve 2,725 K kara cisim tayfları, dalga boyuna göre (Planck yasası, her biri kendi tepesine göre ölçekli) */
  C.ekle('d58-yolculuk', {
    ders: 'd58', bolum: 4, oran: 0.9,
    baslik: '3000 kelvinden 2,725 kelvine: aynı tayf, 1090 kat uzamış',
    aciklama: "İki eğri Planck yasasıyla hesaplanmış iki kara cisim tayfıdır; yatay eksen logaritmik dalga boyudur, her çentik on kat. Kesikli eğri ışığın salındığı anı, evrenin yaklaşık 380.000 yaşında ve 3000 kelvin sıcaklıkta olduğu çağı gösterir: tepe 966 nanometrede, görünür kırmızının hemen ötesindedir. Düz eğri bugünkü 2,725 kelvinlik ışımadır: tepe 1,06 milimetrede, mikrodalganın kısa ucundadır. Evren yaklaşık 1090 kat genişledi ve her dalga boyu aynı oranda uzadı; logaritmik eksende bu, eğrinin biçimi bozulmadan sağa kayması demektir. Fotonun tipik enerjisi de 0,26 elektronvolttan 0,23 milielektronvolta indi. Penzias ve Wilson 7,35 santimetrede, tepenin 69 kat uzun dalga boylu kuyruğunda ölçüm yapıyordu. Her eğri kendi tepesine göre ölçeklendi; bugünkü ışık gerçekte çok daha sönüktür.",
    kaynak: [KAYNAK.cmbWiki, KAYNAK.recomb, KAYNAK.kesif, KAYNAK.gorunur, KAYNAK.mikro, KAYNAK.nist],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 26, y: 100, w: 356, h: 188 }, { x0: 1e-7, x1: 1e-1, y0: 0, y1: 1.4 }, {
        logX: true,
        xIsaret: [[1e-7, '100 nm'], [1e-6, '1 μm'], [1e-5, '10 μm'], [1e-4, '100 μm'], [1e-3, '1 mm'], [1e-2, '1 cm'], [1e-1, '10 cm']],
        xAd: 'dalga boyu, logaritmik'
      });
      let s = '';
      /* bilgi kartları */
      const kart = (x, b1, b2, b3) => S.kutu(x, 6, 182, 70, { dolgu: R.yuzey, renk: R.cizgi, kalin: 1 }, 6) +
        S.yazi(x + 9, 26, b1, { boy: 13, renk: R.metin, kalin: true }) + S.yazi(x + 9, 46, b2, { boy: 13, renk: R.metin }) + S.yazi(x + 9, 65, b3, { boy: 13, renk: R.metin });
      s += kart(6, 'Salındığında: ≈ 380.000 yıl', '3000 K, tepe 966 nm', 'foton ≈ 0,26 eV');
      s += kart(212, 'Bugün: 13,8 milyar yıl', '2,725 K, tepe 1,06 mm', 'foton ≈ 0,23 meV');
      s += S.ok(190, 41, 209, 41, { renk: R.metin, kalin: 1.6, boy: 7 });
      /* bantlar */
      s += S.kutu(ek.X(3.8e-7), 100, ek.X(7.5e-7) - ek.X(3.8e-7), 188, { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.55 });
      s += S.kutu(ek.X(1e-3), 100, ek.X(1e-1) - ek.X(1e-3), 188, { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.35 });
      s += S.yazi(ek.X(5.3e-7), 115, 'görünür', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(ek.X(1e-1) - 4, 115, 'mikrodalga: 1 mm–1 m', { boy: 13, hiza: 'end', renk: R.metin });
      s += ek.svg;
      /* eğriler */
      const f = T => { const lp = WIEN / T, m = Blam(lp, T); return l => Blam(l, T) / m; };
      s += S.fonk(ek, f(3000), 1e-7, 1e-1, 300, { renk: R.metin, kalin: 2, kesik: '7 4' }, true);
      s += S.fonk(ek, f(2.725), 1e-7, 1e-1, 300, { renk: R.metin, kalin: 2.6 }, true);
      const p1 = ek.X(WIEN / 3000), p2 = ek.X(WIEN / 2.725), yt = ek.Y(1);
      s += S.cizgi(p1, yt, p1, ek.Y(0), { renk: R.soluk, kalin: 1, kesik: '2 3' }) + S.cizgi(p2, yt, p2, ek.Y(0), { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.zeminliYazi(p1 + 8, yt + 26, '3000 K', { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(p2 - 8, yt + 26, '2,725 K', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.ok(p1 + 6, yt - 9, p2 - 6, yt - 9, { renk: R.metin, kalin: 1.6, boy: 8 });
      s += S.zeminliYazi((p1 + p2) / 2, yt - 15, 'her dalga boyu ≈ 1090 kat uzadı', { boy: 13, hiza: 'middle', renk: R.metin });
      /* Penzias–Wilson, 7,35 cm */
      const xp = ek.X(0.0735);
      s += `<polygon points="${xp - 5},${ek.Y(0) - 12} ${xp + 5},${ek.Y(0) - 12} ${xp},${ek.Y(0) - 2}" fill="${R.metin}"/>`;
      s += S.yazi(382, ek.Y(0) - 48, '1964 ölçümü', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(382, ek.Y(0) - 30, '7,35 cm', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(200, 354, 'Her eğri kendi tepesine göre ölçeklendi.', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d58 · bölüm 6: COBE FIRAS monopol tayfı (LAMBDA, Fixsen ve ark. 1996 Tablo 4): [frekans GHz, parlaklık MJy/sr].
     Frekans = dalga sayısı (cm⁻¹) × 29,9792458. Eğri: Planck yasası, T = 2,72548 K. */
  const FIRAS = [[68.1, 200.72], [81.5, 249.51], [95.3, 293.02], [108.8, 327.77], [122.3, 354.08], [136.1, 372.08], [149.6, 381.49], [163.4, 383.48], [176.9, 378.9], [190.4, 368.83], [204.2, 354.06], [217.6, 336.28], [231.1, 316.08], [244.9, 293.92], [258.4, 271.43], [272.2, 248.24], [285.7, 225.94], [299.2, 204.33], [313.0, 183.26], [326.5, 163.83], [340.0, 145.75], [353.8, 128.84], [367.2, 113.57], [381.0, 99.45], [394.5, 87.04], [408.0, 75.88], [421.8, 65.77], [435.3, 57.01], [448.8, 49.22], [462.6, 42.27], [476.1, 36.35], [489.9, 31.06], [503.4, 26.58], [516.8, 22.64], [530.6, 19.25], [544.1, 16.39], [557.9, 13.81], [571.4, 11.72], [584.9, 9.92], [598.7, 8.36], [612.2, 7.09], [625.7, 5.8], [639.5, 4.52]];
  C.ekle('d58-firas', {
    ders: 'd58', bolum: 6, oran: 0.75,
    baslik: 'COBE FIRAS: doğada ölçülmüş en kusursuz kara cisim tayfı',
    aciklama: "Halkalar COBE uydusundaki FIRAS aletinin 43 frekansta ölçtüğü parlaklıktır; veri NASA'nın LAMBDA arşivindeki Fixsen ve arkadaşlarının 1996 tablosundan alındı. Çizgi ölçüm değil, Planck yasasıyla 2,725 kelvin için hesaplanmış kara cisim eğrisidir. Halkaların hepsi çizginin tam üstüne oturuyor. Her noktanın belirsizliği en fazla 0,28 megajansky bölü steradyan, tepedeki 384'ün yaklaşık on binde yedisi; bu çizimde bir pikselin kesri kadar olduğu için hata çubukları görünmez. Tepe 160,2 gigahertzte, yaklaşık 1,9 milimetrededir. Tozdan ya da çok sayıda ayrı kaynaktan gelen bir ışıma böyle tek sıcaklıklı, kusursuz bir eğri vermez; bu tayf sıcak ve yoğun erken evrenin en temiz kanıtlarından biridir.",
    kaynak: [KAYNAK.firas, KAYNAK.fixsen96, KAYNAK.bbWiki, KAYNAK.nobel2006, KAYNAK.planckSc, KAYNAK.nist],
    ciz(S) {
      const R = S.R, T0 = 2.72548;
      const ek = S.eksen({ x: 62, y: 50, w: 318, h: 200 }, { x0: 0, x1: 700, y0: 0, y1: 420 }, {
        xIsaret: [[0, '0'], [100, '100'], [200, '200'], [300, '300'], [400, '400'], [500, '500'], [600, '600']],
        yIsaret: [[0, '0'], [100, '100'], [200, '200'], [300, '300'], [400, '400']],
        xAd: 'frekans (gigahertz)', yAd: 'parlaklık (MJy/sr)', yAdUzak: 46
      });
      let s = S.yazi(62, 16, 'dalga boyu', { boy: 13, renk: R.soluk });
      /* üst eksen: dalga boyu */
      s += S.cizgi(62, 50, 380, 50, { renk: R.cizgi, kalin: 1 });
      [[2, '2 mm'], [1, '1 mm'], [0.5, '0,5 mm']].forEach(([mm, t]) => {
        const x = ek.X(CI / (mm * 1e-3) / 1e9);
        s += S.cizgi(x, 50, x, 44, { renk: R.soluk, kalin: 1 }) + S.yazi(x, 38, t, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += ek.svg;
      /* tepe */
      const xt = ek.X(160.2), yt = ek.Y(Bnu(160.2e9, T0) / 1e-20);
      s += S.cizgi(xt, yt, xt, ek.Y(0), { renk: R.soluk, kalin: 1, kesik: '3 3' });
      s += S.fonk(ek, v => Bnu(v * 1e9, T0) / 1e-20, 1, 700, 200, { renk: R.metin, kalin: 2 });
      FIRAS.forEach(([v, I]) => { s += S.daire(ek.X(v), ek.Y(I), 3.2, { dolgu: R.zemin, renk: R.metin, kalin: 1.4 }); });
      s += S.zeminliYazi(xt + 46, yt + 12, 'tepe: 160,2 GHz', { boy: 13, renk: R.metin, kalin: true });
      /* gösterge */
      const gx = 236;
      s += S.cizgi(gx, 104, gx + 22, 104, { renk: R.metin, kalin: 2 }) + S.yazi(gx + 28, 108, '2,725 K, hesap', { boy: 13, renk: R.metin });
      s += S.daire(gx + 11, 126, 3.2, { dolgu: R.zemin, renk: R.metin, kalin: 1.4 }) + S.yazi(gx + 28, 130, 'FIRAS, 43 frekans', { boy: 13, renk: R.metin });
      s += S.yazi(gx, 156, 'hata çubukları çizgiden', { boy: 13, renk: R.soluk });
      s += S.yazi(gx, 173, 'ince: en çok 0,28 MJy/sr', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d58 · bölüm 8: Planck 2018 TT güç tayfı. PB: gruplanmış ölçüm [ℓ, Dℓ μK², ±σ] (COM_PowerSpect_CMB-TT-binned_R3.01);
     TEO: en iyi uyum ΛCDM Dℓ, ℓ = 2–29 her biri, sonra 30'dan 2500'e 5'er (…minimum-theory_R3.01). */
  const PB = [[47.7, 1479, 51], [76.5, 2035, 55], [105.9, 2955, 65], [135.6, 3870, 77], [165.4, 4889, 87], [195.3, 5464, 91], [225.2, 5793, 87], [255.1, 5373, 77], [285.0, 4628, 63], [315.0, 3604, 47], [344.9, 2631, 34], [374.9, 2033, 25], [404.9, 1753, 21], [434.8, 1788, 21], [464.8, 2162, 23], [494.8, 2422, 25], [524.8, 2573, 26], [554.8, 2546, 25], [584.8, 2361, 23], [614.7, 2095, 20], [644.7, 1885, 18], [674.7, 1813, 16], [704.7, 1883, 17], [734.7, 2097, 18], [764.7, 2319, 20], [794.7, 2465, 21], [824.7, 2522, 21], [854.7, 2394, 19], [884.7, 2083, 17], [914.7, 1741, 14], [944.7, 1419, 11], [974.7, 1173, 9], [1004.6, 1062, 8], [1034.6, 1048, 8], [1064.6, 1132, 9], [1094.6, 1211, 9], [1124.6, 1232, 9], [1154.6, 1206, 9], [1184.6, 1118, 8], [1214.6, 968, 8], [1244.6, 864, 7], [1274.6, 762, 6], [1304.6, 732, 6], [1334.6, 737, 6], [1364.6, 775, 6], [1394.6, 807, 6], [1424.6, 809, 6], [1454.6, 778, 6], [1484.6, 729, 6], [1514.6, 648, 5], [1544.6, 551, 5], [1574.6, 477, 4], [1604.6, 420, 4], [1634.6, 395, 4], [1664.6, 392, 4], [1694.6, 393, 4], [1724.6, 398, 4], [1754.6, 383, 4], [1784.6, 375, 4], [1814.6, 340, 4], [1844.6, 308, 4], [1874.6, 274, 4], [1904.6, 250, 5], [1934.6, 244, 5], [1964.6, 232, 5], [1994.6, 235, 5], [2024.6, 232, 6], [2054.6, 220, 6], [2084.6, 214, 7], [2114.6, 197, 7], [2144.6, 176, 7], [2174.6, 152, 8], [2204.6, 139, 8], [2234.6, 121, 9], [2264.6, 116, 9], [2294.6, 118, 10], [2324.6, 116, 11], [2354.6, 110, 12], [2384.6, 120, 12], [2414.6, 90, 13], [2444.6, 103, 14], [2474.6, 74, 16], [2499.0, 61, 21]];
  const TEO = [1017, 964, 913, 874, 849, 832, 822, 818, 817, 819, 824, 831, 838, 846, 856, 867, 879, 892, 905, 919, 932, 947, 961, 976, 991, 1007, 1022, 1038, 1055, 1139, 1229, 1323, 1421, 1524, 1632, 1745, 1864, 1988, 2118, 2255, 2397, 2545, 2698, 2856, 3019, 3185, 3355, 3527, 3701, 3874, 4046, 4216, 4382, 4544, 4699, 4848, 4989, 5121, 5241, 5350, 5447, 5530, 5600, 5656, 5697, 5721, 5730, 5724, 5701, 5664, 5610, 5542, 5460, 5365, 5257, 5138, 5009, 4870, 4723, 4569, 4409, 4245, 4078, 3908, 3738, 3569, 3402, 3238, 3078, 2924, 2777, 2637, 2505, 2382, 2268, 2165, 2073, 1991, 1920, 1860, 1812, 1774, 1747, 1730, 1723, 1725, 1736, 1755, 1782, 1815, 1853, 1897, 1944, 1994, 2047, 2101, 2155, 2209, 2262, 2312, 2361, 2406, 2447, 2483, 2515, 2542, 2563, 2579, 2589, 2594, 2592, 2585, 2573, 2555, 2533, 2506, 2475, 2440, 2402, 2362, 2319, 2275, 2231, 2186, 2141, 2097, 2055, 2014, 1976, 1941, 1909, 1881, 1857, 1837, 1822, 1812, 1806, 1805, 1808, 1817, 1829, 1847, 1868, 1893, 1922, 1954, 1988, 2025, 2064, 2104, 2145, 2186, 2227, 2268, 2307, 2345, 2380, 2413, 2443, 2470, 2493, 2511, 2526, 2536, 2541, 2542, 2537, 2528, 2514, 2495, 2471, 2442, 2410, 2373, 2332, 2287, 2239, 2189, 2135, 2080, 2023, 1964, 1905, 1845, 1785, 1725, 1666, 1608, 1552, 1498, 1445, 1396, 1349, 1305, 1264, 1226, 1192, 1162, 1135, 1111, 1091, 1075, 1062, 1053, 1047, 1044, 1043, 1046, 1050, 1057, 1066, 1076, 1088, 1100, 1114, 1128, 1142, 1156, 1169, 1182, 1194, 1206, 1216, 1224, 1231, 1236, 1240, 1241, 1241, 1239, 1234, 1228, 1220, 1210, 1197, 1184, 1169, 1152, 1134, 1114, 1094, 1073, 1051, 1029, 1007, 984, 961, 939, 917, 896, 876, 856, 837, 820, 804, 789, 775, 763, 753, 744, 736, 730, 726, 723, 721, 721, 722, 724, 727, 731, 736, 741, 747, 754, 761, 768, 775, 781, 788, 794, 800, 805, 809, 813, 816, 818, 818, 818, 817, 815, 811, 806, 800, 793, 785, 776, 766, 755, 744, 731, 718, 704, 689, 674, 659, 644, 628, 612, 597, 581, 566, 551, 536, 522, 508, 495, 483, 471, 460, 450, 440, 432, 424, 417, 411, 405, 401, 397, 394, 391, 389, 388, 387, 386, 386, 387, 388, 388, 390, 391, 392, 393, 394, 396, 396, 397, 398, 398, 398, 397, 396, 395, 394, 392, 389, 387, 384, 380, 376, 372, 367, 363, 358, 352, 347, 341, 335, 330, 324, 318, 312, 306, 300, 294, 289, 283, 278, 273, 269, 264, 260, 256, 253, 249, 246, 244, 241, 239, 237, 236, 234, 233, 233, 232, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 230, 229, 228, 227, 226, 225, 223, 221, 220, 217, 215, 213, 210, 207, 204, 201, 198, 195, 192, 188, 185, 181, 178, 174, 171, 168, 164, 161, 158, 154, 151, 148, 146, 143, 140, 138, 136, 133, 131, 129, 128, 126, 125, 123, 122, 121, 120, 119, 118, 117, 117, 116, 116, 115, 115, 114, 114, 113, 113, 113, 112, 112, 111, 111, 110, 110, 109, 108, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 96, 95, 94, 93, 91, 90, 89, 87, 86, 85, 83, 82, 81, 80, 79];
  const teoL = i => i < 28 ? i + 2 : 30 + (i - 28) * 5;
  C.ekle('d58-guc-tayfi', {
    ders: 'd58', bolum: 8, oran: 0.93,
    baslik: 'Plazmadaki sesin izi: Planck 2018 güç tayfı ve akustik zirveler',
    aciklama: "Yatay eksen lekelerin gökteki boyutudur ve sağa doğru küçülür: üstteki ölçek dereceyi, alttaki ölçek gökbilimcilerin kullandığı sıra sayısını gösterir, kabaca 180 derece bölü bu sayı. Dikey eksen o boyuttaki sıcaklık farklarının gücüdür, mikrokelvin karesi cinsinden. Noktalar Planck uydusunun 2018 ölçümleridir, yaklaşık 50'den 2500'e gruplanmış; çizgi altı parametreli ΛCDM modelinin en iyi uyumudur. Belirsizlik çubukları çoğu yerde noktadan küçüktür. En güçlü tepe, birinci akustik zirve, sıra sayısı 220 civarında, yani yaklaşık 1 derecelik lekelerdedir ve uzayın eğriliğini söyler. İkinci zirve 537, üçüncüsü 814 civarındadır; ikincisinin üçüncüye göre alçaklığı sıradan maddenin, üçüncüsü karanlık maddenin miktarını ele verir. Sağa doğru zirveler Silk sönümüyle zayıflar. Zirvelerin varlığı ve konumları gözlemle kesinleşmiştir.",
    kaynak: [KAYNAK.pla, KAYNAK.plaTeori, KAYNAK.planck18, KAYNAK.cmbWiki, KAYNAK.silk],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 64, y: 62, w: 316, h: 206 }, { x0: 2, x1: 2500, y0: 0, y1: 6500 }, {
        logX: true,
        xIsaret: [[2, '2'], [10, '10'], [100, '100'], [1000, '1000']],
        yIsaret: [[0, '0'], [2000, '2.000'], [4000, '4.000'], [6000, '6.000']],
        xAd: 'sıra sayısı ℓ, logaritmik', yAd: 'güç (μK²)', yAdUzak: 50
      });
      let s = S.yazi(64, 16, 'lekenin gökteki boyu ≈ 180° / ℓ', { boy: 13, renk: R.soluk });
      s += S.cizgi(64, 62, 380, 62, { renk: R.cizgi, kalin: 1 });
      [[2, '90°'], [18, '10°'], [180, '1°'], [1800, '0,1°']].forEach(([l, t]) => {
        const x = ek.X(l); s += S.cizgi(x, 62, x, 56, { renk: R.soluk, kalin: 1 }) + S.yazi(x, 48, t, { boy: 13, hiza: l === 2 ? 'start' : 'middle', renk: R.soluk });
      });
      s += ek.svg;
      s += S.egri(TEO.map((d, i) => [ek.X(teoL(i)), ek.Y(d)]), { renk: R.vurgu, kalin: 1.8 });
      PB.forEach(([l, d, e]) => {
        const x = ek.X(l);
        if (e > 6) s += S.cizgi(x, ek.Y(d + e), x, ek.Y(d - e), { renk: R.metin, kalin: 1 });
        s += S.daire(x, ek.Y(d), 2, { dolgu: R.metin, renk: 'none' });
      });
      /* zirve numaraları */
      [[220, 5730, '1'], [537, 2594, '2'], [814, 2542, '3']].forEach(([l, d, t]) => { s += S.yazi(ek.X(l), ek.Y(d) - 12, t, { boy: 14, hiza: 'middle', renk: R.metin, kalin: true }); });
      s += S.zeminliYazi(74, 104, '1. zirve, ℓ ≈ 220: eğrilik', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(74, 122, '2. zirve: sıradan madde', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(74, 140, '3. zirve: karanlık madde', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(380, 150, 'Silk sönümü', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.ok(362, 156, ek.X(1700), ek.Y(700), { renk: R.metin, kalin: 1.2, boy: 6 });
      /* gösterge */
      s += S.daire(70, 330, 2.4, { dolgu: R.metin, renk: 'none' }) + S.yazi(80, 334, 'Planck 2018 ölçümü', { boy: 13, renk: R.metin });
      s += S.cizgi(60, 350, 78, 350, { renk: R.vurgu, kalin: 1.8 }) + S.yazi(84, 354, 'ΛCDM en iyi uyumu', { boy: 13, renk: R.metin });
      s += S.yazi(240, 334, 'ℓ < 30 noktaları', { boy: 13, renk: R.soluk }) + S.yazi(240, 354, 'çizilmedi', { boy: 13, renk: R.soluk });
      return s;
    }
  });
})();
