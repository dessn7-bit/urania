// Deney: Dürbün ve teleskop (deney/durbun.js). Referans değerler kaynaklı: Nikon Action EX belgesi, Wikipedia (Exit pupil,
// Dawes' limit, Bortle scale), Astronomics, Sky & Telescope; ders d11 ve d12'deki örnek hesaplar.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test('Hesaplar: kaynaklı referans değerleri', async ({ page }) => {
  await page.goto('/index.html#deney/durbun');
  await expect(page.locator('#dbSinir')).toBeVisible();
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.durbun;
    return {
      isik50: H.isikOrani(50, 7),                 // d11: (50/7)² ≈ 51
      isik200: H.isikOrani(200, 7),               // d12: ≈ 816
      kadir51: H.kadirFarki(51),                  // d11: ≈ 4,3
      cikis750: H.cikis(50, 7),                   // Wikipedia Exit pupil: 7,14 mm
      gorunur7: H.gorunurAlan(6.4, 7),            // Nikon Action EX 7×50: 42,7°
      gorunur10: H.gorunurAlan(6.5, 10),          // Nikon Action EX 10×50: 59,2°
      gercekGeri: H.gercekAlan(H.gorunurAlan(6.4, 7), 7),
      kaba: H.kabaAlan(50, 40),                   // d12: 1,25°
      etkin: H.etkinCap(50, 7, 5.8),              // d11: 7 × 5,8 ≈ 41 mm
      bosa: H.bosa(50, 7, 5.8),
      ray100: H.rayleigh(100),                    // d12: 138 / 100 ≈ 1,38″
      dawes100: H.dawes(100),                     // Wikipedia: 4,56 / D (inç) → 100 mm ≈ 1,16″
      goz7: H.gozSiniri(7),                       // d12: 60 / 7 ≈ 8,6″
      astro200: H.astronomics(200),               // Astronomics 7,5 + 5 log 20 ≈ 14,0 (d12: "yaklaşık 14")
      sinir750: H.sinirKadir(6.8, 50, 7, 7, 7),   // 6,8 + 2,5 log((49/7)²)
      ciplak: H.sinirKadir(6.8, 7, 1, 7, 7),
      tam: [H.tamlik([[0.75, 14.2], [1.1, 12.5], [3.6, 11.2], [4, 7]], 0.5), H.tamlik([[0.75, 14.2], [1.1, 12.5], [3.6, 11.2], [4, 7]], 3.2), H.tamlik([[0.75, 14.2], [1.1, 12.5], [3.6, 11.2], [4, 7]], 3.9)]
    };
  });
  expect(r.isik50).toBeCloseTo(51.0, 0);
  expect(Math.round(r.isik200)).toBe(816);
  expect(r.kadir51).toBeCloseTo(4.27, 2);
  expect(r.cikis750).toBeCloseTo(7.14, 2);
  expect(Math.abs(r.gorunur7 - 42.7)).toBeLessThan(0.05);
  expect(Math.abs(r.gorunur10 - 59.2)).toBeLessThan(0.1);
  expect(r.gercekGeri).toBeCloseTo(6.4, 9);
  expect(r.kaba).toBeCloseTo(1.25, 9);
  expect(r.etkin).toBeCloseTo(40.6, 6);
  expect(r.bosa).toBeCloseTo(1 - Math.pow(5.8 / (50 / 7), 2), 9);
  expect(r.ray100).toBeCloseTo(1.38, 2);
  expect(r.dawes100).toBeCloseTo(1.16, 2);
  expect(r.goz7).toBeCloseTo(8.57, 2);
  expect(r.astro200).toBeCloseTo(14.0, 1);
  expect(r.sinir750).toBeCloseTo(6.8 + 5 * Math.log10(7), 9);
  expect(r.ciplak).toBeCloseTo(6.8, 9);
  expect(r.tam).toEqual([14.2, 11.2, 7]);
});

