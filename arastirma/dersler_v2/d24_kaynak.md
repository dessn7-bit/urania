# d24 — Gökyüzünü fotoğraflamak: kaynak listesi

Tarih: 2026-10-28. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
[B] = bu oturumda WebFetch ile okundu (alıntılar WebFetch özet modelinin aktardığı metindir; doğrulama ajanı bir kez daha bakmalı); [Ö] = projede önceden doğrulanmış (d1, d11 kaynak dosyaları); [H] = bu derste yapılan hesap ya da akıl yürütme (kaynaklı değerlerden); [V] = hesap için seçilmiş varsayım (gerçek bir ürünün değeri değil).
Kısaltmalar: GOO = https://research.google/blog/astrophotography-with-night-sight-on-pixel-phones/ ; NASAS = https://science.nasa.gov/skywatching/learn/astrophotography-with-your-smartphone ; RMG = https://www.rmg.co.uk/how-photograph-star-trails ; SAN = https://www.skyatnightmagazine.com/astrophotography/astrophoto-tips/photograph-moon-smartphone-camera ; FN = https://en.wikipedia.org/wiki/F-number ; EQ = https://en.wikipedia.org/wiki/35_mm_equivalent_focal_length ; L11 = https://en.wikipedia.org/wiki/Looney_11_rule ; AFO = https://en.wikipedia.org/wiki/Afocal_photography ; SEE = https://en.wikipedia.org/wiki/Astronomical_seeing ; BOR = https://en.wikipedia.org/wiki/Bortle_scale ; LMOON = https://astropix.com/html/astrophotography/tripod4.html ; LSN = https://astropix.com/books/BGDA/CHAPTER8/801.HTM ; LLUCK = https://astropix.com/books/GDPI/CHAPTER2/205.HTM ; PL = https://photographylife.com/500-rule-vs-npf-rule ; NPN = https://www.nationalparksatnight.com/blog/2019/4/13/new-rule-for-shooting-the-sharpest-stars-in-the-sky ; PETA = https://petapixel.com/2020/10/28/eli5-this-is-how-image-stacking-reduces-noise-and-recovers-signal ; NIK = https://www.nikonians.org/reviews/how-many-ldquobitsrdquo-do-i-needmdash8-12-or-14 ; PT = https://www.photographytalk.com/light-pollution-and-how-to-work-around-it-in-astrophotography/ ; OPC = https://opcug.ca/Photography/CellPhonePhotography2026.pdf ; SAT = https://planet4589.org/jcm/pubs/space/papers/2020/SATCON1-Report.pdf ; CIT = https://www.pma.caltech.edu/news/palomar-survey-instrument-analyzes-impact-of-starlink-satellites ; IDA = https://darksky.org/news/comprehensive-report-on-satellite-constellations-finds-that-astrophotography-will-be-severely-affected/ ; EARTH = https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html ; MOON = https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html ; JUP = https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html ; SATF = https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html ; VEN = https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html ; APM = https://en.wikipedia.org/wiki/Apparent_magnitude

## Bölüm 0 — Kamera neyi kaydeder, Ataşehir göğü neye izin verir?

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Süreyi yarıya indirmek ışığı yarıya indirir (pozlama süreyle orantılı) | FN | "Opening one stop doubles the light, so the shutter time is halved for equal exposure" (WebFetch aktarımı); "halving the shutter time ... has the same effect" |
| [B] Sinyal tekrarlanır, gürültü rastgeledir; oranına sinyal-gürültü oranı denir (Jerry Lodriguss) | LSN | "Signal is anything that consistently repeats in an image." ; "noise does not repeat; it is random." ; "The relationship between signals and noise is called the signal-to-noise ratio." ; yazar Jerry Lodriguss |
| [Ö] Kentsel mahallede çıplak göz +3, banliyöde +4 | APM | d1_kaynak.md: "Faintest objects visible in an urban neighborhood with naked eye" (+3), "suburban" (+4) |
| [Ö] Bortle 9: Ülker dışında Messier yok; Ay, gezegenler, parlak uydular, en parlak birkaç küme | BOR | d11_kaynak.md: "Aside from the Pleiades, no Messier object is visible to the naked eye. The only objects to observe are the Moon, the planets, bright satellites, and a few of the brightest star clusters." |
| [Ö] Bortle 7: Samanyolu neredeyse ya da tamamen görünmez | BOR | d1_kaynak.md: "Entire sky light gray; Milky Way nearly or totally invisible" |
| Ataşehir'in Bortle sınıfı için kaynak bulunamadı (d1 ve d11'deki İstanbul notu ile aynı) | — | okura d1'deki sınır kadir yöntemi önerildi |
| [V] Örneklerdeki telefon değerleri (24 mm eşdeğeri, 4000 × 3000 piksel, f/1,8, ISO 50) varsayımdır | — | ürün değeri değil |

