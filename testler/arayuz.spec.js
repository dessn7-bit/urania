'use strict';
/* Arayüz testleri: her bölüm hatasız açılıyor, hesaplar beklenen sonucu veriyor,
   ayarlar kalıcı. Saat sabitlenir (2026-10-27 21:00 İstanbul) ki sonuçlar tekrarlanabilir olsun. */
const { test, expect } = require('@playwright/test');
const { celestrak } = require('./yardim');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  page.on('console', m => { if (m.type() === 'error') page.hatalar.push(m.text()); });
  await page.clock.install({ time: SABIT_AN });
  /* Bulut tahmini ağa çıkmasın: bu dosyadaki testler gök hesaplarını sınar */
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [] } } }));
  await celestrak(page);
});
test.afterEach(async ({ page }) => {
  expect(page.hatalar, 'konsol/sayfa hatası olmamalı').toEqual([]);
});

test('Gökyüzü: levha çizilir, özet ve listeler dolar', async ({ page }) => {
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkOzet p').first()).toContainText('18:06');
  await expect(page.locator('#gkSaat')).toContainText('21:00');
  await expect(page.locator('#gkGezegen li')).toHaveCount(7);
  await expect(page.locator('#gkHedef li').first()).toBeVisible();
  await expect(page.locator('#gkOlay li').first()).toBeVisible();
  /* kanvas boş değil */
  const dolu = await page.locator('#gkLevha').evaluate(c => {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n / (c.width * c.height);
  });
  expect(dolu).toBeGreaterThan(0.5);
});

test('Gökyüzü: saat kaydırıcısı levhayı ve saati değiştirir', async ({ page }) => {
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkSaat')).toContainText('21:00');
  /* Kaydırıcı gözlemcinin güneş öğlesinden (Fetih Mah., Ataşehir: 13:00 TSİ'ye yuvarlanır) başlar: +14 sa = 03:00 */
  await page.locator('#gkKaydir').fill('840');
  await expect(page.locator('#gkSaat')).toContainText('03:00');
  await page.locator('#gkSimdi').click();
  await expect(page.locator('#gkSaat')).toContainText('21:00');
});

test('Gökyüzü: başka bir gece seçilince özet değişir', async ({ page }) => {
  await page.goto('/index.html#gok');
  const once = await page.locator('#gkOzet').innerText();
  await page.locator('#gkTarih').fill('2026-12-13');
  await page.locator('#gkTarih').dispatchEvent('change');
  await expect(page.locator('#gkOzet')).not.toHaveText(once);
  await expect(page.locator('#gkBuGece')).toBeVisible();
});

test('Kırmızı mod kalıcıdır', async ({ page }) => {
  await page.goto('/index.html#gok');
  await page.locator('#kirmiziDugme').click();
  await expect(page.locator('html')).toHaveClass(/kirmizi/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/kirmizi/);
});

test('Deneyler: dört deney açılır ve ölçümler dolar', async ({ page }) => {
  await page.goto('/index.html#deney/karadelik');
  await expect(page.locator('#kdRs')).not.toHaveText('—');
  await page.goto('/index.html#deney/yorunge');
  await expect(page.locator('#yoSonuc')).toHaveText('Dairesel yörünge');
  await page.goto('/index.html#deney/yildiz');
  await expect(page.locator('#hrSon')).not.toHaveText('—');
  await page.goto('/index.html#deney/gorelilik');
  await expect(page.locator('#grGama')).not.toHaveText('—');
});

test('Kara delik: 1 Güneş kütlesinin olay ufku ≈ 2,95 km', async ({ page }) => {
  await page.goto('/index.html#deney/karadelik');
  await page.locator('#kdKutle').fill('0');
  await expect(page.locator('#kdRs')).toContainText('2,95');
});

test('Yörünge: kurtulma hızında Dünya\'dan kurtulur', async ({ page }) => {
  await page.goto('/index.html#deney/yorunge');
  await page.locator('#yoKac').click();
  await expect(page.locator('#yoSonuc')).toHaveText('Dünya\'dan kurtulur');
  await page.locator('#yoHiz').fill('0.5');
  await expect(page.locator('#yoSonuc')).toHaveText('Yere çarpar');
});

