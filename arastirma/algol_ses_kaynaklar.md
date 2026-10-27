# Algol gözlenmiş minimumları + Android Chrome Türkçe ses (speechSynthesis) – kaynaklı araştırma

Erişim tarihi (tüm kaynaklar): **2026-10-27**. Ham sayfa/PDF'ler bu oturumda `curl` ile indirildi; `curl` ile açılmayanlar WebFetch ile okundu ve öyle işaretlendi.
"**Kendi hesap**" yazan her satır kaynak DEĞİLDİR: kaynaktaki sayılardan Python + astropy 8.0.2 ile hesaplandı (HJD↔JD dönüşümünde Algol için heliyosentrik ışık-zamanı düzeltmesi uygulandı, UTC; TT−UT farkı yok sayıldı).
Bu dosya `algol_ortme_kaynaklar.md`'yi tamamlar (o dosyadaki efemeris tablosu burada tekrarlanmadı).

Erişilemeyen / saygı gösterilen engeller: VarAstro gözlem listesi ve O-C grafiği API'si (`/api/Search/Observations`, `/api/charts/ocdiagram/17960` → **401**, giriş gerekli; denenmedi/zorlanmadı); eski O-C Gateway adresi `var.astro.cz/ocgate/...` → 404 (VarAstro'ya taşınmış); Sky & Telescope "Sky at a Glance 23 Eki–1 Kas" sayfası (WebFetch client_error); XDA forum (403); Wikipedia API (rate limit → tekrar denenmedi).

---

## A. Algol (β Per) – gözlenmiş minimum zamanları 2020–2025

### A1. Tek tek gözlenmiş minimumlar (kaynakta yazan değerler)

