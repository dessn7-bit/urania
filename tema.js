/* Kırmızı mod ilk boyamadan önce: <head>'de, stil dosyasından hemen sonra, eşzamanlı yüklenir.
   Yoksa betikler gelene kadar kabuk lacivert/parşömen çizilir ve karanlığa alışmış göz bir an beyazımsı ışık görür.
   Asıl ayar uygulama.js kirmiziUygula'da; burası yalnız sınıfı ve tarayıcı çubuğu rengini erkenden basar. */
(function () {
  try {
    if (JSON.parse(localStorage.getItem('urania_kirmizi')) === true) {
      document.documentElement.classList.add('kirmizi');
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', '#000000');
    }
  } catch (e) { /* depo kapalı: normal tema */ }
})();
