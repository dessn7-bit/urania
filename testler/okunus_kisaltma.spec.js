'use strict';
/* Sesli okumada açılmadan kalan kısaltma, birim ve sembol denetimi (denetim 2026-10-30, A3-04…A3-11, A7-13).
   Sesli okunan bütün metinler okunus.js'ten geçirilir: dersler (veri/dersler.json'daki bütün metin alanları: başlık,
   özet, bölüm başlığı, paragraf, örnek, aklında kalsın, formül, anahtar sayı, sözlük, soru, deftere notu), deneyler
   (veri/deney_rehber.json, veri/deney/*.json, veri/deney_veri.json), haberler (veri/haberler.json) ve çizimlerin
   sözlü anlatımı (cizim_*.js kayıtlarının baslik + aciklama alanı; cizim.js figcaption data-ses bunu okur).
   Okunuşta kalan şunlar "bilinmeyen" sayılır:
     · büyük harf ya da karışık harf dizgisi (NASA, eV, NIRCam …) — izin listesinde yoksa,
     · sayıdan sonra birim benzeri kısaltma (eV, GHz, mSv …) — açılmadıysa,
     · noktalı kısaltma (vd., ark., ort., St. …),
     · çevrilmemiş sembol, üst simge, μ / µ, Türkçe ve İngilizce dışı harf (izinli yabancı ad harfleri hariç).
   İzin listesinin dışında kalan HER yeni kısaltma testi kırmızıya çevirir; hepsi tek iletide listelenir.
   Yeni bir kısaltma çıkarsa: ya okunus.js'te aç (birimse BIRIM'e ekle) ya da gerekçesiyle aşağıdaki listeye koy.
   Bu dosya tarayıcı açmaz: çizim kayıtları Node'da vm ile yüklenir. */
const { test, expect } = require('@playwright/test');
const vm = require('vm'), fs = require('fs'), path = require('path');
const KOK = path.join(__dirname, '..');
const { okunus } = require('../okunus.js');

/* ---------------- izin listesi (gerekçeli) ---------------- */
/* 1. Özel ad kısaltmaları: kurum, uzay görevi, teleskop, alet, deney, gözlem programı, katalog, veri sürümü, yayın,
      site ve ürün adları ile yerleşik bilim kısaltmaları (CMB, WIMP, MOND, QED …). Türkçe karşılığı olmayan özel addır;
      konuşma motoru bunları harf harf ya da sözcük gibi okur, metinde de böyle geçer (NASA'nın, ESA'ya). Açılmaz. */
