'use strict';
/* v45 Görünürlük hesabı (gorunurluk.js, degisen.js, gozlem.js bağlaması).
   1) Makale yeniden üretimleri (Node, tarayıcı yok): Krisciunas & Schaefer 1991 Tablo 2 ve ΔV; Crumey 2014 denk. (73),
      M33 örneği (§3.1), çıplak göz sınırı 6,18; Hayes & Latham 1975 Rayleigh 0,1066.
   2) Gök parlaklığı ızgarası: Ataşehir / Şile / Kilyos / Tuz Gölü değerleri; pencere dışı null; kodlama.
   3) Arayüz: özet satırı, etiketler ve gerekçe kutusu, plan, elle SQM ve göz bebeği, Mira ölçümü, dürbün değişenleri,
      CSP ve kişisel veri sızıntısı. Ağ yok: VSX fixture'ları (gözlemci alanları silinmiş). */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { disAgiKes, celestrak, havaSessiz, vsxServisi, kok } = require('./yardim');
const G = require('../gorunurluk.js');

const META = JSON.parse(fs.readFileSync(path.join(kok, 'veri', 'gok_parlakligi.json'), 'utf8'));
const KOD = new Uint8Array(zlib.gunzipSync(fs.readFileSync(path.join(kok, 'veri', 'gok_parlakligi.u8.gz'))));
G.izgaraKur(META, KOD);

/* ---- 1) Makaleler ---- */
test('KS91 Tablo 2: k = 0,172, Z_m = 60°, dört evre açısı × beş ayrım — 20 değer de %1,5 içinde; ΔV(α=90, başucu) = −0,88', () => {
  /* Tablo 2 (makale s. 1038): B_moon nL; ρ Ay ile başucundan geçen büyük daire boyunca → Z = |60 − ρ| */
  const tablo = { 30: [7216, 1160, 530, 437, 818], 60: [3364, 541, 247, 204, 381], 90: [1351, 217, 99, 82, 153], 120: [391, 63, 29, 24, 44] };
  const rholar = [5, 30, 60, 90, 120];
  for (const a of [30, 60, 90, 120]) rholar.forEach((rho, i) => {
    const b = G.Bmoon(a, rho, 60, Math.abs(60 - rho), 0.172);
    expect(Math.abs(b / tablo[a][i] - 1), `α ${a} ρ ${rho}: ${b.toFixed(0)} ↔ ${tablo[a][i]}`).toBeLessThan(0.015);
  });
  /* Denk. (1): V = 21,587 → B_zen = 79,0 nL; (22): ΔV başucunda α = 90 → −0,88 (tablo parantezi) */
  expect(G.nL(21.587)).toBeCloseTo(79.0, 0);
  const b0 = G.B0(G.nL(21.587), 0, 0.172);
  expect(G.deltaV(G.Bmoon(90, 60, 60, 0, 0.172), b0)).toBeCloseTo(-0.88, 2);
  /* (1) tersi ve (3) */
  expect(G.nLKadir(G.nL(20))).toBeCloseTo(20, 6);
  expect(G.X(0)).toBeCloseTo(1, 9);
  expect(G.X(60)).toBeCloseTo(Math.pow(0.28, -0.5), 6);
  /* Ay ufkun altında: katkı 0 */
  expect(G.Bmoon(60, 40, 95, 30, 0.2)).toBe(0);
});

