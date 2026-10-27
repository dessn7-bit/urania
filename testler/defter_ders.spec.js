'use strict';
/* Defter ve Dersler denetim bulgularının regresyon testleri: bozuk depo değerleri, depo yazma
   hataları, saat dilimi tutarlılığı, yedek içe alma, odak ve erişilebilirlik, kırmızı mod karşıtlığı.
   Ağ isteği atılmaz: yerel sunucu dışındaki her istek kesilir. */
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const os = require('os');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');
const KONUM = { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' };

function kayit(id, ek) {
  return Object.assign({ id, zaman: '2026-10-27T18:00:00.000Z', cisim: { anahtar: 'cisim:Moon', ad: 'Ay' }, alet: '7×50 dürbün', kosul: 'Berrak', not: '',
    konum: { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0 }, otomatik: { ayOran: 50 } }, ek || {});
}
/* Belirli bir depo anahtarına yazmayı başarısız kılar (dolu depo) */
async function yazmaHatasi(page, anahtarlar) {
  await page.evaluate(ls => {
    const asil = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { if (ls.includes(k)) throw new DOMException('dolu', 'QuotaExceededError'); return asil.call(this, k, v); };
  }, anahtarlar.map(a => 'urania_' + a));
}
function dosyaYaz(ad, icerik) {
  const p = path.join(os.tmpdir(), 'urania-dd-' + ad);
  fs.writeFileSync(p, typeof icerik === 'string' ? icerik : JSON.stringify(icerik));
  return p;
}

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await page.addInitScript(k => {
    if (!sessionStorage.getItem('dd_kuruldu')) {
      sessionStorage.setItem('dd_kuruldu', '1');
      localStorage.setItem('urania_konumOto', 'false');
      localStorage.setItem('urania_konum', JSON.stringify(k));
    }
  }, KONUM);
  await page.clock.install({ time: SABIT_AN });
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

/* Depoya ham değer koy ve sayfayı yenile */
async function depo(page, degerler) {
  await page.evaluate(d => { Object.entries(d).forEach(([k, v]) => localStorage.setItem('urania_' + k, v)); }, degerler);
}

test('1: defterde bozuk öğeler (null, eksik alanlı) Gökyüzü, defter ve görevleri düşürmez; nesne olanlar yazarken korunur', async ({ page }) => {
  await page.goto('/index.html#defter');
  await depo(page, { defter: '[null]' });
  for (const h of ['#gok', '#defter', '#defter/gorevler']) {
    await page.goto('/index.html' + h);
    await page.reload();
    if (h === '#gok') await expect(page.locator('#gkGezegen li')).toHaveCount(7);
    if (h === '#defter') await expect(page.locator('#dfOzet')).toContainText('Henüz kayıt yok');
    if (h === '#defter/gorevler') await expect(page.locator('.gorev-liste li').first()).toBeVisible();
  }
  await depo(page, { defter: JSON.stringify([{ id: 'a' }, null, 5, kayit('iyi1')]) });
  await page.goto('/index.html#defter');
  await page.reload();
  await expect(page.locator('#dfListe li')).toHaveCount(1);
  await page.locator('#dfYeni').click();
  await page.locator('#dfKaydet').click();
  await expect(page.locator('#dfListe li')).toHaveCount(2);
  const ham = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_defter')));
  expect(ham.length).toBe(3);
  expect(ham).toContainEqual({ id: 'a' });
  expect(page.hatalar).toEqual([]);
});

test('2 ve 8: "Okudum" yazılamazsa düğme eski hâlinde kalır, tek uyarı görünür', async ({ page }) => {
  await page.goto('/index.html#ders/d1');
  await expect(page.locator('#dsBitir')).toHaveText('Okudum');
  await yazmaHatasi(page, ['dersBitti']);
  await page.locator('#dsBitir').click();
  await expect(page.locator('.ders-son .hata-kutu[role="alert"]')).toContainText('Kaydedilemedi');
  await expect(page.locator('#dsBitir')).toHaveText('Okudum');
  await expect(page.locator('#dsBitir')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#dsBitir').click();
  await expect(page.locator('.hata-kutu')).toHaveCount(1);
});

test('3: düzenlenen kaydın listede olmayan alet/koşul değeri korunur', async ({ page }) => {
  await page.goto('/index.html#defter');
  await depo(page, { defter: JSON.stringify([kayit('eski1', { alet: 'Dobson 8"', kosul: 'Sisli' })]) });
  await page.reload();
  await page.locator('#dfListe button[data-is="duzenle"]').click();
  await expect(page.locator('#dfAlet')).toHaveValue('Dobson 8"');
  await expect(page.locator('#dfKosul')).toHaveValue('Sisli');
  await page.locator('#dfNot').fill('düzenlendi');
  await page.locator('#dfKaydet').click();
  const k = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_defter'))[0]);
  expect([k.alet, k.kosul, k.not]).toEqual(['Dobson 8"', 'Sisli', 'düzenlendi']);
  /* Yeni formda geçici seçenekler kalmaz */
  await page.locator('#dfYeni').click();
  await expect(page.locator('#dfKosul option')).toHaveCount(5);
  await expect(page.locator('#dfKosul')).toHaveValue('Berrak');
});

test('4: Ay/gezegen görevi kaydında cismin yüksekliği otomatik eklenir', async ({ page }) => {
  await page.goto('/index.html#defter/yeni/' + encodeURIComponent('gorev:jupiter-uydulari'));
  await expect(page.locator('#dfCisim')).toHaveValue('gorev:jupiter-uydulari');
  await page.locator('#dfKaydet').click();
  await expect(page.locator('#dfListe li')).toHaveCount(1);
  const o = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_defter'))[0].otomatik);
  expect(typeof o.alt).toBe('number');
  await expect(page.locator('#dfListe li')).toContainText('° yükseklik');
});

test('5 ve 12: "Yedekten yükle" klavyeyle açılır; hatadan sonra aynı dosya yeniden seçilebilir', async ({ page }) => {
  await page.goto('/index.html#defter');
  await page.locator('details summary', { hasText: 'Yedekle' }).click();
  const bozuk = dosyaYaz('bozuk.json', '{bu json değil');
  await expect(page.locator('#dfYukleDugme')).toBeVisible();
  const [secici] = await Promise.all([page.waitForEvent('filechooser'), page.locator('#dfYukleDugme').press('Enter')]);
  await secici.setFiles(bozuk);
  await expect(page.locator('#dfYedekDurum')).toContainText('geçerli bir JSON değil');
  await expect(page.locator('#dfYukle')).toHaveValue('');
  await page.evaluate(() => { document.getElementById('dfYedekDurum').textContent = ''; });
  const [secici2] = await Promise.all([page.waitForEvent('filechooser'), page.locator('#dfYukleDugme').press('Space')]);
  await secici2.setFiles(bozuk);
  await expect(page.locator('#dfYedekDurum')).toContainText('geçerli bir JSON değil');
  await expect(page.locator('#dfYukle')).toHaveValue('');
});

test('6 ve 15: sınav sonucu/yanlışlar yazılamazsa "kartlara eklendi" denmez; bitmiş sınava dönünce "Yeniden çöz" görünür', async ({ page }) => {
  await page.goto('/index.html#ders/sinav/gokyuzu');
  await expect(page.locator('#snSoru')).toBeVisible();
  const sorular = await page.evaluate(() => fetch('veri/sinavlar.json').then(r => r.json()).then(j => j.uniteler.gokyuzu));
  await yazmaHatasi(page, ['sinavSonuc', 'sinavYanlis']);
  for (let i = 0; i < sorular.length; i++) {
    const metin = await page.locator('#snSoru').innerText();
    const s = sorular.find(x => x.soru === metin);
    await page.locator(`.sinav-secenek button[data-i="${(s.dogru + 1) % 4}"]`).click();
    await page.locator('#snSonraki').click();
  }
  await expect(page.locator('.sinav-puan')).toContainText('0 / 12');
  await expect(page.locator('.hata-kutu[role="alert"]')).toContainText('Bu sonuç kaydedilemedi; yanlışların tekrar kartlarına eklenemedi');
  await expect(page.locator('#b-ders')).not.toContainText('tekrar kartlarına eklendi');
  await page.goto('/index.html#gok');
  await page.goBack();
  await expect(page.locator('.sinav-puan')).toBeVisible();
  await expect(page.locator('#snTekrar')).toBeVisible();
});

test('7 ve 8: depo doluyken silme başarısızsa uyarı çıkar, kayıt kalır; uyarılar birikmez, form açılınca temizlenir', async ({ page }) => {
  await page.goto('/index.html#defter');
  await depo(page, { defter: JSON.stringify([kayit('sil1')]) });
  await page.reload();
  await yazmaHatasi(page, ['defter']);
  const sil = page.locator('#dfListe button[data-is="sil"]');
  await sil.click(); await sil.click();
  await expect(page.locator('.hata-kutu[role="alert"]')).toContainText('Silinemedi');
  await expect(page.locator('#dfListe li')).toHaveCount(1);
  await sil.click(); await sil.click();
  await expect(page.locator('.hata-kutu')).toHaveCount(1);
  /* Kaydet hatası iki kez: tek uyarı; Vazgeç + yeniden aç: uyarı yok */
  await page.locator('#dfYeni').click();
  await page.locator('#dfKaydet').click();
  await page.locator('#dfKaydet').click();
  await expect(page.locator('#dfForm .hata-kutu')).toHaveCount(1);
  await expect(page.locator('.hata-kutu')).toHaveCount(1);
  await page.locator('#dfVazgec').click();
  await page.locator('#dfYeni').click();
  await expect(page.locator('#dfForm .hata-kutu')).toHaveCount(0);
});

test('9: yanlış türde depo değerleri (dersBitti, sinavSonuc, sinavYanlis, kartlar) Dersler\'i düşürmez', async ({ page }) => {
  await page.goto('/index.html#ders');
  await depo(page, { dersBitti: 'null', sinavSonuc: '{"gokyuzu":5}', sinavYanlis: '"x"', kartlar: '"abc"' });
  await page.reload();
  await expect(page.locator('.ders-liste li').first()).toBeVisible();
  await expect(page.locator('.sinav-giris')).toHaveCount(5);
  await page.goto('/index.html#ders/d1');
  await expect(page.locator('#dsBitir')).toHaveText('Okudum');
  await depo(page, { dersBitti: '"abc"' });
  await page.reload();
  await page.locator('#dsBitir').click();
  await expect(page.locator('#dsBitir')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('urania_dersBitti'))))).toEqual(['d1']);
  await page.goto('/index.html#ders/sinav/gokyuzu');
  const sorular = await page.evaluate(() => fetch('veri/sinavlar.json').then(r => r.json()).then(j => j.uniteler.gokyuzu));
  const metin = await page.locator('#snSoru').innerText();
  const q = sorular.find(x => x.soru === metin);
  await page.locator(`.sinav-secenek button[data-i="${(q.dogru + 1) % 4}"]`).click();
  await expect(page.locator('.sinav-sonuc')).toContainText('Doğrusu');
  await page.goto('/index.html#ders/kartlar');
  await expect(page.locator('.kart-on')).toBeVisible();
  await page.locator('#kaCevir').click();
  await page.locator('#kaEvet').click();
  const r = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_kartlar')));
  expect(Object.values(r)[0].k).toBe(2);
});

