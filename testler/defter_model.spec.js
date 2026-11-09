'use strict';
/* v46 Defter "Model ve sen": dürbün hedefi kaydında "gördüm / zor gördüm / göremedim" alanı (isteğe bağlı), kayıt anındaki
   model tahmini ve girdileri saklanır; karşılaştırma kartı; ≥ 10 karşılaştırmalı kayıtta kişisel ayar önerisi yalnız onayla
   uygulanır ve kaldırılabilir; eski (v1) yedek sorunsuz içe aktarılır; yeni alanlar yedekte taşınır. Ağ yok. */
const { test, expect } = require('@playwright/test');
const path = require('path');
const { disAgiKes, celestrak, havaSessiz, kok } = require('./yardim');

const AN = new Date('2026-11-09T20:00:00+03:00');
async function kur(page, kayitlar) {
  await disAgiKes(page);
  await celestrak(page);
  await havaSessiz(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: {} }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: [] }));
  await page.addInitScript(k => {
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify({ ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' }));
    localStorage.setItem('urania_gokKat', JSON.stringify({ hedef: true }));   // Gök sekmesinde dürbün hedefleri açık (çip tıklanabilsin)
    if (k && !localStorage.getItem('urania_defter')) localStorage.setItem('urania_defter', JSON.stringify(k));   // yalnız ilk yüklemede tohumla (yeniden yüklemede test değişiklikleri kalsın)
  }, kayitlar || null);
  await page.clock.install({ time: AN });
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
}
const defter = page => page.evaluate(() => JSON.parse(localStorage.getItem('urania_defter') || '[]'));

test('Hedef kaydında "Görebildin mi?" alanı görünür, boş bırakılabilir; kaydedilince model tahmini girdileriyle saklanır; kart karşılaştırmayı gösterir', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#defter/yeni/' + encodeURIComponent('hedef:M44'));
  await expect(page.locator('#dfCisim')).toHaveValue('hedef:M44');
  await expect(page.locator('#dfGordunAlan')).toBeVisible();
  await expect(page.locator('#dfGordun')).toHaveValue('');
  /* Hedef olmayan cisimde alan gizlenir */
  await page.locator('#dfCisim').selectOption('cisim:Moon');
  await expect(page.locator('#dfGordunAlan')).toBeHidden();
  await page.locator('#dfCisim').selectOption('hedef:M44');
  await expect(page.locator('#dfGordunAlan')).toBeVisible();
  /* Saat: 9 Kasım 2026 05:30 (M44 yüksekte) */
  await page.locator('#dfZaman').fill('2026-11-09T05:30');
  await page.locator('#dfGordun').selectOption('gordum');
  await page.locator('#dfKaydet').click();
  await expect(page.locator('#dfForm')).toBeHidden();
  const ls = await defter(page);
  expect(ls).toHaveLength(1);
  const k = ls[0];
  expect(k.gozlem).toBe('gordum');
  expect(k.model).toBeTruthy();
  expect(['gorunur', 'zor', 'gorunmez', 'belirsiz']).toContain(k.model.etiket);
  for (const a of ['gok', 'alt', 'k', 'gozBebegi', 'F', 'fark', 'farkHam', 'ayOran']) expect(Number.isFinite(k.model[a]), a).toBe(true);
  expect(k.model.gokKaynak).toMatch(/atlas|elle|kaydirici/);
  expect(k.model.surum).toBe('v46');
  /* M44 Yeni Ay'a yakın sabah: üye yolu → görünür; gözlem gördüm → uyum */
  expect(k.model.etiket).toBe('gorunur');
  expect(k.model.yol).toBe('uye');
  await expect(page.locator('#dfModel')).toContainText('1 kayıtta modelin tahmini gözleminle karşılaştırıldı');
  await expect(page.locator('#dfModel')).toContainText('1 uyuştu');
  await expect(page.locator('#dfModel')).toContainText('en az 10 karşılaştırmalı kayıt gerekir (şimdi 1)');
  await expect(page.locator('#dfListe li').first()).toContainText('model: görünür');
  await expect(page.locator('#dfListe li').first()).toContainText('sen: gördüm');
  /* Düzenleme: alan boşaltılınca gözlem silinir, model aynı saatte korunur */
  await page.locator('#dfListe li').first().locator('button[data-is="duzenle"]').click();
  await expect(page.locator('#dfGordun')).toHaveValue('gordum');
  await page.locator('#dfGordun').selectOption('');
  await page.locator('#dfKaydet').click();
  const ls2 = await defter(page);
  expect(ls2[0].gozlem).toBeUndefined();
  expect(ls2[0].model.fark).toBe(k.model.fark);
  await expect(page.locator('#dfModel')).toContainText('Henüz karşılaştırma yok');
  expect(page.hatalar).toEqual([]);
});