test('Crumey 2014: denk. (73) teleskop kesim sınırı 12,70; M33 örneği μ∞ 24,59, m0 6,59, μlim 22,43, mlim 5,93; çıplak göz 6,18; Ricco yarıçapı 37,6′', () => {
  /* (73): D = 100 mm, p = 7 mm, F_t = 1,33, F_T = √2, F = 2 → m_cut = 5 log D(cm) + 8,45 − 2,5 log F = 12,70 */
  const tel = { ad: 'teleskop', D: 0.1, M: 500, Ft: 1.33, FT: Math.SQRT2, FM: 1 };
  expect(G.esikler({ B: 2e-4, alet: tel, p: 7, F: 2 }).m0).toBeCloseTo(12.70, 2);
  /* §3.1 M33: μ_sky 21,83 (B = 2×10⁻⁴ cd/m²), F = 1,378 → eğriler teğet: yarıçap 18,7′, 22,43 kadir/yay sn², 5,93 kadir */
  const e = G.esikler({ B: 2e-4, alet: G.CIPLAK, p: 7, F: 1.378 });
  const alpha = Math.PI * 18.7 * 18.7;
  expect(e.muSonsuz).toBeCloseTo(24.59, 2);
  expect(e.m0).toBeCloseTo(6.59, 2);
  expect(G.yayginSinir(e, alpha)).toBeCloseTo(22.43, 1);
  expect(Math.abs(G.yayginKadirSinir(e, alpha) - 5.93)).toBeLessThan(0.02);
  expect(Math.sqrt(e.alphaTR / Math.PI)).toBeCloseTo(37.6, 1);
  /* Oran ≈ 1: hedefin yüzey parlaklığı eşiğe eşit → fark ≈ 0 (degerlendir ile) */
  const s = G.degerlendir({ ad: 'M33', kadir: 5.93, buyukEksen: 2 * 18.7, kucukEksen: 2 * 18.7 }, { Vzen: 21.83, Z: 0, k: 0, ay: null, p: 7, F: 1.378, alet: G.CIPLAK });
  expect(Math.abs(s.fark)).toBeLessThan(0.02);
  expect(Math.pow(10, -0.4 * s.fark)).toBeCloseTo(1, 1);
  /* Çıplak gözle 21,83 gökte F = 2 → 6,18 kadir (makale) */
  expect(G.esikler({ B: 2e-4, alet: G.CIPLAK, p: 7, F: 2 }).m0).toBeCloseTo(6.18, 2);
  /* Model sınırı: 3,426×10⁻² cd/m² üstü null */
  expect(G.esikler({ B: 0.05 })).toBeNull();
});

test('Sönümleme: HL75 Rayleigh 550 nm deniz düzeyinde 0,1066; ozon 0,016; aerosol 1,086 × AOD; AOD yoksa 0,30 (Schaefer 1990); göz bebeği Schaefer (5)', () => {
  expect(G.rayleigh(0.55, 0)).toBeCloseTo(0.1066, 4);
  expect(G.rayleigh(0.55, 7996)).toBeCloseTo(0.1066 / Math.E, 4);
  const s = G.sonumleme({ yukseklik: 0, aod: 0.2 });
  expect(s.kaynak).toBe('hesap');
  expect(s.k).toBeCloseTo(0.1066 + 0.016 + 0.2172, 3);
  expect(G.sonumleme({ yukseklik: 0 }).k).toBe(0.30);
  expect(G.gozBebegi(40)).toBeCloseTo(7 * Math.exp(-0.08), 4);
  expect(G.gozBebegi(0)).toBeCloseTo(7, 6);
  /* Unihedron dönüşümü: 22,0 kadir/yay sn² ↔ 174 µcd/m² (Falchi) 0,02 içinde */
  expect(G.toplamKadir(0)).toBeCloseTo(22.0, 1);
  expect(G.cddenKadir(G.kadirdenCd(19))).toBeCloseTo(19, 9);
});

