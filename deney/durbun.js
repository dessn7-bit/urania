/* deney/durbun.js — Dürbün ve teleskop: açıklık ışık toplar, büyütme alanı daraltır. Göz merceğinden görünen yıldız
   alanı (uygulamanın kataloğu + Gaia DR3), çıkış göz bebeği ile senin göz bebeğin, sınır kadir, ayırma gücü.
   Sayılar veri/deney/durbun.json'dan (kaynaklı). */
(function () {
  'use strict';
  const DER = Math.PI / 180, YAYSN = 180 * 3600 / Math.PI, IKI_PI = Math.PI * 2;

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* Işık toplama oranı (göze göre): (D / d)², d karanlıktaki göz bebeği (ders: 7 mm) */
    isikOrani(D, d) { return (D / d) * (D / d); },
    /* Çıkış göz bebeği (mm) = açıklık / büyütme */
    cikis(D, M) { return D / M; },
    /* Gerçek alan, ISO 14132-1 (Nikon): tan(görünür/2) = M · tan(gerçek/2) */
    gercekAlan(gorunur, M) { return 2 * Math.atan(Math.tan(gorunur / 2 * DER) / M) / DER; },
    gorunurAlan(gercek, M) { return 2 * Math.atan(M * Math.tan(gercek / 2 * DER)) / DER; },
    /* Eski kaba yöntem: gerçek ≈ görünür / büyütme */
    kabaAlan(gorunur, M) { return gorunur / M; },
    /* Göze giren demetin karşılığı olan çap: çıkış göz bebeği göz bebeğinden büyükse D yerine M × göz bebeği */
    etkinCap(D, M, p) { return Math.min(D, M * p); },
    /* Boşa giden ışık payı (demet göz bebeğinden büyükse) */
    bosa(D, M, p) { const e = D / M; return e > p ? 1 - (p / e) * (p / e) : 0; },
    /* Kadir farkı (Pogson): Δm = 2,5 log₁₀(oran) */
    kadirFarki(oran) { return 2.5 * Math.log10(oran); },
    /* Sınır kadir (kaba): çıplak göz sınırı (gök, Bortle) + 2,5 log((D_etkin / 7 mm)²) */
    sinirKadir(nelm, D, M, p, dRef) { return nelm + H.kadirFarki(H.isikOrani(H.etkinCap(D, M, p), dRef || 7)); },
    /* Astronomics kuralı: 7,5 + 5 log D (cm); çok karanlık gök, deneyimli gözlemci */
    astronomics(Dmm, sabit) { return (sabit == null ? 7.5 : sabit) + 5 * Math.log10(Dmm / 10); },
    /* Rayleigh: θ = 1,22 λ / D (yay saniyesi) */
    rayleigh(Dmm, lambdaNm, k) { return (k || 1.22) * (lambdaNm || 550) * 1e-9 / (Dmm / 1000) * YAYSN; },
    /* Dawes: 4,56 / D (D inç) = 115,8 / D (mm) */
    dawes(Dmm, inc) { return (inc || 4.56) * 25.4 / Dmm; },
    /* Gözün (≈ 60″) büyütülmüş görüntüde seçebildiği gök açısı */
    gozSiniri(M, gozSn) { return (gozSn || 60) / M; },
    /* Gnomonik izdüşüm (derece): merkez (ra0, de0) → (ξ doğu, η kuzey) */
    izdusum(ra, de, ra0, de0) {
      const a = ra * DER, d = de * DER, a0 = ra0 * DER, d0 = de0 * DER;
      const c = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(a - a0);
      return [Math.cos(d) * Math.sin(a - a0) / c / DER, (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(a - a0)) / c / DER];
    },
    /* Katalog tamlığı: alan yarıçapı r (derece) için güvenilen en sönük kadir */
    tamlik(katmanlar, r) { let m = -Infinity; katmanlar.forEach(([R, K]) => { if (r <= R + 1e-9 && K > m) m = K; }); return m; }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).durbun = H;

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).durbun = function (kap, o) {
    const U = o.U, V = o.veri || {};
    const on = V.onayarlar, gokler = V.gok, hedefler = V.hedefler, gozT = V.gozBebegi.tablo, dRef = V.gozBebegi.referans_mm;
    const ay = V.ayirma, PENCERE = V.pencere_derece || 8;
    const lg = Math.log10;
    const link = ls => ls.filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ');
    kap.innerHTML = `
      <div class="cip-grup" id="dbOn">${on.map((x, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="dbKanvas"></canvas></div>
      <div class="kontroller">
        <div class="cip-grup" id="dbHedef" role="group" aria-label="Hedef">${hedefler.map((x, i) => `<button type="button" class="dugme" data-i="${i}" aria-pressed="${i === 0}">${U.kacis(x.ad)}</button>`).join('')}</div>
        ${o.kaydirici('dbD', 'Ağız çapı D (objektif ya da ayna)', lg(7), lg(300), 'any', lg(50))}
        ${o.kaydirici('dbM', 'Büyütme M', 0, lg(300), 'any', lg(7))}
        ${o.kaydirici('dbAfov', 'Göz merceğinin görünür alanı', 30, 100, 0.1, 42.7)}
        <div class="cip-grup" id="dbGok" role="group" aria-label="Gökyüzü">${gokler.map((g, i) => `<button type="button" class="dugme" data-g="${g.id}" aria-pressed="${i === 0}">${U.kacis(g.ad)} gök</button>`).join('')}</div>
        <label class="alan" for="dbGoz">Göz bebeğin karanlıkta (yaşa göre ortalama)
          <select id="dbGoz"><option value="${dRef}">${U.sayi(dRef, 1)} mm (derslerdeki varsayım)</option>${gozT.map(([y, mm]) => `<option value="${mm}">${y} yaş: ${U.sayi(mm, 1)} mm</option>`).join('')}</select></label>
      </div>
      ${o.olcumler([['dbIsik', 'Işık toplama (7 mm göze göre)'], ['dbCikis', 'Çıkış göz bebeği'], ['dbAlan', 'Gerçek görüş alanı'], ['dbSinir', 'Sınır kadir (yaklaşık)'], ['dbAyirma', 'Ayırma sınırı'], ['dbSigar', 'Hedef alana sığıyor mu?'], ['dbSayi', 'Alanda çizilen yıldız']])}
      <div class="deney-metin" id="dbMetin"></div>
      <p class="kaynak">Varsayımlar: sınır kadir = çıplak gözün o gökteki sınırı (Bortle ölçeği, aralığın ortası) + 2,5 · log((etkin çap / 7 mm)²). Bu kaba bir tahmindir: büyütmenin gök zeminini karartması, cam kayıpları, iki gözle bakmak, havanın durgunluğu ve deneyim hesaba katılmadı; Bortle tablosundaki 32 cm'lik ayna bu modelden 0,4–0,9 kadir daha sönüğe iner. Gerçek alan ISO 14132-1 formülüyle; ayırma sınırı 550 nm'de Rayleigh ve Dawes, gözün ayırma gücü 1′. Yıldızlar: 6 kadire kadar uygulamanın kataloğu, daha sönükler Gaia DR3 (G kadiri renge göre V'ye çevrildi); kuzey yukarıda, doğu solda (teleskop görüntüyü ters çevirebilir). Kaynaklar: ${link(V.onayarKaynaklar.concat(V.gozBebegi.kaynaklar, V.gokKaynaklar, ay.kaynaklar, V.sinirKadir.kaynaklar, V.yildizKaynaklar))}</p>`;
    const cv = kap.querySelector('#dbKanvas');
    const S = id => kap.querySelector('#' + id);
    const dS = S('dbD'), mS = S('dbM'), aS = S('dbAfov'), gozS = S('dbGoz');
    let hedefI = 0, gokId = gokler[0].id, onI = null;
    /* yıldızlar: [ξ, η (0,1′ birim), V × 10] düz dizi → nesne */
    const yildiz = hedefler.map(h => { const ls = []; for (let i = 0; i < h.y.length; i += 3) ls.push({ x: h.y[i] / 600, y: h.y[i + 1] / 600, m: h.y[i + 2] / 10 }); return ls; });
    let st = {};
    function hesapla() {
      const D = Math.pow(10, Number(dS.value)), M = Math.pow(10, Number(mS.value)), afov = Number(aS.value), p = Number(gozS.value);
      const gok = gokler.find(g => g.id === gokId), hd = hedefler[hedefI];
      const tf = H.gercekAlan(afov, M);
      const cik = H.cikis(D, M), bos = H.bosa(D, M, p), dEt = H.etkinCap(D, M, p);
      const LM = H.sinirKadir(gok.nelm, D, M, p, dRef);
      const ray = H.rayleigh(D, ay.lambda_nm, ay.rayleigh_carpan), daw = H.dawes(D, ay.dawes_inc), goz = H.gozSiniri(M, ay.goz_yaysn);
      const pen = Math.min(tf, PENCERE), tam = H.tamlik(V.yildizKatmanlari, pen / 2);
      const sigar = hd.boyut_derece <= tf;
      const r = pen / 2;
      const gor = yildiz[hedefI].filter(s => s.m <= LM && Math.hypot(s.x, s.y) <= r);
      st = { D, M, afov, p, gok, hd, tf, cik, bos, dEt, LM, ray, daw, goz, pen, tam, sigar, gor };
      S('dbDCikti').textContent = U.sayi(D, D < 20 ? 1 : 0) + ' mm';
      S('dbMCikti').textContent = U.sayi(M, M < 10 ? 1 : 0) + '×';
      S('dbAfovCikti').textContent = U.sayi(afov, 1) + '°';
      const oran = H.isikOrani(D, dRef);
      S('dbIsik').textContent = U.sayi(oran, oran < 10 ? 1 : 0) + ' kat (' + U.sayi(H.kadirFarki(oran), 1) + ' kadir)';
      S('dbCikis').textContent = U.sayi(cik, cik < 10 ? 2 : 0) + ' mm' + (bos > 0.005 ? ' · %' + U.sayi(bos * 100, 0) + ' boşa' : '');
      S('dbCikis').style.color = bos > 0.005 ? 'var(--uyari)' : '';
      S('dbAlan').textContent = tf > PENCERE ? U.sayi(tf, 0) + '° (çizimde ' + PENCERE + '°)' : U.sayi(tf, 2) + '°';
      S('dbSinir').textContent = U.sayi(LM, 1) + ' kadir';
      const sinir = Math.max(ray, goz);
      S('dbAyirma').textContent = U.sayi(sinir, sinir < 10 ? 1 : 0) + '″ (' + (goz > ray ? 'göz' : 'kırınım') + ')';
      S('dbSigar').textContent = (sigar ? 'Evet' : 'Hayır') + ': ' + U.sayi(hd.boyut_derece, 2) + '° / ' + U.sayi(tf, tf < 10 ? 2 : 0) + '°';
      S('dbSayi').textContent = U.sayi(gor.length, 0) + (LM > tam + 0.05 ? ' (veri ' + U.sayi(tam, 1) + ' kadirde bitiyor)' : '');
      metin();
      ciz();
    }
    function metin() {
      const s = st, gok = s.gok, sayi = U.sayi;
      const lmK = H.sinirKadir(gokler[0].nelm, s.D, s.M, s.p, dRef), lmS = H.sinirKadir(gokler[gokler.length - 1].nelm, s.D, s.M, s.p, dRef);
      const fark = lmK - lmS, katCap = Math.pow(10, fark / 5);
      const p = [];
      const ciplak = s.M < 1.05 && s.D <= 7.5;
      p.push(ciplak
        ? `Çıplak gözle ışığı yalnız göz bebeğin toplar. ${gok.uzun[0].toUpperCase() + gok.uzun.slice(1)} altında en sönük seçebildiğin yıldız yaklaşık ${sayi(s.LM, 1)} kadir.`
        : `${sayi(s.D, 0)} mm'lik ağız, karanlıkta 7 mm açılan göz bebeğinden (${sayi(s.D, 0)} / 7)² ≈ ${sayi(H.isikOrani(s.D, dRef), 0)} kat ışık toplar. Sönük yıldızları gösteren budur, büyütme değil: ${gok.uzun} altında sınır yaklaşık ${sayi(s.LM, 1)} kadir.`);
      if (s.bos > 0.005) p.push(`Çıkış göz bebeği (göz merceğinden çıkan ışık demetinin çapı) ${sayi(s.cik, 2)} mm, senin göz bebeğin ${sayi(s.p, 1)} mm: demetin dışı irise çarpar ve ışığın %${sayi(s.bos * 100, 0)}'i boşa gider. Ağzın yalnız ${sayi(s.dEt, 0)} mm'si çalışır; bu alet senin için ${sayi(s.M, 0)}×${sayi(s.dEt, 0)} gibi davranır.`);
      else p.push(`Çıkış göz bebeği (göz merceğinden çıkan ışık demetinin çapı) ${sayi(s.cik, 2)} mm; ${sayi(s.p, 1)} mm'lik göz bebeğine tümüyle girer, ışık boşa gitmez.`);
      p.push(`Gökyüzü aletten çok kadir götürür: aynı aletle karanlık gökte ${sayi(lmK, 1)}, kent göğünde ${sayi(lmS, 1)} kadir. Aradaki ${sayi(fark, 1)} kadiri aletle kazanmak için ağız çapını ${sayi(katCap, 1)} katına çıkarman gerekirdi. Kentte gök parıltısı yıldızla birlikte toplanır; büyük ağız ikisini birden büyütür.`);
      const yararli = 2 * s.D;
      p.push(`Büyütme ${sayi(s.M, s.M < 10 ? 1 : 0)}×: gerçek alan ${sayi(s.tf, 2)}°. Büyütme ayrıntıyı açmaz, açılmış ayrıntıyı gözüne gösterir: gözün 1′'lik keskinliği gökte ${sayi(s.goz, 1)}″'ye, ağzın kırınım sınırı ${sayi(s.ray, 1)}″ (Rayleigh; Dawes ${sayi(s.daw, 1)}″). ${s.goz > s.ray ? 'Burada sınırı gözün çiziyor; daha çok büyütme daha ince ayrıntı gösterir ama alanı daraltır, demeti inceltir ve elin titremesini de büyütür.' : 'Burada sınırı ağız çiziyor; daha çok büyütme yeni ayrıntı getirmez.'}${s.M > yararli ? ` En yüksek yararlı büyütmeyi (2 × D ≈ ${sayi(yararli, 0)}×) aştın.` : ''}`);
      if (Math.abs(s.D - 50) < 0.5 && Math.abs(s.M - 7) < 0.05) p.push('7×50 neden klasik bir gökyüzü dürbünü? 7,14 mm\'lik demet genç bir gözün gece göz bebeğine denk gelir, 6,4–7°\'lik alan Ülker\'i ve Avcı\'nın kemerini tek bakışta alır ve 7× elde titremeden tutulur (elde pratik sınır yaklaşık 10× sayılır).');
      p.push(s.sigar ? `${s.hd.kisa} (${sayi(s.hd.boyut_derece, 2)}°) ${sayi(s.tf, 2)}°'lik alana sığıyor.` : `${s.hd.kisa} (${sayi(s.hd.boyut_derece, 2)}°) ${sayi(s.tf, 2)}°'lik alana sığmıyor: geniş hedefler dürbünün, küçük ve parlak hedefler teleskobun işidir.`);
      if (s.LM > s.tam + 0.05) p.push(`Not: uygulamanın bu alandaki yıldız verisi ${sayi(s.tam, 1)} kadirde bitiyor; gerçekte ${sayi(s.LM, 1)} kadire kadar daha çok yıldız görürdün.`);
      S('dbMetin').innerHTML = p.map(x => '<p>' + U.kacis(x) + '</p>').join('');
    }
    function ciz() {
      const { ctx, w, h } = o.kanvas(cv, 0.62);
      ctx.clearRect(0, 0, w, h);
      const kir = document.documentElement.classList.contains('kirmizi');
      const s = st;
      /* sol: göz merceği görünüşü */
      const R = Math.min(h * 0.45, w * 0.31), cx = R + 10, cy = h / 2;
      const olc = R / (s.pen / 2);          // piksel / derece
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, IKI_PI); ctx.fillStyle = kir ? '#000' : s.gok.zemin; ctx.fill(); ctx.clip();
      /* hedefin boyu: kesik halka */
      const hd = s.hd, hx = cx - hd.merkez[0] * olc, hy = cy - hd.merkez[1] * olc, hr = hd.boyut_derece / 2 * olc;
      ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = o.renk('--hedef'); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(hx, hy, hr, 0, IKI_PI); ctx.stroke(); ctx.restore();
      /* yıldızlar: parlak olan büyük; sınıra yakın olan küçük ve soluk */
      ctx.fillStyle = o.renk('--yildiz');
      for (let i = s.gor.length - 1; i >= 0; i--) {
        const y = s.gor[i], fark = s.LM - y.m;
        const r = Math.max(0.6, Math.min(4.2, 0.6 + 0.42 * fark));
        ctx.globalAlpha = Math.max(0.35, Math.min(1, 0.35 + 0.16 * fark));
        ctx.beginPath(); ctx.arc(cx - y.x * olc, cy - y.y * olc, r, 0, IKI_PI); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      /* alanın kenarı: sürekli halka; alan pencereden genişse kesik (çizim yalnız ortadaki 8°) */
      ctx.save(); if (s.tf > PENCERE) ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, IKI_PI); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
      /* sağ: yazılar ve göz bebeği çizimi */
      const x0 = cx + R + 14, sw = w - x0 - 6;
      ctx.textAlign = 'left'; ctx.font = '500 12px Plex, sans-serif'; ctx.fillStyle = o.renk('--parsomen');
      const kisalt = (t, en) => { if (ctx.measureText(t).width <= en) return t; while (t.length > 2 && ctx.measureText(t + '…').width > en) t = t.slice(0, -1); return t + '…'; };
      o.etiket(ctx, kisalt(hd.ad, sw), x0, 16);
      ctx.font = '500 11px Plex, sans-serif'; ctx.fillStyle = o.renk('--soluk');
      o.etiket(ctx, kisalt((s.tf > PENCERE ? 'çizim ' + PENCERE + '°' : 'alan ' + U.sayi(s.tf, 2) + '°'), sw), x0, 32);
      o.etiket(ctx, kisalt('sınır ' + U.sayi(s.LM, 1) + ' kadir', sw), x0, 47);
      /* göz bebeği: önden görünüş. 12 mm = iris; kesik çember göz bebeği, dolu disk ışık demeti */
      const alanY0 = 58, alanY1 = h - 36;
      const pr = Math.max(14, Math.min(sw / 2 - 2, (alanY1 - alanY0) / 2));
      const px = x0 + Math.min(sw / 2, pr + 2), py = (alanY0 + alanY1) / 2, mm = pr / 6;
      ctx.beginPath(); ctx.arc(px, py, 6 * mm, 0, IKI_PI); ctx.fillStyle = kir ? '#3A0A06' : '#4A3B28'; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, s.p / 2 * mm, 0, IKI_PI); ctx.fillStyle = '#000'; ctx.fill();
      const br = Math.min(6.4, s.cik / 2) * mm;
      ctx.beginPath(); ctx.arc(px, py, br, 0, IKI_PI); ctx.fillStyle = 'rgba(255,232,176,.45)'; ctx.fill();
      ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.5; ctx.stroke();
      ctx.save(); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, s.p / 2 * mm, 0, IKI_PI); ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.3; ctx.stroke(); ctx.restore();
      ctx.font = '500 11px Plex, sans-serif'; ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'left';
      o.etiket(ctx, kisalt('demet ' + (s.cik > 12.8 ? '> 12' : U.sayi(s.cik, 1)) + ' mm', sw), x0, h - 20);
      o.etiket(ctx, kisalt('göz bebeği ' + U.sayi(s.p, 1) + ' mm', sw), x0, h - 6);
    }
    function onAyar(i) {
      const x = on[i]; onI = i;
      /* Belgede gerçek alan yazıyorsa görünür alan ondan (ISO formülüyle) kurulur: yuvarlanmış 42,7° 6,39° verirdi */
      dS.value = lg(x.D); mS.value = lg(x.M); aS.value = x.gercekAlan ? H.gorunurAlan(x.gercekAlan, x.M) : x.gorunurAlan;
      kap.querySelectorAll('#dbOn button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)));
      hesapla();
    }
    function elle() { if (onI != null) { onI = null; kap.querySelectorAll('#dbOn button').forEach(b => b.setAttribute('aria-pressed', 'false')); } hesapla(); }
    [dS, mS, aS].forEach(g => g.addEventListener('input', elle));
    gozS.addEventListener('change', hesapla); gozS.addEventListener('input', hesapla);
    S('dbOn').addEventListener('click', e => { const b = e.target.closest('button'); if (b) onAyar(Number(b.dataset.i)); });
    S('dbHedef').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      hedefI = Number(b.dataset.i);
      kap.querySelectorAll('#dbHedef button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      hesapla();
    });
    S('dbGok').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      gokId = b.dataset.g;
      kap.querySelectorAll('#dbGok button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      hesapla();
    });
    window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);
    onAyar(1);
    return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
  };
})();
