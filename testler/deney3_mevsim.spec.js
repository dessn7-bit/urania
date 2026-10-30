// Deney "mevsim" (Mevsimler ve Güneş'in yolu): saf hesaplar kaynaklı referans değerlerle, arayüz ve dar ekran.
// Referanslar: NASA Earth Fact Sheet (eğiklik 23,44°), USNO Seasons 2026 ve İstanbul gün doğumu/batımı (41,00° K, 29,08° D),
// JPL Horizons (günberi/günöte uzaklığı 2026), Wikipedia Arctic Circle (66°33′51″). Ayrıntı: arastirma/deney_v3/mevsim_kaynak.md
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function ac(page) {
  await page.goto('/index.html#deney/mevsim');
  await expect(page.locator('#msYuk')).not.toHaveText('—');
}

test('Mevsim hesapları: kaynaklı referans değerleri', async ({ page }) => {
  await ac(page);
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.mevsim, ut = 12 - 29.08 / 15, AU_KM = 149597870.7;
    const haz = H.gunHesap(172, 41, 23.44, ut), ara = H.gunHesap(355, 41, 23.44, ut), mar = H.gunHesap(79, 41, 23.44, ut);
    return {
      gunHaz: H.yilinGunu(6, 21), gunAra: H.yilinGunu(12, 21), tarih: H.tarih(307),
      dikHaz: haz.dik, dikAra: ara.dik, dikMar: mar.dik,
      ogleHaz: haz.ogle, ogleAra: ara.ogle,
      gunduzKHaz: haz.gunduzK, gunduzKAra: ara.gunduzK, gunduzHaz: haz.gunduz,
      enerjiOran: haz.enerji / ara.enerji,
      gunberiKm: H.gunes(H.D(3, 17.25)).R * AU_KM, gunoteKm: H.gunes(H.D(187, 17.5)).R * AU_KM,
      kutup: H.gunduz(66.56, 23.44, 0), kutupK: H.gunduz(66.56, 23.44, -0.833), kutupGece: H.gunduz(66.56, -23.44, 0),
      ekvator: H.gunduz(0, 23.44, 0), egiksiz: H.gunduz(41, 0, 0),
      gun0: H.gunduz(80, -23.44, -0.833), gun24: H.gunduz(80, 23.44, 0)
    };
  });
  expect(r.gunHaz).toBe(172); expect(r.gunAra).toBe(355); expect(r.tarih).toEqual({ ay: 11, gun: 3 });
  /* gündönümünde dik açıklık eğikliğe eşit (USNO: 21 Haziran 08.24 UT, 21 Aralık 20.50 UT; NASA 23,44°) */
  expect(Math.abs(r.dikHaz - 23.44)).toBeLessThan(0.01);
  expect(Math.abs(r.dikAra + 23.44)).toBeLessThan(0.01);
  expect(Math.abs(r.dikMar)).toBeLessThan(0.2);               // USNO: Mart ekinoksu 20 Mart 14.46 UT
  /* ders d1: İstanbul'da öğle Güneşi yazın ≈ 72,4°, kışın ≈ 25,6°; sin oranı ≈ 2,2 */
  expect(r.ogleHaz).toBeCloseTo(72.44, 1); expect(r.ogleAra).toBeCloseTo(25.56, 1);
  expect(r.enerjiOran).toBeCloseTo(2.2, 1);
  /* USNO İstanbul (41,00° K, 29,08° D): 21 Haziran 05.32–20.39, 21 Aralık 08.25–17.38 (dakikaya yuvarlı) */
  expect(Math.abs(r.gunduzKHaz - (15 + 7 / 60))).toBeLessThan(1.5 / 60);
  expect(Math.abs(r.gunduzKAra - (9 + 13 / 60))).toBeLessThan(1.5 / 60);
  /* timeanddate (ders d1): 21 Haziran gündüzü 15 sa 7 dk 50 sn */
  expect(Math.abs(r.gunduzKHaz - (15 + 7 / 60 + 50 / 3600))).toBeLessThan(1 / 60);
  /* kırılma ve disk payı gündüzü birkaç dakika uzatır */
  expect((r.gunduzKHaz - r.gunduzHaz) * 60).toBeGreaterThan(5);
  expect((r.gunduzKHaz - r.gunduzHaz) * 60).toBeLessThan(15);
  /* JPL Horizons: 2026 günberi 147.099.894 km (3 Ocak), günöte 152.087.774 km (6 Temmuz) */
  expect(Math.abs(r.gunberiKm - 147099894)).toBeLessThan(20000);
  expect(Math.abs(r.gunoteKm - 152087774)).toBeLessThan(20000);
  /* kutup dairesi: gündönümünde Güneş'in merkezi gece yarısı ufka değer */
  expect(r.kutup).toBeGreaterThan(23.98); expect(r.kutupK).toBe(24); expect(r.kutupGece).toBeLessThan(0.02);
  expect(r.ekvator).toBeCloseTo(12, 6); expect(r.egiksiz).toBeCloseTo(12, 6);
  expect(r.gun0).toBe(0); expect(r.gun24).toBe(24);
});

