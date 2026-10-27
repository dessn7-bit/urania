'use strict';
/* Erişilebilirlik denetimi (2026-10-28) bulgularının regresyon testleri: AR dolu düğmesi, kırmızı mod karşıtlığı ve
   kırmızı olmayan sızıntılar, deney kanvası süzgeci, sabit bar altında kalan odak, canlı bölgeler, sesli okuma odağı,
   bölüm içi gezinmede odak ve sayfa başlığı, form hataları, kaydırıcı adları, dokunma hedefleri, başlık düzeni,
   güvenli alan, dar ekran taşması. Ağ isteği atılmaz: yerel sunucu dışındaki her istek kesilir; hava ve yer adı
   sahte yanıtla, CelesTrak testler/yardim.js fikstürüyle karşılanır. */
const { test, expect } = require('@playwright/test');
const { celestrak } = require('./yardim');

const SABIT_AN = new Date('2026-10-27T21:00:00+03:00');
const KONUM = { ad: 'Fetih Mahallesi, Ataşehir', enlem: 41.0046, boylam: 29.0762, yukseklik: 20, oto: false, saatDilimi: 'Europe/Istanbul' };
const KAYIT = { id: 'a1', zaman: '2026-10-27T18:00:00.000Z', cisim: { anahtar: 'cisim:Moon', ad: 'Ay' }, alet: '7×50 dürbün', kosul: 'Berrak', not: 'Kraterler net.',
  konum: { ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0 }, otomatik: { ayOran: 50 } };

/* 72 saatlik sahte Open-Meteo yanıtı (gece açık, gündüz bulutlu) */
function sahteHava() {
  const t0 = Date.UTC(2026, 9, 27) / 1000;
  const h = { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [], precipitation_probability: [], precipitation: [] };
  for (let i = 0; i < 72; i++) {
    const t = t0 + i * 3600, s = new Date((t + 3 * 3600) * 1000).getUTCHours(), b = (s >= 21 || s <= 2) ? 15 : 70;
    h.time.push(t); h.cloud_cover.push(b); h.cloud_cover_low.push(b); h.cloud_cover_mid.push(0); h.cloud_cover_high.push(0);
    h.relative_humidity_2m.push(70); h.wind_speed_10m.push(8); h.precipitation_probability.push(0); h.precipitation.push(0);
  }
  return { latitude: 41, longitude: 29.08, hourly: h };
}

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
  await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: sahteHava() }));
  await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: { suburb: 'Fetih Mahallesi', town: 'Ataşehir' } } }));
  await celestrak(page);
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
  await page.addInitScript(([k, kayit]) => {
    if (!sessionStorage.getItem('er_kuruldu')) {
      sessionStorage.setItem('er_kuruldu', '1');
      localStorage.setItem('urania_konumOto', 'false');
      localStorage.setItem('urania_konum', JSON.stringify(k));
      localStorage.setItem('urania_defter', JSON.stringify([kayit]));
    }
    /* WCAG karşıtlık oranı: CSS renk dizeleri (rgb/rgba/#), yarı saydam ön renk zemine harmanlanır */
    window.__rgb = s => {
      const c = document.createElement('canvas').getContext('2d'); c.fillStyle = '#000'; c.fillStyle = s; const x = c.fillStyle;
      if (x[0] === '#') return [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)).concat(1);
      const v = x.match(/[\d.]+/g).map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1];
    };
    window.__harman = (u, z) => [0, 1, 2].map(i => u[i] * u[3] + z[i] * (1 - u[3])).concat(1);
    window.__oran = (a, b) => {
      const z = window.__rgb(b), o = window.__harman(window.__rgb(a), z);
      const L = c => { const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
      const [p, q] = [L(o), L(z)].sort((m, n) => n - m); return (p + 0.05) / (q + 0.05);
    };
  }, [KONUM, KAYIT]);
  await page.clock.install({ time: SABIT_AN });
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function kirmizi(page) {
  await page.evaluate(() => localStorage.setItem('urania_kirmizi', 'true'));
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/kirmizi/);
}
/* Ekran görüntüsünde kırmızı olmayan (G ya da B kanalı belirgin) piksel sayısı; kenardan pay bırakılır */
async function kirmiziOlmayan(page, locator, pay) {
  const b = await locator.screenshot();
  return page.evaluate(async ([b64, pay]) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let n = 0, maxR = 0;
    for (let i = 0; i < d.length; i += 4) {
      const px = (i / 4) % c.width, py = Math.floor(i / 4 / c.width);
      if (px < pay || py < pay || px >= c.width - pay || py >= c.height - pay) continue;
      maxR = Math.max(maxR, d[i]);
      if ((d[i + 1] > d[i] * 0.3 + 6 || d[i + 2] > d[i] * 0.3 + 6) && Math.max(d[i + 1], d[i + 2]) > 20) n++;
    }
    return { n, maxR };
  }, [b.toString('base64'), pay || 0]);
}

