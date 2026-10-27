'use strict';
/* Testlerde CelesTrak yerine 2026-10-27'de indirilmiş OMM/JSON verisi (gerçek veri, ağ yok) */
const path = require('path');
const ISTASYON = require('./veri/gp_stations_2026-10-27.json');
const SON30 = require('./veri/gp_son30_2026-10-27.json');
async function celestrak(page, secenek) {
  const s = secenek || {};
  await page.route('**/celestrak.org/**', r => {
    const u = r.request().url();
    if (s.hata) return r.fulfill({ status: s.hata, body: '' });
    if (/GROUP=stations/.test(u)) return r.fulfill({ json: ISTASYON });
    if (/GROUP=last-30-days/.test(u)) return r.fulfill({ json: s.diziYok ? [] : SON30 });
    return r.fulfill({ status: 404, body: '' });
  });
}
module.exports = { celestrak, ISTASYON, SON30, kok: path.join(__dirname, '..') };
