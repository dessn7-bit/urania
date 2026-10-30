# d33 — Elektrik, manyetizma ve ışık: kaynak listesi

Tarih: 2026-10-30. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
[B] = bu oturumda WebFetch ile okundu (alıntılar WebFetch özet modelinin aktardığı metindir; doğrulama ajanı bir kez daha bakmalı); [N] = NIST CODATA tablosu bu oturumda curl ile indirildi; [Ö] = projede önceden doğrulanmış (başka dersin kaynak dosyası); [H] = bu derste yapılan hesap (python3 ile yeniden yapıldı); [V] = hesap için seçilmiş varsayım; [K] = kaynaklı bir yasanın ya da tanımın sözle açıklaması (dış kaynakta ayrıca aranmadı, doğrulama ajanı bakmalı).
Kısaltmalar: HME = https://en.wikipedia.org/wiki/History_of_Maxwell%27s_equations ; DYN = https://en.wikipedia.org/wiki/A_Dynamical_Theory_of_the_Electromagnetic_Field (IPFS kopyası okundu: https://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq.ipfs.4everland.io/wiki/A_Dynamical_Theory_of_the_Electromagnetic_Field.html) ; APS = https://www.aps.org/apsnews/2016/06/coulomb-measures-electric-force ; MAG = https://nationalmaglab.org/magnet-academy/history-of-electricity-magnetism/timeline/1820-1829/ ; GIL = https://en.wikipedia.org/wiki/William_Gilbert_(physicist) ; NIST = https://physics.nist.gov/cuu/Constants/Table/allascii.txt ; EIA = https://www.eia.gov/energyexplained/electricity/how-electricity-is-generated.php ; WS = https://www.worldstandards.eu/electricity/plug-voltage-by-country/turkey/ ; JAN = https://en.wikipedia.org/wiki/Karl_Guthe_Jansky ; SYN = https://en.wikipedia.org/wiki/Synchrotron_radiation ; CHA = https://chandra.harvard.edu/photo/0052/what.html ; EMF = https://en.wikipedia.org/wiki/Earth%27s_magnetic_field (WebFetch https://en.wikipedia.org/wiki/Geomagnetic yönlendirmesiyle) ; HAO = https://www2.hao.ucar.edu/education/scientists/george-ellery-hale-1868-1938 ; RAD = https://radiopaedia.org/articles/58849 ; UT = https://www.universetoday.com/articles/how-do-microwaves-work ; FAR = https://brendanjameslynskey.github.io/Historical_Physicists/Faraday ; NASAEM = https://science.nasa.gov/ems/02_anatomy/

## Bölüm 0 — Kehribardan prize
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Gilbert, De Magnete 1600; kehribarla durgun elektrik; electricus "kehribar gibi"; kehribar Yunanca elektron; "electricity" buradan; terrella deneyleriyle Dünya'nın kendisi mıknatıs | GIL | [B] "remembered today largely for his book De Magnete (1600)" ; "studied static electricity using amber" ; Neo-Latin "electricus," meaning "like amber" ; "amber is called elektron in Greek, so Gilbert decided to call its effect the electric force" ; "he concluded that Earth was itself magnetic" |
| Gilbert 1544?–1603, Colchester doğumlu, İngiliz | GIL | [B] "24 May 1544? – 30 November 1603" ; Colchester, London |
| Türkiye 230 V, 50 Hz | WS | [B] "the voltage in Turkey is 230 volts and the frequency is 50 Hz" |
| Dünyada elektriğin çoğu türbinli santrallerde; Faraday 1831 ilkesi jeneratörlerin çoğunun temeli | EIA | [B] "Most U.S. and world electricity generation is from electric power plants that use a turbine" ; "He found that moving a magnet inside a coil of wire makes (induces) an electric current flow through the wire." |
| Maxwell 1860'lar–1870'ler, İskoç | NASAEM | [Ö] d2_kaynak.md: "In the 1860's and 1870's, a Scottish scientist named James Clerk Maxwell developed a scientific theory" |

