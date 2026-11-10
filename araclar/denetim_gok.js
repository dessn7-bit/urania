'use strict';
/* Haftalık denetim (c): Astronomy Engine (lib/astronomy.browser.min.js, uygulamanın kullandığı dosya) ↔ JPL Horizons.
   Girdi: araclar/denetim.py horizons-indir çıktısı (horizons.json). Gözlemci İstanbul 41,0 K 29,1 D, 0 m.
   Konum: görünür (aberasyonlu, o tarihin ekvatoru) yerel RA/Dec, kırılmasız; tolerans 10″.
   Zaman: meridyen geçişi (Horizons yerel görünür saat açısının sıfırdan geçtiği an, 2 dk adımdan aradeğerleme) ↔
   Astronomy.SearchHourAngle(…, 0); tolerans 1 dakika.
   Kullanım: node araclar/denetim_gok.js <horizons.json> <klasör> */
const fs = require('fs');
const path = require('path');
const A = require('../lib/astronomy.browser.min.js');
const [, , giris, kl] = process.argv;
const H = JSON.parse(fs.readFileSync(giris, 'utf8'));
const gzl = new A.Observer(H.site.enlem, H.site.boylam, 0);
const DER = Math.PI / 180;
const AY = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const tarih = s => { const m = s.match(/^(\d{4})-(\w{3}|\d{2})-(\d{2}) (\d{2}):(\d{2})/); const ay = isNaN(m[2]) ? AY[m[2]] : Number(m[2]) - 1; return new Date(Date.UTC(+m[1], ay, +m[3], +m[4], +m[5])); };
const ayr = (r1, d1, r2, d2) => Math.acos(Math.min(1, Math.sin(d1 * DER) * Math.sin(d2 * DER) + Math.cos(d1 * DER) * Math.cos(d2 * DER) * Math.cos((r1 - r2) * DER))) / DER;
const TOL_KONUM = 10 / 3600, TOL_ZAMAN_SN = 60;
const konum = [], zaman = [];
for (const [ad, ls] of Object.entries(H.konum)) {
  for (const x of ls) {
    const t = tarih(x.utc);
    const e = A.Equator(A.Body[ad], t, gzl, true, true);
    const fark = ayr(e.ra * 15, e.dec, x.ra, x.dec) * 3600;
    konum.push({ cisim: ad, utc: x.utc, fark_yaysn: +fark.toFixed(2), asti: fark > TOL_KONUM * 3600 });
  }
}
for (const [ad, ls] of Object.entries(H.gecis)) {
  for (const s of ls) {
    const th = new Date(s).getTime();
    const r = A.SearchHourAngle(A.Body[ad], gzl, 0, A.MakeTime(new Date(th - 12 * 3600e3)), +1);
    const ta = r.time.date.getTime();
    const fark = Math.abs(ta - th) / 1000;
    zaman.push({ cisim: ad, horizons: s, astronomy_engine: r.time.date.toISOString().slice(0, 19) + 'Z', fark_sn: Math.round(fark), asti: fark > TOL_ZAMAN_SN });
  }
}
/* Taban (arastirma/denetim/gok_taban.json): ilk koşuda 10″'yi aşan noktalar bilinir; yalnız yeni aşan ya da tabandan
   1″'den fazla büyüyen nokta "yeni" sayılır ve kayıt açar. Bütün aşanlar özette listelenir. */
const TABAN = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'arastirma', 'denetim', 'gok_taban.json'), 'utf8'));
konum.forEach(x => { const t = TABAN.noktalar[x.cisim + '|' + x.utc]; x.tabanda = t != null; x.yeni = x.asti && (t == null || x.fark_yaysn > t + TABAN.buyume_payi_yaysn); });
zaman.forEach(x => { x.yeni = x.asti; });
const asan = konum.filter(x => x.asti).concat(zaman.filter(x => x.asti));
const yeni = asan.filter(x => x.yeni);
const enKonum = Math.max(...konum.map(x => x.fark_yaysn)), enZaman = Math.max(...zaman.map(x => x.fark_sn));
fs.mkdirSync(kl, { recursive: true });
fs.writeFileSync(path.join(kl, 'gok_sonuc.json'), JSON.stringify({ konum, zaman, en_buyuk_konum_yaysn: enKonum, en_buyuk_zaman_sn: enZaman, asan, yeni }, null, 1));
const md = ['## Gökyüzü hesapları (Astronomy Engine ↔ JPL Horizons)',
  `İstanbul (41,0 K 29,1 D): ${konum.length} konum (${Object.keys(H.konum).length} cisim × ${H.konum.Sun.length} an), ${zaman.length} meridyen geçişi. En büyük fark: konum ${enKonum.toFixed(2)}″ (tolerans 10″), zaman ${enZaman} sn (tolerans 60 sn). Toleransı aşan: ${asan.length} (tabanda bilinen ${asan.length - yeni.length}; Astronomy Engine'in tasarım doğruluğu ±1′). **Yeni ya da büyüyen fark: ${yeni.length}**.`];
if (asan.length) { md.push('\n| Cisim | An | Fark | Durum |\n|---|---|---|---|'); asan.forEach(x => md.push(`| ${x.cisim} | ${x.utc || x.horizons} | ${x.fark_yaysn != null ? x.fark_yaysn + '″' : x.fark_sn + ' sn'} | ${x.yeni ? 'YENİ' : 'tabanda'} |`)); }
fs.writeFileSync(path.join(kl, 'gok.md'), md.join('\n') + '\n');
fs.writeFileSync(path.join(kl, 'gok_sayi.txt'), String(yeni.length));
console.log(md.join('\n'));
