'use strict';
/* "Gökyüzüne bak" (AR) testleri. Yön olayları W3C DeviceOrientation anlamıyla üretilir:
   β=90° telefon dik (arka kamera ufka bakar), α saat yönünün TERSİNE artar (α=90° → batı).
   Pusula manyetik kuzeye göre kabul edilir; Fetih Mah. (Ataşehir) için WMM-2025 sapması +6,09° (Kadıköy +6,08°) (NOAA
   hesaplayıcısıyla aynı: ngdc.noaa.gov/geomag-web, 2026-10-27) eklenir. */
const { test, expect } = require('@playwright/test');
const { celestrak } = require('./yardim');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');

async function yonVer(page, alpha, beta, gamma) {
  await page.evaluate(([a, b, g]) => {
    for (let i = 0; i < 60; i++) {
      /* Android Chrome 'deviceorientationabsolute' yollar; masaüstü Chromium'da o özellik
         olmadığından aynı veri absolute:true ile 'deviceorientation' olarak da yollanır. */
      const tur = ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation';
      window.dispatchEvent(new DeviceOrientationEvent(tur, { alpha: a, beta: b, gamma: g, absolute: true }));
    }
  }, [alpha, beta, gamma]);
  await page.waitForTimeout(150);
}

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(e.message));
  await page.clock.install({ time: SABIT_AN });
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test('Dik tutulan telefon manyetik kuzeye bakınca gerçek yön ≈ 6° K, yükseklik 0°', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await yonVer(page, 0, 90, 0);
  await expect(page.locator('#arMerkez .ar-yon')).toHaveText('6° K · yükseklik 0°');
});

test('α=90° (manyetik batı) → ≈ 276° B; β=135° → 45° yükseklik', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await yonVer(page, 90, 135, 0);
  await expect(page.locator('#arMerkez .ar-yon')).toHaveText('276° B · yükseklik 45°');
});

test('Satürn\'e doğrultulunca nişangâhta Satürn görünür', async ({ page }) => {
  /* 21:00'de Satürn: yükseklik 39,47°, azimut 132,52° (gok.js; Astronomy Engine).
     başlık = 360 − (α − sapma) → α = sapma − azimut */
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await yonVer(page, ((6.08 - 132.52) % 360 + 360) % 360, 90 + 39.47, 0);
  await expect(page.locator('#arMerkez b')).toHaveText('Satürn');
});

test('Algılayıcı yoksa sürükleme moduna geçer ve sürükleyince yön değişir', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(1900);
  await expect(page.locator('#arDurum')).toContainText('sürükle');
  const once = await page.locator('#arMerkez .ar-yon').innerText();
  const kv = page.locator('#arKanvas');
  const b = await kv.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2 + 150, b.y + b.height / 2 + 60, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('#arMerkez .ar-yon')).not.toHaveText(once);
});

test('Bul: Satürn seçilince şerit görünür; sürükleme modunda görüş Satürn\'e döner', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(1900);
  await page.locator('#arBul').click();
  await page.locator('#arAra').fill('sat');
  await page.locator('#arSonuc button', { hasText: 'Satürn' }).click();
  await expect(page.locator('#arHedefSerit')).toBeVisible();
  await expect(page.locator('#arMerkez b')).toHaveText('Satürn');
});

test('Hizala: nişangâhtaki fark düzeltilir', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  /* Pusula 10° şaşmış olsun: telefon aslında Ay'a bakıyor ama α 10° kaymış */
  const ay = await page.evaluate(() => { const c = window.UraniaAR.st.nesneler.cisimler.find(x => x.id === 'Moon'); return { alt: c.alt, az: c.az }; });
  const alfa = ((6.08 - ay.az + 10) % 360 + 360) % 360;
  await yonVer(page, alfa, 90 + ay.alt, 0);
  await expect(page.locator('#arMerkez b')).not.toHaveText('Ay');
  await page.locator('#arHizalaDugme').click();
  await expect(page.locator('#arHizalaMetin')).toContainText('Ay');
  await page.locator('#arOrtaladim').click();
  await yonVer(page, alfa, 90 + ay.alt, 0);
  await expect(page.locator('#arMerkez b')).toHaveText('Ay');
});

