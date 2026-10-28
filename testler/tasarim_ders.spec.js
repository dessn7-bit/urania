'use strict';
/* Tasarım denetimi (dersler, kartlar, sınav, sesli okuma, ders çizimleri): ekranda görünen kusurların gerilemesi.
   Ağ isteği yok (disAgiKes), zaman sabit, konum Kadıköy. Ölçüler telefon genişliğinde (360 px) ve yatay telefonda. */
const { test, expect } = require('@playwright/test');
const { disAgiKes } = require('./yardim');

const KONUM = { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' };
const SABIT_AN = new Date('2026-10-28T20:30:00+03:00');
const DERSLER = ['d1', 'd2', 'd11', 'd12', 'd3', 'd9', 'd10', 'd19', 'd4', 'd14', 'd5', 'd15', 'd6', 'd16', 'd13', 'd18', 'd7', 'd8', 'd17'];

async function kur(page, secenek) {
  const s = Object.assign({ kirmizi: false, ses: false }, secenek || {});
  await disAgiKes(page);
  await page.clock.install({ time: SABIT_AN });
  await page.addInitScript(([k, konum, ses]) => {
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify(konum));
    localStorage.setItem('urania_kirmizi', k ? 'true' : 'false');
    if (!ses) return;
    /* Türkçe sesi olan sahte motor (testler/ses.spec.js'teki gibi, en yalın hâli) */
    let aktif = null;
    function Utt(t) { this.text = String(t); }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utt, configurable: true, writable: true });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      get speaking() { return !!aktif; }, get pending() { return false; }, paused: false,
      getVoices() { return [{ name: 'Sahte Türkçe', lang: 'tr-TR', localService: true, default: true }]; },
      speak(u) { aktif = u; setTimeout(() => { if (aktif === u && u.onstart) u.onstart({}); }, 0); },
      cancel() { const a = aktif; aktif = null; if (a && a.onerror) setTimeout(() => a.onerror({ error: 'interrupted' }), 0); },
      pause() {}, resume() {}, addEventListener() {}
    } });
  }, [s.kirmizi, KONUM, s.ses]);
}

/* Bir ders sayfasındaki çizimlerin yazı ölçüleri: etkin px (ekran dönüşümüyle), SVG dışına taşma, yazı-yazı çakışması */
async function cizimOlc(page) {
  return page.evaluate(() => [...document.querySelectorAll('figure.cizim')].map(fig => {
    const svg = fig.querySelector('svg'), sr = svg.getBoundingClientRect();
    const ys = [...svg.querySelectorAll('text')].map(t => {
      const m = t.getScreenCTM(), r = t.getBoundingClientRect();
      return { metin: t.textContent, px: parseFloat(t.getAttribute('font-size')) * Math.hypot(m.a, m.b), r };
    });
    const kesik = ys.filter(y => y.r.left < sr.left - 1 || y.r.right > sr.right + 1 || y.r.top < sr.top - 1 || y.r.bottom > sr.bottom + 1).map(y => y.metin);
    const cakisma = [];
    const ic = r => ({ l: r.left + 0.5, r: r.right - 0.5, t: r.top + r.height * 0.2, b: r.bottom - r.height * 0.2 });
    for (let i = 0; i < ys.length; i++) for (let j = i + 1; j < ys.length; j++) {
      const a = ic(ys[i].r), c = ic(ys[j].r);
      if (Math.min(a.r, c.r) - Math.max(a.l, c.l) > 0.5 && Math.min(a.b, c.b) - Math.max(a.t, c.t) > 0.5) cakisma.push(ys[i].metin + ' × ' + ys[j].metin);
    }
    return { id: fig.id, minPx: Math.min(...ys.map(y => y.px)), kucuk: ys.filter(y => y.px < 10).map(y => y.metin + ' ' + y.px.toFixed(1)), kesik, cakisma };
  }));
}

