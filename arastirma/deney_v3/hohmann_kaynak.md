# hohmann — kaynak tablosu (erişim 30 Ekim 2026)

Hesaplar python3 ile yeniden yapıldı (scratchpad/hohmann.py). GM☉ = 1,3271244 × 10²⁰ m³/s² (IAU 2015 B3, veri/fizik.json).

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Venüs a = 108,210 milyon km, dönem 224,701 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html | "Semimajor axis (10^6 km) 108.210" ; "Sidereal orbit period (days) 224.701" (arastirma/gezegenler.json, erişim 2026-10-27) |
| Dünya a = 149,598 milyon km, dönem 365,256 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Semimajor axis (10^6 km) 149.598" ; "Sidereal orbit period (days) 365.256" |
| Mars a = 227,956 milyon km, dönem 686,980 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | "Semimajor axis (10^6 km) 227.956" ; "Sidereal orbit period (days) 686.980" |
| Jüpiter a = 778,479 milyon km, dönem 4332,589 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html | "Semimajor axis (10^6 km) 778.479" ; "Sidereal orbit period (days) 4,332.589" |
| Mars yolculuğu ≈ 259 gün (8,5 ay); a = 1,262 AB | ders 23 (veri/dersler.json) | "1,418 / 2 ≈ 0,709 yıl × 365,256 ≈ 259 gün … 8,5 ay" (hesap: 258,88 gün; 258,9/30,44 = 8,5 ay) |
| Mars kalkışta ≈ 44° önde; 259 günde ≈ 136° ilerler | cizim_v3.js d23-hohmann; arastirma/cizim_v3_kaynak.md | "kalkışta önde 180 − 136 ≈ 44°" (hesap: 180 − 360·258,88/686,98 = 44,34°) |
| Venüs 146,1 gün, 54,0° geride; Jüpiter 997,7 gün (2,73 yıl), 97,1° önde | hesap | aynı formüller, NASA dönemleriyle |
| Sinodik dönem Mars 779,935 gün | https://ntrs.nasa.gov/citations/20100037210 | NASA/TM-2010-216764: "for Mars with respect to the Earth is 779.935 Earth days (approximately 2.14 years)" (hesap: 779,93; ders 3/23: 779,94) |
| En ucuz kalkış tarihleri her sinodik dönemde yinelenir | aynı | "Optimal launch dates for minimum departure energy conjunction class missions reoccur every synodic period." |
| Venüs sinodik 583,9 gün (19,2 ay); Jüpiter 398,9 gün | hesap; ders 23, ders 3 | ders 23: "Venüs'e yaklaşık 19 ayda bir"; ders 3: "Jüpiter … 398,88 gün" |
| Pencere aralığı ≈ 25,6 ay | ders 23 | "779,94 gün, yani yaklaşık 25,6 ay" |
| Güneş'e göre Δv: Mars +2,95 / varış 2,65; Venüs −2,50 / 2,71; Jüpiter +8,79 / 5,64 km/s | hesap (vis-viva) ; sağlama https://en.wikipedia.org/wiki/Hohmann_transfer_orbit | Wikipedia tablosu "Earth's orbit": Venus 2.532, Mars 2.929, Jupiter 8.792 (yuvarlanmış 0,72 / 1,52 / 5,2 AB ile; Venüs farkı %1,5) |
| Alçak yörüngeden (300 km) ateşleme Mars 3,59, Jüpiter 6,30 km/s | Wikipedia Hohmann tablosu "LEO" | "Mars … 3.590", "Jupiter … 6.301" (hesap 3,592 ve 6,300; GM⊕ IAU, R⊕ 6371 km) |
| Yalnız kurtulma 300 km'den 3,20 km/s | hesap; sağlama https://en.wikipedia.org/wiki/Delta-v_budget | √(2GM/r) − √(GM/r) = 3,20; Wikipedia matrisi: "LEO-Ken → C3=0 3.22" |
| Ders 23'teki tipik 4,3 km/s en küçük değer değil | https://en.wikipedia.org/wiki/Delta-v_budget | "LEO → Mars transfer orbit 4.3" (typical, not minimal) |
| Dünya'nın yörünge hızı 29,8 km/s | hesap | √(GM☉/1 AB'lik yarıçap) = 29,79 km/s |
| 30 gün gecikme: 13,8°, 55,0 milyon km (0,37 AB) | hesap | (360/686,98 − 360/365,256)·30 = −13,85°; 2·227,956·sin(6,92°) |
| Dünya günde 0,99°, Mars 0,52° döner | hesap | 360/365,256 = 0,986; 360/686,98 = 0,524 |
| 2026 fırsatı: kalkış 31 Ekim 2026, varış 19 Ağustos 2027, C3 9,144, tip II | https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/20100037210.pdf | Tablo 2: "Type 2 10/31/26 8/19/27 9.144"; Tablo 1: "2026 9.144 II" |
| 2028 fırsatı: kalkış 2 Aralık 2028, varış 16 Ekim 2029, C3 8,928 | aynı | Tablo 3: "Type 2 12/2/28 10/16/29 8.928" |
| 2031 fırsatı: 23 Şubat 2031 → 9 Ocak 2032, C3 8,237 | aynı | Tablo 4: "Type 2 2/23/31 1/9/32 8.237" |
| 292 ve 318 günlük yolculuklar | hesap | tarih farkı |
| Tip I < 180°, tip II > 180° | aynı | "Type I and Type II trajectories have heliocentric travel angles less than and greater than 180° respectively" |
| Hesap 407 km park yörüngesinden; Mars ve Dünya yörüngeleri ne dairesel ne aynı düzlemde | aynı | "the spacecraft departs from a 407 km circular parking orbit" ; "Earth and Mars orbits are neither exactly circular nor coplanar" |
| Mars karşı konumu 19 Şubat 2027 | https://skyatnightmagazine.com/advice/skills/mars-opposition | "Mars reaches opposition on 19 February 2027" |
| Mars 2027 karşı konumunda Aslan takımyıldızında | https://nakedeyeplanets.com/mars-oppositions.htm | arastirma/dersler_v2/d3_kaynak.md: "February 19", "Leo" |
| Rosalind Franklin: Ekim 2028 fırlatma fırsatı | https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/FAQ_The_rebirth_of_ESA_s_ExoMars_Rosalind_Franklin_mission | "with an identified launch opportunity in October 2028" |
| Galileo: Venüs'ten bir, Dünya'dan iki itme | ders 23 (JPL'ye dayanır) | "Galileo Jüpiter'e giderken Venüs'ten bir, Dünya'dan iki itme aldı" |
| Wikipedia: Mars yolculuğu yaklaşık 9 ay | https://en.wikipedia.org/wiki/Hohmann_transfer_orbit | "for an Earth-Mars journey this travel time is about 9 months" (yalnız sağlama; ekranda yok) |
