# "Bu gece Ay'da" rehberi (v47) — kaynaklar ve hesaplar

Erişim 2026-11-10. İstekler genel User-Agent ile ("urania-arastirma/1.0"); başlıklarda e-posta ya da kişisel veri yok.

## Veri ve görsel
| Ne | Kaynak | Alıntı / not |
|---|---|---|
| Ay yapı adları, merkez noktaları, çaplar | IAU/USGS Gazetteer of Planetary Nomenclature, https://asc-planetarynames-data.s3.us-west-2.amazonaws.com/MOON_nomenclature_center_pts.zip | Meta veri (metadata_nomenclature_points_MOON.xml) `<useconst>Public domain.</useconst>`; atıf: "International Astronomical Union (IAU) and United States Geological Survey (USGS)". 9 087 kayıt; yalnız "Adopted by IAU", yakın yüz (|boylam| ≤ 90°) ve tür kodları ME, OC, LC, SI, PA, AA, MO (yalnız "Montes"). Üretici: araclar/ay_yapilari.py → veri/ay_yapilari.json (153 yapı). |
| Ay dokusu | NASA SVS CGI Moon Kit, https://svs.gsfc.nasa.gov/4720/ , lroc_color_2k.jpg (2048 × 1024, eşdikdörtgen) | Sayfa: "Please give credit for this item to: NASA's Scientific Visualization Studio". EXIF verisi çıkarılarak img/ay/lroc_color_2k.jpg olarak depoya kondu (piksel değişmedi, quality='keep'). Yön doğrulaması: Mare Humorum (−39°, −24°) koyu, aynası (+39°, −24°) parlak; Tycho (−11,4°, −43,3°) parlak → sol kenar −180°, orta 0°, doğu sağda. |

## Boyut eşiği
| Adım | Değer | Kaynak |
|---|---|---|
| Gözün çözme gücü | 1′ = 60″ | https://en.wikipedia.org/wiki/Visual_acuity : "6/6 or 20/20 vision is defined as the ability to resolve two points of light separated by a visual angle of one minute of arc" (aynı sayfa: sağlıklı genç gözler çoğu kez daha keskin, 6/5–6/4; 1′ eşik/tanım değeridir) |
| 7× dürbünde | 60″ / 7 = 8,57″ | HESAP |
| Ay'ın ortalama uzaklığı | 384 400 km | https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html : "Semimajor axis (10^6 km) 0.3844" |
| Ay'da çözülen boy | 384 400 × 8,57 / 206 265 = 15,97 km | HESAP (1 radyan = 206 265″) |
| Eşik | kısa görünen eksen = çap × cos c ≥ 3 × 15,97 = 47,9 km | **Urania'nın seçimi**: bir yapının biçimini (çember, sıra) tanımak için en az 3 çözme öğesi; c yapının ortalama Ay merkezine açısal uzaklığı (cos c = cos enlem · cos boylam), kenara yakın yapılar o eksende kısalır. Sonuç 153 yapı (görev: 100–200). |
| Ay yarıçapı (çizimde) | 1737,4 km | NASA Moon Fact Sheet: "Volumetric mean radius (km) 1737.4"; Horizons: "Radius (IAU), km = 1737.4" |

