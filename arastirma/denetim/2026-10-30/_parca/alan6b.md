# Alan 6 — Türkçe yazım, PARÇA B (Urania v39 denetimi, 2026-10-30)

Kapsam: sıradaki 16–30. dersler — d38 d39 d40 d41 d19 d42 d43 d23 d4 d14 d5 d15 d6 d45 d16 — ve bunların sınav soruları.

## Okunan dosyalar
| dosya | satır | tamamı |
|---|---|---|
| ORTAK.md (geçici klasör) | 62 | evet |
| arastirma/dersler_v2/YAZIM_KILAVUZU.md | 196 | evet (Claude baştan sona okudu) |
| d38.json / d38_sinav.json | 606 / 58 | evet* |
| d39.json / d39_sinav.json | 538 / 57 | evet* |
| d40.json / d40_sinav.json | 559 / 57 | evet* |
| d41.json / d41_sinav.json | 615 / 57 | evet* |
| d19.json (sınav dosyası yok) | 864 | evet* |
| d42.json / d42_sinav.json | 610 / 57 | evet* |
| d43.json / d43_sinav.json | 628 / 57 | evet* |
| d23.json / d23_sinav.json | 680 / 58 | evet* |
| d4.json (sınav dosyası yok) | 714 | evet* |
| d14.json (sınav dosyası yok) | 648 | evet* |
| d5.json (sınav dosyası yok) | 738 | evet* |
| d15.json (sınav dosyası yok) | 897 | evet* |
| d6.json (sınav dosyası yok) | 693 | evet* |
| d45.json / d45_sinav.json | 652 / 57 | evet* |
| d16.json (sınav dosyası yok) | 741 | evet* |
| veri/sinavlar.json — d19, d4, d14, d5, d15, d6, d16 dersine bağlı 15 soru (satır 922–1346) | 105 satırlık döküm | evet (Claude okudu) |

\* **Okuma yöntemi (dürüst not):** Toplam ~1,2 MB ders metni tek bağlama sığmadığı için 15 dersin tam okuması 5 okuma yardımcısına bölündü (her biri 3 ders + sınav dosyaları). Beşi de kendi dosyalarını Read ile 1. satırdan son satıra kadar okuduğunu bildirdi ve atlanan aralık bildirmedi. Kaynak URL'leri yazım için okunmadı; kaynak "ad" alanları okundu. Claude ise şunları yaptı: tüm dosyalarda otomatik taramalar (aşağıda), yardımcıların her bulgusunu grep ile metinde yeniden doğrulama, TDK sözlüğü ve kurallarıyla karşılaştırma. Bu karşılaştırmada iki yardımcı bulgusu TDK'ye aykırı çıktı ve düşürüldü ("karbondioksit", "gök taşı" — bkz. A6B-27).

## Yöntem
- Geçici betikler: `…/scratchpad/denetim/a6b/oto.py` ve `terim.py`. Depoya hiçbir şey yazılmadı.
  - Kesme işaretinden sonra gelen eklerin ünlü uyumu ve sertleşmesi denetlendi. Sayılarda son okunan sözcüğe bakıldı (bir/üç/altı/on/bin/milyon …). Özel ad ve kısaltmalarda okunuş elle kontrol edildi.
  - Ayrıca tarandı: tekrarlanan sözcük, çift boşluk, noktalama öncesi/sonrası boşluk, cümle başında küçük harf, İngilizce ondalık biçimi, birleşik sözcük kalıpları (herşey, bir çok, yada …), "mi" ekinin bitişik yazılışı, "ki" kullanımı, tarih bildirmeyen ay adları, hal/hâl, dahil/dâhil, binlik ayırıcı.
  - Terim tutarlılığı ders ders sayıldı. Sayım yalnız metin alanlarında yapıldı (URL ve kaynakça hariç). Bütün dersler için de veri/dersler.json'da sayıldı.
- TDK karşılaştırması iki yerden yapıldı:
  - Kural sayfaları: https://tdk.gov.tr/icerik/yazim-kurallari/buyuk-harflerin-kullanildigi-yerler/ ve https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/
  - Güncel Türkçe Sözlük (GTS) sorgusu: `curl -s "https://sozluk.gov.tr/gts?ara=<sözcük>"`. Sonuçlar:
    - "gün dönümü" → madde var; "gündönümü" → "Sonuç bulunamadı".
    - "yarım küre" → var; "yarıküre" ve "yarımküre" → yok.
    - "dahil" → madde "dâhil".
    - "hal" → çözme / pazar yeri / tahttan indirme; "hâl" → durum.
    - "teleskop" → `"taki":"bu"` (teleskobu).
    - "çiftlik" → "Tarım yapılan, hayvan yetiştirilen…".
    - "karbondioksit" → var (bitişik); "karbon dioksit" → yok.
    - "gök taşı" → var (ayrı); "göktaşı" → yok.