## Bölüm 1 — Pozlamanın üç ayarı

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] f-sayısı = odak uzaklığı ÷ giriş göz bebeği çapı | FN | "the ratio of the system's focal length to the diameter of the entrance pupil" |
| [B] Parlaklık f-sayısının karesiyle azalır; f/2, f/4'ün 4 katı ışık | FN | "decreases with the square of the f-number" ; f/2 ile f/4 örneği: dört kat ışık |
| [B] Her tam durak ışığı yarıya indirir; çap 1/√2; dizi 1, 1,4, 2, 2,8, 4, 5,6, 8, 11, 16 | FN | "represents a halving of the light intensity from the previous stop" ; "a factor of 1/√2 or about 0.7071" ; "f/1, f/1.4, f/2, f/2.8, f/4, f/5.6, f/8, f/11, f/16" |
| [B] Diyafram, enstantane, duyarlılık bağlı; alan × 2, süre ÷ 2, duyarlılık × 2 eşdeğer etki | FN | "Aperture, shutter speed, and film sensitivity are linked" ; doubling aperture area, halving shutter time, doubling sensitivity "has the same effect on the exposed image" (WebFetch aktarımı) |
| [B] f/4 → f/2: süre 4'e bölünmeli | FN | "the exposure time must be reduced by a factor of four" |
| [B] Düşük ISO daha az gürültü ama sönük yıldızlar seçilmeyebilir | RMG | "The lower the ISO number the less noise you will see, but you may not make out as many faint stars." |
| [B] Biraz düşük ISO gürültüyü ve aşırı pozlamayı azaltır | PT | "a slightly lower ISO can help reduce noise and overexposure" |
| [B] Telefonların çoğunda geniş diyafram; bazı telefonlarda diyafram ayarı optik değil benzetim | OPC | "Most cell phone cameras have a wide aperture so you can get the most light." ; simüle diyafram ayarı "not a true optical change" (WebFetch aktarımı); yazar Lynda Buske, ek bilgi Chris Taylor |
| [B] 1/250 sn f/8 = 1/125 sn f/11 | L11 | "1/250 second at f/8 gives equivalent exposure to 1/125 second at f/11" |
| [H] (11 ÷ 8)² ≈ 1,9 ≈ 1 durak; ISO 100 → 400 = 2 durak, süre ÷ 4 | — | hesap |

## Bölüm 2 — Telefonunun gözü: odak uzaklığı, 35 mm eşdeğeri, piksel ölçeği

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] 35 mm eşdeğeri: 35 mm filmde aynı görüş açısını veren odak; çoğunlukla köşegen açıya göre (CIPA DCG-001) | EQ | "the focal length a 35 mm film camera would need to produce the same angle of view" ; diagonal angle of view, CIPA guideline DCG-001 (WebFetch aktarımı) |
| [B] Kare 36 × 24 mm, köşegen 43,3 mm; CIPA 43,27 mm | EQ | "36 mm × 24 mm, with a diagonal of 43.3 mm (CIPA uses 43.27 mm)" |
| [B] Kırpma çarpanı = 43,27 ÷ sensör köşegeni; APS-C ≈ 1,5; kompakt 5–6; cep telefonlarında daha yüksek | EQ | CIPA formülü; "1.5× for Nikon DX and most APS-C" ; "5× to 6× for compact cameras" ; "even higher for built-in cameras of mobile devices like cell phones or tablets" |
| [B] Piksel birleştirme: 4 ya da 9 piksel tek okuma; 48 / 108 MP → 12 MP | OPC | Taylor: "the phone is doing "pixel binning" to combine grids of 4 or 9 pixels into a single output reading" ; 48MP ya da 108MP sensör 12MP görüntü |
| [B] Telefonlar birkaç sabit lensle yaklaşık 3× optik yakınlaştırma; ötesi sayısal | OPC | "typically combine several fixed focal length lenses for up to about 3x optical zoom" |
| [B] Sayısal yakınlaştırma optikten fazlasını vermez; en büyük optikte çek, sonra düzenleme programında kendin büyüt | SAN | "digital zoom doesn't really give you any more than the maximum optical zoom of your camera" ; "using the maximum optical zoom setting then downloading and resizing the image yourself with photo-editing software" (doğrulamada düzeltildi: kaynak 'kırp' değil 'resize' der) |
| [H] Yay saniyesi derecenin 3600'de biri; 1 radyan = 206.265 yay saniyesi | — | tanım/hesap (180 × 3600 ÷ π = 206.264,8) |
| [H] 4'e 3 karede eşdeğer en 43,27 × 0,8 ≈ 34,6 mm, boy ≈ 26,0 mm; piksel 0,00865 mm; 0,00865 ÷ 24 × 206.265 ≈ 74,4″ | — | hesap (python3) |
| [H] Görüş alanı 2 × arctan(17,3 ÷ 24) ≈ 71,6°, 2 × arctan(13,0 ÷ 24) ≈ 56,8° | — | hesap |
| [B] Ay'ın ortalama görünür çapı 1896″ | MOON | "Apparent diameter (mean, at opposition): 1896 seconds of arc" (WebFetch aktarımı) |
| [H] 1896 ÷ 74,4 ≈ 25,5 piksel | — | hesap |

