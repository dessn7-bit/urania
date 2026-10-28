'use strict';
/* Astro sözlük (sozluk.js, veri/sozluk.json): ders metninde terimlerin işaretlenmesi, kısa tanım penceresi,
   aranabilir sözlük sayfası, derin bağlantı, kırmızı mod ve sesli okumanın değişmemesi.
   Ağ isteği atılmaz: yerel sunucu dışındaki her istek kesilir. */
const { test, expect } = require('@playwright/test');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('sz_kuruldu')) {
      sessionStorage.setItem('sz_kuruldu', '1');
      localStorage.setItem('urania_konumOto', 'false');
    }
  });
  await page.clock.install({ time: SABIT_AN });
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function dersAc(page, id) {
  await page.goto('/index.html#ders/' + (id || 'd5'));
  await expect(page.locator('article.ders h1')).toBeVisible();
  await expect(page.locator('article.ders button.terim').first()).toBeVisible();
}
/* Elle kurulmuş bir metinde işaretle: ders içeriği değişse de sınanan kurallar sabit kalır */
async function denemeMetni(page, html, secenek) {
  return page.evaluate(async ([h, s]) => {
    const k = document.createElement('div');
    k.id = 'szDeneme';
    k.innerHTML = h;
    document.querySelector('#b-ders').appendChild(k);
    const n = await window.Sozluk.isaretle(k, s);
    return { n, terimler: [...k.querySelectorAll('button.terim')].map(b => [b.dataset.terim, b.textContent]) };
  }, [html, secenek || null]);
}

test('derste terimlerin altı noktalı çizili; çekimli biçimler (anakoldaki, kırmızı devler, Sefeidlerin) de eşleşir', async ({ page }) => {
  await dersAc(page, 'd5');
  const ders = await page.evaluate(() => {
    const ts = [...document.querySelectorAll('article.ders button.terim')];
    const s = getComputedStyle(ts[0]);
    return { n: ts.length, cekimli: ts.filter(b => !window.Sozluk.bul(b.dataset.terim).terim.toLocaleLowerCase('tr-TR').startsWith(b.textContent.toLocaleLowerCase('tr-TR'))).length,
      cizgi: s.textDecorationLine, bicim: s.textDecorationStyle, renk: s.color, pRenk: getComputedStyle(ts[0].closest('p, li, div')).color, tur: ts[0].type, etiket: ts.filter(b => b.hasAttribute('aria-label')).length };
  });
  expect(ders.n).toBeGreaterThan(10);
  expect(ders.cekimli).toBeGreaterThan(0);
  expect(ders.cizgi).toBe('underline');
  expect(ders.bicim).toBe('dotted');
  expect(ders.renk).toBe(ders.pRenk);          // yazı rengi değişmez, bağlantı gibi görünmez
  expect(ders.tur).toBe('button');
  expect(ders.etiket).toBe(0);                  // aria-label yok: okunan ad terimin kendisi
  const r = await denemeMetni(page, '<p>Anakoldaki yıldızlar kırmızı devler olur. Sefeidlerin dönemi ışık yıllarınca öteden ölçülür. IŞIK YILI.</p>');
  expect(r.terimler).toEqual([['anakol', 'Anakoldaki'], ['kirmizi-dev', 'kırmızı devler'], ['sefeid', 'Sefeidlerin'], ['isik-yili', 'ışık yıllarınca']]);
});

test('her terim sayfada yalnız ilk geçtiği yerde işaretlenir; uzun terim kısasından önce gelir', async ({ page }) => {
  await dersAc(page, 'd6');
  const tekrar = await page.evaluate(() => {
    const ls = [...document.querySelectorAll('article.ders button.terim')].map(b => b.dataset.terim);
    return ls.filter((x, i) => ls.indexOf(x) !== i);
  });
  expect(tekrar).toEqual([]);
  const r = await denemeMetni(page, '<p>Bir parsek yaklaşık 3,26 ışık yılıdır.</p><p>İki parsek, parsekler. Beyaz cüce bir cüce yıldızdır; beyaz cücenin.</p>');
  expect(r.terimler).toEqual([['parsek', 'parsek'], ['isik-yili', 'ışık yılıdır'], ['beyaz-cuce', 'Beyaz cüce']]);
  /* Aynı köke ikinci kez çağırmak yeni düğme eklemez */
  expect(await page.evaluate(() => window.Sozluk.isaretle(document.querySelector('#szDeneme')))).toBe(0);
});