/* ---- 2) Izgara ---- */
test('Gök parlaklığı ızgarası: Ataşehir ≈ 17,8, Şile ve Kilyos ≈ 19,9 (±0,5; ön bilgi), Tuz Gölü karanlık; pencere dışı null; kodlama', () => {
  expect(META.satir * META.sutun).toBe(KOD.length);
  expect(fs.statSync(path.join(kok, 'veri', 'gok_parlakligi.u8.gz')).size).toBeLessThan(40000);
  const at = G.gokParlakligi(40.9929379, 29.1135187);   // Ataşehir (Nominatim)
  const si = G.gokParlakligi(41.1744067, 29.6125216);   // Şile
  const ki = G.gokParlakligi(41.2453385, 29.0371037);   // Kilyos (Kumköy)
  const tz = G.gokParlakligi(38.8594356, 33.2915362);   // Tuz Gölü
  expect(Math.abs(at.kadir - 17.8)).toBeLessThan(0.2);
  expect(Math.abs(si.kadir - 19.9)).toBeLessThan(0.5);
  expect(Math.abs(ki.kadir - 19.9)).toBeLessThan(0.5);
  expect(tz.kadir).toBeGreaterThan(21.5);
  expect(tz.kadir).toBeLessThan(22.0);
  expect(at.Lart).toBeGreaterThan(si.Lart);
  expect(G.gokParlakligi(51.5, -0.1)).toBeNull();      // Londra: pencere dışı
  expect(G.gokParlakligi(35.4, 30)).toBeNull();        // güney sınırının altı
  /* kod 1 = yapay ışık yok; her kod artışı toplamda 0,1 kadir */
  expect(G.kodCoz(1, META)).toBeCloseTo(0, 9);
  expect(G.toplamKadir(G.kodCoz(2, META))).toBeCloseTo(G.toplamKadir(0) - 0.1, 6);
  expect(G.kodCoz(0, META)).toBeNull();
  /* Lisans dosyası iki DOI'yi ve CC BY-NC 4.0'ı anıyor */
  const lisans = fs.readFileSync(path.join(kok, 'veri', 'LICENSE-falchi-atlas.txt'), 'utf8');
  expect(lisans).toContain('10.5880/GFZ.1.4.2016.001');
  expect(lisans).toContain('10.1126/sciadv.1600377');
  expect(lisans).toContain('CC BY-NC 4.0');
});

test('Değerlendirme: parlak yıldız şehirde görünür, M33 Ataşehir göğünde görünmez; ufuk altı; Ay katkısı farkı küçültür', () => {
  const ortam = { Vzen: 17.9, Z: 30, k: 0.3, ay: null, p: 6.5, F: 2, alet: G.DURBUN };
  expect(G.degerlendir({ ad: 'Mizar', kadir: 2.22, nokta: true }, ortam).etiket).toBe('gorunur');
  expect(G.degerlendir({ ad: 'M33', kadir: 5.8, buyukEksen: 70, kucukEksen: 40 }, ortam).etiket).toBe('gorunmez');
  expect(G.degerlendir({ ad: 'x', kadir: 5 }, Object.assign({}, ortam, { Z: 95 })).etiket).toBe('ufuk');
  const aysiz = G.degerlendir({ ad: 'M13', kadir: 5.8, buyukEksen: 16.5, kucukEksen: 16.5 }, Object.assign({}, ortam, { Vzen: 21 }));
  const ayli = G.degerlendir({ ad: 'M13', kadir: 5.8, buyukEksen: 16.5, kucukEksen: 16.5 }, Object.assign({}, ortam, { Vzen: 21, ay: { alfa: 20, rho: 30, Zm: 40 } }));
  expect(ayli.fark).toBeLessThan(aysiz.fark);
  expect(ayli.gok.deltaV).toBeLessThan(-0.5);
  const g = G.gerekce(ayli, Object.assign({}, ortam, { Vzen: 21 }));
  expect(g.join(' ')).toMatch(/Ay .* kadir parlatıyor/);
  expect(g.join(' ')).toMatch(/Yükseklik 60°/);
});

/* ---- 3) Arayüz ---- */
const AN = new Date('2026-11-09T20:00:00+03:00');
async function kur(page, s = {}) {
  await disAgiKes(page);
  await celestrak(page);
  await havaSessiz(page);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: {} }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: [] }));
  await page.addInitScript(k => {
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify({ ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' }));
    localStorage.setItem('urania_gokKat', JSON.stringify({ hedef: true, degisen: true, olay: true }));
    if (k.sqm) localStorage.setItem('urania_sqmElle', String(k.sqm));
  }, s);
  await page.clock.install({ time: AN });
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) page.hatalar.push('konsol: ' + m.text()); });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkGokParlakligi')).toBeVisible();
}

