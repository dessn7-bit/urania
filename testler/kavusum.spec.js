'use strict';
/* Kavuşumlar (gok.js kavusumlar / olaylar): iki bağımsız kaynakla karşılaştırma ve yerel görünürlük kuralları. Ağ yok;
   referanslar 7 Kasım 2026'da alınıp fikstür olarak kaydedildi:
   - JPL Horizons API (ssd.jpl.nasa.gov/api/horizons.api; EPHEM_TYPE=OBSERVER, CENTER=500@399 yer merkezi, QUANTITIES=2
     görünen RA/Dec (havasız), 1 dakika adım): testler/veri/kavusum/horizons/<olay>_a.txt ve _b.txt (ham metin yanıtlar).
     Altı olay: Mars–Jüpiter 16 Kas 2026, Ay–Jüpiter 30 Kas 2026, Ay–Venüs 4 Mar 2027, Merkür–Satürn 19 Nis 2027,
     Venüs–Satürn 7 May 2027, Venüs–Jüpiter 26 Ağu 2027. Tolerans: ayrım 0,02°, zaman 30 dakika.
   - CycleCalcs /v2/conjunctions (frame=apparent, max_separation_deg=6.4, 1 Kas 2026 – 30 Kas 2027 00:00 UT; Astronomy
     Engine 2.1.19 ile hesaplar): testler/veri/kavusum/cyclecalcs/*.json (ham JSON yanıtlar; Ay+gezegenler ve her parlak
     yıldız için gezegen çiftleri). Kaçan ve fazla olaylar aşağıda tek tek gerekçelendirilir.
   Ayrıntı ve karşılaştırma tabloları: arastirma/kavusum_kaynak.md */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const G = require('../gok.js');
const Plan = require('../plan.js');
const Bulucu = require('../bulucu.js');
const HED = require('../veri/hedefler.json').hedefler;
const YIL = require('../veri/yildizlar.json');
const VERI = { hedefler: HED, yildizlar: YIL };
const IST = G.gozlemci(41.0, 29.1, 20);
const DER = Math.PI / 180;

/* Horizons ham yanıtı: $$SOE … $$EOE arasındaki CSV satırları (tarih, bayraklar, RA, Dec — derece) */
function horizonsOku(dosya) {
  const t = fs.readFileSync(path.join(__dirname, 'veri', 'kavusum', 'horizons', dosya), 'utf8');
  const s = t.indexOf('$$SOE'), e = t.indexOf('$$EOE');
  const AY = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  return t.slice(s + 5, e).trim().split('\n').map(ln => {
    const p = ln.split(',').map(x => x.trim());
    const m = /^(\d{4})-(\w{3})-(\d\d) (\d\d):(\d\d)(?::(\d\d)(?:\.(\d+))?)?/.exec(p[0]);
    const zaman = Date.UTC(+m[1], AY[m[2]], +m[3], +m[4], +m[5], +(m[6] || 0));
    const sayilar = p.slice(1).filter(x => /^-?\d+\.\d+$/.test(x)).map(Number);
    return { zaman, ra: sayilar[0], dec: sayilar[1] };
  });
}
function kureselAyrim(a, b) {
  const c = Math.sin(a.dec * DER) * Math.sin(b.dec * DER) + Math.cos(a.dec * DER) * Math.cos(b.dec * DER) * Math.cos((a.ra - b.ra) * DER);
  return Math.acos(Math.max(-1, Math.min(1, c))) / DER;
}
/* Dakikalık dizide en küçük ayrım; komşu üç noktadan parabol ile an inceleştirilir */
function horizonsEnYakin(ad) {
  const A = horizonsOku(ad + '_a.txt'), B = horizonsOku(ad + '_b.txt');
  expect(A.length).toBe(B.length);
  const ls = A.map((a, i) => ({ zaman: a.zaman, ayrim: kureselAyrim(a, B[i]) }));
  let i = 0; ls.forEach((x, k) => { if (x.ayrim < ls[i].ayrim) i = k; });
  expect(i).toBeGreaterThan(0); expect(i).toBeLessThan(ls.length - 1);   // en küçük, pencerenin kenarında değil
  const y0 = ls[i - 1].ayrim, y1 = ls[i].ayrim, y2 = ls[i + 1].ayrim, payda = y0 - 2 * y1 + y2;
  const kay = payda ? 0.5 * (y0 - y2) / payda : 0;
  return { zaman: ls[i].zaman + kay * 60e3, ayrim: y1 - 0.25 * (y0 - y2) * kay };
}

