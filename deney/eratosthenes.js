/* deney/eratosthenes.js — Dünya'yı ölçmek: Eratosthenes'in yöntemi. İki kentte aynı gün öğle gölgesinin açısı ve
   iki kent arasındaki kuzey–güney uzaklığından Dünya'nın çevresi ve yarıçapı. Örnek değerler ve gerçek çevre
   veri/deney/eratosthenes.json'dan (kaynaklı); ortalama yarıçap veri/fizik.json'dan (R_dunya). */
(function () {
  'use strict';
  const DER = Math.PI / 180;

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* Merkez açısı: iki kentteki gölge açılarının farkı (paralel ışınlar, aynı meridyen) */
    merkezAci(guneyDer, kuzeyDer) { return Math.abs(kuzeyDer - guneyDer); },
    /* Çevre: açı tam turun hangi kesriyse, uzaklık da çevrenin o kesri: C = d · 360 / α */
    cevre(aciDer, uzaklik) { return aciDer > 0 ? uzaklik * 360 / aciDer : NaN; },
    yaricap(cevre) { return cevre / (2 * Math.PI); },
    /* Kesirli hata: (hesap − gerçek) / gerçek */
    hata(hesap, gercek) { return (hesap - gercek) / gercek; },
    /* Dik sopanın öğle gölgesi: boy · tan(gölge açısı) */
    golge(aciDer, boy) { return boy * Math.tan(aciDer * DER); },
    /* Gölge boyundan açı: atan(gölge / boy) (derece) */
    golgeAcisi(golge, boy) { return Math.atan2(golge, boy) / DER; },
    /* Elipsoidde iki enlem arası meridyen yayı (m), Simpson tümlevi: M(φ) = a(1−e²)/(1−e² sin²φ)^1,5 */
    meridyenYayi(enlem1, enlem2, a, tersBasiklik) {
      const f = 1 / tersBasiklik, e2 = f * (2 - f), n = 2000;
      const M = p => a * (1 - e2) / Math.pow(1 - e2 * Math.sin(p) * Math.sin(p), 1.5);
      const p1 = enlem1 * DER, p2 = enlem2 * DER, h = (p2 - p1) / n;
      let s = M(p1) + M(p2);
      for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * M(p1 + i * h);
      return Math.abs(s * h / 3);
    }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).eratosthenes = H;

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).eratosthenes = function (kap, o) {
    const U = o.U, v = o.veri || {};
    const orn = v.ornekler || [], stad = v.stadionlar || [], gercek = v.kutup_cevresi || {};
    const GERCEK_C = gercek.km, R_ORT = o.deger('R_dunya') / 1e3;
    const ilkStad = Math.max(0, stad.findIndex(s => s.varsayilan));
    const tekKaynak = (ls) => ls.filter((k, i, a) => k && k.url && a.findIndex(x => x.url === k.url) === i);
    const linkler = ls => tekKaynak(ls).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ');
    const tumKaynak = [].concat(gercek.kaynaklar || [], ...orn.map(x => x.kaynaklar || []), ...stad.map(x => x.kaynaklar || []), v.kaynaklar || []);
    kap.innerHTML = `
      <div class="cip-grup" id="erOn">${orn.map((x, i) => `<button type="button" class="dugme" data-i="${i}" aria-pressed="${i === 0}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="erKanvas"></canvas></div>
      <div class="kontroller">
        ${o.kaydirici('erGuney', 'Güneydeki kentte öğle gölgesinin açısı (sopayla arası)', 0, 50, 'any', 0)}
        ${o.kaydirici('erKuzey', 'Kuzeydeki kentte öğle gölgesinin açısı (sopayla arası)', 0, 60, 'any', 7.2)}
        ${o.kaydirici('erUzak', 'İki kent arasındaki kuzey–güney uzaklığı', 50, 1500, 'any', 800)}
        <div class="alan"><label for="erStad">Stadion kaç metre? (antik uzunluk birimi; tarihçiler anlaşamıyor)</label>
          <select id="erStad">${stad.map((s, i) => `<option value="${s.m}"${i === ilkStad ? ' selected' : ''}>${U.kacis(s.ad)}</option>`).join('')}</select></div>
      </div>
      ${o.olcumler([['erAci', 'Merkez açısı (iki gölge açısının farkı)'], ['erCevre', 'Hesaplanan çevre'], ['erYari', 'Hesaplanan yarıçap'], ['erGercek', 'Bugünkü değer: kutuptan geçen çevre · ortalama yarıçap'], ['erHata', 'Çevredeki hata'], ['erGolge', '1 m\'lik sopanın gölgesi: güneyde · kuzeyde']])}
      <div class="deney-metin" id="erMetin"></div>
      <p class="kaynak">Varsayımlar: Dünya tam bir küre, Güneş ışınları birbirine paralel, iki kent aynı meridyende (tam kuzey–güney doğrultusunda) ve gölgeler aynı gün yerel öğlede ölçülüyor. Gerçekte Dünya kutuplarda hafifçe basıktır; bir derecelik enlem ekvatorda yaklaşık 110,6 km, kutupta 111,7 km tutar (WGS 84'ten hesap), bu yüzden kısa bir yaydan bulunan çevre birkaç binde bir sapabilir. Çizim ölçekli değildir. Kaynaklar: ${o.kaynakSatiri(['R_dunya']).replace(/^<p class="kaynak">Kaynaklar: |<\/p>$/g, '')} · ${linkler(tumKaynak)}</p>`;
    const S = id => kap.querySelector('#' + id);
    const cv = S('erKanvas'), gS = S('erGuney'), kS = S('erKuzey'), uS = S('erUzak'), sS = S('erStad');
    let secili = 0, st = {};

    function stadM() { return Number(sS.value); }
    function onAyar(i) {
      const x = orn[i]; if (!x) return;
      secili = i;
      gS.value = x.guney_derece; kS.value = x.kuzey_derece;
      uS.value = x.stadion != null ? x.stadion * stadM() / 1e3 : x.uzaklik_km;
      kap.querySelectorAll('#erOn button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)));
      hesapla();
    }
    /* Ön ayar seçiliyken kent adları; kaydırıcı oynatılınca genel adlar (değerler artık o kentlerin değil) */
    function adlar() {
      const x = orn[secili];
      return x ? [x.guney_kent, x.kuzey_kent] : ['', ''];
    }
    function yuzde(f) {
      const p = Math.abs(f) * 100;
      if (p < 0.005) return 'yok denecek kadar az';
      return '%' + U.sayi(p, p < 10 ? 2 : 1) + (f > 0 ? ' fazla' : ' eksik');
    }
    function hesapla() {
      const g = Number(gS.value), k = Number(kS.value), d = Number(uS.value), L = stadM();
      const a = H.merkezAci(g, k), C = H.cevre(a, d), R = H.yaricap(C), f = H.hata(C, GERCEK_C);
      const stadMod = !!(orn[secili] && orn[secili].stadion != null);
      const [ga, ka] = adlar();
      st = { g, k, d, a, C, R, f, ters: k < g, ga, ka };
      S('erGuneyCikti').textContent = U.sayi(g, 2) + '°';
      S('erKuzeyCikti').textContent = U.sayi(k, 2) + '°';
      S('erUzakCikti').textContent = U.sayi(d, 1) + ' km' + (stadMod ? ' (' + U.sayi(d * 1e3 / L, 0) + ' stadion)' : '');
      const gecerli = a >= 0.01 && isFinite(C);
      S('erAci').textContent = gecerli ? U.sayi(a, 2) + '° (360° ÷ ' + U.sayi(360 / a, 1) + ')' : U.sayi(a, 2) + '°';
      S('erCevre').textContent = gecerli ? U.sayi(C, 0) + ' km' + (stadMod ? ' (' + U.sayi(C * 1e3 / L, 0) + ' stadion)' : '') : 'hesaplanamaz';
      S('erYari').textContent = gecerli ? U.sayi(R, 0) + ' km' : '—';
      S('erGercek').textContent = U.sayi(GERCEK_C, 0) + ' km · ' + U.sayi(R_ORT, 0) + ' km';
      S('erHata').textContent = gecerli ? yuzde(f) : '—';
      S('erGolge').textContent = golgeYaz(g) + ' · ' + golgeYaz(k);
      metin(gecerli, stadMod, L);
      ciz();
    }
    function golgeYaz(aci) { const cm = H.golge(aci, 100); return cm < 0.05 ? 'gölge yok' : U.sayi(cm, 1) + ' cm'; }
    function metin(gecerli, stadMod, L) {
      const el = S('erMetin');
      if (!gecerli) {
        el.innerHTML = '<p>İki gölge açısı aynı: Güneş iki kentte de aynı yükseklikte, demek ki kentler aynı enlemde. Merkez açısı sıfır olunca uzaklığı tam turun hangi kesri olduğuna bölemezsin; yöntem için kentlerden biri ötekinin kuzeyinde olmalı.</p>';
        return;
      }
      const n = 360 / st.a, hassas = 0.1 / st.a * 100;
      const ad = x => x ? ' (' + U.kacis(x) + ')' : '';
      const p1 = st.g < 0.05
        ? `Güneydeki kentte${ad(st.ga)} Güneş tam tepede (başucunda): sopanın gölgesi yok. Kuzeydeki kentte${ad(st.ka)} gölge sopayla ${U.sayi(st.k, 2)}° açı yapıyor.`
        : `Güneydeki kentte${ad(st.ga)} gölge sopayla ${U.sayi(st.g, 2)}°, kuzeydeki kentte${ad(st.ka)} ${U.sayi(st.k, 2)}° açı yapıyor; fark ${U.sayi(st.a, 2)}°.`;
      el.innerHTML = `<p>${p1} Güneş çok uzakta olduğu için ışınları iki kente birbirine paralel gelir. Paralel iki doğruyu kesen bir doğru iki yanında eşit açılar yapar (iç ters açılar): bu yüzden gölge açılarının farkı, iki kentin Dünya'nın merkezinden bakınca arasındaki açıya (merkez açısına) eşittir.${st.ters ? ' (Kuzeydeki gölge güneydekinden kısa girildi; hesap farkın büyüklüğünü kullanır.)' : ''}</p>
        <p>Tam tur (360°), ${U.sayi(st.a, 2)}°'nin ${U.sayi(n, 1)} katı. Öyleyse çevre de iki kent arasındaki uzaklığın ${U.sayi(n, 1)} katıdır: ${U.sayi(n, 1)} × ${U.sayi(st.d, 1)} km ≈ ${U.sayi(st.C, 0)} km. Yarıçap çevrenin 2π'ye bölümü: ${U.sayi(st.R, 0)} km. Bugünkü kutuptan geçen çevreye (${U.sayi(GERCEK_C, 0)} km) göre ${yuzde(st.f)}.</p>
        <p>${stadMod ? `Eratosthenes uzaklığı 5000 stadion olarak biliyordu; sonucu stadion cinsinden 250.000'dir ve stadionun boyu ne olursa olsun bu değişmez. Kilometreye çevirince isabet yalnız stadionun uzunluğuna bağlı kalır: ${U.sayi(L, 1)} m alınca hata ${yuzde(st.f)}. Yöntem doğru, belirsizlik birimde.` : `Açıyı ölçerken 0,1° yanılsan sonuç yaklaşık %${U.sayi(hassas, 1)} değişirdi: merkez açısı küçük olduğu için açıdaki küçük bir hata büyük bir hataya dönüşür. Kentler birbirinden ne kadar uzaksa açı o kadar büyük, ölçüm o kadar bağışlayıcı olur.`}</p>`;
    }

    /* ---- çizim: Dünya'nın kesiti, soldan gelen paralel ışınlar, iki sopa ve gölgeleri ---- */
    function ciz() {
      const { ctx, w, h } = o.kanvas(cv, 0.68);
      const kir = document.documentElement.classList.contains('kirmizi');
      ctx.clearRect(0, 0, w, h);
      if (!isFinite(st.a)) return;
      /* Dünya'nın sol üst çeyreği görünür; merkez sağ altta. Sopanın ucu (1,2 R) 70°'de bile yazıya yer bırakır. */
      const cy = h * 0.8, cx = w * 0.72;
      const R = Math.min((cy - 32) / 1.13, (cx - 8) / 1.2), gb = R * 0.2;
      /* küçük merkez açısı görünsün diye çizimde büyütülür (k kat); güneydeki gölge açısı gerçek */
      const lo = Math.min(st.g, st.k), hi = Math.max(st.g, st.k), a = hi - lo;
      const kat = a >= 12 || a < 0.01 ? 1 : Math.max(1, Math.round(24 / a));
      const tS = lo * DER, tN = (lo + a * kat) * DER;
      const nokta = (t, r) => [cx - r * Math.cos(t), cy - r * Math.sin(t)];
      /* Dünya: Güneş'e bakan yarı biraz açık */
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = kir ? '#1A0303' : '#1C3B52'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI / 2, Math.PI * 1.5); ctx.fillStyle = kir ? '#2A0505' : '#2C5A7A'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1; ctx.stroke();
      /* paralel güneş ışınları (soldan) */
      ctx.strokeStyle = 'rgba(255,210,122,.38)'; ctx.lineWidth = 1;
      for (let y = h * 0.1; y < h; y += h / 8) {
        const dy = y - cy, xs = Math.abs(dy) < R ? cx - Math.sqrt(R * R - dy * dy) : w;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(Math.max(0, xs), y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(Math.max(0, xs) - 7, y - 3); ctx.lineTo(Math.max(0, xs), y); ctx.lineTo(Math.max(0, xs) - 7, y + 3); ctx.stroke();
      }
      /* iki kentin arasındaki yüzey yayı (uzaklık) */
      ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI + tS, Math.PI + tN); ctx.strokeStyle = o.renk('--iyi'); ctx.lineWidth = 4; ctx.stroke();
      /* merkezden iki kente yarıçaplar ve merkez açısı */
      const [xs0, ys0] = nokta(tS, R), [xn0, yn0] = nokta(tN, R);
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(xs0, ys0); ctx.moveTo(cx, cy); ctx.lineTo(xn0, yn0); ctx.stroke(); ctx.restore();
      const kama = (x, y, r, a1, a2) => {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, a1, a2); ctx.closePath();
        ctx.fillStyle = 'rgba(200,164,93,.38)'; ctx.fill(); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.5; ctx.stroke();
      };
      const rk = Math.min(R * 0.3, 70);
      if (a >= 0.01) kama(cx, cy, rk, Math.PI + tS, Math.PI + tN);
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
      /* sopalar, gölgeler ve uçlarından geçen ışınlar; kentin adı sopanın ucunun üstünde */
      const sopa = (t, adi, aci) => {
        const [x0, y0] = nokta(t, R), [xt, yt] = nokta(t, R + gb);
        const sonX = xt + gb / Math.cos(t);                      // ışın sopanın ucundan geçip yere (teğet düzleme) değer
        ctx.strokeStyle = '#FFD27A'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(0, yt); ctx.lineTo(sonX, yt); ctx.stroke();
        if (t > 0.002) {                                         // gölge: sopanın dibinden kuzeye, yüzeye teğet
          /* içi boş kalın şerit: koyu zeminde de kırmızı modda da seçilsin */
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(sonX, yt); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 6; ctx.stroke();
          ctx.strokeStyle = '#000'; ctx.lineWidth = 3.4; ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xt, yt); ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 3; ctx.stroke();
        /* ad ışının üstünde, gölge açısı altında; ikisi de sopanın ucunun solunda (gökte boş yer) */
        ctx.fillStyle = o.renk('--parsomen'); ctx.font = '600 12px Plex, sans-serif';
        const yaz = (m, y) => { const g = ctx.measureText(m).width; ctx.textAlign = 'left'; o.etiket(ctx, m, Math.max(4, xt - 8 - g), y); };
        yaz(adi, yt - 7);
        ctx.font = '500 12px Plex, sans-serif';
        yaz(t > 0.002 ? U.sayi(aci, 2) + '°' : 'gölge yok', yt + 16);
        return { xt, yt, sonX };
      };
      const ga = st.ga || 'güney kenti', ka = st.ka || 'kuzey kenti';
      const [gAd, kAd] = st.k >= st.g ? [ga, ka] : [ka, ga];
      const ust = sopa(tS, gAd, lo), alt2 = sopa(tN, kAd, hi);
      /* kuzeydeki sopanın ucunda açı: güneydeki açı kadarı kesik, merkez açısı kadarı merkezdeki gibi dolu */
      const ra = Math.min(gb * 1.1, 40);
      if (tS > 0.002) {
        ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(ust.xt, ust.yt, ra, 0, tS); ctx.stroke();
        ctx.beginPath(); ctx.arc(alt2.xt, alt2.yt, ra, 0, tS); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(alt2.xt, alt2.yt); ctx.lineTo(alt2.xt + Math.cos(tS) * ra * 1.25, alt2.yt + Math.sin(tS) * ra * 1.25); ctx.stroke();
        ctx.restore();
      }
      if (a >= 0.01) kama(alt2.xt, alt2.yt, ra, tS, tN);
      /* yazılar (gölge açıları kent adının yanında) */
      ctx.font = '500 12px Plex, sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = o.renk('--pirinc');
      o.etiket(ctx, 'merkez açısı ' + U.sayi(a, 2) + '°', cx - 6, cy + 18);
      /* uzaklık yazısı: yayın ortasında, Dünya'nın içinde */
      const [xm, ym] = nokta((tS + tN) / 2, R - 12);
      ctx.textAlign = 'left'; ctx.fillStyle = o.renk('--iyi');
      o.etiket(ctx, U.sayi(st.d, 0) + ' km', xm + 4, ym + 4);
      ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left'; ctx.font = '500 11px Plex, sans-serif';
      o.etiket(ctx, 'Güneş ışınları (paralel) →', 6, 14);
      if (kat > 1) o.etiket(ctx, 'Ölçekli değil: kentler arası açı ' + kat + ' kat büyük', 6, h - 6);
    }

    [gS, kS, uS].forEach(e => e.addEventListener('input', () => {
      if (secili >= 0) { secili = -1; kap.querySelectorAll('#erOn button').forEach(b => b.setAttribute('aria-pressed', 'false')); }
      hesapla();
    }));
    sS.addEventListener('change', () => {
      if (orn[secili] && orn[secili].stadion != null) uS.value = orn[secili].stadion * stadM() / 1e3;
      hesapla();
    });
    S('erOn').addEventListener('click', e => { const b = e.target.closest('button'); if (b) onAyar(Number(b.dataset.i)); });
    window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);
    onAyar(0);
    return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
  };
})();
