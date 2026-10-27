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

test('Skyfield/DE421 ile İstanbul örtmeleri ±10 sn (ΔT IERS Bulletin A ile)', () => {
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
    expect(sn(o.giris, g), hip + ' giriş').toBeLessThanOrEqual(10);
    expect(sn(o.cikis, c), hip + ' çıkış').toBeLessThanOrEqual(10);
  });
});

test('Gezegen örtmeleri Skyfield/DE421 ile ±45 sn (Astronomy Engine gezegen konumu yakın geçişte ~15″ sapabiliyor)', () => {
  /* Skyfield 1.55, görünen konumlar, Ay merkezi ile gezegen merkezi; gözlem yerleri olayın göründüğü yerler */
  [['Mars', -60, -150, '2026-11-02T13:10:20Z', '2026-11-02T14:19:37Z'],
   ['Venus', -60, -90, '2026-11-07T10:06:26Z', '2026-11-07T11:00:58Z'],
   ['Jupiter', -60, -90, '2026-11-30T08:03:15Z', '2026-11-30T09:05:07Z'],
   ['Jupiter', -60, -120, '2027-02-20T04:38:11Z', '2027-02-20T05:37:16Z']].forEach(([gez, en, boy, g, c]) => {
    const ls = Ortme.ortmeler([], Gok.gozlemci(en, boy, 0), new Date(new Date(g).getTime() - 12 * 3600e3), 1);
    const o = ls.find(x => x.hedef.gezegen === gez);
    expect(o, gez + ' ' + g).toBeTruthy();
    expect(sn(o.giris, g), gez + ' giriş').toBeLessThanOrEqual(45);
    expect(sn(o.cikis, c), gez + ' çıkış').toBeLessThanOrEqual(45);
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

test('Algol: gözlenmiş CCD minimumları (2020–2025, HJD) ±6 dk; S&T 18 Eki 2026 ±3 dk; BAV 2026/2 ±12 dk', () => {
  /* JAAVSO: Samolyk (#3933, #3904, #3825, #3989), Cook 2026 (#4063) — HJD(UTC). Bizim en sönük an geosentrik UT;
     karşılaştırmak için aynı anın HJD'si: UT + (HJD − JD) düzeltmesi. arastirma/algol_ses_kaynaklar.md */
  const JD_UNIX = 2440587.5;
  [2459212.6174, 2459579.6342, 2459989.6630, 2460267.7969, 2460290.7374, 2460591.8083, 2460657.7529, 2460680.6918, 2461027.6455].forEach(hjd => {
    const t = new Date((hjd - JD_UNIX) * 86400e3);
    const m = Ortme.algolMinimumlari(ALGOL, new Date(t - 86400e3), new Date(t.getTime() + 86400e3))[0];
    const bizHjd = m.zaman.getTime() / 86400e3 + JD_UNIX + Ortme.hjdDuzeltme(m.zaman, ALGOL.ra, ALGOL.dec) / 86400;
    expect(Math.abs(bizHjd - hjd) * 1440, String(hjd)).toBeLessThanOrEqual(6);
  });
  /* Sky & Telescope "This Week's Sky at a Glance" (16 Eki 2026): 17 Ekim 21:52 EDT = 18 Ekim 01:52 UT */
  const st = Ortme.algolMinimumlari(ALGOL, new Date('2026-10-17T12:00:00Z'), new Date('2026-10-18T12:00:00Z'))[0].zaman;
  expect(sn(st, '2026-10-18T01:52:00Z')).toBeLessThanOrEqual(3 * 60);
  /* BAV Circular 2026 Heft 2, Min I (0,01 gün = 14,4 dk çözünürlük; BAV büyük olasılıkla HJD basıyor: ~7 dk geç) */
  ['2026-11-07T03:36Z', '2026-11-10T00:29Z', '2026-11-12T21:22Z', '2026-11-15T18:00Z', '2026-11-27T05:17Z', '2026-11-30T02:10Z',
   '2026-12-02T23:02Z', '2026-12-05T19:41Z', '2026-12-08T16:34Z', '2026-12-23T00:43Z', '2026-12-25T21:36Z', '2026-12-28T18:14Z'].forEach(u => {
    const t = new Date(u);
    const m = Ortme.algolMinimumlari(ALGOL, new Date(t - 43200e3), new Date(t.getTime() + 43200e3))[0];
    expect(sn(m.zaman, t), u).toBeLessThanOrEqual(12 * 60);
  });
});

test('Ay örtmeleri: Occult tahminleriyle (IOTA, gezegen merkezi) ±10 sn; Frankfurt Venüs ±30 sn; in-the-sky İstanbul ±3 dk', () => {
  /* lunar-occultations.com (R. Robinson / Occult): Venüs 17 Haz 2026, Jüpiter 6 Eki 2026 şehir listeleri;
     IOTA-ES Frankfurt (Occult); in-the-sky.org İstanbul (41,01 K 28,95 D, dakika hassasiyeti; Occult'tan 1–3 dk sapabiliyor).
     arastirma/ortme_esik_tahmin.md */
  const ys = YILDIZ;
  const kontrol = (hedef, en, boy, g, c, tol) => {
    const o = Ortme.ortmeler(ys, Gok.gozlemci(en, boy, 0), new Date(new Date(g).getTime() - 12 * 3600e3), 1).find(x => (x.hedef.gezegen || x.hedef.ad) === hedef);
    expect(o, hedef + ' ' + g).toBeTruthy();
    expect(sn(o.giris, g), hedef + ' ' + g).toBeLessThanOrEqual(tol);
    expect(sn(o.cikis, c), hedef + ' ' + c).toBeLessThanOrEqual(tol);
  };
  kontrol('Venus', 43.8617, -79.37, '2026-06-17T19:41:20Z', '2026-06-17T20:57:28Z', 10);   // Toronto
  kontrol('Venus', 40.7767, -73.8733, '2026-06-17T19:54:01Z', '2026-06-17T21:10:30Z', 10); // New York
  kontrol('Venus', 25.8617, -80.8967, '2026-06-17T20:05:21Z', '2026-06-17T21:22:55Z', 10); // Miami
  kontrol('Jupiter', 43.8617, -79.37, '2026-10-06T08:25:57Z', '2026-10-06T09:22:24Z', 10); // Toronto
  kontrol('Venus', 50.141667, 8.65, '2026-09-14T09:31:19Z', '2026-09-14T10:38:50Z', 30);   // Frankfurt
  kontrol('Venus', 41.01, 28.95, '2026-09-14T09:41:00Z', '2026-09-14T10:59:00Z', 180);     // İstanbul, in-the-sky
  kontrol('Nunki', 41.01, 28.95, '2027-05-23T23:18:00Z', '2027-05-24T00:50:00Z', 180);
  kontrol('Nunki', 41.01, 28.95, '2027-08-13T18:40:00Z', '2027-08-13T20:08:00Z', 180);
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
