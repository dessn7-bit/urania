# Alan 3 (ikinci yarı): Sınav cevapları ve ders çizimleri (Urania v39 denetimi, 2026-10-30)

## Okunan dosyalar

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

## Yöntem

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

## Bulgular

### A3B-01 · KRİTİK · cizim_v6.js:689, 707–708 (ve KAYNAK.andreassen :73; arastirma/cizim_v6_kaynak.md:117)
- **Açıklama:** d55-gelecek-takvimi, vakum bozunması için "≈10¹³⁹ yıl; %95 alt sınır 10⁵⁸ yıl" yazıyor ve sözlü anlatımda da aynısını söylüyor. Dersin güncel metni bu değerleri makalenin ilk sürümlerine ait sayıyor. Son sürümün (v4) değerleri ~10¹⁶¹ yıl ve %95 güvenle >10⁶⁵ yıl. Ünite sınavındaki d55-4 sorusu da doğru cevap olarak 10¹⁶¹'i veriyor. Bu yüzden çizim, dersle ve sınavla çelişen eski bir sayı gösteriyor.
- **Kanıt:**
  - `grep -o "10¹⁶¹ yıl" arastirma/dersler_v2/d55.json` → 7 eşleşme. d55 bölüm 12: "yazarların Mayıs 2018'de 'sayılar güncellendi' notuyla yayımladığı son sürümde ise ömür yaklaşık 10¹⁶¹ yıl, yüzde 95 güvenle de 10⁶⁵ yıldan uzundur".
  - cizim_v6.js:708: `'10¹³⁹ yıl: vakum bozunması, SM ta…'`.
  - `git log -S"10¹⁶¹" -- arastirma/dersler_v2/d55.json` → 63ef1db (17:13). Çizim 9b2c66e'de (17:43), yani düzeltmeden sonra eklenmiş.
  - KAYNAK URL'si `arxiv.org/abs/1707.08124v2`, yani eski sürüm.
- **Önerilen düzeltme:**
  - Olayları 10⁶⁵ (%95 alt sınır) ve 10¹⁶¹ (Standart Model tahmini) yap. Ekseni ve "karanlık çağ" şeridini en az 10¹⁶⁰'a uzat; şu an Y(140)'ta bitiyor.
  - Sözlü anlatımı, KAYNAK adresini (v4 ya da sürümsüz abs) ve kaynak notunu güncelle.

### A3B-02 · KRİTİK · cizim_v6.js:695 ve 689 (arastirma/cizim_v6_kaynak.md:116)
- **Açıklama:** d55-gelecek-takvimi, kara delik çağı şeridini `[40, 100, …]` ile 10⁴⁰'tan başlatıyor. Anlatım da "10 üzeri 40 ile 10 üzeri 100 yıl arası" diyor. Dersin güncel metninde bu değer 10⁴³–10¹⁰⁰. 10⁴⁰ değeri IPFS kopyasından alınmış ve derste düzeltilmiş.
- **Kanıt:**
  - d55.json bölüm 9'da "10⁴³ ile 10¹⁰⁰" geçiyor (grep: 1 eşleşme); "10⁴⁰ ile" geçmiyor.
  - git show 63ef1db: `-…10⁴⁰ ile 10¹⁰⁰…` → `+…10⁴³ ile 10¹⁰⁰…`.
  - d55_kaynak.md:114: "Kara delik çağı 10⁴³–10¹⁰⁰ yıl (IPFS kopyasından alınan 10⁴⁰ düzeltildi) | FUT | "10^43 (10 tredecillion) years to approximately 10^100…"".
- **Önerilen düzeltme:** Şeridi 43–100 yap, anlatımı "10⁴³ ile 10¹⁰⁰" olarak düzelt, kaynak notunu güncelle.

### A3B-03 · KRİTİK · cizim_v6.js:840–841
- **Açıklama:** d56-schwarzschild-haritası bir Kruskal diyagramı ve sözlü anlatımı "ışık 45 derecelik çizgilerle yol alır" diyor. Ama "beyaz delikten çıkan" kesikli ok P(0.15, −1.0)'dan P(1.05, −0.38)'e çiziliyor. ΔT/ΔX = 0,62/0,90 = 0,69, yani ok yataydan 34,6° eğimli. Bu, ışıktan hızlı (uzay benzeri) bir yol: dünya çizgisi olarak fiziksel olarak imkânsız. İki eksen aynı ölçekte (P her iki eksende u = 104 kullanıyor), bu yüzden ekrandaki açı koordinattaki açıyla aynı. Aynı çizimdeki düşen gözlemci eğrisi doğru biçimde zaman benzeri: en küçük |dT/dX| = 1,66.
- **Kanıt:** cizim_v6.js:840 `const w1 = P(0.15, -1.0), w2 = P(1.05, -0.38);`. G5 node çıktısı: `beyaz delik oku dT/dX 0.689 açı(°) 34.6`.
- **Önerilen düzeltme:** Oku zaman benzeri çiz (|ΔT| > |ΔX|). Örnek: (0,15; −0,98) → (0,75; −0,15). Bitiş noktası I. bölgede kalır (X > |T|).

