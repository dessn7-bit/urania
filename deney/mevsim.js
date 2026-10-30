/* deney/mevsim.js — Mevsimler ve Güneş'in yolu: eğik eksen, öğle Güneşi'nin yüksekliği, gündüz süresi ve
   bir metrekareye düşen güç. Güneş'in konumu USNO'nun yaklaşık formülleriyle (aa.usno.navy.mil/faq/sun_approx),
   gündüz süresi gün doğumu denklemiyle hesaplanır. Sayılar ve kaynakları veri/deney/mevsim.json'da. */
(function () {
  'use strict';
  const DER = Math.PI / 180, IKI_PI = Math.PI * 2;
  const sin = x => Math.sin(x * DER), cos = x => Math.cos(x * DER);
  const AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  /* ===================== saf hesaplar (DOM yok) ===================== */
  const H = {
    /* 2026'nın gun. günü (1 = 1 Ocak), UT saatiyle: D = JD − 2451545,0. 1 Ocak 2026 00:00 UT = JD 2461041,5 */
    D(gun, saatUT) { return 9496.5 + (gun - 1) + saatUT / 24; },
    /* USNO yaklaşık Güneş koordinatları. egiklik verilmezse USNO'nun e = 23,439° − 0,00000036·D değeri.
       g: ortalama anomali, q: ortalama boylam, L: tutulum boylamı, dik: dik açıklık, R: uzaklık (AB) */
    gunes(D, egiklik) {
      const g = ((357.529 + 0.98560028 * D) % 360 + 360) % 360;
      const q = ((280.459 + 0.98564736 * D) % 360 + 360) % 360;
      const L = ((q + 1.915 * sin(g) + 0.020 * sin(2 * g)) % 360 + 360) % 360;
      const e = egiklik == null ? 23.439 - 0.00000036 * D : egiklik;
      const dik = Math.asin(sin(e) * sin(L)) / DER;
      const R = 1.00014 - 0.01671 * cos(g) - 0.00014 * cos(2 * g);
      return { g, q, L, e, dik, R };
    },
    /* Öğle Güneşi'nin yüksekliği: h = 90° − |φ − δ| (Güneş meridyendeyken) */
    ogleYukseklik(enlem, dik) { return 90 - Math.abs(enlem - dik); },
    /* Gündüz süresi (saat): cos H₀ = (sin h₀ − sin φ sin δ) / (cos φ cos δ); h₀ = 0 geometrik (Güneş'in merkezi ufukta),
       h₀ = −0,833° kırılma (34′) ve Güneş'in yarıçapı (16′) payıyla */
    gunduz(enlem, dik, h0) {
      const c = (sin(h0 || 0) - sin(enlem) * sin(dik)) / (cos(enlem) * cos(dik));
      if (!(c > -1)) return 24;
      if (!(c < 1)) return 0;
      return 2 * Math.acos(c) / DER / 15;
    },
    /* Yatay 1 m²'ye düşen güç, Güneş tepedeyken düşenin kesri olarak: sin h (atmosfer yok sayıldı) */
    enerji(h) { return Math.max(0, sin(h)); },
    /* Saat açısı Hs (°, batıya artı) → ufuk koordinatları: yükseklik ve azimut (kuzeyden doğuya, °) */
    ufuk(enlem, dik, Hs) {
      const yuk = Math.asin(sin(enlem) * sin(dik) + cos(enlem) * cos(dik) * cos(Hs)) / DER;
      const az = Math.atan2(-cos(dik) * sin(Hs), sin(dik) * cos(enlem) - cos(dik) * sin(enlem) * cos(Hs)) / DER;
      return { yuk, az: (az + 360) % 360 };
    },
    /* 2026 takviminde ay (1–12) ve gün → yılın günü; tersi */
    yilinGunu(ay, gun) { return Math.round((Date.UTC(2026, ay - 1, gun) - Date.UTC(2026, 0, 1)) / 864e5) + 1; },
    tarih(n) { const d = new Date(Date.UTC(2026, 0, n)); return { ay: d.getUTCMonth() + 1, gun: d.getUTCDate() }; },
    /* Bir günün değerleri: dik açıklık İstanbul öğlesinde (saatUT) hesaplanır ve gün boyunca sabit sayılır */
    gunHesap(gun, enlem, egiklik, saatUT) {
      const s = H.gunes(H.D(gun, saatUT), egiklik);
      const h = H.ogleYukseklik(enlem, s.dik);
      return { dik: s.dik, L: s.L, R: s.R, ogle: h, gunduz: H.gunduz(enlem, s.dik, 0), gunduzK: H.gunduz(enlem, s.dik, -0.833), enerji: H.enerji(h) };
    }
  };
  (window.UraniaDeneyHesap3 = window.UraniaDeneyHesap3 || {}).mevsim = H;

  (window.UraniaDeneyEk = window.UraniaDeneyEk || {}).mevsim = function (kap, o) {
    const U = o.U, v = o.veri || {};
    const on = v.onAyarlar || [];
    const AU_KM = o.deger('au') / 1e3;
    const saatUT = 12 - v.istanbul.boylam / 15;            // İstanbul'da ortalama öğle (UT)
    const bugun = new Date();
    const gun0 = Math.min(365, H.yilinGunu(bugun.getMonth() + 1, bugun.getDate()));
    const gp = H.gunes(H.D(v.gunberi.gun, v.gunberi.saat_ut));   // günberi anında Güneş'in boylamı (yörüngede işaret için)
    const link = ls => ls.filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ');

    kap.innerHTML = `
      <div class="cip-grup" id="msOn">${on.map((x, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(x.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="msKanvas"></canvas></div>
      <div class="kontroller">
        ${o.kaydirici('msGun', 'Tarih (2026)', 1, 365, 1, gun0)}
        ${o.kaydirici('msEnlem', 'Enlem (kuzey artı, güney eksi)', -90, 90, 0.01, v.istanbul.enlem)}
        ${o.kaydirici('msEgik', 'Eksen eğikliği', 0, 40, 0.01, v.egiklik.deger)}
      </div>
      ${o.olcumler([['msYuk', 'Öğle Güneşi\'nin yüksekliği'], ['msGunduz', 'Gündüz (Güneş\'in merkezi ufkun üstünde)'], ['msGunduzK', 'Gündüz (kırılma ve disk payıyla)'], ['msDik', 'Güneş\'in dik açıklığı'], ['msEnerji', 'Öğlede 1 m² yere düşen güç (Güneş tepedeyken = %100)']])}
      <div class="deney-metin" id="msMetin"></div>
      <p class="kaynak">Güneş'in konumu USNO'nun yaklaşık formülleriyle hesaplandı (2000 yılından iki yüzyıl içinde yaklaşık 1 yay dakikası doğru); dik açıklık o günün İstanbul öğlesinde (${U.sayi(saatUT, 2)} UT) alınır ve gün boyunca sabit sayılır. Gündüz süresi gün doğumu denklemiyle: cos H₀ = −tan φ · tan δ (Güneş'in merkezi ufukta); ikinci kutuda Güneş'in merkezi ufkun 0,833° altına inince doğmuş ya da batmış sayılır. Güç yalnız geometriden (sin h): hava, bulut ve atmosferin soğurması yok sayıldı. Çizim ölçekli değildir. Kaynaklar: ${link(v.kaynaklar || [])}</p>`;

    const cv = kap.querySelector('#msKanvas');
    const gS = kap.querySelector('#msGun'), eS = kap.querySelector('#msEnlem'), tS = kap.querySelector('#msEgik');
    const S = id => kap.querySelector('#' + id);
    let st = {};

    function sure(sa) {
      if (sa >= 24) return '24 sa (Güneş batmıyor)';
      if (sa <= 0) return '0 (Güneş doğmuyor)';
      let dk = Math.round(sa * 60);
      if (dk >= 1440) dk = 1439;
      if (dk <= 0) dk = 1;
      return Math.floor(dk / 60) + ' sa ' + (dk % 60) + ' dk';
    }
    function isaretli(x, b) { return (x > 0 ? '+' : x < 0 ? '−' : '') + U.sayi(Math.abs(x), b); }
    function enlemYaz(f) { return U.sayi(Math.abs(f), 2) + '° ' + (f > 0 ? 'K' : f < 0 ? 'G' : ''); }

    function hesapla() {
      const gun = Number(gS.value), enlem = Number(eS.value), egik = Number(tS.value);
      const r = H.gunHesap(gun, enlem, egik, saatUT);
      const t = H.tarih(gun);
      st = Object.assign({ gun, enlem, egik, t }, r);
      const ad = t.gun + ' ' + AY[t.ay - 1];
      S('msGunCikti').textContent = ad;
      S('msEnlemCikti').textContent = enlemYaz(enlem).trim();
      S('msEgikCikti').textContent = U.sayi(egik, 2) + '°';
      const yon = Math.abs(enlem - r.dik) < 0.05 ? 'tam tepede' : (r.dik < enlem ? 'güneyde' : 'kuzeyde');
      S('msYuk').textContent = r.ogle > 0 ? U.sayi(r.ogle, 1) + '° (' + yon + ')' : 'ufkun altında (' + isaretli(r.ogle, 1) + '°)';
      S('msGunduz').textContent = sure(r.gunduz);
      S('msGunduzK').textContent = sure(r.gunduzK);
      S('msDik').textContent = isaretli(r.dik, 2) + '°';
      S('msEnerji').textContent = '%' + U.sayi(r.enerji * 100, 0);
      metin(ad);
      ciz();
    }

    function metin(ad) {
      const r = st;
      const yari = r.dik > 0.05 ? 'kuzey yarım küre Güneş\'e doğru eğik' : r.dik < -0.05 ? 'güney yarım küre Güneş\'e doğru eğik' : 'iki yarım küre de Güneş\'e eşit uzaklıkta';
      const km = r.R * AU_KM / 1e6;
      const fark = (r.gunduzK - r.gunduz) * 60;
      const p = [];
      if (r.egik < 0.005) {
        p.push(`<p>Eksen eğik değil: Güneş bütün yıl gök ekvatorunun üstünde kalır (dik açıklık hep 0°). ${enlemYaz(r.enlem)} enleminde öğle Güneşi her gün aynı yüksekliğe çıkar ve her yerde gündüz 12 saat sürer. Yaz ile kış arasında bir fark kalmaz: mevsimler yok olur. Uzaklık yine yıl içinde %3,4 değişir ama bu tek başına mevsim yaratmaz.</p>`);
      } else {
        p.push(`<p>${ad}: Güneş'in dik açıklığı ${isaretli(r.dik, 2)}°, yani ${yari}. Eksen uzayda hep aynı yöne bakar; Dünya Güneş'in çevresinde dolanırken önce kuzey, sonra güney yarım küre Güneş'e döner. Güneş yüksekteyken ışık yere dik gelir ve bir metrekareye daha çok güç düşer (şu an: tepedeki Güneş'e göre %${U.sayi(r.enerji * 100, 0)}); üstelik gündüz uzun sürer. İkisi birlikte yazı getirir.</p>`);
      }
      p.push(`<p>Bu tarihte Dünya Güneş'ten yaklaşık ${U.sayi(km, 1)} milyon km uzakta. Güneş'e en çok ${U.kacis(v.gunberi.tarih_metin)} yaklaştı: ${U.sayi(v.gunberi.km / 1e6, 2)} milyon km. En uzak olacağı an ${U.kacis(v.gunote.tarih_metin)}: ${U.sayi(v.gunote.km / 1e6, 2)} milyon km. Yani Dünya, kuzey yarım kürede kış yaşanırken Güneş'e en yakındır. Uzaklık yalnız %${U.sayi((v.gunote.km / v.gunberi.km - 1) * 100, 1)} değişir, gelen ışık yaklaşık %${U.sayi((Math.pow(v.gunote.km / v.gunberi.km, 2) - 1) * 100, 0)}: mevsimleri uzaklık değil eksenin eğikliği belirler.</p>`);
      if (r.gunduz > 0 && r.gunduz < 24 && r.gunduzK < 24) {
        p.push(`<p>Birinci gündüz kutusu Güneş'in merkezinin ufka değdiği anları sayar. Gerçekte hava ışığı ufukta yaklaşık 34 yay dakikası büker ve Güneş'in görünen yarıçapı yaklaşık 16 yay dakikadır (yay dakikası: derecenin 60'ta biri); takvimler doğuşu Güneş'in üst kenarı göründüğünde sayar. Bu iki pay bu enlemde ve tarihte gündüzü yaklaşık ${U.sayi(fark, 0)} dakika uzatır (ikinci kutu).</p>`);
      } else if (r.gunduz >= 24 || r.gunduzK >= 24) {
        p.push(`<p>Bu enlemde bu tarihte Güneş ${r.gunduz >= 24 ? 'gece yarısı da ufkun üstünde kalır' : 'merkezi gece yarısı ufka değecek kadar iner ama kırılma ve disk payıyla hiç batmaz'}: gece yarısı Güneşi. Kutup dairesi (${U.sayi(v.kutupDairesi.deger, 2)}°) bunun en az bir gün olduğu sınırdır; enlemi 90° − eğiklik.</p>`);
      } else {
        p.push(`<p>Bu enlemde bu tarihte Güneş ${r.gunduzK > 0 ? 'merkeziyle hiç doğmaz; yalnız kırılma ve disk payıyla kısa süre ufkun üstünde görünür' : 'hiç doğmaz: kutup gecesi'}.</p>`);
      }
      S('msMetin').innerHTML = p.join('');
    }

    /* ---------- çizim ---------- */
    function ciz() {
      const { ctx, w, h } = o.kanvas(cv, 0.8);
      ctx.clearRect(0, 0, w, h);
      const hA = Math.round(h * 0.44);
      yorungeCiz(ctx, w, hA);
      kureCiz(ctx, w, hA);
      ctx.strokeStyle = o.renk('--cizgi'); ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(8, hA + 3); ctx.lineTo(w - 8, hA + 3); ctx.stroke();
      gokCiz(ctx, w, hA + 6, h - hA - 6);
    }

    /* Üst sol: yörünge, eğik bakış. Haziran gündönümünde Dünya solda, Aralık'ta sağda; eksen hep sağa yatık. */
    function yorungeCiz(ctx, w, hA) {
      const wA = w * 0.56;
      const ox = wA / 2 + 4, oy = hA / 2 + 6, rx = wA / 2 - 34, ry = Math.min(rx * 0.42, hA / 2 - 22);
      const nokta = L => { const th = (L + 90) * DER; return [ox + rx * Math.cos(th), oy - ry * Math.sin(th)]; };
      ctx.setLineDash([]);
      ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(ox, oy, rx, ry, 0, 0, IKI_PI); ctx.stroke();
      /* Güneş */
      ctx.beginPath(); ctx.arc(ox, oy, 7, 0, IKI_PI); ctx.fillStyle = '#FFD27A'; ctx.fill();
      /* ay adları (gündönümleri ve ekinokslar) */
      ctx.font = '500 11px Plex, sans-serif'; ctx.fillStyle = o.renk('--soluk');
      /* Dünya bir adın yanındayken (±25°) o ad yazılmaz: Dünya'nın ekseni yazının üstüne binmesin */
      const yakin = Lx => Math.abs(((st.L - Lx) % 360 + 540) % 360 - 180) < 25;
      if (!yakin(90)) { ctx.textAlign = 'right'; o.etiket(ctx, 'Haz', ox - rx - 6, oy + 4); }
      if (!yakin(270)) { ctx.textAlign = 'left'; o.etiket(ctx, 'Ara', ox + rx + 6, oy + 4); }
      ctx.textAlign = 'center';
      if (!yakin(0)) o.etiket(ctx, 'Mar', ox, oy - ry - 7);
      if (!yakin(180)) o.etiket(ctx, 'Eyl', ox, oy + ry + 15);
      /* günberi işareti */
      const [px, py] = nokta(gp.L);
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, IKI_PI); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(9, 9, 3.5, 0, IKI_PI); ctx.stroke();
      ctx.textAlign = 'left'; ctx.fillStyle = o.renk('--soluk'); o.etiket(ctx, 'günberi', 17, 13);
      /* Dünya ve ekseni */
      const [ex, ey] = nokta(st.L);
      ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,210,122,.45)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
      const ek = 12, ax = Math.sin(st.egik * DER) * ek, ay = Math.cos(st.egik * DER) * ek;
      ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(ex - ax, ey + ay); ctx.lineTo(ex + ax, ey - ay); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 5.5, 0, IKI_PI); ctx.fillStyle = '#2C5A7A'; ctx.fill();
      ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(ex + ax, ey - ay, 2, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
    }

    /* Üst sağ: Dünya, Güneş–Dünya çizgisine dik bakışla (Güneş solda). Eksen ile Güneş yönü çizim düzleminde:
       eksen dikeyden Güneş'e doğru tam dik açıklık (δ) kadar yatık görünür; enlem çemberleri yandan düz çizgidir. */
    function kureCiz(ctx, w, hA) {
      const x0 = w * 0.58;
      const R = Math.max(16, Math.min((w - x0) / 2 - 14, hA / 2 - 18));
      const gx = (x0 + w) / 2 + 8, gy = hA / 2 + 2;
      const d = st.dik, f = st.enlem;
      /* ışınlar */
      ctx.strokeStyle = 'rgba(255,210,122,.75)'; ctx.fillStyle = 'rgba(255,210,122,.75)'; ctx.lineWidth = 1.2; ctx.setLineDash([]);
      [-0.62, 0, 0.62].forEach(k => {
        const y = gy + k * R, xs = gx - Math.sqrt(R * R - k * k * R * R) - 4, xb = x0 + 2;
        if (xs - xb < 10) return;
        ctx.beginPath(); ctx.moveTo(xb, y); ctx.lineTo(xs, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(xs + 1, y); ctx.lineTo(xs - 5, y - 3.5); ctx.lineTo(xs - 5, y + 3.5); ctx.closePath(); ctx.fill();
      });
      /* gece ve gündüz yarıları */
      ctx.beginPath(); ctx.arc(gx, gy, R, 0, IKI_PI); ctx.fillStyle = '#13233A'; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(gx, gy, R, 0, IKI_PI); ctx.clip();
      ctx.fillStyle = '#4F7FA0'; ctx.fillRect(gx - R, gy - R, R, 2 * R); ctx.restore();
      ctx.beginPath(); ctx.arc(gx, gy, R, 0, IKI_PI); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1; ctx.stroke();
      /* ekvator: u = (−cos δ, −sin δ) yönünde (x sağa, y yukarı) */
      const P = (x, y) => [gx + x * R, gy - y * R];
      const cizgi = (a, b) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
      ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1;
      cizgi(P(-cos(d), -sin(d)), P(cos(d), sin(d)));
      /* senin enlemin: merkezi sin φ·a, a = (−sin δ, cos δ) */
      const cx0 = -sin(f) * sin(d), cy0 = sin(f) * cos(d);
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.6;
      cizgi(P(cx0 - cos(f) * cos(d), cy0 - cos(f) * sin(d)), P(cx0 + cos(f) * cos(d), cy0 + cos(f) * sin(d)));
      ctx.restore();
      /* eksen */
      ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.6;
      const kuz = P(-1.22 * sin(d), 1.22 * cos(d)), gun = P(1.22 * sin(d), -1.22 * cos(d));
      cizgi(gun, kuz);
      ctx.font = '600 11px Plex, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = o.renk('--parsomen');
      const kE = P(-1.22 * sin(d) - 0.0, 1.22 * cos(d));
      o.etiket(ctx, 'K', kE[0] + (d >= 0 ? -8 : 8), Math.max(11, kE[1] + 4));
      /* Güneş'in tepede olduğu nokta (δ enleminde, en sol) */
      ctx.beginPath(); ctx.arc(gx - R, gy, 4, 0, IKI_PI); ctx.strokeStyle = '#FFD27A'; ctx.lineWidth = 1.6; ctx.stroke();
      /* sen, öğle anında: (−cos(φ−δ), sin(φ−δ)) */
      const sn = P(-cos(f - d), sin(f - d));
      ctx.beginPath(); ctx.arc(sn[0], sn[1], 4, 0, IKI_PI); ctx.fillStyle = o.renk('--pirinc'); ctx.fill();
      ctx.strokeStyle = '#0A1422'; ctx.lineWidth = 1; ctx.stroke();
    }

    /* Alt: gökyüzü, güneye bakarken; yukarıdan eğik görülen ufuk ve Güneş'in günlük yolu */
    function gokCiz(ctx, w, y0, hB) {
      const e = 24 * DER;
      const R = Math.max(30, Math.min(w / 2 - 48, (hB - 52) / (Math.cos(e) + Math.sin(e))));
      const cx = w / 2, cy = y0 + 30 + R * Math.cos(e);
      const P = (yuk, az) => {
        const xd = cos(yuk) * sin(az), yk = cos(yuk) * cos(az), z = sin(yuk);
        return [cx - xd * R, cy - (z * Math.cos(e) - yk * Math.sin(e)) * R];
      };
      /* ufuk (yer) */
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.ellipse(cx, cy, R, R * Math.sin(e), 0, 0, IKI_PI);
      ctx.fillStyle = 'rgba(150,160,178,.10)'; ctx.fill();
      ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1; ctx.stroke();
      /* Güneş'in günlük yolu: ufkun üstü kalın, altı kesik */
      const ls = [];
      for (let k = -180; k <= 180; k += 1.5) { const u = H.ufuk(st.enlem, st.dik, k); ls.push({ u, p: P(u.yuk, u.az) }); }
      for (const ust of [false, true]) {
        ctx.beginPath(); let acik = false;
        ls.forEach(({ u, p }) => {
          if ((u.yuk >= 0) === ust) { if (acik) ctx.lineTo(p[0], p[1]); else { ctx.moveTo(p[0], p[1]); acik = true; } } else acik = false;
        });
        if (ust) { ctx.setLineDash([]); ctx.strokeStyle = '#F2C879'; ctx.lineWidth = 2.6; }
        else { ctx.setLineDash([3, 4]); ctx.strokeStyle = o.renk('--soluk'); ctx.lineWidth = 1; }
        ctx.stroke();
      }
      ctx.setLineDash([]);
      /* doğuş ve batış noktaları */
      if (st.gunduz > 0 && st.gunduz < 24) {
        const H0 = st.gunduz * 7.5;
        [-H0, H0].forEach(k => {
          const u = H.ufuk(st.enlem, st.dik, k), p = P(0, u.az);
          ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, IKI_PI); ctx.strokeStyle = o.renk('--parsomen'); ctx.lineWidth = 1.4; ctx.stroke();
        });
      }
      /* yönler */
      ctx.font = '500 12px Plex, sans-serif'; ctx.fillStyle = o.renk('--soluk');
      ctx.textAlign = 'right'; o.etiket(ctx, 'doğu', cx - R - 9, cy + 4);
      ctx.textAlign = 'left'; o.etiket(ctx, 'batı', cx + R + 9, cy + 4);
      ctx.textAlign = 'center'; o.etiket(ctx, 'kuzey', cx, cy + R * Math.sin(e) + 19);
      /* sen */
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, IKI_PI); ctx.fillStyle = o.renk('--parsomen'); ctx.fill();
      o.etiket(ctx, 'sen', cx, cy + 15);
      /* öğle Güneşi: azimut 180° (güney) ya da 0° (kuzey) */
      const azO = st.dik <= st.enlem ? 180 : 0;
      const pO = P(st.ogle, azO), pY = P(0, azO);
      ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = o.renk('--pirinc'); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(pO[0], pO[1]); ctx.lineTo(pY[0], pY[1]); ctx.stroke(); ctx.restore();
      ctx.beginPath(); ctx.arc(pO[0], pO[1], 5.5, 0, IKI_PI); ctx.fillStyle = '#FFD27A'; ctx.fill();
      ctx.strokeStyle = '#0A1422'; ctx.lineWidth = 1; ctx.stroke();
      if (azO === 180) { ctx.textAlign = 'left'; ctx.fillStyle = o.renk('--soluk'); o.etiket(ctx, 'güney', pY[0] + 6, pY[1] + 13); }
      ctx.fillStyle = o.renk('--parsomen'); ctx.font = '600 12px Plex, sans-serif';
      const yazi = 'öğle ' + U.sayi(st.ogle, 1) + '°';
      const yw = ctx.measureText(yazi).width;
      ctx.textAlign = 'center';
      o.etiket(ctx, yazi, Math.min(w - yw / 2 - 4, Math.max(yw / 2 + 4, pO[0])), Math.max(y0 + 14, pO[1] - 11));
    }

    gS.addEventListener('input', hesapla); eS.addEventListener('input', hesapla); tS.addEventListener('input', hesapla);
    kap.querySelector('#msOn').addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      const x = on[Number(b.dataset.i)]; if (!x) return;
      gS.value = x.gun; eS.value = x.enlem; tS.value = x.egiklik; hesapla();
    });
    window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);
    hesapla();
    return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
  };
})();
