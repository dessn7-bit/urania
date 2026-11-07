# Alan 2 — Deneyler (Urania v39 denetimi, 2026-10-30)

## Okunan dosyalar
| dosya | satır | tamamı |
|---|---|---|
| simulasyon.js | 761 | evet (1–595, 596–761 iki parçada) |
| deneyler2.js | 594 | evet |
| deney/mevsim.js | 295 | evet |
| deney/analemma.js | 250 | evet |
| deney/eratosthenes.js | 209 | evet |
| deney/paralaks.js | 191 | evet |
| deney/durbun.js | 194 | evet |
| deney/astrofoto.js | 270 | evet |
| deney/hohmann.js | 202 | evet |
| deney/roket.js | 269 | evet |
| deney/ortme.js | 218 | evet |
| deney/yasanabilir.js | 163 | evet |
| veri/deney_rehber.json | 1700 | evet (1–450, 450–900, 900–1320, 1320–1700) |
| veri/deney/mevsim.json | 100 | evet |
| veri/deney/analemma.json | 97 | evet |
| veri/deney/eratosthenes.json | 219 | evet |
| veri/deney/paralaks.json | 245 | evet |
| veri/deney/durbun.json | 1 (62 KB tek satır) | evet, ancak `hedefler[].y` yıldız dizileri (4461 + 6603 sayı) sayı sayı okunmadı: dosya node ile girintilenip dizi uzunluklarıyla değiştirilerek okundu (496 satır); yıldız sayıları yalnız tarayıcıda dolaylı denetlendi |
| veri/deney/astrofoto.json | 375 | evet |
| veri/deney/hohmann.json | 113 | evet |
| veri/deney/roket.json | 129 | evet |
| veri/deney/ortme.json | 341 | evet |
| veri/deney/yasanabilir.json | 410 | evet |
| veri/fizik.json | 412 | evet |
| veri/deney_veri.json | 277 | evet |
| arastirma/simulasyon_iliskileri.md | 69 | evet |
| arastirma/simulasyon_tablolari.json | 390 | evet |
| arastirma/sabitler.json | 760 | evet |
| arastirma/deney_aciklama_kaynak.md | 84 | evet |
| arastirma/deney_v3/*_kaynak.md (10 dosya) | 402 | evet |
| (yardımcı) dersler.js 95–160 | — | yalnız gömme kodu (miniDeney/miniBagla) |

## Yöntem
Bütün betikler ve çıktılar `scratchpad/denetim/a2/` altında; depoya yazılmadı. Sunucu `PORT=8142 node testler/sunucu.js`, iş bitince kapatıldı. Chromium `--disable-lcd-text`, `serviceWorkers: 'block'`, 127.0.0.1 dışı her istek `route.abort`, saat 2026-10-30 12:00 (+03).

1. **Rehber adımları (rehber.js):** 20 deneyin 148 adımı sırayla “Uygula” ile uygulandı; her adımdan sonra bütün `…Cikti`, ölçüm kutuları ve `.deney-metin` okundu; “Gözle” metnindeki her sayı ekran metninde arandı. Bulunamayanlar elle tek tek incelendi (çoğu “yaklaşık”, önceki adımın değeri ya da 1.478/1478 biçim farkı; aşağıda yalnız gerçek uyuşmazlıklar var). Sayfa hatası: 0.
2. **Kaydırıcı uçları (uc.js):** her kaydırıcı min, max, %0,1, %25, %50, %75, %99,9 değerlerinde; ayrıca deney başına 250 rastgele birleşim (uçlara %30 ağırlık, seçimler ve onay kutuları da rastgele). NaN / Infinity / undefined / null / “−0” / “— birim” arandı. Sonuç: sayfa hatası 0, NaN/Infinity 0; yalnız tayfta “−0,00000” (A2-05).
3. **Bağımsız hesap:** Astronomy Engine 2.1.19 (bagimsiz.js) ve python (bag2.py):
   - Mevsimler 2026: 20 Mar 14:45:36, 21 Haz 08:25:00, 23 Eyl 00:05:38, 21 Ara 20:50:22 UT (uygulama USNO'yu kullanıyor: 08:24 / 20:50; uyumlu).
   - İstanbul (41,0 K 29,1 D) gündüz, kırılmalı: 21 Haz 15 sa 7,6 dk, 21 Ara 9 sa 13,5 dk, 3 Oca 9 sa 19,0 dk → ekrandaki 15 sa 8 / 9 sa 13 / 9 sa 19 dk ile aynı. Gerçek öğle 3 Oca 13:08:08, 21 Haz 13:05:28, 21 Ara 13:01:42 (uygulama 13:08:08 / 13:05:29 / 13:01:42).
   - Zaman denklemi 2026: en büyük +16,448 dk (3 Kas), en küçük −14,176 dk (11 Şub) → uygulama +16 dk 27 sn / −14 dk 12 sn.
   - Mars karşı konumu 2027-02-19 15:44 UT, Aslan (Leo) ✓; sonraki Merkür geçişi 2032-11-13 ✓.
   - WGS 84 meridyen yayı (Snyder serisi, uygulamanın Simpson tümlevinden bağımsız): Ataşehir–Denizli 355,273 km, Asvan–İskenderiye 787,737 km, kutup çevresi 40.007,863 km ✓.
   - Kopparapu 2014 katsayıları (Tablo 1, 1 M⊕) bellekteki değerlerle ve hzcalc.py ile aynı; Güneş 0,951–1,677 AB, T-1e 0,0246–0,0498, Proxima 0,0410–0,0813, Procyon 2,405–4,174 AB; T_eq: Dünya 255,1, Venüs 226,6, Mars 209,8, T-1e 249,6, Proxima b 250,8, Procyon 1 AB 415,7 K ✓.
   - Algol (sayısal ızgarayla örtüşme + Planck 550 nm): birincil 1,401 kadir (%72,5), ikincil 0,0154 kadir, süre 10,12 sa, tutulma sınırı i = 62,24°, C ile 1,233 kadir ✓.
   - Hohmann (vis-viva): Mars 258,9 gün, faz 44,3°, sinodik 779,9 gün, Δv +2,945 / 2,649, LEO 3,592 km/s; Venüs 146,1 g, −54,0°, 583,9 g, −2,495; Jüpiter 997,7 g, 97,1°, 398,9 g, +8,793 km/s ✓.
   - Yörünge (400 km, 1,2 vd): en uzak 11.039 km, 3,675 sa; 1,3 vd: 30.536 km, 8,92 sa ✓. Görelilik, roket, paralaks, durbun, kara delik, gelgit, tayf sayıları elle yeniden hesaplandı ✓ (aykırılar aşağıda).
   - Sabitler (veri/fizik.json): G 6,67430e-11, c, h, k, σ, b (CODATA 2022), au (IAU 2012 B2), pc = 648000/π au, ly (Julian yılı), R☉/L☉/T☉/GM☉/GM⊕ (IAU 2015 B3), g₀ 9,80665 — arastirma/sabitler.json'daki NIST/IAU alıntılarıyla birebir; NASA gezegen sayfası değerleri (kütle, yarıçap, kurtulma hızı, Ay perigee/apogee) uyumlu.
   - NASA sayfaları curl ile çekildi (2 istek): planetary/factsheet/index.html ve plutofact.html (A2-01 için).
4. **Arayüz (ui.js, kirmizi.js, gom.js, yap2.js):** 320 ve 551 px genişlikte DOM taşma/kesik yazı taraması (`scrollWidth`, `getBoundingClientRect`) — 40 durumda 0 sorun; 320 px kanvas ekran görüntüleri gözle incelendi (durbun, roket, astrofoto, mevsim, analemma, eratosthenes, hohmann, paralaks). `reducedMotion: 'reduce'`: 20 deneyde 2 sn arayla kanvas görüntüsü değişmiyor, zaman kaydırıcıları ve lejanttaki azHareket satırları çıkıyor. Kırmızı mod: 20 deneyin tam sayfa görüntüsünde (açıklamalar açık) G ya da B > 24 ve > 0,35·R piksel sayısı 0; ders içi gömülü deneylerde (d16) 0. Yapışkan kanvas 551×860'ta 17 deneyde var (mevsim/analemma/astrofoto kanvası %55 sınırını aştığı için tasarım gereği yapışmıyor; Uygula kanvasa kaydırıyor). Ders içi gömme: d13'te iki mini deney art arda açma yarışı, aynı deneyin ders içinde ve tam sayfada eşzamanlı açılması, kırmızı mod.

## Bulgular

### A2-01 · ÖNEMLİ · veri/deney_veri.json:54–56 (+ veri/deney_rehber.json:757)
- Açıklama: Kepler deneyinde Plüton'un dışmerkezliği 0,244 kayıtlı. “Plüton” düğmesine basınca ekranda en yakın nokta **29,848 AB** (en uzak 49,115 AB) yazıyor; aynı adımın “Gözle” metni “En yakın noktası yaklaşık **29,7 AB** (NASA bilgi sayfası: 4436,8 milyon km)” diyor. 4436,8 milyon km = 29,66 AB; ekrandaki değer 0,19 AB (≈ 28 milyon km) fazla. Neden: NASA'nın özet tablosundaki 0,244 değeri aynı tablonun kendi günberi/günöte sayılarıyla tutarsız; Plüton'un kendi bilgi sayfası 0,2488 veriyor.
- Kanıt:
  - Tarayıcı: `#kpOn button[data-i="6"]` → `#kpQ` = “29,848 / 49,115 AB”.
  - https://nssdc.gsfc.nasa.gov/planetary/factsheet/index.html : “Eccentricity 0.206 0.007 0.017 0.055 0.094 0.049 0.052 0.047 0.010 0.244” ve “Perihelion (10 6 km) … 4436.8”, “Distance from Sun (10 6 km) … 5906.4” → 1 − 4436,8/5906,4 = 0,2488.
  - https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html : “Semimajor axis (AU) 39.48168677 Orbital eccentricity 0.24880766”.
  - Hesap: 39,4818 × (1 − 0,2488) = 29,66 AB; 39,4818 × (1 − 0,244) = 29,85 AB.
- Önerilen düzeltme: Plüton `e` = 0,2488 (plutofact.html) yapılmalı, `ham` alanına kaynak notu eklenmeli; o zaman ekran 29,66 / 49,30 AB gösterir ve “Gözle” metniyle uyuşur.

### A2-02 · KÜÇÜK · veri/deney_rehber.json:1328 (evreler, 8. adım)
- Açıklama: “Dolunayda düğüm açısını 15° yap; sonra kaydırıcıyı 20°'ye götür” adımının metni 20°'de Ay'ın tutulumdan **1,76°** uzak olduğunu söylüyor; ekran **−1,74°** gösteriyor. Metin tam 180° uzanım (asin(sin 5,145° · sin 200°) = −1,757°) ile hesaplanmış, oysa 14,75. günde uzanım 360·14,75/29,53 = 179,817°.
- Kanıt: nokta.js: `#evGun`=14.75, `#evMevsim`=20 → `#evEnlem` “−1,74°”, `#evTut` “Yok: Ay tutulumun altından geçiyor”. Hesap: asin(sin 5,145° · sin 199,817°) = −1,742°. (deney_aciklama_kaynak.md:47 hesabı 200° ile yapmış.)
- Önerilen düzeltme: metinde “1,74°” yazılmalı (ya da “yaklaşık 1,75°”).

### A2-03 · KÜÇÜK · veri/deney_rehber.json:964 (gelgit, 7. adım)
- Açıklama: “Gözle” metnindeki toplamlar ekrandaki yuvarlanmış sayıların toplamı: “yaklaşık **1,85** × 10⁻⁷ g … (ortalamada 1,64, en uzakta **1,48**)”. Uygulamanın kendi formülüyle tam değerler 1,84 ve 1,47 (ortalama 1,64 doğru). Bu sayılar ekranda görünmüyor; okur kendi hesaplayınca tutmuyor.
- Kanıt: 2GMR/d³ / g₀ (G, g₀ fizik.json; M_Ay 7,346e22, M☉ 1,98841e30, R 6371 km): Ay yakın 1,32855, ort 1,12157, uzak 0,95544; Güneş 0,51504 (× 10⁻⁷ g) → 1,8436 / 1,6366 / 1,4705.
- Önerilen düzeltme: “yaklaşık 1,84 … (ortalamada 1,64, en uzakta 1,47)”.

### A2-04 · KÜÇÜK · veri/deney_rehber.json:1497 ve 1493 (geçiş, 6. ve 7. adım)
- Açıklama: (a) Adım “dolanım süresini **4 katına (1468 gün)** çıkar” diyor ve `#gcP` = 3.16672 (10^3,16672 = 1468,0 gün) ayarlıyor; 4 × 365,256 = **1461,0 gün** (log 3,16465). Ekran 1.468,0 gün gösteriyor, yani 4,019 kat. (b) 6. adım “geçiş yaklaşık **32,5 saatten** 16,4 saate” diyor; önceki adımda ekran 32,57 saat (yuvarlanınca 32,6).
- Kanıt: rehber.js çıktısı: `gcPCikti=1.468,0 gün`, `Geçiş süresi = 20,82 saat`, `a = 2,5278 AB`; Jüpiter–Güneş adımında `Geçiş süresi = 32,57 saat`.
- Önerilen düzeltme: `#gcP` 3.16465 (1461 gün) yapılmalı (süre 20,80 sa, a 2,520 AB olur; Gözle metni “20,8 saat, 2,52 AB” güncellenmeli); (b) “yaklaşık 32,6 saatten”.

### A2-05 · KÜÇÜK · deneyler2.js:279 (tayf, “Kayma” kutusu)
- Açıklama: Küçük hızlarda (|v| ≲ 1,5 km/s) kutu “kırmızıya 0,00 nm (z = 0,00000)” ya da “maviye 0,00 nm (z = −0,00000)” yazıyor: yön söyleniyor ama değer sıfır; “−0,00000” eksi sıfır. Hα satırında da yuvarlamadan durgun değer 656,29 iken gözlenen 656,28 görünüyor (gerçek fark 0,0005 nm).
- Kanıt: nokta.js: `#tyV`=−0.02 → “−0,2 km/s | maviye 0,00 nm (z = −0,00000) | 656,28 nm (durgunda 656,29)”; `#tyV`=0.035 → “+1,3 km/s | kırmızıya 0,00 nm (z = 0,00000)”. uc.js rastgele taramada iki kez yakalandı.
- Önerilen düzeltme: |z| < 5e-6 için “yok denecek kadar az” yaz ya da küçük hızlarda bilimsel gösterim (z = −4,7 × 10⁻⁶) kullan; Hα'yı da aynı basamakla yaz.

### A2-06 · KÜÇÜK · uygulama.js:127–131 (U.bilimsel; kara delik deneyinde görünür)
- Açıklama: Mantis yuvarlanınca 10'a çıktığında üs artırılmıyor: “10,00 × 10⁶ Güneş kütlesi”, “10,00 × 10⁹”. Kara delik kütle kaydırıcısı (`step="any"`) her on katın son ~%0,02'sinde bunu gösterir.
- Kanıt: nokta.js: `#kdKutle`=6.99999 → `#kdKutleCikti` “10,00 × 10⁶ Güneş kütlesi”; 9.99999 → “10,00 × 10⁹ Güneş kütlesi”.
- Önerilen düzeltme: `bilimsel` içinde yuvarlanmış mantis ≥ 10 ise m /= 10, us += 1.

### A2-07 · KÜÇÜK · simulasyon.js:9
- Açıklama: `azHareket` sayfa yüklenirken bir kez okunuyor (`matchMedia(...).matches`), `change` dinleyicisi yok. Uygulama açıkken sistemde “hareketi azalt” açılırsa deneyler canlandırmayı sürdürür, zaman kaydırıcıları ve lejanttaki azHareket satırları çıkmaz; sayfa yenilenene kadar böyle kalır.
- Kanıt: simulasyon.js:9 `const azHareket = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;`; dosyada `addEventListener('change'` ya da `addListener` yok (grep). (Başlangıçta “reduce” iken davranış doğru: 20 deneyde kanvas 2 sn boyunca değişmedi.)
- Önerilen düzeltme: MediaQueryList'e `change` dinleyicisi ekleyip açık deneyi yeniden kurmak (ya da en azından döngüde güncel `matches` değerini okumak).

## Askıda
- **Ders içi deney ile tam sayfa deneyin aynı anda var olması:** d3'te Kepler mini deneyi açıkken `#deney/kepler`'e geçince belgede iki `#kpA`, iki `#kpKanvas`, iki `#kpAAd` oluyor (gom.js). Gözlenen bir bozukluk yok: `getElementById` tam sayfadakini buluyor, rehber “Uygula” yalnız tam sayfadaki kaydırıcıyı değiştiriyor (0,9 (tam) / 0,017 (ders)). Geçersiz HTML (yinelenen kimlik) ama ekran okuyucuda yanlış ad okuttuğu kanıtlanamadı. Derse dönülünce açık mini deney kapanmış oluyor (ders yeniden çiziliyor); hata mı tasarım mı kararlaştırılamadı.
- **simulasyon.js:745 `[F, R] = await …` yarışı:** Deneyler sekmesi hiç açılmadan bir dersteki iki mini deney (d13: geçiş + yaşanabilir bölge) art arda açılırsa ikinci yükleme R'yi baştan yazıp modül rehberini silebilir gibi görünüyor; iki sırayla denendi, yeniden üretilemedi (tam sayfa yasanabilir rehberi 8 adım, “Bu deney ne?” ve “Ekranda ne var?” geldi).
- **Analemma lejantı “yatay ölçek dikeyin yaklaşık 9–10 katı”:** kaynak notu 551 px'te 8,9, 320 px'te 10,3 ölçmüş; geniş ekranda (kendi hesabım 800 px ≈ 8,5) aralığın altına düşüyor olabilir, tarayıcıda ölçülmedi.
- **Paralaks kanvası:** dönen Dünya noktası her turda “1 AB” etiketinin üstünden geçip onu kısa süre örtüyor (320 px ekran görüntüsü); hareketli bir çakışma, okunurluğu kalıcı bozduğu kanıtlanmadı.
- **Evreler tutulma sınırı 1,5°:** tek eşik hem Güneş hem Ay tutulması için kullanılıyor; gerçek sınırlar türe göre farklı (yaklaşık 1,0°–1,6°). Metin “yaklaşık sınır” diyor; kaynakta tek bir sayı aranmadı, bulgu sayılmadı.
- **Görelilik Proxima 4,24 ışık yılı (fizik.json, NASA) ↔ paralaks deneyi 4,25 (Gaia DR3'ten 4,2465):** iki deney farklı yuvarlama gösteriyor; ikisi de kaynaklı, hata değil.
