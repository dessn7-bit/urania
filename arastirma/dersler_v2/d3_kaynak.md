# d3 — Kütleçekim ve Yörüngeler: kaynak listesi

Tarih: 2026-10-27. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
Kaynak türü: [Ö] = önceki doğrulama oturumunda (aynı gün) indirilip alıntısı birebir kontrol edilmiş, arastirma/dersler_1_4_dogrulama.md, dersler_9_11_dogrulama.md, sabitler.json ya da gezegenler.json içinde kayıtlı; [B] = bu oturumda WebFetch ile okundu (alıntılar WebFetch özet modelinin aktardığı metindir, bu yüzden doğrulama ajanı bir kez daha bakmalı); [H] = bu derste kaynak değerlerinden yapılan hesap.

## Bölüm 1 — Tycho ve Kepler

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Kepler 1600'de Graz'dan sürüldü | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "Kepler was banished from Graz on August 2nd, 1600." |
| [Ö] Brahe Mars görevini verdi | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "He set Kepler, the task of understanding the orbit of the planet Mars" |
| [Ö] Mars, Brahe verisi olanlar arasında en basık | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "its orbit was the most elliptical of the planets for which Brahe had extensive data." |
| [Ö] Brahe verisi daireye oturmadı | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "he could not reconcile Brahe's highly precise observations with a circular fit to Mars' orbit" |
| [Ö] Kopernik daire varsayıyordu (eski d3 metninden aynen korundu; önceki doğrulama dosyasında bu cümle için ayrı alıntı yok) | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | doğrulama ajanı maddede Kopernik ve dairesel yörüngeler cümlesini kontrol etmeli; bulunmazsa cümle "daire varsayımı" diye sadeleştirilmeli |
| [Ö] 1609 Astronomia nova, I. yasa | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "In Astronomia nova (1609), Kepler articulated his first law" |
| [Ö] II. yasanın bugünkü biçimi 1621 Epitome | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "He did that only in his Epitome Astronomiae Copernicanae of 1621." |
| [Ö] III. yasa 1619 Harmonice Mundi | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "Kepler's third law was published in 1619 in his Harmonice Mundi." |
| [H] "yarım yüzyıldan uzun süre sonra Newton": 1687 − 1621 = 66 yıl | — | hesap |

## Bölüm 2 — Birinci ve ikinci yasa

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Elips, Güneş'in merkezi bir odakta | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "each planet's orbit about the Sun is an ellipse. The Sun's center is always located at one focus of the orbital ellipse." |
| [Ö] Odaklara uzaklık toplamı sabit | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "The sum of the distances to the foci from any point on the ellipse is always a constant." |
| [Ö] Dış merkezlik 0 = daire | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "Each ellipse has an eccentricity with a value between zero, a circle, and one" |
| [Ö] Günberide en hızlı, günötede en yavaş | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "a planet is moving fastest when it is at perihelion and slowest at aphelion." |
| [Ö][B] Dünya e = 0,0167 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Orbit eccentricity 0.0167" |
| [Ö][B] Günberi 147,095, günöte 152,100 milyon km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Perihelion (106 km) 147.095" ; "Aphelion (106 km) 152.100" |
| [Ö][B] Hız 29,29–30,29 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Max. orbital velocity (km/s) 30.29" ; "Min. orbital velocity (km/s) 29.29" |
| [H] 152,100/147,095 = 1,0340; 30,29/29,29 = 1,0341 | — | hesap |
| Yasaların Ay, uydular, kuyrukluyıldızlar için de geçerli olması: Newton biçimi a³/T² = G(M+m)/4π² her iki cisimli yörüngeye uygulanır (bkz. Bölüm 5 kaynağı); Ay örneği Bölüm 5'te sayıyla gösterildi | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | Newton biçimi formülü (Bölüm 5) |

