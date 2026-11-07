'use strict';
/* Derleme araçları (denetim 2026-10-30, alan 7): ders_verisi_v2.py ve bolum_esle.py.
   - A7-01 / A3-02 / A3-03: okura giden ve sesli okunan metinde dosya kimliği ("d20", "d12'ye", "(d11, d12)") kalmaz;
     "N. ders" ve "N. ve M. dersler" zincirlerinin HER sayısı uygulamadaki sıraya çevrilir; Türkçe hâl ekleri doğru.
   - A7-02 / A7-11: bolum_esle.py iki kez üst üste çalışınca ikincisi hiçbir şeyi kaydırmaz; MINI girişi sessizce silinmez.
   - Bugünkü veri doğru eşlenmiş: her çizimin ve her sınav sorusunun bölümü beklenen başlıkla aynı (testler/veri/bolum_esleme_beklenen.json).
   Python gerektiren testler araçları geçici bir kopyada çalıştırır; depodaki dosyalara yazmaz.
   Beklenen listeyi yeniden üretmek (yalnız bilerek, bütün eşlemeleri gözden geçirdikten sonra):
     URANIA_ANLIK_YAZ=1 npx playwright test testler/derleme.spec.js -g "beklenen" */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { kok } = require('./yardim');
const { okunus } = require('../okunus.js');

