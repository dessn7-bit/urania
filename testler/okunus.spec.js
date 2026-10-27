'use strict';
/* okunus.js: sembol ve birimlerin Türkçe okunuşu (ders metinlerinden örnekler) */
const { test, expect } = require('@playwright/test');
const { okunus } = require('../okunus.js');
const D = require('../veri/dersler.json').dersler;

test('Ders cümleleri doğru okunuşa çevrilir', () => {
  [['c = 299.792.458 m/s.', 'c eşittir 299.792.458 metre bölü saniye.'],
   ['λ_tepe = 2,898 × 10⁻³ m·K / T.', 'lambda tepe eşittir 2,898 çarpı 10 üzeri eksi 3 metre kelvin bölü T.'],
   ['L = 4πR²σT⁴.', 'L eşittir 4 pi R kare sigma T üzeri 4.'],
   ["dik açıklığı +90°'dir.", 'dik açıklığı artı 90 derecedir.'],
   ['İstanbul ≈ 41° → Kutup Yıldızı', 'İstanbul yaklaşık 41 derece, yani Kutup Yıldızı'],
   ['H0 = 67,4 ± 0,5 km/s/Mpc.', 'H0 eşittir 67,4 artı eksi 0,5 kilometre bölü saniye bölü megaparsek.'],
   ['L ∝ M^3,5 (2–55 M☉)', 'L orantılıdır M üzeri 3,5 (2 ile 55 Güneş kütlesi)'],
   ['Sirius −1,46, Venüs yaklaşık −4,2', 'Sirius eksi 1,46, Venüs yaklaşık eksi 4,2'],
   ["nüfusun %80'inden fazlası", "nüfusun yüzde 80'inden fazlası"],
   ["1,5 AB'nin içine; a = 5,20 AB", "1,5 AB'nin içine; a eşittir 5,20 astronomik birim"],
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

test('Tüm ders metinlerinde okunuşa çevrilmemiş sembol kalmaz', () => {
  const t = D.map(x => [x.baslik, ...x.bolumler.flatMap(b => [b.baslik, ...b.paragraflar]), ...x.defter_notu].map(okunus).join(' ')).join(' ');
  const kalan = [...t].filter(ch => !/[\p{L}\p{N}\s.,;:!?()'"’‘“”…%\-–—]/u.test(ch));
  expect(kalan).toEqual([]);
  expect(t).not.toMatch(/%/);
});