## Bölüm 3 — Üçüncü yasa

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Merkür 88, Dünya 365, Satürn 10.759 gün | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "Mercury, the innermost planet, takes only 88 days to orbit the Sun. The earth takes 365 days, while Saturn requires 10,759 days to do the same." |
| [Ö] Satürn a = 9,53707032 AB | https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html | "Semimajor axis (AU) 9.53707032" |
| [Ö] Satürn 10.755,699 gün; 29,447 yıl | https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html | "Sidereal orbit period (days) \| 10,755.699 \| 365.256 \| 29.447" |
| [H] 9,537³ = 867,4; √ = 29,45 | — | hesap |
| [H] Uzaklık ~25 kat (9,537/0,387 = 24,6), dönem ~122 kat (10.755,7/87,969) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html | Merkür: "Semimajor axis (10 6 km) \| 57.909" (0,387 AB), "Sidereal orbit period (days) \| 87.969" (dersler_9_11_dogrulama.md #9, #18) |
| [Ö] Mars a = 227,956 milyon km (= 1,5237 AB), dönem 686,980 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | "Semimajor axis (10 6 km) \| 227.956" ; "Sidereal orbit period (days) \| 686.980" ; gezegenler.json: "Semimajor axis (AU) 1.52366231" |
| [H] 1,524³ = 3,540; √ = 1,881 yıl; ×365,25 = 687 gün | — | hesap |
| [Ö] Dıştaki gezegen daha yavaş (yörünge hızları) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Orbital Velocity (km/s) \| 47.4 \| 35.0 \| 29.8 \| 1.0* \| 24.1 \| 13.1 \| 9.7 \| 6.8 \| 5.4" |

## Bölüm 4 — Newton

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Principia 5 Temmuz 1687 | https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation | "first published on 5 July 1687." |
| [Ö] Kepler'in sonuçlarını açıkladı | https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation | "In 1687, Newton published his Principia which combined his laws of motion with new mathematical analysis to explain Kepler's empirical results." |
| [Ö] Kütle çarpımıyla doğru, uzaklık karesiyle ters; küresel cisimler merkezde toplanmış gibi | https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation | "any particle attracts any other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers of mass. Separated, spherically symmetrical objects attract and are attracted as if all their mass were concentrated at their centers." |
| [Ö] Newton G'yi kullanmadı | https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation | "Newton did not use this constant or formula, he only discussed proportionality." |
| [Ö] Cavendish 1798 | https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation | "The first test of Newton's law of gravitation between masses in the laboratory was the Cavendish experiment conducted by the British scientist Henry Cavendish in 1798." |
| [Ö] G = 6,674 30 × 10⁻¹¹, belirsizlik 0,000 15 × 10⁻¹¹ | https://physics.nist.gov/cgi-bin/cuu/Value?bg | "6.674 30 x 10-11 m3 kg-1 s-2 Standard uncertainty 0.000 15 x 10-11" (sabitler.json) |
| [B] Güneş kütlesi 1,9884 × 10³⁰ kg | https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html | "Mass (1024 kg) \| 1,988,400." |
| [B] Ay kütlesi 0,07346 × 10²⁴ kg | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html | "Mass (1024 kg) \| 0.07346" |
| [B] Ay yarı büyük ekseni 0,3844 × 10⁶ km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html | "Semimajor axis (106 km) \| 0.3844" |
| [B] Dünya yarı büyük ekseni 149,598 × 10⁶ km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Semimajor axis (106 km) 149.598" |
| [H] Güneş/Ay çekim oranı: (1,9884e30/7,346e22) × (0,3844/149,598)² = 2,7068e7 × 6,603e-6 = 178,7 | — | hesap |

## Bölüm 5 — Newton biçimi, kütle ölçmek

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] T² = (4π²/GM) r³ | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "T^{2}=\left({\frac {4\pi ^{2}}{GM}}\right)r^{3}" |
| [Ö] a³/T² = G(M+m)/4π² ≈ 7,496 × 10⁻⁶ AB³/gün² | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "\approx 7.496\times 10^{-6}{\frac {{\text{AU}}^{3}}{{\text{days}}^{2}}}{\text{ is constant}}" |
| [Ö][H] Yıl/AB biriminde ≈ 1: 7,496e-6 × 365,25² = 1,00002 | — | hesap (dersler_1_4_dogrulama.md) |
| [B] Ay dönemi 27,3217 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html | "Revolution period (days) \| 27.3217" |
| [B] Dünya kütlesi 5,9722 × 10²⁴ kg | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Mass (1024 kg) 5.9722" |
| [H] Ay yörüngesinden M+m: 4π² × (3,844e8)³ / (6,6743e-11 × (2,360595e6)²) = 2,2423e27 / 371,92 = 6,029e24 kg; Dünya+Ay = 6,0457e24; fark %0,27 | — | hesap |
| [B] Dünya yıldızıl dönemi 365,256 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Sidereal orbit period (days) 365.256" (dersler_9_11_dogrulama.md #20) |
| [H] Güneş kütlesi: 4π² × (1,49598e11)³ / (6,6743e-11 × (3,15581e7)²) = 1,3217e35 / 6,647e4 = 1,988e30 kg | — | hesap |
| [Ö] JPL Güneş GM 1,32712440041279419 × 10²⁰ m³/s² | https://ssd.jpl.nasa.gov/astro_par.html | gezegenler.json çapraz kontrol: "GMsun_m3_s2": "1.32712440041279419 x 10^20" |

