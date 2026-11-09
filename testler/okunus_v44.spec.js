'use strict';
/* v44 sesli okuma: noktalı saat (TDK), Roma rakamları (sıra ve sayı; tek harfli I, V, X yanlış çevrilmez),
   "→" bağlama göre (füzyon "hidrojenden helyuma"). Derslerdeki bütün oklar testler/veri/ok_okunuslari.json'da tek tek. */
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { okunus } = require('../okunus.js');

test('Saat: "21.30" konuşmada saat olarak (iki nokta), tarih ve binlik dokunulmaz', () => {
  [['Saat 21.30\'da başlar.', "Saat 21:30'da başlar."],
   ['İstanbul\'un öğlesi neden 13.04?', "İstanbul'un öğlesi neden 13:04?"],
   ['Gerçek öğle 12.47.14, Güneş', 'Gerçek öğle 12:47:14, Güneş'],
   ['13.04,2 − 16,55 dk', '13:04,2 eksi 16,55 dakika'],
   ['12.500 km', '12500 kilometre'],
   ['19.01.2006', '19.01.2006'],
   ['RG 8.9.2016 sayı', 'RG 8.9.2016 sayı'],
   /* İngilizce ondalık saat sanılmaz (kaynak adları) */
   ['z = 14.44 olan galaksi', 'z eşittir 14.44 olan galaksi'],
   ['0.45 electronvolts', '0.45 electronvolts'],
   ['1.50 m', '1.50 metre']
  ].forEach(([g, c]) => expect(okunus(g), g).toBe(c));
});

test('Roma rakamı: sıra bildiren sıra sayısıyla, sayı bildiren sayıyla okunur', () => {
  [['XIV. yüzyılda', 'on dördüncü yüzyılda'],
   ['II. Dünya Savaşı sırasında', 'İkinci Dünya Savaşı sırasında'],
   ['İstanbul\'da III. Murad, Takiyüddin için', "İstanbul'da Üçüncü Murad, Takiyüddin için"],
   ['Kral XV. Louis ona', 'Kral On Beşinci Louis ona'],
   ['Papa XIII. Gregorius', 'Papa On Üçüncü Gregorius'],
   ['III. yasa (1619)', 'üçüncü yasa (1619)'],
   ['I. Düzey: ufkun ötesi', 'Birinci Düzey: ufkun ötesi'],
   ['Popülasyon II yıldızları', 'Popülasyon iki yıldızları'],
   ['Popülasyon II. Popülasyon III ise', 'Popülasyon iki. Popülasyon üç ise'],
   ['Pop III yıldızları', 'popülasyon üç yıldızları'],
   ['Popülasyon I ve metalce', 'Popülasyon bir ve metalce'],
   ["Artemis II'nin kalkışı", 'Artemis ikinin kalkışı'],
   ["Kepler III'e göre", "Kepler'in üçüncü yasasına göre"],
   ['Kepler II: eşit zamanda', "Kepler'in ikinci yasası: eşit zamanda"],
   ['Güneş Sistemi I: Dünya', 'Güneş Sistemi bir: Dünya'],
   ['Büyük Ayı I ve II, ayrı', 'Büyük Ayı bir ve iki, ayrı'],
   ['Atlas V roketiyle', 'Atlas beş roketiyle'],
   ['H II bölgesi', 'H iki bölgesi'],
   ['FR I ve FR II radyo galaksileri', 'FR bir ve FR iki radyo galaksileri'],
   ['Güneş: G2 V, kütle', 'Güneş: G2 beş, kütle'],
   ['Arcturus (K1,5 III)', 'Arcturus (K1,5 üç)'],
   ['Planck 2018 sonuçları VI (H₀ = 67,4)', 'Planck 2018 sonuçları altı (H 0 eşittir 67,4)'],
   ['Galaksimizin kalbi: Sgr A*', 'Galaksimizin kalbi: Sagittarius A yıldız']
  ].forEach(([g, c]) => expect(okunus(g), g).toBe(c));
});

