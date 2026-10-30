// Deney "analemma" (Güneş saati ve zaman denklemi): saf hesaplar kaynaklı referans değerlerle, arayüz ve dar ekran.
// Referanslar: Wikipedia "Equation of time" (uç değerler, bileşen genlikleri, sıfır geçişleri), USNO İstanbul güneyden geçiş
// saatleri (41,00° K, 29,08° D, UTC+3), uygulamanın gök hesabı (Astronomy Engine, cizim_v3.js d22). Ayrıntı: arastirma/deney_v3/analemma_kaynak.md
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.hatalar = [];
  page.on('pageerror', e => page.hatalar.push(String(e)));
});
test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

async function ac(page) {
  await page.goto('/index.html#deney/analemma');
  await expect(page.locator('#anFark')).not.toHaveText('—');
}

test('Zaman denklemi hesapları: kaynaklı referans değerleri', async ({ page }) => {
  await ac(page);
  const r = await page.evaluate(() => {
    const H = window.UraniaDeneyHesap3.analemma, og = H.ortalamaOgle(29.08, 3), ut = og - 3;
    const yil = [];
    for (let n = 1; n <= 365; n++) yil.push([n, H.gunes(H.D(n, ut))]);
    const enB = yil.reduce((a, b) => b[1].zd > a[1].zd ? b : a), enK = yil.reduce((a, b) => b[1].zd < a[1].zd ? b : a);
    const sifir = [];
    for (let i = 1; i < yil.length; i++) if (yil[i - 1][1].zd * yil[i][1].zd < 0) sifir.push(yil[i][0]);
    const usno = { 3: '13:08', 42: '13:18', 79: '13:11', 105: '13:04', 134: '13:00', 164: '13:04', 172: '13:05', 207: '13:10', 244: '13:04', 266: '12:56', 307: '12:47', 355: '13:02', 359: '13:04' };
    const fark = Object.keys(usno).map(n => { const [s, d] = usno[n].split(':').map(Number); return Math.abs(H.gercekOgle(Number(n), 29.08, 3).saat - (s + d / 60)) * 3600; });
    return {
      og, enB: [enB[0], enB[1].zd], enK: [enK[0], enK[1].zd], sifir,
      basGenlik: Math.max(...yil.map(x => Math.abs(x[1].basiklik))), egkGenlik: Math.max(...yil.map(x => Math.abs(x[1].egiklik))),
      toplamTutar: Math.max(...yil.map(x => Math.abs(x[1].basiklik + x[1].egiklik - x[1].zd))),
      usnoEnCok: Math.max(...fark),
      daire: H.gunes(H.D(307, ut), { dairesel: true }), dik0: H.gunes(H.D(307, ut), { egiksiz: true }), ikisi: H.gunes(H.D(307, ut), { dairesel: true, egiksiz: true }),
      dkSn: [H.dkSn(16.45), H.dkSn(-14.2), H.dkSn(0)], saat: H.saatYaz(og),
      yaz: H.analemma(172, 41, 29.08, 3, og), kis: H.analemma(355, 41, 29.08, 3, og)
    };
  });
  /* yerel ortalama öğle: 12.00 + (45° − 29,08°) × 4 dk = 13.03.41 */
  expect(r.saat).toBe('13:03:41');
  expect((r.og - 12) * 60).toBeCloseTo(63.68, 2);
  /* uç değerler: Wikipedia girişi +16 dk 33 sn (≈3 Kasım) ve −14 dk 6 sn (≈11 Şubat); 2000 tablosu +16:25 / −14:15;
     uygulamanın gök hesabı 2026 için +16:27 / −14:11. Model en çok birkaç saniye farklı. */
  expect(r.enB[0]).toBe(307); expect(r.enK[0]).toBe(42);
  expect(Math.abs(r.enB[1] - (16 + 33 / 60)) * 60).toBeLessThan(10);
  expect(Math.abs(r.enK[1] + (14 + 6 / 60)) * 60).toBeLessThan(10);
  expect(Math.abs(r.enB[1] - 16.444) * 60).toBeLessThan(3);    // Astronomy Engine 2026 (cizim_v3.js ZD)
  expect(Math.abs(r.enK[1] + 14.181) * 60).toBeLessThan(3);
  /* Wikipedia: sıfırlar 15 Nisan, 13 Haziran, 1 Eylül, 25 Aralık civarı (105, 164, 244, 359. gün) */
  expect(r.sifir.length).toBe(4);
  [105, 164, 244, 359].forEach((g, i) => expect(Math.abs(r.sifir[i] - g)).toBeLessThanOrEqual(2));
  /* bileşen genlikleri: Wikipedia 7,66 dk ve 9,87 dk */
  expect(r.basGenlik).toBeCloseTo(7.66, 1); expect(r.egkGenlik).toBeCloseTo(9.87, 1);
  expect(r.toplamTutar).toBeLessThan(1e-9);
  /* USNO İstanbul güneyden geçiş saatleri (dakikaya yuvarlı): model en çok yarım dakika farklı */
  expect(r.usnoEnCok).toBeLessThanOrEqual(31);
  /* kutular: payı sıfırlar */
  expect(r.daire.basiklik).toBe(0); expect(r.dik0.egiklik).toBeCloseTo(0, 9); expect(r.dik0.dik).toBeCloseTo(0, 9);
  expect(r.ikisi.zd).toBeCloseTo(0, 9);
  expect(r.dkSn).toEqual(['+16 dk 27 sn', '−14 dk 12 sn', '0 sn']);
  /* analemma: Haziran'da yükseklik ≈ 72,4°, Aralık'ta ≈ 25,6° (ders d22), azimut güneye yakın */
  expect(r.yaz.yuk).toBeCloseTo(72.4, 1); expect(r.kis.yuk).toBeCloseTo(25.6, 1);
  expect(Math.abs(r.yaz.az - 180)).toBeLessThan(3); expect(Math.abs(r.kis.az - 180)).toBeLessThan(3);
});

