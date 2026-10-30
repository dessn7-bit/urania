'use strict';
/* Mars'a yolculuk deneyi (deney/hohmann.js): Hohmann aktarımı, faz açısı, sinodik dönem, Güneş'e göre Δv, ıskalama. */
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function ac(page) {
  await page.goto('/index.html#deney/hohmann');
  await expect(page.locator('#hmSure')).not.toHaveText('—');
}

test('Hesaplar: ders 23 (259 gün, 44°), NASA (779,935 gün), Wikipedia (Δv tablosu)', async ({ page }) => {
  await ac(page);
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.hohmann, GM = 1.3271244e20, GMe = 3.986004e14, D = 86400;
    const yer = 149.598e9, out = {};
    for (const [ad, a, P] of [['venus', 108.210e9, 224.701], ['mars', 227.956e9, 686.980], ['jup', 778.479e9, 4332.589]]) {
      const A = H.aktarim(yer, a, GM);
      out[ad] = { gun: A.t / D, faz: H.fazAcisi(A.t / D, P), sin: H.sinodik(365.256, P), dv1: A.dv1 / 1e3, dv2: Math.abs(A.dv2) / 1e3,
        leo: H.yorungedenAtesleme(Math.abs(A.dv1), GMe, 6371e3 + 300e3) / 1e3 };
    }
    const k0 = H.elipsKonum(yer, 227.956e9, 0), k1 = H.elipsKonum(yer, 227.956e9, 1), v0 = H.elipsKonum(yer, 108.210e9, 0), v1 = H.elipsKonum(yer, 108.210e9, 1);
    out.konum = [k0.r / yer, k0.aci, k1.r / 227.956e9, k1.aci, v0.r / yer, v0.aci % (2 * Math.PI), v1.r / 108.210e9, v1.aci % (2 * Math.PI)];
    out.iska = H.iska(227.956e9, 30, 365.256, 686.980);
    return out;
  });
  expect(r.mars.gun).toBeCloseTo(259, 0);                     // ders 23 örneği
  expect(r.mars.faz).toBeCloseTo(44.3, 1);                    // cizim_v3 d23-hohmann: ≈ 44°
  expect(r.mars.sin).toBeCloseTo(779.935, 1);                 // NASA/TM-2010-216764
  expect(r.mars.dv1).toBeCloseTo(2.929, 1);                   // Wikipedia Hohmann tablosu (yuvarlanmış yarıçaplarla)
  expect(r.mars.leo).toBeCloseTo(3.590, 2);                   // Wikipedia: LEO sütunu
  expect(r.mars.dv2).toBeCloseTo(2.65, 2);
  expect(r.jup.dv1).toBeCloseTo(8.792, 2);                    // Wikipedia
  expect(r.jup.leo).toBeCloseTo(6.301, 2);
  expect(r.jup.sin).toBeCloseTo(398.88, 1);                   // ders 3: 398,88 gün
  expect(Math.abs(r.venus.dv1 + 2.532)).toBeLessThan(0.05);   // Wikipedia 2,532 (0,72 AB ile); burada 2,50
  expect(r.venus.faz).toBeCloseTo(-54.0, 1);
  expect(r.venus.sin / (365.25 / 12)).toBeCloseTo(19.2, 1);   // ders 23: Venüs ~19 ayda bir
  r.konum.forEach((x, i) => expect(x, 'konum ' + i).toBeCloseTo([1, 0, 1, Math.PI, 1, 0, 1, Math.PI][i], 6));
  expect(r.iska.aci).toBeCloseTo(-13.85, 2);
  expect(r.iska.uzaklik / 1e9).toBeCloseTo(55.0, 1);
});

test('Arayüz: Mars ölçümleri, gezegen düğmeleri, rehber adımları', async ({ page }) => {
  await ac(page);
  await expect(page.locator('#hmSure')).toHaveText('258,9 gün (8,5 ay)');
  await expect(page.locator('#hmFaz')).toHaveText('Mars 44,3° önde');
  await expect(page.locator('#hmSinodik')).toHaveText('779,9 gün (25,6 ay)');
  await expect(page.locator('#hmDv1')).toHaveText('+2,95 km/s');
  await expect(page.locator('#hmDv2')).toHaveText('2,65 km/s');
  await expect(page.locator('#hmLeo')).toHaveText('3,59 km/s');
  await expect(page.locator('#hmIska')).toHaveText('0 km (tam isabet)');
  await page.locator('.rh-uygula[data-i="1"]').evaluate(b => b.click());
  await expect(page.locator('#hmGecikmeCikti')).toHaveText('+30 gün (geç)');
  await expect(page.locator('#hmIska')).toHaveText('55,0 milyon km (0,37 AB)');
  await expect(page.locator('#hmMetin')).toContainText('13,8° gerisinde (henüz gelmemiş)');
  await page.locator('.rh-uygula[data-i="2"]').evaluate(b => b.click());
  await expect(page.locator('#hmMetin')).toContainText('13,8° ötesinde (çoktan geçmiş)');
  await page.locator('#hmHedef button[data-i="0"]').click();
  await expect(page.locator('#hmHedef button[data-i="0"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.rh-uygula[data-i="5"]').evaluate(b => b.click());
  await expect(page.locator('#hmSure')).toHaveText('146,1 gün (4,8 ay)');
  await expect(page.locator('#hmFaz')).toHaveText('Venüs 54,0° geride');
  await expect(page.locator('#hmDv1')).toHaveText('−2,50 km/s (yavaşla)');
  await expect(page.locator('#hmMetin')).toContainText('Venüs\'ün de orada');
  await page.locator('.rh-uygula[data-i="6"]').evaluate(b => b.click());
  await expect(page.locator('#hmSure')).toHaveText('997,7 gün (2,73 yıl)');
  await expect(page.locator('#hmFaz')).toHaveText('Jüpiter 97,1° önde');
  await expect(page.locator('#hmSinodik')).toHaveText('398,9 gün (13,1 ay)');
  await expect(page.locator('#hmDv1')).toHaveText('+8,79 km/s');
});

test('Mars fırlatma fırsatları kaynaklı tarihlerle (NASA) yazılır', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-30T12:00:00+03:00') });
  await ac(page);
  await expect(page.locator('#hmMetin')).toContainText('31 Ekim 2026 (varış 19 Ağustos 2027, 292 gün) ve 2 Aralık 2028 (varış 16 Ekim 2029, 318 gün)');
});

test('Azaltılmış harekette elle zaman kaydırıcısı var ve çizim çalışır', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ac(page);
  await expect(page.locator('#hmZaman')).toBeAttached();
  await page.locator('#hmZaman').evaluate(g => { g.value = 0.5; g.dispatchEvent(new Event('input', { bubbles: true })); });
  await expect(page.locator('#hmZamanCikti')).toHaveText('%50');
});

test('320 px: yatay taşma yok, kanvas oranı sınırlar içinde', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await ac(page);
  for (const i of [0, 1, 2]) {
    await page.locator(`#hmHedef button[data-i="${i}"]`).click();
    await page.waitForTimeout(100);
    const r = await page.evaluate(() => ({ tasma: document.documentElement.scrollWidth - document.documentElement.clientWidth, oran: (c => c.getBoundingClientRect().height / c.getBoundingClientRect().width)(document.querySelector('#hmKanvas')) }));
    expect(r.tasma).toBeLessThanOrEqual(0);
    expect(r.oran).toBeGreaterThanOrEqual(0.55);
    expect(r.oran).toBeLessThanOrEqual(0.8);
  }
});
