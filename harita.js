/* harita.js — tüm gök levhası (başucu merkezde, ufuk kenarda).
   Gökyüzüne sırt üstü yatıp bakıyormuş gibi: kuzey yukarıda, doğu SOLDA.
   İzdüşüm: eşit uzaklıklı azimutal — merkezden uzaklık (90° − yükseklik) ile orantılı. */
(function () {
  'use strict';
  const G = window.Gok;

  function renk(ad) { return getComputedStyle(document.documentElement).getPropertyValue(ad).trim(); }
  function kirmizi() { return document.documentElement.classList.contains('kirmizi'); }

  /* B−V renk ölçüsünden kaba yıldız rengi (yalnız görsel ipucu). */
  function bvRenk(bv) {
    if (bv == null || isNaN(bv)) return null;
    if (bv < 0) return '#C9D8FF';
    if (bv < 0.3) return '#E6ECFF';
    if (bv < 0.6) return '#FFF6E4';
    if (bv < 1.0) return '#FFE2B5';
    if (bv < 1.4) return '#FFC98C';
    return '#FFB27A';
  }

  function olustur(canvas, veri, tiklaninca) {
    const ctx = canvas.getContext('2d');
    const yildizV = veri.yildizlar.y.map(s => G.birimVektor(s[0], s[1]));
    const tyV = veri.takimyildizlar.map(t => ({
      k: t.k, ad: t.ad, rank: t.r || 3,
      m: G.birimVektor(t.m[0], t.m[1]),
      c: t.c.map(cizgi => cizgi.map(n => G.birimVektor(n[0], n[1])))
    }));
    let isabet = [];
    let olcu = { W: 0, R: 0, cx: 0, cy: 0 };
    let sonDurum = null;
    let yerlesim = { etiketler: [], engeller: [] };

    function boyutla() {
      const css = canvas.clientWidth || 360;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      if (canvas.width !== Math.round(css * dpr)) {
        canvas.width = Math.round(css * dpr);
        canvas.height = Math.round(css * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      olcu = { W: css, R: css / 2 - 24, cx: css / 2, cy: css / 2 };
    }

    /* yükseklik/azimut → ekran. Ufkun altı için null (çizgilerde kırpma ayrıca yapılır). */
    function ekran(alt, az) {
      const r = (90 - alt) / 90 * olcu.R;
      const a = az * Math.PI / 180;
      return { x: olcu.cx - r * Math.sin(a), y: olcu.cy - r * Math.cos(a), r };
    }

    function ciz(d) {
      sonDurum = d;
      boyutla();
      const { W, R, cx, cy } = olcu;
      const kir = kirmizi();
      const c = {
        zemin: renk('--gece'), levha: renk('--levha'), pirinc: renk('--pirinc'), soluk: renk('--soluk'),
        cizgi: renk('--cizgi'), yazi: renk('--parsomen'), gezegen: renk('--gezegen'), ay: renk('--ay'),
        yildiz: renk('--yildiz'), hedef: renk('--hedef'), uyari: renk('--uyari')
      };
      isabet = [];
      const etiketler = [];
      const engeller = [];
      /* Etiketler sonda, önceliğe göre yerleştirilir; çakışan düşük öncelikli etiket atlanır. */
      const etiket = (metin, x, y, font, renk, oncelik, ofset, merkez) => etiketler.push({ metin, x, y, font, renk, oncelik, ofset: ofset || 0, merkez: !!merkez });
      /* Kalabalık ızgarası (8 px hücre): yıldız noktaları, takımyıldız çizgileri ve uydu izi buraya ağırlıkla yazılır.
         Etiket, çakışmayan aday yerler arasından en az şeyin üstüne düşene konur (eskiden ilk uyan yer seçiliyordu). */
      const HC = 8, hs = Math.ceil(W / HC) + 1, kalabalik = new Float32Array(hs * hs);
      const isle = (x, y, a) => { const i = Math.floor(x / HC), j = Math.floor(y / HC); if (i >= 0 && j >= 0 && i < hs && j < hs) kalabalik[j * hs + i] += a; };
      const cizgiIsle = (x0, y0, x1, y1, a) => { const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 4)); for (let k = 0; k <= n; k++) isle(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, a); };
      ctx.clearRect(0, 0, W, W);

      /* Gök zemini: Güneş'in yüksekliğine göre gündüz / alacakaranlık / gece */
      const gAlt = d.gunes.alt;
      let gokRenk = c.levha;
      if (!kir) {
        if (gAlt > 0) gokRenk = '#2F5378';
        else if (gAlt > -6) gokRenk = '#24405F';
        else if (gAlt > -12) gokRenk = '#1B3049';
        else if (gAlt > -18) gokRenk = '#172A40';
        else gokRenk = '#111F33';
      }
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = gokRenk; ctx.fill();

      /* Yükseklik çemberleri 30° ve 60° */
      ctx.save();
      ctx.setLineDash([2, 5]);
      ctx.strokeStyle = c.cizgi; ctx.lineWidth = 1;
      [30, 60].forEach(a => { ctx.beginPath(); ctx.arc(cx, cy, (90 - a) / 90 * R, 0, Math.PI * 2); ctx.stroke(); });
      ctx.restore();

      const m = G.ufukMatrisi(d.zaman, d.gzl);
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

      /* Takımyıldız çizgileri */
      ctx.strokeStyle = kir ? 'rgba(194,58,46,.35)' : 'rgba(200,164,93,.38)';
      ctx.lineWidth = 0.9;
      tyV.forEach(t => {
        t.c.forEach(cizgi => {
          let onceki = null;
          cizgi.forEach(v => {
            const h = G.ufkaCevir(m, v);
            const p = ekran(h.alt, h.az);
            p.alt = h.alt;
            if (onceki && (onceki.alt > -15 || p.alt > -15)) {
              ctx.beginPath(); ctx.moveTo(onceki.x, onceki.y); ctx.lineTo(p.x, p.y); ctx.stroke();
              cizgiIsle(onceki.x, onceki.y, p.x, p.y, 0.4);
            }
            onceki = p;
          });
        });
      });

      /* Takımyıldız adları */
      const tyFont = 'italic 400 ' + Math.max(10, W / 46) + 'px Spectral, Georgia, serif';
      /* Takımyıldız adı küçük italik yazı: gece gökte 4,8:1 (eski ,42 saydamlık 3,4:1 idi); kırmızı modda --soluk 4,9:1 (eski 2,0:1) */
      const tyRenk = kir ? c.soluk : 'rgba(233,226,208,.55)';
      const rankSinir = W < 520 ? 1 : 2;
      tyV.forEach(t => {
        const h = G.ufkaCevir(m, t.m);
        if (h.alt < 8) return;
        const p = ekran(h.alt, h.az);
        if (t.rank <= rankSinir) etiket(t.ad, p.x, p.y, tyFont, tyRenk, 0, 0, true);
        isabet.push({ x: p.x, y: p.y, oncelik: 0, bilgi: '<b>' + Urania.kacis(t.ad) + '</b> takımyıldızı' });
      });

      /* Yıldızlar */
      const limit = d.limitKadir;
      const olc = W / 480;
      veri.yildizlar.y.forEach((s, i) => {
        if (s[2] > limit) return;
        const h = G.ufkaCevir(m, yildizV[i]);
        if (h.alt < 0) return;
        const p = ekran(h.alt, h.az);
        /* Nokta boyu yalnız yıldızın kadirine bağlı (sınır 1,5'e çekilince parlak yıldızlar küçülmesin) */
        const r = Math.max(0.55, (7.2 - s[2]) * 0.62 * olc);
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = kir ? c.yildiz : (bvRenk(s[3]) || c.yildiz);
        ctx.fill();
        isle(p.x, p.y, r > 1.6 ? 2 : 1);
        /* Parlak yıldızın noktası etiketlerin altında kalmasın (etiketler sonda yerleştirilir) */
        if (s[2] < 3) engeller.push({ x: p.x, y: p.y, r: r + 0.5, yumusak: true });
        const ad = veri.yildizlar.adlar[i];
        if (ad && s[2] < 1.6) {
          etiket(ad, p.x, p.y, '500 ' + Math.max(10, W / 50) + 'px Plex, system-ui, sans-serif', kir ? c.soluk : 'rgba(233,226,208,.7)', 2 - s[2] / 2, r + 3);
        }
        if (s[2] < 3.5 || ad) isabet.push({ x: p.x, y: p.y, oncelik: 1, bilgi: '<b>' + Urania.kacis(ad || 'Yıldız') + '</b> · ' + Urania.kadir(s[2]) + ' kadir · ' + Urania.derece(h.alt) + ' yükseklik, ' + G.YON_UZUN[G.yon(h.az)] });
      });

      /* Dürbün hedefleri */
      ctx.textAlign = 'left';
      (d.hedefler || []).forEach(t => {
        const h = G.ufkaCevir(m, G.birimVektor(t.ra, t.dec));
        if (h.alt < 0) return;
        const p = ekran(h.alt, h.az);
        const hr = 4.5 * Math.max(olc, .8);
        ctx.beginPath(); ctx.arc(p.x, p.y, hr, 0, Math.PI * 2);
        ctx.strokeStyle = c.hedef; ctx.lineWidth = 1.2; ctx.stroke();
        /* Hedef halkası da engel: başka bir etiket halkanın üstüne yazılmasın (Cr 399, M27, M8 çakışıyordu) */
        engeller.push({ x: p.x, y: p.y, r: hr + 1 });
        etiket(t.kisa, p.x, p.y, '500 ' + Math.max(9, W / 56) + 'px Plex, system-ui, sans-serif', c.hedef, 1, hr + 3);
        isabet.push({ x: p.x, y: p.y, oncelik: 2, bilgi: '<b>' + Urania.kacis(t.ad) + '</b> · ' + Urania.kacis(t.turAd) + ' · ' + Urania.kadir(t.kadir) + ' kadir · ' + Urania.derece(h.alt) + ' yükseklik' });
      });

      /* Mira: değişen yıldız. Yıldız verisinde yok (ortalama 6,5 kadir); en parlak dönemine yakınsa dolu nokta ve ad,
         değilse soluk halka (Balina'nın çizgisi orada biter) */
      if (d.mira) {
        const h = G.ufkaCevir(m, G.birimVektor(d.mira.ra, d.mira.dec));
        if (h.alt >= 0) {
          const p = ekran(h.alt, h.az), mp = d.mira.parlak;
          ctx.beginPath(); ctx.arc(p.x, p.y, (mp ? 2.4 : 2) * Math.max(olc, .85), 0, Math.PI * 2);
          if (mp && limit >= 4) { ctx.fillStyle = c.yildiz; ctx.fill(); etiket('Mira', p.x, p.y, '500 ' + Math.max(10, W / 50) + 'px Plex, system-ui, sans-serif', kir ? c.soluk : 'rgba(233,226,208,.7)', 1.5, 5); }
          else { ctx.strokeStyle = c.soluk; ctx.lineWidth = 1; ctx.stroke(); }
          const g = t => Urania.gun(t);
          isabet.push({ x: p.x, y: p.y, oncelik: 1, bilgi: '<b>Mira</b> (ο Ceti) · değişen yıldız: 332 günde bir 2–5 kadire çıkar, en sönükken 10 kadir · ' +
            (mp ? 'şu sıralar en parlak dönemine yakın' : 'şu sıralar sönük') + ' · tahmini en parlak: ' + g(d.mira.son) + ', sonraki ' + g(d.mira.sonraki) + ' · ' + Urania.derece(h.alt) + ' yükseklik' });
        }
      }

      /* Meteor radyantları (yalnız etkin yağmurlar) */
      (d.radyantlar || []).forEach(r => {
        const h = G.ufkaCevir(m, G.birimVektor(r.ra, r.dec));
        if (h.alt < 0) return;
        const p = ekran(h.alt, h.az);
        ctx.strokeStyle = c.uyari; ctx.lineWidth = 1.3;
        for (let k = 0; k < 4; k++) {
          const a = k * Math.PI / 4;
          ctx.beginPath();
          ctx.moveTo(p.x + Math.cos(a) * 3, p.y + Math.sin(a) * 3);
          ctx.lineTo(p.x + Math.cos(a) * 8, p.y + Math.sin(a) * 8);
          ctx.moveTo(p.x - Math.cos(a) * 3, p.y - Math.sin(a) * 3);
          ctx.lineTo(p.x - Math.cos(a) * 8, p.y - Math.sin(a) * 8);
          ctx.stroke();
        }
        engeller.push({ x: p.x, y: p.y, r: 8 });
        isabet.push({ x: p.x, y: p.y, oncelik: 3, bilgi: '<b>' + Urania.kacis(r.ad) + '</b> radyantı · meteorlar bu noktadan saçılıyormuş gibi görünür' });
      });

      /* Gezegenler */
      (d.gezegenler || []).forEach(g => {
        if (g.alt < 0) return;
        const p = ekran(g.alt, g.az);
        const r = Math.max(2.4, (3.2 - g.kadir) * 0.9) * Math.max(olc, .85);
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = c.gezegen; ctx.fill();
        engeller.push({ x: p.x, y: p.y, r: r + 1 });
        etiket(g.ad, p.x, p.y, '600 ' + Math.max(11, W / 42) + 'px Plex, system-ui, sans-serif', c.gezegen, 9 - g.kadir / 2, r + 4);
        isabet.push({ x: p.x, y: p.y, oncelik: 4, bilgi: '<b>' + g.ad + '</b> · ' + Urania.kadir(g.kadir) + ' kadir · ' + Urania.derece(g.alt) + ' yükseklik, ' + G.YON_UZUN[G.yon(g.az)] });
      });

      /* Uydular (ISS, Tiangong, Starlink dizisi): yaklaşan görünür geçişlerin yolu ve anlık konumlar */
      const uRenk = kir ? c.pirinc : '#9FE3C7';
      (d.uyduYollari || []).forEach(y => {
        if (!y.yol || y.yol.length < 2) return;
        ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = uRenk; ctx.lineWidth = 1.3;
        ctx.beginPath(); let ilk = true;
        let o = null;
        y.yol.forEach(n => { if (n.alt < 0) { ilk = true; o = null; return; } const p = ekran(n.alt, n.az); if (ilk) { ctx.moveTo(p.x, p.y); ilk = false; } else ctx.lineTo(p.x, p.y); if (o) cizgiIsle(o.x, o.y, p.x, p.y, 3); o = p; });
        ctx.stroke(); ctx.restore();
        /* Etiket görünür bölümün başında (güneşli ve ufkun üstünde); gölgede başlayan yolda o an görünmez */
        const bas = (y.gBas && y.yol.reduce((a, n) => (!a || Math.abs(n.t - y.gBas.t) < Math.abs(a.t - y.gBas.t) ? n : a), null)) || y.yol.find(n => n.alt >= 10 && n.isikli) || y.yol.find(n => n.alt >= 10);
        if (bas) { const p = ekran(bas.alt, bas.az); etiket(y.kisa + ' ' + Urania.saat(y.gBas ? y.gBas.t : bas.t), p.x, p.y, '600 ' + Math.max(11, W / 44) + 'px Plex, system-ui, sans-serif', uRenk, 8, 6); }
      });
      (d.uydular || []).forEach(u => {
        if (!(u.alt > 0)) return;
        const p = ekran(u.alt, u.az);
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.strokeStyle = uRenk; ctx.lineWidth = 1.6; ctx.stroke();
        if (u.isikli) { ctx.fillStyle = uRenk; ctx.fill(); }
        isabet.push({ x: p.x, y: p.y, oncelik: u.isikli ? 6 : 0, bilgi: '<b>' + Urania.kacis(u.ad) + '</b> · ' + (u.isikli ? 'Güneş ışığı alıyor' : 'gölgede, görünmez') + ' · ' + Urania.derece(u.alt) + ' yükseklik' });
      });

      /* Güneş (gündüzse) */
      if (d.gunes.alt > -1) {
        const p = ekran(d.gunes.alt, d.gunes.az);
        ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = kir ? c.pirinc : '#FFD77A'; ctx.fill();
        engeller.push({ x: p.x, y: p.y, r: 10 });
        isabet.push({ x: p.x, y: p.y, oncelik: 5, bilgi: '<b>Güneş</b> · ' + Urania.derece(d.gunes.alt) + ' yükseklik. Dürbünle asla bakma.' });
      }

      /* Ay: evresiyle, aydınlık yüzü Güneş'e dönük */
      if (d.ay.alt > -1) {
        const p = ekran(d.ay.alt, d.ay.az);
        /* Aydınlık yüzün yönü: Ay'dan Güneş'e giden büyük çember boyunca 0,3° ötedeki noktanın ekrandaki yönü.
           (Güneş'in kendi izdüşümüne çekilen düz çizgi, Güneş ufkun çok altındayken yanlış yön verir.) */
        const v = (alt, az) => { const a = alt * Math.PI / 180, z = az * Math.PI / 180; return [Math.cos(a) * Math.sin(z), Math.cos(a) * Math.cos(z), Math.sin(a)]; };
        const mv = v(d.ay.alt, d.ay.az), sv = v(d.gunes.alt, d.gunes.az);
        const ic = mv[0] * sv[0] + mv[1] * sv[1] + mv[2] * sv[2];
        let tv = [sv[0] - ic * mv[0], sv[1] - ic * mv[1], sv[2] - ic * mv[2]];
        const tn = Math.hypot(tv[0], tv[1], tv[2]) || 1; tv = tv.map(x => x / tn);
        const dl = 0.3 * Math.PI / 180, qv = [0, 1, 2].map(i => mv[i] * Math.cos(dl) + tv[i] * Math.sin(dl));
        const q = ekran(Math.asin(Math.max(-1, Math.min(1, qv[2]))) * 180 / Math.PI, (Math.atan2(qv[0], qv[1]) * 180 / Math.PI + 360) % 360);
        const yon = Math.atan2(q.y - p.y, q.x - p.x);
        const r = 8 * Math.max(olc, .9);
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(yon);
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = kir ? '#2A0505' : '#3A4558'; ctx.fill();
        /* Aydınlık yarım (Güneş yönünde, +x) */
        ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
        const k = d.ay.oran;
        const e = Math.abs(1 - 2 * k) * r;
        if (k >= 0.5) {
          ctx.ellipse(0, 0, e, r, 0, Math.PI / 2, -Math.PI / 2);
          ctx.fillStyle = c.ay; ctx.fill();
        } else {
          ctx.ellipse(0, 0, e, r, 0, Math.PI / 2, -Math.PI / 2, true);
          ctx.fillStyle = c.ay; ctx.fill();
        }
        ctx.restore();
        engeller.push({ x: p.x, y: p.y, r: r + 1 });
        etiket('Ay', p.x, p.y, '600 ' + Math.max(11, W / 42) + 'px Plex, system-ui, sans-serif', c.ay, 12, r + 4);
        isabet.push({ x: p.x, y: p.y, oncelik: 5, bilgi: '<b>Ay</b> · ' + d.ay.ad + ', %' + Math.round(d.ay.oran * 100) + ' aydınlık · ' + Urania.derece(d.ay.alt) + ' yükseklik' });
      }
      etiketleriYerlestir(etiketler, engeller, { kalabalik, HC, hs, hale: gokRenk });
      ctx.restore();

      /* Ufuk halkası ve yönler */
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = c.pirinc; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, R + 4, 0, Math.PI * 2);
      ctx.strokeStyle = kir ? 'rgba(211,58,44,.3)' : 'rgba(200,164,93,.3)'; ctx.lineWidth = 0.8; ctx.stroke();
      /* Pirinç kadran çentikleri: her 10°'de kısa, 30°'de uzun */
      for (let a = 0; a < 360; a += 10) {
        const uz = a % 30 === 0 ? 7 : 3.5;
        const t = a * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cx - (R + 4) * Math.sin(t), cy - (R + 4) * Math.cos(t));
        ctx.lineTo(cx - (R + 4 + uz) * Math.sin(t), cy - (R + 4 + uz) * Math.cos(t));
        ctx.strokeStyle = c.pirinc; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.font = '600 13px Plex, system-ui, sans-serif';
      ctx.fillStyle = c.pirinc; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      [['K', 0], ['D', 90], ['G', 180], ['B', 270]].forEach(([h, az]) => {
        const t = az * Math.PI / 180;
        const x = cx - (R + 17) * Math.sin(t), y = cy - (R + 17) * Math.cos(t);
        ctx.fillStyle = c.zemin; ctx.fillRect(x - 8, y - 8, 16, 16);
        ctx.fillStyle = c.pirinc; ctx.fillText(h, x, y + 1);
      });
    }

    function etiketleriYerlestir(ls, engeller, yog) {
      const kutular = [];
      yerlesim = { etiketler: [], engeller: engeller.slice() };   // testler için: son çizimin etiket kutuları
      /* Ay, gezegen, Güneş, parlak yıldız, hedef halkası ve radyant işaretleri de engel sayılır */
      /* Yumuşak engel (parlak yıldız noktası) yalnız ilk denemede: hiçbir yere sığmayan etiket ikinci turda
         yıldızın üstüne yazılabilir; Ay, gezegen ve uydu adları (öncelik ≥ 8) kaybolmasın diye üçüncü turda
         yalnız öbür etiketlerden kaçar. */
      engeller.forEach(e => kutular.push({ x: e.x - e.r, y: e.y - e.r, w: 2 * e.r, h: 2 * e.r, yumusak: !!e.yumusak, engel: true }));
      const { cx, cy, R } = olcu;
      const icerde = k => [[k.x, k.y], [k.x + k.w, k.y], [k.x, k.y + k.h], [k.x + k.w, k.y + k.h]].every(([x, y]) => Math.hypot(x - cx, y - cy) <= R - 2);
      const kesisir = (k, b) => k.x < b.x + b.w && k.x + k.w > b.x && k.y < b.y + b.h && k.y + k.h > b.y;
      const cakisir = (k, tur) => !icerde(k) || kutular.some(b => (tur === 0 || !b.yumusak) && (tur < 2 || !b.engel) && kesisir(k, b));
      /* Kutunun üstüne düştüğü kalabalık (yıldız, çizgi, uydu izi) */
      const kalabalik = k => {
        if (!yog) return 0;
        let t = 0;
        const i0 = Math.max(0, Math.floor(k.x / yog.HC)), i1 = Math.min(yog.hs - 1, Math.floor((k.x + k.w) / yog.HC));
        const j0 = Math.max(0, Math.floor(k.y / yog.HC)), j1 = Math.min(yog.hs - 1, Math.floor((k.y + k.h) / yog.HC));
        for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) t += yog.kalabalik[j * yog.hs + i];
        return t;
      };
      ctx.textBaseline = 'middle';
      ls.sort((a, b) => b.oncelik - a.oncelik).forEach(e => {
        ctx.font = e.font;
        const w = ctx.measureText(e.metin).width, h = parseFloat(e.font.match(/(\d+(?:\.\d+)?)px/)[1]) * 1.1;
        const o = e.ofset, oc = o * 0.75;
        /* Sağ, sol, üst, alt ve dört köşe; sıra eşit kalabalıkta tercih sırasıdır (sağ önce) */
        const adaylar = e.merkez
          ? [[e.x - w / 2, e.y - h / 2]]
          : [[e.x + o, e.y - h / 2], [e.x - o - w, e.y - h / 2], [e.x - w / 2, e.y - o - h], [e.x - w / 2, e.y + o],
            [e.x + oc, e.y - oc - h], [e.x - oc - w, e.y - oc - h], [e.x + oc, e.y + oc], [e.x - oc - w, e.y + oc]];
        const turlar = e.oncelik >= 8 ? [0, 1, 2] : [0, 1];
        for (const tur of turlar) {
          let en = null;
          adaylar.forEach(([x, y], s) => {
            const k = { x: x - 1, y, w: w + 2, h };
            if (cakisir(k, tur)) return;
            const puan = kalabalik(k) + s * 0.15;
            if (!en || puan < en.puan) en = { k, x, y, puan };
          });
          if (!en) continue;
          kutular.push(en.k);
          yerlesim.etiketler.push(Object.assign({ metin: e.metin, tur }, en.k));
          /* Hale: etiket bir çizginin ya da sönük yıldızın üstüne düşse de okunur (gök zemini renginde ince kontur) */
          if (yog && yog.hale && !e.merkez) {
            ctx.save(); ctx.lineJoin = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = yog.hale; ctx.globalAlpha = 0.9;
            ctx.strokeText(e.metin, en.x, en.y + h / 2); ctx.restore();
          }
          ctx.fillStyle = e.renk; ctx.textAlign = 'left';
          ctx.fillText(e.metin, en.x, en.y + h / 2);
          return;
        }
      });
    }

    function tikla(ev) {
      /* Dokunulan nokta çizim birimine çevrilir: CSS dönüşümü (ölçek), kenarlık ve dolgu hesaba katılır */
      const b = canvas.getBoundingClientRect(), st = getComputedStyle(canvas);
      const f = canvas.offsetWidth ? b.width / canvas.offsetWidth : 1;
      const pl = parseFloat(st.paddingLeft) || 0, pt = parseFloat(st.paddingTop) || 0;
      const icG = canvas.clientWidth - pl - (parseFloat(st.paddingRight) || 0);
      const k = icG > 0 ? olcu.W / icG : 1;
      const x = ((ev.clientX - b.left) / f - canvas.clientLeft - pl) * k, y = ((ev.clientY - b.top) / f - canvas.clientTop - pt) * k;
      /* En yakın cisim; öncelik (Ay, gezegen, uydu…) yalnız uzaklıklar 3 px'ten yakınsa belirleyici */
      const aday = isabet.map(h => ({ h, dd: Math.hypot(h.x - x, h.y - y) })).filter(a => a.dd <= 22).sort((a, b2) => a.dd - b2.dd);
      let en = aday[0] || null;
      const d0 = en ? en.dd : 0;   // eşik en yakın adaya göre (zincirleme kaymasın)
      aday.forEach(a => { if (a.dd <= d0 + 3 && a.h.oncelik > en.h.oncelik) en = a; });
      /* Konum da verilir: bilgi kutusu dokunulan cismin üstüne binmesin (alttaki cisimde kutu üste çıkar) */
      tiklaninca(en ? en.h.bilgi : null, en ? { x: en.h.x / olcu.W, y: en.h.y / olcu.W } : null);
    }
    canvas.addEventListener('click', tikla);
    let zamanlayici = null;
    window.addEventListener('resize', () => {
      clearTimeout(zamanlayici);
      zamanlayici = setTimeout(() => { if (sonDurum && canvas.offsetParent) ciz(sonDurum); }, 120);
    });
    document.addEventListener('urania:tema', () => { if (sonDurum) ciz(sonDurum); });

    return { ciz, yerlesim: () => yerlesim };
  }

  window.Harita = { olustur };
})();