## Bölüm 6 — Yörünge hızı

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Newton'un top/taş düşünce deneyi; yüksek dağ; düşük hız düşer, yörünge hızında daire | https://en.wikipedia.org/wiki/Newton%27s_cannonball | "Newton visualizes a stone being projected from the top of a high mountain" ; "If the speed is low, it will simply fall back on Earth." ; "If the speed is the orbital speed at that altitude, it will go on circling around the Earth along a fixed circular orbit" |
| [B] 1728 İngilizce A Treatise of the System of the World | https://en.wikipedia.org/wiki/Newton%27s_cannonball | "an English translation was also published earlier in 1728 under the name A Treatise of the System of the World." |
| [Ö] v = √(GM/r) | https://en.wikipedia.org/wiki/Circular_orbit | "v={\sqrt {GM\! \over {r}}}" |
| [Ö][B] Dünya GM 0,39860 × 10⁶ km³/s²; R 6371 km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "GM (x 106 km3/s2) 0.39860" ; "Volumetric mean radius (km) 6371.000" |
| [H] √(398.600/6371) = 7,91 km/s | — | hesap |
| [Ö] ISS saniyede 5 mil, ~90 dk | https://www.nasa.gov/international-space-station/space-station-facts-and-figures/ | "traveling at a speed of five miles per second, orbiting Earth about every 90 minutes." |
| [Ö] ISS 24 saatte 16 tur | https://www.nasa.gov/international-space-station/space-station-facts-and-figures/ | "In 24 hours, the space station makes 16 orbits of Earth" |
| [H] Ay yörünge hızı: 2π × 384.400 / 2.360.595 = 1,023 km/s; √(398.600/384.400) = 1,018 km/s | — | hesap |
| [Ö] Merkür 47,4, Neptün 5,4 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Orbital Velocity (km/s) \| 47.4 \| ... \| 5.4" |

## Bölüm 7 — Kurtulma hızı

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] v_k = √(2GM/r) | https://en.wikipedia.org/wiki/Escape_velocity | "v_{\text{e}}={\sqrt {\frac {2GM}{r}}}" |
| [Ö] √2 × dairesel hız | https://en.wikipedia.org/wiki/Escape_velocity | "times the speed in a circular orbit at the same height" |
| [Ö] Yönden bağımsız | https://en.wikipedia.org/wiki/Escape_velocity | "it is more accurately described as a speed than as a velocity because it is independent of direction." |
| [Ö] Küçük cismin kütlesi ihmal | https://en.wikipedia.org/wiki/Escape_velocity | "For artificial satellites and small natural objects, the mass of the object makes a negligible contribution to the combined mass" |
| [Ö] Dünya 11,186 km/s (40.270 km/sa) | https://en.wikipedia.org/wiki/Escape_velocity | "the escape velocity from Earth is 11.186 km/s (40,270 km/h" |
| [Ö][B] Dünya 11,186 (NASA) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Escape velocity (km/s) 11.186" |
| [Ö][B] Güneş 617,6 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html | "Escape velocity (km/s) \| 617.6" |
| [B] Ay GM 0,00490 × 10⁶ km³/s², R 1737,4 km, kurtulma 2,38 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html | "GM (x 106 km3/s2) \| 0.00490" ; "Volumetric mean radius (km) \| 1737.4" ; "Escape velocity (km/s) \| 2.38" |
| [H] √(2 × 4900 / 1737,4) = 2,375; 11,19/2,38 = 4,7 | — | hesap |

