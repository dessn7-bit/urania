'use strict';
/* "Gökyüzüne bak" (AR) testleri. Yön olayları W3C DeviceOrientation anlamıyla üretilir:
   β=90° telefon dik (arka kamera ufka bakar), α saat yönünün TERSİNE artar (α=90° → batı).
   Pusula manyetik kuzeye göre kabul edilir; Kadıköy için WMM-2025 sapması +6,08° (NOAA
   hesaplayıcısıyla aynı: ngdc.noaa.gov/geomag-web, 2026-10-27) eklenir. */
const { test, expect } = require('@playwright/test');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');

async function yonVer(page, alpha, beta, gamma) {
  await page.evaluate(([a, b, g]) => {
    for (let i = 0; i < 60; i++) {
      /* Android Chrome 'deviceorientationabsolute' yollar; masaüstü Chromium'da o özellik
         olmadığından aynı veri absolute:true ile 'deviceorientation' olarak da yollanır. */
      const tur = ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation';
      window.dispatchEvent(new DeviceOrientationEvent(tur, { alpha: a, beta: b, gamma: g, absolute: true }));
    }
  }, [alpha, beta, gamma]);
  await page.waitForTimeout(150);
}

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  await page.clock.install({ time: SABIT_AN });
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test('Dik tutulan telefon manyetik kuzeye bakınca gerçek yön ≈ 6° K, yükseklik 0°', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await yonVer(page, 0, 90, 0);
  await expect(page.locator('#arMerkez .ar-yon')).toHaveText('6° K · yükseklik 0°');
});

test('α=90° (manyetik batı) → ≈ 276° B; β=135° → 45° yükseklik', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await yonVer(page, 90, 135, 0);
  await expect(page.locator('#arMerkez .ar-yon')).toHaveText('276° B · yükseklik 45°');
});

test('Satürn\'e doğrultulunca nişangâhta Satürn görünür', async ({ page }) => {
  /* 21:00'de Satürn: yükseklik 39,47°, azimut 132,52° (gok.js; Astronomy Engine).
     başlık = 360 − (α − sapma) → α = sapma − azimut */
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await yonVer(page, ((6.08 - 132.52) % 360 + 360) % 360, 90 + 39.47, 0);
  await expect(page.locator('#arMerkez b')).toHaveText('Satürn');
});

test('Algılayıcı yoksa sürükleme moduna geçer ve sürükleyince yön değişir', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(1900);
  await expect(page.locator('#arDurum')).toContainText('sürükle');
  const once = await page.locator('#arMerkez .ar-yon').innerText();
  const kv = page.locator('#arKanvas');
  const b = await kv.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2 + 150, b.y + b.height / 2 + 60, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('#arMerkez .ar-yon')).not.toHaveText(once);
});

test('Bul: Satürn seçilince şerit görünür; sürükleme modunda görüş Satürn\'e döner', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(1900);
  await page.locator('#arBul').click();
  await page.locator('#arAra').fill('sat');
  await page.locator('#arSonuc button', { hasText: 'Satürn' }).click();
  await expect(page.locator('#arHedefSerit')).toBeVisible();
  await expect(page.locator('#arMerkez b')).toHaveText('Satürn');
});

test('Hizala: nişangâhtaki fark düzeltilir', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  /* Pusula 10° şaşmış olsun: telefon aslında Ay'a bakıyor ama α 10° kaymış */
  const ay = await page.evaluate(() => { const c = window.UraniaAR.st.nesneler.cisimler.find(x => x.id === 'Moon'); return { alt: c.alt, az: c.az }; });
  const alfa = ((6.08 - ay.az + 10) % 360 + 360) % 360;
  await yonVer(page, alfa, 90 + ay.alt, 0);
  await expect(page.locator('#arMerkez b')).not.toHaveText('Ay');
  await page.locator('#arHizalaDugme').click();
  await expect(page.locator('#arHizalaMetin')).toContainText('Ay');
  await page.locator('#arOrtaladim').click();
  await yonVer(page, alfa, 90 + ay.alt, 0);
  await expect(page.locator('#arMerkez b')).toHaveText('Ay');
});

test('Kapatınca gökyüzü sekmesine döner ve üst menü geri gelir', async ({ page }) => {
  await page.goto('/index.html#gok');
  await page.locator('.ar-giris').click();
  await expect(page.locator('body')).toHaveClass(/ar-acik/);
  await page.locator('.ar-kapat').click();
  await expect(page.locator('body')).not.toHaveClass(/ar-acik/);
  await expect(page.locator('.ust')).toBeVisible();
});

test('Bul: aranan cisme yön tarifi verilir', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  /* Doğu ufkuna bak (gerçek azimut 90°, yükseklik 0°) */
  await yonVer(page, ((6.08 - 90) % 360 + 360) % 360, 90, 0);
  await page.locator('#arBul').click();
  await page.locator('#arAra').fill('satürn');
  await page.locator('#arSonuc button', { hasText: 'Satürn' }).click();
  /* Satürn 132,5° / 39,5°: sağa ≈ 43°, yukarı ≈ 39° */
  await expect(page.locator('#arTarif')).toHaveText(/sağa 4[23]°, yukarı (39|40)°/);
});
