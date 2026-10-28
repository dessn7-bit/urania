# d22 — Zaman, takvim ve gökyüzü: kaynak listesi

Tarih: 2026-10-28. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
[B] = bu oturumda WebFetch ile okundu (alıntılar WebFetch özet modelinin aktardığı metindir; doğrulama ajanı bir kez daha bakmalı); [Ö] = projede önceden doğrulanmış (d1, d10 kaynak dosyaları); [H] = bu derste yapılan hesap ya da akıl yürütme (kaynaklı değerlerden).
Kısaltmalar: EOT = https://en.wikipedia.org/wiki/Equation_of_time ; AV8N = https://www.av8n.com/physics/analemma.htm ; TAD = https://timeanddate.com/sun/@745042 ; R4 = https://www.bipm.org/en/cgpm-2022/resolution-4 ; R5 = https://www.bipm.org/en/cgpm-2026/resolution-5 ; LS = https://en.wikipedia.org/wiki/Leap_second ; K697 = https://www.alomaliye.com/2000/01/02/gunun-yirmi-dort-saate-taksimine-697-sayili-kanun/ ; K698 = https://www5.tbmm.gov.tr/tutanaklar/KANUNLAR_KARARLAR/kanuntbmmc004/kanuntbmmc004/kanuntbmmc00400698.pdf ; BKK = https://www.alomaliye.com/2016/09/08/bkk-20169154-gun-isigindan-daha-fazla-yararlanmak/amp/ ; DSTTR = https://en.wikipedia.org/wiki/Daylight_saving_time_in_Turkey ; GREG = https://en.wikipedia.org/wiki/Gregorian_year (en.wikipedia "Gregorian calendar" sayfasına yönlenir) ; TON = https://www.tondering.dk/claus/cal/gregorian.php ; BRIT = https://www.britannica.com/science/calendar/The-Gregorian-calendar ; RUMI = https://en.wikipedia.org/wiki/Rumi_calendar ; BULUT = https://dergipark.org.tr/en/download/article-file/410422 ; TDVT = https://islamansiklopedisi.org.tr/takvim ; TDVH = https://islamansiklopedisi.org.tr/hilal ; TDVTR = https://islamansiklopedisi.org.tr/tarih ; NAMES = https://en.wikipedia.org/wiki/Names_of_the_days_of_the_week ; PH = https://en.wikipedia.org/wiki/Planetary_hours ; PREC = https://en.wikipedia.org/wiki/Axial_precession ; EARTH = https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html

## Bölüm 0 — İki ayrı öğle: güneş saati ve kol saati

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Kavuşum ayı ≈ 29,53 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html | d10_kaynak.md: kavuşum dönemi 29,53 gün |
| [B] Tropik yıl 365,242 gün | EARTH | "Tropical orbit period: 365.242 days" |
| [H] 365,242 ÷ 29,53 ≈ 12,37 ay | — | hesap |
| [Ö] Yıldız günü ≈ 23 sa 56 dk 4 sn; Güneş günü 24 sa | EARTH | "Sidereal rotation period 23.9345 hours" ; "Length of day 24.0000 hours" |
| [B] Zaman denklemi = görünür güneş zamanı − ortalama güneş zamanı (güneş saati görünür zamanı gösterir) | EOT | USNO: "the Equation of Time is the difference apparent solar time minus mean solar time" ; AV8N: "the sundial is ahead of local mean time" |
| [B] Yalnız eğiklik etkisinde gündönümü yakınında günler 24 sa + 20,3 sn, ekinoks yakınında 24 sa − 20,3 sn | EOT | WebFetch aktarımı: "solar days near the solstices would run up to 24 hours and 20.3 seconds, and near the equinoxes up to 20.3 seconds short" |
| [B] DÜZELTİLDİ (doğrulama turu): basıklık etkisi TEK BAŞINA en uzun günleri Ocak başına, en kısaları Temmuz başına koyar; toplam öğleden öğleye süre ise 22 Aralık'ta 24 sa + 29,9 sn, 16 Eylül'de 24 sa − 21,3 sn | https://en.wikipedia.org/wiki/Solar_time | tablo: "September 16 \|\| 24 hours − 21.3 seconds" ; "December 22 \|\| 24 hours + 29.9 seconds" ; "can be 21 seconds less or 29 seconds more than 24 hours". AV8N'nin "longest Etmal ... at perihelion" cümlesi toplam için yanlış (gok.js ile de kontrol: 2026'da en uzun 23 Ara +29,8 sn, en kısa 17 Eyl −21,4 sn; 6 Tem +10,2 sn, yani Temmuz başında gün 24 saatten UZUN) |
| [H] Örnek: 30 gün × 20 sn = 10 dk (varsayımsal) | — | hesap |

