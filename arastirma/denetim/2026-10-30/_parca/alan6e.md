# Alan 6E — Türkçe yazım: Haberler ve Deney metinleri (Urania v39 denetimi, 2026-10-30)

## Okunan dosyalar
| dosya | satır | tamamı |
|---|---|---|
| arastirma/dersler_v2/YAZIM_KILAVUZU.md | 196 | evet |
| arastirma/haberler/YONTEM.md | 65 | evet |
| veri/haberler.json | 1461 | evet (Read ile 1–1461) |
| veri/deney_rehber.json | 1700 | evet; kullanıcıya görünen tüm dize değerleri (ne, ad, gozle, neden, yap, gercek, kaynak adları) betikle satır numarasıyla çıkarıldı ve hepsi okundu. url/sec/renk/tikla gibi teknik alanlar atlandı |
| veri/deney/analemma.json | 97 | evet (aynı yöntemle) |
| veri/deney/astrofoto.json | 375 | evet (aynı yöntemle) |
| veri/deney/durbun.json | 1 (62 KB, tek satır) | evet; bütün metin alanları JSON yoluyla çıkarıldı (dosyanın çoğu sayısal yıldız verisi) |
| veri/deney/eratosthenes.json | 219 | evet (aynı yöntemle) |
| veri/deney/hohmann.json | 113 | evet (aynı yöntemle) |
| veri/deney/mevsim.json | 100 | evet (aynı yöntemle) |
| veri/deney/ortme.json | 341 | evet (aynı yöntemle) |
| veri/deney/paralaks.json | 245 | evet (aynı yöntemle) |
| veri/deney/roket.json | 129 | evet (aynı yöntemle) |
| veri/deney/yasanabilir.json | 410 | evet (aynı yöntemle) |
| veri/fizik.json | 412 | evet (metin alanları: kaynak adları, notlar, sonlar tablosu; geri kalanı sayı) |
| veri/gorevler.json | 948 | evet (40 görevin bütün metin alanları) |
| simulasyon.js | 761 | KISMEN: yalnız Türkçe/boşluk içeren dize ya da şablon dizesi barındıran 157 satır okundu (yorum satırları ve dizesiz kod satırları okunmadı; tek kelimelik ASCII dizeler kaçmış olabilir) |
| deneyler2.js | 594 | KISMEN: aynı yöntemle 136 satır okundu |

Not: veri/deney/ altında yalnız 10 dosya var (görevde "10 dosya" denmişti; liste yukarıda).

## Yöntem
- Metin çıkarıcı: `a6e/cikar.py` (JSON → `L<satır> <yol>: <metin>`), çıktılar `a6e/t_*.txt`; JS için `grep` ile dize satırları (`a6e/js_*.txt`).
- Haber sayımı: `python` ile `ozet` paragrafları boşlukla bölünüp sayıldı; kaynak sayısı, görsel kredi/lisans/kaynak URL'si listelendi.
- Terim tutarlılığı: `grep -o` ile haberler / deneyler / görevler / JS ile `veri/dersler.json` karşılaştırıldı; takımyıldız adları `veri/takimyildiz.json` ile.
- TDK kontrolü: `https://sozluk.gov.tr/gts?ara=<kelime>` (curl, sırayla) ve tdk.gov.tr yazım kuralları sayfaları (nokta, kesme işareti).
- Sesli okuma etkisi: `require('C:/Users/Kaan/urania/okunus.js').okunus(...)` ile birkaç örnek.
- ESA görsel kredileri iki görsel sayfasından doğrulandı (MMX, JUICE).

