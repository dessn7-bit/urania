'use strict';
/* Kabuk ve öteki sekmeler — denetim 2026-10-30 alan 4 (A4-01…A4-14) ve dersler.js'teki A3-13, A3B-08 düzeltmelerinin
   testleri. Ağ isteği atılmaz: dış istekler kesilir ya da sahte yanıtla karşılanır. */
const { test, expect } = require('@playwright/test');
const { celestrak, disAgiKes } = require('./yardim');

test.beforeEach(async ({ page }) => {
  await disAgiKes(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ status: 503, body: '' }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
  await celestrak(page, { hata: 503 });
  await page.clock.install({ time: new Date('2026-10-27T21:00:00+03:00') });
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

const depoKoy = (page, ad, deger) => page.addInitScript(([a, d]) => { if (!sessionStorage.getItem('kur_' + a)) { localStorage.setItem('urania_' + a, d); sessionStorage.setItem('kur_' + a, '1'); } }, [ad, deger]);

test('A4-01: bozuk konum kaydı (dize/boolean enlem, sayı olmayan ya da aşırı yükseklik) Gökyüzü, Görevler ve Defter\'i düşürmez', async ({ page }) => {
  test.setTimeout(60000);
  const bozuklar = [
    { ad: 5, enlem: 41, boylam: 29, yukseklik: 'x', saatDilimi: 'Mars/Olympus' },
    { enlem: '41', boylam: '29' },
    { enlem: true, boylam: 29 },
    { ad: 'Yüksek', enlem: 41, boylam: 29, yukseklik: 1e9 }
  ];
  for (const k of bozuklar) {
    await page.goto('/index.html#gok');
    await page.evaluate(v => { localStorage.clear(); localStorage.setItem('urania_konum', JSON.stringify(v)); localStorage.setItem('urania_konumOto', 'false'); }, k);
    await page.reload();
    await expect(page.locator('#gkOzet p').first(), JSON.stringify(k)).toBeVisible();
    await expect(page.locator('.bolum-hata')).toHaveCount(0);
    const kn = await page.evaluate(() => Urania.konum());
    expect(typeof kn.enlem).toBe('number');
    expect(Number.isFinite(kn.yukseklik) && kn.yukseklik >= -500 && kn.yukseklik <= 100000).toBe(true);
    expect(typeof kn.ad).toBe('string');
    await page.goto('/index.html#defter/gorevler');
    await expect(page.locator('#b-defter')).not.toContainText('hazırlanamadı');
  }
  /* Defter'de Kaydet bozuk yükseklikte de kaydeder (otomatik() gözlemci hesabını try içinde yapar) */
  await page.evaluate(() => localStorage.setItem('urania_konum', JSON.stringify({ ad: 'X', enlem: 41, boylam: 29, yukseklik: 'x' })));
  await page.goto('/index.html#defter');
  await page.reload();
  await page.locator('#dfYeni').click();
  await page.locator('#dfCisim').selectOption('cisim:Jupiter');
  await page.locator('#dfKaydet').click();
  await expect(page.locator('#dfListe li')).toHaveCount(1);
});

test('A4-03: Haberler sekmesinin sayfa başlığı "Urania — Haberler"', async ({ page }) => {
  await page.goto('/index.html#haber');
  await expect(page.locator('#b-haber h1')).toHaveText('Haberler');
  await expect(page).toHaveTitle('Urania — Haberler');
  const id = await page.locator('article.haber').first().getAttribute('data-id');
  await page.goto('/index.html#haber/' + id);
  await expect(page).toHaveTitle('Urania — Haberler');
});

test('A4-04: depo yazılamazken haber filtresi ve kırmızı mod oturum boyunca çalışır', async ({ page }) => {
  await page.goto('/index.html#haber');
  await expect(page.locator('.hb-filtre button').first()).toBeVisible();
  await page.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException('dolu', 'QuotaExceededError'); }; });
  const gorev = page.locator('.hb-filtre button[data-f="gorev"]');
  await gorev.click();
  await expect(page.locator('.hb-filtre button[data-f="gorev"]')).toHaveAttribute('aria-pressed', 'true');
  const turler = await page.locator('article.haber').evaluateAll(a => [...new Set(a.map(x => x.dataset.tur))]);
  expect(turler).toEqual(['gorev']);
  await page.locator('#kirmiziDugme').click();
  await expect(page.locator('html')).toHaveClass(/kirmizi/);
  expect(await page.evaluate(() => Urania.oku('kirmizi', false))).toBe(true);
});

