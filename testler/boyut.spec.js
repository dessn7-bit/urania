'use strict';
/* v49 boyut sınırı: (1) service worker'ın kurulumda önbelleğe aldığı dosyaların (sw.js ASSETS) toplamı 12 MB'ı aşmasın
   (12 × 1024 × 1024 bayt); (2) img/haber/ altındaki her görsel en çok 250 KB ve en çok 1200 piksel genişlik/yükseklik
   (araclar/haber_gorsel.py'nin sınırı; JPEG başlığı okunarak ölçülür). Ağsız. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { kok } = require('./yardim');

const SINIR_ONBELLEK = 12 * 1024 * 1024;
const SINIR_GORSEL_BAYT = 250 * 1024;
const SINIR_GORSEL_PX = 1200;

/* JPEG boyutu: SOF0/1/2 işaretçisindeki yükseklik ve genişlik */
function jpegBoyut(b) {
  if (b[0] !== 0xFF || b[1] !== 0xD8) return null;
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1], uz = b.readUInt16BE(i + 2);
    if (m >= 0xC0 && m <= 0xCF && ![0xC4, 0xC8, 0xCC].includes(m)) return { yukseklik: b.readUInt16BE(i + 5), genislik: b.readUInt16BE(i + 7) };
    i += 2 + uz;
  }
  return null;
}

test('Önbelleğe alınan dosyaların (sw.js ASSETS) toplamı 12 MB\'ı aşmaz', () => {
  const sw = fs.readFileSync(path.join(kok, 'sw.js'), 'utf8');
  const ls = (sw.match(/const ASSETS = \[([\s\S]*?)\];/)[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));
  expect(ls.length).toBeGreaterThan(50);
  let toplam = 0;
  for (const u of ls) {
    const p = path.join(kok, u === './' ? 'index.html' : u.replace(/^\.\//, ''));
    expect(fs.existsSync(p), u + ' dosyası yok').toBe(true);
    toplam += fs.statSync(p).size;
  }
  console.log(`önbellek toplamı: ${(toplam / 1048576).toFixed(2)} MB (${ls.length} dosya)`);
  expect(toplam, `toplam ${(toplam / 1048576).toFixed(2)} MB`).toBeLessThanOrEqual(SINIR_ONBELLEK);
});

test('img/haber/: her görsel ≤ 250 KB ve ≤ 1200 px', () => {
  const kl = path.join(kok, 'img', 'haber');
  const ls = fs.readdirSync(kl).filter(f => /\.jpe?g$/i.test(f));
  expect(ls.length).toBeGreaterThan(0);
  for (const f of ls) {
    const b = fs.readFileSync(path.join(kl, f));
    expect(b.length, f + ' bayt').toBeLessThanOrEqual(SINIR_GORSEL_BAYT);
    const o = jpegBoyut(b);
    expect(o, f + ' JPEG boyutu okunamadı').toBeTruthy();
    expect(Math.max(o.genislik, o.yukseklik), f + ' piksel').toBeLessThanOrEqual(SINIR_GORSEL_PX);
  }
  expect(fs.readdirSync(kl).filter(f => !/\.jpe?g$/i.test(f)), 'img/haber/ yalnız JPEG').toEqual([]);
});
