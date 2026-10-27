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
    timezoneId: 'Europe/Istanbul'
  },
  webServer: {
    command: 'node testler/sunucu.js',
    url: 'http://127.0.0.1:8131/index.html',
    reuseExistingServer: true,
    timeout: 30000
  }
});