test('1: AR "Pusulayı aç" (dolu düğme) yazısı zeminiyle en az 4,5:1, normal ve kırmızı modda', async ({ page }) => {
  await page.goto('/index.html#ar');
  for (const kip of ['normal', 'kirmizi']) {
    if (kip === 'kirmizi') { await kirmizi(page); }
    await page.waitForSelector('#arPusula', { state: 'attached' });   // AR ekranı veri yüklenince kurulur
    await page.evaluate(() => { document.getElementById('arPusula').hidden = false; });
    const r = await page.evaluate(() => { const s = getComputedStyle(document.getElementById('arPusula')); return { renk: s.color, zemin: s.backgroundColor, oran: window.__oran(s.color, s.backgroundColor) }; });
    expect(r.oran, kip + ' ' + JSON.stringify(r)).toBeGreaterThanOrEqual(4.5);
    expect(r.zemin, 'zemin opak (yarı saydam AR düğme zemini dolu düğmeyi ezmez)').toMatch(/^rgb\(/);
  }
});

test('2: kırmızı modda metin renkleri her yüzeyde en az 4,5:1 ve yalnız kırmızı; normal mod değişmedi', async ({ page }) => {
  await page.goto('/index.html#ders');
  const normal = await page.evaluate(() => ['--pirinc', '--iyi', '--hedef'].map(v => getComputedStyle(document.documentElement).getPropertyValue(v).trim()));
  expect(normal).toEqual(['#C8A45D', '#9CC5A1', '#8FB8DE']);
  await kirmizi(page);
  const r = await page.evaluate(() => {
    const st = getComputedStyle(document.documentElement), d = v => st.getPropertyValue(v).trim();
    const yuzey = ['--gece', '--levha', '--levha-2'].map(d);
    return ['--pirinc', '--iyi', '--hedef', '--ay', '--uyari', '--gezegen', '--yildiz', '--parsomen', '--soluk'].map(v => ({
      v, c: d(v), rgb: window.__rgb(d(v)), oranlar: yuzey.map(z => +window.__oran(d(v), z).toFixed(2)),
      /* okunan paragraf ve çizim bantları: yarı saydam vurgu zemini üstünde ana metin */
      soluk: +window.__oran(d('--parsomen'), 'rgb(' + window.__harman(window.__rgb(d('--pirinc-soluk')), window.__rgb(d('--levha'))).slice(0, 3).join(',') + ')').toFixed(2)
    }));
  });
  for (const x of r) {
    x.oranlar.forEach(o => expect(o, x.v + ' ' + x.c + ' ' + x.oranlar).toBeGreaterThanOrEqual(4.5));
    expect(x.rgb[1], x.v + ' yeşil').toBeLessThanOrEqual(x.rgb[0] * 0.3);
    expect(x.rgb[2], x.v + ' mavi').toBeLessThanOrEqual(x.rgb[0] * 0.3);
  }
  expect(r[0].soluk).toBeGreaterThanOrEqual(4.5);
  /* dolu düğme: siyah yazı kırmızı zeminde */
  const dolu = await page.evaluate(() => { const b = document.querySelector('.sekmeler a, .dugme.dolu'); const s = getComputedStyle(document.querySelector('.dugme.dolu') || b); return window.__oran(s.color, s.backgroundColor); });
  expect(dolu).toBeGreaterThanOrEqual(4.5);
});

test('2: ders çizimlerindeki etiketler (d1, d4, d6, d10) iki modda da altındaki opak zeminde en az 4,5:1', async ({ page }) => {
  test.setTimeout(60000);
  const olc = () => page.evaluate(() => {
    const out = [];
    document.querySelectorAll('figure.cizim svg text').forEach(t => {
      t.scrollIntoView({ block: 'center' });
      const b = t.getBoundingClientRect(); if (!b.width) return;
      const svg = t.ownerSVGElement, fig = svg.closest('figure');
      let zemin = window.__rgb(getComputedStyle(fig).backgroundColor);
      const altta = document.elementsFromPoint(b.left + b.width / 2, b.top + b.height / 2).filter(e => e !== t && svg.contains(e) && !['svg', 'g', 'text', 'tspan'].includes(e.tagName)).reverse();
      for (const e of altta) {
        const s = getComputedStyle(e); if (s.fill === 'none' || /url/.test(s.fill)) continue;
        const f = window.__rgb(s.fill); f[3] *= (+s.fillOpacity) * (+s.opacity); if (f[3] > 0.05) zemin = window.__harman(f, zemin);
      }
      const s = getComputedStyle(t), f = window.__rgb(s.fill); f[3] *= (+s.fillOpacity) * (+s.opacity);
      const o = window.__oran('rgba(' + f.join(',') + ')', 'rgb(' + zemin.slice(0, 3).map(Math.round).join(',') + ')');
      if (o < 4.5) out.push(fig.id + ' "' + t.textContent + '" ' + o.toFixed(2));
    });
    return out;
  });
  for (const kip of ['normal', 'kirmizi']) {
    if (kip === 'kirmizi') { await page.goto('/index.html#ders'); await kirmizi(page); }
    for (const d of ['d1', 'd4', 'd6', 'd10']) {
      await page.goto('/index.html#ders/' + d);
      await expect(page.locator('figure.cizim svg').first()).toBeVisible();
      expect(await olc(), kip + ' ' + d).toEqual([]);
    }
  }
});

test('3: kırmızı modda deney kanvası bir kez kızarır: süzgeç yeşil/maviyi kırmızıya ekler, etiketler saf kırmızı (5,25:1)', async ({ page }) => {
  await page.goto('/index.html#deney/karadelik');
  await kirmizi(page);
  const m = await page.locator('#kirmiziSuz feColorMatrix').getAttribute('values');
  expect(m.trim().split(/\s+/).slice(0, 5).map(Number)).toEqual([1, 0.5, 0.2, 0, 0]);
  expect(m.trim().split(/\s+/).slice(5, 15).map(Number).every(v => v === 0)).toBe(true);
  for (const d of ['karadelik', 'tayf', 'kepler']) {
    await page.goto('/index.html#deney/' + d);
    const cv = page.locator('.sahne canvas').first();
    await expect(cv).toBeVisible();
    await page.waitForTimeout(400);
    const r = await kirmiziOlmayan(page, cv, 3);
    expect(r.n, d + ' kırmızı olmayan piksel').toBe(0);
    expect(r.maxR, d + ' en parlak piksel (etiketler)').toBe(255);
  }
});

test('4: Tab ile gezinirken odak yapışkan üst barın ve sabit alt menünün altında kalmaz', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 700 });
  await page.goto('/index.html#ders');
  await expect(page.locator('.ders-liste li').first()).toBeVisible();
  const sp = await page.evaluate(() => { const s = getComputedStyle(document.documentElement); return [s.scrollPaddingTop, s.scrollPaddingBottom]; });
  expect(sp).toEqual(['64px', '76px']);
  await page.locator('h1').focus();
  const kotu = [];
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const e = document.activeElement; if (!e || e.closest('.ust, .alt-sekmeler')) return null;
      const b = e.getBoundingClientRect(), u = document.querySelector('.ust').getBoundingClientRect(), a = document.querySelector('.alt-sekmeler').getBoundingClientRect();
      return { ad: (e.textContent || '').trim().slice(0, 30), ust: b.top - u.bottom, alt: a.top - b.bottom };
    });
    if (r && (r.ust < 0 || r.alt < 0)) kotu.push(r);
  }
  expect(kotu).toEqual([]);
});

