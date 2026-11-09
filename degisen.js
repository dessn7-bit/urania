/* degisen.js — Değişen yıldızların ÖLÇÜLEN parlaklığı: AAVSO VSX API'sinden son 7 günün görsel tahminlerinin
   ortancası ve tahmin sayısı. Yalnız https://vsx.aavso.org kullanılır (www.aavso.org bot doğrulaması gösterir;
   asla denenmez). Uç: index.php?view=api.object&ident=<ad>&format=json&data=<n>&fromjd=<jd> (CORS açık, anahtar yok;
   parametreler resmî belgede değil, davranış testler/veri/vsx fixture'larıyla sabitlendi).
   Gözlemci adı, kodu, ülkesi, yorumu HİÇBİR yerde tutulmaz: yanıttan yalnız özet çıkarılır (ortanca, görsel tahmin sayısı,
   son tahminin JD'si, toplam kayıt sayısı, yıldızın adı) ve önbelleğe yalnız bu özet yazılır (12 saat); ham gözlem kayıtları
   atılır. Kaynak satırı: AAVSO Data Usage Guidelines (2025-10-01) atıf metni + VSX atıfı. */
(function () {
  'use strict';
  const U = window.Urania;
  const KOK = 'https://vsx.aavso.org/index.php?view=api.object&format=json';
  const TAZE = 12 * 3600e3, GUN = 7, EN_COK = 500, ONEK = 'vsx1_';
  const bellek = {};
  let sonHata = 0;

  function jdSimdi() { return Date.now() / 86400e3 + 2440587.5; }
  function url(ident, gun) { return KOK + '&ident=' + encodeURIComponent(ident) + '&data=' + EN_COK + '&fromjd=' + (jdSimdi() - (gun || GUN)).toFixed(1); }

  /* VSX yanıtı → { ortanca, sayi, sonJd, tumSayi } (yalnız görsel tahminler: Band "Vis." ya da ObsType "Visual";
     "<" ile başlayan "daha sönük" sınır kayıtları ve uyumsuz (ValFlag T) kayıtlar sayılmaz) */
  function ozetle(j, simdiJd) {
    const o = j && (j.VSXObject || j);
    const ls = (o && o.Data && Array.isArray(o.Data.Observation)) ? o.Data.Observation : [];
    const esik = (simdiJd || jdSimdi()) - GUN;
    const gorsel = [];
    let sonJd = null;
    ls.forEach(g => {
      const jd = Number(g.JD); const m = String(g.Mag == null ? '' : g.Mag).trim();
      if (!(jd >= esik) || !m || m[0] === '<' || g.ValFlag === 'T') return;
      if (!(g.Band === 'Vis.' || g.ObsType === 'Visual')) return;
      const v = Number(m); if (!Number.isFinite(v)) return;
      gorsel.push(v); if (sonJd == null || jd > sonJd) sonJd = jd;
    });
    if (!gorsel.length) return { ortanca: null, sayi: 0, sonJd: null, tumSayi: ls.length, ad: o && o.Name ? String(o.Name) : null };
    gorsel.sort((a, b) => a - b);
    const n = gorsel.length, ortanca = n % 2 ? gorsel[(n - 1) / 2] : (gorsel[n / 2 - 1] + gorsel[n / 2]) / 2;
    return { ortanca: Math.round(ortanca * 10) / 10, sayi: n, sonJd, tumSayi: ls.length, ad: o && o.Name ? String(o.Name) : null };
  }

  function onbellekOku(ident) {
    const k = bellek[ident] || U.oku(ONEK + ident, null);
    return k && Number.isFinite(k.alindi) ? k : null;
  }
  /* Yalnız önbellek (ağa çıkmaz): özet varsa döner, 12 saatten eskiyse eski: true */
  function onbellek(ident) {
    const k = onbellekOku(ident);
    return k ? Object.assign({}, k.oz, { alindi: new Date(k.alindi), eski: Date.now() - k.alindi >= TAZE }) : null;
  }
  /* Ölçülen parlaklık; { ortanca, sayi, alindi: Date, eski: bool } ya da ağ yoksa ve önbellek de yoksa hata */
  async function parlaklik(ident, secenek) {
    const s = secenek || {};
    const k = onbellekOku(ident);
    if (k && Date.now() - k.alindi < TAZE && !s.zorla) return Object.assign({}, k.oz, { alindi: new Date(k.alindi), eski: false });
    if (sonHata && Date.now() - sonHata < 10 * 60e3 && !s.zorla) {
      if (k) return Object.assign({}, k.oz, { alindi: new Date(k.alindi), eski: true });
      throw new Error('AAVSO kısa süre önce yanıt vermedi; bekleniyor');
    }
    try {
      const ac = new AbortController(); const z = setTimeout(() => ac.abort(), 15000);
      const r = await fetch(url(ident), { signal: ac.signal, headers: { Accept: 'application/json' } });
      clearTimeout(z);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      const oz = ozetle(j);
      const kayit = { alindi: Date.now(), oz };          // yalnız özet saklanır; ham yanıt (gözlemci alanları) atılır
      bellek[ident] = kayit; U.yaz(ONEK + ident, kayit);
      if (window.Tani) Tani.servis('AAVSO VSX', 'tamam', ident);
      return Object.assign({}, oz, { alindi: new Date(kayit.alindi), eski: false });
    } catch (e) {
      sonHata = Date.now();
      if (window.Tani) Tani.servis('AAVSO VSX', 'hata', e.message);
      if (k) return Object.assign({}, k.oz, { alindi: new Date(k.alindi), eski: true });
      throw e;
    }
  }
  /* Birden çok yıldız: sırayla, aralıklı (AAVSO sunucusuna nazik); her sonuç geldikçe geri çağrı */
  async function toplu(identler, herBiri, araMs) {
    for (const id of identler) {
      let s = null, hata = null;
      try { s = await parlaklik(id); } catch (e) { hata = e; }
      if (herBiri) herBiri(id, s, hata);
      if (hata && !onbellekOku(id)) break;                 // ağ yok: gerisini deneme
      if (!(s && s.eski === false && Date.now() - s.alindi < 2000)) continue;   // önbellekten geldi: beklemeye gerek yok
      await new Promise(r => setTimeout(r, araMs == null ? 600 : araMs));
    }
  }
  const ATIF = 'AAVSO: We gratefully acknowledge the contributions of the AAVSO observer community, whose photometric data and metadata resources were used in this study and made available through the AAVSO\'s scientific archives (AAVSO Data Usage Guidelines, 2025-10-01). VSX: Watson, C. L., Henden, A. A., and Price, A., "The International Variable Star Index (VSX)", Society for Astronomical Sciences Annual Symposium, vol. 25, p. 47, 2006.';

  window.Degisen = { parlaklik, onbellek, toplu, ozetle, url, TAZE, GUN, ATIF, ONEK };
})();
