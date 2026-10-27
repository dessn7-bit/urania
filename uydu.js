/* uydu.js — Uluslararası Uzay İstasyonu (ISS) geçişleri.
   Yörünge öğeleri (TLE) CelesTrak'tan; yörünge SGP4 ile (satellite.js, MIT) cihazda hesaplanır.
   Görünür geçiş: istasyon ufkun ≥10° üstünde, Güneş ışığı alıyor ve gözlemcide Güneş −6°'nin
   altında (gökyüzü yeterince karanlık). Gölge, silindir modeliyle hesaplanır. */
(function () {
  'use strict';
  const U = window.Urania, G = window.Gok;
  const DER = Math.PI / 180;
  const TLE_URL = 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE';
  const TLE_TAZE = 12 * 3600e3;          // CelesTrak'ı gereksiz yormamak için
  const TLE_EN_ESKI = 14 * 86400e3;      // bundan eski öğelerle tahmin güvenilmez
  const YER_R = 6378.137;                // km, WGS-84 ekvator yarıçapı
  const AB_KM = 149597870.7;

  async function tleGetir() {
    const kayit = U.oku('tle_iss', null);
    if (kayit && Date.now() - kayit.alindi < TLE_TAZE) return kayit;
    try {
      const ctl = new AbortController();
      const zs = setTimeout(() => ctl.abort(), 8000);
      const r = await fetch(TLE_URL, { signal: ctl.signal });
      clearTimeout(zs);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const satir = (await r.text()).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      const s1 = satir.find(s => s.startsWith('1 25544')), s2 = satir.find(s => s.startsWith('2 25544'));
      if (!s1 || !s2) throw new Error('TLE çözülemedi');
      const yeni = { alindi: Date.now(), s1, s2 };
      U.yaz('tle_iss', yeni);
      return yeni;
    } catch (e) {
      if (kayit && Date.now() - kayit.alindi < TLE_EN_ESKI) return Object.assign({ eski: true }, kayit);
      throw e;
    }
  }

  /* TLE'nin kendi dönemi (epoch): ilk satır, 19–32. karakterler, YYDDD.DDDDDDDD */
  function tleDonemi(s1) {
    const yy = Number(s1.slice(18, 20)), gun = Number(s1.slice(20, 32));
    const yil = yy < 57 ? 2000 + yy : 1900 + yy;
    return new Date(Date.UTC(yil, 0, 1) + (gun - 1) * 86400e3);
  }

  function durumHesapla(sat, gd, t) {
    const pv = satellite.propagate(sat, t);
    if (!pv || !pv.position) return null;
    const gmst = satellite.gstime(t);
    const la = satellite.ecfToLookAngles(gd, satellite.eciToEcf(pv.position, gmst));
    /* Güneş ışığı: Güneş yönüne izdüşüm ve gölge silindirine uzaklık */
    const g = G.A.GeoVector('Sun', t, true);
    const gl = Math.hypot(g.x, g.y, g.z);
    const s = [g.x / gl, g.y / gl, g.z / gl];
    const r = pv.position;
    const izd = r.x * s[0] + r.y * s[1] + r.z * s[2];
    const dik = Math.hypot(r.x - izd * s[0], r.y - izd * s[1], r.z - izd * s[2]);
    const isikli = izd > 0 || dik > YER_R;
    return { t, alt: la.elevation / DER, az: la.azimuth / DER, isikli, uzaklik: la.rangeSat };
  }

  /* Gelecek `gun` gün içindeki geçişler (ufkun 10° üstü) */
  function gecisler(tle, konum, bas, gun) {
    const sat = satellite.twoline2satrec(tle.s1, tle.s2);
    const gd = { latitude: konum.enlem * DER, longitude: konum.boylam * DER, height: (konum.yukseklik || 0) / 1000 };
    const gzl = G.gozlemci(konum.enlem, konum.boylam, konum.yukseklik || 0);
    const ESIK = 10, ADIM = 20e3;
    const son = bas.getTime() + gun * 86400e3;
    const ls = [];
    let gecis = null;
    for (let ms = bas.getTime(); ms <= son; ms += ADIM) {
      const d = durumHesapla(sat, gd, new Date(ms));
      if (!d) continue;
      if (d.alt >= ESIK) {
        if (!gecis) gecis = { noktalar: [] };
        gecis.noktalar.push(d);
      } else if (gecis) {
        ls.push(gecis); gecis = null;
      }
    }
    if (gecis) ls.push(gecis);
    /* Her geçiş: 1 sn çözünürlükle başlangıç, tepe, bitiş; görünür bölüm */
    return ls.map(g => {
      const n = g.noktalar;
      const ince = (a, b) => { const out = []; for (let ms = a; ms <= b; ms += 1000) { const d = durumHesapla(sat, gd, new Date(ms)); if (d) out.push(d); } return out; };
      const tumu = ince(n[0].t.getTime() - ADIM, n[n.length - 1].t.getTime() + ADIM).filter(d => d.alt >= ESIK);
      if (!tumu.length) return null;
      const tepe = tumu.reduce((a, d) => d.alt > a.alt ? d : a);
      /* Alacakaranlık tanımı geometrik yüksekliğe göredir (kırılma eklenmez) */
      const karanlik = d => { const e = G.A.Equator('Sun', d.t, gzl, true, true); return G.A.Horizon(d.t, gzl, e.ra, e.dec).altitude < -6; };
      const gercekGorunen = tumu.filter(d => d.isikli && karanlik(d));
      return {
        bas: tumu[0], tepe, bitis: tumu[tumu.length - 1],
        gorunur: gercekGorunen.length > 0,
        gBas: gercekGorunen[0] || null, gBit: gercekGorunen[gercekGorunen.length - 1] || null,
        gTepe: gercekGorunen.length ? gercekGorunen.reduce((a, d) => d.alt > a.alt ? d : a) : null
      };
    }).filter(Boolean);
  }

  /* Şu anki konum ve (60 dk içinde başlayan ya da süren) geçişin yolu */
  const satrecOnbellek = {};
  function satrec(tle) { return satrecOnbellek[tle.s1] || (satrecOnbellek[tle.s1] = satellite.twoline2satrec(tle.s1, tle.s2)); }
  function anlik(tle, konum, t) {
    const gd = { latitude: konum.enlem * DER, longitude: konum.boylam * DER, height: (konum.yukseklik || 0) / 1000 };
    return durumHesapla(satrec(tle), gd, t);
  }
  function yakinGecis(tle, konum, simdi) {
    const ls = gecisler(tle, konum, new Date(simdi.getTime() - 15 * 60e3), 75 / 1440);
    const g = ls.find(x => x.bitis.t > simdi && x.bas.t < new Date(simdi.getTime() + 60 * 60e3));
    if (!g) return null;
    const gd = { latitude: konum.enlem * DER, longitude: konum.boylam * DER, height: (konum.yukseklik || 0) / 1000 };
    const yol = [];
    /* 10 sn'lik adımlar tam dakikaya hizalı: dakika işaretleri yolda doğru yere düşsün */
    for (let ms = Math.floor((g.bas.t.getTime() - 60e3) / 10e3) * 10e3; ms <= g.bitis.t.getTime() + 60e3; ms += 10e3) {
      const d = durumHesapla(satrec(tle), gd, new Date(ms)); if (d) yol.push(d);
    }
    return Object.assign({ yol }, g);
  }
  window.Uydu = { tleGetir, tleDonemi, gecisler, durumHesapla, anlik, yakinGecis };
})();
