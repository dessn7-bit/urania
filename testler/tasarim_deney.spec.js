'use strict';
/* Tasarım denetimi (C): Deneyler, Hesap, Defter ve Gözlem görevleri — görünür kusurların regresyonları.
   Ağ isteği atılmaz: yerel sunucu dışındaki her istek kesilir; saat sabit, konum Kadıköy. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { disAgiKes } = require('./yardim');

const KONUM = { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' };
const DENEYLER = ['kepler', 'yorunge', 'gelgit', 'tayf', 'evreler', 'gecis', 'yildiz', 'karadelik', 'gorelilik', 'hubble'];

function kayit(i, ek) {
  return Object.assign({
    id: 'k' + i, zaman: new Date(Date.UTC(2026, 9, 27, 18, i)).toISOString(), cisim: { anahtar: 'hedef:M45', ad: 'Ülker' },
    alet: 'Teleskop', kosul: 'Berrak', not: '', konum: KONUM, otomatik: { ayOran: 40, ayAlt: 20 }
  }, ek || {});
}
async function kur(page, depo) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await page.clock.install({ time: new Date('2026-10-28T20:30:00+03:00') });
  await page.addInitScript(([k, d]) => {
    if (sessionStorage.getItem('td_kuruldu')) return;
    sessionStorage.setItem('td_kuruldu', '1');
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify(k));
    Object.entries(d || {}).forEach(([a, v]) => localStorage.setItem('urania_' + a, v));
  }, [KONUM, depo || {}]);
}
test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });

/* Kanvasa yazılan her metnin CSS pikselindeki kutusu (döndürülmüş eksen yazıları hariç) */
async function yaziKaydi(page) {
  await page.addInitScript(() => {
    const asil = CanvasRenderingContext2D.prototype.fillText;
    window.__yazilar = new Map();
    CanvasRenderingContext2D.prototype.fillText = function (t, x, y) {
      const m = this.getTransform(), cv = this.canvas;
      if (Math.abs(m.b) < 1e-6 && Math.abs(m.c) < 1e-6 && cv.id) {
        const olcek = cv.width / (cv.getBoundingClientRect().width || cv.width);
        const gen = this.measureText(String(t)).width * m.a / olcek;
        const X = (m.a * x + m.e) / olcek;
        const sol = this.textAlign === 'center' ? X - gen / 2 : (this.textAlign === 'right' || this.textAlign === 'end') ? X - gen : X;
        const ls = window.__yazilar.get(cv.id) || new Map();
        ls.set(String(t), { t: String(t), sol, sag: sol + gen, y: (m.d * y + m.f) / olcek, w: cv.getBoundingClientRect().width });
        window.__yazilar.set(cv.id, ls);
      }
      return asil.apply(this, arguments);
    };
  });
}