const HORIZONS = [
  ['mars_jupiter_20261116', 'Mars', 'Jupiter', '2026-11-16T02:00:00Z'],
  ['moon_jupiter_20261130', 'Moon', 'Jupiter', '2026-11-30T08:30:00Z'],
  ['moon_venus_20270304', 'Moon', 'Venus', '2027-03-04T20:30:00Z'],
  ['mercury_saturn_20270419', 'Mercury', 'Saturn', '2027-04-19T12:30:00Z'],
  ['venus_saturn_20270507', 'Venus', 'Saturn', '2027-05-07T18:40:00Z'],
  ['venus_jupiter_20270826', 'Venus', 'Jupiter', '2027-08-26T03:00:00Z']
];
test.describe('JPL Horizons ile en yakın an ve ayrım (6 olay; ±0,02°, ±30 dk)', () => {
  for (const [dosya, a, b, yaklasik] of HORIZONS) {
    test(`${G.TR_AD[a]}–${G.TR_AD[b]} ${yaklasik.slice(0, 10)}`, () => {
      const ref = horizonsEnYakin(dosya);
      /* Arama olaydan 3 gün önce başlar, 7 gün sürer (yalnız Ay ve gezegen çiftleri; sabit hedef verisi yok) */
      const bas = new Date(new Date(yaklasik).getTime() - 3 * 86400e3);
      const ls = G.kavusumlar(bas, 7, null, null).filter(k => k.cisimler.indexOf(a) >= 0 && k.cisimler.indexOf(b) >= 0);
      expect(ls.length, 'tek olay').toBe(1);
      const k = ls[0];
      expect(Math.abs(k.enYakin.zaman - ref.zaman) / 60e3, 'zaman farkı (dk)').toBeLessThanOrEqual(30);
      expect(Math.abs(k.enYakin.ayrim - ref.ayrim), 'ayrım farkı (°)').toBeLessThanOrEqual(0.02);
      expect(k.enYakin.kaba, 'Search ile inceleştirildi').toBe(false);
    });
  }
  test('Mars–Jüpiter 16 Kasım 2026: 1,19°, ≈02:00 UT (görevdeki değer)', () => {
    const k = G.kavusumlar(new Date('2026-11-13T00:00:00Z'), 7, null, IST).find(x => x.cisimler.indexOf('Mars') >= 0 && x.cisimler.indexOf('Jupiter') >= 0);
    expect(Math.abs(k.enYakin.ayrim - 1.19)).toBeLessThanOrEqual(0.02);
    expect(Math.abs(k.enYakin.zaman - Date.UTC(2026, 10, 16, 2, 0))).toBeLessThanOrEqual(30 * 60e3);
    expect(k.gorunur).toBe(true);
    expect(k.gorus.canli).toBe(true);   // en yakın an burada gece ve iki gezegen de yüksekte
  });
});

/* ---- En iyi görüş anı: karanlık yüksekliğe tercih edilir (−18° → −12° → −6°) ----
   Güneş yüksekliği gok.js'ten değil, node_modules'taki Astronomy Engine'den (kırılmalı, gok.js cisimAltAz ile aynı ölçü);
   gezegen yükseklikleri Horizons'un görünen RA/Dec'inden (yer merkezli; gezegende paralaks ihmal edilebilir). */
