# Alan 6 — Türkçe yazım, Parça C (Urania v39 denetimi, 2026-10-30)

Kapsam: d46 d47 d7 d48 d49 d57 d58 d8 d17 d20 d13 d18 d30 d33 (ders sırasında 31–44) ve sınav soruları. d7, d8, d13, d17 ve d18'in kendi `dNN_sinav.json` dosyası yok. Bu derslerin soruları veri/sinavlar.json'dan okundu: evren-01…04 d7'nin, evren-05…12 d8 ile d17'nin, gezegen_yasam-01…12 d13 ile d18'in.

## Okunan dosyalar

Okuma yöntemi: Her dNN.json ve dNN_sinav.json dosyasındaki bütün metin alanları, kaynak JSON satır numaraları korunarak düz metne döküldü (`a6c/duz.py`). Başlık, özet, paragraf, örnek, akılda, formül, anahtar sayı, sözlük, defter notu, soru/cevap, kaynak adı ve sınav alanlarının hepsi dökümde var. Yalnız url / kid / id alanları dökülmedi. Bu dökümler Read ile sayfa sayfa okundu. Yükü bölmek için dört alt ajan kullanıldı; her biri kendi dosyalarını baştan sona okuduğunu ve okumadığı aralık kalmadığını bildirdi. Bulguları ben teyit ettim: KESİN olanların tamamı grep ile metinde doğrulandı.

| dosya | satır | tamamı |
|---|---|---|
| arastirma/dersler_v2/YAZIM_KILAVUZU.md | 196 | evet |
| d46.json + d46_sinav.json | 623 + 58 | evet (ben) |
| d47.json + d47_sinav.json | 644 + 58 | evet (ben) |
| d7.json + veri/sinavlar.json evren-01…04 | 726 | evet (ben) |
| d20.json + d20_sinav.json | 673 + 58 | evet (ben) |
| d48.json + d48_sinav.json | 632 + 58 | evet (alt ajan 1) |
| d49.json + d49_sinav.json | 674 + 58 | evet (alt ajan 1) |
| d57.json + d57_sinav.json | 587 + 58 | evet (alt ajan 1) |
| d58.json + d58_sinav.json | 650 + 58 | evet (alt ajan 2) |
| d8.json, d17.json + sinavlar.json evren-05…12 | 751, 806 | evet (alt ajan 2) |
| d13.json, d18.json | 680, 794 | evet (alt ajan 3) |
| sinavlar.json gezegen_yasam-01…12 (d13/d18 soruları) | — | evet (ben) |
| d30.json + d30_sinav.json | 577 + 58 | evet (alt ajan 4) |
| d33.json + d33_sinav.json | 592 + 58 | evet (alt ajan 4) |
| veri/dersler.json | — | yalnız grep ile tarandı (terim dağılımı için), okunmadı |

## Yöntem

- **Otomatik taramalar.** Geçici klasör: `scratchpad/denetim/a6c/`. Kullanılan betikler `kesme.py`, `uyum.py`, `terim.py` ve `ctx.py`.
  - Sayıdan sonra gelen bütün ekler denetlendi. Sayının Türkçe okunuşunun son ünlüsüne ve sert/yumuşak ünsüze göre ünlü uyumuna bakıldı: 525 farklı biçimde **0 hata**.
  - Kısaltma ve simgelere gelen ekler (K, M☉, Sgr A*, AB, MeV …) elle gözden geçirildi.
  - Terim ikilikleri ders başına ve dersler.json bütününde sayıldı.
  - Ayrıca şunlar arandı: art arda tekrarlanan sözcük, "mi"nin bitişik yazılması, çift boşluk, noktalama öncesi boşluk.
