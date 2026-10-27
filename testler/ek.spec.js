// Ders çizimleri, ders içi deney, ünite sınavları ve gözlem görevleri.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

test('Çizimler: her dersin en az iki çizimi var; bölüm dizinleri geçerli; derste numaralı ve sesli okunur', async ({ page }) => {
  await page.goto('/index.html#ders');
  await expect(page.locator('.ders-liste li').first()).toBeVisible();
  const r = await page.evaluate(async () => {
    const D = await fetch('veri/dersler.json').then(x => x.json());
    const C = window.UraniaCizim.kayit, sorun = [], sayi = {};
    Object.values(C).forEach(t => {
      const d = D.dersler.find(x => x.id === t.ders);
      if (!d || !d.bolumler[t.bolum]) sorun.push(t.id);
      if (!t.baslik || !t.aciklama || t.aciklama.length < 40) sorun.push(t.id + ' açıklama');
      sayi[t.ders] = (sayi[t.ders] || 0) + 1;
    });
    return { sorun, eksik: D.dersler.filter(x => (sayi[x.id] || 0) < 2).map(x => x.id), toplam: Object.keys(C).length };
  });
  expect(r.sorun).toEqual([]);
  expect(r.eksik).toEqual([]);
  expect(r.toplam).toBeGreaterThanOrEqual(45);
  await page.goto('/index.html#ders/d1');
  const fig = page.locator('figure.cizim');
  expect(await fig.count()).toBeGreaterThanOrEqual(2);
  await expect(fig.first().locator('figcaption b')).toHaveText('Şekil 1.');
  await expect(fig.first().locator('figcaption')).toHaveAttribute('data-ses', /^Şekil 1: /);
  await expect(fig.first().locator('svg')).toHaveAttribute('aria-hidden', 'true');
});