test('Hesap: bilinen sonuçlar', async ({ page }) => {
  await page.goto('/index.html#hesap');
  /* 1 parsek ≈ 3,26 ışık yılı */
  await page.locator('#uzD').fill('1');
  await page.locator('#uzB').selectOption('pc');
  await expect(page.locator('#uzS')).toContainText('3,262');
  /* Dünya kurtulma hızı ≈ 11,2 km/s */
  await page.locator('#kuC').selectOption('Dünya');
  await expect(page.locator('#kuS b')).toContainText('11,1');
  /* Dünya kütlesinin Schwarzschild yarıçapı ≈ 8,87 mm */
  await page.locator('#swM').fill('1');
  await page.locator('#swB').selectOption('dunya');
  await expect(page.locator('#swS b')).toContainText('8,8');
  /* 1 AB, 1 Güneş kütlesi → ≈ 365,2 gün */
  await page.locator('#kpA').fill('1');
  await page.locator('#kpM').fill('1');
  await expect(page.locator('#kpS b')).toContainText('365,');
  /* 5 kadir fark = 100 kat */
  await page.locator('#poA').fill('1');
  await page.locator('#poB').fill('6');
  await expect(page.locator('#poS b')).toHaveText('100 kat');
  /* 1000 mas = 1 parsek */
  await page.locator('#paP').fill('1000');
  await expect(page.locator('#paS b')).toContainText('1,000 parsek');
  /* Hatalı giriş açıklayıcı mesaj verir */
  await page.locator('#swM').fill('-3');
  await expect(page.locator('#swS')).toContainText('Pozitif');
});

test('Dersler: liste, ders okuma ve ilerleme', async ({ page }) => {
  await page.goto('/index.html#ders');
  await expect(page.locator('.ders-liste li')).toHaveCount(11); // count() beklemez; liste veri yüklenince çizilir
  await page.locator('.ders-liste li a').first().click();
  await expect(page.locator('article.ders h1')).toBeVisible();
  await expect(page.locator('.defter li').first()).toBeVisible();
  await page.locator('#dsBitir').click();
  await page.goto('/index.html#ders');
  await expect(page.locator('.ders-liste .durum.bitti')).toHaveCount(1);
});

test('Telefon genişliğinde yatay kaydırma yok', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  for (const h of ['#gok', '#deney/karadelik', '#deney/yildiz', '#ders', '#ders/d1', '#hesap']) {
    await page.goto('/index.html' + h);
    await page.waitForTimeout(300);
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(tasma, h).toBeLessThanOrEqual(0);
  }
});

test('İnceleme düzeltmeleri: bozuk konum kaydı uygulamayı düşürmez', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('urania_konum', JSON.stringify({ ad: 'x' })));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkKonum')).toContainText('Fetih Mahallesi');
  await expect(page.locator('#gkGezegen li')).toHaveCount(7);
});

test('İnceleme düzeltmeleri: uzak konumda saatler o konumun diliminde ve doğru gece', async ({ page }) => {
  /* Tokyo (35,68 K, 139,69 D), cihaz İstanbul'da, 20:00 TSİ = 02:00 Tokyo → Tokyo'da "bu gece" 27 Ekim akşamı başlayan gece */
  await page.addInitScript(() => localStorage.setItem('urania_konum', JSON.stringify({ ad: 'Tokyo', enlem: 35.68, boylam: 139.69, yukseklik: 0, saatDilimi: 'Asia/Tokyo' })));
  await page.goto('/index.html#gok');
  /* USNO: Tokyo 27 Ekim 2026 gün batımı 16:52 (UTC+9) —
     https://aa.usno.navy.mil/api/rstt/oneday?date=2026-10-27&coords=35.68,139.69&tz=9 */
  const ozet = await page.locator('#gkOzet p').first().innerText();
  const saat = ozet.match(/Güneş (\d\d):(\d\d)/);
  expect(saat, ozet).toBeTruthy();
  expect(Number(saat[1]) * 60 + Number(saat[2])).toBeGreaterThanOrEqual(16 * 60 + 51);
  expect(Number(saat[1]) * 60 + Number(saat[2])).toBeLessThanOrEqual(16 * 60 + 53);
  await expect(page.locator('#gkKonum')).toContainText('Asia/Tokyo');
});

