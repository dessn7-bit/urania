'use strict';
/* Kırmızı mod ilk boyamada: uygulama betikleri hiç çalışmasa bile (yavaş ağ, ilk açılış) kabuk kırmızı/siyah çizilir.
   Dış istek yok: yerel sunucu dışındaki her istek kesilir. */
const { test, expect } = require('@playwright/test');

test('Kırmızı mod betikler yüklenmeden uygulanır; tarayıcı çubuğu siyah', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.route('**/uygulama.js', r => r.fulfill({ contentType: 'text/javascript', body: '' }));   // uygulama hiç başlamasın
  await page.addInitScript(() => localStorage.setItem('urania_kirmizi', 'true'));
  await page.goto('/index.html#gok');
  const d = await page.evaluate(() => ({
    sinif: document.documentElement.classList.contains('kirmizi'),
    zemin: getComputedStyle(document.body).backgroundColor,
    meta: document.querySelector('meta[name="theme-color"]').content
  }));
  expect(d).toEqual({ sinif: true, zemin: 'rgb(0, 0, 0)', meta: '#000000' });
});

test('Kırmızı mod kapalıyken ilk boyama normal tema', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.route('**/uygulama.js', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
  await page.goto('/index.html#gok');
  expect(await page.evaluate(() => document.documentElement.classList.contains('kirmizi'))).toBe(false);
});

for (const [an, beklenen] of [['2026-10-28T20:30:00+03:00', '2026-10-28'], ['2026-10-29T02:00:00+03:00', '2026-10-28']]) {
  test(`Gece kutusu canlı modda bu gecenin tarihini gösterir (${an})`, async ({ page }) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
    await page.clock.install({ time: new Date(an) });
    await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkTarih')).toHaveValue(beklenen);
    await page.locator('#gkTarih').fill('2026-11-05');
    await page.locator('#gkTarih').dispatchEvent('change');
    await expect(page.locator('#gkBuGece')).toBeVisible();
    await page.click('#gkSimdi');
    await expect(page.locator('#gkTarih')).toHaveValue(beklenen);
  });
}

test('Gökyüzü bölümleri ilk açılışta kapalı, başlıkta özet; açılınca liste görünür ve tercih saklanır', async ({ page }) => {
  await page.route('**/celestrak.org/**', r => r.abort());
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.clock.install({ time: new Date('2026-10-28T11:30:00+03:00') });
  await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkOzet_gezegen')).toContainText('Satürn');
  await expect(page.locator('#gkOzet_meteor')).toContainText('etkin:');
  await expect(page.locator('#gkOzet_olay')).toContainText('sıradaki: Algol en sönük · 7 Kasım');
  await expect(page.locator('#gkGezegen')).toBeHidden();
  await expect(page.locator('#gkPlan')).toBeVisible();   // plan hep açık
  const s = page.locator('details[data-kat="gezegen"] > summary');
  expect((await s.boundingBox()).height).toBeGreaterThanOrEqual(48);
  await s.click();
  await expect(page.locator('#gkGezegen li').first()).toBeVisible();
  await expect(page.locator('#gkOzet_gezegen')).toBeHidden();
  await page.reload();
  await expect(page.locator('#gkGezegen li').first()).toBeVisible();
  await expect(page.locator('#gkMeteor')).toBeHidden();
});

for (const [gen, yanyana] of [[551, true], [412, false], [320, false]]) {
  test(`Gece özeti etiketli satırlar (${gen} px): ekranda kısa veri, seste tam cümle, taşma yok`, async ({ page }) => {
    await page.setViewportSize({ width: gen, height: 900 });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
    await page.clock.install({ time: new Date('2026-10-28T19:30:00+03:00') });
    await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
    await page.goto('/index.html#gok');
    const p = page.locator('#gkOzet .oz-satir');
    await expect(p.first().locator('.oz-et')).toHaveText('Güneş');
    await expect(p.first()).toContainText('batış 18:05');
    expect(await p.first().getAttribute('data-ses')).toMatch(/^Güneş 18:05'te batıyor; gökyüzü \d\d:\d\d'de tam kararıyor/);
    await expect(p.nth(1).locator('.oz-et')).toHaveText('Ay');
    const d = await page.evaluate(() => {
      const s = document.querySelector('#gkOzet .oz-satir'), e = s.querySelector('.oz-et').getBoundingClientRect(), v = s.querySelector('.oz-d').getBoundingClientRect();
      return { yan: e.right < v.left && Math.abs(e.top - v.top) < 12, tasma: document.scrollingElement.scrollWidth - document.documentElement.clientWidth };
    });
    expect(d.yan).toBe(yanyana);
    expect(d.tasma).toBeLessThanOrEqual(0);
  });
}