## Bölüm 1 — Elektrik yükü
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| e = 1,602176634 × 10⁻¹⁹ C, kesin | NIST | [N] "elementary charge 1.602 176 634 e-19 (exact) C" |
| [H] 1 / e = 6,2415 × 10¹⁸ elektron/C | NIST | hesap |
| İki çeşit yük, aynılar iter zıtlar çeker; proton artı, elektron eksi, eşit büyüklük | APS ; NIST | [B] APS: "For like charges ... inversely proportional" ve "the attraction between opposite charges" (itme/çekme) ; [K] işaretler ve eşitlik: e hem proton hem elektronun yükü (NIST "elementary charge") |
| Sürtünmeyle elektron aktarımı (kazak), kıvılcım | — | [K] gündelik açıklama; sayısal iddia yok |

## Bölüm 2 — Coulomb yasası ve alan
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Coulomb 1736–1806; 1785 anıları; burulma terazisi; gümüş, bakır ya da ipek tel; yüklü öz top; açıdan kuvvet | APS | [B] "suspended a needle on a fine fiber of silver, copper, or silk" ; "The calibrated torsion balance measured the force needed to twist the needle through a given angle." ; memoirs 1785 ; 1736–1806 ; Martinique fort (mühendis) |
| Aynı yükler: merkezler arası uzaklığın karesiyle ters; ikinci bağımsız yöntem (salınan iğne, içi boş küre); zıt yükler de ters kare | APS | [B] "is inversely proportional to the square of the distance between the centers of the two globes" ; second independent method with oscillating needle and hollow charged sphere ; opposite charges "is as the inverse square of the distance" |
| k = 1/(4π ε₀) = 8,98755 × 10⁹; ε₀ = 8,8541878188 × 10⁻¹² F/m | NIST | [N] "vacuum electric permittivity 8.854 187 8188 e-12 F m^-1" ; [H] |
| Faraday kuvvet çizgileri; resimle düşündü; 1791–1867 | HME ; FAR | [B] HME: in 1831 Faraday "proposed lines of forces to describe it" ; FAR: "Faraday thought in pictures, not equations." ; "bundles of lines stretching through space" ; "1791 – 1867" |
| [H] Örnek oranı: k e² / (G m_e m_p) = 2,2687 × 10³⁹ | NIST ; sabitler.json | [N] "electron mass 9.109 383 7139 e-31 kg" ; "proton mass 1.672 621 925 95 e-27 kg" ; G = 6,67430 × 10⁻¹¹ (NIST Value?bg, sabitler.json) |

## Bölüm 3 — Neden fark etmiyoruz?
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Artı ve eksi yüklerin dengelenmesi; kütleçekiminde eksi kütle yok | — | [K] Bölüm 1–2 satırlarından akıl yürütme |
| Kimya ve atom bağları elektrik çekimine dayanır; ayrıntı kuantum (d28) | — | [K] kavram açıklaması |
| Koronal kütle atımı plazma ve manyetik alan bulutu | d4_kaynak.md | [Ö] d4 "Patlamalar, Güneş rüzgârı ve kutup ışıkları" satırları (NASA) |

## Bölüm 4 — Akım
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Ohm 1827, "The Galvanic Circuit Investigated Mathematically", Ohm yasasının bütün bileşenleri | MAG | [B] Ohm (1827) published The Galvanic Circuit Investigated Mathematically; "includes all of the components of Ohm's law" |
| 230 V, 50 Hz | WS | [B] yukarıda |
| [V][H] 2000 W ÷ 230 V = 8,70 A ; 1 A → 6,24 × 10¹⁸ e/s ; 3600 × 6,2415e18 = 2,25 × 10²² | NIST | e değeri ; ısıtıcı gücü seçilmiş varsayım |
| Amper = C/s, volt, watt = J/s tanımları | — | [K] birim tanımları |