test('10: bozuk yüzde dizisi içeren defter adresi çökmez', async ({ page }) => {
  await page.goto('/index.html#defter/yeni/%E0%A4%A');
  await expect(page.locator('#dfForm')).toBeVisible();
});

test('11: yedekte "+03:00" ofsetli zaman UTC\'ye çevrilir; geçersiz zaman reddedilir', async ({ page }) => {
  await page.goto('/index.html#defter');
  const dosya = dosyaYaz('ofset.json', { kayitlar: [kayit('ofs1', { zaman: '2026-10-27T21:00:00+03:00' }), kayit('ofs2', { zaman: '27 Ekim akşamı' })] });
  await page.locator('details summary', { hasText: 'Yedekle' }).click();
  await page.locator('#dfYukle').setInputFiles(dosya);
  await expect(page.locator('#dfYedekDurum')).toHaveText('1 kayıt eklendi, 1 kayıt bozuk olduğu için atlandı.');
  const k = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_defter'))[0]);
  expect(k.zaman).toBe('2026-10-27T18:00:00.000Z');
});

test('13: 320 px\'te uzun boşluksuz ad ve not taşmaz', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/index.html#defter');
  const uzun = 'Ç'.repeat(70);
  await depo(page, { defter: JSON.stringify([kayit('uzun1', { cisim: { anahtar: 'diger:x', ad: uzun }, not: 'N'.repeat(300), alet: 'A'.repeat(38) })]) });
  await page.reload();
  await expect(page.locator('#dfListe li')).toHaveCount(1);
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(tasma).toBeLessThanOrEqual(0);
});