test('Kapatınca gökyüzü sekmesine döner ve üst menü geri gelir', async ({ page }) => {
  await page.goto('/index.html#gok');
  await page.locator('.ar-giris').click();
  await expect(page.locator('body')).toHaveClass(/ar-acik/);
  await page.locator('.ar-kapat').click();
  await expect(page.locator('body')).not.toHaveClass(/ar-acik/);
  await expect(page.locator('.ust')).toBeVisible();
});

test('Bul: aranan cisme yön tarifi verilir', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  /* Doğu ufkuna bak (gerçek azimut 90°, yükseklik 0°) */
  await yonVer(page, ((6.08 - 90) % 360 + 360) % 360, 90, 0);
  await page.locator('#arBul').click();
  await page.locator('#arAra').fill('satürn');
  await page.locator('#arSonuc button', { hasText: 'Satürn' }).click();
  /* Satürn 132,5° / 39,5°: sağa ≈ 43°, yukarı ≈ 39° */
  await expect(page.locator('#arTarif')).toHaveText(/sağa 4[23]°, yukarı (39|40)°/);
});

test.describe('ISS', () => {
  test('Geçiş sırasında telefonu ISS\'e tutunca nişangâhta görünür; yolu çizilir', async ({ page }) => {
    /* 2026-10-30 03:58:00 UT, Fetih Mah.: ISS yükseklik 33,92°, azimut 312,77°, ışıkta
       (uydu.js ile Skyfield aynı değeri verdi). */
    await celestrak(page);
    await page.clock.setFixedTime(new Date('2026-10-30T03:58:00Z'));
    await page.goto('/index.html#ar');
    await page.waitForTimeout(600);
    await yonVer(page, ((6.09 - 312.77) % 360 + 360) % 360, 90 + 33.92, 0);
    await expect(page.locator('#arMerkez b')).toHaveText('Uzay İstasyonu (ISS)');
    await expect(page.locator('#arMerkez')).toContainText('Güneş ışığı alıyor');
    const yol = await page.evaluate(() => window.UraniaAR.st.uyduGecis && window.UraniaAR.st.uyduGecis[0] && window.UraniaAR.st.uyduGecis[0].yol.length);
    expect(yol).toBeGreaterThan(20);
  });
});

test('Yatay tutuş (ekran 90°): gökyüzü ters dönmez — yukarıdaki yıldız yukarıda, doğudaki sağda', async ({ page }) => {
  /* Saat yönünün tersine yatırılmış telefon (screen.orientation.angle = 90), arka kamera kuzey ufkunda:
     α=90, β=0, γ=−90 (W3C: cihazın +x'i yukarıyı gösterir). */
  await page.addInitScript(() => {
    try { Object.defineProperty(screen.orientation, 'angle', { get: () => 90, configurable: true }); } catch (e) { /* yoksa test anlamsız */ }
  });
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await yonVer(page, 90, 0, -90);
  const yon = await page.locator('#arMerkez .ar-yon').innerText();
  expect(yon).toMatch(/^6° K · yükseklik -?0°$/);
  const yukari = await page.evaluate(() => window.UraniaAR.yansitTest(20, 6.09));
  const dogu = await page.evaluate(() => window.UraniaAR.yansitTest(0, 50));
  expect(yukari.y).toBeGreaterThan(0.2);          // ufkun 20° üstü ekranda yukarıda
  expect(Math.abs(yukari.x)).toBeLessThan(0.02);
  expect(dogu.x).toBeGreaterThan(0.2);            // kuzeye bakarken doğu sağda
});

/* ---------------- Hata avı düzeltmelerinin regresyon testleri (2026-10-27) ---------------- */

