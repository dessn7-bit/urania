# Alan 6 — Türkçe yazım, Parça D (Urania v39 denetimi, 2026-10-30)

Dersler: d25 d26 d27 d28 d29 d31 d32 d50 d51 d54 d52 d56 d53 d55 (sıradaki 45–58. dersler) ve bunların `_sinav.json` dosyaları.
Satır numaraları `arastirma/dersler_v2/dNN.json` (ya da `dNN_sinav.json`) dosyasının satırıdır.

## Okunan dosyalar

| dosya | satır | tamamı |
|---|---|---|
| arastirma/dersler_v2/YAZIM_KILAVUZU.md | 196 | evet |
| d25.json | 593 | evet (bütün metin alanları; URL satırları ayıklandı) |
| d25_sinav.json | 57 | evet |
| d26.json | 576 | evet |
| d26_sinav.json | 57 | evet |
| d27.json | 602 | evet |
| d27_sinav.json | 57 | evet |
| d28.json | 611 | evet |
| d28_sinav.json | 57 | evet |
| d29.json | 563 | evet |
| d29_sinav.json | 58 | evet |
| d31.json | 608 | evet |
| d31_sinav.json | 58 | evet |
| d32.json | 618 | evet |
| d32_sinav.json | 58 | evet |
| d50.json | 623 | evet |
| d50_sinav.json | 57 | evet |
| d51.json | 595 | evet |
| d51_sinav.json | 57 | evet |
| d54.json | 541 | evet |
| d54_sinav.json | 57 | evet |
| d52.json | 601 | evet |
| d52_sinav.json | 57 | evet |
| d56.json | 560 | evet |
| d56_sinav.json | 57 | evet |
| d53.json | 693 | evet |
| d53_sinav.json | 58 | evet |
| d55.json | 583 | evet |
| d55_sinav.json | 57 | evet |
| veri/dersler.json | — | hayır: yalnız grep (ders başlıkları, terim dağılımı) |
| veri/takimyildiz.json | — | hayır: yalnız grep (Indus, Okçuk, Kuğu, Yay, Kahraman, Ejderha adları) |
| okunus.js | — | hayır: 15–54. satırlar (birim okunuşları, ek uyumu) |

Not: Okumayı kolaylaştırmak için her dosyadan metin alanlarını satır numarasıyla çıkaran bir döküm üretildi (geçici klasörde `cikar.py`); yalnız `url`/`kaynak_url`/`id`/`kid`/`bolum`/`dogru`/`unite` satırları ve köşeli/süslü parantez satırları atıldı. Başlık, özet, bölüm başlıkları, paragraflar, örnekler, akılda, formül ad/ifade/açıklama, anahtar sayılar, sözlük, defter notları, sorular/cevaplar, kaynak adları ve sınav soru/şık/açıklamaları baştan sona okundu.

## Yöntem

