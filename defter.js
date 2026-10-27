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
    const gzl = G.gozlemci(k.enlem, k.boylam, k.yukseklik || 0);
    const ay = G.ayDurumu(zaman, gzl);
    const o = { ayOran: Math.round(ay.oran * 100), ayEvre: ay.ad, ayAlt: Math.round(ay.alt) };
    try {
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
  /* z diliminin d anındaki UTC farkı (ms) */
  function ofset(d, z) {
    const p = parcalar(d, z);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(d.getTime() / 1000) * 1000;
  }
  function yerelGirdi(d, z) {
    const p = parcalar(dkYuvarla(d), z), s = n => String(n).padStart(2, '0');
    return String(p.year).padStart(4, '0') + '-' + s(p.month) + '-' + s(p.day) + 'T' + s(p.hour) + ':' + s(p.minute);
  }
  /* "2026-10-27T22:00" → z dilimindeki o duvar saatinin anı */
  let formAn = null;
  function girdiOku(str, z) {
    const m = /^(\d{4,})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(str || '');
    if (!m) return new Date(NaN);
    const duvar = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
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
        <div class="alan"><label for="dfNot">Not</label><textarea id="dfNot" rows="4" maxlength="2000" placeholder="Ne gördün, nasıl görünüyordu, neyi fark ettin?"></textarea></div>
        <p class="soluk kucuk">Konum: <span id="dfKonum"></span>. Ay'ın evresi ve cismin yüksekliği kaydederken otomatik eklenir.</p>
        <div class="cip-grup"><button type="submit" class="dugme dolu" id="dfKaydet">Kaydet</button><button type="button" class="dugme" id="dfVazgec">Vazgeç</button></div>
      </form>
      <div id="dfListe"></div>
      <details class="aciklama" style="margin-top:28px">
        <summary>Yedekle ve geri yükle</summary>
        <p class="soluk kucuk" style="margin-top:8px">Kayıtlar yalnız bu telefonda. Tarayıcı verisi silinirse kaybolurlar; ara sıra yedeğini indir.</p>
        <div class="cip-grup"><button type="button" class="dugme" id="dfIndir">Yedeği indir</button><button type="button" class="dugme" id="dfYukleDugme">Yedekten yükle</button><input type="file" id="dfYukle" class="gorsel-gizli" accept="application/json,.json" tabindex="-1" aria-hidden="true"></div>
        <p class="kucuk" id="dfYedekDurum" role="status"></p>
      </details>`;
    el.querySelector('#dfYeni').addEventListener('click', () => formAc(null));
    el.querySelector('#dfVazgec').addEventListener('click', vazgec);
    el.querySelector('#dfCisim').addEventListener('change', () => { el.querySelector('#dfDigerAlan').hidden = el.querySelector('#dfCisim').value !== 'diger'; });
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
    el.querySelector('#dfListe').innerHTML = gruplar.map(g => `
      <h2>${U.kacis(bicim(g.z, 'gun').format(dkYuvarla(g.ogle)))} gecesi${g.z !== simdiDilim ? ` <span class="kucuk soluk">(${U.kacis(U.dilimAdi(g.z))})</span>` : ''}</h2>
      <ul class="liste">${g.ls.map(k => {
        const o = k.otomatik || {};
        const parca = [bicim(g.z, 'saat').format(dkYuvarla(new Date(k.zaman))), k.alet, k.kosul].filter(x => typeof x === 'string' && x);
        if (o.alt != null) parca.push(o.alt + '° yükseklik');
        if (o.ayOran != null) parca.push('Ay %' + o.ayOran + (o.ayAlt != null && o.ayAlt < 0 ? ' (batmıştı)' : ''));
        if (o.bulut != null) parca.push('tahmini bulut %' + o.bulut);
        if (o.yagisOl != null && o.yagisOl > 0) parca.push('yağış olasılığı %' + o.yagisOl);
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
    el.querySelector('#dfYedekDurum').textContent = ls.length + ' kayıt indirildi.';
  }
  /* Yedekten gelen kayıt sıkı denetlenir; metinler zaten her yerde kaçışlanır */
  function gecerliKayit(k) {
    return !!(k && typeof k === 'object' && KIMLIK.test(k.id) && metinMi(k.zaman, 40) && !isNaN(new Date(k.zaman)) &&
      k.cisim && metinMi(k.cisim.anahtar, 120) && metinMi(k.cisim.ad, 120) &&
      metinMi(k.alet, 40) && metinMi(k.kosul, 40) && (k.not == null || metinMi(k.not, 2000)) &&
      k.konum && typeof k.konum.ad === 'string' && sayiMi(k.konum.enlem) && sayiMi(k.konum.boylam) &&
      Math.abs(k.konum.enlem) <= 90 && Math.abs(k.konum.boylam) <= 180 &&
      (k.otomatik == null || typeof k.otomatik === 'object'));
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
    return { id: k.id, zaman: new Date(k.zaman).toISOString(), cisim: { anahtar: k.cisim.anahtar, ad: k.cisim.ad }, alet: k.alet, kosul: k.kosul, not: k.not || '',
      konum, otomatik: oo };
  }
  function yedekYukle(e) {
    const dosya = e.target.files && e.target.files[0];
    const durumEl = el.querySelector('#dfYedekDurum');
    /* Seçim hemen temizlenir (File nesnesi elde kalır): hata da olsa aynı dosya yeniden seçilebilsin */
    e.target.value = '';
    if (!dosya) return;
    const r = new FileReader();
    r.onerror = () => { durumEl.textContent = 'Bu dosya okunamadı.'; };
    r.onload = () => {
      let j;
      try { j = JSON.parse(r.result); } catch (h) { durumEl.textContent = 'Bu dosya okunamadı: geçerli bir JSON değil.'; return; }
      const gelen = Array.isArray(j) ? j : (j && j.kayitlar);
      if (!Array.isArray(gelen)) { durumEl.textContent = 'Bu dosya bir Urania defter yedeği değil.'; return; }
      const ls = kayitlar();
      const var_ = new Set(ls.map(k => k.id));
      let eklenen = 0, atlanan = 0, gecersiz = 0;
      gelen.forEach(k => {
        if (!gecerliKayit(k)) { gecersiz++; return; }
        if (var_.has(k.id)) { atlanan++; return; }
        ls.push(temizle(k)); var_.add(k.id); eklenen++;
      });
      if (eklenen && !kaydet(ls)) { durumEl.textContent = 'Yüklenemedi: depolama alanı dolu ya da kapalı. Hiçbir kayıt eklenmedi.'; return; }
      listeYaz();
      durumEl.textContent = `${eklenen} kayıt eklendi` + (atlanan ? `, ${atlanan} kayıt zaten vardı` : '') + (gecersiz ? `, ${gecersiz} kayıt bozuk olduğu için atlandı` : '') + '.';
    };
    r.readAsText(dosya);
  }

  /* ---------- Bölüm ---------- */
  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Defter açılıyor…</p>';
    const [yildizlar, takimyildizlar, hedefler, meteor, gorevler] = await Promise.all([U.veri('yildizlar'), U.veri('takimyildiz'), U.veri('hedefler'), U.veri('meteor'), U.veri('gorevler').catch(() => null)]);
    veri = { yildizlar, takimyildizlar, hedefler: hedefler.hedefler, meteor, gorevler };
    iskelet();
    goster(kok, location.hash.split('/').slice(1).join('/'));
  }
  /* #defter ya da #defter/yeni/<anahtar> */
  function goster(kok, param) {
    if (!veri) return;
    if ((param || '').split('/')[0] === 'gorevler' && window.Gorevler) { gorevAcik = true; Gorevler.ciz(el, veri); return; }
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
  window.Defter = { kayitlar, sonGorulme };
})();