### Haber kuralları tablosu (YONTEM.md)
| id | kelime | paragraf | kaynak | görsel / etiket / kurum |
|---|---|---|---|---|
| 2026-10-27-beyaz-cuce-cift-halka | 495 | 7 | 3 | ESO, "Sanatçı çizimi" ✓ |
| 2026-10-27-rubin-cuce-gezegen-adayi | 538 | 6 | 3 | NOIRLab, "gerçek gözlem verisinden bileşik" ✓ |
| 2026-10-23-swift-gorevi-sona-erdi | 497 | 7 | 4 | NASA, "Sanatçı çizimi" ✓ |
| 2026-10-20-mmx-firlatildi | 424 | 6 | 6 | ESA, "Çizim (infografik), gerçek fotoğraf değil" ✓ |
| 2026-10-08-webb-en-uzak-frb | 532 | 6 | 3 | NASA (Webb), "gerçek gözlem" ✓ |
| 2026-10-08-psr-j0435-uclu-sistem | 567 | 7 | 4 | görsel yok |
| 2026-10-05-mikroblazar-iras-18293 | 503 | 6 | 5 | görsel yok |
| 2026-10-05-iac-antalya-ay-araci | 494 | 6 | 5 | görsel yok |
| 2026-10-05-hs0209-ikinci-kusak-gezegen | 460 | 6 | 4 | NASA, "Sanatçı çizimi" ✓ |
| 2026-10-01-crew-13-iss | 372 | 6 | 6 | NASA, "Gerçek fotoğraf" ✓ |
| 2026-09-29-toi-561b-yansitici-atmosfer | 489 | 6 | 4 | NASA, "Sanatçı çizimi" ✓ |
| 2026-09-28-juice-dunya-yakin-gecis | 394 | 6 | 3 | ESA, "Gerçek görüntü (işlenmiş)" ✓ |
| 2026-09-28-chime-21cm-hidrojen | 489 | 7 | 5 | görsel yok |
| 2026-09-28-starship-ilk-yorunge | 462 | 7 | 2 | görsel yok |
| 2026-09-21-gunes-sistemi-omru-batygin | 526 | 6 | 3 | görsel yok |
| 2026-09-17-hd156295-nabiz-zamanlamasi | 461 | 6 | 3 | görsel yok |
| 2026-09-16-elias-2-24b-en-genc-gezegen | 508 | 6 | 4 | ESO (ALMA, potw1904a), "Gerçek gözlem" ✓ |
| 2026-09-16-kucuk-kirmizi-noktalar-simulasyon | 455 | 7 | 5 | ESA/Webb, "Gerçek gözlem" ✓ |
| 2026-09-15-beta-pictoris-b-radyo | 387 | 6 | 2 | ESO, "işlenmiş veri" ✓ |
| 2026-09-14-venus-uydusu-gelgit | 559 | 7 | 4 | NASA/JPL, "işlenmiş veri" ✓ |
| 2026-09-09-lbt-ilksel-helyum | 489 | 7 | 6 | ESA/Hubble, "Gerçek gözlem" ✓ |
| 2026-09-04-supernova-unite-karanlik-enerji | 475 | 6 | 4 | görsel yok |
| 2026-09-03-bepicolombo-mtm-ayrildi | 453 | 6 | 4 | ESA, "Gerçek fotoğraf" ✓ |
| 2026-08-30-roman-firlatildi | 419 | 6 | 5 | NASA, "Gerçek fotoğraf" ✓ |
| 2026-08-25-nova-sagittae-2026 | 442 | 6 | 7 | görsel yok |
| 2026-08-23-change7-ertelendi | 397 | 6 | 5 | NASA SVS, "bilgisayar canlandırması" (veri tabanlı) ✓ |
| 2026-08-19-s301-sgra-donus | 440 | 6 | 4 | ESO, "İşlenmiş gözlem verisi" ✓ |

Sonuç: 27 haberin hepsi 350–700 kelime (en kısa 372, en uzun 567), hepsi 4–8 paragraf ve ≥2 kaynak. Görseli olan 18 haberin hepsinde etiket ve kredi var; kurumların hepsi izinli listeden (NOIRLab/Rubin, ESO, ESA, ESA/Webb, ESA/Hubble, NASA). 9 haberde görsel yok; YONTEM bu duruma izin veriyor ("omit only if no freely licensed official image exists"), bu yüzden bulgu sayılmadı. Starship haberinin iki kaynağı da ikincil (Space.com, Spaceflight Now); bu, kullanıcının bildiği askıdaki maddedir ("Starship haberlerinde birincil kaynak okunamadı"), yeni bulgu sayılmadı.

## Bulgular

### A6E-01 · KÜÇÜK · veri/deney_rehber.json:978
- Açıklama: Gelgit deneyinde kaynak adında "enberi ve öteberi" yazıyor. "Öteberi" TDK'de "önemsiz, ufak tefek şeyler" demek; Ay'ın en uzak noktası (yeröte/enöte) değil. Aynı hata simulasyon.js:310 ve :315'teki yorumlarda da var (onlar kullanıcıya görünmüyor).
- Kanıt: `"ad": "NOAA: gelgit değişimleri (enberi ve öteberi)"`; sozluk.gov.tr/gts?ara=öteberi → "Önemsiz, ufak tefek şeyler". Aynı dosyada L667–668 ve deneyler2.js:141 "enöte" kullanıyor; dersler.json "yeröte" kullanıyor (8 kez).
- Önerilen düzeltme: "(enberi ve enöte)" ya da Ay için "(yerberi ve yeröte)".

