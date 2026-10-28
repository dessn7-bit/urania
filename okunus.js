/* okunus.js — Ekrandaki metni sesli okumaya hazırlar: sembolleri, birimleri ve formül
   işaretlerini Türkçe okunuşlarına çevirir. Yalnız konuşmaya gider; ekrandaki metin değişmez.
   Neden: derslerde = (86), ° (45), × (40), ≈ (40), ~ (32), üs (21), km/s (16), M☉ (7) var;
   metin okuma motoru bunları atlıyor ya da harf harf okuyor.
   Ek kuralı: kısaltma açılınca kesmeli ek açılmış kelimeye uydurulur. Yazar eki kısaltmanın
   harf okunuşuna göre yazmış olabilir ("5772 K'ye" = ke-ye); ek önce biçimbirimlerine çözülür
   (yönelme, bulunma, ayrılma, ilgi, belirtme, -lIk, -DIr …) sonra açılmış kelimenin son ünlüsüne
   ve ünsüzüne göre yeniden kurulur ("kelvine", "km/s'dir" → "kilometre bölü saniyedir",
   "M☉'ten" → "Güneş kütlesinden"). Çözülemeyen ek görülürse kısaltma olduğu gibi bırakılır.
   DOM'a dokunmaz; tarayıcıda window.Okunus, Node'da module.exports. */
