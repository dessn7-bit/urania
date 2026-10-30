/* cizim_v4a.js — fizik ünitesi ders çizimleri (d29, d31, d32). cizim.js kayıtları.
   Sayılar ders metninden (kaynaklı) gelir ya da burada formülle hesaplanır. Bağlanma enerjisi eğrisi AME2020 atom kütlesi
   tablosundan (her kütle numarası için en sıkı bağlı, ölçülmüş çekirdek). Her değerin kaynağı: arastirma/cizim_v4a_kaynak.md. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti, binlik nokta */
  const tr = (x, d) => {
    const s = Math.abs(x).toFixed(d == null ? 0 : d).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 ? '−' : '') + s.join(',');
  };
  const KAYNAK = {
    fresnel: { ad: 'Wikipedia: Fresnel equations', url: 'https://en.wikipedia.org/wiki/Fresnel_equations' },
    fermat: { ad: 'Wikipedia: Fermat\'s principle', url: 'https://en.wikipedia.org/wiki/Fermat%27s_principle' },
    yolIntegrali: { ad: 'Wikipedia: Path integral formulation', url: 'https://en.wikipedia.org/wiki/Path_integral_formulation' },
    fermilabDiyagram: { ad: 'Fermilab History: First Published Feynman Diagram, 1949', url: 'https://history.fnal.gov/virtual/feynman_diagram.html' },
    birse: { ad: 'M. Birse (Manchester): Feynman Diagrams ders notu', url: 'https://www.theory.physics.manchester.ac.uk/~mikeb/lecture/phys30121/feynman.pdf' },
    codata: { ad: 'CODATA 2022 (arXiv:2409.03787)', url: 'https://arxiv.org/pdf/2409.03787' },
    ame2020: { ad: 'AME2020 atom kütlesi tablosu (IAEA AMDC)', url: 'https://www-nds.iaea.org/amdc/ame2020/mass_1.mas20.txt' },
    hyper: { ad: 'HyperPhysics: Nuclear Binding Energy', url: 'https://hyperphysics.gsu.edu/hbase/NucEne/nucbin.html' },
    nikel62: { ad: 'Wikipedia: Nickel-62', url: 'https://en.wikipedia.org/wiki/Nickel-62' },
    sn1987a: { ad: 'Wikipedia: SN 1987A', url: 'https://en.wikipedia.org/wiki/SN_1987A' },
    ipem: { ad: 'IPEM: Radiation flash cards (2019)', url: 'https://www.ipem.ac.uk/media/exnj51ek/radiation-flash-cards-2019.pdf' },
    fda: { ad: 'US FDA: What are the Radiation Risks from CT? (arşiv)', url: 'https://webarchive.library.unt.edu/eot2008/20080916140327/http:/www.fda.gov/cdrh/ct/risks.html' },
    unscear: { ad: 'UNSCEAR 2000 basın bülteni', url: 'https://unis.unvienna.org/unis/en/pressrels/2000/unscear1.html' },
    cernSM: { ad: 'CERN: The Standard Model', url: 'https://home.cern/fr/science/physics/standard-model/' },
    wikiSM: { ad: 'Wikipedia: Standard Model', url: 'https://en.wikipedia.org/wiki/Standard_model' },
    kuark: { ad: 'Wikipedia: Quark', url: 'https://en.wikipedia.org/wiki/Quark' },
    wz: { ad: 'Wikipedia: W and Z bosons', url: 'https://en.wikipedia.org/wiki/W_and_Z_bosons' },
    higgs: { ad: 'Wikipedia: Higgs boson', url: 'https://en.wikipedia.org/wiki/Higgs_boson' },
    katrin: { ad: 'KIT: Neutrinos weigh less than 0.45 electronvolts (2025)', url: 'https://www.kit.edu/kit/english/pi_2025_029_astroparticle-physics-neutrinos-weigh-less-than-0-45-electronvolts.php' }
  };

  /* Dalgalı çizgi (foton, gluon): (x1,y1) → (x2,y2), dalga sayısı n, genlik g */
  const dalga = (S, x1, y1, x2, y2, n, g, o) => {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, adim = n * 12, ls = [];
    for (let i = 0; i <= adim; i++) {
      const t = i / adim, s = g * Math.sin(t * n * 2 * Math.PI);
      ls.push([x1 + ux * L * t - uy * s, y1 + uy * L * t + ux * s]);
    }
    return S.egri(ls, Object.assign({ renk: S.R.mavi, kalin: 1.8 }, o || {}));
  };
  /* Parçacık çizgisi: düz çizgi ve ortasında yönü gösteren üçgen */
  const parcacik = (S, x1, y1, x2, y2, o) => {
    o = Object.assign({ renk: S.R.metin, kalin: 2 }, o || {});
    const a = Math.atan2(y2 - y1, x2 - x1), mx = (x1 + x2) / 2 + 5 * Math.cos(a), my = (y1 + y2) / 2 + 5 * Math.sin(a), b = 9;
    const p = (d) => [mx - b * Math.cos(a + d), my - b * Math.sin(a + d)];
    const [p1, p2] = [p(0.45), p(-0.45)];
    return S.cizgi(x1, y1, x2, y2, o) + `<polygon points="${mx},${my} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}" fill="${o.renk}"/>`;
  };

  /* ================================================================ d29 ================================================================ */

  /* d29 · bölüm 3: dersteki "uzunluğu 0,2 olan iki ok" örneği; oklar ölçekli (0,2 = 50 birim). */
  C.ekle('d29-ok-toplami', {
    ders: 'd29', bolum: 3, oran: 0.66,
    baslik: 'Okları toplamak: aynı iki yol, yüzde 0 ile yüzde 16 arası',
    aciklama: 'Bir olayın iki gerçekleşme yolu var ve her yolun oku 0,2 uzunlukta; tek başına her biri yüzde 4 olasılık verirdi. Düz oklar iki yolun oklarıdır, kesikli ok toplamdır: ikinci okun kuyruğu birincinin ucuna konur. Oklar aynı yöne bakınca toplam 0,4 olur ve olasılık bunun karesi, yüzde 16\'dır. Zıt yöne bakınca ikinci ok başlangıç noktasına geri döner, toplam sıfırdır, olasılık yüzde 0. Dik açı yapınca toplam ok yaklaşık 0,283 uzunlukta, olasılık yüzde 8. Olasılıkları doğrudan toplasaydın üç durumda da yüzde 8 bulurdun. Okların boyları ölçeklidir.',
    kaynak: [KAYNAK.yolIntegrali, KAYNAK.fresnel],
    ciz(S) {
      const R = S.R, k = 250, a = 0.2 * k, yol = { renk: R.vurgu, kalin: 2.6, boy: 9 }, top = { renk: R.metin, kalin: 2.4, boy: 9, kesik: '6 4' };
      let s = S.yazi(8, 20, 'her yolun oku 0,2 uzunlukta: tek başına olasılık 0,2 × 0,2 = %4', { boy: 13, renk: R.soluk });
      s += S.cizgi(133, 36, 133, 214, { renk: R.cizgi, kalin: 1 }) + S.cizgi(267, 36, 267, 214, { renk: R.cizgi, kalin: 1 });
      const pan = [[67, 'aynı yön', 'toplam 0,4', '%16'], [200, 'zıt yön', 'toplam 0', '%0'], [333, 'dik açı', 'toplam ≈ 0,283', '%8']];
      pan.forEach(([cx, ad, t, p]) => {
        s += S.yazi(cx, 56, ad, { boy: 15, hiza: 'middle', renk: R.metin, kalin: true });
        s += S.yazi(cx, 180, t, { boy: 13, hiza: 'middle', renk: R.metin });
        s += S.yazi(cx, 202, 'olasılık ' + p, { boy: 15, hiza: 'middle', renk: R.vurgu, kalin: true });
      });
      /* 1: aynı yön */
      { const cx = 67, y = 112;
        s += S.ok(cx - a, y, cx, y, yol) + S.ok(cx, y, cx + a, y, yol);
        s += S.ok(cx - a, y + 18, cx + a, y + 18, top);
        s += S.daire(cx - a, y, 3, { dolgu: R.metin, renk: 'none' }); }
      /* 2: zıt yön: ikinci ok birincinin ucundan geri döner (okunsun diye biraz aşağı kaydırıldı) */
      { const cx = 200, y = 104, d = 14;
        s += S.ok(cx - a / 2, y, cx + a / 2, y, yol);
        s += S.cizgi(cx + a / 2, y, cx + a / 2, y + d, { renk: R.soluk, kalin: 1, kesik: '2 2' });
        s += S.ok(cx + a / 2, y + d, cx - a / 2, y + d, yol);
        s += S.daire(cx - a / 2, y, 4, { dolgu: R.metin, renk: 'none' });
        s += S.zeminliYazi(cx - a / 2 - 6, y + 42, 'başa döndü', { boy: 13, renk: R.soluk }); }
      /* 3: dik açı */
      { const cx = 333, y = 146;
        s += S.ok(cx - a / 2, y, cx + a / 2, y, yol) + S.ok(cx + a / 2, y, cx + a / 2, y - a, yol);
        s += S.ok(cx - a / 2, y, cx + a / 2 - 3, y - a + 3, top);
        s += S.daire(cx - a / 2, y, 3, { dolgu: R.metin, renk: 'none' }); }
      /* gösterge */
      s += S.ok(20, 236, 56, 236, Object.assign({}, yol, { boy: 7 })) + S.yazi(62, 241, 'bir yolun oku', { boy: 13, renk: R.metin });
      s += S.ok(200, 236, 236, 236, Object.assign({}, top, { boy: 7 })) + S.yazi(242, 241, 'toplam ok', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* d29 · bölüm 5: dersteki ayna örneği (lamba ve göz 1 m yukarıda, aralarında 2 m, 550 nm). Fazladan yol tam geometriden:
     ΔL(x) = √(1 + (1 + x)²) + √(1 + (1 − x)²) − 2√2 (metre); 1 mm'de 353,6 nm. Ok yönü = 2π × ΔL / 550 nm.
     Zincir: −1,5 … +1,5 mm, 0,05 mm'lik 61 şerit; toplam ok yatay olacak biçimde döndürüldü. */
  const fazlaYol = xmm => { const x = xmm / 1000; return (Math.sqrt(1 + (1 + x) * (1 + x)) + Math.sqrt(1 + (1 - x) * (1 - x)) - 2 * Math.SQRT2) * 1e9; };
  C.ekle('d29-ayna-sarmal', {
    ders: 'd29', bolum: 5, oran: 1.12,
    baslik: 'Aynanın ortası çalışır: yolun uzaması ve okların sarmalı',
    aciklama: 'Lamba ile göz aynadan 1\'er metre yukarıda ve aralarında 2 metre var; ışık yeşil, dalga boyu 550 nanometre. Üstteki eğri, yansıma noktası ortadan kaydıkça yolun ne kadar uzadığını gösterir: ortada eğri neredeyse düzdür, 1 milimetre kayınca yol 354 nanometre uzar ve kronometrenin ibresi 0,64 tur fazla döner. Alttaki zincir, aynanın ortadan sağa ve sola 1,5 milimetrelik kısmını 0,05 milimetrelik şeritlere bölüp her şeride bir ok koyar; okların yönü bu uzamadan hesaplandı. Ortadaki 1 milimetrenin kalın okları birbirine yakın yönlere bakar, aralarındaki açı 58 dereceyi geçmez; uç uca eklenince toplam okun boyunun yaklaşık yüzde 85\'ini sağlarlar. Uçlardaki ince oklar kendi çevresinde dönen sarmallar çizer ve birbirini götürür. Kesikli ok toplamdır.',
    kaynak: [KAYNAK.fermat, KAYNAK.yolIntegrali],
    ciz(S) {
      const R = S.R;
      /* üst: fazladan yol eğrisi */
      const ek = S.eksen({ x: 62, y: 34, w: 318, h: 130 }, { x0: -1.5, x1: 1.5, y0: 0, y1: 800 }, {
        xIsaret: [[-1.5, '−1,5'], [-1, '−1'], [-0.5, '−0,5'], [0, '0'], [0.5, '0,5'], [1, '1'], [1.5, '1,5']],
        yIsaret: [[0, '0'], [200, '200'], [400, '400'], [600, '600'], [800, '800']],
        xAd: 'yansıma noktası ortadan kaç mm uzakta', yAd: 'fazladan yol, nm', yAdUzak: 50
      });
      let s = ek.svg;
      const d1 = fazlaYol(1);
      s += S.cizgi(ek.X(1), ek.Y(0), ek.X(1), ek.Y(d1), { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.cizgi(ek.X(-1.5), ek.Y(d1), ek.X(1), ek.Y(d1), { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.fonk(ek, fazlaYol, -1.5, 1.5, 60, { renk: R.metin, kalin: 2.4 });
      s += S.daire(ek.X(1), ek.Y(d1), 4.5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 });
      s += S.zeminliYazi(ek.X(0), 54, '1 mm kayınca yol ' + tr(d1, 0) + ' nm uzar:', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.zeminliYazi(ek.X(0), 72, 'ibre ' + tr(d1 / 550, 2) + ' tur fazla döner', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.zeminliYazi(ek.X(0), ek.Y(0) - 30, 'ortada düz', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* alt: ok zinciri */
      const adim = 0.05, N = 61, oklar = [];
      let px = 0, py = 0;
      for (let i = 0; i < N; i++) {
        const x = -1.5 + i * adim, f = 2 * Math.PI * fazlaYol(x) / 550;
        oklar.push({ x, a: [px, py], b: [px + Math.cos(f), py + Math.sin(f)] });
        px += Math.cos(f); py += Math.sin(f);
      }
      const don = -Math.atan2(py, px), cd = Math.cos(don), sd = Math.sin(don);
      const dn = p => [p[0] * cd - p[1] * sd, p[0] * sd + p[1] * cd];
      oklar.forEach(o => { o.a = dn(o.a); o.b = dn(o.b); });
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      oklar.forEach(o => [o.a, o.b].forEach(p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }));
      const kutu = { x: 26, y: 262, w: 348, h: 150 }, k = Math.min(kutu.w / (x1 - x0), kutu.h / (y1 - y0));
      const ox = kutu.x + (kutu.w - (x1 - x0) * k) / 2 - x0 * k, oy = kutu.y + (kutu.h - (y1 - y0) * k) / 2 + y1 * k;
      const P = p => [ox + p[0] * k, oy - p[1] * k];
      s += S.yazi(8, 248, 'aynanın her 0,05 mm\'lik şeridine bir ok:', { boy: 13, renk: R.soluk });
      oklar.forEach(o => {
        const a = P(o.a), b = P(o.b), orta = Math.abs(o.x) <= 0.5 + 1e-9;
        s += S.ok(a[0], a[1], b[0], b[1], orta ? { renk: R.vurgu, kalin: 2.6, boy: 6 } : { renk: R.soluk, kalin: 1.2, boy: 4 });
      });
      const bas = P(oklar[0].a), son = P(oklar[N - 1].b);
      s += S.ok(bas[0], bas[1], son[0], son[1], { renk: R.metin, kalin: 2, boy: 9, kesik: '6 4' });
      s += S.zeminliYazi((bas[0] + son[0]) / 2 + 50, bas[1] - 8, 'toplam ok', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(394, 282, 'kalın: ortadaki 1 mm', { boy: 13, hiza: 'end', renk: R.vurgu, kalin: true });
      s += S.yazi(14, 418, 'uç şeritlerin okları döner', { boy: 13, renk: R.soluk });
      s += S.yazi(14, 436, 've birbirini götürür', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d29 · bölüm 8: iki elektronun foton alışverişi (dersin anlattığı en basit diyagram) ve iki fotonlu, dört köşeli terim. */
  C.ekle('d29-feynman-diyagrami', {
    ders: 'd29', bolum: 8, oran: 0.8,
    baslik: 'İki elektronun birbirini itmesinin Feynman diyagramı',
    aciklama: 'Zaman soldan sağa akar, dikey eksen uzaydır. Üstünde ok olan düz çizgiler elektronlar, dalgalı çizgiler fotonlardır; çizgilerin buluştuğu noktalar köşedir. Soldaki en basit diyagramda üstteki elektron bir köşede foton salar ve yön değiştirir; foton alttaki elektronda soğurulur, o da yön değiştirir. İki elektron bir foton alışverişiyle birbirini iter. Sağdaki diyagramda iki foton alışverişi ve dört köşe var; bu, serinin bir sonraki terimidir. İnce yapı sabiti yaklaşık 137\'de bir kadar küçük olduğu için çok köşeli diyagramların katkısı hızla küçülür. Diyagram parçacıkların yolunun fotoğrafı değil, hesaptaki bir terimin resmidir.',
    kaynak: [KAYNAK.fermilabDiyagram, KAYNAK.birse, KAYNAK.codata],
    ciz(S) {
      const R = S.R;
      let s = '';
      /* eksenler */
      s += S.ok(34, 292, 226, 292, { renk: R.soluk, kalin: 1.2, boy: 7 }) + S.yazi(130, 312, 'zaman', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.ok(16, 262, 16, 60, { renk: R.soluk, kalin: 1.2, boy: 7 }) + S.yazi(12, 160, 'uzay', { boy: 13, hiza: 'middle', renk: R.soluk, yan: -90 });
      /* sol: en basit diyagram */
      const V1 = [128, 108], V2 = [128, 212];
      s += S.yazi(128, 22, 'en basit: 2 köşe', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      s += parcacik(S, 38, 66, V1[0], V1[1]) + parcacik(S, V1[0], V1[1], 222, 62);
      s += parcacik(S, 38, 254, V2[0], V2[1]) + parcacik(S, V2[0], V2[1], 222, 258);
      s += dalga(S, V1[0], V1[1], V2[0], V2[1], 5, 6);
      [V1, V2].forEach(v => s += S.daire(v[0], v[1], 5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 }));
      s += S.yazi(34, 56, 'elektron', { boy: 13, renk: R.metin });
      s += S.yazi(34, 276, 'elektron', { boy: 13, renk: R.metin });
      s += S.yazi(116, 164, 'foton', { boy: 13, hiza: 'end', renk: R.mavi, kalin: true });
      s += S.yazi(142, 130, 'köşe: foton salar', { boy: 13, renk: R.vurgu });
      s += S.yazi(142, 196, 'köşe: soğurur', { boy: 13, renk: R.vurgu });
      /* sağ: iki foton, dört köşe */
      const W1 = [298, 112], W2 = [298, 208], W3 = [352, 112], W4 = [352, 208];
      s += S.cizgi(250, 30, 250, 300, { renk: R.cizgi, kalin: 1 });
      s += S.yazi(325, 22, 'sonraki terim: 4 köşe', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += parcacik(S, 262, 74, W1[0], W1[1]) + parcacik(S, W1[0], W1[1], W3[0], W3[1]) + parcacik(S, W3[0], W3[1], 392, 70);
      s += parcacik(S, 262, 250, W2[0], W2[1]) + parcacik(S, W2[0], W2[1], W4[0], W4[1]) + parcacik(S, W4[0], W4[1], 392, 254);
      s += dalga(S, W1[0], W1[1], W2[0], W2[1], 4, 5) + dalga(S, W3[0], W3[1], W4[0], W4[1], 4, 5);
      [W1, W2, W3, W4].forEach(v => s += S.daire(v[0], v[1], 4.5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 }));
      s += S.yazi(325, 276, 'α ≈ 1/137 küçük:', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(325, 294, 'katkısı çok daha az', { boy: 13, hiza: 'middle', renk: R.metin });
      return s;
    }
  });

  /* ================================================================ d31 ================================================================ */

  /* AME2020 (mass_1.mas20): her kütle numarası A = 2 … 240 için ölçülmüş (# tahmini olmayan) çekirdekler arasında en yüksek
     nükleon başına bağlanma enerjisi, MeV. Örnekler: H-2 1,112; He-4 7,074; Fe-56 8,790; Ni-62 8,795; U-238 7,570. */
  const BA = [1.112, 2.827, 7.074, 5.512, 5.332, 5.606, 7.062, 6.463, 6.498, 6.928, 7.680, 7.470, 7.520, 7.699, 7.976, 7.751, 7.767, 7.779, 8.032, 7.972,
    8.080, 8.111, 8.261, 8.224, 8.334, 8.332, 8.448, 8.449, 8.521, 8.481, 8.493, 8.514, 8.583, 8.538, 8.575, 8.570, 8.614, 8.563, 8.595, 8.576, 8.617, 8.601,
    8.658, 8.631, 8.669, 8.665, 8.723, 8.711, 8.756, 8.742, 8.776, 8.760, 8.778, 8.765, 8.790, 8.770, 8.792, 8.768, 8.781, 8.765, 8.795, 8.763, 8.777, 8.757,
    8.760, 8.737, 8.756, 8.725, 8.730, 8.718, 8.732, 8.705, 8.725, 8.701, 8.711, 8.696, 8.718, 8.696, 8.711, 8.696, 8.711, 8.696, 8.717, 8.699, 8.712, 8.711,
    8.733, 8.714, 8.710, 8.693, 8.693, 8.672, 8.667, 8.649, 8.654, 8.635, 8.635, 8.614, 8.619, 8.601, 8.607, 8.584, 8.587, 8.573, 8.580, 8.561, 8.567, 8.548,
    8.551, 8.537, 8.545, 8.527, 8.532, 8.517, 8.523, 8.510, 8.517, 8.499, 8.504, 8.485, 8.488, 8.472, 8.473, 8.458, 8.463, 8.446, 8.449, 8.436, 8.438, 8.424,
    8.428, 8.413, 8.414, 8.401, 8.403, 8.392, 8.393, 8.378, 8.376, 8.355, 8.347, 8.330, 8.327, 8.309, 8.304, 8.284, 8.280, 8.263, 8.262, 8.244, 8.244, 8.229,
    8.227, 8.217, 8.215, 8.204, 8.202, 8.189, 8.184, 8.174, 8.173, 8.162, 8.159, 8.147, 8.142, 8.132, 8.130, 8.117, 8.112, 8.102, 8.097, 8.087, 8.084, 8.071,
    8.064, 8.053, 8.049, 8.039, 8.035, 8.023, 8.018, 8.008, 8.005, 7.993, 7.989, 7.978, 7.974, 7.963, 7.962, 7.951, 7.949, 7.938, 7.936, 7.927, 7.927, 7.916,
    7.914, 7.907, 7.906, 7.898, 7.897, 7.887, 7.886, 7.878, 7.875, 7.870, 7.867, 7.849, 7.836, 7.820, 7.810, 7.794, 7.785, 7.768, 7.759, 7.745, 7.739, 7.724,
    7.717, 7.703, 7.697, 7.685, 7.680, 7.668, 7.662, 7.651, 7.645, 7.635, 7.631, 7.620, 7.615, 7.605, 7.601, 7.591, 7.586, 7.576, 7.570, 7.561, 7.556];
  const ba = A => BA[A - 2];

  /* d31 · bölüm 4: bağlanma enerjisi eğrisi ve demir tepesi */
  C.ekle('d31-baglanma-egrisi', {
    ders: 'd31', bolum: 4, oran: 0.82,
    baslik: 'Bağlanma enerjisi eğrisi ve demir tepesi',
    aciklama: 'Yatay eksen kütle numarası, yani proton ve nötron sayısının toplamı; dikey eksen nükleon başına bağlanma enerjisi, milyon elektronvolt cinsinden. Her kütle numarası için en sıkı bağlı çekirdeğin değeri 2020 atom kütlesi değerlendirmesinden, AME2020\'den alındı. Eğri döteryumdaki 1,11\'den hızla yükselir; helyum-4, 7,07 ile komşularından belirgin biçimde yüksektir. En yüksek nokta nikel-62 ile demir-56\'dır, ikisi de yaklaşık 8,79. Sonra eğri yavaşça iner ve uranyum-238\'de 7,57\'ye düşer. Hafif çekirdekleri birleştiren füzyon da ağır bir çekirdeği bölen fisyon da tepeye doğru gider; bu yüzden ikisi de enerji verir.',
    kaynak: [KAYNAK.ame2020, KAYNAK.hyper, KAYNAK.nikel62],
    ciz(S) {
      const R = S.R;
      const ek = S.eksen({ x: 54, y: 56, w: 326, h: 196 }, { x0: 0, x1: 240, y0: 0, y1: 9.5 }, {
        xIsaret: [[0, '0'], [50, '50'], [100, '100'], [150, '150'], [200, '200']],
        yIsaret: [[0, '0'], [2, '2'], [4, '4'], [6, '6'], [8, '8']],
        xAd: 'kütle numarası (proton + nötron)', yAd: 'MeV / nükleon', yAdUzak: 36
      });
      let s = ek.svg;
      [2, 4, 6, 8].forEach(v => s += S.cizgi(54, ek.Y(v), 380, ek.Y(v), { renk: R.cizgi, kalin: 0.8 }));
      const ls = []; for (let A = 2; A <= 240; A++) ls.push([ek.X(A), ek.Y(ba(A))]);
      s += S.egri(ls, { renk: R.metin, kalin: 2 });
      /* füzyon ve fisyon okları (eğrinin altında, tepeye doğru) */
      s += S.ok(ek.X(14), ek.Y(2.2), ek.X(40), ek.Y(6.9), { renk: R.vurgu, kalin: 2.4, boy: 9 });
      s += S.yazi(ek.X(26), ek.Y(2.6), 'füzyon', { boy: 15, renk: R.vurgu, kalin: true });
      s += S.ok(ek.X(234), ek.Y(4.6), ek.X(116), ek.Y(6.9), { renk: R.mavi, kalin: 2.4, boy: 9, kesik: '7 4' });
      s += S.yazi(ek.X(196), ek.Y(4.2), 'fisyon', { boy: 15, hiza: 'middle', renk: R.mavi, kalin: true });
      /* noktalar */
      const nk = (A, r) => S.daire(ek.X(A), ek.Y(ba(A)), 4.5, { dolgu: r || R.vurgu, renk: R.zemin, kalin: 1.2 });
      s += nk(2) + nk(4) + nk(56) + nk(62) + nk(238);
      s += S.yazi(ek.X(2) + 10, ek.Y(ba(2)) + 5, 'döteryum: ' + tr(ba(2), 2), { boy: 13, renk: R.metin });
      s += S.cizgi(ek.X(4) + 4, ek.Y(ba(4)) + 4, ek.X(28) - 4, ek.Y(5.2) - 12, { renk: R.soluk, kalin: 1 });
      s += S.zeminliYazi(ek.X(28), ek.Y(5.2), 'helyum-4: ' + tr(ba(4), 2), { boy: 13, renk: R.metin });
      s += S.cizgi(ek.X(59), ek.Y(8.8) - 5, ek.X(74), 40, { renk: R.soluk, kalin: 1 });
      s += S.yazi(ek.X(76), 24, 'demir tepesi', { boy: 15, renk: R.metin, kalin: true });
      s += S.yazi(ek.X(76), 42, 'nikel-62 ve demir-56: ' + tr(ba(62), 2), { boy: 13, renk: R.metin });
      s += S.zeminliYazi(ek.X(238), ek.Y(ba(238)) + 22, 'uranyum-238: ' + tr(ba(238), 2), { boy: 13, hiza: 'end', renk: R.metin });
      return s;
    }
  });

  /* d31 · bölüm 10: kobalt-56'nın bozunması (T = 77,3 gün); 365 günde (1/2)^(365/77,3) ≈ 0,038 */
  C.ekle('d31-kobalt-yarilanma', {
    ders: 'd31', bolum: 10, oran: 0.74,
    baslik: 'Kobalt-56\'nın yarılanma saati ve SN 1987A\'nın sönüşü',
    aciklama: 'Eğri, kobalt-56 çekirdeklerinden ne kadarının kaldığını gösterir. Her 77,3 günde kalanın yarısı bozunur: 77,3 gün sonra yarısı, 154,6 gün sonra dörtte biri, 231,9 gün sonra sekizde biri, 309,2 gün sonra on altıda biri kalır. Basamaklar eşit sürelidir, ama her basamaktaki düşüş bir öncekinin yarısıdır; eğri bu yüzden giderek yatıklaşır. Bir yıl, yani 365 gün sonra yaklaşık 4,72 yarılanma ömrü geçmiştir ve kobaltın yalnızca yüzde 3,8\'i kalır. SN 1987A\'nın bu kaynaktan gelen ışığı da kabaca aynı oranla azaldı.',
    kaynak: [KAYNAK.sn1987a],
    ciz(S) {
      const R = S.R, T = 77.3, f = t => Math.pow(0.5, t / T);
      const ek = S.eksen({ x: 66, y: 40, w: 316, h: 190 }, { x0: 0, x1: 400, y0: 0, y1: 1 }, {
        xIsaret: [[0, '0'], [T, '77'], [2 * T, '155'], [3 * T, '232'], [4 * T, '309'], [365, '365']],
        yIsaret: [[0, '%0'], [0.25, '%25'], [0.5, '%50'], [0.75, '%75'], [1, '%100']],
        xAd: 'patlamadan bu yana geçen gün', yAd: 'kalan kobalt-56', yAdUzak: 52
      });
      let s = ek.svg;
      [0.25, 0.5, 0.75, 1].forEach(v => s += S.cizgi(66, ek.Y(v), 382, ek.Y(v), { renk: R.cizgi, kalin: 0.8 }));
      s += S.fonk(ek, f, 0, 400, 80, { renk: R.metin, kalin: 2.4 });
      const et = ['1/2', '1/4', '1/8', '1/16'];
      for (let i = 1; i <= 4; i++) {
        const t = i * T, y = f(t);
        s += S.cizgi(ek.X(t), ek.Y(0), ek.X(t), ek.Y(y), { renk: R.soluk, kalin: 1, kesik: '2 3' });
        s += S.daire(ek.X(t), ek.Y(y), 4.5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 });
        s += i < 3 ? S.zeminliYazi(ek.X(t) + 8, ek.Y(y) - 8, et[i - 1], { boy: 14, renk: R.metin, kalin: true })
          : S.zeminliYazi(ek.X(t), ek.Y(y) - 12, et[i - 1], { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      }
      const y1 = f(365);
      s += S.daire(ek.X(365), ek.Y(y1), 5, { dolgu: R.metin, renk: R.zemin, kalin: 1.2 });
      s += S.zeminliYazi(ek.X(365) + 10, ek.Y(0.3), '1 yıl: %' + tr(y1 * 100, 1), { boy: 13, hiza: 'end', renk: R.metin, kalin: true });
      s += S.cizgi(ek.X(365), ek.Y(y1) - 7, ek.X(365), ek.Y(0.3) + 6, { renk: R.soluk, kalin: 1 });
      s += S.yazi(380, 20, 'her 77,3 günde kalanın yarısı', { boy: 13, hiza: 'end', renk: R.vurgu, kalin: true });
      return s;
    }
  });

  /* d31 · bölüm 15: gündelik dozlar (milisievert, logaritmik eksen). Değerler ders bölüm 14–15'ten. */
  C.ekle('d31-doz-merdiveni', {
    ders: 'd31', bolum: 15, oran: 0.92,
    baslik: 'Muzdan Mars yolculuğuna radyasyon dozları',
    aciklama: 'Her satırda bir dozun milisievert cinsinden değeri bir noktayla gösterilir. Eksen logaritmiktir: iki ince dikey çizgi arası 10 kattır, bu yüzden bir muzdan radyasyon hastalığı eşiğine kadar 10 milyon katlık aralık tek çizime sığar. Kesikli dikey çizgi, doğal radyasyondan bir yılda alınan dünya ortalamasıdır, 2,4 milisievert. Muz, diş ve göğüs röntgeni ile 8 saatlik bir Atlantik uçuşu bu çizginin çok solunda kalır. Kafa tomografisi, kaynağa göre 1,4 ile 2,0 arasında, ona yakındır. Karın tomografisi ve radyasyon çalışanlarının yıllık sınırı onun yaklaşık 4 ve 8 katıdır, Mars\'a gidip dönmek ise yaklaşık 250 katı. Değerler tipiktir; doz cihaza ve kişiye göre değişir.',
    kaynak: [KAYNAK.ipem, KAYNAK.fda, KAYNAK.unscear],
    ciz(S) {
      const R = S.R, x0 = 198, x1 = 386, X = v => x0 + (Math.log10(v) + 4) / 7 * (x1 - x0);
      const sat = [['muz', 0.0001, '0,0001'], ['diş röntgeni', 0.01, '0,01'], ['göğüs röntgeni', 0.02, '0,02'], ['8 saatlik uçuş', 0.08, '0,08'],
        ['kafa tomografisi', [1.4, 2.0], '1,4–2,0'], ['doğal doz, 1 yıl', 2.4, '2,4'], ['karın tomografisi', 10, '10'],
        ['çalışan yıllık sınırı', 20, '20'], ['Mars gidiş-dönüş', 600, '600'], ['radyasyon hastalığı', 1000, '1.000']];
      const y0 = 60, dy = 26, yS = y0 + dy * (sat.length - 1) + 16;
      let s = S.yazi(8, 22, 'etkin doz, milisievert', { boy: 13, renk: R.soluk });
      for (let e = -4; e <= 3; e++) s += S.cizgi(X(Math.pow(10, e)), 40, X(Math.pow(10, e)), yS, { renk: R.cizgi, kalin: 0.8 });
      s += S.cizgi(x0, yS, x1, yS, { renk: R.soluk, kalin: 1 });
      [[0.0001, '0,0001'], [0.01, '0,01'], [1, '1'], [100, '100']].forEach(([v, t]) => s += S.cizgi(X(v), yS, X(v), yS + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(v), yS + 20, t, { boy: 13, hiza: 'middle', renk: R.soluk }));
      s += S.yazi((x0 + x1) / 2, yS + 40, 'iki çizgi arası 10 kat', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* yıllık doğal doz çizgisi */
      s += S.cizgi(X(2.4), 40, X(2.4), yS, { renk: R.vurgu, kalin: 1.6, kesik: '5 4' });
      s += S.yazi(X(2.4), 34, 'yıllık doğal doz', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      sat.forEach(([ad, v, t], i) => {
        const y = y0 + i * dy, dogal = i === 5;
        s += S.cizgi(x0, y, x1, y, { renk: R.cizgi, kalin: 0.6, kesik: '1 3' });
        s += S.yazi(8, y + 5, ad + ': ' + t, { boy: 13, renk: dogal ? R.vurgu : R.metin, kalin: dogal });
        if (Array.isArray(v)) s += S.cizgi(X(v[0]), y, X(v[1]), y, { renk: R.metin, kalin: 7, uc: 'round' });
        else s += S.daire(X(v), y, 5, { dolgu: dogal ? R.vurgu : R.metin, renk: R.zemin, kalin: 1.2 });
      });
      return s;
    }
  });

  /* ================================================================ d32 ================================================================ */

  /* d32 · bölüm 1: proton (yukarı, yukarı, aşağı) ve nötron (yukarı, aşağı, aşağı); yükler elektron yükü biriminde. Ölçeksiz. */
  C.ekle('d32-proton-notron', {
    ders: 'd32', bolum: 1, oran: 0.8,
    baslik: 'Proton ve nötronun içindeki kuarklar',
    aciklama: 'Proton iki yukarı kuark ile bir aşağı kuarktan, nötron iki aşağı kuark ile bir yukarı kuarktan oluşur. Düz çerçeveli daireler yukarı kuarklardır ve elektron yükünün büyüklüğünün üçte ikisi kadar artı yük taşır; kesikli çerçeveliler aşağı kuarklardır ve üçte biri kadar eksi yük taşır. Protonda üçte iki, üçte iki ve eksi üçte bir toplanınca artı 1 çıkar; nötronda üçte iki, eksi üçte bir ve eksi üçte bir toplanınca sıfır. Kuarkları aradaki dalgalı çizgilerle gösterilen gluonlar bir arada tutar. Çizim ölçeksizdir: deneylerde kuarklar nokta gibi davranır.',
    kaynak: [KAYNAK.kuark, KAYNAK.cernSM],
    ciz(S) {
      const R = S.R, rq = 29;
      const kuark = (x, y, tur) => {
        const yk = tur === 'y';
        return S.daire(x, y, rq, { dolgu: yk ? R.vurguSoluk : R.yuzey2, renk: yk ? R.vurgu : R.metin, kalin: 2, kesik: yk ? null : '5 3' }) +
          S.yazi(x, y - 2, yk ? 'yukarı' : 'aşağı', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true }) +
          S.yazi(x, y + 15, yk ? '+2/3' : '−1/3', { boy: 13, hiza: 'middle', renk: R.metin });
      };
      const hadron = (cx, cy, ad, turler, toplam, yuk) => {
        const kon = [[cx, cy - 44], [cx - 42, cy + 28], [cx + 42, cy + 28]];
        let o = S.daire(cx, cy, 90, { dolgu: R.yuzey, renk: R.soluk, kalin: 1.5 });
        o += S.yazi(cx, 32, ad, { boy: 16, hiza: 'middle', renk: R.metin, kalin: true });
        /* gluonlar: kuark çiftleri arası dalgalı çizgi */
        [[0, 1], [0, 2], [1, 2]].forEach(([i, j]) => {
          const a = kon[i], b = kon[j], L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
          o += dalga(S, a[0] + ux * (rq + 2), a[1] + uy * (rq + 2), b[0] - ux * (rq + 2), b[1] - uy * (rq + 2), 2, 3.5, { kalin: 1.6 });
        });
        kon.forEach((p, i) => o += kuark(p[0], p[1], turler[i]));
        o += S.yazi(cx, cy + 58, 'gluon', { boy: 13, hiza: 'middle', renk: R.mavi });
        o += S.yazi(cx, 256, toplam, { boy: 13, hiza: 'middle', renk: R.metin });
        o += S.yazi(cx, 278, yuk, { boy: 15, hiza: 'middle', renk: R.vurgu, kalin: true });
        return o;
      };
      let s = hadron(104, 146, 'proton', ['y', 'y', 'a'], '2/3 + 2/3 − 1/3', 'yük +1');
      s += hadron(296, 146, 'nötron', ['y', 'a', 'a'], '2/3 − 1/3 − 1/3', 'yük 0');
      s += S.yazi(200, 310, 'yükler elektron yükü biriminde; ölçeksiz', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d32 · bölüm 8: Standart Model tablosu (12 fermiyon, 4 taşıyıcı, Higgs). Yalnız adlar ve yükler; kütleler d32-kutle-merdiveni'nde. */
  C.ekle('d32-standart-model', {
    ders: 'd32', bolum: 8, oran: 0.84,
    baslik: 'Standart Model: 17 temel parçacık',
    aciklama: 'Solda 12 madde parçacığı, yani fermiyonlar, üç kuşak hâlinde üç sütuna dizilir; her kuşak bir öncekinin daha ağır bir kopyasıdır. Düz çerçeveli üst iki satır kuarklardır: yukarı, tılsımlı ve üst kuarklar artı üçte iki, aşağı, garip ve alt kuarklar eksi üçte bir yük taşır. Kesikli çerçeveli alt iki satır leptonlardır: elektron, müon ve tau eksi 1 yük taşır, üç nötrino yüksüzdür. Sağdaki yuvarlak köşeli kutular kuvvet taşıyıcısı bozonlardır: güçlü kuvveti gluon, elektromanyetizmayı foton, zayıf kuvveti W ve Z taşır. En sağda Higgs bozonu durur. 12 artı 4 artı 1, toplam 17. Çevrendeki kararlı maddenin hepsi birinci sütundandır.',
    kaynak: [KAYNAK.cernSM, KAYNAK.wikiSM],
    ciz(S) {
      const R = S.R, sx = [52, 120, 188], sw = 64, bx = 262, bw = 74, hx = 344, hw = 50, yr = [52, 102, 152, 202], h = 44;
      let s = '';
      s += S.yazi(152, 16, 'madde: 12 fermiyon', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(326, 16, 'bozonlar', { boy: 13, hiza: 'middle', renk: R.soluk });
      ['1. kuşak', '2. kuşak', '3. kuşak'].forEach((t, i) => s += S.yazi(sx[i] + sw / 2, 40, t, { boy: 13, hiza: 'middle', renk: R.metin, kalin: true }));
      s += S.yazi(bx + bw / 2, 40, 'taşıyıcı', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(46, 40, 'yük', { boy: 13, hiza: 'end', renk: R.soluk });
      const ad = [['yukarı', 'tılsımlı', 'üst'], ['aşağı', 'garip', 'alt'], ['elektron', 'müon', 'tau'],
        [['elektron', 'nötrinosu'], ['müon', 'nötrinosu'], ['tau', 'nötrinosu']]];
      const yuk = ['+2/3', '−1/3', '−1', '0'];
      ad.forEach((satir, r) => {
        const kuark = r < 2, y = yr[r];
        s += S.yazi(46, y + h / 2 + 5, yuk[r], { boy: 13, hiza: 'end', renk: R.metin });
        satir.forEach((t, c) => {
          s += S.kutu(sx[c], y, sw, h, { dolgu: kuark ? R.vurguSoluk : R.yuzey2, renk: kuark ? R.vurgu : R.metin, kalin: 1.6, kesik: kuark ? null : '4 3' }, 4);
          if (Array.isArray(t)) {
            s += S.yazi(sx[c] + sw / 2, y + 19, t[0], { boy: 13, hiza: 'middle', renk: R.metin });
            s += S.yazi(sx[c] + sw / 2, y + 35, t[1], { boy: 13, hiza: 'middle', renk: R.metin });
          } else s += S.yazi(sx[c] + sw / 2, y + h / 2 + 5, t, { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
        });
      });
      /* grup adları (yan yazı) */
      s += S.yazi(14, (yr[0] + yr[1] + h) / 2, 'kuarklar', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true, yan: -90 });
      s += S.yazi(14, (yr[2] + yr[3] + h) / 2, 'leptonlar', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true, yan: -90 });
      /* bozonlar */
      [['gluon', 'güçlü'], ['foton', 'EM'], ['Z bozonu', 'zayıf'], ['W bozonu', 'zayıf']].forEach(([t, k], r) => {
        const y = yr[r];
        s += S.kutu(bx, y, bw, h, { dolgu: R.yuzey, renk: R.mavi, kalin: 1.8 }, 14);
        s += S.yazi(bx + bw / 2, y + 19, t, { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
        s += S.yazi(bx + bw / 2, y + 35, k, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.elips(hx + hw / 2, (yr[1] + yr[2] + h) / 2, hw / 2, 56, { dolgu: R.yuzey, renk: R.mavi, kalin: 2.4 });
      s += S.yazi(hx + hw / 2, (yr[1] + yr[2] + h) / 2 + 5, 'Higgs', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(200, 276, '12 fermiyon + 4 taşıyıcı + Higgs = 17', { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(200, 298, 'düz çerçeve: kuark · kesikli: lepton · yuvarlak: bozon', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(200, 318, 'alt satır: taşıdığı kuvvet (EM: elektromanyetik)', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d32 · bölüm 15: temel parçacıkların kütle enerjileri, logaritmik (eV). Proton temel değil, karşılaştırma için boş daire. */
  C.ekle('d32-kutle-merdiveni', {
    ders: 'd32', bolum: 15, oran: 0.9,
    baslik: 'Temel parçacıkların kütle merdiveni',
    aciklama: 'Her satırdaki nokta bir parçacığın kütle enerjisini gösterir. Eksen logaritmiktir: iki ince dikey çizgi arası 10 kattır. Elektron 0,511 milyon elektronvolt, müon 105,7 milyon, tau 1,78 milyar, W ve Z bozonları 80,4 ve 91,2 milyar, Higgs bozonu yaklaşık 125 milyar, üst kuark yaklaşık 173 milyar elektronvolttur. Boş daire temel bir parçacık olmayan protondur ve karşılaştırma için konuldu: 938 milyon elektronvolt. Nötrino için yalnızca bir üst sınır var, 0,45 elektronvolt; sola bakan ok gerçek değerin daha küçük olabileceğini gösterir. Elektron ile üst kuark arasında yaklaşık 340 bin kat, nötrino ile üst kuark arasında en az 380 milyar kat fark var; Standart Model bu farkların nedenini söylemez.',
    kaynak: [KAYNAK.wikiSM, KAYNAK.wz, KAYNAK.higgs, KAYNAK.katrin],
    ciz(S) {
      const R = S.R, x0 = 184, x1 = 388, e0 = -2, e1 = 12, X = v => x0 + (Math.log10(v) - e0) / (e1 - e0) * (x1 - x0);
      const sat = [['nötrino: < 0,45 eV', 0.45, 'n'], ['elektron: 0,511 MeV', 0.511e6], ['müon: 105,7 MeV', 105.7e6], ['proton: 938 MeV', 938e6, 'p'],
        ['tau: 1,78 GeV', 1.78e9], ['W bozonu: 80,4 GeV', 80.369e9], ['Z bozonu: 91,2 GeV', 91.188e9], ['Higgs: ≈125 GeV', 125.11e9], ['üst kuark: ≈173 GeV', 173e9]];
      const y0 = 50, dy = 26, yS = y0 + dy * (sat.length - 1) + 16;
      let s = S.yazi(8, 22, 'kütle enerjisi, elektronvolt (eV)', { boy: 13, renk: R.soluk });
      for (let e = e0; e <= e1; e++) s += S.cizgi(X(Math.pow(10, e)), 34, X(Math.pow(10, e)), yS, { renk: R.cizgi, kalin: 0.8 });
      s += S.cizgi(x0, yS, x1, yS, { renk: R.soluk, kalin: 1 });
      [[1, '1 eV'], [1e3, '1 keV'], [1e6, '1 MeV'], [1e9, '1 GeV']].forEach(([v, t]) => s += S.cizgi(X(v), yS, X(v), yS + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(v), yS + 20, t, { boy: 13, hiza: 'middle', renk: R.soluk }));
      s += S.yazi(8, yS + 20, 'iki çizgi arası 10 kat', { boy: 13, renk: R.soluk });
      sat.forEach(([ad, v, tur], i) => {
        const y = y0 + i * dy;
        s += S.cizgi(x0, y, x1, y, { renk: R.cizgi, kalin: 0.6, kesik: '1 3' });
        s += S.yazi(8, y + 5, ad, { boy: 13, renk: tur === 'p' ? R.soluk : R.metin, kalin: tur !== 'p' });
        if (tur === 'n') s += S.ok(X(v), y, x0 + 2, y, { renk: R.metin, kalin: 2, boy: 7 }) + S.cizgi(X(v), y - 7, X(v), y + 7, { renk: R.metin, kalin: 2 });
        else if (tur === 'p') s += S.daire(X(v), y, 5, { dolgu: R.zemin, renk: R.metin, kalin: 1.6 });
        else s += S.daire(X(v), y, 5, { dolgu: R.vurgu, renk: R.zemin, kalin: 1.2 });
      });
      /* oranlar: 173.000 ÷ 0,511 ≈ 338.600 → ≈340 bin; 173 × 10⁹ ÷ 0,45 ≈ 384 × 10⁹ → ders "en az 380 milyar" */
      s += S.yazi(8, yS + 46, 'elektron → üst kuark: ≈' + tr(Math.round(173e3 / 0.511 / 1e4) * 10, 0) + ' bin kat', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(8, yS + 66, 'nötrino → üst kuark: en az 380 milyar kat', { boy: 13, renk: R.vurgu, kalin: true });
      return s;
    }
  });
})();
