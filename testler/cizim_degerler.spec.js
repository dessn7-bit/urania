'use strict';
/* Ders çizimlerinin bilimsel değerleri dersle aynı kalsın (denetim 2026-10-30, alan 3b):
   - d55-gelecek-takvimi: vakum bozunması 10¹⁶¹ yıl (%95 güvenle > 10⁶⁵), kara delik çağı 10⁴³–10¹⁰⁰,
     yıldızların sönmesi "güçlü kanıtlı" (ders d55 bölüm 8, 9, 12, 14).
   - d45-kutle-siniri: PSR J0348+0432 2024 değeri 1,806 ± 0,037 M☉ (ders d45 bölüm 9).
   - d56-schwarzschild-haritasi: Kruskal haritasında ışık yolları tam 45°, zamansı yollar 45°'den dik (|ΔT/ΔX| ≥ 1).
   - d11-gorus-alani: 6,4°'lik görüş alanı, 12,8 ≈ 13 dolunay (ders d11 bölüm 7).
   Çizimler gerçek sayfada yüklenir; ağ isteği atılmaz. */
const { test, expect } = require('@playwright/test');
const { disAgiKes } = require('./yardim');

async function cizimler(page) {
  await disAgiKes(page);
  await page.goto('/index.html#ders');
  await expect(page.locator('.ders-liste li').first()).toBeVisible();
  return page.evaluate(() => {
    const C = window.UraniaCizim, o = {};
    for (const id of ['d55-gelecek-takvimi', 'd45-kutle-siniri', 'd56-schwarzschild-haritasi', 'd11-gorus-alani', 'd43-siklik']) {
      const t = C.kayit[id], svg = C.svg(t);
      const kap = document.createElement('div'); kap.innerHTML = svg;
      o[id] = {
        aciklama: t.aciklama,
        yazilar: [...kap.querySelectorAll('text')].map(e => e.textContent),
        olcum: t.olcum || null,
        dunyaCizgileri: t.dunyaCizgileri || null,
        kaynak: (t.kaynak || []).map(k => k.url)
      };
    }
    return o;
  });
}

test('d55 uzak gelecek: vakum 10¹⁶¹ / 10⁶⁵, kara delik çağı 10⁴³, kesinlik basamakları dersle aynı', async ({ page }) => {
  const c = (await cizimler(page))['d55-gelecek-takvimi'];
  const yazi = c.yazilar.join(' | ');
  expect(yazi).toContain('10¹⁶¹ yıl: vakum bozunması');
  expect(yazi).toContain('10⁶⁵ yıl: vakum bozunması, %95 alt sınır');
  expect(yazi).toContain('10⁴³ yıl: kara delik çağı başlar');
  expect(yazi).not.toMatch(/10¹³⁹|10⁵⁸/);
  expect(c.aciklama).toContain('10 üzeri 161');
  expect(c.aciklama).toContain('10 üzeri 65');
  expect(c.aciklama).toContain('10 üzeri 43 ile 10 üzeri 100');
  expect(c.aciklama).not.toMatch(/10 üzeri (139|58)\b/);
  expect(c.aciklama).not.toContain('10 üzeri 40 ile 10 üzeri 100');
  /* kesinlik: yıldızların sönmesi güçlü kanıtlı, öbürleri kuram ya da hipotez */
  expect(yazi).toContain('Güçlü kanıtlı: yıldızların sönmesi');
  expect(yazi).toContain('Kuram ya da hipotez: proton, kara delik, vakum');
  expect(c.aciklama).toMatch(/sönmesi[^.]*güçlü kanıtlı/);
  /* kaynak: makalenin son sürümü */
  expect(c.kaynak).toContain('https://arxiv.org/pdf/1707.08124v4');
});

test('d45 kütle sınırı: J0348+0432 1,806 ± 0,037 (2024)', async ({ page }) => {
  const c = (await cizimler(page))['d45-kutle-siniri'];
  const j = c.olcum.find(x => /J0348/.test(x[3]));
  expect(j[0]).toBeCloseTo(1.806, 3);
  expect(j[1]).toBeCloseTo(1.806 - 0.037, 3);
  expect(j[2]).toBeCloseTo(1.806 + 0.037, 3);
  expect(c.yazilar.join(' | ')).toContain('J0348+0432: 1,806 ± 0,037 (2024)');
  expect(c.yazilar.join(' | ')).not.toContain('J0348+0432: 2,01');
  expect(c.aciklama).toContain('1,806 ± 0,037');
  expect(c.aciklama).toContain('çöktüğü düşünülüyor');
});

test('d56 Kruskal haritası: ışık 45°, zamansı yollar ışık konisinin içinde', async ({ page }) => {
  const dc = (await cizimler(page))['d56-schwarzschild-haritasi'].dunyaCizgileri;
  const egim = (p, q) => Math.abs((q[1] - p[1]) / (q[0] - p[0]));
  /* ufuklar: ışık yolu, eğim tam 1 */
  dc.ufuklar.forEach(([p, q]) => expect(egim(p, q)).toBeCloseTo(1, 9));
  /* beyaz delikten çıkan: zamansı, |ΔT/ΔX| > 1; III'te başlar (−√(1+X²) < T < −|X|), I'de biter (X > |T|) */
  const [w1, w2] = dc.beyazDelik;
  expect(egim(w1, w2)).toBeGreaterThan(1);
  expect(w1[1]).toBeLessThan(-Math.abs(w1[0]));
  expect(w1[1]).toBeGreaterThan(-Math.sqrt(1 + w1[0] * w1[0]));
  expect(w2[0]).toBeGreaterThan(Math.abs(w2[1]));
  expect(w2[1]).toBeGreaterThan(w1[1]);                 // gelecek yönünde
  /* düşen gözlemci: ikinci dereceden Bézier, teğet her yerde 45°'den dik; ok ucu da öyle */
  const [g1, g2, g3] = dc.gozlemci;
  let enAz = Infinity;
  for (let i = 0; i <= 200; i++) {
    const t = i / 200, dx = 2 * (1 - t) * (g2[0] - g1[0]) + 2 * t * (g3[0] - g2[0]), dy = 2 * (1 - t) * (g2[1] - g1[1]) + 2 * t * (g3[1] - g2[1]);
    expect(dy).toBeGreaterThan(0);                    // zaman hep ileri
    enAz = Math.min(enAz, Math.abs(dy / dx));
  }
  expect(enAz).toBeGreaterThan(1);
  expect(egim(dc.gozlemciOk, g3)).toBeGreaterThan(1);
  /* gözlemci tekillikte biter: T = √(1 + X²) */
  expect(g3[1]).toBeCloseTo(Math.sqrt(1 + g3[0] * g3[0]), 1);
});

test('d11 görüş alanı 6,4°, d43 Çelyabinsk başka tahminler 200–470 kt', async ({ page }) => {
  const c = await cizimler(page);
  const g = c['d11-gorus-alani'];
  expect(g.yazilar.join(' | ')).toContain('6,4°');
  expect(g.yazilar.join(' | ')).not.toMatch(/(^|\D)6°/);
  expect(g.aciklama).toContain('6,4');
  expect(g.aciklama).toContain('13 dolunay');
  expect(c['d43-siklik'].aciklama).toContain('200 ile 470 kiloton');
});
