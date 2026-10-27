/* cizim_gezegen_yasam.js — gezegen_yasam ünitesinin ders çizimleri (cizim.js kayıtları). */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;

  /* ===================== d13 · Ötegezegenler ===================== */

  /* d13 · bölüm 1: dikine hız eğrisi. 51 Pegasi b: yarı genlik 55,9 m/s, dönem 4,2 gün (ders metni). Üstteki yörünge şeması ölçeksiz. */
  C.ekle('d13-dikine-hiz', {
    ders: 'd13', bolum: 1, oran: 0.8,
    baslik: 'Yıldızın yalpalaması ve dikine hız eğrisi',
    aciklama: 'Yıldız ile gezegen ortak bir kütle merkezinin çevresinde döner; yıldızın çizdiği küçük daire bize doğru ve bizden uzağa bir hız bileşeni verir. Alttaki eğri 51 Pegasi\'nin hızını gösterir: 4,2 günde bir tekrarlanan, artı eksi 55,9 m/s\'lik bir dalga. Üstteki yörünge şeması ölçeksizdir.',
    kaynak: [
      { ad: 'Wikipedia – Doppler spectroscopy', url: 'https://en.wikipedia.org/wiki/Doppler_spectroscopy' },
      { ad: 'Wikipedia – 51 Pegasi', url: 'https://en.wikipedia.org/wiki/51_Pegasi' }
    ],
    ciz(S) {
      const R = S.R, cx = 80, cy = 62;
      let s = '';
      /* şema: gezegen yörüngesi, yıldızın küçük dairesi, kütle merkezi */
      s += S.daire(cx, cy, 50, { renk: R.soluk, kalin: 1, kesik: '4 4' });
      s += S.daire(cx, cy, 7, { renk: R.vurgu, kalin: 1.2, kesik: '2 3' });
      s += S.daire(cx - 7, cy, 15, { dolgu: R.yildiz, renk: R.yildiz, saydam: 0.9 });
      s += S.daire(cx + 50, cy, 5, { dolgu: R.gezegen, renk: R.gezegen });
      s += S.cizgi(cx - 4, cy, cx + 4, cy, { renk: R.vurgu, kalin: 2 }) + S.cizgi(cx, cy - 4, cx, cy + 4, { renk: R.vurgu, kalin: 2 });
      s += S.yazi(cx - 7, cy - 22, 'yıldız', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(cx + 59, cy + 4, 'gezegen', { boy: 13, renk: R.metin });
      s += S.cizgi(cx + 3, cy + 3, 126, 93, { renk: R.vurgu, kalin: 1 });
      s += S.yazi(129, 99, 'kütle merkezi', { boy: 13, renk: R.vurgu });
      /* işaret anlamı */
      s += S.yazi(200, 20, 'Artı: yıldız uzaklaşıyor', { boy: 13, renk: R.metin });
      s += S.yazi(200, 36, '(çizgiler kırmızıya kayar)', { boy: 13, renk: R.soluk });
      s += S.yazi(200, 58, 'Eksi: yıldız yaklaşıyor', { boy: 13, renk: R.metin });
      s += S.yazi(200, 74, '(çizgiler maviye kayar)', { boy: 13, renk: R.soluk });
      /* eğri */
      const K = 55.9, P = 4.2;
      const ek = S.eksen({ x: 72, y: 140, w: 308, h: 125 }, { x0: 0, x1: 2 * P, y0: -70, y1: 70 }, {
        xIsaret: [[0, '0'], [2.1, '2,1'], [4.2, '4,2'], [6.3, '6,3'], [8.4, '8,4']],
        yIsaret: [[50, '+50'], [0, '0'], [-50, '−50']],
        xAd: 'zaman (gün)'
      });
      s += ek.svg;
      s += S.yazi(64, 134, 'm/s', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.cizgi(ek.X(0), ek.Y(0), ek.X(2 * P), ek.Y(0), { renk: R.cizgi, kalin: 1 });
      s += S.cizgi(ek.X(0), ek.Y(K), ek.X(2 * P), ek.Y(K), { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.cizgi(ek.X(0), ek.Y(-K), ek.X(2 * P), ek.Y(-K), { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.yazi(ek.X(2 * P) - 2, ek.Y(K) - 5, '55,9 m/s', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.fonk(ek, t => K * Math.sin(2 * Math.PI * t / P), 0, 2 * P, 160, { renk: R.vurgu, kalin: 2.2 });
      /* bir dolanım: iki tepe arası */
      const t1 = ek.X(P / 4), t2 = ek.X(P / 4 + P), ya = 129, orta = (t1 + t2) / 2;
      s += S.ok(orta, ya, t1, ya, { renk: R.metin, kalin: 1.2, boy: 7 }) + S.ok(orta, ya, t2, ya, { renk: R.metin, kalin: 1.2, boy: 7 });
      s += S.cizgi(t1, ya - 5, t1, ek.Y(K), { renk: R.soluk, kalin: 1 }) + S.cizgi(t2, ya - 5, t2, ek.Y(K), { renk: R.soluk, kalin: 1 });
      s += S.yazi(orta, ya - 6, 'bir dolanım: 4,2 gün', { boy: 13, hiza: 'middle', renk: R.metin });
      return s;
    }
  });

  /* d13 · bölüm 2: geçiş ışık eğrisi. Gezegen/yıldız yarıçap oranı Jüpiter/Güneş = 69.911/695.700 ≈ 0,1005 (ölçekli);
     derinlik (oran)² ≈ %1,01; Dünya için ≈ %0,0084 (ders örneği). Eğrinin zaman ekseni ve kenar biçimi şematik. */
  C.ekle('d13-gecis-egrisi', {
    ders: 'd13', bolum: 2, oran: 0.8,
    baslik: 'Geçiş: gezegenin gölgesi ışık eğrisinde',
    aciklama: 'Jüpiter boyunda bir gezegen Güneş benzeri bir yıldızın önünden geçerken yıldızın ışığı yaklaşık yüzde 1 azalır; çukurun derinliği, gezegen yarıçapının yıldız yarıçapına oranının karesidir. Dünya boyunda bir gezegenin çukuru yalnızca yüzde 0,0084 olur ve bu ölçekte görünmez. Yıldız ve gezegen diskleri ölçekli, zaman ekseni şematiktir.',
    kaynak: [
      { ad: 'NASA NSSDC – Sun Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html?level=1' },
      { ad: 'NASA NSSDC – Jupiter Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html' }
    ],
    ciz(S) {
      const R = S.R, yx = 200, yy = 64, yr = 50;
      const oran = 69911 / 695700, pr = yr * oran, derin = 100 * oran * oran;   // ≈ 1,01 %
      let s = '';
      s += S.daire(yx, yy, yr, { dolgu: R.yildiz, renk: R.yildiz, saydam: 'var(--disk-saydam)' });   // kırmızı modda opak: üstündeki siyah "2" 4,5:1'i geçsin
      s += S.cizgi(70, yy, 330, yy, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.ok(318, yy, 336, yy, { renk: R.soluk, kalin: 1, boy: 7 });
      [[100, '1'], [200, '2'], [300, '3']].forEach(([x, no]) => {
        const ustte = x > yx - yr && x < yx + yr;
        s += S.daire(x, yy, pr, { dolgu: ustte ? R.zemin : R.soluk, renk: ustte ? R.zemin : R.soluk });
        s += S.yazi(x, yy - 12, no, { boy: 13, hiza: 'middle', renk: ustte ? R.zemin : R.soluk, kalin: true });
      });
      s += S.yazi(10, 24, 'Jüpiter boyu', { boy: 13, renk: R.metin });
      s += S.yazi(10, 40, '(ölçekli)', { boy: 13, renk: R.soluk });
      s += S.yazi(390, 24, 'Dünya boyu: %0,0084', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(390, 40, '(burada görünmez)', { boy: 13, hiza: 'end', renk: R.soluk });
      /* ışık eğrisi: yatay eksen üstteki çizimle aynı x (gezegenin konumu) */
      const ek = S.eksen({ x: 60, y: 140, w: 320, h: 115 }, { x0: 60, x1: 380, y0: 98.8, y1: 100.2 }, {
        yIsaret: [[100, '%100'], [99, '%99']], xAd: 'zaman →'
      });
      s += ek.svg;
      s += S.yazi(10, 132, 'parlaklık', { boy: 13, renk: R.soluk });
      const dip = 100 - derin, g1 = yx - yr - pr, g2 = yx - yr + pr, c1 = yx + yr - pr, c2 = yx + yr + pr;
      s += S.egri([[60, 100], [g1, 100], [g2, dip], [c1, dip], [c2, 100], [380, 100]].map(p => [ek.X(p[0]), ek.Y(p[1])]), { renk: R.vurgu, kalin: 2.2 });
      [[100, 100, '1'], [200, dip, '2'], [300, 100, '3']].forEach(([x, v, no]) => {
        s += S.daire(ek.X(x), ek.Y(v), 4, { dolgu: R.metin, renk: R.metin });
        s += S.yazi(ek.X(x), ek.Y(v) + (no === '2' ? -10 : 18), no, { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      });
      /* derinlik oku */
      const dx = 272;
      s += S.cizgi(ek.X(c1) + 4, ek.Y(dip), dx + 6, ek.Y(dip), { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.ok(dx, ek.Y(100) + 2, dx, ek.Y(dip), { renk: R.metin, kalin: 1.2, boy: 7 });
      s += S.ok(dx, ek.Y(dip), dx, ek.Y(100) + 2, { renk: R.metin, kalin: 1.2, boy: 7 });
      s += S.yazi(dx + 8, (ek.Y(100) + ek.Y(dip)) / 2 - 2, 'derinlik', { boy: 13, renk: R.metin });
      s += S.yazi(dx + 8, (ek.Y(100) + ek.Y(dip)) / 2 + 14, '≈ %' + derin.toFixed(2).replace('.', ','), { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* d13 · bölüm 5: Güneş'in yaşanabilir bölgesi (Kasting 1993: 0,95–1,37; Kopparapu 2013: 0,99–1,67 AB) ve ışınımı 0,25 Güneş olan
     yıldız için ölçeklenmiş bölge 0,50–0,84 AB (ders örneği). Venüs 0,72 ve Mars 1,52 AB (NASA, d9). Yatay eksen ölçekli. */
  C.ekle('d13-yasanabilir-bolge', {
    ders: 'd13', bolum: 5, oran: 0.7,
    baslik: 'Yaşanabilir bölge: modele ve yıldıza göre',
    aciklama: 'Güneş için iki tahmin: Kasting ve arkadaşları 0,95 ile 1,37 AB, Kopparapu ve arkadaşları 0,99 ile 1,67 AB; Dünya ikisinde de iç kenara yakın. Işınımı Güneş\'in dörtte biri olan bir yıldızda bölge kabaca 0,50 ile 0,84 AB\'ye, yani yıldıza yaklaşır. Yatay eksen ölçeklidir.',
    kaynak: [
      { ad: 'Wikipedia – Habitable zone', url: 'https://en.wikipedia.org/wiki/Habitable_zone' },
      { ad: 'NASA NSSDC – Planetary Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' }
    ],
    ciz(S) {
      const R = S.R, x0 = 30, k = 197, X = a => x0 + a * k;   // 1 AB = 197 birim
      let s = '';
      /* Güneş satırı */
      s += S.yazi(x0 + 16, 34, 'Kasting ve ark. 1993: 0,95–1,37 AB', { boy: 13, renk: R.metin });
      s += S.kutu(X(0.95), 42, X(1.37) - X(0.95), 14, { dolgu: R.mavi, renk: R.mavi, saydam: 0.75 }, 3);
      s += S.yazi(x0 + 16, 78, 'Kopparapu ve ark. 2013: 0,99–1,67 AB', { boy: 13, renk: R.metin });
      s += S.kutu(X(0.99), 86, X(1.67) - X(0.99), 14, { dolgu: R.iyi, renk: R.iyi, saydam: 0.75 }, 3);
      const py = 124;
      s += S.cizgi(x0, py, X(1.8), py, { renk: R.cizgi, kalin: 1 });
      s += S.daire(x0, py, 10, { dolgu: R.gunes, renk: R.gunes });
      s += S.yazi(x0 + 16, py - 6, 'Güneş', { boy: 13, renk: R.soluk });
      [[0.72, 'Venüs'], [1, 'Dünya'], [1.52, 'Mars']].forEach(([a, ad]) => {
        s += S.cizgi(X(a), 84, X(a), py, { renk: R.soluk, kalin: 1, kesik: '2 3' });
        s += S.daire(X(a), py, 5, { dolgu: a === 1 ? R.mavi : R.metin, renk: R.zemin, kalin: 1 });
        s += S.yazi(X(a), py + 20, ad, { boy: 13, hiza: 'middle', renk: R.metin });
      });
      /* sönük yıldız satırı */
      const sy = 200;
      s += S.cizgi(x0, sy, X(1.8), sy, { renk: R.cizgi, kalin: 1 });
      s += S.daire(x0, sy, 6, { dolgu: R.uyari, renk: R.uyari });
      s += S.yazi(x0 + 16, 170, 'Işınımı Güneş\'in 0,25 katı yıldız:', { boy: 13, renk: R.metin });
      s += S.yazi(x0 + 16, 186, 'bölge ≈ 0,50–0,84 AB', { boy: 13, renk: R.metin });
      s += S.kutu(X(0.5), sy - 7, X(0.84) - X(0.5), 14, { dolgu: R.iyi, renk: R.iyi, saydam: 0.75 }, 3);
      /* eksen */
      const ay = 232;
      s += S.cizgi(x0, ay, X(1.8), ay, { renk: R.soluk, kalin: 1 });
      [[0, '0'], [0.5, '0,5'], [1, '1'], [1.5, '1,5']].forEach(([a, t]) => {
        s += S.cizgi(X(a), ay, X(a), ay + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(a), ay + 20, t, { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.yazi(X(0.9), 272, 'yıldıza uzaklık (AB)', { boy: 14, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* ===================== d18 · Yaşam arayışı ===================== */

  /* d18 · bölüm 1: Dünya'da yaşamın zaman çizelgesi, doğrusal (ölçekli). Saatler: (4,54 − t) / 4,54 × 24 (ders örneği). */
  C.ekle('d18-yasam-zaman', {
    ders: 'd18', bolum: 1, oran: 1.0,
    baslik: 'Dünya\'nın 4,54 milyar yılında yaşamın izleri',
    aciklama: 'Yukarıdan aşağı Dünya\'nın tarihi ölçekli olarak akar. Dünya 4,54 milyar yıl önce oluştu; tartışmalı Isua yapıları 3,7, geniş kabul gören Pilbara stromatolitleri 3,48 milyar yıllık; havada oksijen ancak 2,4 milyar yıl önce birikti. Tarihi bir güne sığdırırsan Pilbara izleri sabah 05.36\'da, oksijen 11.19\'da belirir.',
    kaynak: [
      { ad: 'USGS – Age of the Earth', url: 'https://pubs.usgs.gov/gip/geotime/age.html' },
      { ad: 'ScienceDaily – 3,48 milyar yıllık stromatolitler (2022)', url: 'https://ScienceDaily.com/releases/2022/11/221107135817.htm' },
      { ad: 'Quanta Magazine – Isua (2018)', url: 'https://quantamagazine.org/worlds-oldest-fossils-now-appear-to-be-squished-rocks-20181022' },
      { ad: 'NASA Astrobiology – Revisiting Earth\'s oxygenation', url: 'https://astrobiology.nasa.gov/news/revisiting-earths-oxygenation-24-billion-years-ago/' }
    ],
    ciz(S) {
      const R = S.R, ax = 112, y0 = 40, y1 = 380, T = 4.54, Y = t => y0 + (T - t) / T * (y1 - y0);
      const saat = t => { const h = (T - t) / T * 24, hh = Math.floor(h), mm = Math.round((h - hh) * 60); return String(hh).padStart(2, '0') + '.' + String(mm).padStart(2, '0'); };
      let s = '';
      s += S.yazi(ax - 8, 20, 'milyar yıl önce', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.cizgi(ax, y0, ax, y1, { renk: R.soluk, kalin: 2 });
      [4, 3, 2, 1].forEach(t => { s += S.cizgi(ax - 5, Y(t), ax, Y(t), { renk: R.soluk, kalin: 1 }) + S.yazi(ax - 9, Y(t) + 4, String(t), { boy: 13, hiza: 'end', renk: R.soluk }); });
      /* oksijensiz yaşam aralığı */
      s += S.cizgi(ax, Y(3.48), ax, Y(2.4), { renk: R.iyi, kalin: 6 });
      s += S.cizgi(ax, Y(2.4), ax, y1, { renk: R.mavi, kalin: 6 });
      const olay = (t, ly, renk, sat1, sat2) => {
        let o = S.daire(ax, Y(t), 5, { dolgu: renk, renk: R.zemin, kalin: 1.5 });
        o += S.yol(`M${ax + 6},${Y(t)} L${ax + 16},${Y(t)} L${ax + 22},${ly - 4}`, { renk: R.soluk, kalin: 1 });
        o += S.yazi(ax + 26, ly, sat1, { boy: 13, renk: R.metin, kalin: true });
        if (sat2) o += S.yazi(ax + 26, ly + 16, sat2, { boy: 13, renk: R.soluk });
        return o;
      };
      s += olay(4.54, Y(4.54) + 4, R.metin, 'Dünya oluşur', '4,54 milyar yıl · saat 00.00');
      s += olay(3.7, Y(3.7) - 10, R.uyari, 'Isua yapıları (tartışmalı)', '3,7 milyar yıl');
      s += olay(3.48, Y(3.48) + 22, R.iyi, 'Pilbara stromatolitleri', '3,48 milyar yıl · saat ' + saat(3.48));
      s += S.yazi(ax + 26, Y(3.48) + 59, 'yaklaşık 1,1 milyar yıl:', { boy: 13, renk: R.iyi });
      s += S.yazi(ax + 26, Y(3.48) + 75, 'yaşam var, havada oksijen yok', { boy: 13, renk: R.iyi });
      s += olay(2.4, Y(2.4) + 21, R.mavi, 'Havada oksijen birikir', '2,4 milyar yıl · saat ' + saat(2.4));
      s += olay(0, Y(0) - 4, R.metin, 'Bugün · saat 24.00', null);
      s += S.yazi(ax - 9, Y(0) + 4, 'bugün', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d18 · bölüm 5: yeraltı okyanusları. Çaplar ölçekli (3.122, 504, 5.149 km; ders). Kalınlık/derinlik tahminleri kaynaklarıyla:
     Europa buz ≈29 km (Juno, dış katman; SwRI 2026), okyanus 50–100 (NASA afişi) ve 60–150 km (JPL); Enceladus 2014 güney: buz 30–40,
     okyanus ≈10 km (bölgesel; Astronomy); Park ve ark. 2024 ortalama: buz 27–33, okyanus 21–26 km; Titan okyanusa ≈100 km (NASA afişi). */
  C.ekle('d18-okyanus-dunyalari', {
    ders: 'd18', bolum: 5, oran: 1.06,
    baslik: 'Buzun altındaki okyanuslar: tahminler ve farkları',
    aciklama: 'Üstte üç uydu ölçekli: Titan en büyük, Enceladus Europa\'nın yanında küçük bir nokta. Altta kalınlık tahminleri: Juno\'nun ölçtüğü yaklaşık 29 km, Europa\'nın buz kabuğunun yalnız soğuk ve katı dış katmanıdır; altında daha ılık bir buz katmanı varsa kabuğun tamamı daha kalındır. Europa\'nın okyanusu için kaynaklar 50 ile 100 ya da 60 ile 150 km diyor; Enceladus için 2014 ve 2024 çalışmaları farklı buz ve okyanus kalınlıkları buluyor; Titan\'da okyanusun yaklaşık 100 km aşağıda olduğu düşünülüyor. Çubuklar tahmin aralığını, noktalar tek değerleri gösterir.',
    kaynak: [
      { ad: 'JPL – Europa Clipper quick facts', url: 'https://jpl.nasa.gov/press-kits/europa-clipper/quick-facts' },
      { ad: 'NASA Astrobiology – Science background (afiş metni)', url: 'https://astrobiology.nasa.gov/uploads/filer_public/29/53/29537716-a2cd-45a7-a484-e99769b6b278/ab-poster-sciencebackgroundtext_2025.pdf' },
      { ad: 'SwRI – Juno measures thickness of Europa\'s ice shell (2026)', url: 'https://www.swri.org/newsroom/press-releases/nasa-s-juno-spacecraft-measures-thickness-of-europa-s-ice-shell' },
      { ad: 'JPL – NASA\'s Juno measures thickness of Europa\'s ice shell (27 Ocak 2026)', url: 'https://www.jpl.nasa.gov/news/nasas-juno-measures-thickness-of-europas-ice-shell' },
      { ad: 'Astronomy – NASA space assets detect ocean inside Saturn moon (2014)', url: 'https://www.astronomy.com/science/nasa-space-assets-detect-ocean-inside-saturn-moon/' },
      { ad: 'Park ve ark. 2024, JGR Planets – Enceladus', url: 'https://authors.library.caltech.edu/records/nxz35-wch52' },
      { ad: 'Eos – Enceladus (504 km)', url: 'https://eos.org/articles/hydrogen-molecules-hint-at-habitability-of-enceladuss-ocean' },
      { ad: 'The Planetary Society – Titan', url: 'https://www.planetary.org/worlds/titan' }
    ],
    ciz(S) {
      const R = S.R;
      let s = '';
      /* ölçekli diskler: 5.149 km = 84 birim çap */
      const k = 84 / 5149, dy = 56;
      [[70, 'Europa', 3122, '3.122 km'], [200, 'Enceladus', 504, '504 km'], [330, 'Titan', 5149, '5.149 km']].forEach(([x, ad, cap, yz]) => {
        s += S.daire(x, dy, cap * k / 2, { dolgu: ad === 'Titan' ? R.uyari : R.ay, renk: R.zemin, saydam: ad === 'Titan' ? 0.8 : 0.9 });
        s += S.yazi(x, 118, ad + ' · ' + yz, { boy: 13, hiza: 'middle', renk: R.metin });
      });
      s += S.yazi(200, 20, 'çaplar ölçekli', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* kalınlık tahminleri */
      const px = 180, pw = 205, kmMax = 160, X = v => px + v / kmMax * pw;
      const satirlar = [
        ['b', 'Europa'],
        ['n', 'Buzun dış katmanı, Juno', 29, null, 'buz'],
        ['r', 'Okyanus, NASA afişi', 50, 100, 'su'],
        ['r', 'Okyanus, JPL', 60, 150, 'su'],
        ['b', 'Enceladus'],
        ['r', 'Buz 2014 · güney', 30, 40, 'buz'],
        ['n', 'Okyanus 2014 · güney', 10, null, 'su'],
        ['r', 'Buz 2024 · ortalama', 27, 33, 'buz'],
        ['r', 'Okyanus 2024 · ortalama', 21, 26, 'su'],
        ['b', 'Titan'],
        ['n', 'Okyanusa derinlik', 100, null, 'su']
      ];
      let y = 146;
      const ust = y - 12;
      satirlar.forEach(st => {
        if (st[0] === 'b') { y += 6; s += S.yazi(10, y, st[1], { boy: 14, renk: R.metin, kalin: true }); y += 19; return; }
        const [tur, ad, a, b, cins] = st, renk = cins === 'buz' ? R.ay : R.mavi;
        s += S.yazi(18, y, ad, { boy: 13, renk: R.soluk });
        if (tur === 'r') {
          s += S.kutu(X(a), y - 10, X(b) - X(a), 11, { dolgu: renk, renk: renk, saydam: 0.85 }, 2);
          const metin = a + '–' + b;
          const sagda = X(b) + 6 + metin.length * 7.4 < 396;
          s += S.yazi(sagda ? X(b) + 6 : X(a) - 6, y, metin, { boy: 13, hiza: sagda ? 'start' : 'end', renk: R.metin });
        } else {
          s += S.daire(X(a), y - 4.5, 5, { dolgu: renk, renk: R.zemin, kalin: 1 });
          s += S.yazi(X(a) + 9, y, '≈' + a, { boy: 13, renk: R.metin });
        }
        y += 20;
      });
      /* eksen */
      const ay = y - 6;
      [0, 50, 100, 150].forEach(v => {
        s += S.cizgi(X(v), ust, X(v), ay, { renk: R.cizgi, kalin: 1 });
        s += S.yazi(X(v), ay + 17, String(v), { boy: 13, hiza: 'middle', renk: R.soluk });
      });
      s += S.cizgi(px, ay, px + pw, ay, { renk: R.soluk, kalin: 1 });
      s += S.yazi(px + pw / 2, ay + 36, 'kalınlık ya da derinlik (km)', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* d18 · bölüm 8: Drake denkleminin yedi çarpanı; 1961 tahminleri ve bugün (ders metni). Tablo biçiminde, ölçeksiz. */
  C.ekle('d18-drake', {
    ders: 'd18', bolum: 8, oran: 0.79,
    baslik: 'Drake denklemi: ölçülenler ve bilinmeyenler',
    aciklama: 'Yedi çarpan alt alta çarpılır. İlk üçü bugün ölçülebiliyor: yılda 1 ile 3 yıldız doğuyor, neredeyse her yıldızın gezegeni var, gezegen oranı ile uygun gezegen sayısının çarpımı yaklaşık 0,4. Yaşamın, zekânın, teknolojinin ve uygarlık ömrünün çarpanları ise hâlâ bilinmiyor; bu yüzden tahminler 1\'den milyonlara uzanır.',
    kaynak: [
      { ad: 'Wikipedia – Drake equation', url: 'https://en.wikipedia.org/wiki/Drake_equation' },
      { ad: 'SETI Institute – Drake Equation', url: 'https://seti.org/drake-equation-index' }
    ],
    ciz(S) {
      const R = S.R, c1 = 228, c2 = 340;
      let s = '';
      s += S.yazi(10, 22, 'Çarpan', { boy: 13, renk: R.soluk, kalin: true });
      s += S.yazi(c1, 22, '1961 tahmini', { boy: 13, hiza: 'middle', renk: R.soluk, kalin: true });
      s += S.yazi(c2, 22, 'Bugün', { boy: 13, hiza: 'middle', renk: R.soluk, kalin: true });
      s += S.cizgi(8, 30, 392, 30, { renk: R.cizgi, kalin: 1 });
      const sat = [
        ['R*', 'yıldız doğum hızı', '1 / yıl', '1–3 / yıl', 'iyi'],
        ['fp', 'gezegenli yıldız', '0,2–0,5', '≈1', 'iyi'],
        ['ne', 'uygun gezegen', '1–5', null, 'iyi'],
        ['fl', 'yaşam çıkar', '1', '?', 'yok'],
        ['fi', 'zekâ gelişir', '1', '?', 'yok'],
        ['fc', 'teknoloji', '0,1–0,2', '?', 'yok'],
        ['L', 'yayın ömrü (yıl)', '1.000–100 milyon', '?', 'yok']
      ];
      const h = 31, y0 = 54;
      sat.forEach((r, i) => {
        const y = y0 + i * h;
        if (i % 2 === 0) s += S.kutu(6, y - 20, 388, h, { dolgu: R.yuzey2, renk: 'none', saydam: 0.6 }, 4);
        s += S.yazi(12, y, (i ? '× ' : '   ') + r[0], { boy: 15, renk: R.vurgu, kalin: true, italik: true });
        s += S.yazi(56, y, r[1], { boy: 13, renk: R.metin });
        s += S.yazi(c1, y, r[2], { boy: 13, hiza: 'middle', renk: R.metin });
        if (r[3] === '?') s += S.yazi(c2, y + 1, '?', { boy: 17, hiza: 'middle', renk: R.uyari, kalin: true });
        else if (r[3]) s += S.yazi(c2, y, r[3], { boy: 13, hiza: 'middle', renk: R.iyi, kalin: true });
      });
      /* fp × ne birlikte: 0,4 (Kepler 2013) */
      s += S.yazi(c2, y0 + 2 * h, 'fp × ne ≈ 0,4', { boy: 13, hiza: 'middle', renk: R.iyi, kalin: true });
      /* sonuç */
      const ys = y0 + 7 * h + 4;
      s += S.cizgi(8, ys - 22, 392, ys - 22, { renk: R.soluk, kalin: 1.2 });
      s += S.yazi(12, ys, '= N', { boy: 15, renk: R.vurgu, kalin: true, italik: true });
      s += S.yazi(56, ys, 'uygarlık sayısı', { boy: 13, renk: R.metin });
      s += S.yazi(c1, ys, '20–50 milyon', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(c2, ys, '1 – milyonlar', { boy: 13, hiza: 'middle', renk: R.uyari, kalin: true });
      s += S.yazi(200, ys + 28, 'Drake\'in kendi tahmini: N ≈ 10.000', { boy: 13, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });
})();
