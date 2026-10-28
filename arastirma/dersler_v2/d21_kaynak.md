# d21 — Takımyıldızlar ve mevsimlerin gökyüzü: kaynak listesi

Tarih: 2026-10-28. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
İşaretler:
- [B] bu oturumda WebFetch ile okundu (alıntılar WebFetch özet modelinin aktardığı metindir; doğrulama ajanı bir kez daha bakmalı).
- [Ö] projede önceden doğrulanmış (d1, d7, d11, d14, d15, d20 kaynak dosyaları; satır o dosyadan aktarıldı).
- [V] uygulamanın veri dosyası (veri/takimyildiz.json, veri/yildizlar.json, veri/hedefler.json, arastirma/iau_wgsn_yildiz_adlari.json).
- [HESAP] uygulamanın kendi hesap çekirdeği gok.js (Astronomy Engine) ile Node'da hesaplandı. Gözlemci: 41,0° K, 29,0° D, deniz seviyesi; saatler Türkiye saati (UTC+3). Yıldız koordinatları veri/yildizlar.json (J2000, d3-celestial). Betikler: /tmp/claude-0/-home-claude/56988ba9-8a4f-55a3-b598-a36da9c3de82/scratchpad/d21/ (gunes.js, yildiz.js, mevsim.js, aci.js, leo.js, b1875.js). Yeniden üretmek için `cd /home/claude/urania && node <betik>`; gunes.js için `YIL=2026`.
- [H] basit aritmetik ya da akıl yürütme.

Kısaltmalar: WP = https://en.wikipedia.org/wiki/... ; IAUc = https://en.wikipedia.org/wiki/IAU_designated_constellations ; CG = https://www.constellation-guide.com/what-is-a-constellation/how-many-constellations-are-there ; AST = https://en.wikipedia.org/wiki/Asterism_(astronomy) ; SDN = https://en.wikipedia.org/wiki/Stellar_designations_and_names ; LPN = https://en.wikipedia.org/wiki/List_of_proper_names_of_stars ; BAY = https://en.wikipedia.org/wiki/Bayer_designation ; TDV = https://islamansiklopedisi.org.tr/yildiz ; ROB = https://robinfo.oma.be/en/astro-info/sun/passing-of-the-sun-through-the-zodiac-signs-in-2026/ ; ESO = https://earthsky.org/astronomy-essentials/sun-in-ophiuchus-november-30-to-december-18/ ; HPS = https://www.highpointscientific.com/astronomy-hub/post/star-hopping-beginners-guide ; ESA = https://earthsky.org/tonight/follow-the-arc-to-arcturus-in-may ; ESP = https://earthsky.org/tonight/use-big-dipper-to-locate-polaris-the-north-star ; UCB = https://undsci.berkeley.edu/astrology-is-it-scientific ; SC = https://en.wikipedia.org/wiki/Shawn_Carlson ; THS = https://www.theoi.com/Ther/Skorpios.html ; THK = https://theoi.com/Ther/KetosAithiopios.html ; AE = node_modules/astronomy-engine/astronomy.js (projede; https://github.com/cosinekitty/astronomy, README.md'de bağlantı)

## Bölüm 0 — Takımyıldız nedir: gökyüzünün ilçeleri

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] IAU 88 takımyıldız tanır | IAUc | "88 constellations are recognized by the International Astronomical Union" |
| [B] Takımyıldız = resmî sınırlı bölge, bütün göğü kaplar; asterizm daha genel | AST | constellations are "defined regions with official boundaries" covering the whole sky; asterism "a more general concept than the 88 formally defined constellations" |
| [Ö] Mısır: Avcı = tanrı Sah | https://en.wikipedia.org/wiki/Sirius | [B] "Egyptians worshipped Orion as the god Sah" (WebFetch aktarımı); d20_kaynak.md "Sah, Sopdet's husband" |
| [B] el-Cevzâ: Avcı'da görülen kadın figürü | LPN ; https://en.wikipedia.org/wiki/Betelgeuse | LPN: "the hand of Jawzā," a female figure seen in Orion ; Betelgeuse: "the hand of al-Jawzā’ (Orion)" |
| [H] Resmî listenin Ptolemaios'un Yunan geleneğine dayanması | CG ; IAUc | CG: Ptolemy catalogued "48 ancient constellations" ; IAUc tablosunda 51 "ancient" kayıt (Argo'nun üç parçası dahil). Çıkarım: 88'in çekirdeği Ptolemaios listesi |
| [B] Betelgeuse 548 ışık yılı (+90/−49), 400–600 | https://en.wikipedia.org/wiki/Betelgeuse | infobox 548 ly (+90/−49) ; "400–600 light-years" |
| [Ö] Avcı Bulutsusu 1.270 (WP) ve 1.500 ışık yılı (NASA) | https://en.wikipedia.org/wiki/Orion_Nebula ; https://science.nasa.gov/?p=29958 | d14_kaynak.md: WP:Orion_Nebula "1.267 ± 5,4 ışık yılı" ; d11_kaynak.md NASA: "The nebula is only 1,500 light-years away." |
| [Ö] M42 Avcı takımyıldızında | https://science.nasa.gov/?p=29958 | d11: "M42 blazes brightly in the constellation Orion." |
| [B] Sirius 8,6 ışık yılı; en parlak; −1,46 | https://en.wikipedia.org/wiki/Sirius | "At a distance of 2.64 parsecs (8.6 ly)" ; "the brightest star in the night sky" ; −1.46 |
| [B] Ülker yıldızları birlikte hareket eder; Michell 1767, 500.000'de 1 | https://en.wikipedia.org/wiki/Pleiades | proper motion: stars moving together ; Michell 1767 chance alignment "about 1 in 500,000" |
| [B] Büyük Ayı hareketli grubu ortak doğum; α ve η UMa hariç | https://en.wikipedia.org/wiki/Mizar_and_Alcor | "a mostly dispersed group of stars sharing a common birth" ; move together with most Big Dipper stars "except Alpha and Eta Ursae Majoris" |
| [V] Dubhe = α UMa, Alkaid = η UMa | arastirma/iau_wgsn_yildiz_adlari.json | Dubhe bayer "α UMa" ; Alkaid "η UMa" |
| [H] Örnek: 2026 − 548 = 1478; 2026 − 1500 = 526; 2026 − 1270 = 756; 2026 − 8,6 ≈ 2017; 1500/548 = 2,74 | — | hesap; ışık yılı tanımı d1/d2'de |