(function (kok) {
  'use strict';
  const H = 'A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû';   // harf
  const UST = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  const ALT = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  const YUNAN = { α: 'alfa', β: 'beta', γ: 'gama', δ: 'delta', ε: 'epsilon', ζ: 'zeta', η: 'eta', θ: 'teta', λ: 'lambda', μ: 'mü', ν: 'nü', π: 'pi', ρ: 'ro', σ: 'sigma', τ: 'tau', φ: 'fi', χ: 'ki', ψ: 'psi', ω: 'omega', Δ: 'delta', Λ: 'lambda', Ω: 'omega', Σ: 'sigma' };
  const YON = { K: 'kuzey', G: 'güney', D: 'doğu', B: 'batı' };
  const SAYI = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'];
  /* Birim parçaları. Sayıdan sonra tek başına, ya da eğik çizgiyle zincir halinde (km/s/Mpc, g/cm³)
     açılır. "g" tek başına gün (tablolarda "88 g"), zincirde gram (g/cm³). Kelime birimler (saat,
     gün, yıl …) okunuşta değişmez; zincirde "bölü" okunsun diye listede. */
  const BIRIM = {
    'm·K': 'metre kelvin', km: 'kilometre', cm: 'santimetre', mm: 'milimetre', nm: 'nanometre', 'μm': 'mikrometre', m: 'metre',
    kg: 'kilogram', g: 'gram', ton: 'ton', mil: 'mil',
    Mpc: 'megaparsek', kpc: 'kiloparsek', pc: 'parsek', AB: 'astronomik birim', AU: 'astronomik birim',
    K: 'kelvin', W: 'vat', J: 'jul', Hz: 'hertz', MHz: 'megahertz', THz: 'terahertz', MeV: 'mega elektronvolt',
    s: 'saniye', sn: 'saniye', sa: 'saat', dk: 'dakika',
    saniye: 'saniye', mikrosaniye: 'mikrosaniye', dakika: 'dakika', saat: 'saat', gün: 'gün', yıl: 'yıl'
  };
  const kacisRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const ATOM = '(?:' + Object.keys(BIRIM).sort((a, b) => b.length - a.length).map(kacisRe).join('|') + ')';
  const US = '(?:[²³]|⁻[¹²³⁴])';                                  // birim üssü
  const UE = ATOM + US + '?(?:\\/' + ATOM + US + '?)*';            // birim ifadesi: km/s, g/cm³
  const UD = UE + '(?:\\s' + ATOM + US + ')*';                     // boşluklu dizi: m³ kg⁻¹ s⁻²
  const EK = "(?:['’]([a-zçğıöşü]+))?";                         // kesmeli ek
  const SON = "(?![" + H + "\\d'’²³/])";                           // ifade burada biter

  /* ---------- ek uyumu ---------- */
  const EKLER = [
    ['SIN', /^s[ıiuü]n$/], ['KOP', /^[dt][ıiuü]r/], ['AYR', /^n?[dt][ae]n/], ['BUL', /^n?[dt][ae]/],
    ['GEC', /^y?[dt][ıiuü]/], ['KI', /^ki/], ['LIK', /^l[ıiuü]k/], ['COK', /^l[ae]r/], ['ILE', /^y?l[ae]/],
    ['LI', /^l[ıiuü]/], ['ILG', /^n?[ıiuü]n/], ['IYE', /^s[ıiuü]/], ['KOS', /^y?s[ae]$/],
    ['BEL', /^[yn]?[ıiuü]/], ['YON', /^[yn]?[ae]/]
  ];
  function ekCoz(ek) {
    const sira = [];
    let k = String(ek || '').toLocaleLowerCase('tr');
    while (k) {
      const e = EKLER.find(([, re]) => re.test(k));
      if (!e) return null;
      sira.push(e[0]);
      k = k.slice(k.match(e[1])[0].length);
    }
    return sira;
  }
  function sonUnlu(w) {
    if (/saat$/.test(w)) return 'e';   // saate, saatte, saati (ince)
    const m = w.match(/[aeıioöuü](?=[^aeıioöuü]*$)/);
    return m ? m[0] : 'e';
  }
  const A = w => (/[eiöü]/.test(sonUnlu(w)) ? 'e' : 'a');
  const I = w => ({ a: 'ı', ı: 'ı', o: 'u', u: 'u', e: 'i', i: 'i', ö: 'ü', ü: 'ü' })[sonUnlu(w)];
  const unluSon = w => /[aeıioöuü]$/.test(w);
  const D = w => (/[fstkçşhp]$/.test(w) ? 't' : 'd');
  /* çok heceli, ünlü + k ile biten kelime ünlüyle başlayan ekten önce yumuşar (megaparseğe) */
  const yumusat = w => (/[aeıioöuü]k$/.test(w) && (w.split(' ').pop().match(/[aeıioöuü]/g) || []).length > 1 ? w.slice(0, -1) + 'ğ' : w);
  /* kelime + yazarın eki → uyumlu biçim; iyelik: "Güneş kütlesi" gibi tamlama (n kaynaştırması) */
  function ekle(kelime, ek, iyelik) {
    const sira = ekCoz(ek);
    if (!sira || !sira.length) return null;
    let w = kelime, iy = !!iyelik;
    sira.forEach(b => {
      const u = unluSon(w);
      if (b === 'KOP') w += D(w) + I(w) + 'r';
      else if (b === 'AYR' || b === 'BUL') { if (iy) w += 'n'; w += D(w) + A(w) + (b === 'AYR' ? 'n' : ''); }
      else if (b === 'GEC') w += (u ? 'y' : '') + D(u ? w + 'y' : w) + I(w);
      else if (b === 'KI') w += 'ki';
      else if (b === 'LIK') { if (iy) w = w.replace(/s?[ıiuü]$/, ''); w += 'l' + I(w) + 'k'; }
      else if (b === 'COK') w += 'l' + A(w) + 'r';
      else if (b === 'ILE') w += (u ? 'y' : '') + 'l' + A(w);
      else if (b === 'LI') w += 'l' + I(w);
      else if (b === 'ILG') w = u ? w + 'n' + I(w) + 'n' : yumusat(w) + I(w) + 'n';
      else if (b === 'IYE') w = u ? w + 's' + I(w) : yumusat(w) + I(w);
      else if (b === 'KOS') w += (u ? 'y' : '') + 's' + A(w);
      else if (b === 'SIN') w += 's' + I(w) + 'n';
      else if (b === 'BEL') w = iy ? w + 'n' + I(w) : (u ? w + 'y' + I(w) : yumusat(w) + I(w));
      else if (b === 'YON') w = iy ? w + 'n' + A(w) : (u ? w + 'y' + A(w) : yumusat(w) + A(w));
      iy = b === 'IYE' || b === 'KI';
    });
    return w;
  }
  /* ek yoksa kelime; ek çözülemezse null */
  const ekli = (kelime, ek, iyelik) => (ek ? ekle(kelime, ek, iyelik) : kelime);

  /* "km/s" → "kilometre bölü saniye", "kg⁻¹" → "kilogram üzeri eksi 1";
     tek: sayıdan sonra tek parça ("88 g" = gün) */
  const ATOM_US = new RegExp('(' + ATOM + ')(' + US + ')?', 'g');
  function birimOku(ifade, tek) {
    return ifade.replace(ATOM_US, (m, a, us) => (tek && a === 'g' ? 'gün' : BIRIM[a]) +
      (!us ? '' : us === '²' ? ' kare' : us === '³' ? ' küp' : ' üzeri eksi ' + UST[us[1]])).replace(/\//g, ' bölü ');
  }

  function okunus(metin) {
    let t = ' ' + String(metin || '') + ' ';
    /* Özel adlar: "Sgr A*", "M87*" → yıldız */
    t = t.replace(new RegExp('([A-Za-z]\\d*)\\*' + EK, 'g'), (m, a, ek) => { const o = ekli('yıldız', ek); return o ? a + ' ' + o : m; });
    t = t.replace(/\s&\s/g, ' ve ');
    /* Tarih kısaltmaları (d20 Astronominin tarihi): "MÖ 240" → "milattan önce 240"; MS yalnız sayıdan önce (ms ≠ MS) */
    t = t.replace(/(^|[\s(–-])MÖ(?=\s|\.|,|\))/g, '$1milattan önce').replace(/(^|[\s(–-])MS(?=\s\d)/g, '$1milattan sonra');
    /* Binlik ayraç (veride ondalık ayraç virgül): "14.500" → "14500"; nokta cümle sonu sanılmasın */
    t = t.replace(/(\d)\.(?=\d{3}(?!\d))/g, '$1');
    /* Alt simge: H₂ → H 2 */
    t = t.replace(/[₀-₉]+/g, s => ' ' + [...s].map(c => ALT[c]).join('') + ' ');
    /* Tarih ve katalog adındaki tire (2026-12-15, K2-18 b, ISO 12312-2, P.L. 119-74) "eksi" okunmasın:
       bir yanda en az 3 basamak ya da rakamlardan önce harf varsa boşluk olur; "3-5" gibisi kalır */
    t = t.replace(/([A-Za-z]?)(\d+)((?:-\d+)+)/g, (m, h, a, k) => (h || a.length >= 3 || /\d{3}/.test(k) ? h + a + k.replace(/-/g, ' ') : m));
    /* Basit kesir: 1/4 → dörtte bir; ekli kesirde ek "bir"e geçer: 1/9'una → dokuzda birine */
    const PAYDA = SAYI.concat(['on bir', 'on iki']);
    t = t.replace(/(^|[\s(≈~])([1-9])\/([2-9]|1[0-2])(?:['’]([a-zçğıöşü]+))?(?![\d²³'’/]|[,.]\d)/g, (m, o, p, q, ek) => {
      if (+p >= +q) return m;
      const pay = ek ? ekle(SAYI[p], ek, true) : SAYI[p];
      return pay ? o + ekle(PAYDA[q], 'de') + ' ' + pay : m;
    });
    /* İzotop: üst simgeli kütle numarası + element (¹H → hidrojen 1, ⁴He → helyum 4); pozitron, nötrino */
    const ELEMENT = { H: 'hidrojen', He: 'helyum', Li: 'lityum', Be: 'berilyum', B: 'bor', C: 'karbon', N: 'azot', O: 'oksijen', Ne: 'neon', Mg: 'magnezyum', Si: 'silisyum', Fe: 'demir', Ni: 'nikel', U: 'uranyum' };
    t = t.replace(/(^|[\s(;,])([⁰¹²³⁴⁵⁶⁷⁸⁹]+)([A-Z][a-z]?)(?![A-Za-z])/g, (m, o, u, e) => (ELEMENT[e] ? o + ELEMENT[e] + ' ' + [...u].map(c => UST[c]).join('') : m));
    t = t.replace(/(^|[\s(;,])e⁺(?![A-Za-z])/g, '$1pozitron').replace(/(^|[\s(;,])e⁻(?![A-Za-z])/g, '$1elektron');
    /* "(+BAO)": ek veriyle birlikte */
    t = t.replace(/\(\+([A-ZÇĞİÖŞÜ][A-Za-zÇĞİÖŞÜçğıöşü]+)\)/g, '($1 ile)');
    /* Tablolarda "y": sayıdan sonra iki noktayla yaş ("20 y: 7,3 mm"), aksi hâlde yıl ("11,86 y") */
    t = t.replace(/(\d) y(?=\s?:)/g, '$1 yaş').replace(/(\d) y(?=\s*(?:[·,;)]|$))/g, '$1 yıl');
    /* Güneş ve Dünya birimleri (tamlama: "M☉'in" → Güneş kütlesinin, "M☉'lik" → Güneş kütlelik) */
    const gd = { 'M☉': 'Güneş kütlesi', 'L☉': 'Güneş ışınımı', 'R☉': 'Güneş yarıçapı', 'M⊕': 'Dünya kütlesi', 'R⊕': 'Dünya yarıçapı' };
    t = t.replace(new RegExp('([MLR][☉⊕])' + EK, 'g'), (m, s, ek) => {
      if (!gd[s]) return m;
      const o = ekli(gd[s], ek, true);
      return o ? ' ' + o : ' ' + gd[s] + "'" + ek;
    });
    /* Derece + yön harfi: "41° K" → 41 derece kuzey */
    t = t.replace(new RegExp('°\\s?([KGDB])' + EK + '(?![' + H + '\\d])', 'g'), (m, y, ek) => { const o = ekli(YON[y], ek); return o ? ' derece ' + o : m; });
    /* Santigrat: "°C'nin" → santigrat derecenin */
    t = t.replace(new RegExp('\\s?°\\s?C' + EK + '(?![' + H + '])', 'g'), (m, ek) => { const o = ekli('derece', ek); return o ? ' santigrat ' + o : m; });
    /* Karşılaştırma: ">1 km" → 1 kilometreden büyük */
    t = t.replace(new RegExp('([<>])\\s?(\\d[\\d,]*)\\s?(' + UE + '|ışık yılı)' + SON, 'g'), (m, k, n, b) => {
      const o = b === 'ışık yılı' ? ekle(b, 'den', true) : ekle(birimOku(b, !b.includes('/')), 'den');
      return n + ' ' + o + (k === '>' ? ' büyük' : ' küçük');
    });
    /* Sayı + birim (üslü sayı ve "milyon km" da: "10²⁶ W"); ek açılmış birime uydurulur ("5772 K'ye" → kelvine) */
    const sayiBirim = () => {
      t = t.replace(new RegExp('(\\d[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]*\\s?|(?<![' + H + '])(?:bin|milyon|milyar|trilyon)\\s)(' + UD + ')' + EK + SON, 'g'), (m, n, b, ek, yer, tum) => {
        /* Tek başına "g": tablolarda gün ("88 g ·"), metinde gram ("245 g helyum") */
        let tek = !/[/\s]/.test(b);
        if (tek && b === 'g' && !ek) { const sonra = tum.slice(yer + m.length).replace(/^\s+/, ''); if (sonra && !/^[·,;()]/.test(sonra)) tek = false; }
        const o = ekli(birimOku(b, tek), ek);
        return o ? n.trim() + ' ' + o : m;
      });
    };
    sayiBirim();
    /* Eğik çizgili birim zinciri sayısız da açılır (km/s, W/m²) */
    t = t.replace(new RegExp('(^|[^' + H + '\\d])(' + ATOM + US + '?(?:\\/' + ATOM + US + '?)+)' + EK + SON, 'g'), (m, o, b, ek) => {
      const s = ekli(birimOku(b), ek);
      return s ? o + s : m;
    });
    /* Sayı ya da kelime / birim: "parçacık/cm³", "kez/saniye", "~1000/s" → bölü */
    t = t.replace(new RegExp('([' + H + '\\d])\\/(' + UE + ')' + EK + SON, 'g'), (m, a, b, ek) => {
      const s = ekli(birimOku(b), ek);
      return s ? a + ' bölü ' + s : m;
    });
    /* Çok harfli birim sayısız da açılır ("km'ye çevir"; AB yalnız ekliyse: "AB'ye çevir");
       tek harfliler (K, m, s) sayısız açılmaz */
    t = t.replace(new RegExp('(^|[^' + H + '\\d/])(km|cm|mm|nm|μm|kg|Mpc|kpc|MHz|THz|MeV|AB(?=[\'’]))([²³])?' + EK + SON, 'g'), (m, o, b, us, ek) => {
      const s = ekli(birimOku(b + (us || '')), ek);
      return s ? o + s : m;
    });
    /* Yunan harfi + ek: "ζ'dan" → zetadan */
    t = t.replace(/([α-ωΑ-Ω])['’]([a-zçğıöşü]+)/g, (m, h, ek) => { const o = YUNAN[h] && ekle(YUNAN[h], ek); return o ? ' ' + o : m; });
    /* Derece, yay dakikası/saniyesi: ek açılmış kelimeye uyar ("90°'dir" → 90 derecedir) */
    t = t.replace(/\s?°\s?C(?![A-Za-zÇĞİÖŞÜçğıöşü])/g, ' santigrat derece').replace(/°(?=\d)/g, ' derece ').replace(/′(?=\d)/g, ' yay dakikası ');
    const yay = { '°': ['derece', false], '′': ['yay dakikası', true], '″': ['yay saniyesi', true] };
    t = t.replace(/([°′″])(?:['’]([a-zçğıöşü]+))?/g, (m, s, ek) => { const [k, iy] = yay[s]; const o = ekli(k, ek, iy); return ' ' + (o || k + (ek || '')); });
    /* Üsler: harften sonra ² ³ → kare / küp (ek uyar: "c²'ye" → c kareye); sayıdan ya da harften sonra diğerleri → "üzeri" */
    t = t.replace(/([A-Za-zÇĞİÖŞÜçğıöşüα-ωΑ-Ω)])([²³])(?:['’]([a-zçğıöşü]+))?/g, (m, a, u, ek) => { const k = u === '²' ? 'kare' : 'küp'; return a + ' ' + (ekli(k, ek) || k + (ek ? "'" + ek : '')) + ' '; });
    /* Sayıdan sonra tek ² / ³: "3²" → 3 kare (10²⁶ gibi çok basamaklı üs "üzeri" kalır) */
    /* 10'un kuvveti bilimsel gösterimde "10 üzeri 3" okunur */
    t = t.replace(/(\d+(?:,\d+)?)([²³])(?![⁻⁰¹²³⁴⁵⁶⁷⁸⁹])(?:['’]([a-zçğıöşü]+))?/g, (m, a, u, ek) => { if (a === '10') return m; const k = u === '²' ? 'kare' : 'küp'; return a + ' ' + (ekli(k, ek) || k + (ek ? "'" + ek : '')) + ' '; });
    t = t.replace(/([0-9A-Za-z)])([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (m, a, u) => {
      const s = u.split('').map(c => UST[c]).join('');
      return a + ' üzeri ' + (s[0] === '-' ? 'eksi ' + s.slice(1) : s);
    });
    t = t.replace(/\^\s?(-?[\d,]+)/g, (m, s) => ' üzeri ' + (s[0] === '-' ? 'eksi ' + s.slice(1) : s)).replace(/\^\s?\(/g, ' üzeri (');
    sayiBirim();
    /* Yunan harfleri ve alt çizgi */
    t = t.replace(/[α-ωΑ-Ω]/g, h => YUNAN[h] ? ' ' + YUNAN[h] + ' ' : h);
    t = t.replace(/\s?_(?=[A-Za-zÇĞİÖŞÜçğıöşü0-9])/g, ' ');
    /* İşaretler */
    t = t.replace(/√\s?/g, ' karekök ');
    t = t.replace(/\s?≈\s?/g, ' yaklaşık ');
    t = t.replace(/~\s?/g, 'yaklaşık ');
    t = t.replace(/\s?←\s?/g, ', kaynağı ').replace(/\s?↔\s?/g, ' ile ');
    t = t.replace(/\s?×\s?/g, ' çarpı ');
    t = t.replace(/\s?±\s?/g, ' artı eksi ');
    t = t.replace(/\s?∝\s?/g, ' orantılıdır ');
    t = t.replace(/\s?≤\s?/g, ' küçük ya da eşittir ');
    t = t.replace(/\s?≥\s?/g, ' büyük ya da eşittir ');
    t = t.replace(/\s?→\s?/g, ', yani ');
    t = t.replace(/\s=\s|=/g, ' eşittir ');
    /* Kuyruklu yıldız adı "109P/Swift-Tuttle": eğik çizgi okunmaz */
    t = t.replace(/(\d+[PC])\/(?=[A-ZÇĞİÖŞÜ])/g, '$1 ');
    t = t.replace(/\s÷\s|\s\/\s/g, ' bölü ');
    /* Bitişik eğik çizgi (birimler yukarıda açıldı): iki küçük harfli kelime arasında "ya da"
       (banliyö/kent, az/hiç); iki büyük harfle başlayan ad arasında kısa durak (NASA/NOAA,
       Webb/MIRI); tek harf, sayı ve formülde "bölü" (M/L, v/c, 2GM/r) */
    t = t.replace(/(\S)\s?\/\s?(?=\S)/g, (m, a, i, s) => {
      const sol = (s.slice(0, i + 1).match(/[A-Za-zÇĞİÖŞÜçğıöşü\d]+$/) || [''])[0];
      const sag = (s.slice(i + m.length).match(/^[A-Za-zÇĞİÖŞÜçğıöşü\d]+/) || [''])[0];
      if (/^[a-zçğıöşü]{2,}$/.test(sol) && /^[a-zçğıöşü]{2,}$/.test(sag)) return a + ' ya da ';
      if (/^[A-ZÇĞİÖŞÜ][A-Za-zÇĞİÖŞÜçğıöşü\d]+$/.test(sol) && /^[A-ZÇĞİÖŞÜ][A-Za-zÇĞİÖŞÜçğıöşü\d]+$/.test(sag)) return a + ', ';
      return a + ' bölü ';
    });
    t = t.replace(/ · /g, ', ').replace(/·/g, ' ');
    t = t.replace(/\s>\s/g, ' büyüktür ').replace(/\s<\s/g, ' küçüktür ');
    t = t.replace(/>\s?(\d[\d.,]*)/g, '$1 üstü');
    t = t.replace(/<\s?(\d[\d.,]*)/g, '$1 altı');
    /* Sayı aralığı "2–55" → "2 ile 55" */
    t = t.replace(/(\d)\s?–\s?(\d)/g, '$1 ile $2');
    /* Birimli ya da kelimeli aralık: "300 nm–2 μm", "200 milyon – 1 milyar" */
    t = t.replace(/(\d\s?[A-Za-zμçğıöşü]+)\s?–\s?(?=\d)/g, '$1 ile ');
    /* İşaretli sayılar: −1,46 ve +6,5 (kelime başında) */
    t = t.replace(/(^|[\s(])[−-](?=\d)/g, '$1eksi ');
    t = t.replace(/(^|[\s(])\+(?=\d)/g, '$1artı ');
    t = t.replace(/\s[+−]\s/g, m => m.includes('+') ? ' artı ' : ' eksi ');
    t = t.replace(/(\S)\+(?=[\s,.;])/g, '$1 üstü');
    t = t.replace(/(\d)\+(?=\d)/g, '$1 artı ');
    /* Yüzde */
    t = t.replace(/%\s?(?=\d)/g, 'yüzde ');
    return t.replace(/\s+/g, ' ').replace(/\s([,.;:!?)])/g, '$1').replace(/\(\s/g, '(').trim();
  }

  const Okunus = { okunus, ekle };
  if (typeof module !== 'undefined' && module.exports) module.exports = Okunus;
  else kok.Okunus = Okunus;
})(typeof self !== 'undefined' ? self : this);
