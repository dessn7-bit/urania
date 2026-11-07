# Alan 4 — Kabuk ve öteki sekmeler (Urania v39 denetimi, 2026-10-30)

Depo: `C:\Users\Kaan\urania`, commit 8b126f3 (v39). Depoda hiçbir dosya değiştirilmedi; bütün betikler ve çıktılar
`…\scratchpad\denetim\a4\` geçici klasöründe. Tarayıcı denemeleri kendi portumda (8145), Chromium `--disable-lcd-text`, dış ağ `page.route` ile kesildi (open-meteo / nominatim sahte yanıt, CelesTrak `testler/yardim.js` fikstürü; gerçek ağ isteği atılmadı).

## Okunan dosyalar
| dosya | satır | tamamı |
|---|---|---|
| uygulama.js | 465 | evet |
| baslat.js | 2 | evet |
| tema.js | 12 | evet |
| tani.js | 129 | evet |
| sw.js | 66 | evet |
| index.html | 87 | evet |
| stil.css | 885 | evet (1–300, 300–599, 600–885) |
| manifest.json | 22 | evet |
| defter.js | 419 | evet |
| gorevler.js | 153 | evet |
| veri/gorevler.json | 948 | evet (1–783, 783–949) |
| hesap.js | 256 | evet |
| haberler.js | 159 | evet |
| veri/haberler.json | 1460 | evet (1–370, 370–740, 740–1110, 1110–1461; yalnız yapı/alan/görsel yolu gözüyle) |
| img/haber/ (18 .jpg) | — | hepsi denetlendi: var, JPEG imzası, boyutları (aşağıda), haberlerle eşleşme |

Bağlam için (benim alanım dışında, yalnız ilgili satırlar): `gozlem.js:438-447` (defterBag), `plan.js` anahtar üretimi, `uydu.js:30-50`, `hava.js:21-45`, `ses.js:110-125`, `dersler.js:25-57`, `testler/sunucu.js`, `testler/yardim.js`, `testler/sw_varliklar.spec.js`.

## Yöntem
Betikler (hepsi `a4\` içinde):
- `tur.js`, `tur_k.js` — 12 rota (gok, deney, deney/kepler, ders, ders/d1, ders/sozluk, defter, defter/gorevler, hesap, haber, haber/<id>, tani) × 320/551/860 px × normal/kırmızı: `securitypolicyviolation` sayacı, `pageerror`, konsol hata/uyarı, `document.title`, `scrollWidth > clientWidth` ve görünüm dışına taşan öğe taraması (tüm `<details>` açık); kırmızı modda 551 px tam sayfa ekran görüntüsünde kırmızı olmayan piksel (ölçüt `testler/erisim.spec.js` ile aynı: G ya da B > 0,3·R+6 ve > 20).
- `kirmizi2.js` — kırmızı modda haber görselleri yüklü (18/18), defter formu + datetime odakta, klavye odağı, hesap hata kutusu, sürüm şeridi, tanı.
- `erisim.js`, `k24.js` — 11 rota × normal/kırmızı: erişilebilir adı olmayan denetimler, dokunma hedefi ölçümü (`::after` genişletmesi hesaba katılarak), WCAG karşıtlık oranı (yarı saydam renk/zemin harmanlanarak), Tab ile 40 durakta odak halkası ve yapışkan bar altında kalma.
- `depo.js` — 27 yerel depo anahtarı × 9 bozuk değer (`{bozuk`, `null`, `[]`, `{}`, `"abc"`, `12345`, `true`, `[{"a":1},null,5]`, iç alanları null/yanlış türde nesne) × 10 rota (4 paralel süreç, 243 senaryo).
- `ek4.js` — konum kaydında sayı yerine dize/boolean/aşırı yükseklik.
- `defter_tur.js`, `defter_tur2.js`, `ek1.js` — tarih girişi, kota dolu (setItem QuotaExceededError), depo tümden kapalı (localStorage erişimi SecurityError), yedek indir/yükle, `#defter/yeni/...` ve `#haber/...` bozuk adresler, tanı raporu.
- `hesap_tur.js`, `ek2.js` — 50 girdi durumu, sonuçlar aşağıdaki bağımsız hesapla karşılaştırıldı.
- `dst.js` — `defter.js:80-114` birebir kopyası Node'da.
- `ek3.js` — 3000 kayıtlı (1,35 MB) defterle Gök/Defter/Görevler açılış süresi (sorun yok: 0,86 / 1,46 / 0,54 s).
- `sw_sunucu.js` + `sw_test.js` — depo kopyası `site_a` (v39) ve `site_b` (SURUM v40, `cizim.js` ve `dersler.json`'a işaret) iki klasörden sırayla sunuldu (`Cache-Control: max-age=600`, GitHub Pages benzeri); SW `serviceWorkers:'allow'` ile elle kaydedildi (uygulama yalnız https'te kaydeder, `uygulama.js:442`), çevrimdışı açılış `context.setOffline(true)`, sürüm geçişi `registration.update()`.
- ASSETS ↔ disk karşılaştırması (Node).

Temiz çıkanlar (bulgu değil, kısaca):
- CSP: 72 rota × tema × genişlik geçişinde **0 ihlal**, 0 pageerror, 0 konsol hatası; `lib/*.min.js` içinde `eval(`/`new Function` yok; satır içi olay özniteliği yok.
- Yatay taşma: 320/551/860 px, iki temada, tüm rotalarda `scrollWidth == clientWidth`, taşan öğe 0.
- Kırmızı mod: 12 rota + haber görselleri + form/odak/şerit durumlarında kırmızı olmayan piksel **0**.
- Erişilebilir adı olmayan denetim: 0. `lang="tr"` var. Tab ile odak halkası her durakta görünür, yapışkan bar altında kalan yok.
- 243 bozuk depo senaryosunun hiçbirinde pageerror, bölüm hata kutusu ya da boş bölüm yok; kullanıcı verisi (defter, dersBitti, kartlar, sinav*) sessizce silinmiyor. Değeri değişenler yalnız uygulamanın kendi durum/önbellek yazımları (`acikUnite`, `haberSon`, `gp_istasyon`, `gp_dizi`). (İstisna: aşağıdaki A4-01, bu taramadaki değer kümesinde yoktu.)
- Depo tümden kapalıyken (SecurityError) 9 rotada çökme yok.
- Kota dolu: defter "Kaydedilemedi…" uyarısı çıkıyor, form açık kalıyor.
- Yedek indir → yeniden yükle: "0 kayıt eklendi, 3 kayıt zaten vardı"; bozuk JSON ve yanlış biçim doğru iletiyle reddediliyor.
- Çevrimdışı (SW önbelleği dolu iken): gok, ders/d1, deney/kepler, defter/gorevler, hesap, haber, tani açılıyor, hata kutusu yok. ASSETS'teki 97 yolun hepsi diskte var, tekrar yok; uygulamanın yüklediği bütün betik/veri/font/işçi dosyaları ASSETS'te (eksik yalnız haber görselleri, A4-02).
- veri/gorevler.json: 40 görev, kimlik ve anahtar tekil, `hedef:` anahtarlarının hepsi hedefler.json'da, `yildiz:Polaris` (1,97) ve `yildiz:Algol` (2,09) defter kataloğunun ≤2,5 kadir sınırında, `ders` alanlarının hepsi dersler.json'da.
- veri/haberler.json: 27 haber, kimlik tekil, tarih/eklenme biçimi doğru, tür ve kesinlik değerleri kodun tanıdığı küme içinde, her haberde ≥2 kaynak, `ilgili_dersler` hepsi var. 18 görselin hepsi diskte, `img/haber/<id>.jpg` desenine uyuyor, kullanılmayan dosya yok; boyutlar 1024–1200 px genişlik, 28–224 KB, aşamalı JPEG.
- hesap.js: aşağıdaki karşılaştırmada formüller ve sabitler doğru.

### hesap.js bağımsız karşılaştırma (açık formül, fizik.json sabitleri)
| girdi | uygulama | bağımsız hesap |
|---|---|---|
| 1 pc | 3,086×10¹³ km; 206.265 AB; 3,262 ışık yılı | 648000/π AB = 206264,8; 3,0857×10¹³ km; /9,4607×10¹⁵ = 3,2616 |
| 1 AB, ışık süresi | 8,3 dakika | 1,495978707×10¹¹/299792458 = 499,0 s = 8,32 dk |
| Dünya kurtulma | 11,19 km/s, g 9,82 | √(2·6,6743e-11·5,9722e24/6,371e6)=11186 m/s; GM/R²=9,820 |
| Rs, 1 M☉ | 2,953 km | 2·6,6743e-11·1,98841e30/c² = 2953,3 m |
| Rs, 70 kg | 1,04×10⁻²² mm | 1,0397×10⁻²⁵ m |
| Kepler a=1 AB | 1,000 yıl (365,3 gün), 29,78 km/s | 2π√(a³/GM)=3,1558×10⁷ s=365,26 g; 2πa/T=29,78 km/s |
| m=1, d=25 pc | M=−1,0; m−M=1,99; 213 L☉(V) | 5·log₁₀2,5=1,9897; 10^(0,4·(4,83+0,9897))=212,8 |
| Δm=14 | 398.107 kat | 10^5,6=398107 |
| p=768,07 mas | 1,302 pc = 4,25 ışık yılı | 1/0,76807=1,3020; ×3,26156=4,2465 |
| T=5772 K | 502 nm | 2,897771955e-3/5772 = 5,0204×10⁻⁷ m |
| R=2 R☉, T=9000 K | 23,6 L☉ | 4·(9000/5772)⁴ = 23,64 |

## Bulgular

### A4-01 · ÖNEMLİ · uygulama.js:56-61 (+ defter.js:55-57, 252)
- Açıklama: `konum()` bozuk kaydı ayıklamak için `isFinite(k.enlem)` kullanıyor; bu genel `isFinite` dizeyi ve boolean'ı sayıya çevirdiği için `"41"`, `true` gibi değerler geçerli sayılıyor; `yukseklik` hiç denetlenmiyor. Değer Astronomy Engine'e gidince (`Observer`: sayı değilse ya da yükseklik −500…100000 m dışındaysa `throw`) Gökyüzü sekmesi hata kutusuyla açılıyor, Görevler "hazırlanamadı" diyor ve Defter'de "Kaydet" **hiçbir uyarı vermeden** kaydı yazmıyor (`formKaydet` → `otomatik()` içindeki `G.gozlemci` / `G.ayDurumu` çağrısı try dışında, satır 56-57). Dosyadaki açıklama ("Bozuk/eksik kayıt uygulamayı düşürmesin") bu durumu kapsamıyor. Uygulamanın kendi yazdığı konumlar sayı olduğu için tetiklenmesi bozuk depo kaydı gerektiriyor.
- Kanıt: `ek4.js`, `urania_konum` = `{"ad":5,"enlem":41,"boylam":29,"yukseklik":"x","saatDilimi":"Mars/Olympus"}`:
  ```
  gok: Bu bölüm açılırken hata oluştu: Value is not a finite number: x.
  defter/gorevler: Görevler hazırlanamadı: Value is not a finite number: x
  (Yeni kayıt → Kaydet) kayıt: [boş]   hatalar [ 'pageerror: x' ]
  ```
  Aynı sonuç `{"enlem":"41","boylam":"29"}` ("Value is not a finite number: 41"), `{"enlem":true,…}` ve `{"yukseklik":1e9}` ("Invalid elevation: 1000000000") için.
- Önerilen düzeltme: `konum()` içinde `Number.isFinite` (ya da `typeof === 'number'`) kullan, `yukseklik`'i sayı ve −500…100000 aralığında değilse 0 yap, `ad`'ı dizeye çevir. `defter.js` `otomatik()`'te gözlemci/Ay hesabını da try içine al ya da `formKaydet` hatayı yakalayıp kullanıcıya göstersin.

### A4-02 · ÖNEMLİ · sw.js:4-19, 29
- Açıklama: Haber görselleri (`img/haber/*.jpg`, 18 dosya, ~1,8 MB) ASSETS'te değil. Yalnız çevrimiçiyken ekrana gelmiş (tembel yükleme) görseller fetch işleyicisiyle sürüm önbelleğine giriyor; her sürüm değişiminde `activate` eski önbelleği sildiği için bunlar da gidiyor. Sonuç: çevrimdışında Haberler sekmesindeki görsellerin hepsi ya da çoğu gizleniyor (figür `hidden`). `testler/sw_varliklar.spec.js` gezinti listesinde `#haber` olmadığı için test bunu yakalamıyor.
- Kanıt: `sw_test.js` çıktısı:
  ```
  gezinti sonrası v39 önbelleği: { toplam: 103, gorsel: 6 }      (18 görselden 6'sı)
  güncelleme sonrası önbellekler: { 'urania-v40': '97 (görsel 0)' }
  güncelleme sonrası çevrimdışı haber: gizlenen figür 18 / 18
  ```
  Disk ↔ ASSETS karşılaştırması: diskte olup ASSETS'te olmayan yalnız 18 `img/haber/*.jpg` (ve SW için gerekmeyen package*.json, playwright.config.js, sw.js).
- Önerilen düzeltme: Görseller ASSETS'e eklenmeli (haberler.json'dan üretilerek) ya da bilinçli dışarıda bırakılıyorsa ayrı, sürümler arası korunan bir görsel önbelleği kullanılmalı; `sw_varliklar` testine `#haber` rotası eklenmeli.

