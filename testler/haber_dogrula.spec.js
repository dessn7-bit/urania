'use strict';
/* v48 haber işi: makale durumu denetimi (araclar/haber_dogrula.py), haftanın görüntüsü (araclar/apod_gorsel.py), yeni türler
   (gorsel, etkinlik) ve güncelleme notu. Ağa çıkılmaz: Python betikleri testler/veri/haber_dogrula/ ve testler/veri/apod/
   altındaki GERÇEK yanıtlarla (Crossref, arXiv, science.nasa.gov; 10 Kasım 2026 kaydı) çalışır. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { disAgiKes, kok } = require('./yardim');

let PY = null;
function python() {
  if (PY) return PY;
  for (const [k, a] of [['python', []], ['py', ['-3']], ['python3', []]]) {
    const r = spawnSync(k, [...a, '--version'], { encoding: 'utf8' });
    if (r.status === 0 && /Python 3/.test(r.stdout + r.stderr)) return (PY = [k, a]);
  }
  throw new Error('Python 3 bulunamadı (python / py -3 / python3)');
}
function py(args) {
  const [k, a] = python();
  const r = spawnSync(k, [...a, ...args], { cwd: kok, encoding: 'utf8', timeout: 120000, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return r.stdout;
}
const FX = path.join(kok, 'testler', 'veri', 'haber_dogrula');
const GIRDI = path.join(FX, 'girdi.json');
function kos(veri, bugun) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'hb-'));
  const v = path.join(d, 'haberler.json'), r = path.join(d, 'rapor.json');
  fs.writeFileSync(v, typeof veri === 'string' ? fs.readFileSync(veri, 'utf8') : JSON.stringify(veri, null, 1));
  py(['araclar/haber_dogrula.py', '--fixture', FX, '--veri', v, '--rapor', r, '--bugun', bugun || '2026-11-10', '--yaz']);
  return { veri: JSON.parse(fs.readFileSync(v, 'utf8')), rapor: JSON.parse(fs.readFileSync(r, 'utf8')) };
}
const bul = (V, id) => V.haberler.find(h => h.id === id);

test('Makale denetimi (fixture): Betelgeuse AJ\'de yayımlandı → "ön sonuç" kalkar, not eklenir; TOI-561b alanları; β Pic yayımlanmamış kalır', () => {
  const { veri, rapor } = kos(GIRDI);
  expect(rapor.hata).toEqual([]);
  expect(rapor.denetlenen).toBe(21);
  const b = bul(veri, '2026-10-28-betelgeuse-eslik-eden-iz');
  expect(b.kesinlik).toBe('kesin');
  expect(b.kesinlik_neden).toBeUndefined();
  expect(b.makale).toMatchObject({ dergi: 'The Astronomical Journal', doi: '10.3847/1538-3881/ae953d', yayin_tarihi: '2026-09-01', cilt: '172', sayfa: '184', hakemli: true, arxiv: '2608.02847', url: 'https://doi.org/10.3847/1538-3881/ae953d' });
  expect(b.makale.lisans).toEqual({ ad: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' });
  expect(b.guncellemeler).toEqual([{ tarih: '2026-11-10', metin: 'Güncelleme (10 Kasım 2026): makale The Astronomical Journal dergisinde hakemli olarak yayımlandı. Bu yüzden "Ön sonuç" etiketi kaldırıldı.' }]);
  const t = bul(veri, '2026-09-29-toi-561b-yansitici-atmosfer');
  expect(t.makale).toMatchObject({ doi: '10.3847/1538-3881/ae9763', dergi: 'The Astronomical Journal', hakemli: true });
  expect(t.makale.lisans.ad).toBe('CC BY 4.0');
  expect(t.guncellemeler).toBeUndefined();          // zaten hakemli dergide biliniyordu: not yok
  const p = bul(veri, '2026-09-15-beta-pictoris-b-radyo');
  expect(p.kesinlik).toBe('ön sonuç');
  expect(p.makale.hakemli).toBeUndefined();
  expect(rapor.yayimlanmamis.map(x => x.id).sort()).toEqual(['2026-09-04-supernova-unite-karanlik-enerji', '2026-09-15-beta-pictoris-b-radyo']);
  /* "ön sonuç" başka nedenle verilmişse (aday, benzetim) dergide yayımlanmış olsa da kalır */
  for (const id of ['2026-10-05-mikroblazar-iras-18293', '2026-10-05-hs0209-ikinci-kusak-gezegen', '2026-09-21-gunes-sistemi-omru-batygin', '2026-09-17-hd156295-nabiz-zamanlamasi']) {
    expect(bul(veri, id).kesinlik, id).toBe('ön sonuç');
    expect(bul(veri, id).makale.hakemli, id).toBe(true);
    expect(bul(veri, id).guncellemeler, id).toBeUndefined();
  }
  /* uygulamadaki veri bu çıktıyla aynı (bugün betik --yaz ile uygulandı) */
  const canli = JSON.parse(fs.readFileSync(path.join(kok, 'veri', 'haberler.json'), 'utf8'));
  for (const h of veri.haberler.filter(x => x.makale)) expect(bul(canli, h.id), h.id).toMatchObject({ kesinlik: h.kesinlik, makale: h.makale });
});