test('5: Kepler (ve öteki deneyler) beklerken canlı bölgeye kare kare yazmaz; kullanıcı girdisinden sonraki ölçüm duyurulur', async ({ page }) => {
  test.setTimeout(60000);
  const canliYazim = () => page.evaluate(() => new Promise(res => {
    let n = 0; const kap = document.querySelector('#deneyKap');
    const canli = e => { const c = e && e.closest('[aria-live], [role="status"], output'); return c && c.getAttribute('aria-live') !== 'off'; };
    const mo = new MutationObserver(ms => ms.forEach(m => { const e = m.target.nodeType === 1 ? m.target : m.target.parentElement; if (canli(e)) n++; }));
    mo.observe(kap, { childList: true, subtree: true, characterData: true });
    setTimeout(() => { mo.disconnect(); res(n); }, 1200);
  }));
  for (const d of ['kepler', 'yorunge', 'gelgit', 'tayf', 'evreler', 'gecis', 'yildiz', 'karadelik', 'gorelilik', 'hubble']) {
    await page.goto('/index.html#deney/' + d);
    await expect(page.locator('#deneyKap .olcumler')).toBeVisible();
    await page.waitForTimeout(300);
    expect(await canliYazim(), d).toBe(0);
  }
  await page.goto('/index.html#deney/kepler');
  await expect(page.locator('#kpV')).not.toHaveText('—');
  await expect(page.locator('#kpV').locator('xpath=..')).toHaveAttribute('aria-live', 'off');
  await expect(page.locator('#kpP').locator('xpath=..')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('#kpP').locator('xpath=..')).toHaveAttribute('aria-atomic', 'true');
  const once = await page.locator('#kpP').textContent();
  await page.locator('#deneyKap button', { hasText: 'Mars' }).click();
  await expect(page.locator('#kpP')).not.toHaveText(once);
});

