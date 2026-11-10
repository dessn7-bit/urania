'use strict';
/* v47 "Bu gece Ay'da" rehberi (ay.js + gozlem.js kartı + veri/ay_yapilari.json).
   1) Hesap: JPL Horizons gözlemci tablosu (testler/veri/ay/horizons_ay.json, araclar/ay_horizons.py; İstanbul ve Ankara,
      10, 17 ve 26–27 Kasım 2026) ile alt gözlemci noktası (librasyon), alt Güneş noktası (terminator), kuzey kutbu açısı ve
      dürbündeki dönüklük karşılaştırılır. Dönüklük = −(NP − q); q paralaktik açı, Meeus tan q = sin H / (tan φ cos δ − sin δ cos H),
      H ve δ Horizons'tan.
   2) Veri: IAU onaylı, yakın yüz, boyut eşiği hesabı; Türkçe adlar kaynaklı.
   3) Arayüz: kart, liste, vurgulama, sonraki uygun gece, kırmızı mod, 320 px. Ağa çıkılmaz. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { disAgiKes, celestrak, havaSessiz, kok } = require('./yardim');
const AR = require('../ay.js');
const G = require('../gok.js');

const F = JSON.parse(fs.readFileSync(path.join(kok, 'testler', 'veri', 'ay', 'horizons_ay.json'), 'utf8'));
const VERI = JSON.parse(fs.readFileSync(path.join(kok, 'veri', 'ay_yapilari.json'), 'utf8'));
const TR = JSON.parse(fs.readFileSync(path.join(kok, 'arastirma', 'ay_adlari_tr.json'), 'utf8'));
const AYLAR = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const sar = x => ((x + 540) % 360) - 180;
const DER = Math.PI / 180;
function zaman(s) { const [d, hm] = s.split(' '); const [y, a, g] = d.split('-'); return new Date(Date.UTC(+y, AYLAR[a], +g, +hm.slice(0, 2), +hm.slice(3, 5))); }

test('Hesap ↔ Horizons: librasyon, alt Güneş noktası (terminator), kutup açısı ve dönüklük 0,02° içinde', () => {
  expect(F.olcumler.length).toBeGreaterThanOrEqual(20);
  expect(new Set(F.olcumler.map(o => o.yer)).size).toBeGreaterThanOrEqual(2);
  for (const o of F.olcumler) {
    const r = AR.hesap(zaman(o.utc), G.gozlemci(o.enlem, o.boylam, 0));
    const ad = o.yer + ' ' + o.utc;
    expect(Math.abs(sar(r.libBoylam - o.obsLon)), ad).toBeLessThan(0.02);
    expect(Math.abs(r.libEnlem - o.obsLat), ad).toBeLessThan(0.02);
    expect(Math.abs(sar(r.gunesBoylam - o.gunesLon)), ad).toBeLessThan(0.02);
    expect(Math.abs(r.gunesEnlem - o.gunesLat), ad).toBeLessThan(0.02);
    /* terminator: sabah sınırı alt Güneş boylamının 90° batısı */
    expect(Math.abs(sar(r.terminatorSabah - (o.gunesLon - 90))), ad).toBeLessThan(0.02);
    expect(Math.abs(sar(r.terminatorAksam - (o.gunesLon + 90))), ad).toBeLessThan(0.02);
    expect(Math.abs(sar(r.npAci - o.npAci)), ad).toBeLessThan(0.02);
    const H = o.saatAcisi * 15 * DER, f = o.enlem * DER, d = o.dec * DER;
    const q = Math.atan2(Math.sin(H), Math.tan(f) * Math.cos(d) - Math.sin(d) * Math.cos(H)) / DER;
    expect(Math.abs(sar(r.paralaktik - q)), ad).toBeLessThan(0.02);
    expect(Math.abs(sar(r.donukluk + (o.npAci - q))), ad).toBeLessThan(0.02);
    expect(Math.abs(r.yukseklik - o.alt), ad).toBeLessThan(0.02);
    expect(Math.abs(r.aydinlik * 100 - o.aydinlik), ad).toBeLessThan(1);   // Horizons yerel, Astronomy Engine yer merkezli aydınlık
  }
});

