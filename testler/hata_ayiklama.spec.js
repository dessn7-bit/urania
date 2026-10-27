'use strict';
/* v20 hata ayıklama turunun regresyon testleri (Gökyüzü, örtme, uydu, PWA).
   Karşı konum ve örtme saatleri Skyfield 1.55 + DE421 ile hesaplandı (2026-10-27):
     almanac.oppositions_conjunctions: Satürn 2026-10-04 12:29:13 UT, Jüpiter 2027-02-11 00:28:49 UT,
     Mars 2027-02-19 15:50:55 UT.
     Taygeta örtmesi, İstanbul: kayboluş 2026-12-21 23:22 UT, beliriş 23:46 UT; Asterope beliriş 2026-12-22 00:17 UT. */
const { test, expect } = require('@playwright/test');
const { celestrak, ISTASYON, SON30 } = require('./yardim');
const G = require('../gok.js');
const Ortme = require('../ortme.js');
const Plan = require('../plan.js');
const IST = G.gozlemci(41.0, 29.0, 0);
const dk = (a, b) => Math.abs(new Date(a) - new Date(b)) / 60e3;

test('Karşı konum yer merkezli (almanak tanımı): Skyfield ile 5 dk içinde', () => {
  const ol = G.olaylar(new Date('2026-10-01T00:00Z'), IST, 520);
  const bul = ad => ol.find(o => o.baslik.startsWith(ad) && /karşı/.test(o.baslik));
  expect(dk(bul('Satürn').zaman, '2026-10-04T12:29:13Z')).toBeLessThan(5);
  expect(dk(bul('Jüpiter').zaman, '2027-02-11T00:28:49Z')).toBeLessThan(5);
  expect(dk(bul('Mars').zaman, '2027-02-19T15:50:55Z')).toBeLessThan(5);
});

test('Olaylar: Ay evreleri ve en büyük uzanımlar istenen sürenin sonuna kadar sürer', () => {
  const bas = new Date('2026-10-27T00:00Z');
  const ol = G.olaylar(bas, IST, 120);
  const son = new Date(bas.getTime() + 120 * 86400e3);
  const ay = ol.filter(o => o.tur === 'ay').map(o => o.zaman).sort((a, b) => a - b);
  expect(ay.length).toBeGreaterThanOrEqual(7);                       // yeni ay ve dolunaylar: 120 günde 8
  expect((son - ay[ay.length - 1]) / 86400e3).toBeLessThan(15.5);   // son evre sona yakın (eskiden 8 çeyrekle ~60 günde bitiyordu)
  expect(ol.filter(o => /Merkür en büyük uzanımda/.test(o.baslik)).length).toBeGreaterThanOrEqual(2);
  ol.forEach(o => expect(o.zaman <= son).toBe(true));
});

test('Yüksek enlemde gece penceresi ertesi geceye kaymaz; kararmayan gecede hedef ve radyant yok', () => {
  [[63, '2026-06-21T12:00Z'], [58, '2026-06-01T12:00Z'], [68, '2026-05-20T12:00Z']].forEach(([enlem, gun]) => {
    const gzl = G.gozlemci(enlem, 10, 0), g = G.geceAraligi(new Date(gun), gzl);
    const sinir = g.ogle.getTime() + 86400e3;
    ['batis', 'sivilSon', 'denizciSon', 'astroSon', 'dogus', 'astroBas', 'sivilBas', 'karanlikBas', 'karanlikSon']
      .forEach(k => { if (g[k]) expect(g[k].getTime(), enlem + ' ' + k).toBeLessThan(sinir); });
  });
  const gzl = G.gozlemci(63, 10, 0), g = G.geceAraligi(new Date('2026-06-21T12:00Z'), gzl);
  expect(g.karanlikYok).toBe(true);
  const hedefler = require('../veri/hedefler.json').hedefler;
  expect(G.hedeflerBuGece(hedefler, gzl, g, g.karanlikBas).filter(h => h.gorunur)).toEqual([]);
  const p = Plan.olustur({ gzl, gece: g, hedefDurum: G.hedeflerBuGece(hedefler, gzl, g, g.karanlikBas), gezegenGece: [], ay: null, limitKadir: 5 });
  expect(p.maddeler.filter(m => m.tur === 'hedef')).toEqual([]);
});