const OZEL_AD = [
  'AAS AAVSO AB ACS ACT ADMX ADONIS AGB AGN ALH ALHA ALMA ALPHA ALPO AM AME AMNH AMPS ANAIS AP APEX APIN APM',
  'APOD APOGEE APS ARAS arXiv ASAS ASASSN ASLA AT ATERUI ATLAS BAA BAO BAV BBC BBN BD BELA BepiColombo BGS BH',
  'BICEP BIPM BL BOOMERanG CAI CAM CaSSIS CCAPP CCC CCD CDF CDM CelesTrak CERN CF CfA CFT CGPM CHARA CHIME',
  'CHNOPS CIPA CMa CMB CMOS CMP CMS CMSA CNEOS CNES CNN CNO COBE CODATA CoolCosmos CoRoT COS COSINE COSTAR COVID',
  'CP CrB CS CSIRO CTech CTX CV DAMA DART DASI DAVINCI DEBASS DECam DES DESI DESY DeWitt dF DFSZ DLR DMR DMS DNA',
  'DNGR DOE DPS DR DSCOVR DSHARP EarthSky EBSCO ECK ED EDGES EDR EEFIT EET EETA EH EHT ELODIE ELT EnVision EPR',
  'EPTA ER EROS eROSITA ES ESA ESO ESRF ETH EVN EX ExoClock ExoMars eXploration eXtreme FAST FDA FIRAS',
  'FitzGerald FLIP FOTON FR FRB FU FUSE GFZ GGD GianFranco GLIMPSE GMR GN GOES GoTo GPS GR GRAVITY GRB GRS GS',
  'GSMArena GTO GW GWTC HARPS HAWC HD HDE HE HED HH HII HIP HiRISE HL HMS HS HWO HyperPhysics IAC IAEA IAF IAU',
  'ICE IceCube IDEFIX IERS IKAROS IllustrisTNG IM IMB IMO INAF InPTA InSight IntCal INTEGRAL IPAC IPEM IPGP IPTA',
  'IRAM IRAS iROSA ISEE ISO ISON ISRO ISS ITER IVA JADES JANUS JAXA JCMT JHUAPL JMC JMU JPEG JPL JTA JUICE JUNO',
  'JWST KAGRA KamLAND KATRIN KBO KIT KKLT KM KSVZ LAMBDA LAP LAT LBT LEO LGM LHAASO LHC LHCb LIBRA LightSail',
  'LIGO LINK LISA LiteBIRD LL LLNL LOFAR LOLA LORRI LQC LRD LRO LSST LUCI LZ MACHO MACS MacTutor MAGIC MASS MAT',
  'MAVEN MAXIMA MeerKAT MeerTRAP MEGANE MEO MESSENGER MGS MICADO MICROSCOPE MIRI MIRS MIT MK MMX MODS MOLA MoM',
  'MOND MPC MPIA MPO MRO MS MSR MTM MTY MUL NACO NANOGrav NAOJ NASA NCGR NEAR NEAT NEOWISE NEST NeT NGC ngVLA',
  'NHM NICER NIF NIRC NIRCam NIRSpec NIST NMR NMW NOAA NOIRLab NPF NSF NSSDCA NSTAR NuSTAR NWA OGLE OJ OPCUG',
  'OpenNGC OSIRIS OSSOS PAL PandaX PASA PBS PC PDG PDS PET PetaPixel PhotographyLife PhotographyTalk PLATO PNAS',
  'POLARBEAR PPTA PRD PRIS PRL PSR PST QB QBism QED RAD RAW REBOUND RECONS RELIKT REx RFI RFP RMG RNA ROSINA RSA',
  'RX SAHA SAO SARAS SATCON SBa SBb SBc ScienceAlert ScienceDaily ScienceNordic SCl SDSS SEDS SETI SGR SgrA',
  'SHARAD SI SIDC SILSO SIMBAD SIMBIO SL SLAC SLS SM SN SNC SNEWS SNO SNR SOFIA SOHO SpacePolicyOnline SpaceX',
  'SPARC SPHERE SPHEREx SPI SPT SQM SSS StarDate STARE STARRS STEREO STIS STM STS STScI SwRI SYK SYS TAI TDV TES',
  'TESS TeVeS TexasTech TG TGO TK TM TNG TNO TNT TOCO TOI TON TOV TRAPPIST TV TXS TYC UA UCAR UCLA UHZ UMa UNLV',
  'UNSCEAR USGS USNO UT UTC UVES VERITAS VISTA VLA VLBA VLBI VLT VLTI VP VSX VVER WASP WD WFC WFI WFPC WGS WGSN',
  'WIMP WISE WISPIT WMAP WorldAtlas XDF XENON XENONnT XL XLZD XMM XRISM XTE XXL YR ZHR ZTF'
];
/* 2. Türkçe kurum, kurum içi birim, yasa ve araç kısaltmaları (TÜBİTAK, TUA, RG = Resmî Gazete, BKK = Bakanlar Kurulu
      Kararı, TSİ = Türkiye saati …): Türkçe ses motoru Türkçe kısaltmayı harf adlarıyla doğru okur. */
const TURKCE = 'ABD AFAD ASELSAN AYAP BİLSAT BKK BKL BM BT DAG GÖKTÜRK İMECE KAF RASAT RG RTT SARIÇİÇEK TAEK TRT TSİ TUA TUG TÜBİTAK TÜRKSAT TUSAŞ UUİ UZAY YT YYZ';
/* 3. Formül değişkenleri (GM = G çarpı M, MR, HA = saat açısı, ZD = zaman denklemi, kT, lP / tP / mP Planck
      ölçekleri, dM / dN türevler, pH, AdS / dS uzay-zaman adları): tek tek harf okunması doğrudur. */
