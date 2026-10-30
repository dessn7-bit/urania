/* deney/hohmann.js — Mars'a yolculuk: Hohmann aktarımı, faz açısı, fırlatma penceresi (sinodik dönem), Güneş'e göre Δv.
   Yörüngeler dairesel ve aynı düzlemde. Yarı büyük eksenler ve dolanım süreleri veri/deney/hohmann.json'dan (NASA bilgi
   sayfaları); GM☉, GM⊕, R⊕ ve AB veri/fizik.json'dan. */
(function () {
  'use strict';
  const IKI_PI = Math.PI * 2, DER = Math.PI / 180, GUN = 86400;

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* Kepler III: dairesel yörüngede dolanım süresi (s) */
    donem(a, GM) { return IKI_PI * Math.sqrt(a * a * a / GM); },
    /* Hohmann aktarımı r1 → r2 (m). Hızlar m/s, süre s. dv1 > 0: hızlan, < 0: yavaşla (Güneş'e göre). */
    aktarim(r1, r2, GM) {
      const a = (r1 + r2) / 2;
      const v1 = Math.sqrt(GM / r1), v2 = Math.sqrt(GM / r2);
      const vp = Math.sqrt(GM * (2 / r1 - 1 / a)), va = Math.sqrt(GM * (2 / r2 - 1 / a));
      return { a, e: Math.abs(r2 - r1) / (r1 + r2), t: Math.PI * Math.sqrt(a * a * a / GM), v1, v2, dv1: vp - v1, dv2: v2 - va };
    },
    /* Kalkışta hedefin Dünya'dan önde olması gereken açı (derece; eksi: geride) */
    fazAcisi(tGun, hedefDonemGun) { return 180 - 360 * tGun / hedefDonemGun; },
    /* Sinodik dönem: aynı dizilişin yinelenme süresi (gün) */
    sinodik(p1, p2) { return 1 / Math.abs(1 / p1 - 1 / p2); },
    /* Kalkış "gecikme" gün kaydıysa varışta gezegenin varış noktasına göre açısı (derece, + ileride) ve uzaklığı (r2 biriminde değil, m) */
    iska(r2, gecikmeGun, dunyaDonemGun, hedefDonemGun) {
      const aci = (360 / hedefDonemGun - 360 / dunyaDonemGun) * gecikmeGun;
      return { aci, uzaklik: 2 * r2 * Math.abs(Math.sin(aci * DER / 2)) };
    },
    /* Alçak yörüngeden (yarıçap r) tek ateşlemeyle v∞ hızıyla kaçış: √(v∞² + 2GM/r) − √(GM/r) */
    yorungedenAtesleme(vSonsuz, GM, r) { return Math.sqrt(vSonsuz * vSonsuz + 2 * GM / r) - Math.sqrt(GM / r); },
    /* Kepler denklemi M = E − e·sinE (Newton) */
    keplerE(M, e) {
      let E = M;
      for (let i = 0; i < 50; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-12) break; }
      return E;
    },
    /* Aktarım elipsinde kalkıştan sonra kesir f (0–1) kadar zamanda konum: kutupsal {r, aci}; kalkış açısı 0, varış π */
    elipsKonum(r1, r2, f) {
      const a = (r1 + r2) / 2, e = Math.abs(r2 - r1) / (r1 + r2), dis = r2 > r1;
      const M = (dis ? 0 : Math.PI) + Math.PI * f;          // dışa: enberiden, içe: enöteden başlar
      const E = H.keplerE(M, e);
      const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
      return { r: a * (1 - e * Math.cos(E)), aci: (dis ? 0 : Math.PI) + nu };
    }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).hohmann = H;

  const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  function tarih(s) { const [y, a, g] = s.split('-').map(Number); return g + ' ' + AYLAR[a - 1] + ' ' + y; }
  function gunFarki(s1, s2) { return Math.round((Date.parse(s2 + 'T00:00:00Z') - Date.parse(s1 + 'T00:00:00Z')) / 864e5); }

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).hohmann = function (kap, o) {
    const U = o.U, V = o.veri;
    const GM = o.deger('GM_gunes'), GMe = o.deger('GM_dunya'), Re = o.deger('R_dunya');
    const DUN = V.dunya, GEZ = V.gezegenler;
    const ekKaynak = (V.kaynaklar || []).concat(GEZ.map(g => ({ ad: 'NASA ' + g.ad + ' bilgi sayfası', url: g.url })), V.mars_firsatlari.kaynaklar);
    kap.innerHTML = `
      <p class="kucuk soluk" id="hmHedefAd">Hedef gezegen:</p>
      <div class="cip-grup" id="hmHedef" role="group" aria-labelledby="hmHedefAd">${GEZ.map((g, i) => `<button type="button" class="dugme" data-i="${i}" aria-pressed="${g.ad === 'Mars'}">${U.kacis(g.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="hmKanvas"></canvas></div>
      <div class="kontroller">
        ${o.kaydirici('hmGecikme', 'Kalkış zamanı (en uygun güne göre)', -120, 120, 1, 0)}
        ${o.azHareket ? o.kaydirici('hmZaman', 'Yolculukta zaman (yolun yüzdesi)', 0, 1, 'any', 0) : ''}
        <div class="cip-grup"><button type="button" class="dugme" id="hmBasa">Baştan oynat</button></div>
      </div>
      ${o.olcumler([['hmSure', 'Yolculuk süresi'], ['hmFaz', 'Kalkışta gereken açı'], ['hmSinodik', 'Pencere aralığı'], ['hmDv1', 'Kalkış: Güneş\'e göre Δv'], ['hmDv2', 'Varış: Güneş\'e göre Δv'], ['hmLeo', 'Alçak yörüngeden (300 km) ateşleme'], ['hmIska', 'Varışta gezegene uzaklık']])}
      <div class="deney-metin" id="hmMetin"></div>
      <p class="kaynak">Yörüngeler dairesel ve aynı düzlemde varsayıldı (gerçekte Mars'ınki belirgin biçimde elips ve Dünya'nınkine göre biraz eğik); çizim ölçekli. Yolculuk süresi Kepler'in üçüncü yasasıyla, hızlar vis-viva bağıntısıyla (v² = GM☉(2/r − 1/a)), gezegenlerin açısal hızları NASA'nın verdiği yıldızıl dolanım sürelerinden. Ateşlemeler anlık; Güneş'e göre Δv'ler gezegenlerin kendi çekimini içermez. Alçak yörünge ateşlemesi 300 km'den: √(v∞² + 2GM⊕/r) − √(GM⊕/r). ${o.kaynakSatiri(['GM_gunes', 'GM_dunya', 'R_dunya', 'au'], ekKaynak).replace(/^<p class="kaynak">|<\/p>$/g, '')}</p>`;
    const cv = kap.querySelector('#hmKanvas');
    const S = id => kap.querySelector('#' + id);
    const gS = S('hmGecikme');
    let secili = GEZ.findIndex(g => g.ad === 'Mars'), st = {}, faz = 0;

    function hesapla() {
      const g = GEZ[secili], r1 = DUN.a_1e6km * 1e9, r2 = g.a_1e6km * 1e9;
      const A = H.aktarim(r1, r2, GM), tGun = A.t / GUN;
      const fazAci = H.fazAcisi(tGun, g.donem_gun), sin = H.sinodik(DUN.donem_gun, g.donem_gun);
      const d = Number(gS.value), isk = H.iska(r2, d, DUN.donem_gun, g.donem_gun);
      const rL = Re + V.leo_yukseklik_km * 1e3, leo = H.yorungedenAtesleme(Math.abs(A.dv1), GMe, rL), kurtul = H.yorungedenAtesleme(0, GMe, rL);
      st = { g, r1, r2, A, tGun, fazAci, sin, d, isk, leo, kurtul };
      const AY = 365.25 / 12;
      S('hmGecikmeCikti').textContent = d === 0 ? '0 (en uygun)' : (d > 0 ? '+' : '−') + U.sayi(Math.abs(d), 0) + ' gün (' + (d > 0 ? 'geç' : 'erken') + ')';
      S('hmSure').textContent = U.sayi(tGun, 1) + ' gün (' + (tGun < 2 * 365.25 ? U.sayi(tGun / AY, 1) + ' ay' : U.sayi(tGun / 365.25, 2) + ' yıl') + ')';
      S('hmFaz').textContent = g.ad + ' ' + U.sayi(Math.abs(fazAci), 1) + '° ' + (fazAci >= 0 ? 'önde' : 'geride');
      S('hmSinodik').textContent = U.sayi(sin, 1) + ' gün (' + U.sayi(sin / AY, 1) + ' ay)';
      S('hmDv1').textContent = (A.dv1 >= 0 ? '+' : '−') + U.sayi(Math.abs(A.dv1) / 1e3, 2) + ' km/s' + (A.dv1 < 0 ? ' (yavaşla)' : '');
      S('hmDv2').textContent = U.sayi(Math.abs(A.dv2) / 1e3, 2) + ' km/s';
      S('hmLeo').textContent = U.sayi(leo / 1e3, 2) + ' km/s';
      S('hmIska').textContent = d === 0 ? '0 km (tam isabet)' : U.sayi(isk.uzaklik / 1e9, 1) + ' milyon km (' + U.sayi(isk.uzaklik / o.deger('au'), 2) + ' AB)';
      metin();
      ciz(0);
    }

    function metin() {
      const { g, tGun, fazAci, d, isk, A, leo, kurtul } = st;
      const ilerleme = 360 * tGun / g.donem_gun;
      const once = fazAci >= 0;
      let p1 = `<p>Araç ${U.sayi(tGun, 0)} günde elipsin yarısını dolanır ve Güneş'in öbür yanına varır. Bu sürede ${g.ad} kendi yörüngesinde ${U.sayi(ilerleme, 1)}° ilerler. Araç vardığında ${g.ad}'${ekE(g.ad)} da orada olması için kalkış anında Dünya'dan ${U.sayi(Math.abs(fazAci), 1)}° ${once ? 'önde' : 'geride'} olmalıdır. Yani gezegenin şimdi olduğu yere değil, ${U.sayi(tGun, 0)} gün sonra olacağı yere nişan alırsın: uçan bir kuşa taş atan biri de kuşun önüne atar. Bu diziliş ancak ${U.sayi(st.sin, 0)} günde bir yinelenir (sinodik dönem); pencereyi kaçıran bekler.</p>`;
      let p2;
      if (d === 0) p2 = `<p>Kalkış tam zamanında: araç ile ${g.ad} varış noktasında buluşuyor.</p>`;
      else {
        const ileri = isk.aci > 0;
        p2 = `<p>Kalkış ${U.sayi(Math.abs(d), 0)} gün ${d > 0 ? 'geç' : 'erken'}. Bu sürede Dünya ile ${g.ad} arasındaki açı ${U.sayi(Math.abs(isk.aci), 1)}° değişti. Araç yine aynı elipsi izliyor, ama vardığında ${g.ad} varış noktasının ${U.sayi(Math.abs(isk.aci), 1)}° ${ileri ? 'ötesinde (çoktan geçmiş)' : 'gerisinde (henüz gelmemiş)'}, yaklaşık ${U.sayi(isk.uzaklik / 1e9, 1)} milyon km uzakta.</p>`;
      }
      const p3 = `<p>Ölçümlerdeki Δv'ler Güneş'e göredir: Dünya'nın çekiminden çıkmış bir aracın, Dünya'nın Güneş çevresindeki ${U.sayi(A.v1 / 1e3, 1)} km/s'lik hızına ${A.dv1 >= 0 ? 'eklemesi' : 'karşı ateşleyerek çıkarması'} gereken fark ${U.sayi(Math.abs(A.dv1) / 1e3, 2)} km/s. ${A.dv1 >= 0 ? 'Dışa gitmek için hızlanırsın' : 'İçe gitmek için yavaşlarsın: araç Güneş\'e doğru düşer'}. Alçak Dünya yörüngesinden yapılan ateşleme Dünya'nın çekiminden kurtulmayı da içerdiği için daha büyüktür (${U.sayi(leo / 1e3, 2)} km/s). Yine de yalnız kurtulmanın bedeli (${U.sayi(kurtul / 1e3, 2)} km/s) ile ${U.sayi(Math.abs(A.dv1) / 1e3, 2)} km/s'nin toplamından çok küçüktür: hızlı giderken yapılan ateşleme aynı Δv ile daha çok enerji kazandırır.</p>`;
      let p4 = '';
      if (g.ad === 'Mars') {
        const simdi = Date.now();
        const ls = V.mars_firsatlari.ls.filter(k => Date.parse(k.kalkis + 'T00:00:00Z') > simdi - 60 * 864e5).slice(0, 2);
        if (ls.length) p4 = `<p>Gerçek tarihler: NASA'nın 2010 tarihli Mars görev tasarımı el kitabına göre en düşük enerjili kalkışlar ${ls.map(k => `${tarih(k.kalkis)} (varış ${tarih(k.varis)}, ${gunFarki(k.kalkis, k.varis)} gün)`).join(' ve ')}. Gerçek yolculuk bu modeldekinden uzun, çünkü Mars'ın yörüngesi elips ve biraz eğik; en ucuz yol tam yarım tur değil, NASA'nın “tip II” dediği 180°'den fazla dolanan bir yol. (Erişim: 30 Ekim 2026.)</p>`;
      } else if (g.ad === 'Jüpiter') p4 = '<p>Bu kadar büyük bir Δv ve üç yıla yakın yolculuk yüzünden gerçek Jüpiter görevleri kütleçekim yardımı kullanır: derse göre Galileo, Jüpiter\'e giderken Venüs\'ten bir, Dünya\'dan iki itme aldı.</p>';
      S('hmMetin').innerHTML = p1 + p2 + p3 + p4;
    }
    /* Tamlayan eki (ünlü uyumu): Mars'ın, Venüs'ün, Jüpiter'in */
    function ekE(ad) { const u = (ad.toLocaleLowerCase('tr').match(/[aeıioöuü](?=[^aeıioöuü]*$)/) || ['a'])[0]; return { a: 'ın', ı: 'ın', e: 'in', i: 'in', o: 'un', u: 'un', ö: 'ün', ü: 'ün' }[u]; }

    function ciz(dt) {
      if (!st.g) return;
      if (o.azHareket) { const z = S('hmZaman'); faz = z ? Number(z.value) : 0; if (z) yaz(S('hmZamanCikti'), '%' + Math.round(faz * 100)); }
      else faz = (faz + (dt || 0) / 8) % 1.25;               // 8 sn yolculuk + 2 sn varışta bekleme
      const f = Math.min(1, faz), t = f * st.tGun;
      const { ctx, w, h } = o.kanvas(cv, 0.78);
      ctx.clearRect(0, 0, w, h);
      const { r1, r2, g, fazAci, d } = st;
      const wE = 360 / DUN.donem_gun, wT = 360 / g.donem_gun;
      const th0 = fazAci + (wT - wE) * d;                    // kalkış anında hedefin açısı (Dünya 0°)
      const rMax = Math.max(r1, r2), cx = w / 2, cy = h / 2, R = h / 2 - 18, s = R / rMax;
      const P = (r, aci) => [cx + r * s * Math.cos(aci), cy - r * s * Math.sin(aci)];
      const fs = w >= 420 ? 12 : 11;
      /* yörüngeler */
      ctx.lineWidth = 1.2; ctx.strokeStyle = o.renk('--hedef');
      ctx.beginPath(); ctx.arc(cx, cy, r1 * s, 0, IKI_PI); ctx.stroke();
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = o.renk('--uyari');
      ctx.beginPath(); ctx.arc(cx, cy, r2 * s, 0, IKI_PI); ctx.stroke(); ctx.restore();
      /* aktarım elipsinin yarısı */
      ctx.beginPath();
      for (let k = 0; k <= 120; k++) { const p = H.elipsKonum(r1, r2, k / 120), [x, y] = P(p.r, p.aci); if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 2.6; ctx.stroke(); ctx.lineWidth = 1;
      /* kalkıştaki faz açısı: Güneş'ten iki kesik ışın ve yay */
      const [ex0, ey0] = P(r1, 0), [tx0, ty0] = P(r2, th0 * DER);
      ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex0, ey0); ctx.moveTo(cx, cy); ctx.lineTo(tx0, ty0); ctx.stroke(); ctx.restore();
      const ra = Math.max(16, Math.min(40, r1 * s * 0.45, r2 * s * 0.45));
      ctx.beginPath(); ctx.arc(cx, cy, ra, 0, -th0 * DER, th0 > 0); ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.2; ctx.stroke(); ctx.lineWidth = 1;
      ctx.font = `600 ${fs}px Plex, sans-serif`; ctx.fillStyle = o.renk('--parsomen'); ctx.textAlign = 'center';
      const orta = th0 / 2 * DER, rl = ra + 13;
      o.etiket(ctx, U.sayi(Math.abs(th0), 0) + '°', cx + rl * Math.cos(orta), cy - rl * Math.sin(orta) + 4);
      /* Güneş */
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, IKI_PI); ctx.fillStyle = '#FFD27A'; ctx.fill();
      ctx.font = `500 ${fs}px Plex, sans-serif`; ctx.fillStyle = o.renk('--soluk');
      if (Math.min(r1, r2) * s > 46) o.etiket(ctx, 'Güneş', cx, cy + 20);
      /* gezegenin varışta olacağı yer (halka) */
      const thV = th0 + wT * st.tGun;
      const [vx, vy] = P(r2, thV * DER);
      ctx.beginPath(); ctx.arc(vx, vy, 8, 0, IKI_PI); ctx.strokeStyle = o.renk('--uyari'); ctx.lineWidth = 1.6; ctx.stroke(); ctx.lineWidth = 1;
      /* cisimler */
      const thE = wE * t, thT = th0 + wT * t;
      const [dx, dy] = P(r1, thE * DER), [gx, gy] = P(r2, thT * DER);
      const pc = H.elipsKonum(r1, r2, f), [ax, ay] = P(pc.r, pc.aci);
      /* ıska çizgisi (varışta) */
      if (faz >= 1 && d !== 0) {
        const [kx, ky] = P(r2, Math.PI);
        ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = o.renk('--uyari'); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(gx, gy); ctx.stroke(); ctx.restore();
      }
      ctx.beginPath(); ctx.arc(dx, dy, 5.5, 0, IKI_PI); ctx.fillStyle = o.renk('--hedef'); ctx.fill();
      ctx.beginPath(); ctx.arc(gx, gy, 5.5, 0, IKI_PI); ctx.fillStyle = o.renk('--uyari'); ctx.fill(); ctx.strokeStyle = '#0A1422'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(ax, ay, 3.5, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
      /* adlar: gövdenin dışına doğru */
      ctx.font = `600 ${fs}px Plex, sans-serif`;
      const ad = (x, y, aci, metin, renk, uz) => {
        ctx.fillStyle = o.renk(renk); ctx.textAlign = 'center';
        const yw = ctx.measureText(metin).width / 2;
        let ix = x + Math.cos(aci) * (uz + yw * Math.abs(Math.cos(aci)) * 0.8), iy = y - Math.sin(aci) * uz + 4;
        /* dışa doğru yer yoksa (kanvas kenarı) adı gövdenin üstüne ya da altına yaz */
        if (ix - yw < 2 || ix + yw > w - 2) { ix = x; iy = y + (y > h - 2 * uz ? -uz + 2 : uz + 4); }
        const lx = Math.max(yw + 2, Math.min(w - yw - 2, ix)), ly = Math.max(fs + 2, Math.min(h - 4, iy));
        o.etiket(ctx, metin, lx, ly);
      };
      ad(dx, dy, thE * DER, 'Dünya', '--hedef', 17);
      ad(gx, gy, thT * DER, g.ad, '--uyari', 18);
      /* gün sayacı */
      ctx.font = `600 ${fs + 1}px Plex, sans-serif`; ctx.textAlign = 'left'; ctx.fillStyle = o.renk('--parsomen');
      o.etiket(ctx, faz >= 1 ? 'Varış: ' + U.sayi(st.tGun, 0) + '. gün' : U.sayi(t, 0) + '. gün / ' + U.sayi(st.tGun, 0), 8, fs + 6);
      if (faz >= 1 && d !== 0) { ctx.font = `500 ${fs}px Plex, sans-serif`; ctx.fillStyle = o.renk('--uyari'); o.etiket(ctx, 'ıska: ' + U.sayi(st.isk.uzaklik / 1e9, 0) + ' milyon km', 8, 2 * fs + 12); }
    }
    function yaz(e, m) { if (e && e.textContent !== m) e.textContent = m; }

    gS.addEventListener('input', () => { faz = 0; hesapla(); });
    S('hmBasa').addEventListener('click', () => { faz = 0; ciz(0); });
    S('hmHedef').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      secili = Number(b.dataset.i); faz = 0;
      kap.querySelectorAll('#hmHedef button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      hesapla();
    });
    hesapla();
    const d = o.dongu(ciz);
    const yeniden = () => ciz(0);
    document.addEventListener('urania:tema', yeniden);
    return { durdur() { d.durdur(); document.removeEventListener('urania:tema', yeniden); } };
  };
})();