test.describe('Deney kanvasları', () => {
  test.use({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
  test('2,625 piksel oranlı telefonda arka tampon CSS boyu × 2,625 (bulanık değil)', async ({ page }) => {
    await kur(page);
    for (const d of DENEYLER) {
      await page.goto('/index.html#deney/' + d);
      const cv = page.locator('#deneyKap .sahne canvas').first();
      await expect(cv).toBeVisible();
      await expect.poll(() => cv.evaluate(c => Math.abs(c.width - c.getBoundingClientRect().width * devicePixelRatio)), { message: d }).toBeLessThan(1.01);
      const r = await cv.evaluate(c => Math.abs(c.height - c.getBoundingClientRect().height * devicePixelRatio));
      expect(r, d + ' yükseklik').toBeLessThan(1.01);
    }
  });
});

test.describe('Yatay telefon', () => {
  test.use({ viewport: { width: 915, height: 412 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
  test('Kanvas ekran yüksekliğine sığar, altında kaydırıcı için yer kalır', async ({ page }) => {
    await kur(page);
    for (const d of DENEYLER) {
      await page.goto('/index.html#deney/' + d);
      const cv = page.locator('#deneyKap .sahne canvas').first();
      await expect(cv).toBeVisible();
      const h = await cv.evaluate(c => c.getBoundingClientRect().height);
      expect(h, d).toBeLessThanOrEqual(412 - 140 + 1);
    }
  });
});

test.describe('Döndürme', () => {
  test.use({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  test('Dikeyden yataya dönünce kanvas yeni boyda keskin yeniden çizilir', async ({ page }) => {
    await kur(page);
    for (const d of ['karadelik', 'yildiz', 'tayf', 'gorelilik', 'evreler']) {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto('/index.html#deney/' + d);
      const cv = page.locator('#deneyKap .sahne canvas').first();
      await expect(cv).toBeVisible();
      const once = await cv.evaluate(c => c.width);
      await page.setViewportSize({ width: 800, height: 360 });
      await expect.poll(() => cv.evaluate(c => Math.abs(c.width - c.getBoundingClientRect().width * devicePixelRatio)), { message: d }).toBeLessThan(1.01);
      expect(await cv.evaluate(c => c.width), d).not.toBe(once);
    }
  });
});

test.describe('320 px (WCAG yeniden akış)', () => {
  test.use({ viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  test('Kanvas yazıları kanvasın içinde; tayf ekseni etiketleri birbirine binmez', async ({ page }) => {
    await kur(page);
    await yaziKaydi(page);
    for (const d of DENEYLER) {
      await page.goto('/index.html#deney/' + d);
      await expect(page.locator('#deneyKap .sahne canvas').first()).toBeVisible();
      await page.waitForTimeout(400);
      const ls = await page.evaluate(() => [...window.__yazilar.values()].flatMap(m => [...m.values()]));
      expect(ls.length, d).toBeGreaterThan(0);
      for (const y of ls) {
        expect(y.sol, d + ' "' + y.t + '" solda').toBeGreaterThanOrEqual(-0.5);
        expect(y.sag, d + ' "' + y.t + '" sağda').toBeLessThanOrEqual(y.w + 0.5);
      }
    }
    await page.goto('/index.html#deney/tayf');
    await page.waitForTimeout(300);
    const eksen = await page.evaluate(() => [...window.__yazilar.get('tyKanvas').values()].filter(y => /^[\d.]+( nm)?$/.test(y.t)).sort((a, b) => a.sol - b.sol));
    expect(eksen.length).toBe(5);
    for (let i = 1; i < eksen.length; i++) expect(eksen[i].sol, eksen[i].t).toBeGreaterThan(eksen[i - 1].sag + 2);
  });

  test('Azaltılmış harekette yörünge notu kanvasa sığar', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await kur(page);
    await yaziKaydi(page);
    await page.goto('/index.html#deney/yorunge');
    await page.waitForTimeout(500);
    const ls = await page.evaluate(() => [...window.__yazilar.get('yoKanvas').values()]);
    expect(ls.map(y => y.t).join(' ')).toContain('öngörülen yol');
    for (const y of ls) expect(y.sag, y.t).toBeLessThanOrEqual(y.w - 4);
  });

  test('Kara delik: gerilen astronot sağdaki saatlere ve "Uzakta" etiketine değmez', async ({ page }) => {
    await kur(page);
    await yaziKaydi(page);
    await page.addInitScript(() => {
      const asil = CanvasRenderingContext2D.prototype.roundRect;
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, w) {
        const m = this.getTransform(), o = this.canvas.width / this.canvas.getBoundingClientRect().width;
        if (this.canvas.id === 'kdKanvas') window.__kapsulSag = (m.a * (x + w) + m.e) / o;
        return asil.apply(this, arguments);
      };
    });
    await page.goto('/index.html#deney/karadelik');
    await page.evaluate(() => { for (const id of ['kdKutle', 'kdUzak']) { const g = document.getElementById(id); g.value = 0; g.dispatchEvent(new Event('input')); } });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({ kapsul: window.__kapsulSag, uzakta: window.__yazilar.get('kdKanvas').get('Uzakta').sol, w: document.getElementById('kdKanvas').getBoundingClientRect().width }));
    expect(r.kapsul).toBeLessThan(r.uzakta - 8);
  });

  test('Kaydırıcı değeri değişince etiket satır sayısı değişmez (kontroller zıplamaz)', async ({ page }) => {
    await kur(page);
    for (const [d, ids] of [['evreler', ['evMevsim', 'evGun']], ['karadelik', ['kdKutle', 'kdUzak']], ['gecis', ['gcRp', 'gcP', 'gcB']], ['tayf', ['tyT', 'tyV']]]) {
      await page.goto('/index.html#deney/' + d);
      await expect(page.locator('#deneyKap .kontroller')).toBeVisible();
      const h = await page.evaluate(async ids => {
        const out = {};
        for (const id of ids) {
          const g = document.getElementById(id), L = g.closest('.kontrol').querySelector('label'), hs = new Set();
          for (const f of [0, 0.1, 0.25, 0.5, 0.75, 1]) {
            g.value = Number(g.min) + f * (Number(g.max) - Number(g.min));
            g.dispatchEvent(new Event('input', { bubbles: true }));
            hs.add(Math.round(L.getBoundingClientRect().height));
          }
          out[id] = [...hs];
        }
        return out;
      }, ids);
      for (const id of ids) expect(h[id].length, d + ' ' + id + ' ' + h[id]).toBe(1);
      /* değer kutusu daralıp yazısı etiketten taşmasın */
      const tasan = await page.evaluate(() => [...document.querySelectorAll('.kontrol label')].filter(l => l.scrollWidth > l.clientWidth + 0.5).map(l => l.textContent));
      expect(tasan, d).toEqual([]);
    }
  });

  test('Hesap: çok büyük ve çok küçük girdiler taşmaz, "—" yerine anlaşılır ileti', async ({ page }) => {
    await kur(page);
    await page.goto('/index.html#hesap');
    await expect(page.locator('#paS b')).toBeVisible();
    await page.fill('#paP', '1e-300');
    await expect(page.locator('#paS b')).toContainText('× 10³⁰³ parsek');
    await page.fill('#hkA', '1e100'); await page.fill('#hkM', '1e-100');
    await expect(page.locator('#hkS')).toContainText('hesaplanamayacak');
    await expect(page.locator('#hkA')).toHaveAttribute('aria-invalid', 'true');
    await page.fill('#mgM', '-123456789'); await page.fill('#mgD', '1e-300');
    await expect(page.locator('#mgS')).toContainText('hesaplanamayacak kadar büyük');
    await expect(page.locator('#mgS')).not.toContainText('—');
    expect(await page.evaluate(() => document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth)).toBe(0);
    for (const s of await page.locator('.sonuc').all()) expect(await s.evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);
    /* hatalı girdi kenarı uyarı renginde */
    await page.fill('#uzD', 'abc');
    const [kenar, uyari] = await page.locator('#uzD').evaluate(e => [getComputedStyle(e).borderTopColor, getComputedStyle(document.documentElement).getPropertyValue('--uyari').trim()]);
    expect(kenar).toBe(await page.evaluate(u => { const c = document.createElement('canvas').getContext('2d'); c.fillStyle = u; const x = c.fillStyle; return 'rgb(' + [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)).join(', ') + ')'; }, uyari));
  });

  test('Defter formu: seçimler kesilmez, uzun yer adı cisim adını sıkıştırmaz', async ({ page }) => {
    const uzun = 'Çanakkale Onsekiz Mart Üniversitesi Ulupınar Gözlemevi Kampüsü, Terzioğlu Yerleşkesi, Merkez, Çanakkale, Türkiye';
    await kur(page, { defter: JSON.stringify([kayit(1, { cisim: { anahtar: 'hedef:M42', ad: "Orion Bulutsusu'nu dürbünle gör" }, konum: Object.assign({}, KONUM, { ad: uzun }) })]) });
    await page.goto('/index.html#defter/yeni');
    await expect(page.locator('#dfKosul')).toBeVisible();
    await page.selectOption('#dfKosul', 'Parçalı bulutlu');
    const r = await page.evaluate(() => {
      const c = document.createElement('canvas').getContext('2d'), s = document.getElementById('dfKosul'), cs = getComputedStyle(s);
      c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      const ic = s.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 20;   // açılır ok payı
      return { ic, metin: c.measureText('Parçalı bulutlu').width, ad: document.querySelector('#dfListe li .ad').getBoundingClientRect().width };
    });
    expect(r.ic).toBeGreaterThan(r.metin);
    expect(r.ad).toBeGreaterThan(140);
    expect(await page.evaluate(() => document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth)).toBe(0);
  });

  test('Defter: bozuk yedek iletisi uyarı renginde, silme onayı belli', async ({ page }) => {
    await kur(page, { defter: JSON.stringify([kayit(1)]) });
    await page.goto('/index.html#defter');
    await expect(page.locator('#dfListe li')).toHaveCount(1);
    const sil = page.locator('#dfListe button[data-is="sil"]');
    const once = await sil.evaluate(e => getComputedStyle(e).color);
    await sil.click();
    await expect(sil).toHaveText('Silmek için tekrar bas');
    expect(await sil.evaluate(e => getComputedStyle(e).color)).not.toBe(once);
    await page.locator('details.aciklama summary').click();
    const f = path.join(os.tmpdir(), 'urania-bozuk-' + process.pid + '.json');
    fs.writeFileSync(f, '{bozuk');
    await page.setInputFiles('#dfYukle', f);
    await expect(page.locator('#dfYedekDurum')).toHaveClass(/hata/);
    const [renk, yazi] = await page.locator('#dfYedekDurum').evaluate(e => [getComputedStyle(e).color, getComputedStyle(e).marginTop]);
    expect(renk).toBe('rgb(224, 176, 98)');
    expect(parseFloat(yazi)).toBeGreaterThanOrEqual(6);
    fs.writeFileSync(f, JSON.stringify({ kayitlar: [kayit(2)] }));
    await page.setInputFiles('#dfYukle', f);
    await expect(page.locator('#dfYedekDurum')).toHaveText('1 kayıt eklendi.');
    await expect(page.locator('#dfYedekDurum')).not.toHaveClass(/hata/);
    fs.unlinkSync(f);
  });

  test('Kırmızı mod: tarih-saat girdisinin odaklı parçası mavi/beyaz değil', async ({ page }) => {
    await kur(page, { kirmizi: 'true' });
    await page.goto('/index.html#defter/yeni');
    const g = page.locator('#dfZaman');
    await expect(g).toBeVisible();
    await g.focus();
    await page.waitForTimeout(100);
    const png = await g.screenshot();
    const n = await page.evaluate(async b64 => {
      const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      const d = x.getImageData(0, 0, im.width, im.height).data; let n = 0;
      for (let i = 0; i < d.length; i += 4) if (Math.max(d[i + 1], d[i + 2]) > 0.35 * d[i] + 20) n++;
      return n;
    }, png.toString('base64'));
    expect(n).toBe(0);
  });

  test('Rehber ve yedek özetleri en az 24 px dokunma hedefi (WCAG 2.5.8)', async ({ page }) => {
    await kur(page);
    await page.goto('/index.html#deney/kepler');
    await expect(page.locator('.rh-ac summary').first()).toBeVisible();
    for (const s of await page.locator('.rh-ac summary, .rh-uygula').all()) expect((await s.boundingBox()).height).toBeGreaterThanOrEqual(24);
    await page.goto('/index.html#defter');
    const y = page.locator('#b-defter details.aciklama > summary');
    await expect(y).toBeVisible();
    expect((await y.boundingBox()).height).toBeGreaterThanOrEqual(24);
  });

  test('Görevler: özet açılır olduğunu gösterir; "Defterde" yazısı düğmeyle ortalı', async ({ page }) => {
    await kur(page, { defter: JSON.stringify([kayit(1)]) });
    await page.goto('/index.html#defter/gorevler');
    const ozet = page.locator('.gorev-liste summary').first();
    await expect(ozet).toBeVisible();
    const kapali = await ozet.evaluate(e => { const s = getComputedStyle(e, '::after'); return [s.borderRightStyle, s.transform]; });
    expect(kapali[0]).toBe('solid');
    await ozet.click();
    expect(await ozet.evaluate(e => getComputedStyle(e, '::after').transform)).not.toBe(kapali[1]);
    const biten = page.locator('li.gorev.bitti').first();
    await biten.locator('summary').click();
    const [a, b] = await biten.locator('.gorev-ic .cip-grup').evaluate(p => [p.querySelector('span'), p.querySelector('a.dugme')].map(e => { const r = e.getBoundingClientRect(); return r.top + r.height / 2; }));
    expect(Math.abs(a - b)).toBeLessThan(3);
  });
});