### A6E-02 · KÜÇÜK · veri/deney_rehber.json:883, 914, 922–923, 930–931; deneyler2.js:187
- Açıklama: "Kabarma" aynı deneyde iki anlamda kullanılıyor: bir yerde günlük yüksek su ("iki kabarma ve iki çekilme", "kabarma ile çekilme arasındaki fark"), başka yerde ayda iki kez olan büyük gelgit (spring tide) için "kabarma gelgiti". TDK "kabarma"yı yüksek su olarak tanımlıyor; okur ikisini karıştırır.
- Kanıt: L883 "her gün iki kabarma ve iki çekilme olur. Her kameri ayda iki kez kabarma gelgiti ..."; deneyler2.js:187 `'Yeni Ay: kabarma gelgiti'`. sozluk.gov.tr: kabarma → "Ay ve Güneş'in çekim etkisiyle büyük denizlerde suların yükselmesi".
- Önerilen düzeltme: Ayda iki kez olan için ayrı bir terim seçilmeli (ör. "büyük gelgit" ya da "tam gelgit"; "ölü gelgit"in karşılığı olarak). Terimi dersler.json'daki gelgit anlatımıyla (d3) birlikte Kaan karar vermeli.

### A6E-03 · KÜÇÜK · veri/deney_rehber.json:387
- Açıklama: Makine çevirisi kokan, Türkçede anlamı bozuk cümle ("probably not for another 100,000 years" düz çevrilmiş).
- Kanıt: "bir gün süpernova olarak patlayacak, ama büyük olasılıkla yaklaşık 100.000 yıl daha değil."
- Önerilen düzeltme: "bir gün süpernova olarak patlayacak, ama büyük olasılıkla en az 100.000 yıl daha patlamayacak."

### A6E-04 · KÜÇÜK · veri/haberler.json:675, 681, 686, 1425, 1436, 1441
- Açıklama: "İşbirliği" bitişik yazılmış; TDK "iş birliği" ayrı yazar. Aynı dosyanın 389. satırı doğru yazıyor ("iş birliğiyle").
- Kanıt: "CHIME İşbirliği (Amiri vd.)", "GRAVITY+ İşbirliği (Abd El Dayem vd.)". sozluk.gov.tr/gts?ara=iş birliği → madde "iş birliği".
- Önerilen düzeltme: "CHIME İş Birliği", "GRAVITY+ İş Birliği".

