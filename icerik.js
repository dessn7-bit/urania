/* icerik.js — içerik paketi (v50): takımyıldız mitleri, Türkçe geleneksel gök adları, dürbün tarifleri, yıldız bilgisi.
   Veri dosyaları (hepsi kaynaklı; kaynak ve lisans dosyaların içinde):
     veri/mitler.json            — E. M. Berens 1880 (kamu malı; Project Gutenberg #22381), Orion ve Ülker: Bulfinch 1855 (#4928)
     veri/turkce_gok_adlari.json — TDK Güncel Türkçe Sözlük; Hasanlı Garibova 2021 (TEKE Dergisi 10/3, s. 852–863)
     veri/hedef_tarifleri.json   — Steve Tonkin, The Binocular Sky (CC BY-NC-SA 3.0; veri/LICENSE-binocularsky.txt)
     veri/yildiz_bilgi.json      — CDS/SIMBAD ve Hipparcos (araclar/yildiz_bilgi.py)
   Bu modül yalnız gösterir: bilgi kutusu ek satırları (harita.js, ar.js), "Mit" paneli, hedef tarifleri (bulucu.js),
   ders notu (dersler.js). Veri gelmemişse işlevler boş döner; uygulama içeriksiz de çalışır. */
(function () {
  'use strict';
  const U = window.Urania;
  let veri = null, soz = null;
  const K = s => U.kacis(s);

  function yukle() {
    if (!soz) {
      soz = Promise.all(['mitler', 'turkce_gok_adlari', 'hedef_tarifleri', 'yildiz_bilgi', 'takimyildiz'].map(a => U.veri(a).catch(() => null))).then(([mit, adlar, tarif, yildiz, ty]) => {
        const v = { mit, adlar, tarif, yildiz, mitAnahtar: new Map(), adAnahtar: new Map(), yildizAd: new Map(), tyAd: new Map() };
        if (mit && Array.isArray(mit.mitler)) mit.mitler.forEach(m => (m.anahtar || []).forEach(a => { if (!v.mitAnahtar.has(a)) v.mitAnahtar.set(a, []); v.mitAnahtar.get(a).push(m); }));
        if (adlar && Array.isArray(adlar.cisimler)) adlar.cisimler.forEach(c => v.adAnahtar.set(c.anahtar, c));
        if (yildiz && yildiz.yildizlar) Object.values(yildiz.yildizlar).forEach(y => v.yildizAd.set(y.ad, y));
        if (Array.isArray(ty)) ty.forEach(t => v.tyAd.set(t.ad, t.k));
        veri = v;
        document.dispatchEvent(new CustomEvent('urania:icerik'));
        return v;
      });
    }
    return soz;
  }

  /* ---------- Türkçe geleneksel adlar ---------- */
  /* anahtar: 'hedef:M45', 'yildiz:Polaris', 'cisim:Venus', 'ty:UMa', 'samanyolu' → { tdk: [ad…], eski: [{ad, eser}…] } ya da null */
  function turkceAdlar(anahtar) {
    const c = veri && veri.adAnahtar.get(anahtar);
    if (!c) return null;
    const tdk = c.adlar.filter(a => a.kaynak === 'tdk').map(a => a.ad);
    const eski = c.adlar.filter(a => a.kaynak !== 'tdk').map(a => ({ ad: a.ad, eser: a.eser }));
    return { tdk, eski };
  }
  /* Düz metin (ses ve AR için): "Türkçe geleneksel adları: A, B (TDK); C (Kutadgu Bilig)." */
  function turkceAdMetni(anahtar) {
    const a = turkceAdlar(anahtar);
    if (!a) return '';
    const p = [];
    if (a.tdk.length) p.push(a.tdk.join(', ') + ' (TDK)');
    const eser = {};
    a.eski.forEach(x => { (eser[x.eser] = eser[x.eser] || []).push(x.ad); });
    Object.keys(eser).forEach(e => p.push(eser[e].join(', ') + ' (' + e + ')'));
    return p.length ? 'Türkçe geleneksel adları: ' + p.join('; ') + '.' : '';
  }
  function turkceAdSatiri(anahtar) {
    const m = turkceAdMetni(anahtar);
    return m ? '<span class="ic-satir ic-adlar">' + K(m) + '</span>' : '';
  }

  /* ---------- yıldız bilgisi ---------- */
  /* SIMBAD nesne türü açıklamalarının Türkçesi (yalnız verideki türler; terimler derslerdeki kullanımla aynı) */
  const TUR_AD = {
    'Spectroscopic Binary': 'tayfsal çift yıldız', 'Double or Multiple Star': 'çift ya da çoklu yıldız', 'Eclipsing Binary': 'örten çift yıldız',
    'delta Sct Variable': 'δ Scuti türü değişen yıldız', 'beta Cep Variable': 'β Cephei türü değişen yıldız', 'alpha2 CVn Variable': 'α² Canum Venaticorum türü değişen yıldız',
    'Classical Cepheid Variable': 'klasik Sefe türü değişen yıldız', 'Cepheid Variable': 'Sefe türü değişen yıldız', 'Mira Variable': 'Mira türü değişen yıldız',
    'Long-Period Variable': 'uzun dönemli değişen yıldız', 'Pulsating Variable': 'zonklayan değişen yıldız', 'BY Dra Variable': 'BY Draconis türü değişen yıldız',
    'RS CVn Variable': 'RS Canum Venaticorum türü değişen yıldız', 'Ellipsoidal Variable': 'elipsoidal değişen yıldız', 'gamma Dor Variable': 'γ Doradus türü değişen yıldız',
    'Variable Star': 'değişen yıldız', 'Be Star': 'Be yıldızı', 'Red Supergiant': 'kırmızı süperdev', 'Blue Supergiant': 'mavi süperdev', 'Yellow Supergiant': 'sarı süperdev',
    'Evolved Supergiant': 'süperdev', 'Red Giant Branch star': 'kırmızı dev kolu yıldızı', 'Wolf-Rayet': 'Wolf-Rayet yıldızı', 'Carbon Star': 'karbon yıldızı',
    'S Star': 'S türü yıldız', 'High Mass X-ray Binary': 'büyük kütleli X-ışını çifti', 'Horizontal Branch Star': 'yatay kol yıldızı', 'Emission-line Star': 'salma çizgili yıldız',
    'Chemically Peculiar Star': 'kimyasal bakımdan tuhaf yıldız', 'Young Stellar Object': 'genç yıldız'
  };
  function turMetni(y) {
    let ad = y.turAd || '', aday = false;
    if (/ Candidate$/.test(ad)) { ad = ad.replace(/ Candidate$/, ''); aday = true; }
    const tr = TUR_AD[ad];
    return tr ? tr + (aday ? ' adayı' : '') : '';
  }
  const ondalik = x => { const s = String(x); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
  function uzaklikMetni(u) {
    if (!u || !Number.isFinite(u.iy)) return '';
    const b = Math.min(3, ondalik(u.iy));
    if (u.aralik && Number.isFinite(u.alt)) {
      return 'uzaklık yaklaşık ' + U.sayi(u.alt, Math.min(3, ondalik(u.alt))) + (Number.isFinite(u.ust) ? '–' + U.sayi(u.ust, Math.min(3, ondalik(u.ust))) : ' ve üstü') + ' ışık yılı (paralaksı belirsiz)';
    }
    if (Number.isFinite(u.alt) && Number.isFinite(u.ust)) {
      const yari = (u.ust - u.alt) / 2, bh = Math.max(b, Math.min(3, ondalik(u.ust)));
      return 'uzaklık ' + U.sayi(u.iy, b) + ' ışık yılı (±' + U.sayi(yari, bh) + ')';
    }
    return 'uzaklık yaklaşık ' + U.sayi(u.iy, b) + ' ışık yılı';
  }
  /* Düz metin: "Tayf türü K1.5III · uzaklık 36,7 ışık yılı (±0,3) · tayfsal çift yıldız · …" */
  function yildizMetni(ad) {
    const y = veri && veri.yildizAd.get(ad);
    if (!y) return '';
    const p = [];
    if (y.tayf) p.push('tayf türü ' + y.tayf);
    const u = uzaklikMetni(y.uzaklik);
    if (u) p.push(u);
    const tur = turMetni(y);
    if (tur) p.push(tur);
    if (y.cift && !/çift/.test(tur)) p.push('çift yıldız kataloğunda kayıtlı (WDS)');
    if (y.degisen && !/değişen/.test(tur)) p.push('değişen yıldız');
    if (!p.length) return '';
    p[0] = p[0].charAt(0).toLocaleUpperCase('tr-TR') + p[0].slice(1);
    return p.join(' · ') + '. Kaynak: CDS/SIMBAD.';
  }
  function yildizSatiri(ad) {
    const m = yildizMetni(ad);
    return m ? '<span class="ic-satir ic-yildiz">' + K(m) + '</span>' : '';
  }

  /* ---------- mitler ---------- */
  function mitler(tyKisa) { return (veri && veri.mitAnahtar.get(tyKisa)) || []; }
  function tyKisa(ad) { return (veri && veri.tyAd.get(ad)) || null; }
  function mitDugmesi(anahtar) {
    return mitler(anahtar).length ? ' <button type="button" class="bag ic-mit-dugme" data-mit="' + K(anahtar) + '">Mit</button>' : '';
  }
  function kaynakMetni(m) {
    const k = (veri.mit.kaynaklar || {})[m.kaynak] || {};
    return (k.yazar || '') + ', ' + (k.eser || '') + ' (' + (k.yil || '') + ')' + (m.bolum ? ', “' + m.bolum + '” bölümü' : '') + (m.sayfa ? ', s. ' + m.sayfa : '');
  }
  /* Sesli okuma metni: başlık + anlatı + kaynak (eksiksiz) */
  function mitSesi(m) {
    const k = (veri.mit.kaynaklar || {})[m.kaynak] || {};
    return m.baslik + '. ' + m.metin + ' Kaynak: ' + (k.yazar || '') + ', ' + (k.yil || '') + '.' + (m.goge_konma ? '' : ' Kitap bu öyküyü gökyüzüne bağlamaz.');
  }
  /* Mit paneli: kap içine yazar; kapatılınca odak "acan" öğesine döner */
  function mitAc(kap, anahtar, acan) {
    const ls = mitler(anahtar);
    if (!ls.length || !kap) return false;
    const ad = anahtar === 'M45' ? 'Ülker' : ((veri.mit && [...veri.tyAd.entries()].find(e => e[1] === anahtar)) || [anahtar])[0];
    kap.innerHTML = `<section class="mit-kutu" aria-labelledby="${K(kap.id)}Bas">
      <div class="mit-ust"><h3 id="${K(kap.id)}Bas" tabindex="-1">Mit: ${K(ad)}</h3><button type="button" class="dugme" data-mit-kapat>Kapat</button></div>
      ${ls.map((m, i) => {
        const k = (veri.mit.kaynaklar || {})[m.kaynak] || {};
        return `<article class="mit-anlati"><h4>${K(m.baslik)}</h4>
        <p class="mit-metin okunur" data-ses="${K(mitSesi(m))}">${K(m.metin)}</p>
        <p class="kaynak">Kaynak: ${K(kaynakMetni(m))}; <a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">Project Gutenberg</a> metninden Urania için Türkçeye aktarıldı (kamu malı).${m.goge_konma ? '' : ' Kitap bu öyküyü bir takımyıldıza bağlamaz; eşleme Urania\'nındır.'}${m.kisa ? ' Kitaptaki bölüm kısadır; anlatıya bir şey eklenmedi.' : ''}</p>
        ${window.Ses && Ses.destek ? `<button type="button" class="dugme" data-mit-dinle="${i}">Dinle</button>` : ''}</article>`;
      }).join('')}
    </section>`;
    kap.hidden = false;
    const kapat = () => {
      if (window.Ses && Ses.sus) { try { Ses.sus(); } catch (h) { /* ses yok */ } }
      kap.hidden = true; kap.innerHTML = '';
      if (acan && acan.isConnected && typeof acan.focus === 'function') acan.focus();
    };
    kap.querySelector('[data-mit-kapat]').addEventListener('click', kapat);
    kap.querySelectorAll('[data-mit-dinle]').forEach(b => b.addEventListener('click', () => { if (window.Ses) Ses.soyle(mitSesi(ls[Number(b.dataset.mitDinle)])); }));
    kap.querySelector('h3').focus({ preventScroll: true });
    if (kap.scrollIntoView) kap.scrollIntoView({ block: 'nearest' });
    return true;
  }

  /* ---------- dürbün tarifleri (Binocular Sky) ---------- */
  function tarif(hedefId) { return (veri && veri.tarif && veri.tarif.tarifler && veri.tarif.tarifler[hedefId]) || null; }
  function tarifHtml(hedefId) {
    const t = tarif(hedefId);
    if (!t) return '';
    const kaynak = `<p class="kaynak">Kaynak: Steve Tonkin, <a href="${U.guvenliUrl(t.sayfa)}" target="_blank" rel="noopener">The Binocular Sky</a> (CC BY-NC-SA 3.0); Urania için Türkçeye çevrildi. Tarif 50 mm dürbün ve 5° alan için yazılmıştır; 7×50'nin alanı daha geniştir (6,4°), büyütmesi daha azdır.${t.ortak ? ' ' + K(t.ortak) : ''}</p>`;
    return `<details class="aciklama ic-tarif"><summary>Nasıl bulunur</summary><p class="okunur" data-ses="${K('Nasıl bulunur. ' + t.nasil)}">${K(t.nasil)}</p>${kaynak}</details>
      <details class="aciklama ic-tarif"><summary>Ne görürsün</summary><p class="okunur" data-ses="${K('Ne görürsün. ' + t.ne)}">${K(t.ne)}</p>${kaynak}</details>`;
  }

  /* ---------- ders notu ---------- */
  /* İlgili derslerin sonuna kısa not: hangi cisimlerin adları gösterilecek */
  const DERS_NOT = {
    d21: ['hedef:M45', 'yildiz:Polaris', 'ty:UMa', 'ty:UMi', 'samanyolu'],
    d9: ['cisim:Mercury', 'cisim:Venus', 'cisim:Mars', 'cisim:Jupiter', 'cisim:Saturn'],
    d35: ['cisim:Mercury', 'cisim:Venus'], d36: ['cisim:Mars'], d37: ['cisim:Jupiter'], d38: ['cisim:Saturn'], d10: ['cisim:Moon']
  };
  function dersNotu(dersId) {
    const ls = DERS_NOT[dersId];
    if (!ls || !veri || !veri.adlar) return '';
    const satir = ls.map(a => { const c = veri.adAnahtar.get(a), m = turkceAdMetni(a); return c && m ? `<li><b>${K(c.cisim)}</b>: ${K(m.replace(/^Türkçe geleneksel adları: /, ''))}</li>` : ''; }).filter(Boolean);
    if (!satir.length) return '';
    const k = veri.adlar.kaynaklar || {}, g = k.garibova2021 || {};
    return `<aside class="ic-ders-not" aria-labelledby="icDersNot"><h3 id="icDersNot">Türkçe geleneksel adlar</h3><ul>${satir.join('')}</ul>
      <p class="kaynak">Kaynak: <a href="https://sozluk.gov.tr/" target="_blank" rel="noopener">TDK Güncel Türkçe Sözlük</a>; ${K(g.yazar || '')} (${K(String(g.yil || ''))}), ${K(g.dergi || '')} ${K(g.cilt_sayi || '')}, s. ${K(g.sayfalar || '')} (<a href="${U.guvenliUrl(g.url)}" target="_blank" rel="noopener">DergiPark</a>).</p></aside>`;
  }

  window.Icerik = { yukle, hazir: () => !!veri, turkceAdlar, turkceAdMetni, turkceAdSatiri, yildizMetni, yildizSatiri, uzaklikMetni, mitler, tyKisa, mitDugmesi, mitAc, mitSesi, tarif, tarifHtml, dersNotu };
})();
