'use strict';
/* Haber görselleri ve çevrimdışı (denetim 2026-10-30, A4-02): img/haber/*.jpg sürümden bağımsız ayrı önbellekte
   ('urania-haber-gorsel') durur; sürüm değişince silinmez; haberden çıkarılan görsel önbellekten de temizlenir.
   Gerçek sw.js çalışır (serviceWorkers: 'allow'). Sürüm değişimi, testin kendi küçük sunucusunun sw.js içindeki
   SURUM değerini bellekte değiştirmesiyle taklit edilir (diskteki sw.js'e dokunulmaz). Dış ağ kesilir. */
const { test, expect } = require('@playwright/test');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { kok } = require('./yardim');

test.use({ serviceWorkers: 'allow' });

const GORSEL = 'urania-haber-gorsel';
const TUR = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const HABER = JSON.parse(fs.readFileSync(path.join(kok, 'veri/haberler.json'), 'utf8'));

/* Testin sunucusu: depoyu sunar; sw.js'in SURUM'u ve haberler.json bellekte değiştirilebilir */
function sunucuKur() {
  const d = { surum: null, haberler: null };
  const s = http.createServer((req, res) => {
    let p;
    try { p = decodeURIComponent(req.url.split('?')[0]); } catch (e) { res.writeHead(400); return res.end(); }
    if (p.endsWith('/')) p += 'index.html';
    const dosya = path.join(kok, p);
    if (!dosya.startsWith(kok + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(dosya, (h, veri) => {
      if (h) { res.writeHead(404); return res.end('yok'); }
      if (p === '/sw.js' && d.surum) veri = Buffer.from(veri.toString('utf8').replace(/const SURUM = '[^']+'/, "const SURUM = '" + d.surum + "'"));
      if (p === '/veri/haberler.json' && d.haberler) veri = Buffer.from(JSON.stringify(d.haberler));
      res.writeHead(200, { 'Content-Type': TUR[path.extname(dosya)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(veri);
    });
  });
  return new Promise(coz => s.listen(0, '127.0.0.1', () => coz({ s, d, url: 'http://127.0.0.1:' + s.address().port })));
}

let S;
test.beforeEach(async ({ context }) => {
  S = await sunucuKur();
  await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());   // SW istekleri de context rotasından geçer
});
test.afterEach(() => new Promise(coz => S.s.close(() => coz())));

/* SW'yi kaydet, sayfa denetime girsin, haberleri aç */
async function swIleAc(page) {
  await page.goto(S.url + '/index.html#haber');
  await page.evaluate(async () => { await navigator.serviceWorker.register('./sw.js'); await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.reload();
  await expect(page.locator('.hb-gorsel img').first()).toBeAttached();
}
/* İlk n görseli görünüme getirip yüklenmesini bekle; yollarını döndür */
async function gorselleriGor(page, n) {
  const yollar = [];
  for (let i = 0; i < n; i++) {
    const img = page.locator('.hb-gorsel img').nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(x => x.complete && x.naturalWidth > 0), { timeout: 10000 }).toBe(true);
    yollar.push(await img.evaluate(x => new URL(x.src).pathname.slice(1)));
  }
  return yollar;
}
const gorselOnbellek = page => page.evaluate(async ad => {
  if (!(await caches.has(ad))) return null;
  return (await (await caches.open(ad)).keys()).map(r => new URL(r.url).pathname.slice(1)).sort();
}, GORSEL);
const onbellekler = page => page.evaluate(() => caches.keys());
async function surumDegistir(page, yeni) {
  S.d.surum = yeni;
  await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r.update(); });
  await expect.poll(() => onbellekler(page), { timeout: 20000 }).toContain(yeni);
  /* activate bitti: eski sürüm önbelleği silindi */
  await expect.poll(async () => (await onbellekler(page)).filter(k => /^urania-v/.test(k)), { timeout: 20000 }).toEqual([]);
}

test('Görüntülenen haber görseli sürümsüz ayrı önbellekte, sürüm önbelleğinde değil', async ({ page }) => {
  test.setTimeout(60000);
  await swIleAc(page);
  const yollar = await gorselleriGor(page, 2);
  yollar.forEach(y => expect(y).toMatch(/^img\/haber\/[a-z0-9-]+\.jpg$/));
  await expect.poll(() => gorselOnbellek(page)).toEqual(expect.arrayContaining(yollar));
  const surumdeki = await page.evaluate(async () => {
    const k = (await caches.keys()).find(x => /^urania-v/.test(x));
    return (await (await caches.open(k)).keys()).map(r => new URL(r.url).pathname).filter(p => /img\/haber\//.test(p));
  });
  expect(surumdeki).toEqual([]);
});

test('SW sürümü değişip activate olunca görsel önbellekte kalır ve çevrimdışı görünür', async ({ page, context }) => {
  test.setTimeout(90000);
  await swIleAc(page);
  const [y] = await gorselleriGor(page, 1);
  await expect.poll(() => gorselOnbellek(page)).toContain(y);
  await surumDegistir(page, 'urania-test-yeni');
  const ks = await onbellekler(page);
  expect(ks, 'görsel önbelleği silme süzgecinden hariç').toContain(GORSEL);
  expect(await gorselOnbellek(page)).toContain(y);
  /* Çevrimdışı: sayfa ve görsel önbellekten */
  await context.setOffline(true);
  await page.reload();
  const img = page.locator('.hb-gorsel img[src="./' + y + '"]');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate(x => x.complete && x.naturalWidth > 0), { timeout: 10000 }).toBe(true);
  await expect(img.locator('xpath=ancestor::figure')).toBeVisible();
  await context.setOffline(false);
});

test('Haberden çıkarılan görsel önbellekten temizlenir (haber listesi yenilenince ve activate\'te)', async ({ page }) => {
  test.setTimeout(90000);
  await swIleAc(page);
  const [y1, y2] = await gorselleriGor(page, 2);
  await expect.poll(() => gorselOnbellek(page)).toEqual(expect.arrayContaining([y1, y2]));
  const cikar = dosya => { const v = JSON.parse(JSON.stringify(S.d.haberler || HABER)); v.haberler.forEach(h => { if (h.gorsel && h.gorsel.dosya === dosya) delete h.gorsel; }); return v; };
  /* (1) Ağdan yeni haber listesi gelince (sürüm aynı) */
  S.d.haberler = cikar(y1);
  await page.reload();
  await expect(page.locator('.hb-gorsel img').first()).toBeAttached();
  await expect.poll(() => gorselOnbellek(page), { timeout: 10000 }).not.toContain(y1);
  expect(await gorselOnbellek(page), 'listede kalan görsel silinmez').toContain(y2);
  /* (2) Sürüm değişince activate'te (sayfa yenilenmeden; yeni sürümün haberler.json'u kurulumda alınır) */
  S.d.haberler = cikar(y2);
  await surumDegistir(page, 'urania-test-yeni');
  await expect.poll(() => gorselOnbellek(page), { timeout: 10000 }).not.toContain(y2);
});

test('Bozuk haber listesi görsel önbelleğini boşaltmaz', async ({ page }) => {
  test.setTimeout(60000);
  await swIleAc(page);
  const [y] = await gorselleriGor(page, 1);
  await expect.poll(() => gorselOnbellek(page)).toContain(y);
  S.d.haberler = { bozuk: true };   // haberler dizisi yok
  await page.evaluate(() => fetch('./veri/haberler.json').then(r => r.text()));
  await page.waitForTimeout(500);
  expect(await gorselOnbellek(page)).toContain(y);
});
