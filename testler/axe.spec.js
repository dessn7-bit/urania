'use strict';
/* v49 erişilebilirlik: @axe-core/playwright her sekmede (Gökyüzü, Deneyler, Dersler + bir ders, Defter, Hesap, Haberler),
   normal ve kırmızı modda. Etiketler: WCAG 2.0/2.1/2.2 A ve AA. İlk koşunun bulguları ve kararlar: arastirma/kalite_v49.md.
   Ağa çıkılmaz. */
const { test, expect } = require('@playwright/test');
const { default: AxeBuilder } = require('@axe-core/playwright');
const { disAgiKes, celestrak, havaSessiz } = require('./yardim');

/* Gerekçeli istisnalar (arastirma/kalite_v49.md "axe"): kural kimliği → gerekçe. Boş tutulması hedeflenir. */
const ISTISNA = {};

const SEKMELER = [['gok', '#b-gok h1'], ['deney', '#b-deney h1'], ['ders', '#b-ders h1'], ['ders/d10', '#b-ders h1'], ['defter', '#b-defter h1'], ['hesap', '#b-hesap h1'], ['haber', '#b-haber h1']];

async function kur(page, kirmizi) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await celestrak(page, { hata: 503 });
  await havaSessiz(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: {} }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: [] }));
  await page.addInitScript(k => {
    localStorage.setItem('urania_konumOto', 'false');
    if (k) localStorage.setItem('urania_kirmizi', 'true');
  }, kirmizi);
  await page.clock.install({ time: new Date('2026-11-10T21:00:00+03:00') });
}

for (const kirmizi of [false, true]) {
  for (const [sekme, baslik] of SEKMELER) {
    test(`axe: #${sekme}${kirmizi ? ' (kırmızı mod)' : ''} — WCAG A/AA ihlali yok`, async ({ page }) => {
      test.setTimeout(60000);
      await kur(page, kirmizi);
      await page.goto('/index.html#' + sekme);
      await expect(page.locator(baslik)).toBeVisible({ timeout: 20000 });
      await page.waitForTimeout(1500);   // geç gelen içerik (listeler, kartlar) yerleşsin
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).disableRules(Object.keys(ISTISNA)).analyze();
      const ozet = r.violations.map(v => `${v.id} (${v.impact}, ${v.nodes.length} öğe): ${v.help} — ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`);
      expect(ozet, ozet.join('\n')).toEqual([]);
      expect(page.hatalar).toEqual([]);
    });
  }
}
