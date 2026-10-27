'use strict';
/* okunus.js: sembol ve birimlerin Türkçe okunuşu (ders metinlerinden örnekler) */
const { test, expect } = require('@playwright/test');
const { okunus } = require('../okunus.js');
const D = require('../veri/dersler.json').dersler;

test('Ders cümleleri doğru okunuşa çevrilir', () => {
  [['c = 299.792.458 m/s.', 'c eşittir 299792458 metre bölü saniye.'],
   ['λ_tepe = 2,898 × 10⁻³ m·K / T.', 'lambda tepe eşittir 2,898 çarpı 10 üzeri eksi 3 metre kelvin bölü T.'],
   ['L = 4πR²σT⁴.', 'L eşittir 4 pi R kare sigma T üzeri 4.'],
   ["dik açıklığı +90°'dir.", 'dik açıklığı artı 90 derecedir.'],
   ['İstanbul ≈ 41° → Kutup Yıldızı', 'İstanbul yaklaşık 41 derece, yani Kutup Yıldızı'],
   ['H0 = 67,4 ± 0,5 km/s/Mpc.', 'H0 eşittir 67,4 artı eksi 0,5 kilometre bölü saniye bölü megaparsek.'],
   ['L ∝ M^3,5 (2–55 M☉)', 'L orantılıdır M üzeri 3,5 (2 ile 55 Güneş kütlesi)'],
   ['Sirius −1,46, Venüs yaklaşık −4,2', 'Sirius eksi 1,46, Venüs yaklaşık eksi 4,2'],
   ["nüfusun %80'inden fazlası", "nüfusun yüzde 80'inden fazlası"],
   ["1,5 AB'nin içine; a = 5,20 AB", "1,5 astronomik birimin içine; a eşittir 5,20 astronomik birim"],
   ['23 sa 56 dk 4 sn; 29,53 g (', '23 saat 56 dakika 4 saniye; 29,53 gün ('],
   ['kütle ≈ 1,988 × 10³⁰ kg', 'kütle yaklaşık 1,988 çarpı 10 üzeri 30 kilogram'],
   ['v_k = √(2GM/r)', 'v k eşittir karekök (2GM bölü r)'],
   ['banliyö/kent geçişi', 'banliyö ya da kent geçişi'],
   ['Sgr A* ve z* ≈ 1090', 'Sgr A yıldız ve z yıldız yaklaşık 1090'],
   ['AB: 0,39 · 0,72 · 1', 'AB: 0,39, 0,72, 1'],
   ['φ + δ > 90°', 'fi artı delta büyüktür 90 derece'],
   ['Perseid ← 109P/Swift-Tuttle', 'Perseid, kaynağı 109P Swift-Tuttle'],
   ['kütlenin ~yarısı', 'kütlenin yaklaşık yarısı'],
   ['basınç < kütleçekimi', 'basınç küçüktür kütleçekimi'],
   ['PSR B1257+12', 'PSR B1257 artı 12'],
   ['dönem ↔ parlaklık', 'dönem ile parlaklık']
  ].forEach(([g, c]) => expect(okunus(g), g).toBe(c));
});

/* Hata avı (Ekim 2026) regresyonları: kaynak → okunuş. A2 eğik çizgili birim, A3 binlik ayraç,
   A9 Güneş/Dünya birimi, Yunan harfi ve ek, B2 ekli kısaltma, B3 kesir ve rakamlar arası tire. */
