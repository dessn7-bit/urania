'use strict';
/* v50 içerik paketi: takımyıldız mitleri (veri/mitler.json), Türkçe geleneksel gök adları (veri/turkce_gok_adlari.json),
   Binocular Sky tarifleri (veri/hedef_tarifleri.json + veri/LICENSE-binocularsky.txt), yıldız bilgisi (veri/yildiz_bilgi.json)
   ve bunların arayüzü (icerik.js): harita bilgi kutusu, "Mit" bölümü, bulma haritasındaki tarifler, ders notu. Ağsız. */
const { test, expect } = require('@playwright/test');
const { default: AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');
const { disAgiKes, celestrak, havaSessiz, kok } = require('./yardim');

const J = f => JSON.parse(fs.readFileSync(path.join(kok, 'veri', f), 'utf8'));
const AN = new Date('2026-11-10T21:00:00+03:00');

async function kur(page, s) {
  const o = s || {};
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await disAgiKes(page);
  await celestrak(page, { hata: 503 });
  await havaSessiz(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: {} }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: [] }));
  await page.addInitScript(k => {
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_gokKat', JSON.stringify({ hedef: true, ty: true }));
    if (k) localStorage.setItem('urania_kirmizi', 'true');
  }, !!o.kirmizi);
  await page.clock.install({ time: AN });
}
/* Haritayı ızgara hâlinde tarar: her noktaya tıklama olayı gönderip bilgi kutusunun içeriğini toplar */
async function haritaTara(page) {
  await page.waitForFunction(() => window.Icerik && Icerik.hazir());
  await page.waitForTimeout(600);
  return page.evaluate(() => {
    const cv = document.querySelector('#gkLevha'), kutu = document.querySelector('#gkBilgi');
    const b = cv.getBoundingClientRect(), out = [];
    for (let y = 6; y < b.height; y += 9) for (let x = 6; x < b.width; x += 9) {
      cv.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: b.left + x, clientY: b.top + y }));
      if (!kutu.hidden && kutu.innerHTML) out.push({ x: b.left + x, y: b.top + y, html: kutu.innerHTML, metin: kutu.textContent });
    }
    return out;
  });
}

test.afterEach(async ({ page }) => { expect(page.hatalar || []).toEqual([]); });

/* ---------------- veri dosyaları ---------------- */
test('mitler.json: her anlatının kaynağı, bölümü ve satır aralığı var; kelime sayıları doğru; göğe konma yalnız kaynağın yazdığı dört öyküde', () => {
  const m = J('mitler.json'), ty = new Set(J('takimyildiz.json').map(t => t.k));
  expect(Object.keys(m.kaynaklar).sort()).toEqual(['berens', 'bulfinch']);
  expect(m.kaynaklar.berens).toMatchObject({ yazar: 'E. M. Berens', yil: 1880, url: 'https://www.gutenberg.org/ebooks/22381', lisans: 'kamu malı' });
  expect(m.kaynaklar.bulfinch).toMatchObject({ yazar: 'Thomas Bulfinch', yil: 1855, lisans: 'kamu malı' });
  expect(m.mitler.length).toBe(21);
  const anahtarlar = new Set();
  for (const x of m.mitler) {
    expect(x.anahtar.length, x.baslik).toBeGreaterThan(0);
    x.anahtar.forEach(a => { expect(a === 'M45' || ty.has(a), a).toBe(true); anahtarlar.add(a); });
    expect(['berens', 'bulfinch']).toContain(x.kaynak);
    expect(x.bolum.length, x.baslik).toBeGreaterThan(3);
    expect(x.satirlar).toHaveLength(2);
    expect(x.satirlar[1]).toBeGreaterThanOrEqual(x.satirlar[0]);
    if (x.kaynak === 'berens') expect(Number.isInteger(x.sayfa), x.baslik).toBe(true);
    const kelime = x.metin.trim().split(/\s+/).length;
    expect(kelime, x.baslik).toBe(x.kelime);
    expect(kelime, x.baslik).toBeLessThanOrEqual(300);
    expect(x.kisa, x.baslik).toBe(kelime < 150);          // 150'nin altı yalnız kaynak bölümü kısa olduğunda; işaretli
    expect(x.ozgun_alinti.split(/\s+/).length, x.baslik).toBeGreaterThanOrEqual(12);
    /* Yıldızlara konulma cümlesi yalnız goge_konma doğruysa geçebilir */
    const gok = /takımyıldız|yıldızların arasına|göğe yerleştir/.test(x.metin);
    if (!x.goge_konma) expect(gok, x.baslik + ': kaynakta olmayan göğe konma cümlesi').toBe(false);
  }
  expect(m.mitler.filter(x => x.goge_konma).map(x => x.anahtar.join('+')).sort()).toEqual(['M45', 'Ori', 'Pup', 'UMa']);
  /* Orion ve Ülker Berens'te yok: Bulfinch'ten */
  expect(m.mitler.filter(x => x.kaynak === 'bulfinch').map(x => x.anahtar[0]).sort()).toEqual(['M45', 'Ori']);
  for (const a of ['Per', 'And', 'Cas', 'Cep', 'UMa', 'Gem', 'Cen', 'Pup', 'Her', 'Lyr', 'Cyg', 'Leo', 'Tau', 'Ori', 'M45']) expect(anahtarlar.has(a), a).toBe(true);
  expect(anahtarlar.has('Sco')).toBe(false);              // akrep iki kaynakta da anlatılmıyor
  /* Roma adları parantezde, Yunanca biçim önde */
  const tum = m.mitler.map(x => x.metin).join(' ');
  expect(tum).toContain('Herakles (Hercules)');
  expect(tum).toContain('Polydeukes (Pollux)');
  expect(tum).not.toMatch(/\bHercules\b(?!\))|\bJupiter\b(?![-)])/);
});

