# Alan 6A — Türkçe yazım, Parça A (Urania v39 denetimi, 2026-10-30)

Kapsam: d1 d2 d11 d21 d12 d24 d3 d34 d9 d44 d10 d22 d35 d36 d37 (+ sınav metinleri). Satır numaraları `arastirma/dersler_v2/dNN.json` (ya da `dNN_sinav.json`, `veri/sinavlar.json`) satırıdır.

## Okunan dosyalar

Yöntem notu: Her dNN.json'un metin alanları (başlık, özet, bölüm başlıkları, paragraflar, örnekler, akılda, formül adı/ifade/açıklama, anahtar sayı değer/açıklama, sözlük, defter notu, soru/cevap, kaynak adları) kaynak satır numarasıyla birlikte düz metne çıkarıldı (`a6a/cikar.py`). Yalnızca `id`, `kid`, `unite`, `url`, `kaynak_url`, `dogru`, `bolum` alanları atlandı (yazım içermez). Okuma bu çıkarılmış metin üzerinden, satır satır yapıldı.

| dosya | satır (JSON) | tamamı | okuyan |
|---|---|---|---|
| d1.json | 768 | evet | ben |
| d2.json | 783 | evet | ben |
| d11.json | 745 | evet | ben |
| d21.json + d21_sinav.json | 564 + 57 | evet | ben |
| d12.json | 765 | evet | ben |
| d24.json + d24_sinav.json | 646 + 58 | evet | ben |
| d3.json | 745 | evet | ben |
| d34.json + d34_sinav.json | 576 + 57 | ders evet; sınav **hayır** (aşağıya bak) | ben |
| d9.json | 924 | evet | ben |
| d44.json + d44_sinav.json | 663 + 57 | ders evet; sınav **hayır** | ben |
| d10.json | 721 | evet | alt ajan (aşağıda D bölümü) |
| d22.json + d22_sinav.json | 666 + 57 | evet | alt ajan |
| d35.json + d35_sinav.json | 583 + 58 | evet | alt ajan |
| d36.json + d36_sinav.json | 617 + 58 | evet | alt ajan |
| d37.json + d37_sinav.json | 624 + 58 | evet | alt ajan |
| veri/sinavlar.json (d1, d2, d11, d12, d3, d9, d10 soruları; bu derslerin dNN_sinav.json'u yok) | 3050 (ilgili ~210 satır) | ilgili soruların tamamı evet | ben |
| YAZIM_KILAVUZU.md | 197 | evet | ben |

Dürüstlük notları:
- Bağlam (token) sınırı yüzünden d10, d22, d35, d36, d37 dosyalarını bu oturumda başlatılan iki alt ajan baştan sona okudu (kendi raporlarında atlanan aralık yok). Bulgularından 8 tanesini kaynak dosyada `sed`/`grep` ile tek tek doğruladım (hepsi doğru çıktı); geri kalanı alt ajanın okumasına dayanır, raporda "(alt ajan)" diye işaretli. Alt ajan raporları: `scratchpad/denetim/a6a/alt_d22_d35_d36_d37.md`, `scratchpad/denetim/a6a/alt_d10.md`.
- d34_sinav.json ve d44_sinav.json'u satır satır okumadım; yalnız otomatik ek uyumu/kesme taramasından geçtiler (bulgu çıkmadı).

## Yöntem
- `cikar.py`: JSON metin alanlarını kaynak satırıyla düz metne çıkarır.
- `denet.py` / `denet2.py`: kesmeyle ayrılmış eklerde (sayı, kısaltma, özel ad) ünlü uyumu, ünsüz benzeşmesi ve kaynaştırma denetimi (sayıların okunuşu Türkçe son kelimeye göre hesaplanır). Çıkan adaylar elle tek tek değerlendirildi; yabancı adlarda okunuşa bağlı olanlar ayıklandı.
- `terim.py`: terim yazılışlarını 15 dersimde ve 58 dersin tamamında sayar (dağılım aşağıda).
- TDK doğrulaması: `sozluk.gov.tr/gts` (Güncel Türkçe Sözlük) sorguları ve `tdk.gov.tr` yazım kuralı sayfaları (kesme işareti, büyük harfler) indirildi; ilgili cümleler aşağıda alıntılandı. `tdk.gov.tr/icerik/yazim-kurallari/nokta/` sayfası boş döndü, bu yüzden saat yazımı için TDK kuralı alıntılanamadı (Askıda).
- Ders başlıkları: 58 dersin başlığı listelendi; hepsi "Büyük Harfli: Alt Başlık" biçiminde ve kendi içinde tutarlı. Bölüm başlıkları hepsi cümle düzeninde; iki noktadan sonra büyük harfle başlayanların hepsi özel ad. **Başlık biçiminde bulgu yok.**

TDK kaynak alıntıları (bulgularda atıf yapılan):
- [K1] tdk.gov.tr/icerik/yazim-kurallari/buyuk-harflerin-kullanildigi-yerler/ — "Belirli bir tarih bildiren ay ve gün adları büyük harfle başlar: 29 Mayıs 1453 Salı günü … Belirli bir tarihi belirtmeyen ay ve gün adları küçük harfle başlar: Okullar genel­likle eylülün ikinci haftasında öğretime başlar."
- [K2] tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/ — "Belirli bir tarih bildiren ay ve gün adlarına gelen ekleri ayırmak için konur: Başvurular 17 Aralık'a kadar sürecektir." / "UYARI: Kurum, kuruluş, kurul, birleşim, oturum ve iş yeri adlarına gelen ekler kesmeyle ayrılmaz: Türkiye Büyük Millet Meclisine, Türk Dil Kurumundan…" / "Özel adlara getirilen yapım ekleri, çokluk eki … kesmeyle ayrılmaz" / "Kısaltmalara getirilen ekleri ayırmak için konur: TBMM'nin, TDK'nin…"
- [K3] tdk.gov.tr/icerik/yazim-kurallari/buyuk-harflerin-kullanildigi-yerler/ — "Gezegen ve yıldız adları büyük harfle başlar … UYARI: Dünya, güneş, ay kelimeleri gezegen anlamı dışında kullanıldıklarında küçük harfle başlar."
- [GTS] sozluk.gov.tr/gts sorguları (2026-10-30): "gezegenler arası" (ayrı) madde var; "yarım küre" (ayrı) madde var, "yarımküre" yok; "jul" (Fr. joule) madde var; "kara delik", "gök cismi", "yeryüzü", "Samanyolu", "ışık yılı", "kızılötesi", "morötesi" madde var; durum anlamında madde başı "hâl" (şapkalı).

## Bulgular

(KRİTİK ve ÖNEMLİ bulgu yok; hepsi KÜÇÜK = yazım. Önce tekil kesin hatalar, sonra terim tutarsızlıkları, sonra sistemik konular.)

### A6A-01 · KÜÇÜK · d24.json:186 (örnek başlığı)
- Açıklama: "Örnek: Gökten 3 yüzde parlak bir yıldız" — Türkçede yüzde sayıdan önce gelir; "3 yüzde" anlamsız bir sıra. Örnek başlığı (bölüm başlığı değil; kid bağımlı değil).
- Kanıt: `sed -n 186p d24.json` → `"baslik": "Örnek: Gökten 3 yüzde parlak bir yıldız"`; aynı örneğin metni (d24.json:187) doğru biçimi kullanıyor: "gökten yüzde 3 parlak".
- Önerilen düzeltme: "Örnek: Gökten yüzde 3 parlak bir yıldız".

### A6A-02 · KÜÇÜK · d24.json:204
- Açıklama: "yer yüzündeki gözlemci" — TDK'de "yeryüzü" bitişik [GTS].
- Önerilen düzeltme: "yeryüzündeki gözlemci".

### A6A-03 · KÜÇÜK · d1.json:471 (sözlük tanımı, "Kadir")
- Açıklama: "Gökcisimlerinin parlaklığını ölçen…" — TDK "gök cismi" ayrı yazar [GTS]; aynı ders metinde hep "gök cisimleri" kullanıyor.
- Önerilen düzeltme: "Gök cisimlerinin parlaklığını ölçen…" (kid'e dokunulmaz, yalnız tanım metni).

### A6A-04 · KÜÇÜK · d1.json:114
- Açıklama: "Haziran gündönümünde öğle Güneş'i Yengeç dönencesinde" — "öğle güneşi" bir isim tamlamasıdır; "-i" tamlama ekidir, kesmeyle ayrılmaz. Aynı ders başka her yerde "öğle Güneşi" yazıyor (d1.json:26, 116, 125, 127).
- Önerilen düzeltme: "öğle Güneşi".

### A6A-05 · KÜÇÜK · d24.json:493 (soru)
- Açıklama: "kuzeye bakarken güneye bakarkenkinden daha uzun poz verebilirsin?" — "-ken" zarf-fiiline "-ki" eklenemez; "bakarkenkinden" bozuk ek dizisi.
- Önerilen düzeltme: "…kuzeye bakarken, güneye bakarken verebileceğinden daha uzun poz verebilirsin?"

### A6A-06 · KÜÇÜK · d21.json:448 (cevap)
- Açıklama: Bozuk cümle: "Kepçenin ağzındaki göstergeç yıldızlar Merak'tan Dubhe'ye çizgi çekip uzatırsın." — "göstergeç yıldızlar" cümleye bağlanmıyor (özne "sen", yalın hâldeki ad öbeği boşta).
- Önerilen düzeltme: "Kepçenin ağzındaki göstergeç yıldızlardan Merak'tan Dubhe'ye bir çizgi çekip uzatırsın."

### A6A-07 · KÜÇÜK · d44.json:194
- Açıklama: "Dünya; yüzeyinde sıvı su okyanusları, … taşıyan bir gezegendir." — Özne ile yüklem arasına noktalı virgül konmaz.
- Önerilen düzeltme: "Dünya, yüzeyinde …" (ya da işaretsiz).

### A6A-08 · KÜÇÜK · d44.json:29
- Açıklama: "bir depremin titreşimlerinin dünyanın öbür ucuna ne zaman … ulaştığına" — gezegen anlamında kullanılmış; [K3] gezegen anlamında büyük harf. Ders başka her yerde "Dünya'nın".
- Önerilen düzeltme: "Dünya'nın öbür ucuna".

### A6A-09 · KÜÇÜK · d21.json:71, d21.json:187
- Açıklama: "Algol'ü" (71), "Algol'ün" (187) — "Algol" okunuşu art ünlülü (o); ek "-u/-un" olmalı.
- Kanıt: `denet2.py` ünlü uyumu taraması; okunuş /al-gol/.
- Önerilen düzeltme: "Algol'u", "Algol'un".

### A6A-10 · KÜÇÜK · d1.json:168, d24.json:204
- Açıklama: "NOIRLab'in" — son hece "lab" art ünlülü; ek "-ın" olmalı. (58 derste yalnız bu 2 geçiş var.)
- Önerilen düzeltme: "NOIRLab'ın".

### A6A-11 · KÜÇÜK · d34.json:62 (aynı satırda iki okunuş) + d2.json:96, 109; d44.json:6, 165
- Açıklama: Kelvin simgesi K'ye gelen ek iki farklı okunuşla yazılıyor. d34.json:62 aynı cümlede "1300 K'nin üstünde" (harf okunuşu "ke") ile "150–170 K'e inince" (birim okunuşu "kelvin") birlikte. Benzer: d2.json:96 "5772 K'ye", d44.json:6 "255 K'yi nasıl 288 K'ye", d44.json:165 (bölüm başlığı) "255 K'den 288 K'ye"; d34.json:154 "1700 K'e". 58 dersin tamamında "K'ye/K'nin/K'yi" 16, "K'e/K'in/K'den" 49 kez.
- Kanıt: `terim.py` sayımı; [K2] "Kısaltmalara getirilen ekler" kuralı ekin okunuşa göre verildiğini gösterir; km'ye → "kilometreye" ile aynı mantıkla K → "kelvine".
- Önerilen düzeltme: birim okunuşu tek biçime çekilsin: "K'e, K'in, K'i, K'den". d44.json:165 bölüm başlığıdır → **başlık: kid bağımlı** (yalnız tutarlılık sorunu; değiştirilmeyecekse metin içi örnekler başlığa uydurulabilir).

### A6A-12 · KÜÇÜK · d34.json:393, d9.json:141, d37.json:134 (alt ajan, doğrulandı)
- Açıklama: "gezegenlerarası" — TDK sözlüğünde "gezegenler arası" ayrı [GTS]. 58 derste "gezegenlerarası" 6, "gezegenler arası" 14 kez.
- Önerilen düzeltme: "gezegenler arası".

### A6A-13 · KÜÇÜK · terim: yıldızlararası / yıldızlar arası (dersler arası)
- Açıklama: Aynı sıfat iki biçimde: "yıldızlararası" 79 kez/19 ders (benim derslerimde d2:43,146 vb., d12, d9), "yıldızlar arası" 19 kez/15 ders (d1, d21, d24, d3, d34.json:25, d22, d36, d37). GTS'de iki biçim de madde değil; aynı yapıdaki "gezegenler arası" ayrı yazılıyor [GTS], bu yüzden ayrı yazım TDK'ye daha yakın. Kılavuz d14 adı "Yıldızlararası ortam" (bitişik).
- Önerilen düzeltme: tek biçim seçilsin; TDK benzeşimiyle "yıldızlar arası". d14 ders başlığı ("Yıldızlararası Ortam…") başlık olduğu için ayrıca karar gerekir.

### A6A-14 · KÜÇÜK · terim: hal / hâl (durum anlamı) — d1.json, d2.json
- Açıklama: TDK durum anlamında "hâl" yazar [GTS]; projede 443 kez "hâl" (58 dersin hepsinde). Şapkasız biçim yalnız d1 ve d2'de ve başka 11 derste kaldı (toplam 61). Benim derslerimdeki satırlar: d1.json:54 "bütün halinde", d1.json:134 "en parlak haliyle", d1.json:135 "en parlak halinden", d1.json:579 "O halde"; d2.json:73 "olduğu halde", d2.json:154 "yelpaze halinde", d2.json:216 "bölünmüş hali". Aynı derste şapkalı biçim de var (ör. d1 2 kez, d2 1 kez). d10, d22, d35, d36, d37'de karışıklık yok (alt ajan).
- Önerilen düzeltme: "hâlinde, hâliyle, hâlinden, O hâlde, olduğu hâlde, hâli".

### A6A-15 · KÜÇÜK · terim: yarımküre / yarıküre / Yarımküre
- Açıklama: TDK "yarım küre" (ayrı) yazar; "yarımküre" ve "yarıküre" sözlükte yok [GTS]. Projede üç biçim: "yarımküre" 49 (benim derslerde d1 15, d36 9, …), "yarıküre" 27 (d3.json:31, 32, 361; d9.json:167, 180; d10 1; d37 3), büyük harfli "Kuzey Yarımküre" d11.json:110 ve 219.
- Önerilen düzeltme: TDK'ye göre "yarım küre" ("kuzey yarım kürede"); en azından tek biçim. d11.json:110 "Kuzey Yarımküre'den" → küçük harf, kesmesiz.

### A6A-16 · KÜÇÜK · terim: joule / jul
- Açıklama: Birim adı d2'de İngilizce yazımla "joule" (d2.json:54, 57, 58, 62, 128, 486 vb.; d2'de 12 kez), d37'de 1 kez; projede "joule" 65, "jul" 29 kez (5 ders). TDK yazımı "jul" (Fr. joule) [GTS]; aynı derste "vat" Türkçe yazılırken "joule" İngilizce. Ayrıca "joule'ün, joule'dür, joule'e" ekleri (d2.json:57, 58, 486) ince ünlülü; GTS "jul" için "-lü" eki veriyor, yani "jul" yazılırsa ekler de tutarlı olur.
- Önerilen düzeltme: "jul" (julün, juldür, jule).

### A6A-17 · KÜÇÜK · terim: Io / İo — d2.json:24
- Açıklama: "Jüpiter'in uydusu İo'da" — 58 derste 82 kez "Io", yalnız burada "İo".
- Önerilen düzeltme: "Io'da".

### A6A-18 · KÜÇÜK · terim: M42 ve M8 adları (d11 ↔ d21 ↔ d34)
- Açıklama: Aynı cisimler derslere göre farklı adla: M42 "Orion Bulutsusu" (d11.json:134, 142; d34.json:184, 186 — projede 15) ↔ "Avcı Bulutsusu" (d21.json:16, 22, 145, 413 — yalnız d21, 5 kez). M8 "Deniz Kulağı Bulutsusu" (d11.json:135, 142, 144, 525 — projede 7) ↔ "Lagün Bulutsusu" (d21.json:172, tek geçiş).
- Önerilen düzeltme: tek ad (projede çoğunluk "Orion Bulutsusu", "Deniz Kulağı Bulutsusu").

### A6A-19 · KÜÇÜK · terim: Arıkovanı / Arı Kovanı — d9.json:112
- Açıklama: M44 d11.json:135, 144 ve d21.json:158'de "Arıkovanı", d9.json:112'de "Arı Kovanı kümesinin".
- Önerilen düzeltme: "Arıkovanı kümesinin".

### A6A-20 · KÜÇÜK · terim: Avcı'nın Kuşağı / Avcı'nın kemeri — d24.json:99
- Açıklama: d21 bunu terim olarak tanımlıyor (d21.json:348 sözlük "Avcı'nın Kuşağı"); d24.json:99 "Avcı'nın kemeri" diyor (projede 2 kez).
- Önerilen düzeltme: "Avcı'nın Kuşağı".

### A6A-21 · KÜÇÜK · terim: Hipparkos / Hipparkhos, Batlamyus / Ptolemaios — d1.json:43, 132
- Açıklama: d1 "Hipparkos" (2 kez; projede tek ders) ve "Batlamyus" (1 kez; projede tek) yazıyor. Kılavuz ve d20 "Hipparkhos" (27 kez), öteki dersler "Ptolemaios" (39 kez; d21, d3, d22, d35).
- Önerilen düzeltme: "Hipparkhos", "Ptolemaios" (Batlamyus istenirse "Ptolemaios (Batlamyus)" bir kez).

### A6A-22 · KÜÇÜK · terim: Betelgeuse eki — d2.json:82 ↔ d1.json:72, d21.json:143, 173, 422, 453, d12.json:160
- Açıklama: Aynı ad iki ünlü uyumuyla: "Betelgeuse'unki" (d2.json:82; projede 4) ↔ "Betelgeuse'ün / Betelgeuse'ünkü" (öteki satırlar; projede 10).
- Önerilen düzeltme: tek okunuş seçilsin (çoğunluk "Betelgeuse'ün").

### A6A-23 · KÜÇÜK · terim: kozmik mikrodalga arka plan "ışınımı" — d2.json:84
- Açıklama: Projede 162 kez "arka plan ışıması" (d58'in ders adı dahil); yalnız d2.json:84'te "arka plan ışınımının".
- Önerilen düzeltme: "arka plan ışımasının".

### A6A-24 · KÜÇÜK · sistemik: belirli tarih bildirmeyen ay (ve gün) adları büyük harf + kesmeyle
- Açıklama: [K1] ve [K2]'ye göre tarih bildirmeyen ay adları küçük harfle ve kesmesiz yazılır ("eylülün ikinci haftasında"). Derslerde iki kullanım karışık; aynı paragrafta bile.
- Kanıt (örnek satırlar):
  - Büyük harf + kesme (TDK'ye aykırı): d1.json:101 "Aralık'tan itibaren", "Eylül'den Mart'a"; d1.json:113 "Ocak ayına"; d1.json:117 "Ocak başında Temmuz'dakinden"; d1.json:579–580 "Ocak ayında", "Ocak'ta"; d11.json:134–136 "Aralık'tır", "Ocak'tır", "Mart'ta", "Temmuz'da", "Ağustos'ta", "Kasım'da"; d12.json:16 "1609'un Ekim ya da Kasım ayında"; d9.json:83 "Kasım'ın son haftasında"; d22, d35, d36'da da (alt ajan: ör. d22.json:17, 29, 35, 43; d35.json:202, 441; d36.json:107, 114, 201, 203); sınav: veri/sinavlar.json:29 "Ocak'ta".
  - Küçük harf (TDK'ye uygun): d3.json:31 "ocak başında … marttan hazirana"; d21.json:129 "Ekimde", 145 "ocakta … aralıkta", 200 (ay listesi); d9.json:112 "aralık sonunda"; d37.json:200, 209.
  - Aynı paragrafta karışık: d21.json:111 "Aralık sonunda … haziran sonunda".
  - Gün adları (alt ajan, doğrulandı): d22.json:153 "Perşembe'den sonra yine Cuma geldi", d22.json:214, 528; aynı ders d22.json:200'de doğru "pazar günü".
- Önerilen düzeltme: tarih bildirmeyen ay/gün adları küçük harf, kesmesiz ("ocakta", "aralık sonunda", "haziran gündönümü"); tarihli olanlar ("19 Şubat 2027'de") olduğu gibi. Not: "Haziran gündönümü", "Mart ekinoksu" bölüm başlıklarında da geçebilir → **başlık: kid bağımlı**.

### A6A-25 · KÜÇÜK · sistemik: kurum adlarına gelen eklerde kesme
- Açıklama: [K2] "Kurum, kuruluş, kurul … adlarına gelen ekler kesmeyle ayrılmaz." Derslerde bu adlar hep kesmeyle yazılıyor; benim 15 dersimde 45 geçiş (ülke adı "Sovyetler Birliği" hariç).
- Kanıt (örnek): d1.json:99 "Paris Gözlemevi'nde"; d21.json:83, 85, 90 "Belçika Kraliyet Gözlemevi'nin/'ne"; d21.json:98 "Ulusal Jeokozmik Araştırma Konseyi'nin"; d12.json:31 "Yerkes Gözlemevi'nin", "Sheffield Üniversitesi'nin"; d12.json:36 "TÜBİTAK Ulusal Gözlemevi'nin"; d3.json:86; d34.json:35, 91, 155; d9.json:123, 166, 181; d44.json:20, 40, 41, 82; d10.json:186 "Kennedy Uzay Merkezi'ndeki", "Kanada Uzay Ajansı'ndan"; d22.json:73, 185, 289; d35.json:72, 143; d36.json:53, 54, 76, 94; d37.json:81, 143, 156. Proje genelinde kesmesiz kullanım yok denecek kadar az, yani tutarlı ama TDK'ye aykırı bir tercih.
- Önerilen düzeltme: "Paris Gözlemevinde", "Sheffield Üniversitesinin", "Uluslararası Astronomi Birliğinin" vb. (Kaan'ın tercihi; toplu değişiklik bölüm başlıklarına dokunmuyorsa kid'i etkilemez.)

### A6A-26 · KÜÇÜK · sistemik: saat yazımı "21:00" ↔ "22.00"
- Açıklama: Saat ve dakika iki ayrı işaretle yazılıyor. İki nokta: d11.json:66, 179, 570 (16 geçiş), d22 (57 geçiş; d22 bölüm başlığı "Yerel saat: İstanbul'un öğlesi neden 13:04?"). Nokta: d21 (36 geçiş, ör. d21.json:113, 129, 205), d3.json:532, d9.json:54, 143, d44.json:97, d10 (6), d35.json:201, d36.json:161, d37.json:200, 209, 311. 58 derste 93 ↔ 74.
- Önerilen düzeltme: tek biçim (TDK örneklerinde yaygın olan nokta; kural sayfası indirilemedi, bkz. Askıda). d22 bölüm başlığı → **başlık: kid bağımlı**.

### A6A-27 · KÜÇÜK · d1 sözlüğü: terim büyük/küçük harfi karışık (d1.json:405–535)
- Açıklama: Kılavuz v3: "terimi metinde geçtiği yalın biçimiyle yaz". d1 sözlüğünde eski terimler büyük harfle ("Gök küresi", "Başucu", "Ayakucu", "Yükseklik", "Azimut", … "Bortle ölçeği"), yeni eklenenler küçük harfle ("yay dakikası", "meridyen", "doruğa ulaşma", "günberi"…). Aynı karışıklık d2, d3, d9, d11, d12 sözlüklerinde de var (eski öğeler büyük, yeniler küçük); d21, d24, d34, d44 tutarlı biçimde küçük.
- Önerilen düzeltme: ortak sözlük eşlemesi büyük/küçük harfe duyarlıysa küçük harfe çekilmeli; duyarsızsa yalnız görünüm sorunu. (kid alanına dokunulmaz.) Eşlemenin duyarlılığını bu turda denetlemedim.

### A6A-28 · KÜÇÜK · d10, d22, d35, d36, d37 tekil hataları (alt ajan; ilk 8'i kaynakta doğrulandı)
- d36.json:484 "magma hep aynı yere birikir" → "aynı yerde birikir" (doğrulandı).
- d37.json:498 "neyi görür, neyi göremezsin?" → "neyi görürsün, neyi göremezsin?" (doğrulandı).
- d37_sinav.json:36 "Jüpiter'e Roche sınırının içinden geçtiği" → "Jüpiter'in Roche sınırının…" (doğrulandı).
- d37.json:123 "radyo astronominin" → "radyo astronomisinin" (doğrulandı).
- d22.json:153 "Perşembe'den sonra yine Cuma geldi" → "perşembeden sonra yine cuma geldi" (doğrulandı; bkz. A6A-24).
- d35.json:97 "vardır, ve bu sürpriz oldu" → "vardır ve…" ("ve"den önce virgül; ayrıca d35.json:145, d36.json:147) (doğrulandı).
- d22.json:129 "ilerde" → "ileride" (doğrulandı).
- d22.json:170 "260 sayılı resmî gazetede" → "Resmî Gazete'de" (aynı ders 72, 73, 289, 484'te doğru yazıyor) (doğrulandı).
- d22.json:198 "Kuran" → "Kur'an".
- d22.json:168, 430 "Hicret'i" ↔ d22.json:182 "hicretidir" (ders içi tutarsız; TDK küçük harf).
- d37.json:102 "güneşin morötesi ışığının" → "Güneş'in"; d37.json:375 "güneş rüzgârının" → "Güneş rüzgârının" (projede her yerde büyük).
- d36.json:54 "binden fazla depremden sinyali en temiz 23 tanesini" → "depremden, sinyali en temiz…" (virgül eksik, yanlış okunuyor).
- d37_sinav.json:23 "Voyager'lar" → "Voyagerlar" ([K2]: özel ada çokluk eki kesmeyle ayrılmaz) — bunu ben buldum.
- Terim (alt ajan): d22 metni "UTC + 3", d22_sinav.json:4, 51 "UTC+3"; "Türkiye Saati (TRT)" (d22.json:74) ↔ "Türkiye saatiyle" (d37.json:200) ↔ "(TSİ)" (d37.json:209; d11 defter notu d11.json:500 da "TSİ"); tırnak: d35/d36 “ ” ↔ d37 ' '; d37.json:469 "'Kalıcı Leke'nin" tırnak ile kesme karışık.
- d10 sonuçları: aşağıda D bölümünde.

## Askıda
1. Saat yazımı için TDK kuralı: `tdk.gov.tr/icerik/yazim-kurallari/nokta/` ve benzeri sayfalar indirilemedi (boş/404). Bu yüzden A6A-26 yalnız tutarlılık bulgusu; hangi biçimin TDK'ye uygun olduğunu kaynakla gösteremedim.
2. "kütleçekim / kütleçekimi": proje 780 kez bitişik "kütleçekim" kullanıyor (tutarlı). GTS'de "kütle çekimi" de "kütleçekim" de madde olarak bulunamadı; TDK yazımını kanıtlayamadım. d3.json:73 "Kütleçekimi tek tek cisimler arasında … zayıftır" (yalın durumda "-i") bu yüzden bulgu değil.
3. "yerdurgun yörünge" (d3.json:127, 349, 453; projede 33, 3 ders) ↔ kılavuzun d23 için kullandığı "yer eşzamanlı" (12 kez, 1 ders). Terim farkı var, ama ikisi tam eşanlamlı değil (yerdurgun = geostationary, yer eşzamanlı = geosynchronous); d23'ü okumadığım için tutarsızlık mı bilinçli ayrım mı karar veremedim.
4. Yabancı adlarda okunuşa bağlı ekler (Alpheratz'tan / Alpheratz'ın d21; Pioneer'dan d37:178; Joule'e d2:128): okunuşa göre iki biçim de savunulabilir; bulgu sayılmadı.
5. "içyapısı" (d9.json:5, 80): TDK sözlüğünde sorgulamadım; öteki derslerin çoğu "iç yapı" yazıyor. Doğrulanmadı.
6. d44.json:205 "neredeyse dolun bir Dünya" — "dolun" sıfatının TDK'de bağımsız madde olup olmadığını denetlemedim.
7. Alt ajanın "Askıda" listesi (d22/d35/d36/d37; 16 madde: ör. d35.json:44 "kabuk" iki anlamda, d37_sinav.json:40 "buna Roche sınırı denir", Ramazan/Muharrem büyük harfi, d35.json:145 "Sci.News'in", anlatıcı kişisi "doğrulayamadım/doğrulayamadık") — ayrıntı: `scratchpad/denetim/a6a/alt_d22_d35_d36_d37.md` D bölümü.
8. Kaynak adlarında "IPFS kopyası" (d2.json:720, 736): ORTAK.md IPFS kopyalarını yasaklıyor; bu yazım değil kaynak bulgusu, Alan 6A dışında. Yalnız not.

## D. d10 (alt ajan; ayrıntı `scratchpad/denetim/a6a/alt_d10.md`)
d10.json'un tamamı alt ajan tarafından okundu. Benim doğruladıklarım (✓):
- ✓ d10.json:15, 17, 505, 506 "ilkdördün", 15, 17 "sondördün" → "ilk dördün", "son dördün" (GTS'de "ilk dördün" madde; "ilkdördün" yok). Projede "ilkdördün" 2, "ilk dördün" 1 kez.
- ✓ d10.json:477 "…ufka yakınken daha büyük görünmesi algı yanılsaması." — yüklemsiz/eksik cümle → "…daha büyük görünmesi bir algı yanılsamasıdır."
- ✓ d10.json:172 cümle küçük harfle başlıyor: "orbitalradar'a ve Astronomy Engine…" → cümle yeniden kurulmalı (ör. "Hesaplar orbitalradar'a…").
- ✓ d10.json:17 ve d44.json:205 "neredeyse dolun bir Dünya" — "dolun" GTS'de madde değil → "neredeyse dolunay gibi tam aydınlık bir Dünya" (yukarıdaki Askıda 6 bu nedenle bulguya çevrildi).
- d10.json:17, 24 "yarımküre", 56 "yarıküre" (ders içinde iki biçim; bkz. A6A-15).
- d10.json:168 "Halys ırmağının" → "Halys Irmağı'nın"; 169 "Meis (Kastellorizo) adasından" → "Meis (Kastellorizo) Adası'ndan".
- d10.json:84 dış çekirdek için "sıvı demir bir kabuk" denmiş, sonraki cümlede "kabuk" yer kabuğu anlamında — terim karışıklığı.
- Ders gönderme biçimi karışık: "(11. ders)", "3. derste" (83, 127) ↔ "(d1)/(d3)" (aynı tutarsızlık d9, d12, d3, d24'te de var: "3. ders", "12. derste" ↔ d21/d34/d44 "d1, d9").
- Sistemik: ay adı büyük harf 44, 45, 47, 49, 50, 230, 494, 545, 546; kurum kesmesi 186; saat hepsi noktalı; hal/hâl sorunsuz.
- Alt ajanın kütleçekim → "kütle çekimi" önerisini almadım (Askıda 2: GTS'de iki biçim de madde değil).
- Alt ajan askıda: "7°54′'ye" eki, "Güney Kutbu-Aitken havzası" büyük harfi, 195 ↔ 198 "dördüncü ulusal uzay ajansı / dördüncü ülke" (içerik), 353 "223 = 239 = 242 ay" (≈ olmalı), "bakışamaz".