## Bölüm 3 — Ay'ı telefonla çekmek

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] NASA: Ay büyük ve parlak, yeni başlayanlar için iyi hedef | NASAS | "The Moon is large and bright, making it a great target for beginners." |
| [B] ≈ 1000 mm altında ölçer karanlık göğü okur, Ay'ı fazla pozlar | LMOON | "Unless you use about 1,000 mm or more, the meter reads mostly the dark sky and overexposes the Moon" (WebFetch aktarımı) |
| [B] Pozlamayı Ay'a göre ayarlat, el ile kipe geç; disk yanıyorsa ISO ya da pozlamayı düşür | SAN | pro mode "should retain those settings" ; "Reduce the ISO or exposure so the Moon's disc isn't over-exposed." |
| [B] Looney 11: f/11, süre = 1/ISO; ISO 100 → 1/100 ya da 1/125; ISO 400 → 1/400 ya da 1/500. Kural Ay yüzeyi için geneldir, 'dolunay' demez (doğrulamada 'Kural dolunay içindir' cümlesi düzeltildi; dolunay eşleşmesi LMOON tablosundan) | L11 | "set aperture to f/11 and shutter speed to the [reciprocal of the] ISO film speed" ; "astronomical photos of the Moon's surface" ; örnek değerler |
| [B] Ay yüzeyine düşen Güneş ışığı Dünya'dakiyle esasen aynı; yüzey daha koyu; güneşli 16'dan bir durak fazla | L11 | "essentially the same as at the surface of the Earth" ; albedo daha düşük ; "increases exposure by one stop versus the Sunny 16 rule" |
| [B] Evre tablosu ISO 250, f/11: dolunay 1/250, şişkin 1/125, dördün 1/60, geniş hilal 1/30, ince hilal 1/15; yer ışığı 2 sn f/2,8 | LMOON | tablo (WebFetch aktarımı) |
| [B] Her 1/8 aydınlanma değişiminde bir durak | LMOON | "expose the Moon by an additional stop for every 1/8 illumination change in the Moon" — DİKKAT: aynı sayfanın tablosuyla tutarsız (dolunay 1/250 → dördün 1/60 = 2 durak, kural 4 durak verir); derste ikisi de 'başlangıç noktası' diye verildi, akılda/defter/soru 2 tablo adımına göre düzeltildi |
| [B] Alçaktaki dolunayda yaklaşık üç durak fazla | LMOON | "almost three stops more than what was recommended in the table" |
| [B] Pozlamayı kademele | LMOON | "most importantly bracket your exposures" |
| [B] Ay ile aydınlık manzara arasındaki fark 500.000:1'i aşabilir; ikisi aynı karede yakalanamıyor | GOO | "the extremely large brightness range, which can exceed 500,000:1, so far prevents us from capturing both in the same image" |
| [B] Şişkin Ay'ı gündüz, hilali alacakaranlıkta çek | SAN | gibbous phases in daylight, crescents in twilight (WebFetch aktarımı) |
| [H] (11 ÷ 1,8)² ≈ 37,3 ≈ 5,2 durak; 1/50 ÷ 37,3 ≈ 1/1870 ≈ 1/2000 sn | — | hesap ([V] f/1,8 ve ISO 50 varsayım) |
| [H] Dolunay → yer ışığı: 500 × 15,4 ≈ 7700 ≈ 12,9 durak | — | hesap |
| [H] "Otomatik kipin seçebileceği onda bir saniyeler" yalnızca karşılaştırma için örnek büyüklüktür | — | akıl yürütme, ölçüm değil |

## Bölüm 4 — Dürbünün arkasından: afokal fotoğraf

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Afokal fotoğraf tanımı; kuş gözlemcileri "digiscoping" dedi | AFO | "a method of photography where the camera with its lens attached is mounted over the eyepiece of another image forming system" ; birders coined "digiscoping" |
| [B] Yüksek odak oranı, daha karanlık görüntü, vinyetleme; kırpılabilir | AFO | "The drawback is the system will have a high focal ratio, with a correspondingly dim image, and some vignetting." ; zoom ile kırpma |
| [B] Kamera göz merceğine mümkün olduğunca yakın | AFO | "as close to the eyepiece as possible" (WebFetch aktarımı) |
| [Ö] 7×50 cisimleri 7 kat büyük gösterir | https://en.wikipedia.org/wiki/Binoculars | d11 bölüm 0 |
| [H] Eşdeğer odak 24 × 7 = 168 mm; ölçek 74,4 ÷ 7 ≈ 10,6″ | — | hesap (büyütme tanımından) |
| [B] Gözlük/lens takılıyken çek; telefonu göz merceğine yaklaştır, aydınlık daireyi gör; kablolu kulaklık ses düğmesi deklanşör olabilir | SAN | "Wear your glasses or contacts" ; "wired headphones with volume controls may work as a remote shutter release" |
| [B] Zamanlayıcı dokunma titreşimini azaltır | NASAS | "Most camera apps offer timer options to delay taking a photo by a few seconds." |
| [Ö] Ay'da aydınlık-karanlık sınırında kraterler (NASA) | https://science.nasa.gov/moon/viewing-tips/ | d11 bölüm "Ay, gezegenler ve uydular" |
| [Ö] Jüpiter uyduları mütevazı dürbünle gözle görülür | https://www.astronomy.com/observing/the-galilean-moons-of-jupiter-and-how-to-observe-them/ | d11_kaynak.md satır |
| Dürbün arkasından telefonun Galileo uydularını kaydedip kaydedemeyeceği: kaynak bulunamadı | — | derste "senin deneyin" diye belirtildi |
| [H] Ay 1896 ÷ 10,6 ≈ 178 piksel; 3× optik ile 1896 ÷ 24,8 ≈ 76 piksel | — | hesap |
| [B] Jüpiter görünür çapı en çok 50,1″ | JUP | "Maximum 50.1 seconds of arc" |
| [H] 50,1 ÷ 10,6 ≈ 4,7 piksel; 10,6 ÷ 15,04 ≈ 0,7 sn | — | hesap |