test('Veri: yıldızlar kaynaklı, Ülker ve kemer dolu; ön ayarlar belgedeki alanı verir', async ({ page, request }) => {
  const j = await (await request.get('/veri/deney/durbun.json')).json();
  const v = j.veri;
  expect(v.hedefler.map(h => h.id)).toEqual(['ulker', 'kemer']);
  v.hedefler.forEach(h => { expect(h.y.length % 3).toBe(0); expect(h.y.length / 3).toBeGreaterThan(1000); });
  /* Ülker'in en parlağı Alcyone (uygulamanın kataloğunda 2,85 kadir) listede ilk */
  expect(v.hedefler[0].y[2]).toBe(29);
  expect(v.onayarlar[1]).toMatchObject({ D: 50, M: 7, gercekAlan: 6.4 });
  expect(v.onayarlar[2]).toMatchObject({ D: 50, M: 10, gercekAlan: 6.5 });
  expect(v.gok.map(g => g.nelm)).toEqual([6.8, 5.8, 4.3]);
  expect(JSON.stringify(j)).not.toMatch(/openstax|ck12/i);
});

test('Ön ayarlar ve rehber: 7×50 alanı 6,40°, kentte sınır 8,5; teleskop Ülker\'i almaz', async ({ page }) => {
  await page.goto('/index.html#deney/durbun');
  await page.locator('#dbOn button[data-i="1"]').click();
  await expect(page.locator('#dbAlan')).toHaveText('6,40°');
  await expect(page.locator('#dbCikis')).toHaveText('7,14 mm · %4 boşa');
  await expect(page.locator('#dbSinir')).toHaveText('11,0 kadir');
  await expect(page.locator('#dbIsik')).toHaveText('51 kat (4,3 kadir)');
  await expect(page.locator('#dbAyirma')).toHaveText('8,6″ (göz)');
  await expect(page.locator('#dbSigar')).toHaveText('Evet: 1,83° / 6,40°');
  await page.locator('#dbGok').selectOption('kent');
  await expect(page.locator('#dbSinir')).toHaveText('8,5 kadir');
  await page.locator('.rh-uygula[data-i="3"]').click();              // 50 yaş göz bebeği
  await expect(page.locator('#dbCikis')).toHaveText('7,14 mm · %34 boşa');
  await expect(page.locator('#dbSinir')).toHaveText('10,6 kadir');
  await page.locator('.rh-uygula[data-i="5"]').click();              // 80 mm, 40×
  await expect(page.locator('#dbAlan')).toHaveText('1,34°');
  await expect(page.locator('#dbSigar')).toHaveText('Hayır: 1,83° / 1,34°');
  await expect(page.locator('#dbAyirma')).toHaveText('1,7″ (kırınım)');
  await page.locator('.rh-uygula[data-i="7"]').click();              // kemer
  await expect(page.locator('#dbSigar')).toHaveText('Evet: 2,74° / 6,40°');
  /* çıplak göz: göz merceği yok, alan çizimde 8° */
  await page.locator('#dbOn button[data-i="0"]').click();
  await expect(page.locator('#dbCikis')).toHaveText('— (göz merceği yok)');
  await expect(page.locator('#dbAlan')).toHaveText('çok geniş (çizimde 8°)');
  /* elle kaydırınca ön ayar düğmesinin seçimi kalkar */
  await page.locator('#dbM').fill('1.5');
  await expect(page.locator('#dbOn button[aria-pressed="true"]')).toHaveCount(0);
  await expect(page.locator('#dbMCikti')).toHaveText('32×');
});

test('Veri sınırı uyarısı: geniş alanda teleskop sınırı katalogdan sönükse yazılır', async ({ page }) => {
  await page.goto('/index.html#deney/durbun');
  /* 200 mm, 10×, 50° → 5° alan, karanlık gökte ~14 kadir: veri 11,2'de bitiyor */
  await page.locator('#dbD').fill('2.30103');
  await page.locator('#dbM').fill('1');
  await page.locator('#dbAfov').fill('50');
  await expect(page.locator('#dbSayi')).toContainText('veri 11,2 kadirde bitiyor');
  await expect(page.locator('#dbMetin')).toContainText('11,2 kadirde bitiyor');
});

test('Tema değişince yeniden çizer; 320 px\'te taşma yok', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/index.html#deney/durbun');
  await expect(page.locator('#deneyKap .olcumler')).toBeVisible();
  await page.evaluate(() => { document.documentElement.classList.add('kirmizi'); document.dispatchEvent(new Event('urania:tema')); });
  await page.waitForTimeout(200);
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(tasma).toBeLessThanOrEqual(0);
  const cv = await page.locator('#dbKanvas').boundingBox();
  expect(cv.width).toBeLessThanOrEqual(320);
  expect(cv.height / cv.width).toBeGreaterThanOrEqual(0.55);
  expect(cv.height / cv.width).toBeLessThanOrEqual(0.8);
});