test('A4-04: depo tümden kapalıyken (SecurityError) filtre çalışır', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('kapalı', 'SecurityError'); } });
  });
  await page.goto('/index.html#haber');
  await page.locator('.hb-filtre button[data-f="arastirma"]').click();
  await expect(page.locator('.hb-filtre button[data-f="arastirma"]')).toHaveAttribute('aria-pressed', 'true');
});

test('A4-05 ve A4-09: bozuk uydu önbelleği ve dizi olmayan defter tanı raporunu düşürmez', async ({ page }) => {
  await depoKoy(page, 'gp_istasyon', JSON.stringify({ ls: [{ OBJECT_NAME: 'ISS', EPOCH: '2026' }], alindi: 1e20 }));
  await depoKoy(page, 'gp_dizi', JSON.stringify({ diziler: [null, { kod: 'G1', adet: 3, yukseklik: 300 }] }));
  await depoKoy(page, 'defter', JSON.stringify({ a: 1 }));
  await page.goto('/index.html#tani');
  await expect(page.locator('#tnRapor')).toContainText('URANIA TANI');
  await expect(page.locator('#tnRapor')).toContainText('defter 0 kayıt');
  await expect(page.locator('#tnRapor')).toContainText('ISS 2026');
  await expect(page.locator('#tnRapor')).toContainText('G1 (3, 300 km)');
  await expect(page.locator('#tnRapor')).toContainText('haber görselleri');
  await page.locator('#tnKopyala').click();
  await expect(page.locator('#tnDurum')).not.toHaveText('');
});

test('A4-06: bilimsel gösterimde mantis 10\'a yuvarlanınca üs artar', async ({ page }) => {
  await page.goto('/index.html#hesap');
  const s = await page.evaluate(() => [Urania.bilimsel(99999000, 3), Urania.bilimsel(99999000, 4), Urania.bilimsel(0.00099999, 3), Urania.bilimsel(-999990000, 3), Urania.bilimsel(1.234e8, 3), Urania.bilimsel(9.94e7, 2)]);
  expect(s).toEqual(['1,00 × 10⁸', '1,000 × 10⁸', '1,00 × 10⁻³', '-1,00 × 10⁹', '1,23 × 10⁸', '9,9 × 10⁷']);
  await page.locator('#uzD').fill('99999000');
  await page.locator('#uzB').selectOption('km');
  await expect(page.locator('#uzS')).toContainText('1,000 × 10⁸ km');
});

test('A4-07: 0050 yılı 1950 olarak kaydedilmez', async ({ page }) => {
  await page.goto('/index.html#defter');
  await page.locator('#dfYeni').click();
  await page.locator('#dfCisim').selectOption('cisim:Jupiter');
  await page.locator('#dfZaman').fill('0050-06-01T22:00');
  await page.locator('#dfKaydet').click();
  await expect(page.locator('#dfListe li')).toHaveCount(1);
  const z = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_defter'))[0].zaman);
  expect(z.slice(0, 4)).toBe('0050');
  /* Dönüşte forma yine 0050 gelir */
  await page.locator('#dfListe [data-is="duzenle"]').click();
  await expect(page.locator('#dfZaman')).toHaveValue('0050-06-01T22:00');
});