## Bölüm 5 — Parlak gezegenler ve şanslı görüntüleme

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Venüs 9,7–66,1″ | VEN | "maximum: 66.1 seconds of arc" ; "minimum: 9.7 seconds of arc" |
| [B] Jüpiter 30,5–50,1″ | JUP | "Minimum 30.5 seconds of arc; maximum 50.1 seconds of arc" |
| [B] Satürn 14,5–19,9″ | SATF | "Maximum: 19.9 seconds of arc" ; "Minimum: 14.5 seconds of arc" |
| [Ö] Gezegenlerin yıldızlar gibi sabit yeri yok | https://en.wikipedia.org/wiki/Binoculars | d11 bölüm "Ay, gezegenler ve uydular" son cümlesi |
| [B] Görüş tanımı; ortalama yer için 1″ iyi; en iyi yerlerde 0,4″; kentte çok daha kötü; saniyede 100'den sık değişim; parıldama | SEE | "seeing is the degradation of the image of an astronomical object due to turbulence in the atmosphere of Earth" ; "A 1.0″ seeing is a good one for average astronomical sites" ; "seeing as good as 0.4"" ; "The seeing of an urban environment is usually much worse" ; "typically more frequently than 100 times a second" ; "scintillation or twinkling" |
| [B] Şanslı görüntüleme: atmosfer etkisi zaman zaman ihmal edilebilir; çok sayıda görüntüden şanslı olanı seç | SEE | "every so often the effects of the atmosphere will be negligible" ; "recording large numbers of images in real-time, a 'lucky' excellent image can be picked out" |
| [B] Birkaç dakikada yüzlerce/binlerce kare; 60 kare/sn × 1 dk = 3600; en iyileri seçilir, çok noktalı hizalama, ortalama; gezegen dönüşü süreyi sınırlar; kötü görüşte işe yaramaz | LLUCK | "hundreds, or thousands of frames, during a short time span of a couple of minutes" ; "records at 60 frames per second" ; one minute at 60 fps = 3,600 frames ; "picks out only the best ones to be stacked" ; "stacks the best parts of the best frames to improve the signal-to-noise ratio" ; "If the seeing is really bad, even lucky imaging won't reveal really high-resolution detail." |
| [Ö] Uyarlamalı optik d12'de | — | d12 bölüm başlığı |
| [H] Piksel hesapları: 0,67; 0,89; 4,7; 2,9; 1,9; 6,2; 0,9 piksel | — | hesap |
| Venüs'ün 6 piksellik hilal biçiminin seçilip seçilemeyeceği: kaynak bulunamadı | — | derste belirtildi |
| [B] Venüs en büyük çapına alt kavuşumda, yeni evrede ulaşır; çok ince hilali 60–66″ | https://en.wikipedia.org/wiki/Phases_of_Venus | "up to a maximum of 68 arc seconds at new ( inferior conjunction)" ; "The apparent disk of Venus' extreme crescent measures between 60.2 and 66 seconds of arc" (doğrulamada eklendi; NASA VEN en büyük 66,1″, Wikipedia 68″ — derste NASA değeri kullanıldı) |

## Bölüm 6 — Sabit üçayakta gökyüzü neden kayar?

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Taş, tahta blok da dayanak olabilir | NASAS | "an improvised stand, like a rock or block of wood, works in a pinch" |
| [B] Yıldız günü 23,9345 saat | EARTH | "Sidereal rotation period: 23.9345 hours" |
| [H] 360° ÷ 23,9345 sa ≈ 15,04° saatte = saniyede 15,04″ | — | hesap |
| [H] Kayma hızı cos δ ile orantılı (çember yarıçapı) | — | küresel geometri |
| [B] Gök ekvatoruna yakın yıldızlar daha hızlı; baktığın yön önemli | PL | stars closer to the celestial equator move faster ; 500 kuralı "ignores the direction you face" (WebFetch aktarımı) |
| [Ö] Kutup Yıldızı yüksekliği = enlem; İstanbul ≈ 41° | — | d1 bölüm "Günlük dönüş, Kutup Yıldızı ve enlem" |
| [B] 100 mm'de Ay 2–5 sn, 500 mm'de 1/2–1 sn | LMOON | "you can shoot for about 2 to 5 seconds before the Moon's movement becomes objectionable" ; 500 mm "about 1/2 to 1 second" |
| [H] cos 41° ≈ 0,755 → 11,35″/sn; cos 80° ≈ 0,174 → 2,6″/sn; 74 ÷ 15,04 ≈ 4,9 sn; 74 ÷ 2,6 ≈ 28 sn | — | hesap |