test('Ders çizimleri 360 px telefonda: yazı ≥ 10 px, SVG dışına taşmıyor, yazılar üst üste binmiyor', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 360, height: 800 });
  await kur(page);
  const kotu = [];
  let sayi = 0;
  for (const d of DERSLER) {
    await page.goto('/index.html#ders/' + d);
    await expect(page.locator('article.ders h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    for (const c of await cizimOlc(page)) {
      sayi++;
      if (c.kucuk.length || c.kesik.length || c.cakisma.length) kotu.push(JSON.stringify(c));
    }
  }
  expect(sayi, 'ölçülen çizim').toBeGreaterThan(50);
  expect(kotu).toEqual([]);
});

test('Yatay telefonda (915×412) uzun çizimler de okunur: yazı ≥ 10 px (70vh sınırının tabanı)', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 915, height: 412 });
  await kur(page);
  const kucuk = [];
  for (const d of ['d8', 'd12', 'd14', 'd18', 'd10', 'd6', 'd15', 'd7', 'd3']) {
    await page.goto('/index.html#ders/' + d);
    await expect(page.locator('article.ders h1')).toBeVisible();
    for (const c of await cizimOlc(page)) if (c.minPx < 10) kucuk.push(c.id + ' ' + c.minPx.toFixed(1));
  }
  expect(kucuk).toEqual([]);
});

/* Bir yazının kutusundan geçen ve üstüne sonradan dolu bir levha (zeminliYazi) çizilmemiş çizgi örnekleri */
async function gorunurCizgiler(page, ad, metinler) {
  return page.evaluate(([ad, metinler]) => {
    const svg = document.querySelector('#cz-' + ad + ' svg');
    const hepsi = [...svg.querySelectorAll('*')];
    const levhalar = hepsi.filter(e => e.tagName === 'rect' && e.getAttribute('fill') !== 'none' && !e.getAttribute('opacity'));
    const kutu = e => e.getBoundingClientRect();
    const sonuc = [];
    for (const t of [...svg.querySelectorAll('text')].filter(t => metinler.includes(t.textContent))) {
      const r = kutu(t), k = { l: r.left + 1, r: r.right - 1, t: r.top + r.height * 0.25, b: r.bottom - r.height * 0.2 };
      for (const e of hepsi.filter(e => /^(line|polyline|path|circle)$/.test(e.tagName) && e.getAttribute('stroke') && e.getAttribute('stroke') !== 'none')) {
        const L = e.getTotalLength(), m = e.getScreenCTM(), sira = hepsi.indexOf(e);
        for (let i = 0; i <= 200; i++) {
          const q = e.getPointAtLength(L * i / 200), x = m.a * q.x + m.c * q.y + m.e, y = m.b * q.x + m.d * q.y + m.f;
          if (x <= k.l || x >= k.r || y <= k.t || y >= k.b) continue;
          const ortulu = levhalar.some(l => hepsi.indexOf(l) > sira && (b => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom)(kutu(l)));
          if (!ortulu) { sonuc.push(t.textContent + ' ← ' + e.tagName); break; }
        }
      }
    }
    return sonuc;
  }, [ad, metinler]);
}

test('Çizim etiketlerini kesikli çizgiler kesmiyor (uzaklık merdiveni, Hubble diyagramı, Algol)', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await kur(page);
  await page.goto('/index.html#ders/d17');
  await expect(page.locator('#cz-d17-uzaklik-merdiveni')).toBeVisible();
  expect(await gorunurCizgiler(page, 'd17-uzaklik-merdiveni', ['birkaç on bin ışık yılına kadar', '≈50 milyon ışık yılına kadar', '≈10 milyar ışık yılı ve ötesi'])).toEqual([]);
  expect(await gorunurCizgiler(page, 'd17-hubble-diyagrami', ['100 Mpc\'de fark ≈ 564 km/s (%8)'])).toEqual([]);
  await page.goto('/index.html#ders/d15');
  await expect(page.locator('#cz-d15-algol')).toBeVisible();
  expect(await gorunurCizgiler(page, 'd15-algol', ['1', '2'])).toEqual([]);
  await page.goto('/index.html#ders/d6');
  /* atarca: "Radyo atımları" başlığı ile "1,337 s" arasında boşluk */
  const ara = await page.evaluate(() => {
    const ts = [...document.querySelectorAll('#cz-d6-atarca text')];
    const a = ts.find(t => t.textContent === 'Radyo atımları').getBoundingClientRect(), b = ts.find(t => t.textContent === '1,337 s').getBoundingClientRect();
    return Math.max(b.left - a.right, b.top - a.bottom);
  });
  expect(ara).toBeGreaterThan(2);
});

