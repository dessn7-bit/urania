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