## Bölüm 7 — 500 kuralı ve sınırları

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] 500 kuralı = 500 ÷ eşdeğer odak; 20 mm → 25 sn, 50 mm → 10 sn | PL | "It recommends that your shutter speed is equal to 500 ÷ Equivalent Focal Length." ; 20mm 25 s, 50mm 10 s |
| [B] Yönü, piksel boyutunu, kırınımı hesaba katmaz; fazla hoşgörülü | PL | "In almost every case, regardless of your composition, you'll get more blur than ideal when using the 500 rule." |
| [B] Önce 600 kuralı; 8,5 × 11 inçten büyük baskılarda yıldızlar çizgi → 500; piksel sayısı artınca yetmedi (40+ MP'de iz daha belirgin); yazar 30 MP altı tam karede 400, APS-C 250, MFT 200 kullanıyor | NPN | 600 rule ; prints larger than 8.5x11 inches "tiny lines" ; 500 rule worked under 20 MP ; 40+ MP reveals trailing ; 400 rule full-frame under 30 MP, 250 APS-C, 200 MFT (Gabriel Biderman, 13 Nisan 2019). Doğrulamada düzeltildi: kaynak 400'e geçişi doğrudan 40 MP'ye bağlamıyor |
| [H] 8,5 × 11 inç ≈ 21,6 × 27,9 cm ("yaklaşık 21 × 28 cm") | — | hesap (1 inç = 2,54 cm) |
| [B] PhotographyLife yazarı gök ekvatoru kadrajdayken 300 kuralı | PL | "300 rule" when stars along the celestial equator are in the frame |
| [B] NPF: Frédéric Michaud, Fransız fotoğrafçı ve amatör gökbilimci, Le Havre astronomi derneği; N diyafram, P piksel aralığı, F odak; dik açıklık da hesaba katılır | NPN, PL | NPN: "a French photographer and amateur astronomer, devised it for the Astronomical Society of Le Havre" ; N aperture, P pixel pitch, F focal length ; PL: δ minimum declination |
| NPF formülünün sabitleri iki kaynakta da açıkça yok; derste yazılmadı | — | — |
| [B] Google gece modu kare süresi ≤ 16 sn, gerçek gece gökyüzü çekimleriyle bulundu; çizgi yıldızlar yanlış görünür | GOO | "Taking pictures of real night skies we found that the per-frame exposure time should not exceed 16 seconds." ; "motion-blurred stars that look like short line segments look wrong" (Florian Kainz, Kiran Murthy, 26 Kasım 2019). Yazı görüş alanı ya da piksel hesabı vermez; derste 'sağlama' yerine 'kabaca tutarlılık, kanıt değil' dendi |
| [H] En uzun poz ≈ k × piksel ölçeği ÷ (15,04 × cos δ) | — | bu derste türetildi (kayma ÷ kayma hızı); varsayımlar derste yazıldı: karenin ortası, nokta yıldız, mercek/kırınım/atmosfer/işleme yok, k seçilir |
| [H] 500 ÷ 24 ≈ 20,8 sn; 20,8 × 15,04 ≈ 313″ ≈ 4,2 piksel; k = 1: 4,9 / 6,6 / 28 sn; k = 3: ≈ 15 sn; dürbün 0,7 sn | — | hesap |

## Bölüm 8 — Yıldız izi

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] En kolay: en az 30 dk tek poz, ama gürültü | RMG | "The easiest way to capture star trails is to take one long exposure, of at least 30 minutes." ; "creates unwanted grain or noise" |
| [B] 30 sn'lik 100+ kare, yazılımla birleştir | RMG | "take 100 or more shots at 30 seconds each" ; "taking multiple digital shots at short exposures and stacking them together" |
| [B] ISO 200–600, f/2–f/9 | RMG | "between 200 and 600" ; "between F2 and F9" |
| [B] Gök kutbuna doğrult; yarımküreye göre kuzey ya da güney (İstanbul: kuzey) | RMG | "Point your camera north or south (depending on which hemisphere you are in) to locate the celestial pole" |
| [B] Gün batımından iki saat sonra; Ay doğuşu ve havaya bak | RMG | "Avoid light pollution and early evening ambient light by heading out into the wild a good two hours after sunset." ; "Remember to check moonrise times and the weather." — ışık kirliliğinden kaçış saatle değil kentten uzaklaşmayla; derste doğrulamada düzeltildi |
| [B] El ile sonsuza netle, deneme karesini büyüt | RMG | manual focus to infinity ; zoom in to check |
| [B] Ön plan ışığı başta ya da sonda; ortadan kare silmek boşluk bırakır | RMG | "at the start or end of your shoot" |
| [B] Uzaktan deklanşör, sağlam üçayak | RMG | "a sturdy tripod" ; remote or cable release |
| [Ö] Polaris dik açıklığı ≈ 89,35° (2022) → kutba ≈ 0,65° | https://en.wikipedia.org/wiki/Pole_star | d1_kaynak.md doğrulama notu: "Polaris 2022 dik açıklığı 89,35°" |
| [H] Dikey görüş alanı 56,8° > 41° → kutup kadraja sığar | — | hesap |
| [H] Karanlık gökte daha çok sönük yıldız → daha çok iz | — | d1 (sınır kadir) üzerinden akıl yürütme |
| [B] Kamera uygulaması seçenek sunmuyorsa uygulama indirilebilir (ad yok) | NASAS | "If your phone's camera app doesn't offer these options, you can download apps that do." |
| [H] 50 dk → 12,5°; kutba 10°: 2,19° ≈ 106 piksel; Polaris ≈ 7 piksel; ekvator ≈ 607 piksel | — | hesap |

