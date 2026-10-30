'use strict';
/* Deney açıklamaları: "Bu deney ne?", "Ekranda ne var?" (çizim ve kontrol lejantı), "Gerçek dünyada", "Neler dene",
   "İlgili dersler". Ağ isteği atılmaz: yerel sunucu dışındaki her istek kesilir; saat sabit, konum otomatik değil. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { disAgiKes, kok } = require('./yardim');

/* Eski on deneyin rehberi veri/deney_rehber.json'da; modül deneylerininki veri/deney/<kimlik>.json'un "rehber" alanında.
   DENEY=kimlik ortam değişkeniyle yalnız bir deney sınanır (yeni deney yazarken). */
const R = JSON.parse(fs.readFileSync(path.join(kok, 'veri/deney_rehber.json'), 'utf8'));
const MODUL_KLS = path.join(kok, 'veri/deney');
(fs.existsSync(MODUL_KLS) ? fs.readdirSync(MODUL_KLS) : []).filter(f => f.endsWith('.json')).forEach(f => { R[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(MODUL_KLS, f), 'utf8')).rehber; });
const DENEYLER = Object.keys(R).filter(id => !process.env.DENEY || process.env.DENEY.split(',').includes(id));
const DERS = new Set(JSON.parse(fs.readFileSync(path.join(kok, 'veri/dersler.json'), 'utf8')).dersler.map(d => d.id));

async function kur(page, ek) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await page.clock.install({ time: new Date('2026-10-28T20:30:00+03:00') });
  await page.addInitScript(e => {
    localStorage.setItem('urania_konumOto', 'false');
    Object.entries(e || {}).forEach(([a, v]) => localStorage.setItem('urania_' + a, v));
  }, ek || {});
}
test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });

/* Sayfadaki her kontrolün (kaydırıcı, onay kutusu, düğme) lejantta bir karşılığı var mı; lejanttaki her kontrol sayfada var mı */
async function kontrolDenetimi(page) {
  return page.evaluate(() => {
    const kap = document.getElementById('deneyKap');
    const lejant = [...kap.querySelectorAll('.dn-kontroller li[data-kontrol]')].map(li => li.dataset.kontrol);
    const ogeler = [...kap.querySelectorAll('input, button, select')].filter(g => !g.closest('.dn-ek'));
    const eksik = ogeler.filter(g => !lejant.some(s => g.matches(s) || g.closest(s))).map(g => g.id || g.textContent.trim() || g.outerHTML.slice(0, 60));
    const fazla = lejant.filter(s => !kap.querySelector(s));
    return { eksik, fazla, sayi: ogeler.length, lejant: lejant.length };
  });
}

