# d37 Jüpiter — kaynak tablosu

Biçim: iddia | kaynak URL | kaynaktaki ifade (kısa alıntı ya da değer; WebFetch özetinin aktardığı metin)
Türler: [W] bu oturumda WebFetch ile okundu; [P] proje dosyasında (d1, d3, d4, d5, d9, d11, d13, d16 kaynak tabloları) daha önce doğrulanmış satır; [H] python3 ile hesap; ÇIKARIM = kaynak ifadesinden mantıkla çıkan cümle.
Arama: d37 için 12 WebSearch (dilute core; GRS yaşı; GRS derinliği; manyetosfer; halkalar; SL9; kalkan hipotezi; Juno durumu ×2; Galileo sondası; büzülme hızı; bulut katmanları). İzin hatası veren ve yeniden denenmeyen: wis-wander.weizmann.ac.il (robots); news.berkeley.edu (yönlendirme döngüsü).

## Bölüm 0 — Gezegenlerin devi: sayılarla Jüpiter
| [W] Kütle 1898,13 × 10²⁴ kg; ekvator yarıçapı 71.492, kutup 66.854, ortalama 69.911 km; yoğunluk 1326 kg/m³ | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html | "Mass 1,898.13 × 10²⁴ kg; Equatorial radius (1 bar) 71,492 km; Polar radius 66,854 km; Volumetric mean radius 69,911 km; Mean density 1,326 kg/m³" |
| [P] Dünya yoğunluğu 5,51 g/cm³; Jüpiter 318 Dünya kütlesi | https://ssd.jpl.nasa.gov/planets/phys_par.html | d9 anahtar sayıları (5,51; 318) |
| [W] Yarı büyük eksen 5,20336 AB; yıldızıl dönem 4332,589 gün; dönme 9,9250 saat; eğiklik 3,13° | jupiterfact.html | "5.20336301 AU; 4,332.589 days; Sidereal rotation period 9.9250 hours; Obliquity to orbit 3.13°" |
| [H] 4332,589 / 365,25 = 11,86 yıl | — | hesap |
| [P] Dünya eğikliği 23,44° | https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html | d9 sözlüğü "Dünya'da 23,44°" |
| ÇIKARIM: 3,13° eğiklik → neredeyse mevsim yok | — | eğiklik değerinden; d1'deki mevsim açıklaması |
| [W] Ortalama çekim (1 bar) 25,92 m/s² | jupiterfact.html | "Mean gravity (1 bar): 25.92 m/s²" |
| [P] JPL ekvator çekimi 24,79 m/s² | https://ssd.jpl.nasa.gov/planets/phys_par.html | d9 satırı "Jupiter ... 24.79 [*]" |
| ÇIKARIM: ekvatordaki çekimin düşük olması uzaklık ve dönüşün savurmasından | — | fizik açıklaması; d38'deki savurma hesabıyla nicel olarak desteklendi |
| [W] Hacim 143.128 × 10¹⁰ km³ | jupiterfact.html | "Volume: 143,128 × 10¹⁰ km³" |
| [W] Dünya hacmi 108,321 × 10¹⁰ km³; ekvator yarıçapı 6378,137 km; dipol 0,306 G·Re³; güneş akısı 1361,0 W/m²; basıklık 0,003353 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Volume 108.321 × 10¹⁰ km³; Equatorial radius 6378.137 km; Dipole field strength 0.306 Gauss·Re³; Solar irradiance 1361.0 W/m²; Flattening 0.003353" |
| [H] 143.128 / 108,321 = 1321 | — | hesap |
| [W] NASA: içi boş kabuk olsaydı 1000 Dünya sığardı | https://science.nasa.gov/jupiter | "1,000 Earths could fit inside" |
| ÇIKARIM: kürelerin arasında boşluk kalır | — | geometri açıklaması |
| [P] Güneş kütlesi 1,988 × 10³⁰ kg | d4.json (d4_kaynak.md) | d4 akilda "1,988 × 10³⁰ kg" |
| [H] 1,988e30 / 1,89813e27 = 1047 | — | hesap |
| [P] Güneş–Jüpiter ortak kütle merkezi; Güneş'in hızı 12 yıllık döngüde ~12,4 m/s | d13.json / d13_kaynak.md; d3.json | d13: "Jüpiter, Güneş'in hızını yaklaşık 12 yıllık bir döngüde yaklaşık 12,4 m/s değiştirir" |

## Bölüm 1 — Neden basık?
| [H] 71.492 − 66.854 = 4638 km; 4638 / 6371 ≈ 0,73 (Dünya yarıçapının ~dörtte üçü) | — | hesap |
| [W] Basıklık 0,06487 | jupiterfact.html | "Flattening (ellipticity): 0.06487" |
| [W] Eylemsizlik momenti 0,254 | jupiterfact.html | "Moment of inertia (I/MR²): 0.254" |
| Düzgün kürede I/MR² = 0,4 | — | matematik (2/5) |
| [W] Hızlı dönüş ve düşük yoğunluk şekli ve çekim alanını bozar; bozulmadan merkezde yoğunlaşma çıkarılır (Satürn için) | https://www.britannica.com/place/Saturn-planet/The-interior | "Saturn's rapid rotation and low density distort both its shape and its gravitational field"; "substantially more centrally condensed than Jupiter" |
| [W] Satürn basıklığı 0,09796; eylemsizlik momenti 0,210 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html | "Ellipticity 0.09796; Moment of inertia 0.210" |
| [H] Örnek: 2π × 71.492 / 9,925 = 45.259 km/sa (12,57 km/s); 2π × 6378,137 / 23,9345 = 1674 km/sa; oran 27 | — | hesap; 23,9345 sa d9_kaynak (NSSDCA Dünya) |