## Bölüm 8 — Gelgitler

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Gelgit kuvveti = çekim farkı | https://en.wikipedia.org/wiki/Tidal_force | "the difference in gravitational attraction between different points in a gravitational field" |
| [B] Yakın yüz daha güçlü çekilir | https://en.wikipedia.org/wiki/Tidal_force | "because the near side of a body experiences a stronger attraction than the more distant far side" |
| [B] İki kabarıklık | https://oceanservice.noaa.gov/education/tutorial_tides/tides03_gravity.html | "In this way the combination of gravity and inertia create two bulges of water." (NOAA eylemsizlik diliyle anlatır; derste çekim farkı diliyle anlatıldı, bkz. Notlar) |
| [B] Ay günü 24 sa 50 dk; iki yüksek iki alçak | https://oceanservice.noaa.gov/education/tutorial_tides/tides05_lunarday.html | "a lunar day is 24 hours and 50 minutes." ; "coastal areas experience two high and two low tides every 24 hours and 50 minutes." |
| [B] Yükselmeler 12 sa 25 dk arayla | https://oceanservice.noaa.gov/education/tutorial_tides/tides05_lunarday.html | "High tides occur 12 hours and 25 minutes apart." |
| [B] Çapraz: M2 dönemi 12 sa 25,2 dk | https://en.wikipedia.org/wiki/Tide | "Its period is about 12 hours and 25.2 minutes" |
| [B] Gelgit ~ uzaklığın küpüyle ters | https://en.wikipedia.org/wiki/Tide | "the maximal tidal force varies inversely as, approximately, the cube of this distance." |
| [B] Küp (ikinci kaynak) | https://en.wikipedia.org/wiki/Tidal_force | "inversely proportional to the cube of the distance from another body" |
| [B] Güneş %46 | https://en.wikipedia.org/wiki/Tide | "it is only 46% as large as the lunar" |
| [B] AYRILIK: Tidal force maddesi ~%45 ve "yaklaşık yarısı" | https://en.wikipedia.org/wiki/Tidal_force | "the tide-raising force (acceleration) due to the Sun is about 45% of that due to the Moon" |
| [B] NOAA: yaklaşık yarısı | https://oceanservice.noaa.gov/education/tutorial_tides/tides06_variations.html | "Solar tides are about half as large as lunar tides" |
| [H] (2,7068e7) × (0,0025696)³ = 2,7068e7 × 1,6966e-8 = 0,459 | — | hesap (NSSDCA kütle ve uzaklıklarından) |
| [B] Büyük gelgit: yeni ay/dolunay, hizalanma | https://oceanservice.noaa.gov/education/tutorial_tides/tides06_variations.html | "When the sun, moon, and Earth are in alignment (at the time of the new or full moon)" ; "creating extra-high high tides, and very low, low tides—both commonly called spring tides." |
| [B] Küçük gelgit: bir hafta sonra dik açı | https://oceanservice.noaa.gov/education/tutorial_tides/tides06_variations.html | "One week later, when the sun and moon are at right angles to each other" ; "produces moderate tides known as neap tides." |
| [B] Her kameri ayda ikişer | https://oceanservice.noaa.gov/education/tutorial_tides/tides06_variations.html | "During each lunar month, two sets of spring tides and two sets of neap tides occur." |
| [B] Yakın noktada (perigee) ortalamanın üstü | https://oceanservice.noaa.gov/education/tutorial_tides/tides06_variations.html | "tide-generating forces are higher than usual, producing above-average ranges in the tides." |
| [B] Fundy Körfezi, Burntcoat Head 16,3 m | https://en.wikipedia.org/wiki/Tide | "recorded a maximum range of 16.3 metres (53 ft)" (Burntcoat Head, Bay of Fundy) |
| [B] Büyük göllerde 1–4 cm | https://en.wikipedia.org/wiki/Tide | "can experience tides of 1 to 4 cm (0.39 to 1.6 in)" |
| [B] Son 600 milyon yılda gün ~2 saat uzadı | https://en.wikipedia.org/wiki/Tide | "Day length has increased by about 2 hours in the last 600 million years." |
| [Ö] Sürtünme Dünya'nın dönüşünü yavaşlatır, Ay uzaklaşır | https://science.nasa.gov/moon/tidal-locking/ | "it creates friction that slows Earth's own rotation, and creates forces that change the Moon's orbital speed, causing it to fall farther away into space." |
| [Ö][B] Ay yılda 3,8 cm uzaklaşır | https://en.wikipedia.org/wiki/Tide | "3.8 centimetres (1.5 in)/year" (ayrıca NSSDCA "Recession rate from Earth (cm/yr) \| 3.8", dersler_9_11_dogrulama.md d10 #31) |
| [Ö] Eşzamanlı dönme gelgit kilitlenmesi | https://science.nasa.gov/moon/tidal-locking/ | "As the energy dissipated, the Moon's rotation slowed until a single spin on its axis took the same amount of time as one trip around Earth." |

