'use strict';
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './testler',
  testMatch: /.*\.spec\.js/,
  timeout: 30000,
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
  webServer: {
    command: 'node testler/sunucu.js',
    url: 'http://127.0.0.1:8131/index.html',
    reuseExistingServer: true,
    timeout: 30000
  }
});