const AE = require('astronomy-engine');
const AE_IST = new AE.Observer(41.0, 29.1, 20);
function aeGunes(t, gz) { const e = AE.Equator(AE.Body.Sun, t, gz || AE_IST, true, true); return AE.Horizon(t, gz || AE_IST, e.ra, e.dec, 'normal').altitude; }
function aeCisim(c, t, gz) {
  let ad = c;
  if (typeof c !== 'string') { AE.DefineStar(AE.Body.Star2, c.ra / 15, c.dec, 1000); ad = AE.Body.Star2; }   // sabit hedef (J2000)
  const e = AE.Equator(ad, t, gz, true, true); return AE.Horizon(t, gz, e.ra, e.dec, 'normal').altitude;
}
function horizonsAlt(dosya, t) {
  const r = horizonsOku(dosya).find(x => Math.abs(x.zaman - t) < 30e3);
  expect(r, 'Horizons satırı ' + new Date(t).toISOString()).toBeTruthy();
  return AE.Horizon(new Date(t), AE_IST, r.ra / 15, r.dec, 'normal').altitude;
}
/* Bağımsız pencere: ±1 gün, 5 dk adım, iki cisim ≥10° ve Güneş ≤ −6°; görüş anını içeren kesintisiz pencerede Güneş'in en alçağı */
function pencereEnAlcakGunes(k, gz) {
  const e = k.enYakin.zaman.getTime(), g = k.gorus.zaman.getTime();
  const ok = t => { const d = new Date(t); return aeGunes(d, gz) <= -6 && k.cisimler.every(c => aeCisim(c, d, gz) >= 10); };
  expect(ok(g), 'görüş anı koşulları sağlıyor').toBe(true);
  let bas = g, son = g;
  while (bas - 5 * 60e3 >= e - 86400e3 && ok(bas - 5 * 60e3)) bas -= 5 * 60e3;
  while (son + 5 * 60e3 <= e + 86400e3 && ok(son + 5 * 60e3)) son += 5 * 60e3;
  let en = 90;
  for (let t = bas; t <= son; t += 5 * 60e3) en = Math.min(en, aeGunes(new Date(t), gz));
  return en;
}

test('Mars–Jüpiter 16 Kasım 2026 (İstanbul): en yakın an 05.03 TSİ tam karanlıkta; en iyi görüş anı da tam karanlıkta (Horizons)', () => {
  const ref = horizonsEnYakin('mars_jupiter_20261116');
  /* Horizons: en yakın an 02:04:50 UT (05.04 TSİ); o anda iki gezegen ≈50° yükseklikte, Güneş −31° */
  const altM = horizonsAlt('mars_jupiter_20261116_a.txt', Math.round(ref.zaman / 60e3) * 60e3);
  const altJ = horizonsAlt('mars_jupiter_20261116_b.txt', Math.round(ref.zaman / 60e3) * 60e3);
  expect(altM).toBeGreaterThan(45); expect(altJ).toBeGreaterThan(45);
  expect(aeGunes(new Date(ref.zaman))).toBeLessThan(-18);
  const k = G.kavusumlar(new Date('2026-11-13T00:00:00Z'), 7, null, IST).find(x => x.cisimler.indexOf('Mars') >= 0 && x.cisimler.indexOf('Jupiter') >= 0);
  expect(Math.abs(k.enYakin.zaman - ref.zaman) / 60e3).toBeLessThanOrEqual(3);
  /* Eski seçim (yalnız Güneş ≤ −12°, en yüksek an) 06.43 TSİ'yi veriyordu: Güneş −12,6°. Şimdi tam karanlık şart. */
  expect(k.gorus.karanlikEsik).toBe(-18);
  expect(aeGunes(k.gorus.zaman), 'görüş anında Güneş (AE)').toBeLessThanOrEqual(-18);
  expect(k.gorus.zaman < new Date('2026-11-16T03:43:00Z')).toBe(true);
  /* Görüş anında iki gezegen de en yakın andakinden alçak değil (tam karanlık içinde en yüksek an seçilir) ve Horizons'la ≥10° */
  const t = Math.round(k.gorus.zaman / 60e3) * 60e3;
  const gM = horizonsAlt('mars_jupiter_20261116_a.txt', t), gJ = horizonsAlt('mars_jupiter_20261116_b.txt', t);
  expect(Math.min(gM, gJ)).toBeGreaterThanOrEqual(Math.min(altM, altJ) - 0.5);
  expect(Math.abs(Math.min(gM, gJ) - k.gorus.alt)).toBeLessThan(0.2);
});

