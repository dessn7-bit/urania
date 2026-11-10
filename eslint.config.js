'use strict';
/* ESLint düz yapılandırma (v49 kalite kapısı). Uygulama betikleri tarayıcıda <script> ile yüklenir (sourceType "script");
   dosyalar arası paylaşılan adlar aşağıdaki URANIA_GLOBAL listesinde. Kurallar görev metnindeki dört kural. */
const globals = require('globals');

/* Dosyalar arası globaller: bir betiğin window'a koyup ötekilerin doğrudan kullandığı adlar */
const URANIA_GLOBAL = Object.fromEntries([
  // lib/ (üçüncü taraf): Astronomy Engine, satellite.js, geomagnetism
  'Astronomy', 'satellite', 'Geomag',
  // uygulama modülleri (window.X / kok.X ile tanımlanır)
  'Urania', 'Gok', 'Gorunurluk', 'Ses', 'Tani', 'Uydu', 'Hava', 'HavaKart', 'Defter', 'Degisen', 'Gorevler', 'Kartlar', 'Sozluk',
  'Harita', 'Bulucu', 'Plan', 'Ortme', 'Okunus', 'Apophis', 'AyRehber', 'UraniaAR', 'UraniaCizim', 'UraniaDeney', 'UraniaDeneyEk',
  'UraniaDeneyHesap', 'UraniaGozlem'
].map(a => [a, 'readonly']));

// no-unused-vars: yakalanan hatalar (catch (h) {...}) ve bilinçli boş bırakılan geri çağırma argümanları (e, h, _) sayılmaz;
// kodda bunlar "hata önemsiz" demek için kullanılıyor (ilk koşu 2026-11-10: 111 bulgunun 93'ü bu türdendi).
const KURALLAR = {
  'no-undef': 'error',
  'no-unused-vars': ['error', { caughtErrors: 'none', argsIgnorePattern: '^(e|h|_.*)$' }],
  'no-dupe-keys': 'error',
  'no-unreachable': 'error'
};

module.exports = [
  { ignores: ['node_modules/**', 'lib/**', 'test-results/**', 'playwright-report/**', '.claude/**'] },
  {
    files: ['*.js', 'deney/**/*.js'],
    ignores: ['eslint.config.js', 'playwright.config.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'script', globals: { ...globals.browser, ...globals.serviceworker, module: 'readonly', require: 'readonly', ...URANIA_GLOBAL } },
    rules: KURALLAR
  },
  {
    files: ['testler/**/*.js', 'araclar/**/*.js', 'eslint.config.js', 'playwright.config.js'],
    /* testlerde page.evaluate geri çağırmaları tarayıcıda çalışır: tarayıcı ve uygulama globalleri de tanınır */
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser, ...URANIA_GLOBAL } },
    rules: KURALLAR
  }
];
