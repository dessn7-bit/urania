# Dürbün hedefleri – konum ve parlaklık doğrulaması

Oluşturma: 2026-10-27. Kontrol edilen dosyalar: `gokyuzu/messier.json`, `gokyuzu/dsos.bright.json`, `gokyuzu/stars.6.json` (ofrohn/d3-celestial, commit 7e720a3, 2022-07-05).

## Kaynaklar (bu oturumda indirildi)

| Kısa ad | Kaynak | Bağımsızlık |
|---|---|---|
| SIMBAD | CDS SIMBAD, `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=<ad>&output.format=ASCII` (ICRS, J2000) | Referans kabul edildi |
| SEDS | H. Frommert / SEDS Messier sayfaları `http://messier.seds.org/m/mNNN.html`, `.../xtra/ngc/n0869.html`, `.../xtra/ngc/mel111.html` (RA/Dec 0.1 dk / 1 yay dk hassasiyetinde) | d3-celestial `messier.json` README'ye göre SEDS `data.html`'den türetilmiş → d3 Messier konumlarıyla bağımsız değil |
| OpenNGC | github.com/mattiaverga/OpenNGC (CC-BY-SA-4.0), commit be3cd6c (2026-10-18), `NGC.csv` + `addendum.csv` | Konumlar çoğunlukla NED (kaynak kodu 1), bazı V kadirleri SIMBAD'dan (kod 2) → V kadirinde SIMBAD ile kısmen bağımlı |
| BSC | Yale Bright Star Catalogue 5. baskı, VizieR V/50 (yıldızlar için) | Bağımsız |
| Wikidata | query.wikidata.org SPARQL – Türkçe etiket ve tr.wikipedia bağlantısı | Yalnız ad için |

Eşik: SIMBAD konumundan **açısal ayrım > 0.1°** olan her kaynak aşağıda işaretlendi. RA/Dec derece, J2000/ICRS.

## Sonuç tablosu

