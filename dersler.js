/* dersler.js — "Dersler" bölümü: sıralı, kaynaklı dersler; deftere geçirilecek notlar
   ve kendini sınama soruları. İlerleme yalnız bu cihazda tutulur. */
(function () {
  'use strict';
  const U = window.Urania;
  let D = null, el = null;

  /* Derslerle ilgili deney / gökyüzü bağlantıları */
  const BAG = {
    d1: { href: '#gok', ad: 'Gökyüzü levhasında kadir sınırını değiştir' },
    d2: { href: '#hesap', ad: 'Wien ve Stefan-Boltzmann hesapları' },
    d3: { href: '#deney/yorunge', ad: 'Yörünge atışı deneyi' },
    d5: { href: '#deney/yildiz', ad: 'Yıldızın hayatı deneyi' },
    d6: { href: '#deney/karadelik', ad: 'Kara deliğe yaklaşmak deneyi' },
    d8: { href: '#deney/gorelilik', ad: 'Işığa yakın yolculuk deneyi' },
    d9: { href: '#gok', ad: 'Bu gece hangi gezegenler görünüyor?' },
    d10: { href: '#gok', ad: 'Ay\'ın bu geceki evresi ve doğuş-batış saatleri' },
    d11: { href: '#ar', ad: 'Telefonu gökyüzüne tut ve bir dürbün hedefi bul' }
  };

  function biten() { return U.oku('dersBitti', {}); }

  function liste() {
    const b = biten();
    const sayi = D.dersler.filter(x => b[x.id]).length;
    const oz = Kartlar.ozet(D, false);
    const kartKutu = oz.toplam
      ? `<div class="kart-ozet"><div><b>Tekrar kartları</b><span>${oz.bugun ? 'Bugün ' + oz.bugun + ' kart seni bekliyor' : 'Bugünlük tekrar bitti'} · okuduğun derslerden ${oz.toplam} kart</span></div>${oz.bugun ? '<a class="dugme dolu" href="#ders/kartlar">Başla</a>' : ''}</div>`
      : `<div class="kart-ozet"><div><b>Tekrar kartları</b><span>Bir dersi "Okudum" diye işaretleyince soruları ve sayıları tekrar kartı olur.</span></div></div>`;
    el.innerHTML = `<h1>Dersler</h1>
      <p class="alt-baslik">Gökyüzünü okumaktan evrenin tarihine, sırayla. ${sayi ? `${D.dersler.length} dersin ${sayi} tanesini bitirdin.` : 'Her dersin sonunda deftere geçirilecek kısa notlar ve üç soru var.'}</p>
      ${kartKutu}
      <ol class="ders-liste">${D.dersler.map((x, i) => `<li><a href="#ders/${x.id}">
        <span class="no">${i + 1}</span><span class="bas">${U.kacis(x.baslik)}</span>
        <span class="durum${b[x.id] ? ' bitti' : ''}">${b[x.id] ? 'okundu' : ''}</span>
        <span class="oz">${U.kacis(x.ozet)}</span></a></li>`).join('')}</ol>
      <p class="kaynak">${U.kacis(D.not || '')}</p>`;
  }

  function ders(id) {
    const i = D.dersler.findIndex(x => x.id === id);
    if (i < 0) { liste(); return; }
    const x = D.dersler[i];
    const onceki = D.dersler[i - 1], sonraki = D.dersler[i + 1];
    const b = biten();
    const bag = BAG[x.id];
    el.innerHTML = `<article class="ders">
      <a class="geri" href="#ders">Tüm dersler</a>
      <h1 class="okunur">${U.kacis(x.baslik)}</h1>
      <p class="alt-baslik" style="font-family:var(--sans)">Ders ${i + 1} / ${D.dersler.length}</p>
      ${Ses.destek ? `<div class="dinle" role="group" aria-label="Dersi dinle">
        <button type="button" class="dugme dolu" id="dsOynat" aria-pressed="false">Dinle</button>
        <span class="cip-grup" id="dsHiz">${[[0.85, 'Yavaş'], [1, 'Normal'], [1.2, 'Hızlı']].map(([h, a]) => `<button type="button" class="dugme" data-hiz="${h}" aria-pressed="${Ses.hiz() === h}">${a}</button>`).join('')}</span>
        <span class="kucuk soluk" id="dsSesDurum" aria-live="polite"></span></div>` : ''}
      ${x.bolumler.map(bl => `<h2 class="okunur">${U.kacis(bl.baslik)}</h2>${bl.paragraflar.map(p => `<p class="okunur">${U.kacis(p)}</p>`).join('')}`).join('')}
      ${x.formuller && x.formuller.length ? `<h2>Formüller</h2>${x.formuller.map(f => `<div class="formul"><div class="soluk kucuk">${U.kacis(f.ad)}</div><div class="ifade">${U.kacis(f.ifade)}</div>${f.aciklama ? `<div class="acik">${U.kacis(f.aciklama)}</div>` : ''}</div>`).join('')}` : ''}
      ${x.anahtar_sayilar && x.anahtar_sayilar.length ? `<h2>Akılda tutulacak sayılar</h2><ul class="liste sayilar">${x.anahtar_sayilar.map(s => `<li><span class="deger">${U.kacis(s.deger)}</span><span>${U.kacis(s.aciklama)} ${s.kaynak_url ? `<a href="${U.guvenliUrl(s.kaynak_url)}" target="_blank" rel="noopener" class="kucuk">kaynak</a>` : ''}</span></li>`).join('')}</ul>` : ''}
      <h2>Deftere</h2>
      <div class="defter"><ol>${x.defter_notu.map(n => `<li class="okunur">${U.kacis(n)}</li>`).join('')}</ol></div>
      <h2>Kendini sına</h2>
      ${x.sorular.map(s => `<details class="soru"><summary>${U.kacis(s.soru)}</summary><p>${U.kacis(s.cevap)}</p></details>`).join('')}
      ${bag ? `<p style="margin-top:20px;font-family:var(--sans)"><a href="${bag.href}">${bag.ad}</a></p>` : ''}
      <p class="kaynak">Kaynaklar: ${x.kaynaklar.map(k => `<a href="${U.guvenliUrl(k.url)}" target="_blank" rel="noopener">${U.kacis(k.ad)}</a>`).join(' · ')}</p>
      <div class="ders-son">
        <button type="button" class="dugme${b[x.id] ? '' : ' dolu'}" id="dsBitir" aria-pressed="${!!b[x.id]}">${b[x.id] ? 'Okundu olarak işaretli' : 'Okudum'}</button>
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
    if (Ses.destek) sesBagla();
    window.scrollTo(0, 0);
  }

  /* ---- Sesli okuma: başlık, bölümler ve deftere notları; formüller ve sorular okunmaz ---- */
  function sesBagla() {
    const bloklar = [...el.querySelectorAll('.okunur')];
    Ses.hazirla(bloklar.map(b => ({ metin: b.textContent, el: b })));
    const oynat = el.querySelector('#dsOynat'), d = el.querySelector('#dsSesDurum');
    Ses.dinle(s => {
      if (!oynat.isConnected) return;
      oynat.textContent = s.calisiyor ? 'Duraklat' : (s.sira > 0 ? 'Devam et' : 'Dinle');
      oynat.setAttribute('aria-pressed', String(s.calisiyor));
      if (!s.calisiyor && s.sira === 0 && s.toplam && d.dataset.uyari !== '1') d.textContent = '';
    });
    oynat.addEventListener('click', async () => {
      if (Ses.durum().calisiyor) { Ses.durdur(); return; }
      await Ses.sesleriBekle();
      if (!Ses.turkceSes()) { d.dataset.uyari = '1'; d.textContent = 'Telefonun varsayılan metin okuma motoru Türkçe ses bildirmiyor; Chrome yalnız bu motorun seslerini kullanır. Ayarlar\'daki "Metin okuma" (TTS) bölümünden Türkçe destekleyen bir motor (ör. Google\'ın konuşma motoru) seçip Türkçe ses verisini yükleyebilirsin. Şimdilik varsayılan sesle okunuyor.'; }
      Ses.baslat();
    });
    el.querySelector('#dsHiz').addEventListener('click', e => {
      const b = e.target.closest('[data-hiz]'); if (!b) return;
      el.querySelectorAll('#dsHiz [data-hiz]').forEach(x => { const s = x === b; x.setAttribute('aria-pressed', String(s)); });
      Ses.hizAyarla(Number(b.dataset.hiz));
    });
    /* Okurken bir paragrafa dokununca oradan devam eder */
    bloklar.forEach((b, i) => b.addEventListener('click', () => { if (Ses.durum().calisiyor) Ses.blogaGit(i); }));
  }

  /* ---- Tekrar kartları ---- */
  let oturum = null;
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
    el.innerHTML = `${ust}<p class="alt-baslik" style="font-family:var(--sans)">${o.i + 1} / ${o.sira.length} · ${U.kacis(k.dersAd)}</p>
      <div class="kart" aria-live="polite">
        <p class="kart-on" tabindex="-1">${U.kacis(k.on)}${k.tur === 'sayi' ? '<span class="kucuk soluk"> — değeri ne?</span>' : ''}</p>
        <div class="kart-arka" id="kaArka" hidden><p>${U.kacis(k.arka)}</p>${k.kaynak ? `<a class="kucuk" href="${U.guvenliUrl(k.kaynak)}" target="_blank" rel="noopener">kaynak</a>` : ''}</div>
      </div>
      <div class="cip-grup kart-dugme" id="kaGoster"><button type="button" class="dugme dolu" id="kaCevir">Cevabı göster</button></div>
      <div class="cip-grup kart-dugme" id="kaYanit" hidden><button type="button" class="dugme" id="kaHayir">Bilemedim</button><button type="button" class="dugme dolu" id="kaEvet">Bildim</button></div>
      <p class="kaynak"><a href="#ders/${k.ders}">Bu kartın dersine git</a></p>`;
    /* Yeni kart çizilince odak kartın sorusuna: ekran okuyucu okur, klavyede sıra kaybolmaz */
    if (o.i > 0) el.querySelector('.kart-on').focus();
    el.querySelector('#kaCevir').addEventListener('click', () => {
      el.querySelector('#kaArka').hidden = false; el.querySelector('#kaGoster').hidden = true; el.querySelector('#kaYanit').hidden = false;
      el.querySelector('#kaEvet').focus();
    });
    const yanit = bildi => {
      if (!Kartlar.cevapla(k.id, bildi)) { el.querySelector('.kart').insertAdjacentHTML('afterend', '<div class="hata-kutu" role="alert">Cihazın depolama alanı dolu; ilerleme kaydedilemedi.</div>'); return; }
      if (bildi) o.bildi++; else o.bilemedi++;
      o.i++; kartCiz();
    };
    el.querySelector('#kaEvet').addEventListener('click', () => yanit(true));
    el.querySelector('#kaHayir').addEventListener('click', () => yanit(false));
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = '<p class="bos">Dersler yükleniyor…</p>';
    try { D = await U.veri('dersler'); } catch (e) {
      el.innerHTML = '<div class="hata-kutu">Dersler yüklenemedi: ' + U.kacis(e.message) + '</div>'; return;
    }
    goster(kok, (location.hash.split('/')[1]) || '');
  }
  function goster(kok, param) {
    if (!D) return;
    if (param === 'kartlar') kartlar(false);
    else { oturum = null; if (param) ders(param); else liste(); }
  }
  U.modul('ders', { ilk, goster });
})();
