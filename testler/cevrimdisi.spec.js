'use strict';
/* v49 çevrimdışı çalışma (Playwright projesi "cevrimdisi": service worker serbest). Gerçek sw.js çalışır; testin kendi küçük
   sunucusu depoyu sunar ve sw.js'teki SURUM'u bellekte değiştirebilir (diskteki sw.js'e dokunulmaz). Dış ağ kesilir.
   1) serviceWorker.ready → bütün ASSETS önbellekte; context.setOffline(true) ile yeniden yüklenince Gökyüzü, Dersler, Defter ve
      Haberler açılıyor mu (çevrimdışıyken bütün ağ, yerel sunucu dahil, kapalı).
   2) Yeni SURUM eski önbellekleri siliyor mu; haber görsellerinin kalıcı önbelleği ('urania-haber-gorsel') kalıyor mu. */
const { test, expect } = require('@playwright/test');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { kok } = require('./yardim');

const TUR = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const SW = fs.readFileSync(path.join(kok, 'sw.js'), 'utf8');
const SURUM = SW.match(/const SURUM = '([^']+)'/)[1];
const ASSETS = (SW.match(/const ASSETS = \[([\s\S]*?)\];/)[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));

function sunucuKur() {
  const d = { surum: null, istek: 0 };
  const s = http.createServer((req, res) => {
    d.istek++;
    let p;
    try { p = decodeURIComponent(req.url.split('?')[0]); } catch (e) { res.writeHead(400); return res.end(); }
    if (p.endsWith('/')) p += 'index.html';
    const dosya = path.join(kok, p);
    if (!dosya.startsWith(kok + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(dosya, (h, veri) => {
      if (h) { res.writeHead(404); return res.end('yok'); }
      if (p === '/sw.js' && d.surum) veri = Buffer.from(veri.toString('utf8').replace(/const SURUM = '[^']+'/, "const SURUM = '" + d.surum + "'"));
      res.writeHead(200, { 'Content-Type': TUR[path.extname(dosya)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(veri);
    });
  });
  return new Promise(coz => s.listen(0, '127.0.0.1', () => coz({ s, d, url: 'http://127.0.0.1:' + s.address().port })));
}

let S;
test.beforeEach(async ({ context, page }) => {
  S = await sunucuKur();
  await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await page.addInitScript(() => { localStorage.setItem('urania_konumOto', 'false'); });
});
test.afterEach(() => new Promise(coz => S.s.close(() => coz())));

/* SW'yi kaydet (uygulama yalnız https'te kendisi kaydeder; 127.0.0.1 güvenli bağlam sayılır), denetime girsin */
async function swKur(page) {
  await page.goto(S.url + '/index.html#gok');
  await page.evaluate(async () => { await navigator.serviceWorker.register('./sw.js'); await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 });
}
const onbellekler = page => page.evaluate(() => caches.keys());

test('Çevrimdışı: bütün ASSETS önbellekte; ağ tümüyle kesikken Gökyüzü, Dersler, Defter ve Haberler açılır', async ({ page, context }) => {
  test.setTimeout(120000);
  await swKur(page);
  const eksik = await page.evaluate(async ([ad, ls]) => {
    const c = await caches.open(ad);
    const yok = [];
    for (const u of ls) if (!(await c.match(new URL(u, location.href).href, { ignoreSearch: true }))) yok.push(u);
    return yok;
  }, [SURUM, ASSETS]);
  expect(eksik, 'önbellekte olmayan ASSETS').toEqual([]);
  await context.setOffline(true);
  const once = S.d.istek;
  /* yeniden yükle: sayfa ve bütün dosyalar önbellekten */
  await page.reload();
  await expect(page.locator('#b-gok h1')).toHaveText('Bu gece gökyüzü', { timeout: 20000 });
  await expect(page.locator('#gkLevha')).toBeVisible();
  await page.goto(S.url + '/index.html#ders');
  await expect(page.locator('#b-ders')).toBeVisible();
  await expect(page.locator('#b-ders a[href^="#ders/d"]').first()).toBeVisible({ timeout: 20000 });
  await page.goto(S.url + '/index.html#ders/d10');
  await expect(page.locator('#b-ders h1')).toContainText('Ay', { timeout: 20000 });
  await page.goto(S.url + '/index.html#defter');
  await expect(page.locator('#b-defter h1')).toBeVisible({ timeout: 20000 });
  await page.goto(S.url + '/index.html#haber');
  await expect(page.locator('article.haber').first()).toBeVisible({ timeout: 20000 });
  expect(S.d.istek, 'çevrimdışıyken sunucuya hiç istek gitmedi').toBe(once);
  await context.setOffline(false);
  expect(page.hatalar).toEqual([]);
});

test('Yeni SURUM eski önbellekleri siler; haber görsellerinin kalıcı önbelleği kalır', async ({ page }) => {
  test.setTimeout(120000);
  await swKur(page);
  /* eski bir sürüm önbelleği, uydu görüntüsü önbelleği ve listedeki bir haber görseli hazırlanır */
  const haber = JSON.parse(fs.readFileSync(path.join(kok, 'veri/haberler.json'), 'utf8')).haberler.find(h => h.gorsel && h.gorsel.dosya);
  await page.evaluate(async ([g]) => {
    await (await caches.open('urania-v1')).put(new Request('./eski.txt'), new Response('eski'));
    await (await caches.open('urania-uydu-son')).put(new Request('./uydu.png'), new Response('uydu'));
    await (await caches.open('urania-haber-gorsel')).put(new Request('./' + g), new Response('jpg'));
  }, [haber.gorsel.dosya]);
  expect(await onbellekler(page)).toEqual(expect.arrayContaining([SURUM, 'urania-v1', 'urania-uydu-son', 'urania-haber-gorsel']));
  S.d.surum = 'urania-test-yeni';
  /* yeni işçinin "activated" olmasını bekle: önbellek install'da açılır, eskiler activate'te silinir; yalnız önbelleğin
     varlığını beklemek yarışa açıktı (doğrulayıcı bulgusu) */
  const durum = await page.evaluate(async () => {
    const r = await navigator.serviceWorker.getRegistration();
    await r.update();
    const w = r.installing || r.waiting;
    if (!w) return 'yeni işçi yok';
    if (w.state !== 'activated') await new Promise((coz, red) => {
      const sure = setTimeout(() => red(new Error('activated olmadı: ' + w.state)), 30000);
      w.addEventListener('statechange', () => { if (w.state === 'activated') { clearTimeout(sure); coz(); } if (w.state === 'redundant') { clearTimeout(sure); red(new Error('redundant')); } });
    });
    return w.state;
  });
  expect(durum).toBe('activated');
  expect(await onbellekler(page)).toContain('urania-test-yeni');
  await expect.poll(async () => (await onbellekler(page)).filter(k => k !== 'urania-test-yeni' && k !== 'urania-haber-gorsel').filter(k => /^urania-/.test(k)), { timeout: 30000 }).toEqual([]);
  const ks = await onbellekler(page);
  expect(ks).toContain('urania-haber-gorsel');
  expect(ks).not.toContain(SURUM);
  expect(await page.evaluate(async g => !!(await (await caches.open('urania-haber-gorsel')).match('./' + g)), haber.gorsel.dosya), 'haber görseli silinmedi').toBe(true);
});