test('başlıklarda, bağlantılarda, düğmelerde, çizimlerde, dersin kendi sözlüğünde ve dinleme çubuğunda işaretlenmez', async ({ page }) => {
  await dersAc(page, 'd5');
  expect(await page.locator('article.ders :is(h1,h2,h3,a,figure,svg,.dinle,dl.sozluk,.formul,summary,label) button.terim').count()).toBe(0);
  const r = await denemeMetni(page, '<h2>Anakol ve parsek</h2><p><a href="#ders/d5">anakol</a> <button type="button">parsek</button> <code>anakol</code></p><figure><figcaption>parsek</figcaption></figure><p data-sozluk-yok>anakol</p><p>Son olarak anakol.</p>');
  expect(r.terimler).toEqual([['anakol', 'anakol']]);
  expect(await page.locator('#szDeneme p').last().locator('button.terim').count()).toBe(1);
});

test('kısa tanım: dokununca açılır, adlandırılmış; Kapat, Esc ve dışarı dokunuş kapatır, odak terime döner', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 860 });
  await dersAc(page, 'd5');
  const terim = page.locator('article.ders p.okunur button.terim').first();
  const kimlik = await terim.getAttribute('data-terim');
  const ad = await page.evaluate(k => window.Sozluk.bul(k).terim, kimlik);
  const pen = page.locator('dialog.sz-pen');
  await terim.click();
  await expect(pen).toBeVisible();
  await expect(pen).toHaveAttribute('aria-labelledby', 'szPenBas');
  await expect(page.getByRole('dialog', { name: ad })).toBeVisible();
  await expect(pen.locator('#szPenTanim')).not.toBeEmpty();
  await expect(pen.locator('.sz-dersler a[href="#ders/d5"]')).toBeVisible();
  await expect(pen.locator('.sz-pen-ac')).toHaveAttribute('href', '#ders/sozluk/' + kimlik);
  /* Telefonda alttan açılan sayfa: alt kenarı ekranın altında */
  const kutu = await pen.boundingBox();
  expect(Math.round(kutu.y + kutu.height)).toBeGreaterThanOrEqual(858);
  expect(kutu.width).toBeGreaterThanOrEqual(410);
  await page.keyboard.press('Escape');
  await expect(pen).toBeHidden();
  await expect(terim).toBeFocused();
  await terim.click();
  await pen.locator('.sz-kapat').click();
  await expect(pen).toBeHidden();
  await expect(terim).toBeFocused();
  await terim.click();
  await expect(pen).toBeVisible();
  await page.mouse.click(200, 30);           // arka plana dokunuş
  await expect(pen).toBeHidden();
  await expect(terim).toBeFocused();
  /* Penceredeki "Sözlükte aç" sözlük sayfasına götürür, pencere kapanır */
  await terim.click();
  await pen.locator('.sz-pen-ac').click();
  await expect(pen).toBeHidden();
  await expect(page).toHaveURL(new RegExp('#ders/sozluk/' + kimlik + '$'));
  await expect(page.locator('#sz-' + kimlik)).toBeFocused();
});