test('Özet: başucu gök parlaklığı atlastan (Kadıköy) ve bu gecenin en sönük yıldızı; dürbün hedefleri ve planda etiket; gerekçe kutusu açılır', async ({ page }) => {
  await kur(page);
  const beklenen = G.gokParlakligi(40.99, 29.03).kadir;
  /* Izgara (26 KB gzip) ayrıca yüklenir: ilk çizimde kaydırıcıdan türetilmiş değer, yüklenince atlas değeri */
  await expect(page.locator('#gkGokParlakligi')).toContainText('yapay ışık modeli, 2014–2015 uydu verisi');
  const ozet = await page.locator('#gkGokParlakligi').innerText();
  expect(ozet).toContain('göğün tepesi yaklaşık ' + beklenen.toFixed(1).replace('.', ','));
  await expect(page.locator('#gkEnSonuk')).toContainText('Bu gece dürbünle görebileceğin en sönük yıldız yaklaşık');
  await expect(page.locator('#gkEnSonuk')).toContainText('çıplak gözle');
  /* Hedef listesi: her satırda etiket (yaklaşık) */
  const satirlar = page.locator('#gkHedef li');
  await expect(satirlar.first()).toBeVisible();
  const n = await satirlar.count();
  expect(n).toBeGreaterThan(3);
  const cipler = page.locator('#gkHedef li .gor-ac');
  expect(await cipler.count()).toBe(n);
  for (const t of await cipler.allInnerTexts()) expect(t).toMatch(/^(görünür|zor|görünmez) \(yaklaşık\)$/);
  /* Kadıköy göğünde (≈ 17,9) en az bir hedef görünür, en az biri görünmez */
  const metinler = await cipler.allInnerTexts();
  expect(metinler.some(t => /^görünür/.test(t))).toBe(true);
  expect(metinler.some(t => /^görünmez/.test(t))).toBe(true);
  /* Gerekçe: dokununca açılır; gök parlaklığı, Ay, yükseklik, eşik */
  const ilk = satirlar.first();
  await expect(ilk.locator('.gor-kutu')).toBeHidden();
  await ilk.locator('.gor-ac').click();
  await expect(ilk.locator('.gor-kutu')).toBeVisible();
  const k = await ilk.locator('.gor-kutu').innerText();
  expect(k).toMatch(/Gök parlaklığı: başucunda/);
  expect(k).toMatch(/Ay (katkısı yok|.*parlatıyor)/);
  expect(k).toMatch(/Yükseklik \d+°/);
  expect(k).toMatch(/eşik|en sönük yıldız/);
  expect(k).toMatch(/Yaklaşık/);
  expect(await ilk.locator('.gor-ac').getAttribute('aria-expanded')).toBe('true');
  await ilk.locator('.gor-ac').click();
  await expect(ilk.locator('.gor-kutu')).toBeHidden();
  /* Plan: hedef maddelerinde de etiket */
  await expect(page.locator('#gkPlan li').first()).not.toContainText('Hazırlanıyor');
  const planHedef = page.locator('#gkPlan li.plan-hedef');
  if (await planHedef.count()) expect(await planHedef.first().locator('.gor-ac').count()).toBe(1);
  expect(page.hatalar).toEqual([]);
});

