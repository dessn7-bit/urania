# Alan 6 — Türkçe yazım (Urania v39 denetimi, 2026-10-30)

Bu dosya 5 ajanın raporunun birleşimidir; her parça kendi okunan dosyalar tablosu, yöntemi, bulguları ve askıda bölümüyle aşağıda. Kimlik önekleri: A6A (sıra 1–15), A6B (sıra 16–30), A6C (sıra 31–44), A6D (sıra 45–58), A6E (haberler, deney metinleri).


---

## Alan 6A — Türkçe yazım, Parça A (Urania v39 denetimi, 2026-10-30)

Kapsam: d1 d2 d11 d21 d12 d24 d3 d34 d9 d44 d10 d22 d35 d36 d37 (+ sınav metinleri). Satır numaraları `arastirma/dersler_v2/dNN.json` (ya da `dNN_sinav.json`, `veri/sinavlar.json`) satırıdır.

### Okunan dosyalar

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

### Yöntem
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

### Bulgular

(KRİTİK ve ÖNEMLİ bulgu yok; hepsi KÜÇÜK = yazım. Önce tekil kesin hatalar, sonra terim tutarsızlıkları, sonra sistemik konular.)

#### A6A-01 · KÜÇÜK · d24.json:186 (örnek başlığı)
- Açıklama: "Örnek: Gökten 3 yüzde parlak bir yıldız" — Türkçede yüzde sayıdan önce gelir; "3 yüzde" anlamsız bir sıra. Örnek başlığı (bölüm başlığı değil; kid bağımlı değil).
- Kanıt: `sed -n 186p d24.json` → `"baslik": "Örnek: Gökten 3 yüzde parlak bir yıldız"`; aynı örneğin metni (d24.json:187) doğru biçimi kullanıyor: "gökten yüzde 3 parlak".
- Önerilen düzeltme: "Örnek: Gökten yüzde 3 parlak bir yıldız".

#### A6A-02 · KÜÇÜK · d24.json:204
- Açıklama: "yer yüzündeki gözlemci" — TDK'de "yeryüzü" bitişik [GTS].
- Önerilen düzeltme: "yeryüzündeki gözlemci".

#### A6A-03 · KÜÇÜK · d1.json:471 (sözlük tanımı, "Kadir")
- Açıklama: "Gökcisimlerinin parlaklığını ölçen…" — TDK "gök cismi" ayrı yazar [GTS]; aynı ders metinde hep "gök cisimleri" kullanıyor.
- Önerilen düzeltme: "Gök cisimlerinin parlaklığını ölçen…" (kid'e dokunulmaz, yalnız tanım metni).

#### A6A-04 · KÜÇÜK · d1.json:114
- Açıklama: "Haziran gündönümünde öğle Güneş'i Yengeç dönencesinde" — "öğle güneşi" bir isim tamlamasıdır; "-i" tamlama ekidir, kesmeyle ayrılmaz. Aynı ders başka her yerde "öğle Güneşi" yazıyor (d1.json:26, 116, 125, 127).
- Önerilen düzeltme: "öğle Güneşi".

#### A6A-05 · KÜÇÜK · d24.json:493 (soru)
- Açıklama: "kuzeye bakarken güneye bakarkenkinden daha uzun poz verebilirsin?" — "-ken" zarf-fiiline "-ki" eklenemez; "bakarkenkinden" bozuk ek dizisi.
- Önerilen düzeltme: "…kuzeye bakarken, güneye bakarken verebileceğinden daha uzun poz verebilirsin?"

#### A6A-06 · KÜÇÜK · d21.json:448 (cevap)
- Açıklama: Bozuk cümle: "Kepçenin ağzındaki göstergeç yıldızlar Merak'tan Dubhe'ye çizgi çekip uzatırsın." — "göstergeç yıldızlar" cümleye bağlanmıyor (özne "sen", yalın hâldeki ad öbeği boşta).
- Önerilen düzeltme: "Kepçenin ağzındaki göstergeç yıldızlardan Merak'tan Dubhe'ye bir çizgi çekip uzatırsın."

#### A6A-07 · KÜÇÜK · d44.json:194
- Açıklama: "Dünya; yüzeyinde sıvı su okyanusları, … taşıyan bir gezegendir." — Özne ile yüklem arasına noktalı virgül konmaz.
- Önerilen düzeltme: "Dünya, yüzeyinde …" (ya da işaretsiz).

#### A6A-08 · KÜÇÜK · d44.json:29
- Açıklama: "bir depremin titreşimlerinin dünyanın öbür ucuna ne zaman … ulaştığına" — gezegen anlamında kullanılmış; [K3] gezegen anlamında büyük harf. Ders başka her yerde "Dünya'nın".
- Önerilen düzeltme: "Dünya'nın öbür ucuna".

#### A6A-09 · KÜÇÜK · d21.json:71, d21.json:187
- Açıklama: "Algol'ü" (71), "Algol'ün" (187) — "Algol" okunuşu art ünlülü (o); ek "-u/-un" olmalı.
- Kanıt: `denet2.py` ünlü uyumu taraması; okunuş /al-gol/.
- Önerilen düzeltme: "Algol'u", "Algol'un".

#### A6A-10 · KÜÇÜK · d1.json:168, d24.json:204
- Açıklama: "NOIRLab'in" — son hece "lab" art ünlülü; ek "-ın" olmalı. (58 derste yalnız bu 2 geçiş var.)
- Önerilen düzeltme: "NOIRLab'ın".

#### A6A-11 · KÜÇÜK · d34.json:62 (aynı satırda iki okunuş) + d2.json:96, 109; d44.json:6, 165
- Açıklama: Kelvin simgesi K'ye gelen ek iki farklı okunuşla yazılıyor. d34.json:62 aynı cümlede "1300 K'nin üstünde" (harf okunuşu "ke") ile "150–170 K'e inince" (birim okunuşu "kelvin") birlikte. Benzer: d2.json:96 "5772 K'ye", d44.json:6 "255 K'yi nasıl 288 K'ye", d44.json:165 (bölüm başlığı) "255 K'den 288 K'ye"; d34.json:154 "1700 K'e". 58 dersin tamamında "K'ye/K'nin/K'yi" 16, "K'e/K'in/K'den" 49 kez.
- Kanıt: `terim.py` sayımı; [K2] "Kısaltmalara getirilen ekler" kuralı ekin okunuşa göre verildiğini gösterir; km'ye → "kilometreye" ile aynı mantıkla K → "kelvine".
- Önerilen düzeltme: birim okunuşu tek biçime çekilsin: "K'e, K'in, K'i, K'den". d44.json:165 bölüm başlığıdır → **başlık: kid bağımlı** (yalnız tutarlılık sorunu; değiştirilmeyecekse metin içi örnekler başlığa uydurulabilir).

#### A6A-12 · KÜÇÜK · d34.json:393, d9.json:141, d37.json:134 (alt ajan, doğrulandı)
- Açıklama: "gezegenlerarası" — TDK sözlüğünde "gezegenler arası" ayrı [GTS]. 58 derste "gezegenlerarası" 6, "gezegenler arası" 14 kez.
- Önerilen düzeltme: "gezegenler arası".

#### A6A-13 · KÜÇÜK · terim: yıldızlararası / yıldızlar arası (dersler arası)
- Açıklama: Aynı sıfat iki biçimde: "yıldızlararası" 79 kez/19 ders (benim derslerimde d2:43,146 vb., d12, d9), "yıldızlar arası" 19 kez/15 ders (d1, d21, d24, d3, d34.json:25, d22, d36, d37). GTS'de iki biçim de madde değil; aynı yapıdaki "gezegenler arası" ayrı yazılıyor [GTS], bu yüzden ayrı yazım TDK'ye daha yakın. Kılavuz d14 adı "Yıldızlararası ortam" (bitişik).
- Önerilen düzeltme: tek biçim seçilsin; TDK benzeşimiyle "yıldızlar arası". d14 ders başlığı ("Yıldızlararası Ortam…") başlık olduğu için ayrıca karar gerekir.

#### A6A-14 · KÜÇÜK · terim: hal / hâl (durum anlamı) — d1.json, d2.json
- Açıklama: TDK durum anlamında "hâl" yazar [GTS]; projede 443 kez "hâl" (58 dersin hepsinde). Şapkasız biçim yalnız d1 ve d2'de ve başka 11 derste kaldı (toplam 61). Benim derslerimdeki satırlar: d1.json:54 "bütün halinde", d1.json:134 "en parlak haliyle", d1.json:135 "en parlak halinden", d1.json:579 "O halde"; d2.json:73 "olduğu halde", d2.json:154 "yelpaze halinde", d2.json:216 "bölünmüş hali". Aynı derste şapkalı biçim de var (ör. d1 2 kez, d2 1 kez). d10, d22, d35, d36, d37'de karışıklık yok (alt ajan).
- Önerilen düzeltme: "hâlinde, hâliyle, hâlinden, O hâlde, olduğu hâlde, hâli".

#### A6A-15 · KÜÇÜK · terim: yarımküre / yarıküre / Yarımküre
- Açıklama: TDK "yarım küre" (ayrı) yazar; "yarımküre" ve "yarıküre" sözlükte yok [GTS]. Projede üç biçim: "yarımküre" 49 (benim derslerde d1 15, d36 9, …), "yarıküre" 27 (d3.json:31, 32, 361; d9.json:167, 180; d10 1; d37 3), büyük harfli "Kuzey Yarımküre" d11.json:110 ve 219.
- Önerilen düzeltme: TDK'ye göre "yarım küre" ("kuzey yarım kürede"); en azından tek biçim. d11.json:110 "Kuzey Yarımküre'den" → küçük harf, kesmesiz.

#### A6A-16 · KÜÇÜK · terim: joule / jul
- Açıklama: Birim adı d2'de İngilizce yazımla "joule" (d2.json:54, 57, 58, 62, 128, 486 vb.; d2'de 12 kez), d37'de 1 kez; projede "joule" 65, "jul" 29 kez (5 ders). TDK yazımı "jul" (Fr. joule) [GTS]; aynı derste "vat" Türkçe yazılırken "joule" İngilizce. Ayrıca "joule'ün, joule'dür, joule'e" ekleri (d2.json:57, 58, 486) ince ünlülü; GTS "jul" için "-lü" eki veriyor, yani "jul" yazılırsa ekler de tutarlı olur.
- Önerilen düzeltme: "jul" (julün, juldür, jule).

#### A6A-17 · KÜÇÜK · terim: Io / İo — d2.json:24
- Açıklama: "Jüpiter'in uydusu İo'da" — 58 derste 82 kez "Io", yalnız burada "İo".
- Önerilen düzeltme: "Io'da".

#### A6A-18 · KÜÇÜK · terim: M42 ve M8 adları (d11 ↔ d21 ↔ d34)
- Açıklama: Aynı cisimler derslere göre farklı adla: M42 "Orion Bulutsusu" (d11.json:134, 142; d34.json:184, 186 — projede 15) ↔ "Avcı Bulutsusu" (d21.json:16, 22, 145, 413 — yalnız d21, 5 kez). M8 "Deniz Kulağı Bulutsusu" (d11.json:135, 142, 144, 525 — projede 7) ↔ "Lagün Bulutsusu" (d21.json:172, tek geçiş).
- Önerilen düzeltme: tek ad (projede çoğunluk "Orion Bulutsusu", "Deniz Kulağı Bulutsusu").

#### A6A-19 · KÜÇÜK · terim: Arıkovanı / Arı Kovanı — d9.json:112
- Açıklama: M44 d11.json:135, 144 ve d21.json:158'de "Arıkovanı", d9.json:112'de "Arı Kovanı kümesinin".
- Önerilen düzeltme: "Arıkovanı kümesinin".

#### A6A-20 · KÜÇÜK · terim: Avcı'nın Kuşağı / Avcı'nın kemeri — d24.json:99
- Açıklama: d21 bunu terim olarak tanımlıyor (d21.json:348 sözlük "Avcı'nın Kuşağı"); d24.json:99 "Avcı'nın kemeri" diyor (projede 2 kez).
- Önerilen düzeltme: "Avcı'nın Kuşağı".

#### A6A-21 · KÜÇÜK · terim: Hipparkos / Hipparkhos, Batlamyus / Ptolemaios — d1.json:43, 132
- Açıklama: d1 "Hipparkos" (2 kez; projede tek ders) ve "Batlamyus" (1 kez; projede tek) yazıyor. Kılavuz ve d20 "Hipparkhos" (27 kez), öteki dersler "Ptolemaios" (39 kez; d21, d3, d22, d35).
- Önerilen düzeltme: "Hipparkhos", "Ptolemaios" (Batlamyus istenirse "Ptolemaios (Batlamyus)" bir kez).

#### A6A-22 · KÜÇÜK · terim: Betelgeuse eki — d2.json:82 ↔ d1.json:72, d21.json:143, 173, 422, 453, d12.json:160
- Açıklama: Aynı ad iki ünlü uyumuyla: "Betelgeuse'unki" (d2.json:82; projede 4) ↔ "Betelgeuse'ün / Betelgeuse'ünkü" (öteki satırlar; projede 10).
- Önerilen düzeltme: tek okunuş seçilsin (çoğunluk "Betelgeuse'ün").