## Bölüm 5 — Ørsted
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Ørsted 1820, ders sırasında, pusula iğnesi tele dik | MAG | [B] "notices during one of his lectures" that a compass needle "aligns itself perpendicularly to a current-carrying wire" |
| Ørsted Danimarkalı (1777–1851) | https://physics.it.com/physicists/hans-christian-orsted | arama sonucu başlığı: "§ PHYSICIST · 1777–1851 · DANISH" (sayfa açılmadı; doğrulama ajanı bakmalı) |
| Ampère 1820: paralel teller aynı yönde çeker, zıt yönde iter | MAG | [B] "parallel wires with currents flowing through them attract each other when the currents flow in the same direction" ; repel in opposite directions |
| Arago 1820: demir tozları telin çevresinde halka, akım kesilince dağılır | MAG | [B] "unmagnetized iron filings orient themselves in a circle around a copper wire through which an electric current flows" ; scatter when current stops |
| Faraday 1821 dönme hareketi, ilkel motor | MAG | [B] "electricity can produce rotary motion" ; one of the first primitive electric motors |
| Sturgeon 1825 ilk kullanışlı elektromıknatıs, 20 katı | MAG | [B] "develops and exhibits the first practical electromagnet, which is strong enough to support 20 times its own weight" |
| Dünya yüzeyi ~22–67 μT (ayrıca 25.000–65.000 nT = 0,25–0,65 G); güçlü buzdolabı mıknatısı ~10.000 μT (100 G) | EMF | [B] "ranges between approximately 22 and 67 μT (0.22 and 0.67 G)" ; 25,000 to 65,000 nT, 0.25 to 0.65 G ; "a strong refrigerator magnet has a field of about 10,000 μT (100 G)" |
| MR çoğunlukla 1,5 T ya da 3 T; Dünya alanı MR'dan beş basamak zayıf | RAD | [B] "Most current medical magnetic resonance imaging (MRI) units utilize 1.5 T or 3 T field strengths." ; "five orders of magnitude weaker than the magnets used for MRI" |
| [H] 0,01/5e-5 = 200 ; 1,5/5e-5 = 30.000 ; 3/5e-5 = 60.000 ([V] 50 μT orta değer) | — | hesap |

## Bölüm 6 — Faraday'ın keşfi
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| 29 Ağustos 1831; demir halka, iki sargı; açma/kapamada kısa akım | FAR | [B] "On 29 August 1831" ; two coils wound on an iron ring; brief current when the current in the other was switched on or off |
| 1831 indüksiyon | HME ; EIA | [B] "In 1831 Faraday discovered electromagnetic induction" ; EIA: Faraday's 1831 finding |
| Mıknatısı sargıya itmek akım doğurur (haftalar içinde) | FAR ; EIA | [B] pushing a bar magnet into a solenoid, within weeks ; EIA: "moving a magnet inside a coil of wire makes (induces) an electric current" |
| Faraday diski: mıknatıs kutupları arasında dönen bakır disk, sürekli akım, ilk homopolar jeneratör; 1831 | FAR ; https://rallypoint.com/shared-links/michael-faraday-s-generator | [B] "a copper disc spun between magnetic poles, producing a continuous current" ; "first homopolar generator" ; arama sonucu başlığı: "On October 28, 1831, Michael Faraday demonstrated his dynamo invention" |
| Transformatör: ortak demir çekirdekte iki sargı, değişen akım gerekir | — | [K] halka deneyinden açıklama |

## Bölüm 7 — Jeneratörler
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Modern jeneratörde elektromıknatıs; rotor stator içinde döner | EIA | [B] modern generators use electromagnets; spinning rotor inside stationary coils (stator) |
| Türbin su, buhar ya da yanma gazlarıyla döner, rotora bağlı | EIA | [B] turbines spun by water, steam, or combustion gases, turning the generator's rotor |
| 2022 ABD: buhar türbinleri ~%42, rüzgâr ~%10 | EIA | [B] "accounted for about 42% of U.S. electricity generation in 2022" ; wind about 10% |
| Güneş panelleri türbinsiz | EIA | [B] PV "converting sunlight directly into electricity without a turbine" |
| [H] 1/50 = 0,02 s ; 299.792.458 / 50 = 5.995.849 m | NIST (c) | c kesin |
| Dünya ortalama yarıçapı 6371 km | d23_kaynak.md | [Ö] "Volumetric mean radius: 6371.000 km" (NASA Earth Fact Sheet) |

## Bölüm 8 — Maxwell'in eksik parçası
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| 1861–62 "On Physical Lines of Force"; Ampère yasasına yer değiştirme akımı eklendi | HME | [B] "He added the displacement current term to Ampère's circuital law" ; Equation (112) "Ampère's circuital law, with Maxwell's addition of displacement current" |
| Toplam akım = iletim akımı + ∂D/∂t | HME | [B] tablo (WebFetch aktarımı) |
| Değişen manyetik alan elektrik alanı, o da manyetik alan doğurur | NASAEM | [Ö] d2_kaynak.md / d2.json "Işık: hem dalga hem parçacık" |
| Dört denklemin sözle açıklaması; kondansatör düşünce deneyi | HME | [B] denklemlerin adları (Gauss, Gauss manyetizma, Faraday, Ampère–Maxwell) ; [K] sözle açıklamalar ve kondansatör örneği |
| 1865 makalesinde yirmi denklem; 1884 Heaviside (Gibbs, Hertz ile) dörde indirdi | HME ; DYN | [B] "it was not until 1884 that" Heaviside, with Gibbs and Hertz, "grouped the twenty equations together into a set of only four" ; DYN: twenty equations in part III |