test('Mevsim arayüzü: hazır durumlar ve rehber adımı ölçümleri yazar', async ({ page }) => {
  await ac(page);
  await page.locator('#msOn button[data-i="0"]').click();
  await expect(page.locator('#msGunCikti')).toHaveText('21 Haziran');
  await expect(page.locator('#msYuk')).toHaveText('72,4° (güneyde)');
  await expect(page.locator('#msGunduz')).toHaveText('14 sa 57 dk');
  await expect(page.locator('#msGunduzK')).toHaveText('15 sa 8 dk');
  await expect(page.locator('#msDik')).toHaveText('+23,44°');
  await expect(page.locator('#msEnerji')).toHaveText('%95');
  await page.locator('#msOn button[data-i="1"]').click();
  await expect(page.locator('#msYuk')).toHaveText('25,6° (güneyde)');
  await expect(page.locator('#msGunduzK')).toHaveText('9 sa 13 dk');
  await expect(page.locator('#msEnerji')).toHaveText('%43');
  await page.locator('#msOn button[data-i="4"]').click();
  await expect(page.locator('#msGunduz')).toHaveText('12 sa 0 dk');
  await expect(page.locator('#msYuk')).toHaveText('49,0° (güneyde)');
  await expect(page.locator('#msMetin')).toContainText('mevsimler yok olur');
  /* rehber: 3 Ocak adımı; açıklamada günberi uzaklığı */
  await page.locator('.rh-uygula[data-i="2"]').evaluate(b => b.click());
  await expect(page.locator('#msYuk')).toHaveText('26,2° (güneyde)');
  await expect(page.locator('#msGunduz')).toHaveText('9 sa 9 dk');
  await expect(page.locator('#msMetin')).toContainText('147,1 milyon km');
  /* rehber: kutup dairesi */
  await page.locator('.rh-uygula[data-i="5"]').evaluate(b => b.click());
  await expect(page.locator('#msEnlemCikti')).toHaveText('66,56° K');
  await expect(page.locator('#msGunduz')).toHaveText('23 sa 59 dk');
  await expect(page.locator('#msGunduzK')).toHaveText('24 sa (Güneş batmıyor)');
  /* güney yarım kürede öğle Güneşi kuzeyde */
  await page.locator('#msEnlem').evaluate(g => { g.value = -34; g.dispatchEvent(new Event('input', { bubbles: true })); });
  await expect(page.locator('#msYuk')).toContainText('(kuzeyde)');
});

test('Mevsim: dar ekranda (320 px) yatay taşma yok; kırmızı modda çizer', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await ac(page);
  for (const i of [0, 3, 4]) {
    await page.locator(`#msOn button[data-i="${i}"]`).click();
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(tasma).toBeLessThanOrEqual(0);
  }
  const oran = await page.locator('#msKanvas').evaluate(c => c.getBoundingClientRect().height / c.getBoundingClientRect().width);
  expect(oran).toBeGreaterThanOrEqual(0.55); expect(oran).toBeLessThanOrEqual(0.8);
  await page.evaluate(() => { document.documentElement.classList.add('kirmizi'); document.dispatchEvent(new CustomEvent('urania:tema')); });
  await expect(page.locator('#msYuk')).not.toHaveText('—');
});