- **Kurallar.** TDK yazım kuralları (kesme işareti, kısaltmalar, düzeltme işareti) tdk.gov.tr'den alındı. Sözcük yazımları sozluk.gov.tr/gts ile tek tek sorgulandı. Sorgulanan sözcükler: dâhil, teleskop (-bu), el yazması, yarım küre, gök cismi, uluslararası, kıtalararası (yok), yıldızlararası (yok), yarımküre (yok), elyazması (yok), senkrotron/sinkrotron (ikisi de yok).
  - Kesme işareti: https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/ — "Özel adlara getirilen yapım ekleri, çokluk eki ve bunlardan sonra gelen diğer ekler kesmeyle ayrılmaz"; "Kurum, kuruluş, kurul, birleşim, oturum ve iş yeri adlarına gelen ekler kesmeyle ayrılmaz (Türk Dil Kurumundan)".
  - Kısaltmalar: https://tdk.gov.tr/icerik/yazim-kurallari/kisaltmalar/ — büyük harfli kısaltmalarda "son harfin okunuşu esas alınır"; küçük harfli kısaltmalarda kelimenin okunuşu esas alınır ("cm'yi, kg'dan, mm'den").
  - Düzeltme işareti: https://tdk.gov.tr/icerik/yazim-kurallari/duzeltme-isareti/ — "hal (sebze, meyve vb. satılan yer), hâl (durum, vaziyet)".
  - Büyük harfler: https://tdk.gov.tr/icerik/yazim-kurallari/buyuk-harflerin-kullanildigi-yerler/ — ay adları yalnız belirli bir tarih bildirirken büyük harfle yazılır.
- **Depo.** Depoya hiçbir şey yazılmadı ve depo betiği çalıştırılmadı.

## Bulgular

Bu alanın bulguları yazım bulgusudur, varsayılan önem KÜÇÜK'tür. Anlamı tersine çeviren, sınavda doğru şıkkı bozan ya da soru ile cevap arasında sayı çelişkisi yaratanlar ÖNEMLİ sayıldı.

### A6C-01 · ÖNEMLİ · d13.json:252, 433, 434
- **Açıklama:** Güneş'in yaşanabilir bölgesinin dış sınırı aynı derste iki farklı sayıyla geçiyor.
  - Anahtar sayı (252) ve soru (433) "0,99–1,67 AB" diyor; soru açıkça "(Güneş için 0,99–1,67 AB al.)" diye yazıyor.
  - Aynı sorunun cevabı (434) 1,70 ile hesaplıyor: "1,70 × 2 = 3,4 AB".
  - Paragraf 102, örnek 108 ve defter notu 407 de "0,99 ile 1,70 AB" diyor.
  - Okur sorunun verdiği sayıyla hesap yaparsa cevaptan farklı sonuç bulur.
- **Kanıt:** `grep -n "1,67\|1,70" arastirma/dersler_v2/d13.json`. Alt ajan 3 satırları okudu; ben 433/434 çelişkisini doğruladım.
- **Önerilen düzeltme:** Kaynağa (Kopparapu 2013) bakılarak tek bir değer seçilmeli ve soru, cevap ve anahtar sayı buna eşitlenmeli. Hangi değerin doğru olduğu bu denetimin kapsamı dışında; o kısım Askıda.

### A6C-02 · ÖNEMLİ · d48.json:169
- **Açıklama:** Yanlış ek anlamı tersine çeviriyor.
- **Kanıt:** "…kara delik, galaksisi ona izin verdiği kadar büyür, galaksi de kara deliği izin verdiği kadar yıldız yapar." Metin grep ile doğrulandı.
- **Önerilen düzeltme:** "…galaksi de kara deliğin izin verdiği kadar yıldız yapar." Sıfat-fiil cümleciğinin öznesi ilgi hâli alır. İlk yarıdaki "galaksisi"nin "galaksisinin" olması önerisi Askıda.

### A6C-03 · ÖNEMLİ · d57_sinav.json:22
- **Açıklama:** Sınavın doğru şıkkı yarım kalmış. "tayfı … ideal bir kara cisim" denince tayf ile cisim eşitlenmiş oluyor.
- **Kanıt:** "…toz topaklarının toplamıyla elde edilemeyecek kadar ideal bir kara cisim". Dersteki karşılığı (d57.json:460) "…ideal bir kara cisim tayfı" diye bitiyor.
- **Önerilen düzeltme:** Şıkkın sonuna "tayfı" eklenmeli.

