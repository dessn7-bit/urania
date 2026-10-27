/* ses.js — Dersleri sesli okuma. Pinakes'in (kitaplık) ses.js'inden uyarlandı (v132–v136):
   orada Kaan'ın telefonunda (Android 10, Chrome 154, kurulu PWA) ölçülerek düzeltilen
   kurallar aynen korunur.

   KARARLAR
   · Yalnız tarayıcının Web Speech API'si (speechSynthesis), tr-TR ses. Dış servis yok;
     Chrome yalnız cihazın varsayılan metin okuma motorunun seslerini görür. Türkçe ses
     yoksa düğme çıkmaz, nedeni yazılır (yabancı sesle Türkçe okutmak anlamsız).
   · Birim = ekrandaki blok (.okunur: başlık, paragraf, deftere notu). Blok da cümle
     sınırından ≤180 karakterlik parçalara bölünür: Chrome ~15 sn'yi aşan tek konuşmayı
     sessizce kesebiliyor; kısa parça kaybı küçük tutar. Android tek konuşmada 4000 karakteri
     reddeder.
   · DURAKLAT = cancel + konumu hatırla (pause()/resume() değil: Android'de pause()
     konuşmayı bitirir). Devam aynı parçanın başından.
   · Her konuşmanın JETONU var: iptal edilmiş konuşmanın geç gelen onend/onerror'ı ilerletmez.
   · HATA ASLA İLERLETMEZ (Pinakes v136, telefon tanısı: ekran kilidinde 'interrupted', sonra
     her parça anında 'synthesis-failed'; eski kural parçaları "okundu" sayıp yeri kaybetti):
       gizliyken herhangi bir hata → duraklat, yer korunur;
       görünürken 'interrupted'/'canceled' → dokunma, bekçi aynı parçayı yeniden konuşur;
       görünürken başka hata → aynı parçayı bir kez yeniden dene; ikinci hata → duraklat.
   · BEKÇİ: oynuyor ama motor sessiz ve son olaydan 3 sn geçmiş → aynı parçadan yeniden.
     Gizliyken asla konuşma başlatmaz.
   · Okurken ekran uyanık (Screen Wake Lock); duraklat/durdur/bitiş/gizlenmede bırakılır.
   · Tanı günlüğü: son oturumun olayları zaman damgasıyla; çubuktaki "Okuma tanısı" ve Tanı ekranı. */
