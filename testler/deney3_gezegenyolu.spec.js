'use strict';
/* Gezegen yolu deneyi (deney/gezegenyolu.js): günlük yol, duraklamalar, geri hareket, karşı konum / iç kavuşum.
   Bağımsız referans: JPL Horizons (testler/veri/gezegenyolu_horizons.json; araclar/gezegenyolu_horizons.py ile
   yeniden üretilir; QUANTITIES=31 görünen tutulum boylamı, yer merkezi, saatlik adım). Ağ isteği atılmaz. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { disAgiKes } = require('./yardim');

const HZ = JSON.parse(fs.readFileSync(path.join(__dirname, 'veri', 'gezegenyolu_horizons.json'), 'utf8'));
const V = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'veri', 'deney', 'gezegenyolu.json'), 'utf8')).veri;

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await page.addInitScript(() => localStorage.setItem('urania_konumOto', 'false'));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function ac(page) {
  await page.goto('/index.html#deney/gezegenyolu');
  await expect(page.locator('#gyDurak1')).not.toHaveText('—');
  await expect(page.locator('#gyKanvas')).toHaveAttribute('data-yildiz', /^\d+$/);
}
const gun = async (page, i) => page.locator('#gyGun').evaluate((g, i) => { g.value = i; g.dispatchEvent(new Event('input', { bubbles: true })); }, i);

test('Fikstür: Horizons sorgusu ve alınma tarihi kayıtlı, ham saatlik değerler var', () => {
  expect(HZ.api).toBe('https://ssd.jpl.nasa.gov/api/horizons.api');
  expect(HZ.alindi).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(HZ.sorgu_ornegi).toContain("QUANTITIES='31'");
  expect(HZ.sorgu_ornegi).toContain("CENTER='500@399'");
  for (const g of ['Jupiter', 'Mars']) {
    expect(HZ.gezegenler[g].duraklamalar.map(d => d.tur)).toEqual(['geri', 'ileri']);
    expect(HZ.gezegenler[g].saatlik.every(p => p.satirlar.length > 90)).toBe(true);
    expect(HZ.gezegenler[g].karsi_konum.zaman).toMatch(/Z$/);
  }
});

test('Önayarlar: duraklamalar ve karşı konum JPL Horizons ile 1 gün içinde (farklar saat olarak yazılır)', async ({ page }) => {
  await ac(page);
  const r = await page.evaluate(on => {
    const H = window.UraniaDeneyHesap3.gezegenyolu;
    return on.map(x => {
      const ol = H.olaylar(x.gezegen, false, H.an(x.bas, 18), H.an(x.son, 18));
      return { g: x.gezegen, dur: ol.duraklamalar.map(d => ({ tur: d.tur, t: d.t })), kk: ol.kavusum, sure: ol.geriSure, yay: ol.geriYay };
    });
  }, V.onayarlar);
  const satir = [];
  for (const x of r) {
    const ref = HZ.gezegenler[x.g];
    expect(x.dur.map(d => d.tur), x.g).toEqual(ref.duraklamalar.map(d => d.tur));
    x.dur.forEach((d, i) => {
      const fark = (d.t - Date.parse(ref.duraklamalar[i].zaman)) / 36e5;
      satir.push(`${x.g} ${d.tur}: uygulama ${new Date(d.t).toISOString()} Horizons ${ref.duraklamalar[i].zaman} fark ${fark.toFixed(2)} sa`);
      expect(Math.abs(fark), x.g + ' duraklama ' + i).toBeLessThanOrEqual(24);
    });
    expect(x.kk.length, x.g).toBe(1);
    const fk = (x.kk[0] - Date.parse(ref.karsi_konum.zaman)) / 36e5;
    satir.push(`${x.g} karşı konum: uygulama ${new Date(x.kk[0]).toISOString()} Horizons ${ref.karsi_konum.zaman} fark ${fk.toFixed(2)} sa`);
    expect(Math.abs(fk), x.g + ' karşı konum').toBeLessThanOrEqual(24);
  }
  console.log(satir.join('\n'));
  const [jup, mars] = r;
  expect(Math.round(jup.sure)).toBe(121);                // Wikipedia Apparent retrograde motion: Jüpiter 121 gün
  expect(Math.round(mars.sure)).toBe(81);                 // tablo 72 gün (yıldan yıla değişir); bu kez 81
  expect(jup.yay).toBeCloseTo(10.0, 0);
  expect(mars.yay).toBeCloseTo(19.5, 0);
});

test('Hesaplar: parlaklık, uzaklık ve öteki gezegenler kaynaklarla tutarlı', async ({ page }) => {
  await ac(page);
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.gezegenyolu, out = {};
    const kk = (g, t) => { const y = H.yol(g, t, t, 18)[0]; return { kadir: y.kadir, uzak: y.uzak }; };
    out.mars = kk('Mars', '2027-02-19'); out.jup = kk('Jupiter', '2027-02-11');
    out.sat = H.olaylar('Saturn', false, H.an('2027-07-15', 18), H.an('2028-01-15', 18));
    out.ven = H.olaylar('Venus', true, H.an('2028-04-15', 18), H.an('2028-07-15', 18));
    out.mer = H.olaylar('Mercury', true, H.an('2027-01-25', 18), H.an('2027-03-20', 18));
    /* iç gezegende "karşı konum" aranmaz; dış gezegende iç kavuşum aranmaz */
    out.venKarsi = H.karsiKonum('Venus', H.an('2028-04-15', 18), H.an('2028-07-15', 18)).length;
    out.yolUzun = H.yol('Mars', '2027-01-01', '2027-04-30', 18).length;
    out.sar = [H.gunEkle('2027-02-27', 2), H.gunFarki('2026-12-01', '2027-04-30')];
    return out;
  });
  expect(r.mars.kadir).toBeCloseTo(-1.2, 1);                       // nakedeyeplanets.com: −1,2
  expect(r.mars.uzak * 149.5978707).toBeCloseTo(101, -0.5);       // EarthSky: ~101 milyon km
  expect(Math.abs(r.jup.kadir + 2.5)).toBeLessThan(0.1);           // EarthSky: −2,5
  expect(Math.abs(r.sat.geriSure - 138)).toBeLessThan(4);          // Wikipedia: 138 gün
  expect(r.sat.kavusum.length).toBe(1);
  expect(Math.abs(r.ven.geriSure - 41)).toBeLessThan(4);           // Wikipedia: 41 gün
  expect(r.ven.kavusum.length).toBe(1);                            // iç kavuşum 1 Haziran 2028
  expect(new Date(r.ven.kavusum[0]).toISOString().slice(0, 10)).toBe('2028-06-01');
  expect(r.mer.geriSure).toBeGreaterThan(19.85);                   // Wikipedia: 19,85–24,19 gün
  expect(r.mer.geriSure).toBeLessThan(24.19);
  expect(r.venKarsi).toBe(0);
  expect(r.yolUzun).toBe(120);
  expect(r.sar).toEqual(['2027-03-01', 150]);
});

