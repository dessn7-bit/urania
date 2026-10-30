/* cizim.js — Ders çizimleri altyapısı. Her çizim bir kayıttır:
     UraniaCizim.ekle('d1-kure', { ders: 'd1', bolum: 1, baslik, aciklama, kaynak: [{ad, url}], oran: 0.62, ciz(S) })
   ciz(S) SVG içeriğini (dize) döndürür; tuval 400 birim genişlik, yükseklik 400 × oran.
   Yazı boyu en az 13 birim (telefonda ~11 px); başlık niteliğindeki etiketler 15–16.
   Renkler yalnız tema değişkenleriyle verilir (var(--...)); böylece kırmızı gece modunda kendiliğinden kızarır.
   "aciklama" şeklin sözlü anlatımıdır: ekranda alt yazıdır, sesli okumada ve ekran okuyucuda okunur (SVG gizlidir).
   Çizimdeki her sayı dersin kendi (kaynaklı) metninden ya da kaynak listesindeki sayfadan gelir; çizim ölçeksizse
   alt yazıda söylenir. Dosyalar: cizim.js (altyapı), cizim_gokyuzu.js, cizim_gunes_sistemi.js, cizim_yildizlar.js,
   cizim_gezegen_yasam.js, cizim_evren.js (üniteler), cizim_v3.js (d20–d24), cizim_v4a.js, cizim_v4b.js ve cizim_v4c.js (fizik ünitesi, d25–d33), cizim_v5a–d.js (ayrıntılı konu dersleri d34–d49), cizim_v6.js (kuramlar d50–d56), cizim_v7.js (d57, d58). */