(function () {
  'use strict';
  const U = window.Urania;
  const HIZLAR = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5];
  const PARCA_TAVAN = 180;
  const GUNLUK_TAVAN = 200;
  const SES_BEKLE_MS = 1500;

  const motor = () => (typeof window.speechSynthesis === 'object' && window.speechSynthesis) || null;

  /* ---------- metin ---------- */
  /* Cümle sınırından ≤ PARCA_TAVAN parçalar; tek cümle tavanı aşarsa virgül, o da yoksa
     boşluk sınırından bölünür. Hiçbir karakter kaybolmaz. */
  function parcala(metin) {
    const t = String(metin || '').replace(/\s+/g, ' ').trim();
    if (!t) return [];
    if (t.length <= PARCA_TAVAN) return [t];
    const cumleler = t.match(/[^.!?…]+(?:[.!?…]+["'”’»)]*)?\s*/g) || [t];
    const parcalar = [];
    let tampon = '';
    cumleler.forEach(s => {
      if (!s) return;
      if ((tampon + s).length <= PARCA_TAVAN) { tampon += s; return; }
      if (tampon.trim()) parcalar.push(tampon.trim());
      tampon = '';
      if (s.length <= PARCA_TAVAN) { tampon = s; return; }
      let kalan = s;
      while (kalan.length > PARCA_TAVAN) {
        let kes = kalan.lastIndexOf(', ', PARCA_TAVAN);
        if (kes < PARCA_TAVAN / 3) kes = kalan.lastIndexOf(' ', PARCA_TAVAN);
        if (kes < 1) kes = PARCA_TAVAN; else kes += 1;
        parcalar.push(kalan.slice(0, kes).trim());
        kalan = kalan.slice(kes);
      }
      tampon = kalan;
    });
    if (tampon.trim()) parcalar.push(tampon.trim());
    return parcalar.filter(Boolean);
  }
  /* Başlık gibi noktasız bloklar sonrakiyle tek nefeste okunmasın */
  function noktala(s) { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t && !/[.!?…:;,]["'”’»)]*$/.test(t) ? t + '.' : t; }

  /* ---------- ses seçimi ---------- */
  let sesler = [], seslerBilinir = false;
  function sesleriOku() {
    const s = motor();
    try { sesler = s ? (s.getVoices() || []) : []; } catch (e) { sesler = []; }
    if (sesler.length) seslerBilinir = true;
  }
  function trSes() {
    const tr = sesler.filter(v => v && /^tr([-_]|$)/i.test(String(v.lang || '')));
    return tr.find(v => v.localService && v.default) || tr.find(v => v.localService) || tr.find(v => v.default) || tr[0] || null;
  }
  /* 'yok-api' | 'bekleniyor' | 'yok-tr' | 'var' */
  function sesDurumu() {
    if (!motor() || typeof window.SpeechSynthesisUtterance !== 'function') return 'yok-api';
    if (!seslerBilinir) return 'bekleniyor';
    return trSes() ? 'var' : 'yok-tr';
  }

  function hizOku() { const v = Number(U.oku('sesHiz', 1)); return HIZLAR.indexOf(v) >= 0 ? v : 1; }

  /* ---------- tanı günlüğü ---------- */
  let gunluk = U.oku('sesGunluk', []) || [];
  if (!Array.isArray(gunluk)) gunluk = [];
  function kaydet(olay, ek) {
    const g = { t: Date.now(), olay };
    if (ek !== undefined && ek !== null && ek !== '') g.ek = String(ek).slice(0, 80);
    if (document.visibilityState) g.gorunur = document.visibilityState === 'visible' ? 1 : 0;
    gunluk.push(g);
    if (gunluk.length > GUNLUK_TAVAN) gunluk = gunluk.slice(-GUNLUK_TAVAN);
    U.yaz('sesGunluk', gunluk);
  }
  function gunlukMetni() {
    if (!gunluk.length) return '';
    const t0 = gunluk[0].t, ilk = new Date(t0), p = n => String(n).padStart(2, '0');
    return 'Başlangıç ' + p(ilk.getHours()) + ':' + p(ilk.getMinutes()) + ':' + p(ilk.getSeconds()) +
      ' · ' + (navigator.userAgent || '') + (window.matchMedia && matchMedia('(display-mode: standalone)').matches ? ' · KURULU PWA' : ' · tarayıcı sekmesi') + '\n' +
      gunluk.map(g => '+' + ((g.t - t0) / 1000).toFixed(1) + ' sn  ' + g.olay + (g.ek ? ' (' + g.ek + ')' : '') + (g.gorunur === 0 ? '  [arka plan]' : '')).join('\n');
  }

  /* ---------- bağlam: hangi sayfa, hangi bloklar ---------- */
  let baglam = null;    // { kap, cubuk, bloklar: [{el, metin}], ad }
  let ot = null;        // { birimler: [{el, parcalar}], i, j, durum, sonOlay, hataSay, kaydirilan }
  let jetonSayac = 0, aktifJeton = 0;

  function vurgula() {
    if (!baglam) return;
    baglam.bloklar.forEach((b, i) => {
      b.el.classList.toggle('so-okunan', !!ot && ot.i === i);
      b.el.classList.toggle('so-p', !!ot);
    });
    if (!ot) return;
    const el = ot.birimler[ot.i] && ot.birimler[ot.i].el;
    if (el && ot.kaydirilan !== ot.i) {   // aynı blokta tekrar kaydırma yok (kullanıcı elle kaydırabilsin)
      ot.kaydirilan = ot.i;
      try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { /* eski tarayıcı */ }
    }
  }

  /* ---------- ekran uyanık ---------- */
  let kilit = null, kilitIstekte = false;
  function kilitUygun() { return !!ot && ot.durum === 'oynuyor' && document.visibilityState === 'visible'; }
  function kilitAl() {
    if (!kilitUygun() || kilit || kilitIstekte) return;
    const wl = navigator.wakeLock;
    if (!wl || typeof wl.request !== 'function') { if (!ot.kilitYok) { ot.kilitYok = true; kaydet('ekran kilidi: destek yok'); } return; }
    kilitIstekte = true;
    let p;
    try { p = wl.request('screen'); } catch (e) { p = Promise.reject(e); }
    Promise.resolve(p).then(l => {
      kilitIstekte = false;
      if (!l) return;
      if (!kilitUygun()) { try { l.release(); } catch (e) { /* yok */ } return; }
      kilit = l;
      try { l.addEventListener('release', () => { if (kilit !== l) return; kilit = null; if (ot) kaydet('ekran kilidi: tarayıcı bıraktı'); }); } catch (e) { /* yok */ }
      kaydet('ekran uyanık');
    }, e => { kilitIstekte = false; if (ot) kaydet('ekran kilidi: reddedildi', (e && (e.name || e.message)) || 'hata'); });
  }
  function kilitBirak(sebep) {
    if (!kilit) return;
    const l = kilit; kilit = null;
    try { const r = l.release(); if (r && r.catch) r.catch(() => {}); } catch (e) { /* yok */ }
    kaydet('ekran kilidi bırakıldı', sebep);
  }

  /* ---------- konuşma ---------- */
  function konus() {
    const s = motor();
    if (!ot || !s) return;
    const b = ot.birimler[ot.i];
    if (!b) { bitir('bitti'); return; }
    const parca = b.parcalar[ot.j];
    if (parca === undefined) { bitir('bitti'); return; }
    const jeton = aktifJeton = ++jetonSayac;
    try { s.cancel(); } catch (e) { /* yok */ }
    const u = new window.SpeechSynthesisUtterance(parca);
    u.lang = 'tr-TR';
    const v = trSes(); if (v) u.voice = v;
    u.rate = hizOku();
    ot.utt = u;   // çöpe atılmasın: Chrome'da yalnız yerel değişkendeki konuşmanın onend'i gelmeyebiliyor
    u.onstart = () => { if (jeton !== aktifJeton || !ot) return; ot.sonOlay = Date.now(); kaydet('başladı', (ot.i + 1) + '.' + (ot.j + 1)); };
    u.onend = () => {
      if (jeton !== aktifJeton || !ot || ot.durum !== 'oynuyor') return;
      ot.sonOlay = Date.now(); ot.hataSay = 0;
      kaydet('bitti', (ot.i + 1) + '.' + (ot.j + 1));
      ilerle();
    };
    u.onerror = e => {
      const hata = (e && e.error) || 'hata';
      if (jeton !== aktifJeton || !ot) return;   // iptal edilmiş konuşmanın geç olayı
      kaydet('hata', hata);
      if (ot.durum !== 'oynuyor') return;
      ot.sonOlay = Date.now();
      if (document.visibilityState === 'hidden') { sistemDuraklat('arka planda ' + hata); return; }
      if (hata === 'interrupted' || hata === 'canceled') return;
      ot.hataSay = (ot.hataSay || 0) + 1;
      if (ot.hataSay >= 2) { sistemDuraklat('motor okuyamadı: ' + hata); return; }
      setTimeout(() => { if (jeton === aktifJeton && ot && ot.durum === 'oynuyor') konus(); }, 800);
    };
    ot.sonOlay = Date.now();
    vurgula();
    try { s.speak(u); } catch (e) { kaydet('hata', 'speak: ' + (e && e.message)); bitir('hata'); }
  }
  function ilerle() {
    if (!ot) return;
    ot.j++;
    if (ot.j >= ot.birimler[ot.i].parcalar.length) { ot.i++; ot.j = 0; }
    if (ot.i >= ot.birimler.length) { bitir('bitti'); return; }
    konus();
  }
  function baslat(sira) {
    if (sesDurumu() !== 'var' || !baglam || !baglam.bloklar.length) return false;
    durdur('yeni okuma');
    gunluk = [];
    ot = { birimler: baglam.bloklar.map(b => ({ el: b.el, parcalar: parcala(b.metin) })), i: Math.max(0, Math.min(baglam.bloklar.length - 1, parseInt(sira, 10) || 0)), j: 0, durum: 'oynuyor', sonOlay: Date.now() };
    kaydet('oturum', baglam.ad + ' · ' + ot.birimler.length + ' blok · hız ' + hizOku());
    konus(); kilitAl(); ciz();
    return true;
  }
  function duraklat() {
    if (!ot || ot.durum !== 'oynuyor') return;
    ot.durum = 'duraklatildi';
    aktifJeton = ++jetonSayac;
    try { motor() && motor().cancel(); } catch (e) { /* yok */ }
    kaydet('duraklat', (ot.i + 1) + '.' + (ot.j + 1));
    kilitBirak('duraklat'); ciz();
  }
  function sistemDuraklat(neden) {
    if (!ot || ot.durum !== 'oynuyor') return;
    ot.durum = 'duraklatildi';
    aktifJeton = ++jetonSayac;
    try { motor() && motor().cancel(); } catch (e) { /* yok */ }
    kaydet('duraklatıldı', neden + ' · yer ' + (ot.i + 1) + '.' + (ot.j + 1));
    kilitBirak('duraklatıldı'); ciz();
  }
  function devam() {
    if (!ot || ot.durum !== 'duraklatildi') return;
    ot.durum = 'oynuyor'; ot.hataSay = 0;
    kaydet('devam', (ot.i + 1) + '.' + (ot.j + 1));
    konus(); kilitAl(); ciz();
  }
  function atla(sira) {
    if (!ot) return;
    ot.i = Math.max(0, Math.min(ot.birimler.length - 1, sira)); ot.j = 0;
    ot.durum = 'oynuyor';
    kaydet('atla', String(ot.i + 1));
    konus(); kilitAl(); ciz();
  }
  function bitir(sebep) {
    if (!ot) return;
    kaydet(sebep === 'bitti' ? 'sona erdi' : 'durdu', sebep);
    kilitBirak(sebep);
    ot = null;
    aktifJeton = ++jetonSayac;
    vurgula(); ciz();
  }
  function durdur(sebep) {
    if (!ot) return;
    aktifJeton = ++jetonSayac;
    try { motor() && motor().cancel(); } catch (e) { /* yok */ }
    bitir(sebep || 'durdur');
  }

  /* BEKÇİ: oynuyor ama motor ne konuşuyor ne sırada bekliyor ve son olaydan 3 sn geçti →
     motor haber vermeden susmuş. Kaldığı parçadan yeniden konuş. Gizliyken asla. */
  function bekci() {
    const s = motor();
    if (!ot || ot.durum !== 'oynuyor' || !s) return;
    if (baglam && !baglam.cubuk.isConnected) { durdur('sayfa değişti'); return; }
    if (document.visibilityState === 'hidden') return;
    if (s.speaking || s.pending) return;
    if (Date.now() - (ot.sonOlay || 0) < 3000) return;
    kaydet('bekçi: sessiz motor, yeniden', (ot.i + 1) + '.' + (ot.j + 1));
    konus();
  }

  /* ---------- çubuk (Dinle / kontroller) ---------- */
  function hizSecHtml() {
    const h = hizOku();
    return '<select class="so-hiz" aria-label="Okuma hızı">' + HIZLAR.map(v => '<option value="' + v + '"' + (v === h ? ' selected' : '') + '>' + String(v).replace('.', ',') + '×</option>').join('') + '</select>';
  }
  function cubukHtml() {
    const d = sesDurumu();
    if (d === 'bekleniyor') return '';
    if (d === 'yok-api') return '<span class="so-mesaj">Bu tarayıcı sesli okumayı desteklemiyor.</span>';
    if (d === 'yok-tr') return '<span class="so-mesaj">Bu cihazda Türkçe ses bulunamadı. Chrome yalnız telefonun varsayılan metin okuma motorunun seslerini kullanır; ayarlardaki "Metin okuma" bölümünden Türkçe destekleyen bir motor seçip Türkçe ses verisini yükleyebilirsin.</span>';
    if (!ot) return '<button type="button" class="dugme dolu so-btn" data-so="dinle">Dinle</button>' + hizSecHtml();
    return (ot.durum === 'oynuyor'
      ? '<button type="button" class="dugme so-btn" data-so="duraklat">Duraklat</button>'
      : '<button type="button" class="dugme dolu so-btn" data-so="devam">Devam</button>') +
      '<button type="button" class="dugme so-btn" data-so="durdur">Durdur</button>' + hizSecHtml() +
      '<span class="so-konum" aria-live="off">' + (ot.i + 1) + ' / ' + ot.birimler.length + '</span>';
  }
  function taniHtml() {
    if (!gunluk.length) return '';
    return '<details class="so-tani"><summary>Okuma tanısı (son oturum, ' + gunluk.length + ' olay)</summary><pre class="so-tani-metin">' + U.kacis(gunlukMetni()) + '</pre>' +
      '<button type="button" class="dugme so-btn" data-so="tani-kopya">Kopyala</button></details>';
  }
  function ciz() {
    if (!baglam || !baglam.cubuk.isConnected) return;
    const c = baglam.cubuk;
    const html = cubukHtml() + taniHtml();
    if (c.dataset.soHtml === html) return;
    const acik = !!c.querySelector('details.so-tani[open]');
    c.innerHTML = html; c.dataset.soHtml = html;
    if (acik) { const d = c.querySelector('details.so-tani'); if (d) d.open = true; }
  }

  /* kap içindeki .okunur blokları sesli okunur; cubuk kontrollerin konacağı öğe */
  function bagla(kap, cubuk, ad) {
    durdur('yeni sayfa');
    baglam = { kap, cubuk, ad: ad || 'sayfa', bloklar: [...kap.querySelectorAll('.okunur')].map(el => ({ el, metin: noktala(el.textContent) })).filter(b => b.metin) };
    cubuk.classList.add('so-cubuk');
    cubuk.addEventListener('click', e => {
      const b = e.target.closest('[data-so]'); if (!b) return;
      const a = b.dataset.so;
      if (a === 'dinle') baslat(0);
      else if (a === 'duraklat') duraklat();
      else if (a === 'devam') devam();
      else if (a === 'durdur') durdur('durdur düğmesi');
      else if (a === 'tani-kopya') { try { navigator.clipboard.writeText(gunlukMetni()); } catch (h) { /* pano yok */ } }
    });
    cubuk.addEventListener('change', e => {
      if (!e.target.classList.contains('so-hiz')) return;
      const v = parseFloat(e.target.value);
      if (HIZLAR.indexOf(v) < 0) return;
      U.yaz('sesHiz', v); kaydet('hız', String(v));
      if (ot && ot.durum === 'oynuyor') konus();   // yeni hız çalan parçadan itibaren
      ciz();
    });
    /* oturum açıkken bloğa dokunma → oradan (boşta dokunmak ses başlatmaz) */
    kap.addEventListener('click', e => {
      if (!ot || e.target.closest('a,button,input,select,textarea,summary')) return;
      const el = e.target.closest('.okunur');
      const i = baglam.bloklar.findIndex(b => b.el === el);
      if (i >= 0) atla(i);
    });
    ciz();
  }

  /* ---------- kurulum ---------- */
  (function kur() {
    const s = motor();
    if (s) {
      sesleriOku();
      const yenile = () => { sesleriOku(); seslerBilinir = true; ciz(); };
      try { if (s.addEventListener) s.addEventListener('voiceschanged', yenile); else s.onvoiceschanged = yenile; } catch (e) { /* yok */ }
      setTimeout(() => { if (!seslerBilinir) { sesleriOku(); seslerBilinir = true; ciz(); } }, SES_BEKLE_MS);
    }
    window.addEventListener('hashchange', () => durdur('sayfa değişti'));
    const yasam = olay => () => {
      if (!ot) return;
      kaydet(olay, ot.durum);
      if (olay === 'arka plan') kilitBirak('gizlendi');
      if (olay === 'görünür') { kilitAl(); setTimeout(bekci, 600); }
    };
    document.addEventListener('visibilitychange', () => (document.visibilityState === 'visible' ? yasam('görünür') : yasam('arka plan'))());
    window.addEventListener('pagehide', yasam('pagehide'));
    window.addEventListener('pageshow', yasam('pageshow'));
    document.addEventListener('freeze', yasam('freeze'));
    document.addEventListener('resume', yasam('resume'));
    setInterval(bekci, 4000);
  })();

  window.Ses = {
    destek: !!motor(), parcala, HIZLAR, PARCA_TAVAN, sesDurumu, bagla, baslat, duraklat, devam, durdur, atla, bekci,
    durum: () => ot ? { i: ot.i, j: ot.j, durum: ot.durum, blok: ot.birimler.length } : null,
    kilitVar: () => !!kilit, gunluk: () => gunluk.slice(), gunlukMetni,
    sesleriYenile: () => { sesleriOku(); seslerBilinir = true; ciz(); }
  };
})();