## Bölüm 9 — Hesaptan çıkan ışık hızı
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Weber ve Kohlrausch 1855; elektromanyetik/elektrostatik yük birimi oranı; hız birimi; ~3,107 × 10⁸ m/s; ışığa bağlamadılar | HME | [B] "The discovery of this relationship started in 1855." ; ratio has units of velocity ; 3.107×10⁸ m/s ; they did not make the connection to light |
| Maxwell 1861 sonunda sonuçlara baktı, ışık hızına bağladı, ışığın elektromanyetik olduğu sonucuna vardı | HME | [B] "In late 1861, Maxwell looked up their results ... linked them to the speed of light, and concluded that light is electromagnetic radiation" (WebFetch aktarımı) |
| Makale 27 Ekim 1864'te gönderildi, 8 Aralık 1864'te okundu, 1865'te yayımlandı; ışık "alan içinde elektromanyetik yasalara göre yayılan elektromanyetik bozulma" | DYN | [B] sent 27 October 1864, first read 8 December 1864, approved 15 June 1865, Philosophical Transactions ; "an electromagnetic disturbance propagated through the field according to electromagnetic laws" |
| Hertz 1887 Maxwell'in dalgalarını gösterdi; radyo dalgaları ışık hızında | https://imagine.gsfc.nasa.gov/science/toolbox/history_multiwavelength1.html ; NASAEM | [Ö] d2_kaynak.md: "In 1887 Heinrich Hertz demonstrated the existence of the waves predicted by Maxwell" ; "the velocity of radio waves was equal to the velocity of light!" |
| μ₀ = 1,25663706127 × 10⁻⁶ N/A²; ε₀ = 8,8541878188 × 10⁻¹² F/m | NIST | [N] "vacuum mag. permeability 1.256 637 061 27 e-6 N A^-2" ; "vacuum electric permittivity 8.854 187 8188 e-12 F m^-1" |
| [H] 1/√(μ₀ε₀) = 299.792.457,9998 m/s ; 3,107e8 / c = 1,0364 (%3,6) | NIST | hesap |

## Bölüm 10 — Işık nasıl doğar
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Mikrodalga fırın ~2,45 GHz; su molekülleri dipol, değişen alanla döner, sürtünme benzeri ısı | UT | [B] "electromagnetic waves possessing frequencies around the 2.45 GHz range" ; water molecules dipoles rotate as field changes ; "The agitated water molecules would then possess heat energy that can rub off (much like friction) to nearby molecules." |
| [H] 299.792.458 / 2,45e9 = 0,1224 m ; 0,122 / 550e-9 = 222.000 | — | hesap; görünür ışık 380–700 nm d2'de |
| Hertz radyo dalgalarını üretip algıladı | NASAEM | [Ö] "applied Maxwell's theories to the production and reception of radio waves" |
| Salınan yük → dalga; anten, alıcı | — | [K] Maxwell denklemlerinin (Bölüm 8–9) sözle sonucu |