test('Arayüz: Mars önayarı, kaydırıcı, Jüpiter, tarih aralığı ve iç gezegen', async ({ page }) => {
  await ac(page);
  await expect(page.locator('#gyGezegen button[aria-pressed="true"]')).toHaveText('Mars');
  await expect(page.locator('#gyDurak1')).toHaveText(/^10 Ocak 2027, 1[56]\.\d\d$/);
  await expect(page.locator('#gyDurak2')).toHaveText(/^1 Nisan 2027, 17\.\d\d$/);
  await expect(page.locator('#gySure')).toHaveText('81 gün');
  await expect(page.locator('#gyYay')).toHaveText('19,5°');
  await expect(page.locator('#gyKavusum')).toHaveText(/^19 Şubat 2027, 18\.\d\d$/);
  await expect(page.locator('#gyMetin')).toContainText('Wikipedia\'nın tablosu Mars için 72 gün geri hareket verir');
  await gun(page, 49);
  await expect(page.locator('#gyGunCikti')).toHaveText('19 Şubat 2027');
  await expect(page.locator('#gyParlak')).toHaveText('−1,2 kadir');
  await expect(page.locator('#gyUzak')).toHaveText('0,68 AB (101 milyon km)');
  await expect(page.locator('#gyHareket')).toHaveText(/^batıya \(geri\) /);
  await gun(page, 0);
  await expect(page.locator('#gyHareket')).toHaveText(/^doğuya /);
  await expect(page.locator('#gyGun')).toHaveAttribute('max', '119');
  await expect(page.locator('#gyGun')).toHaveAttribute('aria-valuetext', '1 Ocak 2027');
  /* Jüpiter önayarı */
  await page.locator('#gyHazir button[data-i="0"]').click();
  await expect(page.locator('#gyGezegen button[aria-pressed="true"]')).toHaveText('Jüpiter');
  await expect(page.locator('#gyBas')).toHaveValue('2026-12-01');
  await expect(page.locator('#gySon')).toHaveValue('2027-04-30');
  await expect(page.locator('#gyDurak1')).toHaveText(/^13 Aralık 2026, 0[34]\.\d\d$/);
  await expect(page.locator('#gyDurak2')).toHaveText(/^13 Nisan 2027, 05\.\d\d$/);
  await expect(page.locator('#gySure')).toHaveText('121 gün');
  await expect(page.locator('#gyKavusum')).toHaveText(/^11 Şubat 2027, 03\.\d\d$/);
  /* aralık 10 günden kısa olamaz: öbür tarih kaydırılır */
  await page.locator('#gySon').fill('2026-12-05');
  await expect(page.locator('#gyNot')).toContainText('en az 10 gün');
  await expect(page.locator('#gyBas')).not.toHaveValue('2026-12-01');
  /* 366 günden uzun olamaz */
  await page.locator('#gyHazir button[data-i="1"]').click();
  await page.locator('#gySon').fill('2029-01-01');
  await expect(page.locator('#gyNot')).toContainText('en çok 366 gün');
  expect(await page.evaluate(() => { const H = window.UraniaDeneyHesap3.gezegenyolu; return H.gunFarki(document.getElementById('gyBas').value, document.getElementById('gySon').value); })).toBe(366);
  /* Venüs: iç kavuşum */
  await page.locator('#gyGezegen button', { hasText: 'Venüs' }).click();
  await page.locator('#gyBas').fill('2028-04-15');
  await page.locator('#gySon').fill('2028-07-15');
  await expect(page.locator('#gyKavusum')).toHaveText(/^1 Haziran 2028, /);
  await expect(page.locator('dl.olcumler dt', { hasText: 'İç kavuşum' })).toHaveCount(1);
  await expect(page.locator('#gyMetin')).toContainText('sabah yıldızına döner');
  /* duraklamasız aralık */
  await page.locator('#gyBas').fill('2028-08-01');
  await page.locator('#gySon').fill('2028-09-01');
  await expect(page.locator('#gyDurak1')).toHaveText('bu aralıkta yok');
  await expect(page.locator('#gyMetin')).toContainText('hiç durmuyor');
});

