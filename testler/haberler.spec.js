'use strict';
/* Haberler sekmesi: veri/haberler.json'un biçimi (haftalık güncellemede de çalışır) ve arayüz (sahte veriyle,
   içerikten bağımsız). Ağ isteği atılmaz. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { disAgiKes, kok } = require('./yardim');

const V = JSON.parse(fs.readFileSync(path.join(kok, 'veri/haberler.json'), 'utf8'));
const DERS = new Set(JSON.parse(fs.readFileSync(path.join(kok, 'veri/dersler.json'), 'utf8')).dersler.map(d => d.id));
const TURLER = ['haber', 'arastirma', 'gorev', 'gokyuzu', 'gorsel', 'etkinlik'];
const TARIH = /^\d{4}-\d{2}-\d{2}$/;
const kelime = s => (String(s).match(/\S+/g) || []).length;

test('Veri: her haber eksiksiz, kaynaklı (en az iki https kaynak), tarihli; kimlikler tekil; en çok 120 haber', () => {
  expect(TARIH.test(V.guncelleme), 'guncelleme').toBe(true);
  expect(Array.isArray(V.haberler)).toBe(true);
  expect(V.haberler.length).toBeLessThanOrEqual(120);
  const idler = new Set();
  for (const h of V.haberler) {
    const ad = h.id;
    expect(ad, 'kimlik').toMatch(/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/);
    expect(idler.has(ad), 'tekrar: ' + ad).toBe(false); idler.add(ad);
    expect(TARIH.test(h.tarih) && TARIH.test(h.eklenme), ad + ' tarih').toBe(true);
    expect(h.eklenme <= V.guncelleme, ad + ' eklenme ≤ guncelleme').toBe(true);
    expect(h.tarih <= h.eklenme, ad + ' tarih ≤ eklenme').toBe(true);
    expect(TURLER, ad).toContain(h.tur);
    expect(h.baslik && h.baslik.length <= 110, ad + ' başlık').toBeTruthy();
    expect(Array.isArray(h.ozet) && h.ozet.length >= 1, ad + ' özet').toBe(true);
    const k = kelime(h.ozet.join(' '));
    if (h.tur === 'gorsel' || h.tur === 'etkinlik') {
      /* v48 (YONTEM.md "Haftanın görüntüsü", "İstanbul etkinlikleri"): kısa metin, 1–3 paragraf, 60–300 kelime */
      expect(k, ad + ' özet kelime').toBeGreaterThanOrEqual(60);
      expect(k, ad + ' özet kelime').toBeLessThanOrEqual(300);
      expect(h.ozet.length, ad + ' paragraf sayısı').toBeLessThanOrEqual(3);
    } else {
      /* arastirma/haberler/YONTEM.md (v2, 30 Ekim 2026: "350–700 words in total, 4–8 paragraphs") */
      expect(k, ad + ' özet kelime').toBeGreaterThanOrEqual(350);
      expect(k, ad + ' özet kelime').toBeLessThanOrEqual(700);
      expect(h.ozet.length, ad + ' paragraf sayısı').toBeGreaterThanOrEqual(4);
      expect(h.ozet.length, ad + ' paragraf sayısı').toBeLessThanOrEqual(8);
    }
    if (h.gorsel) {
      const g = h.gorsel;
      expect(g.dosya, ad + ' görsel').toBe('img/haber/' + h.id + '.jpg');
      expect(fs.existsSync(path.join(kok, g.dosya)), ad + ' görsel dosyası').toBe(true);
      expect(fs.statSync(path.join(kok, g.dosya)).size, ad + ' görsel boyutu').toBeLessThanOrEqual(260000);
      expect(g.alt && g.aciklama && g.kredi && g.lisans, ad + ' görsel bilgisi').toBeTruthy();
      expect(g.kaynak_url, ad).toMatch(/^https:\/\//);
      expect(g.kaynak_url + g.kredi, ad + ' yasak görsel kaynağı').not.toMatch(/apnews|reuters|gettyimages|afp\.com|nature\.com|science\.org/i);
      /* YONTEM.md "Images": yalnız resmî, özgür lisanslı kurum görselleri (NASA, ESA/Webb, ESA/Hubble, ESO, NOIRLab, IAU, Rubin,
         ESA; JAXA/CNSA koşullu). İzin listesi: görselin resmî sayfasının alan adı bunlardan biri olmalı. */
      /* v48: CC BY lisanslı makalenin kendi şekli (YONTEM.md "Images"): kaynak DOI bağlantısı, makalenin Crossref lisansı CC BY */
      const sekil = new URL(g.kaynak_url).hostname === 'doi.org' && h.makale && h.makale.lisans && /^CC BY/.test(h.makale.lisans.ad) && /^Şekil: /.test(g.kredi);
      if (!sekil) expect(new URL(g.kaynak_url).hostname, ad + ' görsel kaynağı izin listesinde değil').toMatch(
        /(^|\.)(nasa\.gov|esa\.int|esawebb\.org|esahubble\.org|eso\.org|noirlab\.edu|iau\.org|rubinobservatory\.org|jaxa\.jp|cnsa\.gov\.cn)$/);
    }
    if (h.tur !== 'gorsel' && h.tur !== 'etkinlik') expect(h.neden_onemli, ad + ' neden önemli').toBeTruthy();
    if (h.kesinlik) expect(['kesin', 'ön sonuç', 'tartışmalı'], ad).toContain(h.kesinlik);
    /* v48: "kesin" olmayan her etiketin nedeni yazılı; yalnız "hakem" nedeni makale yayımlanınca kalkar (haber_dogrula.py) */
    if (h.kesinlik && h.kesinlik !== 'kesin') expect(['hakem', 'aday', 'benzetim', 'tartisma', 'dogrulanmamis'], ad + ' kesinlik_neden').toContain(h.kesinlik_neden);
    if (h.kesinlik === 'kesin') expect(h.kesinlik_neden, ad).toBeUndefined();
    if (h.makale && h.makale.hakemli) {
      const m = h.makale;
      expect(m.doi, ad + ' doi').toMatch(/^10\.\d{4,9}\//);
      expect(TARIH.test(m.yayin_tarihi), ad + ' yayın tarihi').toBe(true);
      expect(m.dergi, ad).not.toMatch(/arXiv|ön baskı/i);
      if (m.lisans) expect(m.lisans.ad && (m.lisans.url === undefined || /^https:\/\//.test(m.lisans.url)), ad + ' lisans').toBeTruthy();
      expect(h.kesinlik_neden, ad + ' hakemli makalede "hakem" nedeni kalmaz').not.toBe('hakem');
    }
    (h.guncellemeler || []).forEach(n => { expect(TARIH.test(n.tarih), ad).toBe(true); expect(n.metin, ad).toMatch(/^Güncelleme \(\d{1,2} [A-ZÇĞİÖŞÜ][a-zçğıöşü]+ \d{4}\): /); });
    if (h.tur === 'gorsel') {
      expect(h.gorsel && h.gorsel.apod && h.gorsel.apod.url, ad + ' APOD bağlantısı').toMatch(/^https:\/\/science\.nasa\.gov\//);
      expect(h.gorsel.apod.kredi_satiri, ad).toBeTruthy();
      expect(h.gorsel.apod.kredi_satiri, ad + ' Copyright').not.toMatch(/copyright/i);
    }
    if (h.tur === 'etkinlik') {
      const e = h.etkinlik;
      expect(e && e.yer && TARIH.test(String(e.baslangic).slice(0, 10)) && e.saat && e.basvuru && e.ucret, ad + ' etkinlik alanları').toBeTruthy();
      expect(e.kaynak_url, ad).toMatch(/^https:\/\//);
    }
    expect(h.kaynaklar.length, ad + ' kaynak').toBeGreaterThanOrEqual(2);
    h.kaynaklar.forEach(s => { expect(s.ad, ad).toBeTruthy(); expect(s.url, ad).toMatch(/^https:\/\//); });
    if (h.makale) expect(h.makale.url, ad + ' makale').toMatch(/^https:\/\//);
    if (h.tur === 'arastirma') expect(h.makale && h.makale.url, ad + ' araştırmada makale').toBeTruthy();
    (h.ilgili_dersler || []).forEach(d => expect(DERS.has(d), ad + ' ' + d).toBe(true));
    const tum = JSON.stringify(h);
    expect(tum, ad).not.toMatch(/openstax|ck12\.org|celestrak/i);
  }
});

/* Arayüz: sahte veri (içerik değişse de test sabit kalsın) */
const SAHTE = {
  guncelleme: '2026-10-30',
  haberler: [
    { id: '2026-10-20-ornek-kesif', tarih: '2026-10-20', eklenme: '2026-10-30', tur: 'haber', baslik: 'Örnek keşif başlığı', ozet: ['Birinci paragraf: Güneş ve galaksi sözcükleri geçer.', 'İkinci paragraf yalnız açılınca görünür.'], neden_onemli: 'Çünkü örnek.', istanbul: 'Dürbünle bakılabilir.', gorsel: { dosya: 'img/haber/2026-10-20-ornek-kesif.jpg', alt: 'Örnek görsel', aciklama: 'Gözlem verisinden işlenmiş görüntü.', kredi: 'ESO', lisans: 'CC BY 4.0', kaynak_url: 'https://www.eso.org/public/images/' }, ilgili_dersler: ['d4'], kaynaklar: [{ ad: 'Kaynak A', url: 'https://example.org/a', tarih: '2026-10-20' }, { ad: 'Kaynak B', url: 'https://example.org/b' }] },
    { id: '2026-09-15-ornek-makale', tarih: '2026-09-15', eklenme: '2026-10-23', tur: 'arastirma', kesinlik: 'ön sonuç', baslik: 'Örnek makale başlığı', ozet: ['Makale paragrafı.', 'Devamı.'], neden_onemli: 'Ölçüm.', makale: { baslik: 'A paper', yazarlar: 'Soyad vd.', dergi: 'arXiv ön baskı', url: 'https://arxiv.org/abs/0000.00000' }, ilgili_dersler: [], kaynaklar: [{ ad: 'arXiv', url: 'https://arxiv.org/abs/0000.00000' }, { ad: 'Haber', url: 'https://example.org/c' }] },
    { id: '2026-10-25-ornek-gorev', tarih: '2026-10-25', eklenme: '2026-10-30', tur: 'gorev', baslik: 'Örnek görev', ozet: ['Görev paragrafı.'], neden_onemli: 'Görev.', kaynaklar: [{ ad: 'A', url: 'https://example.org/d' }, { ad: 'B', url: 'https://example.org/e' }] }
  ]
};
async function kur(page, ls) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await page.route('**/veri/haberler.json', r => r.fulfill({ json: SAHTE }));
  /* 1×1 JPEG: görsel testleri için (içerikten bağımsız) */
  await page.route('**/img/haber/*.jpg', r => r.fulfill({ contentType: 'image/jpeg', body: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==', 'base64') }));
  await page.addInitScript(e => { localStorage.setItem('urania_konumOto', 'false'); Object.entries(e || {}).forEach(([a, v]) => localStorage.setItem('urania_' + a, v)); }, ls || {});
}
test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });

test('Liste: en yeni üstte, aylara göre gruplu; tür süzgeci; ön sonuç rozeti; devamı açılınca sözlük ve dinleme', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#haber');
  await expect(page.locator('h1')).toHaveText('Haberler');
  await expect(page.locator('article.haber')).toHaveCount(3);
  await expect(page.locator('article.haber h2')).toHaveText(['Örnek görev', 'Örnek keşif başlığı', 'Örnek makale başlığı']);
  await expect(page.locator('h2.hb-ay')).toHaveText(['Ekim 2026', 'Eylül 2026']);
  await expect(page.locator('.alt-baslik')).toContainText('30 Ekim 2026');
  await expect(page.locator('article[data-id="2026-09-15-ornek-makale"] .rozet.uyari')).toHaveText('Ön sonuç');
  /* süzgeç */
  await page.locator('.hb-filtre button[data-f="arastirma"]').click();
  await expect(page.locator('article.haber')).toHaveCount(1);
  await expect(page.locator('.hb-filtre button[data-f="arastirma"]')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('article.haber')).toHaveCount(1);      // seçim hatırlanır
  await page.locator('.hb-filtre button[data-f="hepsi"]').click();
  await expect(page.locator('article.haber')).toHaveCount(3);
  /* devamı */
  const a = page.locator('article[data-id="2026-10-20-ornek-kesif"]');
  await expect(a.getByText('İkinci paragraf')).toBeHidden();
  await a.locator('summary').click();
  await expect(a.getByText('İkinci paragraf')).toBeVisible();
  await expect(a.locator('summary')).toHaveText('Kapat');
  await expect(a.locator('.hb-istanbul')).toContainText("İstanbul'dan");
  /* görsel: başlığın altında, yerel dosya, alt metni, açıklaması ve kredisi/lisansı var; öteki haberlerde görsel yok */
  const g = a.locator('figure.hb-gorsel');
  await expect(g.locator('img')).toHaveAttribute('src', './img/haber/2026-10-20-ornek-kesif.jpg');
  await expect(g.locator('img')).toHaveAttribute('alt', 'Örnek görsel');
  await expect(g.locator('figcaption')).toContainText('Gözlem verisinden');
  await expect(g.locator('.hb-kredi a')).toHaveText('ESO');
  await expect(g.locator('.hb-kredi')).toContainText('CC BY 4.0');
  await expect(page.locator('figure.hb-gorsel')).toHaveCount(1);
  await expect(a.locator('.kaynak a')).toHaveCount(2);
  await expect(a.locator('.hb-ders a')).toHaveAttribute('href', '#ders/d4');
  await expect(a.locator('.hb-ses')).not.toBeEmpty();
  await expect(a.locator('button.terim').first()).toBeVisible();
  expect((await a.locator('summary').boundingBox()).height).toBeGreaterThanOrEqual(44);
});

test('#haber/<kimlik> o haberi açar; son ziyaretten sonra eklenenler "Yeni", sekmede nokta', async ({ page }) => {
  await kur(page, { haberSon: '"2026-10-23"' });
  await page.goto('/index.html#gok');
  await expect(page.locator('.alt-sekmeler a[data-sekme="haber"]')).toHaveClass(/yeni-var/, { timeout: 6000 });
  await page.goto('/index.html#haber/2026-09-15-ornek-makale');
  const m = page.locator('article[data-id="2026-09-15-ornek-makale"]');
  await expect(m.locator('details.hb-ac')).toHaveAttribute('open', '');
  await expect(m.locator('.hb-makale a')).toHaveAttribute('href', 'https://arxiv.org/abs/0000.00000');
  await expect(page.locator('article .rozet.iyi', { hasText: 'Yeni' })).toHaveCount(2);
  await expect(page.locator('.alt-sekmeler a[data-sekme="haber"]')).not.toHaveClass(/yeni-var/);
  expect(await page.evaluate(() => localStorage.getItem('urania_haberSon'))).toBe('"2026-10-30"');
});

test('İlk ziyarette hiçbir şey "yeni" sayılmaz', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#haber');
  await expect(page.locator('article.haber')).toHaveCount(3);
  await expect(page.locator('article .rozet.iyi')).toHaveCount(0);
});

for (const w of [320, 551]) {
  test(`${w} px: altı sekme sığar, haber sayfası yatay taşmaz`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 800 });
    await kur(page);
    await page.goto('/index.html#haber');
    await page.locator('article.haber summary').first().click();
    const r = await page.evaluate(() => ({
      tasma: document.documentElement.scrollWidth - innerWidth,
      sekme: [...document.querySelectorAll('.alt-sekmeler a')].map(a => [a.textContent.trim(), Math.round(a.getBoundingClientRect().width), a.scrollWidth - a.clientWidth])
    }));
    expect(r.tasma).toBeLessThanOrEqual(0);
    expect(r.sekme.map(s => s[0])).toEqual(['Gökyüzü', 'Deneyler', 'Dersler', 'Defter', 'Hesap', 'Haberler']);
    r.sekme.forEach(s => expect(s[2], s[0] + ' yazı taşmaz').toBeLessThanOrEqual(0));
  });
}