## Bölüm 11 — Radyo astronomi
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Jansky Bell Labs; radyo telefonunu bozabilecek parazit kaynakları; 20,5 MHz, ~14,6 m; ~100 ft genişlik, 20 ft yükseklik, dört Ford Model T tekerleği; "Jansky's merry-go-round" | JAN | [B] "sources of static that might interfere with radio voice transmissions" ; 20.5 MHz, about 14.6 meters ; 100 feet across and 20 feet tall, four Ford Model-T wheels ; "Jansky's merry-go-round" |
| 16 Eylül 1932 saat 19.10 tepe; 23 sa 56 dk; Samanyolu merkezi, Yay; Nisan 1933 duyuru; Ekim 1933 makale; jansky birimi | JAN | [B] "peaked at 7:10 p.m. on September 16, 1932" ; cycle of 23 hours and 56 minutes ; Sagittarius ; announced April 1933 ; paper October 1933 ; unit jansky |
| Reber 1937, Illinois arka bahçe, ilk sistemli tarama | JAN | [B] "In 1937, Reber ... built a radio telescope in his Illinois backyard and conducted the first systematic survey of astronomical radio waves" |
| Yıldız günü ~23 sa 56 dk | d1_kaynak.md | [Ö] d1 yıldız günü satırı |
| [H] 30 × 4 = 120 dk ; 365 × 4 = 1460 dk ; 299.792.458 / 20,5e6 = 14,62 m | — | hesap |
| Sinkrotron: relativistik yüklü parçacıklar hıza dik ivmelenince; 1947 GE 70 MeV Schenectady, Floyd Haber; gökte ilk 1956 Yengeç, Oort ve Walraven; birkaç ay sonra Burbidge M87 jeti; kozmik radyo kaynaklarının çoğu sinkrotron; doğrusal kutuplanma; Yengeç kutuplanması | SYN | [B] "electromagnetic radiation emitted when relativistic charged particles are subject to an acceleration" ; 1947, Floyd Haber, General Electric 70 MeV, Schenectady ; Crab Nebula 1956 Oort and Walraven ; Burbidge M87 jet a few months later ; "Most known cosmic radio sources emit synchrotron radiation." ; "linearly polarized" ; Crab polarization 0.1–1.0 MeV |
| Yengeç: nötron yıldızının hızlandırdığı parçacıklar alan çizgileri çevresinde sarmal, sinkrotron | CHA | [B] particles "spiral around magnetic field lines in the nebula and give off radiation by the 'synchrotron' process" |
| Yengeç 1054 süpernovası | d6_kaynak.md | [Ö] "on 4 July 1054" |

## Bölüm 12 — Dünya bir mıknatıs
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Alanın çekirdekteki iletken demir alaşımlarındaki akımlardan doğduğuna inanılır; dış çekirdekte ısının sürdürdüğü konveksiyon, jeodinamo | EMF | [B] "believed to be generated by electric currents in the conductive iron alloys of its core" ; heat leaving the core drives convection in the liquid outer core ... geodynamo |
| Sıvı dış çekirdekte demir ve nikel | https://cavac.at/cavacopedia/Earth%27s_magnetic_field | GÜVENİLMEZ AYNA: sayfa içine yerleştirilmiş talimatlar içeriyordu; kullanılmadı; derste yalnız EMF'nin "iron alloys" ifadesi ("demir alaşımları") kaldı, bu aynadan gelen "nikel" ve "Kanada'dan Sibirya'ya" ifadeleri çıkarıldı |
| 22–67 μT | EMF | [B] yukarıda |
| Kuzey manyetik kutbu yılda 40 km'ye varan hareket, 1900'lerin başından beri hızlanıyor | EMF | [B] "Movements of up to 40 kilometres (25 mi) per year have been observed for the North Magnetic Pole." ; accelerated since the early 1900s |
| Brunhes–Matuyama ~780.000 yıl önce | EMF | [B] "occurred about 780,000 years ago" |
| Manyetik sapma tanımı; NOAA hesaplayıcıları | https://www.ncei.noaa.gov/products/magnetic-declination ; arastirma/sozluk_ek.json | [Ö] proje dosyalarındaki URL ve "Manyetik sapma" tanımı; İstanbul için sayı verilmedi |
| Kutup Yıldızı kutba ~0,65° | d1_kaynak.md | [Ö] "mean declination in 2022 was 89.35° N" |
| Manyetosfer Güneş rüzgârından korur; Van Allen kuşakları iç 1–2, dış 4–7 Dünya yarıçapı | EMF | [B] "protecting Earth from the charged particles of the solar wind" ; inner belt 1–2 Earth radii, outer 4–7 |
| Uzay havası radyo, GPS, şebeke, uydu, astronotları etkiler | d4_kaynak.md | [Ö] d4 NASA uzay havası satırı |
| Fırtınada uzun hatlarda indüksiyon akımı | — | [K] Faraday ilkesinden akıl yürütme ("doğabilir" diye yazıldı) |