/* Sahte kamera (izin penceresi 400 ms sürer) ve geç yanıtlayan ekran kilidi (300 ms) */
async function sahteKamera(page, secenek) {
  await page.addInitScript(s => {
    const K = window.__k = { akislar: [], kilitIstek: 0, kilitAktif: 0 };
    navigator.mediaDevices.getUserMedia = () => new Promise(res => setTimeout(() => {
      const c = document.createElement('canvas'); c.width = 4; c.height = 4; c.getContext('2d').fillRect(0, 0, 4, 4);
      const a = c.captureStream(5); K.akislar.push(a); res(a);
    }, 400));
    if (s.playHata) HTMLMediaElement.prototype.play = () => Promise.reject(Object.assign(new Error('oynatılamadı'), { name: 'NotSupportedError' }));
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request() { K.kilitIstek++;
      return new Promise(res => setTimeout(() => { K.kilitAktif++; let b = false; res({ release() { if (!b) { b = true; K.kilitAktif--; } return Promise.resolve(); }, addEventListener() {} }); }, 300)); } } });
    K.canli = () => K.akislar.reduce((n, a) => n + a.getTracks().filter(t => t.readyState === 'live').length, 0);
  }, secenek || {});
}
/* Sahte konuşma motoru; sesler.gec: ilk anda ses listesi boş, window.__sesYukle() ile gelir ('voiceschanged') */
async function sahteSes(page, secenek) {
  await page.addInitScript(s => {
    const TR = [{ name: 'Sahte Türkçe', lang: 'tr-TR', localService: true, default: true }];
    let sesler = s.gec ? [] : TR, aktif = null;
    const dinleyici = [];
    const S = window.__sahteSes = { konusmalar: [] };
    function Utt(t) { this.text = String(t); this.lang = ''; this.rate = 1; this.voice = null; this.onstart = null; this.onend = null; this.onerror = null; }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utt, configurable: true, writable: true });
    const motor = {
      get speaking() { return !!aktif; }, get pending() { return false; }, paused: false,
      getVoices() { return sesler; },
      speak(u) { S.konusmalar.push(u.text); aktif = u; setTimeout(() => { if (aktif === u && u.onstart) u.onstart({}); }, 0); setTimeout(() => { if (aktif === u) { aktif = null; if (u.onend) u.onend({}); } }, 20); },
      cancel() { aktif = null; }, pause() {}, resume() {},
      addEventListener(a, f) { if (a === 'voiceschanged') dinleyici.push(f); }
    };
    Object.defineProperty(window, 'speechSynthesis', { value: motor, configurable: true });
    window.__sesYukle = () => { sesler = TR; dinleyici.forEach(f => f({})); };
  }, secenek || {});
}
/* iOS taklidi: deviceorientationabsolute yok, izin API'si var */
async function ios(page, cevap) {
  await page.addInitScript(c => {
    delete Window.prototype.ondeviceorientationabsolute; delete window.ondeviceorientationabsolute;
    DeviceOrientationEvent.requestPermission = () => new Promise(r => setTimeout(() => r(c), 50));
  }, cevap);
}
const arDurum = page => page.evaluate(() => ({ mod: window.UraniaAR.st.mod, dugme: !document.querySelector('#arPusula').hidden, mesaj: document.querySelector('#arDurum').textContent }));
async function suruklemeCalisiyor(page) {
  const once = await page.locator('#arMerkez .ar-yon').innerText();
  const b = await page.locator('#arKanvas').boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2 + 150, b.y + b.height / 2 + 50, { steps: 5 }); await page.mouse.up();
  await page.waitForTimeout(100);
  return once !== await page.locator('#arMerkez .ar-yon').innerText();
}
/* Tek tür olay yolla (göreli/mutlak ayrımı için) */
async function olayYolla(page, tur, alpha, beta, gamma, n) {
  await page.evaluate(([tur, a, b, g, n]) => {
    for (let i = 0; i < (n || 30); i++) window.dispatchEvent(new DeviceOrientationEvent(tur, { alpha: a, beta: b, gamma: g, absolute: tur === 'deviceorientationabsolute' }));
  }, [tur, alpha, beta, gamma, n]);
}
/* iOS olayı: DeviceOrientationEvent kurucusu webkitCompassHeading almaz; özellikler elle tanımlanır */
async function iosOlay(page, alpha, beta, gamma, baslik, n) {
  await page.evaluate(([a, b, g, h, n]) => {
    for (let i = 0; i < (n || 60); i++) {
      const e = new Event('deviceorientation');
      Object.defineProperties(e, { alpha: { value: a }, beta: { value: b }, gamma: { value: g }, absolute: { value: false }, webkitCompassHeading: { value: h }, webkitCompassAccuracy: { value: 10 } });
      window.dispatchEvent(e);
    }
  }, [alpha, beta, gamma, baslik, n]);
  await page.waitForTimeout(150);
}