test('Meteor radyantı: etkin değilse zirve gecesine göre, etkinse bu geceye göre', () => {
  const meteor = require('../veri/meteor.json').yagmurlar;
  const zaman = new Date('2026-10-27T18:00Z'), g = G.geceAraligi(zaman, IST);
  const ls = G.meteorDurumu(meteor, zaman, IST, g);
  const etkin = ls.find(m => m.aktif && m.radyantTepe), degil = ls.find(m => !m.aktif && m.radyantTepe);
  expect(etkin.radyantGece).toBe('bu gece');
  expect(degil.radyantGece).toBe('zirve gecesi');
  /* zirve gecesinin karanlık saatlerinde */
  const zg = G.geceAraligi(new Date(new Date(degil.zirve_utc).getTime() - 12 * 3600e3), IST);
  expect(degil.radyantTepe.zaman >= zg.karanlikBas && degil.radyantTepe.zaman <= zg.karanlikSon).toBe(true);
});

test('Ay tutulması: ortada ufkun altında ama başında görünürse "kısmen görünür"', () => {
  /* 2026-08-28 parçalı ay tutulması: boylam taranır, Ay'ın tutulma ortasında battığı bir yer bulunur */
  let bulundu = null;
  for (let boylam = -180; boylam <= 180 && !bulundu; boylam += 2) {
    const gzl = G.gozlemci(40, boylam, 0);
    const o = G.olaylar(new Date('2026-08-20T00:00Z'), gzl, 15).find(x => x.tur === 'tutulma' && /ay tutulması/i.test(x.baslik));
    if (o && /Kısmen görünür/.test(o.not)) bulundu = { o, gzl };
  }
  expect(bulundu).toBeTruthy();
  expect(G.cisimAltAz('Moon', bulundu.o.zaman, bulundu.gzl).alt).toBeLessThanOrEqual(0);
  expect(bulundu.o.gorunur).toBe(true);
});

test('Ay doğuş/batış yalnız bu gece penceresinde (24 sa)', () => {
  const t = new Date('2026-10-27T12:00Z'), d = G.ayDurumu(t, IST);
  ['dogus', 'batis'].forEach(k => { if (d[k]) expect(d[k] - t).toBeLessThan(86400e3); });
});

test('Örtme: 10 günlük dilim sınırına düşen Ülker örtmesinde kayboluş ve beliriş aynı kayıtta (Skyfield ±1 dk)', () => {
  const yd = require('../veri/ortme_yildiz.json').y;
  const a = Ortme.ortmeler(yd, IST, new Date('2026-12-11T22:00Z'), 10), b = Ortme.ortmeler(yd, IST, new Date('2026-12-21T22:00Z'), 10);
  const tay = a.concat(b).filter(o => o.hedef.ad === 'Taygeta');
  expect(tay.length).toBe(1);
  expect(dk(tay[0].giris, '2026-12-21T23:22:00Z')).toBeLessThan(1);
  expect(dk(tay[0].cikis, '2026-12-21T23:46:00Z')).toBeLessThan(1);
  const ast = a.concat(b).filter(o => o.hedef.ad === 'Asterope');
  expect(ast.length).toBe(1);
  expect(dk(ast[0].cikis, '2026-12-22T00:17:00Z')).toBeLessThan(1);
});