test('Rehber adımlarının "Gözle" metni ölçümlerle aynı', async ({ page }) => {
  await ac(page);
  const uygula = async i => page.locator(`.rh-uygula[data-i="${i}"]`).evaluate(b => b.click());
  await uygula(2);
  await expect(page.locator('#gyHareket')).toHaveText('doğuya 0,11° / gün');
  await expect(page.locator('#gyUzak')).toHaveText('0,91 AB (136 milyon km)');
  await uygula(4);
  await expect(page.locator('#gyDurak1')).toHaveText(/^9 Ağustos 2027, /);
  await expect(page.locator('#gyDurak2')).toHaveText(/^24 Aralık 2027, /);
  await expect(page.locator('#gySure')).toHaveText('136 gün');
  await expect(page.locator('#gyYay')).toHaveText('6,9°');
  await expect(page.locator('#gyKavusum')).toHaveText(/^18 Ekim 2027, /);
  await uygula(5);
  await expect(page.locator('#gyDurak1')).toHaveText(/^11 Mayıs 2028, /);
  await expect(page.locator('#gyDurak2')).toHaveText(/^23 Haziran 2028, /);
  await expect(page.locator('#gySure')).toHaveText('43 gün');
  await uygula(6);
  await expect(page.locator('#gyDurak1')).toHaveText(/^9 Şubat 2027, /);
  await expect(page.locator('#gyDurak2')).toHaveText(/^3 Mart 2027, /);
  await expect(page.locator('#gySure')).toHaveText('22 gün');
  await expect(page.locator('#gyKavusum')).toHaveText(/^18 Şubat 2027, /);
  await uygula(3);
  await expect(page.locator('#gyYay')).toHaveText('10,0°');
});

