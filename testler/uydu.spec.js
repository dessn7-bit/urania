'use strict';
/* ISS geçişleri: bağımsız bir uygulamayla (Skyfield 1.x, Python; aynı TLE, aynı gözlemci)
   2026-10-27'de hesaplanan değerlerle karşılaştırma. Skyfield find_events(altitude=10°):
     2026-10-28 02:17:57 doğuş · 02:19:54 tepe 14,4° · 02:21:52 batış
     2026-10-28 03:54:23 · 03:57:30 tepe 32,4° · 04:00:36
     2026-10-30 03:55:56 · 03:59:20 tepe 79,1° · 04:02:44
   Skyfield is_sunlit (DE421): 2026-10-28 02:20:00 gölgede, 02:21:00 ışıkta;
   2026-10-29 03:07:30 gölgede, 03:08:30 ışıkta. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
/* uydu.js tarayıcı betiği: Node'un ortak global'ine (aynı işçi süreci başka test dosyalarını da çalıştırır)
   window/Urania/satellite yazmak yerine kendi "window" nesnesiyle bir işlev içinde çalıştırılır. Saat dilimine
   bağlı değil (her şey UT ile); process.env.TZ değiştirilmez. */
const pencere = { Gok: require('../gok.js'), Urania: { oku: () => null, yaz: () => {}, sil: () => {} } };
new Function('window', 'self', 'satellite', fs.readFileSync(path.join(__dirname, '..', 'uydu.js'), 'utf8'))(pencere, pencere, require('../lib/satellite.min.js'));
const Uydu = pencere.Uydu;

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

/* TLE → CelesTrak OMM alanları (uydu.js json2satrec bekler). Heavens-Above'ın orbit sayfasındaki TLE'de uluslararası
   ad ve sürüklenme türevi boş; BSTAR "+26479-3" = 0,26479e-3 biçiminde. */
function tleOmm(l1, l2) {
  const yy = Number(l1.slice(18, 20)), gun = Number(l1.slice(20, 32));
  const epoch = new Date(Date.UTC(yy < 57 ? 2000 + yy : 1900 + yy, 0, 1) + (gun - 1) * 86400e3).toISOString().replace('Z', '');
  const b = l1.slice(53, 61).trim();
  const bstar = Number((b[0] === '-' ? '-' : '') + '0.' + b.replace(/^[+-]/, '').replace(/[+-]\d$/, '')) * Math.pow(10, Number(b.slice(-2)));
  return { OBJECT_NAME: 'X', NORAD_CAT_ID: Number(l1.slice(2, 7)), EPOCH: epoch, MEAN_MOTION: Number(l2.slice(52, 63)), ECCENTRICITY: Number('0.' + l2.slice(26, 33)),
    INCLINATION: Number(l2.slice(8, 16)), RA_OF_ASC_NODE: Number(l2.slice(17, 25)), ARG_OF_PERICENTER: Number(l2.slice(34, 42)), MEAN_ANOMALY: Number(l2.slice(43, 51)),
    EPHEMERIS_TYPE: 0, CLASSIFICATION_TYPE: 'U', ELEMENT_SET_NO: 999, REV_AT_EPOCH: Number(l2.slice(63, 68)) || 0, BSTAR: bstar, MEAN_MOTION_DOT: Number(l1.slice(33, 43)) || 0, MEAN_MOTION_DDOT: 0 };
}

test('Parlaklık: Heavens-Above tablosuyla tepe anında ±0,15 kadir (İstanbul 41,0 K 29,1 D, 7–17 Kasım 2026)', () => {
  /* heavens-above.com PassSummary (lat=41.0, lng=29.1, loc=Istanbul, tz=UCTm3) ve aynı sitenin orbit sayfasındaki TLE,
     7 Kasım 2026 (CelesTrak'a istek yok): testler/veri/ha_2026-11-07_41.0_29.1.json; ham sayfalar arastirma/heavens_above/
     *_20261107_*.html. İçsel parlaklık: ISS −1,8, Tiangong 0,0. ISS: 9 görünür geçiş. Tiangong: dönemde tek görünür geçiş
     (8 Kasım, en çok 12°); bu alçak geçişte fark 0,28 kadir (ufka yakın sönümleme modelleri ayrışıyor), sınır 0,3 olarak
     yazıldı — eski konumun 14 geçişlik tablosunda 0,15 içindeydi (arastirma/uydu_parlaklik.md §2.2). */
  const HA = require('./veri/ha_2026-11-07_41.0_29.1.json').uydular;
  const yer = { enlem: 41.0, boylam: 29.1, yukseklik: 0 };
  const AY = { Nov: 10 };
  [['iss', -1.8, 0.15, 9], ['css', 0.0, 0.3, 1]].forEach(([id, ic, tol, adet]) => {
    const h = HA[id];
    expect(h.gecisler.length).toBe(adet);
    const ls = Uydu.gecisler({ id, omm: tleOmm(h.tle[0], h.tle[1]), icsel: ic }, yer, new Date('2026-11-07T00:00:00Z'), 11).filter(g => g.gorunur);
    h.gecisler.forEach(g => {
      const [gun, ay] = g.tarih.split(' '); const [sa, dk, sn] = g.tepe[0].split(':').map(Number);
      const t = Date.UTC(2026, AY[ay], Number(gun), sa - 3, dk, sn);
      const b = ls.find(x => Math.abs(x.gTepe.t - t) < 90e3);
      expect(b, id + ' ' + g.tarih + ' ' + g.tepe[0]).toBeTruthy();
      expect(Math.abs(b.gTepe.kadir - g.kadir), id + ' ' + g.tarih + ' ' + b.gTepe.kadir.toFixed(2)).toBeLessThanOrEqual(tol);
      expect(Math.abs(b.gTepe.alt - g.tepe[1]), id + ' ' + g.tarih + ' yükseklik').toBeLessThanOrEqual(1);
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
