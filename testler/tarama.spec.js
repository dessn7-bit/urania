'use strict';
/* Hata taraması: farklı konum, mevsim, saat ve ekran koşullarında her bölüm açılır;
   sayfa hatası, konsol hatası ya da ekranda "NaN", "undefined", "Invalid Date", "null"
   gibi bozuk metin olmamalı. Ağ servisleri sahte yanıtla (boş/hatalı) beslenir. */
const { test, expect } = require('@playwright/test');
const { celestrak } = require('./yardim');

const KONUMLAR = [
  { ad: 'Sidney', enlem: -33.87, boylam: 151.21, saatDilimi: 'Australia/Sydney' },
  { ad: 'Tromsø', enlem: 69.65, boylam: 18.96, saatDilimi: 'Europe/Oslo' },
  { ad: 'Quito', enlem: -0.18, boylam: -78.47, saatDilimi: 'America/Guayaquil' },
  { ad: 'Kuzey Kutbu', enlem: 89.9, boylam: 0, saatDilimi: 'UTC' },
  { ad: 'Tarih çizgisi', enlem: -17.7, boylam: 179.9, saatDilimi: 'Pacific/Fiji' }
];
const ANLAR = ['2026-06-21T23:30:00Z', '2026-12-21T12:00:00Z', '2027-03-20T03:00:00Z'];
const BOZUK = /\bNaN\b|undefined|Invalid Date|\bnull\b|\[object Object\]/;

async function hazirla(page, konum, an, secenek = {}) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push('sayfa: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) page.hatalar.push('konsol: ' + m.text()); });
  await page.route('**/api.open-meteo.com/**', r => secenek.havaHata ? r.fulfill({ status: 500, body: 'x' }) : r.fulfill({ json: { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [], precipitation_probability: [], precipitation: [] } } }));
  await celestrak(page);
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: {} }));
  await page.addInitScript(k => {
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify(Object.assign({ yukseklik: 0, oto: false }, k)));
  }, konum);
  await page.clock.install({ time: new Date(an) });
}

async function bolumleriGez(page) {
  for (const h of ['#gok', '#deney/karadelik', '#deney/yorunge', '#deney/yildiz', '#deney/gorelilik', '#ders', '#ders/d10', '#defter', '#hesap']) {
    await page.goto('/index.html' + h);
    await page.waitForTimeout(h === '#gok' ? 1500 : 300);
    const metin = await page.locator('main').innerText();
    const bozuk = metin.split('\n').filter(s => BOZUK.test(s));
    expect(bozuk, h + ' bölümünde bozuk metin').toEqual([]);
  }
}

for (const k of KONUMLAR) {
  for (const an of ANLAR) {
    test(`Tarama: ${k.ad} · ${an.slice(0, 10)}`, async ({ page }) => {
      await hazirla(page, k, an);
      await bolumleriGez(page);
      expect(page.hatalar).toEqual([]);
    });
  }
}

test('Tarama: dar ekran (320 px), kırmızı mod, hava servisi hata veriyor', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await hazirla(page, { ad: 'Fetih', enlem: 41.0046, boylam: 29.0762, saatDilimi: 'Europe/Istanbul' }, '2026-10-27T18:00:00Z', { havaHata: true });
  await page.addInitScript(() => localStorage.setItem('urania_kirmizi', 'true'));
  await bolumleriGez(page);
  for (const h of ['#gok', '#hesap', '#defter', '#ders/d11']) {
    await page.goto('/index.html' + h);
    await page.waitForTimeout(400);
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(tasma, h).toBeLessThanOrEqual(0);
  }
  expect(page.hatalar).toEqual([]);
});

test('Tarama: geniş ekran (1440 px) ve gökyüzüne bak', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await hazirla(page, { ad: 'Fetih', enlem: 41.0046, boylam: 29.0762, saatDilimi: 'Europe/Istanbul' }, '2026-10-30T03:58:00Z');
  await bolumleriGez(page);
  await page.goto('/index.html#ar');
  await page.waitForTimeout(2000);
  const metin = await page.locator('#b-ar').innerText();
  expect(metin).not.toMatch(BOZUK);
  expect(page.hatalar).toEqual([]);
});