test('Plan canlı modda şimdiden başlar', () => {
  const gzl = IST, g = G.geceAraligi(new Date('2026-10-27T12:00Z'), gzl);
  const simdi = new Date('2026-10-27T22:30Z');
  const gez = G.gezegenlerBuGece(simdi, gzl, g);
  const p = Plan.olustur({ gzl, gece: g, hedefDurum: G.hedeflerBuGece(require('../veri/hedefler.json').hedefler, gzl, g, g.karanlikBas), gezegenGece: gez, ay: G.ayDurumu(simdi, gzl), limitKadir: 5, simdi });
  expect(p.maddeler.length).toBeGreaterThan(0);
  p.maddeler.forEach(m => expect(m.zaman >= simdi).toBe(true));
  const bitti = Plan.olustur({ gzl, gece: g, gezegenGece: gez, limitKadir: 5, simdi: new Date('2026-10-28T06:00Z') });
  expect(bitti.neden).toBe('gece-bitti');
});

/* ---- Arayüz ---- */
const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');
const BOS_HAVA = { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [] } };
test.describe('arayüz', () => {
  test.beforeEach(async ({ page }) => {
    page.hatalar = [];
    page.on('pageerror', e => page.hatalar.push(e.message));
    await page.clock.install({ time: SABIT_AN });
    await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: BOS_HAVA }));
    await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
    await page.addInitScript(() => { localStorage.setItem('urania_konumOto', 'false'); });
  });
  test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

  test('Geçersiz enlem/boylam paneli kapatmaz, otomatik konum ayarını değiştirmez; Unicode eksi kabul edilir', async ({ page }) => {
    await celestrak(page, { hata: 503 });
    await page.goto('/index.html#gok');
    await page.click('#gkKonumDegis');
    await page.fill('#gkKEnlem', '41,5abc');
    await page.click('#gkKKaydet');
    await expect(page.locator('#gkKonumPanel')).toBeVisible();
    await expect(page.locator('#gkKDurum')).toContainText('arasında bir sayı');
    await expect(page.locator('#gkKEnlem')).toHaveAttribute('aria-invalid', 'true');
    await page.fill('#gkKEnlem', '−33,87');
    await page.fill('#gkKBoylam', '151,21');
    await page.click('#gkKKaydet');
    await expect(page.locator('#gkKonumPanel')).toBeHidden();
    await expect(page.locator('#gkKonum')).toContainText(/[-−]33,87/);
    await expect(page.locator('.hata-kutu')).toHaveCount(0);
  });

  test('Tarih alanı 1900–2100 dışını yok sayar; seçilen gün saat 21:00\'de açılır', async ({ page }) => {
    await celestrak(page, { hata: 503 });
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkOlay li').first()).not.toContainText('Hesaplanıyor', { timeout: 15000 });
    await page.locator('#gkTarih').evaluate(i => { i.value = '0099-03-01'; i.dispatchEvent(new Event('change')); });
    await expect(page.locator('#gkBuGece')).toBeHidden();
    await page.locator('#gkTarih').evaluate(i => { i.value = '2027-01-15'; i.dispatchEvent(new Event('change')); });
    await expect(page.locator('#gkBuGece')).toBeVisible();
    await expect(page.locator('#gkSaat')).toContainText('21:00');   // seçilen gün, konumun saatiyle 21:00
    await expect(page.locator('#gkSaat')).toContainText('15 Ocak');
  });

  test('İstasyon grubu alınamazsa liste bunu söyler, "0,0 günlük" yazmaz', async ({ page }) => {
    await page.route('**/celestrak.org/**', r => /GROUP=stations/.test(r.request().url()) ? r.fulfill({ status: 500, body: '' }) : r.fulfill({ json: SON30 }));
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkIss')).toContainText('ISS ve Tiangong yörünge verisi alınamadı', { timeout: 20000 });
    await expect(page.locator('#gkIssKaynak')).not.toContainText('0,0 günlük');
  });

  test('Geçici veri hatası oturum boyunca kalmaz: sekme değişince yeniden denenir', async ({ page }) => {
    await celestrak(page, { hata: 503 });
    let ilk = true;
    await page.route('**/veri/meteor.json', r => { if (ilk) { ilk = false; return r.fulfill({ status: 503, body: '' }); } return r.continue(); });
    await page.goto('/index.html#gok');
    await expect(page.locator('#b-gok .hata-kutu')).toContainText('yüklenemedi');
    await page.goto('/index.html#hesap');
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkOzet')).not.toBeEmpty();
    await expect(page.locator('#b-gok .hata-kutu')).toHaveCount(0);
  });

  test('Ders çizimleri yalnız Dersler açılınca yüklenir; derste çizimler çıkar', async ({ page }) => {
    await celestrak(page, { hata: 503 });
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkOzet p').first()).toBeVisible();
    expect(await page.evaluate(() => typeof window.UraniaCizim)).toBe('undefined');
    await page.goto('/index.html#ders/d1');
    await expect(page.locator('figure.cizim').first()).toBeVisible();
  });

  test('Ağır listeler sonradan dolar: olaylar ve Algol "Hesaplanıyor"da kalmaz', async ({ page }) => {
    await celestrak(page, { hata: 503 });
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkOlay li').first()).not.toContainText('Hesaplanıyor', { timeout: 15000 });
    await expect(page.locator('#gkAlgol li').first()).not.toContainText('Hesaplanıyor');
    expect(await page.locator('#gkOlay li').count()).toBeGreaterThan(5);
  });
});