const FORMUL = 'dM dN dS EP GM GP gR GT HA HR kT LM lP MB mP MR tH tP YP ZD pH AdS';
/* 4. Harf dizileri: değişen yıldız adlandırması (RR, SS, ZZ, AA … QZ) ve olasılık örneğindeki yazı-tura dizileri (YYTT …). */
const DIZI = 'AA QZ RR RS RZ SS SZ ZZ TTYY TYTY TYYT YTTY YTYT YYTT';
/* 5. Kimyasal formül parçaları (alt simge rakamı ayrılınca: NH₃ → "NH 3", H₂SO₄ → "SO 4"): harf harf okunur. */
const KIMYA = 'CH CN CO HCl MgF MgSiO NH SH SiO SO';
/* 6. Vurgu için büyük harfle yazılmış Türkçe sözcükler (Hubble'ın plakasındaki "VAR!" dâhil): sözcük olarak okunur. */
const VURGU = 'AÇIKLIĞA GÖRÜLMEDİ OKLAR VAR';
/* 7. Deney verisindeki kod notu ("uygulama.js VARSAYILAN KONUM"; veri notu, sesli okunmaz). */
const KOD = 'KONUM VARSAYILAN';
/* 8. Kural: Roma rakamları (Kepler II, Popülasyon III, XV. Louis; denetim askıda: motor cihazda dinlenmedi) ve İskoç / İrlanda
      soyadları (McKinnon, McNaught …). */
const ROMA = /^(?:[IVX]+[ab]?|II[AB])$/;
const SOYADI = /^Mc[A-Z]/;
const IZIN = new Set([...OZEL_AD, TURKCE, FORMUL, DIZI, KIMYA, VURGU, KOD].join(' ').split(/\s+/).filter(Boolean));

/* Birim benzeri: sayıdan sonra kalan ve Türkçe sözcük olarak doğru okunan birim adları */
const BIRIM_IZIN = new Set(['bar', 'erg', 'bit']);
/* Yabancı özel adlardaki harfler (Mohorovičić, Ørsted, Złośnik, Hiʻiaka, raʾs al-ghūl …): motor adın kendi
   harfini okur ya da atlar; ad olduğu gibi kalır. Türkçe ve İngilizce dışı harf ancak buradaysa geçer. */
const YABANCI_HARF = new Set([...'ÀÁÂÄÅÆÈÉÊËÌÍÏÑÒÓÔÕØÙÚÝàáãäåæèéêëìíïñòóôõøùúýÿāăąćčďēėęěğīıľłńňōőœřśšşţťūůűźżžṢʻʾḤḥṣṭẓ']);

/* ---------------- sesli okunan metinler ---------------- */
/* Okunmayan / metin olmayan alanlar: kimlikler, adresler, tarih ve tür etiketleri, kaynak listeleri, renk ve CSS seçicileri */
const ATLA = new Set(['id', 'kid', 'url', 'kaynak_url', 'tarih', 'eklenme', 'tur', 'kesinlik', 'ilgili_dersler', 'unite', 'on_bilgi',
  'kaynaklar', 'kaynak', 'kredi', 'lisans', 'ham', 'renk', 'sekil', 'dogru', 'guncelleme', 'sec', 'zemin',
  'dersler', 'ders']);   // dersler / ders: deney kayıtlarındaki ders kimliği listeleri (bağlantı, okunmaz)
