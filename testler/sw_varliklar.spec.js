'use strict';
/* Çevrimdışı önbellek (sw.js ASSETS) eksiksiz mi? Uygulama gezilirken yüklenen her aynı kökenli dosya
   ASSETS'te olmalı (yoksa çevrimdışıyken o sayfa kırılır); ASSETS'teki her dosya diskte bulunmalı
   (yoksa install'daki cache.addAll tümden başarısız olur ve hiçbir şey önbelleğe girmez).
   Ağ isteği atılmaz: dış istekler sahte yanıtla ya da kesilerek karşılanır. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { celestrak, disAgiKes, kok } = require('./yardim');

const SW = fs.readFileSync(path.join(kok, 'sw.js'), 'utf8');
const ASSETS = JSON.parse(SW.match(/const ASSETS = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"'));
const norm = u => u.replace(/^\.\//, '').replace(/^\//, '') || 'index.html';
const VARLIK = new Set(ASSETS.map(norm));

test('ASSETS listesindeki her dosya diskte var, tekrar yok', () => {
  expect(ASSETS.length).toBeGreaterThan(40);
  expect(ASSETS.length, 'tekrarlanan öğe').toBe(new Set(ASSETS).size);
  const yok = ASSETS.filter(u => u !== './' && !fs.existsSync(path.join(kok, norm(u))));
  expect(yok).toEqual([]);
});

test('Durağan başvurular ASSETS\'te: index.html betik/bağlantıları, stil.css fontları, işçi, ders çizimleri, veri dosyaları', () => {
  const html = fs.readFileSync(path.join(kok, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(kok, 'stil.css'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.join(kok, 'manifest.json'), 'utf8'));
  const js = fs.readdirSync(kok).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(kok, f), 'utf8')).join('\n');
  const gerekli = new Set();
  for (const m of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)) if (!/^https?:/.test(m[1])) gerekli.add(norm(m[1]));
  for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) if (!/^(data:|https?:|#)/.test(m[1])) gerekli.add(norm(m[1]));   // #kirmiziSuz: SVG süzgeç başvurusu, dosya değil
  (manifest.icons || []).forEach(i => gerekli.add(norm(i.src)));
  for (const m of js.matchAll(/new Worker\(\s*'([^']+)'/g)) gerekli.add(norm(m[1]));
  for (const m of js.matchAll(/betikler\(\[([^\]]+)\]/g)) for (const b of m[1].matchAll(/'([^']+)'/g)) gerekli.add(norm(b[1]));
  for (const m of js.matchAll(/\b(?:U|Urania)\.veri\('([\w-]+)'\)/g)) gerekli.add('veri/' + m[1] + '.json');
  /* Bilinen ve yalnız gezinmede görülmeyebilecek olanlar ayrıca: örtme işçisi ve tüm fontlar */
  gerekli.add('ortme_isci.js');
  fs.readdirSync(path.join(kok, 'font')).filter(f => f.endsWith('.woff2')).forEach(f => gerekli.add('font/' + f));
  expect(gerekli.size).toBeGreaterThan(30);
  expect([...gerekli].filter(u => !VARLIK.has(u)).sort()).toEqual([]);
});

test('Uygulama gezilirken yüklenen her aynı kökenli dosya ASSETS\'te', async ({ page, context, baseURL }) => {
  test.setTimeout(60000);
  const koken = new URL(baseURL).origin, yuklenen = new Set();
  /* context.on: sayfanın yanında işçilerin (ortme_isci.js) istekleri de gelir */
  context.on('request', r => {
    const u = new URL(r.url());
    if (u.origin === koken) yuklenen.add(norm(decodeURIComponent(u.pathname)));
  });
  await disAgiKes(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [] } } }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
  await celestrak(page);
  await page.clock.install({ time: new Date('2026-10-27T21:00:00+03:00') });
  const rotalar = [
    ['gok', '#gkOzet p'], ['ders/d1', 'article.ders h1'], ['deney/kepler', '.sahne canvas'], ['hesap', '#b-hesap:not([hidden])'],
    ['defter', '#dfListe'], ['defter/gorevler', '.bolum:not([hidden])'], ['tani', '.bolum:not([hidden])'], ['ar', '#arKanvas']
  ];
  for (const [r, hazir] of rotalar) {
    await page.goto('/index.html#' + r);
    await expect(page.locator(hazir).first(), r).toBeAttached();
    await page.waitForLoadState('networkidle');
  }
  /* Gezinmenin gerçekten dosya yüklediğini doğrula (boş küme her şeyi geçirirdi) */
  ['index.html', 'stil.css', 'uygulama.js', 'cizim.js', 'veri/dersler.json', 'veri/yildizlar.json'].forEach(f => expect(yuklenen, f).toContain(f));
  expect([...yuklenen].filter(u => !VARLIK.has(u)).sort()).toEqual([]);
});
