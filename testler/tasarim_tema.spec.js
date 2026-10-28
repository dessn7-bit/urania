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

for (const [an, beklenen] of [['2026-10-28T20:30:00+03:00', '2026-10-28'], ['2026-10-29T02:00:00+03:00', '2026-10-28']]) {
  test(`Gece kutusu canlı modda bu gecenin tarihini gösterir (${an})`, async ({ page }) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
    await page.clock.install({ time: new Date(an) });
    await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkTarih')).toHaveValue(beklenen);
    await page.locator('#gkTarih').fill('2026-11-05');
    await page.locator('#gkTarih').dispatchEvent('change');
    await expect(page.locator('#gkBuGece')).toBeVisible();
    await page.click('#gkSimdi');
    await expect(page.locator('#gkTarih')).toHaveValue(beklenen);
  });
}

test('Gökyüzü bölümleri ilk açılışta kapalı, başlıkta özet; açılınca liste görünür ve tercih saklanır', async ({ page }) => {
  await page.route('**/celestrak.org/**', r => r.abort());
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.clock.install({ time: new Date('2026-10-28T11:30:00+03:00') });
  await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkOzet_gezegen')).toContainText('Satürn');
  await expect(page.locator('#gkOzet_algol')).toContainText('sıradaki:');
  await expect(page.locator('#gkOzet_olay')).toContainText('sıradaki: Yeni Ay');
  await expect(page.locator('#gkGezegen')).toBeHidden();
  await expect(page.locator('#gkPlan')).toBeVisible();   // plan hep açık
  const s = page.locator('details[data-kat="gezegen"] > summary');
  expect((await s.boundingBox()).height).toBeGreaterThanOrEqual(48);
  await s.click();
  await expect(page.locator('#gkGezegen li').first()).toBeVisible();
  await expect(page.locator('#gkOzet_gezegen')).toBeHidden();
  await page.reload();
  await expect(page.locator('#gkGezegen li').first()).toBeVisible();
  await expect(page.locator('#gkMeteor')).toBeHidden();
});