test('Görüş anı seçimi (gorusAniSec): −18° varsa yükseklikten önce o; yoksa −12°; o da yoksa −6°', () => {
  const an = (dk, gunes, altA, altB) => ({ t: new Date(Date.UTC(2026, 10, 16, 0, dk)), gunes, ka: { alt: altA }, kb: { alt: altB } });
  const ayrim = () => 1;
  /* Tam karanlık an alçakta (20°), alacakaranlıktaki an yüksekte (60°): tam karanlık seçilir */
  let s = G.gorusAniSec([an(0, -25, 20, 22), an(10, -19, 30, 31), an(20, -13, 60, 61), an(30, -7, 70, 70)], false, ayrim);
  expect(s.esik).toBe(-18); expect(s.gunes).toBe(-19);
  /* −18° yok: −12°'nin altındaki anlar arasından en yüksek */
  s = G.gorusAniSec([an(0, -16, 20, 22), an(10, -12.5, 30, 31), an(20, -9, 60, 61)], false, ayrim);
  expect(s.esik).toBe(-12); expect(s.gunes).toBe(-12.5);
  /* −12° de yok: −6° anlar */
  s = G.gorusAniSec([an(0, -11, 20, 22), an(10, -8, 30, 31), an(20, -6.5, 60, 61)], false, ayrim);
  expect(s.esik).toBe(-6); expect(s.gunes).toBe(-6.5);
  /* Ay'lı çift: aynı basamak içinde ayrımın en küçük olduğu an */
  s = G.gorusAniSec([an(0, -20, 20, 22), an(10, -19, 30, 31), an(20, -10, 60, 61)], true, t => t.getUTCMinutes() === 0 ? 2 : t.getUTCMinutes() === 10 ? 1.5 : 0.5);
  expect(s.esik).toBe(-18); expect(s.gunes).toBe(-19); expect(s.ayrim).toBe(1.5);
  expect(G.GORUS_KARANLIK).toEqual([-18, -12, -6]);
});

test('−12° basamağı (gerçek olay): Ay–Jüpiter 12 Mayıs 2027, 55,0 K 12,0 D — pencerede tam karanlık yok', () => {
  const gzl = G.gozlemci(55.0, 12.0, 0), gz = new AE.Observer(55.0, 12.0, 0);
  const k = G.kavusumlar(new Date('2027-05-09T00:00:00Z'), 7, null, gzl).find(x => x.ayli && x.gezegen === 'Jupiter');
  expect(k && k.gorunur).toBe(true);
  expect(k.gorus.karanlikEsik).toBe(-12);
  const g = aeGunes(k.gorus.zaman, gz);
  expect(g).toBeLessThanOrEqual(-12); expect(g).toBeGreaterThan(-18);
  expect(pencereEnAlcakGunes(k, gz), 'pencerede Güneş −18°\'ye inmiyor').toBeGreaterThan(-18);
});

test('−6° basamağı (gerçek olay): Venüs–Spica 9 Kasım 2026, İstanbul — pencerede Güneş −12°\'ye inmiyor', () => {
  const k = G.kavusumlar(new Date('2026-11-06T00:00:00Z'), 7, VERI, IST).find(x => x.adlar.indexOf('Venüs') >= 0 && x.adlar.indexOf('Spica') >= 0);
  expect(k && k.gorunur).toBe(true);
  expect(k.gorus.karanlikEsik).toBe(-6);
  const g = aeGunes(k.gorus.zaman);
  expect(g).toBeLessThanOrEqual(-6); expect(g).toBeGreaterThan(-12);
  expect(pencereEnAlcakGunes(k, AE_IST), 'pencerede Güneş −12° altına inmiyor').toBeGreaterThan(-12);
});