test('Analemma arayüzü: tarih düğmeleri, kutular ve rehber adımı ölçümleri yazar', async ({ page }) => {
  await ac(page);
  await page.locator('#anOn button[data-i="3"]').click();
  await expect(page.locator('#anGunCikti')).toHaveText('3 Kasım');
  await expect(page.locator('#anFark')).toHaveText('+16 dk 27 sn');
  await expect(page.locator('#anPay')).toHaveText('+6 dk 45 sn / +9 dk 42 sn');
  await expect(page.locator('#anOgle')).toHaveText('12:47:14');
  await expect(page.locator('#anYuk')).toHaveText('33,9°');
  await expect(page.locator('#anMetin')).toContainText('63,68 dakika');
  await page.locator('#anOn button[data-i="0"]').click();
  await expect(page.locator('#anFark')).toHaveText('−14 dk 12 sn');
  await expect(page.locator('#anOgle')).toHaveText('13:17:53');
  /* rehber: eksen eğik olmasaydı */
  await page.locator('.rh-uygula[data-i="4"]').evaluate(b => b.click());
  await expect(page.locator('#anEgik')).toBeChecked();
  await expect(page.locator('#anDaire')).not.toBeChecked();
  await expect(page.locator('#anFark')).toHaveText('+6 dk 45 sn');
  await expect(page.locator('#anYuk')).toHaveText('49,0°');
  /* iki kutu: fark yok, gerçek öğle ortalama öğle */
  await page.locator('#anDaire').check();
  await expect(page.locator('#anFark')).toHaveText('0 sn');
  await expect(page.locator('#anOgle')).toHaveText('13:03:41');
  /* rehber: 25 Aralık, kutular kalkar */
  await page.locator('.rh-uygula[data-i="6"]').evaluate(b => b.click());
  await expect(page.locator('#anFark')).toHaveText('−1 sn');
  await expect(page.locator('#anPay')).toHaveText('+1 dk 17 sn / −1 dk 18 sn');
});

test('Analemma: dar ekranda (320 px) yatay taşma yok; kırmızı modda çizer', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await ac(page);
  for (const i of [0, 3]) {
    await page.locator(`#anOn button[data-i="${i}"]`).click();
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(tasma).toBeLessThanOrEqual(0);
  }
  const oran = await page.locator('#anKanvas').evaluate(c => c.getBoundingClientRect().height / c.getBoundingClientRect().width);
  expect(oran).toBeGreaterThanOrEqual(0.55); expect(oran).toBeLessThanOrEqual(0.8);
  await page.evaluate(() => { document.documentElement.classList.add('kirmizi'); document.dispatchEvent(new CustomEvent('urania:tema')); });
  await expect(page.locator('#anFark')).not.toHaveText('—');
});
