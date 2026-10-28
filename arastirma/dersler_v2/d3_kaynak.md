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


Ek (ana oturum, 27.10.2026): yerdurgun yörünge paragrafı eklendi.
| Yerdurgun yörünge 35.786 km, merkezden 42.164 km, 1436 dk (bir yıldız günü), 3,07 km/s | https://en.wikipedia.org/wiki/Geostationary_orbit | "35,786 km (22,236 mi) in altitude above Earth's equator", "42,164 km (26,199 mi) in radius from Earth's center", "Period: 1436 minutes (one sidereal day)", "an orbital speed of 3.07 kilometres per second" |
| Çanak antenlerin sabit yöne bakması | ÇIKARIM | Uydu gökte sabit durduğu için anten yeniden yöneltilmez; doğrulama ajanı kontrol etsin |

## Doğrulama (bağımsız)

Tarih: 2026-10-27. Bağımsız doğrulama ajanı. Bütün çalışılmış örnekler ve soru hesapları python3 ile yeniden yapıldı (Dünya oranları 1,0340/1,0341; Satürn √867,4 = 29,45; Mars 1,8814 yıl = 687,2 gün; çekim oranı 178,7; Ay'dan M+m = 6,029e24 kg, fark %0,27; Güneş kütlesi 1,9884e30 kg; v = 7,91 km/s; Ay hızı 1,023 / 1,018 km/s; yerdurgun 2π × 42.164 / 86.160 s = 3,075 km/s; Ay kurtulma 2,375 km/s; gelgit oranı 0,459; L2 ışık süresi 5,00 s; soru cevapları 8 yıl, 1/9, 2 kat, 08.50). Hesap hatası bulunmadı.

| Kontrol / değişiklik | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| KAYNAK EKLENDİ: Kopernik daire varsayımı (ders cümlesi değişmedi) | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "the Copernican system incorrectly assumed the orbits of the planets to be circular." |
| Kopernik, ikinci kaynak | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "Kepler had believed in the Copernican model of the Solar System, which called for circular orbits" ; "The planetary orbit is a circle with epicycles." |
| KAYNAK EKLENDİ: Kepler Prag'da Brahe'nin yanına gitti | https://science.nasa.gov/resource/orbits-and-keplers-laws/ | "the young Kepler moved his family from Graz 300 miles across the Danube River to Brahe's home in Prague." |
| KAYNAK EKLENDİ: çanak antenler sabit yöne bakar (ÇIKARIM satırı artık kaynaklı) | https://en.wikipedia.org/wiki/Geostationary_orbit | "do not have to rotate to track them but can be pointed permanently at the position in the sky" ; "eliminates the need for ground stations to have movable antennas" |
| Yerdurgun değerler yeniden görüldü | https://en.wikipedia.org/wiki/Geostationary_orbit | "35,786 km (22,236 mi) in altitude above Earth's equator" ; "42,164 km" ; "1436 minutes (one sidereal day)" ; "3.07 kilometres per second" |
| DÜZELTME (Bölüm 6 örneği): "İstasyon daha yüksekte olduğu için biraz daha yavaş gitmesi gerekir; NASA'nın verdiği ≈ 8 km/s bununla uyumludur" mantık hatası: NASA'nın 5 mil/s = 8,05 km/s değeri 7,91'den BÜYÜK, yani "daha yavaş" iddiasını göstermez. Cümle "yuvarlak sayı aynı büyüklükte ama küçük farkı göstermeye yetmez" diye değiştirildi | https://www.nasa.gov/international-space-station/space-station-facts-and-figures/ | "five miles per second" ([H] 5 × 1,609 = 8,05 km/s) |
| [B] satırları yeniden açıldı ve doğrulandı: ESA L1 güneş rüzgârı ~1 saat, L2 gölge/ısınma-soğuma, L3 görülmez, meta-kararlı, kâse | https://www.esa.int/Science_Exploration/Space_Science/What_are_Lagrange_points | "the solar wind, reaches L1 about an hour before reaching Earth" ; "sweeping in and out of our planet's shadow, heating up and cooling down" |
| [B] Webb yörüngesi yeniden doğrulandı | https://science.nasa.gov/mission/webb/orbit/ | "orbits around L2; it does not sit stationary precisely at L2" ; "about 6 months" ; "roughly 30 days" ; "L1, L2, and L3 are metastable" |
| [B] Lagrange point maddesi yeniden doğrulandı (Euler ~1750, 1,5 milyon km, DSCOVR Haziran 2015, 25 kat, >1 milyon Truva, 2010 TK7 ve 2020 XL5) | https://en.wikipedia.org/wiki/Lagrange_point | "discovered by the Swiss mathematician Leonhard Euler around 1750" ; "Since June 2015, DSCOVR has orbited the L1 point." ; "Jupiter has more than one million of these trojans." |
| [B] Tide maddesi yeniden doğrulandı (%46, küp, 16,3 m, 1–4 cm, 600 milyon yılda 2 saat, 3,8 cm/yıl, 12 sa 25,2 dk) | https://en.wikipedia.org/wiki/Tide | "it is only 46% as large as the lunar" ; "recorded a maximum range of 16.3 metres" ; "Day length has increased by about 2 hours in the last 600 million years." |
| Kavram kontrolü: ikinci yasa örneğinde "uç noktalarda hız × uzaklık sabit" doğru (günberi ve günötede hız yarıçapa dik); "gelgit ∝ M/d³" doğru; kurtulma = √2 × dairesel doğru; L4 uzaklığı ≈ 1 AB (eşkenar üçgen) doğru | — | kavram denetimi, değişiklik yok |
| Askıda kalan yok. Not: "kuyrukluyıldız" yazımı d9'daki "kuyruklu yıldız"dan farklı; olgusal hata olmadığı için dokunulmadı | — | — |

## v3 genişletme (2026-10-28) — yeni satırlar

Kaynak türü: [W] = bu oturumda WebSearch sonucu ya da proje URL'si WebFetch ile okundu (alıntılar WebFetch özetinin aktardığı metindir); [P] = proje dosyasında daha önce doğrulanmış satır (dosya adı verildi); [H] = hesap (python3 ile yapıldı); ÇIKARIM = kaynak ifadesinden mantıkla çıkan, ayrı alıntısı olmayan cümle. Bu turda d3 için 9 WebSearch kullanıldı. EarthSky "jupiter-at-opposition" sayfası izin hatası verdi, yeniden denenmedi; Jüpiter karşı konum tarihi d18_kaynak.md'deki doğrulanmış satırlardan alındı.

### Bölüm 1 — Tycho ve Kepler (ek)
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Brahe'nin gözlemleri iki yay dakikası içinde doğru kabul edilirdi | https://keplersdiscovery.com/aVicariousHypothesis.html | "Tycho Brahe's observation were considered accurate to within two minutes of arc." |
| [W] İkinci kaynak: ±2 yay dakikası ya da daha iyi | https://arxiv.org/pdf/1610.05750 | "demonstably accurate to ±2′ or better" (K. Krisciunas, Texas A&M) |
| [W] Ptolemaios 10 yay dakikasının altına inmediğini söylüyordu | https://keplersdiscovery.com/aVicariousHypothesis.html | Ptolemy "professed not to go below 10'" |
| [W] Kepler'in modeli gözlemden en çok 8 yay dakikası saptı | https://keplersdiscovery.com/aVicariousHypothesis.html | "found that they differed at maximum by eight minutes from the observations." |
| [W] İkinci kaynak: 8 yay dakikalık sistematik fark | https://arxiv.org/pdf/1610.05750 | "systematic differences amounting to 8′ between the measured ecliptic longitudes of Mars" |
| [W] Kepler: sekiz dakika astronominin yeniden kurulmasına yol açacak | https://keplersdiscovery.com/aVicariousHypothesis.html | these eight minutes "will have led the way to the reformation of all of astronomy." |
| "Daireye dayanan, özenle ayarlanmış model" | https://keplersdiscovery.com/aVicariousHypothesis.html | sayfa başlığı "A Vicarious Hypothesis" (dairesel model); ayrıntı derste verilmedi |
| [P] Dolunay görünür çapı 1896 yay saniyesi | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html | Apparent diameter (seconds of arc) "1896" (d10_kaynak.md satır 135; NSSDCA'da "Mean values at opposition from Earth" başlığı altında) |
| [H] 1896/60 = 31,6′; 8/31,6 = 0,253; 2/31,6 = 0,063 | — | hesap |

### Bölüm 2 — Mevsim süreleri (ek)
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Mevsim süreleri 88,99 / 92,76 / 93,65 / 89,84 gün | https://earthsky.org/tonight/years-shortest-season-starts-with-december-solstice/ | "December solstice to March equinox: 88.99 days" ; "March equinox to June solstice: 92.76 days" ; "June solstice to September equinox: 93.65 days" ; "September equinox to December solstice: 89.84 days" |
| [W] Günberi ocak başında, Dünya o sırada en hızlı | https://earthsky.org/tonight/years-shortest-season-starts-with-december-solstice/ | "Because Earth reaches perihelion in early January, our planet moves most swiftly in its orbit around now." |
| [W] İkinci kaynak: kış ~89, yaz 93 gün; yakınken daha hızlı | https://stardate.org/podcast/2022-01-03 | "winter is only about 89 days long, compared to 93 days of summer" ; "When Earth is close to the Sun, it moves faster in its orbit than when it's farther away." |
| [H] 93,65 − 88,99 = 4,66; (92,76 + 93,65) − (89,84 + 88,99) = 7,58 gün | — | hesap |
| [P] Mevsimlerin nedeni eğiklik; günberi ocakta | https://spaceplace.nasa.gov/seasons/en | d1_kaynak.md: "Earth's tilted axis causes the seasons." ; "perihelion (when we are closest) occurs in January" |

### Bölüm 3 — Üçüncü yasa (ek paragraf)
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [P] Uranüs 1781, Neptün 1846 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html ; https://www.nasa.gov/history/175-years-ago-astronomers-discover-neptune-the-eighth-planet | d9_kaynak.md: "13 March 1781" ; "On the night of Sept. 23-24, 1846, astronomers discovered Neptune" |
| Üçüncü yasanın yayımlanmasından (1619) çok sonra | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | "Kepler's third law was published in 1619 in his Harmonice Mundi." ; [H] 1781 − 1619 = 162 yıl |
| [P] Neptün a = 30,06896348 AB (J2000) ; dönem 60.189,018 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html | d9_kaynak.md satır 246: "Semimajor axis (AU)" "30.06896348" ; "Sidereal orbit period (days) \| 60,189.018" |
| [H] 30,07³ = 27.190; √ = 164,9 yıl; 60.189/365,25 = 164,79 yıl; fark %0,06 | — | hesap |
| Gezegen kütlesinin formüle girmemesi | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | a³/T² = G(M+m)/4π² ve M + m ≈ M (Bölüm 5 satırları) |

### Yeni bölüm — Gökte geri giden gezegenler
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Mars yörüngesinde yön değiştirmez; geri görünmenin nedeni Dünya'nın hareketi | https://science.nasa.gov/image-article/apod-2018-november-8-mars-in-the-loop/ | "But Mars didn't actually reverse the direction of its orbit." ; WebFetch özeti: Dünya içteki yörüngede daha hızlı gittiği için dış gezegenleri "overtakes and laps" |
| [W] İlmek biçimi | https://science.nasa.gov/image-article/apod-2018-november-8-mars-in-the-loop/ | sayfa başlığı "Mars in the Loop" |
| [P] Dünya 29,8, Mars 24,1 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Orbital Velocity (km/s) \| 47.4 \| 35.0 \| 29.8 \| 1.0* \| 24.1 \| ..." |
| Otoyol benzetmesi; eğik düzlemler yüzünden ilmek | — | yazar benzetmesi; "eğik düzlemler" ÇIKARIM (yörünge eğiklikleri bu derste sayıyla verilmedi) |
| [P] Karşı konum: gezegen Güneş'in tam karşısında, en parlak | https://skyatnightmagazine.com/advice/skills/mars-opposition | d18_kaynak.md (karşı konum tanımı ve 2027 tarihi) |
| Güneş batarken doğar, bütün gece görünür | — | ÇIKARIM: Güneş'in tam karşısındaki (180°) cisim, Güneş ufkun altına inerken ufkun üstüne çıkar |
| Geri hareket karşı konum çevresinde | https://science.nasa.gov/image-article/apod-2018-november-8-mars-in-the-loop/ | WebFetch özeti: 2018 geri hareketi 27 Temmuz karşı konumu çevresinde; sollama anı = karşı konum ÇIKARIM |
| [W] Mars sinodik dönemi 779,94 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | "Synodic period (days) \| 779.94" |
| [W] Jüpiter sinodik dönemi 398,88 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html | "Synodic period (days) \| 398.88" |
| [P] Jüpiter karşı konumu 11 Şubat 2027 (EarthSky), 10 Şubat (Cambridge); Aslan | https://www.cambridge.org/turnleft/pages/the_planets/jupiter_and_saturn_2027 | d18_kaynak.md: EarthSky "February 11, 2027", "Leo" ; Cambridge "February 10", "in Leo" |
| [P] Mars karşı konumu 19 Şubat 2027, Aslan, −1,2 | https://skyatnightmagazine.com/advice/skills/mars-opposition | d18_kaynak.md: "reaches opposition on 19 February 2027" ; nakedeyeplanets.com: "February 19", "Leo", "-1.2" |
| İkisi de çıplak gözle kolay görülür | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html | Jüpiter en çok −2,94; Mars 2027'de −1,2 (yukarıdaki satır); ikisi de kolay görülen parlaklıkta (d1 kadir ölçeği) |
| Ocaktan nisana çizim önerisi | — | yazar gözlem önerisi; geri hareketin tam başlangıç/bitiş tarihleri kaynakla bulunmadığı için verilmedi |
| [H] 1/365,256 − 1/686,980 = 0,0012822; 1/0,0012822 = 779,93 gün = 2,135 yıl | — | hesap |
| [H] Soru: 1 − 1/4 = 0,75; S = 1,333 yıl = 487 gün | — | hesap |

### Bölüm 4 — Newton (ek paragraf)
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [H] 6,674e-11 × 70 × 70 / 1 = 3,27e-7 N; 70 × 9,80 = 686 N; oran 2,1e9 | https://physics.nist.gov/cgi-bin/cuu/Value?bg | G değeri (Bölüm 4 satırı); 9,80 m/s² JPL ekvator çekimi (d9_kaynak.md Earth satırı) |
| Her kütle her kütleyi çeker, katkılar toplanır | https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation | "any particle attracts any other particle" (Bölüm 4 satırı); "toplanır" ÇIKARIM |

### Yeni bölüm — Ay testi
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Conduitt'in aktarımı: "Ay'ın yüksekliğine kadar neden olmasın" | https://pwg.gsfc.nasa.gov/stargaze/Sgravity.htm | "Why not as high as the Moon thought he to himself" (David P. Stern) |
| [W] Ay ~60 Dünya yarıçapı; çekim 3600 kat zayıf | https://pwg.gsfc.nasa.gov/stargaze/Sgravity.htm | "The distance R to the Moon is then about 60 RE" ; "3600 times weaker" |
| [W] İkinci kaynak: 60 kat, 1/3600 | https://vikdhillon.staff.shef.ac.uk/teaching/phy105/celsphere/phy105_gravitation.html | "Newton knew that the radius of the Moon's orbit was about 60 times the radius of the Earth." ; "he would have predicted a ratio of 1/3600." |
| [W] Newton 23 yaşında; Ay saniyede 1,3 mm düşer | https://vikdhillon.staff.shef.ac.uk/teaching/phy105/celsphere/phy105_gravitation.html | "Newton, at the age of 23, came to think about the motion of the Moon." ; "in 1 second the Moon falls vertically towards the Earth by 1.3 mm." |
| a = 4π² r / T² | https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion | [H] T² = (4π²/GM) r³ (Bölüm 5 satırı) → GM/r² = 4π² r / T² |
| [P] Yerdeki çekim 9,80 m/s² | https://ssd.jpl.nasa.gov/planets/phys_par.html | d9_kaynak.md: Earth satırı ekvator çekimi 9.80 |
| [H] a = 39,478 × 3,844e8 / (2,36059e6)² = 0,0027233 m/s²; ½at² = 1,36 mm; 9,80/0,0027233 = 3599; ½ × 9,80 = 4,9 m | — | hesap |
| [H] 384.400/6371 = 60,34; 60,34² = 3640; 9,80/3640 = 0,002692 (ölçülenden %1,1 küçük); GM_D(1 + 0,07346/5,9722)/r² = 0,002731 (fark %0,3) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | GM 0,39860 × 10⁶ km³/s² (Bölüm 6 satırı); kütleler Bölüm 4–5 satırları |

### Yeni bölüm — Jüpiter'in uyduları
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [P] 1610, Galileo ve Marius bağımsız; adlar | https://www.nasa.gov/wp-content/uploads/2009/12/moons_of_jupiter_lithograph.pdf | d9_kaynak.md: "1610 — Galileo Galilei and Simon Marius independently discover four moons orbiting Jupiter." |
| [W] Dünya dışında bir gezegeni dolandığı bulunan ilk cisimler; Ptolemaios düzenine darbe | https://en.wikipedia.org/wiki/Galilean_moons | "the first objects to be found to orbit any planet beyond Earth" ; "dealt a serious blow to the then-accepted (among educated Europeans) Ptolemaic world system" |
| [W] Işık kirliliğinde bile sıradan dürbünle | https://en.wikipedia.org/wiki/Galilean_moons | "readily seen with common binoculars, even under night sky conditions of high light pollution" |
| [W] Karşı konumda 4,6–5,6 kadir | https://en.wikipedia.org/wiki/Galilean_moons | "They have apparent magnitudes between 4.6 and 5.6 when Jupiter is in opposition with the Sun." |
| [W] En çok 2–10 yay dakikası açılırlar | https://en.wikipedia.org/wiki/Galilean_moons | "The maximum angular separations of the moons are between 2 and 10 arcminutes from Jupiter." |
| [W] (doğrulamada düzeltildi) Yörüngeler: Io 421.800 km 1,769138 g; Europa 671.100 km 3,551181 g; Ganymede 1.070.400 km 7,154553 g; Callisto 1.882.700 km 16,689017 g | https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html | tablo "Semi-major axis (10^3 km)" 421.8 / 671.1 / 1070.4 / 1882.7 ; "Orbital Period (days)" 1.769138 / 3.551181 / 7.154553 / 16.689017. İkinci kaynak https://en.wikipedia.org/wiki/Galilean_moons tablosu: 1.769 / 3.551 / 7.155 / 16.689. Not: önceki satırdaki JPL sep.html "P (days)" sütunu (Io 1,762732, Europa 3,525463) yerel Laplace düzlemine göre ortalama öğelerden gelir ve yıldızıl dolanım dönemi değildir; Io ve Europa için iki kaynakla çelişti, kullanılmadı |
| [W] İkinci kaynak (yuvarlak): 422/671/1070/1883 bin km; 1,8/3,6/7,2/16,7 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/galileanfact_table.html | "Orbital Distance (10^3 km) 422 671 1070 1883" ; "Orbital Period (days) 1.8 3.6 7.2 16.7" |
| [H] (doğrulamada düzeltildi) 1.882.700/421.800 = 4,463; 16,689017/1,769138 = 9,433; 4,463^1,5 = 9,430; a³/T² (10¹⁵ km³/gün²): 23,98 / 23,97 / 23,96 / 23,96 → en çok %0,07 fark | — | hesap (NSSDCA yıldızıl dönemleriyle) |
| [H] Callisto'dan Jüpiter kütlesi (T = 16,689017 gün = 1,441931e6 s): 4π² × (1,8827e9)³ / (6,674e-11 × (1,441931e6)²) = 2,6345e29 / 138,76 = 1,8986e27 kg | — | hesap |
| [W] Jüpiter kütlesi 1898,13 × 10²⁴ kg; Dünya'nın 317,83 katı | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html | "Mass (1024 kg) \| 1,898.13 \| 5.9722 \| 317.83" |
| [W] Callisto kütlesi 107,6 × 10²¹ kg (ihmal edilebilir: Jüpiter'in %0,006'sı) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/galileanfact_table.html | "Mass (10^21 kg) … 107.6" |
| Dolunay çapının üçte biri (10′ / 31,6′) | — | [H] 10/31,6 = 0,32 |
| Jüpiter 10–11 Şubat 2027 civarında karşı konumda ("Şubat başında" düzeltildi) | https://www.cambridge.org/turnleft/pages/the_planets/jupiter_and_saturn_2027 | "Jupiter is at opposition on February 10." ; "In 2027, Jupiter is in Leo." (bu doğrulamada yeniden açıldı) |

### Yörünge (bölüm adı aynı) ve yeni bölüm — Uzay istasyonu
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] İstasyon 200–250 mil yükseklikte; orada çekim ~%90 | https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-grades-5-8/ | "The International Space Station orbits Earth at an altitude between 200 and 250 miles." ; "At that altitude, Earth's gravity is about 90 percent of what it is on the planet's surface." |
| [W] Serbest düşüş; birlikte düştükleri için süzülürler | https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-grades-5-8/ | "The answer is because they are in free fall." ; "Since they are all falling together, the crew and objects appear to float when compared with the spacecraft." |
| [H] 200 mil = 322 km; 250 mil = 402 km | — | 1 mil = 1,609 km |
| [P] Heavens-Above, 27 Ekim 2026: yörünge 415 × 424 km, 51,6° | https://www.heavens-above.com/PassSummary.aspx?satid=25544&lat=41.0046&lng=29.0762&loc=Fetih&alt=0&tz=UCTm3 | proje dosyası arastirma/heavens_above/ha_iss_passsummary.html: "Orbit: 415 x 424 km, 51.6° (Epoch: 27 October)" ; ha_satinfo_25544.html: "Orbit 415 x 424 km, 51.6°" |
| [P] Fetih için 27 Ekim–5 Kasım 2026: 14 görünür sabah geçişi, en parlak −3,7 | aynı | ha_iss_passsummary.html tablo: 27 Oct −1.4 … 2 Nov −3.7 … 5 Nov −0.9 (14 satır, saatler 05:20–07:04) |
| [P] İstasyon ~8 km/s (5 mil/s), ~90 dk | https://www.nasa.gov/international-space-station/space-station-facts-and-figures/ | "five miles per second, orbiting Earth about every 90 minutes." |
| [P] Spot the Station: gün doğumu/batımından önce-sonra birkaç saat; uçak ya da çok parlak yıldız gibi; yanıp sönmez, yön değiştirmez, uçaktan hızlı | https://www.nasa.gov/spot-the-station/ | "All International Space Station sightings will occur within a few hours before or after sunrise or sunset." ; "an airplane or a very bright star moving across the night sky" ; "does not have flashing lights or change direction" ; "moves faster than a typical airplane" (bu oturumda yeniden okundu; ayrıca gorevler_kaynak.md) |
| 51,6° eğik yörünge ±51,6° enlemleri arasında geçer; 41° içeride | — | ÇIKARIM (yörünge eğikliği = yer izinin ulaştığı en yüksek enlem); Heavens-Above'ın Fetih için görünür geçiş listelemesi bunu doğrular |
| Mikro çekim adı | https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-grades-5-8/ | sayfa başlığı "What Is Microgravity?" |
| Asansör düşünce deneyi | — | yazar benzetmesi (serbest düşüş tanımından) |
| [P] Jüpiter en parlak −2,94 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html | "Maximum apparent visual magnitude -2.94" (bu oturumda okundu) |
| [H] r = 6791 km; (6371/6791)² = 0,880; T = 2π √(6791³/398.600) = 5569 s = 92,8 dk | — | hesap |

### Bölüm 7 — Kurtulma hızı (ek)
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Roketler kurtulma hızına tek hamlede ulaşmak zorunda değil; itki süren araç her hızla kaçabilir | https://en.wikipedia.org/wiki/Escape_velocity | "Rockets do not have to reach escape velocity in a single maneuver" ; "can attain escape at any non-zero speed" |
| [W] Formül balistik (itkisiz) yörünge için | https://en.wikipedia.org/wiki/Escape_velocity | "Ballistic trajectory– no other forces are acting on the object, such as propulsion and friction" |
| [W] Ekvatordan doğuya 10,735 km/s; üsler ekvatora yakın | https://en.wikipedia.org/wiki/Escape_velocity | "a rocket launched tangentially from the Earth's equator to the east requires an initial velocity of about 10.735 km/s" ; "space launch facilities are often located as close to the equator as feasible." |
| [H] 11,186 − 10,735 = 0,451; ekvator dönüş hızı 2π × 6378,137 / 86.164,1 s = 0,465 km/s; İstanbul (41°) 0,465 × cos 41° = 0,351 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | ekvator yarıçapı 6378,137 km ve yıldızıl dönme 23,9345 sa (NSSDCA; d9_kaynak.md) |
| [W] Dünya uzaklığında Güneş'ten kurtulma 42,1 km/s | https://en.wikipedia.org/wiki/Escape_velocity | tablo satırı "At Earth \| The Sun's gravity \| 42.1" |
| [H] √2 × 29,78 = 42,1; 42,1 − 29,8 = 12,3 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | Dünya yörünge hızı 29,8 km/s |

### Bölüm 8 — Gelgitler (ek)
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [W] Akdeniz ve Baltık'ın salınım dönemleri astronomik zorlamayla çakışmaz; en büyük gelgit dar geçitlerin yakınında | https://en.wikipedia.org/wiki/Tide | "the oscillation modes of the Mediterranean Sea and the Baltic Sea do not coincide with any significant astronomical forcing period" ; "the largest tides are close to their narrow connections with the Atlantic Ocean." |
| [W] Türk Boğazlar Sistemi düşük gelgitli | https://dergipark.org.tr/en/download/article-file/103910 | "the area is one of low tidal amplitude." (Alpar ve Yüce 1997, Turkish Journal of Marine Sciences 3, 11–22) |
| [W] Karadeniz genlik 3–9 cm | https://dergipark.org.tr/en/download/article-file/103910 | "Tidal amplitudes are very small (3-9 cm)" |
| [W] Marmara'da günlük bileşenler baskın | https://dergipark.org.tr/en/download/article-file/103910 | "Diurnal constituents are more dominant in the Sea of Marmara" |
| [W] En büyük: Gökçeada ortalama büyük gelgit aralığı 23,0 cm | https://dergipark.org.tr/en/download/article-file/103910 | Tablo 2 (WebFetch özeti): Gökçeada "mean spring range of 23.0 cm" |
| [W] Aynı çalışmanın özet sayfası: gelgit genliği küçük | https://blackmeditjournal.org/volumes-archive/vol3-1997/vol-3-1997-no-1/short-and-tidal-period-sea-level-variations-along-the-turkish-strait-system/ | "Tidal oscillations are small in amplitude and tidal regimes change along the Turkish Strait System." |
| [H] 1630 / 23 = 70,9 | — | hesap (16,3 m Bölüm 8 satırı) |
| [W] Yer gelgiti santimetreler; ekvatorda ~55 cm, ~15 cm Güneş'ten | https://en.wikipedia.org/wiki/Tide | "these forces produce periodic vertical displacements of centimeters, a phenomenon known as Earth tide." ; "terrestrial tides' semi-diurnal amplitude can reach about 55 centimetres (22 in) at the Equator" ; "15 centimetres (5.9 in) due to the Sun" |
| İstanbul yer gelgiti değeri | — | BULUNAMADI; derste açıkça söylendi |
| Not: makalede Boğaz için "diurnal" ve "mixed, but mainly semi-diurnal" ifadeleri birlikte geçiyor (iki farklı bölüm); bu yüzden derste Boğaz rejimi verilmedi, yalnız Marmara cümlesi kullanıldı | — | — |

### Yeni bölüm — Merkür'ün günberi kayması
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [P] Le Verrier Neptün'ün yerini hesapladı; Galle ilk gecede buldu (1846) | https://www.nasa.gov/sites/default/files/files/Neptune_Lithograph_h.pdf | d9_kaynak.md: "Le Verrier sent his predictions to Johann Gottfried Galle" ; "found Neptune on his first night of searching in 1846." |
| [W] Le Verrier 1859: ~574 yay saniyesi/yüzyıl | https://serviastro.ub.edu/sites/serviastro/files/2019-10/mercurivulcaneng.pdf | "Le Verrier showed in 1859 that the orbit of Mercury rotates with a rate of approximately 574 arcsecs per century." (C. Pantelidou, ICCUB) |
| [W] İkinci kaynak 574; Newton 531; artık 43 | https://www.eftaylor.com/exploringblackholes/Ch10AdvanceOfMercurysPerihelion200331v1.pdf | "the perihelion of Mercury precesses at the rate of 574 arcseconds (0.159 degree) per Earth-century" ; "Newton's mechanics accounts for 531 seconds of arc of this advance" ; "a stubborn 43 arcseconds" |
| [W] Diğer gezegenler 531'i açıklar; 43 açık | https://serviastro.ub.edu/sites/serviastro/files/2019-10/mercurivulcaneng.pdf | "all the corrections due to the other planets could only account for 531 arcsecs per century" ; "leaving a deficit of 43 arcsec." |
| [W] Üçüncü kaynak: Le Verrier 1859; 43″ artık | https://arxiv.org/pdf/1705.04397 | "it was viewed by Le Verrier in 1859" ; "leaving a residual of 43” century-1" |
| [W] Vulkan önerildi, bulunamadı | https://serviastro.ub.edu/sites/serviastro/files/2019-10/mercurivulcaneng.pdf | "there exists another planet, called Vulcan" ; "astronomers searched for Vulcan but with no success." |
| [W] Einstein 1915 doğru değeri türetti | https://arxiv.org/pdf/1705.04397 | "In 1915 Einstein derived the correct value of the precession of the perihelion of Mercury" |
| AYRILIK: Pantelidou 1916 der | https://serviastro.ub.edu/sites/serviastro/files/2019-10/mercurivulcaneng.pdf | "It was only in 1916 when Einstein's theory of General Relativity (GR) correctly accounted for this deficit." (derste iki tarih de belirtildi) |
| [W] JPL hesabı: Merkür 42,980 ± 0,001; Venüs 8,618; Dünya 3,846; Mars 1,351 ″/yüzyıl | https://www.eftaylor.com/exploringblackholes/Ch10AdvanceOfMercurysPerihelion200331v1.pdf | Table 10.1: "Mercury 42.980 ± 0.001" ; "Venus 8.618 ± 0.041" ; "Earth 3.846 ± 0.012" ; "Mars 1.351 ± 0.001" |
| Elips yörüngenin dönmesi = günberinin ilerlemesi | https://serviastro.ub.edu/sites/serviastro/files/2019-10/mercurivulcaneng.pdf | "the orbit of Mercury rotates" |
| [H] 3600/43 = 83,7 yüzyıl; 360 × 3600/574 = 2258 yüzyıl; 8 × 60 = 480; 480/43 = 11,2 | — | hesap |
| [P] Uranüs düzensizlikleri | https://www.nasa.gov/history/175-years-ago-astronomers-discover-neptune-the-eighth-planet | d9_kaynak.md: "noticed irregularities in its orbit that Newton's law of universal gravitation could not fully explain" |

## Bağımsız doğrulama (v3, 28 Ekim 2026)

Yeni/değişen metin veri/dersler.json'daki yayındaki sürümle karşılaştırılarak çıkarıldı. Yeniden açılan sayfalar (WebFetch): keplersdiscovery, Krisciunas arXiv, EarthSky mevsimler, StarDate, APOD Mars in the Loop, NASA Mars/Jupiter/Neptune fact sheet, Sky at Night, Cambridge Turn Left, nakedeyeplanets, Stern (NASA Goddard), Dhillon, JPL sep.html, NSSDCA Jovian satellite fact sheet, Galilean moons, NASA microgravity, Spot the Station, Escape velocity, Tide, Alpar ve Yüce 1997 (DergiPark PDF), Pantelidou PDF, Bertschinger ve Taylor PDF, arXiv 1705.04397. Heavens-Above verisi proje dosyasından (arastirma/heavens_above/ha_iss_passsummary.html) yeniden okundu. WebSearch: 0.

| Ne yanlıştı | Ne yapıldı | Kaynak |
|---|---|---|
| Galileo uyduları dönemleri JPL'nin Laplace düzlemi ortalama öğe tablosundan alınmış: Io 1,76, Europa 3,53 gün; gerçek dolanım dönemleri 1,769 ve 3,551 gün. Buna bağlı olarak "dönemi 9,47 kat uzun" ve "a³/T² en çok %1,5 farklı" da yanlıştı | Io 1,77, Europa 3,55, Ganymede 7,15 gün; oran 9,43 kat; a³/T² "binde birden az farklı"; kaynak NASA NSSDCA Jovian Satellite Fact Sheet; Callisto örneği 16,689 gün ile yeniden hesaplandı (sonuç yine 1,898 × 10²⁷ kg); anahtar sayı ve kaynak listesi güncellendi | https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html ; https://en.wikipedia.org/wiki/Galilean_moons |
| "Le Verrier 1859'da bu kaymanın yüzyılda yaklaşık 574 yay saniyesi olduğunu gösterdi ... 43 artık kaldı": 574/531/43 bugünkü değerlerdir; Le Verrier'in 1859'daki artığı 39″/yüzyıldı, 43'ü Newcomb 1882'de buldu (Pantelidou'nun cümlesi bu ayrımı yapmıyor) | Paragraf yeniden yazıldı: 574/531/43 Bertschinger ve Taylor'a göre bugünkü değerler; Le Verrier 1859'da artığı fark etti (39″), 43'e 1882'de Newcomb ulaştı | arXiv 1705.04397: Le Verrier "found the residual of 39″ century-1" ; Newcomb 1882 "leaving a residual of 43″ century-1" ; Bertschinger ve Taylor: artık "(though not its modern value) was computed from observations by Urbain Le Verrier as early as 1859" |
| "Jüpiter Şubat 2027 başında karşı konumda" (aynı derste tarih 10–11 Şubat) | "10–11 Şubat 2027 civarında" | Cambridge Turn Left "February 10" |
| "Ptolemaios düzenine ağır bir darbe": güncel Wikipedia "dealt a blow" diyor | "bir darbe" | https://en.wikipedia.org/wiki/Galilean_moons |
| "Fundy Körfezi'ndeki 16,3 metre ... 70 katı": 16,3 m ölçülmüş en büyük aralık, Gökçeada'nınki ortalama büyük gelgit aralığı (farklı nicelikler) | "Fundy Körfezi'nde ölçülen en büyük fark olan 16,3 metre" | Wikipedia Tide: "recorded a maximum range of 16.3 metres" |

Yeniden açılıp doğru bulunanlar: Brahe 2′ ve Ptolemaios 10′, Kepler 8′ ve "reformation of all of astronomy", Krisciunas ±2′ (Texas A&M); mevsimler 88,99/92,76/93,65/89,84, StarDate 89/93; Mars yön değiştirmez, Dünya "overtakes and laps"; Mars sinodik 779,94, 686,980 gün, 24,08 km/s; Jüpiter sinodik 398,88, 1898,13 × 10²⁴ kg, 317,83, −2,94; Neptün 30,06896348 AB, 60.189,018 gün; Mars karşı konumu 19 Şubat 2027, Aslan, −1,2; Jüpiter 10 Şubat, Aslan; Conduitt ("Why not as high as the Moon"), 60 R, 3600; Dhillon 23 yaş, 1,3 mm; Galileo ve Marius 1610, ilk uydular, dürbün ve ışık kirliliği, 4,6–5,6 kadir, 2–10′; ISS 200–250 mil, ≈%90, serbest düşüş; Heavens-Above 415 × 424 km, 51,6°, 27 Ekim–5 Kasım 14 görünür geçiş, en parlak −3,7; Spot the Station cümleleri; kurtulma hızı tek hamle şart değil, "any non-zero speed", 10,735 ve 11,186 km/s, ekvatora yakın üsler, 42,1 km/s; Akdeniz/Baltık salınımı, yer gelgiti 55 cm ve 15 cm; Alpar ve Yüce: düşük gelgit, Karadeniz 3–9 cm, Marmara'da günlük bileşenler, Gökçeada 23,0 cm en büyük (İstanbul istasyonları 2,0–3,7 cm); Bertschinger ve Taylor tablo 10.1 (42,980 ± 0,001; 8,618; 3,846; 1,351); Einstein 1915 (arXiv), Pantelidou 1916; Vulkan bulunamadı.

Python3 ile yeniden hesaplananlar (doğru): 8/31,6 = 0,25; 2/31,6 = 0,063; 7,58 gün; Neptün 164,9 / 164,8 yıl; sinodik 779,93 gün = 2,135 yıl; asteroit 487 gün; 3,27 × 10⁻⁷ N, oran 2,1 × 10⁹; Ay ivmesi 0,002723 m/s², 1,36 mm, 3599; 60,34 → %1,1 küçük; ISS %88, 92,8 dk; İstanbul dönüş hızı 0,351 km/s; √2 × 29,78 = 42,1; 3600/43 = 83,7; 2258 yüzyıl; 480/43 = 11,2; 1630/23 = 70,9.

Askıda: yok.
