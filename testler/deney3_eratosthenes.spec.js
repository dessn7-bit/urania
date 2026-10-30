// Deney: Dünya'yı ölçmek (Eratosthenes). Saf hesaplar kaynaklı değerlerle, ön ayarlar ölçüm kutularıyla sınanır.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function ac(page) {
  await page.goto('/index.html#deney/eratosthenes');
  await expect(page.locator('#erCevre')).not.toHaveText('—');
}

test('Hesaplar: Kleomedes 7,2° ve 5000 stadion; d20 dersindeki örnekler; WGS 84 kutup çevresi', async ({ page }) => {
  await ac(page);
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.eratosthenes;
    return {
      kesir: 360 / H.merkezAci(0, 7.2),                                   // 1/50 (Wikipedia: Eratosthenes)
      stadion: H.cevre(7.2, 5000),                                        // 250.000 stadion
      c155: H.cevre(7.2, 5000) * 0.155,                                   // Paris Gözlemevi alt ucu: 38.750 km
      c252_155: 252000 * 0.155, c252_160: 252000 * 0.160,                 // d20: 39.060 ve 40.320 km
      hata155: H.hata(252000 * 0.155, 40007.863), hata160: H.hata(252000 * 0.160, 40007.863),   // −%2,4 ve +%0,8 (Wikipedia: Earth's circumference)
      kutup: 4 * H.meridyenYayi(0, 90, 6378137, 298.257223563) / 1e3,    // 40.007,863 km
      atDe: H.meridyenYayi(37.78333, 40.98333, 6378137, 298.257223563) / 1e3,
      golge: H.golge(45, 100), aci: H.golgeAcisi(100, 100), yari: H.yaricap(2 * Math.PI * 6371),
      sifir: H.cevre(0, 800)
    };
  });
  expect(r.kesir).toBeCloseTo(50, 9);
  expect(r.stadion).toBeCloseTo(250000, 6);
  expect(r.c155).toBeCloseTo(38750, 6);
  expect(r.c252_155).toBeCloseTo(39060, 6); expect(r.c252_160).toBeCloseTo(40320, 6);
  expect(r.hata155 * 100).toBeCloseTo(-2.4, 1); expect(r.hata160 * 100).toBeCloseTo(0.8, 1);
  expect(r.kutup).toBeCloseTo(40007.863, 2);
  expect(r.atDe).toBeCloseTo(355.27, 1);
  expect(r.golge).toBeCloseTo(100, 9); expect(r.aci).toBeCloseTo(45, 9); expect(r.yari).toBeCloseTo(6371, 6);
  expect(r.sifir).toBeNaN();
});

test('Ön ayarlar ve stadion seçimi ölçüm kutularını doğru yazar', async ({ page }) => {
  await ac(page);
  await expect(page.locator('#erAci')).toHaveText('7,20° (360° ÷ 50,0)');
  await expect(page.locator('#erCevre')).toHaveText('40.000 km (250.000 stadion)');
  await expect(page.locator('#erGercek')).toHaveText('40.008 km · 6.371 km');
  await expect(page.locator('#erHata')).toHaveText('%0,02 eksik');
  await page.locator('#erStad').selectOption('185');
  await expect(page.locator('#erUzakCikti')).toHaveText('925,0 km (5.000 stadion)');
  await expect(page.locator('#erCevre')).toHaveText('46.250 km (250.000 stadion)');
  await expect(page.locator('#erHata')).toHaveText('%15,6 fazla');
  await page.locator('#erOn button[data-i="1"]').click();
  await expect(page.locator('#erAci')).toHaveText('3,20° (360° ÷ 112,5)');
  await expect(page.locator('#erCevre')).toHaveText('39.968 km');
  await expect(page.locator('#erHata')).toHaveText('%0,10 eksik');
  await expect(page.locator('#erGolge')).toHaveText('77,5 cm · 86,9 cm');
  await page.locator('#erOn button[data-i="2"]').click();
  await expect(page.locator('#erAci')).toHaveText('7,11° (360° ÷ 50,6)');
  await expect(page.locator('#erCevre')).toHaveText('39.893 km');
});

test('Rehber: 0,1° yanılgı ~%3; eşit açılarda hesap yok', async ({ page }) => {
  await ac(page);
  await page.locator('.rh-uygula[data-i="5"]').click();
  await expect(page.locator('#erCevre')).toHaveText('38.757 km');
  await expect(page.locator('#erHata')).toHaveText('%3,13 eksik');
  await page.locator('.rh-uygula[data-i="6"]').click();
  await expect(page.locator('#erCevre')).toHaveText('hesaplanamaz');
  await expect(page.locator('#erMetin')).toContainText('aynı enlemde');
});

test('320 px: yatay taşma yok', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await ac(page);
  for (const i of [0, 1, 2]) {
    await page.locator(`#erOn button[data-i="${i}"]`).click();
    await page.waitForTimeout(100);
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(tasma, String(i)).toBeLessThanOrEqual(0);
  }
});
