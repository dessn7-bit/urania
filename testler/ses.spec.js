'use strict';
/* Sesli ders (ses.js). Motor Pinakes'ten (kitaplık) uyarlandı; testler de Pinakes'in g123/g125/g126
   testlerinden uyarlandı. g126'nın kaynağı Kaan'ın telefon tanısı (Android 10, Chrome 154, kurulu PWA):
   ekran kilidinde 'interrupted', sonra her parça anında 'synthesis-failed'. Kural: hata asla ilerletmez,
   gizliyken bekçi konuşmaz, ardışık hata duraklatır, Devam aynı parçadan.
   speechSynthesis ve wakeLock taklit; görünürlük visibilityState üzerine yazılarak. */
const { test, expect } = require('@playwright/test');

const TR = [{ name: 'Sahte Türkçe', lang: 'tr-TR', localService: true, default: true }, { name: 'English', lang: 'en-US', localService: true, default: false }];

async function sahteOrtam(page, secenek) {
  const s = Object.assign({ sesler: TR, apiYok: false }, secenek || {});
  await page.addInitScript(s => {
    if (s.apiYok) {
      Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
      Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: undefined, configurable: true });
      return;
    }
    let aktif = null;
    const S = window.__sahteSes = { konusmalar: [], kayit: [], reddet: false };
    function Utt(t) { this.text = String(t); this.lang = ''; this.rate = 1; this.voice = null; this.onstart = null; this.onend = null; this.onerror = null; }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utt, configurable: true, writable: true });
    const motor = {
      get speaking() { return !!aktif; }, get pending() { return false; }, paused: false,
      getVoices() { return s.sesler; },
      speak(u) {
        S.konusmalar.push(u.text); S.kayit.push({ text: u.text, lang: u.lang, rate: u.rate, ses: u.voice && u.voice.name });
        if (S.reddet) { setTimeout(() => { if (u.onerror) u.onerror({ error: 'synthesis-failed' }); }, 0); return; }
        aktif = u;
        setTimeout(() => { if (aktif === u && u.onstart) u.onstart({}); }, 0);
      },
      cancel() { const a = aktif; aktif = null; if (a && a.onerror) setTimeout(() => a.onerror({ error: 'interrupted' }), 0); },
      pause() {}, resume() {}, addEventListener() {}
    };
    Object.defineProperty(window, 'speechSynthesis', { value: motor, configurable: true });
    S.bitir = () => { const u = aktif; aktif = null; if (u && u.onend) u.onend({}); };
    S.sistemKes = () => { const u = aktif; aktif = null; if (u && u.onerror) u.onerror({ error: 'interrupted' }); };
    S.sustur = () => { aktif = null; };
    S.hata = h => { const u = aktif; aktif = null; if (u && u.onerror) u.onerror({ error: h }); };
    S.aktif = () => aktif && aktif.text;
    /* wakeLock */
    const K = window.__sahteKilit = { istek: 0, birak: 0, aktif: 0 };
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request() {
      K.istek++; K.aktif++;
      const l = { released: false, _d: [], addEventListener(a, f) { if (a === 'release') this._d.push(f); },
        release() { if (this.released) return Promise.resolve(); this.released = true; K.birak++; K.aktif--; this._d.forEach(f => f({})); return Promise.resolve(); } };
      return Promise.resolve(l);
    } } });
  }, s);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [] } } }));
  await page.route('**/celestrak.org/**', r => r.fulfill({ status: 503, body: '' }));
}
const cubuk = page => page.locator('#dsSes');
const durumu = page => page.evaluate(() => window.Ses.durum());
const say = page => page.evaluate(() => window.__sahteSes.konusmalar.length);
const konusmalar = page => page.evaluate(() => window.__sahteSes.konusmalar.slice());
const olaylar = page => page.evaluate(() => window.Ses.gunluk().map(g => g.olay + (g.ek ? ' (' + g.ek + ')' : '')));
async function gorunurluk(page, v) {
  await page.evaluate(v => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => v });
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => v === 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  }, v);
}
async function dersAc(page, id) {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  await page.goto('/index.html#ders/' + (id || 'd10'));
  await expect(cubuk(page).locator('[data-so="dinle"]')).toBeVisible();
}
/* Bekçinin 3 sn eşiğini geçmiş gibi çağır */
const bekciZorla = page => page.evaluate(() => { const r = Date.now; Date.now = () => r() + 10000; try { window.Ses.bekci(); } finally { Date.now = r; } });