test.describe('Kamera ve ekran kilidi yarışları (A1, A4)', () => {
  test('A1: kamera izni beklenirken AR kapatılırsa akış kapanır', async ({ page }) => {
    await sahteKamera(page);
    await page.goto('/index.html#ar');
    await page.waitForTimeout(500);
    await page.locator('#arKamera').click();
    await page.locator('.ar-kapat').click();
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => window.__k.akislar.length)).toBe(1);   // istek gerçekten yapıldı
    expect(await page.evaluate(() => window.__k.canli())).toBe(0);
    expect(await page.evaluate(() => window.UraniaAR.st.kamera)).toBe(false);
  });

  test('A1: kamera düğmesine çift basış tek akış açar; istek sürerken düğme devre dışı; kapanınca iz kalmaz', async ({ page }) => {
    await sahteKamera(page);
    await page.goto('/index.html#ar');
    await page.waitForTimeout(500);
    await page.evaluate(() => { const b = document.querySelector('#arKamera'); b.click(); b.click(); });
    await expect(page.locator('#arKamera')).toBeDisabled();
    await page.waitForTimeout(800);
    await expect(page.locator('#arKamera')).toBeEnabled();
    expect(await page.evaluate(() => window.__k.canli())).toBe(1);
    await expect(page.locator('#arKamera')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('.ar-kapat').click();
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.__k.canli())).toBe(0);
  });

  test('A1: video.play() hata verirse açılan akış durdurulur', async ({ page }) => {
    await sahteKamera(page, { playHata: true });
    await page.goto('/index.html#ar');
    await page.waitForTimeout(500);
    await page.locator('#arKamera').click();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__k.akislar.length)).toBe(1);
    expect(await page.evaluate(() => window.__k.canli())).toBe(0);
    await expect(page.locator('#arKamera')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#arDurum')).toHaveText('Kamera açılamadı.');
  });

  test('A4: ekran kilidi AR kapandıktan sonra gelirse hemen bırakılır', async ({ page }) => {
    await sahteKamera(page);
    await page.goto('/index.html#gok');
    await page.waitForTimeout(500);
    await page.evaluate(() => { location.hash = '#ar'; });
    await page.waitForTimeout(100);
    await page.evaluate(() => { location.hash = '#gok'; });
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__k.kilitIstek)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.__k.kilitAktif)).toBe(0);
  });
});

test('A5: göreli akıştan sonra mutlak gelince çerçeveler karışmaz (bakış sabit kalır)', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  /* Android: önce yalnız göreli olay (mutlak algılayıcı ısınıyor) → 1,5 sn sonra göreli kabul edilir */
  await page.evaluate(() => { window.__g = setInterval(() => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 200, beta: 90, gamma: 0, absolute: false })), 30); });
  await page.waitForTimeout(1700);
  expect(await page.evaluate(() => window.UraniaAR.st.manyetik)).toBe(false);
  /* Mutlak olaylar başlar (gerçek: α=0 → manyetik kuzey); göreli akış sürer */
  await page.evaluate(() => { window.__m = setInterval(() => window.dispatchEvent(new DeviceOrientationEvent('deviceorientationabsolute', { alpha: 0, beta: 90, gamma: 0, absolute: true })), 30); });
  await page.waitForTimeout(300);
  const ornek = [];
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(100);
    ornek.push(await page.evaluate(() => { const s = window.UraniaAR.st; return Math.round(window.UraniaAR.bakisYonu(s.R).az) + (s.manyetik ? 'M' : 'g'); }));
  }
  await page.evaluate(() => { clearInterval(window.__g); clearInterval(window.__m); });
  expect(new Set(ornek)).toEqual(new Set(['6M']));
  expect(await page.evaluate(() => window.UraniaAR.st.goreliKabul)).toBe(false);
});