#### A6A-23 · KÜÇÜK · terim: kozmik mikrodalga arka plan "ışınımı" — d2.json:84
- Açıklama: Projede 162 kez "arka plan ışıması" (d58'in ders adı dahil); yalnız d2.json:84'te "arka plan ışınımının".
- Önerilen düzeltme: "arka plan ışımasının".

#### A6A-24 · KÜÇÜK · sistemik: belirli tarih bildirmeyen ay (ve gün) adları büyük harf + kesmeyle
- Açıklama: [K1] ve [K2]'ye göre tarih bildirmeyen ay adları küçük harfle ve kesmesiz yazılır ("eylülün ikinci haftasında"). Derslerde iki kullanım karışık; aynı paragrafta bile.
- Kanıt (örnek satırlar):
  - Büyük harf + kesme (TDK'ye aykırı): d1.json:101 "Aralık'tan itibaren", "Eylül'den Mart'a"; d1.json:113 "Ocak ayına"; d1.json:117 "Ocak başında Temmuz'dakinden"; d1.json:579–580 "Ocak ayında", "Ocak'ta"; d11.json:134–136 "Aralık'tır", "Ocak'tır", "Mart'ta", "Temmuz'da", "Ağustos'ta", "Kasım'da"; d12.json:16 "1609'un Ekim ya da Kasım ayında"; d9.json:83 "Kasım'ın son haftasında"; d22, d35, d36'da da (alt ajan: ör. d22.json:17, 29, 35, 43; d35.json:202, 441; d36.json:107, 114, 201, 203); sınav: veri/sinavlar.json:29 "Ocak'ta".
  - Küçük harf (TDK'ye uygun): d3.json:31 "ocak başında … marttan hazirana"; d21.json:129 "Ekimde", 145 "ocakta … aralıkta", 200 (ay listesi); d9.json:112 "aralık sonunda"; d37.json:200, 209.
  - Aynı paragrafta karışık: d21.json:111 "Aralık sonunda … haziran sonunda".
  - Gün adları (alt ajan, doğrulandı): d22.json:153 "Perşembe'den sonra yine Cuma geldi", d22.json:214, 528; aynı ders d22.json:200'de doğru "pazar günü".
- Önerilen düzeltme: tarih bildirmeyen ay/gün adları küçük harf, kesmesiz ("ocakta", "aralık sonunda", "haziran gündönümü"); tarihli olanlar ("19 Şubat 2027'de") olduğu gibi. Not: "Haziran gündönümü", "Mart ekinoksu" bölüm başlıklarında da geçebilir → **başlık: kid bağımlı**.

#### A6A-25 · KÜÇÜK · sistemik: kurum adlarına gelen eklerde kesme
- Açıklama: [K2] "Kurum, kuruluş, kurul … adlarına gelen ekler kesmeyle ayrılmaz." Derslerde bu adlar hep kesmeyle yazılıyor; benim 15 dersimde 45 geçiş (ülke adı "Sovyetler Birliği" hariç).
- Kanıt (örnek): d1.json:99 "Paris Gözlemevi'nde"; d21.json:83, 85, 90 "Belçika Kraliyet Gözlemevi'nin/'ne"; d21.json:98 "Ulusal Jeokozmik Araştırma Konseyi'nin"; d12.json:31 "Yerkes Gözlemevi'nin", "Sheffield Üniversitesi'nin"; d12.json:36 "TÜBİTAK Ulusal Gözlemevi'nin"; d3.json:86; d34.json:35, 91, 155; d9.json:123, 166, 181; d44.json:20, 40, 41, 82; d10.json:186 "Kennedy Uzay Merkezi'ndeki", "Kanada Uzay Ajansı'ndan"; d22.json:73, 185, 289; d35.json:72, 143; d36.json:53, 54, 76, 94; d37.json:81, 143, 156. Proje genelinde kesmesiz kullanım yok denecek kadar az, yani tutarlı ama TDK'ye aykırı bir tercih.
- Önerilen düzeltme: "Paris Gözlemevinde", "Sheffield Üniversitesinin", "Uluslararası Astronomi Birliğinin" vb. (Kaan'ın tercihi; toplu değişiklik bölüm başlıklarına dokunmuyorsa kid'i etkilemez.)

#### A6A-26 · KÜÇÜK · sistemik: saat yazımı "21:00" ↔ "22.00"
- Açıklama: Saat ve dakika iki ayrı işaretle yazılıyor. İki nokta: d11.json:66, 179, 570 (16 geçiş), d22 (57 geçiş; d22 bölüm başlığı "Yerel saat: İstanbul'un öğlesi neden 13:04?"). Nokta: d21 (36 geçiş, ör. d21.json:113, 129, 205), d3.json:532, d9.json:54, 143, d44.json:97, d10 (6), d35.json:201, d36.json:161, d37.json:200, 209, 311. 58 derste 93 ↔ 74.
- Önerilen düzeltme: tek biçim (TDK örneklerinde yaygın olan nokta; kural sayfası indirilemedi, bkz. Askıda). d22 bölüm başlığı → **başlık: kid bağımlı**.

#### A6A-27 · KÜÇÜK · d1 sözlüğü: terim büyük/küçük harfi karışık (d1.json:405–535)
- Açıklama: Kılavuz v3: "terimi metinde geçtiği yalın biçimiyle yaz". d1 sözlüğünde eski terimler büyük harfle ("Gök küresi", "Başucu", "Ayakucu", "Yükseklik", "Azimut", … "Bortle ölçeği"), yeni eklenenler küçük harfle ("yay dakikası", "meridyen", "doruğa ulaşma", "günberi"…). Aynı karışıklık d2, d3, d9, d11, d12 sözlüklerinde de var (eski öğeler büyük, yeniler küçük); d21, d24, d34, d44 tutarlı biçimde küçük.
- Önerilen düzeltme: ortak sözlük eşlemesi büyük/küçük harfe duyarlıysa küçük harfe çekilmeli; duyarsızsa yalnız görünüm sorunu. (kid alanına dokunulmaz.) Eşlemenin duyarlılığını bu turda denetlemedim.

#### A6A-28 · KÜÇÜK · d10, d22, d35, d36, d37 tekil hataları (alt ajan; ilk 8'i kaynakta doğrulandı)
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

### Askıda
1. Saat yazımı için TDK kuralı: `tdk.gov.tr/icerik/yazim-kurallari/nokta/` ve benzeri sayfalar indirilemedi (boş/404). Bu yüzden A6A-26 yalnız tutarlılık bulgusu; hangi biçimin TDK'ye uygun olduğunu kaynakla gösteremedim.
2. "kütleçekim / kütleçekimi": proje 780 kez bitişik "kütleçekim" kullanıyor (tutarlı). GTS'de "kütle çekimi" de "kütleçekim" de madde olarak bulunamadı; TDK yazımını kanıtlayamadım. d3.json:73 "Kütleçekimi tek tek cisimler arasında … zayıftır" (yalın durumda "-i") bu yüzden bulgu değil.
3. "yerdurgun yörünge" (d3.json:127, 349, 453; projede 33, 3 ders) ↔ kılavuzun d23 için kullandığı "yer eşzamanlı" (12 kez, 1 ders). Terim farkı var, ama ikisi tam eşanlamlı değil (yerdurgun = geostationary, yer eşzamanlı = geosynchronous); d23'ü okumadığım için tutarsızlık mı bilinçli ayrım mı karar veremedim.
4. Yabancı adlarda okunuşa bağlı ekler (Alpheratz'tan / Alpheratz'ın d21; Pioneer'dan d37:178; Joule'e d2:128): okunuşa göre iki biçim de savunulabilir; bulgu sayılmadı.
5. "içyapısı" (d9.json:5, 80): TDK sözlüğünde sorgulamadım; öteki derslerin çoğu "iç yapı" yazıyor. Doğrulanmadı.
6. d44.json:205 "neredeyse dolun bir Dünya" — "dolun" sıfatının TDK'de bağımsız madde olup olmadığını denetlemedim.
7. Alt ajanın "Askıda" listesi (d22/d35/d36/d37; 16 madde: ör. d35.json:44 "kabuk" iki anlamda, d37_sinav.json:40 "buna Roche sınırı denir", Ramazan/Muharrem büyük harfi, d35.json:145 "Sci.News'in", anlatıcı kişisi "doğrulayamadım/doğrulayamadık") — ayrıntı: `scratchpad/denetim/a6a/alt_d22_d35_d36_d37.md` D bölümü.
8. Kaynak adlarında "IPFS kopyası" (d2.json:720, 736): ORTAK.md IPFS kopyalarını yasaklıyor; bu yazım değil kaynak bulgusu, Alan 6A dışında. Yalnız not.

### D. d10 (alt ajan; ayrıntı `scratchpad/denetim/a6a/alt_d10.md`)
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

---

## Alan 6 — Türkçe yazım, PARÇA B (Urania v39 denetimi, 2026-10-30)

Kapsam: sıradaki 16–30. dersler — d38 d39 d40 d41 d19 d42 d43 d23 d4 d14 d5 d15 d6 d45 d16 — ve bunların sınav soruları.

### Okunan dosyalar
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

### Yöntem
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

### Bulgular

#### A6B-01 · ÖNEMLİ · d15.json:192
- Açıklama: Ders, okuru uygulamada var olmayan bir sekmeye gönderiyor. Akılda notu: "kararmalarını uygulamanın Gözlem sekmesinden takip et". Uygulamada "Gözlem" adlı sekme yok; Algol'ün kararmaları Gökyüzü sekmesinde. Aynı bölüm (d15.json:184) doğru yazıyor: "Urania'nın Gökyüzü sekmesindeki “Yaklaşan olaylar” bölümü".
- Kanıt:
  - index.html:27–32 sekmeleri sıralıyor: Gökyüzü, Deneyler, Dersler, Defter, Hesap, Haberler.
  - gozlem.js:91 "Saati belli olaylar (uydu geçişi, Algol, örtme) kendi saatinde"; gozlem.js:1203 `U.modul('gok', …)`.
  - `grep -o "Gözlem sekme" d15.json` → 192. satır.
- Önerilen düzeltme: "uygulamanın Gökyüzü sekmesinden takip et".

#### A6B-02 · ÖNEMLİ · d45.json:127, 133, 135, 155, 156, 160, 163, 183, 190, 211 ↔ 289, 313, 325, 435, 451, 452, 508
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

#### A6B-03 · KÜÇÜK · d15.json:78, d15.json:186
- Açıklama: Yanlış sözcük (makine çevirisi kokusu). "çiftlik" Türkçede tarım işletmesidir; "binarity / çift olma" anlamı yok.
  - 78: "Kısacası Güneş gibi yıldızlarda çiftlik yaygın, küçük yıldızlarda daha seyrek."
  - 186: "Galileo'nun teleskoplarından biriyle Mizar'a bakıp çiftliği gördü"
- Kanıt: GTS "çiftlik" → "Tarım yapılan, hayvan yetiştirilen, çalışanlarının da oturması için gerekli yapıları olan…".
- Önerilen düzeltme:
  - 78: "Güneş gibi yıldızlarda çift olmak yaygın"
  - 186: "Mizar'a bakıp onun çift olduğunu gördü"

#### A6B-04 · KÜÇÜK · d39.json:17
- Açıklama: Bozuk cümle. "Süperkritik akışkan, basınç ve sıcaklık öyle yükselmiştir ki sıvı ile gaz arasındaki fark kaybolmuştur; ne kaynar ne yoğunlaşır." cümlesinde "Süperkritik akışkan" öznesinin yüklemi yok. "yükselmiştir" yüklemi "basınç ve sıcaklık"a bağlanıyor.
- Önerilen düzeltme: "Süperkritik akışkanda basınç ve sıcaklık öyle yükselmiştir ki sıvı ile gaz arasındaki fark kaybolmuştur; ne kaynar ne yoğunlaşır."

#### A6B-05 · KÜÇÜK · d19.json:435 (sözlük tanımı, kid'li öğe)
- Açıklama: Bozuk tamlama. Tanım şöyle: "Bir yüzeyin üstüne düşen ışığın geri yansıttığı kesir". Bu dizilişte "yansıttığı"nın öznesi "ışık" oluyor; oysa yansıtan yüzeydir. Aynı ders 44. satırda doğru kalıbı kullanıyor.
- Önerilen düzeltme: "Bir yüzeyin, üstüne düşen ışığın ne kadarını geri yansıttığını gösteren kesir; …". Kid değişmez, yalnız metin düzeltilir.

#### A6B-06 · KÜÇÜK · d39.json:145
- Açıklama: Yanlış ek. "ince, küresel bir kabuk biçimindeki elektriği iletken bir akışkanda". "iletken" sıfattır, belirtme durumunda nesne ("elektriği") alamaz. Aynı ders 21. satırda doğru biçimi ("elektriği ileten") kullanıyor.
- Önerilen düzeltme: "elektriği ileten bir akışkanda".

#### A6B-07 · KÜÇÜK · d41.json:78
- Açıklama: Yanlış ek dizilişi. "yüzey yüz binlerce yıllık kadar gençtir". "-lık" sıfat ekinden sonra "kadar" edatı gelmez.
- Önerilen düzeltme: "yüzey yüz binlerce yıl kadar gençtir".

#### A6B-08 · KÜÇÜK · d45.json:210
- Açıklama: Eksik ilgi eki. "bulutsunun çoğu dürbünün sınırında olduğunu söyler". "-dığını" yan cümlesinin öznesi ilgi eki almalı.
- Önerilen düzeltme: "bulutsunun çoğunun dürbünün sınırında olduğunu söyler".

#### A6B-09 · KÜÇÜK · d45.json:89
- Açıklama: "bir sonraki bölümlerdeki kütle ve yarıçap ölçümleri". "bir sonraki" tekil bir öğe belirtir, çoğul adla birlikte kullanılmaz.
- Önerilen düzeltme: "sonraki bölümlerdeki kütle ve yarıçap ölçümleri".

#### A6B-10 · KÜÇÜK · d45.json:484 (soru cevabı, kid'li öğe)
- Açıklama: Noktalama. "…gerekir; bu kabuğun kütleçekim dalgası yayabilecek dağlar taşıyıp taşıyamayacağını etkiler." Virgül olmadığı için "bu kabuğun" sıfat tamlaması gibi okunuyor ve cümlenin öznesi kayboluyor.
- Önerilen düzeltme: "…gerekir; bu, kabuğun kütleçekim dalgası…"

#### A6B-11 · KÜÇÜK · d40.json:115, d40.json:129
- Açıklama: Belirtisiz tamlamada iyelik eki eksik.
  - 115: "en üstte buz kabuk."
  - 129: "buz kabuk kayalık çekirdeğe sıkıca bağlı olsaydı"
  - Aynı ders başka yerlerde doğru yazıyor: "buz kabuğu" (6, 65).
- Önerilen düzeltme: "buz kabuğu".

#### A6B-12 · KÜÇÜK · d38.json:88, 95, 188, 197
- Açıklama: "gündönümü" bitişik yazılmış:
  - 88: "kuzey yaz gündönümüne doğru"
  - 95: "2017 yaz gündönümünde"
  - 188: "Kuzey yarıkürenin yaz gündönümü"
  - 197: "kuzey yaz gündönümü"
  - TDK sözcüğü ayrı yazar. Komşu ders d39 da ayrı yazıyor (105, 113, 325: "gün dönümü"). Bütün derslerde sayım: "gündönüm" 39, "gün dönüm" 5.
- Kanıt: GTS "gün dönümü" → madde var; "gündönümü" → `{"error":"Sonuç bulunamadı"}`.
- Önerilen düzeltme: "gün dönümü / gün dönümüne / gün dönümünde".

#### A6B-13 · KÜÇÜK · hal ↔ hâl (d14, d5, d15, d6, d16)
- Açıklama: "durum" anlamındaki "hâl" düzeltme işaretsiz yazılmış ("hal" pazar yeri, çözme ya da tahttan indirme demektir). Bu derslerin çoğu aynı sözcüğü başka yerlerde "hâl" yazıyor, yani ders içinde de tutarsızlık var. Bütün derslerde sayım: hal-/hale/halinde/halde 79 ↔ hâl- 186.
  - d14: 94, 98 ("gruplar/kümeler halinde"), 422 ("olduğu halde"), 432 ("yatkın hale"), 437. Aynı derste doğru yazılan yerler: 121, 305 "hâlinde".
  - d5: 27, 518, 564 ("olduğu halde"), 28 ("o halde"), 59, 91 ("konvektif hale"). Doğru yazılan: 17 "hâline".
  - d15: 6, 27, 498 ("kümeler halinde"), 56 ("olduğu halde"), 109 ("haline"), 204 ("hali"), 541 ("halinde"). Doğru yazılan: 124, 131, 142, 147, 199. 18 ve 499. satırlardaki "hale" halo anlamında, doğru.
  - d6: 26, 101, 415 ("hale gel-"), 75, 87, 124 ("halinde"), 94, 159 ("o halde"), 152 ("hali").
  - d16: 25 ("O halde"), 519 ("olduğu halde"; soru metni, kid'li öğe). Doğru yazılan: 116, 539, 555 "hâlde".
- Kanıt: GTS "hal" → "Çözme…", "Sebze, meyve… satıldığı yer", "Tahttan indirme"; "hâl" → durum.
- Önerilen düzeltme: hepsi "hâl / hâle / hâlinde / hâlde / hâli".

#### A6B-14 · KÜÇÜK · dahil → dâhil (10 yer)
- Açıklama: Satırlar: d38:45, d39:137, d41:190, d43:55, 83, 110, d23:97, 186, d5:137, d6:14 (ör. d6:14 "Güneş de dahil"). Bütün derslerde 29 "dahil" var, hiç "dâhil" yok. Ama proje aynı türden sözcüklerde düzeltme işaretini kullanıyor (hâlâ, hâl, resmî, askerî).
- Kanıt: GTS "dahil" sorgusu madde olarak "dâhil" döndürüyor.
- Önerilen düzeltme: "dâhil".

#### A6B-15 · KÜÇÜK · Tarih bildirmeyen ay adları (büyük harf ve kesme)
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

#### A6B-16 · KÜÇÜK · d15.json:188
- Açıklama: Yumuşama eksik. "İki kaynak küçük bir teleskopun yettiğinde birleşir". Aynı paragrafın sonunda doğru biçim var: "teleskobun ayırma gücüyle".
- Kanıt: GTS "teleskop" → `"taki":"bu"`.
- Önerilen düzeltme: "teleskobun".

#### A6B-17 · KÜÇÜK · d43.json:60
- Açıklama: Kesme işaretinden sonraki ek ünlü uyumuna uymuyor. "8,99 × 10¹⁶ J'ün". J "jul" diye okunur, kalın ünlü ister. Aynı ders 208. satırda doğru yazıyor: "Joule'dan". Sesli okuyucu bu eki düzeltmiyor: `okunus("J'ün") => J'ün`.
- Önerilen düzeltme: "J'un".

#### A6B-18 · KÜÇÜK · d16.json:107
- Açıklama: Kesme işaretinden sonraki ek yanlış. "Sgr A*'tan yaklaşık 1.600 kat büyük". Uygulama bu adı "Sgr A yıldız" diye okuyor (`okunus("Sgr A*'tan") => Sgr A yıldızdan`). "yıldız" yumuşak ünsüzle bittiği için ek -dan olmalı. Aynı ders başka yerde "Sgr A*'ın" yazıyor.
- Önerilen düzeltme: "Sgr A*'dan".

#### A6B-19 · KÜÇÜK · d40.json:58
- Açıklama: Ortak isme kesme işareti konmuş. "yaklaşık 10 terawatt'tır". Birim adı özel ad ya da kısaltma değildir; kesme ancak kısaltmada gerekir ("10 TW'tır").
- Önerilen düzeltme: "10 terawatttır" ya da "10 TW'tır".

#### A6B-20 · KÜÇÜK · d23_sinav.json:50
- Açıklama: Kesme işaretinden sonraki ek yanlış. "Kessler ve Cour-Palais'in". Fransızca ad [kur pale] okunur, yani ünlüyle biter; ilgi eki -nin olmalı.
- Önerilen düzeltme: "Cour-Palais'nin".

#### A6B-21 · KÜÇÜK · d43.json:32 (iki yerde), d43.json:34
- Açıklama: Noktadan sonra yeni cümle küçük harfle başlıyor:
  - 32: "…diye tanımlar). eksi 14 kadirlik bir bolit"
  - 32: "…10.000 kat. eksi 17 kadirlik bir süper bolit"
  - 34: "…ateş topu olur. eksi 14 kadirden parlak olana bolit"
- Önerilen düzeltme: "Eksi …".

#### A6B-22 · KÜÇÜK · d23.json:111
- Açıklama: Noktalı virgülden sonra büyük harf kullanılmış: "4,3 km/s ister; Aynı tablo, kaçış hızına ek olarak".
- Önerilen düzeltme: "; aynı tablo".

#### A6B-23 · KÜÇÜK · d23.json:494 (soru metni, kid'li öğe)
- Açıklama: Soru cümlesi virgülle bitirilip emir cümlesine bağlanmış: "Tiangong neden İstanbul'un tam tepesinden geçebilir, ISS ile karşılaştır." Aynı dosyadaki öteki sorular "? …" kalıbını kullanıyor (454, 464, 474).
- Önerilen düzeltme: "…geçebilir? ISS ile karşılaştır."

#### A6B-24 · KÜÇÜK · Gönderme yapılan ders sırada sonra geliyor ama "gördün / gördük" deniyor
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

#### A6B-25 · KÜÇÜK · Sayı biçimi: binlik nokta (kılavuz: "binlik nokta (1.988, 0,39)")
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

#### A6B-26 · KÜÇÜK · Aynı derste aynı terimin farklı yazılışı
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

#### A6B-27 · KÜÇÜK · Dersler arasında terim yazımı (TDK ile karşılaştırmalı)
- Açıklama:
  - "güneş rüzgârı": d23 cümle ortasında 6 kez küçük harfle (166, 173, 416, 500) yazıyor. d4 (7), d42 (11), d39 (4), d19 (2), d40 (1) cümle ortasında "Güneş rüzgârı" yazıyor. Kılavuzun d4 tanımı küçük harf kullanıyor ("güneş rüzgârı"). Hangisi seçilecekse bütün derslere uygulanmalı.
  - "göktaşı" ↔ "gök taşı": d41_sinav.json:6 "gök taşı"; öteki bütün dersler "göktaşı" (111 kez). Yardımcının "gök taşı yanlış" önerisi düşürüldü: GTS'de madde "gök taşı" (ayrı), "göktaşı" yok. Yani aykırı olan proje çoğunluğu; tutarlılık için bir karar gerekiyor.
  - "karbondioksit" (d40:127; d35, d36, d44 sınavları) ↔ "karbon dioksit" (d42:37, 52; bütün derslerde 51'e karşı 4). GTS'de madde "karbondioksit" (bitişik). Yardımcının "karbon dioksit olmalı" önerisi düşürüldü; aykırı olan d42.
  - "joule" ↔ "jul": d6:75 "joule", d45:160 "jul", d43 "Joule'dan" ve "J'ün". Bütün derslerde ikisi karışık ("joule" 22, "jul" 3 kez sözcük olarak).
- Önerilen düzeltme: Kılavuza tek biçim yazılmalı. TDK'ye göre: gök taşı, karbondioksit.

#### A6B-28 · KÜÇÜK · Sözlük terimlerinin baş harfi (kid'li öğeler)
- Açıklama: Kılavuz (v3 bölümü, satır 87) şöyle diyor: "terimi metinde geçtiği yalın biçimiyle yaz ("kırmızı dev", "anakol")". Buna göre özel ad olmayan terimler küçük harfle başlamalı.
  - Üç dersin sözlüğü kendi içinde karışık:
    - d19: 15 büyük ("Asteroit", "Kuyruklu yıldız", "Koma", "Meteoroit" …) / 6 küçük
    - d15: 14 büyük ("Açık küme" …) / 9 küçük ("gelgit kuyruğu", "nova" …)
    - d16: 11 büyük ("Kaçış hızı", "Olay ufku" …) / 8 küçük ("foton küresi", "gölge" …)
  - Bütün terimleri büyük harfle başlatan dersler: d38, d23, d4, d14, d5, d6.
  - Kılavuza uygun olarak küçük harf kullanan dersler: d39–d43 ve d45.
- Kanıt: Betik her dersin `sozluk[].terim` alanını saydı; ilk sözcüğü kısaltma ya da özel ad olanları ayırdı.
- Önerilen düzeltme: Terim metni kılavuza göre küçük harfle başlamalı, özel adlar hariç. Kılavuzun kuralı gereği kid değişmez.

#### A6B-29 · KÜÇÜK · d45.json:24 — bölüm başlığı (başlık: kid bağımlı)
- Açıklama: "1967: Kayıt kâğıdındaki pürüz". 15 dersteki bütün bölüm başlıklarında iki noktadan sonraki ad öbeği küçük harfle sürüyor (ör. d45:46 "Deniz feneri: atarca nasıl atar?", d45:179 "Hulse–Taylor ve çift atarca: Einstein'ın…"); burada büyük harf kullanılmış. İki noktadan sonra gelen öbek tam cümle ya da alıntı değil.
- Önerilen düzeltme: "1967: kayıt kâğıdındaki pürüz". **Başlık değişirse tekrar kartı / bolum_esle eşlemesi kırılır;** başlığa dokunulacaksa eşleme betiğiyle birlikte yapılmalı. Ders başlıkları (baslik alanı) ise 15 derste ve bütün derslerde aynı düzende (her sözcük büyük, "ve / ile" küçük); orada sorun yok.

### Askıda
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

---

## Alan 6 — Türkçe yazım, Parça C (Urania v39 denetimi, 2026-10-30)

Kapsam: d46 d47 d7 d48 d49 d57 d58 d8 d17 d20 d13 d18 d30 d33 (ders sırasında 31–44) ve sınav soruları. d7, d8, d13, d17 ve d18'in kendi `dNN_sinav.json` dosyası yok. Bu derslerin soruları veri/sinavlar.json'dan okundu: evren-01…04 d7'nin, evren-05…12 d8 ile d17'nin, gezegen_yasam-01…12 d13 ile d18'in.

### Okunan dosyalar

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

### Yöntem

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

### Bulgular

Bu alanın bulguları yazım bulgusudur, varsayılan önem KÜÇÜK'tür. Anlamı tersine çeviren, sınavda doğru şıkkı bozan ya da soru ile cevap arasında sayı çelişkisi yaratanlar ÖNEMLİ sayıldı.

#### A6C-01 · ÖNEMLİ · d13.json:252, 433, 434
- **Açıklama:** Güneş'in yaşanabilir bölgesinin dış sınırı aynı derste iki farklı sayıyla geçiyor.
  - Anahtar sayı (252) ve soru (433) "0,99–1,67 AB" diyor; soru açıkça "(Güneş için 0,99–1,67 AB al.)" diye yazıyor.
  - Aynı sorunun cevabı (434) 1,70 ile hesaplıyor: "1,70 × 2 = 3,4 AB".
  - Paragraf 102, örnek 108 ve defter notu 407 de "0,99 ile 1,70 AB" diyor.
  - Okur sorunun verdiği sayıyla hesap yaparsa cevaptan farklı sonuç bulur.
- **Kanıt:** `grep -n "1,67\|1,70" arastirma/dersler_v2/d13.json`. Alt ajan 3 satırları okudu; ben 433/434 çelişkisini doğruladım.
- **Önerilen düzeltme:** Kaynağa (Kopparapu 2013) bakılarak tek bir değer seçilmeli ve soru, cevap ve anahtar sayı buna eşitlenmeli. Hangi değerin doğru olduğu bu denetimin kapsamı dışında; o kısım Askıda.

#### A6C-02 · ÖNEMLİ · d48.json:169
- **Açıklama:** Yanlış ek anlamı tersine çeviriyor.
- **Kanıt:** "…kara delik, galaksisi ona izin verdiği kadar büyür, galaksi de kara deliği izin verdiği kadar yıldız yapar." Metin grep ile doğrulandı.
- **Önerilen düzeltme:** "…galaksi de kara deliğin izin verdiği kadar yıldız yapar." Sıfat-fiil cümleciğinin öznesi ilgi hâli alır. İlk yarıdaki "galaksisi"nin "galaksisinin" olması önerisi Askıda.

#### A6C-03 · ÖNEMLİ · d57_sinav.json:22
- **Açıklama:** Sınavın doğru şıkkı yarım kalmış. "tayfı … ideal bir kara cisim" denince tayf ile cisim eşitlenmiş oluyor.
- **Kanıt:** "…toz topaklarının toplamıyla elde edilemeyecek kadar ideal bir kara cisim". Dersteki karşılığı (d57.json:460) "…ideal bir kara cisim tayfı" diye bitiyor.
- **Önerilen düzeltme:** Şıkkın sonuna "tayfı" eklenmeli.

#### A6C-04 · ÖNEMLİ · d58.json:104
- **Açıklama:** Aletin adı yanlış çevrilmiş. "Differential Microwave Radiometer" (DMR) "farklı mikrodalga radyometresi" olmuş. Aynı paragraf aletin iki yön arasındaki farkı ölçtüğünü anlattığı için ad metinle çelişiyor.
- **Kanıt:** "…George Smoot'un sorumlu olduğu DMR'ydi: farklı mikrodalga radyometresi." Metin grep ile doğrulandı.
- **Önerilen düzeltme:** "diferansiyel (fark ölçen) mikrodalga radyometresi".

#### A6C-05 · KÜÇÜK · d47.json:14 (başlık: kid bağımlı)
- **Açıklama:** Bölüm başlığı "Saman yolu: gökteki ışık kuşağı". Ders aynı adı 54 kez "Samanyolu" yazıyor ve korpusta "Saman Yolu" biçimi yok. 18. satırdaki "saman yolu anlamına gelen adlar" ise sözcük anlamı veriyor, o doğru.
- **Önerilen düzeltme:** "Samanyolu: gökteki ışık kuşağı". Başlık değişirse araclar/bolum_esle.py eşlemesi ve tekrar kartları etkilenir, karar koordinatörde.

#### A6C-06 · KÜÇÜK · d49.json:13 (başlık: kid bağımlı) + dağınık "hal-" yazımları
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

#### A6C-07 · KÜÇÜK · kurum adlarına kesme (tüm dersler)
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

#### A6C-08 · KÜÇÜK · "dahil" → "dâhil"
- **Geçişler:** d47:63, d7:114, d48:258, d49:520, d57:46, 61, 110, d17:165 ("dahildir"), d20:6, d13:116, d18:107. Korpusta 29 geçişin hepsi "dahil".
- **Kanıt:** sozluk.gov.tr gts → madde "dâhil".
- **Önerilen düzeltme:** "dâhil". Korpus genelinde toplu düzeltme önerilir.

#### A6C-09 · KÜÇÜK · "yarımküre" → "yarım küre"
- **Geçişler:**
  - d47:18, 205 ("kuzey yarımkürede")
  - d47_sinav.json:7
  - d7:54, 57
  - d7:83 ("Güney Yarımküre'de"; burada büyük harf ve kesme de gereksiz)
  - d13:196
  - d48_sinav.json:51 ("güney yarıküresinden"; burada "yarım" da yanlış)
- **Kanıt:** sozluk.gov.tr: "yarım küre" maddesi var; "yarımküre" ve "yarıküre" yok.
- **Önerilen düzeltme:** "kuzey yarım kürede", "güney yarım küreden".

#### A6C-10 · KÜÇÜK · ay adları (belirli tarih bildirmeyen)
- **Açıklama:** Tarih bildirmeyen ay adları büyük harfle ve kesmeyle yazılmış. Geçişler:
  - d46:192 "en iyi Mayıs'ta gözlendiğini"
  - d8:165 ve 531 "Temmuz'da"
  - d17:92 "en iyi Kasım'da"
  - d13:168 "en iyi Kasım'da"
  - d48:198 "en kolay Aralık'ta"
  - d48:195 "Mart–Temmuz arasında"
- **Kural:** TDK büyük harfler kuralı: ay adları yalnız belirli bir tarih bildirirken büyük harfle yazılır. Aynı dersler doğru örnekler de içeriyor: d7:160 "mart ile haziran", d13:153 "eylül, ekim ve kasım akşamlarında".
- **Önerilen düzeltme:** "mayısta", "temmuzda", "kasımda", "aralıkta", "mart–temmuz". d8'deki kozmik takvim kullanımları ("Eylül ortasına", "Ocak'ın son haftasında") Askıda.

#### A6C-11 · KÜÇÜK · noktalı virgülden sonra büyük harf
- **Geçişler:**
  - d46:158 "…yaklaşık 100 olay biliniyor; Onları bulan araçlar…" → "; onları"
  - d20:70 "…oranı yaklaşık 380 verir; Kaynakların verdiği…" → "; kaynakların"

#### A6C-12 · KÜÇÜK · eksik / yanlış ek, bozuk cümle (doğrulanmış)
- d13:89 "tüm gezegenlerin ancak yaklaşık %1'i olduklarını düşünülür" → "oldukları düşünülür".
- d49:16 "geniş galaksi yaprakların duvar olduğu" → "yapraklarının".
- d57:88 "kuasarların ve radyo galaksilerin yalnızca…" → "radyo galaksilerinin".
- d30:332 (sözlük, kalorik): "ısının sanıldığı ağırlıksız, görünmez akışkan". Burada bir öge düşmüş, doğrusu "ısının öyle olduğu sanılan" ya da "ısı sanılan".

#### A6C-13 · KÜÇÜK · sözlükte olmayan / yanlış birleşik yazımlar
- d57:124 "gökcisimlerinde" ve d18:375 (sözlük tanımı) "gökcismi" → "gök cismi". sozluk.gov.tr'de madde "gök cismi"; aynı dersler başka yerlerde ayrı yazıyor, örneğin d18:425 "gök cisminden".
- d18:16 "Bilimkurgunun" → "Bilim kurgunun".
- d20:16, 66, 77 "elyazması / elyazmalarında" → "el yazması". sozluk.gov.tr'de madde "el yazması", "elyazması" yok. Aynı ders 157. satırda "el yazması" diye ayrı yazıyor.
- d33:129 "radyo teleskopuyla" → "teleskobuyla". sozluk.gov.tr: teleskop, -bu. Korpusun geri kalanı hep "teleskobu".
- d58:91 "Güneş eşzamanlı bir yörünge" → "eş zamanlı". Alt ajan 2 sozluk.gov.tr'yi sorguladı. Not: YAZIM_KILAVUZU.md'nin kendisi de d23 tanımında "Güneş eşzamanlı" yazıyor.

#### A6C-14 · KÜÇÜK · kesme işareti ve özel adlara gelen yapım/çokluk ekleri
- d47:16 "Ay'sız bir yaz gecesi" → "aysız". TDK'ye göre özel ada gelen yapım eki kesmeyle ayrılmaz. sozluk.gov.tr'de madde küçük harfle "aysız" (alt ajan 2 sorguladı). Aynı nedenle büyük harfli "Aysız" geçişleri de "aysız" olmalı: d7:27, 85; d17:92, 99; d20:202.
- d30:155 "Cambridge'li gökbilimci" → "Cambridgeli" (yapım eki).
- d7:143 "Tip 1 Seyfert'lerin", "Seyfert'tir" → "Seyfertlerin". TDK'ye göre çokluk eki ve ardından gelen ekler kesmeyle ayrılmaz. "Seyfert'tir" bildirme eki olduğu için kesmeli kalabilir; düzeltilecek olan çokluklu biçim.

#### A6C-15 · KÜÇÜK · simge/kısaltma eklerinde ders içi ve dersler arası tutarsızlık
- d46:20 "10⁵ M☉'ten" ↔ aynı derste 119, 121, 480 "M☉'den". Okunuş "Güneş kütlesinden" olduğu için doğrusu "M☉'den".
- d7:197, 235 "Sgr A*'nın" ↔ d46:52, 59, 66, 90, 191 "Sgr A*'ın", d46:17, 96 "A*'ı", d46:50, 456 "A*'a". okunus.js "Sgr A*"yı "… yıldız" diye okuyor (okunus.js:105). Doğrusu "Sgr A*'ın".
- d30:58 "kozmik arka planın 2,725 K'inde" ↔ d58 ve d30'daki "K'nin", "K'ye" biçimleri. TDK büyük harfli kısaltma kuralına göre son harf ("ke") esas alınır: "K'sinde".
- d58:52 "APS ve PBS'in sayfaları" → "PBS'nin" (son harf S = "se").
- d58_sinav.json:26 "BOOMERanG'in" → "BOOMERanG'ın". Ad sözcük gibi, "bumerang" diye okunur.
- d33:157 "Illinois'deki" → "Illinois'daki". Okunuş "ilinoy", son ünlü kalın.

#### A6C-16 · KÜÇÜK · aynı terimin farklı yazılışı
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

#### A6C-17 · KÜÇÜK · sözlük terimlerinin büyük harfle başlaması (kılavuza aykırı)
- **Açıklama:** Kılavuzun v3 bölümü, satır 87: "terimi metinde geçtiği yalın biçimiyle yaz ('kırmızı dev', 'anakol')". Bu kurala uymayan dersler:
  - d7: 17 terimin 16'sı büyük harfle (Galaksi, Hale, Kuasar, Üstküme …).
  - d8: 21/22 (Şişme, Plazma, Döteryum …).
  - d13: 17/17 (Ötegezegen, Astrometri, Koronagraf …).
  - d17: 14/23; aynı sözlükte "maviye kayma", "özel hız" küçük harfle, yani karışık.
  - d18: 13/19.
  - Karşılaştırma: d46, d47, d20, d30 ve d33'te büyük harf yalnız özel adlarda.
  - Kanıt: `python` ile `j["sozluk"]` tarandı.
- **Önerilen düzeltme:** Terimler küçük harfe çevrilmeli, özel adlar ("Büyük Patlama", "Olbers paradoksu") korunmalı; kid alanına dokunulmamalı. Altı noktalı eşleme büyük/küçük harfe duyarsızsa sorun yalnız görünüm sorunudur.

#### A6C-18 · KÜÇÜK · noktalama
- **"ve"den önce virgül:** d49:207 "gittiğini, ve 321 milyon…" ve d30:205 "henüz kesin değil, ve evrenin sonu…" → virgüller kalkmalı.
- **Noktalı virgülden önce boşluk:** d30:261 "4,41 J/kalori (1845) ; bugün" → "(1845); bugün".
- **Cümle başı küçük harf:**
  - d49:158: "Boşlukların … büyüktür. van de Weygaert'in" → "Van de Weygaert'in".
  - d47:19: "el-Biruni onu sayısız…" → "El-Biruni". d20 cümle başında hep "El-" yazıyor.

### Askıda

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

---

## Alan 6 — Türkçe yazım, Parça D (Urania v39 denetimi, 2026-10-30)

Dersler: d25 d26 d27 d28 d29 d31 d32 d50 d51 d54 d52 d56 d53 d55 (sıradaki 45–58. dersler) ve bunların `_sinav.json` dosyaları.
Satır numaraları `arastirma/dersler_v2/dNN.json` (ya da `dNN_sinav.json`) dosyasının satırıdır.

### Okunan dosyalar

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

### Yöntem

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

### Bulgular

#### A6D-01 · ÖNEMLİ · d32.json:133, d32.json:438
- **Açıklama:** "Uzun Kapanma 3" adı ile tarih arasına virgül konmamış. Cümle "3 Temmuz 2026" tarihi gibi okunuyor; sesli okumada da öyle duyulur.
  - Metin: "LHC için Uzun Kapanma 3 Temmuz 2026 başında başlayacak"
  - Defter notu: "Uzun Kapanma 3 Temmuz 2026, Yüksek Parlaklıklı LHC Haziran 2030"
  - Kastedilen "Uzun Kapanma 3, Temmuz 2026 başında". Aynı dersteki d32:140 ("Temmuz 2026'dan beri Uzun Kapanma 3'te") ve d32:288 ("Temmuz 2026 → Haziran 2030") de bunu gösteriyor.
- **Kanıt:** d32.json:133 ve 438 (alıntılar yukarıda).
- **Önerilen düzeltme:**
  - 133: "LHC için Uzun Kapanma 3'ün Temmuz 2026 başında başlayacağını…"
  - 438: "Uzun Kapanma 3: Temmuz 2026'dan itibaren"

#### A6D-02 · ÖNEMLİ · d50.json:67, d54.json:173, d55.json:97, d55.json:103
- **Açıklama:** Kozmolojinin standart modeli (ΛCDM), açıklamasız ve küçük harfle "standart model" diye anılıyor. Aynı derslerde "Standart Model" büyük harfle parçacık fiziği modelidir. Sesli dinlemede büyük/küçük harf ayrımı duyulmaz.
  - d50:67 (akılda): "Soğuk karanlık madde standart modelin parçasıdır."
  - Bu akılda satırı, aynı derste d50:50'deki "Standart Model'deki parçacıkların hiçbiri bütün bu koşulları karşılamaz" cümlesiyle ve d32'deki "Standart Model'de karanlık madde olabilecek … parçacık yoktur" bilgisiyle çelişiyor gibi okunur.
  - d50:144'teki "standart model, yani ΛCDM" açıklaması bu satırdan **sonra** geliyor.
  - d54:173: "veriler standart modele çarpışma eklemeyi gerektirmiyor"
  - d55:97: "standart modelle açıklanabilir"
  - d55:103: "standart modele uyuyorlar"
- **Kanıt:** satırlar yukarıda; `terim.py` çıktısı: "standart model" küçük harf 5 kez (d50, d54, d55), "Standart Model" 57 kez.
- **Önerilen düzeltme:** "standart kozmoloji modeli (ΛCDM)" ya da "ΛCDM modeli". d50 sözlüğü de bu biçimi kullanıyor: d50:319 "standart kozmoloji modelinin".

#### A6D-03 · KÜÇÜK · d27.json:18
- **Açıklama:** Eksik ek.
  - Metin: "Bu çıkmaza sonradan morötesi felaketi adı verildi; adı 1911'de fizikçi Paul Ehrenfest koydu."
- **Önerilen düzeltme:** "adını 1911'de fizikçi Paul Ehrenfest koydu." Aynı bilgi d27:322'de doğru: "adını 1911'de Ehrenfest koydu".

#### A6D-04 · KÜÇÜK · d25.json:62
- **Açıklama:** Eksik iyelik eki.
  - Metin: "Yolcu da kendi trenin ortasındadır"
- **Önerilen düzeltme:** "Yolcu da kendi treninin ortasındadır".

#### A6D-05 · KÜÇÜK · d54.json:171
- **Açıklama:** Bozuk cümle: "-dığını ki" yapısı yanlış.
  - Metin: "şişmenin o kadar esnek olduğunu ki hiçbir deneyin onu çürütemeyeceğini öne sürdüler."
- **Önerilen düzeltme:** "şişmenin, hiçbir deneyin çürütemeyeceği kadar esnek olduğunu öne sürdüler."

#### A6D-06 · KÜÇÜK · d53.json:475
- **Açıklama:** Eksik ek.
  - Metin: "bir radyo antenin tek tek fotonları saymaması gibi"
- **Önerilen düzeltme:** "bir radyo anteninin tek tek fotonları saymaması gibi". Aynı ders d53:71'de doğru yazıyor: "Bir radyo anteni de radyo dalgasını ölçer".

#### A6D-07 · KÜÇÜK · d53.json:88
- **Açıklama:** Özne–yüklem uyumsuzluğu (tekil özne, çoğul yüklem).
  - Metin: "Fazladan boyut, bildiğimiz üç uzay ve bir zaman boyutuna ek olarak varsayılan ve günlük hayatta fark edilmeyen boyutlardır."
- **Önerilen düzeltme:** "… fark edilmeyen boyuttur." (Sözlükteki tanım d53:361 tekil.)

#### A6D-08 · KÜÇÜK · d28.json:134
- **Açıklama:** Yanlış çatı.
  - Metin: "Toplam spini sıfır olan bir çift elektron oluştursun ve biri İstanbul'a, öteki Ankara'ya gitsin."
  - "oluştursun" geçişli ("birileri oluştursun"); kastedilen "bir çift elektron oluşsun".
- **Önerilen düzeltme:** "… bir çift elektron oluşsun ve …"

#### A6D-09 · KÜÇÜK · d28.json:173
- **Açıklama:** Yanlış sözcük. "artı" ("+") yerine "artış" kastedilmiş.
  - Metin (akılda): "LIGO kuantum gürültüsünü sıkıştırılmış ışıkla azaltır (menzil %12–14 artı)."
  - d28:169 ve d28:298'de doğrusu: "artırıp", "%12–14 menzil".
- **Önerilen düzeltme:** "(menzilde %12–14 artış)".

#### A6D-10 · KÜÇÜK · d31.json:78
- **Açıklama:** Anlamca yanlış sözcük. "Karşılaştırmak" = kıyaslamak. Kastedilen, lityumun nötronlarla ışınlanması ya da bombardımanı.
  - Metin: "Trityum doğada hazır bulunmaz; Wikipedia'ya göre lityumu enerjik nötronlarla karşılaştırarak üretilir."
- **Önerilen düzeltme:** "… lityumu enerjik nötronlarla ışınlayarak (bombardıman ederek) üretilir."

#### A6D-11 · KÜÇÜK · d27.json:273
- **Açıklama:** Ek uyumu hatası. Å "angström" okunur (TDK GTS madde başı: angström); son ünlü "ö", bu yüzden "-deki" gelmeli. Aynı satırda binlik noktası da eksik (bkz. A6D-21).
  - Metin: "Sıfır kadirlik (Vega ölçekli) bir yıldızın 5556 Å'daki foton akısı"
- **Önerilen düzeltme:** "5.556 Å'deki"
- **Kural:** https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/ (kısaltmalara gelen ekler okunuşa uyar)

#### A6D-12 · KÜÇÜK · d25.json:181 (akılda)
- **Açıklama:** Birim kısaltmasının eki okunuşa uymuyor. J "jul" okunur (okunus.js:26 `J: 'jul'`; TDK GTS: jul), bu yüzden "-dür" gelmeli.
  - Metin: "1 kg yaklaşık 9 × 10¹⁶ J'dir."
- **Önerilen düzeltme:** "J'dür" (ya da "9 × 10¹⁶ jul eder").

#### A6D-13 · KÜÇÜK · d25.json:202
- **Açıklama:** Ek uyumu hatası. CERN "sern" okunur; aynı ders ve d32 hep "CERN'in", "CERN'de", "CERN'e" yazıyor.
  - Metin: "Türkiye 6 Mayıs 2015'te CERN'ün ortak üyesi oldu"
- **Önerilen düzeltme:** "CERN'in ortak üyesi oldu" (d32:134 aynı cümleyi doğru yazıyor).

#### A6D-14 · KÜÇÜK · d32.json:188
- **Açıklama:** Cins ada kesme işareti konmuş.
  - Metin: "bir proton, bir kaon ve iki pion'a bozunmasını"
- **Önerilen düzeltme:** "iki piona"
- **Kural:** kesme işareti özel adlara ve kısaltmalara gelen eklerde kullanılır; https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/

#### A6D-15 · KÜÇÜK · d50.json:97
- **Açıklama:** Cins ada kesme işareti konmuş. Başka yerlerde "sigmayı", "sigmalık" kesmesiz yazılıyor.
  - Metin: "Sigma'yı d32'de gördün"
- **Önerilen düzeltme:** "Sigmayı d32'de gördün".

#### A6D-16 · KÜÇÜK · d31.json:194 (ve aynı paragrafın devamı)
- **Açıklama:** Birim adına kesme işareti konmuş. Aynı derste "milisieverttir" (d31:196) kesmesiz yazılmış; tutarsız.
  - Metin: "Birimi sievert'tir; … milisievert, yani sievert'in binde biri kullanılır."
  - Sözlükte de: d31:421 "Etkin doz birimi sievert'in binde biri".
- **Önerilen düzeltme:** "sieverttir", "sievertin".

#### A6D-17 · KÜÇÜK · d29.json:18, 40, 51, 135, 440
- **Açıklama:** "hal" (pazar yeri) ile "hâl" (durum) karıştırılmış. d29 dışındaki 13 dosyanın hepsi "hâl" yazıyor (`grep`: d25'te 19, d32'de 12, d55'te 16 kez …); yalnız d29 düzeltme işaretsiz.
  - 18: "fotonlar halinde gelir", "O halde her foton"
  - 40: "hareket halindeki davranışını"
  - 51: "bu kuralın çizilmiş halidir"
  - 135: "durgun halde her biri 511 keV"
  - 440: "kenarları ince olduğu halde"
- **Önerilen düzeltme:** "hâlinde", "O hâlde", "hâlindeki", "hâlidir", "hâlde".
- **Kural:** https://tdk.gov.tr/icerik/yazim-kurallari/duzeltme-isareti/ ("hal (sebze, meyve vb. satılan yer), hâl (durum, vaziyet)")

#### A6D-18 · KÜÇÜK · d31.json:460, d50.json:91, d50.json:122, d50_sinav.json:12, d51.json:192, d52_sinav.json:26, d56.json:287
- **Açıklama:** TDK'nin madde başı biçimi "dâhil". `veri/dersler.json`'da 29 "dahil" var, hiç "dâhil" yok; bu yüzden düzeltme bütün dersleri kapsamalı.
  - Örnek: d50:91 "LZ'nin 2,2×10⁻⁴⁸ cm² sınırı dahil hiçbir deney WIMP bulmadı"
- **Kanıt:** `sozluk.gov.tr/gts?ara=dahil` → `"madde":"dâhil"`, telaffuz "da:hil".
- **Önerilen düzeltme:** "dâhil".

#### A6D-19 · KÜÇÜK · d27.json:87
- **Açıklama:** TDK "yer çekimi"ni ayrı yazar. d26:130 ve d26:201 ("yer çekimi ivmesi") doğru; d27 bitişik yazmış.
  - Metin: "yerçekimi ivmesi 9,81 m/s² olduğuna göre"
- **Kanıt:** `gts?ara=çekim` → birleşikler: "… yer çekimi"; `gts?ara=yerçekimi` → "Sonuç bulunamadı".
- **Önerilen düzeltme:** "yer çekimi ivmesi".

#### A6D-20 · KÜÇÜK · d27.json:82; d50.json:65, d50.json:329
- **Açıklama:** "-ler arası" birleşikleri ayrı yazılır; d31:207 doğru yazıyor ("gezegenler arası yolda").
  - d27:82: "dünyanın ilk gezegenlerarası güneş yelkenli uzay aracı"
  - d50:65, d50:329: "galaksilerarası hidrojen"
- **Kanıt:** `gts?ara=gezegenler arası` → madde var; `gts?ara=gezegenlerarası` → "Sonuç bulunamadı".
- **Önerilen düzeltme:** "gezegenler arası", "galaksiler arası".
- **Not:** "galaksiler arası" TDK sözlüğünde madde değil; aynı kurala göre önerildi. "Yıldızlararası", kılavuzun ve d14 başlığının biçimi olduğu için dokunulmadı.

#### A6D-21 · KÜÇÜK · binlik noktası eksik (çok dosya)
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

#### A6D-22 · KÜÇÜK · d52.json:135, 194, 410, 452
- **Açıklama:** TDK "tek eşli"yi ayrı yazar.
  - 135: "dolanıklık tekeşlidir"
  - 194 ve 452: "dolanıklığın tekeşliliği"
  - 410: "(tekeşli dolanıklık)"
- **Kanıt:** `gts?ara=tek eşli` → madde var; `gts?ara=tekeşli` → "Sonuç bulunamadı".
- **Önerilen düzeltme:** "tek eşlidir", "tek eşliliği", "tek eşli dolanıklık".

#### A6D-23 · KÜÇÜK · joule / jul karışık (d25, d27, d50, d51, d53 ↔ d31, d32)
- **Açıklama:** Aynı birim iki yazımla geçiyor. TDK sözlüğü "jul" yazar; uygulamanın sesli okuması da J'yi "jul" okur (okunus.js:26).
  - "joule": d25:172, 173, 481 ("kaç joule'dür?"); d27:28, 54, 59, 116, 167, 174; d50:189; d51:70 ("joule'lük"), 71, 77, 79; d53:57 ("Joule'e", "34,2 megajoule"), 62, 469
  - "jul": d31 (5 kez) ve d32 (16 kez), örneğin d32:25 "3,24 × 10⁻¹¹ jul"
- **Kanıt:** `gts?ara=jul` → madde "jul"; `gts?ara=joule` → "Sonuç bulunamadı".
- **Önerilen düzeltme:** Hepsi "jul" ("jule", "julluk", "megajul").

#### A6D-24 · KÜÇÜK · eV/keV/MeV eklerinde üç farklı okunuş (d27, d28, d29_sinav, d31, d32, d32_sinav, d50, d53)
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

#### A6D-25 · KÜÇÜK · d32.json:115, 132, 147 ↔ d53.json:297; d28.json:180 ↔ d28.json:6, 181, 184, 185, 229
- **Açıklama:** Aynı kısaltma, ders içinde ya da dersler arasında farklı okunuşa göre ek almış.
  - **CMS:** d32 "ATLAS ve CMS'te" (sessiz "es" okunuşu) ↔ d53:297 "CMS'nin" (Türkçe harf okunuşu "se-me-se").
  - **NMR / MR (aynı ders içinde):** d28:180 "NMR'yi" ("ne-me-re") ↔ d28:6 "MR'a", 181/184 "MR'ın", 185/229 "MR'da" ("em-ar").
- **Önerilen düzeltme:** Tek okunuş seçilmeli: "CMS'de", "CMS'nin"; "NMR'ı" (MR'a ile uyumlu) ya da hepsi Türkçe harf okunuşuyla.

#### A6D-26 · KÜÇÜK · d54.json (51 yerde), d54_sinav.json:54, d55.json (46 yerde), d55_sinav.json:18
- **Açıklama:** Alıntı ve ad vurgusu için tek tırnak kullanılmış. Öbür 12 dersin hepsi çift tırnak (“ ”) kullanıyor (`grep`: d56'da 92, d52'de 58, d28'de 37 çift tırnak; d54/d55'te 0). TDK, tek tırnağı tırnak içindeki ikinci alıntıya ayırır.
  - Örnekler: d54:26 "'şans eseri' açıklamalardan"; d54:40 "'Şişen evren: …' başlığıyla"; d55:6 "'Büyük Patlama'dan önce ne vardı?' sorusunun"; d55:467 "Tye'nin kendisi 'veriler doğru çıkarsa' diyor"
  - Kesmeyle yan yana gelince karışıklık da doğuyor: d55:6 "'Büyük Patlama'dan" (kapanış tırnağı ile kesme aynı işaret).
- **Önerilen düzeltme:** “ ” çift tırnağa geçmek.

#### A6D-27 · KÜÇÜK · terim tutarsızlıkları (kendi derslerim içinde)

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

#### A6D-28 · KÜÇÜK · kesinlik etiketinin yazılışı (d52, d56 ↔ d50, d51, d53, d54, d55)
- **Açıklama:** d50, ölçeği tanıtırken "hep aynı sözlerle" kullanılacağını ve kalıbın “Kesinlik: gözlemle kesinleşmiş” olduğunu söylüyor (d50:16, 19); kılavuz da "hep aynı sözlerle an" diyor (YAZIM_KILAVUZU.md:172).
  - d52 ve d56 etiketleri büyük harfle ve tırnak içinde yazıyor: d52:43 "Kesinlik düzeyi: “Kuram ya da hipotez”"; d56:18 “Gözlemle kesinleşmiş”, “Spekülasyon”; d52:404 ve d56:382 defter notlarında "Gözlemle kesinleşmiş; Güçlü kanıtlı …".
  - d50, d51, d53, d54, d55 küçük harf ve tırnaksız yazıyor ("Kesinlik: kuram ya da hipotez").
  - Sözcük de değişiyor: d50/d54 "basamak", d52/d56 "düzey".
- **Önerilen düzeltme:** Ünitede tek kalıp: "Kesinlik: kuram ya da hipotez" (küçük harf, tırnaksız) ve tek sözcük ("basamak" ya da "düzey").

#### A6D-29 · KÜÇÜK · ad çiftlerinde kısa çizgi / uzun çizgi karışık
- **Açıklama:** Kişi adı çiftleri çoğu yerde uzun çizgiyle (–) yazılıyor: d25 "Michelson–Morley", "Frisch–Smith"; d26 "Pound–Rebka", "Hafele–Keating"; d52:405 "Bardeen–Carter–Hawking"; d53 "Ashok–Douglas", "Calabi–Yau". Aşağıdakiler kısa çizgiyle (-) yazılmış; aynı satırda iki biçim bile var:
  - d52: "Bekenstein-Hawking" (29, 203, 405, 179), "Bose-Einstein" (165, 186, 398), "Jackiw-Teitelboim" (156), "Stefan-Boltzmann" (77, 215)
  - d56: "Einstein-Rosen" (27, 80–83, 101, 214, 219, 301, 387), "Kruskal-Szekeres" (26, 286), "Morris-Thorne" (93), "Morris-Thorne-Yurtsever" (204), "Fuller-Wheeler", "Haggard-Rovelli", "Retter-Heller", "Maldacena-Susskind" (defter notları 383–388)
  - d31 defter notu (d31:431): "Hahn-Strassmann", "Meitner-Frisch"
  - d27 "Stefan-Boltzmann" (39, 47)
- **Önerilen düzeltme:** Kişi adı çiftlerinde "–" (d25/d26'nın biçimi).

#### A6D-30 · KÜÇÜK · d26.json:120–121
- **Açıklama:** Peş peşe iki paragrafta aynı cümle tekrarlanıyor.
  - 120'nin sonu: "… kesin doğrulama sonraki ölçümlerden geldi."
  - 121'in başı: "Kesinlik sonraki ölçümlerden geldi."
- **Önerilen düzeltme:** 121'in ilk cümlesini silmek ya da "Bu doğrulama 1922'de geldi." gibi yeni bir bilgiyle değiştirmek.

#### A6D-31 · KÜÇÜK · d31.json:91, d31.json:121, d32.json:158
- **Açıklama:** Anlatıcı yer yer birinci tekil şahısla konuşuyor. Ders öbür her yerde "sen" diye hitap ediyor, kendinden de "biz" diye söz ediyor (kılavuz "Sen diye hitap et").
  - d31:91: "30 Ekim 2026'da erişebildiğim en güncel resmî takvim budur."
  - d31:121: "Şebekeye bağlandığını gösteren resmî bir kayıt bulamadım"
  - d32:158: "daha yeni bir sınır bulamadım."
  - (İçerik konusu olan Akkuyu şebeke kaydı, kullanıcının bilinen askı listesinde; burada yalnız anlatım kipi bildiriliyor.)
- **Önerilen düzeltme:** "… erişilebilen en güncel resmî takvim budur", "… bir kayıt bulunamadı", "… daha yeni bir sınır yayımlanmadı/bulunamadı".

#### A6D-32 · KÜÇÜK · d56.json:431
- **Açıklama:** Anlamca belirsiz ifade. "yüzde bir saniye", "saniyenin yüzde biri" yerine kullanılmış.
  - Metin: "Fark ≈ … ≈ 0,010 s, yani yaklaşık yüzde bir saniye."
- **Önerilen düzeltme:** "yani saniyenin yaklaşık yüzde biri."

#### A6D-33 · KÜÇÜK · noktalama ve biçim (formül satırları ve çarpı işareti)
- **Açıklama:**
  - Noktalı virgülden önce boşluk var:
    - d52:214 "∝ 1 ÷ M² ;  ömür"
    - d56:198 "evdekinin süresi ÷ γ ;  γ = …"
  - Formül ifadelerinde iki boşluklu ayraç: d27:206, 221, 236; d28:213, 218, 223, 233; d50:188; d51:206; d52:214; d56:198.
  - Çarpı işaretinin çevresinde boşluk yok: d50 ve d51'in tamamında "1,78×10⁻²⁷", "5,96×10⁻²⁷"; öbür 12 ders "1,78 × 10⁻²⁷" yazıyor.
- **Önerilen düzeltme:** "M²;  ömür" yerine "M²; ömür" (boşluksuz, tek boşluk); d50/d51'de "× " çevresine boşluk.

#### A6D-34 · KÜÇÜK · ders başlıkları (lesson "baslik")
- **Açıklama:** Başlıkların biçimi uygulamadaki öbür 44 dersle tutarlı: ana başlık + iki nokta + alt başlık, her sözcük büyük harfle. Kılavuzun ünite listesindeki adlarla uyuşuyorlar. Bölüm başlıklarında yazım hatası bulunmadı (kid bağımlı başlıklara dokunulması gerekmiyor). İki küçük tutarsızlık var:
  - d25:5 "Özel Görelilik: Işık Hızı, Zaman ve E=mc²" boşluksuz; dersin bölüm başlıkları (d25:170, 197) ve metni hep "E = mc²" yazıyor.
  - d54:5 "Enflasyon ve Çoklu Evren: …" başlığı ile ders metninin terimi uyumsuz (bkz. A6D-27).
- **Önerilen düzeltme:** d25 başlığında "E = mc²". d54 başlığı ders başlığıdır, bölüm başlığı değildir; kid'e bağlı değil. "Kozmik Şişme (Enflasyon) ve Çoklu Evren" düşünülebilir.

### Askıda

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

---

## Alan 6E — Türkçe yazım: Haberler ve Deney metinleri (Urania v39 denetimi, 2026-10-30)

### Okunan dosyalar
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

### Yöntem
- Metin çıkarıcı: `a6e/cikar.py` (JSON → `L<satır> <yol>: <metin>`), çıktılar `a6e/t_*.txt`; JS için `grep` ile dize satırları (`a6e/js_*.txt`).
- Haber sayımı: `python` ile `ozet` paragrafları boşlukla bölünüp sayıldı; kaynak sayısı, görsel kredi/lisans/kaynak URL'si listelendi.
- Terim tutarlılığı: `grep -o` ile haberler / deneyler / görevler / JS ile `veri/dersler.json` karşılaştırıldı; takımyıldız adları `veri/takimyildiz.json` ile.
- TDK kontrolü: `https://sozluk.gov.tr/gts?ara=<kelime>` (curl, sırayla) ve tdk.gov.tr yazım kuralları sayfaları (nokta, kesme işareti).
- Sesli okuma etkisi: `require('C:/Users/Kaan/urania/okunus.js').okunus(...)` ile birkaç örnek.
- ESA görsel kredileri iki görsel sayfasından doğrulandı (MMX, JUICE).

#### Haber kuralları tablosu (YONTEM.md)
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

### Bulgular

#### A6E-01 · KÜÇÜK · veri/deney_rehber.json:978
- Açıklama: Gelgit deneyinde kaynak adında "enberi ve öteberi" yazıyor. "Öteberi" TDK'de "önemsiz, ufak tefek şeyler" demek; Ay'ın en uzak noktası (yeröte/enöte) değil. Aynı hata simulasyon.js:310 ve :315'teki yorumlarda da var (onlar kullanıcıya görünmüyor).
- Kanıt: `"ad": "NOAA: gelgit değişimleri (enberi ve öteberi)"`; sozluk.gov.tr/gts?ara=öteberi → "Önemsiz, ufak tefek şeyler". Aynı dosyada L667–668 ve deneyler2.js:141 "enöte" kullanıyor; dersler.json "yeröte" kullanıyor (8 kez).
- Önerilen düzeltme: "(enberi ve enöte)" ya da Ay için "(yerberi ve yeröte)".

#### A6E-02 · KÜÇÜK · veri/deney_rehber.json:883, 914, 922–923, 930–931; deneyler2.js:187
- Açıklama: "Kabarma" aynı deneyde iki anlamda kullanılıyor: bir yerde günlük yüksek su ("iki kabarma ve iki çekilme", "kabarma ile çekilme arasındaki fark"), başka yerde ayda iki kez olan büyük gelgit (spring tide) için "kabarma gelgiti". TDK "kabarma"yı yüksek su olarak tanımlıyor; okur ikisini karıştırır.
- Kanıt: L883 "her gün iki kabarma ve iki çekilme olur. Her kameri ayda iki kez kabarma gelgiti ..."; deneyler2.js:187 `'Yeni Ay: kabarma gelgiti'`. sozluk.gov.tr: kabarma → "Ay ve Güneş'in çekim etkisiyle büyük denizlerde suların yükselmesi".
- Önerilen düzeltme: Ayda iki kez olan için ayrı bir terim seçilmeli (ör. "büyük gelgit" ya da "tam gelgit"; "ölü gelgit"in karşılığı olarak). Terimi dersler.json'daki gelgit anlatımıyla (d3) birlikte Kaan karar vermeli.

#### A6E-03 · KÜÇÜK · veri/deney_rehber.json:387
- Açıklama: Makine çevirisi kokan, Türkçede anlamı bozuk cümle ("probably not for another 100,000 years" düz çevrilmiş).
- Kanıt: "bir gün süpernova olarak patlayacak, ama büyük olasılıkla yaklaşık 100.000 yıl daha değil."
- Önerilen düzeltme: "bir gün süpernova olarak patlayacak, ama büyük olasılıkla en az 100.000 yıl daha patlamayacak."

#### A6E-04 · KÜÇÜK · veri/haberler.json:675, 681, 686, 1425, 1436, 1441
- Açıklama: "İşbirliği" bitişik yazılmış; TDK "iş birliği" ayrı yazar. Aynı dosyanın 389. satırı doğru yazıyor ("iş birliğiyle").
- Kanıt: "CHIME İşbirliği (Amiri vd.)", "GRAVITY+ İşbirliği (Abd El Dayem vd.)". sozluk.gov.tr/gts?ara=iş birliği → madde "iş birliği".
- Önerilen düzeltme: "CHIME İş Birliği", "GRAVITY+ İş Birliği".

#### A6E-05 · KÜÇÜK · veri/haberler.json:1294; veri/deney/roket.json:113
- Açıklama: "dahil" ("içinde, ile birlikte" anlamında) TDK'ye göre şapkalı yazılır: "dâhil". Şapkasız "dahil" TDK'de "bir işe karışma" demek. (Bilgi için: dersler.json'da da 29 kez şapkasız geçiyor; o dosya başka parçanın alanı.)
- Kanıt: haberler L1294 "Asiago Gözlemevi'ninkiler de dahil olmak üzere"; roket L113 (hedefler[0].not) "sürtünme ve çekim kaybı dahil". sozluk.gov.tr: dâhil → "İçinde, ... ile birlikte"; dahil → "Bir işe karışmış olma".
- Önerilen düzeltme: "dâhil".

#### A6E-06 · KÜÇÜK · veri/gorevler.json:86, 108, 457
- Açıklama: Özel ada gelen yapım eki kesmeyle ayrılmış: "Ay'sız". TDK: özel adlara getirilen yapım ekleri kesmeyle ayrılmaz. Ayrıca deney_rehber.json:1597 (hubble.gercek) doğru biçimi ("Aysız") kullanıyor; iki dosya tutarsız.
- Kanıt: "Ay'sız bir gece seç ve kaçamak bakış kullan"; https://tdk.gov.tr/icerik/yazim-kurallari/kesme-isareti/ : "Özel adlara getirilen yapım ekleri, çokluk eki ve bunlardan sonra gelen diğer ekler kesmeyle ayrılmaz."
- Önerilen düzeltme: "Aysız".

#### A6E-07 · KÜÇÜK · veri/haberler.json:748, 749, 751
- Açıklama: Terim tutarsızlığı. Batygin haberinde "ana dizi" ve "kızıl dev" kullanılmış; kılavuzun ve derslerin terimi "anakol" (dersler.json'da 104 kez) ve "kırmızı dev" (dersler.json'da 40 kez, "kızıl dev" 0). Deney rehberi de "anakol" / "kırmızı dev" kullanıyor.
- Kanıt: L748 "uzun olgunluk evresini (ana dizi)"; L749 "Güneş, ilerde kızıl dev olarak şiştiği evrelerde ... Kızıl dev, yakıtı azalan..."; L751 "daha kızıl dev evresinde". YAZIM_KILAVUZU.md:87 "kırmızı dev", "anakol".
- Önerilen düzeltme: "anakol", "kırmızı dev".

#### A6E-08 · KÜÇÜK · veri/haberler.json:1410
- Açıklama: "kızıla kayması"; uygulamanın her yerinde "kırmızıya kayma" (haberlerde 7, derslerde 121 kez).
- Kanıt: "güçlü çekimden çıkan ışığın kızıla kayması".
- Önerilen düzeltme: "kırmızıya kayması".

#### A6E-09 · KÜÇÜK · veri/haberler.json:1069
- Açıklama: Aynı alet türü için iki terim ve özel adda iki farklı ek biçimi var. (a) "tayfçekerleri": haberlerde ve derslerde terim "tayfölçer" (haberlerde 5, derslerde 28 kez; "tayfçeker" yalnız burada). (b) "Büyük Binoküler Teleskop'u": öteki haberler Türkçe tamlama ekini kullanıyor ("Çok Büyük Teleskobu'na", "Aşırı Büyük Teleskobu'ndaki").
- Kanıt: "Arizona'daki iki ikiz aynalı Büyük Binoküler Teleskop'u (LBT) kullandı. ... MODS tayfçekerleri".
- Önerilen düzeltme: "Büyük Binoküler Teleskobu'nu (LBT)", "MODS tayfölçerleri".

#### A6E-10 · KÜÇÜK · veri/haberler.json:1189, 1396
- Açıklama: "yükseklik ölçer" ayrı yazılmış; TDK sözlüğü "yükseklikölçer" maddesini bitişik veriyor (uygulamadaki "tayfölçer" ile de uyumlu).
- Kanıt: L1189 "Lazer yükseklik ölçer BELA"; L1396 "LOLA lazer yükseklik ölçerinin". sozluk.gov.tr/gts?ara=yükseklikölçer → "Bulunulan yerin yüksekliğini gösteren aygıt; altimetre".
- Önerilen düzeltme: "lazer yükseklikölçer", "yükseklikölçerinin".

#### A6E-11 · KÜÇÜK · veri/haberler.json:1396
- Açıklama: "bir" yanlış yerde; cümle yapısı bozuk (çeviri kokan).
- Kanıt: "... verilerinden üretilmiş, doğal renkli bir Shackleton kraterinin görünümü."
- Önerilen düzeltme: "... verilerinden üretilmiş, Shackleton kraterinin doğal renkli bir görünümü."

#### A6E-12 · KÜÇÜK · veri/haberler.json:494
- Açıklama: Saat "geçe" yapısı yanlış kullanılmış ("geçe" saate bağlanır, tarihe bağlanmaz).
- Kanıt: "Kapsül, Türkiye saatiyle 2 Ekim'i 02:05 geçe, Pasifik Okyanusu'nun ..."
- Önerilen düzeltme: "Kapsül, 2 Ekim'de Türkiye saatiyle 02.05'te, ..."

#### A6E-13 · KÜÇÜK · veri/haberler.json:1302
- Açıklama: Kullanıcıya görünen "istanbul" alanında yazarın birinci tekil kişisi kalmış ("bulamadım", "söyleyemiyorum"); uygulamanın öteki metinleri kişisiz anlatıyor. Bir çalışma notu metne sızmış gibi okunuyor.
- Kanıt: "Bugünkü parlaklığını doğrulayan bir kaynak bulamadım; bu yüzden şu an dürbünle görülüp görülemeyeceğini söyleyemiyorum."
- Önerilen düzeltme: "Bugünkü parlaklığını doğrulayan bir kaynak yok; bu yüzden şu an dürbünle görülüp görülemeyeceği bilinmiyor."

#### A6E-14 · KÜÇÜK · veri/deney_rehber.json:55 (karadelik.gercek)
- Açıklama: M8'in adı tutarsız. Deney rehberi "Lagün Bulutsusu" diyor; dersler.json (L2218, L2351, L16436) ve gorevler.json:407 "Deniz Kulağı Bulutsusu" diyor.
- Kanıt: "NASA'ya göre aynı takımyıldızdaki Lagün Bulutsusu'nu (M8) gözlemenin en iyi zamanı Ağustos'tur."
- Önerilen düzeltme: "Deniz Kulağı Bulutsusu'nu (M8)".

#### A6E-15 · KÜÇÜK · veri/deney_rehber.json:1059, 1094
- Açıklama: Takımyıldız adları Türkçe yazılmamış (kılavuz: takımyıldız adları veri/takimyildiz.json'daki "ad"). Pegasus = "Kanatlıat" (gorevler.json:84 doğru biçimi kullanıyor), Orion = "Avcı".
- Kanıt: L1059 "1995'te Pegasus'taki 51 Pegasi'nin çevresinde"; L1094 "Orion'daki Betelgeuse ile Rigel'i". takimyildiz.json: `Peg=Kanatlıat(Pegasus)`, `Ori=Avcı(Orion)`.
- Önerilen düzeltme: "Kanatlıat'taki 51 Pegasi'nin", "Avcı'daki Betelgeuse ile Rigel'i".

#### A6E-16 · KÜÇÜK · veri/deney/ortme.json:184 (adimlar[6].neden)
- Açıklama: Yanlış durum eki: "bağlı" yönelme hâli ister.
- Kanıt: "Gerçekte dönem yıldızların arası ve kütleleriyle bağlıdır (Kepler III)"
- Önerilen düzeltme: "Gerçekte dönem yıldızların arasındaki uzaklığa ve kütlelerine bağlıdır (Kepler III)".

#### A6E-17 · KÜÇÜK · veri/deney/mevsim.json:41 (adimlar[0].neden)
- Açıklama: Eksik iyelik eki.
- Kanıt: "sağdaki kürede eksen Güneş'e doğru yatık ve kesikli enlem çizginin çoğu gündüz yarısında."
- Önerilen düzeltme: "kesikli enlem çizgisinin çoğu".

#### A6E-18 · KÜÇÜK · veri/deney/astrofoto.json:53 (cizim[7].ne)
- Açıklama: Eksik kalmış ifade; neyin oranı olduğu söylenmiyor.
- Kanıt: "Seçtiğin kare sayısı ve seçtiğin gökte yığının oranı."
- Önerilen düzeltme: "Seçtiğin kare sayısı ve seçtiğin gökte yığının sinyal-gürültü oranı."

#### A6E-19 · KÜÇÜK · veri/deney/astrofoto.json:61, 161, 272, 275
- Açıklama: Ondalık ayracı tutarsız. Diyafram değerleri bazı yerlerde noktalı ("f/2.8", "f/1.8"), aynı dosyanın 103. satırında virgüllü ("f/1,4 ile f/4", "f/1,8"). Kılavuz ondalık virgül istiyor. Düğme adı (onayarlar[1].ad "Aynasız 24 mm f/2.8") ekranda görünüyor; okunus.js bunu "f bölü 2.8" diye çeviriyor.
- Kanıt: L61 "aynasız tam kare 24 mm f/2.8 ... 50 mm f/1.8"; L103 "f/1,4 ile f/4 arası ... (Galaxy S24 ana kamerası f/1,8)". `okunus('f/2.8 ve 24 mm')` → "f bölü 2.8 ve 24 milimetre".
- Önerilen düzeltme: "f/2,8", "f/1,8" (deney JS'si bu adla düğme eşliyorsa birlikte değiştir).

#### A6E-20 · KÜÇÜK · simulasyon.js:396
- Açıklama: Çoğul özneye tekil iyelik: aynı cümlenin öbür kolu "yakıtlarını" diyor.
- Kanıt: `'küçük yıldızlar yakıtını çok yavaş harcar ve Güneş\'ten çok uzun yaşar.'`
- Önerilen düzeltme: "küçük yıldızlar yakıtlarını çok yavaş harcar".

#### A6E-21 · KÜÇÜK · simulasyon.js:235; veri/deney_rehber.json:225, 287
- Açıklama: (a) Binlik ayraç boşluk: "35 800 km" (kılavuz ve TDK: nokta; rehber aynı sayıyı "35.786" yazıyor). (b) Aynı deneyde iki terim: JS metni "yer eşzamanlı yörünge", rehber "yerdurgun yörünge".
- Kanıt: simulasyon.js:235 "Yaklaşık 35 800 km yükseklikte dolanım bir yıldız gününe eşitlenir: yer eşzamanlı yörünge."; rehber L225 "yaklaşık 35.786 km yükseklikteki yerdurgun yörüngede". TDK nokta kuralı 9: "Dört ve dörtten çok rakamlı sayılar ... üçlü gruplara ayrılarak yazılır ve araya nokta konur" (https://tdk.gov.tr/icerik/yazim-kurallari/nokta/).
- Önerilen düzeltme: "35.800 km"; deneyde tek terim (rehber cümlesi ekvator üstünde sabit duran uyduları anlattığı için "yerdurgun" uygun; JS cümlesi de ona çekilebilir).

#### A6E-22 · KÜÇÜK · veri/gorevler.json:930 (gorevler[39].ne_gorursun)
- Açıklama: Bozuk cümle: edilgen fiil ile "diyor" karışmış.
- Kanıt: "NASA saatte 40–50 meteor bekleniyor diyor;"
- Önerilen düzeltme: "NASA saatte 40–50 meteor beklendiğini söylüyor;"

#### A6E-23 · KÜÇÜK · veri/gorevler.json:59 (gorevler[2].ne_gorursun)
- Açıklama: Bozuk karşılaştırma: "-den çok" ile "daha" birlikte kullanılmış; cümlenin ne dediği belirsiz.
- Kanıt: "Uyarı: ışık kirliliğinde bulutsu dürbünden çok çıplak gözle daha belirgin görünebilir."
- Önerilen düzeltme: Kaynak (BinoSky) neyi söylüyorsa ona göre, ör. "ışık kirliliğinde bulutsu dürbünde, çıplak gözle olduğundan daha belirgin görünebilir" (anlamın kaynakla doğrulanması gerekiyor; bkz. Askıda).

#### A6E-24 · KÜÇÜK · veri/deney/eratosthenes.json:89 (rehber.gercek)
- Açıklama: Hitap "siz"; kılavuz "sen" diye hitap istiyor ve aynı paragraf "kendin yapabilirsin" diye başlıyor.
- Kanıt: "... bir sopanın boyunu ve gölgesinin boyunu ölçün; ... gölgeyi milimetresine kadar ölçün."
- Önerilen düzeltme: "ölç" (iki kentteki ölçüm için "bir arkadaşınla birlikte ölç" gibi).

#### A6E-25 · KÜÇÜK · veri/gorevler.json:435; veri/deney/mevsim.json, veri/deney_rehber.json
- Açıklama: "yarımküre" bitişik; TDK "yarım küre" (ayrı). Deney dosyaları doğru ("yarım küre" 7 kez), gorevler bitişik. (Bilgi: dersler.json 46 kez bitişik yazıyor; başka parçanın alanı.)
- Kanıt: gorevler L435 "kuzey yarımküre gözlemcisi için". sozluk.gov.tr: "yarım küre" var, "yarımküre" yok.
- Önerilen düzeltme: "yarım küre".

#### A6E-26 · KÜÇÜK · veri/haberler.json (13 yer), veri/deney/analemma.json (34 yer) ↔ veri/deney/mevsim.json, analemma.json:23, haberler.json:716, 1236
- Açıklama: Saat yazımı tutarsız ve çoğunlukla TDK'ye aykırı. TDK saat ile dakika arasına nokta koyar. Haberlerde "11:10", "14:45", "02:05" gibi iki nokta var; aynı dosyada "15.50 sularında" (L716) ve "14.26'da" (L1236). analemma.json'da aynı deneyde "12.47'de" (L23) ile "12:47:14" (L33) yan yana.
- Kanıt: TDK nokta kuralı 7: "Saat ve dakika gösteren sayıları birbirinden ayırmak için konur. Tren 09.15'te kalktı." (https://tdk.gov.tr/icerik/yazim-kurallari/nokta/). Sayım: haberler.json'da iki noktalı 13 saat (L165, 493, 494, 497, 611, 1188, 1294).
- Önerilen düzeltme: Saat:dakika her yerde nokta ile ("11.10"). Saniyeli değerler (13:03:41) için tek bir biçim seçilip tutarlı kullanılmalı.

#### A6E-27 · KÜÇÜK · veri/deney_rehber.json (ör. 130, 139, 344, 368, 470, 591, 1042, 1400), veri/deney/astrofoto.json:67, 243, 252, veri/deney/eratosthenes.json:79, veri/gorevler.json:602, deneyler2.js:174
- Açıklama: Dört basamaklı sayılarda binlik nokta tutarsız. Aynı dosyalarda "3.000 ile 30.000 K" (ortme), "2.300 ile 7.500 K" (yasanabilir), "1.361 W/m²" varken "5772 K", "3000 K", "6371 km", "2900 km", "6600 yıl", "8000 kat", "4000 piksel" noktasız.
- Kanıt: TDK nokta kuralı 9 (yukarıda). grep çıktısı: deney_rehber.json:130 "2900 km", :1042 "(3000 K ... 5772 K ... 9845 K", :1400 "(6371 km"; deneyler2.js:174 "6371 km".
- Önerilen düzeltme: Dört basamaklı sayılarda da nokta ("5.772 K", "6.371 km").

#### A6E-28 · KÜÇÜK · veri/deney/yasanabilir.json:127, 146 ↔ veri/deney_rehber.json:1003, 1128, 1134
- Açıklama: Kelvin simgesine gelen ek tutarsız: bir yerde "K" "ka" diye okunmuş gibi ("278 K'ye", "2.600 K'nin"), öbür yerde "kelvin" diye ("29.000 K'in", "40.000 K'e", "33.000 K'in"). Sesli okuma etkilenmiyor (okunus.js dördünü de "kelvine/kelvinin" yapıyor), sorun yalnız yazıda.
- Kanıt: `okunus("Denge sıcaklığı 278 K'ye çıktı")` → "278 kelvine çıktı".
- Önerilen düzeltme: Tek biçim: "K'e, K'in" (kelvin okunuşu).

#### A6E-29 · KÜÇÜK · veri/haberler.json:1412 ↔ veri/deney_rehber.json:1094 ↔ veri/dersler.json
- Açıklama: "Betelgeuse"a gelen ekler üç farklı okunuşa göre yazılmış: haberler "Betelgeuse'ten", deney rehberi "Betelgeuse'un", dersler çoğunlukla "Betelgeuse'ün" (8), "Betelgeuse'den" (1).
- Kanıt: grep sayımı: dersler 'ün 8, 'ünkü 2, 'u 3, 'den 1; haberler 'ten 1; rehber 'un 1.
- Önerilen düzeltme: Derslerin çoğunluğu gibi ("Betelgeuse'ün, Betelgeuse'den").

#### A6E-30 · KÜÇÜK · veri/haberler.json:558
- Açıklama: Jüpiter'in uydusu "İo" yazılmış; dersler.json (Io 38 civarı), gorevler.json:683 ve öteki metinler "Io".
- Kanıt: "Jüpiter'in volkanik uydusu İo'dakine benzer biçimde".
- Önerilen düzeltme: "Io'dakine".

#### A6E-31 · KÜÇÜK · veri/haberler.json:113–115 ↔ :1298
- Açıklama: Aynı terim aynı dosyada iki biçimde: "X-ışını" (L113, 114, 115) ve "X ışınlarında" (L1298). (Derslerde de ikisi var: 78 / 37.)
- Kanıt: L113 "X-ışını ve morötesi/görünür ışık teleskoplarını"; L1298 "novanın yakında X ışınlarında da parlamasını bekliyor".
- Önerilen düzeltme: Tek biçim. TDK'nin "alfa ışını, gama ışını" yazımına uygun olan "X ışını" (kısa çizgisiz).

#### A6E-32 · KÜÇÜK · veri/haberler.json:660 ↔ :660, 664
- Açıklama: Aynı yer adı aynı haberde iki dilde: "Britanya Kolumbiyası'nda" ve "British Columbia ... üniversiteleriyle", "British Columbia Üniversitesi'nin".
- Kanıt: L660 "CHIME, Britanya Kolumbiyası'nda Penticton yakınındaki ... teleskobu British Columbia, McGill ve Toronto üniversiteleriyle"; L664 "British Columbia Üniversitesi'nin açıklamasına göre".
- Önerilen düzeltme: Tek biçim (ör. "Britanya Kolumbiyası" ve "Britanya Kolumbiyası Üniversitesi").

#### A6E-33 · KÜÇÜK · veri/haberler.json:838
- Açıklama: Terim tutarsızlığı: "gezegen öncesi disk"; kılavuz ve dersler "öngezegen diski" diyor (dersler 6 kez, "gezegen öncesi" 0).
- Kanıt: "bunlara \"gezegen öncesi disk\" deniyor."; YAZIM_KILAVUZU.md:59, 64 "öngezegen diski".
- Önerilen düzeltme: "öngezegen diski".

#### A6E-34 · KÜÇÜK · veri/haberler.json:1137
- Açıklama: "yıldızlar arası toz"; dersler bu kavram için bitişik "yıldızlararası" kullanıyor (58 kez; ayrı yazım 19). TDK sözlüğünde iki biçim de madde olarak yok, bu yüzden yalnız tutarlılık bulgusu.
- Kanıt: "teleskoplar arasındaki farklar, yıldızlar arası toz, ...".
- Önerilen düzeltme: "yıldızlararası toz".

#### A6E-35 · KÜÇÜK · veri/haberler.json:715, 493 ↔ veri/deney/roket.json (bütün dosya)
- Açıklama: Roketin "stage" bölümü haberlerde "kademe" ("iki kademeden", "birinci kademesi"), roket deneyinde ve derslerde "aşama" (dersler 131 kez "aşama", 4 kez "kademe").
- Kanıt: haberler L715 "iki kademeden oluşuyor. Kademe, yakıtı bitince ayrılan roket bölümüdür."; roket L3 "aşama sayısını".
- Önerilen düzeltme: Haberlerde de "aşama".

#### A6E-36 · KÜÇÜK · veri/gorevler.json:414, 525 (yeni aya / yeni aydan) ↔ veri/deney_rehber.json, deneyler2.js ("yeni Ay")
- Açıklama: Evre adı tutarsız: görevler "yeni ay", deney rehberi ve deney ekranı "yeni Ay" / "Yeni Ay'dan bu yana gün". Aynı dosyada Ay özel ad olarak büyük yazılıyor ("Ay'ın yeni aya yakın olduğu").
- Kanıt: gorevler L414 "Ay'ın yeni aya yakın olduğu bir gece seç."; deneyler2.js:167 'Yeni Ay\'dan bu yana gün'.
- Önerilen düzeltme: Tek biçim seçilmeli (dersler.json küçük harf "yeni ay" kullanıyor; deney ekranındaki etiketle birlikte karar verilmeli).

#### A6E-37 · KÜÇÜK · veri/gorevler.json:304, 325
- Açıklama: (a) Askı yıldız kümesi özel ad olarak kullanılıyor ("Askı'yı (Coathanger)", L297) ama L304'te ek kesmesiz "Askının". (b) Kaynak adı "Sky and Telescope" yazılmış; öteki her yerde "Sky & Telescope".
- Kanıt: L304 "Askının ters durması seni şaşırtmasın"; L325 "Sky and Telescope dürbünde kolay olduğunu".
- Önerilen düzeltme: "Askı'nın"; "Sky & Telescope".

#### A6E-38 · KÜÇÜK · deneyler2.js:172 ↔ veri/deney_rehber.json:914, 922
- Açıklama: Rehber, ekrandaki ölçüm kutusunu "Durum:" diye anıyor ("Durum: kabarma gelgiti", "Durum: ölü gelgit"), ama kutunun ekrandaki etiketi "Bu gün". Okur rehberdeki sözcüğü ekranda bulamaz.
- Kanıt: deneyler2.js:172 `['ggDurum', 'Bu gün']`; rehber L914 "Durum: kabarma gelgiti".
- Önerilen düzeltme: Etiketi "Durum" yap ya da rehberde "‘Bu gün’ kutusu: ..." yaz.

### Askıda
- gorevler.json:59 (A6E-23) cümlesinin doğru anlamı: BinoSky (B. Crowell, M42) sayfası açılıp okunmadı; ışık kirliliğinde bulutsunun çıplak gözle mi dürbünle mi daha belirgin olduğuna dair kaynaktaki ifadeyi doğrulamadım. Yazım bozukluğu kesin, anlam düzeltmesi kaynakla yapılmalı.
- MMX görseli (haberler.json:215): ESA sayfasındaki kredi satırı yalnız "ESA"; uygulama "ESA (Teşekkür: ATG Europe)" yazıyor. Teşekkür ibaresi sayfanın açıklama metninde olabilir (WebFetch yalnız kredi ve lisans satırını verdi); fazladan ekleme kurala aykırı sayılmayabilir. JUICE kredisi ("ESA/Juice/JMC", teşekkür Simeon Schmauß) sayfayla örtüşüyor.
- Elias 2-24 görseli (haberler.json:883): ESO'nun sayfasından (potw1904a, CC BY 4.0) alınmış, ama kredi ALMA (ESO/NAOJ/NRAO) ve NRAO/AUI/NSF içeriyor. Kaynak kurum ESO olduğu için bulgu saymadım; "yalnız NASA/ESA/ESO/…" kuralının ortak kredili görselleri kapsayıp kapsamadığına Kaan karar vermeli.
- Ay ve gün adlarının büyük harfi: TDK belirli tarih bildirmeyen ay adlarını küçük yazar; haberlerde "Daha Nisan ayında" (L70), "Şubat'tan beri" (L496), "Temmuz'da gelen" (L496) gibi yılı bağlamdan anlaşılan ama tam tarih vermeyen kullanımlar var. Kuralın bu ara durumlara nasıl uygulanacağından emin değilim.
- "ilerde" (haberler.json:749 ve deney/rehber metinlerinde birkaç yer): TDK sözlüğünde "ileride" var; "ilerde"nin ayrı madde olup olmadığını denetlemedim.
- "Nobel ödülü sahibi" (haberler.json:1410): ödül adının büyük harfle "Nobel Ödülü" yazılıp yazılmayacağı için TDK kaynağına bakmadım.
- Tırnak işareti: haberler.json'da aynı dosyada hatta aynı haberde hem “ ” hem düz " " kullanılıyor (ör. L389). TDK'nin tipografik tırnak tercihi yok; tutarlılık sorunu olarak not edildi, bulgu sayılmadı.
- simulasyon.js ve deneyler2.js'de yalnız dize içeren satırları okudum; boşluk ve Türkçe harf içermeyen tek kelimelik ASCII dizeler (ör. 'Kemer') atlanmış olabilir.