test('(a) parçalama: ≤180 karakter, cümle/virgül/boşluk sınırından, hiçbir karakter kaybolmaz', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  const r = await page.evaluate(() => {
    const uzun = 'Bu çok uzun bir cümle, içinde virgüller var, ' + 've devam ediyor '.repeat(20) + 'sonunda bitiyor. Kısa cümle. Bir tane daha!';
    const p = window.Ses.parcala(uzun);
    return { p, ayni: p.join(' ').replace(/\s+/g, ' ') === uzun.replace(/\s+/g, ' ').trim(), enUzun: Math.max(...p.map(x => x.length)) };
  });
  expect(r.ayni).toBe(true);
  expect(r.enUzun).toBeLessThanOrEqual(180);
  expect(r.p.length).toBeGreaterThan(2);
});

test('(a2) parçalama: binlik ayraçlı sayı, sıra sayısı, saat ve tek başına "..." cümle sınırı sayılmaz, kaybolmaz', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  const r = await page.evaluate(() => {
    const dolgu = 'Bu cümle parçalamanın devreye girmesi için yeterince uzun tutulmuş bir dolgu cümlesidir. ';
    const ham = dolgu + 'Yaklaşık 14.500 yılında Vega kutup yıldızı olur ve 400.000 kat parlak görünür. ' + dolgu +
      'Bunu 11. dersten hatırla, gece 03.21 civarında bak. ... Sonra ' + dolgu;
    const t = window.Okunus.okunus(ham);
    const p = window.Ses.parcala(t);
    const ust = window.Ses.parcala('x'.repeat(150) + ' ve 11. ' + 'dersten '.repeat(10) + 'sonra.');
    /* sınır tam "11." ve "03." üstüne düşecek biçimde (eski kural burada bölüyordu) */
    const sinir = window.Ses.parcala('x '.repeat(70) + 'son. Bunu 11. dersten hatırla ve gece 03.21 saatinde yeniden bak lütfen. Bitti.');
    return { t, p, ust, sinir };
  });
  expect(r.t).toContain('14500 yılında');
  expect(r.t).toContain('400000 kat');
  expect(r.p.join(' ').replace(/\s+/g, '')).toBe(r.t.replace(/\s+/g, ''));   // "..." dahil hiçbir karakter kaybolmaz
  expect(r.p.join(' ')).toContain('...');
  expect(r.p.every(x => x.length <= 180)).toBe(true);
  for (let i = 0; i < r.p.length - 1; i++) {
    expect(r.p[i], 'parça sayıyla bitip sonraki sayı ya da küçük harfle başlamamalı').not.toMatch(/\d\.$/);
    expect(r.p[i + 1]).not.toMatch(/^[a-zçğıöşü\d]/);
  }
  expect(r.p.some(x => x.includes('11. dersten'))).toBe(true);
  expect(r.p.some(x => x.includes('03.21'))).toBe(true);
  /* tavanı aşan tek cümlede boşluktan bölünürken de "11." parçanın sonunda kalmaz */
  r.ust.slice(0, -1).forEach(x => expect(x).not.toMatch(/\d\.$/));
  r.sinir.slice(0, -1).forEach(x => expect(x).not.toMatch(/\d\.$/));
  expect(r.sinir.some(x => x.includes('11. dersten') && x.includes('03.21'))).toBe(true);
});

test('(a3) Dinle: gerçek derste binlik ayraçlı sayı iki konuşmaya bölünmez', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page, 'd1');
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => say(page)).toBe(1);
  for (let i = 0; i < 600 && await durumu(page); i++) await page.evaluate(() => window.__sahteSes.bitir());
  const k = await konusmalar(page);
  expect(k.join(' ')).toContain('14500 yılında');
  for (let i = 0; i < k.length - 1; i++) expect(/\d\.$/.test(k[i]) && /^\d/.test(k[i + 1]), k[i].slice(-40) + ' ‖ ' + k[i + 1].slice(0, 40)).toBe(false);
});

