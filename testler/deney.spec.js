// Deneyler v2: liste, yeni altı deney (kaynaklı referans değerlerle), adım adım rehber.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test('Deney listesi: yirmi deney gruplu listelenir', async ({ page }) => {
  await page.goto('/index.html#deney');
  await expect(page.locator('.deney-liste li')).toHaveCount(20);
  await expect(page.locator('h2.unite-bas')).toHaveCount(8);
  await page.locator('.deney-liste a[href="#deney/kepler"]').click();
  await expect(page.locator('h1')).toHaveText('Kepler yasaları');
  await page.locator('a.geri').click();
  await expect(page.locator('.deney-liste li')).toHaveCount(20);
});

test('Hesaplar: kaynaklı referans değerleri', async ({ page }) => {
  await page.goto('/index.html#deney');
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap, GM = 1.3271244e20, AU = 149597870700;
    const Pd = (P, Ms) => Math.cbrt(GM * Ms * P * P / (4 * Math.PI * Math.PI));
    const Re = 6371e3, Rg = 695700e3, PE = 365.256 * 86400, aE = Pd(PE, 1);
    const Pt = 6.101013 * 86400;
    return {
      vDunya: H.visViva(GM, AU, AU) / 1e3,                               // ≈ 29,78 km/s
      pJup: H.keplerP(778.5 / 149.598, 1) * 365.25,                       // NASA: 4331 gün
      gelgitOran: H.gelgitIvme(1, 1.98841e30, 1, 149.6e9) / H.gelgitIvme(1, 7.346e22, 1, 384.4e6), // ≈ 0,46
      dunyaPpm: H.derinlik(Re, Rg) * 1e6,                                 // ≈ 84
      dunyaSaat: H.gecisSure(PE, aE, Rg, Re / Rg, 0) / 3600,              // ≈ 13
      trA: Pd(Pt, 0.0898) / AU,                                           // TEPCat: 0,02925 AB
      hubble: H.hubbleZamani(67.4, 3.085677581491367e16, 365.25 * 86400) / 1e9,
      ha: H.doppler(656.285, 3000e3 / 299792458),
      ayYarim: H.ayOran(90), ayDolu: H.ayOran(180), ayYeni: H.ayOran(0),
      ortTam: H.ortusme(1, 0.1, 0) / Math.PI, ortDis: H.ortusme(1, 0.1, 1.2)
    };
  });
  expect(r.vDunya).toBeCloseTo(29.78, 1);
  expect(Math.abs(r.pJup - 4331)).toBeLessThan(10);
  expect(r.gelgitOran).toBeCloseTo(0.46, 2);
  expect(r.dunyaPpm).toBeCloseTo(84, 0);
  expect(r.dunyaSaat).toBeCloseTo(13.1, 1);
  expect(r.trA).toBeCloseTo(0.02925, 3);
  expect(r.hubble).toBeCloseTo(14.5, 1);
  expect(r.ha).toBeCloseTo(662.89, 1);
  expect(r.ayYarim).toBeCloseTo(0.5, 6); expect(r.ayDolu).toBeCloseTo(1, 6); expect(r.ayYeni).toBeCloseTo(0, 6);
  expect(r.ortTam).toBeCloseTo(0.01, 6); expect(r.ortDis).toBe(0);
});

test('Kepler: Jüpiter düğmesi P ≈ 11,9 yıl verir; rehber Merkür adımı uygulanır', async ({ page }) => {
  await page.goto('/index.html#deney/kepler');
  await page.locator('#kpOn button', { hasText: 'Jüpiter' }).click();
  await expect(page.locator('#kpP')).toHaveText('11,87 yıl');
  await page.locator('.rh-uygula[data-i="1"]').click();
  await expect(page.locator('#kpECikti')).toHaveText('0,206');
  await expect(page.locator('#kpP')).toContainText('87,9 gün');
  await expect(page.locator('.rehber-adim li[data-i="1"]')).toHaveClass(/yapildi/);
});

