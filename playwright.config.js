'use strict';
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './testler',
  testMatch: /.*\.spec\.js/,
  timeout: 30000,
  /* Actions'ta (yayın kapısı) zamanlamaya bağlı tek seferlik takılmalar yayını durdurmasın: bir kez yeniden denenir;
     yeniden denemede geçen test raporda "flaky" diye görünür. Yerelde yeniden deneme yok. */
  retries: process.env.CI ? 1 : 0,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8131',
    serviceWorkers: 'block',
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    /* Testler ağa çıkmaz (v44): page.route ile sahte yanıt verilmeyen her dış istek kapalı bir yerel kapıya (vekil) gider ve
       hemen düşer. Yerel test sunucusu (127.0.0.1) vekilden geçmez. Dış servislerin gerçek yanıtları testler/veri/ altında. */
    proxy: { server: 'http://127.0.0.1:9', bypass: '127.0.0.1,localhost' },
    /* Windows'ta Chromium yazıları ClearType (LCD) yumuşatmasıyla çizer: kırmızı yazının kenarına mavi/yeşil piksel ekler,
       kırmızı mod piksel testleri bunu sızıntı sayar. Yalnız Windows'ta kapatılır; Linux/macOS'ta bayrak eklenmez, davranış aynı kalır. */
    ...(process.platform === 'win32' ? { launchOptions: { args: ['--disable-lcd-text'] } } : {})
  },
  /* v49: iki proje. "genel": service worker kapalı (testler ağı page.route ile taklit eder). "cevrimdisi": service worker
     serbest; yalnız testler/cevrimdisi.spec.js (önbellek, çevrimdışı açılış, sürüm değişince eski önbelleğin silinmesi). */
  projects: [
    { name: 'genel', testIgnore: /cevrimdisi\.spec\.js/ },
    { name: 'cevrimdisi', testMatch: /cevrimdisi\.spec\.js/, use: { serviceWorkers: 'allow' } }
  ],
  webServer: {
    command: 'node testler/sunucu.js',
    url: 'http://127.0.0.1:8131/index.html',
    reuseExistingServer: true,
    timeout: 30000
  }
});
