/* defter.js — Gözlem defteri: ne gördün, ne zaman, neyle, nasıl bir gökte.
   Kayıtlar yalnız bu cihazda (yerel depo) tutulur; "Yedeği indir" ile dosyaya alınır,
   "Yedekten yükle" ile geri yüklenir (aynı kimlikli kayıt iki kez eklenmez).
   Kaydederken Ay'ın evresi ve cismin o anki yüksekliği otomatik eklenir. */
(function () {
  'use strict';
  const G = window.Gok, U = window.Urania;
  const DEPO = 'defter';
  let el = null, veri = null, duzenlenen = null, gorevAcik = false, formDilim = null;

  /* ---------- Depo ---------- */
  /* Depodaki bozuk öğeler (null, eksik alanlı nesne) listeyi, Gökyüzü'nü ve görevleri düşürmesin:
     okurken ayıklanır. Nesne olan bozuk öğeler yazarken korunur (elle onarılabilsin, sessizce silinmesin). */
  function okunabilir(k) {
    return !!(k && typeof k === 'object' && typeof k.id === 'string' && typeof k.zaman === 'string' && !isNaN(new Date(k.zaman)) &&
      k.cisim && typeof k.cisim === 'object' && typeof k.cisim.anahtar === 'string' && k.cisim.ad != null &&
      k.konum && typeof k.konum === 'object' && sayiMi(k.konum.enlem) && sayiMi(k.konum.boylam));
  }
  function hamListe() { const k = U.oku(DEPO, []); return Array.isArray(k) ? k : []; }
  function kayitlar() { return hamListe().filter(okunabilir); }
  function kaydet(ls) {
    const bozuk = hamListe().filter(k => k && typeof k === 'object' && !Array.isArray(k) && !okunabilir(k));
    return U.yaz(DEPO, ls.concat(bozuk));
  }
  function yeniKimlik() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  const KIMLIK = /^[a-z0-9]{1,24}$/;
  const sayiMi = x => typeof x === 'number' && isFinite(x);
  const metinMi = (x, en) => typeof x === 'string' && x.length <= en;
  /* Bir cisim için son kayıt (Gökyüzü listelerindeki "görüldü" işareti için) */
  function sonGorulme(anahtar) {
    let son = null;
    kayitlar().forEach(k => { if (k.cisim && k.cisim.anahtar === anahtar && (!son || k.zaman > son.zaman)) son = k; });
    return son;
  }

  /* ---------- Cisim kataloğu ---------- */
  function katalog() {
    const ls = [];
    ls.push({ grup: 'Güneş Sistemi', anahtar: 'cisim:Moon', ad: 'Ay' });
    G.GEZEGENLER.forEach(c => ls.push({ grup: 'Güneş Sistemi', anahtar: 'cisim:' + c, ad: G.TR_AD[c] }));
    veri.hedefler.forEach(h => ls.push({ grup: 'Dürbün hedefleri', anahtar: 'hedef:' + h.id, ad: h.ad, ra: h.ra, dec: h.dec }));
    const gor = new Set();
    veri.meteor.yagmurlar.forEach(m => { if (!gor.has(m.kod)) { gor.add(m.kod); ls.push({ grup: 'Meteor yağmurları', anahtar: 'meteor:' + m.kod, ad: m.ad }); } });
    Object.keys(veri.yildizlar.adlar).forEach(i => {
      const y = veri.yildizlar.y[i];
      if (y[2] <= 2.5) ls.push({ grup: 'Parlak yıldızlar', anahtar: 'yildiz:' + veri.yildizlar.adlar[i], ad: veri.yildizlar.adlar[i], ra: y[0], dec: y[1] });
    });
    if (veri.gorevler) veri.gorevler.gorevler.filter(g => g.anahtar.startsWith('gorev:')).forEach(g => ls.push({ grup: 'Gözlem görevleri', anahtar: g.anahtar, ad: g.ad, ra: g.ra, dec: g.dec, cisimAd: g.cisim }));
    veri.takimyildizlar.slice().sort((a, b) => a.ad.localeCompare(b.ad, 'tr')).forEach(t => ls.push({ grup: 'Takımyıldızlar', anahtar: 'ty:' + t.k, ad: t.ad, ra: t.m[0], dec: t.m[1] }));
    return ls;
  }
  function katalogBul(anahtar) { return katalog().find(x => x.anahtar === anahtar) || null; }

  /* Kayıt anındaki gök durumu */
  function otomatik(cisim, zaman, k) {
    /* Gözlemci/Ay hesabı da try içinde: bozuk konum kaydı (sayı olmayan yükseklik gibi) "Kaydet"i sessizce
       düşürmesin; gök durumu olmadan da kayıt yapılır (denetim A4-01) */
    let gzl = null;
    const o = {};
    try {
      gzl = G.gozlemci(k.enlem, k.boylam, Number.isFinite(k.yukseklik) ? k.yukseklik : 0);
      const ay = G.ayDurumu(zaman, gzl);
      Object.assign(o, { ayOran: Math.round(ay.oran * 100), ayEvre: ay.ad, ayAlt: Math.round(ay.alt) });
    } catch (e) { gzl = null; }
    if (gzl) try {
      if (cisim && (cisim.anahtar.startsWith('cisim:') || cisim.cisimAd)) {
        const p = G.cisimAltAz(cisim.cisimAd || cisim.anahtar.slice(6), zaman, gzl); o.alt = Math.round(p.alt); o.az = Math.round(p.az);
      } else if (cisim && cisim.ra != null) {
        const p = G.sabitAltAz(cisim.ra, cisim.dec, zaman, gzl); o.alt = Math.round(p.alt); o.az = Math.round(p.az);
      }
    } catch (e) { /* konum hesaplanamadıysa kayıt yine yapılır */ }
    let hd = null;
    try { hd = window.Hava && Hava.saatDegeri(k.enlem, k.boylam, zaman); } catch (e) { /* bulut bilgisi olmadan da kaydedilir */ }
    if (hd) { o.bulut = hd.bulut; if (hd.yagisOl != null) o.yagisOl = hd.yagisOl; }
    return o;
  }

  /* ---------- v46: Model ve sen ----------
     Kayıt anında modelin tahmini (gorunurluk.js: gök parlaklığı, Ay, yükseklik, sönümleme, göz bebeği) girdileriyle saklanır;
     kullanıcı "gördüm / zor gördüm / göremedim" derse karşılaştırılır. ≥ 10 karşılaştırmalı kayıtta tek bir düzeltme katsayısı
     (kadir kayması) önerilir: uyumu en çok artıran kayma; yalnız onayla uygulanır, her zaman kaldırılır. Yöntem Urania'nın
     kendi seçimidir, kaynaklı değildir (arastirma/gorunurluk_kaynak.md §11). Veriler yalnız cihazda; yedeğe kayıtla birlikte girer.
     Sayılar (Urania'nın seçimi): en az 10 karşılaştırmalı kayıt; öneri aralığı −2…+2 kadir, 0,1 adım; depodan okunan ayar için tavan 3 kadir
     (bozuk değer korunması; öneri hiçbir zaman 2'yi aşmaz). */
  const GOZLEM_AD = { gordum: 'gördüm', zor: 'zor gördüm', goremedim: 'göremedim' };
  const GOZLEM_SINIF = { gordum: 'gorunur', zor: 'zor', goremedim: 'gorunmez' };
  function modelTahmini(id, zaman, k) {
    if (!window.Gorunurluk || !veri || !veri.hedefBoyut) return null;
    const h = veri.hedefler.find(x => x.id === id); if (!h) return null;
    try {
      const gzl = G.gozlemci(k.enlem, k.boylam, Number.isFinite(k.yukseklik) ? k.yukseklik : 0);
      const p = G.sabitAltAz(h.ra, h.dec, zaman, gzl);
      const goz = (v => (Number.isFinite(v) && v >= 2 && v <= 9 ? v : null))(Number(U.oku('gozBebegi', null))) || Gorunurluk.gozBebegi();
      const sqm = (v => (Number.isFinite(v) && v >= 15 && v <= 22.5 ? v : null))(Number(U.oku('sqmElle', null)));
      const b = Gorunurluk.gokBasucuSec({ sqmElle: sqm, enlem: k.enlem, boylam: k.boylam, limitKadir: Number(U.oku('limitKadir', 4)), p: goz });
      const aod = window.HavaKart && Number.isFinite(HavaKart.sonAod) ? HavaKart.sonAod : null;
      const kayma = kisiselKayma();
      const ortam = Gorunurluk.ortamHazirla({ G, A: G.A, gzl, zaman, alt: p.alt, az: p.az, Vzen: b.kadir, kaynak: b.kaynak, aod, yukseklik: Number.isFinite(k.yukseklik) ? k.yukseklik : 0, p: goz, kayma });
      const s = Gorunurluk.degerlendir(Gorunurluk.hedefVerisi(h, veri), ortam);
      const y2 = n => Math.round(n * 100) / 100;
      return { surum: 'v46', etiket: s.etiket, yol: s.yol || null, neden: s.neden || null, fark: Number.isFinite(s.fark) ? y2(s.fark) : null,
        farkHam: Number.isFinite(s.fark) ? y2(s.fark - (s.kayma || 0)) : null, kayma, gok: y2(b.kadir), gokKaynak: b.kaynak, gokHedef: s.gok ? y2(s.gok.V) : null,
        ayOran: ortam.ay ? Math.round(ortam.ay.oran * 100) : 0, ayAlt: ortam.ay ? Math.round(ortam.ay.alt) : null, ayAcisi: ortam.ay ? Math.round(ortam.ay.rho) : null,
        alt: Math.round(p.alt), k: y2(ortam.k), aod: Number.isFinite(aod) ? y2(aod) : null, gozBebegi: y2(ortam.p), F: ortam.F };
    } catch (e) { return null; }
  }
  function kisiselKayma() { const v = Number(U.oku('gorKayma', 0)); return Number.isFinite(v) && Math.abs(v) <= 3 ? v : 0; }   // tavan 3: Urania'nın seçimi (bkz. blok yorumu)
  /* Karşılaştırılabilir kayıtlar: gözlem girilmiş VE model görünür/zor/görünmez demiş (belirsiz ve ufuk sayılmaz) */
  function karsilastir(ls) {
    const k = ls.filter(x => GOZLEM_SINIF[x.gozlem] && x.model && ['gorunur', 'zor', 'gorunmez'].includes(x.model.etiket));
    const uyumsuz = k.filter(x => GOZLEM_SINIF[x.gozlem] !== x.model.etiket);
    return { karsilastirilan: k.length, uyum: k.length - uyumsuz.length, uyumsuz, kayitlar: k };
  }
  /* Kişisel ayar: −2…+2 kadir arası 0,1 adımla, uyumu en çok artıran kayma (eşitlikte küçük olan). farkHam = ayarsız fark. */
  function kisiselAyar(ls) {
    const c = karsilastir(ls);
    if (c.karsilastirilan < 10 || !window.Gorunurluk) return { yeterli: false, n: c.karsilastirilan };
    const BANT = Gorunurluk.BANT;
    const etiket = (fark, yol) => (fark >= (yol === 'uye' ? 0 : BANT) ? 'gorunur' : (fark > -BANT ? 'zor' : 'gorunmez'));
    const puan = d => c.kayitlar.filter(x => Number.isFinite(x.model.farkHam) && etiket(x.model.farkHam + d, x.model.yol) === GOZLEM_SINIF[x.gozlem]).length;
    let en = { delta: 0, puan: puan(0) };
    for (let i = -20; i <= 20; i++) { const d = i / 10, p = puan(d); if (p > en.puan || (p === en.puan && Math.abs(d) < Math.abs(en.delta))) en = { delta: d, puan: p }; }
    return { yeterli: true, n: c.karsilastirilan, delta: Math.round(en.delta * 10) / 10, uyumOnce: puan(0), uyumSonra: en.puan, oneri: en.puan > puan(0) && Math.abs(en.delta) >= 0.1 };
  }
  function modelKarti(ls) {
    const kap = el.querySelector('#dfModel'); if (!kap) return;
    const c = karsilastir(ls);
    const hedefli = ls.filter(x => x.cisim.anahtar.startsWith('hedef:')).length;
    if (!hedefli) { kap.innerHTML = ''; return; }
    const kayma = kisiselKayma();
    const ET = window.Gorunurluk ? Gorunurluk.ETIKET_AD : {};
    const satir = x => `<li>${U.kacis(x.cisim.ad)} · ${U.kacis(bicim(kayitDilimi(x), 'gun').format(new Date(x.zaman)))}: model <b>${U.kacis(ET[x.model.etiket] || x.model.etiket)}</b>, sen <b>${U.kacis(GOZLEM_AD[x.gozlem])}</b></li>`;
    let ayar = '';
    if (kayma) ayar = `<p class="kucuk">Uygulanan kişisel ayar: <b>${kayma > 0 ? '+' : ''}${U.sayi(kayma, 1)} kadir</b> (etiket eşiği bu kadar kaydırılıyor). <button type="button" class="bag" data-is="ayar-kaldir">Ayarı kaldır</button></p>`;
    const a = kisiselAyar(ls);
    if (!a.yeterli) ayar += `<p class="kucuk soluk">Kişisel ayar önerisi için en az 10 karşılaştırmalı kayıt gerekir (şimdi ${a.n}).</p>`;
    else if (a.oneri && a.delta !== kayma) ayar += `<p class="kucuk">Öneri: etiket eşiğini <b>${a.delta > 0 ? '+' : ''}${U.sayi(a.delta, 1)} kadir</b> kaydır; uyum ${a.uyumOnce}/${a.n} → ${a.uyumSonra}/${a.n}. Yöntem Urania'nın kendi seçimidir (kaynaklı değil); yalnız onaylarsan uygulanır, istediğin zaman kaldırılır. <button type="button" class="dugme" data-is="ayar-uygula" data-delta="${a.delta}">Ayarı uygula</button></p>`;
    else ayar += `<p class="kucuk soluk">${kayma ? 'Mevcut ayar bu kayıtlar için en iyisi.' : 'Öneri yok: ayarsız model bu kayıtlar için zaten en iyi uyumda.'}</p>`;
    kap.innerHTML = `<section class="model-kart" aria-labelledby="dfModelBas"><h2 id="dfModelBas" style="margin-top:0">Model ve sen</h2>
      <p class="kucuk">${c.karsilastirilan ? `${c.karsilastirilan} kayıtta modelin tahmini gözleminle karşılaştırıldı: <b>${c.uyum} uyuştu</b>, <b>${c.uyumsuz.length} uyuşmadı</b>.` : `Henüz karşılaştırma yok: bir dürbün hedefi kaydederken "Görebildin mi?" alanını doldur.`}</p>
      ${c.uyumsuz.length ? `<p class="kucuk soluk" style="margin-bottom:4px">Uyuşmayanlar:</p><ul class="kucuk model-uyumsuz">${c.uyumsuz.slice(0, 20).map(satir).join('')}</ul>` : ''}
      ${ayar}</section>`;
  }
  function modelTikla(e) {
    const b = e.target.closest('button[data-is]'); if (!b) return;
    if (b.dataset.is === 'ayar-uygula') { const d = Number(b.dataset.delta); if (Number.isFinite(d) && Math.abs(d) <= 3) U.yaz('gorKayma', d); }   // tavan 3: Urania'nın seçimi
    else if (b.dataset.is === 'ayar-kaldir') U.sil('gorKayma');
    else return;
    listeYaz();
    el.querySelector('#dfModelBas').focus();
  }

  /* ---------- Biçim yardımcıları ---------- */
  /* Saat dilimi: formdaki saat ve listedeki saat aynı dilimde olmalı. Her kayıt kendi konumunun
     diliminde gösterilir (kayıtta yoksa şu anki konumun dilimi); cihazın dilimi kullanılmaz. */
  function gecerliDilim(z) { try { new Intl.DateTimeFormat('tr-TR', { timeZone: z }); return true; } catch (e) { return false; } }
  function kayitDilimi(k) {
    const z = k && k.konum && k.konum.saatDilimi;
    return typeof z === 'string' && gecerliDilim(z) ? z : U.konum().saatDilimi;
  }
  const bicimler = {};
  function bicim(z, tur) {
    const a = z + '|' + tur;
    if (!bicimler[a]) bicimler[a] = new Intl.DateTimeFormat(tur === 'parca' ? 'en-US' : 'tr-TR', Object.assign({ timeZone: z },
      tur === 'saat' ? { hour: '2-digit', minute: '2-digit' } : tur === 'gun' ? { day: 'numeric', month: 'long', weekday: 'long' }
        : { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }));
    return bicimler[a];
  }
  const dkYuvarla = d => new Date(Math.round(d.getTime() / 60e3) * 60e3);
  /* z diliminde duvar saati parçaları */
  function parcalar(d, z) {
    const o = {};
    bicim(z, 'parca').formatToParts(d).forEach(p => { if (p.type !== 'literal') o[p.type] = Number(p.value); });
    if (o.hour === 24) o.hour = 0;
    return o;
  }
  /* Date.UTC 0–99 yıllarını 1900–1999 sayar ("0050" → 1950); yıl ayrıca kurulur (denetim A4-07) */
  function utc(y, ay, g, sa, dk, sn) {
    const d = new Date(0);
    d.setUTCFullYear(y, ay, g); d.setUTCHours(sa, dk, sn || 0, 0);
    return d.getTime();
  }
  /* z diliminin d anındaki UTC farkı (ms) */
  function ofset(d, z) {
    const p = parcalar(d, z);
    return utc(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(d.getTime() / 1000) * 1000;
  }
  function yerelGirdi(d, z) {
    /* Dakikaya yerel saatte yuvarlanır: yerel ortalama zamanlı eski yıllarda (İstanbul 1910 öncesi +01:55:52) ofset
       saniyeli; UTC'de yuvarlamak 22:00'yi 21:59 gösteriyordu */
    const p = parcalar(new Date(Math.floor(d.getTime() / 1000) * 1000 + 30e3), z), s = n => String(n).padStart(2, '0');
    return String(p.year).padStart(4, '0') + '-' + s(p.month) + '-' + s(p.day) + 'T' + s(p.hour) + ':' + s(p.minute);
  }
  /* "2026-10-27T22:00" → z dilimindeki o duvar saatinin anı */
  let formAn = null;
  function girdiOku(str, z) {
    const m = /^(\d{4,})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(str || '');
    if (!m) return new Date(NaN);
    const duvar = utc(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
    let t = duvar - ofset(new Date(duvar), z);
    t = duvar - ofset(new Date(t), z);       // yaz saati geçişinde ikinci tahmin
    return new Date(t);
  }
  const ALETLER = ['Çıplak göz', '7×50 dürbün', 'Teleskop', 'Diğer'];
  const KOSULLAR = ['Berrak', 'Hafif puslu', 'Puslu', 'Parçalı bulutlu', 'Çok bulutlu'];
  /* Seçim kutusuna değer: listede olmayan değer (eski sürüm, yedekten gelen) için geçici seçenek
     eklenir; yoksa kutu boşalır ve düzenleyip kaydedince değer kaybolur. */
  function secDeger(sec, deger) {
    sec.querySelectorAll('option[data-gecici]').forEach(o => o.remove());
    const d = typeof deger === 'string' ? deger : '';
    if (d && ![...sec.options].some(o => o.value === d)) {
      const o = document.createElement('option'); o.value = d; o.textContent = d; o.dataset.gecici = '1'; sec.appendChild(o);
    }
    sec.value = d || sec.options[0].value;
  }
  /* Uyarı kutuları birikmesin: aynı yerdeki eskisi silinir */
  function uyariSil(kap) { (kap || el).querySelectorAll('.df-uyari').forEach(u => u.remove()); }
  function uyari(oge, yer, metin) {
    uyariSil();
    oge.insertAdjacentHTML(yer, '<span class="hata-kutu df-uyari" role="alert" style="display:block">' + U.kacis(metin) + '</span>');
  }

  /* ---------- Görünüm ---------- */
  function iskelet() {
    const kat = katalog();
    const gruplar = {};
    kat.forEach(x => { (gruplar[x.grup] = gruplar[x.grup] || []).push(x); });
    el.innerHTML = `
      <h1>Gözlem defteri</h1>
      <p class="alt-baslik" id="dfOzet" tabindex="-1"></p>
      <a class="sinav-giris" id="dfGorev" href="#defter/gorevler" hidden><b>Gözlem görevleri</b><span id="dfGorevSayi"></span></a>
      <button type="button" class="dugme dolu" id="dfYeni">Yeni kayıt</button>
      <form class="defter-form" id="dfForm" hidden>
        <h2 id="dfFormBaslik" style="margin-top:20px">Yeni kayıt</h2>
        <div class="alan"><label for="dfCisim">Ne gördün?</label>
          <select id="dfCisim">${Object.keys(gruplar).map(g => `<optgroup label="${U.kacis(g)}">${gruplar[g].map(x => `<option value="${U.kacis(x.anahtar)}">${U.kacis(x.ad)}</option>`).join('')}</optgroup>`).join('')}<optgroup label="Başka"><option value="diger">Listede yok (kendim yazacağım)</option></optgroup></select></div>
        <div class="alan" id="dfDigerAlan" hidden><label for="dfDiger">Cismin adı</label><input id="dfDiger" maxlength="80" autocomplete="off"><p class="alan-hata" id="dfDigerHata" hidden>Listede olmayan cismin adını yaz.</p></div>
        <div class="alan"><label for="dfZaman">Ne zaman?</label><input id="dfZaman" type="datetime-local"></div>
        <div class="defter-iki">
          <div class="alan"><label for="dfAlet">Neyle?</label><select id="dfAlet">${ALETLER.map(a => `<option>${a}</option>`).join('')}</select></div>
          <div class="alan"><label for="dfKosul">Gökyüzü</label><select id="dfKosul">${KOSULLAR.map(a => `<option>${a}</option>`).join('')}</select></div>
        </div>
        <div class="alan" id="dfGordunAlan" hidden><label for="dfGordun">Görebildin mi? <span class="soluk kucuk">(isteğe bağlı; modelin tahminiyle karşılaştırılır)</span></label>
          <select id="dfGordun"><option value="">— boş —</option><option value="gordum">Gördüm</option><option value="zor">Zor gördüm</option><option value="goremedim">Göremedim</option></select></div>
        <div class="alan"><label for="dfNot">Not</label><textarea id="dfNot" rows="4" maxlength="2000" placeholder="Ne gördün, nasıl görünüyordu, neyi fark ettin?"></textarea></div>
        <p class="soluk kucuk">Konum: <span id="dfKonum"></span>. Ay'ın evresi ve cismin yüksekliği kaydederken otomatik eklenir.</p>
        <div class="cip-grup"><button type="submit" class="dugme dolu" id="dfKaydet">Kaydet</button><button type="button" class="dugme" id="dfVazgec">Vazgeç</button></div>
      </form>
      <div id="dfModel"></div>
      <div id="dfListe"></div>
      <details class="aciklama" style="margin-top:28px">
        <summary>Yedekle ve geri yükle</summary>
        <p class="soluk kucuk" style="margin-top:8px">Kayıtlar yalnız bu telefonda. Tarayıcı verisi silinirse kaybolurlar; ara sıra yedeğini indir.</p>
        <div class="cip-grup"><button type="button" class="dugme" id="dfIndir">Yedeği indir</button><button type="button" class="dugme" id="dfYukleDugme">Yedekten yükle</button><input type="file" id="dfYukle" class="gorsel-gizli" accept="application/json,.json" tabindex="-1" aria-hidden="true"></div>
        <p class="kucuk" id="dfYedekDurum" role="status"></p>
      </details>`;
    el.querySelector('#dfYeni').addEventListener('click', () => formAc(null));
    el.querySelector('#dfVazgec').addEventListener('click', vazgec);
    el.querySelector('#dfCisim').addEventListener('change', () => {
      const v = el.querySelector('#dfCisim').value;
      el.querySelector('#dfDigerAlan').hidden = v !== 'diger';
      el.querySelector('#dfGordunAlan').hidden = !v.startsWith('hedef:');   // v46: yalnız dürbün hedeflerinde
    });
    el.querySelector('#dfModel').addEventListener('click', modelTikla);
    el.querySelector('#dfForm').addEventListener('submit', e => { e.preventDefault(); formKaydet(); });
    el.querySelector('#dfListe').addEventListener('click', listeTikla);
    el.querySelector('#dfIndir').addEventListener('click', yedekIndir);
    el.querySelector('#dfYukle').addEventListener('change', yedekYukle);
    el.querySelector('#dfYukleDugme').addEventListener('click', () => el.querySelector('#dfYukle').click());
    el.querySelector('#dfDiger').addEventListener('input', e => { if (e.target.value.trim()) adHatasi(false); });
  }

  function formAc(kayit, onAnahtar) {
    duzenlenen = kayit ? kayit.id : null;
    const f = el.querySelector('#dfForm');
    el.querySelector('#dfFormBaslik').textContent = kayit ? 'Kaydı düzenle' : 'Yeni kayıt';
    const sec = el.querySelector('#dfCisim');
    const anahtar = kayit ? kayit.cisim.anahtar : (onAnahtar || 'cisim:Moon');
    if (anahtar.startsWith('diger:') || ![...sec.options].some(o => o.value === anahtar)) {
      sec.value = 'diger'; el.querySelector('#dfDiger').value = kayit ? kayit.cisim.ad : '';
    } else { sec.value = anahtar; el.querySelector('#dfDiger').value = ''; }
    el.querySelector('#dfDigerAlan').hidden = sec.value !== 'diger';
    adHatasi(false);
    formDilim = kayit ? kayitDilimi(kayit) : U.konum().saatDilimi;
    /* Formun açıldığı an saklanır: kullanıcı saati değiştirmezse bu an aynen kaydedilir (yaz saatinden
       dönüş gecesinde 01:30 gibi iki kez yaşanan saat başka bir ana kaymasın) */
    formAn = kayit ? new Date(kayit.zaman) : new Date();
    el.querySelector('#dfZaman').value = yerelGirdi(formAn, formDilim);
    secDeger(el.querySelector('#dfAlet'), kayit ? kayit.alet : U.oku('defterSonAlet', '7×50 dürbün'));
    secDeger(el.querySelector('#dfKosul'), kayit ? kayit.kosul : 'Berrak');
    el.querySelector('#dfGordun').value = kayit && GOZLEM_AD[kayit.gozlem] ? kayit.gozlem : '';
    el.querySelector('#dfGordunAlan').hidden = !sec.value.startsWith('hedef:');
    el.querySelector('#dfNot').value = kayit ? (kayit.not || '') : '';
    const k = kayit ? kayit.konum : U.konum();
    /* Cihazın saati başka dilimdeyse formdaki saatin hangi dilimde olduğu yazılır */
    el.querySelector('#dfKonum').textContent = (k.ad || '') + (formDilim !== Intl.DateTimeFormat().resolvedOptions().timeZone ? ' (saat: ' + U.dilimAdi(formDilim) + ')' : '');
    uyariSil(f);
    f.hidden = false;
    el.querySelector('#dfYeni').hidden = true;
    sec.focus();
  }
  /* "Listede yok" seçili ve ad boşken: görünür hata metni, girdiye aria-invalid ve aria-describedby */
  function adHatasi(goster) {
    const g = el.querySelector('#dfDiger'), h = el.querySelector('#dfDigerHata');
    h.hidden = !goster;
    if (goster) { g.setAttribute('aria-invalid', 'true'); g.setAttribute('aria-describedby', 'dfDigerHata'); }
    else { g.removeAttribute('aria-invalid'); g.removeAttribute('aria-describedby'); }
  }
  function formKapat() {
    el.querySelector('#dfForm').hidden = true;
    el.querySelector('#dfYeni').hidden = false;
    uyariSil(el.querySelector('#dfForm'));
    duzenlenen = null;
    if (location.hash.startsWith('#defter/')) history.replaceState(null, '', '#defter');
  }
  /* Vazgeç: odak, formu açan öğeye (düzenlenen kaydın "Düzenle"si ya da "Yeni kayıt") döner */
  function vazgec() {
    const id = duzenlenen;
    formKapat();
    const d = id && [...el.querySelectorAll('#dfListe button[data-is="duzenle"]')].find(b => b.dataset.id === id);
    (d || el.querySelector('#dfYeni')).focus();
  }

  function formKaydet() {
    const secim = el.querySelector('#dfCisim').value;
    let cisim;
    if (secim === 'diger') {
      const ad = el.querySelector('#dfDiger').value.trim();
      if (!ad) { adHatasi(true); el.querySelector('#dfDiger').focus(); return; }
      cisim = { anahtar: 'diger:' + ad.toLocaleLowerCase('tr-TR'), ad };
    } else {
      const c = katalogBul(secim);
      cisim = { anahtar: c.anahtar, ad: c.ad, ra: c.ra, dec: c.dec, cisimAd: c.cisimAd };
    }
    adHatasi(false);
    const zStr = el.querySelector('#dfZaman').value;
    const dz = formDilim || U.konum().saatDilimi;
    const zaman = zStr ? (formAn && zStr === yerelGirdi(formAn, dz) ? new Date(formAn) : girdiOku(zStr, dz)) : new Date();
    if (isNaN(zaman)) { el.querySelector('#dfZaman').focus(); return; }
    const ls = kayitlar();
    const eski = duzenlenen ? ls.find(x => x.id === duzenlenen) : null;
    const konum = eski ? eski.konum : (({ ad, enlem, boylam, yukseklik, saatDilimi }) => ({ ad, enlem, boylam, yukseklik, saatDilimi }))(U.konum());
    const kayit = {
      id: eski ? eski.id : yeniKimlik(),
      zaman: zaman.toISOString(),
      cisim: { anahtar: cisim.anahtar, ad: cisim.ad },
      alet: el.querySelector('#dfAlet').value,
      kosul: el.querySelector('#dfKosul').value,
      not: el.querySelector('#dfNot').value.trim(),
      konum,
      otomatik: otomatik(cisim, zaman, konum)
    };
    /* v46: dürbün hedefi kayıtlarında gözlem sonucu (isteğe bağlı) ve kayıt anındaki model tahmini (girdileriyle).
       Düzenlemede saat ve hedef değişmediyse eski tahmin korunur (kayıt anındaki hâliyle kalsın). */
    if (cisim.anahtar.startsWith('hedef:')) {
      const g = el.querySelector('#dfGordun').value;
      if (GOZLEM_AD[g]) kayit.gozlem = g;
      const ayni = eski && eski.model && eski.zaman === kayit.zaman && eski.cisim.anahtar === kayit.cisim.anahtar;
      const m = ayni ? eski.model : modelTahmini(cisim.anahtar.slice(6), zaman, konum);
      if (m) kayit.model = m;
    }
    /* Düzenlemede eski kaydın tahmini bulut/yağış değerleri korunur: o saatin tahmini artık önbellekte olmayabilir */
    if (eski && eski.otomatik) {
      ['bulut', 'yagisOl'].forEach(a => { if (kayit.otomatik[a] == null && eski.otomatik[a] != null && eski.zaman === kayit.zaman) kayit.otomatik[a] = eski.otomatik[a]; });
    }
    U.yaz('defterSonAlet', kayit.alet);
    if (eski) ls[ls.indexOf(eski)] = kayit; else ls.push(kayit);
    if (!kaydet(ls)) {
      uyari(el.querySelector('#dfKaydet'), 'afterend', 'Kaydedilemedi: telefonun bu site için ayrılan depolama alanı dolu ya da kapalı. Önce "Yedeği indir" ile yedek al.');
      return;
    }
    formKapat();
    uyariSil();
    listeYaz();
    /* Odak kaydedilen kayda: klavye ve ekran okuyucu yerini kaybetmesin */
    const li = el.querySelector(`#dfListe li[data-id="${CSS.escape(kayit.id)}"]`);
    if (li) li.focus();
  }

  function listeTikla(e) {
    const b = e.target.closest('button[data-is]'); if (!b) return;
    const ls = kayitlar();
    const k = ls.find(x => x.id === b.dataset.id); if (!k) return;
    if (b.dataset.is === 'duzenle') { formAc(k); window.scrollTo({ top: 0 }); }
    if (b.dataset.is === 'sil') {
      if (b.dataset.onay !== '1') {
        b.dataset.onay = '1'; b.textContent = 'Silmek için tekrar bas'; b.setAttribute('aria-label', k.cisim.ad + ' kaydını silmek için tekrar bas');
        setTimeout(() => { if (b.isConnected) { b.dataset.onay = ''; b.textContent = 'Sil'; b.setAttribute('aria-label', k.cisim.ad + ' kaydını sil'); } }, 4000);
        return;
      }
      if (!kaydet(ls.filter(x => x.id !== k.id))) {
        uyari(el.querySelector('#dfListe'), 'beforebegin', 'Silinemedi: telefonun bu site için ayrılan depolama alanı dolu ya da kapalı.');
        return;
      }
      uyariSil();
      listeYaz();
      el.querySelector('#dfOzet').focus();
    }
  }

  function listeYaz() {
    const gz = window.Gorevler && Gorevler.ozet(veri);
    if (gz) { el.querySelector('#dfGorev').hidden = false; el.querySelector('#dfGorevSayi').textContent = `${gz.toplam} görevden ${gz.biten} tanesi tamam`; }
    const ls = kayitlar().slice().sort((a, b) => b.zaman.localeCompare(a.zaman));
    const farkli = new Set(ls.map(k => k.cisim.anahtar));
    const hedefSayisi = veri.hedefler.filter(h => farkli.has('hedef:' + h.id)).length;
    const gezegen = G.GEZEGENLER.filter(c => farkli.has('cisim:' + c)).length;
    el.querySelector('#dfOzet').textContent = ls.length
      ? `${ls.length} kayıt, ${farkli.size} farklı cisim. Dürbün hedeflerinden ${hedefSayisi}/${veri.hedefler.length}, gezegenlerden ${gezegen}/${G.GEZEGENLER.length} görüldü.`
      : 'Henüz kayıt yok. Bir cisim gördüğünde "Yeni kayıt"a bas; Gökyüzü sekmesindeki listelerden "Gördüm" ile de ekleyebilirsin.';
    /* Gecelere göre grupla (gözlemcinin öğlesinden ertesi öğleye) */
    /* Başlık ve saat kaydın kendi konumunun diliminde (kayıtta yoksa şu anki konumun); şu ankinden farklıysa dilim yazılır */
    const gruplar = [], simdiDilim = U.konum().saatDilimi;
    ls.forEach(k => {
      const ogle = G.yerelOgle(new Date(k.zaman), k.konum.boylam);
      const z = kayitDilimi(k);
      const anahtar = ogle.toISOString() + '|' + z;
      let g = gruplar.find(x => x.anahtar === anahtar);
      if (!g) { g = { anahtar, ogle, z, ls: [] }; gruplar.push(g); }
      g.ls.push(k);
    });
    modelKarti(ls);
    el.querySelector('#dfListe').innerHTML = gruplar.map(g => `
      <h2>${U.kacis(bicim(g.z, 'gun').format(dkYuvarla(g.ogle)))} gecesi${g.z !== simdiDilim ? ` <span class="kucuk soluk">(${U.kacis(U.dilimAdi(g.z))})</span>` : ''}</h2>
      <ul class="liste">${g.ls.map(k => {
        const o = k.otomatik || {};
        const parca = [bicim(g.z, 'saat').format(dkYuvarla(new Date(k.zaman))).replace(':', '.'), k.alet, k.kosul].filter(x => typeof x === 'string' && x);
        if (o.alt != null) parca.push(o.alt + '° yükseklik');
        if (o.ayOran != null) parca.push('Ay %' + o.ayOran + (o.ayAlt != null && o.ayAlt < 0 ? ' (batmıştı)' : ''));
        if (o.bulut != null) parca.push('tahmini bulut %' + o.bulut);
        if (o.yagisOl != null && o.yagisOl > 0) parca.push('yağış olasılığı %' + o.yagisOl);
        if (k.model && k.model.etiket) parca.push('model: ' + ((window.Gorunurluk && Gorunurluk.ETIKET_AD[k.model.etiket]) || k.model.etiket) + (k.model.gok != null ? ' (gök ' + U.sayi(k.model.gok, 1) + ')' : ''));
        if (GOZLEM_AD[k.gozlem]) parca.push('sen: ' + GOZLEM_AD[k.gozlem]);
        return `<li data-id="${U.kacis(k.id)}" tabindex="-1"><span class="ad">${U.kacis(k.cisim.ad)}</span><span class="sag kucuk soluk">${U.kacis(k.konum.ad || '')}</span>
          <span class="alt">${parca.map(U.kacis).join(' · ')}${k.not ? `<span class="defter-not">${U.kacis(k.not)}</span>` : ''}
          <span class="cip-grup" style="margin-top:6px"><button type="button" class="bag" data-is="duzenle" data-id="${U.kacis(k.id)}" aria-label="${U.kacis(k.cisim.ad)} kaydını düzenle">Düzenle</button><button type="button" class="bag" data-is="sil" data-id="${U.kacis(k.id)}" aria-label="${U.kacis(k.cisim.ad)} kaydını sil">Sil</button></span></span></li>`;
      }).join('')}</ul>`).join('');
  }

  /* ---------- Yedek ---------- */
  function yedekIndir() {
    const ls = kayitlar();
    const blob = new Blob([JSON.stringify({ uygulama: 'Urania', tur: 'gozlem-defteri', surum: 1, olusturma: new Date().toISOString(), kayitlar: ls }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const bg = new Date(), iki = n => String(n).padStart(2, '0');
    a.download = 'urania-defter-' + bg.getFullYear() + '-' + iki(bg.getMonth() + 1) + '-' + iki(bg.getDate()) + '.json';   // yerel tarih
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    yedekDurum(ls.length + ' kayıt indirildi.');
  }
  /* Yedekten gelen kayıt sıkı denetlenir; metinler zaten her yerde kaçışlanır.
     Zaman ISO 8601 olmalı: tarayıcının gevşek ayrıştırması "1" gibi değeri 2001 yılı sayıyordu (denetim A4-08). */
  const ZAMAN_ISO = /^\d{4,}-\d{2}-\d{2}T\d{2}:\d{2}/;
  function gecerliKayit(k) {
    return !!(k && typeof k === 'object' && KIMLIK.test(k.id) && metinMi(k.zaman, 40) && ZAMAN_ISO.test(k.zaman) && !isNaN(new Date(k.zaman)) &&
      k.cisim && metinMi(k.cisim.anahtar, 120) && metinMi(k.cisim.ad, 120) &&
      metinMi(k.alet, 40) && metinMi(k.kosul, 40) && (k.not == null || metinMi(k.not, 2000)) &&
      k.konum && typeof k.konum.ad === 'string' && sayiMi(k.konum.enlem) && sayiMi(k.konum.boylam) &&
      Math.abs(k.konum.enlem) <= 90 && Math.abs(k.konum.boylam) <= 180 &&
      (k.otomatik == null || typeof k.otomatik === 'object') &&
      (k.gozlem == null || !!GOZLEM_AD[k.gozlem]) && (k.model == null || typeof k.model === 'object'));   // v46 alanları isteğe bağlı: eski yedekler olduğu gibi yüklenir
  }
  /* İçe alınan kaydın yalnız bilinen alanları saklanır */
  function temizle(k) {
    const o = k.otomatik || {}, oo = {};
    ['ayOran', 'ayAlt', 'alt', 'az', 'bulut', 'yagisOl'].forEach(a => { if (sayiMi(o[a])) oo[a] = o[a]; });
    if (metinMi(o.ayEvre, 40)) oo.ayEvre = o.ayEvre;
    /* Uzun konum adı reddedilmez, kırpılır (uygulamanın kendi yedeği her zaman geri yüklenebilsin) */
    const konum = { ad: k.konum.ad.slice(0, 120), enlem: k.konum.enlem, boylam: k.konum.boylam, yukseklik: sayiMi(k.konum.yukseklik) ? k.konum.yukseklik : 0 };
    if (metinMi(k.konum.saatDilimi, 64) && gecerliDilim(k.konum.saatDilimi)) konum.saatDilimi = k.konum.saatDilimi;
    /* Zaman UTC ISO biçimine çevrilir ("+03:00" ofsetli dize sıralamayı ve "son görülme"yi bozmasın) */
    const t = { id: k.id, zaman: new Date(k.zaman).toISOString(), cisim: { anahtar: k.cisim.anahtar, ad: k.cisim.ad }, alet: k.alet, kosul: k.kosul, not: k.not || '',
      konum, otomatik: oo };
    /* v46: gözlem sonucu ve model tahmini (yalnız bilinen alanlar) */
    if (GOZLEM_AD[k.gozlem]) t.gozlem = k.gozlem;
    if (k.model && typeof k.model === 'object') {
      const m = {};
      ['fark', 'farkHam', 'kayma', 'gok', 'gokHedef', 'ayOran', 'ayAlt', 'ayAcisi', 'alt', 'k', 'aod', 'gozBebegi', 'F'].forEach(a => { if (sayiMi(k.model[a])) m[a] = k.model[a]; });
      ['etiket', 'yol', 'neden', 'gokKaynak', 'surum'].forEach(a => { if (metinMi(k.model[a], 80)) m[a] = k.model[a]; });
      if (m.etiket) t.model = m;
    }
    return t;
  }
  /* Yedek durum satırı: hata iletisi uyarı renginde (başarı iletisinden ayırt edilsin) */
  function yedekDurum(metin, hatali) {
    const d = el.querySelector('#dfYedekDurum');
    d.textContent = metin; d.classList.toggle('hata', !!hatali);
  }
  function yedekYukle(e) {
    const dosya = e.target.files && e.target.files[0];
    /* Seçim hemen temizlenir (File nesnesi elde kalır): hata da olsa aynı dosya yeniden seçilebilsin */
    e.target.value = '';
    if (!dosya) return;
    const r = new FileReader();
    r.onerror = () => { yedekDurum('Bu dosya okunamadı.', true); };
    r.onload = () => {
      let j;
      try { j = JSON.parse(r.result); } catch (h) { yedekDurum('Bu dosya okunamadı: geçerli bir JSON değil.', true); return; }
      const gelen = Array.isArray(j) ? j : (j && j.kayitlar);
      if (!Array.isArray(gelen)) { yedekDurum('Bu dosya bir Urania defter yedeği değil.', true); return; }
      const ls = kayitlar();
      const var_ = new Set(ls.map(k => k.id));
      let eklenen = 0, atlanan = 0, gecersiz = 0;
      gelen.forEach(k => {
        if (!gecerliKayit(k)) { gecersiz++; return; }
        if (var_.has(k.id)) { atlanan++; return; }
        ls.push(temizle(k)); var_.add(k.id); eklenen++;
      });
      if (eklenen && !kaydet(ls)) { yedekDurum('Yüklenemedi: depolama alanı dolu ya da kapalı. Hiçbir kayıt eklenmedi.', true); return; }
      listeYaz();
      yedekDurum(`${eklenen} kayıt eklendi` + (atlanan ? `, ${atlanan} kayıt zaten vardı` : '') + (gecersiz ? `, ${gecersiz} kayıt bozuk olduğu için atlandı` : '') + '.', !eklenen && gecersiz > 0);
    };
    r.readAsText(dosya);
  }

  /* ---------- Bölüm ---------- */
  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Defter açılıyor…</p>';
    const [yildizlar, takimyildizlar, hedefler, meteor, gorevler, boyut, uye, profilM31] = await Promise.all([U.veri('yildizlar'), U.veri('takimyildiz'), U.veri('hedefler'), U.veri('meteor'), U.veri('gorevler').catch(() => null),
      U.veri('hedef_boyut').catch(() => null), U.veri('kume_uyeleri').catch(() => null), U.veri('profil_m31').catch(() => null)]);
    veri = { yildizlar, takimyildizlar, hedefler: hedefler.hedefler, meteor, gorevler,
      hedefBoyut: boyut ? boyut.hedefler : null, kumeUyeleri: uye ? uye.kumeler : null, profil: profilM31 ? { M31: profilM31 } : null };   // v46: kayıt anındaki model tahmini için
    if (window.Gorunurluk) Gorunurluk.izgaraYukle().catch(() => { /* atlas yoksa kaydırıcıdan türetilir */ });
    iskelet();
    goster(kok, location.hash.split('/').slice(1).join('/'));
  }
  /* #defter ya da #defter/yeni/<anahtar> */
  function goster(kok, param) {
    if (!veri) return;
    if ((param || '').split('/')[0] === 'gorevler' && window.Gorevler) { gorevAcik = true; Promise.resolve(Gorevler.ciz(el, veri)).catch(e => { el.innerHTML = '<a class="geri" href="#defter">Defter</a><div class="hata-kutu" role="alert">Görevler hazırlanamadı: ' + U.kacis(e && e.message || e) + '</div>'; }); return; }
    if (gorevAcik || !el.querySelector('#dfListe')) { gorevAcik = false; iskelet(); }
    listeYaz();
    const p = (param || '').split('/');
    if (p[0] === 'yeni') {
      let anahtar = null;
      try { anahtar = p[1] ? decodeURIComponent(p[1]) : null; } catch (e) { anahtar = null; }   // bozuk % dizisi: boş form
      formAc(null, anahtar);
    }
  }

  U.modul('defter', { ilk, goster });
  window.Defter = { kayitlar, sonGorulme, karsilastir, kisiselAyar, modelTahmini };
})();
