# d52 — Kara deliklerin kuantum yüzü: kaynak tablosu

Tarih: 2026-10-30. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
[B] = bu oturumda WebFetch ile okundu (alıntılar WebFetch özet modelinin aktardığı metindir; doğrulama ajanı bir kez daha bakmalı); [Ö] = projede önceden doğrulanmış (başka dersin kaynak dosyası ya da arastirma/sabitler.json); [H] = bu derste yapılan hesap (python3 ile yapıldı; G, c, h, k, M☉ sabitler.json'dan); [A] = kaynaklı ilkelerden çıkan açıklama/akıl yürütme, ayrı olgusal iddia içermez.

Kısaltmalar: HR = https://en.wikipedia.org/wiki/Hawking_radiation ; BH = https://en.wikipedia.org/wiki/Black_hole ; BHT = https://en.wikipedia.org/wiki/Black_hole_thermodynamics ; JTA = https://www.jta.org/2018/03/14/obituaries/stephen-hawking-boycotted-israel-israeli-academic-inspired-one-biggest-discoveries ; EV = https://arxiv.org/pdf/2411.09081 ; HAWC = https://ar5iv.labs.arxiv.org/html/1911.04356 ; LAT = https://arxiv.org/abs/1802.00100v1 ; IP = https://en.wikipedia.org/wiki/Hawking_paradox (Black hole information paradox) ; BET = https://en.wikipedia.org/wiki/Thorne%E2%80%93Hawking%E2%80%93Preskill_bet ; DP = https://en.wikipedia.org/wiki/Don_Page_(physicist) ; PAGE = https://arxiv.org/abs/hep-th/9306083 ; PC = https://arxiv.org/pdf/2002.05734 ; COMP = https://en.wikipedia.org/wiki/Black_hole_complementarity ; STU = https://arxiv.org/abs/hep-th/9306069 ; AMPS = https://arxiv.org/abs/1207.3123 ; FW = https://en.wikipedia.org/wiki/Firewall_(physics) ; IAS = https://www.ias.edu/node/201536 ; HOL = https://en.wikipedia.org/wiki/Holographic_principle ; ADS = https://en.wikipedia.org/wiki/AdS/CFT_correspondence ; AHMST = https://arxiv.org/abs/1911.12333v2 ; PSSY = https://arxiv.org/abs/1911.11977v2 ; COR = https://news.cornell.edu/node/320627 ; BRK = https://physics.berkeley.edu/news/%E2%80%98islands%E2%80%99-poking-out-black-holes-may-solve-information-paradox ; UNR = https://physicstoday.aip.org/opinion/experimental-black-hole-evaporation ; MDN = https://ui.adsabs.harvard.edu/abs/2019Natur.569..688M/abstract ; MDNX = https://arxiv.org/pdf/1809.00913v1 ; LEO = https://arxiv.org/pdf/1609.03803 ; NAU = https://nautil.us/benchtop-black-holes-help-physicists-glimpse-the-quantum-universe-236111/ ; PHYS = https://phys.org/news/2019-05-thermal-analog-black-hole-hawking.html ; PIN = https://arxiv.org/pdf/2410.11851 ; MOON = https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html

## Bölüm 0 — Kara delik neden bir kuantum sorusu?
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Genel görelilik ile kuantum fiziği uyuşmaz; ikisinin birlikte önemli olduğu yerler kara delikler ve Büyük Patlama | d26_kaynak.md | [Ö] d26 "Genel göreliliğin sınırları: kuantum kütleçekim sorunu" satırları |
| Dört kesinlik düzeyinin adları ve örnekleri (Hawking ışıması = Kuram / hipotez) | arastirma/dersler_v2/YAZIM_KILAVUZU.md (v6) | [Ö] kılavuzdaki tanımlar |
| Hawking ışıması hiç gözlenmedi | HR | [B] "As of January 2024, none have been detected" (son patlamalar); d16_kaynak.md [Ö] "Such radiation bursts have not yet been detected" |

## Bölüm 1 — Kara deliklerin termodinamiği
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Alan teoremi (ufuk alanı toplamı küçülmez); GW250114'te alan arttı | d16_kaynak.md | [Ö] arXiv 2509.08054 "the remnant area is larger than the sum of the initial areas to high credibility" |
| Bekenstein 1972: entropi ufuk alanıyla orantılı; 1973: orantı sabiti için sezgisel öneri | BHT | [B] "In 1972 ... black holes should have an entropy proportional to the area of the event horizon" ; "In 1973 ... heuristically suggested the constant of proportionality" |
| Genelleştirilmiş ikinci yasa | BHT | [B] "The generalized second law of thermodynamics (GSL) is needed to present the second law of thermodynamics as valid" |
| Kara deliğe atılan gazın entropisi kaybolmuş gibi görünür | d30_kaynak.md | [Ö] d30 "Kara deliklerin entropisi" satırları |
| Hawking 1972'de Bekenstein'ı reddetti, kara deliklerin hiçbir şey yayamayacağını savundu; Fransa'daki konferansta meslektaşlarıyla öfkeyle itiraz etti | JTA | [B] "maintaining that black holes could not radiate anything" ; "At a conference in France that year, he gathered a few senior colleagues and angrily confronted Bekenstein" |
| Bardeen, Carter, Hawking 1973 dört yasa; yüzey çekimi ufukta sabit; alan azalmaz | BHT | [B] "proposed by Bardeen, Brandon Carter, and Hawking in 1973" ; zeroth law surface gravity constant ; second law area non-decreasing |
| Strominger–Vafa: süpersimetrik kara delik entropisini sicim kuramında hesapladı; LQG'de mikrodurumlara geometrik yorum | BHT | [B] "calculated the Bekenstein–Hawking entropy of a supersymmetric black hole in string theory" ; "In loop quantum gravity (LQG) it is possible to associate a geometrical interpretation with the microstates" |
| [H] Örnek: 1,05 × 10⁷⁷ k (d30) ÷ ln 2 = 1,51 × 10⁷⁷ bit; (4,297 × 10⁶)² = 1,846 × 10¹³; × 1,05 × 10⁷⁷ ≈ 1,94 × 10⁹⁰ k (python: 1,937 × 10⁹⁰); 1 TB = 8 × 10¹² bit; 1,5 × 10⁷⁷ ÷ 8 × 10¹² ≈ 1,9 × 10⁶⁴ | PIN ; d30_kaynak.md | [Ö] d30 örneği 1,05 × 10⁷⁷ ; Pinochet 1,5 × 10⁵⁴ J/K |

## Bölüm 2 — Hawking'in 1974 hesabı
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Hawking hesabını bir süre sakladı, sonra yayımladı | JTA | [B] "At first he kept the result secret because he was reluctant to admit his error, but he eventually made it public" (WebFetch özeti) |
| Nature, 1 Mart 1974, "Black hole explosions?"; CMP 43, 199–220, Ağustos 1975 "Particle creation by black holes" | HR | [B] "Black Hole Explosions?" Nature 248 (5443): 30–31 (March 1, 1974) ; Communications in Mathematical Physics 43 (3): 199–220 (August 1975) |
| Sıcaklık kütleyle ters orantılı | HR ; BH | [B] "inversely proportional to the mass" |
| Sabit = ufuk alanının dörtte biri, Hawking kesinleştirdi | HOL | [B] "Hawking later fixed the constant at one quarter of the horizon area in Planck units" |
| Vakum dalgalanması: ufkun dışında bir foton, içinde eşi | HR | [B] "A vacuum fluctuation in the electromagnetic field can result in a photon outside of the black hole horizon paired with one on the inside" |
| Hawking ışıması Unruh etkisine ve eşdeğerlik ilkesinin ufka uygulanmasına dayanır | HR | [B] "Hawking radiation is dependent on the Unruh effect and the equivalence principle applied to black-hole horizons" |
| Planck ötesi sorun; bugün çoğunlukla matematiksel yan ürün sayılıyor | HR | [B] "Hawking's original calculation includes quantum particles where the wavelength becomes shorter than the Planck length" ; "The trans-Planckian problem is nowadays mostly considered a mathematical artifact of horizon calculations" |
| "Kuramsal olarak çok saygın" (d16 ifadesi) | d16.json | [Ö] d16 "kuramsal olarak çok saygın ama gözlemle henüz doğrulanmamış bir öngörüdür" |
| [A] "Ufukta ayrılan çift" resminin bir benzetme olduğu; gerçek hesabın alan durumlarını karşılaştırdığı | — | [A] dersin kendi açıklaması; HR de çift resmini yalnızca "vacuum fluctuation" diliyle verir |

## Bölüm 3 — Ne kadar sıcak?
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| T = ħc³/(8π k G M) ≈ 6,17 × 10⁻⁸ (M☉/M) K | EV | [B] Eq. 2 "T_BH = ħc³/(8π k_B G M_BH) ≃ 6.17 × 10⁻⁸ (M☉/M_BH) K" |
| 1 M☉ → 62 nanokelvin | BH | [B] "A stellar black hole of 1 M☉ has a Hawking temperature of 62 nanokelvins." |
| Eksi ısı sığası | BHT | [B] "results in a negative heat capacity" |
| Yıldızlar enerji kaybettikçe ısınır | d30.json | [Ö] d30 bölüm "Yıldızlar: enerji kaybettikçe ısınan cisimler" |
| Dünya kütleli kara delik ~0,02 K | d16_kaynak.md | [Ö] doğrulayıcı hesabı "Dünya kütlesi için 0,0205 K" |
| [H] 6,17e-8 ÷ 4,297e6 = 1,436 × 10⁻¹⁴ K ; ÷ 6,5e9 = 9,49 × 10⁻¹⁸ K ; oran 1,44e-14 ÷ 9,5e-18 ≈ 1.516 ; Güneş/Dünya = 1,98841e30 ÷ 5,9722e24 = 332.946 ; × 6,17e-8 = 0,0205 K | sabitler.json | [Ö] M_sun 1,98841e30 kg ; M_earth 5,9722e24 kg |
| Sgr A* 4,297 milyon M☉ ; M87 6,5 milyar M☉ | d16_kaynak.md | [Ö] |

## Bölüm 4 — Kozmik arka planla yarış
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Kozmik arka plan 2,725 K | d30_kaynak.md | [Ö] d30 "2,725 K" |
| Yıldız kütleli ve daha büyük kara delikler CMB'den kaybettiklerinden fazla kütle kazanır, büyür | BH | [B] "Stellar-mass or larger black holes therefore gain more mass from the CMB than they lose to Hawking radiation" (WebFetch özeti) |
| Buharlaşması için Ay'dan hafif olmalı | BH | [B] "a mass less than the Moon" |
| Ay kütlesi 7,346 × 10²² kg | MOON | [Ö] "Mass (10^24 kg) 0.07346" (d10/d43 kaynaklarında) |
| [H] M/M☉ = 6,17e-8 ÷ 2,725 = 2,264 × 10⁻⁸ ; × 1,98841e30 = 4,50 × 10²² kg ; ÷ 7,346e22 = 0,613 ; Rs = 2GM/c² = 6,69 × 10⁻⁵ m | sabitler.json | [H] python: 4,5024e22 kg, 0,6129, 6,687e-5 m |
| Evren genişledikçe daha soğuk olur | d17.json | [Ö] d17 "Evrenin olası geleceği": "evren genişledikçe daha büyük, daha soğuk ve daha seyrek olur" |
| Isıl ölümün son sahnesinde kara delikler buharlaşır | d30.json | [Ö] d30 "Evrenin ısıl ölümü" |

## Bölüm 5 — Buharlaşma
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Ömür ilk kütlenin küpüyle ölçeklenir | HR | [B] "the life span of a black hole can be shown to scale as the cube of its initial mass" |
| t_ev = 15360πG²M³/(3ħc⁴) = 2,1 × 10⁶⁷ (M/M☉)³ yıl (yalnız foton) | EV | [B] Eq. 6 "= 2.1 × 10^67 (M_BH/M☉)^3 yr" |
| Foton dışı parçacıkların yayılması ömrü kısaltır | EV | [B] "emitting other particles shortens the evaporation time, citing Mosbech & Picker (2022)" |
| Evrenin yaşı içinde buharlaşabilecek en büyük kütle ~9 × 10⁻²⁰ M☉ ≈ 1,8 × 10¹⁴ g | EV | [B] "about 9 × 10⁻²⁰ M☉ (about 1.8 × 10¹⁴ g)" |
| Bugün biten ilk kütle ~5 × 10¹⁴ g (yaklaşık bir gigaton) | HAWC | [B] "PBHs with initial masses of ∼5×10^14 g (approximately one gigaton) should be expiring today" |
| Son evre mikrosaniyelik gama ışını parlaması | BH | [B] "microsecond-long burst of gamma rays" |
| Stefan-Boltzmann: güç ∝ alan × T⁴ | d2.json | [Ö] d2 Stefan-Boltzmann bölümü |
| 10¹¹ M☉ kara delik ~10¹⁰⁰ yıl | d30_kaynak.md | [Ö] d30 "Evrenin ısıl ölümü" satırları |
| Evrenin yaşı ~1,38 × 10¹⁰ yıl | d8_kaynak.md | [Ö] 13,8 milyar yıl |
| [H] 1,38e10 ÷ 2,1e67 = 6,57e-58 ; küp kök 8,70e-20 ; × 1,98841e30 = 1,73 × 10¹¹ kg (python tam formülle 1,73 × 10¹¹) ; Sgr A* ömrü 2,1e67 × (4,297e6)³ = 1,67 × 10⁸⁷ yıl ; 5e11 kg için Rs = 7,43 × 10⁻¹⁶ m, T = 2,45 × 10¹¹ K | sabitler.json | [H] |
| [A] Küp ölçeklemesinin Stefan-Boltzmann ile türetilmesi | — | [A] kaynaklı T ∝ 1/M, A ∝ M² ve d2'deki yasadan |

## Bölüm 6 — İlkel kara delikler
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Yıldız kökenli kara delikler birkaç M☉'den başlar | d16_kaynak.md | [Ö] |
| PBH'ler erken evrendeki yoğunluk dalgalanmalarından oluşmuş olabilir | HAWC | [B] "Primordial Black Holes (PBHs) may have been created by density fluctuations in the early Universe" |
| Hawking 1975: ~10¹² kg'dan hafif PBH'ler bugüne dek buharlaşmış olmalı | HR ; BH | [B] HR "less than approximately 10^12 kg would have evaporated completely by the present day" ; BH "Primordial black holes with masses less than 10¹² kg would have evaporated by now" |
| Fermi Haziran 2008'de fırlatıldı, son gama parlamalarını arıyor | HR | [B] "Fermi (launched June 2008): searching for the terminal gamma-ray flashes expected from evaporating primordial black holes" |
| Fermi-LAT 2018: %99 güvenle < 7,2 × 10³ pc⁻³ yıl⁻¹; yer tabanlı sınırlara benzer | LAT | [B] "ρ̇_PBH < 7.2 × 10³ pc⁻³ yr⁻¹" ; "99% confidence" ; "similar to the limits obtained with ground-based gamma-ray observatories" |
| HAWC: Sierra Negra, Meksika, 4.100 m; 959 gün; %99 güvenle < 3.400 pc⁻³ yıl⁻¹ | HAWC | [B] "located on the side of the Sierra Negra volcano in Mexico at an altitude of 4,100 m" ; "959 days of HAWC data" ; "3400 pc⁻³ yr⁻¹ at 99% confidence" |
| Ocak 2024 itibarıyla hiç saptanmadı | HR | [B] "As of January 2024 [update], none have been detected." |
| KM3NeT 2023 olayı; açıklamalardan biri PBH buharlaşması | HR | [B] "KM3-230213A in 2023; one of the proposed explanations is evaporation of a primordial black hole" (enerji değeri derse konmadı: WebFetch aktarımı belirsiz) |
| PBH'lerin karanlık madde rolü d50'de | YAZIM_KILAVUZU.md v6 | [Ö] d50 kapsamı "ilkel kara delikler (LIGO sonrası kısıtlar)" |

## Bölüm 7 — Bilgi
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Üniterlik: herhangi bir andaki dalga fonksiyonu geçmişi ve geleceği belirler | IP | [B] "Quantum states evolve through a unitary operator, so the wave function at any instant determines both its past and its future" (WebFetch özeti) |
| Saf durumun von Neumann entropisi 0, karışık durumunki sonlu; üniter evrim saftan karışığa çeviremez | IP | [B] "A pure state has von Neumann entropy 0. A mixed state has finite entropy ... unitary evolution cannot do that" |
| Landauer ilkesi, bilginin fiziksel bedeli | d30_kaynak.md | [Ö] |
| Kuantum kuralları yüz yıldır her sınavı geçti | d27.json | [Ö] d27 "Bu kurallar yüz yıldır her sınavı geçti" |
| [A] Ansiklopedi yakma benzetmesi ve sınırı | — | [A] dersin kendi benzetmesi |

## Bölüm 8 — Paradoks ve bahis
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Hawking 1976, "Breakdown of predictability in gravitational collapse", Phys. Rev. D 14 (10), 2460–2473 | IP | [B] başlık, dergi, cilt, sayfa |
| Saçsızlık: kütle, dönme, yük | d16_kaynak.md | [Ö] |
| Kalıntı: kabul görmüş mekanizma yok; Bekenstein sınırını çiğneyebilir | IP | [B] "no accepted mechanism for radiation to stop while the black hole is still macroscopic" ; "possibly violating the Bekenstein bound" |
| Bahis 6 Şubat 1997; Thorne+Hawking: bilgi "yeni", ufkun içinden gelmez; Preskill tersi; ödül ansiklopedi "from which information can be retrieved at will" | BET | [B] "signed 6 February 1997" ; "must not originate from inside the black hole event horizon" ; "from which information can be retrieved at will" |
| Hawking 2004'te kabul; Dublin 17. GR konferansı 21 Temmuz 2004; Total Baseball | BET | [B] "17th International Conference on General Relativity and Gravitation in Dublin on 21 July 2004" ; "Total Baseball, The Ultimate Baseball Encyclopedia" |
| Thorne ikna olmadı; 2024 itibarıyla "I'm still a holdout" | BET | [B] "declined to contribute to the award" ; "As of 2024, he has not conceded" |
| Hawking'in argümanı tümüyle kabul görmedi | BET | [B] "has not yet been wholly accepted by the scientific community" |
| Çözülmemiş sorun; baskın görüş bilgi korunur; azınlık kaybolur der | IP | [B] "an unsolved problem" ; "remains an active field of research" ; "information preservation is now generally believed" ; "a minority view that information is genuinely lost" |

## Bölüm 9 — Page eğrisi
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Don Page Hawking'in doktora öğrencisi, birlikte makaleler | DP | [B] "a doctoral student of Stephen Hawking" ; "several journal articles with" Hawking |
| Page 1993, PRL 71, 3743; Page eğrisi, dönüm noktası Page zamanı | DP ; PAGE ; IP | [B] DP "In 1993, he argued that if a black hole starts in a pure quantum state..." ; PAGE DOI 10.1103/PhysRevLett.71.3743 ; IP "Physical Review Letters 71(23), pp. 3743–3746" |
| Entropi sıfırdan yarı yola dek artar, sonra sıfıra iner | PC | [B] "increasing from zero until near the halfway point of the evaporation, and then decreasing back to zero" |
| Bilgi başlangıçta çok yavaş ya da dağınık çıkabilir, yaklaşık hesaplarda görünmez | PAGE | [B] "it may come out initially so slowly, or else be so spread out, that it would never show up in an analysis perturbative in M_Planck/M" |
| [A] Saf bir bütünün iki parçasının dolanıklık entropileri eşittir (standart kuantum bilgi sonucu) | — | [A] doğrulama ajanı bir kaynakla eşleştirmeli (ör. IP Page eğrisi tanımı) |
| [H] Page zamanı ≈ 2,1e67 ÷ 2 ≈ 1,05 × 10⁶⁷ yıl ; ÷ 1,38e10 = 7,6 × 10⁵⁶ ; Sgr A* 1,67e87 ÷ 2 ≈ 8 × 10⁸⁶ | — | [H] |

## Bölüm 10 — Ateş duvarı
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Tamamlayıcılık: Susskind, Thorlacius, Uglum 1993 ve 't Hooft; gerilmiş ufuk; düşen gözlemci bir şey görmez; kimse ikisini birden doğrulayamaz; kopyalanamazlık | COMP ; STU | [B] COMP "proposed by Leonard Susskind, Lárus Thorlacius, John Uglum" ; "no observer can confirm both stories simultaneously" ; no-cloning ; STU "Submitted June 16, 1993" |
| AMPS 13 Temmuz 2012; yazarlar; üç ifade; en tutucu çözüm düşen gözlemcinin ufukta yanması | AMPS | [B] "Submitted 2012-07-13" ; "(i) Hawking radiation is in a pure state, (ii) ... (iii) the infalling observer encounters nothing unusual at the horizon" ; "Perhaps the most conservative resolution is that the infalling observer burns up at the horizon" |
| Tekeşli dolanıklık argümanı | FW | [B] "the outgoing particle cannot be fully entangled with two independent systems at the same time" |
| Bousso: ateş duvarı boş uzayda beliremez | FW | [B] "a firewall simply can't appear in empty space" |
| Yanıtlar: Giddings, Papadodimas–Raju, ER=EPR, fuzzball (Mathur), Hawking 2014 görünür ufuk | FW | [B] ilgili maddeler |
| Tartışmalı, fizikçiler bölünmüş | FW | [B] "remains controversial, with physicists divided as to the solution to the paradox" |
| Yankılar: Afshordi ve ark. 2016 ön işaret; sonraki çalışmalar anlamlı kanıt bulmadı | FW | [B] "In 2016, Niayesh Afshordi and others reported tentative echo signs" ; "no statistically significant evidence for such echoes" |
| AMPS'in KITP 2012'de doğduğu ve büyük ilgi gördüğü | IAS | [B] (derste kullanılmadı; bağlam) |

## Bölüm 11 — Holografik ilke ve AdS/CFT
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| 't Hooft 1993; Susskind 1995 "The World as a Hologram"; sınırdaki yüzeye kodlanmış betim | HOL | [B] "Gerard 't Hooft first proposed it in 1993" ; Susskind 1995 ; "encoded on a lower-dimensional boundary to the region" |
| Bekenstein sınırı: en büyük entropi yarıçapın karesiyle | HOL | [B] "limits the maximum entropy in a region to scale with radius squared rather than cubed" |
| Maldacena 1997 sonu; 1 Ocak 1998 yayın; 2015'e dek 10.000+ atıf, en çok atıf alan HEP makalesi | ADS | [B] "proposed the correspondence in late 1997" ; "published on January 1, 1998" ; "over 10,000 citations" ; "the most highly cited article in the field of high energy physics" |
| AdS: eksi kozmolojik sabit, ne genişler ne büzülür; bizim evren artı ve hızlanıyor | ADS | [B] "Unlike our universe, which has a small positive cosmological constant and is accelerating, AdS is 'neither expanding nor contracting'" |
| Kanıtlanmamış sanı | ADS | [B] "conjectured relationship" ; "has not been rigorously proved" |
| Paradoksu "en azından bir ölçüde" çözer; Hawking 2005'te bilginin korunduğunu ilan etti | ADS | [B] "at least to some extent" ; "In 2005, Hawking announced that the correspondence settled the paradox in favor of information conservation" |
| Fiziksel olmayan boyut sayıları ve süpersimetri | ADS | [B] "the known realizations use unphysical numbers of dimensions and unphysical supersymmetry" |
| dS/CFT, göksel holografi; merkezi sanı hâlâ sanı | HOL | [B] "celestial holography ... its central conjecture is still a conjecture" |
| [A] Hologram benzetmesi ve sınırı | — | [A] |

## Bölüm 12 — Adalar ve kopya solucan delikleri
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| 27 Kasım 2019, Almheiri, Hartman, Maldacena, Shaghoulian, Tajdini; AdS + Minkowski; yeni eyer noktaları farkı kapatır; ada kuralı; JT kütleçekimi | AHMST | [B] "Submitted: November 27, 2019" ; "The information paradox can be realized in anti-de Sitter spacetime joined to a Minkowski region" ; "fixed by including new saddles in the gravitational path integral" ; "island rule" ; "two-dimensional Jackiw-Teitelboim gravity" |
| 27 Kasım 2019, Penington, Shenker, Stanford, Yang; "Recent work has shown how to obtain the Page curve ... from holographic computations"; kopya yöntemi | PSSY | [B] özet alıntıları |
| Hartman: "solves some corner of the paradox"; neredeyse çözüldü fikrine karşı | COR | [B] "It solves some corner of the paradox" |
| 2019 adaları ufkun çok az dışında, ölçülebilir en küçük uzunluktan küçük; matematiksel merak gibi; Bousso ve Penington sonraki hesap; Maldacena: gerçekçi kara delik için yapılamaz; ~1 milyon kübit vs ~1.000 | BRK | [B] "appeared to be smaller than the smallest possible length" ; "more of a mathematical curiosity than a physical reality" ; "You are not going to be able to do it for a realistic black hole" ; "around a million qubits, compared with about 1,000" |
| Bilginin hangi mekanizmayla çıktığını açıklamaz | BRK ; IP | [B] BRK "The article doesn't explain how information gets out" ; IP "views still differ on how Hawking's calculation should be corrected" |

## Bölüm 13 — Ses ufukları
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Unruh 1981, PRL, "Experimental black-hole evaporation?"; akış hızı = ses hızı yüzeyi ses ufku; varsayımların sınaması | UNR | [B] "1981 paper in Physical Review Letters ... 'Experimental black-hole evaporation?'" ; "a surface exists where the velocity of the fluid equals that of sound" ; "could thus be a test of the assumptions" |
| Nehir benzetmesi (Steinhauer) | NAU | [B] "the river is flowing faster than you can swim" |
| Mutlak sıfıra yakın soğutulmuş atom bulutu | NAU | [B] "His team cooled a cloud of gas atoms to near absolute zero" |
| 2016 Nature Physics "Observation of quantum Hawking radiation and its entanglement in an analogue black hole" | HR | [B] başlık |
| 2019 Nature 569, 688; yazarlar; tayf ısıl, sıcaklık yüzey çekimiyle; önceki tayf ısıl değildi | MDN ; MDNX | [B] MDN özet: "agrees well with a thermal spectrum, and its temperature is given by the surface gravity" ; "the overall spectrum was not of the thermal form, and no temperature could be ascribed to it" ; MDNX yazar listesi |
| 8.000 ⁸⁷Rb atomu; 7.400 tekrar; öngörülen 0,35 nK | MDNX | [B] "consisting of 8000 87Rb atoms" ; "The experiment is repeated 7400 times" ; "predicted Hawking temperature of 0.35 nK" (Not: phys.org özeti 0,035 nK aktardı; derste arXiv makalesinin değeri kullanıldı, doğrulama ajanı yayımlanmış sürüme bakmalı) |
| Leonhardt (Weizmann): tayf Planck değil; ad hoc; bir sigma; keşif ölçütlerinde gözlendiği söylenemez | LEO | [B] "the spectrum is clearly not Planckian" ; "an ad hoc model" ; "the data become insignificant" ; "One cannot claim that quantum Hawking radiation and its entanglement has been observed" |
| 2010 optik deney tartışmalı | HR | [B] "the results remain debated" |
| Kısa dalga boylu fizikten bağımsızlık (Planck ötesi) | UNR | [B] "independent of how sound behaves at wavelengths shorter than the healing length" |
| Gökteki kara deliklerde doğrulamaz | NAU ; PHYS | [B] NAU "this experiment still doesn't confirm the existence of Hawking radiation in astronomical black holes" ; PHYS "the only way to do that will be to develop technology capable of actually measuring the radiation from a real black hole" |
| [H] 6,17e-8 ÷ 3,5e-10 = 176 ; 2,725 ÷ 3,5e-10 = 7,8 × 10⁹ | — | [H] |

## Bölüm 14 — Özet
| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| Önceki bölümlerin satırları; Sgr A* Yay'da, Cyg X-1 Kuğu'da (d16) | d16_kaynak.md | [Ö] |
| [H] Sgr A* ömrü 10⁸⁷ yıl mertebesi | — | [H] bölüm 5 |

## Notlar
- d46 (süper kütleli kara delikler) bu oturumda klasörde yoktu; sayılar d16 ile tutarlı tutuldu (Sgr A* 4,297 milyon M☉, M87 6,5 milyar M☉, 62 nK, 2,1 × 10⁶⁷ yıl).
- WebSearch: 15 arama kullanıldı. Kullanılmayan/derse konmayan: KM3NeT olayının enerjisi (aktarım belirsiz), Hogan/Fermilab holografik gürültü sayıları (aktarım belirsiz), Hawking'in 1971 alan teoremi yılı (kaynakta bulunamadı, yıl verilmedi).