## Bölüm 2 — Bulutların altında
| [W] Yüzey basıncı >1000 bar; 1 barda 165 K; 0,1 barda 112 K; 1 barda yoğunluk 0,16 kg/m³; ölçek yüksekliği 27 km | jupiterfact.html | "Surface pressure: greater than 1,000 bars; 165 K at 1 bar; Density at 1 bar 0.16 kg/m³; Scale height 27 km" |
| [H] 165 K = −108 °C | — | hesap |
| [W] H₂ %89,8 (±2), He %10,2 (±2); CH₄ 3000 ppm, NH₃ 260 ppm, HD 28, C₂H₆ 5,8, H₂O 4 ppm | jupiterfact.html | "H₂ 89.8%; He 10.2%; CH₄ 3,000 ppm; NH₃ 260 ppm; C₂H₆ 5.8 ppm; H₂O 4 ppm" |
| [P] Hidrojen derinde sıvılaşır; yolun ~üçte birinde metalik ve iletken | https://webarchive.library.unt.edu/eot2008/20080923101121/http:/solarsystem.nasa.gov/multimedia/downloads/11_Jupiter_Litho_FC.pdf | d9_kaynak: "At depths about a third of the way down, the hydrogen becomes metallic and electrically conducting." |
| [P] Merkez basıncı 50–100 milyon atmosfer | https://www.britannica.com/place/Jupiter-planet/The-interior | d9_kaynak: "The central pressure is in the range of 50–100 million atmospheres" |
| Ölçek yüksekliği tanımı (basıncın e ≈ 2,7 kat azaldığı yükseklik) | — | tanım |
| [W] Jüpiter'in güçlü çekimi bulut katmanlarını ~75 km'ye sıkıştırır | https://digfir-published.macmillanusa.com/universe10e/universe10e_ch12_5.html | "Its gravity squeezes all three cloud layers into a region only about 75 km deep" |
| [P] Hidrojen yakmak için ~0,08 M☉ = 80 Jüpiter; kahverengi cüce 13–80 Jüpiter | https://en.wikipedia.org/wiki/Main_sequence ; https://en.wikipedia.org/wiki/Brown_dwarf | d5_kaynak satır 58–59 |

## Bölüm 3 — Juno'nun sürprizi: seyrelmiş çekirdek
| [W] Klasik modeller: ağır elementler merkezde, zarf yalnız H-He | https://www.arxiv.org/pdf/2202.10041 | "a nearly pure heavy-element core surrounded by a H-He envelope" |
| [W] Juno çift ve tek çekim katsayılarını eşi görülmemiş doğrulukla ölçtü | aynı | "even and odd gravity harmonics with unprecedented accuracy" |
| [W] Birçok model sıkı çekirdek olmadan Juno'ya uyar; seyrelmiş çekirdek yarıçapın onlarca yüzdesine, belki yarısına | aynı | "Several structure models fit the Juno gravity data without a compact heavy-element core"; "extending to several tens of percent of its total radius, perhaps even beyond half the radius" |
| [W] Bölgenin içerdiği kütle ~%30, ~100 M⊕, kötü tanımlı | aynı | "about 30% of the total mass, i.e., of the order of 100 M⊕ but poorly defined" |
| [W] Küçük sıkı çekirdek henüz dışlanamadı | aynı | "It is yet to be determined whether Juno's gravity data can be used to exclude the existence of a small inner compact core." |
| [W] Liu ve ark. 2019 Nature: 10 ile birkaç on M⊕ ağır element, yarıçapın yarısına yakın; kafa kafaya çarpışma; milyarlarca yıl kalıcı | https://link.springer.com/article/10.1038/s41586-019-1470-2 | "distributed within a region extending to nearly half of Jupiter's radius"; "a sufficiently energetic head-on collision"; "persisting over billions of years" |
| [W] Alternatifler: uzun gezegencik birikimi, oluşum sonrası karışma; senaryo tekil değil | arXiv 2202.10041 | "~2-Myr extended planetesimal-accretion phase"; "clearly non-unique" |
| [W] Doppler izleme ile ivme "milimetre/saniyenin kesirleri" (yöntem, Cassini için anlatılmış) | https://www.sci.news/space/saturns-rings-age-06825.html | "acceleration down to a fraction of a millimeter per second" |
| [W] J2 = 14.736 × 10⁻⁶ | jupiterfact.html | "J2: 14,736 × 10⁻⁶" |
| [W] Rüzgâr derinliği Jüpiter ~3000 km (Satürn ~9000 km), çekim alanından | https://www.sci.news/space/saturns-ring-system-07295.html | "strong, deep differential rotation to roughly 9,000 km depth, compared with about 3,000 km for Jupiter" |
| [W] Juno Satürn için de benzer seyrelmiş çekirdek (Caltech) | https://www.astro.caltech.edu/news/saturn-makes-waves-in-its-own-rings | "Evidence from NASA's Juno mission suggests Jupiter may also have a similarly diluted core." |