## Bölüm 9 — Gürültü

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Foton gürültüsü = √sinyal; 100 foton → 10 | LSN | "This amount of noise is equal to the square root of the signal." ; "So if you record 100 photons, you will have 10 photons of noise" |
| [B] Işık arttıkça foton gürültüsünün görünürlüğü azalır | GOO | "The visibility of shot noise decreases as the amount of light increases." |
| [B] Elektron sayımı ve analog-sayısal dönüşümde gürültü | LSN | "Noise is also introduced in the electron counting process in the camera and in converting the analog signal to a digital number." |
| [B] Karanlık akım: ışıksız sahte sinyal; kısa pozda ihmal, birkaç saniyede önemli | GOO | "Dark current causes CMOS image sensors to record a spurious signal" ; "becomes significant with multi-second captures" |
| [B] Yüksek sıcaklıkta tek kare süresi ısıl sinyalle sınırlı; ısıl sinyal her karede aynı yerde; karanlık karelerle çıkarılır | LSN | "at high ambient temperatures, the length of a single frame will ultimately be limited by the thermal signal" ; "it repeats in the same place every frame" ; dark frames "subtract this thermal signal" |
| [H] İstanbul yaz gecelerinde ısıl sinyalin daha büyük sorun olabileceği | — | LSN'den çıkarım; telefon için ölçüm bulunamadı (derste belirtildi) |
| [B] Uzun pozda gürültü sorun; tek sıcak piksel yıldızı gizleyebilir | AFO | "Noise is a problem for long exposures, and a single hot pixel can obscure a star" (WebFetch aktarımı) |
| [B] Sıcak/ılık pikseller komşu ve kare karşılaştırmasıyla bulunur, komşu ortalamasıyla değiştirilir | GOO | "it is concealed by replacing its value with the average of its neighbors" |
| [H] 100 → 400 → 1600 foton: oran 10 → 20 → 40 | — | hesap |

## Bölüm 10 — Görüntü yığınlama

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Çok sayıda kısa poz yığınlanarak uzun pozun oranına ulaşılır | LSN | "shoot a lot of shorter exposures and stack them to equal the signal-to-noise ratio of a longer exposure" |
| [B] Ortalama; oran √N; 9 → 3 kat, 100 → 10 kat (PETA gürültünün rastgele olduğunu açıkça yazmaz; o kavram LSN'den) | PETA | "The signal-to-noise ratio, or S/N, increases by the square root of the number of images in the stack." ; "9 images ... improves by a factor of 3" ; "100 images, the S/N improves by a factor of 10" |
| [B] Kareler titreme ve hareketi telafi için hizalanıp ortalanır; tek kareler kumlu, birleşik temiz | GOO | "individual frames may be fairly grainy, the combined, averaged image looks much cleaner" |
| [B] RMG: tek uzun poz kumlu, çok kısa poz daha iyi | RMG | bölüm 8 satırları |
| [H] Gök fotonları da √ gürültü getirir; örnek 400/400 ve 400/3600 foton (uydurma sayılar): 14,1 ve 6,3; 16 kare → 25; (14,1 ÷ 6,3)² ≈ 5 | — | hesap; sayılar derste "uydurulmuş varsayım" diye belirtildi |

## Bölüm 11 — Gece modu

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] Gece modu birden çok görüntüyü birleştirip keskinliği korur, gürültüyü sınırlar | OPC | "in night mode, it takes multiple images, combining them together to keep sharpness and limit noise" |
| [B] Google yazısı 2019 (blog adresi 2019/11) | https://blog.research.google/2019/11/astrophotography-with-night-sight-on.html | arama sonucundaki URL'de 2019/11 |
| [B] En çok 15 kare, kare başına en çok 16 sn; Pixel 4'te 4 dk, Pixel 3/3a'da 1 dk | GOO | "we limited a single Night Sight image to at most 15 frames with up to 16 seconds per frame" ; up to 4 minutes on Pixel 4, 1 minute on Pixel 3 and 3a |
| [B] Üçayak, taş vb. gerekir | GOO | "a tripod, a rock, or whatever else might be available" |
| [B] Vizör ≥ 15 kare/sn → ≈ 66 ms; dolunay altı ışıkta vizör gri; 16 sn'lik kareler ≈ 250 kat ışık | GOO | at least 15 times per second, ~66 ms ; "mostly gray" ; "have collected almost 250 times more light than the regular viewfinder frames" |
| [B] Deklanşör sonrası netleme: ≤ 1 sn iki kare; olmazsa sonsuz | GOO | "with exposure times up to one second" ; focuses at infinity |
| [B] Gökyüzü: 100.000+ elle işaretli görüntüyle eğitilmiş sinir ağı; gökyüzünü karartır, özel gürültü azaltma ve karşıtlık | GOO | "trained on over 100,000 images that were manually labeled by tracing the outlines of sky regions" ; sky-specific noise reduction and selective contrast |
| [H] 15 × 16 = 240 sn; 16 ÷ 0,066 ≈ 242; 16 × 15,04 ≈ 241″ ≈ 3,2 piksel; √15 ≈ 3,9 | — | hesap |
| Başka Android üreticilerinin gece modu ayrıntıları için kaynak bakılmadı | — | derste "farklı ayrıntılarla çalışabilir" denildi |

