'use strict';
/* Kırmızı mod ilk boyamada: uygulama betikleri hiç çalışmasa bile (yavaş ağ, ilk açılış) kabuk kırmızı/siyah çizilir.
   Dış istek yok: yerel sunucu dışındaki her istek kesilir. */
const { test, expect } = require('@playwright/test');

test('Kırmızı mod betikler yüklenmeden uygulanır; tarayıcı çubuğu siyah', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.route('**/uygulama.js', r => r.fulfill({ contentType: 'text/javascript', body: '' }));   // uygulama hiç başlamasın
  await page.addInitScript(() => localStorage.setItem('urania_kirmizi', 'true'));
  await page.goto('/index.html#gok');
  const d = await page.evaluate(() => ({
    sinif: document.documentElement.classList.contains('kirmizi'),
    zemin: getComputedStyle(document.body).backgroundColor,
    meta: document.querySelector('meta[name="theme-color"]').content
  }));
  expect(d).toEqual({ sinif: true, zemin: 'rgb(0, 0, 0)', meta: '#000000' });
});

test('Kırmızı mod kapalıyken ilk boyama normal tema', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.route('**/uygulama.js', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
  await page.goto('/index.html#gok');
  expect(await page.evaluate(() => document.documentElement.classList.contains('kirmizi'))).toBe(false);
});