## Bölüm 1 — Ptolemaios'un 48'inden IAU'nun 88'ine

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Ptolemaios, Almagest, MS 2. yy, 48 takımyıldız | CG | Ptolemy catalogued "48 ancient constellations" in his Almagest, 2nd century CE |
| [B] Almagest Arapçaya el-Mecistî adıyla çevrildi | TDV | Almagest'in Arapçaya "el-Mecisṭî" adıyla çevrildiği |
| [B] es-Sûfî, Kitâbü Ṣuveri'l-kevâkibi's-sâbite, 48 takımyıldız, Arapça karşılıklar | TDV | Sûfî eserinde "Batlamyus'un Almagest'te andığı kırk sekiz takımyıldızı" inceler, Arapça karşılıklar verir |
| [Ö] es-Sûfî ~964 | https://en.wikipedia.org/wiki/Andromeda_Galaxy | d7_kaynak.md: "Around the year 964 CE, the Persian astronomer Abd al-Rahman al-Sufi described the Andromeda Galaxy" |
| [H] Güney göğü 16.–18. yy'da haritalara girdi | IAUc | tablo tarihleri 1598, 1690, 1756 (aşağıda) |
| [B] Plancius tek başına 4: Crux, Columba, Camelopardalis, Monoceros | IAUc | tablo: Plancius alone (Crux, Columba, Camelopardalis, Monoceros) — WebFetch aktarımı |
| [B] Plancius + Keyser + de Houtman 12 (1598) | IAUc | tablo: 12 "with Keyser & de Houtman (1598)" |
| [B] Hevelius 1690: 7; Lacaille 1756: 14 + Argo'nun 3 parçası | IAUc | tablo: Hevelius (1690) 7; Lacaille (1756) 14 new, plus 3 split from Argo |
| [B] Argo, Ptolemaios'un 48'inden biri; Carina, Puppis, Vela'ya bölündü | IAUc | Ptolemy's 48 "Argo Navis was one of them" ; Carina, Puppis, Vela split from Argo |
| [V] Türkçe adlar: Güneyhaçı (Cru), Güvercin (Col), Zürafa (Cam), Tekboynuz (Mon), Karina (Car), Pupa (Pup), Yelken (Vel) | veri/takimyildiz.json | "ad" alanları |
| [B] Modern liste 1922'de kabul edildi | CG | "The list of the modern constellations was adopted by the IAU in 1922." |
| [B] Üç harfli kısaltmalar 1922 (89 takımyıldız, Argo dahil) | IAUc | abbreviations adopted by the IAU in 1922 for 89 constellations |
| [B] Delporte; sınırlar 1928 kabul, 1930 yayım; sağ açıklık ve dik açıklık yayları | IAUc | Eugène Joseph Delporte; adopted 1928, published 1930; "bordered by arcs of right ascension and declination" |
| [B] Delporte Belçikalı | CG | "Belgian astronomer Eugène Delporte" |
| [B] Köşe koordinatları 1875.0 | IAUc | reference note: boundary data "1875.0 coordinates of the vertices" |
| [B] Astronomy Engine Constellation işlevi J2000'i B1875'e çevirip tabloya bakar | AE (satır 7926–7954) | "Convert coordinates from J2000 to B1875." ; "the converted B1875 (ra,dec) for that point" |
| [HESAP] Sirius RA 6,752 sa (J2000) → 6,659 sa (B1875); Polaris Dec 89,26° → 88,64° | AE `Constellation()` | b1875.js çıktısı: "Sirius CMa J2000 6.752h -16.72 B1875 6.659h -16.59" ; "Polaris UMi J2000 2.530h 89.26 B1875 1.214h 88.64" |
| [H] 125 yılda bir dereceye yakın kayma; sınıra yakın cisimde takımyıldız değişebilir; sınırlar yıldızlara göre sabit | — | 2000 − 1875 = 125; presesyon ≈ 50″/yıl × 125 = 6.250″ ≈ 1,7° (tutulum boyunca; dik açıklıkta daha az) ; sınırlar B1875 ağında sabit tanımlı olduğu için yıldızlara göre sabittir (AE yöntemi) |
| [B] 36 kuzey, 52 güney | CG | "36 modern constellations lie principally in the northern celestial hemisphere," 52 southern |
| [B] En büyük Hydra 1.303, en küçük Crux 68 derece kare | IAUc | Hydra 1303 sq. deg. ; Crux 68 sq. deg. |
| [B] Serpens iki ayrı parça, IAU tek takımyıldız sayar | IAUc | "may be divided into Serpens Cauda and Serpens Caput" ; "these disjoint areas are considered part of the same constellation by the IAU" |
| [V] Uygulamada Serpens = "Yılan"; Ophiuchus = "Yılancı"; Hydra = "Suyılanı" | veri/takimyildiz.json | Ser "Yılan", Oph "Yılancı", Hya "Suyılanı" |
| [H] Örnek: 4π(180/π)² = 41.252,96; 1303/41253 = 0,0316; 68/41253 = 0,00165; 1303/68 = 19,2; 41253/88 = 468,8 | — | hesap |