test('Oynat gün gün ilerler, durdurulur; azaltılmış harekette de çalışır', async ({ page }) => {
  await ac(page);
  await page.locator('#gyOynat').click();
  await expect(page.locator('#gyOynat')).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.locator('#gyGun').evaluate(g => Number(g.value))).toBeGreaterThan(5);
  await page.locator('#gyOynat').click();
  await expect(page.locator('#gyOynat')).toHaveText('Oynat');
  const a = await page.locator('#gyGun').evaluate(g => Number(g.value));
  await page.waitForTimeout(400);
  expect(await page.locator('#gyGun').evaluate(g => Number(g.value))).toBe(a);
  /* sona gelince kendiliğinden durur */
  await gun(page, 117);
  await page.locator('#gyOynat').click();
  await expect(page.locator('#gyOynat')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#gyGun')).toHaveValue('119');
});

test('Azaltılmış harekette Oynat çeyrek saniyede bir gün ilerler', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ac(page);
  await page.locator('#gyOynat').click();
  await expect.poll(() => page.locator('#gyGun').evaluate(g => Number(g.value)), { timeout: 5000 }).toBeGreaterThanOrEqual(3);
  await page.locator('#gyOynat').click();
});

/* Kanvasa yazılan her metnin CSS pikselindeki kutusu (tasarim_deney.spec.js ile aynı yöntem) */
async function yaziKaydi(page) {
  await page.addInitScript(() => {
    const asil = CanvasRenderingContext2D.prototype.fillText;
    window.__yazilar = [];
    CanvasRenderingContext2D.prototype.fillText = function (t, x, y) {
      const m = this.getTransform(), cv = this.canvas;
      if (cv.id === 'gyKanvas') {
        const olcek = cv.width / (cv.getBoundingClientRect().width || cv.width);
        const gen = this.measureText(String(t)).width * m.a / olcek, X = (m.a * x + m.e) / olcek;
        const sol = this.textAlign === 'center' ? X - gen / 2 : this.textAlign === 'right' ? X - gen : X;
        window.__yazilar.push({ t: String(t), sol, sag: sol + gen, y: (m.d * y + m.f) / olcek, w: cv.getBoundingClientRect().width, h: cv.getBoundingClientRect().height });
      }
      return asil.apply(this, arguments);
    };
  });
}