/* ---- CycleCalcs ---- */
const CC_AD = { Moon: 'Ay', Mercury: 'Merkür', Venus: 'Venüs', Mars: 'Mars', Jupiter: 'Jüpiter', Saturn: 'Satürn', Alcyone: 'Ülker' };
function cyclecalcs() {
  const k = path.join(__dirname, 'veri', 'kavusum', 'cyclecalcs');
  const ls = [];
  let bitis = null;
  fs.readdirSync(k).filter(f => f.endsWith('.json')).forEach(f => {
    const d = JSON.parse(fs.readFileSync(path.join(k, f), 'utf8'));
    expect(d.query.frame).toBe('apparent'); expect(d.query.max_separation_deg).toBe(6.4);
    bitis = new Date(d.query.end);
    d.data.approaches.forEach(r => ls.push({ zaman: new Date(r.instant), adlar: [CC_AD[r.pair.a] || r.pair.a, CC_AD[r.pair.b] || r.pair.b], ayrim: r.separation_deg, tur: r.kind, dosya: f }));
  });
  return { ls, bitis };
}
const ayniCift = (x, y) => (x[0] === y[0] && x[1] === y[1]) || (x[0] === y[1] && x[1] === y[0]);

test('CycleCalcs Kasım 2026 – Kasım 2027: her olayı buluyoruz; fazlalar yalnız pencere sonu ve M44', () => {
  const { ls: cc, bitis } = cyclecalcs();
  expect(cc.length).toBe(87);
  const bas = new Date('2026-11-01T00:00:00Z');
  const biz = G.kavusumlar(bas, 395, VERI, null);
  const eslesen = [];
  const kacan = [];
  cc.forEach(c => {
    const b = biz.find(x => ayniCift(x.adlar, c.adlar) && Math.abs(x.enYakin.zaman - c.zaman) < 6 * 3600e3);
    if (!b) { kacan.push(c); return; }
    eslesen.push({ c, b, dt: Math.abs(b.enYakin.zaman - c.zaman) / 60e3, ds: Math.abs(b.enYakin.ayrim - c.ayrim) });
  });
  expect(kacan.map(c => c.adlar.join('–') + ' ' + c.zaman.toISOString()), 'CycleCalcs\'ta olup bizde olmayan').toEqual([]);
  eslesen.forEach(e => {
    const ulker = e.c.adlar.indexOf('Ülker') >= 0;
    /* CycleCalcs Ülker yerine Alcyone yıldızını kullanır (M45 merkezinden 0,25° ötede): ayrım 0,1°, an birkaç saat kayar.
       Öteki çiftlerde fark iki uygulamanın adımı ve en küçüğü bulma yönteminden (düz minimumlarda dakikalar). */
    expect(e.ds, e.c.adlar.join('–')).toBeLessThanOrEqual(ulker ? 0.1 : 0.01);
    expect(e.dt, e.c.adlar.join('–') + ' dk').toBeLessThanOrEqual(ulker ? 300 : 20);
  });
  const fazla = biz.filter(b => !cc.some(c => ayniCift(c.adlar, b.adlar) && Math.abs(b.enYakin.zaman - c.zaman) < 6 * 3600e3));
  fazla.forEach(f => {
    const pencereDisi = f.enYakin.zaman >= bitis;                              // CycleCalcs penceresi 30 Kas 2027 00:00'da bitiyor
    const m44 = f.adlar.some(a => /Praesepe|Arıkovanı/.test(a));              // CycleCalcs'ın yıldız listesinde M44 yok
    expect(pencereDisi || m44, 'açıklanamayan fazla olay: ' + f.adlar.join('–') + ' ' + f.enYakin.zaman.toISOString()).toBe(true);
  });
  expect(fazla.length).toBe(4);
});