### A6E-05 · KÜÇÜK · veri/haberler.json:1294; veri/deney/roket.json:113
- Açıklama: "dahil" ("içinde, ile birlikte" anlamında) TDK'ye göre şapkalı yazılır: "dâhil". Şapkasız "dahil" TDK'de "bir işe karışma" demek. (Bilgi için: dersler.json'da da 29 kez şapkasız geçiyor; o dosya başka parçanın alanı.)
- Kanıt: haberler L1294 "Asiago Gözlemevi'ninkiler de dahil olmak üzere"; roket L113 (hedefler[0].not) "sürtünme ve çekim kaybı dahil". sozluk.gov.tr: dâhil → "İçinde, ... ile birlikte"; dahil → "Bir işe karışmış olma".
- Önerilen düzeltme: "dâhil".

### A6E-06 · KÜÇÜK · veri/gorevler.json:86, 108, 457
- Açıklama: Özel ada gelen yapım eki kesmeyle ayrılmış: "Ay'sız". TDK: özel adlara getirilen yapım ekleri kesmeyle ayrılmaz. Ayrıca deney_rehber.json:1597 (hubble.gercek) doğru biçimi ("Aysız") kullanıyor; iki dosya tutarsız.
- Kanıt: "Ay'sız bir gece seç ve kaçamak bakış kullan"; https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/ : "Özel adlara getirilen yapım ekleri, çokluk eki ve bunlardan sonra gelen diğer ekler kesmeyle ayrılmaz."
- Önerilen düzeltme: "Aysız".

### A6E-07 · KÜÇÜK · veri/haberler.json:748, 749, 751
- Açıklama: Terim tutarsızlığı. Batygin haberinde "ana dizi" ve "kızıl dev" kullanılmış; kılavuzun ve derslerin terimi "anakol" (dersler.json'da 104 kez) ve "kırmızı dev" (dersler.json'da 40 kez, "kızıl dev" 0). Deney rehberi de "anakol" / "kırmızı dev" kullanıyor.
- Kanıt: L748 "uzun olgunluk evresini (ana dizi)"; L749 "Güneş, ilerde kızıl dev olarak şiştiği evrelerde ... Kızıl dev, yakıtı azalan..."; L751 "daha kızıl dev evresinde". YAZIM_KILAVUZU.md:87 "kırmızı dev", "anakol".
- Önerilen düzeltme: "anakol", "kırmızı dev".

### A6E-08 · KÜÇÜK · veri/haberler.json:1410
- Açıklama: "kızıla kayması"; uygulamanın her yerinde "kırmızıya kayma" (haberlerde 7, derslerde 121 kez).
- Kanıt: "güçlü çekimden çıkan ışığın kızıla kayması".
- Önerilen düzeltme: "kırmızıya kayması".

### A6E-09 · KÜÇÜK · veri/haberler.json:1069
- Açıklama: Aynı alet türü için iki terim ve özel adda iki farklı ek biçimi var. (a) "tayfçekerleri": haberlerde ve derslerde terim "tayfölçer" (haberlerde 5, derslerde 28 kez; "tayfçeker" yalnız burada). (b) "Büyük Binoküler Teleskop'u": öteki haberler Türkçe tamlama ekini kullanıyor ("Çok Büyük Teleskobu'na", "Aşırı Büyük Teleskobu'ndaki").
- Kanıt: "Arizona'daki iki ikiz aynalı Büyük Binoküler Teleskop'u (LBT) kullandı. ... MODS tayfçekerleri".
- Önerilen düzeltme: "Büyük Binoküler Teleskobu'nu (LBT)", "MODS tayfölçerleri".

### A6E-10 · KÜÇÜK · veri/haberler.json:1189, 1396
- Açıklama: "yükseklik ölçer" ayrı yazılmış; TDK sözlüğü "yükseklikölçer" maddesini bitişik veriyor (uygulamadaki "tayfölçer" ile de uyumlu).
- Kanıt: L1189 "Lazer yükseklik ölçer BELA"; L1396 "LOLA lazer yükseklik ölçerinin". sozluk.gov.tr/gts?ara=yükseklikölçer → "Bulunulan yerin yüksekliğini gösteren aygıt; altimetre".
- Önerilen düzeltme: "lazer yükseklikölçer", "yükseklikölçerinin".

### A6E-11 · KÜÇÜK · veri/haberler.json:1396
- Açıklama: "bir" yanlış yerde; cümle yapısı bozuk (çeviri kokan).
- Kanıt: "... verilerinden üretilmiş, doğal renkli bir Shackleton kraterinin görünümü."
- Önerilen düzeltme: "... verilerinden üretilmiş, Shackleton kraterinin doğal renkli bir görünümü."

### A6E-12 · KÜÇÜK · veri/haberler.json:494
- Açıklama: Saat "geçe" yapısı yanlış kullanılmış ("geçe" saate bağlanır, tarihe bağlanmaz).
- Kanıt: "Kapsül, Türkiye saatiyle 2 Ekim'i 02:05 geçe, Pasifik Okyanusu'nun ..."
- Önerilen düzeltme: "Kapsül, 2 Ekim'de Türkiye saatiyle 02.05'te, ..."

### A6E-13 · KÜÇÜK · veri/haberler.json:1302
- Açıklama: Kullanıcıya görünen "istanbul" alanında yazarın birinci tekil kişisi kalmış ("bulamadım", "söyleyemiyorum"); uygulamanın öteki metinleri kişisiz anlatıyor. Bir çalışma notu metne sızmış gibi okunuyor.
- Kanıt: "Bugünkü parlaklığını doğrulayan bir kaynak bulamadım; bu yüzden şu an dürbünle görülüp görülemeyeceğini söyleyemiyorum."
- Önerilen düzeltme: "Bugünkü parlaklığını doğrulayan bir kaynak yok; bu yüzden şu an dürbünle görülüp görülemeyeceği bilinmiyor."

### A6E-14 · KÜÇÜK · veri/deney_rehber.json:55 (karadelik.gercek)
- Açıklama: M8'in adı tutarsız. Deney rehberi "Lagün Bulutsusu" diyor; dersler.json (L2218, L2351, L16436) ve gorevler.json:407 "Deniz Kulağı Bulutsusu" diyor.
- Kanıt: "NASA'ya göre aynı takımyıldızdaki Lagün Bulutsusu'nu (M8) gözlemenin en iyi zamanı Ağustos'tur."
- Önerilen düzeltme: "Deniz Kulağı Bulutsusu'nu (M8)".

### A6E-15 · KÜÇÜK · veri/deney_rehber.json:1059, 1094
- Açıklama: Takımyıldız adları Türkçe yazılmamış (kılavuz: takımyıldız adları veri/takimyildiz.json'daki "ad"). Pegasus = "Kanatlıat" (gorevler.json:84 doğru biçimi kullanıyor), Orion = "Avcı".
- Kanıt: L1059 "1995'te Pegasus'taki 51 Pegasi'nin çevresinde"; L1094 "Orion'daki Betelgeuse ile Rigel'i". takimyildiz.json: `Peg=Kanatlıat(Pegasus)`, `Ori=Avcı(Orion)`.
- Önerilen düzeltme: "Kanatlıat'taki 51 Pegasi'nin", "Avcı'daki Betelgeuse ile Rigel'i".

### A6E-16 · KÜÇÜK · veri/deney/ortme.json:184 (adimlar[6].neden)
- Açıklama: Yanlış durum eki: "bağlı" yönelme hâli ister.
- Kanıt: "Gerçekte dönem yıldızların arası ve kütleleriyle bağlıdır (Kepler III)"
- Önerilen düzeltme: "Gerçekte dönem yıldızların arasındaki uzaklığa ve kütlelerine bağlıdır (Kepler III)".

### A6E-17 · KÜÇÜK · veri/deney/mevsim.json:41 (adimlar[0].neden)
- Açıklama: Eksik iyelik eki.
- Kanıt: "sağdaki kürede eksen Güneş'e doğru yatık ve kesikli enlem çizginin çoğu gündüz yarısında."
- Önerilen düzeltme: "kesikli enlem çizgisinin çoğu".

### A6E-18 · KÜÇÜK · veri/deney/astrofoto.json:53 (cizim[7].ne)
- Açıklama: Eksik kalmış ifade; neyin oranı olduğu söylenmiyor.
- Kanıt: "Seçtiğin kare sayısı ve seçtiğin gökte yığının oranı."
- Önerilen düzeltme: "Seçtiğin kare sayısı ve seçtiğin gökte yığının sinyal-gürültü oranı."

### A6E-19 · KÜÇÜK · veri/deney/astrofoto.json:61, 161, 272, 275
- Açıklama: Ondalık ayracı tutarsız. Diyafram değerleri bazı yerlerde noktalı ("f/2.8", "f/1.8"), aynı dosyanın 103. satırında virgüllü ("f/1,4 ile f/4", "f/1,8"). Kılavuz ondalık virgül istiyor. Düğme adı (onayarlar[1].ad "Aynasız 24 mm f/2.8") ekranda görünüyor; okunus.js bunu "f bölü 2.8" diye çeviriyor.
- Kanıt: L61 "aynasız tam kare 24 mm f/2.8 ... 50 mm f/1.8"; L103 "f/1,4 ile f/4 arası ... (Galaxy S24 ana kamerası f/1,8)". `okunus('f/2.8 ve 24 mm')` → "f bölü 2.8 ve 24 milimetre".
- Önerilen düzeltme: "f/2,8", "f/1,8" (deney JS'si bu adla düğme eşliyorsa birlikte değiştir).

### A6E-20 · KÜÇÜK · simulasyon.js:396
- Açıklama: Çoğul özneye tekil iyelik: aynı cümlenin öbür kolu "yakıtlarını" diyor.
- Kanıt: `'küçük yıldızlar yakıtını çok yavaş harcar ve Güneş\'ten çok uzun yaşar.'`
- Önerilen düzeltme: "küçük yıldızlar yakıtlarını çok yavaş harcar".

### A6E-21 · KÜÇÜK · simulasyon.js:235; veri/deney_rehber.json:225, 287
- Açıklama: (a) Binlik ayraç boşluk: "35 800 km" (kılavuz ve TDK: nokta; rehber aynı sayıyı "35.786" yazıyor). (b) Aynı deneyde iki terim: JS metni "yer eşzamanlı yörünge", rehber "yerdurgun yörünge".
- Kanıt: simulasyon.js:235 "Yaklaşık 35 800 km yükseklikte dolanım bir yıldız gününe eşitlenir: yer eşzamanlı yörünge."; rehber L225 "yaklaşık 35.786 km yükseklikteki yerdurgun yörüngede". TDK nokta kuralı 9: "Dört ve dörtten çok rakamlı sayılar ... üçlü gruplara ayrılarak yazılır ve araya nokta konur" (https://tdk.gov.tr/icerik/yazim-kurallari/nokta/).
- Önerilen düzeltme: "35.800 km"; deneyde tek terim (rehber cümlesi ekvator üstünde sabit duran uyduları anlattığı için "yerdurgun" uygun; JS cümlesi de ona çekilebilir).

### A6E-22 · KÜÇÜK · veri/gorevler.json:930 (gorevler[39].ne_gorursun)
- Açıklama: Bozuk cümle: edilgen fiil ile "diyor" karışmış.
- Kanıt: "NASA saatte 40–50 meteor bekleniyor diyor;"
- Önerilen düzeltme: "NASA saatte 40–50 meteor beklendiğini söylüyor;"

### A6E-23 · KÜÇÜK · veri/gorevler.json:59 (gorevler[2].ne_gorursun)
- Açıklama: Bozuk karşılaştırma: "-den çok" ile "daha" birlikte kullanılmış; cümlenin ne dediği belirsiz.
- Kanıt: "Uyarı: ışık kirliliğinde bulutsu dürbünden çok çıplak gözle daha belirgin görünebilir."
- Önerilen düzeltme: Kaynak (BinoSky) neyi söylüyorsa ona göre, ör. "ışık kirliliğinde bulutsu dürbünde, çıplak gözle olduğundan daha belirgin görünebilir" (anlamın kaynakla doğrulanması gerekiyor; bkz. Askıda).

### A6E-24 · KÜÇÜK · veri/deney/eratosthenes.json:89 (rehber.gercek)
- Açıklama: Hitap "siz"; kılavuz "sen" diye hitap istiyor ve aynı paragraf "kendin yapabilirsin" diye başlıyor.
- Kanıt: "... bir sopanın boyunu ve gölgesinin boyunu ölçün; ... gölgeyi milimetresine kadar ölçün."
- Önerilen düzeltme: "ölç" (iki kentteki ölçüm için "bir arkadaşınla birlikte ölç" gibi).

### A6E-25 · KÜÇÜK · veri/gorevler.json:435; veri/deney/mevsim.json, veri/deney_rehber.json
- Açıklama: "yarımküre" bitişik; TDK "yarım küre" (ayrı). Deney dosyaları doğru ("yarım küre" 7 kez), gorevler bitişik. (Bilgi: dersler.json 46 kez bitişik yazıyor; başka parçanın alanı.)
- Kanıt: gorevler L435 "kuzey yarımküre gözlemcisi için". sozluk.gov.tr: "yarım küre" var, "yarımküre" yok.
- Önerilen düzeltme: "yarım küre".

### A6E-26 · KÜÇÜK · veri/haberler.json (13 yer), veri/deney/analemma.json (34 yer) ↔ veri/deney/mevsim.json, analemma.json:23, haberler.json:716, 1236
- Açıklama: Saat yazımı tutarsız ve çoğunlukla TDK'ye aykırı. TDK saat ile dakika arasına nokta koyar. Haberlerde "11:10", "14:45", "02:05" gibi iki nokta var; aynı dosyada "15.50 sularında" (L716) ve "14.26'da" (L1236). analemma.json'da aynı deneyde "12.47'de" (L23) ile "12:47:14" (L33) yan yana.
- Kanıt: TDK nokta kuralı 7: "Saat ve dakika gösteren sayıları birbirinden ayırmak için konur. Tren 09.15'te kalktı." (https://tdk.gov.tr/icerik/yazim-kurallari/nokta/). Sayım: haberler.json'da iki noktalı 13 saat (L165, 493, 494, 497, 611, 1188, 1294).
- Önerilen düzeltme: Saat:dakika her yerde nokta ile ("11.10"). Saniyeli değerler (13:03:41) için tek bir biçim seçilip tutarlı kullanılmalı.

### A6E-27 · KÜÇÜK · veri/deney_rehber.json (ör. 130, 139, 344, 368, 470, 591, 1042, 1400), veri/deney/astrofoto.json:67, 243, 252, veri/deney/eratosthenes.json:79, veri/gorevler.json:602, deneyler2.js:174
- Açıklama: Dört basamaklı sayılarda binlik nokta tutarsız. Aynı dosyalarda "3.000 ile 30.000 K" (ortme), "2.300 ile 7.500 K" (yasanabilir), "1.361 W/m²" varken "5772 K", "3000 K", "6371 km", "2900 km", "6600 yıl", "8000 kat", "4000 piksel" noktasız.
- Kanıt: TDK nokta kuralı 9 (yukarıda). grep çıktısı: deney_rehber.json:130 "2900 km", :1042 "(3000 K ... 5772 K ... 9845 K", :1400 "(6371 km"; deneyler2.js:174 "6371 km".
- Önerilen düzeltme: Dört basamaklı sayılarda da nokta ("5.772 K", "6.371 km").

### A6E-28 · KÜÇÜK · veri/deney/yasanabilir.json:127, 146 ↔ veri/deney_rehber.json:1003, 1128, 1134
- Açıklama: Kelvin simgesine gelen ek tutarsız: bir yerde "K" "ka" diye okunmuş gibi ("278 K'ye", "2.600 K'nin"), öbür yerde "kelvin" diye ("29.000 K'in", "40.000 K'e", "33.000 K'in"). Sesli okuma etkilenmiyor (okunus.js dördünü de "kelvine/kelvinin" yapıyor), sorun yalnız yazıda.
- Kanıt: `okunus("Denge sıcaklığı 278 K'ye çıktı")` → "278 kelvine çıktı".
- Önerilen düzeltme: Tek biçim: "K'e, K'in" (kelvin okunuşu).

### A6E-29 · KÜÇÜK · veri/haberler.json:1412 ↔ veri/deney_rehber.json:1094 ↔ veri/dersler.json
- Açıklama: "Betelgeuse"a gelen ekler üç farklı okunuşa göre yazılmış: haberler "Betelgeuse'ten", deney rehberi "Betelgeuse'un", dersler çoğunlukla "Betelgeuse'ün" (8), "Betelgeuse'den" (1).
- Kanıt: grep sayımı: dersler 'ün 8, 'ünkü 2, 'u 3, 'den 1; haberler 'ten 1; rehber 'un 1.
- Önerilen düzeltme: Derslerin çoğunluğu gibi ("Betelgeuse'ün, Betelgeuse'den").

### A6E-30 · KÜÇÜK · veri/haberler.json:558
- Açıklama: Jüpiter'in uydusu "İo" yazılmış; dersler.json (Io 38 civarı), gorevler.json:683 ve öteki metinler "Io".
- Kanıt: "Jüpiter'in volkanik uydusu İo'dakine benzer biçimde".
- Önerilen düzeltme: "Io'dakine".

### A6E-31 · KÜÇÜK · veri/haberler.json:113–115 ↔ :1298
- Açıklama: Aynı terim aynı dosyada iki biçimde: "X-ışını" (L113, 114, 115) ve "X ışınlarında" (L1298). (Derslerde de ikisi var: 78 / 37.)
- Kanıt: L113 "X-ışını ve morötesi/görünür ışık teleskoplarını"; L1298 "novanın yakında X ışınlarında da parlamasını bekliyor".
- Önerilen düzeltme: Tek biçim. TDK'nin "alfa ışını, gama ışını" yazımına uygun olan "X ışını" (kısa çizgisiz).

### A6E-32 · KÜÇÜK · veri/haberler.json:660 ↔ :660, 664
- Açıklama: Aynı yer adı aynı haberde iki dilde: "Britanya Kolumbiyası'nda" ve "British Columbia ... üniversiteleriyle", "British Columbia Üniversitesi'nin".
- Kanıt: L660 "CHIME, Britanya Kolumbiyası'nda Penticton yakınındaki ... teleskobu British Columbia, McGill ve Toronto üniversiteleriyle"; L664 "British Columbia Üniversitesi'nin açıklamasına göre".
- Önerilen düzeltme: Tek biçim (ör. "Britanya Kolumbiyası" ve "Britanya Kolumbiyası Üniversitesi").

### A6E-33 · KÜÇÜK · veri/haberler.json:838
- Açıklama: Terim tutarsızlığı: "gezegen öncesi disk"; kılavuz ve dersler "öngezegen diski" diyor (dersler 6 kez, "gezegen öncesi" 0).
- Kanıt: "bunlara \"gezegen öncesi disk\" deniyor."; YAZIM_KILAVUZU.md:59, 64 "öngezegen diski".
- Önerilen düzeltme: "öngezegen diski".

### A6E-34 · KÜÇÜK · veri/haberler.json:1137
- Açıklama: "yıldızlar arası toz"; dersler bu kavram için bitişik "yıldızlararası" kullanıyor (58 kez; ayrı yazım 19). TDK sözlüğünde iki biçim de madde olarak yok, bu yüzden yalnız tutarlılık bulgusu.
- Kanıt: "teleskoplar arasındaki farklar, yıldızlar arası toz, ...".
- Önerilen düzeltme: "yıldızlararası toz".

### A6E-35 · KÜÇÜK · veri/haberler.json:715, 493 ↔ veri/deney/roket.json (bütün dosya)
- Açıklama: Roketin "stage" bölümü haberlerde "kademe" ("iki kademeden", "birinci kademesi"), roket deneyinde ve derslerde "aşama" (dersler 131 kez "aşama", 4 kez "kademe").
- Kanıt: haberler L715 "iki kademeden oluşuyor. Kademe, yakıtı bitince ayrılan roket bölümüdür."; roket L3 "aşama sayısını".
- Önerilen düzeltme: Haberlerde de "aşama".

### A6E-36 · KÜÇÜK · veri/gorevler.json:414, 525 (yeni aya / yeni aydan) ↔ veri/deney_rehber.json, deneyler2.js ("yeni Ay")
- Açıklama: Evre adı tutarsız: görevler "yeni ay", deney rehberi ve deney ekranı "yeni Ay" / "Yeni Ay'dan bu yana gün". Aynı dosyada Ay özel ad olarak büyük yazılıyor ("Ay'ın yeni aya yakın olduğu").
- Kanıt: gorevler L414 "Ay'ın yeni aya yakın olduğu bir gece seç."; deneyler2.js:167 'Yeni Ay\'dan bu yana gün'.
- Önerilen düzeltme: Tek biçim seçilmeli (dersler.json küçük harf "yeni ay" kullanıyor; deney ekranındaki etiketle birlikte karar verilmeli).

### A6E-37 · KÜÇÜK · veri/gorevler.json:304, 325
- Açıklama: (a) Askı yıldız kümesi özel ad olarak kullanılıyor ("Askı'yı (Coathanger)", L297) ama L304'te ek kesmesiz "Askının". (b) Kaynak adı "Sky and Telescope" yazılmış; öteki her yerde "Sky & Telescope".
- Kanıt: L304 "Askının ters durması seni şaşırtmasın"; L325 "Sky and Telescope dürbünde kolay olduğunu".
- Önerilen düzeltme: "Askı'nın"; "Sky & Telescope".

### A6E-38 · KÜÇÜK · deneyler2.js:172 ↔ veri/deney_rehber.json:914, 922
- Açıklama: Rehber, ekrandaki ölçüm kutusunu "Durum:" diye anıyor ("Durum: kabarma gelgiti", "Durum: ölü gelgit"), ama kutunun ekrandaki etiketi "Bu gün". Okur rehberdeki sözcüğü ekranda bulamaz.
- Kanıt: deneyler2.js:172 `['ggDurum', 'Bu gün']`; rehber L914 "Durum: kabarma gelgiti".
- Önerilen düzeltme: Etiketi "Durum" yap ya da rehberde "‘Bu gün’ kutusu: ..." yaz.

## Askıda
- gorevler.json:59 (A6E-23) cümlesinin doğru anlamı: BinoSky (B. Crowell, M42) sayfası açılıp okunmadı; ışık kirliliğinde bulutsunun çıplak gözle mi dürbünle mi daha belirgin olduğuna dair kaynaktaki ifadeyi doğrulamadım. Yazım bozukluğu kesin, anlam düzeltmesi kaynakla yapılmalı.
- MMX görseli (haberler.json:215): ESA sayfasındaki kredi satırı yalnız "ESA"; uygulama "ESA (Teşekkür: ATG Europe)" yazıyor. Teşekkür ibaresi sayfanın açıklama metninde olabilir (WebFetch yalnız kredi ve lisans satırını verdi); fazladan ekleme kurala aykırı sayılmayabilir. JUICE kredisi ("ESA/Juice/JMC", teşekkür Simeon Schmauß) sayfayla örtüşüyor.
- Elias 2-24 görseli (haberler.json:883): ESO'nun sayfasından (potw1904a, CC BY 4.0) alınmış, ama kredi ALMA (ESO/NAOJ/NRAO) ve NRAO/AUI/NSF içeriyor. Kaynak kurum ESO olduğu için bulgu saymadım; "yalnız NASA/ESA/ESO/…" kuralının ortak kredili görselleri kapsayıp kapsamadığına Kaan karar vermeli.
- Ay ve gün adlarının büyük harfi: TDK belirli tarih bildirmeyen ay adlarını küçük yazar; haberlerde "Daha Nisan ayında" (L70), "Şubat'tan beri" (L496), "Temmuz'da gelen" (L496) gibi yılı bağlamdan anlaşılan ama tam tarih vermeyen kullanımlar var. Kuralın bu ara durumlara nasıl uygulanacağından emin değilim.
- "ilerde" (haberler.json:749 ve deney/rehber metinlerinde birkaç yer): TDK sözlüğünde "ileride" var; "ilerde"nin ayrı madde olup olmadığını denetlemedim.
- "Nobel ödülü sahibi" (haberler.json:1410): ödül adının büyük harfle "Nobel Ödülü" yazılıp yazılmayacağı için TDK kaynağına bakmadım.
- Tırnak işareti: haberler.json'da aynı dosyada hatta aynı haberde hem “ ” hem düz " " kullanılıyor (ör. L389). TDK'nin tipografik tırnak tercihi yok; tutarlılık sorunu olarak not edildi, bulgu sayılmadı.
- simulasyon.js ve deneyler2.js'de yalnız dize içeren satırları okudum; boşluk ve Türkçe harf içermeyen tek kelimelik ASCII dizeler (ör. 'Kemer') atlanmış olabilir.