test('(b) Dinle: bloklar sırayla, tr-TR ve Türkçe ses, okunan blok vurgulu; sona gelince çubuk Dinle\'ye döner', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => say(page)).toBe(1);
  const ilk = await page.evaluate(() => window.__sahteSes.kayit[0]);
  expect(ilk.text).toBe('Ders ' + (await page.locator('.ders h1').getAttribute('data-ses')).match(/^Ders (\d+):/)[1] + ': ' + (await page.locator('.ders h1').innerText()) + '.');   // ders numarası söylenir; noktasız başlığa nokta
  expect(ilk.lang).toBe('tr-TR');
  expect(ilk.ses).toBe('Sahte Türkçe');
  await expect(page.locator('.ders h1')).toHaveClass(/so-okunan/);
  await expect(cubuk(page).locator('[data-so="duraklat"]')).toBeVisible();
  /* sonuna kadar oku */
  for (let i = 0; i < 400 && await durumu(page); i++) await page.evaluate(() => window.__sahteSes.bitir());
  expect(await durumu(page)).toBe(null);
  await expect(page.locator('.ders .so-okunan')).toHaveCount(0);
  await expect(cubuk(page).locator('[data-so="dinle"]')).toBeVisible();
  const hepsi = await konusmalar(page);
  expect(hepsi.every(x => x.length <= 180)).toBe(true);
  const sorular = await page.locator('details.soru summary').allInnerTexts();
  expect(hepsi.join(' ')).not.toContain(sorular[0].slice(0, 40));   // sorular okunmaz
  expect(page.hatalar).toEqual([]);
});

test('(c) Duraklat / Devam / Durdur: iptal edilen konuşmanın geç olayı sırayı kaydırmaz; Devam aynı parçadan', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => say(page)).toBe(1);
  await page.evaluate(() => window.__sahteSes.bitir());
  await expect.poll(() => say(page)).toBe(2);
  await cubuk(page).locator('[data-so="duraklat"]').click();
  await page.waitForTimeout(100);   // cancel'ın geç 'interrupted' olayı gelir
  expect(await say(page)).toBe(2);
  expect((await durumu(page)).durum).toBe('duraklatildi');
  await cubuk(page).locator('[data-so="devam"]').click();
  await expect.poll(() => say(page)).toBe(3);
  const k = await konusmalar(page);
  expect(k[2]).toBe(k[1]);
  await cubuk(page).locator('[data-so="durdur"]').click();
  await page.waitForTimeout(100);
  expect(await durumu(page)).toBe(null);
  expect(await say(page)).toBe(3);
  await expect(cubuk(page).locator('[data-so="dinle"]')).toBeVisible();
});

test('(d) Bloğa dokunma: açık oturumda oradan sürer; boşta dokunmak ses başlatmaz', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  const p = page.locator('.ders p.okunur');
  await p.nth(2).click();
  await page.waitForTimeout(100);
  expect(await say(page)).toBe(0);
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => say(page)).toBe(1);
  await p.nth(2).click();
  await expect.poll(() => say(page)).toBe(2);
  await expect(p.nth(2)).toHaveClass(/so-okunan/);
  expect((await konusmalar(page))[1]).toBe(await page.evaluate(() => window.Ses.parcala(window.Okunus.okunus(document.querySelectorAll('.ders p.okunur')[2].textContent))[0]));
});

test('(e) Hız 0,8–1,5: çalan parçaya uygulanır ve hatırlanır', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  const sec = cubuk(page).locator('.so-hiz');
  expect(await sec.locator('option').evaluateAll(o => o.map(x => parseFloat(x.value)))).toEqual([0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5]);
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => say(page)).toBe(1);
  await cubuk(page).locator('.so-hiz').selectOption('1.3');
  await expect.poll(() => page.evaluate(() => window.__sahteSes.kayit.map(k => k.rate))).toEqual([1, 1.3]);
  const k = await konusmalar(page);
  expect(k[1]).toBe(k[0]);
  await page.goto('/index.html#ders/d9');
  await expect(cubuk(page).locator('.so-hiz')).toHaveValue('1.3');
});

test('(f) Başka sayfaya geçince susar; iki okuma üst üste binmez', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => say(page)).toBe(1);
  await page.goto('/index.html#ders/d9');
  await expect.poll(() => durumu(page)).toBe(null);
  await page.waitForTimeout(100);
  expect(await say(page)).toBe(1);
  expect(await page.evaluate(() => window.__sahteSes.aktif())).toBeFalsy();
  expect(await olaylar(page)).toContain('durdu (sayfa değişti)');
});