## Bölüm 12 — RAW

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] 8 bit JPEG 256, 12 bit RAW 4096, 14 bit RAW 16.384 ton/kanal | NIK | "it can only capture 256 unique colors per RGB channel" ; "4,096 colors per RGB channel" ; "16,384 colors per RGB channel" |
| [B] 14 bit RAW'dan bilgisayarda çevirmek doğrudan 8 bit JPEG'den iyi; daha az şeritlenme | NIK | "A 14-bit RAW to 8-bit JPEG conversion, in computer, seems nicer to me than a straight 8-bit JPEG out of the camera." ; "you will have more color levels to choose from" ; banding |
| [B] JPEG tekrar kaydedildikçe sıkıştırma kayıplarıyla bozulur | NIK | "It just cannot be modified over and over and resaved without degrading from compression losses." |
| [B] İşleme astrofotoğrafçılığın sırrı; uygulama ya da program (ad yok) | NASAS | "Post-processing is the secret of all astrophotography." |
| [B] Işık kirliliği turuncu/sarı renk katar; beyaz dengesiyle düzeltilir | PT | "Light pollution often introduces an orange or yellow cast to your photos." ; "Adjust the white balance" (PT = Photography Talk, yazar Sean Simpson; derste üç yerde yanlışlıkla 'PhotographyLife' yazıyordu, doğrulamada 'PhotographyTalk' yapıldı) |
| [H] 8 bit / 12 bit basamak örneği (gök 20 → 320; yıldız %3 parlak) | — | hesap; varsayım sayılar |
| Telefon gece modunun RAW kaydedip kaydetmediği: genel kaynak bulunamadı | — | derste belirtildi |

## Bölüm 13 — Işık kirliliğiyle baş etmek

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Parlak banliyö: ufkun 35° yukarısına kadar gri-beyaz | BOR | d1_kaynak.md: "sky within 35° of the horizon glows grayish white" |
| [B] Açık, Ay'sız geceler ideal | PT | "Clear, moonless nights are ideal for astrophotography." |
| [B] Gün batımından ≈ 2 sa sonra, Ay doğuşu | RMG | bölüm 8 satırı |
| [B] Birkaç kısa poz çekip birleştirmek gürültüyü azaltır; biraz düşük ISO | PT | "taking several short exposures and combining them in post-processing to reduce noise" |
| [B] Uzaktaki sokak lambaları pozlamayı zorlaştıran parlak kaynaklar | GOO | distant street lamps as bright light sources that complicate exposure (WebFetch aktarımı) |
| [B] Turuncu renk beyaz dengesiyle; ışık kirliliği eğimi düzenleme programlarında giderilir | PT | "remove the gradient caused by light pollution" |
| [B] Süzgeçler yapay kaynakların belirli dalga boylarını keser | PT | "block specific wavelengths of light emitted by artificial sources" |
| [H] Kentte uzun pozda gök tonu açılır, sönük yıldızlar boğulur | — | pozlama orantısından akıl yürütme |
| Ataşehir'de saate göre gök parlaklığı değişimi: kaynak bulunamadı | — | derste belirtildi |

## Bölüm 14 — Uydu izleri