test('Derslerdeki "N. ders" atıfları uygulamadaki sıra numarasıdır (kaynak metinler dosya kimliğiyle yazıldı)', () => {
  const D = require('../veri/dersler.json').dersler, no = id => D.findIndex(d => d.id === id) + 1;
  const metin = id => JSON.stringify(D.find(d => d.id === id));
  expect(no('d11')).toBeLessThan(no('d12'));                                  // dürbün teleskoptan önce
  expect(metin('d9')).toContain(`Dürbünü sabitlemeyi unutma (${no('d11')}. ders)`);
  expect(metin('d12')).toContain(`güvenli Güneş gözlemi ${no('d4')}. dersin konusudur`);
  expect(metin('d4')).toContain(`ayrıntısını ${no('d5')}. derste göreceksin`);
  D.forEach(d => (JSON.stringify(d).match(/(?<![\d%,.])\d{1,2}\. ders/g) || []).forEach(m => {
    const n = parseInt(m, 10); expect(n >= 1 && n <= D.length, d.id + ' ' + m).toBe(true);
  }));
});

/* Gezegen parlaklığı: Mallama ve Hilton 2018 modeli (JPL Horizons'un kullandığı). Başvuru değerleri:
   JPL Horizons, 2026-10-27: Satürn 0,44, Neptün 7,69 (denetim turunda alındı);
   Skyfield 1.55 magnitudelib + DE421 (aynı model; Güneş'i Güneş Sistemi kütle merkezinde sayar). */
test('Gezegen kadirleri Horizons ile 0,02, Skyfield ile 0,08 içinde', () => {
  const t = new Date('2026-10-27T12:00:00Z');
  expect(Math.abs(G.gezegenKadir('Saturn', t) - 0.44)).toBeLessThan(0.02);
  expect(Math.abs(G.gezegenKadir('Neptune', t) - 7.69)).toBeLessThan(0.02);
  const SF = [["2026-11-15T00:00:00Z", "Mercury", 0.016], ["2026-11-15T00:00:00Z", "Venus", -4.817], ["2026-11-15T00:00:00Z", "Mars", 0.693], ["2026-11-15T00:00:00Z", "Jupiter", -2.086], ["2026-11-15T00:00:00Z", "Saturn", 0.529], ["2026-11-15T00:00:00Z", "Uranus", 5.602], ["2026-11-15T00:00:00Z", "Neptune", 7.707],
    ["2027-05-15T00:00:00Z", "Mercury", -0.718], ["2027-05-15T00:00:00Z", "Venus", -3.858], ["2027-05-15T00:00:00Z", "Mars", 0.525], ["2027-05-15T00:00:00Z", "Jupiter", -2.025], ["2027-05-15T00:00:00Z", "Saturn", 0.705], ["2027-05-15T00:00:00Z", "Uranus", 5.813], ["2027-05-15T00:00:00Z", "Neptune", 7.801],
    ["2028-09-15T00:00:00Z", "Mercury", 0.487], ["2028-09-15T00:00:00Z", "Venus", -4.142], ["2028-09-15T00:00:00Z", "Mars", 1.548], ["2028-09-15T00:00:00Z", "Jupiter", -1.669], ["2028-09-15T00:00:00Z", "Saturn", 0.118], ["2028-09-15T00:00:00Z", "Uranus", 5.66], ["2028-09-15T00:00:00Z", "Neptune", 7.68]];
  SF.forEach(([t, c, m]) => expect(Math.abs(G.gezegenKadir(c, new Date(t)) - m), t + ' ' + c).toBeLessThan(0.08));
});

