/* dersler.js — "Dersler" bölümü: sıralı, kaynaklı dersler; deftere geçirilecek notlar
   ve kendini sınama soruları. İlerleme yalnız bu cihazda tutulur. */
(function () {
  'use strict';
  const U = window.Urania;
  let D = null, el = null;

  /* Derslerle ilgili deney / gökyüzü bağlantıları (bir derse birden çok) */
  const BAG = {
    d1: [{ href: '#gok', ad: 'Gökyüzü levhasında kadir sınırını değiştir' }],
    d2: [{ href: '#deney/tayf', ad: 'Tayf ve Doppler deneyi' }, { href: '#hesap', ad: 'Wien ve Stefan-Boltzmann hesapları' }],
    d3: [{ href: '#deney/kepler', ad: 'Kepler yasaları deneyi' }, { href: '#deney/yorunge', ad: 'Yörünge atışı deneyi' }, { href: '#deney/gelgit', ad: 'Gelgit deneyi' }],
    d5: [{ href: '#deney/yildiz', ad: 'Yıldızın hayatı deneyi' }],
    d6: [{ href: '#deney/karadelik', ad: 'Kara deliğe yaklaşmak deneyi' }],
    d8: [{ href: '#deney/gorelilik', ad: 'Işığa yakın yolculuk deneyi' }],
    d9: [{ href: '#gok', ad: 'Bu gece hangi gezegenler görünüyor?' }],
    d10: [{ href: '#deney/evreler', ad: 'Ay evreleri ve tutulmalar deneyi' }, { href: '#gok', ad: 'Ay\'ın bu geceki evresi ve doğuş-batış saatleri' }],
    d11: [{ href: '#ar', ad: 'Telefonu gökyüzüne tut ve bir dürbün hedefi bul' }],
    d13: [{ href: '#deney/gecis', ad: 'Ötegezegen geçişi deneyi' }],
    d15: [{ href: '#gok', ad: 'Algol\'ün bu ayki kararmaları' }],
    d16: [{ href: '#deney/karadelik', ad: 'Kara deliğe yaklaşmak deneyi' }],
    d17: [{ href: '#deney/hubble', ad: 'Genişleyen evren (Hubble yasası) deneyi' }],
    d19: [{ href: '#gok', ad: 'Bu ayki meteor yağmurları' }]
  };

  function biten() { return U.oku('dersBitti', {}); }

  /* Ders sırası ünitelerden gelir (veri/dersler.json → uniteler); yoksa dosyadaki sıra */
  function sirali() {
    if (!D.uniteler) return D.dersler;
    const ls = [];
    D.uniteler.forEach(u => u.dersler.forEach(id => { const x = D.dersler.find(d => d.id === id); if (x) ls.push(x); }));
    D.dersler.forEach(x => { if (ls.indexOf(x) < 0) ls.push(x); });
    return ls;
  }
  function uniteAd(id) { const u = (D.uniteler || []).find(u => u.dersler.indexOf(id) >= 0); return u ? u.ad : ''; }
  function dakika(x) {
    const k = x.bolumler.reduce((t, b) => t + b.paragraflar.join(' ').split(/\s+/).length + (b.ornek ? b.ornek.metin.split(/\s+/).length : 0), 0);
    return Math.max(1, Math.round(k / 180));   // ~180 kelime/dk okuma
  }

  function liste() {
    gomuluDurdur();
    const b = biten();
    const sira = sirali();
    const sayi = sira.filter(x => b[x.id]).length;
    const oz = Kartlar.ozet(D, false);
    const kartKutu = oz.toplam
      ? `<div class="kart-ozet"><div><b>Tekrar kartları</b><span>${oz.bugun ? 'Bugün ' + oz.bugun + ' kart seni bekliyor' : 'Bugünlük tekrar bitti'} · okuduğun derslerden ${oz.toplam} kart</span></div>${oz.bugun ? '<a class="dugme dolu" href="#ders/kartlar">Başla</a>' : ''}</div>`
      : `<div class="kart-ozet"><div><b>Tekrar kartları</b><span>Bir dersi "Okudum" diye işaretleyince soruları ve sayıları tekrar kartı olur.</span></div></div>`;
    el.innerHTML = `<h1>Dersler</h1>
      <p class="alt-baslik">Gökyüzünü okumaktan evrenin tarihine, sırayla. ${sayi ? `${sira.length} dersin ${sayi} tanesini bitirdin.` : 'Her dersin sonunda çözülmüş örnekler, sözlük, deftere notlar ve kendini sınama soruları var.'}</p>
      ${kartKutu}
      ${(D.uniteler || [{ ad: '', dersler: sira.map(x => x.id) }]).map(u => {
        const ls = u.dersler.map(id => sira.find(x => x.id === id)).filter(Boolean);
        return `${u.ad ? `<h2 class="unite-bas">${U.kacis(u.ad)}</h2>${u.aciklama ? `<p class="soluk kucuk unite-acik">${U.kacis(u.aciklama)}</p>` : ''}` : ''}
        <ol class="ders-liste">${ls.map(x => { const i = sira.indexOf(x); return `<li><a href="#ders/${x.id}">
          <span class="no">${i + 1}</span><span class="bas">${U.kacis(x.baslik)}${x.yeni ? ' <span class="rozet">yeni</span>' : ''}</span>
          <span class="durum${b[x.id] ? ' bitti' : ''}">${b[x.id] ? 'okundu' : dakika(x) + ' dk'}</span>
          <span class="oz">${U.kacis(x.ozet)}</span></a></li>`; }).join('')}</ol>${u.id ? sinavGiris(u) : ''}`;
      }).join('')}
      <p class="kaynak">${U.kacis(D.not || '')}</p>`;
  }

  /* Ders çizimleri (cizim.js ve ünite dosyaları): bölümün paragraflarından sonra, şekil numarası derste sırayla */
  let sekilNo = 0;
  function cizimler(ders, bolum) {
    const C = window.UraniaCizim; if (!C) return '';
    return C.bolumCizimleri(ders, bolum).map(t => C.html(t, ++sekilNo)).join('');
  }
  /* Ders içinde deney: bölümün sonunda, basınca açılır (açılmadan döngü çalışmaz) */
  const MINI = {
    d2: { 4: 'tayf' }, d3: { 1: 'kepler', 5: 'yorunge', 7: 'gelgit' }, d5: { 2: 'yildiz' }, d10: { 0: 'evreler' },
    d13: { 2: 'gecis' }, d16: { 1: 'karadelik', 2: 'gorelilik' }, d17: { 1: 'hubble' }
  };
  const DENEY_AD = { tayf: 'Tayf ve Doppler', kepler: 'Kepler yasaları', yorunge: 'Yörünge atışı', gelgit: 'Gelgit', yildiz: 'Yıldızın hayatı',
    evreler: 'Ay evreleri ve tutulmalar', gecis: 'Ötegezegen geçişi', karadelik: 'Kara deliğe yaklaşmak', gorelilik: 'Işığa yakın yolculuk', hubble: 'Genişleyen evren' };
  function miniDeney(ders, bolum) {
    const id = (MINI[ders] || {})[bolum];
    if (!id) return '';
    return `<div class="mini-deney" data-deney="${id}"><div class="mini-bas"><span><b>Dene: ${U.kacis(DENEY_AD[id] || id)}</b><span class="kucuk soluk">Okuduğunu burada kaydırıcılarla dene.</span></span>
      <button type="button" class="dugme mini-ac" aria-expanded="false">Burada aç</button></div><div class="mini-kap" hidden></div>
      <a class="kucuk mini-tam" href="#deney/${id}">Adım adım rehberle tam sayfada aç</a></div>`;
  }
  let gomulu = [];
  function gomuluDurdur() { gomulu.forEach(g => { try { g.durdur(); } catch (e) { /* yok */ } }); gomulu = []; }
  function miniBagla() {
    el.querySelectorAll('.mini-deney').forEach(m => {
      const b = m.querySelector('.mini-ac'), kap = m.querySelector('.mini-kap');
      let d = null;
      b.addEventListener('click', async () => {
        const ac = kap.hidden;
        if (!ac) { kap.hidden = true; b.textContent = 'Burada aç'; b.setAttribute('aria-expanded', 'false'); if (d) { d.durdur(); gomulu = gomulu.filter(x => x !== d); d = null; } kap.innerHTML = ''; return; }
        kap.hidden = false; b.textContent = 'Kapat'; b.setAttribute('aria-expanded', 'true');
        kap.innerHTML = '<p class="bos">Deney hazırlanıyor…</p>';
        try { kap.innerHTML = ''; d = await window.UraniaDeney.gom(kap, m.dataset.deney); gomulu.push(d); }
        catch (e) { kap.innerHTML = '<div class="hata-kutu">Deney açılamadı: ' + U.kacis(e.message) + '</div>'; }
      });
    });
  }

  function ders(id) {
    sekilNo = 0;
    gomuluDurdur();
    const sira = sirali();
    const i = sira.findIndex(x => x.id === id);
    if (i < 0) { liste(); return; }
    const x = sira[i];
    const onceki = sira[i - 1], sonraki = sira[i + 1];
    const b = biten();
    const bag = BAG[x.id] || [];
    const onBilgi = (x.on_bilgi || []).map(o => sira.find(d => d.id === o)).filter(Boolean);
    el.innerHTML = `<article class="ders">
      <a class="geri" href="#ders">Tüm dersler</a>
      <h1 class="okunur" data-ses="Ders ${i + 1}: ${U.kacis(x.baslik)}">${U.kacis(x.baslik)}</h1>
      <p class="alt-baslik" style="font-family:var(--sans)">${uniteAd(x.id) ? U.kacis(uniteAd(x.id)) + ' · ' : ''}Ders ${i + 1} / ${sira.length} · yaklaşık ${dakika(x)} dk</p>
      ${onBilgi.length ? `<p class="kucuk soluk on-bilgi">Önce okuman iyi olur: ${onBilgi.map(o => `<a href="#ders/${o.id}">${U.kacis(o.baslik)}</a>`).join(', ')}</p>` : ''}
      ${x.ozet ? `<p class="ders-ozet okunur">${U.kacis(x.ozet)}</p>` : ''}
      <div class="dinle" id="dsSes" role="group" aria-label="Dersi dinle"></div>
      ${sonraki ? `<label class="secim-satir kucuk ds-surekli"><input type="checkbox" id="dsSurekli"${U.oku('sesSurekli', false) ? ' checked' : ''}> <span>Bitince sonraki derse geç ve okumayı sürdür</span></label>` : ''}
      ${x.bolumler.map((bl, bi) => `<h2 class="okunur">${U.kacis(bl.baslik)}</h2>${bl.paragraflar.map(p => `<p class="okunur">${U.kacis(p)}</p>`).join('')}
        ${cizimler(x.id, bi)}${miniDeney(x.id, bi)}
        ${bl.ornek ? `<div class="ornek okunur" data-ses="${U.kacis(bl.ornek.baslik + '. ' + bl.ornek.metin)}"><div class="ornek-bas">${U.kacis(bl.ornek.baslik)}</div><p>${U.kacis(bl.ornek.metin)}</p></div>` : ''}
        ${bl.akilda ? `<p class="akilda okunur" data-ses="${U.kacis('Aklında kalsın: ' + bl.akilda)}"><span>Aklında kalsın</span>${U.kacis(bl.akilda)}</p>` : ''}`).join('')}
      ${x.formuller && x.formuller.length ? `<h2>Formüller</h2>${x.formuller.map(f => `<div class="formul"><div class="soluk kucuk">${U.kacis(f.ad)}</div><div class="ifade">${U.kacis(f.ifade)}</div>${f.aciklama ? `<div class="acik">${U.kacis(f.aciklama)}</div>` : ''}</div>`).join('')}` : ''}
      ${x.anahtar_sayilar && x.anahtar_sayilar.length ? `<h2>Akılda tutulacak sayılar</h2><ul class="liste sayilar">${x.anahtar_sayilar.map(s => `<li><span class="deger">${U.kacis(s.deger)}</span><span>${U.kacis(s.aciklama)} ${s.kaynak_url ? `<a href="${U.guvenliUrl(s.kaynak_url)}" target="_blank" rel="noopener" class="kucuk">kaynak</a>` : ''}</span></li>`).join('')}</ul>` : ''}
      ${x.sozluk && x.sozluk.length ? `<h2>Sözlük</h2><dl class="sozluk">${x.sozluk.map(t => `<div><dt>${U.kacis(t.terim)}</dt><dd>${U.kacis(t.tanim)}</dd></div>`).join('')}</dl>` : ''}
      <h2>Deftere</h2>
      <div class="defter"><ol>${x.defter_notu.map(n => `<li class="okunur">${U.kacis(n)}</li>`).join('')}</ol></div>
      <h2>Kendini sına</h2>
      ${x.sorular.map(s => `<details class="soru"><summary>${U.kacis(s.soru)}</summary><p>${U.kacis(s.cevap)}</p></details>`).join('')}
      ${bag.length ? `<div class="ders-bag"><h2>Dene, gözle</h2><ul>${bag.map(g => `<li><a href="${g.href}">${U.kacis(g.ad)}</a></li>`).join('')}</ul></div>` : ''}
      <p class="kaynak">Kaynaklar: ${x.kaynaklar.map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ')}</p>
      <div class="ders-son">
        <button type="button" class="dugme${b[x.id] ? '' : ' dolu'}" id="dsBitir" aria-pressed="${!!b[x.id]}">${b[x.id] ? 'Okundu olarak işaretli' : 'Okudum'}</button>
        ${uniteSonu(x.id)}
        <span class="cip-grup">${onceki ? `<a class="dugme" href="#ders/${onceki.id}">Önceki</a>` : ''}${sonraki ? `<a class="dugme" href="#ders/${sonraki.id}">Sonraki: ${U.kacis(sonraki.baslik)}</a>` : ''}</span>
      </div>
    </article>`;
    el.querySelector('#dsBitir').addEventListener('click', e => {
      const s = biten();
      if (s[x.id]) delete s[x.id]; else s[x.id] = new Date().toISOString();
      U.yaz('dersBitti', s);
      const acik = !!s[x.id];
      e.currentTarget.setAttribute('aria-pressed', String(acik));
      e.currentTarget.classList.toggle('dolu', !acik);
      e.currentTarget.textContent = acik ? 'Okundu olarak işaretli' : 'Okudum';
    });
    /* Dersten derse kesintisiz dinleme: okuma bitince (ve kutu işaretliyse) sonraki derse geç, orada
       kendiliğinden başlat. Bayrak yalnız bu oturumda (sessionStorage); elle gezinmede tetiklenmez. */
    Ses.bagla(el.querySelector('article.ders'), el.querySelector('#dsSes'), 'ders ' + x.id, {
      bitince: () => {
        if (!sonraki || !U.oku('sesSurekli', false)) return;
        try { sessionStorage.setItem('urania_sesDevam', sonraki.id); } catch (h) { /* yok */ }
        location.hash = '#ders/' + sonraki.id;
      }
    });
    miniBagla();
    const sk = el.querySelector('#dsSurekli');
    if (sk) sk.addEventListener('change', () => U.yaz('sesSurekli', sk.checked));
    let devamEt = null;
    try { devamEt = sessionStorage.getItem('urania_sesDevam'); sessionStorage.removeItem('urania_sesDevam'); } catch (h) { /* yok */ }
    if (devamEt === x.id) setTimeout(() => Ses.baslat(0), 400);
    window.scrollTo(0, 0);
  }

  /* Sesli okuma: başlık, bölümler ve deftere notları (.okunur); formüller ve sorular okunmaz.
     Motor ses.js'te (Pinakes'ten uyarlandı). */

  /* ---- Ünite sınavları (veri/sinavlar.json): çoktan seçmeli; yanlışlar tekrar kartlarına düşer ---- */
  function sinavSorulari(uid) { return (D.sinavlar && D.sinavlar.uniteler && D.sinavlar.uniteler[uid]) || []; }
  function sinavSonuclari() { return U.oku('sinavSonuc', {}) || {}; }
  function sinavGiris(u) {
    const ls = sinavSorulari(u.id); if (!ls.length) return '';
    const g = (sinavSonuclari()[u.id] || []).slice(-1)[0];
    return `<a class="sinav-giris" href="#ders/sinav/${u.id}"><b>Ünite sınavı</b><span>${ls.length} soru${g ? ` · son sonucun ${g.dogru}/${g.toplam}` : ''}</span></a>`;
  }
  function uniteSonu(dersId) {
    const u = (D.uniteler || []).find(u => u.dersler[u.dersler.length - 1] === dersId);
    return u && sinavSorulari(u.id).length ? `<a class="dugme" href="#ders/sinav/${u.id}">Ünite sınavı: ${U.kacis(u.ad)}</a>` : '';
  }
  let sinavOturum = null;
  function karistir(ls) { const a = ls.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function sinav(uid) {
    gomuluDurdur();
    const u = (D.uniteler || []).find(x => x.id === uid), ls = sinavSorulari(uid);
    if (!u || !ls.length) { liste(); return; }
    if (!sinavOturum || sinavOturum.uid !== uid) sinavOturum = { uid, sira: karistir(ls), i: 0, cevap: {}, dogru: 0 };
    sinavCiz(u);
  }
  const HARF = ['A', 'B', 'C', 'D', 'E'];
  function sinavCiz(u) {
    const o = sinavOturum, q = o.sira[o.i];
    const ust = `<a class="geri" href="#ders">Tüm dersler</a><h1>Ünite sınavı</h1><p class="alt-baslik">${U.kacis(u.ad)}</p>`;
    if (!q) {
      const yanlis = o.sira.filter(x => o.cevap[x.id] !== x.dogru);
      const sonuc = sinavSonuclari(); (sonuc[u.id] = sonuc[u.id] || []).push({ t: Date.now(), dogru: o.dogru, toplam: o.sira.length }); sonuc[u.id] = sonuc[u.id].slice(-20); U.yaz('sinavSonuc', sonuc);
      const gecmis = sonuc[u.id].slice(-6).map(g => `${g.dogru}/${g.toplam}`).join(' · ');
      el.innerHTML = `${ust}<p class="sinav-puan" tabindex="-1" id="snSon"><b>${o.dogru} / ${o.sira.length}</b> doğru.</p>
        <p class="kucuk soluk">Son sonuçların: ${gecmis}</p>
        ${yanlis.length ? `<p>Yanlış yaptığın ${yanlis.length} soru tekrar kartlarına eklendi; doğru bildikçe seyrekleşir.</p>
          <ul class="liste">${yanlis.map(x => { const d = D.dersler.find(d => d.id === x.ders); return `<li><span>${U.kacis(x.soru)}<br><span class="kucuk soluk">Doğrusu: ${U.kacis(x.secenekler[x.dogru])}${d ? ` · <a href="#ders/${d.id}">${U.kacis(d.baslik)}</a>` : ''}</span></span></li>`; }).join('')}</ul>` : '<p>Hepsini bildin.</p>'}
        <div class="cip-grup"><button type="button" class="dugme dolu" id="snTekrar">Yeniden çöz</button><a class="dugme" href="#ders">Derslere dön</a></div>`;
      el.querySelector('#snTekrar').addEventListener('click', () => { sinavOturum = null; sinav(u.id); });
      el.querySelector('#snSon').focus();
      return;
    }
    const secildi = o.cevap[q.id];
    const cevaplandi = secildi != null;
    const d = D.dersler.find(x => x.id === q.ders);
    el.innerHTML = `${ust}
      <p class="kucuk soluk">Soru ${o.i + 1} / ${o.sira.length} · ${o.dogru} doğru</p>
      <div class="sinav-soru"><p id="snSoru" tabindex="-1">${U.kacis(q.soru)}</p>
        <div class="sinav-secenek" role="group" aria-label="Seçenekler">${q.secenekler.map((s, i) => {
          const sinif = !cevaplandi ? '' : (i === q.dogru ? ' dogru' : (i === secildi ? ' yanlis' : ''));
          return `<button type="button" class="dugme${sinif}" data-i="${i}"${cevaplandi ? ' disabled' : ''}><b>${HARF[i]}</b> ${U.kacis(s)}</button>`; }).join('')}</div>
        ${cevaplandi ? `<p class="sinav-sonuc ${secildi === q.dogru ? 'iyi' : 'kotu'}" role="status"><b>${secildi === q.dogru ? 'Doğru.' : 'Doğrusu ' + HARF[q.dogru] + '.'}</b> ${U.kacis(q.aciklama)}${d ? ` <a href="#ders/${d.id}">${U.kacis(d.baslik)}</a>` : ''}</p>
          <button type="button" class="dugme dolu" id="snSonraki">${o.i + 1 < o.sira.length ? 'Sonraki soru' : 'Sonucu gör'}</button>` : ''}
        <button type="button" class="bag" id="snDinle">${cevaplandi ? 'Açıklamayı dinle' : 'Soruyu dinle'}</button>
      </div>`;
    el.querySelectorAll('.sinav-secenek button').forEach(b => b.addEventListener('click', () => {
      const i = Number(b.dataset.i);
      o.cevap[q.id] = i;
      const yan = U.oku('sinavYanlis', {}) || {};
      if (i === q.dogru) { o.dogru++; } else { yan[q.id] = Date.now(); U.yaz('sinavYanlis', yan); }
      Ses.sus();
      sinavCiz(u);
      const s = el.querySelector('#snSonraki'); if (s) s.focus();
    }));
    const sn = el.querySelector('#snSonraki');
    if (sn) sn.addEventListener('click', () => { Ses.sus(); o.i++; sinavCiz(u); const p = el.querySelector('#snSoru') || el.querySelector('#snSon'); if (p) p.focus(); window.scrollTo(0, 0); });
    el.querySelector('#snDinle').addEventListener('click', () => {
      if (!cevaplandi) Ses.soyle(q.soru + ' ' + q.secenekler.map((s, i) => HARF[i] + ': ' + s + '.').join(' '));
      else Ses.soyle((o.cevap[q.id] === q.dogru ? 'Doğru. ' : 'Doğrusu ' + HARF[q.dogru] + ': ' + q.secenekler[q.dogru] + '. ') + q.aciklama);
    });
  }

  /* ---- Tekrar kartları ---- */
  let oturum = null, kartSayac = 0;
  const DUSUNME_SN = 8;
  function kartlar(hepsi) {
    if (!oturum || oturum.hepsi !== !!hepsi) oturum = { hepsi: !!hepsi, sira: Kartlar.bugunku(D, hepsi), bildi: 0, bilemedi: 0, i: 0 };
    kartCiz();
  }
  function kartCiz() {
    const o = oturum, k = o.sira[o.i];
    const ust = `<a class="geri" href="#ders">Tüm dersler</a><h1>Tekrar kartları</h1>`;
    if (!k) {
      const oz = Kartlar.ozet(D, o.hepsi);
      const yapilan = o.bildi + o.bilemedi;
      el.innerHTML = `${ust}<p class="alt-baslik" tabindex="-1" id="kaSon">${yapilan ? `Bu tur bitti: ${o.bildi} bildin, ${o.bilemedi} tekrar edilecek.` : 'Bugün sorulacak kart yok.'}</p>
        <div class="kutu-sira" aria-label="Kutulardaki kart sayıları">${oz.kutular.map((n, i) => `<div><b>${n}</b><span>${i === 0 ? 'yeni' : i + '. kutu'}${i ? ' · ' + Kartlar.ARALIK_GUN[i - 1] + ' günde bir' : ''}</span></div>`).join('')}</div>
        <p class="kaynak">Bildiğin kart bir sonraki kutuya geçer ve daha seyrek sorulur; bilemediğin ilk kutuya döner (<a href="https://en.wikipedia.org/wiki/Leitner_system" target="_blank" rel="noopener">Leitner yöntemi</a>). İlerleme yalnız bu cihazda.</p>
        <div class="cip-grup"><a class="dugme" href="#ders">Derslere dön</a>${!o.hepsi && Kartlar.deste(D, true).length > oz.toplam ? '<button type="button" class="dugme" id="kaHepsi">Okumadığım derslerin kartlarını da ekle</button>' : ''}</div>`;
      const h = el.querySelector('#kaHepsi'); if (h) h.addEventListener('click', () => { oturum = null; kartlar(true); });
      if (yapilan) el.querySelector('#kaSon').focus();
      oturum = null;
      return;
    }
    const sesOlabilir = ['yok-api', 'yok-tr'].indexOf(Ses.sesDurumu()) < 0;   // 'bekleniyor': sesler birazdan yüklenir
    const sesli = !!U.oku('kartSesli', false) && sesOlabilir;
    el.innerHTML = `${ust}<div class="kart-ust"><p class="alt-baslik" style="font-family:var(--sans)">${o.i + 1} / ${o.sira.length} · ${U.kacis(k.dersAd)}</p>
      ${sesOlabilir ? `<button type="button" class="dugme kart-sesli" id="kaSesli" aria-pressed="${sesli}">Sesli tekrar</button>` : ''}</div>
      <div class="kart" aria-live="polite">
        <p class="kart-on" tabindex="-1">${U.kacis(k.on)}${k.tur === 'sayi' ? '<span class="kucuk soluk"> — değeri ne?</span>' : (k.tur === 'terim' ? '<span class="kucuk soluk"> — ne demek?</span>' : '')}</p>
        <div class="kart-arka" id="kaArka" hidden><p>${U.kacis(k.arka)}</p>${k.kaynak ? `<a class="kucuk" href="${U.guvenliUrl(k.kaynak)}" target="_blank" rel="noopener">kaynak</a>` : ''}</div>
      </div>
      <div class="cip-grup kart-dugme" id="kaGoster"><button type="button" class="dugme dolu" id="kaCevir">Cevabı göster</button></div>
      <div class="cip-grup kart-dugme" id="kaYanit" hidden><button type="button" class="dugme" id="kaHayir">Bilemedim</button><button type="button" class="dugme dolu" id="kaEvet">Bildim</button></div>
      <p class="kaynak"><a href="#ders/${k.ders}">Bu kartın dersine git</a></p>`;
    /* Yeni kart çizilince odak kartın sorusuna: ekran okuyucu okur, klavyede sıra kaybolmaz */
    if (o.i > 0) el.querySelector('.kart-on').focus();
    /* Sesli tekrar: soruyu okur, düşünmen için 8 sn bekler (sayaç düğmede), cevabı açıp okur;
       Bildim/Bilemedim senin dokunuşunla. Eller serbest çalışma için. */
    const kartNo = ++kartSayac;
    let sayac = null;
    const cevir = el.querySelector('#kaCevir');
    const goster = () => {
      clearInterval(sayac);
      if (kartNo !== kartSayac || !cevir.isConnected) return;
      el.querySelector('#kaArka').hidden = false; el.querySelector('#kaGoster').hidden = true; el.querySelector('#kaYanit').hidden = false;
      el.querySelector('#kaEvet').focus();
      if (U.oku('kartSesli', false)) Ses.soyle(k.arka);
    };
    const sorOku = (deneme) => {
      const oldu = Ses.soyle(k.on + (k.tur === 'sayi' ? '. Değeri ne?' : (k.tur === 'terim' ? '. Ne demek?' : '')), { bitince: () => {
        if (kartNo !== kartSayac || !cevir.isConnected || el.querySelector('#kaGoster').hidden) return;
        let kalan = DUSUNME_SN;
        cevir.textContent = 'Cevabı göster (' + kalan + ')';
        sayac = setInterval(() => {
          if (kartNo !== kartSayac || !cevir.isConnected) { clearInterval(sayac); return; }
          kalan--;
          if (kalan <= 0) goster(); else cevir.textContent = 'Cevabı göster (' + kalan + ')';
        }, 1000);
      } });
      /* sesler henüz yüklenmediyse bir kez daha dene */
      if (!oldu && !deneme) setTimeout(() => { if (kartNo === kartSayac && cevir.isConnected) sorOku(true); }, 1700);
    };
    cevir.addEventListener('click', goster);
    const sesliD = el.querySelector('#kaSesli');
    if (sesliD) sesliD.addEventListener('click', () => {
      const acik = !U.oku('kartSesli', false);
      U.yaz('kartSesli', acik);
      sesliD.setAttribute('aria-pressed', String(acik));
      if (acik && !el.querySelector('#kaGoster').hidden) sorOku();
      if (!acik) { clearInterval(sayac); Ses.sus(); cevir.textContent = 'Cevabı göster'; }
    });
    if (sesli) sorOku();
    const yanit = bildi => {
      if (!Kartlar.cevapla(k.id, bildi)) { el.querySelector('.kart').insertAdjacentHTML('afterend', '<div class="hata-kutu" role="alert">Cihazın depolama alanı dolu; ilerleme kaydedilemedi.</div>'); return; }
      if (bildi) o.bildi++; else o.bilemedi++;
      Ses.sus(); o.i++; kartCiz();
    };
    el.querySelector('#kaEvet').addEventListener('click', () => yanit(true));
    el.querySelector('#kaHayir').addEventListener('click', () => yanit(false));
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Dersler yükleniyor…</p>';
    try {
      D = await U.veri('dersler');
      try { D.sinavlar = await U.veri('sinavlar'); } catch (e) { D.sinavlar = null; }   // sınavlar yoksa dersler yine açılır
    } catch (e) {
      el.innerHTML = '<div class="hata-kutu">Dersler yüklenemedi: ' + U.kacis(e.message) + '</div>'; return;
    }
    goster(kok, (location.hash.split('/')[1]) || '');
  }
  function goster(kok, param) {
    if (!D) return;
    if (param === 'kartlar') kartlar(false);
    else if (param.startsWith('sinav/')) { oturum = null; sinav(param.slice(6)); }
    else { oturum = null; sinavOturum = null; if (param) ders(param); else liste(); }
  }
  U.modul('ders', { ilk, goster });
})();