## Bölüm 2 — Takımyıldız ile asterizm

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Büyük Kepçe = Büyük Ayı'nın en parlak yedi yıldızı, asterizm | AST | "an asterism in Ursa Major, made up of the seven brightest stars" |
| [B] Yaz Üçgeni: Vega (Lyra), Deneb (Cygnus), Altair (Aquila); üçü birinci kadir | AST | links Vega (Lyra), Deneb (Cygnus), and Altair (Aquila); "all first magnitude" |
| [B] Kış Üçgeni: Betelgeuse, Sirius, Procyon | AST | "Betelgeuse, Sirius, and Procyon" |
| [B] Kış Altıgeni 22 birinci kadir yıldızın 7'si; Sirius ve Procyon dahil | AST | "includes seven of the twenty-two first-magnitude stars visible in the sky" ; includes Sirius and Procyon |
| [B] Büyük Kare: Markab, Scheat, Algenib, Alpheratz; Alpheratz artık yalnız Andromeda | AST | four stars Markab, Scheat, Algenib, Alpheratz ; Alpheratz "now only considered a part of the constellation Andromeda" |
| [B] Avcı'nın Kuşağı: Alnitak, Alnilam, Mintaka | AST | "Alnitak, Alnilam, and Mintaka" |
| [B] Çaydanlık: Yay'ın parlak yıldızları | AST | "The brighter stars of Sagittarius form this asterism." |
| [B] Kuzey Haçı Kuğu'da; uzun kol Deneb–Albireo, kısa kol ε–δ Cyg | AST | upright from Deneb to Albireo; crossbar ε Cygni to δ Cygni |
| [V] Türkçe adlar: Çalgı, Kuğu, Kartal, Avcı, Büyük Köpek, Küçük Köpek, Kanatlıat, Andromeda, Yay, Büyük Ayı | veri/takimyildiz.json | Lyr, Cyg, Aql, Ori, CMa, CMi, Peg, And, Sgr, UMa |
| [Ö] Bortle 8: tanıdık takımyıldızlar sönük ya da görünmez | https://en.wikipedia.org/wiki/Bortle_scale | d1_kaynak.md: "8 City sky 4.1 – 4.5 ... familiar constellations weak or invisible" |
| [V] Kepçe yıldızları 1,8–2,4 kadir (Megrez dışında); Büyük Ayı çiziminin çoğu 3–4,5 | veri/yildizlar.json + veri/takimyildiz.json | leo.js çıktısı: UMa çizim kadirleri "1.76 1.81 1.85 2.23 2.34 2.41 3 3.06 3.12 3.17 3.32 3.35 3.45 3.49 3.57 3.65 3.69 3.78 3.79 4.55" (Megrez 3,3 civarı, "çoğunlukla" ifadesi bu yüzden) |
| [Ö] Yumruk ≈ 10° | https://earthsky.org/astronomy-essentials/sky-measurements-degrees-arc-minutes-arc-seconds/ | d11_kaynak.md: "the width of your fist held at arm's length equals about 10 degrees" |
| [HESAP] Vega–Deneb 23,85°; Vega–Altair 34,20°; Deneb–Altair 38,01° | veri/yildizlar.json koordinatları | aci.js çıktısı |

## Bölüm 3 — Yıldız adları

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Birkaç yüz geleneksel ad; çoğu Arapça, birkaçı Latince | SDN | "most of which derived from Arabic, but a few from Latin" (several hundred of the brightest stars had traditional names) |
| [B] es-Sûfî'nin adlarından 94'ü modern literatüre girdi; 10.–13. yy Latince çevirilerle Avrupa'ya | TDV | "doksan dördü modern astronomi literatürüne girmiştir" ; X. ve XIII. yüzyıllarda Latinceye çeviriler (WebFetch aktarımı) |
| [B] Fomalhaut "balığın ağzı"; Deneb "tavuğun kuyruğu"; Altair "uçan (kartal)"; Aldebaran "izleyen", Ülker'in arkasında; Algol "devin başı" | LPN | "mouth of the fish" ; "tail of the hen" ; "the flying" eagle ; "the follower," behind the Pleiades ; "head of the ogre" — bkz. Notlar 1 (tek kaynak) |
| [V] Fomalhaut Güneybalığı'nda (α PsA); Deneb Kuğu'da (α Cyg) | iau_wgsn_yildiz_adlari.json | Fomalhaut "α PsA" ; Deneb "α Cyg" |
| [B] Sirius < Yunanca Seirios "parlayan" ya da "kavurucu" | https://en.wikipedia.org/wiki/Sirius | Σείριος (Seirios), "glowing" or "scorcher" |
| [B] Betelgeuse < Yad al-Jawzā' "el-Cevzâ'nın eli"; 13. yy y→b okuma hatası | https://en.wikipedia.org/wiki/Betelgeuse | "the hand of al-Jawzā’" ; 13th-century misreading of initial "yā’" as "bā’" |
| [B] Eski Türkler: evren altın ya da demir kazık (kutup yıldızı) çevresinde dönen kubbe | TDV | "altın veya demirden bir kazık (kutup yıldızı) çevresinde" dönen kubbe |
| [Ö] Ülker = Pleiades'in Türkçe adı (uygulamada) | https://tr.wikipedia.org/wiki/Orion_Bulutsusu (d11 satırı) ; veri/hedefler.json | d11_kaynak.md: "Türkçe adlar: Ülker ..." ; hedefler.json M45 "ad": "Ülker" |
| [B] WGSN 2016'da kuruldu; görevi kataloglamak ve standartlaştırmak | SDN | IAU organized the WGSN in 2016 ; "to catalog and standardize proper names for stars" |
| [B] İlk onaylar 30 Haziran ve 20 Temmuz 2016 | LPN | first bulletin (July 2016): batches approved on 30 June and 20 July 2016 |
| [V] Uygulamanın listesi 28.10.2026, 652 ad | arastirma/iau_wgsn_yildiz_adlari.json | "indirme": "2026-10-28", "satir": 652 |
| [V] 210 ad 2016, 122 ad 2026 tarihli | aynı | "date" alanı sayımı: 2016: 210, 2026: 122 |
| [V] 15.10.2026: θ Cet = Tiancang, δ And = Kuda | aynı | {"name": "Tiancang", "bayer": "θ Cet", "date": "2026/10/15"} ; {"name": "Kuda", "bayer": "δ And", "date": "2026/10/15"} |
| [V] Balina = Cet, Andromeda = And | veri/takimyildiz.json | "Balina", "Andromeda" |
| [B] Yıldız adı satılamaz; ticari adlar tanınmaz | SDN | "Star naming rights are not available for sale via the IAU or any other scientific body." ; "Names by commercial entities are not recognized by the astronomical community." |