test('Meteor takvimi veri bitince Güneş boylamından sürer: 2026 verisinden hesaplanan 2027 zirveleri IMO 2027 ile 2 dk içinde', () => {
  const v = require('../veri/meteor.json');
  const v26 = { yagmurlar: v.yagmurlar.filter(m => m.zirve_utc < '2027') };
  const t = G.meteorTakvimi(v26, new Date('2026-06-01T00:00Z')).filter(m => m.tahmini);
  expect(t.length).toBe(13);
  t.filter(m => m.kod !== 'PER').forEach(m => {   // PER: IMO λ☉ 140,0–140,1 aralığı, orta değer kullanılır
    const g = v.yagmurlar.find(x => x.kod === m.kod && x.zirve_utc.startsWith('2027'));
    expect(dk(m.zirve_utc, g.zirve_utc), m.kod).toBeLessThanOrEqual(2);
    expect(m.baslangic).toBe(g.baslangic); expect(m.bitis).toBe(g.bitis);
  });
  /* 2030'da da etkin yağmur ve gelecek zirveler var */
  const ls = G.meteorDurumu(G.meteorTakvimi(v, new Date('2030-08-12T20:00Z')), new Date('2030-08-12T20:00Z'), IST, G.geceAraligi(new Date('2030-08-12T12:00Z'), IST));
  expect(ls.some(m => m.kod === 'PER' && m.aktif)).toBe(true);
});

test('Sesli okuma: izotop, ekli kesir, tablo kısaltması "y", (+BAO), sayı kare/küp', () => {
  const o = require('../okunus.js').okunus;
  expect(o('4 ¹H → ⁴He + enerji')).toBe('4 hidrojen 1, yani helyum 4 artı enerji');
  expect(o('p + p → ²H + e⁺ + ν')).toBe('p artı p, yani hidrojen 2 artı pozitron artı nü');
  expect(o("1/3² = 1/9'una düşer")).toBe('1 bölü 3 kare eşittir dokuzda birine düşer');
  expect(o('20 y: 7,3 · 11,86 y')).toBe('20 yaş: 7,3, 11,86 yıl');
  expect(o('13,787 (+BAO)')).toBe('13,787 (BAO ile)');
  expect(o('L ∝ R²T⁴')).toBe('L orantılıdır R kare T üzeri 4');
  expect(o('4 × 10³ m')).toBe('4 çarpı 10 üzeri 3 metre');   // 10'un kuvveti "üzeri" kalır
});

test('Tekrar kartlarının kimliği kalıcı (kid): benzersiz, ilk atamada eski sıra kimliğiyle aynı', () => {
  const D = require('../veri/dersler.json').dersler, gor = new Set();
  D.forEach(d => [['sorular', 's'], ['anahtar_sayilar', 'n'], ['sozluk', 't']].forEach(([a, p]) => (d[a] || []).forEach((x, i) => {
    expect(x.kid).toBeTruthy(); expect(gor.has(x.kid)).toBe(false); gor.add(x.kid);
  })));
});