test('Kişisel ayar: 12 karşılaştırmalı kayıtta öneri çıkar, onaysız uygulanmaz; "Ayarı uygula" kaydeder, "Ayarı kaldır" siler; Gök gerekçesi ayarı söyler', async ({ page }) => {
  /* Model hep "görünmez" (fark −0,8) demiş, gözlemci 12 kez "gördüm" demiş: +1,3 kayma hepsini "görünür" yapar */
  const kayitlar = [];
  for (let i = 0; i < 12; i++) {
    kayitlar.push({ id: 'ayar' + i, zaman: new Date(Date.UTC(2026, 9, 1 + i, 19, 0)).toISOString(), cisim: { anahtar: 'hedef:M31', ad: 'Andromeda Galaksisi' }, alet: '7×50 dürbün', kosul: 'Berrak', not: '',
      konum: { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, saatDilimi: 'Europe/Istanbul' }, otomatik: { alt: 60 },
      gozlem: 'gordum', model: { surum: 'v46', etiket: 'gorunmez', yol: 'yaygin', fark: -0.8, farkHam: -0.8, kayma: 0, gok: 17.9, gokKaynak: 'atlas', alt: 60, k: 0.3, gozBebegi: 6.5, F: 2, ayOran: 0 } });
  }
  await kur(page, kayitlar);
  await page.goto('/index.html#defter');
  const kart = page.locator('#dfModel');
  await expect(kart).toContainText('12 kayıtta modelin tahmini gözleminle karşılaştırıldı');
  await expect(kart).toContainText('0 uyuştu');
  await expect(kart).toContainText('12 uyuşmadı');
  await expect(kart.locator('.model-uyumsuz li')).toHaveCount(12);
  await expect(kart).toContainText('Öneri: etiket eşiğini +1,3 kadir kaydır');
  await expect(kart).toContainText('uyum 0/12 → 12/12');
  await expect(kart).toContainText("Urania'nın kendi seçimidir");
  /* Onaysız: ayar yok */
  expect(await page.evaluate(() => localStorage.getItem('urania_gorKayma'))).toBeNull();
  const a = await page.evaluate(() => Defter.kisiselAyar(Defter.kayitlar()));
  expect(a).toMatchObject({ yeterli: true, n: 12, delta: 1.3, uyumOnce: 0, uyumSonra: 12, oneri: true });
  await kart.locator('button[data-is="ayar-uygula"]').click();
  expect(await page.evaluate(() => localStorage.getItem('urania_gorKayma'))).toBe('1.3');
  await expect(kart).toContainText('Uygulanan kişisel ayar: +1,3 kadir');
  await expect(kart.locator('button[data-is="ayar-uygula"]')).toHaveCount(0);
  /* Gök sekmesinde gerekçe kutusu ayarı yazar */
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkGokParlakligi')).toContainText('yapay ışık modeli');
  const ilk = page.locator('#gkHedef li').first();
  await ilk.locator('.gor-ac').click();
  await expect(ilk.locator('.gor-kutu')).toContainText('Kişisel ayar: +1,3 kadir');
  await page.goto('/index.html#defter');
  await page.locator('#dfModel button[data-is="ayar-kaldir"]').click();
  expect(await page.evaluate(() => localStorage.getItem('urania_gorKayma'))).toBeNull();
  await expect(page.locator('#dfModel')).toContainText('Öneri: etiket eşiğini +1,3 kadir kaydır');
  /* 9 kayıtta öneri yok */
  await page.evaluate(() => { const ls = JSON.parse(localStorage.getItem('urania_defter')); localStorage.setItem('urania_defter', JSON.stringify(ls.slice(0, 9))); });
  await page.reload();
  await expect(page.locator('#dfModel')).toContainText('en az 10 karşılaştırmalı kayıt gerekir (şimdi 9)');
  expect(page.hatalar).toEqual([]);
});