test('14: konum başka saat dilimindeyse form ve liste aynı (konumun) saatini gösterir', async ({ page }) => {
  await page.goto('/index.html#defter');
  await page.evaluate(() => localStorage.setItem('urania_konum', JSON.stringify({ ad: 'Tokyo', enlem: 35.68, boylam: 139.69, yukseklik: 0, oto: false, saatDilimi: 'Asia/Tokyo' })));
  await page.reload();
  await page.locator('#dfYeni').click();
  /* Şimdi 27 Ekim 21:00 Türkiye = 28 Ekim 03:00 Tokyo */
  await expect(page.locator('#dfZaman')).toHaveValue('2026-10-28T03:00');
  await expect(page.locator('#dfKonum')).toContainText('Asia/Tokyo');
  await page.locator('#dfZaman').fill('2026-10-27T22:00');
  await page.locator('#dfKaydet').click();
  const li = page.locator('#dfListe li').first();
  await expect(li).toContainText('22:00');
  const k = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_defter'))[0]);
  expect(k.zaman).toBe('2026-10-27T13:00:00.000Z');
  expect(k.konum.saatDilimi).toBe('Asia/Tokyo');
  await expect(page.locator('#dfListe h2').first()).toContainText('27 Ekim Salı gecesi');
  await li.locator('button[data-is="duzenle"]').click();
  await expect(page.locator('#dfZaman')).toHaveValue('2026-10-27T22:00');
  await page.locator('#dfVazgec').click();
  /* Konum Türkiye'ye dönünce kayıt yine kendi diliminde (Tokyo) gösterilir ve dilim yazılır */
  await page.evaluate(k => localStorage.setItem('urania_konum', JSON.stringify(k)), KONUM);
  await page.reload();
  await expect(page.locator('#dfListe li').first()).toContainText('22:00');
  await expect(page.locator('#dfListe h2').first()).toContainText('Asia/Tokyo');
  await page.locator('#dfListe button[data-is="duzenle"]').click();
  await expect(page.locator('#dfZaman')).toHaveValue('2026-10-27T22:00');
});

