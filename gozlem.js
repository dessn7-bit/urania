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
    limitKadir: (v => (Number.isFinite(v) && v >= 1.5 && v <= 6 ? v : 4))(Number(U.oku('limitKadir', 4))),   // bozuk değer haritayı boşaltmasın
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

  /* Katlanır bölümler (Gezegenler … Yaklaşan olaylar): sayfa bir telefonda 15 ekrandan uzundu. Plan ve üst kısım hep açık
     (plan sesli okunuyor). Her bölümün başlığında kapalıyken de işe yarayan bir özet satırı var: listenin ilk öğesi ya da
     sayısı; liste her yeniden çizildiğinde (MutationObserver) güncellenir. Açık/kapalı tercihi saklanır, ilk açılışta hepsi kapalı. */
  const KAT_LISTE = { gezegen: 'gkGezegen', hedef: 'gkHedef', meteor: 'gkMeteor', uydu: 'gkIss', olay: 'gkOlay' };
  function ilkMetin(li, sec) {
    const e = li.querySelector(sec); if (!e) return '';
    const n = e.firstChild; return (n && n.nodeType === 3 ? n.textContent : e.textContent).trim();
  }
  function katOzetYaz(kat) {
    const ul = el.querySelector('#' + KAT_LISTE[kat]), oz = el.querySelector('#gkOzet_' + kat);
    if (!ul || !oz) return;
    const bos = ul.querySelector('.bos');
    const ls = [...ul.children].filter(li => li.tagName === 'LI' && !li.querySelector('.bos') && !li.classList.contains('sonuk'));
    let m;
    if (!ls.length) m = bos ? bos.textContent.trim() : '';
    else if (kat === 'gezegen') m = ls.map(li => ilkMetin(li, '.ad')).join(', ');
    else if (kat === 'hedef') m = ls.length + ' hedef karanlıkta 20°\'nin üstünde';
    else if (kat === 'meteor' && /etkin/.test((ls[0].querySelector('.ad .rozet') || {}).textContent || '')) {
      m = 'etkin: ' + ls.filter(li => /etkin/.test((li.querySelector('.ad .rozet') || {}).textContent || '')).map(li => ilkMetin(li, '.ad').replace(/\s*\(.*?\)/g, '')).join(', ');
    } else if (kat === 'uydu') {
      const saat = ((ls[0].querySelector('.alt') || {}).textContent || '').match(/\d\d:\d\d/);
      /* "Tiangong · 28 Ekim Çarşamba" → "Tiangong, 28 Ekim 19:37": tek satıra sığsın */
      const ad = ilkMetin(ls[0], '.ad').replace(' · ', ', ').replace(/\s(Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar)$/, '');
      m = 'sıradaki: ' + ad + (saat ? ' ' + saat[0] : '') + ' · ' + ilkMetin(ls[0], '.sag');
    } else m = 'sıradaki: ' + [ilkMetin(ls[0], '.ad'), ilkMetin(ls[0], '.sag')].filter(Boolean).join(' · ');
    if (m.length > 140) m = m.slice(0, 138) + '…';
    if (oz.textContent !== m) oz.textContent = m;
  }
  function katlar() {
    const acik = U.nesneOku('gokKat');
    el.querySelectorAll('details.kat').forEach(d => {
      const kat = d.dataset.kat;
      d.open = acik[kat] === true;
      d.addEventListener('toggle', () => { const a = U.nesneOku('gokKat'); a[kat] = d.open; U.yaz('gokKat', a); });
      const ul = el.querySelector('#' + KAT_LISTE[kat]);
      if (ul) new MutationObserver(() => katOzetYaz(kat)).observe(ul, { childList: true, subtree: true, characterData: true });
      katOzetYaz(kat);
    });
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
      <p class="karar" id="gkKarar" aria-live="polite"></p>
      <a class="dugme ar-giris" href="#ar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2M3.5 8.5l2 1M20.5 8.5l-2 1M12 5.5v0"/></svg>Telefonu gökyüzüne tut</a>
      <div class="levha-kap">
        <canvas id="gkLevha" width="560" height="560" role="img" aria-label="Seçili an için gökyüzü haritası. Bir cisme dokunarak adını gör."></canvas>
        <div class="levha-bilgi" id="gkBilgi" aria-live="polite" hidden></div>
      </div>
      <div class="zaman-kontrol">
        <div class="etiket"><span>Saat <b id="gkSaat">—</b></span><span id="gkGunesDurum"></span></div>
        <input type="range" id="gkKaydir" min="0" max="1440" step="5" aria-label="Saat">
        <button type="button" class="dugme" id="gkSimdi">Şimdi</button>
      </div>
      <div class="dinle" id="gkSes" role="group" aria-label="Bu geceyi dinle"></div>
      <div class="ozet" id="gkOzet"></div>
      <div class="hava" id="gkHava" aria-live="polite"></div>

      <h2 class="okunur plan-bas" data-ses="Bu gecenin planı.">Bu gecenin planı</h2>
      <p class="alt-baslik">Gecenin görülecekleri, en iyi görünecekleri saate göre: yükseklik, bulut tahmini ve Ay ışığı hesaba katıldı. Saati belli olaylar (uydu geçişi, Algol, örtme) kendi saatinde.</p>
      <ol class="plan" id="gkPlan"><li><span class="bos">Hazırlanıyor…</span></li></ol>
      <div class="cip-grup" id="gkPlanDugme" hidden><button type="button" class="dugme" id="gkPlanTakvim">Planı takvime ekle</button></div>

      <details class="kat" data-kat="gezegen"><summary><span class="kat-bas"><h2>Gezegenler</h2><span class="kat-ozet" id="gkOzet_gezegen"></span></span></summary>
      <p class="alt-baslik">Saatler seçili gece için; "en iyi" o gece en yüksekte olduğu an.</p>
      <ul class="liste" id="gkGezegen"></ul>
      </details>

      <details class="kat" data-kat="hedef"><summary><span class="kat-bas"><h2>Dürbün hedefleri</h2><span class="kat-ozet" id="gkOzet_hedef"></span></span></summary>
      <p class="alt-baslik">7×50 dürbün için parlak kümeler, bulutsular ve çift yıldızlar. Karanlıkta 20°'nin üstüne çıkanlar.</p>
      <ul class="liste" id="gkHedef"></ul>
      <details class="aciklama" id="gkHedefDiger"><summary>Bu gece alçakta kalanlar</summary><ul class="liste" id="gkHedefAlcak"></ul></details>
      </details>

      <details class="kat" data-kat="meteor"><summary><span class="kat-bas"><h2>Meteor yağmurları</h2><span class="kat-ozet" id="gkOzet_meteor"></span></span></summary>
      <p class="alt-baslik">Saatlik sayı (ZHR), radyant başucundayken kusursuz karanlıkta görülecek en yüksek sayıdır; şehirde ve Ay ışığında bunun küçük bir kısmı görülür.</p>
      <ul class="liste" id="gkMeteor"></ul>
      <details class="aciklama"><summary>Takvimin tamamı</summary><ul class="liste" id="gkMeteorTum"></ul></details>
      </details>

      <details class="kat" data-kat="uydu"><summary><span class="kat-bas"><h2>Uzay istasyonları ve uydular</h2><span class="kat-ozet" id="gkOzet_uydu"></span></span></summary>
      <p class="alt-baslik">Önümüzdeki 5 günde buradan görülebilecek geçişler: uydu Güneş ışığı alırken, gök karanlıkken ve ufkun en az 10° üstündeyken. ISS en parlağıdır; Tiangong daha küçük ve biraz sönük ama ikisi de çıplak gözle, yıldızlar arasında kaymayan, hızla ilerleyen bir ışık gibi görülür.</p>
      <ul class="liste" id="gkIss"><li><span class="bos">Hesaplanıyor…</span></li></ul>
      <p class="kaynak" id="gkIssKaynak"></p>
      </details>

      <details class="kat" data-kat="olay"><summary><span class="kat-bas"><h2>Yaklaşan olaylar</h2><span class="kat-ozet" id="gkOzet_olay"></span></span></summary>
      <ul class="liste" id="gkOlay"></ul>
      </details>

      <p class="kaynak" id="gkKaynak"></p>

      <dialog id="gkKonumPanel" aria-labelledby="gkKBaslik">
        <form method="dialog" id="gkKonumForm">
          <h3 id="gkKBaslik" style="margin-bottom:12px">Gözlem yeri</h3>
          <label class="secim-satir"><input type="checkbox" id="gkKOto"> <span><b>Her zaman bulunduğum yeri kullan</b><br><span class="soluk kucuk">Uygulama her açıldığında ve 10 dakikada bir telefonun konumunu alır.</span></span></label>
          <div id="gkKElle">
          <button type="button" class="dugme" id="gkGps" style="width:100%;margin:12px 0 14px">Şu anki konumu bir kez al</button>
          <p class="soluk kucuk" id="gkKDurum" role="status"></p>
          <div class="alan"><label for="gkKAd">Ad</label><input id="gkKAd" autocomplete="off" maxlength="80"></div>
          <div class="hesap-ızgara">
            <div class="alan"><label for="gkKEnlem">Enlem (°K)</label><input id="gkKEnlem" inputmode="decimal"></div>
            <div class="alan"><label for="gkKBoylam">Boylam (°D)</label><input id="gkKBoylam" inputmode="decimal"></div>
          </div>
          <div class="alan"><label for="gkKDilim">Saat dilimi</label><select id="gkKDilim"></select>
            <p class="soluk kucuk" id="gkKDilimNot">Konumdan tahmin edildi; yanlışsa listeden seç (yaz saati ve ülke sınırları dilime göre hesaplanır).</p></div>
          </div>
          <div class="kadir-kontrol">
            <label for="gkKadir"><span id="gkKadirAd">Gök koşulu: görünen en sönük yıldız</span>: <b id="gkKadirDeger"></b></label>
            <input type="range" id="gkKadir" aria-labelledby="gkKadirAd" min="1.5" max="6" step="0.5">
            <p class="soluk kucuk">Bu yerin ışık kirliliğine göre bir kez ayarla; harita, plan ve listeler hemen değişir.</p>
          </div>
          <div class="cip-grup" style="justify-content:space-between">
            <button type="button" class="dugme" id="gkKSifirla">Varsayılana dön (Fetih Mah.)</button>
            <span class="cip-grup"><button type="button" class="dugme" id="gkKVazgec">Vazgeç</button><button value="kaydet" class="dugme dolu" id="gkKKaydet">Kaydet</button></span>
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
    const yerDegisti = durum.yer !== yer;
    if (yerDegisti) { durum.yer = yer; durum.ortmeler = null; durum.uyduGecisleri = null; durum.havaSaatler = null; }
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
    issYaz(yerDegisti);   // geçişler "şimdi"ye ve konuma bağlı: yalnız tarih değiştiyse baştan hesaplanmaz
    setTimeout(() => {
      if (sira !== geceSira) return;
      /* Algol: bu gece (planda) ve önümüzdeki 30 gün (listede) */
      /* Liste başlığı "önümüzdeki 30 gün" diyor: seçili geceden bağımsız olarak şimdiden */
      const ab = new Date(Date.now() - 12 * 3600e3);
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
  /* Canlı modda tarih kutusu boş kalınca Android'de boş bir kutu (masaüstünde "gg.aa.yyyy") görünüyordu; "Gece [ ]"
     hangi geceyi gösterdiğini söylemiyordu. Bu gecenin tarihi (konumun saat diliminde, öğleden öğleye gece) yazılır.
     Kullanıcı kutuyu düzenlerken (odakta) dokunulmaz; değeri programla değiştirmek 'change' tetiklemez. */
  function tarihKutusu() {
    const t = el && el.querySelector('#gkTarih');
    if (!t || durum.gun || document.activeElement === t) return;
    const o = ogle();
    const v = new Date(o.getTime() + dilimOfsDk(U.konum().saatDilimi, o) * 60e3).toISOString().slice(0, 10);
    if (t.value !== v) t.value = v;
  }
  function levhaCiz() {
    tarihKutusu();
    const an = secilenAn();
    const gzl = durum.gzl;
    const gunes = G.cisimAltAz('Sun', an, gzl);
    const ay = G.ayDurumu(an, gzl);
    const gezegenler = G.GEZEGENLER.map(c => {
      const k = G.cisimAltAz(c, an, gzl);
      return { ad: G.TR_AD[c], alt: k.alt, az: k.az, kadir: G.gezegenKadir(c, an) };
    }).filter(g => g.kadir <= durum.limitKadir);   // yıldızlarla aynı sınır
    const radyantlar = durum.meteorDurum.filter(m => m.aktif && m.radyant_ra != null).map(m => ({ ad: m.ad, ra: m.radyant_ra, dec: m.radyant_dec }));
    /* Uydular: veri yüklüyse seçili an için konumlar, 60 dk içinde başlayan görünür geçişlerin yolu */
    const uydular = [], uyduYollari = [];
    if (durum.uydular) {
      const k = U.konum();
      /* Yol hesabı pahalı: 4 saatlik pencerenin geçişleri bir kez hesaplanır, kaydırıcı bu pencerede
         gezindikçe yalnız süzülür (her 5 dakikalık adımda yeniden hesaplanmaz) */
      const yer = k.enlem + '|' + k.boylam, t = an.getTime();
      const p = durum.uyduPencere;
      if (durum.uyduDilim !== 'pencere' || !p || p.yer !== yer || t < p.bas + 15 * 60e3 || t > p.son - 60 * 60e3) {
        /* Geri yönde gezinirken her adımda yeniden kurulmasın: geri giderken pencere geriye doğru açılır */
        const geri = p && p.yer === yer && t < p.bas + 15 * 60e3;
        const bas = t - (geri ? 2 * 3600e3 : 15 * 60e3), son = bas + 4 * 3600e3;
        durum.uyduDilim = 'pencere';
        durum.uyduPencere = { yer, bas, son, ls: durum.uydular.map(u => { try { return Uydu.yakinGecisler(u, k, new Date(bas), 4); } catch (h) { return []; } }) };
      }
      durum.uyduGecis = durum.uyduPencere.ls.map(ls => ls.find(g => g.bitis.t > an && g.bas.t < new Date(t + 60 * 60e3)) || null);
      durum.uydular.forEach((u, i) => {
        try { const d = Uydu.anlik(u, k, an); if (d) uydular.push(Object.assign({ ad: u.ad, kisa: u.kisa }, d)); } catch (h) { /* bu uydu çizilmez */ }
        const g = durum.uyduGecis[i];
        if (g && g.gorunur && g.bitis.t > an) uyduYollari.push({ kisa: u.kisa, yol: g.yol, gBas: g.gBas });
      });
    }
    durum.harita.ciz({ zaman: an, gzl, gunes, ay, gezegenler, hedefler: durum.veri.hedefler, radyantlar, limitKadir: durum.limitKadir, uydular, uyduYollari, mira: G.miraDurumu(an), vurgu: vurguKonum(an, gzl) });
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

  /* Özet satırları: solda küçük etiket (Güneş, Ay, Gezegenler, Meteor), sağda göz atılacak kısa veri.
     Sesli okuma ve ekran okuyucu için tam cümle data-ses'te (Ses.metinAl önce onu okur). */
  function satirlarYaz(kap, satirlar) {
    kap.innerHTML = satirlar.map(x => `<p class="okunur oz-satir"><span class="oz-et">${x.et}</span><span class="oz-d">${x.gor}</span></p>`).join('');
    kap.querySelectorAll('.oz-satir').forEach((p, i) => { p.dataset.ses = duzMetin(satirlar[i].ses); });
  }
  function duzMetin(html) { const t = document.createElement('template'); t.innerHTML = html; return t.content.textContent.replace(/\s+/g, ' ').trim(); }
  const kalin = t => `<strong>${t}</strong>`;
  const parca = t => `<span class="oz-p">${t}</span>`;   // "doğuş 07:31" satır sonunda bölünmesin

  /* Tek satırlık karar: "Bu gece gözlem: iyi / idare eder / kötü" ve gerekçesi. Ölçüt uygulamanın kendi eşikleri:
     bulut %30'un altı "açık" (bulut cümlesiyle aynı), gece en az 2 saat açık dönem → iyi; ortalama bulut %70+ ya da
     gecenin yarısından çoğunda yağış riski → kötü; arası idare eder. Tam karanlık olmayan gece en çok "idare eder".
     Ay yalnız gerekçeye girer: parlak Ay sönük bulutsu ve galaksiyi bastırır, gezegen, küme ve çift yıldızı engellemez. */
  function kararYaz() {
    const k = el && el.querySelector('#gkKarar'); if (!k || !durum.gece) return;
    const g = durum.gece, ay = durum.ayGece, oz = durum.havaOzet;
    let seviye = null, bulut;
    if (oz && typeof oz === 'object') {
      const n = oz.ls.length, a = oz.acik;
      if (a && a.n >= n - 1) { seviye = 'iyi'; bulut = 'gece boyunca büyük ölçüde açık'; }
      else if (a && a.n >= 2) { seviye = 'iyi'; bulut = `${U.saat(a.bas)}–${U.saat(new Date(a.son.getTime() + 3600e3))} arası açık`; }
      else if (oz.ort >= 70) { seviye = 'kotu'; bulut = `çoğunlukla kapalı (bulut ortalama %${Math.round(oz.ort)})`; }
      else { seviye = 'idare'; bulut = `parçalı bulutlu (ortalama %${Math.round(oz.ort)}), uzun açık dönem yok`; }
      if (oz.yagis && oz.yagis.riskli && oz.yagis.riskli.length >= Math.ceil(n / 2)) { seviye = 'kotu'; bulut += '; yağış riski yüksek'; }
    } else bulut = oz === 'hata' ? 'bulut tahmini alınamadı' : oz === 'yok' ? 'bulut tahmini yok (yalnız önümüzdeki 3 gün)' : 'bulut tahmini bekleniyor';
    let karanlik = '';
    if (!(g.batis && g.astroSon)) { karanlik = 'tam karanlık yok'; if (seviye === 'iyi') seviye = 'idare'; }
    const ayYuzde = Math.round(ay.oran * 100);
    const ayNot = ayAydinlatirMi() ? `Ay %${ayYuzde}: sönük bulutsu ve galaksiler zor, gezegen ve kümeler için sorun yok`
      : ay.oran < 0.25 ? 'Ay ışığı yok denecek kadar az' : 'Ay karanlık saatlerde alçakta ya da ufkun altında';
    const ad = { iyi: 'iyi', idare: 'idare eder', kotu: 'kötü' }[seviye];
    const gerekce = [bulut, karanlik, ayNot].filter(Boolean).join(' · ');
    k.className = 'karar' + (seviye ? ' karar-' + seviye : '');
    k.innerHTML = `<span class="karar-bas">${ad ? 'Bu gece gözlem:' : 'Bu gece'}</span>${ad ? ` <b class="karar-et">${ad}</b>` : ''}<span class="karar-neden">${U.kacis(gerekce)}</span>`;
  }

  function ozetYaz() {
    const g = durum.gece, ay = durum.ayGece;
    const s = [];
    if (g.batis && g.astroSon) {
      s.push({ et: 'Güneş',
        gor: [parca('batış ' + kalin(U.saat(g.batis))), parca('tam karanlık ' + kalin(U.saat(g.astroSon) + '–' + U.saat(g.astroBas)))].concat(g.dogus ? [parca('doğuş ' + kalin(U.saat(g.dogus)))] : []).join('&nbsp;· '),
        ses: `Güneş ${U.ek(U.saat(g.batis), 'de')} batıyor; gökyüzü ${U.ek(U.saat(g.astroSon), 'de')} tam kararıyor ve ${U.ek(U.saat(g.astroBas), 'e')} kadar karanlık kalıyor.` + (g.dogus ? ` Güneş ${U.ek(U.saat(g.dogus), 'de')} doğuyor.` : '') });
    } else if (g.batis) {
      s.push({ et: 'Güneş', gor: `batış ${kalin(U.saat(g.batis))} · <span class="oz-not">bu gece tam karanlık olmuyor; Güneş ufkun yeterince altına inmiyor.</span>`,
        ses: `Güneş ${U.ek(U.saat(g.batis), 'de')} batıyor ama bu gece tam karanlık olmuyor; Güneş ufkun yeterince altına inmiyor.` });
    } else {
      /* Kutup günü / kutup gecesi: öğleden sonraki 36 saatte batış yok */
      const ogleAlt = G.cisimAltAz('Sun', g.ogle, durum.gzl).alt;
      const c = ogleAlt > 0 ? 'Güneş bugün batmıyor (kutup günü); gökyüzü hiç kararmayacak.' :
        'Güneş bugün doğmuyor (kutup gecesi); ' + (ogleAlt > -6 ? 'öğle çevresinde gök alacakaranlıkla aydınlanır, günün geri kalanı karanlık.' : ogleAlt > -18 ? 'öğle çevresinde hafif bir alacakaranlık olur, günün geri kalanı karanlık.' : 'karanlık gün boyu sürüyor.');
      s.push({ et: 'Güneş', gor: c.replace(/^Güneş bugün/, 'bugün'), ses: c });
    }
    let ayCumle = `Ay: ${ay.ad}, %${Math.round(ay.oran * 100)} aydınlık`;
    const sirali = [[ay.dogus, 'doğuyor', 'doğuş'], [ay.batis, 'batıyor', 'batış']].filter(x => x[0]).sort((a, b) => a[0] - b[0]);
    ayCumle += sirali.length ? '; ' + sirali.map(x => `${U.ek(U.saat(x[0]), 'de')} ${x[1]}`).join(', ') + '.' : '.';
    let ayNot = '';
    if (ayAydinlatirMi()) ayNot = 'Işığı sönük bulutsu ve galaksileri bastıracak; kümeler, çift yıldızlar ve gezegenler için sorun değil.';
    else if (ay.oran < 0.25) ayNot = 'Sönük cisimler için iyi bir gece.';
    s.push({ et: 'Ay',
      gor: `${ay.ad}, %${Math.round(ay.oran * 100)} aydınlık` + sirali.map(x => '&nbsp;· ' + parca(`${x[2]} ${kalin(U.saat(x[0]))}`)).join('') + (ayNot ? `<span class="oz-not">${ayNot}</span>` : ''),
      ses: ayCumle + (ayNot ? ' ' + ayNot : '') });
    /* "Çıplak gözle" eşiği, levhadaki gökyüzü ayarıyla aynı (şehirde Uranüs çıplak gözle görülmez) */
    const gorunen = durum.gezegenGece.filter(p => p.gorunur && p.kadir <= durum.limitKadir);
    if (gorunen.length) {
      const adlar = gorunen.sort((a, b) => a.kadir - b.kadir).map(p => p.ad);
      const son = adlar.pop(), liste = adlar.length ? adlar.join(', ') + ' ve ' + son : son;
      s.push({ et: 'Gezegenler', gor: `${liste} <span class="soluk">çıplak gözle</span>`, ses: `Çıplak gözle görülebilecek gezegenler: ${liste}.` });
    } else s.push({ et: 'Gezegenler', gor: '<span class="soluk">bu gece çıplak gözle görülecek gezegen yok</span>', ses: 'Bu gece çıplak gözle görülecek bir gezegen yok.' });
    const aktif = durum.meteorDurum.filter(m => m.aktif);
    if (aktif.length) {
      const zirve = m => 'zirve ' + U.kacGun(m.gunFark).replace('bugün', 'bu gece');
      s.push({ et: 'Meteor',
        gor: aktif.map(m => `<span class="oz-satir-ic">${U.kacis(m.ad)} <span class="soluk oz-p">${zirve(m)}</span></span>`).join(''),
        ses: 'Etkin meteor yağmuru: ' + aktif.map(m => `${U.kacis(m.ad)} (${zirve(m)})`).join(', ') + '.' });
    }
    satirlarYaz(el.querySelector('#gkOzet'), s);
    kararYaz();
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
        <span class="alt">${U.kadir(p.kadir)} kadir · ${td} takımyıldızında · ${dogBat}${ek}${p.cisim === 'Jupiter' ? jupiterSema(t.zaman) : ''}${defterBag('cisim:' + p.cisim, t.zaman)}</span></li>`;
    }).join('');
  }

  function hedefSatir(h) {
    const notlar = [h.katalog, h.turAd, tdAd(h.takimyildiz), U.kadir(h.kadir) + ' kadir'].filter(Boolean);
    if (h.boyut) notlar.push(h.boyut);
    let uyari = '';
    if (h.ayAcisi < 30 && durum.ayGece.oran > 0.35) uyari = ` <span class="rozet uyari">Ay'a ${U.derece(h.ayAcisi)}</span>`;
    else if (h.kadir > 5.5 && (h.tur === 'galaksi' || h.tur === 'bulutsu')) uyari = ' <span class="rozet">şehirde zor</span>';
    const sag = h.tepe ? `en iyi ${U.saat(h.tepe.zaman)} · ${U.derece(h.tepe.alt)} ${G.yon(h.tepe.az)}` : '—';
    return `<li><span class="ad">${U.kacis(h.ad)}${uyari}</span><span class="sag">${sag}</span><span class="alt">${notlar.map(U.kacis).join(' · ')}${defterBag('hedef:' + h.id, h.tepe && h.tepe.zaman)}</span></li>`;
  }

  /* Jüpiter'in dört büyük uydusu: dürbünde görüneceği gibi (kuzey yukarı, doğu solda) */
  function jupiterSema(zaman) {
    const ls = G.jupiterUydulari(zaman), R = G.jupiterYaricap(zaman);
    const enUzak = Math.max(60, ...ls.map(m => Math.abs(m.dogu))) * 1.12;
    const W = 320, cx = W / 2, olc = (W / 2 - 8) / enUzak;
    const r = Math.max(4, R * olc);
    /* Uyduların yörünge düzlemi gökte ~20°'ye kadar eğik görünür (kuzey yukarı): yükseklik sabit 54 olunca dış
       uydular (Ganymede, Callisto) çizimin dışında kalıyordu. Yükseklik en kuzeydeki ve en güneydeki uyduya göre. */
    const ust = Math.max(r, ...ls.map(m => m.kuzey * olc)) + 4, alt = Math.max(r, ...ls.map(m => -m.kuzey * olc)) + 4;
    const cy = 14 + ust, etiketY = cy + alt + 12, H = Math.ceil(etiketY + 4);
    const durum = m => {
      const ic = Math.hypot(m.dogu, m.kuzey) < R;
      if (ic && m.derinlik > 0) return 'arkada';
      if (ic && m.derinlik < 0) return 'onde';
      return '';
    };
    const nok = ls.map(m => {
      const x = cx - m.dogu * olc, y = cy - m.kuzey * olc, d = durum(m);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" class="${d === 'arkada' ? 'uydu-gizli' : 'uydu'}"/>
        <text x="${x.toFixed(1)}" y="${etiketY.toFixed(1)}" text-anchor="middle" class="uydu-ad">${m.ad[0]}</text>`;
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
  /* Maddenin eylem satırı: "Haritada göster" (zaman verilirse: levha o saate gelir, cisim halkayla işaretlenir)
     ve "Gördüm, deftere yaz" */
  function defterBag(anahtar, zaman) {
    const zamanli = zaman instanceof Date && !isNaN(zaman);
    let harita = zamanli ? `<button type="button" class="bag haritada" data-anahtar="${U.kacis(anahtar)}" data-zaman="${zaman.getTime()}">Haritada göster</button>` : '';
    /* Dürbün hedefi: en yakın parlak yıldızdan hedefe bulma haritası (bulucu.js) */
    if (zamanli && window.Bulucu && /^hedef:/.test(anahtar)) harita += `<span class="ayrac" aria-hidden="true"> · </span><button type="button" class="bag bul" data-hedef="${U.kacis(anahtar.slice(6))}" data-zaman="${zaman.getTime()}">Nasıl bulunur</button>`;
    if (!window.Defter) return harita ? `<span class="defter-bag">${harita}</span>` : '';
    const son = Defter.sonGorulme(anahtar);
    const rozet = son ? `<span class="rozet iyi">görüldü · ${U.gun(new Date(son.zaman))}</span> ` : '';
    return `<span class="defter-bag">${rozet}${harita}${harita ? '<span class="ayrac" aria-hidden="true"> · </span>' : ''}<a href="#defter/yeni/${encodeURIComponent(anahtar)}">Gördüm, deftere yaz</a></span>`;
  }
  /* Levhada bir cismi göster: kaydırıcı o saate gelir, cisim halkayla işaretlenir, levha görünür yere kayar */
  function haritadaGoster(anahtar, t) {
    if (durum.canli && !durum.gun) durum.sabitOgle = ogle().getTime();
    durum.dakika = Math.max(0, Math.min(1440, Math.round((t - ogle()) / 60e3 / 5) * 5));
    durum.canli = false;
    durum.vurgu = anahtar;
    const kaydir = el.querySelector('#gkKaydir'); if (kaydir) kaydir.value = durum.dakika;
    levhaCiz();
    const kap = el.querySelector('.levha-kap');
    if (kap) kap.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }
  function vurguKonum(an, gzl) {
    const v = durum.vurgu; if (!v) return null;
    const i = v.indexOf(':'), tur = v.slice(0, i), id = v.slice(i + 1);
    try {
      if (tur === 'cisim') { const h = G.cisimAltAz(id, an, gzl); return { alt: h.alt, az: h.az }; }
      if (tur === 'hedef') {
        const h = durum.veri.hedefler.find(x => x.id === id); if (!h) return null;
        const u = G.ufkaCevir(G.ufukMatrisi(an, gzl), G.birimVektor(h.ra, h.dec)); return { alt: u.alt, az: u.az };
      }
    } catch (e) { /* bilinmeyen cisim: işaret yok */ }
    return null;
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
    const parca = [`zirve ${U.gun(zirve)} (${U.kacGun(m.gunFark)})`, aralik, /\(.*\)/.test(String(m.zhr)) ? 'ZHR ' + U.kacis(String(m.zhr).replace(/^\S+\s*/, '')) : null, m.hiz ? m.hiz + '\u00a0km/s' : null, `zirvede Ay %${Math.round(ayOran * 100)}`];
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
    const simdi = durum.gun ? new Date(durum.gun).getTime() : Date.now();   // seçili gece
    el.querySelector('#gkMeteorTum').innerHTML = ds.filter(m => { const z = new Date(m.zirve_utc).getTime(); return z > simdi - 31 * 86400e3 && z < simdi + 366 * 86400e3; }).sort((a, b) => new Date(a.zirve_utc) - new Date(b.zirve_utc)).map(m => meteorSatir(m, true)).join('');
  }

  /* "Takvime ekle": olay listesinden ve meteor zirvelerinden .ics */
  /* Her düğmeye tekil numara: listeler ayrı ayrı yeniden çizildiğinde eski düğme başka olaya işaret etmesin */
  const takvimOlaylari = new Map();
  let takvimNo = 0;
  function takvimBag(o) {
    takvimNo++;
    takvimOlaylari.set(takvimNo, o);
    if (takvimOlaylari.size > 1500) {
      /* Yalnız artık sayfada olmayan düğmelerin olayları silinir (seyrek yenilenen listelerin düğmeleri çalışmaya devam etsin) */
      const ekranda = new Set([...document.querySelectorAll('[data-takvim]')].map(b => Number(b.dataset.takvim)));
      for (const k of [...takvimOlaylari.keys()]) if (k < takvimNo - 200 && !ekranda.has(k)) takvimOlaylari.delete(k);
    }
    return `<button type="button" class="bag takvim-bag" data-takvim="${takvimNo}">Takvime ekle</button>`;
  }
  /* Yaklaşan olaylar: gök olayları (evreler, karşı konum, uzanım, gündönümü, Mira) + Algol'ün sıradaki iki görülebilir
     minimumu + buradan dürbünle izlenebilecek Ay örtmeleri, tek listede zamana göre. Algol ve örtmeler eskiden ayrı
     bölümlerdi; ikisi de seyrek ve plana zaten düşüyor, ayrı başlık sayfayı uzatıyordu. */
  function olayYaz() {
    const ul = el && el.querySelector('#gkOlay'); if (!ul) return;
    if (!durum.olaylar) { ul.innerHTML = '<li><span class="bos">Hesaplanıyor…</span></li>'; return; }
    const satirlar = durum.olaylar.slice(0, 12).map(o => ({ zaman: o.zaman, html: `<li${o.gorunur === false ? ' class="sonuk"' : ''}><span class="ad">${U.kacis(o.baslik)}</span><span class="sag">${U.gun(o.zaman)}</span><span class="alt">${o.not ? U.kacis(o.not) + '<br>' : ''}${U.gunHafta(o.zaman)}, ${U.saat(o.zaman)} · ${takvimBag({ baslik: o.baslik, bas: o.zaman, aciklama: (o.not || '') + ' (Urania, ' + U.konum().ad + ')' })}</span></li>` }));
    const son = satirlar.length ? satirlar[satirlar.length - 1].zaman : null;
    const ek = algolSatirlar().concat(ortmeSatirlar()).filter(x => !son || durum.olaylar.length <= 12 || x.zaman <= son);
    ul.innerHTML = satirlar.concat(ek).sort((a, b) => a.zaman - b.zaman).map(x => x.html).join('');
  }

  /* "20:37–20:37" yerine: aynı dakikaya düşen kısa geçişte süre */
  function aralik(a, b) {
    return U.saat(a) === U.saat(b) ? `${U.saat(a)}, yalnız ${Math.round((b - a) / 1000)} sn` : `${U.saat(a)}–${U.saat(b)}`;
  }

  /* ---- Uydu geçişleri (gecelere değil "şimdi"ye bağlı; konum değişince yeniden) ---- */
  let issAnahtar = '', issSira = 0;
  /* Beklenmedik bir hata listeyi "Hesaplanıyor…"da bırakmasın, yakalanmamış söz reddi olmasın */
  function issYaz(zorla) {
    return issYazAsil(zorla).catch(e => {
      if (window.Tani) Tani.hataEkle('uydu: ' + (e && e.message));
      const ul = el && el.querySelector('#gkIss'); if (ul) ul.innerHTML = '<li><span class="bos">Uydu geçişleri hesaplanamadı.</span></li>';
    });
  }
  async function issYazAsil(zorla) {
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
    /* Öğelerin dönemi şimdiden 14 günden uzaksa (cihaz saati yanlış ya da veri çok eski) SGP4 tahmini anlamsız:
       geçiş gösterilmez */
    const yasGun = u => (Date.now() - Uydu.donem(u)) / 86400e3;
    if (!uydular.length) {
      durum.uydular = null; durum.uyduGecisleri = null; planYaz(); levhaCiz();
      ul.innerHTML = '<li><span class="bos">Yörünge verisinde izlenen uydu yok (ISS ve Tiangong bulunamadı, yeni Starlink dizisi yok).</span></li>';
      kay.textContent = ''; return;
    }
    if (uydular.every(u => Math.abs(yasGun(u)) > 14)) {
      durum.uydular = null; durum.uyduGecisleri = null; planYaz(); levhaCiz();
      ul.innerHTML = '<li><span class="bos">Cihazın saati ya da yörünge verisi güncel değil (öğeler ' + U.sayi(Math.abs(yasGun(uydular[0])), 0) + ' gün ' + (yasGun(uydular[0]) < 0 ? 'ileride' : 'eski') + '); geçiş saatleri hesaplanamaz. Telefonun tarih ve saatini kontrol et.</span></li>';
      kay.textContent = ''; return;
    }
    const eksik = uydular.eksik;
    uydular = uydular.filter(u => Math.abs(yasGun(u)) <= 14); uydular.eksik = eksik;
    durum.uydular = uydular; durum.uyduDilim = null;
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
      const diziNot = u.dizi ? `<br><span class="kucuk">Yeni fırlatılmış ${Math.round(Number(u.dizi.adet)) || 'birçok'} uydu art arda dizili noktalar hâlinde geçer; dizinin başı ile sonu arasında birkaç dakika olabilir${Number(u.dizi.aralikDk) >= 2 ? ' (bu dizide yaklaşık ' + Math.round(Number(u.dizi.aralikDk)) + ' dk)' : ''}. Saatler dizinin ortası içindir ve kabadır. Alçak yörüngedeyken ortalama 2,7 kadir civarındadır; yükseldikçe 6,5 kadire sönükleşir (Mallama ve ark. 2024) ve dizi genellikle ilk birkaç günde dağılır.</span>` : '';
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
  function algolSatirlar() {
    if (!durum.algol) return [];
    const ef = durum.veri.algol;
    return durum.algol.filter(m => m.gorunur && m.zaman > new Date(Date.now() - 2 * 3600e3)).slice(0, 2).map(m => {
      const metin = `Algol en sönük ${U.saat(m.zaman)} (±${ef.hata_dk} dk), ${U.derece(m.alt)} yükseklikte, ${G.YON_UZUN[G.yon(m.az)]}. 2 gün 21 saatte bir sönükleşen çıplak göz değişeni: en parlakken Almach (γ And, 2,1 kadir) kadar, en sönükken δ Persei'den (3,0) sönük (3,3). En sönük andan 1–2 saat önce başlayıp yanındaki yıldızlarla karşılaştırarak izle.`;
      return { zaman: m.zaman, html: `<li><span class="ad">Algol en sönük</span><span class="sag">${U.gun(m.zaman)}</span><span class="alt">${metin}<br>${U.gunHafta(m.zaman)}, ${U.saat(m.zaman)} · ${takvimBag({ baslik: 'Algol en sönük', bas: new Date(m.zaman.getTime() - 90 * 60e3), son: new Date(m.zaman.getTime() + 60 * 60e3), aciklama: metin + ' (Urania, ' + U.konum().ad + ')' })} ${defterBag('yildiz:Algol')}</span></li>` };
    });
  }
  function algolYaz() { olayYaz(); }

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
    let ls;
    try { ls = await ortmeAra(k, new Date(Date.now() - 12 * 3600e3), 90, sira); } catch (h) {
      if (sira !== ortmeSira) return;
      if (window.Tani) Tani.hataEkle('örtme: ' + h.message);
      durum.ortmeAnahtar = null;
      olayYaz();
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
  function ortmeListe() { olayYaz(); }
  function ortmeSatirlar() {
    if (!durum.ortmeler) return [];
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
    return gruplar.filter(g => !g.ulker || g.uyeler.some(ortmeGorunurMu)).slice(0, 12).map(g => {
      if (g.ulker) {
        const uy = g.uyeler;
        const iyi = uy.find(ortmeGorunurMu), t = iyi.giris || iyi.cikis;
        const metin = uy.map(u => `${U.kacis(u.ad)} (${U.kadir(u.hedef.v)}): ${satir(u, true)}`).join('<br>');
        const ilk = uy[0], son = uy[uy.length - 1];
        return { zaman: t, html: `<li><span class="ad">Ülker örtmesi</span><span class="sag">${U.gun(t)}</span><span class="alt">Ay, Ülker kümesinin önünden geçiyor; yıldızlar birer birer kaybolup belirir. Ay %${Math.round(ilk.ayOran * 100)} aydınlık.<br>${metin}<br>${U.gunHafta(t)}, ${U.saat(t)} · ${takvimBag({ baslik: 'Ülker örtmesi', bas: new Date(t.getTime() - 15 * 60e3), son: new Date((son.cikis || son.giris).getTime() + 10 * 60e3), aciklama: 'Ay Ülker\'in önünden geçiyor. ' + uy.map(u => u.ad + ': ' + satir(u, true)).join('; ') + ' (Urania, ' + U.konum().ad + ')' })} ${defterBag('hedef:M45')}</span></li>` };
      }
      const o = g, t = o.giris || o.cikis;
      const metin = satir(o, false) + `. Ay %${Math.round(o.ayOran * 100)} aydınlık` + (o.hedef.gezegen ? '' : `; yıldız ${U.kadir(o.hedef.v)} kadir`) + '.';
      return { zaman: t, html: `<li><span class="ad">${U.kacis(o.ad)} örtmesi</span><span class="sag">${U.gun(t)}</span><span class="alt">${metin}<br>${U.gunHafta(t)}, ${U.saat(t)}${o.cikis && o.giris ? '–' + U.saat(o.cikis) : ''} · ${takvimBag({ baslik: o.ad + ' örtmesi', bas: new Date(t.getTime() - 15 * 60e3), son: new Date((o.cikis || t).getTime() + 10 * 60e3), aciklama: o.ad + ': ' + metin + ' (Urania, ' + U.konum().ad + ')' })}</span></li>` };
    });
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
        ek = defterBag(m.anahtar, m.zaman);
      } else if (m.tur === 'ay') {
        const ay = durum.ayGece;
        ne = ay.oran > 0.08 && ay.oran < 0.92 ? 'Aydınlık ile karanlığın sınırına bak: kraterler orada gölgeleriyle belirgin.' : (ay.oran >= 0.92 ? 'Dolunaya yakın: kraterler gölgesiz, düz görünür; parlak ışınlı kraterlere bak.' : '');
        ek = defterBag(m.anahtar, m.zaman);
      } else if (m.tur === 'hedef') {
        ne = `${U.kacis(m.hedef.turAd)}, ${U.kacis(tdAd(m.hedef.takimyildiz))} takımyıldızında.`;
        ek = defterBag(m.anahtar, m.zaman);
      } else if (m.tur === 'uydu') {
        const g = m.gecis;
        ne = `${aralik(g.gBas.t, g.gBit.t)}: ${G.YON_UZUN[G.yon(g.gBas.az)]} yönünde belirir, en çok ${U.derece(g.gTepe.alt)} yükselir` + (g.enParlak ? `, en parlak ${U.kadir(g.enParlak.kadir)} kadir.` : '.');
      } else if (m.tur === 'algol') {
        ne = `En sönük anı (±${durum.veri.algol.hata_dk} dk). Almach ve δ Persei ile karşılaştır.`;
        ek = defterBag(m.anahtar, m.zaman);
      } else if (m.tur === 'ortme') {
        ne = `Ay'ın ${m.kenar.aydinlik ? 'aydınlık' : 'karanlık'} kenarında.`;
      } else if (m.tur === 'meteor') {
        ne = `Radyant en yüksekte; geniş bir gök alanına çıplak gözle bak.`;
        ek = defterBag(m.anahtar, m.zaman);
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
    durum.havaSaatler = null; durum.havaZaman = Date.now(); durum.havaOzet = null;
    if (!bas || !son) { kap.innerHTML = ''; durum.havaOzet = 'yok'; kararYaz(); return; }
    const k = U.konum();
    kap.innerHTML = '<p class="soluk kucuk">Bulut tahmini alınıyor…</p>';
    let h;
    try { h = await Hava.getir(k.enlem, k.boylam); } catch (e) {
      if (sira !== havaSira) return;
      planYaz();
      kap.innerHTML = '<p class="soluk kucuk">Bulut tahmini alınamadı (internet yok ya da servis yanıt vermedi). Gök hesapları bundan etkilenmez.</p>';
      durum.havaOzet = 'hata'; kararYaz();
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
        kap.querySelectorAll('.hava-saat').forEach(x => { x.classList.toggle('secili', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        kap.querySelector('#gkHavaDetay').textContent = b.dataset.detay;
      });
    }
    const oz = Hava.geceOzeti(h.saatler, bas, son, 30);
    durum.havaOzet = oz || 'yok'; kararYaz();
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
    const cubuk = oz.ls.map((s, i) => `<button type="button" class="hava-saat" aria-pressed="false" data-detay="${U.kacis(detay(s))}" aria-label="${U.kacis(detay(s))}">
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
    const tam = cumle + (yCumle ? ' ' + yCumle : '');
    const kisa = cumle.replace(/^Bulut tahmini: /, '');
    kap.innerHTML = `<p class="hava-cumle okunur oz-satir"><span class="oz-et">Bulut</span><span class="oz-d">${kisa}${yCumle ? '<span class="oz-not">' + yCumle + '</span>' : ''}</span></p>
      <div class="hava-cubuklar" role="group" aria-label="Saatlik bulut oranı">${cubuk}</div>
      <p class="kucuk" id="gkHavaDetay" aria-live="polite"></p>
      <p class="kaynak">Üstteki uzun çubuk bulut oranı, alttaki kısa çubuk yağış olasılığı; bir saate dokununca ayrıntısı çıkar. ${h.eski ? 'Çevrimdışı: son güncelleme ' + U.saat(h.alindi) + ', ' + U.gun(h.alindi) + '. ' : ''}${kaynak}</p>`;
    kap.querySelector('.hava-cumle').dataset.ses = tam;   // seste tam cümle: "Bulut tahmini: …"
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
    else if (d.hata) kaynak = (d.hata === 'izin' ? 'konum izni yok, ' : 'konum alınamadı, ') + (k.oto ? 'son bilinen yer' : (k === U.VARSAYILAN_KONUM ? 'varsayılan yer' : 'elle seçilen yer'));
    else kaynak = k.oto ? 'son bilinen yer, güncelleniyor…' : 'konum aranıyor…';
    const s = el.querySelector('#gkKonum');
    if (!s) return;
    /* Yer adı öne çıkar; koordinat, kaynak ve saat dilimi ikincil (soluk). Metin düğümleriyle: ad depodan gelir, HTML değildir. */
    const ad = document.createElement('b'); ad.textContent = k.ad;
    const ek = document.createElement('span'); ek.className = 'konum-ek';
    ek.textContent = ' (' + U.sayi(k.enlem, 2) + '°, ' + U.sayi(k.boylam, 2) + '°) · ' + kaynak + ' · gök: ' + kadirAciklama(durum.limitKadir) + (k.saatDilimi !== 'Europe/Istanbul' || k.dilimYaklasik ? ' · saatler: ' + U.dilimAdi(k.saatDilimi) + (k.dilimYaklasik && !/yaklaşık/.test(U.dilimAdi(k.saatDilimi)) ? ' (boylamdan yaklaşık; yaz saati ve sınırlar hesaba katılmadı)' : '') : '');
    s.replaceChildren(ad, ek);
  }

  /* ---- Konum paneli ---- */
  let gpsDilim = null, dilimElle = false, dilimOnerildi = false;
  /* Saat dilimi listesi: tarayıcının IANA listesi (yoksa birkaç yaygın dilim) */
  function dilimListesi() {
    let ls = [];
    try { ls = Intl.supportedValuesOf('timeZone'); } catch (h) { /* eski tarayıcı */ }
    if (!ls.length) ls = ['Europe/Istanbul', 'Europe/London', 'Europe/Berlin', 'Europe/Athens', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Australia/Sydney', 'UTC'];
    return ls;
  }
  function dilimDoldur(secili) {
    const s = el.querySelector('#gkKDilim');
    let ls = dilimListesi();
    if (secili && !ls.includes(secili)) ls = [secili].concat(ls);
    s.innerHTML = ls.map(z => `<option value="${U.kacis(z)}">${U.kacis(z === 'Europe/Istanbul' ? 'Türkiye saati (Europe/Istanbul)' : /^Etc\/GMT|^UTC$/.test(z) ? U.dilimAdi(z) : z)}</option>`).join('');
    s.value = secili;
  }
  /* Enlem/boylam değişince öneri güncellenir (kullanıcı listeden seçmediyse) */
  function dilimOner() {
    gpsDilim = null;   // koordinat elle değişti: GPS'in (cihazın) dilimi artık bu yere ait değil
    if (dilimElle) return;
    const enlem = sayiOku(el.querySelector('#gkKEnlem').value), boylam = sayiOku(el.querySelector('#gkKBoylam').value);
    if (!(Math.abs(enlem) <= 90 && Math.abs(boylam) <= 180)) return;
    dilimDoldur(gpsDilim || U.dilimTahmin(boylam, enlem)); dilimOnerildi = !gpsDilim;
  }
  function konumPaneli() {
    gpsDilim = null; dilimElle = false; dilimOnerildi = false;
    dilimDoldur(U.konum().saatDilimi);
    const p = el.querySelector('#gkKonumPanel');
    const k = U.konum();
    el.querySelector('#gkKAd').value = k.ad;
    el.querySelector('#gkKEnlem').value = String(k.enlem).replace('.', ',');
    el.querySelector('#gkKBoylam').value = String(k.boylam).replace('.', ',');
    durumYazK('');
    el.querySelectorAll('#gkKEnlem, #gkKBoylam').forEach(i => { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
    const oto = el.querySelector('#gkKOto');
    oto.checked = U.otoAcik();
    otoGoster(oto.checked);
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
    /* Hatalı girdi, hata metnini taşıyan durum satırına bağlanır */
    [['#gkKEnlem', e], ['#gkKBoylam', b]].forEach(([sec, iyi]) => {
      const g = el.querySelector(sec);
      g.setAttribute('aria-invalid', String(!iyi));
      if (iyi) g.removeAttribute('aria-describedby'); else g.setAttribute('aria-describedby', 'gkKDurum');
    });
    return e && b ? { enlem, boylam } : null;
  }
  /* Durum satırı: hata (izin yok, geçersiz sayı) uyarı renginde; bilgi ("Konum alınıyor…") soluk */
  function durumYazK(metin, hata) {
    const d = el.querySelector('#gkKDurum');
    d.textContent = metin;
    d.classList.toggle('hata', !!hata);
  }
  /* "Her zaman bulunduğum yeri kullan" açıkken elle konum alanları ve onlara ait "Varsayılana dön" gizli */
  function otoGoster(acik) {
    el.querySelector('#gkKElle').hidden = acik;
    el.querySelector('#gkKSifirla').hidden = acik;
  }
  function konumBagla() {
    const p = el.querySelector('#gkKonumPanel');
    el.querySelector('#gkKonumDegis').addEventListener('click', konumPaneli);
    el.querySelector('#gkGps').addEventListener('click', () => {
      if (!navigator.geolocation) { durumYazK('Bu tarayıcı konum vermiyor; enlem ve boylamı elle yaz.', true); return; }
      durumYazK('Konum alınıyor…');
      navigator.geolocation.getCurrentPosition(pos => {
        el.querySelector('#gkKEnlem').value = pos.coords.latitude.toFixed(3).replace('.', ',');
        el.querySelector('#gkKBoylam').value = pos.coords.longitude.toFixed(3).replace('.', ',');
        el.querySelector('#gkKAd').value = 'Bulunduğum yer';
        gpsDilim = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!dilimElle) dilimDoldur(gpsDilim);
        durumYazK('Konum alındı (±' + Math.round(pos.coords.accuracy) + ' m). Kaydet\'e bas.');
      }, err => {
        durumYazK(err.code === 1 ? 'Konum izni verilmedi. Tarayıcı ayarlarından izin ver ya da elle yaz.' : 'Konum alınamadı; elle yaz.', true);
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
    });
    el.querySelector('#gkKOto').addEventListener('change', e => otoGoster(e.target.checked));
    el.querySelector('#gkKDilim').addEventListener('change', () => { dilimElle = true; });
    /* Vazgeç gönderim düğmesi değil: Enter formun ilk gönderim düğmesi olan Kaydet'e basar */
    el.querySelector('#gkKVazgec').addEventListener('click', () => { const p = el.querySelector('#gkKonumPanel'); if (p.close) p.close('iptal'); else p.removeAttribute('open'); });
    el.querySelectorAll('#gkKEnlem, #gkKBoylam').forEach(i => i.addEventListener('change', dilimOner));
    el.querySelector('#gkKSifirla').addEventListener('click', () => {
      const v = U.VARSAYILAN_KONUM;
      el.querySelector('#gkKAd').value = v.ad;
      el.querySelector('#gkKEnlem').value = String(v.enlem).replace('.', ',');
      el.querySelector('#gkKBoylam').value = String(v.boylam).replace('.', ',');
      gpsDilim = null;
      if (!dilimElle) dilimDoldur(v.saatDilimi);
    });
    /* Geçersiz girişte panel kapanmaz, otomatik konum ayarı da değişmez */
    el.querySelector('#gkKKaydet').addEventListener('click', e => {
      if (el.querySelector('#gkKOto').checked || konumGecerli()) return;
      e.preventDefault();
      durumYazK('Enlem −90 ile 90, boylam −180 ile 180 arasında bir sayı olmalı (ör. 41,02 ya da −33,87).', true);
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
      /* Dilim: listeden seçilen; seçilmediyse GPS'in, varsayılanın ya da konumdan tahminin dilimi */
      const secilen = el.querySelector('#gkKDilim').value;
      const saatDilimi = dilimElle && secilen ? secilen : (gpsDilim || (varsayilan ? vars.saatDilimi : (secilen || U.dilimTahmin(boylam, enlem))));
      /* Kullanıcı seçmediyse ve GPS ya da varsayılan değilse tahmindir: şeritte "yaklaşık" yazar */
      const dilimYaklasik = !dilimElle && !gpsDilim && !varsayilan && (dilimOnerildi || !!U.konum().dilimYaklasik);
      gpsDilim = null;
      if (!U.konumYaz({ ad: el.querySelector('#gkKAd').value.trim() || 'Özel konum', enlem, boylam, yukseklik: 0, saatDilimi, dilimYaklasik, oto: false })) {
        /* Depo dolu: konum bu oturumda geçerli olmaz, kullanıcıya söylenir */
        const o = el.querySelector('#gkOzet');
        el.querySelectorAll('.konum-hata').forEach(x => x.remove());
        o.insertAdjacentHTML('beforebegin', '<div class="hata-kutu konum-hata" role="alert">Konum kaydedilemedi: tarayıcının depolama alanı dolu ya da kapalı.</div>');
        return;
      }
      el.querySelectorAll('.konum-hata').forEach(x => x.remove());
      geceHesapla(); levhaCiz();
    });
  }

  function bagla() {
    el.addEventListener('click', e => {
      const bul = e.target.closest('.bul');
      if (bul) {
        const h = durum.veri.hedefler.find(x => x.id === bul.dataset.hedef);
        if (h && window.Bulucu) Bulucu.ac(h, { zaman: new Date(Number(bul.dataset.zaman)), gzl: durum.gzl }).catch(h => { if (window.Tani) Tani.hataEkle('bulucu: ' + (h && h.message)); });
        return;
      }
      const b = e.target.closest('.haritada'); if (!b) return;
      haritadaGoster(b.dataset.anahtar, new Date(Number(b.dataset.zaman)));
    });
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
      durum.gun = null; durum.canli = true; durum.sabitOgle = null; durum.vurgu = null;
      el.querySelector('#gkBuGece').hidden = true;
      simdiyeKur();
      if (geceDegisti || geceAnahtariDegisti()) geceHesapla();
      levhaCiz();
    });
    const kadir = el.querySelector('#gkKadir');
    kadir.value = durum.limitKadir;
    const kadirEtiket = () => {
      el.querySelector('#gkKadirDeger').textContent = U.sayi(durum.limitKadir, 1) + ' kadir (' + kadirAciklama(durum.limitKadir) + ')';
      kadir.setAttribute('aria-valuetext', U.sayi(durum.limitKadir, 1) + ' kadir, ' + kadirAciklama(durum.limitKadir));
    };
    kadirEtiket();
    kadir.addEventListener('input', () => {
      durum.limitKadir = Number(kadir.value);
      U.yaz('limitKadir', durum.limitKadir);
      kadirEtiket(); levhaCiz(); ozetYaz(); gezegenYaz(); planYaz(); konumYazi();
    });
    const tarih = el.querySelector('#gkTarih');
    tarih.addEventListener('change', () => {
      if (!tarih.value) return;
      const [y, a, g] = tarih.value.split('-').map(Number);
      /* Gök hesapları ve yıldız verisi 1900–2100 için; dışındaki yıl (ya da yarım yazılmış tarih) yok sayılır */
      if (!(y >= 1900 && y <= 2100) || !a || !g) { tarih.setCustomValidity('1900 ile 2100 arasında bir tarih seç.'); tarih.reportValidity(); return; }
      tarih.setCustomValidity('');
      /* Seçilen günün saat 21:00'i, konumun saat diliminde. Date.UTC 0–99 yıllarını 1900'e kaydırdığı için yıl ayrıca kurulur. */
      const d = new Date(Date.UTC(2000, a - 1, g, 21, 0, 0)); d.setUTCFullYear(y);
      const t21 = new Date(d.getTime() - dilimOfsDk(U.konum().saatDilimi, d) * 60e3);
      durum.gun = t21;
      durum.canli = false; durum.vurgu = null;
      durum.dakika = Math.max(0, Math.min(1440, Math.round((t21 - ogle()) / 60e3 / 5) * 5));
      el.querySelector('#gkBuGece').hidden = false;
      geceHesapla(); levhaCiz();
    });
    el.querySelector('#gkBuGece').addEventListener('click', () => el.querySelector('#gkSimdi').click());
    const bilgi = el.querySelector('#gkBilgi');
    let bilgiSayac = null;
    durum.harita = Harita.olustur(el.querySelector('#gkLevha'), durum.veri, (html, yer) => {
      clearTimeout(bilgiSayac);
      if (!html) { bilgi.hidden = true; return; }
      bilgi.innerHTML = html; bilgi.hidden = false;
      bilgi.classList.toggle('ustte', !!yer && yer.y > 0.55);   // haritanın alt kısmındaki cisim kutunun altında kalmasın
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
      'Hedef koordinatları: ' + U.kacis(durum.veri.hedefKaynak) + '. ' +
      'Algol efemerisi: <a href="' + U.guvenliUrl(durum.veri.algol.kaynak_url) + '" target="_blank" rel="noopener">AAVSO VSX</a> (HJD ' + durum.veri.algol.donem_hjd + ' + ' + U.sayi(durum.veri.algol.periyot, 6) + '·E), 2020–2025 CCD minimumlarıyla 6 dk içinde uyumlu (JAAVSO). ' +
      'Ay örtmeleri cihazında hesaplanır (yıldızlar Hipparcos, Ay Astronomy Engine, ΔT IERS Bulletin A); saatler dakikaya yuvarlı, Ay kenarındaki dağlar anı birkaç saniye kaydırır. Skyfield (JPL DE421) ile çoğunlukla 4 sn, Occult (IOTA) ile 6 sn içinde uyumlu; görünürlük sınırı Occult\'un 5 cm açıklık tablosu. ' +
      'Yer adları © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> katkıcıları.<br>Bir şey ters mi gidiyor? <a href="#tani">Tanı ekranı</a>';
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Gökyüzü hazırlanıyor…</p>';
    try {
      const [yildizlar, takimyildizlar, hedefler, meteor, ortmeY, algol] = await Promise.all([U.veri('yildizlar'), U.veri('takimyildiz'), U.veri('hedefler'), U.veri('meteor'), U.veri('ortme_yildiz'), U.veri('algol')]);
      durum.veri = { yildizlar, takimyildizlar, hedefler: hedefler.hedefler, hedefKaynak: hedefler.kaynak, meteor, ortmeYildiz: ortmeY.y, algol };
    } catch (e) {
      if (window.Tani) Tani.hataEkle('gök verisi: ' + (e && e.message));
      el.innerHTML = '<h1>Bu gece gökyüzü</h1><div class="hata-kutu" role="alert">Gök verisi yüklenemedi. Başka bir sekmeye geçip dönünce yeniden denenir; sorun sürerse internet bağlantısını kontrol et.</div>';
      return false;   // uygulama.js: bölüm bir sonraki açılışta yeniden kurulur
    }
    iskelet();
    katlar();
    bagla();
    kaynakYaz();
    simdiyeKur();
    geceHesapla();
    levhaCiz();
    canliSayac = setInterval(() => {
      if (!el.hidden) issYaz(false); // 10 dakikada bir: geçmiş geçişler düşer, alınamamış veri yeniden denenir (uydu.js 2 saat bekletir)
      /* Bulut tahmini saatte bir yenilenir (önbellek 1 saat taze; tazeyse ağa gidilmez) */
      if (!el.hidden && durum.gece && Date.now() - (durum.havaZaman || 0) > 3600e3) havaYaz();
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