### A6C-04 · ÖNEMLİ · d58.json:104
- **Açıklama:** Aletin adı yanlış çevrilmiş. "Differential Microwave Radiometer" (DMR) "farklı mikrodalga radyometresi" olmuş. Aynı paragraf aletin iki yön arasındaki farkı ölçtüğünü anlattığı için ad metinle çelişiyor.
- **Kanıt:** "…George Smoot'un sorumlu olduğu DMR'ydi: farklı mikrodalga radyometresi." Metin grep ile doğrulandı.
- **Önerilen düzeltme:** "diferansiyel (fark ölçen) mikrodalga radyometresi".

### A6C-05 · KÜÇÜK · d47.json:14 (başlık: kid bağımlı)
- **Açıklama:** Bölüm başlığı "Saman yolu: gökteki ışık kuşağı". Ders aynı adı 54 kez "Samanyolu" yazıyor ve korpusta "Saman Yolu" biçimi yok. 18. satırdaki "saman yolu anlamına gelen adlar" ise sözcük anlamı veriyor, o doğru.
- **Önerilen düzeltme:** "Samanyolu: gökteki ışık kuşağı". Başlık değişirse araclar/bolum_esle.py eşlemesi ve tekrar kartları etkilenir, karar koordinatörde.

### A6C-06 · KÜÇÜK · d49.json:13 (başlık: kid bağımlı) + dağınık "hal-" yazımları
- **Açıklama:** "Durum" anlamındaki sözcük düzeltme işareti olmadan yazılmış. Aynı derslerde ve korpusta "hâl-" biçimi çoğunlukta (hâlde 62, hâlinde 44 …). Şapkasız geçişler:
  - Başlık: d49:13 "Galaksiler de sürü halinde yaşar".
  - d49: 19, 104, 173, 185.
  - d47: 29, 52, 64, 192, 478.
  - d7: 72, 126, 128, 163.
  - d8: 84, 130, 166, 167, 172 ("O halde"), 266, 550.
  - d17: 118.
  - d13: 104, 385, 428.
  - d33: 1 geçiş.
  - Dikkat: "hale" sözcüğünün galaktik hale anlamındaki kullanımları doğrudur, bu listeye girmedi.
- **Kural:** TDK düzeltme işareti: "hal … hâl (durum, vaziyet)".
- **Önerilen düzeltme:** hâlinde / hâle / hâlde / hâline / hâliyle.

### A6C-07 · KÜÇÜK · kurum adlarına kesme (tüm dersler)
- **Açıklama:** Kurum, kuruluş ve iş yeri adlarına gelen ekler kesmeyle ayrılmış. TDK'ye göre ayrılmaz. Geçişler:
  - d46: 140, 178 ("Cambridge Üniversitesi'nden", "Portsmouth Üniversitesi'nden").
  - d47: 40, 125, 178.
  - d7: 16 ("Smithsonian Enstitüsü'nde"), 28, 74, 97 ("Lowell Gözlemevi'nde"), 100, 129, 143.
  - d48: 180.
  - d49: 51, 144, 171, 186.
  - d57: 35, 36, 52.
  - d58: 26, 40, 51, 158, 208.
  - d8: 114, 117, 128, 146.
  - d17: 75, 78, 143 (2 kez), 165, 191.
  - d20: 52, 115.
  - d13: 18, 19, 31, 60, 77, 115, 140, 141, 166.
  - d18: 40, 133, 145, 160, 175, 176.
  - Bunlar listeye alınmadı: "Sovyetler Birliği'nde" (devlet adı, kesme doğru) ve teleskop/uydu adları.
- **Kural:** TDK kesme işareti: "Kurum, kuruluş … ve iş yeri adlarına gelen ekler kesmeyle ayrılmaz (Türk Dil Kurumundan)".
- **Önerilen düzeltme:** "Cambridge Üniversitesinden", "Lowell Gözlemevinde" … Korpus genelinde aynı alışkanlık olduğu için toplu karar gerekir.

### A6C-08 · KÜÇÜK · "dahil" → "dâhil"
- **Geçişler:** d47:63, d7:114, d48:258, d49:520, d57:46, 61, 110, d17:165 ("dahildir"), d20:6, d13:116, d18:107. Korpusta 29 geçişin hepsi "dahil".
- **Kanıt:** sozluk.gov.tr gts → madde "dâhil".
- **Önerilen düzeltme:** "dâhil". Korpus genelinde toplu düzeltme önerilir.

