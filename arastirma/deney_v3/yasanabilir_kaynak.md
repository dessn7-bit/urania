# yasanabilir (Yaşanabilir bölge) — kaynak tablosu

Erişim: 2026-10-30. arXiv PDF'leri curl + pdftotext; Wikipedia ham metni (action=raw); NASA bilgi sayfaları curl. "Hesap" satırları python3 ile.

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| S_eff = S_eff☉ + aT⋆ + bT⋆² + cT⋆³ + dT⋆⁴, T⋆ = Teff − 5780 K | https://arxiv.org/abs/1404.5292 | Kopparapu vd. 2014 denk. (4) |
| d = √((L/L☉)/S_eff) AB | https://arxiv.org/abs/1404.5292 | denk. (5) |
| Geçerlilik 2600–7200 K | https://arxiv.org/abs/1404.5292 | "limits for stars with 2600 K <= Teff <= 7200 K" |
| Katsayılar (1 M⊕): Yakın Venüs 1,776 / 2,136e-4 / 2,533e-8 / −1,332e-11 / −3,097e-15 | https://arxiv.org/abs/1404.5292 | Tablo 1 |
| Kaçak sera 1,107 / 1,332e-4 / 1,58e-8 / −8,308e-12 / −1,931e-15 | https://arxiv.org/abs/1404.5292 | Tablo 1 |
| En büyük sera 0,356 / 6,171e-5 / 1,698e-9 / −3,198e-12 / −5,575e-16 | https://arxiv.org/abs/1404.5292 | Tablo 1 |
| Erken Mars 0,32 / 5,547e-5 / 1,526e-9 / −2,874e-12 / −5,011e-16 | https://arxiv.org/abs/1404.5292 | Tablo 1 |
| Aynı katsayılar (ikinci kaynak) | https://personal.ems.psu.edu/~jfk4/ruk15/planets/hzcalc.py | "seffsun = [1.776,1.107, 0.356, 0.320, …]" ve a, b, c, d satırları |
| Temkinli = kaçak sera … en büyük sera | https://arxiv.org/abs/1404.5292 | "conservative estimate of the inner edge" / "conservative estimate of the outer edge … maximum greenhouse limit" |
| Güneş: 0,95 – 1,68 AB; iyimser 0,75 – 1,77 AB (hesap) | — | √(1/1,107) = 0,950; √(1/0,356) = 1,676; √(1/1,776) = 0,750; √(1/0,32) = 1,768 |
| 2013 makalesi: iç kenar 0,99 AB (su kaybı), dış 1,70 AB | https://arxiv.org/abs/1301.6674 | özet "the water loss (inner HZ) and maximum greenhouse (outer HZ) limits for our Solar System are at 0.99 AU and 1.70 AU" |
| Sıcak yıldızda albedo yüksek (Rayleigh), soğuk yıldızda yakın kızılötesi soğurma | https://arxiv.org/abs/1301.6674 | "Rayleigh scattering cross section … is on average higher for a planet around an F-star … H2O and CO2 have stronger absorption coefficients in the near-infrared" |
| Bulutsuz model | https://arxiv.org/abs/1301.6674 | "Our model does not include the radiative effects of clouds" |
| T_eq = [L(1−A)/(16πσd²)]^¼; 278,3296·(1−A)^¼ (d/AU)^−½ K | https://en.wikipedia.org/wiki/Planetary_equilibrium_temperature | formül ve "278.3296" |
| L☉ = 3,828e26 W, T☉ = 5.772 K, σ, AU | fizik.json (IAU 2015 B3, CODATA 2022, IAU 2012 B2) | — |
| S⊕ = 1.361 W/m² (hesap, NASA ile aynı) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Solar irradiance (W/m2) 1361.0" |
| Dünya a = 1,00000011 AB, Bond albedosu 0,294 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Semimajor axis (AU) 1.00000011", "Bond albedo 0.294" |
| Dünya kara cisim 254,0 K (NASA; 0,294 ile hesap 255,1 K — NASA tablosu albedo güncellenmiş ama sıcaklık güncellenmemiş görünüyor; 0,306 ile 254,0 çıkar) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Black-body temperature (K) 254.0" |
| Dünya: etkin 255 K (−18 °C), yüzey 288 K (15 °C), fark 33 °C | https://en.wikipedia.org/wiki/Greenhouse_effect | "Planetary effective temperature … 255 K"; "Surface temperature … 288 K"; "temperature change of 33 °C" |
| Dünya ortalama 288 K | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Average temperature: 288 K (15 C)" |
| Ders d2 ile tutarlı: 255 K ve 288 K | veri/dersler.json d2 | "etkin sıcaklığı yaklaşık 255 K … ortalama yüzey sıcaklığı ise yaklaşık 288 K" |
| Mars a = 1,52366231 AB, Bond 0,250, kara cisim 209,8 K | https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | "Semimajor axis (AU) 1.52366231"; "Bond albedo 0.250"; "Black-body temperature (K) 209.8" |
| Venüs a = 0,72333199 AB, Bond 0,77, kara cisim 226,6 K, yüzey 737 K | https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html | "Semimajor axis (AU) 0.72333199"; "Bond albedo 0.77"; "Black-body temperature (K) 226.6"; "Average temperature: 737 K (464 C)" |
| Merkür a = 0,387 AB (TRAPPIST-1 e ≈ 1/13'ü, hesap 13,2) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html | "Semimajor axis (AU) 0.38709893" |
| TRAPPIST-1 L = 0,000553 L☉ | https://arxiv.org/abs/2010.01074 | Agol vd. 2021 tablo "L [L ] 0.000553±0.000019 Ducrot et al. (2020)" |
| TRAPPIST-1 Teff = 2.566 K | https://arxiv.org/abs/2010.01074 | "Tef f [K] 2566±26 This paper" |
| TRAPPIST-1 e a = 0,02925 AB, S = 0,646 S⊕; d 0,02227, f 0,03849, g 0,04683 AB | https://arxiv.org/abs/2010.01074 | "a [10−2 AU] … 2.227 … 2.925 3.849 4.683"; "S [S⊕] … 0.646" |
| TRAPPIST-1 e T_eq 249,7 K | https://en.wikipedia.org/wiki/TRAPPIST-1e | "Teq: 249.7 ± 2.4 K" (Ducrot 2020) |
| Wikipedia'nın güncel farklı değerleri: 2.325 K, L 5,66e-4 | https://en.wikipedia.org/wiki/TRAPPIST-1 | "temperature = 2325 (Picos … 2026)", "luminosity_bolometric = 5.66e-4 (Davoudi … 2024)" |
| Proxima L 0,00155, Teff 3.050 K, a 0,0485 AB, ışık %65, T_eq 234 K, HZ ~0,0423–0,0816 AB | https://arxiv.org/abs/1609.03449 | Anglada-Escudé vd. 2016 Tablo 1 "Luminosity 0.00155", "Effective temperature [K] 3050", "Habitable zone range [AU] ∼ 0.0423 – 0.0816", "Orbital semi-major axis a [AU] 0.0485", "Eq. black body temperature [K] 234", "Irradiance compared to Earth's 65%" |
| Proxima farklı değerler: L 0,001567, 2.833 K, a 0,04848 AB | https://en.wikipedia.org/wiki/Proxima_Centauri ; https://en.wikipedia.org/wiki/Proxima_Centauri_b | "luminosity_bolometric = 0.001567", "temperature = 2833", "semimajor = 0.04848" |
| Procyon A L = 7,049 L☉, Teff = 6.582 K | https://en.wikipedia.org/wiki/Procyon | "luminosity = 7.049 ± 0.064", "temperature = 6582 ± 5" (Soubiran 2024) |
| Procyon A (ikinci kaynak) 6.530 ± 50 K, log L = 0,85 | https://arxiv.org/abs/astro-ph/0309148 | Kervella vd. 2004 "we adopt Teff = 6530 ± 50K"; "log(L⋆/L⊙) = 0.85 ± 0.06" |
| Procyon, Küçük Köpek, kış akşamı görünür, F5 | https://en.wikipedia.org/wiki/Procyon | "brightest star in the … constellation of Canis Minor"; F5 IV–V |
| Ders d13: Kopparapu 2013 0,99–1,67 AB; e, f, g bölgede; Proxima b bölgede; gelgit kilidi, patlamalar | veri/dersler.json d13 | Deneyde 2014 sınırları kullanıldı (0,95–1,68); 2013'ün 0,99'u kaynak satırında anılır |
| Örnek sonuçlar (hesap; tarayıcıda aynı): Dünya 255 K; albedo 0 → 278 K; Venüs 227 K; Mars 210 K; T1e 250 K, S 0,65, HZ 0,0246–0,0498; Proxima b 251 K, S 0,66, HZ 0,0410–0,0813; Procyon HZ 2,40–4,17, 1 AB'de 416 K, 3 AB'de S 0,78, 240 K | — | python3 + Playwright |
