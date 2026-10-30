# analemma (Güneş saati ve zaman denklemi) — kaynak tablosu

Erişim: 2026-10-30. "Hesap" yazan satırlar kaynak değil: kaynaktaki formüllerden python3 ile (ve tarayıcıda deneyin kendi fonksiyonlarıyla) yeniden hesaplandı. İkinci kaynak olarak USNO'nun İstanbul güneş verisi (güneyden geçiş saati, dakikaya yuvarlı) ve uygulamanın gök hesabı (Astronomy Engine; cizim_v3.js d22 çizimleriyle aynı) kullanıldı. NOAA hesaplayıcısı ve timeanddate kullanılmadı (timeanddate bu oturumda açılamadı).

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Zaman denklemi formülü EqT = q/15 − RA ve Güneş konumu | https://aa.usno.navy.mil/faq/sun_approx | "EqT = q/15 – RA", "tan RA = cos e sin L / cos L", "L = q + 1.915 sin g + 0.020 sin 2g", "g = 357.529 + 0.98560028 D", "q = 280.459 + 0.98564736 D", "e = 23.439 – 0.00000036 D" |
| Formülün doğruluğu | https://aa.usno.navy.mil/faq/sun_approx | "accurate to about 1 arcminute within two centuries of 2000" |
| İşaret: görünür − ortalama; artı = güneş saati önde | https://en.wikipedia.org/wiki/Equation_of_time | "the Equation of Time is the difference apparent solar time minus mean solar time"; "Positive means: Sun runs fast and culminates earlier, or the sundial is ahead of mean time." |
| Ders d22 uç değerleri +16 dk 33 sn (≈3 Kasım), −14 dk 6 sn (≈11 Şubat) | https://en.wikipedia.org/wiki/Equation_of_time | "ahead (fast) by as much as 16 min 33 s (around 3 November)", "behind (slow) by as much as 14 min 6 s (around 11 February)" |
| Aynı makalenin 2000 tablosu: −14:15 (11 Şub), +3:41 (14 May), −6:30 (26 Tem), +16:25 (3 Kas) | https://en.wikipedia.org/wiki/Equation_of_time | "At epoch 2000 these are the values (in minutes and seconds with UT dates)": "−14 min 15 s 11 February", "+3 min 41 s 14 May", "−6 min 30 s 26 July", "+16 min 25 s 3 November" |
| Değerler yıldan yıla ve yüzyıllarla değişir | https://en.wikipedia.org/wiki/Equation_of_time | "A slight yearly variation occurs due to presence of leap years, resetting itself every 4 years."; "The exact shape of the equation of time curve and the associated analemma slowly change over the centuries." |
| Sıfır geçişleri ≈ 15 Nisan, 13 Haziran, 1 Eylül, 25 Aralık | https://en.wikipedia.org/wiki/Equation_of_time | "The equation of time has zeros near 15 April, 13 June, 1 September, and 25 December." |
| Bileşen genlikleri 7,66 dk (basıklık, yıllık) ve 9,87 dk (eğiklik, yarım yıllık); sıfırları | https://en.wikipedia.org/wiki/Equation_of_time | Basıklık: genlik 7.66 dakika, periyot bir yıl, "zero points at perihelion and aphelion"; eğiklik: genlik 9.87 dakika, periyot yarım yıl, sıfırları ekinoks ve gündönümlerinde (WebFetch özeti) |
| Yaklaşık formül −7,659 sin D + 9,863 sin(2D + 3,5932) (cizim_v3.js'te kullanılır; deneyde kullanılmadı) | https://en.wikipedia.org/wiki/Equation_of_time | "EoT = -7.659sin(6.24004077 + 0.01720197(365*(y-2000) + d)) + 9.863sin(2(…) + 3.5932) [minutes]", "accurate to within 1 minute". Not: makaledeki gün sayımı 365·(y−2000) artık günleri atlar; 2026'da 7 gün kayar. cizim_v3.js doğru sayımı (J2000 + 9497 gün) kullanıyor |
| MODEL 2026 uç değerleri (hesap) | — | Saat 13:03:41 (10:03:41 UT) için günlük: en büyük 3 Kasım +16,448 dk = +16 dk 27 sn; en küçük 11 Şubat −14,199 dk = −14 dk 12 sn; ikinciller 14 Mayıs +3 dk 38 sn, 26 Temmuz −6 dk 34 sn |
| Astronomy Engine 2026 (karşılaştırma) | https://github.com/cosinekitty/astronomy | Uygulamanın gök hesabı, 10.04 UT: en büyük 3 Kasım +16,444 dk (+16:27), en küçük 11 Şubat −14,181 dk (−14:11); cizim_v3.js d22-zaman-denklemi: "3 Kas +16:27", "11 Şub −14:11", "13 May +3:41", "26 Tem −6:34". Model ile yıl boyu en büyük fark 2,2 sn, yükseklikte 0,006°, azimutta 0,025° |
| Model ile Wikipedia farkı (açıklama) | — | +16:27 / −14:12 (2026) ↔ +16:33 / −14:06 (giriş) ↔ +16:25 / −14:15 (2000 tablosu): kaynaklar arası fark birkaç saniye; ekranda açıkça yazılı |
| Bileşen genlikleri modelde 7,66 ve 9,86 dk (hesap) | — | python3: max |4(q − L)| = 7,662 dk, max |4(L − RA)| = 9,863 dk |
| UTC+3 = 45° doğu boylamının saati (hesap) | — | 3 sa × 15°/sa = 45° |
| Türkiye 8 Eylül 2016'dan beri yıl boyu UTC+3 | https://en.wikipedia.org/wiki/Time_in_Turkey | "In Turkey, time is given by UTC+03:00 year-round."; "TRT was adopted by the Turkish Government on 8 September 2016." (ders d22: Bakanlar Kurulu Kararı 2016/9154; alomaliye.com sayfası bu oturumda açılamadı) |
| Konum 41,00° K, 29,08° D (Fetih Mahallesi, Ataşehir) | /home/claude/urania/uygulama.js (yerel) | `VARSAYILAN_KONUM = { ad: 'Fetih Mahallesi, Ataşehir', enlem: 41.0046, boylam: 29.0762 …}` |
| Ortalama öğle 13:03:41; fark 63,68 dk = 63 dk 41 sn (hesap) | — | (45 − 29,08) × 4 dk = 15,92 × 4 = 63,68 dk; ders d22 (28,955° D için): "yaklaşık 13:04" |
| Gök küresi saatte 15°, dakikada 0,25° | — | Ders d22: "Güneş saatte 15° yol aldığına göre bir dakikalık fark 0,25° eder" |
| USNO İstanbul güneyden geçiş 2026 (41,00° K, 29,08° D, UTC+3) — İKİNCİ KAYNAKLA DOĞRULAMA | https://aa.usno.navy.mil/api/rstt/oneday?date=2026-11-03&coords=41.00,29.08&tz=3 (tarih değiştirilerek) | `"phen": "Upper Transit"`: 3 Oca 13:08 · 11 Şub 13:18 · 20 Mar 13:11 · 15 Nis 13:04 · 14 May 13:00 · 13 Haz 13:04 · 21 Haz 13:05 · 26 Tem 13:10 · 1 Eyl 13:04 · 23 Eyl 12:56 · 3 Kas 12:47 · 21 Ara 13:02 · 25 Ara 13:04 |
| Model gerçek öğle aynı günler (hesap) | — | 13:08:08 · 13:17:53 · 13:11:10 · 13:03:45 · 13:00:03 · 13:03:46 · 13:05:29 · 13:10:14 · 13:03:42 · 12:56:04 · 12:47:14 · 13:01:42 · 13:03:41 — 13 günün hepsi USNO'nun dakikasına yuvarlanıyor (en büyük fark 29 sn, yuvarlama sınırı 30 sn) |
| 3 Kasım: +16 dk 27 sn = basıklık +6 dk 45 sn + eğiklik +9 dk 42 sn; öğle 12:47:14; 33,9° (hesap) | — | python3 ve tarayıcı aynı; yükseklik 90 − |41 − δ|, δ = −15,1° |
| 11 Şubat: −14 dk 12 sn (−4:48 / −9:24); 13:17:53; 35,1° (hesap) | — | python3 ve tarayıcı aynı |
| 21 Haziran: −1 dk 49 sn (−1:47 / −1 sn); 13:05:29; 72,4° (hesap) | — | python3 ve tarayıcı aynı |
| 3 Kasım, yörünge dairesel: +9 dk 47 sn; 12:53:54; 33,4° (hesap) | — | L = q; tarayıcı |
| 3 Kasım, eksen dik: +6 dk 45 sn; 12:56:56; 49,0° (hesap) | — | e = 0 ⇒ RA = L, δ = 0; 90 − 41 = 49 |
| 25 Aralık: −1 sn (+1:17 / −1:18); 13:03:41; 25,6° (hesap) | — | tarayıcı |
| Analemma: 13:03:41'de yükseklik 25,56°–72,43°, azimut 175,8°–185,0° (hesap) | — | python3; ders d22: "Aralık gündönümünde … yaklaşık 25,6° … Haziran gündönümünde yaklaşık 72,4°", "Sekizin boyu … yaklaşık 47°" |
| Yatay ölçek ≈ 9–10 kat büyütülmüş (hesap) | — | Tarayıcıda ölçüldü: 551 px ekranda kanvas 517 px, azimut 29,2 px/°, yükseklik 3,27 px/° (8,9 kat); 320 px ekranda kanvas 286 px, 14,8 ve 1,43 px/° (10,3 kat) |
| 72°'de 1° azimut gökte ≈ üçte bir derece (hesap) | — | cos 72,4° = 0,30 |
| En erken öğle 3 Kasım 12.47, en geç 11 Şubat 13.18 (gerçek dünyada) | https://aa.usno.navy.mil/api/rstt/oneday?date=2026-11-03&coords=41.00,29.08&tz=3 | `"phen": "Upper Transit", "time": "12:47"`; 11 Şubat sorgusunda `"time": "13:18"` |
| Gerçek öğlede gölge en kısa ve tam kuzeyi gösterir | — | Ders d22: "Gerçek öğlede Güneş tam güneydedir, bu yüzden gölge tam kuzeyi gösterir ve en kısa hâlini alır." |
| Güneş'e filtresiz bakma uyarısı | https://science.nasa.gov/eclipses/safety/ | Göz güvenliği sayfası (gecis deneyinde de kullanılıyor) |
| Gün numaraları: 42 = 11 Şubat, 134 = 14 Mayıs, 207 = 26 Temmuz, 307 = 3 Kasım, 172 = 21 Haziran, 359 = 25 Aralık (hesap) | — | `Date.UTC(2026, ay−1, gün)` farkı |