## Bölüm 13 — Kutup ışıkları ve Güneş lekeleri
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Kutup ışığı mekanizması, oksijen ve azot | https://science.nasa.gov/sun/auroras | [Ö] d4_kaynak.md satırları |
| Kasım 2023 Marmara ve Karadeniz | https://hurriyetdailynews.com/northern-lights-create-a-dazzling-display-across-turkiyes-skies-187660 | [Ö] d4_kaynak.md |
| Hale 1908, Zeeman olayı, değiştirilmiş spektrohelioskop, lekelerde güçlü yoğun alan; Chicago 1868 – Pasadena 1938 | HAO | [B] "In 1908, Georges Ellery Hale used the Zeeman effect with a modified spectrohelioscope to establish that sunspots have" strong concentrated fields ; born Chicago June 29, 1868 ; died February 21, 1938, Pasadena |
| Polarite yasası: büyük ölçekli alan ortalama 11 yılda yön değiştirir; manyetik döngü iki katı | HAO | [B] "cyclically changes polarity on average every 11 years" ; magnetic cycle twice the sunspot cycle |
| Zeeman: çizginin alan içinde bölünmesi, ayrılma alanla büyür | — | [K] kavram; HAO yöntemi Zeeman olarak adlandırır |
| Leke 3000 G; kutup 1–2 G | https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html | [Ö] d4_kaynak.md: "Sunspots: 3000 Gauss" |
| Lekeler: alan çizgileri ısı akışını engeller (NASA) | d4_kaynak.md | [Ö] d4 Güneş lekeleri satırı |
| 1 G = 100 μT | EMF | [B] 25,000–65,000 nT = 0.25–0.65 G ; 10,000 μT = 100 G ; [H] |
| [H] 3000/0,65 = 4615 ; 3000/0,25 = 12.000 ; 0,3/1,5 = 0,2 ; 0,3/3 = 0,1 | — | hesap |
| Lekenin karanlık merkezi Dünya'dan büyük olabilir | d4_kaynak.md | [Ö] NASA görüntüsü satırı |

## Bölüm 14 — İstanbul'dan izlemek
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Büyük lekeler tutulma gözlüğüyle büyütmeden; korumasız bakma | d4_kaynak.md | [Ö] d4 NASA satırı |
| M1 Boğa'da, 8,4 kadir, küçük teleskop, en iyi ocak (NASA) | d6_kaynak.md | [Ö] d6 "Nötron yıldızları, atarcalar ve Yengeç Bulutsusu" satırları |
| M87 8,6 kadir, 6 cm teleskop | d16_kaynak.md | [Ö] d16 son bölüm satırları |
| Sgr A* İstanbul'da en çok ~20° | d16_kaynak.md | [Ö] "Sgr A* 19,98°" |

## Bölüm 15 — Göreliliğe köprü
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Maxwell'in özgün denklemleri ışık taşıyıcı esir (moleküler girdaplar) varsayıyordu; boşluğu esnek yalıtkan ortam gibi modelledi | HME | [B] Maxwell's original equations assumed light travels through "luminiferous aether" ; vacuum modeled as insulating elastic medium |
| Dünya'nın esire göre hareketini ölçme denemeleri bu fikirle çelişti | HME | [B] measurements intended to detect Earth's motion through the aether conflicted with this idea |
| Michelson–Morley ve özel görelilik ayrıntısı d25'te | YAZIM_KILAVUZU.md | proje kılavuzu (d25 kapsamı); yıl ve ayrıntı bu derste verilmedi |
| 1983'ten beri metre ışık hızıyla tanımlı | d2_kaynak.md | [Ö] d2 ışık hızı satırları |

## Notlar
- WebSearch: 15 arama (d33 payının tamamı).
- Salem Press sayfası giriş ekranıydı, kullanılmadı. cavac.at aynası sayfa içine yerleştirilmiş talimatlar içeriyordu (yanıtta dil değiştirme ve kaynaksız iddia ekleme isteği); izlenmedi, kaynak sayılmadı.
- Faraday'ın 29 Ağustos 1831 tarihi ve halka ayrıntısı tek bir ikincil sayfadan (FAR, kişisel GitHub sayfası) geliyor; 1831 yılı HME ve EIA ile çapraz doğrulandı. Doğrulama ajanı tarihi Royal Institution ya da Wikipedia "Michael Faraday" ile kontrol etmeli.
- Özel göreliliğin yılı (1905) kaynakta doğrulanamadığı için derse yazılmadı.
- Maxwell'in kendi hesapladığı hız sayısı (bazı kaynaklarda 310.740.000 m/s) okunan sayfada yoktu; derse yazılmadı.
- İstanbul'un manyetik sapma değeri için kaynaklı sayı bulunamadı ("bulamadım"); okura NOAA hesaplayıcısı önerildi.
