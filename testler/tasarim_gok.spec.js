'use strict';
/* Tasarım denetimi (A): Gökyüzü (#gok), Gökyüzüne bak (#ar), Tanı (#tani) — görsel kusurların regresyon testleri.
   Ağ yok: dış istekler kesilir, CelesTrak fikstürü, Open-Meteo sahte JSON; saat ve konum sabit. */
const { test, expect } = require('@playwright/test');
const { celestrak, disAgiKes } = require('./yardim');

const KONUM = { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' };
const TROMSO = { ad: 'Tromsø', enlem: 69.65, boylam: 18.96, yukseklik: 0, oto: false, saatDilimi: 'Europe/Oslo' };

function havaJson(bulut, yagisOl) {
  const t0 = Math.floor(new Date('2026-10-28T00:00:00Z').getTime() / 3600e3) * 3600;
  const time = Array.from({ length: 72 }, (_, i) => t0 + i * 3600);
  const f = (v, i) => (typeof v === 'function' ? v(i) : v);
  return { hourly: { time, cloud_cover: time.map((_, i) => f(bulut, i)), cloud_cover_low: time.map(() => 40), cloud_cover_mid: time.map(() => 20),
    cloud_cover_high: time.map(() => 10), relative_humidity_2m: time.map(() => 70), wind_speed_10m: time.map(() => 9),
    precipitation_probability: time.map((_, i) => f(yagisOl || 0, i)), precipitation: time.map(() => 0) } };
}

async function kur(page, s) {
  s = s || {};
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await celestrak(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: s.hava || havaJson(i => [10, 80, 50, 95, 5, 60][i % 6], i => (i % 4 === 0 ? 60 : 10)) }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
  await page.clock.install({ time: new Date(s.zaman || '2026-10-28T20:30:00+03:00') });
  await page.addInitScript(([k, kir]) => {
    if (sessionStorage.getItem('tg_k')) return; sessionStorage.setItem('tg_k', '1');
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify(k));
    if (kir) localStorage.setItem('urania_kirmizi', 'true');
  }, [s.konum || KONUM, !!s.kirmizi]);
}
async function gokHazir(page) {
  await page.goto('/index.html#gok');
  await page.waitForSelector('#gkPlan li.plan-gezegen', { timeout: 20000 });
}
const kesisir = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/* Ekran görüntüsünde kırmızı mod sızıntısı: max(G,B) > 0,35·R + 20 olan piksel sayısı (tarayıcıda çözülür) */
async function sizinti(page, png) {
  return page.evaluate(async b64 => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (Math.max(d[i + 1], d[i + 2]) > 0.35 * d[i] + 20) n++;
    return n;
  }, png.toString('base64'));
}

test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });

test.describe('Gök levhası', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('Etiketler hedef halkalarının, radyantların ve Güneş\'in üstüne yazılmaz; Ay\'ın adı her zaman var', async ({ page }) => {
    await kur(page);
    await gokHazir(page);
    const y = await page.evaluate(() => window.UraniaGozlem.durum.harita.yerlesim());
    expect(y.etiketler.map(e => e.metin)).toContain('Ay');
    const sert = y.engeller.filter(e => !e.yumusak).map(e => ({ x: e.x - e.r, y: e.y - e.r, w: 2 * e.r, h: 2 * e.r }));
    expect(sert.length).toBeGreaterThan(20);   // hedef halkaları da engel
    const cakisan = y.etiketler.filter(e => e.tur < 2 && sert.some(b => kesisir(e, b))).map(e => e.metin);
    expect(cakisan).toEqual([]);
  });

  test('Kutup günü (Tromsø, Haziran): Güneş diski etiketlerin altında kalmaz', async ({ page }) => {
    await kur(page, { konum: TROMSO, zaman: '2026-06-25T23:30:00+02:00' });
    await page.goto('/index.html#gok');
    await page.waitForSelector('#gkOzet p');
    const y = await page.evaluate(() => window.UraniaGozlem.durum.harita.yerlesim());
    const gunes = y.engeller.find(e => e.r === 10);
    expect(gunes).toBeTruthy();
    const k = { x: gunes.x - 10, y: gunes.y - 10, w: 20, h: 20 };
    expect(y.etiketler.filter(e => e.tur < 2 && kesisir(e, k)).map(e => e.metin)).toEqual([]);
  });

  test('Bilgi kutusu 320 px\'te kabın yarısına sıkışmaz; alttaki cisimde üste çıkar ve cismi örtmez', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await kur(page);
    await gokHazir(page);
    await page.locator('.levha-kap').scrollIntoViewIfNeeded();
    const kv = await page.locator('#gkLevha').boundingBox();
    const f = await page.evaluate(() => window.UraniaGozlem.durum.harita.yerlesim().etiketler.find(e => e.metin === 'Fomalhaut'));
    expect(f).toBeTruthy();
    const nokta = { x: kv.x + f.x - 6, y: kv.y + f.y + f.h / 2 };
    await page.mouse.click(nokta.x, nokta.y);
    const b = page.locator('#gkBilgi');
    await expect(b).toBeVisible();
    await expect(b).toContainText('Fomalhaut');
    const r = await b.boundingBox();
    expect(r.width).toBeGreaterThan(200);          // eskiden 144 px, dört satır
    expect(r.height).toBeLessThan(70);
    expect(nokta.y < r.y || nokta.y > r.y + r.height).toBe(true);   // tıklanan cisim kutunun altında kalmaz
  });

  test('Yatay telefonda (915×412) levha ekran yüksekliğine sığar', async ({ page }) => {
    await page.setViewportSize({ width: 915, height: 412 });
    await kur(page);
    await gokHazir(page);
    const h = await page.locator('#gkLevha').evaluate(c => c.getBoundingClientRect().height);
    expect(h).toBeLessThanOrEqual(412 - 56);
  });

  test('Kırmızı modda levha, bulut çubukları ve konum paneli yalnız kırmızı/siyah', async ({ page }) => {
    await kur(page, { kirmizi: true });
    await gokHazir(page);
    await page.locator('.hava-saat').nth(3).click();
    expect(await sizinti(page, await page.locator('.levha-kap').screenshot())).toBe(0);
    expect(await sizinti(page, await page.locator('#gkHava').screenshot())).toBe(0);
    await page.locator('#gkKonumDegis').click();
    expect(await sizinti(page, await page.locator('#gkKonumPanel').screenshot())).toBe(0);
  });
});

