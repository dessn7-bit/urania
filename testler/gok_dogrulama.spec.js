'use strict';
/* Gök hesaplarını bağımsız bir kaynakla karşılaştırır: ABD Deniz Rasathanesi (USNO)
   Astronomical Applications API, 2026-10-27'de çekilen değerler:
   https://aa.usno.navy.mil/api/rstt/oneday?date=2026-10-27&coords=40.99,29.03&tz=3
   https://aa.usno.navy.mil/api/moon/phases/date?date=2026-10-01&nump=20
   USNO dakikaya yuvarlar; tolerans 1 dk (evrelerde 1,5 dk). */
const { test, expect } = require('@playwright/test');
process.env.TZ = 'Europe/Istanbul';
const G = require('../gok.js');

const KADIKOY = G.gozlemci(40.99, 29.03, 0);
const dk = (d) => d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
const hm = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

test('Güneş batışı ve sivil alacakaranlık USNO ile ±1 dk', () => {
  const g = G.geceAraligi(new Date('2026-10-27T15:00:00+03:00'), KADIKOY);
  expect(Math.abs(dk(g.batis) - hm('18:06'))).toBeLessThanOrEqual(1);
  expect(Math.abs(dk(g.sivilSon) - hm('18:35'))).toBeLessThanOrEqual(1);
});

test('Ay doğuşu/batışı ve aydınlık oranı USNO ile uyumlu', () => {
  const an = new Date('2026-10-27T15:00:00+03:00');
  const ay = G.ayDurumu(an, KADIKOY);
  expect(Math.abs(dk(ay.dogus) - hm('18:33'))).toBeLessThanOrEqual(1);
  /* USNO "Set 09:01" o günün sabahı; bizim batış ise öğleden sonraki ilk batış (ertesi sabah). */
  const sabah = G.A.SearchRiseSet('Moon', KADIKOY, -1, new Date('2026-10-27T00:00:00+03:00'), 1).date;
  expect(Math.abs(dk(sabah) - hm('09:01'))).toBeLessThanOrEqual(1);
  const usnoAn = new Date('2026-10-27T00:00:00Z'); // USNO kesir değeri 0h UT için
  expect(Math.abs(G.A.Illumination('Moon', usnoAn).phase_fraction - 0.98)).toBeLessThan(0.01);
});

test('Ay evreleri USNO tablosuyla ±1,5 dk (UT)', () => {
  const beklenen = [
    ['2026-11-01T20:28Z', 3], ['2026-11-09T07:02Z', 0], ['2026-11-17T11:48Z', 1], ['2026-11-24T14:53Z', 2],
    ['2026-12-09T00:52Z', 0], ['2026-12-24T01:28Z', 2], ['2027-01-22T12:17Z', 2], ['2027-02-20T23:23Z', 2]
  ];
  const ls = G.ayCeyrekleri(new Date('2026-10-27T00:00:00Z'), 20);
  beklenen.forEach(([iso, q]) => {
    const h = new Date(iso.replace('Z', ':00Z'));
    const bul = ls.find(x => x.ceyrek === q && Math.abs(x.zaman - h) < 3 * 3600e3);
    expect(bul, iso).toBeTruthy();
    expect(Math.abs(bul.zaman - h) / 60e3).toBeLessThanOrEqual(1.5); // USNO dakikaya yuvarlar (±0,5) + motor hassasiyeti
  });
});

test('Gece 02:00\'de bakınca "bu gece" dün akşam başlayan gecedir', () => {
  const g = G.geceAraligi(new Date('2026-10-28T02:00:00+03:00'), KADIKOY);
  expect(g.batis.getDate()).toBe(27);
  expect(g.dogus.getDate()).toBe(28);
});

test('Hızlı ufuk dönüşümü Astronomy Engine\'in doğrudan yoluyla 0,6° içinde (kırılma farkı)', () => {
  const an = new Date('2026-10-27T21:00:00+03:00');
  const m = G.ufukMatrisi(an, KADIKOY);
  [[56.75, 24.12], [10.68, 41.27], [279.23, 38.78], [101.29, -16.72]].forEach(([ra, dec]) => {
    const hizli = G.ufkaCevir(m, G.birimVektor(ra, dec));
    const dogru = G.sabitAltAz(ra, dec, an, KADIKOY);
    if (dogru.alt > 5) {
      expect(Math.abs(hizli.alt - dogru.alt)).toBeLessThan(0.6);
      const daz = Math.abs(((hizli.az - dogru.az + 540) % 360) - 180);
      expect(daz).toBeLessThan(0.1);
    }
  });
});

