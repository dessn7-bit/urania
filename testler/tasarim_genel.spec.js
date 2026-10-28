'use strict';
/* Tasarım denetimi (2026-10-28), genel kabuk: alt menüde etkin sekmenin renk dışı işareti, sürüm şeridinin alt menüyle
   çakışmaması, üst bar ve geri bağlantısının dokunma alanı, üst simge rakamlarının tek yazı tipinden gelmesi,
   kırmızı modda kaydırma çubuğu ve tarayıcı çubuğu rengi. Ağ isteği atılmaz: yerel sunucu dışındaki her istek
   kesilir; hava ve yer adı sahte yanıtla, CelesTrak testler/yardim.js fikstürüyle karşılanır. */
const { test, expect } = require('@playwright/test');
const { celestrak } = require('./yardim');

const SABIT_AN = new Date('2026-10-28T20:30:00+03:00');
const KONUM = { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' };

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ status: 503, body: '' }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: { suburb: 'Kadıköy' } } }));
  await celestrak(page);
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await page.addInitScript(k => {
    if (!sessionStorage.getItem('tg_kuruldu')) {
      sessionStorage.setItem('tg_kuruldu', '1');
      localStorage.setItem('urania_konumOto', 'false');
      localStorage.setItem('urania_konum', JSON.stringify(k));
    }
    window.__oran = (a, b) => {
      const rgb = s => { const c = document.createElement('canvas').getContext('2d'); c.fillStyle = '#000'; c.fillStyle = s; const x = c.fillStyle;
        return x[0] === '#' ? [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)) : x.match(/[\d.]+/g).map(Number).slice(0, 3); };
      const L = c => { const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
      const [p, q] = [L(rgb(a)), L(rgb(b))].sort((m, n) => n - m); return (p + 0.05) / (q + 0.05);
    };
  }, KONUM);
  await page.clock.install({ time: SABIT_AN });
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function kirmizi(page) {
  await page.evaluate(() => localStorage.setItem('urania_kirmizi', 'true'));
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/kirmizi/);
}

test('Alt menü: etkin sekme renk dışında üst çubukla da belli; çubuk iki modda zeminde en az 3:1', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/index.html#ders');
  await expect(page.locator('.ders-liste li').first()).toBeVisible();
  for (const mod of ['normal', 'kirmizi']) {
    if (mod === 'kirmizi') await kirmizi(page);
    const r = await page.evaluate(() => [...document.querySelectorAll('.alt-sekmeler a')].map(a => {
      const s = getComputedStyle(a, '::before');
      return { ad: a.textContent.trim(), etkin: a.getAttribute('aria-current') === 'page', icerik: s.content, h: parseFloat(s.height), w: parseFloat(s.width), renk: s.backgroundColor,
        oran: s.content === 'none' ? 0 : window.__oran(s.backgroundColor, getComputedStyle(document.querySelector('.alt-sekmeler')).backgroundColor) };
    }));
    const etkin = r.filter(x => x.etkin);
    expect(etkin.map(x => x.ad), mod).toEqual(['Dersler']);
    expect(etkin[0].h, mod).toBe(3);
    expect(etkin[0].w, mod).toBeGreaterThanOrEqual(36);
    expect(etkin[0].oran, mod + ' çubuk karşıtlığı').toBeGreaterThanOrEqual(3);
    for (const x of r.filter(y => !y.etkin)) expect(x.icerik, mod + ' ' + x.ad).toBe('none');
  }
});