for (const w of [551, 320]) {
  test.describe(w + ' px', () => {
    test.use({ viewport: { width: w, height: 800 }, deviceScaleFactor: 2, isMobile: w === 320, hasTouch: w === 320 });
    test('Yatay taşma yok, kanvas yazıları kanvasın içinde, kanvas keskin', async ({ page }) => {
      await yaziKaydi(page);
      await ac(page);
      for (const i of [0, 1]) {
        await page.locator(`#gyHazir button[data-i="${i}"]`).click();
        await page.evaluate(() => { window.__yazilar = []; });
        await gun(page, 40);
        await page.waitForTimeout(300);
        const r = await page.evaluate(() => ({
          tasma: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          cv: (c => ({ oran: c.getBoundingClientRect().height / c.getBoundingClientRect().width, keskin: Math.abs(c.width - c.getBoundingClientRect().width * devicePixelRatio) }))(document.getElementById('gyKanvas')),
          yazi: window.__yazilar
        }));
        expect(r.tasma).toBeLessThanOrEqual(0);
        expect(r.cv.keskin).toBeLessThan(1.01);
        expect(r.cv.oran).toBeGreaterThanOrEqual(0.6);
        expect(r.cv.oran).toBeLessThanOrEqual(0.81);
        const ad = r.yazi.map(y => y.t);
        expect(ad).toEqual(expect.arrayContaining(['durur', 'karşı konum', '← doğu', 'batı →']));
        for (const y of r.yazi) {
          expect(y.sol, '"' + y.t + '" solda').toBeGreaterThanOrEqual(-0.5);
          expect(y.sag, '"' + y.t + '" sağda').toBeLessThanOrEqual(y.w + 0.5);
          expect(y.y, '"' + y.t + '" altta').toBeLessThanOrEqual(y.h + 0.5);
        }
      }
      /* kontroller ve ölçümler ekrana sığar */
      const tasan = await page.evaluate(() => [...document.querySelectorAll('#deneyKap .kontroller *, #deneyKap .olcumler *, #gyGezegen, #gyHazir')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5).map(e => e.id || e.tagName));
      expect(tasan).toEqual([]);
    });
  });
}

test('Kırmızı mod: kanvasta yeşil/mavi piksel yok; tema olayıyla yeniden çizilir', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 900 });
  await ac(page);
  const ozet = () => page.locator('#gyKanvas').evaluate(c => {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0, dolu = 0;
    for (let i = 0; i < d.length; i += 4) { h = (h * 31 + d[i] * 7 + d[i + 1] * 3 + d[i + 2]) >>> 0; if (Math.max(d[i], d[i + 1], d[i + 2]) > 20) dolu++; }
    return h + ':' + dolu;
  });
  const once = await ozet();
  expect(+once.split(':')[1]).toBeGreaterThan(100);
  await page.evaluate(() => document.documentElement.classList.add('kirmizi'));
  await page.waitForTimeout(300);
  expect(await ozet(), 'olay gelmeden kanvas kendiliğinden değişmez').toBe(once);
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('urania:tema')));
  await expect.poll(ozet).not.toBe(once);
  const png = await page.locator('#gyKanvas').screenshot();
  const r = await page.evaluate(async b64 => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let n = 0, maxR = 0;
    for (let i = 0; i < d.length; i += 4) {
      maxR = Math.max(maxR, d[i]);
      if ((d[i + 1] > d[i] * 0.3 + 6 || d[i + 2] > d[i] * 0.3 + 6) && Math.max(d[i + 1], d[i + 2]) > 20) n++;
    }
    return { n, maxR };
  }, png.toString('base64'));
  expect(r.n).toBe(0);
  expect(r.maxR).toBeGreaterThan(150);
});

test('Ders 3, bölüm 4 ("Gökte geri giden gezegenler"): mini deney açılır', async ({ page }) => {
  await page.goto('/index.html#ders/d3');
  const m = page.locator('.mini-deney[data-deney="gezegenyolu"]');
  await expect(m).toHaveCount(1);
  await expect(m.locator('.mini-bas b')).toHaveText('Dene: Gezegen yolu');
  /* bölüm başlığı "Gökte geri giden gezegenler" olan bölümün içinde */
  const baslik = await m.evaluate(e => { const ls = [...document.querySelectorAll('article h2')].filter(h => h.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING); return ls.length ? ls[ls.length - 1].textContent : ''; });
  expect(baslik).toContain('Gökte geri giden gezegenler');
  await m.locator('.mini-ac').click();
  await expect(m.locator('#gyDurak1')).toHaveText(/^10 Ocak 2027/);
  await expect(m.locator('#gyKanvas')).toBeVisible();
});
