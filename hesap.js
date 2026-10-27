/* hesap.js — "Hesap" bölümü: astrofizik hesap araçları. Sabitler veri/fizik.json'dan. */
(function () {
  'use strict';
  const U = window.Urania;
  let F = null, el = null;

  function d(k) { return F.sabitler[k].deger; }
  /* Sayı okuma: ondalık için virgül ya da nokta; 1e9 gibi bilimsel yazım. "1.000" gibi binlik ayırıcı belirsizdir:
     sayı 1 okunur ama sonuçta uyarı çıkar. Sonsuz ve onaltılık (0x10) yazımlar reddedilir. */
  let belirsiz = new Set();
  const SAYI = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  function oku(id) {
    const ham = el.querySelector('#' + id).value.trim().replace(/\s/g, '').replace(/−/g, '-');
    if (ham === '') return NaN;
    if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(ham)) belirsiz.add(ham);
    const v = ham.replace(',', '.');
    if (!SAYI.test(v)) return NaN;
    const x = Number(v);
    return isFinite(x) ? x : NaN;
  }
  const eksi = x => (x < 0 && Math.abs(x) >= 0.005 ? '−' : '') + U.sayi(Math.abs(x), 2);
  /* eksiOlur: iOS'ta "decimal" klavyesinde eksi tuşu yok; eksi değer alabilen alanlar düz metin klavyesi açar */
  function giris(id, etiket, deger, eksiOlur) {
    return `<div class="alan"><label for="${id}">${etiket}</label><input id="${id}" inputmode="${eksiOlur ? 'text' : 'decimal'}" value="${deger}" autocomplete="off"></div>`;
  }
  function secim(id, etiket, secenekler, secili) {
    return `<div class="alan"><label for="${id}">${etiket}</label><select id="${id}">${secenekler.map(([v, a]) => `<option value="${v}"${v === secili ? ' selected' : ''}>${a}</option>`).join('')}</select></div>`;
  }
  function sonuc(id) { return `<div class="sonuc" id="${id}" aria-live="polite"></div>`; }
  function hata(m) { return `<span class="ek" style="color:var(--uyari)">${m}</span>`; }

  /* Uzunluk birimleri (metre) */
  function birimler() {
    return {
      km: { ad: 'km', m: 1e3 },
      au: { ad: 'AB (astronomik birim)', m: d('au') },
      ly: { ad: 'ışık yılı', m: d('ly') },
      pc: { ad: 'parsek', m: d('pc') }
    };
  }
  function kutleBirim() {
    return { kg: 1, dunya: d('M_dunya'), gunes: d('M_gunes') };
  }

  const KARTLAR = [
    {
      id: 'uzaklik', baslik: 'Uzaklık çevirici',
      aciklama: 'Kilometre, astronomik birim, ışık yılı ve parsek arasında çevir; ışığın o yolu ne kadar sürede aldığını gör.',
      html: () => `<div class="hesap-ızgara">${giris('uzD', 'Değer', '1')}${secim('uzB', 'Birim', [['km', 'km'], ['au', 'AB'], ['ly', 'ışık yılı'], ['pc', 'parsek']], 'pc')}</div>${sonuc('uzS')}`,
      hesap() {
        const v = oku('uzD'), B = birimler(), b = el.querySelector('#uzB').value;
        if (!(v > 0)) return hata('Pozitif bir sayı yaz.');
        const m = v * B[b].m;
        const isik = m / d('c');
        return `<b>${U.bilimsel(m / 1e3, 4)} km</b><span class="ek">= ${U.bilimsel(m / B.au.m, 4)} AB = ${U.bilimsel(m / B.ly.m, 4)} ışık yılı = ${U.bilimsel(m / B.pc.m, 4)} parsek</span><span class="ek">Işık bu yolu ${sure(isik)} alır.</span>`;
      },
      formul: '1 parsek = 648 000/π AB; 1 ışık yılı = c × 365,25 gün', kaynak: ['au', 'pc', 'ly', 'c']
    },
    {
      id: 'kurtulma', baslik: 'Kurtulma hızı ve yüzey çekimi',
      aciklama: 'Bir gök cisminin yüzeyinden, itki olmadan kurtulmak için gereken hız ve orada ne kadar ağır olacağın.',
      html: () => `<div class="hesap-ızgara">${secim('kuC', 'Cisim', F.gezegenler.map(g => [g.ad, g.ad]).concat([['ozel', 'Kendi değerlerim']]), 'Dünya')}</div>
        <div class="hesap-ızgara" id="kuOzel" hidden>${giris('kuM', 'Kütle (Dünya = 1)', '1')}${giris('kuR', 'Yarıçap (km)', '6371')}</div>${sonuc('kuS')}`,
      hesap() {
        const sec = el.querySelector('#kuC').value;
        el.querySelector('#kuOzel').hidden = sec !== 'ozel';
        let M, R, ref = null;
        if (sec === 'ozel') {
          M = oku('kuM') * d('M_dunya'); R = oku('kuR') * 1e3;
          if (!(M > 0 && R > 0)) return hata('Kütle ve yarıçap pozitif olmalı.');
        } else {
          const g = F.gezegenler.find(x => x.ad === sec);
          M = g.kutle_kg; R = g.yaricap_km * 1e3; ref = g;
        }
        const v = Math.sqrt(2 * d('G') * M / R), gy = d('G') * M / (R * R);
        const kilo = gy / d('g0');
        const rs = 2 * d('G') * M / (d('c') * d('c'));
        if (R <= rs) return `<b>Kara delik</b><span class="ek">Bu kütle bu yarıçapın içinde kalıyor (Schwarzschild yarıçapı ${U.bilimsel(rs / 1e3, 3)} km): yüzeyden kurtulmak için ışıktan hızlı gitmek gerekirdi, yani kurtulma yok.</span>`;
        return `<b>${U.bilimsel(v / 1e3, 4)} km/s</b> kurtulma hızı<span class="ek">Yüzey çekimi ${U.bilimsel(gy, 3)} m/s² — Dünya'da 70 kg gelen biri burada ${U.bilimsel(70 * kilo, 3)} kg gelir.</span>${ref && ref.kurtulma_kms ? `<span class="ek">Karşılaştırma: NASA tablosundaki kurtulma hızı ${U.sayi(ref.kurtulma_kms, 2)} km/s. NASA ekvator yarıçapını kullanır, burada ortalama yarıçap kullanıldı; basık dev gezegenlerde küçük fark bundandır.</span>` : ''}`;
      },
      formul: 'v = √(2GM/R), g = GM/R²', kaynak: ['G', 'M_dunya', 'g0'], ekKaynak: () => F.gezegenKaynak
    },
    {
      id: 'schwarzschild', baslik: 'Schwarzschild yarıçapı',
      aciklama: 'Bir kütleyi kara deliğe çevirmek için sıkıştırman gereken yarıçap.',
      html: () => `<div class="hesap-ızgara">${giris('swM', 'Kütle', '1')}${secim('swB', 'Birim', [['kg', 'kg'], ['dunya', 'Dünya kütlesi'], ['gunes', 'Güneş kütlesi']], 'dunya')}</div>${sonuc('swS')}`,
      hesap() {
        const M = oku('swM') * kutleBirim()[el.querySelector('#swB').value];
        if (!(M > 0)) return hata('Pozitif bir kütle yaz.');
        const rs = 2 * d('G') * M / (d('c') * d('c'));
        let s;
        if (rs < 1e-3) s = U.bilimsel(rs * 1e3, 3) + ' mm';
        else if (rs < 1) s = U.sayi(rs * 1e3, 2) + ' mm';
        else if (rs < 1e3) s = U.sayi(rs, 2) + ' m';
        else s = U.bilimsel(rs / 1e3, 4) + ' km';
        return `<b>${s}</b><span class="ek">Bu kütle bu yarıçapın içine sığdırılırsa ışık bile kaçamaz.</span>`;
      },
      formul: 'Rs = 2GM/c²', kaynak: ['G', 'c', 'M_dunya', 'M_gunes']
    },
    {
      id: 'kepler', baslik: 'Yörünge süresi (Kepler III)',
      aciklama: 'Bir cismin, merkezdeki kütlenin çevresinde verilen büyüklükteki yörüngeyi kaç günde/yılda tamamladığı.',
      html: () => `<div class="hesap-ızgara">${giris('hkA', 'Yarı büyük eksen (AB)', '5')}${giris('hkM', 'Merkez kütle (Güneş = 1)', '1')}</div>${sonuc('hkS')}`,
      hesap() {
        const a = oku('hkA') * d('au'), M = oku('hkM') * d('M_gunes');
        if (!(a > 0 && M > 0)) return hata('İki değer de pozitif olmalı.');
        const T = 2 * Math.PI * Math.sqrt(a * a * a / (d('G') * M));
        const v = 2 * Math.PI * a / T;
        const gunEk = T >= 365.25 * 86400 && T < 1000 * 365.25 * 86400 ? ` (${U.sayi(T / 86400, 1)} gün)` : '';
        return `<b>${sure(T)}${gunEk}</b><span class="ek">Ortalama yörünge hızı ${U.sayi(v / 1e3, 2)} km/s (dairesel yaklaşımla).</span>`;
      },
      formul: 'T = 2π √(a³ / GM)', kaynak: ['G', 'au', 'M_gunes']
    },
    {
      id: 'kadir', baslik: 'Görünür ve mutlak kadir',
      aciklama: 'Görünür kadir (m) ile uzaklıktan mutlak kadiri (M) bul: yıldız 10 parsek uzakta olsaydı ne kadar parlak görünürdü?',
      html: () => `<div class="hesap-ızgara">${giris('mgM', 'Görünür kadir m', '1', true)}${giris('mgD', 'Uzaklık (parsek)', '25')}</div>${sonuc('mgS')}`,
      hesap() {
        const m = oku('mgM'), dp = oku('mgD');
        if (isNaN(m) || !(dp > 0)) return hata('Kadir bir sayı, uzaklık pozitif olmalı.');
        const M = m - 5 * Math.log10(dp / 10);
        const L = Math.pow(10, 0.4 * (d('MV_gunes') - M));
        return `<b>M = ${U.kadir(M)}</b><span class="ek">Uzaklık modülü m − M = ${eksi(m - M)}.</span><span class="ek">Görsel (V) bantta Güneş'in yaklaşık ${U.bilimsel(L, 2)} katı parlak (Güneş'in mutlak V kadiri ${U.sayi(d('MV_gunes'), 2)} alınarak).</span>`;
      },
      formul: 'M = m − 5 log₁₀(d / 10 pc)', kaynak: ['MV_gunes']
    },
    {
      id: 'parlaklik', baslik: 'İki kadir arası parlaklık oranı',
      aciklama: 'Kadir ölçeği tersine ve logaritmik: 5 kadir fark tam 100 kat parlaklık demek.',
      html: () => `<div class="hesap-ızgara">${giris('poA', 'Parlak cismin kadiri', '-4', true)}${giris('poB', 'Sönük cismin kadiri', '6', true)}</div>${sonuc('poS')}`,
      hesap() {
        const a = oku('poA'), b = oku('poB');
        if (isNaN(a) || isNaN(b)) return hata('İki kadir de sayı olmalı.');
        const oran = Math.pow(10, 0.4 * Math.abs(b - a));
        if (!isFinite(oran)) return hata('Fark çok büyük: hesaplanamıyor.');
        return `<b>${U.bilimsel(oran, 3)} kat</b><span class="ek">${U.sayi(Math.abs(b - a), 2)} kadir fark.</span>`;
      },
      formul: 'oran = 10^(0,4 × Δm) = 100^(Δm/5)', kaynak: []
    },
    {
      id: 'iraklik', baslik: 'Iraklık açısından uzaklık',
      aciklama: 'Dünya Güneş\'in çevresinde dolanırken yakın bir yıldızın arka plana göre yaptığı küçük kayma.',
      html: () => `<div class="hesap-ızgara">${giris('paP', 'Iraklık açısı', '100')}${secim('paB', 'Birim', [['mas', 'miliyay saniyesi (mas)'], ['as', 'yay saniyesi (″)']], 'mas')}</div>${sonuc('paS')}`,
      hesap() {
        let p = oku('paP');
        if (!(p > 0)) return hata('Pozitif bir açı yaz.');
        if (el.querySelector('#paB').value === 'mas') p /= 1000;
        const dp = 1 / p;
        return `<b>${U.sayi(dp, dp < 10 ? 3 : 1)} parsek</b><span class="ek">= ${U.sayi(dp * d('pc') / d('ly'), 2)} ışık yılı</span>`;
      },
      formul: 'd (parsek) = 1 / p (yay saniyesi)', kaynak: ['pc', 'ly']
    },
    {
      id: 'wien', baslik: 'Wien yasası: renk ve sıcaklık',
      aciklama: 'Bir cisim en çok hangi dalga boyunda ışır? Sıcaklığı yükseldikçe tepe maviye kayar.',
      html: () => `<div class="hesap-ızgara">${giris('wiT', 'Sıcaklık (K)', '5772')}</div>${sonuc('wiS')}`,
      hesap() {
        const T = oku('wiT');
        if (!(T > 0)) return hata('Pozitif bir sıcaklık yaz.');
        const l = d('b_wien') / T * 1e9;
        let bolge = 'kızılötesi';                 // sınırlar yuvarlanmamış değerle karşılaştırılır
        if (l < 10) bolge = 'X ışını';
        else if (l < 380) bolge = 'morötesi';
        else if (l <= 750) bolge = 'görünür ışık';
        else if (l > 1e6) bolge = 'mikrodalga / radyo';
        const yaz = l >= 1e4 ? U.bilimsel(l / 1e3, 3) + ' µm' : (l < 1 ? U.bilimsel(l * 1e3, 3) + ' pm' : U.sayi(l, l < 100 ? 2 : 0) + ' nm');
        return `<b>${yaz}</b><span class="ek">Tepe ${bolge} bölgesinde.</span>`;
      },
      formul: 'λmaks = b / T', kaynak: ['b_wien']
    },
    {
      id: 'stefan', baslik: 'Yıldızın ışıma gücü',
      aciklama: 'Yarıçap ve yüzey sıcaklığından toplam ışıma gücü (Stefan-Boltzmann).',
      html: () => `<div class="hesap-ızgara">${giris('sbR', 'Yarıçap (Güneş = 1)', '2')}${giris('sbT', 'Sıcaklık (K)', '9000')}</div>${sonuc('sbS')}`,
      hesap() {
        const R = oku('sbR') * d('R_gunes'), T = oku('sbT');
        if (!(R > 0 && T > 0)) return hata('İki değer de pozitif olmalı.');
        const L = 4 * Math.PI * R * R * d('sigma') * Math.pow(T, 4);
        return `<b>${U.bilimsel(L / d('L_gunes'), 3)} L☉</b><span class="ek">${U.bilimsel(L, 3)} W</span>`;
      },
      formul: 'L = 4πR²σT⁴', kaynak: ['sigma', 'R_gunes', 'L_gunes']
    }
  ];

  function sure(s) {
    const yil = 365.25 * 86400;
    if (s < 1e-3) return U.bilimsel(s * 1e6, 3) + ' mikrosaniye';
    if (s < 1) return U.sayi(s * 1000, 1) + ' milisaniye';
    if (s < 120) return U.sayi(s, 1) + ' saniye';
    if (s < 7200) return U.sayi(s / 60, 1) + ' dakika';
    if (s < 3 * 86400) return U.sayi(s / 3600, 2) + ' saat';
    if (s < yil) return U.sayi(s / 86400, 1) + ' gün';
    return U.bilimsel(s / yil, 4) + ' yıl';
  }

  function kaynakHtml(k) {
    const ls = [];
    const gor = new Set();
    (k.kaynak || []).forEach(a => {
      const s = F.sabitler[a];
      if (s && !gor.has(s.url)) { gor.add(s.url); ls.push(`<a href="${U.guvenliUrl(s.url)}" target="_blank" rel="noopener">${U.kacis(s.kaynak)}</a>`); }
    });
    if (k.ekKaynak) { const e = k.ekKaynak(); ls.push(`<a href="${U.guvenliUrl(e.url)}" target="_blank" rel="noopener">${U.kacis(e.ad)}</a>`); }
    return ls.length ? '<p class="kaynak">Sabitler: ' + ls.join(' · ') + '</p>' : '';
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Hesaplar hazırlanıyor…</p>';
    try { F = await U.veri('fizik'); } catch (e) {
      el.innerHTML = '<div class="hata-kutu">Fizik verisi yüklenemedi: ' + U.kacis(e.message) + '</div>'; return;
    }
    el.innerHTML = '<h1>Hesap</h1><p class="alt-baslik">Ondalık için virgül ya da nokta kullanabilirsin; çok büyük sayılar için 2e30 gibi yaz.</p>' +
      KARTLAR.map(k => `<section class="hesap-kart" id="hk-${k.id}"><h3>${k.baslik}</h3><p class="aciklama-k">${k.aciklama}</p>${k.html()}<p class="formul-k">${k.formul}</p>${kaynakHtml(k)}</section>`).join('');
    KARTLAR.forEach(k => {
      const kart = el.querySelector('#hk-' + k.id);
      const cikti = kart.querySelector('.sonuc');
      const yenile = () => {
        belirsiz = new Set();
        try { cikti.innerHTML = k.hesap(); } catch (e) { cikti.innerHTML = hata('Hesaplanamadı: ' + U.kacis(e.message)); }
        if (belirsiz.size) cikti.insertAdjacentHTML('beforeend', hata([...belirsiz].map(U.kacis).join(', ') + ' sayısını ondalık okudum (nokta ondalık ayırıcı). Bin demek istiyorsan noktasız yaz: 1000.'));
      };
      kart.addEventListener('input', yenile);
      kart.addEventListener('change', yenile);
      yenile();
    });
  }
  U.modul('hesap', { ilk });
})();