test.describe('Gökyüzü listeleri ve denetimler', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('Jüpiter şeması: dört uydunun hepsi çizimin içinde (eğik yörünge düzlemi)', async ({ page }) => {
    await kur(page);
    await gokHazir(page);
    const s = await page.locator('.jupiter-sema svg').evaluate(svg => {
      const H = svg.viewBox.baseVal.height, W = svg.viewBox.baseVal.width;
      return { H, W, ls: [...svg.querySelectorAll('circle.uydu, circle.uydu-gizli')].map(c => [Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))]) };
    });
    expect(s.ls.length).toBe(4);
    s.ls.forEach(([x, y]) => { expect(x).toBeGreaterThan(0); expect(x).toBeLessThan(s.W); expect(y).toBeGreaterThan(2); expect(y).toBeLessThan(s.H - 2); });
  });

  test('Saat etiketi ile gök durumu dar ekranda bitişmez (kutup gecesi, 360 px)', async ({ page }) => {
    await kur(page, { konum: TROMSO, zaman: '2026-12-20T12:00:00+01:00' });
    await page.goto('/index.html#gok');
    await page.waitForSelector('#gkOzet p');
    await expect(page.locator('#gkGunesDurum')).toHaveText('Sivil alacakaranlık');
    const [a, b] = await page.locator('.zaman-kontrol .etiket > span').evaluateAll(ls => ls.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }));
    expect(kesisir(a, b)).toBe(false);
    /* ya alt satıra iner ya da arada en az 8 px kalır (eskiden "20 Aralık" ile "Sivil" bitişikti) */
    expect(b.y >= a.y + a.h - 1 || b.x - (a.x + a.w) >= 8).toBe(true);
    const sag = await page.locator('.zaman-kontrol').evaluate(e => e.getBoundingClientRect().right);
    expect(b.x + b.w).toBeLessThanOrEqual(sag + 0.5);
  });

  test('Bulut çubukları: 360 px\'te her saat en az 24 px; seçili saat aria-pressed ve çerçeveyle; açıklama renk adı kullanmaz', async ({ page }) => {
    await kur(page);
    await gokHazir(page);
    await page.waitForSelector('.hava-saat');
    const genis = await page.locator('.hava-saat').evaluateAll(ls => ls.map(e => e.getBoundingClientRect().width));
    expect(Math.min(...genis)).toBeGreaterThanOrEqual(24);
    const s = page.locator('.hava-saat').nth(2);
    await s.click();
    await expect(s).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.hava-saat[aria-pressed="true"]')).toHaveCount(1);
    expect(await s.locator('.hava-iz').evaluate(e => getComputedStyle(e).outlineStyle)).toBe('solid');
    await expect(page.locator('#gkHava .kaynak')).not.toContainText(/gri|mavi/i);
  });

  test('"Bu gece alçakta kalanlar" ve "Takvimin tamamı" en az 44 px; takvim düğmesi defter bağlantısıyla aynı hizada', async ({ page }) => {
    await kur(page);
    await gokHazir(page);
    const h = await page.locator('#b-gok details.aciklama > summary').evaluateAll(ls => ls.filter(e => e.offsetParent).map(e => e.getBoundingClientRect().height));
    expect(h.length).toBeGreaterThan(0);
    h.forEach(x => expect(x).toBeGreaterThanOrEqual(44));
    await page.waitForSelector('#gkAlgol .takvim-bag');
    const [t, d] = await page.locator('#gkAlgol li').first().evaluate(li => [li.querySelector('.takvim-bag').getBoundingClientRect().x + 4, li.querySelector('.defter-bag a').getBoundingClientRect().x]);
    expect(Math.abs(t - d)).toBeLessThanOrEqual(1);
    expect(await page.locator('#gkAlgol .kaynak-satir .kaynak').evaluate(e => getComputedStyle(e).display)).toBe('block');
  });

  test('Konum paneli: GPS ve hata iletisi düğmenin altında, uyarı renginde; otomatikte "Varsayılana dön" gizli', async ({ page }) => {
    await kur(page);
    await gokHazir(page);
    await page.locator('#gkKonumDegis').click();
    expect(await page.evaluate(() => document.querySelector('#gkGps').nextElementSibling.id)).toBe('gkKDurum');
    await page.fill('#gkKEnlem', 'abc');
    await page.locator('#gkKKaydet').click();
    const d = page.locator('#gkKDurum');
    await expect(d).toContainText('Enlem −90 ile 90');
    await expect(d).toHaveClass(/hata/);
    const [renk, uyari, kenar] = await page.evaluate(() => [getComputedStyle(document.querySelector('#gkKDurum')).color,
      getComputedStyle(document.querySelector('#gkKonumPanel')).getPropertyValue('--uyari').trim(), getComputedStyle(document.querySelector('#gkKEnlem')).borderTopColor]);
    expect(renk).toBe('rgb(224, 176, 98)');
    expect(uyari.toUpperCase()).toBe('#E0B062');
    expect(kenar).toBe('rgb(224, 176, 98)');
    await page.locator('#gkKOto').check();
    await expect(page.locator('#gkKSifirla')).toBeHidden();
    await page.locator('#gkKOto').uncheck();
    await expect(page.locator('#gkKSifirla')).toBeVisible();
  });

  test('Gök verisi yüklenemezse ileti Türkçe (tarayıcının İngilizce hata metni yok)', async ({ page }) => {
    await kur(page);
    await page.route('**/veri/yildizlar*', r => r.abort());
    await page.goto('/index.html#gok');
    const k = page.locator('#b-gok .hata-kutu');
    await expect(k).toContainText('yüklenemedi');
    await expect(k).not.toContainText(/failed|fetch|error/i);
  });
});