- Sesli okuma etkisi şu komutla denendi: `node -e "const o=require('C:/Users/Kaan/urania/okunus.js'); …o.okunus(s)"`. Çıktı A6B-02'de.
- Uygulama sekme adları index.html:27–32'den alındı. Algol'ün hangi sekmede gösterildiği gozlem.js:91, 196 ve 1203'ten (`U.modul('gok', …)`) doğrulandı.

## Bulgular

### A6B-01 · ÖNEMLİ · d15.json:192
- Açıklama: Ders, okuru uygulamada var olmayan bir sekmeye gönderiyor. Akılda notu: "kararmalarını uygulamanın Gözlem sekmesinden takip et". Uygulamada "Gözlem" adlı sekme yok; Algol'ün kararmaları Gökyüzü sekmesinde. Aynı bölüm (d15.json:184) doğru yazıyor: "Urania'nın Gökyüzü sekmesindeki “Yaklaşan olaylar” bölümü".
- Kanıt:
  - index.html:27–32 sekmeleri sıralıyor: Gökyüzü, Deneyler, Dersler, Defter, Hesap, Haberler.
  - gozlem.js:91 "Saati belli olaylar (uydu geçişi, Algol, örtme) kendi saatinde"; gozlem.js:1203 `U.modul('gok', …)`.
  - `grep -o "Gözlem sekme" d15.json` → 192. satır.
- Önerilen düzeltme: "uygulamanın Gökyüzü sekmesinden takip et".

### A6B-02 · ÖNEMLİ · d45.json:127, 133, 135, 155, 156, 160, 163, 183, 190, 211 ↔ 289, 313, 325, 435, 451, 452, 508
- Açıklama: Aynı katalog adları aynı derste bir yerde tire (-), bir yerde eksi işareti (−) ile yazılmış. Bu yalnız görünüm farkı değil: sesli okuyucu eksi işaretini "eksi" diye okuyor, tireyi atlıyor. Aynı cisim iki farklı adla seslendiriliyor.
  - J0952-0607 (127, 133, 135) ↔ J0952−0607 (289, 451)
  - SGR 1806-20 (155, 156, 160, 163, 211) ↔ SGR 1806−20 (313, 452, 508)
  - J0737-3039 (183, 190) ↔ J0737−3039 (325, 435)
  - Katalog adındaki işaret dik açıklığın işaretidir; tireli yazımda bu işaret seste tamamen kayboluyor.
- Kanıt: `node -e "const o=require('C:/Users/Kaan/urania/okunus.js'); …"` çıktısı:
  - `SGR 1806−20 patladı.  =>  SGR 1806 eksi 20 patladı.`
  - `SGR 1806-20 patladı.  =>  SGR 1806 20 patladı.`
  - `J0737−3039 çift atarcası  =>  J0737 eksi 3039 çift atarcası`
  - `J0737-3039 çift atarcası  =>  J0737 3039 çift atarcası`
  - Aynı derste yalnız tireyle yazılan adlar da var: J1748-2446, J0437-4715, XTE J1739-285, RX J1856.5-3754.
- Önerilen düzeltme: Derste tek biçim seçilmeli. Okunuşun tutarlı olması için katalog adlarının hepsinde ya "−" ya "-" kullanılmalı; dersler arası bir karar da gerekiyor.

### A6B-03 · KÜÇÜK · d15.json:78, d15.json:186
- Açıklama: Yanlış sözcük (makine çevirisi kokusu). "çiftlik" Türkçede tarım işletmesidir; "binarity / çift olma" anlamı yok.
  - 78: "Kısacası Güneş gibi yıldızlarda çiftlik yaygın, küçük yıldızlarda daha seyrek."
  - 186: "Galileo'nun teleskoplarından biriyle Mizar'a bakıp çiftliği gördü"
- Kanıt: GTS "çiftlik" → "Tarım yapılan, hayvan yetiştirilen, çalışanlarının da oturması için gerekli yapıları olan…".
- Önerilen düzeltme:
  - 78: "Güneş gibi yıldızlarda çift olmak yaygın"
  - 186: "Mizar'a bakıp onun çift olduğunu gördü"