/* Bu gece gözlem kararı: bulut verisine göre iyi / kötü; veri yoksa seviye söylenmez */
function havaSabit(bulut) {
  const t0 = Math.floor(new Date('2026-10-28T00:00:00Z').getTime() / 3600e3) * 3600;
  const time = Array.from({ length: 72 }, (_, i) => t0 + i * 3600), d = v => time.map(() => v);
  return { hourly: { time, cloud_cover: d(bulut), cloud_cover_low: d(bulut), cloud_cover_mid: d(0), cloud_cover_high: d(0), relative_humidity_2m: d(60), wind_speed_10m: d(5), precipitation_probability: d(0), precipitation: d(0) } };
}
for (const [bulut, beklenen] of [[5, 'iyi'], [95, 'kötü'], [null, null]]) {
  test(`Bu gece gözlem kararı (bulut ${bulut === null ? 'yok' : '%' + bulut})`, async ({ page }) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost|api\.open-meteo)/, r => r.abort());
    await page.route('**/api.open-meteo.com/**', r => bulut === null ? r.abort() : r.fulfill({ json: havaSabit(bulut) }));
    await page.clock.install({ time: new Date('2026-10-28T19:30:00+03:00') });
    await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
    await page.goto('/index.html#gok');
    const k = page.locator('#gkKarar');
    if (beklenen) {
      await expect(k.locator('.karar-et')).toHaveText(beklenen);
      await expect(k).toContainText('Ay %');
    } else {
      await expect(k).toContainText('bulut tahmini alınamadı');
      await expect(k.locator('.karar-et')).toHaveCount(0);
    }
  });
}

test('Haritada göster: levha o saate gelir, cisim işaretlenir; Şimdi işareti kaldırır', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.clock.install({ time: new Date('2026-10-28T19:30:00+03:00') });
  await page.addInitScript(() => { localStorage.setItem('urania_konumOto', 'false'); localStorage.setItem('urania_gokKat', '{"hedef":true}'); });
  await page.goto('/index.html#gok');
  const b = page.locator('#gkHedef .haritada').first();
  const z = Number(await b.getAttribute('data-zaman'));
  await b.click();
  const saat = new Date(Math.round(z / 300e3) * 300e3).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
  await expect(page.locator('#gkSaat')).toContainText(saat);
  const v = await page.evaluate(() => window.UraniaGozlem.durum.harita.yerlesim().vurgu);
  expect(v && v.r > 0).toBe(true);
  const ic = await page.evaluate(v => window.UraniaGozlem.durum.harita.yerlesim().etiketler.filter(e => e.x < v.x + v.r && e.x + e.w > v.x - v.r && e.y < v.y + v.r && e.y + e.h > v.y - v.r).map(e => e.metin), v);
  expect(ic).toEqual([]);   // halkanın üstüne ad yazılmaz
  await page.click('#gkSimdi');
  expect(await page.evaluate(() => window.UraniaGozlem.durum.harita.yerlesim().vurgu)).toBeFalsy();
});

test('Gök koşulu kaydırıcısı konum panelinde; değişince konum satırı güncellenir', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.clock.install({ time: new Date('2026-10-28T19:30:00+03:00') });
  await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkKonum')).toContainText('gök: banliyö');
  await expect(page.locator('#gkKadir')).toBeHidden();
  await page.click('#gkKonumDegis');
  await expect(page.locator('#gkKonumPanel #gkKadir')).toBeVisible();
  await page.locator('#gkKadir').evaluate(i => { i.value = '5.5'; i.dispatchEvent(new Event('input')); });
  await expect(page.locator('#gkKonum')).toContainText('gök: kırsal');
});

test('Kırmızı mod açıkken ekran açık tutulur, kapanınca bırakılır', async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.addInitScript(() => {
    window.__kilit = { istek: 0, birak: 0 };
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: () => { window.__kilit.istek++; return Promise.resolve({ released: false, release() { window.__kilit.birak++; this.released = true; return Promise.resolve(); } }); } } });
  });
  await page.goto('/index.html#gok');
  await page.click('#kirmiziDugme');
  await expect.poll(() => page.evaluate(() => window.__kilit.istek)).toBe(1);
  await page.click('#kirmiziDugme');
  await expect.poll(() => page.evaluate(() => window.__kilit.birak)).toBe(1);
});