## Bölüm 1 — Zaman denklemi

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] En büyük +16 dk 33 sn (~3 Kasım), en küçük −14 dk 6 sn (~11 Şubat) | EOT | "up to 16 min 33 s, around 3 November" ; "up to 14 min 6 s, around 11 February" (çapraz: AV8N "about 16½ minutes" Kasım başı, "just over 14 minutes" Şubat ortası) |
| [B] İkincil uçlar +3 dk 41 sn (14 Mayıs), −6 dk 30 sn (26 Temmuz) | EOT | epoch-2000 tablosu: "+3 min 41 s on 14 May, and −6 min 30 s on 26 July" |
| [B] Sıfır: ~15 Nisan, 13 Haziran, 1 Eylül, 25 Aralık; ± 1 gün oynar | EOT | "zero near 15 April, 13 June, 1 September, and 25 December" ; "can shift by about a day" (çapraz: https://www.universetoday.com/articles/having-fun-with-the-equation-of-time aynı 4 tarih) |
| [B] Basıklık bileşeni genliği 7,66 dk, periyot 1 yıl; günberi ve günötede sıfır | EOT | "amplitude 7.66 minutes, period one year. Zero points fall at perihelion ... and aphelion" |
| [B] Eğiklik bileşeni genliği 9,87 dk, periyot yarım yıl | EOT | "amplitude 9.87 minutes, period half a year" |
| [B] Eğiklik etkisi toplamın yarısından fazlası | AV8N | obliquity "More than half" ; Universe Today: "obliquity is the major factor" |
| [Ö] Eğiklik 23,44° | EARTH | "Obliquity to orbit 23.44°" |
| [Ö] Kepler'in ikinci yasası: günberide daha hızlı | d3 dersi | d3_kaynak.md |
| [B] Ptolemaios tablolarında zaman denklemi (2. yy) | EOT | "he tabulated the equation of time in his Handy Tables" |
| [B] Huygens 1665 ilk esasen doğru tablolar | EOT | Huygens (1665) "published the first essentially correct tables" |
| [B] Flamsteed 1672–73 ortalama zamanın bugünkü anlamı | EOT | "essentially correct tables that gave today's meaning of Mean Time" |
| [H] Örnek: 3 Kas → 11 Şub = 100 gün, 1839 sn ÷ 100 ≈ 18,4 sn | — | hesap |

## Bölüm 2 — Analemma

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Sekiz biçimi analemma; kuzey-güney mevsim, doğu-batı zaman denklemi | AV8N | "This figure-8 shape is called an analemma." ; north-south seasons, east-west equation of time |
| [B] Analemma zaman denkleminin doğu-batı bileşenidir | EOT | "the east or west component of the analemma" |
| [B] Çizimde yatay eksen ~10 kat büyütülmüş | AV8N | horizontal scale magnified about 10× |
| [Ö] İstanbul öğle Güneşi 25,6° ve 72,4° | d1 dersi | d1_kaynak.md örnek hesabı (φ = 41,01°, ε = 23,44°) |
| [H] 1 dk = 0,25°; 16,55 dk ≈ 4,1°, 14,1 dk ≈ 3,5°, toplam ≈ 7,6°; boy ≈ 47° | — | hesap |
| [H]/[HESAP] En erken gün batımı gündönümünden önce, en geç doğuş sonra; öğle günde ≈ yarım dakika gecikir; İstanbul'da en erken batış ≈ 8 Aralık, en geç doğuş ≈ 4 Ocak (≈ iki hafta) | gok.js / AE SearchRiseSet (41,0136° K, 28,955° D) | doğrulama turu hesabı: "en erken batış 2026-12-08 17:35:39, en geç doğuş 2027-01-04 08:29:16" (TRT). AV8N "a few days before/after" diyor; İstanbul enleminde fark ≈ 13–14 gün olduğundan derste "birkaç gün" yerine hesap sonucu yazıldı. Öğle gecikmesi: Wikipedia Solar time, 22 Ara +29,9 sn |
| [B] Türkiye 2016'dan beri saat değiştirmiyor | BKK | Madde 1, yaz saati "yıl boyu sürdürülmesi" |

## Bölüm 3 — Yerel saat

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] İstanbul 28°57′18″ D | https://en.wikipedia.org/wiki/Istanbul | d1_kaynak.md: "41°00′49″N 28°57′18″E" |
| [H] 15°/sa, 4 dk/°; 28,955° ÷ 15 = 1 sa 55 dk 49 sn; ortalama öğle 13:04:11 | — | hesap |
| [B] İstanbul Haziran 2025 Güneş geçişi: 1 Haz 13:01, 13 Haz 13:04, 30 Haz 13:07 | TAD | tablo: "Jun 1 ... 1:01 pm", "Jun 13 ... 1:04 pm", "Jun 30 ... 1:07 pm" |
| [H] 3 Kasım gerçek öğle ≈ 12:48, 11 Şubat ≈ 13:18 | — | 13:04,2 ∓ ZD hesabı |
| [B] Türkiye 26°–45° D arası, 1 sa 16 dk fark | DSTTR | "spans the 26th to 45th meridians east, a 1 hour 16 minute difference" |
| [H] En batıda ortalama öğle ≈ 13:16, en doğuda ≈ 12:00 | — | hesap |
| [H] Eşit gölge yöntemi (öğleden önce ve sonra eşit gölge zamanlarının ortalaması) | — | geometrik akıl yürütme; Güneş yolunun meridyene göre simetrisi, dik açıklık değişimi yok sayılır |