## Bölüm 4 — Bayer harfleri

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Johann Bayer, Uranometria, 1603 | BAY | first systematic names in his star atlas Uranometria, published in 1603 |
| [B] Yunan/Latin harf + Latince iyelik biçimi; α Tauri = Aldebaran "Alpha of the Bull"; α Tau kısaltması | BAY | pairs a Greek or Latin letter with the genitive form ; Aldebaran "α Tauri," meaning "Alpha of the Bull" ; α Tau |
| [B] Sirius = α Canis Majoris, α CMa | https://en.wikipedia.org/wiki/Sirius | "α Canis Majoris ... abbreviated α CMa" |
| [B] Kabaca parlaklık; kadir sınıfları, sınıf içinde sıra yok | BAY | "rough order of apparent brightness" ; grouped into magnitude classes and didn't rank within each class |
| [B] Betelgeuse α Ori, Rigel β Ori; Rigel genellikle daha parlak | BAY | Rigel is usually the brighter |
| [B] Betelgeuse 0,0–1,6 kadir arası değişir | https://en.wikipedia.org/wiki/Betelgeuse | "varying between +0.0 and +1.6" |
| [B] Castor α Gem, Pollux β Gem; Pollux daha parlak | BAY | "Pollux is the brighter of the two" |
| [B] 24 Yunan harfi bitince Latin harfleri | BAY | "Greek alphabet has only twenty-four letters" ; continued with Latin letters |
| [B] Flamsteed numaraları sağ açıklık artışına göre; Lalande, 1783 Fransızca baskı | SDN | "ordering them by increasing right ascension rather than by decreasing brightness" ; assigned "not by Flamsteed himself but by the French astronomer J. J. Lalande" in a 1783 French edition |
| [V] Alcor = 80 UMa | iau_wgsn_yildiz_adlari.json | Alcor "bayer": "80 UMa" |
| [V] Algol = β Per; Kahraman = Per | iau_wgsn_yildiz_adlari.json ; veri/takimyildiz.json | Algol "β Per" ; Per "Kahraman" |
| [Ö] Parlaklık oranı 10^(0,4 Δm) | https://en.wikipedia.org/wiki/Apparent_magnitude | d1 (kadir ölçeği; d1_kaynak.md'de 100^(1/5) = 2,5119 hesabı) |
| [V] Katalog kadirleri: Pollux 1,16; Castor 1,58; Rigel 0,18; Betelgeuse 0,45 | veri/yildizlar.json | aci.js kadir çıktısı |
| [H] 10^0,168 = 1,472; 10^0,108 = 1,282 | — | hesap |

## Bölüm 5 — Burç kuşağı ve tutulum

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Tutulum = Güneş'in yıllık görünür yolu; günde 1°'den biraz az doğuya | https://en.wikipedia.org/wiki/Ecliptic | d1_kaynak.md: "the Sun moves a little less than 1° eastward" |
| [Ö]/[B] Burç kuşağı ≈20° geniş; Ay ve gezegenler içinde | https://en.wikipedia.org/wiki/Ecliptic | "about 20° wide in latitude" ; d1: through which the Sun, Moon, and planets always appear to move |
| [Ö] Babil: 12 × 30° | https://en.wikipedia.org/wiki/Babylonian_astronomy | d20_kaynak.md: "dividing the 360 degree sky into 30 degrees" |
| [B] Burçlar: ilkbahar noktasından ölçülen 30°'lik 12 dilim; astronomik takımyıldızlarla örtüşmez | ROB | 12 zones each 30 degrees of the ecliptic, measured from the spring equinox ; "does not correspond to the astronomical zodiac" |
| [B] Tutulumu 13 takımyıldız keser (Yılancı dahil) | ROB ; ESO | ROB: "thirteen constellations currently cross the ecliptic," incl. Ophiuchus ; ESO: ecliptic "actually passes through 13 constellations" (IAU) |
| [B] Güneş Yılancı'da ≈ 30 Kasım–18 Aralık | ESO | "from about November 30 to December 18 each year" |
| [Ö] İlkbahar noktası tanımı | https://en.wikipedia.org/wiki/Ecliptic | d1_kaynak.md: March equinox, Sun crosses south to north |
| [HESAP] Güneş'in 2026 takımyıldız girişleri (UTC, saat çözünürlüğü): Cap 20 Oca 03, Aqr 16 Şub 13, Psc 12 Mar 15, Ari 19 Nis 03, Tau 14 May 15, Gem 21 Haz 21, Cnc 21 Tem 02, Leo 11 Ağu 01, Vir 17 Eyl 02, Lib 31 Eki 14, Sco 23 Kas 18, Oph 30 Kas 06, Sgr 18 Ara 14 | AE `Constellation()` + `Equator('Sun', …, ofdate=false)` | gunes.js (YIL=2026). TRT için +3 saat: İkizler 22 Haziran 00 TRT. 2027 hesabı aynı tarihleri ±1 gün verdi |
| [H] Süreler: Başak 17 Eyl 02 → 31 Eki 14 = 44,5 gün; Akrep 23 Kas 18 → 30 Kas 06 = 6,5 gün; Yılancı 30 Kas 06 → 18 Ara 14 = 18,3 gün; 18,3/6,5 = 2,8 | — | hesap |
| [B] İlkbahar noktası Koç'tan Balıklar'a geçti; antik çağda burçlar takımyıldızlarla kabaca örtüşüyordu | https://en.wikipedia.org/wiki/Ecliptic | signs roughly matched 12 constellations in ancient times ; First Point of Aries "has since moved into Pisces" |
| [B] Presesyon ≈ 50″/yıl | https://en.wikipedia.org/wiki/Ecliptic | "by about 50 arc seconds (about 0.014°) per year" |
| [B] Gerçek geçiş burç tarihlerinden yaklaşık bir ay sonra | ROB | actual Sun passage through constellations "about a month later" |
| [B] 2026 burç girişleri: Koç 20 Mart; Akrep 23 Ekim | ROB | Aries 20 March 15h46 ; Scorpio 23 October 11h38 (Belçika yerel saati) |
| [HESAP] 28 Ekim 2026 akşamı: Ay Boğa, Jüpiter Aslan, Mars Yengeç, Satürn Balina | gok.js `takimyildiz()` | b1875.js çıktısı (2026-10-28T19:00Z): "Moon Tau", "Jupiter Leo", "Mars Cnc", "Saturn Cet" |
| [Ö] Ay ve gezegenler kuşak içinde, tutulumun biraz kuzeyinde/güneyinde | https://en.wikipedia.org/wiki/Ecliptic | 20° genişlikteki kuşak (yukarıda) |
| [H] Örnek: 50 × 2000 = 100.000″; /3600 = 27,8°; günde ≈1° → ≈28 gün | — | hesap |

