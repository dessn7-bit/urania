/* defter.js — Gözlem defteri: ne gördün, ne zaman, neyle, nasıl bir gökte.
   Kayıtlar yalnız bu cihazda (yerel depo) tutulur; "Yedeği indir" ile dosyaya alınır,
   "Yedekten yükle" ile geri yüklenir (aynı kimlikli kayıt iki kez eklenmez).
   Kaydederken Ay'ın evresi ve cismin o anki yüksekliği otomatik eklenir. */
(function () {
  'use strict';
  const G = window.Gok, U = window.Urania;
  const DEPO = 'defter';
  let el = null, veri = null, duzenlenen = null, gorevAcik = false;

  /* ---------- Depo ---------- */
  function kayitlar() { const k = U.oku(DEPO, []); return Array.isArray(k) ? k : []; }
  function kaydet(ls) { return U.yaz(DEPO, ls); }
  function yeniKimlik() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  const KIMLIK = /^[a-z0-9]{1,24}$/;
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
    if (veri.gorevler) veri.gorevler.gorevler.filter(g => g.anahtar.startsWith('gorev:')).forEach(g => ls.push({ grup: 'Gözlem görevleri', anahtar: g.anahtar, ad: g.ad, ra: g.ra, dec: g.dec }));
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
      if (cisim && cisim.anahtar.startsWith('cisim:')) {
        const p = G.cisimAltAz(cisim.anahtar.slice(6), zaman, gzl); o.alt = Math.round(p.alt); o.az = Math.round(p.az);
      } else if (cisim && cisim.ra != null) {
        const p = G.sabitAltAz(cisim.ra, cisim.dec, zaman, gzl); o.alt = Math.round(p.alt); o.az = Math.round(p.az);
      }
    } catch (e) { /* konum hesaplanamadıysa kayıt yine yapılır */ }
    const hd = window.Hava && Hava.saatDegeri(k.enlem, k.boylam, zaman);
    if (hd) { o.bulut = hd.bulut; if (hd.yagisOl != null) o.yagisOl = hd.yagisOl; }
    return o;
  }

  /* ---------- Biçim yardımcıları ---------- */
  function yerelGirdi(d) {
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  const ALETLER = ['Çıplak göz', '7×50 dürbün', 'Teleskop', 'Diğer'];
  const KOSULLAR = ['Berrak', 'Hafif puslu', 'Puslu', 'Parçalı bulutlu', 'Çok bulutlu'];

  /* ---------- Görünüm ---------- */
  function iskelet() {
    const kat = katalog();
    const gruplar = {};
    kat.forEach(x => { (gruplar[x.grup] = gruplar[x.grup] || []).push(x); });
    el.innerHTML = `
      <h1>Gözlem defteri</h1>
      <p class="alt-baslik" id="dfOzet"></p>
      <a class="sinav-giris" id="dfGorev" href="#defter/gorevler" hidden><b>Gözlem görevleri</b><span id="dfGorevSayi"></span></a>
      <button type="button" class="dugme dolu" id="dfYeni">Yeni kayıt</button>
      <form class="defter-form" id="dfForm" hidden>
        <h2 id="dfFormBaslik" style="margin-top:20px">Yeni kayıt</h2>
        <div class="alan"><label for="dfCisim">Ne gördün?</label>
          <select id="dfCisim">${Object.keys(gruplar).map(g => `<optgroup label="${U.kacis(g)}">${gruplar[g].map(x => `<option value="${U.kacis(x.anahtar)}">${U.kacis(x.ad)}</option>`).join('')}</optgroup>`).join('')}<optgroup label="Başka"><option value="diger">Listede yok (kendim yazacağım)</option></optgroup></select></div>
        <div class="alan" id="dfDigerAlan" hidden><label for="dfDiger">Cismin adı</label><input id="dfDiger" maxlength="80" autocomplete="off"></div>
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
        <div class="cip-grup"><button type="button" class="dugme" id="dfIndir">Yedeği indir</button><label class="dugme" for="dfYukle">Yedekten yükle</label><input type="file" id="dfYukle" accept="application/json,.json" hidden></div>
        <p class="kucuk" id="dfYedekDurum" role="status"></p>
      </details>`;
    el.querySelector('#dfYeni').addEventListener('click', () => formAc(null));
    el.querySelector('#dfVazgec').addEventListener('click', formKapat);
    el.querySelector('#dfCisim').addEventListener('change', () => { el.querySelector('#dfDigerAlan').hidden = el.querySelector('#dfCisim').value !== 'diger'; });
    el.querySelector('#dfForm').addEventListener('submit', e => { e.preventDefault(); formKaydet(); });
    el.querySelector('#dfListe').addEventListener('click', listeTikla);
    el.querySelector('#dfIndir').addEventListener('click', yedekIndir);
    el.querySelector('#dfYukle').addEventListener('change', yedekYukle);
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
    el.querySelector('#dfZaman').value = yerelGirdi(kayit ? new Date(kayit.zaman) : new Date());
    el.querySelector('#dfAlet').value = kayit ? kayit.alet : U.oku('defterSonAlet', '7×50 dürbün');
    el.querySelector('#dfKosul').value = kayit ? kayit.kosul : 'Berrak';
    el.querySelector('#dfNot').value = kayit ? (kayit.not || '') : '';
    const k = kayit ? kayit.konum : U.konum();
    el.querySelector('#dfKonum').textContent = k.ad;
    f.hidden = false;
    el.querySelector('#dfYeni').hidden = true;
    sec.focus();
  }
  function formKapat() {
    el.querySelector('#dfForm').hidden = true;
    el.querySelector('#dfYeni').hidden = false;
    duzenlenen = null;
    if (location.hash.startsWith('#defter/')) history.replaceState(null, '', '#defter');
  }

  function formKaydet() {
    const secim = el.querySelector('#dfCisim').value;
    let cisim;
    if (secim === 'diger') {
      const ad = el.querySelector('#dfDiger').value.trim();
      if (!ad) { el.querySelector('#dfDiger').focus(); el.querySelector('#dfDiger').setAttribute('aria-invalid', 'true'); return; }
      cisim = { anahtar: 'diger:' + ad.toLocaleLowerCase('tr-TR'), ad };
    } else {
      const c = katalogBul(secim);
      cisim = { anahtar: c.anahtar, ad: c.ad, ra: c.ra, dec: c.dec };
    }
    const zStr = el.querySelector('#dfZaman').value;
    const zaman = zStr ? new Date(zStr) : new Date();
    if (isNaN(zaman)) { el.querySelector('#dfZaman').focus(); return; }
    const ls = kayitlar();
    const eski = duzenlenen ? ls.find(x => x.id === duzenlenen) : null;
    const konum = eski ? eski.konum : (({ ad, enlem, boylam, yukseklik }) => ({ ad, enlem, boylam, yukseklik }))(U.konum());
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
      el.querySelector('#dfKaydet').insertAdjacentHTML('afterend', '<span class="hata-kutu" role="alert" style="display:block">Kaydedilemedi: telefonun bu site için ayrılan depolama alanı dolu ya da kapalı. Önce "Yedeği indir" ile yedek al.</span>');
      return;
    }
    formKapat();
    listeYaz();
  }

  function listeTikla(e) {
    const b = e.target.closest('button[data-is]'); if (!b) return;
    const ls = kayitlar();
    const k = ls.find(x => x.id === b.dataset.id); if (!k) return;
    if (b.dataset.is === 'duzenle') { formAc(k); window.scrollTo({ top: 0 }); }
    if (b.dataset.is === 'sil') {
      if (b.dataset.onay !== '1') { b.dataset.onay = '1'; b.textContent = 'Silmek için tekrar bas'; setTimeout(() => { if (b.isConnected) { b.dataset.onay = ''; b.textContent = 'Sil'; } }, 4000); return; }
      kaydet(ls.filter(x => x.id !== k.id));
      listeYaz();
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
    const gruplar = [];
    ls.forEach(k => {
      const ogle = G.yerelOgle(new Date(k.zaman), k.konum.boylam);
      const anahtar = ogle.toISOString();
      let g = gruplar.find(x => x.anahtar === anahtar);
      if (!g) { g = { anahtar, ogle, ls: [] }; gruplar.push(g); }
      g.ls.push(k);
    });
    el.querySelector('#dfListe').innerHTML = gruplar.map(g => `
      <h2>${U.kacis(U.gunHafta(g.ogle))} gecesi</h2>
      <ul class="liste">${g.ls.map(k => {
        const o = k.otomatik || {};
        const parca = [U.saat(new Date(k.zaman)), k.alet, k.kosul];
        if (o.alt != null) parca.push(o.alt + '° yükseklik');
        if (o.ayOran != null) parca.push('Ay %' + o.ayOran + (o.ayAlt != null && o.ayAlt < 0 ? ' (batmıştı)' : ''));
        if (o.bulut != null) parca.push('tahmini bulut %' + o.bulut);
        if (o.yagisOl != null && o.yagisOl > 0) parca.push('yağış olasılığı %' + o.yagisOl);
        return `<li><span class="ad">${U.kacis(k.cisim.ad)}</span><span class="sag kucuk soluk">${U.kacis(k.konum.ad)}</span>
          <span class="alt">${parca.map(U.kacis).join(' · ')}${k.not ? `<span class="defter-not">${U.kacis(k.not)}</span>` : ''}
          <span class="cip-grup" style="margin-top:6px"><button type="button" class="bag" data-is="duzenle" data-id="${U.kacis(k.id)}">Düzenle</button><button type="button" class="bag" data-is="sil" data-id="${U.kacis(k.id)}">Sil</button></span></span></li>`;
      }).join('')}</ul>`).join('');
  }

  /* ---------- Yedek ---------- */
  function yedekIndir() {
    const ls = kayitlar();
    const blob = new Blob([JSON.stringify({ uygulama: 'Urania', tur: 'gozlem-defteri', surum: 1, olusturma: new Date().toISOString(), kayitlar: ls }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'urania-defter-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    el.querySelector('#dfYedekDurum').textContent = ls.length + ' kayıt indirildi.';
  }
  /* Yedekten gelen kayıt sıkı denetlenir; metinler zaten her yerde kaçışlanır */
  const sayiMi = x => typeof x === 'number' && isFinite(x);
  const metinMi = (x, en) => typeof x === 'string' && x.length <= en;
  function gecerliKayit(k) {
    return !!(k && typeof k === 'object' && KIMLIK.test(k.id) && metinMi(k.zaman, 40) && !isNaN(new Date(k.zaman)) &&
      k.cisim && metinMi(k.cisim.anahtar, 120) && metinMi(k.cisim.ad, 120) &&
      metinMi(k.alet, 40) && metinMi(k.kosul, 40) && (k.not == null || metinMi(k.not, 2000)) &&
      k.konum && metinMi(k.konum.ad, 120) && sayiMi(k.konum.enlem) && sayiMi(k.konum.boylam) &&
      Math.abs(k.konum.enlem) <= 90 && Math.abs(k.konum.boylam) <= 180 &&
      (k.otomatik == null || typeof k.otomatik === 'object'));
  }
  /* İçe alınan kaydın yalnız bilinen alanları saklanır */
  function temizle(k) {
    const o = k.otomatik || {}, oo = {};
    ['ayOran', 'ayAlt', 'alt', 'az', 'bulut', 'yagisOl'].forEach(a => { if (sayiMi(o[a])) oo[a] = o[a]; });
    if (metinMi(o.ayEvre, 40)) oo.ayEvre = o.ayEvre;
    return { id: k.id, zaman: k.zaman, cisim: { anahtar: k.cisim.anahtar, ad: k.cisim.ad }, alet: k.alet, kosul: k.kosul, not: k.not || '',
      konum: { ad: k.konum.ad, enlem: k.konum.enlem, boylam: k.konum.boylam, yukseklik: sayiMi(k.konum.yukseklik) ? k.konum.yukseklik : 0 }, otomatik: oo };
  }
  function yedekYukle(e) {
    const dosya = e.target.files && e.target.files[0];
    const durumEl = el.querySelector('#dfYedekDurum');
    if (!dosya) return;
    const r = new FileReader();
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
      e.target.value = '';
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
    if (p[0] === 'yeni') formAc(null, p[1] ? decodeURIComponent(p[1]) : null);
  }

  U.modul('defter', { ilk, goster });
  window.Defter = { kayitlar, sonGorulme };
})();
