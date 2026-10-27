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

const { ISTASYON, SON30 } = require('./yardim');
/* CelesTrak OMM/JSON, 2026-10-27; ISS öğeleri aşağıdaki TLE ile aynı takım (EPOCH 26300.17675415):
   1 25544U 98067A   26300.17675415  .00005704  00000+0  11132-3 0  9993 */
const ISS = { id: 'iss', omm: ISTASYON.find(o => o.NORAD_CAT_ID === 25544) };
const CSS = { id: 'css', omm: ISTASYON.find(o => o.NORAD_CAT_ID === 48274) };
const KONUM = { enlem: 40.99, boylam: 29.029, yukseklik: 20 };
const ls = Uydu.gecisler(ISS, KONUM, new Date('2026-10-27T12:00:00Z'), 3);
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

test('OMM dönemi UTC olarak çözülür', () => {
  /* EPOCH "2026-10-27T04:14:31.558560" saat dilimi yazmaz; UTC'dir (TLE'deki 26300.17675415 ile aynı) */
  expect(Uydu.donem(ISS).toISOString().slice(0, 19)).toBe('2026-10-27T04:14:31');
});

test('Tiangong geçişleri Skyfield ile ±3 sn / ±0,3° (aynı OMM, EarthSatellite.from_omm)', () => {
  /* Skyfield 1.55 find_events(altitude=10°), 40,99 K 29,029 D 20 m */
  const css = Uydu.gecisler(CSS, KONUM, new Date('2026-10-27T12:00:00Z'), 3);
  [['2026-10-27T16:00:03Z', '2026-10-27T16:03:12Z', 68.0, '2026-10-27T16:06:22Z'],
   ['2026-10-28T16:37:02Z', '2026-10-28T16:40:13Z', 80.7, '2026-10-28T16:43:24Z'],
   ['2026-10-29T15:37:12Z', '2026-10-29T15:40:23Z', 88.4, '2026-10-29T15:43:34Z']].forEach(([d, t, el, b]) => {
    const g = css.find(x => Math.abs(x.tepe.t - new Date(t)) < 120e3);
    expect(g, t).toBeTruthy();
    expect(sn(g.bas.t, d)).toBeLessThanOrEqual(3);
    expect(sn(g.tepe.t, t)).toBeLessThanOrEqual(3);
    expect(sn(g.bitis.t, b)).toBeLessThanOrEqual(3);
    expect(Math.abs(g.tepe.alt - el)).toBeLessThanOrEqual(0.3);
    expect(g.gorunur).toBe(true);
  });
  /* 27 Ekim 14:26 (Güneş +6°): gündüz, görünmez; 19:16 (Güneş −47°): gölgede, görünmez */
  expect(css.find(x => Math.abs(x.tepe.t - new Date('2026-10-27T14:26:42Z')) < 120e3).gorunur).toBe(false);
  expect(css.find(x => Math.abs(x.tepe.t - new Date('2026-10-27T19:16:50Z')) < 120e3).gorunur).toBe(false);
});

test('Gün dilimi kenarında kesilen geçiş ikinci kez listelenmez (inceleme bulgusu)', async () => {
  /* 27 Ekim 04:20 UT'den başlayınca 28 Ekim 03:54–04:00 geçişi dilim sınırına (04:00) düşer */
  const ls = await Uydu.gecislerParcali(ISS, KONUM, new Date('2026-10-27T04:20:00Z'), 5);
  for (let i = 1; i < ls.length; i++) expect(ls[i].bas.t > ls[i - 1].bitis.t, ls[i].bas.t.toISOString()).toBe(true);
  const g = ls.find(x => Math.abs(x.tepe.t - new Date('2026-10-28T03:57:30Z')) < 120e3);
  expect(sn(g.bas.t, '2026-10-28T03:54:23Z')).toBeLessThanOrEqual(3);
});

