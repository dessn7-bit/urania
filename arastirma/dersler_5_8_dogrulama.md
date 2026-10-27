# Dersler 5–8: sayı doğrulama listesi — sürüm 2

Tarih: 2026-10-27. Sürüm 2'de OpenStax tamamen çıkarıldı (kitabın YZ'ye alınma yasağı nedeniyle); bu sürüm için OpenStax sayfası açılmadı. Her satırdaki kaynak bu oturumda çekildi (curl ya da WebFetch) ve alıntı o sayfadan aynen kopyalandı. "HESAP" diye işaretli değerler kaynak değeri değil, bu oturumda kaynak değerlerinden yapılmış hesaplardır. WebFetch ile okunan sayfalarda (imagine.gsfc.nasa.gov, iau.org, nobelprize.org/1978) alıntı, WebFetch'in özet modelinin aktardığı metindir.

Kısaltmalar:
- WP:X = https://en.wikipedia.org/wiki/X
- MAM = https://www.pas.rochester.edu/~emamajek/EEM_dwarf_UBVIJHK_colors_Teff.txt
- PLANCK = https://arxiv.org/abs/1807.06209 ; PLANCK-T2 = https://arxiv.org/pdf/1807.06209v4 (Tablo 2)

## Ders 5 — Yıldızların hayatı

