/* gorevler.js — Gözlem görevleri (veri/gorevler.json): çıplak göz ve 7×50 dürbünle yapılabilecek gözlemler.
   Bir görev, defterde aynı anahtarla (hedef:, cisim:, meteor:, yildiz:, gorev:) kayıt olunca tamamlanmış sayılır.
   Görünürlük uygulamanın kendi hesabıdır: bu gece karanlıkta en çok kaç derece yükselir, yıl içinde hangi akşamlar iyi. */
(function () {
  'use strict';
  const U = window.Urania, G = window.Gok;
  const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const ARAC = { 'çıplak göz': 'çıplak göz', 'dürbün': '7×50 dürbün' };

  function tamam(g) { return window.Defter ? Defter.sonGorulme(g.anahtar) : null; }

  /* Görevin gökteki konumu: sabit (ra/dec) ya da Güneş Sistemi cismi */
  function konum(g, veri) {
    const [tur, ad] = g.anahtar.split(':');
    if (g.ra != null && g.dec != null) return { ra: g.ra, dec: g.dec };
    if (tur === 'hedef') { const h = veri.hedefler.find(x => x.id === ad); return h ? { ra: h.ra, dec: h.dec } : null; }
    if (tur === 'yildiz') {
      const i = Object.keys(veri.yildizlar.adlar).find(k => veri.yildizlar.adlar[k] === ad);
      return i != null ? { ra: veri.yildizlar.y[i][0], dec: veri.yildizlar.y[i][1] } : null;
    }
    if (tur === 'cisim') return { cisim: ad };
    if (g.cisim) return { cisim: g.cisim };
    return null;
  }

  /* Bu gece karanlıkta (gezegen ve Ay için alacakaranlıktan itibaren) en yüksek konum */
  function buGece(k, gzl, gece) {
    let bas = k.cisim ? (gece.sivilSon || gece.batis) : gece.karanlikBas;
    const son = k.cisim ? (gece.sivilBas || gece.dogus) : gece.karanlikSon;
    if (!bas || !son) return null;
    if (Date.now() > bas.getTime() && Date.now() < son.getTime()) bas = new Date();   // gece yarısından sonra bakana geçmiş saat gösterme
    let en = null;
    for (let t = bas.getTime(); t <= son.getTime(); t += 20 * 60e3) {
      const d = new Date(t);
      const p = k.cisim ? G.cisimAltAz(k.cisim, d, gzl) : G.sabitAltAz(k.ra, k.dec, d, gzl);
      if (!en || p.alt > en.alt) en = { alt: p.alt, az: p.az, zaman: d };
    }
    return en;
  }
  /* Sabit cisim: her ayın 15'inde yerel güneş saatiyle 21.00'de (İstanbul'da yaklaşık 22.00 TSİ) 35°'nin üstündeyse o ay "iyi" */
  function iyiAylar(k, gzl, yil) {
    if (k.cisim) return null;
    const ls = [];
    for (let a = 0; a < 12; a++) {
      const d = new Date(Date.UTC(yil, a, 15, 21, 0) - (gzl.longitude / 15) * 3600e3);   // yerel güneş saatiyle 21.00
      if (G.sabitAltAz(k.ra, k.dec, d, gzl).alt >= 35) ls.push(a);
    }
    return ls;
  }
  function ayAraligi(ls) {
    if (!ls || !ls.length) return '';
    if (ls.length === 12) return 'yıl boyu';
    /* ardışık ayları (Aralık→Ocak dahil) aralık olarak yaz */
    const v = new Set(ls);
    return [...v].filter(a => !v.has((a + 11) % 12)).sort((a, b) => a - b).map(s => {
      let e = s; while (v.has((e + 1) % 12)) e = (e + 1) % 12;
      return s === e ? AYLAR[s] : AYLAR[s] + '–' + AYLAR[e];
    }).join(', ');
  }

  function durumHesapla(veri, k) {
    const gzl = G.gozlemci(k.enlem, k.boylam, k.yukseklik || 0);
    const gece = G.geceAraligi(new Date(), gzl);
    const yil = new Date().getFullYear();
    return veri.gorevler.gorevler.map(g => {
      const kn = konum(g, veri);
      let tepe = null, aylar = null, meteor = null;
      try {
        if (kn) { tepe = buGece(kn, gzl, gece); aylar = iyiAylar(kn, gzl, yil); }
        if (g.anahtar.startsWith('meteor:')) {
          const kod = g.anahtar.slice(7);
          meteor = veri.meteor.yagmurlar.filter(m => m.kod === kod).map(m => new Date(m.zirve_utc)).filter(d => d > Date.now() - 3 * 86400e3).sort((a, b) => a - b)[0] || null;
        }
      } catch (e) { /* hesap yapılamazsa görev yine listelenir */ }
      /* meteor görevi yalnız zirveye ±3 gün kala "bu gece" sayılır */
      const meteorYakin = !!(meteor && Math.abs(meteor - Date.now()) <= 3 * 86400e3);
      return { g, tepe, aylar, meteor, meteorYakin, bitti: tamam(g) };
    });
  }

  const TUR_AD = { kume: 'kümeler', ay: 'Ay görevleri', gezegen: 'gezegenler', bulutsu: 'bulutsular', cift_yildiz: 'çift yıldızlar', uydu: 'uydu görevleri',
    meteor: 'meteor yağmurları', galaksi: 'galaksiler', yildiz: 'yıldızlar', asterizm: 'yıldız desenleri', ortme: 'örtmeler', yapay_uydu: 'yapay uydular', degisen_yildiz: 'değişen yıldızlar' };
  const ROZETLER = [
    { n: 1, ad: 'İlk adım' }, { n: 5, ad: 'Beş görev' }, { n: 10, ad: 'On görev' }, { n: 20, ad: 'Yirmi görev' }
  ];
  function rozetler(ls) {
    const sayi = ls.filter(x => x.bitti).length;
    const r = ROZETLER.filter(z => sayi >= z.n).map(z => z.ad);
    if (sayi === ls.length && ls.length) r.push('Hepsi');
    /* türe göre: bir türün bütün görevleri bittiyse */
    const turler = {};
    ls.forEach(x => { (turler[x.g.tur] = turler[x.g.tur] || []).push(x); });
    Object.keys(turler).forEach(t => { if (turler[t].length >= 3 && turler[t].every(x => x.bitti)) r.push('Bütün ' + (TUR_AD[t] || t)); });
    return r;
  }

  function ozet(veri) {
    if (!veri.gorevler) return null;
    const ls = veri.gorevler.gorevler;
    return { toplam: ls.length, biten: ls.filter(g => tamam(g)).length };
  }

  function satir(x, D) {
    const g = x.g;
    const t = x.tepe;
    const zor = Math.min(3, Math.max(1, Math.round(g.zorluk) || 1));
    let gor = '';
    if (x.meteor) gor = `zirve ${x.meteor.getFullYear() === new Date().getFullYear() ? U.gun(x.meteor) : U.tamTarih(x.meteor)}`;
    else if (t) gor = t.alt >= 20 ? `bu gece en çok ${U.derece(t.alt)}, ${U.saat(t.zaman)} civarı` : (t.alt > 0 ? `bu gece alçak (en çok ${U.derece(t.alt)})` : 'bu gece ufkun altında');
    const ay = x.aylar && x.aylar.length ? `akşam en iyi: ${ayAraligi(x.aylar)}` : (x.aylar ? 'akşamları hep alçak' : '');
    const d = g.ders && D ? D.find(z => z.id === g.ders) : null;
    const kaynak = (g.kaynak || []).filter(k => k && k.url);
    return `<li class="gorev${x.bitti ? ' bitti' : ''}">
      <details><summary><span class="ad">${x.bitti ? '<span class="rozet iyi">tamam</span> ' : ''}${U.kacis(g.ad)}</span>
        <span class="alt"><span role="img" aria-label="zorluk ${zor} / 3">${'●'.repeat(zor)}<span class="soluk">${'●'.repeat(3 - zor)}</span></span> · ${U.kacis(ARAC[g.arac] || g.arac || '')}${gor ? ' · ' + U.kacis(gor) : ''}${ay ? ' · ' + U.kacis(ay) : ''}</span></summary>
        <div class="gorev-ic">
          ${g.nasil ? `<p><b>Nasıl bulunur:</b> ${U.kacis(g.nasil)}</p>` : ''}
          ${g.ne_gorursun ? `<p><b>Ne görürsün:</b> ${U.kacis(g.ne_gorursun)}</p>` : ''}
          ${g.ipucu ? `<p class="kucuk soluk">${U.kacis(g.ipucu)}</p>` : ''}
          <p class="cip-grup">${x.bitti ? `<span class="kucuk soluk">Defterde: ${U.kacis(U.gun(new Date(x.bitti.zaman)))}</span>` : ''}<a class="dugme${x.bitti ? '' : ' dolu'}" href="#defter/yeni/${encodeURIComponent(g.anahtar)}">${x.bitti ? 'Yeniden gördüm' : 'Gördüm, deftere yaz'}</a>${d ? `<a class="dugme" href="#ders/${d.id}">Ders: ${U.kacis(d.baslik)}</a>` : ''}</p>
          ${kaynak.length ? `<p class="kaynak">Kaynak: ${kaynak.map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ')}</p>` : ''}
        </div></details></li>`;
  }

  async function ciz(el, veri) {
    el.innerHTML = '<p class="bos">Görevler hazırlanıyor…</p>';
    let D = null;
    try { D = (await U.veri('dersler')).dersler; } catch (e) { /* ders adları olmadan da çalışır */ }
    if (!/^#defter\/gorevler/.test(location.hash)) return;     // beklerken başka yere gidildi: defteri ezme
    if (!veri.gorevler) { el.innerHTML = '<a class="geri" href="#defter">Defter</a><div class="hata-kutu">Görev listesi yüklenemedi.</div>'; return; }
    const k = U.konum();
    const ls = durumHesapla(veri, k);
    const sayi = ls.filter(x => x.bitti).length;
    const buGeceMi = x => (x.tepe && x.tepe.alt >= 20 && !x.g.anahtar.startsWith('meteor:')) || x.meteorYakin;
    const sira = ls.slice().sort((a, b) => (!!a.bitti - !!b.bitti) || (buGeceMi(b) - buGeceMi(a)) || ((a.g.zorluk || 1) - (b.g.zorluk || 1)));
    const bugece = sira.filter(x => !x.bitti && buGeceMi(x));
    const diger = sira.filter(x => !x.bitti && !bugece.includes(x));
    const biten = sira.filter(x => x.bitti);
    const rz = rozetler(ls);
    el.innerHTML = `<a class="geri" href="#defter">Defter</a><h1>Gözlem görevleri</h1>
      <p class="alt-baslik">${ls.length} görevden ${sayi} tanesini yaptın. Gördüğünü deftere yazınca görev kendiliğinden tamamlanır. Konum: ${U.kacis(k.ad || '')}.</p>
      <div class="ilerleme" role="progressbar" aria-valuemin="0" aria-valuemax="${ls.length}" aria-valuenow="${sayi}" aria-label="Tamamlanan görevler"><span style="width:${ls.length ? Math.round(sayi / ls.length * 100) : 0}%"></span></div>
      ${rz.length ? `<p class="cip-grup rozetler">${rz.map(r => `<span class="rozet iyi">${U.kacis(r)}</span>`).join('')}</p>` : ''}
      <p class="kucuk soluk">● zorluk (bir nokta kolay, üç nokta zor). Yükseklikler bu geceki karanlık saatler içindir; şehir göğünde 20°'nin altı genelde puslu kalır.</p>
      ${bugece.length ? `<h2>Bu gece yapılabilir</h2><ul class="liste gorev-liste">${bugece.map(x => satir(x, D)).join('')}</ul>` : ''}
      ${diger.length ? `<h2>${bugece.length ? 'Diğerleri' : 'Görevler'}</h2><ul class="liste gorev-liste">${diger.map(x => satir(x, D)).join('')}</ul>` : ''}
      ${biten.length ? `<h2>Tamamlananlar</h2><ul class="liste gorev-liste">${biten.map(x => satir(x, D)).join('')}</ul>` : ''}
      ${veri.gorevler.aciklama ? `<p class="kaynak">${U.kacis(veri.gorevler.aciklama)}</p>` : ''}`;
    window.scrollTo(0, 0);
  }

  window.Gorevler = { ciz, ozet, ayAraligi, durumHesapla };
})();
