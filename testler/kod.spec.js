'use strict';
/* Kod denetimi (3. tur) regresyonları: hesap girişi ve birimleri, konum paneli, boş uydu listesi, bulutsuz saatler,
   örtme dilim sınırı, dokunma önceliği. Dış istek yok: CelesTrak fikstürü ya da sahte yanıt. */
const { test, expect } = require('@playwright/test');
const { ISTASYON, SON30 } = require('./yardim');

async function kur(page, ek) {
  await page.route('**/celestrak.org/**', r => { const u = r.request().url(); return r.fulfill({ json: /stations/.test(u) ? ISTASYON : SON30 }); });
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
  await page.clock.install({ time: new Date('2026-10-27T19:00:00+03:00') });
  await page.addInitScript(e => {
    if (sessionStorage.getItem('kod_k')) return; sessionStorage.setItem('kod_k', '1');
    localStorage.setItem('urania_konumOto', 'false');
    Object.entries(e || {}).forEach(([a, v]) => localStorage.setItem('urania_' + a, v));
  }, ek);
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
}

test('Hesap: Türkçe biçimli sayılar, birim sınırında yuvarlama, taşma ve ışık hızını aşan yörünge', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#hesap');
  const uz = async (deger, birim) => { await page.selectOption('#uzB', birim); await page.fill('#uzD', deger); return page.locator('#uzS').innerText(); };
  expect(await uz('1.234,5', 'pc')).toContain('3,809');          // 1234,5 pc = 3,809×10¹⁶ km
  const milyon = await uz('1.000.000', 'km');
  expect(milyon).toContain('1,000 × 10⁶ km');
  expect(milyon).not.toContain('ondalık okudum');
  expect(await uz('0.500', 'pc')).not.toContain('Bin demek');
  expect(await uz('1.500', 'pc')).toContain('Bin demek');          // gerçekten belirsiz olanda not kalır
  expect(await uz('299792,458', 'km')).toContain('1,0 saniye');
  expect(await uz('1e300', 'pc')).toContain('çok büyük');
  await page.fill('#hkA', '1e-9');
  await expect(page.locator('#hkS')).toContainText('Newton');
  expect(page.hatalar).toEqual([]);
});

test('Konum paneli: Enter kaydeder; GPS sonrası elle girilen başka yer cihazın dilimini almaz', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 41.0, longitude: 29.05, accuracy: 20 });
  await kur(page);
  await page.goto('/index.html#gok');
  await page.click('#gkKonumDegis');
  await page.click('#gkGps');
  await expect(page.locator('#gkKDurum')).toContainText('alındı');
  await page.fill('#gkKEnlem', '35,68'); await page.fill('#gkKBoylam', '139,69');
  await page.locator('#gkKBoylam').dispatchEvent('change');
  await page.locator('#gkKBoylam').press('Enter');
  await expect(page.locator('#gkKonumPanel')).toBeHidden();
  const k = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_konum')));
  expect(k.enlem).toBeCloseTo(35.68, 2);
  expect(k.saatDilimi).not.toBe('Europe/Istanbul');
  expect(page.hatalar).toEqual([]);
});

test('Uydu verisinde izlenen uydu yoksa liste bunu söyler, hata olmaz', async ({ page }) => {
  await page.route('**/celestrak.org/**', r => r.fulfill({ json: [] }));
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await page.route('**/nominatim.openstreetmap.org/**', r => r.abort());
  await page.clock.install({ time: new Date('2026-10-27T19:00:00+03:00') });
  await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
  const hatalar = []; page.on('pageerror', e => hatalar.push(String(e)));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkIss')).toContainText('izlenen uydu yok');
  expect(hatalar).toEqual([]);
});

test('Bulut değeri boş (null) saatler "açık" sayılmaz', async ({ page }) => {
  await kur(page);
  await page.unroute('**/api.open-meteo.com/**');
  const t0 = Math.floor(new Date('2026-10-27T12:00:00Z').getTime() / 3600e3) * 3600;
  const time = Array.from({ length: 30 }, (_, i) => t0 + i * 3600);
  const bos = () => time.map(() => null), say = v => time.map(() => v);
  const bulut = time.map((_, i) => (i === 6 || i === 7 ? 95 : null));
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time, cloud_cover: bulut, cloud_cover_low: bos(), cloud_cover_mid: bos(), cloud_cover_high: bos(), relative_humidity_2m: say(60), wind_speed_10m: say(5) } } }));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkHava')).toContainText('Bulut tahmini');
  await expect(page.locator('#gkHava')).not.toContainText('açık');
  await expect(page.locator('#gkHava')).not.toContainText('null');
});

test('Örtme: dilimin son saatinde başlayan pencere kesilmez (Tokyo, Nandou 2027-01-07)', () => {
  const G = require('../gok.js'), O = require('../ortme.js');
  const yd = require('../veri/ortme_yildiz.json').y;
  const gzl = G.gozlemci(35.68, 139.69, 0);
  /* Her iki dilimde ara; aynı olay bir kez ve iki ucuyla bulunmalı */
  const tum = O.ortmeler(yd, gzl, new Date('2026-12-28T00:00:00Z'), 20).filter(o => o.hedef.ad === 'Nandou');
  expect(tum.length).toBeGreaterThan(0);
  const ref = tum[0];
  const sinir = new Date(Math.floor(((ref.giris || ref.cikis).getTime() - 5 * 3600e3) / 3600e3) * 3600e3 + 1800e3);
  const a = O.ortmeler(yd, gzl, new Date(sinir.getTime() - 5 * 86400e3), 5), b = O.ortmeler(yd, gzl, sinir, 5);
  const bul = a.concat(b).filter(o => o.hedef.ad === 'Nandou' && Math.abs((o.giris || o.cikis) - (ref.giris || ref.cikis)) < 3 * 3600e3);
  expect(bul.length).toBe(1);
  expect(!!bul[0].giris).toBe(!!ref.giris); expect(!!bul[0].cikis).toBe(!!ref.cikis);
});

test('Sesli okuma: metindeki "245 g helyum" gram, tablodaki "88 g ·" gün; "^(" okunur', () => {
  const o = require('../okunus.js').okunus;
  expect(o('1 kg sıradan madde al: 245 g helyum, 755 g hidrojen.')).toBe('1 kilogram sıradan madde al: 245 gram helyum, 755 gram hidrojen.');
  expect(o('88 g · 365 g')).toBe('88 gün, 365 gün');
  expect(o('10^(0,4×Δm)')).not.toContain('^');
});

test('AR: "Bul" penceresi açıkken başka sekmeye geçilince pencere kapanır, sayfa tıklanabilir kalır', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#ar');
  await page.waitForSelector('#arArama', { state: 'attached' });
  await page.evaluate(() => document.getElementById('arArama').showModal());
  await page.evaluate(() => { location.hash = '#tani'; });
  await expect.poll(() => page.evaluate(() => document.getElementById('arArama').open)).toBe(false);
  await page.locator('#tnYenile').click({ timeout: 3000 });
});

test('Tanı raporu bozuk uydu önbelleğinde de üretilir', async ({ page }) => {
  await kur(page, { gp_istasyon: JSON.stringify({ ls: [null], alindi: 'bozuk' }) });
  await page.goto('/index.html#tani');
  await expect(page.locator('#tnRapor')).toContainText('SERVİSLER');
  expect(page.hatalar).toEqual([]);
});
