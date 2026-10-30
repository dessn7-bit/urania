/* deney/roket.js — Roket denklemi: Tsiolkovsky (Δv = Isp·g₀·ln(m₀/m₁)), aşamalar ve hedeflerin Δv bedeli.
   Kütleler ton, Isp saniye, hızlar m/s (hesap) ve km/s (ekran). Motor ve araç değerleri veri/deney/roket.json'dan (kaynaklı);
   g₀ veri/fizik.json'dan. */
(function () {
  'use strict';

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* Egzoz hızı (m/s) = Isp (s) × g₀ (m/s²) */
    egzoz(isp, g0) { return isp * g0; },
    /* Tsiolkovsky: Δv = v_e · ln(m₀/m₁)  (m/s) */
    dv(isp, g0, m0, m1) { return isp * g0 * Math.log(m0 / m1); },
    /* Verilen Δv için kütle oranı ve yakıt payı (kalkış kütlesine göre) */
    kutleOrani(dv, ve) { return Math.exp(dv / ve); },
    yakitPayi(dv, ve) { return 1 - Math.exp(-dv / ve); },
    /* Kısıtlı aşamalandırma: N özdeş aşama (aynı Isp, aynı yakıt payı eps), her aşamanın kütle oranı eşit.
       M0: kalkış kütlesi (yük dahil), yuk: yük. Dönen dizi alttan üste [{yakit, kuru, isp}] */
    esitAsamalar(M0, yuk, N, eps, isp) {
      const r = Math.pow(M0 / yuk, 1 / N), ls = [];
      for (let i = 0; i < N; i++) {
        const m0 = yuk * Math.pow(r, N - i), ust = yuk * Math.pow(r, N - i - 1), s = m0 - ust;
        ls.push({ yakit: eps * s, kuru: (1 - eps) * s, isp });
      }
      return ls;
    },
    /* Aşama aşama Tsiolkovsky. Her aşamanın başlangıç kütlesi: kendisi + üstündeki her şey + yük. */
    analiz(asamalar, yuk, g0) {
      const kalkis = asamalar.reduce((t, a) => t + a.yakit + a.kuru, 0) + yuk;
      let m0 = kalkis, dv = 0, oran = 1, yakit = 0;
      const asama = asamalar.map(a => {
        const m1 = m0 - a.yakit, d = H.dv(a.isp, g0, m0, m1);
        const s = { m0, m1, oran: m0 / m1, dv: d, ust: m0 - a.yakit - a.kuru - yuk };
        dv += d; oran *= m0 / m1; yakit += a.yakit;
        m0 = m1 - a.kuru;
        return s;
      });
      return { kalkis, asama, dv, oran, yukPayi: yuk / kalkis, yakitPayi: yakit / kalkis };
    },
    /* Aynı kütleler tek aşamada olsaydı (yakıt ağırlıklı ortalama Isp ile) Δv */
    tekAsama(asamalar, yuk, g0) {
      const yakit = asamalar.reduce((t, a) => t + a.yakit, 0), kuru = asamalar.reduce((t, a) => t + a.kuru, 0);
      const isp = asamalar.reduce((t, a) => t + a.isp * a.yakit, 0) / yakit;
      return H.dv(isp, g0, yakit + kuru + yuk, kuru + yuk);
    },
    /* Δv'nin (km/s) yettiği hedefler */
    yetisilen(dvKms, hedefler) { return hedefler.filter(h => dvKms >= h.dv_kms); }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).roket = H;

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).roket = function (kap, o) {
    const U = o.U, V = o.veri, g0 = o.deger('g0');
    const motorlar = V.motorlar, araclar = V.araclar, hedefler = V.hedefler;
    const ISP_MIN = 150, ISP_MAX = 5000, YUK_MIN = 0.1, YUK_MAX = 60, EKSEN = 18;
    const lg = Math.log10;
    const grupHtml = (id, ad, ls) => `<p class="kucuk soluk rk-grup-ad" id="${id}Ad">${ad}</p>
      <div class="cip-grup" id="${id}" role="group" aria-labelledby="${id}Ad">${ls.map((x, i) => `<button type="button" class="dugme" data-i="${i}" aria-pressed="false">${U.kacis(x.ad)}</button>`).join('')}</div>`;
    const ekKaynak = [].concat(V.kaynaklar || [], ...motorlar.map(m => m.kaynaklar || []));
    kap.innerHTML = `
      ${grupHtml('rkMotor', 'Motor seç (bütün aşamaların Isp\'si):', motorlar)}
      ${grupHtml('rkArac', 'Hazır roket (bütün kütleler):', araclar)}
      <div class="sahne"><canvas id="rkKanvas"></canvas></div>
      <div class="kontroller">
        ${o.kaydirici('rkIsp', 'Özgül itki (Isp)', lg(ISP_MIN), lg(ISP_MAX), 'any', lg(V.baslangic.isp))}
        ${o.kaydirici('rkEps', 'Aşamanın yakıt payı', 0.5, 0.98, 0.001, V.baslangic.eps)}
        ${o.kaydirici('rkN', 'Aşama sayısı', 1, 3, 1, V.baslangic.asama)}
        ${o.kaydirici('rkYuk', 'Yük kütlesi', lg(YUK_MIN), lg(YUK_MAX), 'any', lg(V.baslangic.yuk_t))}
      </div>
      ${o.olcumler([['rkDv', 'Toplam Δv'], ['rkAsamaDv', 'Aşama aşama Δv'], ['rkOran', 'Kütle oranı (her aşama)'], ['rkYakit', 'Kalkış kütlesinde yakıt'], ['rkYukPay', 'Yük payı'], ['rkHedef', 'Δv\'nin yettiği hedefler']])}
      <div class="deney-metin" id="rkMetin"></div>
      <p class="kaynak">Δv boşlukta Tsiolkovsky denklemiyle (Δv = Isp × g₀ × ln(m₀/m₁)); itki ve yanma süresi yok sayılır. Hava direnci ve çekim kaybı hedeflerin içindedir: yerden alçak yörüngeye 9,4 km/s; GTO 9,4 + 2,43 (300 km'den, eğiklik değişimi olmadan vis-viva hesabı); Mars'a aktarım 9,4 + 4,3; Ay yüzeyi 9,4 + 5,93 km/s. Kaynak tablo bazı değerlerinin birbiriyle tutarsız olduğunu belirtir: hedefleri onda bir hassasiyetle değil, büyüklük olarak oku. Aşama sayısı kaydırıcıyla kurulan aşamalar aynı Isp'li, aynı yakıt paylı ve eşit kütle oranlıdır (kısıtlı aşamalandırma; en iyi bölüşüm olmayabilir). Dünya'nın dönüşünün doğuya fırlatmaya katkısı hesaba katılmadı. Falcon 9 benzeri roketin kuru kütleleri tahmindir; kaynakların toplamı (567,5 t yükle) SpaceX'in verdiği 549 tondan biraz fazla. ${o.kaynakSatiri(['g0'], ekKaynak).replace(/^<p class="kaynak">|<\/p>$/g, '')}</p>`;
    const cv = kap.querySelector('#rkKanvas');
    const S = id => kap.querySelector('#' + id);
    const iS = S('rkIsp'), eS = S('rkEps'), nS = S('rkN'), yS = S('rkYuk');
    const st = { asamalar: [], yuk: V.baslangic.yuk_t, arac: null };
    st.asamalar = H.esitAsamalar(V.kalkis_t, st.yuk, V.baslangic.asama, V.baslangic.eps, V.baslangic.isp);

    const km = ms => U.sayi(ms / 1e3, 2);
    const ton = t => U.sayi(t, t < 10 ? 2 : 1) + ' t';
    const yuzde = x => '%' + U.sayi(x * 100, x < 0.01 ? 2 : 1);
    function basili(grup, i) { kap.querySelectorAll('#' + grup + ' button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i))); }
    function aralik(ls, yaz) {
      const en = Math.min(...ls), eb = Math.max(...ls);
      return eb - en < 1e-9 * Math.max(1, eb) ? yaz(en) : yaz(en) + '–' + yaz(eb);
    }
    /* Kaydırıcıları roketin şu anki aşamalarına göre yerleştir; aşamalar farklıysa çıktı aralık gösterir */
    function kaydiricilariYaz() {
      const a = st.asamalar;
      iS.value = lg(Math.min(ISP_MAX, Math.max(ISP_MIN, a[0].isp)));
      eS.value = a[0].yakit / (a[0].yakit + a[0].kuru);
      nS.value = a.length;
      yS.value = lg(Math.min(YUK_MAX, Math.max(YUK_MIN, st.yuk)));
    }
    function hesapla() {
      const a = st.asamalar, R = H.analiz(a, st.yuk, g0);
      st.R = R;
      const ispler = a.map(x => x.isp), epsler = a.map(x => x.yakit / (x.yakit + x.kuru));
      S('rkIspCikti').textContent = aralik(ispler, x => U.sayi(x, 0)) + ' s';
      S('rkEpsCikti').textContent = aralik(epsler, x => U.sayi(x * 100, 1)).replace(/^/, '%');
      S('rkNCikti').textContent = String(a.length);
      S('rkYukCikti').textContent = ton(st.yuk);
      const dvK = R.dv / 1e3;
      S('rkDv').textContent = km(R.dv) + ' km/s';
      S('rkAsamaDv').textContent = R.asama.map(s => km(s.dv)).join(' + ') + ' km/s';
      S('rkOran').textContent = R.asama.map(s => U.sayi(s.oran, 2)).join(' · ');
      S('rkYakit').textContent = yuzde(R.yakitPayi);
      S('rkYukPay').textContent = yuzde(R.yukPayi) + ' (' + ton(st.yuk) + ' / ' + U.sayi(R.kalkis, 1) + ' t)';
      const yet = H.yetisilen(dvK, hedefler);
      const elektrik = a.some(x => x.isp > 1000);
      let hedef = yet.length ? yet.map(h => h.kisa).join(', ') : 'hiçbiri';
      if (!yet.length) hedef += ' (LEO\'ya ' + U.sayi(hedefler[0].dv_kms - dvK, 2) + ' km/s eksik)';
      if (elektrik) hedef += '; ama bu motor yerden kalkamaz (itki çok küçük)';
      S('rkHedef').textContent = hedef;
      metin(R, dvK, elektrik);
      ciz();
    }
    function metin(R, dvK, elektrik) {
      const a = st.asamalar, N = a.length;
      const ayni = a.every(x => Math.abs(x.isp - a[0].isp) < 1e-9);
      const ve = H.egzoz(a[0].isp, g0);
      let p1 = `<p>Egzoz hızı v<sub>e</sub> = Isp × g₀ = ${U.sayi(a[0].isp, 0)} s × ${U.sayi(g0, 5)} m/s² ≈ ${U.sayi(ve / 1e3, 2)} km/s${ayni ? '' : ' (birinci aşama; aşamaların Isp\'leri farklı)'}. Tsiolkovsky denklemi Δv = v<sub>e</sub> × ln(kütle oranı) der; kütle oranı, aşamanın yakıt doluyken ve yakıt bittiğindeki kütlelerinin oranıdır. ln (doğal logaritma) yavaş büyür: Δv'yi bir egzoz hızı kadar artırmak için kütle oranını e ≈ 2,718 katına, iki egzoz hızı için 7,4 katına çıkarmak gerekir.`;
      if (N === 1) {
        const kalan = 1 / R.oran, sonra = kalan / Math.E;
        p1 += ` Bu roket yakıtını bitirdiğinde kalkış kütlesinden geriye yalnız %${U.sayi(kalan * 100, 1)} kalıyor. ${U.sayi(ve / 1e3, 2)} km/s daha fazla Δv için geriye kalan pay %${U.sayi(sonra * 100, 2)} olmalı, yani roket daha da çok yakıttan ibaret olmalı. Bu yüzden roketler çoğunlukla yakıttır.</p>`;
      } else p1 += ` Bu roketin kalkış kütlesinde yakıtın payı %${U.sayi(R.yakitPayi * 100, 1)}.</p>`;
      let p2;
      if (N === 1) {
        const M0 = R.kalkis, eps = a[0].yakit / (a[0].yakit + a[0].kuru);
        const iki = H.analiz(H.esitAsamalar(M0, st.yuk, 2, eps, a[0].isp), st.yuk, g0).dv;
        p2 = `<p>Tek aşamalı roket boş deposunu ve motorlarını (${ton(a[0].kuru)}) sonuna kadar taşır, yani onlara da hız kazandırmak zorundadır. Aynı kalkış kütlesi, aynı yük ve aynı teknoloji iki eşit kütle oranlı aşamaya bölünseydi Δv ${km(R.dv)} yerine ${km(iki)} km/s olurdu: birinci aşamanın boş gövdesi yolda atılır.</p>`;
      } else {
        const tek = H.tekAsama(a, st.yuk, g0);
        const kuru = a.slice(0, -1).reduce((t, x) => t + x.kuru, 0);
        p2 = `<p>Her aşama yakıtı bitince boş gövdesini atar (alt aşamaların gövdeleri toplam ${ton(kuru)}); üstteki aşama artık onları hızlandırmak zorunda değil. Δv'ler toplanır, kütle oranları çarpılır. Aynı yakıt ve gövdeler tek bir aşamada olsaydı Δv yalnız ${km(tek)} km/s olurdu${ayni ? '' : ' (yakıt ağırlıklı ortalama Isp ile)'}.${N === 3 ? ' Ama her yeni aşamanın getirisi bir öncekinden azdır: gerçek roketler bu yüzden nadiren üçten fazla aşama kullanır.' : ''}</p>`;
      }
      let p3 = '';
      if (elektrik) {
        const m = motorlar.find(x => x.itki_mN);
        p3 = `<p>Bu bir elektrikli (iyon) motor değeri: Δv dev görünüyor, ama Tsiolkovsky denklemi itkiyi sormaz. ${m ? 'NSTAR motorunun itkisi en çok ' + U.sayi(m.itki_mN, 0) + ' mN, yaklaşık ' + U.sayi(m.itki_mN / 1e3 / g0 * 1e3, 0) + ' gramlık bir cismin ağırlığı kadar' : 'İtkisi çok küçük'}; bir roketi yerden kaldıramaz. İyon motorları uzaydaki hafif araçları uzun süre çalışarak hızlandırır.</p>`;
      } else if (st.arac && st.arac.falcon) {
        p3 = `<p>Falcon 9 benzeri roket bu basit modelde ${km(R.dv)} km/s veriyor. Fark modelin kabalığından gelir: kuru kütleler tahmin, birinci aşamanın Isp'i yerdeki (282 s) ve boşluktaki (311 s) değerin ortası alındı, doğuya fırlatmada Dünya'nın dönüşünün verdiği hız (ekvatorda 0,465 km/s) yok sayıldı.</p>`;
      } else {
        const eksik = hedefler.find(h => dvK < h.dv_kms);
        if (eksik) p3 = `<p>Sıradaki hedef: ${eksik.ad}${eksik.ad.indexOf(eksik.kisa) < 0 ? ' (' + eksik.kisa + ')' : ''}. Yerden ${U.sayi(eksik.dv_kms, 1)} km/s gerekir; bu roketin ${U.sayi(eksik.dv_kms - dvK, 2)} km/s eksiği var.</p>`;
      }
      S('rkMetin').innerHTML = p1 + p2 + p3;
    }

    /* ===================== çizim ===================== */
    function tarali(ctx, x, y, w, h) {
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.strokeStyle = 'rgba(10,20,34,.7)'; ctx.lineWidth = 1.2;
      for (let k = -h; k < w; k += 5) { ctx.beginPath(); ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h, y); ctx.stroke(); }
      ctx.restore();
    }
    function ciz() {
      if (!st.R) return;
      const { ctx, w, h } = o.kanvas(cv, 0.66);
      ctx.clearRect(0, 0, w, h);
      const R = st.R, a = st.asamalar, kenar = 12, gen = w - 2 * kenar;
      const genis = w >= 420;
      const fs = genis ? 12 : 11;
      /* Alttaki Δv bölümü sabit yükseklikte, kanvasın dibine yaslı; üstte kalan alan üç aşama satırına bölünür */
      const bh = Math.max(12, Math.min(22, h * 0.07));
      const altBolge = fs + 6 + 7 + bh + 5 + 3 * fs + 8 + 8;
      const ustBolge = h - altBolge - 4, satir = (ustBolge - 6) / 3;
      const cub = Math.max(10, Math.min(22, satir - fs - 10));
      /* aşama satırları üst bölgede dikey ortalanır (1–2 aşamada altta boşluk kalmasın) */
      const adim = Math.min(satir, fs + 5 + cub + 16), bas = 6 + Math.max(0, (ustBolge - 6 - a.length * adim) / 2);
      a.forEach((as, i) => {
        const s = R.asama[i], y0 = bas + i * adim;
        ctx.font = `500 ${fs}px Plex, sans-serif`; ctx.textAlign = 'left'; ctx.fillStyle = o.renk('--soluk');
        const yazi = `${i + 1}. aşama · ateşlemede ${U.sayi(s.m0, s.m0 < 10 ? 2 : 1)} t · Δv ${km(s.dv)} km/s`;
        o.etiket(ctx, yazi, kenar, y0 + fs);
        const by = y0 + fs + 5, X = m => gen * m / s.m0;
        let x = kenar;
        const wY = X(as.yakit), wK = X(as.kuru), wU = X(s.ust), wP = Math.max(2, X(st.yuk));
        ctx.fillStyle = o.renk('--pirinc'); ctx.fillRect(x, by, wY, cub); x += wY;
        ctx.fillStyle = o.renk('--soluk'); ctx.fillRect(x, by, wK, cub); tarali(ctx, x, by, wK, cub); x += wK;
        if (wU > 0.5) {
          ctx.fillStyle = 'rgba(233,226,208,.18)'; ctx.fillRect(x, by, wU, cub);
          ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, by + 0.5, Math.max(0, wU - 1), cub - 1);
          x += wU;
        }
        /* yük: krem blok, koyu çerçeveyle yakıttan biçimce de ayrılır (kırmızı modda renkler birbirine yaklaşır) */
        const px = Math.min(x, kenar + gen - wP);
        ctx.fillStyle = o.renk('--parsomen'); ctx.fillRect(px, by, wP, cub);
        if (wP >= 6) { ctx.strokeStyle = '#0A1422'; ctx.lineWidth = 1.5; ctx.strokeRect(px + 1.5, by + 1.5, wP - 3, cub - 3); ctx.lineWidth = 1; }
        ctx.font = `600 ${fs}px Plex, sans-serif`;
        if (ctx.measureText('yük').width + 10 < wP && cub >= 13) { ctx.fillStyle = '#0A1422'; ctx.textAlign = 'center'; ctx.fillText('yük', px + wP / 2, by + cub / 2 + fs * 0.36); ctx.textAlign = 'left'; }
        /* yakıt payı çubuğun içinde (sığarsa) */
        ctx.font = `600 ${fs}px Plex, sans-serif`; ctx.fillStyle = '#0A1422';
        const ic = 'yakıt %' + U.sayi(as.yakit / s.m0 * 100, 1);
        if (ctx.measureText(ic).width + 8 < wY && cub >= 13) ctx.fillText(ic, kenar + 4, by + cub / 2 + fs * 0.36);
      });
      /* --- alt: Δv çubuğu ve hedefler --- */
      const X = v => kenar + gen * Math.min(v, EKSEN) / EKSEN;
      const yT = ustBolge + fs + 6, yB = yT + 7, yA = yB + bh + 5;
      ctx.font = `600 ${fs + 1}px Plex, sans-serif`; ctx.textAlign = 'left'; ctx.fillStyle = o.renk('--parsomen');
      o.etiket(ctx, 'Bu roketin Δv\'si: ' + km(R.dv) + ' km/s', kenar, yT);
      let v0 = 0;
      R.asama.forEach((s, i) => {
        const v1 = v0 + s.dv / 1e3, x0 = X(v0), x1 = X(v1);
        ctx.fillStyle = o.renk(i % 2 ? '--gezegen' : '--pirinc'); ctx.globalAlpha = i % 2 ? 0.75 : 1;
        ctx.fillRect(x0 + (i ? 1 : 0), yB, Math.max(1, x1 - x0 - (i ? 1 : 0)), bh); ctx.globalAlpha = 1;
        v0 = v1;
      });
      if (v0 > EKSEN) {                                       // ölçek dışı: ok ucu
        const xr = kenar + gen;
        ctx.fillStyle = o.renk('--pirinc'); ctx.beginPath(); ctx.moveTo(xr - 9, yB - 4); ctx.lineTo(xr, yB + bh / 2); ctx.lineTo(xr - 9, yB + bh + 4); ctx.closePath(); ctx.fill();
      }
      /* eksen ve ölçek */
      ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(kenar, yA); ctx.lineTo(kenar + gen, yA); ctx.stroke();
      ctx.font = `500 ${fs}px Plex, sans-serif`; ctx.fillStyle = o.renk('--soluk');
      [0, 5, 10, 15].forEach(v => { ctx.textAlign = v ? 'center' : 'left'; ctx.fillText(String(v), X(v), yA + fs + 2); });
      ctx.textAlign = 'right'; ctx.fillText('km/s', kenar + gen, yA + fs + 2);
      /* hedefler: dikey çizgiler, adları iki sıra */
      hedefler.forEach((hd, i) => {
        const x = X(hd.dv_kms), ok = R.dv / 1e3 >= hd.dv_kms;
        ctx.save(); ctx.strokeStyle = o.renk(ok ? '--iyi' : '--soluk'); ctx.lineWidth = ok ? 2 : 1.5; ctx.setLineDash(ok ? [] : [4, 3]);
        ctx.beginPath(); ctx.moveTo(x, yB - 6); ctx.lineTo(x, yA + 3 + (i % 2 ? 2 * fs + 4 : fs + 2) - fs + 2); ctx.stroke(); ctx.restore();
        const ad = hd.kisa + (genis ? ' ' + U.sayi(hd.dv_kms, 1) : '');
        ctx.font = `${ok ? 600 : 500} ${fs}px Plex, sans-serif`; ctx.fillStyle = o.renk(ok ? '--iyi' : '--soluk');
        const yw = ctx.measureText(ad).width / 2;
        ctx.textAlign = 'center';
        o.etiket(ctx, ad, Math.max(kenar + yw, Math.min(kenar + gen - yw, x)), yA + (i % 2 ? 3 * fs + 8 : 2 * fs + 6));
      });
    }

    /* ===================== olaylar ===================== */
    function aracBirak() { st.arac = null; basili('rkArac', -1); }
    iS.addEventListener('input', () => {
      const isp = Math.pow(10, Number(iS.value));
      st.asamalar.forEach(x => { x.isp = isp; });
      aracBirak(); basili('rkMotor', -1); hesapla();
    });
    eS.addEventListener('input', () => {
      const e = Number(eS.value);
      st.asamalar.forEach(x => { const t = x.yakit + x.kuru; x.yakit = e * t; x.kuru = (1 - e) * t; });
      aracBirak(); hesapla();
    });
    nS.addEventListener('input', () => {
      const N = Math.round(Number(nS.value));
      /* Kalkış kütlesi, yük, toplam yakıt payı ve (yakıt ağırlıklı) Isp korunur; kaydırıcı adımına yuvarlanmış değer kullanılmaz */
      const a = st.asamalar, yakit = a.reduce((t, x) => t + x.yakit, 0), top = a.reduce((t, x) => t + x.yakit + x.kuru, 0);
      const isp = a.reduce((t, x) => t + x.isp * x.yakit, 0) / yakit;
      const M0 = Math.max(top + st.yuk, st.yuk * 1.05);
      st.asamalar = H.esitAsamalar(M0, st.yuk, N, yakit / top, isp);
      aracBirak(); hesapla();
    });
    yS.addEventListener('input', () => { st.yuk = Math.pow(10, Number(yS.value)); aracBirak(); hesapla(); });
    S('rkMotor').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const m = motorlar[Number(b.dataset.i)];
      st.asamalar.forEach(x => { x.isp = m.isp; });
      aracBirak(); basili('rkMotor', Number(b.dataset.i)); kaydiricilariYaz(); hesapla();
    });
    S('rkArac').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const r = araclar[Number(b.dataset.i)];
      st.asamalar = r.asamalar.map(x => ({ yakit: x.yakit_t, kuru: x.kuru_t, isp: x.isp }));
      st.yuk = r.yuk_t; st.arac = r;
      basili('rkArac', Number(b.dataset.i)); basili('rkMotor', -1); kaydiricilariYaz(); hesapla();
    });
    const yeniden = () => ciz();
    window.addEventListener('resize', yeniden); document.addEventListener('urania:tema', yeniden);
    kaydiricilariYaz(); hesapla();
    return { durdur() { window.removeEventListener('resize', yeniden); document.removeEventListener('urania:tema', yeniden); } };
  };
})();
