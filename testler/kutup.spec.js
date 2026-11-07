'use strict';
/* Yüksek enlem: kutup gecesi, kutup günü ve ara durumlar (denetim 2026-10-30 alan 1: A1-01, A1-02, A1-04, A1-05).
   Beklenen değerler gok.js'ten değil, Astronomy Engine'in (node_modules/astronomy-engine) Güneş yüksekliğinden
   bağımsız olarak çıkarılır: geceAraligi'nin "öğle"sinden ertesi öğleye 5 dakika adımla kırılmasız yükseklik
   (gok.js'in kullandığı SearchAltitude ile aynı ölçü). Kural açık:
   - Güneş gün boyu −6°'nin ÜSTÜNDE → karanlık yok (kutup günü, beyaz gece);
   - −6°'nin altına iniyorsa karanlık var; inilen en derin eşik (−18 → 'astro', −12 → 'denizci', −6 → 'sivil')
     karanlık penceresini verir; Güneş gün boyu o eşiğin altındaysa pencere bütün gündür (kutup gecesi);
   - batış/doğuş hiç yoksa: öğlede Güneş ufkun üstünde → kutup günü, altında → kutup gecesi.
   Yerler: Longyearbyen (78,2 K 15,6 D), Tromsø (69,6 K 18,9 D), Oslo (59,9 K 10,7 D), 52 K 0 D, kuzey kutbuna
   yakın (89,9 K), İstanbul (41,0 K 29,1 D). */
const { test, expect } = require('@playwright/test');
const AE = require('astronomy-engine');
const G = require('../gok.js');

const YER = {
  longyearbyen: { enlem: 78.2, boylam: 15.6, tz: 'Arctic/Longyearbyen', ad: 'Longyearbyen' },
  tromso: { enlem: 69.6, boylam: 18.9, tz: 'Europe/Oslo', ad: 'Tromsø' },
  oslo: { enlem: 59.9, boylam: 10.7, tz: 'Europe/Oslo', ad: 'Oslo' },
  k52: { enlem: 52.0, boylam: 0, tz: 'Europe/London', ad: '52 K' },
  kutup: { enlem: 89.9, boylam: 0, tz: 'UTC', ad: 'Kutup' },
  istanbul: { enlem: 41.0, boylam: 29.1, tz: 'Europe/Istanbul', ad: 'İstanbul' }
};

/* Bağımsız örnekleme: [bas, son] aralığında 5 dk adımla Güneş'in kırılmasız yüksekliği */
function gunesOrnek(gzl, bas, son) {
  const gz = new AE.Observer(gzl.latitude, gzl.longitude, gzl.height);
  const ls = [];
  for (let t = bas.getTime(); t <= son.getTime(); t += 5 * 60e3) {
    const d = new Date(t), e = AE.Equator(AE.Body.Sun, d, gz, true, true);
    ls.push({ t, alt: AE.Horizon(d, gz, e.ra, e.dec).altitude });
  }
  return ls;
}
function beklenen(ls) {
  const min = Math.min(...ls.map(x => x.alt)), max = Math.max(...ls.map(x => x.alt));
  const esik = [-18, -12, -6].find(e => min < e);
  const duzey = { '-18': 'astro', '-12': 'denizci', '-6': 'sivil' }[esik] || null;
  const alti = esik == null ? [] : ls.filter(x => x.alt < esik);
  return { min, max, duzey, karanlikYok: min >= -6, tumGun: esik != null && max < esik,
    bas: alti.length ? alti[0].t : null, son: alti.length ? alti[alti.length - 1].t : null,
    kutupGunu: min > 0, kutupGecesi: max < -0.9 };
}
function denetle(yer, an) {
  const gzl = G.gozlemci(yer.enlem, yer.boylam, 0);
  const g = G.geceAraligi(new Date(an), gzl);
  const ls = gunesOrnek(gzl, g.ogle, new Date(g.ogle.getTime() + 86400e3));
  const b = beklenen(ls);
  /* gok.js üst/alt geçişten tam değeri bulur; 5 dk örnekleme tepeyi en çok birkaç yüzde bir derece kaçırır */
  expect(g.gunesEnYuksek - b.max, 'en yüksek').toBeGreaterThan(-0.01); expect(g.gunesEnYuksek - b.max, 'en yüksek').toBeLessThan(0.1);
  expect(b.min - g.gunesEnAlcak, 'en alçak').toBeGreaterThan(-0.01); expect(b.min - g.gunesEnAlcak, 'en alçak').toBeLessThan(0.1);
  expect(g.karanlikYok, 'karanlık yok').toBe(b.karanlikYok);
  expect(g.karanlikDuzey, 'karanlık düzeyi').toBe(b.duzey);
  expect(g.karanlikTumGun, 'bütün gün').toBe(b.tumGun);
  if (b.duzey) {
    /* Pencere sınırları örneklemeyle 5 dk içinde (eşiğin altındaki ilk ve son örnek) */
    expect(Math.abs(g.karanlikBas.getTime() - b.bas) / 60e3, 'karanlık başı (dk)').toBeLessThanOrEqual(5);
    expect(Math.abs(g.karanlikSon.getTime() - b.son) / 60e3, 'karanlık sonu (dk)').toBeLessThanOrEqual(5);
  }
  if (b.kutupGunu) expect(g.kutupGunu).toBe(true);
  if (b.kutupGecesi) expect(g.kutupGecesi).toBe(true);
  return { g, b, gzl };
}