test('15: "okumadığım derslerin kartları" oturumu sekme değişince kaybolmaz', async ({ page }) => {
  await page.goto('/index.html#ders/kartlar');
  await expect(page.locator('#kaHepsi')).toBeVisible();
  await page.locator('#kaHepsi').click();
  await expect(page).toHaveURL(/#ders\/kartlar\/hepsi$/);
  await expect(page.locator('.kart-on')).toBeVisible();
  const ust = await page.locator('.kart-ust .alt-baslik').innerText();
  const toplam = ust.match(/\/ (\d+)/)[1];
  await page.locator('#kaCevir').click();
  await page.locator('#kaEvet').click();
  await expect(page.locator('.kart-ust .alt-baslik')).toContainText(`2 / ${toplam}`);
  await page.goto('/index.html#gok');
  await page.goBack();
  await expect(page.locator('.kart-ust .alt-baslik')).toContainText(`2 / ${toplam}`);
});

test('16: odak sınava dönünce soruya, sonraki derste başlığa; defterde Kaydet/Vazgeç/Sil sonrası anlamlı öğeye', async ({ page }) => {
  /* Kutu sırası: rolsüz öğede aria-label yok, görünmez başlık metni var */
  await page.goto('/index.html#ders/kartlar');
  await expect(page.locator('.kutu-sira')).toBeVisible();
  await expect(page.locator('.kutu-sira')).not.toHaveAttribute('aria-label', /.*/);
  await expect(page.locator('.kutu-sira .gorsel-gizli')).toHaveText('Kutulardaki kart sayıları:');
  await page.goto('/index.html#ders/d1');
  await page.locator('.ders-son a', { hasText: 'Sonraki' }).click();
  await expect(page.locator('article.ders h1')).toBeFocused();
  await page.goto('/index.html#ders/sinav/evren');
  await page.locator('.sinav-secenek button').first().click();
  await page.locator('#snSonraki').click();
  await page.goto('/index.html#ders/d7');
  await page.goBack();
  await expect(page.locator('#snSoru')).toBeFocused();
  /* Defter */
  await page.goto('/index.html#defter');
  await page.locator('#dfYeni').click();
  await page.locator('#dfCisim').selectOption('diger');
  await page.locator('#dfKaydet').click();
  await expect(page.locator('#dfDiger')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#dfDiger').fill('Starlink treni');
  await page.locator('#dfKaydet').click();
  await expect(page.locator('#dfListe li').first()).toBeFocused();
  await page.locator('#dfYeni').click();
  await expect(page.locator('#dfDiger')).not.toHaveAttribute('aria-invalid', /.*/);
  await page.locator('#dfVazgec').click();
  await expect(page.locator('#dfYeni')).toBeFocused();
  await page.locator('#dfListe button[data-is="duzenle"]').click();
  await page.locator('#dfVazgec').click();
  await expect(page.locator('#dfListe button[data-is="duzenle"]')).toBeFocused();
  const sil = page.locator('#dfListe button[data-is="sil"]');
  await sil.click(); await sil.click();
  await expect(page.locator('#dfOzet')).toBeFocused();
});

test('17: kırmızı modda ana ve ikincil metin siyah zeminde en az 4,5:1, yalnız kırmızı tonlar', async ({ page }) => {
  await page.goto('/index.html#ders');
  await page.evaluate(() => localStorage.setItem('urania_kirmizi', 'true'));
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/kirmizi/);
  const r = await page.evaluate(() => {
    const st = getComputedStyle(document.documentElement);
    const rgb = h => { const x = h.trim().replace('#', ''); return [0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16)); };
    const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const L = h => { const [a, b, c] = rgb(h); return 0.2126 * lin(a) + 0.7152 * lin(b) + 0.0722 * lin(c); };
    const oran = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    return ['--parsomen', '--soluk'].map(v => {
      const c = st.getPropertyValue(v);
      return { v, c: c.trim(), siyah: oran(c, '#000000'), levha: oran(c, st.getPropertyValue('--levha-2')), rgb: rgb(c) };
    });
  });
  for (const x of r) {
    expect(x.siyah, x.v).toBeGreaterThanOrEqual(4.5);
    expect(x.levha, x.v).toBeGreaterThanOrEqual(4.5);
    expect(x.rgb[1], x.v + ' yeşil').toBeLessThanOrEqual(x.rgb[0] * 0.3);
    expect(x.rgb[2], x.v + ' mavi').toBeLessThanOrEqual(x.rgb[0] * 0.3);
  }
});