test('Veri: IAU onaylı yakın yüz yapıları, boyut eşiği hesabı (60″/7, 384 400 km, 3 öğe), 100–200 yapı', () => {
  const e = VERI.esik;
  expect(e.gozYaySn).toBe(60); expect(e.buyutme).toBe(7); expect(e.uzaklikKm).toBe(384400); expect(e.oge).toBe(3);
  expect(e.cozmeKm).toBeCloseTo(384400 * (60 / 7) / 206264.806, 2);
  expect(e.esikKm).toBeCloseTo(3 * 384400 * (60 / 7) / 206264.806, 1);
  expect(e.hesap).toContain("Urania'nın seçimi");
  expect(VERI.kaynak.atif).toContain('International Astronomical Union (IAU) and United States Geological Survey (USGS)');
  expect(VERI.kaynak.kullanim).toMatch(/Public domain/i);
  expect(VERI.yapilar.length).toBeGreaterThanOrEqual(100);
  expect(VERI.yapilar.length).toBeLessThanOrEqual(200);
  const turler = new Set(VERI.yapilar.map(y => y.tur));
  for (const t of ['deniz', 'okyanus', 'göl', 'körfez', 'bataklık', 'krater', 'sıradağ']) expect(turler.has(t), t).toBe(true);
  for (const y of VERI.yapilar) {
    expect(Math.abs(y.boylam), y.ad).toBeLessThanOrEqual(90);
    const cosc = Math.cos(y.enlem * DER) * Math.cos(y.boylam * DER);
    expect(y.cap * cosc, y.ad).toBeGreaterThanOrEqual(e.esikKm - 0.1);
    expect(y.usgs, y.ad).toMatch(/^https:\/\/planetarynames\.wr\.usgs\.gov\/Feature\/\d+$/);
    if (y.tur === 'sıradağ') expect(y.ad).toMatch(/^Montes /);
  }
  /* bilinen yapılar */
  for (const ad of ['Mare Imbrium', 'Oceanus Procellarum', 'Copernicus', 'Tycho', 'Plato', 'Montes Apenninus', 'Sinus Iridum']) expect(VERI.yapilar.some(y => y.ad === ad), ad).toBe(true);
});

test('Türkçe adlar: yalnız kaynaklı olanlar (tr.wikipedia / TÜBA / TDK); kaynaksızlar Latince', () => {
  const tr = VERI.yapilar.filter(y => y.tr);
  expect(tr.length).toBeGreaterThan(0);
  for (const y of tr) {
    expect(y.trKaynak, y.ad).toMatch(/^https:\/\/(tr\.wikipedia\.org|.*tuba\.gov\.tr|.*tdk\.gov\.tr)/);
    expect(TR[y.ad].tr).toBe(y.tr);
  }
  expect(VERI.yapilar.find(y => y.ad === 'Mare Tranquillitatis').tr).toBe('Sessizlik Denizi');
  expect(VERI.yapilar.find(y => y.ad === 'Copernicus').tr).toBeUndefined();
  /* v47 doğrulaması: "Toros Dağları" Ay sıradağının Türkçe adı değil, adının kökeni — Latince kalır, köken notu USGS'den */
  const mt = VERI.yapilar.find(y => y.ad === 'Montes Taurus');
  expect(mt.tr).toBeUndefined();
  expect(mt.koken).toContain('Toros Dağları');
  expect(mt.kokenKaynak).toBe('https://planetarynames.wr.usgs.gov/Feature/4018');
});

test('Canlı USGS rehberi: zip geride kaldığı yapılarda canlı değer, zip değeri ayrı alanda (Mare Frigoris 1596 km)', () => {
  const mf = VERI.yapilar.find(y => y.ad === 'Mare Frigoris');
  expect(mf.cap).toBeCloseTo(1596, 0);
  expect(mf.zip.cap).toBeCloseTo(1446.4, 1);
  expect(VERI.yapilar.filter(y => y.zip).length).toBeLessThan(20);
  expect(VERI.kaynak.canli).toContain('planetarynames.wr.usgs.gov');
});

/* ---- Arayüz ---- */
const IST = { ad: 'İstanbul', enlem: 41.0, boylam: 29.1, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' };
async function kur(page, an, s = {}) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await celestrak(page, { hata: 503 });
  await havaSessiz(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: {} }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: [] }));
  await page.addInitScript(([k, kir]) => {
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify(k));
    if (kir) localStorage.setItem('urania_kirmizi', 'true');
  }, [IST, !!s.kirmizi]);
  await page.clock.install({ time: new Date(an) });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkAy')).toBeVisible({ timeout: 20000 });
}
test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });

test('17 Kasım 2026 21.00: kart şu anki Ay için sınıra yakın yapıları listeler (Node hesabıyla aynı), sesli metin ve ders bağlantısı', async ({ page }) => {
  await kur(page, '2026-11-17T21:00:00+03:00');
  const k = page.locator('#gkAy');
  await expect(k.locator('.ay-ozet')).toContainText('Şu an için');
  await expect(k.locator('.ay-ozet')).toContainText('büyüyen');
  const d = AR.hesap(new Date('2026-11-17T21:00:00+03:00'), G.gozlemci(41.0, 29.1, 0));
  const bek = AR.seckinler(d, VERI.yapilar, 8).map(y => y.ad);
  expect(bek.length).toBeGreaterThanOrEqual(5);
  expect(bek).toContain('Montes Apenninus');
  await expect(k.locator('.ay-yapi')).toHaveCount(bek.length);
  expect(await k.locator('.ay-yapi').evaluateAll(b => b.map(x => x.dataset.ad))).toEqual(bek);
  /* her satırın okunuş metni: ad, tür, çap */
  for (const s of await k.locator('.ay-yapi').evaluateAll(b => b.map(x => x.dataset.ses))) expect(s).toMatch(/^\d+\. .+: (krater|sıradağ|deniz|okyanus|göl|körfez|bataklık), çapı yaklaşık [\d.]+ kilometre\./);
  await expect(k.locator('.ay-ozet')).toHaveAttribute('data-ses', /Dürbünde Ay'ın kuzeyi/);
  await expect(k.locator('.kaynak')).toContainText('International Astronomical Union (IAU) and United States Geological Survey (USGS)');
  await expect(k.locator('.kaynak')).toContainText("NASA's Scientific Visualization Studio");
  await expect(k.locator('a[href="#ders/d10"]')).toContainText('11. ders');
});

test('Numara etiketleri birbirine binmez (17 ve 13 Kasım)', async ({ page }) => {
  for (const an of ['2026-11-17T21:00:00+03:00', '2026-11-13T19:00:00+03:00']) {
    await kur(page, an);
    const e = await page.evaluate(() => window.AyRehber.sonEtiketler());
    expect(e.length).toBeGreaterThanOrEqual(5);
    const fs = await page.evaluate(() => { const c = document.querySelector('#gkAyKanvas'); return Math.round(Math.max(11, (Math.min(c.width, c.height) / 2 - 2) / 14)); });
    for (let i = 0; i < e.length; i++) for (let j = i + 1; j < e.length; j++)
      expect(Math.abs(e[i].x - e[j].x) >= fs * 1.1 || Math.abs(e[i].y - e[j].y) >= fs * 0.95, an + ' ' + e[i].no + '/' + e[j].no).toBe(true);
  }
});

test('Dokununca yapı vurgulanır (aria-pressed, görüntü değişir); ikinci dokunuş vurguyu kaldırır', async ({ page }) => {
  await kur(page, '2026-11-17T21:00:00+03:00');
  const cv = page.locator('#gkAyKanvas');
  await page.waitForLoadState('networkidle');   // doku (img/ay/lroc_color_2k.jpg) yüklensin ve çizilsin
  await page.waitForTimeout(300);
  const once = await cv.evaluate(c => c.toDataURL());
  const b = page.locator('.ay-yapi').nth(1);
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.ay-yapi[aria-pressed="true"]')).toHaveCount(1);
  expect(await cv.evaluate(c => c.toDataURL())).not.toBe(once);
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'false');
});

test('10 Kasım 2026 (yeni Ay): kart bir sonraki uygun geceyi söyler (13 Kasım) ve o gecenin Ay\'ını çizer', async ({ page }) => {
  await kur(page, '2026-11-10T21:00:00+03:00');
  const k = page.locator('#gkAy .ay-ozet');
  await expect(k).toContainText("yeni Ay'a çok yakın");
  await expect(k).toContainText('Bir sonraki uygun gece: 13 Kasım Cuma');
  await expect(page.locator('#gkAy .ay-yapi').first()).toBeVisible();
});

test('24 Kasım 2026 (dolunay): kart gölgenin olmadığını söyler ve sonraki uygun geceye geçer', async ({ page }) => {
  await kur(page, '2026-11-24T21:00:00+03:00');
  await expect(page.locator('#gkAy .ay-ozet')).toContainText('Bu gece dolunay');
  await expect(page.locator('#gkAy .ay-ozet')).toContainText('Bir sonraki uygun gece');
});

test.describe('Dar ekran ve kırmızı mod', () => {
  test.use({ viewport: { width: 320, height: 800 } });
  test('320 px: kart taşmaz, Ay görüntüsü genişliğe sığar', async ({ page }) => {
    await kur(page, '2026-11-17T21:00:00+03:00');
    const s = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, cv: document.querySelector('#gkAyKanvas').getBoundingClientRect(), k: document.querySelector('#gkAy').getBoundingClientRect() }));
    expect(s.sw).toBeLessThanOrEqual(s.cw);
    expect(s.cv.right).toBeLessThanOrEqual(s.k.right + 0.5);
    expect(s.cv.width).toBeGreaterThan(200);
  });
  test('Kırmızı modda Ay görüntüsü ve liste yalnız kırmızı/siyah', async ({ page }) => {
    await kur(page, '2026-11-17T21:00:00+03:00', { kirmizi: true });
    await page.waitForTimeout(500);
    await page.locator('#gkAy').scrollIntoViewIfNeeded();
    const png = await page.locator('#gkAy .ay-sahne').screenshot();
    const n = await page.evaluate(async b64 => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 0; i < d.length; i += 4) if (Math.max(d[i + 1], d[i + 2]) > 0.35 * d[i] + 20) n++;
      return n;
    }, png.toString('base64'));
    expect(n).toBe(0);
    /* aydınlık yüz kırmızı süzgeçte doymasın: doku %60'la çizilir (halka ve rakamlar dışında kanvas pikseli ≤ 0,6 × 255) */
    const doyan = await page.evaluate(() => { const c = document.querySelector('#gkAyKanvas'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0, t = 0; for (let i = 0; i < d.length; i += 4) { if (d[i + 3]) { t++; if (d[i] > 160) n++; } } return n / t; });
    expect(doyan).toBeLessThan(0.02);
  });
});
