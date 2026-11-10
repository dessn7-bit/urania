/* deney/gezegenyolu.js — Gezegen yolu: bir gezegenin yıldızlar arasındaki günlük yolu, duraklamalar, geri hareket ve
   karşı konum (dış gezegenler) ya da iç kavuşum (Merkür, Venüs).
   Konumlar cihazda Astronomy Engine ile (lib/astronomy.browser.min.js, MIT) hesaplanır: yer merkezli görünen konum
   (ışık süresi ve sapınç dâhil). Duraklama ve karşı konum "gerçek tutulum (ekliptik) tarihli" boylamla bulunur; JPL
   Horizons'un ObsEcLon niceliğiyle aynı tanım (testler/veri/gezegenyolu_horizons.json ile karşılaştırılır). Çizim J2000
   tutulum koordinatlarında: yıldızlar veri/yildizlar.json (5 kadire kadar), takımyıldız çizgileri veri/takimyildiz.json
   (d3-celestial, BSD-3). Doğu solda, kuzey yukarıda: güneye bakınca gök böyle görünür. */
(function () {
  'use strict';
  const IKI_PI = Math.PI * 2, DER = Math.PI / 180, GUN_MS = 864e5, SAAT_MS = 36e5;
  const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const GERI_RENK = '#F08A4B';                         // geri hareket: pirinçten ayrılsın diye turuncu (kırmızı modda CSS süzgeci kızartır)
  const sar = x => ((x % 360) + 540) % 360 - 180;           // açı farkı (−180, 180]
  const Ast = () => window.Astronomy;

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* 'YYYY-MM-DD' → o günün saatUT'sindeki an (ms) */
    an(gun, saatUT) { return Date.parse(gun + 'T00:00:00Z') + (saatUT || 0) * SAAT_MS; },
    gunEkle(gun, n) { return new Date(Date.parse(gun + 'T00:00:00Z') + n * GUN_MS).toISOString().slice(0, 10); },
    gunFarki(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / GUN_MS); },
    gecerliGun(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s + 'T00:00:00Z')); },
    /* Yer merkezli görünen boylam, gerçek tutulum tarihli (derece) — Horizons ObsEcLon ile aynı tanım */
    boylam(govde, t) { const A = Ast(); return A.Ecliptic(A.GeoVector(govde, new Date(t), true)).elon; },
    /* Çizim için J2000 tutulum koordinatları (yıldızlarla aynı çerçeve) */
    ekliptik(govde, t) {
      const A = Ast(), v = A.GeoVector(govde, new Date(t), true);
      const s = A.SphereFromVector(A.RotateVector(A.Rotation_EQJ_ECL(), v));
      return { lon: s.lon, lat: s.lat, uzak: s.dist };
    },
    /* J2000 ekvatoral (sağ açıklık, dik açıklık; derece) → J2000 tutulum */
    yildizEkliptik(ra, dec, R) {
      const A = Ast(), c = Math.cos(dec * DER);
      const v = new A.Vector(c * Math.cos(ra * DER), c * Math.sin(ra * DER), Math.sin(dec * DER), new A.AstroTime(0));
      const s = A.SphereFromVector(A.RotateVector(R || A.Rotation_EQJ_ECL(), v));
      return { lon: s.lon, lat: s.lat };
    },
    /* Günlük boylam değişimi (derece/gün; + doğuya, − batıya = geri): ±1 saatlik merkezî fark */
    hiz(govde, t) { return sar(H.boylam(govde, t + SAAT_MS) - H.boylam(govde, t - SAAT_MS)) * 12; },
    /* f'nin [a, b] içindeki işaret değişimini ikiye bölmeyle bulur (ms) */
    ikiyeBol(f, a, b, fa) {
      if (fa == null) fa = f(a);
      for (let i = 0; i < 40; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
      return (a + b) / 2;
    },
    /* Duraklamalar: hızın işaret değiştirdiği anlar [t0, t1] içinde (günlük tarama + ikiye bölme) */
    duraklamalar(govde, t0, t1) {
      const f = t => H.hiz(govde, t), ls = [];
      let a = t0, fa = f(a);
      while (a < t1) {
        const b = Math.min(t1, a + GUN_MS), fb = f(b);
        if (fa !== 0 && fa * fb <= 0) {
          const t = H.ikiyeBol(f, a, b, fa);
          ls.push({ t, tur: fa > 0 ? 'geri' : 'ileri', boylam: H.boylam(govde, t) });
        }
        a = b; fa = fb;
      }
      return ls;
    },
    /* Gezegen ile Güneş'in yer merkezli görünen boylam farkı (−180, 180] */
    gunesFarki(govde, t) { return sar(H.boylam(govde, t) - H.boylam('Sun', t)); },
    /* Karşı konum (dış gezegen): boylam farkı 180° (almanak tanımı) */
    karsiKonum(govde, t0, t1) {
      const f = t => sar(H.gunesFarki(govde, t) - 180), ls = [];
      let a = t0, fa = f(a);
      while (a < t1) {
        const b = Math.min(t1, a + GUN_MS), fb = f(b);
        if (Math.abs(fa) < 90 && Math.abs(fb) < 90 && fa * fb <= 0 && fa !== fb) ls.push(H.ikiyeBol(f, a, b, fa));
        a = b; fa = fb;
      }
      return ls;
    },
    /* İç kavuşum (Merkür, Venüs): boylam farkı 0° ve gezegen Güneş'ten yakın (Güneş'in bu yanında) */
    icKavusum(govde, t0, t1) {
      const A = Ast(), f = t => H.gunesFarki(govde, t), ls = [];
      let a = t0, fa = f(a);
      while (a < t1) {
        const b = Math.min(t1, a + GUN_MS), fb = f(b);
        if (Math.abs(fa) < 90 && Math.abs(fb) < 90 && fa * fb <= 0 && fa !== fb) {
          const t = H.ikiyeBol(f, a, b, fa), d = new Date(t);
          if (A.GeoVector(govde, d, true).Length() < A.GeoVector('Sun', d, true).Length()) ls.push(t);
        }
        a = b; fa = fb;
      }
      return ls;
    },
    /* Günlük yol: bas..son (dahil), her gün saatUT'de */
    yol(govde, bas, son, saatUT) {
      const A = Ast(), n = H.gunFarki(bas, son), ls = [];
      let onceki = null, ek = 0;
      for (let i = 0; i <= n; i++) {
        const gun = H.gunEkle(bas, i), t = H.an(gun, saatUT), e = H.ekliptik(govde, t);
        if (onceki != null) ek += sar(e.lon - onceki) - (e.lon - onceki);
        onceki = e.lon;
        ls.push({ gun, t, lon: e.lon + ek, lat: e.lat, uzak: e.uzak, hiz: H.hiz(govde, t), kadir: A.Illumination(govde, new Date(t)).mag });
      }
      return ls;
    },
    /* Aralıktaki olaylar: duraklamalar, karşı konum ya da iç kavuşum, geri hareket süresi ve yayı */
    olaylar(govde, ic, t0, t1) {
      const dur = H.duraklamalar(govde, t0, t1);
      const kk = ic ? H.icKavusum(govde, t0, t1) : H.karsiKonum(govde, t0, t1);
      const g = dur.find(d => d.tur === 'geri'), i = g ? dur.find(d => d.tur === 'ileri' && d.t > g.t) : null;
      return { duraklamalar: dur, kavusum: kk, geri: g || null, ileri: i || null,
        geriSure: g && i ? (i.t - g.t) / GUN_MS : null, geriYay: g && i ? Math.abs(sar(g.boylam - i.boylam)) : null };
    }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).gezegenyolu = H;

  function tarihYaz(gun) { const [y, a, g] = gun.split('-').map(Number); return g + ' ' + AYLAR[a - 1] + ' ' + y; }

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).gezegenyolu = function (kap, o) {
    const U = o.U, V = o.veri || {};
    const GEZ = V.gezegenler, ON = V.onayarlar, SAAT = V.saat_ut, SINIR = V.sinir_kadir, ENAZ = V.en_az_gun, ENCOK = V.en_cok_gun;
    const link = ls => ls.filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ');
    const ilk = ON[V.ilk_onayar || 0];
    kap.innerHTML = `
      <p class="kucuk soluk" id="gyGezegenAd">Gezegen:</p>
      <div class="cip-grup" id="gyGezegen" role="group" aria-labelledby="gyGezegenAd">${GEZ.map((g, i) => `<button type="button" class="dugme" data-i="${i}" aria-pressed="${g.id === ilk.gezegen}">${U.kacis(g.ad)}</button>`).join('')}</div>
      <p class="kucuk soluk" id="gyHazirAd">Hazır aralıklar:</p>
      <div class="cip-grup" id="gyHazir" role="group" aria-labelledby="gyHazirAd">${ON.map((x, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="gyKanvas"></canvas></div>
      <div class="kontroller">
        <div class="cip-grup">
          <label class="alan" for="gyBas" style="flex:1 1 140px;margin:0">Başlangıç<input type="date" id="gyBas" min="1900-01-01" max="2100-12-31" value="${ilk.bas}"></label>
          <label class="alan" for="gySon" style="flex:1 1 140px;margin:0">Bitiş<input type="date" id="gySon" min="1900-01-01" max="2100-12-31" value="${ilk.son}"></label>
        </div>
        <p class="kucuk soluk" id="gyNot" role="status"></p>
        ${o.kaydirici('gyGun', 'Gün', 0, 1, 1, 0)}
        <div class="cip-grup"><button type="button" class="dugme" id="gyOynat" aria-pressed="false">Oynat</button></div>
      </div>
      ${o.olcumler([['gyHareket', 'Günlük hareket (yıldızlara göre)', true], ['gyParlak', 'Parlaklık', true], ['gyUzak', 'Dünya\'ya uzaklık', true], ['gyDurak1', 'Durur, geri dönmeye başlar'], ['gyDurak2', 'Durur, yeniden doğuya döner'], ['gySure', 'Geri gittiği süre'], ['gyYay', 'Geri gittiği yay'], ['gyKavusum', 'Karşı konum']])}
      <div class="deney-metin" id="gyMetin"></div>
      <p class="kaynak">Konumlar her gün ${U.kacis(V.saat_not)} için; yer merkezli görünen konum (ışık süresi ve sapınç dâhil), Astronomy Engine ile cihazda hesaplanır. Duraklama anı, gezegenin tutulum boylamının (gerçek, tarihli) değişmeyi bıraktığı an; karşı konum, gezegenle Güneş'in boylam farkının 180° olduğu an; iç kavuşum, farkın 0° olduğu ve gezegenin Güneş'in bu yanında olduğu an. Önayarlardaki duraklama ve karşı konum anları JPL Horizons'la karşılaştırıldı (fark birkaç dakika). Çizim tutulum koordinatlarında: doğu solda, kuzey yukarıda (güneye bakınca gök böyle görünür); yıldızlar ${U.sayi(SINIR, 0)} kadire kadar. Saatler cihazının saat diliminde. Kaynaklar: ${link(V.kaynaklar || [])}</p>`;
    const cv = kap.querySelector('#gyKanvas');
    const S = id => kap.querySelector('#' + id);
    const basG = S('gyBas'), sonG = S('gySon'), gunS = S('gyGun'), oynatB = S('gyOynat');
    let secili = Math.max(0, GEZ.findIndex(g => g.id === ilk.gezegen));
    let st = null, yildiz = null, cizgi = null, adlar = null, kirli = true, oynuyor = false, birikim = 0;

    /* Yıldız ve takımyıldız verisi: ilk açılışta bir kez J2000 tutuluma çevrilir */
    Promise.all([U.veri('yildizlar'), U.veri('takimyildiz')]).then(([Y, T]) => {
      const R = Ast().Rotation_EQJ_ECL();
      yildiz = Y.y.filter(s => s[2] <= SINIR).map(s => Object.assign(H.yildizEkliptik(s[0], s[1], R), { m: s[2] }));
      cizgi = T.map(c => c.c.map(l => l.map(p => H.yildizEkliptik(p[0], p[1], R))));
      adlar = T.filter(c => c.r <= 2).map(c => Object.assign(H.yildizEkliptik(c.m[0], c.m[1], R), { ad: c.ad }));
      cv.dataset.yildiz = String(yildiz.length);
      kirli = true;
    }).catch(() => { cv.dataset.yildiz = 'yok'; S('gyNot').textContent = 'Yıldız verisi yüklenemedi; yol yıldızsız çiziliyor.'; kirli = true; });

    function zaman(t) { const d = new Date(t); return U.tamTarih(d) + ', ' + U.saat(d); }
    function aralik() {
      let bas = basG.value, son = sonG.value, not = '';
      const onceki = st ? st : { bas: ilk.bas, son: ilk.son };
      if (!H.gecerliGun(bas)) { bas = onceki.bas; basG.value = bas; }
      if (!H.gecerliGun(son)) { son = onceki.son; sonG.value = son; }
      const d = H.gunFarki(bas, son);
      if (d < ENAZ || d > ENCOK) {
        const n = Math.max(ENAZ, Math.min(ENCOK, H.gunFarki(onceki.bas, onceki.son)));
        if (bas !== onceki.bas) { son = H.gunEkle(bas, d < ENAZ ? n : ENCOK); sonG.value = son; }
        else { bas = H.gunEkle(son, -(d < ENAZ ? n : ENCOK)); basG.value = bas; }
        not = d < ENAZ ? `Aralık en az ${ENAZ} gün olmalı; öbür tarih kaydırıldı.` : `Aralık en çok ${ENCOK} gün olabilir; öbür tarih kaydırıldı.`;
      }
      return { bas, son, not };
    }
    function hesapla(gunKoru) {
      const g = GEZ[secili], a = aralik();
      const t0 = H.an(a.bas, SAAT), t1 = H.an(a.son, SAAT);
      const yol = H.yol(g.id, a.bas, a.son, SAAT), ol = H.olaylar(g.id, g.ic, t0, t1);
      const eski = st && gunKoru ? st.yol[Math.round(Number(gunS.value))] : null;
      st = { g, bas: a.bas, son: a.son, yol, ol };
      gunS.max = String(yol.length - 1);
      let i = 0;
      if (eski) i = Math.max(0, yol.findIndex(p => p.gun === eski.gun));
      gunS.value = String(i);
      S('gyNot').textContent = a.not;
      olcumYaz();
      metin();
      gunYaz();
    }
    function olcumYaz() {
      const { g, ol } = st;
      S('gyKavusum').previousElementSibling.textContent = g.ic ? 'İç kavuşum' : 'Karşı konum';
      S('gyDurak1').textContent = ol.geri ? zaman(ol.geri.t) : 'bu aralıkta yok';
      S('gyDurak2').textContent = ol.ileri ? zaman(ol.ileri.t) : (ol.duraklamalar.some(d => d.tur === 'ileri') ? zaman(ol.duraklamalar.find(d => d.tur === 'ileri').t) : 'bu aralıkta yok');
      S('gySure').textContent = ol.geriSure != null ? U.sayi(ol.geriSure, 0) + ' gün' : 'aralık iki duraklamayı içermiyor';
      S('gyYay').textContent = ol.geriYay != null ? U.sayi(ol.geriYay, 1) + '°' : '—';
      S('gyKavusum').textContent = ol.kavusum.length ? ol.kavusum.map(zaman).join(' · ') : 'bu aralıkta yok';
    }
    function gunYaz() {
      const p = st.yol[Math.round(Number(gunS.value))] || st.yol[0];
      yaz(S('gyGunCikti'), tarihYaz(p.gun));
      const h = Math.abs(p.hiz);
      yaz(S('gyHareket'), h < 0.005 ? 'duruyor gibi' : (p.hiz > 0 ? 'doğuya ' : 'batıya (geri) ') + U.sayi(h, h < 0.1 ? 3 : 2) + '° / gün');
      yaz(S('gyParlak'), U.kadir(p.kadir) + ' kadir');
      yaz(S('gyUzak'), U.sayi(p.uzak, 2) + ' AB (' + U.sayi(p.uzak * o.deger('au') / 1e9, 0) + ' milyon km)');
      kirli = true;
    }
    function metin() {
      const { g, ol, bas, son } = st, gT = t => U.tamTarih(new Date(t));
      const ad = g.ad, P = [];
      const geri = ol.geri, ileri = ol.ileri;
      if (geri && ileri) {
        P.push(`${ad} ${U.ek(gT(geri.t), 'de')} durur gibi olur, sonra ${U.sayi(ol.geriSure, 0)} gün boyunca yıldızlara göre batıya, yani geriye gider ve ${U.ek(gT(ileri.t), 'de')} yeniden doğuya döner. Bu sürede ${U.sayi(ol.geriYay, 1)}° geri gider. Wikipedia'nın tablosu ${ad} için ${U.kacis(g.geri_gun_wiki)} gün geri hareket verir.`);
      } else if (ol.duraklamalar.length) {
        P.push(`Bu aralıkta ${ad} ${ol.duraklamalar.map(d => U.ek(gT(d.t), 'de') + (d.tur === 'geri' ? ' geri dönmeye başlıyor' : ' yeniden doğuya dönüyor')).join(', ')}; geri hareketin tamamını görmek için aralığı genişlet.`);
      } else {
        const ort = st.yol.reduce((s, p) => s + p.hiz, 0) / st.yol.length;
        P.push(`Bu aralıkta ${ad} hiç durmuyor: yıldızlara göre hep ${ort > 0 ? 'doğuya (olağan yönde)' : 'batıya (geri)'} gidiyor. Geri hareketi görmek için hazır aralıklardan birini seç ya da tarihleri değiştir.`);
      }
      if (!g.ic && ol.kavusum.length) {
        const k = ol.kavusum[0], pk = st.yol.reduce((b, p) => (Math.abs(p.t - k) < Math.abs(b.t - k) ? p : b));
        P.push(`Karşı konum ${U.ek(gT(k), 'de')}: ${ad} Güneş'in tam karşısında, Güneş batarken doğar ve bütün gece gökte kalır. Geri hareketin ortası karşı konuma denk gelir, çünkü Dünya içteki daha hızlı yörüngesinde ${U.kacis(g.belirtme)} tam o sırada geçer (NASA: Dünya saniyede ${U.sayi(V.yorunge_hizi.Earth, 1)} km, ${ad} ${U.sayi(V.yorunge_hizi[g.id], 1)} km ile ilerler). O günlerde ${ad} Dünya'ya en yakın ve en parlak hâlindedir: ${U.kadir(pk.kadir)} kadir, ${U.sayi(pk.uzak, 2)} AB.`);
      } else if (g.ic && ol.kavusum.length) {
        const k = ol.kavusum[0];
        P.push(`İç kavuşum ${U.ek(gT(k), 'de')}: ${ad} Dünya ile Güneş'in arasından, Güneş'in bu yanından geçer. Bu kez sollayan ${ad}: Güneş'e daha yakın ve daha hızlı (NASA: saniyede ${U.sayi(V.yorunge_hizi[g.id], 1)} km, Dünya ${U.sayi(V.yorunge_hizi.Earth, 1)} km). Geri hareketin ortası iç kavuşumdur; o günlerde ${ad} Güneş'in parıltısında kaybolur ve akşam yıldızıyken sabah yıldızına döner.`);
      } else if (!ol.kavusum.length) {
        P.push(g.ic ? `Bu aralıkta iç kavuşum yok: ${ad} Güneş'in bu yanından geçmiyor.` : `Bu aralıkta karşı konum yok.`);
      }
      void bas; void son;
      S('gyMetin').innerHTML = P.map(p => '<p>' + p + '</p>').join('');
    }
    function yaz(e, m) { if (e && e.textContent !== m) e.textContent = m; }

    /* ===================== çizim ===================== */
    function ciz() {
      kirli = false;
      if (!st) return;
      const dar = (cv.getBoundingClientRect().width || 600) < 420;
      const { ctx, w, h } = o.kanvas(cv, dar ? 0.8 : 0.62);
      ctx.clearRect(0, 0, w, h);
      const fs = dar ? 11 : 12;
      const yol = st.yol, ust = fs * 2 + 14, alt = fs + 12;
      /* görüş alanı: yolun kutusu + pay; en az 16° geniş */
      let L0 = Infinity, L1 = -Infinity, B0 = Infinity, B1 = -Infinity;
      yol.forEach(p => { L0 = Math.min(L0, p.lon); L1 = Math.max(L1, p.lon); B0 = Math.min(B0, p.lat); B1 = Math.max(B1, p.lat); });
      const Lc = (L0 + L1) / 2, Bc = (B0 + B1) / 2;
      const gen = Math.min(360, Math.max(24, (L1 - L0) * 1.25 + 3)), yuk = Math.max(4, (B1 - B0) * 1.4 + 3);
      const icH = h - ust - alt, s = Math.min(w / gen, icH / yuk);
      const cx = w / 2, cy = ust + icH / 2;
      const X = dl => cx - dl * s, Y = b => cy - (b - Bc) * s;
      const icinde = (x, y, p) => x > -p && x < w + p && y > -p && y < h + p;
      const kutular = [];
      const etiketKoy = (m, x, y, renk, zorunlu, hiza) => {
        const gw = ctx.measureText(m).width, sol = hiza === 'left' ? x : x - gw / 2;
        let xs = Math.max(2, Math.min(w - gw - 2, sol));
        const ys = Math.max(fs + 2, Math.min(h - 4, y));
        const k = [xs - 2, ys - fs, xs + gw + 2, ys + 3];
        if (!zorunlu && kutular.some(b => k[0] < b[2] && k[2] > b[0] && k[1] < b[3] && k[3] > b[1])) return false;
        kutular.push(k);
        if (renk) ctx.fillStyle = o.renk(renk);
        ctx.textAlign = 'left';
        o.etiket(ctx, m, xs, ys);
        return true;
      };
      /* tutulum (Güneş'in yıllık yolu): enlem 0 */
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = o.renk('--hedef'); ctx.globalAlpha = 0.55; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke(); ctx.restore();
      /* takımyıldız çizgileri ve adları */
      if (cizgi) {
        ctx.save(); ctx.strokeStyle = o.renk('--soluk'); ctx.globalAlpha = 0.45; ctx.lineWidth = 1;
        ctx.beginPath();
        cizgi.forEach(c => c.forEach(l => {
          for (let i = 1; i < l.length; i++) {
            const d1 = sar(l[i - 1].lon - Lc), d2 = sar(l[i].lon - Lc);
            if (Math.abs(d1 - d2) > 90) continue;
            const x1 = X(d1), y1 = Y(l[i - 1].lat), x2 = X(d2), y2 = Y(l[i].lat);
            if (!icinde(x1, y1, w) && !icinde(x2, y2, w)) continue;
            ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          }
        }));
        ctx.stroke(); ctx.restore();
      }
      if (yildiz) {
        ctx.fillStyle = o.renk('--yildiz');
        yildiz.forEach(y => {
          const x = X(sar(y.lon - Lc)), yy = Y(y.lat);
          if (!icinde(x, yy, 4)) return;
          ctx.beginPath(); ctx.arc(x, yy, Math.max(0.7, 3.2 - 0.5 * y.m), 0, IKI_PI); ctx.fill();
        });
      }
      /* zorunlu etiketler önce: tarih (sol üst) ve durum, yön oku */
      const p = yol[Math.round(Number(gunS.value))] || yol[0];
      ctx.font = `600 ${fs + 1}px Plex, sans-serif`;
      etiketKoy(tarihYaz(p.gun), 8, fs + 6, '--parsomen', true, 'left');
      ctx.font = `500 ${fs}px Plex, sans-serif`;
      const durum = Math.abs(p.hiz) < 0.005 ? 'duruyor gibi' : (p.hiz < 0 ? 'geri gidiyor' : 'doğuya gidiyor');
      ctx.fillStyle = GERI_RENK;
      etiketKoy(st.g.ad + ': ' + durum, 8, 2 * fs + 10, p.hiz < 0 ? null : '--soluk', true, 'left');
      etiketKoy('← doğu', 6, h - 6, '--soluk', true, 'left');
      const bt = 'batı →';
      etiketKoy(bt, w - ctx.measureText(bt).width - 6, h - 6, '--soluk', true, 'left');
      /* yol: olağan (pirinç) ve geri (turuncu, kalın) parçalar */
      const nok = yol.map(q => [X(q.lon - Lc), Y(q.lat)]);
      for (let i = 1; i < yol.length; i++) {
        const geri = yol[i - 1].hiz + yol[i].hiz < 0;
        ctx.beginPath(); ctx.moveTo(nok[i - 1][0], nok[i - 1][1]); ctx.lineTo(nok[i][0], nok[i][1]);
        ctx.strokeStyle = geri ? GERI_RENK : o.renk('--pirinc'); ctx.lineWidth = geri ? 3.4 : 1.8; ctx.stroke();
      }
      ctx.lineWidth = 1;
      /* her günün küçük noktası; ay başları adıyla */
      ctx.fillStyle = o.renk('--parsomen');
      nok.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.1, 0, IKI_PI); ctx.fill(); });
      /* olaylar: duraklamalar (halka) ve karşı konum / iç kavuşum (mavi halka) */
      const konum = t => {
        const i = Math.max(0, Math.min(yol.length - 2, Math.floor((t - yol[0].t) / GUN_MS))), f = Math.max(0, Math.min(1, (t - yol[i].t) / GUN_MS));
        return [nok[i][0] + (nok[i + 1][0] - nok[i][0]) * f, nok[i][1] + (nok[i + 1][1] - nok[i][1]) * f];
      };
      ctx.font = `600 ${fs}px Plex, sans-serif`;
      if (yol.length > 1) {
        st.ol.duraklamalar.forEach(d => {
          const [x, y] = konum(d.t);
          ctx.beginPath(); ctx.arc(x, y, 6.5, 0, IKI_PI); ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.8; ctx.stroke(); ctx.lineWidth = 1;
          etiketKoy('durur', x, y - 11, '--parsomen', false);
        });
        st.ol.kavusum.forEach(t => {
          const [x, y] = konum(t);
          ctx.beginPath(); ctx.arc(x, y, 8, 0, IKI_PI); ctx.strokeStyle = o.renk('--hedef'); ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
          etiketKoy(st.g.ic ? 'iç kavuşum' : 'karşı konum', x, y + 22, '--hedef', false);
        });
      }
      /* gezegen (seçili gün) */
      const [gx, gy] = nok[Math.round(Number(gunS.value))] || nok[0];
      ctx.beginPath(); ctx.arc(gx, gy, 5.5, 0, IKI_PI); ctx.fillStyle = o.renk('--gezegen'); ctx.fill();
      ctx.strokeStyle = document.documentElement.classList.contains('kirmizi') ? '#000' : '#0A1422'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1;
      kutular.push([gx - 8, gy - 8, gx + 8, gy + 8]);
      /* ay başları */
      ctx.font = `500 ${fs}px Plex, sans-serif`;
      yol.forEach((q, i) => {
        if (!q.gun.endsWith('-01')) return;
        const [x, y] = nok[i];
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
        const ad = AYLAR[Number(q.gun.slice(5, 7)) - 1];
        if (!etiketKoy(ad, x, y + fs + 6, '--soluk', false)) etiketKoy(ad, x, y - 8, '--soluk', false);
      });
      /* takımyıldız adları en son: boş yer varsa */
      if (adlar) {
        ctx.font = `italic 500 ${fs}px Plex, sans-serif`;
        adlar.forEach(c => {
          const x = X(sar(c.lon - Lc)), y = Y(c.lat);
          if (x < 10 || x > w - 10 || y < ust || y > h - alt) return;
          etiketKoy(c.ad, x, y, '--soluk', false);
        });
      }
    }

    /* ===================== olaylar ===================== */
    function durdurOynat() { oynuyor = false; oynatB.textContent = 'Oynat'; oynatB.setAttribute('aria-pressed', 'false'); }
    S('gyGezegen').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      secili = Number(b.dataset.i);
      kap.querySelectorAll('#gyGezegen button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      durdurOynat(); hesapla(true);
    });
    S('gyHazir').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const x = ON[Number(b.dataset.i)];
      secili = Math.max(0, GEZ.findIndex(g => g.id === x.gezegen));
      kap.querySelectorAll('#gyGezegen button').forEach((y, i) => y.setAttribute('aria-pressed', String(i === secili)));
      basG.value = x.bas; sonG.value = x.son; st = null;
      durdurOynat(); hesapla(false);
    });
    [basG, sonG].forEach(g => g.addEventListener('change', () => { durdurOynat(); hesapla(true); }));
    gunS.addEventListener('input', () => { if (st) gunYaz(); });
    oynatB.addEventListener('click', () => {
      if (oynuyor) { durdurOynat(); return; }
      if (Number(gunS.value) >= Number(gunS.max)) gunS.value = '0';
      oynuyor = true; birikim = 0; oynatB.textContent = 'Durdur'; oynatB.setAttribute('aria-pressed', 'true');
    });
    hesapla(false);
    /* Oynatırken gün gün ilerler (saniyede ~15 gün; azaltılmış harekette her adımda bir gün). Durgunken yalnız bir şey
       değişince yeniden çizer. */
    const d = o.dongu(dt => {
      if (oynuyor) {
        birikim += o.azHareket ? 1 : dt * V.oynatma_gun_saniye;
        if (birikim >= 1) {
          const n = Math.floor(birikim); birikim -= n;
          const yeni = Math.min(Number(gunS.max), Number(gunS.value) + n);
          gunS.value = String(yeni); gunYaz();
          if (yeni >= Number(gunS.max)) durdurOynat();
        }
      }
      if (kirli) ciz();
    });
    const yeniden = () => { kirli = true; };
    document.addEventListener('urania:tema', yeniden);
    window.addEventListener('resize', yeniden);
    return { durdur() { d.durdur(); document.removeEventListener('urania:tema', yeniden); window.removeEventListener('resize', yeniden); } };
  };
})();