## Bölüm 9 — Lagrange noktaları

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Çekim, merkezcil kuvveti tam sağlar; beş nokta | https://science.nasa.gov/mission/webb/orbit/ (arama sonucu adresi https://science.nasa.gov/?p=56052) | "At Lagrange points, the gravitational pull of two large masses precisely equals the centripetal force" ; "there are five solutions to this problem - and they are called the five Lagrange points." |
| [B] Euler ~1750 L1–L3 | https://en.wikipedia.org/wiki/Lagrange_point | "were discovered by the Swiss mathematician Leonhard Euler around 1750" |
| [B] Lagrange L4–L5; 1772 makalesi | https://en.wikipedia.org/wiki/Lagrange_point | Lagrange "discovered the remaining two (L4 and L5)"; 1772 makalesinde "he demonstrated two special constant-pattern solutions, the collinear and the equilateral." |
| [B] L1 ve L2 Dünya'dan ~1,5 milyon km | https://en.wikipedia.org/wiki/Lagrange_point | "The L1 and L2 Lagrange points are located about 1,500,000 km (930,000 mi) from Earth." |
| [B] L2 1,5 milyon km, Güneş'ten bakınca Dünya'nın arkasında | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | "L2 is located 1.5 million kilometres directly 'behind' the Earth as viewed from the Sun." |
| [B] L1 Güneş'e yolun yüzde biri | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | L1 "about a hundredth of the distance to the Sun" |
| [B] SOHO L1'de | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | "SOHO, the ESA/NASA solar watchdog is positioned there." |
| [B] DSCOVR Haziran 2015'ten beri L1 | https://en.wikipedia.org/wiki/Lagrange_point | "Since June 2015, DSCOVR has orbited the L1 point." |
| [B] Herschel, Planck, Gaia, JWST L2 | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | "making use of this region: Herschel, Planck, Gaia and the James Webb Space Telescope." |
| [B] Güneş rüzgârı L1'e ~1 saat önce ulaşır | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | WebFetch özeti: L1 "a good position from which to monitor the Sun"; güneş rüzgârı L1'e Dünya'dan yaklaşık bir saat önce ulaşır |
| [B] L2'de araç Dünya'nın gölgesine girmez, sıcaklık dalgalanması olmaz | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | WebFetch özeti: Dünya çevresinde dolanmadığı için gölgeden geçmez; gölge sıcaklık dalgalanmasına yol açardı |
| [B] Webb: Güneş, Dünya, Ay aynı yönde; güneşlik; çok soğukta çalışır | https://science.nasa.gov/mission/webb/orbit/ | "these bodies all have to be located in the same direction." (güneşliğin ışık ve ısıyı engellemesi bağlamında) |
| [B] Webb L2 çevresinde ~6 ayda bir tur; tam L2'de durmaz | https://science.nasa.gov/mission/webb/orbit/ | "Webb orbits around L2; it does not sit stationary precisely at L2." ; "This orbit (which takes Webb about 6 months to complete once)" |
| [B] Webb ~30 günde vardı | https://science.nasa.gov/mission/webb/orbit/ | "It took roughly 30 days for Webb to reach the start of its orbit at L2" |
| [B] L1–L3 yarı kararlı, düzenli motor ateşlemesi | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | "A spacecraft at L1, L2, or L3 is 'meta-stable', like a ball sitting on top of a hill." ; araçlar "use frequent rocket firings to stay in so-called 'halo orbits'" |
| [B] Çapraz: NASA küçük periyodik itki | https://science.nasa.gov/mission/webb/orbit/ | "L1, L2, and L3 are metastable so objects around these points slowly drift away" ; "maintain their positions, for example by using small periodic rocket thrust" |
| [B] L4/L5 kâsedeki top | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | "At L4 or L5, a spacecraft is truly stable, like a ball in a large bowl." |
| [B] L3 Güneş'in arkasında, Dünya'dan görülmez | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | "Objects in L3 cannot be seen from Earth." |
| [B] 25 kat koşulu | https://en.wikipedia.org/wiki/Lagrange_point | "stable provided that the mass of the primary body (e.g. the Earth) is at least 25 times the mass of the secondary body" |
| [B] Toz ve asteroitler L4/L5'te birikir | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | "objects such as dust and asteroids tend to accumulate in these regions" |
| [B] Jüpiter: bir milyondan fazla Truva | https://en.wikipedia.org/wiki/Lagrange_point | "Jupiter has more than one million of these trojans" |
| [B] Dünya Truvaları 2010 TK7, 2020 XL5 | https://en.wikipedia.org/wiki/Lagrange_point | "contain interplanetary dust and at least two asteroids, 2010 TK7 and 2020 XL5." |
| [Ö] Işık hızı 299.792.458 m/s | https://physics.nist.gov/cgi-bin/cuu/Value?c | "speed of light in vacuum Numerical value 299 792 458 m s-1" (sabitler.json) |
| [H] 1,5e9 / 2,998e8 = 5,0 s; 149,6/100 = 1,5 milyon km | — | hesap |
| [H] Soru 8: L4'ün Dünya'ya uzaklığı ≈ 1 AB (eşkenar üçgen çözümü) | https://en.wikipedia.org/wiki/Lagrange_point | "the collinear and the equilateral" (eşkenar üçgenden çıkarım; derste "yorum" diye işaretlendi) |

