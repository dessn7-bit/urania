# Alan 7 — Araçlar ve testler (Urania v39 denetimi, 2026-10-30)

## Okunan dosyalar

| dosya | satır | tamamı |
|---|---|---|
| araclar/bolum_esle.py | 44 | evet |
| araclar/ders_denetim.py | 90 | evet |
| araclar/ders_verisi.py | 41 | evet |
| araclar/ders_verisi_v2.py | 123 | evet |
| araclar/fizik_verisi.py | 69 | evet |
| araclar/gok_verisi.py | 54 | evet |
| araclar/haber_gorsel.py | 25 | evet |
| araclar/hedef_verisi.py | 21 | evet |
| araclar/kaynak_url_duzelt.py | 18 | evet |
| araclar/meteor_verisi.py | 33 | evet |
| araclar/ortme_verisi.py | 48 | evet |
| araclar/sozluk_yap.py | 351 | evet |
| araclar/yildiz_adlari.py | 34 | evet |
| testler/*.spec.js (40 dosya: ar 519, arayuz 226, bulucu 219, cizim 47, defter_ders 356, deney 125, deney3_analemma 105, deney3_astrofoto 99, deney3_durbun 120, deney3_eratosthenes 81, deney3_hohmann 102, deney3_mevsim 103, deney3_ortme 92, deney3_paralaks 94, deney3_roket 140, deney3_yasanabilir 94, deney_aciklama 267, ek 200, erisim 446, gok_dogrulama 115, guvenlik 145, haberler 147, hata_ayiklama 250, hava_defter 236, kod 149, konum 66, okunus 115, ortme 126, ses 542, sozluk 251, sw_varliklar 69, tarama 75, tasarim_deney 284, tasarim_ders 198, tasarim_genel 155, tasarim_gok 289, tasarim_tema 166, uydu 123, yeni 196, zaman 110) | 8 214 | evet, hepsi |
| testler/yardim.js | 45 | evet |
| testler/sunucu.js | 19 | evet |
| testler/test_sozluk_yap.py (listede yoktu, araca ait birim testi) | 129 | evet |
| playwright.config.js | 25 | evet |

Not: görev "14 araç dosyası" ve "46 test dosyası, ~8.900 satır" diyor; depoda araclar/ altında 13 .py (+ cizim_onizle.js, alanım dışında, okunmadı) ve testler/ altında 42 .js (40 spec + yardim + sunucu) + 1 .py var, toplam 8 407 satır. Hepsi okundu.

Bağlam için ayrıca hedefli okundu (tamamı değil): sozluk.js 1–111, dersler.js (MINI, kart sesli), arastirma/dersler_v2/YAZIM_KILAVUZU.md (grep), arastirma/haberler/YONTEM.md (grep), bolum_basliklari_v32.json, deney/*.js (urania:tema satırları).

## Yöntem

- Depo `robocopy` ile `…\a7\kopya` klasörüne kopyalandı (node_modules hariç, kavşakla bağlandı; kopyada ayrı git deposu, autocrlf=true). Kopyadaki playwright.config.js 8147'ye çevrildi. Depoda hiçbir betik ve `npx playwright test` çalıştırılmadı.
- Kullanıcının derleme sırası kopyada çalıştırıldı: `kaynak_url_duzelt.py` (çevrilen adres: 0, değişiklik yok) → `ders_verisi_v2.py` (veri/dersler.json ve sinavlar.json bayt bayt aynı) → `bolum_esle.py` (değişen dizin: 0) → `sozluk_yap.py` (20 dk 32 sn; veri/sozluk.json depodakiyle bayt bayt aynı, md5 5895922c…; aynı girdiyle ikinci bağımsız koşu: aşağıda "Askıda" notu) → `ders_denetim.py` (HATA 0, 3 "siz" uyarısı). `fizik_verisi.py`, `gok_verisi.py`, `hedef_verisi.py`, `meteor_verisi.py` de kopyada çalıştırıldı: çıktılar depodaki veri/ dosyalarıyla aynı. `ortme_verisi.py` çalıştırılamadı (hip_main.dat depoda yok).
- Tüm test takımı kopyada koşuldu (397 geçti, 3,3 dk). Her spec'e geçici bir gözcü eklendi (`page.on('request')` + en düşük öncelikli genel kesme rotası): hiçbir test gerçek dış ağa çıkmadı (kesme rotası 0 kez tetiklendi; celestrak/open-meteo/nominatim isteklerinin hepsi testin kendi sahte yanıtıyla karşılandı).
- Saati sabitlenmemiş dosyalar (cizim, deney, deney3_* [hohmann hariç], haberler) sahte saat 2031-03-15 22:00 ile koşuldu: 82/82 geçti (tarihe bağlı kırılma yok). kod.spec "Kart sesli tekrar" testi Node tarafındaki `Date.now()` 2026-10-01 / 2026-10-30 / 2027-06-01 yapılarak koşuldu: üçü de geçti.
- Mutasyon denemeleri (yalnız kopyada, her biri sonra `git checkout` ile geri alındı) aşağıdaki bulgularda.
- Kendi tarayıcı betiklerim (8147'de kendi sunucum, `--disable-lcd-text`, SW engelli, dış istek kesik) ile tasarim_ders ölçütleri 58 dersin hepsine uygulandı.

## Bulgular

### A7-01 · ÖNEMLİ · araclar/ders_verisi_v2.py:73–83 (numarala) → veri/dersler.json
- Açıklama: Kılavuz yazarlara "d9'da gördüğün gibi" biçiminde dosya kimliğiyle atıf yazdırıyor (YAZIM_KILAVUZU.md:132) ve derleyicinin bunları "N. derste"ye çevirmesine güveniyor. `numarala` yalnız `d<N>'` + {de, da, te, ta, deki…, den…, in/ın/un/ün/nin…} eklerini çeviriyor; yönelme (-e/-a/-ye/-ya), belirtme (-u/-ü) ve bileşik ekler ("d30'dakilerle") ile kesme işaretsiz yalın "d20", "(d11)", "d2 ve d3'ü" hiç çevrilmiyor. Sonuç: okura ve sesli okumaya giden metinde 469 ham dosya kimliği kalıyor (veri/dersler.json; ayrıca veri/sinavlar.json'da 1: d33-2 açıklaması "özel göreliliğe (d25) götürdü"); bunların uygulamadaki sıra numarasıyla ilgisi yok (d12 uygulamada 5. ders). Karışık çıktılar da var: kaynak "d3 ve d13'te" → ekran "d3 ve 41. derste".
- Kanıt: veri/dersler.json üzerinde (id, kid, ders, unite, on_bilgi, url alanları hariç) tarama:
  - Desteklenmeyen ekli 31 yer: `{'e': 15, 'ye': 7, 'ya': 4, 'a': 2, 'u': 1, 'ü': 1, 'dakilerle': 1}`. Örnekler (kaynak satırı): arastirma/dersler_v2/d20.json:169 "d1'e göre Kraliçe…", d44.json:209 "Karşılaştır: d12'ye göre…", d16.json:69 "d11'e göre 7×50 dürbün", d33.json:19 "d30'u okumuş olman", d55 "d30'dakilerle aynıdır".
  - Yalın "dNN" 438 yer, 39 derste (en çok d57 28, d48 28, d21 26, d58 23). Örnek: d21.json:15 "…tanrı Sah'ı gördü (d20)" (ekranda aynen "(d20)"), d44 "d2 bu hesapta…", d43 "d42 anlatıyor".
  - Karışık: d37.json:17 kaynak "d3 ve d13'te gördüğün gibi" → veri/dersler.json "d3 ve 41. derste gördüğün"; d10 "d1 ve d11'deki" → "d1 ve 3. dersteki".
  - Test bunu yakalamıyor: testler/hata_ayiklama.spec.js:182–192 yalnız "N. ders" sayılarının 1..58 aralığında olduğuna bakıyor; ham "dNN" kalıntısını aramıyor.
- Önerilen düzeltme: `numarala`ya tüm ekleri genel kuralla ekle (d<N>'<ek> → "<sıra>. derse/dersi/dersteki…" ünlü uyumuyla) ve yalın "d<N>" / "(d<N>)" biçimini de çevir (ör. "(d20)" → "(23. ders)"); derleme sonunda okura giden alanlarda `(?<![\w/.#-])d\d{1,2}(?!\d)` kalırsa HATA ver; hata_ayiklama testine aynı denetimi ekle.

### A7-02 · ÖNEMLİ · araclar/bolum_esle.py:8, 12–43
- Açıklama: (1) Betik idempotent değil ama kullanıcının derleme sırasında her derlemede varsayılan `bolum_basliklari_v32.json` ile çalışıyor. Bir derse bölüm eklendiğinde ilk koşu dizinleri doğru taşır; v32 elle güncellenmezse sonraki her derleme aynı eşlemeyi YENİDEN uygular ve çizimleri, ders içi deneyi (dersler.js MINI) ve sınav sorularının `bolum` alanını her seferinde bir bölüm daha kaydırır. Başlık denetimi (satır 15–17) bunu durdurmaz, çünkü eski başlıklar yeni derste hâlâ vardır. (2) v32 yalnız 24 dersi (d1–d24) kapsıyor; d25–d58'e bölüm eklenirse (MINI'deki `d25: { 10: 'gorelilik' }` dahil) hiçbir şey taşınmaz, dizinler sessizce yanlış bölüme işaret eder. (3) Yazma sırası bölünmez değil: önce cizim_*.js ve dersler.js yazılır, sonra sinavlar.json işlenir; `esle[(q['ders'], q['bolum'])]` (satır 40) KeyError verirse çizimler taşınmış, sınavlar taşınmamış kalır; düzeltip yeniden koşmak çizimleri ikinci kez kaydırır. Testler (cizim.spec.js:24, ek.spec.js:22/110) yalnız dizinin var olan bir bölüme düştüğüne bakar, doğru bölüme değil.
- Kanıt (kopyada): veri/dersler.json'da d5'in başına bir bölüm eklendi, `python araclar/bolum_esle.py` art arda çalıştırıldı:
  ```
  önce: cizim_yildizlar.js d5 bolum 3, 7, 9 · MINI d5: { 3: 'yildiz' } · sınav d5 [9,10]
  tur 1: 4, 8, 10 · { 4: 'yildiz' }   (doğru)
  tur 2: 5, 9, 11 · { 5: 'yildiz' }   (yanlış: ikinci kayma)
  tur 3: 6, 10, 12 · { 6: 'yildiz' } · sınav d5 [12, 13]
  tur 5: 8, 12, 14 · { 8: 'yildiz' }   her turda "eşlendi; değişen dizin sayısı: 5"
  ```
  Bugünkü veride v32 başlıkları güncel başlıklarla aynı (kopyada koşu "değişen 0"), yani hata şu an tetiklenmiş değil; bir sonraki bölüm eklemesinde tetiklenir.
- Önerilen düzeltme: eşleme sonunda önceki başlık dosyasını otomatik olarak güncel başlıklarla yenile (ya da güncel başlıkların özetini çizim/sınav dosyasına yaz ve yalnız fark varsa eşle); tüm dersleri kapsa; önce bütün eşlemeleri hesapla ve doğrula, sonra dosyaları geçici dosyaya yazıp yerine taşı; derleme sırasından çıkar ya da "zaten uygulandı" denetimi ekle.

### A7-03 · ÖNEMLİ · testler/hata_ayiklama.spec.js:233–238 (kid kalıcılığı)
- Açıklama: Başlık "Tekrar kartlarının kimliği kalıcı (kid): benzersiz, ilk atamada eski sıra kimliğiyle aynı" diyor; gövde yalnız her öğede kid bulunduğuna ve kid'lerin benzersiz olduğuna bakıyor (`(x, i)` içindeki `i` kullanılmıyor). Kartın ilerlemesi kid'e yazıldığı için kid'lerin yeniden numaralanması ya da yer değiştirmesi kullanıcı ilerlemesini başka karta taşır; bunu yakalayan hiçbir test yok (bir kid anlık görüntüsü ya da önceki sürümle karşılaştırma yok). Araç tarafında da `kimlik_ver` (ders_verisi_v2.py:32–46) kid'siz bir taslak gelirse sırayla yeniden kid atar; taslak yeniden üretilirse ilerleme sessizce kayar.
- Kanıt (mutasyon, kopyada): veri/dersler.json'daki bütün kid'ler +1000 kaydırıldı (d1s0 → d1s1000; benzersizlik korunur):
  ```
  npx playwright test hata_ayiklama -g "kid"  →  1 passed
  ```
- Önerilen düzeltme: depoya kid anlık görüntüsü koy (ders, alan, soru metninin özeti → kid) ve testte mevcut kid'lerin değişmediğini, yeni kid'lerin yalnız sona eklendiğini denetle; `kimlik_ver` veri/dersler.json'daki eski kid'leri metin özetiyle eşleyip taşısın.

### A7-04 · ÖNEMLİ · araclar/ders_denetim.py:62 (Windows'ta okunuş denetimi)
- Açıklama: Node çıktısı `subprocess.run(..., text=True)` ile okunuyor; kodlama belirtilmediği için Windows'ta (bu makinede `locale.getpreferredencoding()` = cp1254) UTF-8 çıktı cp1254 diye çözülüyor. Okunuş denetimi tam da çevrilmemiş sembol bulduğunda çıktı UTF-8'dir: sembol bozuk gösterilir ya da (UTF-8 baytları 0x81/0x8D/0x8F/0x90/0x9D/0x9E içeriyorsa: "⁉", "Ş", "Ğ"…) okuyucu iş parçacığı çöker, stdout None olur ve denetim yalnız "okunuş denetimi çalışmadı" uyarısı verir. Kullanıcının ortamı Windows; bugünkü 58 derste sembol kalmadığı için şu an çıktı "[]" (ASCII) ve etkilenmiyor.
- Kanıt (kopyadaki ders_denetim modülüyle, geçici bir d1 kopyasına paragraf eklenerek):
  ```
  "Jüpiter ♃ simgesiyle…" → uyarı: sesli okumada karşılığı olmayan semboller: ['â™ƒ']
  "Bu soru ⁉ işaretiyle…" → UnicodeDecodeError: 'charmap' codec can't decode byte 0x81
                            uyarı: okunuş denetimi çalışmadı: 'NoneType' object has no attribute 'strip'
  ```
- Önerilen düzeltme: `subprocess.run([...], capture_output=True, encoding='utf-8', timeout=30)`; node çıkışı boşsa HATA (uyarı değil) say.

### A7-05 · ÖNEMLİ · tasarim_ders.spec.js:9, 59, 174 (58 dersin 19'u ölçülüyor)
- Açıklama: "Ders çizimleri 360 px telefonda: yazı ≥ 10 px, SVG dışına taşmıyor…" ve "Ders sayfaları 320/360 px'te yatay taşmıyor" testleri sabit `DERSLER` listesindeki 19 dersi (d1–d19) gezer; v3–v6'da eklenen 39 ders (d20–d58; 176 çizimin 117'si) hiç ölçülmez. Aynı ölçütleri 58 derse uygulayınca hatalar çıkıyor.
- Kanıt: testin `cizimOlc` işlevi ve taşma ölçüsü birebir kopyalanıp kendi sunucumda 58 derse uygulandı (360×800):
  ```
  ölçülen çizim 176
  SVG dışına taşan yazı (kesik): cz-d41-kuiper-haritasi "eğiklik", cz-d43-karanlik-ucus "yükseklik (km)",
    cz-d46-tohum-buyume "kütle (Güneş kütlesi)", cz-d46-gelgit-hills "yarıçap (AB)", cz-d30-carnot "en yüksek verim",
    cz-d29-ayna-sarmal "fazladan yol, nm", cz-d29-feynman-diyagrami "uzay"
  taşan öğe: d57 (cz-d57-hafif-elementler: x=159,65 width=280,4 dikdörtgen, viewBox 400 → sağ kenar 375,6 px > 360)
  ```
  Kesik olanların hepsi `rotate(-90 …)` dikey eksen başlığı; SVG `overflow: hidden` olduğundan sol kenardan 1,2–3,8 px kırpılıyor (ekran görüntüsünde "en yüksek verim"in alt kuyrukları kesik). d1–d19'da aynı ölçüt 0 hata veriyor.
- Önerilen düzeltme: `DERSLER`'i veri/dersler.json'dan oku (ya da `uniteler` sırası); dikey eksen başlıklarının x'ini yazı yüksekliği kadar içeri al (cizim_v4*/v5*/v6.js); d57 levhasının genişliğini viewBox'a sığdır.