| id | Türkçe ad (tr.wikipedia madde girişi) | İngilizce ad (SIMBAD NAME) | RA (°) | Dec (°) | kadir (kaynaklara göre) | tür (SIMBAD) | görünür boyut | SIMBAD'a ≤0.1° uyan kaynaklar |
|---|---|---|---|---|---|---|---|---|
| M45 | Ülker | Pleiades, Seven Sisters | 56.6008 | +24.1139 | d3 1.2; d3b 1.2; seds 1.6; openngc 1.20 | açık küme | SIMBAD 76.86'; SEDS 110.0'; OpenNGC 150x150'; d3 110' | SIMBAD |
| M42 | Orion Bulutsusu (Avcı Bulutsusu) | Great Orion Nebula, Ori Nebula, Orion Nebula | 83.8200 | -5.3875 | d3 4; d3b 4; seds 4.0; openngc 4.00 | HII bölgesi (bulutsu) | SIMBAD 66.0'; SEDS 85x60'; OpenNGC 90x60'; d3 66x60' | SIMBAD, d3, d3b, seds, openngc |
| M31 | Andromeda Galaksisi | Andromeda, Andromeda Galaxy, And Nebula, Andromeda Nebula | 10.6847 | +41.2687 | SIMBAD 3.44; d3 3.4; d3b 3.4; seds 3.4; openngc 3.44 | galaksi (AGN) | SIMBAD 199.53'; SEDS 178x63'; OpenNGC 177.83x69.66'; d3 190x60' | SIMBAD, d3, d3b, seds, openngc |
| M44 | Arıkovanı yıldız kümesi (Praesepe) | Beehive, Praesepe, Praesepe Cluster | 130.0542 | +19.6211 | d3 3.1; d3b 3.1; seds 3.7; openngc 3.10 | açık küme | SIMBAD 118.2'; SEDS 95.0'; OpenNGC 108.6'; d3 95' | SIMBAD, d3b, openngc |
| M13 | Herkül'deki Büyük Yıldız Kümesi | Hercules Globular Cluster | 250.4235 | +36.4613 | SIMBAD 5.8; d3 5.9; seds 5.8; openngc 5.80 | küresel küme | SIMBAD 33.00'; SEDS 20.0'; OpenNGC 16.5'; d3 17' | SIMBAD, d3, seds, openngc |
| M8 | Deniz Kulağı Bulutsusu | Lagoon, Lagoon Nebula | 270.9042 | -24.3867 | d3 5.8; d3b 5; seds 4.6; openngc 5.80 | açık küme | SEDS 90x40'; OpenNGC 45x30'; d3 90x40' | SIMBAD, d3, d3b, seds, openngc |
| M7 | Ptolemy (Batlamyus) yıldız kümesi | Ptolemy's Cluster | 268.4471 | -34.8411 | d3 3.3; d3b 3.3; seds 3.3; openngc 3.30 | açık küme | SIMBAD 100.1'; SEDS 80.0'; OpenNGC 22.2'; d3 80' | SIMBAD, d3, d3b, seds, openngc |
| M6 | Kelebek Yıldız Kümesi | Butterfly Cluster | 265.0692 | -32.2419 | d3 4.2; d3b 4.2; seds 4.2; openngc 4.20 | açık küme | SIMBAD 20.00'; SEDS 25.0'; OpenNGC 15.6'; d3 15' | SIMBAD, d3, d3b, seds, openngc |
| M22 | bulamadım | — | 279.0998 | -23.9047 | d3 5.1; seds 5.1 | küresel küme | SIMBAD 24.0'; SEDS 32.0'; OpenNGC 12.6'; d3 24' | SIMBAD, d3, seds, openngc |
| M35 | bulamadım | — | 92.2721 | +24.3361 | d3 5.1; seds 5.3 | açık küme | SIMBAD 38.3'; SEDS 28.0'; OpenNGC 24'; d3 28' | SIMBAD, d3, seds, openngc |
| M36 | bulamadım | — | 84.0842 | +34.1350 | SIMBAD 6.0; d3 6; seds 6.3; openngc 6.00 | açık küme | SIMBAD 120.0'; SEDS 12.0'; OpenNGC 7.2'; d3 12' | SIMBAD, d3, seds, openngc |
| M37 | bulamadım | — | 88.0742 | +32.5450 | d3 5.6; seds 6.2; openngc 5.60 | açık küme | SIMBAD 19.3'; SEDS 24.0'; OpenNGC 11.4'; d3 24' | SIMBAD, d3, seds, openngc |
| M38 | bulamadım | — | 82.1671 | +35.8239 | SIMBAD 6.4; d3 6.4; seds 7.4; openngc 6.40 | açık küme | SIMBAD 19.6'; SEDS 21.0'; OpenNGC 9.6'; d3 21' | SIMBAD, d3, seds, openngc |
| M39 | bulamadım | — | 322.8892 | +48.2469 | d3 4.6; seds 4.6; openngc 4.60 | açık küme | SIMBAD 120.4'; SEDS 32.0'; OpenNGC 19.5'; d3 32' | SIMBAD |
| M11 | Yaban Ördeği Yıldız Kümesi | Amas de l'Ecu de Sobieski, Wild Duck Cluster | 282.7658 | -6.2719 | SIMBAD 5.8; d3 5.8; seds 5.8; openngc 5.80 | açık küme | SIMBAD 8.9'; SEDS 14.0'; OpenNGC 9'; d3 14' | SIMBAD, d3, seds, openngc |
| M27 | Halter Bulutsusu | Diabolo Nebula, Dumbbell Nebula | 299.9015 | +22.7212 | SIMBAD 14.089; d3 8.1; seds 7.4; openngc 7.40 | gezegenimsi bulutsu | SIMBAD 6.7'; SEDS 8.0x5.7'; OpenNGC 6.7'; d3 8x4' | SIMBAD, d3, seds, openngc |
| M92 | bulamadım | — | 259.2808 | +43.1359 | SIMBAD 6.52; d3 6.5; seds 6.4; openngc 6.52 | küresel küme | SIMBAD 11.2'; SEDS 14.0'; OpenNGC 14.4'; d3 11' | SIMBAD, d3, seds, openngc |
| M3 | bulamadım | — | 205.5484 | +28.3773 | SIMBAD 6.39; d3 6.4; seds 6.2; openngc 6.39 | küresel küme | SIMBAD 16.2'; SEDS 18.0'; OpenNGC 16.2'; d3 16' | SIMBAD, d3, seds, openngc |
| M5 | bulamadım | — | 229.6384 | +2.0810 | SIMBAD 5.95; d3 5.8; seds 5.6; openngc 5.95 | küresel küme | SIMBAD 17.4'; SEDS 23.0'; OpenNGC 15'; d3 17' | SIMBAD, d3, seds, openngc |
| NGC 869 | Perseus Çift Kümesi – h Persei (batı) | h Per Cluster, h Persei Cluster | 34.7408 | +57.1339 | d3b 3.8; seds 4.3; openngc 3.70 | açık küme | SIMBAD 16.3'; SEDS 30'; OpenNGC 14.4'; d3b 30' | SIMBAD, d3b, seds, openngc |
| NGC 884 | Perseus Çift Kümesi – χ Persei (doğu) | chi Per Cluster, chi Persei Cluster, khi Per Cluster | 35.5842 | +57.1489 | d3b 3.8; openngc 3.80; seds 4.4 | açık küme | SIMBAD 15.0'; OpenNGC 10.5'; d3b 30'; SEDS 30' | SIMBAD, seds, openngc |
| Mel 111 | Saç Yıldız Kümesi | Coma Berenices Cluster, Coma Ber Cluster, Coma Star Cluster | 186.0142 | +25.6519 | d3b 1.8; seds 1.8 | açık küme | SEDS 275'; OpenNGC 253.5'; d3b 275' | SIMBAD |
| Cl Collinder 399 | bulamadım | Coathanger, Brocchi's Cluster, AL SUFI's Cluster | 291.3500 | +20.1833 | SIMBAD 3.6; d3b 3.6; openngc 3.60 | yıldız kümesi / asterizm | OpenNGC 70'; d3b 60' | SIMBAD, openngc |
| Albireo A (bet01 Cyg) | Albireo | — | 292.6803 | +27.9597 | SIMBAD 3.08; d3★ 3.05; BSC 3.08 | çift/çoklu yıldız | — | SIMBAD, d3★, BSC |
| Albireo B (bet02 Cyg) | Albireo | — | 292.6891 | +27.9653 | SIMBAD 5.11; d3★ 5.12; BSC 5.11 | Be yıldızı | — | SIMBAD, d3★, BSC |
| Mizar A (zet01 UMa) | Mizar | — | 200.9814 | +54.9254 | SIMBAD 2.220; d3★ 2.23; BSC 2.27 | tayfsal çift yıldız | — | SIMBAD, d3★, BSC |
| Mizar B (zet02 UMa) | Mizar | — | 200.9847 | +54.9218 | SIMBAD 3.88; BSC 3.95 | tayfsal çift yıldız | — | SIMBAD, BSC |
| Alcor (80 UMa) | Alcor | — | 201.3064 | +54.9880 | SIMBAD 4.010; d3★ 3.99; BSC 4.01 | çift/çoklu yıldız | — | SIMBAD, d3★, BSC |