## Notlar

1. Kapsam: kılavuzdaki d3 sınırları izlendi (Kepler, Newton, yörünge ve kurtulma hızı, gelgitler, Lagrange kısaca). Gelgit kilitlenmesi ve Ay'ın uzaklaşması yalnız bir cümleyle anıldı, ayrıntı d10'a bırakıldı.
2. Gelgit anlatımı: NOAA iki kabarıklığı "çekim + eylemsizlik" diliyle açıklıyor. Derste, kılavuzdaki "benzetme fiziği yanlış anlatmasın" kuralı gereği, Wikipedia Tidal force maddesindeki "çekim farkı" anlatımı kullanıldı (yakın yüz daha çok, uzak yüz daha az çekilir). İki anlatım çelişmez; yalnız dil farkı.
3. Güneş/Ay gelgit oranı kaynaklarda %45, %46 ve "yaklaşık yarısı" diye geçiyor; derste %46 verildi ve NOAA'nın yuvarlaması belirtildi. Derste yapılan hesap da 0,46 veriyor.
4. Eski dersteki "F = G × m₁ × m₂ / r²" yazımı, sesli okumada alt simge karşılığı olmadığı için "F = G × M × m / r²" yapıldı. "AU" kısaltması kılavuz gereği "AB" yapıldı.
5. Eski dersten çıkarılan bir şey yok; tüm eski sayılar korundu. Yeni eklenenler: Newton'un top deneyi, Ay'dan Dünya kütlesi ve Dünya'dan Güneş kütlesi hesabı, Ay'ın yörünge hızı sağlaması, Ay kurtulma hızı, gelgitler, Lagrange noktaları.
6. İstanbul'a özgü gelgit bilgisi (Marmara, Boğaz) aranmadı; kaynaksız olduğu için derse konmadı. ISS'nin yüksekliği önceki oturumda NASA sayfasında bulunamamıştı, yine verilmedi.
7. Bu oturumda WebSearch kotası (bütün ajanlarla paylaşılan 200 arama) d3 araştırmasının sonunda doldu. Bu yüzden planlanan yerdurgun (jeostatik) yörünge örneği (35.786 km) kaynakla doğrulanamadı ve derse konmadı. Sonraki WebFetch'ler yalnız daha önce arama sonucunda görülen adreslere yapıldı.
8. Sözlükteki "büyük gelgit / küçük gelgit" Türkçe karşılıkları resmî terim olarak doğrulanmadı; bu yüzden İngilizce adları (spring tide, neap tide) parantezde verildi.