### A3B-04 · KRİTİK · cizim_v5d.js:149 (aciklama :125; arastirma/cizim_v5d_kaynak.md:31)
- **Açıklama:** d45-kutle-siniri, PSR J0348+0432'yi yalnız "2,01 ± 0,04" olarak, güncel ölçülmüş kütle diye gösteriyor. Dersin güncel metni bu değerin 2024'te yaklaşık %10 aşağı düzeltildiğini söylüyor: 1,806 ± 0,037 M☉. Çizimde nokta ve hata çubuğu 2,01'de duruyor. Nötron yıldızı üst sınırı tartışmasında bu nokta yanlış yerde.
- **Kanıt:**
  - d45.json bölüm 9: "…2024'te CHIME … 1,806 ± 0,037 M☉ buldu".
  - cizim_v5d.js:149: `[2.01, 1.97, 2.05, 'J0348+0432: 2,01 ± 0,04']`.
  - `git log -S"1,806"` → 0fce7d8 (17:18); çizim bf113a9 (17:34).
  - veri/dersler.json'da "1,806 ± 0,037" geçiyor.
- **Önerilen düzeltme:** Noktayı 1,806 (1,769–1,843) yap. Etiket: "J0348+0432: 1,806 ± 0,037 (2024; 2013'te 2,01)". Kaynak notunu güncelle.

### A3B-05 · ÖNEMLİ · cizim_gokyuzu.js:646–669
- **Açıklama:** d11-gorus-alani 6°'lik görüş alanı çiziyor ve "12 dolunay" diyor (`alan = 6`; "örnek görüş alanı: 6°"; çubuk "Dürbün alanı 6°"). Aynı bölümün (d11 bölüm 7) örneği 6,4° kullanıyor ve 12,8 ≈ 13 dolunay buluyor. Uygulamanın bulma haritası da 6,4° kullanıyor. Şekil ile hemen yanındaki örnek farklı sayılar söylüyor.
- **Kanıt:**
  - d11.json bölüm 7 örneği: "Bu derste 7×50'nin görüş alanı için 6,4° kullanıyoruz (… Urania'nın bulma haritası da bu değeri kullanır …) … 6,4 / 0,5 = 12,8: … yaklaşık 13 dolunay sığar."
  - cizim_gokyuzu.js:653: `alan = 6`. Satır 659: `'örnek görüş alanı: 6°'`.
  - 6,4° değeri derse 2026-10-28'de girdi; çizim 2026-10-27 tarihli (36f5db8) ve güncellenmemiş.
- **Önerilen düzeltme:** `alan = 6.4`. Etiketleri ve anlatımı "6,4°", "yaklaşık 13 dolunay" olarak düzelt. Çubuk 6,4 olsun.

### A3B-06 · ÖNEMLİ · cizim_v5c.js:469 (aciklama), 496 (çizim)
- **Açıklama:** d43-siklik, Çelyabinsk için başka tahminleri "200 ile 500 kiloton" olarak anlatıyor ve çizgiyi X(200)'den X(500)'e çiziyor. Ders 200–470 kt diyor. Kodun kendi yorumu (satır 495) ve kaynak notu da 470 diyor.
- **Kanıt:**
  - `grep -o "200 ile [0-9]* kilo"`: cizim_v5c.js → "200 ile 500"; d43.json → "200 ile 470".
  - cizim_v5c.js:495: `/* Çelyabinsk: ≈500 kt, başka tahminler 200–470 kt */`. Satır 496: `S.cizgi(X(200), 128, X(500), 128, …)`.
  - d43_kaynak.md:56: "200 ve 460–470 kt".
- **Önerilen düzeltme:** `X(470)` ve anlatımda "200 ile 470".

### A3B-07 · ÖNEMLİ · cizim_v6.js:689, 718
- **Açıklama:** d55-gelecek-takvimi tek kesinlik etiketi kullanıyor: "Kesinlik: kuram ya da hipotez". Anlatım da çizelgedeki her şeyi, yıldızların sönmesini (10¹³–10¹⁴ yıl) de bu basamağa koyuyor. Ders yıldızların sönmesini "güçlü kanıtlı" sayıyor. Aynı dosyadaki d55-kesinlik-haritası da öyle gösteriyor. Ünitenin temel aracı olan kesinlik ölçeği bu çizimde yanlış uygulanmış.
- **Kanıt:**
  - d55 bölüm 8: "yıldızların yakıtını bitirip söneceği, yıldız fiziğine dayanan sağlam bir öngörüdür".
  - d55 bölüm 14: "Güçlü kanıtlı ama açık sorulu: … yıldızların yakıtlarını bitirip söneceği …".
  - cizim_v6.js:718.
