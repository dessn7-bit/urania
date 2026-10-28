'use strict';
/* Bulma haritası (bulucu.js): dürbün hedefine parlak bir yıldızdan atlama.
   Ağ yok: dış istekler kesilir, CelesTrak fikstürü, Open-Meteo ve Nominatim sahte; saat ve konum sabit. */
const { test, expect } = require('@playwright/test');
const { celestrak, disAgiKes } = require('./yardim');
const Bulucu = require('../bulucu.js');
const Gok = require('../gok.js');
const YILDIZ = require('../veri/yildizlar.json');
const TY = require('../veri/takimyildiz.json');
const HEDEF = require('../veri/hedefler.json').hedefler;

const ZAMAN = '2026-10-28T21:00:00+03:00';
const KONUM = { ad: 'Fetih Mah.', enlem: 41.0046, boylam: 29.0762, yukseklik: 20, oto: false, saatDilimi: 'Europe/Istanbul' };

async function kur(page, s) {
  s = s || {};
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await celestrak(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [] } } }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
  await page.clock.install({ time: new Date(ZAMAN) });
  await page.addInitScript(([k, kir]) => {
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify(k));
    if (kir) localStorage.setItem('urania_kirmizi', 'true');
  }, [KONUM, !!s.kirmizi]);
  await page.goto('/index.html#hesap');
  await page.waitForFunction(() => window.Bulucu && window.Urania && window.Gok);
}
/* Haritayı açan düğme: odak kapanınca buraya dönmeli */
async function ac(page, id) {
  await page.evaluate(async ([id, zaman]) => {
    let d = document.getElementById('testAcan');
    if (!d) { d = document.createElement('button'); d.id = 'testAcan'; d.textContent = 'Bul'; document.body.prepend(d); }
    d.focus();
    const h = (await Urania.veri('hedefler')).hedefler.find(x => x.id === id);
    await Bulucu.ac(h, { zaman: new Date(zaman), gzl: Gok.gozlemci(41.0046, 29.0762, 20) });
  }, [id, ZAMAN]);
  await page.waitForSelector('#bulucuPanel[open] svg.bulucu-svg');
}

test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });

test.describe('İzdüşüm (Node)', () => {
  const veri = { yildizlar: YILDIZ, takimyildizlar: TY };
  const gzl = Gok.gozlemci(41.0046, 29.0762, 20);
  for (const id of ['M31', 'M45', 'M13', 'M42', 'M27', 'Albireo']) {
    test(id + ': başlangıç–hedef uzaklığı haritada gerçek açısal ayrımla aynı (%1)', () => {
      const h = HEDEF.find(x => x.id === id);
      const r = Bulucu.hesapla(veri, h, new Date(ZAMAN), gzl, 400, 400);
      const b = YILDIZ.y[r.baslangic.i];
      /* Gerçek ayrım, bulucu.js'den bağımsız: küresel kosinüs formülü */
      const D = Math.PI / 180;
      const gercek = Math.acos(Math.sin(b[1] * D) * Math.sin(h.dec * D) + Math.cos(b[1] * D) * Math.cos(h.dec * D) * Math.cos((b[0] - h.ra) * D)) / D;
      const harita = Math.hypot(r.hedef.x - r.baslangic.x, r.hedef.y - r.baslangic.y) / r.olcek;
      expect(Math.abs(harita - gercek) / gercek).toBeLessThan(0.01);
      expect(r.alan).toBeGreaterThanOrEqual(15);
      expect(r.alan).toBeLessThanOrEqual(26);
      /* Her adım en çok bir dürbün alanı (tek ok yalnız 1,5 alana kadar) */
      if (r.adim > 1) r.yol.slice(1).forEach((n, k) => {
        const a = r.yol[k];
        expect(Math.hypot(n.x - a.x, n.y - a.y) / r.olcek).toBeLessThanOrEqual(r.gorus * 1.02);
      });
      else expect(gercek).toBeLessThanOrEqual(1.5 * r.gorus);
    });
  }
  test('Merkezdeki ölçek: küçük açılar her yönde doğru, yukarı = başucu', () => {
    const P = Bulucu.izdusum([0.5, 0.2, Math.sqrt(1 - 0.29)]);
    const c = P.c;
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(e => {
      const t = [e[0] - c[0] * (e[0] * c[0] + e[1] * c[1] + e[2] * c[2]), e[1] - c[1] * (e[0] * c[0] + e[1] * c[1] + e[2] * c[2]), e[2] - c[2] * (e[0] * c[0] + e[1] * c[1] + e[2] * c[2])];
      const n = Math.hypot(...t), d = 2 * Math.PI / 180;
      const p = [0, 1, 2].map(i => c[i] * Math.cos(d) + t[i] / n * Math.sin(d));
      const q = P(p);
      expect(Math.abs(Math.hypot(q.x, q.y) - d) / d).toBeLessThan(0.001);
    });
    /* Başucuna doğru bir adım ekranda dik yukarı */
    const z = Bulucu.yolda(c, [0, 0, 1], 3);
    const q = P(z);
    expect(Math.abs(q.x)).toBeLessThan(1e-9);
    expect(q.y).toBeGreaterThan(0);
  });
});