(function () {
  'use strict';
  const kayit = {};
  const G = 400;                                   // tuval genişliği (SVG birimi); 390 px telefonda ~350 px → 1 birim ≈ 0,87 px (320 px'te ≈ 0,72)

  /* ---- Renk adları (tema değişkenleri) ---- */
  const R = {
    metin: 'var(--parsomen)', soluk: 'var(--soluk)', vurgu: 'var(--pirinc)', vurguSoluk: 'var(--pirinc-soluk)',
    cizgi: 'var(--cizgi)', zemin: 'var(--gece)', yuzey: 'var(--levha)', yuzey2: 'var(--levha-2)',
    iyi: 'var(--iyi)', uyari: 'var(--uyari)', gezegen: 'var(--gezegen)', ay: 'var(--ay)', yildiz: 'var(--yildiz)', mavi: 'var(--hedef)',
    gunes: 'var(--gezegen)', sicak: 'var(--hedef)', soguk: 'var(--uyari)'
  };
  const kac = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const n = x => Math.round(x * 100) / 100;      // kısa koordinat
  function stil(o, varsayilan) {
    o = Object.assign({}, varsayilan || {}, o || {});
    const p = [];
    if (o.renk) p.push(`stroke="${o.renk}"`);
    if (o.kalin != null) p.push(`stroke-width="${o.kalin}"`);
    p.push(`fill="${o.dolgu || 'none'}"`);
    if (o.saydam != null) p.push(`opacity="${o.saydam}"`);
    if (o.kesik) p.push(`stroke-dasharray="${o.kesik === true ? '5 5' : o.kesik}"`);
    if (o.uc) p.push(`stroke-linecap="${o.uc}"`);
    return p.join(' ');
  }

  /* ---- Çizim yardımcıları (S) ---- */
  const S = {
    R, G,
    sayi: (x, b, e) => window.Urania ? window.Urania.sayi(x, b, e) : String(x),
    cizgi: (x1, y1, x2, y2, o) => `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" ${stil(o, { renk: R.soluk, kalin: 1.5 })}/>`,
    yol: (d, o) => `<path d="${d}" ${stil(o, { renk: R.metin, kalin: 1.5 })}/>`,
    /* noktalar: [[x,y],...] → çoklu çizgi */
    egri: (ls, o) => `<polyline points="${ls.map(p => n(p[0]) + ',' + n(p[1])).join(' ')}" ${stil(o, { renk: R.metin, kalin: 2 })} stroke-linejoin="round"/>`,
    daire: (x, y, r, o) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" ${stil(o, { renk: R.soluk, kalin: 1.5 })}/>`,
    elips: (x, y, rx, ry, o, aci) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}"${aci ? ` transform="rotate(${aci} ${n(x)} ${n(y)})"` : ''} ${stil(o, { renk: R.soluk, kalin: 1.5 })}/>`,
    kutu: (x, y, w, h, o, r) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${r ? ` rx="${r}"` : ''} ${stil(o, { renk: R.cizgi, kalin: 1 })}/>`,
    /* yazı: o.boy (px, varsayılan 15), o.hiza: 'start'|'middle'|'end', o.renk, o.kalin (true → 600), o.yan (derece) */
    yazi: (x, y, metin, o) => {
      o = o || {};
      return `<text x="${n(x)}" y="${n(y)}" font-family="var(--sans)" font-size="${o.boy || 15}" text-anchor="${o.hiza || 'start'}" fill="${o.renk || R.metin}"${o.kalin ? ' font-weight="600"' : ''}${o.yan ? ` transform="rotate(${o.yan} ${n(x)} ${n(y)})"` : ''}${o.italik ? ' font-style="italic"' : ''}>${kac(metin)}</text>`;
    },
    /* Zeminli yazı: renkli/yarı saydam alanın üstündeki etiket okunaklı olsun (WCAG 1.4.3) diye arkasına yüzey renginde
       küçük bir levha. o.zemin: levha rengi (varsayılan yüzey). Genişlik yazı boyundan kestirilir (Plex ~0,52 em). */
    zeminliYazi: (x, y, metin, o) => {
      o = o || {};
      const boy = o.boy || 15, w = String(metin).length * boy * (o.kalin ? 0.56 : 0.52) + 10, h = boy + 6;
      const x0 = o.hiza === 'middle' ? x - w / 2 : o.hiza === 'end' ? x - w + 5 : x - 5;
      return S.kutu(x0, y - boy - 1, w, h, { dolgu: o.zemin || R.yuzey, renk: 'none' }, 3) + S.yazi(x, y, metin, o);
    },
    /* ok: (x1,y1) → (x2,y2), uçta üçgen */
    ok: (x1, y1, x2, y2, o) => {
      o = Object.assign({ renk: R.vurgu, kalin: 2, boy: 10 }, o || {});
      const a = Math.atan2(y2 - y1, x2 - x1), b = o.boy;
      const p1 = [x2 - b * Math.cos(a - 0.4), y2 - b * Math.sin(a - 0.4)], p2 = [x2 - b * Math.cos(a + 0.4), y2 - b * Math.sin(a + 0.4)];
      return S.cizgi(x1, y1, x2, y2, o) + `<polygon points="${n(x2)},${n(y2)} ${n(p1[0])},${n(p1[1])} ${n(p2[0])},${n(p2[1])}" fill="${o.renk}"/>`;
    },
    yay: (x, y, r, a1, a2, o) => {        // derece; 0 = sağ, saat yönünün tersi (matematik), SVG y aşağı olduğu için işaret çevrilir
      const p = a => [x + r * Math.cos(a * Math.PI / 180), y - r * Math.sin(a * Math.PI / 180)];
      const [x1, y1] = p(a1), [x2, y2] = p(a2), buyuk = Math.abs(a2 - a1) > 180 ? 1 : 0, yon = a2 > a1 ? 0 : 1;
      return `<path d="M${n(x1)},${n(y1)} A${n(r)},${n(r)} 0 ${buyuk} ${yon} ${n(x2)},${n(y2)}" ${stil(o, { renk: R.soluk, kalin: 1.5 })}/>`;
    },
    /* Grafik ekseni: alan {x, y, w, h} (piksel), aralık {x0, x1, y0, y1}, logX/logY; döndürür {X, Y, svg} */
    eksen: (alan, ar, o) => {
      o = o || {};
      const lx = !!o.logX, ly = !!o.logY;
      const fx = v => lx ? Math.log10(v) : v, fy = v => ly ? Math.log10(v) : v;
      const X = v => alan.x + (fx(v) - fx(ar.x0)) / (fx(ar.x1) - fx(ar.x0)) * alan.w;
      const Y = v => alan.y + alan.h - (fy(v) - fy(ar.y0)) / (fy(ar.y1) - fy(ar.y0)) * alan.h;
      let svg = S.cizgi(alan.x, alan.y + alan.h, alan.x + alan.w, alan.y + alan.h, { renk: R.soluk, kalin: 1 }) + S.cizgi(alan.x, alan.y, alan.x, alan.y + alan.h, { renk: R.soluk, kalin: 1 });
      (o.xIsaret || []).forEach(v => { const x = X(Array.isArray(v) ? v[0] : v); svg += S.cizgi(x, alan.y + alan.h, x, alan.y + alan.h + 5, { renk: R.soluk, kalin: 1 }) + S.yazi(x, alan.y + alan.h + 20, Array.isArray(v) ? v[1] : S.sayi(v, 2, 0), { boy: 13, hiza: 'middle', renk: R.soluk }); });
      (o.yIsaret || []).forEach(v => { const y = Y(Array.isArray(v) ? v[0] : v); svg += S.cizgi(alan.x - 5, y, alan.x, y, { renk: R.soluk, kalin: 1 }) + S.yazi(alan.x - 8, y + 4, Array.isArray(v) ? v[1] : S.sayi(v, 2, 0), { boy: 13, hiza: 'end', renk: R.soluk }); });
      if (o.xAd) svg += S.yazi(alan.x + alan.w / 2, alan.y + alan.h + 42, o.xAd, { boy: 14, hiza: 'middle', renk: R.soluk });
      if (o.yAd) svg += S.yazi(alan.x - (o.yAdUzak || 46), alan.y + alan.h / 2, o.yAd, { boy: 14, hiza: 'middle', renk: R.soluk, yan: -90 });
      return { X, Y, svg };
    },
    /* Fonksiyon eğrisi: f(x) → y, x0..x1 arası adım sayısıyla (eksen dönüşümleriyle) */
    fonk: (ek, f, x0, x1, adim, o, logX) => {
      const ls = [];
      for (let i = 0; i <= adim; i++) {
        const x = logX ? Math.pow(10, Math.log10(x0) + (Math.log10(x1) - Math.log10(x0)) * i / adim) : x0 + (x1 - x0) * i / adim;
        const y = f(x); if (isFinite(y)) ls.push([ek.X(x), ek.Y(y)]);
      }
      return S.egri(ls, o);
    },
    grup: (icerik, donus) => `<g${donus ? ` transform="${donus}"` : ''}>${icerik}</g>`
  };

  /* Kaynak bağlantısı: Urania yüklüyse onun denetimi; değilse (ör. önizleme) aynı kural burada: yalnız http(s), kaçışlı */
  const guvenliUrl = u => (window.Urania && window.Urania.guvenliUrl) ? window.Urania.guvenliUrl(u)
    : (/^https?:\/\//i.test(String(u || '')) ? kac(u).replace(/'/g, '&#39;') : '#');
  function ekle(id, tanim) { tanim.id = id; kayit[id] = tanim; }
  /* Bir dersin bir bölümüne ait çizimler (sıra: eklenme sırası) */
  function bolumCizimleri(ders, bolum) { return Object.values(kayit).filter(t => t.ders === ders && t.bolum === bolum); }
  function dersCizimleri(ders) { return Object.values(kayit).filter(t => t.ders === ders); }
  function svg(t) {
    const h = Math.round(G * (t.oran || 0.6));
    let ic = '';
    try { ic = t.ciz(S); } catch (e) { ic = S.yazi(G / 2, h / 2, 'Çizim hazırlanamadı', { hiza: 'middle', renk: R.soluk }); console.error('cizim ' + t.id, e); }
    /* SVG ekran okuyucudan gizli: aynı bilgi alt yazıda (başlık + sözlü anlatım) tek kez okunur */
    return `<svg viewBox="0 0 ${G} ${h}" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">${ic}</svg>`;
  }
  /* Ders sayfası için HTML: sekil numarası derste sırayla */
  function html(t, no) {
    const kaynak = (t.kaynak || []).filter(k => k && k.url);
    return `<figure class="cizim" id="cz-${kac(t.id)}">${svg(t)}
      <figcaption class="okunur" data-ses="${kac('Şekil ' + no + ': ' + t.baslik + '. ' + t.aciklama)}"><b>Şekil ${no}.</b> ${kac(t.baslik)}. <span>${kac(t.aciklama)}</span>${kaynak.length ? ` <span class="kucuk soluk">Kaynak: ${kaynak.map(k => `<a href="${guvenliUrl(k.url)}" target="_blank" rel="noopener">${kac(k.ad)}</a>`).join(', ')}</span>` : ''}</figcaption></figure>`;
  }

  window.UraniaCizim = { ekle, kayit, bolumCizimleri, dersCizimleri, svg, html, S };
})();
