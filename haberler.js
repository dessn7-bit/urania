/* haberler.js — "Haberler" bölümü: güncel astronomi haberleri, araştırmalar, uzay görevleri ve gökyüzü olayları.
   Veri: veri/haberler.json (her hafta güncellenir; yöntem arastirma/haberler/YONTEM.md). Her haber en az iki
   kaynakla doğrulanmış, sade Türkçeyle yazılmıştır. #haber/<kimlik> o haberi açar.
   Son ziyaretten sonra eklenen haberler "Yeni" rozeti alır; alt menüdeki Haberler sekmesinde de nokta görünür. */
(function () {
  'use strict';
  const U = window.Urania;
  let el = null, V = null;
  const TUR = {
    haber: { ad: 'Keşif', cogul: 'Keşifler' },
    arastirma: { ad: 'Araştırma', cogul: 'Araştırmalar' },
    gorev: { ad: 'Uzay görevi', cogul: 'Uzay görevleri' },
    gokyuzu: { ad: 'Gökyüzü', cogul: 'Gökyüzü' }
  };
  const KESINLIK = { 'ön sonuç': 'Ön sonuç: henüz hakem değerlendirmesinden geçmedi ya da doğrulanmayı bekliyor', 'tartışmalı': 'Tartışmalı: bilim insanları bu sonuç üzerinde anlaşmış değil' };
  const AYLAR = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const GUN = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const tarihAl = s => { const d = new Date(String(s || '') + 'T00:00:00Z'); return isNaN(d) ? null : d; };
  const gun = s => { const d = tarihAl(s); return d ? GUN.format(d) : ''; };
  const ayBasligi = s => { const d = tarihAl(s); if (!d) return ''; const t = AYLAR.format(d); return t.charAt(0).toLocaleUpperCase('tr-TR') + t.slice(1); };
  const kendi = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);

  function sonZiyaret() { return String(U.oku('haberSon', '') || ''); }
  function yeniMi(h, son) { return !!son && String(h.eklenme || '') > son; }

  /* Alt menüdeki sekmede nokta: son ziyaretten sonra eklenmiş haber var mı */
  function noktaGuncelle() {
    if (!V) return;
    const son = sonZiyaret();
    const var_ = !son ? false : V.haberler.some(h => yeniMi(h, son));
    document.querySelectorAll('[data-sekme="haber"]').forEach(a => a.classList.toggle('yeni-var', var_));
  }

  function linkler(ls) {
    return (ls || []).filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>${k.tarih ? ` <span class="soluk">(${U.kacis(gun(k.tarih))})</span>` : ''}`).join(' · ');
  }
  function dersLinkleri(ls) {
    return (ls || []).filter(d => /^d\d{1,2}$/.test(d)).map(d => `<a href="#ders/${d}" data-ders="${d}">${U.kacis(dersAdlari[d] || ('Ders ' + d.slice(1)))}</a>`).join(' · ');
  }
  let dersAdlari = {};

  /* Görsel: yalnız serbest lisanslı resmî görseller, yerel kopya (img/haber/<kimlik>.jpg; CSP img-src 'self').
     Resim altında ne olduğu (gerçek gözlem mi, sanatçı çizimi mi) ve kredi/lisans yazar. Yüklenemezse figür gizlenir. */
  function gorselHtml(h) {
    const g = h.gorsel;
    if (!g || typeof g.dosya !== 'string' || !/^img\/haber\/[a-z0-9-]+\.jpg$/.test(g.dosya)) return '';
    return `<figure class="hb-gorsel"><img src="./${g.dosya}" alt="${U.kacis(g.alt || '')}" loading="lazy" decoding="async">
      <figcaption>${g.aciklama ? `<span class="okunur">${U.kacis(g.aciklama)}</span> ` : ''}<span class="hb-kredi">Görsel: ${g.kaynak_url ? `<a href="${U.guvenliUrl(g.kaynak_url)}" target="_blank" rel="noopener">${U.kacis(g.kredi || 'kaynak')}</a>` : U.kacis(g.kredi || '')}${g.lisans ? ' · ' + U.kacis(g.lisans) : ''}</span></figcaption></figure>`;
  }
  function kartHtml(h, son) {
    const tur = TUR[h.tur] || TUR.haber;
    const p = Array.isArray(h.ozet) ? h.ozet : [String(h.ozet || '')];
    const kes = kendi(KESINLIK, h.kesinlik) ? `<span class="rozet uyari" title="${U.kacis(KESINLIK[h.kesinlik])}">${U.kacis(h.kesinlik === 'ön sonuç' ? 'Ön sonuç' : 'Tartışmalı')}</span>` : '';
    const m = h.makale && h.makale.url ? `<p class="hb-makale okunur"><b>Makale:</b> ${U.kacis(h.makale.yazarlar || '')}${h.makale.yazarlar ? ', ' : ''}<a href="${U.guvenliUrl(h.makale.url)}" target="_blank" rel="noopener">${U.kacis(h.makale.baslik || 'makale')}</a>${h.makale.dergi ? ` <span class="soluk">(${U.kacis(h.makale.dergi)})</span>` : ''}</p>` : '';
    return `<article class="haber" id="h-${U.kacis(h.id)}" data-id="${U.kacis(h.id)}" data-tur="${U.kacis(h.tur)}">
      <p class="hb-ust"><span class="rozet">${U.kacis(tur.ad)}</span>${kes}${yeniMi(h, son) ? '<span class="rozet iyi">Yeni</span>' : ''}<time datetime="${U.kacis(h.tarih)}">${U.kacis(gun(h.tarih))}</time></p>
      <h2 class="okunur">${U.kacis(h.baslik)}</h2>
      ${gorselHtml(h)}
      <p class="hb-giris okunur">${U.kacis(p[0] || '')}</p>
      <details class="hb-ac">
        <summary><span class="hb-ac-yazi">Devamını oku</span></summary>
        <div class="hb-ic">
          <div class="dinle hb-ses" role="group" aria-label="Haberi dinle"></div>
          ${p.slice(1).map(x => `<p class="okunur">${U.kacis(x)}</p>`).join('')}
          ${h.neden_onemli ? `<div class="hb-kutu okunur"><b>Neden önemli?</b> ${U.kacis(h.neden_onemli)}</div>` : ''}
          ${h.istanbul ? `<div class="hb-kutu hb-istanbul okunur"><b>İstanbul'dan:</b> ${U.kacis(h.istanbul)}</div>` : ''}
          ${m}
          ${h.ilgili_dersler && h.ilgili_dersler.length ? `<p class="hb-ders"><b>İlgili dersler:</b> ${dersLinkleri(h.ilgili_dersler)}</p>` : ''}
          <p class="kaynak">Kaynaklar: ${linkler(h.kaynaklar)}</p>
        </div>
      </details>
    </article>`;
  }

  function filtre() { const f = U.oku('haberFiltre', 'hepsi'); return f === 'hepsi' || kendi(TUR, f) ? f : 'hepsi'; }

  let oturumSon = null;    // bu oturumda bölüm ilk açıldığındaki son ziyaret: "Yeni" rozetleri oturum boyunca kalır
  function ciz() {
    const son = oturumSon;
    const f = filtre();
    const ls = V.haberler.filter(h => f === 'hepsi' || h.tur === f);
    const sayi = t => V.haberler.filter(h => t === 'hepsi' || h.tur === t).length;
    let ay = '', govde = '';
    ls.forEach(h => {
      const a = ayBasligi(h.tarih);
      if (a !== ay) { govde += `<h2 class="unite-bas hb-ay">${U.kacis(a)}</h2>`; ay = a; }
      govde += kartHtml(h, son);
    });
    el.innerHTML = `<h1>Haberler</h1>
      <p class="alt-baslik">Güncel astronomi haberleri ve araştırmalar, sade Türkçeyle. Her hafta güncellenir${V.guncelleme ? '; son güncelleme ' + U.kacis(gun(V.guncelleme)) : ''}.</p>
      <div class="cip-grup hb-filtre" role="group" aria-label="Haber türü">
        ${['hepsi', 'haber', 'arastirma', 'gorev', 'gokyuzu'].filter(t => t === 'hepsi' || sayi(t)).map(t => `<button type="button" class="dugme" data-f="${t}" aria-pressed="${t === f}">${t === 'hepsi' ? 'Tümü' : TUR[t].cogul} <span class="soluk">${sayi(t)}</span></button>`).join('')}
      </div>
      <div class="hb-liste">${govde || '<p class="bos">Bu türde haber yok.</p>'}</div>
      <p class="kaynak hb-not">Her haber en az iki kaynakla doğrulanır; ön baskılar (henüz hakem değerlendirmesinden geçmemiş makaleler) “Ön sonuç” diye işaretlidir. Altı noktalı çizili sözcüklere dokununca Astro sözlükteki tanımı açılır.</p>`;
  }

  /* Bir haber açılınca: sözlük işaretleri ve sesli okuma o habere bağlanır */
  function acildi(art) {
    const d = art.querySelector('details.hb-ac');
    const yazi = art.querySelector('.hb-ac-yazi');
    if (yazi) yazi.textContent = d.open ? 'Kapat' : 'Devamını oku';
    if (!d.open) return;
    if (!art.dataset.isaretli && window.Sozluk && typeof window.Sozluk.isaretle === 'function') {
      art.dataset.isaretli = '1';
      try { window.Sozluk.isaretle(art); } catch (e) { /* sözlük isteğe bağlı */ }
    }
    if (window.Ses && window.Ses.bagla) {
      const c = art.querySelector('.hb-ses');
      if (c) window.Ses.bagla(art, c, 'haber ' + art.dataset.id, { dugme: 'Haberi dinle' });
    }
  }

  function ac(id) {
    const art = el.querySelector(`article.haber[data-id="${CSS.escape(id)}"]`);
    if (!art) return false;
    const d = art.querySelector('details.hb-ac');
    if (!d.open) { d.open = true; acildi(art); }
    requestAnimationFrame(() => art.scrollIntoView({ block: 'start' }));
    return true;
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Haberler yükleniyor…</p>';
    try { V = await U.veri('haberler'); }
    catch (e) { el.innerHTML = '<div class="hata-kutu" role="alert">Haberler yüklenemedi: ' + U.kacis(e.message) + '. Başka bir sekmeye geçip dönünce yeniden denenir.</div>'; return false; }
    if (!Array.isArray(V.haberler)) V.haberler = [];
    if (oturumSon === null) oturumSon = sonZiyaret();
    V.haberler.sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)) || String(b.eklenme).localeCompare(String(a.eklenme)));
    U.veri('dersler').then(D => { (D.dersler || []).forEach(x => { dersAdlari[x.id] = x.baslik; }); el.querySelectorAll('.hb-ders a[data-ders]').forEach(a => { a.textContent = dersAdlari[a.dataset.ders] || a.textContent; }); }).catch(() => {});
    el.addEventListener('click', e => {
      const b = e.target.closest('.hb-filtre button'); if (!b) return;
      U.yaz('haberFiltre', b.dataset.f); ciz();
    });
    el.addEventListener('error', e => { const t = e.target; if (t && t.matches && t.matches('.hb-gorsel img')) t.closest('figure').hidden = true; }, true);   // çevrimdışı ya da eksik görsel
    el.addEventListener('toggle', e => { const art = e.target.closest && e.target.closest('article.haber'); if (art && e.target.matches('details.hb-ac')) acildi(art); }, true);
    ciz();
    goster(el, location.hash.split('/').slice(1).join('/'));
  }
  function goster(kok, param) {
    if (!V) return;
    if (param) ac(decodeURIComponent(param));
    /* Bu ziyaret görüldü: "Yeni" rozetleri sayfada kalır, bir sonraki ziyarette kalkar; sekmedeki nokta hemen söner */
    if (V.guncelleme && sonZiyaret() !== V.guncelleme) U.yaz('haberSon', V.guncelleme);   // ilk ziyarette hiçbir şey "yeni" sayılmaz
    noktaGuncelle();
  }
  /* Açılıştan biraz sonra (ilk çizim bittikten) yeni haber var mı diye bakılır */
  setTimeout(() => {
    U.veri('haberler').then(v => {
      const son = sonZiyaret();
      if (!son) return;
      const var_ = (v.haberler || []).some(h => yeniMi(h, son));
      document.querySelectorAll('[data-sekme="haber"]').forEach(a => a.classList.toggle('yeni-var', var_));
    }).catch(() => {});
  }, 2500);

  U.modul('haber', { ilk, goster });
})();
