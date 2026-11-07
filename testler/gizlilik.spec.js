'use strict';
/* Gizlilik: ev konumunun dört ondalıklı koordinatları ve mahalle adı depoda yer almaz (7 Kasım 2026 kararı). Varsayılan
   konum ilçe düzeyinde (İstanbul, 41,0 K 29,1 D). node_modules ve test-results dışındaki her dosya taranır (ikili dosyalar
   dahil, metin olarak). Aranan dizgiler bu dosyada da düz yazılmaz (kendini yakalamasın): parçalardan birleştirilir. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const KOK = path.join(__dirname, '..');
const ATLA = new Set(['node_modules', 'test-results', '.git']);
const YASAK = [['41.00', '46'], ['29.07', '62'], ['Fe', 'tih']].map(p => p.join(''));

function dosyalar(dizin, ls) {
  for (const ad of fs.readdirSync(dizin)) {
    if (ATLA.has(ad)) continue;
    const yol = path.join(dizin, ad);
    const st = fs.statSync(yol);
    if (st.isDirectory()) dosyalar(yol, ls); else ls.push(yol);
  }
  return ls;
}

test('Depoda eski ev koordinatları (iki sayı) ve mahalle adı geçmez', () => {
  const bulgu = [];
  dosyalar(KOK, []).forEach(yol => {
    const s = fs.readFileSync(yol, 'latin1');   // her baytı okur; aranan dizgiler ASCII
    YASAK.forEach(y => { if (s.indexOf(y) >= 0) bulgu.push(path.relative(KOK, yol) + ': ' + y); });
  });
  expect(bulgu).toEqual([]);
});

test('Varsayılan konum ilçe düzeyinde: İstanbul 41,0 K 29,1 D; kayıtlı konum ve GPS kodu dokunulmamış', () => {
  const s = fs.readFileSync(path.join(KOK, 'uygulama.js'), 'utf8');
  expect(s).toMatch(/VARSAYILAN_KONUM = \{ ad: 'İstanbul', enlem: 41\.0, boylam: 29\.1,/);
  expect(s).toMatch(/oku\('konum', null\)/);           // telefonda kayıtlı konum önce okunur
  expect(s).toMatch(/navigator\.geolocation/);          // GPS yolu yerinde
});