test('Elle SQM ve göz bebeği: konum panelinden girilir, özet "elle girilen değer" der, saklanır; boş bırakınca atlasa döner', async ({ page }) => {
  await kur(page);
  await page.locator('#gkKonumDegis').click();
  await expect(page.locator('#gkKonumPanel')).toBeVisible();
  await page.locator('#gkSQM').fill('21,5');
  await page.locator('#gkGozBebegi').fill('5');
  await page.locator('#gkKKaydet').click();
  await expect(page.locator('#gkGokParlakligi')).toContainText('yaklaşık 21,5 kadir/yay sn² (elle girilen değer)');
  expect(await page.evaluate(() => [localStorage.getItem('urania_sqmElle'), localStorage.getItem('urania_gozBebegi')])).toEqual(['21.5', '5']);
  /* Karanlık gökte dürbün sınırı Kadıköy'den daha sönük */
  const sinir = (await page.locator('#gkEnSonuk').innerText()).match(/yaklaşık ([\d,]+) kadir/);
  expect(Number(sinir[1].replace(',', '.'))).toBeGreaterThan(9.5);
  /* Geçersiz değer (30) yok sayılır → atlas */
  await page.locator('#gkKonumDegis').click();
  await page.locator('#gkSQM').fill('30');
  await page.locator('#gkGozBebegi').fill('');
  await page.locator('#gkKKaydet').click();
  await expect(page.locator('#gkGokParlakligi')).toContainText('yapay ışık modeli');
  expect(await page.evaluate(() => localStorage.getItem('urania_sqmElle'))).toBeNull();
  expect(page.hatalar).toEqual([]);
});

test('Mira: yaklaşan olaylardaki tahmini en parlak satırının yanında AAVSO ölçümü (son 7 günün görsel ortancası ve sayısı); 12 saat önbellek', async ({ page }) => {
  await kur(page);
  const mira = page.locator('#gkOlay li', { hasText: 'Mira en parlak (tahmini)' }).first();
  await expect(mira).toBeVisible();
  await expect(mira).toContainText('AAVSO ölçümü: son 7 günde 8 görsel tahmin, ortanca 7,2 kadir');
  /* Fixture: 8 görsel tahmin; ortanca 7,2 (Degisen.ozetle ile aynı) */
  const fx = JSON.parse(fs.readFileSync(path.join(kok, 'testler', 'veri', 'vsx', 'Mira.json'), 'utf8'));
  const oz = await page.evaluate(j => Degisen.ozetle(j, 2461355), fx);
  expect(oz.sayi).toBe(8); expect(oz.ortanca).toBe(7.2);
  /* Önbellek: yalnız özet, gözlemci alanı yok; ikinci yükleme ağa çıkmaz */
  const depo = await page.evaluate(() => localStorage.getItem('urania_vsx1_Mira'));
  expect(depo).toBeTruthy();
  expect(depo).not.toMatch(/Obs(Code|Name|Country|Affil)|Comments/);
  const once = page.vsxIstekler.length;
  await page.reload();
  await expect(page.locator('#gkOlay li', { hasText: 'Mira en parlak (tahmini)' }).first()).toContainText('ortanca 7,2');
  expect(page.vsxIstekler.length).toBe(once);
  expect(page.hatalar).toEqual([]);
});