test('A4-08: yedekte ISO 8601 olmayan zaman ("1") reddedilir', async ({ page }) => {
  await page.goto('/index.html#defter');
  await page.locator('details summary', { hasText: 'Yedekle' }).click();
  const kayit = (id, zaman) => ({ id, zaman, cisim: { anahtar: 'cisim:Jupiter', ad: 'Jüpiter' }, alet: 'Çıplak göz', kosul: 'Berrak', not: '', konum: { ad: 'İstanbul', enlem: 41, boylam: 29.1 }, otomatik: {} });
  const yedek = { uygulama: 'Urania', tur: 'gozlem-defteri', surum: 1, kayitlar: [kayit('iyi', '2026-10-27T18:00:00.000Z'), kayit('sayizaman', '1')] };
  await page.locator('#dfYukle').setInputFiles({ name: 'y.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(yedek)) });
  await expect(page.locator('#dfYedekDurum')).toHaveText('1 kayıt eklendi, 1 kayıt bozuk olduğu için atlandı.');
});

test('A4-10 ve A3-13: bozuk % dizili haber ve sözlük adresleri bölümü hata kutusuna düşürmez', async ({ page }) => {
  await page.goto('/index.html#haber/%E0%A4');
  await expect(page.locator('#b-haber h1')).toHaveText('Haberler');
  await expect(page.locator('.bolum-hata')).toHaveCount(0);
  await page.goto('/index.html#ders/sozluk/%E0%A4');
  await expect(page.locator('#b-ders h1')).toBeVisible();
  await expect(page.locator('#b-ders')).not.toContainText('Dersler yükleniyor');
  await expect(page.locator('.bolum-hata')).toHaveCount(0);
  /* Sonra geçerli bir sözlük adresi de açılır (bölüm yeniden kurulmadı, çift dinleyici yok) */
  await page.goto('/index.html#ders');
  await expect(page.locator('details.unite').first()).toBeAttached();
});

test('A4-11: ünite numarası en az 3:1 karşıtlıkta (normal ve kırmızı mod)', async ({ page }) => {
  for (const kirmizi of [false, true]) {
    await page.goto('/index.html#ders');
    await page.evaluate(k => { localStorage.setItem('urania_kirmizi', JSON.stringify(k)); }, kirmizi);
    await page.reload();
    await expect(page.locator('.unite-no').first()).toBeVisible();
    const oran = await page.locator('.unite-no').first().evaluate(el => {
      const rgb = s => s.match(/[\d.]+/g).map(Number);
      const lum = ([r, g, b]) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((t, v, i) => t + v * [0.2126, 0.7152, 0.0722][i], 0);
      let z = el, zemin = null;
      while (z) { const c = getComputedStyle(z).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) { zemin = rgb(c); break; } z = z.parentElement; }
      zemin = zemin || [0, 0, 0];
      const r = rgb(getComputedStyle(el).color);
      const a = r.length > 3 ? r[3] : 1;
      const on = [0, 1, 2].map(i => r[i] * a + zemin[i] * (1 - a));
      const [l1, l2] = [lum(on), lum(zemin)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    });
    expect(oran, kirmizi ? 'kırmızı' : 'normal').toBeGreaterThanOrEqual(3);
  }
});

test('A4-12: "Gördüm, deftere yaz" bağlantısı en az 24 px yüksek', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('urania_gokKat', JSON.stringify({ gezegen: true, hedef: true, meteor: true, algol: true, ortme: true, uydu: true, olay: true })));
  await page.setViewportSize({ width: 551, height: 900 });
  await page.goto('/index.html#gok');
  const a = page.locator('.defter-bag a').first();
  await expect(a).toBeVisible();
  const yuk = await page.locator('.defter-bag a').evaluateAll(ls => ls.filter(x => x.offsetParent).map(x => x.getBoundingClientRect().height));
  expect(yuk.length).toBeGreaterThan(0);
  expect(Math.min(...yuk)).toBeGreaterThanOrEqual(24);
});