### A6C-09 · KÜÇÜK · "yarımküre" → "yarım küre"
- **Geçişler:**
  - d47:18, 205 ("kuzey yarımkürede")
  - d47_sinav.json:7
  - d7:54, 57
  - d7:83 ("Güney Yarımküre'de"; burada büyük harf ve kesme de gereksiz)
  - d13:196
  - d48_sinav.json:51 ("güney yarıküresinden"; burada "yarım" da yanlış)
- **Kanıt:** sozluk.gov.tr: "yarım küre" maddesi var; "yarımküre" ve "yarıküre" yok.
- **Önerilen düzeltme:** "kuzey yarım kürede", "güney yarım küreden".

### A6C-10 · KÜÇÜK · ay adları (belirli tarih bildirmeyen)
- **Açıklama:** Tarih bildirmeyen ay adları büyük harfle ve kesmeyle yazılmış. Geçişler:
  - d46:192 "en iyi Mayıs'ta gözlendiğini"
  - d8:165 ve 531 "Temmuz'da"
  - d17:92 "en iyi Kasım'da"
  - d13:168 "en iyi Kasım'da"
  - d48:198 "en kolay Aralık'ta"
  - d48:195 "Mart–Temmuz arasında"
- **Kural:** TDK büyük harfler kuralı: ay adları yalnız belirli bir tarih bildirirken büyük harfle yazılır. Aynı dersler doğru örnekler de içeriyor: d7:160 "mart ile haziran", d13:153 "eylül, ekim ve kasım akşamlarında".
- **Önerilen düzeltme:** "mayısta", "temmuzda", "kasımda", "aralıkta", "mart–temmuz". d8'deki kozmik takvim kullanımları ("Eylül ortasına", "Ocak'ın son haftasında") Askıda.

### A6C-11 · KÜÇÜK · noktalı virgülden sonra büyük harf
- **Geçişler:**
  - d46:158 "…yaklaşık 100 olay biliniyor; Onları bulan araçlar…" → "; onları"
  - d20:70 "…oranı yaklaşık 380 verir; Kaynakların verdiği…" → "; kaynakların"

### A6C-12 · KÜÇÜK · eksik / yanlış ek, bozuk cümle (doğrulanmış)
- d13:89 "tüm gezegenlerin ancak yaklaşık %1'i olduklarını düşünülür" → "oldukları düşünülür".
- d49:16 "geniş galaksi yaprakların duvar olduğu" → "yapraklarının".
- d57:88 "kuasarların ve radyo galaksilerin yalnızca…" → "radyo galaksilerinin".
- d30:332 (sözlük, kalorik): "ısının sanıldığı ağırlıksız, görünmez akışkan". Burada bir öge düşmüş, doğrusu "ısının öyle olduğu sanılan" ya da "ısı sanılan".

### A6C-13 · KÜÇÜK · sözlükte olmayan / yanlış birleşik yazımlar
- d57:124 "gökcisimlerinde" ve d18:375 (sözlük tanımı) "gökcismi" → "gök cismi". sozluk.gov.tr'de madde "gök cismi"; aynı dersler başka yerlerde ayrı yazıyor, örneğin d18:425 "gök cisminden".
- d18:16 "Bilimkurgunun" → "Bilim kurgunun".
- d20:16, 66, 77 "elyazması / elyazmalarında" → "el yazması". sozluk.gov.tr'de madde "el yazması", "elyazması" yok. Aynı ders 157. satırda "el yazması" diye ayrı yazıyor.
- d33:129 "radyo teleskopuyla" → "teleskobuyla". sozluk.gov.tr: teleskop, -bu. Korpusun geri kalanı hep "teleskobu".
- d58:91 "Güneş eşzamanlı bir yörünge" → "eş zamanlı". Alt ajan 2 sozluk.gov.tr'yi sorguladı. Not: YAZIM_KILAVUZU.md'nin kendisi de d23 tanımında "Güneş eşzamanlı" yazıyor.

