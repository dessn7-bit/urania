'use strict';
/* ISS geçişleri: bağımsız bir uygulamayla (Skyfield 1.x, Python; aynı TLE, aynı gözlemci)
   2026-10-27'de hesaplanan değerlerle karşılaştırma. Skyfield find_events(altitude=10°):
     2026-10-28 02:17:57 doğuş · 02:19:54 tepe 14,4° · 02:21:52 batış
     2026-10-28 03:54:23 · 03:57:30 tepe 32,4° · 04:00:36
     2026-10-30 03:55:56 · 03:59:20 tepe 79,1° · 04:02:44
   Skyfield is_sunlit (DE421): 2026-10-28 02:20:00 gölgede, 02:21:00 ışıkta;
   2026-10-29 03:07:30 gölgede, 03:08:30 ışıkta. */
const { test, expect } = require('@playwright/test');
process.env.TZ = 'UTC';
global.self = global; global.window = global;
global.satellite = require('../lib/satellite.min.js');
global.Astronomy = require('../lib/astronomy.browser.min.js');
global.Gok = require('../gok.js');
global.Urania = { oku: () => null, yaz: () => {} };
require('../uydu.js');

const TLE = { s1: '1 25544U 98067A   26300.17675415  .00005704  00000+0  11132-3 0  9993', s2: '2 25544  51.6336   6.9404 0006948 314.9066  45.1358 15.49073103592213' };
const KONUM = { enlem: 40.99, boylam: 29.029, yukseklik: 20 };
const ls = Uydu.gecisler(TLE, KONUM, new Date('2026-10-27T12:00:00Z'), 3);
const bul = iso => ls.find(g => Math.abs(g.tepe.t - new Date(iso)) < 120e3);
const sn = (a, b) => Math.abs(new Date(a) - new Date(b)) / 1000;

test('Geçiş saatleri ve tepe yüksekliği Skyfield ile ±3 sn / ±0,3°', () => {
  [['2026-10-28T02:17:57Z', '2026-10-28T02:19:54Z', 14.4, '2026-10-28T02:21:52Z'],
   ['2026-10-28T03:54:23Z', '2026-10-28T03:57:30Z', 32.4, '2026-10-28T04:00:36Z'],
   ['2026-10-30T03:55:56Z', '2026-10-30T03:59:20Z', 79.1, '2026-10-30T04:02:44Z']].forEach(([d, t, el, b]) => {
    const g = bul(t);
    expect(g, t).toBeTruthy();
    expect(sn(g.bas.t, d)).toBeLessThanOrEqual(3);
    expect(sn(g.tepe.t, t)).toBeLessThanOrEqual(3);
    expect(sn(g.bitis.t, b)).toBeLessThanOrEqual(3);
    expect(Math.abs(g.tepe.alt - el)).toBeLessThanOrEqual(0.3);
  });
});

test('Gölgeden çıkış anı Skyfield is_sunlit ile tutarlı', () => {
  const g1 = bul('2026-10-28T02:19:54Z');
  expect(g1.gBas.t >= new Date('2026-10-28T02:20:00Z') && g1.gBas.t <= new Date('2026-10-28T02:21:00Z')).toBe(true);
  const g2 = bul('2026-10-29T03:09:50Z');
  expect(g2.gBas.t >= new Date('2026-10-29T03:07:30Z') && g2.gBas.t <= new Date('2026-10-29T03:08:30Z')).toBe(true);
});

test('Gece yarısı tam gölgede geçen geçiş görünmez sayılır', () => {
  /* 2026-10-28 22:17 UT tepe 84°: Skyfield gölgede, Güneş −61,6° */
  expect(bul('2026-10-28T22:17:10Z').gorunur).toBe(false);
});

test('TLE dönemi doğru çözülür', () => {
  /* 26300.17675415 → 2026'nın 300. günü = 27 Ekim, 04:14:31,6 UT (CelesTrak JSON EPOCH ile aynı) */
  expect(Uydu.tleDonemi(TLE.s1).toISOString().slice(0, 19)).toBe('2026-10-27T04:14:31');
});

test('Gölgeden çıkış anı Skyfield (DE421) ile ±2 sn — Güneş yönü tarihin ekvatoruna döndürülmüş', () => {
  /* Skyfield is_sunlit, saniye saniye tarama: 28 Ekim 02:20:35, 29 Ekim 03:08:02, 30 Ekim 02:22:34 (UT) */
  [['2026-10-28T02:19:54Z', '2026-10-28T02:20:35Z'], ['2026-10-29T03:09:50Z', '2026-10-29T03:08:02Z'], ['2026-10-30T02:22:06Z', '2026-10-30T02:22:34Z']].forEach(([tepe, cikis]) => {
    const g = bul(tepe);
    expect(g.basNeden).toBe('golge');
    expect(sn(g.gBas.t, cikis)).toBeLessThanOrEqual(2);
  });
});