test('İkinci koşu değişiklik üretmez (not bir kez eklenir); kesinlik_neden "aday" ise etiket kalır', () => {
  const ilk = kos(GIRDI).veri;
  const iki = kos(ilk, '2026-11-17');
  expect(iki.rapor.degisen).toEqual([]);
  expect(bul(iki.veri, '2026-10-28-betelgeuse-eslik-eden-iz').guncellemeler).toHaveLength(1);
  const g = JSON.parse(fs.readFileSync(GIRDI, 'utf8'));
  bul(g, '2026-10-28-betelgeuse-eslik-eden-iz').kesinlik_neden = 'aday';
  const s = kos(g).veri;
  const b = bul(s, '2026-10-28-betelgeuse-eslik-eden-iz');
  expect(b.kesinlik).toBe('ön sonuç');
  expect(b.makale.hakemli).toBe(true);
});

test('Crossref ilgisiz sonuç döndürür (β Pic: aynı ilk yazarın başka makalesi) → eşleşme sayılmaz; kural birim testleri', () => {
  const { rapor } = kos(GIRDI);
  const p = rapor.yayimlanmamis.find(x => x.id === '2026-09-15-beta-pictoris-b-radyo');
  const ayni = p.iz.find(z => z.arama === '10.3847/1538-3881/ad58be');    // Ortiz Ceballos vd., başka bir VLA taraması (AJ)
  expect(ayni).toBeTruthy();
  expect(ayni.neden).toMatch(/başlık benzerliği 0\.\d+ < 0\.9/);
  const out = py(['-c', `
import sys, json; sys.path.insert(0, 'araclar'); import haber_dogrula as H
x = {'type': 'journal-article', 'title': ['Discovery of radio emission from the exoplanet $\\\\beta$ Pictoris b'], 'author': [{'family': 'Ortiz Ceballos', 'sequence': 'first'}]}
print(json.dumps([
  H.eslesir(x, 'Discovery of radio emission from the exoplanet β Pictoris b', 'Ortiz Ceballos')[0],
  H.eslesir(x, 'Discovery of radio emission from the exoplanet β Pictoris b', 'Berger')[0],
  H.eslesir(dict(x, type='posted-content'), 'Discovery of radio emission from the exoplanet β Pictoris b', 'Ortiz Ceballos')[0],
  H.eslesir(x, 'Radio emission from beta Pic b with ALMA', 'Ortiz Ceballos')[0],
  H.ilk_yazar({'yazarlar': 'GRAVITY+ İş Birliği (Abd El Dayem vd.)'}), H.ilk_yazar({'yazarlar': 'Ortiz Ceballos, Berger ve Cendes'}),
  H.doi_bul({'url': 'https://www.nature.com/articles/s41586-026-11213-z'}), H.arxiv_kimlik({'dergi': 'Science (ön baskısı: arXiv:2508.01648)'})]))
`]);
  expect(JSON.parse(out)).toEqual([true, false, false, false, 'Abd El Dayem', 'Ortiz Ceballos', '10.1038/s41586-026-11213-z', '2508.01648']);
});

