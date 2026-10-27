# Algol minimumları ve Ay örtmeleri – kaynaklı bilgiler (İstanbul)

Erişim tarihi (tüm kaynaklar): 2026-10-27. Ham sayfalar bu oturumda `curl` ile indirildi; `curl` ile açılmayan sayfalar (AstroPixels, Wikipedia özet) WebFetch ile okundu ve öyle işaretlendi. "Kendi hesap" yazan satırlar kaynak DEĞİL; kaynaktaki efemeristen Python ile hesaplandı (HJD→UT dönüşümünde yaklaşık heliyosentrik düzeltme uygulandı, TT−UT ≈ 69 s yok sayıldı).

Erişilemeyenler: Sky & Telescope Algol sayfası ve hesaplayıcısı (Cloudflare engeli, archive.org da engelli), AAVSO VSX `www.vsx.aavso.org` (robots/502; ama `vsx.aavso.org` açıldı), in-the-sky.org (Anubis bot engeli), TheSkyLive (403), var.astro.cz minimum listesi API'si (giriş gerekiyor, 401).

---

## A. Algol (β Persei)

### A1. Doğrusal efemerisler (Min I = T0 + P·E)

| Kaynak | T0 (minimum epoğu) | P (gün) | Zaman ölçeği | Not | URL |
|---|---|---|---|---|---|
| GCVS (Samus vd.) | HJD 2445641.5135 | 2.8673043 | HJD (UTC/TT belirtilmemiş) | Epok 1983. Bugün için ~4 saat geç kalıyor (bkz. A1-doğrulama) | http://www.sai.msu.su/gcvs/cgi-bin/search.cgi?search=bet+Per |
| AAVSO VSX (OID 26202) | HJD 2457675.72 (14 Eki 2016) | 2.867343 | HJD | Epok 2 ondalık → ±0.005 g ≈ ±7 dk | https://vsx.aavso.org/index.php?view=detail.top&oid=26202 ; API: https://vsx.aavso.org/index.php?view=api.object&ident=bet%20Per&format=json |
| Kraków TIDAK (Kreiner), `ephem.txt` | HJD 2452500.172 (±0.005) | 2.867338 (±0.000003) | HJD | Satır: `PER BET PRI 2452500.172 (5) 2.867338 (3) 27 27 0 0 27 ... 2012-2020 20.Feb.21` → 27 CCD minimumu, 2012–2020, güncelleme 20 Şub 2021 | https://www.as.up.krakow.pl/ephem/ephem.txt |
| Kraków minicalc sayfası | — | — | — | "No enough data to calculate linear ephemeris from last trend" (sayfada efemeris yok) | https://www.as.up.krakow.pl/minicalc/PERBETA.HTM |
| VarAstro (Çek Astr. Derneği, eski O-C Gateway) | HJD 2445641.554 | 2.867324 | HJD | Sayfadaki elementler; 2025 gözlemine göre ~+30–60 dk sapıyor | https://var.astro.cz/en/Stars/17960 |
| Jetsu 2020 (arXiv) | HJD 2445641.5135 | 2.86730431 | HJD | TIDAK veri tabanından alınmış GCVS-tipi efemeris; O-C hesabında "C" olarak kullanılmış | https://arxiv.org/pdf/2005.13360 |

Ek dönemler: VSX notu (S. Otero) "Mean period between 1989 and 2013 = 2.867340 d. Period for 2012-2013 = 2.86736 d." — https://vsx.aavso.org/index.php?view=detail.top&oid=26202

BJD_TDB cinsinden yayımlanmış bir Algol efemerisi **bulunamadı** (incelenen kaynakların hepsi HJD veriyor).

**A1-doğrulama (gözlenmiş minimum):** VarAstro gözlem #107713, Ivan Sergey, 2025-02-25, görsel fotometri (Goransky yöntemi): Min HJD 2460732.323157 ± 0.003671 (19:46 UTC) ve alternatif çözüm HJD 2460732.299651 ± 0.002921 (19:12 UTC). — https://var.astro.cz/en/Observations/107713

Kendi hesap (O−C, bu gözleme göre):

| Efemeris | O−C (HJD …0.3232) | O−C (HJD …0.2997) |
|---|---|---|
| GCVS | +0.187 g (+269 dk) | +0.164 g (+236 dk) |
| VSX | +0.016 g (+22 dk) | −0.008 g (−12 dk) |
| Kraków | +0.024 g (+34 dk) | +0.000 g (0 dk) |
| VarAstro | +0.043 g (+62 dk) | +0.019 g (+28 dk) |

