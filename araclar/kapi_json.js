'use strict';
/* Yayın kapısı (a): veri/ altındaki bütün .json dosyaları JSON olarak açılabiliyor mu. Hatalı dosyanın yalnız adı ve
   ayrıştırıcı iletisi yazılır (içerik basılmaz). Kullanım: node araclar/kapi_json.js */
const fs = require('fs');
const path = require('path');
const kok = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'veri');   // test için başka klasör verilebilir
const dosyalar = [];
(function gez(d) { for (const a of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, a.name); if (a.isDirectory()) gez(p); else if (a.name.endsWith('.json')) dosyalar.push(p); } })(kok);
const hatalar = [];
for (const f of dosyalar) {
  try { JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { hatalar.push(path.relative(path.join(kok, '..'), f) + ': ' + String(e.message).slice(0, 200)); }
}
console.log(`veri/: ${dosyalar.length} JSON dosyası, ${hatalar.length} hatalı`);
hatalar.forEach(h => console.log('HATA ' + h));
process.exit(hatalar.length ? 1 : 0);