test('Sürüm şeridi alt menünün üstüne binmez (360, 800 ve 1024 px)', async ({ page }) => {
  for (const [w, h] of [[360, 800], [800, 1280], [1024, 768]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/index.html#ders');
    await expect(page.locator('.ders-liste li').first()).toBeVisible();
    /* uygulama.js'in controllerchange'te eklediği işaretlemenin aynısı (sınamada servis işçisi kapalı) */
    const r = await page.evaluate(() => {
      const d = document.createElement('div'); d.id = 'surumSerit'; d.className = 'surum-serit'; d.setAttribute('role', 'status');
      d.innerHTML = 'Urania güncellendi. <button type="button" class="dugme dolu">Yenile</button>'; document.body.appendChild(d);
      const s = d.getBoundingClientRect(), a = document.querySelector('.alt-sekmeler');
      const ust = getComputedStyle(a).display === 'none' ? innerHeight : a.getBoundingClientRect().top;
      return { alt: s.bottom, sinir: ust, sag: s.right };
    });
    expect(r.alt, w + ' px').toBeLessThanOrEqual(r.sinir - 8);
    expect(r.sag, w + ' px').toBeLessThanOrEqual(w);
  }
});

test('Üst bar: Kırmızı ışık, "Urania" ve masaüstü sekmeleri en az 44 px dokunma alanı; bar 56 px kalır', async ({ page }) => {
  for (const [w, h] of [[360, 800], [1024, 768]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkPlan li').first()).toBeVisible();
    const r = await page.evaluate(() => {
      /* Öğenin dokunulan alanı: dikeyde 1 px adımla, elementFromPoint öğenin kendisini (ya da içini) döndürdüğü aralık */
      const yukseklik = e => { const b = e.getBoundingClientRect(), x = b.left + b.width / 2; let n = 0;
        for (let y = Math.max(0, b.top - 30); y < b.bottom + 30; y++) { const t = document.elementFromPoint(x, y); if (t && (t === e || e.contains(t))) n++; } return n; };
      const hedef = [...document.querySelectorAll('.marka, .kirmizi-dugme, .sekmeler a')].filter(e => e.getBoundingClientRect().width > 0);
      return { ust: Math.round(document.querySelector('.ust').getBoundingClientRect().height), alan: hedef.map(e => [e.textContent.trim(), yukseklik(e)]) };
    });
    expect(r.ust, w + ' px').toBeLessThanOrEqual(57);
    for (const [ad, n] of r.alan) expect(n, w + ' px ' + ad).toBeGreaterThanOrEqual(44);
  }
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole('button', { name: 'Kırmızı ışık' }).click({ position: { x: 20, y: -4 }, force: true });   // görünür kenarın 4 px üstü
  await expect(page.locator('html')).toHaveClass(/kirmizi/);
});

test('Geri bağlantısı (Tüm deneyler, Defter): 44 px dokunma alanı, ‹ işareti, düzen yeri değişmez', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const [rota, ad] of [['deney/kepler', 'Tüm deneyler'], ['defter/gorevler', 'Defter']]) {
    await page.goto('/index.html#' + rota);
    const g = page.locator('.bolum:not([hidden]) .geri').first();
    await expect(g).toHaveText(ad);
    const r = await g.evaluate(e => {
      const b = e.getBoundingClientRect(), x = b.left + 10; let n = 0;
      for (let y = b.top - 30; y < b.bottom + 30; y++) { const t = document.elementFromPoint(x, y); if (t === e) n++; }
      const h1 = e.closest('.bolum').querySelector('h1').getBoundingClientRect();
      return { n, isaret: getComputedStyle(e, '::before').content, h1: h1.top - b.bottom };
    });
    expect(r.n, rota).toBeGreaterThanOrEqual(44);
    expect(r.isaret, rota).toContain('‹');
    expect(r.h1, rota + ': başlık bağlantının hemen altında').toBeLessThan(2);
  }
});

test('Üst simge rakamları tek yazı tipinden: "10²⁴", "10¹⁸" içindeki ² ¹ ile ⁴ ⁸ aynı yazı tipiyle çizilir', async ({ page }) => {
  await page.goto('/index.html#hesap');
  await expect(page.locator('#b-hesap .sonuc').first()).toBeVisible();
  await page.evaluate(() => {
    for (const [id, st] of [['ss1', 'font:400 18px var(--sans)'], ['ss2', 'font:400 18px var(--serif)'], ['ss3', 'font:italic 400 18px var(--serif)']]) {
      /* eksi (⁻) ve ⁰ yok: kapsayıcıdaki Liberation Serif'te bulunmuyor (Android'in Noto Serif'inde var).
         Gövdeye eklenir: bölüm innerHTML ile yeniden çizilebilir. */
      const s = document.createElement('span'); s.id = id; s.style.cssText = st; s.textContent = '²⁴¹⁸³⁵';
      document.body.appendChild(s);
    }
  });
  await page.evaluate(() => document.fonts.ready);
  const c = await page.context().newCDPSession(page);
  await c.send('DOM.enable'); await c.send('CSS.enable');
  const { root } = await c.send('DOM.getDocument', { depth: -1 });
  for (const id of ['ss1', 'ss2', 'ss3']) {
    const { nodeId } = await c.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#' + id });
    const { fonts } = await c.send('CSS.getPlatformFontsForNode', { nodeId });
    expect(fonts.map(f => f.familyName).filter(f => !/Spectral|Plex/.test(f)), id + ' yedek yazı tipleri').toHaveLength(1);
    expect(fonts.some(f => /Spectral|Plex/.test(f.familyName)), id + ': ² ³ ¹ bizim yazı tipimizden gelmemeli').toBe(false);
  }
  /* Aralık dışı bırakılan yalnız bu üçü: Latin-1'in geri kalanı (°, ×, ·, ½, é…) yazı tipimizde kalır */
  const araliklar = await page.evaluate(() => [...document.styleSheets].flatMap(s => [...s.cssRules]).filter(k => k instanceof CSSFontFaceRule && /latin-\d/.test(k.style.getPropertyValue('src'))).map(k => k.style.getPropertyValue('unicode-range')));
  expect(araliklar).toHaveLength(6);
  for (const a of araliklar) expect(a.replace(/\s/g, '').toUpperCase()).toContain('U+0-B1,U+B4-B8,U+BA-FF');
});

test('Kırmızı mod: tarayıcı çubuğu siyah, kaydırma çubuğu kırmızı; normal modda varsayılan', async ({ page }) => {
  await page.goto('/index.html#gok');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0F1B2D');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarColor)).toBe('auto');
  await kirmizi(page);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#000000');
  const sb = await page.evaluate(() => getComputedStyle(document.querySelector('.bolum')).scrollbarColor);   // kalıtımla iç kaydırıcılara da
  const renk = sb.match(/\d+/g).map(Number);
  expect(renk.slice(0, 3)).toEqual([230, 58, 40]);
  expect(renk.slice(3, 6)).toEqual([0, 0, 0]);
});