## Bölüm 4 — Saat dilimleri ve Türkiye'nin saati

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] UTC+2 → 30° D, UTC+3 → 45° D meridyeni | DSTTR | "Before 2016, Turkey used the 30th meridian east, which is UTC+2" ; "During summer time, it used the 45th meridian east, which is UTC+3" |
| [B] 697 sayılı kanun: kabul 26.12.1925, RG 2.1.1926 sayı 260 | K697 | Kabul Tarihi 26 December 1925; Resmî Gazete 2 January 1926, No. 260 (çapraz: BULUT dipnotu RG 2 Ocak 1926) |
| [B] Gün gece yarısından başlar, saat 0–24 | K697 | Madde 1: "Türkiye Cumhuriyeti dahilinde gün, gece yarısından başlar ve saatler sıfırdan yirmi dörde kadar sayılır." |
| [B] 30. derece boylam esas; bir saati aşmayan ileri saat yetkisi; 1984 (3097) ve 2017 (7061) değişiklikleri | K697 | Madde 2: "Griniç'e göre otuzuncu derecede bulunan boylam dairesi bütün Türkiye Cumhuriyeti saatleri için esas alınır." ; "Bakanlar Kurulu bir saati aşmamak kaydıyla ileri saat uygulaması yapmaya yetkilidir." |
| [B] İlk resmî yaz saati 1 Temmuz 1940; dönemler; 1985–2016 | DSTTR | "1 July 1940: A Council of Ministers decision took effect, officially starting DST" ; periods 1940–1952, 1962–1965, 1973–1978, 1985–2016 |
| [B] 2016 öncesi kış EET (UTC+2), yaz EEST (UTC+3) | https://www.timeanddate.com/news/time/turkey-permanent-trt.html | "Until 2016, Turkey used Eastern European Time (EET, UTC+2) ... and Eastern European Summer Time (EEST, UTC+3)" |
| [B] BKK 2016/9154, kararlaştırma 7.9.2016, RG 8.9.2016 sayı 29825 | BKK | "Resmî Gazete: 08 Eylül 2016, Sayı 29825" ; "Karar Sayısı: 2016/9154 ... 7/9/2016" (çapraz: https://www.timeanddate.com/news/time/turkey-scraps-dst-2016.html "Wednesday, September 7, 2016"; DSTTR "7 September 2016") |
| [B] 27 Mart 2016 03:00'te başlayan yaz saati yıl boyu; 30 Ekim 2016 04:00 geri alma hükmü kaldırıldı | BKK | Madde 1: "27 Mart 2016 Pazar günü saat 03,00'ten itibaren bir saat ileri alınmak suretiyle" ... "yaz saati uygulamasının, her yıl, yıl boyu sürdürülmesi kararlaştırılmıştır" ; Madde 2: "30 Ekim 2016 Pazar günü saat 04.00'ten itibaren bir saat geri alınması" ibaresi yürürlükten kaldırıldı |
| [B] Kalıcı UTC+3, Türkiye Saati (TRT) | https://www.timeanddate.com/news/time/turkey-permanent-trt.html | "permanently 3 hours ahead of UTC (UTC+3)," known as Turkey Time (TRT) |
| [B] 2008 UTC+2,5 önerisi uygulanmadı | DSTTR | "2008: The Ministry of Energy recommended abolishing DST and creating a UTC+02:30 zone, but no progress was made." |
| [Ö] İstanbul Haziran gündönümü gündüz 15 sa 7 dk 50 sn; Aralık'tan 5 sa 55 dk uzun | TAD | d1_kaynak.md satır 82 |
| [H] Aralık gündönümü gündüz ≈ 9 sa 12 dk 50 sn; doğuş ≈ 08:28, batış ≈ 17:40 (UTC+3); UTC+2'de 07:28 / 16:40 | — | hesap; ZD ≈ 0 varsayımı (25 Aralık sıfır geçişi, EOT); kaba tahmin olduğu derste söylendi |
| Not | — | 2017'deki Danıştay süreci haber kaynaklarında var ama birincil kaynakla doğrulanmadığı için derse alınmadı |

## Bölüm 5 — Atom saati

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Gelgit sürtünmesi tek başına günü yüzyılda 2,3 ms uzatırdı; ortalama 1,4–1,7 ms/yüzyıl; kabuk, manto, kütle dağılımı | LS | "Tidal friction ... alone would lengthen the day by 2.3 ms per century" ; "mean solar day has been lengthening by roughly 1.4–1.7 ms per century" ; crustal movement, mantle convection, mass redistribution |
| [B] 1967, 13. CGPM: 9.192.631.770 periyot, sezyum 133 aşırı ince geçiş; 1956/1960 tanımının yerine | https://www.bipm.org/committees/cg/cgpm/13-1967/resolution-1 | "The second is the duration of 9 192 631 770 periods of the radiation" "corresponding to the transition between the two hyperfine levels of the ground state of the caesium 133 atom" ; abrogated CIPM 1956 Res. 1 and 11th CGPM (1960) Res. 9 |
| [B] Bugünkü SI tanımı: ΔνCs = 9 192 631 770 Hz | https://www.bipm.org/en/si-base-units/second | "It is defined by taking the fixed numerical value of the caesium frequency ΔνCs" "to be 9 192 631 770 when expressed in the unit Hz" |
| [B] UT1 Dünya'nın dönüşüne dayanır; UTC TAI ile aynı hızda, tam sayıda saniye farklı, UT1'e yakın tutulur | R4 | UTC runs at the same rate as TAI and differs from it only by a whole number of seconds; offset keeps UTC in agreement with UT1, "the time scale based on Earth's rotation" |
| [B] UTC tek önerilen uluslararası başvuru zaman ölçeği, çoğu ülkede yasal saatin temeli | R5 | (Res. 2, 2018 anılarak) UTC is the only recommended international reference time scale and the basis of civil time in most countries |
| [B] TAI − UTC = 37 sn (Ocak 2017'den beri) | LS | "37 seconds, since January 2017" |
| [H] 1 ÷ 9.192.631.770 ≈ 1,088 × 10⁻¹⁰ sn ≈ 0,109 ns; 1,4–1,7 ms ≈ 13–16 milyon salınım | — | hesap |

## Bölüm 6 — Artık saniye

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] 1972'de başladı; o sırada UTC TAI'nin 10 sn gerisinde | LS | "The leap second was introduced in 1972." ; "UTC already lagged behind TAI by 10 seconds" |
| [B] Fark 0,9 sn'ye yaklaşınca eklenir (ITU-R TF.460-6) | R4 | applied when UT1-UTC is predicted to approach 0.9 seconds, under ITU-R Recommendation TF.460-6 |
| [B] IERS karar verir, ~6 ay önce | LS | IERS decided on insertions, "typically about six months in advance" |
| [B] Yazımı 23:59:60 | LS | BIPM defines textual form as "23:59:60" |
| [B] 27 artık saniye, hepsi artı; sonuncusu 31.12.2016 | LS | "27 leap seconds, all positive" ; "The final one was on 31 December 2016." (çapraz: https://www.euronews.com/next/2026/10/16/global-timekeeping-rules-change-leap-second-scrapped-from-2027 "27 leap seconds have been added since 1972, the most recent at the end of 2016") |
| [B] 30 Haziran 2012 sonrası sorunlar (Qantas, Mozilla, Linux siteleri) | LS | problems reported at "Apache Cassandra, Mozilla, Hadoop, Qantas, and various Linux sites" |
| [B] İşletmeciler farklı, standart dışı yöntemler kullanıyor | R4 | methods that "do not follow any agreed standards" |
| [B] Eksi artık saniye hiç planlanmadı/test edilmedi; Dünya dönüşü hızlandı | R4 | "the possible need for the first negative leap second" ; never planned or tested |
| [B] Çalıştay: 2035'e kadar eksi artık saniye olasılığı %30 | R5 | "a 30 % probability of a negative leap second by 2035" |
| [B] 2022, 27. CGPM Karar 4: azami fark 2035'te ya da önce artırılacak | R4 | maximum UT1-UTC to be increased "in, or before, 2035" |
| [B] 28. CGPM, Versailles, 13–15 Ekim 2026; Karar 5 başlığı | R5 ; https://lilting.ch/en/articles/leap-second-abolition-adopted-cgpm | "On the technical actions needed to ensure the continuity of UTC" ; lilting: "held in Versailles, October 13 to 15, 2026", adopted October 15 |
| [B] Sürekli UTC 20 Mayıs 2027'de yürürlükte; azami fark 3.600 sn; "birkaç yüzyıl" | R5 | "continuous UTC will become effective on 20 May 2027" ; maximum |UT1-UTC| 3 600 seconds, continuity "for several centuries" (çapraz: Euronews "from 20 May 2027", "3,600 seconds, or one hour"; https://www.bipm.org/documents/d/guest/statement-cctf-president-cgpm-2026 tarih 15 Ekim 2026 — not: CCTF açıklaması "several millennia" diyor; derste karar metnindeki "birkaç yüzyıl" kullanıldı) |
| [B] Ulaşım, enerji, telekom, uzay sürekli UTC istiyor; GNSS zamanına geçiş standardı "seriously compromise" | R5 | users need UTC "to be continuous without any future adjustment" ; switching to GNSS time could "seriously compromise" standardization |
| [B] Bir saate yaklaşınca ne yapılacağı tanımlı değil | https://lilting.ch/en/articles/leap-second-abolition-adopted-cgpm | Resolution 5 "does not describe how UTC would be adjusted as the difference approaches 3,600 seconds" |
| [B] Resmî metin Fransızca | R5 | "The French text is the official version" |
| [B] BIPM UT1−UTC'yi izlemeye, CIPM'e raporlamaya devam edecek | R5 | "Inform the CIPM regularly on the evolution of the value of UT1-UTC." |
| [H] 1 dk = 0,25°; 27 ÷ 45 = 0,6 sn/yıl; ÷ 365,25 ≈ 1,6 ms/gün | — | hesap |

## Bölüm 7 — Gök takvimlerini okumak

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] 2026 Quadrantid doruğu 3 Ocak ~21:28 UT | https://www.imo.net/resources/calendar/ | "Predictions for 2026 show a peak near 21:28 UT on January 3rd." |
| [H] 21:28 + 3 sa = 4 Ocak 00:28 TRT | — | hesap |
| [B] 2016 öncesi kış +2, yaz +3 | https://www.timeanddate.com/news/time/turkey-permanent-trt.html | EET/EEST (yukarıda) |
| [H] UT ile UTC farkı Mayıs 2027'ye kadar 0,9 sn altında; sonra birikir, 1972–2016 ortalamasıyla ≈ 0,6 sn/yıl | R4 ; R5 | 0,9 sn kuralı (R4) ; sürekli UTC 20 Mayıs 2027 (R5) ; 27 ÷ 45 = 0,6 sn/yıl (Bölüm 6 hesabı). Önceki "ancak saniyelerle büyüyecek" ifadesi kaynaksız öngörüydü, geçmiş ortalamaya bağlandı |
| [B] İngiltere 1752'ye kadar Jülyen; Osmanlı mali kayıtları Rumi | TON ; RUMI | aşağıdaki bölümler |

## Bölüm 8 — Tropik yıl ve yıldızıl yıl

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Tropik yıl 365,242 gün; yıldızıl yıl 365,256 gün | EARTH | "Tropical orbit period: 365.242 days" ; "Sidereal orbit period: 365.256 days" |
| [B] Tropik yıl 365,242199 gün | BRIT | "The tropical year is 365.242199 days" (WebFetch aktarımı) |
| [B] Fark 1.224,5 sn (~20 dk); presesyon 50,3″/yıl; tur 25.772 yıl | PREC | "a tropical year is shorter than a sidereal year by 1,224.5 seconds" ; "about 50.3 seconds of arc per year" ; "a period of 25,772 years" |
| [B] Yıldız günü ilkbahar noktasına göre; sabit yıldızlara göre 0,0084 sn uzun | https://en.wikipedia.org/wiki/Sidereal_time | "0.0084 seconds shorter than the stellar day" ; "approximately 86164.0905 seconds" |
| [B] Hint takvimleri yıldızıl başlangıç (ayanamsa) kullanır | PREC | Indian calendars still use a sidereal epoch (ayanamsa) |
| [H] 0,01417 gün; 365,25 ÷ 0,01417 ≈ 25.780 yıl | — | hesap |

## Bölüm 9 — Jülyen takvimi

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Jülyen takvimi MÖ 45'te başladı; 365,25 gün | GREG | "The Julian calendar, which began in 45 BC" ; "the Julian calendar's 365.25 days" |
| [B] Yılda 11 dk 14 sn fazla; iki yüzyılda ~1,5 gün; 400 yılda 3,12 gün | BRIT | "11 minutes 14 seconds per year" ; "almost one and a half days in two centuries" ; 0.0078 days per year, 3.12 days every 400 years |
| [B] Mart ekinoksu 21 Mart'tan epey önceye kaymıştı; Paskalya hesabı için önemli | GREG | "the March equinox was occurring well before its nominal 21 March date" ; "fundamental to the calculation of the date of Easter" |
| [B] Paskalya, 21 Mart ve sonrasındaki Paskalya dolunayını izleyen pazar | BRIT | "Easter should be celebrated on the Sunday immediately following the (Paschal) full moon" ; full moon on or after March 21 |
| [H] 1440 ÷ 11,23 ≈ 128 yıl; 400 × 11,23 ≈ 4492 dk ≈ 3,12 gün | — | hesap |
| Not | — | Julius Caesar'ın adı ve Sosigenes okunan kaynaklarda açıkça geçmedi; derste ad verilmedi |

## Bölüm 10 — Gregoryen reformu

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Inter gravissimas 24 Şubat 1582 | BRIT | "The papal bull Inter gravissimas ... was issued on February 24, 1582." |
| [B] 4 Ekim 1582 Perşembe → 15 Ekim 1582 Cuma; hafta döngüsü bozulmadı | GREG | "Thursday 4 October 1582 was followed by Friday 15 October 1582" ; "(the cycle of weekdays was not affected)" (çapraz: TON "4 Oct 1582 was followed by 15 Oct 1582") |
| [B] 4/100/400 kuralı; 1700, 1800, 1900 değil, 2000 artık | TON ; BRIT | "Every year divisible by 4 is a leap year." / "every year divisible by 100 is not" / "every year divisible by 400 is a leap year after all" ; BRIT: 1700, 1800, 1900 not leap, 2000 was |
| [B] 365,2425 gün = 365 g 5 sa 49 dk 12 sn | GREG | "365.2425 days, or 365 days, 5 hours, 49 minutes and 12 seconds" |
| [B] Hata: ~3.030 yılda bir gün (ortalama tropik yıl), ~7.700 (ilkbahar ekinoksu yılı); ~3.300 | GREG ; TON | "about one day per 3,030 years" ; "closer to 1 day every 7,700 years" ; TON: "approximately 3300 years" |
| [B] Geçiş tarihleri: İtalya, Polonya, İspanya/Portekiz 1582; Britanya 2→14 Eylül 1752; Rusya 31 Ocak→14 Şubat 1918; Yunanistan 15 Şubat→1 Mart 1923 | TON | tablodaki satırlar; BRIT: Britain 1752 "when the lag reached 11 days" |
| [B] 20. yüzyılda atlama 13 gün | GREG | "the jump was 13 days" |
| [H] 400 × 365 + 97 = 146.097; ÷ 7 = 20.871 hafta | — | hesap |
| [H] Ekinoks-yılı ile ortalama tropik yıl farkının nedeni yörünge basıklığı | — | akıl yürütme (GREG iki ayrı hata değeri veriyor; neden açıklaması derste genel tutuldu) |

## Bölüm 11 — Türkiye'de takvim

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Mali takvim 1677 fermanı (4 Safer 1088 = 8 Nisan 1677), yılbaşı 1 Mart | TDVT | "4 Safer 1088 (8 April 1677)" firmanı, 1 March New Year (WebFetch aktarımı) |
| [B] Rumî-mali takvim 1740'tan itibaren | BULUT | "Rumî-mali adıyla bir takvim kullanılmaya başlandı (1740)" |
| [B] Rumi takvim 13 Mart 1840'ta resmî sivil takvim; Jülyen ay-gün, Mart yılbaşı; yıl numarası Hicri sayımdan devralındı (1840 = 1256), sonra güneş yılı; fark 584 | RUMI ; TDVT | RUMI: "adopted on March 13, 1840 AD (March 1, 1256 AH)" ; "in 1256 AH the difference between the Hijri and the Gregorian calendars amounted to 584 years. With the change from lunar calendar to solar calendar, the difference ... remained a constant 584 years." ; TDVT: "Sıvış olayının sebebi malî yıl sayısının hicrî ile bir tutulmasıdır". Doğrulama turu: "yıl sayısı 622'den başlıyordu" ifadesi yanıltıcıydı (Rumi 1 = MS 585), düzeltildi |
| [B] 1917: 15 Şubat 1332'nin ertesi günü 1 Mart 1333; 13 gün | RUMI ; BULUT | RUMI: day after February 15, 1332 became March 1, 1333 ; BULUT: 16 Şubat 1332'de "13 gün eklenerek '1 Mart' denilmesi suretiyle" |
| [B] 1333 on ay (Mart–Aralık); 1918'den mali yıl 1 Ocak | RUMI | "made into a year with only ten months, running from March 1 to December 31" ; from 1918 fiscal year began 1 January |
| [B] Türkiye 1912–1917 arasında geçen ülkeler arasında (Britannica) | BRIT | Turkey listed among countries that adopted it "between 1912 and 1917" |
| [B] 698 sayılı kanun: kabul 26 Kânunuevvel 1341, Resmî Ceride 2.1.1926 sayı 260; uluslararası takvim mebdei | K698 | Madde 1: "Türkiye Cumhuriyeti dahilinde resmî Devlet takviminde tarih mebdei olarak beynelmilel takvim mebdei kabul edilmiştir." |
| [B] 31 Kânunuevvel 1341'in ertesi günü 1 Kânunusani 1926 | K698 | Madde 2: "1341 senesi kânunuevvelinin 31 nci gününü takib eden gün, 1926 senesi kânunusanisinin birinci günüdür." (çapraz: BULUT aynı madde; GREG "On 1 January 1926, the use of the Gregorian calendar was extended") |
| [B] Tøndering: Türkiye 1 Ocak 1927 | TON | "Gregorian calendar introduced 1 Jan 1927" — yasayla çelişiyor; derste yasa esas alındı ve fark söylendi |
| [B] Hicri takvim özel durumlarda; ay başını rasathane belirler | K698 | Madde 3: "Hicrii kamerî takvim ötedenberi olduğu üzere ahvali mahsusada kullanılır." ; "Hicrii kamerî ayların mebdeini rasatane resmen tesbit eder." |
| [B] Görevi Kandilli yürüttü | TDVH | 698 sayılı kanunun 3. maddesiyle görev rasathaneye verildi; "Kandilli Rasathânesi bu görevi yürütmüştür" |
| [H] 1341 + 584 = 1925; 10 + 3 = 13 gün; 2100'e kadar 13 | — | hesap |

## Bölüm 12 — Hicri takvim

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Hicret (622) başlangıç yılı, 1 Muharrem yılbaşı | TDVT | "Hz. Peygamber'in hicreti (622) başlangıç yılı ve muharrem ayının ilk günü yılbaşı olarak kabul edilen" |
| [B] Kameri yıl 354,367056 gün; kavuşum ayı 29,530588 gün; aylar 29 ya da 30 gün | TDVT | "354, 367 056 gün" ; 29.530 588 days |
| [B] Hz. Ömer, 16/637; Muharrem ilk ay, Rebiülevvel 16 (Nisan 637), Hz. Ali'nin teklifi | TDVTR | "(16/637)" ; "16 yılının Rebîülevvel ayında (Nisan 637)" |
| [B] Güneş yılından 10,875 gün kısa; ~33,5 Hicri = 32,5 güneş yılında tur | TDVT | about 10.875 days short ; one year over roughly 33.5 Hijri years (32.5 Gregorian years) |
| [B] Kameri ay başı kavuşum değil hilalin hakiki ya da hükmî rü'yeti | TDVH | "Dinî hükümlere göre kamerî ayın başlangıcı kavuşum değil hilâlin hakiki veya hükmî rü'yetidir." |
| [B] Açı ≥ 7° (modern 6°–8°); kavuşumdan 10–17 saat sonra; Ay yüksekliği ≥ 5°; ~25 dk geç batma | TDVH | "7°'den küçük olmamalıdır" ; "6°-8°" ; "kavuşum olayından sonra on-on yedi saat geçmesi gerekir" ; ufuk yüksekliği 5°'den küçük olmamalı, ay yaklaşık 25 dakika geç batmalı |
| [B] 1978 İstanbul konferansı (27–30 Kasım 1978, Diyanet girişimi): 8° ve 5°; herhangi bir yerde rü'yet yeterli | TDVH | "Kavuşumdan sonra ay ile güneşin açısal uzaklığı 8°'den az olmamalıdır." ; "Güneşin batış anında ayın ufuktan yüksekliğinin açısal değeri 5°'den az olmamalıdır." ; madde 4: belirli bir yer şart değil |
| [B] Kandilli 1975'ten itibaren 1974 protokolü | TDVH | Kandilli "1975'ten itibaren 1974'teki protokol kriterlerine göre hesap yapmaya başlamıştır" ; hilâlin gözle görülebileceği zaman esas |
| [H] Batıda Güneş geç battığı için kavuşumdan daha çok zaman geçmiş olur | — | akıl yürütme |
| [H] 12 × 29,530588 = 354,367; 365,242 ÷ 10,875 ≈ 33,6; ≈ 32,6 güneş yılı | — | hesap |

## Bölüm 13 — Ay-güneş takvimleri

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Nesî: 13. ay eklemek ve 29/30 günlük ayları keyfî belirlemek; Kuran kınar | TDVT | nesî, adding a 13th month and fixing months by arbitrary rule, condemned as "küfürde aşırılık" |
| [B] Meton 19 yıllık döngüsü: dolunay ayın aynı gününe döner | BRIT | "the Metonic 19-year cycle, bringing the full moon back to the same day of the month" |
| [B] Paskalya hesabında 19 yıllık döngü; reformda revizyon gerekti | GREG | "product of the 19-year Metonic cycle" ; "The 19-year cycle used for the lunar calendar required revision." |
| [B] Paskalya tabloları (altın sayı, epakt) | BRIT | golden numbers, epacts |
| [H] 13 × 29,5306 ≈ 383,9 (tropik yıldan ≈ 18,7 → "yaklaşık 19" gün uzun); 19 × 365,242 = 6939,6; 235 × 29,5306 = 6939,7; 235 − 228 = 7; kesin değerlerle 235 × 29,530588 − 19 × 365,242199 = 0,086 gün → 19 ÷ 0,086 ≈ 220 yıl | — | hesap (doğrulama turu: "18 gün" → "yaklaşık 19 gün"; "19 ÷ 0,1" = 190 veriyordu, "200–250" ile çelişiyordu) |

## Bölüm 14 — Haftanın günleri

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [H] 29,53 ÷ 4 ≈ 7,4 gün | — | hesap |
| [B] Yavaştan hızlıya Satürn, Jüpiter, Mars, Güneş, Venüs, Merkür, Ay; "Kalde sırası" adı modern, Babil kökeni kanıtsız; Helenistik | PH | "Chaldean order" ... "there is no evidence this order is actually taken from Babylonian astrology" ; "Developed in Hellenistic astrology" |
| [B] 24 saat sırayla; 24 ÷ 7 kalan 3; gün ilk saatin cisminin adını alır | PH | "24 ÷ 7 has a remainder of 3" ; day named from its first-hour ruler |
| [B] Pompeii yazısı 6 Şubat 60 Pazar | PH ; NAMES | "6 February 60" a Sunday ; NAMES: Pompeiian graffito |
| [B] Roma 1.–3. yüzyıl arasında 8 günlükten 7 günlüğe | NAMES | "Between the first and third centuries CE" |
| [B] Konstantin 321 resmîleştirdi, Güneş günü tatil | NAMES | "official in AD 321" ; made dies Solis a legal holiday |
| [B] Plutarkhos ~100, kayıp yazı | NAMES | c. 100 CE "Why are the days named after the planets reckoned in a different order" ; treatise lost |
| [B] Latince adlar; Roman dilleri Pazar VE Cumartesi dışında korur; Fransızca lundi... vendredi | NAMES | "the Romance languages preserved the Latin names, except for the names of Sunday, which was replaced by [dies] Dominicus (Dominica) ... and of Saturday, which was named for the Jewish Sabbath" (doğrulama turu: önceki alıntı cümlenin ortasında kesilmişti; Cumartesi eklendi) |
| [B] İngilizce Saturday Satürn, Sunday (Sunnandæg); Cermen tanrıları Tiw, Woden, Thor, Frigg | NAMES | Saturday "named after the Roman god Saturn" ; substituted "the Germanic deities ... (with the exception of Saturday)" |
| [B] Japonca nichiyōbi ... doyōbi | NAMES | table |
| [B] Türkçe adlar tabloda: Pazar ... Cumartesi; köken verilmiyor | NAMES | table lists Pazar, Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi; etimoloji yok → derste "kaynaklarımızda yok" denildi (bulamadım) |
| [B] Sunday Güneş, Monday Ay | PH | "Sunday (Sun), Monday (Moon), Tuesday (Mars), Wednesday (Mercury), Thursday (Jupiter), Friday (Venus), Saturday (Saturn)" (WebFetch aktarımı) |

## Bölüm 15 — Presesyon ve takvimin geleceği

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Mart ekinoksu 5.000 yıl önce Boğa'da Aldebaran yakınında, bugün Balıklar'da | PREC | near Aldebaran in Taurus 5,000 years ago ; "to somewhere in the constellation of Pisces" |
| [B] 50,3″/yıl; 25.772 yıl bugünkü hıza göre; hız değişir | PREC | "At present, the rate of precession corresponds to a period of 25,772 years." ; rate varies |
| [Ö] Güneş günde ~1°'den az ilerler | https://en.wikipedia.org/wiki/Ecliptic | d1_kaynak.md satır 206 |
| [H] 3548″/gün; 50,3 ÷ 3548 ≈ 0,0142 gün/yıl → ~70 yılda bir gün; 2000 yılda ~28 gün; 13.000 yılda kış takımyıldızları yaz akşamına | — | hesap ve akıl yürütme (kaba; dik açıklık değişimi derste belirtildi) |
| [H] Gün uzadıkça yıldaki gün sayısı azalır | LS | gün uzaması (yukarıda) + akıl yürütme |

## Bilerek dışarıda bırakılanlar
- İstanbul'da en erken gün batımı / en geç gün doğumu tarihleri: kaynakla doğrulanamadı (bulamadım).
- Osmanlı'da ezanî (alaturka) saat sistemi: birincil kaynak okunamadı (bulamadım); yalnız 697 sayılı yasanın getirdiği kural yazıldı.
- 1884 Uluslararası Meridyen Konferansı: kaynak okunmadı, derse alınmadı.
- Türkçe gün adlarının kökeni: okunan kaynaklarda yok.
- 2017 Danıştay kararı ve sonrası: yalnız haber kaynakları; derse alınmadı.

## Doğrulama turu (bağımsız denetçi, 2026-10-28)

- 28. CGPM Karar 5 BIPM sayfasından (https://www.bipm.org/en/cgpm-2026/resolution-5, curl ile ham metin) kelimesi kelimesine okundu: "decides that continuous UTC will become effective on 20 May 2027, the maximum value for the difference |UT1-UTC| will be 3 600 seconds (1 hour), ensuring the long term continuity for UTC for several centuries" ; "a workshop organized by the Consultative Committee for Time and Frequency (CCTF) and IERS in March 2025 ... reaching a 30 % probability by 2035" ; "industrial users and the synchronization needs of national critical infrastructures, for example transportation, energy distribution, telecommunication, and space projects require UTC to be continuous without any future adjustment" ; "change their reference time scales to, for example, a GNSS time instead of UTC, seriously compromising the concept of international standardization in metrology" ; "inform the CIPM regularly on the evolution of the value of UT1-UTC" ; "the official version of this Resolution is the French text". Bir saate yaklaşınca ne yapılacağına dair hüküm metinde yok (doğrulandı).
- Toplantı tarihi ve yeri: https://www.bipm.org/en/cgpm-2026 "met from Tuesday 13 to Thursday 15 October 2026 at the Palais des Congrès de Versailles". Kabul günü: CCTF Başkanı açıklaması (PDF) "Versailles, France | 15 October 2026 ... three resolutions related to time metrology were adopted at the CGPM earlier today".
- 2022 Karar 4 (https://www.bipm.org/en/cgpm-2022/resolution-4) ham metinden: "predicted to approach 0.9 seconds" ; "do not follow any agreed standards" ; "the first negative leap second whose insertion has never been foreseen or tested" ; "will be increased in, or before, 2035".
- Yeniden okunan diğer kaynaklar: EOT, Solar time, Leap second, Axial precession, Sidereal time, Gregorian calendar, Rumi calendar, Names of the days of the week, Planetary hours, Daylight saving time in Turkey (Wikipedia ham metin); K697, BKK, K698 (TBMM PDF), TDVT, TDVH, TDVTR, BULUT (PDF), TON, BRIT, EARTH, AV8N, BIPM 13. CGPM Karar 1 ve SI saniye sayfası, IMO takvimi, timeanddate (Haziran 2025 tablosu ve TRT haberi). Hepsi alıntılarla uyumlu; sapmalar yukarıdaki DÜZELTİLDİ satırlarında.
- Ek düzeltmeler: "Asıl adım bu ay atıldı" → "Ekim 2026'da" (zamana bağlı ifade); Bölüm 4 ara özeti: 30° meridyeni kuralı 697 sayılı yasanın 1984'te değişen bugünkü metnindedir ("bugünkü metni" eklendi).