### A4-03 · ÖNEMLİ · uygulama.js:318
- Açıklama: `BOLUM_AD` sözlüğünde `haber` yok. Haberler sekmesinde sayfa başlığı "Urania — undefined" oluyor; ekran okuyucu sekme/pencere adını bu hâliyle okuyor, geçmiş ve sekme listesinde de böyle görünüyor.
- Kanıt: `tur.js`, her genişlik ve temada:
  ```
  #haber: title="Urania — undefined"
  #haber/2026-10-27-beyaz-cuce-cift-halka: title="Urania — undefined — Haberler"
  ```
- Önerilen düzeltme: `BOLUM_AD`'a `haber: 'Haberler'` ekle (ikinci satır o zaman "Urania — Haberler" olur; `ad !== BOLUM_AD[bolum]` denetimi tekrarı önler).

### A4-04 · ÖNEMLİ · haberler.js:75, 134 (kök neden uygulama.js:14-35)
- Açıklama: Depo yazılamıyorsa (kota dolu ya da tarayıcı yerel depoyu kapatmış — `uygulama.js` bu durumu açıkça desteklediğini söylüyor) Haberler'deki tür filtresi düğmeleri hiçbir şey yapmıyor: tıklama değeri yalnız depoya yazıyor, `ciz()` filtreyi yine depodan okuyor, okunan eski değer kalıyor. Aynı "yaz, sonra depodan geri oku" deseni `ar.js:797` (sesli AR aç/kapa) ve `dersler.js:386-387` (sesli tekrar kartı) içinde de var. Kırmızı ışık düğmesi o oturumda çalışıyor ama kalıcı olmuyor ve kullanıcıya söylenmiyor.
- Kanıt: `defter_tur.js` (setItem QuotaExceededError) ve `ek1.js` (localStorage SecurityError), "Uzay görevleri" düğmesine tıklandıktan sonra:
  ```
  2 kota: haber filtresi uygulandı mı = hepsi
  depo kapalı: … filtre hepsi
  2 kota: kırmızı düğme sonrası sınıf = kirmizi depoda = null
  ```