test('Mit metinleri kaynak kitabın satırlarıyla bağlı: özgün alıntı Gutenberg metninde, verilen satır aralığının başında', () => {
  /* Kaynak metinler depoda tutulmaz (büyük); arastirma/mit_kaynak_ozet.json her anlatının satır aralığındaki ilk satırları taşır */
  const oz = JSON.parse(fs.readFileSync(path.join(kok, 'arastirma', 'mit_kaynak_ozet.json'), 'utf8'));
  const m = J('mitler.json');
  expect(Object.keys(oz.anlatilar).length).toBe(m.mitler.length);
  for (const x of m.mitler) {
    const k = oz.anlatilar[x.baslik];
    expect(k, x.baslik).toBeTruthy();
    expect(k.satirlar).toEqual(x.satirlar);
    const duz = s => s.replace(/\s+/g, ' ').replace(/^[A-Z .()0-9-]+\.--/, '').trim();
    expect(duz(k.kaynak_metni), x.baslik).toContain(duz(x.ozgun_alinti).slice(0, 60));
  }
});

test('turkce_gok_adlari.json: her adın birebir alıntısı var; görevdeki örnekler TDK\'de doğrulanmış; makalede karşılığı verilmeyen adlar cisme bağlanmamış', () => {
  const t = J('turkce_gok_adlari.json');
  expect(t.kaynaklar.tdk.url).toBe('https://sozluk.gov.tr/');
  expect(t.kaynaklar.garibova2021).toMatchObject({ cilt_sayi: '10/3', yil: 2021, sayfalar: '852-863' });
  expect(t.kaynaklar.garibova2021.url).toMatch(/^https:\/\/dergipark\.org\.tr\//);
  const c = Object.fromEntries(t.cisimler.map(x => [x.anahtar, x]));
  for (const x of t.cisimler) for (const a of x.adlar) {
    expect(['tdk', 'garibova2021']).toContain(a.kaynak);
    if (a.kaynak === 'tdk') { expect(a.madde.length, a.ad).toBeGreaterThan(0); expect(a.alinti.length, a.ad).toBeGreaterThan(3); }
    else { expect(a.sayfalar.every(s => s >= 852 && s <= 863), a.ad).toBe(true); expect(a.alintilar.length, a.ad).toBeGreaterThan(0); expect(a.alintilar.join(' ')).toContain(a.ad.split(' ')[0]); expect(['Kutadgu Bilig', "Divânu Lügati't-Türk"]).toContain(a.eser); }
  }
  const tdk = k => c[k].adlar.filter(a => a.kaynak === 'tdk').map(a => a.ad);
  const eski = k => c[k].adlar.filter(a => a.kaynak !== 'tdk').map(a => a.ad);
  expect(tdk('hedef:M45')).toEqual(['Yedikızkardeş', 'Süreyya', 'Peren', 'Pervin']);
  expect(tdk('yildiz:Polaris')).toContain('Demirkazık');
  for (const ad of ['Çoban Yıldızı', 'Akşam Yıldızı', 'Ak Yıldız', 'Çolpan', 'Kervankıran', 'Zühre']) expect(tdk('cisim:Venus')).toContain(ad);
  expect(tdk('samanyolu')).toEqual(['Gökyolu', 'Hacılaryolu', 'Hacıyolu', 'Kehkeşan', 'Samanuğrusu']);
  /* Kutadgu Bilig gezegen adları (makaledeki eşlemeyle) */
  expect(eski('cisim:Saturn')).toContain('Sekentir');
  expect(eski('cisim:Jupiter')).toContain('Oñay');
  expect(eski('cisim:Mars')).toContain('Kürüd');
  expect(eski('cisim:Venus')).toContain('Sevit');
  expect(eski('cisim:Mercury')).toContain('Arzıtilek');
  expect(eski('cisim:Moon')).toEqual(['Yalçık']);
  /* Makale Yetigen ve Temür Kaz(n)uk'un hangi cisim olduğunu yazmıyor: hiçbir cisme bağlanmadı, ayrı listede */
  expect(JSON.stringify(t.cisimler)).not.toMatch(/Yetigen|Temür/);
  expect(t.karsiligi_verilmeyen.map(x => x.ad).sort()).toEqual(['Temür Kaznuk', 'Yetigen']);
});

test('hedef_tarifleri.json ve lisans: 26 hedefin 24\'ünde tarif, Mizar ve Alcor boş; CC BY-NC-SA, Tonkin atfı ve değişiklik notu; harita yok', () => {
  const t = J('hedef_tarifleri.json'), h = J('hedefler.json').hedefler;
  expect(h).toHaveLength(26);
  const idler = h.map(x => x.id);
  expect(Object.keys(t.tarifler).every(k => idler.includes(k))).toBe(true);
  expect(idler.filter(k => !t.tarifler[k]).sort()).toEqual(['Alcor', 'Mizar']);
  expect(t.sitede_yok.sort()).toEqual(['Alcor', 'Mizar']);
  for (const [k, x] of Object.entries(t.tarifler)) {
    expect(x.sayfa, k).toMatch(/^https:\/\/binocularsky\.com\/binoc_object_file\.php\?object_id=\w+&aperture=50$/);
    expect(x.nasil.length, k).toBeGreaterThan(20);
    expect(x.ne.length, k).toBeGreaterThan(60);
    expect(x.nasil + x.ne, k).not.toMatch(/\b(the|and|binoculars|field of view|Sorry)\b/);       // çevrilmemiş İngilizce kalmamış
    expect(x.nasil + x.ne, k).not.toMatch(/\b[NSEW]{1,3}\b(?! ?\d)/);                              // yön kısaltması (N, SE, WNW) kalmamış
  }
  expect(t.lisans).toContain('CC BY-NC-SA 3.0');
  expect(t.not).toContain('6,4°');
  expect(t.not).toContain('10×50');
  /* Ortak sayfalar işaretli */
  expect(t.tarifler.M36.nasil).toBe(t.tarifler.M38.nasil);
  expect(t.tarifler['NGC 869'].ne).toBe(t.tarifler['NGC 884'].ne);
  for (const k of ['M36', 'M37', 'M38', 'NGC 869', 'NGC 884']) expect(t.tarifler[k].ortak, k).toBeTruthy();
  const l = fs.readFileSync(path.join(kok, 'veri', 'LICENSE-binocularsky.txt'), 'utf8');
  expect(l).toContain('Steve Tonkin');
  expect(l).toContain('https://binocularsky.com/');
  expect(l).toContain('Creative Commons Attribution-NonCommercial-ShareAlike 3.0');
  expect(l).toContain('https://creativecommons.org/licenses/by-nc-sa/3.0/');
  expect(l).toMatch(/ÇEVİRİSİDİR/);
  expect(l).toMatch(/haritaları ve görselleri KULLANILMADI/);
  /* Depoda siteden alınmış görsel yok */
  expect(fs.readdirSync(path.join(kok, 'img')).filter(f => /binoc|tonkin|bsky/i.test(f))).toEqual([]);
});

test('yildiz_bilgi.json: adı olan 578 yıldızın hepsi; uzaklık paralakstan doğru hesaplanmış; belirsiz paralaksta aralık; katalog farkları listeli', () => {
  const y = J('yildiz_bilgi.json'), yl = J('yildizlar.json');
  const adli = Object.keys(yl.adlar);
  expect(adli).toHaveLength(578);
  expect(Object.keys(y.yildizlar).sort()).toEqual(adli.slice().sort());
  expect(y.eslesmeyen).toEqual([]);
  expect(y.atif).toMatch(/SIMBAD database, operated at CDS, Strasbourg/);
  const PC = (648000 / Math.PI) * 149597870700 / (299792458 * 365.25 * 86400);
  expect(PC).toBeCloseTo(3.2616, 4);
  let uzaklikli = 0, aralik = 0, tayf = 0;
  for (const [i, s] of Object.entries(y.yildizlar)) {
    expect(s.ad).toBe(yl.adlar[i]);
    if (s.tayf) tayf++;
    if (!s.uzaklik) continue;
    uzaklikli++;
    const d = PC * 1000 / s.plx;
    expect(Math.abs(s.uzaklik.iy - d) / d, s.ad).toBeLessThan(0.02);   // değer, hata payının büyüklüğüne göre yuvarlanır
    if (s.plxHata != null) {
      expect(s.uzaklik.alt, s.ad).toBeLessThanOrEqual(s.uzaklik.iy);
      if (s.uzaklik.ust != null) expect(s.uzaklik.ust, s.ad).toBeGreaterThanOrEqual(s.uzaklik.iy);
      expect(s.uzaklik.aralik, s.ad).toBe(s.plxHata / s.plx > 0.10);
    }
    if (s.uzaklik.aralik) aralik++;
  }
  expect(uzaklikli).toBeGreaterThan(560);
  expect(tayf).toBeGreaterThan(570);
  expect(aralik).toBeGreaterThan(20);
  const ad = n => Object.values(y.yildizlar).find(s => s.ad === n);
  /* Sirius: paralaks 379,21 mas (van Leeuwen 2007) → 8,60 ışık yılı */
  expect(ad('Sirius')).toMatchObject({ simbad: '* alf CMa', tayf: 'A0mA1Va', plx: 379.21, hip: 32349, cift: true });
  expect(ad('Sirius').uzaklik.iy).toBeCloseTo(8.60, 1);
  expect(ad('Sirius').uzaklik.aralik).toBe(false);
  /* Deneb: paralaks küçük, hata büyük → aralık */
  expect(ad('Deneb').uzaklik.aralik).toBe(true);
  expect(ad('Deneb').uzaklik.alt).toBeLessThan(1300);
  expect(ad('Deneb').uzaklik.ust).toBeGreaterThan(1600);
  expect(ad('Polaris').tur).toBe('cC*');
  expect(ad('Polaris').degisen).toBe(true);
  expect(ad('Albireo').cift).toBe(true);
  /* Yakın çiftlerde doğru bileşen: konuma göre eşleme (doğrulayıcı bulgusu: Alkalurops μ² Boo'ya bağlanmıştı) */
  expect(ad('Alkalurops')).toMatchObject({ simbad: '* mu.01 Boo', tayf: 'F0IV', hip: 75411 });
  expect(ad('Dziban').simbad).toBe('* psi01 Dra A');
  expect(ad('Errai')).toMatchObject({ simbad: '* gam Cep', hip: 116727 });
  expect(ad('Chalawan').simbad).toBe('* 47 UMa');
  for (const s of Object.values(y.yildizlar)) { expect(s.tayf, s.ad + ' tayf').toBeTruthy(); expect(s.plx, s.ad + ' paralaks').toBeGreaterThan(0); }
  /* SIMBAD ↔ Hipparcos V farkı 0,15 kadirden büyük olanlar listede; hepsi gerçekten büyük */
  expect(y.vFarklari.length).toBeGreaterThan(3);
  for (const f of y.vFarklari) { expect(Math.abs(f.vSimbad - f.vHip), f.ad).toBeGreaterThan(0.15); expect(f.fark).toBeCloseTo(f.vSimbad - f.vHip, 2); }
  expect(y.vFarklari.map(f => f.ad)).toContain('La Superba');
  const betik = fs.readFileSync(path.join(kok, 'araclar', 'yildiz_bilgi.py'), 'utf8');
  expect(betik).toContain('simbad.cfa.harvard.edu/simbad/sim-tap');
  expect(betik).toContain('vizier.cfa.harvard.edu');
  expect(betik).not.toMatch(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/);      // istek başlığında e-posta yok
  expect(betik).not.toMatch(/celestrak/i);
});

/* ---------------- arayüz ---------------- */
test('Harita: takımyıldıza dokununca "Mit" düğmesi; Mit bölümü anlatıyı, kaynağı ve eksiksiz ses metnini taşır; Kapat odağı geri verir', async ({ page }) => {
  test.setTimeout(90000);
  await kur(page);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkLevha')).toBeVisible({ timeout: 20000 });
  const tarama = await haritaTara(page);
  const mitli = tarama.filter(t => /takımyıldızı/.test(t.metin) && /data-mit="/.test(t.html));
  expect(mitli.length).toBeGreaterThan(0);
  /* Mitsiz takımyıldızda düğme yok */
  expect(tarama.some(t => /takımyıldızı/.test(t.metin) && !/data-mit=/.test(t.html))).toBe(true);
  const sec = mitli.find(t => /data-mit="(Per|And|Cas|Cep|Peg|Cyg|Lyr|Her|Tau|Ari)"/.test(t.html)) || mitli[0];
  const anahtar = /data-mit="(\w+)"/.exec(sec.html)[1];
  await page.mouse.click(sec.x, sec.y);
  const dugme = page.locator('#gkBilgi .ic-mit-dugme');
  await expect(dugme).toBeVisible();
  await dugme.click();
  const kutu = page.locator('#gkMit .mit-kutu');
  await expect(kutu).toBeVisible();
  await expect(page.locator('#gkBilgi')).toBeHidden();
  const m = J('mitler.json').mitler.filter(x => x.anahtar.includes(anahtar));
  await expect(kutu.locator('h3')).toHaveText(/^Mit: /);
  await expect(kutu.locator('h3')).toBeFocused();
  await expect(kutu.locator('.mit-anlati')).toHaveCount(m.length);
  await expect(kutu.locator('.mit-metin').first()).toHaveText(m[0].metin);
  await expect(kutu.locator('.kaynak').first()).toContainText(m[0].kaynak === 'berens' ? 'E. M. Berens, The Myths and Legends of Ancient Greece and Rome (1880)' : 'Thomas Bulfinch');
  await expect(kutu.locator('.kaynak').first()).toContainText('“' + m[0].bolum + '” bölümü');
  if (m[0].sayfa) await expect(kutu.locator('.kaynak').first()).toContainText('s. ' + m[0].sayfa);
  await expect(kutu.locator('.kaynak a').first()).toHaveAttribute('href', /^https:\/\/www\.gutenberg\.org\/ebooks\/\d+$/);
  if (!m[0].goge_konma) await expect(kutu.locator('.kaynak').first()).toContainText('Kitap bu öyküyü bir takımyıldıza bağlamaz');
  /* Sesli okuma metni eksiksiz: başlık + anlatının tamamı + kaynak */
  const ses = await kutu.locator('.mit-metin').first().getAttribute('data-ses');
  expect(ses.startsWith(m[0].baslik + '. ' + m[0].metin)).toBe(true);
  expect(ses).toContain('Kaynak: ');
  await kutu.locator('[data-mit-kapat]').click();
  await expect(page.locator('#gkMit')).toBeHidden();
});

test('Harita bilgi kutusu: Kutup Yıldızı\'nda Türkçe geleneksel adlar ve yıldız bilgisi; hedefte (Ülker) adlar ve Mit; her adlı yıldızda kaynak', async ({ page }) => {
  test.setTimeout(90000);
  await kur(page);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkLevha')).toBeVisible({ timeout: 20000 });
  const tarama = await haritaTara(page);
  const polaris = tarama.find(t => t.metin.startsWith('Polaris'));
  expect(polaris, 'Polaris haritada').toBeTruthy();
  expect(polaris.metin).toContain('Türkçe geleneksel adları: Demirkazık, Kuzey Yıldızı (TDK).');
  expect(polaris.metin).toContain('Tayf türü F8Ib');
  expect(polaris.metin).toMatch(/uzaklık 43\d(,\d)? ışık yılı \(±\d+(,\d+)?\)/);
  expect(polaris.metin).toContain('klasik Sefe türü değişen yıldız');
  expect(polaris.metin).toContain('Kaynak: CDS/SIMBAD.');
  /* Ülker (M45): 10 Kasım 21.00'de doğuda, ufkun üstünde */
  const ulker = tarama.find(t => t.metin.startsWith('Ülker'));
  expect(ulker, 'Ülker haritada').toBeTruthy();
  expect(ulker.metin).toContain('Türkçe geleneksel adları: Yedikızkardeş, Süreyya, Peren, Pervin (TDK); Ülker (Divânu Lügati\'t-Türk).');
  expect(ulker.html).toContain('data-mit="M45"');
  /* Adı olan her yıldızın kutusunda (veri varsa) kaynak satırı; adsız yıldızda ek yok */
  const yildizli = tarama.filter(t => /Tayf türü/.test(t.metin));
  expect(yildizli.length).toBeGreaterThan(5);
  for (const t of yildizli) expect(t.metin).toContain('Kaynak: CDS/SIMBAD.');
  for (const t of tarama.filter(x => x.metin.startsWith('Yıldız ·'))) expect(t.html).not.toContain('ic-satir');
  /* Uzaklığı belirsiz yıldız aralıkla yazılır (Deneb bu saatte yüksekte) */
  const deneb = tarama.find(t => t.metin.startsWith('Deneb ·'));
  if (deneb) expect(deneb.metin).toMatch(/uzaklık yaklaşık 1\.?2\d\d–1\.?6\d\d ışık yılı \(paralaksı belirsiz\)/);
  /* Metin üreticileri (gezegenler bu saatte ufkun altında olabilir): doğrudan */
  const m = await page.evaluate(() => ({
    venus: Icerik.turkceAdMetni('cisim:Venus'), saturn: Icerik.turkceAdMetni('cisim:Saturn'), yok: Icerik.turkceAdMetni('cisim:Uranus'),
    sirius: Icerik.yildizMetni('Sirius'), deneb: Icerik.yildizMetni('Deneb'), bilinmeyen: Icerik.yildizMetni('Olmayan Yıldız')
  }));
  expect(m.venus).toBe('Türkçe geleneksel adları: Çoban Yıldızı, Akşam Yıldızı, Ak Yıldız, Çolpan, Çulpan, Kervankıran, Kervan Yıldızı, Zühre (TDK); Sevit (Kutadgu Bilig).');
  expect(m.saturn).toBe('Türkçe geleneksel adları: Sekendiz, Zühal (TDK); Sekentir (Kutadgu Bilig).');
  expect(m.yok).toBe('');
  expect(m.sirius).toBe('Tayf türü A0mA1Va · uzaklık 8,601 ışık yılı (±0,036) · tayfsal çift yıldız. Kaynak: CDS/SIMBAD.');
  expect(m.deneb).toContain('uzaklık yaklaşık 1.240–1.640 ışık yılı (paralaksı belirsiz)');
  expect(m.bilinmeyen).toBe('');
});

test('Bulma haritası: "Nasıl bulunur" ve "Ne görürsün" açılır bölümleri kaynak satırıyla; Urania\'nın atlama yolu yerinde; sitede olmayan hedefte bölüm yok', async ({ page }) => {
  test.setTimeout(60000);
  await kur(page);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkLevha')).toBeVisible({ timeout: 20000 });
  const ac = id => page.evaluate(async k => { const h = (await Urania.veri('hedefler')).hedefler.find(x => x.id === k); await Bulucu.ac(h); }, id);
  await ac('M31');
  const panel = page.locator('#bulucuPanel');
  await expect(panel).toBeVisible();
  const t = J('hedef_tarifleri.json').tarifler.M31;
  await expect(panel.locator('#bulucuTarif')).not.toHaveText('');                // Urania'nın kendi yıldız atlama tarifi
  const bolum = panel.locator('details.ic-tarif');
  await expect(bolum).toHaveCount(2);
  await expect(bolum.nth(0).locator('summary')).toHaveText('Nasıl bulunur');
  await expect(bolum.nth(1).locator('summary')).toHaveText('Ne görürsün');
  await expect(bolum.nth(0).locator('p').first()).toBeHidden();                  // kapalı gelir
  await bolum.nth(0).locator('summary').click();
  await expect(bolum.nth(0).locator('p').first()).toHaveText(t.nasil);
  await bolum.nth(1).locator('summary').click();
  await expect(bolum.nth(1).locator('p').first()).toHaveText(t.ne);
  for (const i of [0, 1]) {
    await expect(bolum.nth(i).locator('.kaynak')).toContainText('Kaynak: Steve Tonkin, The Binocular Sky (CC BY-NC-SA 3.0); Urania için Türkçeye çevrildi.');
    await expect(bolum.nth(i).locator('.kaynak')).toContainText("7×50'nin alanı daha geniştir (6,4°)");
    await expect(bolum.nth(i).locator('.kaynak a')).toHaveAttribute('href', t.sayfa);
  }
  expect(await bolum.nth(0).locator('p.okunur').getAttribute('data-ses')).toBe('Nasıl bulunur. ' + t.nasil);
  expect(await bolum.nth(1).locator('p.okunur').getAttribute('data-ses')).toBe('Ne görürsün. ' + t.ne);
  await panel.locator('.bulucu-kapat').click();
  await ac('M37');
  await expect(panel.locator('details.ic-tarif .kaynak').first()).toContainText('M36, M37 ve M38 için sitedeki metin ortaktır.');
  await panel.locator('.bulucu-kapat').click();
  await ac('Mizar');
  await expect(panel).toBeVisible();
  await expect(panel.locator('#bulucuTarif')).not.toHaveText('');
  await expect(panel.locator('details.ic-tarif')).toHaveCount(0);
});

test('Dersler: takımyıldız ve gezegen derslerinin sonunda Türkçe geleneksel adlar notu, kaynaklarıyla; ilgisiz derste not yok', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#ders/d21');
  const not = page.locator('.ic-ders-not');
  await expect(not).toBeVisible({ timeout: 20000 });
  await expect(not.locator('h3')).toHaveText('Türkçe geleneksel adlar');
  await expect(not).toContainText('Ülker (M45): Yedikızkardeş, Süreyya, Peren, Pervin (TDK)');
  await expect(not).toContainText('Kutup Yıldızı: Demirkazık, Kuzey Yıldızı (TDK).');
  await expect(not).toContainText('Samanyolu: Gökyolu, Hacılaryolu, Hacıyolu, Kehkeşan, Samanuğrusu (TDK).');
  await expect(not.locator('.kaynak')).toContainText('TDK Güncel Türkçe Sözlük');
  await expect(not.locator('.kaynak')).toContainText('TEKE');
  await expect(not.locator('.kaynak')).toContainText('s. 852-863');
  await page.goto('/index.html#ders/d38');
  await expect(page.locator('.ic-ders-not')).toContainText('Satürn: Sekendiz, Zühal (TDK); Sekentir (Kutadgu Bilig).');
  await page.goto('/index.html#ders/d2');
  await expect(page.locator('#b-ders h1')).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.locator('.ic-ders-not')).toHaveCount(0);
  /* Ders verisi değişmedi: not ders dosyasında değil */
  expect(JSON.stringify(J('dersler.json'))).not.toContain('Yedikızkardeş');
});

