/* plan.js — "Bu gecenin planı": gecenin cisimlerini en iyi görülecekleri saate göre sıralar.
   Ölçütler: yükseklik (alçakta hava kalınlaşır), bulut tahmini (o saatin bulut oranı),
   Ay (ışığı sönük bulutsu ve galaksileri bastırır) ve saati belli olaylar (uydu geçişi,
   Algol'ün en sönük anı, Ay örtmesi, meteor radyantının en yüksek anı).
   Puanlar sıralama içindir, birer ölçüm değildir. DOM'a dokunmaz. */
(function (kok) {
  'use strict';
  const Gok = (typeof module !== 'undefined' && module.exports) ? require('./gok.js') : kok.Gok;
  const DER = Math.PI / 180;
  const ADIM = 10 * 60e3, ARALIK = 12 * 60e3;

  const GEZEGEN_TABAN = { Jupiter: 10, Venus: 9, Saturn: 9, Mars: 8, Mercury: 7, Uranus: 3 };
  const HEDEF_TABAN = { acik_kume: 7, yildiz_kumesi_asterizm: 6, kuresel_kume: 6, cift_yildiz: 6, bulutsu: 5, galaksi: 4 };

  function bulutBul(hava, t) {
    if (!hava || !hava.length) return null;
    let en = null;
    hava.forEach(s => { const d = Math.abs(s.t - t); if (d <= 45 * 60e3 && (!en || d < en.d)) en = { d, b: s.bulut }; });
    return en ? en.b : null;
  }
  function acikCarpan(b) { return b == null ? 1 : 1 - 0.85 * b / 100; }
  function irtifaCarpan(alt, min) { return alt < min ? 0 : Math.sin(alt * DER); }

  /* g: { gzl, gece, hedefDurum, gezegenGece, ay, limitKadir, hava, uyduGecisleri, algol, ortmeler, meteorDurum } */
  function olustur(g) {
    const gece = g.gece;
    const S = gece.sivilSon || gece.batis, E = gece.sivilBas || gece.dogus;
    if (!S || !E || E <= S) {
      /* Batış yoksa: öğlen Güneş ufkun üstündeyse kutup günü, altındaysa kutup gecesi */
      const neden = gece.batis ? 'karanlik-yok' : (Gok.cisimAltAz('Sun', gece.ogle, g.gzl).alt > 0 ? 'gunes-batmiyor' : 'gunes-dogmuyor');
      return { maddeler: [], neden };
    }
    const KB = gece.karanlikBas || S, KS = gece.karanlikSon || E;
    const ornek = [];
    for (let ms = Math.ceil(S.getTime() / ADIM) * ADIM; ms <= E.getTime(); ms += ADIM) {
      const t = new Date(ms);
      const ay = Gok.cisimAltAz('Moon', t, g.gzl);
      ornek.push({ t, m: Gok.ufukMatrisi(t, g.gzl), bulut: bulutBul(g.hava, t), ayAlt: ay.alt, karanlik: t >= KB && t <= KS });
    }
    if (!ornek.length) return { maddeler: [], neden: 'karanlik-yok' };

    /* ---- Esnek adaylar: puan(t) ---- */
    const adaylar = [];
    (g.gezegenGece || []).forEach(p => {
      const taban = GEZEGEN_TABAN[p.cisim];
      if (!taban || !p.gorunur) return;
      const min = p.cisim === 'Mercury' ? 8 : 12;
      const puan = ornek.map(o => { const k = Gok.cisimAltAz(p.cisim, o.t, g.gzl); return { alt: k.alt, az: k.az, p: taban * irtifaCarpan(k.alt, min) * acikCarpan(o.bulut) }; });
      adaylar.push({ tur: 'gezegen', cisim: p.cisim, ad: p.ad, anahtar: 'cisim:' + p.cisim, kadir: p.kadir, puan });
    });
    const ay = g.ay;
    if (ay) {
      const taban = ay.oran > 0.08 && ay.oran < 0.92 ? 6 : 3;
      const puan = ornek.map(o => { const k = Gok.cisimAltAz('Moon', o.t, g.gzl); return { alt: k.alt, az: k.az, p: ay.oran < 0.03 ? 0 : taban * irtifaCarpan(k.alt, 10) * acikCarpan(o.bulut) }; });
      adaylar.push({ tur: 'ay', ad: 'Ay', anahtar: 'cisim:Moon', puan });
    }
    (g.hedefDurum || []).filter(h => h.gorunur).forEach(h => {
      let taban = HEDEF_TABAN[h.tur] || 4;
      const sonuk = h.tur === 'galaksi' || h.tur === 'bulutsu';
      if (h.kadir > 6) taban -= 2;
      if (sonuk && h.kadir > 5 && g.limitKadir <= 3.5) taban *= 0.5;   // şehir ışığında yaygın ve sönük
      const v = Gok.birimVektor(h.ra, h.dec);
      const puan = ornek.map(o => {
        if (!o.karanlik) return { alt: 0, az: 0, p: 0 };
        const k = Gok.ufkaCevir(o.m, v);
        let c = taban * irtifaCarpan(k.alt, 25) * acikCarpan(o.bulut);
        if (o.ayAlt > 0 && ay && ay.oran > 0.4 && h.ayAcisi < 40) c *= sonuk ? 0.4 : 0.8;
        else if (o.ayAlt > 0 && ay && ay.oran > 0.6 && sonuk) c *= 0.6;
        return { alt: k.alt, az: k.az, p: c };
      });
      adaylar.push({ tur: 'hedef', hedef: h, ad: h.ad, anahtar: 'hedef:' + h.id, puan });
    });
    adaylar.forEach(a => {
      let en = -1;
      a.puan.forEach((x, i) => { if (en < 0 || x.p > a.puan[en].p) en = i; });
      a.enIyi = en; a.enPuan = a.puan[en].p;
    });

    /* Seçim: gezegenler ve Ay hep; hedeflerden en iyi beşi */
    const secilen = adaylar.filter(a => a.enPuan > 0.4 && a.tur !== 'hedef')
      .concat(adaylar.filter(a => a.tur === 'hedef' && a.enPuan > 0.8).sort((x, y) => y.enPuan - x.enPuan).slice(0, 5));

    /* ---- Saati belli olaylar ---- */
    const maddeler = [];
    const icinde = t => t >= S && t <= E;
    (g.uyduGecisleri || []).forEach(x => {
      if (!icinde(x.gBas.t)) return;
      maddeler.push({ tur: 'uydu', sabit: true, zaman: x.gBas.t, son: x.gBit.t, ad: x.uydu.kisa + ' geçişi', gecis: x, alt: x.gTepe.alt, az: x.gTepe.az, bulut: bulutBul(g.hava, x.gBas.t) });
    });
    (g.algol || []).forEach(m => {
      if (m.gorunur && icinde(m.zaman)) maddeler.push({ tur: 'algol', sabit: true, zaman: m.zaman, ad: 'Algol en sönük', anahtar: 'yildiz:Algol', alt: m.alt, az: m.az, bulut: bulutBul(g.hava, m.zaman) });
    });
    (g.ortmeler || []).forEach(o => {
      ['giris', 'cikis'].forEach(k => {
        const b = o[k + 'Bilgi'];
        if (o[k] && b && b.gorunur && b.iyi !== false && icinde(o[k])) maddeler.push({ tur: 'ortme', sabit: true, zaman: o[k], ad: o.ad + (k === 'giris' ? ': Ay\'ın arkasına giriyor' : ': Ay\'ın arkasından çıkıyor'), ortme: o, kenar: b, alt: b.alt, az: b.az, bulut: bulutBul(g.hava, o[k]) });
      });
    });
    (g.meteorDurum || []).filter(m => m.aktif && m.radyantTepe && m.radyantTepe.alt >= 25 && Math.abs(m.gunFark) <= 3)
      .slice(0, 1).forEach(m => {
        const t = m.radyantTepe.zaman;
        if (icinde(t)) maddeler.push({ tur: 'meteor', sabit: true, zaman: t, ad: m.ad + ' meteorları', meteor: m, alt: m.radyantTepe.alt, az: m.radyantTepe.az, anahtar: 'meteor:' + m.kod, bulut: bulutBul(g.hava, t) });
      });

    /* ---- Esnek olanlara saat ver: en iyi puanın ≥%75'i olan saatlerden, doluya 12 dk'dan yakın olmayan ---- */
    secilen.sort((x, y) => y.enPuan - x.enPuan).forEach(a => {
      const esik = a.enPuan * 0.75;
      const sira = a.puan.map((x, i) => i).filter(i => a.puan[i].p >= esik)
        .sort((i, j) => Math.abs(i - a.enIyi) - Math.abs(j - a.enIyi));
      const bos = sira.find(i => !maddeler.some(m => Math.abs(m.zaman - ornek[i].t) < ARALIK));
      const i = bos != null ? bos : a.enIyi;
      const x = a.puan[i];
      maddeler.push({ tur: a.tur, sabit: false, zaman: ornek[i].t, ad: a.ad, anahtar: a.anahtar, cisim: a.cisim, hedef: a.hedef, kadir: a.kadir,
        alt: x.alt, az: x.az, bulut: ornek[i].bulut, puan: x.p });
    });
    maddeler.sort((a, b) => a.zaman - b.zaman);

    /* Bulut özeti: tahmin varsa gecenin en açık kesintisiz dönemi */
    const bulutlar = ornek.filter(o => o.bulut != null);
    let bulutNot = null;
    if (bulutlar.length) {
      const ort = bulutlar.reduce((s, o) => s + o.bulut, 0) / bulutlar.length;
      bulutNot = { ort, kapali: ort >= 75 };
    }
    return { maddeler, bulutNot, bas: S, son: E };
  }

  const Plan = { olustur, bulutBul };
  if (typeof module !== 'undefined' && module.exports) module.exports = Plan;
  else kok.Plan = Plan;
})(typeof self !== 'undefined' ? self : this);
