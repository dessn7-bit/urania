# Alan 3 — Dersler, sınav, kartlar, sözlük, ses, çizimler (Urania v39 denetimi, 2026-10-30)

Bu dosya 2 ajanın raporunun birleşimidir; her parça kendi okunan dosyalar tablosu, yöntemi, bulguları ve askıda bölümüyle aşağıda. Kimlik önekleri: A3 (kod, okunuş, sözlük, göndermeler), A3B (sınav cevapları, cizim_*.js).


---

## Alan 3a — Ders kodu, sesli okuma, sözlük, göndermeler (Urania v39 denetimi, 2026-10-30)

### Okunan dosyalar
| dosya | satır | tamamı |
|---|---|---|
| dersler.js | 432 | evet |
| kartlar.js | 78 | evet |
| sozluk.js | 284 | evet |
| ses.js | 502 | evet |
| okunus.js | 251 | evet |
| veri/dersler.json | 38 545 | hayır: Read ile satır satır okunmadı (4,4 MB). Tamamı betikle tarandı. 58 dersin her biri tarayıcıda açıldı, ekrandaki bütün `.okunur` blokları (6 938 blok, haberlerle birlikte) toplandı ve okunus() çıktısıyla birlikte desen desen incelendi |
| veri/sozluk.json | 1 (tek satır JSON, 1 229 terim) | hayır: betikle tarandı (desen, eş anlamlı, ders listeleri). Tarayıcıdaki 5 506 işaretin hepsi terim ↔ eşleşen metin çifti olarak çıkarıldı (3 012 ayrı çift). Şüpheli 473 çift elle okundu |
| araclar/ders_verisi_v2.py | 123 | evet (gönderme çevirisini anlamak için; ÇALIŞTIRILMADI) |
| uygulama.js | — | kısmen: 10–34 (oku/yaz) ve 265–304 (rota/goster). Hata yakalamayı doğrulamak için |
| haberler.js | — | kısmen: 1–40 ve 95–115 (haberler sesli okunuyor mu) |
| testler/hata_ayiklama.spec.js | — | kısmen: 175–215 ("N. ders" testi) |
| arastirma/dersler_v2/YAZIM_KILAVUZU.md | — | kısmen: yalnız on_bilgi / gönderme / sıra satırları (grep) |
| arastirma/dersler_v2/dNN.json | — | betikle tarandı; satır numaraları grep ile bulundu |

### Yöntem
- Kendi sunucum 8143'te (`PORT=8143 node testler/sunucu.js`) çalıştı. Chromium `--disable-lcd-text`, `serviceWorkers: 'block'`, dış ağ kesik. İş bitince yalnız kendi süreci kapatıldı.
- `a3a/topla.js`: 58 dersin tamamı (ünite sırasıyla) ve 27 haber açıldı. Her `.okunur` bloğundan ses.js'in okuyacağı metin (`data-ses` ya da innerText) alındı ve `Okunus.okunus()` ile `Ses.parcala(…, 600)` sonuçları çıkarıldı. Her `button.terim` (sözlük işareti) için terim kimliği, eşleşen metin ve çevresi kaydedildi.
- `kalan.js`, `ik.js`, `ham.js`, `ctx.js`: okunuşta kalan semboller. Sayıdan sonra gelen bütün birim kısaltmalarının sıklığı ve okunuşu. Kısaltma (`x.` + küçük harf), Roma rakamı, MÖ/MS, tire, kesir, yüzde-ek, üst simge desenleri. Her desen için orijinal ↔ okunuş çifti elle değerlendirildi.
- `parca.js`: ses.js Node'da sahte window ile yüklendi. Bütün blokların parçalara bölünmesi 600 ve 180 tavanında denendi (karakter kaybı, tavan aşımı, kısaltmada ve formülde bölme).
- `gonderme`/`zaman.js`/`tablo.js`: derlenmiş metindeki her "N. ders…" ve "dNN" atfının hedefi ORTAK.md'deki sıraya göre hesaplandı. Cümledeki zaman ekiyle (gördün / göreceksin …) hedefin önce mi sonra mı geldiği karşılaştırıldı ve işaretlenen 73 satır elle elendi. on_bilgi, sıraya göre ayrıca denetlendi.
- `bozuk.js`: bozuk adres (`#ders/sozluk/%E0%A4%A`) ve bozuk localStorage değerleri (kartlar, dersBitti, acikUnite, sinavSonuc, sinavYanlis, sesHiz, sesGunluk, kartSesli) tarayıcıda denendi.
- `kid.js`: 2 913 kart kimliğinin (kid) varlığı, öneki ve tekliği, ayrıca sınav soru kimliklerinin tekliği denetlendi.

Temiz çıkanlar (bulgu değil):
- on_bilgi'de sıra ihlali yok (58 ders).
- kid eksiği, yanlış öneki ya da tekrarı yok. Sınav id tekrarı yok.
- Bozuk localStorage değerleriyle liste, kartlar, ders ve sınav çökmeden açıldı.
- parcala hiçbir blokta karakter kaybetmedi ve tavanı aşmadı (35 127 parça).
- "önceki derste", "bir sonraki ders", "ilk derste" türü göreli atıflar doğru.
- MÖ/MS, "%5'i" türü ekler, km/s'dir, M☉'lik, K'ye, °C, binlik ayraç ve basit kesirler doğru okunuyor.

### Bulgular

