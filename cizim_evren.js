/* cizim_evren.js — evren ünitesinin ders çizimleri (cizim.js kayıtları). */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  const lg = Math.log10;

  /* Logaritmik sarmal kol: merkez (x, y), r0'dan R'ye, b sıkılık, a0 başlangıç açısı (radyan) */
  function sarmal(S, x, y, r0, R, b, a0, o) {
    const tmax = Math.log(R / r0) / b, ls = [];
    for (let i = 0; i <= 60; i++) { const t = tmax * i / 60, r = r0 * Math.exp(b * t); ls.push([x + r * Math.cos(a0 + t), y + r * Math.sin(a0 + t)]); }
    return S.egri(ls, o);
  }

  /* ===================== d7 · Galaksiler ===================== */

  /* d7 · bölüm 2: Samanyolu üstten ve yandan. Çap ≈100.000 ışık yılı (NASA), Güneş merkezden ≈27.000 ışık yılı (ESO 2021),
     ince disk 700–1.500 ışık yılı (Wikipedia). Üst görünümde kollar, çubuk ve şişkinlik şematik; uzaklıklar ve yandan kalınlık ölçekli. */
  C.ekle('d7-samanyolu', {
    ders: 'd7', bolum: 2, oran: 1.0,
    baslik: 'Samanyolu üstten ve yandan; Güneş\'in yeri',
    aciklama: 'Üstte galaksiyi tepeden görürsün: Güneş merkezden yaklaşık 27.000 ışık yılı uzakta, diskin yarıçapının kabaca yarısında, Orion Kolu\'nda. Altta aynı disk yandan: yaklaşık 100.000 ışık yılı genişliğe karşı kalınlığı en çok 1.500 ışık yılı, bu yüzden çizgi gibi ince. Kolların, çubuğun ve şişkinliğin biçimi şematik; uzaklıklar ve kalınlık ölçeklidir.',
    kaynak: [
      { ad: 'NASA Science, Galaxies', url: 'https://science.nasa.gov/universe/galaxies/' },
      { ad: 'Wikipedia, Milky Way', url: 'https://en.wikipedia.org/wiki/Milky_Way' },
      { ad: 'ESO eso2119 (2021)', url: 'https://www.eso.org/public/news/eso2119/' }
    ],
    ciz(S) {
      const R = S.R, cx = 200, cy = 160, k = 125 / 50000;      // 50.000 ışık yılı = 125 birim
      const rg = 27000 * k;
      let s = '';
      s += S.yazi(8, 18, 'Üstten (kollar şematik)', { boy: 13, renk: R.soluk });
      s += S.daire(cx, cy, 125, { dolgu: R.yuzey2, renk: R.cizgi, kalin: 1, saydam: 0.7 });
      /* kollar: çubuk uçlarından iki ana, araya iki ikincil */
      const ca = -0.45;
      [[0, 1.6, 0.9], [Math.PI, 1.6, 0.9], [Math.PI / 2, 1.1, 0.5], [3 * Math.PI / 2, 1.1, 0.5]].forEach(([d, kal, sy]) => {
        s += sarmal(S, cx, cy, 28, 122, 0.27, ca + d, { renk: R.soluk, kalin: kal * 3, saydam: sy * 0.6, uc: 'round' });
      });
      s += S.elips(cx, cy, 30, 9, { dolgu: R.yildiz, renk: 'none', saydam: 0.55 }, ca * 180 / Math.PI);
      s += S.daire(cx, cy, 13, { dolgu: R.yildiz, renk: 'none', saydam: 0.7 });
      /* Güneş ve uzaklık */
      const gx = cx, gy = cy + rg;
      s += S.cizgi(cx, cy, gx, gy, { renk: R.vurgu, kalin: 1.5, kesik: '4 3' });
      s += S.yol(`M${gx - 30},${gy + 16} Q${gx - 4},${gy + 6} ${gx + 22},${gy - 14}`, { renk: R.vurgu, kalin: 4, saydam: 0.45, uc: 'round' });
      s += S.daire(gx, gy, 5, { dolgu: R.gunes, renk: R.zemin, kalin: 1.5 });
      const etk = (x, y, metin, o) => {
        const w = metin.length * 6.4 + 8, x0 = o.hiza === 'end' ? x - w + 4 : x - 4;
        return S.kutu(x0, y - 13, w, 18, { dolgu: R.zemin, renk: 'none', saydam: 0.78 }, 3) + S.yazi(x, y, metin, Object.assign({ boy: 13 }, o));
      };
      s += etk(gx + 12, gy - 3, 'Güneş', { renk: R.metin, kalin: true });
      s += etk(gx - 34, gy + 27, 'Orion Kolu', { hiza: 'end', renk: R.vurgu });
      s += etk(cx + 10, cy + rg / 2 + 9, '27.000 ışık yılı', { renk: R.vurgu });
      s += etk(cx + 20, cy - 17, 'merkez, Yay A*', { renk: R.metin });
      /* yandan, ölçekli kalınlık */
      const ey = 345, rx = 125;
      s += S.yazi(8, 305, 'Yandan (kalınlık ölçekli)', { boy: 13, renk: R.soluk });
      s += S.elips(cx, ey, 22, 12, { dolgu: R.yildiz, renk: 'none', saydam: 0.45 });
      s += S.elips(cx, ey, rx, 1500 / 2 * k, { dolgu: R.yildiz, renk: 'none', saydam: 0.9 });
      s += S.daire(cx - rg, ey, 3.5, { dolgu: R.gunes, renk: R.zemin, kalin: 1 });
      s += S.yazi(cx - rg, ey - 10, 'Güneş', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(392, 328, 'ince disk: 700–1.500 ışık yılı', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.ok(cx, 372, cx - rx, 372, { renk: R.soluk, kalin: 1, boy: 7 }) + S.ok(cx, 372, cx + rx, 372, { renk: R.soluk, kalin: 1, boy: 7 });
      s += S.yazi(cx, 392, '≈100.000 ışık yılı', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d7 · bölüm 3: Hubble ayar çatalı, şematik. Eliptik basıklığı E = 10 × (1 − b/a): E3 → b/a = 0,7; E7 → 0,3 (Swinburne COSMOS). */
  C.ekle('d7-hubble-catal', {
    ders: 'd7', bolum: 3, oran: 0.68,
    baslik: 'Hubble\'ın ayar çatalı',
    aciklama: 'Solda sapta eliptikler yuvarlak E0\'dan basık E7\'ye dizilir; çatalın ayrıldığı yerde kolsuz, diskli lentiküler S0 durur. Üst kolda sarmallar Sa\'dan Sc\'ye, alt kolda çubuklu sarmallar SBa\'dan SBc\'ye gider: kollar gevşer, şişkinlik küçülür. Düzensizler çatalın dışındadır. Bu bir evrim sırası değildir; çizim şematiktir.',
    kaynak: [
      { ad: 'Wikipedia, Hubble sequence', url: 'https://en.wikipedia.org/wiki/Hubble_sequence' },
      { ad: 'ESA/Hubble heic9902o, The Hubble tuning fork', url: 'https://esahubble.org/images/heic9902o/' },
      { ad: 'Swinburne COSMOS – Hubble Classification', url: 'https://astronomy.swinburne.edu.au/cosmos/H/Hubble+Classification' }
    ],
    ciz(S) {
      const R = S.R, sy = 120, uy = 58, ay = 186, a = 19;
      const dol = { dolgu: R.yildiz, renk: 'none', saydam: 0.8 };
      let s = '';
      /* çatal çizgileri */
      s += S.cizgi(40, sy, 205, sy, { renk: R.cizgi, kalin: 2 });
      s += S.yol(`M205,${sy} L240,${uy} L380,${uy} M205,${sy} L240,${ay} L380,${ay}`, { renk: R.cizgi, kalin: 2 });
      /* eliptikler */
      [[42, 'E0', 0], [96, 'E3', 3], [150, 'E7', 7]].forEach(([x, ad, n]) => {
        s += S.elips(x, sy, a, a * (1 - n / 10), dol);
        s += S.yazi(x, sy + 38, ad, { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      });
      /* lentiküler */
      s += S.elips(205, sy, 23, 6, dol) + S.elips(205, sy, 9, 7, { dolgu: R.yildiz, renk: 'none', saydam: 0.9 });
      s += S.yazi(205, sy + 38, 'S0', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(205, sy + 55, 'lentiküler', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(96, sy + 55, 'eliptik', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* sarmallar: [şişkinlik, sıkılık] */
      const tur = [[7, 0.17, 0.12], [5, 0.3, 0.2], [3, 0.55, 0.35]];
      ['a', 'b', 'c'].forEach((h, i) => {
        const x = 262 + i * 54, [sb, b, bc] = tur[i];
        /* düz sarmal */
        s += S.daire(x, uy, a + 1, { dolgu: R.zemin, renk: 'none' });
        s += sarmal(S, x, uy, sb, a, b, 0, { renk: R.yildiz, kalin: 2, saydam: 0.85, uc: 'round' }) + sarmal(S, x, uy, sb, a, b, Math.PI, { renk: R.yildiz, kalin: 2, saydam: 0.85, uc: 'round' });
        s += S.daire(x, uy, sb, { dolgu: R.yildiz, renk: 'none' });
        s += S.yazi(x, uy - 28, 'S' + h, { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
        /* çubuklu sarmal */
        const cb = 10;
        s += S.daire(x, ay, a + 1, { dolgu: R.zemin, renk: 'none' });
        s += S.cizgi(x - cb, ay, x + cb, ay, { renk: R.yildiz, kalin: 4, uc: 'round' });
        s += sarmal(S, x, ay, cb, a, bc, 0, { renk: R.yildiz, kalin: 2, saydam: 0.85, uc: 'round' }) + sarmal(S, x, ay, cb, a, bc, Math.PI, { renk: R.yildiz, kalin: 2, saydam: 0.85, uc: 'round' });
        s += S.daire(x, ay, sb * 0.8, { dolgu: R.yildiz, renk: 'none' });
        s += S.yazi(x, ay + 37, 'SB' + h, { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      });
      s += S.yazi(230, uy + 5, 'sarmal', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(232, ay + 30, 'çubuklu', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(382, 254, 'kollar gevşer →', { boy: 13, hiza: 'end', renk: R.soluk });
      /* düzensiz */
      s += S.yol('M30,236 Q40,222 52,230 Q64,226 60,240 Q66,252 50,250 Q38,258 32,248 Q22,244 30,236 Z', { dolgu: R.yildiz, renk: 'none', saydam: 0.55 });
      s += S.daire(44, 238, 2.5, { dolgu: R.yildiz, renk: 'none' }) + S.daire(54, 246, 2, { dolgu: R.yildiz, renk: 'none' });
      s += S.yazi(74, 244, 'düzensiz:', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(74, 260, 'çatalın dışında', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d7 · bölüm 4: Yerel Grup, Samanyolu'ndan uzaklıklar tek doğru üzerinde (gökteki yönler farklı). Uzaklık ve çaplar ölçekli:
     Andromeda 2,5 milyon (çap 152.000), Üçgen 2,88 milyon (çap 61.100), Samanyolu çapı ≈100.000; Macellan Bulutları 160–200 bin (boyları şematik). */
  C.ekle('d7-yerel-grup', {
    ders: 'd7', bolum: 4, oran: 0.52,
    baslik: 'Yerel Grup: Samanyolu\'ndan uzaklıklar',
    aciklama: 'Galaksiler Samanyolu\'ndan uzaklıklarına göre tek bir çizgiye dizildi; gökte aslında farklı yönlerdedirler. Macellan Bulutları 160.000 ile 200.000 ışık yılında hemen yanımızda, Andromeda 2,5 milyon, Üçgen Galaksisi 2,88 milyon ışık yılı ötede. Uzaklıklar ve büyük galaksilerin çapları ölçekli; Macellan Bulutlarının boyu şematik. Grubun bütün çapı, yaklaşık 17 milyon ışık yılı, bu çizginin altı katına yakındır.',
    kaynak: [
      { ad: 'Wikipedia, Local Group', url: 'https://en.wikipedia.org/wiki/Local_Group' },
      { ad: 'Wikipedia, Andromeda Galaxy', url: 'https://en.wikipedia.org/wiki/Andromeda_Galaxy' },
      { ad: 'Wikipedia, Triangulum Galaxy', url: 'https://en.wikipedia.org/wiki/Triangulum_Galaxy' },
      { ad: 'Sky at Night Magazine, Magellanic Clouds', url: 'https://www.skyatnightmagazine.com/news/large-small-magellanic-clouds' },
      { ad: 'NASA Science, Galaxies', url: 'https://science.nasa.gov/universe/galaxies/' }
    ],
    ciz(S) {
      const R = S.R, x0 = 30, k = 350 / 3e6, X = d => x0 + d * k, gy = 70;
      let s = '';
      s += S.cizgi(x0, gy, X(3e6), gy, { renk: R.cizgi, kalin: 1, kesik: '3 4' });
      const gal = (d, cap, renk) => S.elips(X(d), gy, cap * k / 2, cap * k / 2 * 0.45, { dolgu: renk, renk: 'none', saydam: 0.9 }, -20);
      s += gal(0, 100000, R.yildiz);
      s += S.daire(X(160000), gy + 3, 2.6, { dolgu: R.yildiz, renk: 'none' }) + S.daire(X(200000), gy - 3, 2, { dolgu: R.yildiz, renk: 'none' });
      s += gal(2.5e6, 152000, R.yildiz);
      s += gal(2.88e6, 61100, R.yildiz);
      s += S.yazi(x0 - 4, 48, 'Samanyolu', { boy: 13, renk: R.metin, kalin: true });
      s += S.yol(`M${X(180000)},${gy + 6} L${X(180000) + 8},${gy + 16}`, { renk: R.soluk, kalin: 1 });
      s += S.yazi(X(180000) + 10, gy + 28, 'Macellan Bulutları', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(X(180000) + 10, gy + 44, '160–200 bin ışık yılı', { boy: 13, renk: R.soluk });
      s += S.yazi(X(2.5e6), 38, 'Andromeda', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(X(2.5e6), 54, '2,5 milyon', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yol(`M${X(2.88e6)},${gy + 6} L${X(2.88e6) - 2},${gy + 15}`, { renk: R.soluk, kalin: 1 });
      s += S.yazi(392, gy + 28, 'Üçgen (M33)', { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(392, gy + 44, '2,88 milyon', { boy: 13, hiza: 'end', renk: R.soluk });
      /* eksen */
      const ay = 134;
      s += S.cizgi(x0, ay, X(3e6), ay, { renk: R.soluk, kalin: 1 });
      [0, 1, 2, 3].forEach(m => { s += S.cizgi(X(m * 1e6), ay, X(m * 1e6), ay + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(m * 1e6), ay + 20, String(m), { boy: 13, hiza: 'middle', renk: R.soluk }); });
      s += S.yazi(X(1.5e6), ay + 40, 'Samanyolu\'ndan uzaklık (milyon ışık yılı)', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(X(1.5e6), ay + 64, 'Grubun çapı ≈17 milyon ışık yılı: bu çizginin ≈6 katı', { boy: 13, hiza: 'middle', renk: R.vurgu });
      return s;
    }
  });

  /* ===================== d8 · Evrenin tarihi ===================== */

  /* d8 · bölüm 2: zaman çizelgesi, logaritmik zaman ekseni (saniye). 1 yıl = 3,156×10⁷ s (ders). Değerler ders metninden. */
  C.ekle('d8-zaman-cizelgesi', {
    ders: 'd8', bolum: 2, oran: 1.14,
    baslik: 'Evrenin zaman çizelgesi (logaritmik)',
    aciklama: 'Zaman yukarıdan aşağı akar ve her eşit aralık on kat demektir; bu yüzden ilk saniyenin kesirleri çizginin yarısından fazlasını kaplar. Şişme saniyenin 10 üzeri eksi 33\'te, protonlar ve nötronlar 10 üzeri eksi 5 saniyede, ilk çekirdekler 10 ile 1000 saniye arasında oluşur. Yeniden birleşme yaklaşık 380.000 yılda, ilk yıldızlar birkaç yüz milyon yılda; bugün 13,8 milyar yıl.',
    kaynak: [
      { ad: 'Wikipedia, Chronology of the universe', url: 'https://en.wikipedia.org/wiki/Chronology_of_the_universe' },
      { ad: 'Wikipedia, Recombination (cosmology)', url: 'https://en.wikipedia.org/wiki/Recombination_(cosmology)' },
      { ad: 'Planck 2018 VI, arXiv:1807.06209', url: 'https://arxiv.org/abs/1807.06209' },
      { ad: 'MoM-z14, arXiv:2505.11263', url: 'https://arxiv.org/abs/2505.11263v2' }
    ],
    ciz(S) {
      const R = S.R, ax = 96, yil = 3.156e7, Y = L => 30 + (L + 34) / 52 * 400, Ly = y => lg(y * yil);
      let s = '';
      s += S.yazi(8, 16, 'Büyük Patlama\'dan sonra geçen zaman', { boy: 13, renk: R.soluk });
      s += S.cizgi(ax, Y(-34), ax, Y(Ly(13.8e9)), { renk: R.soluk, kalin: 2 });
      [[-32, '10⁻³² s'], [-22, '10⁻²² s'], [-12, '10⁻¹² s'], [0, '1 s'], [Ly(1), '1 yıl'], [Ly(1e9), '1 milyar yıl']].forEach(([L, t]) => {
        s += S.cizgi(ax - 5, Y(L), ax, Y(L), { renk: R.soluk, kalin: 1 }) + S.yazi(ax - 9, Y(L) + 4, t, { boy: 13, hiza: 'end', renk: R.soluk });
      });
      const bar = (a, b, renk) => S.cizgi(ax, Y(a), ax, Y(b), { renk, kalin: 7 });
      const nokta = (L, renk) => S.daire(ax, Y(L), 4.5, { dolgu: renk, renk: R.zemin, kalin: 1.5 });
      const etiket = (L, ly, metin, renk, uz) => { const d = uz || 0; return S.yol(`M${ax + 6},${Y(L)} L${ax + 12 + d / 3},${Y(L)} L${ax + 18 + d},${ly - 4}`, { renk: R.soluk, kalin: 1 }) + S.yazi(ax + 22 + d, ly, metin, { boy: 13, renk: renk || R.metin }); };
      s += bar(-33, -32, R.vurgu) + etiket(-32.5, 46, 'Şişme: 10⁻³³–10⁻³² s, en az 10²⁶ kat');
      s += bar(-12, -5, R.mavi) + etiket(-8.5, 228, 'Kuark çağı: 10⁻¹²–10⁻⁵ s');
      s += nokta(-5, R.metin) + etiket(-5, 257, 'Proton ve nötronlar: 10⁻⁵ s, 10¹² K');
      s += nokta(0, R.metin) + etiket(0, 288, 'Nötrinolar serbest: 1 s, 10 milyar K');
      s += bar(1, 3, R.iyi) + etiket(2, 312, 'İlk çekirdekler: 10–1000 s');
      s += nokta(Ly(47000), R.metin) + etiket(Ly(47000), 338, 'Madde baskın: ≈47.000 yıl', null, 30);
      s += bar(Ly(380000), Ly(3e8), R.zemin);
      s += S.cizgi(ax, Y(Ly(380000)), ax, Y(Ly(3e8)), { renk: R.soluk, kalin: 1 });
      s += nokta(Ly(380000), R.vurgu) + etiket(Ly(380000), 356, 'Yeniden birleşme: ≈380.000 yıl, ≈3000 K', R.vurgu, 30);
      s += etiket((Ly(380000) + Ly(3e8)) / 2, 374, 'Karanlık çağ: henüz yıldız yok', R.soluk, 30);
      s += nokta(Ly(2.8e8), R.mavi) + etiket(Ly(2.8e8), 392, 'MoM-z14 galaksisi: ≈280 milyon yıl', null, 30);
      s += etiket(Ly(3e8), 410, 'İlk yıldızlar: birkaç yüz milyon yıl', null, 30);
      s += bar(Ly(2e8), Ly(1e9), R.iyi) + etiket((Ly(2e8) + Ly(1e9)) / 2, 428, 'Yeniden iyonlaşma: 0,2–1 milyar yıl', null, 30);
      s += nokta(Ly(13.8e9), R.metin) + etiket(Ly(13.8e9), 446, 'Bugün: 13,8 milyar yıl', null, 30);
      return s;
    }
  });

  /* d8 · bölüm 4: arka plan ışımasının sıcaklığı T = T0 × (1 + z), T0 = 2,725 K (ders). Log-log, hesaplanmış. */
  C.ekle('d8-arka-plan-sicaklik', {
    ders: 'd8', bolum: 4, oran: 0.69,
    baslik: 'Evren büyüdükçe arka plan ışıması soğur',
    aciklama: 'Arka plan ışımasının sıcaklığı, evrenin o andan bu yana büyüme katıyla orantılıdır. Bugün 2,725 kelvin; MoM-z14\'ün çağında, evren 15,44 kat küçükken yaklaşık 42 kelvin; yeniden birleşmede, 1091 kat küçükken yaklaşık 2973 kelvin. İki eksen de logaritmiktir, bu yüzden ilişki düz bir çizgi olur.',
    kaynak: [
      { ad: 'Fixsen 2009, arXiv:0911.1955', url: 'https://arxiv.org/abs/0911.1955' },
      { ad: 'Planck 2018 VI, arXiv:1807.06209', url: 'https://arxiv.org/abs/1807.06209' }
    ],
    ciz(S) {
      const R = S.R, T0 = 2.725;
      const ek = S.eksen({ x: 72, y: 30, w: 300, h: 190 }, { x0: 1, x1: 2000, y0: 1, y1: 10000 }, {
        logX: true, logY: true,
        xIsaret: [[1, '1'], [10, '10'], [100, '100'], [1000, '1000']],
        yIsaret: [[1, '1'], [10, '10'], [100, '100'], [1000, '1000'], [10000, '10⁴']],
        xAd: '1 + z: o zamandan beri büyüme katı'
      });
      let s = ek.svg + S.yazi(20, 18, 'sıcaklık (K)', { boy: 13, renk: R.soluk });
      [10, 100, 1000].forEach(v => { s += S.cizgi(ek.X(v), 30, ek.X(v), 220, { renk: R.cizgi, kalin: 1 }) + S.cizgi(72, ek.Y(v), 372, ek.Y(v), { renk: R.cizgi, kalin: 1 }); });
      s += S.fonk(ek, x => T0 * x, 1, 2000, 40, { renk: R.vurgu, kalin: 2.2 }, true);
      const p = (x, renk) => S.daire(ek.X(x), ek.Y(T0 * x), 5, { dolgu: renk, renk: R.zemin, kalin: 1.5 });
      s += p(1, R.mavi) + S.yazi(ek.X(1) + 12, ek.Y(T0) + 14, 'bugün: 2,725 K', { boy: 13, renk: R.metin });
      s += p(15.44, R.mavi) + S.yazi(ek.X(15.44) + 9, ek.Y(T0 * 15.44) + 18, 'MoM-z14: 15,44 kat, ≈42 K', { boy: 13, renk: R.metin });
      s += p(1091, R.uyari) + S.yazi(372, ek.Y(T0 * 1091) + 58, 'yeniden birleşme:', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(372, ek.Y(T0 * 1091) + 74, '1091 kat, ≈2973 K', { boy: 13, hiza: 'end', renk: R.metin });
      return s;
    }
  });

  /* ===================== d17 · Kozmoloji ===================== */

  /* d17 · bölüm 3: uzaklık merdiveni. Üst uçlar ders metninden (Astronomy.com): ıraklık birkaç on bin, Sefeid ≈50 milyon, Ia ≈10 milyar ışık yılı ve ötesi.
     Çubukların başlangıçları ve örtüşmeleri şematik. Başvuru çizgileri: Samanyolu ≈100.000 (d7), Andromeda 2,5 milyon, Başak ≈50 milyon. */
  C.ekle('d17-uzaklik-merdiveni', {
    ders: 'd17', bolum: 3, oran: 0.7,
    baslik: 'Uzaklık merdiveni: basamaklar ve menzilleri',
    aciklama: 'Yatay eksen logaritmik: her çentik bin kat. Iraklık birkaç on bin ışık yılına, Sefeidler yaklaşık 50 milyon ışık yılına, yani Başak Kümesi\'ne, Ia süpernovaları 10 milyar ışık yılına ve ötesine ulaşır. Her basamak bir alttakiyle örtüştüğü yerde ayarlanır. Çubukların üst uçları dersteki menzillerdir, başlangıçları şematiktir.',
    kaynak: [
      { ad: 'Astronomy.com, The cosmic distance ladder', url: 'https://www.astronomy.com/science/the-cosmic-distance-ladder-how-we-measure-an-infinite-universe/' },
      { ad: 'ESA/Hubble heic1611a (2016)', url: 'https://esahubble.org/images/heic1611a/' }
    ],
    ciz(S) {
      const R = S.R, px = 100, pw = 285, X = v => px + lg(v) / 10.5 * pw;
      let s = '';
      /* başvuru çizgileri */
      [[1e5, 'Samanyolu çapı', 18, 'end', -3], [2.5e6, 'Andromeda', 18, 'start', 3], [5e7, 'Başak Kümesi', 36, 'start', 3]].forEach(([v, ad, y, h, dx]) => {
        s += S.cizgi(X(v), y + 6, X(v), 222, { renk: R.soluk, kalin: 1, kesik: '2 4' });
        s += S.yazi(X(v) + dx, y, ad, { boy: 13, hiza: h, renk: R.soluk });
      });
      const basamak = (y, ad, metin, a, a2, b, b2, renk) => {
        let o = S.yazi(8, y + 12, ad, { boy: 13, renk: R.metin, kalin: true });
        o += S.yazi(px, y - 6, metin, { boy: 13, renk: renk });
        if (a2 > a) o += S.kutu(X(a), y, X(a2) - X(a), 14, { dolgu: 'none', renk: renk, kalin: 1.2, kesik: '3 3' }, 3);
        o += S.kutu(X(a2), y, X(b) - X(a2), 14, { dolgu: renk, renk: renk, saydam: 0.85 }, 3);
        if (b2 > b) o += S.kutu(X(b), y, X(b2) - X(b), 14, { dolgu: 'none', renk: renk, kalin: 1.2, kesik: '3 3' }, 3);
        return o;
      };
      s += basamak(66, 'Iraklık', 'birkaç on bin ışık yılına kadar', 1, 1, 1e4, 1e5, R.iyi);
      s += S.yazi(14, 106, '↓ ayarlar', { boy: 13, renk: R.soluk });
      s += basamak(134, 'Sefeidler', '≈50 milyon ışık yılına kadar', 1e3, 1e4, 5e7, 5e7, R.vurgu);
      s += S.yazi(14, 174, '↓ ayarlar', { boy: 13, renk: R.soluk });
      s += basamak(202, 'Ia süpernova', '≈10 milyar ışık yılı ve ötesi', 1e7, 5e7, 1e10, 1e10, R.mavi);
      s += S.ok(X(1e10), 209, 396, 209, { renk: R.mavi, kalin: 2, boy: 7 });
      /* eksen */
      const ay = 230;
      s += S.cizgi(px, ay, px + pw, ay, { renk: R.soluk, kalin: 1 });
      [[1, '1'], [1e3, '1.000'], [1e6, '1 milyon'], [1e9, '1 milyar']].forEach(([v, t]) => {
        s += S.cizgi(X(v), ay, X(v), ay + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(v), ay + 20, t, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.yazi(px + pw / 2, ay + 42, 'uzaklık (ışık yılı, logaritmik)', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d17 · bölüm 7: evrenin bileşimi, Planck 2018 (ders örneğinde hesaplanan yüzdeler: 4,9 / 26,4 / 68,5). */
  C.ekle('d17-bilesim', {
    ders: 'd17', bolum: 7, oran: 0.64,
    baslik: 'Evrenin bileşimi: Planck 2018',
    aciklama: 'Halkanın yaklaşık yüzde 68,5\'i karanlık enerji, yüzde 26,4\'ü karanlık madde, yalnızca yüzde 4,9\'u yıldızlar, gezegenler, gaz ve bizden oluşan sıradan madde. Toplam 99,8 eder; kalan küçük boşluk modeldeki öteki küçük bileşenlerden ve yuvarlamadan gelir. NASA yuvarlak olarak yüzde 68, 27 ve 5 kullanır.',
    kaynak: [
      { ad: 'Planck 2018 VI tam metin (Tablo 2)', url: 'https://arxiv.org/pdf/1807.06209v4' },
      { ad: 'NASA Science, Dark Matter & Dark Energy', url: 'https://science.nasa.gov/universe/dark-matter-dark-energy/' }
    ],
    ciz(S) {
      const R = S.R, cx = 112, cy = 128, r1 = 48, r2 = 96;
      const p = (r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
      const dilim = (a0, a1, renk) => {
        const b = a1 - a0 > 180 ? 1 : 0, [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0);
        return S.yol(`M${x1},${y1} A${r2},${r2} 0 ${b} 1 ${x2},${y2} L${x3},${y3} A${r1},${r1} 0 ${b} 0 ${x4},${y4} Z`, { dolgu: renk, renk: R.zemin, kalin: 2 });
      };
      const dl = [[68.5, R.mavi, 'Karanlık enerji'], [26.4, R.vurgu, 'Karanlık madde'], [4.9, R.gezegen, 'Sıradan madde']];
      let s = '', a = 0;
      const orta = [];
      dl.forEach(([y, renk]) => { const b = a + y * 3.6; s += dilim(a, b, renk); orta.push((a + b) / 2); a = b; });
      const t = (ai, metin, r) => { const [x, y] = p(r, orta[ai]); return S.yazi(x, y + 5, metin, { boy: 13, hiza: 'middle', renk: R.zemin, kalin: true }); };
      s += t(0, '%68,5', (r1 + r2) / 2) + t(1, '%26,4', (r1 + r2) / 2);
      const [ex, ey] = p(r2 + 4, orta[2]), [lx, ly] = p(r2 + 14, orta[2]);
      s += S.cizgi(ex, ey, lx, ly, { renk: R.soluk, kalin: 1 }) + S.yazi(lx - 2, ly - 2, '%4,9', { boy: 14, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(cx, cy - 2, 'Planck', { boy: 13, hiza: 'middle', renk: R.soluk }) + S.yazi(cx, cy + 14, '2018', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* açıklama kutuları */
      dl.forEach(([y, renk, ad], i) => {
        const ly = 70 + i * 46;
        s += S.kutu(228, ly - 12, 14, 14, { dolgu: renk, renk: 'none' }, 2);
        s += S.yazi(250, ly, ad, { boy: 14, renk: R.metin, kalin: true });
        s += S.yazi(250, ly + 18, '%' + String(y).replace('.', ','), { boy: 13, renk: R.soluk });
      });
      s += S.yazi(200, 246, 'NASA\'nın yuvarlak değerleri: %68, %27, %5', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d17 · bölüm 8: Hubble diyagramı, v = H0 × d; Planck 2018 67,4 ve SH0ES 2022 73,04 km/s/Mpc (ders). 100 Mpc'de 6740 ve 7304 km/s (hesap). */
  C.ekle('d17-hubble-diyagrami', {
    ders: 'd17', bolum: 8, oran: 0.68,
    baslik: 'Hubble diyagramı: iki eğim, iki sonuç',
    aciklama: 'Uzaklaşma hızı uzaklıkla doğru orantılı artar; eğim Hubble sabitidir. Planck\'ın erken evren değeri 67,4, uzaklık merdiveninin değeri 73,04 km/s/Mpc. 100 megaparsekte biri 6740, öteki 7304 km/s verir: fark 564 km/s, yaklaşık yüzde 8. Doğrular hesaplanmıştır, ölçüm noktası değildir.',
    kaynak: [
      { ad: 'Wikipedia, Hubble\'s law (Hubble tension bölümü)', url: 'https://en.wikipedia.org/wiki/Hubble%27s_law' },
      { ad: 'Planck 2018 VI, arXiv:1807.06209', url: 'https://arxiv.org/abs/1807.06209' }
    ],
    ciz(S) {
      const R = S.R, hp = 67.4, hs = 73.04;
      const ek = S.eksen({ x: 80, y: 30, w: 288, h: 185 }, { x0: 0, x1: 120, y0: 0, y1: 9000 }, {
        xIsaret: [[0, '0'], [40, '40'], [80, '80'], [120, '120']],
        yIsaret: [[0, '0'], [3000, '3.000'], [6000, '6.000'], [9000, '9.000']],
        xAd: 'uzaklık (Mpc)'
      });
      let s = ek.svg + S.yazi(10, 18, 'uzaklaşma hızı (km/s)', { boy: 13, renk: R.soluk });
      [3000, 6000, 9000].forEach(v => { s += S.cizgi(80, ek.Y(v), 368, ek.Y(v), { renk: R.cizgi, kalin: 1 }); });
      s += S.fonk(ek, d => hs * d, 0, 120, 2, { renk: R.vurgu, kalin: 2.4 });
      s += S.fonk(ek, d => hp * d, 0, 120, 2, { renk: R.mavi, kalin: 2.4, kesik: '7 5' });
      /* gösterge */
      s += S.cizgi(92, 48, 118, 48, { renk: R.vurgu, kalin: 2.4 }) + S.yazi(124, 53, 'SH0ES: 73,04 ± 1,04', { boy: 13, renk: R.metin });
      s += S.cizgi(92, 70, 118, 70, { renk: R.mavi, kalin: 2.4, kesik: '7 5' }) + S.yazi(124, 75, 'Planck: 67,4 ± 0,5', { boy: 13, renk: R.metin });
      /* 100 Mpc karşılaştırması */
      const x = ek.X(100);
      s += S.cizgi(x, ek.Y(0), x, ek.Y(hs * 100) - 4, { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.daire(x, ek.Y(hs * 100), 4, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 }) + S.daire(x, ek.Y(hp * 100), 4, { dolgu: R.mavi, renk: R.zemin, kalin: 1.2 });
      s += S.yazi(x - 6, ek.Y(hs * 100) - 7, '7.304', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(x + 7, ek.Y(hp * 100) + 17, '6.740', { boy: 13, renk: R.metin });
      s += S.yazi(366, 203, '100 Mpc\'de fark ≈ 564 km/s (%8)', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });
})();
