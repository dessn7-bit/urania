'use strict';
/* Ders göndermelerinin zamanı ders sırasına uyar (denetim 2026-10-30: A3-01, A5-01, A6B-24). Mantık tek yerde:
   araclar/gonderme_denetim.py (kaynak metinler arastirma/dersler_v2/dNN.json ve dNN_sinav.json, kaynağı olmayan eski
   sınav soruları veri/sinavlar.json). Okur dersleri uygulamadaki sırayla okur:
     - sırada SONRA gelen derse geçmiş anlatımla ("d9'da gördüğün gibi", "hatırla", "konusuydu") gönderme yapılmaz;
     - sırada ÖNCE gelen derse gelecek anlatımla ("d16'da göreceksin", "dönecek") gönderme yapılmaz.
   Gerekçeli istisnalar betikteki IZIN listesinde (dosya + hedef + sözcük + metin parçası; metin değişince istisna düşer). */
const { test, expect } = require('@playwright/test');
const { spawnSync } = require('child_process');
const { kok } = require('./yardim');

let PY = null;
function python() {
  if (PY) return PY;
  for (const [k, a] of [['python', []], ['py', ['-3']], ['python3', []]]) {
    const r = spawnSync(k, [...a, '--version'], { encoding: 'utf8' });
    if (r.status === 0 && /Python 3/.test(r.stdout + r.stderr)) return (PY = [k, a]);
  }
  throw new Error('Python 3 bulunamadı (python / py -3 / python3)');
}
function py(args, girdi) {
  const [k, a] = python();
  return spawnSync(k, [...a, ...args], { cwd: kok, input: girdi, encoding: 'utf8', timeout: 120000, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
}

test('Denetleyici: yan cümle, "bu ders" ayrımı, "N. ders" = dN, sözcük listeleri (yapay örnekler)', () => {
  const kod = [
    'import json, sys',
    "sys.path.insert(0, 'araclar')",
    'import gonderme_denetim as g',
    "S = {'d1': 1, 'd9': 9, 'd16': 30, 'd7': 33, 'd8': 38, 'd18': 42, 'd2': 2}",
    'print(json.dumps([[x["hedef"] + " " + x["sozcuk"] for x in g.parca_denetle(S, ders, "t.json", "a", s)] for ders, s in json.loads(sys.stdin.read())], ensure_ascii=False))'
  ].join('\n');
  const ornek = [
    [['d7', "d16'da göreceksin."], ['d16 göreceksin']],                                   // önceki derse gelecek
    [['d9', "d18'de gördüğün gibi Mars."], ['d18 gördüğün']],                               // sonraki derse geçmiş
    [['d9', '18. derste gördün.'], ['d18 gördün']],                                         // kaynakta "18. ders" = d18
    [['d9', '1. ve 18. derslerde gördüğün gibi.'], ['d18 gördüğün']],                       // zincirin her sayısı
    [['d9', "d1'de gördüğün gibi."], []],                                                   // önce gelen derse geçmiş: doğru
    [['d7', "d8'de göreceksin."], []],                                                      // sonra gelen derse gelecek: doğru
    [['d18', "Thorne (d8) ve bu dersin ilerleyen bölümlerinde göreceğin makale."], []],     // fiil bu derse ait
    [['d8', "d1'de gördün; d18'i ise sonra okuyacaksın."], []],                            // ayrı yan cümleler, doğru zamanlar
    [['d9', "Gördüğün gibi bu sayı büyük. d18 anlatıyor."], []],                           // fiil göndermeden önce / geniş zaman
    [['d18', "d9'daki uzak gelecek senaryoları ve gelecekte yapılacaklar."], []],         // "gelecek" ad, zaman değil
    [['d9', "d18'deki üzümlü kek resmini hatırla."], ['d18 hatırla']],
    [['d9', "d18'in konusuydu."], ['d18 konusuydu']],
    [['d9', "d18 bunu hatırlatır."], []],                                                  // "hatırlatır" geniş zaman
    [['d8', "d7 ve d18 bu fikre dönecek."], ['d7 dönecek']],                               // d7 önce: gelecek yanlış, d18 sonra: doğru
    [['d9', "d18'den biliyorsun: kutup ışıkları."], ['d18 biliyorsun']]
  ];
  const r = py(['-c', kod], JSON.stringify(ornek.map(x => x[0])));
  expect(r.status, r.stderr).toBe(0);
  expect(JSON.parse(r.stdout)).toEqual(ornek.map(x => x[1]));
});

test('Ders kaynaklarında zamanı ders sırasına aykırı gönderme yok (araclar/gonderme_denetim.py)', () => {
  const r = py(['araclar/gonderme_denetim.py', '--json']);
  expect([0, 1], r.stderr).toContain(r.status);
  const ls = JSON.parse(r.stdout);
  const ozet = ls.map(x => `${x.dosya} ${x.alan}: ${x.ders}(${x.sira}) → ${x.hedef}(${x.hedef_sira}) ${x.tur} [${x.sozcuk}] ${x.metin.slice(0, 120)}`);
  expect(ozet, `${ls.length} gönderme: ya zamanı düzelt ("gördün" ↔ "göreceksin") ya gönderilen bilgiyi derste ver`).toEqual([]);
});
