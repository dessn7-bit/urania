/* ses.js — Dersleri sesli okuma (Web Speech API, speechSynthesis). Ses cihazın kendi
   metin okuma motorundan gelir; internet gerekmez (motor çevrimdışı Türkçe sesi destekliyorsa).
   Uzun metin cümlelere bölünür: bazı tarayıcılar uzun tek parçayı yarıda kesiyor.
   Duraklatma "iptal + kaldığı cümleden yeniden başlat" ile yapılır; Android'de pause() güvenilir değil. */
(function () {
  'use strict';
  const U = window.Urania;
  const destek = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
  let parcalar = [], sira = 0, calisiyor = false, nesil = 0, dinleyici = null;
  /* Okunan cümle modül düzeyinde tutulur: Chrome'da yalnız yerel değişkende kalan
     SpeechSynthesisUtterance, onend gelmeden çöpe atılabiliyor ve okuma takılıyor. */
  let simdiki = null;

  function turkceSes() {
    if (!destek) return null;
    const ls = speechSynthesis.getVoices();
    return ls.find(v => /^tr(-|_|$)/i.test(v.lang) && v.localService) || ls.find(v => /^tr(-|_|$)/i.test(v.lang)) || null;
  }
  /* Sesler bazı tarayıcılarda geç yüklenir */
  function sesleriBekle() {
    return new Promise(coz => {
      if (!destek) return coz([]);
      const ls = speechSynthesis.getVoices();
      if (ls.length) return coz(ls);
      const bitti = () => { speechSynthesis.removeEventListener('voiceschanged', bitti); coz(speechSynthesis.getVoices()); };
      speechSynthesis.addEventListener('voiceschanged', bitti);
      setTimeout(bitti, 1500);
    });
  }

  function cumlelere(metin) {
    /* nokta, soru, ünlem, üç nokta + boşluk + büyük harf ya da rakam: cümle sonu */
    return String(metin).split(/(?<=[.!?…])\s+(?=[A-ZÇĞİÖŞÜ0-9"“‘(])/).map(s => s.trim()).filter(Boolean);
  }

  /* bloklar: [{metin, el}] — el okunurken vurgulanır */
  function hazirla(bloklar) {
    dur();
    parcalar = [];
    bloklar.forEach((b, i) => cumlelere(b.metin).forEach(c => parcalar.push({ metin: c, blok: i, el: b.el })));
    sira = 0;
  }

  function hiz() { return U.oku('sesHiz', 1); }
  function hizAyarla(h) { U.yaz('sesHiz', h); if (calisiyor) { const s = sira; durdur(); sira = s; baslat(); } }

  function bildir() { if (dinleyici) dinleyici({ calisiyor, sira, toplam: parcalar.length, blok: parcalar[sira] && parcalar[sira].blok }); }
  function vurgula() {
    parcalar.forEach(p => p.el && p.el.classList.remove('okunuyor'));
    const p = parcalar[sira];
    if (calisiyor && p && p.el) {
      p.el.classList.add('okunuyor');
      const r = p.el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > innerHeight - 90) p.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function soyle(n) {
    if (n !== nesil || !calisiyor) return;
    if (sira >= parcalar.length) { calisiyor = false; sira = 0; vurgula(); bildir(); return; }
    const u = new SpeechSynthesisUtterance(parcalar[sira].metin);
    simdiki = u;
    u.lang = 'tr-TR';
    const v = turkceSes(); if (v) u.voice = v;
    u.rate = hiz();
    u.onend = () => { if (n !== nesil) return; sira++; vurgula(); bildir(); soyle(n); };
    u.onerror = e => {
      if (n !== nesil) return;
      /* Kendi iptalimizde nesil zaten artmıştır; buraya gelen kesinti dışarıdan (başka bir uygulama sesi aldı) */
      if (e.error !== 'interrupted' && e.error !== 'canceled' && window.Tani) Tani.hataEkle('ses: ' + e.error);
      calisiyor = false; vurgula(); bildir();
    };
    try { speechSynthesis.speak(u); } catch (h) {
      if (window.Tani) Tani.hataEkle('ses: ' + h.message);
      calisiyor = false; vurgula(); bildir();
    }
  }
  function baslat() {
    if (!destek || !parcalar.length) return;
    speechSynthesis.cancel();
    calisiyor = true; nesil++;
    vurgula(); bildir();
    soyle(nesil);
  }
  function durdur() {
    nesil++; calisiyor = false; simdiki = null;
    if (destek) speechSynthesis.cancel();
    vurgula(); bildir();
  }
  function dur() { durdur(); sira = 0; vurgula(); }
  function blogaGit(i) {
    const k = parcalar.findIndex(p => p.blok === i);
    if (k < 0) return;
    const c = calisiyor; durdur(); sira = k; if (c) baslat(); else bildir();
  }

  /* Sayfadan ayrılınca sus */
  window.addEventListener('hashchange', () => { if (calisiyor || sira) dur(); });

  window.Ses = { destek, turkceSes, sesleriBekle, hazirla, baslat, durdur, dur, blogaGit, hiz, hizAyarla, cumlelere,
    dinle: f => { dinleyici = f; }, durum: () => ({ calisiyor, sira, toplam: parcalar.length }) };
})();