### A6C-14 · KÜÇÜK · kesme işareti ve özel adlara gelen yapım/çokluk ekleri
- d47:16 "Ay'sız bir yaz gecesi" → "aysız". TDK'ye göre özel ada gelen yapım eki kesmeyle ayrılmaz. sozluk.gov.tr'de madde küçük harfle "aysız" (alt ajan 2 sorguladı). Aynı nedenle büyük harfli "Aysız" geçişleri de "aysız" olmalı: d7:27, 85; d17:92, 99; d20:202.
- d30:155 "Cambridge'li gökbilimci" → "Cambridgeli" (yapım eki).
- d7:143 "Tip 1 Seyfert'lerin", "Seyfert'tir" → "Seyfertlerin". TDK'ye göre çokluk eki ve ardından gelen ekler kesmeyle ayrılmaz. "Seyfert'tir" bildirme eki olduğu için kesmeli kalabilir; düzeltilecek olan çokluklu biçim.

### A6C-15 · KÜÇÜK · simge/kısaltma eklerinde ders içi ve dersler arası tutarsızlık
- d46:20 "10⁵ M☉'ten" ↔ aynı derste 119, 121, 480 "M☉'den". Okunuş "Güneş kütlesinden" olduğu için doğrusu "M☉'den".
- d7:197, 235 "Sgr A*'nın" ↔ d46:52, 59, 66, 90, 191 "Sgr A*'ın", d46:17, 96 "A*'ı", d46:50, 456 "A*'a". okunus.js "Sgr A*"yı "… yıldız" diye okuyor (okunus.js:105). Doğrusu "Sgr A*'ın".
- d30:58 "kozmik arka planın 2,725 K'inde" ↔ d58 ve d30'daki "K'nin", "K'ye" biçimleri. TDK büyük harfli kısaltma kuralına göre son harf ("ke") esas alınır: "K'sinde".
- d58:52 "APS ve PBS'in sayfaları" → "PBS'nin" (son harf S = "se").
- d58_sinav.json:26 "BOOMERanG'in" → "BOOMERanG'ın". Ad sözcük gibi, "bumerang" diye okunur.
- d33:157 "Illinois'deki" → "Illinois'daki". Okunuş "ilinoy", son ünlü kalın.

### A6C-16 · KÜÇÜK · aynı terimin farklı yazılışı
- **Sgr A* / Yay A*.**
  - d46: 17 "Sgr A*", 1 "Yay A*" (başlık d46:50 "Yay A*'a daha yakından: S2'den S301'e" — başlık: kid bağımlı).
  - d7: 6 "Sgr A*", 4 "Yay A*". 43. satırda ikisi birlikte tanıtılmış, sonra karışık kullanılıyor.
  - d47: yalnız "Yay A*" (3).
  - d48: "Sgr A*".
  - Korpus 61 "Sgr A*", 8 "Yay A*". Kılavuz d46 tanımında "Yay A*", d16 tanımında "Sgr A*" yazıyor.
- **X-ışını / X ışını.** d7 aynı ders içinde ikisini de kullanıyor: 42 "X ışınlarında" ↔ 158 ve 490 "X-ışını". d46 ve d48 "X ışını", d47, d49 ve d17 "X-ışını". Korpus 37/78.
- **Hubble–Lemaître (uzun çizgi) / Hubble-Lemaître (kısa çizgi).** d17'de 11 kısa, 1 uzun; d8'de 6 kısa. d48, d49 ve d57 uzun çizgi kullanıyor. d57:263 ve 419 "Alpher-Herman" da aynı türden: ders "Hubble–Lemaître" ve "Hartle–Hawking" yazarken kısa çizgi kullanıyor.
- **Zeldoviç / Zeldovich.** d46:17, d48, d57 ve d58 (6 geçiş) "Zeldoviç"; d49 (örneğin 87) ve d58'in bir yeri "Zeldovich".
- **Orion Kolu / Kahraman kolu.**
  - d47:124: "Orion Kolu'nun" ↔ aynı paragrafta "Kahraman kolu".
  - d47:96: "Kahraman (Perseus) kolu ile Kalkan–Erboğa kolu … Yay–Karina koludur".
  - d7:40: "Yay kolundan … Orion Kolu'nda".
  - Kol adlarında büyük/küçük harf tutarsız.
