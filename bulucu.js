/* bulucu.js — dürbün hedefleri için bulma haritası (yıldızdan yıldıza atlama).
   Bir hedef için: çıplak gözle kolay bulunan parlak bir yıldızdan başlayıp hedefe giden kısa adımlar,
   7×50 dürbünün görüş alanı ve gözlemcinin o an gördüğü yönelim (haritanın üstü = başucu).
   İzdüşüm: stereografik (açı koruyan; küçük daireler daire kalır), merkez başlangıç yıldızı ile hedefin ortası.
   Hesap kısmı DOM'a dokunmaz: Node'da module.exports olur (testler buradan çağırır),
   tarayıcıda window.Bulucu = { ac(hedef, secenek) }. */
(function (kok) {
  'use strict';
  const NODE = typeof module !== 'undefined' && module.exports;
  const G = NODE ? require('./gok.js') : kok.Gok;
  const DER = Math.PI / 180;

  /* 7×50 dürbünün gerçek görüş alanı (derece). Üretici belgeleri (28.10.2026'da bakıldı):
     - Nikon Action EX 7×50 CF: 6,4° (görünür alan 42,7°, 1000 m'de 112 m)
       https://imaging.nikon.com/sport-optics/lineup/binoculars/standard/ex_x35x40x50/
     - Celestron Cometron 7×50: 6,6° (1000 yd'de 344 ft)
       https://www.celestron.com/products/cometron-7x50
     - Bresser 7×50 Travel (1250752): 6,97° (1000 m'de 122 m)
       https://www.bresser.com/p/bresser-7x50-travel-binoculars-1250752
     Kaynaklar 6,4–7,0° arasında ayrışıyor; temkinli olarak en küçüğü (6,4°) kullanılır: adımlar kısa kalır,
     haritadaki daire gerçek alandan büyük çizilmez (alanı daha geniş bir dürbünde hedef rahatça girer). */
  const DURBUN_ALANI = 6.4;
  const YILDIZ_SINIR = 6;      // haritaya çizilen en sönük yıldız (kadir)
  const BASAMAK_SINIR = 5;     // ara basamak yıldızı: şehir/banliyö gökünde dürbünle hemen seçilen yıldızlar
  const YAKIN = 16;            // başlangıç yıldızı için "yakın" sayılan uzaklık (°)

  /* ---- Vektör yardımcıları ---- */
  const nokta = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const capraz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const bol = a => { const n = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
  /* İki birim vektör arasındaki açı (°); küçük açılarda da kararlı */
  function aci(a, b) { const c = capraz(a, b); return Math.atan2(Math.hypot(c[0], c[1], c[2]), nokta(a, b)) / DER; }
  /* a'dan b'ye giden büyük çember üzerinde a'dan t derece ötedeki nokta (t < 0: ters yönde) */
  function yolda(a, b, t) {
    const d = aci(a, b) * DER;
    if (d < 1e-9) return a.slice();
    const s = Math.sin(d), f1 = Math.sin(d - t * DER) / s, f2 = Math.sin(t * DER) / s;
    return bol([a[0] * f1 + b[0] * f2, a[1] * f1 + b[1] * f2, a[2] * f1 + b[2] * f2]);
  }
  /* Ekvatoral (J2000) birim vektör → ufuk çerçevesi (gok.js ufkaCevir ile aynı: x kuzey, y batı, z başucu) */
  function ufukV(m, v) {
    return [m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2],
      m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2],
      m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2]];
  }
  const yukseklik = h => Math.asin(Math.max(-1, Math.min(1, h[2]))) / DER;

  /* Stereografik izdüşüm, ufuk çerçevesinde merkez c'ye teğet düzlem: "yukarı" başucuna, "sağ" gözlemcinin sağına.
     Döndürür: p → {x, y} radyan cinsinden (merkezde 1 birim = 1 radyan), y yukarı. */
  function izdusum(c) {
    let u = [-c[2] * c[0], -c[2] * c[1], 1 - c[2] * c[2]];   // başucunun teğet bileşeni
    if (Math.hypot(u[0], u[1], u[2]) < 1e-3) u = [1 - c[0] * c[0], -c[0] * c[1], -c[0] * c[2]];   // tam başucunda: kuzey yukarı
    u = bol(u);
    const r = bol(capraz(c, u));   // kuzeye bakarken sağ = doğu
    const f = p => { const k = 2 / (1 + Math.max(-0.999, nokta(p, c))); return { x: k * nokta(p, r), y: k * nokta(p, u) }; };
    f.u = u; f.r = r; f.c = c;
    return f;
  }

  /* "178x63′" → büyük eksen (°); "110′" → 1,83°; boşsa 0 */
  function boyutDer(b) {
    const s = String(b || '').replace(',', '.');
    const m = s.match(/([\d.]+)(?:\s*[x×]\s*[\d.]+)?\s*(′|'|°|″|")/);
    if (!m) return 0;
    const v = parseFloat(m[1]);
    return m[2] === '°' ? v : (m[2] === '″' || m[2] === '"') ? v / 3600 : v / 60;
  }

  /* ---- Başlangıç yıldızı ----
     Parlak (≤ 2,5 kadir; yakında yoksa ≤ 3,5) ve hedefe olabildiğince yakın; adı olan yıldız yeğlenir
     (adsız yıldız uzaklığı 1,35 kat sayılır), hedef ufkun üstündeyse ufkun altındaki yıldız elenir. */
  function baslangicSec(yv, veri, hedefV, ic, hAlt, m) {
    const y = veri.y, adlar = veri.adlar || {};
    const adaylar = [];
    for (let i = 0; i < y.length && y[i][2] <= 3.5; i++) {
      const d = aci(yv[i], hedefV);
      if (d < ic || d > 40) continue;   // hedefin kendisi ya da içindeki yıldız (Ülker'de Alkyone) başlangıç olamaz
      const alt = yukseklik(ufukV(m, yv[i]));
      adaylar.push({ i, d, kadir: y[i][2], ad: adlar[i] || null, alt });
    }
    const puan = a => a.d * (a.ad ? 1 : 1.35) + (hAlt > 0 && a.alt < 3 ? 60 : 0);
    const en = ls => ls.reduce((e, a) => (!e || puan(a) < puan(e) ? a : e), null);
    return en(adaylar.filter(a => a.kadir <= 2.5 && a.d <= YAKIN)) ||
      en(adaylar.filter(a => a.d <= YAKIN)) ||
      en(adaylar.filter(a => a.kadir <= 2.5)) || en(adaylar);
  }

  /* ---- Atlama yolu ----
     Hedef ~1,5 dürbün alanı içindeyse tek ok. Değilse her adım en çok bir dürbün alanı: o andaki noktadan
     bir alan içinde kalan, hedefe yaklaştıran ve başlangıç–hedef çizgisinden az sapan en uygun parlak yıldız;
     böyle yıldız yoksa çizgi üzerinde bir alan ilerideki nokta (ara nokta). */
  function atlamaYolu(yv, veri, bas, hedefV, F) {
    const basV = yv[bas.i];
    const yol = [{ v: basV, tur: 'baslangic', i: bas.i }];
    const toplam = aci(basV, hedefV);
    if (toplam > 1.5 * F) {
      const eksen = bol(capraz(basV, hedefV));   // başlangıç–hedef büyük çemberinin kutbu
      const adaylar = [];
      for (let i = 0; i < veri.y.length && veri.y[i][2] <= BASAMAK_SINIR; i++) {
        if (i === bas.i) continue;
        const v = yv[i];
        if (aci(v, basV) > toplam + F || aci(v, hedefV) > toplam + F) continue;
        adaylar.push({ i, v, kadir: veri.y[i][2], sapma: Math.abs(Math.asin(Math.max(-1, Math.min(1, nokta(v, eksen))))) / DER });
      }
      let simdi = basV;
      for (let k = 0; k < 12 && aci(simdi, hedefV) > 0.95 * F; k++) {
        const kalan = aci(simdi, hedefV);
        let en = null;
        adaylar.forEach(a => {
          const s = aci(simdi, a.v);
          if (s < 0.35 * F || s > 0.95 * F) return;
          const r = aci(a.v, hedefV);
          if (r > kalan - 0.3 * F || a.sapma > 0.5 * F) return;
          const p = r + 0.8 * a.sapma + 0.3 * (a.kadir - 3);
          if (!en || p < en.p) en = { a, p };
        });
        if (en) { yol.push({ v: en.a.v, tur: 'durak', i: en.a.i }); simdi = en.a.v; }
        else { simdi = yolda(simdi, hedefV, Math.min(0.8 * F, kalan - 0.5 * F)); yol.push({ v: simdi, tur: 'ara' }); }
      }
    }
    yol.push({ v: hedefV, tur: 'hedef' });
    return yol;
  }

  /* Ekrandaki yön (y aşağı): sekiz yön, okunuşları */
  const YON = ['sağa', 'sağ yukarı', 'yukarı', 'sol yukarı', 'sola', 'sol aşağı', 'aşağı', 'sağ aşağı'];
  const YONDA = ['sağında', 'sağ yukarısında', 'yukarısında', 'sol yukarısında', 'solunda', 'sol aşağısında', 'aşağısında', 'sağ aşağısında'];
  function ekranYon(dx, dy) { const a = Math.atan2(-dy, dx) / DER; return ((Math.round(a / 45) % 8) + 8) % 8; }
  /* Pusula yönünün bulunma hâli: "doğuda", "kuzeybatıda" */
  const PUSULA_DA = { K: 'kuzeyde', KD: 'kuzeydoğuda', D: 'doğuda', GD: 'güneydoğuda', G: 'güneyde', GB: 'güneybatıda', B: 'batıda', KB: 'kuzeybatıda' };

  /* ---- Tüm haritanın hesabı (DOM'suz) ----
     veri: { yildizlar, takimyildizlar }, W×H: çizim boyu (CSS px). Döndürülen konumlar piksel. */
  function hesapla(veri, hedef, zaman, gzl, W, H) {
    const yd = veri.yildizlar;
    const yv = veri._yv || yd.y.map(s => G.birimVektor(s[0], s[1]));
    const m = G.ufukMatrisi(zaman, gzl);
    const F = DURBUN_ALANI;
    const hedefV = G.birimVektor(hedef.ra, hedef.dec);
    const hH = ufukV(m, hedefV);
    const boy = boyutDer(hedef.boyut);
    const bas = baslangicSec(yv, yd, hedefV, Math.max(0.5, boy / 2 + 0.2), yukseklik(hH), m);
    if (!bas) return null;
    const yol = atlamaYolu(yv, yd, bas, hedefV, F);

    /* Merkez: başlangıç ile hedefin ortası; alan ikisini ve hedefteki dürbün dairesini payla içine alır */
    const merkezE = bol([yv[bas.i][0] + hedefV[0], yv[bas.i][1] + hedefV[1], yv[bas.i][2] + hedefV[2]]);
    const yaricap = Math.max(...yol.map(n => aci(merkezE, n.v)), aci(merkezE, hedefV) + F / 2) + 1.5;
    const alan = Math.max(15, 2 * yaricap);   // haritanın kısa kenarının kapsadığı açı (°)
    const c = ufukV(m, merkezE);
    const P = izdusum(c);
    const pad = 6;
    const s = (Math.min(W, H) / 2 - pad) / (2 * Math.tan(alan / 4 * DER));   // px / radyan (merkezde)
    const cx = W / 2, cy = H / 2;
    const ekran = vE => { const q = P(ufukV(m, vE)); return { x: cx + s * q.x, y: cy - s * q.y }; };
    const ekranH = vH => { const q = P(vH); return { x: cx + s * q.x, y: cy - s * q.y }; };
    const icerde = (p, k) => p.x >= -k && p.x <= W + k && p.y >= -k && p.y <= H + k;
    const kose = Math.cos(Math.min(170, alan * 0.75 + 2) * DER);

    /* Yıldızlar: harita.js ile aynı boy kuralı */
    const olc = Math.max(W / 480, 0.85);
    const yildizlar = [];
    yd.y.forEach((st, i) => {
      if (st[2] > YILDIZ_SINIR || nokta(yv[i], merkezE) < kose) return;
      const p = ekran(yv[i]);
      const r = Math.max(0.55, (7.2 - st[2]) * 0.62 * olc);
      if (!icerde(p, r)) return;
      yildizlar.push({ i, x: p.x, y: p.y, r, kadir: st[2], alt: yukseklik(ufukV(m, yv[i])) });
    });

    /* Takımyıldız çizgileri (alana değen bölümler) */
    const cizgiler = [];
    (veri.takimyildizlar || []).forEach(t => t.c.forEach(seri => {
      for (let k = 1; k < seri.length; k++) {
        const a = G.birimVektor(seri[k - 1][0], seri[k - 1][1]), b = G.birimVektor(seri[k][0], seri[k][1]);
        if (nokta(a, merkezE) < kose && nokta(b, merkezE) < kose) continue;
        if (nokta(a, merkezE) < 0 || nokta(b, merkezE) < 0) continue;
        const p = ekran(a), q = ekran(b);
        if (!icerde(p, W) || !icerde(q, W)) continue;
        cizgiler.push([p.x, p.y, q.x, q.y]);
      }
    }));

    /* Ufuk: alana giriyorsa çizgi ve altında kalan bölge */
    let ufuk = null;
    if (yukseklik(c) < alan * 0.75) {
      const nk = [];
      for (let az = 0; az < 360; az += 0.5) {
        const vH = [Math.cos(az * DER), -Math.sin(az * DER), 0];
        if (nokta(vH, c) < Math.cos(Math.min(150, alan * 1.2 + Math.abs(yukseklik(c))) * DER)) continue;
        const p = ekranH(vH);
        if (p.x < -W || p.x > 2 * W || p.y < -H || p.y > 2 * H) continue;
        nk.push(p);
      }
      nk.sort((a, b) => a.x - b.x);
      if (nk.length > 1) ufuk = nk;
    }

    /* Atlama yolu, başlangıç ve hedef */
    const yolE = yol.map(n => Object.assign({ alt: yukseklik(ufukV(m, n.v)) }, ekran(n.v), { tur: n.tur, i: n.i }));
    const hP = ekran(hedefV);
    const bP = yolE[0];
    /* Dürbün dairesi: hedeften merkez yönünde ve ters yönde F/2 ötedeki iki nokta çapın uçlarıdır
       (stereografik izdüşümde daire daire kalır; merkezden geçen doğru simetri ekseni) */
    const d1 = ekran(yolda(hedefV, merkezE, F / 2)), d2 = ekran(yolda(hedefV, merkezE, -F / 2));
    const daire = { x: (d1.x + d2.x) / 2, y: (d1.y + d2.y) / 2, r: Math.hypot(d1.x - d2.x, d1.y - d2.y) / 2 };
    /* Kuzey: gök kutbunun merkezdeki teğet yönü */
    const kutup = ufukV(m, [0, 0, 1]);
    const nT = [kutup[0] - nokta(kutup, c) * c[0], kutup[1] - nokta(kutup, c) * c[1], kutup[2] - nokta(kutup, c) * c[2]];
    const nn = Math.hypot(nT[0], nT[1], nT[2]);
    const kuzey = nn > 1e-3 ? { dx: nokta(nT, P.r) / nn, dy: -nokta(nT, P.u) / nn } : null;

    const ayrim = aci(yv[bas.i], hedefV);
    const hAA = G.sabitAltAz(hedef.ra, hedef.dec, zaman, gzl);
    const bAA = G.sabitAltAz(yd.y[bas.i][0], yd.y[bas.i][1], zaman, gzl);
    /* Başlangıç yıldızının takımyıldızı (IAU sınırları, Astronomy Engine) ve o takımyıldızın veri dosyasındaki en parlağı mı */
    const ty = G.A.Constellation(yd.y[bas.i][0] / 15, yd.y[bas.i][1]).symbol;
    let enParlak = true;
    for (let i = 0; i < yd.y.length && yd.y[i][2] <= yd.y[bas.i][2]; i++) {   // eşit parlaklıkta (Alpheratz–Mirach, 2,07) "en parlak" denmez
      if (i !== bas.i && G.A.Constellation(yd.y[i][0] / 15, yd.y[i][1]).symbol === ty) { enParlak = false; break; }
    }
    const tyAd = ((veri.takimyildizlar || []).find(t => t.k === ty) || {}).ad || ty;

    return {
      W, H, alan, olcek: s * DER, gorus: F, ayrim,
      merkez: { x: cx, y: cy },
      baslangic: { i: bas.i, ad: bas.ad, kadir: bas.kadir, x: bP.x, y: bP.y, r: Math.max(0.55, (7.2 - bas.kadir) * 0.62 * olc), alt: bAA.alt, az: bAA.az, ty, tyAd, enParlak },
      hedef: { x: hP.x, y: hP.y, alt: hAA.alt, az: hAA.az, rPx: Math.max(5.5, Math.min(daire.r * 0.6, boy / 2 * s * DER)) },
      yol: yolE, daire, yildizlar, cizgiler, ufuk, kuzey,
      adim: yol.length - 1, alanSayisi: ayrim / F, yon: ekranYon(hP.x - bP.x, hP.y - bP.y)
    };
  }

  /* ---- Tarif metni (Türkçe, 1–3 kısa cümle). Yıldız adı ve takımyıldızı yalnız veri dosyalarından. ---- */
  const sayi = (x, b) => (kok.Urania ? kok.Urania.sayi(x, b) : x.toFixed(b).replace('.', ','));
  const derece = x => (kok.Urania ? kok.Urania.derece(x) : Math.round(x) + '°');
  const kadirB = x => (kok.Urania ? kok.Urania.kadir(x) : sayi(x, 1));
  function konumMetni(alt, az) { return alt < 0 ? 'şu an ufkun altında' : 'şu an ' + PUSULA_DA[G.yon(az)] + ', ' + derece(alt) + ' yükseklikte'; }

  function tarif(h, hedef) {
    const b = h.baslangic;
    const nerede = (b.enParlak ? b.tyAd + ' takımyıldızının en parlak yıldızı' : b.tyAd + ' takımyıldızında') + ', ' + kadirB(b.kadir) + ' kadir; ' + konumMetni(b.alt, b.az);
    const c1 = b.ad ? 'Önce çıplak gözle ' + b.ad + ' yıldızını bul (' + nerede + ').'
      : 'Önce çıplak gözle haritada «başlangıç» yazan yıldızı bul (' + nerede + ').';
    const k = hedef.kisa;
    const uzak = 'yaklaşık ' + sayi(h.alanSayisi, 1) + ' dürbün alanı (' + derece(h.ayrim) + ')';   // 1 alan = DURBUN_ALANI
    let c2;
    if (h.ayrim <= h.gorus * 0.45) c2 = 'Dürbünü bu yıldıza çevir: ' + k + ' aynı dürbün alanında, yıldızın ' + YONDA[h.yon] + '.';
    else if (h.adim === 1) c2 = 'Dürbünü oradan ' + YON[h.yon] + ' doğru ' + uzak + ' kaydır; ' + k + ' haritadaki halkanın yerinde.';
    else {
      const duraklar = h.yol.filter(n => n.tur === 'durak').length;
      const ara = duraklar === h.adim - 1 ? 'her adımda işaretli ara yıldızı alanın ortasına al'
        : duraklar ? 'işaretli ara yıldızları basamak olarak kullan, her adım en çok bir dürbün alanı'
          : 'her adımda en çok bir dürbün alanı ilerle';
      c2 = 'Dürbünü oradan ' + YON[h.yon] + ' doğru ' + h.adim + ' adımda, toplam ' + uzak + ' kaydır; ' + ara + '.';
    }
    return [c1, c2];
  }
  function ozet(h, hedef) {
    const b = h.baslangic;
    return 'Bulma haritası. Başlangıç: ' + (b.ad || 'parlak yıldız') + ', ' + b.tyAd + ' takımyıldızında. Hedef ' + hedef.kisa +
      ' başlangıcın ' + YONDA[h.yon] + ', ' + derece(h.ayrim) + ' uzakta; ' + (h.adim === 1 ? 'tek adım' : h.adim + ' adım') +
      '. Dairede 7×50 dürbünün görüş alanı. Haritanın üstü başucu yönü' + (h.kuzey ? ', kuzey ' + YON[ekranYon(h.kuzey.dx, h.kuzey.dy)] : '') + '.';
  }

  const hesap = { DURBUN_ALANI, aci, yolda, izdusum, boyutDer, baslangicSec, atlamaYolu, hesapla, tarif, ozet, ekranYon };
  if (NODE) { module.exports = hesap; return; }

  /* =================== Tarayıcı: diyalog ve SVG =================== */
  const SVGNS = 'http://www.w3.org/2000/svg';
  let panel = null, acan = null, son = null, veriSoz = null, olcKanvas = null;

  function svgEl(ad, oz, ata) {
    const e = document.createElementNS(SVGNS, ad);
    for (const k in oz) e.setAttribute(k, oz[k]);
    if (ata) ata.appendChild(e);
    return e;
  }
  const yuvar = x => Math.round(x * 10) / 10;
  function metinGenislik(metin, font) {
    olcKanvas = olcKanvas || document.createElement('canvas').getContext('2d');
    olcKanvas.font = font;
    return olcKanvas.measureText(metin).width;
  }

  function panelKur() {
    if (panel) return panel;
    panel = document.createElement('dialog');
    panel.id = 'bulucuPanel';
    panel.className = 'bulucu';
    panel.setAttribute('aria-labelledby', 'bulucuBaslik');
    const bas = document.createElement('div'); bas.className = 'bulucu-bas';
    const h = document.createElement('h2'); h.id = 'bulucuBaslik';
    const kapat = document.createElement('button'); kapat.type = 'button'; kapat.className = 'dugme bulucu-kapat'; kapat.textContent = 'Kapat';
    kapat.addEventListener('click', () => panel.close());
    bas.append(h, kapat);
    const alt = document.createElement('p'); alt.className = 'bulucu-alt'; alt.id = 'bulucuAlt';
    const cizim = document.createElement('div'); cizim.className = 'bulucu-cizim'; cizim.id = 'bulucuCizim';
    const durum = document.createElement('p'); durum.className = 'bulucu-durum'; durum.id = 'bulucuDurum';
    const tarifP = document.createElement('p'); tarifP.className = 'bulucu-tarif'; tarifP.id = 'bulucuTarif';
    const not = document.createElement('p'); not.className = 'bulucu-not';
    not.textContent = 'Kesikli daire: 7×50 dürbünün görüş alanı (yaklaşık ' + sayi(DURBUN_ALANI, 1) + '°). Haritanın üstü başucuna bakar; K oku kuzeyi gösterir. Yıldızlar 6 kadire kadar.';
    panel.append(bas, alt, cizim, durum, tarifP, not);
    /* Kapanınca odak açan öğeye döner (Esc, Kapat ya da form) */
    panel.addEventListener('close', () => {
      const a = acan; acan = null; son = null;
      if (a && a.isConnected && typeof a.focus === 'function') a.focus();
    });
    document.body.appendChild(panel);
    let zm = null;
    window.addEventListener('resize', () => { clearTimeout(zm); zm = setTimeout(() => { if (panel.open && son) ciz(); }, 120); });
    document.addEventListener('urania:tema', () => { if (panel.open && son) ciz(); });
    return panel;
  }

  function veriYukle() {
    if (!veriSoz) {
      veriSoz = Promise.all([kok.Urania.veri('yildizlar'), kok.Urania.veri('takimyildiz')]).then(([yildizlar, takimyildizlar]) => {
        const v = { yildizlar, takimyildizlar };
        v._yv = yildizlar.y.map(s => G.birimVektor(s[0], s[1]));
        return v;
      }).catch(e => { veriSoz = null; throw e; });
    }
    return veriSoz;
  }

  /* Etiket yerleştirme: sekiz aday konum, SVG içinde kalan ve öbür etiket/işaretlerle çakışmayan ilk yer */
  function etiketKoy(kutular, W, H, metin, x, y, ofset, font, boy) {
    const w = metinGenislik(metin, font) + 2, h = boy * 1.15, o = ofset, oc = o * 0.75;
    const adaylar = [[x + o, y - h / 2], [x - o - w, y - h / 2], [x - w / 2, y - o - h], [x - w / 2, y + o],
      [x + oc, y - oc - h], [x - oc - w, y - oc - h], [x + oc, y + oc], [x - oc - w, y + oc]];
    const kes = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    let sec = null;
    for (const [ax, ay] of adaylar) {
      const k = { x: ax, y: ay, w, h };
      if (k.x < 2 || k.y < 2 || k.x + k.w > W - 2 || k.y + k.h > H - 2) continue;
      if (kutular.some(b => kes(k, b))) continue;
      sec = k; break;
    }
    if (!sec) {   // sığmazsa kenara kıstırılır (taşmaz)
      sec = { x: Math.min(Math.max(2, x + o), W - 2 - w), y: Math.min(Math.max(2, y - h / 2), H - 2 - h), w, h };
    }
    kutular.push(sec);
    return { x: sec.x + 1, y: sec.y + h * 0.8 };
  }

  function ciz() {
    const { hedef, zaman, gzl, veri } = son;
    const kap = panel.querySelector('#bulucuCizim');
    const W = Math.max(240, Math.floor(kap.clientWidth || 320));
    const H = W;
    const h = hesapla(veri, hedef, zaman, gzl, W, H);
    kap.textContent = '';
    if (!h) { kap.textContent = 'Bu hedef için uygun başlangıç yıldızı bulunamadı.'; return null; }
    const svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', class: 'bulucu-svg',
      'data-olcek': h.olcek.toFixed(4), 'data-gorus': h.gorus, 'data-alan': h.alan.toFixed(2) });
    svg.setAttribute('aria-label', ozet(h, hedef));
    kap.appendChild(svg);
    svgEl('rect', { x: 0, y: 0, width: W, height: H, class: 'bulucu-zemin' }, svg);
    const kutular = [];

    /* Ufkun altı ve ufuk çizgisi */
    if (h.ufuk) {
      const p = h.ufuk.map(n => yuvar(n.x) + ',' + yuvar(n.y));
      const sol = h.ufuk[0], sag = h.ufuk[h.ufuk.length - 1];
      svgEl('path', { d: 'M' + p.join(' L') + ' L' + yuvar(sag.x) + ',' + (2 * H) + ' L' + yuvar(sol.x) + ',' + (2 * H) + ' Z', class: 'bulucu-yer' }, svg);
      svgEl('polyline', { points: p.join(' '), class: 'bulucu-ufuk' }, svg);
    }
    /* Takımyıldız çizgileri */
    const g1 = svgEl('g', { class: 'bulucu-ty' }, svg);
    h.cizgiler.forEach(l => svgEl('line', { x1: yuvar(l[0]), y1: yuvar(l[1]), x2: yuvar(l[2]), y2: yuvar(l[3]) }, g1));
    /* Dürbün görüş alanı */
    svgEl('circle', { cx: yuvar(h.daire.x), cy: yuvar(h.daire.y), r: yuvar(h.daire.r), class: 'bulucu-alan' }, svg);
    /* Yıldızlar */
    const g2 = svgEl('g', { class: 'bulucu-yildizlar' }, svg);
    h.yildizlar.forEach(y => svgEl('circle', { cx: yuvar(y.x), cy: yuvar(y.y), r: yuvar(y.r), class: y.alt < 0 ? 'bulucu-yildiz altta' : 'bulucu-yildiz' }, g2));

    /* Atlama yolu: her adım ayrı ok, uçlar yıldız noktasından ve hedef halkasından açıkta */
    const g3 = svgEl('g', { class: 'bulucu-yol' }, svg);
    const pay = n => (n.tur === 'hedef' ? h.hedef.rPx + 3 : n.tur === 'baslangic' ? h.baslangic.r + 5 : n.tur === 'durak' ? 7 : 3);
    for (let k = 1; k < h.yol.length; k++) {
      const a = h.yol[k - 1], b = h.yol[k];
      const L = Math.hypot(b.x - a.x, b.y - a.y);
      const ux = (b.x - a.x) / L, uy = (b.y - a.y) / L;
      const p0 = pay(a), p1 = pay(b);
      if (L <= p0 + p1 + 6) continue;
      const x0 = a.x + ux * p0, y0 = a.y + uy * p0, x1 = b.x - ux * p1, y1 = b.y - uy * p1;
      svgEl('line', { x1: yuvar(x0), y1: yuvar(y0), x2: yuvar(x1 - ux * 4), y2: yuvar(y1 - uy * 4), class: 'bulucu-adim' }, g3);
      const o = 7, e = 4;
      svgEl('polygon', { points: [[x1, y1], [x1 - ux * o - uy * e, y1 - uy * o + ux * e], [x1 - ux * o + uy * e, y1 - uy * o - ux * e]].map(q => yuvar(q[0]) + ',' + yuvar(q[1])).join(' '), class: 'bulucu-ok' }, g3);
      kutular.push({ x: Math.min(x0, x1) - 1, y: Math.min(y0, y1) - 1, w: Math.abs(x1 - x0) + 2, h: Math.abs(y1 - y0) + 2, cizgi: true });
    }
    h.yol.forEach(n => {
      if (n.tur === 'durak') svgEl('circle', { cx: yuvar(n.x), cy: yuvar(n.y), r: 6, class: 'bulucu-durak' }, g3);
      else if (n.tur === 'ara') svgEl('circle', { cx: yuvar(n.x), cy: yuvar(n.y), r: 2.5, class: 'bulucu-ara' }, g3);
    });
    /* Başlangıç yıldızı halkası ve hedef halkası (gök levhasıyla aynı: --hedef renginde ince halka) */
    const b = h.baslangic;
    svgEl('circle', { cx: yuvar(b.x), cy: yuvar(b.y), r: yuvar(b.r + 4), class: 'bulucu-baslangic' }, svg);
    svgEl('circle', { cx: yuvar(h.hedef.x), cy: yuvar(h.hedef.y), r: yuvar(h.hedef.rPx), class: 'bulucu-hedef', 'data-rol': 'hedef' }, svg);
    kutular.push({ x: b.x - b.r - 5, y: b.y - b.r - 5, w: 2 * b.r + 10, h: 2 * b.r + 10 });
    kutular.push({ x: h.hedef.x - h.hedef.rPx - 1, y: h.hedef.y - h.hedef.rPx - 1, w: 2 * h.hedef.rPx + 2, h: 2 * h.hedef.rPx + 2 });

    /* Köşe işaretleri önce yer ayırır: sol üstte başucu, sağ üstte kuzey oku */
    const kucukFont = '500 12px Plex, system-ui, sans-serif';
    const basucu = '↑ başucu';
    const bw = metinGenislik(basucu, kucukFont) + 2;
    kutular.push({ x: 6, y: 5, w: bw, h: 16 });
    const t0 = svgEl('text', { x: 7, y: 17, class: 'bulucu-kose' }, svg); t0.textContent = basucu;
    if (h.kuzey) {
      const kx = W - 22, ky = 24, L = 13;
      const g4 = svgEl('g', { class: 'bulucu-kuzey' }, svg);
      const ux = h.kuzey.dx, uy = h.kuzey.dy;
      svgEl('circle', { cx: kx, cy: ky, r: 17, class: 'bulucu-kuzey-zemin' }, g4);
      svgEl('line', { x1: yuvar(kx - ux * L * 0.55), y1: yuvar(ky - uy * L * 0.55), x2: yuvar(kx + ux * (L - 5)), y2: yuvar(ky + uy * (L - 5)) }, g4);
      const ox = kx + ux * L, oy = ky + uy * L;
      svgEl('polygon', { points: [[ox, oy], [ox - ux * 6 - uy * 3.5, oy - uy * 6 + ux * 3.5], [ox - ux * 6 + uy * 3.5, oy - uy * 6 - ux * 3.5]].map(q => yuvar(q[0]) + ',' + yuvar(q[1])).join(' ') }, g4);
      const tk = svgEl('text', { x: yuvar(kx - ux * 9), y: yuvar(ky - uy * 9 + 4), 'text-anchor': 'middle', class: 'bulucu-kuzey-et' }, g4);
      tk.textContent = 'K';
      kutular.push({ x: kx - 18, y: ky - 18, w: 36, h: 36 });
    }
    if (h.ufuk) {
      /* "ufuk" yazısı çizginin hemen altında, görünen bölümün ortasına en yakın noktada */
      const ic = h.ufuk.filter(n => n.x > 30 && n.x < W - 60 && n.y > 20 && n.y < H - 8);
      if (ic.length) {
        const n = ic.reduce((a, q) => (Math.abs(q.x - W * 0.3) < Math.abs(a.x - W * 0.3) ? q : a));
        const ufukGen = metinGenislik('ufuk', kucukFont) + 2;
        if (!kutular.some(k => !k.cizgi && n.x < k.x + k.w && n.x + ufukGen > k.x && n.y + 2 < k.y + k.h && n.y + 18 > k.y)) {
          const tu = svgEl('text', { x: yuvar(n.x), y: yuvar(Math.min(H - 4, n.y + 14)), class: 'bulucu-kose' }, svg); tu.textContent = 'ufuk';
          kutular.push({ x: n.x, y: n.y + 2, w: ufukGen, h: 16 });
        }
      }
    }
    /* Etiketler: önce hedef, sonra başlangıç yıldızı */
    const buyukFont = '600 14px Plex, system-ui, sans-serif';
    const eh = etiketKoy(kutular, W, H, hedef.kisa, h.hedef.x, h.hedef.y, h.hedef.rPx + 4, buyukFont, 14);
    const th = svgEl('text', { x: yuvar(eh.x), y: yuvar(eh.y), class: 'bulucu-et bulucu-hedef-et', 'data-rol': 'hedef-et' }, svg); th.textContent = hedef.kisa;
    const bAd = b.ad || 'başlangıç';
    const eb = etiketKoy(kutular, W, H, bAd, b.x, b.y, b.r + 7, buyukFont, 14);
    const tb = svgEl('text', { x: yuvar(eb.x), y: yuvar(eb.y), class: 'bulucu-et', 'data-rol': 'baslangic', 'data-yildiz': b.i }, svg); tb.textContent = bAd;
    return h;
  }

  function doldur() {
    const { hedef, zaman } = son;
    const U = kok.Urania;
    panel.querySelector('#bulucuBaslik').textContent = 'Bulma haritası: ' + hedef.kisa;
    panel.querySelector('#bulucuAlt').textContent = [hedef.ad !== hedef.kisa ? hedef.ad : null, hedef.turAd, hedef.kadir != null ? kadirB(hedef.kadir) + ' kadir' : null,
      U && U.gun ? U.gun(zaman) + ' ' + U.saat(zaman) : null].filter(Boolean).join(' · ');
    const h = ciz();
    const durum = panel.querySelector('#bulucuDurum');
    const tarifP = panel.querySelector('#bulucuTarif');
    durum.textContent = ''; tarifP.textContent = '';
    if (!h) return;
    const k = h.hedef;
    durum.append(document.createTextNode(hedef.kisa + ' ' + konumMetni(k.alt, k.az) + '.'));
    if (k.alt < 20) {
      const u = document.createElement('span'); u.className = 'bulucu-uyari';
      u.textContent = k.alt < 0 ? ' Bu saatte görülemez; yükselince yeniden bak.'
        : ' Ufka yakın (20°’nin altında): pus, binalar ve şehir ışığı bulmayı zorlaştırır; daha yükseğe çıkmasını bekle.';
      durum.append(u);
      durum.classList.add('uyari-var');
    } else durum.classList.remove('uyari-var');
    tarifP.textContent = tarif(h, hedef).join(' ');
  }

  /* hedef: hedefler.json öğesi; secenek: { zaman: Date, gzl: G.gozlemci(...) } (verilmezse şimdi ve kayıtlı konum) */
  function ac(hedef, secenek) {
    const s = secenek || {};
    const zaman = s.zaman instanceof Date ? s.zaman : new Date();
    let gzl = s.gzl;
    if (!gzl) { const k = kok.Urania.konum(); gzl = G.gozlemci(k.enlem, k.boylam, k.yukseklik || 0); }
    panelKur();
    if (!panel.open) acan = document.activeElement;
    panel.querySelector('#bulucuBaslik').textContent = 'Bulma haritası: ' + hedef.kisa;
    panel.querySelector('#bulucuCizim').textContent = 'Yükleniyor…';
    panel.querySelector('#bulucuDurum').textContent = '';
    panel.querySelector('#bulucuTarif').textContent = '';
    if (!panel.open) { if (panel.showModal) panel.showModal(); else panel.setAttribute('open', ''); }
    return veriYukle().then(veri => {
      if (!panel.open) return null;
      son = { hedef, zaman, gzl, veri };
      doldur();
      return son;
    }).catch(e => {
      panel.querySelector('#bulucuCizim').textContent = 'Yıldız verisi yüklenemedi: ' + (e && e.message || e);
      return null;
    });
  }

  kok.Bulucu = { ac, _hesap: hesap };
})(typeof self !== 'undefined' ? self : this);
