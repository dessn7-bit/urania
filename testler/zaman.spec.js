'use strict';
/* Zaman uç durumları (2. hata avı): yaz saati geçişi, yanlış cihaz saati, geçmiş tarih, konum dilimi.
   Ağ isteği atılmaz: dış istekler sahte yanıtla ya da kesilerek karşılanır. */
const { test, expect } = require('@playwright/test');
const { ISTASYON, SON30 } = require('./yardim');
const G = require('../gok.js');

test('Meteor takvimi geçmişe de uzar: 1950 Perseid zirvesi ve etkinliği', () => {
  const v = require('../veri/meteor.json');
  const ls = G.meteorTakvimi(v, new Date('1950-08-12T20:00Z'));
  const per = ls.find(m => m.kod === 'PER' && m.zirve_utc.startsWith('1950'));
  expect(per).toBeTruthy();
  expect(per.zirve_utc.slice(0, 10)).toMatch(/1950-08-1[23]/);
  expect(G.aktifMi(per, new Date('1950-08-12T20:00Z'))).toBe(true);
});

test('Meteor etkinlik sınırı UT: cihaz diliminden bağımsız', () => {
  const m = { baslangic: '2026-12-28', bitis: '2027-01-12' };
  expect(G.aktifMi(m, new Date('2026-12-27T19:30:00Z'))).toBe(false);   // İstanbul 22:30, 27 Aralık
  expect(G.aktifMi(m, new Date('2026-12-28T00:30:00Z'))).toBe(true);
});

test.describe('Londra yaz saati', () => {
  test.use({ timezoneId: 'Europe/London' });
  test('Leitner aralığı takvim günüyle: geri dönüş haftasında 3 gün sonra, bir gün erken değil', async ({ page }) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
    await page.clock.install({ time: new Date('2026-10-24T10:00:00Z') });
    await page.goto('/index.html#ders');
    const z = await page.evaluate(() => {
      localStorage.setItem('urania_kartlar', JSON.stringify({ k1: { k: 1, z: 0, s: 0 } }));
      return Kartlar.cevapla('k1', true, Date.now()).z;
    });
    const d = await page.evaluate(z => { const x = new Date(z); return [x.getDate(), x.getHours()]; }, z);
    expect(d).toEqual([27, 0]);
  });
});

test('Cihaz saati ileri gidip düzeltilince "gelecekte alınmış" önbellek yenilenir; kart kayıtları yeni sayılır', async ({ page }) => {
  let istek = 0;
  await page.route('**/celestrak.org/**', r => { istek++; const u = r.request().url(); return r.fulfill({ json: /stations/.test(u) ? ISTASYON : SON30 }); });
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await page.route('**/nominatim.openstreetmap.org/**', r => r.abort());
  await page.clock.install({ time: new Date('2026-10-27T18:00:00Z') });
  const gelecek = new Date('2031-01-01T00:00:00Z').getTime();
  await page.addInitScript(g => {
    if (sessionStorage.getItem('z_kuruldu')) return; sessionStorage.setItem('z_kuruldu', '1');
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_gp_istasyon', JSON.stringify({ alindi: g, ls: [] }));
    localStorage.setItem('urania_gp_dizi_hata', String(g));
    localStorage.setItem('urania_kartlar', JSON.stringify({ d1s0: { k: 3, z: g, s: g } }));
  }, gelecek);
  await page.goto('/index.html#gok');
  await expect.poll(() => istek).toBeGreaterThanOrEqual(2);
  await expect(page.locator('#gkIss')).not.toContainText('alınamadı');
  const bugun = await page.evaluate(async () => { const D = await Urania.veri('dersler'); return Kartlar.bugunku(D, true).some(k => k.id === 'd1s0'); });
  expect(bugun).toBe(true);
});

test('Cihaz saati yörünge verisinden çok uzaksa geçişler gösterilmez, neden söylenir', async ({ page }) => {
  await page.route('**/celestrak.org/**', r => { const u = r.request().url(); return r.fulfill({ json: /stations/.test(u) ? ISTASYON : SON30 }); });
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await page.route('**/nominatim.openstreetmap.org/**', r => r.abort());
  await page.clock.install({ time: new Date('2031-10-28T18:00:00Z') });
  await page.addInitScript(() => { localStorage.setItem('urania_konumOto', 'false'); });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkIss')).toContainText('güncel değil');
});