test('Betikler e-posta göndermez: User-Agent genel, istek başlığında kişisel veri yok', () => {
  for (const f of ['araclar/haber_dogrula.py', 'araclar/apod_gorsel.py', 'araclar/haber_gorsel.py']) {
    const t = fs.readFileSync(path.join(kok, f), 'utf8');
    expect(t, f).toContain("urania-haber/1.0 (+https://github.com/dessn7-bit/urania)");
    expect(t, f).not.toMatch(/mailto|@gmail|dessn7@/);
  }
});

test('Haftanın görüntüsü: kredi beyaz listesi kişi kredilerini, "Copyright"ı ve tanınmayan öğeleri dışarıda bırakır (gerçek APOD kaydı)', () => {
  const ls = JSON.parse(py(['araclar/apod_gorsel.py', '--fixture', 'testler/veri/apod/image-article.json', '--json']));
  const al = t => ls.find(x => x.tarih === t);
  expect(ls.length).toBe(20);
  expect(ls.filter(x => x.uygun).map(x => x.tarih)).toEqual(['2026-11-05']);
  expect(al('2026-11-05').lisans_dogrula).toEqual(['ESA']);                       // ESA: görselin kendi lisansı okunmalı
  expect(al('2026-11-07').neden).toContain('Alejandro Sanz');                       // "Credit: Alejandro Sanz" (Copyright yazmasa da kişi)
  expect(al('2026-11-06').neden).toContain('AndreaMosaic');
  expect(al('2026-11-10').neden).toContain('Copyright');
  expect(al('2026-11-02').uygun).toBe(false);                                        // "Processing & License: J. Cowart"
  const out = JSON.parse(py(['-c', `
import sys, json; sys.path.insert(0, 'araclar'); import apod_gorsel as A
print(json.dumps([A.kredi_uygun('Credit', s)['uygun'] for s in ['NASA, ESA, CSA, STScI', 'NASA/JPL-Caltech', 'Juan Carlos Casado', 'NASA, ESA and Jane Doe', 'NASA; Image Copyright: X']]))
`]));
  expect(out).toEqual([true, true, false, false, false]);
  /* veride gorsel türündeki her maddenin kredi satırı aynı kuraldan geçer */
  const V = JSON.parse(fs.readFileSync(path.join(kok, 'veri', 'haberler.json'), 'utf8'));
  const gs = V.haberler.filter(h => h.tur === 'gorsel');
  expect(gs.length).toBeGreaterThanOrEqual(1);
  for (const h of gs) {
    const r = JSON.parse(py(['-c', `import sys, json; sys.path.insert(0, 'araclar'); import apod_gorsel as A; print(json.dumps(A.kredi_uygun('Credit', ${JSON.stringify(h.gorsel.apod.kredi_satiri)})))`]));
    expect(r.uygun, h.id).toBe(true);
  }
  /* haftada en çok bir görsel (eklenme tarihine göre ISO hafta) */
  const hafta = s => { const d = new Date(s + 'T00:00:00Z'); const g = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - g + 3); const y = new Date(Date.UTC(d.getUTCFullYear(), 0, 4)); return d.getUTCFullYear() + '-' + Math.round(((d - y) / 864e5 - 3 + ((y.getUTCDay() + 6) % 7)) / 7 + 1); };
  const sayac = {};
  gs.forEach(h => { const k = hafta(h.eklenme); sayac[k] = (sayac[k] || 0) + 1; });
  Object.entries(sayac).forEach(([k, n]) => expect(n, k).toBeLessThanOrEqual(1));
});

