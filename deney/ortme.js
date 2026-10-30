/* deney/ortme.js — Örten çift yıldız: iki yıldız birbirinin önünden geçer, ışık eğrisinde derin (birincil) ve sığ
   (ikincil) çukur. Yıldızlar düzgün parlak disk (kenar kararması yok), yörünge dairesel. Yüzey parlaklığı görsel
   bantta (550 nm) Planck yasasıyla. Sayılar veri/deney/ortme.json'dan (kaynaklı). */
(function () {
  'use strict';
  const IKI_PI = Math.PI * 2, DER = Math.PI / 180;

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* Planck yasası: B_λ(T) = 2hc²/λ⁵ · 1/(e^{hc/λkT} − 1). Sabitler çağırandan gelir (fizik.json). */
    planck(lam, T, h, c, k) { return 2 * h * c * c / Math.pow(lam, 5) / Math.expm1(h * c / (lam * k * T)); },
    /* İki dairenin kesişim alanı (yarıçaplar R, r; merkezler arası d) — gecis'teki fikrin aynısı, burada yeniden yazıldı */
    ortusme(R, r, d) {
      if (d >= R + r) return 0;
      if (d <= Math.abs(R - r)) return Math.PI * Math.min(R, r) * Math.min(R, r);
      const a1 = Math.acos((d * d + R * R - r * r) / (2 * d * R)), a2 = Math.acos((d * d + r * r - R * R) / (2 * d * r));
      return R * R * a1 + r * r * a2 - 0.5 * Math.sqrt(Math.max(0, (-d + R + r) * (d + R - r) * (d - R + r) * (d + R + r)));
    },
    /* Dairesel yörüngede 2. yıldızın 1.'ye göre konumu (a biriminde). faz 0: 2. yıldız önde (1. yıldız örtülür).
       x, y gökyüzü düzleminde; z bize doğru (> 0: 2. yıldız önde); d gökteki merkezler arası uzaklık. */
    konum(a, iDer, faz) {
      const f = faz * IKI_PI, ci = Math.cos(iDer * DER), si = Math.sin(iDer * DER);
      const x = a * Math.sin(f), y = a * ci * Math.cos(f), z = a * si * Math.cos(f);
      return { x, y, z, d: Math.hypot(x, y) };
    },
    /* Toplam ışık (tutulma dışı = 1). p = {R1, R2, S1, S2, a, i}; S yüzey parlaklığı (birimi önemsiz, oran kullanılır) */
    isik(p, faz) {
      const k = H.konum(p.a, p.i, faz);
      const L1 = Math.PI * p.R1 * p.R1 * p.S1, L2 = Math.PI * p.R2 * p.R2 * p.S2;
      const ort = H.ortusme(p.R1, p.R2, k.d);
      const kayip = ort * (k.z > 0 ? p.S1 : p.S2);          // öndeki yıldız arkadakinin bu kadar alanını örter
      return (L1 + L2 - kayip) / (L1 + L2);
    },
    /* Işık oranından kadir farkı: Δm = −2,5·log₁₀(F/F₀) */
    kadir(oran) { return -2.5 * Math.log10(oran); },
    /* Tutulmanın süresi, dönemin kesri olarak (ilk değmeden son değmeye): merkezler arası gök uzaklığı R1 + R2'den
       küçükken. sin²φ + cos²i·cos²φ < s² → φ < asin(√(s² − cos²i) / sin i), s = (R1 + R2)/a */
    sureKesir(R1, R2, a, iDer) {
      const s = (R1 + R2) / a, ci = Math.cos(iDer * DER), si = Math.sin(iDer * DER);
      if (s * s <= ci * ci) return 0;
      const ic = Math.sqrt(s * s - ci * ci) / si;
      return ic >= 1 ? 0.5 : Math.asin(ic) / Math.PI;
    },
    /* Bütün sonuçlar: p = {R1, R2, T1, T2, a, i}, s = {h, c, k, lam}. faz 0 ve 0,5'teki ışık (dairesel yörüngede en derin
       anlar kavuşumdadır); derin olanı birincil. */
    model(p, s) {
      const S1 = H.planck(s.lam, p.T1, s.h, s.c, s.k), S2 = H.planck(s.lam, p.T2, s.h, s.c, s.k);
      const q = { R1: p.R1, R2: p.R2, S1, S2, a: p.a, i: p.i };
      const f0 = H.isik(q, 0), f5 = H.isik(q, 0.5);
      const bir = f0 <= f5 ? { faz: 0, oran: f0 } : { faz: 0.5, oran: f5 };
      const iki = f0 <= f5 ? { faz: 0.5, oran: f5 } : { faz: 0, oran: f0 };
      [bir, iki].forEach(t => { t.kesir = 1 - t.oran; t.kadir = H.kadir(t.oran); });
      const L1 = p.R1 * p.R1 * S1, L2 = p.R2 * p.R2 * S2;
      return { q, S1, S2, bir, iki, sure: H.sureKesir(p.R1, p.R2, p.a, p.i), b: Math.abs(p.a * Math.cos(p.i * DER)), payl2: L2 / (L1 + L2), dokunur: p.a <= p.R1 + p.R2 };
    },
    /* Üçüncü bir yıldızın sabit ışığı (çiftin ışığının 'pay' katı) eklenince kalan ışık oranı */
    ucuncuIsik(oran, pay) { return (oran + pay) / (1 + pay); },
    /* Kepler III: P = 2π·√(a³ / GM) (s) */
    keplerP(a, GM) { return IKI_PI * Math.sqrt(a * a * a / GM); }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).ortme = H;

  function yildizRengi(t) {
    if (t > 25000) return '#A9C1FF'; if (t > 10000) return '#C8D6FF'; if (t > 7500) return '#F1F3FF';
    if (t > 6000) return '#FFF4E0'; if (t > 5200) return '#FFE8B0'; if (t > 3700) return '#FFC98C'; return '#FF9E6A';
  }
  function yazDegisirse(e, metin) { if (e && e.textContent !== metin) e.textContent = metin; }

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).ortme = function (kap, o) {
    const U = o.U, V = o.veri || {};
    const RG = o.deger('R_gunes'), AU = o.deger('au'), GMg = o.deger('GM_gunes');
    const sabit = { h: o.deger('h'), c: o.deger('c'), k: o.deger('k_B'), lam: (V.dalga_boyu_nm || 550) * 1e-9 };
    const al = V.algol || {};
    /* Örnekler: a AB ya da Güneş yarıçapı biriminde; Algol'ün kaynaktaki eğikliği 98,7° → 180° − 98,7° aynı görünüşü verir.
       Eşit yıldızlarda dönem, Güneş kütleli iki yıldız için Kepler III'ten hesaplanır. */
    const orn = (V.ornekler || []).map(x => {
      const a = x.a_ab != null ? x.a_ab * AU / RG : x.a_rgunes;
      const i = x.i_derece > 90 ? 180 - x.i_derece : x.i_derece;
      const P = x.p_gun != null ? x.p_gun : H.keplerP(a * RG, GMg * (x.toplam_kutle_gunes || 2)) / 86400;
      if (x.gunes_ikizi) { const Tg = o.deger('T_gunes'); return { ad: x.ad, R1: 1, R2: 1, T1: Tg, T2: Tg, a, i, P }; }
      return { ad: x.ad, R1: x.r1_rgunes, R2: x.r2_rgunes, T1: x.t1_k, T2: x.t2_k, a, i, P };
    });
    const lg = Math.log10;
    kap.innerHTML = `
      <div class="cip-grup" id="otOn">${orn.map((x, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="otKanvas"></canvas></div>
      <div class="kontroller">
        ${o.kaydirici('otR1', '1. yıldızın yarıçapı (Güneş = 1)', lg(0.1), lg(10), 'any', lg(2.73))}
        ${o.kaydirici('otT1', '1. yıldızın yüzey sıcaklığı', lg(3000), lg(30000), 'any', lg(13000))}
        ${o.kaydirici('otR2', '2. yıldızın yarıçapı (Güneş = 1)', lg(0.1), lg(10), 'any', lg(3.48))}
        ${o.kaydirici('otT2', '2. yıldızın yüzey sıcaklığı', lg(3000), lg(30000), 'any', lg(4500))}
        ${o.kaydirici('otA', 'İki yıldızın arası (Güneş yarıçapı)', lg(2), lg(60), 'any', lg(13.33))}
        ${o.kaydirici('otI', 'Eğiklik i (90° = yörüngeyi tam yandan görüyoruz)', 50, 90, 0.1, 81.3)}
        ${o.kaydirici('otP', 'Dönem (gün)', lg(0.3), lg(30), 'any', lg(2.867328))}
        ${o.azHareket ? o.kaydirici('otZaman', 'Dönem içinde zaman (yüzde)', 0, 1, 'any', 0) : ''}
      </div>
      ${o.olcumler([['otBir', 'Birincil (derin) tutulma'], ['otIki', 'İkincil (sığ) tutulma'], ['otSure', 'Tutulma süresi'], ['otDonem', 'Dönem'], ['otSimdi', 'Şu anki ışık', true]])}
      <div class="deney-metin" id="otMetin"></div>
      <p class="kaynak">Yıldızlar düzgün parlak disk varsayıldı (kenar kararması yok), küre biçimli ve yörünge dairesel; yansıma (yıldızın yoldaşına bakan yüzünün ısınması) ve üçüncü yıldızın ışığı yok. Yüzey parlaklığı 550 nm'de (göz ve V bandı) kara cisim ışınımıyla (Planck yasası) hesaplanır. Dönem yalnız zaman ölçeğini belirler; gerçekte uzaklık, dönem ve kütleler Kepler yasasıyla bağlıdır. Çizimde 1. yıldız sabit tutuldu, 2. yıldızın ona göre yolu gösterilir. Kaynaklar: ${(V.kaynaklar || []).filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ')}</p>`;
    const cv = kap.querySelector('#otKanvas');
    const S = id => kap.querySelector('#' + id);
    let st = {}, egri = [], faz = 0.94;                         // tutulmadan biraz önce başlar
    function deger() {
      return { R1: Math.pow(10, Number(S('otR1').value)), R2: Math.pow(10, Number(S('otR2').value)), T1: Math.pow(10, Number(S('otT1').value)), T2: Math.pow(10, Number(S('otT2').value)), a: Math.pow(10, Number(S('otA').value)), i: Number(S('otI').value), P: Math.pow(10, Number(S('otP').value)) };
    }
    function sureYaz(gun) {
      const saat = gun * 24;
      return saat < 48 ? U.sayi(saat, 1) + ' saat' : U.sayi(gun, 2) + ' gün';
    }
    function derinYaz(t) {
      if (t.kesir < 1e-6) return 'tutulma yok';
      const m = t.kadir;
      return U.sayi(m, m < 0.1 ? 3 : 2) + ' kadir (%' + U.sayi(t.kesir * 100, 1) + ')';
    }
    function algolMu(p) { const x = orn[0]; return x && Math.abs(p.R1 - x.R1) < 0.01 && Math.abs(p.R2 - x.R2) < 0.01 && Math.abs(p.T1 - x.T1) < 20 && Math.abs(p.T2 - x.T2) < 20 && Math.abs(p.a - x.a) < 0.05 && Math.abs(p.i - x.i) < 0.05; }
    function hesapla() {
      const p = deger();
      const m = H.model(p, sabit);
      st = Object.assign({}, p, m);
      egri = [];
      for (let j = 0; j <= 400; j++) egri.push(H.isik(m.q, (j / 400 - 0.25 + 1) % 1));
      S('otR1Cikti').textContent = U.sayi(p.R1, 2) + ' R☉';
      S('otR2Cikti').textContent = U.sayi(p.R2, 2) + ' R☉';
      S('otT1Cikti').textContent = U.sayi(Math.round(p.T1), 0) + ' K';
      S('otT2Cikti').textContent = U.sayi(Math.round(p.T2), 0) + ' K';
      S('otACikti').textContent = U.sayi(p.a, 1) + ' R☉ (' + U.sayi(p.a * RG / AU, 3) + ' AB)';
      S('otICikti').textContent = U.sayi(p.i, 1) + '°';
      S('otPCikti').textContent = U.sayi(p.P, p.P < 10 ? 3 : 1) + ' gün';
      const yok = m.bir.kesir < 1e-6;
      S('otBir').textContent = m.dokunur ? 'fiziksel değil' : derinYaz(m.bir);
      S('otIki').textContent = m.dokunur ? '—' : derinYaz(m.iki);
      S('otSure').textContent = m.dokunur || yok ? '—' : sureYaz(m.sure * p.P) + ' (dönemin %' + U.sayi(m.sure * 100, 1) + ' kadarı)';
      S('otDonem').textContent = U.sayi(p.P, 3) + ' gün (' + U.sayi(p.P * 24, 1) + ' saat)';
      const sicak = p.T1 >= p.T2 ? 1 : 2, oranS = Math.max(m.S1, m.S2) / Math.min(m.S1, m.S2);
      let metin;
      if (m.dokunur) metin = '<p>İki yıldızın arası yarıçaplarının toplamından küçük: yıldızlar iç içe geçmiş olurdu. Gerçekte bu kadar yakın yıldızlar birbirine değer ve biçimleri bozulur (değen çift); bu basit model onları anlatamaz. Aradaki uzaklığı artır ya da yıldızları küçült.</p>';
      else if (yok) metin = `<p>Bu eğiklikle yıldızlar gökte birbirinin önünden geçmiyor: aralarındaki en küçük gök uzaklığı ${U.sayi(m.b, 2)} R☉, yarıçaplarının toplamı ise ${U.sayi(p.R1 + p.R2, 2)} R☉. Işık hiç azalmaz; böyle bir çifti ışık eğrisinden değil, ancak tayfındaki Doppler kaymalarından tanıyabiliriz. Tutulma için yörüngeyi neredeyse yandan görmek gerekir: i en az ${U.sayi(Math.acos(Math.min(1, (p.R1 + p.R2) / p.a)) / DER, 1)}° olmalı.</p>`;
      else {
        const esit = Math.abs(m.S1 - m.S2) <= 1e-3 * Math.max(m.S1, m.S2);
        metin = `<p>Tutulmada öndeki yıldız arkadakinin bir parçasını örter; kaybolan ışık, örtülen alan çarpı <em>arkadaki</em> yıldızın yüzey parlaklığıdır (birim alandan çıkan ışık). İki kavuşumda örtülen alan aynıdır, bu yüzden derinlik farkı yalnız yüzey parlaklığından gelir${esit ? '.' : `: daha sıcak olan ${sicak}. yıldız örtülünce düşüş derin olur (birincil), soğuk olan örtülünce sığ (ikincil). Bu ikisinde 550 nm'de birim alandan çıkan ışığın oranı ${U.sayi(oranS, oranS < 10 ? 2 : 1)}.`}</p>`;
        if (esit) metin += '<p>İki yıldız aynı sıcaklıkta: iki tutulma eşit derin, hangisinin “birincil” olduğu ayırt edilemez. Böyle bir çiftte dönemi yarısı kadar ölçmek kolaydır; gerçek dönem iki çukur arasının iki katıdır.</p>';
        const fark = Math.abs(p.R1 - p.R2);
        if (fark < 1e-3 * Math.max(p.R1, p.R2) && m.b < 1e-3 * p.R1) metin += '<p>İki yıldız aynı boyda ve tam ortadan geçiyor: arkadaki yıldız yalnız bir an için tamamen örtülür, sonra yeniden açılır. Çukurun tabanı düz değil, sivri.</p>';
        else metin += m.b > fark + 1e-6 ? `<p>Yıldızlar birbirini hiçbir anda tamamen örtmüyor (kısmi tutulma): çukurun düz bir tabanı yok.${m.b > 0.7 * (p.R1 + p.R2) ? ' Yol kenardan sıyırıyor: tutulma kısa ve sığ, çukur V biçiminde.' : ''}</p>` : '<p>Küçük yıldız büyüğün tam önünden ya da arkasından geçiyor: bir süre örtülen alan değişmez ve çukurun tabanı düzleşir (tam ya da halka tutulması).</p>';
      }
      if (!m.dokunur && algolMu(p)) {
        const c3 = Math.pow(10, -0.4 * (al.ucuncu_dV || 2.92));
        const m3 = H.kadir(H.ucuncuIsik(m.bir.oran, c3));
        metin += `<p>Gerçek Algol'de ışık ${U.sayi(al.kadir_en_parlak_gcvs, 2)} kadirden ${U.sayi(al.kadir_en_sonuk_gcvs, 2)} kadire (GCVS; AAVSO VSX'e göre ${U.sayi(al.kadir_en_parlak_vsx, 2)}–${U.sayi(al.kadir_en_sonuk_vsx, 2)}) düşer: ${U.sayi(al.kadir_en_sonuk_gcvs - al.kadir_en_parlak_gcvs, 2)} ya da ${U.sayi(al.kadir_en_sonuk_vsx - al.kadir_en_parlak_vsx, 2)} kadir. Model ${U.sayi(m.bir.kadir, 2)} kadir veriyor, çünkü üçüncü yıldız Algol C'yi saymıyor: C, V bandında tutulan çiftten ${U.sayi(al.ucuncu_dV, 2)} kadir sönük, yani çiftin ışığına %${U.sayi(c3 * 100, 1)} kadar sabit bir ışık ekler ve çukuru sığlaştırır. Bu ışık eklenince model ${U.sayi(m3, 2)} kadire iner. İkincil tutulma gerçekte yaklaşık ${U.sayi(al.ikincil_kadir_vsx - al.kadir_en_parlak_vsx, 2)} kadir (VSX); modelde daha sığ, çünkü Algol B'nin A'ya bakan yüzü A'nın ışığıyla ısınır (yansıma) ve B, A'nın çekimiyle uzamıştır. Tutulma süresi VSX'te ${U.sayi(al.sure_saat_vsx, 2)} saat (dönemin %${U.sayi(al.sure_yuzde_vsx, 0)} kadarı); model ${U.sayi(m.sure * p.P * 24, 1)} saat veriyor.</p>
          <p>Algol'ün kararmasını İstanbul'dan çıplak gözle izleyebilirsin: Algol neredeyse tam başucundan geçer. Urania'nın Gökyüzü sekmesindeki “Yaklaşan olaylar” listesi, karanlıkta görülebilecek sıradaki iki en sönük anı saatiyle verir. En sönük andan bir iki saat önce başla, Algol'ü bilinen yıldızlarla karşılaştır: İngiliz Astronomi Derneği'ne (BAA) göre tutulma dışında Almach (γ Andromedae, 2,1) kadardır, tutulmanın ortasında ε Cassiopeiae (3,3) ve α Trianguli (3,4) kadar söner.</p>`;
      }
      S('otMetin').innerHTML = metin;
    }
    function ciz(dt) {
      if (!o.azHareket) faz = (faz + (dt || 0) / 12) % 1;      // bir dönem 12 saniye
      else { const g = S('otZaman'); if (g) { faz = Number(g.value) % 1; yazDegisirse(S('otZamanCikti'), '%' + Math.round(Number(g.value) * 100)); } }
      const { ctx, w, h } = o.kanvas(cv, 0.75);
      ctx.clearRect(0, 0, w, h);
      /* üst: Dünya'dan görünüş. Ölçek, yol ve yıldızlar üst bölmeye sığacak biçimde seçilir (eğiklik küçülünce çizim küçülür) */
      const cx = w / 2, cy = h * 0.28, Rm = Math.max(st.R1, st.R2);
      const s = Math.min((w / 2 - 12) / (st.a + Rm), (h * 0.27 - 6) / (st.a * Math.abs(Math.cos(st.i * DER)) + Rm));
      ctx.save(); ctx.setLineDash([3, 5]); ctx.strokeStyle = o.renk('--pirinc-soluk'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, cy, st.a * s, Math.max(0.5, st.a * Math.abs(Math.cos(st.i * DER)) * s), 0, 0, IKI_PI); ctx.stroke(); ctx.restore();
      const k = H.konum(st.a, st.i, faz);
      const y1 = { x: cx, y: cy, r: Math.max(1.5, st.R1 * s), T: st.T1, ad: '1' };
      const y2 = { x: cx + k.x * s, y: cy + k.y * s, r: Math.max(1.5, st.R2 * s), T: st.T2, ad: '2' };
      const [arka, on] = k.z > 0 ? [y1, y2] : [y2, y1];
      [arka, on].forEach(y => {
        ctx.beginPath(); ctx.arc(y.x, y.y, y.r, 0, IKI_PI); ctx.fillStyle = yildizRengi(y.T); ctx.fill();
        /* 2. yıldızın çevresinde ince halka: kırmızı modda renkler yaklaşsa da iki yıldız ayrılır */
        if (y === y2) { ctx.strokeStyle = '#0A1422'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.arc(y.x, y.y, y.r + 2.5, 0, IKI_PI); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.2; ctx.stroke(); }
      });
      ctx.font = '600 12px Plex, sans-serif'; ctx.textAlign = 'center';
      const arkaGorunur = Math.hypot(arka.x - on.x, arka.y - on.y) > on.r + 8;
      [arka, on].forEach(y => {
        if (y === arka && !arkaGorunur) return;
        if (y.r >= 9) { ctx.fillStyle = '#0A1422'; ctx.fillText(y.ad, y.x, y.y + 4); }
        else { ctx.fillStyle = o.renk('--parsomen'); o.etiket(ctx, y.ad, y.x, y.y - y.r - 6); }
      });
      ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'left';
      o.etiket(ctx, 'Dünya\'dan görünüş', 6, 14);
      /* alt: ışık eğrisi, bir dönem (birincil kavuşum soldan dörtte birde) */
      const gx = 34, gw = w - gx - 10, gy = h * 0.63, gh = h * 0.25;
      const enAz = Math.min.apply(null, egri), dmax = Math.min(1, Math.max((1 - enAz) * 1.15, 0.002));   // alt kenar en çok ışığın tamamı
      const Y = f => gy + (1 - f) / dmax * gh;
      ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke();
      ctx.beginPath();
      egri.forEach((f, j) => { const X = gx + gw * j / 400; if (j) ctx.lineTo(X, Y(f)); else ctx.moveTo(X, Y(f)); });
      ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.8; ctx.stroke();
      const xs = (faz + 0.25) % 1, fs = H.isik(st.q, faz);
      ctx.save(); ctx.setLineDash([2, 3]); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(gx + gw * xs, gy - 4); ctx.lineTo(gx + gw * xs, gy + gh); ctx.stroke(); ctx.restore();
      ctx.beginPath(); ctx.arc(gx + gw * xs, Y(fs), 4, 0, IKI_PI); ctx.fillStyle = o.renk('--pirinc'); ctx.fill();
      ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif';
      ctx.textAlign = 'left'; o.etiket(ctx, 'ışık', 4, gy + 4);
      o.etiket(ctx, '−%' + U.sayi(dmax * 100, dmax < 0.1 ? 1 : 0), 4, gy + gh);
      if (!st.dokunur && st.bir.kesir > 1e-6) {
        ctx.textAlign = 'center';
        o.etiket(ctx, 'birincil', gx + gw * (st.bir.faz + 0.25), gy - 7);
        o.etiket(ctx, 'ikincil', gx + gw * (st.iki.faz + 0.25), gy - 7);
      }
      ctx.textAlign = 'right'; o.etiket(ctx, 'zaman → (bir dönem)', gx + gw, Math.min(h - 4, gy + gh + 16));
      yazDegisirse(S('otSimdi'), '%' + U.sayi(fs * 100, 1));
    }
    ['otR1', 'otR2', 'otT1', 'otT2', 'otA', 'otI', 'otP'].forEach(id => S(id).addEventListener('input', hesapla));
    S('otOn').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const x = orn[Number(b.dataset.i)]; if (!x) return;
      S('otR1').value = lg(x.R1); S('otR2').value = lg(x.R2); S('otT1').value = lg(x.T1); S('otT2').value = lg(x.T2);
      S('otA').value = lg(x.a); S('otI').value = x.i; S('otP').value = lg(x.P);
      kap.querySelectorAll('#otOn button').forEach(y => y.setAttribute('aria-pressed', String(y === b)));
      faz = 0.94; hesapla();
    });
    if (orn[0]) { const x = orn[0]; S('otR1').value = lg(x.R1); S('otR2').value = lg(x.R2); S('otT1').value = lg(x.T1); S('otT2').value = lg(x.T2); S('otA').value = lg(x.a); S('otI').value = x.i; S('otP').value = lg(x.P); }
    hesapla();
    return o.dongu(ciz);
  };
})();
