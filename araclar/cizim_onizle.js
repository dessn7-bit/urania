/* Çizim önizleme: node araclar/cizim_onizle.js [dNN ...] [--cikti klasör]
   Her çizimi 390 px telefon genişliğinde normal ve kırmızı modda PNG'ye çizer, hata ve yazı taşmalarını raporlar.
   Sunucuyu kendisi başlatır (testler/sunucu.js, port 8131; zaten çalışıyorsa onu kullanır).
   Varsayılan çıktı: <geçici klasör>/urania-cizim-onizleme (test-results değil: Playwright her koşuda onu siler). */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');
const ADRES = 'http://127.0.0.1:8131/index.html';
const hazirMi = () => new Promise(r => {
  const q = http.get(ADRES, y => { y.resume(); r(y.statusCode === 200); });
  q.on('error', () => r(false)); q.setTimeout(1000, () => { q.destroy(); r(false); });
});
(async () => {
  const arg = process.argv.slice(2);
  const ci = arg.indexOf('--cikti');
  const cikti = ci >= 0 ? arg[ci + 1] : path.join(os.tmpdir(), 'urania-cizim-onizleme');
  const dersler = arg.filter((a, i) => /^d\d+$/.test(a) && (ci < 0 || i !== ci + 1));
  fs.mkdirSync(cikti, { recursive: true });
  const kok = path.join(__dirname, '..');
  let s = null, spawnHata = null, cikis = null;
  if (!(await hazirMi())) {
    s = spawn(process.execPath, ['testler/sunucu.js'], { cwd: kok, stdio: ['ignore', 'ignore', 'inherit'] });
    s.on('error', e => { spawnHata = e; });
    s.on('exit', k => { cikis = k; });
    /* Sabit bekleme yerine sunucu yanıt verene kadar dene (en çok 15 s) */
    const son = Date.now() + 15000;
    while (!(await hazirMi())) {
      if (spawnHata || cikis !== null || Date.now() > son) {
        console.error('Sunucu başlatılamadı:', spawnHata ? spawnHata.message : cikis !== null ? 'süreç ' + cikis + ' koduyla çıktı' : '15 s içinde yanıt yok');
        if (s && cikis === null) s.kill();
        process.exit(2);
      }
      await new Promise(r => setTimeout(r, 100));
    }
  }
  const b = await chromium.launch();
  let sorun = 0;
  try {
    for (const kirmizi of [false, true]) {
      const p = await b.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2 });
      const hatalar = []; p.on('pageerror', e => hatalar.push(String(e))); p.on('console', m => { if (m.type() === 'error') hatalar.push(m.text()); });
      await p.addInitScript(k => { localStorage.setItem('urania_kirmizi', k ? 'true' : 'false'); }, kirmizi);
      await p.goto(ADRES + '#ders');
      await p.waitForSelector('.ders-liste li');
      const ids = await p.evaluate(d => Object.values(window.UraniaCizim.kayit).filter(t => !d.length || d.includes(t.ders)).map(t => t.id), dersler);
      const dersSet = [...new Set(await p.evaluate(ids => ids.map(i => window.UraniaCizim.kayit[i].ders), ids))];
      for (const d of dersSet) {
        await p.goto(ADRES + '#ders/' + d);
        await p.waitForSelector('article.ders h1');
        const figs = await p.locator('figure.cizim').all();
        for (const f of figs) {
          const id = (await f.getAttribute('id')).slice(3);
          await f.scrollIntoViewIfNeeded();
          await p.evaluate(() => { const h = document.querySelector('header'); if (h) h.style.visibility = 'hidden'; });
          await f.screenshot({ path: path.join(cikti, id + (kirmizi ? '-kirmizi' : '') + '.png') });
          /* SVG dışına taşan yazılar */
          const tasan = await f.evaluate(fig => {
            /* Ekrandaki gerçek kutu (döndürülmüş yazılar dahil) SVG kutusuyla karşılaştırılır */
            const svg = fig.querySelector('svg'), sr = svg.getBoundingClientRect(), ls = [];
            svg.querySelectorAll('text').forEach(t => { const r = t.getBoundingClientRect(); if (r.left < sr.left - 1 || r.top < sr.top - 1 || r.right > sr.right + 1 || r.bottom > sr.bottom + 1) ls.push(t.textContent); });
            return ls;
          });
          if (tasan.length) { sorun++; console.log('TAŞMA', id, JSON.stringify(tasan)); }
          if (!kirmizi) console.log('ok', id);
        }
      }
      /* kayıtlı ama derste görünmeyen çizimler (bölüm numarası yanlış) */
      const eksik = await p.evaluate(async ids => {
        const D = await fetch('veri/dersler.json').then(r => r.json());
        return ids.filter(i => { const t = window.UraniaCizim.kayit[i], d = t && D.dersler.find(x => x.id === t.ders); return !d || !d.bolumler[t.bolum]; });
      }, ids);
      if (eksik.length) { sorun++; console.log('BÖLÜMSÜZ', eksik.join(', ')); }
      if (hatalar.length) { sorun++; console.log('HATA', hatalar.join(' | ')); }
      await p.close();
    }
  } finally { await b.close(); if (s) s.kill(); }
  console.log(sorun ? `${sorun} sorun` : 'sorun yok', '· çıktı:', cikti);
  process.exit(sorun ? 1 : 0);
})();