test('Tek harfli I, V, X yanlış çevrilmez: X ışını, Tip Ia, B eksi V, formül harfi, ad baş harfi, katalog adı', () => {
  [['X ışınları ve gama', 'X ışınları ve gama'],
   ['X sınıfı patlama', 'X sınıfı patlama'],
   ['Tip Ia süpernovası', 'Tip Ia süpernovası'],
   ["Tip I'de yoktur; Tip II denir", 'Tip birde yoktur; Tip iki denir'],
   ['B eksi V değeri', 'B eksi V değeri'],
   ['V biçimli Hyades', 'V biçimli Hyades'],
   ['I = Q ÷ t', 'I eşittir Q bölü t'],
   ['V. Dhillon (Sheffield)', 'V. Dhillon (Sheffield)'],
   ['H. I. Ewen 1951', 'H. I. Ewen 1951'],
   ["Cyg X-1'in eşi", "Cyg X-1'in eşi"],
   ['Pegasus XL roketi', 'Pegasus XL roketi'],
   ['cüce galaksi I Zwicky 18', 'cüce galaksi I Zwicky 18']
  ].forEach(([g, c]) => expect(okunus(g), g).toBe(c));
});

test('"→" bağlama göre: füzyon, tepkime, koşul, zincir, özel ad, ölçü, tarih, yüzde, hesap', () => {
  [['Füzyon: H → He.', 'Füzyon: hidrojenden helyuma.'],
   ['Enerji: 4 ¹H → ⁴He, kütlenin %0,7\'si', "Enerji: 4 hidrojen 1'den helyum 4'e, kütlenin yüzde 0,7'si"],
   ['Ara adımlar: p + p → ²H + e⁺ + ν;', 'Ara adımlar: p artı p birleşerek hidrojen 2 artı pozitron artı nü oluşturur;'],
   ['e⁻ + e⁺ → 2 foton, her biri 511 keV.', 'elektron artı pozitron birleşerek 2 foton oluşturur, her biri 511 kilo elektronvolt.'],
   ['U-238 → Pb-206 (4,47 milyar yıl)', "uranyum 238'den kurşun 206'ya (4,47 milyar yıl)"],
   ["~100 milyon K'de helyum → karbon.", 'yaklaşık 100 milyon kelvinde helyumdan karbona.'],
   ['φ + δ > 90° → hiç batmaz;', 'fi artı delta büyüktür 90 derece ise hiç batmaz;'],
   ['Isınan metal: kızıl → turuncu → beyaz akkor.', 'Isınan metal: kızıl, ardından turuncu, ardından beyaz akkor.'],
   ['Dünya → Mars ≈ 259 gün;', "Dünya'dan Mars'a yaklaşık 259 gün;"],
   ['Tayf (düşük → yüksek frekans): radyo', 'Tayf (düşükten yükseğe frekans): radyo'],
   ['255 K → 288 K (33 K);', '255 kelvinden 288 kelvine (33 kelvin);'],
   ['Dimorphos 11 sa 55 dk → 11 sa 23 dk.', 'Dimorphos 11 saat 55 dakikadan 11 saat 23 dakikaya.'],
   ['Temmuz 2026 → Haziran 2030', "Temmuz 2026'dan Haziran 2030'a"],
   ['Kaplama: %4 → %1,5', "Kaplama: yüzde 4'ten yüzde 1,5'e"],
   ['(9 kare → 3 kat, 100 kare → 10 kat)', '(9 kare, yani 3 kat, 100 kare, yani 10 kat)'],
   ['P² = a³ → a³ = 27² = 729 → a = 9 AB.', 'P kare eşittir a küp, yani a küp eşittir 27 kare eşittir 729, yani a eşittir 9 astronomik birim.'],
   ['Dönme eğrisi düz → karanlık madde;', 'Dönme eğrisi düz, bu yüzden karanlık madde;'],
   /* v44 doğrulayıcı bulguları: v43'te doğru okunan cümleler bozulmaz; tek sözcük çiftleri geçiş sayılmaz */
   ['D = 50, d_göz = 7 → ≈ 51 kat. 51 kat → ≈ 4,3 kadir.', 'D eşittir 50, d göz eşittir 7, yani yaklaşık 51 kat. 51 kat, yani yaklaşık 4,3 kadir.'],
   ['Sağ yan aydınlık → büyüyor.', 'Sağ yan aydınlık, bu yüzden büyüyor.'],
   ['Gelgit → spagettileşme.', 'Gelgit, bu yüzden spagettileşme.'],
   ['Faraday 1831: değişen manyetik alan → akım (indüksiyon).', 'Faraday 1831: değişen manyetik alan, bu yüzden akım (indüksiyon).'],
   ['Bortle 1 (kusursuz, sınır 7,6–8,0) → Bortle 9 (kent merkezi, ≤ 4,0).', "Bortle 1'den (kusursuz, sınır 7,6 ile 8,0) Bortle 9'a (kent merkezi, küçük ya da eşittir 4,0)."],
   ['Sonbahar: Kare, Alpheratz → M31 (1,4 yumruk).', "Sonbahar: Kare, Alpheratz'dan M31'e (1,4 yumruk)."],
   ['Hız: Merkür 47,4 → Neptün 5,4 km/s.', "Hız: Merkür 47,4'ten Neptün 5,4'e kilometre bölü saniye."],
   ['Üçüncü yasa: T → 0 K iken entropi sabite gider', 'Üçüncü yasa: T sıfır kelvine giderken entropi sabite gider'],
   ['Çok erken çağda (a → 0):', 'Çok erken çağda (a sıfıra giderken):'],
   ['n = 2: 1 s + 3 p = 4 orbital → 8 elektron', 'n eşittir 2: 1 saniye artı 3 p eşittir 4 orbital, yani 8 elektron'],
   ['Hiyerarşi: grup (onlarca galaksi) → küme (yüzlerce–binlerce) → üstküme → kozmik ağ (düğüm = küme, lif, boşluk).', 'Hiyerarşi: grup (onlarca galaksi), ardından küme (yüzlerce–binlerce), ardından üstküme, ardından kozmik ağ (düğüm eşittir küme, lif, boşluk).'],
   ['Grand Tack (Jüpiter 3,5 → 1,5 → 5,2 AB)', 'Grand Tack (Jüpiter 3,5, ardından 1,5, ardından 5,2 astronomik birim)'],
   ['Algol: 2,87 günde bir 2,1 → 3,4 kadir, ~10 saat;', "Algol: 2,87 günde bir 2,1'den 3,4 kadire, yaklaşık 10 saat;"],
   ['BepiColombo: 20.10.2018 → yörünge 21.11.2026', 'BepiColombo: 20.10.2018, ardından yörünge 21.11.2026'],
   ['6,4° ve 1.000 m → 111,8 m ≈ 112 m.', '6,4 derece ve 1000 metre, yani 111,8 metre yaklaşık 112 metre.'],
   ['Gerçek 50″/yıl → yaklaşık 25.920 yıl;', 'Gerçek 50 yay saniyesi bölü yıl, yani yaklaşık 25920 yıl;']
  ].forEach(([g, c]) => expect(okunus(g), g).toBe(c));
});

