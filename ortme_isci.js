/* ortme_isci.js — Ay örtmesi aramasını arka planda (Web Worker) yapar: 90 günlük arama
   telefonda birkaç saniye sürebilir, sayfa bu sırada donmasın. */
importScripts('./lib/astronomy.browser.min.js', './gok.js', './ortme.js');
self.onmessage = e => {
  const m = e.data;
  try {
    const gzl = Gok.gozlemci(m.enlem, m.boylam, m.yukseklik || 0);
    let ls = [];
    for (let d = 0; d < m.gun; d += 10) ls = ls.concat(Ortme.ortmeler(m.yildizlar, gzl, new Date(m.bas + d * 86400e3), Math.min(10, m.gun - d)));
    self.postMessage({ kimlik: m.kimlik, ls });
  } catch (h) {
    self.postMessage({ kimlik: m.kimlik, hata: String(h && h.message || h) });
  }
};
