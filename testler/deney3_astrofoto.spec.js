// Deney: Gökyüzü fotoğrafı (deney/astrofoto.js). Referans değerler kaynaklı: NASA Earth Fact Sheet (yıldız günü 23,9345 sa),
// PhotographyLife (500 kuralı örnekleri), Light Stalking / PetaPixel (basit NPF), Nikon Z6III, ders d24 ve çizimleri
// (d24-yildiz-kaymasi: 500 kuralı 4,2 px, 16 sn 3,2 px; d24-yiginlama: 14,1 / 6,3, kentte 5 kare).
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test('Hesaplar: kaynaklı referans değerleri', async ({ page }) => {
  await page.goto('/index.html#deney/astrofoto');
  await expect(page.locator('#afIz')).toBeVisible();
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.astrofoto;
    const ps = H.pikselOlcegi(43.27 * 0.8 / 4000, 24);
    return {
      hiz0: H.kaymaHizi(0), hiz41: H.kaymaHizi(41), hiz80: H.kaymaHizi(80), hiz90: H.kaymaHizi(90),
      ps,
      k20: H.kural500(20), k50: H.kural500(50), k24: H.kural500(24),
      iz500: H.kayma(500 / 24, 0, ps), iz16: H.kayma(16, 0, ps),
      t1: H.kSure(1, 0, ps), t41: H.kSure(1, 41, ps), t80: H.kSure(1, 80, ps),
      npf24: H.npf(2.8, 35.9 / 6048 * 1000, 24),
      psFF: H.pikselOlcegi(35.9 / 6048, 24),
      g9: H.yiginKazanc(9), g100: H.yiginKazanc(100),
      tekK: H.tekOran(400, 400), tekS: H.tekOran(400, 3600),
      kare: H.gerekenKare(H.tekOran(400, 400), H.tekOran(400, 3600)),
      kutup: H.kayma(3000, 89.35, ps), ekv: H.kayma(3000, 0, ps),
      ters: (() => { const q = H.izdusum(0.3, 0.5, 0.4); return H.tersIzdusum(q[0], q[1], 0.4); })()
    };
  });
  expect(r.hiz0).toBeCloseTo(15.04, 2);
  expect(r.hiz41).toBeCloseTo(11.35, 2);        // d24: 15,04 × 0,755
  expect(r.hiz80).toBeCloseTo(2.61, 2);
  expect(r.hiz90).toBeCloseTo(0, 9);
  expect(r.ps).toBeCloseTo(74.4, 1);            // d24: 74,4″
  expect(r.k20).toBe(25); expect(r.k50).toBe(10);
  expect(r.k24).toBeCloseTo(20.8, 1);
  expect(r.iz500).toBeCloseTo(4.2, 1);          // d24-yildiz-kaymasi
  expect(r.iz16).toBeCloseTo(3.2, 1);
  expect(r.t1).toBeCloseTo(4.9, 1);
  expect(r.t41).toBeCloseTo(6.6, 1);
  expect(Math.round(r.t80)).toBe(28);           // d24: yaklaşık 28 sn
  expect(r.npf24).toBeCloseTo(11.5, 1);
  expect(r.psFF).toBeCloseTo(51.0, 1);
  expect(r.g9).toBe(3); expect(r.g100).toBe(10);
  expect(r.tekK).toBeCloseTo(14.1, 1); expect(r.tekS).toBeCloseTo(6.3, 1);
  expect(Math.round(r.kare)).toBe(5);
  expect(r.kutup).toBeCloseTo(6.9, 1);          // d24: yaklaşık 7 piksel
  expect(Math.round(r.ekv)).toBe(607);          // d24: yaklaşık 607 piksel
  expect(r.ters[0]).toBeCloseTo(0.3, 9); expect(r.ters[1]).toBeCloseTo(0.5, 9);
});

test('Ön ayarlar ve rehber: telefon 3,2 px, 500 kuralı 4,2 px, aynasızda NPF 11,5 sn, kutupta 50 dk iz', async ({ page }) => {
  await page.goto('/index.html#deney/astrofoto');
  await page.locator('#afOn button[data-i="0"]').click();
  await expect(page.locator('#afOlcek')).toHaveText('74,4″ / piksel');
  await expect(page.locator('#af500')).toHaveText('20,8 sn (4,2 piksel iz)');
  await expect(page.locator('#afIz')).toHaveText('3,2 piksel (bir karede)');
  await expect(page.locator('#af1px')).toHaveText('4,9 sn');
  await expect(page.locator('#afNpf')).toHaveText('telefonda hesaplanmadı');
  await page.locator('.rh-uygula[data-i="1"]').click();
  await expect(page.locator('#afIz')).toHaveText('4,2 piksel (bir karede)');
  await page.locator('.rh-uygula[data-i="2"]').click();
  await expect(page.locator('#af1px')).toHaveText('28,5 sn');
  await page.locator('#afOn button[data-i="1"]').click();
  await expect(page.locator('#afNpf')).toHaveText('11,5 sn (f/2,8, 5,94 µm)');
  await expect(page.locator('#afIz')).toHaveText('6,1 piksel (bir karede)');
  await page.locator('#afDiyafram').selectOption('4');
  await expect(page.locator('#afNpf')).toHaveText('13,3 sn (f/4, 5,94 µm)');
  await page.locator('.rh-uygula[data-i="5"]').click();              // telefon, kent, 16 kare
  await expect(page.locator('#afSnr')).toHaveText('4,0 kat');
  await expect(page.locator('#afToplam')).toHaveText('4 dk 16 sn');
  await expect(page.locator('#afMetin')).toContainText('kentteki oran 25,3');
  await page.locator('#afOn button[data-i="3"]').click();            // kutup
  await expect(page.locator('#afIzli')).toBeChecked();
  await expect(page.locator('#afIz')).toHaveText('6,9 piksel (50 dk boyunca)');
  await expect(page.locator('#afSnr')).toHaveText('10,0 kat');
  await page.locator('.rh-uygula[data-i="7"]').click();
  await expect(page.locator('#afIz')).toHaveText('607 piksel (50 dk boyunca)');
  /* hizalayınca iz yine tek karelik olur */
  await page.locator('#afIzli').uncheck();
  await expect(page.locator('#afIz')).toHaveText('6,1 piksel (bir karede)');
});

test('Tema değişince yeniden çizer; 320 px\'te taşma yok, kanvas oranı sınırda', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/index.html#deney/astrofoto');
  await expect(page.locator('#deneyKap .olcumler')).toBeVisible();
  await page.locator('#afOn button[data-i="3"]').click();
  await page.evaluate(() => { document.documentElement.classList.add('kirmizi'); document.dispatchEvent(new Event('urania:tema')); });
  await page.waitForTimeout(200);
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(tasma).toBeLessThanOrEqual(0);
  const cv = await page.locator('#afKanvas').boundingBox();
  expect(cv.height / cv.width).toBeGreaterThanOrEqual(0.55);
  expect(cv.height / cv.width).toBeLessThanOrEqual(0.8);
});
