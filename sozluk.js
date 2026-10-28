/* sozluk.js — Astro sözlük: ders ve deney metinlerindeki terimlerin altı noktalı çizilir, dokununca kısa tanım
   açılır; #ders/sozluk aranabilir sözlük sayfasıdır. Veri: veri/sozluk.json (araclar/sozluk_yap.py üretir;
   eşleşme desenleri de oradan gelir, Python ile aynı kurallar).
   API (deneyler de kullanır, değişmemeli):
     Sozluk.yukle()               → Promise (veri yüklenince)
     Sozluk.isaretle(kok, secenek) → Promise<sayı>; kok altındaki metinde her terimin İLK geçtiği yeri
                                     <button class="terim"> içine alır. secenek.ders: ders kimliği ("d5")
     Sozluk.ac(terim, dugme?)      → terimin kısa tanımını açar (terim: kimlik ya da ad)
   Sesli okuma .okunur bloklarının innerText'ini okur: düğme metne hiçbir karakter eklemez, aria-label yoktur. */
(function () {
  'use strict';
  const U = window.Urania;
  let V = null, soz = null;          // veri ve yükleme sözü
  let IFADE = null, SIRA = [];       // birleşik düzenli ifade; yakalama grubu → terim sırası
  const kimlikle = new Map(), adla = new Map();

  /* Türkçe küçük harf + şapka/tırnak/tire katlaması; karakter sayısı değişmez (sozluk_yap.py kucuk ile aynı) */
  const KATLA = { 'I': 'ı', 'İ': 'i', 'â': 'a', 'Â': 'a', 'î': 'i', 'Î': 'i', 'û': 'u', 'Û': 'u', '’': "'", '‘': "'", 'ʼ': "'", '‐': '-', '‑': '-', '–': '-', '—': '-' };
  function kucukHarf(s) {
    let o = '';
    for (let k = 0; k < s.length; k++) {
      const c = s[k], m = KATLA[c];
      if (m) { o += m; continue; }
      const l = c.toLowerCase();
      o += l.length === 1 ? l : c;
    }
    return o;
  }
  /* Arama için: Türkçe harfler de katlanır (isik → ışık) */
  const ASCII = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };
  const aramaBicim = s => kucukHarf(s).replace(/[çğıöşü]/g, c => ASCII[c]).replace(/\s+/g, ' ').trim();

  function hazirla(d) {
    V = d;
    kimlikle.clear(); adla.clear();
    const alt = [];
    d.terimler.forEach((t, i) => {
      kimlikle.set(t.kimlik, t);
      adla.set(kucukHarf(t.terim), t);
      (t.desen || []).forEach(([desen, uzunluk]) => alt.push({ desen, uzunluk, i }));
    });
    alt.sort((a, b) => b.uzunluk - a.uzunluk);   // uzun terim önce ("beyaz cüce" "cüce"den önce)
    SIRA = alt.map(a => a.i);
    try {
      IFADE = new RegExp("(?<![\\p{L}\\p{N}])(?:" + alt.map(a => '(' + a.desen + ')').join('|') + ")(?:'\\p{L}+|\\p{L}*)(?![\\p{L}\\p{N}])", 'gu');
    } catch (e) { console.warn('Sözlük deseni kurulamadı: ' + e.message); IFADE = null; }
  }
  function yukle() {
    if (!soz) soz = U.veri('sozluk').then(d => { hazirla(d); return d; }).catch(e => { soz = null; throw e; });
    return soz;
  }
  function bul(t) {
    if (!V || t == null) return null;
    return kimlikle.get(String(t)) || adla.get(kucukHarf(String(t))) || null;
  }

  /* ---- Metinde işaretleme ---- */
  /* Atlanır: başlıklar, düğme ve bağlantılar, var olan terimler, çizimler, kod, form öğeleri, dinleme çubuğu,
     dersin kendi sözlüğü, formüller, kaynak satırları; ayrıca data-sozluk-yok ile işaretlenen her yer */
  const ATLA = 'h1,h2,h3,h4,h5,h6,button,a,summary,label,.terim,figure,svg,canvas,math,code,pre,kbd,samp,input,textarea,select,option,' +
    '.dinle,.so-cubuk,dl.sozluk,.formul,.kaynak,.geri,.alt-baslik,.mini-deney,.ders-son,script,style,[contenteditable],[data-sozluk-yok]';
  function isaretleHemen(kok, sec) {
    if (!IFADE || !kok || !kok.isConnected) return 0;
    const ders = sec && sec.ders;
    const kullanildi = new Set([...kok.querySelectorAll('button.terim')].map(b => b.dataset.terim));
    const dugumler = [];
    const yuruyen = document.createTreeWalker(kok, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || n.nodeValue.length < 2 || !/\p{L}/u.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        const a = n.parentElement && n.parentElement.closest(ATLA);
        return a && (a === kok || kok.contains(a)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    for (let n = yuruyen.nextNode(); n; n = yuruyen.nextNode()) dugumler.push(n);
    let sayi = 0;
    for (const n of dugumler) {
      const asil = n.nodeValue, kucuk = kucukHarf(asil);
      const bulunan = [];
      IFADE.lastIndex = 0;
      let m;
      while ((m = IFADE.exec(kucuk))) {
        let g = 1;
        while (g <= SIRA.length && m[g] === undefined) g++;
        const t = V.terimler[SIRA[g - 1]];
        if (!t || kullanildi.has(t.kimlik)) continue;
        if (t.yalniz && !(ders && t.yalniz.indexOf(ders) >= 0)) continue;
        if (t.buyuk) { const govde = asil.substr(m.index, m[g].length); if (govde !== govde.toLocaleUpperCase('tr-TR')) continue; }
        kullanildi.add(t.kimlik);
        bulunan.push({ bas: m.index, son: m.index + m[0].length, t });
      }
      if (!bulunan.length) continue;
      const parca = document.createDocumentFragment();
      let k = 0;
      for (const b of bulunan) {
        if (b.bas > k) parca.appendChild(document.createTextNode(asil.slice(k, b.bas)));
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'terim';
        d.dataset.terim = b.t.kimlik;
        d.setAttribute('aria-haspopup', 'dialog');
        d.textContent = asil.slice(b.bas, b.son);
        parca.appendChild(d);
        k = b.son;
        sayi++;
      }
      if (k < asil.length) parca.appendChild(document.createTextNode(asil.slice(k)));
      n.parentNode.replaceChild(parca, n);
    }
    return sayi;
  }
  function isaretle(kok, secenek) {
    if (!kok) return Promise.resolve(0);
    if (V) return Promise.resolve(isaretleHemen(kok, secenek));
    return yukle().then(() => isaretleHemen(kok, secenek), () => 0);
  }

  /* ---- Kısa tanım penceresi ---- */
  let pen = null, donus = null, gezinme = false;
  const dersAd = id => (V && V.ders_adlari && V.ders_adlari[id]) || id;
  const kisaAd = id => dersAd(id).split(':')[0];
  function pencere() {
    if (pen) return pen;
    pen = document.createElement('dialog');
    pen.className = 'sz-pen';
    pen.setAttribute('aria-labelledby', 'szPenBas');
    pen.setAttribute('aria-describedby', 'szPenTanim');
    pen.innerHTML = `<div class="sz-pen-ic">
      <div class="sz-pen-ust"><h2 id="szPenBas"></h2><button type="button" class="dugme sz-kapat">Kapat</button></div>
      <p id="szPenTanim" class="sz-pen-tanim"></p>
      <p class="sz-pen-es kucuk soluk"></p>
      <div class="sz-pen-ders"><h3>Geçtiği dersler</h3><ul class="sz-dersler"></ul></div>
      <p class="sz-pen-alt"><a class="sz-pen-ac" href="#ders/sozluk">Sözlükte aç</a></p></div>`;
    document.body.appendChild(pen);
    pen.querySelector('.sz-kapat').addEventListener('click', () => pen.close());
    /* İç kutu pencereyi tam doldurur: hedef pencerenin kendisiyse dokunuş dışarıya (arka plana) */
    pen.addEventListener('click', e => { if (e.target === pen) pen.close(); });
    pen.addEventListener('click', e => { if (e.target.closest && e.target.closest('a[href]')) { gezinme = true; pen.close(); } });
    pen.addEventListener('close', () => {
      const d = donus; donus = null;
      if (!gezinme && d && d.isConnected) d.focus({ preventScroll: true });
      gezinme = false;
    });
    window.addEventListener('hashchange', () => { if (pen.open) { gezinme = true; pen.close(); } });
    window.addEventListener('resize', () => { if (pen.open) konumla(); });
    return pen;
  }
  /* Telefonda alt sayfa (CSS); geniş ekranda terimin altına (sığmazsa üstüne) yaslanır */
  function konumla() {
    const p = pen;
    ['top', 'left'].forEach(k => p.style.removeProperty(k));
    p.classList.remove('sz-yasli');
    if (window.innerWidth < 640 || !donus || !donus.isConnected) return;
    const r = donus.getBoundingClientRect(), g = p.offsetWidth, y = p.offsetHeight;
    const sol = Math.max(12, Math.min(r.left, window.innerWidth - g - 12));
    let ust = r.bottom + 8;
    if (ust + y > window.innerHeight - 12) ust = Math.max(12, r.top - y - 8);
    p.classList.add('sz-yasli');
    p.style.left = sol + 'px';
    p.style.top = ust + 'px';
  }
  function ac(terim, dugme) {
    const t = bul(terim);
    if (!t) return false;
    const p = pencere();
    if (p.open) { gezinme = true; p.close(); }
    gezinme = false;
    donus = dugme || (document.activeElement !== document.body ? document.activeElement : null);
    const simdiki = (location.hash.match(/^#ders\/(d\d+)/) || [])[1];
    p.querySelector('#szPenBas').textContent = t.terim;
    p.querySelector('#szPenTanim').textContent = t.tanim;
    const es = p.querySelector('.sz-pen-es');
    es.textContent = t.esanlam && t.esanlam.length ? 'Diğer adları: ' + t.esanlam.join(', ') : '';
    es.hidden = !es.textContent;
    const dl = p.querySelector('.sz-pen-ders');
    dl.hidden = !(t.dersler && t.dersler.length);
    p.querySelector('.sz-dersler').innerHTML = (t.dersler || []).map(id => `<li><a href="#ders/${U.kacis(id)}"${id === simdiki ? ' aria-current="page"' : ''}>${U.kacis(kisaAd(id))}</a>${id === simdiki ? ' <span class="kucuk soluk">(bu ders)</span>' : ''}</li>`).join('');
    p.querySelector('.sz-pen-ac').setAttribute('href', '#ders/sozluk/' + t.kimlik);
    p.showModal();
    konumla();
    p.querySelector('.sz-kapat').focus({ preventScroll: true });
    return true;
  }
  /* Tek dinleyici: hangi sayfada işaretlenmiş olursa olsun */
  document.addEventListener('click', e => {
    const d = e.target && e.target.closest ? e.target.closest('button.terim') : null;
    if (!d) return;
    e.preventDefault();
    ac(d.dataset.terim, d);
  });

  /* ---- Sözlük sayfası (#ders/sozluk, #ders/sozluk/<kimlik>) ---- */
  const HARFLER = 'ABCÇDEFGĞHIİJKLMNOÖPQRSŞTUÜVWXYZ';
  const basHarf = s => { const h = s.trim().charAt(0).toLocaleUpperCase('tr-TR'); return HARFLER.indexOf(h) >= 0 ? h : '#'; };
  let sonArama = '';
  function sayfa(el, kimlik) {
    if (!V) {
      el.innerHTML = '<a class="geri" href="#ders">Tüm dersler</a><h1>Astro sözlük</h1><p class="bos">Sözlük yükleniyor…</p>';
      return yukle().then(() => { if (/^#ders\/sozluk/.test(location.hash)) sayfaCiz(el, kimlik); }, e => {
        el.innerHTML = '<a class="geri" href="#ders">Tüm dersler</a><h1>Astro sözlük</h1><div class="hata-kutu" role="alert">Sözlük yüklenemedi: ' + U.kacis(e.message) + '</div>';
      });
    }
    sayfaCiz(el, kimlik);
    return Promise.resolve();
  }
  function sayfaCiz(el, kimlik) {
    const ls = V.terimler.slice().sort((a, b) => a.terim.localeCompare(b.terim, 'tr'));
    const gruplar = [];
    ls.forEach(t => { const h = basHarf(t.terim); let g = gruplar[gruplar.length - 1]; if (!g || g.h !== h) gruplar.push(g = { h, ls: [] }); g.ls.push(t); });
    const kaynakSatir = t => {
      const p = [];
      if (t.tanimli && t.tanimli.length) p.push('Tanım: ' + t.tanimli.map(id => `<a href="#ders/${U.kacis(id)}">${U.kacis(kisaAd(id))}</a>`).join(', ') + ' dersinin sözlüğü');
      if (t.kaynak && t.kaynak.length) p.push('Kaynak: ' + t.kaynak.map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · '));
      return p.length ? `<p class="kaynak">${p.join(' · ')}</p>` : '';
    };
    el.innerHTML = `<div class="sz-sayfa">
      <a class="geri" href="#ders">Tüm dersler</a>
      <h1>Astro sözlük</h1>
      <p class="alt-baslik">Derslerde ve deneylerde geçen ${ls.length} terimin kısa tanımı. Metinde altı noktalı çizili bir sözcüğe dokununca da açılır.</p>
      <div class="sz-ara-kutu" role="search">
        <label class="gorsel-gizli" for="szAra">Sözlükte ara</label>
        <input type="search" id="szAra" class="sz-ara" placeholder="Ara: parsek, ışık yılı, anakol…" autocomplete="off" spellcheck="false" aria-describedby="szSonuc">
        <p id="szSonuc" class="kucuk soluk sz-sonuc" role="status" aria-live="polite"></p>
      </div>
      <nav class="sz-harfler" aria-label="Harfe atla">${gruplar.map(g => `<button type="button" class="sz-harf" data-harf="${U.kacis(g.h)}">${U.kacis(g.h)}</button>`).join('')}</nav>
      ${kimlik && !bul(kimlik) ? `<p class="hata-kutu" role="alert">"${U.kacis(kimlik)}" sözlükte yok.</p>` : ''}
      ${gruplar.map(g => `<section class="sz-grup" data-harf="${U.kacis(g.h)}"><h2 class="sz-harf-bas" id="sz-h-${U.kacis(g.h)}" tabindex="-1">${U.kacis(g.h)}</h2>
        <ul class="sz-liste">${g.ls.map(t => `<li class="sz-oge" id="sz-${U.kacis(t.kimlik)}" data-kimlik="${U.kacis(t.kimlik)}" tabindex="-1">
          <h3 class="sz-ad">${U.kacis(t.terim)}</h3>
          <p class="sz-tanim">${U.kacis(t.tanim)}</p>
          ${t.esanlam && t.esanlam.length ? `<p class="kucuk soluk sz-es">Diğer adları: ${U.kacis(t.esanlam.join(', '))}</p>` : ''}
          ${t.dersler && t.dersler.length ? `<p class="kucuk sz-ders">Geçtiği dersler: ${t.dersler.map(id => `<a href="#ders/${U.kacis(id)}">${U.kacis(kisaAd(id))}</a>`).join(', ')}</p>` : ''}
          ${kaynakSatir(t)}</li>`).join('')}</ul></section>`).join('')}
      <p class="sz-yok bos" hidden>Bu aramayla eşleşen terim yok.</p>
      <p class="kaynak">${U.kacis(V.kaynak || '')}</p>
    </div>`;
    /* Arama: her terimin adı, eş anlamlıları ve (3 harften sonra) tanımı; Türkçe harfsiz yazım da bulur */
    const ogeler = [...el.querySelectorAll('.sz-oge')].map(li => {
      const t = kimlikle.get(li.dataset.kimlik);
      return { li, ad: aramaBicim([t.terim].concat(t.esanlam || []).join(' | ')), tanim: aramaBicim(t.tanim) };
    });
    const girdi = el.querySelector('#szAra'), sonuc = el.querySelector('#szSonuc');
    /* Önce adında (ya da eş anlamlısında) geçenler; adında hiç yoksa tanımında geçenler */
    const suz = () => {
      const q = aramaBicim(girdi.value);
      let adda = ogeler.filter(o => !q || o.ad.indexOf(q) >= 0), tanimda = false;
      if (q && !adda.length && q.length >= 3) { adda = ogeler.filter(o => o.tanim.indexOf(q) >= 0); tanimda = adda.length > 0; }
      const gor = new Set(adda);
      ogeler.forEach(o => { o.li.hidden = !gor.has(o); });
      el.querySelectorAll('.sz-grup').forEach(s => { s.hidden = !s.querySelector('.sz-oge:not([hidden])'); });
      el.querySelectorAll('.sz-harf').forEach(b => { b.disabled = !!el.querySelector('.sz-grup[data-harf="' + b.dataset.harf + '"][hidden]'); });
      el.querySelector('.sz-yok').hidden = gor.size > 0;
      sonuc.textContent = !q ? '' : (tanimda ? 'Adında geçen yok; tanımında geçen ' + gor.size + ' terim' : gor.size + ' terim bulundu');
      sonArama = girdi.value;
    };
    girdi.addEventListener('input', suz);
    girdi.addEventListener('keydown', e => { if (e.key === 'Escape' && girdi.value) { girdi.value = ''; suz(); } });
    el.querySelectorAll('.sz-harf').forEach(b => b.addEventListener('click', () => {
      const h = el.querySelector('#sz-h-' + CSS.escape(b.dataset.harf));
      if (h) { h.scrollIntoView({ block: 'start' }); h.focus({ preventScroll: true }); }
    }));
    /* Derin bağlantı: terimine kaydır, vurgula ve odağı ver (ekran okuyucu okur) */
    const hedef = kimlik && el.querySelector('#sz-' + CSS.escape(kimlik));
    if (hedef) {
      if (sonArama) { girdi.value = ''; sonArama = ''; }
      hedef.classList.add('sz-vurgu');
      hedef.focus({ preventScroll: true });
      hedef.scrollIntoView({ block: 'center' });
    } else {
      if (sonArama) { girdi.value = sonArama; suz(); }
      const bas = el.querySelector('h1');
      bas.setAttribute('tabindex', '-1');
      bas.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  window.Sozluk = { yukle, isaretle, ac, sayfa, bul, sayi: () => (V ? V.terimler.length : 0), _kucukHarf: kucukHarf };
})();
