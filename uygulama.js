/* uygulama.js — yönlendirme, ayarlar, veri yükleme ve ortak biçimleyiciler. */
(function () {
  'use strict';

  const moduller = {};
  const ilkKurulan = {};
  const veriOnbellek = {};

  /* ---- Güvenli yerel depo: gizli pencere / kapalı depo uygulamayı düşürmez ---- */
  const DEPO_ONEK = 'urania_';
  /* Türü bilinen okuma: düz nesne ya da dizi değilse boş olanı döner (bozuk ya da başka uygulamanın yazdığı değer çökertmesin) */
  function nesneOku(anahtar) { const v = oku(anahtar, null); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }
  function diziOku(anahtar) { const v = oku(anahtar, null); return Array.isArray(v) ? v : []; }
  function oku(anahtar, varsayilan) {
    try {
      const v = localStorage.getItem(DEPO_ONEK + anahtar);
      return v == null ? varsayilan : JSON.parse(v);
    } catch (e) { return varsayilan; }
  }
  /* true: yazıldı; false: depo dolu/kapalı — çağıran kullanıcıya söylemeli (defter gibi) */
  /* Depo dolunca (köken aynı adresteki başka uygulamalarla paylaşılıyor) yeniden indirilebilen önbellekler
     silinip bir kez daha denenir; kullanıcı verisi (defter, kartlar, ayarlar) silinmez. */
  /* Silme sırası: en az değerli önce (tanı günlüğü, yer adları, hava; yörünge verisi en son) */
  const ONBELLEK_ONEK = ['sesGunluk', 'yerAdlari', 'hava_', 'hava2_', 'gp_'];
  function yaz(anahtar, deger) {
    const m = JSON.stringify(deger);
    try { localStorage.setItem(DEPO_ONEK + anahtar, m); return true; } catch (e) { /* aşağıda */ }
    /* Yazılamayan şey kendisi bir önbellekse başka önbellek silinmez (günlük yüzünden yörünge verisi gitmesin) */
    if (ONBELLEK_ONEK.some(o => anahtar.indexOf(o) === 0)) return false;
    for (const o of ONBELLEK_ONEK) {
      anahtarlar(o).forEach(a => { try { localStorage.removeItem(DEPO_ONEK + a); } catch (h) { /* yok */ } });
      try { localStorage.setItem(DEPO_ONEK + anahtar, m); return true; } catch (e) { /* sıradaki önbellek */ }
    }
    return false;
  }
  /* Ön ekli anahtarları süz (önbellek temizliği için) */
  function anahtarlar(onek) {
    const ls = [];
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf(DEPO_ONEK + onek) === 0) ls.push(k.slice(DEPO_ONEK.length)); } } catch (e) { /* depo yok */ }
    return ls;
  }
  function sil(anahtar) { try { localStorage.removeItem(DEPO_ONEK + anahtar); } catch (e) { /* depo yok */ } }

  /* Varsayılan konum: Fetih Mahallesi, Ataşehir — OpenStreetMap (Nominatim) mahalle merkezi
     41.0046423, 29.0762052. Kullanıcı GPS ya da elle değiştirebilir. */
  const VARSAYILAN_KONUM = { ad: 'Fetih Mahallesi, Ataşehir', enlem: 41.0046, boylam: 29.0762, yukseklik: 20, saatDilimi: 'Europe/Istanbul' };
  const dilimSonuc = new Map();   // Map: "constructor" gibi adlar nesne prototipine takılmasın
  function gecerliDilim(z) {
    if (typeof z !== 'string') return false;
    if (dilimSonuc.has(z)) return dilimSonuc.get(z);   // konum() sık çağrılır; biçimleyici kurmak pahalı
    let ok = false;
    try { new Intl.DateTimeFormat('tr-TR', { timeZone: z }); ok = true; } catch (e) { ok = false; }
    dilimSonuc.set(z, ok); return ok;
  }
  /* Bozuk/eksik kayıt uygulamayı düşürmesin: enlem/boylam sayı değilse varsayılana dön. */
  function konum() {
    const k = oku('konum', null);
    if (!k || !isFinite(k.enlem) || !isFinite(k.boylam) || Math.abs(k.enlem) > 90 || Math.abs(k.boylam) > 180) return VARSAYILAN_KONUM;
    if (!k.saatDilimi || !gecerliDilim(k.saatDilimi)) k.saatDilimi = VARSAYILAN_KONUM.saatDilimi;
    return k;
  }
  /* Konum adı 80 karaktere kırpılır (yedekte ve ekranda sorun çıkmasın). Yazılamazsa false döner. */
  function konumYaz(k) {
    const kk = Object.assign({}, k, { ad: String(k.ad || 'Özel konum').slice(0, 80) });
    const ok = yaz('konum', kk); bicimleyicileriKur(kk.saatDilimi); return ok;
  }
  /* Elle girilen konum için saat dilimi tahmini: Türkiye'nin sınırları içindeyse Türkiye saati; değilse cihazın
     dilimi boylamla uyumluysa o, değilse boylamdan (Etc/GMT±n). Konum panelinde listeden düzeltilebilir. */
  function dilimTahmin(boylam, enlem) {
    /* Kaba Türkiye kutusu; kuzeydoğuda Gürcistan ve Ermenistan dışarıda bırakılır */
    if (enlem != null && enlem >= 35.8 && enlem <= 42.2 && boylam >= 25.6 && boylam <= 44.9 &&
        !(enlem > 41.2 && boylam > 41.6) && !(enlem > 40.0 && boylam > 43.45)) return 'Europe/Istanbul';
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

  /* ---- Gerektiğinde yüklenen betikler (sıra korunur; hata olursa söz reddedilir, sonra yeniden denenebilir) ---- */
  const betikOnbellek = {};
  function betikler(ls) {
    const an = ls.join('|');
    if (!betikOnbellek[an]) {
      betikOnbellek[an] = Promise.all(ls.map(src => new Promise((coz, red) => {
        if (document.querySelector('script[data-betik="' + src + '"]')) return coz();
        const s = document.createElement('script');
        s.src = src; s.async = false; s.dataset.betik = src;   // async=false: eklenme sırasıyla çalışır
        s.onload = () => coz(); s.onerror = () => { s.remove(); red(new Error(src + ' yüklenemedi')); };
        document.head.appendChild(s);
      }))).catch(e => { delete betikOnbellek[an]; throw e; });
    }
    return betikOnbellek[an];
  }

  /* ---- Veri ---- */
  function veri(ad) {
    if (!veriOnbellek[ad]) {
      veriOnbellek[ad] = fetch('./veri/' + ad + '.json').then(r => {
        if (!r.ok) throw new Error(ad + '.json yüklenemedi (' + r.status + ')');
        return r.json();
      }).catch(e => { delete veriOnbellek[ad]; throw e; });   // geçici hata oturum boyunca kalmasın
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
    const tz = z && gecerliDilim(z) ? { timeZone: z } : { timeZone: 'Europe/Istanbul' };
    saatB = new Intl.DateTimeFormat('tr-TR', Object.assign({ hour: '2-digit', minute: '2-digit' }, tz));
    gunB = new Intl.DateTimeFormat('tr-TR', Object.assign({ day: 'numeric', month: 'long' }, tz));
    gunHaftaB = new Intl.DateTimeFormat('tr-TR', Object.assign({ day: 'numeric', month: 'long', weekday: 'long' }, tz));
    tamB = new Intl.DateTimeFormat('tr-TR', Object.assign({ day: 'numeric', month: 'long', year: 'numeric' }, tz));
  }
  bicimleyicileriKur(konum().saatDilimi);
  /* En yakın dakikaya yuvarlanır (USNO gibi); Intl kendiliğinden aşağı keser */
  function saat(d) { return d ? saatB.format(new Date(Math.round(d.getTime() / 60e3) * 60e3)) : '—'; }
  /* Tarih de dakikaya yuvarlanır: 23:59:45 "00:00" yazılırken gün de ertesi gün olsun */
  const dkYuvarla = d => new Date(Math.round(d.getTime() / 60e3) * 60e3);
  function gun(d) { return d ? gunB.format(dkYuvarla(d)) : '—'; }
  function gunHafta(d) { return d ? gunHaftaB.format(dkYuvarla(d)) : '—'; }
  function tamTarih(d) { return d ? tamB.format(d) : '—'; }
  function kadir(m) { return (m <= -0.05 ? '−' : '') + sayi(Math.abs(m), 1); }
  function derece(x) { return sayi(Math.round(x) || 0, 0) + '°'; }
  function kacGun(fark) {
    const g = Math.round(fark);
    if (g === 0) return 'bugün';
    if (g === 1) return 'yarın';
    if (g === -1) return 'dün';
    return g > 0 ? g + ' gün sonra' : (-g) + ' gün önce';
  }
  /* Türkçe hâl eki: sayı/saat okunuşuna göre ünlü uyumu ve sertleşme.
     "20:05" → "beş" → 'te; "17:06" → "altı" → 'da; "21:00" → "yirmi bir" → 'de.
     tur: 'de' (bulunma), 'e' (yönelme), 'den' (ayrılma). */
  const SON_KELIME = { 0: 'sıfır', 1: 'bir', 2: 'iki', 3: 'üç', 4: 'dört', 5: 'beş', 6: 'altı', 7: 'yedi', 8: 'sekiz', 9: 'dokuz',
    10: 'on', 20: 'yirmi', 30: 'otuz', 40: 'kırk', 50: 'elli', 60: 'altmış', 70: 'yetmiş', 80: 'seksen', 90: 'doksan', 100: 'yüz', 1000: 'bin' };
  function sonOkunus(metin) {
    const m = String(metin).replace(/(\d)\.(?=\d{3}(?!\d))/g, '$1').match(/(\d+)(?::(\d+))?\D*$/);
    if (!m) return 'bir';
    let n = m[2] != null ? (Number(m[2]) || Number(m[1])) : Number(m[1]);
    if (n === 0) return 'sıfır';
    if (n % 1000 === 0) return 'bin';
    if (n % 100 === 0) return 'yüz';
    if (n % 10 === 0) return SON_KELIME[n % 100];
    return SON_KELIME[n % 10];
  }
  function ek(metin, tur) {
    const k = sonOkunus(metin);
    const unluler = k.match(/[aıoueiöü]/g);
    const kalin = /[aıou]/.test(unluler[unluler.length - 1]);
    const sonHarf = k[k.length - 1];
    const unluyleBiter = /[aıoueiöü]/.test(sonHarf);
    const sert = /[çfhkpsşt]/.test(sonHarf);
    let e;
    if (tur === 'de') e = (sert ? 't' : 'd') + (kalin ? 'a' : 'e');
    else if (tur === 'den') e = (sert ? 't' : 'd') + (kalin ? 'an' : 'en');
    else e = (unluyleBiter ? 'y' : '') + (kalin ? 'a' : 'e');
    return metin + "'" + e;
  }

  /* Takvim dosyası (.ics, RFC 5545): telefonda açılınca takvim uygulamasına eklenir.
     Olaydan bir saat önce hatırlatma içerir. */
  /* RFC 5545: tek başına CR de satır sonu sayılır; diğer denetim karakterleri silinir (başka VEVENT eklenemesin) */
  function icsKacis(t) { return String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r\n|\r|\n/g, '\\n').replace(/[\x00-\x08\x0b-\x1f\x7f]/g, ''); }
  function icsZaman(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  /* RFC 5545: satır 75 bayttan (UTF-8) uzunsa katlanır; çok baytlı harfler bölünmez */
  function icsKatla(satir) {
    const p = []; let cur = '', bayt = 0;
    for (const ch of satir) {
      const b = new TextEncoder().encode(ch).length;
      if (bayt + b > 74) { p.push(cur); cur = ' '; bayt = 1; }
      cur += ch; bayt += b;
    }
    p.push(cur);
    return p.join('\r\n');
  }
  function icsMetni(o) {
    const son = o.son || new Date(o.bas.getTime() + 3600e3);
    const satirlar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Urania//Gokyuzu//TR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + icsZaman(o.bas) + '-' + o.baslik.replace(/[^A-Za-z0-9]/g, '').slice(0, 20) + '@urania',
      'DTSTAMP:' + icsZaman(new Date()), 'DTSTART:' + icsZaman(o.bas), 'DTEND:' + icsZaman(son),
      'SUMMARY:' + icsKacis(o.baslik), 'DESCRIPTION:' + icsKacis(o.aciklama || ''),
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsKacis(o.baslik), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'];
    return satirlar.map(icsKatla).join('\r\n') + '\r\n';
  }
  function icsIndir(o) {
    const blob = new Blob([icsMetni(o)], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'urania-' + o.baslik.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g, '-').replace(/^-|-$/g, '') + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* Yalnız http(s) bağlantılar; aksi hâlde zararsız "#" */
  function guvenliUrl(u) { return /^https?:\/\//i.test(String(u || '')) ? kacis(u) : '#'; }
  function kacis(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---- Kırmızı mod ---- */
  /* Kırmızı mod açıkken ekran kararmasın: kırmızı mod gece dışarıda gözlem demek; ekran her kararınca açmak için
     parlak kilit ekranı gözü kamaştırır. Sayfa gizlenince tarayıcı kilidi kendisi bırakır; görünür olunca yeniden istenir. */
  let ekranKilidi = null;
  function ekranAcikTut() {
    const iste = document.documentElement.classList.contains('kirmizi') && !document.hidden;
    if (!iste) {
      if (ekranKilidi) { const k = ekranKilidi; ekranKilidi = null; try { Promise.resolve(k.release()).catch(() => {}); } catch (h) { /* yok */ } }
      return;
    }
    if (ekranKilidi && !ekranKilidi.released) return;
    if (!navigator.wakeLock) return;
    let istek;
    try { istek = navigator.wakeLock.request('screen'); } catch (h) { return; }
    Promise.resolve(istek).then(k => {
      if (!k) return;
      if (!document.documentElement.classList.contains('kirmizi') || document.hidden) { try { Promise.resolve(k.release()).catch(() => {}); } catch (h) { /* yok */ } return; }
      ekranKilidi = k;
    }).catch(() => { /* izin yoksa ya da pil tasarrufu engellediyse sorun değil */ });
  }
  document.addEventListener('visibilitychange', ekranAcikTut);

  function kirmiziUygula(acik) {
    document.documentElement.classList.toggle('kirmizi', acik);
    ekranAcikTut();
    const d = document.getElementById('kirmiziDugme');
    if (d) d.setAttribute('aria-pressed', String(acik));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', acik ? '#000000' : '#0F1B2D');
    document.dispatchEvent(new CustomEvent('urania:tema'));
  }

  /* ---- Yönlendirme: #gok, #deney/karadelik, #ders/d3, #hesap ---- */
  function rota() {
    const h = (location.hash || '#gok').slice(1).split('/');
    return { bolum: Object.prototype.hasOwnProperty.call(moduller, h[0]) ? h[0] : 'gok', param: h.slice(1).join('/') };
  }
  function goster() {
    const { bolum, param } = rota();
    document.querySelectorAll('.bolum').forEach(s => { s.hidden = s.dataset.bolum !== bolum; });
    document.querySelectorAll('[data-sekme]').forEach(a => {
      if (a.dataset.sekme === bolum) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const el = document.getElementById('b-' + bolum);
    const yeniBolum = rota.son !== bolum, ilkAcilis = rota.son === undefined;
    /* Bölüm içi gezinme (#deney → #deney/kepler, #defter/gorevler, geri tuşu): görünüm değişir, odak kaybolabilir */
    const yeniGorunum = !yeniBolum && rota.sonParam !== param;
    rota.sonParam = param;
    if (yeniBolum) { window.scrollTo(0, 0); rota.son = bolum; }
    el.querySelectorAll(':scope > .hata-kutu.bolum-hata').forEach(x => x.remove());
    const m = moduller[bolum];
    const hataGoster = (e, ilkHatasi) => {
      console.error(e);
      if (ilkHatasi) ilkKurulan[bolum] = false;   // kurulum başarısızsa bölüme yeniden gelince baştan kurulmayı denesin (goster hatasında değil: çift dinleyici olmasın)
      el.querySelectorAll(':scope > .hata-kutu.bolum-hata').forEach(x => x.remove());
      el.insertAdjacentHTML('beforeend', '<div class="hata-kutu bolum-hata" role="alert">Bu bölüm açılırken hata oluştu: ' + kacis(e && e.message || e) + '. Başka bir sekmeye geçip geri dönünce yeniden denenir.</div>');
    };
    let ilkSoz = null;
    if (!ilkKurulan[bolum]) {
      ilkKurulan[bolum] = true;
      try {
        /* ilk() async: reddi try/catch'e düşmez, ayrıca yakalanır */
        const sonuc = m.ilk && m.ilk(el);
        /* ilk() false dönerse (veri yüklenemedi) bölüm bir sonraki açılışta yeniden kurulur */
        if (sonuc && sonuc.then) ilkSoz = sonuc.then(v => { if (v === false) ilkKurulan[bolum] = false; }, e => hataGoster(e, true));
      } catch (e) { hataGoster(e, true); }
    }
    try { m.goster && m.goster(el, param); } catch (e) { hataGoster(e, false); }
    /* İlk açılışta başlık eşzamansız çizilir: kurulum bitince odak yine başlığa (bölüm kendi odağını kurmadıysa) */
    if (ilkSoz && yeniBolum && !ilkAcilis && bolum !== 'ar') ilkSoz.then(() => { if (rota.son === bolum && !el.contains(document.activeElement)) baslikOdak(el); });
    /* Sekme değişince odak yeni bölümün başlığına (ekran okuyucu yeni sayfayı duyurur); bölüm kendi odağını kurduysa dokunma */
    if (yeniBolum && !ilkAcilis && bolum !== 'ar' && !el.contains(document.activeElement)) baslikOdak(el);
    /* Bölüm içinde görünüm değiştiyse ve görünüm kendi odağını kurmadıysa (ders ve sınav kurar) odak yeni başlığa.
       Görünüm eşzamansız çizilirse (ilk açılış) ilk çizimden sonra bir kez daha bakılır. */
    if (yeniGorunum && bolum !== 'ar') {
      const bak = () => { if (rota.sonParam === param && (!el.contains(document.activeElement) || document.activeElement === el)) baslikOdak(el); };
      bak();
      setTimeout(bak, 0);
    }
    baslikYaz();
  }
  function baslikOdak(el) {
    const h = el.querySelector('h1');
    if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  /* Sayfa başlığı alt görünümü de söyler: "Urania — Deneyler — Kepler yasaları" (h1 metninden).
     Görünümler eşzamansız çizildiği için bölümlerdeki değişiklikte de güncellenir. */
  const BOLUM_AD = { gok: 'Gökyüzü', deney: 'Deneyler', ders: 'Dersler', hesap: 'Hesap', defter: 'Defter', ar: 'Gökyüzüne bak', tani: 'Tanı' };
  function baslikYaz() {
    const { bolum, param } = rota();
    let t = 'Urania — ' + BOLUM_AD[bolum];
    if (param) {
      const h = document.querySelector('#b-' + bolum + ' h1');
      const ad = h && h.textContent.replace(/\s+/g, ' ').trim();
      if (ad && ad !== BOLUM_AD[bolum]) t += ' — ' + ad;
    }
    if (document.title !== t) document.title = t;
  }
  let baslikBekliyor = false;
  const baslikGozcu = new MutationObserver(() => {
    if (baslikBekliyor) return;
    baslikBekliyor = true;
    setTimeout(() => { baslikBekliyor = false; baslikYaz(); }, 0);
  });
  /* Yalnız bölümlerin doğrudan çocukları (görünümler innerHTML ile yeniden çizilir); kare kare değişen ölçümler tetiklemez */
  document.querySelectorAll('.bolum').forEach(s => baslikGozcu.observe(s, { childList: true }));

  /* ---- Otomatik konum: telefon nerdeyse orası (varsayılan açık) ----
     Başarısız olursa son bilinen konum, o da yoksa varsayılan kullanılır.
     Yer adı OpenStreetMap Nominatim ters kodlamasından; ~1 km'lik hücre başına bir kez sorulur. */
  const konumDurum = { kaynak: null, hata: null, hassasiyet: null, zaman: null };
  function otoAcik() { return oku('konumOto', true) !== false; }
  function otoAyarla(acik) { yaz('konumOto', !!acik); }
  function mesafeKm(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLa = (b.enlem - a.enlem) * r, dLo = (b.boylam - a.boylam) * r;
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.enlem * r) * Math.cos(b.enlem * r) * Math.sin(dLo / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function konumBildir() { document.dispatchEvent(new CustomEvent('urania:konum')); }
  function hucre(enlem, boylam) { return enlem.toFixed(2) + ',' + boylam.toFixed(2); }
  async function yerAdi(enlem, boylam) {
    const adlar = nesneOku('yerAdlari');
    const h = hucre(enlem, boylam);
    if (adlar[h]) return adlar[h];
    try {
      /* Yanıt gelmezse konum güncellemeleri kilitlenmesin: 8 sn sınır (gövde dahil) */
      const ctl = new AbortController(), zs = setTimeout(() => ctl.abort(), 8000);
      let r, j;
      try {
        /* 3 basamak (~110 m): mahalle adı için yeterli, gereğinden hassas değil */
        r = await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=tr&lat=' + enlem.toFixed(3) + '&lon=' + boylam.toFixed(3), { signal: ctl.signal });
        if (!r.ok) { T('Nominatim (yer adı)', 'hata', 'HTTP ' + r.status); return null; }
        j = await r.json();
      } finally { clearTimeout(zs); }
      const a = j.address || {};
      T('Nominatim (yer adı)', 'tamam');
      const mahalle = a.suburb || a.quarter || a.neighbourhood || a.village || a.hamlet;
      const ilce = a.town || a.city_district || a.county || a.city || a.province;
      const ad = [mahalle, ilce].filter(Boolean).join(', ');
      if (!ad) return null;
      const yeni = nesneOku('yerAdlari'); yeni[h] = ad;
      const anahtarlar = Object.keys(yeni); if (anahtarlar.length > 200) delete yeni[anahtarlar[0]];
      yaz('yerAdlari', yeni);
      return ad;
    } catch (e) { T('Nominatim (yer adı)', 'hata', e.message); return null; }
  }
  let konumAraniyor = null;
  function konumuBul(zorla) {
    if (!zorla && !otoAcik()) return Promise.resolve(null);
    if (!('geolocation' in navigator)) { konumDurum.hata = 'desteklenmiyor'; konumBildir(); return Promise.resolve(null); }
    if (konumAraniyor) return konumAraniyor;
    let bu = null, bitti = false;
    /* Yalnız kendi sözünü temizler: bekçiden sonra başlayan yeni aramanın sözü eski aramanın geç yanıtıyla silinmesin */
    const bitir = () => { bitti = true; if (konumAraniyor === bu) konumAraniyor = null; };
    bu = konumAraniyor = new Promise(coz => {
      /* İzin sorusu hiç yanıtlanmazsa söz takılı kalmasın: 30 sn sonra serbest bırak; geç gelen yanıt yok sayılır */
      const bekci = setTimeout(() => { bitir(); coz(null); }, 30e3);
      navigator.geolocation.getCurrentPosition(async pos => {
        clearTimeout(bekci);
        /* Bu arada kullanıcı elle konum seçtiyse geç gelen GPS onu ezmesin */
        if (!otoAcik()) { bitir(); coz(null); return; }
        const c = pos.coords;
        const once = konum();
        const yeni = { enlem: +c.latitude.toFixed(4), boylam: +c.longitude.toFixed(4) };
        konumDurum.hata = null; konumDurum.kaynak = 'gps'; konumDurum.hassasiyet = c.accuracy; konumDurum.zaman = new Date();
        T('GPS konumu', 'tamam', '±' + Math.round(c.accuracy) + ' m');
        const adOnbellek = nesneOku('yerAdlari')[hucre(yeni.enlem, yeni.boylam)];
        if (!once.oto || mesafeKm(once, yeni) > 0.3) {
          konumYaz({ ad: adOnbellek || 'Bulunduğun yer', enlem: yeni.enlem, boylam: yeni.boylam, yukseklik: c.altitude ? Math.round(c.altitude) : 0, saatDilimi: Intl.DateTimeFormat().resolvedOptions().timeZone, oto: true });
        }
        konumBildir();
        if (!adOnbellek) {
          const ad = await yerAdi(yeni.enlem, yeni.boylam);
          const simdi = konum();
          if (ad && simdi.oto && mesafeKm(simdi, yeni) < 0.5) { konumYaz(Object.assign({}, simdi, { ad })); konumBildir(); }
        }
        bitir(); coz(konum());
      }, err => {
        clearTimeout(bekci);
        konumDurum.hata = err.code === 1 ? 'izin' : 'alinamadi';
        T('GPS konumu', 'hata', (err.code === 1 ? 'izin yok' : err.code === 2 ? 'konum yok' : 'zaman aşımı') + ' · ' + err.message);
        konumDurum.kaynak = konum().oto ? 'son' : null;
        bitir(); konumBildir(); coz(null);
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60e3 });
    });
    return konumAraniyor;
  }

  /* Kaydırıcıların dolu kısmı (Chrome'da yerleşik değil): --dolu yüzdesi */
  function kaydiriciDoldur(r) {
    const min = Number(r.min || 0), max = Number(r.max || 100);
    r.style.setProperty('--dolu', ((Number(r.value) - min) / (max - min) * 100).toFixed(2) + '%');
  }
  function kaydiricilariDoldur() { document.querySelectorAll('input[type="range"]').forEach(kaydiriciDoldur); }

  function basla() {
    document.addEventListener('input', e => { if (e.target.matches && e.target.matches('input[type="range"]')) kaydiriciDoldur(e.target); });
    new MutationObserver(() => kaydiricilariDoldur()).observe(document.body, { childList: true, subtree: true });
    setInterval(kaydiricilariDoldur, 1000); // değer koddan değiştiğinde (ör. saat ilerleyince)
    kirmiziUygula(!!oku('kirmizi', false));
    document.getElementById('kirmiziDugme').addEventListener('click', () => {
      const yeni = !document.documentElement.classList.contains('kirmizi');
      yaz('kirmizi', yeni);
      kirmiziUygula(yeni);
    });
    window.addEventListener('hashchange', goster);
    goster();
    konumuBul();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) konumuBul(); });
    setInterval(() => { if (!document.hidden) konumuBul(); }, 10 * 60e3);
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      /* Yeni sürüm etkinleşince açık sayfadaki eski kodla yeni dosyalar karışmasın: yenileme şeridi */
      const vardi = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!vardi || document.getElementById('surumSerit')) return;
        const d = document.createElement('div');
        d.id = 'surumSerit'; d.className = 'surum-serit'; d.setAttribute('role', 'status');
        d.innerHTML = 'Urania güncellendi. <button type="button" class="dugme dolu">Yenile</button>';
        d.querySelector('button').addEventListener('click', () => location.reload());
        document.body.appendChild(d);
      });
      navigator.serviceWorker.register('./sw.js').catch(() => { /* çevrimdışı önbellek olmadan da çalışır */ });
    }
  }

  if (window.Tani) moduller.tani = window.Tani._modul;
  const T = (ad, d, a) => { if (window.Tani) window.Tani.servis(ad, d, a); };

  window.Urania = {
    modul(ad, tanim) { moduller[ad] = tanim; },
    basla, oku, nesneOku, diziOku, yaz, sil, anahtarlar, konum, konumYaz, VARSAYILAN_KONUM, konumuBul, konumDurum, otoAcik, otoAyarla, dilimTahmin, dilimAdi, veri, betikler, guvenliUrl, icsMetni, icsIndir, ek,
    sayi, bilimsel, saat, gun, gunHafta, tamTarih, kadir, derece, kacGun, kacis
  };
})();