test('Veri: her deneyde açıklama alanları dolu, kaynaklı, dersler var olan derslere bağlı', () => {
  for (const id of DENEYLER) {
    const r = R[id];
    expect(r, id).toBeTruthy();
    const cumle = s => (s.match(/[.?!](\s|$)/g) || []).length;
    expect(cumle(r.ne), id + ' ne').toBeGreaterThanOrEqual(2);
    expect(cumle(r.ne), id + ' ne').toBeLessThanOrEqual(4);
    expect(cumle(r.gercek), id + ' gerçek').toBeGreaterThanOrEqual(2);
    expect(cumle(r.gercek), id + ' gerçek').toBeLessThanOrEqual(4);
    expect(r.gercekKaynaklar.length, id).toBeGreaterThan(0);
    r.gercekKaynaklar.forEach(k => expect(k.url, id).toMatch(/^https:\/\//));
    expect(r.ekran.cizim.length, id).toBeGreaterThan(0);
    expect(r.ekran.kontroller.length, id).toBeGreaterThan(0);
    expect(r.adimlar.length, id + ' adım').toBeGreaterThanOrEqual(5);
    expect(r.adimlar.length, id + ' adım').toBeLessThanOrEqual(8);
    r.adimlar.forEach((a, i) => { expect(a.yap && a.gozle && a.neden, id + ' ' + i).toBeTruthy(); });
    expect(r.dersler.length, id).toBeGreaterThan(0);
    r.dersler.forEach(d => { expect(DERS.has(d), id + ' ' + d).toBe(true); expect(Number(d.slice(1)), d).toBeLessThanOrEqual(24); });
    expect(JSON.stringify(r), id + ' OpenStax yok').not.toMatch(/openstax/i);
  }
});

test.describe('Telefon (412 px)', () => {
  test.use({ viewport: { width: 412, height: 915 } });

  test('Her deneyde "Bu deney ne?" kanvasın üstünde; lejant sayfadaki kontrollerin hepsini anlatır; katlanırlar açılır', async ({ page }) => {
    test.setTimeout(60000);
    await kur(page);
    for (const id of DENEYLER) {
      await page.goto('/index.html#deney/' + id);
      const ne = page.locator('.dn-ne');
      await expect(ne.locator('h2'), id).toHaveText('Bu deney ne?');
      await expect(ne.locator('p'), id).toHaveText(R[id].ne);
      const cv = page.locator('#deneyKap .sahne canvas').first();
      await expect(cv).toBeVisible();
      await expect(page.locator('#deneyKap .dn-acik')).toHaveCount(1);
      const [neAlt, cvUst, acikUst, sahneAlt] = await page.evaluate(() => {
        const s = [...document.querySelectorAll('#deneyKap > .sahne')];
        return [document.querySelector('.dn-ne').getBoundingClientRect().bottom, s[0].getBoundingClientRect().top,
          document.querySelector('.dn-acik').getBoundingClientRect().top, s[s.length - 1].getBoundingClientRect().bottom];
      });
      expect(neAlt, id + ' açıklama kanvasın üstünde').toBeLessThanOrEqual(cvUst);
      expect(acikUst, id + ' katlanırlar kanvasın altında').toBeGreaterThanOrEqual(sahneAlt - 0.5);
      /* kontroller */
      const k = await kontrolDenetimi(page);
      expect(k.eksik, id + ' lejantta olmayan kontrol').toEqual([]);
      expect(k.fazla, id + ' sayfada olmayan lejant').toEqual([]);
      expect(k.sayi, id).toBeGreaterThan(0);
      /* çizim lejantı veriyle aynı sayıda */
      await expect(page.locator('#dnEkran .dn-lejant:not(.dn-kontroller) li')).toHaveCount(R[id].ekran.cizim.length);
      /* katlanırlar kapalı başlar, dokununca açılır; kanvas yerinden oynamaz */
      for (const kat of ['#dnEkran', '#dnGercek']) {
        const d = page.locator(kat);
        await expect(d).not.toHaveAttribute('open', /.*/);
        await expect(d.locator('.dn-ic')).toBeHidden();
        /* yapışkan kanvas (simulasyon.js yapiskanAyarla) kaydırınca üstte kalır; değilse sayfadaki yeri değişmez */
        const yer = () => cv.evaluate(c => c.closest('.sahne').classList.contains('yapiskan') ? 'yapiskan' : Math.round(c.getBoundingClientRect().top + scrollY));
        const once = await yer();
        await d.locator('summary').click();
        await expect(d).toHaveAttribute('open', '');
        await expect(d.locator('.dn-ic')).toBeVisible();
        expect(await yer(), id + kat).toBe(once);
        if (once === 'yapiskan') await expect(cv, id + kat + ' yapışkan kanvas görünür').toBeInViewport();
        expect((await d.locator('summary').boundingBox()).height, id + kat + ' dokunma hedefi').toBeGreaterThanOrEqual(44);
      }
      await expect(page.locator('#dnGercek .dn-gercek p').first()).toHaveText(R[id].gercek);
      await expect(page.locator('#dnGercek .kaynak a')).toHaveCount(R[id].gercekKaynaklar.length);
      /* Neler dene ve ilgili dersler */
      await expect(page.locator('.rehber h2')).toHaveText('Neler dene');
      await expect(page.locator('.rehber-adim li')).toHaveCount(R[id].adimlar.length);
      await expect(page.locator('.deney-ders a')).toHaveCount(R[id].dersler.length);
      await expect(page.locator('.deney-ders a').first()).not.toHaveText(/^Ders \d+$/);   // ders adı yüklendi
    }
  });

  test('Rehberin her "Uygula" adımı hatasız çalışır (seçiciler sayfada var)', async ({ page }) => {
    test.setTimeout(60000);
    await kur(page);
    for (const id of DENEYLER) {
      await page.goto('/index.html#deney/' + id);
      await expect(page.locator('#deneyKap .olcumler')).toBeVisible();
      const yok = await page.evaluate(ad => {
        const kap = document.getElementById('deneyKap');
        return ad.flatMap((a, i) => [a.tikla].concat(Object.keys(a.ayar || {})).filter(Boolean).filter(s => !kap.querySelector(s)).map(s => i + ' ' + s));
      }, R[id].adimlar);
      expect(yok, id).toEqual([]);
      /* "Uygula" kanvasa yumuşak kaydırır; saat durdurulduğundan kaydırma bitmez: düğmeye programla basılır */
      for (const b of await page.locator('.rh-uygula').all()) await b.evaluate(x => x.click());
      await expect(page.locator('.rehber-adim li.yapildi')).toHaveCount(await page.locator('.rh-uygula').count());
    }
  });

  test('Yeni adımların gözle metni ölçümle aynı (örnekler)', async ({ page }) => {
    await kur(page);
    const uygula = async (id, metin) => {
      const i = R[id].adimlar.findIndex(a => a.yap.includes(metin));
      expect(i, id + ' ' + metin).toBeGreaterThanOrEqual(0);
      await page.locator(`.rh-uygula[data-i="${i}"]`).click();
    };
    await page.goto('/index.html#deney/kepler');
    await expect(page.locator('#kpP')).toBeVisible();
    await uygula('kepler', 'Halley');
    await expect(page.locator('#kpP')).toHaveText('74,70 yıl');
    await expect(page.locator('#kpQ')).toHaveText('0,585 / 34,889 AB');
    await page.goto('/index.html#deney/gorelilik');
    await uygula('gorelilik', 'Parker');
    await expect(page.locator('#grV')).toHaveText('191,8 km/s');
    await expect(page.locator('#grDunya')).toHaveText('6.626 yıl');
    await page.goto('/index.html#deney/karadelik');
    await uygula('karadelik', '100 Rs');
    await expect(page.locator('#kdGelgit')).toHaveText('21,6 g');
    await page.goto('/index.html#deney/evreler');
    await uygula('evreler', '15°');
    await expect(page.locator('#evEnlem')).toHaveText('−1,31°');
    await expect(page.locator('#evTut')).toHaveText('Ay tutulması olabilir');
  });

  test('Deney listesi: her kartta açık bir tek satır açıklama', async ({ page }) => {
    await kur(page);
    await page.goto('/index.html#deney');
    const oz = await page.locator('.deney-liste a > span:not(.rozet)').allTextContents();
    expect(oz.length).toBe(20);
    oz.forEach(s => expect(s.length, s).toBeGreaterThan(40));
  });
});

test('Azaltılmış harekette zaman kaydırıcıları da lejantta', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await kur(page);
  for (const [id, zaman] of [['kepler', '#kpZaman'], ['gelgit', '#ggZaman'], ['gecis', '#gcZaman']]) {
    await page.goto('/index.html#deney/' + id);
    await expect(page.locator(zaman)).toBeAttached();
    await expect(page.locator(`.dn-kontroller li[data-kontrol="${zaman}"]`)).toHaveCount(1);
    const k = await kontrolDenetimi(page);
    expect(k.eksik, id).toEqual([]);
    expect(k.fazla, id).toEqual([]);
  }
  /* hareket azaltılmamışken zaman kaydırıcısı yok, lejantta da yok */
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

test('Hareket azaltılmamışken lejantta zaman kaydırıcısı yok', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#deney/kepler');
  await expect(page.locator('#kpA')).toBeAttached();
  await expect(page.locator('#kpZaman')).toHaveCount(0);
  await expect(page.locator('.dn-kontroller li[data-kontrol="#kpZaman"]')).toHaveCount(0);
});

for (const w of [320, 360]) {
  test.describe(w + ' px', () => {
    test.use({ viewport: { width: w, height: 700 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    test('Açıklamalar açıkken yatay taşma yok', async ({ page }) => {
      test.setTimeout(60000);
      await kur(page);
      for (const id of DENEYLER) {
        await page.goto('/index.html#deney/' + id);
        await expect(page.locator('#deneyKap .dn-acik')).toBeVisible();
        await page.evaluate(() => document.querySelectorAll('.dn-kat').forEach(d => { d.open = true; }));
        await page.waitForTimeout(100);
        const r = await page.evaluate(() => ({
          tasma: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          ogeler: [...document.querySelectorAll('.dn-ne, .dn-acik, .dn-acik *, .rehber, .deney-ders')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5).map(e => e.className || e.tagName)
        }));
        expect(r.tasma, id).toBeLessThanOrEqual(0);
        expect(r.ogeler, id).toEqual([]);
      }
    });
  });
}

test('Kırmızı modda yeni öğelerde kırmızı olmayan renk yok (metin, çerçeve, renk örnekleri)', async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 412, height: 915 });
  await kur(page, { kirmizi: 'true' });
  const say = loc => loc.screenshot().then(b => page.evaluate(async b64 => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let n = 0, maxR = 0;
    for (let i = 0; i < d.length; i += 4) {
      maxR = Math.max(maxR, d[i]);
      if ((d[i + 1] > d[i] * 0.3 + 6 || d[i + 2] > d[i] * 0.3 + 6) && Math.max(d[i + 1], d[i + 2]) > 20) n++;
    }
    return { n, maxR };
  }, b.toString('base64')));
  for (const id of DENEYLER) {
    await page.goto('/index.html#deney/' + id);
    await expect(page.locator('html')).toHaveClass(/kirmizi/);
    await expect(page.locator('#deneyKap .dn-acik')).toBeVisible();
    await page.evaluate(() => document.querySelectorAll('.dn-kat').forEach(d => { d.open = true; }));
    await expect(page.locator('.dn-kirmizi-not')).toBeVisible();
    for (const sec of ['.dn-ne', '#dnEkran', '#dnGercek', '.rehber', '.deney-ders']) {
      const r = await say(page.locator(sec));
      expect(r.n, id + ' ' + sec).toBe(0);
      expect(r.maxR, id + ' ' + sec + ' çizildi').toBeGreaterThan(150);
    }
  }
});

test('Normal modda kırmızı mod notu gizli; renk örnekleri kanvas renginde', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#deney/kepler');
  await page.locator('#dnEkran summary').click();
  await expect(page.locator('.dn-kirmizi-not')).toBeHidden();
  const gunes = await page.locator('#dnEkran .dn-daire i').nth(0).evaluate(e => getComputedStyle(e).backgroundColor);
  expect(gunes).toBe('rgb(255, 210, 122)');   // deneyler2.js Kepler: Güneş #FFD27A
});