test('(h) Türkçe ses yoksa düğme yerine açıklama; zorla başlatma reddedilir', async ({ page }) => {
  await sahteOrtam(page, { sesler: [{ name: 'English', lang: 'en-US', localService: true, default: true }] });
  await page.goto('/index.html#ders/d10');
  await expect(cubuk(page).locator('.so-mesaj')).toContainText('Bu cihazda Türkçe ses bulunamadı');
  await expect(cubuk(page).locator('[data-so="dinle"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.Ses.baslat(0))).toBe(false);
});

test('(h2) speechSynthesis hiç yoksa açıklama, düğme yok', async ({ page }) => {
  await sahteOrtam(page, { apiYok: true });
  await page.goto('/index.html#ders/d10');
  await expect(cubuk(page).locator('.so-mesaj')).toHaveText('Bu tarayıcı sesli okumayı desteklemiyor.');
});

test('(i) Bekçi: görünürken motor haber vermeden susarsa aynı parçadan yeniden konuşur', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => say(page)).toBe(1);
  await page.evaluate(() => window.__sahteSes.sustur());
  await bekciZorla(page);
  await expect.poll(() => say(page)).toBe(2);
  const k = await konusmalar(page);
  expect(k[1]).toBe(k[0]);
});

test.describe('Arka plan kesintisi (Pinakes g126, telefon tanısı)', () => {
  async function ikinciParca(page) {
    await cubuk(page).locator('[data-so="dinle"]').click();
    await expect.poll(() => say(page)).toBe(1);
    await page.evaluate(() => window.__sahteSes.bitir());
    await expect.poll(() => say(page)).toBe(2);
    return durumu(page);
  }
  test('A) gizliyken interrupted → ilerleme yok, duraklar, yer korunur', async ({ page }) => {
    await sahteOrtam(page); await dersAc(page);
    const d0 = await ikinciParca(page);
    await gorunurluk(page, 'hidden');
    await page.evaluate(() => window.__sahteSes.sistemKes());
    await page.waitForTimeout(100);
    const d = await durumu(page);
    expect([d.i, d.j, d.durum]).toEqual([d0.i, d0.j, 'duraklatildi']);
    expect(await say(page)).toBe(2);
    expect((await olaylar(page)).some(o => /^duraklatıldı \(arka planda interrupted/.test(o))).toBe(true);
  });
  test('B) gizliyken bekçi konuşmaz; görünürken konuşur', async ({ page }) => {
    await sahteOrtam(page); await dersAc(page);
    await ikinciParca(page);
    await gorunurluk(page, 'hidden');
    await page.evaluate(() => window.__sahteSes.sustur());
    await bekciZorla(page);
    await page.waitForTimeout(50);
    expect(await say(page)).toBe(2);
    await gorunurluk(page, 'visible');
    await bekciZorla(page);
    await expect.poll(() => say(page)).toBe(3);
  });
  test('C) görünürken ardışık synthesis-failed → bir kez yeniden dener, sonra duraklar; oturum bitmez', async ({ page }) => {
    await sahteOrtam(page); await dersAc(page);
    const d0 = await ikinciParca(page);
    await page.evaluate(() => { window.__sahteSes.reddet = true; });
    await page.evaluate(() => window.__sahteSes.hata('synthesis-failed'));
    await expect.poll(() => durumu(page), { timeout: 5000 }).toMatchObject({ durum: 'duraklatildi' });
    const d = await durumu(page);
    expect([d.i, d.j]).toEqual([d0.i, d0.j]);
    const o = await olaylar(page);
    expect(o.filter(x => x === 'hata (synthesis-failed)')).toHaveLength(2);
    expect(o.some(x => /sona erdi/.test(x))).toBe(false);
    await expect(cubuk(page).locator('[data-so="devam"]')).toBeVisible();
  });
  test('D) kilit → interrupted → dönüş → Devam aynı parçadan, sonra normal akış', async ({ page }) => {
    await sahteOrtam(page); await dersAc(page);
    const d0 = await ikinciParca(page);
    const parca = (await konusmalar(page))[1];
    await gorunurluk(page, 'hidden');
    await page.evaluate(() => { window.__sahteSes.reddet = true; });
    await page.evaluate(() => window.__sahteSes.sistemKes());
    await bekciZorla(page);
    await page.waitForTimeout(100);
    expect(await say(page)).toBe(2);
    await page.evaluate(() => { window.__sahteSes.reddet = false; });
    await gorunurluk(page, 'visible');
    await page.waitForTimeout(800);
    expect(await say(page)).toBe(2);
    await cubuk(page).locator('[data-so="devam"]').click();
    await expect.poll(() => say(page)).toBe(3);
    expect((await konusmalar(page))[2]).toBe(parca);
    const d = await durumu(page);
    expect([d.i, d.j, d.durum]).toEqual([d0.i, d0.j, 'oynuyor']);
  });
});

test('(w) Ekran uyanık: okurken kilit alınır, duraklatınca ve gizlenince bırakılır, görünür olunca yeniden', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => page.evaluate(() => window.__sahteKilit.aktif)).toBe(1);
  await gorunurluk(page, 'hidden');
  await expect.poll(() => page.evaluate(() => window.__sahteKilit.aktif)).toBe(0);
  await gorunurluk(page, 'visible');
  await expect.poll(() => page.evaluate(() => window.__sahteKilit.aktif)).toBe(1);
  await cubuk(page).locator('[data-so="duraklat"]').click();
  await expect.poll(() => page.evaluate(() => window.__sahteKilit.aktif)).toBe(0);
});