### A7-06 · ÖNEMLİ · sayfa hatası (pageerror) denetimi eksik dosyalar: tasarim_tema.spec.js, zaman.spec.js, tasarim_ders.spec.js, sw_varliklar.spec.js:44, ses.spec.js:65–70, kod.spec.js:68/104/121/133, guvenlik.spec.js:83/133
- Açıklama: Çoğu dosya `afterEach` ile `page.hatalar`'ın boş olduğunu denetliyor; bu dosyalarda ise hiç `pageerror` dinlenmiyor (tasarim_tema, zaman, tasarim_ders, sw_varliklar'ın tarayıcı testi) ya da dinleniyor ama doğrulanmıyor (ses.spec: `dersAc` toplar, 25 testten yalnız (b) satır 149'da bakar; dersAc kullanmayan (h), (h2), (g), (r), (r3), (y) hiç toplamaz; kod.spec'te 4 test, guvenlik'te 2 test toplar ama bakmaz). Sesli okuma, kart tekrarı, zaman uç durumları gibi yalnız bu dosyalarda gezilen akışlardaki yakalanmamış istisna fark edilmez.
- Kanıt (mutasyon, kopyada): tema.js sonuna `setTimeout(function () { throw new Error('MUTASYON: yakalanmamis hata'); }, 0);` eklendi (her sayfada yakalanmamış hata):
  ```
  npx playwright test tasarim_tema zaman tasarim_ders sw_varliklar arayuz
  → 18 failed (hepsi arayuz.spec, afterEach "konsol/sayfa hatası olmamalı")
  → 35 passed (tasarim_tema, zaman, tasarim_ders, sw_varliklar'ın tamamı)
  ```
- Önerilen düzeltme: ortak bir fixture (testler/yardim.js) ile her tarayıcı testinde `pageerror` toplayıp `afterEach`'te denetle; dosyaların kendi listesi kalmasın.

### A7-07 · KÜÇÜK · deney3_astrofoto.spec.js:87–98, deney3_durbun.spec.js:108–119, deney3_analemma.spec.js:93–105, deney3_mevsim.spec.js:91–103
- Açıklama: Başlıklar "Tema değişince yeniden çizer" / "kırmızı modda çizer" diyor; gövde `urania:tema` olayını yollayıp yalnız yatay taşmaya, kanvas oranına ya da ölçüm kutusunun "—" olmadığına bakıyor (kutu olaydan önce de doluydu). Yeniden çizimi ya da kanvas renklerini ölçen doğrulama yok.
- Kanıt (mutasyon, kopyada): deney/analemma.js, astrofoto.js, durbun.js, mevsim.js'ten `document.addEventListener('urania:tema', ciz);` silindi → dört test de geçti (`4 passed`); tam takım koşusunda da bu dört deneyle ilgili hiçbir test düşmedi (deney_aciklama'daki kırmızı mod piksel testi kırmızıyı sayfa açılmadan kurduğu için tema değişimini sınamıyor).
- Önerilen düzeltme: olaydan sonra kanvası okuyup kırmızı olmayan piksel sayısının 0 olduğunu (erisim.spec.js'teki `kirmiziOlmayan` gibi) ya da çizim sayacının arttığını denetle.

### A7-08 · KÜÇÜK · testler/defter_ders.spec.js:328–336 (on_bilgi)
- Açıklama: Kılavuzun kuralı (YAZIM_KILAVUZU.md:145, ORTAK kural) "on_bilgi yalnız sırada ÖNCE gelen derse"; test `sira.indexOf(o) > sira.indexOf(x.id)` kullanıyor: var olmayan ders (`indexOf` = −1) ve dersin kendisi (eşit) geçer. Kılavuz "test bunu denetler" diyor; `ders_denetim.py` de on_bilgi'ye hiç bakmıyor. Bugünkü veride ihlal yok (kendi taramam: 0).
- Kanıt (mutasyon, kopyada): veri/dersler.json'da d2'nin on_bilgi'si `['d99']` yapıldı → tam takım koşusunda "18: hiçbir dersin ön bilgisi…" testi geçti.
- Önerilen düzeltme: `const i = sira.indexOf(o); return i < 0 || i >= sira.indexOf(x.id);` ve ders_denetim.py'ye de aynı kural.

### A7-09 · KÜÇÜK · araclar/kaynak_url_duzelt.py:6–11 (Wikipedia kopyası wikiwand kalıyor)
- Açıklama: Betik "okura her zaman asıl kaynak gösterilir" amacıyla IPFS ve cavac.at kopyalarını çeviriyor; Wikipedia'nın bir başka kopya ön yüzü olan wikiwand.com desende yok. Ayrıca 4everland deseni `([^"\s|)]+?)\.html` başlığında ")" olan sayfayı (ör. "Meridian_(astronomy).html") hiç çevirmiyor (şu an örneği yok).
- Kanıt: `grep -c wikiwand.com veri/dersler.json` → 15 (okura görünen `url`/`kaynak_url`), kaynaklarda 27 (d1, d7, d10, d29, d34, d41, d44, d45, d56 json ve _kaynak.md). Örnek: arastirma/dersler_v2/d45.json:308 `"kaynak_url": "https://www.wikiwand.com/en/articles/Magnetar"`, d56.json:221 `https://wikiwand.com/en/Wormhole`, ders "Meridian_(astronomy)" bağlantısı `https://wikiwand.com/en/articles/Meridian_(astronomy)`. Deneme: `https://abc.ipfs.4everland.io/wiki/Meridian_(astronomy).html` → değişmeden kalıyor. Çift kodlama (%25) üreten bir işlem yok: betik yüzde kodlamasına dokunmuyor (`Ali%C3%A7.html` → `en.wikipedia.org/wiki/Ali%C3%A7`, doğru).
- Önerilen düzeltme: `https://(www\.)?wikiwand\.com/(en|EN)/(articles/)?([^"\s|]+)` → `https://en.wikipedia.org/wiki/\4` deseni; 4everland deseninde `)` hariç tutmayı kaldır (sonu `\.html` ile bağlı olduğu için güvenli).

### A7-10 · KÜÇÜK · araclar/ders_verisi_v2.py:26, 106 (d59'dan sonraki derslerin sınav soruları)
- Açıklama: Sınav soruları yalnız `YENI_V3 = {'d%d' % n for n in range(20, 59)}` kümesindeki dersler için `dNN_sinav.json`'dan alınıyor. Sıradaki ders (d59) ve sonrası UNITELER'e eklenip taslağı yazılsa bile sınav dosyası sessizce yok sayılır (ne "NOT" ne uyarı basılır); ünite sınavı eksik kalır.
- Kanıt: `'d59' in {'d%d' % n for n in range(20, 59)}` → False; satır 106 döngüsü yalnız bu kümeyle kesişimi gezer.
- Önerilen düzeltme: sınav dosyasını `os.path.exists(V2/i+'_sinav.json')` ile tüm derslerde ara; küme sınırı gerekirse açık uçlu yap.

### A7-11 · KÜÇÜK · araclar/bolum_esle.py:33 (MINI yeniden yazımında sessiz silme)
- Açıklama: MINI her derlemede yeniden kuruluyor ve yalnız `(\d+): ('[a-z]+')` biçimine uyan girişler korunuyor; deney kimliğinde rakam, alt çizgi, büyük harf ya da çift tırnak olan giriş sessizce silinir. Bugünkü 15 dersin girişleri hep küçük harf, yani şu an kayıp yok.
- Kanıt: satır 31–34 işlevi aynen alınıp denendi: `d5: { 3: 'yildiz', 7: 'ay_evre', 9: "kepler", 11: 'hr2' }` → `d5: { 3: 'yildiz' }`.
- Önerilen düzeltme: `(\d+):\s*(['"][^'"]+['"])` ve giriş sayısı değişirse HATA.

### A7-12 · KÜÇÜK · araclar/ders_verisi_v2.py:59, 93, 118, 122 (yarım yazma)
- Açıklama: veri/dersler.json (satır 93) sınav soruları denetlenmeden (satır 118 `assert`) önce yazılıyor; assert düşerse dersler.json yeni, sinavlar.json eski kalır. Bütün yazmalar `json.dump(..., open(yol, 'w'))` ile doğrudan hedefe; kesilirse dosya yarım/boş kalır ve bir sonraki koşu `eski` sürümü bu bozuk dosyadan okumaya çalışır (satır 27). Git'ten geri alınabildiği için veri kaybı değil, tutarsız ara durum.
- Kanıt: kod okuması (satır sırası 93 → 106–121 → 122).
- Önerilen düzeltme: önce tüm denetimler, sonra geçici dosyaya yazıp `os.replace`.

### A7-13 · KÜÇÜK · testler/okunus.spec.js:105–110 (sesli okunan alanların bir kısmı denetlenmiyor)
- Açıklama: "Tüm ders metinlerinde okunuşa çevrilmemiş sembol kalmaz" testi yalnız ders başlığı, bölüm başlığı, paragraflar ve defter notlarını tarıyor; `ozet`, `akilda`, `ornek`, `sorular`, `sozluk`, `anahtar_sayilar` dışarıda. Kart sesli tekrarı (dersler.js:362 `Ses.soyle(k.arka)`, ön yüz de okunur) sorular ve sayıları okuyor.
- Kanıt: aynı denetim dışarıda kalan alanlara uygulandı: tek kalıntı d2 soru kartı `d2s12` "…(T☉ = 5772 K)" → okunuş "(T☉ eşittir 5772 kelvin)"; "☉" çevrilmiyor (aynı metindeki "R☉" "Güneş yarıçapı" oluyor).
- Önerilen düzeltme: teste bu alanları ekle; okunus.js'e "T☉" (Güneş'in sıcaklığı) gibi tek başına ☉ alt simgesi kuralı.

