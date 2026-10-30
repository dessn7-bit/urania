// Deney v3: Yaşanabilir bölge (deney/yasanabilir.js). Başvuru değerleri arastirma/deney_v3/yasanabilir_kaynak.md'de.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

/* Kopparapu vd. 2014, Tablo 1 (1 Dünya kütlesi) */
const KS = [
  { anahtar: 'venus', S0: 1.776, a: 2.136e-4, b: 2.533e-8, c: -1.332e-11, d: -3.097e-15 },
  { anahtar: 'kacak', S0: 1.107, a: 1.332e-4, b: 1.580e-8, c: -8.308e-12, d: -1.931e-15 },
  { anahtar: 'maks', S0: 0.356, a: 6.171e-5, b: 1.698e-9, c: -3.198e-12, d: -5.575e-16 },
  { anahtar: 'mars', S0: 0.320, a: 5.547e-5, b: 1.526e-9, c: -2.874e-12, d: -5.011e-16 }
];

test('Hesaplar: Kopparapu sınırları, akı ve denge sıcaklığı kaynaklardaki değerlerle uyumlu', async ({ page }) => {
  await page.goto('/index.html#deney/yasanabilir');
  await expect(page.locator('#ybS')).toBeVisible();
  const r = await page.evaluate(KS => {
    const H = window.UraniaDeneyHesap3.yasanabilir;
    const L = 3.828e26, AU = 149597870700, sig = 5.670374419e-8;        // IAU 2015 B3, IAU 2012 B2, CODATA
    return {
      gunes: H.sinirlar(KS, 1, 5780),
      trappist: H.sinirlar(KS, 0.000553, 2566),
      proxima: H.sinirlar(KS, 0.00155, 3050),
      dunya: H.teq(L, 1.00000011 * AU, 0.294, sig),
      mars: H.teq(L, 1.52366231 * AU, 0.250, sig),
      venus: H.teq(L, 0.72333199 * AU, 0.77, sig),
      dunyaAlb0: H.teq(L, AU, 0, sig),
      eAki: H.aki(0.000553, 0.02925), eTeq: H.teq(0.000553 * L, 0.02925 * AU, 0, sig),
      konumlar: [H.konum(0.8, H.sinirlar(KS, 1, 5780)), H.konum(1, H.sinirlar(KS, 1, 5780)), H.konum(1.7, H.sinirlar(KS, 1, 5780)), H.konum(2, H.sinirlar(KS, 1, 5780))]
    };
  }, KS);
  /* Kopparapu 2014: Güneş için S_eff = 1,107 ve 0,356 → 0,95 ve 1,68 AB; iyimser 0,75 ve 1,77 AB */
  expect(r.gunes.kacak).toBeCloseTo(0.950, 3); expect(r.gunes.maks).toBeCloseTo(1.676, 3);
  expect(r.gunes.venus).toBeCloseTo(0.750, 3); expect(r.gunes.mars).toBeCloseTo(1.768, 3);
  expect(r.gunes.sinirDisi).toBe(false);
  /* TRAPPIST-1 (2566 K) formül aralığının altında: işaretlenir; e, f, g bölgede (Agol 2021: 0,02925, 0,03849, 0,04683 AB) */
  expect(r.trappist.sinirDisi).toBe(true);
  [0.02925, 0.03849, 0.04683].forEach(a => { expect(a).toBeGreaterThan(r.trappist.kacak); expect(a).toBeLessThan(r.trappist.maks); });
  expect(0.02227).toBeLessThan(r.trappist.kacak);                     // d bölgenin iç tarafında
  /* Proxima: Anglada-Escudé 2016 tablosu ~0,0423–0,0816 AB */
  expect(Math.abs(r.proxima.kacak - 0.0423)).toBeLessThan(0.0015);
  expect(Math.abs(r.proxima.maks - 0.0816)).toBeLessThan(0.0015);
  /* NASA fact sheet kara cisim sıcaklıkları: Mars 209,8, Venüs 226,6 K; Dünya ≈ 255 K (Wikipedia Greenhouse effect) */
  expect(Math.abs(r.mars - 209.8)).toBeLessThan(0.3);
  expect(Math.abs(r.venus - 226.6)).toBeLessThan(0.3);
  expect(Math.abs(r.dunya - 255)).toBeLessThan(0.5);
  expect(r.dunyaAlb0).toBeCloseTo(278.33, 1);                          // Wikipedia: 278,3296·(1−A)^¼ K
  /* Agol 2021: TRAPPIST-1 e S = 0,646 S⊕; Ducrot 2020: T_eq = 249,7 K (A = 0) */
  expect(r.eAki).toBeCloseTo(0.646, 2);
  expect(Math.abs(r.eTeq - 249.7)).toBeLessThan(0.5);
  expect(r.konumlar).toEqual(['iyimser-ic', 'temkinli', 'iyimser-dis', 'soguk']);
});

test('Arayüz: örnek düğmeleri ve rehber adımları ölçüm kutularında doğru sayıyı gösterir', async ({ page }) => {
  await page.goto('/index.html#deney/yasanabilir');
  await expect(page.locator('#ybS')).toHaveText('1,00 (1.361 W/m²)');   // açılışta Güneş + Dünya
  await expect(page.locator('#ybTeq')).toHaveText('255 K (−18 °C)');
  await expect(page.locator('#ybHZ')).toHaveText('0,95 – 1,68 AB');
  await expect(page.locator('#ybHZi')).toHaveText('0,75 – 1,77 AB');
  await expect(page.locator('#ybDurum')).toHaveText('Temkinli bölgenin içinde');
  await page.locator('.rh-uygula[data-i="1"]').click();                  // albedo 0
  await expect(page.locator('#ybTeq')).toHaveText('278 K (5 °C)');
  await page.locator('#ybOn button[data-i="2"]').click();                // Venüs
  await expect(page.locator('#ybTeq')).toHaveText('227 K (−47 °C)');
  await expect(page.locator('#ybDurum')).toHaveText('Bölgenin içinde değil: çok sıcak taraf');
  await page.locator('#ybOn button[data-i="1"]').click();                // Mars
  await expect(page.locator('#ybTeq')).toHaveText('210 K (−63 °C)');
  await expect(page.locator('#ybDurum')).toHaveText('Temkinli bölgenin içinde');
  await page.locator('#ybOn button[data-i="3"]').click();                // TRAPPIST-1 e
  await expect(page.locator('#ybHZ')).toHaveText('0,0246 – 0,0498 AB');
  await expect(page.locator('#ybS')).toContainText('0,65');
  await expect(page.locator('#ybMetin')).toContainText('2.600–7.200 K');
  await page.locator('#ybOn button[data-i="4"]').click();                // Proxima b
  await expect(page.locator('#ybHZ')).toHaveText('0,0410 – 0,0813 AB');
  await expect(page.locator('#ybTeq')).toHaveText('251 K (−22 °C)');
  await page.locator('#ybOn button[data-i="5"]').click();                // Procyon A
  await expect(page.locator('#ybHZ')).toHaveText('2,40 – 4,17 AB');
  await expect(page.locator('#ybTeq')).toHaveText('416 K (143 °C)');
  await page.locator('.rh-uygula[data-i="7"]').click();                  // Procyon, 3 AB
  await expect(page.locator('#ybS')).toHaveText('0,78 (1.066 W/m²)');
  await expect(page.locator('#ybDurum')).toHaveText('Temkinli bölgenin içinde');
});

test('Dar ekranda (320 px) taşma yok', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/index.html#deney/yasanabilir');
  await expect(page.locator('#deneyKap .olcumler')).toBeVisible();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});
