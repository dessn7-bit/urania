/* cizim_v5a.js — ders çizimleri (d34, d44, d35, d36). cizim.js kayıtları; kaynaklar: arastirma/cizim_v5a_kaynak.md
   Dersler: d34 (Güneş Sistemi'nin doğuşu), d44 (Dünya), d35 (Merkür ve Venüs), d36 (Mars).
   Sayılar ders metninden (kaynaklı) gelir ya da burada formülle hesaplanır (kaynak dosyasında formülüyle). */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;
  const rad = Math.PI / 180;
  /* Türkçe sayı: ondalık virgül, gerçek eksi işareti, binlik nokta */
  const tr = (x, d) => {
    const s = Math.abs(x).toFixed(d == null ? 0 : d).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (x < 0 ? '−' : '') + s.join(',');
  };
  /* Yazı genişliği kestirimi (Plex ~0,52 em) */
  const gen = (t, boy) => String(t).length * (boy || 13) * 0.52;
  /* Çeyrek ya da yarım daire dilimi: merkez (x,y), yarıçap r, açılar derece (matematik yönü) */
  const dilim = (x, y, r, a1, a2) => {
    const p = a => [x + r * Math.cos(a * rad), y - r * Math.sin(a * rad)];
    const [x1, y1] = p(a1), [x2, y2] = p(a2);
    return `M${x},${y} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
  };
  const KAYNAK = {
    toronto: { ad: 'Toronto Üniv. AST221 Ders 18 (gezegen oluşumu)', url: 'https://www.astro.utoronto.ca/~mhvk/AST221/L18/L18.pdf' },
    karCizgisi: { ad: 'Wikipedia: Frost line (astrophysics)', url: 'https://en.wikipedia.org/wiki/Frost_line_(astrophysics)' },
    arxivSu: { ad: 'arXiv 1708.03360: Disk evolution and the fate of water', url: 'https://arxiv.org/pdf/1708.03360' },
    akis: { ad: 'Wikipedia: Streaming instability', url: 'https://en.wikipedia.org/wiki/Streaming_instability' },
    bulutsu: { ad: 'Wikipedia: Nebular hypothesis', url: 'https://en.wikipedia.org/wiki/Nebular_hypothesis' },
    cai: { ad: 'Phys.org: CAI ve kondrül tarihleri (2012)', url: 'https://phys.org/news/2012-11-technique-date-cais-chondrules.amp' },
    marsHiz: { ad: 'UChicago News: Mars\'ın hızlı oluşumu (2011)', url: 'https://news.uchicago.edu/story/mars-rapid-formation-stunted-growth' },
    jupiter: { ad: 'Phys.org: Jüpiter en yaşlı gezegen (2017)', url: 'https://phys.org/news/2017-06-evidence-jupiter-oldest-planet-solar.html' },
    al26: { ad: 'Lee, Papanastassiou, Wasserburg (1977)', url: 'https://authors.library.caltech.edu/records/kerdw-92g33' },
    nice: { ad: 'Wikipedia: Nice model', url: 'https://en.wikipedia.org/wiki/Nice_model' },
    lhb: { ad: 'Wikipedia: Late Heavy Bombardment', url: 'https://en.wikipedia.org/wiki/Late_Heavy_Bombardment' },
    dunyaYasi: { ad: 'Wikipedia: Age of Earth', url: 'https://en.wikipedia.org/wiki/Age_of_Earth' },
    nasaDunya: { ad: 'NASA Earth Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
    jmu: { ad: 'JMU: The Interior of the Earth', url: 'https://csmgeo.csm.jmu.edu/geollab/baedke/gsci115/earthinterior.html' },
    aps: { ad: 'APS News: Inge Lehmann', url: 'https://aps.org/publications/apsnews/202309/history.cfm' },
    icCekirdek: { ad: 'Wikipedia: Earth\'s inner core', url: 'https://www.wikiwand.com/en/Inner_core' },
    esrf: { ad: 'ESRF: Earth\'s centre 1000 degrees hotter (2013)', url: 'https://www.esrf.fr/news/general/Earth-Center-Hotter' },
    ucar: { ad: 'UCAR: Layers of Earth\'s Atmosphere', url: 'https://scied.ucar.edu/learning-zone/atmosphere/layers-earths-atmosphere' },
    nasaMerkur: { ad: 'NASA Mercury Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html' },
    nasaVenus: { ad: 'NASA Venus Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html' },
    merkurKart: { ad: 'NASA: Mercury lithograph', url: 'https://www.nasa.gov/wp-content/uploads/2009/12/mercury_lithograph.pdf' },
    venusKart: { ad: 'NASA: Venus lithograph', url: 'https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf' },
    earthskyMerkur: { ad: 'EarthSky: Merkür\'ün katı iç çekirdeği (2019)', url: 'https://earthsky.org/space/mystery-solved-mercury-solid-inner-core-messenger/' },
    margot: { ad: 'Margot ve ekibi (2021), Nature Astronomy', url: 'https://ui.adsabs.harvard.edu/abs/2021NatAs.tmp...74M' },
    eylemsizlik: { ad: 'Wikipedia: Moment of inertia factor', url: 'https://en.wikipedia.org/wiki/Moment_of_inertia_factor' },
    nasaMars: { ad: 'NASA Mars Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html' },
    ipgp: { ad: 'IPGP: Mars mantosunun dibinde erimiş katman (2023)', url: 'https://www.ipgp.fr/en/news-and-agenda/news/insight-seismic-data-reveals-a-molten-layer-at-the-base-of-the-martian-mantle/' },
    samuel: { ad: 'Samuel ve ekibi (2023), Nature (ADS özeti)', url: 'https://ui.adsabs.harvard.edu/abs/2023Natur.622..712S' },
    cas: { ad: 'CAS: Mars\'ta katı iç çekirdek (2025)', url: 'https://english.cas.cn/newsroom/research_news/earth/202509/t20250928_1058923.shtml' },
    kabukMars: { ad: 'Universe Today: Mars has a thick crust (2023)', url: 'https://www.universetoday.com/articles/mars-has-a-thick-crust-its-internal-heat-mainly-comes-from-radioactivity' },
    worldatlas: { ad: 'WorldAtlas: The largest volcano in the Solar System', url: 'https://www.worldatlas.com/space/the-largest-volcano-in-the-solar-system.html' },
    vallesESA: { ad: 'ESA: Mars Express peers into Mars\' Grand Canyon', url: 'https://esa.int/Science_Exploration/Space_Science/Mars_Express/Mars_Express_peers_into_Mars_Grand_Canyon' },
    olympus: { ad: 'Wikipedia: Olympus Mons', url: 'https://en.wikipedia.org/wiki/Olympus_Mons' },
    marsUydu: { ad: 'NASA Science: Mars moons', url: 'https://science.nasa.gov/mars/moons/' },
    areostasyoner: { ad: 'Wikipedia: Areostationary orbit', url: 'https://en.wikipedia.org/wiki/Areostationary_orbit' }
  };

  /* ================================================================ d34 ================================================================ */

  /* d34 · bölüm 4: Hayashi disk sıcaklığı T = 280 K × r^(−1/2) ve suyun donma aralığı 150–170 K. */
  C.ekle('d34-kar-cizgisi', {
    ders: 'd34', bolum: 4, oran: 0.78,
    baslik: 'Kar çizgisi: diskin sıcaklığı suyun donduğu yere iner',
    aciklama: 'Eğri, Hayashi modelinde genç diskin sıcaklığıdır: Güneş\'ten uzaklığın kareköküyle ters orantılı düşer; 1 AB\'de 280 kelvin, 4 AB\'de 140 kelvin. Yatay şerit suyun boşlukta donduğu 150 ile 170 kelvin aralığıdır. Eğri bu şeridi 2,7 ile 3,5 AB arasında keser. İçeride yalnız kaya ve metal taneler katı kalır, su buhardır; dışarıda su da buz olur ve katı malzeme yaklaşık beş kat bollaşır. Üstteki taneler bunu gösterir: içte çıplak kaya, dışta buz kaplı kaya. Kaya ancak 1300 kelvin dolayında erir, yani grafiğin çok üstünde. Üstteki köşeli ayraç, kaynakların kar çizgisi için verdiği 2,7 ile 5 AB aralığıdır; çizgi modele ve zamana göre kayar.',
    kaynak: [KAYNAK.arxivSu, KAYNAK.karCizgisi, KAYNAK.toronto],
    ciz(S) {
      const R = S.R, T = r => 280 / Math.sqrt(r);
      const ek = S.eksen({ x: 58, y: 64, w: 322, h: 194 }, { x0: 0.4, x1: 6, y0: 0, y1: 450 }, {
        xIsaret: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']],
        yIsaret: [[0, '0'], [100, '100'], [200, '200'], [300, '300'], [400, '400']],
        xAd: 'Güneş\'e uzaklık (AB)', yAd: 'disk sıcaklığı (K)', yAdUzak: 44
      });
      const r170 = Math.pow(280 / 170, 2), r150 = Math.pow(280 / 150, 2);
      let s = '';
      /* kar çizgisinin ötesi: hafif gölge */
      s += S.kutu(ek.X(r170), 64, ek.X(6) - ek.X(r170), 194, { dolgu: R.mavi, renk: 'none', saydam: 0.07 });
      /* suyun donma şeridi */
      s += S.kutu(ek.X(0.4), ek.Y(170), ek.X(6) - ek.X(0.4), ek.Y(150) - ek.Y(170), { dolgu: R.mavi, renk: 'none', saydam: 0.3 });
      s += S.yazi(64, ek.Y(170) - 6, 'su donar: 150–170 K', { boy: 13, renk: R.mavi });
      /* kesişme dikeyleri */
      [[r170, '2,7 AB', 'end'], [r150, '3,5 AB', 'start']].forEach(([r, t, h]) => {
        s += S.cizgi(ek.X(r), ek.Y(170) - 2, ek.X(r), ek.Y(0), { renk: R.mavi, kalin: 1.2, kesik: '4 3' });
        s += S.yazi(ek.X(r) + (h === 'end' ? -4 : 4), ek.Y(170) - 6, t, { boy: 13, hiza: h, renk: R.metin, kalin: true });
      });
      /* sıcaklık eğrisi */
      s += S.fonk(ek, T, 0.4, 6, 120, { renk: R.vurgu, kalin: 2.6 });
      [[1, '1 AB: 280 K', 8, -4], [4, '4 AB: 140 K', 6, 22]].forEach(([r, t, dx, dy]) => {
        s += S.daire(ek.X(r), ek.Y(T(r)), 4, { dolgu: R.vurgu, renk: 'none' });
        s += S.zeminliYazi(ek.X(r) + dx, ek.Y(T(r)) + dy, t, { boy: 13, renk: R.metin });
      });
      s += S.yazi(376, 86, 'kaya ancak ≈1300 K\'de erir', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(64, 222, 'su buhar; yalnız kaya', { boy: 13, renk: R.metin });
      s += S.yazi(64, 238, 've metal taneler katı', { boy: 13, renk: R.metin });
      s += S.yazi(ek.X(r150) + 6, 232, 'buz da katı:', { boy: 13, renk: R.metin });
      s += S.yazi(ek.X(r150) + 6, 248, 'katı ≈5 kat bol', { boy: 13, renk: R.metin });
      /* üst şerit: kaynakların aralığı ve taneler */
      const b1 = ek.X(2.7), b2 = ek.X(5);
      s += S.yazi((b1 + b2) / 2 - 20, 14, 'kaynakların kar çizgisi aralığı: 2,7–5 AB', { boy: 13, hiza: 'middle', renk: R.soluk });
      s += S.yol(`M${b1},26 L${b1},20 L${b2},20 L${b2},26`, { renk: R.soluk, kalin: 1.2 });
      s += S.yazi(4, 46, 'taneler', { boy: 13, renk: R.soluk });
      for (let r = 0.55; r < 6; r += 0.3) {
        const x = ek.X(r);
        if (r < r170) s += S.daire(x, 42, 2.4, { dolgu: R.gezegen, renk: 'none' });
        else s += S.daire(x, 42, 5, { dolgu: R.mavi, renk: R.mavi, kalin: 1, saydam: 0.45 }) + S.daire(x, 42, 2.4, { dolgu: R.gezegen, renk: 'none' });
      }
      return s;
    }
  });

  /* d34 · bölüm 5: tozdan gezegen çekirdeğine büyüme basamakları (Toronto notları), logaritmik boy ekseni. */
  C.ekle('d34-buyume-merdiveni', {
    ders: 'd34', bolum: 5, oran: 0.7,
    baslik: 'Tozdan gezegen çekirdeğine: metre engeli ve onu atlayan yol',
    aciklama: 'Yatay eksen cismin boyudur ve logaritmiktir: her büyük çentik bin kat. Basamaklar ders metnindeki sıradır: mikrometrelik toz yaklaşık 10 üzeri eksi 15 kilogram, santimetrelik çakıl 1 gram, kilometrelik gezegencik 10 üzeri 12 kilogram, 100 kilometrelik embriyo 10 üzeri 18 kilogram, 1000 kilometrelik çekirdek 10 üzeri 21 kilogram. Toz birkaç bin yılda yapışarak santimetreye büyür. Metre dolayındaki taralı kuşak metre engelidir: bu boydaki cisimler karşıdan esen gaz rüzgârıyla 1 AB\'de yaklaşık bin yılda Güneş\'e düşer. Üstteki büyük ok bugün en çok konuşulan çözümdür: akış kararsızlığında çakıl kümeleri kendi çekimiyle çöker ve tehlikeli boylar atlanarak doğrudan 1 ile 100 kilometrelik gezegencikler oluşur. Sonrasını kütleçekim yönetir.',
    kaynak: [KAYNAK.toronto, KAYNAK.akis, KAYNAK.bulutsu],
    ciz(S) {
      const R = S.R, X = m => 30 + (Math.log10(m) + 6) / 12 * 340, ay = 206;
      let s = '';
      /* metre engeli kuşağı */
      const e1 = X(0.1), e2 = X(10);
      s += S.kutu(e1, 112, e2 - e1, ay - 112, { dolgu: R.uyari, renk: R.uyari, kalin: 1, saydam: 0.22 });
      for (let x = e1 + 4; x < e2; x += 9) s += S.cizgi(x, ay - 2, x + 6, 114, { renk: R.uyari, kalin: 1, saydam: 0.6 });
      s += S.zeminliYazi((e1 + e2) / 2, 128, 'metre engeli', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.zeminliYazi((e1 + e2) / 2, 146, '≈1000 yılda', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.zeminliYazi((e1 + e2) / 2, 164, 'Güneş\'e düşer', { boy: 13, hiza: 'middle', renk: R.metin });
      /* eksen */
      s += S.cizgi(30, ay, 370, ay, { renk: R.soluk, kalin: 1.5 });
      [[1e-6, '1 µm'], [1e-3, '1 mm'], [1, '1 m'], [1e3, '1 km'], [1e6, '1000 km']].forEach(([m, t], i) => {
        s += S.cizgi(X(m), ay, X(m), ay + 6, { renk: R.soluk, kalin: 1 }) + S.yazi(X(m), ay + 22, t, { boy: 13, hiza: i === 0 ? 'start' : i === 4 ? 'end' : 'middle', renk: R.soluk });
      });
      s += S.yazi(200, ay + 44, 'cismin boyu (logaritmik)', { boy: 14, hiza: 'middle', renk: R.soluk });
      /* basamaklar: [boy m, ad, kütle, yazı y, hizalama] */
      const bas = [[1e-6, 'toz', '10⁻¹⁵ kg', 184, 'start'], [1e-2, 'çakıl', '1 g', 184, 'middle'], [1e3, 'gezegencik', '10¹² kg', 184, 'middle'], [1e5, 'embriyo', '10¹⁸ kg', 142, 'middle'], [1e6, 'çekirdek', '10²¹ kg', 102, 'end']];
      bas.forEach(([m, ad, k, y, h]) => {
        const x = X(m);
        if (y < 170) s += S.cizgi(x, y + 20, x, ay - 6, { renk: R.soluk, kalin: 1 });
        s += S.daire(x, ay, 5, { dolgu: R.metin, renk: 'none' });
        s += S.yazi(h === 'start' ? x - 2 : x, y - 14, ad, { boy: 13, hiza: h, renk: R.metin, kalin: true });
        s += S.yazi(h === 'start' ? x - 2 : x, y, k, { boy: 13, hiza: h, renk: R.soluk });
      });
      /* yapışma oku */
      s += S.ok(X(1e-5), 152, X(3e-3), 152, { renk: R.iyi, kalin: 2, boy: 8 });
      s += S.yazi(34, 120, 'yapışarak, birkaç', { boy: 13, renk: R.iyi });
      s += S.yazi(34, 136, 'bin yılda cm\'ye', { boy: 13, renk: R.iyi });
      /* akış kararsızlığı sıçrayışı: çakıldan 1–100 km'ye */
      const x0 = X(1e-2), xg = X(1e4);
      s += S.yol(`M${x0},164 Q${(x0 + xg) / 2},-46 ${xg},${ay - 30}`, { renk: R.vurgu, kalin: 2.4 });
      s += `<polygon points="${xg},${ay - 24} ${xg - 7},${ay - 36} ${xg + 4},${ay - 37}" fill="${R.vurgu}"/>`;
      s += S.yol(`M${X(1e3)},${ay - 12} L${X(1e3)},${ay - 18} L${X(1e5)},${ay - 18} L${X(1e5)},${ay - 12}`, { renk: R.vurgu, kalin: 1.4 });
      s += S.yazi(222, 18, 'akış kararsızlığı: çakıl kümesi çöker,', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(222, 34, 'doğrudan 1–100 km\'lik gezegencik', { boy: 13, hiza: 'middle', renk: R.vurgu });
      s += S.yazi(392, ay + 44, '→ sonra kütleçekim', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d34 · bölüm 11: doğum takvimi; doğuştan (CAI) sonra geçen süre, logaritmik. */
  C.ekle('d34-dogum-takvimi', {
    ders: 'd34', bolum: 11, oran: 1.0,
    baslik: 'Güneş Sistemi\'nin doğum takvimi: önce Jüpiter ve Mars, sonra Dünya',
    aciklama: 'Yatay eksen, ilk katılar olan CAI\'lerin oluştuğu andan, yani 4.567,3 milyon yıl önceden sonra geçen süredir; sıfırdan sonraki eksen logaritmiktir, her çentik on kat. Dolu çubuklar ve noktalar göktaşı ve kaya ölçümlerine, kesikli boş olanlar modellere ya da tartışmalı yorumlara dayanır. Kondrüller ilk yaklaşık 3 milyon yılda oluştu; alüminyum-26 ile ısınan erken cisimler yaklaşık 300 bin yılda eriyebildi. Jüpiter\'in çekirdeği 1 milyon yılda yaklaşık 20, 3 ile 4 milyon yılda en az 50 Dünya kütlesine ulaştı; Mars 2 ile 4 milyon yılda oluştu. Gaz diski yaklaşık 10 milyon yılda dağıldı; embriyoların çarpışması 10 ile 100 milyon yıl sürdü. Ay\'ı doğuran çarpışma yaklaşık 50, Dünya\'nın oluşumu 50 ile 100 milyon yıl sürdü; en yaşlı Dünya zirkonu doğuştan 163 milyon yıl sonrasına aittir. Geç Ağır Bombardıman ve onu açıklamak için önerilen Nice dengesizliği tartışmalıdır.',
    kaynak: [KAYNAK.cai, KAYNAK.al26, KAYNAK.jupiter, KAYNAK.marsHiz, KAYNAK.bulutsu, KAYNAK.dunyaYasi, KAYNAK.lhb, KAYNAK.nice],
    ciz(S) {
      const R = S.R, X = t => t <= 0 ? 30 : 52 + (Math.log10(t) + 1) / 4 * 336, y0 = 70, dy = 23, ey = y0 + 12 * dy - 6;
      let s = '';
      /* gösterge */
      s += S.kutu(8, 10, 22, 9, { dolgu: R.vurgu, renk: 'none' }, 2) + S.yazi(36, 19, 'göktaşı ve kaya ölçümü', { boy: 13, renk: R.metin });
      s += S.kutu(200, 10, 22, 9, { dolgu: 'none', renk: R.metin, kalin: 1.4, kesik: '3 2' }, 2) + S.yazi(228, 19, 'model ya da tartışmalı', { boy: 13, renk: R.metin });
      /* dikey kılavuzlar */
      [0.1, 1, 10, 100, 1000].forEach(t => s += S.cizgi(X(t), 34, X(t), ey, { renk: R.cizgi, kalin: 1 }));
      /* satırlar: [y sırası, öğeler [[t0,t1]], olcum?, yazı, yazı yeri ('sag'|'sol'), yazı x'i için sabit] */
      const satir = [
        [[[0, 0]], true, 'CAI: ilk katılar (4.567,3 milyon yıl önce)', 'sag'],
        [[[0, 2.6]], true, 'kondrüller oluşur', 'sag'],
        [[[0.3, 0.3]], true, 'alüminyum-26 ile erken cisimler erir', 'sag'],
        [[[1, 1], [3, 4]], true, 'Jüpiter çekirdeği', 'sol', '50+ Dünya kütlesi'],
        [[[2, 4]], true, 'Mars oluşur', 'sag'],
        [[[0, 10]], false, 'gaz diski dağılır', 'sag'],
        [[[10, 100]], false, 'embriyolar çarpışır', 'sol'],
        [[[50, 50]], true, 'Ay\'ı doğuran çarpışma', 'sol'],
        [[[50, 100]], true, 'Dünya oluşur', 'sol'],
        [[[163, 163]], true, 'en yaşlı Dünya zirkonu', 'sol'],
        [[[467, 767]], false, 'Geç Ağır Bombardıman?', 'sol'],
        [[[600, 600]], false, 'Nice dengesizliği (model)', 'sol']
      ];
      satir.forEach(([ogeler, olcum, metin, yer, ek2], i) => {
        const y = y0 + i * dy;
        let xmin = 999, xmax = 0;
        ogeler.forEach(([a, b]) => {
          const x1 = X(a), x2 = X(b);
          xmin = Math.min(xmin, x1); xmax = Math.max(xmax, x2);
          if (x2 - x1 < 3) s += S.daire(x1, y, 5, olcum ? { dolgu: R.vurgu, renk: 'none' } : { dolgu: R.zemin, renk: R.metin, kalin: 1.6, kesik: '2 2' });
          else s += S.kutu(x1, y - 5, x2 - x1, 10, olcum ? { dolgu: R.vurgu, renk: 'none' } : { dolgu: 'none', renk: R.metin, kalin: 1.4, kesik: '3 2' }, 2);
        });
        if (yer === 'sag') s += S.yazi(xmax + 8, y + 5, metin, { boy: 13, renk: R.metin });
        else s += S.yazi(xmin - 8, y + 5, metin, { boy: 13, hiza: 'end', renk: R.metin });
        if (ek2) { s += S.yazi(xmax + 8, y + 5, ek2, { boy: 13, renk: R.metin }); s += S.yazi(X(1) + 8, y + 5, '20', { boy: 13, renk: R.metin }); }
      });
      /* eksen: 0, kırık, logaritmik kısım */
      s += S.cizgi(26, ey, 36, ey, { renk: R.soluk, kalin: 1.2 }) + S.cizgi(46, ey, 392, ey, { renk: R.soluk, kalin: 1.2 });
      s += S.cizgi(36, ey + 5, 40, ey - 5, { renk: R.soluk, kalin: 1.2 }) + S.cizgi(42, ey + 5, 46, ey - 5, { renk: R.soluk, kalin: 1.2 });
      [[0, '0'], [0.1, '0,1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1000']].forEach(([t, l], i) => {
        s += S.cizgi(X(t), ey, X(t), ey + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(t), ey + 20, l, { boy: 13, hiza: i === 5 ? 'end' : 'middle', renk: R.soluk });
      });
      s += S.yazi(210, ey + 40, 'doğuştan sonra geçen süre (milyon yıl)', { boy: 14, hiza: 'middle', renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d44 ================================================================ */

  /* d44 · bölüm 3: gölge bölgeleri. Katman yarıçapları ölçekli (NASA, Wikipedia), ışın yolları şematik. */
  C.ekle('d44-golge', {
    ders: 'd44', bolum: 3, oran: 1.0,
    baslik: 'Depremin gölgesi: sıvı dış çekirdek ve Lehmann\'ın iç çekirdeği',
    aciklama: 'Deprem tepededir; açılar Dünya\'nın merkezinden ölçülür. Katmanların boyu ölçeklidir, dalga yolları ise şematiktir. Mantoda ilerleyen P dalgaları 103 dereceye kadar ulaşır; 103 derecede çekirdeği sıyırırlar. Sıvı dış çekirdeğe giren dalgalar bükülür ve 143 derecenin ötesine çıkar; aradaki 103 ile 143 derece kuşağı P gölgesidir, kalın çizgiyle gösterildi. S dalgaları sıvıdan geçemediği için 103 derecenin ötesine hiç ulaşmaz; bu S gölgesi kesikli çizgidir. Kesikli ok, Inge Lehmann\'ın 1936\'da açıkladığı zayıf dalgadır: katı iç çekirdekten dönerek gölgenin içine düşer. Yeryüzünde 103 derece yaklaşık 11.450, 143 derece yaklaşık 15.900 kilometredir.',
    kaynak: [KAYNAK.jmu, KAYNAK.aps, KAYNAK.nasaDunya, KAYNAK.icCekirdek],
    ciz(S) {
      const R = S.R, cx = 200, cy = 196, Rd = 140, rc = Rd * 3485 / 6371, ri = Rd * 1221 / 6371;
      const Y = (d, r) => [cx + r * Math.sin(d * rad), cy - r * Math.cos(d * rad)];   // d: depremden açı (sağa doğru)
      let s = '';
      s += S.daire(cx, cy, Rd, { dolgu: R.vurguSoluk, renk: R.metin, kalin: 1.6, saydam: 1 });
      s += S.daire(cx, cy, Rd, { dolgu: 'none', renk: R.metin, kalin: 1.6 });
      s += S.daire(cx, cy, rc, { dolgu: R.gezegen, renk: R.metin, kalin: 1.2, saydam: 0.4 });
      s += S.daire(cx, cy, rc, { dolgu: 'none', renk: R.metin, kalin: 1.2 });
      s += S.daire(cx, cy, ri, { dolgu: R.gezegen, renk: R.metin, kalin: 1.2 });
      /* gölge kuşakları: P (103–143, iki yan), S (103'ten öte) */
      const yay = (a1, a2, r, o) => {
        const p1 = Y(a1, r), p2 = Y(a2, r), buyuk = Math.abs(a2 - a1) > 180 ? 1 : 0;
        return `<path d="M${p1[0].toFixed(2)},${p1[1].toFixed(2)} A${r},${r} 0 ${buyuk} ${a2 > a1 ? 1 : 0} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}" stroke="${o.renk}" stroke-width="${o.kalin}" fill="none"${o.kesik ? ` stroke-dasharray="${o.kesik}"` : ''}/>`;
      };
      s += yay(103, 143, Rd + 6, { renk: R.uyari, kalin: 7 }) + yay(-143, -103, Rd + 6, { renk: R.uyari, kalin: 7 });
      s += yay(103, 257, Rd + 18, { renk: R.metin, kalin: 2.5, kesik: '6 4' });
      /* işaret çizgileri ve açılar */
      [103, 143].forEach(d => {
        [d, -d].forEach(a => {
          const p = Y(a, Rd - 4), q = Y(a, Rd + 24);
          s += S.cizgi(p[0], p[1], q[0], q[1], { renk: R.metin, kalin: 1 });
        });
      });
      s += S.cizgi(cx, cy, Y(103, Rd)[0], Y(103, Rd)[1], { renk: R.soluk, kalin: 1, kesik: '2 3' });
      s += S.yazi(Y(103, Rd + 26)[0] + 2, Y(103, Rd + 26)[1] + 4, '103°', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(Y(143, Rd + 26)[0] + 2, Y(143, Rd + 26)[1] + 10, '143°', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(Y(-103, Rd + 26)[0] - 2, Y(-103, Rd + 26)[1] + 4, '103°', { boy: 14, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(Y(-143, Rd + 26)[0] - 2, Y(-143, Rd + 26)[1] + 10, '143°', { boy: 14, hiza: 'end', renk: R.metin, kalin: true });
      /* ışınlar (sağ yarı, şematik) */
      const Q = Y(0, Rd);
      const egriIsin = (d, derin) => {
        const P = Y(d, Rd), m = derin, c = 2 * m - Rd * Math.cos(d / 2 * rad), C2 = Y(d / 2, c);
        return S.yol(`M${Q[0]},${Q[1]} Q${C2[0].toFixed(2)},${C2[1].toFixed(2)} ${P[0].toFixed(2)},${P[1].toFixed(2)}`, { renk: R.vurgu, kalin: 1.6 });
      };
      s += egriIsin(40, Rd * Math.cos(20 * rad) * 0.93) + egriIsin(75, Rd * Math.cos(37.5 * rad) * 0.9) + egriIsin(103, rc + 1.5);
      /* çekirdekten geçen: 180° ve ~155° */
      s += S.cizgi(Q[0], Q[1], cx, cy + Rd, { renk: R.vurgu, kalin: 1.6 });
      const P2 = Y(155, Rd), k1 = Y(25, rc * 0.95), k2 = Y(120, rc * 0.6);
      s += S.yol(`M${Q[0]},${Q[1]} C${k1[0].toFixed(2)},${k1[1].toFixed(2)} ${k2[0].toFixed(2)},${k2[1].toFixed(2)} ${P2[0].toFixed(2)},${P2[1].toFixed(2)}`, { renk: R.vurgu, kalin: 1.6 });
      /* Lehmann: iç çekirdekten dönen, 120°'ye düşen zayıf dalga */
      const L = Y(60, ri), P3 = Y(120, Rd);
      s += S.cizgi(Q[0], Q[1], L[0], L[1], { renk: R.metin, kalin: 1.8, kesik: '5 3' });
      s += S.ok(L[0], L[1], P3[0], P3[1], { renk: R.metin, kalin: 1.8, kesik: '5 3', boy: 9 });
      /* deprem */
      s += S.daire(Q[0], Q[1], 6, { dolgu: R.uyari, renk: R.zemin, kalin: 1.5 });
      s += S.yazi(Q[0] - 12, Q[1] - 10, 'deprem', { boy: 14, hiza: 'end', renk: R.metin, kalin: true });
      s += S.yazi(396, 18, 'katmanlar ölçekli,', { boy: 13, hiza: 'end', renk: R.soluk });
      s += S.yazi(396, 34, 'yollar şematik', { boy: 13, hiza: 'end', renk: R.soluk });
      /* katman adları (sol yarı) */
      s += S.zeminliYazi(108, 140, 'manto', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.zeminliYazi(cx - 36, cy - 30, 'sıvı dış', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.zeminliYazi(cx - 36, cy - 14, 'çekirdek', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.zeminliYazi(cx - 42, cy + 40, 'katı iç çekirdek', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.cizgi(cx - 20, cy + 28, cx - 10, cy + 12, { renk: R.metin, kalin: 1 });
      /* gösterge */
      const gy = 374;
      s += S.cizgi(8, gy - 5, 30, gy - 5, { renk: R.uyari, kalin: 7 }) + S.yazi(36, gy, 'P gölgesi: 103°–143°', { boy: 13, renk: R.metin });
      s += S.cizgi(200, gy - 5, 222, gy - 5, { renk: R.metin, kalin: 2.5, kesik: '6 4' }) + S.yazi(228, gy, 'S gölgesi: 103°\'den öte', { boy: 13, renk: R.metin });
      s += S.cizgi(8, gy + 15, 30, gy + 15, { renk: R.metin, kalin: 1.8, kesik: '5 3' }) + S.yazi(36, gy + 20, 'Lehmann\'ın zayıf dalgası: iç çekirdekten döner', { boy: 13, renk: R.metin });
      return s;
    }
  });

  /* d44 · bölüm 4: Dünya'nın içi, çeyrek dilim ölçekli; üstteki 300 km büyütülmüş. */
  C.ekle('d44-katmanlar', {
    ders: 'd44', bolum: 4, oran: 1.0,
    baslik: 'Katman katman Dünya: gerçek ölçekte bir çeyrek dilim',
    aciklama: 'Çeyrek dilim ölçeklidir: merkezden yüzeye 6371 kilometre. En içte 1221 kilometre yarıçaplı katı iç çekirdek, onun üstünde yaklaşık 2260 kilometre kalınlığında sıvı demirden dış çekirdek, sonra yaklaşık 2890 kilometre derine inen katı kaya manto. Kabuk bu ölçekte bir çizgi kadar incedir; sağ üstteki kutu en üstteki 300 kilometreyi büyütür: okyanus kabuğu 5 ile 10, kıta kabuğu ortalama 35 kilometre, altında 100 ile 250 kilometre arasında astenosfer. İç çekirdeğin merkezinde yoğunluk santimetreküpte yaklaşık 13 gram, basınç 330 ile 360 gigapaskal; iç ve dış çekirdeğin sınırında sıcaklık 6000 artı eksi 500 santigrat derecedir. Hacimce iç çekirdek yüzde 0,7, bütün çekirdek yüzde 16, manto ve kabuk yüzde 84 eder.',
    kaynak: [KAYNAK.nasaDunya, KAYNAK.jmu, KAYNAK.icCekirdek, KAYNAK.esrf],
    ciz(S) {
      const R = S.R, cx = 18, cy = 356, Rd = 236, k = Rd / 6371, ri = 1221 * k, rc = 3485 * k;
      let s = '';
      s += S.yol(dilim(cx, cy, Rd, 0, 90), { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.55 });
      s += S.yol(dilim(cx, cy, rc, 0, 90), { dolgu: R.gezegen, renk: 'none', saydam: 0.45 });
      s += S.yol(dilim(cx, cy, ri, 0, 90), { dolgu: R.gezegen, renk: 'none' });
      [ri, rc].forEach(r => s += S.yay(cx, cy, r, 0, 90, { renk: R.metin, kalin: 1.2 }));
      s += S.yay(cx, cy, Rd, 0, 90, { renk: R.metin, kalin: 2.4 });
      s += S.yay(cx, cy, (6371 - 250) * k, 0, 90, { renk: R.metin, kalin: 0.8, kesik: '3 3' });
      s += S.cizgi(cx, cy, cx + Rd + 4, cy, { renk: R.soluk, kalin: 1 }) + S.cizgi(cx, cy, cx, cy - Rd, { renk: R.soluk, kalin: 1 });
      /* yarıçap etiketleri */
      [[0, '0', 'start'], [ri, '1221', 'middle'], [rc, '3485', 'middle'], [Rd, '6371 km', 'end']].forEach(([r, t, h]) => {
        s += S.cizgi(cx + r, cy, cx + r, cy + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(cx + r + (h === 'end' ? 6 : 0), cy + 20, t, { boy: 13, hiza: h, renk: R.soluk });
      });
      s += S.yazi(cx + Rd / 2 + 20, cy + 38, 'merkezden uzaklık', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* katman yazıları */
      s += S.yazi(28, 178, 'Manto', { boy: 15, renk: R.metin, kalin: true });
      s += S.yazi(28, 196, 'katı kaya, ≈2890 km', { boy: 13, renk: R.metin });
      s += S.yazi(28, 212, 'derine kadar', { boy: 13, renk: R.metin });
      s += S.yazi(26, 286, 'Dış çekirdek', { boy: 14, renk: R.metin, kalin: true });
      s += S.yazi(26, 302, 'sıvı demir', { boy: 13, renk: R.metin });
      s += S.yazi(52, 318, '≈2260 km kalın', { boy: 13, renk: R.metin });
      /* iç çekirdek: sağ sütun, kılavuz çizgiyle */
      const sx = 262;
      s += S.yol(`M${cx + ri - 10},${cy - 12} L${sx - 8},${cy - 52} L${sx - 4},${cy - 52}`, { renk: R.metin, kalin: 1 });
      [['İç çekirdek (katı)', true], ['yarıçap 1221 km', false], ['merkezde ≈13 g/cm³', false], ['330–360 GPa', false], ['sınırda 6000 ± 500 °C', false]].forEach(([t, b], i) => {
        s += S.yazi(sx, cy - 100 + i * 16, t, { boy: 13, renk: R.metin, kalin: b });
      });
      /* hacim payları */
      s += S.yazi(sx, 178, 'hacim payı', { boy: 13, renk: R.soluk });
      s += S.yazi(sx, 194, 'iç çekirdek %0,7', { boy: 13, renk: R.metin });
      s += S.yazi(sx, 210, 'tüm çekirdek %16', { boy: 13, renk: R.metin });
      s += S.yazi(sx, 226, 'manto + kabuk %84', { boy: 13, renk: R.metin });
      /* büyütme kutusu: en üstteki 300 km */
      const bx = 236, by = 8, bw = 160, d0 = 46, kk = 0.36, D = km => d0 + km * kk;
      s += S.kutu(bx, by, bw, D(300) + 6 - by, { dolgu: R.yuzey, renk: R.soluk, kalin: 1 }, 4);
      s += S.cizgi(bx, D(0), cx + 2, cy - Rd, { renk: R.soluk, kalin: 1, kesik: '3 3' });
      s += S.yazi(bx + bw / 2, by + 15, 'üstteki 300 km, büyütülmüş', { boy: 13, hiza: 'middle', renk: R.soluk });
      const ox = bx + 38, kx = bx + 100, cw = 54;
      s += S.kutu(ox, D(0), cw, D(300) - D(0), { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.55 });
      s += S.kutu(kx, D(0), cw, D(300) - D(0), { dolgu: R.vurguSoluk, renk: 'none', saydam: 0.55 });
      s += S.kutu(ox, D(0), cw, 7 * kk + 1, { dolgu: R.metin, renk: 'none' });
      s += S.kutu(kx, D(0), cw, 35 * kk, { dolgu: R.metin, renk: 'none' });
      s += S.kutu(ox, D(100), kx + cw - ox, D(250) - D(100), { dolgu: R.gezegen, renk: R.metin, kalin: 0.8, kesik: '3 3', saydam: 0.35 });
      s += S.yazi(ox + cw / 2, D(0) - 4, 'okyanus', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(kx + cw / 2, D(0) - 4, 'kıta', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(ox + cw / 2, D(28), '5–10 km', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(kx + cw / 2, D(28) + 8, '≈35 km', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.zeminliYazi((ox + kx + cw) / 2, D(160), 'astenosfer', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.zeminliYazi((ox + kx + cw) / 2, D(160) + 17, '100–250 km', { boy: 13, hiza: 'middle', renk: R.metin });
      [[0, '0'], [100, '100'], [200, '200'], [300, '300']].forEach(([km, t]) => s += S.yazi(ox - 5, D(km) + 4, t, { boy: 13, hiza: 'end', renk: R.soluk }));
      return s;
    }
  });

  /* d44 · bölüm 9: havanın katmanları, logaritmik yükseklik; basınç P = 1014 × e^(−h/8,5) mbar ile. */
  C.ekle('d44-atmosfer', {
    ders: 'd44', bolum: 9, oran: 0.94,
    baslik: 'Havanın katmanları: yükseklik ekseni logaritmik',
    aciklama: 'Yükseklik ekseni logaritmiktir: alt kenar 1 kilometre, her çentik on kat; böylece ince troposfer de görünür. Troposfer yaklaşık 10 kilometreye kadar uzanır, hava olaylarının ve su buharının yüzde 99\'unun yeridir, yükseldikçe soğur. Stratosferde, 50 kilometreye kadar, ozon morötesini soğurur ve hava yükseldikçe ısınır. 85 kilometreye kadarki mezosferin tepesi yaklaşık eksi 90 derece ile atmosferin en soğuk yeridir; meteorların çoğu burada yanar. Termosfer 500 ile 1000 kilometreye uzanır; uzayın başlangıcı sayılan 100 kilometrelik Kármán çizgisi ve yaklaşık 420 kilometredeki uzay istasyonu onun içindedir. Sağdaki basınç değerleri dersteki kaba modelden hesaplandı: 10 kilometrede yaklaşık 313 milibar, yani yerdekinin üçte biri; havanın yarısı 5,9 kilometrenin altındadır.',
    kaynak: [KAYNAK.ucar, KAYNAK.nasaDunya],
    ciz(S) {
      const R = S.R, Y = h => 362 - Math.log10(h) / 3 * 330, x0 = 60, x1 = 262, P = h => 1014 * Math.exp(-h / 8.5);
      let s = '';
      const bant = [[1, 10, 0.32], [10, 50, 0.2], [50, 85, 0.11], [85, 500, 0.05]];
      bant.forEach(([a, b, o]) => s += S.kutu(x0, Y(b), x1 - x0, Y(a) - Y(b), { dolgu: R.mavi, renk: 'none', saydam: o }));
      s += S.kutu(x0, Y(1000), x1 - x0, Y(500) - Y(1000), { dolgu: R.mavi, renk: 'none', saydam: 0.025 });
      [10, 50, 85].forEach(h => s += S.cizgi(x0, Y(h), x1, Y(h), { renk: R.metin, kalin: 1.2 }));
      [500, 1000].forEach(h => s += S.cizgi(x0, Y(h), x1, Y(h), { renk: R.soluk, kalin: 1, kesik: '4 3' }));
      /* eksen */
      s += S.cizgi(x0, Y(1), x0, Y(1000), { renk: R.soluk, kalin: 1.2 });
      [[1, '1 km'], [10, '10 km'], [100, '100 km'], [1000, '1000 km']].forEach(([h, t]) => s += S.cizgi(x0 - 5, Y(h), x0, Y(h), { renk: R.soluk, kalin: 1 }) + S.yazi(x0 - 7, Y(h) + 4, t, { boy: 13, hiza: 'end', renk: R.soluk }));
      /* katman yazıları */
      const sat = (y, t, b) => S.yazi(x0 + 8, y, t, { boy: b ? 14 : 13, renk: R.metin, kalin: b });
      s += S.yazi(x0 + 8, 18, '↑ ekzosfer: 100.000–190.000 km\'ye dek', { boy: 13, renk: R.soluk });
      s += sat(Y(700) + 4, 'üst sınır 500–1000 km', false);
      s += sat(98, 'Termosfer', true) + sat(114, '500–2000 °C, çok seyrek', false) + sat(130, 'kutup ışıkları', false);
      s += sat((Y(50) + Y(85)) / 2 + 5, 'Mezosfer · tepesi ≈ −90 °C', true);
      s += sat(Y(50) + 22, 'Stratosfer', true) + sat(Y(50) + 39, 'ozon tabakası', false) + sat(Y(50) + 55, 'yükseldikçe ısınır', false);
      s += sat(Y(10) + 26, 'Troposfer', true) + sat(Y(10) + 43, 'hava olayları', false) + sat(Y(10) + 59, 'su buharının %99\'u', false) + sat(Y(10) + 75, 'yükseldikçe soğur', false);
      /* işaretler */
      s += S.cizgi(x0, Y(420), x1 + 4, Y(420), { renk: R.vurgu, kalin: 1.5, kesik: '6 3' });
      s += S.daire(x1 - 20, Y(420), 4, { dolgu: R.vurgu, renk: 'none' });
      s += S.cizgi(x0, Y(100), x1 + 4, Y(100), { renk: R.vurgu, kalin: 1.5, kesik: '2 3' });
      s += S.cizgi(x0, Y(5.9), x1 + 4, Y(5.9), { renk: R.soluk, kalin: 1, kesik: '2 3' });
      /* sağ sütun */
      const rx = x1 + 8, sag = (y, t, r, b) => S.yazi(rx, y, t, { boy: 13, renk: r || R.metin, kalin: b });
      s += sag(Y(420) - 2, 'uzay istasyonu', R.vurgu) + sag(Y(420) + 14, '≈420 km', R.vurgu);
      s += sag(Y(100) - 3, '100 km Kármán', R.vurgu);
      s += sag(Y(85) + 9, '85 km');
      s += sag(Y(50) + 4, '50 km');
      s += sag(Y(10) + 4, '10 km: ≈' + tr(P(10)) + ' mbar') + sag(Y(10) + 20, '(yerdekinin 1/3\'ü)', R.soluk);
      s += sag(Y(5.9) + 14, 'havanın yarısı', R.soluk) + sag(Y(5.9) + 30, '5,9 km\'nin altında', R.soluk);
      s += sag(Y(1) - 4, '1 km: ≈' + tr(Math.round(P(1) / 10) * 10) + ' mbar');
      return s;
    }
  });

  /* ================================================================ d35 ================================================================ */

  /* d35 · bölüm 2: Merkür, Venüs, Dünya aynı ölçekte yarım dilimler; altta eylemsizlik momenti çarpanı. */
  C.ekle('d35-ic-yapilar', {
    ders: 'd35', bolum: 2, oran: 0.84,
    baslik: 'Üç kayalık gezegenin içi aynı ölçekte',
    aciklama: 'Üç yarım dilim aynı ölçekte çizildi. Merkür\'ün 2440 kilometrelik yarıçapının yaklaşık 2000 kilometresi metal çekirdektir: çekirdek hacmin yaklaşık yüzde 55\'i, üstünde yalnızca yaklaşık 400 kilometrelik kaya kalır. Kesikli iç daire 2019\'da bildirilen, yaklaşık 2000 kilometre çaplı katı iç çekirdektir. Venüs\'ün çekirdeği yaklaşık 3000 kilometre yarıçaplıdır ama kaba bir tahmindir; katı mı sıvı mı bilinmiyor, soru işareti bunun için. Dünya\'da 3485 kilometrelik çekirdek hacmin yüzde 16\'sıdır. Alttaki çizgi eylemsizlik momenti çarpanıdır: 0,4 her yeri aynı yoğunlukta bir küredir, değer küçüldükçe ağır malzeme merkezde toplanır. Dünya 0,3307, Venüs 0,337 artı eksi 0,024, Merkür 0,346, Ay 0,393.',
    kaynak: [KAYNAK.nasaMerkur, KAYNAK.merkurKart, KAYNAK.earthskyMerkur, KAYNAK.venusKart, KAYNAK.margot, KAYNAK.nasaDunya, KAYNAK.eylemsizlik],
    ciz(S) {
      const R = S.R, k = 0.0113, by = 122;
      const gez = [
        { x: 46, R: 2439.7, c: 2000, ic: 1000, icKesik: true, ad: 'Merkür', l: ['2440 km', 'çekirdek', '≈2000 km', 'hacmin %55\'i'] },
        { x: 152, R: 6051.8, c: 3000, ic: 0, soru: true, ad: 'Venüs', l: ['6052 km', 'çekirdek', '≈3000 km (kaba)', 'hacmin ≈%12\'si'] },
        { x: 302, R: 6371, c: 3485, ic: 1221, ad: 'Dünya', l: ['6371 km', 'çekirdek', '3485 km', 'hacmin %16\'sı'] }
      ];
      let s = '';
      gez.forEach(g => {
        s += S.yol(dilim(g.x, by, g.R * k, 0, 180), { dolgu: R.vurguSoluk, renk: R.metin, kalin: 1.4, saydam: 1 });
        s += S.yol(dilim(g.x, by, g.c * k, 0, 180), { dolgu: R.gezegen, renk: R.metin, kalin: 1, saydam: 0.75 });
        if (g.ic) s += S.yol(dilim(g.x, by, g.ic * k, 0, 180), { dolgu: R.gezegen, renk: R.metin, kalin: 1.4, kesik: g.icKesik ? '3 2' : null });
        if (g.soru) s += S.yazi(g.x, by - 10, '?', { boy: 16, hiza: 'middle', renk: R.zemin, kalin: true });
        s += S.cizgi(g.x - g.R * k - 4, by, g.x + g.R * k + 4, by, { renk: R.soluk, kalin: 1 });
        s += S.yazi(g.x, by + 20, g.ad, { boy: 15, hiza: 'middle', renk: R.metin, kalin: true });
        g.l.forEach((t, i) => s += S.yazi(g.x, by + 36 + i * 16, t, { boy: 13, hiza: 'middle', renk: i === 3 ? R.vurgu : R.metin }));
      });
      s += S.yazi(4, 16, 'aynı ölçek; açık renk kaya, koyu renk metal çekirdek', { boy: 13, renk: R.soluk });
      /* eylemsizlik momenti çarpanı */
      const ay = 290, X = v => 40 + (v - 0.30) / 0.11 * 340;
      s += S.yazi(4, 232, 'eylemsizlik momenti çarpanı', { boy: 14, renk: R.metin, kalin: true });
      s += S.cizgi(X(0.30), ay, X(0.41), ay, { renk: R.soluk, kalin: 1.2 });
      [0.30, 0.32, 0.34, 0.36, 0.38, 0.40].forEach(v => s += S.cizgi(X(v), ay, X(v), ay + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(v), ay + 19, tr(v, 2), { boy: 13, hiza: 'middle', renk: R.soluk }));
      s += S.cizgi(X(0.4), ay - 44, X(0.4), ay, { renk: R.metin, kalin: 1.2, kesik: '4 3' });
      s += S.yazi(X(0.4) + 4, ay - 46, 'düzgün küre 0,4', { boy: 13, hiza: 'end', renk: R.metin });
      /* Venüs hata çubuğu */
      s += S.cizgi(X(0.313), ay - 8, X(0.361), ay - 8, { renk: R.metin, kalin: 1.4 });
      [0.313, 0.361].forEach(v => s += S.cizgi(X(v), ay - 12, X(v), ay - 4, { renk: R.metin, kalin: 1.4 }));
      s += S.daire(X(0.337), ay - 8, 4.5, { dolgu: R.zemin, renk: R.metin, kalin: 1.6 });
      s += S.daire(X(0.3307), ay, 5, { dolgu: R.metin, renk: 'none' });
      s += S.daire(X(0.346), ay, 5, { dolgu: R.vurgu, renk: 'none' });
      s += S.daire(X(0.393), ay, 5, { dolgu: R.ay, renk: R.metin, kalin: 1 });
      s += S.yazi(X(0.3307) - 6, ay - 22, 'Dünya 0,3307', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(X(0.337), ay - 30, 'Venüs 0,337 ± 0,024', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(X(0.346) + 8, ay - 14, 'Merkür 0,346', { boy: 13, renk: R.vurgu, kalin: true });
      s += S.yazi(X(0.393) - 4, ay + 38, 'Ay 0,393', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(X(0.30), ay + 38, '← ağır malzeme merkezde', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d35 · bölüm 5: 3:2 dönme-dolanma rezonansı. Yörünge ölçekli (e = 0,2056), konumlar Kepler denklemiyle 11 günde bir. */
  C.ekle('d35-uc-iki', {
    ders: 'd35', bolum: 5, oran: 0.86,
    baslik: 'Merkür\'ün 3:2 dansı: bir güneş günü iki yıl sürer',
    aciklama: 'Merkür\'ün basık yörüngesi ölçekli çizildi; gezegen her 11 günde bir gösterildi, günberi sağdadır. Her gezegenin aydınlık yarısı Güneş\'e bakar. Üçgenler yüzeyde sabit bir noktadır: dolu üçgen ilk yılda, boş üçgen 88 gün sonra, ikinci yılda aynı yerde nerede olduğunu gösterir. Merkür kendi ekseninde 58,6 günde döner, Güneş\'i 88 günde dolanır; bir yılda bir buçuk tur döndüğü için ikinci yılda nokta hep karşı yöne bakar. Sıfırıncı gün günberide tam öğle olan nokta, 88. günde aynı yerde gece yarısındadır; öğleye ancak 176. günde, iki yıl ve üç dönüş sonra döner. Merkür\'de bir güneş günü bu yüzden yaklaşık 176 Dünya günüdür.',
    kaynak: [KAYNAK.nasaMerkur, KAYNAK.merkurKart],
    ciz(S) {
      const R = S.R, e = 0.2056, a = 128, b = a * Math.sqrt(1 - e * e), cx = 176, cy = 172, gx = cx + a * e, Py = 87.969, Pd = 58.646, rg = 10;
      let s = '';
      s += S.elips(cx, cy, a, b, { renk: R.soluk, kalin: 1.4 });
      s += S.daire(gx, cy, 12, { dolgu: R.gunes, renk: 'none' });
      s += S.yazi(gx, cy + 30, 'Güneş', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      /* dolanma yönü */
      s += S.ok(cx - 24, cy - b - 0.5, cx - 44, cy - b + 1.5, { renk: R.soluk, kalin: 1.5, boy: 8 });
      const ucgen = (x, y, aci, dolu) => {
        const u = [Math.cos(aci), -Math.sin(aci)], v = [-u[1], u[0]], t = [x + u[0] * (rg + 7), y + u[1] * (rg + 7)];
        const p1 = [x + u[0] * (rg - 1) + v[0] * 4.5, y + u[1] * (rg - 1) + v[1] * 4.5], p2 = [x + u[0] * (rg - 1) - v[0] * 4.5, y + u[1] * (rg - 1) - v[1] * 4.5];
        return `<polygon points="${t[0].toFixed(1)},${t[1].toFixed(1)} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="${dolu ? R.metin : R.zemin}" stroke="${R.metin}" stroke-width="1.3"/>`;
      };
      for (let kk = 0; kk < 8; kk++) {
        const t = kk * Py / 8, M = 2 * Math.PI * kk / 8;
        let E = M; for (let i = 0; i < 30; i++) E = M + e * Math.sin(E);
        const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
        const r = a * (1 - e * Math.cos(E)), x = gx + r * Math.cos(nu), y = cy - r * Math.sin(nu);
        const gunesYonu = Math.atan2(-(cy - y), gx - x);            // matematik açısı, gezegenden Güneş'e
        s += S.daire(x, y, rg, { dolgu: R.yuzey2, renk: R.soluk, kalin: 1 });
        const g1 = gunesYonu + Math.PI / 2, g2 = gunesYonu - Math.PI / 2;
        s += `<path d="M${(x + rg * Math.cos(g1)).toFixed(2)},${(y - rg * Math.sin(g1)).toFixed(2)} A${rg},${rg} 0 0 1 ${(x + rg * Math.cos(g2)).toFixed(2)},${(y - rg * Math.sin(g2)).toFixed(2)} Z" fill="${R.ay}"/>`;
        const th = Math.PI + 2 * Math.PI * t / Pd;
        s += ucgen(x, y, th, true) + ucgen(x, y, th + 2 * Math.PI * Py / Pd, false);
        /* gün etiketi: dışa doğru */
        const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy), lx = x + dx / L * 34, ly = y + dy / L * 30;
        const g = Math.round(t), h = Math.abs(dx / L) < 0.35 ? 'middle' : dx > 0 ? 'start' : 'end';
        s += S.yazi(lx + (h === 'start' ? -8 : h === 'end' ? 8 : 0), ly + 5, g + ' · ' + (g + 88), { boy: 13, hiza: h, renk: R.metin });
      }
      /* açıklama yazıları */
      s += S.yazi(cx - 6, cy - 36, '1 dönüş: 58,6 gün', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(cx - 6, cy - 20, '1 yıl: 88,0 gün', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(cx - 6, cy - 4, '2 yıl = 3 dönüş', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(cx - 6, cy + 54, 'güneş günü ≈176 gün', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(396, cy - 26, 'günberi: 0. gün', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(396, cy - 10, 'öğle, 88. gün', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(396, cy + 6, 'gece yarısı', { boy: 13, hiza: 'end', renk: R.metin });
      /* gösterge */
      const gy = 326;
      s += ucgen(14, gy - 14, Math.PI / 2, true).replace(/fill="[^"]*"/, `fill="${R.metin}"`) + S.yazi(34, gy, 'dolu: 1. yıl (gün 0–77)', { boy: 13, renk: R.metin });
      s += ucgen(206, gy - 14, Math.PI / 2, false) + S.yazi(226, gy, 'boş: 2. yıl (88–165)', { boy: 13, renk: R.metin });
      s += S.yazi(4, gy + 18, 'sayılar: o konuma 1. ve 2. yılda varılan gün', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* d35 · bölüm 11: havasız (kara cisim) sıcaklık ile gerçek sıcaklık; Merkür'ün gece-gündüz aralığı. */
  C.ekle('d35-sera', {
    ders: 'd35', bolum: 11, oran: 0.86,
    baslik: 'Sıcaklığı uzaklık değil hava belirler',
    aciklama: 'Yatay eksen kelvin cinsinden sıcaklıktır, altta santigrat karşılıkları var. Havası olmayan Merkür\'de sıcaklık gece yaklaşık 93 kelvine, yani eksi 180 dereceye iner, gündüz 590 ile 725 kelvine çıkar. Boş daireler havası hiç ısı tutmasaydı gezegenin varacağı kara cisim sıcaklığıdır, dolu daireler gerçek ortalamadır. Venüs parlak bulutlarıyla ışığın yüzde 77\'sini yansıtır ve metrekare başına yaklaşık 598 watt soğurur, Dünya ise 961; yine de Venüs\'ün kara cisim sıcaklığı 226,6 kelvinden 92 barlık karbondioksit havası sayesinde 737 kelvine çıkar, sera etkisi yaklaşık 510 kelvin ekler. Dünya\'da ekleme 254 kelvinden 288 kelvine, yalnızca 34 kelvindir. Kesikli dikey çizgi Venüs\'ün 737 kelvinidir: Güneş\'e daha yakın Merkür\'ün gündüzünden bile sıcaktır.',
    kaynak: [KAYNAK.nasaVenus, KAYNAK.nasaMerkur, KAYNAK.nasaDunya],
    ciz(S) {
      const R = S.R, X = K => 40 + K / 800 * 340, ey = 288;
      let s = '';
      /* Venüs çizgisi */
      s += S.cizgi(X(737), 36, X(737), ey, { renk: R.vurgu, kalin: 1, kesik: '4 3' });
      /* Merkür */
      let y = 74;
      s += S.yazi(8, y - 26, 'Merkür · gelen 9083 W/m² · havası yok', { boy: 13, renk: R.metin, kalin: true });
      s += S.cizgi(X(93), y, X(590), y, { renk: R.soluk, kalin: 1.5, kesik: '3 3' });
      s += S.cizgi(X(590), y, X(725), y, { renk: R.metin, kalin: 9 });
      s += S.daire(X(93), y, 5, { dolgu: R.mavi, renk: R.metin, kalin: 1 });
      s += S.yazi(X(93) - 8, y + 5, 'gece', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(X(657), y + 24, 'gündüz 590–725 K', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(X(93) + 6, y + 24, '93 K', { boy: 13, renk: R.metin });
      /* Venüs ve Dünya */
      const sat = (y, bas, k0, k1, ek) => {
        let t = S.yazi(8, y - 26, bas, { boy: 13, renk: R.metin, kalin: true });
        t += S.ok(X(k0) + 6, y, X(k1) - 7, y, { renk: R.vurgu, kalin: 2.2, boy: 8 });
        t += S.daire(X(k0), y, 5.5, { dolgu: R.zemin, renk: R.metin, kalin: 1.8 }) + S.daire(X(k1), y, 5.5, { dolgu: R.metin, renk: 'none' });
        return t + ek;
      };
      y = 160;
      s += sat(y, 'Venüs · gelen 2601, soğurulan ≈598 W/m²', 226.6, 737,
        S.yazi(X(226.6), y + 22, '226,6 K', { boy: 13, hiza: 'middle', renk: R.metin }) + S.yazi(X(737), y + 22, '737 K', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true }) +
        S.zeminliYazi(X(480), y - 7, 'sera +510 K', { boy: 14, hiza: 'middle', renk: R.vurgu, kalin: true }));
      y = 238;
      s += sat(y, 'Dünya · gelen 1361, soğurulan ≈961 W/m²', 254, 288,
        S.yazi(X(254) - 8, y + 22, '254 K', { boy: 13, hiza: 'end', renk: R.metin }) + S.yazi(X(288) + 8, y + 22, '288 K', { boy: 13, renk: R.metin, kalin: true }) +
        S.yazi(X(288) + 12, y + 5, 'sera +34 K', { boy: 14, renk: R.vurgu, kalin: true }));
      /* eksen */
      s += S.cizgi(X(0), ey, X(800), ey, { renk: R.soluk, kalin: 1.2 });
      [0, 200, 400, 600, 800].forEach((K, i) => s += S.cizgi(X(K), ey, X(K), ey + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(X(K), ey + 19, K + ' K', { boy: 13, hiza: i === 4 ? 'end' : 'middle', renk: R.soluk }));
      [[-200, '−200 °C'], [0, '0 °C'], [200, '200 °C'], [400, '400 °C']].forEach(([c, t]) => s += S.cizgi(X(c + 273.15), ey - 5, X(c + 273.15), ey, { renk: R.soluk, kalin: 1 }) + S.yazi(X(c + 273.15), ey + 37, t, { boy: 13, hiza: 'middle', renk: R.soluk }));
      s += S.yazi(4, 18, 'boş daire: havasız olsaydı · dolu daire: gerçek ortalama', { boy: 13, renk: R.soluk });
      return s;
    }
  });

  /* ================================================================ d36 ================================================================ */

  /* d36 · bölüm 3: Mars çekirdeğinin üç resmi, ölçekli yarım dilimler; altta çekirdeğin hacim payı. */
  C.ekle('d36-cekirdek', {
    ders: 'd36', bolum: 3, oran: 0.8,
    baslik: 'Mars\'ın çekirdeği: üç kez yeniden çizilen resim',
    aciklama: 'Üç yarım dilim aynı ölçekte Mars\'tır, yarıçapı 3389,5 kilometre. Soldaki ilk InSight yorumudur: yaklaşık 1830 kilometrelik, görece hafif bir çekirdek. Ortadaki 2023 sonucudur: metal çekirdek 1650 artı eksi 20 kilometreye küçüldü; taralı kuşak, eskiden çekirdek sayılan ve dibinde erimiş kaya katmanı bulunan bölgedir, iç yapısı ölçeksizdir. Sağdaki Eylül 2025 sonucudur: yaklaşık 600 kilometrelik katı bir iç çekirdek; yalnızca 23 depreme dayanır ve bağımsız doğrulama bekler, kesikli çizgi bunun için. Alttaki çubuklar çekirdeğin hacim payıdır: Mars eski değerle yüzde 15,7, yeni değerle yüzde 11,5; Dünya yüzde 16,4, Merkür yaklaşık yüzde 55.',
    kaynak: [KAYNAK.samuel, KAYNAK.ipgp, KAYNAK.cas, KAYNAK.nasaMars, KAYNAK.kabukMars],
    ciz(S) {
      const R = S.R, Rm = 3389.5, k = 58 / Rm, by = 92;
      const panel = [
        { x: 68, c: 1830, ad: 'ilk InSight', l: ['çekirdek ≈1830 km', 'hafif çekirdek'], durum: 'artık eski' },
        { x: 200, c: 1650, ser: 1830, ad: 'Ekim 2023', l: ['çekirdek 1650 ± 20', 'üstünde erimiş kaya'], durum: 'güçlü kanıt' },
        { x: 332, c: 1650, ic: 600, ad: 'Eylül 2025', l: ['iç çekirdek ≈600 km', '23 depreme dayanır'], durum: 'doğrulama bekliyor' }
      ];
      let s = '';
      panel.forEach(p => {
        s += S.yol(dilim(p.x, by, Rm * k, 0, 180), { dolgu: R.vurguSoluk, renk: R.metin, kalin: 1.6, saydam: 1 });
        if (p.ser) {
          s += S.yol(dilim(p.x, by, p.ser * k, 0, 180), { dolgu: R.uyari, renk: R.metin, kalin: 1, kesik: '3 2', saydam: 0.35 });
          for (let i = -26; i <= 26; i += 6) { const x = p.x + i, yUst = by - Math.sqrt(Math.max(0, Math.pow(p.ser * k, 2) - i * i)); s += S.cizgi(x, yUst, x + 3, yUst + 5, { renk: R.metin, kalin: 0.8 }); }
        }
        s += S.yol(dilim(p.x, by, p.c * k, 0, 180), { dolgu: R.gezegen, renk: R.metin, kalin: 1.2 });
        if (p.ic) s += S.yol(dilim(p.x, by, p.ic * k, 0, 180), { dolgu: R.metin, renk: R.metin, kalin: 1.4, kesik: '3 2', saydam: 0.7 });
        s += S.cizgi(p.x - 62, by, p.x + 62, by, { renk: R.soluk, kalin: 1 });
        s += S.yazi(p.x, by + 20, p.ad, { boy: 14, hiza: 'middle', renk: R.metin, kalin: true });
        p.l.forEach((t, i) => s += S.yazi(p.x, by + 36 + i * 16, t, { boy: 13, hiza: 'middle', renk: R.metin }));
        s += S.yazi(p.x, by + 70, p.durum, { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      });
      s += S.yazi(4, 16, 'Mars, yarıçap 3389,5 km; üçü aynı ölçek', { boy: 13, renk: R.soluk });
      /* hacim payı */
      const X = p => 150 + p / 60 * 236, y0 = 214;
      s += S.yazi(4, y0 - 12, 'çekirdeğin hacim payı', { boy: 14, renk: R.metin, kalin: true });
      [['Mars, eski (1830 km)', 15.7, '%15,7'], ['Mars, 2023 (1650 km)', 11.5, '%11,5'], ['Dünya (3485 km)', 16.4, '%16,4'], ['Merkür (≈2000 km)', 55, '≈%55']].forEach(([ad, p, t], i) => {
        const y = y0 + 8 + i * 22;
        s += S.yazi(X(0) - 6, y + 5, ad, { boy: 13, hiza: 'end', renk: R.metin, kalin: i === 1 });
        s += S.kutu(X(0), y - 6, X(p) - X(0), 12, { dolgu: i < 2 ? R.vurgu : R.soluk, renk: 'none', saydam: i === 0 ? 0.45 : 0.9 }, 2);
        s += S.yazi(X(p) + 5, y + 5, t, { boy: 13, renk: R.metin });
      });
      return s;
    }
  });

  /* d36 · bölüm 5: Olympus Mons ve Valles Marineris kesitleri; üstte gerçek ölçek, altta dikey 10 kat. Biçim yaklaşık. */
  C.ekle('d36-olympus', {
    ders: 'd36', bolum: 5, oran: 0.8,
    baslik: 'Olympus Mons ve Valles Marineris: gerçek ölçekte yassı',
    aciklama: 'Üstteki kesitler gerçek ölçekte, yatay ve dikey aynı oranda çizildi: 624 kilometre genişliğinde ve yaklaşık 25 kilometre yüksekliğindeki Olympus Mons ince bir tümsek gibi kalır; 200 kilometre genişliğinde ve 7 kilometreye kadar derin Valles Marineris de neredeyse bir çizgidir. Alttaki aynı kesitler dikeyde 10 kat abartıldı. Biçim yaklaşıktır: volkanın kenarında 8 kilometreye varan dik bir kayalık, sonra zirveye yaklaşık 3 derecelik yayvan yamaçlar. Kaba bir koni hesabı ortalama eğimi 4,6 derece verir, kaynaklar yaklaşık 5 der. Tepesine yürüyen biri tırmandığını zor fark ederdi.',
    kaynak: [KAYNAK.worldatlas, KAYNAK.olympus, KAYNAK.vallesESA],
    ciz(S) {
      const R = S.R, k = 0.4, x0 = 42, ow = 624 * k, vx = x0 + ow + 24, vw = 200 * k;
      const ciz = (by, d) => {
        const H = km => by - km * k * d;
        let t = '';
        t += S.yol(`M${x0 - 8},${by} L${x0},${by} L${x0},${H(8)} L${x0 + ow / 2},${H(25)} L${x0 + ow},${H(8)} L${x0 + ow},${by} L${vx},${by} L${vx + 8},${H(-7)} L${vx + vw - 8},${H(-7)} L${vx + vw},${by} L${vx + vw + 6},${by}`, { renk: R.metin, kalin: 1.8, dolgu: R.vurguSoluk });
        t += S.cizgi(x0 - 8, by, vx + vw + 6, by, { renk: R.soluk, kalin: 1, kesik: '3 3' });
        return t;
      };
      let s = '';
      /* üst: gerçek ölçek */
      const b1 = 64;
      s += S.yazi(4, 18, 'gerçek ölçek (yatay = dikey)', { boy: 14, renk: R.metin, kalin: true });
      s += ciz(b1, 1);
      s += S.yazi(x0 + ow / 2, b1 - 18, 'Olympus Mons', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(vx + vw / 2, b1 + 22, 'Valles Marineris', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.cizgi(x0, b1 + 14, x0 + 100 * k, b1 + 14, { renk: R.metin, kalin: 2 }) + S.yazi(x0 + 100 * k + 6, b1 + 19, '100 km', { boy: 13, renk: R.soluk });
      /* alt: dikey 10 kat */
      const b2 = 246, d = 10, H = km => b2 - km * k * d;
      s += S.yazi(4, 106, 'aynı kesit, dikeyde 10 kat abartılı', { boy: 14, renk: R.metin, kalin: true });
      s += ciz(b2, d);
      [[0, '0'], [10, '10'], [20, '20 km']].forEach(([km, t]) => s += S.cizgi(x0 - 12, H(km), x0 - 8, H(km), { renk: R.soluk, kalin: 1 }) + S.yazi(x0 - 14, H(km) + 4, t, { boy: 13, hiza: 'end', renk: R.soluk }));
      s += S.yazi(x0 + ow / 2, H(25) - 8, 'zirve ≈25 km', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.zeminliYazi(x0 + 8, H(14), 'kenarda', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(x0 + 8, H(14) + 16, '8 km kayalık', { boy: 13, renk: R.metin });
      s += S.zeminliYazi(x0 + ow * 0.74, H(12), 'yamaç ≈3°', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(x0 + ow / 2, b2 + 20, '624 km genişlik · ortalama eğim ≈5°', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(vx + vw / 2, H(-7) + 20, '7 km', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(vx + vw / 2, b2 - 8, '200 km', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(396, 306, 'Valles Marineris: 4000 km uzun', { boy: 13, hiza: 'end', renk: R.soluk });
      return s;
    }
  });

  /* d36 · bölüm 11: Phobos ve Deimos yörüngeleri ölçekli; eşzamanlı yörünge Kepler III ile hesaplandı. */
  C.ekle('d36-uydular', {
    ders: 'd36', bolum: 11, oran: 1.0,
    baslik: 'Phobos ve Deimos: eşzamanlı yörüngenin iki yanında',
    aciklama: 'Mars ve iki uydusunun yörüngeleri kuzeyden bakılarak aynı ölçekte çizildi; uydular görünsün diye büyütüldü. Phobos Mars\'ın merkezinden 9378 kilometrede, 7 saat 39 dakikada bir dolanır; Deimos 23.459 kilometrede, yaklaşık 30 saatte. Kesikli çember eşzamanlı yörüngedir: orada dolanan bir cisim Mars\'ın 24,6 saatlik dönüşüyle aynı hızda döner, Kepler\'in üçüncü yasasıyla yaklaşık 20.400 kilometre çıkar. Phobos bu çemberin içinde olduğu için Mars\'ın dönüşünden hızlıdır: gökte batıdan doğar ve gelgit onu her yüz yılda 1,8 metre içe çeker; yaklaşık 50 milyon yılda Mars\'a çarpacak ya da halkaya dönüşecek. Dışarıdaki Deimos doğudan doğar ve gökte günlerce kalır.',
    kaynak: [KAYNAK.nasaMars, KAYNAK.marsUydu, KAYNAK.areostasyoner],
    ciz(S) {
      const R = S.R, cx = 200, cy = 200, k = 170 / 23459, rM = 3389.5 * k, rP = 9378 * k, rS = 20428 * k, rD = 23459 * k;
      let s = '';
      s += S.daire(cx, cy, rD, { renk: R.metin, kalin: 1.6 });
      s += S.daire(cx, cy, rS, { renk: R.vurgu, kalin: 1.6, kesik: '7 5' });
      s += S.daire(cx, cy, rP, { renk: R.metin, kalin: 1.6 });
      s += S.daire(cx, cy, rM, { dolgu: R.gezegen, renk: 'none' });
      s += S.yazi(cx, cy + 5, 'Mars', { boy: 13, hiza: 'middle', renk: R.zemin, kalin: true });
      /* Mars'ın dönüşü */
      s += S.yay(cx, cy, rM + 7, 200, 320, { renk: R.soluk, kalin: 1.4 });
      const a = 320 * rad; s += S.ok(cx + (rM + 7) * Math.cos(a - 0.15), cy - (rM + 7) * Math.sin(a - 0.15), cx + (rM + 7) * Math.cos(a), cy - (rM + 7) * Math.sin(a), { renk: R.soluk, kalin: 1.4, boy: 6 });
      /* Phobos ve içe kayma */
      const pa = 35 * rad, px = cx + rP * Math.cos(pa), py = cy - rP * Math.sin(pa);
      s += S.daire(px, py, 5, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
      s += S.ok(px - 8 * Math.cos(pa), py + 8 * Math.sin(pa), cx + (rP - 26) * Math.cos(pa), cy - (rP - 26) * Math.sin(pa), { renk: R.uyari, kalin: 2, boy: 7 });
      s += S.zeminliYazi(px + 10, py - 6, 'Phobos', { boy: 13, renk: R.metin, kalin: true });
      /* Deimos */
      const da = 145 * rad, dxp = cx + rD * Math.cos(da), dyp = cy - rD * Math.sin(da);
      s += S.daire(dxp, dyp, 4.5, { dolgu: R.metin, renk: R.zemin, kalin: 1.5 });
      s += S.zeminliYazi(dxp + 10, dyp + 18, 'Deimos', { boy: 13, renk: R.metin, kalin: true });
      /* dolanma yönü okları (saat yönünün tersi) */
      [[rP, 120], [rD, 60]].forEach(([r, aci]) => { const b = aci * rad, c = (aci + 9) * rad; s += S.ok(cx + r * Math.cos(b), cy - r * Math.sin(b), cx + r * Math.cos(c), cy - r * Math.sin(c), { renk: R.metin, kalin: 1.6, boy: 7 }); });
      /* halka içi yazılar */
      s += S.yazi(cx, 90, 'Phobos: 9378 km', { boy: 13, hiza: 'middle', renk: R.metin, kalin: true });
      s += S.yazi(cx, 106, '7 sa 39 dk\'da bir tur', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(cx, 122, 'dönüşten hızlı: batıdan doğar', { boy: 13, hiza: 'middle', renk: R.metin });
      s += S.yazi(cx, 296, 'eşzamanlı yörünge (kesikli)', { boy: 13, hiza: 'middle', renk: R.vurgu, kalin: true });
      s += S.yazi(cx, 312, '≈20.400 km · 24,6 sa', { boy: 13, hiza: 'middle', renk: R.vurgu });
      /* köşeler */
      s += S.yazi(4, 18, 'Deimos: 23.459 km', { boy: 13, renk: R.metin, kalin: true });
      s += S.yazi(4, 34, '≈30 sa\'te bir tur', { boy: 13, renk: R.metin });
      s += S.yazi(4, 50, 'doğudan doğar', { boy: 13, renk: R.metin });
      s += S.yazi(396, 362, 'Phobos içe kayar:', { boy: 13, hiza: 'end', renk: R.uyari, kalin: true });
      s += S.yazi(396, 378, '100 yılda 1,8 m;', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(396, 394, '≈50 milyon yılda son', { boy: 13, hiza: 'end', renk: R.metin });
      s += S.yazi(4, 378, 'yörüngeler ölçekli,', { boy: 13, renk: R.soluk });
      s += S.yazi(4, 394, 'uydular büyütüldü', { boy: 13, renk: R.soluk });
      return s;
    }
  });
})();