test('Dürbün değişenleri: liste bu gece 20° üstüne çıkanları gösterir; "Güncel parlaklıkları al" yalnız vsx.aavso.org\'a gider, ölçülen değer ve etiket gelir; kaynak satırında AAVSO atfı', async ({ page }) => {
  await kur(page);
  const ul = page.locator('#gkDegisen');
  await expect(ul.locator('li').first()).toBeVisible();
  const n = await ul.locator('li').count();
  expect(n).toBeGreaterThan(5);
  await expect(ul.locator('li', { hasText: 'EG And' })).toHaveCount(1);
  await expect(ul.locator('li', { hasText: 'EG And' })).toContainText('ölçülen: —');
  await expect(page.locator('#gkOzet_degisen')).toContainText('değişen yıldız karanlıkta 20°');
  await page.locator('#gkDegisenAl').click();
  await expect(page.locator('#gkDegisenDurum')).toContainText(/Güncellendi|ulaşılamadı/, { timeout: 60000 });
  const eg = ul.locator('li', { hasText: 'EG And' });
  await expect(eg).toContainText('ölçülen 7,2 kadir (3 görsel tahmin, son 7 gün)');
  await expect(eg.locator('.gor-ac')).toHaveText(/^(görünür|zor|görünmez) \(yaklaşık\)$/);
  await expect(ul.locator('li', { hasText: 'UU Aur' })).toContainText('1 görsel tahmin');
  /* yalnız vsx.aavso.org; www.aavso.org asla */
  expect(page.vsxIstekler.length).toBeGreaterThan(1);
  page.vsxIstekler.forEach(u => { expect(new URL(u).hostname).toBe('vsx.aavso.org'); expect(u).not.toMatch(/@/); });
  await expect(page.locator('#gkDegisenKaynak')).toContainText('We gratefully acknowledge the contributions of the AAVSO observer community');
  await expect(page.locator('#gkDegisenKaynak')).toContainText('Watson, C. L., Henden, A. A., and Price, A.');
  /* Depoda gözlemci bilgisi yok */
  const anahtarlar = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('urania_vsx1_')).map(k => localStorage.getItem(k)).join('\n'));
  expect(anahtarlar).not.toMatch(/Obs(Code|Name|Country|Affil)|Comments|Charts/);
  expect(page.hatalar).toEqual([]);
});

test('Gizlilik ve CSP: fixture dosyalarında gözlemci alanı yok; CSP connect-src yalnız vsx.aavso.org eklendi; veri dosyaları ve lisans notları', async ({ page }) => {
  const kl = path.join(kok, 'testler', 'veri', 'vsx');
  for (const f of fs.readdirSync(kl)) expect(fs.readFileSync(path.join(kl, f), 'utf8'), f).not.toMatch(/"(ObsCode|ObsName|ObsCountry|ObsAffil|Comments|Charts|CMag|KMag)"/);
  const html = fs.readFileSync(path.join(kok, 'index.html'), 'utf8');
  const csp = html.match(/connect-src ([^;]+);/)[1];
  expect(csp).toContain('https://vsx.aavso.org');
  expect(csp).not.toMatch(/www\.aavso\.org|mintaka/);
  const d = JSON.parse(fs.readFileSync(path.join(kok, 'veri', 'durbun_degisenleri.json'), 'utf8'));
  expect(d.yildizlar.length).toBeGreaterThan(100);
  expect(d.yildizlar.every(y => y.dec > -30 && Number.isFinite(y.ra))).toBe(true);
  expect(JSON.stringify(d)).not.toMatch(/Obs(Code|Name|Country)/);
  const b = JSON.parse(fs.readFileSync(path.join(kok, 'veri', 'hedef_boyut.json'), 'utf8'));
  expect(b.hedefler.length).toBe(26);
  expect(b.lisans).toContain('CC BY-SA 4.0');
  expect(b.hedefler.find(h => h.id === 'M31').buyukEksen).toBeCloseTo(177.83, 2);
  expect(b.hedefler.filter(h => h.noktaKaynak).map(h => h.id).sort()).toEqual(['Albireo', 'Alcor', 'Mizar']);
  /* sw.js: yeni dosyalar önbellekte, sürüm v45 */
  const sw = fs.readFileSync(path.join(kok, 'sw.js'), 'utf8');
  expect(sw).toContain("const SURUM = 'urania-v45'");
  for (const f of ['./gorunurluk.js', './degisen.js', './veri/gok_parlakligi.u8.gz', './veri/gok_parlakligi.json', './veri/hedef_boyut.json', './veri/durbun_degisenleri.json']) expect(sw).toContain(`'${f}'`);
  /* Elle girilen SQM başlangıçta varsa ilk çizimden itibaren "elle" (atlas beklenmez) */
  await kur(page, { sqm: 20.5 });
  await expect(page.locator('#gkGokParlakligi')).toContainText('yaklaşık 20,5 kadir/yay sn² (elle girilen değer)');
  expect(page.hatalar).toEqual([]);
});
