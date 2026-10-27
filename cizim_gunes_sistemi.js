/* cizim_gunes_sistemi.js — gunes_sistemi ünitesinin ders çizimleri (cizim.js kayıtları).
   Dersler: d3 (Kepler, Newton, gelgit, Lagrange), d9 (gezegenler), d10 (Ay), d19 (küçük cisimler).
   Sayılar: ders metinlerinden (arastirma/dersler_v2/dNN.json, kaynakları dNN_kaynak.md) ya da formülle hesaplanır. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  const rad = Math.PI / 180;
  const v = (x, b) => x.toFixed(b || 0).replace('.', ',');                                                  // Türkçe ondalık (sabit hane)
  const nk = p => p.map(q => q[0].toFixed(2) + ',' + q[1].toFixed(2)).join(' ');                             // polygon noktaları

  /* Kepler denklemi: E − e·sin E = M (Newton yöntemi) */
  function kepE(M, e) { let E = M; for (let i = 0; i < 30; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; }

  /* Dünya'dan görünen Ay evresi simgesi: θ uzanım (derece, 0 = yeni ay, 180 = dolunay), kuzey yarımküre:
     büyürken (0–180) sağ yan, küçülürken (180–360) sol yan aydınlık. Aydınlık kesir k = (1 − cos θ)/2 */
  function evreSimge(S, x, y, r, teta) {
    const R = S.R, s = teta % 360 <= 180 ? 1 : -1, c = Math.cos(teta * rad), p = [];
    let o = S.daire(x, y, r, { renk: R.soluk, kalin: 1, dolgu: R.yuzey2 });
    for (let i = 0; i <= 24; i++) { const u = Math.PI * i / 24; p.push([x + s * r * Math.sin(u), y - r * Math.cos(u)]); }
    for (let i = 24; i >= 0; i--) { const u = Math.PI * i / 24; p.push([x + s * r * c * Math.sin(u), y - r * Math.cos(u)]); }
    if (Math.abs(1 - c) > 1e-6) o += `<polygon points="${nk(p)}" fill="${R.ay}"/>`;
    return o;
  }
  /* Yarısı (Güneş yönü) aydınlık cisim; yon = Güneş'e doğru açı (derece, matematik yönü) */
  function yariAydinlik(S, x, y, r, yon, renk) {
    const R = S.R, p = [];
    for (let i = 0; i <= 24; i++) { const a = (yon - 90 + 180 * i / 24) * rad; p.push([x + r * Math.cos(a), y - r * Math.sin(a)]); }
    return S.daire(x, y, r, { renk: R.soluk, kalin: 1, dolgu: R.yuzey2 }) + `<polygon points="${nk(p)}" fill="${renk || R.ay}"/>`;
  }
  /* Bir dış noktadan çembere teğet değme noktası (yan: +1 / −1) */
  function teget(cx, cy, r, ax, ay, yan) {
    const d = Math.hypot(ax - cx, ay - cy), f = Math.atan2(ay - cy, ax - cx), b = Math.acos(r / d);
    return [cx + r * Math.cos(f + yan * b), cy + r * Math.sin(f + yan * b)];
  }

  /* ================= d3 — Kepler, gelgit, Lagrange ================= */

  C.ekle('d3-elips-alan', {
    ders: 'd3', bolum: 1, oran: 0.8,
    baslik: 'Elips yörünge ve eşit alanlar',
    aciklama: 'Güneş elipsin merkezinde değil, iki odağından birinde durur; öbür odak boştur. Gezegen Güneş\'e en yakın noktada, günberide, hızlı; en uzak noktada, günötede, yavaş gider. İki renkli dilim aynı sürede taranır ve alanları eşittir: günberideki dilim kısa ve geniş, günötedeki uzun ve dardır. Basıklık abartıldı; Dünya\'nın dış merkezliği yalnızca 0,0167\'dir.',
    kaynak: [{ ad: 'NASA Science – Orbits and Kepler\'s Laws', url: 'https://science.nasa.gov/resource/orbits-and-keplers-laws/' },
      { ad: 'Wikipedia – Kepler\'s laws of planetary motion', url: 'https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion' }],
    ciz(S) {
      const R = S.R, cx = 196, cy = 128, a = 140, e = 0.6, b = a * Math.sqrt(1 - e * e), c = a * e;
      const gx = cx + c, bx = cx - c;                                   // Güneş (sağ odak), boş odak
      const nokta = E => [cx + a * Math.cos(E), cy - b * Math.sin(E)];
      /* aynı süreye (dönemin 1/12'si) karşılık gelen dilimler: ortalama anomali aralıkları eşit */
      const dilim = (M0) => { const p = [[gx, cy]]; const dM = 2 * Math.PI / 12; for (let i = 0; i <= 30; i++) p.push(nokta(kepE(M0 - dM / 2 + dM * i / 30, e))); return p; };
      let s = '';
      s += `<polygon points="${nk(dilim(0))}" fill="${R.vurguSoluk}" stroke="${R.vurgu}" stroke-width="1.2"/>`;
      s += `<polygon points="${nk(dilim(Math.PI))}" fill="${R.vurguSoluk}" stroke="${R.vurgu}" stroke-width="1.2"/>`;
      s += S.elips(cx, cy, a, b, { renk: R.metin, kalin: 2 });
      s += S.cizgi(cx - a, cy, cx + a, cy, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      /* hareket yönü (saat yönünün tersi) */
      s += S.ok(cx + 18, cy - b, cx - 14, cy - b, { renk: R.metin, kalin: 2, boy: 9 });
      /* odaklar */
      s += S.daire(gx, cy, 9, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(gx - 14, cy - 9, 'Güneş', { boy: 14, hiza: 'end', kalin: true });
      s += S.yazi(gx - 14, cy + 20, '(odak)', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.daire(bx, cy, 3.5, { dolgu: R.soluk, renk: R.soluk });
      s += S.yazi(bx, cy + 34, 'Boş odak', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* uç noktalar */
      s += S.yazi(cx + a + 4, cy - 6, 'Günberi', { boy: 13 });
      s += S.yazi(cx + a + 4, cy + 12, 'hızlı', { boy: 13, renk: R.vurgu });
      s += S.yazi(cx - a - 4, cy - 6, 'Günöte', { boy: 13, hiza: 'end' });
      s += S.yazi(cx - a - 4, cy + 12, 'yavaş', { boy: 13, hiza: 'end', renk: R.vurgu });
      /* yarı büyük eksen a */
      const y2 = cy + b + 16;
      s += S.cizgi(cx, y2, cx + a, y2, { renk: R.mavi, kalin: 1.5 }) + S.cizgi(cx, y2 - 5, cx, y2 + 5, { renk: R.mavi, kalin: 1.5 }) + S.cizgi(cx + a, y2 - 5, cx + a, y2 + 5, { renk: R.mavi, kalin: 1.5 });
      s += S.cizgi(cx, cy, cx, y2 - 6, { renk: R.mavi, kalin: 1, kesik: '2 3' });
      s += S.daire(cx, cy, 2.5, { dolgu: R.mavi, renk: R.mavi });
      s += S.yazi(cx + a / 2, y2 + 19, 'a: yarı büyük eksen', { boy: 13, hiza: 'middle', renk: R.mavi });
      /* açıklama */
      s += S.kutu(20, y2 + 32, 14, 12, { dolgu: R.vurguSoluk, renk: R.vurgu });
      s += S.yazi(42, y2 + 43, 'Aynı sürede taranan iki alan: eşit', { boy: 13 });
      return s;
    }
  });

  C.ekle('d3-kepler3', {
    ders: 'd3', bolum: 2, oran: 0.82,
    baslik: 'P² = a³: gezegenler tek bir çizgide',
    aciklama: 'Yatay eksende Güneş\'e ortalama uzaklık (AB), dikey eksende bir turun süresi (yıl) var; iki eksen de logaritmik, her büyük çentik 10 kat. Sekiz gezegen ve Plüton, P² = a³ kuralının çizdiği tek bir doğrunun üstüne düşer. Uzaklık 10 kat artınca süre yaklaşık 32 kat artar.',
    kaynak: [{ ad: 'NASA NSSDCA – Planetary Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
      { ad: 'Wikipedia – Kepler\'s laws of planetary motion', url: 'https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion' }],
    ciz(S) {
      const R = S.R;
      /* a (AB) ve P (yıl): 9. ders 2. ve 3. bölüm (NASA); Plüton: 19. ders (39,48 AB, 247,94 yıl) */
      const g = [['Merkür', 0.39, 88 / 365.25, 1], ['Venüs', 0.72, 224.7 / 365.25, -1], ['Dünya', 1, 1, 1], ['Mars', 1.52, 1.88, -1],
        ['Jüpiter', 5.20, 11.86, 1], ['Satürn', 9.57, 29.4, -1], ['Uranüs', 19.2, 84.0, -1], ['Neptün', 30.2, 164.8, 1], ['Plüton', 39.48, 247.94, -1]];
      const ek = S.eksen({ x: 50, y: 30, w: 330, h: 222 }, { x0: 0.25, x1: 60, y0: 0.1, y1: 500 }, {
        logX: true, logY: true,
        xIsaret: [[0.5, '0,5'], [1, '1'], [5, '5'], [10, '10'], [50, '50']],
        yIsaret: [[0.1, '0,1'], [1, '1'], [10, '10'], [100, '100']],
        xAd: 'Yarı büyük eksen a (AB)'
      });
      let s = ek.svg + S.yazi(8, 16, 'Dönem P (yıl)', { boy: 14, renk: R.soluk });
      s += S.fonk(ek, a => Math.pow(a, 1.5), 0.25, 60, 60, { renk: R.vurgu, kalin: 1.6, kesik: '6 4' }, true);
      s += S.yazi(ek.X(0.32), ek.Y(150), 'P² = a³', { boy: 16, renk: R.vurgu, kalin: true });
      g.forEach(([ad, a, P, yan]) => {
        const x = ek.X(a), y = ek.Y(P);
        s += S.daire(x, y, 4.5, { dolgu: ad === 'Plüton' ? R.soluk : R.gezegen, renk: R.zemin, kalin: 1 });
        if (yan > 0) s += S.yazi(x + 9, y + 15, ad, { boy: 13 });
        else s += S.yazi(x - 9, y - 7, ad, { boy: 13, hiza: 'end' });
      });
      return s;
    }
  });

  C.ekle('d3-gelgit', {
    ders: 'd3', bolum: 7, oran: 0.95,
    baslik: 'Büyük ve küçük gelgit',
    aciklama: 'Üstte Ay ile Güneş aynı doğrultuda: yeni ayda ya da dolunayda ikisinin şişirdiği su kabarıklıkları üst üste biner ve gelgit büyür. Altta Ay ile Güneş arasında dik açı var: ilkdördün ve sondördünde Güneş\'in etkisi Ay\'ınkini kısmen götürür ve kabarıklık küçülür. Güneş\'in etkisi Ay\'ınkinin yaklaşık %46\'sı alındı; şişkinlikler abartılmıştır, boylar ve uzaklıklar ölçeksizdir.',
    kaynak: [{ ad: 'NOAA – Tides tutorial: Variations', url: 'https://oceanservice.noaa.gov/education/tutorial_tides/tides06_variations.html' },
      { ad: 'Wikipedia – Tide', url: 'https://en.wikipedia.org/wiki/Tide' }],
    ciz(S) {
      const R = S.R, ex = 236, Re = 26, taban = 34, olc = 12, gunesOran = 0.46;
      const panel = (y0, baslik, dik) => {
        const cy = y0 + 100;
        let s = S.yazi(12, y0 + 18, baslik, { boy: 15, kalin: true });
        /* Güneş ve ışınları (soldan) */
        s += S.daire(34, cy, 18, { dolgu: R.gunes, renk: R.gunes });
        s += S.yazi(34, cy + 38, 'Güneş', { boy: 13, hiza: 'middle', renk: R.soluk });
        [-14, 0, 14].forEach(d => { s += S.ok(62, cy + d, 92, cy + d, { renk: R.gunes, kalin: 1.2, boy: 7 }); });
        /* su zarfı: Ay etkisi 1, Güneş etkisi 0,46; aynı doğrultuda toplanır, dik açıda kısmen götürür */
        const A = dik ? 1 - gunesOran : 1 + gunesOran;
        const buyuk = taban + olc * A, kucuk = taban - olc * A / 2;
        s += dik ? S.elips(ex, cy, kucuk, buyuk, { renk: R.mavi, kalin: 1.5, dolgu: R.mavi, saydam: 0.35 })
          : S.elips(ex, cy, buyuk, kucuk, { renk: R.mavi, kalin: 1.5, dolgu: R.mavi, saydam: 0.35 });
        s += dik ? S.elips(ex, cy, kucuk, buyuk, { renk: R.mavi, kalin: 1.5 }) : S.elips(ex, cy, buyuk, kucuk, { renk: R.mavi, kalin: 1.5 });
        s += S.daire(ex, cy, Re, { dolgu: R.yuzey2, renk: R.soluk, kalin: 1 });
        s += S.yazi(ex, cy + 5, 'Dünya', { boy: 13, hiza: 'middle' });
        if (!dik) {
          s += yariAydinlik(S, ex - 84, cy, 8, 180) + S.yazi(ex - 84, cy - 16, 'Yeni ay', { boy: 13, hiza: 'middle', renk: R.soluk });
          s += yariAydinlik(S, ex + 84, cy, 8, 180) + S.yazi(ex + 84, cy - 16, 'Dolunay', { boy: 13, hiza: 'middle', renk: R.soluk });
        } else {
          s += yariAydinlik(S, ex, cy - 66, 8, 180) + S.yazi(ex + 14, cy - 62, 'Sondördün', { boy: 13, renk: R.soluk });
          s += yariAydinlik(S, ex, cy + 66, 8, 180) + S.yazi(ex + 14, cy + 70, 'İlkdördün', { boy: 13, renk: R.soluk });
        }
        return s;
      };
      let s = panel(0, 'Büyük gelgit: yeni ay ya da dolunay', false);
      s += S.yazi(388, 172, 'Kuzeyden bakış · ölçeksiz', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.cizgi(12, 186, 388, 186, { renk: R.cizgi, kalin: 1 });
      s += panel(192, 'Küçük gelgit: ilkdördün ya da sondördün', true);
      return s;
    }
  });

  C.ekle('d3-lagrange', {
    ders: 'd3', bolum: 8, oran: 0.88,
    baslik: 'Güneş–Dünya sisteminin beş Lagrange noktası',
    aciklama: 'L1 Dünya ile Güneş arasında, L2 Dünya\'nın tam arkasında, ikisi de Dünya\'dan yaklaşık 1,5 milyon km uzakta; L3 Güneş\'in öbür yanında. L4 ve L5, Güneş ve Dünya ile birer eşkenar üçgen kurar; biri Dünya\'nın önünde, biri arkasında dolanır. Turuncu noktalar kararsızdır, araçlar küçük ateşlemelerle yerinde durur; yeşil noktalar kararlıdır. L1 ile L2\'nin Dünya\'ya uzaklığı abartıldı, çizim ölçeksizdir.',
    kaynak: [{ ad: 'ESA – What are Lagrange points?', url: 'https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points' },
      { ad: 'NASA Science – Webb Orbit', url: 'https://science.nasa.gov/mission/webb/orbit/' },
      { ad: 'Wikipedia – Lagrange point', url: 'https://en.wikipedia.org/wiki/Lagrange_point' }],
    ciz(S) {
      const R = S.R, cx = 172, cy = 150, r = 124;
      const yer = a => [cx + r * Math.cos(a * rad), cy - r * Math.sin(a * rad)];
      const [dx, dy] = yer(0), [l4x, l4y] = yer(60), [l5x, l5y] = yer(-60), [l3x, l3y] = yer(180);
      let s = S.daire(cx, cy, r, { renk: R.soluk, kalin: 1, kesik: '3 5' });
      s += S.ok(...yer(100), ...yer(112), { renk: R.soluk, kalin: 1.5, boy: 8 });
      /* eşkenar üçgenler */
      const ucg = { renk: R.soluk, kalin: 1, kesik: '4 4', saydam: 0.55 };
      [[l4x, l4y], [l5x, l5y]].forEach(([x, y]) => { s += S.cizgi(cx, cy, x, y, ucg) + S.cizgi(dx, dy, x, y, ucg); });
      s += S.cizgi(cx, cy, dx, dy, ucg);
      s += S.daire(cx, cy, 16, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(cx, cy + 34, 'Güneş', { boy: 14, hiza: 'middle', kalin: true });
      s += S.daire(dx, dy, 7, { dolgu: R.mavi, renk: R.mavi });
      s += S.yazi(dx, dy - 15, 'Dünya', { boy: 14, hiza: 'middle', kalin: true });
      const nokta = (x, y, ad, kararli, ax, ay, hiza) => S.daire(x, y, 5, { dolgu: kararli ? R.iyi : R.uyari, renk: kararli ? R.iyi : R.uyari }) + S.yazi(x + ax, y + ay, ad, { boy: 15, kalin: true, hiza: hiza || 'middle', renk: kararli ? R.iyi : R.uyari });
      s += nokta(dx - 34, dy, 'L1', false, 0, 24);
      s += nokta(dx + 34, dy, 'L2', false, 0, 24);
      s += nokta(l3x, l3y, 'L3', false, -10, 5, 'end');
      s += nokta(l4x, l4y, 'L4', true, 10, -6, 'start');
      s += nokta(l5x, l5y, 'L5', true, 10, 16, 'start');
      s += S.yazi(dx - 34, dy + 42, 'SOHO', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(dx + 34, dy + 42, 'Webb', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(l4x + 10, l4y + 12, 'Truva asteroitleri', { boy: 13, renk: R.soluk });
      /* gösterge */
      s += S.yazi(12, 312, 'L1 ve L2: Dünya\'dan ~1,5 milyon km (abartıldı)', { boy: 13, renk: R.soluk });
      s += S.daire(18, 333, 5, { dolgu: R.uyari, renk: R.uyari }) + S.yazi(30, 338, 'kararsız', { boy: 13 });
      s += S.daire(110, 333, 5, { dolgu: R.iyi, renk: R.iyi }) + S.yazi(122, 338, 'kararlı', { boy: 13 });
      s += S.yazi(388, 338, 'ölçeksiz', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* ================= d9 — gezegenler ================= */

  C.ekle('d9-yogunluk', {
    ders: 'd9', bolum: 0, oran: 0.8,
    baslik: 'İki aile: yoğunluk',
    aciklama: 'Her çubuk bir gezegenin ortalama yoğunluğunu gösterir. Karasal dört gezegen 3,9 ile 5,5 gram bölü santimetreküp arasında; dev dört gezegen 0,69 ile 1,64 arasında kalır. Kesikli çizgi suyun yoğunluğudur: Satürn\'ün çubuğu bu çizgiye ulaşmaz, yani Satürn sudan az yoğundur.',
    kaynak: [{ ad: 'NASA JPL SSD – Planetary Physical Parameters', url: 'https://ssd.jpl.nasa.gov/planets/phys_par.html' }],
    ciz(S) {
      const R = S.R, x0 = 78, olc = 50;          // 1 g/cm³ = 50 birim
      /* JPL yoğunlukları (9. ders 0. bölüm; d9_kaynak.md) */
      const grup = [['Karasal gezegenler', R.vurgu, [['Merkür', 5.43], ['Venüs', 5.24], ['Dünya', 5.51], ['Mars', 3.93]]],
        ['Dev gezegenler', R.mavi, [['Jüpiter', 1.33], ['Satürn', 0.69], ['Uranüs', 1.27], ['Neptün', 1.64]]]];
      let s = S.yazi(x0 + olc - 6, 30, 'su: 1', { boy: 13, hiza: 'end' }), y = 30;
      grup.forEach(([ad, renk, ls]) => {
        s += S.yazi(x0 + olc + 8, y, ad, { boy: 14, kalin: true, renk });
        y += 10;
        ls.forEach(([g, d]) => {
          s += S.yazi(x0 - 8, y + 14, g, { boy: 13, hiza: 'end' });
          s += S.kutu(x0, y + 2, d * olc, 16, { dolgu: renk, renk: 'none', saydam: 0.85 }, 2);
          s += S.yazi(Math.max(x0 + d * olc, x0 + olc) + 6, y + 15, v(d, 2), { boy: 13, renk: R.soluk });
          y += 24;
        });
        y += 18;
      });
      const alt = y - 14;
      /* eksen ve su çizgisi */
      s += S.cizgi(x0, 38, x0, alt, { renk: R.soluk, kalin: 1 });
      s += S.cizgi(x0, alt, x0 + 6 * olc, alt, { renk: R.soluk, kalin: 1 });
      [0, 1, 2, 3, 4, 5, 6].forEach(k => { s += S.cizgi(x0 + k * olc, alt, x0 + k * olc, alt + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(x0 + k * olc, alt + 20, String(k), { boy: 13, hiza: 'middle', renk: R.soluk }); });
      s += S.yazi(x0 + 3 * olc, alt + 40, 'Yoğunluk (g/cm³)', { boy: 14, hiza: 'middle', renk: R.soluk });
      s += S.cizgi(x0 + olc, 18, x0 + olc, alt, { renk: R.metin, kalin: 1.3, kesik: '4 3' });
      return s;
    }
  });

  C.ekle('d9-boyutlar', {
    ders: 'd9', bolum: 1, oran: 0.78,
    baslik: 'Gezegenlerin boyları aynı ölçekte',
    aciklama: 'Bütün daireler aynı ölçekte çizildi; sayılar çapın Dünya\'nın çapına oranıdır. Jüpiter 11,2, Satürn 9,4, Uranüs 4,0, Neptün 3,9 kat; Venüs 0,95, Mars 0,53, Merkür 0,38 kat. Karasal dört gezegen, devlerin yanında küçücük noktalar gibi kalır. Satürn\'ün halkaları çizilmedi; aralarındaki uzaklıklar ölçeksizdir.',
    kaynak: [{ ad: 'NASA NSSDCA – Planetary Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' }],
    ciz(S) {
      const R = S.R, olc = 12;                    // Dünya çapı = 12 birim
      /* ekvator çapı / Dünya'nınki (9. ders 1. bölüm, NASA) */
      const dev = [['Jüpiter', 11.2, '11,2'], ['Satürn', 9.4, '9,4'], ['Uranüs', 4.0, '4,0'], ['Neptün', 3.9, '3,9']];
      const kar = [['Merkür', 0.38, '0,38'], ['Venüs', 0.95, '0,95'], ['Dünya', 1, '1'], ['Mars', 0.53, '0,53']];
      let s = S.yazi(392, 16, 'Dış dört: dev gezegenler', { boy: 14, kalin: true, hiza: 'end', renk: R.mavi });
      let x = 17; const cy = 94;
      dev.forEach(([ad, d, t], i) => {
        const r = d * olc / 2; x += r;
        s += S.daire(x, cy, r, { dolgu: i < 2 ? R.gezegen : R.mavi, renk: 'none', saydam: i < 2 ? 0.8 : 0.85 });
        s += S.yazi(x, cy + 88, ad, { boy: 14, hiza: 'middle' });
        s += S.yazi(x, cy + 106, t + ' ×', { boy: 13, hiza: 'middle', renk: R.soluk });
        x += r + 8;
      });
      s += S.cizgi(12, 216, 388, 216, { renk: R.cizgi, kalin: 1 });
      s += S.yazi(12, 238, 'İç dört: karasal gezegenler', { boy: 14, kalin: true, renk: R.vurgu });
      kar.forEach(([ad, d, t], i) => {
        const x = 18 + i * 96;
        s += S.daire(x, 262, d * olc / 2, { dolgu: R.vurgu, renk: 'none' });
        s += S.yazi(x + 12, 260, ad, { boy: 14 });
        s += S.yazi(x + 12, 277, t + ' ×', { boy: 13, renk: R.soluk });
      });
      s += S.yazi(200, 306, 'Ölçek: Dünya\'nın çapı (12.756 km) = 1', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  C.ekle('d9-uzaklik', {
    ders: 'd9', bolum: 1, oran: 0.66,
    baslik: 'Güneş\'ten uzaklıklar: iki ölçek',
    aciklama: 'Üst çizgi gerçek oranlarla çizildi: karasal dört gezegen Güneş\'in hemen yanına, 1,5 AB\'nin içine sıkışır, Neptün ise 30 AB\'dedir. Alt çizgi logaritmiktir: eşit boşluk eşit kat demektir, 1\'den 10\'a giden boşluk 5\'ten 50\'ye giden boşluğa eşittir; burada bütün gezegenler seçilir. Mars ile Jüpiter arasındaki asteroit kuşağı ve Neptün\'ün ötesindeki Kuiper kuşağı da işaretli.',
    kaynak: [{ ad: 'NASA NSSDCA – Planetary Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
      { ad: 'NASA Science – Kuiper Belt: Facts', url: 'https://science.nasa.gov/solar-system/kuiper-belt/facts/' }],
    ciz(S) {
      const R = S.R;
      /* yarı büyük eksenler (AB), 9. ders 1. bölüm */
      const g = [['Merkür', 0.39], ['Venüs', 0.72], ['Dünya', 1], ['Mars', 1.52], ['Jüpiter', 5.20], ['Satürn', 9.57], ['Uranüs', 19.2], ['Neptün', 30.2]];
      const renk = i => i < 4 ? R.vurgu : R.mavi;
      let s = '';
      /* doğrusal */
      const L = au => 24 + au * 11.6, ya = 62;
      s += S.yazi(12, 16, 'Gerçek oranlarla (doğrusal)', { boy: 14, kalin: true });
      s += S.cizgi(24, ya, 382, ya, { renk: R.soluk, kalin: 1 });
      s += S.daire(24, ya, 6, { dolgu: R.gunes, renk: R.gunes });
      g.forEach(([ad, a], i) => {
        s += S.daire(L(a), ya, 3.5, { dolgu: renk(i), renk: 'none' });
        if (i >= 4) { s += S.yazi(L(a), ya - 12, ad, { boy: 13, hiza: 'middle' }); s += S.yazi(L(a), ya + 22, a < 10 ? v(a, 2) : v(a, 1), { boy: 13, hiza: 'middle', renk: R.soluk }); }
      });
      s += S.cizgi(26, ya - 9, 26, ya - 20, { renk: R.vurgu, kalin: 1 }) + S.cizgi(26, ya - 20, 44, ya - 32, { renk: R.vurgu, kalin: 1 });
      s += S.yazi(47, ya - 30, 'iç dört', { boy: 13, renk: R.vurgu });
      s += S.yazi(30, ya + 22, '≤ 1,5', { boy: 13, renk: R.soluk });
      /* logaritmik */
      const x0 = 30, x1 = 372, lo = Math.log10(0.3), hi = Math.log10(60), X = au => x0 + (Math.log10(au) - lo) / (hi - lo) * (x1 - x0), yb = 178;
      s += S.yazi(12, 112, 'Logaritmik ölçek', { boy: 14, kalin: true });
      s += S.kutu(X(2.3), yb - 9, X(3.3) - X(2.3), 18, { dolgu: R.soluk, renk: 'none', saydam: 0.35 });
      s += S.kutu(X(30), yb - 9, X(50) - X(30), 18, { dolgu: R.mavi, renk: 'none', saydam: 0.3 });
      s += S.cizgi(x0, yb, x1, yb, { renk: R.soluk, kalin: 1 });
      g.forEach(([ad, a], i) => {
        const x = X(a), ust = i % 2 === 0;
        s += S.daire(x, yb, 4.5, { dolgu: renk(i), renk: R.zemin, kalin: 1 });
        s += S.cizgi(x, yb - 7, x, ust ? yb - 32 : yb - 14, { renk: R.cizgi, kalin: 1 });
        s += S.yazi(x, ust ? yb - 36 : yb - 18, ad, { boy: 13, hiza: 'middle' });
      });
      [[0.5, '0,5'], [1, '1'], [5, '5'], [10, '10'], [50, '50']].forEach(([a, t]) => { s += S.cizgi(X(a), yb + 9, X(a), yb + 14, { renk: R.soluk, kalin: 1 }) + S.yazi(X(a), yb + 28, t, { boy: 13, hiza: 'middle', renk: R.soluk }); });
      s += S.yazi((X(2.3) + X(3.3)) / 2, yb + 48, 'asteroit kuşağı', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(388, yb + 48, 'Kuiper kuşağı', { boy: 13, hiza: 'end', renk: R.mavi });
      s += S.yazi(200, yb + 74, 'Güneş\'e uzaklık (AB)', { boy: 14, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* ================= d10 — Ay ================= */

  C.ekle('d10-evreler', {
    ders: 'd10', bolum: 0, oran: 1.04,
    baslik: 'Ay\'ın evreleri: üstten ve Dünya\'dan',
    aciklama: 'Üstte Dünya ile Ay\'ın yörüngesini kuzeyden bakarak görüyorsun; Güneş ışığı sağdan geliyor ve Ay\'ın hep Güneş\'e bakan yarısı aydınlık. Ay saat yönünün tersine dolanır. Alttaki listede aynı sekiz konumun İstanbul gibi kuzey yarımküredeki bir yerden nasıl göründüğü var: büyürken sağ yanı, küçülürken sol yanı aydınlıktır. Çizim ölçeksizdir.',
    kaynak: [{ ad: 'NASA Science – Moon Phases', url: 'https://science.nasa.gov/moon/moon-phases/' },
      { ad: 'Wikipedia – Lunar phase', url: 'https://en.wikipedia.org/wiki/Lunar_phase' }],
    ciz(S) {
      const R = S.R, cx = 186, cy = 140, r = 88;
      const adlar = ['Yeni ay', 'Büyüyen hilal', 'İlkdördün', 'Büyüyen şişkin ay', 'Dolunay', 'Küçülen şişkin ay', 'Sondördün', 'Küçülen hilal'];
      let s = S.yazi(10, 18, 'Kuzeyden bakış', { boy: 13, renk: R.soluk });
      /* Güneş ışığı (sağdan) */
      s += S.yazi(392, 18, 'Güneş ışığı', { boy: 13, hiza: 'end', renk: R.gunes });
      [-60, 0, 60].forEach(d => { s += S.ok(390, cy + d, 346, cy + d, { renk: R.gunes, kalin: 1.4, boy: 8 }); });
      s += S.daire(cx, cy, r, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.ok(cx + r * Math.cos(112 * rad), cy - r * Math.sin(112 * rad), cx + r * Math.cos(124 * rad), cy - r * Math.sin(124 * rad), { renk: R.soluk, kalin: 1.5, boy: 8 });
      s += yariAydinlik(S, cx, cy, 15, 0, R.mavi);
      s += S.yazi(cx, cy + 32, 'Dünya', { boy: 13, hiza: 'middle', renk: R.soluk });
      for (let k = 0; k < 8; k++) {
        const a = k * 45, x = cx + r * Math.cos(a * rad), y = cy - r * Math.sin(a * rad);
        s += yariAydinlik(S, x, y, 10, 0);
        const lx = cx + (r + 24) * Math.cos(a * rad), ly = cy - (r + 24) * Math.sin(a * rad);
        s += S.yazi(lx, ly + 5, String(k + 1), { boy: 14, kalin: true, hiza: 'middle', renk: R.vurgu });
      }
      /* Dünya'dan görünüş */
      s += S.cizgi(10, 266, 390, 266, { renk: R.cizgi, kalin: 1 });
      s += S.yazi(10, 288, 'Dünya\'dan görünüşü (kuzey yarımküre)', { boy: 14, kalin: true });
      for (let k = 0; k < 8; k++) {
        const kol = k < 4 ? 0 : 1, sat = k % 4, x = 22 + kol * 196, y = 314 + sat * 26;
        s += evreSimge(S, x, y, 10, k * 45);
        s += S.yazi(x + 18, y + 5, (k + 1) + '  ' + adlar[k], { boy: 14 });
      }
      return s;
    }
  });

  C.ekle('d10-yildizil-kavusum', {
    ders: 'd10', bolum: 1, oran: 0.8,
    baslik: 'Yıldızıl ay ile kavuşum ayı',
    aciklama: 'Solda Güneş, sağda Dünya\'nın yörüngesinden bir parça var. Birinci konumda yeni ay: Ay, Dünya ile Güneş arasında. 27,3 gün sonra Ay yıldızlara göre bir tam tur atmış ve aynı yöne bakıyor, ama Dünya bu sürede yaklaşık 27° ilerlediği için Ay henüz Güneş\'in önüne gelmemiş. Yeni ayın tekrarlanması için yaklaşık 2,2 gün daha gerekir: kavuşum ayı 29,5 gündür. Çizim ölçeksizdir.',
    kaynak: [{ ad: 'NASA NSSDCA – Moon Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html' },
      { ad: 'Wikipedia – Orbital period', url: 'https://en.wikipedia.org/wiki/Orbital_period' }],
    ciz(S) {
      const R = S.R, gx = 34, gy = 168, Ry = 262, ra = 40;
      const P = 27.3217, Y = 365.256, Sk = 29.53;
      const ilerleme = 360 * P / Y;                       // Dünya'nın 27,32 günde Güneş çevresinde aldığı açı ≈ 26,9°
      const a1 = -ilerleme / 2, a2 = ilerleme / 2;
      const yer = a => [gx + Ry * Math.cos(a * rad), gy - Ry * Math.sin(a * rad)];
      const [e1x, e1y] = yer(a1), [e2x, e2y] = yer(a2);
      let s = '';
      /* Dünya yörüngesi yayı */
      s += S.yay(gx, gy, Ry, -24, 24, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.yay(gx, gy, Ry + 16, a1 + 3, a2 - 3, { renk: R.mavi, kalin: 1.5 });
      s += S.ok(...yer(a2 - 6).map((q, i) => i === 0 ? gx + (Ry + 16) * Math.cos((a2 - 6) * rad) : gy - (Ry + 16) * Math.sin((a2 - 6) * rad)), gx + (Ry + 16) * Math.cos((a2 - 3) * rad), gy - (Ry + 16) * Math.sin((a2 - 3) * rad), { renk: R.mavi, kalin: 1.5, boy: 8 });
      s += S.yazi(gx + (Ry + 22) * Math.cos(0), gy + 5, '≈ ' + v(ilerleme, 0) + '°', { boy: 13, renk: R.mavi });
      s += S.daire(gx, gy, 20, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(gx, gy + 40, 'Güneş', { boy: 14, hiza: 'middle', kalin: true });
      /* Güneş'e doğru birim yön */
      const yon = (x, y) => { const d = Math.hypot(gx - x, gy - y); return [(gx - x) / d, (gy - y) / d]; };
      const u1 = yon(e1x, e1y), u2 = yon(e2x, e2y);
      /* 1. konum: yeni ay */
      s += S.daire(e1x, e1y, ra, { renk: R.soluk, kalin: 1, kesik: '2 4' });
      s += S.ok(e1x, e1y, e1x + u1[0] * (ra - 12), e1y + u1[1] * (ra - 12), { renk: R.vurgu, kalin: 1.6, boy: 7 });
      s += yariAydinlik(S, e1x, e1y, 10, Math.atan2(-u1[1], u1[0]) / rad, R.mavi);
      s += yariAydinlik(S, e1x + u1[0] * ra, e1y + u1[1] * ra, 6.5, Math.atan2(-u1[1], u1[0]) / rad);
      s += S.yazi(e1x - 6, e1y + ra + 20, '1. Yeni ay', { boy: 14, kalin: true, hiza: 'middle' });
      /* 2. konum: 27,32 gün sonra; Ay yıldızlara göre aynı yönde (paralel) */
      s += S.daire(e2x, e2y, ra, { renk: R.soluk, kalin: 1, kesik: '2 4' });
      s += S.ok(e2x, e2y, e2x + u1[0] * (ra - 12), e2y + u1[1] * (ra - 12), { renk: R.vurgu, kalin: 1.6, boy: 7 });
      s += S.cizgi(e2x, e2y, e2x + u2[0] * ra, e2y + u2[1] * ra, { renk: R.metin, kalin: 1.2, kesik: '3 3' });
      s += yariAydinlik(S, e2x, e2y, 10, Math.atan2(-u2[1], u2[0]) / rad, R.mavi);
      s += yariAydinlik(S, e2x + u1[0] * ra, e2y + u1[1] * ra, 6.5, Math.atan2(-u2[1], u2[0]) / rad);
      const b1 = Math.atan2(-u1[1], u1[0]) / rad, b2 = Math.atan2(-u2[1], u2[0]) / rad;
      s += S.yay(e2x, e2y, ra + 9, b1, b2, { renk: R.uyari, kalin: 2.2 });
      const bm = (b1 + b2) / 2;
      s += S.yazi(e2x + (ra + 16) * Math.cos(bm * rad), e2y - (ra + 16) * Math.sin(bm * rad) + 4, '+' + v(Sk - P, 1) + ' gün', { boy: 14, hiza: 'end', renk: R.uyari, kalin: true });
      s += S.yazi(e2x - 6, e2y - ra - 26, '2. ' + v(P, 1) + ' gün sonra', { boy: 14, kalin: true, hiza: 'middle' });
      s += S.yazi(e2x - 6, e2y - ra - 10, 'bir tur: aynı yön', { boy: 13, hiza: 'middle', renk: R.vurgu });
      /* gösterge */
      s += S.yazi(78, 300, 'Kavuşum ayı: ' + v(P, 1) + ' + ' + v(Sk - P, 1) + ' ≈ ' + v(Sk, 1) + ' gün', { boy: 14, renk: R.metin });
      return s;
    }
  });

  C.ekle('d10-tutulma', {
    ders: 'd10', bolum: 8, oran: 0.86,
    baslik: 'Tutulmalarda tam gölge ve yarı gölge',
    aciklama: 'Üstte Güneş tutulması: Ay, Güneş ile Dünya arasına girer. Ay\'ın koyu, sivrilen tam gölgesi Dünya\'da dar bir şeride değer; orada tam tutulma görülür, çevresindeki yarı gölgede parçalı tutulma görülür. Altta Ay tutulması: Dünya, Güneş ile Ay arasına girer ve Ay, Dünya\'nın tam gölgesine dalar. Boylar ve uzaklıklar ölçeksizdir.',
    kaynak: [{ ad: 'NASA Science – Types of Eclipses', url: 'https://science.nasa.gov/eclipses/types/' },
      { ad: 'Wikipedia – Solar eclipse', url: 'https://en.wikipedia.org/wiki/Solar_eclipse' },
      { ad: 'Wikipedia – Lunar eclipse', url: 'https://en.wikipedia.org/wiki/Lunar_eclipse' }],
    ciz(S) {
      const R = S.R, sx = 4, sr = 46;
      /* Büyük (Güneş) ve küçük cisim arasındaki gölge konileri; x2 = gölgeyi yapan cismin merkezi */
      function golge(cy, x2, r2, xSon) {
        let s = '';
        const tepe = x2 + (x2 - sx) * r2 / (sr - r2);                       // tam gölgenin tepesi (dış teğetler)
        const kes = sx + (x2 - sx) * sr / (sr + r2);                        // iç teğetlerin kesişimi
        const ust = teget(x2, cy, r2, tepe, cy, -1), alt = teget(x2, cy, r2, tepe, cy, 1);
        const gU = teget(sx, cy, sr, tepe, cy, -1), gA = teget(sx, cy, sr, tepe, cy, 1);
        const iU = teget(x2, cy, r2, kes, cy, 1), iA = teget(x2, cy, r2, kes, cy, -1);   // iç teğetin küçük cisimdeki değme noktaları
        const jU = teget(sx, cy, sr, kes, cy, 1), jA = teget(sx, cy, sr, kes, cy, -1);
        const uzat = (p, q, x) => [x, p[1] + (q[1] - p[1]) * (x - p[0]) / (q[0] - p[0])];
        const pU = uzat(jA, iU, xSon), pA = uzat(jU, iA, xSon);
        const tx = Math.min(tepe, xSon), tU = uzat(gU, ust, tx), tA = uzat(gA, alt, tx);
        s += `<polygon points="${nk([iU, pU, pA, iA])}" fill="${R.soluk}" opacity="0.2"/>`;
        s += `<polygon points="${nk([ust, tU, tA, alt])}" fill="${R.zemin}" opacity="0.95"/>`;
        s += S.cizgi(jA[0], jA[1], pU[0], pU[1], { renk: R.soluk, kalin: 1 }) + S.cizgi(jU[0], jU[1], pA[0], pA[1], { renk: R.soluk, kalin: 1 });
        s += S.cizgi(gU[0], gU[1], tU[0], tU[1], { renk: R.metin, kalin: 1, saydam: 0.6 }) + S.cizgi(gA[0], gA[1], tA[0], tA[1], { renk: R.metin, kalin: 1, saydam: 0.6 });
        return { s, tepe, pU, pA };
      }
      let s = '';
      /* --- Güneş tutulması --- */
      let cy = 92;
      s += S.yazi(12, 18, 'Güneş tutulması (yeni ay)', { boy: 15, kalin: true });
      const mx = 196, mr = 9, ex1 = 0;
      const g1 = golge(cy, mx, mr, 330);
      const dR = 40, dX = g1.tepe + dR - 3;                                   // Dünya yüzeyi tam gölgenin tepesine değsin
      s += S.daire(dX, cy, dR, { dolgu: R.yuzey2, renk: R.mavi, kalin: 1.5 });
      s += g1.s;
      s += S.daire(sx, cy, sr, { dolgu: R.gunes, renk: R.gunes });
      s += S.daire(mx, cy, mr, { dolgu: R.ay, renk: R.ay });
      s += S.yazi(mx, cy - 18, 'Ay', { boy: 13, hiza: 'middle' });
      s += S.yazi(dX + 6, cy + dR + 18, 'Dünya', { boy: 13, hiza: 'middle' });
      s += S.daire(g1.tepe, cy, 3, { dolgu: R.uyari, renk: R.uyari });
      s += S.cizgi(g1.tepe + 2, cy - 3, 338, cy - 34, { renk: R.uyari, kalin: 1 }) + S.yazi(342, cy - 32, 'tam', { boy: 13, renk: R.uyari });
      s += S.yazi(342, cy - 48, 'parçalı', { boy: 13, renk: R.soluk });
      s += S.cizgi(296, cy - 22, 338, cy - 52, { renk: R.soluk, kalin: 1 });
      s += S.yazi(12 + ex1, cy + 64, 'Güneş', { boy: 13, renk: R.gunes });
      /* --- Ay tutulması --- */
      cy = 252;
      s += S.cizgi(12, 172, 388, 172, { renk: R.cizgi, kalin: 1 });
      s += S.yazi(12, 196, 'Ay tutulması (dolunay)', { boy: 15, kalin: true });
      const dx2 = 182, dr2 = 26;
      const g2 = golge(cy, dx2, dr2, 396);
      s += g2.s;
      s += S.daire(sx, cy, sr, { dolgu: R.gunes, renk: R.gunes });
      s += S.daire(dx2, cy, dr2, { dolgu: R.yuzey2, renk: R.mavi, kalin: 1.5 });
      s += S.yazi(dx2, cy + 5, 'Dünya', { boy: 13, hiza: 'middle' });
      const ayX = 318;
      s += S.daire(ayX, cy, 9, { dolgu: R.uyari, renk: R.uyari, saydam: 0.8 });
      s += S.yazi(ayX, cy + 52, 'Ay: tam gölgede', { boy: 13, hiza: 'middle', renk: R.uyari });
      s += S.cizgi(ayX, cy + 12, ayX, cy + 38, { renk: R.uyari, kalin: 1 });
      s += S.yazi(12, cy + 64, 'Güneş', { boy: 13, renk: R.gunes });
      /* gösterge */
      s += S.kutu(150, 330, 14, 12, { dolgu: R.zemin, renk: R.soluk });
      s += S.yazi(170, 341, 'tam gölge', { boy: 13 });
      s += S.kutu(260, 330, 14, 12, { dolgu: R.soluk, renk: R.soluk, saydam: 0.35 });
      s += S.yazi(280, 341, 'yarı gölge', { boy: 13 });
      return s;
    }
  });

  C.ekle('d10-dugum', {
    ders: 'd10', bolum: 8, oran: 0.84,
    baslik: 'Neden her ay tutulma olmaz?',
    aciklama: 'Güneş\'in çevresinde Dünya\'yı dört konumda görüyorsun. Ay\'ın yörüngesi Dünya\'nınkine 5,145° eğik; çizimde bu eğiklik abartıldı. Düz çizgi Ay yörüngesinin üst yarısı, kesikli çizgi alt yarısıdır. Solda ve sağda düğüm çizgisi Güneş\'e bakar: yeni ay ve dolunay düzlemin üstüne denk gelir ve tutulma olur. Önde ve arkada yeni Ay Güneş\'in altından ya da üstünden geçer, gölge Dünya\'yı ıskalar. Tutulma mevsimleri yaklaşık 173,3 gün arayla gelir.',
    kaynak: [{ ad: 'NASA NSSDCA – Moon Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html' },
      { ad: 'Wikipedia – Solar eclipse', url: 'https://en.wikipedia.org/wiki/Solar_eclipse' }],
    ciz(S) {
      const R = S.R, cx = 200, cy = 158, Ry = 148, el = 24 * rad, ro = 34, egik = 22 * rad;   // eğiklik abartıldı (gerçek 5,145°)
      const P = (x, y, z) => [cx + x, cy + y * Math.sin(el) - z * Math.cos(el)];
      let s = '';
      /* ekliptik (Dünya yörüngesi) */
      const ek = []; for (let i = 0; i <= 96; i++) { const a = 2 * Math.PI * i / 96; ek.push(P(Ry * Math.cos(a), Ry * Math.sin(a), 0)); }
      s += S.egri(ek, { renk: R.soluk, kalin: 1 });
      s += S.daire(cx, cy, 15, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(cx, cy + 5, 'Güneş', { boy: 13, hiza: 'middle', renk: R.zemin, kalin: true });
      /* dört konum: sağ (0), ön (90), sol (180), arka (270) — Ay yörüngesinin düğüm çizgisi x yönünde (uzayda sabit) */
      [[0, true], [90, false], [180, true], [270, false]].forEach(([l, tut]) => {
        const Ex = Ry * Math.cos(l * rad), Ey = Ry * Math.sin(l * rad);
        const ay = t => [Ex + ro * Math.cos(t), Ey + ro * Math.sin(t) * Math.cos(egik), ro * Math.sin(t) * Math.sin(egik)];
        const ust = [], alt = [];
        for (let i = 0; i <= 48; i++) { const t = Math.PI * i / 48; ust.push(P(...ay(t))); alt.push(P(...ay(Math.PI + t))); }
        s += S.egri(alt, { renk: R.ay, kalin: 1.2, kesik: '3 3', saydam: 0.8 });
        s += S.egri(ust, { renk: R.ay, kalin: 1.6 });
        const [n1x, n1y] = P(Ex - ro - 6, Ey, 0), [n2x, n2y] = P(Ex + ro + 6, Ey, 0);
        s += S.cizgi(n1x, n1y, n2x, n2y, { renk: R.vurgu, kalin: 1, kesik: '2 3' });
        const [dx, dy] = P(Ex, Ey, 0);
        s += S.daire(dx, dy, 6, { dolgu: R.mavi, renk: R.mavi });
        /* yeni ay konumu: Ay yörüngesinde Güneş'e en yakın nokta */
        let en = 0, ed = 1e9; for (let i = 0; i < 360; i++) { const q = ay(i * rad); const d = Math.hypot(q[0], q[1]); if (d < ed) { ed = d; en = i; } }
        const q = ay(en * rad), [ax, ay2] = P(...q);
        s += S.daire(ax, ay2, 4, { dolgu: tut ? R.uyari : R.ay, renk: R.zemin, kalin: 1 });
        if (!tut) {
          const [px, py] = P(q[0], q[1], 0);
          s += S.cizgi(px, py, ax, ay2, { renk: R.ay, kalin: 1 });
        }
      });
      const [sx, sy] = P(Ry, 0, 0), [lx, ly] = P(-Ry, 0, 0), [ox, oy] = P(0, Ry, 0), [bx, by] = P(0, -Ry, 0);
      s += S.yazi(sx, sy + 34, 'tutulma', { boy: 13, hiza: 'middle', renk: R.uyari, kalin: true });
      s += S.yazi(lx, ly + 34, 'tutulma', { boy: 13, hiza: 'middle', renk: R.uyari, kalin: true });
      s += S.yazi(ox, oy + 30, 'tutulma yok: Ay düzlemin altında', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(bx, by - 22, 'tutulma yok: Ay düzlemin üstünde', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* gösterge */
      s += S.cizgi(12, 316, 36, 316, { renk: R.vurgu, kalin: 1, kesik: '2 3' }) + S.yazi(42, 321, 'düğüm çizgisi', { boy: 13 });
      s += S.cizgi(160, 316, 184, 316, { renk: R.ay, kalin: 1.6 }) + S.yazi(190, 321, 'üst yarı', { boy: 13 });
      s += S.cizgi(258, 316, 282, 316, { renk: R.ay, kalin: 1.2, kesik: '3 3' }) + S.yazi(288, 321, 'alt yarı', { boy: 13 });
      return s;
    }
  });

  /* ================= d19 — küçük cisimler ================= */

  C.ekle('d19-kuyruk', {
    ders: 'd19', bolum: 3, oran: 0.8,
    baslik: 'Kuyruklu yıldızın iki kuyruğu Güneş\'ten uzağa bakar',
    aciklama: 'Kuyruklu yıldız uzun bir elips üzerinde Güneş\'in çevresinden geçer. Mavi iyon kuyruğu her konumda Güneş\'in tam tersini gösterir ve düzdür; sarımsı toz kuyruğu kuyruklu yıldızın geldiği yola doğru kavislenir. Güneş\'e yaklaştıkça kuyruklar uzar; Güneş\'ten uzaklaşırken kuyruk önden gider. Çizim ölçeksizdir.',
    kaynak: [{ ad: 'ESA – Structure of a comet', url: 'https://esa.int/ESA_Multimedia/Images/2023/11/Structure_of_a_comet' },
      { ad: 'NASA Science – Comets', url: 'https://science.nasa.gov/solar-system/comets' }],
    ciz(S) {
      const R = S.R, cx = 236, cy = 170, a = 160, e = 0.8, b = a * Math.sqrt(1 - e * e), gx = cx - a * e;
      /* E = 0 günberi (solda); hareket: alttan gelir, solda döner, üstten gider */
      const yer = E => [cx - a * Math.cos(E), cy - b * Math.sin(E)];
      const hiz = E => { const d = [a * Math.sin(E), -b * Math.cos(E)], n = Math.hypot(...d); return [d[0] / n, d[1] / n]; };
      let s = S.elips(cx, cy, a, b, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.daire(gx, cy, 13, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(gx + 2, cy + 32, 'Güneş', { boy: 14, hiza: 'middle', kalin: true });
      [-2.3, -1.25, -0.35, 0.55, 1.35, 2.35].forEach(E => {
        const [x, y] = yer(E), r = Math.hypot(x - gx, y - cy), u = [(x - gx) / r, (y - cy) / r], h = hiz(E);
        const L = Math.min(92, 3600 / r);
        if (r < 150) {
          /* toz kuyruğu: Güneş'in tersinden yörüngenin gerisine doğru kavisli */
          const w = [u[0] - 0.75 * h[0], u[1] - 0.75 * h[1]], wn = Math.hypot(...w);
          const son = [x + L * 0.9 * w[0] / wn, y + L * 0.9 * w[1] / wn], ktr = [x + L * 0.5 * u[0], y + L * 0.5 * u[1]];
          s += S.yol(`M${x.toFixed(1)},${y.toFixed(1)} Q${ktr[0].toFixed(1)},${ktr[1].toFixed(1)} ${son[0].toFixed(1)},${son[1].toFixed(1)}`, { renk: R.gezegen, kalin: 5, saydam: 0.55, uc: 'round' });
          /* iyon kuyruğu: tam Güneş'in tersine, düz */
          s += S.cizgi(x, y, x + L * u[0], y + L * u[1], { renk: R.mavi, kalin: 2, uc: 'round' });
        }
        s += S.daire(x, y, 4, { dolgu: R.metin, renk: R.metin });
        s += S.ok(x + h[0] * 8, y + h[1] * 8, x + h[0] * 20, y + h[1] * 20, { renk: R.metin, kalin: 1.2, boy: 6 });
      });
      /* gösterge */
      s += S.cizgi(12, 316, 36, 316, { renk: R.mavi, kalin: 2 }) + S.yazi(42, 321, 'iyon kuyruğu: düz', { boy: 13 });
      s += S.yol('M190,320 Q200,316 214,310', { renk: R.gezegen, kalin: 5, saydam: 0.55, uc: 'round' }) + S.yazi(222, 321, 'toz kuyruğu: kavisli', { boy: 13 });
      s += S.yazi(388, 24, 'Uzakta kuyruk yok', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  C.ekle('d19-meteor', {
    ders: 'd19', bolum: 5, oran: 0.76,
    baslik: 'Meteor yağmuru: Dünya enkazın içinden geçer',
    aciklama: 'Kuyruklu yıldız yörüngesi boyunca toz ve küçük parçalar bırakır. Dünya\'nın yörüngesi bu enkaz akıntısını kestiği yerde Dünya her yıl aynı tarihte parçacıkların arasından geçer ve meteor yağmuru görürüz. Perseidler için kaynak 109P/Swift-Tuttle\'dır, tepe gecesi 12–13 Ağustos civarındadır. Çizim ölçeksizdir.',
    kaynak: [{ ad: 'NASA Science – Meteors and Meteorites: Facts', url: 'https://science.nasa.gov/solar-system/meteors-meteorites/facts/' },
      { ad: 'NASA Science – Perseids', url: 'https://science.nasa.gov/solar-system/meteors-meteorites/perseids/' }],
    ciz(S) {
      const R = S.R, gx = 262, gy = 152, rd = 92, p = 64.8, e = 0.8;           // kuyruklu yıldız: r = p / (1 + e cos ν), günberi sağda
      const kyr = nu => { const r = p / (1 + e * Math.cos(nu * rad)); return [gx + r * Math.cos(nu * rad), gy - r * Math.sin(nu * rad)]; };
      let s = '';
      /* enkaz: yörünge boyunca serpilmiş parçacıklar (sabit sözde rastgele) */
      let tohum = 7; const rnd = () => { tohum = (tohum * 16807) % 2147483647; return tohum / 2147483647; };
      for (let i = 0; i < 170; i++) {
        const nu = -152 + 304 * rnd(), [x, y] = kyr(nu), sap = (rnd() - 0.5) * 9;
        s += S.daire(x + sap * 0.6, y + (rnd() - 0.5) * 9, 1.1, { dolgu: R.soluk, renk: 'none' });
      }
      const yol = []; for (let nu = -152; nu <= 152; nu += 2) yol.push(kyr(nu));
      s += S.egri(yol, { renk: R.soluk, kalin: 1, kesik: '4 4' });
      /* Dünya yörüngesi */
      s += S.daire(gx, gy, rd, { renk: R.mavi, kalin: 1.5 });
      s += S.daire(gx, gy, 12, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(gx, gy + 30, 'Güneş', { boy: 13, hiza: 'middle', kalin: true });
      /* kesişim: p/(1+e cos ν) = rd */
      const nuK = Math.acos((p / rd - 1) / e) / rad;
      const [kx, ky] = kyr(nuK);
      s += S.daire(kx, ky, 15, { renk: R.uyari, kalin: 2 });
      s += S.daire(kx, ky, 6, { dolgu: R.mavi, renk: R.mavi });
      s += S.yazi(kx - 22, ky - 22, 'Dünya enkazın içinde:', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      s += S.yazi(kx - 22, ky - 6, 'meteor yağmuru', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      s += S.ok(...[gx + (rd + 10) * Math.cos(30 * rad), gy - (rd + 10) * Math.sin(30 * rad)], gx + (rd + 10) * Math.cos(44 * rad), gy - (rd + 10) * Math.sin(44 * rad), { renk: R.mavi, kalin: 1.5, boy: 7 });
      s += S.yazi(gx + rd * 0.72 + 14, gy + rd * 0.72 + 18, 'Dünya\'nın yörüngesi', { boy: 13, hiza: 'middle', renk: R.mavi });
      /* kuyruklu yıldızın kendisi (günberiye yakın), kuyruğu Güneş'in tersine */
      const nuC = -38, [cx2, cy2] = kyr(nuC), rr = Math.hypot(cx2 - gx, cy2 - gy), ux = (cx2 - gx) / rr, uy = (cy2 - gy) / rr;
      s += S.cizgi(cx2, cy2, cx2 + 34 * ux, cy2 + 34 * uy, { renk: R.mavi, kalin: 2, uc: 'round' });
      s += S.daire(cx2, cy2, 4, { dolgu: R.metin, renk: R.metin });
      s += S.yazi(cx2 + 6, cy2 + 46, 'Kuyruklu yıldız', { boy: 13, hiza: 'middle' });
      s += S.yazi(12, 290, 'Kesikli yol: kuyruklu yıldızın yörüngesi;', { boy: 13, renk: R.soluk });
      s += S.yazi(12, 297 + 9, 'noktalar: geride bıraktığı toz.', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  C.ekle('d19-olcek', {
    ders: 'd19', bolum: 7, oran: 0.72,
    baslik: 'Güneş Sistemi\'nin kenarına kadar: logaritmik ölçek',
    aciklama: 'Yatay eksen Güneş\'e uzaklığı AB cinsinden gösterir ve logaritmiktir: her çentik bir öncekinin 10 katıdır. Asteroit kuşağı 2,06 ile 3,27 AB, Kuiper kuşağı 30 ile 50 AB arasında; dağınık disk 1000 AB\'ye uzanır. Oort bulutunun iç kenarı 2000 ile 5000, dış kenarı 10.000 ile 100.000 AB arasında tahmin edilir; soluk uçlar bu belirsizliği gösterir. Işık 100.000 AB\'yi yaklaşık 1,58 yılda geçer.',
    kaynak: [{ ad: 'Wikipedia – Asteroid belt', url: 'https://en.wikipedia.org/wiki/Asteroid_belt' },
      { ad: 'NASA Science – Kuiper Belt: Facts', url: 'https://science.nasa.gov/solar-system/kuiper-belt/facts/' },
      { ad: 'NASA Science – Oort Cloud: Facts', url: 'https://science.nasa.gov/solar-system/oort-cloud/facts' }],
    ciz(S) {
      const R = S.R, x0 = 34, x1 = 362, X = au => x0 + Math.log10(au) / 5 * (x1 - x0), ya = 214;
      const bant = (a1, a2, y, renk, sd) => S.kutu(X(a1), y - 9, X(a2) - X(a1), 18, { dolgu: renk, renk: 'none', saydam: sd }, 3);
      let s = '';
      s += bant(2.06, 3.27, 30, R.soluk, 0.7) + S.yazi(X(3.27) + 8, 35, 'Asteroit kuşağı: 2,06–3,27 AB', { boy: 13 });
      s += bant(30, 50, 70, R.mavi, 0.75) + S.yazi(X(50) + 8, 75, 'Kuiper kuşağı: 30–50 AB', { boy: 13 });
      s += bant(50, 1000, 110, R.mavi, 0.3) + S.yazi(X(1000) + 8, 115, 'Dağınık disk', { boy: 13 });
      s += bant(2000, 5000, 150, R.ay, 0.25) + bant(5000, 10000, 150, R.ay, 0.6) + bant(10000, 100000, 150, R.ay, 0.25);
      s += S.yazi(X(2000) - 8, 155, 'Oort bulutu', { boy: 13, hiza: 'end' });
      s += S.yazi(X(2000) - 8, 171, '(öngörü)', { boy: 13, hiza: 'end', renk: R.soluk });
      /* gezegenler eksen üstünde (9. ders) */
      s += S.cizgi(x0, ya, x1, ya, { renk: R.soluk, kalin: 1 });
      [['Dünya', 1], ['Jüpiter', 5.2], ['Neptün', 30.2]].forEach(([ad, a]) => {
        s += S.daire(X(a), ya, 4.5, { dolgu: R.gezegen, renk: R.zemin, kalin: 1 });
        s += S.yazi(X(a), ya - 12, ad, { boy: 13, hiza: 'middle' });
      });
      [[1, '1'], [10, '10'], [100, '100'], [1000, '1000'], [10000, '10.000'], [100000, '100.000']].forEach(([a, t]) => {
        s += S.cizgi(X(a), ya, X(a), ya + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(a), ya + 20, t, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.yazi(200, ya + 42, 'Güneş\'e uzaklık (AB, logaritmik)', { boy: 14, hiza: 'middle', renk: R.soluk });
      s += S.yazi(200, ya + 64, 'Işık: 1 AB\'yi 8 dk 19 sn, 100.000 AB\'yi ~1,58 yılda geçer', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });
})();
