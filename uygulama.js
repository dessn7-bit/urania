/* uygulama.js — yönlendirme, ayarlar, veri yükleme ve ortak biçimleyiciler. */
(function () {
  'use strict';

  const moduller = {};
  const ilkKurulan = {};
  const veriOnbellek = {};

  /* ---- Güvenli yerel depo: gizli pencere / kapalı depo uygulamayı düşürmez ---- */
  const DEPO_ONEK = 'urania_';
  function oku(anahtar, varsayilan) {
    try {
      const v = localStorage.getItem(DEPO_ONEK + anahtar);
      return v == null ? varsayilan : JSON.parse(v);
    } catch (e) { return varsayilan; }
  }
  function yaz(anahtar, deger) {
    try { localStorage.setItem(DEPO_ONEK + anahtar, JSON.stringify(deger)); } catch (e) { /* depo yoksa ayar bu oturumla sınırlı kalır */ }
  }

  /* Varsayılan konum: Kadıköy merkez (yaklaşık). Kullanıcı GPS ya da elle değiştirebilir. */
  const VARSAYILAN_KONUM = { ad: 'Kadıköy, İstanbul', enlem: 40.990, boylam: 29.029, yukseklik: 20, saatDilimi: 'Europe/Istanbul' };
  function gecerliDilim(z) {
    try { new Intl.DateTimeFormat('tr-TR', { timeZone: z }); return true; } catch (e) { return false; }
  }
  /* Bozuk/eksik kayıt uygulamayı düşürmesin: enlem/boylam sayı değilse varsayılana dön. */
  function konum() {
    const k = oku('konum', null);
    if (!k || !isFinite(k.enlem) || !isFinite(k.boylam) || Math.abs(k.enlem) > 90 || Math.abs(k.boylam) > 180) return VARSAYILAN_KONUM;
    if (!k.saatDilimi || !gecerliDilim(k.saatDilimi)) k.saatDilimi = VARSAYILAN_KONUM.saatDilimi;
    return k;
  }
  function konumYaz(k) { yaz('konum', k); bicimleyicileriKur(k.saatDilimi); }
  /* Elle girilen konum için saat dilimi: cihazın dilimi boylamla uyumluysa o, değilse boylamdan (Etc/GMT±n). */
  function dilimTahmin(boylam) {
    const cihaz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cihazOfs = -new Date().getTimezoneOffset() / 60;
    const tahmin = Math.round(boylam / 15);
    if (Math.abs(cihazOfs - tahmin) <= 1) return cihaz;
    return tahmin === 0 ? 'UTC' : 'Etc/GMT' + (tahmin > 0 ? '-' : '+') + Math.abs(tahmin);
  }
  function dilimAdi(z) {
    if (z === 'Europe/Istanbul') return 'Türkiye saati';
    if (z === 'UTC') return 'UTC';
    const m = /^Etc\/GMT([+-])(\d+)$/.exec(z);
    if (m) return 'UTC' + (m[1] === '-' ? '+' : '−') + m[2] + ' (boylamdan yaklaşık)';
    return z;
  }

  /* ---- Veri ---- */
  function veri(ad) {
    if (!veriOnbellek[ad]) {
      veriOnbellek[ad] = fetch('./veri/' + ad + '.json').then(r => {
        if (!r.ok) throw new Error(ad + '.json yüklenemedi (' + r.status + ')');
        return r.json();
      });
    }
    return veriOnbellek[ad];
  }

  /* ---- Biçimleyiciler (Türkçe: ondalık virgül, 24 saat) ---- */
  const sayiBicim = {};
  function sayi(x, basamak, enAz) {
    if (x == null || !isFinite(x)) return '—';
    const k = basamak + '_' + (enAz == null ? basamak : enAz);
    if (!sayiBicim[k]) sayiBicim[k] = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: basamak, minimumFractionDigits: enAz == null ? basamak : enAz });
    return sayiBicim[k].format(x);
  }
  /* Bilimsel gösterim: 1,23 × 10⁸ */
  const UST = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function bilimsel(x, anlamli) {
    if (x == null || !isFinite(x)) return '—';
    if (x === 0) return '0';
    const us = Math.floor(Math.log10(Math.abs(x)));
    if (us >= -3 && us <= 5) return sayi(x, Math.max(0, (anlamli || 3) - 1 - us));
    const m = x / Math.pow(10, us);
    const ustStr = String(us).split('').map(c => UST[c]).join('');
    return sayi(m, (anlamli || 3) - 1) + ' × 10' + ustStr;
  }
  let saatB, gunB, gunHaftaB, tamB;
  function bicimleyicileriKur(z) {
    const tz = z && gecerliDilim(z) ? { timeZone: z } : {};
    saatB = new Intl.DateTimeFormat('tr-TR', Object.assign({ hour: '2-digit', minute: '2-digit' }, tz));
    gunB = new Intl.DateTimeFormat('tr-TR', Object.assign({ day: 'numeric', month: 'long' }, tz));
    gunHaftaB = new Intl.DateTimeFormat('tr-TR', Object.assign({ day: 'numeric', month: 'long', weekday: 'long' }, tz));
    tamB = new Intl.DateTimeFormat('tr-TR', Object.assign({ day: 'numeric', month: 'long', year: 'numeric' }, tz));
  }
  bicimleyicileriKur(konum().saatDilimi);
  function saat(d) { return d ? saatB.format(d) : '—'; }
  function gun(d) { return d ? gunB.format(d) : '—'; }
  function gunHafta(d) { return d ? gunHaftaB.format(d) : '—'; }
  function tamTarih(d) { return d ? tamB.format(d) : '—'; }
  function kadir(m) { return (m < 0 ? '−' : '') + sayi(Math.abs(m), 1); }
  function derece(x) { return sayi(Math.round(x) || 0, 0) + '°'; }
  function kacGun(fark) {
    const g = Math.round(fark);
    if (g === 0) return 'bugün';
    if (g === 1) return 'yarın';
    if (g === -1) return 'dün';
    return g > 0 ? g + ' gün sonra' : (-g) + ' gün önce';
  }
  /* Yalnız http(s) bağlantılar; aksi hâlde zararsız "#" */
  function guvenliUrl(u) { return /^https?:\/\//i.test(String(u || '')) ? kacis(u) : '#'; }
  function kacis(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---- Kırmızı mod ---- */
  function kirmiziUygula(acik) {
    document.documentElement.classList.toggle('kirmizi', acik);
    const d = document.getElementById('kirmiziDugme');
    if (d) d.setAttribute('aria-pressed', String(acik));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', acik ? '#000000' : '#0F1B2D');
    document.dispatchEvent(new CustomEvent('urania:tema'));
  }

  /* ---- Yönlendirme: #gok, #deney/karadelik, #ders/d3, #hesap ---- */
  function rota() {
    const h = (location.hash || '#gok').slice(1).split('/');
    return { bolum: moduller[h[0]] ? h[0] : 'gok', param: h.slice(1).join('/') };
  }
  function goster() {
    const { bolum, param } = rota();
    document.querySelectorAll('.bolum').forEach(s => { s.hidden = s.dataset.bolum !== bolum; });
    document.querySelectorAll('[data-sekme]').forEach(a => {
      if (a.dataset.sekme === bolum) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const el = document.getElementById('b-' + bolum);
    if (rota.son !== bolum) { window.scrollTo(0, 0); rota.son = bolum; }
    const m = moduller[bolum];
    const hataGoster = e => {
      console.error(e);
      el.insertAdjacentHTML('beforeend', '<div class="hata-kutu" role="alert">Bu bölüm açılırken hata oluştu: ' + kacis(e && e.message || e) + '</div>');
    };
    try {
      if (!ilkKurulan[bolum]) {
        ilkKurulan[bolum] = true;
        /* ilk() async: reddi try/catch'e düşmez, ayrıca yakalanır */
        const sonuc = m.ilk && m.ilk(el);
        if (sonuc && sonuc.catch) sonuc.catch(hataGoster);
      }
      m.goster && m.goster(el, param);
    } catch (e) { hataGoster(e); }
    document.title = 'Urania — ' + ({ gok: 'Gökyüzü', deney: 'Deneyler', ders: 'Dersler', hesap: 'Hesap', defter: 'Defter', ar: 'Gökyüzüne bak' }[bolum]);
  }

  function basla() {
    kirmiziUygula(!!oku('kirmizi', false));
    document.getElementById('kirmiziDugme').addEventListener('click', () => {
      const yeni = !document.documentElement.classList.contains('kirmizi');
      yaz('kirmizi', yeni);
      kirmiziUygula(yeni);
    });
    window.addEventListener('hashchange', goster);
    goster();
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* çevrimdışı önbellek olmadan da çalışır */ });
    }
  }

  window.Urania = {
    modul(ad, tanim) { moduller[ad] = tanim; },
    basla, oku, yaz, konum, konumYaz, VARSAYILAN_KONUM, dilimTahmin, dilimAdi, veri, guvenliUrl,
    sayi, bilimsel, saat, gun, gunHafta, tamTarih, kadir, derece, kacGun, kacis
  };
})();
