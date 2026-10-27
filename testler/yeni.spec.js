'use strict';
/* Gece planı, Algol, Ay örtmeleri, Tiangong/Starlink listesi, tekrar kartları ve sesli ders.
   Saat 2026-10-27 19:00 İstanbul'a sabitlenir; CelesTrak verisi 2026-10-27'de indirilmiş gerçek OMM. */
const { test, expect } = require('@playwright/test');
const { celestrak } = require('./yardim');

const SABIT_AN = new Date('2026-10-27T19:00:00+03:00');
function hava(bulut) {
  /* 27 Ekim 12:00 UT'den itibaren 72 saat, her saat aynı bulut */
  const t0 = Date.UTC(2026, 9, 27, 0) / 1000, n = 72, h = { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [], precipitation_probability: [], precipitation: [] };
  for (let i = 0; i < n; i++) { h.time.push(t0 + i * 3600); h.cloud_cover.push(bulut); h.cloud_cover_low.push(bulut); h.cloud_cover_mid.push(0); h.cloud_cover_high.push(0); h.relative_humidity_2m.push(70); h.wind_speed_10m.push(5); h.precipitation_probability.push(0); h.precipitation.push(0); }
  return { hourly: h };
}

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  page.on('console', m => { if (m.type() === 'error') page.hatalar.push(m.text()); });
  await page.clock.install({ time: SABIT_AN });
  await celestrak(page);
});
test.afterEach(async ({ page }) => {
  expect(page.hatalar, 'konsol/sayfa hatası olmamalı').toEqual([]);
});

test('Gece planı: saat sırasıyla; gezegenler, Ay ve hedefler; açık gökte bulut rozeti', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(10) }));
  await page.goto('/index.html#gok');
  const ol = page.locator('#gkPlan');
  await expect(ol.locator('li.plan-gezegen').first()).toBeVisible();
  await expect(ol).toContainText('Jüpiter');
  await expect(ol).toContainText('Satürn');
  await expect(ol.locator('li.plan-ay')).toHaveCount(1);
  expect(await ol.locator('li.plan-hedef').count()).toBeGreaterThanOrEqual(3);
  await expect(ol.locator('.rozet.iyi').first()).toContainText('bulut %10');
  /* saatler artan sırada (gece yarısından sonrası +24 sa) */
  const saatler = await ol.locator('.saat').allInnerTexts();
  const dk = saatler.map(s => { const [h, m] = s.split(':').map(Number); return (h < 12 ? h + 24 : h) * 60 + m; });
  expect(dk).toEqual(dk.slice().sort((a, b) => a - b));
  /* Takvim: tek bir .ics, tüm maddelerle */
  const [indir] = await Promise.all([page.waitForEvent('download'), page.locator('#gkPlanTakvim').click()]);
  const metin = require('fs').readFileSync(await indir.path(), 'utf8').replace(/\r\n /g, '');
  expect(metin).toContain('SUMMARY:Gözlem planı');
  expect(metin).toContain('Jüpiter');
});

test('Gece planı: bulutlu gecede uyarı, kapalı saatlere uyarı rozeti', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(95) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkPlan .plan-not')).toContainText('çoğunlukla kapalı (ortalama %95)');
  await expect(page.locator('#gkPlan .rozet.uyari').first()).toContainText('bulut %95');
});

test('Algol: 7 Kasım 06:34 minimumu listede, VSX kaynağıyla', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(0) }));
  await page.goto('/index.html#gok');
  const ul = page.locator('#gkAlgol');
  await expect(ul.locator('li').first()).toContainText('7 Kasım');
  await expect(ul.locator('li').first()).toContainText('06:34');
  await expect(ul).toContainText('AAVSO VSX');
});

test('Ay örtmeleri: 22 Aralık Ülker örtmesi (Taygeta 02:22, karanlık kenar); sönük Asterope "seçilmez" notuyla, 28 Ekim hiç yok', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(0) }));
  await page.goto('/index.html#gok');
  const ul = page.locator('#gkOrtme');
  const ulker = ul.locator('li', { hasText: 'Ülker örtmesi · 22 Aralık' });
  await expect(ulker).toBeVisible({ timeout: 15000 });
  await expect(ulker).toContainText('Taygeta (4,3): 02:22 Ay\'ın karanlık kenarında kaybolur (dürbünle sınırda)');
  /* Asterope (5,8) aynı gece karanlık kenarda ama %93 Ay'ın parıltısında 7×50 ile seçilmez */
  await expect(ulker).toContainText('Asterope (5,8): kayboluşu 02:30, karanlık kenarda: Ay\'ın parıltısında dürbünle seçilmez');
  /* 28 Ekim: Asterope 5,8 kadir, Ay %95 — dürbünle seçilmez, listede yok */
  await expect(ul).not.toContainText('28 Ekim');
});

