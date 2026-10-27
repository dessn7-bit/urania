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
      <div class="hava" id="gkHava" aria-live="polite"></div>

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

      <h2>Uzay İstasyonu geçişleri</h2>
      <p class="alt-baslik">Önümüzdeki 5 günde buradan görülebilecek ISS geçişleri: istasyon Güneş ışığı alırken, gök karanlıkken ve ufkun en az 10° üstündeyken.</p>
      <ul class="liste" id="gkIss"><li><span class="bos">Hesaplanıyor…</span></li></ul>
      <p class="kaynak" id="gkIssKaynak"></p>

      <h2>Yaklaşan olaylar</h2>
      <ul class="liste" id="gkOlay"></ul>

      <p class="kaynak" id="gkKaynak"></p>

      <dialog id="gkKonumPanel">
        <form method="dialog" id="gkKonumForm">
          <h3 style="margin-bottom:12px">Gözlem yeri</h3>
          <label class="secim-satir"><input type="checkbox" id="gkKOto"> <span><b>Her zaman bulunduğum yeri kullan</b><br><span class="soluk kucuk">Uygulama her açıldığında ve 10 dakikada bir telefonun konumunu alır.</span></span></label>
          <div id="gkKElle">
          <button type="button" class="dugme" id="gkGps" style="width:100%;margin:12px 0 14px">Şu anki konumu bir kez al</button>
          <div class="alan"><label for="gkKAd">Ad</label><input id="gkKAd" autocomplete="off"></div>
          <div class="hesap-ızgara">
            <div class="alan"><label for="gkKEnlem">Enlem (°K)</label><input id="gkKEnlem" inputmode="decimal"></div>
            <div class="alan"><label for="gkKBoylam">Boylam (°D)</label><input id="gkKBoylam" inputmode="decimal"></div>
          </div>
          </div>
          <p class="soluk kucuk" id="gkKDurum"></p>
          <div class="cip-grup" style="justify-content:space-between">
            <button type="button" class="dugme" id="gkKSifirla">Varsayılana dön (Fetih Mah.)</button>
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
    havaYaz();
    issYaz(true);
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
    let ayCumle = `Ay: ${ay.ad}, %${Math.round(ay.oran * 100)} aydınlık`;
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
        <span class="alt">${U.kadir(p.kadir)} kadir · ${td} takımyıldızında · ${dogBat}${p.cisim === 'Jupiter' ? jupiterSema(t.zaman) : ''}${defterBag('cisim:' + p.cisim)}</span></li>`;
    }).join('');
  }

  function hedefSatir(h) {
    const notlar = [h.katalog, h.turAd, tdAd(h.takimyildiz), U.kadir(h.kadir) + ' kadir'].filter(Boolean);
    if (h.boyut) notlar.push(h.boyut);
    let uyari = '';
    if (h.ayAcisi < 30 && durum.ayGece.oran > 0.35) uyari = ` <span class="rozet uyari">Ay'a ${U.derece(h.ayAcisi)}</span>`;
    else if (h.kadir > 5.5 && (h.tur === 'galaksi' || h.tur === 'bulutsu')) uyari = ' <span class="rozet">şehirde zor</span>';
    const sag = h.tepe ? `en iyi ${U.saat(h.tepe.zaman)} · ${U.derece(h.tepe.alt)} ${G.yon(h.tepe.az)}` : '—';
    return `<li><span class="ad">${U.kacis(h.ad)}${uyari}</span><span class="sag">${sag}</span><span class="alt">${notlar.map(U.kacis).join(' · ')}${defterBag('hedef:' + h.id)}</span></li>`;
  }

  /* Jüpiter'in dört büyük uydusu: dürbünde görüneceği gibi (kuzey yukarı, doğu solda) */
  function jupiterSema(zaman) {
    const ls = G.jupiterUydulari(zaman), R = G.jupiterYaricap(zaman);
    const enUzak = Math.max(60, ...ls.map(m => Math.abs(m.dogu))) * 1.12;
    const W = 320, H = 54, cx = W / 2, cy = 24, olc = (W / 2 - 8) / enUzak;
    const r = Math.max(4, R * olc);
    const durum = m => {
      const ic = Math.hypot(m.dogu, m.kuzey) < R;
      if (ic && m.derinlik > 0) return 'arkada';
      if (ic && m.derinlik < 0) return 'onde';
      return '';
    };
    const nok = ls.map(m => {
      const x = cx - m.dogu * olc, y = cy - m.kuzey * olc, d = durum(m);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" class="${d === 'arkada' ? 'uydu-gizli' : 'uydu'}"/>
        <text x="${x.toFixed(1)}" y="${(cy + 22).toFixed(1)}" text-anchor="middle" class="uydu-ad">${m.ad[0]}</text>`;
    }).join('');
    const bati = ls.filter(m => m.dogu < 0).map(m => m.ad), dogu = ls.filter(m => m.dogu >= 0).map(m => m.ad);
    const notlar = ls.filter(m => durum(m)).map(m => m.ad + (durum(m) === 'onde' ? ' Jüpiter\'in önünden geçiyor' : ' Jüpiter\'in arkasında, görünmez'));
    return `<span class="jupiter-sema">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Jüpiter ve uyduları, ${U.saat(zaman)}">
        <text x="4" y="10" class="uydu-yon">D</text><text x="${W - 4}" y="10" text-anchor="end" class="uydu-yon">B</text>
        <circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" class="jupiter-disk"/>${nok}
      </svg>
      <span class="kucuk">Uydular ${U.saat(zaman)}'de: doğuda (solda) ${dogu.join(', ') || 'yok'}; batıda (sağda) ${bati.join(', ') || 'yok'}.${notlar.length ? ' ' + notlar.join('; ') + '.' : ''} 7×50 dürbünde Jüpiter'in yanında küçük noktalar olarak görünürler.</span>
    </span>`;
  }

  /* Gözlem defteri bağlantısı: daha önce görüldüyse tarihi, her durumda "Gördüm" */
  function defterBag(anahtar) {
    if (!window.Defter) return '';
    const son = Defter.sonGorulme(anahtar);
    const rozet = son ? `<span class="rozet iyi">görüldü · ${U.gun(new Date(son.zaman))}</span> ` : '';
    return `<span class="defter-bag">${rozet}<a href="#defter/yeni/${encodeURIComponent(anahtar)}">Gördüm, deftere yaz</a></span>`;
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
    if (!tam && m.gunFark > 0) parca.push(takvimBag({ baslik: m.ad + ' meteor yağmuru zirvesi', bas: zirve, aciklama: 'IMO takvimine göre zirve. ZHR ' + m.zhr + '; zirvede Ay %' + Math.round(ayOran * 100) + ' aydınlık. (Urania)' }));
    return `<li${!m.aktif && tam ? ' class="sonuk"' : ''}><span class="ad">${U.kacis(m.ad)}${rozet}</span><span class="sag">${m.zhr != null ? 'ZHR ' + U.kacis(String(m.zhr).split(' ')[0]) : ''}</span><span class="alt">${parca.filter(Boolean).join(' · ')}${m.not ? '<br>' + U.kacis(m.not) : ''}</span></li>`;
  }

  function meteorYaz() {
    const ds = durum.meteorDurum;
    const one = ds.filter(m => m.aktif || (m.gunFark > 0 && m.gunFark < 75)).sort((a, b) => (b.aktif - a.aktif) || (a.gunFark - b.gunFark));
    el.querySelector('#gkMeteor').innerHTML = one.length ? one.map(m => meteorSatir(m, false)).join('') : '<li><span class="bos">Önümüzdeki 75 günde büyük bir yağmur yok.</span></li>';
    el.querySelector('#gkMeteorTum').innerHTML = ds.slice().sort((a, b) => new Date(a.zirve_utc) - new Date(b.zirve_utc)).map(m => meteorSatir(m, true)).join('');
  }

  /* "Takvime ekle": olay listesinden ve meteor zirvelerinden .ics */
  const takvimOlaylari = [];
  function takvimBag(o) {
    takvimOlaylari.push(o);
    return `<button type="button" class="bag takvim-bag" data-takvim="${takvimOlaylari.length - 1}">Takvime ekle</button>`;
  }
  function olayYaz() {
    const ls = durum.olaylar.slice(0, 12);
    el.querySelector('#gkOlay').innerHTML = ls.map(o => `<li${o.gorunur === false ? ' class="sonuk"' : ''}><span class="ad">${U.kacis(o.baslik)}</span><span class="sag">${U.gun(o.zaman)}</span><span class="alt">${o.not ? U.kacis(o.not) + '<br>' : ''}${U.gunHafta(o.zaman)}, ${U.saat(o.zaman)} · ${takvimBag({ baslik: o.baslik, bas: o.zaman, aciklama: (o.not || '') + ' (Urania, ' + U.konum().ad + ')' })}</span></li>`).join('');
  }

  /* ---- ISS geçişleri (gecelere değil "şimdi"ye bağlı; konum değişince yeniden) ---- */
  let issAnahtar = '';
  async function issYaz(zorla) {
    const k = U.konum();
    const anahtar = k.enlem + '|' + k.boylam + '|' + new Date().toISOString().slice(0, 13);
    if (!zorla && anahtar === issAnahtar) return;
    issAnahtar = anahtar;
    const ul = el.querySelector('#gkIss'), kay = el.querySelector('#gkIssKaynak');
    let tle;
    try { tle = await Uydu.tleGetir(); } catch (e) {
      ul.innerHTML = '<li><span class="bos">Yörünge verisi alınamadı (internet yok ya da CelesTrak yanıt vermedi). İnternete bağlanınca kendiliğinden hesaplanır.</span></li>';
      kay.textContent = ''; issAnahtar = ''; return;
    }
    await new Promise(r => setTimeout(r, 30)); // önce sayfa çizilsin
    const ls = Uydu.gecisler(tle, k, new Date(), 5).filter(g => g.gorunur && g.gBit.t > new Date());
    const donem = Uydu.tleDonemi(tle.s1);
    const yas = (Date.now() - donem) / 86400e3;
    ul.innerHTML = ls.length ? ls.map(g => {
      const b = g.gBas, s = g.gBit, t = g.gTepe;
      const yon = d => G.YON_UZUN[G.yon(d.az)];
      const basM = b === g.bas ? `${yon(b)} yönünde ${U.derece(b.alt)} yükseklikte belirir` : `${yon(b)} yönünde ${U.derece(b.alt)} yükseklikte Dünya'nın gölgesinden çıkıp belirir`;
      const sonM = s === g.bitis ? `${yon(s)} yönünde ${U.derece(s.alt)}'nin altına alçalır` : `${yon(s)} yönünde ${U.derece(s.alt)} yükseklikte Dünya'nın gölgesine girip kaybolur`;
      const metin = `${U.saat(b.t)}–${U.saat(s.t)} · ${basM}, en çok ${U.derece(t.alt)} (${yon(t)}), ${sonM}`;
      return `<li><span class="ad">${U.kacis(U.gunHafta(b.t))}</span><span class="sag">en çok ${U.derece(t.alt)}</span><span class="alt">${metin}<br>${takvimBag({ baslik: 'ISS geçişi', bas: new Date(b.t.getTime() - 60e3), son: new Date(s.t.getTime() + 60e3), aciklama: metin + '. (Urania, ' + k.ad + ')' })}</span></li>`;
    }).join('') : '<li><span class="bos">Önümüzdeki 5 günde buradan görünür bir geçiş yok.</span></li>';
    kay.innerHTML = `Yörünge öğeleri: <a href="https://celestrak.org/" target="_blank" rel="noopener">CelesTrak</a>, ${U.sayi(yas, 1)} günlük${yas > 7 ? ' — eski; saatler birkaç dakika kayabilir' : ''}${tle.eski ? ' (çevrimdışı, önbellekten)' : ''}. Hesap: SGP4 (satellite.js).`;
  }

  /* ---- Bulut tahmini ---- */
  let havaSira = 0;
  async function havaYaz() {
    const kap = el.querySelector('#gkHava');
    const g = durum.gece;
    const bas = g.sivilSon || g.batis, son = g.sivilBas || g.dogus;
    if (!bas || !son) { kap.innerHTML = ''; return; }
    const sira = ++havaSira;
    const k = U.konum();
    kap.innerHTML = '<p class="soluk kucuk">Bulut tahmini alınıyor…</p>';
    let h;
    try { h = await Hava.getir(k.enlem, k.boylam); } catch (e) {
      if (sira !== havaSira) return;
      kap.innerHTML = '<p class="soluk kucuk">Bulut tahmini alınamadı (internet yok ya da servis yanıt vermedi). Gök hesapları bundan etkilenmez.</p>';
      return;
    }
    if (sira !== havaSira) return;
    if (!kap._bagli) {
      kap._bagli = true;
      kap.addEventListener('click', e => {
        const b = e.target.closest('.hava-saat'); if (!b) return;
        kap.querySelectorAll('.hava-saat').forEach(x => x.classList.toggle('secili', x === b));
        kap.querySelector('#gkHavaDetay').textContent = b.dataset.detay;
      });
    }
    const oz = Hava.geceOzeti(h.saatler, bas, son, 30);
    const kaynak = '<a href="https://open-meteo.com/" target="_blank" rel="noopener">Hava verisi: Open-Meteo.com</a>';
    if (!oz) { kap.innerHTML = '<p class="soluk kucuk">Bu gece için bulut tahmini yok; tahmin yalnız önümüzdeki 3 gün için yapılıyor. ' + kaynak + '</p>'; return; }
    let cumle;
    const n = oz.ls.length;
    if (oz.acik && oz.acik.n >= n - 1) cumle = 'Bulut tahmini: gece boyunca büyük ölçüde açık.';
    else if (oz.acik && oz.acik.n >= 2) cumle = `Bulut tahmini: en açık dönem ${U.saat(oz.acik.bas)}–${U.saat(new Date(oz.acik.son.getTime() + 3600e3))} (bulut %30'un altında).`;
    else if (oz.ort >= 70) cumle = `Bulut tahmini: gece boyunca çoğunlukla kapalı (ortalama %${Math.round(oz.ort)}).`;
    else cumle = `Bulut tahmini: parçalı bulutlu (ortalama %${Math.round(oz.ort)}); uzun bir açık dönem görünmüyor.`;
    const detay = s => `${U.saat(s.t)}: bulut %${s.bulut} (alçak %${s.alcak}, orta %${s.orta}, yüksek %${s.yuksek})` +
      (s.yagisOl != null ? ` · önceki saatte yağış olasılığı %${s.yagisOl}, ${U.sayi(s.yagis || 0, 1)} mm` : '') +
      ` · nem %${s.nem} · rüzgâr ${Math.round(s.ruzgar)} km/sa`;
    const cubuk = oz.ls.map((s, i) => `<button type="button" class="hava-saat" data-detay="${U.kacis(detay(s))}" aria-label="${U.kacis(detay(s))}">
        <span class="hava-iz"><span class="hava-dolu" style="height:${Math.max(2, s.bulut)}%"></span></span>
        <span class="yagis-iz"><span class="yagis-dolu" style="height:${s.yagisOl != null ? Math.max(0, s.yagisOl) : 0}%"></span></span>
        <span class="hava-etiket">${i % 2 === 0 ? U.saat(s.t).slice(0, 2) : ''}</span></button>`).join('');
    let yCumle = '';
    const y = oz.yagis;
    if (y) {
      if (y.riskli.length) {
        const ilk = y.riskli[0].t, son = y.riskli[y.riskli.length - 1].t;
        /* değerler önceki saati kapsar: aralık ilk riskli saatin bir saat öncesinden başlar */
        yCumle = `Yağış riski: ${U.saat(new Date(ilk.getTime() - 3600e3))}–${U.saat(son)} arası olasılık %${y.enCok}'e çıkıyor` + (y.toplam >= 0.1 ? `, gece toplamı yaklaşık ${U.sayi(y.toplam, 1)} mm.` : '.');
      } else if (y.enCok >= 15) yCumle = `Hafif yağış olasılığı var (en çok %${y.enCok}).`;
      else yCumle = `Yağış beklenmiyor (olasılık en çok %${y.enCok}).`;
    }
    kap.innerHTML = `<p class="hava-cumle">${cumle}${yCumle ? '<br>' + yCumle : ''}</p>
      <div class="hava-cubuklar" aria-label="Saatlik bulut oranı">${cubuk}</div>
      <p class="kucuk" id="gkHavaDetay" aria-live="polite"></p>
      <p class="kaynak">Gri çubuk bulut oranı, altındaki mavi çubuk yağış olasılığı; bir saate dokununca ayrıntısı çıkar. ${h.eski ? 'Çevrimdışı: son güncelleme ' + U.saat(h.alindi) + ', ' + U.gun(h.alindi) + '. ' : ''}${kaynak}</p>`;
  }

  function listeleriYaz() {
    takvimOlaylari.length = 0;
    ozetYaz(); gezegenYaz(); hedefYaz(); meteorYaz(); olayYaz();
    konumYazi();
  }

  /* Konum şeridi: ad, kaynak (GPS / son bilinen / elle) ve varsa sorun */
  function konumYazi() {
    const k = U.konum(), d = U.konumDurum;
    let kaynak;
    if (!U.otoAcik()) kaynak = 'elle seçildi';
    else if (d.kaynak === 'gps' && k.oto) kaynak = 'GPS' + (d.hassasiyet ? ', ±' + (d.hassasiyet >= 1000 ? U.sayi(d.hassasiyet / 1000, 1) + ' km' : Math.round(d.hassasiyet) + ' m') : '');
    else if (d.hata === 'izin') kaynak = 'konum izni yok, ' + (k.oto ? 'son bilinen yer' : 'varsayılan yer');
    else if (d.hata) kaynak = 'konum alınamadı, ' + (k.oto ? 'son bilinen yer' : 'varsayılan yer');
    else kaynak = k.oto ? 'son bilinen yer, güncelleniyor…' : 'konum aranıyor…';
    const s = el.querySelector('#gkKonum');
    if (s) s.textContent = k.ad + ' (' + U.sayi(k.enlem, 2) + '°, ' + U.sayi(k.boylam, 2) + '°) · ' + kaynak + (k.saatDilimi !== 'Europe/Istanbul' ? ' · saatler: ' + U.dilimAdi(k.saatDilimi) : '');
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
    const oto = el.querySelector('#gkKOto');
    oto.checked = U.otoAcik();
    el.querySelector('#gkKElle').hidden = oto.checked;
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
    el.querySelector('#gkKOto').addEventListener('change', e => { el.querySelector('#gkKElle').hidden = e.target.checked; });
    el.querySelector('#gkKSifirla').addEventListener('click', () => {
      const v = U.VARSAYILAN_KONUM;
      el.querySelector('#gkKAd').value = v.ad;
      el.querySelector('#gkKEnlem').value = String(v.enlem).replace('.', ',');
      el.querySelector('#gkKBoylam').value = String(v.boylam).replace('.', ',');
    });
    p.addEventListener('close', () => {
      if (p.returnValue !== 'kaydet') return;
      if (el.querySelector('#gkKOto').checked) {
        U.otoAyarla(true);
        konumYazi();
        U.konumuBul(true);
        return;
      }
      U.otoAyarla(false);
      const enlem = sayiOku(el.querySelector('#gkKEnlem').value);
      const boylam = sayiOku(el.querySelector('#gkKBoylam').value);
      if (!(enlem >= -90 && enlem <= 90 && boylam >= -180 && boylam <= 180)) {
        alertYok('Enlem −90 ile 90, boylam −180 ile 180 arasında olmalı. Konum değişmedi.');
        return;
      }
      const vars = U.VARSAYILAN_KONUM;
      const saatDilimi = gpsDilim || (Math.abs(enlem - vars.enlem) < 1e-6 && Math.abs(boylam - vars.boylam) < 1e-6 ? vars.saatDilimi : U.dilimTahmin(boylam));
      gpsDilim = null;
      U.konumYaz({ ad: el.querySelector('#gkKAd').value.trim() || 'Özel konum', enlem, boylam, yukseklik: 0, saatDilimi, oto: false });
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
    document.addEventListener('urania:konum', () => {
      if (!durum.gzl) return;
      konumYazi();
      if (geceAnahtariDegisti()) { geceHesapla(); levhaCiz(); }
    });
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-takvim]'); if (!b) return;
      const o = takvimOlaylari[Number(b.dataset.takvim)]; if (o) U.icsIndir(o);
    });
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
      'Hedef koordinatları: ' + U.kacis(durum.veri.hedefKaynak) + '. Yer adları © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> katkıcıları.';
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
      gezegenYaz(); hedefYaz(); // defterden dönünce "görüldü" işaretleri yenilensin
      if (durum.canli && !durum.gun) { simdiyeKur(); if (geceAnahtariDegisti()) geceHesapla(); }
      requestAnimationFrame(levhaCiz);
    }
  }

  U.modul('gok', { ilk, goster });
  window.UraniaGozlem = { durum };
})();