/* ---- Yerel görünürlük ve listeleme kuralları ---- */
test('Eşik 6,4° (bulucu.js ile aynı değer) ve 1° altı "çok yakın"', () => {
  expect(G.DURBUN_ALANI).toBe(6.4);
  const r = Bulucu.hesapla({ yildizlar: YIL, takimyildizlar: require('../veri/takimyildiz.json') }, HED.find(h => h.id === 'M31'), new Date('2026-10-28T18:00:00Z'), IST, 400, 400);
  expect(r.gorus).toBe(G.DURBUN_ALANI);
  const ls = G.kavusumlar(new Date('2026-11-01T00:00:00Z'), 60, VERI, null);
  ls.forEach(k => { expect(k.enYakin.ayrim).toBeLessThanOrEqual(6.4); expect(k.cokYakin).toBe(k.enYakin.ayrim <= 1); });
  expect(ls.some(k => k.cokYakin)).toBe(true);
  /* Sabit hedefler: Ülker, Arıkovanı ve 1,5 kadirden parlak yıldızlar */
  const sabit = G.kavusumSabitleri(VERI);
  expect(sabit.map(s => s.ad)).toEqual(expect.arrayContaining(['Ülker', 'Regulus', 'Spica', 'Antares', 'Aldebaran', 'Pollux']));
  expect(sabit.filter(s => s.id.indexOf('yildiz:') === 0).every(s => s.kadir <= 1.5)).toBe(true);
  expect(sabit.some(s => s.id === 'hedef:M44')).toBe(true);
});

test('Görüş anı: iki cisim ≥10°, Güneş ≤ −6°; görünmeyen olay listeye girmez; sayılar hesaptan', () => {
  const bas = new Date('2026-11-07T12:00:00Z');
  const hepsi = G.kavusumlar(bas, 120, VERI, IST);
  const olaylar = G.olaylar(bas, IST, 120, VERI).filter(o => o.tur === 'kavusum');
  expect(olaylar.length).toBe(hepsi.filter(k => k.gorunur).length);
  expect(olaylar.length).toBeGreaterThanOrEqual(8);
  olaylar.forEach(o => {
    const g = o.gorus;
    expect(g).toBeTruthy();
    expect(G.cisimAltAz('Sun', g.zaman, IST).alt).toBeLessThanOrEqual(-6);
    o.cisimler.forEach(c => {
      const h = typeof c === 'string' ? G.cisimAltAz(c, g.zaman, IST) : G.sabitAltAz(c.ra, c.dec, g.zaman, IST);
      expect(h.alt, o.baslik).toBeGreaterThanOrEqual(10);
    });
    expect(g.ayrim).toBeLessThanOrEqual(6.4);
    expect(Math.abs(g.ayrim - G.kavusumAyrim(o.cisimler[0], o.cisimler[1], g.zaman))).toBeLessThan(1e-9);
    expect(o.zaman).toBe(g.zaman);
    expect(o.baslik).toBe(o.adlar[0] + ' ile ' + o.adlar[1] + ' kavuşumu');
  });
  /* Güneş'e yakın Merkür yaklaşmaları buradan görülmez: listede yok */
  const merkurAy = hepsi.filter(k => k.ayli && k.gezegen === 'Mercury');
  expect(merkurAy.length).toBeGreaterThan(0);
  merkurAy.forEach(k => expect(k.gorunur).toBe(false));
  /* Ay–Venüs 4 Mart 2027 (20:33 UT, ikisi de ufkun altında): en yakın görülebilir anda ayrım 6,4°'yi aşıyor → yok */
  const ayVenus = hepsi.find(k => k.ayli && k.gezegen === 'Venus' && k.enYakin.zaman.toISOString().slice(0, 10) === '2027-03-04');
  expect(ayVenus).toBeTruthy(); expect(ayVenus.gorunur).toBe(false);
  /* Ay–Jüpiter 30 Kasım 2026: en yakın an 08:25 UT gündüz; en iyi görüş aynı sabah karanlıkta, ayrım hesaptan (≈2,5°) */
  const ayJup = olaylar.find(k => k.ayli && k.gezegen === 'Jupiter' && k.enYakin.zaman.toISOString().slice(0, 10) === '2026-11-30');
  expect(ayJup.gorus.canli).toBe(false);
  expect(ayJup.gorus.zaman < ayJup.enYakin.zaman).toBe(true);
  expect(ayJup.gorus.ayrim).toBeGreaterThan(ayJup.enYakin.ayrim);
});

