// Deney: Yıldızlara uzaklık (ıraklık). Saf hesaplar kaynaklı değerlerle, ön ayarlar ölçüm kutularıyla sınanır.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function ac(page) {
  await page.goto('/index.html#deney/paralaks');
  await expect(page.locator('#prP')).not.toHaveText('—');
}

test('Hesaplar: parsek tanımı, Proxima, Bessel 1838, 1 lira karşılaştırması, Gaia hatası', async ({ page }) => {
  await ac(page);
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.paralaks, pc = 3.085677581491367e16, ly = 9460730472580800;
    return {
      ab: H.abParsek(),                                  // IAU 2015 B2: 648.000/π ≈ 206.264,8
      lyPc: H.isikYili(1, pc, ly),                       // ≈ 3,2616
      prox: H.uzaklik(0.7680665),                        // Wikipedia (Gaia DR3): 1,30197 pc
      proxLy: H.isikYili(H.uzaklik(0.7680665), pc, ly),  // 4,2465 ışık yılı
      bessel: H.isikYili(H.uzaklik(0.3136), pc, ly),     // Wikipedia/d17: ≈ 10,4 ışık yılı
      cyg: H.uzaklik(0.2859949),                         // 3,4966 pc
      vega: H.uzaklik(0.13023),                          // 7,68 pc
      sir: H.uzaklik(0.3789),                            // 2,639 pc
      para: H.paraUzakligi(0.02615, 0.7680665) / 1e3,    // 26,15 mm → ≈ 7,02 km
      gaia: H.goreliHata(0.03, 0.1), p1: H.iraklik(1), k0: H.kayma(0), k5: H.kayma(0.5)
    };
  });
  expect(r.ab).toBeCloseTo(206264.806, 2);
  expect(r.lyPc).toBeCloseTo(3.2616, 4);
  expect(r.prox).toBeCloseTo(1.30197, 4);
  expect(r.proxLy).toBeCloseTo(4.2465, 3);
  expect(r.bessel).toBeCloseTo(10.4, 1);
  expect(r.cyg).toBeCloseTo(3.4966, 3);
  expect(r.vega).toBeCloseTo(7.68, 2);
  expect(r.sir).toBeCloseTo(2.639, 3);
  expect(r.para).toBeCloseTo(7.02, 2);
  expect(r.gaia).toBeCloseTo(0.3, 9); expect(r.p1).toBe(1);
  expect(r.k0).toBeCloseTo(-1, 9); expect(r.k5).toBeCloseTo(1, 9);
});

test('Ön ayarlar ölçüm kutularını doğru yazar', async ({ page }) => {
  await ac(page);
  await expect(page.locator('#prP')).toHaveText('0,7681 yay saniyesi (768,1 mas)');
  await expect(page.locator('#prD')).toHaveText('1,302 parsek');
  await expect(page.locator('#prIy')).toHaveText('4,25 ışık yılı');
  await expect(page.locator('#prAb')).toHaveText('268.551 AB');
  await expect(page.locator('#prPara')).toHaveText('7,0 km öteden');
  await expect(page.locator('#prKim')).toHaveText('Yerden de ölçülür');
  await page.locator('#prOn button[data-i="1"]').click();
  await expect(page.locator('#prIy')).toHaveText('11,40 ışık yılı');
  await page.locator('#prOn button[data-i="2"]').click();
  await expect(page.locator('#prD')).toHaveText('2,639 parsek');
  await page.locator('#prOn button[data-i="4"]').click();
  await expect(page.locator('#prP')).toHaveText('0,100 miliyay saniyesi (mas)');
  await expect(page.locator('#prKim')).toHaveText('Gaia bile zorlanır (hata %20–30)');
  await expect(page.locator('#prIy')).toHaveText('32.616 ışık yılı');
});

test('Rehber: 1 parsekte p = 1″; Bessel değeri; 100 pc yer sınırı', async ({ page }) => {
  await ac(page);
  await page.locator('.rh-uygula[data-i="1"]').click();
  await expect(page.locator('#prP')).toHaveText('1,0000 yay saniyesi (1.000,0 mas)');
  await expect(page.locator('#prAb')).toHaveText('206.265 AB');
  await page.locator('.rh-uygula[data-i="3"]').click();
  await expect(page.locator('#prD')).toHaveText('3,189 parsek');
  await expect(page.locator('#prIy')).toHaveText('10,40 ışık yılı');
  await page.locator('.rh-uygula[data-i="4"]').click();
  await expect(page.locator('#prKim')).toHaveText('Yerden de ölçülür');
  await expect(page.locator('#prPara')).toHaveText('539 km öteden');
  await page.locator('#prUzak').fill('2.2');
  await expect(page.locator('#prKim')).toContainText('Yalnız uzaydan');
});

test('Azaltılmış harekette yılın zamanı kaydırıcısı var ve ay yazar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ac(page);
  await page.locator('#prZaman').fill('0.5');
  await expect(page.locator('#prZamanCikti')).toHaveText('6,0 ay');
});

test('320 px: yatay taşma yok', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await ac(page);
  for (const i of [0, 4]) {
    await page.locator(`#prOn button[data-i="${i}"]`).click();
    await page.waitForTimeout(100);
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(tasma, String(i)).toBeLessThanOrEqual(0);
  }
});