- **Önerilen düzeltme:** Yıldızların sönmesine "güçlü kanıtlı" etiketi ver. Proton bozunması, kara delik buharlaşması ve vakum bozunması "kuram ya da hipotez" kalsın. Anlatımı buna göre böl.

### A3B-08 · ÖNEMLİ · veri/sinavlar.json (216 soru) ve dersler.js:285–287 (şıklar karıştırılmıyor)
- **Açıklama:** Ünite sınavlarında soru sırası karıştırılıyor, şıkların sırası karıştırılmıyor (dersler.js:286, `q.secenekler.map` dosyadaki sırayla). Doğru şık iki biçimde tahmin edilebiliyor:
  - 216 sorunun 166'sında (%76,9) doğru şık en uzun şık. "Hep en uzununu seç" stratejisi sınavın yaklaşık dörtte üçünü bilgisiz geçiriyor; şans düzeyi %25.
  - Doğru şıkkın konumu dengesiz: A 34, B 94, C 68, D 20. B tek başına %43,5.
  
  Sınav bilgiyi ölçmesi gerekirken ipucuyla çözülebiliyor. Yanlış cevap, açıklama ve dayanak hatası ise bulunmadı (bkz. Yöntem).
- **Kanıt:** `node sinav1.js` çıktısı: `dogru konum dagilimi [ 34, 94, 68, 20, 0 ]`, `en uzun sik dogru 166`.
- **Önerilen düzeltme:** Şıkları her açılışta karıştır. dogru dizinini karıştırma eşlemesiyle taşı; kartlar.js:24 de 'ABCD'[q.dogru] kullanıyor, oraya da aynı eşleme uygulanmalı. Ayrıca çeldiricileri doğru şıkla benzer uzunlukta yaz.

### A3B-09 · KÜÇÜK · cizim_v5d.js:388 (aciklama)
- **Açıklama:** d47-anatomi, "kalınlığı en çok 1500 ışık yılı, yani genişliğinin altmışta birinden az" diyor. 87.400 / 1500 = 58,3. Bu yüzden 1500 ışık yılı, genişliğin altmışta birinden (1457 ışık yılı) fazla.
- **Kanıt:** `node -e "console.log(1500/87400, 1/60, 87400/1500)"` → 0.01716 0.01667 58.27.
- **Önerilen düzeltme:** "yaklaşık altmışta biri kadar" ya da "elli sekizde biri".

### A3B-10 · KÜÇÜK · cizim_v5c.js:420 (aciklama), 460 (etiket)
- **Açıklama:** d43-ana-cisim, 1.062'yi "gözlenmiş düşüş" sayısı olarak veriyor. Ders ve kaynak, Haziran 2012'ye kadar gözlenmiş düşüşlerin toplamını 1.102 veriyor. 1.062, bunlardan ana türüne göre sınıflanabilenlerin sayısı. Oranlar (kondrit 915, %86) doğru.
- **Kanıt:**
  - d43.json: "kayıtlı 1.102 gözlenmiş düşüş … ana türüne göre sınıflanmış 1.062 düşüşün 49'u".
  - https://en.wikipedia.org/wiki/Meteorite_fall_statistics (ham metin, G4): malzemeye göre tabloda "Total 1102", sınıfa göre tabloda "Total 1062".
- **Önerilen düzeltme:** "1.102 gözlenmiş düşüşten ana türü belli olan 1.062'si".

### A3B-11 · KÜÇÜK · cizim_v5d.js:125 (aciklama), 157
- **Açıklama:** d45-kutle-siniri, GW170817 kalıntısının "saniyeler içinde kara deliğe çöktü" ğünü kesin olgu gibi söylüyor. Ders bunu çekinceyle veriyor.
- **Kanıt:** d45.json bölüm 9: "…cismin 5 ile 10 saniye içinde bir kara deliğe çöktüğü düşünülüyor".
- **Önerilen düzeltme:** "çöktüğü düşünülüyor".

### A3B-12 · KÜÇÜK · cizim_v4a.js:211 (aciklama)
- **Açıklama:** d31-baglanma-egrisi, "En yüksek nokta nikel-62 ile demir-56'dır" diyor. Ama çizimin kendi verisinde A=58 noktası 8,792 MeV ile demir-56'dan (8,790) yüksek. Ders de sırayı Ni-62 > Fe-58 > Fe-56 olarak veriyor.
- **Kanıt:**
  - d31.json bölüm 4: "nikel-62'nin, 8,7945 MeV; onu 8,7922 MeV ile demir-58 ve 8,7903 MeV ile demir-56 izler".
  - cizim_v4a.js:196 (BA dizisi: …8.790 … 8.792 … 8.795).
