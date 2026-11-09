/* gorunurluk.js — "Bu gece, buradan, 7×50 dürbünle görünür mü?" hesabı (YAKLAŞIK).
   Dört parça, hepsi kaynaklı:
   1) Gök parlaklığı: Falchi ve ark. 2016 atlasının Türkiye penceresi (veri/gok_parlakligi.u8.gz, araclar/gok_parlakligi.py)
      + doğal gök 174 µcd/m² = 22,0 kadir/yay sn² (makale). Birim dönüşümü Unihedron (SQM): cd/m² = 10,8×10⁴ × 10^(−0,4 m).
   2) Ay ışığı: Krisciunas & Schaefer 1991, PASP 103, 1033 ("KS91"); denklem numaraları yorumlarda. Model Mauna Kea
      verisine uydurulmuştur (%8–23 doğruluk, makale); şehir göğünde yaklaşıktır.
   3) Sönümleme k = Rayleigh + ozon + aerosol: Rayleigh Hayes & Latham 1975, ApJ 197, 593 ("HL75") denk. (1), 550 nm;
      ozon 0,016 kadir/hava kütlesi (Schaefer 1992; Green 1992, ICQ 14, 55 aktarımı — 510 nm için verilmiştir, V bandı
      değeri bulunamadı, yaklaşık); aerosol 1,086 × AOD (v44 şeffaflık kartı, Beer–Lambert). AOD yoksa toplam k = 0,30
      (Schaefer 1990, PASP 102, 212: "more typical weather has a kv value of 0.30").
   4) Görme eşiği: Crumey 2014, MNRAS 442, 2600 (arXiv 1405.4209) — skotopik eşik modeli denk. (47)–(49), (44), nokta
      kaynak (53), yaygın cisim (56)–(63), aletli gözlem (65)–(72) ve (77)–(88). Dürbün 7×50: D = 50 mm, M = 7, çıkış göz
      bebeği 7,14 mm, geçirgenlik %75 (F_t = 1,33, makalenin değeri). İki gözle bakıldığı için tek göz kaybı (√2,
      Crumey §1.6.4 / Lythgoe & Phillips 1938; Schaefer 1990 F_b = 1,41) uygulanmaz: F_T = 1. Göz bebeği çapı Schaefer 1990
      denk. (5): D_e = 7 mm × exp(−0,5 (yaş/100)²); varsayılan 40 yaş → 6,5 mm (yaş sorulmaz, ayardan değiştirilir).
      Alan katsayısı F: Crumey'nin "notional" değeri 2 (çıplak gözle 21,83 kadir/yay sn² gökte 6,18 kadir sınır).
   DOM'a dokunmaz; Node'da da yüklenir (testler). Astronomi hesabı (Ay konumu, yükseklik) çağırandan gelir. */