| # | Derste kullanılan değer | Kaynak | Kaynaktaki ifade (aynen) |
|---|---|---|---|
| 1 | Çizgiler element/molekül gösterir; güç esas olarak sıcaklıkla değişir; sınıf sıcaklık ölçüsü | WP:Stellar_classification | "Each line indicates a particular chemical element or molecule" ; "The strengths of the different spectral lines vary mainly due to the temperature of the photosphere, although in some cases there are true abundance differences. The spectral class of a star is a short code primarily summarizing the ionization state, giving an objective measure of the photosphere's temperature." |
| 2 | O B A F G K M, sıcaktan soğuğa | WP:Stellar_classification | "using the letters O, B, A, F, G, K, and M, a sequence from the hottest (O-type) to the coolest (M-type)" |
| 3 | 1901, Cannon sırayı düzenledi | WP:Stellar_classification | "In 1901, Annie Jump Cannon returned to the lettered types, but dropped all letters except O, B, A, F, G, K, M, and N used in that order" ; "Annie Jump Cannon, who re-ordered and simplified Draper's alphabetical system" |
| 4 | 0–9 alt sınıflar; A9'dan sonra F0 | WP:Stellar_classification | "subdivided using a numeric digit with 0 being hottest and 9 being coolest (e.g., A8, A9, F0, and F1 form a sequence from hotter to cooler)" |
| 5 | Güneş G2 | WP:Stellar_classification | "The Sun is classified as G2." |
| 6 | O ≥33.000; B 10.000–33.000; A 7300–10.000; F 6000–7300; G 5300–6000; K 3900–5300; M 2300–3900 K | WP:Stellar_classification | Tablo: "≥ 33,000 K", "10,000–33,000 K", "7,300–10,000 K", "6,000–7,300 K", "5,300–6,000 K", "3,900–5,300 K", "2,300–3,900 K" |
| 7 | Hertzsprung 1911, Russell 1913 | WP:Hertzsprung–Russell_diagram | "The diagram was created independently in 1911 by Ejnar Hertzsprung and by Henry Norris Russell in 1913" |
| 8 | Parlak yukarı, sıcak sola | WP:Hertzsprung–Russell_diagram | "stars of greater luminosity are toward the top of the diagram, and stars with higher surface temperature are toward the left side of the diagram." |
| 9 | Köşegen anakol; beyaz cüceler sol altta, devler üstte | WP:Hertzsprung–Russell_diagram | "The most prominent is the diagonal, going from the upper-left (hot and bright) to the lower-right (cooler and less bright), called the main sequence. In the lower-left is where white dwarfs are found, and above the main sequence a..." |
| 10 | Anakol boyunca kütle düzeni | WP:Hertzsprung–Russell_diagram | "with low-mass stars at the cooler and less luminous end of the sequence, and more massive stars towards the hotter and more luminous end." |
| 11 | Ömrün çoğu anakolda | WP:Main_sequence | "Stars spend the majority of their lives on the main sequence, during which core hydrogen burning is dominant." |
| 12 | L ∝ M^3,5, 2–55 M☉; beyaz cüce/devlere uygulanmaz | WP:Mass–luminosity_relation | "The value a = 3.5 is commonly used for main-sequence stars. This equation and the usual value of a = 3.5 only applies to main-sequence stars with masses 2M☉ < M < 55M☉ and does not apply to red giants or white dwarfs." |
| 13 | Parçalı ilişki: 0,23 M^2,3; M^4 (0,43–2); 1,4 M^3,5 | WP:Mass–luminosity_relation | "L/L☉ ≈ 0.23 (M/M☉)^2.3 (M < 0.43M☉) ; L/L☉ = (M/M☉)^4 (0.43M☉ < M < 2M☉) ; L/L☉ ≈ 1.4 (M/M☉)^3.5 (2M☉ < M < 55M☉)" |
| 14 | 2 kat kütle ≈ 16 kat parlaklık | HESAP | 2^4 = 16 (0,43–2 M☉ kuralı) |
| 15 | A0: 2,18 M☉, ~38 L☉; M^4 ile ~23 | MAM + HESAP | Tablo satırı "A0V 9700 ... logL 1.58 ... R 2.193 ... Msun 2.18" ; 10^1,58 = 38 ; 2,18^4 = 22,6 |
| 16 | Ömür ≈ 10^10 yıl × (M/M☉)(L☉/L) | WP:Main_sequence | "τ_MS ≈ 10^10 years [M/M☉][L☉/L] = 10^10 years [M/M☉]^-2.5" |
| 17 | Kütle 2 kat → harcama ~10–16 kat | HESAP | 2^3,5 = 11,3 ; 2^4 = 16 |
| 18 | O5 43 M☉ ~1,2 milyon; B0 17,7 M☉ ~4 milyon; A0 2,18 M☉ ~570 milyon; G2 ~10 milyar; K0 0,88 M☉ ~19 milyar; M0 0,57 M☉ ~82 milyar yıl | MAM + HESAP | Girdiler (Msun, logL): O5V 43, 5.54 ; B0V 17.7, 4.65 ; A0V 2.18, 1.58 ; G2V 1.00, 0.01 ; K0V 0.88, −0.34 ; M0V 0.57, −1.16 → τ = 10^10 × M / 10^logL |
| 19 | Evrenin yaşı 13,8 milyar yıl (karşılaştırma için) | PLANCK-T2 | "Age [Gyr] ... 13.797 ± 0.023" |
| 20 | Güneş ~4,5 milyar yıldır anakolda; toplam ~10 milyar yıl | WP:Main_sequence | "The Sun has been a main-sequence star for about 4.5 billion years and it will start to expand rapidly towards a red giant in 6.5 billion years, for a total main-sequence lifetime of roughly 10^10 years." |
| 21 | Güneş yarısından biraz azında, ~5 milyar yıl daha | https://science.nasa.gov/sun/facts/ | "Scientists predict the Sun is a little less than halfway through its lifetime and will last another 5 billion years or so before it becomes a white dwarf." |
| 22 | Moleküler bulut: 1000–10 milyon M☉, yüzlerce ışık yılı, soğuk, topaklar çöker | https://science.nasa.gov/universe/stars/ | "Molecular clouds range from 1,000 to 10 million times the mass of the Sun and can span as much as hundreds of light-years. Molecular clouds are cold which causes gas to clump, creating high-density pockets. ... Eventually, gravity causes some of these clumps to collapse." |
| 23 | Yoğun çekirdek; kütleçekimi basıncı yenince çöküş | WP:Protostar | "Each dense core is initially in balance between self-gravity, which tends to compress the object, and both gas pressure and magnetic pressure ... As the dense core accrues mass from its larger, surrounding cloud, self-gravity begins to overwhelm pressure, and collapse begins." |
| 24 | Önyıldız + disk; açısal momentum | WP:Protostar | "first builds up a low-mass protostar, and then a protoplanetary disk orbiting the object. As the collapse continues, an increasing amount of gas impacts the disk rather than the star, a consequence of angular momentum conservation." |
| 25 | Önyıldız evresi ~500.000 yıl (Güneş ve altı) | WP:Protostar | "For a low-mass star (i.e. that of the Sun or lower), it lasts about 500,000 years." |
| 26 | Önce döteryum füzyonu; sonra kütleçekimsel büzülme | WP:Star_formation | "When the density and temperature are high enough, deuterium fusion begins" ; "The energy source of these objects is (gravitational contraction) Kelvin–Helmholtz mechanism, as opposed to hydrogen burning in main sequence stars." |
| 27 | Alt sınır ~0,08 M☉ = 80 Jüpiter kütlesi | WP:Main_sequence | "The lower limit for sustained proton-proton nuclear fusion is about 0.08 M☉ or 80 times the mass of Jupiter." |
| 28 | Kahverengi cüce: 13–80 Jüpiter kütlesi | WP:Brown_dwarf | "Their mass is approximately 13 to 80 times that of Jupiter (MJ)" |
| 29 | Kırmızı dev: kabukta hidrojen füzyonu; yarıçap onlarca–yüzlerce kat; ≤~5000 K; renk; Güneş'ten kat kat parlak | WP:Red_giant | "has begun thermonuclear fusion of hydrogen in a shell surrounding the core. They have radii tens to hundreds of times larger than that of the Sun." ; "surface temperature around 5,000 K [K] (4,700 °C; 8,500 °F) or lower. The appearance of the red giant is from yellow-white to reddish-orange" ; "red giants are many times more luminous than the Sun" |
| 30 | ~0,3–8 M☉ | WP:Red_giant | "of low or intermediate mass (roughly 0.3–8 solar masses (M☉))" |
| 31 | ~100 milyon K'de helyum füzyonu | WP:Helium_flash | "until it reaches temperature of approximately 100 million kelvins, which is hot enough to initiate helium fusion" |
| 32 | Üç helyum → karbon | WP:Triple-alpha_process | "three helium-4 nuclei (alpha particles) are transformed into carbon." |
| 33 | Helyum parlaması 0,8–2,0 M☉ | WP:Helium_flash | "in the core of low-mass stars (between 0.8 solar masses (M☉) and 2.0 M☉)" |
| 34 | Güneş Merkür, Venüs, belki Dünya'yı yutacak | https://science.nasa.gov/sun/facts/ | "the Sun will expand into a red giant star, becoming so large that it will engulf Mercury and Venus, and possibly Earth as well." |