test('"Gökyüzüne bak": bilgi kutusu ek satırları ve Mit bölümü (aynı içerik); sw.js yeni dosyaları önbelleğe alır', async ({ page }) => {
  await kur(page);
  await page.goto('/index.html#ar');
  await expect(page.locator('#arBilgi')).toBeAttached({ timeout: 20000 });
  await page.waitForFunction(() => window.Icerik && Icerik.hazir());
  const s = await page.evaluate(() => {
    const kap = document.querySelector('#arMit'), odak = document.querySelector('#arBul');
    const acildi = Icerik.mitAc(kap, 'Ori', odak);
    return { acildi, gizli: kap.hidden, bas: kap.querySelector('h3').textContent, metin: kap.querySelector('.mit-metin').textContent, kaynak: kap.querySelector('.kaynak').textContent,
      ty: Icerik.tyKisa('Avcı') || Icerik.tyKisa('Orion'), dugme: Icerik.mitDugmesi('Ori'), yok: Icerik.mitDugmesi('Sco'), olmayan: Icerik.mitAc(kap, 'Sco', odak) };
  });
  expect(s.acildi).toBe(true);
  expect(s.gizli).toBe(false);
  expect(s.bas).toMatch(/^Mit: /);
  expect(s.metin).toBe(J('mitler.json').mitler.find(x => x.anahtar[0] === 'Ori').metin);
  expect(s.kaynak).toContain('Thomas Bulfinch');
  expect(s.kaynak).not.toContain('Kitap bu öyküyü bir takımyıldıza bağlamaz');   // Orion'da kaynak göğe konulmayı yazıyor
  expect(s.ty).toBe('Ori');
  expect(s.dugme).toContain('data-mit="Ori"');
  expect(s.yok).toBe('');
  expect(s.olmayan).toBe(false);
  await page.locator('#arMit [data-mit-kapat]').click();
  await expect(page.locator('#arMit')).toBeHidden();
  const sw = fs.readFileSync(path.join(kok, 'sw.js'), 'utf8');
  for (const f of ['./icerik.js', './veri/mitler.json', './veri/turkce_gok_adlari.json', './veri/hedef_tarifleri.json', './veri/yildiz_bilgi.json']) expect(sw).toContain(`'${f}'`);
});