- **Gould Kuşağı / Gould halkası.** d47:124 "Gould Kuşağı" ↔ d47:132 (akılda) "Gould halkasında".
- **Yay Cüce Galaksisi / Yay Cüce Küresel Galaksisi.** d7:128 ve 313 "Yay Cüce Küresel Galaksisi" ↔ d7:130 ve 133 ile d47 "Yay Cüce Galaksisi". İngilizce "Spheroidal" sözcüğünün karşılığı "küremsi"dir; "küresel", "globular" anlamına gelir ve küresel küme ile karıştırılır.
- **AT 2022cmc / AT 2024tvd.** d46:158'de "AT2022cmc" bitişik yazılmış; aynı paragraf ve 157. satır "AT 2024tvd", "AT 2018hyz", "AT 2022dbl" diye boşluklu yazıyor.
- **senkrotron / sinkrotron.** d48 "senkrotron" yazıyor (paragraf 106, akılda 110, sözlük terimi 382, defter 454); d49:76 ve d33 (9 geçiş) "sinkrotron". d48'in sözlük terimi ortak sözlüğe gidiyor, bu yüzden d33/d49'daki geçişlerde altı noktalı eşleşme kaçabilir.
- **binlik nokta.**
  - d20:130 ve 289 "1018 yıldız" ↔ 93 ve 271 "1.022 yıldız".
  - d20:121 "6378,1 km" ↔ 116 ve 284 "6.378,1 km".
  - d49'da "5.550" ile "1300", "8000" bir arada.
  - Kılavuz: "binlik nokta (1.988)".

### A6C-17 · KÜÇÜK · sözlük terimlerinin büyük harfle başlaması (kılavuza aykırı)
- **Açıklama:** Kılavuzun v3 bölümü, satır 87: "terimi metinde geçtiği yalın biçimiyle yaz ('kırmızı dev', 'anakol')". Bu kurala uymayan dersler:
  - d7: 17 terimin 16'sı büyük harfle (Galaksi, Hale, Kuasar, Üstküme …).
  - d8: 21/22 (Şişme, Plazma, Döteryum …).
  - d13: 17/17 (Ötegezegen, Astrometri, Koronagraf …).
  - d17: 14/23; aynı sözlükte "maviye kayma", "özel hız" küçük harfle, yani karışık.
  - d18: 13/19.
  - Karşılaştırma: d46, d47, d20, d30 ve d33'te büyük harf yalnız özel adlarda.
  - Kanıt: `python` ile `j["sozluk"]` tarandı.
- **Önerilen düzeltme:** Terimler küçük harfe çevrilmeli, özel adlar ("Büyük Patlama", "Olbers paradoksu") korunmalı; kid alanına dokunulmamalı. Altı noktalı eşleme büyük/küçük harfe duyarsızsa sorun yalnız görünüm sorunudur.

### A6C-18 · KÜÇÜK · noktalama
- **"ve"den önce virgül:** d49:207 "gittiğini, ve 321 milyon…" ve d30:205 "henüz kesin değil, ve evrenin sonu…" → virgüller kalkmalı.
- **Noktalı virgülden önce boşluk:** d30:261 "4,41 J/kalori (1845) ; bugün" → "(1845); bugün".
- **Cümle başı küçük harf:**
  - d49:158: "Boşlukların … büyüktür. van de Weygaert'in" → "Van de Weygaert'in".
  - d47:19: "el-Biruni onu sayısız…" → "El-Biruni". d20 cümle başında hep "El-" yazıyor.

## Askıda

Bunlar kanıtlanamadı ya da karar gerektiriyor:

- **Yabancı adların okunuşa göre aldığı ekler.** Hepsinde okunuş tartışmaya açık:
  - "Slipher'in": d7:97, 98, 337, 520; d17:363. Okunuş "slayfır" ise "Slipher'ın" olur.
  - d57:287 "Peebles'in" ↔ d58 "Peebles'ın".
  - d48:132 ve 507 "IceCube'ün".
  - d30:42, 262, 332 "Joule'ün/Joule'den". TDK birim adı "jul" esas alınırsa "Joule'un/Joule'dan" olur.
- **Birim simgelerine gelen ekler.**
  - d33:158 "70 MeV'lik" ve d48:132 "TeV'lik": TDK büyük harfli kısaltma kuralına göre son harf ("ve") esas alınırsa doğrudur; birim tam okunursa "MeV'luk" olur.
  - d33:176 "μT'dir" ve 361 "T'dir": bu kurala göre doğru.
  - d33:83 "MR'ın": harf okunuşuyla "MR'nin" olur.
  - Karma büyük/küçük harfli simgeler için TDK'de açık bir örnek bulamadım. okunus.js sesli okumada eki zaten yeniden kuruyor.