Kısaltmalar: d3 = `messier.json`, d3b = `dsos.bright.json`, d3★ = `stars.6.json` (HIP), BSC = Bright Star Catalogue. SIMBAD küme kayıtlarında çoğu zaman V kadiri yok; bu durumda SIMBAD kadiri listede yer almaz.

## 0.1°'den büyük konum farkları

| hedef | kaynak | SIMBAD'a açısal ayrım (°) | değerlendirme |
|---|---|---|---|
| M45 | d3_messier | 0.136 | d3 = SEDS (03:47.0, +24:07). SIMBAD merkezi Gaia üyeliğinden (2021A&A...647A..19T). ~2° çaplı kümede pratik etkisi yok. |
| M45 | d3_bright | 0.132 | Aynı durum. |
| M45 | seds | 0.136 | Aynı durum. |
| M45 | openngc | 0.245 | OpenNGC 03:47:28.6; SIMBAD'dan 0.245°, SEDS'ten 0.109°. Üç farklı merkez tanımı var. |
| M44 | d3_messier | 0.363 | **d3 messier.json = SEDS (08:40.1, +19:59)**; SIMBAD (+19:37), OpenNGC (+19:40), d3 dsos.bright (+19:40) birbirine 0.07° içinde. SEDS/d3 Dec değeri ~0.3° kuzeyde → düzeltme önerilir (+19.62…+19.67). |
| M44 | seds | 0.363 | Yukarıdaki ile aynı (SEDS Dec +19°59'). |
| M39 | d3_messier | 0.215 | d3 = SEDS (21:32.2, +48:26). OpenNGC (+48:26) SEDS ile uyumlu; SIMBAD (+48:14.8, Gaia üye merkezi) 0.2° güneyde. 32' boyutlu küme için kabul edilebilir; kaynaklar arası belirsizlik. |
| M39 | seds | 0.215 | Aynı durum. |
| M39 | openngc | 0.196 | OpenNGC SEDS'e yakın. |
| NGC 884 | d3_bright | 0.247 | **d3 dsos.bright.json hatalı**: RA 35.13° (02:20.5). SIMBAD 35.58°, OpenNGC 35.63°, SEDS 35.60° (02:22.4) birbiriyle 0.03° içinde. Düzeltme önerilir: RA ≈ 35.58°. |
| Mel 111 | d3_bright | 0.519 | d3b (186.27, +26.12) SEDS (12:25, +26:00) ve OpenNGC (186.275, +26.10) ile uyumlu; SIMBAD merkezi (186.01, +25.65) Gaia üyelik merkezi, 0.5° güneyde. ~4.5° çaplı kümede belirsizlik; tek "doğru" merkez yok. |
| Mel 111 | seds | 0.408 | Aynı durum. |
| Mel 111 | openngc | 0.506 | Aynı durum. |
| Cl Collinder 399 | d3_bright | 0.21 | d3b (19:26.2, +20:06) ↔ SIMBAD/OpenNGC (19:25:24, +20:11). OpenNGC ve Deep Sky Corner değerleri SIMBAD kaynaklı (bağımsız değil). Bağımsız ikinci kaynak bulamadım; SEDS'te Cr 399 sayfası yok (404). ~1° boyutlu asterizm için 0.21° fark küçük ama SIMBAD değeri tercih edilmeli. |

## Kadir (parlaklık) farkları ≥ 0.3 mag

| hedef | değerler | değerlendirme |
|---|---|---|
| M45 | d3 1.2, d3b 1.2, OpenNGC 1.20 (HEASARC messier), SEDS 1.6 | SEDS sayfası 1.6 diyor; diğerleri 1.2. İki farklı katalog değeri. |
| M44 | d3 3.1, d3b 3.1, OpenNGC 3.10 (SIMBAD kaynaklı), SEDS 3.7 | d3 ile OpenNGC uyumlu, SEDS farklı. |
| M8 | d3 5.8, d3b 5.0, SEDS 4.6, OpenNGC V 5.80 / B 5.00 | Bulutsu için kadir değerleri tutarsız; d3 iki dosyası kendi içinde de farklı (5.8 vs 5.0). |
| M37 | d3 5.6, OpenNGC 5.60, SEDS 6.2 | d3 = OpenNGC. |
| M38 | d3 6.4, SIMBAD 6.4, OpenNGC 6.40, SEDS 7.4 | SEDS 7.4 aykırı; d3 doğru görünüyor. |
| M27 | d3 8.1, SEDS 7.4, OpenNGC 7.40 (HyperLeda), SIMBAD V 14.089 (merkez yıldız, bulutsu değil) | **d3 8.1 aykırı**; 7.4 önerilir. |
| M36 | d3 6.0, SIMBAD 6.0, OpenNGC 6.00, SEDS 6.3 | d3 doğru görünüyor. |
| NGC 869 | d3b 3.8, OpenNGC 3.70, SEDS 4.3 | — |
| NGC 884 | d3b 3.8, OpenNGC 3.80, SEDS 4.4 | — |
| M5 | d3 5.8, SIMBAD 5.95, OpenNGC 5.95, SEDS 5.6 | 0.15–0.35 aralığında. |

## Yıldızlar (Albireo, Mizar/Alcor)

Albireo A/B, Mizar A ve Alcor için d3 `stars.6.json` (HIP 95947, 95951, 65378, 65477), SIMBAD ve BSC (HR 7417, 7418, 5054, 5062) konumları 0.001° içinde; V kadirleri 0.07 mag içinde uyumlu. Mizar B (HR 5055, V 3.88–3.95) d3 `stars.6.json` içinde ayrı kayıt olarak yok.

Hesaplanan açısal ayrımlar (SIMBAD konumlarından, bu oturumda): Albireo A–B 34.6", Mizar A–B 14.4", Mizar A–Alcor 11.81'.

## d3-celestial dosyalarında bulunan, hedef listesi dışındaki hata

- `dsos.bright.json` içinde **NGC 6121 (M4)** koordinatı `[83.82, -26.533]` (RA 05:35). SIMBAD M4: 16 23 35.22 −26 31 32.7 (RA 245.90°); `messier.json`'daki M4 doğru (`[-114.1, -26.5333]` = 245.9°). dsos.bright'taki RA değeri M42'ninkiyle aynı — kopyalama hatası. Kullanılacaksa düzeltilmeli.

## Doğrulanamayanlar

- Collinder 399: SIMBAD'dan bağımsız ikinci konum/kadir kaynağı bulamadım (OpenNGC ve Deep Sky Corner SIMBAD'ı kaynak gösteriyor; SEDS sayfası yok).
- Kümelerde "doğru" merkez tanımı kaynağa göre değişiyor (Gaia üye ortalaması vs. klasik görsel merkez); M45, M39, Mel 111 farkları bu nedenle.
- Türkçe ad bulunamayanlar: Collinder 399 (tr.wikipedia'da madde yok) ve M22, M35, M36, M37, M38, M39, M92, M3, M5 (Türkçe maddeleri yalnız "Messier N" adını veriyor). Türkçe adlar tr.wikipedia madde giriş cümlelerinden alındı (alıntılar `hedefler_dogrulanmis.json` içinde); uydurulmadı.
