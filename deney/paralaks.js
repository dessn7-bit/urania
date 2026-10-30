/* deney/paralaks.js — Yıldızlara uzaklık: ıraklık (paralaks). Dünya Güneş'in çevresinde dönerken yakın bir yıldız
   uzak yıldızlara göre küçük bir elips (burada tutulum düzleminde: bir çizgi) çizer; açının yarısı p ise uzaklık
   d (parsek) = 1 / p (yay saniyesi). Örnek yıldızların ıraklıkları veri/deney/paralaks.json'dan (kaynaklı);
   parsek, ışık yılı ve AB veri/fizik.json'dan. */
(function () {
  'use strict';
  const IKI_PI = Math.PI * 2;
  const YS_RAD = Math.PI / 648000;                     // 1 yay saniyesi radyan cinsinden

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* d (parsek) = 1 / p (yay saniyesi) ve tersi */
    iraklik(dPc) { return 1 / dPc; },
    uzaklik(pYs) { return 1 / pYs; },
    /* 1 parsek kaç AB: 648.000/π (IAU 2015 B2 tanımı) */
    abParsek() { return 648000 / Math.PI; },
    /* parsekten ışık yılına: pc ve ışık yılı metre cinsinden verilir */
    isikYili(dPc, pcM, lyM) { return dPc * pcM / lyM; },
    /* çapı capM olan bir cisim p yay saniyesi açıyla hangi uzaklıktan görünür (m) */
    paraUzakligi(capM, pYs) { return capM / (pYs * YS_RAD); },
    /* göreli hata: σ / p (aynı birimde) */
    goreliHata(sigma, p) { return sigma / p; },
    /* t yıl kesrinde (0: A noktası) yıldızın gökteki kayması, p birimiyle: tutulum düzlemindeki yıldız için −cos(2πt) */
    kayma(t) { return -Math.cos(IKI_PI * t); }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).paralaks = H;

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).paralaks = function (kap, o) {
    const U = o.U, v = o.veri || {};
    const orn = v.ornekler || [], para = v.madeni_para || {}, gaia = v.gaia || {}, yer = v.yer_siniri || {}, durbun = v.durbun || {};
    const PC = o.deger('pc'), LY = o.deger('ly');
    const DMIN = 0, DMAX = 4.5;                          // log10(parsek): 1 pc … 31.600 pc
    const tek = ls => ls.filter((k, i, a) => k && k.url && a.findIndex(x => x.url === k.url) === i);
    const linkler = ls => tek(ls).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ');
    const kaynakTum = [].concat(...orn.map(x => x.kaynaklar || []), para.kaynaklar || [], gaia.kaynaklar || [], yer.kaynaklar || [], durbun.kaynaklar || [], v.kaynaklar || []);
    kap.innerHTML = `
      <div class="cip-grup" id="prOn">${orn.map((x, i) => `<button type="button" class="dugme" data-i="${i}" aria-pressed="${i === 0}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="prKanvas"></canvas></div>
      <div class="kontroller">
        ${o.kaydirici('prUzak', 'Yıldızın uzaklığı (parsek, logaritmik ölçek)', DMIN, DMAX, 'any', 0)}
        ${o.azHareket ? o.kaydirici('prZaman', 'Yılın zamanı (Dünya A noktasındayken 0)', 0, 1, 'any', 0) : ''}
      </div>
      ${o.olcumler([['prP', 'Iraklık açısı p'], ['prD', 'Uzaklık (d = 1 / p)'], ['prIy', 'Işık yılı cinsinden'], ['prAb', 'AB cinsinden (Dünya–Güneş uzaklığı = 1)'], ['prPara', `1 liralık madeni para (${U.sayi(para.cap_mm, 2)} mm) bu açıyla görünür`], ['prKim', 'Kim ölçebilir?']])}
      <div class="deney-metin" id="prMetin"></div>
      <p class="kaynak">Çizim ölçekli değildir: açılar on binlerce ile milyarlarca kat büyütüldü ve yıldızın çizimdeki uzaklığı gerçek uzaklığın logaritmasıyla büyür. Yıldız Dünya'nın yörünge düzleminde (tutulumda) varsayıldı; bu yüzden gökte bir çizgi boyunca gidip gelir. Tutulumdan uzaktaki yıldızlar elips, tutulum kutbundakiler daire çizer. Dünya'nın yörüngesi dairesel alındı; yıldızların kendi hareketi (öz hareket) ve bütün yıldızları birlikte kaydıran ışık sapması ayrıca vardır, ıraklık yalnız yakın yıldızın uzak yıldızlara göre farkıdır. Kaynaklar: ${o.kaynakSatiri(['pc', 'ly', 'au']).replace(/^<p class="kaynak">Kaynaklar: |<\/p>$/g, '')} · ${linkler(kaynakTum)}</p>`;
    const S = id => kap.querySelector('#' + id);
    const cv = S('prKanvas'), uS = S('prUzak');
    let secili = 0, st = {}, faz = 0;
    /* arka plan yıldızları (aynı tohum aynı dağılım; yalnız süs) */
    const rast = (() => { let s = 20261030 >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
    const arka = Array.from({ length: 46 }, () => ({ x: rast(), y: rast(), r: 0.6 + rast() * 1.1 }));

    function onAyar(i) {
      const x = orn[i]; if (!x) return;
      secili = i;
      uS.value = Math.log10(1000 / x.iraklik_mas);
      kap.querySelectorAll('#prOn button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)));
      hesapla();
    }
    function pYaz(p) {
      const mas = p * 1000;
      return p >= 0.1 ? U.sayi(p, 4) + ' yay saniyesi (' + U.sayi(mas, 1) + ' mas)'
        : U.sayi(mas, mas < 1 ? 3 : mas < 10 ? 2 : 1) + ' miliyay saniyesi (mas)';
    }
    function uzunYaz(km) { return km < 10 ? U.sayi(km, 1) + ' km öteden' : U.sayi(km, 0) + ' km öteden'; }
    function hesapla() {
      const d = Math.pow(10, Number(uS.value)), p = H.iraklik(d), mas = p * 1000;
      const ly = H.isikYili(d, PC, LY), ab = d * H.abParsek();
      const paraKm = H.paraUzakligi(para.cap_mm / 1e3, p) / 1e3;
      const gA = H.goreliHata(gaia.sigma_mas_alt, mas), gU = H.goreliHata(gaia.sigma_mas_ust, mas);
      st = { d, p, mas, ly, ab, paraKm, gA, gU };
      S('prUzakCikti').textContent = U.sayi(d, d < 10 ? 3 : d < 1000 ? 1 : 0) + ' pc';
      S('prP').textContent = pYaz(p);
      S('prD').textContent = U.sayi(d, d < 10 ? 3 : d < 1000 ? 1 : 0) + ' parsek';
      S('prIy').textContent = U.sayi(ly, ly < 100 ? 2 : 0) + ' ışık yılı';
      S('prAb').textContent = ab < 1e8 ? U.sayi(ab, 0) + ' AB' : U.bilimsel(ab, 3) + ' AB';
      S('prPara').textContent = uzunYaz(paraKm);
      const yuzde = f => '%' + U.sayi(f * 100, f < 0.001 ? 3 : f < 0.1 ? 2 : 0);
      S('prKim').textContent = p >= yer.p_ys ? 'Yerden de ölçülür'
        : (gU <= 0.1 ? 'Yalnız uzaydan (Gaia, hata ' + yuzde(gA) + '–' + yuzde(gU).replace('%', '') + ')'
          : 'Gaia bile zorlanır (hata ' + yuzde(gA) + '–' + yuzde(gU).replace('%', '') + ')');
      metin();
    }
    function metin() {
      const x = orn[secili], p = st.p;
      const oran = durbun.ys / p;
      const ozel = x && x.not ? `<p>${U.kacis(x.not)}</p>` : '';
      S('prMetin').innerHTML = `<p>Dünya, Güneş'in çevresinde 1 AB (astronomik birim, Dünya–Güneş uzaklığı) yarıçaplı yörüngesinde dolanırken yakın yıldıza altı ay arayla yörüngenin iki ucundan, A'dan ve B'den bakar. İki bakış doğrultusu arasındaki açının yarısına ıraklık açısı (p) denir: yıldızdan bakınca 1 AB'lik uzunluğun göründüğü açıdır. Bu yıldızda p = ${pYaz(p)}; gökteki toplam gidip gelme bunun iki katı.</p>
        <p>Parsek bu tanımdan gelir: 1 parsek, ıraklığın tam 1 yay saniyesi olduğu uzaklıktır, yani yaklaşık 206.265 AB ya da 3,26 ışık yılı. Açı küçüldükçe yıldız uzaklaşır: d = 1 / p. Bu yıldız ${U.sayi(st.d, st.d < 10 ? 3 : 0)} parsek uzakta; ıraklığı, ${U.sayi(para.cap_mm, 2)} mm'lik bir 1 liranın ${uzunYaz(st.paraKm)} göründüğü açı kadar.</p>
        ${ozel}
        <p>${p >= yer.p_ys ? `Yerden yapılan ölçümler hava titreşimi yüzünden yaklaşık ${U.sayi(yer.p_ys, 2)} yay saniyesinin altına inemez; bu da yaklaşık ${U.sayi(1 / yer.p_ys, 0)} parseğe kadar demektir. Bu yıldız o sınırın içinde.` : `Bu açı yerden ölçülebilecek en küçük açıdan (yaklaşık ${U.sayi(yer.p_ys, 2)} yay saniyesi, yani ${U.sayi(1 / yer.p_ys, 0)} parsek) küçük: atmosferin titreşimi yıldızın görüntüsünü bundan çok daha fazla bulandırır. Bu yüzden Hipparcos ve Gaia gibi uydular atmosferin dışından ölçer. Gaia'nın parlak yıldızlarda (G < 15) ıraklık hatası ${U.sayi(gaia.sigma_mas_alt, 2)}–${U.sayi(gaia.sigma_mas_ust, 2)} mas; burada bu, ölçülen açının %${U.sayi(st.gA * 100, st.gA < 0.1 ? 1 : 0)}–${U.sayi(st.gU * 100, st.gU < 0.1 ? 1 : 0)} kadarı.`}</p>
        <p>7×50 dürbünle bu kaymayı göremezsin: dürbün 7 kat büyütür, gözün ayırma gücü yaklaşık 1 yay dakikası (60″) olduğu için gökte en çok yaklaşık ${U.sayi(durbun.ys, 1)} yay saniyesini seçersin. Bu yıldızın ıraklığı bunun ${oran < 1000 ? U.sayi(oran, 0) : U.bilimsel(oran, 2)} kat küçüğü.</p>`;
    }

    /* ---- çizim: üstte yukarıdan görünüş, altta gökteki görüntü ---- */
    function ciz(dt) {
      if (!o.azHareket) faz = (faz + (dt || 0) / 12) % 1;            // bir yıl ekranda 12 saniye
      else {
        const g = S('prZaman'); faz = g ? Number(g.value) % 1 : 0;
        const c = S('prZamanCikti'), m = U.sayi(faz * 12, 1) + ' ay';
        if (c && c.textContent !== m) c.textContent = m;
      }
      const { ctx, w, h } = o.kanvas(cv, 0.8);
      const kir = document.documentElement.classList.contains('kirmizi');
      ctx.clearRect(0, 0, w, h);
      const hT = h * 0.66, cx = w / 2, yB = 24;
      const rO = Math.min(w * 0.12, hT * 0.12), yS = hT - rO - 18;
      const Dmin = rO * 1.4, Dmax = yS - yB - 22;
      const f = (Number(uS.value) - DMIN) / (DMAX - DMIN);
      const Dc = Dmin + (Dmax - Dmin) * Math.max(0, Math.min(1, f));
      const sx = cx, sy = yS - Dc;
      /* uzak yıldızlar şeridi */
      ctx.fillStyle = o.renk('--yildiz');
      arka.forEach(a => { ctx.beginPath(); ctx.arc(6 + a.x * (w - 12), yB - 10 + a.y * 10, a.r, 0, IKI_PI); ctx.fill(); });
      ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'left';
      o.etiket(ctx, 'uzak yıldızlar', 6, yB + 14);
      /* yörünge, Güneş, A ve B */
      ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(cx, yS, rO, 0, IKI_PI); ctx.stroke();
      const ax = cx - rO, bx = cx + rO;
      /* A ve B'den bakış doğruları (kesik), uzak yıldızlara kadar */
      const uzat = (x0, y0) => { const k = (y0 - yB) / (y0 - sy); return [x0 + (sx - x0) * k, yB]; };
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1;
      [ax, bx].forEach(x0 => { const [ex, ey] = uzat(x0, yS); ctx.beginPath(); ctx.moveTo(x0, yS); ctx.lineTo(ex, ey); ctx.stroke(); });
      ctx.restore();
      /* Güneş–A çizgisi (1 AB) ve yıldızdan Güneş'e çizgi */
      ctx.strokeStyle = o.renk('--pirinc-soluk'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, yS); ctx.lineTo(sx, sy); ctx.stroke();
      ctx.strokeStyle = o.renk('--pirinc'); ctx.beginPath(); ctx.moveTo(cx, yS); ctx.lineTo(ax, yS); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, yS, 7, 0, IKI_PI); ctx.fillStyle = '#FFD27A'; ctx.fill();
      ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 12px Plex, sans-serif'; ctx.textAlign = 'left';
      o.etiket(ctx, 'Güneş', cx + 10, yS + 19);
      ctx.textAlign = 'center';
      o.etiket(ctx, '1 AB', (cx + ax) / 2 - 4, yS + 17);
      [[ax, 'A'], [bx, 'B']].forEach(([x0, ad]) => {
        ctx.beginPath(); ctx.arc(x0, yS, 4.5, 0, IKI_PI); ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.3; ctx.stroke();
        ctx.fillStyle = o.renk('--parsomen'); ctx.font = '600 12px Plex, sans-serif'; ctx.textAlign = x0 < cx ? 'right' : 'left';
        o.etiket(ctx, ad === 'B' ? 'B (6 ay sonra)' : ad, x0 + (x0 < cx ? -9 : 9), yS + 4);
      });
      /* Dünya şu an ve bakış doğrusu */
      const ex = cx - rO * Math.cos(IKI_PI * faz), ey = yS + rO * Math.sin(IKI_PI * faz);
      const [lx, ly] = uzat(ex, ey);
      ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(lx, ly); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 5, 0, IKI_PI); ctx.fillStyle = kir ? '#B03020' : '#6FA8DC'; ctx.fill();
      ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1; ctx.stroke();
      /* ıraklık açısı p: yıldızda, Güneş'e ve A'ya giden doğrular arasında */
      const aSun = Math.PI / 2, aA = Math.atan2(yS - sy, ax - sx), rp = Math.min(30, Dc * 0.7);
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.arc(sx, sy, rp, aSun, aA); ctx.closePath();
      ctx.fillStyle = 'rgba(200,164,93,.38)'; ctx.fill(); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = o.renk('--pirinc'); ctx.font = 'italic 600 13px Plex, sans-serif'; ctx.textAlign = 'right';
      o.etiket(ctx, 'p', sx - rp * Math.cos(aA) * -1 - 4 - rp * 0.35, sy + rp * 0.85);
      /* yakın yıldız: halkalı */
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, IKI_PI); ctx.fillStyle = o.renk('--yildiz'); ctx.fill();
      ctx.beginPath(); ctx.arc(sx, sy, 9, 0, IKI_PI); ctx.strokeStyle = o.renk('--yildiz'); ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = o.renk('--parsomen'); ctx.font = '600 12px Plex, sans-serif'; ctx.textAlign = 'left';
      o.etiket(ctx, orn[secili] ? orn[secili].kisa : 'yakın yıldız', sx + 14, sy + 4);
      /* abartı notu */
      const ciz2 = Math.atan(rO / Dc), kat = ciz2 / (st.p * YS_RAD);
      ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'left';
      const not1 = 'Ölçekli değil: açı', not2 = '≈ ' + U.bilimsel(kat, 2) + ' kat büyütüldü';
      o.etiket(ctx, not1, 6, hT - 22); o.etiket(ctx, not2, 6, hT - 8);
      /* ---- alt panel: gökteki görünüş ---- */
      const py0 = hT + 4, ph = h - py0 - 4;
      ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, hT); ctx.lineTo(w, hT); ctx.stroke();
      ctx.fillStyle = o.renk('--yildiz');
      arka.forEach(a => { ctx.beginPath(); ctx.arc(6 + ((a.x * 7.3) % 1) * (w - 12), py0 + 22 + ((a.y * 5.1) % 1) * (ph - 30), a.r, 0, IKI_PI); ctx.fill(); });
      const aMax = Math.atan(rO / Dmin), yar = w * 0.38;
      const alfa = Math.atan2(sx - ex, ey - sy);                    // drawn yön farkı (Güneş'ten bakışa göre)
      const uc = Math.atan(rO / Dc) / aMax * yar;
      const my = py0 + ph * 0.58, mx = cx + alfa / aMax * yar;
      ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - uc, my); ctx.lineTo(cx + uc, my); ctx.stroke(); ctx.restore();
      [[cx + uc, 'A'], [cx - uc, 'B']].forEach(([x0]) => { ctx.beginPath(); ctx.moveTo(x0, my - 5); ctx.lineTo(x0, my + 5); ctx.strokeStyle = o.renk('--soluk'); ctx.stroke(); });
      ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, IKI_PI); ctx.fillStyle = o.renk('--yildiz'); ctx.fill();
      ctx.beginPath(); ctx.arc(mx, my, 8.5, 0, IKI_PI); ctx.strokeStyle = o.renk('--yildiz'); ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'left';
      o.etiket(ctx, 'Gökte görünüş (kayma abartılı)', 6, py0 + 13);
      ctx.textAlign = 'right';
      o.etiket(ctx, 'iki uç arası 2p = ' + (st.p >= 0.05 ? U.sayi(2 * st.p, 3) + '″' : U.sayi(2 * st.mas, st.mas < 1 ? 3 : 2) + ' mas'), w - 6, h - 8);
    }
    uS.addEventListener('input', () => {
      if (secili >= 0) { secili = -1; kap.querySelectorAll('#prOn button').forEach(b => b.setAttribute('aria-pressed', 'false')); }
      hesapla();
    });
    S('prOn').addEventListener('click', e => { const b = e.target.closest('button'); if (b) onAyar(Number(b.dataset.i)); });
    onAyar(0);
    return o.dongu(ciz);
  };
})();
