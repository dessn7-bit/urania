'use strict';
/* Manyetik sapma modeli (lib/geomag.min.js, WMM-2025) ve süresi dolunca davranış (ar.js wmmSapma).
   WMM-2025 13.11.2029 03:00 UT'de biter (kütüphanedeki end_date); sonrası için kütüphane hata atar. Eskiden ar.js hatayı
   yakalayıp sapmayı 0 yapıyordu: pusula İstanbul'da ≈6° sessizce kayıyordu. Şimdi son geçerli anın sapması kullanılır ve
   durum satırında (role="status") "Manyetik model eskidi" uyarısı görünür.
   2026 başvuru değeri: NOAA hesaplayıcısı (ngdc.noaa.gov/geomag-web), İstanbul 41,0 K 29,1 D, 2026-10-27, WMM-2025:
   declination 6,08942° (arastirma/noaa_wmm_41.0_29.1_2026-10-27.json). */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { celestrak } = require('./yardim');

const NOAA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'arastirma', 'noaa_wmm_41.0_29.1_2026-10-27.json'), 'utf8'));
const WMM_BITIS = Date.UTC(2029, 10, 13, 3, 0, 0);

/* Takvim bekçisi: gerçek sistem saati (Date.now(), sahte saat değil) model bitişine 6 aydan az kalınca kırmızı */
test('WMM-2025 bitişine 6 aydan fazla var (gerçek saat)', () => {
  expect(Date.now() < Date.UTC(2029, 4, 13), 'WMM modeli yenilenmeli (lib/geomag.min.js, WMM-2025 13.11.2029\'da bitiyor)').toBe(true);
});

test('Kütüphanedeki model bitiş tarihi ar.js\'teki sabitle aynı', () => {
  const lib = fs.readFileSync(path.join(__dirname, '..', 'lib', 'geomag.min.js'), 'utf8');
  const m = /name:"WMM-2025",start_date:"[^"]+",end_date:"([^"]+)"/.exec(lib);
  expect(m, 'WMM-2025 end_date').toBeTruthy();
  expect(new Date(m[1]).getTime()).toBe(WMM_BITIS);
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

test.describe('Arayüz (AR, İstanbul varsayılan konum)', () => {
  test.beforeEach(async ({ page }) => {
    page.hatalar = [];
    page.on('pageerror', e => page.hatalar.push(e.message));
    await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
    await celestrak(page);
  });
  test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

  test('2026: sapma NOAA değeriyle uyuşur, uyarı yok', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-27T21:00:00+03:00') });
    await page.goto('/index.html#ar');
    await page.waitForTimeout(300);
    await yonVer(page, 0, 90, 0);
    const st = await page.evaluate(() => ({ sapma: window.UraniaAR.st.sapma, eski: window.UraniaAR.st.wmmEski }));
    expect(st.eski).toBe(false);
    /* NOAA ile aynı model: fark yuvarlama düzeyinde (NOAA belirsizliği 0,34°; burada 0,02° istenir) */
    expect(Math.abs(st.sapma - NOAA.result[0].declination)).toBeLessThan(0.02);
    await expect(page.locator('#arDurum')).toContainText('Pusula manyetik sapmaya göre düzeltildi (+6,1°)');
    await expect(page.locator('#arDurum')).not.toContainText('Manyetik model eskidi');
  });

  test('2030: sapma 0 değil, son geçerli anın sapması; "Manyetik model eskidi" uyarısı görünür ve kalır', async ({ page }) => {
    await page.clock.install({ time: new Date('2030-03-01T21:00:00+03:00') });
    await page.goto('/index.html#ar');
    await page.waitForTimeout(300);
    await yonVer(page, 0, 90, 0);
    const d = await page.evaluate(() => {
      const A = window.UraniaAR;
      let hata = null; try { window.Geomag.sapma(41.0, 29.1, new Date()); } catch (e) { hata = String(e && e.message || e); }
      return { sapma: A.st.sapma, eski: A.st.wmmEski, son: window.Geomag.sapma(41.0, 29.1, A.WMM_SON_GECERLI), sonAn: A.WMM_SON_GECERLI.getTime(), hata };
    });
    expect(d.hata, 'kütüphane 2030 için hata atıyor (düzeltmenin nedeni)').toMatch(/only valid/);
    expect(d.sonAn).toBeLessThan(WMM_BITIS); expect(WMM_BITIS - d.sonAn).toBeLessThanOrEqual(3600e3);
    expect(d.eski).toBe(true);
    expect(d.sapma).not.toBe(0);
    expect(d.sapma).toBe(d.son);
    /* Son geçerli anın değeri 2026 NOAA değerine yakın (yıllık değişim 0,049°/yıl × 3 yıl) */
    expect(Math.abs(d.sapma - (NOAA.result[0].declination + NOAA.result[0].declination_sv * 3.05))).toBeLessThan(0.05);
    const durum = page.locator('#arDurum');
    await expect(durum).toBeVisible();
    await expect(durum).toHaveAttribute('role', 'status');
    await expect(durum).toContainText('Manyetik model eskidi');
    /* Bakış yönü sapmayla düzeltilmiş: manyetik kuzey (α=0) gerçek 6° K */
    await expect(page.locator('#arMerkez .ar-yon')).toHaveText('6° K · yükseklik 0°');
    /* Öteki durum mesajları 7 sn'de kaybolur; bu uyarı kalır */
    await page.clock.runFor(9000);
    await expect(durum).toBeVisible();
    await expect(durum).toContainText('Manyetik model eskidi');
  });
});