test('A10: hızlı kapat-aç: eski oturumun zamanlayıcısı yeni oturumu erken dokunma moduna geçirmez', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(1000);
  await page.evaluate(() => { location.hash = '#gok'; });
  await page.waitForTimeout(100);
  await page.evaluate(() => { location.hash = '#ar'; });
  await page.waitForTimeout(800);   // eski zamanlayıcı (≈ 1,5 sn) bu arada dolmuş olurdu
  expect(await page.evaluate(() => window.UraniaAR.st.mod)).toBe('bekliyor');
  await page.waitForTimeout(1000);
  expect(await page.evaluate(() => window.UraniaAR.st.mod)).toBe('dokunma');
});

test.describe('iOS izin akışı (A6, A11)', () => {
  test('A11: izin reddedilince düğme gizlenir, red mesajı korunur, sürükleme çalışır', async ({ page }) => {
    await ios(page, 'denied');
    await page.goto('/index.html#ar');
    await page.waitForTimeout(300);
    await page.locator('#arPusula').click();
    await page.waitForTimeout(200);
    let d = await arDurum(page);
    expect(d).toEqual({ mod: 'dokunma', dugme: false, mesaj: 'Yön algılayıcı izni verilmedi; parmağınla sürükleyerek gezebilirsin.' });
    await page.waitForTimeout(1500);   // ilk 1,5 sn zamanlayıcısı mesajı ezmemeli
    d = await arDurum(page);
    expect(d.dugme).toBe(false);
    expect(d.mesaj).toBe('Yön algılayıcı izni verilmedi; parmağınla sürükleyerek gezebilirsin.');
    expect(await suruklemeCalisiyor(page)).toBe(true);
  });

  test('A6: izin verildi ama olay gelmiyorsa bekleme modunda kalmaz, sürükleme moduna geçer', async ({ page }) => {
    await ios(page, 'granted');
    await page.goto('/index.html#ar');
    await page.waitForTimeout(1800);
    await page.locator('#arPusula').click();
    await page.waitForTimeout(2300);
    const d = await arDurum(page);
    expect(d.mod).toBe('dokunma');
    expect(d.dugme).toBe(false);
    expect(d.mesaj).toContain('yön verisi gelmiyor');
    expect(await suruklemeCalisiyor(page)).toBe(true);
  });

  test('A6: izin verildikten sonra olay gelirse algılayıcı moduna geçer', async ({ page }) => {
    await ios(page, 'granted');
    await page.goto('/index.html#ar');
    await page.waitForTimeout(300);
    await page.locator('#arPusula').click();
    await page.waitForTimeout(200);
    await iosOlay(page, 0, 90, 0, 0);
    await page.waitForTimeout(2200);
    expect((await arDurum(page)).mod).toBe('algilayici');
    await expect(page.locator('#arMerkez .ar-yon')).toHaveText('6° K · yükseklik 0°');
  });
});

test('A7: sürükleme modunda yatay ekranda ufuk yatay kalır (ekran açısı uygulanmaz)', async ({ page }) => {
  await page.addInitScript(() => {
    try { Object.defineProperty(screen.orientation, 'angle', { get: () => 90, configurable: true }); } catch (e) { /* yok */ }
  });
  await page.goto('/index.html#ar');
  await page.waitForTimeout(1900);
  const r = await page.evaluate(() => { const s = window.UraniaAR.st; return { mod: s.mod, sol: window.UraniaAR.yansitTest(s.alt0, s.az0 - 10), sag: window.UraniaAR.yansitTest(s.alt0, s.az0 + 10), ust: window.UraniaAR.yansitTest(s.alt0 + 10, s.az0) }; });
  expect(r.mod).toBe('dokunma');
  expect(r.sag.x - r.sol.x).toBeGreaterThan(0.2);                 // aynı yükseklikte sağdaki nokta sağda
  expect(Math.abs(r.sag.y - r.sol.y)).toBeLessThan(0.02);
  expect(r.ust.y).toBeGreaterThan(0.1);                            // 10° yukarısı ekranda yukarıda
  expect(Math.abs(r.ust.x)).toBeLessThan(0.02);
});