test('(t) Okuma tanısı: çubukta ve Tanı ekranının raporunda', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  await cubuk(page).locator('[data-so="dinle"]').click();
  await expect.poll(() => say(page)).toBe(1);
  await expect(cubuk(page).locator('details.so-tani summary')).toContainText('Okuma tanısı');
  await cubuk(page).locator('[data-so="durdur"]').click();
  await page.goto('/index.html#tani');
  await page.locator('#tnYenile').click();
  await expect(page.locator('#tnRapor')).toContainText('SESLİ OKUMA: var · sesler Sahte Türkçe (tr-TR, yerel, varsayılan)');
  await expect(page.locator('#tnRapor')).toContainText('oturum (ders d10');
});

async function yonVer(page, alpha, beta, gamma) {
  await page.evaluate(([a, b, g]) => {
    for (let i = 0; i < 60; i++) {
      const tur = ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation';
      window.dispatchEvent(new DeviceOrientationEvent(tur, { alpha: a, beta: b, gamma: g, absolute: true }));
    }
  }, [alpha, beta, gamma]);
  await page.waitForTimeout(150);
}

test('(k) Dersten derse: kutu işaretliyse ders bitince sonrakine geçer ve kendiliğinden okur; işaretsizse durur', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page, 'd9');
  await page.locator('#dsSurekli').check();
  await cubuk(page).locator('[data-so="dinle"]').click();
  for (let i = 0; i < 600 && await durumu(page); i++) await page.evaluate(() => window.__sahteSes.bitir());
  await expect(page).toHaveURL(/#ders\/d10$/);
  await expect.poll(() => konusmalar(page).then(k => k[k.length - 1]), { timeout: 5000 }).toMatch(/^Ders \d+: Ay: /);
  expect((await durumu(page)).durum).toBe('oynuyor');
  /* işaret kaldırılınca sonda durur */
  await page.locator('#dsSurekli').uncheck();
  for (let i = 0; i < 600 && await durumu(page); i++) await page.evaluate(() => window.__sahteSes.bitir());
  /* Olumlu koşul: d10'un okuması gerçekten SONA ERDİ (durdurulmadı); geçiş kararı (bitince) bu anda eşzamanlı
     verilir. Sonra: adres d10'da kaldı, sonraki derse devam bayrağı yazılmadı ve yeni okuma başlamadı. */
  expect(await durumu(page)).toBe(null);
  /* Son bitiş olayı (ardından "ekran kilidi bırakıldı" gibi kayıtlar gelebilir) "durdu" değil "sona erdi" olmalı */
  expect((await olaylar(page)).filter(o => /^(sona erdi|durdu)/.test(o)).slice(-1)[0]).toMatch(/^sona erdi/);
  const sonSay = await say(page);
  expect(await page.evaluate(() => [location.hash, sessionStorage.getItem('urania_sesDevam')])).toEqual(['#ders/d10', null]);
  await expect(page.locator('article.ders h1')).toContainText('Ay');
  expect(await say(page)).toBe(sonSay);
  await expect(page).toHaveURL(/#ders\/d10$/);
});

