/* tani.js — Tanı ekranı (#tani): telefonda bir şey ters gidince neyin olduğunu görmek
   ve tek dokunuşla kopyalayıp paylaşmak için. Diğer betiklerden ÖNCE yüklenir ki
   başlangıçtaki hatalar da yakalansın. Kişisel veri (defter notları) eklenmez. */
(function () {
  'use strict';
  const hatalar = [];
  const servisler = {};
  function hataEkle(m) {
    hatalar.push({ zaman: new Date().toISOString(), mesaj: String(m).slice(0, 300) });
    if (hatalar.length > 20) hatalar.shift();
  }
  window.addEventListener('error', e => hataEkle((e.message || 'hata') + (e.filename ? ' @ ' + e.filename.split('/').pop() + ':' + e.lineno : '')));
  window.addEventListener('unhandledrejection', e => hataEkle('söz reddi: ' + (e.reason && e.reason.message || e.reason)));

  function servis(ad, durum, ayrinti) {
    servisler[ad] = { zaman: new Date().toISOString(), durum, ayrinti: ayrinti ? String(ayrinti).slice(0, 160) : '' };
  }

  /* ---- Ekran ---- */
  let el = null, canli = null, olay = { sayi: 0, mutlak: 0, son: null, tur: '' };
  const yonDinle = (e, tur) => {
    if (e.alpha == null && e.beta == null && e.webkitCompassHeading == null) return; // algılayıcısız tarayıcının boş olayı
    olay.sayi++; if (tur === 'mutlak' || e.absolute) olay.mutlak++;
    olay.son = { alpha: e.alpha, beta: e.beta, gamma: e.gamma, absolute: e.absolute, pusula: e.webkitCompassHeading };
    olay.tur = tur;
  };
  const mutlakD = e => yonDinle(e, 'mutlak'), goreliD = e => yonDinle(e, 'goreli');

  function f(x, b) { return x == null || !isFinite(x) ? '—' : Number(x).toFixed(b == null ? 1 : b); }

  async function rapor() {
    const U = window.Urania;
    const k = U.konum(), kd = U.konumDurum || {};
    let izin = '—';
    try { izin = (await navigator.permissions.query({ name: 'geolocation' })).state; } catch (e) { /* desteklenmiyor */ }
    let depo = '—';
    try { const t = await navigator.storage.estimate(); depo = Math.round(t.usage / 1024) + ' KB / ' + Math.round(t.quota / 1048576) + ' MB'; } catch (e) { /* desteklenmiyor */ }
    let sw = '—';
    try { const ks = await caches.keys(); sw = ks.filter(x => x.indexOf('urania-') === 0).join(', ') || 'önbellek yok'; } catch (e) { /* yok */ }
    const ar = window.UraniaAR ? window.UraniaAR.st : null;
    const defter = (U.oku('defter', []) || []).length;
    const gpI = U.oku('gp_istasyon', null), gpD = U.oku('gp_dizi', null);
    const satir = [
      'URANIA TANI — ' + new Date().toISOString(),
      'Sürüm (önbellek): ' + sw,
      'Tarayıcı: ' + navigator.userAgent,
      'Ekran: ' + screen.width + '×' + screen.height + ' · dpr ' + (window.devicePixelRatio || 1) + ' · yön açısı ' + ((screen.orientation && screen.orientation.angle) || 0) + ' · ' + (matchMedia('(display-mode: standalone)').matches ? 'kurulu uygulama' : 'tarayıcı sekmesi'),
      'Ağ: ' + (navigator.onLine ? 'çevrimiçi' : 'çevrimdışı') + ' · saat dilimi ' + Intl.DateTimeFormat().resolvedOptions().timeZone,
      '',
      'KONUM: ' + k.ad + ' (' + f(k.enlem, 4) + ', ' + f(k.boylam, 4) + ') · ' + (U.otoAcik() ? 'otomatik' : 'elle') + ' · izin ' + izin +
        ' · kaynak ' + (kd.kaynak || '—') + ' · hata ' + (kd.hata || 'yok') + ' · hassasiyet ' + (kd.hassasiyet ? Math.round(kd.hassasiyet) + ' m' : '—'),
      '',
      'YÖN ALGILAYICI (bu ekranda): olay ' + olay.sayi + ' · mutlak ' + olay.mutlak + ' · tür ' + (olay.tur || '—') +
        (olay.son ? ' · α ' + f(olay.son.alpha) + ' β ' + f(olay.son.beta) + ' γ ' + f(olay.son.gamma) + ' · absolute ' + olay.son.absolute + (olay.son.pusula != null ? ' · iOS pusula ' + f(olay.son.pusula) : '') : ''),
      'API: deviceorientationabsolute ' + ('ondeviceorientationabsolute' in window ? 'var' : 'yok') + ' · izin API ' + (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function' ? 'var' : 'yok'),
      'Gökyüzüne bak: ' + (ar ? 'mod ' + ar.mod + ' · manyetik ' + ar.manyetik + ' · sapma ' + f(ar.sapma, 2) + '° · hizalama ' + f(ar.kal, 2) + '° · görüş ' + f(ar.gorus, 0) + '° · kamera ' + ar.kamera : 'açılmadı'),
      '',
      'SERVİSLER:',
      ...Object.keys(servisler).map(a => '  ' + a + ': ' + servisler[a].durum + ' · ' + servisler[a].zaman.slice(11, 19) + (servisler[a].ayrinti ? ' · ' + servisler[a].ayrinti : '')),
      '  Uydu öğeleri: ' + (gpI ? gpI.ls.map(o => o.OBJECT_NAME + ' ' + String(o.EPOCH).slice(0, 16)).join(', ') + ' · alındı ' + new Date(gpI.alindi).toISOString().slice(0, 16) : '—') +
        ' · Starlink dizisi: ' + (gpD ? (gpD.diziler.map(d => d.kod + ' (' + d.adet + ', ' + d.yukseklik + ' km)').join(', ') || 'yok') : '—'),
      '',
      'DEPO: ' + depo + ' · defter ' + defter + ' kayıt',
      '',
      'SESLİ OKUMA: ' + (window.Ses ? Ses.sesDurumu() + ' · sesler ' + (window.speechSynthesis && speechSynthesis.getVoices ? speechSynthesis.getVoices().filter(v => /^tr/i.test(v.lang)).map(v => v.name + ' (' + v.lang + (v.localService ? ', yerel' : ', uzak') + (v.default ? ', varsayılan' : '') + ')').join('; ') || 'Türkçe ses yok' : '—') : '—'),
      ...(window.Ses && Ses.gunlukMetni() ? Ses.gunlukMetni().split('\n').map(x => '  ' + x) : []),
      '',
      'SON HATALAR (' + hatalar.length + '):',
      ...(hatalar.length ? hatalar.map(h => '  ' + h.zaman.slice(11, 19) + ' ' + h.mesaj) : ['  yok'])
    ];
    return satir.join('\n');
  }

  function pusulaYaz() {
    const p = el.querySelector('#tnPusula');
    if (!olay.son) { p.textContent = 'Henüz yön verisi gelmedi. Telefonu biraz hareket ettir.'; return; }
    const s = olay.son;
    let baslik = s.pusula != null ? s.pusula : (s.alpha != null ? (360 - s.alpha) % 360 : null);
    p.textContent = 'α ' + f(s.alpha) + '°  β ' + f(s.beta) + '°  γ ' + f(s.gamma) + '°' + (baslik != null ? '  ·  telefonun üst kenarının baktığı yön (manyetik) ≈ ' + f(baslik, 0) + '°' : '') + '  ·  ' + (s.absolute || s.pusula != null ? 'kuzeye göre' : 'kuzey bilinmiyor (göreli)');
  }

  async function ilk(kok) {
    el = kok;
    el.innerHTML = `<h1>Tanı</h1>
      <p class="alt-baslik">Bir şey beklediğin gibi çalışmıyorsa bu ekranı aç, "Raporu kopyala"ya bas ve bana yapıştır. Defter notların rapora girmez.</p>
      <h2>Pusula testi</h2>
      <p class="kucuk soluk">Telefonu masaya düz koy ve yavaşça kendi etrafında çevir; üst kenar kuzeye bakarken son sayı 0'a yakın olmalı (manyetik kuzey).</p>
      <p class="tani-pusula" id="tnPusula" aria-live="off"></p>
      <h2>Rapor</h2>
      <div class="cip-grup"><button type="button" class="dugme dolu" id="tnKopyala">Raporu kopyala</button><button type="button" class="dugme" id="tnYenile">Yenile</button></div>
      <p class="kucuk" id="tnDurum" role="status"></p>
      <pre class="tani-rapor" id="tnRapor"></pre>`;
    el.querySelector('#tnYenile').addEventListener('click', yenile);
    el.querySelector('#tnKopyala').addEventListener('click', async () => {
      const metin = await rapor();
      const d = el.querySelector('#tnDurum');
      try { await navigator.clipboard.writeText(metin); d.textContent = 'Kopyalandı. Sohbete yapıştırabilirsin.'; }
      catch (e) {
        /* Pano izni yoksa metni seçili bırak; kullanıcı uzun basıp kopyalar */
        const r = document.createRange(); r.selectNodeContents(el.querySelector('#tnRapor'));
        const sec = getSelection(); sec.removeAllRanges(); sec.addRange(r);
        d.textContent = 'Otomatik kopyalanamadı; rapor seçildi, uzun basıp "Kopyala"yı seç.';
      }
    });
  }
  async function yenile() { if (el) el.querySelector('#tnRapor').textContent = await rapor(); }
  function goster() {
    if ('ondeviceorientationabsolute' in window) window.addEventListener('deviceorientationabsolute', mutlakD);
    window.addEventListener('deviceorientation', goreliD);
    yenile();
    clearInterval(canli);
    canli = setInterval(() => { if (!el || el.hidden) { durdur(); return; } pusulaYaz(); }, 250);
  }
  function durdur() {
    clearInterval(canli); canli = null;
    window.removeEventListener('deviceorientationabsolute', mutlakD);
    window.removeEventListener('deviceorientation', goreliD);
  }

  window.Tani = { servis, hataEkle, rapor, _modul: { ilk, goster } };
})();