## Bölüm 4 — Kendi ısısı
| [W] Güneş akısı 50,26 W/m²; kara cisim sıcaklığı 109,9 K; Bond albedosu 0,343 | jupiterfact.html | "Solar irradiance 50.26 W/m²; Black-body temperature 109.9 K; Bond albedo 0.343" |
| [P] Güneş'ten aldığının ~2 katı enerji yayar | https://www.britannica.com/place/Jupiter-planet/The-interior | d9_kaynak: "radiate about twice as much energy as it receives from the Sun" |
| [W] Kelvin-Helmholtz: soğuma iç basıncı düşürür, büzülme, ısınma | https://en.wikipedia.org/wiki/Kelvin%E2%80%93Helmholtz_mechanism | "The cooling causes the internal pressure to drop" |
| [W] Büzülme 2 cm/yıl (Caltech, haber) | https://www.inkl.com/news/jupiter-is-shrinking-and-used-to-be-twice-as-big-mind-boggling-study-reveals | "currently shrinking by about 2 centimeters per year, according to Caltech" |
| [ESKİ, v5 düzeltti: "2 cm açıkça fazla" sözü ders kitabının değil eski Wikipedia sürümünün kendi sesi; güncel sayfada yok] [W] AYRILIK: Irwin 2009: ~1 mm/yıl, iç ısı akısı 7,485 W/m²; 2 cm "açıkça fazla" | KH Wikipedia sayfası | "only 1 mm/year ... 7.485 W/m²"; "clearly too high" |
| [W] Batygin–Adams (Nature Astronomy): bulutsu dağılınca 2–2,5 kat büyük; alan ~50 kat güçlü; Amalthea ve Thebe yörüngeleri | inkl haberi | "2 to 2.5 times the current size"; "about 50 times stronger than today"; "orbits of Jupiter's moons Amalthea and Thebe" — yayın yılı haberde yok, derse yazılmadı |
| [P] 4,6 milyar yıl | d9 anahtar sayı | "~4,6 milyar yıl" |
| [H] 5,20² = 27,0; 1361 / 27,0 = 50,3 | — | hesap |
| [H] 0,657 × 50,26 / 4 = 8,26 W/m² (≈ 7,485 ile aynı mertebe) | — | hesap |