- **d48:115 "kıtalar arası".** "kıtalararası" sözcüğü sozluk.gov.tr'de yok; bitişik yazım kanıtlanamadı. d47:157 "yıldızlar arası aralık" da aynı durumda.
- **d18:94 "22.'siydi"** → "22'ncisiydi" önerisi; TDK'de açık bir yasak bulunamadı.
- **d18:68 "sıcak severler"**: "sıcaksever" sözcüğü sözlükte yok.
- **d33:132 başlığı (kid bağımlı) ve 128. satırdaki "masa üstü"**: "masaüstü" olabilir.
- **Ay adları:**
  - d8:179, 180, 183 ve 531'deki kozmik takvim ay adları bilinçli bir tarih biçimi olabilir.
  - d20:201 "1923 Ekim'inin 5'ini 6'sına" kalıbı için kesin bir kural bulunamadı.
- **Yapı ya da çeviri kokusu (anlam çıkıyor, düzeltme önerisi zevke yakın):**
  - d8:14 ve sinavlar.json evren-05: "tek bir noktanın çevresine doğru patlaması".
  - d8:131 ve d47:74: "metal fakiri".
  - d17:191: "soluk soluk parlar".
  - d30:105: "Max Planck'ın Boltzmann'ı okuyuşu yerleştirdi".
  - d30:156: "…parlatabileceğiydi".
  - d30:17: art arda yüklemsiz cümleler.
  - d33:142: "dalgadan yük sallanması geri elde eder".
  - d33:126: "manyetik yoluyla".
  - d57:48: "topluluğunu ve … Sefeid olduğunu".
  - d57:216: "zaman biriminden".
  - d57:406: "kuantum kütleçekim gerektiren".
  - d58:512 ve d58_sinav.json:35: "Tohum dalgalanmaların".
  - d48:428: "bunun beklenenden".
  - d18:49 ve 415: hem…hem ile bağlanan öğeler aynı yapıda değil.
  - d20:145: "dev kuyruklu bir kuyruklu yıldız".
- **Ders içi ikilikler (hangi biçimin seçileceği koordinatörün kararı):**
  - d58:182 ↔ 188: "kütleçekiminin" / "kütleçekimin".
  - d30:168 ↔ 5, 122, 167: "güneş ışığı" / "Güneş ışığı".
  - d18:83 ve 474: "Güneş rüzgârı ve güneş fırtınaları".
  - d18:26, 216 "Dresser Formasyonu" ↔ d18:94 "Bright Angel formasyonu".
  - d17'de "Sefeid" büyük harfle ama eksiz/kesmesiz yazılmış ("Sefeidini", "Sefeiddir").
  - d17:273 "H₀" ↔ dersin geri kalanında "H0".
  - d17:548 defter notunda İngilizce "vs".
- **Kesme işareti ve özel ad yazımı:**
  - d18:57 ve 172, d17:48, d47:41: virgüllü "ve"/"ya da"; öbür noktalama bulgularıyla aynı tür ama üslup payı var.
  - d47:18 "Balkanların": TDK'nin çokluk eki kuralına göre doğru olabilir.
  - d49:186 "Esra Bulbul'un": kişinin kendi tercih ettiği yazım doğrulanamadı.
- **Yazım dışı (Alan 6'nın kapsamı dışında):**
  - d49:15, 39, 52, 128 ve 206'da "d7'de göreceğin / tanıyacağın" deniyor. Ünite sırasında d7 bu dersten önce geliyor; bir sıra tutarlılığı sorunu.
  - d13:62'de mikromercek paragrafının arasına doğrudan görüntüleme cümlesi girmiş; bu yüzden sondaki "bu yolla %3–4" yanlış yönteme bağlanabiliyor.
  - d30:234'teki formül notu "log doğal logaritma" derken d30:108'deki örnek on tabanlı logaritmayla anlatılıyor (log 1000 = 3).

Bilinen ve yeni sayılmayan: d49 "birkaç %" v39'da düzeltilmişti.
