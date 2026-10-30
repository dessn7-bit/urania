/* deney/analemma.js — Güneş saati ve zaman denklemi: güneş saati ile kol saati arasındaki fark, iki bileşeni
   (yörüngenin basıklığı ve eksenin eğikliği) ve İstanbul'da her gün aynı saatte Güneş'in gökte çizdiği sekiz
   (analemma). Güneş'in konumu USNO'nun yaklaşık formülleriyle (aa.usno.navy.mil/faq/sun_approx); sayılar ve
   kaynakları veri/deney/analemma.json'da. */
(function () {
  'use strict';
  const DER = Math.PI / 180, IKI_PI = Math.PI * 2;
  const sin = x => Math.sin(x * DER), cos = x => Math.cos(x * DER);
  const AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const AY3 = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const sar = x => ((x + 180) % 360 + 360) % 360 - 180;     // −180…180

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* 2026'nın gun. günü (1 = 1 Ocak), UT saatiyle: D = JD − 2451545,0 (1 Ocak 2026 00:00 UT = JD 2461041,5) */
    D(gun, saatUT) { return 9496.5 + (gun - 1) + saatUT / 24; },
    /* USNO yaklaşık Güneş koordinatları ve zaman denklemi (dakika). EqT = q/15 − RA.
       Bileşenler toplanabilir: basıklık payı = 4·(q − L) (merkezin denklemi), eğiklik payı = 4·(L − RA).
       s.dairesel: yörünge dairesel olsaydı (L = q); s.egiksiz: eksen eğik olmasaydı (e = 0, RA = L, δ = 0). */
    gunes(D, s) {
      s = s || {};
      const g = ((357.529 + 0.98560028 * D) % 360 + 360) % 360;
      const q = ((280.459 + 0.98564736 * D) % 360 + 360) % 360;
      const L = s.dairesel ? q : ((q + 1.915 * sin(g) + 0.020 * sin(2 * g)) % 360 + 360) % 360;
      const e = s.egiksiz ? 0 : 23.439 - 0.00000036 * D;
      const RA = (Math.atan2(cos(e) * sin(L), cos(L)) / DER + 360) % 360;
      const dik = Math.asin(sin(e) * sin(L)) / DER;
      const basiklik = 4 * sar(q - L), egiklik = 4 * sar(L - RA);
      return { g, q, L, e, RA, dik, basiklik, egiklik, zd: basiklik + egiklik };
    },
    /* Ufuk koordinatları: saat açısı Hs (°, batıya artı) → yükseklik ve azimut (kuzeyden doğuya, °); kırılma yok */
    ufuk(enlem, dik, Hs) {
      const yuk = Math.asin(sin(enlem) * sin(dik) + cos(enlem) * cos(dik) * cos(Hs)) / DER;
      const az = Math.atan2(-cos(dik) * sin(Hs), sin(dik) * cos(enlem) - cos(dik) * sin(enlem) * cos(Hs)) / DER;
      return { yuk, az: (az + 360) % 360 };
    },
    /* Yerel ortalama öğlenin saat dilimindeki saati: 12 + (dilim·15° − boylam)/15 (saat) */
    ortalamaOgle(boylam, dilim) { return 12 + (dilim * 15 - boylam) / 15; },
    /* Gerçek öğle: Güneş'in meridyenden geçtiği an (saat dilimindeki saat, ondalık) = ortalama öğle − ZD; ZD o anki değerle */
    gercekOgle(gun, boylam, dilim, s) {
      let t = 12 - boylam / 15, z = 0;                       // UT
      for (let i = 0; i < 4; i++) { z = H.gunes(H.D(gun, t), s).zd; t = 12 - boylam / 15 - z / 60; }
      const r = H.gunes(H.D(gun, t), s);
      return { saat: t + dilim, zd: r.zd, dik: r.dik };
    },
    /* Analemma noktası: her gün saat dilimindeki aynı saatte (saatYerel) Güneş'in yüksekliği ve azimutu */
    analemma(gun, enlem, boylam, dilim, saatYerel, s) {
      const ut = saatYerel - dilim;
      const r = H.gunes(H.D(gun, ut), s);
      const Hs = sar(ut * 15 + boylam - 180 + r.zd / 4);
      return Object.assign(H.ufuk(enlem, r.dik, Hs), { zd: r.zd });
    },
    /* dakika → "+16 dk 27 sn" */
    dkSn(m) {
      const s = Math.round(Math.abs(m) * 60), dk = Math.floor(s / 60);
      return (s === 0 ? '' : m > 0 ? '+' : '−') + (dk ? dk + ' dk ' : '') + (s % 60) + ' sn';
    },
    /* saat (ondalık) → "13:03:41" */
    saatYaz(h) {
      const s = Math.round(h * 3600), p = n => String(n).padStart(2, '0');
      return p(Math.floor(s / 3600) % 24) + ':' + p(Math.floor(s % 3600 / 60)) + ':' + p(s % 60);
    },
    tarih(n) { const d = new Date(Date.UTC(2026, 0, n)); return { ay: d.getUTCMonth() + 1, gun: d.getUTCDate() }; },
    yilinGunu(ay, gun) { return Math.round((Date.UTC(2026, ay - 1, gun) - Date.UTC(2026, 0, 1)) / 864e5) + 1; }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).analemma = H;

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).analemma = function (kap, o) {
    const U = o.U, v = o.veri || {};
    const yer = v.istanbul, dilim = v.saatDilimi.utc_fark;
    const ortOgle = H.ortalamaOgle(yer.boylam, dilim);          // 13:03:41
    const fark = (dilim * 15 - yer.boylam) * 4;                  // dakika
    const on = v.onAyarlar || [];
    const bugun = new Date();
    const gun0 = Math.min(365, H.yilinGunu(bugun.getMonth() + 1, bugun.getDate()));
    const link = ls => ls.filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ');

    kap.innerHTML = `
      <div class="cip-grup" id="anOn">${on.map((x, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="anKanvas"></canvas></div>
      <div class="kontroller">
        ${o.kaydirici('anGun', 'Tarih (2026)', 1, 365, 1, gun0)}
        <label class="secim-satir kucuk"><input type="checkbox" id="anDaire"> <span>Yörünge dairesel olsaydı (basıklık payı sıfır)</span></label>
        <label class="secim-satir kucuk"><input type="checkbox" id="anEgik"> <span>Eksen eğik olmasaydı (eğiklik payı sıfır)</span></label>
      </div>
      ${o.olcumler([['anFark', 'Güneş saati − kol saati'], ['anPay', 'Basıklık payı / eğiklik payı'], ['anOgle', 'Gerçek öğle, İstanbul (UTC+3)'], ['anYuk', 'O anda Güneş\'in yüksekliği']])}
      <div class="deney-metin" id="anMetin"></div>
      <p class="kaynak">Güneş'in konumu ve zaman denklemi USNO'nun yaklaşık formülleriyle hesaplandı: ZD = q/15 − RA (q: Güneş'in ortalama boylamı, RA: sağ açıklığı). Basıklık payı q ile Güneş'in gerçek boylamı L arasındaki fark, eğiklik payı L ile RA arasındaki farktır; ikisinin toplamı ZD'dir. 2026 için sonuçlar uygulamanın gök hesabından (Astronomy Engine) en çok 3 saniye, USNO'nun İstanbul güneş tablosundan dakika yuvarlaması kadar farklı. Konum ${U.sayi(yer.enlem, 2)}° K, ${U.sayi(yer.boylam, 2)}° D (${U.kacis(yer.ad)}); kırılma yok sayıldı. Kaynaklar: ${link(v.kaynaklar || [])}</p>`;

    const cv = kap.querySelector('#anKanvas');
    const gS = kap.querySelector('#anGun'), dK = kap.querySelector('#anDaire'), eK = kap.querySelector('#anEgik');
    const S = id => kap.querySelector('#' + id);
    let st = {}, egri = null;

    function secenek() { return { dairesel: dK.checked, egiksiz: eK.checked }; }
    /* Yıl boyu eğriler: seçenek değişince yeniden */
    function egrileriKur() {
      const s = secenek(), ut = ortOgle - dilim;
      const zd = [], an = [];
      for (let n = 1; n <= 365; n++) {
        const r = H.gunes(H.D(n, ut), s);
        zd.push([n, r.zd, r.basiklik, r.egiklik]);
        an.push(H.analemma(n, yer.enlem, yer.boylam, dilim, ortOgle, s));
      }
      egri = { zd, an, anahtar: JSON.stringify(s) };
    }

    function hesapla() {
      const gun = Number(gS.value), s = secenek();
      if (!egri || egri.anahtar !== JSON.stringify(s)) egrileriKur();
      const og = H.gercekOgle(gun, yer.boylam, dilim, s);
      const r = H.gunes(H.D(gun, og.saat - dilim), s);
      const yuk = 90 - Math.abs(yer.enlem - og.dik);
      const t = H.tarih(gun);
      st = { gun, t, og, r, yuk, s };
      S('anGunCikti').textContent = t.gun + ' ' + AY[t.ay - 1];
      S('anFark').textContent = H.dkSn(r.zd);
      S('anPay').textContent = H.dkSn(r.basiklik) + ' / ' + H.dkSn(r.egiklik);
      S('anOgle').textContent = H.saatYaz(og.saat);
      S('anYuk').textContent = U.sayi(yuk, 1) + '°';
      metin();
      ciz();
    }

    function metin() {
      const { t, og, r, s } = st;
      const ad = t.gun + ' ' + AY[t.ay - 1];
      const z = Math.round(r.zd * 60);
      const durum = z > 0 ? `güneş saati kol saatinden ${H.dkSn(r.zd).slice(1)} önde: Güneş meridyenden (tam güneyden) ortalama öğleden önce geçer, saat ${H.saatYaz(og.saat)}`
        : z < 0 ? `güneş saati kol saatinden ${H.dkSn(r.zd).slice(1)} geride: Güneş meridyenden (tam güneyden) ortalama öğleden sonra geçer, saat ${H.saatYaz(og.saat)}`
          : `güneş saati ile kol saati aynı: Güneş meridyenden tam ortalama öğlede geçer`;
      const p = [`<p>${ad}: ${durum}. Farkın ${H.dkSn(r.basiklik)} kadarı yörüngenin basıklığından (Dünya Ocak başında Güneş'e en yakın ve en hızlıdır, Güneş yıldızların önünde her gün daha çok kayar), ${H.dkSn(r.egiklik)} kadarı eksenin eğikliğinden (Güneş tutulum boyunca yürür, saatler ise gök ekvatoru boyunca sayar) geliyor.</p>`];
      if (s.dairesel && s.egiksiz) p.push('<p>İkisi de kapalı: yörünge dairesel ve eksen dik olsaydı Güneş her gün aynı hızla, gök ekvatoru boyunca ilerlerdi. Güneş saati kol saatine hep uyar, analemma tek bir noktaya iner.</p>');
      else if (s.dairesel) p.push('<p>Yörünge dairesel: geriye yalnız eğiklik payı kalır. Yılda iki kez gidip gelen bu dalga sekizin iki halkasını eşitler.</p>');
      else if (s.egiksiz) p.push('<p>Eksen eğik değil: Güneş hep gök ekvatorunda (dik açıklık 0°), bu yüzden analemma yatay bir çizgiye iner ve yalnız basıklık payı kalır: yılda bir kez gidip gelen bir dalga.</p>');
      p.push(`<p>Neden 13.04 civarı? Türkiye 2016'dan beri yıl boyu UTC+3 kullanır: bu, ${dilim * 15}° doğu boylamının ortalama güneş zamanıdır. Ataşehir ${U.sayi(yer.boylam, 2)}° D'de, yani ${U.sayi(dilim * 15 - yer.boylam, 2)}° batıda. Gök küresi dakikada 0,25° döndüğü için ortalama Güneş meridyenimize ${U.sayi(dilim * 15 - yer.boylam, 2)} × 4 = ${U.sayi(fark, 2)} dakika (${Math.floor(fark)} dk ${Math.round((fark % 1) * 60)} sn) geç gelir: ortalama öğle ${H.saatYaz(ortOgle)}. Gerçek öğle bundan zaman denklemi kadar önce ya da sonradır.</p>`);
      if (!s.dairesel && !s.egiksiz) p.push(`<p>Bu model 2026 için en büyük farkı ${U.kacis(v.model2026.enBuyuk)}, en derin farkı ${U.kacis(v.model2026.enKucuk)} buluyor. Dersteki +16 dk 33 sn ve −14 dk 6 sn Wikipedia makalesinin girişindeki genel değerlerdir; aynı makalenin 2000 yılı tablosu ise +16 dk 25 sn ve −14 dk 15 sn verir. Uç değerler yıldan yıla birkaç saniye oynar (artık yıllar, yörüngenin ve eksenin yavaş değişimi); kullandığımız yaklaşık formül de birkaç saniyelik hata taşır.</p>`);
      S('anMetin').innerHTML = p.join('');
    }

    /* ---------- çizim ---------- */
    function ciz() {
      const { ctx, w, h } = o.kanvas(cv, 0.8);
      ctx.clearRect(0, 0, w, h);
      const hA = Math.round(h * 0.42);
      zdCiz(ctx, w, hA);
      ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(8, hA + 3); ctx.lineTo(w - 8, hA + 3); ctx.stroke();
      anCiz(ctx, w, hA + 6, h - hA - 6);
    }

    function zdCiz(ctx, w, hA) {
      const dar = w < 420;
      const sol = 34, sag = 10, ust = 26, alt = 18;
      const gx = sol, gw = w - sol - sag, gy = ust, gh = hA - ust - alt;
      const y0 = -16, y1 = 18;
      const X = n => gx + (n - 1) / 364 * gw, Y = m => gy + (y1 - m) / (y1 - y0) * gh;
      ctx.font = '500 11px Plex, sans-serif';
      /* ızgara ve eksenler */
      const isaret = dar ? [-15, 0, 15] : [-15, -10, -5, 0, 5, 10, 15];
      [-15, -10, -5, 0, 5, 10, 15].forEach(m => {
        ctx.strokeStyle = m === 0 ? o.renk('--soluk') : o.renk('--cizgi'); ctx.lineWidth = m === 0 ? 1.2 : 1;
        ctx.beginPath(); ctx.moveTo(gx, Y(m)); ctx.lineTo(gx + gw, Y(m)); ctx.stroke();
      });
      ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'right';
      isaret.forEach(m => ctx.fillText((m > 0 ? '+' : m < 0 ? '−' : '') + Math.abs(m), gx - 5, Y(m) + 4));
      ctx.textAlign = 'center';
      AY3.forEach((a, i) => {
        if (dar && i % 2) return;
        const n = H.yilinGunu(i + 1, 1) + 14;
        ctx.fillText(a, X(n), gy + gh + 13);
      });
      /* bileşenler ve toplam */
      const yol = (k, renk, gen, kesik) => {
        ctx.save(); ctx.setLineDash(kesik); ctx.strokeStyle = renk; ctx.lineWidth = gen; ctx.beginPath();
        egri.zd.forEach((r, i) => { const x = X(r[0]), y = Y(r[k]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
        ctx.stroke(); ctx.restore();
      };
      yol(2, '#7FB2E5', 1.5, [6, 4]);
      yol(3, o.renk('--iyi'), 1.6, [2, 3]);
      yol(1, o.renk('--parsomen'), 2.6, []);
      /* seçili gün */
      const x = X(st.gun), y = Y(st.r.zd);
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + gh); ctx.stroke(); ctx.restore();
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, IKI_PI); ctx.fillStyle = o.renk('--pirinc'); ctx.fill();
      ctx.strokeStyle = '#0A1422'; ctx.lineWidth = 1; ctx.stroke();
      /* gösterge (üst satır) */
      ctx.font = '500 11px Plex, sans-serif'; ctx.textAlign = 'left';
      const ornek = (x0, renk, gen, kesik, yazi) => {
        ctx.save(); ctx.setLineDash(kesik); ctx.strokeStyle = renk; ctx.lineWidth = gen;
        ctx.beginPath(); ctx.moveTo(x0, 11); ctx.lineTo(x0 + 18, 11); ctx.stroke(); ctx.restore();
        ctx.fillStyle = o.renk('--soluk'); ctx.fillText(yazi, x0 + 22, 15);
        return x0 + 22 + ctx.measureText(yazi).width + (dar ? 10 : 16);
      };
      let gxx = ornek(6, o.renk('--parsomen'), 2.6, [], 'toplam (dk)');
      gxx = ornek(gxx, '#7FB2E5', 1.5, [6, 4], 'basıklık');
      ornek(gxx, o.renk('--iyi'), 1.6, [2, 3], 'eğiklik');
    }

    function anCiz(ctx, w, y0, hB) {
      const sol = 38, sag = 12, ust = 24, alt = 20;
      const gx = sol, gw = w - sol - sag, gy = y0 + ust, gh = hB - ust - alt;
      const a0 = 172, a1 = 188, h0 = 20, h1 = 78;
      const X = az => gx + (az - a0) / (a1 - a0) * gw, Y = yk => gy + (h1 - yk) / (h1 - h0) * gh;
      ctx.font = '500 11px Plex, sans-serif';
      ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1;
      [30, 50, 70].forEach(yk => { ctx.beginPath(); ctx.moveTo(gx, Y(yk)); ctx.lineTo(gx + gw, Y(yk)); ctx.stroke(); });
      [175, 180, 185].forEach(az => { ctx.beginPath(); ctx.moveTo(X(az), gy); ctx.lineTo(X(az), gy + gh); ctx.stroke(); });
      ctx.fillStyle = o.renk('--soluk'); ctx.textAlign = 'right';
      [30, 50, 70].forEach(yk => ctx.fillText(yk + '°', gx - 5, Y(yk) + 4));
      ctx.textAlign = 'center';
      [175, 185].forEach(az => ctx.fillText(az + '°', X(az), gy + gh + 14));
      ctx.fillText('180° güney', X(180), gy + gh + 14);
      ctx.textAlign = 'left'; ctx.fillText('← doğu', gx, y0 + 15);
      ctx.textAlign = 'right'; ctx.fillText('batı →', gx + gw, y0 + 15);
      ctx.textAlign = 'center'; ctx.fillStyle = o.renk('--parsomen'); ctx.fillText('her gün ' + H.saatYaz(ortOgle), gx + gw / 2, y0 + 15);
      /* sekiz */
      ctx.strokeStyle = '#F2C879'; ctx.lineWidth = 2.2; ctx.setLineDash([]);
      ctx.beginPath();
      egri.an.concat([egri.an[0]]).forEach((p, i) => { const x = X(p.az), y = Y(p.yuk); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.stroke();
      /* ayın 1'leri: küçük noktalar */
      ctx.fillStyle = '#F2C879';
      for (let a = 1; a <= 12; a++) { const p = egri.an[H.yilinGunu(a, 1) - 1]; ctx.beginPath(); ctx.arc(X(p.az), Y(p.yuk), 2.2, 0, IKI_PI); ctx.fill(); }
      /* seçili gün */
      const p = egri.an[st.gun - 1], x = X(p.az), y = Y(p.yuk);
      ctx.beginPath(); ctx.arc(x, y, 5.5, 0, IKI_PI); ctx.fillStyle = '#FFD27A'; ctx.fill();
      ctx.strokeStyle = '#0A1422'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, 9, 0, IKI_PI); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.font = '600 12px Plex, sans-serif'; ctx.fillStyle = o.renk('--parsomen');
      const yazi = st.t.gun + ' ' + AY3[st.t.ay - 1], yw = ctx.measureText(yazi).width;
      const sagda = p.az >= 180;
      let lx = sagda ? x + 14 : x - 14;
      if (sagda && lx + yw > w - 4) lx = x - 14; else if (!sagda && lx - yw < 4) lx = x + 14;
      ctx.textAlign = lx > x ? 'left' : 'right';
      o.etiket(ctx, yazi, lx, Math.min(gy + gh - 4, Math.max(gy + 26, y + 4)));
    }

    gS.addEventListener('input', hesapla); dK.addEventListener('change', hesapla); eK.addEventListener('change', hesapla);
    kap.querySelector('#anOn').addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      const x = on[Number(b.dataset.i)]; if (!x) return;
      gS.value = x.gun; hesapla();
    });
    window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);
    hesapla();
    return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
  };
})();
