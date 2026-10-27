# d9 — Güneş Sistemi'nin Gezegenleri: kaynak listesi

Tarih: 2026-10-27. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
[Ö] = önceki doğrulama oturumunda (aynı gün) indirilip alıntısı birebir kontrol edilmiş: arastirma/dersler_9_11_dogrulama.md (d9 #1–64), dersler_1_4_dogrulama.md, dersler_5_8_dogrulama.md, gezegenler.json (NSSDCA ve JPL satırları), sabitler.json. [B] = bu oturumda WebFetch ile okundu (WebFetch özetinin aktardığı metin). [D1] = aynı oturumda d1 ajanının WebFetch ile doğruladığı satır (arastirma/dersler_v2/d1_kaynak.md). [H] = bu derste yapılan hesap.

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

## Notlar

1. KAPSAM AÇIĞI (önemli): Kılavuz d9 için "sekiz gezegen tek tek (yapı, atmosfer, uydu, keşif görevleri)" istiyor. Bu oturumda WebSearch kotası (bütün ajanlarla paylaşılan 200 arama) d3 araştırmasının sonunda doldu; d9 için yeni kaynak aranamadı. Kurala uyarak yalnızca daha önce doğrulanmış verilerle (NSSDCA, JPL, NASA sayfaları, Wikipedia; önceki doğrulama dosyaları) yazıldı. Bu yüzden derste ŞUNLAR YOK: Venüs ve Mars'ın atmosfer bileşimi ve yüzey basıncı/sıcaklığı, Venüs'teki sera etkisi, Jüpiter'in Büyük Kırmızı Leke'si, Galileo uydularının adları (Io, Europa, Ganymede, Callisto), Titan'ın atmosferi, Uranüs'ün eksen eğikliği, Uranüs ve Neptün'ün keşif tarihleri (Herschel, Le Verrier/Galle), keşif görevleri (MESSENGER, BepiColombo, Magellan, Venera, Mars gezginleri, Galileo, Juno, Cassini, Voyager 2). Yalnız New Horizons (Plüton, 2015) kaynaklı olduğu için var. Bir sonraki turda bu maddeler araştırılıp derse eklenmeli.
2. Venüs ve Uranüs'ün JPL tablosundaki dönme süreleri eksi işaretli. İşaretin anlamı (ters yönde dönme) tablonun açıklamasından okunamadığı için derste yorumlanmadı; yalnız işaretin varlığı söylendi. Doğrulama ajanı JPL sayfasındaki dipnotu görürse "ters yönde döner" cümlesi eklenebilir.
3. Eski derste ayrı bölüm olan "Asteroit kuşağı ve Kuiper kuşağı" ile IAU kararı ayrıntıları (Prag, 9000 üye, 424 oy) kılavuzdaki sınır gereği d19'a bırakıldı; d9'da kısa özet ve "19. ders" yönlendirmesi kaldı. Çıkarılan doğrulanmış bilgiler: 424 oy/9000 üye, asteroit sayısı (1,1–1,9 milyon), Vesta 530 km, Kuiper'de 100 km'den büyük yüz binlerce cisim, Eris 2326 km, dürbünle Ceres/Vesta/Pallas. Bunlar d19 için kullanılabilir.
4. Asteroit kuşağının oluşumu: NASA yalnız Jüpiter'i anıyor; d19 ajanının kullandığı Wikipedia Asteroid belt maddesi "Mars ve Jüpiter'in çekim bozulmaları" diyor. d9'da NASA ifadesi kullanıldı.
5. "Venüs en parlak gezegen" cümlesi d1'in doğruladığı Venüs (−4,92) ve Jüpiter (−2,94) değerlerinin karşılaştırmasına dayanıyor; Mars'ın en parlak değeri bu oturumda görülmedi (bilinen en parlak Mars değerinin −2,94'ten sönük olduğu doğrulama ajanınca kontrol edilmeli).
6. Uydu sayıları Ekim 2026 itibarıyla; NASA sayfaları değiştikçe güncellenmeli.
7. Dünya atmosferi yüzdeleri NSSDCA'dan; "hacimce" ayrımı kaynak alıntısında görülmediği için derste belirtilmedi.
