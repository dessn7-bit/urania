/* simulasyon.js — "Deneyler" bölümü: kara delik, yörünge atışı, yıldızın hayatı,
   ışığa yakın yolculuk. Bütün sabitler ve tablolar veri/fizik.json'dan (kaynaklı) gelir. */
(function () {
  'use strict';
  const U = window.Urania;
  let F = null;          // fizik.json
  let el = null;
  let aktif = null;      // çalışan deney (durdur() için)
  const azHareket = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Deney listesi: gruplu; yeni deneyler deneyler2.js'ten (window.UraniaDeneyEk) gelir */
  const DENEYLER = [
    { id: 'mevsim', grup: 'Gökyüzü ve zaman', modul: true, ad: 'Mevsimler ve Güneş\'in yolu', oz: 'Dünya\'nın ekseni eğik: öğle Güneşi neden yazın yüksek, kışın alçak; günler neden uzayıp kısalır?' },
    { id: 'analemma', grup: 'Gökyüzü ve zaman', modul: true, ad: 'Güneş saati ve zaman denklemi', oz: 'Güneş saati kol saatinden neden bazen 16 dakika ileri, bazen 14 dakika geri; yıl boyu öğle Güneşi gökte sekiz çizer.' },
    { id: 'eratosthenes', grup: 'Gökyüzünü ölçmek', modul: true, ad: 'Dünya\'yı ölçmek', oz: 'Eratosthenes gibi iki kentteki gölgeden Dünya\'nın çevresini hesapla: bir sopa, bir açı, bir uzaklık yeter.' },
    { id: 'paralaks', grup: 'Gökyüzünü ölçmek', modul: true, ad: 'Yıldızlara uzaklık: paralaks', oz: 'Dünya Güneş\'in çevresinde dönerken yakın yıldız uzaktakilere göre azıcık kayar; kayma ne kadar küçükse yıldız o kadar uzak.' },
    { id: 'durbun', grup: 'Gözlem araçları', modul: true, ad: 'Dürbün ve teleskop', oz: 'Ağız çapını ve büyütmeyi seç: ne kadar ışık toplar, ne kadar sönük yıldız gösterir, görüş alanı ne kadar geniş?' },
    { id: 'astrofoto', grup: 'Gözlem araçları', modul: true, ad: 'Gökyüzü fotoğrafı', oz: 'Pozlama süresi ve odak uzaklığı: yıldızlar ne zaman çizgiye döner, kent göğünde kaç kare üst üste eklemek gerekir?' },
    { id: 'kepler', grup: 'Kütleçekim ve yörüngeler', ad: 'Kepler yasaları', oz: 'Bir gezegenin yörüngesini kendin ayarla: neden elips, neden Güneş\'e yakınken hızlanır, uzak gezegenin yılı neden uzun?' },
    { id: 'yorunge', grup: 'Kütleçekim ve yörüngeler', ad: 'Yörünge atışı', oz: 'Newton\'un topu: yavaş atarsan yere düşer, yeterince hızlıysa Dünya\'nın çevresinde döner, daha hızlıysa kaçar.' },
    { id: 'roket', grup: 'Kütleçekim ve yörüngeler', modul: true, ad: 'Roket denklemi', oz: 'Yakıt oranı ve motor verimi: bir roket neden çoğunlukla yakıttır, aşamalar neden işe yarar, yörüngeye çıkmak ne kadar zor?' },
    { id: 'hohmann', grup: 'Kütleçekim ve yörüngeler', modul: true, ad: 'Mars\'a yolculuk', oz: 'En ucuz yol: Hohmann aktarımı. Mars\'a neden ancak 26 ayda bir fırlatılır, yolculuk neden aylar sürer?' },
    { id: 'gelgit', grup: 'Kütleçekim ve yörüngeler', ad: 'Gelgit', oz: 'Ay ve Güneş denizleri neden iki yandan şişirir; deniz günde iki kez kabarır, bazı günler daha çok.' },
    { id: 'tayf', grup: 'Işık', ad: 'Tayf ve Doppler', oz: 'Yıldız ışığını renklerine ayır: sıcaklık rengini belirler, hareket tayf çizgilerini kaydırır.' },
    { id: 'evreler', grup: 'Ay ve gezegenler', ad: 'Ay evreleri ve tutulmalar', oz: 'Ay neden hilal, yarım ya da dolunay görünür; tutulma neden her ay olmaz?' },
    { id: 'gecis', grup: 'Ay ve gezegenler', ad: 'Ötegezegen geçişi', oz: 'Gezegen yıldızının önünden geçince ışık biraz azalır: uzak gezegenler böyle bulunur.' },
    { id: 'yasanabilir', grup: 'Ay ve gezegenler', modul: true, ad: 'Yaşanabilir bölge', oz: 'Yıldız ne kadar parlaksa sıvı suyun mümkün olduğu kuşak o kadar uzakta: gezegenini yerleştir, sıcaklığını gör.' },
    { id: 'ortme', grup: 'Yıldızlar ve kara delikler', modul: true, ad: 'Örten çift yıldız', oz: 'İki yıldız birbirinin önünden geçince ışık düşer: Algol\'ün "göz kırpması" ve ışık eğrisinden yıldızları tartmak.' },
    { id: 'yildiz', grup: 'Yıldızlar ve kara delikler', ad: 'Yıldızın hayatı', oz: 'Yıldızın kütlesini seç: rengi, parlaklığı, ne kadar yaşayacağı ve nasıl öleceği buna bağlı.' },
    { id: 'karadelik', grup: 'Yıldızlar ve kara delikler', ad: 'Kara deliğe yaklaşmak', oz: 'Yaklaştıkça olay ufku, yavaşlayan saatin ve seni boyuna geren çekim.' },
    { id: 'gorelilik', grup: 'Görelilik ve evren', ad: 'Işığa yakın yolculuk', oz: 'Işık hızına yakın giden gemide zaman yavaşlar: Proxima\'ya, Andromeda\'ya yolculuk kaç yıl sürer?' },
    { id: 'hubble', grup: 'Görelilik ve evren', ad: 'Genişleyen evren', oz: 'Galaksiler neden uzaklaşıyor; evrenin genişleme hızını (Hubble sabiti) grafikten kendin ölç.' }
  ];
  let R = {};            // veri/deney_rehber.json

  const SABIT_AD = { G: 'kütleçekim sabiti', c: 'ışık hızı', h: 'Planck sabiti', k_B: 'Boltzmann sabiti', sigma: 'Stefan-Boltzmann sabiti', b_wien: 'Wien sabiti' };
  function renk(ad) { return getComputedStyle(document.documentElement).getPropertyValue(ad).trim(); }
  function deger(k) { return F.sabitler[k].deger; }

  /* Kanvas hazırlığı: CSS genişliğine göre keskin çizim. En-boy oranı CSS'e (--en-boy) de yazılır: yatay telefonda
     kanvas ekran yüksekliğine sığacak kadar daralır (stil.css .sahne canvas). Piksel oranı 3'e kadar: 2,625'lik
     telefonlarda 2,5 ile sınırlamak çizimi %5 büyütüp bulanıklaştırıyordu. Genişlik kesirli ölçülür (yuvarlanan
     clientWidth arka tamponu CSS kutusundan bir piksel kaydırıyordu). */
  function kanvas(cv, oran) {
    const enBoy = (1 / oran).toFixed(4);
    if (cv.dataset.enBoy !== enBoy) { cv.dataset.enBoy = enBoy; cv.style.aspectRatio = enBoy; cv.style.setProperty('--en-boy', enBoy); }
    const w = cv.getBoundingClientRect().width || cv.clientWidth || 600;
    const h = w * oran;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const gw = Math.round(w * dpr), gh = Math.round(h * dpr);
    if (cv.width !== gw || cv.height !== gh) { cv.width = gw; cv.height = gh; }
    const ctx = cv.getContext('2d');
    ctx.setTransform(gw / w, 0, 0, gh / h, 0, 0);
    return { ctx, w, h };
  }
  /* Kanvas etiketi: çizginin ya da şeklin üstüne düşse de okunsun diye sahne zemini renginde ince bir hale ile yazılır */
  function etiket(ctx, metin, x, y) {
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.setLineDash([]);
    ctx.strokeStyle = document.documentElement.classList.contains('kirmizi') ? '#000' : '#0A1422';
    ctx.strokeText(metin, x, y);
    ctx.restore();
    ctx.fillText(metin, x, y);
  }

  /* Kaydırıcının adı yalnız etiket metni (aria-labelledby); değer çıktı kutusundan aria-valuetext'e yazılır */
  function kaydirici(id, etiket, min, max, adim, deger) {
    return `<div class="kontrol"><label for="${id}"><span id="${id}Ad">${etiket}</span><output id="${id}Cikti"></output></label>
      <input type="range" id="${id}" aria-labelledby="${id}Ad" min="${min}" max="${max}" step="${adim}" value="${deger}"></div>`;
  }
  /* ls: [kimlik, ad, canli]. canli: animasyonla her karede değişen ölçüm; canlı bölgeye girmez
     (ekran okuyucu saniyede onlarca kez konuşmasın) */
  function olcumler(ls) {
    return '<dl class="olcumler">' + ls.map(([id, ad, canli]) => `<div${canli ? ' data-canli' : ''}><dt>${ad}</dt><dd id="${id}">—</dd></div>`).join('') + '</dl>';
  }
  function kaynakSatiri(anahtarlar, ek) {
    const gor = new Set();
    const ls = [];
    anahtarlar.forEach(k => {
      const s = F.sabitler[k];
      if (!s || gor.has(s.url)) return;
      gor.add(s.url);
      const ayni = anahtarlar.filter(x => F.sabitler[x] && F.sabitler[x].kaynak === s.kaynak).length > 1;
      ls.push(`<a href="${U.guvenliUrl(s.url)}" target="_blank" rel="noopener">${U.kacis(s.kaynak + (ayni ? ': ' + (SABIT_AD[k] || k) : ''))}</a>`);
    });
    (ek || []).forEach(e => { if (e && e.url && !gor.has(e.url)) { gor.add(e.url); ls.push(`<a href="${U.guvenliUrl(e.url)}" target="_blank" rel="noopener">${U.kacis(e.ad)}</a>`); } });
    return '<p class="kaynak">Kaynaklar: ' + ls.join(' · ') + '</p>';
  }

  /* Çalışan animasyon döngüsü — bölüm gizlenince durur */
  /* Döngü hangi kökte kurulduysa (Deneyler bölümü ya da ders içindeki kutu) o görünürken çizer */
  let kurulanKok = null;
  function gorunur(kok) { return kok ? kok.isConnected && !kok.closest('[hidden]') : !el.hidden; }
  function dongu(ciz, kok) {
    let id = null, son = performance.now(), calisiyor = true;
    kok = kok || kurulanKok;
    let zaman = null;
    /* Görünmezken ya da azaltılmış harekette kare kare çizmez: yarım saniyede (gizli) ya da çeyrek saniyede (azaltılmış hareket,
       kaydırıcı değişikliklerini yakalamak için) bir bakar; görünür olunca akıcı döngüye döner. */
    function sonraki() {
      if (!calisiyor) return;
      const gor = gorunur(kok);
      if (gor && !azHareket) id = requestAnimationFrame(adim);
      else zaman = setTimeout(() => adim(performance.now()), gor ? 250 : 500);
    }
    function adim(t) {
      if (!calisiyor) return;
      if (kok && !kok.isConnected) { calisiyor = false; return; }      // kutu sayfadan kalktı: döngü kendini bitirir
      const dt = Math.max(0, Math.min(0.05, (t - son) / 1000)); son = t;   // ilk karede rAF zamanı son'dan önce olabilir
      if (gorunur(kok)) ciz(dt);
      sonraki();
    }
    id = requestAnimationFrame(adim);
    return { durdur() { calisiyor = false; cancelAnimationFrame(id); clearTimeout(zaman); } };
  }

  /* =================== 1. Kara delik =================== */
  function karadelik(kap) {
    const G = deger('G'), c = deger('c'), Mg = deger('M_gunes'), g0 = deger('g0');
    const onAyar = F.karadelikler;
    kap.innerHTML = `
      <div class="cip-grup" id="kdOn">${onAyar.map((k, i) => `<button type="button" class="dugme" data-i="${i}">${U.kacis(k.ad)}</button>`).join('')}</div>
      <div class="sahne"><canvas id="kdKanvas"></canvas></div>
      <div class="kontroller">
        ${kaydirici('kdKutle', 'Kütle', 0, 10.5, 'any', 1)}
        ${kaydirici('kdUzak', 'Uzaklık (olay ufku yarıçapı = 1)', 0, 3, 0.005, 1)}
      </div>
      ${olcumler([['kdRs', 'Olay ufku yarıçapı'], ['kdR', 'Senin uzaklığın'], ['kdZaman', 'Uzakta 1 saat geçerken sende'], ['kdGelgit', 'Baştan ayağa gerilme (2 m boy)']])}
      <div class="deney-metin" id="kdMetin"></div>
      ${kaynakSatiri(['G', 'c', 'M_gunes', 'g0'], onAyar.map(k => ({ ad: k.kaynak, url: k.url })))}`;
    const cv = kap.querySelector('#kdKanvas');
    const kS = kap.querySelector('#kdKutle'), uS = kap.querySelector('#kdUzak');
    let saatUzak = 0, saatYakin = 0;
    const st = {};
    function hesapla() {
      st.M = Math.pow(10, Number(kS.value)) * Mg; // kg
      st.Mg = Math.pow(10, Number(kS.value));
      st.Rs = 2 * G * st.M / (c * c);
      st.x = 1 + (Math.pow(10, Number(uS.value)) - 1) * 0.5 + 0.0005; // r/Rs: 1,0005 … ~500
      st.r = st.x * st.Rs;
      st.oran = Math.sqrt(1 - 1 / st.x);
      st.gelgit = 2 * G * st.M * 2 / Math.pow(st.r, 3) / g0;
      st.ufukGelgit = 2 * G * st.M * 2 / Math.pow(st.Rs, 3) / g0;
      kap.querySelector('#kdKutleCikti').textContent = U.bilimsel(st.Mg, 3) + ' Güneş kütlesi';
      kap.querySelector('#kdUzakCikti').textContent = U.sayi(st.x, st.x < 1.1 ? 4 : 2) + ' × Rs';
      kap.querySelector('#kdRs').textContent = uzunluk(st.Rs);
      kap.querySelector('#kdR').textContent = uzunluk(st.r);
      const dk = 60 * st.oran;
      kap.querySelector('#kdZaman').textContent = dk >= 1 ? U.sayi(dk, dk < 10 ? 2 : 1) + ' dakika' : U.bilimsel(dk * 60, 3) + ' saniye';
      kap.querySelector('#kdGelgit').textContent = U.bilimsel(st.gelgit, 3) + ' g';
      const yer = st.gelgit < 1 ? 'Dünya yüzeyindeki ağırlığından az; vücudun bunu hissetmez bile.'
        : st.gelgit < 10 ? 'Birkaç kat ağırlığın kadar bir çekiştirme; rahatsız edici ama dayanılır.'
          : 'Ayakların başından çok daha güçlü çekiliyor: bu, spagettileşmenin ta kendisi.';
      kap.querySelector('#kdMetin').innerHTML =
        `<p>Bu kara deliğin olay ufku ${uzunluk(st.Rs)} yarıçaplı bir küre. Oradan ${U.sayi(st.x, 2)} kat uzakta, kıpırdamadan duran birinin saati uzaktaki gözlemciye göre ${U.sayi(st.oran, 4)} hızında işler.</p>
         <p>Gelgit etkisi: ${yer} Olay ufkunun kendisinde bu gerilme ${U.bilimsel(st.ufukGelgit, 2)} g olur. Kütle büyüdükçe ufuktaki gerilme <em>azalır</em> (1/M² ile), çünkü ufuk kütleyle orantılı büyür ama gelgit uzaklığın küpüyle düşer. Bu yüzden dev bir kara deliğin ufkunu fark etmeden geçebilirsin; küçük bir kara delik seni ufka varmadan parçalar.</p>`;
    }
    function uzunluk(m) {
      if (m < 1e3) return U.sayi(m, 1) + ' m';
      if (m < 1e9) return U.bilimsel(m / 1e3, 3) + ' km';
      const au = m / deger('au');
      return U.bilimsel(m / 1e3, 3) + ' km (' + U.sayi(au, au < 10 ? 2 : 0) + ' AB)';
    }
    function ciz(dt) {
      const { ctx, w, h } = kanvas(cv, 0.56);
      const kir = document.documentElement.classList.contains('kirmizi');
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.2, cy = h * 0.46, R = h * 0.17;
      /* Uzaklık ölçeği: logaritmik, ufuk R'de; en sağ ≈ 500 Rs */
      const xEkran = r => cx + R + (w * 0.64 - cx - R) * Math.log10(r) / Math.log10(500);
      /* hafif ışıma: yalnız görsel */
      const hale = ctx.createRadialGradient(cx, cy, R, cx, cy, R * 1.6);
      hale.addColorStop(0, kir ? 'rgba(211,58,44,.35)' : 'rgba(255,196,120,.35)'); hale.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2); ctx.fillStyle = hale; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = '#000'; ctx.fill();
      ctx.strokeStyle = renk('--pirinc'); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = renk('--soluk'); ctx.font = '500 12px Plex, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('olay ufku', cx, cy + R + 18);
      /* astronot: ayakları kara deliğe dönük yatay bir kapsül; gelgite göre boyuna uzar,
         enine incelir (görsel abartı logaritmik) */
      const uzama = 1 + Math.min(4, Math.max(0, Math.log10(1 + st.gelgit)) * 0.55);
      /* Kapsül sağdaki saatlere ve "Uzakta" etiketine değmesin: dar ekranda en çok saatlerin solundaki boşluk kadar uzar */
      const sinir = w * 0.78 - h * 0.13 - 30;
      const boy = Math.max(30, Math.min(30 * uzama, sinir - (cx + R + 4))), en = 10 / Math.sqrt(uzama);
      const ax = Math.min(Math.max(cx + R + boy / 2 + 4, xEkran(st.x) + boy / 2), Math.max(cx + R + boy / 2 + 4, sinir - boy / 2));
      ctx.save(); ctx.translate(ax, cy);
      ctx.fillStyle = renk('--parsomen');
      ctx.beginPath(); ctx.roundRect(-boy / 2, -en / 2, boy - en, en, en / 2); ctx.fill();
      ctx.beginPath(); ctx.arc(boy / 2 - en / 2 + 1, 0, en * 0.75, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = renk('--soluk'); ctx.font = '500 12px Plex, sans-serif'; ctx.textAlign = 'center';
      etiket(ctx, 'sen', 0, -en - 8);
      ctx.restore();
      /* iki saat */
      if (!azHareket) { saatUzak += dt; saatYakin += dt * st.oran; }
      saatCiz(ctx, w * 0.78, h * 0.24, h * 0.13, saatUzak, 'Uzakta', kir);
      saatCiz(ctx, w * 0.78, h * 0.68, h * 0.13, saatYakin, 'Sende', kir);
    }
    function saatCiz(ctx, x, y, r, t, ad, kir) {
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = kir ? '#100' : '#13233A'; ctx.fill();
      ctx.strokeStyle = renk('--pirinc'); ctx.lineWidth = 1.2; ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * r * 0.82, y - Math.cos(a) * r * 0.82);
        ctx.lineTo(x + Math.sin(a) * r * 0.95, y - Math.cos(a) * r * 0.95); ctx.stroke();
      }
      const a = (t / 4) * Math.PI * 2; // 4 saniyede bir tur
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78);
      ctx.strokeStyle = renk('--parsomen'); ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = renk('--soluk'); ctx.font = '500 12px Plex, sans-serif'; ctx.textAlign = 'center';
      etiket(ctx, ad, x, y + r + 15);
    }
    kS.addEventListener('input', hesapla);
    uS.addEventListener('input', hesapla);
    kap.querySelector('#kdOn').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      kS.value = Math.log10(onAyar[Number(b.dataset.i)].kutle_gunes); hesapla();
    });
    hesapla();
    return dongu(ciz);
  }

  /* =================== 2. Yörünge atışı =================== */
  function yorunge(kap) {
    const GM = deger('GM_dunya'), RE = deger('R_dunya');
    kap.innerHTML = `
      <div class="sahne"><canvas id="yoKanvas"></canvas></div>
      <div class="kontroller">
        ${kaydirici('yoYuk', 'Atış yüksekliği', 2.2, 4.6, 'any', 2.6)}
        ${kaydirici('yoHiz', 'Atış hızı', 0.3, 1.6, 0.005, 1)}
        <div class="cip-grup"><button type="button" class="dugme" id="yoDaire">Dairesel hız</button><button type="button" class="dugme" id="yoKac">Kurtulma hızı</button><button type="button" class="dugme" id="yoTekrar">Yeniden at</button></div>
      </div>
      ${olcumler([['yoV', 'Atış hızı'], ['yoVd', 'Dairesel yörünge hızı'], ['yoVk', 'Kurtulma hızı'], ['yoSonuc', 'Sonuç'], ['yoP', 'Dolanım süresi'], ['yoApo', 'En uzak / en yakın nokta']])}
      <div class="deney-metin"><p>Dairesel hız v = √(GM/r), kurtulma hızı bunun √2 katıdır: v = √(2GM/r). Yükseldikçe ikisi de azalır, dolanım süresi uzar (Kepler'in üçüncü yasası). Yaklaşık 35 800 km yükseklikte dolanım bir yıldız gününe eşitlenir: yer eşzamanlı yörünge.</p></div>
      ${kaynakSatiri(['GM_dunya', 'R_dunya'])}`;
    const cv = kap.querySelector('#yoKanvas');
    const yS = kap.querySelector('#yoYuk'), hS = kap.querySelector('#yoHiz');
    let st = {}, iz = [];
    function kur() {
      const h = Math.pow(10, Number(yS.value)) * 1e3;
      const r0 = RE + h;
      const vd = Math.sqrt(GM / r0), vk = Math.sqrt(2 * GM / r0);
      const v0 = Number(hS.value) * vd;
      const eps = v0 * v0 / 2 - GM / r0;
      const L = r0 * v0;
      const e = Math.sqrt(Math.max(0, 1 + 2 * eps * L * L / (GM * GM)));
      const p = L * L / GM;
      const rp = p / (1 + e);
      let sonuc, a = null, T = null, ra = null;
      if (eps < 0) { a = -GM / (2 * eps); T = 2 * Math.PI * Math.sqrt(a * a * a / GM); ra = a * (1 + e); }
      if (rp < RE) sonuc = 'Yere çarpar';
      else if (eps >= 0) sonuc = 'Dünya\'dan kurtulur';
      else if (e < 0.01) sonuc = 'Dairesel yörünge';
      else sonuc = 'Elips yörünge';
      st = { h, r0, vd, vk, v0, eps, e, p, rp, a, T, ra, sonuc, x: 0, y: r0, vx: -v0, vy: 0, t: 0, bitti: false };
      iz = [];
      /* Ölçek: görünür alan */
      const goster = eps < 0 && rp >= RE ? Math.max(ra, r0) * 1.15 : Math.max(r0 * 3, RE * 2.2);
      st.olcek = goster;
      /* Zaman hızlandırma: bir tur ≈ 6 sn */
      st.hiz = T && rp >= RE ? T / 6 : 2 * Math.PI * Math.sqrt(Math.pow(r0, 3) / GM) / 6;
      kap.querySelector('#yoYukCikti').textContent = U.sayi(h / 1e3, 0) + ' km';
      kap.querySelector('#yoHizCikti').textContent = U.sayi(v0 / 1e3, 2) + ' km/s';
      kap.querySelector('#yoV').textContent = U.sayi(v0 / 1e3, 2) + ' km/s';
      kap.querySelector('#yoVd').textContent = U.sayi(vd / 1e3, 2) + ' km/s';
      kap.querySelector('#yoVk').textContent = U.sayi(vk / 1e3, 2) + ' km/s';
      kap.querySelector('#yoSonuc').textContent = sonuc;
      kap.querySelector('#yoP').textContent = T && rp >= RE ? sure(T) : '—';
      kap.querySelector('#yoApo').textContent = T && rp >= RE ? U.sayi((ra - RE) / 1e3, 0) + ' / ' + U.sayi((rp - RE) / 1e3, 0) + ' km' : '—';
    }
    function sure(s) {
      if (s < 3600 * 3) return U.sayi(s / 60, 1) + ' dakika';
      if (s < 86400 * 3) return U.sayi(s / 3600, 2) + ' saat';
      return U.sayi(s / 86400, 1) + ' gün';
    }
    function ivme(x, y) { const r = Math.hypot(x, y); const k = -GM / (r * r * r); return [k * x, k * y]; }
    function ilerle(dt) {
      if (st.bitti) return;
      /* Uyarlanır adım: h ≤ 0,01·√(r³/GM) — enberide (yüksek dışmerkezlilik) adım küçülür */
      let kalan = dt * st.hiz, sayac = 0;
      while (kalan > 0 && sayac++ < 40000) {
        const r0 = Math.hypot(st.x, st.y);
        const h = Math.min(kalan, 0.01 * Math.sqrt(r0 * r0 * r0 / GM));
        kalan -= h;
        const [ax, ay] = ivme(st.x, st.y);
        st.vx += ax * h / 2; st.vy += ay * h / 2;
        st.x += st.vx * h; st.y += st.vy * h;
        const [bx, by] = ivme(st.x, st.y);
        st.vx += bx * h / 2; st.vy += by * h / 2;
        const r = Math.hypot(st.x, st.y);
        if (r <= RE) { const k = RE / r; st.x *= k; st.y *= k; st.bitti = true; break; }
        if (r > st.olcek * 1.6) { st.bitti = true; break; }
      }
      iz.push([st.x, st.y]);
      if (iz.length > 4000) iz.shift();
    }
    function ciz(dt) {
      if (!azHareket) ilerle(dt);
      const { ctx, w, h } = kanvas(cv, 0.75);
      const kir = document.documentElement.classList.contains('kirmizi');
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const s = Math.min(w, h) / 2 / st.olcek;
      /* öngörülen konik (kesik çizgi) */
      ctx.save(); ctx.setLineDash([3, 5]); ctx.strokeStyle = renk('--pirinc-soluk'); ctx.lineWidth = 1;
      ctx.beginPath();
      let ilk = true;
      for (let k = 0; k <= 720; k++) {
        const th = k / 720 * Math.PI * 2;      // ν: gerçek anomali, atış noktası enberi/öteberi
        const den = 1 + st.e * Math.cos(th);
        if (den <= 0.02) { ilk = true; continue; }
        const r = st.p / den;
        if (r > st.olcek * 3) { ilk = true; continue; }
        /* atış noktası ν=0 (v0>vd: enberi) ya da ν=π (v0<vd: öteberi); atış tepeden sola */
        const faz = st.v0 >= st.vd ? 0 : Math.PI;
        const a = Math.PI / 2 + (th - faz);
        const x = cx + Math.cos(a) * r * s, y = cy - Math.sin(a) * r * s;
        if (ilk) { ctx.moveTo(x, y); ilk = false; } else ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.restore();
      /* Dünya */
      ctx.beginPath(); ctx.arc(cx, cy, RE * s, 0, Math.PI * 2);
      ctx.fillStyle = kir ? '#2A0505' : '#2C5A7A'; ctx.fill();
      ctx.strokeStyle = renk('--pirinc'); ctx.lineWidth = 1; ctx.stroke();
      /* iz */
      ctx.beginPath();
      iz.forEach(([x, y], i) => { const X = cx + x * s, Y = cy - y * s; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
      ctx.strokeStyle = renk('--parsomen'); ctx.lineWidth = 1.6; ctx.stroke();
      /* uydu */
      ctx.beginPath(); ctx.arc(cx + st.x * s, cy - st.y * s, 4, 0, Math.PI * 2);
      ctx.fillStyle = renk('--gezegen'); ctx.fill();
      if (azHareket) {
        ctx.fillStyle = renk('--soluk'); ctx.font = '500 12px Plex, sans-serif'; ctx.textAlign = 'left';
        /* dar ekranda tek satıra sığmaz: iki satır */
        const not = 'Hareket azaltıldı: yalnız öngörülen yol gösteriliyor.';
        if (ctx.measureText(not).width <= w - 20) etiket(ctx, not, 10, h - 10);
        else { etiket(ctx, 'Hareket azaltıldı:', 10, h - 26); etiket(ctx, 'yalnız öngörülen yol gösteriliyor.', 10, h - 10); }
      }
    }
    yS.addEventListener('input', kur); hS.addEventListener('input', kur);
    kap.querySelector('#yoDaire').addEventListener('click', () => { hS.value = 1; kur(); });
    kap.querySelector('#yoKac').addEventListener('click', () => { hS.value = Math.SQRT2.toFixed(3); kur(); });
    kap.querySelector('#yoTekrar').addEventListener('click', kur);
    kur();
    return dongu(ciz);
  }

  /* =================== 3. Yıldızın hayatı (HR) =================== */
  function yildiz(kap) {
    const T = F.anakol.tablo.slice().sort((a, b) => a.kutle - b.kutle);
    const mMin = T[0].kutle, mMax = T[T.length - 1].kutle;
    kap.innerHTML = `
      <div class="sahne"><canvas id="hrKanvas"></canvas></div>
      <div class="kontroller">${kaydirici('hrKutle', 'Başlangıç kütlesi', Math.log10(mMin), Math.log10(mMax), 'any', 0)}</div>
      ${olcumler([['hrTip', 'Tayf sınıfı (yaklaşık)'], ['hrL', 'Işıma gücü'], ['hrT', 'Yüzey sıcaklığı'], ['hrR', 'Yarıçap'], ['hrOmur', 'Anakolda kalma süresi'], ['hrSon', 'Sonu']])}
      <div class="deney-metin" id="hrMetin"></div>
      <p class="kaynak">Noktalar tablodaki değerler; aradaki kütleler için logaritmik ara değer kullanılır, yani ara sonuçlar yaklaşıktır. ${U.kacis(F.anakol.not || '')} Kaynaklar: <a href="${U.guvenliUrl(F.anakol.url)}" target="_blank" rel="noopener">${U.kacis(F.anakol.kaynak)}</a> · <a href="${U.guvenliUrl(F.anakol.omur.url)}" target="_blank" rel="noopener">${U.kacis(F.anakol.omur.kaynak)}</a> · <a href="${U.guvenliUrl(F.sonlar.url)}" target="_blank" rel="noopener">${U.kacis(F.sonlar.kaynak)}</a></p>`;
    const cv = kap.querySelector('#hrKanvas');
    const s = kap.querySelector('#hrKutle');
    const lg = Math.log10;
    function ara(m, alan) {
      const x = lg(m);
      for (let i = 0; i < T.length - 1; i++) {
        const a = T[i], b = T[i + 1];
        if (m >= a.kutle && m <= b.kutle) {
          const f = (x - lg(a.kutle)) / (lg(b.kutle) - lg(a.kutle));
          return Math.pow(10, lg(a[alan]) + f * (lg(b[alan]) - lg(a[alan])));
        }
      }
      return T[m < mMin ? 0 : T.length - 1][alan];
    }
    function enYakinTip(m) {
      let en = T[0];
      T.forEach(r => { if (Math.abs(lg(r.kutle) - lg(m)) < Math.abs(lg(en.kutle) - lg(m))) en = r; });
      return en.tip;
    }
    function sonu(m) {
      const r = F.sonlar.tablo.find(x => m >= x.min && (x.max == null || m < x.max));
      return r || null;
    }
    let st = {};
    function hesapla() {
      const m = Math.pow(10, Number(s.value));
      const L = ara(m, 'isima'), Tk = ara(m, 'sicaklik'), R = ara(m, 'yaricap');
      const omur = ara(m, 'omur_yil');
      const son = sonu(m);
      st = { m, L, Tk, R, omur, son };
      kap.querySelector('#hrKutleCikti').textContent = U.sayi(m, m < 1 ? 2 : (m < 10 ? 1 : 0)) + ' Güneş kütlesi';
      kap.querySelector('#hrTip').textContent = enYakinTip(m);
      kap.querySelector('#hrL').textContent = U.bilimsel(L, 3) + ' L☉';
      kap.querySelector('#hrT').textContent = U.sayi(Math.round(Tk / 10) * 10, 0) + ' K';
      kap.querySelector('#hrR').textContent = U.sayi(R, R < 10 ? 2 : 1) + ' R☉';
      kap.querySelector('#hrOmur').textContent = omur >= 1e9 ? U.sayi(omur / 1e9, omur < 1e10 ? 2 : 0) + ' milyar yıl' : U.sayi(omur / 1e6, omur < 1e7 ? 1 : 0) + ' milyon yıl';
      kap.querySelector('#hrSon').textContent = son ? son.son : '—';
      kap.querySelector('#hrMetin').innerHTML = `<p>${U.sayi(m, m < 1 ? 2 : (m < 10 ? 1 : 0))} Güneş kütleli bir yıldız ${L > 0.9 && L < 1.1 ? "Güneş'le neredeyse aynı parlaklıkta" : "Güneş'ten " + (L >= 1 ? U.bilimsel(L, 2) + ' kat parlak' : U.bilimsel(1 / L, 2) + ' kat sönük')}. Yakıtı kütlesiyle, harcama hızı ışıma gücüyle orantılı: bu yüzden ${m > 1.05 ? 'büyük yıldızlar fazla yakıtlarını çok daha hızlı yakar ve kısa yaşar.' : (m < 0.95 ? 'küçük yıldızlar yakıtını çok yavaş harcar ve Güneş\'ten çok uzun yaşar.' : 'Güneş kütlesindeki bir yıldız anakolda yaklaşık 10 milyar yıl kalır; daha ağırlar daha kısa, daha hafifler daha uzun yaşar.')}</p>`;
      ciz();
    }
    function ciz() {
      const { ctx, w, h } = kanvas(cv, 0.68);
      ctx.clearRect(0, 0, w, h);
      const sol = 52, sag = 14, ust = 14, alt = 40;
      const tMin = 2300, tMax = 50000, lMin = 1e-4, lMax = 1e6;
      const X = t => sol + (lg(tMax) - lg(t)) / (lg(tMax) - lg(tMin)) * (w - sol - sag);
      const Y = l => ust + (lg(lMax) - lg(l)) / (lg(lMax) - lg(lMin)) * (h - ust - alt);
      ctx.strokeStyle = renk('--cizgi'); ctx.lineWidth = 1;
      ctx.fillStyle = renk('--soluk'); ctx.font = '500 11px Plex, sans-serif';
      [1e-4, 1e-2, 1, 1e2, 1e4, 1e6].forEach(l => {
        ctx.beginPath(); ctx.moveTo(sol, Y(l)); ctx.lineTo(w - sag, Y(l)); ctx.stroke();
        ctx.textAlign = 'right'; ctx.fillText(l === 1 ? '1' : '10' + ({ '-4': '⁻⁴', '-2': '⁻²', '2': '²', '4': '⁴', '6': '⁶' })[lg(l)], sol - 6, Y(l) + 4);
      });
      [40000, 20000, 10000, 5000, 3000].forEach(t => {
        ctx.beginPath(); ctx.moveTo(X(t), ust); ctx.lineTo(X(t), h - alt); ctx.stroke();
        ctx.textAlign = 'center'; ctx.fillText(U.sayi(t, 0), X(t), h - alt + 15);
      });
      ctx.textAlign = 'center'; ctx.fillText('Yüzey sıcaklığı (K) — sıcaktan soğuğa', sol + (w - sol - sag) / 2, h - 6);
      ctx.save(); ctx.translate(13, ust + (h - ust - alt) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Işıma gücü (Güneş = 1)', 0, 0); ctx.restore();
      /* anakol */
      ctx.beginPath();
      T.forEach((r, i) => { const x = X(r.sicaklik), y = Y(r.isima); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.strokeStyle = renk('--pirinc-soluk'); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
      T.forEach(r => {
        ctx.beginPath(); ctx.arc(X(r.sicaklik), Y(r.isima), 2.5, 0, Math.PI * 2); ctx.fillStyle = renk('--pirinc'); ctx.fill();
        /* Kalabalığı önlemek için yalnız tayf sınıflarının başı etiketlenir */
        if (!/^[OBAFKM]0V$|^B5V$/.test(r.tip)) return;
        /* bandın sağ üstüne: bant sağ aşağı indiği için etiket banda, "Güneş" yazısına ve seçili yıldıza binmez */
        ctx.fillStyle = renk('--soluk'); ctx.font = '500 10px Plex, sans-serif'; ctx.textAlign = 'left';
        etiket(ctx, r.tip, X(r.sicaklik) + 6, Y(r.isima) - 6);
      });
      /* Güneş */
      const gx = X(deger('T_gunes')), gy = Y(1);
      ctx.beginPath(); ctx.arc(gx, gy, 5, 0, Math.PI * 2); ctx.strokeStyle = renk('--parsomen'); ctx.lineWidth = 1.2; ctx.stroke();
      ctx.beginPath(); ctx.arc(gx, gy, 1.3, 0, Math.PI * 2); ctx.fillStyle = renk('--parsomen'); ctx.fill();
      ctx.font = 'italic 400 13px Spectral, serif'; ctx.textAlign = 'right'; etiket(ctx, 'Güneş', gx - 9, gy + 16);
      /* seçili yıldız */
      if (st.L) {
        const x = X(st.Tk), y = Y(st.L);
        const r = Math.max(4, Math.min(16, 5 + lg(st.R) * 4));
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = document.documentElement.classList.contains('kirmizi') ? renk('--pirinc') : yildizRengi(st.Tk); ctx.fill();
        ctx.strokeStyle = renk('--gece'); ctx.lineWidth = 1.5; ctx.stroke();
      }
    }
    function yildizRengi(t) {
      if (t > 25000) return '#A9C1FF';
      if (t > 10000) return '#C8D6FF';
      if (t > 7500) return '#F1F3FF';
      if (t > 6000) return '#FFF4E0';
      if (t > 5200) return '#FFE8B0';
      if (t > 3700) return '#FFC98C';
      return '#FF9E6A';
    }
    s.addEventListener('input', hesapla);
    window.addEventListener('resize', ciz); document.addEventListener('urania:tema', ciz);   // kırmızı mod değişince renkler yenilensin
    hesapla();
    return { durdur() { window.removeEventListener('resize', ciz); document.removeEventListener('urania:tema', ciz); } };
  }

  /* =================== 4. Görelilik =================== */
  function gorelilik(kap) {
    const c = deger('c');
    const hedef = F.uzakliklar;
    kap.innerHTML = `
      <div class="cip-grup" id="grHedef">${hedef.map((u, i) => `<button type="button" class="dugme" data-i="${i}" aria-pressed="${i === 0}">${U.kacis(u.ad)}</button>`).join('')}</div>
      <div class="kontroller">${kaydirici('grHiz', 'Hız (ışık hızının yüzdesi)', 0, 6, 'any', 2)}</div>
      ${olcumler([['grV', 'Hız'], ['grGama', 'Lorentz çarpanı γ'], ['grDunya', 'Dünya\'da geçen süre'], ['grGemi', 'Gemide geçen süre']])}
      <div class="sahne" style="padding:16px"><canvas id="grKanvas"></canvas></div>
      <div class="deney-metin"><p>γ = 1/√(1 − v²/c²). Dünya'dan bakınca yolculuk uzaklık/hız kadar sürer; gemideki saat ise bunun 1/γ'sı kadar ilerler. Işık hızına yaklaştıkça γ sınırsız büyür ama hız hiçbir zaman c'ye ulaşmaz. Hızlanma ve yavaşlama evreleri burada yok sayılır.</p></div>
      ${kaynakSatiri(['c'], hedef.map(u => ({ ad: u.kaynak, url: u.url })))}`;
    const s = kap.querySelector('#grHiz');
    const cv = kap.querySelector('#grKanvas');
    let secili = 0;
    /* Kaydırıcı → hız: 0..6 aralığı, β = 1 − 10^(−x/1,5) benzeri yumuşak ölçek (c'ye yaklaşan uç ayrıntılı) */
    const beta = x => 1 - Math.pow(10, -x / 1.5) * 1;
    function hesapla() {
      const b = Math.min(0.999999, Math.max(0.0001, beta(Number(s.value))));
      const g = 1 / Math.sqrt(1 - b * b);
      const d = hedef[secili].isik_yili;
      const tD = d / b, tG = tD / g;
      kap.querySelector('#grHizCikti').textContent = '%' + U.sayi(b * 100, b > 0.99 ? 4 : (b < 0.01 ? 2 : 1));
      kap.querySelector('#grV').textContent = U.bilimsel(b * c / 1e3, 4) + ' km/s';
      kap.querySelector('#grGama').textContent = U.sayi(g, g < 10 ? 3 : 1);
      kap.querySelector('#grDunya').textContent = yil(tD);
      kap.querySelector('#grGemi').textContent = yil(tG);
      const { ctx, w, h } = kanvas(cv, 0.22);
      ctx.clearRect(0, 0, w, h);
      const sol = 90, en = w - sol - 10;
      ctx.font = '500 13px Plex, sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = renk('--soluk');
      ctx.fillText('Dünya', sol - 10, h * 0.32 + 5); ctx.fillText('Gemi', sol - 10, h * 0.72 + 5);
      ctx.fillStyle = renk('--pirinc'); ctx.fillRect(sol, h * 0.32 - 8, en, 16);
      ctx.fillStyle = renk('--parsomen'); ctx.fillRect(sol, h * 0.72 - 8, Math.max(2, en / g), 16);
    }
    function yil(y) {
      if (y < 1 / 12) return U.sayi(y * 365.25, 1) + ' gün';
      if (y < 2) return U.sayi(y * 12, 1) + ' ay';
      if (y < 1e4) return U.sayi(y, y < 100 ? 1 : 0) + ' yıl';
      return U.bilimsel(y, 3) + ' yıl';
    }
    s.addEventListener('input', hesapla);
    kap.querySelector('#grHedef').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      secili = Number(b.dataset.i);
      kap.querySelectorAll('#grHedef button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      hesapla();
    });
    window.addEventListener('resize', hesapla); document.addEventListener('urania:tema', hesapla);
    hesapla();
    return { durdur() { window.removeEventListener('resize', hesapla); document.removeEventListener('urania:tema', hesapla); } };
  }

  const KURUCU = { karadelik, yorunge, yildiz, gorelilik };
  /* Yeni deneyler (deneyler2.js) ortak yardımcılarla kurulur */
  function ortak(kok, id) { return { F, U, R, veri: MODUL_VERI[id] || null, kanvas, etiket, kaydirici, olcumler, kaynakSatiri, dongu: ciz => dongu(ciz, kok), renk, deger, azHareket, el: () => el }; }
  /* Modül deneyleri (deney/<kimlik>.js + veri/deney/<kimlik>.json) yalnız açılınca yüklenir. JSON'da "rehber"
     (açıklamalar ve Neler dene) ve "veri" (deneyin kaynaklı sayıları) vardır. */
  const MODUL_VERI = {};
  function modulMu(id) { const d = DENEYLER.find(x => x.id === id); return !!(d && d.modul); }
  function hazirla(id) {
    if (!modulMu(id)) return Promise.resolve();
    return Promise.all([U.betikler(['./deney/' + id + '.js']), U.veri('deney/' + id)]).then(([, j]) => {
      if (j && j.rehber && typeof j.rehber === 'object') R[id] = j.rehber;
      MODUL_VERI[id] = j && j.veri ? j.veri : {};
    });
  }
  function kurucu(id) {
    const kendi = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);   // "#deney/constructor" gibi adlar prototipe takılmasın
    if (kendi(KURUCU, id)) return KURUCU[id];
    const ek = kendi(window.UraniaDeneyEk, id) && window.UraniaDeneyEk[id];
    return ek ? kap => ek(kap, ortak(kap, id)) : null;
  }

  /* ---- Açıklamalar (veri/deney_rehber.json): "Bu deney ne?" (ne), "Ekranda ne var?" (ekran), "Gerçek dünyada"
     (gercek), "İlgili dersler" (dersler). Lejanttaki her kontrol data-kontrol ile sayfadaki öğeye bağlıdır (testler
     bunu sayfadaki girdilerle karşılaştırır). Renk örnekleri kanvasla aynı renkte; kırmızı modda kanvas gibi süzülür. */
  function rehberi(id) { return Object.prototype.hasOwnProperty.call(R, id) && R[id] && typeof R[id] === 'object' ? R[id] : {}; }
  const TUR_AD = { kaydirici: 'Kaydırıcı', dugme: 'Düğme', kutu: 'Onay kutusu' };
  const SEKILLER = ['daire', 'halka', 'cizgi', 'kesik', 'kalin', 'alan', 'yazi', 'serit', 'yarim', 'dikey', 'dikey-kesik'];
  /* Yalnız CSS değişkeni adı, #renk ya da rgb()/rgba() geçer: veri style özniteliğine başka bir şey sokamaz */
  function renkDegeri(r) {
    const s = String(r || '').trim();
    if (/^--[a-z0-9-]+$/i.test(s)) return 'var(' + s + ')';
    return /^#[0-9a-f]{3,8}$/i.test(s) || /^rgba?\([\d.,\s%]+\)$/i.test(s) ? s : '';
  }
  function ornek(c) {
    const sekil = SEKILLER.indexOf(c.sekil) >= 0 ? c.sekil : 'daire';
    const r = renkDegeri(c.renk), serit = c.zemin === 'serit', z = serit ? '' : renkDegeri(c.zemin);
    const stil = [r && '--dn-renk:' + r, z && '--dn-zemin:' + z].filter(Boolean).join(';');
    const sinif = 'dn-ornek dn-' + sekil + (serit ? ' dn-zemin-serit' : z && sekil !== 'halka' ? ' dn-zeminli' : '');
    return `<span class="${sinif}"${stil ? ` style="${stil}"` : ''} aria-hidden="true">${sekil === 'yazi' ? 'Aa' : '<i></i>'}</span>`;
  }
  function dersKimlikleri(r) {
    const ls = Array.isArray(r.dersler) ? r.dersler : (r.ders ? [r.ders] : []);
    return ls.filter((d, i) => /^d\d{1,2}$/.test(d) && ls.indexOf(d) === i);
  }
  function neHtml(r) {
    const ne = r.ne || r.giris;
    return ne ? `<section class="dn-ne" aria-labelledby="dnNeBas"><h2 class="dn-bas" id="dnNeBas">Bu deney ne?</h2><p>${U.kacis(ne)}</p></section>` : '';
  }
  function linkler(ls) { return (ls || []).filter(k => k && k.url).map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · '); }
  function aciklamaHtml(r) {
    const e = r.ekran && typeof r.ekran === 'object' ? r.ekran : null;
    const cizim = e && Array.isArray(e.cizim) ? e.cizim : [], kontroller = e && Array.isArray(e.kontroller) ? e.kontroller.filter(k => k && (!k.azHareket || azHareket)) : [];
    const ekran = cizim.length || kontroller.length ? `<details class="dn-kat" id="dnEkran"><summary><h2>Ekranda ne var?</h2><span class="dn-ozet">Her şeklin, rengin ve kontrolün anlamı</span></summary>
      <div class="dn-ic">
        ${cizim.length ? `<h3 class="dn-alt">Çizimde</h3><ul class="dn-lejant">${cizim.map(c => `<li>${ornek(c)}<span><b>${U.kacis(c.ad)}:</b> ${U.kacis(c.ne)}</span></li>`).join('')}</ul>` : ''}
        ${kontroller.length ? `<h3 class="dn-alt">Kontroller</h3><ul class="dn-lejant dn-kontroller">${kontroller.map(k => `<li data-kontrol="${U.kacis(k.sec)}"><span class="dn-tur">${TUR_AD[k.tur] || 'Kontrol'}</span> <b>${U.kacis(k.ad)}:</b> ${U.kacis(k.ne)}</li>`).join('')}</ul>` : ''}
        ${e.hareket ? `<p class="dn-not">${U.kacis(e.hareket)}</p>` : ''}
        <p class="dn-not dn-kirmizi-not">Kırmızı ışık modunda bütün renkler kırmızının tonlarına döner (yukarıdaki renk örnekleri de); şekiller ve çizgi türleri aynı kalır.</p>
      </div></details>` : '';
    const gercek = r.gercek ? `<details class="dn-kat" id="dnGercek"><summary><h2>Gerçek dünyada</h2><span class="dn-ozet">Gökte ve gündelik hayatta nerede karşına çıkar</span></summary>
      <div class="dn-ic dn-gercek"><p>${U.kacis(r.gercek)}</p>${Array.isArray(r.gercekKaynaklar) && r.gercekKaynaklar.length ? `<p class="kaynak">Kaynaklar: ${linkler(r.gercekKaynaklar)}</p>` : ''}</div></details>` : '';
    return ekran || gercek ? `<div class="dn-acik">${ekran}${gercek}</div>` : '';
  }
  function dersHtml(r) {
    const ds = dersKimlikleri(r);
    return ds.length ? `<section class="deney-ders" aria-labelledby="dnDersBas"><h2 class="dn-bas" id="dnDersBas">İlgili dersler</h2>
      <ul>${ds.map(d => `<li><a href="#ders/${d}" data-ders="${d}">${U.kacis(dersAdi(d))}</a></li>`).join('')}</ul></section>` : '';
  }
  /* Sözlük (sozluk.js) yüklüyse açıklama metnindeki terimleri işaretler; yoksa ya da hata verirse sessizce geçer */
  function sozlukIsaretle(kok) {
    try { if (kok && window.Sozluk && typeof window.Sozluk.isaretle === 'function') window.Sozluk.isaretle(kok); } catch (e) { /* sözlük isteğe bağlı */ }
  }
  /* Açıklamaları kanvasın (son .sahne) hemen altına koyar: açılınca kanvas yukarıda görünür kalır. Veriye bağlı
     deneyler kutuyu sonradan doldurduğu için sahne çıkana kadar bekler. */
  /* Rehber (Neler dene) ve katlanır açıklamalar deney kutusunun sonuna, kontrollerin ve ölçümlerin altına konur.
     Kanvas yapışkan olduğunda (yapiskanAyarla) aşağı kaydırırken çizim ekranın üstünde kalır: adımı okurken, Uygula'ya
     basınca ve kaydırıcıyı çekerken sonuç hep görünür. Veriye bağlı deneyler kutuyu sonradan doldurduğu için sahne
     çıkana kadar beklenir; kutu yeniden yazılırsa ekler yeniden konur. */
  function ekleriYerlestir(kap, html) {
    if (!html) return;
    const koy = () => {
      if (!kap.isConnected) return true;
      if (kap.querySelector(':scope > .dn-ek')) return false;
      if (!kap.querySelector(':scope > .sahne')) return false;
      kap.insertAdjacentHTML('beforeend', '<div class="dn-ek">' + html + '</div>');
      const ek = kap.querySelector(':scope > .dn-ek');
      sozlukIsaretle(ek.querySelector('.dn-acik'));
      sozlukIsaretle(ek.querySelector('.rehber'));
      yapiskanAyarla(kap);
      return false;
    };
    koy();
    const mo = new MutationObserver(() => { if (!kap.isConnected) mo.disconnect(); else koy(); });
    mo.observe(kap, { childList: true });
  }
  /* İlk kanvas, ekranın (üst ve alt çubuklar dışında) en çok %55'ini kaplıyorsa yapışkan olur; yatay telefonda olmaz */
  function yapiskanAyarla(kap) {
    const s = kap && kap.querySelector(':scope > .sahne'); if (!s || !kap.closest('[data-bolum="deney"]')) return;
    const ust = document.querySelector('header.ust'), alt = document.querySelector('.alt-sekmeler');
    const ustB = ust ? ust.getBoundingClientRect().height : 0;
    const altB = alt && getComputedStyle(alt).display !== 'none' ? alt.getBoundingClientRect().height : 0;
    const kullanilir = window.innerHeight - ustB - altB;
    const uygun = s.getBoundingClientRect().height <= kullanilir * 0.55;
    kap.style.setProperty('--yapis-ust', Math.round(ustB) + 'px');
    s.classList.toggle('yapiskan', uygun);
  }

  /* ---- Rehber ("Neler dene"): "Yap / Gözle / Neden" adımları. "Uygula" düğmesi deneyin kontrollerini ayarlar. ---- */
  function rehberHtml(id) {
    const r = Object.prototype.hasOwnProperty.call(R, id) ? R[id] : null; if (!r || !Array.isArray(r.adimlar)) return '';
    const bitti = U.diziOku('rehber_' + id);
    return `<section class="rehber" aria-labelledby="dnDeneBas">
      <h2 id="dnDeneBas">Neler dene</h2>
      <p class="dn-ipucu">“Uygula” kontrolleri o adıma ayarlar; sonra “Ne görmelisin, neden?” kısmını aç.</p>
      <ol class="rehber-adim">${r.adimlar.map((a, i) => `<li data-i="${i}"${bitti.indexOf(i) >= 0 ? ' class="yapildi"' : ''}>
        <p class="rh-yap"><b>Yap:</b> ${U.kacis(a.yap)}${a.ayar || a.tikla ? ` <button type="button" class="bag rh-uygula" data-i="${i}" aria-label="${i + 1}. adımı uygula">Uygula</button>` : ''}</p>
        <details class="rh-ac"${bitti.indexOf(i) >= 0 ? ' open' : ''}><summary>Ne görmelisin, neden?</summary>
          <p><b>Gözle:</b> ${U.kacis(a.gozle)}</p><p><b>Neden:</b> ${U.kacis(a.neden)}</p></details></li>`).join('')}</ol>
      ${r.kaynaklar && r.kaynaklar.length ? `<p class="kaynak">Rehberdeki bilgilerin kaynakları: ${r.kaynaklar.map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ')}</p>` : ''}
    </section>`;
  }
  function rehberUygula(kap, id, i) {
    const a = R[id] && R[id].adimlar[i]; if (!a) return;
    const hedefler = [a.tikla].concat(Object.keys(a.ayar || {})).filter(Boolean);
    if (hedefler.some(sec => !kap.querySelector(sec))) return;      // deney henüz kurulmadı
    if (a.tikla) kap.querySelector(a.tikla).click();
    Object.keys(a.ayar || {}).forEach(sec => {
      const g = kap.querySelector(sec); if (!g) return;
      if (g.type === 'checkbox') g.checked = Boolean(a.ayar[sec]); else g.value = a.ayar[sec];
      g.dispatchEvent(new Event('input', { bubbles: true }));
      g.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const li = el.querySelector(`.rehber-adim li[data-i="${i}"]`);
    if (li) { li.classList.add('yapildi'); const d = li.querySelector('details'); if (d) d.open = true; }
    const bitti = U.diziOku('rehber_' + id);
    if (bitti.indexOf(i) < 0) { bitti.push(i); U.yaz('rehber_' + id, bitti); }
    const sahne = kap.querySelector('.sahne');
    if (sahne && !sahne.classList.contains('yapiskan') && sahne.scrollIntoView) sahne.scrollIntoView({ block: 'nearest', behavior: azHareket ? 'auto' : 'smooth' });
  }

  let acilis = 0;
  function deneyAc(id) {
    const benim = ++acilis;
    if (aktif) { aktif.durdur(); aktif = null; }
    if (!kurucu(id) && modulMu(id)) {
      const d = DENEYLER.find(x => x.id === id);
      el.innerHTML = `<a class="geri" href="#deney">Tüm deneyler</a><h1>${U.kacis(d.ad)}</h1><p class="bos">Deney hazırlanıyor…</p>`;
      hazirla(id).then(() => { if (benim === acilis && el.querySelector('h1')) deneyKur(id); })
        .catch(e => { if (benim === acilis) el.innerHTML = `<a class="geri" href="#deney">Tüm deneyler</a><div class="hata-kutu" role="alert">Deney yüklenemedi: ${U.kacis(e.message)}. Bağlantı gelince sayfayı yenile.</div>`; });
      return;
    }
    deneyKur(id);
  }
  function deneyKur(id) {
    const k = kurucu(id);
    if (!k) { listeAc(); return; }
    if (aktif) { aktif.durdur(); aktif = null; }
    const d = DENEYLER.find(x => x.id === id) || { ad: id };
    const r = rehberi(id);
    el.innerHTML = `<a class="geri" href="#deney">Tüm deneyler</a><h1>${U.kacis(d.ad)}</h1>
      ${neHtml(r)}
      <div id="deneyKap" data-deney="${id}"></div>
      ${dersHtml(r)}`;
    const kap = el.querySelector('#deneyKap');
    kurulanKok = kap;
    try { aktif = k(kap) || null; } finally { kurulanKok = null; }
    ekleriYerlestir(kap, rehberHtml(id) + aciklamaHtml(r));
    erisilebilir(kap, d.ad);
    sozlukIsaretle(el.querySelector('.dn-ne'));
    window.scrollTo(0, 0);
  }
  /* Ekran okuyucu: kaydırıcı değeri çıktı kutusundaki metinle okunsun, ölçümler duyurulsun, kanvasın adı olsun */
  function erisilebilir(kap, ad) {
    let bekliyor = false;
    const guncelle = () => {
      bekliyor = false;
      kap.querySelectorAll('input[type=range]').forEach(g => { const o = kap.querySelector('#' + g.id + 'Cikti'); if (o && o.textContent) g.setAttribute('aria-valuetext', o.textContent); });
      /* Her ölçüm kendi canlı bölgesi: değişen ölçüm adıyla birlikte duyurulur. Her karede değişen (data-canli)
         ölçümler yalnız azaltılmış harekette (değer yalnız kullanıcı kaydırınca değişir) duyurulur. */
      kap.querySelectorAll('dl.olcumler > div:not([aria-live])').forEach(d => {
        const canli = d.hasAttribute('data-canli') && !azHareket;
        d.setAttribute('aria-live', canli ? 'off' : 'polite');
        if (!canli) d.setAttribute('aria-atomic', 'true');
      });
      kap.querySelectorAll('canvas:not([role])').forEach(c => { c.setAttribute('role', 'img'); c.setAttribute('aria-label', ad + ': canlı çizim; değerler aşağıdaki ölçüm kutularında'); });
    };
    const iste = () => { if (!bekliyor) { bekliyor = true; requestAnimationFrame(guncelle); } };
    ['input', 'change', 'click'].forEach(t => kap.addEventListener(t, iste));
    new MutationObserver(iste).observe(kap, { childList: true });
    iste();
  }
  let dersAdlari = {};
  function dersAdi(id) { return dersAdlari[id] || 'Ders ' + String(id).replace(/^d/, ''); }

  function listeAc() {
    if (aktif) { aktif.durdur(); aktif = null; }
    const gruplar = [];
    DENEYLER.forEach(d => { if (!kurucu(d.id) && !d.modul) return; let g = gruplar.find(x => x.ad === d.grup); if (!g) { g = { ad: d.grup, ls: [] }; gruplar.push(g); } g.ls.push(d); });
    el.innerHTML = `<h1>Deneyler</h1>
      <p class="alt-baslik">Her deneyin başında ne olduğu yazar; “Ekranda ne var?” her şeklin anlamını, “Neler dene” ne yapacağını, ne görmen gerektiğini ve nedenini söyler.</p>
      ${gruplar.map(g => `<h2 class="unite-bas">${U.kacis(g.ad)}</h2><ul class="deney-liste">${g.ls.map(d => `<li><a href="#deney/${d.id}"><b>${U.kacis(d.ad)}</b><span>${U.kacis(d.oz)}</span>${U.diziOku('rehber_' + d.id).length ? `<span class="rozet iyi">${U.diziOku('rehber_' + d.id).length}${R[d.id] && R[d.id].adimlar ? '/' + R[d.id].adimlar.length : ''} adım</span>` : ''}</a></li>`).join('')}</ul>`).join('')}`;
  }

  async function ilk(kok) {
    el = kok;
    el.addEventListener('click', e => {
      const b = e.target.closest('.rh-uygula'); if (!b) return;
      const kap = el.querySelector('#deneyKap'); if (kap) rehberUygula(kap, kap.dataset.deney, Number(b.dataset.i));
    });
    let bekle = null;
    window.addEventListener('resize', () => { clearTimeout(bekle); bekle = setTimeout(() => yapiskanAyarla(el.querySelector('#deneyKap')), 150); });
    el.innerHTML = '<p class="bos">Deneyler hazırlanıyor…</p>';
    try {
      const [f, r] = await Promise.all([U.veri('fizik'), U.veri('deney_rehber').catch(() => ({}))]);
      F = f; R = Object.assign({}, r, R);            // ders içinde önceden yüklenen modül rehberleri korunur
      U.veri('dersler').then(D => { (D.dersler || []).forEach(x => { dersAdlari[x.id] = x.baslik; }); el.querySelectorAll('.deney-ders a[data-ders]').forEach(a => { a.textContent = dersAdi(a.dataset.ders); }); }).catch(() => {});
    } catch (e) {
      el.innerHTML = '<div class="hata-kutu" role="alert">Fizik verisi yüklenemedi: ' + U.kacis(e.message) + '. Başka bir sekmeye geçip dönünce yeniden denenir.</div>'; return false;
    }
    goster(el, location.hash.split('/')[1] || '');
  }
  function goster(kok, param) {
    if (!F) return;
    const kap = el.querySelector('#deneyKap');
    if (param && kap && kap.dataset.deney === param && aktif) return;
    if (param) deneyAc(param); else listeAc();
  }
  /* Ders içine gömülü deney: fizik verisini yükler, deneyi kutuya kurar; {durdur} döndürür */
  async function gom(kap, id) {
    if (!F) [F, R] = await Promise.all([U.veri('fizik'), U.veri('deney_rehber').catch(() => ({}))]);
    if (!kurucu(id)) await hazirla(id);
    const k = kurucu(id);
    if (!k) throw new Error('deney yok: ' + id);
    /* Deneyler bölümünde aynı deney kuruluysa (gizli de olsa) kaldır: aynı kimlikli öğeler iki kez olmasın.
       Deneyler bölümüne dönülünce goster() deneyi yeniden kurar. */
    const dk = el && el.querySelector('#deneyKap');
    if (dk && dk.dataset.deney === id) { if (aktif) { aktif.durdur(); aktif = null; } el.innerHTML = ''; }
    kurulanKok = kap;
    let d = null;
    try { d = k(kap) || null; } finally { kurulanKok = null; }
    erisilebilir(kap, (DENEYLER.find(x => x.id === id) || { ad: id }).ad);
    return { durdur() { if (d && d.durdur) d.durdur(); } };
  }
  window.UraniaDeney = { gom, liste: () => DENEYLER.slice() };
  U.modul('deney', { ilk, goster });
})();
