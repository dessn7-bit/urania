'use strict';
/* v47 Apophis, 13 Nisan 2029 (apophis.js + veri/apophis2029.json + gozlem.js "Büyük olaylar" + harita.js yol).
   Doğrulama: JPL Horizons yerel (topocentric) gözlemci tabloları — İstanbul (41,0 / 29,1), Ankara, Madrid —
   testler/veri/apophis_horizons_yerel.json (araclar/apophis_horizons.py). Cihaz hesabı < 0,05°. Ağa çıkılmaz. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { disAgiKes, celestrak, havaSessiz, kok } = require('./yardim');
const AP = require('../apophis.js');
const A = require('../lib/astronomy.browser.min.js');

const V = JSON.parse(fs.readFileSync(path.join(kok, 'veri', 'apophis2029.json'), 'utf8'));
const Y = JSON.parse(fs.readFileSync(path.join(kok, 'testler', 'veri', 'apophis_horizons_yerel.json'), 'utf8'));
const DER = Math.PI / 180;
const ayr = (a, b) => Math.acos(Math.min(1, Math.sin(a.dec * DER) * Math.sin(b.dec * DER) + Math.cos(a.dec * DER) * Math.cos(b.dec * DER) * Math.cos((a.ra - b.ra) * DER))) / DER;
function zaman(s) { const [d, hm] = s.split(' '); return new Date(Date.UTC(2029, 3, +d.split('-')[2], +hm.slice(0, 2), +hm.slice(3, 5))); }

test('Veri: Horizons vektörleri 2 dk adımla, yörünge çözümü ve üretim tarihi dosyada; JPL en yakın geçiş', () => {
  expect(V.yorungeCozumu).toBe('JPL#220');
  expect(V.horizonsUretim).toMatch(/2026/);
  expect(V.adimDakika).toBe(2);
  expect(V.xyz.length).toBe(3 * V.sayi);
  expect(V.H).toBeCloseTo(19.09, 2); expect(V.G).toBeCloseTo(0.24, 2);
  expect(V.parlaklikBelirsizligi).toContain('±0,5');
  expect(V.enYakinJPL.zamanTDB).toBe('2029-Apr-13 21:46');
  expect(V.enYakinJPL.uzaklikKm).toBeCloseTo(38011.5, 0);
  /* vektörlerden en yakın an: 21:45 UT (21:46 TDB − 69 s), uzaklık 38 000 km civarı */
  const e = AP.enYakin(V);
  expect(Math.abs(e.zaman - new Date('2029-04-13T21:45:03Z'))).toBeLessThan(60e3);
  expect(Math.abs(e.km - 38011.5)).toBeLessThan(10);   // ışık-zamanı düzeltmesi birkaç km
  expect(AP.konum(V, new Date('2029-04-11T00:00:00Z'))).toBeNull();
});

test('Yerel konum ↔ Horizons topocentric: İstanbul, Ankara, Madrid — konum < 0,05°, yükseklik/azimut < 0,05°, parlaklık < 0,05 kadir', () => {
  const sehirler = Object.keys(Y.sehirler);
  expect(sehirler).toEqual(expect.arrayContaining(['İstanbul', 'Ankara', 'Madrid']));
  for (const [ad, c] of Object.entries(Y.sehirler)) {
    const gzl = new A.Observer(c.enlem, c.boylam, 0);
    expect(c.olcumler.length).toBeGreaterThan(20);
    for (const x of c.olcumler) {
      const r = AP.yerel(V, zaman(x.utc), gzl);
      const k = ad + ' ' + x.utc;
      expect(ayr(r, x), k).toBeLessThan(0.05);
      expect(Math.abs(r.alt - x.alt), k).toBeLessThan(0.05);
      if (x.alt > -80) expect(Math.abs(((r.az - x.az + 540) % 360) - 180) * Math.cos(x.alt * DER), k).toBeLessThan(0.05);
      /* Horizons, ufkun altındaki bazı satırlarda APmag'ı tamsayıya yuvarlıyor (7, 8, 9…): orada yalnız ±0,5 */
      expect(Math.abs(r.kadir - x.mag), k).toBeLessThan(Number.isInteger(x.mag) ? 0.5 : 0.05);
      expect(Math.abs(r.uzaklikKm / A.KM_PER_AU - x.delta_au) / x.delta_au, k).toBeLessThan(1e-3);
    }
  }
});