- Önerilen düzeltme: `uygulama.js` `oku/yaz` için yazılamayan değeri oturum boyunca tutan bir bellek katmanı ekle (oku önce belleğe bakar); ya da filtre gibi durumlar bir değişkende tutulup depo yalnız kalıcılık için kullanılsın.

### A4-05 · KÜÇÜK · tani.js:68-69 (ve 102-112)
- Açıklama: Tanı raporu depodaki uydu önbelleğinin yalnız `Number.isFinite(alindi)` ve `Array.isArray(ls/diziler)` olduğunu denetliyor. `alindi` geçerli tarih aralığı dışındaysa (`> 8,64e15`) `toISOString()` RangeError atıyor; `diziler` içinde `null` öğe varsa `d.kod` atıyor. Rapor hiç yazılmıyor, "Raporu kopyala" tıklanınca ne kopyalıyor ne de durum iletisi veriyor (söz reddi yakalanmıyor). Tanı ekranı tam da bozuk durumda başvurulacak ekran olduğu için önemli; tetiklenmesi bozuk depo kaydı gerektiriyor (uydu.js bu değerleri kendisi yazmaz).
- Kanıt: `defter_tur2.js`, `urania_gp_istasyon` = `{"ls":[{"OBJECT_NAME":"ISS","EPOCH":"2026"}],"alindi":1e20}`:
  ```
  7 tanı rapor uzunluk 0
  7 hatalar [ 'pageerror: Invalid time value @ at Date.toISOString … at rapor (tani.js:68:184)' ]
  7 kopyala durum (boş)
  ```