### A7-14 · KÜÇÜK · testler/haberler.spec.js:31–32, 40
- Açıklama: Kullanıcı kuralı ve YONTEM.md:17 "350–700 kelime, 4–8 paragraf"; test 300–800 kelimeye izin veriyor ve paragraf sayısına bakmıyor. Görsel kuralı izin listesi (NASA/ESA/ESO/ESA-Webb/ESA-Hubble/NOIRLab…) iken test yalnız birkaç yasak alan adını (apnews, reuters, getty, afp, nature, science) arıyor; başka herhangi bir site geçer. Bugünkü 27 haberin hepsi kurala uyuyor (kendi taramam: 372–567 kelime, paragraf 4–8, görseller eso.org, noirlab.edu, science.nasa.gov, esa.int, esawebb.org, esahubble.org, images.nasa.gov, svs.gsfc.nasa.gov, photojournal.jpl.nasa.gov).
- Kanıt: satır 31 `toBeGreaterThanOrEqual(300)`, 32 `toBeLessThanOrEqual(800)`, 40 yasak listesi.
- Önerilen düzeltme: sınırları 350/700 yap, `ozet.length` 4–8, `gorsel.kaynak_url` için izin listesi.

### A7-15 · KÜÇÜK · testler/guvenlik.spec.js:37–38 (CSP durağan denetimi)
- Açıklama: "satır içi betik yok" denetimi yalnız öznitelik­siz `<script>` etiketini ve çift tırnaklı `on…="` işleyicisini arıyor; `<script type="text/javascript">…</script>` ve `onclick='…'` geçer. Tam takımda başka testler (konsoldaki CSP ihlali ve XSS gözcüsünün `olayli`/`csp` alanları) bunu yakaladığı için risk düşük; ama testin kendisi iddiasını sınamıyor.
- Kanıt (mutasyon, kopyada): index.html'e `<script type="text/javascript">window.__satirIci = 1;</script>` ve `<a href="#" onclick='x()'>.</a>` eklendi → `guvenlik -g "CSP"` 1 passed; aynı değişiklikle (A7-07 ve A7-08 mutasyonlarıyla birlikte) koşulan tam takımda 50 test düştü, hepsi bu değişiklik yüzünden (arayuz 18, tarama 17, yeni 11, cizim 2: konsoldaki CSP ihlali; guvenlik:55 ve hava_defter:190: gözcünün `olayli: ['a[onclick]']`, `csp: ['script-src-elem inline']`).
- Önerilen düzeltme: `/<script\b(?![^>]*\bsrc=)[^>]*>\s*\S/i` ve `/\son[a-z]+\s*=/i`.