async function yonVer(page, a, b, g) {
  await page.evaluate(([a, b, g]) => {
    for (let i = 0; i < 60; i++) window.dispatchEvent(new DeviceOrientationEvent(('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation', { alpha: a, beta: b, gamma: g, absolute: true }));
  }, [a, b, g]);
  await page.waitForTimeout(200);
}
const kutu = async l => l.evaluate(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });

test.describe('Gökyüzüne bak', () => {
  test('320×640: hedef şeridi iki satıra insin, durum kutusuyla üst üste binmez; üst düğmeler 44 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await kur(page);
    await page.goto('/index.html#ar');
    await page.waitForTimeout(300);
    await yonVer(page, ((6.08 - 132.52) % 360 + 360) % 360, 90 + 39.47, 0);
    await page.locator('#arBul').click();
    await page.locator('#arAra').fill('vega');
    await page.locator('#arSonuc button').first().click();
    await expect(page.locator('#arHedefSerit')).toBeVisible();
    await expect(page.locator('#arDurum')).toBeVisible();
    const s = await kutu(page.locator('#arHedefSerit')), d = await kutu(page.locator('#arDurum')), u = await kutu(page.locator('.ar-ust'));
    expect(kesisir(s, d)).toBe(false);
    expect(s.y).toBeGreaterThanOrEqual(u.y + u.h - 0.5);
    const yuk = await page.locator('.ar-ust .dugme:visible').evaluateAll(ls => ls.map(e => e.getBoundingClientRect().height));
    yuk.forEach(h => expect(h).toBeGreaterThanOrEqual(44));
  });

  for (const [ad, vp, aci] of [['dikey 320×640', { width: 320, height: 640 }, 0], ['yatay 915×412', { width: 915, height: 412 }, 90]]) {
    test(`Hizala paneli ortadaki halkayı örtmez (${ad})`, async ({ page }) => {
      await page.setViewportSize(vp);
      await kur(page);
      if (aci) await page.addInitScript(() => { try { Object.defineProperty(screen.orientation, 'angle', { get: () => 90, configurable: true }); } catch (e) { /* yok */ } });
      await page.goto('/index.html#ar');
      await page.waitForTimeout(300);
      if (aci) await yonVer(page, 90, 0, -90); else await yonVer(page, 0, 120, 0);
      await page.locator('#arHizalaDugme').click();
      await expect(page.locator('#arHizala')).toBeVisible();
      const p = await kutu(page.locator('#arHizala'));
      const halka = { x: vp.width / 2 - 28, y: vp.height / 2 - 28, w: 56, h: 56 };   // nişangâh ve çizgileri
      expect(kesisir(p, halka)).toBe(false);
      expect(p.y + p.h).toBeLessThanOrEqual(vp.height);
    });
  }

  test('Kırmızı modda AR ekranı (bul, hizala, şerit) yalnız kırmızı/siyah', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await kur(page, { kirmizi: true });
    await page.goto('/index.html#ar');
    await page.waitForTimeout(300);
    await yonVer(page, ((6.08 - 132.52) % 360 + 360) % 360, 90 + 39.47, 0);
    await page.locator('#arBul').click();
    await page.locator('#arAra').fill('vega');
    expect(await sizinti(page, await page.screenshot())).toBe(0);
    await page.locator('#arSonuc button').first().click();
    await page.locator('#arHizalaDugme').click();
    expect(await sizinti(page, await page.screenshot())).toBe(0);
  });
});

test('Tanı: rapor ve düğmeler 320 px\'te taşmaz', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await kur(page);
  await page.goto('/index.html#tani');
  await expect(page.locator('#tnRapor')).toContainText('URANIA TANI');
  const t = await page.evaluate(() => ({ sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth, sag: document.querySelector('#tnRapor').getBoundingClientRect().right }));
  expect(t.sw).toBeLessThanOrEqual(t.cw);
  expect(t.sag).toBeLessThanOrEqual(320);
});
