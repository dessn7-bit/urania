/* deney/astrofoto.js — Gökyüzü fotoğrafı: sabit üçayakta yıldızın kayması (15,04″/sn × cos δ), 500 ve NPF kuralları,
   piksel ölçeği, yığınlamada √N kazancı, kent ve karanlık gök. Sayılar veri/deney/astrofoto.json'dan (kaynaklı). */
(function () {
  'use strict';
  const DER = Math.PI / 180, YAYSN = 180 * 3600 / Math.PI, IKI_PI = Math.PI * 2;

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* Gök küresinin kayma hızı (yay saniyesi / saniye): 360° / yıldız günü, × cos δ */
    kaymaHizi(dekDer, yildizGunuSaat) { return 360 * 3600 / ((yildizGunuSaat || 23.9345) * 3600) * Math.cos(dekDer * DER); },
    /* Piksel ölçeği (″/piksel): 206.265 × piksel genişliği / odak uzaklığı (ikisi de mm; eşdeğer ya da gerçek, ama aynı türden) */
    pikselOlcegi(pikselMm, odakMm) { return YAYSN * pikselMm / odakMm; },
    /* 500 kuralı: t = 500 / eşdeğer odak (sn) */
    kural500(fEs) { return 500 / fEs; },
    /* Basit NPF kuralı: t = (35·N + 30·p) / f; N f-sayısı, p piksel aralığı (µm), f gerçek odak (mm) */
    npf(N, pUm, f) { return (35 * N + 30 * pUm) / f; },
    /* Yıldızın t saniyede kayması (piksel) */
    kayma(t, dekDer, olcek, gun) { return t * H.kaymaHizi(dekDer, gun) / olcek; },
    /* k piksel kayma için gereken süre (sn) */
    kSure(k, dekDer, olcek, gun) { return k * olcek / H.kaymaHizi(dekDer, gun); },
    /* Yığınlama: N karede sinyal-gürültü oranı √N kat artar */
    yiginKazanc(N) { return Math.sqrt(N); },
    /* Tek karenin oranı (yalnız foton gürültüsü): S / √(S + B) */
    tekOran(S, B) { return S / Math.sqrt(S + B); },
    /* Aynı orana ulaşmak için gereken kare sayısı */
    gerekenKare(hedef, tek) { return Math.pow(hedef / tek, 2); },
    /* Gnomonik izdüşüm ve tersi (radyan; merkez α=0) */
    izdusum(a, d, d0) {
      const c = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(a);
      return c <= 0 ? null : [Math.cos(d) * Math.sin(a) / c, (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(a)) / c];
    },
    tersIzdusum(x, y, d0) {
      const r = Math.hypot(x, y); if (r < 1e-12) return [0, d0];
      const c = Math.atan(r);
      return [Math.atan2(x * Math.sin(c), r * Math.cos(d0) * Math.cos(c) - y * Math.sin(d0) * Math.sin(c)), Math.asin(Math.cos(c) * Math.sin(d0) + y * Math.sin(c) * Math.cos(d0) / r)];
    }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).astrofoto = H;

  function rastgele(tohum) { let s = tohum >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).astrofoto = function (kap, o) {
    const U = o.U, V = o.veri || {};
    const on = V.onayarlar, kameralar = V.kameralar, GUN = V.yildizGunu.saat, gr = V.gurultu;
    const lg = Math.log10;
    const link = ls => ls.filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ');
    kap.innerHTML = `
      <div class="cip-grup" id="afOn">${on.map((x, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="afKanvas"></canvas></div>
      <div class="kontroller">
        <div class="cip-grup" id="afKamera" role="group" aria-label="Fotoğraf makinesi">${kameralar.map((k, i) => `<button type="button" class="dugme" data-k="${k.id}" aria-pressed="${i === 0}">${U.kacis(k.ad)}</button>`).join('')}</div>
        ${o.kaydirici('afOdak', 'Odak uzaklığı (35 mm eşdeğeri)', lg(10), lg(200), 'any', lg(24))}
        ${o.kaydirici('afSure', 'Bir karenin poz süresi', lg(0.5), lg(120), 'any', lg(16))}
        ${o.kaydirici('afDek', 'Hedefin dik açıklığı δ (0° gök ekvatoru, 90° kutup)', 0, 89.5, 'any', 0)}
        ${o.kaydirici('afKare', 'Yığındaki kare sayısı N', 0, lg(400), 'any', 0)}
        <label class="alan" for="afGok">Gökyüzü (gürültü grafiği ve kadrajın zemini)
          <select id="afGok"><option value="kent">Kent göğü (gök parıltısı çok)</option><option value="karanlik">Karanlık gök</option></select></label>
        <label class="alan" for="afDiyafram">Diyafram (NPF kuralı için)
          <select id="afDiyafram">${V.diyaframlar.map(n => `<option value="${n}">f/${U.sayi(n, 1, 0)}</option>`).join('')}</select></label>
        <label class="secim-satir kucuk"><input type="checkbox" id="afIzli"> <span>Kareleri hizalamadan üst üste koy (yıldız izi fotoğrafı)</span></label>
      </div>
      ${o.olcumler([['afOlcek', 'Piksel ölçeği'], ['af500', '500 kuralı: en uzun poz'], ['afNpf', 'NPF kuralı (basit)'], ['af1px', 'Yıldız 1 pikseli kaç saniyede geçer'], ['afIz', 'Yıldızın kayması'], ['afSnr', 'Yığın: gürültüde iyileşme (√N)'], ['afToplam', 'Toplam süre']])}
      <div class="deney-metin" id="afMetin"></div>
      <p class="kaynak">Varsayımlar: kayma kadrajın ortasındaki yıldız için; mercek kusurları, kırınım, hava titreşimi ve telefonun görüntü işlemesi yok. Telefon dersteki varsayım: 24 mm eşdeğeri, 4000 × 3000 piksel (telefonlar 48–108 MP'lik sensörün 4 ya da 9 pikselini birleştirip 12 MP fotoğraf verir); bu sınıftan bir örnek Galaxy S24 ana kamerası: 24 mm, f/1.8, 50 MP, 1,0 µm. NPF yalnız gerçek odak uzaklığı bilinen tam kare makinede hesaplanır. Gürültü grafiğindeki tek kare oranları dersin uydurma örneğinden (yıldızdan 400 foton, gökten 400 ya da 3600 foton); okuma gürültüsü ve ısıl sinyal yok sayıldı. Kadrajdaki yıldızlar temsilîdir. Kaynaklar: ${link(V.kaynaklar)}</p>`;
    const cv = kap.querySelector('#afKanvas');
    const S = id => kap.querySelector('#' + id);
    const fS = S('afOdak'), tS = S('afSure'), dS = S('afDek'), nS = S('afKare'), nSel = S('afDiyafram'), izK = S('afIzli');
    const gokS = S('afGok');
    let kamId = kameralar[0].id, gok = 'kent', st = {};
    /* temsilî yıldızlar: kadrajda düzgün dağılmış, tohumlu */
    const r = rastgele(11);
    const yildizlar = Array.from({ length: 46 }, () => ({ u: r() * 2 - 1, v: r() * 2 - 1, m: r() }));
    function sureYaz(t) {
      if (t < 10) return U.sayi(t, 1) + ' sn';
      if (t < 120) return U.sayi(t, Math.abs(t - Math.round(t)) < 0.05 ? 0 : 1) + ' sn';
      const tam = Math.round(t), dk = Math.floor(tam / 60), sn = tam % 60;   // önce yuvarla: 2999,99 sn "49 dk 60 sn" olmasın
      if (tam < 3600) return dk + ' dk' + (sn ? ' ' + sn + ' sn' : '');
      const dkT = Math.round(t / 60), sa = Math.floor(dkT / 60), kdk = dkT % 60;
      return sa + ' sa' + (kdk ? ' ' + kdk + ' dk' : '');
    }
    function hesapla() {
      const kam = kameralar.find(k => k.id === kamId);
      gok = gokS.value === 'karanlik' ? 'karanlik' : 'kent';
      const f = Math.pow(10, Number(fS.value)), t = Math.pow(10, Number(tS.value)), dek = Number(dS.value);
      const N = Math.max(1, Math.round(Math.pow(10, Number(nS.value)))), Nf = Number(nSel.value), izli = izK.checked;
      const pikselMm = kam.en_mm / kam.en_px;
      const olcek = H.pikselOlcegi(pikselMm, f);
      const hiz = H.kaymaHizi(dek, GUN);
      const t500 = H.kural500(f);
      const tNpf = kam.npf ? H.npf(Nf, pikselMm * 1000, f) : null;
      const t1 = H.kSure(1, dek, olcek, GUN);
      const sureIz = izli ? N * t : t;
      const iz = H.kayma(sureIz, dek, olcek, GUN);
      const iz500 = H.kayma(t500, dek, olcek, GUN);
      const tekK = H.tekOran(gr.yildiz, gr.gok.karanlik), tekS = H.tekOran(gr.yildiz, gr.gok.kent);
      const tek = gok === 'kent' ? tekS : tekK;
      st = { kam, f, t, dek, N, Nf, izli, olcek, hiz, t500, tNpf, t1, sureIz, iz, iz500, tekK, tekS, tek, pikselMm };
      S('afOdakCikti').textContent = U.sayi(f, f < 20 && Math.abs(f - Math.round(f)) > 0.05 ? 1 : 0) + ' mm';
      S('afSureCikti').textContent = sureYaz(t);
      S('afDekCikti').textContent = U.sayi(dek, dek > 89 ? 2 : 1) + '°';
      S('afKareCikti').textContent = N + ' kare';
      S('afOlcek').textContent = U.sayi(olcek, 1) + '″ / piksel';
      S('af500').textContent = U.sayi(t500, 1) + ' sn (' + U.sayi(iz500, 1) + ' piksel iz)';
      S('afNpf').textContent = tNpf == null ? 'telefonda hesaplanmadı' : U.sayi(tNpf, 1) + ' sn (f/' + U.sayi(Nf, 1, 0) + ', ' + U.sayi(pikselMm * 1000, 2) + ' µm)';
      S('af1px').textContent = t1 > 36000 ? 'kutupta kayma yok' : sureYaz(t1);
      S('afIz').textContent = U.sayi(iz, iz < 100 ? 1 : 0) + ' piksel' + (izli ? ' (' + sureYaz(sureIz) + ' boyunca)' : ' (bir karede)');
      S('afSnr').textContent = U.sayi(H.yiginKazanc(N), 1) + ' kat';
      S('afToplam').textContent = sureYaz(N * t);
      metin();
      ciz();
    }
    function metin() {
      const s = st, sayi = U.sayi, p = [];
      p.push(`Bu odak uzaklığında bir piksel gökte ${sayi(s.olcek, 1)} yay saniyesi tutar (yay saniyesi derecenin 3600'de biri). Dünya yıldızlara göre ${sayi(GUN, 4)} saatte bir döndüğü için gök saniyede 15,04 yay saniyesi kayar; dik açıklığı ${sayi(s.dek, s.dek > 89 ? 2 : 1)}° olan yıldız bunun cos δ katıyla, saniyede ${sayi(s.hiz, 2)} yay saniyesiyle gider${s.t1 < 36000 ? ` ve bir pikseli ${sureYaz(s.t1)} içinde geçer` : ''}.`);
      const iz = s.izli ? s.t * s.hiz / s.olcek : s.iz;
      const durum = iz <= 1 ? 'yıldızlar nokta kalır' : iz <= 3 ? 'yıldızlar biraz uzar; büyütünce fark edilir' : 'yıldızlar kısa çizgilere döner';
      p.push(`Bir karelik ${sureYaz(s.t)} pozda yıldız ${sayi(iz, 1)} piksel kayıyor: ${durum}. 500 kuralının ${sayi(s.t500, 1)} saniyesi bu yönde ${sayi(s.iz500, 1)} piksellik iz bırakır. Kural film ve baskı çağından kalma kaba bir kuraldır: piksel boyutunu ve baktığın yönü hesaba katmaz. Gök ekvatoruna bakarken en çok iz bırakır; kutba yaklaştıkça yıldızlar yavaşladığı için aynı sürede iz kısalır.${s.tNpf != null ? ` NPF kuralı diyaframı ve piksel aralığını da katar ve ${sayi(s.tNpf, 1)} saniye verir: daha katı.` : ''}`);
      const kentKare = H.gerekenKare(s.tekK, s.tekS);
      p.push(`${s.N === 1 ? 'Şimdi tek kare var, yığın yok. ' : ''}${s.N === 1 ? 'N' : s.N} kare yığınca rastgele gürültü kareden kareye değiştiği için ortalamada söner: sinyal-gürültü oranı √${s.N === 1 ? 'N' : s.N}${s.N === 1 ? '' : ' ≈ ' + sayi(H.yiginKazanc(s.N), 1)} kat artar. Dersteki örnek yıldızın tek karesi karanlık gökte ${sayi(s.tekK, 1)}, kentte ${sayi(s.tekS, 1)} oran verir: gök parıltısının fotonları da gürültü getirir. Kentte karanlık göğün tek karesine yetişmek için yaklaşık ${sayi(kentKare, 0)} kare gerekir; ${s.N} kareyle ${gok === 'kent' ? 'kentteki' : 'karanlık gökteki'} oran ${sayi(s.tek * H.yiginKazanc(s.N), 1)}.`);
      p.push('İstanbul\'un ışıklı göğünde neden tek uzun poz değil de çok kısa kare? Yalnız foton gürültüsü olsaydı toplam süresi aynı tek bir uzun poz aynı orana ulaşırdı. Ama uzun pozda yıldızlar kayar, kent göğünün tonu açılıp sönük yıldızları boğar ve tek bir uçak, uydu izi ya da sarsıntı bütün çekimi bozar; kısa karelerde yıldızlar nokta kalır, kötü kare atılır.');
      if (s.izli) {
        const derece = 360 * s.sureIz / (GUN * 3600);
        p.push(`Kareler hizalanmadan birleştirildi: ${sureYaz(s.sureIz)} boyunca gök ${sayi(derece, 1)}° döner ve her yıldız kutbun çevresinde bu açıda bir yay çizer. Kadrajın ortasındaki yıldızın yayı ${sayi(s.iz, s.iz < 100 ? 1 : 0)} piksel; kutba ne kadar yakınsa yay o kadar kısa.`);
      }
      S('afMetin').innerHTML = p.map(x => '<p>' + U.kacis(x) + '</p>').join('');
    }
    function ciz() {
      const s = st;
      const { ctx, w, h } = o.kanvas(cv, 0.84);
      ctx.clearRect(0, 0, w, h);
      const kam = s.kam;
      const kirmizi = document.documentElement.classList.contains('kirmizi');
      /* ---------- üst sol: kadraj ---------- */
      const ustH = h * 0.5, oranK = kam.en_px / kam.boy_px;
      let fw = Math.min(w * 0.6, (ustH - 22) * oranK), fh = fw / oranK;
      const fx = 8, fy = 6;
      ctx.fillStyle = gok === 'kent' ? '#1C2638' : '#03060C';
      ctx.fillRect(fx, fy, fw, fh);
      ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1; ctx.strokeRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1);
      const tx = kam.en_mm / 2 / s.f, ty = kam.en_mm / kam.en_px * kam.boy_px / 2 / s.f;   // kadrajın yarı boyu (tanjant)
      const d0 = s.dek * DER, teta = IKI_PI * s.sureIz / (GUN * 3600);
      const ekX = x => fx + fw / 2 - x / tx * fw / 2, ekY = y => fy + fh / 2 - y / ty * fh / 2;
      ctx.save(); ctx.beginPath(); ctx.rect(fx, fy, fw, fh); ctx.clip();
      /* gök kutbu kadrajdaysa: küçük artı */
      const kutup = H.izdusum(0, Math.PI / 2, d0);
      if (kutup && Math.abs(kutup[0]) < tx && Math.abs(kutup[1]) < ty) {
        const kx = ekX(kutup[0]), ky = ekY(kutup[1]);
        ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(kx - 5, ky); ctx.lineTo(kx + 5, ky); ctx.moveTo(kx, ky - 5); ctx.lineTo(kx, ky + 5); ctx.stroke();
      }
      const izCiz = (u, v, kalin, renk) => {
        const [a, d] = H.tersIzdusum(u * tx, v * ty, d0);
        const K = Math.max(2, Math.min(90, Math.ceil(teta / DER * 2)));
        ctx.beginPath();
        let ilk = true;
        for (let k = 0; k <= K; k++) {
          const q = H.izdusum(a - teta * k / K, d, d0);
          if (!q) { ilk = true; continue; }
          const x = ekX(q[0]), y = ekY(q[1]);
          if (ilk) { ctx.moveTo(x, y); ilk = false; } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = renk; ctx.lineWidth = kalin; ctx.lineCap = 'round'; ctx.stroke();
      };
      yildizlar.forEach(y => izCiz(y.u, y.v, 0.8 + y.m * 1.4, o.renk('--yildiz')));
      /* ölçülen yıldız: ortada, halkalı */
      izCiz(0, 0, 2.2, o.renk('--yildiz'));
      ctx.beginPath(); ctx.arc(fx + fw / 2, fy + fh / 2, 7, 0, IKI_PI); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.restore();
      ctx.font = '500 11px Plex, sans-serif'; ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left';
      const gx = 2 * Math.atan(tx) / DER, gy = 2 * Math.atan(ty) / DER;
      o.etiket(ctx, 'kadraj ' + U.sayi(gx, gx < 10 ? 1 : 0) + '° × ' + U.sayi(gy, gy < 10 ? 1 : 0) + '°', fx, fy + fh + 14);
      /* ---------- üst sağ: piksel büyüteci (ortadaki yıldız) ---------- */
      const bx0 = fx + fw + 14, bs = Math.min(w - bx0 - 8, ustH - 22), by0 = fy;
      const izPx = s.iz;
      const izgara = izPx <= 26;
      const n = izgara ? Math.max(7, Math.min(31, Math.ceil(izPx * 1.25) + 4)) : 0;
      ctx.fillStyle = gok === 'kent' ? '#1C2638' : '#03060C'; ctx.fillRect(bx0, by0, bs, bs);
      /* ortadaki yıldızın yolu, görüntü pikseli biriminde */
      const yol = [], K = 160;
      const yarX = kam.en_px / 2 / tx, yarY = kam.boy_px / 2 / ty;
      for (let k = 0; k <= K; k++) { const q = H.izdusum(-teta * k / K, d0, d0); if (q) yol.push([-q[0] * yarX, -q[1] * yarY]); }
      let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity;
      yol.forEach(([x, y]) => { mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); mny = Math.min(mny, y); mxy = Math.max(mxy, y); });
      const ox = (mnx + mxx) / 2, oy = (mny + mxy) / 2;
      ctx.save(); ctx.beginPath(); ctx.rect(bx0, by0, bs, bs); ctx.clip();
      if (izgara) {
        const hc = bs / n, say = new Float32Array(n * n);
        yol.forEach(([x, y]) => {
          const i = Math.floor(x - ox + n / 2), j = Math.floor(y - oy + n / 2);
          if (i >= 0 && i < n && j >= 0 && j < n) say[j * n + i]++;
        });
        let enc = 0; say.forEach(v => { if (v > enc) enc = v; });
        ctx.fillStyle = o.renk('--yildiz');
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
          const v = say[j * n + i]; if (!v) continue;
          ctx.globalAlpha = Math.max(0.3, v / enc); ctx.fillRect(bx0 + i * hc, by0 + j * hc, hc, hc);
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1; ctx.beginPath();
        for (let k = 0; k <= n; k++) { ctx.moveTo(bx0 + k * hc, by0); ctx.lineTo(bx0 + k * hc, by0 + bs); ctx.moveTo(bx0, by0 + k * hc); ctx.lineTo(bx0 + bs, by0 + k * hc); }
        ctx.stroke();
      } else {
        /* iz büyüteçten uzun: ölçek küçültülür, yol çizgiyle gösterilir */
        const olc = bs * 0.8 / Math.max(mxx - mnx, mxy - mny, 1);
        ctx.beginPath();
        yol.forEach(([x, y], k) => { const X = bx0 + bs / 2 + (x - ox) * olc, Y = by0 + bs / 2 + (y - oy) * olc; if (k) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
        ctx.strokeStyle = o.renk('--yildiz'); ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1; ctx.strokeRect(bx0 + 0.5, by0 + 0.5, bs - 1, bs - 1);
      ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left';
      o.etiket(ctx, izgara ? n + ' × ' + n + ' piksel' : 'iz ' + U.sayi(izPx, 0) + ' piksel', bx0, by0 + bs + 14);
      /* ---------- alt: yığınlama grafiği (log-log) ---------- */
      const gx0 = 40, gy0 = ustH + 14, gw = w - gx0 - 12, gh = h - gy0 - 34;
      const X = nn => gx0 + lg(nn) / lg(400) * gw;
      const yMin = 3, yMax = 400, Y = v => gy0 + gh - (lg(v) - lg(yMin)) / (lg(yMax) - lg(yMin)) * gh;
      ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1; ctx.beginPath();
      [10, 100].forEach(v => { ctx.moveTo(gx0, Y(v)); ctx.lineTo(gx0 + gw, Y(v)); });
      [10, 100].forEach(v => { ctx.moveTo(X(v), gy0); ctx.lineTo(X(v), gy0 + gh); });
      ctx.stroke();
      ctx.strokeStyle = o.renk('--soluk'); ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy0 + gh); ctx.lineTo(gx0 + gw, gy0 + gh); ctx.stroke();
      ctx.fillStyle = o.renk('--soluk'); ctx.font = '500 11px Plex, sans-serif';
      ctx.textAlign = 'right'; [10, 100].forEach(v => ctx.fillText(String(v), gx0 - 5, Y(v) + 4));
      ctx.textAlign = 'center'; [[1, '1'], [10, '10'], [100, '100']].forEach(([v, t]) => ctx.fillText(t, X(v), gy0 + gh + 14));
      ctx.textAlign = 'right'; ctx.fillText('400', X(400), gy0 + gh + 14);
      ctx.textAlign = 'center'; ctx.fillText('yığındaki kare sayısı N (logaritmik)', gx0 + gw / 2, gy0 + gh + 29);
      const cizgi = (tek, renk, kesik, kalin) => {
        ctx.save(); if (kesik) ctx.setLineDash(kesik);
        ctx.beginPath(); ctx.moveTo(X(1), Y(tek)); ctx.lineTo(X(400), Y(tek * 20));
        ctx.strokeStyle = renk; ctx.lineWidth = kalin; ctx.stroke(); ctx.restore();
      };
      cizgi(s.tekK, o.renk('--hedef'), null, gok === 'karanlik' ? 2.6 : 1.3);
      cizgi(s.tekS, o.renk('--pirinc'), [7, 4], gok === 'kent' ? 2.6 : 1.3);
      ctx.beginPath(); ctx.arc(X(s.N), Y(s.tek * Math.sqrt(s.N)), 4.5, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
      ctx.strokeStyle = kirmizi ? '#000' : '#0A1422'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'right';
      /* çizgi adları solda: sağ uçta dar kanvasta çizgilerin üstüne biniyordu */
      ctx.textAlign = 'left';
      /* "karanlık" solda çizginin üstünde (yazının sağ ucundaki çizgi yüksekliğine göre); "kent" sağda çizginin altında
         (yazının sol ucuna göre): iki çizginin arası dar kanvasta bir yazı boyundan dar */
      const nX = x => Math.pow(10, (x - gx0) / gw * lg(400));
      const kx = X(1.3), kw = ctx.measureText('karanlık gök').width;
      ctx.fillStyle = o.renk('--hedef'); o.etiket(ctx, 'karanlık gök', kx, Y(s.tekK * Math.sqrt(nX(kx + kw))) - 6);
      const sw = ctx.measureText('kent göğü').width, sx = X(400) - sw;
      ctx.fillStyle = o.renk('--pirinc'); o.etiket(ctx, 'kent göğü', sx, Y(s.tekS * Math.sqrt(nX(sx))) + 15);
      ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left'; o.etiket(ctx, 'sinyal / gürültü', gx0 + 6, gy0 + 4);
    }
    function onAyar(i) {
      const x = on[i];
      kamId = x.kamera; kap.querySelectorAll('#afKamera button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === kamId)));
      fS.value = lg(x.f); tS.value = lg(x.t); dS.value = x.dek; nS.value = lg(x.kare); nSel.value = String(x.N); izK.checked = !!x.izli;
      if (x.gok) gokS.value = x.gok;
      kap.querySelectorAll('#afOn button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)));
      hesapla();
    }
    function elle() { kap.querySelectorAll('#afOn button').forEach(b => b.setAttribute('aria-pressed', 'false')); hesapla(); }
    [fS, tS, dS, nS].forEach(g => g.addEventListener('input', elle));
    nSel.addEventListener('change', elle); izK.addEventListener('change', elle);
    S('afOn').addEventListener('click', e => { const b = e.target.closest('button'); if (b) onAyar(Number(b.dataset.i)); });
    S('afKamera').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      kamId = b.dataset.k; kap.querySelectorAll('#afKamera button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      elle();
    });
    gokS.addEventListener('change', hesapla); gokS.addEventListener('input', hesapla);
    window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);
    onAyar(0);
    return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
  };
})();