## Ders 6 — Yıldızların ölümü

| # | Değer | Kaynak | Kaynaktaki ifade |
|---|---|---|---|
| 1 | Gezegenimsi bulutsu, C–O çekirdek kalır (0,5–8 M☉) | WP:White_dwarf | "If the mass of a main-sequence star is between 0.5 and 8 M☉ ... It will then expel most of its outer material to form a planetary nebula, leaving only the carbon–oxygen core." |
| 2 | 1 M☉ → ~0,6 M☉, Dünya hacminde beyaz cüce; elektron yozlaşma basıncı, Pauli | WP:Stellar_evolution | "For a star of 1 M☉, the resulting white dwarf is of about 0.6 M☉, compressed into approximately the volume of the Earth. White dwarfs are stable because the inward pull of gravity is balanced by the degeneracy pressure of the star's electrons, a consequence of the Pauli exclusion principle." |
| 3 | Füzyon yok, ısısını yayarak soğur | WP:Stellar_evolution | "With no fuel left to burn, the star radiates its remaining heat into space for billions of years." |
| 4 | Güneş'in yarısı kütle, Dünya'dan biraz büyük; 10^9 kg/m³ | https://imagine.gsfc.nasa.gov/science/objects/dwarfs2.html (WebFetch) | "A typical white dwarf is half as massive as the Sun, yet only slightly bigger than Earth." ; "An Earth-sized white dwarf has a density of 1 x 109 kg/m3." |
| 5 | Kütle arttıkça hacim küçülür | WP:Stellar_evolution | "for a given chemical composition, white dwarfs of higher mass have a smaller volume." |
| 6 | Chandrasekhar ~1,4 M☉ | NASA dwarfs2 ; WP:Stellar_evolution | "Subrahmanyan Chandrasekhar discovered this limit to be 1.4 times the mass of the Sun." ; "the Chandrasekhar limit, which is 1.4 M☉ for a white dwarf composed chiefly of carbon, oxygen, neon, and/or magnesium" |
| 7 | ~1,44 M☉ | WP:Chandrasekhar_limit | "For small stars this ratio is around 1/2 and the limit is about 1.44 M☉." |
| 8 | <~8 M☉ yıldızlar sınırın altında beyaz cüce bırakır | WP:Chandrasekhar_limit | "If a main-sequence star is not too massive (less than approximately 8 solar masses), it eventually sheds enough mass to form a white dwarf having mass below the Chandrasekhar limit" |
| 9 | Her basamak daha az enerji | WP:Type_II_supernova | "Each additional step produces progressively heavier nuclei, which release progressively less energy when fusing." |
| 10 | Demir kaynaştırmaya başlayınca çöküş | WP:Supernova | "the core of a massive star will undergo sudden collapse once it is unable to produce sufficient energy from fusion to counteract the star's own gravity, which must happen once the star begins fusing iron" |
| 11 | ~1,4 M☉'yi aşınca saniyeler içinde çöküş; %23 c; 100 milyar K; nötron + nötrino; nükleer kuvvet ve nötron yozlaşması durdurur; şok dalgası | WP:Type_II_supernova | "When the compacted mass of the inert core exceeds the Chandrasekhar limit of about 1.4 M☉ ... A cataclysmic implosion of the core takes place within seconds. ... reaches a velocity of up to 23% of the speed of light, and the sudden compression increases the temperature of the inner core to up to 100 billion kelvins. Neutrons and neutrinos are formed via reversed beta-decay ... The collapse of the inner core is halted by the repulsive nuclear force and neutron degeneracy, causing the implosion to rebound and bounce outward." |
| 12 | 70.000 km/s | WP:Type_II_supernova | "The outer part of the core reaches velocities of up to 70000 km/s (23% of the speed of light)" |
| 13 | En az 8, en fazla 40–50 M☉ | WP:Type_II_supernova | "A star's mass must be at least 8 times, but no more than 40 to 50 times, the mass of the Sun (M☉) to undergo this type of explosion." |
| 14 | >8 M☉ süpernova; eşiğe yakın → nötron yıldızı; ~20 M☉+ → kara delik | https://science.nasa.gov/universe/black-holes/types/ | "When a star with more than eight times the Sun's mass runs out of fuel, its core collapses, rebounds, and explodes as a supernova. ... If it was near the threshold, it creates a city-sized, superdense neutron star. If it had around 20 times the Sun's mass or more, the star's core collapses into a stellar-mass black hole." |
| 15 | Başlangıç kütlesi–kalıntı ilişkisi tam kesin değil | WP:Stellar_evolution | "the exact relation between the initial mass of the star and the final remnant is also not completely certain." |
| 16 | Tip Ia: birkaç saniyede füzyon; enerji yıldızı dağıtır | WP:Type_Ia_supernova | "a substantial fraction of the carbon and oxygen in the white dwarf fuses into heavier elements within a period of only a few seconds" ; "The energy released (1–2×1044 J) is more than sufficient to unbind the star" |
| 17 | 5000–20.000 km/s | WP:Type_Ia_supernova | "typically ejected at speeds on the order of 5,000–20,000 km/s, roughly 6% of the speed of light." |
| 18 | İki beyaz cüce birleşmesi | WP:Type_Ia_supernova | "A double degenerate scenario is one of several explanations proposed..." |
| 19 | Hidrojen varsa Tip II, yoksa Tip I; Ia silisyum | WP:Supernova | "If a supernova's spectrum contains lines of hydrogen ... it is classified Type II; otherwise it is Type I." ; "Type Ia showing a strong ionised silicon absorption line." |
| 20 | Sabit kritik kütle → standart mum | WP:Type_Ia_supernova | "The Type Ia category of supernova produces a fairly consistent peak luminosity because of the fixed critical mass at which a white dwarf will explode. Their consistent peak luminosity allows these explosions to be used as standard candles" |
| 21 | ~20 km; 1–3 M☉; şeker küpü ≈ 1 trilyon kg | https://imagine.gsfc.nasa.gov/science/objects/neutron_stars1.html (WebFetch) | "These stellar remnants measure about 20 kilometers (12.5 miles) across." ; "If the core of the collapsing star is between about 1 and 3 solar masses," ; "One sugar cube of neutron star material would weigh about 1 trillion kilograms" |
| 22 | Nötron yıldızı üst sınırı ~2–3 M☉ | WP:Stellar_evolution | "The mass at which this occurs is not known with certainty, but is currently estimated at between 2 and 3 M☉." |
| 23 | 1967, Jocelyn Bell, ~1,337 s | WP:Pulsar | "Signals from the first discovered pulsar were initially observed by Jocelyn Bell while analyzing data recorded on August 6, 1967" ; "resolved the signals as a series of pulses, evenly spaced every 1.337 seconds." |
| 24 | Manyetik kutuplardan ışın, deniz feneri | WP:Pulsar | "a highly magnetized rotating neutron star that emits beams of electromagnetic radiation out of its magnetic poles ... (similar to the way a lighthouse can be seen only when the light is pointed in the direction of an observer)" |
| 25 | Atımlar milisaniye–saniye | NASA neutron_stars1 | "that typically range from milliseconds to seconds." |
| 26 | Yengeç: SN 1054; ~30 tur/s | WP:Crab_Pulsar | "a remnant of the supernova SN 1054, which was widely observed on Earth in the year 1054" ; "has a rotational period of 33.392 milliseconds, that is, the pulsar \"beams\" perform 29.946 revolutions per second." |
| 27 | Kaçış hızı Dünya ~11,2, Güneş ~618 km/s | WP:Escape_velocity | "the escape velocity from Earth is 11.186 km/s" ; tablo: "Sun \| The Sun's gravity \| 617.7" |
| 28 | Olay ufkunda kaçış hızı ışık hızını aşar | https://science.nasa.gov/universe/black-holes/anatomy/ | "Inside this boundary, the velocity needed to escape the black hole exceeds the speed of light ... So whatever passes into the event horizon is doomed to stay inside it – even light." |
| 29 | Rs = 2GM/c²; Güneş ~3,0 km; Dünya ~9 mm | WP:Schwarzschild_radius | formül "r_s = 2GM/c^2" ; "the Sun has a Schwarzschild radius of approximately 3.0 km (1.9 mi), whereas Earth's is approximately 9 mm" |
| 30 | Rs ≈ 2,95 km × (M/M☉) | HESAP | 2 × 6,674×10^-11 × 1,989×10^30 / (2,998×10^8)² = 2954 m |
| 31 | 10 M☉ → 30 km | WP:Schwarzschild_radius | tablo: "Stellar black hole \| 10 MSun \| 30 km" |
| 32 | GPS: +45,8 µs; −7,2 µs; net +38,6 µs/gün; ~11,4 km/gün | WP:Error_analysis_for_the_Global_Positioning_System | "about +45.8 μs/day" ; "an error of about -7.2 μs/day in the satellite" ; "cause the clocks on the satellites to gain 38.6 microseconds per day" ; "Without correction, errors of roughly 11.4 km/day would accumulate in the position." |
| 33 | Ufka yaklaşan cisim uzaktan donmuş görünür | https://science.nasa.gov/universe/black-holes/what-happens-when-something-gets-too-close-to-a-black-hole/ | "As the object approaches the event horizon, it appears to start moving infinitely slower until the object will appear completely frozen." |
| 34 | Gelgit: yakın taraf daha güçlü çekilir; spagettileşme | NASA (aynı sayfa) | "the part closer to the black hole will feel a stronger gravitational pull than the part farther away" ; "This process is known as spaghettification" |
| 35 | Yıldız kütleli: ufuktan önce; dev kara delik: ufkun içinde | WP:Spaghettification | "For a supermassive black hole ... this point lies within the event horizon. As a result, an astronaut may cross the event horizon without noticing any significant tidal forces." ; "Stellar black holes have much higher spacetime curvature at their event horizon, so the tidal forces would cause the astronaut to undergo spaghettification before the event horizon." |
| 36 | Süpernova maddesi sonraki bulutları zenginleştirir | https://science.nasa.gov/universe/stars/ | "Material cast into the cosmos by supernovae and other stellar events will enrich future molecular clouds and become incorporated into the next generation of stars." |
| 37 | 17 Ağustos 2017, LIGO/Virgo, NGC 4993, ~130 milyon ışık yılı | WP:GW170817 ; https://www.eso.org/public/news/eso1733/ | "observed by the LIGO and Virgo detectors on 17 August 2017, originating within the shell elliptical galaxy NGC 4993, about 130 million light-years away." ; "GW170817 was at the same distance as NGC 4993, about 130 million light-years from Earth." (Not: WP:Kilonova "140 million light-years" der; derste 130 kullanıldı) |
| 38 | Kilonova; sezyum, tellür; r-süreci | ESO eso1733 | "long-predicted events called kilonovae" ; "suggest the presence of caesium and tellurium" ; "formation of elements heavier than iron through nuclear reactions within high-density stellar objects, known as r-process nucleosynthesis" |
| 39 | Stronsiyum ve itriyum | WP:Kilonova | "Spectral modelling of AT2017gfo identified the r-process elements strontium and yttrium, which conclusively ties the formation of heavy elements to neutron-star mergers." |
| 40 | ESO başlığı | ESO eso1733 | "Merging neutron stars scatter gold and platinum into space" |

