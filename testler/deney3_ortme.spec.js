// Deney v3: Örten çift yıldız (deney/ortme.js). Başvuru değerleri arastirma/deney_v3/ortme_kaynak.md'de.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

const SABIT = { h: 6.62607015e-34, c: 299792458, k: 1.380649e-23, lam: 550e-9 };   // NIST CODATA; V bandı ~550 nm
const ALGOL = { R1: 2.73, R2: 3.48, T1: 13000, T2: 4500, a: 0.0620 * 149597870700 / 695700e3, i: 180 - 98.70 };   // Baron 2012, Zavala 2010

test('Hesaplar: Algol modeli kaynaklardaki derinlik ve süreyle uyumlu; geometri sınırları', async ({ page }) => {
  await page.goto('/index.html#deney/ortme');
  await expect(page.locator('#otBir')).toBeVisible();
  const r = await page.evaluate(([A, S]) => {
    const H = window.UraniaDeneyHesap3.ortme;
    const m = H.model(A, S);
    const P = 2.867343;                                                      // AAVSO VSX
    const c3 = Math.pow(10, -0.4 * 2.92);                                    // Algol C, ΔV = 2,92 (Zavala 2010)
    const esit = H.model({ R1: 1, R2: 1, T1: 5772, T2: 5772, a: 10, i: 90 }, S);
    return {
      bir: m.bir.kadir, iki: m.iki.kadir, birFaz: m.bir.faz, sureSaat: m.sure * P * 24,
      ucuncu: H.kadir(H.ucuncuIsik(m.bir.oran, c3)),
      esitBir: esit.bir.kadir, esitIki: esit.iki.kadir,
      sinirYok: H.sureKesir(A.R1, A.R2, A.a, 58), sinirVar: H.sureKesir(A.R1, A.R2, A.a, 63),
      ortTam: H.ortusme(3, 1, 0.5) / Math.PI, ortDis: H.ortusme(1, 1, 2.01), ortYari: H.ortusme(1, 1, 0) / Math.PI,
      pEsit: H.keplerP(10 * 695700e3, 2 * 1.3271244e20) / 86400,
      isikDisari: H.isik(Object.assign({}, m.q), 0.25)
    };
  }, [ALGOL, SABIT]);
  expect(r.bir).toBeCloseTo(1.40, 2);              // modelin kendisi (python ile yeniden hesaplandı: 1,4015)
  expect(r.iki).toBeCloseTo(0.0154, 3);
  expect(r.birFaz).toBe(0);                        // sıcak A örtülünce birincil
  expect(Math.abs(r.ucuncu - 1.27)).toBeLessThan(0.05);   // GCVS 2,12 → 3,39
  expect(Math.abs(r.ucuncu - 1.21)).toBeLessThan(0.05);   // VSX 2,09 → 3,30
  expect(Math.abs(r.sureSaat - 9.63)).toBeLessThan(0.6);  // VSX: dönemin %14'ü, 9,63 saat
  expect(r.esitBir).toBeCloseTo(2.5 * Math.log10(2), 4);
  expect(r.esitIki).toBeCloseTo(r.esitBir, 6);
  expect(r.sinirYok).toBe(0); expect(r.sinirVar).toBeGreaterThan(0);   // tutulma sınırı ≈ 62,2°
  expect(r.ortTam).toBeCloseTo(1, 9); expect(r.ortDis).toBe(0); expect(r.ortYari).toBeCloseTo(1, 9);
  expect(r.pEsit).toBeCloseTo(2.590, 3);
  expect(r.isikDisari).toBeCloseTo(1, 9);
});

test('Arayüz: Algol düğmesi ve rehber adımları ölçüm kutularında doğru sayıyı gösterir', async ({ page }) => {
  await page.goto('/index.html#deney/ortme');
  await page.locator('#otOn button[data-i="0"]').click();
  await expect(page.locator('#otBir')).toHaveText('1,40 kadir (%72,5)');
  await expect(page.locator('#otIki')).toHaveText('0,015 kadir (%1,4)');
  await expect(page.locator('#otSure')).toContainText('10,1 saat');
  await expect(page.locator('#otICikti')).toHaveText('81,3°');
  await expect(page.locator('#otMetin')).toContainText('Yaklaşan olaylar');
  await page.locator('#otOn button[data-i="1"]').click();
  await expect(page.locator('#otBir')).toHaveText('0,074 kadir (%6,6)');
  await expect(page.locator('#otSure')).toContainText('5,5 saat');
  await page.locator('#otOn button[data-i="3"]').click();
  await expect(page.locator('#otBir')).toHaveText('tutulma yok');
  await page.locator('#otOn button[data-i="2"]').click();
  await expect(page.locator('#otBir')).toHaveText('0,75 kadir (%50,0)');
  await expect(page.locator('#otIki')).toHaveText('0,75 kadir (%50,0)');
  await expect(page.locator('#otDonem')).toContainText('2,590 gün');
  await page.locator('.rh-uygula[data-i="4"]').click();            // Algol, 2. yıldız 13.000 K
  await expect(page.locator('#otBir')).toHaveText('0,36 kadir (%28,5)');
  await expect(page.locator('#otIki')).toHaveText('0,36 kadir (%28,5)');
  await page.locator('.rh-uygula[data-i="5"]').click();            // Algol, i = 90°
  await expect(page.locator('#otBir')).toHaveText('3,79 kadir (%96,9)');
  await page.locator('.rh-uygula[data-i="6"]').click();            // Algol, P = 10 gün
  await expect(page.locator('#otBir')).toHaveText('1,40 kadir (%72,5)');
  await expect(page.locator('#otSure')).toContainText('35,3 saat');
});

test('Azaltılmış harekette elle zaman kaydırıcısı ışığı değiştirir', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/index.html#deney/ortme');
  const z = page.locator('#otZaman');
  await expect(z).toBeAttached();
  await z.fill('0');
  await expect(page.locator('#otSimdi')).toHaveText('%27,5');      // faz 0: birincil kavuşum (A örtülü)
  await z.fill('0.25');
  await expect(page.locator('#otSimdi')).toHaveText('%100,0');     // dörtte bir dönem sonra tutulma yok
  await z.fill('0.5');
  await expect(page.locator('#otSimdi')).toHaveText('%98,6');      // ikincil kavuşum (B örtülü)
});

test('Dar ekranda (320 px) taşma yok', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/index.html#deney/ortme');
  await expect(page.locator('#deneyKap .olcumler')).toBeVisible();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});
