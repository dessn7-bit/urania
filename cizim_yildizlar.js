/* cizim_yildizlar.js — yildizlar ünitesinin ders çizimleri (cizim.js kayıtları).
   Dersler: d4 (Güneş), d14 (yıldız doğumu), d5 (H-R, anakol), d15 (kümeler, çiftler), d6 (yıldız ölümü), d16 (kara delikler).
   Sayılar: ders metinleri (arastirma/dersler_v2/dNN.json, kaynakları dNN_kaynak.md), veri/fizik.json, veri/algol.json
   ve her kaydın kaynak listesindeki sayfalar. Formülle hesaplanan sayıların hesabı yanında yazılıdır. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  const lg = Math.log10;
  /* y ekseninin adı: döndürülmüş yazı yerine eksenin üstünde yatay */
  const ustAd = (S, al, t) => S.yazi(4, al.y - 16, t, { boy: 13, renk: S.R.soluk });
  const satir = (S, x, y, ls, o, ara) => ls.map((t, i) => S.yazi(x, y + i * (ara || 16), t, o)).join('');

  /* Mamajek anakol tablosu — veri/fizik.json "anakol.tablo" kopyası: [tip, kütle (M☉), ışıma gücü (L☉), sıcaklık (K), ömür (yıl)].
     Ömürler fizik.json'da τ ≈ 10¹⁰ yıl × (M/M☉)(L☉/L) ile hesaplanmış. */
  const ANAKOL = [
    ['O5', 43, 347000, 41400, 1.24e6], ['B0', 17.7, 44700, 31400, 3.96e6], ['B5', 4.7, 589, 15700, 7.98e7],
    ['A0', 2.18, 38.0, 9700, 5.73e8], ['A5', 1.88, 12.3, 8100, 1.53e9], ['F0', 1.61, 7.24, 7220, 2.22e9],
    ['F5', 1.33, 3.63, 6550, 3.66e9], ['G0', 1.06, 1.35, 5930, 7.86e9], ['G2', 1.0, 1.02, 5770, 9.77e9],
    ['G5', 0.98, 0.891, 5660, 1.10e10], ['K0', 0.88, 0.457, 5270, 1.93e10], ['K5', 0.7, 0.174, 4440, 4.03e10],
    ['M0', 0.57, 0.0692, 3850, 8.24e10], ['M3', 0.37, 0.0162, 3430, 2.28e11]
  ];
  const MAMAJEK = { ad: 'Mamajek, anakol yıldızları tablosu', url: 'https://www.pas.rochester.edu/~emamajek/EEM_dwarf_UBVIJHK_colors_Teff.txt' };
  /* Kütleye göre anakolda konum (log kütle → log sıcaklık, log ışıma gücü doğrusal ara değer) */
  function anakolKonum(M) {
    const t = ANAKOL.slice().sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < t.length - 1; i++) {
      const a = t[i], b = t[i + 1];
      if (M >= a[1] && M <= b[1]) {
        const f = (lg(M) - lg(a[1])) / (lg(b[1]) - lg(a[1]));
        return { T: Math.pow(10, lg(a[3]) + f * (lg(b[3]) - lg(a[3]))), L: Math.pow(10, lg(a[2]) + f * (lg(b[2]) - lg(a[2]))) };
      }
    }
    return null;
  }

  /* ================= d4 — Güneş ================= */

  C.ekle('d4-katmanlar', {
    ders: 'd4', bolum: 3, oran: 0.8,
    baslik: 'Güneş\'in katmanları',
    aciklama: 'Güneş\'in çeyrek kesiti. Merkezden yarıçapın yaklaşık 0,25\'ine kadar çekirdek, 0,7\'sine kadar ışınım bölgesi, oradan yüzeye kadar konveksiyon bölgesi uzanır; bu üç iç katman ölçeklidir. Işınım bölgesindeki zikzak, fotonun dolambaçlı yolunu; halkalar konveksiyon akıntılarını gösterir. Fotosfer, kromosfer ve korona ölçeksiz çizildi: gerçekte kromosfer yarıçapın yüzde birinden incedir, korona ise çok uzağa yayılır.',
    kaynak: [{ ad: 'NASA, Sun Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html' }, { ad: 'Wikipedia, Sun', url: 'https://en.wikipedia.org/wiki/Sun' }],
    ciz(S) {
      const R = S.R, cx = 20, cy = 290, Ry = 220;
      const dilim = (r, o) => S.yol(`M${cx},${cy} L${cx + r},${cy} A${r},${r} 0 0 0 ${cx},${cy - r} Z`, o);
      let s = '';
      s += dilim(Ry + 22, { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.45 });              // korona (ölçeksiz)
      s += S.yay(cx, cy, Ry + 3, 0, 90, { renk: R.vurgu, kalin: 5 });                         // kromosfer (ölçeksiz)
      s += dilim(Ry, { dolgu: R.yuzey2, renk: R.soluk, kalin: 1 });                            // konveksiyon 0,7–1
      s += dilim(0.7 * Ry, { dolgu: R.vurguSoluk, renk: R.soluk, kalin: 1 });                  // ışınım 0,25–0,7
      s += dilim(0.25 * Ry, { dolgu: R.gunes, renk: R.gunes, kalin: 1 });                      // çekirdek 0–0,25
      s += S.yay(cx, cy, Ry, 0, 90, { renk: R.gunes, kalin: 2.5 });                            // fotosfer
      /* fotonun zikzak yolu (ışınım bölgesi, 58° doğrultusunda) */
      const a = 58 * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a), px = -uy, py = ux;
      const sap = [0, 7, -5, 8, -7, 5, -8, 6, -5, 7, 0];
      const zz = sap.map((d, k) => { const r = (0.28 + k * 0.038) * Ry; return [cx + r * ux + d * px, cy + r * uy + d * py]; });
      s += S.egri(zz, { renk: R.yildiz, kalin: 1.3 });
      /* konveksiyon halkaları */
      [24, 50, 76].forEach(d => {
        const r = 0.85 * Ry, x = cx + r * Math.cos(d * Math.PI / 180), y = cy - r * Math.sin(d * Math.PI / 180);
        s += S.yay(x, y, 13, 30, 320, { renk: R.uyari, kalin: 1.6 });
        const e = 320 * Math.PI / 180, ex = x + 13 * Math.cos(e), ey = y - 13 * Math.sin(e);
        s += S.ok(ex + 4 * Math.sin(e), ey + 4 * Math.cos(e), ex - 1 * Math.sin(e), ey - 1 * Math.cos(e), { renk: R.uyari, kalin: 1.6, boy: 6 });
      });
      /* etiketler: sağ sütun, yatay öncü çizgilerle */
      const et = [
        [128, Ry, 'Fotosfer', '5772 K'],
        [178, 0.85 * Ry, 'Konveksiyon', 'ısı akıntıları'],
        [226, 0.47 * Ry, 'Işınım bölgesi', '7 → 2 milyon K'],
        [272, 0.13 * Ry, 'Çekirdek', '15,7 milyon K']
      ];
      et.forEach(([y, r, ad, alt]) => {
        const x = cx + Math.sqrt(r * r - (cy - y) * (cy - y));
        s += S.cizgi(x, y, 264, y, { renk: R.soluk, kalin: 1 }) + S.daire(x, y, 2.2, { dolgu: R.metin, renk: 'none' });
        s += S.yazi(268, y - 1, ad, { boy: 14, kalin: true }) + S.yazi(268, y + 15, alt, { boy: 13, renk: R.soluk });
      });
      s += S.yazi(150, 24, 'Kromosfer (ince halka)', { boy: 13, renk: R.vurgu });
      s += S.yazi(150, 42, 'Korona: 1–2 milyon K', { boy: 13, renk: R.soluk });
      s += S.cizgi(148, 46, 137, 66, { renk: R.soluk, kalin: 1 });
      /* yarıçap ölçeği */
      [[0, '0', 'middle'], [0.25, '0,25', 'middle'], [0.7, '0,7', 'middle'], [1, '1', 'middle']].forEach(([f, t, h]) => {
        s += S.cizgi(cx + f * Ry, cy, cx + f * Ry, cy + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(cx + f * Ry, cy + 19, t, { boy: 13, renk: R.soluk, hiza: h });
      });
      s += S.yazi(268, cy + 19, '× yarıçap', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  C.ekle('d4-atmosfer', {
    ders: 'd4', bolum: 4, oran: 0.68,
    baslik: 'Yukarı çıktıkça Güneş atmosferinin sıcaklığı',
    aciklama: 'Fotosferin tabanında yaklaşık 6600 K olan sıcaklık yukarı doğru düşer ve kromosferin altında yaklaşık 4100 K ile en düşük değerine iner. Sonra yeniden yükselir: kromosferin üstünde 20–30 bin K, ince geçiş bölgesinde bir milyon K\'e fırlar, koronada 1–2 milyon K\'dir. Sıcaklık ekseni logaritmiktir; bölge genişlikleri ölçeksizdir.',
    kaynak: [{ ad: 'Wikipedia, Sun', url: 'https://en.wikipedia.org/wiki/Sun' }, { ad: 'NASA, Sun Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html' }],
    ciz(S) {
      const R = S.R, al = { x: 84, y: 40, w: 304, h: 176 };
      const ek = S.eksen(al, { x0: 0, x1: 304, y0: 1000, y1: 3e6 }, { logY: true, yIsaret: [[1e4, '10 bin'], [1e5, '100 bin'], [1e6, '1 milyon']] });
      let s = ek.svg + ustAd(S, al, 'Sıcaklık, K (logaritmik)');
      /* bölgeler (ölçeksiz genişlikler): fotosfer 0–60, kromosfer 60–176, geçiş 176–220, korona 220–304 */
      const sinir = [60, 176, 220];
      sinir.forEach(v => { s += S.cizgi(ek.X(v), al.y, ek.X(v), al.y + al.h, { renk: R.soluk, kalin: 1, kesik: '3 4', saydam: 0.7 }); });
      [[30, 'Fotosfer'], [118, 'Kromosfer'], [198, 'Geçiş'], [262, 'Korona']].forEach(([v, t]) => { s += S.yazi(ek.X(v), al.y + al.h + 22, t, { boy: 13, hiza: 'middle', renk: R.soluk }); });
      s += S.yazi(al.x + al.w / 2, al.y + al.h + 44, 'Yükseklik → (bölge genişlikleri ölçeksiz)', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* ders metnindeki değerler */
      const nk = [[0, 6600], [60, 4400], [76, 4100], [176, 25000], [220, 1e6], [304, 1.5e6]];
      s += S.egri(nk.map(([x, T]) => [ek.X(x), ek.Y(T)]), { renk: R.gunes, kalin: 2.5 });
      nk.forEach(([x, T], i) => { if (i !== 1) s += S.daire(ek.X(x), ek.Y(T), 3, { dolgu: R.gunes, renk: 'none' }); });
      s += S.yazi(ek.X(0) + 6, ek.Y(6600) - 9, '6600 K', { boy: 13 });
      s += S.yazi(ek.X(76) + 2, ek.Y(4100) + 18, '4100 K, en düşük', { boy: 13 });
      s += S.yazi(ek.X(176) - 8, ek.Y(25000) - 6, '20–30 bin K', { boy: 13, hiza: 'end' });
      s += S.yazi(ek.X(304), ek.Y(1.5e6) - 10, '1–2 milyon K', { boy: 13, hiza: 'end', renk: R.vurgu, kalin: true });
      return s;
    }
  });

  C.ekle('d4-dongu25', {
    ders: 'd4', bolum: 6, oran: 0.64,
    baslik: '25. Güneş döngüsü: öngörü ve gerçek',
    aciklama: 'Leke sayısı Aralık 2019\'daki minimumdan yükseldi ve Ekim 2024\'te 161 ile tepe yaptı; uzman panelinin öngördüğü 95–130 bandının üstüne çıktı. Eğrinin biçimi şematiktir: gerçek olan yalnız başlangıç tarihi, tepenin tarihi ve değeri ile panel bandıdır. Kesikli kısım beklenen düşüştür.',
    kaynak: [{ ad: 'SIDC, Solar Cycle 25 reached its maximum in October 2024', url: 'https://www.sidc.be/article/solar-cycle-25-reached-its-maximum-october-2024' }, { ad: 'Wikipedia, Solar cycle 25', url: 'https://en.wikipedia.org/wiki/Solar_cycle_25' }],
    ciz(S) {
      const R = S.R, al = { x: 52, y: 34, w: 330, h: 186 };
      const ek = S.eksen(al, { x0: 2019.5, x1: 2027, y0: 0, y1: 180 }, { xIsaret: [[2020, '2020'], [2022, '2022'], [2024, '2024'], [2026, '2026']], yIsaret: [0, 50, 100, 150] });
      let s = ustAd(S, al, 'Leke sayısı (aylık, düzeltilmiş)');   // 161: SIDC'nin 13 aylık düzeltilmiş değeri, ham aylık değil
      /* panel öngörüsü: tepe 2023–2026 arasında, 95–130 leke */
      s += S.kutu(ek.X(2023), ek.Y(130), ek.X(2026) - ek.X(2023), ek.Y(95) - ek.Y(130), { dolgu: R.vurguSoluk, renk: R.vurgu, kalin: 1, kesik: '4 3' });
      s += S.zeminliYazi((ek.X(2023) + ek.X(2026)) / 2, ek.Y(112.5) + 5, 'Öngörü: 95–130', { boy: 13, hiza: 'middle', renk: R.vurgu });   // yarı saydam bant üstünde 3,54:1 idi
      s += ek.svg;
      /* şematik eğri: başlangıç Aralık 2019, tepe Ekim 2024'te 161 */
      const t0 = 2019 + 11.5 / 12, tp = 2024 + 9.5 / 12, tep = 161, xp = tp - t0;
      const f = t => { const u = (t - t0) / xp; return u <= 0 ? 0 : tep * Math.pow(u, 3) * Math.exp(3 * (1 - u)); };
      s += S.fonk(ek, f, t0, tp, 80, { renk: R.gunes, kalin: 2.5 });
      s += S.fonk(ek, f, tp, 2027, 40, { renk: R.gunes, kalin: 2, kesik: '5 4' });
      s += S.daire(ek.X(tp), ek.Y(tep), 4, { dolgu: R.gunes, renk: 'none' });
      s += S.yazi(ek.X(tp) - 16, ek.Y(tep) - 12, 'Ekim 2024: 161', { boy: 14, hiza: 'middle', kalin: true });
      s += S.daire(ek.X(t0), ek.Y(0), 3.5, { dolgu: R.metin, renk: 'none' });
      s += S.cizgi(ek.X(t0), ek.Y(0) - 4, ek.X(t0) + 4, ek.Y(52), { renk: R.soluk, kalin: 1 });
      s += S.yazi(ek.X(t0) - 4, ek.Y(52) - 6, 'Aralık 2019', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================= d14 — Yıldızlar nasıl doğar ================= */

  C.ekle('d14-bulutsu-turleri', {
    ders: 'd14', bolum: 3, oran: 0.9,
    baslik: 'Üç bulutsu, üç ışık yolu',
    aciklama: 'Salma bulutsusunda sıcak yıldızın morötesi ışığı hidrojeni iyonlaştırır; gaz kendi kırmızı H-alfa ışığını, 656,28 nanometrede salar. Yansıma bulutsusunda toz yıldız ışığını saçar; mavi daha çok saçıldığı için bulutsu mavi görünür. Karanlık bulutsuda yoğun toz arkadaki ışığı örter ve bulut kara bir siluet olur. Çizim şematiktir.',
    kaynak: [{ ad: 'Wikipedia, Nebula', url: 'https://en.wikipedia.org/wiki/Nebula' }, { ad: 'Wikipedia, Reflection nebula', url: 'https://en.wikipedia.org/wiki/Reflection_nebula' }, { ad: 'Wikipedia, Hydrogen-alpha', url: 'https://en.wikipedia.org/wiki/Hydrogen-alpha' }],
    ciz(S) {
      const R = S.R;
      let s = '';
      const goz = (x, y) => S.elips(x, y, 15, 8, { renk: R.metin, kalin: 1.5 }) + S.daire(x, y, 4, { dolgu: R.metin, renk: 'none' });
      const satirlar = [
        { ad: 'Salma bulutsusu', bulut: { dolgu: R.uyari, saydam: 0.5 }, kaynak: 'sıcak yıldız', kr: R.sicak, ok1: 'morötesi', ok2: 'kırmızı ışık', alt: 'Gaz iyonlaşır, H-alfa (656,28 nm) ışığını salar' },
        { ad: 'Yansıma bulutsusu', bulut: { dolgu: R.mavi, saydam: 0.4 }, kaynak: 'yıldız', kr: R.yildiz, ok1: 'yıldız ışığı', ok2: 'saçılan mavi', alt: 'Toz ışığı saçar; mavi daha çok saçılır' },
        { ad: 'Karanlık bulutsu', bulut: { dolgu: R.zemin, saydam: 1 }, kaynak: 'arka plan', kr: R.yildiz, ok1: 'arka ışık', ok2: 'ışık yok', alt: 'Yoğun toz arkadaki ışığı örter (At Başı gibi)' }
      ];
      satirlar.forEach((r, i) => {
        const y0 = 4 + 118 * i, y = y0 + 56;
        s += S.yazi(8, y0 + 16, r.ad, { boy: 15, kalin: true });
        /* kaynak */
        if (i < 2) s += S.daire(36, y, i === 0 ? 9 : 7, { dolgu: r.kr, renk: 'none' });
        else [-13, 0, 13].forEach((d, k) => { s += S.daire(30 + k * 6, y + d, 3, { dolgu: r.kr, renk: 'none' }); });
        s += S.yazi(36, y + 26, r.kaynak, { boy: 13, hiza: 'middle', renk: R.soluk });
        /* bulut */
        s += S.elips(200, y, 56, 28, { dolgu: r.bulut.dolgu, saydam: r.bulut.saydam, renk: R.soluk, kalin: 1.2 });
        if (i === 2) s += S.elips(200, y, 56, 28, { renk: R.soluk, kalin: 1.2 });
        /* kaynak → bulut */
        s += S.ok(52, y, 140, y, { renk: i === 0 ? R.sicak : R.yildiz, kalin: 2 });
        s += S.yazi(96, y - 9, r.ok1, { boy: 13, hiza: 'middle', renk: R.soluk });
        /* bulut → göz */
        if (i === 0) s += S.ok(260, y, 336, y, { renk: R.uyari, kalin: 2.5 });
        if (i === 1) {
          s += S.ok(260, y, 336, y, { renk: R.mavi, kalin: 2.5 });
          s += S.ok(216, y - 29, 228, y - 45, { renk: R.mavi, kalin: 1.5, boy: 7 }) + S.ok(184, y - 29, 172, y - 45, { renk: R.mavi, kalin: 1.5, boy: 7 });
        }
        if (i === 2) s += S.cizgi(266, y, 334, y, { renk: R.soluk, kalin: 1.2, kesik: '3 5' });
        s += S.yazi(298, y - 9, r.ok2, { boy: 13, hiza: 'middle', renk: R.soluk });
        s += goz(360, y);
        if (i === 0) s += S.yazi(360, y + 26, 'sen', { boy: 13, hiza: 'middle', renk: R.soluk });
        s += S.yazi(200, y0 + 106, r.alt, { boy: 13, hiza: 'middle' });
        if (i < 2) s += S.cizgi(8, y0 + 118, 392, y0 + 118, { renk: R.cizgi, kalin: 1 });
      });
      return s;
    }
  });

  C.ekle('d14-dogum', {
    ders: 'd14', bolum: 6, oran: 1.06,
    baslik: 'Buluttan anakola',
    aciklama: 'Bir yıldızın doğumu beş adımda: soğuk moleküler bulut, kütleçekiminin basıncı yendiği çöküş ve parçalanma, çevresinde disk olan önyıldız, jet fışkırtan T Tauri yıldızı ve sonunda merkezinde hidrojen füzyonu başlayan anakol yıldızı. Süreler ders metnindendir; şema ölçeksizdir.',
    kaynak: [{ ad: 'Wikipedia, Molecular cloud', url: 'https://en.wikipedia.org/wiki/Molecular_cloud' }, { ad: 'Wikipedia, Protostar', url: 'https://en.wikipedia.org/wiki/Protostar' }, { ad: 'Wikipedia, T Tauri star', url: 'https://en.wikipedia.org/wiki/T_Tauri_star' }],
    ciz(S) {
      const R = S.R;
      let s = '';
      const adim = [
        ['Moleküler bulut', 'iç sıcaklık ~10 K', '10.000 – 10 milyon Güneş kütlesi'],
        ['Çöküş ve parçalanma', 'kütleçekimi gaz basıncını yener', 'parçalar ayrı ayrı çöker → küme'],
        ['Önyıldız ve disk', 'Sınıf 0 ~10⁴ yıl → Sınıf I ~10⁵ yıl', 'Güneş benzeri: toplam ~500.000 yıl'],
        ['T Tauri yıldızı', 'jetler ve disk; büzülerek ısınır', '10 milyon yıldan genç'],
        ['Anakol yıldızı', 'merkezde hidrojen füzyonu başlar', 'anakolun ayrıntısı Yıldızların Hayatı dersinde']
      ];
      adim.forEach((a, i) => {
        const y = 6 + 86 * i, cy = y + 34;
        s += S.kutu(8, y, 384, 68, { dolgu: R.yuzey2, renk: R.cizgi, kalin: 1 }, 8);
        if (i === 0) s += S.daire(38, cy + 4, 13, { dolgu: R.soluk, saydam: 0.5, renk: 'none' }) + S.daire(54, cy - 4, 15, { dolgu: R.soluk, saydam: 0.5, renk: 'none' }) + S.daire(64, cy + 8, 11, { dolgu: R.soluk, saydam: 0.5, renk: 'none' });
        if (i === 1) {
          s += S.elips(50, cy, 30, 22, { renk: R.soluk, kalin: 1.2, kesik: '3 4' });
          [[38, cy - 8], [58, cy - 6], [46, cy + 9], [64, cy + 8]].forEach(([x, yy]) => { s += S.daire(x, yy, 4, { dolgu: R.vurgu, renk: 'none' }); });
        }
        if (i === 2 || i === 3) {
          s += S.elips(48, cy, 28, 6, { dolgu: R.vurguSoluk, renk: R.vurgu, kalin: 1 });
          s += S.daire(48, cy, 6, { dolgu: R.gunes, renk: 'none' });
          if (i === 3) s += S.ok(48, cy - 8, 48, cy - 25, { renk: R.mavi, kalin: 2, boy: 7 }) + S.ok(48, cy + 8, 48, cy + 25, { renk: R.mavi, kalin: 2, boy: 7 });
        }
        if (i === 4) {
          for (let k = 0; k < 8; k++) { const t = k * Math.PI / 4; s += S.cizgi(48 + 13 * Math.cos(t), cy + 13 * Math.sin(t), 48 + 20 * Math.cos(t), cy + 20 * Math.sin(t), { renk: R.gunes, kalin: 1.5 }); }
          s += S.daire(48, cy, 10, { dolgu: R.gunes, renk: 'none' });
        }
        s += S.yazi(96, y + 22, a[0], { boy: 15, kalin: true });
        s += S.yazi(96, y + 41, a[1], { boy: 13, renk: R.soluk }) + S.yazi(96, y + 58, a[2], { boy: 13, renk: R.soluk });
        if (i < 4) s += S.ok(48, y + 69, 48, y + 85, { renk: R.vurgu, kalin: 2, boy: 7 });
      });
      return s;
    }
  });

  /* ================= d5 — H-R diyagramı ve anakol ================= */

  C.ekle('d5-hr', {
    ders: 'd5', bolum: 2, oran: 0.92,
    baslik: 'H-R diyagramı',
    aciklama: 'Yatayda yüzey sıcaklığı, dikeyde ışıma gücü var; ikisi de logaritmik ve sıcaklık sola doğru artar. Noktalar Mamajek tablosundaki anakol yıldızlarıdır: sol üstte sıcak ve parlak O5, sağ altta soğuk ve sönük M3, arada Güneş. Devler, süperdevler ve beyaz cüceler yalnız bölge olarak, yaklaşık yerleriyle çizildi. Üstteki harfler tayf sınıflarının sıcaklık aralıklarıdır.',
    kaynak: [MAMAJEK, { ad: 'Wikipedia, Hertzsprung–Russell diagram', url: 'https://en.wikipedia.org/wiki/Hertzsprung%E2%80%93Russell_diagram' }, { ad: 'Wikipedia, Stellar classification', url: 'https://en.wikipedia.org/wiki/Stellar_classification' }],
    ciz(S) {
      const R = S.R, al = { x: 70, y: 52, w: 315, h: 262 };
      const ek = S.eksen(al, { x0: 50000, x1: 2300, y0: 1e-4, y1: 1e6 }, {
        logX: true, logY: true,
        xIsaret: [[30000, '30.000'], [10000, '10.000'], [5000, '5000'], [3000, '3000']],
        yIsaret: [[1e-4, '0,0001'], [1e-2, '0,01'], [1, '1'], [100, '100'], [1e4, '10.000'], [1e6, '1 milyon']],
        xAd: 'Yüzey sıcaklığı (K) · sıcak solda'
      });
      let s = ustAd(S, { y: 34 }, 'Işıma gücü (Güneş = 1)');
      /* bölgeler (yaklaşık, şematik) */
      s += S.elips(ek.X(7000), ek.Y(2e5), 80, 15, { dolgu: R.vurguSoluk, renk: R.vurgu, kalin: 1, kesik: '4 3', saydam: 0.9 });
      s += S.yazi(ek.X(7000), ek.Y(2e5) + 5, 'Süperdevler', { boy: 14, hiza: 'middle', kalin: true });
      s += S.elips(ek.X(4500), ek.Y(100), 44, 25, { dolgu: R.vurguSoluk, renk: R.vurgu, kalin: 1, kesik: '4 3', saydam: 0.9 });
      s += S.yazi(ek.X(4500), ek.Y(100) + 5, 'Devler', { boy: 14, hiza: 'middle', kalin: true });
      s += S.elips(ek.X(15000), ek.Y(1e-3), 54, 14, { dolgu: R.yuzey2, renk: R.soluk, kalin: 1, kesik: '4 3' });
      s += S.yazi(ek.X(15000), ek.Y(1e-3) + 5, 'Beyaz cüceler', { boy: 13, hiza: 'middle', kalin: true });
      s += ek.svg;
      /* üst eksen: tayf sınıfları (Wikipedia'nın anakol sıcaklık aralıkları) */
      s += S.cizgi(al.x, al.y, al.x + al.w, al.y, { renk: R.soluk, kalin: 1 });
      [33000, 10000, 7300, 6000, 5300, 3900].forEach(T => { s += S.cizgi(ek.X(T), al.y - 5, ek.X(T), al.y, { renk: R.soluk, kalin: 1 }); });
      [['O', 33000, 50000], ['B', 10000, 33000], ['A', 7300, 10000], ['F', 6000, 7300], ['G', 5300, 6000], ['K', 3900, 5300], ['M', 2300, 3900]].forEach(([h, a, b]) => {
        s += S.yazi(ek.X(Math.sqrt(a * b)), al.y - 9, h, { boy: 14, hiza: 'middle', kalin: true, renk: R.vurgu });
      });
      /* anakol: Mamajek noktaları */
      s += S.egri(ANAKOL.map(r => [ek.X(r[3]), ek.Y(r[2])]), { renk: R.vurguSoluk, kalin: 7 });
      ANAKOL.forEach(r => {
        const renk = r[3] >= 7300 ? R.sicak : r[3] < 5300 ? R.soguk : R.gunes;
        s += S.daire(ek.X(r[3]), ek.Y(r[2]), r[0] === 'G2' ? 5 : 3.5, { dolgu: renk, renk: 'none' });
      });
      const nk = t => ANAKOL.find(r => r[0] === t);
      const o5 = nk('O5'), a0 = nk('A0'), g2 = nk('G2'), m3 = nk('M3');
      s += S.yazi(ek.X(o5[3]) + 8, ek.Y(o5[2]) + 5, 'O5', { boy: 13 });
      s += S.yazi(ek.X(a0[3]) + 8, ek.Y(a0[2]) - 4, 'A0', { boy: 13 });
      s += S.yazi(ek.X(g2[3]) - 8, ek.Y(g2[2]) + 18, 'Güneş (G2)', { boy: 13, hiza: 'end', kalin: true });
      s += S.yazi(ek.X(m3[3]) + 8, ek.Y(m3[2]) + 5, 'M3', { boy: 13 });
      s += S.yazi(ek.X(22000) - 4, ek.Y(4850) + 30, 'Anakol', { boy: 15, kalin: true, renk: R.vurgu, hiza: 'end' });
      return s;
    }
  });

  C.ekle('d5-kutle-isima', {
    ders: 'd5', bolum: 4, oran: 0.78,
    baslik: 'Kütle biraz artınca ışıma gücü çok artar',
    aciklama: 'Noktalar Mamajek tablosundaki anakol yıldızları, çizgiler Wikipedia\'nın kaba kuralı: 0,43 ile 2 Güneş kütlesi arasında ışıma gücü kütlenin dördüncü kuvveti, 2\'nin üstünde 1,4 çarpı kütlenin 3,5\'inci kuvveti. A0 yıldızında tablo 38 der, kural yaklaşık 23 verir. İki eksen de logaritmiktir.',
    kaynak: [MAMAJEK, { ad: 'Wikipedia, Mass–luminosity relation', url: 'https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation' }],
    ciz(S) {
      const R = S.R, al = { x: 66, y: 34, w: 316, h: 226 };
      const ek = S.eksen(al, { x0: 0.3, x1: 50, y0: 0.01, y1: 1e6 }, {
        logX: true, logY: true,
        xIsaret: [[0.5, '0,5'], [1, '1'], [2, '2'], [5, '5'], [10, '10'], [20, '20'], [50, '50']],
        yIsaret: [[0.01, '0,01'], [1, '1'], [100, '100'], [1e4, '10.000'], [1e6, '1 milyon']],
        xAd: 'Kütle (Güneş = 1)'
      });
      let s = ek.svg + ustAd(S, al, 'Işıma gücü (Güneş = 1)');
      s += S.fonk(ek, M => Math.pow(M, 4), 0.43, 2, 30, { renk: R.mavi, kalin: 2 }, true);
      s += S.fonk(ek, M => 1.4 * Math.pow(M, 3.5), 2, 50, 30, { renk: R.uyari, kalin: 2 }, true);
      ANAKOL.forEach(r => { s += S.daire(ek.X(r[1]), ek.Y(r[2]), 3.5, { dolgu: R.metin, renk: 'none' }); });
      /* A0: tablo 38, kural 2,18⁴ ≈ 22,6 */
      const a0 = ANAKOL.find(r => r[0] === 'A0');
      s += S.daire(ek.X(a0[1]), ek.Y(Math.pow(a0[1], 4)), 4, { renk: R.mavi, kalin: 1.5 });
      s += S.cizgi(ek.X(a0[1]) + 4, ek.Y(a0[2]) + 4, ek.X(a0[1]) + 26, ek.Y(a0[2]) + 28, { renk: R.soluk, kalin: 1 });
      s += S.yazi(ek.X(a0[1]) + 22, ek.Y(a0[2]) + 42, 'A0: tablo 38, kural ~23', { boy: 13, kalin: true });
      s += S.yazi(ek.X(1.05), ek.Y(0.08), 'kural: M⁴', { boy: 13, renk: R.mavi });
      s += S.yazi(ek.X(1.05), ek.Y(0.08) + 16, '(0,43–2)', { boy: 13, renk: R.mavi });
      s += S.yazi(ek.X(7), ek.Y(30), 'kural: 1,4 × M^3,5', { boy: 13, renk: R.uyari });
      s += S.yazi(ek.X(7), ek.Y(30) + 16, '(2–55)', { boy: 13, renk: R.uyari });
      s += S.daire(al.x + 12, al.y + 10, 3.5, { dolgu: R.metin, renk: 'none' }) + S.yazi(al.x + 22, al.y + 15, 'Mamajek tablosu', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  C.ekle('d5-omur', {
    ders: 'd5', bolum: 5, oran: 0.78,
    baslik: 'Kütleli yıldız kısa yaşar',
    aciklama: 'Anakol ömrü, ders formülüyle Mamajek tablosundan hesaplandı: 10 milyar yıl çarpı kütle bölü ışıma gücü. 43 Güneş kütleli bir O5 yıldızı yaklaşık 1,2 milyon yıl, A0 yaklaşık 570 milyon yıl, Güneş yaklaşık 10 milyar yıl, M0 cücesi yaklaşık 82 milyar yıl yaşar. Kesikli çizgi evrenin yaşı, 13,8 milyar yıl; ömrü bu çizginin üstünde kalan K ve M cücelerinin henüz anakolu bitirmiş olması beklenmez. İki eksen de logaritmiktir.',
    kaynak: [MAMAJEK, { ad: 'Wikipedia, Main sequence', url: 'https://en.wikipedia.org/wiki/Main_sequence' }],
    ciz(S) {
      const R = S.R, al = { x: 60, y: 34, w: 322, h: 226 };
      const ek = S.eksen(al, { x0: 0.3, x1: 50, y0: 1e-4, y1: 1e3 }, {
        logX: true, logY: true,
        xIsaret: [[0.5, '0,5'], [1, '1'], [2, '2'], [5, '5'], [10, '10'], [20, '20'], [50, '50']],
        yIsaret: [[1e-3, '0,001'], [0.1, '0,1'], [10, '10'], [1000, '1000']],
        xAd: 'Kütle (Güneş = 1)'
      });
      let s = ek.svg + ustAd(S, al, 'Anakol ömrü (milyar yıl)');
      /* evrenin yaşı 13,8 milyar yıl (ders metni) */
      s += S.cizgi(al.x, ek.Y(13.8), al.x + al.w, ek.Y(13.8), { renk: R.soluk, kalin: 1.2, kesik: '6 4' });
      s += S.yazi(al.x + al.w, ek.Y(13.8) - 6, 'evrenin yaşı: 13,8 milyar yıl', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.egri(ANAKOL.map(r => [ek.X(r[1]), ek.Y(r[4] / 1e9)]), { renk: R.vurguSoluk, kalin: 3 });
      ANAKOL.forEach(r => { s += S.daire(ek.X(r[1]), ek.Y(r[4] / 1e9), r[0] === 'G2' ? 5 : 3.5, { dolgu: r[0] === 'G2' ? R.gunes : R.metin, renk: 'none' }); });
      const nk = t => { const r = ANAKOL.find(q => q[0] === t); return [ek.X(r[1]), ek.Y(r[4] / 1e9)]; };
      const [ox, oy] = nk('O5'), [ax, ay] = nk('A0'), [gx, gy] = nk('G2'), [mx, my] = nk('M0');
      s += S.yazi(ox - 4, oy + 22, 'O5: 1,2 milyon yıl', { boy: 13, hiza: 'end', kalin: true });
      s += S.yazi(ax + 9, ay + 5, 'A0: 570 milyon yıl', { boy: 13, kalin: true });   // noktanın hizasında
      s += S.cizgi(gx + 3, gy - 4, gx + 14, al.y + 38, { renk: R.soluk, kalin: 1 });
      s +=S.yazi(gx + 16, al.y + 34, 'Güneş: ~10 milyar yıl', { boy: 13, kalin: true });
      s += S.yazi(mx + 8, al.y + 14, 'M0: 82 milyar yıl', { boy: 13, kalin: true });
      s += S.cizgi(mx + 2, my - 4, mx + 8, al.y + 18, { renk: R.soluk, kalin: 1 });
      return s;
    }
  });

  /* ================= d15 — Kümeler ve çift yıldızlar ================= */

  C.ekle('d15-donum', {
    ders: 'd15', bolum: 2, oran: 0.81,
    baslik: 'Küme yaşlandıkça dönüm noktası aşağı iner',
    aciklama: 'Çizgi, Mamajek tablosundaki anakoldur. Bir kümede anakolu terk etmeye başlayan yıldızların kütlesini ders formülü verir. Yaklaşık 115 milyon yaşındaki Ülker\'de dönüm noktası yaklaşık 6 Güneş kütlesinde, 625 milyon yaşındaki Hyades\'te yaklaşık 3, 12,6 milyar yaşındaki en yaşlı küresel kümelerde yaklaşık 0,9 Güneş kütlesindedir. Formül kabadır.',
    kaynak: [MAMAJEK, { ad: 'Wikipedia, Pleiades', url: 'https://en.wikipedia.org/wiki/Pleiades' }, { ad: 'Wikipedia, Hyades (star cluster)', url: 'https://en.wikipedia.org/wiki/Hyades_(star_cluster)' }, { ad: 'Wikipedia, Milky Way', url: 'https://en.wikipedia.org/wiki/Milky_Way' }],
    ciz(S) {
      const R = S.R, al = { x: 64, y: 34, w: 320, h: 240 };
      const ek = S.eksen(al, { x0: 45000, x1: 2500, y0: 0.01, y1: 1e6 }, {
        logX: true, logY: true,
        xIsaret: [[30000, '30.000'], [10000, '10.000'], [5000, '5000'], [3000, '3000']],
        yIsaret: [[0.01, '0,01'], [1, '1'], [100, '100'], [1e4, '10.000'], [1e6, '1 milyon']],
        xAd: 'Yüzey sıcaklığı (K) · sıcak solda'
      });
      let s = ek.svg + ustAd(S, al, 'Işıma gücü (Güneş = 1)');
      s += S.egri(ANAKOL.map(r => [ek.X(r[3]), ek.Y(r[2])]), { renk: R.soluk, kalin: 2.5 });
      /* dönüm noktası kütlesi M ≈ (τ / 10 milyar yıl)^-0,4 (d15 formülü) */
      const kumeler = [['Ülker', 115e6, '~115 milyon yıl'], ['Hyades', 625e6, '~625 milyon yıl'], ['Küresel', 12.6e9, '~12,6 milyar yıl']];
      const renk = [R.sicak, R.vurgu, R.iyi];
      kumeler.forEach(([ad, yas, yazi], i) => {
        const M = Math.pow(yas / 1e10, -0.4), k = anakolKonum(M);
        /* anakolKonum tablo aralığı (0,37–43 Güneş kütlesi) dışında null döner: o kümenin işareti çizilmez, yazısı kalır */
        if (k) {
          const x = ek.X(k.T), y = ek.Y(k.L);
          s += S.cizgi(x - 12, y, x + 12, y, { renk: renk[i], kalin: 3 }) + S.daire(x, y, 5, { dolgu: renk[i], renk: 'none' });
          s += S.yazi(x - 12, y + 18, String(i + 1), { boy: 14, kalin: true, renk: renk[i], hiza: 'end' });
        }
        const ly = al.y + 16 + i * 36;
        s += S.yazi(200, ly, (i + 1) + ' · ' + ad + ', ' + yazi, { boy: 13, kalin: true, renk: renk[i] });
        s += S.yazi(214, ly + 16, 'dönüm ≈ ' + S.sayi(M, M < 1 ? 1 : 0) + ' Güneş kütlesi', { boy: 13, renk: R.soluk });
      });
      s += S.ok(ek.X(24000) - 22, ek.Y(3000) + 6, ek.X(7000) - 30, ek.Y(1.5) + 14, { renk: R.vurgu, kalin: 1.5, boy: 8 });
      s += S.yazi(ek.X(24000) - 8, ek.Y(1.5) + 18, 'yaşlandıkça', { boy: 13, renk: R.vurgu, hiza: 'middle' });
      return s;
    }
  });

  C.ekle('d15-algol', {
    ders: 'd15', bolum: 5, oran: 1.0,
    baslik: 'Algol: yörünge ve ışık eğrisi',
    aciklama: 'Üstte yörüngeye yukarıdan bakış: biz yörünge düzleminin içinden, aşağıdan bakıyoruz. Ağır Algol A ortak kütle merkezine yakın, hafif Algol B uzakta dolanır. 1 konumunda sönük B, parlak A\'nın önüne geçer ve ışık 3,30 kadire düşer; 2 konumunda A, B\'nin önündedir ve ışık yalnız 2,15 kadire iner. Tutulma 9,63 saat, dönem 2,867343 gün sürer. Eğrinin biçimi şematiktir; derinlikler ve süreler AAVSO kataloğundandır.',
    kaynak: [{ ad: 'AAVSO VSX, bet Per (Algol)', url: 'https://vsx.aavso.org/index.php?view=detail.top&oid=26202' }, { ad: 'Wikipedia, Algol', url: 'https://en.wikipedia.org/wiki/Algol' }],
    ciz(S) {
      const R = S.R;
      let s = '';
      /* yörünge (ölçeksiz): kütle merkezine uzaklıklar kütle oranından: A için 0,70 / 3,87, B için 3,17 / 3,87 */
      const cx = 100, cy = 82, a = 80, rA = a * 0.70 / 3.87, rB = a * 3.17 / 3.87;
      s += S.daire(cx, cy, rB, { renk: R.soluk, kalin: 1, kesik: '3 4' }) + S.daire(cx, cy, rA, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.cizgi(cx - 4, cy, cx + 4, cy, { renk: R.soluk, kalin: 1 }) + S.cizgi(cx, cy - 4, cx, cy + 4, { renk: R.soluk, kalin: 1 });
      /* konum 1: B aşağıda (bize doğru), A yukarıda; konum 2: tersi (soluk) */
      s += S.daire(cx, cy + rA, 10, { dolgu: R.yildiz, renk: 'none', saydam: 0.35 }) + S.daire(cx, cy - rB, 7, { dolgu: R.soguk, renk: 'none', saydam: 0.35 });
      s += S.daire(cx, cy - rA, 10, { dolgu: R.yildiz, renk: 'none' }) + S.daire(cx, cy + rB, 7, { dolgu: R.soguk, renk: 'none' });
      s += S.yazi(cx + 16, cy - rA - 2, 'A', { boy: 14, kalin: true });
      s += S.yazi(cx + 13, cy + rB + 5, 'B', { boy: 14, kalin: true });
      s += S.yazi(cx - 14, cy + rB + 5, '1', { boy: 15, kalin: true, renk: R.vurgu, hiza: 'end' });
      s += S.yazi(cx - 14, cy - rB + 5, '2', { boy: 15, kalin: true, renk: R.vurgu, hiza: 'end' });
      s += S.ok(cx, cy + rB + 12, cx, cy + rB + 34, { renk: R.vurgu, kalin: 2, boy: 7 });
      s += S.yazi(cx + 8, cy + rB + 32, 'Dünya\'ya', { boy: 13, renk: R.soluk });
      s += S.yazi(196, 20, 'Yukarıdan bakış (ölçeksiz)', { boy: 13, renk: R.soluk });
      s += S.yazi(196, 48, '1: B, A\'nın önünde', { boy: 15, kalin: true });
      s += S.yazi(196, 66, 'ışık 3,30 kadire düşer', { boy: 13, renk: R.soluk });
      s += S.yazi(196, 96, '2: A, B\'nin önünde', { boy: 15, kalin: true });
      s += S.yazi(196, 114, 'ışık yalnız 2,15 kadire iner', { boy: 13, renk: R.soluk });
      s += S.yazi(196, 144, 'A: 3,17, B: 0,70 Güneş kütlesi', { boy: 13, renk: R.soluk });
      /* ışık eğrisi: AAVSO VSX — V 2,09–3,30, ikincil 2,15, tutulma 9,63 sa, dönem 2,867343 gün */
      const P = 2.867343 * 24, yari = 9.63 / 2;
      const g = t => Math.abs(t) < yari ? Math.pow(1 - (t / yari) * (t / yari), 1.5) : 0;
      const m = t => 2.09 + 1.21 * g(t) + 0.06 * g(t - P / 2);
      const al = { x: 56, y: 232, w: 326, h: 116 };
      const ek = S.eksen(al, { x0: -12, x1: 46, y0: 3.4, y1: 2.0 }, {
        xIsaret: [[0, '0'], [12, '12'], [24, '24'], [36, '36']], yIsaret: [[2.09, '2,09'], [2.5, '2,5'], [3.0, '3,0'], [3.3, '3,30']],
        xAd: 'Saat (0 = en derin kararma)'
      });
      s += S.yazi(4, al.y - 32, 'Işık eğrisi · dönem 2,867343 gün', { boy: 14, kalin: true });
      s += ustAd(S, al, 'Kadir (küçük değer = daha parlak)');
      s += ek.svg;
      s += S.fonk(ek, m, -12, 46, 400, { renk: R.yildiz, kalin: 2.2 });
      s += S.yazi(ek.X(0) + 10, ek.Y(3.3) + 1, '1 · 3,30 kadir', { boy: 13, kalin: true, renk: R.vurgu });
      s += S.yazi(ek.X(P / 2), ek.Y(2.15) + 20, '2 · 2,15 kadir', { boy: 13, kalin: true, renk: R.vurgu, hiza: 'middle' });
      s += S.cizgi(ek.X(-yari), ek.Y(2.6), ek.X(yari), ek.Y(2.6), { renk: R.soluk, kalin: 1 });
      s += S.cizgi(ek.X(-yari), ek.Y(2.6) - 4, ek.X(-yari), ek.Y(2.6) + 4, { renk: R.soluk, kalin: 1 }) + S.cizgi(ek.X(yari), ek.Y(2.6) - 4, ek.X(yari), ek.Y(2.6) + 4, { renk: R.soluk, kalin: 1 });
      s += S.yazi(ek.X(yari) + 6, ek.Y(2.6) + 5, '9,63 saat', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================= d6 — Yıldızlar nasıl ölür ================= */

  C.ekle('d6-sonlar', {
    ders: 'd6', bolum: 0, oran: 0.8,
    baslik: 'Yıldızın sonunu kütlesi seçer',
    aciklama: 'Yaklaşık 8 Güneş kütlesinden hafif bir yıldız kırmızı dev olur, dış katmanlarını gezegenimsi bulutsu olarak savurur ve geriye en çok yaklaşık 1,4 Güneş kütleli bir beyaz cüce bırakır; Güneş bu yoldadır. Daha ağır yıldız süperdev olur, demir çekirdeği çöker ve süpernova olarak patlar; başlangıç kütlesi yaklaşık 20\'ye kadar olanlardan nötron yıldızı, daha ağırlarından kara delik kalır. Sınırlar yaklaşıktır.',
    kaynak: [{ ad: 'NASA, Types of Black Holes', url: 'https://science.nasa.gov/universe/black-holes/types' }, { ad: 'Wikipedia, Chandrasekhar limit', url: 'https://en.wikipedia.org/wiki/Chandrasekhar_limit' }],
    ciz(S) {
      const R = S.R;
      let s = '';
      const kutu = (x, y, w, h, ust, alt, renk) => S.kutu(x, y, w, h, { dolgu: R.yuzey2, renk: renk || R.cizgi, kalin: 1.2 }, 8) +
        S.yazi(x + w / 2, y + (alt ? 20 : h / 2 + 5), ust, { boy: 14, kalin: true, hiza: 'middle' }) + (alt ? S.yazi(x + w / 2, y + 38, alt, { boy: 13, renk: R.soluk, hiza: 'middle' }) : '');
      /* dolgu yüzey-2 (yarı saydam pirinç zeminde soluk yazı 3,16:1 idi; artık normalde 5,0, kırmızı modda 4,75:1) */
      s += S.kutu(80, 6, 240, 44, { dolgu: R.yuzey2, renk: R.vurgu, kalin: 1.2 }, 8);
      s += S.yazi(200, 25, 'Başlangıç kütlesi', { boy: 15, kalin: true, hiza: 'middle' });
      s += S.yazi(200, 42, '(Güneş kütlesi cinsinden)', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.ok(150, 50, 100, 84, { renk: R.vurgu }) + S.ok(250, 50, 300, 84, { renk: R.vurgu });
      s += S.yazi(112, 64, '~8\'den hafif', { boy: 13, hiza: 'end', renk: R.vurgu, kalin: true });
      s += S.yazi(288, 64, '~8\'den ağır', { boy: 13, renk: R.vurgu, kalin: true });
      /* sol: hafif yıldız */
      s += kutu(8, 88, 184, 50, 'Kırmızı dev', 'dış katmanlar şişer');
      s += S.ok(100, 138, 100, 158, { renk: R.soluk });
      s += kutu(8, 160, 184, 50, 'Gezegenimsi bulutsu', 'dış katmanlar savrulur');
      s += S.ok(100, 210, 100, 230, { renk: R.soluk });
      s += kutu(8, 232, 184, 50, 'Beyaz cüce', 'en çok ~1,4 Güneş kütlesi', R.mavi);
      s += S.yazi(100, 304, 'Güneş bu yolu izler', { boy: 13, hiza: 'middle', renk: R.gunes, kalin: true });
      /* sağ: ağır yıldız */
      s += kutu(208, 88, 184, 50, 'Süperdev', 'katman katman → demir');
      s += S.ok(300, 138, 300, 158, { renk: R.soluk });
      s += kutu(208, 160, 184, 50, 'Süpernova', 'demir çekirdek çöker');
      s += S.ok(272, 210, 254, 230, { renk: R.soluk }) + S.ok(328, 210, 346, 230, { renk: R.soluk });
      s += S.kutu(208, 232, 90, 76, { dolgu: R.yuzey2, renk: R.mavi, kalin: 1.2 }, 8);
      s += satir(S, 253, 251, ['Nötron', 'yıldızı'], { boy: 14, kalin: true, hiza: 'middle' }) + S.yazi(253, 297, '~8–20', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.kutu(302, 232, 90, 76, { dolgu: R.zemin, renk: R.metin, kalin: 1.2 }, 8);
      s += satir(S, 347, 251, ['Kara', 'delik'], { boy: 14, kalin: true, hiza: 'middle' }) + S.yazi(347, 297, '~20 ve üstü', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  C.ekle('d6-sogan', {
    ders: 'd6', bolum: 3, oran: 0.76,
    baslik: 'Kütleli yıldızın soğanı',
    aciklama: '8 Güneş kütlesinden ağır bir yıldızın içi sona doğru soğan gibi katmanlanır: dışta hidrojen, içe doğru helyum, karbon, neon, oksijen, silisyum ve merkezde demir. Sağdaki süreler her yanma evresinin ne kadar sürdüğünü gösterir: hidrojen yaklaşık 10 milyon yıl, silisyum yalnızca yaklaşık 1 gün. Demiri kaynaştırmak enerji vermez; çekirdek çöker. Katman kalınlıkları ölçeksizdir.',
    kaynak: [{ ad: 'Ohio State Üniversitesi, Ast162: Evolution of High-Mass Stars', url: 'https://www.astronomy.ohio-state.edu/pogge.1/Ast162/Unit2/himass.html' }],
    ciz(S) {
      const R = S.R, cx = 118, cy = 154;
      let s = '';
      const k = [['Hidrojen', '~10 milyon yıl', 112], ['Helyum', '~1 milyon yıl', 98], ['Karbon', '~1000 yıl', 84], ['Neon', 'birkaç yıl', 70], ['Oksijen', '~1 yıl', 56], ['Silisyum', '~1 gün', 40], ['Demir çekirdek', 'füzyon enerji vermez', 24]];
      const dolgu = [R.yuzey2, R.vurguSoluk, R.yuzey2, R.vurguSoluk, R.yuzey2, R.vurguSoluk, R.soluk];
      k.forEach((q, i) => { s += S.daire(cx, cy, q[2], { dolgu: dolgu[i], renk: R.soluk, kalin: 1 }); });
      s += S.daire(cx, cy, 112, { renk: R.mavi, kalin: 2 });
      s += S.yazi(244, 16, 'Yanma evresinin süresi', { boy: 13, renk: R.soluk });
      const aci = [60, 42, 24, 6, -16, -40, -70];
      k.forEach((q, i) => {
        const r = i < 6 ? (q[2] + k[i + 1][2]) / 2 : 12, a = aci[i] * Math.PI / 180;
        const px = cx + r * Math.cos(a), py = cy - r * Math.sin(a), ly = 40 + 38 * i;
        s += S.daire(px, py, 2.2, { dolgu: R.metin, renk: 'none' });
        s += S.cizgi(px, py, 238, ly - 5, { renk: R.metin, kalin: 0.8, saydam: 0.7 });
        s += S.yazi(244, ly, q[0], { boy: 14, kalin: true });
        s += S.yazi(244, ly + 15, q[1], { boy: 13, renk: i === 6 ? R.uyari : R.soluk });
      });
      return s;
    }
  });

  C.ekle('d6-atarca', {
    ders: 'd6', bolum: 6, oran: 1.02,
    baslik: 'Atarca: dönen bir deniz feneri',
    aciklama: 'Nötron yıldızı dönme ekseni çevresinde döner; ışınım demetleri ise ondan eğik duran manyetik eksen boyunca çıkar. Demet her dönüşte bir koni tarar; Dünya bu koninin üstündeyse her dönüşte bir atım görürüz. Çizim, demetin tam Dünya\'ya döndüğü anı gösteriyor. Alttaki şerit, Jocelyn Bell\'in 1967\'de bulduğu ilk atarcanın 1,337 saniye arayla gelen atımlarıdır. Çizim ölçeksizdir.',
    kaynak: [{ ad: 'NASA, Neutron Stars and Pulsars', url: 'https://imagine.gsfc.nasa.gov/science/objects/pulsars1.html' }, { ad: 'Sky & Telescope, Jocelyn Bell Burnell', url: 'https://skyandtelescope.org/astronomy-resources/famous-astronomers/jocelyn-bell-burnell-pulsar-pioneer/' }],
    ciz(S) {
      const R = S.R, cx = 130, cy = 128;
      let s = '';
      /* Demetin Dünya'yı süpürebilmesi için Dünya yönü ile dönme ekseni arasındaki açı, manyetik eksenin eğikliğine
         eşit olmalı. Çizim demetin tam Dünya'ya döndüğü anı gösterir: manyetik eksen yatay (Dünya'ya), dönme ekseni ondan
         60° eğik (dikeyden 30° sağa yatık). */
      const yat = 30;
      /* dönme ekseni ve dönüş oku (dik çizilip 30° döndürülür) */
      s += S.grup(S.cizgi(cx, 28, cx, 222, { renk: R.soluk, kalin: 1.2, kesik: '5 4' }) +
        S.yol(`M${cx - 30},38 A30,8 0 1 0 ${cx + 30},38`, { renk: R.metin, kalin: 1.5 }) +
        S.ok(cx + 26, 41, cx + 31, 37, { renk: R.metin, kalin: 1.5, boy: 7 }), `rotate(${yat} ${cx} ${cy})`);
      s += S.yazi(cx + 60, 30, 'dönme ekseni', { boy: 13, renk: R.soluk });
      /* manyetik eksen (dönme ekseninden 60° eğik), şu an Dünya'ya bakan demetler */
      const ux = 1, uy = 0, px = 0, py = 1, L = 100, gen = 20;
      [1, -1].forEach(y => {
        const tx = cx + y * L * ux, ty = cy + y * L * uy;
        s += `<polygon points="${cx + y * 12 * ux},${cy + y * 12 * uy} ${tx + gen * px},${ty + gen * py} ${tx - gen * px},${ty - gen * py}" fill="${R.mavi}" opacity="0.35"/>`;
        s += S.cizgi(cx, cy, tx, ty, { renk: R.mavi, kalin: 1.8 });
      });
      s += S.yazi(cx + 0.6 * L, cy + 40, 'ışınım demeti', { boy: 13, renk: R.mavi, hiza: 'middle' });
      s += S.yazi(cx + 28, cy - 30, 'manyetik eksen', { boy: 13, renk: R.mavi });
      s += S.daire(cx, cy, 12, { dolgu: R.yildiz, renk: 'none' });
      s += S.yazi(cx - 16, cy - 20, 'nötron yıldızı', { boy: 13, renk: R.metin, hiza: 'end' });
      /* Dünya */
      s += S.daire(352, cy, 9, { dolgu: R.mavi, renk: 'none' }) + S.yazi(352, cy + 26, 'Dünya', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.cizgi(234, cy, 340, cy, { renk: R.soluk, kalin: 1, kesik: '2 4' });
      s += S.yazi(200, 250, 'Demet her dönüşte Dünya\'yı süpürür', { boy: 13, hiza: 'middle' });
      /* atım dizisi: 1,337 s aralık */
      const t0x = 56, ol = 76, by = 340, d = 1.337;
      s += S.yazi(8, 276, 'Radyo atımları', { boy: 14, kalin: true });
      let p = `M${t0x - 16},${by}`;
      for (let i = 0; i < 4; i++) { const x = t0x + i * d * ol; p += ` L${x - 3},${by} L${x},${by - 38} L${x + 3},${by}`; }
      p += ` L${t0x + 4.3 * ol},${by}`;
      s += S.yol(p, { renk: R.vurgu, kalin: 2 });
      for (let t = 0; t <= 4; t++) { const x = t0x + t * ol; s += S.cizgi(x, by, x, by + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(x, by + 19, String(t), { boy: 13, hiza: 'middle', renk: R.soluk }); }
      const x1 = t0x, x2 = t0x + d * ol, yb = by - 46;
      s += S.cizgi(x1, yb, x2, yb, { renk: R.metin, kalin: 1 }) + S.cizgi(x1, yb - 4, x1, yb + 4, { renk: R.metin, kalin: 1 }) + S.cizgi(x2, yb - 4, x2, yb + 4, { renk: R.metin, kalin: 1 });
      s += S.yazi((x1 + x2) / 2, yb - 6, '1,337 s', { boy: 13, hiza: 'middle', kalin: true });
      s += S.yazi(200, by + 40, 'zaman (saniye)', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(200, by + 62, 'Yengeç atarcası ise saniyede 30 atım verir', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* ================= d16 — Kara delikler ================= */

  /* Güneş'in Schwarzschild yarıçapı: Rs = 2GM/c² = 2 × GM☉ / c² (IAU GM☉ = 1,3271244 × 10²⁰ m³/s², c = 299.792.458 m/s) ≈ 2953 m */
  const RS_GUNES_KM = 2 * 1.3271244e20 / (299792458 * 299792458) / 1000;

  C.ekle('d16-rs-kutle', {
    ders: 'd16', bolum: 1, oran: 0.74,
    baslik: 'Olay ufku kütleyle doğru orantılı büyür',
    aciklama: 'Schwarzschild yarıçapı kütleyle doğru orantılıdır: her Güneş kütlesi için yaklaşık 2,95 km. 10 Güneş kütleli bir kara delikte yaklaşık 29,5 km, GW150914\'te birleşen 29 ve 36 Güneş kütleli kara deliklerde yaklaşık 86 ve 106 km, birleşmeden doğan 62 Güneş kütleli kara delikte yaklaşık 183 km. Sayılar formülle hesaplandı.',
    kaynak: [{ ad: 'Wikipedia, Schwarzschild radius', url: 'https://en.wikipedia.org/wiki/Schwarzschild_radius' }, { ad: 'IAU 2015 Karar B3 (Güneş\'in GM değeri)', url: 'https://www.iau.org/common/Uploaded%20files/IAUGA2015-Resolution-B3-recommended-nominal-conversion.pdf' }, { ad: 'LIGO/Virgo, GW150914 (LIGO-P1500218)', url: 'https://dcc.ligo.org/P1500218/public' }],
    ciz(S) {
      const R = S.R, al = { x: 56, y: 34, w: 326, h: 210 };
      const ek = S.eksen(al, { x0: 0, x1: 70, y0: 0, y1: 210 }, {
        xIsaret: [0, 10, 20, 30, 40, 50, 60, 70], yIsaret: [0, 50, 100, 150, 200],
        xAd: 'Kara deliğin kütlesi (Güneş = 1)'
      });
      let s = ek.svg + ustAd(S, al, 'Olay ufku yarıçapı (km)');
      const rs = M => RS_GUNES_KM * M;
      s += S.fonk(ek, rs, 0, 70, 2, { renk: R.vurgu, kalin: 2.5 });
      const nok = [1, 10, 29, 36, 62];
      nok.forEach(M => { s += S.daire(ek.X(M), ek.Y(rs(M)), 4, { dolgu: M === 1 ? R.gunes : R.metin, renk: 'none' }); });
      const km = M => { const v = rs(M); return S.sayi(v, v < 50 ? (v < 10 ? 2 : 1) : 0); };
      s += S.yazi(ek.X(62) - 10, ek.Y(rs(62)) - 4, '62 → ' + km(62) + ' km', { boy: 13, hiza: 'end', kalin: true });
      s += S.yazi(ek.X(36) - 10, ek.Y(rs(36)) - 4, '36 → ' + km(36) + ' km', { boy: 13, hiza: 'end', kalin: true });
      s += S.yazi(ek.X(29) + 10, ek.Y(rs(29)) + 16, '29 → ' + km(29) + ' km', { boy: 13, kalin: true });
      s += S.yazi(ek.X(10) + 10, ek.Y(rs(10)) + 16, '10 → ' + km(10) + ' km', { boy: 13, kalin: true });
      s += S.cizgi(ek.X(1), ek.Y(rs(1)) - 4, ek.X(1) + 6, ek.Y(95) + 4, { renk: R.soluk, kalin: 1 });
      s += S.yazi(ek.X(1) + 4, ek.Y(95), 'Güneş → ' + km(1) + ' km', { boy: 13, kalin: true, renk: R.gunes });
      return s;
    }
  });

  C.ekle('d16-ufuk', {
    ders: 'd16', bolum: 1, oran: 0.84,
    baslik: 'Kara deliğin çevresindeki üç sınır',
    aciklama: 'Dönmeyen bir kara delik, ölçekli. Olay ufkundan, yani Schwarzschild yarıçapından, ışık bile çıkamaz. Bunun 1,5 katında foton küresi var: ışık orada kara deliğin çevresinde çember çizebilir. 3 katında en içteki kararlı dairesel yörünge var; daha içeride gaz kararlı biçimde dolanamaz. Güneş kütleli bir kara delikte bu yarıçaplar 2,95, 4,4 ve 8,9 km olurdu.',
    kaynak: [{ ad: 'Wikipedia, Innermost stable circular orbit', url: 'https://en.wikipedia.org/wiki/Innermost_stable_circular_orbit' }, { ad: 'Wikipedia, Schwarzschild radius', url: 'https://en.wikipedia.org/wiki/Schwarzschild_radius' }],
    ciz(S) {
      const R = S.R, cx = 200, cy = 122, rs = 34;
      let s = '';
      s += S.daire(cx, cy, 3 * rs, { renk: R.iyi, kalin: 2, kesik: '2 4' });
      s += S.daire(cx, cy, 1.5 * rs, { renk: R.vurgu, kalin: 2, kesik: '7 4' });
      s += S.daire(cx, cy, rs, { dolgu: R.zemin, renk: R.metin, kalin: 2 });
      const yar = (k, aci, renk, yazi) => {
        const a = aci * Math.PI / 180, x = cx + k * rs * Math.cos(a), y = cy - k * rs * Math.sin(a);
        return S.cizgi(cx, cy, x, y, { renk: renk, kalin: 1.5 }) + S.daire(x, y, 2.5, { dolgu: renk, renk: 'none' }) +
          S.yazi(x + 10 * Math.cos(a), y - 10 * Math.sin(a) + 5, yazi, { boy: 14, kalin: true, renk: renk, hiza: Math.cos(a) < -0.3 ? 'end' : Math.cos(a) > 0.3 ? 'start' : 'middle' });
      };
      s += S.cizgi(cx, cy, cx, cy + rs, { renk: R.metin, kalin: 1.5 });
      s += S.yazi(cx + 10, cy + 24, '1', { boy: 14, kalin: true, hiza: 'middle' });
      s += yar(1.5, 145, R.vurgu, '1,5');
      s += yar(3, 20, R.iyi, '3');
      s += S.daire(cx, cy, 2.5, { dolgu: R.metin, renk: 'none' });
      const ly = 252;
      s += S.daire(28, ly - 5, 8, { dolgu: R.zemin, renk: R.metin, kalin: 2 }) + S.yazi(46, ly, 'Olay ufku: 1 kat (ışık bile çıkamaz)', { boy: 13 });
      s += S.cizgi(14, ly + 17, 42, ly + 17, { renk: R.vurgu, kalin: 2, kesik: '7 4' }) + S.yazi(46, ly + 22, 'Foton küresi: 1,5 kat (ışık çember çizer)', { boy: 13 });
      s += S.cizgi(14, ly + 39, 42, ly + 39, { renk: R.iyi, kalin: 2, kesik: '2 4' }) + S.yazi(46, ly + 44, 'En içteki kararlı yörünge: 3 kat', { boy: 13 });
      const km = k => S.sayi(k * RS_GUNES_KM, k === 1 ? 2 : 1);
      s += S.yazi(14, ly + 70, 'Güneş kütlesinde: ' + km(1) + ' · ' + km(1.5) + ' · ' + km(3) + ' km', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  C.ekle('d16-civilti', {
    ders: 'd16', bolum: 7, oran: 0.7,
    baslik: 'GW150914 sinyalinin biçimi (şematik)',
    aciklama: 'İki kara delik birbirine yaklaştıkça dalganın hem sıklığı hem genliği artar; buna cıvıltı denir. Birleşmede genlik en büyük değerine, yaklaşık 10⁻²¹\'e ulaşır, sonra yeni kara delik durulurken dalga hızla söner. Sinyal yaklaşık 0,2 saniye sürdü. Çizim şematiktir: dalga sayısı ve biçim gerçek kayıt değildir.',
    kaynak: [{ ad: 'IUCAA, GW150914', url: 'https://www.gw.iucaa.in/news/gw150914/' }, { ad: 'LIGO/Virgo, GW150914 (LIGO-P1500218)', url: 'https://dcc.ligo.org/P1500218/public' }],
    ciz(S) {
      const R = S.R, x0 = 40, w = 344, t0 = -0.21, t1 = 0.04, yc = 150, A = 58;
      const X = t => x0 + (t - t0) / (t1 - t0) * w;
      let s = '';
      /* şematik dalga: dolanmada genlik ∝ τ^-1/4, sıklık ∝ τ^-3/8 (τ birleşmeye kalan süre); sonra üstel sönüm */
      const tc = 0.004, f0 = 35, ls = [];
      const faz = tau => -2 * Math.PI * f0 * Math.pow(0.2, 0.375) * Math.pow(tau, 0.625) / 0.625;
      const fazSon = faz(tc);
      for (let i = 0; i <= 1600; i++) {
        const t = -0.205 + i * (0.245 / 1600);
        let h;
        if (t <= 0) { const tau = tc - t; h = Math.pow(tau / tc, -0.25) * Math.cos(faz(tau) - fazSon); }
        else h = Math.exp(-t / 0.004) * Math.cos(2 * Math.PI * 200 * t);
        ls.push([X(t), yc - A * h]);
      }
      s += S.cizgi(x0, yc, x0 + w, yc, { renk: R.cizgi, kalin: 1 });
      s += S.egri(ls, { renk: R.vurgu, kalin: 1.6 });
      /* zaman ekseni */
      const ay = 226;
      s += S.cizgi(x0, ay, x0 + w, ay, { renk: R.soluk, kalin: 1 });
      [[-0.2, '−0,2'], [-0.1, '−0,1'], [0, '0']].forEach(([t, y]) => { s += S.cizgi(X(t), ay, X(t), ay + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(t), ay + 20, y, { boy: 13, hiza: 'middle', renk: R.soluk }); });
      s += S.yazi(x0 + w / 2, ay + 42, 'zaman (saniye; 0 = birleşme)', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* üst: kara delik simgeleri */
      s += S.daire(X(-0.18) - 14, 38, 5.5, { dolgu: R.metin, renk: 'none' }) + S.daire(X(-0.18) + 14, 38, 5, { dolgu: R.metin, renk: 'none' });
      s += S.daire(X(-0.07) - 7, 38, 5.5, { dolgu: R.metin, renk: 'none' }) + S.daire(X(-0.07) + 7, 38, 5, { dolgu: R.metin, renk: 'none' });
      s += S.daire(X(0.012), 38, 7.5, { dolgu: R.metin, renk: 'none' });
      s += S.yazi(x0, 18, '36 + 29 Güneş kütlesi', { boy: 13, renk: R.soluk });
      s += S.yazi(x0 + w + 6, 18, '62 Güneş kütlesi', { boy: 13, renk: R.soluk, hiza: 'end' });
      s += S.yazi(x0, 70, 'dolanma: sıklık ve genlik artar →', { boy: 13 });
      s += S.yazi(X(0), 70, 'birleşme', { boy: 13, hiza: 'middle', kalin: true });
      s += S.yazi(X(-0.012), 98, 'en büyük ~10⁻²¹', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(x0 + w + 6, 206, 'sönüm', { boy: 13, hiza: 'end' });
      return s;
    }
  });
})();