- **Önerilen düzeltme:** "En yüksek nokta nikel-62'dir; demir-58 ve demir-56 hemen ardından gelir."

### A3B-13 · KÜÇÜK · cizim_v3.js:397
- **Açıklama:** d22-yildiz-gunes-gunu çiziminin içindeki yazı "iki sarı ok paralel" diyor. Kastedilen oklar R.vurgu renginde; bu renk kırmızı modda #F03E2C (kırmızı) oluyor. Normal modda da Güneş yönündeki kesikli ok (R.gunes, #F2C879) sarımsı, yani "iki sarı ok" hangi oklar olduğunu ayırt ettirmiyor.
- **Kanıt:** cizim_v3.js:391 ve 394 R.vurgu, 391+ R.gunes; stil.css `html.kirmizi { --pirinc: #F03E2C }`.
- **Önerilen düzeltme:** Renk adı yerine biçim kullan: "iki kalın düz ok paralel".

### A3B-14 · KÜÇÜK · cizim_v4c.js:247, 269
- **Açıklama:** d28-tunelleme, "engel yüksekliği: enerjinin 2 katı" diyor. Ama engel kutusu enerji çizgisinin 54 birim üstünden 30 birim altına uzanıyor (`S.kutu(a0, y0 - 54, …, 54 + 30, …)`). Kutunun tabanı sıfır olarak okunursa oran 84/30 = 2,8 görünür. Sıfır çizgisi çizilmemiş.
- **Kanıt:** cizim_v4c.js:247 ve 269.
- **Önerilen düzeltme:** Kutuyu y0 − 30'dan y0 + 30'a çiz, ya da y0 + 30'a bir sıfır çizgisi ekle.

### A3B-15 · KÜÇÜK · cizim_v5a.js:499, 522
- **Açıklama:** d35-sera'nın göstergesinde "dolu daire: gerçek ortalama" yazıyor. Merkür satırındaki dolu daire ise 93 K'lik gece en düşük sıcaklığı; ortalama değil.
- **Kanıt:** satır 499: `S.daire(X(93), y, 5, { dolgu: R.mavi … })`. Satır 522: gösterge yazısı.
- **Önerilen düzeltme:** Merkür gece değerini farklı bir işaretle çiz, ya da göstergeye ek açıklama koy.

### A3B-16 · KÜÇÜK · cizim_v3.js:279 (aciklama)
- **Açıklama:** d21-kutup-atlama, "kenarlarda boylar yüzde birkaç büyür" diyor. Kutup merkezli stereografik izdüşümde ölçek çarpanı sec²(θ/2). Çizilen yıldızlarda bu %6–14 eder: Alkaid %14, Merak ve Schedar %9.
- **Kanıt:** `node -e "for(const [n,d] of [['Dubhe',61.751],['Merak',56.3824],['Alkaid',49.3133],['Schedar',56.5373]])console.log(n,(1/Math.cos((90-d)/2*Math.PI/180)**2).toFixed(3))"` → 1.063 1.091 1.137 1.090.
- **Önerilen düzeltme:** "yüzde 6 ile 14 arası".

### A3B-17 · KÜÇÜK · cizim_v6.js:77
- **Açıklama:** d56 çizimlerinin "Wikipedia: Wormhole" kaynağı `https://wikiwand.com/en/Wormhole` kopya sitesine gidiyor. Kural asıl en.wikipedia.org. d56_kaynak.md:128 da en.wikipedia.org kullanıyor. Yan not: veri/dersler.json'da 15 wikiwand bağlantısı daha var. Bunlar ders metni alanında; burada yalnız haber veriliyor.
- **Kanıt:** `grep -n wikiwand cizim_v6.js` → 77.
- **Önerilen düzeltme:** `https://en.wikipedia.org/wiki/Wormhole`.

### A3B-18 · KÜÇÜK · cizim_gokyuzu.js:100
- **Açıklama:** 176 çizimden yalnız d1-kutup-enlem'de `kaynak` alanı yok. Altyazıda "Kaynak:" satırı çıkmıyor.
- **Kanıt:** yapi.js çıktısı: `KAYNAK YOK d1-kutup-enlem`.
- **Önerilen düzeltme:** d1'in kutup yüksekliği kaynağını ekle.

### A3B-19 · KÜÇÜK · kod yorumları ve kaynak notları (kullanıcıya görünmez)
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

## Askıda

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