test('Çizimlerdeki yazılar sesli okumada çevrilmemiş sembol bırakmaz', async ({ page }) => {
  await page.goto('/index.html#ders');
  await expect(page.locator('.ders-liste li').first()).toBeVisible();
  const kalan = await page.evaluate(() => {
    const t = Object.values(window.UraniaCizim.kayit).map(c => window.Okunus.okunus(c.baslik + '. ' + c.aciklama)).join(' ');
    return [...new Set([...t].filter(ch => !/[\p{L}\p{N}\s.,;:!?()'"’‘“”…%\-–—]/u.test(ch)))];
  });
  expect(kalan).toEqual([]);
});

test('Ders içi deney: d3\'te Kepler deneyi açılır, ölçer, kapanır; başka derse geçince döngü durur', async ({ page }) => {
  await page.goto('/index.html#ders/d3');
  const m = page.locator('.mini-deney[data-deney="kepler"]');
  await expect(m.locator('.mini-kap')).toBeHidden();
  await m.locator('.mini-ac').click();
  await expect(m.locator('#kpP')).not.toHaveText('—');
  await expect(m.locator('.mini-ac')).toHaveAttribute('aria-expanded', 'true');
  await m.locator('#kpOn button', { hasText: 'Jüpiter' }).click();
  await expect(m.locator('#kpP')).toHaveText('11,87 yıl');
  await m.locator('.mini-ac').click();
  await expect(m.locator('.mini-kap')).toBeHidden();
  await m.locator('.mini-ac').click();
  await expect(m.locator('#kpP')).not.toHaveText('—');
  await page.goto('/index.html#ders/d13');
  await page.locator('.mini-deney[data-deney="gecis"] .mini-ac').click();
  await expect(page.locator('.mini-deney[data-deney="gecis"] #gcDer')).toContainText('84 ppm');
});

test('Ünite sınavı: 12 soru, yanlış cevap açıklama gösterir, sonuç kaydedilir, yanlışlar karta düşer', async ({ page }) => {
  await page.goto('/index.html#ders');
  await expect(page.locator('.sinav-giris')).toHaveCount(5);
  await page.goto('/index.html#ders/sinav/gokyuzu');
  const sorular = await page.evaluate(() => fetch('veri/sinavlar.json').then(r => r.json()).then(j => j.uniteler.gokyuzu));
  expect(sorular.length).toBe(12);
  let dogru = 0;
  for (let i = 0; i < 12; i++) {
    const metin = await page.locator('#snSoru').innerText();
    const q = sorular.find(x => x.soru === metin);
    const sec = i % 2 === 0 ? q.dogru : (q.dogru + 1) % 4;      // yarısı doğru, yarısı yanlış
    if (sec === q.dogru) dogru++;
    await page.locator(`.sinav-secenek button[data-i="${sec}"]`).click();
    await expect(page.locator('.sinav-sonuc')).toContainText(sec === q.dogru ? 'Doğru.' : 'Doğrusu');
    await expect(page.locator('.sinav-secenek .dugme.dogru')).toHaveCount(1);
    await page.locator('#snSonraki').click();
  }
  await expect(page.locator('.sinav-puan')).toContainText(`${dogru} / 12`);
  const kayit = await page.evaluate(() => [JSON.parse(localStorage.getItem('urania_sinavSonuc')), Object.keys(JSON.parse(localStorage.getItem('urania_sinavYanlis')))]);
  expect(kayit[0].gokyuzu.slice(-1)[0]).toMatchObject({ dogru, toplam: 12 });
  expect(kayit[1].length).toBe(12 - dogru);
  await page.goto('/index.html#ders');
  await expect(page.locator('.kart-ozet')).toContainText(`${12 - dogru} kart`);
  await expect(page.locator('.sinav-giris').first()).toContainText(`son sonucun ${dogru}/12`);
});

test('Sınav soruları: dört farklı şık, geçerli ders ve bölüm, okunuşta sembol kalmaz', async ({ page }) => {
  await page.goto('/index.html#ders');
  await expect(page.locator('.ders-liste li').first()).toBeVisible();
  const r = await page.evaluate(async () => {
    const [S, D] = await Promise.all([fetch('veri/sinavlar.json').then(x => x.json()), fetch('veri/dersler.json').then(x => x.json())]);
    const sorun = [], ids = new Set(); let metin = '';
    Object.entries(S.uniteler).forEach(([u, ls]) => ls.forEach(q => {
      if (ids.has(q.id)) sorun.push('tekrar ' + q.id); ids.add(q.id);
      if (q.secenekler.length !== 4 || new Set(q.secenekler).size !== 4) sorun.push('şık ' + q.id);
      if (!(q.dogru >= 0 && q.dogru < 4)) sorun.push('doğru ' + q.id);
      const d = D.dersler.find(x => x.id === q.ders);
      if (!d || !d.bolumler[q.bolum]) sorun.push('bölüm ' + q.id);
      const un = D.uniteler.find(x => x.id === u);
      if (!un || un.dersler.indexOf(q.ders) < 0) sorun.push('ünite ' + q.id);
      metin += ' ' + [q.soru, ...q.secenekler, q.aciklama].map(window.Okunus.okunus).join(' ');
    }));
    return { sorun, kalan: [...new Set([...metin].filter(ch => !/[\p{L}\p{N}\s.,;:!?()'"’‘“”…%\-–—]/u.test(ch)))] };
  });
  expect(r.sorun).toEqual([]);
  expect(r.kalan).toEqual([]);
});

test('Gözlem görevleri: defterden açılır, bu gece görünenler önde; "Gördüm" defter formunu doğru cisimle açar ve görev tamamlanır', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('urania_konumOto', 'false');
    localStorage.setItem('urania_konum', JSON.stringify({ ad: 'Kadıköy', enlem: 40.99, boylam: 29.03, yukseklik: 0, oto: false, saatDilimi: 'Europe/Istanbul' }));
  });
  await page.clock.install({ time: new Date('2026-10-27T20:00:00+03:00') });
  await page.goto('/index.html#defter');
  await expect(page.locator('#dfGorev')).toBeVisible();
  const G = await page.evaluate(() => fetch('veri/gorevler.json').then(r => r.json()).then(j => j.gorevler));
  expect(G.length).toBeGreaterThanOrEqual(30);
  await expect(page.locator('#dfGorevSayi')).toHaveText(`${G.length} görevden 0 tanesi tamam`);
  await page.locator('#dfGorev').click();
  await expect(page.locator('.gorev-liste li')).toHaveCount(G.length);
  await expect(page.locator('h2').first()).toHaveText('Bu gece yapılabilir');
  /* Ülker Ekim sonu gecesinde yüksek: ilk listede */
  const ulker = page.locator('.gorev-liste li', { hasText: 'Ülker' }).first();
  await expect(ulker).toContainText('bu gece en çok 7');
  await ulker.locator('summary').click();
  await ulker.locator('a', { hasText: 'Gördüm' }).click();
  await expect(page.locator('#dfCisim')).toHaveValue('hedef:M45');
  await page.locator('#dfKaydet').click();
  await page.goto('/index.html#defter/gorevler');
  await expect(page.locator('.alt-baslik').first()).toContainText('1 tanesini yaptın');
  await expect(page.locator('.rozetler')).toContainText('İlk adım');
  await expect(page.locator('h2', { hasText: 'Tamamlananlar' })).toBeVisible();
  /* Görevlerin anahtarları defter kataloğunda var */
  const yok = await page.evaluate(async () => {
    const [g, h, y, m] = await Promise.all(['gorevler', 'hedefler', 'yildizlar', 'meteor'].map(a => fetch('veri/' + a + '.json').then(r => r.json())));
    const adlar = new Set(Object.values(y.adlar));
    return g.gorevler.filter(x => {
      const [t, a] = x.anahtar.split(':');
      if (t === 'hedef') return !h.hedefler.some(z => z.id === a);
      if (t === 'yildiz') return !adlar.has(a);
      if (t === 'meteor') return !m.yagmurlar.some(z => z.kod === a);
      if (t === 'cisim') return !['Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(a);
      return t !== 'gorev';
    }).map(x => x.id);
  });
  expect(yok).toEqual([]);
});

test('Gözlem görevleri: ay aralığı yazımı (Aralık→Ocak sarması dahil)', async ({ page }) => {
  await page.goto('/index.html#defter');
  const r = await page.evaluate(() => [Gorevler.ayAraligi([9, 10, 11, 0, 1]), Gorevler.ayAraligi([3, 4, 8]), Gorevler.ayAraligi([...Array(12).keys()]), Gorevler.ayAraligi([])]);
  expect(r).toEqual(['Ekim–Şubat', 'Nisan–Mayıs, Eylül', 'yıl boyu', '']);
});

test('İnceleme bulguları: sınav adresi doğrudan açılır; ders bağlantısından geri dönünce sınav sürer; sonuç bir kez kaydedilir', async ({ page }) => {
  await page.goto('/index.html#ders/sinav/evren');
  await expect(page.locator('h1')).toHaveText(/^Ünite sınavı: \S/);   // h1 ünite adını da içerir (erişilebilirlik bulgusu 13)
  await page.locator('.sinav-secenek button').first().click();
  await page.locator('#snSonraki').click();
  await expect(page.locator('.kucuk.soluk').first()).toContainText('Soru 2 / 12');
  const soru2 = await page.locator('#snSoru').innerText();
  await page.goto('/index.html#ders/d7');
  await page.goBack();
  await expect(page.locator('#snSoru')).toHaveText(soru2);
  for (let i = 1; i < 12; i++) { await page.locator('.sinav-secenek button').first().click(); await page.locator('#snSonraki').click(); }
  await expect(page.locator('.sinav-puan')).toBeVisible();
  await page.goto('/index.html#gok');
  await page.goBack();
  await expect(page.locator('.sinav-puan')).toBeVisible();
  const n = await page.evaluate(() => JSON.parse(localStorage.getItem('urania_sinavSonuc')).evren.length);
  expect(n).toBe(1);
});

test('İnceleme bulguları: ders içi deneyde hızlı aç-kapa açık deney bırakmaz; meteor görevi zirveden uzakken "bu gece" sayılmaz', async ({ page }) => {
  await page.goto('/index.html#ders/d3');
  const m = page.locator('.mini-deney[data-deney="kepler"]');
  await m.locator('.mini-ac').dblclick();
  await page.waitForTimeout(600);
  await expect(m.locator('.mini-kap')).toBeHidden();
  await expect(m.locator('canvas')).toHaveCount(0);
  await page.clock.install({ time: new Date('2026-10-27T20:00:00+03:00') });
  await page.goto('/index.html#defter/gorevler');
  await expect(page.locator('.gorev-liste li').first()).toBeVisible();
  const bugece = page.locator('h2', { hasText: 'Bu gece yapılabilir' }).locator('xpath=following-sibling::ul[1]');
  await expect(bugece.locator('li', { hasText: 'Perseid' })).toHaveCount(0);
  await expect(page.locator('.gorev-liste li', { hasText: 'Jüpiter' }).first()).toContainText('bu gece');
});