## Bölüm 6 — Astroloji neden bilim değil?

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Babil'de gökyüzü kehanet için izleniyordu | https://en.wikipedia.org/wiki/Babylonian_astronomy | d20_kaynak.md: Enuma Anu Enlil, omens tied to sky phenomena |
| [B] Carlson, Nature, 5 Aralık 1985, çift kör | SC | "published on December 5, 1985" ; double-blind test |
| [B] 28 astrolog, NCGR önerisi, Avrupa ve ABD | SC | "Twenty-eight astrologers, nominated by the National Council for Geocosmic Research" ; Europe and the United States |
| [B] Önceden adil sınav kabulü | SC | agreed the protocol was a "fair test" |
| [B] 100'ü aşkın doğum haritası, CPI profilleri, astrologların seçtiği araç | SC | "over 100 natal charts" ; California Psychological Inventory, "which they themselves identified" |
| [B] Şans düzeyi; emin olunca da daha iyi değil; "clearly refutes" | SC | "no better than chance" ; no more likely to be correct when highly confident ; "clearly refutes the astrological hypothesis" |
| [B] Astroloji çelişen kanıtla fikir değiştirmez, görmezden gelir; bazı beklentiler sınanamaz | UCB | "Astrology has not changed its ideas in response to contradictory evidence." ; "largely ignores evidence" ; "any outcome could be interpreted as fitting the expectations" |
| [B] McGervey: bilim insanlarının burçlarında eğilim yok | UCB | physicist John McGervey "found no bias towards particular signs" |
| [H] Örnek: 100 × 1/3 ≈ 33 | — | hesap (Carlson düzeneği değil, açıkça belirtildi) |

## Bölüm 7 — Neden her mevsimin kendi yıldızları var?

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Gündüz göğündeki yıldızlar gün ışığında kaybolur; gece yarısı Güneş'in karşı tarafı | — | d1_kaynak.md: "çıkarım; heliakal doğuşun tanımı ve geometri" ; Rayleigh saçılması d2_kaynak.md (gök mavi) |
| [HESAP] Aralık sonu Güneş Yay'da (18 Ara sonrası); haziran sonu İkizler'de; gece yarısı karşı takımyıldızlar | gunes.js ; yildiz.js | Betelgeuse 22.00 doruğu 4 Şub → 24.00 doruğu ≈ 5 Oca; Antares 22.00 doruğu 15 Tem → 24.00 ≈ 15 Haz |
| [Ö] Sabah doğuşu terimi | d20.json sözlük "sabah doğuşu" | d20 |
| [B] Sirius'un sabah doğuşu Nil taşkını; Kahire 19 Temmuz | https://en.wikipedia.org/wiki/Sirius | heliacal rising "marked the flooding of the Nile in Ancient Egypt" ; "At Cairo, this rising fell on 19 July" (dönem belirtilmedi; derste "düşüyordu" diye geçmiş zamanla) |
| [Ö] Yıldız günü 23 sa 56 dk 4 sn | https://en.wikipedia.org/wiki/Sidereal_time | d1_kaynak.md: "23 h 56 min 4.0905 s" |
| [Ö] 30 gün → ≈118 dk | — | d1_kaynak.md: "30 gün → 117,95 dk" |
| [Ö] h_en büyük = 90 − φ + δ; δ > 90 − φ batmaz | d11_kaynak.md [H] satırı; https://en.wikipedia.org/wiki/Circumpolar_star | d11: "90 − 41 − 24,4 = 24,6 ..." ; d1 kutup çevresi tanımı |
| [Ö] Ufuk kırılması ≈34′ | https://en.wikipedia.org/wiki/Atmospheric_refraction | d1_kaynak.md: "nominally 34′ on the horizon" |
| [HESAP] Çizim yıldızlarına göre: 61 tam, 11 kısmi (Karina, Erboğa, Irmak, Turna, Saat, Indus, Kurt, Cetvel, Anka, Dürbün, Yelken), 16 hiç (Cennetkuşu, Sunak, Bukalemun, Pergel, Güneyhaçı, Kılıçbalığı, Küçüksuyılanı, Masa, Sinek, Sekizlik, Tavus, Ressam, Ağcık, Güney Üçgeni, Tukan, Uçanbalık); δ > −39° ölçütüyle 53 | veri/takimyildiz.json | Python taraması (dec sınırı −49°; kırılma yok). Not: IAU sınırları değil, uygulamanın çizim yıldızları |
| [HESAP] Sirius doğuşu 15 Ara 2026 21.10; 15 Oca 2027 19.08 | gok.js / AE `SearchRiseSet` (DefineStar) | mevsim.js çıktısı |
| [H] 122/31 = 3,94 dk | — | hesap |
| [V] Kanopus dik açıklığı −52,70°; katalogda ikinci en parlak (−0,62) | veri/yildizlar.json | yildiz.js: "Canopus ... dec -52.70 mag -0.62 maxAlt -3.7" ; katalog kadire göre sıralı, Kanopus 2. sırada |