test('Parlaklık: Heavens-Above\'ın 28 geçişlik tablosuyla ±0,15 kadir (tepe anında)', () => {
  /* heavens-above.com PassSummary, Fetih Mah. (41,0046 K 29,0762 D), 27 Eki – 5 Kas 2026, yerel saat (UTC+3):
     arastirma/uydu_parlaklik.md ve arastirma/heavens_above/*.html. İçsel parlaklık: ISS −1,8, Tiangong 0,0 */
  const yer = { enlem: 41.0046, boylam: 29.0762, yukseklik: 0 };
  const HA = {
    iss: [['10-27 06:07', -1.4], ['10-28 05:20', -1.0], ['10-28 06:57', -2.3], ['10-29 06:09', -1.9], ['10-30 05:22', -1.4], ['10-30 06:59', -3.6], ['10-31 06:11', -3.0],
      ['11-01 05:24', -2.0], ['11-01 07:00', -2.8], ['11-02 06:13', -3.7], ['11-03 05:27', -2.1], ['11-03 07:02', -1.5], ['11-04 06:15', -2.1], ['11-05 05:30', -0.9]],
    css: [['10-27 19:03', -2.0], ['10-27 20:37', 1.2], ['10-28 19:40', -2.3], ['10-29 18:40', -2.1], ['10-29 20:15', 0.2], ['10-30 19:17', -2.2], ['10-31 19:53', -1.4],
      ['11-01 18:54', -2.2], ['11-01 20:29', 1.1], ['11-02 19:31', -1.5], ['11-03 18:31', -1.9], ['11-03 20:07', 0.4], ['11-04 19:08', -0.5], ['11-05 19:44', 0.9]]
  };
  [[ISS, 'iss', -1.8], [CSS, 'css', 0.0]].forEach(([u, id, ic]) => {
    const ls = Uydu.gecisler(Object.assign({ icsel: ic }, u), yer, new Date('2026-10-27T00:00:00Z'), 10).filter(g => g.gorunur);
    HA[id].forEach(([an, mag]) => {
      const [ay, gun, s, d] = an.split(/[- :]/).map(Number);
      const t = Date.UTC(2026, ay - 1, gun, s - 3, d);
      const g = ls.find(x => Math.abs(x.gTepe.t - t) < 90e3);
      expect(g, id + ' ' + an).toBeTruthy();
      expect(Math.abs(g.gTepe.kadir - mag), id + ' ' + an + ' ' + g.gTepe.kadir.toFixed(2)).toBeLessThanOrEqual(0.15);
    });
  });
});

test('Starlink dizisi: yalnız yeni, alçak ve toplu fırlatma seçilir', () => {
  /* 2026-10-27 verisi: 2026-225 (ortanca 346 km, dağılmış), 2026-232 (350 km, dağılmış), 2026-242 (266 km, toplu) */
  const d = Uydu.dizileriAyikla(SON30, new Date('2026-10-27T18:00:00Z'));
  expect(d.map(x => x.kod)).toEqual(['2026-242']);
  expect(d[0].adet).toBe(27);
  expect(Math.abs(d[0].yukseklik - 266)).toBeLessThanOrEqual(2);
});

test('Gölgeden çıkış anı Skyfield (DE421) ile ±2 sn — Güneş yönü tarihin ekvatoruna döndürülmüş', () => {
  /* Skyfield is_sunlit, saniye saniye tarama: 28 Ekim 02:20:35, 29 Ekim 03:08:02, 30 Ekim 02:22:34 (UT) */
  [['2026-10-28T02:19:54Z', '2026-10-28T02:20:35Z'], ['2026-10-29T03:09:50Z', '2026-10-29T03:08:02Z'], ['2026-10-30T02:22:06Z', '2026-10-30T02:22:34Z']].forEach(([tepe, cikis]) => {
    const g = bul(tepe);
    expect(g.basNeden).toBe('golge');
    expect(sn(g.gBas.t, cikis)).toBeLessThanOrEqual(2);
  });
});