| İddia | Kaynak URL | Kaynaktaki ifade |
|---|---|---|
| [B] SATCON1, 9 Ağustos 2020; NOIRLab ve AAS ortak; 29 Haziran–2 Temmuz 2020 | SAT | "organized jointly by NSF's NOIRLab and AAS with funding from NSF" ; rapor tarihi 9 August 2020 |
| [B] Uydular güneşle aydınlıkken gözlemci karanlıkta; izsiz bölgeyi Dünya'nın gölgesi yaratır; görünürlük astronomik alacakaranlığa (−18°) kadar kabaca sabit | SAT | "the trail-free region is caused by the Earth's shadow" ; "the visibility of sunlit satellites remains roughly constant between sunset and astronomical twilight" |
| [B] 600 km üstü yazın bütün gece görünebilir | SAT | "higher altitude constellations can be visible all night long during summer" ; "Satellites above 600 km are an even greater concern ... can also be illuminated all night long" ; "LEOsat constellations below 600 km are visible for a few hours per night around astronomical twilight" |
| [B] 100.000 ya da daha fazla önerilen alçak yörünge uydusu | SAT | "the 100,000 or more LEOsats proposed by many companies and many governments" |
| [B] Starlink alacakaranlıkta çıplak gözle görülen hareketli cisimleri kabaca iki katına çıkarabilir | SAT | "Starlink alone may roughly double the number of space-based moving objects detectable by the unaided eye around twilight" (çapraz: IDA "will approximately double") |
| [B] Astrofotoğrafçılık şimdiden etkilendi | SAT | "Astrophotography, amateur astronomy, and the human experience of the stars and the Milky Way are already affected." (çapraz: IDA "wide-field astrophotography will be severely impacted") |
| [B] 7 kadir önerisi (550 km) | SAT | "7.0 Vmag +2.5 × log(rorbit / 550 km)" |
| [Ö] ISS −5,9 kadir, Venüs'ün en parlağından parlak | APM | d1_kaynak.md: "−5.90 International Space Station ... when the ISS is at its perigee and fully lit by the Sun" |
| [B] Caltech, 17 Ocak 2022; Przemek Mróz; ZTF Kasım 2019–Eylül 2021; 5.301 iz | CIT | lead author Przemek Mróz ; "5,301 satellite streaks" |
| [B] Alacakaranlık görüntülerinin 2019'da %0,5'i, şimdi neredeyse %20'si | CIT | "In 2019, 0.5 percent of twilight images were affected, and now almost 20 percent are affected" |
| [B] ≈ 1.800 Starlink, ≈ 550 km | CIT | "Nearly 1,800, orbiting at about 550 km altitude" (WebFetch aktarımı) |
| [B] Güneşlikler parlaklığı ≈ 5 kat azaltır, ≈ 6,8 kadir; SATCON1'in 7 kadir hedefine ulaşmıyor | CIT | visors reduce brightness by about a factor of five, to roughly magnitude 6.8 ; "at seventh magnitude or fainter" |
| [B] Yerleri önceden hesaplayıp kaçınmak; izi maskelemek | CIT | software to predict positions and avoid ; "mask the streak" |
| Güncel (2026) Starlink sayısı: bu derste bakılmadı | — | derste belirtildi |
| [H] 20 karelik ortalamada iz 1/20; 2,5 × log 20 ≈ 3,25 kadir; 100 karede 5 kadir | — | hesap |

## Açık konular ve notlar
1. NPF kuralının formülü (sabitleriyle) okunan iki kaynakta yok; derste formül verilmedi, yerine piksel ölçeğinden türetilen kural hesap olarak verildi.
2. Telefonların tipik 35 mm eşdeğeri, gerçek odak uzaklığı ve piksel boyutu için birincil kaynak bulunamadı; bütün telefon değerleri [V] varsayım olarak işaretlendi.
3. Android'de RAW dosya biçimi (DNG) ve el ile kipte en uzun poz süresi gibi telefon özellikleri için kaynak aranmadı; derste genel "varsa" dili kullanıldı.
4. Işık kirliliği süzgeçlerinin LED aydınlatmaya karşı etkinliği için güvenilir kaynak bulunamadı; derste ayrıntıya girilmedi.
5. Venüs'ün en büyük göründüğünde ince hilal olması geometriden; doğrulama ajanı d9 ya da VEN ile çapraz kontrol edebilir.

## Doğrulama turu (2026-10-28, bağımsız denetçi)
Yeniden okunan (WebFetch/curl): GOO, LMOON, PT, SAN, NASAS, RMG, CIT, SAT (iki kez), NPN, PL, Phases of Venus, BOR, SEE, AFO, L11, EQ, FN, LSN, LLUCK, PETA, NIK, OPC, NASA fact sheet'ler (Moon, Jupiter, Saturn, Venus, Earth; curl ile), NASA Moon viewing tips, APM, Pole star. Bütün örnekler python3 ile yeniden hesaplandı; hepsi tuttu (tek küçük düzeltme: "1896 ÷ 74 ≈ 25,5" → "1896 ÷ 74,4 ≈ 25,5").
- MOON: 1896″ "Mean values at opposition from Earth" başlığı altında (dolunaydaki ortalama).
- NASA Moon viewing tips: "Focus particularly along the terminator line between light and dark, where features will cast long shadows" ([Ö] satırı teyit).
- Pole star: "In 2022 Polaris' mean declination was 89.35 degrees North" ([Ö] satırı teyit).