test('18: hiçbir dersin ön bilgisi ders sırasında kendisinden sonra gelmez', async ({ page }) => {
  await page.goto('/index.html#ders');
  const ileri = await page.evaluate(async () => {
    const D = await fetch('veri/dersler.json').then(r => r.json());
    const sira = D.uniteler.flatMap(u => u.dersler);
    return D.dersler.flatMap(x => (x.on_bilgi || []).filter(o => sira.indexOf(o) > sira.indexOf(x.id)).map(o => x.id + '→' + o));
  });
  expect(ileri).toEqual([]);
});

test('Ek: sınavda yeniden yanlış yapılan sorunun kartı 5. kutudan 1. kutuya iner', async ({ page }) => {
  await page.goto('/index.html#ders');
  const sorular = await page.evaluate(() => fetch('veri/sinavlar.json').then(r => r.json()).then(j => j.uniteler.yildizlar));
  const ileri = new Date('2026-11-20T00:00:00+03:00').getTime();
  await page.evaluate(([ls, z]) => {
    const r = {}, y = {};
    ls.forEach(q => { r['sv-' + q.id] = { k: 5, z, s: 1 }; y[q.id] = 1; });
    localStorage.setItem('urania_kartlar', JSON.stringify(r));
    localStorage.setItem('urania_sinavYanlis', JSON.stringify(y));
  }, [sorular, ileri]);
  await page.goto('/index.html#ders/sinav/yildizlar');
  const metin = await page.locator('#snSoru').innerText();
  const q = sorular.find(x => x.soru === metin);
  await page.locator(`.sinav-secenek button[data-i="${(q.dogru + 1) % 4}"]`).click();
  await expect(page.locator('.sinav-sonuc')).toContainText('Doğrusu');
  const r = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_kartlar')));
  expect(r['sv-' + q.id].k).toBe(1);
  expect(Object.values(r).filter(x => x.k === 5).length).toBe(sorular.length - 1);
});
