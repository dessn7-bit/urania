/* sw.js — çevrimdışı çalışma. Ağ önce (güncel sürüm gelsin), ağ yoksa önbellek.
   Dosya eklenince ASSETS'e eklenmeli ve SURUM artırılmalı. */
const SURUM = 'urania-v29';
const ASSETS = [
  './', './index.html', './stil.css', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './lib/astronomy.browser.min.js', './lib/geomag.min.js', './ar.js', './hava.js', './defter.js', './gorevler.js', './uydu.js', './lib/satellite.min.js', './tani.js', './ortme.js', './ortme_isci.js', './plan.js', './okunus.js', './ses.js', './kartlar.js',
  './gok.js', './uygulama.js', './harita.js', './bulucu.js', './gozlem.js', './deneyler2.js', './simulasyon.js', './cizim.js', './cizim_gokyuzu.js', './cizim_gunes_sistemi.js', './cizim_yildizlar.js', './cizim_gezegen_yasam.js', './cizim_evren.js', './dersler.js', './hesap.js', './baslat.js', './tema.js',
  './veri/yildizlar.json', './veri/takimyildiz.json', './veri/hedefler.json', './veri/meteor.json',
  './veri/fizik.json', './veri/dersler.json', './veri/ortme_yildiz.json', './veri/algol.json', './veri/deney_rehber.json', './veri/deney_veri.json', './veri/sinavlar.json', './veri/gorevler.json',
  './font/spectral-latin-400-normal.woff2', './font/spectral-latin-ext-400-normal.woff2',
  './font/spectral-latin-400-italic.woff2', './font/spectral-latin-ext-400-italic.woff2',
  './font/spectral-latin-600-normal.woff2', './font/spectral-latin-ext-600-normal.woff2',
  './font/ibm-plex-sans-latin-400-normal.woff2', './font/ibm-plex-sans-latin-ext-400-normal.woff2',
  './font/ibm-plex-sans-latin-500-normal.woff2', './font/ibm-plex-sans-latin-ext-500-normal.woff2',
  './font/ibm-plex-sans-latin-600-normal.woff2', './font/ibm-plex-sans-latin-ext-600-normal.woff2'
];

self.addEventListener('install', e => {
  /* cache:'reload': GitHub Pages 10 dk'lık HTTP önbelleği verir; yeni sürüm önbelleğine eski dosyalar girmesin */
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
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
  const onbellek = () => caches.match(e.request, { ignoreSearch: true }).then(r => {
    if (r) return r;
    /* index.html yedeği yalnız sayfa gezinmesi için; JSON isteğine HTML dönmesin */
    if (e.request.mode === 'navigate') return caches.match('./index.html');
    return Response.error();
  });
  /* Ağ önce, ama en çok 3 sn: karanlık bir yerde zayıf çekimde önbelleğe hızla düş.
     no-cache: tarayıcının HTTP önbelleği yerine sunucuya sorulur (ETag ile değişmediyse 304, ucuz).
     Sunucu hata dönerse (404/5xx) önbellekteki sağlam kopya kullanılır. */
  let istek = e.request;
  try { istek = e.request.mode === 'navigate' ? new Request(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }) : new Request(e.request, { cache: 'no-cache' }); } catch (h) { /* kurulamazsa olduğu gibi */ }
  const ag = fetch(istek).then(res => {
    if (res.ok) {
      const kopya = res.clone();
      caches.open(SURUM).then(c => c.put(e.request, kopya)).catch(() => { /* kota dolu: yanıtı etkilemez */ });
      return res;
    }
    return onbellek().then(r => (r && r.type !== 'error' ? r : res));
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