- Önerilen düzeltme: Rapor satırlarını tek tek try ile üret (bir satır bozuksa "okunamadı" yaz), tarih için `isNaN(new Date(x))` denetle, `gpD.diziler` öğelerini süz; Kopyala işleyicisinde `rapor()` hatasını yakalayıp durum satırına yaz.

### A4-06 · KÜÇÜK · uygulama.js:124-132
- Açıklama: `bilimsel()` mantisi yuvarladıktan sonra 10'a ulaşırsa üssü artırmıyor: 99 999 000 km "10,000 × 10⁷ km" yazılıyor (doğrusu "1,000 × 10⁸"). Hesap sekmesinin bütün bilimsel çıktıları bu işlevden geçiyor.
- Kanıt: `ek2.js`:
  ```
  99999000 → 3: 10,00 × 10⁷ | 4: 10,000 × 10⁷
  0.00099999 → 3: 10,00 × 10⁻⁴
  -999990000 → 3: -10,00 × 10⁸
  uzaklık 99999000 km → 10,000 × 10⁷ km ¶ = 0,6685 AB …
  ```
- Önerilen düzeltme: Mantisi istenen basamağa yuvarladıktan sonra |m| ≥ 10 ise m/10 ve us+1 (ya da `toExponential(anlamli-1)` çıktısından üs ve mantisi al).