test.describe('geceAraligi: Astronomy Engine örneklemesiyle', () => {
  test('Longyearbyen 21 Aralık 2026: kutup gecesi, gece bütün gün; karanlık VAR, tam karanlık akşamdan sabaha', () => {
    const { g, b, gzl } = denetle(YER.longyearbyen, '2026-12-21T15:00:00Z');
    expect(b.max).toBeLessThan(-6);                       // Güneş gün boyu −6°'nin altında: −6° geçişi yok
    expect(g.sivilSon).toBeNull();                       // eski hatanın kaynağı (A1-01: karanlikYok = !sivilSon)
    expect(g.karanlikYok).toBe(false);
    expect(g.kutupGecesi).toBe(true);
    expect(g.karanlikDuzey).toBe('astro');
    /* Gece (Güneş −6°'nin altında) bütün gün: gezegenler ve bulut tahmini için pencere öğleden öğleye */
    expect(g.geceBas.getTime()).toBe(g.ogle.getTime());
    expect(g.geceSon.getTime()).toBe(g.ogle.getTime() + 86400e3);
    /* Dürbün hedefleri elenmez; radyant/karanlık örneklemesi boş değil */
    const hed = G.hedeflerBuGece(require('../veri/hedefler.json').hedefler, gzl, g, g.karanlikBas);
    expect(hed.filter(h => h.gorunur).length).toBeGreaterThan(5);
    const gez = G.gezegenlerBuGece(g.karanlikBas, gzl, g);
    expect(gez.some(p => p.gorunur)).toBe(true);
  });

  test('Longyearbyen 21 Haziran 2026: kutup günü, karanlık gerçekten yok', () => {
    const { g, b, gzl } = denetle(YER.longyearbyen, '2026-06-21T12:00:00Z');
    expect(b.min).toBeGreaterThan(0);
    expect(g.karanlikYok).toBe(true);
    expect(g.kutupGunu).toBe(true);
    expect(g.kutupGecesi).toBe(false);
    expect(g.karanlikDuzey).toBeNull();
    expect(g.geceBas).toBeNull();
    const hed = G.hedeflerBuGece(require('../veri/hedefler.json').hedefler, gzl, g, new Date('2026-06-21T22:00:00Z'));
    expect(hed.filter(h => h.gorunur).length).toBe(0);
  });

  test('Tromsø 21 Aralık 2026: Güneş doğmuyor, öğlede alacakaranlık, akşamdan sabaha tam karanlık', () => {
    const { g, b } = denetle(YER.tromso, '2026-12-21T15:00:00Z');
    expect(b.max).toBeLessThan(0); expect(b.max).toBeGreaterThan(-6);
    expect(g.batis).toBeNull();
    expect(g.kutupGecesi).toBe(true);
    expect(g.karanlikDuzey).toBe('astro');
    expect(g.karanlikTumGun).toBe(false);
    expect(g.tamKaranlikBas.getTime()).toBe(g.karanlikBas.getTime());
  });

  test('Tromsø 21 Haziran 2026: kutup günü', () => {
    const { g } = denetle(YER.tromso, '2026-06-21T12:00:00Z');
    expect(g.kutupGunu).toBe(true); expect(g.karanlikYok).toBe(true);
  });

  test('Ara durum: Güneş batıyor, −6°\'ye iniyor ama −12°\'ye inmiyor (Oslo, 21 Haziran) → sivil pencere, tam karanlık yok', () => {
    const { g, b } = denetle(YER.oslo, '2026-06-21T12:00:00Z');
    expect(b.min).toBeLessThan(-6); expect(b.min).toBeGreaterThan(-12);
    expect(g.batis).not.toBeNull();
    expect(g.karanlikDuzey).toBe('sivil');
    expect(g.karanlikYok).toBe(false);
    expect(g.tamKaranlikBas).toBeNull();
  });

  test('Ara durum: Güneş −12°\'ye iniyor ama −18°\'ye inmiyor (52 K 0 D, 21 Haziran) → denizci pencere', () => {
    const { g, b } = denetle(YER.k52, '2026-06-21T12:00:00Z');
    expect(b.min).toBeLessThan(-12); expect(b.min).toBeGreaterThan(-18);
    expect(g.karanlikDuzey).toBe('denizci');
    expect(g.tamKaranlikBas).toBeNull();
  });

  test('Kutba çok yakın (89,9 K) 21 Aralık: tam karanlık bütün gün', () => {
    const { g, b } = denetle(YER.kutup, '2026-12-21T12:00:00Z');
    expect(b.max).toBeLessThan(-18);
    expect(g.karanlikTumGun).toBe(true);
    expect(g.karanlikDuzey).toBe('astro');
    expect(g.karanlikSon.getTime() - g.karanlikBas.getTime()).toBe(86400e3);
  });

  test('Orta enlemde değişiklik yok: İstanbul 30 Ekim 2026 (pencere = astronomik alacakaranlık sonu–başı)', () => {
    const { g } = denetle(YER.istanbul, '2026-10-30T15:00:00Z');
    expect(g.karanlikBas.getTime()).toBe(g.astroSon.getTime());
    expect(g.karanlikSon.getTime()).toBe(g.astroBas.getTime());
    expect(g.geceBas.getTime()).toBe(g.sivilSon.getTime());
    expect(g.geceSon.getTime()).toBe(g.sivilBas.getTime());
    expect(g.kutupGunu || g.kutupGecesi).toBe(false);
  });
});

