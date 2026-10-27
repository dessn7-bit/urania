'use strict';
/* Bulut tahmini ve gözlem defteri testleri. Open-Meteo ağdan çağrılmaz: istek yakalanır,
   API'nin gerçek biçiminde (timeformat=unixtime, timezone=GMT) sahte yanıt döner. */
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const os = require('os');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');

/* 27 Ekim 00:00 UTC'den 72 saat; bulut fonksiyonu yerel saate (UTC+3) göre */
function sahteHava(bulutFn, yagisFn) {
  const t0 = Date.UTC(2026, 9, 27) / 1000;
  const time = [], cc = [], lo = [], mi = [], hi = [], rh = [], ws = [], pp = [], pr = [];
  for (let i = 0; i < 72; i++) {
    const t = t0 + i * 3600;
    const yerelSaat = new Date((t + 3 * 3600) * 1000).getUTCHours();
    const b = bulutFn(yerelSaat, i);
    const [ol, mm] = yagisFn ? yagisFn(yerelSaat) : [0, 0];
    time.push(t); cc.push(b); lo.push(b); mi.push(0); hi.push(0); rh.push(70); ws.push(8); pp.push(ol); pr.push(mm);
  }
  return { latitude: 40.99, longitude: 29.03, hourly: { time, cloud_cover: cc, cloud_cover_low: lo, cloud_cover_mid: mi, cloud_cover_high: hi, relative_humidity_2m: rh, wind_speed_10m: ws, precipitation_probability: pp, precipitation: pr } };
}

test.beforeEach(async ({ page }) => {
  await page.route('**/celestrak.org/**', r => r.fulfill({ status: 503, body: '' }));
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  await page.clock.install({ time: SABIT_AN });
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test('Bulut: açık gece', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava(() => 5) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('.hava-cumle')).toContainText('Bulut tahmini: gece boyunca büyük ölçüde açık.');
  await expect(page.locator('.hava-saat')).not.toHaveCount(0);
  await expect(page.locator('#gkHava a')).toHaveAttribute('href', 'https://open-meteo.com/');
});

test('Bulut: en açık dönem doğru saatlerle yazılır', async ({ page }) => {
  /* 21:00–02:00 (dahil) açık, diğer saatler kapalı → dönem 21:00–03:00 */
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava(h => (h >= 21 || h <= 2) ? 10 : 85) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('.hava-cumle')).toContainText("Bulut tahmini: en açık dönem 21:00–03:00 (bulut %30'un altında).");
});

test('Bulut: kapalı gece', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava(() => 95) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('.hava-cumle')).toContainText('çoğunlukla kapalı (ortalama %95)');
});

test('Bulut: servis yanıt vermezse açıklayıcı not, uygulama çalışmaya devam eder', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ status: 429, json: { error: true, reason: 'limit' } }));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkHava')).toContainText('Bulut tahmini alınamadı');
  await expect(page.locator('#gkGezegen li')).toHaveCount(7);
});