const TABLO = [
  /* A2: birimli eğik çizgi "ya da" değil "bölü"; ek açılmış birime uyar */
  ["kurtulma hızı 11,186 km/s'dir", 'kurtulma hızı 11,186 kilometre bölü saniyedir'],
  ["30,29 km/s'den 29,29 km/s'ye iner", '30,29 kilometre bölü saniyeden 29,29 kilometre bölü saniyeye iner'],
  ["çarpma hızı 6,1 km/s'ydi.", 'çarpma hızı 6,1 kilometre bölü saniyeydi.'],
  ["Dünya'nın 11,19 km/s'siyle kıyasla", "Dünya'nın 11,19 kilometre bölü saniyesiyle kıyasla"],
  ['su için 1 g/cm³\'tür.', 'su için 1 gram bölü santimetre küptür.'],
  ["yoğunluğu 3344 kg/m³'tür", 'yoğunluğu 3344 kilogram bölü metre küptür'],
  ["Birimi km/s/Mpc'dir:", 'Birimi kilometre bölü saniye bölü megaparsektir:'],
  ["ivmesi 3,70 m/s²'dir.", 'ivmesi 3,70 metre bölü saniye karedir.'],
  ['4,26 × 10⁹ kg/s, 3,8 cm/yıl, 11,4 km/gün', '4,26 çarpı 10 üzeri 9 kilogram bölü saniye, 3,8 santimetre bölü yıl, 11,4 kilometre bölü gün'],
  ['1.000.000 mil/sa ≈ 1.609.000 km/sa', '1000000 mil bölü saat yaklaşık 1609000 kilometre bölü saat'],
  ['4,26 milyon ton/s; 400.000 km/saat', '4,26 milyon ton bölü saniye; 400000 kilometre bölü saat'],
  ['GM ≈ 1,327 × 10²⁰ m³/s²; v² = 62,57 km²/s²', 'GM yaklaşık 1,327 çarpı 10 üzeri 20 metre küp bölü saniye kare; v kare eşittir 62,57 kilometre kare bölü saniye kare'],
  ['1361 W/m²; 10⁵ parçacık/cm³', '1361 vat bölü metre kare; 10 üzeri 5 parçacık bölü santimetre küp'],
  ['365 gün/yıl; 1000 kez/saniye; 30 atım/s; 2 yıldız/yıl; ~1000/s', '365 gün bölü yıl; 1000 kez bölü saniye; 30 atım bölü saniye; 2 yıldız bölü yıl; yaklaşık 1000 bölü saniye'],
  ['38,6 mikrosaniye/gün', '38,6 mikrosaniye bölü gün'],
  ['Δλ/λ ≈ v/c; Δm/Δt', 'delta lambda bölü lambda yaklaşık v bölü c; delta m bölü delta t'],
  ['dürbün/teleskopta, az/hiç', 'dürbün ya da teleskopta, az ya da hiç'],
  ["NASA/NOAA'nın, Webb/MIRI", "NASA, NOAA'nın, Webb, MIRI"],
  ['6,674 × 10⁻¹¹ m³ kg⁻¹ s⁻²', '6,674 çarpı 10 üzeri eksi 11 metre küp kilogram üzeri eksi 1 saniye üzeri eksi 2'],
  /* A3: binlik ayraç */
  ['Yaklaşık 14.500 yılında, 400.000 kat', 'Yaklaşık 14500 yılında, 400000 kat'],
  ['13,787 milyar; 27.10.2026', '13,787 milyar; 27.10.2026'],
  /* A9: Güneş/Dünya birimi, Yunan harfi, derece + yön, yıldız işareti, alt simge, karşılaştırma, °C */
  ["1 M☉'lik bir yıldızdan", '1 Güneş kütlelik bir yıldızdan'],
  ["8 M☉'in altındaki; 1,4 M☉'i aşınca; 8 M☉'ten ağır", '8 Güneş kütlesinin altındaki; 1,4 Güneş kütlesini aşınca; 8 Güneş kütlesinden ağır'],
  ["1 R☉'nin; 2 M⊕", '1 Güneş yarıçapının; 2 Dünya kütlesi'],
  ["yaklaşık 2 μm'ye kadar; 2 μm'de", 'yaklaşık 2 mikrometreye kadar; 2 mikrometrede'],
  ["ζ'dan η'ya; θ'nın; φ + δ'dır", 'zetadan etaya; tetanın; fi artı deltadır'],
  ["İstanbul'da (41° K); 33° G; 12° D'de", "İstanbul'da (41 derece kuzey); 33 derece güney; 12 derece doğuda"],
  ["M87* ön ayarı; Sgr A*'ın ufku", 'M87 yıldız ön ayarı; Sgr A yıldızın ufku'],
  ['H₂ ve CO₂; M₁ + M₂', 'H 2 ve CO 2; M 1 artı M 2'],
  ['3,828 × 10²⁶ W; 10²⁶ W\'tır', '3,828 çarpı 10 üzeri 26 vat; 10 üzeri 26 vattır'],
  ['>1 km: 1,1 milyon; disk >100.000 ışık yılı', '1 kilometreden büyük: 1,1 milyon; disk 100000 ışık yılından büyük'],
  ["80 °C'nin üstünde; 121 °C'de", '80 santigrat derecenin üstünde; 121 santigrat derecede'],
  ["en çok 7°54′'ye ulaşır", 'en çok 7 derece 54 yay dakikasına ulaşır'],
  ['4π² ve E = mc²\'den', '4 pi kare ve E eşittir mc kareden'],
  /* B2: ekli kısaltma açılır; ek harf okunuşuna göre yazılmış olsa da (K'ye = ke-ye) */
  ["656,28 nm'lik; 5772 K'dir; 5772 K'ye; 900 K'de", '656,28 nanometrelik; 5772 kelvindir; 5772 kelvine; 900 kelvinde'],
  ["90 dk'da; 70 kg'sın; 11 sa 55 dk'dan", '90 dakikada; 70 kilogramsın; 11 saat 55 dakikadan'],
  ["30 AB'dedir; 1 AB'yi; 1000 AB'ye; 30 AB'lik", '30 astronomik birimdedir; 1 astronomik birimi; 1000 astronomik birime; 30 astronomik birimlik'],
  ["50 mm'likle; 50 mm'sinin; 3474 km'dir; 1 Mpc'yi km'ye çevir", '50 milimetrelikle; 50 milimetresinin; 3474 kilometredir; 1 megaparseği kilometreye çevir'],
  ["1.420 MHz'ti; 26,73 MeV'dir; 7 milyon K'den", '1420 megahertzdi; 26,73 mega elektronvolttur; 7 milyon kelvinden'],
  ["88 g · 224,7 g; 5 s. Sonra", '88 gün, 224,7 gün; 5 saniye. Sonra'],
  /* B3: kesir ve rakamlar arası tire */
  ['kuvvet 1/4. Çekim ≈ 1/6; 1/81', 'kuvvet dörtte bir. Çekim yaklaşık altıda bir; 1 bölü 81'],
  ['tarih (2026-12-15); K2-18 b; ISO 12312-2; P.L. 119-74', 'tarih (2026 12 15); K2 18 b; ISO 12312 2; P.L. 119 74'],
  ['JADES-GS-z14-0; 3-5 dakika', 'JADES-GS-z14 0; 3-5 dakika'],
  ['−1,46 ile +6,5; 7×50 dürbün', 'eksi 1,46 ile artı 6,5; 7 çarpı 50 dürbün'],
  /* değişmeyenler: harf adı, kısaltma sayısız, AB tek başına */
  ["A'dan K'ye harflerle; AB ülkeleri", "A'dan K'ye harflerle; AB ülkeleri"]
];
test('Hata avı regresyonları (tablo)', () => {
  TABLO.forEach(([g, c]) => expect(okunus(g), g).toBe(c));
});

