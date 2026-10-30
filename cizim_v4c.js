/* cizim_v4c.js — fizik ünitesi ders çizimleri (d27, d28, d30, d33). cizim.js kayıtları.
   Sayılar ders metninden (kaynaklı) gelir ya da burada formülle hesaplanır (Planck yasası, Einstein'ın fotoelektrik denklemi,
   dikdörtgen engelden geçme olasılığı, Gamow tepesi, Carnot verimi, binom sayıları, Wien yasası, λ = c ÷ f).
   Çift yarık karelerindeki noktalar sabit tohumlu bir benzetimdir; elektron sayıları Tonomura'nın karelerinden.
   Her değerin kaynağı: arastirma/cizim_v4c_kaynak.md. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti, binlik nokta */
  const tr = (x, d) => {
    const s = Math.abs(x).toFixed(d == null ? 0 : d).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 ? '−' : '') + s.join(',');
  };
  /* Fizik sabitleri (SI tanımlı değerler; ders metinlerinde de geçer) */
  const H = 6.62607015e-34, KB = 1.380649e-23, CI = 299792458, EV = 1.602176634e-19;
  const KAYNAK = {
    planckSabiti: { ad: 'Wikipedia: Planck constant', url: 'https://en.wikipedia.org/wiki/Planck_constant' },
    planckYasasi: { ad: 'Wikipedia: Planck\'s law', url: 'https://en.wikipedia.org/wiki/Planck%27s_law' },
    rayleighJeans: { ad: 'Wikipedia: Rayleigh–Jeans law', url: 'https://en.wikipedia.org/wiki/Rayleigh%E2%80%93Jeans_law' },
    planckTarih: { ad: 'arXiv:2402.03405, Planck ve morötesi felaketi', url: 'https://arxiv.org/html/2402.03405v1' },
    millikanAps: { ad: 'APS Physics: Robert Millikan and the photoelectric effect', url: 'https://physics.aps.org/story/v3/st23' },
    quarknet: { ad: 'QuarkNet: Millikan photoelectric analysis', url: 'https://quarknet.org/sites/default/files/MillikanPhotoelectricAnalysis.pdf' },
    tonomura: { ad: 'Tonomura ve ark. 1989, Am. J. Phys. 57, 117', url: 'https://stovneng.folk.ntnu.no/TFY4215_2022/artikler/tonomura_1989.pdf' },
    physicsWorld: { ad: 'Physics World: The double-slit experiment', url: 'https://physicsworld.com/a/the-double-slit-experiment/' },
    pauli: { ad: 'Wikipedia: Pauli exclusion principle', url: 'https://en.wikipedia.org/wiki/Pauli_exclusion_principle' },
    engel: { ad: 'Wikipedia: Rectangular potential barrier', url: 'https://en.wikipedia.org/wiki/Rectangular_potential_barrier' },
    gamow: { ad: 'Wikipedia: George Gamow', url: 'https://en.wikipedia.org/wiki/George_Gamow' },
    yildizReaktor: { ad: 'Stars as thermonuclear reactors (arXiv:astro-ph/0405568)', url: 'https://arxiv.org/pdf/astro-ph/0405568' },
    ppZinciri: { ad: 'Wikipedia: Proton–proton chain', url: 'https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain' },
    carnot: { ad: 'Wikipedia: Nicolas Léonard Sadi Carnot', url: 'https://en.wikipedia.org/wiki/Nicolas_L%C3%A9onard_Sadi_Carnot' },
    termoYasa: { ad: 'Wikipedia: Laws of thermodynamics', url: 'https://en.wikipedia.org/wiki/Laws_of_thermodynamics' },
    entropiTarih: { ad: 'Wikipedia: History of entropy', url: 'https://en.wikipedia.org/wiki/History_of_entropy' },
    boltzmannMezar: { ad: 'Atlas Obscura: Boltzmann\'s Grave', url: 'https://www.atlasobscura.com/places/boltzmanns-grave' },
    chaisson: { ad: 'E. Chaisson (arXiv:1406.2730)', url: 'https://arxiv.org/abs/1406.2730' },
    entropiYasam: { ad: 'Wikipedia: Entropy and life', url: 'https://en.wikipedia.org/wiki/Entropy_and_life' },
    nasaDunya: { ad: 'NASA Earth Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
    faraday: { ad: 'Historical Physicists: Michael Faraday', url: 'https://brendanjameslynskey.github.io/Historical_Physicists/Faraday' },
    eia: { ad: 'U.S. EIA: How electricity is generated', url: 'https://www.eia.gov/energyexplained/electricity/how-electricity-is-generated.php' },
    maxwellTarih: { ad: 'Wikipedia: History of Maxwell\'s equations', url: 'https://en.wikipedia.org/wiki/History_of_Maxwell%27s_equations' },
    codata: { ad: 'NIST CODATA 2022 sabitler tablosu', url: 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt' },
    jansky: { ad: 'Wikipedia: Karl Guthe Jansky', url: 'https://en.wikipedia.org/wiki/Karl_Guthe_Jansky' },
    nasaEM: { ad: 'NASA Science: Anatomy of an Electromagnetic Wave', url: 'https://science.nasa.gov/ems/02_anatomy/' },
    mikrodalga: { ad: 'Universe Today: How do microwaves work?', url: 'https://www.universetoday.com/articles/how-do-microwaves-work' },
    bgs: { ad: 'British Geological Survey: Earth\'s magnetic field', url: 'http://www.geomag.bgs.ac.uk/education/earthmag.html' },
    hale: { ad: 'HAO/UCAR: George Ellery Hale', url: 'https://www2.hao.ucar.edu/education/scientists/george-ellery-hale-1868-1938' },
    radiopaedia: { ad: 'Radiopaedia: Tesla (SI unit)', url: 'https://radiopaedia.org/articles/58849' }
  };

  /* Dalgalı çizgi (foton): (x1,y1) → (x2,y2), dalga sayısı n, genlik g; uçta ok başı */
  const dalga = (S, x1, y1, x2, y2, n, g, o) => {
    o = Object.assign({ renk: S.R.vurgu, kalin: 1.6, boy: 7 }, o || {});
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, bas = o.boy * 1.1, adim = Math.max(24, n * 14), ls = [];
    for (let i = 0; i <= adim; i++) {
      const t = i / adim, s = g * Math.sin(t * n * 2 * Math.PI), d = (L - bas) * t;
      ls.push([x1 + ux * d - uy * s, y1 + uy * d + ux * s]);
    }
    return S.egri(ls, { renk: o.renk, kalin: o.kalin }) + S.ok(x2 - ux * (bas + 1), y2 - uy * (bas + 1), x2, y2, { renk: o.renk, kalin: o.kalin, boy: o.boy });
  };
  /* Sabit tohumlu sözde rastgele sayı (mulberry32): çizim her açılışta aynı görünür */
  const rastgele = tohum => () => {
    tohum |= 0; tohum = tohum + 0x6D2B79F5 | 0;
    let t = Math.imul(tohum ^ tohum >>> 15, 1 | tohum);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  /* ================================================================ d27 ================================================================ */

  /* d27 · bölüm 0: Rayleigh–Jeans öngörüsü ile Planck eğrisi, 5772 K (Güneş yüzeyi) için hesaplandı; ikisi de Planck tepesine bölündü. */
  C.ekle('d27-morotesi-felaketi', {
    ders: 'd27', bolum: 0, oran: 0.8,
    baslik: 'Morötesi felaketi: klasik kuramın öngörüsü ve gerçek eğri',
    aciklama: 'İki eğri de Güneş yüzeyinin sıcaklığı olan 5772 kelvin için formüllerden hesaplandı. Kalın çizgi gerçek kara cisim tayfıdır, yani Planck\'ın eğrisi: tepesi yaklaşık 502 nanometrede, görünür ışıktadır ve kısa dalga boylarına doğru yeniden düşer. Kesikli çizgi klasik eş bölüşüm ilkesinden çıkan Rayleigh ve Jeans öngörüsüdür: sağda, kızılötesinde gerçek eğriye yaklaşır, ama sola, morötesine gidildikçe durmadan yükselir ve çizimin tepesinden taşar. Kuram doğru olsaydı her sıcak cisim sonsuz morötesi ışık yayardı.',
    kaynak: [KAYNAK.planckYasasi, KAYNAK.rayleighJeans, KAYNAK.planckTarih],
    ciz(S) {
      const R = S.R, T = 5772;
      const planck = l => { const m = l * 1e-9; return 2 * H * CI * CI / Math.pow(m, 5) / (Math.exp(H * CI / (m * KB * T)) - 1); };
      const rj = l => { const m = l * 1e-9; return 2 * CI * KB * T / Math.pow(m, 4); };
      const tepe = 2.897771955e-3 / T * 1e9, P0 = planck(tepe);
      const ek = S.eksen({ x: 62, y: 34, w: 318, h: 220 }, { x0: 0, x1: 3000, y0: 0, y1: 1.6 }, {
        xIsaret: [[0, '0'], [500, '500'], [1000, '1000'], [1500, '1500'], [2000, '2000'], [2500, '2500'], [3000, '3000']],
        yIsaret: [[0, '0'], [0.5, '0,5'], [1, '1'], [1.5, '1,5']],
        xAd: 'dalga boyu (nanometre)', yAd: 'ışınım (Planck tepesi = 1)', yAdUzak: 40
      });
      let s = '';
      /* görünür ışık bandı 380–700 nm */
      s += S.kutu(ek.X(380), 34, ek.X(700) - ek.X(380), 220, { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.5 });
      s += S.yazi((ek.X(380) + ek.X(700)) / 2, ek.Y(1.3), 'görünür', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += ek.svg;
      /* Rayleigh–Jeans: tepeyi aşınca kırp */
      const ls = [];
      for (let l = 3000; l >= 60; l -= 10) { const y = rj(l) / P0; if (y > 1.6) { ls.push([ek.X(l), ek.Y(1.6)]); break; } ls.push([ek.X(l), ek.Y(y)]); }
      s += S.egri(ls, { renk: R.uyari, kalin: 2.2, kesik: '7 5' });
      const ust = ls[ls.length - 1];
      s += S.ok(ust[0], ust[1] + 2, ust[0], 16, { renk: R.uyari, kalin: 2, boy: 8 });
      s += S.zeminliYazi(ust[0] + 12, 22, 'klasik öngörü: sonsuza gider', { boy: 13, renk: R.uyari, kalin: true });
      s += S.fonk(ek, l => planck(l) / P0, 40, 3000, 300, { renk: R.metin, kalin: 3 });
      /* etiketler */
      s += S.zeminliYazi(ek.X(1250), ek.Y(0.96), 'Rayleigh–Jeans (kesikli)', { boy: 13, renk: R.uyari });
      s += S.zeminliYazi(ek.X(1250), ek.Y(0.5), 'Planck: gerçek eğri', { boy: 13, renk: R.metin, kalin: true });
      s += S.cizgi(ek.X(tepe), ek.Y(1) - 4, ek.X(tepe), ek.Y(1) - 22, { renk: R.metin, kalin: 1 });
      s += S.zeminliYazi(ek.X(tepe) + 4, ek.Y(1) - 26, 'tepe ≈ ' + tr(tepe) + ' nm', { boy: 13, renk: R.metin });
      s += S.yazi(66, ek.Y(1.5), '← morötesi', { boy: 13, renk: R.soluk });
      s += S.yazi(ek.X(2600), ek.Y(0.18), 'kızılötesi →', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(392, 316, 'T = 5772 K, ikisi de hesap', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d27 · bölüm 3: Millikan tipi deney; cıva çizgileri ve iş fonksiyonu 2,3 eV olan varsayımsal metal (dersin örneği). */
  C.ekle('d27-fotoelektrik', {
    ders: 'd27', bolum: 3, oran: 0.92,
    baslik: 'Fotoelektrik olay: durdurma gerilimi frekansla düz bir çizgi çizer',
    aciklama: 'Dersin örneğindeki iş fonksiyonu 2,3 elektronvolt olan metal ve cıva lambasının üç çizgisi. Yatay eksen ışığın frekansı, dikey eksen en hızlı elektronu durdurmak için gereken gerilimdir. 546,1 nanometrelik yeşil ışığın foton enerjisi 2,27 elektronvolttur, bedeli karşılamaz: lamba ne kadar parlak olursa olsun elektron çıkmaz, bu yüzden içi boş daire sıfırda durur. Eşik yaklaşık 539 nanometrededir. 365 nanometrede 1,10 volt, 253,5 nanometrede 2,59 volt gerekir. Noktalar düz bir çizgi üstündedir ve çizginin eğimi Planck sabitinin elektron yüküne bölümüdür; Millikan h\'yi böyle ölçtü. Işığın parlaklığı bu çizgiyi değiştirmez.',
    kaynak: [KAYNAK.quarknet, KAYNAK.millikanAps, KAYNAK.planckSabiti],
    ciz(S) {
      const R = S.R, is = 2.3, hEv = H / EV;               // h, eV·s
      const f0 = is / hEv / 1e14;                          // eşik frekansı (10¹⁴ Hz)
      const ek = S.eksen({ x: 56, y: 30, w: 322, h: 216 }, { x0: 4, x1: 13, y0: 0, y1: 3.2 }, {
        xIsaret: [[4, '4'], [6, '6'], [8, '8'], [10, '10'], [12, '12']],
        yIsaret: [[0, '0'], [1, '1'], [2, '2'], [3, '3']],
        xAd: 'frekans (× 10¹⁴ Hz)', yAd: 'durdurma gerilimi (volt)', yAdUzak: 38
      });
      let s = ek.svg;
      /* eşiğin altı: elektron yok */
      s += S.cizgi(ek.X(4), ek.Y(0), ek.X(f0), ek.Y(0), { renk: R.uyari, kalin: 4 });
      s += S.cizgi(ek.X(f0), ek.Y(0), ek.X(13), ek.Y(hEv * 13e14 - is), { renk: R.vurgu, kalin: 2.4 });
      s += S.cizgi(ek.X(f0), ek.Y(0) + 6, ek.X(f0), ek.Y(0) - 8, { renk: R.metin, kalin: 1.2 });
      /* cıva çizgileri */
      const nok = [[546.1, null], [365.0, '365,0 nm: 1,10 V'], [253.5, '253,5 nm: 2,59 V']];
      nok.forEach(([l, t], i) => {
        const f = CI / (l * 1e-9) / 1e14, V = Math.max(0, hEv * f * 1e14 - is), x = ek.X(f), y = ek.Y(V);
        if (i === 0) s += S.daire(x, y, 6, { dolgu: R.zemin, renk: R.metin, kalin: 2 });
        else {
          s += S.daire(x, y, 6, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
          s += S.zeminliYazi(x - 10, y - 10, t, { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
        }
      });
      s += S.yazi(64, ek.Y(0.95), 'yeşil 546,1 nm:', { boy: 13, renk: R.uyari, kalin: true });
      s += S.yazi(64, ek.Y(0.75), 'elektron yok', { boy: 13, renk: R.uyari, kalin: true });
      s += S.cizgi(96, ek.Y(0.75) + 5, ek.X(CI / 546.1e-9 / 1e14) - 3, ek.Y(0) - 7, { renk: R.uyari, kalin: 1 });
      s += S.yazi(8, 316, 'eğim = h ÷ e: Planck sabitini verir', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(8, 334, 'ışığın parlaklığı çizgiyi değiştirmez', { boy: 13, renk: R.metin });
      s += S.yazi(8, 352, 'metal: iş fonksiyonu 2,3 eV (varsayımsal)', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d27 · bölüm 9: tek elektronların birikmesi. Kare elektron sayıları Tonomura (1989); noktalar cos² × zarf dağılımından benzetim. */
  C.ekle('d27-tek-tek-elektron', {
    ders: 'd27', bolum: 9, oran: 0.9,
    baslik: 'Elektronlar tek tek gelir, desen birikerek çıkar',
    aciklama: 'Dört kare, Tonomura\'nın 1989 kaydındaki elektron sayılarıyla aynıdır: 8, 270, 2000 ve 60.000 elektron. Her elektron ekrana tek bir nokta olarak, görünüşte rastgele bir yere düşer. 8 ve 270 noktada düzen yoktur; 2000 noktada şeritler sezilir; 60.000 elektronda girişim deseni açıkça ortaya çıkar. Son karede noktalar tek tek çizilemeyecek kadar çok olduğu için her şeridin koyuluğu oraya düşen elektron sayısını gösterir. Noktaların yerleri, iki yolun genliklerinin toplandığı dalga desenine göre bilgisayarla rastgele seçildi; gerçek fotoğraf değildir.',
    kaynak: [KAYNAK.tonomura, KAYNAK.physicsWorld],
    ciz(S) {
      const R = S.R, rnd = rastgele(1989);
      /* dağılım: şerit aralığı 1/6 kare genişliği, geniş zarf */
      const yog = u => { const z = Math.exp(-Math.pow((u - 0.5) / 0.3, 2)); return z * Math.pow(Math.cos(Math.PI * (u - 0.5) * 7), 2); };
      const ornek = () => { for (;;) { const u = rnd(), v = rnd(); if (v < yog(u)) return u; } };
      const kare = [[8, 12, 30], [270, 206, 30], [2000, 12, 196], [60000, 206, 196]], w = 182, h = 132;
      let s = '';
      kare.forEach(([n, x0, y0]) => {
        s += S.kutu(x0, y0, w, h, { dolgu: R.zemin, renk: R.cizgi, kalin: 1 }, 3);
        s += S.yazi(x0 + w / 2, y0 - 9, tr(n) + ' elektron', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
        if (n <= 2000) {
          const r = n < 100 ? 2.6 : n < 1000 ? 1.5 : 0.95;
          let d = '';
          for (let i = 0; i < n; i++) { const x = x0 + 4 + ornek() * (w - 8), y = y0 + 4 + rnd() * (h - 8); d += S.daire(x, y, r, { dolgu: R.yildiz, renk: 'none' }); }
          s += d;
        } else {
          const B = 90, say = new Array(B).fill(0);
          for (let i = 0; i < n; i++) say[Math.min(B - 1, Math.floor(ornek() * B))]++;
          const en = Math.max(...say), bw = (w - 8) / B;
          say.forEach((c, i) => { if (c > en * 0.02) s += S.kutu(x0 + 4 + i * bw, y0 + 4, bw + 0.3, h - 8, { dolgu: R.yildiz, renk: 'none', saydam: n2(c / en) }); });
        }
      });
      function n2(v) { return Math.round(Math.min(1, v) * 100) / 100; }
      s += S.yazi(200, 352, 'son kare: şerit koyuluğu = düşen elektron sayısı', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d28 ================================================================ */

  /* d28 · bölüm 4: helyum, lityum, neon; 1s, 2s, 2p kutuları. Şematik: kutuların yüksekliği enerji ölçeği değildir. */
  C.ekle('d28-pauli-kutulari', {
    ders: 'd28', bolum: 4, oran: 0.8,
    baslik: 'Pauli dışlama ilkesi: her kutuya en çok iki elektron, zıt spinle',
    aciklama: 'Her kutu bir orbitaldir, oklar elektronlardır: yukarı ok ile aşağı ok zıt spini gösterir. Bir kutuya en çok iki elektron girer ve ikisinin spini zıt olmak zorundadır. Helyumun iki elektronu 1s kutusunu doldurur. Lityumun üçüncü elektronu dolu 1s\'ye giremez, bir üst basamaktaki 2s\'ye çıkar ve orada dolu kabuğun dışında yalnız kalır; bu yüzden kolayca verilir. İkinci düzeyde bir s ve üç p, yani dört kutu, sekiz yer vardır; 2 artı 8, toplam 10 elektronla neonda bu kabuk da dolar. Helyum ve neon kapalı kabuklu soy gazlardır. Çizim şematiktir, basamakların arası enerji ölçeği değildir.',
    kaynak: [KAYNAK.pauli],
    ciz(S) {
      const R = S.R, kb = 28;                                  // kutu boyu
      const ok = (x, y, yukari, r) => yukari ? S.ok(x, y + kb - 5, x, y + 4, { renk: r, kalin: 2, boy: 6 }) : S.ok(x, y + 4, x, y + kb - 5, { renk: r, kalin: 2, boy: 6 });
      const kutu = (x, y, n, vurgu) => {
        let o = S.kutu(x, y, kb, kb, { dolgu: R.yuzey, renk: R.metin, kalin: 1.4 });
        if (n >= 1) o += ok(x + 9, y, true, vurgu ? R.vurgu : R.metin);
        if (n >= 2) o += ok(x + 19, y, false, R.metin);
        return o;
      };
      const atom = [['Helyum', 2, 10], ['Lityum', 3, 140], ['Neon', 10, 270]], y1s = 214, y2 = 116;
      let s = '';
      /* basamak adları solda yok: her sütunda kutu etiketi */
      atom.forEach(([ad, z, x0]) => {
        const cx = x0 + 60;
        s += S.yazi(cx, 22, ad, { boy: 15, hiza: 'middle', renk: R.metin, kalin: true });
        s += S.yazi(cx, 40, z + ' elektron', { boy: 13, hiza: 'middle', renk: R.soluk });
        /* 1s */
        s += kutu(cx - kb / 2, y1s, Math.min(2, z));
        s += S.yazi(cx - kb / 2 - 6, y1s + 19, '1s', { boy: 13, hiza: 'end', renk: R.soluk });
        /* 2s ve 2p */
        const k2 = Math.max(0, z - 2), k2s = Math.min(2, k2), k2p = Math.max(0, k2 - 2);
        const xs = x0 + 4, xp = x0 + 4 + kb + 8;
        s += kutu(xs, y2, k2s, ad === 'Lityum');
        for (let i = 0; i < 3; i++) { const dolu = Math.max(0, Math.min(2, k2p - i * 2)); s += kutu(xp + i * kb, y2, dolu); }
        s += S.yazi(xs + kb / 2, y2 + kb + 16, '2s', { boy: 13, hiza: 'middle', renk: R.soluk });
        s += S.yazi(xp + kb * 1.5, y2 + kb + 16, '2p', { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      /* düzey adları */
      s += S.yazi(8, y2 - 12, '2. düzey: 4 kutu × 2 = 8 yer', { boy: 13, renk: R.soluk });
      s += S.yazi(8, y1s - 12, '1. düzey: 1 kutu × 2 = 2 yer', { boy: 13, renk: R.soluk });
      /* sonuçlar */
      s += S.yazi(72, 284, 'kabuk dolu:', { boy: 13, hiza: 'middle', renk: R.iyi, kalin: true });
      s += S.yazi(72, 300, 'soy gaz', { boy: 13, hiza: 'middle', renk: R.iyi });
      s += S.yazi(200, 284, 'yalnız elektron:', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(200, 300, 'kolayca verilir', { boy: 13, hiza: 'middle', renk: R.vurgu });
      s += S.yazi(328, 284, '2 + 8 = 10:', { boy: 13, hiza: 'middle', renk: R.iyi, kalin: true });
      s += S.yazi(328, 300, 'soy gaz', { boy: 13, hiza: 'middle', renk: R.iyi });
      s += S.yazi(200, 74, 'yukarı ve aşağı ok: zıt spinli iki elektron', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d28 · bölüm 6: dikdörtgen engel, parçacık enerjisi engelin yarısı. Geçme olasılığı T = 1 ÷ cosh²(κa) (E = V₀/2 için
     Wikipedia formülünün özel hâli); κa = 1,5 ve 3. Dalga şekli şematik, kuyruk genliği √T. */
  C.ekle('d28-tunelleme', {
    ders: 'd28', bolum: 6, oran: 0.98,
    baslik: 'Tünelleme: dalga engelin içinde söner, ince engelden sızar',
    aciklama: 'Soldan gelen dalga, parçacığın enerjisinin iki katı yüksekliğinde bir engele çarpar. Klasik fizikte parçacık geri döner. Kuantumda dalga engelin içinde sıfıra inmez, hızla sönerek ilerler ve öbür yandan küçük bir kuyruk çıkar. Üstteki ince engelde geçme olasılığı yaklaşık yüzde 18\'dir. Alttaki engel iki kat kalındır ve olasılık yaklaşık yüzde 1\'e, yani 18 kat aşağı düşer. Olasılıklar dikdörtgen engel formülüyle hesaplandı; dalgaların biçimi şematiktir. Kuyruğun yüksekliği olasılığın kareköküdür, çünkü olasılık dalganın karesidir.',
    kaynak: [KAYNAK.engel, KAYNAK.gamow],
    ciz(S) {
      const R = S.R;
      const sira = (y0, ka, ad) => {
        const T = 1 / Math.pow(Math.cosh(ka), 2), A = 22, a0 = 150, a1 = a0 + ka * 34, yE = y0;          // yE: parçacık enerjisi çizgisi
        let o = '';
        /* engel */
        o += S.kutu(a0, y0 - 54, a1 - a0, 54 + 30, { dolgu: R.yuzey2, renk: R.metin, kalin: 1.4 });
        o += S.yazi((a0 + a1) / 2, y0 - 60, ad, { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
        o += S.cizgi(14, yE, 392, yE, { renk: R.soluk, kalin: 1, kesik: '3 4' });
        /* gelen dalga */
        const ls = [];
        for (let x = 14; x <= a0; x += 2) ls.push([x, yE - A * Math.cos((x - a0) / 13)]);
        /* engel içi: üstel sönüm, genlik A → A√T */
        const kk = Math.log(1 / Math.sqrt(T)) / (a1 - a0);
        for (let x = a0; x <= a1; x += 2) ls.push([x, yE - A * Math.exp(-kk * (x - a0))]);
        o += S.egri(ls, { renk: R.vurgu, kalin: 2.4 });
        /* geçen dalga */
        const ls2 = [], At = A * Math.sqrt(T);
        for (let x = a1; x <= 392; x += 2) ls2.push([x, yE - At * Math.cos((x - a1) / 13)]);
        o += S.egri(ls2, { renk: R.vurgu, kalin: 2.4 });
        o += S.yazi(16, y0 - 36, 'gelen dalga', { boy: 13, renk: R.soluk });
        o += S.yazi(392, yE + 50, 'geçme olasılığı ≈ %' + tr(T * 100), { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
        return { o, T };
      };
      let s = '';
      const a = sira(140, 1.5, 'ince engel'), b = sira(294, 3, 'iki kat kalın engel');
      s += a.o + b.o;
      s += S.yazi(16, 22, 'kesikli çizgi: parçacığın enerjisi', { boy: 13, renk: R.soluk });
      s += S.yazi(16, 40, 'engel yüksekliği: enerjinin 2 katı', { boy: 13, renk: R.soluk });
      s += S.yazi(200, 384, 'kalınlık 2 kat → olasılık ≈ ' + tr(a.T / b.T) + ' kat az', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      return s;
    }
  });

  /* d28 · bölüm 7: Gamow tepesi, p + p, T = 15 milyon K (derleme Tablo 1). E_G = 0,978 × μ × Z₁²Z₂² MeV, μ = 0,5. Eğriler ayrı ölçekli. */
  C.ekle('d28-gamow-tepesi', {
    ders: 'd28', bolum: 7, oran: 0.86,
    baslik: 'Gamow tepesi: Güneş\'te kaynaşma nerede olur?',
    aciklama: 'Güneş\'in merkezine yakın, 15 milyon kelvinlik koşullar için hesaplandı. Kesikli çizgi enerjisi belli bir değerin üstünde olan protonların payıdır: yavaş protonlar boldur, hızlılar hızla azalır; tipik ısıl enerji yaklaşık 1,3 kiloelektronvolttur. Noktalı çizgi tünelleme olasılığıdır: hızlı protonlar engelden daha kolay sızar. İkisinin çarpımı kalın çizgidir ve yaklaşık 5,9 kiloelektronvoltta tepe yapar: Gamow tepesi. Kaynaşmaların çoğu bu dar enerji aralığında olur. Engelin kendisi 550 kiloelektronvolttur, yani bu çizimin sağ kenarının yaklaşık 27 katı ötede. Üç eğri ayrı ölçeklendi; gerçek çarpım çok küçük bir sayıdır.',
    kaynak: [KAYNAK.yildizReaktor, KAYNAK.ppZinciri],
    ciz(S) {
      const R = S.R, kT = KB * 1.5e7 / EV / 1000, EG = 0.978 * 0.5 * 1000;   // keV
      const mb = E => Math.exp(-E / kT), tn = E => Math.exp(-Math.sqrt(EG / E)), ca = E => mb(E) * tn(E);
      const E0 = Math.pow(EG * kT * kT / 4, 1 / 3);
      const ek = S.eksen({ x: 40, y: 50, w: 340, h: 210 }, { x0: 0, x1: 20, y0: 0, y1: 1.35 }, {
        xIsaret: [[0, '0'], [5, '5'], [10, '10'], [15, '15'], [20, '20']],
        xAd: 'proton çarpışma enerjisi (keV)', yAd: 'göreli değer', yAdUzak: 18
      });
      let s = ek.svg;
      const tnMax = tn(20), caMax = ca(E0);
      s += S.fonk(ek, mb, 0.02, 20, 200, { renk: R.mavi, kalin: 2, kesik: '7 5' });
      s += S.fonk(ek, E => tn(E) / tnMax, 0.3, 20, 200, { renk: R.uyari, kalin: 2, kesik: '2 4' });
      s += S.fonk(ek, E => ca(E) / caMax, 0.3, 20, 300, { renk: R.vurgu, kalin: 3.2 });
      s += S.cizgi(ek.X(E0), ek.Y(1), ek.X(E0), ek.Y(0), { renk: R.vurgu, kalin: 1, kesik: '3 3' });
      s += S.zeminliYazi(ek.X(E0) + 6, ek.Y(1.04), 'Gamow tepesi ≈ ' + tr(E0, 1) + ' keV', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.cizgi(ek.X(kT), ek.Y(0), ek.X(kT), ek.Y(mb(kT)), { renk: R.mavi, kalin: 2 });
      s += S.cizgi(ek.X(0.45) + 2, ek.Y(1.17), ek.X(0.45), ek.Y(mb(0.45)) - 3, { renk: R.mavi, kalin: 1 });
      s += S.zeminliYazi(ek.X(0.45) + 6, ek.Y(1.2), 'ısıl dağılım: yavaşlar bol', { boy: 13, renk: R.mavi });
      s += S.yazi(8, 40, 'ısıl enerji ≈ ' + tr(kT, 1) + ' keV: soldaki kısa dik çizgi', { boy: 13, renk: R.mavi });
      s += S.yazi(ek.X(19.6), ek.Y(0.45), 'tünelleme', { boy: 13, hiza: 'end', renk: R.uyari });
      s += S.yazi(ek.X(19.6), ek.Y(0.32), 'olasılığı', { boy: 13, hiza: 'end', renk: R.uyari });
      s += S.yazi(ek.X(9.6), ek.Y(0.55), 'çarpım', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(392, 22, 'engel 550 keV: çok sağda →', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(8, 22, 'T = 15 milyon K', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d30 ================================================================ */

  /* d30 · bölüm 5: Carnot sınırı, soğuk taraf 298 K (dersin örneği); sıcak taraf 298–1300 K. */
  C.ekle('d30-carnot', {
    ders: 'd30', bolum: 5, oran: 0.84,
    baslik: 'Carnot\'nun sınırı: verim yalnızca iki sıcaklığa bağlıdır',
    aciklama: 'Soğuk taraf dersin örneğindeki gibi 298 kelvinde, yani 25 santigrat derecede tutuldu; yatay eksen sıcak tarafın sıcaklığıdır. Eğri en yüksek verimi gösterir: 1 eksi soğuk sıcaklığın sıcak sıcaklığa bölümü. İki taraf aynı sıcaklıktayken, yani akacak yokuş yokken verim sıfırdır. Sıcak taraf 823 kelvin, yani 550 santigrat derece olunca sınır yaklaşık yüzde 64\'tür; ısının en az yüzde 36\'sı soğuk tarafa atılmak zorundadır. Eğrinin altı işe çevrilebilecek en büyük pay, üstü ise ikinci yasa gereği atılması gereken paydır. Gerçek makineler eğrinin de altında kalır.',
    kaynak: [KAYNAK.carnot, KAYNAK.termoYasa],
    ciz(S) {
      const R = S.R, Tc = 298, eta = T => 1 - Tc / T;
      const ek = S.eksen({ x: 56, y: 24, w: 324, h: 226 }, { x0: 298, x1: 1300, y0: 0, y1: 1 }, {
        xIsaret: [[298, '298'], [500, '500'], [700, '700'], [900, '900'], [1100, '1100'], [1300, '1300']],
        yIsaret: [[0, '%0'], [0.25, '%25'], [0.5, '%50'], [0.75, '%75'], [1, '%100']],
        xAd: 'sıcak tarafın sıcaklığı (K)', yAd: 'en yüksek verim', yAdUzak: 46
      });
      let s = '';
      /* alt ve üst alanlar */
      let alt = `M${ek.X(298)},${ek.Y(0)}`, ust = `M${ek.X(298)},${ek.Y(1)} L${ek.X(298)},${ek.Y(0)}`;
      for (let T = 298; T <= 1300; T += 10) { alt += ` L${ek.X(T).toFixed(1)},${ek.Y(eta(T)).toFixed(1)}`; ust += ` L${ek.X(T).toFixed(1)},${ek.Y(eta(T)).toFixed(1)}`; }
      alt += ` L${ek.X(1300)},${ek.Y(0)} Z`; ust += ` L${ek.X(1300)},${ek.Y(1)} Z`;
      s += S.yol(alt, { renk: 'none', dolgu: R.vurguSoluk, saydam: 0.7 });
      s += ek.svg;
      s += S.fonk(ek, eta, 298, 1300, 200, { renk: R.vurgu, kalin: 3 });
      s += S.zeminliYazi(ek.X(900), ek.Y(0.88), 'soğuk tarafa atılmak zorunda', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.zeminliYazi(ek.X(1000), ek.Y(0.3), 'işe çevrilebilen en çok pay', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      /* örnek: 823 K */
      const x = ek.X(823), y = ek.Y(eta(823));
      s += S.cizgi(x, y, x, ek.Y(0), { renk: R.metin, kalin: 1, kesik: '3 3' }) + S.cizgi(ek.X(298), y, x, y, { renk: R.metin, kalin: 1, kesik: '3 3' });
      s += S.daire(x, y, 6, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
      s += S.zeminliYazi(x + 10, y + 20, '823 K (550 °C): %' + tr(eta(823) * 100, 1), { boy: 13, renk: R.metin, kalin: true });
      s += S.zeminliYazi(ek.X(298) + 8, ek.Y(0) - 10, 'yokuş yok: verim 0', { boy: 13, renk: R.uyari });
      s += S.yazi(392, 328, 'soğuk taraf 298 K (25 °C)', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d30 · bölüm 7: dört para (16 sıralama) ve yüz para (binom dağılımı). Sayılar hesap; dersin örneğiyle aynı. */
  C.ekle('d30-paralar', {
    ders: 'd30', bolum: 7, oran: 1.04,
    baslik: 'Mikrodurumları saymak: paralar en kalabalık makroduruma düşer',
    aciklama: 'Üstte dört para atışının bütün 16 sıralaması, yazı sayısına göre sütunlara dizildi; Y yazı, T tura demektir. Dördü de yazı makrodurumu yalnızca 1 sıralamayla, iki yazı iki tura ise 6 sıralamayla olur; sütun uzunluğu mikrodurum sayısıdır. Altta 100 para için aynı sayım: her çubuk o kadar yazı gelme olasılığıdır. Tam 50 yazı yaklaşık yüzde 8, 40 ile 60 arası yazı yaklaşık yüzde 96 olasılıklıdır; hepsi yazı ise yaklaşık 10 üzeri 30 sıralamanın yalnızca biridir ve çizimde görünmeyecek kadar küçüktür. Bir gazda para yerine 10 üzeri 23 mertebesinde molekül vardır; tepe daha da sivrilir.',
    kaynak: [KAYNAK.entropiTarih, KAYNAK.boltzmannMezar],
    ciz(S) {
      const R = S.R;
      let s = '';
      /* üst: dört para */
      const sutun = [[4, ['YYYY']], [3, ['YYYT', 'YYTY', 'YTYY', 'TYYY']], [2, ['YYTT', 'YTYT', 'YTTY', 'TYYT', 'TYTY', 'TTYY']], [1, ['YTTT', 'TYTT', 'TTYT', 'TTTY']], [0, ['TTTT']]];
      s += S.yazi(8, 20, '4 para: 16 sıralama', { boy: 14, renk: R.metin, kalin: true });
      const tabanY = 150;
      sutun.forEach(([k, ls], i) => {
        const cx = 64 + i * 68;
        ls.forEach((t, j) => {
          const y = tabanY - (j + 1) * 18;
          s += S.kutu(cx - 25, y, 50, 16, { dolgu: k === 2 ? R.vurguSoluk : R.yuzey, renk: R.cizgi, kalin: 0.8 }, 2);
          s += S.yazi(cx, y + 13, t, { boy: 13, hiza: 'middle', renk: R.metin });
        });
        s += S.yazi(cx, tabanY + 16, k + ' yazı', { boy: 13, hiza: 'middle', renk: R.soluk });
        s += S.yazi(cx, tabanY - ls.length * 18 - 6, String(ls.length), { boy: 14, hiza: 'middle', renk: k === 2 ? R.vurgu : R.metin, kalin: true });
      });
      /* alt: yüz para */
      const P = [], ln = [0];
      for (let i = 1; i <= 100; i++) ln[i] = ln[i - 1] + Math.log(i);
      for (let k = 0; k <= 100; k++) P[k] = Math.exp(ln[100] - ln[k] - ln[100 - k] - 100 * Math.log(2));
      let ara = 0; for (let k = 40; k <= 60; k++) ara += P[k];
      s += S.yazi(8, 204, '100 para: kaç yazı gelme olasılığı', { boy: 14, renk: R.metin, kalin: true });
      const ek = S.eksen({ x: 44, y: 228, w: 344, h: 116 }, { x0: 0, x1: 100, y0: 0, y1: 0.09 }, {
        xIsaret: [[0, '0'], [25, '25'], [50, '50'], [75, '75'], [100, '100']],
        yIsaret: [[0, '%0'], [0.04, '%4'], [0.08, '%8']], xAd: 'yazı sayısı'
      });
      const bw = ek.X(1) - ek.X(0);
      s += S.kutu(ek.X(39.5), 232, ek.X(60.5) - ek.X(39.5), 112, { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.6 });
      s += ek.svg;
      for (let k = 0; k <= 100; k++) if (P[k] > 1e-4) s += S.kutu(ek.X(k) - bw * 0.4, ek.Y(P[k]), bw * 0.8, ek.Y(0) - ek.Y(P[k]), { dolgu: k >= 40 && k <= 60 ? R.vurgu : R.soluk, renk: 'none' });
      s += S.cizgi(ek.X(38) + 2, ek.Y(0.078), ek.X(50) - 3, ek.Y(P[50]), { renk: R.metin, kalin: 1 });
      s += S.yazi(ek.X(38), ek.Y(0.075), 'tam 50: %' + tr(P[50] * 100, 1), { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(ek.X(63), ek.Y(0.05), '40–60 arası: %' + tr(ara * 100), { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(392, 222, 'hepsi yazı: 1 / 1,27 × 10³⁰', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d30 · bölüm 12: Güneş'ten gelen bir foton, Dünya'dan çıkan ≈20 kızılötesi foton. Şematik; sayılar ders ve Wien yasası. */
  C.ekle('d30-foton-akisi', {
    ders: 'd30', bolum: 12, oran: 0.92,
    baslik: 'Dünya enerjiyi geri verir, ama çok daha fazla fotona bölerek',
    aciklama: 'Solda Güneş\'ten gelen bir foton: 5772 kelvinlik bir yüzeyden çıktığı için enerjiktir, tayfının tepesi yaklaşık 500 nanometrede, görünür ışıktadır. Sağda Dünya\'nın uzaya saldığı fotonlar: yaklaşık 254 kelvinlik bir cismin kızılötesi ışığıdır, tepesi yaklaşık 11 mikrometrededir. Foton başına enerji sıcaklıkla orantılı olduğu için oran 5772 bölü 254, yaklaşık 23\'tür; ders bunu kabaca 20 diye yuvarlar. Enerji dengede olduğuna göre her gelen fotona karşılık yaklaşık 20 foton çıkar. Aynı enerji çok daha fazla parçaya bölünür, dağılma biçimlerinin sayısı ve entropi büyür. Çizim şematiktir; dalga boyları ölçekli değildir.',
    kaynak: [KAYNAK.chaisson, KAYNAK.entropiYasam, KAYNAK.nasaDunya],
    ciz(S) {
      const R = S.R, ex = 196, ey = 168, er = 44;
      let s = '';
      /* Güneş kenarı */
      s += S.yay(-150, ey, 190, -40, 40, { renk: R.gunes, kalin: 3 });
      s += S.yazi(34, 50, 'Güneş', { boy: 15, renk: R.metin, kalin: true });
      s += S.yazi(34, 68, 'yüzey 5772 K', { boy: 13, renk: R.soluk });
      /* gelen tek foton */
      s += dalga(S, 46, ey, ex - er - 4, ey, 7, 9, { renk: R.gunes, kalin: 2.6, boy: 10 });
      s += S.zeminliYazi(52, ey + 36, '1 foton', { boy: 14, renk: R.metin, kalin: true });
      s += S.zeminliYazi(52, ey + 54, 'tepe ≈ 500 nm', { boy: 13, renk: R.soluk });
      /* Dünya */
      s += S.daire(ex, ey, er, { dolgu: R.mavi, renk: R.zemin, kalin: 2 });
      s += S.zeminliYazi(ex, ey - 2, 'Dünya', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.zeminliYazi(ex, ey + 20, '≈254 K', { boy: 13, hiza: 'middle', renk: R.metin });
      /* çıkan 20 foton: sağ yarıda yelpaze */
      for (let i = 0; i < 20; i++) {
        const a = (-70 + i * 140 / 19) * Math.PI / 180, r1 = er + 6, r2 = er + 56 + (i % 2) * 18;
        s += dalga(S, ex + r1 * Math.cos(a), ey + r1 * Math.sin(a), ex + r2 * Math.cos(a), ey + r2 * Math.sin(a), 1.5, 2.6, { renk: R.uyari, kalin: 1.4, boy: 5 });
      }
      s += S.yazi(392, 50, '≈20 kızılötesi foton', { boy: 14, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(392, 68, 'tepe ≈ 11 μm', { boy: 13, hiza: 'end', renk: R.soluk });
      /* alt satırlar */
      s += S.yazi(8, 314, 'giren enerji = çıkan enerji (≈240 W/m²)', { boy: 13, renk: R.metin });
      s += S.yazi(8, 332, 'foton enerjisi oranı: 5772 ÷ 254 ≈ ' + tr(5772 / 254), { boy: 13, renk: R.metin });
      s += S.yazi(392, 350, 'şematik', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(8, 350, 'az ve enerjik girer, çok ve zayıf çıkar', { boy: 13, renk: R.vurgu, kalin: true });
      return s;
    }
  });

  /* ================================================================ d33 ================================================================ */

  /* d33 · bölüm 6: Faraday'ın mıknatıs ve sargı deneyi, üç durum. Şematik. */
  C.ekle('d33-faraday', {
    ders: 'd33', bolum: 6, oran: 0.94,
    baslik: 'Faraday\'ın keşfi: akımı alan değil, alanın değişimi doğurur',
    aciklama: 'Üç satırda aynı tel sargısı ve sağında akımı gösteren bir ölçü aleti var. Üstte mıknatıs sargının içine itiliyor: sargıdaki alan değişir, ibre bir yana sapar. Ortada mıknatıs sargının içinde duruyor: alan güçlü ama değişmiyor, ibre sıfırda kalır. Altta mıknatıs dışarı çekiliyor: akım ters yönde akar, ibre öbür yana sapar. Mıknatıs ne kadar hızlı hareket ederse ibre o kadar çok sapar. Mıknatısın uçlarındaki K ve G kuzey ve güney kutuplarıdır. Çizim şematiktir.',
    kaynak: [KAYNAK.faraday, KAYNAK.eia],
    ciz(S) {
      const R = S.R;
      const satir = (y, mx, yon, sapma, metin, alt) => {
        let o = '';
        /* sargı: 7 halka */
        const sx = 150, sw = 112;
        for (let i = 0; i < 7; i++) o += S.elips(sx + 8 + i * 16, y, 7, 26, { renk: R.vurgu, kalin: 2 });
        /* teller ölçü aletine */
        const gx = 344, gy = y + 4;
        o += S.yol(`M${sx + 8},${y + 26} L${sx + 8},${y + 40} L${gx - 18},${y + 40} L${gx - 18},${gy + 6}`, { renk: R.vurgu, kalin: 1.6 });
        o += S.yol(`M${sx + sw - 8},${y - 26} L${sx + sw - 8},${y - 34} L${gx + 18},${y - 34} L${gx + 18},${gy + 6}`, { renk: R.vurgu, kalin: 1.6 });
        /* ölçü aleti */
        o += S.yay(gx, gy + 6, 26, 0, 180, { renk: R.metin, kalin: 1.6 }) + S.cizgi(gx - 26, gy + 6, gx + 26, gy + 6, { renk: R.metin, kalin: 1.6 });
        o += S.cizgi(gx, gy - 20, gx, gy - 14, { renk: R.soluk, kalin: 1 });
        const a = (90 - sapma) * Math.PI / 180;
        o += S.cizgi(gx, gy + 6, gx + 22 * Math.cos(a), gy + 6 - 22 * Math.sin(a), { renk: R.uyari, kalin: 2.6, uc: 'round' });
        o += S.daire(gx, gy + 6, 3, { dolgu: R.metin, renk: 'none' });
        /* mıknatıs */
        o += S.kutu(mx, y - 11, 34, 22, { dolgu: R.yuzey2, renk: R.metin, kalin: 1.4 }) + S.kutu(mx + 34, y - 11, 34, 22, { dolgu: R.vurguSoluk, renk: R.metin, kalin: 1.4 });
        o += S.yazi(mx + 17, y + 5, 'G', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true }) + S.yazi(mx + 51, y + 5, 'K', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
        if (yon) o += S.ok(yon > 0 ? mx - 34 : mx - 6, y, yon > 0 ? mx - 6 : mx - 34, y, { renk: R.metin, kalin: 2.4, boy: 8 });
        o += S.yazi(8, y - 34, metin, { boy: 14, renk: R.metin, kalin: true });
        o += S.zeminliYazi(392, y + 58, alt, { boy: 13, hiza: 'end', renk: sapma ? R.uyari : R.soluk, kalin: !!sapma });
        return o;
      };
      let s = '';
      s += satir(62, 74, 1, 40, 'mıknatıs içeri itiliyor', 'akım: ibre sağa');
      s += satir(184, 168, 0, 0, 'mıknatıs içeride duruyor', 'akım yok');
      s += satir(306, 40, -1, -40, 'mıknatıs dışarı çekiliyor', 'ters akım: ibre sola');
      return s;
    }
  });

  /* d33 · bölüm 9: λ = c ÷ f, log–log; c = 1 ÷ √(μ₀ε₀) (NIST değerleri). Noktalar d33'teki frekanslar ve görünür ışık. */
  C.ekle('d33-c-dogrusu', {
    ders: 'd33', bolum: 9, oran: 0.92,
    baslik: 'Prizden ışığa: hepsi aynı hızla giden tek bir dalga ailesi',
    aciklama: 'Yatay eksen frekans, dikey eksen dalga boyudur; ikisi de logaritmiktir, her çentik bin kat demektir. Bütün elektromanyetik dalgalar için frekans ile dalga boyunun çarpımı aynı hızı verir: Maxwell\'in masa üstü sabitlerinden hesapladığı, saniyede yaklaşık 299.792 kilometre. Bu yüzden hepsi tek bir düz çizgi üstündedir. Dersteki örnekler: 50 hertzlik şebeke yaklaşık 6000 kilometre, Jansky\'nin 20,5 megahertzlik alıcısı 14,6 metre, 2,45 gigahertzlik mikrodalga fırın yaklaşık 12 santimetre, 550 nanometrelik yeşil ışık ise yaklaşık 545 terahertz. Hepsi aynı denklemlerin çözümleridir; aradaki tek fark sallanmanın hızıdır.',
    kaynak: [KAYNAK.maxwellTarih, KAYNAK.codata, KAYNAK.jansky, KAYNAK.mikrodalga, KAYNAK.nasaEM],
    ciz(S) {
      const R = S.R, mu0 = 1.25663706127e-6, e0 = 8.8541878188e-12, c = 1 / Math.sqrt(mu0 * e0);
      const ek = S.eksen({ x: 74, y: 24, w: 306, h: 270 }, { x0: 1, x1: 1e16, y0: 1e-8, y1: 1e8 }, {
        logX: true, logY: true,
        xIsaret: [[1, '1'], [1e3, '10³'], [1e6, '10⁶'], [1e9, '10⁹'], [1e12, '10¹²'], [1e15, '10¹⁵']],
        yIsaret: [[1e-6, '1 μm'], [1e-3, '1 mm'], [1, '1 m'], [1e3, '1 km'], [1e6, '1000 km']],
        xAd: 'frekans (hertz)', yAd: 'dalga boyu', yAdUzak: 60
      });
      let s = ek.svg;
      s += S.fonk(ek, f => c / f, 1, 1e16, 60, { renk: R.vurgu, kalin: 2.6 }, true);
      const nok = [[50, '50 Hz şebeke: ≈6000 km', '', 'start'], [20.5e6, 'Jansky 20,5 MHz', '14,6 m', 'start'], [2.45e9, 'mikrodalga fırın', '2,45 GHz: ≈12 cm', 'start'], [c / 550e-9, 'yeşil ışık 550 nm', '', 'end']];
      nok.forEach(([f, t, t2, h]) => {
        const x = ek.X(f), y = ek.Y(c / f), tx = h === 'end' ? x - 16 : x + 14, ty = h === 'end' ? y + 6 : t2 ? y - 13 : y + 5;
        s += S.daire(x, y, 5.5, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
        s += S.yazi(tx, ty, t, { boy: 13, hiza: h, renk: R.metin, kalin: true });
        if (t2) s += S.yazi(tx, ty + 17, t2, { boy: 13, hiza: h, renk: R.metin });
      });
      s += S.yazi(84, 236, 'c = 1 ÷ √(μ₀ε₀) ≈ ' + tr(c / 1000) + ' km/s', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(84, 254, 'frekans × dalga boyu = c', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* d33 · bölüm 13: manyetik alan merdiveni (gauss, log). Değerler d33 metninden: Dünya, buzdolabı mıknatısı, Güneş lekesi, MR. */
  const DUNYA_G = [0.22, 0.67];                           /* d33 bölüm 12–13: Dünya yüzeyi, gauss */
  C.ekle('d33-alan-merdiveni', {
    ders: 'd33', bolum: 13, oran: 0.84,
    baslik: 'Dünya\'dan Güneş lekesine ve MR\'a: manyetik alanların merdiveni',
    aciklama: 'Yatay eksen manyetik alanın gücüdür, gauss biriminde ve logaritmik: her çentik on kat demektir; bir gauss teslanın on binde biridir. Dünya\'nın yüzeydeki alanı yere göre yaklaşık 0,22 ile 0,67 gauss arasındadır. Güçlü bir buzdolabı mıknatısı yaklaşık 100 gauss, bir Güneş lekesi yaklaşık 3000 gauss, yani 0,3 tesla, hastanedeki MR cihazları 1,5 ya da 3 tesla, yani 15.000 ile 30.000 gausstur. Leke Dünya\'nın alanından kabaca 4500 ile 14.000 kat güçlü, MR\'ın ise beşte biri ile onda biri kadardır. Merdivende eşit adımlar eşit oranlardır.',
    kaynak: [KAYNAK.hale, KAYNAK.bgs, KAYNAK.radiopaedia],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 22, y: 60, w: 356, h: 170 }, { x0: 0.1, x1: 1e5, y0: 0, y1: 1 }, {
        logX: true,
        xIsaret: [[0.1, '0,1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1000'], [1e4, '10⁴'], [1e5, '10⁵']],
        xAd: 'manyetik alan (gauss, logaritmik)'
      });
      let s = ek.svg.replace(/<line[^>]*x1="22" y1="60"[^>]*\/>/, '');
      const cubuk = (g0, g1, sat, ad, alt, r) => {
        const x0 = ek.X(g0), x1 = Math.max(ek.X(g1), x0 + 8), y = 60 + sat * 40;
        let o = S.kutu(x0, y, x1 - x0, 16, { dolgu: r, renk: R.metin, kalin: 1 }, 3);
        o += S.cizgi((x0 + x1) / 2, y + 16, (x0 + x1) / 2, 230, { renk: R.soluk, kalin: 1, kesik: '2 3' });
        const sag = (x0 + x1) / 2 > 320, tx = sag ? x0 - 6 : x1 + 6;
        o += S.zeminliYazi(tx, y + 13, ad, { boy: 13, hiza: sag ? 'end' : 'start', renk: R.metin, kalin: true });
        if (alt) o += S.zeminliYazi(tx, y + 30, alt, { boy: 13, hiza: sag ? 'end' : 'start', renk: R.soluk });
        return o;
      };
      s += cubuk(DUNYA_G[0], DUNYA_G[1], 0, 'Dünya yüzeyi', tr(DUNYA_G[0], 2) + '–' + tr(DUNYA_G[1], 2) + ' G', R.mavi);
      s += cubuk(95, 105, 1, 'buzdolabı mıknatısı', '≈100 G (0,01 T)', R.soluk);
      s += cubuk(2900, 3100, 2, 'Güneş lekesi', '≈3000 G (0,3 T)', R.gunes);
      s += cubuk(15000, 30000, 3, 'MR cihazı', '1,5–3 T', R.vurgu);
      /* oran oku: Dünya → leke */
      const y = 312, xa = ek.X(Math.sqrt(DUNYA_G[0] * DUNYA_G[1])), xb = ek.X(3000);
      s += S.ok(xa, y, xb, y, { renk: R.vurgu, kalin: 2, boy: 8 }) + S.ok(xb, y, xa, y, { renk: R.vurgu, kalin: 2, boy: 8 });
      s += S.zeminliYazi((xa + xb) / 2, y - 8, 'leke ÷ Dünya ≈ ' + tr(Math.round(3000 / DUNYA_G[1] / 100) * 100) + '–' + tr(Math.round(3000 / DUNYA_G[0] / 1000) * 1000) + ' kat', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(8, 22, '1 gauss = teslanın on binde biri', { boy: 13, renk: R.soluk });
      return s;
    }
  });
})();