test('Bulut: çevrimdışıyken önbellekteki tahmin "son güncelleme" ile gösterilir', async ({ page }) => {
  let hata = false;
  await page.route('**/api.open-meteo.com/**', r => hata ? r.abort() : r.fulfill({ json: sahteHava(() => 5) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('.hava-cumle')).toBeVisible();
  hata = true;
  await page.clock.fastForward('02:00:00'); // önbellek bayatlasın (1 sa) ama 48 sa'yi geçmesin
  await page.reload();
  await expect(page.locator('#gkHava .kaynak')).toContainText('son güncelleme');
});

test.describe('Defter', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava(() => 12) }));
  });

  test('Gökyüzü listesinden "Gördüm" → kayıt → "görüldü" işareti', async ({ page }) => {
    await page.goto('/index.html#gok');
    const m31 = page.locator('#gkHedef li', { hasText: 'Andromeda' });
    await m31.locator('a', { hasText: 'Gördüm' }).click();
    await expect(page.locator('#dfForm')).toBeVisible();
    await expect(page.locator('#dfCisim')).toHaveValue('hedef:M31');
    await page.locator('#dfNot').fill('Çekirdeği soluk bir leke gibi.');
    await page.locator('#dfKaydet').click();
    const li = page.locator('#dfListe li').first();
    await expect(li).toContainText('Andromeda Galaksisi');
    await expect(li).toContainText('Çekirdeği soluk bir leke gibi.');
    await expect(li).toContainText('Ay %');            // otomatik Ay evresi
    await expect(li).toContainText('tahmini bulut %12'); // otomatik bulut (önbellekten)
    await expect(li).not.toContainText('yağış olasılığı'); // %0 ise yazılmaz
    await expect(page.locator('#dfOzet')).toContainText('Dürbün hedeflerinden 1/26');
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkHedef li', { hasText: 'Andromeda' }).locator('.rozet.iyi')).toContainText('görüldü');
  });

  test('Kayıt kalıcıdır; düzenlenir ve iki adımda silinir', async ({ page }) => {
    await page.goto('/index.html#defter');
    await page.locator('#dfYeni').click();
    await page.locator('#dfCisim').selectOption('cisim:Saturn');
    await page.locator('#dfKaydet').click();
    await page.reload();
    await expect(page.locator('#dfListe li')).toHaveCount(1);
    await page.locator('#dfListe button[data-is="duzenle"]').click();
    await page.locator('#dfAlet').selectOption('Çıplak göz');
    await page.locator('#dfKaydet').click();
    await expect(page.locator('#dfListe li')).toContainText('Çıplak göz');
    const sil = page.locator('#dfListe button[data-is="sil"]');
    await sil.click();
    await expect(page.locator('#dfListe li')).toHaveCount(1); // ilk basış yalnız onay ister
    await sil.click();
    await expect(page.locator('#dfListe li')).toHaveCount(0);
  });

  test('"Listede yok" seçilince ad zorunlu', async ({ page }) => {
    await page.goto('/index.html#defter');
    await page.locator('#dfYeni').click();
    await page.locator('#dfCisim').selectOption('diger');
    await page.locator('#dfKaydet').click();
    await expect(page.locator('#dfDiger')).toHaveAttribute('aria-invalid', 'true');
    await page.locator('#dfDiger').fill('Starlink treni');
    await page.locator('#dfKaydet').click();
    await expect(page.locator('#dfListe li')).toContainText('Starlink treni');
  });

  test('Yedek: indir, sil, geri yükle; aynı yedek ikinci kez eklenmez; bozuk dosya reddedilir', async ({ page }) => {
    await page.goto('/index.html#defter');
    for (const c of ['cisim:Jupiter', 'hedef:M45']) {
      await page.locator('#dfYeni').click();
      await page.locator('#dfCisim').selectOption(c);
      await page.locator('#dfKaydet').click();
    }
    await page.locator('details summary', { hasText: 'Yedekle' }).click();
    const [indirme] = await Promise.all([page.waitForEvent('download'), page.locator('#dfIndir').click()]);
    const dosya = path.join(os.tmpdir(), 'urania-yedek-test.json');
    await indirme.saveAs(dosya);
    expect(JSON.parse(fs.readFileSync(dosya, 'utf8')).kayitlar).toHaveLength(2);
    await page.evaluate(() => localStorage.removeItem('urania_defter'));
    await page.reload();
    await expect(page.locator('#dfListe li')).toHaveCount(0);
    await page.locator('details summary', { hasText: 'Yedekle' }).click();
    await page.locator('#dfYukle').setInputFiles(dosya);
    await expect(page.locator('#dfYedekDurum')).toHaveText('2 kayıt eklendi.');
    await page.locator('#dfYukle').setInputFiles(dosya);
    await expect(page.locator('#dfYedekDurum')).toHaveText('0 kayıt eklendi, 2 kayıt zaten vardı.');
    const bozuk = path.join(os.tmpdir(), 'urania-bozuk.json');
    fs.writeFileSync(bozuk, '{bu json değil');
    await page.locator('#dfYukle').setInputFiles(bozuk);
    await expect(page.locator('#dfYedekDurum')).toContainText('geçerli bir JSON değil');
    await expect(page.locator('#dfListe li')).toHaveCount(2);
  });
});

test('Bulut: bir saate dokununca ayrıntı çıkar', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava(() => 40) }));
  await page.goto('/index.html#gok');
  await page.locator('.hava-saat').nth(2).click();
  await expect(page.locator('#gkHavaDetay')).toContainText('bulut %40 (alçak %40, orta %0, yüksek %0)');
});

test('Yağış: yağış beklenmeyen gece', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava(() => 5, () => [3, 0]) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('.hava-cumle')).toContainText('Yağış beklenmiyor (olasılık en çok %3).');
});

test('Yağış: riskli saatler ve toplam miktar', async ({ page }) => {
  /* 23:00, 00:00, 01:00 değerleri %70 / 0,8 mm; diğerleri %5. Değer önceki saati kapsar → aralık 22:00–01:00 */
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava(() => 80, h => (h === 23 || h === 0 || h === 1) ? [70, 0.8] : [5, 0]) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('.hava-cumle')).toContainText("Yağış riski: 22:00–01:00 arası olasılık %70'e çıkıyor, gece toplamı yaklaşık 2,4 mm.");
  await page.locator('.hava-saat').nth(5).click();
  await expect(page.locator('#gkHavaDetay')).toContainText('önceki saatte yağış olasılığı');
});

test('Yağış: hafif olasılık', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava(() => 50, h => h === 2 ? [25, 0] : [0, 0]) }));
  await page.goto('/index.html#gok');
  await expect(page.locator('.hava-cumle')).toContainText('Hafif yağış olasılığı var (en çok %25).');
});