### A4-07 · KÜÇÜK · defter.js:108-110 (ve 99)
- Açıklama: `girdiOku` ve `ofset` `Date.UTC(yıl, …)` kullanıyor; JavaScript 0–99 yıllarını 1900–1999'a çeviriyor. Tarih girdisine (datetime-local 0001'den başlar) yıl olarak 0050 yazılırsa kayıt 1950 olarak saklanıyor.
- Kanıt: tarayıcıda Yeni kayıt, Ne zaman = `0050-06-01T22:00` → `localStorage` `"1950-06-01T19:00:00.000Z"`; `dst.js` (defter.js birebir): `0001-01-01T00:00 UTC → 1901-01-01T00:00:00.000Z`.
- Önerilen düzeltme: `const d = new Date(0); d.setUTCFullYear(y, ay, gün); d.setUTCHours(sa, dk, sn)` ile kur; ya da girdiye `min="1900-01-01T00:00"` koyup daha eskisini reddet.

### A4-08 · KÜÇÜK · defter.js:343
- Açıklama: Yedekten yüklenen kaydın `zaman` alanı yalnız `!isNaN(new Date(k.zaman))` ile denetleniyor; tarayıcının gevşek tarih ayrıştırması `"1"` gibi değerleri 2001 yılı olarak kabul ediyor, bozuk kayıt geçerli diye ekleniyor.
- Kanıt: `defter_tur2.js` yedeğinde `{"id":"sayizaman","zaman":"1",…}` → `4 depodaki: 'sayizaman 2000-12-31T22:00:00.000Z'`, listede "00:00" saatli kayıt olarak görünüyor; "3 kayıt eklendi" sayısına dahil.
- Önerilen düzeltme: `zaman` için ISO 8601 deseni şart koş (`/^\d{4,}-\d{2}-\d{2}T\d{2}:\d{2}/`).

