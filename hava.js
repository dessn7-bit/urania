/* hava.js — gecenin bulut tahmini (Open-Meteo, CC BY 4.0; ticari olmayan kullanım için
   anahtar gerekmez). Yanıt cihazda 1 saat taze sayılır; ağ yoksa 48 saate kadar eski
   kayıt "son güncelleme" notuyla gösterilir. */
(function () {
  'use strict';
  const U = window.Urania;
  const TAZE = 3600e3, EN_ESKI = 48 * 3600e3;
  const DEGISKEN = 'cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,relative_humidity_2m,wind_speed_10m';

  function anahtar(enlem, boylam) { return 'hava_' + enlem.toFixed(2) + '_' + boylam.toFixed(2); }

  function coz(j) {
    const h = j.hourly;
    return h.time.map((t, i) => ({
      t: new Date(t * 1000),
      bulut: h.cloud_cover[i], alcak: h.cloud_cover_low[i], orta: h.cloud_cover_mid[i], yuksek: h.cloud_cover_high[i],
      nem: h.relative_humidity_2m[i], ruzgar: h.wind_speed_10m[i]
    }));
  }

  /* Döndürür: { saatler, alindi: Date, eski: bool } ya da hata fırlatır */
  async function getir(enlem, boylam) {
    const k = anahtar(enlem, boylam);
    const kayit = U.oku(k, null);
    if (kayit && Date.now() - kayit.alindi < TAZE) return { saatler: coz(kayit.j), alindi: new Date(kayit.alindi), eski: false };
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + enlem.toFixed(3) + '&longitude=' + boylam.toFixed(3) +
      '&hourly=' + DEGISKEN + '&timezone=GMT&timeformat=unixtime&forecast_days=3';
    try {
      const ctl = new AbortController();
      const zs = setTimeout(() => ctl.abort(), 8000);
      const r = await fetch(url, { signal: ctl.signal });
      clearTimeout(zs);
      const j = await r.json();
      if (!r.ok || j.error) throw new Error(j.reason || ('HTTP ' + r.status));
      U.yaz(k, { alindi: Date.now(), j });
      return { saatler: coz(j), alindi: new Date(), eski: false };
    } catch (e) {
      if (kayit && Date.now() - kayit.alindi < EN_ESKI) return { saatler: coz(kayit.j), alindi: new Date(kayit.alindi), eski: true };
      throw e;
    }
  }

  /* Bir aralıktaki saatlik değerler + en uzun açık (bulut ≤ esik) dönem */
  function geceOzeti(saatler, bas, son, esik) {
    const ls = saatler.filter(s => s.t >= new Date(bas.getTime() - 30 * 60e3) && s.t <= new Date(son.getTime() + 30 * 60e3));
    if (!ls.length) return null;
    let enIyi = null, cur = null;
    ls.forEach(s => {
      if (s.bulut <= esik) {
        if (!cur) cur = { bas: s.t, son: s.t, n: 0 };
        cur.son = s.t; cur.n++;
        if (!enIyi || cur.n > enIyi.n) enIyi = Object.assign({}, cur);
      } else cur = null;
    });
    const ort = ls.reduce((a, s) => a + s.bulut, 0) / ls.length;
    return { ls, acik: enIyi, ort };
  }

  window.Hava = { getir, geceOzeti };
})();
