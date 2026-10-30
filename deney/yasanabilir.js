/* deney/yasanabilir.js — Yaşanabilir bölge: yıldızın çevresinde, Dünya benzeri bir gezegenin yüzeyinde sıvı su
   olabilecek kuşak (Kopparapu vd. 2014 sınırları), gezegenin aldığı ışık ve denge sıcaklığı. Sayılar
   veri/deney/yasanabilir.json'dan, sabitler fizik.json'dan (kaynaklı). */
(function () {
  'use strict';
  const IKI_PI = Math.PI * 2;

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* Kopparapu vd. (2014) denk. 4: S_eff = S_eff☉ + aT⋆ + bT⋆² + cT⋆³ + dT⋆⁴, T⋆ = T_eff − 5780 K.
       Formül 2600–7200 K için geçerli; dışında sınır değeri kullanılır (sinirDisi: true). k = {S0, a, b, c, d} */
    seff(k, teff, tMin, tMax) {
      const lo = tMin || 2600, hi = tMax || 7200;
      const t = Math.min(hi, Math.max(lo, teff)) - 5780;
      return { deger: k.S0 + k.a * t + k.b * t * t + k.c * t * t * t + k.d * t * t * t * t, sinirDisi: teff < lo || teff > hi };
    },
    /* Kopparapu vd. (2014) denk. 5: d = √((L/L☉) / S_eff) AB */
    uzaklik(L, seff) { return Math.sqrt(L / seff); },
    /* Dört sınır (AB): katsayılar dizisi [{anahtar, S0, a, b, c, d}] */
    sinirlar(ks, L, teff, tMin, tMax) {
      const s = {}; let disi = false;
      ks.forEach(k => { const r = H.seff(k, teff, tMin, tMax); s[k.anahtar] = H.uzaklik(L, r.deger); disi = disi || r.sinirDisi; });
      s.sinirDisi = disi;
      return s;
    },
    /* Gezegenin aldığı ışık, Dünya'nınkine göre: S/S⊕ = (L/L☉) / (a/AB)² */
    aki(L, a) { return L / (a * a); },
    /* Denge sıcaklığı: T_eq = [L(1 − A) / (16πσd²)]^¼ (L watt, d metre) */
    teq(Lw, d, A, sigma) { return Math.pow(Lw * (1 - A) / (16 * Math.PI * sigma * d * d), 0.25); },
    /* Gezegen bölgenin neresinde: 'sicak' | 'iyimser-ic' | 'temkinli' | 'iyimser-dis' | 'soguk' */
    konum(a, s) {
      if (a < s.venus) return 'sicak';
      if (a < s.kacak) return 'iyimser-ic';
      if (a <= s.maks) return 'temkinli';
      if (a <= s.mars) return 'iyimser-dis';
      return 'soguk';
    }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).yasanabilir = H;

  const KONUM_AD = { sicak: 'Bölgenin içinde değil: çok sıcak taraf', 'iyimser-ic': 'Yalnız iyimser bölgede (sıcak kenar)', temkinli: 'Temkinli bölgenin içinde', 'iyimser-dis': 'Yalnız iyimser bölgede (soğuk kenar)', soguk: 'Bölgenin içinde değil: çok soğuk taraf' };
  function yildizRengi(t) {
    if (t > 7500) return '#F1F3FF'; if (t > 6000) return '#FFF4E0'; if (t > 5200) return '#FFE8B0'; if (t > 3700) return '#FFC98C'; return '#FF9E6A';
  }
  /* Ölçek çubuğu için güzel adım: 1, 2, 5 × 10ⁿ */
  function guzelAdim(x) { const u = Math.pow(10, Math.floor(Math.log10(x))), f = x / u; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * u; }

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).yasanabilir = function (kap, o) {
    const U = o.U, V = o.veri || {};
    const Lg = o.deger('L_gunes'), AU = o.deger('au'), sigma = o.deger('sigma'), Tg = o.deger('T_gunes');
    const KP = V.kopparapu || {}, ks = KP.sinirlar || [];
    const tMin = KP.teff_min || 2600, tMax = KP.teff_max || 7200;
    const orn = (V.ornekler || []).map(x => ({ ad: x.ad, L: x.yildiz === 'gunes' ? 1 : x.l_gunes, T: x.yildiz === 'gunes' ? Tg : x.teff_k, a: x.a_ab, A: x.albedo, yildiz: x.yildiz_ad || 'Güneş', gezegen: x.gezegen_ad }));
    const gunes = H.sinirlar(ks, 1, Tg, tMin, tMax);
    const lg = Math.log10;
    kap.innerHTML = `
      <div class="cip-grup" id="ybOn">${orn.map((x, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="ybKanvas"></canvas></div>
      <div class="kontroller">
        ${o.kaydirici('ybL', 'Yıldızın ışıma gücü (Güneş = 1)', -4, 2, 'any', 0)}
        ${o.kaydirici('ybT', 'Yıldızın yüzey sıcaklığı', 2300, 7500, 1, Math.round(Tg))}
        ${o.kaydirici('ybA', 'Gezegenin yıldıza uzaklığı', lg(0.005), lg(20), 'any', 0)}
        ${o.kaydirici('ybAlb', 'Gezegenin yansıttığı ışık payı (Bond albedosu)', 0, 0.9, 0.001, 0.294)}
      </div>
      ${o.olcumler([['ybS', 'Aldığı ışık (Dünya = 1)'], ['ybTeq', 'Denge sıcaklığı'], ['ybHZ', 'Yaşanabilir bölge (temkinli)'], ['ybHZi', 'İyimser sınırlar'], ['ybDurum', 'Gezegen nerede']])}
      <div class="deney-metin" id="ybMetin"></div>
      <p class="kaynak">Sınırlar Kopparapu ve arkadaşlarının 2014 formülüyle, Dünya kütleli bir gezegen için: temkinli bölge kaçak sera (iç) ile en büyük sera (dış) sınırı arası, iyimser bölge “yakın geçmişteki Venüs” ile “erken Mars” arası. Formül 2.600–7.200 K yüzey sıcaklığı için geçerli; bulutsuz bir iklim modelinden gelir. Güneş için 2013 makalesinde iç kenar 0,99 AB idi (su kaybı sınırı), 2014 güncellemesinde 0,95 AB. Denge sıcaklığı T = [L(1 − A)/(16πσd²)]^¼: gezegen bütün yüzeyinden kara cisim gibi ışıyor, atmosferin sera etkisi yok sayılıyor. Yörünge dairesel. Üstteki çizim doğrusal ölçekli; alttaki şerit logaritmik (her bölme 10 kat). Kaynaklar: ${(V.kaynaklar || []).filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ')}</p>`;
    const cv = kap.querySelector('#ybKanvas');
    const S = id => kap.querySelector('#' + id);
    let st = {}, ad = { yildiz: 'Güneş', gezegen: 'Dünya' };
    function ab(x) { return U.sayi(x, x < 0.1 ? 4 : x < 10 ? 2 : 1); }
    function hesapla() {
      const L = Math.pow(10, Number(S('ybL').value)), T = Number(S('ybT').value), a = Math.pow(10, Number(S('ybA').value)), A = Number(S('ybAlb').value);
      const s = H.sinirlar(ks, L, T, tMin, tMax);
      const aki = H.aki(L, a), teq = H.teq(L * Lg, a * AU, A, sigma), yer = H.konum(a, s);
      st = { L, T, a, A, s, aki, teq, yer };
      S('ybLCikti').textContent = L >= 0.1 ? U.sayi(L, L < 10 ? 3 : 1) + ' L☉' : U.bilimsel(L, 3) + ' L☉';
      S('ybTCikti').textContent = U.sayi(T, 0) + ' K';
      S('ybACikti').textContent = ab(a) + ' AB';
      S('ybAlbCikti').textContent = U.sayi(A, 3);
      S('ybS').textContent = U.sayi(aki, aki < 10 ? 2 : 1) + ' (' + U.sayi(aki * Lg / (4 * Math.PI * AU * AU), 0) + ' W/m²)';
      S('ybTeq').textContent = U.sayi(teq, 0) + ' K (' + (teq - 273.15 < -0.5 ? '−' : '') + U.sayi(Math.abs(Math.round(teq - 273.15)), 0) + ' °C)';
      S('ybHZ').textContent = ab(s.kacak) + ' – ' + ab(s.maks) + ' AB';
      S('ybHZi').textContent = ab(s.venus) + ' – ' + ab(s.mars) + ' AB';
      S('ybDurum').textContent = KONUM_AD[yer];
      const d = V.dunya || {};
      let m = `<p>Gezegen, Dünya'nın Güneş'ten aldığının ${U.sayi(aki, aki < 10 ? 2 : 1)} katı ışık alıyor: yıldızın ışıma gücü (Güneş'in ${L >= 0.1 ? U.sayi(L, 3) : U.bilimsel(L, 3)} katı) bölü uzaklığın karesi. Bu ışığın %${U.sayi(A * 100, 1)} kadarını geri yansıtıp kalanını emen ve bütün yüzeyinden kara cisim gibi ışıyan bir gezegen ${U.sayi(teq, 0)} K'de dengeye gelir; buna denge sıcaklığı denir.</p>`;
      m += `<p>Denge sıcaklığı yüzey sıcaklığı değildir. Dünya'nın denge sıcaklığı yaklaşık ${U.sayi(d.denge_k, 0)} K (−18 °C), gerçek ortalama yüzey sıcaklığı ise ${U.sayi(d.yuzey_k, 0)} K (15 °C): aradaki yaklaşık 33 derece, havanın yüzeyden yayılan kızılötesi ışığın bir kısmını tutmasından, yani sera etkisinden gelir. Venüs'te fark çok daha büyük: ışığın çoğunu yansıttığı için denge sıcaklığı Dünya'nınkinden düşük (yaklaşık ${U.sayi(d.venus_denge_k, 0)} K), ama kalın karbondioksit havası yüzeyi ortalama ${U.sayi(d.venus_yuzey_k, 0)} K'de tutar.</p>`;
      m += `<p>${yer === 'temkinli' ? 'Gezegen temkinli yaşanabilir bölgenin içinde: Dünya benzeri bir hava ve su varsa yüzeyde sıvı su olabilir.' : yer === 'sicak' ? 'Gezegen bölgenin iç kenarından da içeride: Dünya benzeri bir gezegen burada okyanuslarını buharlaştırırdı.' : yer === 'soguk' ? 'Gezegen bölgenin dış kenarından da dışarıda: karbondioksitli kalın bir hava bile yüzeyi donmaktan kurtaramazdı.' : 'Gezegen yalnız iyimser sınırların içinde; bu sınırlar Venüs\'ün yakın geçmişte, Mars\'ın ise erken dönemde suyu olabileceği düşüncesine dayanır.'} Ama bölgede olmak su ya da yaşam demek değildir: hesap Dünya kütlesinde, uygun havası ve suyu olan bir gezegen varsayar. Mars bölgenin içinde ama havası çok ince ve yüzeyi kuru, donuk.</p>`;
      if (T < 4000) m += '<p>Kırmızı cücelerin bölgesi yıldıza çok yakındır: bu uzaklıktaki gezegenler büyük olasılıkla yıldıza hep aynı yüzünü döner (gelgit kilidi), yıldızın patlamaları ve morötesi ışığı da havayı aşındırabilir. Böyle gezegenlerin gerçekten yaşanabilir olup olmadığı açık bir sorudur.</p>';
      if (s.sinirDisi) m += `<p>Bu yüzey sıcaklığı (${U.sayi(T, 0)} K) Kopparapu formülünün geçerli olduğu ${U.sayi(tMin, 0)}–${U.sayi(tMax, 0)} K aralığının dışında: sınırlar en yakın uçtaki (${U.sayi(T < tMin ? tMin : tMax, 0)} K) değerle hesaplandı, yaklaşık sayılmalı.</p>`;
      S('ybMetin').innerHTML = m;
      ciz();
    }
    function ciz() {
      const { ctx, w, h } = o.kanvas(cv, 0.7);
      ctx.clearRect(0, 0, w, h);
      const s = st.s, ust = h * 0.6;
      /* ---- üst: üstten görünüş, doğrusal ölçek; yıldız sol kenarda ---- */
      const x0 = 18, cy = ust * 0.5;
      const Dm = Math.max(s.mars, st.a) * 1.12, k = (w - x0 - 14) / Dm;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, ust); ctx.clip();
      const halka = (r1, r2, alfa) => { ctx.beginPath(); ctx.arc(x0, cy, r2 * k, 0, IKI_PI); ctx.arc(x0, cy, r1 * k, 0, IKI_PI, true); ctx.globalAlpha = alfa; ctx.fillStyle = o.renk('--iyi'); ctx.fill(); ctx.globalAlpha = 1; };
      const cember = (r, kesik, alfa, renk) => { ctx.save(); ctx.setLineDash(kesik || []); ctx.globalAlpha = alfa; ctx.strokeStyle = renk || o.renk('--iyi'); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x0, cy, r * k, 0, IKI_PI); ctx.stroke(); ctx.restore(); };
      halka(s.venus, s.kacak, 0.14); halka(s.maks, s.mars, 0.14); halka(s.kacak, s.maks, 0.38);
      cember(s.venus, [4, 4], 0.9); cember(s.mars, [4, 4], 0.9); cember(s.kacak, null, 1); cember(s.maks, null, 1);
      cember(st.a, [2, 4], 0.9, o.renk('--soluk'));
      const hale = ctx.createRadialGradient(x0, cy, 3, x0, cy, 18);
      hale.addColorStop(0, 'rgba(255,230,170,.55)'); hale.addColorStop(1, 'rgba(255,230,170,0)');
      ctx.beginPath(); ctx.arc(x0, cy, 18, 0, IKI_PI); ctx.fillStyle = hale; ctx.fill();
      ctx.beginPath(); ctx.arc(x0, cy, 7, 0, IKI_PI); ctx.fillStyle = yildizRengi(st.T); ctx.fill();
      const px = x0 + st.a * k;
      ctx.beginPath(); ctx.arc(px, cy, 5.5, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
      ctx.strokeStyle = '#0A1422'; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
      ctx.font = '500 11px Plex, sans-serif'; ctx.fillStyle = o.renk('--soluk');
      /* bölge adı üstte, bandın ortasında; gezegen adı noktanın altında */
      const bx = x0 + (s.kacak + s.maks) / 2 * k;
      ctx.textAlign = 'center';
      const bAd = 'yaşanabilir bölge', bw = ctx.measureText(bAd).width / 2;
      o.etiket(ctx, bAd, Math.min(w - bw - 4, Math.max(bw + 4, bx)), 14);
      ctx.fillStyle = o.renk('--parsomen');
      const gAd = ad.gezegen || 'gezegen', gw = ctx.measureText(gAd).width / 2;
      o.etiket(ctx, gAd, Math.min(w - gw - 4, Math.max(gw + 4, px)), cy + 20);
      /* ölçek çubuğu (doğrusal) */
      const adim = guzelAdim(Dm / 3), yb = ust - 8;
      ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x0 + adim * k, yb); ctx.moveTo(x0, yb - 4); ctx.lineTo(x0, yb + 1); ctx.moveTo(x0 + adim * k, yb - 4); ctx.lineTo(x0 + adim * k, yb + 1); ctx.stroke();
      ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left';
      o.etiket(ctx, U.sayi(adim, adim < 0.01 ? 3 : adim < 0.1 ? 2 : adim < 1 ? 1 : 0) + ' AB', x0 + adim * k + 6, yb + 4);
      /* ---- alt: logaritmik şerit; bu yıldızın bölgesi, altında Güneş'inki ---- */
      const sol = 64, sag = w - 12, l0 = Math.log10(0.005), l1 = Math.log10(20);
      const X = d => sol + (Math.log10(Math.min(20, Math.max(0.005, d))) - l0) / (l1 - l0) * (sag - sol);
      const y1 = h * 0.67, h1 = h * 0.09, y2 = h * 0.8, h2 = h * 0.05;
      ctx.strokeStyle = o.renk('--cizgi'); ctx.beginPath(); ctx.moveTo(sol, y2 + h2 + 4); ctx.lineTo(sag, y2 + h2 + 4); ctx.stroke();
      ctx.globalAlpha = 0.14; ctx.fillStyle = o.renk('--iyi'); ctx.fillRect(X(s.venus), y1, X(s.mars) - X(s.venus), h1);
      ctx.globalAlpha = 0.45; ctx.fillRect(X(s.kacak), y1, X(s.maks) - X(s.kacak), h1); ctx.globalAlpha = 1;
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1.2; ctx.strokeRect(X(gunes.kacak), y2, X(gunes.maks) - X(gunes.kacak), h2); ctx.restore();
      [0.01, 0.1, 1, 10].forEach(d => {
        ctx.strokeStyle = o.renk('--cizgi'); ctx.beginPath(); ctx.moveTo(X(d), y1 - 3); ctx.lineTo(X(d), y2 + h2 + 8); ctx.stroke();
        ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'center'; ctx.fillText(U.sayi(d, d < 0.1 ? 2 : d < 1 ? 1 : 0), X(d), Math.min(h - 4, y2 + h2 + 20));
      });
      const pX = X(st.a);
      ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pX, y1 - 4); ctx.lineTo(pX, y2 + h2 + 2); ctx.stroke(); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pX - 5, y1 - 9); ctx.lineTo(pX + 5, y1 - 9); ctx.lineTo(pX, y1 - 3); ctx.closePath(); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
      ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left';
      o.etiket(ctx, 'bu yıldız', 4, y1 + h1 / 2 + 4);
      o.etiket(ctx, 'Güneş', 4, y2 + h2 / 2 + 4);
      o.etiket(ctx, 'AB, log', 4, Math.min(h - 4, y2 + h2 + 20));
    }
    ['ybL', 'ybT', 'ybA', 'ybAlb'].forEach(id => S(id).addEventListener('input', () => { ad = { yildiz: '', gezegen: 'gezegen' }; kap.querySelectorAll('#ybOn button').forEach(y => y.setAttribute('aria-pressed', 'false')); hesapla(); }));
    function onAyar(i) {
      const x = orn[i]; if (!x) return;
      S('ybL').value = lg(x.L); S('ybT').value = Math.round(x.T); S('ybA').value = lg(x.a); S('ybAlb').value = x.A;
      ad = { yildiz: x.yildiz, gezegen: x.gezegen || 'gezegen' };
      kap.querySelectorAll('#ybOn button').forEach(y => y.setAttribute('aria-pressed', String(Number(y.dataset.i) === i)));
      hesapla();
    }
    S('ybOn').addEventListener('click', e => { const b = e.target.closest('button'); if (b) onAyar(Number(b.dataset.i)); });
    window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);
    onAyar(0);
    return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
  };
})();