/* ---- Arayüz (sahte veri) ---- */
const JPG = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==', 'base64');
const k2 = [{ ad: 'A', url: 'https://example.org/a' }, { ad: 'B', url: 'https://example.org/b' }];
const SAHTE = {
  guncelleme: '2026-11-10',
  haberler: [
    { id: '2026-11-05-ornek-gorsel', tarih: '2026-11-05', eklenme: '2026-11-10', tur: 'gorsel', baslik: 'Haftanın görüntüsü: örnek', ozet: ['Görsel paragrafı.'], gorsel: { dosya: 'img/haber/2026-11-05-ornek-gorsel.jpg', alt: 'Örnek', aciklama: 'Gerçek fotoğraf.', kredi: 'NASA/JPL-Caltech/Space Science Institute', lisans: 'Kamu malı (NASA)', kaynak_url: 'https://science.nasa.gov/photojournal/x/', apod: { url: 'https://science.nasa.gov/image-article/apod-x/', tarih: '2026-11-05', kredi_satiri: 'NASA' } }, kaynaklar: k2 },
    { id: '2026-11-20-ornek-etkinlik', tarih: '2026-11-20', eklenme: '2026-11-10', tur: 'etkinlik', baslik: 'Gözlem gecesi (gelecek)', ozet: ['Etkinlik paragrafı.'], etkinlik: { yer: 'İstanbul Üniversitesi Gözlemevi, Beyazıt', baslangic: '2026-11-20', saat: '19.00–22.00', basvuru: 'Gerekmez', ucret: 'Ücretsiz', kaynak_url: 'https://astronomi.istanbul.edu.tr/bilimtoplum/program.html', kaynak_ad: 'İÜ Bilim-Toplum' }, kaynaklar: k2 },
    { id: '2026-10-01-ornek-etkinlik-gecmis', tarih: '2026-10-01', eklenme: '2026-09-20', tur: 'etkinlik', baslik: 'Gözlem gecesi (geçmiş)', ozet: ['Etkinlik paragrafı.'], etkinlik: { yer: 'Kandilli', baslangic: '2026-10-01', bitis: '2026-10-02', saat: '20.00', basvuru: 'Form', ucret: 'Ücretsiz', kaynak_url: 'https://kandilli.bogazici.edu.tr/duyurular' }, kaynaklar: k2 },
    { id: '2026-10-28-ornek-makale', tarih: '2026-10-28', eklenme: '2026-10-30', tur: 'arastirma', kesinlik: 'kesin', baslik: 'Yayımlanan makale', ozet: ['Makale paragrafı.'], neden_onemli: 'Ölçüm.', guncellemeler: [{ tarih: '2026-11-10', metin: 'Güncelleme (10 Kasım 2026): makale The Astronomical Journal dergisinde hakemli olarak yayımlandı. Bu yüzden "Ön sonuç" etiketi kaldırıldı.' }], makale: { baslik: 'A paper', yazarlar: 'Soyad vd.', dergi: 'The Astronomical Journal', cilt: '172', sayfa: '184', yayin_tarihi: '2026-09-01', hakemli: true, doi: '10.3847/1538-3881/ae953d', lisans: { ad: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' }, url: 'https://doi.org/10.3847/1538-3881/ae953d' }, kaynaklar: k2 }
  ]
};
async function kur(page, s = {}) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await page.route('**/veri/haberler.json', r => r.fulfill({ json: SAHTE }));
  await page.route('**/img/haber/*.jpg', r => r.fulfill({ contentType: 'image/jpeg', body: JPG }));
  await page.addInitScript(k => { localStorage.setItem('urania_konumOto', 'false'); if (k) localStorage.setItem('urania_kirmizi', 'true'); }, !!s.kirmizi);
  await page.clock.install({ time: new Date('2026-11-10T12:00:00+03:00') });
}
test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });

test('Kart: güncelleme notu görünür; makale satırında dergi, cilt, tarih, hakemli, lisans, DOI', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#haber');
  const a = page.locator('article[data-id="2026-10-28-ornek-makale"]');
  await expect(a.locator('.hb-guncelleme')).toBeVisible();
  await expect(a.locator('.hb-guncelleme')).toHaveText('Güncelleme (10 Kasım 2026): makale The Astronomical Journal dergisinde hakemli olarak yayımlandı. Bu yüzden "Ön sonuç" etiketi kaldırıldı.');
  await expect(a.locator('.rozet.uyari')).toHaveCount(0);
  await a.locator('summary').click();
  await expect(a.locator('.hb-makale')).toContainText('The Astronomical Journal 172, 184; 1 Eylül 2026; hakemli; CC BY 4.0; DOI 10.3847/1538-3881/ae953d');
  await expect(a.locator('.hb-makale a', { hasText: 'CC BY 4.0' })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
});

test('Yeni türler: "Haftanın görüntüsü" ve "Etkinlik" süzgeçte; etkinlik bilgileri; geçmiş etkinlik "Geçti"', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#haber');
  await expect(page.locator('.hb-filtre button')).toHaveText([/Tümü/, /Araştırmalar/, /Görüntüler/, /Etkinlikler/]);
  await page.locator('.hb-filtre button[data-f="gorsel"]').click();
  await expect(page.locator('article.haber')).toHaveCount(1);
  const g = page.locator('article[data-id="2026-11-05-ornek-gorsel"]');
  await expect(g.locator('.hb-ust .rozet').first()).toHaveText('Haftanın görüntüsü');
  await expect(g.locator('.hb-kredi')).toContainText('Kamu malı (NASA)');
  await expect(g.locator('.hb-kredi a', { hasText: 'APOD' })).toHaveAttribute('href', 'https://science.nasa.gov/image-article/apod-x/');
  await page.locator('.hb-filtre button[data-f="etkinlik"]').click();
  await expect(page.locator('article.haber')).toHaveCount(2);
  const gel = page.locator('article[data-id="2026-11-20-ornek-etkinlik"]');
  await expect(gel.locator('.hb-etkinlik')).toContainText('İstanbul Üniversitesi Gözlemevi');
  await expect(gel.locator('.hb-etkinlik')).toContainText('19.00–22.00');
  await expect(gel.locator('.hb-etkinlik')).toContainText('Ücretsiz');
  await expect(gel.locator('.hb-etkinlik a')).toHaveAttribute('href', 'https://astronomi.istanbul.edu.tr/bilimtoplum/program.html');
  await expect(gel.locator('.hb-gecti-rozet')).toHaveCount(0);
  const gec = page.locator('article[data-id="2026-10-01-ornek-etkinlik-gecmis"]');
  await expect(gec).toHaveClass(/hb-gecti/);
  await expect(gec.locator('.hb-gecti-rozet')).toHaveText('Geçti');
});

for (const w of [320, 551]) for (const kir of [false, true]) {
  test(`${w} px${kir ? ', kırmızı mod' : ''}: yeni kartlar taşmaz${kir ? ', yalnız kırmızı/siyah' : ''}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await kur(page, { kirmizi: kir });
    await page.goto('/index.html#haber');
    await expect(page.locator('article.haber')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    if (kir) {
      const png = await page.locator('article[data-id="2026-10-28-ornek-makale"] .hb-guncelleme').screenshot();
      const png2 = await page.locator('article[data-id="2026-11-20-ornek-etkinlik"]').screenshot();
      for (const p of [png, png2]) {
        const n = await page.evaluate(async b64 => {
          const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
          const x = c.getContext('2d'); x.drawImage(img, 0, 0);
          const d = x.getImageData(0, 0, c.width, c.height).data;
          let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.max(d[i + 1], d[i + 2]) > 0.35 * d[i] + 20) n++;
          return n;
        }, p.toString('base64'));
        expect(n).toBe(0);
      }
    }
  });
}