test('A4-13: sayıya sığmayan girdi (1e400) "çok büyük" der, "pozitif sayı yaz" demez', async ({ page }) => {
  await page.goto('/index.html#hesap');
  await page.locator('#uzD').fill('1e400');
  await expect(page.locator('#uzS')).toContainText('Değer çok büyük');
  await expect(page.locator('#uzD')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#wiT').fill('1e999');
  await expect(page.locator('#hk-wien .sonuc, #wiS').first()).toContainText('Değer çok büyük');
  await page.locator('#uzD').fill('-3');
  await expect(page.locator('#uzS')).toContainText('Pozitif bir sayı yaz.');
});

test('A4-14: yeni sürüm etkinleşince sayfa görünmüyorsa kendiliğinden yenilenir; görünürken şerit, form açıkken yenilenmez', async ({ page }) => {
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkOzet p').first()).toBeVisible();
  const sonuc = await page.evaluate(() => {
    let gizli = false; const r = [];
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => gizli });
    const yenile = () => r.push('yenilendi');
    Urania._surumDegisti(yenile);                       // görünür: şerit
    r.push(document.getElementById('surumSerit') ? 'serit' : 'yok');
    gizli = true; document.dispatchEvent(new Event('visibilitychange'));   // arka plana geçti: yenilenir
    return r;
  });
  expect(sonuc).toEqual(['serit', 'yenilendi']);
  /* Defter formu açıkken arka plana geçmek yenilemez */
  await page.goto('/index.html#defter');
  await page.locator('#dfYeni').click();
  const r2 = await page.evaluate(() => {
    const r = [];
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    Urania._surumDegisti(() => r.push('yenilendi'));
    document.dispatchEvent(new Event('visibilitychange'));
    return [r.length, !!document.getElementById('surumSerit')];
  });
  expect(r2).toEqual([0, true]);
});

test('A3B-08: ünite sınavında şıklar karışır; doğru şık işaretlenir, harf karışmaya göre söylenir', async ({ page }) => {
  test.setTimeout(60000);
  const sorular = await (await page.request.get('/veri/sinavlar.json')).json().then(j => j.uniteler.gokyuzu);
  const konumlar = new Set(), dogruKonum = [];
  for (let tur = 0; tur < 3; tur++) {
    await page.goto('/index.html#gok');
    await page.goto('/index.html#ders/sinav/gokyuzu');
    await page.reload();
    for (let i = 0; i < 5; i++) {
      const metin = await page.locator('#snSoru').innerText();
      const q = sorular.find(x => x.soru === metin);
      const sira = await page.locator('.sinav-secenek button').evaluateAll(b => b.map(x => Number(x.dataset.i)));
      expect([...sira].sort()).toEqual(q.secenekler.map((s, k) => k));
      konumlar.add(sira.join(''));
      const k = sira.indexOf(q.dogru);
      dogruKonum.push(k);
      /* Ekrandaki metin ve harf, data-i'deki dosya şıkkıyla eşleşir */
      const ilk = page.locator('.sinav-secenek button').nth(k);
      await expect(ilk).toContainText(q.secenekler[q.dogru]);
      await expect(ilk.locator('b')).toHaveText('ABCDE'[k]);
      /* yanlış seç: "Doğrusu <ekrandaki harf>" */
      const yanlis = sira[(k + 1) % sira.length];
      await page.locator(`.sinav-secenek button[data-i="${yanlis}"]`).click();
      await expect(page.locator('.sinav-sonuc')).toContainText('Doğrusu ' + 'ABCDE'[k] + '.');
      await expect(page.locator('.sinav-secenek .dugme.dogru')).toContainText(q.secenekler[q.dogru]);
      await page.locator('#snSonraki').click();
    }
  }
  expect(konumlar.size, 'şık sırası değişiyor').toBeGreaterThan(1);
  expect(new Set(dogruKonum).size, 'doğru şık hep aynı yerde değil').toBeGreaterThan(1);
});
