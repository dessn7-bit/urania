'use strict';
/* v49 kalite kapısı ve haftalık denetim: betiklerin mantığı (ağsız) ve iş akışlarının YONTEM.md ile tutarlılığı.
   Ağa çıkan kısımlar (lychee, MediaWiki, arXiv, Horizons, npm) yalnız Actions'ta çalışır; burada kayıtlı yanıtlarla sınanır. */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { kok } = require('./yardim');

let PY = null;
function python() {
  if (PY) return PY;
  for (const [k, a] of [['python', []], ['py', ['-3']], ['python3', []]]) {
    const r = spawnSync(k, [...a, '--version'], { encoding: 'utf8' });
    if (r.status === 0 && /Python 3/.test(r.stdout + r.stderr)) return (PY = [k, a]);
  }
  throw new Error('Python 3 bulunamadı');
}
const pyc = kod => { const [k, a] = python(); const r = spawnSync(k, [...a, '-c', 'import sys, json; sys.path.insert(0, "araclar"); import denetim as D\n' + kod], { cwd: kok, encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } }); if (r.status) throw new Error(r.stderr); return JSON.parse(r.stdout); };
const oku = f => fs.readFileSync(path.join(kok, f), 'utf8');

test('Bağlantı sınıfları: 404/410/DNS kırık; 403, 429, zaman aşımı ve öteki hatalar "doğrulanamadı" — asla "çalışıyor" değil', () => {
  const r = pyc(`s, toplam = D.lychee_oku('testler/veri/denetim/lychee.json'); print(json.dumps({'s': s, 't': toplam}))`);
  expect(r.t).toBe(6);
  expect(r.s['https://ornek-kirik.example.net/sayfa'][0]).toBe('kirik');
  expect(r.s['https://www.britannica.com/science/star-astronomy'][0]).toBe('dogrulanamadi');
  expect(r.s['https://hiz-siniri.example.net/'][0]).toBe('dogrulanamadi');
  expect(r.s['https://yok-boyle-alan.invalid/'][0]).toBe('kirik');
  expect(r.s['https://yavas.example.net/'][0]).toBe('dogrulanamadi');
  const t = pyc(`print(json.dumps([D.lychee_sinif({'status': {'code': c, 'text': ''}})[0] for c in (403, 429, 401, 405, 500, 503, 410, 404)]))`);
  expect(t).toEqual(['dogrulanamadi', 'dogrulanamadi', 'dogrulanamadi', 'dogrulanamadi', 'dogrulanamadi', 'dogrulanamadi', 'kirik', 'kirik']);
});

test('Bağlantı gruplama: en.wikipedia → MediaWiki API, arXiv → API; celestrak ve öteki Wikipedia dilleri atlanır', () => {
  const g = pyc(`print(json.dumps(D.grupla(['https://en.wikipedia.org/wiki/Sagittarius_A*', 'https://tr.wikipedia.org/wiki/Ay', 'https://arxiv.org/abs/2508.01648v2', 'https://arxiv.org/pdf/astro-ph/0603449', 'https://celestrak.org/NORAD/', 'https://www.eso.org/public/'])))`);
  expect(g.wiki).toEqual({ 'https://en.wikipedia.org/wiki/Sagittarius_A*': 'Sagittarius A*' });
  expect(Object.values(g.arxiv)).toEqual(['2508.01648', 'astro-ph/0603449']);
  expect(g.genel).toEqual(['https://www.eso.org/public/']);
  expect(g.atlandi.map(x => x.url)).toEqual(['https://tr.wikipedia.org/wiki/Ay', 'https://celestrak.org/NORAD/']);
  /* gerçek veri: celestrak hiçbir zaman lychee girdisine girmez */
  const ls = pyc(`g = D.grupla(D.urller()); print(json.dumps({'genel': g['genel'], 'wiki': len(g['wiki']), 'arxiv': len(g['arxiv'])}))`);
  expect(ls.genel.some(u => /celestrak/i.test(u))).toBe(false);
  expect(ls.genel.some(u => /en\.wikipedia\.org\/wiki\//.test(u))).toBe(false);
  expect(ls.wiki).toBeGreaterThan(100);
});

test('Taban listesi: 2026-10-30 denetiminin 156 "erişilemedi" URL\'si askıda; tabandaki kırık yeni sayılmaz', () => {
  const T = JSON.parse(oku('arastirma/denetim/baglanti_taban.json'));
  const say = s => T.urller.filter(x => x.sinif === s).length;
  expect(say('erisilemedi')).toBe(156);
  expect(T.urller.every(x => /^https?:\/\//.test(x.url) && x.not)).toBe(true);
});

test('Alıntı normalleştirme: sayfa tasarımı (etiket, boşluk, noktalama, aksan) değişince yanlış alarm yok', () => {
  const r = pyc(`print(json.dumps([D.normal('Mass (10<sup>24</sup> kg) 0.33010') == D.normal('Mass (10^24 kg)  0.33010'), D.normal('<td>Volumetric mean radius (km)</td><td>2439.7</td>') == D.normal('Volumetric mean radius (km) 2439.7'), D.normal('Café “quoted”') == D.normal('Cafe "quoted"'), D.normal('0.33010') == D.normal('0.33011')]))`);
  expect(r).toEqual([true, true, true, false]);
  const k = pyc(`k = D.alinti_kayitlari(); print(json.dumps({'n': len(k), 'url': len({u for _, u, _ in k}), 'celestrak': sum(1 for _, u, _ in k if 'celestrak' in u)}))`);
  expect(k.n).toBeGreaterThan(300);
  expect(k.url).toBeGreaterThan(100);
});

test('Gök denetimi: kayıtlı Horizons yanıtıyla geçiş zamanı ≤ 60 sn; bilinen (tabandaki) konum farkı kayıt açmaz, büyüyen fark açar', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'gok-'));
  let r = spawnSync('node', ['araclar/denetim_gok.js', 'testler/veri/denetim/horizons.json', d], { cwd: kok, encoding: 'utf8' });
  expect(r.status).toBe(0);
  let s = JSON.parse(fs.readFileSync(path.join(d, 'gok_sonuc.json'), 'utf8'));
  expect(s.zaman.length).toBe(9);
  expect(s.en_buyuk_zaman_sn).toBeLessThanOrEqual(60);
  expect(s.yeni).toEqual([]);
  expect(fs.readFileSync(path.join(d, 'gok_sayi.txt'), 'utf8')).toBe('0');
  /* Mars'ın konumunu 30″ bozunca yeni fark çıkar */
  const H = JSON.parse(oku('testler/veri/denetim/horizons.json'));
  H.konum.Mars[0].dec += 30 / 3600;
  fs.writeFileSync(path.join(d, 'h.json'), JSON.stringify(H));
  r = spawnSync('node', ['araclar/denetim_gok.js', path.join(d, 'h.json'), d], { cwd: kok, encoding: 'utf8' });
  s = JSON.parse(fs.readFileSync(path.join(d, 'gok_sonuc.json'), 'utf8'));
  expect(s.yeni.map(x => x.cisim)).toEqual(['Mars']);
  expect(fs.readFileSync(path.join(d, 'gok_sayi.txt'), 'utf8')).toBe('1');
});

test('Yayın kapısı (a): bozuk JSON kapıyı düşürür, sağlam veri geçer', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'kapi-'));
  fs.writeFileSync(path.join(d, 'iyi.json'), '{"a": 1}');
  expect(spawnSync('node', ['araclar/kapi_json.js', d], { cwd: kok }).status).toBe(0);
  fs.writeFileSync(path.join(d, 'bozuk.json'), '{"a": 1,}');
  const r = spawnSync('node', ['araclar/kapi_json.js', d], { cwd: kok, encoding: 'utf8' });
  expect(r.status).toBe(1);
  expect(r.stdout).toMatch(/HATA \S*bozuk\.json: /);
  expect(spawnSync('node', ['araclar/kapi_json.js'], { cwd: kok }).status).toBe(0);   // depodaki veri
});