### A4-09 · KÜÇÜK · tani.js:47
- Açıklama: `(U.oku('defter', []) || []).length` — depodaki değer dizi değil nesneyse raporda "defter undefined kayıt" yazıyor (defter.js aynı değeri boş liste sayıyor).
- Kanıt: `ek1.js`, `urania_defter = {"a":1}` → `DEPO: 0 KB / 3072 MB · defter undefined kayıt`.
- Önerilen düzeltme: `U.diziOku('defter').length` (ya da `Defter.kayitlar().length` ve bozuk öğe sayısı ayrıca).

### A4-10 · KÜÇÜK · haberler.js:143
- Açıklama: `#haber/<kimlik>` parametresi `decodeURIComponent` ile try dışında çözülüyor; bozuk % dizisi (`#haber/%E0%A4`) bölümde "Bu bölüm açılırken hata oluştu: URI malformed" kutusu çıkarıyor ve hata `ilk()` içinden geldiği için bölüm bir sonraki girişte baştan kuruluyor (`el` üzerindeki tıklama/hata/toggle dinleyicileri ikinci kez ekleniyor). `defter.js:412` aynı durumu try ile karşılıyor.
- Kanıt: `defter_tur2.js`: `6 haber bozuk %: [ 'Bu bölüm açılırken hata oluştu: URI malformed. …' ] h1 true`.
- Önerilen düzeltme: `try { ac(decodeURIComponent(param)); } catch (e) {}`.

### A4-11 · KÜÇÜK · stil.css:558
- Açıklama: Dersler listesindeki ünite numarası (`.unite-no`) metin rengi olarak yarı saydam zemin değişkeni `--pirinc-soluk`'u kullanıyor: büyük metin için gereken 3:1'in altında.
- Kanıt: `erisim.js`: normal `rgba(200,164,93,.32)` / `#0F1B2D` → **1,86:1**; kırmızı `rgba(240,62,44,.22)` / `#000` → **1,22:1** (30 px, eşik 3:1), 11 ünitenin hepsinde.
- Önerilen düzeltme: `color: var(--soluk)` ya da `var(--pirinc)` (dekoratifse `aria-hidden` ve bunu belirten açıklama).

### A4-12 · KÜÇÜK · stil.css:682 (dokunma hedefi ölçümü)
- Açıklama: Gökyüzü listelerindeki "Gördüm, deftere yaz" bağlantısı (`.defter-bag a`) dolgusuz: 128 × **18** px. Aynı satırdaki "Haritada göster"/"Nasıl bulunur" düğmeleri `.defter-bag .bag { padding: 2px 0 }` ile 25 px; satır 695-696'daki "iki eylem aynı görünüşte" amacına rağmen bağlantı 24 px altında kalıyor. 44 px altı ölçülen öteki hedefler (551 px, satır içi metin bağlantıları hariç): Gök `button.bag` 24–25 px yükseklik (Konumu değiştir, Haritada göster ×35, Nasıl bulunur ×25, Takvime ekle ×20), Gök tarih girdisi 125×33; Dersler "Hepsini aç/kapat" 33 px; sözlük harf düğmeleri 34×36 (×32); Defter/Hesap `select` 42–43 px; `summary` "Yedekle ve geri yükle" 27 px, deney rehberi "Ne görmelisin" 26 px, "N. adımı uygula" 43×24; onay kutuları 20×20 (etiketle birlikte tıklanabilir). Alt sekmeler, üst bar ve hesap/defter girdileri ≥ 44.
- Kanıt: `erisim_cikti.txt`, `k24.js`: `["A","","Gördüm, deftere yaz",128,18,"defter-bag","none",…,"inline"]` (35 öğe).
- Önerilen düzeltme: `.defter-bag a { display:inline-block; padding: 3px 0 }` (≥ 24 px); 44 px hedefi isteniyorsa `::after` genişletmesi (`.marka`/`.geri` gibi).