test('İnceleme düzeltmeleri: canlı mod sabah 10:00\'da gerçek saati çizer', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-28T10:00:00+03:00'));
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkSaat')).toContainText('10:00 (şimdi)');
  await expect(page.locator('#gkGunesDurum')).toHaveText('Gündüz');
});

test('Jüpiter satırında uydu şeması', async ({ page }) => {
  await page.goto('/index.html#gok');
  const j = page.locator('#gkGezegen li', { hasText: 'Jüpiter' });
  await expect(j.locator('.jupiter-sema svg circle.uydu, .jupiter-sema svg circle.uydu-gizli')).toHaveCount(4);
  await expect(j.locator('.jupiter-sema')).toContainText('Uydular');
});

test('Takvime ekle: geçerli .ics dosyası iner', async ({ page }) => {
  await page.goto('/index.html#gok');
  const [indirme] = await Promise.all([page.waitForEvent('download'), page.locator('#gkOlay .takvim-bag').first().click()]);
  const yol = await indirme.path();
  const metin = require('fs').readFileSync(yol, 'utf8');
  expect(indirme.suggestedFilename()).toMatch(/\.ics$/);
  expect(metin).toContain('BEGIN:VCALENDAR');
  expect(metin).toContain('SUMMARY:Yeni Ay');
  /* İlk olay Yeni Ay, 9 Kasım 2026 07:02 UT (USNO) */
  expect(metin).toMatch(/DTSTART:20261109T070[12]\d\dZ/);
  expect(metin).toContain('TRIGGER:-PT1H');
  /* Her satır en çok 75 bayt, satır sonları CRLF */
  metin.split('\r\n').forEach(s => expect(Buffer.byteLength(s, 'utf8')).toBeLessThanOrEqual(75));
  expect(metin.replace(/\r\n/g, '')).not.toContain('\n');
});

test('ISS: görünür geçişler listelenir (ilk: 28 Ekim 05:21–05:22 TSİ)', async ({ page }) => {
  await page.goto('/index.html#gok');
  const ilk = page.locator('#gkIss li', { hasText: 'ISS ·' }).first();
  await expect(ilk).toContainText('05:21–05:22', { timeout: 20000 }); // gölgeden çıkış 02:20:34 UT (Skyfield 02:20:35) – 02:21:52 UT
  await expect(ilk).toContainText("Dünya'nın gölgesinden çıkıp belirir");
  await expect(ilk).toContainText('28 Ekim');
  await expect(page.locator('#gkIssKaynak')).toContainText('CelesTrak');
});

test('Tanı ekranı: rapor oluşur, yön olayı sayılır, kopyalanır', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkKaynak a', { hasText: 'Tanı ekranı' })).toBeVisible();
  await page.locator('#gkKaynak a', { hasText: 'Tanı ekranı' }).click();
  await expect(page.locator('#tnRapor')).toContainText('URANIA TANI');
  await page.evaluate(() => { for (let i = 0; i < 5; i++) window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 30, beta: 10, gamma: 0, absolute: true })); });
  await expect(page.locator('#tnPusula')).toContainText('330°');
  await page.locator('#tnYenile').click();
  await expect(page.locator('#tnRapor')).toContainText('olay 5');
  await expect(page.locator('#tnRapor')).toContainText('KONUM: Fetih Mahallesi');
  await page.locator('#tnKopyala').click();
  await expect(page.locator('#tnDurum')).toContainText('Kopyalandı');
  const pano = await page.evaluate(() => navigator.clipboard.readText());
  expect(pano).toContain('SERVİSLER');
});
