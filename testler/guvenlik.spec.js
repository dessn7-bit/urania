'use strict';
/* Güvenlik ve sağlamlık regresyonları (2. hata avı): CSP, prototip adlı rotalar ve saat dilimi, ICS kaçışı,
   bozuk hava yanıtı, uzun konum adlı yedeğin geri yüklenmesi, depodan gelen değerlerin kaçışlanması.
   Ağ isteği atılmaz: yerel sunucu dışındaki her istek kesilir ya da sahte yanıt verilir. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const os = require('os');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');
const KONUM = { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' };

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await page.route('**/celestrak.org/**', r => r.fulfill({ status: 503, body: '' }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
  await page.clock.install({ time: SABIT_AN });
});

async function kur(page, depo) {
  await page.addInitScript(([k, d]) => {
    if (sessionStorage.getItem('gv_kuruldu')) return;
    sessionStorage.setItem('gv_kuruldu', '1');
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify(k));
    Object.entries(d || {}).forEach(([a, v]) => localStorage.setItem('urania_' + a, v));
  }, [KONUM, depo]);
}

test('CSP var, satır içi betik yok; uygulama CSP altında açılır', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await kur(page);
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  expect(html).toContain('Content-Security-Policy');
  expect(html).not.toMatch(/<script>(?!\s*<\/script>)/);
  expect(html).not.toMatch(/\son[a-z]+="/);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkOzet p').first()).toBeVisible();
  expect(page.hatalar).toEqual([]);
});

test('Prototip adlı rota ve deney adresi boş sayfa ya da hata bırakmaz', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await kur(page);
  for (const r of ['#__proto__', '#constructor', '#toString', '#deney/constructor', '#deney/toString', '#deney/hasOwnProperty']) {
    await page.goto('/index.html' + r);
    await expect(page.locator('.bolum:not([hidden])').first()).toBeVisible();
    await expect(page.locator('.bolum-hata')).toHaveCount(0);
  }
  expect(page.hatalar).toEqual([]);
});

test('Depodaki saat dilimi "constructor" uygulamayı kilitlemez; bozuk ayarlar varsayılana döner', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await kur(page, { konum: JSON.stringify(Object.assign({}, KONUM, { saatDilimi: 'constructor' })), limitKadir: '"abc"', arKalibrasyon: '"x"', sesGunluk: '[null, 5]', yerAdlari: 'null', rehber_kepler: '{"length":"<img src=x onerror=window.__xss=1>"}' });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkOzet p').first()).toBeVisible();
  await expect(page.locator('#gkKadirDeger')).toContainText('4');
  await page.goto('/index.html#deney');
  await expect(page.locator('.deney-liste').first()).toBeVisible();
  await page.goto('/index.html#deney/kepler');
  await expect(page.locator('.rehber')).toBeVisible();
  await page.goto('/index.html#tani');
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  expect(page.hatalar).toEqual([]);
});

test('ICS: tek başına CR ve denetim karakterleri yeni satır/olay açamaz', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await kur(page);
  await page.goto('/index.html#hesap');
  const m = await page.evaluate(() => Urania.icsMetni({ baslik: 'A\rEND:VEVENT\rBEGIN:VEVENT\rSUMMARY:enjekte\u0001', bas: new Date('2026-10-28T20:00:00Z'), aciklama: 'x\ny' }));
  expect(m.split('\r\n').filter(s => s === 'BEGIN:VEVENT').length).toBe(1);
  expect(m).not.toMatch(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/);
  expect(m.replace(/\r\n/g, '')).not.toMatch(/\r|\n/);
});

test('Bozuk hava yanıtı önbelleğe girmez; defter kaydı yine yapılır', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time: 5 } } }));
  await kur(page);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkHava')).toContainText('alınamadı');
  expect(await page.evaluate(() => Urania.anahtarlar('hava2_').length)).toBe(0);
  await page.goto('/index.html#defter');
  await page.click('#dfYeni');
  await page.click('#dfKaydet');
  await expect(page.locator('#dfListe li[data-id]')).toHaveCount(1);
  expect(page.hatalar).toEqual([]);
});

test('Uzun konum adıyla yapılan kayıt yedeklenip geri yüklenir', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  const uzun = 'Ç'.repeat(200);
  await kur(page, { defter: JSON.stringify([{ id: 'k1', zaman: '2026-10-27T18:00:00.000Z', cisim: { anahtar: 'cisim:Moon', ad: 'Ay' }, alet: '7×50 dürbün', kosul: 'Berrak', not: '', konum: { ad: uzun, enlem: 40.99, boylam: 29.03, yukseklik: 0 }, otomatik: {} }]) });
  await page.goto('/index.html#defter');
  const yedek = { uygulama: 'Urania', tur: 'gozlem-defteri', surum: 1, kayitlar: await page.evaluate(() => JSON.parse(localStorage.getItem('urania_defter'))) };
  await page.evaluate(() => localStorage.setItem('urania_defter', '[]'));
  await page.reload();
  const p = path.join(os.tmpdir(), 'urania-gv-yedek.json'); fs.writeFileSync(p, JSON.stringify(yedek));
  await page.locator('#dfYukle').setInputFiles(p);
  await expect(page.locator('#dfYedekDurum')).toContainText('1 kayıt eklendi');
  expect(page.hatalar).toEqual([]);
});

test('Elle konum adı 80 karakterle sınırlı; depo doluysa konumun kaydedilemediği söylenir', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await kur(page);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkKAd')).toHaveAttribute('maxlength', '80');
  await page.evaluate(() => { const asil = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'urania_konum') throw new DOMException('dolu', 'QuotaExceededError'); return asil.call(this, k, v); }; });
  await page.click('#gkKonumDegis');
  await page.fill('#gkKEnlem', '39,93'); await page.fill('#gkKBoylam', '32,86');
  await page.click('#gkKKaydet');
  await expect(page.locator('.konum-hata')).toContainText('kaydedilemedi');
  expect(page.hatalar).toEqual([]);
});

test('Depo dolunca yeniden indirilebilen önbellekler silinip kullanıcı verisi yazılır', async ({ page }) => {
  await page.route('**/api.open-meteo.com/**', r => r.abort());
  await kur(page, { gp_dizi: JSON.stringify({ alindi: 1, diziler: [] }) });
  await page.goto('/index.html#hesap');
  const sonuc = await page.evaluate(() => {
    const asil = Storage.prototype.setItem; let ilk = true;
    Storage.prototype.setItem = function (k, v) { if (k === 'urania_dersBitti' && localStorage.getItem('urania_gp_dizi') !== null) { ilk = false; throw new DOMException('dolu', 'QuotaExceededError'); } return asil.call(this, k, v); };
    const ok = Urania.yaz('dersBitti', { d1: 1 });
    return { ok, onbellek: localStorage.getItem('urania_gp_dizi') };
  });
  expect(sonuc.ok).toBe(true);
  expect(sonuc.onbellek).toBeNull();
});