/* ---------------- erişilebilirlik ve dar ekran ---------------- */
for (const kirmizi of [false, true]) {
  test(`axe ve taşma: Mit bölümü, ekli bilgi kutusu, bulma haritası tarifleri, ders notu${kirmizi ? ' (kırmızı mod)' : ''} — 551 ve 320 pikselde`, async ({ page }) => {
    test.setTimeout(120000);
    await kur(page, { kirmizi });
    const axe = async ad => {
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(r.violations.map(v => `${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`), ad).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), ad + ' taşma').toBeLessThanOrEqual(0);
    };
    for (const en of [551, 320]) {
      await page.setViewportSize({ width: en, height: 800 });
      await page.goto('/index.html#gok');
      await expect(page.locator('#gkLevha')).toBeVisible({ timeout: 20000 });
      await page.waitForFunction(() => window.Icerik && Icerik.hazir());
      await page.waitForTimeout(800);
      /* Ekli bilgi kutusu (Polaris) haritanın içinde kalır */
      const tarama = await haritaTara(page);
      const p = tarama.find(t => t.metin.startsWith('Polaris'));
      if (p) {
        await page.mouse.click(p.x, p.y);
        await expect(page.locator('#gkBilgi')).toContainText('Demirkazık');
        const o = await page.evaluate(() => { const k = document.querySelector('#gkBilgi').getBoundingClientRect(), c = document.querySelector('#gkLevha').getBoundingClientRect(); return { sol: k.left - c.left, sag: c.right - k.right }; });
        expect(o.sol, 'bilgi kutusu sol ' + en).toBeGreaterThanOrEqual(-1);
        expect(o.sag, 'bilgi kutusu sağ ' + en).toBeGreaterThanOrEqual(-1);
        await axe('bilgi kutusu ' + en);
      }
      await page.evaluate(() => Icerik.mitAc(document.querySelector('#gkMit'), 'Lyr', document.querySelector('#gkLevha')));
      await expect(page.locator('#gkMit .mit-anlati')).toHaveCount(2);
      await axe('mit ' + en);
      await page.evaluate(async () => { const h = (await Urania.veri('hedefler')).hedefler.find(x => x.id === 'M42'); await Bulucu.ac(h); });
      await page.locator('#bulucuPanel details.ic-tarif summary').first().click();
      await page.locator('#bulucuPanel details.ic-tarif summary').nth(1).click();
      await axe('bulucu ' + en);
      expect(await page.evaluate(() => { const d = document.querySelector('#bulucuPanel'); return d.scrollWidth - d.clientWidth; }), 'panel taşma ' + en).toBeLessThanOrEqual(0);
      await page.locator('#bulucuPanel .bulucu-kapat').click();
      await page.goto('/index.html#ders/d9');
      await expect(page.locator('.ic-ders-not')).toBeVisible({ timeout: 20000 });
      await axe('ders notu ' + en);
    }
  });
}
