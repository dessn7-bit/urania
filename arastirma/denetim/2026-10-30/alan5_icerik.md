# Alan 5 — İçerik tutarlılığı ve kaynak bağlantıları (Urania v39 denetimi, 2026-10-30)

## Okunan dosyalar

Bu alanda dosyalar satır satır okunmadı (görev tanımı: "betikle tara, eşleşmeleri bağlamıyla sen değerlendir"; Türkçe metnin kelime kelime okunması başka ajanlarda). Aşağıda her dosyanın NASIL tarandığı yazılıdır.

| dosya | satır | tamamı okundu mu |
|---|---|---|
| veri/dersler.json | 38.545 | HAYIR (satır satır). Bütün dizgi alanları (27.638 dizgi, tüm dosyalarla birlikte) betikle çıkarıldı; konu başına düzenli ifadeyle tarandı, her eşleşme bağlamıyla (±60–150 karakter) elle değerlendirildi. Elle tam okunan kesitler: 270–290 (d1 kadir bölümü), 22136–22146 (d7 Yay Cüce bölümü ve örneği). |
| veri/haberler.json | 1.460 | HAYIR. Betikle tarandı (sayısal konular + bütün URL'ler). |
| veri/deney_rehber.json | 1.700 | HAYIR. Betikle tarandı; 1570–1665 (hubble deneyi) elle okundu. |
| veri/deney/*.json (10 dosya: analemma 97, astrofoto 375, durbun 1 satır/62 KB, eratosthenes 219, hohmann 113, mevsim 100, ortme 341, paralaks 245, roket 129, yasanabilir 410) | 2.030 | HAYIR. Betikle tarandı (dizgiler + URL'ler). |
| veri/fizik.json | 412 | HAYIR. Betikle tarandı. |
| veri/sinavlar.json | 3.050 | HAYIR. Betikle tarandı (sayısal konular; sonuç listelerinde sınav eşleşmeleri ayrıca gözden geçirildi). |
| arastirma/dersler_v2/dNN_kaynak.md (58 dosya) | 14.056 | HAYIR. Bütün "iddia \| URL \| kaynaktaki ifade" satırları (3.267 satır) betikle ayrıştırıldı; işaretlenen 265 satır elle okundu. d13 116/221, d14 200, d2 320/326, d30 168/194, d33 5 satırları elle okundu. |
| arastirma/dersler_v2/dNN.json (58 ders) | 40.591 | HAYIR. Yalnız bulguların kaynak satırını bulmak için arandı. |

## Yöntem

Bütün betikler ve ara çıktılar: `C:\Users\Kaan\AppData\Local\Temp\claude\C--Users-Kaan-brewmaster\739d0876-7497-43d3-a626-bdcb804140cf\scratchpad\denetim\a5\`. Depoda hiçbir dosya değiştirilmedi, depodaki hiçbir betik çalıştırılmadı.

- **korpus.py**: veri/dersler.json, haberler.json, deney_rehber.json, fizik.json, sinavlar.json ve veri/deney/*.json içindeki bütün dizgileri (27.638) dosya:satır + ders kimliğiyle `korpus.json`'a döktü. **ara.py** (düzenli ifade + bağlam) ve **deger.py** (yakalanan değeri tekilleştirip yer listesiyle döker) bu korpus üzerinde çalıştı.
- **A (tutarlılık)**: görevde sayılan her büyüklük için ayrı düzenli ifadeyle değerler yan yana döküldü (evren yaşı, Güneş yaşı/kalan ömür, H0 ve Hubble zamanı, Samanyolu çap/kalınlık/yıldız sayısı/kütle, R0 ve galaktik yıl, Andromeda, c, AB, pc, ışık yılı, Ay uzaklığı ve uzaklaşması, Güneş yüzey/çekirdek/taç sıcaklığı, kütle/yarıçap/L, gezegen-uydu-cüce gezegen sayıları, Chandrasekhar, TOV, KMA, Ω'lar, Sirius/Vega/Polaris/Venüs/Jüpiter/Mars/dolunay/Güneş/Andromeda/Betelgeuse kadirleri, ötegezegen sayısı, Dünya yaşı, ISS yüksekliği, Proxima, Dünya/Ay yarıçapı). Her farklı değer bağlamıyla okundu.
- **A (ek)**: **capraz.py / capraz2.py**: derlenmiş metindeki "N. ders" ve "(dNN)" göndermelerini ORTAK.md'deki ders sırasıyla karşılaştırdı (1.101 gönderme); geçmiş zaman kipiyle sonraki bir derse gönderenler ayıklandı.
- **B (URL)**: **urller.py** depo verisinden ve 58 dNN_kaynak.md'den 2.039 tekil URL topladı (parantez dengeli). **kontrol.py**: en.wikipedia.org (590) MediaWiki API ile 50'şerli toplu sorgu (yönlendirme/eksik sayfa tespiti); öteki 1.449 URL tek iş parçacığı, sıralı HEAD (≥400'de GET), yönlendirmeler elle izlendi; aralık ≥0,55 s (arxiv.org için 3 s), User-Agent `urania-denetim/1.0`, e-posta yok; celestrak.org atlandı (4 URL); 403/429/bot sayfası → erişilemedi, atlatma denenmedi. API'de bozulan 90 Wikipedia başlığı **wiki_tekrar.py** ile 20'şerli yeniden sorgulandı. Sonuç: `sonuc_son.csv`. Sayfa içeriği okunmadı (yalnız durum kodu ve yönlendirme hedefi).
- **C (iddia ↔ kaynak)**: **iddia.py / iddia2.py**: 58 dNN_kaynak.md'deki 3.267 "iddia | URL | ifade" satırı ayrıştırıldı ([H]/HESAP satırları hariç 3.213). İddia sütunundaki sayılar (Türkçe biçim) hem kaynaktaki ifadedeki sayılarla (İngilizce + Türkçe biçim, %2 tolerans, mil/km, pc/ışık yılı, K/°C, 10ⁿ dönüşümleri) hem de ilgili dNN.json ders metnindeki sayılarla (%3 tolerans) karşılaştırıldı. Yıllar, sıra numaraları, katalog adları (HD/NGC/PSR…) ve "DÜZELTME/DOĞRULAMA" kayıt satırları süzüldükten sonra kalan 166 + 99 satır elle okundu.

## Bulgular

### A5-01 · ÖNEMLİ · d34.json:34 ve 75 yer daha (tam liste Ek A)
- Açıklama: Kaynak dNN.json dosyalarında "d9'da gördüğün gibi", "d17'deki" gibi yazılan göndermeler derlemede sıra numarasına çevriliyor ("9. derste gördüğün gibi"). Ders sırası değiştiği için 18 derste toplam **76 gönderme**, okurun henüz okumadığı **sonraki** bir derse geçmiş zamanla ("gördüğün gibi", "dersteki", "gördün", "tanıştın", "kullandığımız") işaret ediyor. En yoğun: d34 (#8) 11 kez d9 (#9), d10 (#11), d19 (#20)'u "gördüğün" diye anıyor; d58 (#37) 8, d48 (#34) 7, d46 (#31) 7, d36 (#14) 7 kez. Örnek: d34 (sırada 8.) "9. derste gördüğün gibi Güneş yaklaşık 4,6 milyar yıl önce…" (dersler.json:5197); d40 (#18) "Europa'nın yeraltı okyanusunu ve Europa Clipper görevini 42. derste gördün" (dersler.json:11757); d47 (#32) "Evrenin yaşı yaklaşık 13,8 milyar yıl olduğuna göre (d8)" — d8 sırada 38. Sırayla ilerleyen öğrenci için metin yanlış önbilgi varsayıyor; bazı yerlerde ("9. dersteki NASA değerlerini topla", d34.json:41) örnek, henüz verilmemiş sayılarla çözdürülüyor.
- Kanıt: `python capraz.py` (sıra listesi ORTAK.md'den) → 1.101 gönderme, 284'ü ileri; geçmiş zaman süzgeciyle 74 + `capraz2.py` ile 2 "(dNN)" = 76. Kaynakta biçim: `grep -n "d9'da gördüğün gibi Güneş" arastirma/dersler_v2/d34.json` → 34. satır.
- Önerilen düzeltme: Bu 76 yerde ya cümleyi ileri zamana çevir ("9. derste göreceğin…") ve gereken sayıyı derste ver, ya da sıralamayı gözden geçir. Derleyiciye (ders_verisi_v2.py) "geçmiş zamanlı gönderme hedefin sırası > bu dersin sırası" denetimi eklenebilir.

### A5-02 · ÖNEMLİ · d7.json:134 (dersler.json:22145) — Yay Cüce örneğinde yanlış geometrik açıklama
- Açıklama: Örnek, Güneş–merkez 26.700 ışık yılı ve Yay Cüce'ye uzaklık 80.380 ışık yılı ile "aynı doğrultuda olsaydı merkezden uzaklığı 53.700 olurdu; kaynak 50.000 diyor; birebir tutmamaları beklenir, çünkü cüce galaksi tam olarak aynı doğrultuda değil" diyor. Bu açıklama ters: üçgen eşitsizliğine göre merkezden uzaklık **en az** |80.380 − 26.700| = 53.680 ışık yılıdır; doğrultu dışına çıkmak bu değeri yalnız **büyütür**. Kaynaktaki iki yuvarlak sayı (80.380 ve "about 50,000") birbiriyle geometrik olarak bağdaşmıyor; fark doğrultuyla açıklanamaz. Sayılar kaynağa sadık (d7_kaynak.md:297), hatalı olan açıklama cümlesi. Bilimsel akıl yürütme hatası öğretildiği için önemi yüksek.
- Kanıt: d = |r⃗_G − r⃗_☉|; |a − b| ≤ |a⃗ − b⃗| ≤ a + b → d_merkez ≥ 80.380 − 26.700 = 53.680 > 50.000. Kaynak: https://en.wikipedia.org/wiki/Sagittarius_Dwarf_Spheroidal_Galaxy ("about 80,380 light-years from Earth" ; "about 50,000 light-years from the core", d7_kaynak.md:297).
- Önerilen düzeltme: "Doğrultu dışına çıkmak merkez uzaklığını büyütür; iki sayının bağdaşmaması kaynaktaki yuvarlamadan/farklı ölçümlerden gelir" biçiminde düzeltmek; mümkünse iki sayıyı aynı çalışmadan almak.

### A5-03 · ÖNEMLİ · ölü kaynak bağlantıları (21 URL; 18'i uygulamada görünen ders/deney kaynağı)
- Açıklama: Aşağıdakiler 404/410 döndü (HEAD ve GET), 5 tanesinin alan adı çözülmüyor. Uygulamada görünenler (veri/…):
  - 404: apex.asteroidmission.org/preview/About/About_Apophis.html (d19; dersler.json:13194) · astronomics.com/limiting-magnitude_t.aspx (d12 dersler.json:3699; deney/durbun.json) · cdn.tua.gov.tr/69a52468589f6.pdf (d23; 15597) · dictionary.obspm.fr/terms/birunis-method/ (d20; 27378) · …/critical-density/ (d17; 26813) · …/eratosthenes-method/ (d20 27093, 27342; deney/eratosthenes.json:145,165,199) · …/initial-mass-function-imf/ (d14; 16667, 16985) · dunlap.utoronto.ca/coolcosmos/bigbang.php (d8; 26030) · grahamfarmelo.com/?p=1293 (d53; 37909) · home.cern/news/series/cern70/cern70-announcing-higgs-boson-discovery (d32; 34001, 34255) · repository.ias.ac.in/55225 (d57; 24352, 24595) · slittlefair.staff.shef.ac.uk/teaching/phy241/lectures/l03 (d12; 3583) · spaceflight101.com/spacerockets/?p=1457 (deney/roket.json:93,101,102,110,123) · www.aavso.org/index.php/node/74419 (d15; 18646) · www.iaa.es/node/12759 (d42; 13983, 14251) · www.imo.net/resources/calendar/ (d22/d19; 8710, 13164, 13512) · lickobservatory.org/…/the-lick-observatory-eclipse-expeditions-… (d26; 31276)
  - 410: newatlas.com/space/reservoir-salty-water-found-ceres-dwarf-planet (d41; 12529, 12823)
  - Alan adı yok (DNS): digfir-published.macmillanusa.com/universe10e/… ×3 (d38 11116, d7 22651, d20 27418) · exploration.jsc.nasa.gov/…/Comets_Lithograph_h.pdf (d19; 13492) · m.esa.int/Newsroom/…Euclid_lifts_off… (d50; 34634, 34927)
  - Yalnız kaynak.md'de: blogs.esa.int/access/?p=128 (d23_kaynak.md:260), rallypoint.com/shared-links/michael-faraday-s-generator (d33_kaynak.md:69), www.imo.net/calendar/2024 (d19_kaynak.md:88)
- Kanıt: `sonuc_son.csv` (sütun durum/zincir), örn. `https://dictionary.obspm.fr/terms/eratosthenes-method/,olu,404,404g`; `home.cern/...cern70...` zinciri 301>302>404.
- Önerilen düzeltme: Her biri için güncel adres ya da aynı iddiayı taşıyan başka kaynak; DNS'i ölen digfir (Macmillan *Universe* 10e) için yayıncının güncel sayfası ya da başka kaynak.

### A5-04 · ÖNEMLİ · Wikiwand (Wikipedia kopyası) kaynak olarak — d1.json:710, d10.json:331/650, d29.json:295/557, d41.json:249/505, d44.json:274/553/645, d45.json:308/590, d56.json:221/462, d7.json:720
- Açıklama: Kural: Wikipedia yalnız en.wikipedia.org. 9 ders kaynağı wikiwand.com adresi taşıyor (Meridian (astronomy), Supermoon, Rogers Commission, New Horizons, Inner core, Ocean, Magnetar, Wormhole, Starburst galaxy); uygulamada "Wikipedia (Wikiwand)" etiketiyle görünüyor. Bunlardan 5'i bu taramada 403 verdi (erişilemedi).
- Kanıt: `grep -n wikiwand arastirma/dersler_v2/d*.json`; dersler.json:850, 6939, 7218, 7310, 7660, 7979, 12499, 12755, 19655, 19937, 22731, 32845, 33107, 36927, 37168.
- Önerilen düzeltme: Aynı maddelerin en.wikipedia.org adreslerine geçmek ve alıntıları canlı en.wikipedia.org maddesinde yeniden doğrulamak.

### A5-05 · ÖNEMLİ · Wikipedia'nın eski arşiv kopyaları (UNT web arşivi) kaynak olarak — d1.json:762, d2.json:399/781, d26.json:234/502
- Açıklama: webarchive.library.unt.edu üzerinden 2014–2016 tarihli Wikipedia anlık görüntüleri kaynak gösteriliyor: Insolation (2014, d1, dersler.json:902), Andromeda Galaxy (2016, d2, 1308, 1690), Tests of general relativity (2014, d26, 30992, 31260). Kaynak.md'de ayrıca Richard Feynman (2009, d29_kaynak.md:7) ve Meteorite (2013, d43_kaynak.md:6). Bunlar en.wikipedia.org değil, 10 yıldan eski kopyalar; içerik güncel maddeden farklı olabilir.
- Kanıt: URL listesi `urller.csv`; adresler HTTP 200 dönüyor (ölü değil), sorun kaynağın türü.
- Önerilen düzeltme: Canlı en.wikipedia.org maddesine geçmek ve sayıları orada yeniden doğrulamak. (UNT'deki NASA/FDA/NOAA arşiv kopyaları Wikipedia değil, bu bulguya dahil edilmedi.)

### A5-06 · ÖNEMLİ · "IPFS kopyası" etiketli 5 Wikipedia kaynağı — d2.json:720, 736; d5.json:715; d31.json:537; d56.json:481
- Açıklama: Kaynak listesinde "Wikipedia – Speed of light (IPFS kopyası)", "Hydrogen spectral series (IPFS kopyası)", "Metallicity (IPFS kopyası)", "Uranium (IPFS yansısı)", "(IPFS kopyası), GRB 060614" yazıyor (dersler.json:1629, 1645, 17731, 33651, 37187). URL en.wikipedia.org'a gidiyor ama etiket, iddiaların IPFS aynasında (eski Wikipedia anlık görüntüsü) doğrulandığını söylüyor. IPFS kopyaları kural gereği yasak ve eski; d43_kaynak.md:54 bunun somut zararını kayıt altına alıyor ("canlı Wikipedia'da '12.000–13.000 t ilk tahmin' yok; IPFS yansısı eski sürüm"). Ayrıca d33_kaynak.md:5 "IPFS kopyası okundu" diyor.
- Kanıt: `grep -n "IPFS" veri/dersler.json` → 5 satır; `grep -n IPFS arastirma/dersler_v2/d33_kaynak.md d2_kaynak.md d43_kaynak.md`.
- Önerilen düzeltme: Bu 5 kaynağa dayanan iddiaları canlı en.wikipedia.org maddesinde yeniden doğrulamak, etiketten "IPFS" ibaresini kaldırmak.

### A5-07 · ÖNEMLİ · yayıncı dışı sitelerde barındırılan tam metin kopyaları — d30.json:287/543, d5.json:680
- Açıklama: (1) d30 Bérut ve ark. (Nature 483, 2012) makalesini `isidore.co/misc/Physics papers and books/Zotero/storage/2TPWPHS8/nature10872.html` adresinden, yani üçüncü bir kişinin Zotero deposundaki kopyadan veriyor (dersler.json:29280, 29536). (2) d5 (dersler.json:17696) ve d12/d18 kaynak.md'leri Duric, *Advanced Astrophysics* (CUP, 2004) kitabının tam PDF'ini `tevza.org/home/course/PCO2012/…pdf` ders sitesinden veriyor. Her ikisi de yayıncı ya da yazar sayfası değil; kalıcılığı ve yayın izni belgelenmemiş kopyalar (aynı "kopya site" ilkesi).
- Kanıt: `grep -n "isidore.co\|tevza.org" arastirma/dersler_v2/*.json veri/dersler.json`.
- Önerilen düzeltme: DOI (10.1038/nature10872) / yayıncı sayfası; kitap için CUP sayfası ya da bağımsız açık kaynak.

### A5-08 · KÜÇÜK · içeriği değişen yönlendirmeler ve Wikipedia yönlendirmeleri (uygulamada görünenler)
- Açıklama: Bağlantı çalışıyor ama başka sayfaya gidiyor:
  - hunter.cuny.edu/…/15TheKineticTheoryofGasesRev (d30, dersler.json) → s29068.pcdn.co/…/syllabus-physics-110.pdf (ders izlencesi; atıf yapılan ders notu değil).
  - home.cern/resources/faqs/facts-and-fi (d32) → genel LHC sayfası.
  - imagine.gsfc.nasa.gov/science/objects/pulsars1.html (d6) → neutron_stars1.html.
  - starwalk.space/ay/en/tcrb (d6) → başka bir haber sayfası (utm parametreli).
  - Wikipedia yönlendirmeleri (26; 21'i uygulamada): özellikle başka/kapsayıcı maddeye gidenler: Blueshift → Redshift#Blueshift (d17), Gabor limit → Uncertainty principle#Signal processing (d27), Hawking paradox → Black hole information paradox (d52), Timeline of particle physics → Timeline of atomic and subatomic physics (d32), Gregorian year → Gregorian calendar (d22), Kelvin temperature → Thermodynamic temperature (d30), Cosmic acceleration → Accelerating expansion of the universe (d51), Stellar aberration → Aberration (astronomy) (d1); yalnız kaynak.md'de: Io plasma torus → Magnetosphere of Jupiter#Role of Io (d37_kaynak.md:104; dosyanın 183. satırı "URL düzeltildi" diyor ama eski adres 104. satırda kalmış), Von Neumann–Wigner interpretation → Consciousness causes collapse (d27_kaynak.md:123), K/Pg impactor → Chicxulub crater (d43_kaynak.md:6). Tam liste Ek B.
- Kanıt: `sonuc_son.csv` sınıf `wiki-yonlendirme` (MediaWiki API `redirects=1` çıktısı) ve `yonlendirme`.
- Önerilen düzeltme: Hedef adresleri doğrudan yazmak; hunter.cuny kaynağını değiştirmek.

### A5-09 · KÜÇÜK · Wikipedia dışı kopya/başka dil Wikipedia adresleri (yalnız kaynak.md ya da tek ders)
- Açıklama: newworldencyclopedia.org/entry/Photoelectric_effect (Wikipedia türevi ansiklopedi; d2.json:725, dersler.json:1634) · wiki.krisyotam.com/content/wikipedia_en_all_nopic_2026-03/1P/Halley (Kiwix Wikipedia aynası; d19_kaynak.md:222, 264, 265, 267…; 525 hatası verdi) · tr.wikipedia.org/wiki/Orion_Bulutsusu (başka dil Wikipedia; d11_kaynak.md:125, d21_kaynak.md:88) · `https://Wikipedia.com/wiki/High-pressure_area` (d39_kaynak.md:170) ve `https://Www.wikipedia.org/wiki/R/2003_U2` (d39_kaynak.md:14) — en.wikipedia.org'a yönleniyor ama yazım kurala aykırı.
- Kanıt: `urller.csv`.
- Önerilen düzeltme: en.wikipedia.org adresleri.

### A5-10 · KÜÇÜK · d18.json:61 (dersler.json:28259) — "Güneş Sistemi" yaşı yerine Dünya yaşı
- Açıklama: ALH84001 örneği "Kristalleştiğinde Güneş Sistemi 4,54 − 4,091 ≈ 0,45 milyar yaşındaydı" diyor. 4,54 milyar yıl Dünya'nın yaşıdır (d18 kendisi de öyle verir); Güneş Sistemi'nin yaşı uygulamada 4,567 (d34, d9) / 4,5673 (d31) milyar yıldır. Doğru hesap 4,567 − 4,091 ≈ 0,48 milyar yıl. d18_kaynak.md:194 da "(Dünya yaşı USGS satırı)" diye kaynağın Dünya yaşı olduğunu yazıyor.
- Kanıt: d34 dersler.json:5324 "4,567 milyar"; d31 dersler.json:33294 "en eski katılar 4,5673 milyar yıl"; https://en.wikipedia.org/wiki/Age_of_Earth ("4.54 ± 0.05 billion years") ile https://en.wikipedia.org/wiki/Formation_and_evolution_of_the_Solar_System ("4.568 billion years ago") — ikisi farklı büyüklük.
- Önerilen düzeltme: "Güneş Sistemi 4,567 − 4,091 ≈ 0,48 milyar yaşındaydı" ya da "Dünya'nın yaşının (4,54) ≈ 0,45 milyar yıl…" biçiminde öznenin düzeltilmesi.

## A — Tutarlı bulunan büyüklükler (bulgu yok; kısa özet)
| büyüklük | değerler (yerler) | değerlendirme |
|---|---|---|
| Evrenin yaşı | 13,8 milyar yıl (34 yer), 13,797/13,787 (d8, Planck / +BAO), 1,38×10¹⁰ (d52, d55), 1,4×10¹⁰ (d16) | Tutarlı; ayrıntılı değerler kaynağıyla açıklanmış. 14,5 / 13,4 / 13,97 = Hubble zamanı 977,8/H0 (67,4/73/70), metinde açıklanmış. |
| H0 | 67,4 ± 0,5 (Planck), 67,36, 73 / 73,04 ± 1,04 (SH0ES), 70 (d55 yuvarlak), tarihî 625/500/558/100 | Tutarlı; gerilim d17'de açıklanmış, deney_rehber de aynı. |
| Güneş yaşı/kalan ömür | 4,6 / 4,5 / 4,567 / 4,57 milyar yıl; kalan ~5 milyar, toplam ~10 milyar | Yuvarlamayla açıklanır (4,567). |
| Samanyolu | çap 100.000 ışık yılı / 87.400 ± 3.600 (26,8 kpc); ince disk 700–1.500 (718–1.470); 100–400 milyar yıldız (d6'da "kabaca 200 milyar" aralık içinde); kütle 0,58–1,15×10¹², ~10¹² | Tutarlı. |
| R0, galaktik yıl | 26.700 ışık yılı (8.178 pc), 27.000 (ESO yuvarlak); 200–265 / 212 / 230 / 240 milyon yıl | Farklar metinde kaynak kaynak açıklanmış (d7, d47). d47'deki 30.000 tarihsel (Trumpler sonrası). |
| Andromeda | 2,5 milyon ışık yılı = 765 kpc; d49'da 800 kpc (alıştırma varsayımı); Hubble 930.000 (tarihî) | Tutarlı. |
| c, AB, pc, ışık yılı | 299.792.458 m/s (299.792 km/s, 3×10⁸, 2,998×10⁸); 149.597.870.700 m; 3,26/3,2616 ışık yılı, 3,0857×10¹⁶ m; 9,4607×10¹² km | Tutarlı. |
| Ay uzaklığı | 384.400 km; 363.300/405.500 (ortalama yerberi/yeröte), 357.000–407.000 (uçlar), yılda 3,8 cm (haberde "yaklaşık 4 cm") | Tutarlı, ayrım metinde yapılmış. |
| Güneş sıcaklıkları | yüzey 5772 K (etkin), 5780/5800/5770 yuvarlak; çekirdek 15,7 milyon K (d28'de "yaklaşık 15,6"); taç 1–2 milyon K | Yuvarlama sınırında; bulgu sayılmadı. |
| Güneş kütle/yarıçap/L | 1,988(4)×10³⁰ kg; 695.700 km; 3,828×10²⁶ W | Tutarlı. |
| Gezegen/uydu/cüce gezegen | 8 gezegen; Jüpiter 115, Satürn 293, Uranüs 29, Neptün 16, toplam 461 (Ağustos/Ekim 2026 notuyla); 5 cüce gezegen (haber dahil) | Tutarlı (tarih notu var). |
| Chandrasekhar / TOV | ~1,4 M☉ (1,44 hassas); TOV "2 ile 3", ≥2,01–2,08, NASA ~3 | Belirsizlik metinde açıklanmış. |
| KMA | 2,725 / 2,72548 / 2,726 (COBE) / 2,73 / 2,7 K; 3000/1091 ≈ 2,75 K (hesap) | Tutarlı. |
| Ω'lar | %4,9 / %26,4 / %68,5 (Planck 2018), ESA 2013 %26,8 (açıklanmış), KM/SM ≈ 5,4 | Tutarlı. |
| Kadirler | Sirius −1,46, Vega 0,03, Polaris 1,98, Venüs −4,92, Jüpiter ve Mars −2,94, dolunay −12,74, Güneş −26,8 (görünür −26,74 d5), Andromeda 3,44, Betelgeuse 0,0–1,6 / 0,45 | Tutarlı. |
| Ötegezegen sayısı | 2025'te 6.000'i aştı (d13, d44, haber); Kepler 2.600+ | Tutarlı. |
| Dünya yaşı | 4,54 ± 0,05 milyar yıl (her yerde); Patterson 4,55 (tarihî) | Tutarlı (A5-10 dışında). |
| ISS | 415–424 km (Ekim 2026), 420/400 km yuvarlak | Tutarlı. |

## C — İddia ↔ kaynak karşılaştırması: sonuç
3.213 kaynak satırının sayıları betikle karşılaştırıldı; süzme sonrası 265 satır elle okundu. Elle okunanların tamamı şu gruplardan biri çıktı: (a) sayı birim dönüşümü/yuvarlama (ör. "300 million miles" ↔ "~500 milyon km", d41_kaynak.md:66; "0.47 AU" ↔ "71 milyon km", d42_kaynak.md:150), (b) kaynak hücresinde başka satıra/başka kaynak dosyasına gönderme ("d9_kaynak satır 120", "tablo", "WebFetch özeti"), (c) dosyanın kendisinde "DÜZELTME / DOĞRULAMA" olarak zaten kaydedilmiş ve derste düzeltilmiş farklar (ör. Galaxy Zoo 900.000, d7_kaynak.md:339; BKL yaşı, d9_kaynak.md:449; Satürn günü, d9_kaynak.md:451; Cassiopeia A, d6_kaynak.md:120; graviton kütle sınırı, d53_kaynak.md:66; Lehmann 104 yaş, d44_kaynak.md:54), (d) dersin bilerek iki değeri birlikte verdiği yerler (M87 küresel küme 12.000, d7 dersler.json:22170; Jüpiter manyetik moment 20.000 kat ↔ bulut tepesi alanı 16–54 kat / ~14 kat, d37'de açıklanıyor). **Açıklamasız sayı uyuşmazlığı bulunmadı.** Tek mantık hatası A5-02'de (sayılar kaynakla uyumlu, açıklama yanlış).

Not: Bu karşılaştırma kaynak.md'ye yazılmış ifade ile yapıldı; kaynak sayfalar yeniden açılıp alıntılar canlı sayfada ayrıca doğrulanmadı (yalnız durum kodu kontrol edildi).

## Askıda
- **Erişilemeyen 156 URL** (403: 102 — ör. APS alan adları 17, britannica.com 13, skyandtelescope.org 13, jpl.nasa.gov 13, wikiwand 5, timeanddate 3, cambridge.org 2, doi.org→aanda 1; bağlantı hatası/zaman aşımı: 22 — astronomy.swinburne.edu.au, simbad.cds.unistra.fr, lasp.colorado.edu, ligo.caltech.edu, ncei.noaa.gov vb.; IOP DOI'lerinde bot doğrulama sayfası (validate.perfdrive.com): 9, haberlerin makale bağlantıları; ui.adsabs.harvard.edu 405: 11; iau.org oturum açma sayfasına sonsuz yönlendirme: 2; 5xx/4xx sunucu yanıtları: 10 — iauarchive.eso.org 502 ×3, lamptech 500, pdf.arxiv.org 500, 3dincites 504, krisyotam 525, radiopaedia 406, physics.nist.gov/cuu/pdf/wall_2022.pdf 400, 503 ×1). Bunlar bot koruması, ağ engeli ya da geçici sunucu hatası olabilir; ölü oldukları kanıtlanamadı. Özellikle iau.org (IAU 2015 B3 kararı PDF'i, d5 dersler.json:17660 ve deney_rehber.json:146) ve iauarchive.eso.org adreslerinin tarayıcıdan denenmesi önerilir. celestrak.org (4) kurala göre atlandı.
- **Yay Cüce uzaklığı**: Hangi değer doğru (80.380 ışık yılı mı, merkezden 50.000 mi) bu turda bağımsız kaynakla saptanmadı; A5-02 yalnız açıklamanın yanlışlığını ileri sürüyor.
- **Güneş çekirdek sıcaklığı 15,6 (d28) ↔ 15,7 milyon K (d4, d5, d30)**: %0,6 fark; yuvarlama/kaynak farkı olabilir, bulgu sayılmadı.
- Bağlantıların çoğu (209) yönlendirme veriyor; yalnız başka içeriğe gidenler A5-08'de. Kalanların hedefi aynı makale olarak değerlendirildi ama sayfa içerikleri açılıp karşılaştırılmadı.

## Ek A — geçmiş zamanlı ileri göndermeler (76)
Biçim: kaynak satırı (derlenmiş satır) bu dersin sırası → gönderilen ders (sırası) | bağlam

- d34.json:34 (dersler.json:5197) #8 → “9. ders” = d9 (#9) — …9. derste gördüğün gibi Güneş yaklaşık 4,6 milyar yıl ö…
- d34.json:41 (dersler.json:5204) #8 → “9. ders” = d9 (#9) — …0²⁸ kg. Adım 2: Gezegenlerin toplam kütlesi. 9. dersteki NASA değerlerini topla: Jüpiter 1898, Satür…
- d34.json:63 (dersler.json:5226) #8 → “9. ders” = d9 (#9) — … için küçük, yoğun karasal gezegenler kaldı. 9. dersteki iki aile ayrımının fiziksel kökü budur.…
- d34.json:64 (dersler.json:5227) #8 → “9. ders” = d9 (#9) — …AB verir; Toronto notları yaklaşık 4 AB der. 9. dersteki 2,7–5 AB aralığı bu belirsizliği yansıtır: …
- d34.json:90 (dersler.json:5253) #8 → “11. ders” = d10 (#11) — …ı sayıda Dünya boyutunda cisim ortaya çıkar. 11. derste gördüğün dev çarpışma varsayımına göre Ay'ı …
- d34.json:92 (dersler.json:5255) #8 → “11. ders” = d10 (#11) — …n ise 30 milyon yıl içinde oluştuğunu yazar; 11. dersteki tahmin Ay için yaklaşık 50 milyon yıldır. …
- d34.json:117 (dersler.json:5280) #8 → “9. ders” = d9 (#9) — …arışık, toplam kütlesi küçük hâline getirir. 9. derste gördüğün gibi kuşaktaki bütün asteroitlerin t…
- d34.json:131 (dersler.json:5294) #8 → “20. ders” = d19 (#20) — …bölgelerinde yakalanır ve bugün de oradadır. 20. derste gördüğün gibi NASA'ya göre Kuiper kuşağının …
- d34.json:143 (dersler.json:5306) #8 → “11. ders” = d10 (#11) — …Ay'ın yüzeyi bir takvimdir. 11. derste gördüğün gibi Apollo'nun getirdiği, çarpmayl…
- d34.json:156 (dersler.json:5319) #8 → “9. ders” = d9 (#9) — …ondritlerden 4.567,2 ± 0,6 milyon yıl verir. 9. derste kullandığımız 4,567 milyar yıl bu ölçümlerden…
- d34.json:157 (dersler.json:5320) #8 → “11. ders” = d10 (#11) — …kayaçlar en çok 4,51 milyar yıl çıkar; bu da 11. dersteki dev çarpışma tarihiyle uyumludur. Sıralama…
- d44.json:141 (dersler.json:6806) #10 → “23. ders” = d23 (#23) — … Pek çok uydu da termosferin içinde dolanır: 23. derste gördüğün Uluslararası Uzay İstasyonu yaklaşı…
- d44.json:205 (dersler.json:6870) #10 → “11. ders” = d10 (#11) — …l Ay'da diskin karanlık kısmı soluk görünür; 11. derste gördüğün bu Dünya ışığı, Dünya'dan yansıyıp …
- d35.json:84 (dersler.json:8801) #13 → “46. ders” = d26 (#46) — …lilik kuramının ilk zaferlerinden biri oldu. 46. derste gördüğün gibi açıklanamayan pay yüzyılda yak…
- d35.json:172 (dersler.json:8889) #13 → “42. ders” = d18 (#42) — …inde hem de yaşam tartışmalarında öne çıkar. 42. dersteki fosfin tartışması da bu bulut katmanıyla i…
- d36.json:119 (dersler.json:9420) #14 → “42. ders” = d18 (#42) — …Bugün Mars kuru ve soğuk; ama 42. derste gördüğün gibi yüzeyi başka bir geçmiş anlatı…
- d36.json:122 (dersler.json:9423) #14 → “42. ders” = d18 (#42) — …ı da suyla ve yaşam sorusuyla bağlantılıdır. 42. derste gördüğün gibi farklı aletlerin sonuçları bir…
- d36.json:137 (dersler.json:9438) #14 → “42. ders” = d18 (#42) — …ökeni ise daha uzun süre tartışıldı. Bu öykü 42. dersteki biyoimza dersini hatırlatır: olağanüstü bi…
- d36.json:173 (dersler.json:9474) #14 → “23. ders” = d23 (#23) — …r tur bindirdiğinde yeniden gelir: bu, d9 ve 23. derste gördüğün sinodik dönemdir, NASA'ya göre 779,…
- d36.json:175 (dersler.json:9476) #14 → “23. ders” = d23 (#23) — …varacak; deneyin hesapladığı 8,5 aydan uzun. 23. derste gördüğün gibi NASA, Güneş çevresinde 180°'de…
- d36.json:190 (dersler.json:9491) #14 → “42. ders” = d18 (#42) — …Dünya'ya henüz hiçbir görev örnek getirmedi. 42. derste gördüğün gibi NASA'nın Mars Örnek Getirme pr…
- d36.json:203 (dersler.json:9504) #14 → “42. ders” = d18 (#42) — …3,8 yay saniyesi olacağını hesapladın. Çünkü 42. derste gördüğün gibi Mars bu sefer yörüngesinin Gün…
- d37.json:17 (dersler.json:9936) #15 → “24. ders” = d4 (#24) — …er'i Güneş'le karşılaştırmak da öğreticidir. 24. dersteki Güneş kütlesini (1,988 × 10³⁰ kg) Jüpiter'…
- d37.json:17 (dersler.json:9936) #15 → “41. ders” = d13 (#41) — …pay, Güneş'i yerinden oynatmaya yeter: d3 ve 41. derste gördüğün gibi Güneş ile Jüpiter ortak bir kü…
- d37.json:48 (dersler.json:9967) #15 → “26. ders” = d5 (#26) — …ine benzediği için 'başarısız yıldız' denir. 26. derste gördüğün gibi hidrojen kaynaştırabilmek için…
- d37.json:120 (dersler.json:10039) #15 → “44. ders” = d33 (#44) — …şturur; buna Io plazma simidi denir (plazma, 44. derste gördüğün gibi elektronları sökülmüş, elektri…
- d40.json:67 (dersler.json:11757) #18 → “42. ders” = d18 (#42) — …eraltı okyanusunu ve Europa Clipper görevini 42. derste gördün: çapı 3122 km, okyanusunda Dünya okya…
- d40.json:104 (dersler.json:11794) #18 → “42. ders” = d18 (#42) — …uçarak keşfedecek NASA'nın Dragonfly aracını 42. derste gördün: Temmuz 2028'de fırlatılması, 2034'te…
- d40.json:127 (dersler.json:11817) #18 → “42. ders” = d18 (#42) — …kürmelerin Satürn'ün E halkasını beslediğini 42. derste gördün.…
- d40.json:178 (dersler.json:11868) #18 → “42. ders” = d18 (#42) — … Clipper aracı 14 Ekim 2024'te fırlatıldı ve 42. derste gördüğün gibi Nisan 2030'da Jüpiter yörünges…
- d41.json:25 (dersler.json:12275) #19 → “20. ders” = d19 (#20) — …üçük cisimleri ya yutmuş, ya savurmuş, ya da 20. derste gördüğün Truva asteroitleri gibi kendi denet…
- d41.json:197 (dersler.json:12447) #19 → “20. ders” = d19 (#20) — …20. dersteki formüle göre aynı parlaklıktaki bir cismin…
- d41.json:236 (dersler.json:12486) #19 → “20. ders” = d19 (#20) — …D: çap, p: albedo. 20. dersteki D ≈ 1329 km × 10^(−0,2 × H) / √p formülünd…
- d43.json:112 (dersler.json:14454) #22 → “50. ders” = d31 (#50) — …nı taşın içinde iki ayrı saatin işlemesidir. 50. derste gördüğün gibi uranyum-238 yaklaşık 4,47 mily…
- d43.json:210 (dersler.json:14552) #22 → “45. ders” = d25 (#45) — …; 1 megaton = 1.000 kiloton ≈ 4,18 × 10¹⁵ J. 45. dersteki 8,99 × 10¹⁶ J ≈ 21.500 kiloton eşitliğinde…
- d23.json:125 (dersler.json:15096) #23 → “42. ders” = d18 (#42) — …km/s eder. Mars Ay'dan yüzlerce kat uzaktır: 42. derste gördüğün 2027 karşı konumunda bile yaklaşık …
- d23.json:166 (dersler.json:15137) #23 → “24. ders” = d4 (#24) — …tığı parçacık ve manyetik alan kabarcığıdır; 24. dersteki güneş rüzgârı bu kabarcığı şişirir. UNLV'n…
- d15.json:125 (dersler.json:17880) #27 → “28. ders” = d6 (#28) — …asik nova yaklaşık 10³⁷ joule açığa çıkarır; 28. dersteki Ia süpernovası ise yaklaşık 10⁴⁴ joule, ya…
- d6.json:141 (dersler.json:18794) #28 → “40. ders” = d20 (#40) — …üne yerleştirmeni sağlar. Tycho'nun yıldızı, 40. derste gördüğün gibi İstanbul'dan bütün gece ufkun …
- d45.json:113 (dersler.json:19460) #29 → “46. ders” = d26 (#46) — …Zaman da yavaşlar. 46. dersteki kütleçekimsel zaman genişlemesi burada gün…
- d45.json:182 (dersler.json:19529) #29 → “46. ders” = d26 (#46) — …ı yılda yaklaşık 4,2 derece döner; Merkür'ün 46. derste gördüğün günberi kaymasının çok daha güçlü b…
- d45.json:182 (dersler.json:19529) #29 → “30. ders” = d16 (#30) — …ız yaklaşık 300 milyon yıl sonra birleşecek. 30. derste gördüğün gibi Hulse ile Taylor bu buluş için…
- d45.json:196 (dersler.json:19543) #29 → “30. ders” = d16 (#30) — …n manyetik momenti örneğinde gördüğün eşik); 30. dersteki GW150914 5,1 sigmaydı. Bu yüzden ekip sonu…
- d46.json:17 (dersler.json:20759) #31 → “33. ders” = d7 (#33) — …Fikir kuasarlarla doğdu. 33. derste gördüğün gibi Maarten Schmidt 1963'te 3C 273…
- d46.json:28 (dersler.json:20770) #31 → “39. ders” = d17 (#39) — …ye yapılan ilk doğrudan uzaklık ölçümüydü ve 39. derste gördüğün kozmik uzaklık merdiveni için bağım…
- d46.json:39 (dersler.json:20781) #31 → “33. ders” = d7 (#33) — … maser seçilebilir. Orada zamanı kullanırız. 33. derste gördüğün aktif galaksi çekirdeklerinde kara …
- d46.json:126 (dersler.json:20868) #31 → “39. ders” = d17 (#39) — … deliği (1,6 ± 0,4) milyar Güneş kütlesidir. 39. dersteki Planck değerleriyle hesaplayınca o ışık yo…
- d46.json:128 (dersler.json:20870) #31 → “38. ders” = d8 (#38) — …ktir ve iki ana aday vardır. Hafif tohumlar, 38. derste gördüğün ilk büyük yıldız kuşağının, Popülas…
- d46.json:129 (dersler.json:20871) #31 → “38. ders” = d8 (#38) — …ldızlardan kalan hafif tohumlar kuramsaldır; 38. derste gördüğün gibi şimdiye dek tek bir Popülasyon…
- d46.json:191 (dersler.json:20933) #31 → “33. ders” = d7 (#33) — …k 61°) konuşmuştuk. En kolayı Andromeda'dır: 33. derste gördüğün gibi 3,44 kadirle karanlık bir gökt…
- d47.json:74 (dersler.json:21440) #32 → “38. ders” = d8 (#38) — …ları evrenin ilk birkaç yüz milyon yılından, 38. dersteki karanlık çağın hemen sonrasından kalmış ol…
- d47.json:110 (dersler.json:21476) #32 → “33. ders” = d7 (#33) — …şık 240 milyon yılla (maddenin bilgi kutusu, 33. dersteki gibi, 212 milyon yıl der) Güneş ömrü boyun…
- d48.json:32 (dersler.json:22770) #34 → “39. ders” = d17 (#39) — … Greenstein ile Matthews'ın 3C 48 çalışması. 39. dersteki Hubble–Lemaître yasası, bu kırmızıya kayma…
- d48.json:138 (dersler.json:22876) #34 → “39. ders” = d17 (#39) — …iği yaklaşık 10 milyar yıl önce zirve yaptı. 39. dersteki Planck değerleriyle hesaplayınca 10 milyar…
- d48.json:140 (dersler.json:22878) #34 → “39. ders” = d17 (#39) — …8 milyar yaşında olduğu hâlde bu nasıl olur? 39. derste gördüğün gibi genişleyen evrende ışığın yolc…
- d48.json:144 (dersler.json:22882) #34 → “38. ders” = d8 (#38) — …38. dersteki kural: 1 + z, ışık yola çıktığından bu yan…
- d48.json:152 (dersler.json:22890) #34 → “38. ders” = d8 (#38) — …idrojen o kadar artar ki ağaçlar birleşir ve 38. dersteki Gunn–Peterson çukuru açılır. Orman ile çuk…
- d48.json:153 (dersler.json:22891) #34 → “39. ders” = d17 (#39) — …aldırıldı. Etkin kırmızıya kayma 2,33; d8 ve 39. derste gördüğün baryon akustik salınımları ölçeği b…
- d48.json:188 (dersler.json:22926) #34 → “39. ders” = d17 (#39) — …larının alanındadır. 4. adım (yaş sınaması): 39. dersteki Planck değerleriyle z = 3,55'te evren yakl…
- d49.json:66 (dersler.json:23437) #35 → “39. ders” = d17 (#39) — …Kaba bir mertebe hesabı için 39. dersteki M ≈ v² × r / G biçimini hız dağılımıyla ku…
- d49.json:117 (dersler.json:23488) #35 → “39. ders” = d17 (#39) — …bağımsız bir sağlamasıdır; aşağıdaki örnekte 39. dersteki Planck değerleriyle kendin karşılaştırabil…
- d49.json:121 (dersler.json:23492) #35 → “39. ders” = d17 (#39) — …39. dersteki Planck 2018 değerleri: sıradan madde Ωb ≈ …
- d57.json:75 (dersler.json:24121) #36 → “38. ders” = d8 (#38) — …tlama da aynı yükü taşır; adı her duyduğunda 38. dersteki üzümlü kek resmini hatırla.…
- d57.json:155 (dersler.json:24201) #36 → “38. ders” = d8 (#38) — …, F = 2/3: t0 ≈ 14,5 × 2/3 ≈ 9,7 milyar yıl. 38. dersteki 2026 çalışmasına göre en yaşlı küresel küm…
- d57.json:162 (dersler.json:24208) #36 → “38. ders” = d8 (#38) — …emesi tek bir noktada değil, her yerde olur. 38. dersteki kek benzetmesine bir ikincisini ekleyelim:…
- d57.json:181 (dersler.json:24227) #36 → “39. ders” = d17 (#39) — … Bunlara bu derste gördüğün lityum sorunu ve 39. dersteki Hubble gerilimi eklenir. Aynı kaynak, erke…
- d58.json:17 (dersler.json:24651) #37 → “38. ders” = d8 (#38) — …adar parlak olurdu. Yani karanlık gece göğü, 38. dersteki Olbers paradoksunun bir başka yüzüdür: ışı…
- d58.json:77 (dersler.json:24711) #37 → “38. ders” = d8 (#38) — …Saydamlaşmadan önceki evren 38. derste gördüğün gibi sıcak bir plazmaydı. Wikipedia…
- d58.json:132 (dersler.json:24766) #37 → “38. ders” = d8 (#38) — …linden neredeyse bağımsız ölçülür. Bu sayıyı 38. dersteki “en güçlü lekeler yaklaşık 1 derece” bilgi…
- d58.json:137 (dersler.json:24771) #37 → “39. ders” = d17 (#39) — …0 milyon, yani yaklaşık 45 milyar ışık yılı; 39. dersteki “arka plan ışımasını yayan madde bugün yak…
- d58.json:137 (dersler.json:24771) #37 → “39. ders” = d17 (#39) — … / 1090,92 ≈ 12,7 Mpc ≈ 41 milyon ışık yılı; 39. dersteki yaklaşık 42 milyon ışık yılıyla uyumlu. So…
- d58.json:146 (dersler.json:24780) #37 → “39. ders” = d17 (#39) — … içinde bu değerler gözlemle kesinleşmiştir; 39. dersteki Hubble gerilimi ise modelin bir yerde eksi…
- d58.json:167 (dersler.json:24801) #37 → “38. ders” = d8 (#38) — …anck 2018'e göre değeri 0,054 ± 0,007'dir ve 38. dersteki yaklaşık z = 7,7'lik yeniden iyonlaşma tar…
- d58.json:180 (dersler.json:24814) #37 → “38. ders” = d8 (#38) — …Haritadaki en büyük desen bizimle ilgilidir: 38. derste gördüğün dipol. Güneş, arka plan ışımasına g…
- d47.json:74 (dersler.json:21440) #32 → "(d8)" = #38 | …Evrenin yaşı yaklaşık 13,8 milyar yıl olduğuna göre (d8)…
- d48.json:153 (dersler.json:22891) #34 → "d8 ve 39. derste gördüğün" = #38 | (d8 kısmı; 39. ders kısmı yukarıda)

## Ek B — URL sonuç tablosu (yalnız sorunlular + toplamlar)

Toplam tekil URL: 2038 (en.wikipedia.org 590 ayrıca MediaWiki API ile sorgulandı). Sınıflar: ok 1617, yonlendirme 209, erisilemedi 156, wiki-yonlendirme 26, olu 21, alan-adi-yok 5, atlandi 4

Not: "yonlendirme" satırlarının çoğu yalnız http→https, www, sondaki "/" ya da sitenin yeni yol yapısıdır (içerik aynı). Aşağıdaki tabloda yalnız ölü, alan adı yok, erişilemedi, Wikipedia yönlendirmesi ve başka sayfaya giden yönlendirmeler var; tam liste: scratchpad/denetim/a5/sonuc_son.csv.

| sınıf | durum | URL | gittiği yer | geçtiği yer (ilk 3) |
|---|---|---|---|---|
| olu | 404 | https://apex.asteroidmission.org/preview/About/About_Apophis.html | 404g | veri/dersler.json:13194 veri/dersler.json:13632 arastirma/dersler_v2/d19_kaynak.md:251 |
| olu | 404 | https://astronomics.com/limiting-magnitude_t.aspx | 404g | veri/dersler.json:3699 veri/deney/durbun.json:1 |
| olu | 404 | https://blogs.esa.int/access/?p=128 | 404g | arastirma/dersler_v2/d23_kaynak.md:260 |
| olu | 404 | https://cdn.tua.gov.tr/69a52468589f6.pdf | 404g | veri/dersler.json:15597 arastirma/dersler_v2/d23_kaynak.md:6 |
| olu | 404 | https://dictionary.obspm.fr/terms/birunis-method/ | 404g | veri/dersler.json:27378 arastirma/dersler_v2/d20_kaynak.md:140 |
| olu | 404 | https://dictionary.obspm.fr/terms/critical-density/ | 404g | veri/dersler.json:26813 arastirma/dersler_v2/d17_kaynak.md:343 |
| olu | 404 | https://dictionary.obspm.fr/terms/eratosthenes-method/ | 404g | veri/dersler.json:27093 veri/dersler.json:27342 veri/deney/eratosthenes.json:145 |
| olu | 404 | https://dictionary.obspm.fr/terms/initial-mass-function-imf/ | 404g | veri/dersler.json:16667 veri/dersler.json:16985 arastirma/dersler_v2/d14_kaynak.md:180 |
| olu | 404 | https://dunlap.utoronto.ca/coolcosmos/bigbang.php | https://www.dunlap.utoronto.ca/coolcosmos/bigbang.php | veri/dersler.json:26030 arastirma/dersler_v2/d58_kaynak.md:239 arastirma/dersler_v2/d8_kaynak.md:197 |
| olu | 404 | https://grahamfarmelo.com/?p=1293 | 404g | veri/dersler.json:37909 arastirma/dersler_v2/d53_kaynak.md:182 |
| olu | 404 | https://home.cern/news/series/cern70/cern70-announcing-higgs-boson-discovery | https://home.cern/series/cern70/cern70-announcing-higgs-boson-discovery | veri/dersler.json:34001 veri/dersler.json:34255 arastirma/dersler_v2/d32_kaynak.md:76 |
| olu | 410 | https://newatlas.com/space/reservoir-salty-water-found-ceres-dwarf-planet | 410g | veri/dersler.json:12529 veri/dersler.json:12823 arastirma/dersler_v2/d41_kaynak.md:143 |
| olu | 404 | https://rallypoint.com/shared-links/michael-faraday-s-generator | https://www.tesolife.com/zh/shared-links/michael-faraday-s-generator | arastirma/dersler_v2/d33_kaynak.md:69 |
| olu | 404 | https://repository.ias.ac.in/55225 | 404g | veri/dersler.json:24352 veri/dersler.json:24595 arastirma/dersler_v2/d57_kaynak.md:5 |
| olu | 404 | https://slittlefair.staff.shef.ac.uk/teaching/phy241/lectures/l03 | https://sheffield-mps.github.io/PHY241/lectures/l03 | veri/dersler.json:3583 arastirma/dersler_v2/d12_kaynak.md:34 arastirma/dersler_v2/d12_kaynak.md:35 |
| olu | 404 | https://spaceflight101.com/spacerockets/?p=1457 | 404g | veri/deney/roket.json:93 veri/deney/roket.json:101 veri/deney/roket.json:102 |
| olu | 404 | https://www.aavso.org/index.php/node/74419 | https://aavso.org/node/74419 | veri/dersler.json:18646 arastirma/dersler_v2/d15_kaynak.md:257 |
| olu | 404 | https://www.iaa.es/node/12759 | https://www.iaa.csic.es/node/12759 | veri/dersler.json:13983 veri/dersler.json:14251 arastirma/dersler_v2/d42_kaynak.md:24 |
| olu | 404 | https://www.imo.net/calendar/2024 | 404g | arastirma/dersler_v2/d19_kaynak.md:88 arastirma/dersler_v2/d19_kaynak.md:336 |
| olu | 404 | https://www.imo.net/resources/calendar/ | 404g | veri/dersler.json:8710 veri/dersler.json:13164 veri/dersler.json:13512 |
| olu | 404 | https://www.lickobservatory.org/explore/historical-resources/the-lick-observatory-eclipse-expeditions-general-relativity-and-the-bending-of-starlight/ | 404g | veri/dersler.json:31276 arastirma/dersler_v2/d26_kaynak.md:64 |
| alan-adi-yok | DNS | https://digfir-published.macmillanusa.com/universe10e/universe10e_ch12_5.html |  | veri/dersler.json:11116 arastirma/dersler_v2/d37_kaynak.md:42 arastirma/dersler_v2/d38_kaynak.md:54 |
| alan-adi-yok | DNS | https://digfir-published.macmillanusa.com/universe10e/universe10e_ch24_2.html |  | veri/dersler.json:22651 arastirma/dersler_v2/d7_kaynak.md:137 |
| alan-adi-yok | DNS | https://digfir-published.macmillanusa.com/universe10e/universe10e_ch4_4.html |  | veri/dersler.json:27418 arastirma/dersler_v2/d20_kaynak.md:5 |
| alan-adi-yok | DNS | https://exploration.jsc.nasa.gov/interaction/lmdp/documents/Comets_Lithograph_h.pdf |  | veri/dersler.json:13492 arastirma/dersler_v2/d19_kaynak.md:51 arastirma/dersler_v2/d19_kaynak.md:56 |
| alan-adi-yok | DNS | https://m.esa.int/Newsroom/Press_Releases/ESA_s_Euclid_lifts_off_on_quest_to_unravel_the_cosmic_mystery_of_dark_matter_and_dark_energy |  | veri/dersler.json:34634 veri/dersler.json:34927 arastirma/dersler_v2/d50_kaynak.md:157 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Astronomical_Diaries | https://en.wikipedia.org/wiki/Babylonian_astronomical_diaries | veri/dersler.json:27087 veri/dersler.json:27326 arastirma/dersler_v2/d20_kaynak.md:12 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Blueshift | https://en.wikipedia.org/wiki/Redshift | veri/dersler.json:26841 arastirma/dersler_v2/d17_kaynak.md:402 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/C/2023_A3_(Tsuchinshan%E2%80%93ATLAS) | https://en.wikipedia.org/wiki/Comet_Tsuchinshan%E2%80%93ATLAS | veri/dersler.json:14315 arastirma/dersler_v2/d42_kaynak.md:150 arastirma/dersler_v2/d42_kaynak.md:151 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Cosmic_acceleration | https://en.wikipedia.org/wiki/Accelerating_expansion_of_the_universe | veri/dersler.json:35519 arastirma/dersler_v2/d51_kaynak.md:5 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Count_Rumford | https://en.wikipedia.org/wiki/Benjamin_Thompson | veri/dersler.json:29512 arastirma/dersler_v2/d30_kaynak.md:5 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Cyg_X-1 | https://en.wikipedia.org/wiki/Cygnus_X-1 | veri/dersler.json:20663 arastirma/dersler_v2/d16_kaynak.md:112 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Gabor_limit | https://en.wikipedia.org/wiki/Uncertainty_principle | veri/dersler.json:31919 arastirma/dersler_v2/d27_kaynak.md:122 arastirma/dersler_v2/d27_kaynak.md:128 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Geomagnetic | https://en.wikipedia.org/wiki/Earth%27s_magnetic_field | arastirma/dersler_v2/d33_kaynak.md:5 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Gregorian_year | https://en.wikipedia.org/wiki/Gregorian_calendar | veri/dersler.json:8678 arastirma/dersler_v2/d22_kaynak.md:5 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/H-alpha | https://en.wikipedia.org/wiki/Hydrogen-alpha | arastirma/dersler_v2/d17_kaynak.md:18 arastirma/dersler_v2/d7_kaynak.md:153 arastirma/dersler_v2/d8_kaynak.md:99 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Hawking_paradox | https://en.wikipedia.org/wiki/Black_hole_information_paradox | veri/dersler.json:36611 arastirma/dersler_v2/d52_kaynak.md:6 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Hydrogen_spectrum | https://en.wikipedia.org/wiki/Hydrogen_spectral_series | veri/dersler.json:1272 veri/dersler.json:1646 arastirma/dersler_v2/d2_kaynak.md:263 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Io_plasma_torus | https://en.wikipedia.org/wiki/Magnetosphere_of_Jupiter | arastirma/dersler_v2/d37_kaynak.md:104 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/K/Pg_impactor | https://en.wikipedia.org/wiki/Chicxulub_crater | arastirma/dersler_v2/d43_kaynak.md:6 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Kelvin_temperature | https://en.wikipedia.org/wiki/Thermodynamic_temperature | veri/dersler.json:29244 veri/dersler.json:29524 arastirma/dersler_v2/d30_kaynak.md:5 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Michelson-Morley | https://en.wikipedia.org/wiki/Michelson%E2%80%93Morley_experiment | veri/dersler.json:30437 veri/dersler.json:30443 veri/dersler.json:30679 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Miller-Urey | https://en.wikipedia.org/wiki/Miller%E2%80%93Urey_experiment | veri/dersler.json:28499 veri/dersler.json:28926 arastirma/dersler_v2/d18_kaynak.md:170 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/National_Optical_Observatory | https://en.wikipedia.org/wiki/T%C3%9CB%C4%B0TAK_National_Observatory | veri/dersler.json:3743 arastirma/dersler_v2/d12_kaynak.md:279 arastirma/dersler_v2/d12_kaynak.md:350 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Olbers_paradox | https://en.wikipedia.org/wiki/Olbers%27_paradox | veri/dersler.json:25986 arastirma/dersler_v2/d8_kaynak.md:192 arastirma/dersler_v2/d8_kaynak.md:322 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Path_integral_formulation | https://en.wikipedia.org/wiki/Path-integral_formulation | veri/dersler.json:33063 arastirma/dersler_v2/d29_kaynak.md:7 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Pound-Rebka_experiment | https://en.wikipedia.org/wiki/Pound%E2%80%93Rebka_experiment | veri/dersler.json:31010 veri/dersler.json:31288 arastirma/dersler_v2/d26_kaynak.md:83 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Schr%C3%B6dinger | https://en.wikipedia.org/wiki/Erwin_Schr%C3%B6dinger | veri/dersler.json:32507 arastirma/dersler_v2/d28_kaynak.md:89 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Standard_model | https://en.wikipedia.org/wiki/Standard_Model | veri/dersler.json:33977 veri/dersler.json:33989 veri/dersler.json:34239 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Stellar_aberration | https://en.wikipedia.org/wiki/Aberration_%28astronomy%29 | veri/dersler.json:515 veri/dersler.json:866 arastirma/dersler_v2/d1_kaynak.md:238 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Timeline_of_particle_physics | https://en.wikipedia.org/wiki/Timeline_of_atomic_and_subatomic_physics | veri/dersler.json:33664 veri/dersler.json:34247 arastirma/dersler_v2/d31_kaynak.md:9 |
| wiki-yonlendirme | 200 | https://en.wikipedia.org/wiki/Von_Neumann%E2%80%93Wigner_interpretation | https://en.wikipedia.org/wiki/Consciousness_causes_collapse | arastirma/dersler_v2/d27_kaynak.md:123 |
| erisilemedi | 403 | https://aps.org/publications/apsnews/201410/feynman.cfm | https://www.aps.org:443/publications/apsnews/201410/feynman.cfm | veri/dersler.json:33071 arastirma/dersler_v2/d29_kaynak.md:7 |
| erisilemedi | 403 | https://aps.org/publications/apsnews/202309/history.cfm | https://www.aps.org:443/publications/apsnews/202309/history.cfm | veri/dersler.json:6933 veri/dersler.json:7202 arastirma/dersler_v2/d44_kaynak.md:5 |
| erisilemedi | baglanti | https://astro.keele.ac.uk/jkt/tepcat/planets/TRAPPIST-1e.html |  | veri/deney_rehber.json:1522 |
| erisilemedi | 403 | https://astrobites.org/2023/01/02/pulsar-planets/ | 403g | veri/dersler.json:28011 arastirma/dersler_v2/d13_kaynak.md:7 arastirma/dersler_v2/d13_kaynak.md:8 |
| erisilemedi | 403 | https://astrobites.org/2025/10/06/desi-dr2-part3/ | 403g | veri/dersler.json:38271 veri/dersler.json:38521 arastirma/dersler_v2/d55_kaynak.md:5 |
| erisilemedi | baglanti | https://astronomy.swinburne.edu.au/cosmos/C/Classical+Novae |  | veri/dersler.json:18119 veri/dersler.json:18606 veri/dersler.json:19316 |
| erisilemedi | baglanti | https://astronomy.swinburne.edu.au/cosmos/D/Distance+Modulus |  | veri/dersler.json:17708 arastirma/dersler_v2/d17_kaynak.md:264 arastirma/dersler_v2/d5_kaynak.md:185 |
| erisilemedi | baglanti | https://astronomy.swinburne.edu.au/cosmos/T/Type+Ia+Supernova |  | veri/dersler.json:19208 veri/dersler.json:26425 veri/dersler.json:26777 |
| erisilemedi | 403 | https://blog.labroots.com/trending/space/28994/dragonfly-mission-titan-advances-2028-launch-2 | 403g | veri/dersler.json:28854 arastirma/dersler_v2/d18_kaynak.md:67 |
| erisilemedi | 403 | https://britannica.com/science/Bohr-model | https://www.britannica.com:443/science/Bohr-model | veri/dersler.json:32467 arastirma/dersler_v2/d28_kaynak.md:8 arastirma/dersler_v2/d28_kaynak.md:17 |
| erisilemedi | 403 | https://britannica.com/science/star-astronomy/Classification-of-spectral-types | https://www.britannica.com:443/science/star-astronomy/Classification-of-spectral-types | veri/dersler.json:17692 arastirma/dersler_v2/d5_kaynak.md:98 |
| erisilemedi | 403 | https://britannica.com/topic/Gaia-European-Space-Agency-satellite | https://www.britannica.com:443/topic/Gaia-European-Space-Agency-satellite | veri/dersler.json:26419 veri/dersler.json:26773 arastirma/dersler_v2/d17_kaynak.md:254 |
| erisilemedi | 403 | https://collection.sciencemuseumgroup.org.uk/objects/co2526/mechanical-equivalent-of-heat-apparatus | 403g | veri/dersler.json:29520 arastirma/dersler_v2/d30_kaynak.md:5 |
| erisilemedi | 403 | https://cosmosmagazine.com/science/biology/humans-can-see-a-single-photon-at-a-time | https://connectsci.au/news | veri/dersler.json:31615 veri/dersler.json:31883 arastirma/dersler_v2/d27_kaynak.md:72 |
| erisilemedi | baglanti | https://cubesat.cnes.fr/en/saturn |  | veri/dersler.json:6634 veri/dersler.json:11140 arastirma/dersler_v2/d38_kaynak.md:39 |
| erisilemedi | 403 | https://doaj.org/article/5ef9ccfcab874b94816b28fd801b2d9c | 403g | arastirma/dersler_v2/d40_kaynak.md:190 |
| erisilemedi | 403 | https://doi.org/10.1051/0004-6361/202661105 | https://www.aanda.org/10.1051/0004-6361/202661105 | veri/haberler.json:349 veri/haberler.json:354 |
| erisilemedi | 403 | https://doi.org/10.1103/PhysRevD.27.2848 | https://link.aps.org/doi/10.1103/PhysRevD.27.2848 | arastirma/dersler_v2/d54_kaynak.md:112 |
| erisilemedi | 403 | https://doi.org/10.1103/PhysRevLett.59.2607 | https://link.aps.org/doi/10.1103/PhysRevLett.59.2607 | arastirma/dersler_v2/d54_kaynak.md:153 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/1538-4357/ae879b | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=aa4aaf85-9cce-469f-83a8-d27b8457fc91&ssb=56066232996&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F1538-4357%2Fae879b&ssi=48cb9f3f-cnvj-4031-9ef1-a3de9bc99970&ssk=botmanager_support@radware.com&ssm=91362713918178266131266165019756&ssn=d267b528bb9b3881392f8c5e4843172c2970419c70f9-f8d0-4cab-ab5c41&sso=9016997d-651bab65bc223b908af9f47bf11fe6db29bdcc8e156406d1&ssp=29717736721793355104179331158999648&ssq=52091798380955740031083808324181917458701&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDcxMzAwLTAwNTZhYzQ4YjdhOGRjMDY0ZGIxMyIsInV6bXgiOiI3ZmMwMDBmMDUzYjA4Mi05NTVhLTQ0NmEtYTE0MS00ZjYwZjI5NmVmNGIxLTE3OTMzODM4MDgzNDcxMzAwLTAwYjE4ODYyZmVkNjMxM2I2NTMxMyJ9 | veri/haberler.json:1085 veri/haberler.json:1090 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/1538-4357/ae879c | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=4f89a22e-a956-444d-8127-28664054d929&ssb=14012222942&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F1538-4357%2Fae879c&ssi=3fa71a53-cnvj-4f26-9476-17c9bf41474a&ssk=botmanager_support@radware.com&ssm=62552201058672705166737316947603&ssn=b1c4dacf158a4a58f856b8d6f5af705513cd419c70f9-f8d0-4cab-a98d83&sso=6429997d-651bab65bc228b8ea49c8623b3202df7314a139800068a2e&ssp=47490967941793331727179333954685969&ssq=65426448381152752396883808064662933816786&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDczMDkwLTAwNTJkNDVkNWRjZWNlNjUyNWExNiIsInV6bXgiOiI3ZmMwMDBmMDUzYjA4Mi05NTVhLTQ0NmEtYTE0MS00ZjYwZjI5NmVmNGIxLTE3OTMzODM4MDgzNDczMDkwLTAwYjQxMmI1ZjgwN2JiYzVlZWYxNiJ9 | veri/haberler.json:1095 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/1538-4357/ae93a0 | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=91553a9c-a2a0-4de6-88ac-56ef9b407af2&ssb=17007204848&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F1538-4357%2Fae93a0&ssi=304b00d5-cnvj-4f47-89a3-d621a033c6df&ssk=botmanager_support@radware.com&ssm=81616623916185086195889387997781&ssn=211fb74bcc98e2ab2f3ea4b5711a3b0fb466419c70f9-f8d0-4cab-af00f1&sso=67be397d-651bab65bc229a3df802cc2ba74f75ff86194f1869dd9ce0&ssp=56132001021793307078179334278699215&ssq=89165638381340053119383808778550606230833&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDc0NzQ2LTAwNTM0NDI1Njk4ZGE2MjE5NmUxOSIsInV6bXgiOiI3ZmMwMDBmMDUzYjA4Mi05NTVhLTQ0NmEtYTE0MS00ZjYwZjI5NmVmNGIxLTE3OTMzODM4MDgzNDc0NzQ2LTAwYjY4YzMzMTYzNDc0YzdkNjUxOSJ9 | veri/haberler.json:810 veri/haberler.json:815 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/1538-4357/ae9747 | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=0350f4e6-d1a9-43a6-8dc9-c51b4cd64e8b&ssb=67277271250&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F1538-4357%2Fae9747&ssi=82800a9d-cnvj-41bf-8ee8-84029ad75777&ssk=botmanager_support@radware.com&ssm=48944866368356242228224341258582&ssn=83dcf6b628336fad16363c27add97e539989419c70f9-f8d0-4cab-ace311&sso=f9d2597d-651bab65bc22b7ceb83e0987441fc895b8c5e91cb6ab8665&ssp=32901793661793310489179335735151569&ssq=87491088381462520599783808480190191481667&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDc2NDAzLTAwNWQ4NzlkNDdlMjE4YWQ4MGQyMiIsInV6bXgiOiI3ZmMwMDBmMDUzYjA4Mi05NTVhLTQ0NmEtYTE0MS00ZjYwZjI5NmVmNGIxLTE3OTMzODM4MDgzNDc2NDAzLTAwYjAyM2IzMDcyMDMxYWYzN2YyMiJ9 | veri/haberler.json:687 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/1538-4357/ae9835 | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=70f0192e-db59-4c9b-932f-6826e874c45b&ssb=10987222326&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F1538-4357%2Fae9835&ssi=14624585-cnvj-458d-a3f0-906a085fe3a6&ssk=botmanager_support@radware.com&ssm=54018672773293618251099394888812&ssn=e94c2a42c6c6bcc21fe313ac3f44e047244b419c70f9-f8d0-4cab-a518f9&sso=6203b97d-651bab65bc2281f9f98c754b715be83d8fbee6ad1b45d6eb&ssp=84351938701793325462179333750935666&ssq=45034968381603984315883808930089411283260&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDc4MDY4LTAwNTc3ZjU5NzMxYjRlMTMwYTMyNSIsInV6bXgiOiI3ZmMwMDBmMDUzYjA4Mi05NTVhLTQ0NmEtYTE0MS00ZjYwZjI5NmVmNGIxLTE3OTMzODM4MDgzNDc4MDY4LTAwYmU5NzdmMmNhYWVlNmYyYWIyNSJ9 | veri/haberler.json:677 veri/haberler.json:682 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/1538-4357/ae9d6c | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=44cc7a60-a4a3-4e6f-ab86-1d070d6e9d54&ssb=20749282538&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F1538-4357%2Fae9d6c&ssi=b8f32463-cnvj-40a9-a4d9-c878b03264c6&ssk=botmanager_support@radware.com&ssm=21128493846057740287049155401990&ssn=0d9becc66c9b5f986036152a4b020900d90e419c70f9-f8d0-4cab-a21149&sso=ee8d697d-651bab65bc22bebceeb1c47e571d019fb6086ff8632f95c4&ssp=43839463431793327066179334298374901&ssq=96628828381831153442983808993911942335386&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDc5NzI2LTAwNTBlMmJhOTM4NDcwMjk1OTEyOCIsInV6bXgiOiI3ZmMwMDBmMDUzYjA4Mi05NTVhLTQ0NmEtYTE0MS00ZjYwZjI5NmVmNGIxLTE3OTMzODM4MDgzNDc5NzI2LTAwYjc5ZTIzNGIzZmEyNjJhNGYyOCJ9 | veri/haberler.json:1026 veri/haberler.json:1031 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/2041-8213/ae9bb6 | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=2476418e-23ce-46aa-bcff-ca93bce00324&ssb=74224209874&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F2041-8213%2Fae9bb6&ssi=5e931424-cnvj-4399-8567-d9183d296487&ssk=botmanager_support@radware.com&ssm=60778661773723678315998183206427&ssn=ea3b3d0099e8d088431ec232808f4ec24151419c70f9-f8d0-4cab-ac7e79&sso=9cae197d-651bab65bc2247494d453f64ba1784b5ca521d52331c2ddd&ssp=91952673561793360239179334480985263&ssq=13566188381918571217383808668787858735164&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDcxMTM5MC0wMDVjMDllNjgzZTViNzhkNjRhMzEiLCJ1em14IjoiN2ZjMDAwZjA1M2IwODItOTU1YS00NDZhLWExNDEtNGY2MGYyOTZlZjRiMS0xNzkzMzgzODA4MzQ3MTEzOTAtMDBiN2YwZjM1MzhmYjBiOWM4ODMxIn0= | veri/haberler.json:855 veri/haberler.json:860 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/2041-8213/aea290 | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=76a00099-564c-4289-a5b1-1248d935f0a7&ssb=63064238422&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F2041-8213%2Faea290&ssi=b5c0cc83-cnvj-40fa-9372-1113677e7d55&ssk=botmanager_support@radware.com&ssm=63589995906519615341851718115165&ssn=d8845a3e06ab37bf999b09d5deb66fd5037e419c70f9-f8d0-4cab-ac2835&sso=2aa4297d-651bab65bc228b6c1ef6bc82b2c4a9f9bd1c82c515378315&ssp=10612010301793346805179331881898245&ssq=94004838382195197242783808869944288862616&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDcxMzA0NS0wMDVhNWE1NzYwZDMzNjc4Y2Q1MzQiLCJ1em14IjoiN2ZjMDAwZjA1M2IwODItOTU1YS00NDZhLWExNDEtNGY2MGYyOTZlZjRiMS0xNzkzMzgzODA4MzQ3MTMwNDUtMDBiY2RiMzc2MTQ0YjlkMjUxNjM0In0= | veri/haberler.json:765 veri/haberler.json:770 |
| erisilemedi | bot-dogrulama | https://doi.org/10.3847/2041-8213/aeaa29 | https://validate.perfdrive.com/fb803c746e9148689b3984a31fccd902/?ssa=8425d5a4-099e-47e0-adbb-f20572d33bf7&ssb=80631217430&ssc=https%3A%2F%2Fiopscience.iop.org%2Farticle%2F10.3847%2F2041-8213%2Faeaa29&ssi=97f88ba4-cnvj-4c78-8378-d0ab69549b3d&ssk=botmanager_support@radware.com&ssm=61437568150848590372638962628638&ssn=2070d5598a0ba9a05938444bbdc5264a400d419c70f9-f8d0-4cab-af31f8&sso=b955897d-651bab65bc2284d9399841e2507f90ce0b631e13b4b5c71a&ssp=33416593831793369208179339432791452&ssq=23903808382399156341483808096794091309455&ssr=OTUuOC4xNjMuMzc=&sst=urania-denetim/1.0&ssu=&ssv=&ssw=&ssx=eyJyZCI6ImlvcC5vcmciLCJfX3V6bWYiOiI3ZjkwMDA0MTljNzBmOS1mOGQwLTRjYWItYTk3ZC02NTFiYWI2NWJjMjIxLTE3OTMzODM4MDgzNDcxNDY5Ny0wMDVkZDExNDA2ODdkZGY4YWViMzciLCJ1em14IjoiN2ZjMDAwZjA1M2IwODItOTU1YS00NDZhLWExNDEtNGY2MGYyOTZlZjRiMS0xNzkzMzgzODA4MzQ3MTQ2OTctMDBiYmNmYWEwODlkNmVkODAwYTM3In0= | veri/haberler.json:299 veri/haberler.json:304 |
| erisilemedi | baglanti | https://einstein.caltech.edu/news/one-hundred-years-of-einsteins-field-equations-and-of-the-explanation-of-mercurys-perihelion |  | veri/dersler.json:31256 arastirma/dersler_v2/d26_kaynak.md:12 arastirma/dersler_v2/d26_kaynak.md:40 |
| erisilemedi | 403 | https://hub.jhu.edu/2012/11/29/messenger-water-mercury | 403g | veri/dersler.json:9254 arastirma/dersler_v2/d35_kaynak.md:47 |
| erisilemedi | 403 | https://iaea.org/node/47311 | 403g | veri/dersler.json:33656 arastirma/dersler_v2/d31_kaynak.md:88 |
| erisilemedi | cok-yonlendirme | https://iau.org/news/pressreleases/detail/iau1812 | https://iau.org/asicommon/controls/shared/formsauthentication/login.aspx?ReturnUrl=%2fasicommon%2fcontrols%2fshared%2fformsauthentication%2flogin.aspx%3fReturnUrl%3d%252Fasicommon%252Fcontrols%252Fshared%252Fformsauthentication%252Flogin.aspx%253FReturnUrl%253D%25252Fasicommon%25252Fcontrols%25252Fshared%25252Fformsauthentication%25252Flogin.aspx%25253FReturnUrl%25253D%2525252Fasicommon%2525252Fcontrols%2525252Fshared%2525252Fformsauthentication%2525252Flogin.aspx%2525253FReturnUrl%2525253D%252525252Fasicommon%252525252Fcontrols%252525252Fshared%252525252Fformsauthentication%252525252Flogin.aspx%252525253FReturnUrl%252525253D%25252525252Fasicommon%25252525252Fcontrols%25252525252Fshared%25252525252Fformsauthentication%25252525252Flogin.aspx%25252525253FReturnUrl%25252525253D%2525252525252Fasicommon%2525252525252Fcontrols%2525252525252Fshared%2525252525252Fformsauthentication%2525252525252Flogin.aspx%2525252525253FReturnUrl%2525252525253D%252525252525252Fnews%252525252525252Fpressreleases%252525252525252Fdetail%252525252525252Fiau1812 | veri/dersler.json:24298 veri/dersler.json:24563 veri/dersler.json:25926 |
| erisilemedi | 502 | https://iauarchive.eso.org/news/pressreleases/detail/iau0603/ | 502g | veri/dersler.json:12775 veri/dersler.json:13170 veri/dersler.json:13432 |
| erisilemedi | 502 | https://iauarchive.eso.org/public/themes/measuring/ | 502g | veri/fizik.json:56 arastirma/dersler_v2/d7_kaynak.md:55 arastirma/dersler_v2/d7_kaynak.md:65 |
| erisilemedi | 502 | https://iauarchive.eso.org/static/resolutions/IAU2012_English.pdf | 502g | veri/fizik.json:44 arastirma/dersler_v2/d17_kaynak.md:311 |
| erisilemedi | 403 | https://journals.aps.org/prd/abstract/10.1103/PhysRevD.46.603 | 403g | veri/dersler.json:36969 veri/dersler.json:37236 arastirma/dersler_v2/d56_kaynak.md:6 |
| erisilemedi | 403 | https://jpl.nasa.gov/missions/veritas | https://www.jpl.nasa.gov/missions/veritas | veri/dersler.json:6594 arastirma/dersler_v2/d35_kaynak.md:86 arastirma/dersler_v2/d35_kaynak.md:95 |
| erisilemedi | 403 | https://jpl.nasa.gov/press-kits/europa-clipper/quick-facts | https://www.jpl.nasa.gov/press-kits/europa-clipper/quick-facts | veri/dersler.json:28457 veri/dersler.json:28818 arastirma/dersler_v2/d18_kaynak.md:54 |
| erisilemedi | baglanti | https://lasp.colorado.edu/maven/2017/03/30/maven-reveals-most-of-mars-atmosphere-was-lost-to-space/ |  | veri/dersler.json:9615 veri/dersler.json:9896 arastirma/dersler_v2/d36_kaynak.md:76 |
| erisilemedi | 403 | https://link.aps.org/accepted/10.1103/PhysRevLett.127.151301 | 403g | veri/dersler.json:35822 veri/dersler.json:36029 arastirma/dersler_v2/d54_kaynak.md:5 |
| erisilemedi | 403 | https://m.investing.com/news/world-news/scientists-build-baby-wormhole-as-scifi-moves-closer-to-fact-2954900?ampMode=1 | 403g | veri/dersler.json:37264 arastirma/dersler_v2/d56_kaynak.md:6 |
| erisilemedi | 403 | https://medyascope.tv/2026/08/12/gunes-tutulmasi-ne-zaman-olacak-turkiyeden-izlenebilecek-mi/ | 403g | veri/dersler.json:16360 arastirma/dersler_v2/d4_kaynak.md:328 |
| erisilemedi | 403 | https://meetings-archive.aps.org/smt/2026/apr-w79/1/ | 403g | veri/dersler.json:35555 arastirma/dersler_v2/d51_kaynak.md:130 |
| erisilemedi | 403 | https://meetings-archive.aps.org/tss/2016/f1/6 | 403g | veri/dersler.json:37260 arastirma/dersler_v2/d56_kaynak.md:6 |
| erisilemedi | hata | https://ned.ipac.caltech.edu/level5/Sept18/Bullock/Bullock2.html |  | veri/dersler.json:34628 veri/dersler.json:34903 arastirma/dersler_v2/d50_kaynak.md:5 |
| erisilemedi | hata | https://ntrs.nasa.gov/citations/20050167059 |  | veri/dersler.json:19941 arastirma/dersler_v2/d45_kaynak.md:6 |
| erisilemedi | 500 | https://pdf.arxiv.org/pdf/2209.13084 | 500g | arastirma/dersler_v2/d29_kaynak.md:7 |
| erisilemedi | baglanti | https://philosophie.ens.fr/IMG/EGS%20Einstein%20relativity%208-9.pdf |  | veri/dersler.json:30691 arastirma/dersler_v2/d25_kaynak.md:40 |
| erisilemedi | 403 | https://physics.aps.org/articles/pdf/10.1103/Physics.15.94 | 403g | veri/dersler.json:30986 veri/dersler.json:31244 arastirma/dersler_v2/d26_kaynak.md:26 |
| erisilemedi | 403 | https://physics.aps.org/articles/v10/134 | 403g | veri/dersler.json:34923 veri/dersler.json:35249 veri/dersler.json:35515 |
| erisilemedi | 403 | https://physics.aps.org/articles/v15/156 | 403g | veri/dersler.json:13476 arastirma/dersler_v2/d19_kaynak.md:43 |
| erisilemedi | 403 | https://physics.aps.org/articles/v18/s117 | 403g | arastirma/dersler_v2/d50_kaynak.md:86 |
| erisilemedi | 403 | https://physics.aps.org/story/v19/st13 | 403g | veri/dersler.json:34275 arastirma/dersler_v2/d31_kaynak.md:82 arastirma/dersler_v2/d31_kaynak.md:102 |
| erisilemedi | 403 | https://physics.aps.org/story/v3/st23 | 403g | veri/dersler.json:31591 veri/dersler.json:31859 arastirma/dersler_v2/d27_kaynak.md:41 |
| erisilemedi | 406 | https://radiopaedia.org/articles/58849 | 406g | veri/dersler.json:29880 veri/dersler.json:30149 arastirma/dersler_v2/d33_kaynak.md:5 |
| erisilemedi | 403 | https://research.open.ac.uk/news/why-most-distant-object-ever-visited-looks-snowman-flyby-delivers-results | 403g | veri/dersler.json:12547 veri/dersler.json:12847 arastirma/dersler_v2/d41_kaynak.md:169 |
| erisilemedi | 403 | https://research.si.edu/publication-details/?id=81745 | 403g | arastirma/dersler_v2/d15_kaynak.md:237 |
| erisilemedi | baglanti | https://serviastro.ub.edu/sites/serviastro/files/2019-10/mercurivulcaneng.pdf |  | veri/dersler.json:5152 arastirma/dersler_v2/d3_kaynak.md:330 arastirma/dersler_v2/d3_kaynak.md:332 |
| erisilemedi | baglanti | https://simbad.cds.unistra.fr/simbad/sim-id?output.format=ASCII&Ident=M13 |  | veri/dersler.json:18438 |
| erisilemedi | baglanti | https://simbad.cds.unistra.fr/simbad/sim-id?output.format=ASCII&Ident=M8 |  | veri/dersler.json:2360 arastirma/dersler_v2/d11_kaynak.md:128 |
| erisilemedi | baglanti | https://simbad.cds.unistra.fr/simbad/sim-id?output.format=ASCII&Ident=zet01%20UMa |  | veri/dersler.json:18077 veri/dersler.json:18434 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-blogs/stargazing-why-we-look-up/waiting-for-the-blaze-star/ | 403g | veri/dersler.json:18614 veri/dersler.json:19328 arastirma/dersler_v2/d15_kaynak.md:243 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-news/a-new-way-to-see-the-big-dipper/ | 403g | veri/dersler.json:18095 veri/dersler.json:18578 arastirma/dersler_v2/d15_kaynak.md:222 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-news/how-pure-is-the-comet/ | 403g | veri/dersler.json:14299 arastirma/dersler_v2/d42_kaynak.md:138 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-news/lost-star-catalog-of-ancient-times-comes-to-light/ | 403g | veri/dersler.json:27111 veri/dersler.json:27362 arastirma/dersler_v2/d20_kaynak.md:14 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-news/new-horizons-reveals-full-picture-of-arrokoth-and-how-planets-form/ | 403g | veri/dersler.json:5673 arastirma/dersler_v2/d34_kaynak.md:5 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-news/observing-news/see-vesta-at-its-brightest/ | 403g | veri/dersler.json:13592 arastirma/dersler_v2/d19_kaynak.md:207 arastirma/dersler_v2/d19_kaynak.md:424 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-news/observing-news/this-weeks-sky-at-a-glance-october-16-25/ | 403g | veri/dersler.json:18406 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-news/project-ozma-the-first-seti/ | 403g | veri/dersler.json:28493 veri/dersler.json:28890 arastirma/dersler_v2/d18_kaynak.md:88 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-news/surprise-most-star-systems-are-single/ | 403g | veri/dersler.json:17999 veri/dersler.json:18382 arastirma/dersler_v2/d15_kaynak.md:36 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-press-releases/first-lights-what-to-see-with-your-new-telescope/ | 403g | veri/dersler.json:3607 arastirma/dersler_v2/d12_kaynak.md:75 arastirma/dersler_v2/d12_kaynak.md:328 |
| erisilemedi | 403 | https://skyandtelescope.org/astronomy-resources/famous-astronomers/jocelyn-bell-burnell-pulsar-pioneer/ | 403g | veri/dersler.json:18934 veri/dersler.json:19216 veri/dersler.json:19619 |
| erisilemedi | 403 | https://skyandtelescope.org/observing/celestial-objects-to-watch/observing-the-great-orion-nebula/ | 403g | veri/dersler.json:16925 arastirma/dersler_v2/d14_kaynak.md:35 arastirma/dersler_v2/d5_kaynak.md:22 |
| erisilemedi | 403 | https://skyandtelescope.org/observing/telescope-calculator/ | 403g | veri/dersler.json:3279 veri/dersler.json:3603 veri/deney/durbun.json:1 |
| erisilemedi | 403 | https://spark.iop.org/gravity-lends-hand | 403g | arastirma/dersler_v2/d23_kaynak.md:204 |
| erisilemedi | 403 | https://timeanddate.com/sun/@745042 | 403g | veri/dersler.json:443 veri/dersler.json:834 veri/dersler.json:8334 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/1968Natur.218..731G/abstract | 405g | veri/dersler.json:19901 arastirma/dersler_v2/d45_kaynak.md:6 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2013ForPh..61..781M/abstract | 405g | arastirma/dersler_v2/d56_kaynak.md:94 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2018Natur.563...85H/abstract | 405g | veri/dersler.json:21992 veri/dersler.json:22319 veri/dersler.json:22691 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2019NatAs...3.1013S | 405g | veri/dersler.json:15549 arastirma/dersler_v2/d23_kaynak.md:215 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2019Natur.569..688M/abstract | 405g | veri/dersler.json:36679 arastirma/dersler_v2/d52_kaynak.md:6 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2020A%26A...641A...6P/abstract | 405g | veri/deney_rehber.json:1684 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2020Sci...369.1110P | 405g | veri/dersler.json:5729 arastirma/dersler_v2/d34_kaynak.md:5 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2021NatAs.tmp...74M | 405g | veri/dersler.json:9000 veri/dersler.json:9266 arastirma/dersler_v2/d35_kaynak.md:76 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2021Sci...371.1046M | 405g | veri/dersler.json:20320 veri/dersler.json:20659 arastirma/dersler_v2/d16_kaynak.md:113 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2023PhRvL.130g1801F | 405g | arastirma/dersler_v2/d29_kaynak.md:7 |
| erisilemedi | 405 | https://ui.adsabs.harvard.edu/abs/2024ApJ...964..171B/abstract | 405g | veri/dersler.json:19344 arastirma/dersler_v2/d6_kaynak.md:245 |
| erisilemedi | baglanti | https://vmexoweb2.ipac.caltech.edu/docs/exonews_archive.html |  | veri/dersler.json:27735 veri/dersler.json:28003 arastirma/dersler_v2/d13_kaynak.md:54 |
| erisilemedi | baglanti | https://web.itu.edu.tr/barka/pubs/ist_haz2/ist_seismhaz.html |  | veri/dersler.json:7246 arastirma/dersler_v2/d44_kaynak.md:5 |
| erisilemedi | 525 | https://wiki.krisyotam.com/content/wikipedia_en_all_nopic_2026-03/1P/Halley | 525g | arastirma/dersler_v2/d19_kaynak.md:222 arastirma/dersler_v2/d19_kaynak.md:264 arastirma/dersler_v2/d19_kaynak.md:265 |
| erisilemedi | 403 | https://wikiwand.com/EN/New_Horizons | 403g | veri/dersler.json:12499 veri/dersler.json:12755 arastirma/dersler_v2/d41_kaynak.md:58 |
| erisilemedi | 403 | https://wikiwand.com/en/Wormhole | 403g | veri/dersler.json:36927 veri/dersler.json:37168 arastirma/dersler_v2/d56_kaynak.md:6 |
| erisilemedi | 403 | https://wikiwand.com/en/articles/Meridian_(astronomy) | 403g | veri/dersler.json:850 arastirma/dersler_v2/d1_kaynak.md:169 arastirma/dersler_v2/d1_kaynak.md:170 |
| erisilemedi | 403 | https://wikiwand.com/en/articles/Rogers_Commission | 403g | veri/dersler.json:32845 veri/dersler.json:33107 arastirma/dersler_v2/d29_kaynak.md:7 |
| erisilemedi | 403 | https://wikiwand.com/en/ocean | 403g | veri/dersler.json:7310 arastirma/dersler_v2/d34_kaynak.md:180 arastirma/dersler_v2/d44_kaynak.md:5 |
| erisilemedi | 403 | https://windows2universe.org/jupiter/atmosphere/J_clouds_decks.html | 403g | veri/dersler.json:10457 arastirma/dersler_v2/d37_kaynak.md:76 |
| erisilemedi | 504 | https://www.3dincites.com/2018/02/invention-tunneling-based-flash-memory/ | 504g | veri/dersler.json:32503 arastirma/dersler_v2/d28_kaynak.md:84 arastirma/dersler_v2/d28_kaynak.md:121 |
| erisilemedi | 403 | https://www.amnh.org/learn-teach/curriculum-collections/earth-inside-and-out/inge-lehmann-discoverer-of-the-earth-s-inner-core | 403g | veri/dersler.json:7206 arastirma/dersler_v2/d44_kaynak.md:5 |
| erisilemedi | 403 | https://www.aps.org/apsnews/2004/08/discovery-positron-1932 | 403g | veri/dersler.json:34283 arastirma/dersler_v2/d32_kaynak.md:112 arastirma/dersler_v2/d32_kaynak.md:135 |
| erisilemedi | 403 | https://www.aps.org/apsnews/2010/05/physics-history | 403g | veri/dersler.json:32531 arastirma/dersler_v2/d28_kaynak.md:117 |
| erisilemedi | 403 | https://www.aps.org/apsnews/2014/12/historic-sites-muon-time-dilation-experiment | 403g | veri/dersler.json:30755 arastirma/dersler_v2/d25_kaynak.md:66 |
| erisilemedi | 403 | https://www.aps.org/apsnews/2016/06/coulomb-measures-electric-force | 403g | veri/dersler.json:29826 veri/dersler.json:30101 arastirma/dersler_v2/d33_kaynak.md:5 |
| erisilemedi | 403 | https://www.aps.org/funding-recognition/historic-sites/holmdel-horn-antenna | 403g | veri/dersler.json:25186 arastirma/dersler_v2/d58_kaynak.md:5 |
| erisilemedi | 403 | https://www.astro.oma.be/planetarium/cg/files/Prantzos2010.pdf | 403g | veri/dersler.json:32833 veri/dersler.json:33095 arastirma/dersler_v2/d29_kaynak.md:7 |
| erisilemedi | baglanti | https://www.astro.sunysb.edu/fwalter/AST101/k-h.html |  | veri/dersler.json:17720 arastirma/dersler_v2/d5_kaynak.md:207 arastirma/dersler_v2/d5_kaynak.md:310 |
| erisilemedi | baglanti | https://www.astro.utu.fi/~cflynn/galdyn/l13.html |  | veri/dersler.json:16655 veri/dersler.json:16977 arastirma/dersler_v2/d14_kaynak.md:158 |
| erisilemedi | 403 | https://www.britannica.com/biography/Aristarchus-of-Samos | 403g | veri/dersler.json:27346 arastirma/dersler_v2/d20_kaynak.md:72 |
| erisilemedi | 403 | https://www.britannica.com/biography/Galileo-Galilei/Telescopic-discoveries | 403g | veri/dersler.json:27430 |
| erisilemedi | 403 | https://www.britannica.com/biography/Max-Born | 403g | veri/dersler.json:31915 arastirma/dersler_v2/d27_kaynak.md:113 |
| erisilemedi | 403 | https://www.britannica.com/event/Project-Ozma | 403g | veri/dersler.json:28894 arastirma/dersler_v2/d18_kaynak.md:89 |
| erisilemedi | 403 | https://www.britannica.com/place/Jupiter-planet/The-interior | 403g | veri/dersler.json:6626 veri/dersler.json:10441 arastirma/dersler_v2/d37_kaynak.md:40 |
| erisilemedi | 403 | https://www.britannica.com/place/Saturn-planet/The-interior | 403g | veri/dersler.json:11056 arastirma/dersler_v2/d37_kaynak.md:31 arastirma/dersler_v2/d38_kaynak.md:20 |
| erisilemedi | 403 | https://www.britannica.com/print/article/687804 | 403g | veri/dersler.json:10220 veri/dersler.json:10497 arastirma/dersler_v2/d37_kaynak.md:126 |
| erisilemedi | 403 | https://www.britannica.com/science/21-centimetre-radiation | 403g | veri/dersler.json:22313 veri/dersler.json:22687 arastirma/dersler_v2/d7_kaynak.md:234 |
| erisilemedi | 403 | https://www.britannica.com/science/Feynman-diagram | 403g | arastirma/dersler_v2/d29_kaynak.md:7 |
| erisilemedi | 403 | https://www.britannica.com/science/calendar/The-Gregorian-calendar | 403g | veri/dersler.json:8670 arastirma/dersler_v2/d22_kaynak.md:5 |
| erisilemedi | 403 | https://www.cambridge.org/turnleft/pages/the_planets/jupiter_and_saturn_2027 | 403g | veri/dersler.json:5124 veri/dersler.json:28838 arastirma/dersler_v2/d18_kaynak.md:60 |
| erisilemedi | 403 | https://www.cambridge.org/turnleft/pages/the_planets/mercury_and_venus | 403g | veri/dersler.json:6590 veri/dersler.json:9290 arastirma/dersler_v2/d35_kaynak.md:132 |
| erisilemedi | 403 | https://www.congress.gov/crs-product/R48643 | 403g | veri/dersler.json:28914 arastirma/dersler_v2/d12_kaynak.md:244 arastirma/dersler_v2/d18_kaynak.md:150 |
| erisilemedi | 403 | https://www.crick.ac.uk/research/publications/direct-detection-of-a-single-photon-by-humans | 403g | veri/dersler.json:31879 arastirma/dersler_v2/d27_kaynak.md:73 |
| erisilemedi | 503 | https://www.diariobitcoin.com/noticias/nasa-reactiva-sus-misiones-a-venus-y-adelanta-el-lanzamiento-de-davinci/ | 503g | arastirma/dersler_v2/d35_kaynak.md:126 |
| erisilemedi | 403 | https://www.discovermagazine.com/at-the-bottom-of-earths-orbit-22665 | 403g | veri/dersler.json:527 veri/dersler.json:894 veri/dersler.json:1682 |
| erisilemedi | 403 | https://www.discovermagazine.com/why-are-there-no-green-stars-848 | 403g | veri/dersler.json:1658 arastirma/dersler_v2/d2_kaynak.md:223 arastirma/dersler_v2/d2_kaynak.md:224 |
| erisilemedi | 403 | https://www.esrf.fr/news/general/Earth-Center-Hotter | 403g | veri/dersler.json:6945 veri/dersler.json:7222 arastirma/dersler_v2/d44_kaynak.md:5 |
| erisilemedi | 403 | https://www.feynmanlectures.caltech.edu/I_26.html | 403g | arastirma/dersler_v2/d29_kaynak.md:192 |
| erisilemedi | 403 | https://www.ias.edu/node/201536 | 403g | veri/dersler.json:36647 arastirma/dersler_v2/d52_kaynak.md:6 |
| erisilemedi | cok-yonlendirme | https://www.iau.org/common/Uploaded%20files/IAUGA2015-Resolution-B3-recommended-nominal-conversion.pdf | https://www.iau.org/asicommon/controls/shared/formsauthentication/login.aspx?ReturnUrl=%2fasicommon%2fcontrols%2fshared%2fformsauthentication%2flogin.aspx%3fReturnUrl%3d%252Fasicommon%252Fcontrols%252Fshared%252Fformsauthentication%252Flogin.aspx%253FReturnUrl%253D%25252Fasicommon%25252Fcontrols%25252Fshared%25252Fformsauthentication%25252Flogin.aspx%25253FReturnUrl%25253D%2525252Fasicommon%2525252Fcontrols%2525252Fshared%2525252Fformsauthentication%2525252Flogin.aspx%2525253FReturnUrl%2525253D%252525252Fasicommon%252525252Fcontrols%252525252Fshared%252525252Fformsauthentication%252525252Flogin.aspx%252525253FReturnUrl%252525253D%25252525252Fasicommon%25252525252Fcontrols%25252525252Fshared%25252525252Fformsauthentication%25252525252Flogin.aspx%25252525253FReturnUrl%25252525253D%2525252525252Fasicommon%2525252525252Fcontrols%2525252525252Fshared%2525252525252Fformsauthentication%2525252525252Flogin.aspx%2525252525253FReturnUrl%2525252525253D%252525252525252Fcommon%252525252525252FUploaded%2525252525252Bfiles%252525252525252FIAUGA2015-Resolution-B3-recommended-nominal-conversion.pdf | veri/dersler.json:17660 veri/deney_rehber.json:146 veri/deney_rehber.json:795 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/images/pia21919-ahuna-mons | 403g | veri/dersler.json:12831 arastirma/dersler_v2/d41_kaynak.md:144 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/images/pia26751-nasas-juno-misson-captures-jupiter-moon-thebe/ | 403g | veri/dersler.json:10529 arastirma/dersler_v2/d37_kaynak.md:189 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/missions/galileo/ | 403g | veri/dersler.json:6562 veri/dersler.json:10505 arastirma/dersler_v2/d37_kaynak.md:121 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/missions/veritas | 403g | arastirma/dersler_v2/d35_kaynak.md:128 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/ | 403g | arastirma/dersler_v2/d36_kaynak.md:24 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/news/nasas-dawn-mission-to-asteroid-belt-comes-to-end | 403g | arastirma/dersler_v2/d41_kaynak.md:140 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/news/nasas-juno-spacecraft-in-orbit-around-mighty-jupiter/ | 403g | veri/dersler.json:6510 arastirma/dersler_v2/d37_kaynak.md:142 arastirma/dersler_v2/d9_kaynak.md:126 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/news/nasas-magellan-data-reveals-volcanic-activity-on-venus/ | 403g | veri/dersler.json:9030 veri/dersler.json:9274 arastirma/dersler_v2/d35_kaynak.md:92 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/news/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/ | 403g | veri/dersler.json:27789 veri/dersler.json:28103 arastirma/dersler_v2/d13_kaynak.md:75 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/news/saturn-surprises-as-cassini-continues-its-grand-finale/ | 403g | veri/dersler.json:11068 arastirma/dersler_v2/d38_kaynak.md:29 arastirma/dersler_v2/d38_kaynak.md:110 |
| erisilemedi | 403 | https://www.jpl.nasa.gov/news/scientists-finally-know-what-time-it-is-on-saturn/ | 403g | veri/dersler.json:10812 veri/dersler.json:11064 arastirma/dersler_v2/d38_kaynak.md:27 |
| erisilemedi | 500 | https://www.lamptech.co.uk/Documents/SO%20Spectral.htm | 500g | veri/dersler.json:1302 veri/dersler.json:1678 arastirma/dersler_v2/d2_kaynak.md:311 |
| erisilemedi | baglanti | https://www.ligo.caltech.edu/page/press-release-2017-nobel-prize |  | veri/dersler.json:20599 arastirma/dersler_v2/d16_kaynak.md:54 arastirma/dersler_v2/d16_kaynak.md:65 |
| erisilemedi | baglanti | https://www.ncei.noaa.gov/products/magnetic-declination |  | veri/dersler.json:7286 arastirma/dersler_v2/d33_kaynak.md:131 arastirma/dersler_v2/d44_kaynak.md:5 |
| erisilemedi | baglanti | https://www.parkes.atnf.csiro.au/people/sar049/3C273/ |  | veri/dersler.json:22991 veri/dersler.json:22997 veri/dersler.json:23272 |
| erisilemedi | 403 | https://www.pbs.org/wgbh/aso/databank/entries/dp65co.html | 403g | veri/dersler.json:25190 arastirma/dersler_v2/d58_kaynak.md:5 |
| erisilemedi | 400 | https://www.physics.nist.gov/cuu/pdf/wall_2022.pdf | 400g | veri/dersler.json:33035 arastirma/dersler_v2/d29_kaynak.md:7 |
| erisilemedi | 403 | https://www.pnas.org/doi/10.1073/pnas.15.3.168 | 403g | veri/dersler.json:24627 |
| erisilemedi | 403 | https://www.science.org/content/article/nasa-s-mars-sample-return-mission-dead | 403g | arastirma/dersler_v2/d12_kaynak.md:245 arastirma/dersler_v2/d18_kaynak.md:151 arastirma/dersler_v2/d5_kaynak.md:169 |
| erisilemedi | 403 | https://www.spacedaily.com/reports/Chelyabinsk_asteroid_measured_12000_tonnes_999.html | 403g | veri/dersler.json:14872 arastirma/dersler_v2/d43_kaynak.md:6 |
| erisilemedi | baglanti | https://www.theory.physics.manchester.ac.uk/~mikeb/lecture/phys30121/feynman.pdf |  | veri/dersler.json:33079 arastirma/dersler_v2/d29_kaynak.md:7 |
| erisilemedi | 403 | https://www.timeanddate.com/astronomy/measuring-the-sky-by-hand.html | 403g | veri/dersler.json:2000 veri/dersler.json:2324 arastirma/dersler_v2/d11_kaynak.md:82 |
| erisilemedi | 403 | https://www.timeanddate.com/news/time/turkey-permanent-trt.html | 403g | veri/dersler.json:8626 veri/dersler.json:13700 arastirma/dersler_v2/d19_kaynak.md:299 |
| erisilemedi | 403 | https://www.timeanddate.com/news/time/turkey-scraps-dst-2016.html | 403g | veri/dersler.json:8630 arastirma/dersler_v2/d22_kaynak.md:71 |
| erisilemedi | 403 | https://www.wikiwand.com/en/Inner_core | 403g | veri/dersler.json:6939 veri/dersler.json:7218 arastirma/dersler_v2/d44_kaynak.md:5 |
| erisilemedi | 403 | https://www.wikiwand.com/en/articles/Magnetar | 403g | veri/dersler.json:19655 veri/dersler.json:19937 arastirma/dersler_v2/d45_kaynak.md:6 |
| erisilemedi | 403 | https://www.wikiwand.com/en/articles/Starburst_galaxy | 403g | veri/dersler.json:22731 arastirma/dersler_v2/d7_kaynak.md:291 |
| erisilemedi | 403 | https://www.wikiwand.com/en/articles/Supermoon | 403g | veri/dersler.json:7660 veri/dersler.json:7979 arastirma/dersler_v2/d10_kaynak.md:267 |
| erisilemedi | 403 | https://zh.mindat.org/locentry-1111557.html | 403g | arastirma/dersler_v2/d43_kaynak.md:153 |
| atlandi | celestrak | https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle |  | veri/deney_rehber.json:320 arastirma/dersler_v2/d23_kaynak.md:188 |
| atlandi | celestrak | https://celestrak.org/NORAD/elements/gp.php?CATNR=48274&FORMAT=tle |  | arastirma/dersler_v2/d23_kaynak.md:192 |
| atlandi | celestrak | https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json |  | veri/dersler.json:15649 |
| atlandi | celestrak | https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle |  | arastirma/dersler_v2/d23_kaynak.md:258 |
