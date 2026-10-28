# d9 — Güneş Sistemi'nin Gezegenleri: kaynak listesi

Tarih: 2026-10-27. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
[Ö] = önceki doğrulama oturumunda (aynı gün) indirilip alıntısı birebir kontrol edilmiş: arastirma/dersler_9_11_dogrulama.md (d9 #1–64), dersler_1_4_dogrulama.md, dersler_5_8_dogrulama.md, gezegenler.json (NSSDCA ve JPL satırları), sabitler.json. [B] = bu oturumda WebFetch ile okundu (WebFetch özetinin aktardığı metin). [D1] = aynı oturumda d1 ajanının WebFetch ile doğruladığı satır (arastirma/dersler_v2/d1_kaynak.md). [H] = bu derste yapılan hesap. [T] = 2026-10-27 tamamlama turunda (atmosfer, keşif, görevler, ters dönme) WebSearch sonucundaki URL WebFetch ile okunarak eklendi; alıntılar WebFetch özetinin aktardığı metindir.

JPL tablosu hakkında: gezegenler.json'daki "jpl_fiziksel.satir" alanları https://ssd.jpl.nasa.gov/planets/phys_par.html tablosunun satırlarıdır. Sütun sırası: ekvator yarıçapı (km) | ortalama yarıçap (km) | kütle (10²⁴ kg) | yoğunluk (g/cm³) | yıldızıl dönme süresi (gün) | yıldızıl yörünge dönemi (yıl) | V(1,0) | geometrik albedo | ekvatorda çekim (m/s²) | kurtulma hızı (km/s). Sütun anlamları başlık satırı kaydedilmediği için iç tutarlılıkla doğrulandı: Dünya satırında dönme 0,99726968 gün × 24 = 23,9345 sa (NSSDCA "Sidereal rotation period (hrs) 23.9345" ile aynı, bu oturumda görüldü), çekim 9,80, kurtulma 11,19 (NSSDCA 11,186), yoğunluk 5,5134 (5,97217e24 kg / (4/3 π 6371,0084³ km³) = 5513 kg/m³ hesabıyla aynı), Satürn yoğunluğu 568,317e24 / (4/3 π 58.232³) = 687 kg/m³ hesabıyla aynı. Doğrulama ajanı başlık satırını JPL sayfasında görmeli.

## Bölüm 1 — İki aile

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] İlk dört karasal, katı yüzey | https://science.nasa.gov/solar-system/planets/ | "The first four planets from the Sun are Mercury, Venus, Earth, and Mars. These inner planets also are known as terrestrial planets because they have solid surfaces." |
| [Ö] Dev gezegenlerin sert yüzeyi yok; gaz devi/buz devi | https://science.nasa.gov/solar-system/planets/ | "The giant planets in the outer solar system don't have hard surfaces. Instead, they have swirling gases above a core. Jupiter and Saturn are gas giants. Uranus and Neptune are ice giants." |
| [Ö] Karasal: yoğun, kayalık, az/hiç uydu, halka yok; silikat kabuk/manto, demir-nikel çekirdek | https://en.wikipedia.org/wiki/Solar_System | "The four terrestrial or inner planets have dense, rocky compositions, few or no moons , and no ring systems . They are composed largely of refractory minerals such as silicates — which form their crusts and mantles — and metals such as iron and nickel which form their cores ." |
| [Ö] Devler: uydu + halka; yalnız Satürn halkası kolay; J-S erime noktası çok düşük gazlar (H, He); U-N 'buz' (erime noktası birkaç yüz K'e kadar; su, metan, amonyak) | https://en.wikipedia.org/wiki/Solar_System | "All four giant planets have multiple moons and a ring system, although only Saturn's rings are easily observed from Earth. Jupiter and Saturn are composed mainly of gases with extremely low melting points, such as hydrogen, helium, and neon ... Uranus and Neptune are ice giants , meaning they are largely composed of 'ice' in the astronomical sense (chemical compounds with melting points of up to a few hundred kelvins such as water, methane, ammonia," |
| [Ö] %99,86; devler kalanın %99'u; J+S %90'dan fazla | https://en.wikipedia.org/wiki/Solar_System | "contains 99.86% of the system's known mass ... The Sun's four largest orbiting bodies, the giant planets, account for 99% of the remaining mass, with Jupiter and Saturn together comprising more than 90%." |
| [Ö] Su yoğunluğu ~1 g/cm³ | https://en.wikipedia.org/wiki/Sun | "It has a density of up to 150 g/cm3 ... (about 150 times the density of liquid water)" (dersler_1_4_dogrulama.md #139) |
| [Ö] Yoğunluklar: Merkür 5,4289; Venüs 5,243; Dünya 5,5134; Mars 3,9340; Jüpiter 1,3262; Satürn 0,6871; Uranüs 1,270; Neptün 1,638 g/cm³ | https://ssd.jpl.nasa.gov/planets/phys_par.html | gezegenler.json satırları, ör. "Earth \| 6378.1366 [D] ±0.0001 \| 6371.0084 [D] ±0.0001 \| 5.97217 [H] ±0.00028 \| 5.5134 [*] ±0.0003 \| ..." ; "Saturn \| 60268 [D] ±4 \| 58232 [D] ±6 \| 568.317 [K] ±0.026 \| 0.6871 [*] ±0.0002 \| ..." |
| [H] Karasal 3,93–5,51; devler 0,69–1,64; en yoğun Dünya | — | JPL değerlerinin sıralanması |
| [Ö] Uydudan kütle (3. ders yöntemi) | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "a³/T² = G(M+m)/4π²" (d3; dersler_1_4_dogrulama.md #104) |
| Yoğunluk–bileşim uyumu cümlesi | — | yukarıdaki Wikipedia Solar System bileşim alıntılarının yoğunluk değerleriyle birlikte okunması; yeni olgu yok |

## Bölüm 2 — Ölçek

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] 1 AB = 149.597.870.700 m; eskiden ortalama Dünya–Güneş uzaklığı; 2012 yeniden tanım | https://en.wikipedia.org/wiki/Astronomical_unit | "defined as 149597870700 m. Historically, the astronomical unit was conceived as the average Earth-Sun distance ... before its modern redefinition in 2012." |
| [Ö] ~499 ışık saniyesi | https://en.wikipedia.org/wiki/Astronomical_unit | "One au is approximately equivalent to 499 light-seconds." |
| [H] 499 s = 8 dk 19 s | — | hesap |
| [Ö] Yarı büyük eksenler (10⁶ km): 57,909; 108,210; 149,598; 227,956; 778,479; 1432,041; 2867,043; 4514,953 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html (ve diğer gezegen sayfaları) | dersler_9_11_dogrulama.md d9 #9–16, ör. "Semimajor axis (10 6 km) \| 778.479" |
| [H] AB: 0,387 · 0,723 · 1,000 · 1,524 · 5,204 · 9,573 · 19,165 · 30,181; Mars→Jüpiter 3,4 kat | — | hesap (dersler_9_11_dogrulama.md hesap tablosu) |
| [Ö] Neptün ~30 kat uzak | https://science.nasa.gov/solar-system/planets/planet-sizes-and-locations-in-our-solar-system/ | "Neptune is about 30 times farther from the Sun than Earth." |
| [Ö] Çaplar (km) 4879; 12.104; 12.756; 6792; 142.984; 120.536; 51.118; 49.528 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Diameter (km) \| 4879 \| 12,104 \| 12,756 \| 3475 \| 6792 \| 142,984 \| 120,536 \| 51,118 \| 49,528 \| 2376" |
| [H] Çap oranları J 11,21; S 9,45; U 4,01; N 3,88; V 0,95; Ma 0,53; Me 0,38 | — | hesap |
| [Ö] Ölçek modeli 100 m / 3 cm / 3 mm / pire 0,3 mm | https://en.wikipedia.org/wiki/Solar_System | "If the Sun–Neptune distance is scaled to 100 metres ... the Sun would be about 3 cm ... the giant planets would be all smaller than about 3 mm ... and Earth's diameter ... would be smaller than a flea ( 0.3 mm" |
| [Ö][B] Güneş ortalama yarıçapı 695.700 km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html | "Volumetric mean radius (km) \| 695,700." |
| [H] 149.597.870,7 / 1.391.400 = 107,5; 4.514.953.000 / 1.391.400 = 3245; 1 m ölçekte Güneş çapı 1,3914/4514,953 m = 0,31 mm | — | hesap |
| [Ö] Işık hızı 299.792.458 m/s | https://physics.nist.gov/cgi-bin/cuu/Value?c | "speed of light in vacuum Numerical value 299 792 458 m s-1" (sabitler.json) |
| [H] Neptün: 4,514953e12 / 299.792.458 = 15.060 s = 251 dk; Jüpiter: 7,78479e11 / 299.792.458 = 2597 s = 43,3 dk | — | hesap |

## Bölüm 3 — Yörünge süreleri ve hızları

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Yıldızıl dönemler (gün): 87,969; 224,701; 365,256; 686,980; 4332,589; 10.755,699; 30.685,400; 60.189,018 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html (ve diğer gezegen sayfaları) | dersler_9_11_dogrulama.md d9 #18–25, ör. "Sidereal orbit period (days) \| 60,189.018" |
| [H] Yıl: 1,881; 11,862; 29,447; 84,012; 164,789 | — | /365,25 |
| "Neptün'de bir yılını doldurmuş kimse olmazdı" | — | yazar esprisi: 164,8 yıl; insan ömrü için sayı verilmedi. Doğrulama ajanı gereksiz bulursa cümle silinebilir |
| [Ö] Ortalama yörünge hızları 47,4 · 35,0 · 29,8 · 24,1 · 13,1 · 9,7 · 6,8 · 5,4 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Orbital Velocity (km/s) \| 47.4 \| 35.0 \| 29.8 \| 1.0* \| 24.1 \| 13.1 \| 9.7 \| 6.8 \| 5.4" |
| [H] 47,4/5,4 = 8,8 ≈ 9 kat | — | hesap |
| [H] Jüpiter: 5,204³ = 140,9; 11,862² = 140,7 | — | hesap |

## Bölüm 4 — Merkür ve Venüs

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Merkür kütle 0,33010 × 10²⁴ kg | https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html | gezegenler.json: "Mass (10^24 kg) 0.33010" |
| [H] 0,33010/5,9722 = 0,0553 → %5,5 | — | hesap |
| [Ö] Merkür yoğunluk 5,4289, dönme 58,6462 gün, çekim 3,70 | https://ssd.jpl.nasa.gov/planets/phys_par.html | "Mercury \| 2440.53 [D] ±0.04 \| 2439.4 [D] ±0.1 \| 0.330103 [F] ±0.000021 \| 5.4289 [*] ±0.0007 \| 58.6462 [C] \| 0.2408467 [B] \| -0.60 [E] ±0.10 \| 0.106 [B] \| 3.70 [*] \| 4.25 [*]" |
| [Ö] Mars çekim 3,71; yoğunluk 3,9340; dönme 1,02595676 gün | https://ssd.jpl.nasa.gov/planets/phys_par.html | "Mars \| 3396.19 [D] ±0.1 \| 3389.50 [D] ±0.2 \| 0.641691 [I] ±0.000030 \| 3.9340 [*] ±0.0007 \| 1.02595676 [C] \| 1.8808476 [B] \| -1.52 [B] \| 0.150 [B] \| 3.71 [*] \| 5.03 [*]" |
| [H] Merkür 87,969/58,6462 = 1,50000; 2 × 87,969 = 175,938; 3 × 58,6462 = 175,939 | — | hesap |
| [Ö] Venüs çap 12.104 km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Diameter (km) \| 4879 \| 12,104 \| ..." |
| [Ö] Venüs kütle 4,8673; yoğunluk 5,243; dönme −243,018 gün; çekim 8,87 | https://ssd.jpl.nasa.gov/planets/phys_par.html | "Venus \| 6051.8 [D] ±1.0 \| 6051.8 [D] ±1.0 \| 4.86731 [G] ±0.00023 \| 5.243 [*] ±0.003 \| -243.018 [C] \| 0.61519726 [B] \| -4.47 [E] ±0.07 \| 0.65 [B] \| 8.87 [*] \| 10.36 [*]" |
| [H] 4,8673/5,9722 = 0,815; 243,018/224,701 = 1,0815 (%8) | — | hesap |
| [D1] Venüs en çok −4,92 (hilal); Jüpiter en çok −2,94 | https://en.wikipedia.org/wiki/Apparent_magnitude | "Venus: maximum −4.92, when illuminated as a crescent" ; "Jupiter: maximum −2.94" (WebFetch, d1_kaynak.md) |
| [D1] Sirius −1,46 | https://en.wikipedia.org/wiki/Apparent_magnitude | "Sirius at magnitude −1.46" |
| [H] "Venüs en parlak gezegen": −4,92 değeri tablodaki öteki gezegenlerin en parlak değerinden (Jüpiter −2,94) daha parlak | — | karşılaştırma; Mars'ın en parlak değeri bu oturumda görülmedi, doğrulama ajanı aynı tabloda Mars'ı kontrol etmeli |
| [B] Venüs evreleri zor dürbün hedefi | https://en.wikipedia.org/wiki/Binoculars | "Other difficult binocular targets include the phases of Venus and the rings of Saturn." |
| [T] Venüs ters yönde (doğudan batıya) döner; Güneş batıdan doğar, doğudan batar | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "Venus rotates retrograde (east to west) compared with Earth's prograde (west to east) rotation." ; "Seen from Venus, the Sun would rise in the west and set in the east." |
| [T] Ters dönen iki gezegen (Uranüs biri) | https://science.nasa.gov/Uranus/facts | "Uranus is also one of just two planets that rotate in the opposite direction than most of the planets." |
| [T] JPL tablosu işareti açıklamıyor; eksi işaretli gezegenler yalnız Venüs ve Uranüs | https://ssd.jpl.nasa.gov/planets/phys_par.html | sütun tanımı: "Time required for a full rotation of the planet relate to fixed stars." İşaret için açıklama yok (WebFetch: "The page does not explain them"); eksi değerler: Venus -243.018, Uranus -0.71833 (cüce gezegen Pluto -6.3872). "Eksi = ters yön" çıkarımı: eksi işaretli iki gezegen = NASA'nın ters dönen dediği iki gezegen. NSSDCA da Venüs (−5832,6 sa) ve Uranüs (−17,24 sa) için eksi verir. |
| [T] Venüs atmosferi %96,5 CO₂, %3,5 N₂; 92 bar; 737 K (464 °C) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html | "Surface pressure: 92 bars" ; "Average temperature: 737 K (464 C)" ; "Major: 96.5% Carbon Dioxide (CO2), 3.5% Nitrogen (N2)" |
| [T] İkinci kaynak: %96,5/%3,5; ~92 kat basınç; 740 K; sülfürik asit bulutları; güçlü sera etkisi; Merkür'den sıcak | https://en.wikipedia.org/wiki/Atmosphere_of_Venus | "composed of 96.5% carbon dioxide and 3.5% nitrogen" ; "about 92 times that of the Earth" ; "the temperature at the surface is 740 K" ; "composed mainly (75–96%) of sulfuric acid droplets" ; "create a strong greenhouse effect" ; "hotter than any other terrestrial planet in the Solar System, even that of Mercury" |
| [T] NASA: basınç 90 kat, >470 °C, CO₂ + sülfürik asit bulutları, kalın atmosfer ısıyı hapseder | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "surface pressure 90 times that of Earth" ; "surface temperatures higher than 470 degrees Celsius" ; "Venus' atmosphere consists mainly of carbon dioxide, with clouds of sulfuric acid droplets." ; "The thick atmosphere traps the Sun's heat" |
| Sera etkisi tanımı ("atmosferin ısıyı tutarak yüzeyi ısıtması") | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "The thick atmosphere traps the Sun's heat" ifadesinin genelleştirilmesi; yazar tanımı |
| [T] MESSENGER: Mariner 10'dan (1975) sonra ikinci görev | https://en.wikipedia.org/wiki/MESSENGER | "became the second mission, after Mariner 10 in 1975, to reach Mercury." (tek kaynak) |
| [T] MESSENGER 18 Mart 2011 ilk Merkür yörüngesi; 30 Nisan 2015 çarpma; 1 yıl planlı, 4 yıldan fazla | https://science.nasa.gov/resource/from-the-first-to-the-last/ | "On March 18, 2011, MESSENGER made history by becoming the first spacecraft ever to orbit Mercury." ; "On April 30, 2015, MESSENGER again made history, becoming the first spacecraft to impact the planet." ; (WebFetch özeti: görev bir yıl planlanmış, dört yıldan fazla yörüngede çalışmış) |
| [T] İkinci kaynak: 18 Mart 2011, 30 Nisan 2015 | https://en.wikipedia.org/wiki/MESSENGER | "MESSENGER entered orbit around Mercury on March 18, 2011, becoming the first spacecraft to do so." ; "The spacecraft crashed onto the surface of Mercury on April 30, 2015" |
| [T] BepiColombo Avrupa-Japonya, 19 Ekim 2018 fırlatma | https://en.wikipedia.org/wiki/MESSENGER | "BepiColombo, a European-Japanese mission to Mercury which was launched on October 19, 2018" (tek kaynak; görevin bugünkü durumu yazılmadı) |
| [T] Mariner 2 1962; Venera 7 1970, 23 dakika; Magellan 1990–1994, %98 radar haritası | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "1962 — NASA's Mariner 2 reaches Venus and reveals the planet's extreme surface temperatures." ; "1970 — The Soviet Union's Venera 7 sends back 23 minutes of data from the surface of Venus." ; "1990–1994 — NASA's Magellan spacecraft, in orbit around Venus, uses radar to map 98 percent of the planet's surface." |
| [T] Magellan 10 Ağustos 1990 varış; %98; bağlantı 12 Ekim 1994'te kesildi | https://nssdc.gsfc.nasa.gov/planetary/magellan.html | "arrived at Venus on August 10, 1990" ; "98% of the surface was imaged at resolutions better than 100 m" ; "Radio contact with Magellan was lost on October 12, 1994." |
| [Ö] Güneş batmadan dürbün çevirme (11. ders) | https://science.nasa.gov/eclipses/safety/ | "Viewing any part of the bright Sun through ... binoculars ... without a special-purpose solar filter ... will instantly cause severe eye injury." |

## Bölüm 5 — Dünya ve Mars

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] 288 K (15 °C); 1014 mb; %78,08 N₂, %20,95 O₂; 23,44°; 23,9345 sa; 1 uydu | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Average temperature: 288 K (15 C)" ; "Surface pressure: 1014 mb" ; "78.08% Nitrogen (N2), 20.95% Oxygen (O2)" ; "Obliquity to orbit (deg) 23.44" ; "Sidereal rotation period (hrs) 23.9345" ; "Number of natural satellites 1" |
| [D1] Mevsimlerin nedeni eğiklik | https://spaceplace.nasa.gov/seasons/en | "Earth's tilted axis causes the seasons." (d1_kaynak.md) |
| [Ö] Dünya yoğunluk 5,5134, çekim 9,80 | https://ssd.jpl.nasa.gov/planets/phys_par.html | Earth satırı (yukarıda) |
| [Ö] Mars çap 6792 km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Diameter (km) \| ... \| 6792 \| ..." |
| [Ö] Mars kütle 0,64169 × 10²⁴ kg | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | gezegenler.json: kutle_kg 6.4169e+23 |
| [H] 0,64169/5,9722 = 0,1074 → %10,7; 1,02595676 × 24 = 24,623 sa = 24 sa 37 dk | — | hesap |
| [Ö] Mars 1,88 yıl | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | "Sidereal orbit period (days) \| 686.980" (/365,25 = 1,881) |
| [Ö] Phobos ve Deimos | https://science.nasa.gov/mars/moons/ | "Mars has two moons, Phobos and Deimos ." |
| [Ö] Mars kurtulma 5,03 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | gezegenler.json: kacis_hizi_km_s 5.03 (JPL de 5.03) |
| [Ö][B] Dünya kurtulma 11,186 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Escape velocity (km/s) 11.186" |
| [H] 70 × 3,71/9,80 = 26,5; 70 × 3,70/9,80 = 26,4; 11,19/5,03 = 2,22 | — | hesap |
| [T] Mars atmosferi hacimce %95,1 CO₂, %2,59 N₂, %1,94 Ar; 6,36 mb (4,0–8,7); ~214 K (−59 °C); Viking 1 sahası −89 ile −31 °C | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | "6.36 mb at mean radius (variable from 4.0 to 8.7 mb depending on season)" ; "~214 K (-59 C)" ; "184 K to 242 K (-89 to -31 C) (Viking 1 Lander site)" ; "Carbon Dioxide (CO2) - 95.1%" ; "Nitrogen (N2) - 2.59%" ; "Argon (Ar) - 1.94%" (WebFetch ?embed=true sürümünden) |
| [T] ESA: %95,32 CO₂; 6,35 mbar; ortalama −55 °C | https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Facts_about_Mars | "95.32% carbon dioxide, 2.7% nitrogen, 1.6% argon, 0.13% oxygen" ; "6.35 mbar (less than one hundredth of Earth's atmospheric pressure)" ; "–55ºC" |
| [H] 6,36/1014 = 0,0063 (yüzde birden az); 92.000/6,36 = 14.465 ≈ 14.500 | — | hesap |
| Tartı = kütle × çekim ivmesi açıklaması | — | temel fizik tanımı (ağırlık = m × g); kaynak alıntısı yok, doğrulama ajanı gerekirse bir fizik kaynağıyla eşleştirmeli |

## Bölüm 6 — Jüpiter ve Satürn

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Kütleler (10²⁴ kg): Jüpiter 1898,13; Satürn 568,32; Uranüs 86,811; Neptün 102,409; Dünya 5,9722; Venüs 4,8673; Mars 0,64169; Merkür 0,33010 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | gezegenler.json kutle_kg (her gezegenin kendi NSSDCA sayfası); özet tablo: "1898", "568", "86.8", "102" |
| [H] 1898,13/5,9722 = 317,8; öteki yedinin toplamı 769,35; 1898,13/769,35 = 2,47; 568,32/5,9722 = 95,2 | — | hesap |
| [Ö] Jüpiter yoğunluk 1,3262, dönme 0,41354 gün | https://ssd.jpl.nasa.gov/planets/phys_par.html | "Jupiter \| 71492 [D] ±4 \| 69911 [D] ±6 \| 1898.125 [J] ±0.088 \| 1.3262 [*] ±0.0003 \| 0.41354 [C] \| 11.862615 [B] \| -9.40 [B] \| 0.52 [B] \| 24.79 [*] \| 60.20 [*]" |
| [H] 0,41354 × 24 = 9,925 sa = 9 sa 56 dk; en kısa dönme süresi (JPL satırları arasında en küçük) | — | hesap/karşılaştırma |
| [Ö] Jüpiter 115 uydu, IAU tanımlı | https://science.nasa.gov/jupiter/jupiter-moons/ | "Jupiter has 115 moons that have been officially recognized by the International Astronomical Union." |
| [B] Galileo uyduları orta boy dürbünle | https://en.wikipedia.org/wiki/Binoculars | "reasonably detectable with medium-size binoculars" ... "the Galilean moons of Jupiter" |
| [Ö] Galileolar ve Titan dışında uydular sönük (ikinci kaynak) | https://en.wikipedia.org/wiki/Binoculars | "too faint to be seen with most binoculars are the planetary moons, except the Galileans and Titan" |
| [Ö] Satürn yoğunluk 0,6871, dönme 0,44401 gün | https://ssd.jpl.nasa.gov/planets/phys_par.html | "Saturn \| 60268 [D] ±4 \| 58232 [D] ±6 \| 568.317 [K] ±0.026 \| 0.6871 [*] ±0.0002 \| 0.44401 [C] \| 29.447498 [B] \| -8.88 [B] \| 0.47 [B] \| 10.44 [*] \| 36.09 [*]" |
| [H] Sudan az yoğun tek gezegen: JPL listesinde 1'in altındaki tek değer 0,6871; 0,44401 × 24 = 10,656 sa = 10 sa 39 dk | — | karşılaştırma/hesap |
| [Ö] Satürn 293 uydu (Ağustos 2026), en çok | https://science.nasa.gov/saturn/moons/ | "Saturn has 293 confirmed moons in its orbit as of August 2026, far more than any other planet in our solar system." |
| [B] Satürn halkası 20× ve üstü; Titan orta boy dürbünle | https://en.wikipedia.org/wiki/Binoculars | "Only binoculars with very high magnification, 20x or higher, are capable of discerning Saturn's rings" ; "Saturn's largest moon Titan" |
| [T] Galileo uyduları yoğun ışık kirliliğinde bile sıradan dürbünle | https://en.wikipedia.org/wiki/Galilean_moons | "readily seen with common binoculars, even under night sky conditions of high light pollution" |
| [T] Büyük Kırmızı Leke: dev oval yapı; en az 250 yıl; "iki katından geniş" | https://www.missionjuno.swri.edu/key-terms/great-red-spot | "A giant, oval-shaped feature in Jupiter's atmosphere that is more than twice as wide as Earth." ; "It has been present for at least 250 years and could be much older." |
| [T] BKL 16.350 km (3 Nisan 2017), Dünya'nın 1,3 katı | https://science.nasa.gov/photojournal/jupiters-great-red-spot-swallows-earth | "Jupiter's Great Red Spot is 1.3 times as wide as Earth." ; "Measuring in at 10,159 miles (16,350 kilometers) in width (as of April 3, 2017)." |
| [T] Dört büyük uydu Io, Europa, Ganymede, Callisto; 1610, Galileo ve Marius bağımsız | https://www.nasa.gov/wp-content/uploads/2009/12/moons_of_jupiter_lithograph.pdf | "1610 — Galileo Galilei and Simon Marius independently discover four moons orbiting Jupiter." ; "Io, Europa, Ganymede, and Callisto." |
| [T] İkinci kaynak: adlar; Galileo 1610 | https://science.nasa.gov/jupiter | "Io, Europa, Ganymede, and Callisto" ; "The first detailed observations of Jupiter were made by Galileo Galilei in 1610" ; Wikipedia: "either December 1609 or January 1610" (https://en.wikipedia.org/wiki/Galilean_moons) |
| [T] Ganymede en büyük uydu, Merkür'den büyük (kütlece değil) | https://www.nasa.gov/wp-content/uploads/2009/12/moons_of_jupiter_lithograph.pdf | "Ganymede is the largest moon in the solar system (larger than the planet Mercury)" ; Wikipedia Galilean moons: "surpasses the planet Mercury in size (though not mass)" |
| [T] Io volkanik bakımdan en etkin; Europa buz altı okyanus düşünülüyor | https://www.nasa.gov/wp-content/uploads/2009/12/moons_of_jupiter_lithograph.pdf | "Io is the most volcanically active body in the solar system." ; "the icy crust is believed to cover a global water ocean." |
| [T] Galileo aracı: ilk Jüpiter yörüngesi; 7 Aralık 1995; 21 Eylül 2003 | https://en.wikipedia.org/wiki/Galileo_(spacecraft) | "the first to orbit it" ; "Galileo arrived at Jupiter on December 7, 1995" ; "intentionally destroyed in Jupiter's atmosphere on September 21, 2003" (tek kaynak) |
| [T] Juno 4 Temmuz 2016 (PDT); amaç köken ve evrim | https://www.jpl.nasa.gov/news/nasas-juno-spacecraft-in-orbit-around-mighty-jupiter/ | "received on Earth at 8:53 pm. PDT (11:53 p.m. EDT) Monday, July 4." ; "Juno's principal goal is to understand the origin and evolution of Jupiter." |
| [T] Juno UTC'ye göre 5 Temmuz | https://en.wikipedia.org/wiki/Galileo_(spacecraft) | "Juno, which arrived on July 5, 2016." ; [H] 20:53 PDT (UTC−7) = 03:53 UTC, 5 Temmuz |
| [T] Europa Clipper 14 Ekim 2024 | https://science.nasa.gov/jupiter | "Europa Clipper launched on Oct. 14, 2024, to study Jupiter's icy moon, Europa." |
| [T] Titan: Huygens 1655 keşif; 1500 mbar (1,5 kat); 94 K (−180 °C) | https://esa.int/Our_Activities/Space_Science/Cassini-Huygens/Facts_about_Titan | "It was discovered by Christiaan Huygens in 1655." ; "1500 mbar (1.5 times Earth's)" ; "94K (-180 degrees C)" |
| [T] Titan: kalın atmosferli tek uydu; ~%95 N₂, ~%5 CH₄; basınç ~%60 fazla; hidrokarbon göl/deniz; Huygens sondası ESA'nın | https://science.nasa.gov/saturn/moons/titan/facts/ | "Titan is unique in being the only moon with a thick atmosphere." ; "mostly nitrogen (about 95 percent) and methane (about 5 percent)" ; "about 60 percent greater than on Earth" ; "clouds, rain, rivers, lakes and seas of liquid hydrocarbons like methane and ethane" ; "The European Space Agency's Huygens probe" |
| [T] Cassini 1997 fırlatma; 1 Temmuz 2004 yörünge, Satürn'ü dolanan ilk araç; Huygens 14 Ocak 2005 iniş; 15 Eylül 2017 son | https://en.wikipedia.org/wiki/Cassini%E2%80%93Huygens | "launched on October 15, 1997" ; "On July 1, 2004, ... achieved orbit" ; "It was the first spacecraft to orbit Saturn." ; "entered the atmosphere of Titan on January 14, 2005 ... landed" ; "The mission ended on September 15, 2017" |
| [T] İkinci kaynak (ESA): 1997; Temmuz 2004; 14 Ocak 2005; 15 Eylül 2017 | https://www.esa.int/Science_Exploration/Space_Science/Cassini-Huygens/Countdown_to_Cassini_s_Grand_Finale | "Launched in 1997" ; "reaching Saturn in July 2004" ; "landed on Titan on 14 January 2005" ; "plunging it into Saturn's atmosphere on 15 September 2017" |
| [Ö] Kurtulma hızları NASA: J 59,5; S 35,5; U 21,3; N 23,5 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | gezegenler.json kacis_hizi_km_s (NSSDCA); özet tablo "59.5", "35.5", "21.3", "23.5" |
| [Ö] JPL: J 60,20; S 36,09 | https://ssd.jpl.nasa.gov/planets/phys_par.html | Jupiter ve Saturn satırlarının son sütunu |
| [Ö][H] Fark yarıçap tanımından: √(2GM/R) R = 71.492 → 59,53; R = 69.911 → 60,20 | — | gezegenler.json notu: "v=sqrt(2GM/R) Jüpiter için R=71,492 km (ekvator) ile 59.53, R=69,911 km (ortalama) ile 60.20 km/s veriyor; yani NASA ekvator yarıçapını, JPL ortalama yarıçapı kullanıyor." |

## Bölüm 7 — Uranüs ve Neptün

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Uranüs: ort. yarıçap 25.362, yoğunluk 1,270, dönme −0,71833 gün, çekim 8,87 | https://ssd.jpl.nasa.gov/planets/phys_par.html | "Uranus \| 25559 [D] ±4 \| 25362 [D] ±7 \| 86.8099 [L] ±0.0040 \| 1.270 [*] ±0.001 \| -0.71833 [C] \| 84.016846 [B] \| -7.19 [B] \| 0.51 [B] \| 8.87 [*] \| 21.38 [*]" |
| [Ö] Neptün: ort. yarıçap 24.622, yoğunluk 1,638, dönme 0,67125 gün, çekim 11,15 | https://ssd.jpl.nasa.gov/planets/phys_par.html | "Neptune \| 24764 [D] ±15 \| 24622 [D] ±19 \| 102.4092 [M] ±0.0048 \| 1.638 [*] ±0.004 \| 0.67125 [C] \| 164.79132 [B] \| -6.87 [B] \| 0.41 [B] \| 11.15 [*] \| 23.56 [*]" |
| [H] 86,811/5,9722 = 14,54; 102,409/5,9722 = 17,15; 0,71833 × 24 = 17,24 sa = 17 sa 14 dk; 0,67125 × 24 = 16,11 sa = 16 sa 7 dk | — | hesap |
| [H] Örnek: 102,41/86,81 = 1,180; (24.622/25.362)³ = 0,9150; 1,180/0,915 = 1,289; 1,638/1,270 = 1,290 | — | hesap |
| [Ö] Uranüs 29 (Ağustos 2026) | https://science.nasa.gov/uranus/moons/ | "Uranus has 29 officially recognized moons , as of August 2026," |
| [Ö] Neptün 16 | https://science.nasa.gov/neptune/moons/ | "Neptune has 16 officially recognized moons." |
| [Ö] 84,0 ve 164,8 yıl | https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html | "Sidereal orbit period (days) \| 30,685.400" ; Neptün "60,189.018" |
| [B] Uranüs kirliliksiz gökte çıplak gözle, rahat bulmak için dürbün | https://en.wikipedia.org/wiki/Binoculars | "Although visible unaided in pollution-free skies, Uranus and Vesta require binoculars for easy detection." |
| [Ö] Uranüs ve Neptün orta boy dürbünle | https://en.wikipedia.org/wiki/Binoculars | "reasonably detectable with medium-size binoculars, including ... the dim outer planets Uranus and Neptune" |
| [T] Uranüs eksen eğikliği 97,77°; ekvatoru yörüngeye neredeyse dik tek gezegen | https://science.nasa.gov/Uranus/facts | "Uranus is the only planet whose equator is nearly at a right angle to its orbit, with a tilt of 97.77 degrees." |
| [T] İkinci kaynak 97,77° (Dünya 23,44°) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html | "Obliquity to orbit (deg)" 97.77 (Dünya 23.44) |
| "Yan yatmış topaç" benzetmesi | — | 97,77° eğikliğin yazar benzetmesi |
| [T] Uranüs ve Venüs ters yönde döner | https://science.nasa.gov/Uranus/facts | "one of just two planets that rotate in the opposite direction than most of the planets" ; "öbürü Venüs" için Venüs Lithograph satırı (Bölüm 4) |
| [T] Uranüs atmosferi hacimce %82,5 H₂, %15,2 He, %2,3 CH₄ | https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html | "Molecular hydrogen (H2) - 82.5% (3.3%)" ; "Helium (He) - 15.2% (3.3%)" ; "Methane (CH4) - 2.3%" |
| [T] Mavi-yeşil renk metandan; atmosfer çoğunlukla H ve He | https://science.nasa.gov/Uranus/facts | "Uranus gets its blue-green color from methane gas in the atmosphere." ; "Uranus' atmosphere is mostly hydrogen and helium, with a small amount of methane" |
| [T] Neptün yüksek katmanlarda %80 H, %19 He; en güçlü sürekli rüzgâr 2100 km/sa | https://en.wikipedia.org/wiki/Neptune | "At high altitudes, Neptune's atmosphere is 80% hydrogen and 19% helium." ; "the strongest sustained winds of any planet in the Solar System, as high as 2,100 km/h." (2100 km/sa için NASA'da sayı bulunamadı; tek kaynak) |
| [T] Neptün rüzgârları Jüpiter'in 3, Dünya'nın 9 katı olabilir | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | "Neptune's winds can be three times stronger than Jupiter's and nine times stronger than Earth's." |
| [T] Herschel 13 Mart 1781 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html | Discoverer: "William Herschel" ; Discovery date: "13 March 1781" |
| [T] İkinci kaynak 1781; kuyruklu yıldız ya da yıldız sandı | https://science.nasa.gov/Uranus/facts | "It was discovered in 1781 by astronomer William Herschel, although he originally thought it was either a comet or a star." |
| [T] Uranüs yörüngesinde Newton yasasıyla açıklanamayan düzensizlikler; Le Verrier (Paris) ve Adams (Cambridge) bağımsız hesap; Galle Berlin Gözlemevi; 23–24 Eylül 1846 gecesi | https://www.nasa.gov/history/175-years-ago-astronomers-discover-neptune-the-eighth-planet | "noticed irregularities in its orbit that Newton's law of universal gravitation could not fully explain" ; Le Verrier in Paris and John Couch Adams in Cambridge "independently calculated the location of this postulated planet." ; Galle "used the Fraunhofer telescope at the Berlin Observatory" ; "On the night of Sept. 23-24, 1846, astronomers discovered Neptune" |
| [T] Le Verrier tahminini Galle'ye gönderdi; aramanın ilk gecesinde | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | "Le Verrier sent his predictions to Johann Gottfried Galle" ; "found Neptune on his first night of searching in 1846." |
| [T] İkinci kaynak 23 Eylül 1846; Le Verrier 1845–1846 hesapları | https://en.wikipedia.org/wiki/Neptune | "directly observed with a telescope on 23 September 1846" ; "Urbain Le Verrier developed his own calculations in 1845–1846" |
| [T] Voyager 2: 20 Ağustos 1977; Uranüs 24 Ocak 1986; Neptün 25 Ağustos 1989, bulut tepelerinin ~4800 km üstü; Uranüs ve Neptün'ü ziyaret eden tek araç | https://science.nasa.gov/mission/voyager/voyager-2 | "Aug. 20, 1977" ; "Closest approach to Uranus took place at 17:59 UT Jan. 24, 1986." ; "on Aug. 25, 1989, at 03:56 UT, it flew about 2,980 miles (4,800 kilometers) over the cloud tops" ; "Voyager 2 is the only spacecraft to visit Uranus and Neptune." |
| [T] İkinci kaynak: Neptün 25 Ağustos 1989, tek araç | https://en.wikipedia.org/wiki/Neptune | "Voyager 2, which flew by Neptune on 25 August 1989, remains the only spacecraft to visit the planet." (NASA tarih sayfası en yakın geçişi "about 3,408 miles above Neptune's north pole" diye verir; farklı referans noktası) |
| [T] Büyük Karanlık Leke: güney yarıküre, Dünya'yı içine alabilecek boyut, ~1200 km/sa batıya | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | Voyager 2 güney yarıkürede büyük karanlık fırtınayı izledi, "large enough to contain the entire Earth" ; "moved westward at almost 1,200 kilometers (750 miles) per hour" |
| Gezegenin yıldızlara göre yer değiştirmesi | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | gezegenlerin Güneş çevresindeki hareketi (d3); "birkaç gece gözle" önerisi yazar uygulaması |

## Bölüm 8 — Uydular

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Ekim 2026: 461, Plüton dahil | https://science.nasa.gov/solar-system/moons/facts/ | "As of October 2026 there were 461 officially recognized moons orbiting planets, including dwarf planet Pluto, which has five moons ." |
| [Ö] Gezegen sayfaları (115, 293, 29, 16, 2) | yukarıdaki NASA sayfaları | Bölüm 5–7 satırları |
| [Ö] Wikipedia 2026 aynı sayılar | https://en.wikipedia.org/wiki/Solar_System | "As of 2026 , Saturn has 293 confirmed satellites" |
| [Ö] NSSDCA Mart 2025: 0, 0, 1, 2, 95, 274, 28, 16, 5 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Number of Moons \| 0 \| 0 \| 1 \| 0 \| 2 \| 95 \| 274 \| 28 \| 16 \| 5" (Ay sütunu 0) |
| [H] 115 − 95 = 20; 293 − 274 = 19; toplam 461; 408/461 = %88,5 | — | hesap |
| "Resmî tanıma ya da doğrulama" | NASA Jüpiter ve Satürn sayfaları | "officially recognized by the International Astronomical Union" ; "293 confirmed moons" ("aday cisimler bu sayıya girmez" bu ifadelerden çıkarımdır) |

## Bölüm 9 — Plüton ve cüce gezegenler

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Tombaugh 1930; dokuzuncu gezegen | https://science.nasa.gov/dwarf-planets/ | "Discovered by Clyde Tombaugh in 1930, Pluto was long considered our solar system's ninth planet." |
| [Ö] Eris 5 Ocak 2005; tartışmayı tetikledi | https://science.nasa.gov/dwarf-planets/ | "Eris was discovered on Jan. 5, 2005 ... The discovery of Eris helped trigger the debate that led to Pluto's reclassification as a dwarf planet in 2006." |
| [Ö] Neptün ötesinde benzer cisimler (Kuiper kuşağı) | https://science.nasa.gov/solar-system/kuiper-belt/facts/ | "Its inner edge begins at the orbit of Neptune" ; Plüton "the largest object in the region" |
| [Ö] 24 Ağustos 2006, 5A | https://en.wikipedia.org/wiki/IAU_definition_of_planet | "The final definition, as passed on 24 August 2006 under the Resolution 5A of the 26th General Assembly" |
| [Ö] Tanımın üç koşulu | https://en.wikipedia.org/wiki/IAU_definition_of_planet | "(a) is in orbit around the Sun, (b) has sufficient mass for its self-gravity ... (nearly round) shape, and (c) has cleared the neighbourhood around its orbit." |
| [Ö] Beş cüce gezegen | https://science.nasa.gov/dwarf-planets/ | "So far, the IAU has only recognized five dwarf planets. ... Ceres, Pluto, Haumea, Makemake, and Eris." |
| [Ö] Plüton ~2377 km | https://science.nasa.gov/solar-system/planets/planet-sizes-and-locations-in-our-solar-system/ | "Pluto has an equatorial diameter of about 1,477 miles (2,377 kilometers)." |
| [H] 2377/4879 = 0,49 (Merkür'ün yarısından küçük) | — | hesap |
| [Ö] New Horizons 14 Temmuz 2015 | https://science.nasa.gov/dwarf-planets/ | "On July 14, 2015, NASA's New Horizons spacecraft made its historic flight through the Pluto system" |
| [Ö] Ceres iç Güneş Sistemi'ndeki tek cüce gezegen, asteroit kuşağında | https://science.nasa.gov/dwarf-planets/ | "Ceres is the only dwarf planet in the inner solar system. It's located in the main asteroid belt between Mars and Jupiter." |
| [Ö] 3:2 rezonans | https://science.nasa.gov/solar-system/kuiper-belt/facts/ | "Pluto is in a 3:2 resonance with Neptune, meaning it circles the Sun twice for every three times Neptune goes around." |
| [Ö] Plüton Uranüs'e Neptün'den daha çok yaklaşır | https://science.nasa.gov/solar-system/kuiper-belt/facts/ | "even though its orbit crosses Neptune's orbit, Pluto gets physically closer to Uranus than it ever does to Neptune." |

## Bölüm 10 — Oluşum

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Güneş ~4,6 milyar yıl önce moleküler bulut parçasının çökmesiyle | https://en.wikipedia.org/wiki/Sun | "The Sun formed about 4.6 billion years ago from the collapse of part of a giant molecular cloud" |
| [Ö] En yaşlı malzeme 4,567 milyar yıl | https://en.wikipedia.org/wiki/Sun | "consistent with the radiometric date of the oldest Solar System material, at 4.567 billion years ago." |
| [Ö] Moleküler bulut 1000–10 milyon M☉, yüzlerce ışık yılı, soğuk, topaklanma, çöküş | https://science.nasa.gov/universe/stars/ | "Molecular clouds range from 1,000 to 10 million times the mass of the Sun and can span as much as hundreds of light-years. Molecular clouds are cold which causes gas to clump, creating high-density pockets. ... Eventually, gravity causes some of these clumps to collapse." (dersler_5_8_dogrulama.md #22) |
| [Ö] Önyıldız, sonra öngezegen diski; açısal momentum | https://en.wikipedia.org/wiki/Protostar | "first builds up a low-mass protostar, and then a protoplanetary disk orbiting the object. As the collapse continues, an increasing amount of gas impacts the disk rather than the star, a consequence of angular momentum conservation." (dersler_5_8_dogrulama.md #24) |
| Buz patencisi benzetmesi | — | açısal momentumun korunmasına yazar benzetmesi |
| Gezegenler diskin malzemesinden doğdu; Güneş Sistemi ile Güneş'in yaşı aynı | https://en.wikipedia.org/wiki/Sun | yaş uyumu alıntısı (yukarıda); disk–gezegen bağı için ayrıca https://en.wikipedia.org/wiki/Protostar ("protoplanetary disk") |
| İçte silikat/metal, dışta gaz/buz | https://en.wikipedia.org/wiki/Solar_System | Bölüm 1 alıntıları |
| [Ö] Asteroit kuşağı 2,3–3,3 AB | https://en.wikipedia.org/wiki/Solar_System | "The asteroid belt occupies a torus-shaped region between 2.3 and 3.3 AU from the Sun" |
| [Ö] Jüpiter gezegen oluşumunu durdurdu | https://science.nasa.gov/solar-system/asteroids/facts/ | "Early in the history of the solar system, the gravity of newly formed Jupiter brought an end to the formation of planetary bodies in this region" |
| [Ö] Toplam kütle < Ay | https://science.nasa.gov/solar-system/asteroids/facts/ | "The total mass of all the asteroids combined is less than that of Earth's Moon." |
| [Ö] Kuiper 30 AB, ana bölüm ~50 AB; milyonlarca; ≤ %10 Dünya kütlesi | https://science.nasa.gov/solar-system/kuiper-belt/facts/ | "Its inner edge begins at the orbit of Neptune, at about 30 AU" ; "The inner, main region of the Kuiper Belt ends around 50 AU" ; "millions of small, icy objects" ; "no more than about 10% of the mass of Earth." |

## Sorular için ek

| İddia | Kaynak | Not |
|---|---|---|
| [H] Soru 4: 9,4³ = 830,6; 95/830,6 = 0,114; 5,51 × 0,114 = 0,63 | — | hesap (ekvator çapı oranıyla, kaba) |
| [H] Soru 7: 11,19/5,03 = 2,2 | — | hesap |
| [H] Venüs/Mars basınç sorusu: 92.000/6,36 = 14.465 ≈ 14.500 | — | hesap (92 bar = 92.000 mb) |
| Eksi işaret sorusu ve Neptün keşfi sorusu | — | Bölüm 4 ve Bölüm 7 [T] satırları; yeni olgu yok |

## Notlar

1. KAPSAM AÇIĞI (önemli): Kılavuz d9 için "sekiz gezegen tek tek (yapı, atmosfer, uydu, keşif görevleri)" istiyor. Bu oturumda WebSearch kotası (bütün ajanlarla paylaşılan 200 arama) d3 araştırmasının sonunda doldu; d9 için yeni kaynak aranamadı. Kurala uyarak yalnızca daha önce doğrulanmış verilerle (NSSDCA, JPL, NASA sayfaları, Wikipedia; önceki doğrulama dosyaları) yazıldı. Bu yüzden derste ŞUNLAR YOK: Venüs ve Mars'ın atmosfer bileşimi ve yüzey basıncı/sıcaklığı, Venüs'teki sera etkisi, Jüpiter'in Büyük Kırmızı Leke'si, Galileo uydularının adları (Io, Europa, Ganymede, Callisto), Titan'ın atmosferi, Uranüs'ün eksen eğikliği, Uranüs ve Neptün'ün keşif tarihleri (Herschel, Le Verrier/Galle), keşif görevleri (MESSENGER, BepiColombo, Magellan, Venera, Mars gezginleri, Galileo, Juno, Cassini, Voyager 2). Yalnız New Horizons (Plüton, 2015) kaynaklı olduğu için var. Bir sonraki turda bu maddeler araştırılıp derse eklenmeli.
   GÜNCELLEME (2026-10-27 tamamlama turu, 26 WebSearch): Venüs ve Mars atmosferi, sera etkisi, Büyük Kırmızı Leke, Galileo uydularının adları, Titan atmosferi, Uranüs eğikliği, Uranüs ve Neptün keşfi (Herschel; Le Verrier, Adams, Galle), görevler (Mariner 10, MESSENGER, BepiColombo fırlatma, Mariner 2, Venera 7, Magellan, Galileo, Juno, Europa Clipper fırlatma, Cassini–Huygens, Voyager 2) [T] satırlarıyla eklendi. Hâlâ YOK: Mars gezginleri/yörüngeciler (kapsam d18'e bırakıldı), BepiColombo'nun bugünkü durumu, Büyük Kırmızı Leke'nin küçülüp küçülmediği (kaynak bulunmadı), Uranüs'ün eğikliğinin nedeni.
   Tek kaynaklı satırlar (ikinci kaynakla çapraz kontrol önerilir): Mariner 10 (1975), BepiColombo fırlatma tarihi, Galileo aracının tarihleri, Neptün rüzgârı 2100 km/sa, Neptün atmosferi %80/%19.
   Kaynaklar arası farklar derste açıkça söylendi: Titan basıncı (NASA %60 fazla, ESA 1,5 kat), BKL genişliği (Juno sitesi "iki katından geniş", NASA 2017 ölçümü 1,3 kat), Mars (NSSDCA %95,1 / 6,36 mb / −59 °C; ESA %95,32 / 6,35 mbar / −55 °C), Venüs basınç oranı (Wikipedia 92 kat, NASA 90 kat), Juno varış günü (PDT 4 Temmuz, UTC 5 Temmuz).
2. ÇÖZÜLDÜ (2026-10-27): JPL sayfası eksi işareti hâlâ açıklamıyor (WebFetch: "The page does not explain them"). Ama NASA Venüs Lithograph'ı Venüs'ün ters yönde döndüğünü, NASA Uranüs Facts sayfası Uranüs'ün ters dönen iki gezegenden biri olduğunu söylüyor; tablodaki eksi işaretli gezegenler tam bu ikisi. Derste "eksi işaret ters yönü gösterir" bu çıkarıma dayanıyor. Doğrulama ajanı JPL'de işaret açıklaması bulursa doğrudan alıntıyla değiştirmeli.
3. Eski derste ayrı bölüm olan "Asteroit kuşağı ve Kuiper kuşağı" ile IAU kararı ayrıntıları (Prag, 9000 üye, 424 oy) kılavuzdaki sınır gereği d19'a bırakıldı; d9'da kısa özet ve "19. ders" yönlendirmesi kaldı. Çıkarılan doğrulanmış bilgiler: 424 oy/9000 üye, asteroit sayısı (1,1–1,9 milyon), Vesta 530 km, Kuiper'de 100 km'den büyük yüz binlerce cisim, Eris 2326 km, dürbünle Ceres/Vesta/Pallas. Bunlar d19 için kullanılabilir.
4. Asteroit kuşağının oluşumu: NASA yalnız Jüpiter'i anıyor; d19 ajanının kullandığı Wikipedia Asteroid belt maddesi "Mars ve Jüpiter'in çekim bozulmaları" diyor. d9'da NASA ifadesi kullanıldı.
5. "Venüs en parlak gezegen" cümlesi d1'in doğruladığı Venüs (−4,92) ve Jüpiter (−2,94) değerlerinin karşılaştırmasına dayanıyor; Mars'ın en parlak değeri bu oturumda görülmedi (bilinen en parlak Mars değerinin −2,94'ten sönük olduğu doğrulama ajanınca kontrol edilmeli).
6. Uydu sayıları Ekim 2026 itibarıyla; NASA sayfaları değiştikçe güncellenmeli.
7. Dünya atmosferi yüzdeleri NSSDCA'dan; "hacimce" ayrımı kaynak alıntısında görülmediği için derste belirtilmedi.

## Doğrulama (bağımsız)

Tarih: 2026-10-27. Bağımsız doğrulama ajanı. Hesaplar python3 ile yeniden yapıldı: AB çevirileri (0,387; 0,723; 1,000; 1,524; 5,204; 9,573; 19,165; 30,181), 499,0 s, çap oranları, 107,5 ve 3245 Güneş çapı, 0,31 mm, Neptün 15.060 s = 251 dk, Jüpiter 2597 s = 43,3 dk, yıllar, 47,4/5,4 = 8,8, Jüpiter 140,93 / 140,71, Merkür 1,49999 ve 175,938/175,939, Venüs %81,5 ve 1,0815, Mars %10,7 ve 24 sa 37 dk, tartı 26,5/26,4, 11,19/5,03 = 2,22, 6,36/1014 = 0,0063, 92.000/6,36 = 14.465, kütle toplamı 769,31 ve 2,47 ve 317,8, Satürn 95,2, dönme saatleri (9 sa 56 dk, 10 sa 39 dk, 17 sa 14 dk, 16 sa 7 dk), Neptün/Uranüs yoğunluk 1,289/1,290, uydu toplamı 461 ve %88,5, Plüton/Merkür 0,49, soru 4 (0,63), Jüpiter kurtulma 59,53/60,20, BKL 16.350/12.756 = 1,28. Hesap hatası bulunmadı.

| Kontrol / değişiklik | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| DÜZELTME: "1975'teki Mariner 10'dan sonra" yanıltıcıydı; Mariner 10 Merkür'e ilk kez 1974'te ulaştı ve üç geçiş yaptı. Cümle "Merkür'e giden ilk araç Mariner 10; NASA'ya göre 1974 ve 1975'te üç kez yanından geçti. MESSENGER ikinci görev" yapıldı | https://science.nasa.gov/mission/mariner-10/ | "The closest encounter came at 20:47 UT March 29, 1974." ; "flew by Mercury once more on at 20:59 UT Sept. 21, 1974" ; "The third flyby, at 22:39 UT March 16, 1975" ; "Mariner 10 was the first spacecraft sent to the planet Mercury." |
| DÜZELTME: BepiColombo fırlatma tarihi 19 Ekim 2018 (Wikipedia MESSENGER, tek kaynak) yerine ESA'nın değeri: 20 Ekim 2018, 01.45 GMT. "Avrupa ile Japonya" → "ESA ile JAXA" | https://www.esa.int/For_Media/Press_Releases/BepiColombo_blasts_off_to_investigate_Mercury_s_mysteries | "blasted off on an Ariane 5 from Europe's Spaceport in Kourou at 01:45:28 GMT (03:45:28 CEST) on 20 October" ; "BepiColombo is a joint endeavour between ESA and the Japan Aerospace Exploration Agency, JAXA." |
| İKİNCİ KAYNAK: Galileo aracı 7 Aralık 1995 ve 21 Eylül 2003 doğrulandı; Europa'ya çarpmayı önleme nedeni eklendi. "Yörüngeye giren ilk araç" ifadesi JPL sayfasında yok, Wikipedia'ya atfedildi (tek kaynak) | https://www.jpl.nasa.gov/missions/galileo/ | "The orbiter arrived in the Jovian system on December 7, 1995." ; "Galileo plunged into Jupiter's atmosphere on September 21, 2003 to prevent an unwanted impact with Europa." |
| İKİNCİ KAYNAK: Neptün atmosferi hacimce %80 H₂, %19 He (+%1,5 CH₄); derste "NASA NSSDCA ve Wikipedia'ya göre hacimce" yapıldı | https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html | "Molecular hydrogen (H2) - 80.0% (3.2%); Helium (He) - 19.0% (3.2%);" ; "Methane (CH4) 1.5% (0.5%)" |
| İKİNCİ KAYNAK: Neptün rüzgârı. NSSDCA en yüksek 580 m/s verir; [H] 580 × 3,6 = 2088 km/sa ≈ 2090, Wikipedia'nın 2100 km/sa değeriyle uyumlu. Derse parantez içinde eklendi | https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html | "Wind speeds: 0-580 m/s" |
| TUTARSIZLIK GİDERİLDİ: d3 Satürn için 9,537 AB, d9 9,57 AB diyordu. İkisi de NASA'nın aynı sayfasında: km satırı 1432,041 milyon km (= 9,573 AB), J2000 öğeleri 9,53707032 AB. Neptün: 4514,953 milyon km (= 30,18 AB) ve J2000 30,06896348 AB. Bölüm 2'ye bu fark bir cümleyle eklendi; Soru 1 cevabı "9,6 AB" → "9,5–9,6 AB (NASA'nın iki satırı 9,54 ve 9,57)" | https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html | "Semimajor axis (106 km) \| 1,432.041 \| 149.598 \| 9.573" ; "Semimajor axis (AU) 9.53707032" |
| Neptün J2000 değeri | https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html | "Semimajor axis (AU)" "30.06896348" ; "Semimajor axis (10^6 km)" "4,514.953" |
| DÜZELTME (küçük): dev gezegen yoğunluk aralığı "0,7–1,6" → "0,69–1,64" (Neptün 1,638 aralığın dışında kalıyordu) | https://ssd.jpl.nasa.gov/planets/phys_par.html | Neptune "Bulk Density" 1.638 ±0.004 ; Saturn 0.6871 |
| DÜZELTME: "Wikipedia da 2026 için aynı sayıları veriyor" fazla genişti (alıntı yalnız Satürn'ü kapsıyor) → "Satürn'e aynı sayıyı (293) veriyor" | https://en.wikipedia.org/wiki/Solar_System | "As of 2026 , Saturn has 293 confirmed satellites" |
| Mars'ın en parlak değeri kontrol edildi (yazar notu 5): Mars en çok −2,94, Venüs −4,92 → "Venüs en parlak gezegen" doğru. Derse "Jüpiter'in ve Mars'ın" eklendi; Soru 6 cevabına Mars ve ISS istisnası eklendi | https://en.wikipedia.org/wiki/Apparent_magnitude | tablo: Venus "−4.92" ; Mars "−2.94" ; Jupiter "−2.94" ; International Space Station "−5.90" ; Sirius (tablo) "−1.47" (metindeki cümle −1,46; derste −1,46 bırakıldı) |
| ISS'nin gökte hızlı hareketi: 90 dakikalık dolanım süresinden çıkarım | https://www.nasa.gov/international-space-station/space-station-facts-and-figures/ | "orbiting Earth about every 90 minutes" (d3 satırı) |
| JPL tablo başlıkları (yazar notu) görüldü; sütun sırası kaynak dosyasındaki tanımla aynı. Eksi işaret için JPL hâlâ açıklama vermiyor; "eksi = ters yön" çıkarımı askıda değil, NASA Venüs ve Uranüs alıntılarıyla destekli | https://ssd.jpl.nasa.gov/planets/phys_par.html | "Planet", "Equatorial Radius", "Mean Radius", "Mass", "Bulk Density", "Sidereal Rotation Period", "Sidereal Orbital Period", "V(1,0)", "Geometric Albedo", "Equatorial Gravity", "Escape Velocity" ; Venus -243.018 ; Uranus -0.71833 |
| Uydu sayıları yeniden doğrulandı | https://science.nasa.gov/solar-system/moons/facts/ ; https://science.nasa.gov/saturn/moons/ ; https://science.nasa.gov/jupiter/jupiter-moons/ | "As of October 2026 there were 461 officially recognized moons orbiting planets" ; "Saturn has 293 confirmed moons in its orbit as of August 2026" ; "Jupiter has 115 moons that have been officially recognized by the International Astronomical Union." |
| NSSDCA özet tablosu tarihi ve uydu satırı doğrulandı ("Mart 2025") | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Last Updated: 18 March 2025, DRW" ; "Number of Moons \| 0 \| 0 \| 1 \| 0 \| 2 \| 95 \| 274 \| 28 \| 16 \| 5" ; "Orbital Velocity (km/s) \| 47.4 \| 35.0 \| 29.8 \| 1.0* \| 24.1 \| 13.1 \| 9.7 \| 6.8 \| 5.4" |
| Kaynaklar listesine eklendi: NASA Mariner 10, ESA BepiColombo basın bülteni, NASA JPL Galileo, NSSDCA Neptün ve Satürn | — | — |
| ÇÖZÜLDÜ: Eris "Plüton'la neredeyse aynı büyüklükte" | https://science.nasa.gov/dwarf-planets/ | "nearly the same size as Pluto" ; "Our solar system has five dwarf planets." |
| ÇÖZÜLDÜ: Plüton beş cüce gezegenin en büyüğü (Eris ikinci) | https://science.nasa.gov/solar-system/planets/planet-sizes-and-locations-in-our-solar-system/ | "Eris is the second largest dwarf planet with an equatorial diameter of about 1,445 miles (about 2,326 kilometers)." (dersler_9_11_dogrulama.md #46) |
| ÇÖZÜLDÜ: "Galileo Jüpiter yörüngesine giren ilk araç" artık NASA'ya dayanıyor; ders cümlesi "NASA'ya göre Jüpiter'in ilk yapay uydusu" yapıldı | https://www.nasa.gov/history/30-years-ago-galileo-off-to-orbit-jupiter/ | "The orbiter fired its main engine on Dec. 7, 1995" ; "the first artificial satellite of Jupiter" ; "On Sept. 21, 2003, after 14 years in space" |
| Askıda kalan madde yok. Arama (d3+d9+d10 toplamı): 5 WebSearch (Mariner 10, BepiColombo, Galileo ×2, d10 aydınlık kesir formülü); geri kalan her şey kaynak dosyalarındaki URL'lerin WebFetch'iyle | — | — |

## v3 genişletme (2026-10-28) — yeni satırlar

Kaynak türü: [W] = bu oturumda WebSearch sonucu ya da proje URL'si WebFetch ile okundu (alıntılar WebFetch özetinin aktardığı metindir); [P] = proje dosyasında daha önce doğrulanmış satır; [H] = python3 ile hesap; ÇIKARIM = kaynak ifadesinden mantıkla çıkan cümle. d9 için 14 WebSearch kullanıldı. İzin hatası veren ve yeniden denenmeyen adresler: esa.int Facts_about_Mars, cambridge.org jupiter_and_saturn_2027 (aynı oturumda mercury_and_venus sayfası okunabildi), d2pn8kiwq2w21t.cloudfront.net (JPL Jüpiter PDF'si), space.com/17777 (Dünya katmanları), earthsky.org.

### Yeni bölüm — Merkür yakından
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Çekirdek yarıçapı ~2000 km, gezegen yarıçapının ~%80'i | https://www.nasa.gov/wp-content/uploads/2009/12/mercury_lithograph.pdf | "with a large metallic core having a radius of about 2,000 kilometers (1,240 miles), about 80 percent of the planet's radius." |
| [W] Çekirdek gezegenin yaklaşık yarısı | https://www.planetary.org/worlds/mercury | "Mercury's core takes up about half of the entire planet." |
| [H] 0,8³ = 0,512; 2000/2439,4 = 0,820; 0,820³ = 0,551 | https://ssd.jpl.nasa.gov/planets/phys_par.html | Merkür ortalama yarıçapı 2439,4 km (Bölüm 4 satırı) |
| [W] Çekirdeğin bir kısmı eriyik, küresel manyetik alan | https://www.planetary.org/worlds/mercury | "there is evidence that part of the core is still molten, churning and driving a global magnetic field." |
| [W] Alan yüzeyde Dünya'nınkinin %1'i | https://www.nasa.gov/wp-content/uploads/2009/12/mercury_lithograph.pdf | "Mercury's magnetic field at the surface has just 1 percent the strength of Earth's" |
| [W] Sırtlar çekirdek soğudukça büzülmeden | https://www.planetary.org/worlds/mercury | some ridges come from "Mercury shrinking as its core cools." |
| [W] Atmosfer yerine ince ekzosfer | https://www.nasa.gov/wp-content/uploads/2009/12/mercury_lithograph.pdf | "Instead of an atmosphere, Mercury possesses a thin "exosphere"" |
| Isı tutulamaz, sıcaklık uçlara gider | — | ÇIKARIM (atmosfer yokluğu + aşağıdaki sıcaklıklar) |
| [W] 430 °C; gece −180 °C | https://www.nasa.gov/wp-content/uploads/2009/12/mercury_lithograph.pdf | "Temperatures on Mercury's surface can reach 430 degrees Celsius" ; "nighttime temperatures on the surface can drop to –180 degrees Celsius" |
| [W] İkinci kaynak −180 / 430 °C | https://www.planetary.org/worlds/mercury | bilgi kutusu: -180°C ile 430°C |
| [W] Ay'a benzer kraterli yüzey; Caloris ~1550 km | https://www.nasa.gov/wp-content/uploads/2009/12/mercury_lithograph.pdf | "Mercury's surface resembles that of Earth's Moon, scarred by many impact craters" ; Caloris "about 1,550 kilometers (960 miles) across" |
| [W] Kutuplardaki derin kraterlerde su buzu olabilir; MESSENGER: yalnız sürekli gölgede | https://www.nasa.gov/wp-content/uploads/2009/12/mercury_lithograph.pdf | "Mercury may have water ice at its north and south poles inside deep craters." ; "MESSENGER observations have shown that the materials identified by radar are present only in regions of permanent shadow" |
| [W] İkinci kaynak: kutuplarda buz kanıtı | https://www.planetary.org/worlds/mercury | "ample evidence of water ice at the poles." |
| [W] BepiColombo: varış evresi 3 Eylül 2026'da MTM ayrılmasıyla başladı; yörünge 21 Kasım 2026; MPO–Mio ayrılması 9–10 Aralık 2026; bilim evresi Nisan 2027 | https://www.esa.int/Science_Exploration/Space_Science/BepiColombo/Latest_updates_BepiColombo_s_arrival_at_Mercury | "began with the separation of the Mercury Transfer Module" ; "The composite spacecraft will enter orbit around Mercury on 21 November 2026" ; "MPO and Mio will separate from each other on 9–10 December 2026." ; "The mission's science phase is set to begin in April 2027." (sayfanın son güncellemesi 6 Ekim 2026) |
| [W] İkinci kaynak: BepiColombo 2026'da varacak | https://www.planetary.org/worlds/mercury | "will arrive in 2026." |
| [P] MPO ESA'nın, Mio JAXA'nın | https://www.esa.int/For_Media/Press_Releases/BepiColombo_blasts_off_to_investigate_Mercury_s_mysteries | "BepiColombo is a joint endeavour between ESA and the Japan Aerospace Exploration Agency, JAXA." (hangi modülün kime ait olduğu bu oturumda ayrıca alıntılanmadı; doğrulama ajanı kontrol etmeli) |
| [W] Merkür yalnız şafakta ya da alacakaranlıkta | https://www.nasa.gov/wp-content/uploads/2009/12/mercury_lithograph.pdf | "it is hard to directly observe from Earth except during dawn or twilight." |
| [W] Güneş'ten 27° ya da daha fazla; ufuktan yükseklik önemli; bir iki hafta, birkaç on dakika | https://www.cambridge.org/turnleft/pages/the_planets/mercury_and_venus | "Mercury may be up to 27° or more from the Sun" ; "What actually counts is how high above the horizon Mercury is during twilight." ; "just a few tens of minutes during twilight over just a week or two" |
| [W] Merkür sabah göğünde 13 Kasım–4 Aralık 2026 | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | Mercury morning window "Nov. 13– Dec. 4" (tek kaynak) |
| Doğu ufku | — | ÇIKARIM: sabah göğündeki, Güneş'e yakın cisim doğu yönündedir |
| [W] Merkür geçişleri 2032, 2039, 2049 | https://www.cambridge.org/turnleft/pages/the_planets/mercury_and_venus | WebFetch özeti: sayfada Merkür geçişleri için 2032, 2039, 2049 tarihleri |
| İstanbul'dan görünürlük | — | BULUNAMADI; derste açıkça söylendi |
| [P] Güneş'e filtresiz dürbünle bakmak göz hasarı | https://science.nasa.gov/eclipses/safety/ | "Viewing any part of the bright Sun through ... binoculars ... without a special-purpose solar filter ... will instantly cause severe eye injury." |

### Yeni bölüm — Venüs yakından
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] 20 km'den büyük 1000'den fazla volkan/volkanik merkez | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "More than 1,000 volcanoes or volcanic centers larger than 20 kilometers (12 miles) in diameter dot the surface." |
| [W] Yüzlerce km'lik kıvrımlı lav kanalları | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "Volcanic flows have produced long, sinuous channels extending for hundreds of kilometers." |
| [W] Yüzey 300–500 milyon yıl önce yenilendi | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "It is thought that Venus was completely resurfaced by volcanic activity 300 to 500 million years ago." |
| [W] 1,5–2 km'den küçük krater yok | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "Craters smaller than 1.5 to 2 kilometers (0.9 to 1.2 miles) across do not exist on Venus" (nedeni derste verilmedi) |
| [W] Demir çekirdek ~3000 km yarıçap | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "Venus has an iron core that is approximately 3,000 kilometers (1,200 miles) in radius." |
| [W] Küresel manyetik alan yok; fazla yavaş dönüyor | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "Venus has no global magnetic field" ; "Venus rotates too slowly to generate the type of magnetic field that Earth has." |
| [W] Uydu 0 | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "Known Moons 0" |
| [W] Bulut tepeleri 4 günde tur; ~360 km/sa | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "the top level of cloud layers zips around the planet every four Earth days" ; "hurricane-force winds traveling at about 360 kilometers (224 miles) per hour." |
| [W] Süper dönme adı; 4 gün; 100 m/s ≈ 360 km/sa; gezegen dönüşünün 60 katına kadar | https://en.wikipedia.org/wiki/Atmosphere_of_Venus | "exhibits a phenomenon of super-rotation, in which the atmosphere circles the planet in just four Earth days" ; "blow at a speed of 100 m/s (≈360 km/h or 220 mph)" ; "Winds move at up to 60 times the speed of the planet's rotation." |
| [H] 243/4 = 60,75; 2π × 6051,8 = 38.025 km; /96 sa = 396 km/sa; /(243 × 24) = 6,52 km/sa | https://ssd.jpl.nasa.gov/planets/phys_par.html | Venüs yarıçapı 6051,8 km (Bölüm 4 satırı) |
| [W] Venus Express 2005 (ESA) | https://www.nasa.gov/sites/default/files/files/Venus_Lithograph.pdf | "2005 — The European Space Agency launches Venus Express to study the atmosphere and surface." |
| [W] VERITAS: yüzey ve iç, radar haritaları, kaya bileşimi haritası, etkin volkanizma; fırlatma TBD, durum "Future"; ardından DAVINCI ve EnVision | https://jpl.nasa.gov/missions/veritas | "VERITAS will return richly detailed radar maps of Venus' surface" ; "will also produce the first maps of surface rock composition" ; "will search for the thermal signatures of active volcanism" ; launch date "TBD" ; "It will be followed by NASA's DAVINCI mission and ESA's EnVision mission" |
| [W] Güneş ve Ay'dan sonra en parlak; 45°'den fazla uzaklaşır | https://www.cambridge.org/turnleft/pages/the_planets/mercury_and_venus | "other than the Sun and the Moon it's the brightest thing in the sky" ; "it can wander more than 45° from the Sun" |
| [W] İyi sabitlenmiş dürbünle hilal | https://www.cambridge.org/turnleft/pages/the_planets/mercury_and_venus | "you can see the crescent shape in your finderscope or well-stabilized binoculars!" |
| [W] Venüs sabah göğünde 3 Kasım–31 Aralık 2026; sabah en parlak 29 Kasım | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | "Mornings: Nov. 3– Dec. 31" ; "in the morning sky on Nov. 29" (greatest brilliancy) |

### Bölüm 5 — Dünya (ek paragraf)
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] İç çekirdek katı demir top, ~Güneş yüzeyi kadar sıcak, Ay'ın %70'i genişliğinde | https://www.nasa.gov/?p=414092 | "At the heart of our planet lies a solid iron ball, about as hot as the surface of the sun." ; "which is 70% as wide as the moon." (sayfa başlığı "Cut-away Diagram of Earth's Interior") |
| [W] Dış çekirdek sıvı demir; manto; kabuk | https://www.nasa.gov/?p=414092 | "an ocean of liquid iron known as "the outer core."" ; "Surrounding the core is "the mantle" and Earth's "crust" forms the top layer." |
| [W] Manyetik alan dış çekirdekten | https://www.nasa.gov/?p=414092 | "Earth's magnetic field comes from the outer core's ocean of iron," |
| "ince kabuk" | — | ÇIKARIM ("top layer"); kalınlık bu oturumda kaynakla bulunamadı (space.com sayfası izin hatası) |

### Yeni bölüm — Mars yakından
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Kırmızı renk demirin oksitlenmesi (paslanma); havadaki toz | https://www.nhm.ac.uk/discover/planet-mars.html | "Its famous colour is caused by the iron in rocks and dust of the crust's surface oxidising" ; "the process of iron on Earth rusting" ; "Dust is heavily present in Mars's atmosphere, making the planet appear red to us on Earth." |
| [W] Olympus Mons kalkan volkanı, ~25 km, 624 km çap | https://www.nhm.ac.uk/discover/planet-mars.html | "Olympus Mons is a shield volcano around 25 kilometres in height and 624 kilometres in diameter." |
| [W] İkinci kaynak: 17 mil yükseklik, 373 mil genişlik | https://www.nasa.gov/pdf/173749main_Mars_Poster.pdf | "Olympus Mons is about 17 miles high and 373 miles wide." ; [H] 17 × 1,609 = 27,4 km; 373 × 1,609 = 600 km |
| [W] Valles Marineris 7 km derin | https://www.nhm.ac.uk/discover/planet-mars.html | "The deepest canyon on the planet is Valles Marineris at 7 kilometres." |
| [W] New York–Los Angeles uzunluğu | https://www.nasa.gov/pdf/173749main_Mars_Poster.pdf | "stretches a distance equivalent to the distance from New York to Los Angeles" (afişte "Vallis" yazımıyla) |
| [W] Kutup başlıkları mevsimle büyür/küçülür | https://www.nasa.gov/pdf/173749main_Mars_Poster.pdf | "the growth and retreat of the Martian polar ice caps with the change of seasons" |
| [W] Eriseydi 20–30 m su | https://www.nhm.ac.uk/discover/planet-mars.html | "If these melted, the planet would be covered by 20- to 30-metre-deep water." |
| [W] Bütün gezegeni saran toz fırtınaları | https://www.nasa.gov/pdf/173749main_Mars_Poster.pdf | "Seasonally, great dust storms occur that engulf the entire planet." |
| [W] Çekirdek demir + nikel + kükürt; gezegenin ~yarısı; tamamen sıvı olabilir | https://www.nhm.ac.uk/discover/planet-mars.html | "It's thought that Mars's core is predominantly made up of iron, but also nickel and sulphur." ; "The core is about half the size of the planet and may be entirely liquid." |
| [W] Asaph Hall, Ağustos 1877 | https://science.nasa.gov/mars/moons/ | "August 1877" ; "Asaph Hall" |
| [W] Phobos büyük olan, günde üç tur, 100 yılda 1,8 m yaklaşır, 50 milyon yılda çarpar ya da halka olur | https://science.nasa.gov/mars/moons/ | "Phobos is the larger of Mars' two moons" ; "It orbits Mars three times a day." ; "Phobos is nearing Mars at a rate of six feet (1.8 meters) every hundred years." ; "it will either crash into Mars in 50 million years or break up into a ring." |
| [W] Deimos küçük, kraterli, 30 saat | https://science.nasa.gov/mars/moons/ | "a small and lumpy, heavily cratered object" ; "It orbits Mars every 30 hours." |
| [W] Yakalanmış asteroit ya da erken enkaz | https://science.nasa.gov/mars/moons/ | "Both are thought to be captured asteroids, or debris from early in the formation of our solar system." |
| [W] 11 Ekim 2026 Yengeç'te Arı Kovanı; 26 Kasım Regulus'un 1,7° üstü (Aslan); aralık sonu −0,1, Arcturus'la renk ve parlaklıkta yarış | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | "Mars passes through the Beehive Cluster in Cancer." ; "Mars passes 1.7 degrees above Regulus in Leo" ; "By late December, Mars brightens to magnitude –0.1 and will rival Arcturus in both color and brightness." |
| Regulus Aslan'da; Arcturus bir yıldız | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | "Regulus in Leo" ; "rival Arcturus" (derste "en parlak" ve "turuncu" nitelemeleri kaynaksız olduğu için kullanılmadı) |
| [P] Karşı konum 19 Şubat 2027, Aslan, −1,2; 13,8″; ~101 milyon km | https://nakedeyeplanets.com/mars-oppositions.htm | d18_kaynak.md: 2027 "February 19", "Leo", "-1.2", 13,8″, 0,6780 AB (= 101,4 milyon km) |
| [W] En yakın uzaklık 54,6 milyon km; en büyük görünür çap 25,6″ | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | "Minimum (106 km) 54.6" ; "Maximum (seconds of arc) 25.6" |
| [H] 54,6/101 = 0,541; 25,6 × 0,541 = 13,84″; 13,8 × 7 = 96,6″ = 1,61′; 1,61/31,6 = 0,051 (~1/20) | — | hesap (dolunay 31,6′: d10/d3 kaynak satırları) |
| Dürbünde yüzey ayrıntısı beklenmez, teleskop gerekir | — | ÇIKARIM (1,6 yay dakikalık disk) |
| Manyetik alan konusu | — | Derste "kaynakla girmedik" diye açıkça bırakıldı |

### Yeni bölüm — Jüpiter yakından
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Derinde hidrojen sıvılaşır; yolun ~üçte birinde metalik ve iletken; merkezde Dünya boyutunda buz-kaya çekirdeği olabilir | https://webarchive.library.unt.edu/eot2008/20080923101121/http:/solarsystem.nasa.gov/multimedia/downloads/11_Jupiter_Litho_FC.pdf | "compressing the hydrogen gas into a liquid." ; "At depths about a third of the way down, the hydrogen becomes metallic and electrically conducting." ; "At the center, the immense pressure may support a solid core of ice–rock about the size of Earth." |
| [W] Merkez basıncı 50–100 milyon atmosfer; metalik hâl; modellerin çoğu (hepsi değil) yoğun çekirdek | https://www.britannica.com/place/Jupiter-planet/The-interior | "The central pressure is in the range of 50–100 million atmospheres" ; "At such tremendous pressures hydrogen is expected to be in a metallic state." ; "most (but not all) models incorporate a dense core" |
| [W] İkinci kaynak: metalik hidrojen ve helyum karışımı | https://www.rmg.co.uk/stories/space-astronomy/planet-jupiter-gas-giant-king-planets | "Surrounding this is thought to be a dense mixture of metallic hydrogen and helium." |
| Metalik hidrojen tanımı (elektronlar serbest) | — | yazar açıklaması ("electrically conducting" ifadesinden) |
| [W] Manyetik alan ~20.000 kat | https://webarchive.library.unt.edu/eot2008/20080923101121/http:/solarsystem.nasa.gov/multimedia/downloads/11_Jupiter_Litho_FC.pdf | "Jupiter's enormous magnetic field is nearly 20,000 times as powerful as Earth's." |
| [W] Atmosfer Güneş'e benzer, H ve He; bulutlar çoğunlukla amonyak; kuşaklar ve bölgeler doğu-batı rüzgârlarından | aynı | "mostly hydrogen and helium." ; "Most visible clouds are composed of ammonia." ; "dark belts and light zones created by strong east–west winds" |
| [W] Halka 1979 Voyager 1, sürpriz; göktaşlarının kaldırdığı toz | aynı | "Discovered in 1979 by NASA's Voyager 1 spacecraft, Jupiter's rings were a surprise" ; "may be formed by dust kicked up as interplanetary meteoroids" |
| [W] İkinci kaynak: Voyager I soluk halka; Dünya'dan görülmez | https://www.rmg.co.uk/stories/space-astronomy/planet-jupiter-gas-giant-king-planets | "Voyager I discovered a faint ring on Jupiter by chance." ; "The ring is not visible from the Earth." |
| [W] Güneş'ten aldığının ~2 katı enerji yayar | https://www.britannica.com/place/Jupiter-planet/The-interior | "allows Jupiter to radiate about twice as much energy as it receives from the Sun." |
| [W] BKL 300 yıldan uzun süredir gözleniyor (eski NASA kartı) | https://webarchive.library.unt.edu/eot2008/20080923101121/http:/solarsystem.nasa.gov/multimedia/downloads/11_Jupiter_Litho_FC.pdf | "The Great Red Spot, a giant spinning storm, has been observed for more than 300 years." |
| AYRILIK: Juno sitesi en az 250 yıl | https://www.missionjuno.swri.edu/key-terms/great-red-spot | "It has been present for at least 250 years" (Bölüm 6 satırı); "tartışmalı" nitelemesi ÇIKARIM (iki kaynak arasındaki fark) |
| [W] Jüpiter 24 Eylül 2026'dan yıl sonuna Aslan'da; sabah göğü 19 Ağustos–31 Aralık | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | "enters Cancer on June 22 and Leo on Sept. 24, where it remains through year's end" ; "Mornings: Aug. 19– Dec. 31." |
| [P] Karşı konum 10–11 Şubat 2027 | https://www.cambridge.org/turnleft/pages/the_planets/jupiter_and_saturn_2027 | d18_kaynak.md: Cambridge "February 10", EarthSky "February 11, 2027" |
| [W] Dürbünle dört uydu; küçük teleskopla basık disk ve bantlar | https://www.rmg.co.uk/stories/space-astronomy/planet-jupiter-gas-giant-king-planets | "With a pair of binoculars, you can see the four moons discovered by Galileo." ; "even in a small telescope, to show a disc with polar flattening." ; "several bands of dark and light clouds can be seen." |

### Yeni bölüm — Satürn yakından
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Çekirdek kaya + erimiş metal, >11.700 °C (muhtemel) | https://cubesat.cnes.fr/en/saturn | "Saturn's core is likely a mixture of rock and molten metal at a temperature of more than 11,700°C" |
| [W] Sıvı metalik hidrojen okyanusu; akımlar manyetik alanı üretir | https://cubesat.cnes.fr/en/saturn | "The outer core is fluid metallic hydrogen (atomic hydrogen) forming a liquid-metal and electrically conductive ocean" ; "with currents generating Saturn's powerful magnetic field." |
| [W] Sıvı hidrojen katmanı; atmosfer H ve He | https://cubesat.cnes.fr/en/saturn | "Next comes a layer of liquid hydrogen at 6,000°C" ; "chiefly composed of hydrogen and helium gas" |
| [W] Rüzgâr 1800 km/sa | https://cubesat.cnes.fr/en/saturn | "Winds here may attain speeds of 1,800 km/h." (tek kaynak) |
| [W] Halkalar 282.000 km, ~1 km kalın; su buzu; tanelerden onlarca metrelik kayalara | https://www.skyatnightmagazine.com/space-science/saturn-ring-plane-crossing | "only around 1km (0.6 miles) in thickness" ; "spread over 282,000km" ; "almost entirely composed of particles of water ice" ; tiny grains to boulders tens of metres across |
| [W] Yer yer 10 m; ana halkalar ~280.000 km; neredeyse saf su buzu | https://www.scientificamerican.com/article/are-saturns-rings-vanishing-that-depends-on-your-point-of-view/ | "In some places the rings are just 10 meters high, as tall as a three-story building." ; "The main rings are about 280,000 kilometers across" ; "nearly pure water ice" |
| [W] Üçüncü kaynak: ~1 km, yer yer onlarca metre; A halkası >270.000 km; su buzu | https://cubesat.cnes.fr/en/saturn | "These rings are around 1 km thick but may thin locally to only a few tens of metres." ; "it's A ring spans more than 270,000 km" ; "billions of fragments of water ice" |
| [W] Eksen 26,7°; 23 Mart 2025 kenardan; ~15 yılda bir; sonraki 2038 | https://www.skyatnightmagazine.com/space-science/saturn-ring-plane-crossing | "axis of rotation being tilted by 26.7°" ; "On 23 March 2025, Saturn's rings will seem to vanish." ; "occurring around every 15 years" ; "not until 2038" |
| [W] İkinci kaynak: 23 Mart; ~15 yıl | https://www.scientificamerican.com/article/are-saturns-rings-vanishing-that-depends-on-your-point-of-view/ | "And on March 23 our planet will pass through the ring plane" ; "Approximately every 15 years the relatively paper-thin rings ... can be seen edge-on." |
| [H] 282.000 × 0,1 mm = 28,2 m; 282.000 km / 10 m = 28,2 milyon | — | hesap (kâğıt 0,1 mm yazar varsayımı, derste "yuvarlak varsayım" diye belirtildi) |
| [W] Satürn karşı konumu 4 Ekim 2026; 5 Eylül'den itibaren Balina'da; sarımsı beyaz, orta parlaklık | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | "Saturn reaches opposition on Oct. 4" ; "Back into Cetus (from Sept. 5 onward)" ; "shines as a yellowish-white 'star' of moderate brightness." |
| [P] Halkalar için 20× ve üstü; Titan orta boy dürbünle | https://en.wikipedia.org/wiki/Binoculars | "Only binoculars with very high magnification, 20x or higher, are capable of discerning Saturn's rings" ; "Saturn's largest moon Titan" (Bölüm 6 satırı) |
| Titan'ın geceden geceye yer değiştirmesi | — | ÇIKARIM (Titan Satürn'ü dolanan bir uydu; dönemi bu oturumda kaynakla verilmedi) |

### Yeni bölüm — Uranüs ve Neptün yakından
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Uranüs kütlesinin ≥%80'i sıcak yoğun "buzlu" akışkan, küçük kayalık çekirdek | https://science.nasa.gov/Uranus/facts | "Most (80% or more) of the planet's mass is made up of a hot dense fluid of "icy" materials" ; "above a small rocky core." |
| [P] "Buz" = su, metan, amonyak | https://en.wikipedia.org/wiki/Solar_System | Bölüm 1 satırı ("chemical compounds with melting points of up to a few hundred kelvins such as water, methane, ammonia") |
| [W] Neptün: atmosfer derinlere uzanır, suya ve erimiş buzlara karışır; ~Dünya boyutunda katı çekirdek; mavi renk metan | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | "Neptune's atmosphere extends to great depths, gradually merging into water and other melted ices over a heavier, approximately Earth-size solid core." ; "Neptune's blue color is the result of methane in the atmosphere." |
| [W] Uranüs manyetik ekseni ~60° eğik, merkezden yarıçapın 1/3'ü kadar kaymış | https://science.nasa.gov/Uranus/facts | "the magnetic axis is tilted nearly 60 degrees from the planet's axis of rotation" ; "offset from the center of the planet by one-third of the planet's radius." |
| [W] Neptün manyetik ekseni ~47° | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | "tipped over by about 47 degrees compared with the planet's rotation axis." |
| [W] 21 yıllık karanlık kış; en düşük 49 K (−224,2 °C) | https://science.nasa.gov/Uranus/facts | "plunging the other half of the planet into a 21-year-long, dark winter." ; "a minimum temperature of 49K (-224.2 degrees Celsius)." |
| [W] Halkalar 10 Mart 1977, yıldız örtülmesi, en az beş halka; Elliot, Dunham, Mink | https://www.nature.com/articles/267328a0 | "AT least five rings encircle the planet Uranus" ; "five brief occultations of the star SAO 158687 that occurred both before and after its occultation by Uranus" (Nature 267, 328–330, 26 Mayıs 1977) |
| [W] Kuiper Uçan Gözlemevi; James Elliot fikri; Voyager 2 1986 ilk doğrudan görüntü; toplam 13 | https://www.skyatnightmagazine.com/space-science/uranus-rings-discovery | "turned to NASA's Kuiper Airborne Observatory to get us above the clouds" ; "James Elliot was our principal investigator" ; "In 1986 Voyager 2 flew past the planet, sending back the first direct images of the rings" ; "the total count to 13" |
| [W] NASA: 13 halka | https://science.nasa.gov/Uranus/facts | WebFetch özeti: sayfa 13 halka listeler |
| [W] Neptün altı halka, dört yay | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | "Neptune has six known rings." ; "have four thick regions (clumps of dust) called arcs." |
| [W] Uranüs uyduları Shakespeare ve Pope karakterleri | https://science.nasa.gov/Uranus/facts | "Uranus' moons are unique in being named for characters from the works of William Shakespeare and Alexander Pope." |
| [W] Triton: Lassell 10 Ekim 1846, Neptün'den 17 gün sonra; ters yönde dolanan tek büyük uydu; yakalanmış Kuiper cismi (milyonlarca yıl önce); Voyager 2 gayzerleri; −235 °C; 2700 km | https://science.nasa.gov/neptune/neptune-moons/triton/ | "Triton was discovered on Oct. 10, 1846 by British astronomer William Lassell" ; "just 17 days after Neptune itself was discovered." ; "the only large moon in our solar system that orbits in the opposite direction of its planet's rotation." ; "Scientists think Triton is a Kuiper Belt Object captured by Neptune's gravity millions of years ago." ; "Voyager 2 also found Triton has active geysers." ; "-235 degrees Celsius" ; "1,680 miles (2,700 kilometers)" |
| [W] Gayzerler 8 km'den yükseğe | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | "Voyager 2 discovered geysers spewing icy material upward more than 8 kilometers (5 miles)." |
| [W] Büyük Karanlık Leke Hubble görüntülerinde yok | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | "Subsequent images taken by the Hubble Space Telescope showed no sign of this Great Dark Spot." |
| "Ters yörünge bu fikirle uyumlu" | — | ÇIKARIM (NASA iki olguyu yan yana verir; nedensellik derste "uyumlu" diye yumuşatıldı) |
| [W] Uranüs: 2026 boyunca Boğa; karşı konum 25 Kasım; +5,6; dürbünle kolay | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | "Uranus spends all of 2026 in Taurus." ; "Uranus reaches opposition on Nov. 25" ; "At magnitude +5.6, it is easily found with binoculars" |
| [W] Neptün: 2026 boyunca Balıklar; karşı konum 25 Eylül; +7,8 | aynı | "remains in Pisces throughout 2026" ; "Neptune reaches opposition on Sept. 25" ; "At magnitude +7.8, it is visible only in binoculars or a telescope" |
| [W] Neptün çıplak gözle görülmez | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | "It is invisible to the naked eye because of its extreme distance from Earth." |
| [P] Kent +3, banliyö +4 | https://en.wikipedia.org/wiki/Apparent_magnitude | d1_kaynak.md satır 110 |
| [P] 50 mm dürbün ~4,3 kadir kazanç | — | d11_kaynak.md satır 25 ([H] 2,5 × log₁₀(51) = 4,27) |
| [H] 10^(0,4 × 2,2) = 7,59; 3 + 4,3 = 7,3; 10^(0,4 × 0,5) = 1,58 | — | hesap |

### Bölüm 3 (ek), Uydular (ek), Oluşum (ek)
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [H] Yıllık ortalama ilerleme: 360/11,8626 = 30,3°; 360/29,447 = 12,2°; 360/84,017 = 4,28°; 360/164,79 = 2,18° | https://ssd.jpl.nasa.gov/planets/phys_par.html | yıldızıl yörünge dönemleri (Bölüm 3 satırları) |
| Gökteki ortalama hareketin yörünge dönemine bağlı olması | — | ÇIKARIM (uzun vadede yer merkezli ortalama hareket yıldızıl döneme eşittir); geri hareket 3. ders |
| [W] Jüpiter 22 Haziran Yengeç, 24 Eylül 2026 Aslan; Uranüs Boğa, Neptün Balıklar | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | yukarıdaki satırlar |
| [P] Galileo uyduları ve Titan dışındaki uydular dürbün için fazla sönük | https://en.wikipedia.org/wiki/Binoculars | "too faint to be seen with most binoculars are the planetary moons, except the Galileans and Titan" (Bölüm 6 satırı) |
| [P] Galileo/Marius 1610; Huygens Titan 1655 | https://www.nasa.gov/wp-content/uploads/2009/12/moons_of_jupiter_lithograph.pdf ; https://esa.int/Our_Activities/Space_Science/Cassini-Huygens/Facts_about_Titan | Bölüm 6 satırları |
| [W] Kar çizgisi tanımı; içte ağır bileşikler → küçük kayalık gezegenler; dışta uçucular → devler; karasal/dev ayrımı | https://en.wikipedia.org/wiki/Frost_line_(astrophysics) | "the minimum distance from the central protostar of a solar nebula where the temperature is low enough" ; "only heavier compounds can be accreted to form the typically much smaller rocky planets" ; "gaseous compounds (which are much more abundant) can be quite easily condensed" ; "therefore separates terrestrial planets from giant planets in the Solar System" |
| [W] Oluşumda ~5 AB; asteroit kanıtı ~2,7 AB; modele bağlı; zamanla değişir | https://en.wikipedia.org/wiki/Frost_line_(astrophysics) | "approximately equals 5 AU" ; "the frost line was located at around 2.7 AU from the Sun" ; "depend on the physical model used to calculate it" ; "The location of the frost line changes over time" |
| [W] ~4 AB; dışarıda katı kütle ~5 kat; yeterince büyük çekirdek H ve He toplar | https://www.astro.utoronto.ca/~mhvk/AST221/L18/L18.pdf | "frost-line ~4AU" ; "solid mass jumps by ~5" ; "If core massive enough, H & He can be accreted." |
| Türkçe "kar çizgisi / donma çizgisi" adları | — | Türkçe terim resmî bir sözlükte doğrulanmadı; İngilizcesi (frost line) parantezde verildi |
| Eski cümle çıkarıldı: "Bu düzenin nasıl ortaya çıktığının ayrıntıları bu derste kaynakla ele alınmadı" (artık kar çizgisi paragrafı kaynaklı olarak anlatıyor); 14. ders yönlendirmesi yeni paragrafta korundu | — | — |

## Bağımsız doğrulama (v3, 2026-10-28)

[DOĞ] = doğrulama ajanı bu oturumda WebFetch ile yeniden okudu. [GOK] = Urania'nın kendi gok.js'i (Astronomy Engine) ile Node'da hesap; İstanbul 41,0 K 29,0 D; takımyıldız sınırları J2000 koordinatıyla A.Constellation; karşı konum yer merkezli ekliptik boylam farkı 180° (gok.js karsiKonum yöntemi); parlaklık gok.js gezegenKadir. Betikler: oturum karalama dizini fc/gez*.js.

| İddia | Kaynak URL | Kaynaktaki ifade / hesap |
|---|---|---|
| [DOĞ] space.com 2026 satırlarının hepsi (Merkür 13 Kas–4 Ara, Venüs 3 Kas–31 Ara ve 29 Kas, Mars 11 Eki / 26 Kas / −0,1, Jüpiter 22 Haz / 24 Eyl, Satürn 4 Eki ve Balina, Uranüs 25 Kas +5,6 Boğa, Neptün 25 Eyl +7,8 Balıklar) | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | alıntılar birebir doğrulandı |
| [GOK] Jüpiter Yengeç'e 22 Haz 2026 03 UT; Aslan'a 23 Eyl 2026 ~16 UT (space.com 24 Eyl) → derste "23–24 Eylül"; Mart 2027'ye kadar Aslan'dan çıkmıyor | — | hesap |
| [GOK] Jüpiter doğuşu İstanbul: 26 Eyl 03.09, 29 Eki 01.26, 30 Kas 23.31, 31 Ara 21.27 → "yıl sonuna kadar sabah göğü" düzeltildi: ekimde gece yarısından sonra, aralık sonunda 21.30 civarı | — | hesap |
| [GOK] Jüpiter karşı konumu 11 Şub 2027 00.28 UT (İstanbul 03.28) → "10–11 Şubat gecesi" uyumlu | — | hesap |
| [GOK] Uranüs karşı konumu 25 Kas 2026 22.41 UT = İstanbul 26 Kas 01.41; 5,6 kadir; Boğa'da bütün 2026 → derste "25–26 Kasım gecesi" | — | hesap |
| [GOK] Neptün karşı konumu 26 Eyl 2026 01.41 UT = İstanbul 04.41; 7,7–7,8 kadir; Balıklar'da bütün 2026 → derste "25–26 Eylül gecesi" (space.com'un 25 Eylül'ü ABD saatine göre) | — | hesap |
| [GOK] Satürn karşı konumu 4 Eki 2026 12 UT, Balina'da (5 Eyl 2026–23 Şub 2027) | — | hesap; space.com ile aynı |
| [GOK] Mars: Yengeç 25 Eyl–30 Eki 2026; Arı Kovanı'na (M44) en yakın 11 Eki 2026, 0,08°; Regulus'a en yakın 26 Kas 2026, 1,72°, Mars kuzeyde (δ 13,6° > 12,0°); 31 Ara −0,12 kadir; karşı konum 19 Şub 2027 15.51 UT, Aslan, −1,2/−1,3 kadir, 101,4 milyon km, 13,8″ | — | hesap; space.com ve nakedeyeplanets ile aynı |
| [GOK] Merkür: alt kavuşum 4 Kas 2026; en büyük batı uzanımı ~20 Kas (19,6°); İstanbul'da sivil şafakta yükseklik ≥5° 10 Kas–8 Ara → space.com'un 13 Kas–4 Ara aralığı uyumlu | — | hesap |
| [GOK] Merkür en büyük uzanımları 2000 sonrası 17,9°–27,8° → "27°'nin pek ötesine geçemez" | — | hesap (Cambridge sayfası bu oturumda izin hatası verdi, yeniden denenmedi) |
| [GOK] Venüs: alt kavuşum 24 Eki 2026; sivil şafakta yükseklik 3 Kas'ta 6,7°; en büyük uzanım 3 Oca 2027, 47,0° (">45°" uyumlu); en parlak an gezegenKadir'e göre 25 Kas (−4,89), Astronomy Engine'e göre 27 Kas (−4,87); 25–29 Kas arası fark ≤0,01 kadir → space.com'un 29 Kasım'ı tek gün olarak verilmedi, "Kasım'ın son haftası" | — | hesap |
| [GOK] Merkür geçişleri 13 Kas 2032, 7 Kas 2039, 7 May 2049 (A.SearchTransit); İstanbul'da Güneş yüksekliği: 2032 başta 16,8°, sonda 28,1°; 2039 başta 23,0°, sonda 32,4°; 2049 başta 62°, sonda −6,6° (Güneş geçiş bitmeden batar) | — | hesap; Cambridge'in 2032/2039/2049 yılları doğrulandı |
| [DOĞ] İkinci kaynak: 7× dürbünle Venüs hilali | https://www.universetoday.com/articles/venus-slip-slides-away-catch-it-while-you-can | "Even 7x binoculars will show its thinning sickle shortly at dusk." |
| [DOĞ] BepiColombo tarihleri; MPO ESA'nın, Mio JAXA'nın | https://www.esa.int/Science_Exploration/Space_Science/BepiColombo/Latest_updates_BepiColombo_s_arrival_at_Mercury | "ESA's Mercury Planetary Orbiter (MPO)" ; "JAXA's Mercury Magnetospheric Orbiter (Mio)" ; "3 September 2026" ; "21 November 2026" ; "9–10 December 2026" ; "April 2027" (sayfa 06/10/2026) |
| [DOĞ] Uranüs halkaları: örtülme 10 Mart 1977; yazarlar J. L. Elliot, E. Dunham, D. Mink (Nature 1977) | https://www.nature.com/articles/267328a0 | "occultation by Uranus on 10 March 1977" |
| [DOĞ] Ad biçimleri James Elliot, Edward Dunham, Jessica Mink | https://www.skyatnightmagazine.com/space-science/uranus-rings-discovery | "James Elliot" ; "Edward Dunham" ; "Jessica Mink" ; "On 10 March 1977" |
| [DOĞ] Ekzosfer: çarpışmasız seyrek katman; Merkür | https://en.wikipedia.org/wiki/Exosphere | "the molecules are essentially collision-less" ; "Mercury, the Moon, Ceres, Europa, and Ganymede have surface boundary exospheres" |
| [DOĞ] Kalkan volkanı tanımı; Olympus Mons | https://en.wikipedia.org/wiki/Shield_volcano | "named for its low profile" ; "eruption of highly fluid (low viscosity) lava" ; "including Olympus Mons on Mars" |
| [DOĞ] Yeniden okunan diğer kaynaklar (alıntılar tuttu): NASA Merkür ve Venüs litografileri, Jüpiter litografisi (arşiv), Planetary Society Merkür, NHM Mars, NASA Mars uyduları, NASA Uranüs, NASA Triton, CNES Satürn, Sky at Night halka düzlemi, Britannica Jüpiter içi, Toronto AST221 L18, JPL VERITAS, NASA Dünya içi, Wikipedia Binoculars ve Apparent magnitude | (yukarıdaki satırlar) | — |
| DÜZELTME: "Aynı rehbere göre ... hilal" cümlesi Space.com cümlesinden sonra geldiği için yanlış kaynağı gösteriyordu → "Cambridge rehberine göre" | — | — |