for (const kirmizi of [true, false]) {
  test(`Kara cisim göstergesinde Rigel ${kirmizi ? 'kırmızı modda noktalı (renkler aynı kırmızıya döner)' : 'normal modda düz'}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await kur(page, { kirmizi });
    await page.goto('/index.html#ders/d2');
    await expect(page.locator('#cz-d2-kara-cisim')).toBeVisible();
    const desen = await page.evaluate(() => [...document.querySelectorAll('#cz-d2-kara-cisim .kz-nokta > *')].map(e => getComputedStyle(e).strokeDasharray));
    expect(desen.length).toBe(2);   // gösterge çizgisi + eğri
    for (const d of desen) expect(d === 'none').toBe(!kirmizi);
  });
}

test('Akılda tutulacak sayılar 360 px\'te açıklamayı dar sütuna sıkıştırmıyor', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await kur(page);
  for (const d of ['d1', 'd12']) {
    await page.goto('/index.html#ders/' + d);
    await expect(page.locator('.sayilar li').first()).toBeVisible();
    const genislik = await page.evaluate(() => [...document.querySelectorAll('.sayilar li > span:last-child')].map(e => e.getBoundingClientRect().width));
    expect(genislik.length).toBeGreaterThan(5);
    expect(Math.min(...genislik)).toBeGreaterThan(250);
  }
});

test('Dersler: dinle çubuğu, hız seçimi, "Tüm dersler" ve "Sesli tekrar" dokunma hedefleri yeterli', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await kur(page, { ses: true });
  await page.goto('/index.html#ders/d3');
  await expect(page.locator('#dsSes .so-btn')).toBeVisible();
  const boy = s => page.locator(s).first().evaluate(e => e.getBoundingClientRect().height);
  expect(await boy('#dsSes .so-btn')).toBeGreaterThanOrEqual(44);
  expect(await boy('#dsSes .so-hiz')).toBeGreaterThanOrEqual(44);
  expect(await boy('article.ders .geri')).toBeGreaterThanOrEqual(40);
  await page.evaluate(() => localStorage.setItem('urania_dersBitti', JSON.stringify({ d1: '2026-10-20T10:00:00Z' })));
  await page.goto('/index.html#ders/kartlar');
  await expect(page.locator('#kaSesli')).toBeVisible();
  expect(await boy('#kaSesli')).toBeGreaterThanOrEqual(44);
  expect(await boy('#b-ders .geri')).toBeGreaterThanOrEqual(40);
});

for (const [w, kirmizi] of [[320, false], [360, true]]) {
  test(`Ders sayfaları ${w} px'te yatay taşmıyor${kirmizi ? ' (kırmızı mod)' : ''}`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: w, height: 700 });
    await kur(page, { kirmizi });
    for (const r of ['ders', 'ders/kartlar/hepsi', 'ders/sinav/gokyuzu', ...DERSLER.map(d => 'ders/' + d)]) {
      await page.goto('/index.html#' + r);
      await expect(page.locator('#b-ders h1').first()).toBeVisible();
      const t = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        return { yatay: document.scrollingElement.scrollWidth - vw, tasan: [...document.querySelectorAll('#b-ders *')].filter(e => e.getBoundingClientRect().right > vw + 0.5 && !e.closest('.gorsel-gizli')).length };
      });
      expect(t, r + ' @' + w).toEqual({ yatay: 0, tasan: 0 });
    }
  });
}

test('Hareket azaltma tercihinde sesli okuma paragrafa kayarak değil doğrudan gider', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await kur(page, { ses: true });
  await page.addInitScript(() => {
    window.__kaydirma = [];
    const asil = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (o) { window.__kaydirma.push(o && o.behavior); return asil.call(this, o); };
  });
  await page.goto('/index.html#ders/d3');
  await page.locator('#dsSes [data-so=dinle]').click();
  await expect.poll(() => page.evaluate(() => window.__kaydirma.length)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.__kaydirma.filter(b => b === 'smooth'))).toEqual([]);
});