test('geniş ekranda pencere terimin yanında açılır ve ekrandan taşmaz', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 800 });
  await dersAc(page, 'd5');
  const terim = page.locator('article.ders p.okunur button.terim').nth(2);
  await terim.scrollIntoViewIfNeeded();
  await terim.click();
  const pen = page.locator('dialog.sz-pen');
  await expect(pen).toBeVisible();
  const [t, p] = [await terim.boundingBox(), await pen.boundingBox()];
  expect(p.x).toBeGreaterThanOrEqual(0);
  expect(p.x + p.width).toBeLessThanOrEqual(900);
  expect(p.y >= t.y + t.height || p.y + p.height <= t.y).toBe(true);   // terimi örtmez
  expect(Math.abs(p.y - (t.y + t.height)) < 40 || Math.abs(p.y + p.height - t.y) < 40).toBe(true);
});

test('Dersler listesinde "Astro sözlük" girişi; sözlük sayfasında Türkçe harfe duyarsız arama', async ({ page }) => {
  await page.goto('/index.html#ders');
  const giris = page.locator('a.sozluk-giris');
  await expect(giris).toContainText('Astro sözlük');
  await giris.click();
  await expect(page).toHaveURL(/#ders\/sozluk$/);
  await expect(page.locator('#b-ders h1')).toHaveText('Astro sözlük');
  const toplam = await page.locator('.sz-oge').count();
  expect(toplam).toBeGreaterThan(200);
  const ara = page.locator('#szAra');
  for (const q of ['isik yili', 'IŞIK YILI', 'Işık yılı']) {
    await ara.fill(q);
    await expect(page.locator('#sz-isik-yili')).toBeVisible();
    await expect(page.locator('#sz-anakol')).toBeHidden();
    await expect(page.locator('.sz-grup[data-harf="A"]')).toBeHidden();
  }
  await ara.fill('pulsar');                  // eş anlamlıdan bulur
  await expect(page.locator('#sz-atarca')).toBeVisible();
  await expect(page.locator('#szSonuc')).toContainText('1 terim');
  await ara.fill('zzqx');
  await expect(page.locator('.sz-yok')).toBeVisible();
  await ara.fill('');
  await expect(page.locator('.sz-oge:visible')).toHaveCount(toplam);
  /* Harfe atlama */
  await page.locator('.sz-harf[data-harf="P"]').click();
  await expect(page.locator('#sz-h-P')).toBeFocused();
});

test('derin bağlantı #ders/sozluk/<kimlik>: terime kayar, vurgular, odaklar; ders bağlantıları çalışır', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 860 });
  await page.goto('/index.html#ders/sozluk/parsek');
  const oge = page.locator('#sz-parsek');
  await expect(oge).toHaveClass(/sz-vurgu/);
  await expect(oge).toBeFocused();
  await expect(oge).toBeInViewport();
  await expect(oge.locator('.sz-tanim')).toContainText('3,26');
  await expect(oge.locator('.kaynak a').first()).toHaveAttribute('href', /^https:\/\//);
  /* Sayfa içinde başka terime geçiş */
  await page.goto('/index.html#ders/sozluk/anakol');
  await expect(page.locator('#sz-anakol')).toHaveClass(/sz-vurgu/);
  await expect(page.locator('#sz-parsek')).not.toHaveClass(/sz-vurgu/);
  await page.locator('#sz-anakol .sz-ders a').first().click();
  await expect(page.locator('article.ders h1')).toBeVisible();
  /* Olmayan terim: sayfa açılır, uyarı */
  await page.goto('/index.html#ders/sozluk/boyle-bir-sey-yok');
  await expect(page.locator('#b-ders .hata-kutu')).toContainText('sözlükte yok');
});

