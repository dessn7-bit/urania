/* sw.js — çevrimdışı çalışma. Ağ önce (güncel sürüm gelsin), ağ yoksa önbellek.
   Dosya eklenince ASSETS'e eklenmeli ve SURUM artırılmalı. */
const SURUM = 'urania-v49';
const ASSETS = [
  './', './index.html', './stil.css', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './lib/astronomy.browser.min.js', './lib/geomag.min.js', './ar.js', './hava.js', './havakart.js', './defter.js', './gorevler.js', './haberler.js', './uydu.js', './lib/satellite.min.js', './tani.js', './ortme.js', './ortme_isci.js', './plan.js', './okunus.js', './ses.js', './kartlar.js', './gorunurluk.js', './degisen.js',
  './gok.js', './uygulama.js', './harita.js', './bulucu.js', './gozlem.js', './deneyler2.js', './simulasyon.js', './cizim.js', './cizim_gokyuzu.js', './cizim_gunes_sistemi.js', './cizim_yildizlar.js', './cizim_gezegen_yasam.js', './cizim_evren.js', './cizim_v3.js', './cizim_v4a.js', './cizim_v4b.js', './cizim_v4c.js', './cizim_v5a.js', './cizim_v5b.js', './cizim_v5c.js', './cizim_v5d.js', './cizim_v6.js', './cizim_v7.js', './sozluk.js', './dersler.js', './hesap.js', './baslat.js', './tema.js',
  './deney/mevsim.js', './deney/analemma.js', './deney/eratosthenes.js', './deney/paralaks.js', './deney/durbun.js', './deney/astrofoto.js', './deney/roket.js', './deney/hohmann.js', './deney/yasanabilir.js', './deney/ortme.js', './deney/gezegenyolu.js',
  './veri/deney/mevsim.json', './veri/deney/analemma.json', './veri/deney/eratosthenes.json', './veri/deney/paralaks.json', './veri/deney/durbun.json', './veri/deney/astrofoto.json', './veri/deney/roket.json', './veri/deney/hohmann.json', './veri/deney/yasanabilir.json', './veri/deney/ortme.json', './veri/deney/gezegenyolu.json',
  './veri/yildizlar.json', './veri/takimyildiz.json', './veri/hedefler.json', './veri/meteor.json',
  './veri/fizik.json', './veri/dersler.json', './veri/sozluk.json', './veri/ortme_yildiz.json', './veri/algol.json', './veri/deney_rehber.json', './veri/deney_veri.json', './veri/sinavlar.json', './veri/gorevler.json', './veri/haberler.json',
  './veri/hedef_boyut.json', './veri/durbun_degisenleri.json', './veri/gok_parlakligi.json', './veri/gok_parlakligi.u8.gz', './veri/kume_uyeleri.json', './veri/profil_m31.json',
  './ay.js', './apophis.js', './veri/ay_yapilari.json', './veri/apophis2029.json', './img/ay/lroc_color_2k.jpg',
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

/* Haber görselleri (img/haber/*.jpg, ~1,8 MB) ASSETS'te değil: kurulumda hepsi indirilmesin diye görüntülendikçe
   önbelleğe girer. Sürümden BAĞIMSIZ ayrı önbellekte durur, sürüm değişince silinmez (yoksa her güncellemeden sonra
   çevrimdışı Haberler görselsiz kalırdı). Haberden çıkarılan görsel, haber listesine göre bu önbellekten de silinir. */
const GORSEL = 'urania-haber-gorsel';
const GORSEL_YOL = /\/img\/haber\/[a-z0-9-]+\.jpg$/;
function gorselMi(url) { try { return GORSEL_YOL.test(new URL(url).pathname); } catch (h) { return false; } }
/* Budama iki yerde: (1) ağdan her taze veri/haberler.json gelince — haberler haftalık güncellenir ve SURUM artmadan da
   değişebilir; uygulamanın gösterdiği liste tam olarak budur; (2) activate'te yeni sürüm önbelleğindeki haberler.json'la
   (kurulumda cache:'reload' ile taze alındı). Liste okunamazsa (bozuk JSON, haberler dizisi yok) hiçbir şey silinmez. */
function gorselBuda(j) {
  if (!j || !Array.isArray(j.haberler)) return Promise.resolve();
  const kalsin = new Set();
  j.haberler.forEach(h => { const d = h && h.gorsel && h.gorsel.dosya; if (typeof d === 'string') kalsin.add(d.replace(/^\.?\//, '')); });
  return caches.open(GORSEL).then(c => c.keys().then(ks => Promise.all(ks.map(r => {
    let yol = '';
    try { yol = new URL(r.url).pathname.replace(/^.*?(img\/haber\/)/, '$1'); } catch (h) { /* geçersiz: sil */ }
    return kalsin.has(yol) ? null : c.delete(r);
  })))).catch(() => { /* önbellek açılamadı: sorun değil */ });
}

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.indexOf('urania-') === 0 && k !== SURUM && k !== GORSEL).map(k => caches.delete(k))))   // urania-uydu-son da: uydu görüntüsü sürüm değişince tutulmaz
      .then(() => caches.open(SURUM).then(c => c.match('./veri/haberler.json')).then(r => (r ? r.json() : null)).then(gorselBuda).catch(() => { /* liste yok ya da bozuk: budama yok */ }))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  let ayni = false;
  try { ayni = new URL(e.request.url).origin === self.location.origin; } catch (h) { /* geçersiz URL: dokunma */ }
  /* Başka kökenler (hava servisleri, EUMETSAT uydu görüntüleri) işçiden geçmez ve önbelleğe girmez: EUMETView görüntüleri
     7 günlük önbellek başlığıyla gelir, ama her görüntü zamanı yeni bir adrestir; eskilerini tutmak yalnız yer kaplar.
     Uygulama son görüntüyü kendisi (havakart.js, urania-uydu-son, katman başına bir tane, 24 saat) tutar. */
  if (!ayni) return;
  /* Önbelleğe yazma bitene kadar işçi durdurulmasın; yanıt zaten verildiyse (3 sn yedeği) waitUntil hata atabilir */
  const uzat = p => { try { e.waitUntil(p); } catch (h) { /* olay bitti: yazma yine sürer */ } };
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
      const gorsel = gorselMi(e.request.url);
      /* Görsel sürümsüz önbelleğe; ötekiler sürüm önbelleğine. Arama dizesi atılır (aynı görsel iki kez girmesin). */
      const yaz = caches.open(gorsel ? GORSEL : SURUM).then(c => c.put(gorsel ? e.request.url.split(/[?#]/)[0] : e.request, kopya)).catch(() => { /* kota dolu: yanıtı etkilemez */ });
      if (/\/veri\/haberler\.json$/.test(new URL(e.request.url).pathname)) {
        const liste = res.clone();
        uzat(yaz.then(() => liste.json()).then(gorselBuda).catch(() => { /* bozuk liste: budama yok */ }));
      } else uzat(yaz);
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