test('Eski (v1) yedek sorunsuz içe aktarılır; yeni alanlı yedek alanlarıyla gelir; bozuk alanlar atılır; yedek indirme yeni alanları taşır', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#defter');
  await page.locator('#dfYukle').setInputFiles(path.join(kok, 'testler', 'veri', 'defter_yedek_v1.json'));
  await expect(page.locator('#dfYedekDurum')).toContainText('3 kayıt eklendi');
  await expect(page.locator('#dfListe li')).toHaveCount(3);
  const ls = await defter(page);
  expect(ls.every(k => k.gozlem === undefined && k.model === undefined)).toBe(true);
  await expect(page.locator('#dfModel')).toContainText('Henüz karşılaştırma yok');
  /* Yeni alanlı yedek: geçerli olanlar kalır, bilinmeyen/bozuk alanlar atılır */
  const yeni = { uygulama: 'Urania', tur: 'gozlem-defteri', surum: 1, kayitlar: [
    { id: 'yeni0001', zaman: '2026-11-01T19:00:00.000Z', cisim: { anahtar: 'hedef:M13', ad: 'Herkül' }, alet: '7×50 dürbün', kosul: 'Berrak', not: '', konum: { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03 },
      gozlem: 'zor', model: { surum: 'v46', etiket: 'zor', yol: 'yaygin', fark: -0.2, farkHam: -0.2, gok: 17.9, gokKaynak: 'atlas', alt: 40, k: 0.3, gozBebegi: 6.5, F: 2, ObsName: 'kişisel-olmamalı', sacma: 'x' } },
    { id: 'yeni0002', zaman: '2026-11-02T19:00:00.000Z', cisim: { anahtar: 'hedef:M13', ad: 'Herkül' }, alet: '7×50 dürbün', kosul: 'Berrak', not: '', konum: { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03 }, gozlem: 'bilinmeyen' }
  ] };
  await page.locator('#dfYukle').setInputFiles({ name: 'yedek.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(yeni)) });
  await expect(page.locator('#dfYedekDurum')).toContainText('1 kayıt eklendi');
  await expect(page.locator('#dfYedekDurum')).toContainText('1 kayıt bozuk');
  const ls2 = await defter(page);
  const k = ls2.find(x => x.id === 'yeni0001');
  expect(k.gozlem).toBe('zor');
  expect(k.model.etiket).toBe('zor');
  expect(k.model.ObsName).toBeUndefined();
  expect(k.model.sacma).toBeUndefined();
  await expect(page.locator('#dfModel')).toContainText('1 kayıtta modelin tahmini gözleminle karşılaştırıldı');
  await expect(page.locator('#dfModel')).toContainText('1 uyuştu');
  /* Yedek indirme: kayitlar() yeni alanları içerir (indirilen JSON aynı listeden) */
  const dis = await page.evaluate(() => Defter.kayitlar().find(x => x.id === 'yeni0001'));
  expect(dis.gozlem).toBe('zor');
  expect(dis.model.fark).toBe(-0.2);
  expect(page.hatalar).toEqual([]);
});
