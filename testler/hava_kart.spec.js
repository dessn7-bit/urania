'use strict';
/* v44 hava kartları: EUMETSAT uydu görüntüsü + bulut maskesi rozeti, Open-Meteo Ensemble (tahmin güveni) ve tek modeller,
   CAMS aerosol (şeffaflık), çiğ / hissedilen / sis, NOAA SWPC Kp uyarısı, Plan'da 7 gece şeridi.
   Ağa çıkılmaz: bütün yanıtlar testler/veri/hava/ altındaki GERÇEK yanıtlardır (2026-11-08/09 kaydı; ayrıntı README_hava.md).
   Yalnız uyarı eşiğini sınayan iki test (Kp ≥ 8, sis) gerçek yanıtın bir alanını değiştirir; bu açıkça yazılıdır. */
const { test, expect } = require('@playwright/test');
const { celestrak, havaServisleri, HAVA_FIX } = require('./yardim');
const fs = require('fs');
const path = require('path');

const { oku, json, ENS, MDL, AQ, KP } = HAVA_FIX;
const SABIT_AN = HAVA_FIX.AN;

const servisler = havaServisleri;

test.beforeEach(async ({ page }) => {
  await celestrak(page, { hata: 503 });
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  await page.clock.install({ time: SABIT_AN });
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test('Uydu kartı: İstanbul ortada, görüntü saati, gecikme notu, rozet ve EUMETSAT kaynak satırı', async ({ page }) => {
  await servisler(page);
  await page.goto('/index.html#gok');
  const k = page.locator('#gkUydu');
  await expect(k).toBeVisible();
  await expect(k.locator('#gkUyduImg')).toHaveAttribute('src', /^blob:/);
  /* GetCapabilities en son zaman 18:40 UT = 21.40 TSİ */
  await expect(k.locator('figcaption')).toContainText('Görüntü saati 21.40');
  await expect(k.locator('figcaption')).toContainText('20–30 dakika gecikmeli');
  /* GetFeatureInfo (0,192,0) = karada açık */
  await expect(k.locator('#gkUyduRozet')).toHaveText('Şu an üstünde: açık');
  await expect(k.locator('.kaynak')).toContainText('EUMETSAT Meteosat verisi içerir, 2026');
  await expect(k.locator('.kaynak')).toContainText('CC BY 4.0');
  /* İstekler: time= var, koordinat iki ondalık, kutu konumu ortalıyor */
  const harita = page.istekler.filter(u => /request=GetMap/.test(u));
  expect(harita.length).toBeGreaterThan(0);
  const q = new URL(harita[0]).searchParams;
  expect(q.get('time')).toBe('2026-11-08T18:40:00Z');
  expect(q.get('layers')).toContain('backgrounds:ne_10m_coastline');
  const [g, b, kz, d] = q.get('bbox').split(',').map(Number);
  expect((g + kz) / 2).toBeCloseTo(41.0, 2);
  expect((b + d) / 2).toBeCloseTo(29.1, 2);
  q.get('bbox').split(',').forEach(x => expect(x).toMatch(/^-?\d+\.\d{2}$/));
  const gfi = new URL(page.istekler.find(u => /GetFeatureInfo/.test(u))).searchParams;
  expect(gfi.get('time')).toBe('2026-11-08T18:30:00Z');
});

test('Uydu kartı: bulut maskesi beyaz → "bulutlu"; katman düğmeleri; kızılötesi açıklaması', async ({ page }) => {
  await servisler(page, { maske: { type: 'FeatureCollection', features: [{ properties: { RED_BAND: 255, GREEN_BAND: 255, BLUE_BAND: 255 } }] } });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkUyduRozet')).toHaveText('Şu an üstünde: bulutlu');
  await page.click('[data-uydu="kizilotesi"]');
  await expect(page.locator('#gkUydu .hk-lejant')).toContainText('bulut tepeleri yerden ve denizden soğuktur ve bu görüntüde soğuk olan açık renkte çizilir; geceleri bulutlar beyaz');
  await expect(page.locator('[data-uydu="kizilotesi"]')).toHaveAttribute('aria-pressed', 'true');
  await page.click('[data-uydu="maske"]');
  await expect(page.locator('#gkUydu .hk-lejant')).toContainText('Mavi: denizde açık gök · Yeşil: karada açık gök · Beyaz: bulut');
  expect(page.istekler.some(u => /layers=msg_fes:clm,backgrounds/.test(u))).toBe(true);
});

test('Uydu servisi yanıt vermezse kart sessizce gizlenir; gece kararı ve öteki kartlar çalışır', async ({ page }) => {
  await servisler(page, { uyduHata: true });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkGuven')).toBeVisible();
  await expect(page.locator('#gkUydu')).toBeHidden();
  await expect(page.locator('#gkKarar')).toContainText('Bu gece gözlem');
});

test('Çevrimdışı: son uydu görüntüsü "şu saatteki veri" etiketiyle gösterilir', async ({ page }) => {
  await servisler(page);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkUyduImg')).toHaveAttribute('src', /^blob:/);
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  await page.clock.fastForward(20 * 60e3);
  await page.reload();
  await expect(page.locator('#gkUydu figcaption')).toContainText("Çevrimdışı: 21.40'taki veri");
  await expect(page.locator('#gkUyduImg')).toHaveAttribute('src', /^blob:/);
});

test('Uydu görüntüsü tarayıcı önbelleğine yazılmaz (cache: no-store); sw.js dış kökeni önbelleğe almaz', async ({ page }) => {
  await servisler(page);
  const secenek = [];
  await page.addInitScript(() => { const f = window.fetch; window.__fetchSecenek = []; window.fetch = (u, o) => { window.__fetchSecenek.push([String(u), o && o.cache]); return f(u, o); }; });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkUyduImg')).toBeVisible();
  const ls = await page.evaluate(() => window.__fetchSecenek.filter(x => /GetMap/.test(x[0])));
  expect(ls.length).toBeGreaterThan(0);
  ls.forEach(x => expect(x[1]).toBe('no-store'));
  const sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
  expect(sw).toMatch(/if \(!ayni\) return;/);
  expect(secenek).toEqual([]);
});

test('Tahmin güveni: senaryo sayısı fixture üzerinden elle yapılan hesapla aynı', async ({ page }) => {
  await servisler(page);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkGuven')).toBeVisible();
  const j = json(ENS);
  const h = j.hourly;
  const anahtar = Object.keys(h).filter(k => k.startsWith('cloud_cover'));
  /* Elle: her listelenen saat için bulutu %30'un altında olan senaryo sayısı */
  const satirlar = await page.locator('.hk-ens li').evaluateAll(ls => ls.map(l => ({ t: l.dataset.saat, acik: +l.dataset.acik, toplam: +l.dataset.toplam })));
  expect(satirlar.length).toBeGreaterThan(5);
  for (const s of satirlar) {
    const i = h.time.indexOf(Date.parse(s.t) / 1000);
    expect(i).toBeGreaterThanOrEqual(0);
    const degerler = anahtar.map(a => h[a][i]).filter(v => v != null);
    expect(s.toplam).toBe(degerler.length);
    expect(s.acik).toBe(degerler.filter(v => v < 30).length);
  }
  /* Beş model, toplam senaryo sayısı belgedeki üyelerle (51 + 40 + 31 + 21 + 18 = 161) */
  expect(satirlar[0].toplam).toBe(161);
  await expect(page.locator('#gkGuvenOzet')).toContainText('senaryodan');
  await expect(page.locator('#gkGuven .kaynak a')).toHaveAttribute('href', 'https://open-meteo.com/');
  await expect(page.locator('#gkGuven .kaynak a')).toHaveText('Hava verisi: Open-Meteo.com');
});

test('Tahmin güveni: modeller tek tek, fixture değerleriyle', async ({ page }) => {
  await servisler(page);
  await page.goto('/index.html#gok');
  const tablo = page.locator('#gkGuven .hk-model');
  await expect(tablo).toBeVisible();
  const h = json(MDL).hourly;
  const basliklar = await tablo.locator('thead th').allTextContents();
  const satirlar = await tablo.locator('tbody tr').evaluateAll(ls => ls.map(l => ({ m: l.dataset.model, d: [...l.querySelectorAll('td')].map(x => x.textContent) })));
  expect(satirlar.map(s => s.m)).toEqual(expect.arrayContaining(['ecmwf_ifs025', 'ncep_gfs_seamless']));
  for (const s of satirlar) {
    basliklar.slice(1).forEach((saat, k) => {
      const [sa, dk] = saat.split('.').map(Number);
      /* tablo saati TSİ; 8→9 Kasım gecesi: 12.00'den küçükse 9 Kasım */
      const gun = sa < 12 ? '2026-11-09' : '2026-11-08';
      const t = Date.parse(`${gun}T${String(sa).padStart(2, '0')}:${String(dk).padStart(2, '0')}:00+03:00`) / 1000;
      const v = h['cloud_cover_' + s.m][h.time.indexOf(t)];
      expect(s.d[k]).toBe(v == null ? '—' : '%' + Math.round(v));
    });
  }
});

test('Ensemble yanıt vermezse güven kartının senaryo bölümü yok; uygulama çökmez', async ({ page }) => {
  await servisler(page, { ensHata: true });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkGuven .hk-model')).toBeVisible();
  await expect(page.locator('#gkGuven .hk-ens')).toHaveCount(0);
});

test('Şeffaflık: AOD → kadir dönüşümü (1,086 × AOD) gece ortalamasıyla; CAMS kaynak satırı', async ({ page }) => {
  await servisler(page);
  await page.goto('/index.html#gok');
  const s = page.locator('#gkSeffaflik');
  await expect(s).toBeVisible();
  const g = await page.evaluate(() => { const k = Urania.konum(); const gg = Gok.geceAraligi(new Date(), Gok.gozlemci(k.enlem, k.boylam, 0)); return [gg.geceBas.getTime(), gg.geceSon.getTime()]; });
  const h = json(AQ).hourly;
  const ls = h.time.map((t, i) => [t * 1000, h.aerosol_optical_depth[i]]).filter(([t, a]) => a != null && t >= g[0] - 30 * 60e3 && t <= g[1] + 30 * 60e3).map(x => x[1]);
  const ort = ls.reduce((a, b) => a + b, 0) / ls.length;
  const kadir = 2.5 * Math.log10(Math.E) * ort;
  expect(2.5 * Math.log10(Math.E)).toBeCloseTo(1.086, 3);
  await expect(s).toContainText(`yaklaşık ${kadir.toFixed(2).replace('.', ',')} kadir sönük`);
  await expect(page.locator('#gkSeffaf .kaynak')).toContainText('Generated using Copernicus Atmosphere Monitoring Service information 2026');
  await expect(page.locator('#gkSeffaf .kaynak a')).toHaveText('Hava verisi: Open-Meteo.com');
});

test('Çiğ: sıcaklık − çiy noktası ≤ 2 °C ve gök açıkken "dürbün camı buğulanabilir", yaklaşık kural ve rüzgâr değeri', async ({ page }) => {
  /* Gerçek yanıtın çiy noktası alanı sıcaklığa 1,5 °C yaklaştırıldı ve bulut 10'a indirildi (eşik sınaması) */
  await servisler(page, { hava: j => { const h = j.hourly; h.dew_point_2m = h.temperature_2m.map(t => (t == null ? null : t - 1.5)); h.cloud_cover = h.cloud_cover.map(() => 10); return j; } });
  await page.goto('/index.html#gok');
  const c = page.locator('#gkCig');
  await expect(c).toContainText('Dürbün camı buğulanabilir');
  await expect(c).toContainText('Yaklaşık kural');
  await expect(c).toContainText('km/sa');
  await expect(c).toContainText('kaynaklı bir sayısal eşik bulunamadı');
});

test('Sis: görüş 1 km altı "sis", 1–5 km "pus" (WMO); hissedilen sıcaklık ve hamle', async ({ page }) => {
  await servisler(page, { hava: j => { j.hourly.visibility = j.hourly.visibility.map(() => 600); return j; } });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkSis')).toContainText('Sis bekleniyor');
  await expect(page.locator('#gkSis')).toContainText("WMO: görüş 1 km'nin altında sis; 1–5 km pus.");
  await expect(page.locator('#gkHissedilen')).toContainText('gibi hissedilecek');
  await expect(page.locator('#gkHissedilen')).toContainText('Rüzgâr hamlesi');
  const H = await page.evaluate(() => [HavaKart.hesap.sisDurumu(999), HavaKart.hesap.sisDurumu(1000), HavaKart.hesap.sisDurumu(5000), HavaKart.hesap.sisDurumu(5001)]);
  expect(H).toEqual(['sis', 'pus', 'pus', null]);
});

test('Kutup ışığı: gerçek Kp tahmininde (en çok < 8) uyarı yok; Kp ≥ 8 tahmininde uyarı ve NOAA notu', async ({ page }) => {
  await servisler(page);
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkGuven')).toBeVisible();
  await expect(page.locator('#gkKp')).toBeHidden();
  const en = Math.max(...json(KP).filter(x => Date.parse(x.time_tag + 'Z') > SABIT_AN.getTime() - 3 * 3600e3 && Date.parse(x.time_tag + 'Z') <= SABIT_AN.getTime() + 72 * 3600e3).map(x => x.kp));
  expect(en).toBeLessThan(8);
});
test('Kutup ışığı: Kp 8,33 tahmini → "Bu gece" bölümünde uyarı', async ({ page }) => {
  /* gerçek yanıtta yarınki bir "predicted" değer 8,33 yapıldı */
  await servisler(page, { kp: j => { const i = j.findIndex(x => x.observed === 'predicted' && x.time_tag >= '2026-11-09T21'); j[i].kp = 8.33; return j; } });
  await page.goto('/index.html#gok');
  const k = page.locator('#gkKp');
  await expect(k).toBeVisible();
  await expect(k).toContainText("Kuzey ufkunda, şehir ışıklarından uzakta, telefon kamerasıyla bakmaya değer; İstanbul'dan çok nadir görülür.");
  await expect(k).toContainText('NOAA');
  await expect(k).toContainText('Kp 8,3');
});

test('Plan: 7 gecelik şerit, her gece iyi / idare eder / kötü ve nedeni', async ({ page }) => {
  await servisler(page);
  await page.goto('/index.html#gok');
  const li = page.locator('#gkYediGece li');
  await expect(li).toHaveCount(7);
  await expect(li.first()).toContainText('Bu gece');
  const ad = await li.locator('.yg-et').allTextContents();
  ad.forEach(a => expect(['iyi', 'idare eder', 'kötü']).toContain(a));
  const neden = await li.locator('.yg-neden').allTextContents();
  neden.forEach(n => expect(n.length).toBeGreaterThan(3));
  /* forecast_days=7 */
  expect(page.istekler.some(u => /api\.open-meteo\.com\/v1\/forecast\?.*forecast_days=7/.test(u) && !/models=/.test(u))).toBe(true);
});

test('Bütün dış istekler: koordinat iki ondalık, yalnız izinli alan adları, CSP ihlali yok', async ({ page }) => {
  await servisler(page);
  await page.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.blockedURI), true); });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkSeffaflik')).toBeVisible();
  await expect(page.locator('#gkUyduImg')).toBeVisible();
  expect(await page.evaluate(() => window.__csp)).toEqual([]);
  const izinli = ['view.eumetsat.int', 'api.open-meteo.com', 'ensemble-api.open-meteo.com', 'air-quality-api.open-meteo.com', 'services.swpc.noaa.gov', 'celestrak.org', 'nominatim.openstreetmap.org'];
  page.istekler.forEach(u => {
    const x = new URL(u);
    expect(izinli).toContain(x.hostname);
    ['latitude', 'longitude'].forEach(p => { const v = x.searchParams.get(p); if (v != null) expect(v).toMatch(/^-?\d+\.\d{2}$/); });
    /* istek başlığında e-posta / kişisel veri yok: URL'de @ işareti yok */
    expect(u).not.toMatch(/@/);
  });
  /* CSP yalnız gereken alan adlarını içerir */
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain('https://view.eumetsat.int');
  expect(csp).toContain('https://ensemble-api.open-meteo.com');
  expect(csp).toContain('https://air-quality-api.open-meteo.com');
  expect(csp).toContain('https://services.swpc.noaa.gov');
  expect(csp).toMatch(/img-src 'self' data: blob:;/);
});