### A6B-04 · KÜÇÜK · d39.json:17
- Açıklama: Bozuk cümle. "Süperkritik akışkan, basınç ve sıcaklık öyle yükselmiştir ki sıvı ile gaz arasındaki fark kaybolmuştur; ne kaynar ne yoğunlaşır." cümlesinde "Süperkritik akışkan" öznesinin yüklemi yok. "yükselmiştir" yüklemi "basınç ve sıcaklık"a bağlanıyor.
- Önerilen düzeltme: "Süperkritik akışkanda basınç ve sıcaklık öyle yükselmiştir ki sıvı ile gaz arasındaki fark kaybolmuştur; ne kaynar ne yoğunlaşır."

### A6B-05 · KÜÇÜK · d19.json:435 (sözlük tanımı, kid'li öğe)
- Açıklama: Bozuk tamlama. Tanım şöyle: "Bir yüzeyin üstüne düşen ışığın geri yansıttığı kesir". Bu dizilişte "yansıttığı"nın öznesi "ışık" oluyor; oysa yansıtan yüzeydir. Aynı ders 44. satırda doğru kalıbı kullanıyor.
- Önerilen düzeltme: "Bir yüzeyin, üstüne düşen ışığın ne kadarını geri yansıttığını gösteren kesir; …". Kid değişmez, yalnız metin düzeltilir.

### A6B-06 · KÜÇÜK · d39.json:145
- Açıklama: Yanlış ek. "ince, küresel bir kabuk biçimindeki elektriği iletken bir akışkanda". "iletken" sıfattır, belirtme durumunda nesne ("elektriği") alamaz. Aynı ders 21. satırda doğru biçimi ("elektriği ileten") kullanıyor.
- Önerilen düzeltme: "elektriği ileten bir akışkanda".

### A6B-07 · KÜÇÜK · d41.json:78
- Açıklama: Yanlış ek dizilişi. "yüzey yüz binlerce yıllık kadar gençtir". "-lık" sıfat ekinden sonra "kadar" edatı gelmez.
- Önerilen düzeltme: "yüzey yüz binlerce yıl kadar gençtir".

### A6B-08 · KÜÇÜK · d45.json:210
- Açıklama: Eksik ilgi eki. "bulutsunun çoğu dürbünün sınırında olduğunu söyler". "-dığını" yan cümlesinin öznesi ilgi eki almalı.
- Önerilen düzeltme: "bulutsunun çoğunun dürbünün sınırında olduğunu söyler".

### A6B-09 · KÜÇÜK · d45.json:89
- Açıklama: "bir sonraki bölümlerdeki kütle ve yarıçap ölçümleri". "bir sonraki" tekil bir öğe belirtir, çoğul adla birlikte kullanılmaz.
- Önerilen düzeltme: "sonraki bölümlerdeki kütle ve yarıçap ölçümleri".

### A6B-10 · KÜÇÜK · d45.json:484 (soru cevabı, kid'li öğe)
- Açıklama: Noktalama. "…gerekir; bu kabuğun kütleçekim dalgası yayabilecek dağlar taşıyıp taşıyamayacağını etkiler." Virgül olmadığı için "bu kabuğun" sıfat tamlaması gibi okunuyor ve cümlenin öznesi kayboluyor.
- Önerilen düzeltme: "…gerekir; bu, kabuğun kütleçekim dalgası…"

### A6B-11 · KÜÇÜK · d40.json:115, d40.json:129
- Açıklama: Belirtisiz tamlamada iyelik eki eksik.
  - 115: "en üstte buz kabuk."
  - 129: "buz kabuk kayalık çekirdeğe sıkıca bağlı olsaydı"
  - Aynı ders başka yerlerde doğru yazıyor: "buz kabuğu" (6, 65).
- Önerilen düzeltme: "buz kabuğu".

### A6B-12 · KÜÇÜK · d38.json:88, 95, 188, 197
- Açıklama: "gündönümü" bitişik yazılmış:
  - 88: "kuzey yaz gündönümüne doğru"
  - 95: "2017 yaz gündönümünde"
  - 188: "Kuzey yarıkürenin yaz gündönümü"
  - 197: "kuzey yaz gündönümü"
  - TDK sözcüğü ayrı yazar. Komşu ders d39 da ayrı yazıyor (105, 113, 325: "gün dönümü"). Bütün derslerde sayım: "gündönüm" 39, "gün dönüm" 5.
- Kanıt: GTS "gün dönümü" → madde var; "gündönümü" → `{"error":"Sonuç bulunamadı"}`.
- Önerilen düzeltme: "gün dönümü / gün dönümüne / gün dönümünde".

