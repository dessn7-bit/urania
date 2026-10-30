# Parça B: araştırma haberleri, kaynak dayanakları

Hazırlanma tarihi: 30 Ekim 2026. 14 madde, hepsi `tur: "arastirma"`.
Doğrulama yöntemi:
- Makale bilgileri (başlık, dergi, cilt, ilk yazar, çevrimiçi yayın tarihi, özet) Crossref API (api.crossref.org/works/<DOI>) üzerinden yayıncının kendi kaydından alındı.
- arXiv ön baskıları doğrudan arxiv.org/abs sayfasından okundu.
- İkinci kaynak olarak bağımsız bir haber yazısı WebFetch ile okundu.
- Bütün makale ve kaynak URL'leri curl ile denendi ve 200 döndü. İki istisna var: doi.org/10.1051/0004-6361/202661105 (A&A sitesi bot isteğine 403 veriyor; DOI'nin geçerli olduğu Crossref'te doğrulandı) ve Nature DOI'si (ilk denemede 429 döndü, ikinci denemede nature.com'a 200 ile yönlendi).
- nature.com ve doi.org adresleri WebFetch aracında izin isteği yanıtlanmadığı için engellendi. Nature ve Nature Astronomy makalelerinin içeriği bu yüzden Crossref özetinden ve haber yazılarından doğrulandı.

Aşağıda, kullanılan her sayının ve iddianın hangi kaynaktaki ifadeye dayandığı yer alıyor. Makale özetlerinden alınan ifadeler kısa alıntıdır; diğerleri özetlenmiştir.

---

## 1. 2026-10-08-psr-j0435-uclu-sistem
- Makale: Yang vd., "The PSR J0435+3233 Triple System", ApJL 1010, L9. Çevrimiçi yayın 2026-10-08 (Crossref). https://doi.org/10.3847/2041-8213/aeaa29
  - Özetteki ifadeler:
    - "gamma-ray pulsar in a hierarchical triple system, with a helium white dwarf (WD) as a close inner binary companion and a Sun-like star as the distant tertiary"
    - "P orb1 = 8.0 days"
    - "G-type subgiant with a mass of 0.98(12) M☉ at a distance of 2.1(4) kpc"
    - "gamma-ray emission (over 16.7 yr) and radio emission (over 4.9 yr)"
    - "P orb2 = 73.5 yr and an eccentricity e2 = 0.598"
    - "mutual inclination of ∼85° , or moderately inclined by ∼54°"
    - "It will ultimately evolve into a system consisting of a neutron star and two WDs."
- AAS Nova, Kerry Hensley, 2026-10-09: https://aasnova.org/2026/10/09/a-pulsar-in-a-rare-triple-system/
  - FAST ile bulundu; her 3,2 milisaniyede bir dönüyor.
  - Sistem uzun vadede kararlı.
  - Pulsar hiç tekme almasa bile sistemin bağlı kalma olasılığı yalnızca %35.
- Hesap: 2,1 kpc × 3,26 ≈ 6.800 ışık yılı. 1/3,2 ms ≈ 312/s, metinde "300'den fazla" olarak yazıldı.

## 2. 2026-10-07-mikroblazar-iras-18293
- Makale: Martí vd., "A Galactic microblazar as a potential accelerator of ultra-high-energy particles", A&A 714, A171. Çevrimiçi yayın 2026-10-07 (Crossref). https://doi.org/10.1051/0004-6361/202661105
  - Özetteki ifadeler:
    - "Persistent jets from X-ray binaries that are aligned very close to the line of sight could be considered Galactic equivalents of blazars, or 'microblazars'"
    - "photometric and spectroscopic properties typical of a binary star"
    - "clear collimated and one-sided radio emission matching the effects of relativistic motion along a reduced ejection angle"
    - "Only fast variability is not observed; it is possibly smoothed by a dense circumstellar envelope"
    - "likely connection with LHAASO J1831−1007u, an ultra-high-energy source in its immediate vicinity"
- Science News, Meghan Bartels, 2026-10-05: https://www.sciencenews.org/article/first-miniature-quasar-earth
  - Mikroblazarlar yaklaşık 35 yıldır aranıyor.
  - Kaynak ilk kez 1983'te Hollanda–ABD ortak bir uzay aracının kataloğunda işaretlendi.
  - Pedro Luque-Escamilla ve Josep Martí, Jaén Üniversitesi.
  - Parçacık enerjileri LHC'nin 100 katı.
  - Çalışmaya katılmayan Alexandra Tetarenko kanıtları "far more convincing" buluyor.
- Kesinlik "ön sonuç": hem makale ("serious candidate") hem Science News ("may have") bunu aday olarak sunuyor.

## 3. 2026-10-05-hs0209-ikinci-kusak-gezegen
- Makale: Williams vd., "Discovery of a second-generation planet candidate accreting onto a white dwarf", Nature Astronomy. Çevrimiçi yayın 2026-10-05 (Crossref). https://doi.org/10.1038/s41550-026-02983-7
  - Özetteki ifadeler:
    - "strongly enriched in trans-iron elements including zinc, copper and niobium but depleted in the canonical rock-forming elements silicon and iron"
    - "high enrichment of s-process elements"
    - "accreting from the escaped atmosphere of a photo-evaporating giant planet candidate"
    - "sinusoidal photometric period of 4.399 ± 0.026 days at an amplitude of 0.120% ± 0.018%"
    - "planetary day–night cycle or a transiting cometary tail"
- Science News, Lisa Grossman, 2026-10-05: https://www.sciencenews.org/article/baby-planet-from-dead-star-phoenix
  - Hubble'ın 1999 gözlemleri yeniden incelendi.
  - Niyobyum daha önce hiçbir beyaz cücede görülmemişti.
  - Dalgalanma TESS verisinde görüldü.
  - J. T. Williams Warwick Üniversitesi'nden.
  - Williams'ın sözü: "A planet is the most reasonable explanation". Başka ne olabileceğinden emin olmadıklarını da söylüyor.

## 4. 2026-09-29-toi-561b-yansitici-atmosfer
- Makale: Boucher vd., "A Highly Reflective Atmosphere on the Lava World TOI-561b Revealed by JWST/NIRSpec Phase Curves", AJ 172, 239. Çevrimiçi yayın 2026-09-29 (Crossref). arXiv:2608.21519, 2026-08-21. https://doi.org/10.3847/1538-3881/ae9763
  - Özetteki ifadeler:
    - "3–5 μm emission using JWST/NIRSpec multiorbit spectroscopic phase curves"
    - "best explained with high Bond albedo and moderate global heat transfer"
    - "37 hr continuous observation"
    - "silicate clouds, such as SiO2 and MgSiO3, can form on the dayside near the terminator and explain the observed albedo"
- University of Birmingham, 2026-10-27: https://birmingham.ac.uk/news/2026/shiny-lava-planet-challenges-astronomers-expectations
  - "some 280 light years from Earth"
  - "37 hours, capturing nearly four complete trips"
  - "must reflect roughly three-quarters of the starlight that hits it, comparable to Venus"
  - Bileşim açık soru: CO₂ (Venüs gibi) ya da SO₂ (İo gibi).
- Universe Today, Evan Gough, 2026-10-27: https://www.universetoday.com/articles/this-oddbal-reflective-lava-world-is-challenging-to-understand
  - İlk yazar Samuel Boucher (Université de Montréal), proje lideri Lisa Dang (Waterloo).
  - Yörünge yaklaşık 10,5 saat.
  - GCM modeli Ab = 0,6 gerektiriyor.
- Tutarsızlık notu: Birmingham "kabaca dörtte üç" diyor, Universe Today GCM için Ab = 0,6 veriyor. Metinde Birmingham'ın ifadesi atıfla kullanıldı; kesin albedo sayısı yazılmadı. Yörünge süresi için iki kaynağın ortak noktası olan "11 saatten kısa" kullanıldı.
- Not: The Astronomical Journal, görevde sayılan dergi listesinde yok (AAS dergisi, hakemli). Çalışma arXiv astro-ph'de de var.

## 5. 2026-09-28-chime-21cm-hidrojen
- Makale: CHIME İşbirliği (Amiri vd.), "Detection of the Cosmological 21 cm Signal in Autocorrelation at z ∼ 1 with the Canadian Hydrogen Intensity Mapping Experiment", ApJ 1009, 159. Çevrimiçi yayın 2026-09-28 (Crossref). https://doi.org/10.3847/1538-4357/ae9835
  - Özetteki ifadeler:
    - "Using 94 nights of observation"
    - "608.2–707.8 MHz (z = 1.34–1.01)"
    - "detection significance of 12.4σ"
    - "without reliance on external galaxy surveys"
- Eşlik eden makale: Amiri vd., ApJ 1009, 160. https://doi.org/10.3847/1538-4357/ae9747
  - Özetteki ifade: "disagrees with the TNG100 run at 3.1σ and the TNG300 run at 4.0σ … likely attributable to the effects of nonlinear H I clustering and redshift-space distortions in the simulations"
- UBC basın bülteni (ScienceDaily üzerinden), 2026-10-09: https://www.sciencedaily.com/releases/2026/10/261007042102.htm
  - Teleskop Penticton yakınında; veriler 2019'dan.
  - Evren "about five billion years old".
  - Doğrulama testleri bir yılı aştı.
  - "roughly two per cent of the hydrogen in the universe was in neutral atomic form at this time"
- Futura, 2026-10-05: https://www.futura-sciences.com/en/?p=901058
  - 2019'dan 94 gece; evren yaklaşık 5 milyar yaşında.
- Not: ScienceDaily başlığındaki "9-billion-year-old" bir geriye bakış süresi ve metinle doğrudan uyuşmuyor. Metinde yalnızca bültenin kendi ifadesi olan "evren ~5 milyar yaşında" kullanıldı.
- arXiv sürümü 2511.19620 (Kasım 2025). Dergi yayını ve basın duyurusu bu dönemde.

## 6. 2026-09-21-gunes-sistemi-omru-batygin
- Makale: Batygin vd., "Terminal Instability of the Solar System Triggered by Stochastic Solar Mass Loss", ApJL 1009, L22. Çevrimiçi yayın 2026-09-21 (Crossref). https://doi.org/10.3847/2041-8213/aea290
  - Özetteki ifadeler:
    - "Mercury's orbit carries a ∼1% chance of destabilization before the Sun leaves the main sequence"
    - "intrinsic dynamical lifetime estimated at ∼10^18 yr"
    - "expected to persist for ∼100 Gyr"
    - "The recently measured white dwarf recoil demands asymmetric mass loss … discrete, independently directed ejections"
    - "orbit crossings can commence on the red giant branch, with ∼40% of realizations undergoing disruption or violent scattering before the white dwarf forms and ∼90% self-destructing within 3 Gyr"
    - "collapses from 10^18 yr to approximately a gigayear after white dwarf formation"
- AAS Nova, Alexia Kubas, 2026-09-30: https://aasnova.org/2026/09/30/the-solar-system-has-a-new-life-expectancy-and-its-a-billion-times-shorter/
  - Ekip Caltech'ten.
  - Sonuç simülasyona ve Güneş için tahmin edilen ~10⁻⁴ M☉'lik atım büyüklüğüne bağlı.

## 7. 2026-09-17-hd156295-nabiz-zamanlamasi
- Makale: Wilson vd., "A Search for Substellar Companions around A-type Stars: Pulsation Timing Detection of Eight Brown Dwarf Candidates and a Possible Habitable-zone Planet", ApJ 1009, 78. Çevrimiçi yayın 2026-09-17 (Crossref). https://doi.org/10.3847/1538-4357/ae93a0
  - Özetteki ifadeler:
    - "rapid rotation and variability of massive stars impede detection"
    - "light-travel-time variations"
    - "16,440 δ Scuti pulsators from TESS"
    - "one candidate planet, HD 156295 b, and eight candidate brown dwarfs"
    - "6.3 ± 1.1 MJ"
    - "If confirmed, HD 156295 would be the hottest star to host a habitable-zone planet"
    - "Astrometric follow-up could confirm"
- AAS Nova, Lucas Brown, 2026-09-25: https://aasnova.org/2026/09/25/stellar-pulsations-suggest-habitable-zone-planet-around-a-massive-star/
  - Yörünge dönemi yaklaşık 2.200 gün, uzaklık yaklaşık 3,9 au; yaşanabilir bölgenin dış kenarında.
  - Sinyalin gerçek olma olasılığı %50'nin biraz üzerinde.
  - Bulgular "quite tentative".

## 8. 2026-09-16-elias-2-24b-en-genc-gezegen
- Makale: Bernardi vd., "Searching for Embedded Protoplanets with the Keck/NIRC2 Vortex Coronagraph: Confirmation of a Core-accretion Planet in the Narrow Gap of the Elias 2-24 Disk", ApJL 1009, L3. Çevrimiçi yayın 2026-09-16 (Crossref). https://doi.org/10.3847/2041-8213/ae9bb6
  - Özetteki ifadeler:
    - "seven stars obtained with the Keck/NIRC2 vortex coronagraph"
    - "We confirm the planetary candidate around Elias 2-24 … at a separation of 394 ± 31 mas (54.9 ± 4.3 au)"
- Space.com, Chelsea Gohd, 2026-09-17: https://space.com/astronomy/exoplanets/scientists-find-youngest-exoplanet-on-record-a-newborn-named-elias
  - 1 milyon yaştan küçük.
  - Yaklaşık Jüpiter kütlesinde.
  - Yaklaşık 450 ışık yılı uzakta.
  - ALMA ve VLT daha önce ipucu vermişti.
  - Andrea Bernardi, Universidad Diego Portales.
  - Önceki rekor sahiplerinin hepsi 5 milyon yaşın üzerinde.
- NASA bülteni (ScienceDaily üzerinden), 2026-09-17: https://www.sciencedaily.com/releases/2026/09/260917003712.htm
  - Nokta 2018 ve 2020 Keck verilerinde de var.
  - Önceki rekorlar PDS 70 ve WISPIT 2'nin gezegenleri.
  - Modeller Jüpiter uzaklığında yaklaşık 5 milyon yıl öngörüyor.
  - Cieza'nın sözü: "best planet-formation models are still missing some important processes"
  - "at the limit of what current telescopes can detect"

## 9. 2026-09-16-kucuk-kirmizi-noktalar-simulasyon
- Makale: Chon vd., "Overmassive black holes and little red dots naturally form in simulations", Nature 657, 621. Çevrimiçi yayın 2026-09-16 (Crossref). https://doi.org/10.1038/s41586-026-10985-8
  - Özetteki ifadeler:
    - "fully cosmological radiation-hydrodynamic simulations"
    - "heavy seeds on the order 10^6 M☉ naturally form, exceeding typical theoretical expectations by an order of magnitude"
    - "dense, optically thick disks whose strong electron scattering produces broad Hα emission comparable to that seen in little red dots"
    - "Sustained super-Eddington accretion then drives fast growth to about 3 × 10^7 M☉ by z ≃ 8"
- Space.com, Robert Lea, 2026-09-29: https://www.space.com/astronomy/black-holes/the-james-webb-space-telescopes-mysterious-little-red-dots-may-be-overfeeding-black-holes
  - LRD'ler Büyük Patlama'dan 600 milyon ile 1 milyar yıl sonra görülüyor, evren 1,5 milyar yaşına gelmeden kayboluyor.
  - Simülasyon LRD'ler için tasarlanmamıştı.
  - LRD'lerin neden kaybolduğu hâlâ "big mystery".
- NINS bülteni (ScienceDaily üzerinden), 2026-09-17: https://www.sciencedaily.com/releases/2026/09/260917003703.htm
  - Simülasyonlar ATERUI III süper bilgisayarında çalıştırıldı.
  - Komşu galaksilerin morötesi ışığı yıldız oluşumunu engelliyor ve gaz süper kütleli bir yıldıza çöküyor.
- AAS Nova (2026-10-26, Liu vd. hakkında): https://aasnova.org/2026/10/26/seeing-red-new-constraints-on-origin-of-jwsts-little-red-dots/
  - "many competing hypotheses". Bu kaynak "tartışmalı" etiketinin dayanağı.

## 10. 2026-09-15-beta-pictoris-b-radyo
- Ön baskı: Ortiz Ceballos, Berger, Cendes, "Discovery of radio emission from the exoplanet β Pictoris b", arXiv:2609.16720, gönderim 2026-09-15, "Submitted". https://arxiv.org/abs/2609.16720
  - Özetteki ifadeler:
    - "first direct detection of auroral radio emission from an exoplanet … with the MeerKAT array"
    - "rapid, recurring, and highly circularly polarized bursts, as well as persistent emission, at frequencies of 0.85 to 3.5 GHz"
    - "electron cyclotron maser radiation, which implies a magnetic field of ≳1.25 kG"
- Science News, Emily Conover, 2026-09-21: https://www.sciencenews.org/article/exoplanet-aurora-radio-waves
  - Gezegen yaklaşık 63 ışık yılı uzakta ve yaklaşık 10 Jüpiter kütlesinde.
  - Dönüşü yaklaşık 8 saat.
  - Dünya'nın manyetik alanı yaklaşık 0,5 gauss.
  - Yazarlar Oregon Üniversitesi'nden.
  - Joe Callingham (çalışmaya katılmadı) dönüşle eş zamanlı tekrarı görmenin sonucu kesinleştireceğini söylüyor.
  - Makale hakemden geçmedi.

## 11. 2026-09-14-venus-uydusu-gelgit
- Makale: Kane vd., "Tidal Demise: The Evolution and Fate of a Hypothetical Venus Moon", ApJ 1009, 31. Çevrimiçi yayın 2026-09-14 (Crossref). https://doi.org/10.3847/1538-4357/ae9d6c
  - Özetteki ifadeler:
    - "spin period (P0 = 5–100 hr), moon mass (Mm = 0.01–10 MMoon)"
    - "for circular orbits around a rapidly spinning Venus (P0 ≲ 12 hr), a lunar-mass satellite survives the age of the solar system"
    - "for P0 ≳ 15 hr or Mm ≳ 2 MMoon, the synchronous radius overtakes the orbit and drives Roche destruction within ∼0.03–1.7 Gyr"
    - "Both are met only within a restricted region of parameter space"
    - "a subsequent catastrophic stripping event, while capable of removing a moon, is not required"
- Universe Today, Evan Gough, 2026-09-15: https://www.universetoday.com/articles/if-venus-had-an-ancient-moon-it-was-doomed
  - Venüs 243 günde ve ters yönde dönüyor.
  - Model Dünya–Ay sistemiyle sınandı.
  - Çalışma Venüs'ün uydusu olduğunu göstermiyor.
- UC Riverside bülteni (ScienceDaily üzerinden), 2026-09-16: https://www.sciencedaily.com/releases/2026/09/260915232122.htm
  - Ay her yıl yaklaşık 4 cm uzaklaşıyor.
  - Stephen Kane UCR'den.
- Not: ScienceDaily kütle aralığını "Ay'ın yarısı ile 10 katı" diye veriyor. Makale özetindeki "0,01–10" kullanıldı.

## 12. 2026-09-09-lbt-ilksel-helyum
- Makale (IV): Aver vd., "The LBT Yp Project. IV. A New Value of the Primordial Helium Abundance", ApJ. Çevrimiçi yayın 2026-09-09 (Crossref). https://doi.org/10.3847/1538-4357/ae879b
  - Özetteki ifadeler:
    - "54 metal-poor H II regions"
    - "15 high signal-to-noise ratio (SNR) targets with low metallicity"
    - "Yp = 0.2458 ± 0.0013"
    - "unprecedented precision of 0.5%"
    - "BBN result, Yp = 0.2467 ± 0.0002, based on the Planck determination of the baryon density"
- Makale (V): Yeh vd., ApJ 1008, 241, 2026-09-09. https://doi.org/10.3847/1538-4357/ae879c
  - Özetteki ifadeler: "Nν = 2.925 ± 0.082" ve "BBN at ∼1 s and the CMB at ∼400,000 yr".
- Makale (I): Skillman vd., ApJ 1008, 237. https://doi.org/10.3847/1538-4357/ae879f
  - Yöntem ve LBT/MODS bilgisi buradan.
- Ohio State News, 2026-09-09: https://news.osu.edu/using-helium-astronomers-blow-certainty-into-early-big-bang-conditions/
  - Belirsizlik ~%2'den ~%0,5'e indi.
  - Sonuç Standart Model'le tutarlı.
- Focus.it, Luigi Bignami, 2026-10-23: https://www.focus.it/scienza/spazio/cosa-accadde-nei-primi-cinque-minuti-dopo-il-big-bang-misurata-la-quantita-di-elio-primordiale
  - Yp = 0,2458 ± 0,0013, yani yaklaşık %24,6.
  - 15 galaksi; 130 saat LBT gözlemi.
  - 10'dan fazla helyum ve 15 hidrojen çizgisi kullanıldı.
  - Yaklaşık üç kat daha hassas.
- Tutarsızlık notu: OSU bülteni "48 high-quality galactic samples" diyor. Makale özeti 54 gözlenen ve 41 seçilen hedeften söz ediyor; ortalama 15 hedeften alınmış. Metinde makale özetindeki sayılar (54 ve 15) kullanıldı.
- Bağımsız haber: Focus.it. SciTechDaily sayfası üniversite bülteninin kopyası göründüğü için kullanılmadı.

## 13. 2026-09-04-supernova-unite-karanlik-enerji
- Ön baskı: Camilleri vd., "Supernovae Unite: Combining Pantheon+ and DES-SN5YR", arXiv:2609.05053. Gönderim 2026-09-04, v2 2026-09-09. "Submitted to PASA". https://arxiv.org/abs/2609.05053
  - Özetteki ifadeler:
    - "consisting of 2884 likely type Ia supernovae"
    - "redetermine host-galaxy stellar masses for over 98% of the sample"
    - "combined with Cosmic Microwave Background and both DES and DESI Baryon Acoustic Oscillation data"
    - "(Ωm, w0, wa) = (0.305 ± 0.004, −0.861, −0.60)"
    - "The Bayesian evidence indicates only weak preference for time evolving dark energy, whereas frequentist analyses yield a preference over Flat-ΛCDM at a significance of 3.3σ (3.1σ)"
- Eşlik eden ön baskı: Lee vd., arXiv:2609.05321 (ev sahibi galaksi kütleleri).
- Sci.News, 2026-09-08: https://www.sci.news/astronomy/changing-dark-energy-15049.html
  - 2.884 Ia süpernovası.
  - Toz, galaksi kütlesi ve merceklenme için düzeltme yapıldı.
  - Bulgular karanlık enerjinin değişebileceğine "evidence" olarak sunuluyor, kesin sonuç olarak değil.
- University of Queensland bülteni (ScienceDaily üzerinden), 2026-10-22: https://www.sciencedaily.com/releases/2026/10/261021231244.htm
  - Ryan Camilleri ve Tamara Davis UQ'dan.
  - Sonuçlar ön niteliğinde.

## 14. 2026-08-19-s301-sgr-a-donus
- Makale: Abd El Dayem vd. (GRAVITY+), "Discovery of a star sensitive to the spin of Sagittarius A*", Nature 657, 359. Çevrimiçi yayın 2026-08-19 (Crossref). https://doi.org/10.1038/s41586-026-10894-w
  - Özetteki ifadeler:
    - "the 4.3 × 10^6 M☉ MBH"
    - "a faint main-sequence star (mK = 19.3), S301, on an 8.7-year orbit"
    - "peak velocity of the star reaches 25,000 km s−1"
    - "the motion of S301 is directly sensitive to the spin of Sgr A*"
    - "captured component of a binary that was torn apart by the Hills mechanism"
- Science News, Mara Johnson-Groh, 2026-08-19: https://www.sciencenews.org/article/record-breaking-star-black-hole-spin
  - Yıldız ışık hızının yaklaşık %8'ine ulaşıyor.
  - Sgr A*'ya bilinen en yakın yıldız.
  - En yakın geçişte yaklaşık 1,7 milyar km; Satürn–Güneş uzaklığından biraz fazla.
  - Ölçüm VLTI ile yapıldı.
  - İlk görüntüleme 2023'te; veriler 2017'ye uzanıyor.
  - Dönüş ölçümü önümüzdeki yaklaşık 15 yıl içinde.

---

## Elenen adaylar ve nedenleri
- **Ötegezegen uydusu (CD-35 2722, Hoy vd., Nature):** Makale 2026-07-22'de yayımlandı (Crossref), yani dönemin dışında.
- **3I/ATLAS koma haritası (Roth vd., ApJL 1005, L5):** Yayın tarihi 2026-06-24, dönemin dışında.
- **BlackTHUNDER, üç kara delik (Übler vd., A&A 712, A80):** A&A yayını 2026-08-12. Ancak arXiv sürümü (2509.21575) 2025'te çıktı ve haberi o zaman yapıldı; eski haber sayıldı.
- **Hubble gerilimi ve ilksel manyetik alanlar (Jedamzik vd., Nature Astronomy):** Makale 2025 tarihli.
- **Einstein Probe EP250704a:** Science Bulletin'de yayımlandı; dergi listede yok.
- **Plüton'da sıvı azot (PSJ), yeşil beyaz cüce (RAS Techniques and Instruments), Ay'ın saatler içinde oluşması (ApJL):** Ya dergi listede yok ya da yer/zaman sınırı nedeniyle alınmadı. Ay makalesinin Crossref kaydı alınamadı.
- **Kütleçekim dalgası, nötrino ve hızlı radyo patlaması (FRB):** Dönem içinde (Ağustos ortası – Ekim) ikinci kaynağıyla doğrulanabilen bir makale bulunamadı (bulamadım).
  - KM3NeT çalışması Mart 2026 tarihli.
  - "Rosetta taşı" FRB haberi Haziran 2026 tarihli.
  - PTA karanlık yıldız makalesi Physical Review D'de; dergi listede yok.