## Bölüm 8 — Yıl boyu batmayanlar

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Kutup Yıldızı kutba 1°'den yakın | https://en.wikipedia.org/wiki/Celestial_pole | d1: "within one degree of the bright star Polaris" |
| [Ö] Kutup yüksekliği = enlem | https://en.wikipedia.org/wiki/Celestial_pole | d1: "its altitude angle is always (nearly) equal to the observer's geographic latitude" |
| [B] Polaris en parlak değil, 2. kadir; Küçük Kepçe sapının ucu | ESP | "not the brightest star" ; "moderately bright 2nd-magnitude star" ; "marks the end of the handle of the Little Dipper" |
| [B] Göstergeç yıldızlar Dubhe ve Merak | ESP ; HPS | ESP: "The Pointers" ; HPS: "draw a line through Merak, then Dubhe, and you'll come to Polaris" |
| [B] Kutup Yıldızı'ndan öteye kıvırarak → beş yıldızlı zikzak (Kraliçe) | HPS | "continue the line and curve it slightly until you come to a zig-zag pattern of five stars" |
| [HESAP] Merak–Dubhe 5,37°; Dubhe–Polaris 28,71°; Schedar–Polaris 32,81°; 28,71/5,37 = 5,35 | veri/yildizlar.json | aci.js |
| [Ö] Üç parmak ≈5° | https://earthsky.org/astronomy-essentials/sky-measurements-degrees-arc-minutes-arc-seconds/ | d11: "your three middle fingers measure about 5 degrees" |
| [Ö] 40–50° K kutup çevresi takımyıldızları listesi ("sayılabilir") | https://en.wikipedia.org/wiki/Circumpolar_star | d1: "may include" Ursa Major, Ursa Minor, Draco, Cepheus, Cassiopeia, Camelopardalis, Lynx, Lacerta |
| [HESAP] En alçak yükseklikler: Dubhe 12,8°; Alkaid 0,3°; Schedar 7,5°; Caph 10,1° (δ − 49) | veri/yildizlar.json | yildiz.js "minAlt" |
| [HESAP] 22.00 Dubhe: 15 Oca 32° KD; 15 Nis 69° K; 15 Tem 39° KB; 15 Eki 13° K; Schedar 15 Eki 64° | gok.js `sabitAltAz` | mevsim.js |
| [HESAP] Kepçe ve Kraliçe kutbun karşı yanlarında | veri/yildizlar.json | Dubhe RA 11,06 sa, Schedar 0,68 sa; fark 10,4 sa ≈ 156° |
| [B] Mizar–Alcor ≈12′; Arap geleneğinde görüş sınavı | https://en.wikipedia.org/wiki/Mizar_and_Alcor | "about 12 arcminutes" ; "a test of penetrating vision" ; [HESAP] aci.js 0,20° |
| [Ö] Presesyon ≈26.000 yıl; 2100'de 0,45°; Thuban ≈MÖ 3000 (0,1°); Vega ≈14.500, 5° | https://en.wikipedia.org/wiki/Pole_star | d1_kaynak.md satır 55–57 |
| [V] Thuban = α Dra (Ejderha) | iau_wgsn_yildiz_adlari.json ; veri/takimyildiz.json | Thuban "α Dra" ; Dra "Ejderha" |

## Bölüm 9 — Kış gökyüzü

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [HESAP] Alnitak–Mintaka 2,74° | aci.js | — |
| [HESAP] Betelgeuse doğuşu 15 Kas 2026 20.52; 22.00 doruğu ≈4 Şub (56,4°); Rigel doruk 40,8° | mevsim.js ; yildiz.js | "Betelgeuse 2026-11-15 doğuş 2026-11-15 20:52" ; "22:00 transit 2027-02-04 alt@then 56.4" ; Rigel maxAlt 40.8 |
| [B] Kuşak çizgisi güneye → Sirius; kuzeye → bakır renkli Aldebaran → Ülker | HPS | "a line south through the three stars of Orion's belt, starting from Mintaka" ; "draw a line north until you come to a coppery-colored star" (Aldebaran), continue to the Pleiades |
| [HESAP] Alnilam–Sirius 22,99°; Alnilam–Aldebaran 23,13°; Aldebaran–Alcyone 13,65°; Betelgeuse–Sirius 27,10°; Sirius–Procyon 25,70°; Betelgeuse–Procyon 25,96° | aci.js | — |
| [V] Alcyone = η Tau, Ülker'in en parlak yıldızı | iau_wgsn_yildiz_adlari.json ; veri/yildizlar.json | Alcyone "η Tau"; katalogda 2,85 kadir, Ülker yıldızları arasında en parlak (katalog sırası) |
| [HESAP] Sirius en fazla 32,3°; 22.00 doruğu ≈17 Şub | yildiz.js | "Sirius ... maxAlt 32.3 ... 22:00 transit 2027-02-17" |
| [HESAP] Capella 15 Oca 22.00 81° | mevsim.js | "Capella 81°/KD" |
| [HESAP] Castor–Pollux 4,51°; doruk 1–4 Mart 22.00 | aci.js ; yildiz.js | — |
| [B] Büyük sönüklük: Ekim 2019 başlangıç; Şubat 2020 ortası 0,5 → 1,7, ≈ üç kat; toz; bir çalışma yıldız lekeleri; 2023'te toparlanma | https://en.wikipedia.org/wiki/Betelgeuse | "Starting in October 2019" ; "from magnitude 0.5 to 1.7" ; "about threefold" ; dust ; "one submillimetre study pointed to large starspots" ; peak 0.0 in April 2023 |
| [B] Orion–Akrep miti: Gaia (Hesiodos, Pseudo-Hyginus, Ovidius) ya da Artemis (Aratos); Zeus yıldızlara yerleştirir; "when Scorpion rises, Orion sets" | THS | sources listed ; "roused up against him another kind of beast" (Aratus) ; "when Scorpion rises, Orion sets" (Pseudo-Hyginus 2.26) |
| [Ö] M42: en iyi Ocak; kadir 4; karanlık yerden çıplak gözle | https://science.nasa.gov/?p=29958 | d11_kaynak.md: "It is best observed during January." ; "relatively bright apparent magnitude of 4." ; "with the unaided eye from a dark sky site" |
| [Ö] M45: en iyi Aralık; ≈445 ışık yılı; binden fazla yıldız | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-45 | d11_kaynak.md: "best time ... December" ; "roughly 445 light-years" ; "over a thousand stars" |
| [B] Ülker: çıplak gözle 6–7 kolay, koşullara göre 14'e kadar | https://en.wikipedia.org/wiki/Pleiades | brightest six or seven easily visible ; up to 14 depending on conditions and eyesight |
| [B] Ülker dürbünde göz alıcı | HPS | "an outstanding sight through binoculars" |
| [Ö] Dürbün görüş alanı nadiren >8° | https://en.wikipedia.org/wiki/Star_hopping | d11: "The field of view of binoculars is rarely more than eight degrees" |
| [H] Örnek: 90 − 41 − 16,7 = 32,3; 23,0/10 = 2,3; 32,3/10 = 3,2; 90 − 41 − 8,2 = 40,8 | — | hesap |