test('Meteor etkinlik aralığı yıl atlamasını doğru işler', () => {
  const ursid = { baslangic: '12-17', bitis: '12-26' };
  const quad = { baslangic: '12-28', bitis: '01-12' };
  expect(G.aktifMi(ursid, new Date('2026-12-20T12:00:00+03:00'))).toBe(true);
  expect(G.aktifMi(quad, new Date('2027-01-03T12:00:00+03:00'))).toBe(true);
  expect(G.aktifMi(quad, new Date('2026-12-30T12:00:00+03:00'))).toBe(true);
  expect(G.aktifMi(quad, new Date('2027-02-03T12:00:00+03:00'))).toBe(false);
});

test('Meteor: tam tarihli takvim kaydı yalnız kendi yılında etkin', () => {
  const qua = { baslangic: '2026-12-28', bitis: '2027-01-12' };
  expect(G.aktifMi(qua, new Date('2027-01-12T22:00:00+03:00'))).toBe(true);
  expect(G.aktifMi(qua, new Date('2026-01-03T22:00:00+03:00'))).toBe(false);
  expect(G.aktifMi(qua, new Date('2027-01-13T03:30:00+03:00'))).toBe(false);   // IMO tarihleri UT: 13 Ocak 00:30 UT
});

test('Jüpiter uyduları JPL Horizons ile 2 yay saniyesi içinde', () => {
  /* JPL Horizons, yer merkezli görünen RA/Dec (QUANTITIES=2), 2026-10-28 03:00 UT; 2026-10-27'de çekildi:
     https://ssd.jpl.nasa.gov/api/horizons.api (599 Jüpiter, 501-504 Io/Europa/Ganymede/Callisto) */
  const J = [146.383303078, 14.214145886];
  const H = { Io: [146.405725399, 14.205548748], Europa: [146.351930966, 14.225719423], Ganymede: [146.386255909, 14.213074313], Callisto: [146.275042418, 14.254651655] };
  const ls = G.jupiterUydulari(new Date('2026-10-28T03:00:00Z'));
  expect(ls).toHaveLength(4);
  ls.forEach(m => {
    const h = H[m.ad];
    const dogu = (h[0] - J[0]) * Math.cos(J[1] * Math.PI / 180) * 3600, kuzey = (h[1] - J[1]) * 3600;
    expect(Math.abs(m.dogu - dogu), m.ad).toBeLessThan(2);
    expect(Math.abs(m.kuzey - kuzey), m.ad).toBeLessThan(2);
  });
  /* Ganymede o an diskin önünde (Horizons ofseti 10,3″ < yarıçap ≈17,7″) */
  const g = ls.find(m => m.ad === 'Ganymede');
  expect(Math.hypot(g.dogu, g.kuzey)).toBeLessThan(G.jupiterYaricap(new Date('2026-10-28T03:00:00Z')));
  expect(g.derinlik).toBeLessThan(0);
});

test('Evre ve Satürn halka açıklığı JPL Horizons ile tutarlı', () => {
  /* Horizons QUANTITIES=10,14 (2026-10-28 03:00 UT): aydınlık oran Venüs %1,05436, Merkür %16,84661,
     Mars %89,56293, Satürn %99,94926; Satürn gözlemci-altı enlemi −8,19° (gezegen-yüzeyi/planetodetik).
     Halka eğimi gezegen-merkezli enlemdir: tan(φc) = (1−f)²·tan(φd); Satürn basıklığı f = 0,09796
     (NASA Saturn Fact Sheet: "Ellipticity 0.09796") → |φc| ≈ 6,70°. */
  const t = new Date('2026-10-28T03:00:00Z');
  [['Venus', 1.05436], ['Mercury', 16.84661], ['Mars', 89.56293], ['Saturn', 99.94926]].forEach(([c, y]) => {
    expect(Math.abs(G.A.Illumination(c, t).phase_fraction * 100 - y), c).toBeLessThan(0.1);
  });
  const f = 0.09796;
  const phiC = Math.atan(Math.pow(1 - f, 2) * Math.tan(8.192524 * Math.PI / 180)) * 180 / Math.PI;
  expect(Math.abs(Math.abs(G.A.Illumination('Saturn', t).ring_tilt) - phiC)).toBeLessThan(0.1);
});