test.describe('Diyalog', () => {
  test.use({ viewport: { width: 412, height: 900 } });

  for (const [id, yildiz] of [['M31', 'Mirach'], ['M45', 'Aldebaran']]) {
    test(id + ': başlangıç yıldızı etiketli ve gerçek bir parlak yıldız; hedef halkası, dürbün dairesi, taşma yok', async ({ page }) => {
      await kur(page);
      await ac(page, id);
      const s = await page.evaluate(() => {
        const svg = document.querySelector('#bulucuPanel svg.bulucu-svg');
        const vb = svg.viewBox.baseVal;
        const et = svg.querySelector('text[data-rol="baslangic"]');
        const halka = svg.querySelector('circle[data-rol="hedef"]');
        const alan = svg.querySelector('circle.bulucu-alan');
        const kok = getComputedStyle(document.documentElement);
        const metinler = [...svg.querySelectorAll('text')].map(t => {
          const b = t.getBBox();
          return { metin: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height, boy: parseFloat(getComputedStyle(t).fontSize) };
        });
        const panel = document.getElementById('bulucuPanel');
        return {
          W: vb.width, H: vb.height, cssW: svg.getBoundingClientRect().width,
          olcek: Number(svg.dataset.olcek), gorus: Number(svg.dataset.gorus),
          et: et && et.textContent, yildiz: et && Number(et.dataset.yildiz),
          halka: halka && { cx: +halka.getAttribute('cx'), cy: +halka.getAttribute('cy'), r: +halka.getAttribute('r'), renk: getComputedStyle(halka).stroke, hedefRenk: kok.getPropertyValue('--hedef').trim() },
          alanR: alan && +alan.getAttribute('r'),
          metinler, rol: svg.getAttribute('role'), aria: svg.getAttribute('aria-label'),
          baslik: document.getElementById(panel.getAttribute('aria-labelledby')).textContent,
          tarif: document.getElementById('bulucuTarif').textContent
        };
      });
      /* Başlangıç yıldızı: etiket, veri dosyasındaki ad ve ≤ 2,5 kadir */
      expect(s.et).toBe(yildiz);
      expect(YILDIZ.adlar[s.yildiz]).toBe(yildiz);
      expect(YILDIZ.y[s.yildiz][2]).toBeLessThanOrEqual(2.5);
      expect(s.tarif).toContain(yildiz);
      /* Hedef halkası --hedef renginde, harita içinde */
      expect(s.halka).toBeTruthy();
      expect(s.halka.r).toBeGreaterThanOrEqual(5);
      expect(s.halka.cx).toBeGreaterThan(0); expect(s.halka.cx).toBeLessThan(s.W);
      expect(s.halka.cy).toBeGreaterThan(0); expect(s.halka.cy).toBeLessThan(s.H);
      const rgb = h => { const m = h.match(/^#(..)(..)(..)$/); return 'rgb(' + [1, 2, 3].map(i => parseInt(m[i], 16)).join(', ') + ')'; };
      expect(s.halka.renk).toBe(rgb(s.halka.hedefRenk));
      /* Dürbün dairesi: yarıçap / ölçek ≈ alanın yarısı (%5) */
      expect(s.gorus).toBeGreaterThanOrEqual(6); expect(s.gorus).toBeLessThanOrEqual(7.5);
      expect(Math.abs(s.alanR / s.olcek - s.gorus / 2) / (s.gorus / 2)).toBeLessThan(0.05);
      /* 1 birim = 1 CSS px; hiçbir yazı taşmıyor, hepsi ≥ 11 px */
      expect(Math.abs(s.cssW - s.W)).toBeLessThan(1.5);
      expect(s.metinler.length).toBeGreaterThanOrEqual(3);
      s.metinler.forEach(t => {
        expect(t.boy, t.metin).toBeGreaterThanOrEqual(11);
        expect(t.x, t.metin).toBeGreaterThanOrEqual(0);
        expect(t.y, t.metin).toBeGreaterThanOrEqual(0);
        expect(t.x + t.w, t.metin).toBeLessThanOrEqual(s.W);
        expect(t.y + t.h, t.metin).toBeLessThanOrEqual(s.H);
      });
      /* Erişilebilirlik: başlıklı diyalog, özetli resim */
      expect(s.baslik).toContain(id);
      expect(s.rol).toBe('img');
      expect(s.aria).toContain(yildiz);
      expect(s.aria).toContain(id);
    });
  }

  test('Esc kapatır, odak açan düğmeye döner', async ({ page }) => {
    await kur(page);
    await ac(page, 'M31');
    expect(await page.evaluate(() => document.getElementById('bulucuPanel').contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#bulucuPanel')).not.toHaveAttribute('open', '');
    expect(await page.evaluate(() => document.activeElement && document.activeElement.id)).toBe('testAcan');
    /* Kapat düğmesi de aynı */
    await ac(page, 'M45');
    await page.locator('#bulucuPanel .bulucu-kapat').click();
    await expect(page.locator('#bulucuPanel')).not.toHaveAttribute('open', '');
    expect(await page.evaluate(() => document.activeElement && document.activeElement.id)).toBe('testAcan');
  });

  test('Ufkun altındaki hedef (M42, 21:00): uyarı ve taralı yer', async ({ page }) => {
    await kur(page);
    await ac(page, 'M42');
    await expect(page.locator('#bulucuDurum .bulucu-uyari')).toBeVisible();
    await expect(page.locator('#bulucuDurum')).toContainText('ufkun altında');
    expect(await page.locator('#bulucuPanel path.bulucu-yer').count()).toBe(1);
  });
});

test.describe('Dar ekran', () => {
  test.use({ viewport: { width: 320, height: 700 } });
  test('320 px: harita sayfaya sığar, yazılar taşmaz', async ({ page }) => {
    await kur(page);
    for (const id of ['M13', 'M8']) {
      await ac(page, id);
      const s = await page.evaluate(() => {
        const svg = document.querySelector('#bulucuPanel svg.bulucu-svg');
        const vb = svg.viewBox.baseVal, b = svg.getBoundingClientRect();
        return { W: vb.width, H: vb.height, sag: b.right, kaydirma: document.documentElement.scrollWidth,
          tasan: [...svg.querySelectorAll('text')].filter(t => { const k = t.getBBox(); return k.x < 0 || k.y < 0 || k.x + k.width > vb.width || k.y + k.height > vb.height; }).map(t => t.textContent) };
      });
      expect(s.sag).toBeLessThanOrEqual(320);
      expect(s.kaydirma).toBeLessThanOrEqual(320);
      expect(s.tasan).toEqual([]);
      await page.keyboard.press('Escape');
    }
  });
});

test.describe('Kırmızı mod', () => {
  test.use({ viewport: { width: 551, height: 1000 } });
  test('Diyalogdaki her öğenin dolgu, kontur, yazı, zemin ve kenar rengi yalnız kırmızı/siyah', async ({ page }) => {
    await kur(page, { kirmizi: true });
    for (const id of ['M31', 'M45', 'M42']) {
      await ac(page, id);
      const kotu = await page.evaluate(() => {
        const sorun = [];
        const renkler = s => (s.match(/rgba?\([^)]*\)/g) || []);
        const denetle = (el, ozellik, deger) => renkler(deger).forEach(r => {
          const [R, Gr, B, A] = r.replace(/rgba?\(|\)/g, '').split(',').map(Number);
          if (A === 0) return;
          if (Math.max(Gr, B) > 0.31 * R + 2) sorun.push((el.getAttribute('class') || el.tagName) + ' ' + ozellik + ' ' + r);
        });
        const panel = document.getElementById('bulucuPanel');
        [panel, ...panel.querySelectorAll('*')].forEach(el => {
          const st = getComputedStyle(el);
          ['fill', 'stroke', 'color', 'backgroundColor', 'borderTopColor', 'borderBottomColor', 'outlineColor'].forEach(o => denetle(el, o, st[o]));
        });
        denetle(panel, '::backdrop', getComputedStyle(panel, '::backdrop').backgroundColor);
        return sorun;
      });
      expect(kotu).toEqual([]);
      await page.keyboard.press('Escape');
    }
  });
});