## Bölüm 10 — İlkbahar gökyüzü

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [HESAP] 15 Nis 22.00 Dubhe 69° K; Betelgeuse 21° B | mevsim.js | — |
| [B] Merak üzerinden Aslan'a | HPS | other Big Dipper hops: "Leo (via Merak)" |
| [HESAP] Regulus, Dubhe–Merak büyük çemberinden 11,4° uzakta; Merak–Regulus 45,60°; Regulus–Denebola 24,62° | leo.js ; aci.js | — |
| [HESAP] Regulus 22.00 doruğu ≈9 Nis, 61° | yildiz.js | "Regulus ... 22:00 transit 2027-04-09 alt@then 60.8" (maxAlt 61,0) |
| [B] "Follow the arc to Arcturus, drive a spike to Spica"; sapın kavisi; parlak turuncu Arcturus (Çoban); Spica (Başak) | ESA | "Follow the arc to Arcturus" ; along the curve of the handle "until you reach a bright orange star" ; Boötes ; Virgo ; "drive a spike" |
| [B] Arcturus ≈37 ışık yılı dev; diski ≈160 km/s dik keser; milyonlarca yıl sonra çıplak gözle görülmeyecek | ESA | "about 37 light-years" ; "roughly 160 km (100 miles) per second" ; "cutting perpendicularly through the galaxy's disk" ; future invisible to unaided eye |
| [B] Spica çoklu sistem, iki sıcak yıldız; ≈262 ışık yılı; Başak'ın en parlak yıldızı | ESA | "two hot stars orbiting closely together" ; "about 262 light-years" ; "the brightest star in Virgo" |
| [HESAP] Alkaid–Arcturus 30,66°; Arcturus–Spica 32,79° | aci.js | — |
| [HESAP] Arcturus doğuşu 15 Mar 20.35; 22.00 doruğu ≈11 Haz 68,2°; Spica ≈29 May 37,8° | mevsim.js ; yildiz.js | — |
| [Ö] M44: ilkbahar, en yüksek mart; dürbünle ≈20 yıldız; Yengeç | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-44 | d11_kaynak.md |
| [V] Katalog kadirleri Arcturus −0,05; Spica 0,98 | veri/yildizlar.json | aci.js |
| [H] 10^0,412 = 2,58; 90 − 41 + 19,2 = 68,2; 90 − 41 − 11,2 = 37,8 | — | hesap |

## Bölüm 11 — Yaz gökyüzü

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [HESAP] 15 Tem 22.00: Vega 65° D, Deneb 45° KD, Altair 35° D, Antares 23° G, Betelgeuse −37° | mevsim.js | — |
| [HESAP] Vega doruk ≈16 Ağu 87,8°; Deneb ≈17 Eyl (başucunun 4,3° kuzeyi, 85,7°); Altair ≈4 Eyl 57,9° | yildiz.js | — |
| [HESAP] Güneş yüksekliği 22.00: 21 Haz −12,5°; 21 Ara −48,3° | mevsim.js | — |
| [B] Kuzey Haçı Deneb–Albireo | AST | yukarıda |
| [Ö] Samanyolu için karanlık gök gerekir | https://en.wikipedia.org/wiki/Milky_Way | d7_kaynak.md: "darker than about 20.2 magnitude per square arcsecond for the Milky Way to be visible" |
| [HESAP] Herkül/M13 Yaz Üçgeni'nin batısında | veri/hedefler.json ; veri/yildizlar.json | M13 sağ açıklığı ≈16,7 sa < Vega 18,6 sa (batı = küçük sağ açıklık) |
| [Ö] M13 dürbünle en kolay temmuzda | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-13/ | d11: "can be spotted with a pair of binoculars most easily in July." |
| [HESAP] Antares en fazla 22,6°, doruk ≈15 Tem; Shaula 11,9°; Kaus Australis 14,6° | yildiz.js | — |
| [V] Kaus Australis = ε Sgr (Yay) | iau_wgsn_yildiz_adlari.json | "ε Sgr" |
| [Ö] Galaksi merkezi Yay yönünde, Samanyolu orada en parlak | https://en.wikipedia.org/wiki/Milky_Way | d7_kaynak.md: "The Galactic Center lies in the direction of Sagittarius, where the Milky Way is brightest." |
| [Ö] M8: Ağustos; 5.200 ışık yılı; dürbünle kolay; δ −24,39 → 24,6° | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-8 | d11_kaynak.md satır 119 ve 128, 130 |
| [V]/[HESAP] Antares RA 16,49 sa; Betelgeuse 5,92 sa; fark 10,57 sa | veri/yildizlar.json | yildiz.js |
| [HESAP] 15 Oca 22.00 Betelgeuse 52°, Antares −75° | mevsim.js | — |
| [H] Örnek: 90 − 41 − 26,4 = 22,6; 90 − 41 − 37,1 = 11,9; 90 − 41 + 38,8 = 87,8; 1° güney = 1° yükseklik (formülden) | — | hesap |

## Bölüm 12 — Sonbahar gökyüzü

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [HESAP] 22.00 doruk: Markab ve Scheat ≈23 Eki; Algenib ≈10 Kas; Alpheratz ≈8 Kas; Schedar ≈17 Kas 74,3°; Mirfak ≈28 Ara 81°; Diphda ≈17 Kas 31°; Fomalhaut ≈21 Eki, en fazla 19,4° | yildiz.js | — |
| [HESAP] Kare kenarları 12,88°; 14,21°; 16,52°; 13,95° | aci.js | — |
| [H] Alpheratz kuzeydoğu köşe | veri/yildizlar.json | Alpheratz: en büyük sağ açıklık ve dik açıklık çiftlerinden (0,14 sa, +29,1°) |
| [HESAP] Alpheratz–M31 14,04° | aci.js ; veri/hedefler.json M31 (10,6847°, +41,2687°) | — |
| [B] M31: 3,1 kadir; 2,5 milyon ışık yılı; en iyi kasım; orta ışık kirliliğinde çıplak gözle | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/ | "3.1" ; "2.5 million light-years" ; "is best observed in November" ; "can be seen with the naked eye, even in areas with moderate light pollution" |
| [Ö] Bortle 9: Ülker dışında Messier cismi yok | https://en.wikipedia.org/wiki/Bortle_scale | d1_kaynak.md |
| [B] Kassiopeia övünmesi (Andromeda ile Nereidler), Poseidon, deniz canavarı, Andromeda zincirde, Perseus Medusa'dan dönerken kurtarır ve evlenir; beşi yıldızlara yerleştirilir; Apollodoros, Pseudo-Hyginus, Ovidius | THK | WebFetch özeti: "Queen Cassiopeia boasted that her daughter Andromeda was more beautiful than the Nereids" ; "Perseus, Andromeda, Cepheus, Cassiopeia, and the monster were placed among the stars" |
| [V] Kahraman (Per), Kral (Cep), Kraliçe (Cas), Balina (Cet) | veri/takimyildiz.json | — |
| [B] Algol "devin başı" | LPN | "head of the ogre" |
| [Ö] Algol örten çift | d15 (müfredat: Algol) | d15_kaynak.md |
| [B] Fomalhaut "balığın ağzı" | LPN | "mouth of the fish" |
| [Ö] Hava kütlesi (başucunda en az atmosfer) | d1 sözlük "hava kütlesi" | d1 |
| [H] Örnek: 90 − 41 + 41,3 = 90,3 (başucunun 0,3° kuzeyi); 14/10 = 1,4 | — | hesap; d11_kaynak.md'de aynı 90,27° değeri |