/* ---- Arayüz: karar satırı, Güneş satırı, dürbün hedefleri, gezegen satırı ---- */
test.describe('Arayüz', () => {
  const { celestrak, disAgiKes } = require('./yardim');
  test.beforeEach(async ({ page }) => {
    page.hatalar = [];
    page.on('pageerror', e => page.hatalar.push(String(e)));
    await disAgiKes(page);
    await celestrak(page);
    await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [] } } }));
    await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
  });
  test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

  async function ac(page, yer, an) {
    await page.clock.install({ time: new Date(an) });
    await page.addInitScript(k => { localStorage.setItem('urania_konumOto', 'false'); localStorage.setItem('urania_konum', JSON.stringify(k)); },
      { ad: yer.ad, enlem: yer.enlem, boylam: yer.boylam, yukseklik: 0, oto: false, saatDilimi: yer.tz });
    await page.goto('/index.html#gok');
    await expect(page.locator('#gkKarar')).toContainText('Bu gece', { timeout: 20000 });
    await expect(page.locator('#gkKarar')).not.toContainText('bekleniyor', { timeout: 20000 });
  }

  test('Longyearbyen Aralık: "karanlık yok" denmez, hedefler listelenir, Güneş satırı tam karanlığı verir (A1-01, A1-04)', async ({ page }) => {
    await ac(page, YER.longyearbyen, '2026-12-21T19:00:00Z');
    await expect(page.locator('#gkHedef')).not.toContainText('kararmıyor');
    expect(await page.locator('#gkHedef li .bos').count()).toBe(0);
    await expect(page.locator('#gkKarar')).not.toContainText('tam karanlık yok');
    await expect(page.locator('#gkOzet')).toContainText('kutup gecesi');
    await expect(page.locator('#gkOzet')).toContainText('tam karanlık');
  });

  test('Tromsø Aralık: tam karanlık var, karar "tam karanlık yok" demez (A1-02); gezegen satırı ayraçla bitmez (A1-05)', async ({ page }) => {
    await ac(page, YER.tromso, '2026-12-21T15:00:00Z');
    await expect(page.locator('#gkKarar')).not.toContainText('tam karanlık yok');
    const metinler = await page.locator('#gkGezegen li .alt').allTextContents();
    expect(metinler.length).toBeGreaterThan(0);
    metinler.forEach(m => expect(m.trim(), m).not.toMatch(/·$/));
    /* Uranüs bu gece Tromsø'da batmıyor (doğuş/batış yok): satır bunu söyler */
    const uranus = page.locator('#gkGezegen li', { hasText: 'Uranüs' });
    await expect(uranus).toContainText('bu gece batmıyor');
  });

  test('Longyearbyen Haziran: kutup günü; karar bulut tahmininin "3 gün" sınırından söz etmez (A1-04)', async ({ page }) => {
    await ac(page, YER.longyearbyen, '2026-06-21T21:00:00Z');
    await expect(page.locator('#gkKarar')).toContainText('Güneş bu gece batmıyor (kutup günü)');
    await expect(page.locator('#gkKarar')).not.toContainText('3 gün');
    await expect(page.locator('#gkHedef')).toContainText('kararmıyor');
  });

  test('İstanbul 15 Kasım 2026: Ay %33 karanlığın başında gökte; "alçakta ya da ufkun altında" denmez (A1-03)', async ({ page }) => {
    await ac(page, YER.istanbul, '2026-11-15T21:00:00+03:00');
    /* Bağımsız denetim: tam karanlık başında Ay 5°'nin üstünde, aydınlık oranı %25–40 */
    const gz = new AE.Observer(41.0, 29.1, 0);
    const gzl = G.gozlemci(41.0, 29.1, 0), g = G.geceAraligi(new Date('2026-11-15T18:00:00Z'), gzl);
    const e = AE.Equator(AE.Body.Moon, g.karanlikBas, gz, true, true);
    expect(AE.Horizon(g.karanlikBas, gz, e.ra, e.dec, 'normal').altitude).toBeGreaterThan(5);
    const oran = AE.Illumination(AE.Body.Moon, g.karanlikBas).phase_fraction;
    expect(oran).toBeGreaterThan(0.25); expect(oran).toBeLessThan(0.4);
    await expect(page.locator('#gkKarar')).not.toContainText('alçakta ya da ufkun altında');
    await expect(page.locator('#gkKarar')).toContainText('karanlık saatlerde gökte; ışığı zayıf');
  });
});