### A6B-13 · KÜÇÜK · hal ↔ hâl (d14, d5, d15, d6, d16)
- Açıklama: "durum" anlamındaki "hâl" düzeltme işaretsiz yazılmış ("hal" pazar yeri, çözme ya da tahttan indirme demektir). Bu derslerin çoğu aynı sözcüğü başka yerlerde "hâl" yazıyor, yani ders içinde de tutarsızlık var. Bütün derslerde sayım: hal-/hale/halinde/halde 79 ↔ hâl- 186.
  - d14: 94, 98 ("gruplar/kümeler halinde"), 422 ("olduğu halde"), 432 ("yatkın hale"), 437. Aynı derste doğru yazılan yerler: 121, 305 "hâlinde".
  - d5: 27, 518, 564 ("olduğu halde"), 28 ("o halde"), 59, 91 ("konvektif hale"). Doğru yazılan: 17 "hâline".
  - d15: 6, 27, 498 ("kümeler halinde"), 56 ("olduğu halde"), 109 ("haline"), 204 ("hali"), 541 ("halinde"). Doğru yazılan: 124, 131, 142, 147, 199. 18 ve 499. satırlardaki "hale" halo anlamında, doğru.
  - d6: 26, 101, 415 ("hale gel-"), 75, 87, 124 ("halinde"), 94, 159 ("o halde"), 152 ("hali").
  - d16: 25 ("O halde"), 519 ("olduğu halde"; soru metni, kid'li öğe). Doğru yazılan: 116, 539, 555 "hâlde".
- Kanıt: GTS "hal" → "Çözme…", "Sebze, meyve… satıldığı yer", "Tahttan indirme"; "hâl" → durum.
- Önerilen düzeltme: hepsi "hâl / hâle / hâlinde / hâlde / hâli".

### A6B-14 · KÜÇÜK · dahil → dâhil (10 yer)
- Açıklama: Satırlar: d38:45, d39:137, d41:190, d43:55, 83, 110, d23:97, 186, d5:137, d6:14 (ör. d6:14 "Güneş de dahil"). Bütün derslerde 29 "dahil" var, hiç "dâhil" yok. Ama proje aynı türden sözcüklerde düzeltme işaretini kullanıyor (hâlâ, hâl, resmî, askerî).
- Kanıt: GTS "dahil" sorgusu madde olarak "dâhil" döndürüyor.
- Önerilen düzeltme: "dâhil".

### A6B-15 · KÜÇÜK · Tarih bildirmeyen ay adları (büyük harf ve kesme)
- Açıklama: Her yıl tekrarlanan, belli bir tarihe bağlı olmayan ay adları büyük harfle ve kesmeyle yazılmış.
  - d19:109 "Mayıs başındaki", "Ekim sonundaki"
  - d19:140 "Temmuz ile Aralık arasında"
  - d19:145 "Ağustos'ta"
  - d19:152 "Ocak başındaki", "Nisan'daki", "Mayıs'taki", "Ekim'deki", "Temmuz sonundaki", "Ağustos'un", "Ekim'in"
  - d19:153 "Kasım'ın", "Aralık'ın", "Aralık sonundaki"
  - d19:166 "Temmuz–Aralık"
  - d42:117 "Mayıs'taki", "Ekim'deki"
  - d4:192 "Ocak'ta", "Temmuz'da", "Temmuz'dakinden"
  - d14:134 "Ocak'ı", "Ocak ve Şubat"
  - d5:20 "Şubat" (cümle başındaki "Ocak" büyük kalır)
  - d15:190 "Aralık'tır", "Ocak akşamlarında", "Mart'ta", "Temmuz'da", "Ocak–Mart"
  - d45:209 "Ocak ayında", d45:210 "Ocak gecesinde"
  - Aynı derslerde doğru yazılmış örnekler var: d14:148 "ocakta", "ağustosta"; d6:154 "ocak ayında".
  - Belli bir yıla bağlı olanlar bulguya katılmadı (ör. d42:160, d41:193, d19:58).
- Kanıt (TDK):
  - Büyük harf sayfası: "Belirli bir tarihi belirtmeyen ay ve gün adları küçük harfle başlar."
  - Kesme sayfası: kesme yalnız "Belirli bir tarih bildiren ay ve gün adlarına gelen ekleri ayırmak için konur".
- Önerilen düzeltme: küçük harf ve kesmesiz yazım (mayıstaki, ekimdeki, ocakta, temmuzda, aralıktır …). Kalıp başka derslerde de görülüyor; tek kural kararıyla toplu düzeltme önerilir.

### A6B-16 · KÜÇÜK · d15.json:188
- Açıklama: Yumuşama eksik. "İki kaynak küçük bir teleskopun yettiğinde birleşir". Aynı paragrafın sonunda doğru biçim var: "teleskobun ayırma gücüyle".
- Kanıt: GTS "teleskop" → `"taki":"bu"`.
- Önerilen düzeltme: "teleskobun".

### A6B-17 · KÜÇÜK · d43.json:60
- Açıklama: Kesme işaretinden sonraki ek ünlü uyumuna uymuyor. "8,99 × 10¹⁶ J'ün". J "jul" diye okunur, kalın ünlü ister. Aynı ders 208. satırda doğru yazıyor: "Joule'dan". Sesli okuyucu bu eki düzeltmiyor: `okunus("J'ün") => J'ün`.
- Önerilen düzeltme: "J'un".

### A6B-18 · KÜÇÜK · d16.json:107
- Açıklama: Kesme işaretinden sonraki ek yanlış. "Sgr A*'tan yaklaşık 1.600 kat büyük". Uygulama bu adı "Sgr A yıldız" diye okuyor (`okunus("Sgr A*'tan") => Sgr A yıldızdan`). "yıldız" yumuşak ünsüzle bittiği için ek -dan olmalı. Aynı ders başka yerde "Sgr A*'ın" yazıyor.
- Önerilen düzeltme: "Sgr A*'dan".

### A6B-19 · KÜÇÜK · d40.json:58
- Açıklama: Ortak isme kesme işareti konmuş. "yaklaşık 10 terawatt'tır". Birim adı özel ad ya da kısaltma değildir; kesme ancak kısaltmada gerekir ("10 TW'tır").
- Önerilen düzeltme: "10 terawatttır" ya da "10 TW'tır".

### A6B-20 · KÜÇÜK · d23_sinav.json:50
- Açıklama: Kesme işaretinden sonraki ek yanlış. "Kessler ve Cour-Palais'in". Fransızca ad [kur pale] okunur, yani ünlüyle biter; ilgi eki -nin olmalı.
- Önerilen düzeltme: "Cour-Palais'nin".

### A6B-21 · KÜÇÜK · d43.json:32 (iki yerde), d43.json:34
- Açıklama: Noktadan sonra yeni cümle küçük harfle başlıyor:
  - 32: "…diye tanımlar). eksi 14 kadirlik bir bolit"
  - 32: "…10.000 kat. eksi 17 kadirlik bir süper bolit"
  - 34: "…ateş topu olur. eksi 14 kadirden parlak olana bolit"
- Önerilen düzeltme: "Eksi …".

### A6B-22 · KÜÇÜK · d23.json:111
- Açıklama: Noktalı virgülden sonra büyük harf kullanılmış: "4,3 km/s ister; Aynı tablo, kaçış hızına ek olarak".
- Önerilen düzeltme: "; aynı tablo".

### A6B-23 · KÜÇÜK · d23.json:494 (soru metni, kid'li öğe)
- Açıklama: Soru cümlesi virgülle bitirilip emir cümlesine bağlanmış: "Tiangong neden İstanbul'un tam tepesinden geçebilir, ISS ile karşılaştır." Aynı dosyadaki öteki sorular "? …" kalıbını kullanıyor (454, 464, 474).
- Önerilen düzeltme: "…geçebilir? ISS ile karşılaştır."

### A6B-24 · KÜÇÜK · Gönderme yapılan ders sırada sonra geliyor ama "gördün / gördük" deniyor
- Açıklama: Ders sırası (veri/dersler.json) şöyle: d43 → d23 → d4 → d14 → … → d6 → d45 → d16 → … → d20 → d13 → … → d25–d32. Aşağıdaki cümleler henüz okunmamış derse, okunmuş gibi gönderme yapıyor.
  - d43:60 "d25'te … TNT ettiğini gördük"
  - d43:112 "d31'de gördüğün gibi"
  - d14:121 "d13'te … görmüştün"
  - d6:141 "d20'de gördüğün gibi"
  - d45:112 "d26'da … gördün"
  - d45:182 "d26'da gördüğün", "d16'da gördüğün gibi"
  - d45:195 "d16'da … gördün"
  - d45:196 "d32'de … gördüğün eşik"
  - Kılavuz (v4 bölümü) fizik derslerine yalnız "daha ayrıntısı için" diye gönderme yapılmasına izin veriyor. on_bilgi alanı denetimi bu metin içi göndermeleri yakalamıyor.
- Kanıt: Betik her cümlede `dNN'` göndermesini ders sırasıyla karşılaştırdı ve "gör-/öğren-/incele-/tanı-" fiillerini aradı; 9 yer buldu (yukarıdaki satırlar).
- Önerilen düzeltme: "d25'te ayrıntısıyla göreceğin gibi…" ya da "(ayrıntısı d31'de)".

### A6B-25 · KÜÇÜK · Sayı biçimi: binlik nokta (kılavuz: "binlik nokta (1.988, 0,39)")
- Açıklama: Dört basamaklı sayılarda nokta kullanımı dersler arasında ve bazı derslerin içinde karışık.
  - Birimli dört basamaklı sayıların hepsini noktasız yazan dersler: d38, d39, d40, d23, d4, d5. Örnekler: d4:14 "5772 K", d23:59 "6371 km", d38:29 "5904 km".
  - Noktalı yazanlar: d41, d42, d43, d45, d15 ve d16'nın çoğu.
  - Aynı ifade içinde iki biçimin yan yana durduğu yerler (kesin tutarsızlık):
    - d19:198 "2000 ile 5000 AB, dış kenarı 10.000 ile 100.000 AB"
    - d19:207 ve 483 "2000–100.000 AB"
    - d19:320 "2000–5000 AB, … 10.000–100.000 AB"
    - d19:205 "365,25 × 24 × 3600 = 31.557.600 s"
    - d14:41 "6000–10.000 kelvin"
    - d5:19 ve 228 "A 7300–10.000 K"
  - Ders içinde karışık olan öteki yerler: d19:44, 49, 238, 477 "1329 km" (d41:236 da aynı); d19:72 "1920 saniye"; d19:129 "1000 kg"; d19:182 "2500'den"; d19:195 "1000 AB'ye", "2000'den"; d16:88 ve 93 "1400"; d6:27, 72, 152, 177, 237, 375, 380, 444 "1000 / 3000" (aynı derste "1.250", "3.050" var).
  - İngilizce biçime (0.5 ya da 10,000) rastlanmadı. Tek istisna d4:123, 156, 157'deki "X9.0" (bkz. Askıda).
- Kanıt: Betik çıktısında birimli dört basamaklı noktasız sayı sayısı: d38 26, d39 18, d40 25, d23 24, d4 35, d5 16, d14 10, d19 8, d41 1. Noktalı sayı sayısı: d38, d39, d40, d23, d4 ve d5'te 0.
- Önerilen düzeltme: Kılavuza göre her yerde "1.329", "2.000" yazılmalı. En az aynı ifadedeki karışıklık giderilmeli.

### A6B-26 · KÜÇÜK · Aynı derste aynı terimin farklı yazılışı
- Açıklama:
  - d14: "X ışınları" (43, 59) ↔ "X-ışını" (110). Bütün derslerde sayım: "X ışın" 78, "X-ışın" 37 (dersler arasında da karışık: d39, d14, d47, d7, d49, d17, d50, d51).
  - d4:124: "heliosfer denir; sınırı olan heliyopoz". "heliyopoz" bütün derslerde tek; d23 (5 yer) ve d42 "heliopoz" yazıyor.
  - d42: metin "kuyruklu yıldız sağanakları" diyor (102, 109, 457), sözlük terimi "kuyruklu yıldız yağmuru" (377). 102. satırda tanım bir terimle başlayıp ötekini anlatıyor.
  - d42: "yarıküre" (38) ↔ "yarımküre" (162). TDK biçimi "yarım küre" (bkz. Askıda).
  - d16: "kütleçekimsel kızıla kayma" (88, sözlük 410) ↔ aynı paragrafta "kırmızıya kaymıştı" (88). Bütün derslerde sayım: "kırmızıya kay" 121, "kızıla kay" 2. d6:46 "kütleçekimsel kırmızıya kayma" yazıyor.
  - d45:89: "Pauli dışarlama ilkesi" ↔ bütün derslerde 10 kez "dışlama ilkesi" (d6:43, 340 dâhil).
  - d19:544: "meteoroitin" ↔ 385. satırda "meteoroidin". Asteroit ve meteoroit derslerde hep d'ye yumuşuyor (asteroidin …).
  - d43:509 (kaynak adı, Türkçe açıklama): "meteoroid boyları" ↔ derste her yerde "meteoroit".
  - d5:107: "kütle-ışıma ilişkisi" ↔ 96 (bölüm başlığı), 201, 265: "Kütle–ışıma gücü ilişkisi".
  - d16:488: "Hulse-Taylor" ↔ d45'te 8 kez "Hulse–Taylor" (kılavuz da uzun çizgi kullanıyor).
- Önerilen düzeltme: Her maddede çoğunluk ya da kılavuz biçimine çekilmeli: X ışını, heliopoz, tek terim (yağmur ya da sağanak), kırmızıya kayma, dışlama ilkesi, meteoroidin, meteoroit, kütle–ışıma gücü, Hulse–Taylor.

### A6B-27 · KÜÇÜK · Dersler arasında terim yazımı (TDK ile karşılaştırmalı)
- Açıklama:
  - "güneş rüzgârı": d23 cümle ortasında 6 kez küçük harfle (166, 173, 416, 500) yazıyor. d4 (7), d42 (11), d39 (4), d19 (2), d40 (1) cümle ortasında "Güneş rüzgârı" yazıyor. Kılavuzun d4 tanımı küçük harf kullanıyor ("güneş rüzgârı"). Hangisi seçilecekse bütün derslere uygulanmalı.
  - "göktaşı" ↔ "gök taşı": d41_sinav.json:6 "gök taşı"; öteki bütün dersler "göktaşı" (111 kez). Yardımcının "gök taşı yanlış" önerisi düşürüldü: GTS'de madde "gök taşı" (ayrı), "göktaşı" yok. Yani aykırı olan proje çoğunluğu; tutarlılık için bir karar gerekiyor.
  - "karbondioksit" (d40:127; d35, d36, d44 sınavları) ↔ "karbon dioksit" (d42:37, 52; bütün derslerde 51'e karşı 4). GTS'de madde "karbondioksit" (bitişik). Yardımcının "karbon dioksit olmalı" önerisi düşürüldü; aykırı olan d42.
  - "joule" ↔ "jul": d6:75 "joule", d45:160 "jul", d43 "Joule'dan" ve "J'ün". Bütün derslerde ikisi karışık ("joule" 22, "jul" 3 kez sözcük olarak).
- Önerilen düzeltme: Kılavuza tek biçim yazılmalı. TDK'ye göre: gök taşı, karbondioksit.

### A6B-28 · KÜÇÜK · Sözlük terimlerinin baş harfi (kid'li öğeler)
- Açıklama: Kılavuz (v3 bölümü, satır 87) şöyle diyor: "terimi metinde geçtiği yalın biçimiyle yaz ("kırmızı dev", "anakol")". Buna göre özel ad olmayan terimler küçük harfle başlamalı.
  - Üç dersin sözlüğü kendi içinde karışık:
    - d19: 15 büyük ("Asteroit", "Kuyruklu yıldız", "Koma", "Meteoroit" …) / 6 küçük
    - d15: 14 büyük ("Açık küme" …) / 9 küçük ("gelgit kuyruğu", "nova" …)
    - d16: 11 büyük ("Kaçış hızı", "Olay ufku" …) / 8 küçük ("foton küresi", "gölge" …)
  - Bütün terimleri büyük harfle başlatan dersler: d38, d23, d4, d14, d5, d6.
  - Kılavuza uygun olarak küçük harf kullanan dersler: d39–d43 ve d45.
- Kanıt: Betik her dersin `sozluk[].terim` alanını saydı; ilk sözcüğü kısaltma ya da özel ad olanları ayırdı.
- Önerilen düzeltme: Terim metni kılavuza göre küçük harfle başlamalı, özel adlar hariç. Kılavuzun kuralı gereği kid değişmez.

### A6B-29 · KÜÇÜK · d45.json:24 — bölüm başlığı (başlık: kid bağımlı)
- Açıklama: "1967: Kayıt kâğıdındaki pürüz". 15 dersteki bütün bölüm başlıklarında iki noktadan sonraki ad öbeği küçük harfle sürüyor (ör. d45:46 "Deniz feneri: atarca nasıl atar?", d45:179 "Hulse–Taylor ve çift atarca: Einstein'ın…"); burada büyük harf kullanılmış. İki noktadan sonra gelen öbek tam cümle ya da alıntı değil.
- Önerilen düzeltme: "1967: kayıt kâğıdındaki pürüz". **Başlık değişirse tekrar kartı / bolum_esle eşlemesi kırılır;** başlığa dokunulacaksa eşleme betiğiyle birlikte yapılmalı. Ders başlıkları (baslik alanı) ise 15 derste ve bütün derslerde aynı düzende (her sözcük büyük, "ve / ile" küçük); orada sorun yok.

## Askıda
1. **"yarıküre / yarımküre":** GTS'de yalnız "yarım küre" var. "yarıküre" ve "yarımküre" ikisi de yok. Dağılım: d38–d41 ve d42:38 "yarıküre"; d19, d14, d15, d45 ve d42:162 "yarımküre". Bütün derslerde sayım: "yarıküre" 27, "yarımküre" 46. Bilimsel yayında iki biçim de yaygın; proje kararı gerekiyor. Ders içi tutarsızlık (d42) A6B-26'da yazıldı.
2. **d38:164 "su ürünü yağar":** "water products" çevirisi gibi duruyor. Türkçede "su ürünleri" balıkçılık terimi, ama cümle anlaşılır.
3. **Eksik öge şüpheleri** (anlaşılır, kesin hata sayılmadı):
   - d39:55 "…gözlemlerinin üzerine kuruyoruz" ("kurmak"ın nesnesi yok)
   - d42:128 "Steins'in yaklaşık 800 km, 2010'da Lutetia'nın yakınından geçti" (ilk öğede "yakınından" düşmüş)
   - d16:52 "…yavaşlıyor ve sonunda … görünür" (yüklem uyumu)
   - d6:504 "silisyum var, hidrojen yoktu" (zaman uyumu)
4. **Çift okumalı ifadeler:**
   - d39:69 "gerçekten çok modelcinin": "really" anlamındaki zarf gibi okunabiliyor; kastedilen "gerçeklikten çok".
   - d41:51 "17 AB'den daha fazla yaklaşmaz": kastedilen "daha yakına gelmez".
   - d19:36 "Ceres'in payını sağlayalım": kastedilen "sağlamasını yapalım" olabilir.
5. **Noktalama:**
   - d39:169 "Görev; gezegenin…": özneden sonra noktalı virgül.
   - d45:155 "SGR 1900+14 ki onun ışınımı … zorladı, ve 27 Aralık": "ki" ara cümlesi ve "ve"den önceki virgül.
   - d42:199 "tarih, saat, yer, aletini": hâl ekleri karışık.
6. **d40:73 ve 383 "kaya manto":** A6B-11 ile aynı türden. 73 not üslubunda, 383 cevap cümlesinde ("metal çekirdek, kaya manto, buz katmanları").
7. **Okunuşa bağlı ekler:**
   - d42:200, 202 "Comet Interceptor'ü / Interceptor'üdür", d42:305 "Interceptor'ün": İngilizce [-tər] okunuşuna göre 'ı/'ın beklenir; Türkçe [-tör] okunursa doğru.
   - d45:100 "Letters'ta"
   - d15:112 "BAV'ın" (harf harf okunursa 'nin)
   - d23:89, 188 "42° D'de" (doğu → 'da mı, harf adı → 'de mi?)
   - d6:72 "8 M☉'ten": uygulama "8 Güneş kütlesinden" diye okuyor, ses doğru; yazılı ek uyumsuz ama simgeye gelen ek için TDK kuralı yok.
8. **d4:123, 156, 157 "X9.0":** Ondalık nokta, ama NOAA'nın uluslararası sınıf kodu. Kod mu, Türkçe sayı mı (X9,0) kararı gerekiyor.
9. **d23 "milli" ↔ "resmî / askerî":** d23:178, 179'daki "milli" TUA ve TÜBİTAK alıntılarının ya da resmî adın içinde. TDK biçimi "millî".
10. **d23:25 cümle başında "delta-v'yi":** Sözlükte "Delta-v" yazılıyor. Simge olarak küçük bırakmak da savunulabilir.
11. **d23:26, 460 "g0" ↔ 214 "g₀":** Simge yazımı karışık; tipografik.
12. **d4 "helyosismoloji" (76, 77, 83, 349, 462, 512, 576) ↔ "heliosfer":** Aynı kökten iki ön ek. Yerleşik bir biçim olabilir.
13. **d16:87, 515 "güneş sistemi" (küçük harf):** Bütün derslerde 210 "Güneş Sistemi" ↔ 2 küçük harf. TDK'nin "gezegen anlamı dışında" kuralı ("güneş" küçük) burada uygulanmaz gibi görünüyor, ama kesin kural metni bulunamadı.
14. **d5'teki ders göndermeleri:** d5:40, 41, 43, 78, 90, 91, 109, 110, 170, 182 "(1. ders)", "17. derste" biçiminde. Öteki dersler "d17'de" biçimini kullanıyor. Ders sırası numaralı olmadığı için (d17 sırada 39.) "17. ders" okura yanlış sıra düşündürebilir. Bunun bir hata mı, üslup mu olduğu kanıtlanamadı.
15. **d15:698 ↔ 806:** Aynı arXiv 2005.13360 çalışması bir yerde "Jetsu 2020", ötekinde "Jetsu 2021, ApJ 920" olarak geçiyor (ön baskı ↔ dergi yılı). Kaynak tutarlılığı; yazım alanı dışı.
16. **d15:118 "yıldızlar arası kütle aktarımı":** "İki yıldız arası" anlamında ayrı yazım savunulabilir.
17. **d41:536** "Wikipedia: Clearing the neighbourhood": Öteki kaynak adları "–" ayıracı kullanıyor. Biçim tutarlılığı.
- Eski sınav soruları (veri/sinavlar.json, 15 soru): yazım hatası bulunmadı. "3600 K / 5780 K" (satır 1190) noktasız yazılmış; dayandığı d4 dersiyle tutarlı, A6B-25 kapsamında.
- Kayıtlı bilinenler: d49 "birkaç %" bu parçanın dışında.