## Bölüm 13 — Kendi yıllık gökyüzü haritanı kurmak

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Yıldızdan yıldıza atlama | https://en.wikipedia.org/wiki/Star_hopping | d11: "Star hopping uses bright stars as a guide to finding fainter objects." |
| [Ö] Bortle 8: 4,1–4,5; 9: ≤4,0 | https://en.wikipedia.org/wiki/Bortle_scale | d1_kaynak.md |
| [Ö] Karanlık uyumu, kırmızı ışık | d11 | d11_kaynak.md |
| [HESAP] 22.00 doruk takvimi: Capella 25 Oca, Rigel 25 Oca, Betelgeuse 4 Şub, Sirius 17 Şub, Castor 1 Mar, Procyon 2 Mar, Pollux 4 Mar, Regulus 9 Nis, Denebola 5 May, Spica 29 May, Arcturus 11 Haz, Alphecca 1 Tem, Antares 15 Tem, Rasalhague 1 Ağu, Vega 16 Ağu, Altair 4 Eyl, Deneb 17 Eyl, Fomalhaut 21 Eki, Markab 23 Eki, Alpheratz 8 Kas, Schedar 17 Kas, Hamal 8 Ara, Mirfak 28 Ara | yildiz.js (2027) | Not: Alphecca = α CrB (Kuzeytacı), Rasalhague = α Oph (Yılancı), Hamal = α Ari (Koç) — iau_wgsn_yildiz_adlari.json |
| [H] Ayda ≈2 saat → saatte ≈15 gün; 4 Oca 24.00 / 4 Mar 20.00 | — | hesap (Bölüm 7 formülü) |

## Formüller, anahtar sayılar, sözlük, sorular

- Formüller: hepsi yukarıdaki satırlara dayanır (doruk yüksekliği [Ö]/[H], batmama sınırı [Ö], 3 dk 56 sn [Ö], 10^(0,4 Δm) [Ö], presesyon 50″ [B], 41.253 [H]).
- Anahtar sayılar: 88, 1922/1928/1930, 1.303/68 (IAUc); 48 (CG); 13 ve 30 Kas–18 Ara (ESO); 1603 (BAY); 2016 (SDN); 28 astrolog/>100/1985 (SC); 50″ (Ecliptic); ≈41° (Celestial_pole, d1); −1,46/8,6 (Sirius); 12′ (Mizar_and_Alcor).
- Sözlük: tanımlar dersteki kaynaklı satırlara dayanır (takımyıldız/sınır: IAUc, AST; asterizm, Büyük Kepçe, Yaz/Kış Üçgeni, Avcı'nın Kuşağı: AST; göstergeç: ESP; Bayer: BAY; Flamsteed: SDN; WGSN: SDN; burç kuşağı: Ecliptic; burç, ilkbahar noktası: ROB, d1; astroloji: UCB, SC).
- Sorular ve sınav (d21_sinav.json) yalnız ders metnindeki bilgileri kullanır.

## Notlar (doğrulama ajanı için)

1. Yıldız adı anlamları (Fomalhaut, Deneb, Altair, Aldebaran, Algol) yalnız LPN'nin WebFetch özetinden geldi; ikinci kaynakla çapraz kontrol yapılmadı (arama bütçesi). Betelgeuse ve Sirius kökenleri ayrıca kendi Wikipedia sayfalarında doğrulandı. Aynı özette Vega için anlamsız bir aktarım vardı; Vega'nın ad kökeni bu yüzden derse konmadı.
2. Açılan kaynaklarda alıntılanamayan sıfatlar dersten çıkarıldı: "Alman" (Bayer), "fizikçi" (Carlson; McGervey'in fizikçi olduğu UCB'de geçiyor, o kaldı), "İskenderiyeli" (Ptolemaios), M42 için "Avcı'nın kılıcı", Yılan'ın parçalarının Yılancı'nın iki yanında oluşu ve Caput/Cauda'nın Türkçe karşılıkları.
3. Renk betimlemeleri (Betelgeuse kırmızı, Rigel mavi-beyaz, Antares kırmızı) ve figür içi konumlar (Akrep'in kalbi/iğnesi, Aslan'ın kuyruğu) kaynakla doğrulanmadığı için yazılmadı. Aldebaran "bakır renkli" (HPS) ve Arcturus "turuncu" (ESA) kaynaklı.
4. Skyandtelescope.org (Big Dipper sayfası) "client_error" verdi; skyatnightmagazine.com izin hatası verdi (yeniden denenmedi). İkisi de kullanılmadı.
5. Eski Türk yıldız adları (Demir Kazık, Yedigen vb.) için TDV maddesinde ad bulunamadı; yalnız TDV'nin "altın veya demirden kazık" ifadesi kullanıldı. Diğer Türkçe gelenek adları derse konmadı (bulamadım).
6. Mevsim tarihleri 2027 için hesaplandı; yıldızların doruk tarihleri her yıl ±1 gün tekrar eder (yıldız zamanı), derste "yaklaşık" diye verildi. Güneş'in takımyıldız giriş tarihleri 2026 ve 2027 için aynı günlere düştü (saat farkı ≤ 6 sa).
7. Görünürlük sayımı (61/11/16) IAU sınırlarına göre değil, uygulamanın takımyıldız çizimlerindeki yıldızlara göre yapıldı; derste bu açıkça söylendi.
