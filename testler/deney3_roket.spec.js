'use strict';
/* Roket denklemi deneyi (deney/roket.js): ders 23'ün çözümlü örnekleri, kaynaklı motor/araç değerleri, arayüz, dar ekran. */
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function ac(page) {
  await page.goto('/index.html#deney/roket');
  await expect(page.locator('#rkDv')).not.toHaveText('—');
}
const adim = async (page, metin) => {
  const i = await page.evaluate(m => [...document.querySelectorAll('.rehber-adim li')].findIndex(li => li.querySelector('.rh-yap').textContent.includes(m)), metin);
  expect(i, metin).toBeGreaterThanOrEqual(0);
  await page.locator(`.rh-uygula[data-i="${i}"]`).evaluate(b => b.click());
};

test('Hesaplar: ders 23 örnekleri ve kaynaklı değerler', async ({ page }) => {
  await ac(page);
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.roket, g0 = 9.80665;
    const isp45 = 4500 / g0;
    const ikiAsama = H.analiz([{ yakit: 67.08, kuru: 10, isp: isp45 }, { yakit: 14.85, kuru: 2, isp: isp45 }], 6.07, g0);
    const esit2 = H.analiz(H.esitAsamalar(100, 1.6, 2, 88.4 / 98.4, isp45), 1.6, g0);
    const esit = H.esitAsamalar(100, 2, 3, 0.9, 350);
    const f9 = H.analiz([{ yakit: 411, kuru: 22.2, isp: 296.5 }, { yakit: 107.5, kuru: 4, isp: 348 }], 22.8, g0);
    return {
      ve450: H.egzoz(450, g0),                                   // ders: ≈ 4413 m/s
      yakit97: H.yakitPayi(9700, 4500),                          // ders: %88,4
      oran97: H.kutleOrani(9700, 4500),                          // ders: ≈ 8,63
      yakit94: H.yakitPayi(9400, 3000),                          // ders: %95,6
      oran94: H.kutleOrani(9400, 3000),                          // ders: ≈ 23
      tek: H.analiz([{ yakit: 88.4, kuru: 10, isp: isp45 }], 1.6, g0).dv,
      iki: ikiAsama.dv, ikiD: ikiAsama.asama.map(s => s.dv), ikiYuk: ikiAsama.yukPayi,
      esit2: esit2.dv, esitToplam: esit.reduce((t, a) => t + a.yakit + a.kuru, 0) + 2,
      esitOran: esit.map((a, i) => { const m0 = esit.slice(i).reduce((t, x) => t + x.yakit + x.kuru, 0) + 2; return m0 / (m0 - a.yakit); }),
      f9: f9.dv, f9Kalkis: f9.kalkis,
      tekEsdeger: H.tekAsama([{ yakit: 67.08, kuru: 10, isp: isp45 }, { yakit: 14.85, kuru: 2, isp: isp45 }], 6.07, g0),
      yet: H.yetisilen(11.72, [{ kisa: 'LEO', dv_kms: 9.4 }, { kisa: 'GTO', dv_kms: 11.83 }]).map(h => h.kisa)
    };
  });
  expect(r.ve450).toBeCloseTo(4413, 0);
  expect(r.yakit97).toBeCloseTo(0.884, 3);
  expect(r.oran97).toBeCloseTo(8.63, 2);
  expect(r.yakit94).toBeCloseTo(0.956, 3);
  expect(r.oran94).toBeCloseTo(23, 0);
  expect(r.tek / 1e3).toBeCloseTo(9.69, 2);
  expect(r.iki / 1e3).toBeCloseTo(9.70, 2);
  expect(r.ikiD[0] / 1e3).toBeCloseTo(5.0, 2);
  expect(r.ikiD[1] / 1e3).toBeCloseTo(4.7, 2);
  expect(r.ikiYuk / 0.016).toBeCloseTo(3.8, 1);              // ders: "yaklaşık 4 kat", tam hesap 3,8
  expect(r.esit2 / 1e3).toBeCloseTo(13.82, 2);
  expect(r.esitToplam).toBeCloseTo(100, 9);
  expect(r.esitOran[0]).toBeCloseTo(r.esitOran[2], 9);        // kısıtlı aşamalandırma: oranlar eşit
  expect(r.f9 / 1e3).toBeCloseTo(9.25, 2);
  expect(r.f9Kalkis).toBeCloseTo(567.5, 6);
  expect(r.tekEsdeger / 1e3).toBeCloseTo(7.70, 2);
  expect(r.yet).toEqual(['LEO']);
});