/* Kırmızı mod: yalnız kırmızı tonlar (G ve B, R'nin en çok %30'u; saydamlar ve siyah serbest) */
async function renkler(page, secici) {
  return page.evaluate(sec => {
    const ls = [];
    const sayilar = c => (c.match(/[\d.]+/g) || []).map(Number);
    for (const el of document.querySelectorAll(sec)) {
      const s = getComputedStyle(el);
      for (const ad of ['color', 'backgroundColor', 'borderTopColor', 'textDecorationColor', 'outlineColor']) {
        const v = s[ad];
        if (!v || v === 'transparent' || /rgba\(0, 0, 0, 0\)/.test(v)) continue;
        let r, g, b, a = 1;
        if (v.startsWith('color(srgb')) { [r, g, b, a = 1] = sayilar(v.replace('color(srgb', '')); r *= 255; g *= 255; b *= 255; }
        else [r, g, b, a = 1] = sayilar(v);
        if (a === 0 || (r + g + b) === 0) continue;
        if (g > r * 0.3 + 1 || b > r * 0.3 + 1) ls.push(sec + ' ' + el.className + ' ' + ad + '=' + v);
      }
    }
    return ls;
  }, secici);
}
test('kırmızı modda terim çizgisi, pencere ve sözlük sayfası yalnız kırmızı', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('urania_kirmizi', 'true'));
  await page.setViewportSize({ width: 412, height: 860 });
  await dersAc(page, 'd5');
  await expect(page.locator('html')).toHaveClass(/kirmizi/);
  expect(await renkler(page, 'article.ders button.terim')).toEqual([]);
  await page.locator('article.ders p.okunur button.terim').first().click();
  await expect(page.locator('dialog.sz-pen')).toBeVisible();
  expect(await renkler(page, 'dialog.sz-pen, dialog.sz-pen *')).toEqual([]);
  await page.keyboard.press('Escape');
  await page.goto('/index.html#ders');
  expect(await renkler(page, 'a.sozluk-giris, a.sozluk-giris *')).toEqual([]);
  await page.goto('/index.html#ders/sozluk/parsek');
  await expect(page.locator('#sz-parsek')).toBeFocused();
  await page.locator('#szAra').fill('a');
  expect(await renkler(page, '.sz-sayfa, .sz-sayfa *')).toEqual([]);
});

test('hareket azaltılınca pencere ve vurgu canlandırılmaz', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 412, height: 860 });
  await dersAc(page, 'd5');
  await page.locator('article.ders p.okunur button.terim').first().click();
  expect(await page.locator('dialog.sz-pen').evaluate(d => getComputedStyle(d).animationName)).toBe('none');
  await page.keyboard.press('Escape');
  await page.goto('/index.html#ders/sozluk/parsek');
  expect(await page.locator('#sz-parsek').evaluate(d => getComputedStyle(d).animationName)).toBe('none');
});

test('sesli okuma metni değişmez: işaretlemeden önce ve sonra .okunur innerText ve Ses.parcala çıktısı aynı', async ({ page }) => {
  await dersAc(page, 'd5');
  const r = await page.evaluate(() => {
    const art = document.querySelector('article.ders');
    const bloklar = [...art.querySelectorAll('.okunur')];
    const oku = () => bloklar.map(el => el.dataset.ses || el.innerText.trim());
    const parca = ls => ls.map(t => window.Ses.parcala(window.Okunus.okunus(t)).join('‖'));
    const sonra = oku(), sonraP = parca(sonra), sonraTc = bloklar.map(el => el.textContent);
    const isaretli = bloklar.filter(el => el.querySelector('button.terim')).length;
    /* düğmeleri sök: işaretlenmemiş hâl */
    art.querySelectorAll('button.terim').forEach(b => b.replaceWith(document.createTextNode(b.textContent)));
    art.normalize();
    const once = oku(), onceP = parca(once), onceTc = bloklar.map(el => el.textContent);
    return { isaretli, esit: JSON.stringify(once) === JSON.stringify(sonra), pEsit: JSON.stringify(onceP) === JSON.stringify(sonraP),
      tcEsit: JSON.stringify(onceTc) === JSON.stringify(sonraTc), fark: once.find((x, i) => x !== sonra[i]) || null };
  });
  expect(r.isaretli).toBeGreaterThan(5);
  expect(r.fark).toBe(null);
  expect(r.esit).toBe(true);
  expect(r.pEsit).toBe(true);
  expect(r.tcEsit).toBe(true);
});