test('Tüm sesli metinlerde birimli eğik çizgi "ya da" okunmaz, ekli kısaltma açılmadan kalmaz', () => {
  const metinler = D.flatMap(x => [x.baslik, x.ozet || '', ...x.bolumler.flatMap(b => [b.baslik, ...b.paragraflar, b.ornek ? b.ornek.baslik + '. ' + b.ornek.metin : '', b.akilda || '']), ...x.defter_notu]);
  const kalanEk = [], yaDa = [];
  metinler.forEach(m => {
    const o = okunus(m);
    const k = o.match(/(?<![A-Za-zÇĞİÖŞÜçğıöşü])(km|cm|mm|nm|μm|kg|AB|dk|sa|sn|Mpc|kpc|pc|W|MHz|MeV|s|m|g|°C?)['’][a-zçğıöşü]+/);
    if (k && /\d\s?\S*$/.test(o.slice(0, o.indexOf(k[0])))) kalanEk.push(k[0]);
    (m.match(/\S+\/\S+/g) || []).forEach(e => { if (/ ya da /.test(okunus(e)) && !/^[a-zçğıöşü]{2,}\/[a-zçğıöşü]{2,}[.,;:)]*$/.test(e)) yaDa.push(e); });
  });
  expect(kalanEk).toEqual([]);
  expect(yaDa).toEqual([]);
});

test('Tüm ders metinlerinde okunuşa çevrilmemiş sembol kalmaz', () => {
  const t = D.map(x => [x.baslik, ...x.bolumler.flatMap(b => [b.baslik, ...b.paragraflar]), ...x.defter_notu].map(okunus).join(' ')).join(' ');
  const kalan = [...t].filter(ch => !/[\p{L}\p{N}\s.,;:!?()'"’‘“”…%\-–—]/u.test(ch));
  expect(kalan).toEqual([]);
  expect(t).not.toMatch(/%/);
});
