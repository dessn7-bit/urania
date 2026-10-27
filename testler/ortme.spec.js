'use strict';
/* Ay örtmeleri ve Algol: bağımsız kaynaklarla karşılaştırma (Node, tarayıcısız).
   - IOTA-ES (Avrupa örtme listesi): 2026-12-21 Frankfurt (50,1 K 8,65 D), ZC541 = 20 Tau (Maia):
     kayboluş 23:10:28 UT, beliriş 23:21:34 UT — https://www.iota-es.de/moon.html
   - Skyfield 1.55 + JPL DE421 + Hipparcos (görünen konumlar, k = 0,2725076), Fetih Mah. 41,0046 K 29,0762 D 0 m.
   - Algol: Sky & Telescope hesaplayıcısı (Rochester Astronomy Club alıntısı) 2026-07-24 01:41 UT ve
     2026-08-13 03:21 UT; VarAstro gözlem #107713, 2025-02-25 en sönük 19:12 ya da 19:46 UT (iki çözüm).
   Ayrıntı: arastirma/algol_ortme_kaynaklar.md */
const { test, expect } = require('@playwright/test');
const Ortme = require('../ortme.js');
const Gok = require('../gok.js');
const YILDIZ = require('../veri/ortme_yildiz.json').y;
const ALGOL = require('../veri/algol.json');
const sn = (a, b) => Math.abs(new Date(a) - new Date(b)) / 1000;

test('IOTA-ES Frankfurt: Maia (20 Tau) örtmesi ±40 sn', () => {
  const ls = Ortme.ortmeler(YILDIZ, Gok.gozlemci(50.1, 8.65, 0), new Date('2026-12-21T12:00:00Z'), 1);
  const o = ls.find(x => x.hedef.hip === 17573);
  expect(o).toBeTruthy();
  expect(sn(o.giris, '2026-12-21T23:10:28Z')).toBeLessThanOrEqual(40);
  expect(sn(o.cikis, '2026-12-21T23:21:34Z')).toBeLessThanOrEqual(40);
});

test('Skyfield/DE421 ile İstanbul örtmeleri ±20 sn', () => {
  const gzl = Gok.gozlemci(41.0046, 29.0762, 0);
  const ref = [
    [17531, '2026-12-21T23:21:31Z', '2026-12-21T23:46:12Z'],
    [49637, '2027-02-20T20:02:13Z', '2027-02-20T21:05:44Z'],
    [92855, '2027-05-23T23:20:09Z', '2027-05-24T00:51:35Z'],
    [32246, '2027-09-24T03:08:35Z', '2027-09-24T03:37:46Z'],
    [42911, '2027-09-26T02:35:40Z', '2027-09-26T03:17:36Z']
  ];
  ref.forEach(([hip, g, c]) => {
    const ls = Ortme.ortmeler(YILDIZ, gzl, new Date(new Date(g).getTime() - 12 * 3600e3), 1);
    const o = ls.find(x => x.hedef.hip === hip);
    expect(o, String(hip)).toBeTruthy();
    expect(sn(o.giris, g), hip + ' giriş').toBeLessThanOrEqual(20);
    expect(sn(o.cikis, c), hip + ' çıkış').toBeLessThanOrEqual(20);
  });
});

test('Örtme kenarı: 21 Aralık Taygeta karanlık kenarda kaybolur, aydınlık kenarda belirir (büyüyen Ay, %93)', () => {
  /* Ay yıldızlara göre doğuya ilerler; büyürken Güneş batısında kalır, aydınlık kenar batıdadır.
     Öndeki (doğu) kenar karanlıktır: yıldız oradan girer. Dolunay 24 Aralık 01:29 UT. */
  const ls = Ortme.ortmeler(YILDIZ, Gok.gozlemci(41.0046, 29.0762, 0), new Date('2026-12-21T12:00:00Z'), 1);
  const o = ls.find(x => x.hedef.hip === 17531);
  expect(o.buyuyen).toBe(true);
  expect(o.girisBilgi.aydinlik).toBe(false);
  expect(o.cikisBilgi.aydinlik).toBe(true);
  expect(o.girisBilgi.gorunur).toBe(true);
});

test('Algol: VSX efemerisi Sky & Telescope tahminlerine ±12 dk, gözlenen minimuma ±30 dk', () => {
  const bul = (t0) => Ortme.algolMinimumlari(ALGOL, new Date(new Date(t0).getTime() - 86400e3), new Date(new Date(t0).getTime() + 86400e3))[0].zaman;
  expect(sn(bul('2026-07-24T01:41:00Z'), '2026-07-24T01:41:00Z')).toBeLessThanOrEqual(12 * 60);
  expect(sn(bul('2026-08-13T03:21:00Z'), '2026-08-13T03:21:00Z')).toBeLessThanOrEqual(12 * 60);
  const g = bul('2025-02-25T19:30:00Z');
  expect(g >= new Date('2025-02-25T18:42:00Z') && g <= new Date('2025-02-25T20:16:00Z')).toBe(true);
});

test('Algol: ardışık minimumlar periyot kadar ayrı; Dünya–Güneş ışık süresi düzeltmesi ≤ 8,4 dk', () => {
  const ls = Ortme.algolMinimumlari(ALGOL, new Date('2026-11-01T00:00:00Z'), new Date('2027-11-01T00:00:00Z'));
  expect(ls.length).toBeGreaterThan(125);
  let enCok = 0;
  ls.forEach(m => { enCok = Math.max(enCok, Math.abs(Ortme.hjdDuzeltme(m.zaman, ALGOL.ra, ALGOL.dec))); });
  expect(enCok).toBeLessThanOrEqual(8.4 * 60);
  expect(enCok).toBeGreaterThan(6 * 60);
  for (let i = 1; i < ls.length; i++) expect(Math.abs((ls[i].zaman - ls[i - 1].zaman) / 86400e3 - ALGOL.periyot)).toBeLessThan(0.0005);
});
