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
    d8: { href: '#deney/gorelilik', ad: 'Işığa yakın yolculuk deneyi' }
  };

  function biten() { return U.oku('dersBitti', {}); }

  function liste() {
    const b = biten();
    const sayi = D.dersler.filter(x => b[x.id]).length;
    el.innerHTML = `<h1>Dersler</h1>
      <p class="alt-baslik">Gökyüzünü okumaktan evrenin tarihine, sırayla. ${sayi ? `${D.dersler.length} dersin ${sayi} tanesini bitirdin.` : 'Her dersin sonunda deftere geçirilecek kısa notlar ve üç soru var.'}</p>
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
      <h1>${U.kacis(x.baslik)}</h1>
      <p class="alt-baslik" style="font-family:var(--sans)">Ders ${i + 1} / ${D.dersler.length}</p>
      ${x.bolumler.map(bl => `<h2>${U.kacis(bl.baslik)}</h2>${bl.paragraflar.map(p => `<p>${U.kacis(p)}</p>`).join('')}`).join('')}
      ${x.formuller && x.formuller.length ? `<h2>Formüller</h2>${x.formuller.map(f => `<div class="formul"><div class="soluk kucuk">${U.kacis(f.ad)}</div><div class="ifade">${U.kacis(f.ifade)}</div>${f.aciklama ? `<div class="acik">${U.kacis(f.aciklama)}</div>` : ''}</div>`).join('')}` : ''}
      ${x.anahtar_sayilar && x.anahtar_sayilar.length ? `<h2>Akılda tutulacak sayılar</h2><ul class="liste sayilar">${x.anahtar_sayilar.map(s => `<li><span class="deger">${U.kacis(s.deger)}</span><span>${U.kacis(s.aciklama)} ${s.kaynak_url ? `<a href="${U.guvenliUrl(s.kaynak_url)}" target="_blank" rel="noopener" class="kucuk">kaynak</a>` : ''}</span></li>`).join('')}</ul>` : ''}
      <h2>Deftere</h2>
      <div class="defter"><ol>${x.defter_notu.map(n => `<li>${U.kacis(n)}</li>`).join('')}</ol></div>
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
    window.scrollTo(0, 0);
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
    if (param) ders(param); else liste();
  }
  U.modul('ders', { ilk, goster });
})();