test('Derslerdeki ve sınavlardaki bütün "→" okunuşları gözden geçirilmiş listeyle birebir; hiçbiri ok olarak kalmaz, füzyon "yani" okunmaz', () => {
  const kok = path.join(__dirname, '..');
  const liste = JSON.parse(fs.readFileSync(path.join(__dirname, 'veri', 'ok_okunuslari.json'), 'utf8'));
  const yer = new Set(liste.cumleler.map(c => c.metin));
  /* liste güncel: derslerdeki her oklu cümle listede */
  let say = 0;
  ['veri/dersler.json', 'veri/sinavlar.json'].forEach(f => {
    (function gez(x) { if (typeof x === 'string') { if (x.includes('→')) say += (x.match(/→/g) || []).length; } else if (x && typeof x === 'object') Object.values(x).forEach(gez); })(JSON.parse(fs.readFileSync(path.join(kok, f), 'utf8')));
  });
  expect(say).toBeGreaterThan(300);
  expect(liste.ok_sayisi).toBe(say);
  for (const c of liste.cumleler) {
    const o = okunus(c.metin);
    expect(o, c.metin).toBe(c.okunus);
    expect(o, c.metin).not.toContain('→');
    if (/\b(?:H|He)\s?→\s?(?:He|C)\b|¹H\s?→/.test(c.metin)) expect(o, c.metin).not.toMatch(/hidrojen[^,.;]*, yani/);
  }
  expect(yer.size).toBe(liste.cumleler.length);
});
