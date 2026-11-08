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


/* v44 hava kartları: dış servislerin 2026-11-08/09'da kaydedilmiş GERÇEK yanıtları (testler/veri/hava/) */
const fs = require('fs');
const HV = path.join(__dirname, 'veri', 'hava');
const oku = f => fs.readFileSync(path.join(HV, f));
const json = f => JSON.parse(oku(f));
const ENS = 'ens_2026-11-09_41.00_29.10.json', MDL = 'mdl_2026-11-09_41.00_29.10.json', OM = 'om_2026-11-09_41.00_29.10.json', AQ = 'aq_2026-11-08_41.00_29.10.json', KP = 'kp_2026-11-08.json';
const HAVA_FIX = { oku, json, ENS, MDL, OM, AQ, KP, AN: new Date('2026-11-08T21:30:00+03:00') };
/* İstekler kaydedilir: koordinat yuvarlama ve dış adres denetimi için */
async function havaServisleri(page, s = {}) {
  page.istekler = [];
  page.on('request', r => { if (!/^http:\/\/127\.0\.0\.1/.test(r.url())) page.istekler.push(r.url()); });
  await page.route('**/view.eumetsat.int/**', r => {
    if (s.uyduHata) return r.fulfill({ status: 503, body: '' });
    const u = new URL(r.request().url()), q = u.searchParams, istek = (q.get('request') || '').toLowerCase();
    if (istek === 'getcapabilities') {
      const yol = u.pathname.replace(/^\/geoserver\//, '').replace(/\/ows$/, '').replace('/', '_');
      return r.fulfill({ contentType: 'application/xml', body: oku('eum_cap_' + yol + '.xml') });
    }
    if (istek === 'getfeatureinfo') return r.fulfill({ contentType: 'application/json', body: s.maske ? JSON.stringify(s.maske) : oku('eum_gfi_clm_41.00_29.10.json') });
    if (istek === 'getmap') {
      const k = q.get('layers');
      const tur = /h40b/.test(k) ? 'yagis' : /clm/.test(k) ? 'maske' : /ir105/.test(k) ? 'kizilotesi' : 'renk';
      return r.fulfill({ contentType: 'image/jpeg', headers: { 'cache-control': 'max-age=604800, must-revalidate' }, body: oku('eum_harita_' + tur + '.jpg') });
    }
    return r.fulfill({ status: 404, body: '' });
  });
  await page.route('**/ensemble-api.open-meteo.com/**', r => (s.ensHata ? r.fulfill({ status: 429, json: { error: true, reason: 'limit' } }) : r.fulfill({ json: json(ENS), headers: { 'x-ratelimit-cost': '16.1' } })));
  await page.route('**/air-quality-api.open-meteo.com/**', r => (s.aqHata ? r.abort() : r.fulfill({ json: json(AQ) })));
  await page.route('**/api.open-meteo.com/**', r => {
    if (s.havaHata) return r.abort();
    const u = r.request().url();
    if (/models=/.test(u)) return r.fulfill({ json: json(MDL) });
    return r.fulfill({ json: s.hava ? s.hava(json(OM)) : json(OM) });
  });
  await page.route('**/services.swpc.noaa.gov/**', r => (s.kpHata ? r.abort() : r.fulfill({ json: s.kp ? s.kp(json(KP)) : json(KP) })));
}


/* v44: hava kartlarının dış servisleri (ensemble, hava kalitesi, Kp, EUMETSAT) bu testin konusu değilse boş ama geçerli
   HTTP yanıtı alır: kart gizli kalır, konsola "Failed to load resource" düşmez. (Ağ zaten kapalı: playwright.config.js vekil.) */
async function havaSessiz(page) {
  await page.route('**/ensemble-api.open-meteo.com/**', r => r.fulfill({ json: {} }));
  await page.route('**/air-quality-api.open-meteo.com/**', r => r.fulfill({ json: {} }));
  await page.route('**/services.swpc.noaa.gov/**', r => r.fulfill({ json: [] }));
  await page.route('**/view.eumetsat.int/**', r => r.fulfill({ contentType: 'application/xml', body: '<WMS_Capabilities/>' }));
}

module.exports = { havaSessiz, havaServisleri, HAVA_FIX, celestrak, disAgiKes, xssGozcu, xssDurumu, ISTASYON, SON30, kok: path.join(__dirname, '..') };