test('Gelgit: dördünde ölü gelgit, yeni Ay\'da kabarma', async ({ page }) => {
  await page.goto('/index.html#deney/gelgit');
  await expect(page.locator('#ggDurum')).toHaveText('Yeni Ay: kabarma gelgiti');
  await expect(page.locator('#ggOran')).toHaveText('0,46');
  await page.locator('.rh-uygula[data-i="1"]').click();
  await expect(page.locator('#ggDurum')).toHaveText('Dördün: ölü gelgit');
  await page.locator('.rh-uygula[data-i="4"]').click();
  await expect(page.locator('#ggGunes')).not.toBeChecked();
});

test('Tayf: Güneş tepesi ≈ 502 nm; 3000 km/s uzaklaşmada Hα kırmızıya kayar', async ({ page }) => {
  await page.goto('/index.html#deney/tayf');
  await expect(page.locator('#tyTepe')).toHaveText('502 nm');
  await page.locator('.rh-uygula[data-i="3"]').click();
  await expect(page.locator('#tyKayma')).toContainText('kırmızıya');
  await expect(page.locator('#tyHa')).toContainText('662,8');
});

test('Evreler: dolunay düğümdeyse Ay tutulması, düğümden uzaksa yok', async ({ page }) => {
  await page.goto('/index.html#deney/evreler');
  await page.locator('.rh-uygula[data-i="1"]').click();
  await expect(page.locator('#evOran')).toHaveText('%100');
  await expect(page.locator('#evTut')).toContainText('Yok');
  await page.locator('.rh-uygula[data-i="2"]').click();
  await expect(page.locator('#evTut')).toHaveText('Ay tutulması olabilir');
  await page.locator('.rh-uygula[data-i="3"]').click();
  await expect(page.locator('#evTut')).toHaveText('Güneş tutulması olabilir');
  await expect(page.locator('#evAd')).toHaveText('Yeni Ay');
});

test('Geçiş: Dünya–Güneş ≈ 84 ppm, TRAPPIST-1 e ≈ %0,5; b > 1+k geçiş yok', async ({ page }) => {
  await page.goto('/index.html#deney/gecis');
  await page.locator('#gcOn button[data-i="0"]').click();
  await expect(page.locator('#gcDer')).toContainText('84 ppm');
  await expect(page.locator('#gcSure')).toContainText('13,1');
  await page.locator('#gcOn button[data-i="1"]').click();
  await expect(page.locator('#gcDer')).toHaveText('%1,01');
  await expect(page.locator('#gcSure')).toContainText('32,5');
  await page.locator('#gcOn button[data-i="3"]').click();
  await expect(page.locator('#gcDer')).toHaveText('%0,50');
  await page.locator('.rh-uygula[data-i="4"]').click();
  await expect(page.locator('#gcDer')).toHaveText('geçiş yok');
});

test('Hubble: kendi hareketi kapalıyken ölçülen H₀ ayarlananla aynı', async ({ page }) => {
  await page.goto('/index.html#deney/hubble');
  await page.locator('.rh-uygula[data-i="2"]').click();
  await expect(page.locator('#hbOlc')).toHaveText('70,0 km/s/Mpc');
  await page.locator('#hbH').fill('67.4');
  await expect(page.locator('#hbOlc')).toHaveText('67,4 km/s/Mpc');
  await expect(page.locator('#hbZaman')).toHaveText('14,5 milyar yıl');
  await expect(page.locator('#hbPlanck')).toHaveText('67,4 ± 0,5');
});

test('Dar ekranda (320 px) yeni deneyler taşmaz', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const id of ['kepler', 'gelgit', 'tayf', 'evreler', 'gecis', 'hubble']) {
    await page.goto('/index.html#deney/' + id);
    await expect(page.locator('#deneyKap .olcumler')).toBeVisible();
    await page.waitForTimeout(200);
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(tasma, id).toBeLessThanOrEqual(0);
  }
});