#### A3-01 · ÖNEMLİ · arastirma/dersler_v2 (21 ders, 71 yer; tablo ekte)
- Açıklama: Ders sırası değişince "N. derste gördün / gördüğün gibi / anlatılan / konusuydu" gibi geçmiş zamanlı atıfların hedefi artık SONRA geliyor. "N. derste göreceksin / göreceğin gibi" gibi gelecek zamanlı atıfların hedefi ise artık ÖNCE geliyor. Numara doğru derse çevriliyor (ders_verisi_v2.py `numarala`), ama cümle okura yanlış şey söylüyor: henüz okumadığı dersi "gördün" diyor. 21 derste 71 yer.
- Kanıt (seçme; dersin sırası parantezde):
  - d40 (18) `d40.json:67` → veri: "Europa'nın yeraltı okyanusunu ve Europa Clipper görevini 42. derste gördün". 42. ders = d18, sırada 42.
  - d36 (14) `d36.json:119` → "ama 42. derste gördüğün gibi yüzeyi başka bir geçmiş anlatıyor" (d18, sıra 42).
  - d23 (23) `d23.json:17` → "Mars'a giden araçların orada ne aradığı 42. dersin konusuydu".
  - d58 (37) `d58.json:53,77,80,131,180` → "38. derste … gördün" (d8, sıra 38).
  - Ters yön: d49 (35) `d49.json:15,39,52,206` → "33. derste göreceğin gibi" (d7, sıra 33). d37 (15) `d37.json:59,170` → "8. derste göreceksin" (d34, sıra 8). d53 (57) `d53.json:115` → "Ayrıntısını 55. derste … göreceksin" (d52, sıra 55). d52 (55) `d52.json:65` → "53. derste" (d51, sıra 53).
  - Komut: `node a3a/zaman.js && node a3a/tablo.js` (73 işaret, 2'si yanlış alarm olarak elendi).
- Önerilen düzeltme: Zaman eki sıraya göre yeniden yazılmalı ("gördün" ↔ "göreceksin"). Ya da derleme betiğine, atıf hedefinin sırası ile fiilin zamanını karşılaştıran bir denetim eklenmeli (test: hata_ayiklama.spec.js'teki "N. ders" testinin yanına).

#### A3-02 · ÖNEMLİ · d9.json:68, d39.json:18, d40.json:21, d40.json:180, d41.json:144, d42.json:199
- Açıklama: "4. ve 11. dersler" gibi ikili atıflarda yalnız ikinci sayı çevriliyor. ders_verisi_v2.py:78 deseni `(\d{1,2})\. ders` "4. ve" kısmını yakalamıyor. Birinci sayı dosya kimliği olarak kalıyor ve uygulamada BAŞKA bir derse işaret ediyor.
- Kanıt (kaynak → veri/dersler.json):
  - d9:68 "(4. ve 11. dersler)" → veri:5808 "(4. ve 3. dersler)". 4. ders artık d21 (Takımyıldızlar). Güneş güvenliği d4'te, o da sırada 24.
  - d39:18 ve d40:21 "37. ve 38. dersler" → "37. ve 16. dersler". 37. ders artık d58 (Kozmik mikrodalga). Jüpiter dersi d37, sırada 15.
  - d40:180 "3. ve 9. derslerde" → "3. ve 9.". 3. ders d11 (Dürbün). Kastedilen d3, sırada 7.
  - d42:199 "19. ve 43. derslerin" → "19. ve 22. derslerin". 19. ders d41. Kastedilen d19, sırada 20.
  - d41:144 "9. ve 11." → "9. ve 3.". d9 yine 9. sırada; tesadüfen doğru.
  - Komut: `grep -P "\d{1,2}\.(, \d{1,2}\.)* (ve|ile) \d{1,2}\. ders" veri/dersler.json`.
- Önerilen düzeltme: `numarala` "N. ve M. ders", "N., M. ve K. ders" biçimlerini de çevirmeli. Ya da kaynak metinler "d4 ve d11" biçimine geçmeli.

#### A3-03 · ÖNEMLİ · arastirma/dersler_v2 (40 ders, ~465 yer); ders_verisi_v2.py:73–83
- Açıklama: Kaynakta "(d20)", "(d1)", "d23'e göre", "d12'ye göre", "d3'ü", "d8 ve …" gibi dosya kimliği atıfları çevrilmeden ekranda kalıyor ve sesli okunuyor. Çevirici yalnız kesmeli ve EK_DERS listesindeki eklerde (bulunma, ayrılma, ilgi) çalışıyor. Ek almayan "(dNN)" ile yönelme (-e/-ye/-a/-ya), belirtme (-ü/-u) ve "-dakilerle" ekleri dışarıda kalıyor. Okur "d20" görüyor, ama uygulama dersleri "Ders 40 / 58" diye numaralıyor. Bağlantı da değil. Ses "d yirmi" okuyor.
- Kanıt:
  - `d21.json:15` → veri:2454 "Eski Mısırlılar Avcı'nın yerinde tanrı Sah'ı gördü (d20)". d20 uygulamada 40. ders.
  - `d36.json:174` "d23'e göre yaklaşık 0,9 km/s" ve `d44.json:209` "d12'ye göre" ekranda aynen duruyor.
  - Sayım: eksiz 434, ekli 31 (d…'ye 7, d…'e 15, d…'ya 4, d…'a 2, d…'ü 1, d…'u 1, d…'dakilerle 1). En çok: d48 30, d57 28, d21 26, d58 25, d44 22. Sesli okunan metinde kalan "dNN" sayısı 434.
- Önerilen düzeltme: `numarala` eksiz "(dNN)" atfını "(N. ders)" yapmalı, EK_DERS'e yönelme ve belirtme ekleri eklenmeli ("dersine", "dersi"). İstenirse bunlar `#ders/dNN` bağlantısına dönüştürülebilir.

#### A3-04 · ÖNEMLİ · okunus.js:127 · d27.json:32, d28.json:106
- Açıklama: "e⁻" (elektron) kuralı, arkasından üst simge rakam gelince de çalışıyor. Bilimsel gösterimdeki e üzeri eksi x, "elektron" diye okunuyor ve üssün işareti kayboluyor.
- Kanıt: `node -e "const {okunus}=require('C:/Users/Kaan/urania/okunus.js');console.log(okunus('e⁻²·⁵ ≈ 0,082, e⁻²⁵ ≈ 1,4 × 10⁻¹¹.'));console.log(okunus('kabaca e⁻⁴⁰⁷ ile orantılıdır'))"` →
  - "elektron kare ⁵ yaklaşık 0,082, elektron kare ⁵ yaklaşık 1,4 çarpı 10 üzeri eksi 11." (d27 tünelleme örneği. Doğrusu "e üzeri eksi 2,5" ve "e üzeri eksi 25")
  - "kabaca elektron üzeri 407 ile orantılıdır" (d28 "Güneş'in yanması"; doğrusu "e üzeri eksi 407". Eksi işareti de kayboluyor)
- Önerilen düzeltme: 127. satırdaki `(?![A-Za-z])` yerine `(?![A-Za-z⁰-⁹¹²³·])`. Üslü e için ayrı kural: `e⁻<rakamlar>` → "e üzeri eksi …".

#### A3-05 · ÖNEMLİ · okunus.js:182 ve 186 · d51.json:115, d51.json:173
- Açıklama: (a) Kapanış parantezinden ya da harften sonra gelen "²" ardında başka üst simge rakam olsa da "kare" okunuyor (182. satırda `(?![⁰-⁹])` yok). (b) Üst simge içindeki "·" ondalık ayracı tanınmıyor.
- Kanıt: `okunus('(1 − 0,00135)²⁰ ≈ 0,973')` → "(1 eksi 0,00135) kare ⁰ yaklaşık 0,973". Üs 20 iken "kare" okunuyor ve "⁰" artıyor. `okunus('yoğunluk 2¹·⁵ ≈ 2,83 katına')` → "2 üzeri 1 ⁵". `okunus('2⁻⁰·⁶ ≈ 0,66')` → "2 üzeri eksi 0 ⁶". Doğrusu "üzeri 1,5" ve "üzeri eksi 0,6".
- Önerilen düzeltme: 182. satıra `(?![⁰-⁹⁻])` eklenmeli. Üst simge dizisinde `·` → virgül olarak okunmalı (186. satırdaki dizi `[⁻⁰-⁹·]` olmalı, `·` → ",").

#### A3-06 · ÖNEMLİ · okunus.js:22–29 (BIRIM) · çok sayıda ders
- Açıklama: Birçok birim kısaltması açılmıyor. Motor bunları harf harf ya da sözcük gibi okuyor ("eV" Türkçe "ev" sözcüğü gibi). "μ" ön eki "mikro" yerine Yunan harfi "mü" okunuyor.
- Kanıt (sesli okunan metinde kalan sayılar, `node a3a/ik.js`):
  - eV 72, keV 40, GeV 40, TeV 6, peV 2, μeV ("mü eV") 8. MeV açılıyor ("mega elektronvolt"), ötekiler açılmıyor. Örnek d2: "iyonlaştırmak için ise 13,6 eV gerekir" → okunuş aynen "13,6 eV". d28 "keV'tur", d26 "GeV'dir".
  - GHz 14 (d14 "115 GHz" → "115 GHz"; aynı cümlede Hz "hertz" açılıyor).
  - Pa 5, kPa 1, hPa 1, GPa 2 (d44 "330–360 GPa" → "330 ile 360 GPa").
  - μT → "mü T" (d33:85, 176, 295, 296, 444; d44:458: "22 ile 67 mü T"), T (tesla) "MR 1,5 ile 3 T". μs → "mü s" (d25:283 vd.), ns 4.
  - Sv 2 (d36 "1,01 Sv"), MW 2, mg 2, Å 1 (d27:101 "foton bölü (santimetre kare çarpı s çarpı Å)", burada "s" de açılmıyor), µas 1 (d46:431, U+00B5 mikro işareti: "43,9 µas").
  - "mü s/T/eV" toplam 21.
- Önerilen düzeltme: BIRIM'e elektronvolt ailesi (eV, keV, GeV, TeV, μeV, peV), GHz, Pa ailesi, T/μT (tesla, mikrotesla), μs/ns, Sv, MW, mg, Å (angstrom), µas/mas (mikro / mili yay saniyesi) eklenmeli. Okumadan önce U+00B5 → μ çevrilmeli. "μ" ön eki birim içindeyse "mikro" okunmalı.

#### A3-07 · ÖNEMLİ · okunus.js:186 ve 193 · d2.json:540, d50.json:161, d29.json:183, d30.json:195, d45.json:238–248, d48.json:51/215
- Açıklama: Bazı formül işaretleri okunmuyor ya da yanlış okunuyor. Okunuşta 9 üst simge kalıyor.
- Kanıt (`okunus(...)`):
  - "1/λ⁴" → "1 bölü lambda ⁴". 186. satırdaki üs kuralı Yunan harfini kapsamıyor, Yunan harfi 193. satırda sonradan açılıyor. Rayleigh ters dördüncü kuvvet: "üzeri 4" okunmalıydı.
  - "⁴√2 ≈ 1,19" → "⁴ karekök 2". Dördüncü kök "karekök" okunuyor (d50, Tully–Fisher örneği).
  - "(1 − p)ᴺ" → "(1 eksi p)ᴺ" (d29). "ᴺ" okunmuyor.
  - "S = k·A/(4ℓ²)" → "S eşittir k A bölü (4ℓ²)" (d30). "ℓ" harf sınıfında olmadığı için "kare" de okunmuyor.
  - "τ = P/2Ṗ", "√(PṖ)", "Ė", "Ṁ" (d45, d48). Türev noktası okunmuyor; "P" ve "Ṗ" aynı sesle çıkıyor.
  - "½ × m × v²", "T½" (d3, d34, d30, d25, d26; 12 blok). "½" okunus'tan geçmeden kalıyor. Basit kesir kuralı (119. satır) yalnız "1/2" biçimini çeviriyor.
- Önerilen düzeltme: 186. satırın sol sınıfına `α-ωΑ-Ωℓ` eklenmeli. "ᴺ" gibi değiştirici harfler "üzeri N" okunmalı. "ⁿ√x" → "x'in n'inci kökü". "½" → "yarım" ya da "ikide bir". Nokta işaretli harflerde "P nokta" gibi bir okunuş verilmeli.

#### A3-08 · ÖNEMLİ · sozluk.js:45 + veri/sozluk.json (araclar/sozluk_yap.py desenleri)
- Açıklama: Birleşik ifade her desenin arkasına `\p{L}*` ekliyor. Kısa ve kısıtsız desenler bu yüzden BAŞKA kelimelerin içinde eşleşiyor ve kelime yanlış tanımla altı noktalı oluyor. Aynı desenler "Geçtiği dersler" listesini de şişiriyor: "Sol" (Mars günü) 37 derste, "evre" 47 derste, "ada" 31, "zar" 26, "kuşak" 26 derste "geçiyor" görünüyor. Bunların "tanimli" dersi tek (d36, d29, d52, d53, d32).
- Kanıt (tarayıcıda gerçek işaretler; `a3a/isaret_ciftleri.txt`):
  - Sol ⇐ "soluk" 17 ders (d2.json:140 "o soluk leke"), "sola" (d1.json:57), "solucan" (d50, d52, d56), "Solar", "sollarken", "soluduğumuz".
  - ada ⇐ "aday" 12 (d34.json:168), "Adams" 5, "adam", "adasından" (d10).
  - zar ⇐ "zarar" (d9), "zararsız", "zarf", "zarif/zarifti" (d34.json:25).
  - evre (dalganın evresi) ⇐ "evren/evrenin/evreni" 7+ (d2.json:26 "evrenin geçmişini"), "evrensel".
  - köşe ⇐ "köşegen" (d24, d5). durak ⇐ "durağan" (d16, d57, d8).
  - MOND ⇐ "Monday" (d22.json:214). RAW ⇐ "Rawlins" (d39.json:39). ISO ⇐ "ISON" (d19.json:109, d42).
  - orbital ⇐ "orbitalradar" (d10.json:171). Şişme ⇐ "şişmesinden" (d44.json:17), "şişmez".
  - halka yayı ⇐ "halka halka yayılan" (d48.json:167, d27, d33). yok olma (yok olma = parçacık–karşı parçacık) ⇐ "yok olmaz" (d47, d31). yoğunluk dalgası (sarmal kol) ⇐ "yoğunluk dalgalanması" (d58.json:119, d54, d52).
  - Lorentz çarpanı ⇐ "Lorentz değişmez yöntemle" (d51.json:425).
- Önerilen düzeltme: Ek kısmı `\p{L}*` yerine Türkçe çekim ekleriyle sınırlanmalı, ya da ≤5 harfli terimlerde yalnız kesmeli ek / tam kelime kabul edilmeli. "Sol", "ada", "zar", "evre", "köşe", "durak", "kuşak", "MOND", "RAW", "ISO" gibi terimlere `yalniz` (ders kısıtı) ya da `buyuk` (büyük harf koşulu) eklenmeli. Ders listeleri aynı kuralla yeniden üretilmeli.

#### A3-09 · ÖNEMLİ · veri/sozluk.json (anlam çakışması; tam kelime eşleşmesi)
- Açıklama: Kelime tam eşleşiyor, ama metindeki anlam terimin tanımı değil. Okur dokununca konuyla ilgisiz tanım görüyor.
- Kanıt:
  - kuşak (tanım: Standart Model'de parçacık kuşağı) ⇐ d1/d21/d3 burç kuşağı, d12 "gezegenin üstündeki ince bir kuşağı", d24 "bulut kuşakları", d11.json:75 "kuşaktan kuşağa aktarmış" (insan kuşağı).
  - bataklık (sicim kuramı "swampland") ⇐ d43.json:68 "krater sanılan bir bataklık çukurunu kuruttu".
  - sıkılık (G·M/(R·c²)) ⇐ d47.json:96 "kolların sarılma sıkılığını", d48 "M–σ ilişkisinin sıkılığının".
  - durak (fotoğrafta ışık adımı) ⇐ d23.json:122 "her iki durak arasında" (metro haritası), d45 "ara duraklardan".
  - zar (sicim kuramı zarı) ⇐ d44.json:156 "İnce bir zar" (atmosfer benzetmesi), d35 "zar zor".
  - köşe (Feynman köşesi) ⇐ d21.json:31 "köşe noktalarının koordinatları", d42/d14 "en soğuk köşesinde".
  - evre (dalga evresi) ⇐ d1.json:134 "Venüs ise hilal evresinde", d11 "Venüs'ün evreleri", d24 "her evre adımı" (Ay/gezegen evresi).
  - ISO (kamera duyarlılığı) ⇐ d4, d10, d11 "ISO 12312-2" / "ISO 14132" (standart numarası).
  - günberi (tanım: "Dünya'nın yörüngesinde … Ocak başına denk gelir") ⇐ d19.json:113 Halley, d35 Merkür, d36 Mars, d41, d42 kuyruklu yıldız. Genel tanımlı "Günberi / günöte" kaydı aynı uzunlukta desenle sıraya giriyor, ama "günberi" kelimesi hep Dünya'ya özgü kayda gidiyor.
  - yok olma ⇐ d45.json:156 "canlı türlerinin yok olmasına" (nesil tükenmesi), d7.json:99 "yok olma tehlikesinde", d6.
  - Metal (gökbilimdeki "helyumdan ağır element") ⇐ d12.json:34 "parlatılmış bir metal alaşımından", d35/d36 "metal çekirdek", d37 "hidrojenin nasıl metale dönüştüğünü".
  - Frekans (f) ⇐ "Frekansçı" (d51: "istatistiğin iki okulu … Frekansçı denen yaklaşımla") ve Süpernova birleşik analizi haberindeki "frekansçı".
- Önerilen düzeltme: Bu terimler `yalniz` ile kendi derslerine kısıtlanmalı (kuşak→d32, bataklık→d53, sıkılık→d45, durak→d24, zar→d53/d55, köşe→d29, evre→d29, ISO→d24, MOND→d17/d50/d51). "günberi" kaydı genel tanıma bağlanmalı ya da kaldırılmalı.

#### A3-10 · KÜÇÜK · okunus.js (kısaltma kuralı yok), okunus.js:109 · d40.json:121,136,162,403,468; d1.json:27,356; d44.json:461; d10.json:493,499; d20.json:401; veri/haberler.json (Makale satırları)
- Açıklama: Metindeki kısaltmalar açılmıyor ve yanlış okunuyor. "ark." → "ark" (kanal anlamındaki Türkçe sözcük), "vd." → "vd", "ort." → "ort", "St." → "St". MÖ/MS kuralı "~"dan sonra çalışmıyor.
- Kanıt: okunuşta kalan sayılar: "vd." 15 (haberlerin "Makale: Caleb vd., …" satırları), "ark." 9 (d40 "Petricca ve ark. (Nature…"), "ort." 3 (d44 "ort. 3682 metre", d10 "her gün ort. yaklaşık 50 dakika"), "St." 4 (d1 "St. Petersburg", d6 "St. Gallen"). `okunus('Almagest (~MS 150)')` → "Almagest (yaklaşık MS 150)": 109. satırdaki önce-gelen sınıfı `[\s(–-]` "~" içermiyor (d20.json:401). Aynı cümlenin "yaklaşık MS 150" biçimi başka yerde doğru okunuyor.
- Önerilen düzeltme: "vd." → "ve diğerleri", "ark." → "ve arkadaşları", "ort." → "ortalama", "St." → "Saint" kuralları eklenmeli. 109. satırın sınıfına `~≈` eklenmeli.

#### A3-11 · KÜÇÜK · okunus.js:206, 223 · d2.json:537, d44.json:461, d22 (Takvim), d23/d47
- Açıklama: "→" her yerde ", yani" okunuyor. Geçiş ve dönüşüm anlamında yanlış: "n→1" → "n, yani 1" (d2 Lyman serisi), "Sera: 255 → 288 K" → "255, yani 288 kelvin" (d44), "15 Şubat 1332 → 1 Mart 1333" → "…, yani 1 Mart 1333" (d22). ">" ile milyon/milyar birlikte gelince sözcük sırası bozuluyor: ">1,2 milyon" → "1,2 üstü milyon" (d23), ">10 milyar yaş" → "10 üstü milyar yaş", ">3 trilyon" (d47).
- Kanıt: `node a3a/ctx.js "\d üstü (milyon|milyar|trilyon)"` → 3 yer. `okunus('Lyman (n→1, morötesi)')` → "Lyman (n, yani 1, morötesi)".
- Önerilen düzeltme: İki sayı ya da harf arasındaki "→" için "…'den …'e" ya da "sonra". `>` + sayı + (bin|milyon|milyar|trilyon) için çarpanı da kapsayan "… fazla".

#### A3-12 · KÜÇÜK · ses.js:53–57 (parcala cümle bölme) · d1.json:27, d45 (Caplan, Schneider ve Horowitz cümlesi)
- Açıklama: Büyük harfle devam eden kısaltma ya da baş harf, cümle sonu sayılıyor ve ayrı konuşmaya bölünüyor (600 tavanında 2 yer). Sonuç ad ortasında durak: "Daha kuzeydeki St. ‖ Petersburg'dan…", "M. E. Caplan, A. S. Schneider ve C. J. ‖ Horowitz'in…".
- Kanıt: `node a3a/parca.js` (+ parcalar alanı). Başka bölme hatası yok: kayıp 0, tavan aşımı 0. 180 tavanında (bekçinin kısa kipi) formül ortasında kesim 163 yerde, ama bu tasarım gereği boşluktan bölme.
- Önerilen düzeltme: 56. satırdaki birleştirme koşuluna "tek büyük harf + nokta" ve bilinen kısaltma listesi (St., Dr., vd., ark.) eklenmeli.

#### A3-13 · KÜÇÜK · dersler.js:428
- Açıklama: Sözlük derin bağlantısında `decodeURIComponent` korumasız. Bozuk yüzde kodlu adres bölümü "Dersler yükleniyor…" yazısında bırakıp hata kutusu gösteriyor. Hata ilk() içinde fırladığı için uygulama.js `ilkKurulan['ders']=false` yapıyor. Bölüme bir sonraki gelişte ilk() yeniden çalışıyor ve dersler.js:405–411'deki `toggle`/`click` dinleyicilerini aynı öğeye ikinci kez ekliyor.
- Kanıt: `node a3a/bozuk.js` → "1) bozuk adres: Dersler yükleniyor… Bu bölüm açılırken hata oluştu: URI malformed." Konsol: "URIError: URI malformed at decodeURIComponent at goster (dersler.js:428:134) at Object.ilk (dersler.js:422:5)".
- Önerilen düzeltme: `try { decodeURIComponent(...) } catch { ham parametre }`. Sunucu tarafı (testler/sunucu.js:8) bunu zaten yapıyor.

#### A3-14 · KÜÇÜK · veri/sozluk.json (çift kayıt)
- Açıklama: Aynı kavramın iki kaydı var ve biri hiç işaretlenmiyor. İki kayıt aynı deseni paylaşıyor, `hazirla` uzunluğa göre sıralıyor, eşit uzunlukta ilk gelen kazanıyor.
  - "Hubble yasası" (eş: Hubble–Lemaître yasası) ↔ "Hubble–Lemaître yasası": metindeki bütün "Hubble–Lemaître yasası" geçişleri ilk kayda gidiyor. İkinci kaydın "Geçtiği dersler" 5 ders gösteriyor, ama hiçbir yerde işaretlenmiyor.
  - "Metal" (eş: metalisite) ↔ "Metalisite": "metalisite" desen çakışması.
  - "günberi" ↔ "Günberi / günöte" (A3-09'da anlamı yanlış olan taraf kazanıyor).
- Kanıt: `node -e` ile desen çakışma taraması: "DESEN ÇAKIŞMA günberi gunberi,gunberi-gunote", "hubble-lemaitre\s+yasası hubble-yasasi,hubble-lemaitre-yasasi", "metalisite metal,metalisite".
- Önerilen düzeltme: Kayıtlar birleştirilmeli ya da biri eş anlamlıya indirilmeli.

### Askıda
- Roma rakamları (Kepler II/III, Popülasyon I/II/III, H II, Artemis II, XV. Louis, XIII. Gregorius, III. George; ~80 yer) okunus'tan geçmeden kalıyor. Motorun (Kaan'ın telefonunda ElevenReader / Google TTS) bunları "iki / üçüncü" mü, harf harf mi okuduğunu cihazda dinleyemedim. Özellikle tek "I" (Popülasyon I) Türkçe sesle "ı" harfi gibi çıkabilir, ama kanıtım yok.
- "7×50", "10×50" (543 yer, çoğu dürbün) "7 çarpı 50" okunuyor. Dürbün gösterimi çarpma değil. Türkçede yerleşik okunuşu ("yediye elli"?) kaynakla doğrulayamadım.
- "Elias 2-24" (haber) ve "3-4-5 üçgeni" tireleri bilerek bırakılıyor (okunus.js:116). Motorun "eksi" okuyup okumadığı cihazda denenmedi.
- Sıra sayıları ("3. adım", "42. derste") ve noktalı saatler ("00.21 UTC") okunus'ta çevrilmiyor. Motorun bunları "üçüncü" / "sıfır yirmi bir" okuduğunu varsaydım, doğrulayamadım.
- Haber makale başlıklarındaki "∼" (U+223C, d. chime haberi) ve "…" okunmuyor. Etkisi motora bağlı.

### Ek: A3-01 tablosu (kaynak satırı | ders (sırası) | atıf → hedef (sırası) | sorun)
| kaynak satırı | ders (sıra) | atıf → hedef | sorun |
|---|---|---|---|
| d34.json:16 | d34 (sıra 8) | "9. derste" → d9 (sıra 9) | geçmiş zaman, hedef SONRA |
| d34.json:34 | d34 (sıra 8) | "9. derste" → d9 (sıra 9) | geçmiş zaman, hedef SONRA |
| d34.json:61 | d34 (sıra 8) | "9. derste" → d9 (sıra 9) | geçmiş zaman, hedef SONRA |
| d34.json:90 | d34 (sıra 8) | "11. derste" → d10 (sıra 11) | geçmiş zaman, hedef SONRA |
| d34.json:117 | d34 (sıra 8) | "9. derste" → d9 (sıra 9) | geçmiş zaman, hedef SONRA |
| d34.json:131 | d34 (sıra 8) | "20. derste" → d19 (sıra 20) | geçmiş zaman, hedef SONRA |
| d34.json:143 | d34 (sıra 8) | "11. derste" → d10 (sıra 11) | geçmiş zaman, hedef SONRA |
| d44.json:141 | d44 (sıra 10) | "23. derste" → d23 (sıra 23) | geçmiş zaman, hedef SONRA |
| d44.json:205 | d44 (sıra 10) | "11. derste" → d10 (sıra 11) | geçmiş zaman, hedef SONRA |
| d35.json:84 | d35 (sıra 13) | "46. derste" → d26 (sıra 46) | geçmiş zaman, hedef SONRA |
| d36.json:119 | d36 (sıra 14) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d36.json:122 | d36 (sıra 14) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d36.json:137 | d36 (sıra 14) | "42. dersteki" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d36.json:172 | d36 (sıra 14) | "23. derste" → d23 (sıra 23) | geçmiş zaman, hedef SONRA |
| d36.json:173 | d36 (sıra 14) | "23. derste" → d23 (sıra 23) | geçmiş zaman, hedef SONRA |
| d36.json:174 | d36 (sıra 14) | "23. derste" → d23 (sıra 23) | geçmiş zaman, hedef SONRA |
| d36.json:175 | d36 (sıra 14) | "23. derste" → d23 (sıra 23) | geçmiş zaman, hedef SONRA |
| d36.json:190 | d36 (sıra 14) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d36.json:203 | d36 (sıra 14) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d37.json:17 | d37 (sıra 15) | "41. derste" → d13 (sıra 41) | geçmiş zaman, hedef SONRA |
| d37.json:48 | d37 (sıra 15) | "26. derste" → d5 (sıra 26) | geçmiş zaman, hedef SONRA |
| d37.json:59 | d37 (sıra 15) | "8. derste" → d34 (sıra 8) | gelecek zaman, hedef ÖNCE |
| d37.json:120 | d37 (sıra 15) | "44. derste" → d33 (sıra 44) | geçmiş zaman, hedef SONRA |
| d37.json:123 | d37 (sıra 15) | "44. derste" → d33 (sıra 44) | geçmiş zaman, hedef SONRA |
| d37.json:170 | d37 (sıra 15) | "8. derste" → d34 (sıra 8) | gelecek zaman, hedef ÖNCE |
| d40.json:21 | d40 (sıra 18) | "37. ve 16. derslerde" → d58 (sıra 37) | geçmiş zaman, hedef SONRA |
| d40.json:43 | d40 (sıra 18) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d40.json:67 | d40 (sıra 18) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d40.json:104 | d40 (sıra 18) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d40.json:127 | d40 (sıra 18) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d40.json:178 | d40 (sıra 18) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d41.json:25 | d41 (sıra 19) | "20. derste" → d19 (sıra 20) | geçmiş zaman, hedef SONRA |
| d41.json:140 | d41 (sıra 19) | "20. derste" → d19 (sıra 20) | geçmiş zaman, hedef SONRA |
| d41.json:168 | d41 (sıra 19) | "8. derste" → d34 (sıra 8) | gelecek zaman, hedef ÖNCE |
| d43.json:60 | d43 (sıra 22) | "45. derste" → d25 (sıra 45) | geçmiş zaman, hedef SONRA |
| d43.json:112 | d43 (sıra 22) | "50. derste" → d31 (sıra 50) | geçmiş zaman, hedef SONRA |
| d23.json:17 | d23 (sıra 23) | "42. dersin" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d23.json:110 | d23 (sıra 23) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d23.json:125 | d23 (sıra 23) | "42. derste" → d18 (sıra 42) | geçmiş zaman, hedef SONRA |
| d6.json:141 | d6 (sıra 28) | "40. derste" → d20 (sıra 40) | geçmiş zaman, hedef SONRA |
| d45.json:89 | d45 (sıra 29) | "48. derste" → d28 (sıra 48) | geçmiş zaman, hedef SONRA |
| d45.json:112 | d45 (sıra 29) | "46. derste" → d26 (sıra 46) | geçmiş zaman, hedef SONRA |
| d45.json:182 | d45 (sıra 29) | "46. derste" → d26 (sıra 46) | geçmiş zaman, hedef SONRA |
| d45.json:182 | d45 (sıra 29) | "30. derste" → d16 (sıra 30) | geçmiş zaman, hedef SONRA |
| d45.json:196 | d45 (sıra 29) | "51. derste" → d32 (sıra 51) | geçmiş zaman, hedef SONRA |
| d46.json:17 | d46 (sıra 31) | "33. derste" → d7 (sıra 33) | geçmiş zaman, hedef SONRA |
| d46.json:28 | d46 (sıra 31) | "39. derste" → d17 (sıra 39) | geçmiş zaman, hedef SONRA |
| d46.json:39 | d46 (sıra 31) | "33. derste" → d7 (sıra 33) | geçmiş zaman, hedef SONRA |
| d46.json:128 | d46 (sıra 31) | "38. derste" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d46.json:129 | d46 (sıra 31) | "38. derste" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d46.json:169 | d46 (sıra 31) | "33. derste" → d7 (sıra 33) | geçmiş zaman, hedef SONRA |
| d46.json:191 | d46 (sıra 31) | "33. derste" → d7 (sıra 33) | geçmiş zaman, hedef SONRA |
| d7.json:17 | d7 (sıra 33) | "30. derste" → d16 (sıra 30) | gelecek zaman, hedef ÖNCE |
| d48.json:140 | d48 (sıra 34) | "39. derste" → d17 (sıra 39) | geçmiş zaman, hedef SONRA |
| d48.json:153 | d48 (sıra 34) | "d8" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d48.json:153 | d48 (sıra 34) | "39. derste" → d17 (sıra 39) | geçmiş zaman, hedef SONRA |
| d49.json:15 | d49 (sıra 35) | "33. derste" → d7 (sıra 33) | gelecek zaman, hedef ÖNCE |
| d49.json:39 | d49 (sıra 35) | "33. derste" → d7 (sıra 33) | gelecek zaman, hedef ÖNCE |
| d49.json:52 | d49 (sıra 35) | "33. derste" → d7 (sıra 33) | gelecek zaman, hedef ÖNCE |
| d49.json:206 | d49 (sıra 35) | "33. derste" → d7 (sıra 33) | gelecek zaman, hedef ÖNCE |
| d57.json:75 | d57 (sıra 36) | "38. dersteki" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d57.json:107 | d57 (sıra 36) | "38. derste" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d58.json:53 | d58 (sıra 37) | "38. derste" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d58.json:77 | d58 (sıra 37) | "38. derste" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d58.json:80 | d58 (sıra 37) | "38. derste" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d58.json:131 | d58 (sıra 37) | "38. derste" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d58.json:180 | d58 (sıra 37) | "38. derste" → d8 (sıra 38) | geçmiş zaman, hedef SONRA |
| d20.json:159 | d20 (sıra 40) | "39. derste" → d17 (sıra 39) | gelecek zaman, hedef ÖNCE |
| d13.json:62 | d13 (sıra 41) | "30. derste" → d16 (sıra 30) | gelecek zaman, hedef ÖNCE |
| d52.json:65 | d52 (sıra 55) | "53. derste" → d51 (sıra 53) | gelecek zaman, hedef ÖNCE |
| d53.json:115 | d53 (sıra 57) | "55. derste" → d52 (sıra 55) | gelecek zaman, hedef ÖNCE |

Komut: `node a3a/zaman.js; node a3a/tablo.js` (geçici klasör: scratchpad/denetim/a3a). İki yanlış alarm (d34 "25. derste … inceleyeceksin" ve d45 "30. dersteki GW150914") çıkarıldı.

---

## Alan 3 (ikinci yarı): Sınav cevapları ve ders çizimleri (Urania v39 denetimi, 2026-10-30)

### Okunan dosyalar

| dosya | satır | tamamı okundu mu |
|---|---|---|
| veri/sinavlar.json | 3050 (216 soru, 11 ünite) | Evet. 216 sorunun bütün alanları (soru, şıklar, doğru şık, açıklama, ders, bölüm) betikle tek döküme çıkarıldı. Bu döküm baştan sona okundu (sinav_dokum.md, 2376 satır). |
| arastirma/dersler_v2/d20_sinav.json … d58_sinav.json (39 dosya) | her biri 4 soru, toplam 156 | Evet. sinavlar.json'daki karşılıklarıyla alan alan karşılaştırıldı: boşluk dışında fark yok. İçerik aynı döküm üzerinden okundu. |
| arastirma/dersler_v2/dNN.json (58 ders) | — | Hayır. Her sorunun dayandığı bölümden en uygun üç cümle betikle çıkarıldı ve okundu. Açıklamalardaki sayılar ve özel adlar, dersin bütün metninde betik ve grep ile arandı. Derslerin tamamı okunmadı. Ders metni denetimi bu alanın ilk yarısının işi. |
| dersler.js | 432 | Hayır. Okunan aralıklar: 90–110 (çizim yerleştirme), 215–311 (sınav, şık sırası, doğru cevap dizini) ve 414 (betik listesi). |
| kartlar.js | — | Yalnız sınavla ilgili satırlar okundu: 15–24, 71–77. |
| sw.js | 66 | Yalnız satır 8 (ASSETS) okundu. |
| cizim.js | 120 | Evet. Ben okudum, G1 alt ajanı da okudu. |
| cizim_gokyuzu.js (704), cizim_gunes_sistemi.js (635), cizim_evren.js (351), cizim_gezegen_yasam.js (313) | — | Evet, G1 alt ajanı okudu. Bulgularını bu raporda koda bakarak yeniden doğruladım. |
| cizim_yildizlar.js (641), cizim_v3.js (725), cizim_v4a.js (422), cizim_v3_kaynak.md, cizim_v4a_kaynak.md | — | Evet, G2 alt ajanı okudu. Bulguları yeniden doğrulandı. |
| cizim_v4b.js (340), cizim_v4c.js (533), cizim_v5a.js (656), cizim_v5b.js (538) ve bunların 4 kaynak notu | — | Evet, G3 alt ajanı okudu. Bulguları yeniden doğrulandı. |
| cizim_v5c.js (506), cizim_v5d.js (720) ve 2 kaynak notu | — | Evet, G4 alt ajanı okudu. Bulguları yeniden doğrulandı. |
| cizim_v6.js (916), cizim_v7.js (349) ve 2 kaynak notu | — | Evet, G5 alt ajanı okudu. Bulguları yeniden doğrulandı. |

**Alt ajanlarla ilgili not:**
- Çizim dosyalarını (yaklaşık 730 KB) beş alt ajan, ORTAK.md kurallarıyla, baştan sona okudu.
- Her ajan, çizimlerin bağlı olduğu ders bölümlerini tam metin olarak okudu.
- Derslerin öteki bölümlerine ve dNN_kaynak.md dosyalarına yalnız hedefli grep ile bakıldı.
- Bu raporda yazan her bulgunun kod satırına ve ders cümlesine ben ayrıca baktım.

**Kapsam dışı bırakılan:** Derslerin içindeki "sorular" alanı (serbest cevaplı kendini sınama soruları) çoktan seçmeli değil. Ders metninin parçası sayıldığı için bu alanda denetlenmedi.

### Yöntem

**Sınav yapısı (`scratchpad/denetim/a3b/sinav1.js`)**
Denetlenen her şey temiz çıktı:
- cevap dizini aralıkta mı;
- şık sayısı (hepsi 4);
- yinelenen şık ya da kimlik;
- ders ünitede mi;
- bölüm dizini aralıkta mı;
- eksik ya da fazla alan;
- dNN_sinav.json ile sinavlar.json arasında fark.

Ayrıca doğru şıkkın konum dağılımı ve uzunluğu sayıldı.

**Dayanak (`sinav2.js`, `sinav3.js`)**
- Her soru için doğru şık ve açıklamayla en çok kelime paylaşan ders cümleleri çıkarıldı. 216 sorunun hepsi elle okundu.
- Açıklamadaki ve doğru şıktaki her sayı dersin metninde arandı. Bulunamayan 17 sayının hepsi soruya özgü ara hesap çıktı ve elle yeniden hesaplandı.
- Açıklamalardaki 60 özel ad ya da ifade derste grep ile arandı. Hepsi bulundu (ör. "alan dönmesi", "BOOMERanG", "Penzias … 3,5 K", "10 sa 33 dk 38 sn").

**Çizim kaydı (`yapi.js`)**
- 16 dosya bir node sanal makinesinde yüklendi. 176 kayıt var, kimlik çakışması yok (ekle() kaydın üstüne sessizce yazdığı için bu ayrıca denetlendi).
- Her çizim üretildi: istisna, NaN ya da undefined çıkmadı.
- ders/bolum alanları geçerli. Sabit renk yok, 13'ten küçük yazı yok.
- Her dersin en az bir çizimi var. Kullanılmayan çizim yok: bölüm dışına bağlanan kayıt bulunmadı.
- dersler.js:414'teki betik listesi ve sw.js:8'deki ASSETS listesi 16 dosyanın hepsini içeriyor. Derslerden çizime ayrı bir kimlik başvurusu yok; çizimler ders ve bölüm alanından bağlanıyor (dersler.js:92).

**Tarayıcı (`tarayici.js`)**
- Kendi sunucumda (port 8144) Chromium `--disable-lcd-text` ile çalıştırıldı. Service worker engellendi, dış ağ kesildi, konum Ataşehir.
- 58 dersin hepsi dört düzende açıldı: 320 px, 551 px, 551 px kırmızı mod ve 320 px kırmızı mod. Her düzende 176 çizim.
- Konsol hatası ya da uyarısı: 0.
- Yazı–yazı çakışması: 0.
- Kırmızı modda bütün SVG öğelerinin hesaplanmış fill ve stroke değerlerinde, G ya da B kanalı R'nin %30'unu aşan renk: 0. Gradyan ya da resim yok; tek url() bir kırpma yolu.
- Taşma: döndürülmüş 7 eksen adında ("eğiklik", "yükseklik (km)" vb.) ve d36-olympus'taki "20 km" yazısında, yazı kutusu SVG kenarını 1–3 px aşıyor. Overflow görünür ve gizli iken alınan ekran görüntüleri karşılaştırıldı ve 3× büyütülmüş görüntüye bakıldı: harf mürekkebi kesilmiyor. Kutu yazı tipinin boş payından taşıyor. Bulgu sayılmadı.

**Hesaplar**
Node ile ya da Astronomy Engine 2.1.19 ile yapıldı. Ayrıntılar alt ajan betiklerinde: `scratchpad/denetim/a3b/g1…g5/hesap.js`.

### Bulgular

#### A3B-01 · KRİTİK · cizim_v6.js:689, 707–708 (ve KAYNAK.andreassen :73; arastirma/cizim_v6_kaynak.md:117)
- **Açıklama:** d55-gelecek-takvimi, vakum bozunması için "≈10¹³⁹ yıl; %95 alt sınır 10⁵⁸ yıl" yazıyor ve sözlü anlatımda da aynısını söylüyor. Dersin güncel metni bu değerleri makalenin ilk sürümlerine ait sayıyor. Son sürümün (v4) değerleri ~10¹⁶¹ yıl ve %95 güvenle >10⁶⁵ yıl. Ünite sınavındaki d55-4 sorusu da doğru cevap olarak 10¹⁶¹'i veriyor. Bu yüzden çizim, dersle ve sınavla çelişen eski bir sayı gösteriyor.
- **Kanıt:**
  - `grep -o "10¹⁶¹ yıl" arastirma/dersler_v2/d55.json` → 7 eşleşme. d55 bölüm 12: "yazarların Mayıs 2018'de 'sayılar güncellendi' notuyla yayımladığı son sürümde ise ömür yaklaşık 10¹⁶¹ yıl, yüzde 95 güvenle de 10⁶⁵ yıldan uzundur".
  - cizim_v6.js:708: `'10¹³⁹ yıl: vakum bozunması, SM ta…'`.
  - `git log -S"10¹⁶¹" -- arastirma/dersler_v2/d55.json` → 63ef1db (17:13). Çizim 9b2c66e'de (17:43), yani düzeltmeden sonra eklenmiş.
  - KAYNAK URL'si `arxiv.org/abs/1707.08124v2`, yani eski sürüm.
- **Önerilen düzeltme:**
  - Olayları 10⁶⁵ (%95 alt sınır) ve 10¹⁶¹ (Standart Model tahmini) yap. Ekseni ve "karanlık çağ" şeridini en az 10¹⁶⁰'a uzat; şu an Y(140)'ta bitiyor.
  - Sözlü anlatımı, KAYNAK adresini (v4 ya da sürümsüz abs) ve kaynak notunu güncelle.

#### A3B-02 · KRİTİK · cizim_v6.js:695 ve 689 (arastirma/cizim_v6_kaynak.md:116)
- **Açıklama:** d55-gelecek-takvimi, kara delik çağı şeridini `[40, 100, …]` ile 10⁴⁰'tan başlatıyor. Anlatım da "10 üzeri 40 ile 10 üzeri 100 yıl arası" diyor. Dersin güncel metninde bu değer 10⁴³–10¹⁰⁰. 10⁴⁰ değeri IPFS kopyasından alınmış ve derste düzeltilmiş.
- **Kanıt:**
  - d55.json bölüm 9'da "10⁴³ ile 10¹⁰⁰" geçiyor (grep: 1 eşleşme); "10⁴⁰ ile" geçmiyor.
  - git show 63ef1db: `-…10⁴⁰ ile 10¹⁰⁰…` → `+…10⁴³ ile 10¹⁰⁰…`.
  - d55_kaynak.md:114: "Kara delik çağı 10⁴³–10¹⁰⁰ yıl (IPFS kopyasından alınan 10⁴⁰ düzeltildi) | FUT | "10^43 (10 tredecillion) years to approximately 10^100…"".
- **Önerilen düzeltme:** Şeridi 43–100 yap, anlatımı "10⁴³ ile 10¹⁰⁰" olarak düzelt, kaynak notunu güncelle.

#### A3B-03 · KRİTİK · cizim_v6.js:840–841
- **Açıklama:** d56-schwarzschild-haritası bir Kruskal diyagramı ve sözlü anlatımı "ışık 45 derecelik çizgilerle yol alır" diyor. Ama "beyaz delikten çıkan" kesikli ok P(0.15, −1.0)'dan P(1.05, −0.38)'e çiziliyor. ΔT/ΔX = 0,62/0,90 = 0,69, yani ok yataydan 34,6° eğimli. Bu, ışıktan hızlı (uzay benzeri) bir yol: dünya çizgisi olarak fiziksel olarak imkânsız. İki eksen aynı ölçekte (P her iki eksende u = 104 kullanıyor), bu yüzden ekrandaki açı koordinattaki açıyla aynı. Aynı çizimdeki düşen gözlemci eğrisi doğru biçimde zaman benzeri: en küçük |dT/dX| = 1,66.
- **Kanıt:** cizim_v6.js:840 `const w1 = P(0.15, -1.0), w2 = P(1.05, -0.38);`. G5 node çıktısı: `beyaz delik oku dT/dX 0.689 açı(°) 34.6`.
- **Önerilen düzeltme:** Oku zaman benzeri çiz (|ΔT| > |ΔX|). Örnek: (0,15; −0,98) → (0,75; −0,15). Bitiş noktası I. bölgede kalır (X > |T|).

#### A3B-04 · KRİTİK · cizim_v5d.js:149 (aciklama :125; arastirma/cizim_v5d_kaynak.md:31)
- **Açıklama:** d45-kutle-siniri, PSR J0348+0432'yi yalnız "2,01 ± 0,04" olarak, güncel ölçülmüş kütle diye gösteriyor. Dersin güncel metni bu değerin 2024'te yaklaşık %10 aşağı düzeltildiğini söylüyor: 1,806 ± 0,037 M☉. Çizimde nokta ve hata çubuğu 2,01'de duruyor. Nötron yıldızı üst sınırı tartışmasında bu nokta yanlış yerde.
- **Kanıt:**
  - d45.json bölüm 9: "…2024'te CHIME … 1,806 ± 0,037 M☉ buldu".
  - cizim_v5d.js:149: `[2.01, 1.97, 2.05, 'J0348+0432: 2,01 ± 0,04']`.
  - `git log -S"1,806"` → 0fce7d8 (17:18); çizim bf113a9 (17:34).
  - veri/dersler.json'da "1,806 ± 0,037" geçiyor.
- **Önerilen düzeltme:** Noktayı 1,806 (1,769–1,843) yap. Etiket: "J0348+0432: 1,806 ± 0,037 (2024; 2013'te 2,01)". Kaynak notunu güncelle.

#### A3B-05 · ÖNEMLİ · cizim_gokyuzu.js:646–669
- **Açıklama:** d11-gorus-alani 6°'lik görüş alanı çiziyor ve "12 dolunay" diyor (`alan = 6`; "örnek görüş alanı: 6°"; çubuk "Dürbün alanı 6°"). Aynı bölümün (d11 bölüm 7) örneği 6,4° kullanıyor ve 12,8 ≈ 13 dolunay buluyor. Uygulamanın bulma haritası da 6,4° kullanıyor. Şekil ile hemen yanındaki örnek farklı sayılar söylüyor.
- **Kanıt:**
  - d11.json bölüm 7 örneği: "Bu derste 7×50'nin görüş alanı için 6,4° kullanıyoruz (… Urania'nın bulma haritası da bu değeri kullanır …) … 6,4 / 0,5 = 12,8: … yaklaşık 13 dolunay sığar."
  - cizim_gokyuzu.js:653: `alan = 6`. Satır 659: `'örnek görüş alanı: 6°'`.
  - 6,4° değeri derse 2026-10-28'de girdi; çizim 2026-10-27 tarihli (36f5db8) ve güncellenmemiş.
- **Önerilen düzeltme:** `alan = 6.4`. Etiketleri ve anlatımı "6,4°", "yaklaşık 13 dolunay" olarak düzelt. Çubuk 6,4 olsun.

#### A3B-06 · ÖNEMLİ · cizim_v5c.js:469 (aciklama), 496 (çizim)
- **Açıklama:** d43-siklik, Çelyabinsk için başka tahminleri "200 ile 500 kiloton" olarak anlatıyor ve çizgiyi X(200)'den X(500)'e çiziyor. Ders 200–470 kt diyor. Kodun kendi yorumu (satır 495) ve kaynak notu da 470 diyor.
- **Kanıt:**
  - `grep -o "200 ile [0-9]* kilo"`: cizim_v5c.js → "200 ile 500"; d43.json → "200 ile 470".
  - cizim_v5c.js:495: `/* Çelyabinsk: ≈500 kt, başka tahminler 200–470 kt */`. Satır 496: `S.cizgi(X(200), 128, X(500), 128, …)`.
  - d43_kaynak.md:56: "200 ve 460–470 kt".
- **Önerilen düzeltme:** `X(470)` ve anlatımda "200 ile 470".

#### A3B-07 · ÖNEMLİ · cizim_v6.js:689, 718
- **Açıklama:** d55-gelecek-takvimi tek kesinlik etiketi kullanıyor: "Kesinlik: kuram ya da hipotez". Anlatım da çizelgedeki her şeyi, yıldızların sönmesini (10¹³–10¹⁴ yıl) de bu basamağa koyuyor. Ders yıldızların sönmesini "güçlü kanıtlı" sayıyor. Aynı dosyadaki d55-kesinlik-haritası da öyle gösteriyor. Ünitenin temel aracı olan kesinlik ölçeği bu çizimde yanlış uygulanmış.
- **Kanıt:**
  - d55 bölüm 8: "yıldızların yakıtını bitirip söneceği, yıldız fiziğine dayanan sağlam bir öngörüdür".
  - d55 bölüm 14: "Güçlü kanıtlı ama açık sorulu: … yıldızların yakıtlarını bitirip söneceği …".
  - cizim_v6.js:718.
- **Önerilen düzeltme:** Yıldızların sönmesine "güçlü kanıtlı" etiketi ver. Proton bozunması, kara delik buharlaşması ve vakum bozunması "kuram ya da hipotez" kalsın. Anlatımı buna göre böl.

#### A3B-08 · ÖNEMLİ · veri/sinavlar.json (216 soru) ve dersler.js:285–287 (şıklar karıştırılmıyor)
- **Açıklama:** Ünite sınavlarında soru sırası karıştırılıyor, şıkların sırası karıştırılmıyor (dersler.js:286, `q.secenekler.map` dosyadaki sırayla). Doğru şık iki biçimde tahmin edilebiliyor:
  - 216 sorunun 166'sında (%76,9) doğru şık en uzun şık. "Hep en uzununu seç" stratejisi sınavın yaklaşık dörtte üçünü bilgisiz geçiriyor; şans düzeyi %25.
  - Doğru şıkkın konumu dengesiz: A 34, B 94, C 68, D 20. B tek başına %43,5.
  
  Sınav bilgiyi ölçmesi gerekirken ipucuyla çözülebiliyor. Yanlış cevap, açıklama ve dayanak hatası ise bulunmadı (bkz. Yöntem).
- **Kanıt:** `node sinav1.js` çıktısı: `dogru konum dagilimi [ 34, 94, 68, 20, 0 ]`, `en uzun sik dogru 166`.
- **Önerilen düzeltme:** Şıkları her açılışta karıştır. dogru dizinini karıştırma eşlemesiyle taşı; kartlar.js:24 de 'ABCD'[q.dogru] kullanıyor, oraya da aynı eşleme uygulanmalı. Ayrıca çeldiricileri doğru şıkla benzer uzunlukta yaz.

#### A3B-09 · KÜÇÜK · cizim_v5d.js:388 (aciklama)
- **Açıklama:** d47-anatomi, "kalınlığı en çok 1500 ışık yılı, yani genişliğinin altmışta birinden az" diyor. 87.400 / 1500 = 58,3. Bu yüzden 1500 ışık yılı, genişliğin altmışta birinden (1457 ışık yılı) fazla.
- **Kanıt:** `node -e "console.log(1500/87400, 1/60, 87400/1500)"` → 0.01716 0.01667 58.27.
- **Önerilen düzeltme:** "yaklaşık altmışta biri kadar" ya da "elli sekizde biri".

#### A3B-10 · KÜÇÜK · cizim_v5c.js:420 (aciklama), 460 (etiket)
- **Açıklama:** d43-ana-cisim, 1.062'yi "gözlenmiş düşüş" sayısı olarak veriyor. Ders ve kaynak, Haziran 2012'ye kadar gözlenmiş düşüşlerin toplamını 1.102 veriyor. 1.062, bunlardan ana türüne göre sınıflanabilenlerin sayısı. Oranlar (kondrit 915, %86) doğru.
- **Kanıt:**
  - d43.json: "kayıtlı 1.102 gözlenmiş düşüş … ana türüne göre sınıflanmış 1.062 düşüşün 49'u".
  - https://en.wikipedia.org/wiki/Meteorite_fall_statistics (ham metin, G4): malzemeye göre tabloda "Total 1102", sınıfa göre tabloda "Total 1062".
- **Önerilen düzeltme:** "1.102 gözlenmiş düşüşten ana türü belli olan 1.062'si".

#### A3B-11 · KÜÇÜK · cizim_v5d.js:125 (aciklama), 157
- **Açıklama:** d45-kutle-siniri, GW170817 kalıntısının "saniyeler içinde kara deliğe çöktü" ğünü kesin olgu gibi söylüyor. Ders bunu çekinceyle veriyor.
- **Kanıt:** d45.json bölüm 9: "…cismin 5 ile 10 saniye içinde bir kara deliğe çöktüğü düşünülüyor".
- **Önerilen düzeltme:** "çöktüğü düşünülüyor".

#### A3B-12 · KÜÇÜK · cizim_v4a.js:211 (aciklama)
- **Açıklama:** d31-baglanma-egrisi, "En yüksek nokta nikel-62 ile demir-56'dır" diyor. Ama çizimin kendi verisinde A=58 noktası 8,792 MeV ile demir-56'dan (8,790) yüksek. Ders de sırayı Ni-62 > Fe-58 > Fe-56 olarak veriyor.
- **Kanıt:**
  - d31.json bölüm 4: "nikel-62'nin, 8,7945 MeV; onu 8,7922 MeV ile demir-58 ve 8,7903 MeV ile demir-56 izler".
  - cizim_v4a.js:196 (BA dizisi: …8.790 … 8.792 … 8.795).
- **Önerilen düzeltme:** "En yüksek nokta nikel-62'dir; demir-58 ve demir-56 hemen ardından gelir."

#### A3B-13 · KÜÇÜK · cizim_v3.js:397
- **Açıklama:** d22-yildiz-gunes-gunu çiziminin içindeki yazı "iki sarı ok paralel" diyor. Kastedilen oklar R.vurgu renginde; bu renk kırmızı modda #F03E2C (kırmızı) oluyor. Normal modda da Güneş yönündeki kesikli ok (R.gunes, #F2C879) sarımsı, yani "iki sarı ok" hangi oklar olduğunu ayırt ettirmiyor.
- **Kanıt:** cizim_v3.js:391 ve 394 R.vurgu, 391+ R.gunes; stil.css `html.kirmizi { --pirinc: #F03E2C }`.
- **Önerilen düzeltme:** Renk adı yerine biçim kullan: "iki kalın düz ok paralel".

#### A3B-14 · KÜÇÜK · cizim_v4c.js:247, 269
- **Açıklama:** d28-tunelleme, "engel yüksekliği: enerjinin 2 katı" diyor. Ama engel kutusu enerji çizgisinin 54 birim üstünden 30 birim altına uzanıyor (`S.kutu(a0, y0 - 54, …, 54 + 30, …)`). Kutunun tabanı sıfır olarak okunursa oran 84/30 = 2,8 görünür. Sıfır çizgisi çizilmemiş.
- **Kanıt:** cizim_v4c.js:247 ve 269.
- **Önerilen düzeltme:** Kutuyu y0 − 30'dan y0 + 30'a çiz, ya da y0 + 30'a bir sıfır çizgisi ekle.

#### A3B-15 · KÜÇÜK · cizim_v5a.js:499, 522
- **Açıklama:** d35-sera'nın göstergesinde "dolu daire: gerçek ortalama" yazıyor. Merkür satırındaki dolu daire ise 93 K'lik gece en düşük sıcaklığı; ortalama değil.
- **Kanıt:** satır 499: `S.daire(X(93), y, 5, { dolgu: R.mavi … })`. Satır 522: gösterge yazısı.
- **Önerilen düzeltme:** Merkür gece değerini farklı bir işaretle çiz, ya da göstergeye ek açıklama koy.

#### A3B-16 · KÜÇÜK · cizim_v3.js:279 (aciklama)
- **Açıklama:** d21-kutup-atlama, "kenarlarda boylar yüzde birkaç büyür" diyor. Kutup merkezli stereografik izdüşümde ölçek çarpanı sec²(θ/2). Çizilen yıldızlarda bu %6–14 eder: Alkaid %14, Merak ve Schedar %9.
- **Kanıt:** `node -e "for(const [n,d] of [['Dubhe',61.751],['Merak',56.3824],['Alkaid',49.3133],['Schedar',56.5373]])console.log(n,(1/Math.cos((90-d)/2*Math.PI/180)**2).toFixed(3))"` → 1.063 1.091 1.137 1.090.
- **Önerilen düzeltme:** "yüzde 6 ile 14 arası".

#### A3B-17 · KÜÇÜK · cizim_v6.js:77
- **Açıklama:** d56 çizimlerinin "Wikipedia: Wormhole" kaynağı `https://wikiwand.com/en/Wormhole` kopya sitesine gidiyor. Kural asıl en.wikipedia.org. d56_kaynak.md:128 da en.wikipedia.org kullanıyor. Yan not: veri/dersler.json'da 15 wikiwand bağlantısı daha var. Bunlar ders metni alanında; burada yalnız haber veriliyor.
- **Kanıt:** `grep -n wikiwand cizim_v6.js` → 77.
- **Önerilen düzeltme:** `https://en.wikipedia.org/wiki/Wormhole`.

#### A3B-18 · KÜÇÜK · cizim_gokyuzu.js:100
- **Açıklama:** 176 çizimden yalnız d1-kutup-enlem'de `kaynak` alanı yok. Altyazıda "Kaynak:" satırı çıkmıyor.
- **Kanıt:** yapi.js çıktısı: `KAYNAK YOK d1-kutup-enlem`.
- **Önerilen düzeltme:** d1'in kutup yüksekliği kaynağını ekle.

#### A3B-19 · KÜÇÜK · kod yorumları ve kaynak notları (kullanıcıya görünmez)
- **Açıklama:** Bakımda yanıltan eski bilgiler:
  - cizim_gokyuzu.js, cizim_evren.js ve cizim_gezegen_yasam.js'de 19 kayıt yorumu eski bölüm numarasını yazıyor (ör. gokyuzu:135 "bölüm 5", kayıt bolum 7). Tam liste G1'de.
  - cizim_v4b.js:258 yorumu 200/225/250, kod 190/225/260.
  - cizim_v4c.js:158 yorumu 1/6, kod 1/7.
  - cizim_v5c.js:495 yorumu 470, kod 500 (bkz. A3B-06).
  - cizim_v5d.js:696 yorumu çizgiyi kaldırmayı söylüyor, kod kaldırmıyor.
  - arastirma/cizim_v3_kaynak.md:71 "çizimde 25,5" diyor, etiket 25,6.
  - cizim_v5d_kaynak.md:31 ve cizim_v6_kaynak.md:116–117 eski değerleri taşıyor (bkz. A3B-01, 02, 04).
  - d43_kaynak.md:103 "792/1.003", ders 802/1.003.
- **Önerilen düzeltme:** Yorumları ve notları kodla ve güncel ders metniyle eşitle.

### Askıda

1. **d12 bölüm 3, ders metni (çizim hatası değil):** Ders, Rayleigh ölçütündeki çukuru "yüzde 22" veriyor. d12-rayleigh çiziminin kendi Airy hesabı orta / tepe = 0,735 çıkıyor, yani yaklaşık %26,5 çukur (G1 hesabı). Çizim sayı göstermiyor. Dersin %22 değeri tek kaynağa dayanıyor; bağımsız kaynakla doğrulanmadı.
2. **d17-hubble-diyagrami:** Çizim 564 km/s (73,04 ile), ders örneği 560 km/s (73 ile) diyor. İkisi de kendi içinde doğru. Çelişki sayılmadı.
3. **d14-bulutsu-turleri** (cizim_yildizlar.js:154, 172): "kırmızı ışık" (H-alfa) oku ve salma bulutsusu normal temada amber (R.uyari). Normal temada kırmızı bir tema değişkeni yok. Hata mı yoksa paletin bilinçli sınırı mı, kanıtlanamadı.
4. **d4-atmosfer** (cizim_yildizlar.js:92, 104): "kromosferin altında" ifadesi "alt kısmında" anlamına da gelebilir. Çelişki kesin değil.
5. **SL9 yakın geçişi:** d37-olcek çizimi ve ders 0,31 RJ ≈ 22.100 km ve 8 Temmuz 1992 diyor (Britannica). en.wikipedia.org/wiki/Comet_Shoemaker–Levy_9 ise "just over 40,000 km … above its cloud tops" ve 7 Temmuz diyor. Çelişki d37_kaynak.md:185'te kayıtlı ama derste ve çizimde söylenmiyor. Birincil kaynağa (Sekanina ve ark.) bakılmadı.
6. **d48-birlesik-model** (cizim_v5d.js:506–507): elektron "aynası" çizilen iyonlaşma konisinin dışında. Saçan elektronların koni içinde olması gerektiği kaynakla gösterilemedi.
7. **d47-anatomi** (cizim_v5d.js:400, 411): şişkinlik 10.000 ışık yılı yarıçapla çizilmiş. Kaynaktaki "innermost 10,000 light-years" ifadesinin yarıçap mı çap mı olduğu belirsiz.
8. **d47-donme-egrisi** (cizim_v5d.js:428): anlatım "dış kenarda 110 km/s" diyor. Eğri 30 kpc'de 103 km/s'ye iniyor; 110 değeri 26,5 kpc'ye ait. "Dış kenar"ın tanımı belirsiz.
9. **d50-donme-egrisi** (cizim_v6.js:93): verinin "radyo ve H-alfa ölçümleri" olduğu söyleniyor. SPARC dosyası indirilmediği için kanıtlanmadı.
10. **d57-tartisma-zaman:** 1965–1970 arası "güçlü kanıtlı" gösteriliyor. d57 bölüm 0 ise 1965'te "en üst basamak" diyor. Çizim d57 bölüm 7 ve d58 bölüm 3'e uyuyor; bu dersin kendi içindeki bir basitleştirme olabilir.
11. **d56-schwarzschild-haritasi:** II. bölge için "güçlü" çizgi biçimi kullanılıyor. Ders bunu "kuramın sağlam sonucu" diye niteliyor. Yorum farkı, hata kanıtlanmadı.
12. **d58-guc-tayfi:** anlatımdaki "ikincisinin üçüncüye göre alçaklığı" ifadesi ile dersteki "tek ve çift sıradaki zirvelerin oranı" arasında ifade farkı var.
13. **d55-gelecek-takvimi "10¹⁰⁶ yıl":** Ders hem 10¹⁰⁶'yı hem 10¹⁰⁹–10¹¹⁰'u anıyor; çizim birini seçmiş.
14. **320 px'te yazı boyu:** 13 birimlik yazılar 320 px genişlikte 9,3 px'e iniyor. Var olan test 360 px için ≥10 px şartı koyuyor, 320 px için şart yok. Kullanıcının ekranında (551 px) en küçük yazı 16 px. Bir kural ihlali kanıtlanamadığı için bulgu sayılmadı.

**Not:** Ünite sınavlarında yanlış cevap, iki doğru şık, doğru şıksız soru, yanlış dizin, açıklama–cevap çelişkisi, derste olmayan bilgi sorma ya da yanlış ünitede soru bulunmadı.

Geçici betikler: `C:\Users\Kaan\AppData\Local\Temp\claude\C--Users-Kaan-brewmaster\739d0876-7497-43d3-a626-bdcb804140cf\scratchpad\denetim\a3b\` (sinav1-3.js, yapi.js, tarayici.js, kesik*.js, g1–g5).
