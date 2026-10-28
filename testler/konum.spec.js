'use strict';
/* Otomatik konum: telefon neredeyse orası. Ankara (39,92 K, 32,85 D) için gün batımı
   USNO'ya göre 17:53 TSİ (https://aa.usno.navy.mil/api/rstt/oneday?date=2026-10-27&coords=39.92,32.85&tz=3).
   Yer adı ters kodlaması (Nominatim) testte sahte yanıtla verilir. */
const { test, expect } = require('@playwright/test');
const { celestrak } = require('./yardim');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');
const BOS_HAVA = { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [] } };

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  await page.clock.install({ time: SABIT_AN });
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: BOS_HAVA }));
  await celestrak(page, { hata: 503 });
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: { suburb: 'Kızılay Mahallesi', town: 'Çankaya', province: 'Ankara' } } }));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test.describe('izin verilmiş', () => {
  test.use({ geolocation: { latitude: 39.92, longitude: 32.85, accuracy: 25 }, permissions: ['geolocation'] });

  test('Açılışta telefonun konumu alınır, yer adı ve gün batımı ona göre', async ({ page }) => {
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkKonum')).toContainText('Kızılay Mahallesi, Çankaya');
    await expect(page.locator('#gkKonum')).toContainText('GPS, ±25 m');
    await expect(page.locator('#gkOzet p').first()).toContainText('17:53');
  });

  test('Elle seçilen konum kalıcıdır; GPS onu ezmez', async ({ page }) => {
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkKonum')).toContainText('Kızılay');
    await page.locator('#gkKonumDegis').click();
    await page.locator('#gkKOto').uncheck();
    await page.locator('#gkKAd').fill('Fenerbahçe Parkı');
    await page.locator('#gkKEnlem').fill('40,97');
    await page.locator('#gkKBoylam').fill('29,04');
    await page.locator('#gkKKaydet').click();
    await expect(page.locator('#gkKonum')).toContainText('Fenerbahçe Parkı');
    await expect(page.locator('#gkKonum')).toContainText('elle seçildi');
    await page.reload();
    /* Olumlu hazır olma koşulu: sayfa çizildi (özet geldi). Sonra sayfadan bir konum isteği tamamlanana kadar
       beklenir: uygulama GPS istediyse onun yanıtı da bu sürede gelmiş olur (Playwright konumu anında verir). */
    await expect(page.locator('#gkOzet p').first()).toBeVisible();
    await page.evaluate(() => new Promise(r => navigator.geolocation.getCurrentPosition(() => r(), () => r(), { maximumAge: 0 })));
    await expect(page.locator('#gkKonum')).toContainText('Fenerbahçe Parkı');
    await expect(page.locator('#gkKonum')).toContainText('elle seçildi');
    await expect(page.locator('#gkKonum')).not.toContainText('Kızılay');
    /* yeniden otomatiğe al */
    await page.locator('#gkKonumDegis').click();
    await page.locator('#gkKOto').check();
    await page.locator('#gkKKaydet').click();
    await expect(page.locator('#gkKonum')).toContainText('Kızılay');
  });
});

test.describe('izin yok', () => {
  test('İzin verilmezse varsayılan yer kullanılır ve sebebi yazar', async ({ page, context }) => {
    await context.clearPermissions();
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkKonum')).toContainText('Fetih Mahallesi');
    await expect(page.locator('#gkKonum')).toContainText(/konum izni yok|konum alınamadı/);
    await expect(page.locator('#gkGezegen li')).toHaveCount(7);
  });
});