test('(g) Gökyüzü: "Bu geceyi dinle" özeti, bulut cümlesini ve planı okur; "Gördüm, deftere yaz" okunmaz', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-27T19:00:00+03:00') });
  await sahteOrtam(page);
  const t0 = Date.UTC(2026, 9, 27) / 1000, n = 72, dolu = v => Array(n).fill(v);
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time: [...Array(n).keys()].map(i => t0 + i * 3600), cloud_cover: dolu(20), cloud_cover_low: dolu(20), cloud_cover_mid: dolu(0), cloud_cover_high: dolu(0), relative_humidity_2m: dolu(60), wind_speed_10m: dolu(5), precipitation_probability: dolu(0), precipitation: dolu(0) } } }));
  await page.goto('/index.html#gok');
  const c = page.locator('#gkSes');
  await expect(page.locator('#gkHava .hava-cumle')).toBeVisible();
  await expect(c.locator('[data-so="dinle"]')).toHaveText('Bu geceyi dinle');
  await expect(page.locator('#gkPlan li.plan-gezegen').first()).toBeVisible();
  await page.waitForTimeout(500);
  await c.locator('[data-so="dinle"]').click();
  for (let i = 0; i < 300 && await durumu(page); i++) await page.evaluate(() => window.__sahteSes.bitir());
  const k = (await konusmalar(page)).join(' ');
  expect(k).toMatch(/^Güneş 18:06'da batıyor/);
  expect(k).toContain('Bulut tahmini: gece boyunca büyük ölçüde açık.');
  expect(k).toContain('Bu gecenin planı.');
  expect(k).toContain('Bulut yüzde 20.');
  expect(k).toMatch(/\d+ derece yükseklikte, (kuzey|güney|doğu|batı)\S*(de|da)\./);
  expect(k).not.toContain('..');
  expect(k).toMatch(/Saat \d\d:\d\d\. Jüpiter\. \d+ derece/);
  expect(k).not.toContain('Gördüm');
  expect(k).not.toMatch(/[°%]/);
});

test('(r) Kartları sesli tekrar: soruyu okur, 8 sn sonra cevabı açıp okur; Bildim ile sonraki kart okunur', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-27T19:00:00+03:00') });
  await sahteOrtam(page);
  await page.goto('/index.html#ders/d10');
  await page.locator('#dsBitir').click();
  await page.goto('/index.html#ders/kartlar');
  await page.locator('#kaSesli').click();
  await expect(page.locator('#kaSesli')).toHaveAttribute('aria-pressed', 'true');
  const soru = await page.locator('.kart-on').innerText();
  await expect.poll(() => konusmalar(page).then(k => k.join(' '))).toContain(soru.replace(/ — değeri ne\?$/, '').slice(0, 30));
  for (let i = 0; i < 20 && await page.evaluate(() => window.__sahteSes.aktif()); i++) await page.evaluate(() => window.__sahteSes.bitir());
  await expect(page.locator('#kaCevir')).toHaveText('Cevabı göster (8)');
  await page.clock.runFor(8500);
  await expect(page.locator('#kaArka')).toBeVisible();
  const cevap = await page.locator('#kaArka p').innerText();
  await expect.poll(() => konusmalar(page).then(k => k.join(' '))).toContain(cevap.slice(0, 20));
  const once = await say(page);
  await page.locator('#kaEvet').click();
  await expect.poll(() => say(page)).toBeGreaterThan(once);
  /* tercih hatırlanır */
  expect(await page.evaluate(() => localStorage.getItem('urania_kartSesli'))).toBe('true');
});

