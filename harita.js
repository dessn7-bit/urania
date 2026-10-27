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
            }
            onceki = p;
          });
        });
      });

      /* Takımyıldız adları */
      const tyFont = 'italic 400 ' + Math.max(10, W / 46) + 'px Spectral, Georgia, serif';
      const tyRenk = kir ? 'rgba(194,58,46,.6)' : 'rgba(233,226,208,.42)';
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
        const r = Math.max(0.55, (limit + 1.2 - s[2]) * 0.62 * olc);
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = kir ? c.yildiz : (bvRenk(s[3]) || c.yildiz);
        ctx.fill();
        const ad = veri.yildizlar.adlar[i];
        if (ad && s[2] < 1.6) {
          etiket(ad, p.x, p.y, '500 ' + Math.max(10, W / 50) + 'px Plex, system-ui, sans-serif', kir ? c.soluk : 'rgba(233,226,208,.7)', 2 - s[2] / 2, r + 3);
        }
        if (s[2] < 3.5) isabet.push({ x: p.x, y: p.y, oncelik: 1, bilgi: '<b>' + Urania.kacis(ad || 'Yıldız') + '</b> · ' + Urania.kadir(s[2]) + ' kadir · ' + Urania.derece(h.alt) + ' yükseklik, ' + G.YON_UZUN[G.yon(h.az)] });
      });

      /* Dürbün hedefleri */
      ctx.textAlign = 'left';
      (d.hedefler || []).forEach(t => {
        const h = G.ufkaCevir(m, G.birimVektor(t.ra, t.dec));
        if (h.alt < 0) return;
        const p = ekran(h.alt, h.az);
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5 * Math.max(olc, .8), 0, Math.PI * 2);
        ctx.strokeStyle = c.hedef; ctx.lineWidth = 1.2; ctx.stroke();
        etiket(t.kisa, p.x, p.y, '500 ' + Math.max(9, W / 56) + 'px Plex, system-ui, sans-serif', c.hedef, 1, 7);
        isabet.push({ x: p.x, y: p.y, oncelik: 2, bilgi: '<b>' + Urania.kacis(t.ad) + '</b> · ' + Urania.kacis(t.turAd) + ' · ' + Urania.kadir(t.kadir) + ' kadir · ' + Urania.derece(h.alt) + ' yükseklik' });
      });

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
        y.yol.forEach(n => { if (n.alt < 0) { ilk = true; return; } const p = ekran(n.alt, n.az); if (ilk) { ctx.moveTo(p.x, p.y); ilk = false; } else ctx.lineTo(p.x, p.y); });
        ctx.stroke(); ctx.restore();
        const bas = y.yol.find(n => n.alt >= 10);
        if (bas) { const p = ekran(bas.alt, bas.az); etiket(y.kisa + ' ' + Urania.saat(bas.t), p.x, p.y, '600 ' + Math.max(11, W / 44) + 'px Plex, system-ui, sans-serif', uRenk, 8, 6); }
      });
      (d.uydular || []).forEach(u => {
        if (!(u.alt > 0)) return;
        const p = ekran(u.alt, u.az);
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.strokeStyle = uRenk; ctx.lineWidth = 1.6; ctx.stroke();
        if (u.isikli) { ctx.fillStyle = uRenk; ctx.fill(); }
        isabet.push({ x: p.x, y: p.y, oncelik: 6, bilgi: '<b>' + Urania.kacis(u.ad) + '</b> · ' + (u.isikli ? 'Güneş ışığı alıyor' : 'gölgede, görünmez') + ' · ' + Urania.derece(u.alt) + ' yükseklik' });
      });

      /* Güneş (gündüzse) */
      if (d.gunes.alt > -1) {
        const p = ekran(d.gunes.alt, d.gunes.az);
        ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = kir ? c.pirinc : '#FFD77A'; ctx.fill();
        isabet.push({ x: p.x, y: p.y, oncelik: 5, bilgi: '<b>Güneş</b> · ' + Urania.derece(d.gunes.alt) + ' yükseklik. Dürbünle asla bakma.' });
      }

      /* Ay: evresiyle, aydınlık yüzü Güneş'e dönük */
      if (d.ay.alt > -1) {
        const p = ekran(d.ay.alt, d.ay.az);
        const gs = ekran(d.gunes.alt, d.gunes.az);
        const yon = Math.atan2(gs.y - p.y, gs.x - p.x);
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
      etiketleriYerlestir(etiketler, engeller);
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

    function etiketleriYerlestir(ls, engeller) {
      const kutular = [];
      /* Ay, gezegen ve Güneş işaretleri de engel sayılır */
      engeller.forEach(e => kutular.push({ x: e.x - e.r, y: e.y - e.r, w: 2 * e.r, h: 2 * e.r }));
      const { cx, cy, R } = olcu;
      const icerde = k => [[k.x, k.y], [k.x + k.w, k.y], [k.x, k.y + k.h], [k.x + k.w, k.y + k.h]].every(([x, y]) => Math.hypot(x - cx, y - cy) <= R - 2);
      const cakisir = k => !icerde(k) || kutular.some(b => k.x < b.x + b.w && k.x + k.w > b.x && k.y < b.y + b.h && k.y + k.h > b.y);
      ctx.textBaseline = 'middle';
      ls.sort((a, b) => b.oncelik - a.oncelik).forEach(e => {
        ctx.font = e.font;
        const w = ctx.measureText(e.metin).width, h = parseFloat(e.font.match(/(\d+(?:\.\d+)?)px/)[1]) * 1.1;
        const adaylar = e.merkez
          ? [[e.x - w / 2, e.y - h / 2]]
          : [[e.x + e.ofset, e.y - h / 2], [e.x - e.ofset - w, e.y - h / 2], [e.x - w / 2, e.y - e.ofset - h], [e.x - w / 2, e.y + e.ofset]];
        for (const [x, y] of adaylar) {
          const k = { x: x - 1, y, w: w + 2, h };
          if (!cakisir(k)) {
            kutular.push(k);
            ctx.fillStyle = e.renk; ctx.textAlign = 'left';
            ctx.fillText(e.metin, x, y + h / 2);
            return;
          }
        }
      });
    }

    function tikla(ev) {
      const b = canvas.getBoundingClientRect();
      const x = ev.clientX - b.left, y = ev.clientY - b.top;
      let enIyi = null;
      isabet.forEach(h => {
        const dd = Math.hypot(h.x - x, h.y - y);
        if (dd > 22) return;
        const puan = dd - h.oncelik * 4;
        if (!enIyi || puan < enIyi.puan) enIyi = { puan, h };
      });
      tiklaninca(enIyi ? enIyi.h.bilgi : null);
    }
    canvas.addEventListener('click', tikla);
    let zamanlayici = null;
    window.addEventListener('resize', () => {
      clearTimeout(zamanlayici);
      zamanlayici = setTimeout(() => { if (sonDurum && canvas.offsetParent) ciz(sonDurum); }, 120);
    });
    document.addEventListener('urania:tema', () => { if (sonDurum) ciz(sonDurum); });

    return { ciz };
  }

  window.Harita = { olustur };
})();
