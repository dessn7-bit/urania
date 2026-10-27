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
        <label>Gece <input type="date" id="gkTarih" min="1900-01-01" max="2100-12-31"></label>
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
      <div class="dinle" id="gkSes" role="group" aria-label="Bu geceyi dinle"></div>
      <div class="ozet" id="gkOzet"></div>
      <div class="hava" id="gkHava" aria-live="polite"></div>

      <h2 class="okunur" data-ses="Bu gecenin planı.">Bu gecenin planı</h2>
      <p class="alt-baslik">Gecenin görülecekleri, en iyi görünecekleri saate göre: yükseklik, bulut tahmini ve Ay ışığı hesaba katıldı. Saati belli olaylar (uydu geçişi, Algol, örtme) kendi saatinde.</p>
      <ol class="plan" id="gkPlan"><li><span class="bos">Hazırlanıyor…</span></li></ol>
      <div class="cip-grup" id="gkPlanDugme" hidden><button type="button" class="dugme" id="gkPlanTakvim">Planı takvime ekle</button></div>

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

      <h2>Algol'ün kararması</h2>
      <p class="alt-baslik">Perseus'taki Algol, bir yoldaşı önünden geçtikçe 2 gün 21 saatte bir sönükleşir: çıplak gözle izlenebilen bir değişen yıldız. En parlakken Almach (γ And, 2,1 kadir) kadar, en sönükken δ Persei'den (3,0) de sönük (3,3). Önümüzdeki 30 günde en sönük anı buradan karanlıkta görülebilenler:</p>
      <ul class="liste" id="gkAlgol"></ul>

      <h2>Ay örtmeleri</h2>
      <p class="alt-baslik">Ay bir yıldızın ya da gezegenin önünden geçerken yıldız Ay'ın kenarında bir anda kaybolur, sonra öbür kenarda bir anda belirir. Önümüzdeki 90 günde buradan dürbünle izlenebilecek olanlar: Ay ufkun en az 5° üstünde, gök kararmış, yıldız Ay'ın parıltısında seçilecek kadar parlak. Karanlık kenardaki olaylar çok daha kolay izlenir.</p>
      <ul class="liste" id="gkOrtme"><li><span class="bos">Hesaplanıyor…</span></li></ul>

      <h2>Uzay istasyonları ve uydular</h2>
      <p class="alt-baslik">Önümüzdeki 5 günde buradan görülebilecek geçişler: uydu Güneş ışığı alırken, gök karanlıkken ve ufkun en az 10° üstündeyken. ISS en parlağıdır; Tiangong daha küçük ve biraz sönük ama ikisi de çıplak gözle, yıldızlar arasında kaymayan, hızla ilerleyen bir ışık gibi görülür.</p>
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
  function bazAn() { return durum.gun ? new Date(durum.gun) : (!durum.canli && durum.sabitOgle ? new Date(durum.sabitOgle + 9 * 3600e3) : new Date()); }
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
    /* Konum değiştiyse eski yerin örtme, geçiş ve bulut verisi planda kalmasın */
    const yer = k.enlem + '|' + k.boylam;
    if (durum.yer !== yer) { durum.yer = yer; durum.ortmeler = null; durum.uyduGecisleri = null; durum.havaSaatler = null; }
    durum.geceAnahtar = ogle().getTime() + '|' + k.enlem + '|' + k.boylam;
    const temsil = durum.gece.karanlikBas || secilenAn();
    durum.hedefDurum = G.hedeflerBuGece(durum.veri.hedefler, durum.gzl, durum.gece, temsil);
    /* Etkin olmayan yağmurların zirve gecesi hesabı ağır: önce onsuz, aşağıda arka arkaya */
    durum.meteorDurum = G.meteorDurumu(G.meteorTakvimi(durum.veri.meteor, temsil), temsil, durum.gzl, durum.gece, { zirveGecesi: false });
    durum.ayGece = G.ayDurumu(temsil, durum.gzl);
    durum.gezegenGece = G.gezegenlerBuGece(temsil, durum.gzl, durum.gece);
    /* Olaylar (120 gün) ve Algol (30 gün) ağır: önce sayfa çizilsin, sonra arka arkaya hesaplansın */
    const sira = ++geceSira, gzl = durum.gzl, baz = bazAn();
    durum.olaylar = null; durum.algol = null; durum.algolGece = null;
    listeleriYaz(true);
    ortmeYaz();
    havaYaz();
    issYaz(true);
    setTimeout(() => {
      if (sira !== geceSira) return;
      /* Algol: bu gece (planda) ve önümüzdeki 30 gün (listede) */
      const ab = new Date(Math.min(G.yerelOgle(baz, gzl.longitude).getTime(), Date.now()));
      durum.algol = Ortme.algolGozlenebilir(durum.veri.algol, gzl, ab, new Date(ab.getTime() + 31 * 86400e3));
      /* Plan için seçili gecenin minimumları ayrıca: 30 günlük listenin dışındaki bir gece seçilmiş olabilir */
      const og = G.yerelOgle(baz, gzl.longitude);
      durum.algolGece = Ortme.algolGozlenebilir(durum.veri.algol, gzl, og, new Date(og.getTime() + 86400e3));
      algolYaz(); planYaz();
      setTimeout(() => {
        if (sira !== geceSira) return;
        durum.meteorDurum = G.meteorDurumu(G.meteorTakvimi(durum.veri.meteor, temsil), temsil, gzl, durum.gece);
        meteorYaz();
      }, 0);
      setTimeout(() => {
        if (sira !== geceSira) return;
        durum.olaylar = G.olaylar(baz, gzl, 120);
        olayYaz();
      }, 0);
    }, 0);
  }
  let geceSira = 0;

  /* ---- Levha (her zaman değişiminde) ---- */
  function levhaCiz() {
    const an = secilenAn();
    const gzl = durum.gzl;
    const gunes = G.cisimAltAz('Sun', an, gzl);
    const ay = G.ayDurumu(an, gzl);
    const gezegenler = G.GEZEGENLER.map(c => {
      const k = G.cisimAltAz(c, an, gzl);
      return { ad: G.TR_AD[c], alt: k.alt, az: k.az, kadir: G.gezegenKadir(c, an) };
    }).filter(g => g.kadir <= 6.5);
    const radyantlar = durum.meteorDurum.filter(m => m.aktif && m.radyant_ra != null).map(m => ({ ad: m.ad, ra: m.radyant_ra, dec: m.radyant_dec }));
    /* Uydular: veri yüklüyse seçili an için konumlar, 60 dk içinde başlayan görünür geçişlerin yolu */
    const uydular = [], uyduYollari = [];
    if (durum.uydular) {
      const k = U.konum();
      /* yol hesabı uydu başına ~40 ms: kaydırıcı akıcı kalsın diye 5 dakikalık dilimlerde önbellekle */
      const dilim = Math.floor(an / 300e3) + '|' + k.enlem + '|' + k.boylam;
      if (durum.uyduDilim !== dilim) {
        durum.uyduDilim = dilim;
        durum.uyduGecis = durum.uydular.map(u => { try { return Uydu.yakinGecis(u, k, an); } catch (h) { return null; } });
      }
      durum.uydular.forEach((u, i) => {
        try { const d = Uydu.anlik(u, k, an); if (d) uydular.push(Object.assign({ ad: u.ad, kisa: u.kisa }, d)); } catch (h) { /* bu uydu çizilmez */ }
        const g = durum.uyduGecis[i];
        if (g && g.gorunur && g.bitis.t > an) uyduYollari.push({ kisa: u.kisa, yol: g.yol, gBas: g.gBas });
      });
    }
    durum.harita.ciz({ zaman: an, gzl, gunes, ay, gezegenler, hedefler: durum.veri.hedefler, radyantlar, limitKadir: durum.limitKadir, uydular, uyduYollari });
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
      s.push(`Güneş <strong>${U.ek(U.saat(g.batis), 'de')}</strong> batıyor; gökyüzü <strong>${U.ek(U.saat(g.astroSon), 'de')}</strong> tam kararıyor ve ${U.ek(U.saat(g.astroBas), 'e')} kadar karanlık kalıyor.` + (g.dogus ? ` Güneş ${U.ek(U.saat(g.dogus), 'de')} doğuyor.` : ''));
    } else if (g.batis) {
      s.push(`Güneş ${U.ek(U.saat(g.batis), 'de')} batıyor ama bu gece tam karanlık olmuyor; Güneş ufkun yeterince altına inmiyor.`);
    } else {
      /* Kutup günü / kutup gecesi: öğleden sonraki 36 saatte batış yok */
      const ogleAlt = G.cisimAltAz('Sun', g.ogle, durum.gzl).alt;
      s.push(ogleAlt > 0 ? 'Güneş bugün batmıyor (kutup günü); gökyüzü hiç kararmayacak.' :
        'Güneş bugün doğmuyor (kutup gecesi); ' + (ogleAlt > -6 ? 'öğle çevresinde gök alacakaranlıkla aydınlanır, günün geri kalanı karanlık.' : ogleAlt > -18 ? 'öğle çevresinde hafif bir alacakaranlık olur, günün geri kalanı karanlık.' : 'karanlık gün boyu sürüyor.'));
    }
    let ayCumle = `Ay: ${ay.ad}, %${Math.round(ay.oran * 100)} aydınlık`;
    const olaylar = [];
    if (ay.dogus) olaylar.push(`${U.ek(U.saat(ay.dogus), 'de')} doğuyor`);
    if (ay.batis) olaylar.push(`${U.ek(U.saat(ay.batis), 'de')} batıyor`);
    if (olaylar.length) {
      const sirali = [[ay.dogus, olaylar.find(x => x.includes('doğuyor'))], [ay.batis, olaylar.find(x => x.includes('batıyor'))]]
        .filter(x => x[0]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
      ayCumle += '; ' + sirali.join(', ') + '.';
    } else ayCumle += '.';
    if (ayAydinlatirMi()) ayCumle += ' Işığı sönük bulutsu ve galaksileri bastıracak; kümeler, çift yıldızlar ve gezegenler için sorun değil.';
    else if (ay.oran < 0.25) ayCumle += ' Sönük cisimler için iyi bir gece.';
    s.push(ayCumle);
    /* "Çıplak gözle" eşiği, levhadaki gökyüzü ayarıyla aynı (şehirde Uranüs çıplak gözle görülmez) */
    const gorunen = durum.gezegenGece.filter(p => p.gorunur && p.kadir <= durum.limitKadir);
    if (gorunen.length) {
      const adlar = gorunen.sort((a, b) => a.kadir - b.kadir).map(p => p.ad);
      const son = adlar.pop();
      s.push(`Çıplak gözle görülebilecek gezegenler: ${adlar.length ? adlar.join(', ') + ' ve ' + son : son}.`);
    } else s.push('Bu gece çıplak gözle görülecek bir gezegen yok.');
    const aktif = durum.meteorDurum.filter(m => m.aktif);
    if (aktif.length) {
      s.push('Etkin meteor yağmuru: ' + aktif.map(m => `${U.kacis(m.ad)} (zirve ${U.kacGun(m.gunFark).replace('bugün', 'bu gece')})`).join(', ') + '.');
    }
    el.querySelector('#gkOzet').innerHTML = s.map(x => '<p class="okunur">' + x + '</p>').join('');
    sesYenile();
  }

  function gezegenYaz() {
    const ul = el.querySelector('#gkGezegen');
    ul.innerHTML = durum.gezegenGece.map(p => {
      const td = U.kacis(tdAd(p.takimyildiz));
      const dogBat = [p.dogus ? 'doğuş ' + U.saat(p.dogus) : null, p.batis ? 'batış ' + U.saat(p.batis) : null].filter(Boolean).join(' · ');
      const arac = p.kadir <= durum.limitKadir ? '<span class="rozet iyi">çıplak göz</span>' : (p.kadir <= 9 ? '<span class="rozet">dürbün</span>' : '<span class="rozet">teleskop</span>');
      if (!p.gorunur) {
        const g = durum.gece, kutupGunu = !g.batis && G.cisimAltAz('Sun', g.ogle, durum.gzl).alt > 0;
        const neden = p.gunesAcisi < 18 ? `Güneş'e çok yakın (${U.derece(p.gunesAcisi)})` : kutupGunu ? 'Güneş bu gece batmıyor' : (g.sivilSon || !g.batis ? 'karanlıkta ufka yakın kalıyor' : 'gök kararmıyor ve alacakaranlıkta ufka yakın kalıyor');
        const ev = (p.cisim === 'Mercury' || p.cisim === 'Venus') ? ` %${Math.round(A.Illumination(p.cisim, durum.gece.ogle).phase_fraction * 100)} aydınlık.` : '';
        return `<li class="sonuk"><span class="ad">${p.ad}</span><span class="sag">${U.kadir(p.kadir)} kadir</span><span class="alt">Bu gece uygun değil: ${neden}. ${td} takımyıldızında.${ev}</span></li>`;
      }
      const t = p.tepe;
      /* Evre (Merkür, Venüs: dürbünde hilal görülebilir) ve Satürn'ün halka açıklığı — JPL Horizons ile karşılaştırıldı */
      const isik = A.Illumination(p.cisim, t.zaman);
      let ek = '';
      if (p.cisim === 'Mercury' || p.cisim === 'Venus') ek = ` · %${Math.round(isik.phase_fraction * 100)} aydınlık`;
      if (p.cisim === 'Saturn' && isik.ring_tilt != null) ek = ` · halkalar ${U.sayi(Math.abs(isik.ring_tilt), 1)}° açık (en fazla ≈27°; 0'a yakınken kenardan görünür)`;
      return `<li><span class="ad">${p.ad}${arac}</span><span class="sag">en iyi ${U.saat(t.zaman)} · ${U.derece(t.alt)} ${G.yon(t.az)}</span>
        <span class="alt">${U.kadir(p.kadir)} kadir · ${td} takımyıldızında · ${dogBat}${ek}${p.cisim === 'Jupiter' ? jupiterSema(t.zaman) : ''}${defterBag('cisim:' + p.cisim)}</span></li>`;
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
      <span class="kucuk">Uydular ${U.ek(U.saat(zaman), 'de')}: doğuda (solda) ${dogu.join(', ') || 'yok'}; batıda (sağda) ${bati.join(', ') || 'yok'}.${notlar.length ? ' ' + notlar.join('; ') + '.' : ''} 7×50 dürbünde Jüpiter'in yanında küçük noktalar olarak görünürler.</span>
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
    el.querySelector('#gkHedef').innerHTML = iyi.length ? iyi.map(hedefSatir).join('') : '<li><span class="bos">' + (durum.gece.karanlikYok ? 'Bu gece gök yeterince kararmıyor (Güneş ufkun 6°\'den fazla altına inmiyor); kümeler ve bulutsular aydınlık gökte kaybolur.' : 'Bu gece karanlıkta 20°\'yi geçen hedef yok.') + '</span></li>';
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
    if (m.radyantTepe && !tam) parca.push(`radyant ${m.radyantGece === 'bu gece' ? 'bu gece' : 'zirve gecesi'} en çok ${U.derece(m.radyantTepe.alt)}`);
    if (!tam && m.gunFark > 0) parca.push(takvimBag({ baslik: m.ad + ' meteor yağmuru zirvesi', bas: zirve, aciklama: 'IMO takvimine göre zirve. ZHR ' + m.zhr + '; zirvede Ay %' + Math.round(ayOran * 100) + ' aydınlık. (Urania)' }));
    const tahminNot = m.tahmini ? `<br><span class="kucuk">Zirve, IMO ${m.tahmini} takvimindeki Güneş boylamından (λ☉ ${U.sayi(m.gunes_boylami, 2)}°) hesaplandı; IMO bu yılın takvimini yayımlayınca birkaç saat değişebilir.</span>` : '';
    return `<li${!m.aktif && tam ? ' class="sonuk"' : ''}><span class="ad">${U.kacis(m.ad)}${rozet}</span><span class="sag">${m.zhr != null ? 'ZHR ' + U.kacis(String(m.zhr).split(' ')[0]) : ''}</span><span class="alt">${parca.filter(Boolean).join(' · ')}${m.not ? '<br>' + U.kacis(m.not) : ''}${tahminNot}</span></li>`;
  }

  function meteorYaz() {
    const ds = durum.meteorDurum;
    const one = ds.filter(m => m.aktif || (m.gunFark > 0 && m.gunFark < 75)).sort((a, b) => (b.aktif - a.aktif) || (a.gunFark - b.gunFark));
    el.querySelector('#gkMeteor').innerHTML = one.length ? one.map(m => meteorSatir(m, false)).join('') : '<li><span class="bos">Önümüzdeki 75 günde büyük bir yağmur yok.</span></li>';
    /* Takvimin tamamı: son bir ay ile önümüzdeki bir yıl (veri ve hesaplanan yıllar birlikte uzun olmasın) */
    const simdi = Date.now();
    el.querySelector('#gkMeteorTum').innerHTML = ds.filter(m => { const z = new Date(m.zirve_utc).getTime(); return z > simdi - 31 * 86400e3 && z < simdi + 366 * 86400e3; }).sort((a, b) => new Date(a.zirve_utc) - new Date(b.zirve_utc)).map(m => meteorSatir(m, true)).join('');
  }

  /* "Takvime ekle": olay listesinden ve meteor zirvelerinden .ics */
  /* Her düğmeye tekil numara: listeler ayrı ayrı yeniden çizildiğinde eski düğme başka olaya işaret etmesin */
  const takvimOlaylari = new Map();
  let takvimNo = 0;
  function takvimBag(o) {
    takvimNo++;
    takvimOlaylari.set(takvimNo, o);
    if (takvimOlaylari.size > 1500) { for (const k of takvimOlaylari.keys()) { if (k > takvimNo - 1000) break; takvimOlaylari.delete(k); } }
    return `<button type="button" class="bag takvim-bag" data-takvim="${takvimNo}">Takvime ekle</button>`;
  }
  function olayYaz() {
    if (!durum.olaylar) { el.querySelector('#gkOlay').innerHTML = '<li><span class="bos">Hesaplanıyor…</span></li>'; return; }
    const ls = durum.olaylar.slice(0, 12);
    el.querySelector('#gkOlay').innerHTML = ls.map(o => `<li${o.gorunur === false ? ' class="sonuk"' : ''}><span class="ad">${U.kacis(o.baslik)}</span><span class="sag">${U.gun(o.zaman)}</span><span class="alt">${o.not ? U.kacis(o.not) + '<br>' : ''}${U.gunHafta(o.zaman)}, ${U.saat(o.zaman)} · ${takvimBag({ baslik: o.baslik, bas: o.zaman, aciklama: (o.not || '') + ' (Urania, ' + U.konum().ad + ')' })}</span></li>`).join('');
  }

  /* "20:37–20:37" yerine: aynı dakikaya düşen kısa geçişte süre */
  function aralik(a, b) {
    return U.saat(a) === U.saat(b) ? `${U.saat(a)}, yalnız ${Math.round((b - a) / 1000)} sn` : `${U.saat(a)}–${U.saat(b)}`;
  }

  /* ---- Uydu geçişleri (gecelere değil "şimdi"ye bağlı; konum değişince yeniden) ---- */
  let issAnahtar = '', issSira = 0;
  async function issYaz(zorla) {
    const k = U.konum();
    /* 10 dakikalık dilim: geçmiş geçişler listeden düşsün */
    const anahtar = k.enlem + '|' + k.boylam + '|' + Math.floor(Date.now() / 600e3);
    if (!zorla && anahtar === issAnahtar) return;
    issAnahtar = anahtar;
    const sira = ++issSira;
    const guncelMi = () => { const kk = U.konum(); return sira === issSira && kk.enlem === k.enlem && kk.boylam === k.boylam; };
    const ul = el.querySelector('#gkIss'), kay = el.querySelector('#gkIssKaynak');
    let uydular;
    try { uydular = await Uydu.uydular(); durum.uydular = uydular; durum.uyduDilim = null; } catch (e) {
      if (!guncelMi()) return;
      /* issAnahtar sıfırlanmaz: yeniden deneme en erken bir sonraki 10 dakikalık dilimde, CelesTrak'a ise uydu.js'teki 2 saatlik bekleme sonrasında */
      durum.uyduGecisleri = null; planYaz();
      ul.innerHTML = '<li><span class="bos">Yörünge verisi alınamadı (internet yok ya da CelesTrak yanıt vermedi). Bir süre sonra kendiliğinden yeniden denenir.</span></li>';
      kay.textContent = ''; return;
    }
    await new Promise(r => setTimeout(r, 30)); // önce sayfa çizilsin
    if (!guncelMi()) return;
    levhaCiz();
    let ls = [];
    for (const u of uydular) {
      /* Starlink dizileri birkaç günde dağılır ve sönükleşir: yalnız 3 gün */
      const g = await Uydu.gecislerParcali(u, k, new Date(), u.dizi ? 3 : 5);
      if (!guncelMi()) return; // bu arada konum değiştiyse eski yerin geçişlerini yazma
      ls = ls.concat(g.filter(x => x.gorunur && x.gBit.t > new Date() && x.gBit.t - x.gBas.t >= 30e3)); // yarım dakikadan kısa görünürlük: kaçırılır
    }
    ls.sort((a, b) => a.gBas.t - b.gBas.t);
    durum.uyduGecisleri = ls;
    planYaz();
    ul.innerHTML = ls.length ? ls.map(g => {
      const b = g.gBas, s = g.gBit, t = g.gTepe, u = g.uydu;
      const yon = d => G.YON_UZUN[G.yon(d.az)];
      const basM = `${yon(b)} yönünde ${U.derece(b.alt)} yükseklikte ` + ({ ufuk: 'belirir', golge: 'Dünya\'nın gölgesinden çıkıp belirir', karanlik: 'gökyüzü yeterince kararınca seçilir' }[g.basNeden] || 'belirir');
      const sonM = `${yon(s)} yönünde ${U.derece(s.alt)} ` + ({ ufuk: 'yüksekliğin altına alçalır', golge: 'yükseklikte Dünya\'nın gölgesine girip kaybolur', aydinlik: 'yükseklikte gökyüzü aydınlandığı için seçilmez olur' }[g.sonNeden] || 'yükseklikte kaybolur');
      const metin = `${aralik(b.t, s.t)} · ${basM}, en çok ${U.derece(t.alt)} (${yon(t)}), ${sonM}`;
      const diziNot = u.dizi ? `<br><span class="kucuk">Yeni fırlatılmış ${u.dizi.adet} uydu art arda dizili noktalar hâlinde geçer; dizinin başı ile sonu arasında birkaç dakika olabilir${u.dizi.aralikDk >= 2 ? ' (bu dizide yaklaşık ' + u.dizi.aralikDk + ' dk)' : ''}. Saatler dizinin ortası içindir ve kabadır. Alçak yörüngedeyken ortalama 2,7 kadir civarındadır; yükseldikçe 6,5 kadire sönükleşir (Mallama ve ark. 2024) ve dizi genellikle ilk birkaç günde dağılır.</span>` : '';
      const parlak = g.enParlak ? `En parlak ${U.kadir(g.enParlak.kadir)} kadir. ` : '';
      return `<li><span class="ad">${U.kacis(u.kisa)} · ${U.kacis(U.gunHafta(b.t))}</span><span class="sag">en çok ${U.derece(t.alt)}</span><span class="alt">${parlak}${metin}${diziNot}<br>${takvimBag({ baslik: u.kisa + ' geçişi', bas: new Date(b.t.getTime() - 60e3), son: new Date(s.t.getTime() + 60e3), aciklama: u.ad + ': ' + metin + '. (Urania, ' + k.ad + ')' })}</span></li>`;
    }).join('') : '<li><span class="bos">Önümüzdeki 5 günde buradan görünür bir geçiş yok.</span></li>';
    if (uydular.eksik && uydular.eksik.length) ul.insertAdjacentHTML('afterbegin', '<li><span class="bos">' + U.kacis(uydular.eksik.join(' ve ')) + ' yörünge verisi alınamadı; bu liste eksik. Bir süre sonra kendiliğinden yeniden denenir.</span></li>');
    const yaslar = uydular.map(u => (Date.now() - Uydu.donem(u)) / 86400e3);
    const yas = yaslar.length ? Math.max(...yaslar) : null;
    const eski = uydular.some(u => u.eski);
    kay.innerHTML = `Yörünge öğeleri: <a href="https://celestrak.org/" target="_blank" rel="noopener">CelesTrak</a>${yas != null ? ', ' + U.sayi(yas, 1) + ' günlük' : ''}${yas > 7 ? ' — eski; saatler birkaç dakika kayabilir' : ''}${eski ? ' (çevrimdışı ya da CelesTrak yanıt vermedi; önbellekten)' : ''}. Hesap: SGP4 (satellite.js). Parlaklık tahmini Heavens-Above'ın yöntemiyle uyumlu (onların değerlerinden en çok 0,1 kadir farklı); uydunun duruşu bilinmediği için kabadır. Küçük sayı daha parlak; karşılaştırma için Sirius −1,4.`;
  }

  /* ---- Algol ---- */
  function algolYaz() {
    const ef = durum.veri.algol;
    if (!durum.algol) { el.querySelector('#gkAlgol').innerHTML = '<li><span class="bos">Hesaplanıyor…</span></li>'; return; }
    const ls = durum.algol.filter(m => m.gorunur && m.zaman > new Date(Date.now() - 2 * 3600e3)).slice(0, 8);
    el.querySelector('#gkAlgol').innerHTML = (ls.length ? ls.map(m => {
      const metin = `En sönük anı ${U.saat(m.zaman)} (±${ef.hata_dk} dk); Algol o sırada ${U.derece(m.alt)} yükseklikte, ${G.YON_UZUN[G.yon(m.az)]}. Bundan önceki yaklaşık 5 saatte yavaş yavaş sönükleşir, sonraki 5 saatte eski parlaklığına döner; en iyisi en sönük andan 1–2 saat önce başlayıp yanındaki yıldızlarla karşılaştırarak izlemek.`;
      return `<li><span class="ad">${U.kacis(U.gunHafta(m.zaman))}</span><span class="sag">en sönük ${U.saat(m.zaman)}</span><span class="alt">${metin}<br>${takvimBag({ baslik: 'Algol en sönük', bas: new Date(m.zaman.getTime() - 90 * 60e3), son: new Date(m.zaman.getTime() + 60 * 60e3), aciklama: metin + ' (Urania, ' + U.konum().ad + ')' })} ${defterBag('yildiz:Algol')}</span></li>`;
    }).join('') : '<li><span class="bos">Önümüzdeki 30 günde en sönük anı buradan karanlıkta görülen bir minimum yok.</span></li>') +
      `<li class="kaynak-satir"><span class="kaynak">Efemeris: <a href="${U.guvenliUrl(ef.kaynak_url)}" target="_blank" rel="noopener">AAVSO VSX</a> (HJD ${ef.donem_hjd} + ${U.sayi(ef.periyot, 6)}·E), Dünya–Güneş ışık süresi düzeltmesiyle; 2020–2025'te gözlenmiş CCD minimumlarıyla 6 dakika içinde uyumlu (JAAVSO). Karşılaştırma yıldızlarının parlaklığı Hipparcos.</span></li>`;
  }

  /* ---- Ay örtmeleri: konum değişince arka planda, 10 günlük dilimlerle ---- */
  let ortmeSira = 0;
  const UNLU = new Set(['Aldebaran', 'Spica', 'Antares', 'Pollux', 'Regulus', 'Elnath', 'Alhena', 'Nunki', 'Porrima', 'Zubenelgenubi']);
  function yildizAdi(h) {
    if (h.gezegen) return h.ad;
    const td = tdAd(h.c);
    if (h.ad && (UNLU.has(h.ad) || h.u)) return h.ad;
    return (h.d ? h.d + ' ' + h.c : h.ad) + (h.ad ? ' (' + h.ad + ')' : '') + (td && td !== h.c ? ', ' + td : '');
  }
  /* Dürbünle izlenebilir mi: Ay'ın parıltısı sönük yıldızı boğar.
     Karanlık kenar: Occult'un (D. Herald; Schaefer, Bulder ve Bourgeois 1992 görünürlük modeli) 5 cm
     açıklık sütunu — ince hilalde (%8) 6,6, dolunaya yakın (%99) 4,4 kadir; aradaki değerler doğrusal
     ara değer (bizim çıkarımımız). Boynuza 2,7°'den yakınsa 2,8, 4,7°'den yakınsa 4,5 kadir (aynı kaynak).
     Aydınlık kenar: IOTA Gözlemci El Kitabı'ndaki kaba sınır ≈3,5 kadir.
     Model en uygun büyütmeyi (≈10×/cm) varsayar; 7× dürbünde sınırdaki olaylar daha zor olabilir.
     Kaynaklar: arastirma/ortme_esik_tahmin.md */
  function sinirKadir(o, b) {
    if (b.aydinlik) return 3.5;
    const f = Math.min(1, Math.max(0, (o.ayOran - 0.08) / 0.91));
    let s = 6.6 + (4.4 - 6.6) * f;
    if (b.ucAcisi < 2.7) s = Math.min(s, 2.8);
    else if (b.ucAcisi < 4.7) s = Math.min(s, 4.5);
    return s;
  }
  function kenarIyi(o, b) {
    if (!b || !b.gorunur) return false;
    if (o.hedef.gezegen) return true;
    return o.hedef.v <= sinirKadir(o, b);
  }
  /* Occult'taki gibi: yıldız sınırdan 1 kadirden az parlaksa "sınırda" */
  function sinirda(o, b) { return !o.hedef.gezegen && o.hedef.v > sinirKadir(o, b) - 1; }
  function ortmeGorunurMu(o) { return kenarIyi(o, o.girisBilgi) || kenarIyi(o, o.cikisBilgi); }
  /* Arama Web Worker'da (ortme_isci.js); Worker yoksa ana iş parçacığında günlük dilimlerle.
     Hep "şimdi"den 90 gün: seçili geceden bağımsız, konum ve UTC günü değişince yeniden. */
  let isci = null;
  function ortmeAra(k, bas, gun, sira) {
    const yildizlar = durum.veri.ortmeYildiz;
    if (typeof Worker !== 'undefined') {
      try {
        if (!isci) isci = new Worker('./ortme_isci.js');
        const w = isci;
        return new Promise((coz, red) => {
          /* İşçi yüklenemez ya da yanıt vermezse yedeğe (ana iş parçacığı) düş; liste "Hesaplanıyor…"da kalmasın */
          const bitir = () => { clearTimeout(zs); w.removeEventListener('message', al); w.removeEventListener('error', hata); w.removeEventListener('messageerror', hata); };
          const hata = () => { bitir(); if (isci === w) { w.terminate(); isci = null; } coz(yedek()); };
          const zs = setTimeout(hata, 60000);
          const al = e => {
            if (e.data.kimlik !== sira) return;
            bitir();
            if (e.data.hata) red(new Error(e.data.hata)); else coz(e.data.ls);
          };
          w.addEventListener('message', al);
          w.addEventListener('error', hata);
          w.addEventListener('messageerror', hata);
          w.postMessage({ kimlik: sira, yildizlar, enlem: k.enlem, boylam: k.boylam, yukseklik: k.yukseklik || 0, bas: bas.getTime(), gun });
        });
      } catch (h) { isci = null; /* aşağıdaki yedeğe düş */ }
    }
    return yedek();
    function yedek() { return (async () => {
      const gzl = G.gozlemci(k.enlem, k.boylam, k.yukseklik || 0);
      let ls = [];
      for (let d = 0; d < gun; d++) {
        await new Promise(r => setTimeout(r, 0));
        if (sira !== ortmeSira) return [];
        ls = ls.concat(Ortme.ortmeler(yildizlar, gzl, new Date(bas.getTime() + d * 86400e3), 1));
      }
      return ls;
    })(); }
  }
  async function ortmeYaz() {
    const k = U.konum();
    const anahtar = k.enlem + '|' + k.boylam + '|' + Math.floor(Date.now() / 86400e3);
    if (durum.ortmeAnahtar === anahtar) { if (durum.ortmeler) { ortmeListe(); planYaz(); } return; }
    durum.ortmeAnahtar = anahtar;
    const sira = ++ortmeSira;
    durum.ortmeler = null;
    el.querySelector('#gkOrtme').innerHTML = '<li><span class="bos">Hesaplanıyor…</span></li>';
    let ls;
    try { ls = await ortmeAra(k, new Date(Date.now() - 12 * 3600e3), 90, sira); } catch (h) {
      if (sira !== ortmeSira) return;
      if (window.Tani) Tani.hataEkle('örtme: ' + h.message);
      durum.ortmeAnahtar = null;
      el.querySelector('#gkOrtme').innerHTML = '<li><span class="bos">Örtmeler hesaplanamadı.</span></li>';
      return;
    }
    if (sira !== ortmeSira) return;
    ls.forEach(o => ['giris', 'cikis'].forEach(x => { if (o[x] && !(o[x] instanceof Date)) o[x] = new Date(o[x]); }));
    /* dilim sınırında iki kez bulunanları tekilleştir (aynı yıldız/gezegen, bir saatten yakın) */
    const kimlik = h => h.gezegen || h.hip;
    const tek = [];
    ls.forEach(o => {
      const t = o.giris || o.cikis;
      const i = tek.findIndex(x => kimlik(x.hedef) === kimlik(o.hedef) && Math.abs((x.giris || x.cikis) - t) < 3 * 3600e3);
      if (i < 0) tek.push(o);
      else if (o.giris && o.cikis && !(tek[i].giris && tek[i].cikis)) tek[i] = o;   // iki ucu da bulunan kayıt kalsın
    });
    tek.forEach(o => { o.ad = yildizAdi(o.hedef); });
    /* Ülker üyeleri, seçilemeyecek kadar sönük olsalar da aynı gecenin listesinde dursun (grup içinde not düşülür) */
    durum.ortmeler = tek.filter(o => ortmeGorunurMu(o) || (o.hedef.u && ((o.girisBilgi && o.girisBilgi.gorunur) || (o.cikisBilgi && o.cikisBilgi.gorunur))));
    durum.ortmeler.forEach(o => ['girisBilgi', 'cikisBilgi'].forEach(k => { if (o[k]) o[k].iyi = kenarIyi(o, o[k]); }));
    ortmeListe();
    planYaz();
  }
  function ortmeListe() {
    const ul = el.querySelector('#gkOrtme');
    const gruplar = Ortme.ulkerGrupla(durum.ortmeler.filter(o => (o.cikis || o.giris) > new Date()));
    const satir = (o, kisa) => {
      const p = [];
      ['giris', 'cikis'].forEach(k => {
        const b = o[k + 'Bilgi']; if (!o[k] || !b) return;
        const ken = b.aydinlik ? 'aydınlık' : 'karanlık';
        const fiil = k === 'giris' ? 'kaybolur' : 'belirir';
        p.push(kenarIyi(o, b) ? `${U.saat(o[k])} Ay'ın ${ken} kenarında ${fiil}` + (sinirda(o, b) ? ' (dürbünle sınırda)' : '') + (kisa ? '' : ` (Ay ${U.derece(b.alt)}, ${G.YON_UZUN[G.yon(b.az)]})`) : (b.gorunur ? `${k === 'giris' ? 'kayboluşu' : 'belirişi'} ${U.saat(o[k])}, ${ken} kenarda: Ay'ın parıltısında dürbünle seçilmez` : `${k === 'giris' ? 'kayboluşu' : 'belirişi'} buradan görülmez`));
      });
      return p.join('; ');
    };
    const html = gruplar.filter(g => !g.ulker || g.uyeler.some(ortmeGorunurMu)).slice(0, 12).map(g => {
      if (g.ulker) {
        const uy = g.uyeler;
        const iyi = uy.find(ortmeGorunurMu), t = iyi.giris || iyi.cikis;
        const metin = uy.map(u => `${U.kacis(u.ad)} (${U.kadir(u.hedef.v)}): ${satir(u, true)}`).join('<br>');
        const ilk = uy[0], son = uy[uy.length - 1];
        return `<li><span class="ad">Ülker örtmesi · ${U.kacis(U.gunHafta(t))}</span><span class="sag">${U.saat(t)}</span><span class="alt">Ay, Ülker kümesinin önünden geçiyor; yıldızlar birer birer kaybolup belirir. Ay %${Math.round(ilk.ayOran * 100)} aydınlık.<br>${metin}<br>${takvimBag({ baslik: 'Ülker örtmesi', bas: new Date(t.getTime() - 15 * 60e3), son: new Date((son.cikis || son.giris).getTime() + 10 * 60e3), aciklama: 'Ay Ülker\'in önünden geçiyor. ' + uy.map(u => u.ad + ': ' + satir(u, true)).join('; ') + ' (Urania, ' + U.konum().ad + ')' })} ${defterBag('hedef:M45')}</span></li>`;
      }
      const o = g, t = o.giris || o.cikis;
      const metin = satir(o, false) + `. Ay %${Math.round(o.ayOran * 100)} aydınlık` + (o.hedef.gezegen ? '' : `; yıldız ${U.kadir(o.hedef.v)} kadir`) + '.';
      return `<li><span class="ad">${U.kacis(o.ad)} · ${U.kacis(U.gunHafta(t))}</span><span class="sag">${U.saat(t)}${o.cikis && o.giris ? '–' + U.saat(o.cikis) : ''}</span><span class="alt">${metin}<br>${takvimBag({ baslik: o.ad + ' örtmesi', bas: new Date(t.getTime() - 15 * 60e3), son: new Date((o.cikis || t).getTime() + 10 * 60e3), aciklama: o.ad + ': ' + metin + ' (Urania, ' + U.konum().ad + ')' })}</span></li>`;
    }).join('');
    ul.innerHTML = (html || '<li><span class="bos">Önümüzdeki 90 günde buradan görülebilecek bir örtme yok.</span></li>') +
      '<li class="kaynak-satir"><span class="kaynak">Saatler dakikaya yuvarlı: Ay\'ın kenarındaki dağlar ve vadiler anı birkaç saniye kaydırır. Hesap cihazında; yıldızlar Hipparcos, Ay Astronomy Engine, ΔT IERS Bulletin A. Karşılaştırma: yıldızlarda Skyfield (JPL DE421) ile çoğunlukla 4 sn içinde; gezegenlerde Occult tahminleriyle (IOTA) 6 sn, Venüs Dünya\'ya yakınken 25 sn. Görünürlük sınırı: Occult\'un 5 cm açıklık tablosu.</span></li>';
  }

  /* ---- Bu gecenin planı ---- */
  function planYaz() {
    const ol = el && el.querySelector('#gkPlan'); if (!ol || !durum.gece) return;
    const p = Plan.olustur({ gzl: durum.gzl, gece: durum.gece, hedefDurum: durum.hedefDurum, gezegenGece: durum.gezegenGece, ay: durum.ayGece,
      limitKadir: durum.limitKadir, hava: durum.havaSaatler, uyduGecisleri: durum.uyduGecisleri, algol: durum.algolGece, ortmeler: durum.ortmeler, meteorDurum: durum.meteorDurum,
      simdi: durum.gun ? null : new Date(Math.floor(Date.now() / 300e3) * 300e3) });
    durum.plan = p;
    const dugme = el.querySelector('#gkPlanDugme');
    if (!p.maddeler.length) {
      const neden = { 'gunes-batmiyor': 'Bu gece Güneş batmıyor (kutup günü); plan yok.', 'gunes-dogmuyor': 'Güneş bugün doğmuyor (kutup gecesi). Plan, gece ile gündüzün değiştiği yerler için hazırlanıyor; listelerdeki saatler yine geçerli.', 'gece-bitti': 'Bu gecenin gözlem saatleri geçti; yeni plan öğleden sonra hazırlanır.', 'karanlik-yok': 'Bu gece gök yeterince kararmıyor; plan yok.' }[p.neden] || 'Bu gece için önerilecek bir şey bulunamadı.';
      ol.innerHTML = `<li><span class="bos">${neden}</span></li>`;
      dugme.hidden = true; return;
    }
    const satirlar = p.maddeler.map(m => {
      const yon = `${U.derece(m.alt)} ${G.YON_UZUN[G.yon(m.az)]}`;
      let ne = '', ek = '';
      if (m.tur === 'gezegen') {
        ne = m.cisim === 'Jupiter' ? 'Dürbünü sabitle; yanındaki küçük noktalar Galileo uyduları.' :
          m.cisim === 'Saturn' ? 'Sarımsı, kırpışmayan bir nokta.' :
          m.cisim === 'Venus' ? `Evresi: %${Math.round(G.A.Illumination('Venus', m.zaman).phase_fraction * 100)} aydınlık.` :
          m.cisim === 'Mercury' ? 'Alacakaranlıkta ufka yakın; ağaç ve bina olmayan bir yön seç.' :
          m.cisim === 'Uranus' ? 'Dürbünde yıldız gibi sönük bir nokta; haritadan yerini bul.' : '';
        ek = defterBag(m.anahtar);
      } else if (m.tur === 'ay') {
        const ay = durum.ayGece;
        ne = ay.oran > 0.08 && ay.oran < 0.92 ? 'Aydınlık ile karanlığın sınırına bak: kraterler orada gölgeleriyle belirgin.' : (ay.oran >= 0.92 ? 'Dolunaya yakın: kraterler gölgesiz, düz görünür; parlak ışınlı kraterlere bak.' : '');
        ek = defterBag(m.anahtar);
      } else if (m.tur === 'hedef') {
        ne = `${U.kacis(m.hedef.turAd)}, ${U.kacis(tdAd(m.hedef.takimyildiz))} takımyıldızında.`;
        ek = defterBag(m.anahtar);
      } else if (m.tur === 'uydu') {
        const g = m.gecis;
        ne = `${aralik(g.gBas.t, g.gBit.t)}: ${G.YON_UZUN[G.yon(g.gBas.az)]} yönünde belirir, en çok ${U.derece(g.gTepe.alt)} yükselir` + (g.enParlak ? `, en parlak ${U.kadir(g.enParlak.kadir)} kadir.` : '.');
      } else if (m.tur === 'algol') {
        ne = `En sönük anı (±${durum.veri.algol.hata_dk} dk). Almach ve δ Persei ile karşılaştır.`;
        ek = defterBag(m.anahtar);
      } else if (m.tur === 'ortme') {
        ne = `Ay'ın ${m.kenar.aydinlik ? 'aydınlık' : 'karanlık'} kenarında.`;
      } else if (m.tur === 'meteor') {
        ne = `Radyant en yüksekte; geniş bir gök alanına çıplak gözle bak.`;
        ek = defterBag(m.anahtar);
      }
      const bulut = m.bulut != null ? `<span class="rozet${m.bulut >= 70 ? ' uyari' : (m.bulut < 30 ? ' iyi' : '')}">bulut %${Math.round(m.bulut)}</span>` : '';
      const bilgi = [m.tur === 'uydu' ? '' : yon, ne].filter(Boolean).join(' · ');
      /* Sesli okuma metni (ham veriden; ekrandaki kaçışlı metinden değil) */
      const neDuz = m.tur === 'hedef' ? `${m.hedef.turAd}, ${tdAd(m.hedef.takimyildiz)} takımyıldızında.` : ne;
      const yer = m.tur === 'uydu' ? '' : `${Math.round(m.alt)} derece yükseklikte, ${YON_DE[G.yon(m.az)]}.`;
      const ses = cumleBirlestir([`Saat ${U.saat(m.zaman)}`, m.ad, yer, neDuz, m.bulut != null ? `Bulut yüzde ${Math.round(m.bulut)}` : '']);
      return `<li class="plan-${m.tur} okunur" data-ses="${U.kacis(ses)}"><span class="saat">${U.saat(m.zaman)}</span><span class="ad">${U.kacis(m.ad)}${bulut}</span><span class="alt">${bilgi}${ek}</span></li>`;
    });
    let ust = '';
    if (p.bulutNot && p.bulutNot.kapali) ust = `<li class="plan-not"><span class="alt">Bulut tahmini bu gece çoğunlukla kapalı (ortalama %${Math.round(p.bulutNot.ort)}). Plan yine de hazır; gök açılırsa saatler geçerli.</span></li>`;
    ol.innerHTML = ust + satirlar.join('');
    dugme.hidden = false;
    ol.querySelectorAll('li.plan-not').forEach(li => li.classList.add('okunur'));
    sesYenile();
  }

  /* Yön adının bulunma hâli (kuzeyde, güneybatıda): sesli okumada "68 derece güneybatı" yerine */
  const YON_DE = { K: 'kuzeyde', KD: 'kuzeydoğuda', D: 'doğuda', GD: 'güneydoğuda', G: 'güneyde', GB: 'güneybatıda', B: 'batıda', KB: 'kuzeybatıda' };
  /* Cümleleri tek noktayla birleştir: sonu noktalı olana ikinci nokta eklenmesin */
  function cumleBirlestir(ls) {
    return ls.map(x => String(x || '').trim()).filter(Boolean).map(x => /[.!?…]$/.test(x) ? x : x + '.').join(' ');
  }

  /* "Bu geceyi dinle": özet, bulut tahmini ve plan sesli. Gökyüzü sekmesi açıkken bağlanır;
     liste yeniden çizilince süren okuma, metin aynıysa bozulmaz (ses.js koru). */
  /* Okunacak metni toplamak sayfa düzenini ölçer (innerText): art arda gelen çağrılar tek seferde, çizimden sonra */
  let sesSayac = null;
  function sesYenile() {
    clearTimeout(sesSayac);
    sesSayac = setTimeout(() => {
      if (!el || el.hidden || !window.Ses) return;
      const c = el.querySelector('#gkSes'); if (!c) return;
      Ses.bagla(el, c, 'gece', { koru: true, dugme: 'Bu geceyi dinle' });
    }, 120);
  }
  function planTakvim() {
    const p = durum.plan; if (!p || !p.maddeler.length) return;
    const ilk = p.maddeler[0].zaman, son = p.maddeler[p.maddeler.length - 1];
    U.icsIndir({ baslik: 'Gözlem planı', bas: new Date(ilk.getTime() - 15 * 60e3), son: new Date((son.son || son.zaman).getTime() + 20 * 60e3),
      aciklama: p.maddeler.map(m => U.saat(m.zaman) + ' ' + m.ad + ' (' + U.derece(m.alt) + ' ' + G.YON_UZUN[G.yon(m.az)] + ')').join('\n') + '\n(Urania, ' + U.konum().ad + ')' });
  }

  /* ---- Bulut tahmini ---- */
  let havaSira = 0;
  async function havaYaz() {
    const kap = el.querySelector('#gkHava');
    const g = durum.gece;
    const bas = g.sivilSon || g.batis, son = g.sivilBas || g.dogus;
    /* Sıra numarası ve eski veri her çağrıda sıfırlanır: önceki gecenin isteği geç gelirse yazılmasın */
    const sira = ++havaSira;
    durum.havaSaatler = null;
    if (!bas || !son) { kap.innerHTML = ''; return; }
    const k = U.konum();
    kap.innerHTML = '<p class="soluk kucuk">Bulut tahmini alınıyor…</p>';
    let h;
    try { h = await Hava.getir(k.enlem, k.boylam); } catch (e) {
      if (sira !== havaSira) return;
      planYaz();
      kap.innerHTML = '<p class="soluk kucuk">Bulut tahmini alınamadı (internet yok ya da servis yanıt vermedi). Gök hesapları bundan etkilenmez.</p>';
      return;
    }
    if (sira !== havaSira) return;
    durum.havaSaatler = h.saatler;
    planYaz();
    setTimeout(sesYenile, 0);   // bulut cümlesi aşağıda yazılınca
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
        yCumle = `Yağış riski: ${U.saat(new Date(ilk.getTime() - 3600e3))}–${U.saat(son)} arası olasılık ${U.ek('%' + y.enCok, 'e')} çıkıyor` + (y.toplam >= 0.1 ? `, gece toplamı yaklaşık ${U.sayi(y.toplam, 1)} mm.` : '.');
      } else if (y.enCok >= 15) yCumle = `Hafif yağış olasılığı var (en çok %${y.enCok}).`;
      else yCumle = `Yağış beklenmiyor (olasılık en çok %${y.enCok}).`;
    }
    kap.innerHTML = `<p class="hava-cumle okunur">${cumle}${yCumle ? '<br>' + yCumle : ''}</p>
      <div class="hava-cubuklar" aria-label="Saatlik bulut oranı">${cubuk}</div>
      <p class="kucuk" id="gkHavaDetay" aria-live="polite"></p>
      <p class="kaynak">Gri çubuk bulut oranı, altındaki mavi çubuk yağış olasılığı; bir saate dokununca ayrıntısı çıkar. ${h.eski ? 'Çevrimdışı: son güncelleme ' + U.saat(h.alindi) + ', ' + U.gun(h.alindi) + '. ' : ''}${kaynak}</p>`;
  }

  /* planBekle: plan, Algol hesabından sonra ayrıca yazılır (ilk açılışta uzun görev bölünsün) */
  function listeleriYaz(planBekle) {
    ozetYaz(); gezegenYaz(); hedefYaz(); meteorYaz(); olayYaz(); algolYaz();
    if (planBekle) { const ol = el.querySelector('#gkPlan'); if (ol) ol.innerHTML = '<li><span class="bos">Hazırlanıyor…</span></li>'; el.querySelector('#gkPlanDugme').hidden = true; }
    else planYaz();
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
    if (s) s.textContent = k.ad + ' (' + U.sayi(k.enlem, 2) + '°, ' + U.sayi(k.boylam, 2) + '°) · ' + kaynak + (k.saatDilimi !== 'Europe/Istanbul' || k.dilimYaklasik ? ' · saatler: ' + U.dilimAdi(k.saatDilimi) + (k.dilimYaklasik && !/yaklaşık/.test(U.dilimAdi(k.saatDilimi)) ? ' (boylamdan yaklaşık; yaz saati ve sınırlar hesaba katılmadı)' : '') : '');
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
    el.querySelectorAll('#gkKEnlem, #gkKBoylam').forEach(i => i.removeAttribute('aria-invalid'));
    const oto = el.querySelector('#gkKOto');
    oto.checked = U.otoAcik();
    el.querySelector('#gkKElle').hidden = oto.checked;
    if (p.showModal) p.showModal(); else p.setAttribute('open', '');
  }
  /* Sıkı okuma: "41,5abc", "41,0,5", "1e1" kabul edilmez; ekranda kullanılan "−" (U+2212) eksi sayılır */
  function sayiOku(s) {
    const t = String(s).trim().replace(/\u2212/g, '-');
    return /^[-+]?\d+([.,]\d+)?$/.test(t) ? Number(t.replace(',', '.')) : NaN;
  }
  function konumGecerli() {
    const enlem = sayiOku(el.querySelector('#gkKEnlem').value), boylam = sayiOku(el.querySelector('#gkKBoylam').value);
    const e = enlem >= -90 && enlem <= 90, b = boylam >= -180 && boylam <= 180;
    el.querySelector('#gkKEnlem').setAttribute('aria-invalid', String(!e));
    el.querySelector('#gkKBoylam').setAttribute('aria-invalid', String(!b));
    return e && b ? { enlem, boylam } : null;
  }
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
    /* Geçersiz girişte panel kapanmaz, otomatik konum ayarı da değişmez */
    el.querySelector('#gkKKaydet').addEventListener('click', e => {
      if (el.querySelector('#gkKOto').checked || konumGecerli()) return;
      e.preventDefault();
      el.querySelector('#gkKDurum').textContent = 'Enlem −90 ile 90, boylam −180 ile 180 arasında bir sayı olmalı (ör. 41,02 ya da −33,87).';
      (el.querySelector('#gkKEnlem[aria-invalid="true"]') || el.querySelector('#gkKBoylam')).focus();
    });
    p.addEventListener('close', () => {
      if (p.returnValue !== 'kaydet') return;
      if (el.querySelector('#gkKOto').checked) {
        U.otoAyarla(true);
        konumYazi();
        U.konumuBul(true);
        return;
      }
      const gec = konumGecerli();
      if (!gec) return;   // Kaydet düğmesi zaten engeller; Enter ile gönderimde de konum değişmesin
      U.otoAyarla(false);
      const { enlem, boylam } = gec;
      const vars = U.VARSAYILAN_KONUM;
      const varsayilan = Math.abs(enlem - vars.enlem) < 1e-6 && Math.abs(boylam - vars.boylam) < 1e-6;
      const saatDilimi = gpsDilim || (varsayilan ? vars.saatDilimi : U.dilimTahmin(boylam));
      /* Dilim GPS'ten ya da varsayılandan gelmiyorsa boylamdan tahmin (cihazın dilimi ödünç alınmış olabilir) */
      const dilimYaklasik = !gpsDilim && !varsayilan;
      gpsDilim = null;
      U.konumYaz({ ad: el.querySelector('#gkKAd').value.trim() || 'Özel konum', enlem, boylam, yukseklik: 0, saatDilimi, dilimYaklasik, oto: false });
      geceHesapla(); levhaCiz();
    });
  }

  function bagla() {
    const kaydir = el.querySelector('#gkKaydir');
    kaydir.addEventListener('input', () => {
      /* Canlı moddan çıkarken gece sabitlenir: kaydırıcıyla gezinirken saat yerel öğleyi geçerse
         levha bir sonraki geceye atlamasın (kaydırıcı hep bu gecenin öğlesine göre). */
      if (durum.canli && !durum.gun) durum.sabitOgle = ogle().getTime();
      durum.dakika = Number(kaydir.value);
      durum.canli = false;
      levhaCiz();
    });
    el.querySelector('#gkSimdi').addEventListener('click', () => {
      const geceDegisti = durum.gun !== null;
      durum.gun = null; durum.canli = true; durum.sabitOgle = null;
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
      kadirEtiket(); levhaCiz(); ozetYaz(); gezegenYaz();
    });
    const tarih = el.querySelector('#gkTarih');
    tarih.addEventListener('change', () => {
      if (!tarih.value) return;
      const [y, a, g] = tarih.value.split('-').map(Number);
      /* Gök hesapları ve yıldız verisi 1900–2100 için; dışındaki yıl (ya da yarım yazılmış tarih) yok sayılır */
      if (!(y >= 1900 && y <= 2100) || !a || !g) { tarih.setCustomValidity('1900 ile 2100 arasında bir tarih seç.'); tarih.reportValidity(); return; }
      tarih.setCustomValidity('');
      /* Seçilen günün akşamı, gözlemcinin boylamına göre (yerel güneş saatiyle 21:00). Date.UTC 0–99 yıllarını
         1900'e kaydırdığı için yıl ayrıca kurulur. */
      /* Seçilen günün saat 21:00'i, konumun saat diliminde */
      const d = new Date(Date.UTC(2000, a - 1, g, 21, 0, 0)); d.setUTCFullYear(y);
      const t21 = new Date(d.getTime() - dilimOfsDk(U.konum().saatDilimi, d) * 60e3);
      durum.gun = t21;
      durum.canli = false;
      durum.dakika = Math.max(0, Math.min(1440, Math.round((t21 - ogle()) / 60e3 / 5) * 5));
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
    el.querySelector('#gkPlanTakvim').addEventListener('click', planTakvim);
    document.addEventListener('urania:konum', () => {
      if (!durum.gzl) return;
      konumYazi();
      if (geceAnahtariDegisti()) { geceHesapla(); levhaCiz(); }
    });
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-takvim]'); if (!b) return;
      const o = takvimOlaylari.get(Number(b.dataset.takvim)); if (o) U.icsIndir(o);
    });
  }

  /* Bir saat diliminin verilen andaki UTC farkı (dakika) */
  function dilimOfsDk(z, t) {
    try {
      const p = new Intl.DateTimeFormat('en-US', { timeZone: z, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(t);
      const g = k => Number(p.find(x => x.type === k).value);
      const yerel = new Date(Date.UTC(2000, g('month') - 1, g('day'), g('hour'), g('minute'))); yerel.setUTCFullYear(g('year'));
      return Math.round((yerel - Math.floor(t.getTime() / 60e3) * 60e3) / 60e3);
    } catch (h) { return Math.round(U.konum().boylam / 15) * 60; }
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
      'Hedef koordinatları: ' + U.kacis(durum.veri.hedefKaynak) + '. Yer adları © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> katkıcıları.<br>Bir şey ters mi gidiyor? <a href="#tani">Tanı ekranı</a>';
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Gökyüzü hazırlanıyor…</p>';
    try {
      const [yildizlar, takimyildizlar, hedefler, meteor, ortmeY, algol] = await Promise.all([U.veri('yildizlar'), U.veri('takimyildiz'), U.veri('hedefler'), U.veri('meteor'), U.veri('ortme_yildiz'), U.veri('algol')]);
      durum.veri = { yildizlar, takimyildizlar, hedefler: hedefler.hedefler, hedefKaynak: hedefler.kaynak, meteor, ortmeYildiz: ortmeY.y, algol };
    } catch (e) {
      el.innerHTML = '<div class="hata-kutu" role="alert">Gök verisi yüklenemedi: ' + U.kacis(e.message) + '. Başka bir sekmeye geçip dönünce yeniden denenir; sorun sürerse internet bağlantısını kontrol et.</div>';
      return false;   // uygulama.js: bölüm bir sonraki açılışta yeniden kurulur
    }
    iskelet();
    bagla();
    kaynakYaz();
    simdiyeKur();
    geceHesapla();
    levhaCiz();
    canliSayac = setInterval(() => {
      if (!el.hidden) issYaz(false); // 10 dakikada bir: geçmiş geçişler düşer, alınamamış veri yeniden denenir (uydu.js 2 saat bekletir)
      if (!durum.canli || durum.gun || el.hidden) return;
      simdiyeKur();
      if (geceAnahtariDegisti()) geceHesapla();
      levhaCiz();
    }, 60e3);
  }

  function goster() {
    setTimeout(sesYenile, 0);
    if (durum.harita && durum.gzl) {
      gezegenYaz(); hedefYaz(); // defterden dönünce "görüldü" işaretleri yenilensin
      if (durum.canli && !durum.gun) { simdiyeKur(); if (geceAnahtariDegisti()) geceHesapla(); }
      requestAnimationFrame(levhaCiz);
    }
  }

  U.modul('gok', { ilk, goster });
  window.UraniaGozlem = { durum };
})();