## Ders 7 — Galaksiler

| # | Değer | Kaynak | Kaynaktaki ifade |
|---|---|---|---|
| 1 | Herschel 1785, Güneş Sistemi merkeze yakın | WP:Milky_Way | "carried out by William Herschel in 1785 by carefully counting the number of stars in different regions of the visible sky. He produced a diagram of the Milky Way's shape, with the Solar System near its center." |
| 2 | Shapley 1918, küresel kümeler Yay yönünde | WP:Galactic_Center | "Harlow Shapley stated in 1918 that the halo of globular clusters surrounding the Milky Way seemed to be centered on the star swarms in the constellation of Sagittarius" |
| 3 | Disk >100.000 ışık yılı | https://science.nasa.gov/universe/galaxies/ | "It's a spiral galaxy with a disk of stars spanning more than 100,000 light-years." |
| 4 | Çubuklu sarmal; D25 çapı 87.400 ± 3600 ışık yılı | WP:Milky_Way | "The Milky Way is a barred spiral galaxy with a D25 isophotal diameter estimated at 26.8 ± 1.1 kiloparsecs (87,400 ± 3,600 light-years)" |
| 5 | İnce disk 220–450 pc (718–1470 ışık yılı); 100–400 milyar yıldız | WP:Milky_Way | bilgi kutusu: "Thickness of thin disk \| 220–450 pc (718–1,470 ly)" ; "Number of stars \| 100–400 billion" |
| 6 | İç 10.000 ışık yılında şişkinlik, çubuk buradan | WP:Milky_Way | "The stars in the innermost 10,000 light-years form a bulge, from which the bar radiates." |
| 7 | Hale: yaşlı yıldızlar, küresel kümeler, karanlık maddenin çoğu | WP:Milky_Way | "The galactic disk is surrounded by a spheroidal halo of old stars and globular clusters and contains most of the Milky Way's dark matter." |
| 8 | Dünya bir sarmal kolda, yarı yolda | NASA Galaxies | "Earth is located along one of the galaxy's spiral arms, about halfway from the center." |
| 9 | Orion Spur, Yay kolundan dışa | https://science.nasa.gov/sun/facts/ | "in a spiral arm called the Orion Spur that extends outward from the Sagittarius arm." |
| 10 | R0 = 8178 pc | https://arxiv.org/abs/1904.05721 | "R0 = 8178 +- 13(stat.) +- 22(sys.) pc" |
| 11 | ≈26.700 ışık yılı | HESAP | 8178 × 3,2616 = 26.673 |
| 12 | 27.000 ışık yılı | https://www.eso.org/public/news/eso2119/ | "finding it to be 27 000 light-years away." |
| 13 | 720.000 km/saat; ~230 milyon yıl | NASA Sun facts | "average velocity of 450,000 miles per hour (720,000 kilometers per hour). But even at this speed, it takes about 230 million years" |
| 14 | ~200 km/s | HESAP | 720.000 / 3600 = 200 |
| 15 | 240 milyon yıl | NASA Galaxies | "Our solar system takes about 240 million years to orbit the Milky Way just once." |
| 16 | 212 milyon yıl | WP:Milky_Way | bilgi kutusu: "Sun's Galactic rotation period \| 212 Myr" |
| 17 | 30 yıl ölçüm; en olası açıklama dev kara delik; 2020 Nobel | https://www.eso.org/public/news/eso2208-eht-mw/ | "By measuring the orbits of several stars very close to our galactic centre over a period of 30 years, teams led by Reinhard Genzel ... and Andrea M. Ghez ... were able to conclude that the most likely explanation for an object of this mass and density is a supermassive black hole. ... which shared the 2020 Nobel Prize in Physics." |
| 18 | 4,30 milyon M☉, ±%0,25 | https://arxiv.org/abs/2112.07478 ; ESO eso2119 | "M = 4.30 x 10^6 M_sun with a precision of about +-0.25%" ; "a black hole of mass 4.30 million times that of the Sun" |
| 19 | EHT 2022; dört milyon kat; Ay'daki simit | ESO eso2208-eht-mw | "astronomers have unveiled the first image of the supermassive black hole at the centre of our own Milky Way galaxy" ; "which is four million times more massive than our Sun." ; "about the same size in the sky as a doughnut on the Moon." |
| 20 | Rs ≈ 12,7 milyon km | HESAP | 2954 m × 4,30×10^6 = 1,27×10^10 m |
| 21 | Dünya–Güneş ~150 milyon km; oran ~1/10 | NASA Sun facts + HESAP | "The Sun is about 93 million miles (150 million kilometers) from Earth." ; 12,7/150 = 0,085 |
| 22 | Hubble 1926; E0–E7; Sa–Sc; B harfi; fazla basit ama geçerli | https://esahubble.org/images/heic9902o/ | "developed a classification scheme of galaxies in 1926" ; "\"E0\" is almost round, \"E7\" is very elliptical" ; "\"Sa\" spirals ... tightly wound whereas \"Sc\" spirals are more loosely wound" ; "the sizes of the round central regions in spirals - the so-called bulges - increase in size the more tightly the spiral arms are wound" ; "Barred spirals have a \"B\" in their classification" ; "now considered somewhat too simple, the basic ideas still hold." |
| 23 | Samanyolu ve Andromeda çubuklu; çubuklular 2/3 | https://science.nasa.gov/universe/galaxies/types/ | "Both the Milky Way and the Andromeda galaxies belong to a subtype known as barred spirals, which make up two-thirds of the group." |
| 24 | Andromeda 2,5 milyon ışık yılı | https://science.nasa.gov/photojournal/our-neighbor-andromeda/ | "Andromeda is the closest large galaxy to our Milky Way galaxy, and is located 2.5 million light-years from our sun." |
| 25 | Yerel Grup >50 galaksi | NASA Galaxies | "The Milky Way sits in a neighborhood with over 50 other galaxies called the Local Group." |
| 26 | Beklenti: uzaklaştıkça yavaşlama; gözlem: düz eğri | WP:Galaxy_rotation_curve | "the stars and gas in the disk portion should orbit the center at decreasing velocities with radial distance" ; "the curves do not decrease ... but are \"flat\", i.e. outside of the central bulge the speed is nearly a constant" |
| 27 | Rubin ve Ford, 1975 AAS; yıldızlar kabaca aynı hızla; kütle yarıçapla artar | WP:Galaxy_rotation_curve | "Together with fellow staff-member Kent Ford, Rubin announced at a 1975 meeting of the American Astronomical Society the discovery that most stars in spiral galaxies orbit at roughly the same speed, and that this implied that galaxy masses grow approximately linearly with radius well beyond the location of most of the stars (the galactic bulge)." |
| 28 | Rubin 1970'ler, görünmeyen madde | https://science.nasa.gov/universe/dark-matter-dark-energy/ | "That changed in the 1970s when American astronomer Vera Rubin observed this \"missing matter\" problem in spiral galaxies. ... there had to be a large amount of matter holding them in place." |
| 29 | Toplam kütle 0,58–1,15 trilyon M☉; karanlık madde 1–1,5 trilyon | WP:Milky_Way | "The low end of the estimate range is 5.8×1011 solar masses" ; bilgi kutusu "Mass \| 1.15×1012 M☉" ; "Mathematical models of the Milky Way suggest that the mass of dark matter is 1–1.5×1012 M☉." ; "Much of the mass of the Milky Way seems to be dark matter" |
| 30 | M = v²r/G → ~7,6×10^10 M☉ | HESAP | v = 2×10^5 m/s, r = 8178 × 3,0857×10^16 m |