### A7-16 · KÜÇÜK · başlık–gövde uyuşmazlıkları: ek.spec.js:49, deney_aciklama.spec.js:178–179
- Açıklama: ek.spec "Ders içi deney: d3'te Kepler deneyi açılır, ölçer, kapanır; başka derse geçince döngü durur" — d13'e geçildikten sonra d3 deneyinin döngüsünün durduğuna dair hiçbir doğrulama yok (yalnız d13'teki yeni deneyin ölçümüne bakılıyor). deney_aciklama 178–179: "hareket azaltılmamışken zaman kaydırıcısı yok, lejantta da yok" yorumundan sonra yalnız `emulateMedia` var, doğrulama yok (bu durum satır 182'deki ayrı testte sınanıyor; ölü kod).
- Kanıt: ilgili satırlar (ek.spec.js:62–64 yalnız `#gcDer` "84 ppm").
- Önerilen düzeltme: d13'e geçtikten sonra d3 kanvasının/zamanlayıcısının kalmadığını (ör. `requestAnimationFrame` sayacı ya da `.mini-kap canvas` sayısı) denetle; deney_aciklama'daki ölü satırı sil.

## Askıda

- **sozluk_yap.py belirlenimciliği (bulgu değil, not):** iki bağımsız koşunun çıktısı birbiriyle ve depodaki veri/sozluk.json ile bayt bayt aynı (üçü de md5 5895922cec19f64eb8c3caf5e379da69, 1229 terim). Sözlük derslerin hiçbir terimini atlamıyor: veri/dersler.json'daki her sözlük teriminin anahtarı sozluk.json'da var, 58 dersin hepsi `tanimli`/`ders_adlari`'nda; testler/test_sozluk_yap.py 9/9 geçti.
- **ortme_verisi.py** çalıştırılamadı: girdi `hip_main.dat` depoda yok. Kod okumasında `hip = int(p[1])` `try` dışında (başlık satırında ValueError ile durur) ve öz hareket `cos(dec)` J1991.25 dik açıklığıyla; ikisi de bulgu sayılacak kanıta ulaşmadı.
- **sozluk_yap.py ↔ sozluk.js eşleşme farkı:** Python sınırı `(?<![^\W_])` (Unicode \w), JS `(?<![\p{L}\p{N}])`; büyük harf denetimi Python'da `str.upper()`, JS'de `toLocaleUpperCase('tr-TR')` ("i" → "I" / "İ"). "buyuk" işaretli bir terimde "dersler" listesinin JS işaretlemesinden farklı olabileceği kuramsal; gerçek bir terimde fark bulamadım.
- **Windows/Linux satır sonu:** depoda `core.autocrlf=true`; Python metin kipinde Windows'ta CRLF, Linux'ta LF yazar, git ikisini aynı nesneye çevirir. Bütün metin `open()` çağrılarında `encoding='utf-8'` var (yalnız haber_gorsel.py ikili). Bulgu değil.
- **gok_dogrulama.spec.js:60** `if (dogru.alt > 5)` koşullu doğrulama: 4 yıldızdan 3'ü (21,4°, 63,2°, 48,0°) gerçekten sınanıyor, Sirius (−37,8°) atlanıyor; sayıyı doğrulayan satır yok ama şu an boş geçmiyor.
- **Eski ders_verisi.py:** satır 7'de `sys.exit` ile hemen çıkıyor; yanlışlıkla çalıştırılsa da veri/dersler.json'a dokunmaz. Çakışma yok.
- **Ağ:** takımın hiçbir testi gerçek dış ağa çıkmadı (gözcü ile ölçüldü); celestrak'a giden her istek fikstürle ya da 503/abort ile karşılanıyor. Ancak genel kesme (`disAgiKes` ya da eşdeğeri) olmayan dosyalarda (deney, deney3_*, guvenlik, konum, kod, hava_defter, arayuz, ses…) yeni bir dış alan adı eklenirse istek gerçek ağa çıkar; bugün öyle bir alan adı yok.

Denetim sırasında depoya tek istem dışı yazma: kendi tarama betiğimin `import sozluk_yap` satırı depodaki git-yok-sayılan `araclar/__pycache__/sozluk_yap.cpython-312.pyc` dosyasını oluşturdu; fark edip sildim (öncesinde yoktu; aynı klasördeki ders_denetim.cpython-312.pyc 20:18 tarihli, bana ait değil, dokunulmadı).