test('Plan: kavuşum kendi saatinde; Ay\'ın gezegeni örtmesi listedeyse ikinci kez yazılmaz', () => {
  /* 15/16 Kasım 2026 gecesi: Mars–Jüpiter en iyi görüş sabaha karşı */
  const gece = G.geceAraligi(new Date('2026-11-15T15:00:00Z'), IST);
  const olaylar = G.olaylar(new Date('2026-11-15T12:00:00Z'), IST, 10, VERI);
  const kav = olaylar.filter(o => o.tur === 'kavusum');
  const p = Plan.olustur({ gzl: IST, gece, hedefDurum: [], gezegenGece: [], ay: null, limitKadir: 4, hava: null, kavusumlar: kav });
  const m = p.maddeler.find(x => x.tur === 'kavusum');
  expect(m).toBeTruthy();
  expect(m.ad).toBe('Mars ile Jüpiter kavuşumu');
  expect(m.zaman.getTime()).toBe(m.kavusum.gorus.zaman.getTime());
  expect(m.zaman >= p.bas && m.zaman <= p.son).toBe(true);
  expect(m.alt).toBeGreaterThanOrEqual(10);
  /* Sahte örtme kaydı: aynı gezegen, 12 saat içinde → kavuşum düşer */
  const ayJup = { tur: 'kavusum', ayli: true, gezegen: 'Jupiter', enYakin: { zaman: new Date('2026-11-30T08:25:00Z') } };
  expect(G.kavusumOrtmeyleAyni(ayJup, [{ hedef: { gezegen: 'Jupiter' }, giris: new Date('2026-11-30T07:40:00Z') }])).toBe(true);
  expect(G.kavusumOrtmeyleAyni(ayJup, [{ hedef: { gezegen: 'Venus' }, giris: new Date('2026-11-30T07:40:00Z') }])).toBe(false);
  expect(G.kavusumOrtmeyleAyni(ayJup, [{ hedef: { hip: 17531 }, giris: new Date('2026-11-30T07:40:00Z') }])).toBe(false);
  expect(G.kavusumOrtmeyleAyni({ tur: 'kavusum', ayli: false, enYakin: { zaman: new Date() } }, [{ hedef: { gezegen: 'Jupiter' }, giris: new Date() }])).toBe(false);
  const p2 = Plan.olustur({ gzl: IST, gece, hedefDurum: [], gezegenGece: [], ay: null, limitKadir: 4, hava: null, kavusumlar: kav.map(k => Object.assign({}, k, { ayli: true, gezegen: 'Jupiter' })), ortmeler: [{ hedef: { gezegen: 'Jupiter' }, giris: kav[0].enYakin.zaman }] });
  expect(p2.maddeler.some(x => x.tur === 'kavusum')).toBe(false);
});

