# Ay örtmeleri – görünürlük eşikleri, İstanbul tahminleri, gezegen test vakaları

Erişim tarihi (tüm kaynaklar): **2026-10-27**. Sayfalar bu oturumda `curl` ile indirildi (aksi belirtilmedikçe). Resim içindeki tablolar (IOTA-ES GRAZPREP görselleri, JOA sayfaları) görüntü olarak okundu ve öyle işaretlendi. Bot kontrolü olan hiçbir siteyi aşmaya çalışılmadı. "Çıkarım" yazan satırlar **kaynak değildir**, kaynaktaki sayılardan yapılmış yorumdur.

Önceki dosya ile çakışmayı önlemek için: Espenak jeosentrik kavuşum listeleri, seri bağlamı (Ülker/Antares/Regulus/Spica/Aldebaran) ve Ay yarıçapı (k) değerleri `algol_ortme_kaynaklar.md` B bölümünde; burada tekrarlanmadı.

---

## 0. Kısa özet – bulunan / bulunamayan

| Konu | Durum |
|---|---|
| Occult'un (D. Herald) "minimum aperture"/sınır kadir hesabının dayandığı model | **Bulundu**: Schaefer, Bulder & Bourgeois 1992, Icarus 100, 60–72 (Occult yardım dosyasında açıkça yazıyor) |
| Bu modelin **denklemlerinin metni** | **Bulamadım** (makale ücretli; serbest kopya yok). Occult kaynak kodu: yazar "decompilation dahil tüm hakları saklıdır" diyor → açılmadı |
| Sınır kadir tabloları (açıklık × cusp açısı), 5 cm sütunu dahil | **Bulundu** (Occult yardım dosyası 2 örnek + Occult tutorial 1 örnek, koşullarıyla) |
| Kaba eşik kuralları (parlak kenar ~3.5 kadir, gündüz 3.0–3.5, dürbün 4. kadir hilalde vb.) | **Bulundu** (IOTA Observer's Manual, RASC, RASNZ, OASI, Occult yardımı) |
| 7×50 dürbüne özgü yayımlanmış ay-kenarı eşiği | **Bulamadım** (yalnız: IOTA el kitabı "hilalde 4. kadir, tripodlu dürbün"; 7×50 için "+5 veya daha parlak" satırı **asteroit** örtmeleri bağlamında) |
| İstanbul için Kas 2026 – Ara 2027 olay bazlı D/R zamanı | **Bulundu (yalnız in-the-sky.org, dakika hassasiyeti)**: σ Sgr (Nunki) 2027-05-24 ve 2027-08-13. Diğer 40 parlak olay İstanbul'dan görünmüyor |
| TÜBİTAK / Türkiye Ulusal Gözlemevleri 2026 Gök Olayları Yıllığı'nda örtme | **Yok** (yıllıkta Ay örtmesi listelenmemiş). 2027 yıllığı: **bulamadım** (henüz yayımlanmamış olabilir) |
| Türk amatör siteler (gokyuzu.org, TAD) 2026–27 örtme tahmini | **Bulamadım** |
| Gezegen örtmesi test vakaları (şehir + koordinat + saniye/0.1 dk hassasiyetli UT) | **Bulundu**: Venüs 2026-09-14 (Frankfurt, Occult; Avrupa şehirleri, GRAZPREP; İstanbul, in-the-sky), Venüs 2026-06-17, Jüpiter 2026-09-08 ve 10-06, Merkür 2026-02-19 (RASC 18 istasyon + IOTA şehir listeleri) |

---

## 1. Görünürlük eşikleri

### 1.1 Occult'un (Herald) görünürlük modeli

| Bilgi | Alıntı / değer | Kaynak |
|---|---|---|
| Kullanılan ifade | "[The expression used by OCCULT is that of Schaefer, B. E., Bulder, H. J. J., and Bourgeois, J., Lunar occultation visibility, Icarus, 100, 60-72 (1992)]" | Occult 4 yardım dosyası `Occult.chm` → sayfa *Lunar Predictions - GrazeMagTable.htm*. Dosya resmi kurulum paketinden çıkarıldı: https://www.occultations.org/sw/occult/OccultInstaller.zip (paket tarihi 2026-10-25) |
| Makale künyesi | Schaefer B.E., Bulder H.J.J., Bourgeois J., "Lunar occultation visibility", Icarus 100(1), 60–72, Kasım 1992, doi:10.1016/0019-1035(92)90018-3 | Crossref: https://api.crossref.org/works/10.1016/0019-1035(92)90018-3 ; LSU kaydı: https://repository.lsu.edu/physics_astronomy_pubs/4838 |
| Modelin kapsamı (özet) | "The theory includes the effects of varying background brightness (from scattered moonlight, night skylight, twilight, daylight, earthshine, and light pollution, as appropriate), telescope parameters (including light-collecting power, magnification, and throughput), and observer quality (based on the Snellen rating, comparative experience, and age)." | LSU özet sayfası (yukarıdaki URL) |
| Doğruluk | "We report on 1739 visual observations ... The theoretical model is well matched by the observations with a typical uncertainty of roughly one-third of a magnitude." | aynı |
| Büyütme önerisi | "observers should utilize the optimal magnification where the apparent size of the star's disk matches the eye's critical visual angle (this typically is the case for a magnification of roughly 10 power per centimeter of aperture)" | aynı |
| Tahminlerde minimum açıklık | "occultation predictions should routinely present the calculated minimum telescope aperture required to view the occultation" | aynı |
| SBB'yi tamamlayan denklemler | Gonzalez (MNRAS, Babil örtmeleri) SBB 1992'yi "supplemented with the equations in Schaefer (1991) and Schaefer (1993)" diye kullanıyor: Schaefer 1991, PASP 103, 645; Schaefer 1993, Vistas in Astron. 36, 311 | https://arxiv.org/pdf/1705.08946 |
| **Denklemlerin kendisi** | **Bulamadım.** Icarus makalesi ücretli; serbest kopya bulunamadı. Occult kaynak kodu: "For the record, I reserve all rights to the Source code and any decompilation thereof" (D. Herald) → kod açılmadı. | http://www.lunar-occultations.com/iota/occult4.htm (Copyright Issues) |
| Site ayarı | "Telescope aperture – This is used in lunar occultation predictions, to calculate the visibility of stars in occultation." / "Correction to limiting magnitude – ... Generally set this value to zero, If you find that you can see fainter stars than have been predicted, then adjust this value." | `Occult.chm` → *Site editor.htm* |
| Tahmin bayrakları | "d - disappearance, but star is less than 1 mag brighter than the predicted visibility limit." (r, gr, m aynı mantık; büyük harf D/R = sınırdan ≥1 kadir parlak) | `Occult.chm` → *Lunar Predictions PredictionContent.htm*; aynı metin IOTA-ES: https://iota-es.de/moon/brght_explanations.html |
| Cusp açısı işareti | "CA Cusp Angle ... -'ve values indicate a bright limb event." | aynı iki kaynak |
| Güneş irtifası sütunu | "Sun Alt the altitude of the sun. The field is blank if the sun is lower than -12 deg. (Nautical twilight)" | aynı iki kaynak |
| Gündüz filtresi | "exclude daytime events. The filter actually excludes events if the Sun's altitude is higher than -6 deg.- corresponding to civil twilight." | `Occult.chm` → *Lunar Predictions - Filter.htm* |
| Yorum | "Experience has shown that the values given in this table are fairly reliable for a range of telescope sizes and observer experiences. Generally speaking, if the star is more than a magnitude brighter than the table indicates ..., the graze will be fairly easy to observe in 'ordinary' conditions. Experienced observers in good conditions will usually be able to observe to the limiting magnitudes given in the table." | `Occult.chm` → *Lunar Predictions GrazeContent.htm* |

### 1.2 Occult sınır kadir tabloları (açıklık cm × cusp açısı) – 5 cm sütunu 7×50'ye en yakın yayımlanmış değer

Tablo başlığı her üç örnekte: "Limiting Magnitudes for various telescope apertures (in cm)". Pozitif CA = karanlık kenar.

**Örnek A – ince hilal, alacakaranlık** (Steve Preston, "Occult v4 Overview", Nisan 2019, s. graze örneği; https://occultations.org/documents/OccultTutorial.pdf). Koşullar: 2019-04-08, Ay %8+ aydınlık, elongasyon 32°, Güneş −9…−12°, Ay irtifası 11–15°, yıldız SAO 93353, 9.4 kadir.

| CA \ Açıklık | 5 | 10 | 15 | 20 | 25 | 30 | 35 |
|---|---|---|---|---|---|---|---|
| 2.9 | 6.6 | 8.1 | 8.9 | 9.4 | 9.7 | 10.0 | 10.2 |
| 4.9 | 6.6 | 8.1 | 8.9 | 9.4 | 9.8 | 10.0 | 10.2 |
| 6.9 | 6.7 | 8.1 | 8.9 | 9.4 | 9.8 | 10.1 | 10.3 |
| 8.9 | 6.7 | 8.1 | 9.0 | 9.5 | 9.8 | 10.1 | 10.3 |
| 10.9 | 6.7 | 8.2 | 9.0 | 9.5 | 9.9 | 10.1 | 10.4 |

Aynı belgede: "The Apr 23 graze has CA = 8.0S with a mag 8 star and an 81% illuminated moon. The limiting magnitude table tells me that I need an aperture of more than 35cm" ve "The Apr 27 graze has CA= 8.0S and a mag 4.9 star. The limiting mag table says I will need an aperture of only 10cm".

**Örnek B – dolunaya yakın, gece** (`Occult.chm` → *Lunar Predictions GrazeContent.htm*, Antares grazı 2008-05-20/21). Koşullar: Ay %99−, elongasyon 169°, boylam 40°'ta Ay irtifası 56°, Güneş sütunu boş (< −12°), CA ≈ 34.5N.

| CA \ Açıklık | 5 | 10 | 15 | 20 | 25 | 30 | 35 |
|---|---|---|---|---|---|---|---|
| 30.5 – 38.5 (5 satır aynı) | 4.4 | 5.9 | 6.6 | 7.1 | 7.5 | 7.7 | 7.9 |

**Örnek C – koşulları belirtilmemiş, uca (cusp) yakınlığın etkisi** (`Occult.chm` → *Lunar Predictions - GrazeMagTable.htm*, "At longitude 40.00").

| CA \ Açıklık | 5 | 10 | 15 | 20 | 25 | 30 | 35 |
|---|---|---|---|---|---|---|---|
| 1.7 | 2.8 | 4.1 | 4.9 | 5.3 | 5.5 | 5.7 | 5.8 |
| 3.7 | 4.5 | 5.9 | 6.7 | 7.1 | 7.4 | 7.6 | 7.8 |
| 5.7 | 4.7 | 6.1 | 6.8 | 7.3 | 7.6 | 7.8 | 7.9 |
| 7.7 | 5.4 | 6.8 | 7.5 | 8.0 | 8.3 | 8.5 | 8.7 |
| 9.7 | 5.4 | 6.8 | 7.5 | 8.0 | 8.3 | 8.5 | 8.7 |

Aynı sayfa: "Assume for this example that the star was of magnitude 5.0. This table indicates that the part of the graze that occurs furthest from the cusp will be visible in almost any telescope. However, when the star is close to the cusp, it will be more difficult to observe and might require a 20cm (8") telescope."

Çıkarım (kaynak değil): üç örnekte 5 cm → 10 cm geçişi sabit ~+1.4–1.5 kadir; 5 cm sütunu karanlık kenarda ince hilalde ~6.6–6.7, dolunaya yakın ~4.4, uca 2° kala ~2.8.

### 1.3 Occult çıktısından türetilebilen sınır aralıkları (15 cm, IOTA-ES Frankfurt listesi)

Kaynak: IOTA-ES "Occultation prediction for Frankfurt, Germany – E. Longitude 8 39 0.0, Latitude 50 8 30.0, Alt. 0m; Telescope dia 15cm; dMag 0.0" — https://www.iota-es.de/moon.html (sayfa başlığı "for the year 2025" diyor, satırlar 2026). Bayrak tanımı 1.1'deki gibi; aralıklar o tanımdan çıkarım.

| Tarih UT | Olay | Yıldız, kadir | Ay %ill | Elong | Güneş irt. | Ay irt. | CA | Bayraktan çıkan 15 cm sınırı (çıkarım) |
|---|---|---|---|---|---|---|---|---|
| 2026-03-16 09:36:19.0 | r | ZC 3171, 3.7 | 8− | 34 | 32 (gündüz) | 23 | 18S | 3.7 < sınır < 4.7 |
| 2026-03-29 18:22:37.2 | D | Regulus 1.4 | 89+ | 141 | −6 | 39 | 80N | sınır > 2.4 |
| 2026-03-29 19:30:56.3 | R | Regulus 1.4 | 89+ | 141 | (< −12) | 47 | −59N (parlak) | sınır > 2.4 |
| 2026-04-19 17:12:50.5 | D | ZC 541, 3.9 | 7+ | 31 | 10 | 39 | 21S | sınır > 4.9 |
| 2026-04-19 17:46:17.0 | r | ZC 541, 3.9 | 7+ | 31 | 5 | 34 | −44S (parlak) | 3.9 < sınır < 4.9 |
| 2026-09-17 15:20:40.1 | d | ZC 2383, 2.8 | 39+ | 77 | 20 | 11 | 53S | 2.8 < sınır < 3.8 |
| 2026-09-17 16:30:20.6 | r | ZC 2383, 2.8 | 39+ | 77 | 9 | 12 | −56S (parlak) | 2.8 < sınır < 3.8 |
| 2026-10-28 01:08:42.8 | d | ZC 541, 3.9 | 95− | 154 | (< −12) | 64 | −22S (parlak) | 3.9 < sınır < 4.9 |
| 2026-10-28 01:44:40.2 | R | ZC 541, 3.9 | 95− | 154 | (< −12) | 62 | 36S | sınır > 4.9 |
| 2026-12-21 23:10:28 | D | ZC 541, 3.9 | 93+ | 150 | (< −12) | 56 | 16S | sınır > 4.9 |
| 2026-12-21 23:21:34 | r | ZC 541, 3.9 | 93+ | 150 | (< −12) | 54 | −3S (parlak) | 3.9 < sınır < 4.9 |
| 2026-09-14 09:31:19.4 | D | Venüs −4.7 | 12+ | 41 | 38 | 3 | 83N | — |
| 2026-09-14 10:38:50.2 | R | Venüs −4.7 | 12+ | 41 | 42 | 11 | −73N | — |

### 1.4 Yayımlanmış kaba kurallar (formül değil)

| Kural | Alıntı | Kaynak |
|---|---|---|
| Karanlık kenar üst sınırı | "The star must be brighter than 11th magnitude or it will appear to merge with the Moon's limb rather than to distinctively disappear or reappear." | IOTA, *Chasing the Shadow: The IOTA Occultation Observer's Manual* (2007, ed. R. Nugent), §3.1 — http://www.poyntsource.com/IOTAmanual/IOTA_Observers_Manual_all_pages.pdf |
| Parlak kenar | "Reappearances will occur on the bright limb and only stars of approximately magnitude 3.5 or brighter will be observable." | aynı, §3.1 |
| Gündüz | "Observations of daytime events are usually impossible for stars fainter than magnitude 3.0-3.5." | aynı, §3.1 |
| Dürbün (Ay) | "Under good conditions, occultations of 4th-magnitude stars can be observed without optical aid during a total lunar eclipse in a dark sky away from city lights (such events are very rare), or during lunar crescent phases with binoculars, if they are steadily held on a tripod or supported firmly in some way. However, a telescope is necessary to observe nearly all occultations." | aynı, §3.2.1 |
| 7×50 (ASTEROİT bağlamı, karanlık gök) | "+5 or brighter – 7x50 binoculars firmly mounted on a tripod or other mount. / +5 to +8 – 4 inch telescope ... / +8 and fainter – 8 inch telescope" ("assumption that the observer will encounter a dark sky background") | aynı, §6.3.1 (Bölüm 6 = asteroit örtmeleri; Ay kenarı için değil) |
| LOW programı | "minimum aperture telescope in centimeters (cm) to view the event. Determining factors: observer's experience, altitude of the Moon and Sun, magnitude of star, Moon phase, cusp angle, dark limb or bright limb event." | aynı, §4 (Figure 4.1 açıklaması) |
| RASC el kitabı sınırı | "The predictions are limited to objects of magnitude 6.0 at the best phases and brighter otherwise; for some stations, brighter limits had to be used." | D. Dunham, *Lunar Occultations*, RASC Observer's Handbook 2026 metni — https://occultations.org/publications/rasc/2026/lunar26.pdf |
| RASC/BAA için Occult ayarı | "In the site file it is appropriate to set the telescope aperture at 10cm." ; kısa listede "Limiting magnitude ... The default setting is 6.0." | `Occult.chm` → *Lunar Predictions - BAA RASC.htm*, *Lunar Predictions - AutoGenerate.htm* |
| Graze (RASC) irtifa kuralı | "at least as high above the horizon in degrees as the star's magnitude (e.g. a third-magnitude star is included only if its altitude is at least 3°)"; limit 4.8 kadir | lunar26.pdf (yukarıda) |
| Graze haritası uç kuralları | "The paths end in "A" when the altitude above the horizon equals the star's or planet's magnitude, and it ends in "S" if the Sun altitude equals the negative of the star's magnitude. The path ends in "B" if the graze goes onto the sunlit side of the Moon." | https://occultations.org/publications/rasc/2026/nam26grz.htm |
| Şişkin evre | "During the gibbous phases, when glare is strong, especially near full moon, magnitude limits brighter than 7th are used." (haritalar 6.5/7 kadire kadar, "should be visible with small telescopes") | aynı sayfa |
| RASNZ renk kodu | "Green text indicates that the event occurs at an altitude less the 15 degrees. Red indicates that the event occurs with the Sun less than 10 degrees below the horizon." ; "If CA is negative this indicates that the event will be against the sunlit part of the moon and will probably require a large telescope to be observable." | RASNZ, Bright Stars Occulted by the Moon, Australia 2014 — https://occultations.org.nz/total/2014/tot_au14b.htm |
| Yarıgölge (tutulma) | "It may be assumed that if the star is fainter than mag 4.5, an occultation would only be observable if it occurred in the umbra." | `Occult.chm` → *Lunar Observations - Events.htm* |
| Occult arşiv-eşleştirme kadir sınırları (tahmin değil, hatalı gözlem düzeltme sezgiseli) | elongasyon < 126° → 10; < 137° → 9; < 160° → 8; < 177° → 7; > 177° → 10 (tutulma); "Bright limb 4" | `Occult.chm` → *Lunar Observations - Archive Editor.htm* |
| OASI tablosu | Kadir 1–3: "Naked eye / binoculars"; 4: "Binoculars"; 5: "Binoculars / telescope"; 6–9: "Telescope". Metin: "if the Moon is very young or very old and the star is of first or second magnitude, it is sometimes possible to observe an occultation with the naked eye." | Orwell Astronomical Society (Ipswich), J. Appleton, güncelleme 26 Mar 2023 — https://oasi.org.uk/Occs/More.php |
| in-the-sky.org harita ölçütü | "Solid contours show where each event is likely to be visible through binoculars at a reasonable altitude in the sky. Dotted contours indicate where each event occurs above the horizon, but may not be visible due to the sky being too bright or the Moon being very close to the horizon." Sayısal eşik: **bulamadım**. | örn. https://in-the-sky.org/news.php?id=20270524_16_100 |
| IOTA-ES graze tabloları | "The overall limiting magnitude is 5.0. During lunar eclipses stellar magnitudes to 10.0 mag are considered." Harita uçları: A = Ay/yıldız irtifası, B = Ay yüzeyi parlaklığı, S = güneş ışığı/gök parlaklığı, U = gölge kenarı | E. Riedel, JOA 2026-1, s. 10 — https://www.iota-es.de/JOA/JOA2026_1.pdf |

### 1.5 7×50 dürbün için (çıkarım – kaynak değil, uygulamaya öneri)

- Yayımlanmış, 7×50'ye özel Ay-kenarı eşiği **bulamadım**. En yakın sayısal referans Occult'un **5 cm** sütunu (1.2): ince hilal/karanlık kenar ~6.6–6.7; dolunaya yakın/karanlık kenar ~4.4; uca 2° kala ~2.8.
- SBB 1992 optimum büyütmeyi ~10×/cm diyor (5 cm için ~50×). 7×50 dürbün 7× (≈1.4×/cm) olduğundan, aynı açıklıkta teleskoptan **daha kötü** olması beklenir; ne kadar kötü olduğu SBB denklemleri olmadan hesaplanamaz → **askıda**.
- Pratik alt sınırlar kaynaklarla uyumlu kaba kural olarak: parlak kenar ≤ ~3.5 kadir (IOTA), gündüz ≤ 3.0–3.5 (IOTA), yarıgölgede ≤ 4.5 (Occult), hilalde tripodlu dürbünle ~4 kadir (IOTA). Bu sayılar teleskop/genel gözlemci içindir; dürbün için düzeltme: **bulamadım**.

---

## 2. İstanbul / Türkiye için yayımlanmış tahminler (Kas 2026 – Ara 2027)

### 2.1 in-the-sky.org – İstanbul konumu (41.01°K; 28.95°D) – parlak cisim örtmeleri

Yöntem: `https://in-the-sky.org/search.php?ordernews=asc&feed=occultations&...&town=745044` ile 2026-11-01 – 2027-12-31 arası tüm "Lunar Occultations" olayları (42 olay) listelendi; her olay sayfası `&town=745044` ile (konum satırı "İstanbul (41.01°N; 28.95°E)") 3 sn aralıkla indirildi. Bot engeli bu oturumda gelmedi. Yazar: Dominic Ford. Not: Fetih Mahallesi (29.0762°D) ile in-the-sky İstanbul noktası arasında ~10 km fark var.

**İstanbul'dan görünür olanlar (2 olay):**

| Olay | İstanbul D | İstanbul R | Ek bilgi | Türkiye genel aralığı (UTC) | URL |
|---|---|---|---|---|---|
| σ Sagittarii (Nunki), 2.1 kadir, 2027-05-24 | 02:18 GMT+03 = **2027-05-23 23:18 UTC**, GD gökte, irtifa 19.1° | 03:50 GMT+03 = **2027-05-24 00:50 UTC**, irtifa 22.7° | Ay %88; "will disappear behind the illuminated side of the Moon and reappear from behind the unilluminated side" (D parlak kenar, R karanlık kenar) | 23:10–01:21 | https://in-the-sky.org/news.php?id=20270524_16_100 |
| σ Sagittarii (Nunki), 2.1 kadir, 2027-08-13 | 21:40 GMT+03 = **18:40 UTC**, güney gökte, irtifa 21.6° | 23:08 GMT+03 = **20:08 UTC**, irtifa 22.1° | Ay %89; "will disappear behind the unilluminated side of the Moon and reappear from behind the illuminated side" (D karanlık, R parlak kenar); konum RA 18h55m10s, Dec −26°17′ | 18:34–20:27 | https://in-the-sky.org/news.php?id=20270813_16_100 |

Kaynak tuhaflığı: her iki sayfa "the Moon will be 0 days past new moon and will be 88/89% illuminated" diyor — "0 days past new moon" ile %88 çelişkili; aydınlanma yüzdesi esas alınmalı.

**İstanbul'dan görünmeyenler** ("Unfortunately the occultation will not be visible from İstanbul."; parantez = sayfadaki küresel olay aralığı UTC): Mars 2026-11-02 (12:15–15:02); Jüpiter 2026-11-02/03 (20:45–00:45); Regulus 2026-11-03 (06:59–10:24); Venüs 2026-11-07 (09:26–11:59); Antares 2026-11-11 (02:24–06:52); σ Sgr 2026-11-13/14 (20:01–00:39); β Tau 2026-11-25/26 (22:15–00:53); Jüpiter 2026-11-30 (07:15–09:32); Regulus 2026-11-30 (13:11–15:36); σ Sgr 2026-12-11 (02:43–07:15); β Tau 2026-12-23 (09:33–12:07); Antares 2027-01-04 (15:01–19:27); β Tau 2027-01-19 (20:36–23:24); Antares 2027-01-31/02-01 (21:18–01:38); σ Sgr 2027-02-03 (15:11–19:45); Merkür 2027-02-08 (01:41–06:09); β Tau 2027-02-16 (05:24–08:18); Jüpiter 2027-02-20 (03:51–06:01); Antares 2027-02-28 (04:38–08:58); σ Sgr 2027-03-02/03 (22:12–02:46); β Tau 2027-03-15 (11:50–14:18); Jüpiter 2027-03-19 (07:54–10:56); Antares 2027-03-27 (13:02–17:30); σ Sgr 2027-03-30 (06:04–10:27); Jüpiter 2027-04-15 (12:51–15:45); Antares 2027-04-23/24 (21:42–02:14); σ Sgr 2027-04-26 (14:24–18:18); Jüpiter 2027-05-12 (21:30–22:13); Antares 2027-05-21 (05:37–10:07); Antares 2027-06-17 (12:14–16:46); σ Sgr 2027-06-20 (05:36–08:21); Antares 2027-07-14 (18:01–22:35); σ Sgr 2027-07-17 (11:47–14:33); Antares 2027-08-10/11 (23:57–04:31); Antares 2027-09-07 (07:02–11:34); σ Sgr 2027-09-10 (00:26–02:54); Antares 2027-10-04 (15:35–19:59); Antares 2027-11-01 (00:55–05:07); Venüs 2027-11-30 (11:55–15:17); Antares 2027-12-25 (16:45–20:55). Her birinin URL'si: `https://in-the-sky.org/news.php?id=YYYYMMDD_16_100` (aynı gün ikinci olay `_16_101`).

Not: in-the-sky bu akışta Ülker yıldızları için "örtme" değil yalnız "close approach" veriyor; Ülker'in tek tek yıldızları için İstanbul zamanı **bulamadım**.

### 2.2 İstanbul ve yakın şehirler – pencere dışı ama test için değerli: Venüs 2026-09-14 (gündüz)

| Şehir | D (UT) | R (UT) | Kaynak |
|---|---|---|---|
| İstanbul (41.01K, 28.95D) | 12:41 GMT+03 = **09:41** ("though in daylight") | 13:59 GMT+03 = **10:59** | in-the-sky.org: https://in-the-sky.org/news.php?id=20260914_16_100&town=745044 |
| Atina | **09:33:54** (day) | **10:52:21** (day) | IOTA-ES, GRAZPREP 4.33 görseli (görüntüden okundu): https://www.iota-es.de/moon/planets_occ/Venus_Sep_14_2026.JPG (sayfa: https://www.iota-es.de/moon/moon_occ_venus_20260914.html) |
| Lizbon / Londra / Roma / Berlin / Viyana / Varşova / Tallinn | D: — / — / 09:27:56 / 09:36:59 / 09:33:51 / 09:43:32 / 10:04:58 | R: 10:13:52 / 10:35:12 / 10:39:30 / 10:41:09 / 10:43:10 / 10:44:06 / 10:37:44 | aynı görsel (şehir koordinatları verilmemiş → **bulamadım**) |
| Frankfurt (8°39′00″D, 50°08′30″K, 0 m) | **09:31:19.4** (CA 83N, Güneş 38°, Ay 3°) | **10:38:50.2** (CA −73N, Güneş 42°, Ay 11°) | IOTA-ES Occult çıktısı: https://www.iota-es.de/moon.html |

Ek: IOTA-ES graze haritası (https://www.iota-es.de/moon/planets_occ/G_Venus_Sep_14_2026.JPG) kuzey limitini Finlandiya'dan ~45°D/48°K'ye, güney limitini Cebelitarık civarına çiziyor → İstanbul örtme bölgesinin içinde (görüntüden okuma). TÜBİTAK/TUG 2026 yıllığı aynı gün için yalnız "14 Eylül Ay ve Venüs birbirlerine yakın görünümde" diyor (örtme demiyor) — https://bilimteknik.tubitak.gov.tr/wp-content/uploads/sites/154/2026/01/bilim_teknik_2026_gok_olaylari_yilligi.pdf

### 2.3 Avrupa graze listesi (IOTA-ES, JOA 2026-1) – pencere içi satırlar

Kaynak: E. Riedel, "Grazing Occultations of Stars and Planets by the Moon in 2026", JOA 2026-1, s. 11–12 (tablo görüntüden okundu), "Grazing Occultations Europe 2026 <= 5.0 mag. dark limb at night", GRAZPREP 5.13 — https://www.iota-es.de/JOA/JOA2026_1.pdf. W.UT = graze çizgisinin batı ucundaki UT; LONG/LAT = batı ucunun konumu.

| No | Tarih | Yıldız | Kadir | %SNL | Limit | W.UT | Batı ucu (boylam, enlem) |
|---|---|---|---|---|---|---|---|
| 14 | Nov 05 | ZC 1685 υ Leonis (çift, 4.5/9.0) | 4.3 | 16− | S | 04 47.9 | −11, 50 |
| 15 | Dec 21 | ZC 539 Taygeta (19 Tau) | 4.3 | 93+ | S | 22 23.8 | −11, 40 |
| 16 | Dec 27 | ZC 1486 31 Leonis (A Leonis) | 4.4 | 79− | S | 22 4.1 | 0, 45 |
| 17 | Dec 28 | ZC 1599 58 Leonis | 4.8 | 68− | S | 22 47.1 | −1, 37 |

Haritadan (çıkarım, görüntü ölçeği kaba): 14 numara Balkanlar'da "S" (güneş) ile bitiyor; 15 İtalya civarında "B" ile bitiyor; 16 sağ kenara (~45°D, ~41–42°K) uzanıyor, 29°D'de çizginin enlemi haritadan güvenilir okunamıyor → İstanbul'un bu grazın kuzeyinde mi güneyinde mi olduğu **askıda**. Orta Doğu haritası (s. 14) 40–70°D'yi kapsıyor, İstanbul dışında.

### 2.4 Diğer pencere içi kaynaklı olaylar (İstanbul'a özel değil)

| Olay | Bilgi | Kaynak |
|---|---|---|
| 75 Leo (ZC 1635, 5.18 kadir) | 2026-12-02, Ay −41%, "Europe/Asia", örnek konum Varşova, **00h 04m UT**. Listede 2027 olayları: 01-25 Darwin 18h16m; 02-22 Mexico City 03h26m; 03-21 Sydney 15h21m; 04-17 Cape Town 23h32m ("provisional list ... (Occult)") | K. Guhl, "Duplicity of 75 Leo – right or wrong?", JOA 2025-4, s. 3 — https://www.iota-es.de/JOA/JOA2025_4.pdf |
| Ülker – Maia (ZC 541) Frankfurt | 2026-12-21 23:10:28 D (CA 16S), 23:21:34 r (CA −3S) | https://www.iota-es.de/moon.html |
| Avrupa'da gezegen örtmesi 2027 | "2027 – None" (yalnız tamamen gündüz olanlar listelenmemiş) | https://www.iota-es.de/moon/moon_occ_plan.html |
| Dünya geneli gezegen grazları Kas 2026 | Mars Nov 02 N (W.UT 12 28.9; −170, −22); Jüpiter Nov 02 N (21 8.6; 55, 11) ve S (21 38.3; 57, −25); Venüs Nov 07 N (9 34.0; −84, −23); Jüpiter Nov 30 N (7 26.4; −114, −28) | JOA 2026-1, s. 25 "Grazing Occultations Planets 2026" (görüntüden okundu) |

### 2.5 Türk kaynakları

| Kaynak | Sonuç | URL |
|---|---|---|
| TÜBİTAK Bilim ve Teknik + Türkiye Ulusal Gözlemevleri, **2026 Gök Olayları Yıllığı** (hazırlayanlar O. Okuyan, D. T. Köseoğlu; 40 s.) | Metinde Ay örtmesi **yok** ("örtül-" yalnız tutulma bağlamında). Eyl–Ara: 14 Eyl Ay–Venüs, 3 Kas Ay–Jüpiter–Mars, 7 Kas Ay–Venüs–Spika, 30 Kas Ay–Jüpiter–Mars, 28 Ara Ay–Jüpiter–Mars "yakın görünümde" | https://bilimteknik.tubitak.gov.tr/wp-content/uploads/sites/154/2026/01/bilim_teknik_2026_gok_olaylari_yilligi.pdf |
| 2027 Gök Olayları Yıllığı | **Bulamadım** (aynı URL kalıbında yok; muhtemelen Ocak 2027'de çıkacak) | — |
| Arama motoru eşleşen eski adres (`/system/files/makale/bilim_teknik_2026_gok_olaylari_yilligi.pdf`) | 404 | — |
| gokyuzu.org (ODTÜ AAT) arama "örtme", "örtülme" | 2026–27 tahmini **yok** (çıkan "Ay-Ülker Yakınlaşması" 2010 tarihli) | https://gokyuzu.org/?s=örtülme |
| Türk Astronomi Derneği arama | Sonuç yok | https://www.tad.org.tr/?s=örtülme |
| ttdergi.com | Erişilemedi (proxy 502) | — |
| Kandilli (boun.edu.tr) | Erişilemedi (bağlantı sıfırlandı) | — |
| timeanddate.com | 403 | — |
| TheSkyLive | WebFetch istemci hatası (engelli) | — |
| IOTA dünya çapı parlak yıldız listesi (bstar) | 2025'te sona erdi (önceki dosya B0) | http://www.lunar-occultations.com/iota/bstar/bstar.htm |

---

## 3. Gezegen örtmeleri – algoritma testi için şehir bazlı yayımlanmış zamanlar

**Önemli tanım:** Occult tahminleri gezegenin **merkezi** içindir: "For planets, moons and asteroids, the prediction is for the center of the object. The prediction also includes a line like: Duration of planetary disk occultation: predicted time +/-33.1 secs" — `Occult.chm` → *Lunar Predictions PredictionContent.htm*. GRAZPREP (IOTA-ES görseli) ve in-the-sky.org'un merkez mi kenar mı verdiği: **bulamadım**.

Olay tipi kodları (RASC): DD = karanlık kenarda kaybolma, DB = parlak kenarda kaybolma, RD/RB = karanlık/parlak kenarda yeniden görünme. CA negatif = parlak kenar.

### 3.1 RASC Observer's Handbook 2026 – 18 standart istasyon (Occult4, D. Herald & D. Dunham; UT sa:dk.ondalık dk)

Kaynak dosyalar (her biri 3 istasyon): https://occultations.org/publications/rasc/2026/HalMonTor.txt , WinEdmVan.txt , MasWasChi.txt , MiaAtlAus.txt , KanDenNMA.txt , LaxNCaHon.txt (aynı dizin; sayfa: https://occultations.org/publications/rasc/2026/nam26grz.htm). İstasyon koordinatları dosya başlığında 0.1° hassasiyetle (W negatif yazıldı). Boş = o istasyonda olay yok / ufuk altı / güneş ışığı.

| Tarih (UT) | Cisim | İstasyon | Boylam (°) | Enlem (°) | D (UT, sa:dk.d) | D tipi / CA | R (UT, sa:dk.d) | R tipi / CA |
|---|---|---|---|---|---|---|---|---|
| 2026-02-19 | Merkür | Miami | -80.3 | 25.8 | 00:32.1 | DD / 68N (%2+) | — | — |
| 2026-02-19 | Merkür | Atlanta | -84.3 | 33.8 | 00:44.1 | DD / 29N (%2+) | — | — |
| 2026-02-19 | Merkür | Austin | -97.8 | 30.2 | 00:36.7 | DD / 40N (%2+) | 01:23.2 | RB / -52N (%3+) |
| 2026-06-17 | Venüs | Halifax | -63.6 | 44.6 | 20:20.3 | DD / 51N (%11+) | 21:02.0 | RB / -14N (%11+) |
| 2026-06-17 | Venüs | Montreal | -73.6 | 45.5 | 19:54.6 | DD / 68N (%11+) | 20:57.9 | RB / -34N (%11+) |
| 2026-06-17 | Venüs | Toronto | -79.4 | 43.7 | 19:41.3 | DD / 83N (%11+) | 20:57.9 | RB / -49N (%11+) |
| 2026-06-17 | Venüs | Winnipeg | -97.2 | 49.9 | 19:12.1 | DD / 74N (%11+) | 20:23.7 | RB / -52N (%11+) |
| 2026-06-17 | Venüs | Edmonton | -113.4 | 53.6 | 18:59.1 | DD / 61N (%11+) | 19:59.1 | RB / -47N (%11+) |
| 2026-06-17 | Venüs | Vancouver | -123.1 | 49.2 | 18:43.1 | DD / 74N (%11+) | 19:50.4 | RB / -64N (%11+) |
| 2026-06-17 | Venüs | Massachusetts | -72.5 | 42.5 | 19:56.7 | DD / 77N (%11+) | 21:07.1 | RB / -40N (%11+) |
| 2026-06-17 | Venüs | Washington DC | -77.0 | 38.9 | 19:48.2 | DD / 85S (%11+) | 21:11.5 | RB / -58N (%11+) |
| 2026-06-17 | Venüs | Chicago | -87.7 | 41.9 | 19:24.7 | DD / 83S (%11+) | 20:50.0 | RB / -66N (%11+) |
| 2026-06-17 | Venüs | Miami | -80.3 | 25.8 | 20:06.3 | DD / 37S (%11+) | 21:24.7 | RB / -80S (%11+) |
| 2026-06-17 | Venüs | Atlanta | -84.3 | 33.8 | 19:39.4 | DD / 59S (%11+) | 21:07.5 | RB / -84N (%11+) |
| 2026-06-17 | Venüs | Austin | -97.8 | 30.2 | 19:24.6 | DD / 29S (%11+) | 20:27.9 | RB / -58S (%11+) |
| 2026-06-17 | Venüs | Kansas City | -94.5 | 39.0 | 19:13.5 | DD / 68S (%11+) | 20:40.4 | RB / -84N (%11+) |
| 2026-06-17 | Venüs | Denver | -105.0 | 39.8 | 18:55.4 | DD / 68S (%11+) | 20:17.9 | RB / -88S (%11+) |
| 2026-06-17 | Venüs | New Mexico-Arizona | -109.0 | 34.0 | 18:54.8 | DD / 44S (%11+) | 20:03.2 | RB / -62S (%11+) |
| 2026-06-17 | Venüs | Los Angeles | -118.3 | 34.1 | 18:40.5 | DD / 49S (%11+) | 19:44.7 | RB / -60S (%11+) |
| 2026-06-17 | Venüs | N. California | -122.0 | 38.0 | 18:34.0 | DD / 67S (%11+) | 19:45.8 | RB / -76S (%11+) |
| 2026-06-17 | Venüs | Honolulu | -157.9 | 21.3 | — | — | 19:00.0 | RB / -41S (%11+) |
| 2026-09-08 | Jüpiter | Halifax | -63.6 | 44.6 | 18:56.3 | DB / -89N (%7-) | 19:51.6 | RD / 67N (%7-) |
| 2026-09-08 | Jüpiter | Montreal | -73.6 | 45.5 | 18:50.6 | DB / -81S (%7-) | 19:50.2 | RD / 75N (%7-) |
| 2026-09-08 | Jüpiter | Toronto | -79.4 | 43.7 | 18:51.0 | DB / -71S (%7-) | 19:52.2 | RD / 83N (%7-) |
| 2026-09-08 | Jüpiter | Winnipeg | -97.2 | 49.9 | 18:28.1 | DB / -56S (%7-) | 19:31.0 | RD / 82S (%7-) |
| 2026-09-08 | Jüpiter | Edmonton | -113.4 | 53.6 | 18:10.4 | DB / -40S (%7-) | 19:06.6 | RD / 65S (%7-) |
| 2026-09-08 | Jüpiter | Massachusetts | -72.5 | 42.5 | 18:56.5 | DB / -78S (%7-) | 19:55.6 | RD / 78N (%7-) |
| 2026-09-08 | Jüpiter | Washington DC | -77.0 | 38.9 | 19:01.4 | DB / -67S (%7-) | 20:00.8 | RD / 87N (%7-) |
| 2026-09-08 | Jüpiter | Chicago | -87.7 | 41.9 | 18:50.6 | DB / -56S (%7-) | 19:51.2 | RD / 84S (%7-) |
| 2026-09-08 | Jüpiter | Miami | -80.3 | 25.8 | 19:29.6 | DB / -36S (%7-) | 20:15.4 | RD / 63S (%7-) |
| 2026-09-08 | Jüpiter | Atlanta | -84.3 | 33.8 | 19:10.1 | DB / -46S (%7-) | 20:04.8 | RD / 75S (%7-) |
| 2026-09-08 | Jüpiter | Austin | -97.8 | 30.2 | 19:30.6 | DB / 7S (%7-) | 19:42.2 | RD / 26S (%7-) |
| 2026-09-08 | Jüpiter | Kansas City | -94.5 | 39.0 | 18:55.2 | DB / -38S (%7-) | 19:48.8 | RD / 68S (%7-) |
| 2026-09-08 | Jüpiter | Denver | -105.0 | 39.8 | 18:54.4 | DB / -13S (%7-) | 19:28.7 | RD / 44S (%7-) |
| 2026-10-06 | Ganymede | Halifax | -63.6 | 44.6 | — | — | 09:38.2 | RD / 57N (%19-) |
| 2026-10-06 | Ganymede | Montreal | -73.6 | 45.5 | — | — | 09:28.1 | RD / 55N (%19-) |
| 2026-10-06 | Ganymede | Toronto | -79.4 | 43.7 | — | — | 09:24.3 | RD / 62N (%19-) |
| 2026-10-06 | Ganymede | Winnipeg | -97.2 | 49.9 | — | — | 09:06.1 | RD / 20N (%20-) |
| 2026-10-06 | Ganymede | Massachusetts | -72.5 | 42.5 | — | — | 09:30.4 | RD / 67N (%19-) |
| 2026-10-06 | Ganymede | Washington DC | -77.0 | 38.9 | — | — | 09:26.5 | RD / 80N (%19-) |
| 2026-10-06 | Ganymede | Chicago | -87.7 | 41.9 | — | — | 09:19.2 | RD / 66N (%19-) |
| 2026-10-06 | Ganymede | Miami | -80.3 | 25.8 | — | — | 09:11.2 | RD / 49S (%19-) |
| 2026-10-06 | Ganymede | Atlanta | -84.3 | 33.8 | — | — | 09:18.8 | RD / 84S (%19-) |
| 2026-10-06 | Ganymede | Austin | -97.8 | 30.2 | — | — | 09:11.4 | RD / 79S (%19-) |
| 2026-10-06 | Ganymede | Kansas City | -94.5 | 39.0 | — | — | 09:15.9 | RD / 73N (%19-) |
| 2026-10-06 | Ganymede | Denver | -105.0 | 39.8 | — | — | 09:12.9 | RD / 62N (%19-) |
| 2026-10-06 | Io | Halifax | -63.6 | 44.6 | — | — | 09:33.8 | RD / 58N (%20-) |
| 2026-10-06 | Io | Montreal | -73.6 | 45.5 | — | — | 09:23.8 | RD / 56N (%20-) |
| 2026-10-06 | Io | Toronto | -79.4 | 43.7 | — | — | 09:20.0 | RD / 62N (%20-) |
| 2026-10-06 | Io | Winnipeg | -97.2 | 49.9 | — | — | 09:01.9 | RD / 19N (%20-) |
| 2026-10-06 | Io | Massachusetts | -72.5 | 42.5 | — | — | 09:26.0 | RD / 67N (%19-) |
| 2026-10-06 | Io | Washington DC | -77.0 | 38.9 | — | — | 09:22.0 | RD / 80N (%19-) |
| 2026-10-06 | Io | Chicago | -87.7 | 41.9 | — | — | 09:15.0 | RD / 66N (%19-) |
| 2026-10-06 | Io | Miami | -80.3 | 25.8 | — | — | 09:06.7 | RD / 49S (%20-) |
| 2026-10-06 | Io | Atlanta | -84.3 | 33.8 | — | — | 09:14.5 | RD / 84S (%20-) |
| 2026-10-06 | Io | Austin | -97.8 | 30.2 | — | — | 09:07.5 | RD / 79S (%20-) |
| 2026-10-06 | Io | Kansas City | -94.5 | 39.0 | — | — | 09:11.8 | RD / 72N (%19-) |
| 2026-10-06 | Io | Denver | -105.0 | 39.8 | — | — | 09:09.0 | RD / 61N (%19-) |
| 2026-10-06 | Jüpiter | Halifax | -63.6 | 44.6 | 08:34.5 | DB / -68N (%20-) | 09:36.3 | RD / 57N (%19-) |
| 2026-10-06 | Jüpiter | Montreal | -73.6 | 45.5 | 08:30.5 | DB / -62N (%20-) | 09:26.3 | RD / 55N (%19-) |
| 2026-10-06 | Jüpiter | Toronto | -79.4 | 43.7 | 08:25.7 | DB / -66N (%20-) | 09:22.4 | RD / 62N (%19-) |
| 2026-10-06 | Jüpiter | Winnipeg | -97.2 | 49.9 | 08:44.8 | DB / -21N (%20-) | 09:04.2 | RD / 19N (%20-) |
| 2026-10-06 | Jüpiter | Massachusetts | -72.5 | 42.5 | 08:26.2 | DB / -74N (%20-) | 09:28.5 | RD / 67N (%19-) |
| 2026-10-06 | Jüpiter | Washington DC | -77.0 | 38.9 | 08:20.6 | DB / -85N (%20-) | 09:24.5 | RD / 80N (%19-) |
| 2026-10-06 | Jüpiter | Chicago | -87.7 | 41.9 | 08:22.3 | DB / -67N (%20-) | 09:17.3 | RD / 66N (%19-) |
| 2026-10-06 | Jüpiter | Miami | -80.3 | 25.8 | 08:21.3 | DB / -48S (%20-) | 09:09.3 | RD / 49S (%19-) |
| 2026-10-06 | Jüpiter | Atlanta | -84.3 | 33.8 | 08:15.8 | DB / -82S (%20-) | 09:16.9 | RD / 84S (%19-) |
| 2026-10-06 | Jüpiter | Austin | -97.8 | 30.2 | — | — | 09:09.7 | RD / 79S (%19-) |
| 2026-10-06 | Jüpiter | Kansas City | -94.5 | 39.0 | 08:19.3 | DB / -72N (%20-) | 09:14.1 | RD / 73N (%19-) |
| 2026-10-06 | Jüpiter | Denver | -105.0 | 39.8 | — | — | 09:11.2 | RD / 62N (%19-) |
| 2026-10-06 | Jüpiter | New Mexico-Arizona | -109.0 | 34.0 | — | — | 09:10.8 | RD / 79N (%19-) |

Not: aynı dosyalarda 2026 Regulus (ZC 1487) satırları da var (ör. Toronto 2026-02-03 DB 01:48.7, RD 02:51.1).

### 3.2 IOTA şehir listeleri (Occult; saniye hassasiyeti, koordinatlı)

Kaynak sayfalar (R. Robinson, lunar-occultations.com): Venüs http://www.lunar-occultations.com/iota/bstar/0617venus.htm ; Jüpiter http://www.lunar-occultations.com/iota/bstar/1006jupiter.htm ; Merkür http://www.lunar-occultations.com/iota/bstar/0218mercury.htm (başlık "18 Feb 2026", tablo "Date 2026 Feb 19"); Regulus (yıldız, Avrupa testi) http://www.lunar-occultations.com/iota/bstar/0203zc1487.htm . Koordinatlar sayfa sonundaki "E. Long / Latitude" listesinden (derece + dakika). "Güneş/Ay irt." sütununda "(<-12 / boş)" = kaynakta Güneş irtifası boş bırakılmış (Occult tanımına göre < −12°).

| Tarih (UT) | Cisim | Şehir (kaynaktaki yazım) | Boylam | Enlem | D (UT) | D: Güneş/Ay irt., CA | R (UT) | R: Güneş/Ay irt., CA |
|---|---|---|---|---|---|---|---|---|
| 2026-06-17 | Venüs | CA Toronto | -79° 22.2′ (-79.3700) | +43° 51.7′ (+43.8617) | 19:41:20 | 54/67, 82N | 20:57:28 | 41/65, -48N |
| 2026-06-17 | Venüs | US New York Ny | -73° 52.4′ (-73.8733) | +40° 46.6′ (+40.7767) | 19:54:01 | 49/70, 85N | 21:10:30 | 35/63, -47N |
| 2026-06-17 | Venüs | US Washington Dc | -77° 2.3′ (-77.0383) | +38° 51.1′ (+38.8517) | 19:48:07 | 53/72, 84S | 21:11:32 | 37/66, -58N |
| 2026-06-17 | Venüs | US Miami Fl | -80° 53.8′ (-80.8967) | +25° 51.7′ (+25.8617) | 20:05:21 | 54/85, 36S | 21:22:55 | 36/73, -79S |
| 2026-06-17 | Venüs | CU Havana | -82° 24.6′ (-82.4100) | +22° 59.4′ (+22.9900) | 20:14:47 | 52/88, 20S | 21:17:54 | 38/76, -64S |
| 2026-06-17 | Venüs | VE Caracas | -66° 59.4′ (-66.9900) | +10° 36.2′ (+10.6033) | 21:10:16 | 22/61, 18S | 22:06:36 | 9/48, -68S |
| 2026-10-06 | Jüpiter | CA Toronto | -79° 22.2′ (-79.3700) | +43° 51.7′ (+43.8617) | 08:25:57 | (<-12 / boş)/17, -66N | 09:22:24 | (<-12 / boş)/27, 61N |
| 2026-10-06 | Jüpiter | US New York Ny | -73° 52.4′ (-73.8733) | +40° 46.6′ (+40.7767) | 08:23:35 | (<-12 / boş)/20, -80N | 09:27:28 | (<-12 / boş)/32, 73N |
| 2026-10-06 | Jüpiter | US Washington Dc | -77° 2.3′ (-77.0383) | +38° 51.1′ (+38.8517) | 08:20:32 | (<-12 / boş)/17, -85N | 09:24:29 | (<-12 / boş)/30, 80N |
| 2026-10-06 | Jüpiter | US Miami Fl | -80° 53.8′ (-80.8967) | +25° 51.7′ (+25.8617) | 08:20:48 | (<-12 / boş)/12, -49S | 09:09:02 | (<-12 / boş)/23, 50S |
| 2026-10-06 | Jüpiter | CU Havana | -82° 24.6′ (-82.4100) | +22° 59.4′ (+22.9900) | 08:25:19 | (<-12 / boş)/11, -35S | 09:01:21 | (<-12 / boş)/19, 35S |
| 2026-10-06 | Jüpiter | ZA Johannesburg | +28° 14.7′ (+28.2450) | -26° 8.4′ (-26.1400) | 11:52:09 | 55/3, -24S | — | — |
| 2026-10-06 | Jüpiter | KE Nairobi | +36° 51.7′ (+36.8617) | -1° 16.6′ (-1.2767) | 11:39:21 | 55/6, -50N | — | — |
| 2026-02-19 | Merkür | Atlanta Ga | -84° 26.0′ (-84.4333) | +33° 39.0′ (+33.6500) | 00:43:43 | (<-12 / boş)/1, 30N | — | — |
| 2026-02-19 | Merkür | Austin Tx | -97° 42.0′ (-97.7000) | +30° 18.0′ (+30.3000) | 00:36:54 | -4/14, 39N | 01:23:04 | (<-12 / boş)/4, -51N |
| 2026-02-19 | Merkür | Miami Fl | -80° 16.0′ (-80.2667) | +25° 48.0′ (+25.8000) | 00:32:04 | (<-12 / boş)/0, 68N | — | — |
| 2026-02-03 | Regulus (ZC 1487, yıldız) | PT Lisbon | -9° 8.1′ (-9.1350) | +38° 46.9′ (+38.7817) | 03:42:19 | (<-12 / boş)/54, -39N | 04:08:15 | (<-12 / boş)/50, 3N |
| 2026-02-03 | Regulus (ZC 1487, yıldız) | PT Lisbon | -9° 9.3′ (-9.1550) | +38° 43.0′ (+38.7167) | 03:42:07 | (<-12 / boş)/54, -40N | 04:08:35 | (<-12 / boş)/50, 3N |
| 2026-02-03 | Regulus (ZC 1487, yıldız) | ES Sevilla | -5° 53.6′ (-5.8933) | +37° 25.1′ (+37.4183) | 03:56:43 | (<-12 / boş)/50, -26N | 04:06:14 | (<-12 / boş)/49, -10N |
| 2026-02-03 | Regulus (ZC 1487, yıldız) | GI Gibraltar | -5° 21.0′ (-5.3500) | +36° 9.0′ (+36.1500) | 03:55:27 | (<-12 / boş)/51, -33N | 04:13:10 | (<-12 / boş)/47, -4N |
| 2026-02-03 | Regulus (ZC 1487, yıldız) | MA Casablanca | -7° 35.3′ (-7.5883) | +33° 22.1′ (+33.3683) | 03:45:10 | (<-12 / boş)/56, -55N | 04:27:50 | (<-12 / boş)/47, 17N |

### 3.3 Çapraz kontroller (aynı olay, farklı kaynak)

| Olay / yer | RASC (Occult, 0.1 dk) | IOTA şehir listesi (Occult, sn) | in-the-sky.org (dk) | Not |
|---|---|---|---|---|
| Venüs 2026-06-17 Toronto | D 19:41.3, R 20:57.9 (−79.4, 43.7) | D 19:41:20, R 20:57:28 (−79.370, 43.862) | D 15:42 EDT = 19:42, R 16:58 EDT = 20:58 (43.70K, 79.42B) — https://in-the-sky.org/news.php?id=20260617_16_100&town=6167865 | Üçü ≤1 dk uyumlu |
| Jüpiter 2026-10-06 Toronto | D 08:25.7, R 09:22.4 | D 08:25:57, R 09:22:24 | D 04:26 EDT = 08:26, **R 05:25 EDT = 09:25** — https://in-the-sky.org/news.php?id=20261006_16_100&town=6167865 | in-the-sky R'si Occult'tan **~2.6 dk geç**; nedeni bulamadım (merkez/kenar tanımı olabilir – askıda) |
| Merkür 2026-02-19 Atlanta / Austin | Atlanta D 00:44.1; Austin D 00:36.7, R 01:23.2 | Atlanta D 00:43:43; Austin D 00:36:54, R 01:23:04 | — | Koordinat farkı içinde uyumlu |
| Venüs 2026-09-14 İstanbul–Atina–Frankfurt | — | — | İstanbul D 09:41, R 10:59 | Atina (GRAZPREP) 09:33:54 / 10:52:21; Frankfurt (Occult) 09:31:19.4 / 10:38:50.2 |

Çıkarım (test toleransı önerisi, kaynak değil): Occult kaynaklı RASC ↔ IOTA şehir listesi farkları yalnız koordinat farkından; in-the-sky ile karşılaştırmada ±1 dk (bazı olaylarda ±3 dk) tolerans gerekli.

---

## 4. Erişim ve yöntem notları

- `lunar-occultations.com` HTTPS'de TLS hatası verdi; HTTP ile açıldı. `iota-es.de` HTTP→HTTPS yönlendirmesiyle açıldı.
- Occult yardım dosyası (`Occult.chm`) resmi kurulum zip'inden 7-Zip ile çıkarılıp HTML olarak okundu; çalıştırılabilir dosyalar açılmadı/çözümlenmedi (yazarın decompilation hakkı saklı).
- JOA tabloları ve IOTA-ES Venüs görseli PDF/JPG'den görüntü olarak okundu (metin katmanı yok).
- in-the-sky.org bu oturumda bot doğrulaması göstermedi; 44 sayfa 3 sn aralıkla çekildi.