- Tüm metin satır satır okundu.
- Geçici klasörde (`…\scratchpad\denetim\a6d\`) betikler:
  - `kontrol.py`: tekrar eden sözcük, çift boşluk / noktalamadan önce boşluk, bütün kesmeli ekleri listeleme (737 farklı biçim, tek tek gözden geçirildi).
  - `sayi.py`: rakamla yazılmış sayılara (ondalık, binlik, üs dahil) getirilen eklerin okunuşa göre ünlü uyumu ve d/t benzeşmesi denetimi. Sonuç: **hata yok** (test girdisiyle betiğin çalıştığı doğrulandı).
  - `terim.py`: ~70 terim çiftinin kendi derslerimde ve `veri/dersler.json`'da dağılımı.
  - `binlik.py`: binlik noktası olmayan 4+ basamaklı ölçüm sayıları (yıllar ve künye numaraları ayıklandı; 344 sayıda nokta doğru kullanılmış).
- TDK Güncel Türkçe Sözlük denetimi (sozluk.gov.tr/gts API, saniyede ≤1 istek). Sonuçlar:
  - `dâhil` madde başı (arama "dahil" → madde "dâhil")
  - `yer çekimi` (çekim maddesinin birleşikleri arasında; "yerçekimi" bulunamadı)
  - `gezegenler arası` var, "gezegenlerarası" yok
  - `tek eşli` var, "tekeşli" yok
  - `jul` var, "joule" yok
  - `eş zamanlı` var, "eşzamanlı" yok
  - `göreceli` = "görece, bağıntılı"
  - `hâl` (durum) / `hal` (pazar yeri)
- TDK yazım kuralları sayfaları:
  - https://tdk.gov.tr/icerik/yazim-kurallari/sayilarin-yazilisi/ (madde 7: "Dört veya daha çok basamaklı sayılar … aralarına nokta konur: 4.567")
  - https://tdk.gov.tr/icerik/yazim-kurallari/duzeltme-isareti/ ("hal (sebze, meyve vb. satılan yer), hâl (durum, vaziyet)")
  - https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/

## Bulgular

### A6D-01 · ÖNEMLİ · d32.json:133, d32.json:438
- **Açıklama:** "Uzun Kapanma 3" adı ile tarih arasına virgül konmamış. Cümle "3 Temmuz 2026" tarihi gibi okunuyor; sesli okumada da öyle duyulur.
  - Metin: "LHC için Uzun Kapanma 3 Temmuz 2026 başında başlayacak"
  - Defter notu: "Uzun Kapanma 3 Temmuz 2026, Yüksek Parlaklıklı LHC Haziran 2030"
  - Kastedilen "Uzun Kapanma 3, Temmuz 2026 başında". Aynı dersteki d32:140 ("Temmuz 2026'dan beri Uzun Kapanma 3'te") ve d32:288 ("Temmuz 2026 → Haziran 2030") de bunu gösteriyor.
- **Kanıt:** d32.json:133 ve 438 (alıntılar yukarıda).
- **Önerilen düzeltme:**
  - 133: "LHC için Uzun Kapanma 3'ün Temmuz 2026 başında başlayacağını…"
  - 438: "Uzun Kapanma 3: Temmuz 2026'dan itibaren"

### A6D-02 · ÖNEMLİ · d50.json:67, d54.json:173, d55.json:97, d55.json:103
- **Açıklama:** Kozmolojinin standart modeli (ΛCDM), açıklamasız ve küçük harfle "standart model" diye anılıyor. Aynı derslerde "Standart Model" büyük harfle parçacık fiziği modelidir. Sesli dinlemede büyük/küçük harf ayrımı duyulmaz.
  - d50:67 (akılda): "Soğuk karanlık madde standart modelin parçasıdır."
  - Bu akılda satırı, aynı derste d50:50'deki "Standart Model'deki parçacıkların hiçbiri bütün bu koşulları karşılamaz" cümlesiyle ve d32'deki "Standart Model'de karanlık madde olabilecek … parçacık yoktur" bilgisiyle çelişiyor gibi okunur.
  - d50:144'teki "standart model, yani ΛCDM" açıklaması bu satırdan **sonra** geliyor.
  - d54:173: "veriler standart modele çarpışma eklemeyi gerektirmiyor"
  - d55:97: "standart modelle açıklanabilir"
  - d55:103: "standart modele uyuyorlar"
- **Kanıt:** satırlar yukarıda; `terim.py` çıktısı: "standart model" küçük harf 5 kez (d50, d54, d55), "Standart Model" 57 kez.
- **Önerilen düzeltme:** "standart kozmoloji modeli (ΛCDM)" ya da "ΛCDM modeli". d50 sözlüğü de bu biçimi kullanıyor: d50:319 "standart kozmoloji modelinin".

### A6D-03 · KÜÇÜK · d27.json:18
- **Açıklama:** Eksik ek.
  - Metin: "Bu çıkmaza sonradan morötesi felaketi adı verildi; adı 1911'de fizikçi Paul Ehrenfest koydu."
- **Önerilen düzeltme:** "adını 1911'de fizikçi Paul Ehrenfest koydu." Aynı bilgi d27:322'de doğru: "adını 1911'de Ehrenfest koydu".

### A6D-04 · KÜÇÜK · d25.json:62
- **Açıklama:** Eksik iyelik eki.
  - Metin: "Yolcu da kendi trenin ortasındadır"
- **Önerilen düzeltme:** "Yolcu da kendi treninin ortasındadır".

### A6D-05 · KÜÇÜK · d54.json:171
- **Açıklama:** Bozuk cümle: "-dığını ki" yapısı yanlış.
  - Metin: "şişmenin o kadar esnek olduğunu ki hiçbir deneyin onu çürütemeyeceğini öne sürdüler."
- **Önerilen düzeltme:** "şişmenin, hiçbir deneyin çürütemeyeceği kadar esnek olduğunu öne sürdüler."

### A6D-06 · KÜÇÜK · d53.json:475
- **Açıklama:** Eksik ek.
  - Metin: "bir radyo antenin tek tek fotonları saymaması gibi"
- **Önerilen düzeltme:** "bir radyo anteninin tek tek fotonları saymaması gibi". Aynı ders d53:71'de doğru yazıyor: "Bir radyo anteni de radyo dalgasını ölçer".

### A6D-07 · KÜÇÜK · d53.json:88
- **Açıklama:** Özne–yüklem uyumsuzluğu (tekil özne, çoğul yüklem).
  - Metin: "Fazladan boyut, bildiğimiz üç uzay ve bir zaman boyutuna ek olarak varsayılan ve günlük hayatta fark edilmeyen boyutlardır."
- **Önerilen düzeltme:** "… fark edilmeyen boyuttur." (Sözlükteki tanım d53:361 tekil.)

### A6D-08 · KÜÇÜK · d28.json:134
- **Açıklama:** Yanlış çatı.
  - Metin: "Toplam spini sıfır olan bir çift elektron oluştursun ve biri İstanbul'a, öteki Ankara'ya gitsin."
  - "oluştursun" geçişli ("birileri oluştursun"); kastedilen "bir çift elektron oluşsun".
- **Önerilen düzeltme:** "… bir çift elektron oluşsun ve …"

### A6D-09 · KÜÇÜK · d28.json:173
- **Açıklama:** Yanlış sözcük. "artı" ("+") yerine "artış" kastedilmiş.
  - Metin (akılda): "LIGO kuantum gürültüsünü sıkıştırılmış ışıkla azaltır (menzil %12–14 artı)."
  - d28:169 ve d28:298'de doğrusu: "artırıp", "%12–14 menzil".
- **Önerilen düzeltme:** "(menzilde %12–14 artış)".

### A6D-10 · KÜÇÜK · d31.json:78
- **Açıklama:** Anlamca yanlış sözcük. "Karşılaştırmak" = kıyaslamak. Kastedilen, lityumun nötronlarla ışınlanması ya da bombardımanı.
  - Metin: "Trityum doğada hazır bulunmaz; Wikipedia'ya göre lityumu enerjik nötronlarla karşılaştırarak üretilir."
- **Önerilen düzeltme:** "… lityumu enerjik nötronlarla ışınlayarak (bombardıman ederek) üretilir."

### A6D-11 · KÜÇÜK · d27.json:273
- **Açıklama:** Ek uyumu hatası. Å "angström" okunur (TDK GTS madde başı: angström); son ünlü "ö", bu yüzden "-deki" gelmeli. Aynı satırda binlik noktası da eksik (bkz. A6D-21).
  - Metin: "Sıfır kadirlik (Vega ölçekli) bir yıldızın 5556 Å'daki foton akısı"
- **Önerilen düzeltme:** "5.556 Å'deki"
- **Kural:** https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/ (kısaltmalara gelen ekler okunuşa uyar)

### A6D-12 · KÜÇÜK · d25.json:181 (akılda)
- **Açıklama:** Birim kısaltmasının eki okunuşa uymuyor. J "jul" okunur (okunus.js:26 `J: 'jul'`; TDK GTS: jul), bu yüzden "-dür" gelmeli.
  - Metin: "1 kg yaklaşık 9 × 10¹⁶ J'dir."
- **Önerilen düzeltme:** "J'dür" (ya da "9 × 10¹⁶ jul eder").

### A6D-13 · KÜÇÜK · d25.json:202
- **Açıklama:** Ek uyumu hatası. CERN "sern" okunur; aynı ders ve d32 hep "CERN'in", "CERN'de", "CERN'e" yazıyor.
  - Metin: "Türkiye 6 Mayıs 2015'te CERN'ün ortak üyesi oldu"
- **Önerilen düzeltme:** "CERN'in ortak üyesi oldu" (d32:134 aynı cümleyi doğru yazıyor).

### A6D-14 · KÜÇÜK · d32.json:188
- **Açıklama:** Cins ada kesme işareti konmuş.
  - Metin: "bir proton, bir kaon ve iki pion'a bozunmasını"
- **Önerilen düzeltme:** "iki piona"
- **Kural:** kesme işareti özel adlara ve kısaltmalara gelen eklerde kullanılır; https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/

### A6D-15 · KÜÇÜK · d50.json:97
- **Açıklama:** Cins ada kesme işareti konmuş. Başka yerlerde "sigmayı", "sigmalık" kesmesiz yazılıyor.
  - Metin: "Sigma'yı d32'de gördün"
- **Önerilen düzeltme:** "Sigmayı d32'de gördün".

### A6D-16 · KÜÇÜK · d31.json:194 (ve aynı paragrafın devamı)
- **Açıklama:** Birim adına kesme işareti konmuş. Aynı derste "milisieverttir" (d31:196) kesmesiz yazılmış; tutarsız.
  - Metin: "Birimi sievert'tir; … milisievert, yani sievert'in binde biri kullanılır."
  - Sözlükte de: d31:421 "Etkin doz birimi sievert'in binde biri".
- **Önerilen düzeltme:** "sieverttir", "sievertin".

### A6D-17 · KÜÇÜK · d29.json:18, 40, 51, 135, 440
- **Açıklama:** "hal" (pazar yeri) ile "hâl" (durum) karıştırılmış. d29 dışındaki 13 dosyanın hepsi "hâl" yazıyor (`grep`: d25'te 19, d32'de 12, d55'te 16 kez …); yalnız d29 düzeltme işaretsiz.
  - 18: "fotonlar halinde gelir", "O halde her foton"
  - 40: "hareket halindeki davranışını"
  - 51: "bu kuralın çizilmiş halidir"
  - 135: "durgun halde her biri 511 keV"
  - 440: "kenarları ince olduğu halde"
- **Önerilen düzeltme:** "hâlinde", "O hâlde", "hâlindeki", "hâlidir", "hâlde".
- **Kural:** https://tdk.gov.tr/icerik/yazim-kurallari/duzeltme-isareti/ ("hal (sebze, meyve vb. satılan yer), hâl (durum, vaziyet)")

### A6D-18 · KÜÇÜK · d31.json:460, d50.json:91, d50.json:122, d50_sinav.json:12, d51.json:192, d52_sinav.json:26, d56.json:287
- **Açıklama:** TDK'nin madde başı biçimi "dâhil". `veri/dersler.json`'da 29 "dahil" var, hiç "dâhil" yok; bu yüzden düzeltme bütün dersleri kapsamalı.
  - Örnek: d50:91 "LZ'nin 2,2×10⁻⁴⁸ cm² sınırı dahil hiçbir deney WIMP bulmadı"
- **Kanıt:** `sozluk.gov.tr/gts?ara=dahil` → `"madde":"dâhil"`, telaffuz "da:hil".
- **Önerilen düzeltme:** "dâhil".

### A6D-19 · KÜÇÜK · d27.json:87
- **Açıklama:** TDK "yer çekimi"ni ayrı yazar. d26:130 ve d26:201 ("yer çekimi ivmesi") doğru; d27 bitişik yazmış.
  - Metin: "yerçekimi ivmesi 9,81 m/s² olduğuna göre"
- **Kanıt:** `gts?ara=çekim` → birleşikler: "… yer çekimi"; `gts?ara=yerçekimi` → "Sonuç bulunamadı".
- **Önerilen düzeltme:** "yer çekimi ivmesi".

### A6D-20 · KÜÇÜK · d27.json:82; d50.json:65, d50.json:329
- **Açıklama:** "-ler arası" birleşikleri ayrı yazılır; d31:207 doğru yazıyor ("gezegenler arası yolda").
  - d27:82: "dünyanın ilk gezegenlerarası güneş yelkenli uzay aracı"
  - d50:65, d50:329: "galaksilerarası hidrojen"
- **Kanıt:** `gts?ara=gezegenler arası` → madde var; `gts?ara=gezegenlerarası` → "Sonuç bulunamadı".
- **Önerilen düzeltme:** "gezegenler arası", "galaksiler arası".
- **Not:** "galaksiler arası" TDK sözlüğünde madde değil; aynı kurala göre önerildi. "Yıldızlararası", kılavuzun ve d14 başlığının biçimi olduğu için dokunulmadı.

### A6D-21 · KÜÇÜK · binlik noktası eksik (çok dosya)
- **Açıklama:** Kılavuz "binlik nokta (1.988)" diyor, TDK de dört basamaklı sayılara nokta konmasını istiyor. Aynı derslerde "27.000", "6.357 km", "1.836" doğru yazılırken aşağıdaki ölçüm sayıları noktasız kalmış. (Yıllar, künye ve makale numaraları sayılmadı.)
  - **d25:** 101 "3240 m", "1616 m"; 102, 115, 122, 290 "1917 m"; d25_sinav:40 "1917 m'den"
  - **d27:**
    - 32 "T = 5772 K" (iki kez), "1000 nm'lik", "1239,84" (bu sayı derste 8+ yerde geçiyor)
    - 73 "1107 nm", "1100 nm'den"
    - 158 "1000 K'in", "3000 K"
    - 273 "5556 Å"
    - 302 "<1000 K", "~3000 K"
    - 430 ve 461 "1107 nm"
    - 460 ve 461 "1500 nm'lik"
    - d27_sinav:40 "1000 K'in", "3000 K"
  - **d50:**
    - 42 "6371 km", "metreküpte 4000", "5000 cm²" (iki kez)
    - 85 "1000 günden"
    - 132 "1000 katı"
    - 145 "1000 kat", "1000'i"
    - 168 "1900 kare derecelik"
    - 169 "3200 megapiksellik"
    - 453 "1000 cm³", "× 1000"
  - **d51:** 173 "≈ 4700 kat" (aynı cümlede "3.500.000 ÷ 740" noktalı)
- **Kanıt:** `binlik.py` çıktısı (geçici klasör); kural: https://tdk.gov.tr/icerik/yazim-kurallari/sayilarin-yazilisi/ madde 7.
- **Önerilen düzeltme:** "3.240 m", "1.917 m", "5.772 K", "1.239,84", "6.371 km", "1.000 gün" vb.

### A6D-22 · KÜÇÜK · d52.json:135, 194, 410, 452
- **Açıklama:** TDK "tek eşli"yi ayrı yazar.
  - 135: "dolanıklık tekeşlidir"
  - 194 ve 452: "dolanıklığın tekeşliliği"
  - 410: "(tekeşli dolanıklık)"
- **Kanıt:** `gts?ara=tek eşli` → madde var; `gts?ara=tekeşli` → "Sonuç bulunamadı".
- **Önerilen düzeltme:** "tek eşlidir", "tek eşliliği", "tek eşli dolanıklık".

### A6D-23 · KÜÇÜK · joule / jul karışık (d25, d27, d50, d51, d53 ↔ d31, d32)
- **Açıklama:** Aynı birim iki yazımla geçiyor. TDK sözlüğü "jul" yazar; uygulamanın sesli okuması da J'yi "jul" okur (okunus.js:26).
  - "joule": d25:172, 173, 481 ("kaç joule'dür?"); d27:28, 54, 59, 116, 167, 174; d50:189; d51:70 ("joule'lük"), 71, 77, 79; d53:57 ("Joule'e", "34,2 megajoule"), 62, 469
  - "jul": d31 (5 kez) ve d32 (16 kez), örneğin d32:25 "3,24 × 10⁻¹¹ jul"
- **Kanıt:** `gts?ara=jul` → madde "jul"; `gts?ara=joule` → "Sonuç bulunamadı".
- **Önerilen düzeltme:** Hepsi "jul" ("jule", "julluk", "megajul").

### A6D-24 · KÜÇÜK · eV/keV/MeV eklerinde üç farklı okunuş (d27, d28, d29_sinav, d31, d32, d32_sinav, d50, d53)
- **Açıklama:** Aynı birime üç ayrı okunuşa göre ek getirilmiş. Uygulamanın sesli okuması MeV'i "mega elektronvolt" okur (okunus.js:26); buna uyan biçim ilk gruptur.
  - **"elektronvolt" okunuşu:**
    - d27: 32 ve 67 "eV'tur", 59/75/115 "eV'luk", 73 "eV'u"
    - d28: 100 "keV'tur", 101 "keV'tadır", 483 "keV'luk", 82 "MeV'tur"
  - **harf okunuşu (e-ve, me-ve):**
    - d50: 55/189 "eV'lik", 448 "eV'den", 108 "eV'nin", 65 "keV'ye", 121/122 "keV'de", 123 "keV'lik", 37/77/339 "GeV'lik", 85 "GeV'de", 96 "GeV'nin"
    - d26:190 "GeV'dir"
    - "MeV'dir": d29_sinav:40, d31:34, d32:36
    - "MeV'lik": d29_sinav:36, d32:53, d32_sinav:4
    - d53: 216/249 "TeV'lik"
  - **"mev" diye sözcük gibi okunuş:** d31:52 "MeV'e", d31:77/85 "MeV'i", d31:108 "MeV'in", d32:156 "MeV'ini"
- **Önerilen düzeltme:** Elektronvolt okunuşunda birleş: "MeV'tur", "MeV'luk", "MeV'a", "MeV'u", "MeV'un", "keV'ta", "GeV'luk", "eV'tan" …
- **Kural:** kısaltmalara gelen ekler okunuşa uyar; https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/

### A6D-25 · KÜÇÜK · d32.json:115, 132, 147 ↔ d53.json:297; d28.json:180 ↔ d28.json:6, 181, 184, 185, 229
- **Açıklama:** Aynı kısaltma, ders içinde ya da dersler arasında farklı okunuşa göre ek almış.
  - **CMS:** d32 "ATLAS ve CMS'te" (sessiz "es" okunuşu) ↔ d53:297 "CMS'nin" (Türkçe harf okunuşu "se-me-se").
  - **NMR / MR (aynı ders içinde):** d28:180 "NMR'yi" ("ne-me-re") ↔ d28:6 "MR'a", 181/184 "MR'ın", 185/229 "MR'da" ("em-ar").
- **Önerilen düzeltme:** Tek okunuş seçilmeli: "CMS'de", "CMS'nin"; "NMR'ı" (MR'a ile uyumlu) ya da hepsi Türkçe harf okunuşuyla.

### A6D-26 · KÜÇÜK · d54.json (51 yerde), d54_sinav.json:54, d55.json (46 yerde), d55_sinav.json:18
- **Açıklama:** Alıntı ve ad vurgusu için tek tırnak kullanılmış. Öbür 12 dersin hepsi çift tırnak (“ ”) kullanıyor (`grep`: d56'da 92, d52'de 58, d28'de 37 çift tırnak; d54/d55'te 0). TDK, tek tırnağı tırnak içindeki ikinci alıntıya ayırır.
  - Örnekler: d54:26 "'şans eseri' açıklamalardan"; d54:40 "'Şişen evren: …' başlığıyla"; d55:6 "'Büyük Patlama'dan önce ne vardı?' sorusunun"; d55:467 "Tye'nin kendisi 'veriler doğru çıkarsa' diyor"
  - Kesmeyle yan yana gelince karışıklık da doğuyor: d55:6 "'Büyük Patlama'dan" (kapanış tırnağı ile kesme aynı işaret).
- **Önerilen düzeltme:** “ ” çift tırnağa geçmek.

### A6D-27 · KÜÇÜK · terim tutarsızlıkları (kendi derslerim içinde)

| Terim | Yer | Not / öneri |
|---|---|---|
| hayalet enerji ↔ fantom enerji | d55:136, 137, 145, 180, 201, 388 "hayalet enerji" (sözlükte de, d55:387) ↔ d51:110, 111, 115, 379 vb. "fantom enerji" (d51 sözlüğü d51:378) | Aynı kavram iki ayrı sözlük maddesi olarak ortak Astro sözlüğüne giriyor. Tek terim seçilmeli; öbürü "… da denir" diye anılmalı. |
| karşı parçacık ↔ karşıt parçacık | d29:127 (5 kez) "karşı parçacık" ↔ d31:135, d32:33, 169–171, 410 "karşıt parçacık" | `dersler.json`: "karşıt" 9, "karşı" 5. "Karşıt parçacık"ta birleşilmeli. |
| yarı ömür ↔ yarılanma ömrü | d32:93 "yarı ömürleri", d32:98 "yarı ömür" | d31:143 ana terimi "yarılanma ömrü" seçip "yarı ömür"ü yalnız eş ad olarak anıyor. W/Z için kastedilen ortalama ömür; d32:100, 242, 436 zaten "ömür" diyor. "Ömürleri" yazılmalı. |
| şişme ↔ enflasyon | d54 başlığı (d54:5) "Enflasyon ve Çoklu Evren", metinde 160'tan çok "şişme" ve tek tanım "(enflasyonun)" (d54:6, 41, 297) | d50:17 ve d50:51 "enflasyonun bazı öngörüleri", "bazı enflasyon senaryolarında" (d54'ten önce gelen derste, d54'ün terimiyle uyumsuz). |
| şişiren alan ↔ şişirici alan | d54:41 ve sözlük d54:316 "şişiren alan" ↔ d54:65, 66 "şişirici alan" | Aynı derste iki biçim. |
| X-ışını ↔ X ışını | d50:28, 121, 171; d51:29 "X-ışını" ↔ d27:18, 81; d31:90, 92, 146 "X ışını" | TDK birleşikleri "gama ışını, alfa ışını" biçiminde kısa çizgisiz. `dersler.json`: "X ışın" 78, "X-ışın" 37. |
| kuantum kütleçekim ↔ kuantum kütleçekimi | d26 sözlük (d26:391) ve d53 sözlük (d53:310) "kuantum kütleçekim" ↔ d52, d55, d56'da "kuantum kütleçekimi" (d52:179, d55:34, d56:160 …); d53 içinde ikisi karışık (13 ↔ 15) | Belirtisiz ad tamlaması kuralına uyan "kuantum kütleçekimi"dir; kılavuz başlıkta "kuantum kütleçekim" kullandığı için **Askıda** da anıldı. |
| kütleçekimin ↔ kütleçekiminin | d53:182 (Örnek başlığı) "kütleçekimin hızını", d53:229 "Kütleçekimin hızını sınamak", d53:455 "kütleçekimin kuantum düzeyinde" ↔ d53:179 "kütleçekiminin hızı" ve öbür 9 dosya (40'tan çok) "kütleçekiminin" | "kütleçekiminin" |
| Super-Kamiokande ↔ Süper-Kamiokande | d55:111, 279 ↔ d32:157 | Özel ad; tek biçim. |
| göreceli ↔ göreli | d25:452 "eşzamanlılık göreceli bir kavramdır" ↔ ders boyunca "göreli" | TDK'de "göreceli" geçerli ama "görece, bağıntılı" anlamında; derste tek biçim "göreli". |

### A6D-28 · KÜÇÜK · kesinlik etiketinin yazılışı (d52, d56 ↔ d50, d51, d53, d54, d55)
- **Açıklama:** d50, ölçeği tanıtırken "hep aynı sözlerle" kullanılacağını ve kalıbın “Kesinlik: gözlemle kesinleşmiş” olduğunu söylüyor (d50:16, 19); kılavuz da "hep aynı sözlerle an" diyor (YAZIM_KILAVUZU.md:172).
  - d52 ve d56 etiketleri büyük harfle ve tırnak içinde yazıyor: d52:43 "Kesinlik düzeyi: “Kuram ya da hipotez”"; d56:18 “Gözlemle kesinleşmiş”, “Spekülasyon”; d52:404 ve d56:382 defter notlarında "Gözlemle kesinleşmiş; Güçlü kanıtlı …".
  - d50, d51, d53, d54, d55 küçük harf ve tırnaksız yazıyor ("Kesinlik: kuram ya da hipotez").
  - Sözcük de değişiyor: d50/d54 "basamak", d52/d56 "düzey".
- **Önerilen düzeltme:** Ünitede tek kalıp: "Kesinlik: kuram ya da hipotez" (küçük harf, tırnaksız) ve tek sözcük ("basamak" ya da "düzey").

### A6D-29 · KÜÇÜK · ad çiftlerinde kısa çizgi / uzun çizgi karışık
- **Açıklama:** Kişi adı çiftleri çoğu yerde uzun çizgiyle (–) yazılıyor: d25 "Michelson–Morley", "Frisch–Smith"; d26 "Pound–Rebka", "Hafele–Keating"; d52:405 "Bardeen–Carter–Hawking"; d53 "Ashok–Douglas", "Calabi–Yau". Aşağıdakiler kısa çizgiyle (-) yazılmış; aynı satırda iki biçim bile var:
  - d52: "Bekenstein-Hawking" (29, 203, 405, 179), "Bose-Einstein" (165, 186, 398), "Jackiw-Teitelboim" (156), "Stefan-Boltzmann" (77, 215)
  - d56: "Einstein-Rosen" (27, 80–83, 101, 214, 219, 301, 387), "Kruskal-Szekeres" (26, 286), "Morris-Thorne" (93), "Morris-Thorne-Yurtsever" (204), "Fuller-Wheeler", "Haggard-Rovelli", "Retter-Heller", "Maldacena-Susskind" (defter notları 383–388)
  - d31 defter notu (d31:431): "Hahn-Strassmann", "Meitner-Frisch"
  - d27 "Stefan-Boltzmann" (39, 47)
- **Önerilen düzeltme:** Kişi adı çiftlerinde "–" (d25/d26'nın biçimi).

### A6D-30 · KÜÇÜK · d26.json:120–121
- **Açıklama:** Peş peşe iki paragrafta aynı cümle tekrarlanıyor.
  - 120'nin sonu: "… kesin doğrulama sonraki ölçümlerden geldi."
  - 121'in başı: "Kesinlik sonraki ölçümlerden geldi."
- **Önerilen düzeltme:** 121'in ilk cümlesini silmek ya da "Bu doğrulama 1922'de geldi." gibi yeni bir bilgiyle değiştirmek.

### A6D-31 · KÜÇÜK · d31.json:91, d31.json:121, d32.json:158
- **Açıklama:** Anlatıcı yer yer birinci tekil şahısla konuşuyor. Ders öbür her yerde "sen" diye hitap ediyor, kendinden de "biz" diye söz ediyor (kılavuz "Sen diye hitap et").
  - d31:91: "30 Ekim 2026'da erişebildiğim en güncel resmî takvim budur."
  - d31:121: "Şebekeye bağlandığını gösteren resmî bir kayıt bulamadım"
  - d32:158: "daha yeni bir sınır bulamadım."
  - (İçerik konusu olan Akkuyu şebeke kaydı, kullanıcının bilinen askı listesinde; burada yalnız anlatım kipi bildiriliyor.)
- **Önerilen düzeltme:** "… erişilebilen en güncel resmî takvim budur", "… bir kayıt bulunamadı", "… daha yeni bir sınır yayımlanmadı/bulunamadı".

### A6D-32 · KÜÇÜK · d56.json:431
- **Açıklama:** Anlamca belirsiz ifade. "yüzde bir saniye", "saniyenin yüzde biri" yerine kullanılmış.
  - Metin: "Fark ≈ … ≈ 0,010 s, yani yaklaşık yüzde bir saniye."
- **Önerilen düzeltme:** "yani saniyenin yaklaşık yüzde biri."

### A6D-33 · KÜÇÜK · noktalama ve biçim (formül satırları ve çarpı işareti)
- **Açıklama:**
  - Noktalı virgülden önce boşluk var:
    - d52:214 "∝ 1 ÷ M² ;  ömür"
    - d56:198 "evdekinin süresi ÷ γ ;  γ = …"
  - Formül ifadelerinde iki boşluklu ayraç: d27:206, 221, 236; d28:213, 218, 223, 233; d50:188; d51:206; d52:214; d56:198.
  - Çarpı işaretinin çevresinde boşluk yok: d50 ve d51'in tamamında "1,78×10⁻²⁷", "5,96×10⁻²⁷"; öbür 12 ders "1,78 × 10⁻²⁷" yazıyor.
- **Önerilen düzeltme:** "M²;  ömür" yerine "M²; ömür" (boşluksuz, tek boşluk); d50/d51'de "× " çevresine boşluk.

### A6D-34 · KÜÇÜK · ders başlıkları (lesson "baslik")
- **Açıklama:** Başlıkların biçimi uygulamadaki öbür 44 dersle tutarlı: ana başlık + iki nokta + alt başlık, her sözcük büyük harfle. Kılavuzun ünite listesindeki adlarla uyuşuyorlar. Bölüm başlıklarında yazım hatası bulunmadı (kid bağımlı başlıklara dokunulması gerekmiyor). İki küçük tutarsızlık var:
  - d25:5 "Özel Görelilik: Işık Hızı, Zaman ve E=mc²" boşluksuz; dersin bölüm başlıkları (d25:170, 197) ve metni hep "E = mc²" yazıyor.
  - d54:5 "Enflasyon ve Çoklu Evren: …" başlığı ile ders metninin terimi uyumsuz (bkz. A6D-27).
- **Önerilen düzeltme:** d25 başlığında "E = mc²". d54 başlığı ders başlığıdır, bölüm başlığı değildir; kid'e bağlı değil. "Kozmik Şişme (Enflasyon) ve Çoklu Evren" düşünülebilir.

## Askıda

1. **"eşzamanlı / eşzamanlılık"** (d25:63, d25:353, d28 vb., 13 yer): TDK "eş zamanlı" yazar (`gts?ara=eş zamanlı` → madde var; "eşzamanlı" yok). Kılavuz ise d25 tanımında "eşzamanlılığın göreliliği" biçimini kullanıyor (YAZIM_KILAVUZU.md:117) ve uygulama genelinde 43 bitişik / 9 ayrı yazım var. Kılavuz biçimi öncelikli olduğu için bulgu yazılmadı; karar kullanıcıda.
2. **"kütleçekim"** TDK sözlüğünde yok ("kütle çekimi" de madde değil). Kılavuz "Kütleçekim" biçimini belirlediği için dokunulmadı. "kuantum kütleçekim" ↔ "kuantum kütleçekimi" seçimi (A6D-27) de kılavuzun başlık biçimine bağlı.
3. **QED okunuşu:** d29 "QED'in", "QED'i", "QED'le" (sözcük gibi "ked" okunuşu); d53:30 "QED'de" iki okunuşa da uyuyor. Ders içinde tutarlı; Türkçe harf okunuşu ("ku-e-de") seçilirse "QED'nin, QED'yi, QED'yle" olmalı. Hangisinin hedeflendiği kaynaktan doğrulanamadı.
4. **"on'un kuvveti"** (d50:55, d51:101): Sayı adına kesme konmaz, ama "onun" belirsizliğini önlemek için bilinçli yazılmış olabilir. Kural ihlali tartışmalı.
5. **"Aysız bir gecede"** (d55:192): "Ay"dan türemiş sıfatın büyük harfle yazılması; TDK'de bu türev için açık bir örnek bulunamadı.
6. **"akıl almaz farklı ölçeklerde"** (d26:133), **"akıl almaz küçüktür"** (d26:190): Sıfatın "derecede" olmadan zarf olarak kullanılması. Öbür yerlerde "akıl almaz derecede/ölçüde" yazılıyor (d28:179, d31:20). Yanlış olduğu kesin değil.
7. **"Atlantik aşırı uçuş"** (d31:205): "Okyanus aşırı" örneğine benzer bir kuruluş; TDK'de doğrulanamadı.
8. **Alan dışı not (kaynak kuralı):** İki dersin kaynak listesinde IPFS kopyası var.
   - d31.json:537 "Wikipedia, Uranium (IPFS yansısı)"
   - d56.json:481 "Wikipedia (IPFS kopyası), GRB 060614"
   - ORTAK.md "Kopya sitelere gitme (IPFS kopyaları …)" diyor; yazım alanının dışında olduğu için bulgu sayılmadı. Kaynak/bağlantı alanına iletilmeli.
