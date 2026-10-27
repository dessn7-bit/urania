/* sw.js — çevrimdışı çalışma. Ağ önce (güncel sürüm gelsin), ağ yoksa önbellek.
   Dosya eklenince ASSETS'e eklenmeli ve SURUM artırılmalı. */
const SURUM = 'urania-v13';
const ASSETS = [
  './', './index.html', './stil.css', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './lib/astronomy.browser.min.js', './lib/geomag.min.js', './ar.js', './hava.js', './defter.js', './uydu.js', './lib/satellite.min.js', './tani.js', './ortme.js', './ortme_isci.js', './plan.js', './ses.js', './kartlar.js',
  './gok.js', './uygulama.js', './harita.js', './gozlem.js', './simulasyon.js', './dersler.js', './hesap.js',
  './veri/yildizlar.json', './veri/takimyildiz.json', './veri/hedefler.json', './veri/meteor.json',
  './veri/fizik.json', './veri/dersler.json', './veri/ortme_yildiz.json', './veri/algol.json',
  './font/spectral-latin-400-normal.woff2', './font/spectral-latin-ext-400-normal.woff2',
  './font/spectral-latin-400-italic.woff2', './font/spectral-latin-ext-400-italic.woff2',
  './font/spectral-latin-600-normal.woff2', './font/spectral-latin-ext-600-normal.woff2',
  './font/ibm-plex-sans-latin-400-normal.woff2', './font/ibm-plex-sans-latin-ext-400-normal.woff2',
  './font/ibm-plex-sans-latin-500-normal.woff2', './font/ibm-plex-sans-latin-ext-500-normal.woff2',
  './font/ibm-plex-sans-latin-600-normal.woff2', './font/ibm-plex-sans-latin-ext-600-normal.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.indexOf('urania-') === 0 && k !== SURUM).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  let ayni = false;
  try { ayni = new URL(e.request.url).origin === self.location.origin; } catch (h) { /* geçersiz URL: dokunma */ }
  if (!ayni) return;
  /* Ağ önce, ama en çok 3 sn: karanlık bir yerde zayıf çekimde önbelleğe hızla düş. */
  const ag = fetch(e.request).then(res => {
    if (res.ok) {
      const kopya = res.clone();
      caches.open(SURUM).then(c => c.put(e.request, kopya)).catch(() => { /* kota dolu: yanıtı etkilemez */ });
    }
    return res;
  });
  const onbellek = () => caches.match(e.request, { ignoreSearch: true }).then(r => {
    if (r) return r;
    /* index.html yedeği yalnız sayfa gezinmesi için; JSON isteğine HTML dönmesin */
    if (e.request.mode === 'navigate') return caches.match('./index.html');
    return Response.error();
  });
  e.respondWith(new Promise(coz => {
    let bitti = false;
    const sure = setTimeout(() => {
      onbellek().then(r => { if (!bitti && r && r.type !== 'error') { bitti = true; coz(r); } });
    }, 3000);
    ag.then(r => { if (!bitti) { bitti = true; clearTimeout(sure); coz(r); } })
      .catch(() => { clearTimeout(sure); onbellek().then(r => { if (!bitti) { bitti = true; coz(r); } }); });
  }));
});