## Bölüm 5 — Kuşaklar, bölgeler, jetler
| [W] Bölge açık (beyaz/sarı), kuşak koyu (kırmızımsı kahve); Pioneer 1973 kuşaklar daha sıcak; kuşak alçalan, bölge yükselen | https://www.pas.rochester.edu/~blackman/ast104/jatmosphere.html | "the belts appear to be regions of descending gas" |
| [W] Her yarıkürede ~6 şerit, ters yönlü rüzgâr, sınırlarda çalkantı | aynı | "Each hemisphere has about six bands"; opposite directions; "strong shear and turbulence" |
| [W] Rüzgâr 30° altında 150 m/s'ye, üstünde 40 m/s'ye | jupiterfact.html | "up to 150 m/s below 30° latitude; up to 40 m/s above 30°" |
| [H] 150 m/s = 540 km/sa | — | hesap |
| [W] Jetler ~3000 km derin | https://edition.cnn.com/2021/10/28/world/juno-jupiter-nasa-great-red-spot-scn/index.html | "Zonal jets ... reach depths approaching 3,000 km" |
| [W] Amonyak izlenerek dolaşım; her yarıkürede 8 Ferrel benzeri hücre (Dünya'da 1), en az 30 kat derin | aynı | "eight Ferrel-like cells per hemisphere, compared with one per hemisphere on Earth"; "at least 30 times deeper" |
| [W] Üç bulut katmanı: amonyak, amonyum hidrosülfür, su | https://windows2universe.org/jupiter/atmosphere/J_clouds_decks.html | "The first clouddeck is made of ammonia clouds"; "second ... ammonium hydrosulfide"; "third ... ordinary water clouds" |
| [W] İkinci kaynak: amonyak buzu, amonyum hidrosülfür, buz-su karışımı "olduğu düşünülür" | Rochester | "believed to exist" |
| [W] Galileo sondası yalnız soluk bulut izi | Rochester | "Galileo's probe showed only faint signs of clouds" |
| [W] Renkler hâlâ bilmece; adaylar | Rochester | "still something of a mystery" |
| ÇIKARIM: katman sırası en üstte amonyak — iki kaynak da bu sırayla sayıyor; derinlik sırası açıkça yazmıyor, derste "kaynaklar bu sırayla sayar" denildi | — | — |

## Bölüm 6 — Bir sondanın 57 dakikası
| [W] Giriş 7 Aralık 1995; 57 dk 36 sn veri; "dry and windy"; sıcak nokta "atmosfer çölü" | https://phys.org/news/2020-12-juno-spacecraft-quarter-century-jupiter-mystery.html | "57 minutes, 36 seconds of data"; "dry and windy"; "atmospheric 'desert'" |
| [W] Giriş hızı 48 km/s; giriş sıcaklığı ~16.000 °C | https://en.wikipedia.org/wiki/Galileo_(spacecraft) | "at 48 kilometers per second"; "around 16,000 °C" |
| [W] ~200 km derine; beklenenden az su; Güneş'e benzer helyum; beklenenden az neon | https://www.missionjuno.swri.edu:443/legacy/atmospheric-sciences_galileo | "124 miles (200 kilometers) deep"; "much less water than scientists had expected"; "a similar amount of helium as the sun"; less neon |
| [W] Juno: sıcak noktalar daha geniş ve derin; kuzey ekvator kuşağı genel olarak kuru | phys.org | "much wider and deeper than anticipated"; "the entire northern equatorial belt is generally a very dry region" |
| [W] Helyum ve neon azalmış; mekanizma muhtemelen helyum hâl değişimi, büyük ölçüde bilinmiyor | arXiv 2202.10041 | "depletion of helium and neon"; "likely a helium phase transition ... remain largely unknown" |
| ÇIKARIM: iki kaynak birlikte → helyum Güneş'e yakın ama biraz az | — | — |
| [W] Mikrodalga radyometresi BKL derinliğini ölçtü | CNN 2021 | "measured with Juno's microwave radiometer" |

## Bölüm 7 — Büyük Kırmızı Leke
| [W] En hızlı rüzgâr ~450 km/sa; renk: amonyak buzu yükselir, morötesi değiştirir; 1879'da 39.000 km; bugün ~14.000 km, daha yuvarlak; GRL 16 Haziran 2024 | https://earthsky.org/space/jupiters-great-red-spot-is-190-years-old/ | "280 mph (450 km/h)"; "39,000 km"; "8,700 miles (14,000 km) wide and rounder" |
| [W] Rengin nedeni iyi anlaşılmamış; "en az 250 yıl" | https://www.missionjuno.swri.edu/key-terms/great-red-spot | "Scientists do not understand very well what causes the spot's reddish color"; "at least 250 years" |
| [W] 1979'da Dünya çapının iki katı; en az üçte bir küçüldü; derinlik 200–500 km (MWR); UUİ benzetmesi; kutup siklonları 8 (sekizgen) ve 5 (beşgen), beş yıl sonra aynı yerde | CNN 2021 | "shrunk by at least a third since 1979, when it was twice Earth's diameter"; "200 km to 500 km"; "as deep within Jupiter as the International Space Station is high"; "eight cyclonic storms in an octagon"; "five ... pentagon" |
| [P] 3 Nisan 2017'de 16.350 km | https://science.nasa.gov/photojournal/jupiters-great-red-spot-swallows-earth | d9_kaynak satır 120 |
| [P] Eski NASA kartı "300 yıldan uzun" | 11_Jupiter_Litho_FC.pdf (d9_kaynak) | "observed for more than 300 years" |
| [W] Cassini 1665 Kalıcı Leke; 1713'e kadar; 1831 yeni leke; "highly unlikely"; >190 yıl; oluşum: rüzgâr kararsızlığı, uzun hücre | https://www.livescience.com/space/jupiter/is-jupiters-great-red-spot-an-impostor-giant-storm-may-not-be-the-original-one-discovered-350-years-ago | "it is highly unlikely that the current Great Red Spot was the 'Permanent Spot'"; "exceeds 190 years" — NOT: Live Science bugünkü boyu "4,000 km (8,700 miles)" diye yanlış yazmış; 8700 mil = 14.000 km, EarthSky değeri kullanıldı |
| [W] Üç olasılık; modeller atmosfer hücresini destekler; öncül leke küçülür; Creti 1711 kırmızı gösteren ilk; Elger 1881 | EarthSky | "proto-Great Red Spot"; Creti's "first to show the spot as red" |
| [W] Yeni benzetimler planlanıyor: kaybolup yeniden oluşabilir mi | Live Science | "plans more simulations to see whether the spot could disappear ... and possibly re-form" |
| [H] 39.000/12.756 = 3,06; 16.350/12.756 = 1,28; 14.000/12.756 = 1,10; 25.000/145 = 172 km/yıl; 500/14.000 = 0,036; 28 × 0,036 = 1,0 cm | — | hesap |

## Bölüm 8 — Manyetosfer ve kutup ışıkları
| [W] Alan derinlerde üretilir; gezegenlerin en güçlü alanı; manyetosfer 5,3 milyon km, Jüpiter'in 150, Güneş'in ~15 katı; kuyruk Satürn yörüngesine; parçacıkların çoğu Io'dan; ışınım kuşakları Güneş dışında en güçlü; elektronik korumalı kapta; kutup ışıkları 10 kat parlak, 100 kat enerjik, güneş ışığından fazla enerji; "Ay kadar" | https://www.missionjuno.swri.edu/jupiter/magnetosphere/ | "generated deep inside the planet"; "strongest magnetic field of any planet"; "5.3 million kilometers"; "150 times wider than Jupiter itself and almost 15 times wider than the Sun"; "tail stretches all the way to Saturn's orbit"; "come from the volcanic gases spewing from Jupiter's moon Io"; "stronger than any in the solar system, except for the Sun"; "shielded container"; "10 times brighter and 100 times more energetic"; "as big as the moon" (sayfa başka yerde 21 milyon km de diyor; tutarsız, derste 5,3 kullanıldı) |
| [W] Manyetopoz 45–100 RJ; kuyruk Satürn yörüngesinin ötesine; dolunayın 5 katı; Io ≤1000 kg/s; plazma simidi; ~20.000 kat moment; ekvator alanı 4,170 G; iyonosfere 10–100 TW; 1955 dekametrik radyo ilk kanıt; Pioneer 10 Aralık 1973, 2,9 RJ | https://en.wikipedia.org/wiki/Io_plasma_torus (Magnetosphere of Jupiter'e yönlenir) | "from 45 to 100 RJ"; "five times larger than the full moon"; "as much as 1,000 kg of new material every second"; "~20,000 times larger"; "10–100 TW"; "1955"; "December 1973 ... 2.9 RJ" |
| [W] Dipol 4,30 G·RJ³; eğiklik 9,4°; yüzey alanı 4,0–13,0 G | jupiterfact.html | "Dipole field strength: 4.30 G·Rj³; tilt 9.4°; Surface field strength 4.0–13.0 G" |
| [P] Metalik hidrojen iletken (d9) | 11_Jupiter_Litho_FC.pdf | "metallic and electrically conducting" — alanın kaynağı olarak "en doğal aday" ifadesi ÇIKARIM |
| [P] Manyetosfer, plazma tanımları | d33 sözlüğü | — |
| [H] (4,30/0,306) × (71.492/6378,137)³ = 14,05 × 1408 = 19.790 | — | hesap |
| ÇIKARIM: görüntüler morötesi/kızılötesi (Juno sitesi bu dalga boylarında görüntüler anlatıyor) | Juno magnetosphere | "ultraviolet and infrared imaging" |

## Bölüm 9 — Halkalar
| [P] Voyager 1, 1979; Dünya'dan görülmez | d9_kaynak satır 351–352 | "Discovered in 1979 by NASA's Voyager 1"; "The ring is not visible from the Earth." |
| [W] JPL 15 Eylül 1998: kaynak dört küçük iç uydudan göktaşı çarpmasıyla kalkan toz; ana halka Adrastea ve Metis; tül halka iki halka, Amalthea ve Thebe; hale; buz yok, koyu kırmızımsı is; Adrastea ~8 km; 92.000–250.000 km; tebeşir tozu benzetmesi; toz yörüngeleri birkaç ayda salınır | https://webarchive.library.unt.edu/eot2008/20090119091727/http:/www.jpl.nasa.gov/news/releases/98/glrings.html | "dust knocked off its four small inner moons"; "likely that the main ring comes from Adrastea and Metis"; "two rings, one embedded within the other"; "no signs of ice"; "dark, reddish soot"; "about 8 kilometers"; "about 92,000 km ... to about 250,000 km"; "chalk dust"; "wobble back and forth in only a few months" |
| [W] Satürn halkaları ~%99,9 su buzu | https://en.wikipedia.org/wiki/Rings_of_Saturn | "About 99.9% water ice" |
| [H] 92.000/71.492 = 1,29; 250.000/71.492 = 3,50; Io 421.800/71.492 = 5,90 | — | hesap |

## Bölüm 10 — Uydular kısaca
| [P] 115 IAU uydusu | https://science.nasa.gov/jupiter/jupiter-moons/ | d9_kaynak satır 111 |
| [P] 1610 Galileo ve Marius bağımsız; dört ad | moons_of_jupiter_lithograph.pdf | d9_kaynak satır 121 |
| [P] Yörünge yarıçapları 421.800; 671.100; 1.070.400; 1.882.700 km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html | d3 (Dürbünle Kepler bölümü) |
| [W] Ganymede'nin kendi manyetik alanı (Galileo) | https://www.jpl.nasa.gov/missions/galileo/ | "a magnetic field generated by the moon Ganymede" |
| [H] 5,9; 9,4; 15,0; 26,3 RJ | — | hesap |

## Bölüm 11 — Shoemaker-Levy 9
| [W] Shoemakerlar ve Levy; 18 Mart 1993 fotoğrafı; 0,4 m Schmidt, Palomar; >20 parça; Temmuz 1992 gelgitle parçalandı; A–W; 1,5–2 km; 16–22 Temmuz 1994; "yük treni", "300 milyon atom bombası"; ateş sütunları 2000–3000 km, 30.000–40.000 °C; Galileo doğrudan gördü; Hubble, Ulysses, Voyager 2; yüksek irtifa rüzgârları ilk kez; H-He dışı elementleri taşıyan başlıca yol; iki cismin çarpışmasının ilk izlenişi | https://science.nasa.gov/solar-system/comets/p-shoemaker-levy-9 | "photograph taken on March 18, 1993"; "torn apart by tidal forces"; "1.5 to 2 km"; "July 16 to July 22, 1994"; "freight train"; "300 million atomic bombs"; "2,000 to 3,000 km"; "30,000 to 40,000 °C" |
| [W] AYRILIK: Britannica 25 Mart 1993; 46 cm Schmidt; 8 Temmuz 1992, 0,31 RJ ≈ 22.100 km; 21 parça; 1,6 km; G 350–600 m; 221.000 km/sa; G ≥ 48 milyar ton TNT; G izi Dünya çapından büyük, haftalarca; Galileo gece yüzünü gördü | https://www.britannica.com/print/article/687804 | "March 25, 1993"; "0.31 Jupiter radii, about 22,100 km"; "21 fragments"; "1.6 km"; "350–600 m"; "221,000 km ... per hour"; "at least 48 billion tons of TNT"; "larger than Earth's diameter"; "remained visible for weeks"; "night side" |
| [P] Gelgit kuvveti (d3) | d3.json | — |
| [W] Roche sınırı içinde buzlu cisimler toplanamaz | https://en.wikipedia.org/wiki/Rings_of_Saturn | "Within the Roche limit ... icy bodies cannot" |
| [P] Kurtulma hızı 59,5 km/s (NASA) ve 11,2 km/s Dünya | d9_kaynak; d16_kaynak | "59.5"; "11,186 km/s" |
| [H] 221.000/3600 = 61,4 km/s; 0,31 × 71.492 = 22.163 km | — | hesap |
| ÇIKARIM: düşen cisim en az kurtulma hızına yakın hızla çarpar | — | enerji korunumu (d3'teki kurtulma hızı tanımı) |

## Bölüm 12 — Kalkan mı?
| [P] Jüpiter asteroit kuşağında gezegen oluşumunu durdurdu | https://science.nasa.gov/solar-system/asteroids/facts/ | d9_kaynak satır 208 |
| [P] Güneş–Jüpiter L4/L5'te >1 milyon Truva | d3.json | d3 Lagrange bölümü |
| [W] Horner ve Jones 2008 IJA 7: kalkan uzun süre varsayıldı; ~10⁵ asteroit, 10 milyon yıl, 0,01–2,00 MJ; dev gezegen çarpmaları belirgin artırabilir; zirve ~0,20 MJ; gerçek Jüpiter ~0,05 MJ gibi; kısa dönemli kuyruklu yıldızlarda benzer; Oort bulutu planlandı; "under serious question" | https://arxiv.org/pdf/0806.2795 | "It has long been assumed that the giant planet Jupiter acts as a shield"; "can act to enhance significantly the impact rate"; "the status of Jupiter as a shield is now under serious question" |

## Bölüm 13 — Araçlar
| [W] Pioneer 10 Aralık 1973 | Magnetosphere of Jupiter (Wikipedia) | "December 1973" |
| [W] Galileo 18 Ekim 1989 fırlatma, 7 Aralık 1995 varış, 21 Eylül 2003 Europa'yı korumak için; Europa okyanus kanıtı, Io volkanizması, Ganymede alanı | https://www.jpl.nasa.gov/missions/galileo/ | "launched on October 18, 1989"; "arrived ... on December 7, 1995"; "to prevent an unwanted impact with Europa" |
| [W] Juno 5 Ağustos 2011 fırlatma | Juno legacy (Galileo sondası sayfası) | "August 5, 2011 launch of Juno" |
| [P] Juno 4 Temmuz 2016 PDT / 5 Temmuz UTC; amaç köken ve evrim | https://www.jpl.nasa.gov/news/nasas-juno-spacecraft-in-orbit-around-mighty-jupiter/ | d9_kaynak satır 126–127 |
| [ESKİ, v5 dersten çıkardı: Wikipedia 37 tur der; yerine NASA görev sayfası] [W] 33 tur için tasarlandı | https://www.downtoearth.org.in/science-technology/junos-last-orbit-nasas-jupiter-mission-set-to-end-next-month | "Originally designed for 33 orbits" |
| [W] Uzatma 30 Eylül 2025'e kadar; 2026 bütçe önerisinde sıfır; kapanma; NASA söyleyemiyor (6 Ekim 2025) | https://www.space.com/space-exploration/missions/nasas-juno-probe-orbiting-jupiter-may-have-come-to-an-end-but-no-one-can-confirm?sfnsn=mo | "through Sept. 30, 2025"; "zeroed-out"; "unable to say whether Juno is still operating" |
| [ESKİ, v5 yerine NASA/JPL kaynağı koydu] [W] Mart 2026: hâlâ etkin, gelecek bütçeye bağlı | https://news.flalingo.com/article/nasa-s-juno-probe-faces-cancellation-despite-groundbreaking-jupiter-discoveries-mn5z2vih | "continues to yield extraordinary scientific discoveries" (25 Mart 2026; zayıf kaynak, derste "bir haber" diye anıldı) |
| BULAMADIM (v5 yeniden aradı, hâlâ yok): Ekim 2026 itibarıyla Juno'nun durumunu söyleyen resmî NASA açıklaması | — | derste "askıda" denildi |
| [P] Europa Clipper 14 Ekim 2024 | https://science.nasa.gov/jupiter | d9_kaynak satır 128 |

## Bölüm 14 — Açık sorular
Bu bölüm yukarıdaki satırların özetidir; yeni olgu yok. Sánchez-Lavega'nın planlanan benzetimleri Live Science satırında.

## Bölüm 15 — İstanbul'dan Jüpiter
| [W] Güneş, Ay, Venüs'ten sonra 4. en parlak; karşı konum 11 Şubat 2027 00.21 UTC; Aslan; −2,5 kadir; 44,2″; en yakın 10 Şubat 2027, ~652 milyon km, 36 ışık dakikası; dürbünde parlak disk ve uydular | https://earthsky.org/astronomy-essentials/jupiter-at-opposition/ | "4th-brightest object in the sky, after the sun, moon and planet Venus"; "February 11, 2027, at 0:21 UTC"; "Magnitude -2.5"; "44.2 arcseconds"; "405 million miles (652 million km)"; "bright disk" |
| [P] Türkiye UTC+3 | d22 / d11_kaynak (Daylight saving time in Turkey) | "UTC+03:00" |
| [W] 24 Eylül 2026 Aslan'a girdi, yıl sonuna kadar; sabah 19 Ağustos–31 Aralık; 2026'da İkizler → Yengeç (22 Haziran) → Aslan | https://space.com/stargazing/what-to-expect-from-the-planets-in-2026-key-dates-and-sky-events | "Leo on Sept. 24"; "Mornings ... Aug. 19 to Dec. 31"; "starts the year in Gemini"; "Cancer on June 22" |
| [W] Görünür çap 30,5–50,1″; sinodik dönem 398,88 gün | jupiterfact.html | "Apparent diameter 30.5″ ... 50.1″"; "Synodic period 398.88 days" |
| [P] Galileo uyduları kent göğünde sıradan dürbünle; dürbün sabitleme; güçlü dürbün iyi koşulda bir iki kuşak | d3, d11 (Wikipedia Galilean moons, Binoculars) | d11_kaynak |
| [P] Küçük teleskop basık disk ve bantlar | https://www.rmg.co.uk/stories/space-astronomy/planet-jupiter-gas-giant-king-planets | d9_kaynak satır 358 |
| [P] Dolunay 1896″ | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html | d1/d10 kaynak |
| [H] 206.265 × 139.822 / 652e6 = 44,23″ (ekvator çapıyla 45,2″); 652e6/299.792 = 2175 s = 36,2 dk; 1896/44,2 = 42,9; 44,2 × 7 = 309″; 50,1 × 7 = 351″ < 1896″; 11 Şubat 2027 + 398,88 g = 15–16 Mart 2028 (tahmin); 360/11,862 = 30,3° | — | hesap |
| [P] Dürbün ve teleskop deneyi; Gökyüzü sekmesi | dersler.js DENEY_AD | "durbun: 'Dürbün ve teleskop'" |

## Bağımsız doğrulama (v5, 2026-10-30)

[DOĞ] = doğrulama ajanı bu oturumda WebFetch ile okudu; [H] = python3 hesabı.

| İddia | Kaynak URL | Kaynaktaki ifade / hesap |
|---|---|---|
| [DOĞ] NSSDCA Jüpiter satırlarının hepsi (kütle, hacim, yarıçaplar, 1326, 25,92, 59,5, 0,343, 50,26, 109,9, 0,254, J2 14.736, basıklık 0,06487, 9,9250 sa, 3,13°, 398,88 g, 30,5–50,1″, >>1000 bar, 165 K, 0,16 kg/m³, 27 km, 150/40 m/s, bileşim, 4,30 G·Rj³, 9,4°, 0,119 Rj, 4,0–13,0 G) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html | alıntılar birebir tuttu |
| [H] DÜZELTME: 24,79 ile 25,92 farkı dönüşün savurmasından değil, yarıçap farkından: ikisi de GM/R²; 25,92 × (69.911/71.492)² = 24,79 | — | hesap; JPL GM/R_ekv² = 126.686.534/71.492² = 24,79 (savurma katılmamış) |
| [DOĞ] Bulut tepesindeki alan Dünya'nınkinin 16–54 katı; 1000 Dünya sığar; BKL "300 yıldan uzun" (sayfa hâlâ böyle diyor) | https://science.nasa.gov/jupiter/jupiter-facts/ | "16 to 54 times as powerful as that of the Earth" |
| [DOĞ] DÜZELTME: Büzülme ~1 mm/yıl, Irwin 2009 (güncel Wikipedia); "clearly too high" ifadesi eski sürümde makalenin kendi sesi, ders kitabına ait değil | https://en.wikipedia.org/wiki/Kelvin%E2%80%93Helmholtz_mechanism | "approximately 1 mm/year"; "7.485 W/m2" |
| [DOĞ] 2 cm/yıl (Caltech'e atfen); Batygin–Adams Nature Astronomy, 2–2,5 kat, ~50 kat alan, Amalthea ve Thebe | https://www.inkl.com/news/jupiter-is-shrinking-and-used-to-be-twice-as-big-mind-boggling-study-reveals | "shrinking by about 2 centimeters per year" |
| [H] Fizik sağlaması: L = 4πR² × 7,5 W/m² ≈ 4,6×10¹⁷ W; dR/dt ≈ L / (0,3 GM²/R²) ≈ 1 mm/yıl — ölçülen ısı akısı 1 mm ile uyumlu | — | kaba virial hesap (derse yazılmadı) |
| [DOĞ] Helled ve ark.: yarıçapın onlarca yüzdesi, belki yarısından fazlası; ~%30 kütle, ~100 M⊕, kötü tanımlı; küçük sıkı çekirdek dışlanamaz; He ve Ne azalması, He hâl değişimi; "unprecedented accuracy" | https://arxiv.org/pdf/2202.10041 | birebir tuttu |
| [DOĞ] Liu ve ark. Nature 572, 14 Ağustos 2019: 10 ile birkaç on M⊕; yarıçapın yarısına yakın; kafa kafaya çarpışma; milyarlarca yıl | https://www.nature.com/articles/s41586-019-1470-2 | "ten to a few tens of Earth masses"; "nearly half of Jupiter's radius" |
| [DOĞ] Galileo sondası helyum kütle payı 0,234 ± 0,005, ilk değerden "slightly lower"; neon Güneş'in 0,10'u; sıcak noktalar bulutsuz; bulutlar amonyak 0,6–0,9, NH₄SH 1–2, su 3–7 bar | https://en.wikipedia.org/wiki/Atmosphere_of_Jupiter | "slightly lower than the Solar System's primordial value"; "severe depletion of neon" |
| [DOĞ] Juno eski sayfası: 200 km, beklenenden az su, Güneş'e benzer helyum, az neon | https://www.missionjuno.swri.edu:443/legacy/atmospheric-sciences_galileo | birebir tuttu (süreyi "58 minutes" diye yuvarlar) |
| [DOĞ] Sánchez-Lavega ve ark., GRL (EurekAlert 17 Haz 2024; EarthSky 16 Haz): Kalıcı Leke 1665–1713; 1831 ve sonrası; "at least 190 years"; 1879'da 39.000 km; bugün 14.000 km; rüzgâr kararsızlığı | https://www.eurekalert.org/news-releases/1048686 | "It was not until 1831 and later years" |
| [DOĞ] EarthSky: 450 km/sa; renk amonyak buzu + morötesi; Creti 1711 "1st depiction ... as red"; Elger 1881; öncül leke | https://earthsky.org/space/jupiters-great-red-spot-is-190-years-old/ | DÜZELTME: Creti'nin 1711 tablosu, 2024 sonucuna göre Kalıcı Leke'yi gösterir; ders buna göre yazıldı |
| [DOĞ] CNN 2021: 200–500 km, UUİ benzetmesi, 1979'da iki Dünya çapı, ≥1/3 küçülme, jetler ~3000 km, 8 Ferrel benzeri hücre, ≥30 kat derin, 8 ve 5 siklon | https://edition.cnn.com/2021/10/28/world/juno-jupiter-nasa-great-red-spot-scn/index.html | birebir tuttu |
| [DOĞ] DÜZELTME: Juno sitesi manyetosfer için hem 5,3 milyon km hem ~21 milyon km verir; "150 kat Jüpiter, ~15 kat Güneş" ikincisine uyar (21e6/142.984 = 147; 21e6/1,39e6 = 15) | https://www.missionjuno.swri.edu/jupiter/magnetosphere/ | "About 5.3 million kilometers ... wide on average"; "about 21 million kilometers (12 million miles) wide" |
| [DOĞ] Magnetosphere of Jupiter: 45–100 RJ; ~20.000 kat moment (girişte ~18.000); 4,170 G; 1000 kg/s; 10–100 TW; 1955 DAM; Pioneer 10 Aralık 1973, 2,9 RJ; dolunayın 5 katı | https://en.wikipedia.org/wiki/Magnetosphere_of_Jupiter | birebir tuttu (URL düzeltildi; eski Io_plasma_torus yönlendirmesiydi) |
| [DOĞ] SL9 keşif: Wikipedia 24 Mart 1993 gecesi, 46 cm Schmidt; ön görüntüler 15, 17, 19 Mart; Jüpiter'in çevresinde dolanıyordu; güney yarıküreye çarptı; ~60 km/s | https://en.wikipedia.org/wiki/Comet_Shoemaker%E2%80%93Levy_9 | "found on the night of March 24, 1993"; "had been captured by Jupiter and was orbiting the planet" |
| [DOĞ] Britannica: 25 Mart 1993; 8 Temmuz 1992, 0,31 RJ ≈ 22.100 km bulut tepesinin üstünde; 21 parça; 1,6 km; G 350–600 m, ≥48 milyar ton TNT; 221.000 km/sa | https://www.britannica.com/print/article/687804 | birebir tuttu. NOT: Wikipedia yakın geçişi 7 Temmuz, "40.000 km'nin biraz üstü" verir; derste Britannica tutuldu |
| [DOĞ] NASA SL9: "Mar. 18, 1993" fotoğrafı; 1,5–2 km; 300 milyon atom bombası; 2000–3000 km, 30.000–40.000 °C; ilk kez; H-He dışı elementler | https://science.nasa.gov/solar-system/comets/p-shoemaker-levy-9 | 18 Mart başka kaynakta doğrulanamadı → derste "doğrulayamadım". NASA'nın element cümlesine "bugünkü atmosfer için" yorumu eklendi (iç kısımdaki ağır elementler oluşumdan, bölüm 3) |
| [DOĞ] Horner ve Jones: 10⁵ cisim, 10 milyon yıl, 0,01–2,00 MJ, zirve ~0,20 MJ, Jüpiter ≈ 0,05 MJ kalkanı, SPC benzer, "under serious question" | https://arxiv.org/pdf/0806.2795 | birebir tuttu |
| [DOĞ] Juno: NASA görev sayfası "Active Mission", son güncelleme 4 Temmuz 2026; ana görev başta 2017'de bitecekti, sonra Temmuz 2021, sonra 2025 | https://science.nasa.gov/mission/juno/ | "Active Mission"; "NASA extended its stay to 2025" |
| [DOĞ] JPL PIA26751: Thebe görüntüsü 1 Mayıs 2026 yakın geçişi, yayın 4 Mayıs 2026 | https://www.jpl.nasa.gov/images/pia26751-nasas-juno-misson-captures-jupiter-moon-thebe/ | "during a close pass on May 1, 2026" |
| [DOĞ] NASA blog 3 Haziran 2026 (Juno kozmik ışın sonucu) | https://science.nasa.gov/blogs/science-news/2026/06/03/nasas-juno-reveals-new-insights-into-cosmic-ray-origins/ | tarih URL'den |
| Wikipedia: ikinci uzatma Ekim 2025'te başladı, ~Eylül 2028'e kadar; NASA kaynağıyla doğrulanamadı, derse yazılmadı | https://en.wikipedia.org/wiki/Juno_(spacecraft) | "began in October 2025 with a planned three-year duration" |
| BULAMADIM: Temmuz–Ekim 2026 arası Juno'nun durumunu ya da görev bitişini söyleyen NASA açıklaması (2 arama) | — | derste "askıda" |
| [DOĞ] EarthSky karşı konum: 11 Şub 2027 00.21 UTC, Aslan, −2,5, 44,2″, 10 Şub 652 milyon km, 36 ışık dk, dürbünde "bright disk" ve uydular (kuşaklardan söz etmiyor); 4. en parlak | https://earthsky.org/astronomy-essentials/jupiter-at-opposition/ | birebir tuttu |
| [P] DÜZELTME: Jüpiter "yıl sonuna kadar sabah göğünde" değil; Urania hesabı (gok.js): 29 Eki doğuş 01.26, 31 Ara 21.27; Aslan'a 23 Eyl ~16 UT | d9_kaynak.md v3 [GOK] satırları | d9 ile tutarlı hâle getirildi |
| [P] Yüksek büyütmeli dürbün bir iki kuşak gösterebilir → 7×50 için "bonus" (soru 13 cevabı d11 ile hizalandı) | https://en.wikipedia.org/wiki/Binoculars | "High-power binoculars can sometimes show one or two cloud belts" |
| [H] Bütün örnekler yeniden hesaplandı: 1321; 45.259 km/sa; 0,0649; 1047; 50,27; 8,26; 3,06/1,28/1,10; 172 km/yıl; 0,036; 19.790; 5,90/9,39/14,97/26,33; 1,29/3,50; 61,4; 22.163; 44,23″; 36,2 dk; 42,9; 309″; 15 Mart 2028; 30,3° | — | hepsi tuttu |
| Sözlük çakışması: "Sıcak nokta" tanımı d36 (volkan), d37 (Jüpiter), d48 (radyo galaksisi) anlamlarını kapsayacak biçimde genişletildi. "Ölçek yüksekliği" tanımı zaten atmosfer ve galaksi diskini kapsıyor | — | NOT: müfredat sırasında d36 d37'den önce; sozluk_yap.py ilk dersin tanımını tutar → d36'nın daha dar tanımları kazanır (d36 bu görevin dışında) |