## Ders 8 — Evrenin tarihi

| # | Değer | Kaynak | Kaynaktaki ifade |
|---|---|---|---|
| 1 | Uzaklığa orantılı uzaklaşma; v = H0 D | WP:Hubble%27s_law | "galaxies are moving away from Earth at speeds proportional to their distance" ; "It is described by the equation v = H0D" |
| 2 | Lemaître 1927 (Hubble'dan iki yıl önce), Fransızca, az etkili dergi; Hubble 1929 | WP:Hubble%27s_law | "In 1927, two years before Hubble published his own article, the Belgian priest and astronomer Georges Lemaître was the first to publish research deriving what is now known as Hubble's law." ; "published in French in a low-impact journal" ; "work published by Edwin Hubble in 1929" |
| 3 | IAU 2018, %78 | https://iau.org/news/pressreleases/detail/iau1812 (WebFetch) | "The proposed resolution has been accepted with 78% of the votes in favour and 20% against (and 2% abstaining)." |
| 4 | H0 = 67,4 ± 0,5 | PLANCK | "Hubble constant $H_0 = (67.4\pm 0.5)$km/s/Mpc" |
| 5 | 1 Mpc ≈ 3,26 milyon ışık yılı | WP:Hubble%27s_law + HESAP | "1 megaparsec (3.09×1019 km)" ; 3,09×10^19 / 9,461×10^12 km = 3,27×10^6 ışık yılı |
| 6 | Genişleme bir şeyin içine doğru değil | WP:Expansion_of_the_universe | "It is an intrinsic expansion, so it does not mean that the universe expands into anything or that space exists outside it." |
| 7 | Tek noktadan patlama değil, her yerde | WP:Big_Bang | "Another misconception is to think of the Big Bang as an explosion of a single point into its surroundings. The expansion of the universe occurs everywhere, not at any single point." |
| 8 | Çekimle bağlı olmayan yapılar; en yakın bağlı galaksiler katılmaz | WP:Expansion_of_the_universe | "the increase in distance between gravitationally unbound parts of the observable universe" ; "all but the nearest galaxies (which are bound to each other by gravity) move away at speeds that are proportional to their distance" |
| 9 | Hubble zamanı = 1/H0; gerçek yaştan farkı | WP:Hubble%27s_law | "the Hubble time tH is simply defined as the inverse of the Hubble constant" ; "it is different from the real age of the universe because the expansion is not linear; it depends on the energy content of the universe" |
| 10 | 1/67,4 ≈ 14,5 milyar yıl | HESAP | 977,8 / 67,4 = 14,5 (1 Mpc = 3,0857×10^19 km; 1 milyar yıl = 3,156×10^16 s) |
| 11 | İlk ~20 dakika; döteryum, He-3, He-4, Li-7; çoğunlukla H ve He | WP:Big_Bang_nucleosynthesis | "during the first ~20 minutes of the evolution of the universe" ; "including tritium, helium-3, helium-4, and lithium-7" ; "matter in the universe after BBN is primarily hydrogen and helium." ; "around twenty minutes after the Big Bang, the temperature and density became too low for any significant fusion to occur" |
| 12 | Helyum kütle oranı ≈ 0,245 | PLANCK-T2 | "the helium mass fraction used is predicted by BBN (posterior mean YP ≈ 0.2454" |
| 13 | Yaş 13,797 ± 0,023; +BAO 13,787 ± 0,020 | PLANCK-T2 | "Age [Gyr] ... 13.797 ± 0.023 ... 13.787 ± 0.020" (temel sütun: TT,TE,EE+lowE+lensing; "Our baseline results are based on Planck TT,TE,EE+lowE+lensing") |
| 14 | ~3000 K'de rekombinasyon, evren saydamlaşır | WP:Recombination_(cosmology) | "at T ~ 3000 K, few of the photons ... had the energy required to ionize a hydrogen atom. Most of the electrons and protons then recombined. Once this happened, at a time trec = 380,000 yr after the Big Bang, the major source of opacity disappeared, and the Universe became transparent" |
| 15 | ~378.000 yıl; z = 1100 | WP:Recombination_(cosmology) | "Recombination occurred about 378000 years after the Big Bang (at a redshift of z = 1100)." |
| 16 | 380.000 yıl | https://www.esa.int/Science_Exploration/Space_Science/Planck/Planck_reveals_an_almost_perfect_Universe | "imprinted on the sky when it was just 380 000 years old." |
| 17 | z* ≈ 1090 | PLANCK-T2 | "z∗ ... 1089.92 ± 0.25" |
| 18 | T(z) = T0 (1+z) | WP:Cosmic_microwave_background | "Tr = 2.725 K × (1 + z)" |
| 19 | 3000/1090 ≈ 2,75 K | HESAP | 3000 / 1090 = 2,75 |
| 20 | 2,72548 ± 0,00057 K | https://arxiv.org/abs/0911.1955 | "cosmic microwave background temperature of 2.72548 +/- 0.00057 K." |
| 21 | Penzias & Wilson 1964–65, ~3 K; Dicke ve ekibi Büyük Patlama izi olarak yorumladı; Holmdel, New Jersey | WP:Cosmic_microwave_background | "1964–65 – Arno Penzias and Robert Woodrow Wilson measure the temperature to be approximately 3 K. Robert Dicke, James Peebles, P. G. Roll, and D. T. Wilkinson interpret this radiation as a signature of the Big Bang." ; "at the Crawford Hill location of Bell Telephone Laboratories in nearby Holmdel Township, New Jersey" |
| 22 | 1978 Nobel'in yarısı | https://www.nobelprize.org/prizes/physics/1978/summary/ (WebFetch) | "the other half was shared by Arno Allan Penzias and Robert Woodrow Wilson" ; "for their discovery of cosmic microwave background radiation." |
| 23 | COBE, NASA, 1989 | WP:Cosmic_Background_Explorer | "Launch date \| 18 November 1989" ; "a NASA satellite dedicated to cosmology ... Its goals were to investigate the cosmic microwave background radiation" |
| 24 | 1998; Perlmutter, Schmidt, Riess; >50 süpernova; 2011 Nobel | https://www.nobelprize.org/prizes/physics/2011/press-release/ | "In 1998, cosmology was shaken at its foundations as two research teams presented their findings. Headed by Saul Perlmutter ... Brian Schmidt headed another team ... where Adam Riess was to play a crucial role." ; "found over 50 distant supernovae whose light was weaker than expected" |
| 25 | Karanlık enerji bilmece; ~3/4 | Nobel 2011 | "what that dark energy is remains an enigma" ; "dark energy constitutes about three quarters of the Universe." |
| 26 | Ωb h² = 0,02237; Ωc h² = 0,1200; ΩΛ = 0,6847; H0 = 67,36 | PLANCK-T2 (temel sütun) | "Ω b h2 ... 0.02237 ± 0.00015" ; "Ωc h2 ... 0.1200 ± 0.0012" ; "ΩΛ ... 0.6847 ± 0.0073" ; "H0 ... 67.36 ± 0.54" |
| 27 | %4,9 / %26,4 / %68,5 | HESAP | h = 0,6736 → Ωb = 0,02237/0,4537 = 0,0493 ; Ωc = 0,1200/0,4537 = 0,2645 ; ΩΛ = 0,6847 |
| 28 | NASA %5 / %27 / %68 | https://science.nasa.gov/universe/dark-matter-dark-energy/ | "normal or visible matter (5%), dark matter (27%), and dark energy (68%)." |
| 29 | ESA 2013: %4,9 / %26,8 | ESA Planck | "Normal matter that makes up stars and galaxies contributes just 4.9% of the mass/energy density of the Universe. Dark matter ... makes up 26.8%" |
| 30 | Soru: 100 Mpc → ~6740 km/s | HESAP | 67,4 × 100 |

---

## Özet

- Kaynaktan doğrulanan satır: Ders 5: 32, Ders 6: 39, Ders 7: 26, Ders 8: 26 (toplam 123). Yalnızca hesap olan satır: Ders 5: 2, Ders 6: 1, Ders 7: 4, Ders 8: 4 (toplam 11). Bazı kaynak satırlarında ek birim dönüşümü ya da hesap da HESAP olarak not edildi.
- Sürüm 1'den çıkarılan (OpenStax dışında bulunamayan ya da yerine başka kaynak konan) içerik:
  - OpenStax Table 22.1/18.3/23.1 rakamları → yerine Mamajek tablosu + Wikipedia ömür formülüyle hesap; nihai son tablosu Wikipedia/NASA'dan.
  - L ~ M^3,9 → Wikipedia'nın M^3,5 (2–55 M☉) ve parçalı ilişkisi.
  - GPS 45/7/38 µs (OpenStax) → Wikipedia'nın 45,8 / 7,2 / 38,6 µs ve 11,4 km/gün değerleri.
  - Sgr A* Rs = "Merkür yörüngesinin beşte biri" → çıkarıldı; yerine NASA'nın 150 milyon km'lik Dünya–Güneş uzaklığıyla karşılaştırma (hesap).
  - Samanyolu ≥2×10^12 M☉, ışıklı maddenin 20 katı, karanlık madde ≥200.000 ışık yılı, 30.000–150.000 ışık yılındaki RR Lyrae/küresel küme hızları → çıkarıldı; yerine Wikipedia kütle tahminleri ve dönme eğrisi anlatımı.
  - 200 Dünya kütlesi altın / 500 platin → çıkarıldı (başka kaynakta bulunamadı); yerine ESO ve Wikipedia'daki r-süreci kanıtları (sezyum, tellür, stronsiyum, itriyum).
  - Ayrıca yalnızca OpenStax'e dayanan diğer ayrıntılar da çıkarıldı ya da değiştirildi: %90/%10/%1 yıldız oranları, moleküler bulutların 10–20 K sıcaklığı, 10^20 kat yoğunluk artışı, anakola varış süreleri, Güneş'in kırmızı dev çapı (165 kat) ve ışıma gücü (2300 kat), 4×10^11 g/cm³, "1 saniyeden kısa / 20 km / ışık hızının 1/4'ü", Tip II'nin 5 kat sönüklüğü, 1,33728 s, 0,01 s'de 10^11 K, Samanyolu disk kalınlığı 2000 ışık yılı, Güneş'in düzlemden 70 ışık yılı yüksekliği, galaktik yılın 225 milyon yıl olması, OpenStax'in %31,5 toplam madde değeri.
- Kaynaklar arası farklar: Galaktik yıl NASA 230 / 240, Wikipedia 212 milyon yıl; GW170817 uzaklığı ESO ve WP:GW170817 130, WP:Kilonova 140 milyon ışık yılı; Sgr A* kütlesi GRAVITY 4,30, Wikipedia bilgi kutusu 4,100 milyon M☉; Güneş'in kalan anakol ömrü NASA ~5, Wikipedia 6,5 milyar yıl; rekombinasyon Wikipedia 378.000, ESA 380.000 yıl.
- Bulunamadığı için dışarıda bırakılanlar: Hubble sabiti ölçümleri arasındaki gerilim (bu oturumda kaynak çekilmedi); moleküler bulutların sayısal sıcaklığı (OpenStax dışında bir kaynakta bulunamadı); nötron yıldızı birleşmesinin ürettiği altın miktarı.
