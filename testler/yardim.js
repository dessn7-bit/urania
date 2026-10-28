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
/* Yerel sunucu dışındaki her isteği keser. Playwright son eklenen rotayı önce dener: önce bunu, sonra
   sahte yanıt veren özel rotaları (celestrak(), open-meteo…) ekle; özel rota eşleşmezse istek burada kesilir. */
async function disAgiKes(page) {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
}

/* XSS gözcüsü: sayfa açılmadan kurulur. CSP satır içi olay işleyicisini zaten engellediği için yalnız
   window.__xss'e bakmak hiçbir şeyi sınamaz; asıl iz (1) DOM'a olay öznitelikli öğe girmesi ve
   (2) CSP'nin bir şeyi engellemesidir (securitypolicyviolation). Gözcü ikisini de sayar. */
async function xssGozcu(page) {
  await page.addInitScript(() => {
    window.__cspIhlal = [];
    document.addEventListener('securitypolicyviolation', e => window.__cspIhlal.push(e.violatedDirective + ' ' + (e.blockedURI || '') + ' ' + (e.sample || '')), true);
  });
}
/* Gözcünün sonucu: olay öznitelikli öğeler (img[onerror], [onload]…), javascript: bağlantıları, CSP ihlalleri */
async function xssDurumu(page) {
  return page.evaluate(() => {
    const olayli = [];
    document.querySelectorAll('*').forEach(el => {
      for (const a of el.attributes) {
        if (/^on/i.test(a.name)) olayli.push(el.tagName.toLowerCase() + '[' + a.name + ']');
        else if (/^(href|src|action|formaction|xlink:href)$/i.test(a.name) && /^\s*javascript:/i.test(a.value)) olayli.push(el.tagName.toLowerCase() + '[' + a.name + '=javascript:]');
      }
    });
    return { xss: window.__xss, olayli, csp: window.__cspIhlal || null };
  });
}

module.exports = { celestrak, disAgiKes, xssGozcu, xssDurumu, ISTASYON, SON30, kok: path.join(__dirname, '..') };