test('İş akışları: kapı sırası, izinler, yalnız main; denetim zamanı haber işinden önce; celestrak ve kişisel veri yok; YONTEM.md ile tutarlı', () => {
  const y = oku('.github/workflows/yayin.yml'), d = oku('.github/workflows/denetim.yml');
  const sira = ['araclar/kapi_json.js', 'npx eslint .', 'npx html-validate index.html', 'npx playwright test'].map(k => y.indexOf(k));
  sira.forEach(i => expect(i).toBeGreaterThan(0));
  expect([...sira].sort((a, b) => a - b)).toEqual(sira);
  expect(y).toMatch(/branches: \[main\]/);
  expect(y).toMatch(/permissions:\n {2}contents: write\n {2}issues: write\n/);
  expect(y).toMatch(/if: success\(\) && github\.ref == 'refs\/heads\/main'\n\s+run: git push --force origin "\$\{GITHUB_SHA\}:refs\/heads\/gh-pages"/);
  expect(y).toMatch(/if: failure\(\)[\s\S]*kapi_issue\.sh ac/);
  expect(d).toMatch(/cron: '0 4 \* \* 6'/);        // cumartesi 04.00 UTC = 07.00 TSİ < 09.35 TSİ haber işi
  expect(d).toMatch(/workflow_dispatch/);
  expect(d).toMatch(/permissions:\n {2}contents: read\n {2}issues: write\n/);
  for (const t of [y, d, oku('araclar/denetim.py'), oku('araclar/denetim_issue.sh'), oku('araclar/kapi_issue.sh')]) {
    expect(t).not.toMatch(/@gmail|dessn7@|mailto/);
    expect(t.replace(/celestrak\\?\.org.*(kural|exclude|YASAK|istek yok).*/gi, '')).not.toMatch(/https?:\/\/[^ ]*celestrak/i);
  }
  expect(d).toContain("--exclude 'celestrak\\.org'");
  expect(oku('araclar/denetim.py')).toContain("UA = 'urania-linkcheck/1.0 (+https://github.com/dessn7-bit/urania)'");
  const Y = oku('arastirma/haberler/YONTEM.md');
  expect(Y).not.toMatch(/git push origin main:gh-pages/);
  expect(Y).toContain('Push ONLY main');
  for (const b of ['Denetim: yeni kırık bağlantı', 'Denetim: değişen kaynak', 'Denetim: Horizons farkı', 'Denetim: adım çalışmadı', '"yayın durdu"']) expect(Y, b).toContain(b);
  for (const b of ['Denetim: yeni kırık bağlantı', 'Denetim: değişen kaynak', 'Denetim: Horizons farkı', 'Denetim: adım çalışmadı', 'Denetim (bilgi)']) expect(oku('araclar/denetim_issue.sh'), b).toContain(b);
  expect(oku('araclar/kapi_issue.sh')).toContain('ETIKET="yayın durdu"');
});
