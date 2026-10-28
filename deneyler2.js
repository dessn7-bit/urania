/* deneyler2.js — Yeni deneyler: Kepler yasaları, gelgit, tayf ve Doppler, Ay evreleri ve tutulmalar,
   ötegezegen geçişi, genişleyen evren. simulasyon.js'teki ortak yardımcılarla (o) kurulur.
   Sabitler veri/fizik.json'dan, örnek cisimlerin değerleri veri/deney_veri.json'dan (kaynaklı).
   Hesap fonksiyonları window.UraniaDeneyHesap ile dışa açılır (testler buradan sınar). */
(function () {
  'use strict';
  const IKI_PI = Math.PI * 2, DER = Math.PI / 180;
  let V = null;                          // deney_veri.json
  const veriSoz = () => V ? Promise.resolve(V) : window.Urania.veri('deney_veri').then(v => (V = v));

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* Kepler denklemi M = E − e·sinE (Newton yöntemi) → dışmerkez anomali E */
    keplerE(M, e) {
      let E = e < 0.8 ? M : Math.PI;
      for (let i = 0; i < 50; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-12) break; }
      return E;
    },
    /* Odak merkezli konum (a birimiyle): x enberi yönünde */
    keplerKonum(a, e, M) {
      const E = H.keplerE(((M % IKI_PI) + IKI_PI) % IKI_PI, e);
      const b = a * Math.sqrt(1 - e * e);
      return { x: a * (Math.cos(E) - e), y: b * Math.sin(E), r: a * (1 - e * Math.cos(E)), E };
    },
    /* Kepler III, Güneş kütlesi ve AB–yıl birimleriyle: P² = a³/M */
    keplerP(aAB, mGunes) { return Math.sqrt(aAB * aAB * aAB / (mGunes || 1)); },
    /* vis-viva: v² = GM(2/r − 1/a) */
    visViva(GM, r, a) { return Math.sqrt(GM * (2 / r - 1 / a)); },
    /* Gelgit ivmesi (yüzeyde, çekim yönünde): 2GMR/d³ */
    gelgitIvme(G, M, R, d) { return 2 * G * M * R / (d * d * d); },
    /* Planck yasası: B_λ(T) = 2hc²/λ⁵ · 1/(e^{hc/λkT} − 1)  (W·sr⁻¹·m⁻³) */
    planck(lambda, T, h, c, k) { return 2 * h * c * c / Math.pow(lambda, 5) / Math.expm1(h * c / (lambda * k * T)); },
    /* Göreli Doppler: λ_göz = λ₀·√((1+β)/(1−β)), β > 0 uzaklaşma */
    doppler(lambda0, beta) { return lambda0 * Math.sqrt((1 + beta) / (1 - beta)); },
    /* Ay'ın aydınlık oranı: k = (1 + cos α)/2, α faz açısı ≈ 180° − uzanım (Meeus) */
    ayOran(uzanimDer) { return (1 + Math.cos((180 - uzanimDer) * DER)) / 2; },
    /* Ay'ın tutulum enlemi: sin β = sin i · sin u (u: yükselen düğümden açı) */
    ayEnlem(iDer, uDer) { return Math.asin(Math.sin(iDer * DER) * Math.sin(uDer * DER)) / DER; },
    /* İki dairenin kesişim alanı (yıldız R, gezegen r, merkezler arası d) */
    ortusme(R, r, d) {
      if (d >= R + r) return 0;
      if (d <= R - r) return Math.PI * r * r;
      if (d <= r - R) return Math.PI * R * R;
      const a1 = Math.acos((d * d + R * R - r * r) / (2 * d * R)), a2 = Math.acos((d * d + r * r - R * R) / (2 * d * r));
      return R * R * a1 + r * r * a2 - 0.5 * Math.sqrt(Math.max(0, (-d + R + r) * (d + R - r) * (d - R + r) * (d + R + r)));
    },
    /* Geçiş derinliği (tam içerideyken, düzgün parlak disk): (Rp/R*)² */
    derinlik(rp, rs) { return (rp / rs) * (rp / rs); },
    /* Geçiş süresi (dairesel yörünge; Winn 2010 denk. 14): T = P/π · asin( (Ryıldız / a)·√((1+k)² − b²) / sin i ) */
    gecisSure(P, a, rs, k, b) {
      const sinI = Math.sqrt(Math.max(0, 1 - Math.pow(b * rs / a, 2)));
      const ic = (rs / a) * Math.sqrt(Math.max(0, (1 + k) * (1 + k) - b * b)) / sinI;
      return ic >= 1 ? P / 2 : P / Math.PI * Math.asin(ic);
    },
    /* Hubble: v = H₀·d; Hubble zamanı 1/H₀ (yıl) — pc (m) ve Julian yılı ile */
    hubbleZamani(H0, pc, yilSn) { return (1e6 * pc / 1e3) / H0 / yilSn; },
    /* Orijinden geçen en küçük kareler eğimi: Σxy/Σx² */
    egim(ls) { let xy = 0, xx = 0; ls.forEach(([x, y]) => { xy += x * y; xx += x * x; }); return xx ? xy / xx : NaN; }
  };
  window.UraniaDeneyHesap = H;

  /* basit sözde rastgele (aynı tohum aynı dağılım) */
  function rastgele(tohum) { let s = tohum >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function kaynakLink(U, ls) { return ls.filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · '); }
  function onAyarDugme(U, ls, id) { return `<div class="cip-grup" id="${id}">${ls.map((x, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(x.ad)}</button>`).join('')}</div>`; }
  /* Azaltılmış hareket tercihinde animasyon yerine elle zaman kaydırıcısı */
  function zamanHtml(o, id, etiket) { return o.azHareket ? o.kaydirici(id, etiket, 0, 1, 'any', 0) : ''; }
  /* Her karede çağrılan yazımlar: metin aynıysa düğüme dokunma (ekran okuyucu aynı değeri yeniden okumasın) */
  function yazDegisirse(e, metin) { if (e && e.textContent !== metin) e.textContent = metin; }
  function zamanOku(kap, id) { const g = kap.querySelector('#' + id); if (!g) return null; yazDegisirse(kap.querySelector('#' + id + 'Cikti'), '%' + Math.round(Number(g.value) * 100)); return Number(g.value); }
  function yukleniyor(kap) { kap.innerHTML = '<p class="bos">Deney hazırlanıyor…</p>'; }
  function veriHata(kap, U, e) { kap.innerHTML = '<div class="hata-kutu">Deney verisi yüklenemedi: ' + U.kacis(e.message) + '</div>'; }
  /* Kurucular eşzamansız veriye bağlı: durdur() kurulum bitmeden çağrılırsa döngü hiç başlamasın */
  function eszamansiz(kap, o, kur) {
    let ic = null, durdu = false;
    yukleniyor(kap);
    veriSoz().then(v => { if (!durdu) ic = kur(v); }).catch(e => veriHata(kap, o.U, e));
    return { durdur() { durdu = true; if (ic && ic.durdur) ic.durdur(); } };
  }

  /* =================== 1. Kepler yasaları =================== */
  function kepler(kap, o) {
    const U = o.U;
    return eszamansiz(kap, o, v => {
      const GM = o.deger('GM_gunes'), AU = o.deger('au');
      const cis = v.kepler.cisimler;
      kap.innerHTML = `
        ${onAyarDugme(U, cis, 'kpOn')}
        <div class="sahne"><canvas id="kpKanvas"></canvas></div>
        <div class="kontroller">
          ${o.kaydirici('kpA', 'Yarı büyük eksen a', Math.log10(0.3), Math.log10(40), 'any', 0)}
          ${o.kaydirici('kpE', 'Dışmerkezlik e', 0, 0.97, 0.001, 0.0167)}
          ${zamanHtml(o, 'kpZaman', 'Yörüngede zaman (bir turun yüzdesi)')}
          <label class="secim-satir kucuk"><input type="checkbox" id="kpAlan" checked> <span>Eşit sürede taranan alanları göster (dolanım süresinin 12'de biri)</span></label>
        </div>
        ${o.olcumler([['kpP', 'Dolanım süresi (P² = a³)'], ['kpQ', 'Güneş\'e en yakın / en uzak'], ['kpVq', 'Hız: en yakında / en uzakta'], ['kpV', 'Şu anki hız', true], ['kpR', 'Şu anki uzaklık', true]])}
        <p class="kaynak">Hız vis-viva bağıntısıyla: v² = GM☉(2/r − 1/a). ${o.kaynakSatiri(['GM_gunes', 'au']).replace(/^<p class="kaynak">|<\/p>$/g, '')} · Örnek yörüngeler: ${kaynakLink(U, cis.map(c => ({ ad: c.kaynak, url: c.url })).filter((x, i, a) => a.findIndex(y => y.url === x.url) === i))}</p>`;
      const cv = kap.querySelector('#kpKanvas'), aS = kap.querySelector('#kpA'), eS = kap.querySelector('#kpE'), alanK = kap.querySelector('#kpAlan');
      let st = {}, faz = 0;
      function hesapla() {
        const a = Math.pow(10, Number(aS.value)), e = Number(eS.value);
        const P = H.keplerP(a, 1);
        const q = a * (1 - e), Q = a * (1 + e);
        const vq = H.visViva(GM, q * AU, a * AU), vQ = H.visViva(GM, Q * AU, a * AU);
        st = { a, e, P, q, Q, vq, vQ };
        kap.querySelector('#kpACikti').textContent = U.sayi(a, a < 10 ? 3 : 2) + ' AB';
        kap.querySelector('#kpECikti').textContent = U.sayi(e, 3);
        kap.querySelector('#kpP').textContent = P < 2 ? U.sayi(P * 365.25, 1) + ' gün' : U.sayi(P, 2) + ' yıl';
        kap.querySelector('#kpQ').textContent = U.sayi(q, 3) + ' / ' + U.sayi(Q, 3) + ' AB';
        kap.querySelector('#kpVq').textContent = U.sayi(vq / 1e3, 1) + ' / ' + U.sayi(vQ / 1e3, 1) + ' km/s';
      }
      function ciz(dt) {
        if (!o.azHareket) faz = (faz + dt / 10) % 1;          // bir tur 10 saniye
        else faz = zamanOku(kap, 'kpZaman') % 1;
        const { ctx, w, h } = o.kanvas(cv, 0.62);
        ctx.clearRect(0, 0, w, h);
        const { a, e } = st, b = a * Math.sqrt(1 - e * e);
        const s = Math.min((w - 30) / (2 * a), (h - 30) / (2 * b));
        const cx = w / 2 + a * e * s, cy = h / 2;             // odak (Güneş) sahnede; elips merkezi ortada
        const X = x => cx + x * s, Y = y => cy - y * s;
        if (alanK.checked) {
          for (let k = 0; k < 12; k++) {
            ctx.beginPath(); ctx.moveTo(cx, cy);
            for (let j = 0; j <= 20; j++) { const p = H.keplerKonum(a, e, IKI_PI * (k + j / 20) / 12); ctx.lineTo(X(p.x), Y(p.y)); }
            ctx.closePath();
            ctx.fillStyle = k % 2 ? 'rgba(200,164,93,.10)' : 'rgba(200,164,93,.22)';
            if (k === Math.floor(faz * 12)) ctx.fillStyle = 'rgba(200,164,93,.42)';
            ctx.fill();
          }
        }
        ctx.beginPath(); ctx.ellipse(w / 2, cy, a * s, b * s, 0, 0, IKI_PI);
        ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.4; ctx.stroke();
        /* Güneş ve öteki odak */
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, IKI_PI); ctx.fillStyle = '#FFD27A'; ctx.fill();
        ctx.beginPath(); ctx.arc(w / 2 - a * e * s, cy, 2.5, 0, IKI_PI); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1; ctx.stroke();
        const p = H.keplerKonum(a, e, IKI_PI * faz);
        ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 5, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(X(p.x), Y(p.y)); ctx.strokeStyle = o.renk('--soluk'); ctx.stroke();
        ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('enberi', X(a * (1 - e)) + 0, cy + 16);
        ctx.fillText('enöte', X(-a * (1 + e)), cy + 16);
        /* her karede değişir: yalnız metin değiştiyse yazılır (azaltılmış harekette aynı değer yeniden duyurulmasın) */
        yazDegisirse(kap.querySelector('#kpV'), U.sayi(H.visViva(GM, p.r * AU, a * AU) / 1e3, 1) + ' km/s');
        yazDegisirse(kap.querySelector('#kpR'), U.sayi(p.r, 3) + ' AB');
      }
      aS.addEventListener('input', hesapla); eS.addEventListener('input', hesapla);
      kap.querySelector('#kpOn').addEventListener('click', ev => {
        const b = ev.target.closest('button'); if (!b) return;
        const c = cis[Number(b.dataset.i)];
        aS.value = Math.log10(c.a); eS.value = c.e; hesapla();
      });
      hesapla();
      return o.dongu(ciz);
    });
  }

  /* =================== 2. Gelgit =================== */
  function gelgit(kap, o) {
    const U = o.U;
    return eszamansiz(kap, o, v => {
      const G = o.deger('G'), g0 = o.deger('g0');
      const d = v.gelgit;
      const R = d.dunya_yaricap_km * 1e3;
      kap.innerHTML = `
        <div class="sahne"><canvas id="ggKanvas"></canvas></div>
        <div class="kontroller">
          ${o.kaydirici('ggGun', 'Yeni Ay\'dan bu yana gün', 0, d.kavusum_gun, 0.05, 0)}
          <div class="cip-grup" id="ggUzak"><button type="button" class="dugme" data-u="yakin">Ay en yakında</button><button type="button" class="dugme" data-u="ort" aria-pressed="true">Ortalama</button><button type="button" class="dugme" data-u="uzak">Ay en uzakta</button></div>
          <label class="secim-satir kucuk"><input type="checkbox" id="ggGunes" checked> <span>Güneş'in gelgit etkisini ekle</span></label>
          ${zamanHtml(o, 'ggZaman', 'Dünya\'nın dönüşü (bir turun yüzdesi)')}
        </div>
        ${o.olcumler([['ggAy', 'Ay\'ın gelgit ivmesi'], ['ggGn', 'Güneş\'in gelgit ivmesi'], ['ggOran', 'Güneş / Ay'], ['ggDurum', 'Bu gün']])}
        <div class="deney-metin" id="ggMetin"></div>
        <p class="kaynak">Gelgit ivmesi ≈ 2GMR/d³ (yüzeyde, çeken cisme dönük noktada). Şekil abartılıdır: gerçek açık deniz kabarması yaklaşık yarım metre mertebesindedir, Dünya'nın yarıçapı ise 6371 km. Kaynaklar: ${kaynakLink(U, d.kaynaklar)}</p>`;
      const cv = kap.querySelector('#ggKanvas'), gS = kap.querySelector('#ggGun'), gnK = kap.querySelector('#ggGunes');
      let uzak = 'ort', st = {}, don = 0;
      function hesapla() {
        const dAy = (uzak === 'yakin' ? d.ay_yakin_km : uzak === 'uzak' ? d.ay_uzak_km : d.ay_ort_km) * 1e3;
        const aAy = H.gelgitIvme(G, d.ay_kutle_kg, R, dAy), aGn = H.gelgitIvme(G, d.gunes_kutle_kg, R, d.gunes_ort_km * 1e3);
        const aci = 360 * Number(gS.value) / d.kavusum_gun;     // Ay ile Güneş arasındaki açı (uzanım)
        st = { aAy, aGn, aci, gunes: gnK.checked };
        kap.querySelector('#ggGunCikti').textContent = U.sayi(Number(gS.value), 2) + ' gün';
        kap.querySelector('#ggAy').textContent = U.sayi(aAy / g0 * 1e7, 2) + ' × 10⁻⁷ g';
        kap.querySelector('#ggGn').textContent = U.sayi(aGn / g0 * 1e7, 2) + ' × 10⁻⁷ g';
        kap.querySelector('#ggOran').textContent = U.sayi(aGn / aAy, 2);
        const c = Math.cos(2 * aci * DER);                    // +1: aynı doğrultu (kabarma), −1: dik (ölü)
        const durum = c > 0.85 ? (Math.cos(aci * DER) > 0 ? 'Yeni Ay: kabarma gelgiti' : 'Dolunay: kabarma gelgiti') : (c < -0.85 ? 'Dördün: ölü gelgit' : 'Arada');
        kap.querySelector('#ggDurum').textContent = durum;
        /* Gelgit genliği (kabarma ile çekilme arası fark): iki P2 dalgasının toplamı, faz farkı 2θ */
        const genlik = st.gunes ? Math.sqrt(aAy * aAy + aGn * aGn + 2 * aAy * aGn * Math.cos(2 * aci * DER)) : aAy;
        kap.querySelector('#ggMetin').innerHTML = `<p>Ay ile Güneş aynı çizgideyken (yeni Ay ve dolunay) iki etki toplanır, dik açıdayken (dördünler) Güneş'in etkisi Ay'ınkini kısmen götürür. Kabarma ile çekilme arasındaki fark (gelgit genliği), Ay'ın tek başına yaptığına göre şu an: %${U.sayi(genlik / aAy * 100, 0)}.</p>`;
      }
      /* P2(cosφ) = (3cos²φ − 1)/2 biçimli şişme; görsel abartı */
      function sekil(phi) {
        let t = st.aAy * (3 * Math.pow(Math.cos(phi), 2) - 1) / 2;
        if (st.gunes) t += st.aGn * (3 * Math.pow(Math.cos(phi + st.aci * DER), 2) - 1) / 2;   // Güneş −uzanım yönünde çizilir
        return t / st.aAy;
      }
      function ciz(dt) {
        if (!o.azHareket) don = (don + dt / 6) % 1;            // Dünya'nın dönüşü: 6 sn'de bir tur (temsilî)
        else don = zamanOku(kap, 'ggZaman') % 1;
        const { ctx, w, h } = o.kanvas(cv, 0.62);
        ctx.clearRect(0, 0, w, h);
        const cx = w * 0.42, cy = h * 0.5, R0 = h * 0.26, ab = R0 * 0.16;
        /* okyanus kabuğu */
        ctx.beginPath();
        for (let k = 0; k <= 180; k++) { const ph = k / 180 * IKI_PI; const r = R0 + ab * (1 + sekil(ph)) * 0.6; ctx.lineTo(cx + Math.cos(ph) * r, cy - Math.sin(ph) * r); }
        ctx.closePath(); ctx.fillStyle = 'rgba(80,140,200,.45)'; ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, R0, 0, IKI_PI); ctx.fillStyle = '#2C5A7A'; ctx.fill();
        /* dönen gözlemci noktası */
        const ph = don * IKI_PI;
        ctx.beginPath(); ctx.arc(cx + Math.cos(ph) * R0, cy - Math.sin(ph) * R0, 4, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
        /* Ay: sağda (0°); Güneş yönü −uzanım */
        ctx.beginPath(); ctx.arc(w * 0.88, cy, 10, 0, IKI_PI); ctx.fillStyle = '#CFCFCF'; ctx.fill();
        ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 12px Plex, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Ay', w * 0.88, cy + 26);
        if (st.gunes) {
          const ga = -st.aci * DER, gx = cx + Math.cos(ga) * h * 0.44, gy = cy - Math.sin(ga) * h * 0.44;
          ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(255,210,122,.6)'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(gx, gy); ctx.stroke(); ctx.restore();
          ctx.beginPath(); ctx.arc(gx, gy, 9, 0, IKI_PI); ctx.fillStyle = '#FFD27A'; ctx.fill();
          ctx.fillStyle = o.renk('--soluk'); ctx.fillText('Güneş yönü', Math.min(w - 36, Math.max(36, gx)), Math.min(h - 4, Math.max(12, gy + (gy > cy ? 24 : -14))));
        }
        /* noktadaki deniz seviyesi: bir gün boyunca grafik (iki kabarma) */
        const gx0 = w * 0.06, gy0 = h * 0.9, gw = w * 0.32, gh = h * 0.12;
        ctx.strokeStyle = o.renk('--cizgi'); ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0 + gw, gy0); ctx.stroke();
        ctx.beginPath();
        for (let k = 0; k <= 100; k++) { const p = k / 100 * IKI_PI; const y = gy0 - gh / 2 - sekil(p) * gh / 3.2; if (k) ctx.lineTo(gx0 + gw * k / 100, y); else ctx.moveTo(gx0, y); }
        ctx.strokeStyle = 'rgba(120,170,220,.9)'; ctx.stroke();
        ctx.beginPath(); ctx.arc(gx0 + gw * don, gy0 - gh / 2 - sekil(ph) * gh / 3.2, 3, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
        ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left'; ctx.font = '500 11px Plex, sans-serif';
        ctx.fillText('noktadaki deniz seviyesi, bir dönüş', gx0, gy0 + 14);
      }
      gS.addEventListener('input', hesapla); gnK.addEventListener('change', hesapla);
      kap.querySelector('#ggUzak').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        uzak = b.dataset.u;
        kap.querySelectorAll('#ggUzak button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        hesapla();
      });
      hesapla();
      return o.dongu(ciz);
    });
  }

  /* =================== 3. Tayf ve Doppler =================== */
  function tayf(kap, o) {
    const U = o.U;
    return eszamansiz(kap, o, v => {
      const h = o.deger('h'), c = o.deger('c'), k = o.deger('k_B'), b = o.deger('b_wien');
      const cizgiler = v.tayf.cizgiler;
      const yildizlar = v.tayf.yildizlar;
      kap.innerHTML = `
        ${onAyarDugme(U, yildizlar, 'tyOn')}
        <div class="sahne"><canvas id="tyKanvas"></canvas></div>
        <div class="sahne tayf-serit"><canvas id="tySerit"></canvas></div>
        <div class="kontroller">
          ${o.kaydirici('tyT', 'Yüzey sıcaklığı', Math.log10(2500), Math.log10(40000), 'any', Math.log10(5772))}
          ${o.kaydirici('tyV', 'Bize göre hız (+ uzaklaşıyor, − yaklaşıyor)', -1, 1, 'any', 0)}
        </div>
        ${o.olcumler([['tyTepe', 'En parlak dalga boyu (Wien)'], ['tyBolge', 'Tepe nerede'], ['tyHa', 'Hα çizgisi gözlenen'], ['tyKayma', 'Kayma']])}
        <div class="deney-metin" id="tyMetin"></div>
        <p class="kaynak">Şeritte siyah çizgiler gözlenen yer, alttaki kesik çizgiler durgun yer. Eğri Planck yasası; renk kutusu yaklaşık. Çizgi dalga boyları havada ölçülen değerler. ${o.kaynakSatiri(['h', 'c', 'k_B', 'b_wien']).replace(/^<p class="kaynak">|<\/p>$/g, '')} · ${kaynakLink(U, v.tayf.kaynaklar)}</p>`;
      const cv = kap.querySelector('#tyKanvas'), sv = kap.querySelector('#tySerit');
      const tS = kap.querySelector('#tyT'), vS = kap.querySelector('#tyV');
      let st = {};
      /* hız kaydırıcısı: −1..1 → ±30.000 km/s, ortası ayrıntılı (küp) */
      const hiz = x => Math.sign(x) * Math.pow(Math.abs(x), 3) * 30000;
      function bolge(nm) { return nm < 380 ? 'morötesi' : nm < 450 ? 'mor' : nm < 495 ? 'mavi' : nm < 570 ? 'yeşil' : nm < 590 ? 'sarı' : nm < 620 ? 'turuncu' : nm < 750 ? 'kırmızı' : 'kızılötesi'; }
      function hesapla() {
        const T = Math.pow(10, Number(tS.value)), vk = hiz(Number(vS.value)), beta = vk * 1e3 / c;
        const tepe = b / T * 1e9;
        const ha = cizgiler.find(x => /α/.test(x.ad)) || cizgiler[0];
        const haG = H.doppler(ha.nm, beta);
        st = { T, vk, beta, tepe };
        kap.querySelector('#tyTCikti').textContent = U.sayi(T, 0) + ' K';
        kap.querySelector('#tyVCikti').textContent = (vk > 0 ? '+' : vk < 0 ? '−' : '') + U.sayi(Math.abs(vk), Math.abs(vk) < 100 ? 1 : 0) + ' km/s';
        kap.querySelector('#tyTepe').textContent = U.sayi(tepe, 0) + ' nm';
        kap.querySelector('#tyBolge').textContent = bolge(tepe);
        kap.querySelector('#tyHa').textContent = U.sayi(haG, 2) + ' nm (durgunda ' + U.sayi(ha.nm, 2) + ')';
        kap.querySelector('#tyKayma').textContent = Math.abs(beta) < 1e-7 ? 'yok' : (beta > 0 ? 'kırmızıya ' : 'maviye ') + U.sayi(Math.abs(haG - ha.nm), 2) + ' nm (z = ' + (haG < ha.nm ? '−' : '') + U.sayi(Math.abs(haG - ha.nm) / ha.nm, 5) + ')';
        kap.querySelector('#tyMetin').innerHTML = `<p>${U.sayi(T, 0)} K sıcaklıktaki bir yıldız en çok ${U.sayi(tepe, 0)} nm dalga boyunda (${bolge(tepe)}) ışır: sıcaklık arttıkça tepe kısa dalga boylarına kayar (Wien yasası) ve toplam ışınım çok hızlı artar.${Math.abs(vk) > 0.5 ? ` Yıldız bize göre saniyede ${U.sayi(Math.abs(vk), 0)} km ${vk > 0 ? 'uzaklaştığı için çizgiler kırmızıya (uzun dalga boyuna)' : 'yaklaştığı için çizgiler maviye (kısa dalga boyuna)'} kayıyor. Bütün çizgiler aynı oranda kaydığı için hangi elementin çizgisi olduğunu tanıyıp hızı ölçebilirsin.` : ''}</p>`;
        ciz();
      }
      function ciz() {
        const { ctx, w, h: hh } = o.kanvas(cv, 0.5);
        ctx.clearRect(0, 0, w, hh);
        const sol = 40, sag = 10, ust = 10, alt = 28, l0 = 100, l1 = 2500;
        const X = nm => sol + (nm - l0) / (l1 - l0) * (w - sol - sag);
        /* görünür bant */
        for (let nm = 380; nm < 750; nm += 2) { ctx.fillStyle = gorunurRenk(nm, 0.18); ctx.fillRect(X(nm), ust, X(nm + 2) - X(nm) + 0.5, hh - ust - alt); }
        let enB = 0; const ls = [];
        for (let nm = l0; nm <= l1; nm += 5) { const B = H.planck(nm * 1e-9, st.T, h, c, k); ls.push([nm, B]); if (B > enB) enB = B; }
        ctx.beginPath(); ls.forEach(([nm, B], i) => { const x = X(nm), y = hh - alt - B / enB * (hh - ust - alt) * 0.95; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
        ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 2; ctx.stroke();
        if (st.tepe >= l0) { ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = o.renk('--pirinc'); ctx.beginPath(); ctx.moveTo(X(st.tepe), ust); ctx.lineTo(X(st.tepe), hh - alt); ctx.stroke(); ctx.restore(); }
        ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'center';
        [500, 1000, 1500, 2000, 2500].forEach(nm => ctx.fillText(nm + ' nm', X(nm), hh - 10));
        /* yıldız rengi kutusu */
        ctx.beginPath(); ctx.arc(w - 30, ust + 22, 14, 0, IKI_PI); ctx.fillStyle = yildizRengi(st.T); ctx.fill();
        /* tayf şeridi: 380–750 nm, soğurma çizgileri */
        const s = o.kanvas(sv, 0.14);
        s.ctx.clearRect(0, 0, s.w, s.h);
        const sx = nm => (nm - 380) / (750 - 380) * s.w;
        for (let nm = 380; nm < 750; nm += 1) { s.ctx.fillStyle = gorunurRenk(nm, 1); s.ctx.fillRect(sx(nm), 0, sx(nm + 1) - sx(nm) + 0.5, s.h * 0.75); }
        cizgiler.forEach(cz => {
          const g = H.doppler(cz.nm, st.beta);
          if (cz.nm >= 380 && cz.nm <= 750) { s.ctx.strokeStyle = 'rgba(255,255,255,.55)'; s.ctx.setLineDash([2, 3]); s.ctx.beginPath(); s.ctx.moveTo(sx(cz.nm), s.h * 0.75); s.ctx.lineTo(sx(cz.nm), s.h); s.ctx.stroke(); s.ctx.setLineDash([]); }
          if (g >= 380 && g <= 750) { s.ctx.fillStyle = '#000'; s.ctx.fillRect(sx(g) - 1.2, 0, 2.4, s.h * 0.75); }
        });
      }
      tS.addEventListener('input', hesapla); vS.addEventListener('input', hesapla);
      kap.querySelector('#tyOn').addEventListener('click', e => {
        const bt = e.target.closest('button'); if (!bt) return;
        tS.value = Math.log10(yildizlar[Number(bt.dataset.i)].T); hesapla();
      });
      window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);   // kırmızı mod değişince renkler yenilensin
      hesapla();
      return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
    });
  }
  /* görünür dalga boyu → yaklaşık renk (yalnız görsel) */
  function gorunurRenk(nm, alfa) {
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
    const f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (750 - nm) / 50 : 1;
    return `rgba(${Math.round(255 * r * f)},${Math.round(255 * g * f)},${Math.round(255 * b * f)},${alfa})`;
  }
  function yildizRengi(t) {
    if (t > 25000) return '#A9C1FF'; if (t > 10000) return '#C8D6FF'; if (t > 7500) return '#F1F3FF';
    if (t > 6000) return '#FFF4E0'; if (t > 5200) return '#FFE8B0'; if (t > 3700) return '#FFC98C'; return '#FF9E6A';
  }

  /* =================== 4. Ay evreleri ve tutulmalar =================== */
  function evreler(kap, o) {
    const U = o.U;
    return eszamansiz(kap, o, v => {
      const d = v.evreler;
      kap.innerHTML = `
        <div class="sahne"><canvas id="evKanvas"></canvas></div>
        <div class="kontroller">
          ${o.kaydirici('evGun', 'Yeni Ay\'dan bu yana gün', 0, d.kavusum_gun, 0.05, 0)}
          ${o.kaydirici('evMevsim', 'Güneş\'in Ay yörüngesinin düğümüne açısı', 0, 360, 1, 40)}
        </div>
        ${o.olcumler([['evAd', 'Evre'], ['evOran', 'Aydınlık kısım'], ['evEnlem', 'Ay tutulumun ne kadar üstünde/altında'], ['evTut', 'Tutulma']])}
        <div class="deney-metin" id="evMetin"></div>
        <p class="kaynak">Aydınlık oran k = (1 + cos α)/2 (α: faz açısı, yaklaşık 180° − uzanım). Ay'ın yörüngesi tutuluma ${U.sayi(d.egim_derece, 3)}° eğik; yeni Ay ya da dolunay anında Ay tutulumdan yaklaşık ${U.sayi(d.tutulma_enlem_derece, 1)}°'den yakınsa tutulma olabilir (yaklaşık sınır). Çizim ölçekli değildir. Kaynaklar: ${kaynakLink(U, d.kaynaklar)}</p>`;
      const cv = kap.querySelector('#evKanvas'), gS = kap.querySelector('#evGun'), mS = kap.querySelector('#evMevsim');
      let st = {};
      function hesapla() {
        const gun = Number(gS.value);
        const uzanim = 360 * gun / d.kavusum_gun;
        const k = H.ayOran(uzanim);
        const dugumAci = Number(mS.value);                      // Güneş'in yükselen düğümden açısı
        const u = (dugumAci + uzanim) % 360;                   // Ay'ın yükselen düğümden açısı
        const beta = H.ayEnlem(d.egim_derece, u);
        const yeni = Math.abs(((uzanim + 180) % 360) - 180) < 7.5, dolun = Math.abs(uzanim - 180) < 7.5;   // evre adıyla (gok.js evreAdi) aynı eşik
        const tutulma = (yeni || dolun) && Math.abs(beta) < d.tutulma_enlem_derece;
        st = { uzanim, k, beta, dugumAci, yeni, dolun, tutulma };
        kap.querySelector('#evGunCikti').textContent = U.sayi(gun, 2) + ' gün';
        kap.querySelector('#evMevsimCikti').textContent = U.sayi(dugumAci, 0) + '°';
        kap.querySelector('#evAd').textContent = window.Gok ? window.Gok.evreAdi(uzanim) : '';
        kap.querySelector('#evOran').textContent = '%' + U.sayi(k * 100, 0);
        kap.querySelector('#evEnlem').textContent = (beta >= 0 ? '+' : '−') + U.sayi(Math.abs(beta), 2) + '°';
        kap.querySelector('#evTut').textContent = tutulma ? (yeni ? 'Güneş tutulması olabilir' : 'Ay tutulması olabilir') : (yeni || dolun ? 'Yok: Ay tutulumun ' + (beta > 0 ? 'üstünden' : 'altından') + ' geçiyor' : '—');
        kap.querySelector('#evMetin').innerHTML = `<p>Ay'ın her zaman yarısı aydınlıktır; evre, o aydınlık yarının ne kadarını gördüğümüzdür. Yeni Ay'da Ay, Güneş ile aynı yönde olduğu için karanlık yüzü bize döner; dolunayda Güneş'in tam karşısındadır.${yeni || dolun ? (tutulma ? ' Şu an Ay düğüme yakın: gölgeler hizalanıyor, tutulma olabilir.' : ' Ay\'ın yörüngesi eğik olduğu için çoğu ay gölge Dünya\'nın ya da Ay\'ın üstünden veya altından geçer; tutulma için hem yeni Ay/dolunay hem de Ay\'ın düğüm noktası yakınında olması gerekir.') : ''}</p>`;
        ciz();
      }
      function ciz() {
        const { ctx, w, h } = o.kanvas(cv, 0.72);
        ctx.clearRect(0, 0, w, h);
        /* sol: üstten görünüş (Güneş ışığı sağdan) */
        const cx = w * 0.27, cy = h * 0.4, ro = Math.min(w * 0.2, h * 0.3);
        ctx.strokeStyle = o.renk('--cizgi'); ctx.beginPath(); ctx.arc(cx, cy, ro, 0, IKI_PI); ctx.stroke();
        for (let y = -2; y <= 2; y++) { ctx.strokeStyle = 'rgba(255,210,122,.35)'; ctx.beginPath(); ctx.moveTo(w * 0.5, cy + y * 18); ctx.lineTo(w * 0.47, cy + y * 18); ctx.stroke(); }
        ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('← Güneş ışığı', w * 0.4, 14);
        ctx.beginPath(); ctx.arc(cx, cy, 11, 0, IKI_PI); ctx.fillStyle = '#2C5A7A'; ctx.fill();
        const a = st.uzanim * DER;                              // Ay, Güneş yönünden (sağ) saat tersine
        const mx = cx + Math.cos(a) * ro, my = cy - Math.sin(a) * ro;
        ctx.beginPath(); ctx.arc(mx, my, 8, 0, IKI_PI); ctx.fillStyle = '#333'; ctx.fill();
        ctx.beginPath(); ctx.arc(mx, my, 8, -Math.PI / 2, Math.PI / 2); ctx.fillStyle = '#E8E8E8'; ctx.fill();   // sağ yarı (Güneş'e bakan)
        /* sağ: Dünya'dan görünüş */
        const vx = w * 0.72, vy = h * 0.38, vr = Math.min(w * 0.15, h * 0.26);
        ctx.beginPath(); ctx.arc(vx, vy, vr, 0, IKI_PI); ctx.fillStyle = '#2A2A2A'; ctx.fill();
        /* aydınlık bölge: büyüyende sağ (Kuzey yarım küre), terminatör elips */
        const buyuyen = st.uzanim < 180, kk = st.k;
        ctx.save(); ctx.translate(vx, vy); if (!buyuyen) ctx.scale(-1, 1);
        ctx.beginPath(); ctx.arc(0, 0, vr, -Math.PI / 2, Math.PI / 2);   // sağ yarı daire
        const ex = vr * Math.abs(1 - 2 * kk);
        ctx.ellipse(0, 0, ex, vr, 0, Math.PI / 2, -Math.PI / 2, kk < 0.5);
        ctx.fillStyle = '#EDEDED'; ctx.fill(); ctx.restore();
        ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'center'; ctx.fillText('Dünya\'dan (kuzey yarım küre)', vx, vy + vr + 18);
        /* alt şerit: yan görünüş — Ay'ın tutuluma göre yüksekliği (abartılı) */
        const by = h * 0.84, bw = w * 0.9, bx = w * 0.05;
        ctx.strokeStyle = 'rgba(255,210,122,.6)'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.stroke();
        ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left'; ctx.fillText('yandan: tutulum düzlemi ve Ay (eğim abartılı)', bx, Math.min(h - 4, by + 32));
        const yAy = by - st.beta * 3.2;
        ctx.beginPath(); ctx.arc(bx + bw * (st.uzanim / 360), yAy, 5, 0, IKI_PI); ctx.fillStyle = st.tutulma ? o.renk('--pirinc') : '#DDD'; ctx.fill();
      }
      gS.addEventListener('input', hesapla); mS.addEventListener('input', hesapla);
      window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);   // kırmızı mod değişince renkler yenilensin
      hesapla();
      return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
    });
  }

  /* =================== 5. Ötegezegen geçişi =================== */
  function gecis(kap, o) {
    const U = o.U;
    return eszamansiz(kap, o, v => {
      const d = v.gecis, AU = o.deger('au'), RG = o.deger('R_gunes'), GMg = o.deger('GM_gunes');
      const RD = d.dunya_yaricap_km * 1e3;
      const orn = d.ornekler;
      kap.innerHTML = `
        ${onAyarDugme(U, orn, 'gcOn')}
        <div class="sahne"><canvas id="gcKanvas"></canvas></div>
        <div class="kontroller">
          ${o.kaydirici('gcRp', 'Gezegen yarıçapı (Dünya = 1)', Math.log10(0.5), Math.log10(25), 'any', 0)}
          ${o.kaydirici('gcRs', 'Yıldız yarıçapı (Güneş = 1)', Math.log10(0.1), Math.log10(3), 'any', 0)}
          ${o.kaydirici('gcMs', 'Yıldız kütlesi (Güneş = 1)', Math.log10(0.08), Math.log10(2), 'any', 0)}
          ${o.kaydirici('gcP', 'Dolanım süresi (gün)', Math.log10(0.5), Math.log10(5000), 'any', Math.log10(365.256))}
          ${o.kaydirici('gcB', 'Geçiş yolunun merkeze uzaklığı b (0 = tam ortadan)', 0, 1.2, 0.01, 0)}
          ${zamanHtml(o, 'gcZaman', 'Geçişte zaman (pencerenin yüzdesi)')}
        </div>
        ${o.olcumler([['gcDer', 'Işıktaki düşüş (derinlik)'], ['gcSure', 'Geçiş süresi'], ['gcA', 'Yörünge yarıçapı a'], ['gcSayi', 'Bir yılda geçiş sayısı']])}
        <div class="deney-metin" id="gcMetin"></div>
        <p class="kaynak">Yıldız düzgün parlak bir disk varsayıldı (kenar kararması yok); yörünge dairesel. Derinlik en çok örtülen alanın yıldız diskine oranı (tam içerideyken (Rp/R*)²), süre Winn (2010) formülü, a Kepler III ile. Kaynaklar: ${kaynakLink(U, d.kaynaklar)}</p>`;
      const cv = kap.querySelector('#gcKanvas');
      const S = id => kap.querySelector('#' + id);
      let st = {}, faz = 0;
      function hesapla() {
        const rp = Math.pow(10, Number(S('gcRp').value)) * RD, rs = Math.pow(10, Number(S('gcRs').value)) * RG;
        const ms = Math.pow(10, Number(S('gcMs').value)), P = Math.pow(10, Number(S('gcP').value)) * 86400;
        const a = Math.cbrt(GMg * ms * P * P / (4 * Math.PI * Math.PI));
        const b = Number(S('gcB').value), k = rp / rs;
        const derin = H.ortusme(1, k, b) / Math.PI;           // en derin an: merkezler arası uzaklık b; sıyırmada ve k > 1'de de doğru
        const icinde = a <= rs * (1 + k);                    // yörünge yıldızın (ya da gezegen yıldıza değecek kadar) içinde
        const gecer = !icinde && b < 1 + k;
        const T = gecer ? H.gecisSure(P, a, rs, k, b) : 0;
        st = { rp, rs, a, b, k, derin, T, P, gecer, icinde };
        S('gcRpCikti').textContent = U.sayi(rp / RD, 2) + ' R⊕ (' + U.sayi(rp / 1e3, 0) + ' km)';
        S('gcRsCikti').textContent = U.sayi(rs / RG, 2) + ' R☉';
        S('gcMsCikti').textContent = U.sayi(ms, 2) + ' M☉';
        S('gcPCikti').textContent = U.sayi(P / 86400, P / 86400 < 10 ? 2 : 1) + ' gün';
        S('gcBCikti').textContent = U.sayi(b, 2);
        S('gcDer').textContent = icinde ? 'fiziksel değil' : gecer ? (derin >= 0.001 ? '%' + U.sayi(derin * 100, 2) : U.sayi(derin * 1e6, 0) + ' ppm (milyonda)') : 'geçiş yok';
        S('gcSure').textContent = gecer ? U.sayi(T / 3600, 2) + ' saat' : '—';
        S('gcA').textContent = U.sayi(a / AU, 4) + ' AB';
        S('gcSayi').textContent = gecer ? U.sayi(365.25 * 86400 / P, 1) : '—';
        S('gcMetin').innerHTML = gecer
          ? `<p>Gezegenin çapının yıldızın çapına oranı: %${U.sayi(k * 100, 1)}. Önünden geçerken örttüğü en büyük pay, yani ışıktaki düşüş: ${derin >= 0.001 ? '%' + U.sayi(derin * 100, 2) : 'milyonda ' + U.sayi(derin * 1e6, 0)}. Derinlik gezegenin büyüklüğünü, süre ve tekrar aralığı yörüngesini verir.${k >= 1 ? ' Gezegen yıldızdan büyük: geçerken yıldızı tamamen örtebilir (bu artık bir örten çift yıldıza benzer).' : b > 1 - k ? ' Yol yıldızın kenarından geçiyor: gezegen diske hiç tam girmiyor, geçiş kısa ve sığ.' : b > 0.8 ? ' Yol yıldızın kenarına yakın: geçiş kısa.' : ''}</p>`
          : icinde ? '<p>Bu kütle ve dolanım süresiyle yörünge yıldızın içinde ya da yüzeyine değecek kadar yakın kalıyor: böyle bir gezegen olamaz. Dolanım süresini uzat ya da yıldızı küçült.</p>'
          : '<p>Bu açıyla gezegen yıldızın önünden geçmiyor: geçiş yöntemi yalnız yörüngesini yandan gördüğümüz gezegenleri yakalar.</p>';
        ciz(0);
      }
      function ciz(dt) {
        if (!o.azHareket) faz = (faz + (dt || 0) / 8) % 1;
        else faz = zamanOku(kap, 'gcZaman') % 1;
        const { ctx, w, h } = o.kanvas(cv, 0.72);
        ctx.clearRect(0, 0, w, h);
        /* üst: yıldız diski ve gezegen (gezegen boyu ölçekli; en az 2 piksel) */
        const R = h * 0.2, cx = w / 2, cy = h * 0.26;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, IKI_PI); ctx.fillStyle = '#FFE8B0'; ctx.fill();
        const r = Math.max(2, R * st.k);
        const gen = (1 + st.k) * 1.15;                        // geçiş penceresi (yıldız yarıçapı biriminde)
        const xr = -gen + 2 * gen * faz;                      // yıldız yarıçapı biriminde konum
        const px = cx + xr * R, py = cy + st.b * R;
        if (st.gecer) { ctx.beginPath(); ctx.arc(px, py, r, 0, IKI_PI); ctx.fillStyle = '#111'; ctx.fill(); }
        /* alt: ışık eğrisi */
        const gx = 40, gy = h * 0.55, gw = w - 60, gh = h * 0.36;
        const dmax = Math.max(st.derin * 1.3, 1e-4);
        const Y = f => gy + (1 - f) / dmax * gh;
        ctx.strokeStyle = o.renk('--cizgi'); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const x = -gen + 2 * gen * i / 200;
          const d = Math.hypot(x, st.b);
          const f = st.gecer ? 1 - H.ortusme(1, st.k, d) / Math.PI : 1;
          const X = gx + gw * i / 200; if (i) ctx.lineTo(X, Y(f)); else ctx.moveTo(X, Y(f));
        }
        ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.8; ctx.stroke();
        if (st.gecer) { const f = 1 - H.ortusme(1, st.k, Math.hypot(xr, st.b)) / Math.PI; ctx.beginPath(); ctx.arc(gx + gw * faz, Y(f), 4, 0, IKI_PI); ctx.fillStyle = o.renk('--pirinc'); ctx.fill(); }
        ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('ışık', 4, gy + 4); ctx.fillText('zaman →', gx + gw - 50, gy + gh + 16);
        ctx.fillText('−' + (dmax * 100 >= 0.1 ? '%' + U.sayi(dmax * 100, 2) : U.sayi(dmax * 1e6, 0) + ' ppm'), 4, gy + gh);
      }
      ['gcRp', 'gcRs', 'gcMs', 'gcP', 'gcB'].forEach(id => S(id).addEventListener('input', hesapla));
      S('gcOn').addEventListener('click', e => {
        const bt = e.target.closest('button'); if (!bt) return;
        const x = orn[Number(bt.dataset.i)];
        S('gcRp').value = Math.log10(x.rp_rdunya); S('gcRs').value = Math.log10(x.rs_rgunes); S('gcMs').value = Math.log10(x.ms_mgunes);
        S('gcP').value = Math.log10(x.p_gun); S('gcB').value = x.b != null ? x.b : 0; hesapla();
      });
      hesapla();
      return o.dongu(ciz);
    });
  }

  /* =================== 6. Genişleyen evren (Hubble) =================== */
  function hubble(kap, o) {
    const U = o.U;
    return eszamansiz(kap, o, v => {
      const d = v.hubble, pc = o.deger('pc');
      const YIL = 365.25 * 86400;
      kap.innerHTML = `
        <div class="sahne"><canvas id="hbKanvas"></canvas></div>
        <div class="kontroller">
          ${o.kaydirici('hbH', 'Evrenin genişleme hızı H₀ (km/s/Mpc)', 50, 90, 0.1, 70)}
          <label class="secim-satir kucuk"><input type="checkbox" id="hbOzel" checked> <span>Galaksilerin kendi hareketlerini ekle (noktalara saçılma ekler)</span></label>
          <div class="cip-grup"><button type="button" class="dugme" id="hbYeni">Başka galaksiden bak</button></div>
        </div>
        ${o.olcumler([['hbOlc', 'Grafikten ölçtüğün H₀'], ['hbZaman', 'Hubble zamanı (1/H₀)'], ['hbPlanck', d.olcumler[0].ad], ['hbSh', d.olcumler[1].ad]])}
        <div class="deney-metin" id="hbMetin"></div>
        <p class="kaynak">Galaksiler temsilîdir (rastgele yerleştirildi); hızlar v = H₀·d; isteğe bağlı olarak her galaksiye en çok ±${U.sayi(d.ozel_hiz_kms, 0)} km/s rastgele ek hız verilir (temsilî). Hubble zamanı evrenin yaşı değildir, ama aynı mertebededir. Kaynaklar: ${kaynakLink(U, d.olcumler.concat(d.kaynaklar || []))}</p>`;
      const cv = kap.querySelector('#hbKanvas'), hS = kap.querySelector('#hbH'), oK = kap.querySelector('#hbOzel');
      let ev = 0, gal = [], merkez = 0, olcek = 1, tohum = 7;
      function kur() {
        const r = rastgele(tohum);
        gal = Array.from({ length: 36 }, () => ({ x: (r() - 0.5) * 2, y: (r() - 0.5) * 2, oz: (r() * 2 - 1) }));
        merkez = Math.floor(r() * gal.length);
      }
      function veriNoktalari() {
        const H0 = Number(hS.value), m = gal[merkez];
        return gal.filter((g, i) => i !== merkez).map(g => {
          const dMpc = Math.hypot(g.x - m.x, g.y - m.y) * 100;   // sahne birimi: 100 Mpc
          const vk = H0 * dMpc + (oK.checked ? g.oz * d.ozel_hiz_kms : 0);
          return [dMpc, vk];
        });
      }
      function hesapla() {
        const H0 = Number(hS.value);
        const ls = veriNoktalari();
        const olc = H.egim(ls);
        kap.querySelector('#hbHCikti').textContent = U.sayi(H0, 1);
        kap.querySelector('#hbOlc').textContent = U.sayi(olc, 1) + ' km/s/Mpc';
        kap.querySelector('#hbZaman').textContent = U.sayi(H.hubbleZamani(olc, pc, YIL) / 1e9, 1) + ' milyar yıl';
        kap.querySelector('#hbPlanck').textContent = U.sayi(d.olcumler[0].deger, 1) + ' ± ' + U.sayi(d.olcumler[0].hata, 1);
        kap.querySelector('#hbSh').textContent = U.sayi(d.olcumler[1].deger, 2) + ' ± ' + U.sayi(d.olcumler[1].hata, 2);
        kap.querySelector('#hbMetin').innerHTML = `<p>Hangi galaksiden bakarsan bak, öteki galaksiler senden uzaklaşıyor ve iki kat uzaktaki iki kat hızlı uzaklaşıyor: v = H₀·d. Bu, evrenin bir merkezi olmadan her yerde birlikte genişlemesinin işareti. Grafikteki noktalardan geçen doğrunun eğimi H₀'ı verir; 1/H₀ ise genişleme hep aynı hızla sürseydi her şeyin bir arada olduğu ana kadar geçen süredir.</p>`;
      }
      function ciz(dt) {
        if (!o.azHareket) ev = (ev + dt / 6) % 1;
        olcek = 1 + 0.35 * ev;                               // sahnede ölçek çarpanı büyüyor
        const { ctx, w, h } = o.kanvas(cv, 0.95);
        ctx.clearRect(0, 0, w, h);
        /* üst: galaksiler (seçili galaksi merkezde, ölçek büyüyor) */
        const ust = h * 0.5, cx = w / 2, cy = ust / 2, s = Math.min(w, ust) * 0.45 / 1.4;
        const m = gal[merkez];
        gal.forEach((g, i) => {
          const x = cx + (g.x - m.x) * s * olcek, y = cy - (g.y - m.y) * s * olcek;
          if (x < -10 || x > w + 10 || y < -10 || y > ust + 10) return;
          ctx.beginPath(); ctx.ellipse(x, y, i === merkez ? 6 : 4, i === merkez ? 4 : 2.5, (i * 0.7) % 3, 0, IKI_PI);
          ctx.fillStyle = i === merkez ? o.renk('--pirinc') : '#CBD7F0'; ctx.fill();
          /* Senin galaksin renkten başka halkayla da ayrılır (kırmızı modda renkler birbirine yaklaşır) */
          if (i === merkez) { ctx.beginPath(); ctx.arc(x, y, 10, 0, IKI_PI); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1; }
          if (i !== merkez) {
            const vx = (g.x - m.x), vy = (g.y - m.y), L = 0.12;
            ctx.strokeStyle = 'rgba(203,215,240,.35)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + vx * s * L, y - vy * s * L); ctx.stroke();
          }
        });
        ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('halkalı: senin galaksin · oklar: uzaklaşma hızı', 6, 14);
        /* alt: hız–uzaklık grafiği */
        const gx = 46, gy = ust + 14, gw = w - 60, gh = h - ust - 44;
        const ls = veriNoktalari(), dMax = Math.max(...ls.map(p => p[0])), vMax = Math.max(...ls.map(p => p[1])) * 1.1;
        ctx.strokeStyle = o.renk('--cizgi'); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh); ctx.stroke();
        ls.forEach(([dd, vv]) => { ctx.beginPath(); ctx.arc(gx + dd / dMax * gw, gy + gh - vv / vMax * gh, 3, 0, IKI_PI); ctx.fillStyle = '#CBD7F0'; ctx.fill(); });
        const k = H.egim(ls);
        ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh - k * dMax / vMax * gh); ctx.stroke(); ctx.lineWidth = 1;
        ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'center';
        ctx.fillText('uzaklık (Mpc) →', gx + gw / 2, h - 8);
        /* eksen uçları: en uzak noktanın uzaklığı ve hız ekseninin üst değeri */
        ctx.textAlign = 'right'; ctx.fillText(U.sayi(dMax, 0), gx + gw, gy + gh + 13);
        ctx.textAlign = 'left'; ctx.fillText('0', gx - 4, gy + gh + 13); ctx.fillText(U.sayi(vMax, 0) + ' km/s', gx + 4, gy + 10);
        ctx.save(); ctx.translate(12, gy + gh / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText('uzaklaşma hızı', 0, 0); ctx.restore();
      }
      hS.addEventListener('input', hesapla); oK.addEventListener('change', hesapla);
      kap.querySelector('#hbYeni').addEventListener('click', () => { merkez = (merkez + 7) % gal.length; ev = 0; hesapla(); });
      kur(); hesapla();
      return o.dongu(ciz);
    });
  }

  window.UraniaDeneyEk = { kepler, gelgit, tayf, evreler, gecis, hubble };
})();