Zaman ölçeği: tüm kaynaklar **HJD (UTC)** veriyor (JAAVSO tablosunda sütun başlığı "JD (min) Hel.", Cook 2026'da "Heliocentric Min. JD 2400000+", BAVM 262'de "heliocentric UTC timings", VarAstro'da "HJD min"). **BJD_TDB veren kaynak bulamadım.**

| # | HJD (min) | ± (gün) | Yöntem / filtre / gözlemci | Kaynak (URL) |
|---|---|---|---|---|
| 1 | 2459212.6174 | 0.0005 | CCD, TG filtresi, J. A. Howell (Kwee–van Woerden) | Samolyk, JAAVSO 52 (2024) "Recent Minima of 239 Eclipsing Binary Stars" — https://apps.aavso.org/jaavso/article/3933/ (PDF: https://apps.aavso.org/media/jaavso/3933.pdf) |
| 2 | 2459579.6342 | 0.0001 | CCD, V, S. Dvorak | Samolyk, JAAVSO 50 (2022) "Recent Minima of 227 EB Stars" — https://apps.aavso.org/jaavso/article/3825 (PDF: https://apps.aavso.org/media/jaavso/3825_u2Jl14a.pdf) |
| 3 | 2459989.6630 | 0.0003 | CCD, V, G. Samolyk | Samolyk, JAAVSO 51 (2023) "Recent Minima of 229 EB Stars" — https://apps.aavso.org/jaavso/article/3904 (PDF: https://apps.aavso.org/media/jaavso/3904_VxgRKZ3.pdf) |
| 4 | 2460144.50 | — (2 ondalık) | Görsel, W. Spiess (Ertingen), n=14 | BAV Mitteilungen 262 = BAV Journal 093 (Nisan 2024) — https://www.bav-astro.de/images/Up_Journal/BAVJ093_BAVM262_V2.pdf |
| 5 | 2460167.44 | — | Görsel, W. Spiess, n=14 | aynı |
| 6 | 2460213.32 | — | Görsel, W. Spiess, n=11 | aynı |
| 7 | 2460233.39 | — | Görsel, W. Spiess, n=23 | aynı |
| 8 | 2460267.7969 | 0.0002 | CCD, V, G. Samolyk | JAAVSO 52 (2024), #3933 (yukarıda) |
| 9 | 2460290.7374 | 0.0002 | CCD, V, G. Samolyk | JAAVSO 52 (2024), #3933 |
| 10 | 2460591.8083 | 0.0002 | CCD, V, G. Samolyk | Samolyk, JAAVSO 53 (2025) "Recent Minima of 312 EB Stars" — https://apps.aavso.org/jaavso/article/3989/ (PDF: https://apps.aavso.org/media/jaavso/3989.pdf) |
| 11 | 2460657.7529 | 0.0003 | CCD, V, G. Samolyk | JAAVSO 53 (2025), #3989 |
| 12 | 2460680.6918 | 0.0003 | CCD, TG, J. A. Howell | JAAVSO 53 (2025), #3989 |
| 13a | 2460732.323157 | 0.003671 | DSLR görüntülerinden görsel fotometri (Goransky yöntemi), I. Sergey — çözüm 1 | VarAstro gözlem #107713 — https://var.astro.cz/en/Observations/107713 |
| 13b | 2460732.299651 | 0.002921 | aynı gözlem — çözüm 2 | aynı |
| 14 | 2461027.6455 | 0.0009 | CCD, V, 130 mm reflektör / ASI533MM Pro, S. P. Cook (KvW + BAA heliyosentrik düzeltme) | Cook, JAAVSO 54 (2026) "Recent Minima of 141 EB Stars" — https://apps.aavso.org/jaavso/article/4063 (PDF: https://apps.aavso.org/media/jaavso/4063_3YJCn1m.pdf) |

Kaynak satırlarından birebir alıntılar (kontrol için):
- JAAVSO 53 #3989: `β Per 60591.8083 5214 0.1702 V G. Samolyk 0.0002` / `β Per 60657.7529 5237 0.1668 V G. Samolyk 0.0003` / `β Per 60680.6918 5245 0.1672 TG J. A. Howell 0.0003`
- JAAVSO 52 #3933: `β Per 59212.6174 4733 0.1526 TG J. A. Howell 0.0005` / `β Per 60267.7969 5101 0.1642 V G. Samolyk 0.0002` / `β Per 60290.7374 5109 0.1662 V G. Samolyk 0.0002`
- JAAVSO 51 #3904: `Beta Per 59989.6630 5004 0.1588 V G. Samolyk 0.0003`
- JAAVSO 50 #3825: `β Per 59579.6342 4861 0.1545 V S. Dvorak 0.0001`
- Cook 2026: `beta Per 61027.6455 0.0009 7001 0.1600 40953.4657 2.8673075` (sütunlar: HJD, ortalama hata, çevrim, O–C, epok, periyot — Cook'un O–C'si TIDAK "ortalama" efemerisine göre)
- BAVM 262: `BETA Per min 60144.50 SPI 14` (… 60167.44, 60213.32, 60233.39); gözlemci anahtarı `SPI Spiess, Wolfgang Ertingen`
- JAAVSO O–C'leri GCVS elemanlarına göre: "The linear elements in the General Catalogue of Variable Stars (GCVS; Kholopov et al. 1985) were used to compute the O–C values for most stars." (#3989)

Taranan ama Algol satırı **olmayan** listeler: JAAVSO #3857 (Ağu 2022), #3880 (Mar 2023), #3967 (Ağu 2024), #4025 (Ağu 2025), #4061 (Şub 2026), #4091 (Eyl 2026); BAVM 259 (2022 fotoelektrik), BAVM 260 (2022 görsel), BAVM 261 (2023 fotoelektrik, ön sürüm), BAVJ 102 = BAVM 263 (2024 fotoelektrik). BAVM 264/265/266 (2024–2025 görsel/fotoelektrik) BAV sayfasında "eingereicht/geplant" — henüz yayımlanmamış (https://www.bav-astro.de/index.php/veroeffentlichungen/bav-mitteilungen).

Diğer kaynakların durumu:
| Kaynak | Durum |
|---|---|
| BAV Lichtenknecker Database (LkDB, herkese açık form) | bet Per için 50 CCD + 468 görsel minimum; **son minimum 2458065.6732 (08.11.2017)** → 2022–2026 için veri yok. LkDB'deki Kreiner elemanları: 2452500.21 / 2.867315 ("Stand 9.May.17"). — https://bav-astro.eu/LkDB/index_joomla.php |
| VarAstro (eski O-C Gateway) | Yıldız sayfası açık (https://var.astro.cz/en/Stars/17960); gözlem listesi API'si 401 (giriş). Arama motoruyla bulunan herkese açık gözlem sayfalarından pencereye giren tek kayıt #107713 (yukarıda). Diğerleri 2009–2016 (#4019, #66133, #66207, #68870) → pencere dışı. |
| Jetsu 2020 (arXiv:2005.13360) | "236 years of O-C data" (1783'ten) → veri ~2019'da bitiyor; 2022+ minimum yok. — https://arxiv.org/abs/2005.13360 |
| IBVS, OEJV | Bu oturumda Algol için **taranmadı / bulamadım**. |
| AAVSO FTP veri dosyaları (ör. `ftp://ftp.aavso.org/public/datasets/gsamj531eb312.txt`) | İndirilmedi (aynı veri JAAVSO PDF'lerinde var). |

### A2. O−C tablosu (kendi hesap; kaynak değil)

Efemerisler: VSX = HJD 2457675.72 + 2.867343·E; Kraków = HJD 2452500.172 + 2.867338·E; GCVS = 2445641.5135 + 2.8673043·E. O−C pozitif = gözlenen minimum tahminden **geç**.

| HJD | UT (yaklaşık) | E (VSX) | O−C VSX (dk) | E (Kraków) | O−C Kraków (dk) | O−C GCVS (gün) |
|---|---|---|---|---|---|---|
| 2459212.6174 | 2020-12-29 02:43 | 536 | +2.2 | 2341 | +10.3 | +0.1526 |
| 2459579.6342 | 2021-12-31 03:07 | 664 | −2.2 | 2469 | +6.7 | +0.1545 |
| 2459989.6630 | 2023-02-14 03:54 | 807 | −4.0 | 2612 | +6.0 | +0.1588 |
| 2460144.50 (görsel) | 2023-07-19 00:03 | 861 | −3.3 | 2666 | +7.0 | +0.1614 |
| 2460167.44 (görsel) | 2023-08-10 22:34 | 869 | −1.5 | 2674 | +8.9 | +0.1629 |
| 2460213.32 (görsel) | 2023-09-25 19:36 | 885 | +2.1 | 2690 | +12.6 | +0.1660 |
| 2460233.39 (görsel) | 2023-10-15 21:15 | 892 | +0.1 | 2697 | +10.7 | +0.1649 |
| 2460267.7969 | 2023-11-19 06:59 | 904 | −1.7 | 2709 | +9.0 | +0.1642 |
| 2460290.7374 | 2023-12-12 05:34 | 912 | +0.8 | 2717 | +11.6 | +0.1662 |
| 2460591.8083 | 2024-10-08 07:18 | 1017 | +0.7 | 2822 | +12.2 | +0.1702 |
| 2460657.7529 | 2024-12-13 05:57 | 1040 | −5.5 | 2845 | +6.2 | +0.1668 |
| 2460680.6918 | 2025-01-05 04:31 | 1048 | −5.3 | 2853 | +6.5 | +0.1672 |
| 2460732.3232 (VarAstro ç.1) | 2025-02-25 19:46 | 1066 | +22.3 | 2871 | +34.2 | +0.1871 |
| 2460732.2997 (VarAstro ç.2) | 2025-02-25 19:12 | 1066 | −11.5 | 2871 | +0.4 | +0.1636 |
| 2461027.6455 | 2025-12-18 03:22 | 1169 | +2.2 | 2974 | +14.8 | +0.1771 |

Not: Bu tablodaki ve A3/A4'teki kendi-hesap UT saatleri dakikaya aşağı yuvarlanmıştır (saniye atıldı, ≤1 dk). Kendi O−C(GCVS) değerlerim JAAVSO'nun yayımladığı O−C'lerle 4. ondalığa kadar aynı (ör. 2460591.8083 → +0.1702) → çevrim numaraları ve dönüşüm doğrulandı. Cook'un +0.1600'ı farklı efemerise (40953.4657 / 2.8673075) göre.

**Gözlem:** 9 CCD minimumunda (2020–2025) VSX O−C'leri −5.5…+2.2 dk (ort. ≈ −1.4 dk); Kraków O−C'leri +6.0…+14.8 dk (ort. ≈ +9.3 dk) → **Kraków efemerisi bugün ~10 dk erken tahmin ediyor; VSX gözlemlerle ~±5 dk içinde.**

### A3. Rafine doğrusal efemeris (kendi hesap; kaynak değil)

Yöntem: 9 CCD minimumu (satır 1, 2, 3, 8–12, 14), eşit ağırlıklı en küçük kareler, epok son gözleme taşındı.

- **Min I = HJD 2461027.64253 (±0.00130) + 2.8673413 (±0.0000039) · E** (rms artık 2.85 dk; artıklar dk: +2.8, −1.4, −2.8, −0.3, +2.3, +2.4, −3.7, −3.5, +4.3)
- Yalnız 2021+ (8 nokta): HJD 2461027.64329 (±0.00137) + 2.8673458 (±0.0000051) · E
- Uyarı (kaynaklı, `algol_ortme_kaynaklar.md` A4): Algol C ışık-zaman etkisi tepe-tepe 0.0064 g ≈ 9.2 dk, P ≈ 680 g (Jetsu 2020). Yani doğrusal efemeris ±~5 dk'dan daha iyi olamaz; artıkların ±4 dk olması bununla uyumlu.
- Fit ile VSX farkı 2026–27'de ≈ −2…−3 dk (fit biraz erken); Kraków'dan ≈ +11 dk geç.

Pencere için kendi-fit tahminleri (UT; heliyosentrik düzeltme uygulanmış) ve VSX/Kraków karşılaştırması:

| E (Krk) | HJD (fit) | UT (fit) | UT (VSX) | UT (Kraków) |
|---|---|---|---|---|
| 3085 | 2461345.9174 | 2026-11-01 09:53 | 09:56 | 09:42 |
| 3086 | 2461348.7848 | 2026-11-04 06:42 | 06:45 | 06:31 |
| 3087 | 2461351.6521 | 2026-11-07 03:31 | 03:33 | 03:20 |
| 3088 | 2461354.5194 | 2026-11-10 00:20 | 00:22 | 00:09 |
| 3089 | 2461357.3868 | 2026-11-12 21:09 | 21:11 | 20:58 |
| 3090 | 2461360.2541 | 2026-11-15 17:58 | 18:00 | 17:47 |
| 3091 | 2461363.1215 | 2026-11-18 14:47 | 14:49 | 14:36 |
| 3092 | 2461365.9888 | 2026-11-21 11:36 | 11:38 | 11:25 |
| 3093 | 2461368.8561 | 2026-11-24 08:25 | 08:27 | 08:14 |
| 3094 | 2461371.7235 | 2026-11-27 05:14 | 05:16 | 05:03 |
| 3095 | 2461374.5908 | 2026-11-30 02:03 | 02:05 | 01:52 |
| 3096 | 2461377.4582 | 2026-12-02 22:52 | 22:54 | 22:41 |
| 3097 | 2461380.3255 | 2026-12-05 19:41 | 19:43 | 19:30 |
| 3098 | 2461383.1928 | 2026-12-08 16:30 | 16:32 | 16:19 |
| 3099 | 2461386.0602 | 2026-12-11 13:19 | 13:22 | 13:08 |
| 3100 | 2461388.9275 | 2026-12-14 10:08 | 10:11 | 09:57 |
| 3101 | 2461391.7949 | 2026-12-17 06:57 | 07:00 | 06:46 |
| 3102 | 2461394.6622 | 2026-12-20 03:47 | 03:49 | 03:36 |
| 3103 | 2461397.5296 | 2026-12-23 00:36 | 00:38 | 00:25 |
| 3104 | 2461400.3969 | 2026-12-25 21:25 | 21:27 | 21:14 |
| 3105 | 2461403.2642 | 2026-12-28 18:14 | 18:17 | 18:03 |
| 3106 | 2461406.1316 | 2026-12-31 15:03 | 15:06 | 14:52 |
| 3107 | 2461408.9989 | 2027-01-03 11:53 | 11:55 | 11:42 |
| 3108 | 2461411.8663 | 2027-01-06 08:42 | 08:44 | 08:31 |
| 3109 | 2461414.7336 | 2027-01-09 05:31 | 05:34 | 05:20 |
| 3110 | 2461417.6009 | 2027-01-12 02:21 | 02:23 | 02:09 |
| 3111 | 2461420.4683 | 2027-01-14 23:10 | 23:12 | 22:59 |
| 3112 | 2461423.3356 | 2027-01-17 19:59 | 20:02 | 19:48 |
| 3113 | 2461426.2030 | 2027-01-20 16:48 | 16:51 | 16:37 |
| 3114 | 2461429.0703 | 2027-01-23 13:38 | 13:40 | 13:27 |
| 3115 | 2461431.9377 | 2027-01-26 10:27 | 10:30 | 10:16 |
| 3116 | 2461434.8050 | 2027-01-29 07:16 | 07:19 | 07:05 |
| 3117 | 2461437.6723 | 2027-02-01 04:06 | 04:08 | 03:55 |
| 3118 | 2461440.5397 | 2027-02-04 00:55 | 00:58 | 00:44 |
| 3119 | 2461443.4070 | 2027-02-06 21:44 | 21:47 | 21:33 |
| 3120 | 2461446.2744 | 2027-02-09 18:34 | 18:36 | 18:23 |
| 3121 | 2461449.1417 | 2027-02-12 15:23 | 15:26 | 15:12 |
| 3122 | 2461452.0090 | 2027-02-15 12:13 | 12:15 | 12:01 |
| 3123 | 2461454.8764 | 2027-02-18 09:02 | 09:04 | 08:51 |
| 3124 | 2461457.7437 | 2027-02-21 05:51 | 05:54 | 05:40 |
| 3125 | 2461460.6111 | 2027-02-24 02:41 | 02:43 | 02:29 |
| 3126 | 2461463.4784 | 2027-02-26 23:30 | 23:32 | 23:19 |

### A4. Yayımlanmış minimum tahminleri (bağımsız kaynaklar)

#### A4.1 BAV Circular 2026, Heft 2 "Ephemeriden" — pencere içinde (Kasım–Aralık 2026) ✔

Kaynak: https://www.bav-astro.de/images/BAV-Veroeffentlichungen/BAV%20Circular/BAVC_2026_Heft_2.pdf (sayfa 67 = Kasım, sayfa 74 = Aralık; satır "Per beta").
- Biçim (kaynaktan): "In der Spalte des Tages sind Julianische Tagesbruchteile (TB) eingetragen, die zum Teil (bei einem Tagesbruchteil größer 46) für den folgenden bürgerlichen Tag gelten." · "Ein Nebenminimum wird durch "s" hinter dem Tagesbruchteil markiert." · Tahminler yalnız Almanya'dan (10°D, 50°K) görülebilenler: "Vorhersagen werden angegeben, wenn die Minima … nach Sonnenuntergang bzw. vor Sonnenaufgang eintreten und der Veränderliche dann eine Höhe von mindestens 20 Grad über dem Horizont hat."
- Gün sütunu JD'si (kaynak alt satırı "JD 613 .. 46 47 …"): 1 Kasım = 2461346, 1 Aralık = 2461376 (öğlen 12 UT; TB .00 = 13:00 MEZ).
- BAV'ın kullandığı elemanlar (BAVC 2026 Heft 1, satır `beta Per S1 60339.5 … 2.12 3.39 … EA/SD 52500.1750 2.86733900 0 AA 55.207/Kre:1402`): **E0 = 2452500.1750, P = 2.867339 (Kreiner/TIDAK, Şubat 2014 sürümü)**; "L.Beob." = 60339.5 (BAV'ın son gözlediği minimum JD). — https://www.bav-astro.de/images/BAV-Veroeffentlichungen/BAV%20Circular/BAVC_2026_Heft_1.pdf
- **Bağımsızlık notu:** BAV tahminleri Kreiner (Kraków) tabanlı elemanlardan; tamamen bağımsız değil, ama Kraków `ephem.txt`'teki 2452500.172/2.867338'den farklı bir sürüm.
- Sütun eşlemesi `pdfplumber` ile kelime x-konumundan yapıldı (metin düzeninde kayma riskine karşı).

| Tarih sütunu (BAV) | TB | Tür | JD = sütun + TB | UT (TB'yi JD kabul edersek) | Kendi hesap karşılaştırma (VSX, aynı minimum) |
|---|---|---|---|---|---|
| 2026-11-02 | 35s | Min II | 2461347.35 | 11-02 20:24 | VSX 20:20 |
| 2026-11-05 | 22s | Min II | 2461350.22 | 11-05 17:17 | VSX 17:09 |
| **2026-11-06** | **65** | **Min I** | 2461351.65 | **11-07 03:36** | VSX 03:33 |
| **2026-11-09** | **52** | **Min I** | 2461354.52 | **11-10 00:29** | VSX 00:22 |
| **2026-11-12** | **39** | **Min I** | 2461357.39 | **11-12 21:22** | VSX 21:11 |
| **2026-11-15** | **25** | **Min I** | 2461360.25 | **11-15 18:00** | VSX 18:00 |
| 2026-11-16 | 69s | Min II | 2461361.69 | 11-17 04:34 | VSX 04:25 |
| 2026-11-19 | 55s | Min II | 2461364.55 | 11-20 01:12 | VSX 01:14 |
| 2026-11-22 | 42s | Min II | 2461367.42 | 11-22 22:05 | VSX 22:03 |
| 2026-11-25 | 29s | Min II | 2461370.29 | 11-25 18:58 | VSX 18:52 |
| **2026-11-26** | **72** | **Min I** | 2461371.72 | **11-27 05:17** | VSX 05:16 |
| **2026-11-29** | **59** | **Min I** | 2461374.59 | **11-30 02:10** | VSX 02:05 |
| **2026-12-02** | **46** | **Min I** | 2461377.46 | **12-02 23:02** | VSX 22:54 |
| **2026-12-05** | **32** | **Min I** | 2461380.32 | **12-05 19:41** | VSX 19:43 |
| **2026-12-08** | **19** | **Min I** | 2461383.19 | **12-08 16:34** | VSX 16:32 |
| 2026-12-09 | 62s | Min II | 2461384.62 | 12-10 02:53 | VSX 02:57 |
| 2026-12-12 | 49s | Min II | 2461387.49 | 12-12 23:46 | VSX 23:46 |
| 2026-12-15 | 36s | Min II | 2461390.36 | 12-15 20:38 | VSX 20:35 |
| 2026-12-18 | 23s | Min II | 2461393.23 | 12-18 17:31 | VSX 17:24 |
| **2026-12-22** | **53** | **Min I** | 2461397.53 | **12-23 00:43** | VSX 00:38 |
| **2026-12-25** | **40** | **Min I** | 2461400.40 | **12-25 21:36** | VSX 21:27 |
| **2026-12-28** | **26** | **Min I** | 2461403.26 | **12-28 18:14** | VSX 18:17 |

Hassasiyet: TB 0.01 g = 14.4 dk adım → BAV değerleri ±7 dk yuvarlama içerir.

**Kendi çıkarım (doğrulanmadı, "askıda"):** BAV TB'leri, BAV'ın kendi elemanlarına (HJD) göre hesapladığım JD-tahminlerinden ortalama **+7.6 dk (σ 4.1 dk)** geç. Algol için HJD−JD Kasım ortası +7.6 dk, Aralık ortası +6.8 dk (kendi hesap) → BAV büyük olasılıkla TB'leri **heliyosentrik** basıyor (geosentrik düzeltme yapmadan). BAVC'de "heliozentrisch/geozentrisch" ifadesi **bulamadım**. Uygulama testinde BAV değerleri kullanılacaksa Kasım–Aralık için ~7 dk çıkarılmalı ya da ±10 dk tolerans verilmeli.

#### A4.2 Ocak–Şubat 2027 için yayımlanmış liste

**Bulamadım.** BAVC 2027 Heft 2 henüz yayımlanmamış (BAV Circular sayfasında son: 2026 Heft 1/2 — https://www.bav-astro.de/index.php/veroeffentlichungen/bav-circular). Sky & Telescope Algol hesaplayıcısı JS ile çalışıyor, sayfa metninde tablo yok; S&T sayfası: "In December 2021 we revised the prediction formula to better match Algol's current minima." ve süreler "should be accurate to within a few minutes" (WebFetch) — https://skyandtelescope.org/observing/the-minima-of-algol/ . in-the-sky.org, RASC Observer's Handbook 2027 (çevrimiçi değil), freestarcharts.com (2026/27 sayfaları 404): bulamadım. Derekscope 2026 listesi (https://derekscope.co.uk/2026-algol-minima/) mevcut ama `algol_ortme_kaynaklar.md`'de gösterildiği gibi VSX'ten ~2.5 sa sapıyor → referans olarak kullanılmamalı.

#### A4.3 Pencere dışı ama 2026 tarihli bağımsız kalibrasyon noktaları ✔

| Kaynak | Kaynaktaki ifade | UT | Kendi hesap: VSX / Kraków / BAV-eleman / fit farkı |
|---|---|---|---|
| Sky & Telescope, "This Week's Sky at a Glance, October 16 – 25" (16 Eki 2026), Cumartesi 17 Ekim | "Algol … should be at its minimum brightness, magnitude 3.4 instead of its usual 2.1, for a couple hours centered on 9:52 p.m. EDT." (WebFetch) | 2026-10-18 01:52 | **0.0 dk** / +13.3 / +4.6 / +2.3 |
| Astronomy.com, "The Sky This Week from September 4 to 11" (2026), Cuma 4 Eylül | "Algol should reach its minimum brightness at 9:50 P.M. EDT." | 2026-09-05 01:50 | +8.2 / +21.5 / +12.7 / +10.5 |

URL'ler: https://skyandtelescope.org/astronomy-news/observing-news/this-weeks-sky-at-a-glance-october-16-25/ · https://www.astronomy.com/the-sky-this-week/the-sky-this-week-from-september-4-to-11-2026/

Yorum (kendi): S&T (2021'de revize formül) VSX ile dakikası dakikasına aynı. Astronomy.com +8 dk geç (dakika yuvarlaması + farklı efemeris olabilir; kaynağı belirtilmemiş).

### A5. Sonuç – Part A

- **Önerilen efemeris (2026–27):** VSX (2457675.72 + 2.867343 E) gözlenmiş CCD minimumlarıyla ortalama −1.4 dk, ±6 dk içinde; S&T 2026 tahminiyle 0 dk. Kendi fit (2461027.64253 + 2.8673413 E) VSX'ten yalnızca ~2–3 dk farklı → VSX'i değiştirmeye gerek yok; Kraków `ephem.txt` (+~10 dk sistematik erken) kullanılmamalı.
- Gerçekçi belirsizlik: ±5–10 dk (Algol C LTTE ±4.6 dk + efemeris hatası). Uygulamada "±15 dk" göstermek güvenli (kendi öneri).

---

## B. Android Chrome – Web Speech API (speechSynthesis) ve Türkçe ses

### B1. Chrome Android sesleri nereden alıyor? (birincil kaynak: Chromium kaynak kodu, `main` dalı, 2026-10-27'de okundu)

Dosyalar:
- https://raw.githubusercontent.com/chromium/chromium/main/content/public/android/java/src/org/chromium/content/browser/TtsPlatformImpl.java
- https://raw.githubusercontent.com/chromium/chromium/main/content/browser/speech/tts_android.cc

Bulgular (kod alıntılarıyla):
1. **Sistem varsayılan TTS motoru kullanılıyor.** Varsayılan motor nesnesi `new TextToSpeech(ContextUtils.getApplicationContext(), status -> {...})` ile — motor paketi belirtilmeden — oluşturuluyor (yorum: `/** Constructor with the default TTS Engine */`). Android dokümanı: bu kurucu "The constructor for the TextToSpeech class, using the default TTS engine." — https://developer.android.com/reference/android/speech/tts/TextToSpeech
   → Xiaomi'de varsayılan motor ne ise Chrome onu kullanır.
2. **getVoices() listesi = varsayılan motorun desteklediği yerel ayarlar.** Kod `Locale.getAvailableLocales()` üzerinde dönüp `if (mTextToSpeech.isLanguageAvailable(locale) > 0)` olanlar için ses ekliyor; ad `locale.getDisplayLanguage()` (+ ülke), dil `locale.toString()`.
   - Android sabitleri (resmî doküman): `LANG_AVAILABLE = 0` ("available for the language … but not the country"), `LANG_COUNTRY_AVAILABLE = 1`, `LANG_COUNTRY_VAR_AVAILABLE = 2`, `LANG_MISSING_DATA = -1` ("the language data is missing"), `LANG_NOT_SUPPORTED = -2`.
   - Kendi çıkarım: `> 0` koşulu yüzünden Türkçe yalnızca motor `tr_TR`'yi ülke düzeyinde destekliyorsa **ve ses verisi kuruluysa** listelenir (veri eksikse −1 döner, listelenmez). Ad cihaz diline göre yerelleşir (Türkçe arayüzde muhtemelen "Türkçe Türkiye"); `lang` değeri kodda `tr_TR` biçiminde üretiliyor — Blink'in bunu `tr-TR`'ye çevirip çevirmediğini **bulamadım** → PWA'da `voice.lang.replace('_','-').toLowerCase().startsWith('tr')` gibi esnek eşleştirme gerekir.
   - Varsayılan-dışı motorlar için: `/** Initialization for non-default TTS Engine does not enumerate voices. */`
3. **getVoices() başta boş, sonra `voiceschanged`:** `GetVoices()` motor başlatılmadan dönüyor (`if (!Java_TtsPlatformImpl_isInitialized(env, java_ref_)) return;`); sesler arka planda toplandıktan sonra `TtsPlatformImplJni.get().voicesChanged(...)` çağrılıyor. Başlatmadan önce gelen `speak()` bekletilip (`mPendingUtterance`) sonra konuşuluyor.
4. **pause()/resume() Android'de çalışmıyor:** `void TtsPlatformImplAndroid::Pause() { StopSpeaking(); }` ve `void TtsPlatformImplAndroid::Resume() {}` (boş). Yani pause = durdur, resume = hiçbir şey.
5. **Ses seçimi motor/sesi değil yalnız dili değiştiriyor:** `speak()` içinde yalnızca `mTextToSpeech.setLanguage(LocaleUtils.forLanguageTag(lang.replace("_", "-")))`, `setSpeechRate`, `setPitch` ve `QUEUE_FLUSH` ile `speak(...)` var; belirli bir Android `Voice` seçimi yok.
6. **Olaylar:** Android sesleri için yalnız `TTS_EVENT_START`, `TTS_EVENT_END`, `TTS_EVENT_ERROR` bildiriliyor → `boundary` (kelime) olayı yok.
7. **Uzunluk sınırı (Android çerçevesi, AOSP kaynak):** `public static int getMaxSpeechInputLength() { return 4000; }` (TextToSpeech.java) ve servis tarafında `if (mText.length() > TextToSpeech.getMaxSpeechInputLength()) { Log.w(TAG, "Text too long: " …); return false; }` (TextToSpeechService.java) → **4000 karakterden uzun tek bir utterance Android'de reddedilir.** — https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/speech/tts/TextToSpeech.java ve …/TextToSpeechService.java

### B2. MDN / browser-compat-data

- MDN BCD (`api/SpeechSynthesis.json`, GitHub main): `pause` için chrome_android notu: **"In Android, `pause()` ends the current utterance. `pause()` behaves the same as `cancel()`."** — https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/SpeechSynthesis.json
- Aynı dosya: SpeechSynthesis Chrome 33'ten beri; chrome_android "mirror" (masaüstüyle aynı); **Android WebView: `"version_added": false`** (impl_url https://crbug.com/40417848) → PWA bir WebView sarmalayıcıda (ör. Capacitor/eski TWA olmayan WebView) açılırsa speechSynthesis yok; Chrome'dan kurulan PWA'da var (son kısım kendi çıkarım).
- MDN getVoices: "returns a list of SpeechSynthesisVoice objects representing all the available voices on the current device" ve örnek kodda `speechSynthesis.onvoiceschanged = populateVoiceList;` (sayfa son değişiklik 27 May 2025) — https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices

### B3. Chromium hata kayıtları (issues.chromium.org; başlık/tarih herkese açık JSON'dan okundu, açıklama metni okunamadı)

| Eski crbug | Yeni ID | Başlık (birebir) | Açılış | İşletim sistemi etiketi | Not |
|---|---|---|---|---|---|
| 679437 | 41294170 | "Speech Synthesis stops abruptly after about 15 seconds" | 2017-01-09 | Linux, Windows | Kapanış zaman damgası yok → açık görünüyor (çıkarım). Android etiketi yok. |
| 509488 | 41188091 | "Web Speech API: 'end' event of SpeechSynthesisUtterance object is not dispatched sometimes" | 2015-07-13 | Windows | Kapanış damgası yok (çıkarım: açık). |
| 335907 | 41084789 | "SpeechSynthesisUtterance is stopping" | 2014-01-18 | Windows | Başka kayda (41105085) bağlanmış; durum kodu "duplicate" olabilir — **doğrulanmadı**. |
| 582455 | 41237308 | "SpeechSynthesisUtterance does not change language" | 2016-01-29 | Windows, Chrome 55 | Kapanış damgası 2016-10-13 (çözülmüş görünüyor — çıkarım). |

URL'ler: https://issues.chromium.org/41294170 · https://issues.chromium.org/41188091 · https://issues.chromium.org/41084789 · https://issues.chromium.org/41237308 (eski: https://bugs.chromium.org/p/chromium/issues/detail?id=679437 vb. yönlendiriyor).
**Android'e özgü pause/getVoices hata kaydı: bulamadım** (davranış koddan doğrulandı, B1).

### B4. Stack Overflow ve geliştirici yazıları (tarihli)

- **getVoices boş** — SO 21513706 kabul edilen yanıt (2014-04-10, skor 117): "According to Web Speech API Errata (E11 2013-10-17), the voice list is loaded async to the page. An onvoiceschanged event is fired when they are loaded." — https://stackoverflow.com/a/22978802
- **Uzun metin / ~15 sn** — SO 21947730 (soru 2014-02-22: "if I try longer text, it just stops in the middle"). Yanıt 47426888 (2017-11-22, Read Aloud geliştiricisi): "Your speech will get stuck if it's longer than 15 seconds." ; yanıt 23808155 (2014-05-22): "The breaking of the utterances only happens when the voice is not a native voice" ; çözüm yanıtı 48044163 (2017-12-31): periyodik `pause()`+`resume()` zamanlayıcısı. — https://stackoverflow.com/questions/21947730
- dev.to, Jan Küster (2021-12-07, güncelleme 2023-06-05): "Longer texts on Chrome-Desktop will be cancelled automatically after 15 seconds. … At the same time this fix breaks on Android, since Android devices don't implement speechSynthesis.pause() as pause but as cancel" ; ayrıca getVoices "would return an empty array on Chrome Desktop, Chrome Android" (senkron çağrıda). — https://dev.to/jankapunkt/cross-browser-speech-synthesis-the-hard-way-and-the-easy-way-353
- Caktus Group, "The Halting Problem" (Karen Tracey, 2025-11-03): Google sesleri uzun metinde duruyor; çözüm 14 sn aralıkla `speechSynthesis.pause(); speechSynthesis.resume();`. — https://www.caktusgroup.com/blog/2025/11/03/the-halting-problem/
- codersblock (Will Boyd, 2020-11-23): "[Chrome/Firefox on Android] The voice cannot be changed from the device's default voice." · "[Chrome/Firefox on Android] The 'boundary' event does not fire." · "[Chrome/Firefox on Android] Pausing and resuming does not work." — https://codersblock.com/blog/javascript-text-to-speech-and-its-many-quirks/
- SO 52975068 (2018-10-24) "SpeechSynthesis in Android-Chrome: cannot change English voice from US English"; yanıt 61366224 (2020-04-22): "only one is available at a time. You can pick which one by going to the Settings app … Text-to-speech options"; yanıt 76300008 (2023-05-21, Android 13): sistem TTS dilini değiştirince web uygulamasında o kullanılabiliyor. — https://stackoverflow.com/questions/52975068
- **Utterance çöp toplama (GC)** — SO 23483990 (2014-05-06, "onend … sometimes not call it"); yanıt 35935851 (2016-03-11, skor 25): "it might be a problem with garbage collection. Storing the utterance in a variable before calling speak seems to do the trick" (`window.utterances.push(utterance)`); yanıt 34844998 (2016-01-18) crbug 509488'e atıf. — https://stackoverflow.com/questions/23483990

**15 sn kesilmesi Android'de var mı?** Kanıt **bulamadım**: hata kaydı Linux/Windows etiketli, SO yanıtı "not a native voice" diyor; Android'de Chrome yalnız yerel (native) motor seslerini listeliyor (kodda `data.native = true`). Android'de doğrulanmış sınır 4000 karakter (B1-7). → "askıda": gerçek cihazda test gerekir.

### B5. Türkçe TTS sağlayıcı motor ve çevrimdışı çalışma

- Google motoru: Play Store adı **"Speech Recognition & Synthesis"** (paket `com.google.android.tts`), "Updated on Oct 13, 2026". Açıklamadan: "To use Google Text-to-Speech functionality on your Android device, go to Settings > Languages & Input > Text-to-Speech output. Select Speech Recognition and Synthesis from Google as your preferred engine." — https://play.google.com/store/apps/details?id=com.google.android.tts&hl=en (sayfada dil listesi yok).
- Türkçe desteği: Wikipedia "Speech Recognition & Synthesis" (eski adı "Speech Services") "Supported languages" listesinde **"Turkish (Turkey)"** var; ayrıca "Users must install voice data for each language." — https://en.wikipedia.org/wiki/Speech_Recognition_%26_Synthesis (liste satırları için ayrı kaynak gösterilmemiş; Google'ın resmî dil listesi **bulamadım**).
- Google Destek, "Text-to-speech output": "The default text-to-speech engine choices vary by device. Options can include Google's Text-to-speech engine, the device manufacturer's engine, and any third-party text-to-speech engines…" ve "Install voice data for another language: Open your device Settings. Select Install voice data. Choose the language that you want to install." — https://support.google.com/accessibility/android/answer/6006983?hl=en
- **Çevrimdışı:** Google'dan "Türkçe ses çevrimdışı çalışır" diyen resmî ifade **bulamadım**. Dolaylı kanıt: ses verisinin cihaza "install" edilmesi (Google Destek, Wikipedia) ve Chromium'un yalnız `isLanguageAvailable > 0` (veri kurulu) dilleri listelemesi. xiaomi.eu forum başlığı (2023-09-23) "TTS goes from online to offline voice minutes after screen turns off then stops" → Google motorunda online ve offline ses varyantları olduğuna işaret (forum, zayıf kaynak) — https://xiaomi.eu/community/tags/tts/ . → "askıda": uçak modunda cihaz testi gerekir.

### B6. Xiaomi / MIUI / HyperOS varsayılan TTS motoru

- Global Xiaomi cihazlarda varsayılan motorun ne olduğu (Google mı, Xiaomi'nin kendi motoru mu): **bulamadım** (resmî Xiaomi belgesi yok).
- Ayar yolu (TechBone, üçüncü taraf rehber): "Open Settings ➔ Additional settings ➔ Accessibility ➔ Vision ➔ Text-to-speech output. From here you can switch the preferred engine…" — https://www.techbone.net/xiaomi/smartphone/text-to-speech-output
- Xiaomi'nin kendi motoru: XDA başlığı "Should allow permission for Mi AI Speech Engine Xiaomi Pad 6 CN version" (yalnız arama sonucundaki başlık; sayfa 403 → içerik okunmadı) → **Çin ROM'unda** "Mi AI Speech Engine" var gibi; global ROM için kanıt yok.
- Chrome hangi motoru kullanır: **sistem varsayılanını** (B1-1, Chromium kodu). Dolayısıyla Xiaomi'de varsayılan motor Türkçeyi desteklemiyorsa (veya Türkçe verisi yoksa) `getVoices()` içinde Türkçe görünmez; kullanıcının Ayarlar'da tercih edilen motoru "Speech Recognition & Synthesis from Google" yapıp Türkçe ses verisini kurması gerekir (kendi çıkarım, B1 + B5'e dayalı).

### B7. PWA için pratik sonuçlar (kendi önerim, kaynaklara dayanarak)

1. Sesleri `voiceschanged` ile bekle; 0 ses gelirse Türkçe yok/kurulu değil uyarısı göster ("Ayarlar → Metin okuma çıkışı → Google motoru → Türkçe ses verisini yükle").
2. Türkçe eşleştirmesini esnek yap (`tr_TR` / `tr-TR` / ad "Türkçe…").
3. Android'de **pause/resume kullanma** (pause = cancel). Duraklat düğmesi = `cancel()` + kaldığın cümle indeksini sakla, devam = o cümleden yeniden `speak()`.
4. Metni cümle/paragraf parçalarına böl (her parça ≪ 4000 karakter; masaüstü Google sesleri için ~15 sn'yi aşmamak adına ~200 karakter civarı).
5. Utterance nesnelerini global bir dizide tut (GC/`onend` hatası).
6. `boundary` olayına güvenme (Android'de yok) → vurgulama parça bazında yapılmalı.

---

## Özet: bulunan / bulunamayan

**Bulundu (kaynaklı):**
- 2020–2025 arası 15 gözlenmiş Algol minimumu: 9 CCD (JAAVSO: Samolyk 2022/2023/2024/2025, Cook 2026), 4 görsel (BAVM 262, 2023), 1 DSLR-görsel iki çözümlü (VarAstro #107713). Tümü HJD(UTC).
- Pencere için yayımlanmış tahmin: **BAV Circular 2026 Heft 2 — Kasım–Aralık 2026'da 12 Min I + 10 Min II** (Kreiner tabanlı elemanlar E0 2452500.1750, P 2.867339).
- 2026 kalibrasyon noktaları: S&T 18 Eki 2026 01:52 UT (VSX ile 0 dk), Astronomy.com 5 Eyl 2026 01:50 UT.
- Chromium kaynak kodu: sistem varsayılan motoru, voice listesi = `isLanguageAvailable>0` yerel ayarlar, `Pause()`=`StopSpeaking()`, `Resume()` boş, yalnız start/end/error olayları; AOSP 4000 karakter sınırı; MDN BCD Android pause notu; WebView'de speechSynthesis yok.
- Chromium hata kayıtları (15 sn: 41294170; end olayı: 41188091), SO yanıtları (tarihli), Google Destek TTS sayfası, Play Store kaydı, Wikipedia'da "Turkish (Turkey)".

**Bulamadım:**
- BJD_TDB cinsinden Algol minimumu/efemerisi; IBVS/OEJV taraması (yapılmadı); 2024–2025 BAV listeleri (henüz yayımlanmamış); VarAstro tam gözlem listesi (giriş gerekli).
- Ocak–Şubat 2027 için yayımlanmış bağımsız minimum listesi (S&T erişilemedi, BAVC 2027 yok, RASC çevrimiçi değil).
- BAV TB'lerinin heliyosentrik mi geosentrik mi olduğu (ifade yok; verim +7.6 dk sapma → heliyosentrik olma ihtimali yüksek, askıda).
- Google'ın resmî TTS dil listesi ve Türkçe sesin çevrimdışı çalıştığına dair resmî ifade.
- Xiaomi global ROM'larda varsayılan TTS motoru; Android'e özgü pause/getVoices Chromium hata kaydı; Android'de 15 sn kesilme kanıtı; Blink'in `tr_TR`→`tr-TR` dönüşümü.