const oku = p => JSON.parse(fs.readFileSync(path.join(kok, p), 'utf8'));
const KIMLIK_ALAN = new Set(['id', 'kid', 'url', 'kaynak_url', 'on_bilgi', 'unite', 'ders']);
/* ders_verisi_v2.py KALINTI ile aynı: "#ders/d12", "cz-d41-…", "d3-celestial" dosya kimliği değil */
const KALINTI = /(?<![\w/.#-])d\d{1,2}(?![\d\w-])/g;

function metinler(x, yol, cikti) {
  if (typeof x === 'string') cikti.push([yol, x]);
  else if (Array.isArray(x)) x.forEach((v, i) => metinler(v, `${yol}[${i}]`, cikti));
  else if (x && typeof x === 'object') Object.entries(x).forEach(([k, v]) => { if (!KIMLIK_ALAN.has(k)) metinler(v, yol ? `${yol}.${k}` : k, cikti); });
  return cikti;
}
function gorunenMetinler() {
  const D = oku('veri/dersler.json'), S = oku('veri/sinavlar.json'), m = [];
  D.uniteler.forEach(u => { m.push([`unite ${u.id}.ad`, u.ad], [`unite ${u.id}.aciklama`, u.aciklama]); });
  D.dersler.forEach(d => metinler(d, d.id, m));
  Object.entries(S.uniteler).forEach(([u, ls]) => ls.forEach(q => metinler(q, `sinav ${u}/${q.id}`, m)));
  return m;
}

test('Okura giden ve sesli okunan metinde dosya kimliği (dNN) kalmaz: dersler, sınavlar, üniteler ve okunuş çıktısı', () => {
  const m = gorunenMetinler();
  expect(m.length).toBeGreaterThan(10000);
  const kalan = [];
  for (const [yol, s] of m) {
    for (const x of s.match(KALINTI) || []) kalan.push(`${yol}: ${x} …${s.slice(Math.max(0, s.indexOf(x) - 30), s.indexOf(x) + 30)}…`);
    for (const x of okunus(s).match(KALINTI) || []) kalan.push(`${yol} (okunuş): ${x}`);
  }
  expect(kalan).toEqual([]);
});

test('"N. ders" ve dosya kimliği atıfları uygulamadaki sıraya çevrilmiş (örnek cümleler)', () => {
  const D = oku('veri/dersler.json').dersler, no = id => D.findIndex(d => d.id === id) + 1;
  const tum = id => JSON.stringify(D.find(d => d.id === id));
  /* kaynak: d21 "…tanrı Sah'ı gördü (d20)" ve d9 "(4. ve 11. dersler)" (A3-02: ikili atıfta İLK sayı da çevrilir) */
  expect(tum('d21')).toContain(`gördü (${no('d20')}. ders)`);
  expect(tum('d9')).toContain(`(${no('d4')}. ve ${no('d11')}. dersler)`);
  /* hiçbir "N. ders" sayısı ders sayısını aşmaz; zincirdeki ilk sayılar da */
  D.forEach(d => (JSON.stringify(d).match(/(?<![\d%,.])(?:\d{1,2}\.,? (?:ve |ile |ya da |veya )?)*\d{1,2}\. ders/g) || []).forEach(z =>
    (z.match(/\d{1,2}(?=\.)/g) || []).forEach(n => expect(+n >= 1 && +n <= D.length, d.id + ' ' + z).toBe(true))));
});

test('Ünite adları ve açıklamaları terim kurallarına uyar (atarca, anakol, fantom enerji, Deniz Kulağı, şişme)', () => {
  const U = oku('veri/dersler.json').uniteler;
  expect(U.length).toBeGreaterThan(5);
  const YASAK = [[/pulsar/i, 'atarca (TÜBA)'], [/ana dizi/i, 'anakol'], [/hayalet enerji/i, 'fantom enerji'], [/Lagün/i, 'Deniz Kulağı Bulutsusu'],
    [/(?<!\()enflasyon(?!\))/i, 'şişme (enflasyon): derslerin terimi şişme'], [/X-ışın/i, 'X ışını'], [/kızıl dev/i, 'kırmızı dev']];
  for (const u of U) for (const [d, ad] of YASAK) {
    expect(u.ad, u.id + ' adı: ' + ad).not.toMatch(d);
    expect(u.aciklama, u.id + ' açıklaması: ' + ad).not.toMatch(d);
  }
});

/* ---------- Python araçları (geçici kopyada) ---------- */
let PY = null;
function python() {
  if (PY) return PY;
  for (const [k, a] of [['python', []], ['py', ['-3']], ['python3', []]]) {
    const r = spawnSync(k, [...a, '--version'], { encoding: 'utf8' });
    if (r.status === 0 && /Python 3/.test(r.stdout + r.stderr)) return (PY = [k, a]);
  }
  throw new Error('Python 3 bulunamadı (python / py -3 / python3)');
}
function py(args, cwd, girdi) {
  const [k, a] = python();
  return spawnSync(k, [...a, ...args], { cwd, input: girdi, encoding: 'utf8', timeout: 120000, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
}

test('ders_verisi_v2.numarala: bütün ekler ve zincirler doğru Türkçe çekimle; kimlik alanları ve bağlantılar çevrilmez', () => {
  const kod = [
    'import json, sys',
    "sys.path.insert(0, 'araclar')",
    'import ders_verisi_v2 as d',
    "d.SIRA = {'d1': 1, 'd2': 2, 'd3': 7, 'd4': 24, 'd11': 3, 'd12': 5, 'd20': 40, 'd30': 43, 'd9': 9, 'd23': 23}",
    'print(json.dumps([d.numarala(x) for x in json.loads(sys.stdin.read())], ensure_ascii=False))'
  ].join('\n');
  const ornek = [
    ['Sah\'ı gördü (d20).', 'Sah\'ı gördü (40. ders).'],
    ['d12\'ye göre', '5. derse göre'], ['d1\'e göre', '1. derse göre'], ['d9\'a göre', '9. derse göre'], ['d20\'ya', '40. derse'],
    ['d3\'ü birleştirir', '7. dersi birleştirir'], ['d30\'u okumuş olman', '43. dersi okumuş olman'],
    ['d2\'de', '2. derste'], ['d3\'teki', '7. dersteki'], ['d30\'dakilerle', '43. derstekilerle'], ['d4\'ten', '24. dersten'],
    ['d4\'ün konusu', '24. dersin konusu'], ['d12\'nin', '5. dersin'], ['d2\'yle', '2. dersle'],
    ['d42 anlatıyor', 'd42 anlatıyor'],   // SIRA'da olmayan ders çevrilmez (derleme bunu HATA sayar)
    ['d2 ve d3\'ü birleştirir', '2. ve 7. dersleri birleştirir'], ['d9 ve d23\'te gördüğün', '9. ve 23. derslerde gördüğün'],
    ['(d11, d12)', '(3. ve 5. dersler)'], ['(d1, d2, d3)', '(1., 2. ve 7. dersler)'], ['d1 ve d11\'deki kural', '1. ve 3. derslerdeki kural'],
    ['(4. ve 11. dersler)', '(24. ve 3. dersler)'], ['1., 2. ve 3. derslerde', '1., 2. ve 7. derslerde'], ['9. derste', '9. derste'], ['20. dersin', '40. dersin'],
    ['#ders/d12 cz-d12-x d3-celestial', '#ders/d12 cz-d12-x d3-celestial'],
    [{ id: 'd1', kid: 'd1s0', on_bilgi: ['d2'], url: 'https://x/d2', kaynak_url: 'https://y/d3', metin: 'd2' }, { id: 'd1', kid: 'd1s0', on_bilgi: ['d2'], url: 'https://x/d2', kaynak_url: 'https://y/d3', metin: '2. ders' }]
  ];
  const r = py(['-c', kod], kok, JSON.stringify(ornek.map(x => x[0])));
  expect(r.status, r.stderr).toBe(0);
  expect(JSON.parse(r.stdout)).toEqual(ornek.map(x => x[1]));
});

/* bolum_esle.py'nin dokunduğu dosyaları geçici bir klasöre kopyalar */
function kopyaKur() {
  const t = fs.mkdtempSync(path.join(os.tmpdir(), 'urania-bolum-esle-'));
  const kopyala = p => { fs.mkdirSync(path.dirname(path.join(t, p)), { recursive: true }); fs.copyFileSync(path.join(kok, p), path.join(t, p)); };
  ['araclar/bolum_esle.py', 'veri/dersler.json', 'veri/sinavlar.json', 'dersler.js'].forEach(kopyala);
  fs.readdirSync(kok).filter(f => /^cizim_.*\.js$/.test(f)).forEach(kopyala);
  fs.readdirSync(path.join(kok, 'arastirma/dersler_v2')).filter(f => /^bolum_basliklari.*\.json$/.test(f)).forEach(f => kopyala('arastirma/dersler_v2/' + f));
  return t;
}
const dosyalar = t => ['veri/sinavlar.json', 'dersler.js', ...fs.readdirSync(t).filter(f => /^cizim_.*\.js$/.test(f))]
  .reduce((o, f) => (o[f] = fs.readFileSync(path.join(t, f), 'utf8'), o), {});
const esle = t => py(['araclar/bolum_esle.py'], t);
const degisen = r => +((r.stdout.match(/değişen dizin sayısı: (\d+)/) || [])[1]);

test('bolum_esle.py: art arda iki çalıştırmada ikincisi 0 değişiklik; araya bölüm girince bir kez ve doğru kaydırır', () => {
  test.setTimeout(120000);
  const t = kopyaKur();
  try {
    let r = esle(t);
    expect(r.status, r.stderr + r.stdout).toBe(0);
    expect(fs.existsSync(path.join(t, 'arastirma/dersler_v2/bolum_basliklari.json')), 'yeni anlık görüntü yazıldı').toBe(true);
    const bir = dosyalar(t);
    r = esle(t);
    expect(r.status, r.stderr).toBe(0);
    expect(degisen(r), r.stdout).toBe(0);
    expect(dosyalar(t)).toEqual(bir);
    /* d5'in başına ve d3'ün 5. bölümünün önüne birer bölüm ekle */
    const D = JSON.parse(fs.readFileSync(path.join(t, 'veri/dersler.json'), 'utf8'));
    const bul = id => D.dersler.find(d => d.id === id);
    const once = { d5: bul('d5').bolumler.map(b => b.baslik), d3: bul('d3').bolumler.map(b => b.baslik) };
    bul('d5').bolumler.unshift({ baslik: 'DENEME A', paragraflar: ['x'], akilda: 'x' });
    bul('d3').bolumler.splice(5, 0, { baslik: 'DENEME B', paragraflar: ['x'], akilda: 'x' });
    fs.writeFileSync(path.join(t, 'veri/dersler.json'), JSON.stringify(D, null, 1));
    const baslik = (id, n) => bul(id).bolumler[n].baslik;
    const refler = () => {
      const ls = [];
      for (const [f, s] of Object.entries(dosyalar(t))) {
        if (f.startsWith('cizim_')) for (const m of s.matchAll(/C\.ekle\('([^']+)',\s*\{\s*ders: '(d\d+)', bolum: (\d+)/g)) ls.push([m[1], m[2], +m[3]]);
      }
      const S = JSON.parse(fs.readFileSync(path.join(t, 'veri/sinavlar.json'), 'utf8'));
      Object.values(S.uniteler).flat().forEach(q => ls.push([q.id, q.ders, q.bolum]));
      const mini = fs.readFileSync(path.join(t, 'dersler.js'), 'utf8').match(/const MINI = \{([\s\S]*?)\};/)[1];
      for (const m of mini.matchAll(/(d\d+)\s*:\s*\{([^}]*)\}/g)) for (const g of m[2].matchAll(/(\d+)\s*:\s*'([a-z]+)'/g)) ls.push(['MINI ' + g[2], m[1], +g[1]]);
      return ls.filter(x => x[1] === 'd5' || x[1] === 'd3');
    };
    const oncekiRef = refler();
    expect(oncekiRef.length).toBeGreaterThan(10);
    r = esle(t);
    expect(r.status, r.stderr).toBe(0);
    expect(degisen(r)).toBeGreaterThan(5);
    const sonraRef = refler();
    /* her gönderme aynı BAŞLIKLI bölümde kaldı */
    sonraRef.forEach(([ad, ders, n], i) => expect(baslik(ders, n), ad).toBe(once[ders][oncekiRef[i][2]]));
    const iki = dosyalar(t);
    r = esle(t);
    expect(degisen(r), 'ikinci kez kaydırmamalı').toBe(0);
    expect(dosyalar(t)).toEqual(iki);
  } finally { fs.rmSync(t, { recursive: true, force: true }); }
});

test('bolum_esle.py: okunamayan MINI girişi ya da eşlenemeyen başlık HATA verir, hiçbir dosya yazılmaz (sessiz silme yok)', () => {
  test.setTimeout(120000);
  const t = kopyaKur();
  try {
    let r = esle(t); expect(r.status, r.stderr).toBe(0);
    const p = path.join(t, 'dersler.js');
    /* çift tırnaklı ve rakamlı/alt çizgili kimlik korunur; okunamayan giriş HATA */
    let s = fs.readFileSync(p, 'utf8').replace(/d5: \{ 3: 'yildiz' \}/, `d5: { 3: 'yildiz', 7: "ay_evre2" }`);
    fs.writeFileSync(p, s);
    r = esle(t); expect(r.status, r.stderr).toBe(0);
    expect(fs.readFileSync(p, 'utf8')).toContain(`d5: { 3: 'yildiz', 7: "ay_evre2" }`);
    s = s.replace(`7: "ay_evre2" }`, '7: ay_evre }'); fs.writeFileSync(p, s);
    const once = dosyalar(t);
    r = esle(t);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/MINI d5: okunamayan giriş/);
    expect(dosyalar(t)).toEqual(once);
    /* başlığı değişmiş ders: eşlenemez → HATA, dosyalar aynı */
    s = s.replace('7: ay_evre }', '7: \'ay_evre\' }'); fs.writeFileSync(p, s);
    const D = JSON.parse(fs.readFileSync(path.join(t, 'veri/dersler.json'), 'utf8'));
    D.dersler.find(d => d.id === 'd3').bolumler[1].baslik += ' (değişti)';
    fs.writeFileSync(path.join(t, 'veri/dersler.json'), JSON.stringify(D, null, 1));
    const once2 = dosyalar(t);
    r = esle(t);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/d3 bölüm 1 .* yeni derste yok/);
    expect(dosyalar(t)).toEqual(once2);
  } finally { fs.rmSync(t, { recursive: true, force: true }); }
});

/* ---------- bugünkü eşleme: beklenen ders / bölüm başlığı ---------- */
function cizimler() {
  const ls = [];
  for (const f of fs.readdirSync(kok).filter(f => /^cizim_.*\.js$/.test(f)).sort()) {
    const s = fs.readFileSync(path.join(kok, f), 'utf8');
    for (const m of s.matchAll(/C\.ekle\('([^']+)',\s*\{\s*ders: '(d\d+)', bolum: (\d+)/g)) ls.push({ tur: 'cizim', id: m[1], ders: m[2], bolum: +m[3] });
  }
  return ls;
}
function sinavSorulari() {
  return Object.values(oku('veri/sinavlar.json').uniteler).flat().map(q => ({ tur: 'sinav', id: q.id, ders: q.ders, bolum: q.bolum }));
}

test('Her çizim ve her sınav sorusu beklenen bölümde: ders + bölüm başlığı listesiyle aynı (testler/veri/bolum_esleme_beklenen.json)', () => {
  const D = Object.fromEntries(oku('veri/dersler.json').dersler.map(d => [d.id, d]));
  const simdi = [...cizimler(), ...sinavSorulari()].map(x => ({ ...x, baslik: (D[x.ders] && D[x.ders].bolumler[x.bolum] || {}).baslik }));
  const yol = path.join(__dirname, 'veri', 'bolum_esleme_beklenen.json');
  if (process.env.URANIA_ANLIK_YAZ) {
    fs.writeFileSync(yol, JSON.stringify({ not: 'Her çizimin (cizim_*.js) ve sınav sorusunun (veri/sinavlar.json) beklenen dersi ve bölüm BAŞLIĞI. ' +
      'Bölüm dizini kayabilir (araya bölüm girerse), başlık kaymaz. 2026-11-08 denetiminde her eşleme bölüm metniyle karşılaştırıldı.',
    liste: simdi.map(x => [x.tur, x.id, x.ders, x.baslik]) }, null, 0).replace(/\],\[/g, '],\n[') + '\n');
  }
  const B = JSON.parse(fs.readFileSync(yol, 'utf8')).liste;
  const beklenen = new Map(B.map(([tur, id, ders, baslik]) => [tur + ' ' + id, { ders, baslik }]));
  expect(simdi.length).toBeGreaterThan(350);
  const sorun = [];
  for (const x of simdi) {
    const b = beklenen.get(x.tur + ' ' + x.id);
    if (!b) { sorun.push(`${x.tur} ${x.id}: beklenen listede yok (yeni ise bölümünü denetleyip listeye ekle)`); continue; }
    if (b.ders !== x.ders || b.baslik !== x.baslik) sorun.push(`${x.tur} ${x.id}: ${x.ders} bölüm ${x.bolum} "${x.baslik}" ≠ beklenen ${b.ders} "${b.baslik}"`);
  }
  const var_ = new Set(simdi.map(x => x.tur + ' ' + x.id));
  for (const k of beklenen.keys()) if (!var_.has(k)) sorun.push(`${k}: listede var, veride yok`);
  expect(sorun).toEqual([]);
});