(function (kok) {
  'use strict';
  const DER = Math.PI / 180;
  const YAYDK2_SR = Math.pow(Math.PI / (180 * 60), 2);          // 1 yay dakikası² = 8,4616×10⁻⁸ steradyan

  /* ---- 1) Birimler ve gök parlaklığı ---- */
  const SIFIR_CD = 108000;                                        // Unihedron: [cd/m²] = 108000 × 10^(−0,4 × [kadir/yay sn²])
  const DOGAL_MCD = 0.174;                                        // Falchi 2016: 22,0 kadir/yay sn² ↔ 174 µcd/m²
  function kadirdenCd(m) { return SIFIR_CD * Math.pow(10, -0.4 * m); }
  function cddenKadir(L) { return Math.log10(L / SIFIR_CD) / -0.4; }
  /* Yapay (mcd/m²) + doğal → toplam başucu parlaklığı, kadir/yay sn² */
  function toplamKadir(Lart) { return cddenKadir((Math.max(0, Lart) + DOGAL_MCD) / 1000); }

  let izgara = null;    // { meta, kod: Uint8Array }
  function izgaraKur(meta, kod) {
    if (!meta || !kod || kod.length !== meta.satir * meta.sutun) throw new Error('gök parlaklığı ızgarası bozuk');
    izgara = { meta, kod };
    return izgara;
  }
  /* veri/gok_parlakligi.json kodlaması: kod 0 = veri yok; kod c = 1…254 → L_art = L_doğal × (10^(0,4 × adım × (c − 1)) − 1) */
  function kodCoz(c, meta) {
    if (!c) return null;
    const k = meta.kodlama;
    return k.L_dogal_mcd * (Math.pow(10, 0.4 * k.adim_kadir * (c - 1)) - 1);
  }
  function gokParlakligi(enlem, boylam) {
    if (!izgara) return null;
    const m = izgara.meta, s = m.sinirlar;
    if (!(enlem > s.guney && enlem < s.kuzey && boylam > s.bati && boylam < s.dogu)) return null;
    const r = Math.min(m.satir - 1, Math.floor((s.kuzey - enlem) / m.adim_derece));
    const c = Math.min(m.sutun - 1, Math.floor((boylam - s.bati) / m.adim_derece));
    const kod = izgara.kod[r * m.sutun + c];
    const Lart = kodCoz(kod, m);
    if (Lart == null) return null;
    return { Lart, kadir: toplamKadir(Lart), kod, hucre: [r, c] };
  }
  async function izgaraYukle(fetchFn) {
    const f = fetchFn || (typeof fetch === 'function' ? fetch.bind(kok) : null);
    if (!f) throw new Error('fetch yok');
    const [meta, r] = await Promise.all([f('./veri/gok_parlakligi.json').then(x => { if (!x.ok) throw new Error('gok_parlakligi.json ' + x.status); return x.json(); }), f('./veri/gok_parlakligi.u8.gz')]);
    if (!r.ok) throw new Error('gok_parlakligi.u8.gz ' + r.status);
    let buf = new Uint8Array(await r.arrayBuffer());
    if (buf.length > 1 && buf[0] === 0x1f && buf[1] === 0x8b) {          // gzip sihirli sayısı; sunucu kendisi açmışsa ham gelir
      if (typeof DecompressionStream === 'undefined') throw new Error('bu tarayıcı gzip açamıyor');
      const acik = new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip')));
      buf = new Uint8Array(await acik.arrayBuffer());
    }
    return izgaraKur(meta, buf);
  }

  /* ---- 3) Sönümleme (kadir / hava kütlesi) ---- */
  /* HL75 denk. (1): A_Ray(λ, h) = 9,4977×10⁻³ (1/λ)⁴ [(n−1)_λ/(n−1)_{λ=1}]² exp(−h/7,996); λ = 0,55 µm, h km;
     (n−1)_λ/(n−1)_{λ=1} = 0,23465 + 1,076×10²/(146 − (1/λ)²) + 0,93161/(41 − (1/λ)²). Deniz düzeyinde 0,1066. */
  function rayleigh(lambdaUm, yukseklikM) {
    const il2 = 1 / (lambdaUm * lambdaUm);
    const n = 0.23465 + 1.076e2 / (146 - il2) + 0.93161 / (41 - il2);
    return 9.4977e-3 * il2 * il2 * n * n * Math.exp(-(yukseklikM || 0) / 1000 / 7.996);
  }
  const OZON = 0.016;                                             // Schaefer 1992 (Green 1992 aktarımı); V bandı için yaklaşık
  const K_VARSAYILAN = 0.30;                                      // Schaefer 1990: tipik hava
  function sonumleme(o) {
    const h = o && Number.isFinite(o.yukseklik) ? o.yukseklik : 0;
    const ray = rayleigh(0.55, h);
    if (o && Number.isFinite(o.aod) && o.aod >= 0) {
      const aer = 1.086 * o.aod;                                  // v44: Δm = 2,5 log10(e) × τ ≈ 1,086 × AOD
      return { k: ray + OZON + aer, parcalar: { rayleigh: ray, ozon: OZON, aerosol: aer }, kaynak: 'hesap' };
    }
    return { k: K_VARSAYILAN, parcalar: { rayleigh: ray, ozon: OZON, aerosol: K_VARSAYILAN - ray - OZON }, kaynak: 'varsayilan' };
  }

  /* ---- 2) Ay ışığı (KS91) — parlaklıklar nanoLambert (nL), V kadir/yay sn² ---- */
  function nL(V) { return 34.08 * Math.exp(20.7233 - 0.92104 * V); }                      // KS91 (1)
  function nLKadir(B) { return (20.7233 - Math.log(B / 34.08)) / 0.92104; }               // KS91 (1) tersi
  function X(Z) { return Math.pow(1 - 0.96 * Math.pow(Math.sin(Z * DER), 2), -0.5); }    // KS91 (3): saçılma hava kütlesi
  function Xs(Z) { const c = Math.cos(Z * DER); return 1 / (c + 0.025 * Math.exp(-11 * c)); } // KS91 (14): doğrudan görülen cisim için (sönümleme)
  function B0(Bzen, Z, k) { const x = X(Z); return Bzen * Math.pow(10, -0.4 * k * (x - 1)) * x; }   // KS91 (2)
  function Iyildiz(alfa) { const a = Math.abs(alfa); return Math.pow(10, -0.4 * (3.84 + 0.026 * a + 4e-9 * Math.pow(a, 4))); } // KS91 (20)
  function fSacilma(rho) {                                                                 // KS91 (21); ρ < 10° için Mie terimi (19)
    const fR = Math.pow(10, 5.36) * (1.06 + Math.pow(Math.cos(rho * DER), 2));           // (17); (21) C_R = 10^5,36 = 2,29×10⁵ (makalenin ölçtüğü C_R 2,27×10⁵)
    const fM = rho >= 10 ? Math.pow(10, 6.15 - rho / 40) : 6.2e7 / (rho * rho);          // (18) / (19)
    return fR + fM;
  }
  /* KS91 (15): B_moon = f(ρ) I* 10^(−0,4 k X(Z_m)) [1 − 10^(−0,4 k X(Z))]; Ay ufkun altındaysa 0 */
  function Bmoon(alfa, rho, Zm, Z, k) {
    if (!(Zm < 90) || !(Z < 90)) return 0;
    /* ρ alt kesimi 0,5°: uygulama seçimi (makalede yok) — (19) ρ → 0'da ıraksar; Ay diskinin yarıçapı ≈ 0,25° */
    return fSacilma(Math.max(rho, 0.5)) * Iyildiz(alfa) * Math.pow(10, -0.4 * k * X(Zm)) * (1 - Math.pow(10, -0.4 * k * X(Z)));
  }
  function deltaV(Bm, B0z) { return -2.5 * Math.log10((Bm + B0z) / B0z); }               // KS91 (22)
  /* Hedef yönündeki gök yüzeyi: başucu V (Ay'sız) → Z'deki doğal+yapay gök (2) + Ay (15) */
  function gokYuzey(o) {
    const Z = Math.min(89.9, Math.max(0, o.Z)), k = o.k;
    const b0 = B0(nL(o.Vzen), Z, k);
    let bm = 0;
    if (o.ay && Number.isFinite(o.ay.Zm) && o.ay.Zm < 90) bm = Bmoon(o.ay.alfa, o.ay.rho, o.ay.Zm, Z, k);
    const toplam = b0 + bm;
    return { B0: b0, Bmoon: bm, V: nLKadir(toplam), Vayisiz: nLKadir(b0), deltaV: bm > 0 ? deltaV(bm, b0) : 0 };
  }
  /* İki ufuk konumu arasındaki açı (derece) */
  function acisalUzaklik(alt1, az1, alt2, az2) {
    const s = Math.sin(alt1 * DER) * Math.sin(alt2 * DER) + Math.cos(alt1 * DER) * Math.cos(alt2 * DER) * Math.cos((az1 - az2) * DER);
    return Math.acos(Math.max(-1, Math.min(1, s))) / DER;
  }

  /* ---- 4) Görme eşiği (Crumey 2014) ---- */
  const R1 = 6.505e-4, R2 = -8.461e-4, K1 = 7.633e-3, K2 = -7.174e-3;   // Crumey (48)(49): 10⁻⁵ ≤ B ≤ 3,426×10⁻² cd/m²
  const Q = 0.6;                                                        // Crumey (44): B < 0,193 cd/m²
  const Z0 = 2.54e-6;                                                   // Crumey: 0 kadirlik yıldızın aydınlatması, lux
  const B_KESIM = 1e-5;                                                 // Crumey (70)(71): göz merceğinde sıfır arka plan kesimi
  const B_UST = 3.426e-2;                                               // model sınırı (≈ 16,2 kadir/yay sn², Unihedron dönüşümü); üstü mezopik
  const DURBUN = { ad: '7×50 dürbün', D: 0.050, M: 7, Ft: 1.33, FT: 1, FM: 1 };   // Crumey §3.2 değerleri; F_T = 1 iki göz
  const CIPLAK = { ad: 'çıplak göz', D: null, M: 1, Ft: 1, FT: 1, FM: 1 };
  const F_VARSAYILAN = 2;                                              // Crumey: "notional value F = 2"
  const YAS_VARSAYILAN = 40;                                           // uygulama seçimi: yaş sorulmaz, tipik yetişkin; ayardan göz bebeği girilebilir
  function gozBebegi(yas) { return 7 * Math.exp(-0.5 * Math.pow((yas == null ? YAS_VARSAYILAN : yas) / 100, 2)); }   // Schaefer 1990 (5), mm

  /* Eşikler: B hedef yönündeki gök (cd/m²), alet, göz bebeği p (mm), alan katsayısı F.
     Döner: m0 nokta sınırı (kadir, atmosfer dışı), muSonsuz çok büyük cisim sınırı (kadir/yay sn²), alphaTR teleskopik
     Ricco alanı (yay dk²), Ba göz merceğindeki gök (cd/m²). Gök modelin üstündeyse null. */
  function esikler(o) {
    const B = o.B;
    if (!(B > 0) || B > B_UST) return null;
    const alet = o.alet || DURBUN, F = o.F || F_VARSAYILAN, p = (o.p || gozBebegi()) / 1000;
    const phi = alet.FT * alet.FM * F;
    let Ba, kazanc, M = alet.M;
    if (M === 1) { Ba = B; kazanc = 1; }
    else {
      const d = alet.D / M, dMin = Math.min(d, p), dMax = Math.max(d, p);
      Ba = Math.pow(dMin / p, 2) * B / alet.Ft;                       // Crumey (66)
      kazanc = Math.pow(alet.D / dMax, 2) / alet.Ft;                  // Crumey (67): ΔI_a = (D/δ_max)² ΔI / F_t
    }
    const Bk = Math.max(Ba, B_KESIM);                                  // (70)(71): B_a < 10⁻⁵ → eşik sabit
    const Bq = Math.pow(Bk, 0.25);
    const Ra = Math.pow(R1 / Bq + R2, 2);                              // Crumey (78) (= (r1 B^¼ + r2 B^½)² / B)
    const Ca = K1 / Bq + K2;                                           // Crumey (80)
    const dI = phi * Bk * Ra / kazanc;                                 // Crumey (68) / çıplak göz (53): ΔI = F B R_a
    const m0 = -2.5 * Math.log10(dI / Z0);
    const muSky = cddenKadir(B);
    const muSonsuz = muSky - 2.5 * Math.log10(phi * Ca);              // Crumey (86)
    const alphaTR = Ra / (M * M * Ca) / YAYDK2_SR;                     // Crumey (81) → yay dk²
    return { m0, muSonsuz, alphaTR, Ba, muSky, F, p: p * 1000, alet };
  }
  /* Yaygın cisim: alanı α (yay dk²) olan hedef için sınır yüzey parlaklığı (Crumey (84), çıplak göz (60)) */
  function yayginSinir(e, alpha) { return e.muSonsuz - (2.5 / Q) * Math.log10(Math.pow(e.alphaTR / alpha, Q) + 1); }
  /* Aynı hedef için sınır toplam kadir (Crumey (88)) */
  function yayginKadirSinir(e, alpha) { return e.m0 - (2.5 / Q) * Math.log10(Math.pow(alpha / e.alphaTR, Q) + 1); }
  /* Çıplak göz nokta sınırından başucu gök parlaklığı (Crumey (53) tersi, sayısal) — atlas yoksa kaydırıcıdan.
     Arama aralığı 15–22,5 kadir/yay sn²: uygulama seçimi (kent merkezinden doğal göğün biraz üstüne) */
  function kadirdenGok(m0, F, p) {
    let lo = 15, hi = 22.5;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2, e = esikler({ B: kadirdenCd(mid), alet: CIPLAK, F, p });
      if (!e) { lo = mid; continue; }
      if (e.m0 < m0) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /* ---- Hedef değerlendirmesi ----
     h: { ad, kadir, buyukEksen, kucukEksen (yay dk), nokta: true|false }
     ortam: { Vzen (başucu, Ay'sız, kadir/yay sn²), Z (hedefin başucu uzaklığı), k, ay: {alfa, rho, Zm} | null, p, F, alet }
     Döner: { etiket: 'gorunur'|'zor'|'gorunmez'|'ufuk'|'belirsiz', fark (kadir; + görünür yönünde), gok, esik, hedef } */
  const BANT = 0.5;   // ±0,5 kadir, URANIA'NIN SEÇİMİ (kaynaklı değil): atlas (Falchi: havaışığı yarım kadirden fazla değişir), Ay modeli (%8–23) ve F aralığı (1,4–2,4) belirsizlikleri için
  function degerlendir(h, ortam) {
    if (!(ortam.Z < 90)) return { etiket: 'ufuk', neden: 'ufkun altında' };
    const gok = gokYuzey(ortam);
    const B = kadirdenCd(gok.V);
    const e = esikler({ B, alet: ortam.alet || DURBUN, p: ortam.p, F: ortam.F });
    if (!e) return { etiket: 'belirsiz', neden: 'gök modelin üstünde (alacakaranlık ya da çok parlak)', gok };
    const son = ortam.k * Xs(Math.min(89.9, ortam.Z));              // hedefin sönümlenmesi (KS91 (14) hava kütlesi)
    let fark, hedef;
    if (h.nokta || !(h.buyukEksen > 0)) {
      const m = h.kadir + son;
      fark = e.m0 - m;
      hedef = { tur: 'nokta', kadir: h.kadir, kadirGorunen: m, sinir: e.m0 };
    } else {
      const alpha = Math.PI / 4 * h.buyukEksen * (h.kucukEksen || h.buyukEksen);        // elips alanı, yay dk²
      const mu = h.kadir + 2.5 * Math.log10(alpha * 3600);                              // ortalama yüzey parlaklığı, kadir/yay sn²
      const sinir = yayginSinir(e, alpha);
      fark = sinir - (mu + son);
      hedef = { tur: 'yaygin', kadir: h.kadir, alpha, mu, muGorunen: mu + son, sinir, kadirSinir: yayginKadirSinir(e, alpha) };
    }
    const etiket = fark >= BANT ? 'gorunur' : (fark > -BANT ? 'zor' : 'gorunmez');
    return { etiket, fark, gok, esik: e, hedef, sonumleme: son, Z: ortam.Z };
  }
  const ETIKET_AD = { gorunur: 'görünür', zor: 'zor', gorunmez: 'görünmez', ufuk: 'ufkun altında', belirsiz: 'hesaplanamadı' };

  /* Kısa gerekçe satırları (ekranda "dokununca açılan"): gök parlaklığı, Ay katkısı, yükseklik, gereken eşik */
  function sayi(x, b) { return Number.isFinite(x) ? x.toFixed(b).replace('.', ',') : '—'; }
  function gerekce(s, ortam) {
    if (!s || !s.gok) return [];
    const ls = [];
    ls.push(`Gök parlaklığı: başucunda ${sayi(ortam.Vzen, 1)}, hedef yönünde ${sayi(s.gok.V, 1)} kadir/yay sn²` + (s.gok.deltaV < -0.05 ? ` (Ay ${sayi(-s.gok.deltaV, 1)} kadir parlatıyor)` : ' (Ay katkısı yok)') + '.');
    ls.push(`Yükseklik ${Math.round(90 - s.Z)}°; sönümleme ${sayi(s.sonumleme, 2)} kadir (k = ${sayi(ortam.k, 2)}).`);
    if (s.hedef && s.hedef.tur === 'nokta') ls.push(`${s.esik.alet.ad} ile görülebilen en sönük yıldız yaklaşık ${sayi(s.hedef.sinir, 1)} kadir; hedef ${sayi(s.hedef.kadirGorunen, 1)} kadir görünüyor.`);
    else if (s.hedef) ls.push(`Hedefin ortalama yüzey parlaklığı ${sayi(s.hedef.muGorunen, 1)} kadir/yay sn² (${Math.round(s.hedef.alpha)} yay dk², ${sayi(s.hedef.kadir, 1)} kadir); bu büyüklükte bir cisim için eşik ${sayi(s.hedef.sinir, 1)}.`);
    ls.push(`Sonuç: ${ETIKET_AD[s.etiket]} (fark ${s.fark > 0 ? '+' : ''}${sayi(s.fark, 1)} kadir; ±${sayi(BANT, 1)} "zor" bandı). Yaklaşık: atlas 2014–2015 uydu verisi, Ay modeli Mauna Kea'ya uydurulmuş.`);
    return ls;
  }

  const api = { kadirdenCd, cddenKadir, toplamKadir, DOGAL_MCD, izgaraKur, izgaraYukle, kodCoz, gokParlakligi,
    rayleigh, OZON, K_VARSAYILAN, sonumleme,
    nL, nLKadir, X, Xs, B0, Iyildiz, fSacilma, Bmoon, deltaV, gokYuzey, acisalUzaklik,
    esikler, yayginSinir, yayginKadirSinir, kadirdenGok, gozBebegi, DURBUN, CIPLAK, F_VARSAYILAN, YAS_VARSAYILAN, Q, BANT,
    degerlendir, gerekce, ETIKET_AD };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  kok.Gorunurluk = api;
})(typeof window !== 'undefined' ? window : globalThis);