## Hesap ve doğrulama
| Ne | Yöntem | Kaynak |
|---|---|---|
| Librasyon (alt gözlemci noktası), alt Güneş noktası | Astronomy Engine RotationAxis (IAU kutup ve W) ile Ay gövde çerçevesi; gözlemciden Ay'a yerel vektör (ObserverVector, paralaks dahil) | JPL Horizons gözlemci tablosu (nicelikler 14, 15; MOON_ME çerçevesi, DE441) → testler/veri/ay/horizons_ay.json (24 ölçüm: İstanbul ve Ankara, 10, 17, 26–27 Kasım 2026). En büyük farklar: alt gözlemci boylamı 0,0064°, enlemi 0,0014°, alt Güneş boylamı 0,0029°, kutup konum açısı 0,0016°. |
| Terminator | sabah (gün doğumu) sınırı = alt Güneş boylamı − 90°, akşam sınırı = + 90° (Ay ekvatorunda); büyüyen Ay'da (MoonPhase < 180°) görünen sınır sabah sınırıdır | HESAP (alt Güneş noktasının 90° uzağındaki büyük daire) |
| Dürbünde yön | Dürbün görüntüyü ters çevirmez: https://en.wikipedia.org/wiki/Binoculars "Image orientation correction assembly … Without this, the image would be inverted and laterally reversed"; ekranın üstü = tepe (başucu). Ay kuzeyinin ekrandaki açısı vektörle; doğrulama için paralaktik açı q: https://en.wikipedia.org/wiki/Parallactic_angle "the formula recommended by Meeus: tan q = sin h / (cos δ tan φ − sin δ cos h)"; Horizons NP.ang ve yerel saat açısıyla: dönüklük = −(NP − q), en büyük fark 0,0018°. |
| Gölge seçimi | Güneş yapının üstünde 0–10° yüksekte, yapı görünür yüzde (bakış > 0,15) | **Urania'nın seçimi** (alçak Güneş uzun gölge). |
| Uygun gece | Ay ≥ 15° yüksekte, Güneş −6°'nin altında, aydınlık %5–%97 | **Urania'nın seçimi**. |