### A4-13 · KÜÇÜK · hesap.js:20-22, 60
- Açıklama: Sayıya sığmayan girdi (`1e400`) `oku()`'da NaN'a çevrildiği için "Pozitif bir sayı yaz." deniyor; kullanıcı pozitif bir sayı yazmış. Çarpım taşınca kullanılan "Değer çok büyük: hesaplanamıyor." iletisi bu duruma uygun olanı.
- Kanıt: `hesap_tur.js`: `uzD 1e400 uzB km => Pozitif bir sayı yaz.` (karşılaştırma: `uzD 1e300 uzB pc => Değer çok büyük: hesaplanamıyor.`).
- Önerilen düzeltme: `oku()` sonsuzluk için ayrı bir işaret dönsün (ör. `Infinity`) ve kartlar "çok büyük" iletisini versin.

### A4-14 · KÜÇÜK · sw.js:23, 30, 50-57 (+ uygulama.js:442-453)
- Açıklama: Ağ-önce strateji + `skipWaiting()` + `clients.claim()`: yeni sürüm etkinleşince açık sayfa eski `uygulama.js`/`dersler.js` ile çalışmayı sürdürürken, sonradan tembel yüklenen dosyalar (`cizim*.js`, `deney/*.js`, `veri/*.json`) yeni sürümden geliyor. Uygulama "Urania güncellendi. Yenile" şeridini gösteriyor ama yenilenene kadar karışık sürüm çalışıyor. (Somut bir kırılma gözlemedim; yalnız karışmanın gerçekleştiği kanıtlandı.)
- Kanıt: `sw_test.js`: v39 sayfası açıkken sunucu v40'a geçirilip `update()`:
  ```
  güncelleme: controllerchange
  karışık sürüm: __surumA (eski uygulama.js) = uygulama-A | __surumB (yeni cizim.js) = cizim-B | dersler.json __surum = B
  ```