function topla(o, yol, out) {
  if (typeof o === 'string') { if (!/^(https?:|#)/.test(o)) out.push([yol, o]); return; }
  if (Array.isArray(o)) o.forEach((x, i) => topla(x, yol + '[' + i + ']', out));
  else if (o && typeof o === 'object') Object.keys(o).forEach(k => { if (!ATLA.has(k)) topla(o[k], yol + '.' + k, out); });
}
function metinler() {
  const out = [];
  const oku = f => JSON.parse(fs.readFileSync(path.join(KOK, f), 'utf8'));
  oku('veri/dersler.json').dersler.forEach(d => topla(d, d.id, out));
  topla(oku('veri/deney_rehber.json'), 'deney_rehber', out);
  fs.readdirSync(path.join(KOK, 'veri/deney')).filter(f => f.endsWith('.json')).forEach(f => topla(oku('veri/deney/' + f), 'deney/' + f, out));
  topla(oku('veri/deney_veri.json'), 'deney_veri', out);
  oku('veri/haberler.json').haberler.forEach(h => topla(h, 'haber:' + h.id, out));
  /* çizimler: cizim.js altyapısı + bütün cizim_*.js kayıtları; sesli okunan = "Şekil n: baslik. aciklama" */
  const ctx = {}; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(KOK, 'cizim.js'), 'utf8'), ctx);
  fs.readdirSync(KOK).filter(f => /^cizim_.*\.js$/.test(f)).forEach(f => vm.runInContext(fs.readFileSync(path.join(KOK, f), 'utf8'), ctx));
  Object.values(ctx.UraniaCizim.kayit).forEach(c => out.push(['çizim:' + c.id, c.baslik + '. ' + c.aciklama]));
  return out.map(([yer, m]) => [yer, m, okunus(m)]);   // [yer, kaynak metin, okunuş]
}

/* Okunuşta kalan bilinmeyenler: { "tür: dizgi": [ilk 2 yer] } */
function bilinmeyenler(liste) {
  const b = {};
  const yaz = (k, yer, o, i) => { const a = (b[k] = b[k] || []); if (a.length < 2) a.push(yer + ' … ' + o.slice(Math.max(0, i - 30), i + 40)); };
  liste.forEach(([yer, , o]) => {
    /* büyük / karışık harf dizgileri */
    for (const t of o.matchAll(/[\p{L}\d]+/gu)) {
      for (const r of t[0].matchAll(/[A-Za-zÇĞİÖŞÜçğıöşü]+/g)) {
        const s = r[0];
        if (s.length < 2 || !(/[A-ZÇĞİÖŞÜ]{2}/.test(s) || /[a-zçğıöşü][A-ZÇĞİÖŞÜ]/.test(s))) continue;
        if (IZIN.has(s) || ROMA.test(s) || SOYADI.test(s)) continue;
        yaz('kısaltma: ' + s, yer, o, t.index);
      }
    }
    /* sayıdan sonra birim benzeri kısaltma (tek büyük harf hariç: tayf sınıfı, değişken, ad) */
    for (const t of o.matchAll(/\d\s?((?:[pnμmcdhkMGTPE])?(?:eV|Hz|Pa|Sv|Gy|Wb|Jy|as|pc|bit|bar|erg|mol|rad|mag|[sgmWJKNVAB]))(?![\p{L}\d])/gu)) {
      if (t[1].length >= 2 && !BIRIM_IZIN.has(t[1])) yaz('birim: ' + t[1], yer, o, t.index);
    }
    /* noktalı kısaltma */
    for (const t of o.matchAll(/(?<![\p{L}])(vd|ark|ort|St|Dr|Prof|bkz|örn|ör|vb|vs|yy)\.(?=\s|$)/gu)) yaz('kısaltma: ' + t[0], yer, o, t.index);
    /* sembol, üst simge, μ, yabancı harf */
    [...o].forEach((ch, i) => {
      if (/[μµ⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿᴺ½¼¾]/.test(ch) || !/[\p{L}\p{N}\s.,;:!?()'"’‘“”…%\-–—]/u.test(ch)) yaz('sembol: ' + ch, yer, o, i);
      else if (/\p{L}/u.test(ch) && !/[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]/.test(ch) && !YABANCI_HARF.has(ch)) yaz('harf: ' + ch, yer, o, i);
    });
  });
  return b;
}

let LISTE;
test.beforeAll(() => { LISTE = metinler(); });

test('Sesli okunan metinlerin hepsi toplanır (ders, deney, haber, çizim)', () => {
  const tur = { ders: 0, deney: 0, haber: 0, cizim: 0 };
  LISTE.forEach(([y]) => { if (/^d\d/.test(y)) tur.ders++; else if (/^deney/.test(y)) tur.deney++; else if (/^haber/.test(y)) tur.haber++; else if (/^çizim/.test(y)) tur.cizim++; });
  expect(tur.ders).toBeGreaterThan(10000);
  expect(tur.deney).toBeGreaterThan(200);
  expect(tur.haber).toBeGreaterThan(100);
  expect(tur.cizim).toBeGreaterThan(100);
});

test('Okunuşta izin listesi dışında kısaltma, birim, sembol kalmaz (hepsi tek iletide)', () => {
  const b = bilinmeyenler(LISTE);
  const ileti = Object.keys(b).sort().map(k => k + '  ←  ' + b[k].join('  |  ')).join('\n');
  expect(Object.keys(b).length, 'Açılmamış ' + Object.keys(b).length + ' kısaltma / sembol:\n' + ileti).toBe(0);
});

test('İzin listesinde artık kullanılmayan kısaltma birikmez', () => {
  /* Metinden çıkan kısaltma listede kalırsa liste şişer ve yanlışlıkla izin verir: kullanılmayanlar listelenir */
  const kullanilan = new Set();
  LISTE.forEach(([, , o]) => { for (const r of o.matchAll(/[A-Za-zÇĞİÖŞÜçğıöşü]+/g)) kullanilan.add(r[0]); });
  const fazla = [...IZIN].filter(k => !kullanilan.has(k));
  expect(fazla, 'Metinde artık geçmeyen izinler: ' + fazla.join(' ')).toEqual([]);
});

test('Okunuşta ders dosya kimliği (d20, d12\'ye …) kalmaz', () => {
  /* Kaynakta başka derse gönderme dosya kimliğiyle yazılır; derleyici (araclar/ders_verisi_v2.py) sıra numarasına çevirir.
     Bu alt denetim veri/dersler.json yeniden derlenince geçer. */
  const kalan = [];
  LISTE.forEach(([yer, , o]) => {
    /* "d3-celestial" (kütüphane adı) dosya kimliği değil */
    for (const t of o.matchAll(/(?<![\p{L}\d])d\d{1,2}(?![\p{L}\d]|-celestial)/gu)) kalan.push(yer + ' … ' + o.slice(Math.max(0, t.index - 25), t.index + 15));
  });
  expect(kalan.length, 'Okunuşta dNN kalan ' + kalan.length + ' yer:\n' + kalan.slice(0, 60).join('\n')).toBe(0);
});

/* Denetimdeki örnek cümleler: okunuş beklenen biçimde */
test('A3-04…A3-11 okunuş örnekleri', () => {
  [
    /* A3-04 bilimsel gösterim; tek başına e⁻ yine elektron */
    ['e⁻²·⁵ ≈ 0,082, e⁻²⁵ ≈ 1,4 × 10⁻¹¹.', 'e üzeri eksi 2,5 yaklaşık 0,082, e üzeri eksi 25 yaklaşık 1,4 çarpı 10 üzeri eksi 11.'],
    ['kabaca e⁻⁴⁰⁷ ile orantılıdır', 'kabaca e üzeri eksi 407 ile orantılıdır'],
    ['bir e⁻ ve bir e⁺', 'bir elektron ve bir pozitron'],
    /* A3-05 üs dizisi ve ondalık */
    ['(1 − 0,00135)²⁰ ≈ 0,973', '(1 eksi 0,00135) üzeri 20 yaklaşık 0,973'],
    ['yoğunluk 2¹·⁵ ≈ 2,83 katına; 2⁻⁰·⁶ ≈ 0,66', 'yoğunluk 2 üzeri 1,5 yaklaşık 2,83 katına; 2 üzeri eksi 0,6 yaklaşık 0,66'],
    ['10²⁰ kat', '10 üzeri 20 kat'],
    /* A3-07 formül işaretleri */
    ['1/λ⁴', '1 bölü lambda üzeri 4'],
    ['⁴√2 ≈ 1,19', 'dördüncü kök 2 yaklaşık 1,19'],
    ['(1 − p)ᴺ', '(1 eksi p) üzeri N'],
    ['S = k·A/(4ℓ²)', 'S eşittir k A bölü (4l kare)'],
    ['τ = P/2Ṗ', 'tau eşittir P bölü 2 P nokta'],
    ['½ × m × v²; T½ = 5730 yıl; 1½ saat', 'bir bölü iki çarpı m çarpı v kare; yarılanma ömrü eşittir 5730 yıl; 1 buçuk saat'],
    ['(ħ² / 2mr²)', '(h bar kare bölü 2mr kare)'],
    /* A3-06 birimler; birim içindeki μ "mikro"; G, T yalnız sayıdan sonra ve ad değilse */
    ["13,6 eV gerekir; 550 keV'tur; 10¹⁹ GeV'dir; 290 TeV; 1 peV; 5 μeV", '13,6 elektronvolt gerekir; 550 kilo elektronvolttur; 10 üzeri 19 giga elektronvolttur; 290 tera elektronvolt; 1 piko elektronvolt; 5 mikro elektronvolt'],
    ['115 GHz; 330–360 GPa; 1013,25 hPa; 0,9 kPa', '115 gigahertz; 330 ile 360 gigapaskal; 1013,25 hektopaskal; 0,9 kilopaskal'],
    ["22–67 μT; MR 1,5 ile 3 T'dir; 3000 G (0,3 T)", '22 ile 67 mikrotesla; MR 1,5 ile 3 tesladır; 3000 gauss (0,3 tesla)'],
    ['G yıldızı; 2 G türü; T Tauri; SPT-3G; XENON1T; 1803 L\'Aigle', "G yıldızı; 2 G türü; T Tauri; SPT-3G; XENON1T; 1803 L'Aigle"],
    ['7,2 μs/gün (7214 ns); 1,4 ms', '7,2 mikrosaniye bölü gün (7214 nanosaniye); 1,4 milisaniye'],
    ['1,01 Sv; 500 MW; 90 mg; 5556 Å\'daki; 43,9 µas; 287,18 mas; 13,9 Gpc', '1,01 sievert; 500 megavat; 90 miligram; 5556 angstromdaki; 43,9 mikro yay saniyesi; 287,18 mili yay saniyesi; 13,9 gigaparsek'],
    ['5,67 × 10⁻⁸ W/(m² K⁴); foton/(cm² · s · Å)', '5,67 çarpı 10 üzeri eksi 8 vat bölü (metre kare kelvin üzeri 4); foton bölü (santimetre kare çarpı saniye çarpı angstrom)'],
    ['4,1357×10⁻¹⁵ eV·s; 4,41 J/kalori; 9340 ppm', '4,1357 çarpı 10 üzeri eksi 15 elektronvolt saniye; 4,41 jul bölü kalori; milyonda 9340'],
    ["357000 km'deyken; 6,25 GB'ı; 12 MP", '357000 kilometredeyken; 6,25 gigabaytı; 12 megapiksel'],
    ["ζ Tau'nun 1° KB'si; Ülker'in 5,4° GD'su", 'zeta Tau\'nun 1 derece kuzeybatısı; Ülker\'in 5,4 derece güneydoğusu'],
    /* A7-13 */
    ['(T☉ = 5772 K); (φ − δ☉); ρ/ρ⊕', '(Güneş sıcaklığı eşittir 5772 kelvin); (fi eksi delta Güneş); ro bölü ro Dünya'],
    /* A3-10 kısaltmalar */
    ['Falchi ve ark. 2016; Caleb vd., 2026; ort. 3682 metre; St. Petersburg; (ör. 15 Ekim)', 'Falchi ve arkadaşları 2016; Caleb ve diğerleri, 2026; ortalama 3682 metre; Saint Petersburg; (örneğin 15 Ekim)'],
    ['Almagest (~MS 150)', 'Almagest (yaklaşık milattan sonra 150)'],
    /* A3-11 geçiş oku ve ">" + çarpan */
    ['Lyman (n→1, morötesi)', "Lyman (n'den 1'e, morötesi)"],
    ['Sera: 255 → 288 K', "Sera: 255'ten 288 kelvine"],
    ['1917: 15 Şubat 1332 → 1 Mart 1333 (13 gün).', "1917: 15 Şubat 1332'den 1 Mart 1333'e (13 gün)."],
    ['7×50 → 50 / 7 ≈ 7,14 mm', '7 çarpı 50, yani 50 bölü 7 yaklaşık 7,14 milimetre'],
    ['>1,2 milyon parça; >10 milyar yaş; >3 trilyon', '1,2 milyondan fazla parça; 10 milyardan fazla yaş; 3 trilyondan fazla']
  ].forEach(([g, c]) => expect(okunus(g), g).toBe(c));
});