Sonuç: **GCVS efemerisi 2026 için kullanılmamalı** (~4 sa geç). VSX ve Kraków bu gözlemle ±30 dk içinde uyumlu; ikisi arasındaki fark 2026–27'de sabit ~13–14 dk (Kraków erken).

### A2. Kasım 2026 – Şubat 2027 için yayımlanmış minimum tahminleri

| Kaynak | Durum |
|---|---|
| Sky & Telescope "Minima of Algol" | **Erişilemedi** (Cloudflare). İkincil alıntı: Rochester Astronomy Club yazısı S&T hesaplayıcısından "07/24/2026 @ 01:41 UT" ve "08/13/2026 @ 03:21 UT" veriyor — https://rochesterskies.org/observing-bright-variable-star-algol/ . Kendi hesap: VSX aynı tarihler için 01:32 ve 03:12 UT → S&T ≈ VSX + 9 dk. (Pencere dışında, ama efemeris uyumunu gösteriyor.) |
| Aynı Rochester sayfasındaki "go-lang" programı listesi | **Güvenilmez**: kendi içinde S&T değerleriyle tutarsız (ör. 2026-08-12 09:18 UTC); test referansı yapılmamalı. |
| Derekscope (Derek Rowley, UK, GMT/BST) | Nov 2026: 4 04:10, 7 00:59, 9 21:48, 12 18:36, 27 02:41, 29 23:30 · Dec 2026: 2 20:19, 5 17:08, 17 04:24, 20 01:13, 25 18:50 · Jan 2027: 9 02:55, 11 23:44, 14 20:33 · Feb 2027: 3 22:16, 6 19:04, 23 23:58, 26 20:47 (Kasım–Şubat'ta GMT = UT). — https://derekscope.co.uk/algol-minima-2/ . **Uyarı:** kendi hesapla VSX'ten sistematik olarak ~155–166 dk, Kraków'dan ~141–152 dk ERKEN; efemeris kaynağı belirtilmemiş. Test referansı olarak **uygun değil**. |
| BAA VSS, AAVSO, Kraków minicalc çıktısı, RASC Observer's Handbook | Pencere için yayımlanmış liste **bulunamadı** (minicalc Algol için efemeris üretmiyor). |

Sonuç: Pencere için güvenilir, bağımsız yayımlanmış ≥5 minimum **bulunamadı**. Test için önerilen: aşağıdaki VSX/Kraków türetilmiş liste (kaynak efemeris, hesap bizim).

Kendi hesap — VSX efemerisinden UT (Kraków farkı ~−13/−14 dk; GCVS ~4 sa erken):

| E (VSX) | HJD | UT (VSX) | UT (Kraków) | UT (GCVS – kullanma) |
|---|---|---|---|---|
| 1282 | 2461351.6537 | 2026-11-07 03:33 | 2026-11-07 03:20 | 2026-11-06 23:14 |
| 1283 | 2461354.5211 | 2026-11-10 00:22 | 2026-11-10 00:09 | 2026-11-09 20:03 |
| 1284 | 2461357.3884 | 2026-11-12 21:11 | 2026-11-12 20:58 | 2026-11-12 16:52 |
| 1290 | 2461374.5925 | 2026-11-30 02:05 | 2026-11-30 01:52 | 2026-11-29 21:46 |
| 1291 | 2461377.4598 | 2026-12-02 22:54 | 2026-12-02 22:41 | 2026-12-02 18:35 |
| 1292 | 2461380.3272 | 2026-12-05 19:43 | 2026-12-05 19:30 | 2026-12-05 15:24 |
| 1297 | 2461394.6639 | 2026-12-20 03:49 | 2026-12-20 03:36 | 2026-12-19 23:29 |
| 1298 | 2461397.5312 | 2026-12-23 00:38 | 2026-12-23 00:25 | 2026-12-22 20:18 |
| 1299 | 2461400.3986 | 2026-12-25 21:27 | 2026-12-25 21:14 | 2026-12-25 17:07 |
| 1305 | 2461417.6026 | 2027-01-12 02:23 | 2027-01-12 02:09 | 2027-01-11 22:03 |
| 1306 | 2461420.4700 | 2027-01-14 23:12 | 2027-01-14 22:59 | 2027-01-14 18:52 |
| 1307 | 2461423.3373 | 2027-01-17 20:02 | 2027-01-17 19:48 | 2027-01-17 15:41 |
| 1313 | 2461440.5414 | 2027-02-04 00:58 | 2027-02-04 00:44 | 2027-02-03 20:37 |
| 1314 | 2461443.4087 | 2027-02-06 21:47 | 2027-02-06 21:33 | 2027-02-06 17:26 |
| 1315 | 2461446.2760 | 2027-02-09 18:36 | 2027-02-09 18:23 | 2027-02-09 14:15 |

(Tüm 2026-11-01…2027-02-26 minimumları aynı hesapla; VSX: E=1280 2026-11-01 09:56 UT … E=1321 2027-02-26 23:32 UT.)

### A3. Parlaklık aralığı ve tutulma süresi

| Büyüklük | Değer | Kaynak |
|---|---|---|
| V maks / Min I | 2.12 / 3.39 V | GCVS — http://www.sai.msu.su/gcvs/cgi-bin/search.cgi?search=bet+Per |
| V maks / Min I | 2.09 – 3.30 V | VSX — https://vsx.aavso.org/index.php?view=detail.top&oid=26202 |
| Min II | 2.15 V | VSX notu (Otero) — aynı URL |
| Tutulma süresi (D) | %14 periyot | GCVS "M-m/D = 14" ; VSX "Rise/eclipse dur. 14% (9.63 h)" |
| Tutulma süresi (metin) | "roughly 10-hour-long partial eclipses" | Wikipedia (WebFetch + raw) — https://en.wikipedia.org/wiki/Algol |
| Tutulma süresi | "nine hours and 40 minutes"; maks→min "five hours"; minimumda "about 20 minutes" | NBC/Space.com (Joe Rao, 2012; RASC Observer's Handbook 2012 verisi) — https://www.nbcnews.com/id/wbna48972844 |
| Tutulma süresi | "Eclipses last for approx. 10 hours, with the period of totality at mid-eclipse lasting for approx. 2 hours" | BAA (2021) — https://britastro.org/2021/observers-challenge-the-eclipses-of-algol |
| Tutulma süresi | "Eclipses ... last about 8 hours ... eclipse minimum lasts for less than a half hour" | Turner, JAAVSO 44(1), 2016 — https://apps.aavso.org/jaavso/article/3204 |

Not: "Minimumda kalma" süresi kaynaklar arasında çelişkili (~20 dk / <30 dk / ~2 sa). Fiziksel olarak tutulma kısmidir (düz dip yok); "~2 sa" BAA'nın gözle izlenebilir sönük dönem ifadesi. Uygulama için VSX %14 (9.63 sa) toplam süre en net sayısal değer.

### A4. Üçüncü cisim (Algol C) ve doğrusal efemerisin hata payı

| Bilgi | Değer | Kaynak |
|---|---|---|
| Algol C yörünge periyodu | 1.862 yıl | GCVS notu — http://www.sai.msu.su/gcvs/cgi-bin/search.cgi?search=bet+Per |
| Algol C yörünge periyodu | 679.85 ± 0.04 gün (iyi bilinen değer); O-C'den 680.4 ± 0.4 gün | Jetsu 2020 — https://arxiv.org/pdf/2005.13360 |
| Algol C ışık-zaman etkisi (LTTE) | tepe-tepe genlik A1 = 0.0064 ± 0.0007 g (≈ 9.2 dk tepe-tepe, ≈ ±4.6 dk) | Jetsu 2020, Tablo 1 — aynı URL |
| Uzun dönem O−C (GCVS efemerisine göre) | 236 yılda −0.24 … +0.15 g | Jetsu 2020 — aynı URL |
| Model tahmin artığı | 9 yıllık öngörüde std 0.0078 g (≈ 11 dk) | Jetsu 2020 — aynı URL |
| Genel uyarı | "subtle mistakes in the current ephemeris ... can result in predictions that are off by a few hours or more" | Turner 2016 — https://apps.aavso.org/jaavso/article/3204 |
| Periyot değişimi | GCVS notu: 1784–1915 arası P 2.8672506–2.8673442 g arasında değişmiş; "Porb (Algol C) = 1.862a may be traced in the deviations; a period of 32a may also be real" | GCVS — aynı URL |
| Wikipedia | ΔP/P ≈ 10⁻⁵ (Applegate mekanizması); Algol C ~680 gün | https://en.wikipedia.org/wiki/Algol |

Pratik sonuç (kaynaklardan): güncel VSX/Kraków efemerisiyle beklenen hata ~±10–30 dk (Algol C katkısı tek başına ±~5 dk); 1983 epoklu GCVS ile ~4 sa.

---

## B. Ay örtmeleri (Kasım 2026 – Aralık 2027)

### B0. Önemli durum

- IOTA'nın dünya çapındaki parlak yıldız örtme listesi **2025'te sona erdi**: "This will be the last year that I produce worldwide bright star occultations." (Rob Robinson) — http://www.lunar-occultations.com/iota/bstar/bstar.htm
- IOTA 2026 tahmin belgesi hazır liste vermiyor; kullanıcıdan Occult 4 ile kendi tahminini üretmesini istiyor (2027 URL'si aynı dosyayı döndürüyor) — http://www.lunar-occultations.com/iota/2026iotapredictions.pdf
- in-the-sky.org (şehir bazlı örtme sayfaları) bot korumasıyla engelli; TheSkyLive 403.
- **İstanbul/Ankara/Atina/Bükreş/Sofya için yayımlanmış UT örtme zamanı: bulunamadı.**

### B1. Pencere içindeki olaylar (kaynaklı)

Gezegenler — Espenak "Sky Event Calendar", GMT, jeosentrik kavuşum, "Occn." = Ay örtmesi dünyada bir yerden görülür (bölge belirtilmiyor). WebFetch ile okundu (curl 406):

| Tarih (GMT) | Satır | Türkiye/Avrupa | Kaynak |
|---|---|---|---|
| 2026-11-02 14:23 | Mars 1.1°N of Moon: Occn. | Avrupa'dan görünmez (IOTA-ES listesinde yok) | https://astropixels.com/ephemeris/astrocal/astrocal2026gmt.html |
| 2026-11-02 23:11 | Jupiter 0.5°N of Moon: Occn. | Avrupa'dan görünmez (IOTA-ES) | aynı |
| 2026-11-07 11:31 | Venus 1.1°N of Moon: Occn. | Avrupa'dan görünmez (IOTA-ES) | aynı |
| 2026-11-30 09:18 | Jupiter 1.2°N of Moon: Occn. | Avrupa'dan görünmez (IOTA-ES) | aynı |
| 2027-02-08 03:36 | Mercury 0.4°N of Moon: Occn. | Avrupa'dan görünmez (IOTA-ES) | https://astropixels.com/ephemeris/astrocal/astrocal2027gmt.html |
| 2027-02-20 05:46 | Jupiter 1.2°N of Moon: Occn. | aynı | aynı |
| 2027-03-19 10:05 | Jupiter 0.9°N of Moon: Occn. | aynı | aynı |
| 2027-04-15 15:01 | Jupiter 1.0°N of Moon: Occn. | aynı | aynı |
| 2027-11-30 13:20 | Venus 0.9°N of Moon: Occn. | aynı | aynı |

IOTA-ES "Upcoming Occultations in Europe in 2022 - 2027" (gündüz-tamamen olanlar listelenmemiş): 2026 için yalnız 14 Eyl 2026 Venüs; **2027: "None"**. — https://www.iota-es.de/moon/moon_occ_plan.html

Yıldızlar:

| Hedef | Pencere durumu | Kaynak |
|---|---|---|
| Ülker (M45) | Seri sürüyor (aylık, 2029'a kadar). Espenak jeosentrik: 2026-11-24 11:18 (0.9°S), 2026-12-21 22:37 (1.0°S); 2027: Jan 18 08:46, Feb 14 16:13, Mar 13 21:43, Apr 10 03:30, Jul 01 07:04, Jul 28 16:20, Aug 24 23:36, Sep 21 05:12, Oct 18 10:48, Nov 14 18:14, Dec 12 03:55 GMT. Türkiye görünürlüğü: **bulunamadı**. | Espenak 2026/2027 (yukarıdaki URL'ler) |
| Ülker – Frankfurt örneği | 2026-12-21 23:10:28 UT D, ZC541 (20 Tau, 3.9m), Ay %93+; 23:21:34 UT r. (Frankfurt 50.1°K 8.65°D; İstanbul değil.) Tablonun başlığı "for the year 2025" diyor ama satırlar "26" yılı. | https://www.iota-es.de/moon.html ; ZC541 = 20 Tau: http://www.lunar-occultations.com/iota/bstar/bstar.htm |
| Aldebaran | Pencerede örtme **yok**: seri 3 Eyl 2018'de bitti, sonraki seri 18 Ağu 2033'te başlıyor. | https://www.space.com/41100-moon-aldebaran-occultation-2018-last-until-2033.html |
| Regulus | Seri Tem 2025 – Ara 2026 (EarthSky'a atıfla); sonraki seri 2035. Espenak jeosentrik: 2026-11-03 08:40 (0.8°N), 2026-11-30 14:35 (1.1°N), 2026-12-27 22:44 (1.4°N). Bu üç olayın örtme olup olmadığı ve bölgesi: **bulunamadı**. 2027'de ayrılık 1.5–3.1° (örtme değil). | https://www.space.com/stargazing/see-the-moon-eclipse-one-of-the-brightest-stars-in-the-sky-during-rare-alignment-feb-2-2026/ ; Espenak URL'leri |
| Spica | Pencerede **yok**: seri 2024'te başladı, 20 olay, 17 Kas 2025'te bitti. Espenak Kas/Ara 2026'da 2.4–2.5° ayrılık. | https://www.universetoday.com/articles/catch-a-cycle-of-lunar-occultations-of-antares-starting-this-week |
| Antares | Seri sürüyor: Ağu 2023'ten 27 Ağu 2028'e 68 örtme. Espenak jeosentrik: 2026-11-11 03:58 (0.3°N); 2027: Jan 04 16:34, Jan 31 22:48, Feb 28 06:09, Mar 27 14:36, Apr 23 23:16, May 21 07:08, Jun 17 13:46, Jul 14 19:34, Aug 11 01:31, Sep 07 08:34, Oct 04 17:01, Nov 01 02:13, Dec 25 18:01 GMT. Türkiye görünürlüğü: **bulunamadı**. | https://www.universetoday.com/articles/catch-a-cycle-of-lunar-occultations-of-antares-starting-this-week ; Espenak URL'leri |

Ek (ikincil, bölge yok): Derekscope 2027 takvimi (in-the-sky.org tarzı olay adları) "Lunar occultation of" Antares (her ay), Beta Tauri (Ocak–Mart), Sigma Sagittarii, Mercury (8 Şub), Jupiter (20 Şub, 19 Mar, Nis, May), Venus (Kas) listeliyor; Ay–M45 için yalnız "Close approach" yazıyor. — https://derekscope.co.uk/?p=496

### B2. Ay yarıçapı

| Değer | Açıklama | Kaynak |
|---|---|---|
| k = 0.2725076 (Dünya ekvator yarıçapı birimiyle) | IAU Genel Kurulu, Ağustos 1982; NASA tutulma bültenleri kullanır | https://eclipse.gsfc.nasa.gov/SEmono/reference/radius.html |
| k = 0.272281 | Espenak'ın umbral (iç) kontaklar için kullandığı ortalama minimum yarıçap | aynı |
| k = 0.2724880 | Daha büyük eski değer (aynı sayfada anılıyor) | aynı |
| 1737.4 km | IAU/IAG WGCCRE 2000 referans küre yarıçapı (LRO koordinat sistemi belgesi) | https://pds-imaging.jpl.nasa.gov/documentation/LRO_Coordinate_System.pdf |

Occult 4'ün kullandığı k değeri: **bulunamadı** (Occult, kenar profili için LRO/LOLA verisi indirtiyor; sayı belgede görülmedi).

### B3. Seri bağlamı (özet)

| Seri | Başlangıç – bitiş | Kaynak |
|---|---|---|
| Ülker | Eyl 2023 – 2029 | https://obliquity.com/skyeye/archive/2023/sep2023.html ; https://space.com/stargazing/the-moon-will-cover-the-seven-sisters-of-the-pleiades-this-week-heres-how-to-see-it |
| Antares | Ağu 2023 – 27 Ağu 2028 (68 olay) | https://www.universetoday.com/articles/catch-a-cycle-of-lunar-occultations-of-antares-starting-this-week |
| Spica | 2024 – 17 Kas 2025 (20 olay) | aynı |
| Regulus | Tem 2025 – Ara 2026; sonraki 2035 | https://www.space.com/stargazing/see-the-moon-eclipse-one-of-the-brightest-stars-in-the-sky-during-rare-alignment-feb-2-2026/ |
| Aldebaran | 2015 – 3 Eyl 2018; sonraki 18 Ağu 2033 | https://www.space.com/41100-moon-aldebaran-occultation-2018-last-until-2033.html |

### B4. Askıda / öneri

- İstanbul için olay bazlı D/R zamanları yalnızca Occult 4 (Windows) veya in-the-sky.org ile üretilebilir; ikisi de bu oturumda kullanılamadı. Uygulamanın kendi hesabı yapılırsa, doğrulama için IOTA-ES Frankfurt satırı (2026-12-21 23:10:28 UT, ZC541) bağımsız referans olarak kullanılabilir (aynı hesap Frankfurt koordinatlarıyla çalıştırılarak).