test('Sözlük yoksa da varsa da açıklamalar çalışır; sözlük açıklama kaplarıyla çağrılır', async ({ page }) => {
  await kur(page);
  await page.addInitScript(() => {
    /* gerçek sozluk.js de yüklenir: atamasını yok sayıp çağrıları kaydeden sahte nesne kalır */
    window.__sozluk = [];
    const sahte = { isaretle(k) { window.__sozluk.push(k && (k.className || k.id)); } };
    Object.defineProperty(window, 'Sozluk', { configurable: true, get: () => sahte, set: () => {} });
  });
  await page.goto('/index.html#deney/gelgit');
  await expect(page.locator('#deneyKap .dn-acik')).toBeAttached();
  const ls = await page.evaluate(() => window.__sozluk);
  expect(ls).toEqual(expect.arrayContaining(['dn-ne', 'rehber', 'dn-acik']));
  /* hata atan sözlük sayfayı bozmaz */
  await page.addInitScript(() => { const bozuk = { isaretle() { throw new Error('sözlük bozuk'); } }; Object.defineProperty(window, 'Sozluk', { configurable: true, get: () => bozuk, set: () => {} }); });
  await page.goto('/index.html#deney/tayf');
  await page.reload();
  await expect(page.locator('#deneyKap .dn-acik')).toBeAttached();
  await expect(page.locator('.dn-ne h2')).toHaveText('Bu deney ne?');
});