test('Bütün servisler kapalı: kartlar gizli, sayfa hatasız', async ({ page }) => {
  await servisler(page, { uyduHata: true, ensHata: true, aqHata: true, havaHata: true, kpHata: true });
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkHava')).toContainText('alınamadı');
  for (const id of ['#gkUydu', '#gkGuven', '#gkSeffaf', '#gkKp', '#gkYediGece']) await expect(page.locator(id)).toBeHidden();
});

test('Saf hesaplar: maske lejantı, AOD, Kp, ek', async ({ page }) => {
  await servisler(page);
  await page.goto('/index.html#gok');
  const r = await page.evaluate(() => {
    const H = HavaKart.hesap;
    const m = (r, g, b) => H.maskeSinif({ features: [{ properties: { RED_BAND: r, GREEN_BAND: g, BLUE_BAND: b } }] });
    return {
      maske: [m(0, 0, 255), m(0, 192, 0), m(255, 255, 255), m(0, 0, 0)],
      aod: H.aodKadir(0.2),
      kp: H.kpUyari([{ time_tag: '2026-11-09T00:00:00', kp: 8.0, observed: 'predicted' }], new Date('2026-11-08T18:00:00Z')).uyari,
      kp2: H.kpUyari([{ time_tag: '2026-11-12T00:00:00', kp: 9.0, observed: 'predicted' }], new Date('2026-11-08T18:00:00Z')).uyari,
      ek: [40, 3, 1, 6, 2, 100, 0, 161, 122].map(n => n + "'" + H.ekI(n))
    };
  });
  expect(r.maske).toEqual(['acik-deniz', 'acik-kara', 'bulut', null]);
  expect(r.aod).toBeCloseTo(0.21715, 4);   // 2,5 × log10(e) × 0,2
  expect(r.kp).toBe(true);
  expect(r.kp2).toBe(false);   // 72 saatin dışında
  expect(r.ek).toEqual(["40'ı", "3'ü", "1'i", "6'yı", "2'yi", "100'ü", "0'ı", "161'i", "122'yi"]);
});