test('Veri: kaynaklı motorlar ve hedefler; g₀ fizik.json\'dan', async ({ page }) => {
  await ac(page);
  const v = await page.evaluate(async () => {
    const j = await (await fetch('veri/deney/roket.json')).json(), f = await (await fetch('veri/fizik.json')).json();
    return { j, g0: f.sabitler.g0.deger };
  });
  expect(v.g0).toBe(9.80665);
  const isp = Object.fromEntries(v.j.veri.motorlar.map(m => [m.ad, m.isp]));
  expect(isp['Merlin 1D (yerde)']).toBe(282);                 // Wikipedia, Spaceflight101
  expect(isp['Merlin 1D (boşlukta)']).toBe(311);
  expect(isp['RS-25 (boşlukta)']).toBe(452);                  // L3Harris
  expect(isp['Katı yakıt (Mekik iticisi)']).toBe(268);        // Wikipedia (NASA sunumu)
  expect(isp['İyon (NSTAR)']).toBe(3100);                     // NASA/TM-2008-214988, Wikipedia
  expect(v.j.veri.hedefler.map(h => h.dv_kms)).toEqual([9.4, 11.83, 13.7, 15.33]);
  v.j.veri.motorlar.concat(v.j.veri.araclar).forEach(m => { expect(m.kaynaklar.length, m.ad).toBeGreaterThan(0); m.kaynaklar.forEach(k => expect(k.url).toMatch(/^https:\/\//)); });
});

test('Arayüz: araç ve motor düğmeleri, rehber adımları ölçümle aynı', async ({ page }) => {
  await ac(page);
  await expect(page.locator('#rkDv')).toHaveText('10,17 km/s');
  await page.locator('#rkArac button[data-i="0"]').click();
  await expect(page.locator('#rkDv')).toHaveText('9,69 km/s');
  await expect(page.locator('#rkYakit')).toHaveText('%88,4');
  await expect(page.locator('#rkOran')).toHaveText('8,62');
  await expect(page.locator('#rkArac button[data-i="0"]')).toHaveAttribute('aria-pressed', 'true');
  await adim(page, '306 s');
  await expect(page.locator('#rkDv')).toHaveText('9,40 km/s');
  await expect(page.locator('#rkYakit')).toHaveText('%95,6');
  await expect(page.locator('#rkOran')).toHaveText('22,96');
  await adim(page, 'Ders: iki aşama');
  await expect(page.locator('#rkAsamaDv')).toHaveText('5,00 + 4,70 km/s');
  await expect(page.locator('#rkYukPay')).toContainText('%6,1');
  await adim(page, 'sonra aşama sayısını 2');
  await expect(page.locator('#rkDv')).toHaveText('13,82 km/s');
  await expect(page.locator('#rkHedef')).toHaveText('LEO, GTO, Mars');
  await adim(page, 'Aşama sayısını 3');
  await expect(page.locator('#rkDv')).toHaveText('15,05 km/s');
  await adim(page, '“Falcon 9 benzeri” düğmesine');
  await expect(page.locator('#rkAsamaDv')).toHaveText('3,75 + 5,50 km/s');
  await expect(page.locator('#rkHedef')).toHaveText('hiçbiri (LEO\'ya 0,15 km/s eksik)');
  await expect(page.locator('#rkIspCikti')).toHaveText('297–348 s');
  await adim(page, '8,3 tona');
  await expect(page.locator('#rkDv')).toHaveText('11,72 km/s');
  await expect(page.locator('#rkOran')).toHaveText('3,89 · 9,74');
  await adim(page, 'NSTAR');
  await expect(page.locator('#rkDv')).toHaveText('88,16 km/s');
  await expect(page.locator('#rkHedef')).toContainText('yerden kalkamaz');
  await expect(page.locator('#rkMetin')).toContainText('92 mN');
  /* motor düğmesi: bütün aşamalara aynı Isp */
  await page.locator('#rkMotor button[data-i="2"]').click();
  await expect(page.locator('#rkIspCikti')).toHaveText('452 s');
  await expect(page.locator('#rkMotor button[data-i="2"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#rkArac button[aria-pressed="true"]')).toHaveCount(0);
});

test('Yük ağırlaşınca Δv azalır; tek aşamada metin iki aşamalı karşılığı verir', async ({ page }) => {
  await ac(page);
  await page.locator('#rkArac button[data-i="0"]').click();
  await expect(page.locator('#rkMetin')).toContainText('13,82 km/s olurdu');
  await page.locator('#rkYuk').evaluate(g => { g.value = Math.log10(5); g.dispatchEvent(new Event('input', { bubbles: true })); });
  await expect(page.locator('#rkYukCikti')).toHaveText('5,00 t');
  const dv = Number((await page.locator('#rkDv').textContent()).replace(/[^\d,]/g, '').replace(',', '.'));
  expect(dv).toBeLessThan(9.69);
});

test('320 px: yatay taşma yok, kanvas oranı sınırlar içinde', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await ac(page);
  for (const i of [0, 1, 2]) {
    await page.locator(`#rkArac button[data-i="${i}"]`).click();
    await page.waitForTimeout(100);
    const r = await page.evaluate(() => ({ tasma: document.documentElement.scrollWidth - document.documentElement.clientWidth, oran: (c => c.getBoundingClientRect().height / c.getBoundingClientRect().width)(document.querySelector('#rkKanvas')) }));
    expect(r.tasma).toBeLessThanOrEqual(0);
    expect(r.oran).toBeGreaterThanOrEqual(0.55);
    expect(r.oran).toBeLessThanOrEqual(0.8);
  }
});
