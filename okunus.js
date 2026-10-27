/* okunus.js — Ekrandaki metni sesli okumaya hazırlar: sembolleri, birimleri ve formül
   işaretlerini Türkçe okunuşlarına çevirir. Yalnız konuşmaya gider; ekrandaki metin değişmez.
   Neden: derslerde = (86), ° (45), × (40), ≈ (40), ~ (32), üs (21), km/s (16), M☉ (7) var;
   metin okuma motoru bunları atlıyor ya da harf harf okuyor.
   Ek kuralı: yazar kesme işaretli eki sembolün okunuşuna göre yazmıştır ("90°'dir" = doksan
   derecedir); okunuşu açılan sembolde kesme kaldırılıp ek bitiştirilir. Harf kısaltmalarında
   (AB'nin = a-be'nin) ek açılmış kelimeye uymaz; o yüzden ekli kısaltmalar olduğu gibi bırakılır.
   DOM'a dokunmaz; tarayıcıda window.Okunus, Node'da module.exports. */
(function (kok) {
  'use strict';
  const H = 'A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû';   // harf
  const UST = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  const YUNAN = { α: 'alfa', β: 'beta', γ: 'gama', δ: 'delta', ε: 'epsilon', ζ: 'zeta', η: 'eta', θ: 'teta', λ: 'lambda', μ: 'mü', ν: 'nü', π: 'pi', ρ: 'ro', σ: 'sigma', τ: 'tau', φ: 'fi', χ: 'ki', ψ: 'psi', ω: 'omega', Δ: 'delta', Λ: 'lambda', Ω: 'omega', Σ: 'sigma' };
  /* Sayıdan sonra gelen birimler (ardından harf ya da kesme gelmiyorsa) */
  const BIRIM = [
    ['km/s/Mpc', 'kilometre bölü saniye bölü megaparsek'], ['km³/s²', 'kilometre küp bölü saniye kare'],
    ['km/s', 'kilometre bölü saniye'], ['m/s²', 'metre bölü saniye kare'], ['m/s', 'metre bölü saniye'], ['km/sa', 'kilometre bölü saat'],
    ['m·K', 'metre kelvin'], ['Mpc', 'megaparsek'], ['kpc', 'kiloparsek'], ['pc', 'parsek'],
    ['km', 'kilometre'], ['cm', 'santimetre'], ['mm', 'milimetre'], ['nm', 'nanometre'], ['μm', 'mikrometre'], ['kg', 'kilogram'],
    ['AB', 'astronomik birim'], ['AU', 'astronomik birim'], ['K', 'kelvin'], ['sa', 'saat'], ['dk', 'dakika'], ['sn', 'saniye'], ['g', 'gün']
  ];
  const kacisRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function okunus(metin) {
    let t = ' ' + String(metin || '') + ' ';
    /* Özel adlar */
    t = t.replace(/([A-Za-z])\*/g, '$1 yıldız').replace(/\s&\s/g, ' ve ');
    /* Güneş ve Dünya birimleri */
    t = t.replace(/([MLR])☉/g, (m, h) => ({ M: ' Güneş kütlesi', L: ' Güneş ışınımı', R: ' Güneş yarıçapı' })[h]);
    t = t.replace(/([MR])⊕/g, (m, h) => ({ M: ' Dünya kütlesi', R: ' Dünya yarıçapı' })[h]);
    /* Sayı + birim (birimden sonra harf ya da kesme yoksa); üsler açıldıktan sonra bir kez daha */
    const birimler = () => BIRIM.forEach(([b, o]) => {
      t = t.replace(new RegExp('(\\d)\\s?' + kacisRe(b) + "(?![" + H + "'’²³/])", 'g'), '$1 ' + o);
    });
    birimler();
    /* Bölü işaretli birimler sayısız da açılır (anlamları tek) */
    BIRIM.filter(([b]) => b.includes('/')).forEach(([b, o]) => {
      t = t.replace(new RegExp("(^|[^" + H + "])" + kacisRe(b) + "(?![" + H + "'’²³/])", 'g'), '$1' + o);
    });
    /* Derece, yay dakikası/saniyesi: ek varsa bitiştir ("90°'dir" → "90 derecedir") */
    t = t.replace(/°['’]?/g, ' derece').replace(/′['’]?/g, ' yay dakikası').replace(/″['’]?/g, ' yay saniyesi');
    /* Üsler: harften sonra ² ³ → kare / küp; sayıdan ya da harften sonra diğerleri → "üzeri" */
    t = t.replace(/([A-Za-zÇĞİÖŞÜçğıöşü)])²/g, '$1 kare').replace(/([A-Za-zÇĞİÖŞÜçğıöşü)])³/g, '$1 küp');
    t = t.replace(/([0-9A-Za-z)])([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (m, a, u) => {
      const s = u.split('').map(c => UST[c]).join('');
      return a + ' üzeri ' + (s[0] === '-' ? 'eksi ' + s.slice(1) : s);
    });
    t = t.replace(/\^\s?(-?[\d,]+)/g, (m, s) => ' üzeri ' + (s[0] === '-' ? 'eksi ' + s.slice(1) : s));
    birimler();
    /* Yunan harfleri ve alt simge */
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
    /* Bitişik eğik çizgi: iki küçük harfli kelime arasında "ya da" (banliyö/kent), yoksa "bölü" (M/L, 2GM/r) */
    t = t.replace(/(\S)\s?\/\s?(?=\S)/g, (m, a, i, s) => /[a-zçğıöşü]/.test(a) && /[a-zçğıöşü]/.test(s[i + m.length]) ? a + ' ya da ' : a + ' bölü ');
    t = t.replace(/ · /g, ', ').replace(/·/g, ' ');
    t = t.replace(/\s>\s/g, ' büyüktür ').replace(/\s<\s/g, ' küçüktür ');
    t = t.replace(/>\s?(\d[\d.,]*)/g, '$1 üstü');
    t = t.replace(/<\s?(\d[\d.,]*)/g, '$1 altı');
    /* Sayı aralığı "2–55" → "2 ile 55" */
    t = t.replace(/(\d)\s?–\s?(\d)/g, '$1 ile $2');
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

  const Okunus = { okunus };
  if (typeof module !== 'undefined' && module.exports) module.exports = Okunus;
  else kok.Okunus = Okunus;
})(typeof self !== 'undefined' ? self : this);