test('Uydular: ISS ve Tiangong geçişleri birlikte; Starlink dizisi notuyla', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(0) }));
  await page.goto('/index.html#gok');
  const ul = page.locator('#gkIss');
  await expect(ul.locator('li', { hasText: 'Tiangong' }).first()).toBeVisible({ timeout: 20000 });
  /* Skyfield (uydu.spec.js): Tiangong 28 Ekim 16:37 UT (19:37) doğar, tepe 80,7° */
  await expect(ul.locator('li', { hasText: 'Tiangong · 28 Ekim' }).first()).toContainText('en çok 81°');
  await expect(ul.locator('li', { hasText: 'ISS' }).first()).toBeVisible();
  const dizi = ul.locator('li', { hasText: 'Starlink' });
  if (await dizi.count()) await expect(dizi.first()).toContainText('art arda dizili');
});

test('Uydu verisi alınamazsa anlaşılır mesaj; CelesTrak\'a 2 saat yeniden gidilmez', async ({ page }) => {
  await page.unroute('**/celestrak.org/**');
  let istek = 0;
  await page.route('**/celestrak.org/**', r => { istek++; r.fulfill({ status: 403, body: '' }); });
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(0) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkIss')).toContainText('Yörünge verisi alınamadı');
  const ilk = istek;
  expect(ilk).toBe(2); // stations + last-30-days, birer kez
  await page.reload();
  await expect(page.locator('#gkIss')).toContainText('Yörünge verisi alınamadı');
  expect(istek).toBe(ilk);
  /* 403'ün tarayıcı konsoluna düşen kaydı beklenen durum */
  page.hatalar = page.hatalar.filter(h => !/status of 403/.test(h));
});

test('Depoya yazılamasa da CelesTrak\'a yarım saatte yeniden gidilmez (inceleme bulgusu)', async ({ page }) => {
  await page.addInitScript(() => {
    const asil = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { if (/gp_/.test(k)) throw new DOMException('dolu', 'QuotaExceededError'); return asil.call(this, k, v); };
  });
  await page.unroute('**/celestrak.org/**');
  let istek = 0;
  const { ISTASYON, SON30 } = require('./yardim');
  await page.route('**/celestrak.org/**', r => { istek++; r.fulfill({ json: /stations/.test(r.request().url()) ? ISTASYON : SON30 }); });
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(0) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkIss li', { hasText: 'Tiangong' }).first()).toBeVisible({ timeout: 20000 });
  await page.clock.runFor(30 * 60e3);
  await page.locator('#gkTarih').fill('2026-11-05');
  await page.locator('#gkTarih').dispatchEvent('change');
  await page.waitForTimeout(500);
  expect(istek).toBe(2);
});

test('Takvim düğmesi gece değişince de kendi olayını indirir (inceleme bulgusu)', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(0) }));
  await page.goto('/index.html#gok');
  const dugme = page.locator('#gkOrtme li', { hasText: 'Ülker örtmesi · 22 Aralık' }).locator('[data-takvim]');
  await expect(dugme).toBeVisible({ timeout: 15000 });
  await page.locator('#gkTarih').fill('2026-11-05');
  await page.locator('#gkTarih').dispatchEvent('change');
  await page.waitForTimeout(300);
  const [indir] = await Promise.all([page.waitForEvent('download'), dugme.click()]);
  expect(require('fs').readFileSync(await indir.path(), 'utf8')).toContain('SUMMARY:Ülker örtmesi');
});

test('Örtme listesinde aynı olay iki kez yok', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(0) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkOrtme li').first()).not.toContainText('Hesaplanıyor', { timeout: 15000 });
  const basliklar = await page.locator('#gkOrtme li .ad').allInnerTexts();
  const saatler = await page.locator('#gkOrtme li .sag').allInnerTexts();
  const ikili = basliklar.map((b, i) => b + '|' + saatler[i]);
  expect(new Set(ikili).size).toBe(ikili.length);
});

test('Tekrar kartları: okunan dersin kartları gelir; bilinen kart 2. kutuya, bilinemeyen 1. kutuya', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: hava(0) }));
  await page.goto('/index.html#ders');
  await expect(page.locator('.kart-ozet')).toContainText('Okudum');
  await page.goto('/index.html#ders/d10');
  await page.locator('#dsBitir').click();
  await page.goto('/index.html#ders');
  await expect(page.locator('.kart-ozet')).toContainText('Bugün');
  const toplam = Number((await page.locator('.kart-ozet span').innerText()).match(/(\d+) kart$/)[1]);
  expect(toplam).toBeGreaterThan(3);
  await page.locator('.kart-ozet a').click();
  await expect(page.locator('.kart-on')).toBeVisible();
  await expect(page.locator('#kaArka')).toBeHidden();
  await page.locator('#kaCevir').click();
  await expect(page.locator('#kaArka')).toBeVisible();
  await page.locator('#kaEvet').click();
  await page.locator('#kaCevir').click();
  await page.locator('#kaHayir').click();
  const r = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_kartlar') || '{}'));
  const kutular = Object.values(r).map(x => x.k).sort();
  expect(kutular).toEqual([1, 2]);
  /* Bildiğin kart yarın değil 3 gün sonra sorulur */
  const z = Object.values(r).find(x => x.k === 2).z;
  expect(Math.round((z - new Date('2026-10-27T00:00:00+03:00').getTime()) / 86400e3)).toBe(3);
});