test('İstanbul özeti: 20.30 UT civarı 45° yükseklik, azimut ~206°, ~2,9 kadir; ~21.27 UT M44\'e 1,7°; Ay ufkun altında', () => {
  const gzl = new A.Observer(41.0, 29.1, 0);
  const r = AP.yerel(V, new Date('2029-04-13T20:30:00Z'), gzl);
  expect(r.alt).toBeCloseTo(45, 0);
  expect(Math.abs(r.az - 206)).toBeLessThan(1);
  expect(Math.abs(r.kadir - 2.9)).toBeLessThan(0.1);
  const o = AP.ozet(V, gzl, { hedef: { ra: 130.0542, dec: 19.6211 } });
  expect(o.gorunur).toBe(true);
  expect(o.ayAlt).toBeLessThan(0);
  expect(o.hedef.aci).toBeLessThan(1.8);
  expect(Math.abs(o.hedef.zaman - new Date('2029-04-13T21:27:00Z'))).toBeLessThan(3 * 60e3);
  expect(o.enParlak.kadir).toBeLessThan(3);
  /* New York: en yakın gecede karanlıkta sönük ve alçak — kart "buradan görülmüyor" demeli (aşağıdaki arayüz testi) */
});

/* ---- Arayüz ---- */
async function kur(page, an, konum) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await celestrak(page, { hata: 503 });
  await havaSessiz(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: {} }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: [] }));
  await page.addInitScript(k => {
    if (sessionStorage.getItem('ap_k')) return; sessionStorage.setItem('ap_k', '1');
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify(k));
  }, konum);
  await page.clock.install({ time: new Date(an) });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkBuyuk')).toBeVisible({ timeout: 20000 });
}
test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });
const IST = { ad: 'İstanbul', enlem: 41.0, boylam: 29.1, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' };

test('Büyük olaylar: geri sayım, İstanbul görünüşü (saat TSİ, yön, kadir ±0,5, M44, Ay) ve kaynak satırı', async ({ page }) => {
  await kur(page, '2026-11-10T21:00:00+03:00', IST);
  const k = page.locator('#gkBuyuk');
  await expect(k).toContainText('99942 Apophis');
  const gun = Math.ceil((new Date('2029-04-13T21:45:03Z') - new Date('2026-11-10T21:00:00+03:00')) / 86400e3);
  await expect(k.locator('.rozet')).toHaveText(`${gun.toLocaleString('tr-TR')} gün kaldı`);
  await expect(k).toContainText('14 Nisan Cumartesi, saat 00.45');
  await expect(k).toContainText('38.012 km');
  await expect(k).toContainText('En parlak 23.3');
  await expect(k).toContainText('güneybatı');
  await expect(k).toContainText('(±0,5)');
  await expect(k).toContainText('M44');
  await expect(k).toContainText('Ay o sırada ufkun altında');
  await expect(k.locator('.kaynak')).toContainText('JPL#220');
  await expect(k.locator('a[href="#ders/d19"]')).toBeVisible();
  await expect(k.locator('.buyuk-olay')).toHaveAttribute('data-ses', /gün kaldı/);
});

test('"O geceyi haritada göster": tarih 13 Nisan 2029, levha en parlak ana gelir; yol, Apophis ve 7×50 alanı çizilir', async ({ page }) => {
  await kur(page, '2026-11-10T21:00:00+03:00', IST);
  await page.locator('#gkApophisHarita').click();
  await expect(page.locator('#gkTarih')).toHaveValue('2029-04-13');
  await expect(page.locator('#gkSaat')).toContainText('23.3');
  await expect.poll(() => page.evaluate(() => !!window.UraniaGozlem.durum.harita.yerlesim().asteroit)).toBe(true);
  const y = await page.evaluate(() => window.UraniaGozlem.durum.harita.yerlesim());
  expect(y.etiketler.some(e => e.metin === 'Apophis')).toBe(true);
  expect(y.etiketler.filter(e => /^\d\d\.\d\d$/.test(e.metin)).length).toBeGreaterThan(3);   // yol üzerinde yarım saatlik saat etiketleri
  /* işaret halkası (Haritada göster) Apophis'in üstünde */
  expect(Math.hypot(y.vurgu.x - y.asteroit.x, y.vurgu.y - y.asteroit.y)).toBeLessThan(1);
});

test('Görülmeyen yer (New York): kart geçişin buradan görülmediğini açıkça söyler, harita düğmesi yok', async ({ page }) => {
  await kur(page, '2026-11-10T13:00:00-05:00', { ad: 'New York', enlem: 40.71, boylam: -74.0, yukseklik: 0, oto: false, saatDilimi: 'America/New_York' });
  const k = page.locator('#gkBuyuk');
  await expect(k).toContainText('bu geçiş buradan görülmüyor');
  await expect(k.locator('#gkApophisHarita')).toHaveCount(0);
});