## Türkçe adlar
56 deniz/göl/körfez/bataklık/okyanus/sıradağ adından yalnız 5'inin kaynaklı Türkçe karşılığı bulundu; öteki 51'i Latince kaldı (kendimiz çevirmedik). Tablo: arastirma/ay_adlari_tr.json. Tür adları: "Ay denizi" (https://tr.wikipedia.org/wiki/Ay), göl/bataklık/körfez/okyanus (https://tr.wikipedia.org/wiki/Ay_denizi : "göl (lacus), bataklık (palus) ve körfez (sinus) adları … bir adet de okyanus (oceanus)"), sıradağ (TDK: "Uzunlamasına sıralanmış dağ dizisi"), çarpma krateri (TÜBA: "çarpma krateri … İng. impact crater"). Not: TÜBA "mare" için "Ay düzlüğü" diyor; uygulama tr.wikipedia'daki "deniz"i kullanır, çelişki burada yazılıdır. Görev metnindeki "Huzur Denizi" örneği tr.wikipedia'da "Sessizlik Denizi" maddesinde eş ad olarak geçiyor; madde başlığı kullanıldı.

---
# Ek — Türkçe ad araştırması (alt ajan ham notları, 2026-11-10)


Yöntem: Her iddia aşağıdaki URL'lerden 2026-11-10'da indirilmiş metinden birebir alıntıdır. Hafızadan çeviri yok.
Taranan kaynaklar:
- en.wikipedia API `prop=langlinks&lllang=tr` ile 56 adın tamamı. Yalnız **Mare Tranquillitatis** bir tr makalesine bağlı ("Sessizlik Denizi"); diğer 55 adın tr.wikipedia makalesi yok.
- tr.wikipedia tam metin arama (`"<Latince ad>"` tırnaklı, Özel:Ara) + bulunan her sayfanın metni. Ayrıca aday Türkçe biçimlerle ters arama yapıldı ("Fırtınalar Okyanusu", "Bulutlar Denizi" vb.). Bir ad yalnız sayfa onu Latince adla ya da aynı nesneyle eşleştiriyorsa kabul edildi.
- TÜBA Türkçe Bilim Terimleri Sözlüğü, `http://www.tubaterim.gov.tr/ATS/index.php/w_anasayfa/search/?arama_options=1&lng=1%2C2%2C3&szl=38%2C39%2C37&q=<terim>`. Not: HTTPS çalışmıyor (sunucu ara sertifikayı göndermiyor, curl 60). Sitenin kendi HTTP adresi kullanıldı; TLS doğrulaması kapatılmadı.
- TDK `https://sozluk.gov.tr/gts?ara=...`: "Huzur Denizi", "Yağmurlar Denizi", "ay denizi", "ay düzlüğü", "çarpma krateri" → hepsi `{"error":"Sonuç bulunamadı"}`. TDK'da Ay adı yok.

## 1. Tablo (56 ad)

| Latince (IAU) | Türkçe | Kaynak URL | Alıntı |
|---|---|---|---|
| Mare Tranquillitatis | **Sessizlik Denizi** (aynı cümlede: Sakinlik Denizi, Huzur Denizi) | https://tr.wikipedia.org/wiki/Sessizlik_Denizi | "Sessizlik Denizi, Mare Tranquillitatis (Latince tranquillitātis, Sakinlik Denizi veya Huzur Denizi) Ay'daki Tranquillitatis havzasında yer alan bir Ay havzasıdır." Ek: https://tr.wikipedia.org/wiki/Surveyor_programı → "Sessizlik Denizi'ne (Mare Tranquillitatis) indi"; https://tr.wikipedia.org/wiki/Apollo_11 bilgi kutusu → "İniş yeri \| Huzur Üssü, Huzur Denizi" |
| Mare Imbrium | **Yağmurlar Denizi** | https://tr.wikipedia.org/wiki/Lunohod_1 | "17 Kasım'da Yağmurlar Denizi (Mare Imbrium) denen ve hakkında hiçbir şey bilinmeyen bir bölgeye iniş yaptı." |
| Mare Nubium | **Bulutlar Denizi** | https://tr.wikipedia.org/wiki/Lunar_Reconnaissance_Orbiter | "LRO'dan gelen ilk görüntüler 2 Temmuz 2009 tarihinde yayımlanmış ve bu görüntüler Mare Nubium'un (Bulutlar Denizi) güneyindeki bir yayla bölgesini göstermiştir" |
| Oceanus Procellarum | **Fırtınalar Okyanusu** (DOLAYLI: iki kaynakla, aynı cümlede değil) | https://tr.wikipedia.org/wiki/Apollo_12 + https://en.wikipedia.org/wiki/Oceanus_Procellarum | tr Apollo 12 bilgi kutusu: "İniş yeri \| Fırtınalar Okyanusu 3°00′45″S 23°25′18″W". en: "During the November 1969 Apollo 12 mission, astronauts Pete Conrad and Alan Bean landed the Lunar Module Intrepid nearly 165 meters from Surveyor 3 in Oceanus Procellarum." |
| Montes Taurus | **Toros Dağları** (yapı türü: "Sıra Dağ") | https://tr.wikipedia.org/wiki/Astronomide_kullanılan_Türkçe_isimler | Tablo satırı (Yapı Adı \| Yapı Türü \| Anadolu ve Türk Kökenli İsimler \| Gök Cismi): "Montes Taurus \| Sıra Dağ \| Toros Dağları \| Ay". Not: sayfa bunu adın Anadolu kökeni olarak veriyor, Türkçe çeviri olarak değil. |
| Montes Archimedes | kaynak yok (yalnız tür: "dağ sırası") | https://tr.wikipedia.org/wiki/Arşimet_(anlam_ayrımı) | "Montes Archimedes, Ay'da bir dağ sırası" |
| Mare Serenitatis | kaynak yok (tr.wiki Latince kullanıyor) | https://tr.wikipedia.org/wiki/Ay | "Ay'ın görünen yüzünde başlıca kraterler Mare Imbrium, Mare Serenitatis, Mare Crisium ve Mare Nectaris'tir." |
| Mare Crisium | kaynak yok (tr.wiki Latince kullanıyor) | https://tr.wikipedia.org/wiki/Ay | aynı cümle |
| Mare Nectaris | kaynak yok (tr.wiki Latince kullanıyor) | https://tr.wikipedia.org/wiki/Selenoloji | "Bu yüzden bazı darbe havzaları için (özellikle Mare Nectaris) yanlışlıkla Imbrium'la aynı yaşın verilmiş olması mümkündür" |
| Mare Fecunditatis | kaynak yok (tr.wiki Latince kullanıyor) | https://tr.wikipedia.org/wiki/Luna_programı | "... E - Mare Fecunditatis" (iniş yeri listesi) |
| Mare Cognitum | kaynak yok (tr.wiki Latince kullanıyor) | https://tr.wikipedia.org/wiki/Ay_Müzesi | "Apollo 12 Apollo Ay Modülü Intrepid, Mare Cognitum" |
| Mare Insularum | kaynak yok (yalnız İngilizce kaynakça başlığında) | https://tr.wikipedia.org/wiki/Ay | "Ages and stratigraphy of mare basalts in Oceanus Procellarum, Mare Numbium, Mare Cognitum, and Mare Insularum" |
| Mare Humorum | kaynak yok (yalnız İngilizce resim yazısında) | https://tr.wikipedia.org/wiki/Şubat_2008_Ay_tutulması | "Mare Humorum appears at bottom" |
| Palus Putredinis | kaynak yok (tr.wiki Latince kullanıyor) | https://tr.wikipedia.org/wiki/Luna_programı | "... - Palus Putredinis" |
| Palus Somni | kaynak yok (tr.wiki Latince kullanıyor) | https://tr.wikipedia.org/wiki/Sessizlik_Denizi | "Mars'ın kuzeydoğu kenarındaki Palus Somni, Tranquillitatis'ten taşan bazalt ile doludur" (sayfada "Mars" geçiyor, büyük olasılıkla yazım hatası; aynen alıntılandı) |
| Sinus Lunicus | kaynak yok | — | tr.wiki'de 0 sonuç |
| Lacus Bonitatis | kaynak yok | — | 0 sonuç |
| Lacus Gaudii | kaynak yok | — | 0 sonuç |
| Lacus Lenitatis | kaynak yok | — | 0 sonuç |
| Mare Spumans | kaynak yok | — | 0 sonuç |
| Montes Haemus | kaynak yok | — | 0 sonuç |
| Montes Harbinger | kaynak yok | — | 0 sonuç |
| Montes Pyrenaeus | kaynak yok | — | 0 sonuç |
| Sinus Aestuum | kaynak yok | — | 0 sonuç |
| Sinus Roris | kaynak yok | — | 0 sonuç |
| Sinus Successus | kaynak yok | — | 0 sonuç |
| Montes Jura | kaynak yok | — | 0 sonuç |
| Palus Epidemiarum | kaynak yok | — | 0 sonuç |
| Montes Recti | kaynak yok | — | 0 sonuç |
| Montes Carpatus | kaynak yok | — | 0 sonuç |
| Montes Caucasus | kaynak yok | — | 0 sonuç |
| Lacus Somniorum | kaynak yok | — | 0 sonuç |
| Lacus Timoris | kaynak yok | — | 0 sonuç |
| Lacus Doloris | kaynak yok | — | 0 sonuç |
| Lacus Excellentiae | kaynak yok | — | 0 sonuç |
| Lacus Felicitatis | kaynak yok | — | 0 sonuç |
| Lacus Mortis | kaynak yok | — | 0 sonuç |
| Lacus Odii | kaynak yok | — | 0 sonuç |
| Lacus Temporis | kaynak yok | — | 0 sonuç |
| Mare Anguis | kaynak yok | — | 0 sonuç |
| Mare Undarum | kaynak yok | — | 0 sonuç |
| Montes Teneriffe | kaynak yok | — | 0 sonuç |
| Montes Spitzbergen | kaynak yok | — | 0 sonuç |
| Montes Agricola | kaynak yok | — | 0 sonuç |
| Montes Riphaeus | kaynak yok | — | 0 sonuç |
| Mare Vaporum | kaynak yok | — | 0 sonuç |
| Sinus Medii | kaynak yok | — | 0 sonuç |
| Sinus Amoris | kaynak yok | — | 0 sonuç |
| Sinus Asperitatis | kaynak yok | — | 0 sonuç |
| Sinus Concordiae | kaynak yok | — | 0 sonuç |
| Sinus Fidei | kaynak yok | — | 0 sonuç |
| Sinus Honoris | kaynak yok | — | 0 sonuç |
| Sinus Iridum | kaynak yok | — | 0 sonuç |
| Mare Frigoris | kaynak yok | — | 0 sonuç |
| Montes Apenninus | kaynak yok | — | 0 sonuç |
| Montes Alpes | kaynak yok | — | 0 sonuç |

Ters aramada eşleşme çıkmayan Türkçe biçimler (Ay bağlamında 0 sonuç): Krizler/Kriz Denizi, Bolluk Denizi, Nektar Denizi, Nem(ler) Denizi, Buhar(lar) Denizi, Soğuk(luk) Denizi, Berraklık/Dinginlik/Durgunluk Denizi, Gökkuşağı(ları) Körfezi, Ölüm Gölü, Rüyalar/Düşler Gölü, Arşimet Dağları, Çürüme/Uyku/Salgınlar Bataklığı, Sıcaklık/Çiy Körfezi. "Apenin/Karpat/Kafkas Dağları" yalnız Dünya'daki dağlar için geçiyor; "Orta Körfez" yalnız İzmir Körfezi için. "Bereket Denizi" yalnız Mişima romanı için.

Özet: 56 adın 4'ünün kaynaklı Türkçe adı var (Sessizlik Denizi, Yağmurlar Denizi, Bulutlar Denizi, Toros Dağları). 1'inin dolaylı kaynağı var (Fırtınalar Okyanusu). Kalan 51 ad için kaynak yok.

## 1b. Tür adları

| Latince | Türkçe | Kaynak URL | Alıntı |
|---|---|---|---|
| mare | Ay denizi | https://tr.wikipedia.org/wiki/Ay | "Ay'ın öteki yüzünün ayırt edici özelliklerinden biri Ay denizi (Latince: (mare, çoğulu maria) adı verilen düzlüklerin hemen hemen hiç olmamasıdır." |
| mare (TÜBA terimi) | **Ay düzlüğü** (TÜBA "deniz" demiyor) | http://www.tubaterim.gov.tr/ATS/index.php/w_anasayfa/search/?arama_options=1&lng=1%2C2%2C3&szl=38%2C39%2C37&q=mare | "Ay düzlüğü (doğa.) (Alm. Mare, n; Fr. Maré, f; mer lunaire, f; İng. lunar mare; mare) ast. Geçmişteki yanardağ patlamalarından kaynaklanan Ay yüzeyindeki geniş, demirce zengin, bazalt kaplı düzlük." |
| lacus, palus, sinus, oceanus | göl, bataklık, körfez, okyanus | https://tr.wikipedia.org/wiki/Ay_denizi | "Bu Ay denizlerinin adlandırılmasında farklı terimler kullanılmıştır, örnek olarak göl (lacus), bataklık (palus) ve körfez (sinus) adları aynı özellikteki daha ufak bazalt düzlüklerine verilirken; bir adet de okyanus (oceanus) olarak adlandırılan bazalt düzlüğü bulunur." |
| montes | Sıra Dağ / dağ sırası | https://tr.wikipedia.org/wiki/Astronomide_kullanılan_Türkçe_isimler ; https://tr.wikipedia.org/wiki/Arşimet_(anlam_ayrımı) | "Montes Taurus \| Sıra Dağ \| Toros Dağları \| Ay" ; "Montes Archimedes, Ay'da bir dağ sırası" |
| (montes, genel sözcük) | sıradağ | https://sozluk.gov.tr/gts?ara=sıradağ | TDK: "sıradağ … Uzunlamasına sıralanmış dağ dizisi" (coğ.). Ay'a özgü değil. TÜBA'da "montes" ve "mountain range" kaydı yok. |
| crater | çarpma krateri | http://www.tubaterim.gov.tr/ATS/index.php/w_anasayfa/search/?arama_options=1&lng=1%2C2%2C3&szl=38%2C39%2C37&q=impact%20crater | "çarpma krateri (doğa.) (Alm. Einschlagkrater, m; Impaktkrater, m; Fr. cratère d'impact, m; İng. impact crater) ast. Güneş Sistemi'ndeki bir gezegenin, bir gezegenin bir uydusunun veya başka bir katı gökcisminin yüzeyinde, çok büyük hızla çarpan daha küçük bir gökcisminin oluşturduğu, ortası çevresine göre çukur, etrafı saçılan malzeme ile yükselmiş, dairesel çöküntü." |
| crater | çarpma krateri | https://tr.wikipedia.org/wiki/Çarpma_krateri | "Çarpma krateri, bir gezegenin, Ay'ın veya başka bir katı cismin yüzeyinin de, daha küçük bir cismin yüzeye hiper hızla çarpmasıyla oluşan bir dairesel çöküntüdür." |
| krater (TDK) | dikkat: TDK'da yalnız yanardağ anlamı | https://sozluk.gov.tr/gts?ara=krater | "krater … Fransızca cratère … ► yanardağ ağzı" (jeol.) |

TÜBA'da "lacus", "palus", "montes", "oceanus" için kayıt yok. "sinus" yalnız matematikteki sinüs olarak geçiyor.

## 2. Görme keskinliği (20/20 = 1 yay dakikası)
Kaynak: https://en.wikipedia.org/wiki/Visual_acuity
- "6/6 or 20/20 vision is defined as the ability to resolve two points of light separated by a visual angle of one minute of arc, corresponding to 60 PPD"
- "For 6/6 = 1.0 acuity, the size of a letter on the Snellen chart or Landolt C chart is a visual angle of 5 arc minutes (1 arc min = 1/60 of a degree) … the critical gap that needs to be resolved is 1/5 this value, i.e., 1 arc min. The latter is the value used in the international definition of visual acuity"
- Uyarı: aynı sayfada şu da yazıyor: "In young humans, the average visual acuity of a healthy, emmetropic eye … is approximately 6/5 to 6/4". Yani 1′ bir alt sınır (eşik); sağlıklı ortalama göz daha keskindir.

## 3. Dünya–Ay uzaklığı ve Ay yarıçapı
Kaynak: https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html (Last Updated: 11 January 2024)
- "Semimajor axis (10^6 km) 0.3844" → 384 400 km. Ayrıca "Perigee (10^6 km)* 0.3633", "Apogee (10^6 km)* 0.4055".
- "Volumetric mean radius (km) 1737.4" (Equatorial 1738.1, Polar 1736.0).
- Ek: "Mean values at opposition from Earth … Distance from Earth (equator, km) 378,000 … Apparent diameter (seconds of arc) 1896"

## 4. 7×50 dürbün: görüntü düz ve sağ-sol doğru
Kaynak: https://en.wikipedia.org/wiki/Binoculars
- "Image orientation correction assembly. This is usually a prism assembly that shortens the optical path. Without this, the image would be inverted and laterally reversed, which is inconvenient for the user."
- "Since the Keplerian configuration produces an inverted image, different methods are used to turn the image the right way up."
- "Optical prisms added to the design enabled the display of the image the right way up without needing as many lenses … typically using Porro prism or roof prism systems."
- Porro: "Binoculars of this type use a pair of Porro prisms in a Z-shaped configuration to erect the image."
Kaynak: https://en.wikipedia.org/wiki/Porro_prism
- "Double Porro prism systems are used in small optical telescopes to re-orient an inverted image (an arrangement is known as an image erection system), and especially in many binoculars where they both erect the image and provide a longer, folded distance between the objective lenses and the eyepieces."
Not: Kaynaklar 7×50'yi özel olarak anmıyor. Söylenen, prizmalı dürbünlerin genel özelliği (Porro ve çatı prizması). Bir 7×50 modelinin prizmalı olduğu, o modelin kendi belgesinden ayrıca doğrulanmalı (burada kaynak yok).