- Önerilen düzeltme: `controllerchange`'den sonra tembel yüklemeden önce otomatik yenileme (kullanıcı formda değilse) ya da SW'nin sürüm değişince eski sayfaya eski önbellekten hizmet vermesi (`skipWaiting`'i şeritteki "Yenile"ye bağlamak).

## Askıda
- **Wien kartında 10 pm altı "X ışını" etiketi** (hesap.js:180): T = 10⁹ K için tepe 2,90 pm "X ışını bölgesinde" yazılıyor; birçok kaynak 10 pm altını gama ışını sayıyor, ama X ve gama aralıkları kaynağa göre çakışıyor (ayrım çoğu zaman kökene göre yapılıyor). İki bağımsız kaynakla kesin bir sınır gösteremediğim için bulgu yazmadım.
- **GPS yüksekliği −500 m altında gelirse** (uygulama.js:400): `yukseklik: Math.round(c.altitude)` hiç sınırlanmıyor; Astronomy Engine −500 m altını reddediyor (A4-01'deki çökme yolu). Gerçek bir cihazın bu değeri (elipsoit yüksekliği + GPS hatası) üretip üretmediğini kanıtlayamadım.
- **Açık tema**: uygulamada açık tema yok (`:root { color-scheme: dark }`, tek tema + kırmızı mod); denetim normal (koyu) ve kırmızı modda yapıldı. `prefers-color-scheme: light` ile ayrı deneme yapmadım.
- **DST'si olan dilimlerde var olmayan saat** (defter.js:107-114): Berlin 2026-03-29 02:30 → 03:30, New York 2026-03-08 02:30 → 01:30 (iki yön tutarsız). Kullanıcının dilimi (Europe/Istanbul) DST'siz olduğu ve var olmayan saat zaten geçersiz girdi olduğu için hata saymadım.

Not: sw_varliklar testindeki gezinti listesinde `#haber` yok (A4-02'nin yakalanmamasının nedeni). Sunucu `testler/sunucu.js` `.jpg` için MIME tanımlamıyor (`application/octet-stream`); test altyapısı, uygulamayı etkilemiyor.

## Düzeltmeler (2026-11-08, dal denetim-duzeltme)

| bulgu | ne yapıldı | test |
|---|---|---|
| A4-01 | `uygulama.js` `konum()`: `Number.isFinite` (dize/boolean enlem-boylam varsayılana döner), `yukseklik` sayı ve −500…100 000 m dışındaysa 0, `ad` dizeye çevrilir; GPS yüksekliği de aynı sınırdan geçer (askıdaki "−500 m altı GPS" maddesi de kapandı). `defter.js` `otomatik()`: gözlemci/Ay hesabı try içinde, hesaplanamazsa kayıt gök durumu olmadan yapılır. | kabuk: A4-01 |
| A4-02 | `sw.js`: haber görselleri sürümden bağımsız `urania-haber-gorsel` önbelleğine (görüntülenince); activate'teki eski önbellek silme süzgecinden açıkça hariç. Budama iki yerde: ağdan taze `veri/haberler.json` her geldiğinde (haberler SURUM artmadan haftalık değişebilir; uygulamanın gösterdiği liste tam budur) ve activate'te yeni sürüm önbelleğindeki haberler.json ile (kurulumda `cache:'reload'` ile taze). Liste okunamazsa (bozuk JSON, `haberler` dizisi yok) hiçbir şey silinmez. `tani.js` raporu görsel önbelleğini sürümden ayrı yazar. `sw_varliklar` gezintisine `#haber` eklendi. | haber_gorsel_onbellek (4 senaryo), sw_varliklar |
| A4-03 | `BOLUM_AD.haber = 'Haberler'`; adı yazılmamış bölüm "undefined" demez. | kabuk: A4-03 |
| A4-04 | `uygulama.js` `oku/yaz/sil`: yazılamayan değer oturum boyunca bellekte tutulur, `oku` önce belleğe bakar (haber filtresi, kırmızı mod, ar.js sesli AR, dersler.js sesli kart aynı yoldan düzeldi). | kabuk: A4-04 ×2 |
| A4-05 | `tani.js`: uydu satırları tek tek güvenli üretilir, geçersiz tarih "—", `diziler` içindeki null öğeler süzülür; Kopyala/Yenile `rapor()` hatasını durum satırına yazar. | kabuk: A4-05/09 |
| A4-06 | `bilimsel()`: yuvarlanmış mantis ≥ 10 ise m/10, üs+1. | kabuk: A4-06 |
| A4-07 | `defter.js`: `Date.UTC` yerine yılı `setUTCFullYear` ile kuran `utc()`; ayrıca forma geri yazarken dakika yerel saatte yuvarlanır (1910 öncesi İstanbul ofseti saniyeli: 22:00 → 21:59 görünüyordu). | kabuk: A4-07 |
| A4-08 | Yedekteki `zaman` ISO 8601 desenine uymalı. | kabuk: A4-08 |
| A4-09 | Tanı raporu `U.diziOku('defter').length`. | kabuk: A4-05/09 |
| A4-10 | `haberler.js`: `decodeURIComponent` try içinde. | kabuk: A4-10 |
| A4-11 | `.unite-no { color: var(--soluk) }`. | kabuk: A4-11 |
| A4-12 | `.defter-bag a { display:inline-block; padding:3px 0 }` (≥ 24 px). | kabuk: A4-12 |
| A4-13 | `hesap.js`: sayı biçiminde ama sığmayan girdi işaretlenir, kart "Değer çok büyük: hesaplanamıyor." der. | kabuk: A4-13 |
| A4-14 | Küçük güvenli düzeltme: `controllerchange` sonrası sayfa arka plandaysa ve görünen bir form yoksa kendiliğinden yenilenir; görünürse şerit + bir sonraki arka plana geçişte yenileme. Kök neden (ağ-önce strateji: sunucu güncellenince eski SW bile yeni dosyaları verir) mimari; sürüm-tutarlı önbellek-önce strateji ASKIDA. | kabuk: A4-14 |