test('6: sesli okumada basılan Dinle/Duraklat düğmesi yeniden çizilince odak eşdeğer düğmede kalır', async ({ page }) => {
  await page.addInitScript(() => {
    let aktif = null;
    function Utt(t) { this.text = String(t); this.lang = ''; this.rate = 1; this.voice = null; }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utt, configurable: true, writable: true });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      get speaking() { return !!aktif; }, get pending() { return false; }, paused: false,
      getVoices() { return [{ name: 'Sahte Türkçe', lang: 'tr-TR', localService: true, default: true }]; },
      speak(u) { aktif = u; setTimeout(() => { if (aktif === u && u.onstart) u.onstart({}); }, 0); },
      cancel() { const a = aktif; aktif = null; if (a && a.onerror) setTimeout(() => a.onerror({ error: 'interrupted' }), 0); },
      pause() {}, resume() {}, addEventListener() {} } });
  });
  await page.goto('/index.html#ders/d1');
  const dinle = page.locator('#dsSes [data-so="dinle"]');
  await expect(dinle).toBeVisible();
  await dinle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#dsSes [data-so="duraklat"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#dsSes [data-so="devam"]')).toBeFocused();
  await page.locator('#dsSes [data-so="durdur"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#dsSes [data-so="dinle"]')).toBeFocused();
});

test('7 ve 13: bölüm içi gezinmede (ve geri tuşunda) odak yeni görünümün başlığına; sayfa başlığı alt görünümü söyler', async ({ page }) => {
  await page.goto('/index.html#deney');
  await page.locator('a[href="#deney/kepler"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#b-deney h1')).toHaveText('Kepler yasaları');
  await expect(page.locator('#b-deney h1')).toBeFocused();
  await expect(page).toHaveTitle('Urania — Deneyler — Kepler yasaları');
  await page.goBack();
  await expect(page.locator('#b-deney h1')).toHaveText('Deneyler');
  await expect(page.locator('#b-deney h1')).toBeFocused();
  await expect(page).toHaveTitle('Urania — Deneyler');

  await page.evaluate(() => localStorage.setItem('urania_dersBitti', JSON.stringify({ d1: Date.parse('2026-10-25T10:00:00Z') })));   // kart olsun
  await page.goto('/index.html#ders');
  await page.reload();
  await page.locator('a[href="#ders/kartlar"]').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#b-ders h1')).toHaveText('Tekrar kartları');
  await expect(page.locator('#b-ders h1')).toBeFocused();
  await expect(page).toHaveTitle('Urania — Dersler — Tekrar kartları');

  await page.goto('/index.html#defter');
  await expect(page.locator('#dfGorev')).toBeVisible();
  await page.locator('#dfGorev').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#b-defter h1')).toHaveText('Gözlem görevleri');
  await expect(page.locator('#b-defter h1')).toBeFocused();
  await page.goBack();
  await expect(page.locator('#b-defter h1')).toHaveText('Gözlem defteri');
  await expect(page.locator('#b-defter h1')).toBeFocused();

  /* Sınav: h1 ünite adını içerir, sayfa başlığı da */
  await page.goto('/index.html#ders/sinav/evren');
  await expect(page.locator('#b-ders h1')).toHaveText(/^Ünite sınavı: \S/);
  const h1 = await page.locator('#b-ders h1').textContent();
  await expect(page).toHaveTitle('Urania — Dersler — ' + h1);
  await page.goto('/index.html#ders/d3');
  await expect(page).toHaveTitle(/^Urania — Dersler — \S/);
});