test('(r2) Kısa konuşma: bir parça hata verirse sonrakine geçer, zincir sonunda bitince bir kez çağrılır; gizliyken hata zinciri bitirir', async ({ page }) => {
  await sahteOrtam(page);
  await dersAc(page);
  await page.evaluate(() => {
    window.__bitti = 0; window.__hatalar = [];
    const uzun = 'Birinci cümle oldukça uzun ve ayrıntılı bir açıklama içeriyor, böylece parça sınırına yaklaşıyoruz ve devam ediyoruz. '.repeat(3);
    window.__parca = window.Ses.parcala(window.Okunus.okunus(uzun)).length;
    window.Ses.soyle(uzun, { bitince: () => { window.__bitti++; }, hata: h => window.__hatalar.push(h) });
  });
  expect(await page.evaluate(() => window.__parca)).toBe(3);
  await expect.poll(() => say(page)).toBe(1);
  await page.evaluate(() => window.__sahteSes.hata('synthesis-failed'));
  await expect.poll(() => say(page)).toBe(2);
  await page.evaluate(() => window.__sahteSes.hata('interrupted'));
  await expect.poll(() => say(page)).toBe(3);
  expect(await page.evaluate(() => window.__bitti)).toBe(0);
  await page.evaluate(() => window.__sahteSes.bitir());
  await expect.poll(() => page.evaluate(() => window.__bitti)).toBe(1);
  expect(await page.evaluate(() => window.__hatalar)).toEqual(['synthesis-failed', 'interrupted']);
  expect(await olaylar(page)).toContain('kısa konuşma hatası (synthesis-failed)');
  /* gizliyken hata: kalan parçalar söylenmez, bitince yine çağrılır */
  await page.evaluate(() => { window.__bitti = 0; window.Ses.soyle('Birinci cümle oldukça uzun ve ayrıntılı bir açıklama içeriyor, böylece parça sınırına yaklaşıyoruz ve devam ediyoruz. '.repeat(3), { bitince: () => { window.__bitti++; } }); });
  await expect.poll(() => say(page)).toBe(4);
  await gorunurluk(page, 'hidden');
  await page.evaluate(() => window.__sahteSes.hata('interrupted'));
  await expect.poll(() => page.evaluate(() => window.__bitti)).toBe(1);
  await page.waitForTimeout(100);
  expect(await say(page)).toBe(4);
  /* sus() sonrası geç gelen olay bitince'yi çağırmaz */
  await gorunurluk(page, 'visible');
  await page.evaluate(() => { window.__bitti = 0; window.Ses.soyle('Kısa bir cümle.', { bitince: () => { window.__bitti++; } }); window.Ses.sus(); });
  await page.evaluate(() => window.__sahteSes.hata('synthesis-failed'));
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => window.__bitti)).toBe(0);
});

test('(r3) Kartları sesli tekrar: soru konuşması motor hatası verse de 8 sn sayaç başlar ve cevap açılır', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-27T19:00:00+03:00') });
  await sahteOrtam(page);
  await page.goto('/index.html#ders/d10');
  await page.locator('#dsBitir').click();
  await page.goto('/index.html#ders/kartlar');
  await page.locator('#kaSesli').click();
  await expect.poll(() => page.evaluate(() => !!window.__sahteSes.aktif())).toBe(true);
  /* soru tek ya da çok parçalı olabilir: her parça hata verir */
  for (let i = 0; i < 20 && await page.evaluate(() => window.__sahteSes.aktif()); i++) {
    await page.evaluate(() => window.__sahteSes.hata('synthesis-failed'));
    await page.waitForTimeout(20);
  }
  await expect(page.locator('#kaCevir')).toHaveText('Cevabı göster (8)');
  await page.clock.runFor(8500);
  await expect(page.locator('#kaArka')).toBeVisible();
});

test('(y) Gökyüzüne bak: sesli yön tarifi hedefi söyler, ortalanınca "tam karşında" der', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-27T21:00:00+03:00') });
  await sahteOrtam(page);
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await expect(page.locator('#arSesli')).toBeVisible();
  await page.locator('#arSesli').click();
  await yonVer(page, ((6.08 - 90) % 360 + 360) % 360, 90, 0);   // doğu ufku
  await page.locator('#arBul').click();
  await page.locator('#arAra').fill('satürn');
  await page.locator('#arSonuc button', { hasText: 'Satürn' }).click();
  await yonVer(page, ((6.08 - 90) % 360 + 360) % 360, 90, 0);
  await expect.poll(() => konusmalar(page).then(k => k.join(' | '))).toMatch(/Satürn: sağa 4[23] derece, yukarı (39|40) derece/);
  /* Satürn 132,5° / 39,5° yönüne çevir */
  await yonVer(page, ((6.08 - 132.5) % 360 + 360) % 360, 90 + 39.5, 0);
  await expect.poll(() => konusmalar(page).then(k => k[k.length - 1])).toBe('Satürn tam karşında.');
});
