/* cizim_v5b.js — ders çizimleri (d37, d38, d39, d40). cizim.js kayıtları; kaynaklar: arastirma/cizim_v5b_kaynak.md
   Dersler: d37 (Jüpiter), d38 (Satürn ve halkaları), d39 (Uranüs ve Neptün), d40 (dev gezegenlerin uyduları).
   Sayılar ders metninden (kaynaklı) gelir ya da burada formülle hesaplanır; dersin dışından gelen tek tük değer
   (Ay'ın ve Plüton'un yarıçapı) NASA NSSDCA bilgi kartlarından. Kesitlerde ölçekli olan ve olmayan her şey alt yazıda söylenir. */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti, binlik nokta */
  const tr = (x, d) => {
    const s = Math.abs(x).toFixed(d == null ? 0 : d).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 ? '−' : '') + s.join(',');
  };
  const n2 = x => Math.round(x * 100) / 100;
  const KAYNAK = {
    jupKart: { ad: 'NASA NSSDCA: Jupiter Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html' },
    satKart: { ad: 'NASA NSSDCA: Saturn Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html' },
    uraKart: { ad: 'NASA NSSDCA: Uranus Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html' },
    nepKart: { ad: 'NASA NSSDCA: Neptune Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html' },
    ayKart: { ad: 'NASA NSSDCA: Moon Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html' },
    plutonKart: { ad: 'NASA NSSDCA: Pluto Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html' },
    jupUydu: { ad: 'NASA NSSDCA: Jovian Satellite Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html' },
    nepUydu: { ad: 'NASA NSSDCA: Neptunian Satellite Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptuniansatfact.html' },
    liu: { ad: 'Liu ve ark. 2019, Nature (seyrelmiş çekirdek)', url: 'https://link.springer.com/article/10.1038/s41586-019-1470-2' },
    earthskyGrs: { ad: 'EarthSky: Great Red Spot is 190 years old', url: 'https://earthsky.org/space/jupiters-great-red-spot-is-190-years-old/' },
    ioTorus: { ad: 'Wikipedia: Io plasma torus', url: 'https://en.wikipedia.org/wiki/Io_plasma_torus' },
    caltechHalka: { ad: 'Caltech: Saturn makes waves in its own rings', url: 'https://www.astro.caltech.edu/news/saturn-makes-waves-in-its-own-rings' },
    pdsHalka: { ad: 'NASA PDS Ring-Moon Systems Node: Saturn rings table', url: 'https://pds-rings.seti.org:443/saturn/saturn_rings_table.html' },
    jplSaturnGunu: { ad: 'JPL: Scientists finally know what time it is on Saturn', url: 'https://www.jpl.nasa.gov/news/scientists-finally-know-what-time-it-is-on-saturn/' },
    helledFortney: { ad: 'Helled ve Fortney 2020 (arXiv:2007.10783)', url: 'https://arxiv.org/pdf/2007.10783' },
    wikiNeptun: { ad: 'Wikipedia: Neptune', url: 'https://en.wikipedia.org/wiki/Neptune' },
    slac: { ad: 'SLAC: diamond rain', url: 'https://www6.slac.stanford.edu/news/2022-09-02-diamond-rain-giant-ice-planets-could-be-more-common-previously-thought' },
    esaHubbleUranus: { ad: 'ESA/Hubble: Uranüs\'ün dönme süresi (heic2503)', url: 'https://esahubble.org/news/heic2503/' },
    eylemsizlik: { ad: 'Wikipedia: Moment of inertia factor', url: 'https://en.wikipedia.org/wiki/Moment_of_inertia_factor' },
    wikiGalileo: { ad: 'Wikipedia: Galilean moons', url: 'https://en.wikipedia.org/wiki/Galilean_moons' }
  };

  /* Yarım elips (sol ya da sağ yarı) yolu; f: ölçek çarpanı */
  const yari = (cx, cy, rx, ry, sol) => `M${n2(cx)},${n2(cy - ry)} A${n2(rx)},${n2(ry)} 0 0 ${sol ? 0 : 1} ${n2(cx)},${n2(cy + ry)} Z`;
  /* Numaralı işaret ve gösterge satırı */
  const isaret = (S, x, y, no) => S.daire(x, y, 8.5, { dolgu: S.R.zemin, renk: S.R.metin, kalin: 1.3 }) + S.yazi(x, y + 4.6, String(no), { boy: 13, hiza: 'middle', kalin: true });
  const madde = (S, x, y, no, metin, renk) => isaret(S, x + 9, y - 4.5, no) + S.yazi(x + 24, y, metin, { boy: 13, renk: renk || S.R.metin });

  /* ================================================================ d37 ================================================================ */

  /* d37 · bölüm 3: eski "küçük sıkı çekirdek" resmi ile Juno sonrası seyrelmiş çekirdek; dış biçim gerçek basıklıkla (0,065). */
  C.ekle('d37-ic-yapi', {
    ders: 'd37', bolum: 3, oran: 1.1,
    baslik: 'Jüpiter\'in içi: eski resim ve Juno\'dan sonra',
    aciklama: 'Gezegen ortadan ikiye bölündü. Sol yarı eski ders kitabı resmidir: hidrojen ve helyumdan bir zarfın ortasında kaya ve buzdan küçük, sıkı bir çekirdek. Sağ yarı Juno\'nun çekim ölçümlerine uyan modellerdir: ağır elementler merkezden dışa doğru seyrelerek, belki yarıçapın yarısına kadar dağılmıştır; küçük sıkı bir çekirdek henüz dışlanamıyor. İki yarıda da metalik hidrojen merkeze giden yolun yaklaşık üçte birinden içeride başlar. Dış biçim gerçek basıklıkla, katman sınırları ve 3000 kilometrelik jet derinliği ölçekli çizildi; eski çekirdeğin boyu ve seyrelmiş çekirdeğin tonları şematiktir. Merkezde basınç Dünya atmosferinin 50 ile 100 milyon katıdır.',
    kaynak: [KAYNAK.jupKart, KAYNAK.liu],
    ciz(S) {
      const R = S.R, cx = 200, cy = 166, ra = 128, rb = ra * 66854 / 71492;     // ekvator 71.492, kutup 66.854 km
      const E = (f, sol, o) => S.yol(yari(cx, cy, ra * f, rb * f, sol), o);
      let s = '';
      s += S.yazi(8, 20, 'Eski ders kitabı resmi', { boy: 14, kalin: true });
      s += S.yazi(392, 20, 'Juno\'ya uyan modeller', { boy: 14, kalin: true, hiza: 'end', renk: R.vurgu });
      [true, false].forEach(sol => {
        s += E(1, sol, { dolgu: R.mavi, saydam: 0.2, renk: 'none' });
        s += E(2 / 3, sol, { dolgu: R.mavi, saydam: 0.45, renk: 'none' });
      });
      /* sol: sıkı çekirdek (şematik boy) */
      s += E(0.14, true, { dolgu: R.gezegen, renk: R.metin, kalin: 1.2 });
      /* sağ: seyrelmiş çekirdek — merkeze doğru koyulaşan halkalar, dış sınırı belirsiz (kesik) */
      [0.5, 0.4, 0.3, 0.2, 0.1].forEach(f => { s += E(f, false, { dolgu: R.gezegen, saydam: 0.2, renk: 'none' }); });
      s += E(0.5, false, { renk: R.gezegen, kalin: 1.3, kesik: '5 4' });
      s += S.daire(cx, cy, 0.075 * ra, { renk: R.metin, kalin: 1.2, kesik: '3 3' });
      s += S.yazi(cx + 2, cy + 5, '?', { boy: 14, kalin: true });
      /* sağ: jet akımları, 3000 km (yarıçapın %4,2'si) */
      const fj = 1 - 3000 / 71492 / 2;
      s += S.yol(`M${cx},${n2(cy - rb * fj)} A${n2(ra * fj)},${n2(rb * fj)} 0 0 1 ${cx},${n2(cy + rb * fj)}`, { renk: R.uyari, kalin: n2(ra * 3000 / 71492), saydam: 0.75 });
      /* dış çizgi ve orta ayraç */
      s += S.elips(cx, cy, ra, rb, { renk: R.metin, kalin: 1.5 });
      s += S.cizgi(cx, cy - rb - 8, cx, cy + rb + 8, { renk: R.metin, kalin: 1.2, kesik: '4 3' });
      /* işaretler */
      s += isaret(S, cx - ra * 0.84, cy, 1) + isaret(S, cx - ra * 0.42, cy, 2) + isaret(S, cx - 34, cy + 2, 3);
      s += S.cizgi(cx - 25.5, cy + 2, cx - ra * 0.14 + 2, cy + 2, { renk: R.metin, kalin: 1 });
      s += isaret(S, cx + ra * 0.33, cy - 26, 4) + isaret(S, cx + 30, cy + 24, 5);
      s += S.cizgi(cx + 22, cy + 18, cx + 9, cy + 8, { renk: R.metin, kalin: 1 });
      const a6 = 50 * Math.PI / 180;
      s += isaret(S, cx + ra * 1.1 * Math.cos(a6), cy - rb * 1.1 * Math.sin(a6), 6);
      /* gösterge */
      const g = [[1, 'Hidrojen ve helyum: derinde yavaşça sıvılaşır'], [2, 'Metalik hidrojen: yolun ~1/3\'ünden merkeze dek'],
        [3, 'Kaya-buz çekirdek, birkaç Dünya kütlesi (şematik)'], [4, 'Seyrelmiş çekirdek: belki yarıçapın yarısına dek'],
        [5, 'Küçük sıkı çekirdek? Henüz dışlanamadı'], [6, 'Jet akımları: ~3000 km derine iner (ölçekli)']];
      g.forEach(([no, t], i) => { s += madde(S, 6, 318 + i * 20, no, t, i >= 3 ? R.vurgu : R.metin); });
      s += S.yazi(8, 438, 'Merkezde basınç: Dünya atmosferinin 50–100 milyon katı', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d37 · bölüm 7: Büyük Kırmızı Leke'nin uzun ekseni yıllara göre (ölçekli) ve yandan kesiti (ölçekli). */
  C.ekle('d37-kirmizi-leke', {
    ders: 'd37', bolum: 7, oran: 0.94,
    baslik: 'Büyük Kırmızı Leke küçülüyor ve çok yassı',
    aciklama: 'Üstteki çubuklar lekenin uzun eksenidir ve aynı ölçekte çizildi. 1879\'da yaklaşık 39.000 kilometre, 1979\'da Dünya çapının iki katı kadar, 2017\'de 16.350, bugün yaklaşık 14.000 kilometre. Kesik dikey çizgi Dünya\'nın çapıdır, 12.756 kilometre: leke artık bir Dünya çapından biraz büyük. Alttaki kesit de ölçeklidir: 14.000 kilometre genişliğindeki leke bulut tepelerinin yalnızca 200 ile 500 kilometre altına iner, onu besleyen jet akımları ise yaklaşık 3000 kilometre derindedir. Bu oranda 28 santimetrelik bir pizza yaklaşık 1 santimetre kalınlıkta olurdu.',
    kaynak: [KAYNAK.earthskyGrs, KAYNAK.jupKart],
    ciz(S) {
      const R = S.R, x0 = 72, k = 300 / 39000;
      let s = S.yazi(8, 18, 'Uzun eksen (ölçekli)', { boy: 14, kalin: true });
      const sat = [['1879', 39000, '≈39.000 km', true], ['1979', 25512, '≈25.500 km', true], ['2017', 16350, '16.350 km', false], ['bugün', 14000, '≈14.000 km', false]];
      sat.forEach(([yil, L, t, ic], i) => {
        const y = 36 + i * 32, w = L * k;
        s += S.yazi(x0 - 8, y + 13, yil, { boy: 14, hiza: 'end', kalin: i === 3 });
        s += S.kutu(x0, y, w, 17, { dolgu: R.uyari, renk: 'none', saydam: i === 3 ? 0.9 : 0.55 }, 8);
        s += ic ? S.zeminliYazi(x0 + w - 10, y + 13, t, { boy: 13, hiza: 'end' }) : S.yazi(x0 + w + 8, y + 13, t, { boy: 13 });
      });
      const xd = x0 + 12756 * k;
      s += S.cizgi(xd, 28, xd, 166, { renk: R.metin, kalin: 1.5, kesik: '5 4' });
      s += S.yazi(xd, 182, 'Dünya\'nın çapı: 12.756 km', { boy: 13, hiza: 'middle' });
      /* yandan kesit */
      const y0 = 236, k2 = 300 / 14000, xa = 50;
      s += S.cizgi(8, 204, 392, 204, { renk: R.cizgi, kalin: 1 });
      s += S.yazi(8, 224, 'Yandan kesit (ölçekli)', { boy: 14, kalin: true });
      s += S.cizgi(14, y0, 386, y0, { renk: R.metin, kalin: 1.3 });
      s += S.yazi(386, y0 - 6, 'bulut tepeleri', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yol(`M${xa},${y0} A150,${n2(500 * k2)} 0 0 0 ${xa + 300},${y0} Z`, { dolgu: R.uyari, renk: R.uyari, kalin: 1, saydam: 0.9 });
      s += S.yol(`M${xa},${y0} A150,${n2(200 * k2)} 0 0 0 ${xa + 300},${y0}`, { renk: R.zemin, kalin: 1, kesik: '3 3' });
      s += S.cizgi(xa + 150, y0 + 500 * k2 + 1, 238, 266, { renk: R.metin, kalin: 1 });
      s += S.yazi(242, 270, 'derinlik 200–500 km', { boy: 13 });
      const yj = y0 + 3000 * k2;
      s += S.cizgi(14, yj, 386, yj, { renk: R.mavi, kalin: 1.6, kesik: '7 4' });
      s += S.yazi(14, yj + 18, 'jet akımları: ~3000 km derine iner', { boy: 13, renk: R.mavi });
      s += S.ok(xa, y0 - 16, xa + 300, y0 - 16, { renk: R.soluk, kalin: 1, boy: 6 }) + S.ok(xa + 300, y0 - 16, xa, y0 - 16, { renk: R.soluk, kalin: 1, boy: 6 });
      s += S.zeminliYazi(200, y0 - 12, 'genişlik ≈14.000 km', { boy: 13, hiza: 'middle' });
      s += S.yazi(8, 350, 'Bu oranda 28 cm\'lik bir pizza ~1 cm kalın olurdu.', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d37 · bölüm 10: Jüpiter'in çevresi, logaritmik uzaklık ölçeği (Jüpiter yarıçapı). */
  C.ekle('d37-olcek', {
    ders: 'd37', bolum: 10, oran: 0.8,
    baslik: 'Halkalardan manyetopoza: Jüpiter\'in çevresi',
    aciklama: 'Yatay eksen Jüpiter\'in merkezinden uzaklıktır, Jüpiter yarıçapı biriminde ve logaritmik: her büyük çentik bir öncekinin iki ya da iki buçuk katıdır. Shoemaker-Levy 9 1992\'de 1,31 yarıçapta parçalandı; halkalar 1,3 ile 3,5 arasındadır, Pioneer 10 2,9\'a kadar yaklaştı. Galileo uyduları Io 5,9, Europa 9,4, Ganymede 15,0 ve Callisto 26,3 yarıçaptadır. Güneş yönündeki manyetopoz koşullara göre 45 ile 100 yarıçap arasında durur: dört uydunun dördü de manyetosferin derinliklerinde dolanır.',
    kaynak: [KAYNAK.jupKart, KAYNAK.jupUydu, KAYNAK.ioTorus],
    ciz(S) {
      const R = S.R, ya = 200, X = r => 30 + 175 * Math.log10(r);
      let s = '';
      /* manyetopoz bandı */
      s += S.kutu(X(45), 84, X(100) - X(45), ya - 84, { dolgu: R.mavi, renk: 'none', saydam: 0.18 });
      s += S.cizgi(X(45), 84, X(45), ya, { renk: R.mavi, kalin: 1.2, kesik: '4 3' });
      s += S.yazi(392, 40, 'manyetopoz', { boy: 14, hiza: 'end', kalin: true, renk: R.mavi });
      s += S.yazi(392, 57, '(Güneş yönünde)', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(392, 74, '45–100', { boy: 13, hiza: 'end' });
      /* Jüpiter'in kenarı */
      s += S.elips(-30, ya, 60, 96, { dolgu: R.gezegen, renk: 'none', saydam: 0.55 });
      s += S.yazi(6, 92, 'Jüpiter', { boy: 14, kalin: true });
      /* eksen */
      s += S.cizgi(30, ya, 386, ya, { renk: R.soluk, kalin: 1.3 });
      [[1, '1'], [2, '2'], [5, '5'], [10, '10'], [20, '20'], [50, '50'], [100, '100']].forEach(([v, t]) => {
        s += S.cizgi(X(v), ya, X(v), ya + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(Math.min(X(v), 384), ya + 19, t, { boy: 13, hiza: v === 100 ? 'end' : 'middle', renk: R.soluk });
      });
      /* halkalar */
      s += S.kutu(X(1.3), ya - 7, X(3.5) - X(1.3), 14, { dolgu: R.soluk, renk: 'none', saydam: 0.5 }, 3);
      s += S.yazi((X(1.3) + X(3.5)) / 2, 168, 'halkalar', { boy: 13, hiza: 'middle' });
      s += S.yazi((X(1.3) + X(3.5)) / 2, 184, '1,3–3,5', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* uydular */
      [['Io', 5.9, 150], ['Europa', 9.4, 110], ['Ganymede', 15.0, 150], ['Callisto', 26.3, 110]].forEach(([ad, r, y]) => {
        const x = X(r);
        s += S.cizgi(x, y + 20, x, ya - 6, { renk: R.soluk, kalin: 0.8, kesik: '2 3' });
        s += S.daire(x, ya, 5, { dolgu: R.ay, renk: R.zemin, kalin: 1 });
        s += S.yazi(x, y, ad, { boy: 13, hiza: 'middle', kalin: true });
        s += S.yazi(x, y + 16, tr(r, 1), { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      /* Pioneer 10 ve SL9: eksenin altında */
      const xp = X(2.9), xs = X(1.31);
      s += `<polygon points="${n2(xp)},${ya + 2} ${n2(xp - 5)},${ya + 10} ${n2(xp + 5)},${ya + 10}" fill="${R.metin}"/>`;
      s += S.cizgi(xp, ya + 24, xp, 240, { renk: R.soluk, kalin: 0.8 });
      s += S.yazi(xp - 6, 254, 'Pioneer 10 en yakın: 2,9', { boy: 13 });
      s += `<polygon points="${n2(xs)},${ya + 2} ${n2(xs - 5)},${ya + 10} ${n2(xs + 5)},${ya + 10}" fill="${R.uyari}"/>`;
      s += S.cizgi(xs, ya + 24, xs, 262, { renk: R.uyari, kalin: 0.8 });
      s += S.yazi(xs - 6, 276, 'SL9 parçalandı, 1992: 1,31', { boy: 13, renk: R.uyari });
      s += S.yazi(200, 306, 'uzaklık: Jüpiter yarıçapı, logaritmik ölçek', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d38 ================================================================ */

  /* d38 · bölüm 4: Jüpiter (sol) ve Satürn (sağ) aynı ölçekte, gerçek basıklıkla; metalik hidrojen sınırı, dağınık çekirdekler, rüzgâr derinliği. */
  C.ekle('d38-ic-yapi', {
    ders: 'd38', bolum: 4, oran: 1.1,
    baslik: 'Jüpiter ile Satürn\'ün içi yan yana',
    aciklama: 'Solda Jüpiter\'in, sağda Satürn\'ün yarısı aynı ölçekte ve gerçek basıklıklarıyla çizildi: Satürn hem küçük hem daha basıktır. Metalik hidrojen Jüpiter\'de merkeze giden yolun yaklaşık üçte birinde, Satürn\'de yaklaşık yarısında başlar. Halka sismolojisine göre Satürn\'ün bulanık çekirdeği çapının yaklaşık yüzde 60\'ına yayılır ve yaklaşık 55 Dünya kütlesidir; 17 Dünya kütlesi kadarı buz ve kayadır. Jüpiter\'in seyrelmiş çekirdeği belki yarıçapının yarısına uzanır. Rüzgârlar Jüpiter\'de yaklaşık 3000, Satürn\'de yaklaşık 9000 kilometre derine iner; bu bantlar ölçeklidir. Helyum yağmuru damlaları ise güçlü ama doğrulanmamış bir hipotezin şematik gösterimidir.',
    kaynak: [KAYNAK.satKart, KAYNAK.jupKart, KAYNAK.caltechHalka],
    ciz(S) {
      const R = S.R, cx = 200, cy = 170, k = 140 / 71492;
      const J = [71492 * k, 66854 * k], Sa = [60268 * k, 54364 * k];
      const E = (ab, f, sol, o) => S.yol(yari(cx, cy, ab[0] * f, ab[1] * f, sol), o);
      let s = '';
      s += S.yazi(8, 18, 'Jüpiter', { boy: 15, kalin: true }) + S.yazi(8, 35, 'eylemsizlik 0,254', { boy: 13, renk: R.soluk });
      s += S.yazi(392, 18, 'Satürn', { boy: 15, kalin: true, hiza: 'end' }) + S.yazi(392, 35, 'eylemsizlik 0,210', { boy: 13, hiza: 'end', renk: R.soluk });
      /* katmanlar */
      s += E(J, 1, true, { dolgu: R.mavi, saydam: 0.2, renk: 'none' }) + E(J, 2 / 3, true, { dolgu: R.mavi, saydam: 0.45, renk: 'none' });
      s += E(Sa, 1, false, { dolgu: R.mavi, saydam: 0.2, renk: 'none' }) + E(Sa, 0.5, false, { dolgu: R.mavi, saydam: 0.45, renk: 'none' });
      [0.5, 0.4, 0.3, 0.2, 0.1].forEach(f => { s += E(J, f, true, { dolgu: R.gezegen, saydam: 0.2, renk: 'none' }); });
      [0.6, 0.48, 0.36, 0.24, 0.12].forEach(f => { s += E(Sa, f, false, { dolgu: R.gezegen, saydam: 0.2, renk: 'none' }); });
      s += E(J, 0.5, true, { renk: R.gezegen, kalin: 1.3, kesik: '5 4' }) + E(Sa, 0.6, false, { renk: R.gezegen, kalin: 1.3, kesik: '5 4' });
      /* rüzgâr bantları (ölçekli kalınlık) */
      const bant = (ab, R0, d, sol) => { const f = 1 - d / R0 / 2; return S.yol(`M${cx},${n2(cy - ab[1] * f)} A${n2(ab[0] * f)},${n2(ab[1] * f)} 0 0 ${sol ? 0 : 1} ${cx},${n2(cy + ab[1] * f)}`, { renk: R.uyari, kalin: n2(ab[0] * d / R0), saydam: 0.6 }); };
      s += bant(J, 71492, 3000, true) + bant(Sa, 60268, 9000, false);
      /* helyum yağmuru damlaları (şematik) */
      [[0.2, 0.55], [0.35, 0.58], [0.5, 0.53], [0.62, 0.6], [0.28, 0.66], [0.45, 0.68]].forEach(([u, f]) => {
        const x = cx + Sa[0] * f * Math.cos(u), y = cy - Sa[1] * f * Math.sin(u);
        s += S.yol(`M${n2(x)},${n2(y - 5)} Q${n2(x + 3.5)},${n2(y + 1)} ${n2(x)},${n2(y + 3)} Q${n2(x - 3.5)},${n2(y + 1)} ${n2(x)},${n2(y - 5)} Z`, { dolgu: R.metin, renk: 'none', saydam: 0.85 });
      });
      s += S.yol(yari(cx, cy, J[0], J[1], true), { renk: R.metin, kalin: 1.5 }) + S.yol(yari(cx, cy, Sa[0], Sa[1], false), { renk: R.metin, kalin: 1.5 });
      s += S.cizgi(cx, cy - J[1] - 8, cx, cy + J[1] + 8, { renk: R.metin, kalin: 1.2, kesik: '4 3' });
      /* işaretler */
      s += isaret(S, cx - J[0] * 0.58, cy + 16, 1) + isaret(S, cx + Sa[0] * 0.3, cy + 44, 2);
      s += isaret(S, cx - J[0] * 0.25, cy - 30, 4) + isaret(S, cx + Sa[0] * 0.12, cy - 14, 3);
      s += isaret(S, cx + Sa[0] * 0.78, cy - 2, 5);
      s += S.cizgi(cx + Sa[0] * 0.78 - 7, cy - 6, cx + Sa[0] * 0.62, cy - 20, { renk: R.metin, kalin: 1 });
      s += isaret(S, cx + Sa[0] * 0.98 + 14, cy + Sa[1] * 0.55, 6);
      const g = [[1, 'Jüpiter: metalik hidrojen yolun ~1/3\'ünde başlar'], [2, 'Satürn: metalik hidrojen yolun ~yarısında başlar'],
        [3, 'Bulanık çekirdek: çapın ~%60\'ı, ~55 Dünya kütlesi'], [4, 'Seyrelmiş çekirdek (Jüpiter): belki yarıçapın yarısı'],
        [5, 'Helyum yağmuru: güçlü hipotez, ölçülmedi'], [6, 'Rüzgâr derinliği: Jüpiter ~3000, Satürn ~9000 km']];
      g.forEach(([no, t], i) => { s += madde(S, 6, 330 + i * 20, no, t, no === 5 ? R.soluk : R.metin); });
      return s;
    }
  });

  /* d38 · bölüm 8: ana halkalar, Satürn merkezinden doğrusal ölçekte; altta Kepler'e göre bir tur süreleri. */
  C.ekle('d38-halka-anatomi', {
    ders: 'd38', bolum: 8, oran: 0.84,
    baslik: 'Satürn\'ün halkaları ölçekli: D\'den E\'ye',
    aciklama: 'Yatay eksen Satürn\'ün merkezinden uzaklıktır, bin kilometre olarak ve doğrusal ölçekte. İçten dışa soluk D, C, en yoğun B halkası, 4550 kilometre genişliğindeki seyrek Cassini Bölümü, içinde Encke ve Keeler boşluklarını taşıyan A, ince F, soluk G ve 480.000 kilometreye uzanan E halkası gelir; Mimas 185.537 kilometrededir. Bandın koyuluğu halkanın yoğunluğunu kabaca gösterir. Alttaki sayılar oradaki bir parçacığın bir tur süresidir: C\'nin iç kenarında 5,8, A\'nın dış kenarında 14,3 saat. Yaklaşık 111.700 kilometrede tur süresi Satürn\'ün gününe eşittir; bunun içindeki halkalar gezegenden hızlı, dışındakiler yavaş dolanır.',
    kaynak: [KAYNAK.pdsHalka, KAYNAK.satKart, KAYNAK.jplSaturnGunu],
    ciz(S) {
      const R = S.R, X = a => 22 + (a - 60) * 368 / 130, y0 = 92, h = 40;      // a: bin km
      let s = '';
      /* Satürn'ün kenarı (yarıçap 60.268 km), merkez solda tuvalin dışında */
      const Rs = 60.268 * 368 / 130, cxs = X(0), dy = 80;
      const xk = cxs + Math.sqrt(Rs * Rs - dy * dy);
      s += S.yol(`M0,${y0 + h / 2 - dy} L${n2(xk)},${y0 + h / 2 - dy} A${n2(Rs)},${n2(Rs)} 0 0 1 ${n2(xk)},${y0 + h / 2 + dy} L0,${y0 + h / 2 + dy} Z`, { dolgu: R.gezegen, renk: 'none', saydam: 0.5 });
      s += S.yazi(4, 30, 'Satürn', { boy: 14, kalin: true });
      const bant = (a1, a2, sd, o) => S.kutu(X(a1), y0, X(a2) - X(a1), h, Object.assign({ dolgu: R.metin, renk: 'none', saydam: sd }, o || {}));
      s += bant(66.9, 74.491, 0.1, { renk: R.soluk, kalin: 1, kesik: '3 3' });
      s += bant(74.491, 91.975, 0.3) + bant(91.975, 117.5, 0.92) + bant(117.5, 122.05, 0.1) + bant(122.05, 136.77, 0.62);
      s += S.cizgi(X(133.584), y0, X(133.584), y0 + h, { renk: R.zemin, kalin: 1.6 }) + S.cizgi(X(136.504), y0, X(136.504), y0 + h, { renk: R.zemin, kalin: 1 });
      s += bant(139.826, 140.612, 0.85) + bant(166, 173.2, 0.14, { renk: R.soluk, kalin: 0.8 }) + bant(180, 190, 0.08, { renk: R.soluk, kalin: 0.8, kesik: '4 3' });
      s += S.ok(X(184), y0 + h / 2 - 34, 392, y0 + h / 2 - 34, { renk: R.soluk, kalin: 1, boy: 6 });
      s += S.yazi(392, y0 - 40, '480.000 km\'ye', { boy: 13, hiza: 'end', renk: R.soluk });
      /* Mimas */
      s += S.daire(X(185.537), y0 + h / 2, 4.5, { dolgu: R.ay, renk: R.zemin, kalin: 1 });
      s += S.yazi(X(185.537), y0 + h + 18, 'Mimas', { boy: 13, hiza: 'end' });
      /* harfler */
      [['D', 70.7], ['C', 83.2], ['B', 104.7], ['A', 129.4], ['F', 140.2], ['G', 169.6], ['E', 185]].forEach(([t, a]) => {
        s += S.yazi(X(a), y0 - 8, t, { boy: 15, kalin: true, hiza: 'middle' });
      });
      s += S.cizgi(X(119.8), y0 + h, X(119.8), y0 + h + 8, { renk: R.metin, kalin: 1 });
      s += S.yazi(X(119.8), y0 + h + 22, 'Cassini Bölümü', { boy: 13, hiza: 'middle' });
      s += S.cizgi(X(133.584), y0 + h, X(133.584), y0 + h + 30, { renk: R.metin, kalin: 0.8 }) + S.cizgi(X(136.504), y0 + h, X(136.504), y0 + h + 48, { renk: R.metin, kalin: 0.8 });
      s += S.yazi(X(133.584) + 4, y0 + h + 40, 'Encke', { boy: 13 }) + S.yazi(X(136.504) + 4, y0 + h + 58, 'Keeler', { boy: 13 });
      /* eksen */
      const ya = 214;
      s += S.cizgi(X(60), ya, X(190), ya, { renk: R.soluk, kalin: 1 });
      [60, 80, 100, 120, 140, 160, 180].forEach(a => { s += S.cizgi(X(a), ya, X(a), ya + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(a), ya + 18, a === 180 ? '180 bin km' : String(a), { boy: 13, hiza: a === 180 ? 'end' : 'middle', renk: R.soluk }); });
      /* bir tur süreleri (Kepler, Mimas'tan ölçeklendi) */
      s += S.yazi(8, 256, 'Bir tur süresi (Kepler):', { boy: 13, kalin: true });
      const tur = [[74.491, '5,8 sa', 280, 'middle'], [136.77, '14,3 sa', 280, 'middle'], [185.537, '22,6 sa', 280, 'end'], [111.698, '10,6 sa = Satürn\'ün günü', 302, 'middle']];
      tur.forEach(([a, t, y, hz]) => {
        const x = X(a);
        s += `<polygon points="${n2(x)},${ya - 1} ${n2(x - 4)},${ya - 8} ${n2(x + 4)},${ya - 8}" fill="${R.vurgu}"/>`;
        s += S.cizgi(x, 236, x, y - 13, { renk: R.vurgu, kalin: 0.8, kesik: '2 2' });
        s += S.yazi(hz === 'end' ? 392 : x, y, t, { boy: 13, hiza: hz, renk: R.vurgu });
      });
      s += S.yazi(8, 328, 'İçeride halkalar Satürn\'ün kendisinden hızlı döner.', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d38 · bölüm 10: Cassini Bölümü'nden F halkasına yakın plan; Mimas 2:1 rezonansı ve boşluklardaki uydular. */
  C.ekle('d38-rezonans', {
    ders: 'd38', bolum: 10, oran: 0.7,
    baslik: 'Boşlukları açan uydular',
    aciklama: 'B halkasının dış kenarından F halkasına kadar yakın plan; yatay eksen doğrusal ölçekli. Mimas her turunu attığında 116.900 kilometredeki bir parçacık tam iki tur atar; Kepler yasasıyla bulunan bu 2:1 rezonansı, B halkasının 117.570 kilometredeki kenarına ve Cassini Bölümü\'nün başlangıcına yüzde 1\'den yakındır. A halkasındaki 322 kilometrelik Encke Boşluğu\'nun içinde Pan, 35 kilometrelik Keeler Boşluğu\'nun içinde Daphnis dolanır. Dar F halkası Prometheus ile Pandora\'nın arasında durur. Uyduların noktaları gerçek boylarından büyük çizildi.',
    kaynak: [KAYNAK.pdsHalka],
    ciz(S) {
      const R = S.R, X = a => 15 + (a - 110) * 370 / 35, y0 = 108, h = 40;
      let s = '';
      const bant = (a1, a2, sd) => S.kutu(X(a1), y0, X(a2) - X(a1), h, { dolgu: R.metin, renk: 'none', saydam: sd });
      s += bant(110, 117.57, 0.92) + bant(117.5, 122.05, 0.1) + bant(122.05, 136.77, 0.62) + bant(139.826, 140.612, 0.85);
      s += S.kutu(X(133.584 - 0.161), y0, X(133.584 + 0.161) - X(133.584 - 0.161), h, { dolgu: R.zemin, renk: 'none' });
      s += S.cizgi(X(136.504), y0, X(136.504), y0 + h, { renk: R.zemin, kalin: 1.2 });
      /* uydular */
      [133.584, 136.504, 139.378, 141.713].forEach(a => { s += S.daire(X(a), y0 + h / 2, 3, { dolgu: R.ay, renk: R.zemin, kalin: 1 }); });
      [['B', 112.5], ['A', 128]].forEach(([t, a]) => { s += S.yazi(X(a), y0 - 8, t, { boy: 15, kalin: true, hiza: 'middle' }); });
      /* Mimas 2:1 */
      const xr = X(116.881);
      s += S.yazi(10, 22, 'Mimas 2:1 rezonansı: 116.900 km', { boy: 13, kalin: true, renk: R.vurgu });
      s += S.yazi(10, 39, 'Mimas 1 tur atarken parçacık 2 tur atar', { boy: 13, renk: R.vurgu });
      s += S.ok(xr, 46, xr, y0 - 2, { renk: R.vurgu, kalin: 1.6, boy: 8 });
      /* işaretler */
      [[119.8, 1], [133.584, 2], [136.504, 3], [140.2, 4]].forEach(([a, no]) => {
        s += S.cizgi(X(a), y0 - 14, X(a), y0, { renk: R.metin, kalin: 0.9 }) + isaret(S, X(a), y0 - 22, no);
      });
      /* eksen */
      const ya = y0 + h + 6;
      [110, 120, 130, 140].forEach(a => { s += S.cizgi(X(a), ya, X(a), ya + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(a), ya + 19, tr(a * 1000), { boy: 13, hiza: 'middle', renk: R.soluk }); });
      s += S.yazi(392, ya + 19, 'km', { boy: 13, hiza: 'end', renk: R.soluk });
      const g = [[1, 'Cassini Bölümü: 117.500–122.050 km, çok seyrek'], [2, 'Encke Boşluğu (322 km): içinde Pan dolanır'],
        [3, 'Keeler Boşluğu (35 km): içinde Daphnis dolanır'], [4, 'F halkası: Prometheus ile Pandora arasında']];
      g.forEach(([no, t], i) => { s += madde(S, 6, 204 + i * 20, no, t); });
      return s;
    }
  });

  /* ================================================================ d39 ================================================================ */

  /* d39 · bölüm 4: Neptün'ün klasik üç katmanlı modeli, yarıçap ölçekli; kesinlik düzeyleri etiketli. */
  C.ekle('d39-ic-yapi', {
    ders: 'd39', bolum: 4, oran: 1.14,
    baslik: 'Bir buz devinin içi: ölçülen, modellenen, tahmin edilen',
    aciklama: 'Neptün\'ün kesiti, yarıçap ölçekli. En dışta hidrojen-helyum zarfı merkeze giden yolun yüzde 10 ile 20\'si kadar iner; iki kesik çember bu belirsizliği gösterir, dibinde basınç yaklaşık 10 gigapaskaldır. Altında 10 ile 15 Dünya kütlesinde sıcak, elektriği ileten su-amonyak-metan akışkanı vardır. Yaklaşık 7000 kilometre derinden itibaren metanın elmasa ayrışabileceği bir laboratuvar hipotezidir, gezegende ölçülmedi. Taranan iç bölge, en içteki yüzde 30, çekim ölçümlerinin neredeyse ulaşamadığı yerdir; yaklaşık 1,2 Dünya kütlesindeki kaya-metal çekirdeğin boyu modele bağlıdır ve şematik çizildi. Merkezde yaklaşık 700 gigapaskal ve 5400 kelvin olabilir.',
    kaynak: [KAYNAK.helledFortney, KAYNAK.wikiNeptun, KAYNAK.nepKart, KAYNAK.slac],
    ciz(S) {
      const R = S.R, cx = 200, cy = 172, Rn = 134, Rkm = 24764;
      let s = S.yazi(200, 20, 'Neptün, yarıçap 24.764 km (ölçekli)', { boy: 14, kalin: true, hiza: 'middle' });
      s += S.daire(cx, cy, Rn, { dolgu: R.mavi, renk: 'none', saydam: 0.18 });
      s += S.daire(cx, cy, Rn * 0.85, { dolgu: R.mavi, renk: 'none', saydam: 0.42 });
      s += S.daire(cx, cy, Rn * 0.9, { renk: R.metin, kalin: 1, kesik: '4 3' }) + S.daire(cx, cy, Rn * 0.8, { renk: R.metin, kalin: 1, kesik: '4 3' });
      /* elmas derinliği: ~7000 km */
      const fe = (Rkm - 7000) / Rkm;
      s += S.daire(cx, cy, Rn * fe, { renk: R.vurgu, kalin: 1.4, kesik: '2 3' });
      [[200, 0.62], [215, 0.5], [232, 0.66], [248, 0.56], [262, 0.45], [280, 0.64], [298, 0.52], [314, 0.6]].forEach(([u, f]) => {
        const a = u * Math.PI / 180, x = cx + Rn * f * Math.cos(a), y = cy - Rn * f * Math.sin(a);
        s += `<polygon points="${n2(x)},${n2(y - 5)} ${n2(x + 3.5)},${n2(y)} ${n2(x)},${n2(y + 5)} ${n2(x - 3.5)},${n2(y)}" fill="${R.vurgu}"/>`;
      });
      /* en iç %30: çekimle neredeyse ölçülmüyor */
      s += S.daire(cx, cy, Rn * 0.3, { dolgu: R.zemin, renk: R.soluk, kalin: 1.2, kesik: '6 4', saydam: 0.75 });
      for (let i = -3; i <= 3; i++) {
        const d = i * 9, yy = Math.sqrt(Math.max(0, (Rn * 0.3) ** 2 - d * d));
        s += S.cizgi(cx + d - yy * 0.5, cy + yy * 0.87, cx + d + yy * 0.5, cy - yy * 0.87, { renk: R.soluk, kalin: 0.8 });
      }
      s += S.daire(cx, cy, Rn * 0.12, { dolgu: R.gezegen, renk: R.metin, kalin: 1, kesik: '3 2' });
      /* işaretler */
      s += isaret(S, cx + Rn * 0.95, cy - 64, 1) + isaret(S, cx + Rn * 0.5, cy - 70, 2) + isaret(S, cx - Rn * 0.2, cy + Rn * 0.56, 3);
      s += isaret(S, cx + Rn * 0.21, cy + 32, 4) + isaret(S, cx, cy - 30, 5);
      s += S.cizgi(cx, cy - 21.5, cx, cy - Rn * 0.12, { renk: R.metin, kalin: 1 });
      const g = [[1, 'Hidrojen-helyum zarfı: yolun %10–20\'si (model)', R.metin], [2, 'Su-amonyak-metan akışkanı, 10–15 Dünya kütlesi (model)', R.metin],
        [3, 'Elmas yağmuru, ~7000 km altı: laboratuvar hipotezi', R.vurgu], [4, 'En iç %30: çekim ölçümleri neredeyse ulaşmıyor', R.soluk],
        [5, 'Çekirdek ~1,2 Dünya kütlesi (boyu şematik)', R.metin]];
      g.forEach(([no, t, r], i) => { s += madde(S, 6, 330 + i * 20, no, t, r); });
      s += S.yazi(8, 436, 'Ölçülen: kütle, yarıçap, dönme, çekim alanı (Voyager 2)', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 454, 'Merkez: ~700 GPa, ~5400 K (model)', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d39 · bölüm 7: Uranüs'ün yörüngesinde dört an; eksen sabit, yörünge düzlemine yatık. Altta 84 yıllık takvim. */
  C.ekle('d39-mevsim', {
    ders: 'd39', bolum: 7, oran: 0.97,
    baslik: 'Yan yatmış Uranüs\'ün 84 yıllık takvimi',
    aciklama: 'Güneş ortada, Uranüs\'ün yörüngesi eğik bakışla ve ölçeksiz çizildi. Eksen uzayda hep aynı yöne bakar ve yörünge düzlemine neredeyse yatıktır; eğiklik 97,77 derece. 1986\'da Voyager 2 geldiğinde güney kutbu Güneş\'e dönüktü. 2007\'de ekinokstu: Güneş ekvatorun üstündeydi. 2028\'de kuzey gün dönümü: bu kez kuzey kutbu Güneş\'e bakacak. Sonraki ekinoks 2050\'de. Her parlak yarım, gezegenin aydınlık yüzüdür. Alttaki çizelge aynı yılları gösterir: bir kutup yaklaşık 42 yıl Güneş\'i görür, sonra yaklaşık 42 yıl karanlıkta kalır.',
    kaynak: [KAYNAK.uraKart, KAYNAK.esaHubbleUranus],
    ciz(S) {
      const R = S.R, gx = 200, gy = 150, rx = 150, ry = 66, r = 17, egim = -7.77;
      let s = '';
      s += S.elips(gx, gy, rx, ry, { renk: R.soluk, kalin: 1.2, kesik: '5 4' });
      /* dolanma yönü oku (saat yönünün tersi, üstten bakış) */
      const ok = a => [gx + rx * Math.cos(a), gy - ry * Math.sin(a)];
      const [o1x, o1y] = ok(0.42), [o2x, o2y] = ok(0.62);
      s += S.ok(o1x, o1y, o2x, o2y, { renk: R.soluk, kalin: 1.2, boy: 8 });
      /* Güneş */
      s += S.daire(gx, gy, 14, { dolgu: R.gunes, renk: 'none' });
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += S.cizgi(gx + 18 * Math.cos(a), gy + 18 * Math.sin(a), gx + 24 * Math.cos(a), gy + 24 * Math.sin(a), { renk: R.gunes, kalin: 1.5 }); }
      s += S.yazi(gx, gy + 42, 'Güneş', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* dört konum: [açı (rad), yıl, açıklama satırı, hizalama] */
      const kon = [[0, '1986', 'güney kutbu Güneş\'e', 'end'], [Math.PI / 2, '2007', 'ekinoks', 'middle'], [Math.PI, '2028', 'kuzey kutbu Güneş\'e', 'start'], [3 * Math.PI / 2, '2050', 'sonraki ekinoks', 'middle']];
      kon.forEach(([a, yil, t, hz]) => {
        const x = gx + rx * Math.cos(a), y = gy - ry * Math.sin(a);
        /* aydınlık yarım: Güneş'e bakan taraf */
        const yon = Math.atan2(gy - y, gx - x), p = d => [x + r * Math.cos(yon + d), y + r * Math.sin(yon + d)];
        const [ax, ay] = p(-Math.PI / 2), [bx, by] = p(Math.PI / 2);
        s += S.daire(x, y, r, { dolgu: R.zemin, renk: R.soluk, kalin: 1.2 });
        s += S.yol(`M${n2(ax)},${n2(ay)} A${r},${r} 0 0 1 ${n2(bx)},${n2(by)} Z`, { dolgu: R.mavi, renk: 'none' });
        /* eksen: kuzey ucu +x yönünde, yörünge düzleminden 7,77° */
        const L = r + 11, c = Math.cos(egim * Math.PI / 180), sn = Math.sin(egim * Math.PI / 180);
        s += S.cizgi(x - L * c, y - L * sn, x + L * c, y + L * sn, { renk: R.metin, kalin: 1.6 });
        s += S.yazi(x + (L + 7) * c, y + (L + 7) * sn + 4.5, 'K', { boy: 13, hiza: 'middle', kalin: true });
        const ly = a === 0 || a === Math.PI ? y + 38 : a < Math.PI ? y - 40 : y + 40;
        const lx = hz === 'end' ? 392 : hz === 'start' ? 8 : x;
        s += S.yazi(lx, ly, yil, { boy: 14, kalin: true, hiza: hz });
        s += S.yazi(lx, ly + 16, t, { boy: 13, hiza: hz, renk: R.soluk });
      });
      /* takvim çizelgesi: 1986–2070 */
      const T = yil => 30 + (yil - 1986) * 340 / 84, yb = 318;
      s += S.yazi(202, yb - 9, 'kuzey kutbu aydınlık ~42 yıl', { boy: 13, hiza: 'middle' });
      s += S.kutu(T(1986), yb, T(2007) - T(1986), 14, { dolgu: R.soluk, renk: 'none', saydam: 0.35 });
      s += S.kutu(T(2007), yb, T(2050) - T(2007), 14, { dolgu: R.mavi, renk: 'none', saydam: 0.85 });
      s += S.kutu(T(2050), yb, T(2070) - T(2050), 14, { dolgu: R.soluk, renk: 'none', saydam: 0.35 });
      [1986, 2007, 2028, 2050, 2070].forEach(yil => {
        s += S.cizgi(T(yil), yb + 14, T(yil), yb + 20, { renk: R.soluk, kalin: 1 }) + S.yazi(T(yil), yb + 34, String(yil), { boy: 13, hiza: 'middle', renk: yil === 2070 ? R.soluk : R.metin });
      });
      s += S.yazi(8, yb + 56, 'gri: güney kutbu aydınlık', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d39 · bölüm 10: dört dev gezegenin manyetik ekseni; dönme eksenine eğiklik ve merkezden kayma ölçekli. */
  C.ekle('d39-manyetik', {
    ders: 'd39', bolum: 10, oran: 0.64,
    baslik: 'Dört devin mıknatısı: hizalı ve eğik',
    aciklama: 'Her dairede kesik dikey çizgi dönme eksenidir, düz çizgi manyetik eksen. Eğiklik açıları ve manyetik merkezin gezegenin merkezinden kayması, yarıçap biriminde, ölçekli çizildi; kaymanın yönü şematiktir. Jüpiter\'in ekseni 9,4 derece eğik, merkezi 0,119 yarıçap kayık; Satürn\'ünkü neredeyse kusursuz hizalı, kayması 0,038. Uranüs\'ünkü 58,6 derece eğik ve 0,352 yarıçap, Neptün\'ünkü 46,9 derece eğik ve 0,485 yarıçap kayıktır. Ekseni normal eğik olan Neptün\'de de aynı tuhaflık görüldüğü için nedeni yan yatma değil, gezegenin içindeki akıştır.',
    kaynak: [KAYNAK.uraKart, KAYNAK.nepKart, KAYNAK.jupKart, KAYNAK.satKart],
    ciz(S) {
      const R = S.R, cy = 108, r = 34;
      const ls = [['Jüpiter', 9.4, 0.119, '9,4°', '0,119'], ['Satürn', 0, 0.038, '≈0°', '0,038'], ['Uranüs', 58.6, 0.352, '58,6°', '0,352'], ['Neptün', 46.9, 0.485, '46,9°', '0,485']];
      let s = '';
      ls.forEach(([ad, aci, kay, ta, tk], i) => {
        const cx = 52 + i * 99, mx = cx + kay * r, a = aci * Math.PI / 180, L = r + 10;
        s += S.yazi(cx, 34, ad, { boy: 14, kalin: true, hiza: 'middle' });
        s += S.daire(cx, cy, r, { dolgu: i < 2 ? R.gezegen : R.mavi, renk: R.metin, kalin: 1.2, saydam: 0.35 });
        s += S.daire(cx, cy, r, { renk: R.metin, kalin: 1.2 });
        s += S.cizgi(cx, cy - r - 14, cx, cy + r + 14, { renk: R.metin, kalin: 1.2, kesik: '4 3' });
        s += S.ok(mx - L * Math.sin(a), cy + L * Math.cos(a), mx + L * Math.sin(a), cy - L * Math.cos(a), { renk: R.vurgu, kalin: 2.2, boy: 8 });
        s += S.daire(mx, cy, 3, { dolgu: R.vurgu, renk: R.zemin, kalin: 1 });
        s += S.yazi(cx, cy + r + 34, 'eğik ' + ta, { boy: 13, hiza: 'middle' });
        s += S.yazi(cx, cy + r + 51, 'kayma ' + tk, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.cizgi(10, 228, 34, 228, { renk: R.metin, kalin: 1.2, kesik: '4 3' }) + S.yazi(40, 232, 'dönme ekseni', { boy: 13 });
      s += S.ok(150, 228, 178, 228, { renk: R.vurgu, kalin: 2.2, boy: 7 }) + S.yazi(184, 232, 'manyetik eksen', { boy: 13 });
      s += S.yazi(8, 252, 'kayma yarıçap biriminde; yönü şematik', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d40 ================================================================ */

  /* d40 · bölüm 0: büyük uydular aynı ölçekte; Merkür, Ay ve Plüton karşılaştırma için kesik çizgiyle. */
  C.ekle('d40-boyutlar', {
    ders: 'd40', bolum: 0, oran: 1.0,
    baslik: 'Büyük uydular aynı ölçekte',
    aciklama: 'Bütün daireler aynı ölçekte çizildi; sayılar çaptır. Ganymede 5262 ve Titan yaklaşık 5150 kilometreyle Merkür gezegeninden büyüktür, Callisto ondan biraz küçüktür. Io, Europa ve Triton Ay boyundadır ve hepsi Plüton\'dan büyüktür. Satürn\'ün Enceladus\'u ile Uranüs\'ün Miranda\'sı ise yaklaşık 500 kilometreyle küçük birer noktadır. Kesik çizgili daireler uydu değildir: Merkür gezegen, Ay Dünya\'nın uydusu olarak karşılaştırma için, Plüton cüce gezegendir.',
    kaynak: [KAYNAK.jupUydu, KAYNAK.nepUydu, KAYNAK.ayKart, KAYNAK.plutonKart],
    ciz(S) {
      const R = S.R, k = 86 / 5262;
      let s = '';
      const ciz = (x, y, d, ad, alt, ev, karsi) => {
        const r = d * k / 2;
        s += karsi ? S.daire(x, y, r, { renk: R.metin, kalin: 1.4, kesik: '5 3' }) : S.daire(x, y, r, { dolgu: R.ay, renk: 'none', saydam: 0.75 });
        return r;
      };
      const etiket = (x, y, ad, alt, ev, karsi) => {
        s += S.yazi(x, y, ad, { boy: 13, hiza: 'middle', kalin: true, italik: karsi });
        s += S.yazi(x, y + 16, alt, { boy: 13, hiza: 'middle' });
        s += S.yazi(x, y + 32, ev, { boy: 13, hiza: 'middle', renk: R.soluk });
      };
      const sira1 = [['Ganymede', 5262, '5262 km', 'Jüpiter'], ['Titan', 5150, '≈5150 km', 'Satürn'], ['Merkür', 4879, '4879 km', 'gezegen', true], ['Callisto', 4821, '4821 km', 'Jüpiter']];
      sira1.forEach(([ad, d, t, ev, kr], i) => { const x = 52 + i * 93; ciz(x, 62, d, ad, t, ev, kr); etiket(x, 126, ad, t, ev, kr); });
      const sira2 = [['Io', 3643, '3643 km', 'Jüpiter'], ['Ay', 3474.8, '3475 km', 'Dünya', true], ['Europa', 3122, '3122 km', 'Jüpiter'], ['Triton', 2706.8, '2707 km', 'Neptün'], ['Plüton', 2376, '2376 km', 'cüce gezegen', true]];
      sira2.forEach(([ad, d, t, ev, kr], i) => { const x = 46 + i * 76; ciz(x, 218, d, ad, t, ev, kr); etiket(x, 268, ad, t, ev, kr); });
      /* küçükler */
      [['Enceladus (Satürn) ≈500 km', 504, 328], ['Miranda (Uranüs) ≈471 km', 471, 352]].forEach(([t, d, y]) => {
        ciz(24, y - 5, d, '', '', '', false);
        s += S.yazi(40, y, t, { boy: 13 });
      });
      s += S.daire(264, 323, 6, { renk: R.metin, kalin: 1.4, kesik: '5 3' }) + S.yazi(278, 328, 'uydu değil', { boy: 13, renk: R.soluk });
      s += S.daire(264, 347, 6, { dolgu: R.ay, renk: 'none', saydam: 0.75 }) + S.yazi(278, 352, 'uydu', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 386, 'Ölçek: tüm daireler aynı; sayılar çap', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d40 · bölüm 1: eylemsizlik momenti çarpanları; nokta grafiği, eksen 0,30'dan başlar. */
  C.ekle('d40-eylemsizlik', {
    ders: 'd40', bolum: 1, oran: 0.86,
    baslik: 'Uydunun içini gösteren sayı: eylemsizlik momenti çarpanı',
    aciklama: 'Her nokta bir uydunun eylemsizlik momenti çarpanıdır. Sağdaki kesik çizgi her yeri aynı yoğunlukta bir küredir, 0,4; değer küçüldükçe ağır malzeme merkezde toplanmıştır. Ganymede 0,3115 ile en solda: tam katmanlaşmış, ağır çekirdeği merkeze çökmüş. Callisto 0,3549: kaya ve buzu büyük ölçüde karışık kalmış. Io 0,378 ile düzgün küreye en yakın olanıdır. Noktalı çizgi Dünya\'dır, 0,3307. Eksen 0,30\'dan başlar, aradaki farklar büyütülmüştür; değerler çekim ölçümünden bir modelle çıkarılmıştır.',
    kaynak: [KAYNAK.eylemsizlik, KAYNAK.wikiGalileo],
    ciz(S) {
      const R = S.R, X = v => 92 + (v - 0.30) * 270 / 0.11, y0 = 62, dy = 28, ya = 234;
      let s = '';
      const ls = [['Ganymede', 0.3115, '0,3115'], ['Enceladus', 0.3305, '0,3305'], ['Titan', 0.341, '0,341'], ['Europa', 0.346, '0,346'], ['Callisto', 0.3549, '0,3549'], ['Io', 0.378, '0,378']];
      s += S.cizgi(X(0.4), 42, X(0.4), ya, { renk: R.metin, kalin: 1.4, kesik: '6 4' });
      s += S.yazi(392, 22, 'düzgün küre 0,4', { boy: 13, hiza: 'end' });
      s += S.cizgi(X(0.3307), 42, X(0.3307), ya, { renk: R.soluk, kalin: 1.4, kesik: '1.5 3' });
      s += S.yazi(X(0.3307), 22, 'Dünya 0,3307', { boy: 13, hiza: 'middle', renk: R.soluk });
      ls.forEach(([ad, v, t], i) => {
        const y = y0 + i * dy;
        s += S.cizgi(X(0.30), y, X(v), y, { renk: R.cizgi, kalin: 1 });
        s += S.yazi(X(0.30) - 8, y + 4.5, ad, { boy: 13, hiza: 'end', kalin: true });
        s += S.daire(X(v), y, 6, { dolgu: R.ay, renk: R.zemin, kalin: 1.2 });
        s += S.zeminliYazi(X(v) + 11, y + 4.5, t, { boy: 13 });
      });
      s += S.cizgi(X(0.30), ya, X(0.41), ya, { renk: R.soluk, kalin: 1 });
      [0.30, 0.32, 0.34, 0.36, 0.38, 0.40].forEach(v => { s += S.cizgi(X(v), ya, X(v), ya + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(v), ya + 19, tr(v, 2), { boy: 13, hiza: 'middle', renk: R.soluk }); });
      s += S.yazi(X(0.30), ya + 42, '← ağırı merkezde', { boy: 13, renk: R.soluk });
      s += S.yazi(X(0.41), ya + 42, 'düzgün →', { boy: 13, hiza: 'end', renk: R.soluk });
      /* şematik iki iç yapı */
      s += S.daire(22, 306, 12, { dolgu: R.mavi, renk: R.metin, kalin: 1, saydam: 0.5 }) + S.daire(22, 306, 5.5, { dolgu: R.gezegen, renk: 'none' });
      s += S.yazi(42, 311, 'Ganymede: ağır çekirdek merkeze çökmüş', { boy: 13 });
      s += S.daire(22, 334, 12, { dolgu: R.gezegen, renk: R.metin, kalin: 1, saydam: 0.45 });
      s += S.yazi(42, 339, 'Callisto: kaya ve buz büyük ölçüde karışık', { boy: 13 });
      return s;
    }
  });

  /* d40 · bölüm 2: Laplace rezonansı bir zaman çizelgesinde; dönemler NSSDCA'dan (ders bölüm 2 örneği). */
  C.ekle('d40-laplace', {
    ders: 'd40', bolum: 2, oran: 0.8,
    baslik: 'Laplace rezonansı: 4, 2, 1 tur',
    aciklama: 'Yatay eksen gündür; her çubuk bir tam turdur. Io bir turu 1,769 günde, Europa 3,551 günde, Ganymede 7,155 günde atar. Ganymede bir tur atarken Europa iki, Io dört tur atar: dönemler 1:2:4 oranına çok yakındır, bu yüzden üç uydu birbirini hep aynı yerlerde dürter ve yörüngeleri hafifçe eliptik kalır. Callisto\'nun turu 16,7 gün sürer, rezonansa katılmaz. Jüpiter\'in Io\'yu esneten gelgit ivmesi, Ay\'ın Dünya\'yı esnetmesinin yaklaşık 5600 katıdır; Io\'nun volkanlarını bu esneme besler.',
    kaynak: [KAYNAK.jupUydu, KAYNAK.wikiGalileo],
    ciz(S) {
      const R = S.R, X = t => 95 + t * 285 / 7.3;
      let s = '';
      const ls = [['Io', 1.769138, '1,769 gün', 4], ['Europa', 3.551181, '3,551 gün', 2], ['Ganymede', 7.154553, '7,155 gün', 1]];
      s += S.yazi(392, 22, 'Io 4, Europa 2, Ganymede 1 tur', { boy: 13, hiza: 'end', kalin: true, renk: R.vurgu });
      ls.forEach(([ad, T, t, k], i) => {
        const y = 52 + i * 52;
        s += S.yazi(8, y + 2, ad, { boy: 14, kalin: true }) + S.yazi(8, y + 19, t, { boy: 13, renk: R.soluk });
        for (let j = 0; j < k; j++) {
          const x1 = X(j * T), x2 = X((j + 1) * T);
          s += S.kutu(x1 + 1, y - 8, x2 - x1 - 2, 20, { dolgu: R.mavi, renk: 'none', saydam: j % 2 ? 0.3 : 0.65 }, 5);
          s += S.yazi((x1 + x2) / 2, y + 7, (j + 1) + '. tur', { boy: 13, hiza: 'middle' });
        }
      });
      s += S.cizgi(X(7.154553), 34, X(7.154553), 196, { renk: R.vurgu, kalin: 1.3, kesik: '4 3' });
      const ya = 204;
      s += S.cizgi(X(0), ya, X(7.3), ya, { renk: R.soluk, kalin: 1 });
      for (let d = 0; d <= 7; d++) s += S.cizgi(X(d), ya, X(d), ya + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(d), ya + 19, String(d), { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yazi(X(0) - 10, ya + 19, 'gün', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(8, 254, 'Callisto: 16,7 günde bir tur, rezonansın dışında', { boy: 13, renk: R.soluk });
      s += S.yazi(8, 284, 'Io\'yu esneten gelgit, Ay\'ın Dünya\'yı', { boy: 13 });
      s += S.yazi(8, 302, 'esnetmesinin yaklaşık 5600 katı', { boy: 13, kalin: true });
      return s;
    }
  });
})();