test('8a: defterde "Listede yok" seçilip ad boşken görünür hata metni, aria-invalid ve aria-describedby; ad yazılınca kalkar', async ({ page }) => {
  await page.goto('/index.html#defter');
  await page.locator('#dfYeni').click();
  await page.locator('#dfCisim').selectOption('diger');
  await page.locator('#dfKaydet').click();
  const g = page.locator('#dfDiger');
  await expect(g).toBeFocused();
  await expect(g).toHaveAttribute('aria-invalid', 'true');
  await expect(g).toHaveAttribute('aria-describedby', 'dfDigerHata');
  await expect(page.locator('#dfDigerHata')).toBeVisible();
  await expect(page.locator('#dfDigerHata')).toHaveText(/adını yaz/);
  await g.fill('Andromeda');
  await expect(g).not.toHaveAttribute('aria-invalid', /.*/);
  await expect(g).not.toHaveAttribute('aria-describedby', /.*/);
  await expect(page.locator('#dfDigerHata')).toBeHidden();
});

test('8b ve 9: konum paneli adını başlığından alır; hatalı girdi durum satırına (role=status) bağlanır', async ({ page }) => {
  await page.goto('/index.html#gok');
  await page.locator('#gkKonumDegis').click();
  await expect(page.getByRole('dialog', { name: 'Gözlem yeri' })).toBeVisible();
  await expect(page.locator('#gkKDurum')).toHaveAttribute('role', 'status');
  await page.locator('#gkKEnlem').fill('abc');
  await page.locator('#gkKKaydet').click();
  await expect(page.locator('#gkKEnlem')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#gkKEnlem')).toHaveAttribute('aria-describedby', 'gkKDurum');
  await expect(page.locator('#gkKBoylam')).toHaveAttribute('aria-invalid', 'false');
  await expect(page.locator('#gkKBoylam')).not.toHaveAttribute('aria-describedby', /.*/);
  await expect(page.locator('#gkKDurum')).toContainText('Enlem −90 ile 90');
  await expect(page.locator('#gkKEnlem')).toBeFocused();
});

test('8c: Hesap girdisi hatalıyken aria-invalid ve sonuç kutusuna aria-describedby; düzelince kalkar', async ({ page }) => {
  await page.goto('/index.html#hesap');
  const g = page.locator('#uzD');
  await g.fill('-3');
  await expect(g).toHaveAttribute('aria-invalid', 'true');
  await expect(g).toHaveAttribute('aria-describedby', 'uzS');
  await expect(page.locator('#uzS')).toContainText('Pozitif bir sayı yaz');
  await g.fill('5');
  await expect(g).not.toHaveAttribute('aria-invalid', /.*/);
  await expect(g).not.toHaveAttribute('aria-describedby', /.*/);
  /* iki girdili kartta yalnız hatalı olan işaretlenir */
  await page.locator('#mgM').fill('x');
  await expect(page.locator('#mgM')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#mgD')).not.toHaveAttribute('aria-invalid', /.*/);
});

test('10: kırmızı modda onay kutusu, takvim simgesi, yer tutucu ve boyutlandırma tutamacı yalnız kırmızı', async ({ page }) => {
  await page.goto('/index.html#ders/d3');
  await kirmizi(page);
  const kutu = page.locator('#dsSurekli');
  await kutu.scrollIntoViewIfNeeded();
  expect((await kirmiziOlmayan(page, kutu)).n, 'işaretsiz onay kutusu').toBe(0);
  await kutu.check();
  expect((await kirmiziOlmayan(page, kutu)).n, 'işaretli onay kutusu').toBe(0);
  for (const [d, id] of [['gelgit', '#ggGunes'], ['hubble', '#hbOzel']]) {
    await page.goto('/index.html#deney/' + d);
    await page.locator(id).scrollIntoViewIfNeeded();
    await expect(page.locator(id)).toBeChecked();
    expect((await kirmiziOlmayan(page, page.locator(id))).n, d).toBe(0);
  }
  await page.goto('/index.html#defter/yeni');
  await expect(page.locator('#dfZaman')).toBeVisible();
  expect((await kirmiziOlmayan(page, page.locator('#dfZaman'))).n, 'datetime-local').toBe(0);
  expect((await kirmiziOlmayan(page, page.locator('#dfNot'))).n, 'yer tutucu ve tutamaç').toBe(0);
  const ph = await page.evaluate(() => getComputedStyle(document.getElementById('dfNot'), '::placeholder').color);
  expect(ph).toBe('rgb(230, 58, 40)');
  await page.goto('/index.html#gok');
  await expect(page.locator('#gkTarih')).toBeVisible();
  expect((await kirmiziOlmayan(page, page.locator('#gkTarih'))).n, 'date').toBe(0);
});

test('11 ve 15: normal modda yer tutucu 4,5:1; girdi kenarı 3:1; odakta görünür halka (≥3:1)', async ({ page }) => {
  await page.goto('/index.html#defter/yeni');
  await expect(page.locator('#dfNot')).toBeVisible();
  const r = await page.evaluate(() => {
    const t = document.getElementById('dfNot'), z = getComputedStyle(t).backgroundColor;
    return { ph: window.__oran(getComputedStyle(t, '::placeholder').color, z), kenar: window.__oran(getComputedStyle(t).borderTopColor, z) };
  });
  expect(r.ph).toBeGreaterThanOrEqual(4.5);
  expect(r.kenar).toBeGreaterThanOrEqual(3);
  await page.goto('/index.html#hesap');
  await page.locator('#uzD').focus();
  const h = await page.evaluate(() => {
    const s = getComputedStyle(document.getElementById('uzD')), z = getComputedStyle(document.body).backgroundColor;
    return { stil: s.outlineStyle, kalin: parseFloat(s.outlineWidth), oran: window.__oran(s.outlineColor, z), kenar: window.__oran(s.borderTopColor, z) };
  });
  expect(h.stil).toBe('solid');
  expect(h.kalin).toBeGreaterThanOrEqual(2);
  expect(h.oran).toBeGreaterThanOrEqual(3);
});

test('12: kaydırıcının adı yalnız etiket metni, değer aria-valuetext\'te (deney ve gökyüzü sönüklük sınırı)', async ({ page }) => {
  await page.goto('/index.html#deney/kepler');
  const a = page.getByRole('slider', { name: 'Yarı büyük eksen a', exact: true });
  await expect(a).toHaveCount(1);
  await expect(a).toHaveAttribute('aria-valuetext', /\d+,\d+ AB/);
  const adlar = await page.locator('#deneyKap input[type=range]').evaluateAll(ls => ls.map(g => [g.id, g.getAttribute('aria-labelledby'), (document.getElementById(g.getAttribute('aria-labelledby')) || {}).textContent]));
  adlar.forEach(([id, by, ad]) => { expect(by, id).toBe(id + 'Ad'); expect(ad, id).toBeTruthy(); });
  await page.goto('/index.html#gok');
  const k = page.getByRole('slider', { name: 'Görünen en sönük yıldız', exact: true });
  await expect(k).toHaveAttribute('aria-valuetext', '4,0 kadir, banliyö');
  await k.fill('5');
  await expect(k).toHaveAttribute('aria-valuetext', '5,0 kadir, kırsal');
});

test('14: defterde Düzenle/Sil en az 24×24 px ve kayıt adını söyler', async ({ page }) => {
  await page.goto('/index.html#defter');
  const sil = page.locator('#dfListe button[data-is="sil"]');
  await expect(sil).toHaveAttribute('aria-label', 'Ay kaydını sil');
  await expect(page.locator('#dfListe button[data-is="duzenle"]')).toHaveAttribute('aria-label', 'Ay kaydını düzenle');
  for (const b of [sil, page.locator('#dfListe button[data-is="duzenle"]')]) {
    const k = await b.boundingBox();
    expect(k.width).toBeGreaterThanOrEqual(24);
    expect(k.height).toBeGreaterThanOrEqual(24);
  }
  await sil.click();
  await expect(sil).toHaveText('Silmek için tekrar bas');
  await expect(sil).toHaveAttribute('aria-label', 'Ay kaydını silmek için tekrar bas');
});

test('15: Hesap başlıkları h1 → h2 (görünüm aynı); bulut çubukları grup; AR kanvası görsel ve gizli h1', async ({ page }) => {
  await page.goto('/index.html#hesap');
  await expect(page.locator('#b-hesap h2').first()).toBeVisible();
  await expect(page.locator('#b-hesap h3')).toHaveCount(0);
  const kartSayisi = await page.locator('#b-hesap .hesap-kart').count();
  await expect(page.locator('#b-hesap .hesap-kart > h2')).toHaveCount(kartSayisi);
  const fs = await page.locator('#b-hesap .hesap-kart > h2').first().evaluate(h => [getComputedStyle(h).fontSize, getComputedStyle(h).fontWeight]);
  expect(fs).toEqual(['19px', '600']);
  await page.goto('/index.html#gok');
  await expect(page.locator('.hava-cubuklar')).toHaveAttribute('role', 'group');
  await page.goto('/index.html#ar');
  await expect(page.locator('#arKanvas')).toHaveAttribute('role', 'img');
  await expect(page.locator('#b-ar h1')).toHaveText('Gökyüzüne bak');
});

test('16: üst bar ve AR katmanlarının yan dolgusu güvenli alanı hesaba katar', async ({ page }) => {
  await page.goto('/index.html#gok');
  const r = await page.evaluate(() => {
    const kural = {};
    for (const ss of document.styleSheets) for (const k of ss.cssRules) if (k.selectorText) kural[k.selectorText] = (kural[k.selectorText] || '') + k.cssText;
    return ['.ust', '.ar-ust', '.ar-merkez'].map(s => kural[s] || '');
  });
  r.forEach(k => { expect(k).toContain('env(safe-area-inset-left)'); expect(k).toContain('env(safe-area-inset-right)'); });
});

test('17: çok dar görünümde (206 ve 180 px) sayfa yatay taşmaz, üst bar tek satır, alt menü sığar', async ({ page }) => {
  test.setTimeout(60000);
  for (const [w, h] of [[206, 458], [180, 400]]) {
    await page.setViewportSize({ width: w, height: h });
    for (const ekran of ['ders', 'gok', 'hesap', 'deney/kepler']) {
      await page.goto('/index.html#' + ekran);
      await expect(page.locator('#b-' + ekran.split('/')[0] + ' h1').first()).toBeVisible();
      if (ekran === 'ders') await expect(page.locator('.ders-liste .durum').first()).toBeVisible();
      if (ekran === 'gok') await expect(page.locator('#gkPlan li').first()).toBeVisible();
      const r = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
        ust: document.querySelector('.ust').getBoundingClientRect().height,
        altSag: Math.max(...[...document.querySelectorAll('.alt-sekmeler a')].map(a => a.getBoundingClientRect().right)),
        adlar: [...document.querySelectorAll('.alt-sekmeler a')].map(a => a.textContent.trim())
      }));
      expect(r.sw, w + ' ' + ekran).toBeLessThanOrEqual(r.cw);
      expect(r.ust, w + ' ' + ekran + ' üst bar').toBeLessThan(60);
      expect(r.altSag, w + ' ' + ekran + ' alt menü').toBeLessThanOrEqual(r.cw + 0.5);
      expect(r.adlar).toEqual(['Gökyüzü', 'Deneyler', 'Dersler', 'Defter', 'Hesap']);   // yazılar görsel gizli olsa da ad kalır
    }
  }
  await expect(page.getByRole('button', { name: 'Kırmızı ışık' })).toBeVisible();
});
