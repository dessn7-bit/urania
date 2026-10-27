/* gozlem.js — "Gökyüzü" bölümü: canlı gök levhası, bu gece özeti, gezegenler,
   dürbün hedefleri, meteor yağmurları ve yaklaşan olaylar. */
(function () {
  'use strict';
  const G = window.Gok, U = window.Urania;
  const A = G.A;

  const durum = {
    gun: null,          // seçili gece için başvuru anı (null = şimdi)
    dakika: 0,          // kaydırıcı: gecenin öğlesinden itibaren dakika
    canli: true,        // kullanıcı kaydırıcıya dokunmadıysa her dakika "şimdi"ye güncellenir
    limitKadir: U.oku('limitKadir', 4),
    veri: null, harita: null, gece: null, gzl: null, hedefDurum: null, meteorDurum: null
  };
  let el = null;
  let canliSayac = null;

  function kadirAciklama(m) {
    if (m <= 2.5) return 'yoğun şehir ışığı';
    if (m <= 3.5) return 'şehir içi';
    if (m <= 4.5) return 'banliyö';
    if (m <= 5.5) return 'kırsal';
    return 'çok karanlık gök';
  }

  function iskelet() {
    el.innerHTML = `
      <h1>Bu gece gökyüzü</h1>
      <div class="serit" style="margin-top:10px">
        <span class="konum" id="gkKonum"></span>
        <button type="button" class="bag" id="gkKonumDegis">Konumu değiştir</button>
        <label>Gece <input type="date" id="gkTarih"></label>
        <button type="button" class="bag" id="gkBuGece" hidden>Bu geceye dön</button>
      </div>
      <a class="dugme dolu ar-giris" href="#ar">Telefonu gökyüzüne tut</a>
      <div class="levha-kap">
        <canvas id="gkLevha" width="560" height="560" role="img" aria-label="Seçili an için gökyüzü haritası. Bir cisme dokunarak adını gör."></canvas>
        <div class="levha-bilgi" id="gkBilgi" aria-live="polite" hidden></div>
      </div>
      <div class="zaman-kontrol">
        <div class="etiket"><span>Saat <b id="gkSaat">—</b></span><span id="gkGunesDurum"></span></div>
        <input type="range" id="gkKaydir" min="0" max="1440" step="5" aria-label="Saat">
        <button type="button" class="dugme" id="gkSimdi">Şimdi</button>
      </div>
      <div class="kadir-kontrol">
        <label for="gkKadir">Görünen en sönük yıldız: <b id="gkKadirDeger"></b></label>
        <input type="range" id="gkKadir" min="1.5" max="6" step="0.5">
      </div>
      <div class="ozet" id="gkOzet"></div>

      <h2>Gezegenler</h2>
      <p class="alt-baslik">Saatler seçili gece için; "en iyi" o gece en yüksekte olduğu an.</p>
      <ul class="liste" id="gkGezegen"></ul>

      <h2>Dürbün hedefleri</h2>
      <p class="alt-baslik">7×50 dürbün için parlak kümeler, bulutsular ve çift yıldızlar. Karanlıkta 20°'nin üstüne çıkanlar.</p>
      <ul class="liste" id="gkHedef"></ul>
      <details class="aciklama" id="gkHedefDiger"><summary>Bu gece alçakta kalanlar</summary><ul class="liste" id="gkHedefAlcak"></ul></details>

      <h2>Meteor yağmurları</h2>
      <p class="alt-baslik">Saatlik sayı (ZHR), radyant başucundayken kusursuz karanlıkta görülecek en yüksek sayıdır; şehirde ve Ay ışığında bunun küçük bir kısmı görülür.</p>
      <ul class="liste" id="gkMeteor"></ul>
      <details class="aciklama"><summary>Takvimin tamamı</summary><ul class="liste" id="gkMeteorTum"></ul></details>

      <h2>Yaklaşan olaylar</h2>
      <ul class="liste" id="gkOlay"></ul>

      <p class="kaynak" id="gkKaynak"></p>

      <dialog id="gkKonumPanel">
        <form method="dialog" id="gkKonumForm">
          <h3 style="margin-bottom:12px">Gözlem yeri</h3>
          <button type="button" class="dugme dolu" id="gkGps" style="width:100%;margin-bottom:14px">Bulunduğum yeri kullan</button>
          <div class="alan"><label for="gkKAd">Ad</label><input id="gkKAd" autocomplete="off"></div>
          <div class="hesap-ızgara">
            <div class="alan"><label for="gkKEnlem">Enlem (°K)</label><input id="gkKEnlem" inputmode="decimal"></div>
            <div class="alan"><label for="gkKBoylam">Boylam (°D)</label><input id="gkKBoylam" inputmode="decimal"></div>
          </div>
          <p class="soluk kucuk" id="gkKDurum"></p>
          <div class="cip-grup" style="justify-content:space-between">
            <button type="button" class="dugme" id="gkKSifirla">Kadıköy'e dön</button>
            <span class="cip-grup"><button value="iptal" class="dugme">Vazgeç</button><button value="kaydet" class="dugme dolu" id="gkKKaydet">Kaydet</button></span>
          </div>
        </form>
      </dialog>`;
  }

  /* ---- Zaman ---- */
  function bazAn() { return durum.gun ? new Date(durum.gun) : new Date(); }
  function ogle() { return G.yerelOgle(bazAn(), U.konum().boylam); }
  /* Canlı modda levha her zaman gerçek "şimdi"yi çizer; kaydırıcı yalnız konum gösterir.
     Kaydırıcı gecenin öğlesinden ertesi öğleye (24 sa) uzanır: kış sabahları da ulaşılır. */
  function secilenAn() {
    if (durum.canli && !durum.gun) return new Date();
    return new Date(ogle().getTime() + durum.dakika * 60e3);
  }
  function simdiyeKur() {
    const fark = Math.round((Date.now() - ogle().getTime()) / 60e3 / 5) * 5;
    durum.dakika = Math.max(0, Math.min(1440, fark));
  }

  function tdAd(kod) {
    const t = durum.veri.takimyildizlar.find(x => x.k === kod);
    return t ? t.ad : kod;
  }

  /* ---- Gece hesapları (gece değişince) ---- */
  function geceHesapla() {
    const k = U.konum();
    durum.gzl = G.gozlemci(k.enlem, k.boylam, k.yukseklik || 0);
    durum.gece = G.geceAraligi(bazAn(), durum.gzl);
    durum.geceAnahtar = ogle().getTime() + '|' + k.enlem + '|' + k.boylam;
    const temsil = durum.gece.karanlikBas || secilenAn();
    durum.hedefDurum = G.hedeflerBuGece(durum.veri.hedefler, durum.gzl, durum.gece, temsil);
    durum.meteorDurum = G.meteorDurumu(durum.veri.meteor.yagmurlar, temsil, durum.gzl, durum.gece);
    durum.ayGece = G.ayDurumu(temsil, durum.gzl);
    durum.gezegenGece = G.gezegenlerBuGece(temsil, durum.gzl, durum.gece);
    durum.olaylar = G.olaylar(bazAn(), durum.gzl, 120);
    listeleriYaz();
  }

  /* ---- Levha (her zaman değişiminde) ---- */
  function levhaCiz() {
    const an = secilenAn();
    const gzl = durum.gzl;
    const gunes = G.cisimAltAz('Sun', an, gzl);
    const ay = G.ayDurumu(an, gzl);
    const gezegenler = G.GEZEGENLER.map(c => {
      const k = G.cisimAltAz(c, an, gzl);
      return { ad: G.TR_AD[c], alt: k.alt, az: k.az, kadir: A.Illumination(c, an).mag };
    }).filter(g => g.kadir <= 6.5);
    const radyantlar = durum.meteorDurum.filter(m => m.aktif && m.radyant_ra != null).map(m => ({ ad: m.ad, ra: m.radyant_ra, dec: m.radyant_dec }));
    durum.harita.ciz({ zaman: an, gzl, gunes, ay, gezegenler, hedefler: durum.veri.hedefler, radyantlar, limitKadir: durum.limitKadir });
    el.querySelector('#gkSaat').textContent = U.saat(an) + (durum.canli && !durum.gun ? ' (şimdi)' : '') + ' · ' + U.gun(an);
    let gd;
    if (gunes.alt > 0) gd = 'Gündüz';
    else if (gunes.alt > -6) gd = 'Sivil alacakaranlık';
    else if (gunes.alt > -12) gd = 'Denizci alacakaranlığı';
    else if (gunes.alt > -18) gd = 'Astronomik alacakaranlık';
    else gd = 'Tam karanlık';
    el.querySelector('#gkGunesDurum').textContent = gd;
    const kd = el.querySelector('#gkKaydir');
    kd.value = durum.dakika;
    kd.setAttribute('aria-valuetext', U.saat(an) + ', ' + U.gun(an));
  }

  /* ---- Metin ve listeler ---- */
  function ayAydinlatirMi() {
    const g = durum.gece;
    if (!g.karanlikBas || !g.karanlikSon) return false;
    const ay = durum.ayGece;
    if (ay.oran < 0.4) return false;
    for (let t = g.karanlikBas.getTime(); t <= g.karanlikSon.getTime(); t += 30 * 60e3) {
      if (G.cisimAltAz('Moon', new Date(t), durum.gzl).alt > 5) return true;
    }
    return false;
  }

  function ozetYaz() {
    const g = durum.gece, ay = durum.ayGece;
    const s = [];
    if (g.batis && g.astroSon) {
      s.push(`Güneş <strong>${U.saat(g.batis)}</strong>'de batıyor; gökyüzü <strong>${U.saat(g.astroSon)}</strong>'de tam kararıyor ve ${U.saat(g.astroBas)}'e kadar karanlık kalıyor. Güneş ${U.saat(g.dogus)}'de doğuyor.`);
    } else if (g.batis) {
      s.push(`Güneş ${U.saat(g.batis)}'de batıyor ama bu gece tam karanlık olmuyor; Güneş ufkun yeterince altına inmiyor.`);
    }
    let ayCumle = `Ay ${ay.ad.toLocaleLowerCase('tr-TR')}, %${Math.round(ay.oran * 100)} aydınlık`;
    const olaylar = [];
    if (ay.dogus) olaylar.push(`${U.saat(ay.dogus)}'de doğuyor`);
    if (ay.batis) olaylar.push(`${U.saat(ay.batis)}'de batıyor`);
    if (olaylar.length) {
      const sirali = [[ay.dogus, olaylar.find(x => x.includes('doğuyor'))], [ay.batis, olaylar.find(x => x.includes('batıyor'))]]
        .filter(x => x[0]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
      ayCumle += '; ' + sirali.join(', ') + '.';
    } else ayCumle += '.';
    if (ayAydinlatirMi()) ayCumle += ' Işığı sönük bulutsu ve galaksileri bastıracak; kümeler, çift yıldızlar ve gezegenler için sorun değil.';
    else if (ay.oran < 0.25) ayCumle += ' Sönük cisimler için iyi bir gece.';
    s.push(ayCumle);
    const gorunen = durum.gezegenGece.filter(p => p.gorunur && p.kadir <= 6);
    if (gorunen.length) {
      const adlar = gorunen.sort((a, b) => a.kadir - b.kadir).map(p => p.ad);
      const son = adlar.pop();
      s.push(`Çıplak gözle görülebilecek gezegenler: ${adlar.length ? adlar.join(', ') + ' ve ' + son : son}.`);
    } else s.push('Bu gece çıplak gözle görülecek bir gezegen yok.');
    const aktif = durum.meteorDurum.filter(m => m.aktif);
    if (aktif.length) {
      s.push('Etkin meteor yağmuru: ' + aktif.map(m => `${U.kacis(m.ad)} (zirve ${U.kacGun(m.gunFark).replace('bugün', 'bu gece')})`).join(', ') + '.');
    }
    el.querySelector('#gkOzet').innerHTML = s.map(x => '<p>' + x + '</p>').join('');
  }

  function gezegenYaz() {
    const ul = el.querySelector('#gkGezegen');
    ul.innerHTML = durum.gezegenGece.map(p => {
      const td = U.kacis(tdAd(p.takimyildiz));
      const dogBat = [p.dogus ? 'doğuş ' + U.saat(p.dogus) : null, p.batis ? 'batış ' + U.saat(p.batis) : null].filter(Boolean).join(' · ');
      const arac = p.kadir <= 5.5 ? '<span class="rozet iyi">çıplak göz</span>' : (p.kadir <= 9 ? '<span class="rozet">dürbün</span>' : '<span class="rozet">teleskop</span>');
      if (!p.gorunur) {
        const neden = p.gunesAcisi < 18 ? `Güneş'e çok yakın (${U.derece(p.gunesAcisi)})` : 'karanlıkta ufka yakın kalıyor';
        return `<li class="sonuk"><span class="ad">${p.ad}</span><span class="sag">${U.kadir(p.kadir)} kadir</span><span class="alt">Bu gece uygun değil: ${neden}. ${td} takımyıldızında.</span></li>`;
      }
      const t = p.tepe;
      return `<li><span class="ad">${p.ad}${arac}</span><span class="sag">en iyi ${U.saat(t.zaman)} · ${U.derece(t.alt)} ${G.yon(t.az)}</span>
        <span class="alt">${U.kadir(p.kadir)} kadir · ${td} takımyıldızında · ${dogBat}</span></li>`;
    }).join('');
  }

  function hedefSatir(h) {
    const notlar = [h.katalog, h.turAd, tdAd(h.takimyildiz), U.kadir(h.kadir) + ' kadir'].filter(Boolean);
    if (h.boyut) notlar.push(h.boyut);
    let uyari = '';
    if (h.ayAcisi < 30 && durum.ayGece.oran > 0.35) uyari = ` <span class="rozet uyari">Ay'a ${U.derece(h.ayAcisi)}</span>`;
    else if (h.kadir > 5.5 && (h.tur === 'galaksi' || h.tur === 'bulutsu')) uyari = ' <span class="rozet">şehirde zor</span>';
    const sag = h.tepe ? `en iyi ${U.saat(h.tepe.zaman)} · ${U.derece(h.tepe.alt)} ${G.yon(h.tepe.az)}` : '—';
    return `<li><span class="ad">${U.kacis(h.ad)}${uyari}</span><span class="sag">${sag}</span><span class="alt">${notlar.map(U.kacis).join(' · ')}</span></li>`;
  }

  function hedefYaz() {
    const iyi = durum.hedefDurum.filter(h => h.gorunur).sort((a, b) => b.tepe.alt - a.tepe.alt);
    const alcak = durum.hedefDurum.filter(h => !h.gorunur);
    el.querySelector('#gkHedef').innerHTML = iyi.length ? iyi.map(hedefSatir).join('') : '<li><span class="bos">Bu gece karanlıkta 20°\'yi geçen hedef yok.</span></li>';
    el.querySelector('#gkHedefAlcak').innerHTML = alcak.map(h => `<li class="sonuk"><span class="ad">${U.kacis(h.ad)}</span><span class="sag">${h.tepe ? 'en çok ' + U.derece(h.tepe.alt) : '—'}</span><span class="alt">${U.kacis(h.turAd)} · ${U.kacis(tdAd(h.takimyildiz))}</span></li>`).join('');
    el.querySelector('#gkHedefDiger').hidden = !alcak.length;
  }

  function meteorSatir(m, tam) {
    const zirve = new Date(m.zirve_utc);
    const ayOran = A.Illumination('Moon', zirve).phase_fraction;
    const bas = m.baslangic.split('-').map(Number).slice(-2), bit = m.bitis.split('-').map(Number).slice(-2);
    const ayAd = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const aralik = `${bas[1]} ${ayAd[bas[0] - 1]} – ${bit[1]} ${ayAd[bit[0] - 1]}`;
    const rozet = m.aktif ? '<span class="rozet iyi">etkin</span>' : '';
    const parca = [`zirve ${U.gun(zirve)} (${U.kacGun(m.gunFark)})`, aralik, /\(.*\)/.test(String(m.zhr)) ? 'ZHR ' + U.kacis(String(m.zhr).replace(/^\S+\s*/, '')) : null, m.hiz ? m.hiz + ' km/s' : null, `zirvede Ay %${Math.round(ayOran * 100)}`];
    if (m.radyantTepe && !tam) parca.push(`radyant gece en çok ${U.derece(m.radyantTepe.alt)}`);
    return `<li${!m.aktif && tam ? ' class="sonuk"' : ''}><span class="ad">${U.kacis(m.ad)}${rozet}</span><span class="sag">${m.zhr != null ? 'ZHR ' + U.kacis(String(m.zhr).split(' ')[0]) : ''}</span><span class="alt">${parca.filter(Boolean).join(' · ')}${m.not ? '<br>' + U.kacis(m.not) : ''}</span></li>`;
  }

  function meteorYaz() {
    const ds = durum.meteorDurum;
    const one = ds.filter(m => m.aktif || (m.gunFark > 0 && m.gunFark < 75)).sort((a, b) => (b.aktif - a.aktif) || (a.gunFark - b.gunFark));
    el.querySelector('#gkMeteor').innerHTML = one.length ? one.map(m => meteorSatir(m, false)).join('') : '<li><span class="bos">Önümüzdeki 75 günde büyük bir yağmur yok.</span></li>';
    el.querySelector('#gkMeteorTum').innerHTML = ds.slice().sort((a, b) => new Date(a.zirve_utc) - new Date(b.zirve_utc)).map(m => meteorSatir(m, true)).join('');
  }

  function olayYaz() {
    const ls = durum.olaylar.slice(0, 12);
    el.querySelector('#gkOlay').innerHTML = ls.map(o => `<li${o.gorunur === false ? ' class="sonuk"' : ''}><span class="ad">${U.kacis(o.baslik)}</span><span class="sag">${U.gun(o.zaman)}</span>${o.not ? `<span class="alt">${U.kacis(o.not)}</span>` : `<span class="alt">${U.gunHafta(o.zaman)}, ${U.saat(o.zaman)}</span>`}</li>`).join('');
  }

  function listeleriYaz() {
    ozetYaz(); gezegenYaz(); hedefYaz(); meteorYaz(); olayYaz();
    const k = U.konum();
    el.querySelector('#gkKonum').textContent = k.ad + ' (' + U.sayi(k.enlem, 2) + '°, ' + U.sayi(k.boylam, 2) + '°) · saatler: ' + U.dilimAdi(k.saatDilimi);
  }

  /* ---- Konum paneli ---- */
  let gpsDilim = null;
  function konumPaneli() {
    gpsDilim = null;
    const p = el.querySelector('#gkKonumPanel');
    const k = U.konum();
    el.querySelector('#gkKAd').value = k.ad;
    el.querySelector('#gkKEnlem').value = String(k.enlem).replace('.', ',');
    el.querySelector('#gkKBoylam').value = String(k.boylam).replace('.', ',');
    el.querySelector('#gkKDurum').textContent = '';
    if (p.showModal) p.showModal(); else p.setAttribute('open', '');
  }
  function sayiOku(s) { return parseFloat(String(s).replace(',', '.')); }
  function konumBagla() {
    const p = el.querySelector('#gkKonumPanel');
    el.querySelector('#gkKonumDegis').addEventListener('click', konumPaneli);
    el.querySelector('#gkGps').addEventListener('click', () => {
      const d = el.querySelector('#gkKDurum');
      if (!navigator.geolocation) { d.textContent = 'Bu tarayıcı konum vermiyor; enlem ve boylamı elle yaz.'; return; }
      d.textContent = 'Konum alınıyor…';
      navigator.geolocation.getCurrentPosition(pos => {
        el.querySelector('#gkKEnlem').value = pos.coords.latitude.toFixed(3).replace('.', ',');
        el.querySelector('#gkKBoylam').value = pos.coords.longitude.toFixed(3).replace('.', ',');
        el.querySelector('#gkKAd').value = 'Bulunduğum yer';
        gpsDilim = Intl.DateTimeFormat().resolvedOptions().timeZone;
        d.textContent = 'Konum alındı (±' + Math.round(pos.coords.accuracy) + ' m). Kaydet\'e bas.';
      }, err => {
        d.textContent = err.code === 1 ? 'Konum izni verilmedi. Tarayıcı ayarlarından izin ver ya da elle yaz.' : 'Konum alınamadı; elle yaz.';
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
    });
    el.querySelector('#gkKSifirla').addEventListener('click', () => {
      const v = U.VARSAYILAN_KONUM;
      el.querySelector('#gkKAd').value = v.ad;
      el.querySelector('#gkKEnlem').value = String(v.enlem).replace('.', ',');
      el.querySelector('#gkKBoylam').value = String(v.boylam).replace('.', ',');
    });
    p.addEventListener('close', () => {
      if (p.returnValue !== 'kaydet') return;
      const enlem = sayiOku(el.querySelector('#gkKEnlem').value);
      const boylam = sayiOku(el.querySelector('#gkKBoylam').value);
      if (!(enlem >= -90 && enlem <= 90 && boylam >= -180 && boylam <= 180)) {
        alertYok('Enlem −90 ile 90, boylam −180 ile 180 arasında olmalı. Konum değişmedi.');
        return;
      }
      const vars = U.VARSAYILAN_KONUM;
      const saatDilimi = gpsDilim || (Math.abs(enlem - vars.enlem) < 1e-6 && Math.abs(boylam - vars.boylam) < 1e-6 ? vars.saatDilimi : U.dilimTahmin(boylam));
      gpsDilim = null;
      U.konumYaz({ ad: el.querySelector('#gkKAd').value.trim() || 'Özel konum', enlem, boylam, yukseklik: 0, saatDilimi });
      geceHesapla(); levhaCiz();
    });
  }
  function alertYok(mesaj) {
    const o = el.querySelector('#gkOzet');
    o.insertAdjacentHTML('beforebegin', '<div class="hata-kutu" role="alert">' + U.kacis(mesaj) + '</div>');
  }

  function bagla() {
    const kaydir = el.querySelector('#gkKaydir');
    kaydir.addEventListener('input', () => {
      durum.dakika = Number(kaydir.value);
      durum.canli = false;
      levhaCiz();
    });
    el.querySelector('#gkSimdi').addEventListener('click', () => {
      const geceDegisti = durum.gun !== null;
      durum.gun = null; durum.canli = true;
      el.querySelector('#gkTarih').value = '';
      el.querySelector('#gkBuGece').hidden = true;
      simdiyeKur();
      if (geceDegisti || geceAnahtariDegisti()) geceHesapla();
      levhaCiz();
    });
    const kadir = el.querySelector('#gkKadir');
    kadir.value = durum.limitKadir;
    const kadirEtiket = () => { el.querySelector('#gkKadirDeger').textContent = U.sayi(durum.limitKadir, 1) + ' kadir (' + kadirAciklama(durum.limitKadir) + ')'; };
    kadirEtiket();
    kadir.addEventListener('input', () => {
      durum.limitKadir = Number(kadir.value);
      U.yaz('limitKadir', durum.limitKadir);
      kadirEtiket(); levhaCiz();
    });
    const tarih = el.querySelector('#gkTarih');
    tarih.addEventListener('change', () => {
      if (!tarih.value) return;
      const [y, a, g] = tarih.value.split('-').map(Number);
      /* Seçilen günün akşamı, gözlemcinin boylamına göre (yerel güneş saatiyle 21:00) */
      durum.gun = new Date(Date.UTC(y, a - 1, g, 21, 0, 0) - U.konum().boylam / 15 * 3600e3);
      durum.canli = false;
      durum.dakika = 9 * 60; // 21:00
      el.querySelector('#gkBuGece').hidden = false;
      geceHesapla(); levhaCiz();
    });
    el.querySelector('#gkBuGece').addEventListener('click', () => el.querySelector('#gkSimdi').click());
    const bilgi = el.querySelector('#gkBilgi');
    let bilgiSayac = null;
    durum.harita = Harita.olustur(el.querySelector('#gkLevha'), durum.veri, html => {
      clearTimeout(bilgiSayac);
      if (!html) { bilgi.hidden = true; return; }
      bilgi.innerHTML = html; bilgi.hidden = false;
      bilgiSayac = setTimeout(() => { bilgi.hidden = true; }, 6000);
    });
    konumBagla();
  }

  function geceAnahtariDegisti() {
    const k = U.konum();
    return durum.geceAnahtar !== ogle().getTime() + '|' + k.enlem + '|' + k.boylam;
  }

  function kaynakYaz() {
    const m = durum.veri.meteor;
    el.querySelector('#gkKaynak').innerHTML =
      'Konum ve zaman hesapları <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener">Astronomy Engine</a> ile cihazında yapılır. ' +
      'Yıldız ve takımyıldız verisi <a href="https://github.com/ofrohn/d3-celestial" target="_blank" rel="noopener">d3-celestial</a>. ' +
      'Meteor verisi: <a href="' + U.guvenliUrl(m.kaynak_url) + '" target="_blank" rel="noopener">' + U.kacis(m.kaynak) + '</a>. ' +
      'Hedef koordinatları: ' + U.kacis(durum.veri.hedefKaynak) + '.';
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Gökyüzü hazırlanıyor…</p>';
    try {
      const [yildizlar, takimyildizlar, hedefler, meteor] = await Promise.all([U.veri('yildizlar'), U.veri('takimyildiz'), U.veri('hedefler'), U.veri('meteor')]);
      durum.veri = { yildizlar, takimyildizlar, hedefler: hedefler.hedefler, hedefKaynak: hedefler.kaynak, meteor };
    } catch (e) {
      el.innerHTML = '<div class="hata-kutu">Gök verisi yüklenemedi: ' + U.kacis(e.message) + '. Sayfayı yenile; sorun sürerse internet bağlantısını kontrol et.</div>';
      return;
    }
    iskelet();
    bagla();
    kaynakYaz();
    simdiyeKur();
    geceHesapla();
    levhaCiz();
    canliSayac = setInterval(() => {
      if (!durum.canli || durum.gun || el.hidden) return;
      simdiyeKur();
      if (geceAnahtariDegisti()) geceHesapla();
      levhaCiz();
    }, 60e3);
  }

  function goster() {
    if (durum.harita && durum.gzl) {
      if (durum.canli && !durum.gun) { simdiyeKur(); if (geceAnahtariDegisti()) geceHesapla(); }
      requestAnimationFrame(levhaCiz);
    }
  }

  U.modul('gok', { ilk, goster });
  window.UraniaGozlem = { durum };
})();