test('A12: başucu yakınında yön tarifi büyük daire uzaklığına göre', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const A = window.UraniaAR, T = A.tarifHesapla;
    return {
      /* 87° yükseklikte 40° azimut farkı gerçekte ≈ 2,1° → tam karşında */
      yakin: T(A.enu(87, 0), { alt: 87, az: 40 }).m,
      /* 71,6° yükseklikte 20° azimut farkı ≈ 6,3° → "sola 6°" (eskiden "sola 20°") */
      deneb: T(A.enu(71.6, 292), { alt: 71.6, az: 312 }).m,
      /* Başucuna yakın hedef, bakış uzakta: azimut anlamsız → yukarı bak */
      basucu: T(A.enu(85, 0), { alt: 10, az: 180 }).m,
      /* Ufuk yakınında eski davranış korunur */
      ufuk: T(A.enu(39.5, 132.5), { alt: 0, az: 90 }).m
    };
  });
  expect(r.yakin).toBe('tam karşında');
  expect(r.deneb).toMatch(/^sola [56]°$/);
  expect(r.basucu).toBe('başucuna yakın: yukarı bak (75°)');
  expect(r.ufuk).toMatch(/^sağa 4[23]°, yukarı (39|40)°$/);
});

test('A12: arayüzde Deneb\'e 20° azimut kaymasıyla bakınca tarif küçük açıyı verir', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  const d = await page.evaluate(() => fetch('veri/yildizlar.json').then(r => r.json()).then(v => {
    const i = +Object.keys(v.adlar).find(k => v.adlar[k] === 'Deneb'), Y = window.UraniaAR.st.nesneler.yildiz;
    return { alt: Math.asin(Y[i * 3 + 2]) * 180 / Math.PI, az: (Math.atan2(Y[i * 3], Y[i * 3 + 1]) * 180 / Math.PI + 360) % 360, sapma: window.UraniaAR.st.sapma };
  }));
  await page.locator('#arBul').click();
  await page.locator('#arAra').fill('deneb');
  await page.locator('#arSonuc button[data-ad="Deneb"]').click();
  await yonVer(page, ((d.sapma - (d.az + 20)) % 360 + 360) % 360, 90 + d.alt, 0);
  await expect(page.locator('#arTarif')).toHaveText(/^sola [56]°$/);
});

test('A13: ufkun altındaki hedef tam karşıdayken sesli tarif "ufkun altında" der', async ({ page }) => {
  await sahteSes(page);
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await page.locator('#arSesli').click();
  const s = await page.evaluate(() => fetch('veri/yildizlar.json').then(r => r.json()).then(v => {
    const i = +Object.keys(v.adlar).find(k => v.adlar[k] === 'Sirius'), Y = window.UraniaAR.st.nesneler.yildiz;
    return { alt: Math.asin(Y[i * 3 + 2]) * 180 / Math.PI, az: (Math.atan2(Y[i * 3], Y[i * 3 + 1]) * 180 / Math.PI + 360) % 360, sapma: window.UraniaAR.st.sapma };
  }));
  expect(s.alt).toBeLessThan(0);
  await page.locator('#arBul').click();
  await page.locator('#arAra').fill('sirius');
  await page.locator('#arSonuc button[data-ad="Sirius"]').click();
  await yonVer(page, ((s.sapma - s.az) % 360 + 360) % 360, 90 + s.alt, 0);
  await page.waitForTimeout(300);
  await expect(page.locator('#arTarif')).toHaveText('tam karşında · ufkun altında');
  expect(await page.evaluate(() => window.__sahteSes.konusmalar.slice(-1)[0])).toBe('Sirius tam karşında, ufkun altında.');
});

test('A14: sesler geç yüklenirse "Sesli" düğmesi sonradan görünür', async ({ page }) => {
  await sahteSes(page, { gec: true });
  await page.goto('/index.html#ar');
  await page.waitForTimeout(2300);   // ses.js 1,5 sn bekler, ar.js 1,8 sn'de bakar: henüz Türkçe ses yok
  await expect(page.locator('#arSesli')).toBeHidden();
  await page.evaluate(() => window.__sesYukle());
  await expect(page.locator('#arSesli')).toBeVisible({ timeout: 2000 });
});

