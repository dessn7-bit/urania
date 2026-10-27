'use strict';
/* Testler için en küçük statik sunucu (bağımlılıksız). */
const http = require('http'), fs = require('fs'), path = require('path');
const KOK = path.join(__dirname, '..');
const TUR = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const dosya = path.join(KOK, p);
  if (!dosya.startsWith(KOK)) { res.writeHead(403); return res.end(); }
  fs.readFile(dosya, (h, veri) => {
    if (h) { res.writeHead(404); return res.end('yok'); }
    res.writeHead(200, { 'Content-Type': TUR[path.extname(dosya)] || 'application/octet-stream' });
    res.end(veri);
  });
}).listen(Number(process.env.PORT) || 8131, '127.0.0.1');