/* ---- Arayüz: Gökyüzü sekmesi "Yaklaşan olaylar", "Bu gecenin planı" ve sesli okuma metni (hesaptan) ---- */
test.describe('Arayüz', () => {
  const { celestrak, disAgiKes } = require('./yardim');
  test.beforeEach(async ({ page }) => {
    page.hatalar = [];
    page.on('pageerror', e => page.hatalar.push(String(e)));
    await disAgiKes(page);
    await celestrak(page);
    await page.route('**/api.open-meteo.com/**', r => r.fulfill({ json: { hourly: { time: [], cloud_cover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [], relative_humidity_2m: [], wind_speed_10m: [] } } }));
    await page.route('**/nominatim.openstreetmap.org/**', r => r.fulfill({ json: { address: {} } }));
  });
  test.afterEach(async ({ page }) => { expect(page.hatalar).toEqual([]); });

  test('15 Kasım 2026 gecesi: listede Mars–Jüpiter kavuşumu, planda kendi saatinde, takvim düğmesi ve sesli metin', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-11-15T21:00:00+03:00') });
    await page.addInitScript(() => { localStorage.setItem('urania_konumOto', 'false'); localStorage.setItem('urania_konum', JSON.stringify({ ad: 'İstanbul', enlem: 41.0, boylam: 29.1, yukseklik: 20, oto: false, saatDilimi: 'Europe/Istanbul' })); });
    await page.goto('/index.html#gok');
    /* "Yaklaşan olaylar" katlanır bölümdür: önce açılır */
    const kat = page.locator('details[data-kat="olay"]');
    if (!(await kat.evaluate(d => d.open))) await kat.locator('summary').click();
    const olay = page.locator('#gkOlay li.olay-kavusum', { hasText: 'Mars ile Jüpiter kavuşumu' });
    await expect(olay).toBeVisible({ timeout: 20000 });
    /* Sayılar hesaptan: Node'daki aynı hesapla karşılaştır */
    const k = G.olaylar(new Date('2026-11-15T18:00:00Z'), IST, 10, VERI).find(o => o.tur === 'kavusum' && o.baslik === 'Mars ile Jüpiter kavuşumu');
    const ayrim = k.gorus.ayrim.toFixed(1).replace('.', ',') + '°';
    await expect(olay).toContainText(ayrim);
    await expect(olay).toContainText(Math.round(k.gorus.alt) + '°');
    await expect(olay).toContainText('7×50 dürbünün alanına birlikte sığarlar');
    await expect(olay.locator('.takvim-bag')).toHaveText('Takvime ekle');
    /* Metin önce en yakın anın saatini söyler (05.03 TSİ), sonra en iyi görüş anını; görüş anında gök tam karanlık */
    const sa = t => new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(t);
    expect(sa(k.enYakin.zaman)).toBe('05:03');
    const metin = (await olay.locator('.alt').innerText()).replace(/\s+/g, ' ');
    expect(metin).toMatch(new RegExp('^En yakın an [^:]*' + sa(k.enYakin.zaman) + ':'));
    expect(metin.indexOf(sa(k.enYakin.zaman))).toBeLessThan(metin.indexOf(sa(k.gorus.zaman)));
    expect(metin).toContain('Buradan en iyi ' + sa(k.gorus.zaman));
    expect(metin).toContain('gök tam karanlık');
    /* Plan: kavuşum maddesi görüş saatinde (yerel saat), sesli metinde ayrım "derece" sözüyle */
    const madde = page.locator('#gkPlan li.plan-kavusum');
    await expect(madde).toHaveCount(1, { timeout: 20000 });
    const saat = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(k.gorus.zaman);
    await expect(madde.locator('.saat')).toHaveText(saat);
    const ses = await madde.getAttribute('data-ses');
    expect(ses).toContain('Mars ile Jüpiter kavuşumu');
    expect(ses).toContain(k.gorus.ayrim.toFixed(1).replace('.', ',') + ' derece');
    expect(ses).toContain(Math.round(k.gorus.alt) + ' derece yükseklikte');
    /* .ics: takvim düğmesi indirme başlatır, başlıkta olay adı */
    const indirme = page.waitForEvent('download');
    await olay.locator('.takvim-bag').click();
    const d = await indirme;
    expect(d.suggestedFilename()).toMatch(/^urania-mars-ile-jupiter-kavusumu.*\.ics$/);
    /* RFC 5545: satırlar 75 sekizlide katlanır, virgül "\\," olarak kaçışlıdır */
    const icerik = fs.readFileSync(await d.path(), 'utf8').replace(/\r?\n[ \t]/g, '').replace(/\\,/g, ',');
    expect(icerik).toContain('BEGIN:VEVENT');
    expect(icerik).toContain('Mars ile Jüpiter kavuşumu');
    expect(icerik).toContain('aralarında ' + ayrim);
    expect(icerik).toContain(Math.round(k.gorus.alt) + '° yükseklikte');
  });
});