test('B4: hedef tam arkadayken sağ/sol titremez', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const A = window.UraniaAR, v = A.enu(0, 0);
    let onceki = null; const ls = [];
    for (const az of [180.5, 179.5, 181, 179, 180.5, 178]) {
      const t = A.tarifHesapla(v, { alt: 0, az }, onceki);
      onceki = { s: t.isaret }; ls.push(t.m.split(' ')[0]);
    }
    /* Pay (±10°) aşılınca yön doğal olarak döner */
    const t = A.tarifHesapla(v, { alt: 0, az: 165 }, onceki);
    return { ls, sonra: t.m };
  });
  expect(new Set(r.ls).size).toBe(1);
  expect(r.sonra).toBe('sola 165°');
});

test('B4: arayüzde hedef arkadayken tarif yönü ±1° kıpırtıda değişmez', async ({ page }) => {
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await page.locator('#arBul').click();
  await page.locator('#arAra').fill('satürn');
  await page.locator('#arSonuc button', { hasText: 'Satürn' }).click();
  /* Satürn azimutu 132,52° → arkası 312,52°; bakış ±0,7° titresin (α = sapma − azimut) */
  const yonler = new Set();
  for (const az of [312.0, 313.2, 311.8, 313.4, 312.1, 313.0]) {
    await yonVer(page, ((6.09 - az) % 360 + 360) % 360, 90 + 39.47, 0);
    yonler.add((await page.locator('#arTarif').innerText()).split(' ')[0]);
  }
  expect(yonler.size).toBe(1);
});

test('B1: iOS pusula başlığı telefon arkaya yatınca 180° dönse de bakış kuzeyde kalır (ofset)', async ({ page }) => {
  await ios(page, 'granted');
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  /* Telefon önce görece düz (β=30°): göreli α=100, başlık 0 (üst kenar manyetik kuzeyde) → ofset */
  await iosOlay(page, 100, 30, 0, 0);
  /* Sonra arkaya yatırılır (β=120°, kamera 30° yukarı); aynı yön ama başlık 180°'ye dönmüş gibi gelir */
  await iosOlay(page, 100, 120, 0, 180);
  await expect(page.locator('#arMerkez .ar-yon')).toHaveText('6° K · yükseklik 30°');
  /* Ofset yoksa (oturum yukarı bakarken başladı) eski davranış: 360 − başlık */
  await page.evaluate(() => { window.UraniaAR.st.iosOfset = null; window.UraniaAR.st.R = null; });
  await iosOlay(page, 100, 120, 0, 0);
  await expect(page.locator('#arMerkez .ar-yon')).toHaveText('6° K · yükseklik 30°');
});

test('A15: Tanı ekranı mutlak olay varken göreli olayı göstermez', async ({ page }) => {
  await page.goto('/index.html#tani');
  await page.waitForTimeout(300);
  await page.evaluate(() => { let i = 0; window.__t = setInterval(() => {
    window.dispatchEvent(new DeviceOrientationEvent('deviceorientationabsolute', { alpha: 0, beta: 0, gamma: 0, absolute: true }));
    if (i++ % 3 === 0) window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 137, beta: 0, gamma: 0, absolute: false }));
  }, 40); });
  await page.waitForTimeout(300);
  const g = new Set();
  for (let i = 0; i < 15; i++) { await page.waitForTimeout(90); g.add(await page.locator('#tnPusula').innerText()); }
  await page.evaluate(() => clearInterval(window.__t));
  expect([...g].length).toBe(1);
  expect([...g][0]).toContain('kuzeye göre');
  expect([...g][0]).toContain('α 0.0°');
});

test('Veri yüklenirken başka sekmeye geçilirse AR başlamaz', async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.route('**/veri/yildizlar.json', async r => { await new Promise(x => setTimeout(x, 1000)); await r.continue(); });
  await page.goto('/index.html#ar');
  await page.waitForTimeout(300);
  await page.evaluate(() => { location.hash = '#hesap'; });
  await page.waitForTimeout(1500);
  await expect(page.locator('body')).not.toHaveClass(/ar-acik/);
  await expect(page.locator('.alt-sekmeler')).toBeVisible();
  expect(await page.evaluate(() => window.UraniaAR.st.mod)).not.toBe('algilayici');
  /* Geri dönünce AR açılır */
  await page.evaluate(() => { location.hash = '#ar'; });
  await expect(page.locator('body')).toHaveClass(/ar-acik/);
});
