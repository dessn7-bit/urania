# Kavuşumlar: terim, yöntem, kaynaklar ve karşılaştırma (7 Kasım 2026)

Sürüm v42'de Gökyüzü sekmesine eklenen "kavuşum" olaylarının (iki gök cisminin yakın görünmesi) kaynak kaydı.
Kod: gok.js `kavusumlar` / `kavusumGorus` / `olaylar`; gösterim gozlem.js ve plan.js; testler testler/kavusum.spec.js.

## 1. Terim

| Terim | Kaynak | Kaynaktaki ifade |
|---|---|---|
| kavuşum | TÜBA Türkçe Bilim Terimleri Sözlüğü, Doğa Bilimleri, alan: astronomi — http://terim.tuba.gov.tr/ATS/index.php/w_anasayfa (arama "kavuşum" ve "conjunction", 7 Kasım 2026; ham sayfalar arastirma/kavusum/tuba_kavusum_2026-11-07.html, tuba_conjunction_2026-11-07.html) | "kavuşum (doğa.) (Alm. Konjunktion, f; Fr. conjonction, f; İng. conjunction) ast. 1. Bir gözlem noktasına göre iki gökcisminin gökküre üzerindeki görüntülerinin birbirine en fazla yaklaştığı andaki konumları. 2. Yer'den bakıldığında bir Güneş Sistemi üyesinin uzanım açısının 0 0 olduğu andaki yani Güneş Sistemi üyesinin gözlemciye göre Güneş ile aynı hizada bulunduğu andaki konumu." İlgili maddeler: alt kavuşum (inferior conjunction), üst kavuşum (superior conjunction), kavuşum ayı (synodic month), kavuşum periyodu (synodic period). |
| kavuşum | TDK Güncel Türkçe Sözlük — https://sozluk.gov.tr/gts?ara=kavu%C5%9Fum (ham yanıt arastirma/kavusum/tdk_kavusum_2026-11-07.json) | "isim, gök bilimi: Yer yuvarlağı bir uçta kalmak üzere, yerin, Güneş'in ve herhangi bir gezegenin bir doğru üzerine gelmeleri; içtima". Birleşikler: kavuşum dönemi, alt kavuşum, üst kavuşum. |

Seçim: **kavuşum**. TÜBA'nın 1. anlamı tam olarak uygulamadaki olayı (iki cismin görüntülerinin en çok yaklaştığı an) tanımlıyor;
TDK yalnız Güneş'le hizalanma anlamını veriyor ama aynı sözcüğü gök bilimi terimi olarak kaydediyor. Uygulama metinlerinde
"X ile Y kavuşumu" denir; 1° ve altı "çok yakın" diye işaretlenir. Sözlüğe (arastirma/sozluk_ek.json → veri/sozluk.json)
TÜBA ve TDK kaynaklarıyla eklendi; eski Wikipedia tanımı kaynak olarak kaldı.

## 2. Yöntem

- Çiftler: Ay ile Merkür, Venüs, Mars, Jüpiter, Satürn (5); bu beş gezegen kendi aralarında (10); bir gezegenle Ülker (M45),
  Arıkovanı (M44) ya da 1,5 kadirden parlak 23 yıldız (veri/hedefler.json, veri/yildizlar.json; adlar IAU WGSN).
- Ölçüt: yer merkezli görünen açısal ayrımın en küçük olduğu an. Konumlar Astronomy Engine 2.1.19 `GeoVector(…, aberration=true)`
  (ışık süresi + aberasyon), ayrım `AngleBetween`. Sabit hedef için `DefineStar` (kullanıcı yıldızı; aynı düzeltmeler).
- Eşik 6,4°: 7×50 dürbünün görüş alanı (gok.js `DURBUN_ALANI`; bulucu.js aynı değeri buradan alır; üretici kaynakları bulucu.js
  notunda). 1° ve altı "çok yakın".
- Arama: kaba tarama — Ay'lı çiftlerde 1 saat, ötekilerde 6 saat adım (saatlik vektörler bir kez hesaplanır); yerel en küçük
  bulununca `A.Search` ile ayrımın değişim hızının (f(t+δ) − f(t−δ), δ = 1 dk Ay'lı / 10 dk öteki) eksiden artıya geçtiği an,
  1 sn hassasiyet. 120 gün ≈ 1 sn (Node).
- Yerel görünürlük (gok.js `kavusumGorus`): en yakın anın ±1 günü, 5 dk adım; iki cisim ≥ 10° yükseklikte ve Güneş ≤ −6°.
  Geçerli anlar pencerelere ayrılır; en yakın ana en yakın pencere seçilir. Pencere içinde karanlık yüksekliğe tercih edilir
  (`gorusAniSec`, v43): önce tam karanlık anlar (Güneş ≤ −18°); pencerede yoksa Güneş ≤ −12°, o da yoksa ≤ −6° anlar.
  Seçilen küme içinde Ay'lı çiftte ayrımın en küçük olduğu an; öteki çiftlerde ikisinin de en yüksek olduğu an. Görüş anındaki
  ayrım 6,4°'yi aşıyorsa olay buradan "yakın görünmüyor" sayılır ve listeye girmez.
- Metin (gozlem.js `kavusumMetni`, v43): her zaman önce en yakın anın günü ve saati, sonra buradan en iyi görüş anı ve o andaki
  gök ("gök tam karanlık" / "gök neredeyse karanlık" / "alacakaranlıkta", Güneş'in ufkun kaç derece altında olduğu).
- v43 düzeltmesi (Kaan'ın örneği): Mars–Jüpiter 16.11.2026, İstanbul. En yakın an uygulamada 05.03 TSİ (Horizons 02:04:50 UT = 05.04,8 TSİ; fark testte 3 dakika toleransla kabul; o anda
  iki gezegen ≈50° yükseklikte, Güneş −31°, tam karanlık). Eski kural (Güneş ≤ −12° anlar arasında en yüksek) 06.43 TSİ'yi
  öneriyordu: Güneş −12,5° (görevde −12,6° yazıyordu; Astronomy Engine, kırılmalı), gök tam kararmış değil. Yeni kural 06.13 TSİ'yi verir: Güneş −18,1°, iki gezegen ≈59°.
  Denetim: testler/kavusum.spec.js (Güneş yüksekliği node_modules Astronomy Engine'den, gezegen yükseklikleri Horizons
  RA/Dec'inden). −12° basamağı örneği: Ay–Jüpiter 12.05.2027, 55,0 K 12,0 D (pencerede Güneş −18°'ye inmiyor);
  −6° basamağı örneği: Venüs–Spica 09.11.2026, İstanbul (Güneş −6,8°; pencerede −12°'ye inmiyor).
- Gösterim: Gökyüzü ▸ Yaklaşan olaylar (ayrım, yön, yükseklik; "çok yakın" rozeti; Takvime ekle .ics), Bu gecenin planı
  (görüş saatinde; sesli okuma metni aynı sayılardan), hiçbir sayı sabit yazılmaz. Ay'ın gezegeni örtmesi (ortme.js)
  listedeyse aynı Ay–gezegen yaklaşması kavuşum olarak ikinci kez yazılmaz (`kavusumOrtmeyleAyni`).

## 3. JPL Horizons karşılaştırması (6 olay)

Kaynak: https://ssd.jpl.nasa.gov/api/horizons.api — EPHEM_TYPE=OBSERVER, CENTER='500@399' (yer merkezi), QUANTITIES='2'
(görünen RA/Dec, havasız), STEP_SIZE='1 m', ANG_FORMAT=DEG, EXTRA_PREC=YES; her cisim için ±3 saatlik pencere.
Ham yanıtlar: testler/veri/kavusum/horizons/*_a.txt, *_b.txt. En küçük ayrım dakikalık diziden, an üç noktalı parabolle
inceleştirildi (testler/kavusum.spec.js `horizonsEnYakin`). Tolerans: ayrım 0,02°, zaman 30 dk.

| Olay | Horizons en yakın an (UT) | Horizons ayrım | Urania an (UT) | Urania ayrım | Fark (an / ayrım) |
|---|---|---|---|---|---|
| Mars–Jüpiter | 2026-11-16 02:04:50 | 1,1933° | 2026-11-16 02:03:12 | 1,1937° | 1,6 dk / 0,0004° |
| Ay–Jüpiter | 2026-11-30 08:25:07 | 1,0528° | 2026-11-30 08:25:05 | 1,0524° | 0,0 dk / 0,0004° |
| Ay–Venüs | 2027-03-04 20:33:18 | 1,9900° | 2027-03-04 20:33:20 | 1,9899° | 0,0 dk / 0,0001° |
| Merkür–Satürn | 2027-04-19 12:35:19 | 0,5637° | 2027-04-19 12:34:07 | 0,5626° | 1,2 dk / 0,0011° |
| Venüs–Satürn | 2027-05-07 18:44:17 | 0,6050° | 2027-05-07 18:40:48 | 0,6041° | 3,5 dk / 0,0009° |
| Venüs–Jüpiter | 2027-08-26 02:57:14 | 0,4949° | 2027-08-26 02:57:08 | 0,4951° | 0,1 dk / 0,0002° |

Sonuç: en büyük ayrım farkı 0,0011°, en büyük zaman farkı 3,5 dk (Venüs–Satürn'ün düz minimumu). Görevdeki değer
(Mars–Jüpiter 1,19°, ≈02.00 UT) doğrulandı.

## 4. CycleCalcs karşılaştırması (1 Kasım 2026 – 30 Kasım 2027)

Kaynak: https://www.cyclecalcs.com/v2/conjunctions (belge: /v2, /v2/openapi.json — kopyası arastirma/kavusum/cyclecalcs_openapi_2026-11-07.json).
Parametreler: `frame=apparent` (yer merkezli görünen ayrım), `max_separation_deg=6.4`, `start=2026-11-01`, `end=2027-11-30`
(pencere 30 Kas 2027 00:00 UT'de biter), `sort=time`, konum verilmedi. CycleCalcs de Astronomy Engine 2.1.19 kullanır
(yanıt meta.engine); `pairs` en çok 512 karakter olduğundan yıldız çiftleri yıldız başına ayrı istekle alındı.
İstekler: `bodies=moon,mercury,venus,mars,jupiter,saturn` (15 çift) ve her yıldız için
`pairs=mercury-star:X,venus-star:X,mars-star:X,jupiter-star:X,saturn-star:X` (X = aldebaran, regulus, spica, antares, pollux,
alcyone). Ham yanıtlar testler/veri/kavusum/cyclecalcs/*.json. CycleCalcs'ın yıldız kümesinde M44 yok; Ülker için en
yakın karşılık Alcyone yıldızı (M45 merkezinden 0,25° ötede). CycleCalcs uygulamaya eklenmedi; yalnız test karşılaştırması.

Sonuç (testler/kavusum.spec.js):
- CycleCalcs 87 yaklaşma buldu (66 Ay/gezegen + 21 gezegen–yıldız); **87'si de Urania'da var** (aynı çift, 6 saat içinde). Kaçan yok.
- Eşleşenlerde fark: Ülker dışındaki 85 çiftte ayrım ≤ 0,001°, an ≤ 13,2 dk (en büyüğü Jüpiter–Regulus 27 Tem 2027, iki
  cismin göreli hızı çok düşük: düz minimum). Ülker'de (Merkür 9 May 2027, Venüs 8 Haz 2027) ayrım 0,08° ve an 2,8–4,7 saat
  farklı: CycleCalcs Alcyone'u, Urania M45 merkezini alır.
- Urania'da olup CycleCalcs'ta olmayan 4 olay, hepsi gerekçeli: (a) Ay–Mars 30 Kas 2027 08:14 UT ve Ay–Venüs 30 Kas 2027
  13:36 UT — CycleCalcs penceresi 30 Kas 00:00'da bittiği için dışarıda; (b) Venüs–Arıkovanı 2 Ağu 2027 ve Merkür–Arıkovanı
  6 Ağu 2027 — CycleCalcs'ta M44 yok.
- Kapsam farkı (karşılaştırmaya girmeyen): CycleCalcs Uranüs/Neptün ve Güneş'i de arayabilir; Urania kapsamı görevdeki
  beş gezegen ve Ay'dır. Yıldız seti: Urania 1,5 kadirden parlak 23 yıldız (Pollux 1,16 dahil, Castor 1,58 dışarıda);
  CycleCalcs'ın 80 yıldızından tutuluma yakın beşi (Aldebaran, Regulus, Spica, Antares, Pollux) ortak; öteki parlak
  yıldızlar (Sirius, Vega, …) tutulumdan uzak olduğundan 6,4° içine zaten girmez.

## 5. Kasım 2026 – Mayıs 2027 kavuşum listesi (İstanbul 41,0 K 29,1 D; saatler TSİ)

Hesap: gok.js `kavusumlar(2026-11-01, 212 gün)`; "buradan" sütunu `kavusumGorus` kuralıyla (v43: karanlık yüksekliğe tercih
edilir; tablo bu kuralla yeniden üretildi). "Görülmez" satırlar uygulamada listelenmez.

| En yakın an (TSİ) | Olay | Ayrım | Buradan |
|---|---|---|---|
| 02.11.2026 16:39 | Ay ile Mars kavuşumu (çok yakın) | 0,97° | en iyi görüş 02.11.2026 05:59: 6,00°, 56° yükseklikte, güneydoğu, tam karanlık |
| 03.11.2026 01:45 | Ay ile Jüpiter kavuşumu (çok yakın) | 0,48° | en iyi görüş 03.11.2026 02:15: 0,56°, 10° yükseklikte, doğu, tam karanlık |
| 07.11.2026 13:42 | Ay ile Venüs kavuşumu (çok yakın) | 0,95° | en iyi görüş 07.11.2026 07:07: 3,70°, 11° yükseklikte, güneydoğu, Güneş −6,3° |
| 08.11.2026 15:32 | Ay ile Merkür kavuşumu | 5,65° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 09.11.2026 14:16 | Venüs ile Spica kavuşumu | 1,16° | en iyi görüş 09.11.2026 07:06: 1,17°, 12° yükseklikte, güneydoğu, Güneş −6,8° |
| 16.11.2026 05:03 | Mars ile Jüpiter kavuşumu | 1,19° | en yakın anda görülür; en iyi görüş 16.11.2026 06:13: 1,19°, 59° yükseklikte, güneydoğu, tam karanlık |
| 20.11.2026 23:03 | Ay ile Satürn kavuşumu | 6,06° | en yakın anda görülür; en iyi görüş 20.11.2026 23:03: 6,06°, 46° yükseklikte, güneybatı, tam karanlık |
| 26.11.2026 08:23 | Mars ile Regulus kavuşumu | 1,72° | en iyi görüş 26.11.2026 06:18: 1,72°, 60° yükseklikte, güney, tam karanlık |
| 30.11.2026 11:25 | Ay ile Jüpiter kavuşumu | 1,05° | en iyi görüş 30.11.2026 06:25: 3,08°, 62° yükseklikte, güney, tam karanlık |
| 30.11.2026 19:55 | Ay ile Mars kavuşumu | 3,00° | en iyi görüş 01.12.2026 01:20: 4,25°, 11° yükseklikte, doğu, tam karanlık |
| 07.12.2026 22:49 | Ay ile Merkür kavuşumu | 5,70° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 12.12.2026 23:10 | Jüpiter ile Regulus kavuşumu | 3,21° | en iyi görüş 13.12.2026 05:45: 3,21°, 61° yükseklikte, güney, tam karanlık |
| 13.12.2026 08:25 | Merkür ile Antares kavuşumu | 4,67° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 18.12.2026 07:37 | Ay ile Satürn kavuşumu | 6,17° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 27.12.2026 19:26 | Ay ile Jüpiter kavuşumu | 1,38° | en iyi görüş 27.12.2026 23:01: 2,56°, 10° yükseklikte, doğu, tam karanlık |
| 28.12.2026 16:29 | Ay ile Mars kavuşumu | 4,74° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 08.01.2027 08:17 | Ay ile Merkür kavuşumu (çok yakın) | 0,48° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 14.01.2027 16:31 | Ay ile Satürn kavuşumu | 6,31° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 24.01.2027 02:21 | Ay ile Jüpiter kavuşumu | 1,36° | en yakın anda görülür; en iyi görüş 24.01.2027 02:21: 1,36°, 61° yükseklikte, güney, tam karanlık |
| 25.01.2027 01:49 | Ay ile Mars kavuşumu | 5,75° | en yakın anda görülür; en iyi görüş 25.01.2027 01:49: 5,75°, 49° yükseklikte, güneydoğu, tam karanlık |
| 08.02.2027 06:55 | Ay ile Merkür kavuşumu (çok yakın) | 0,32° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 11.02.2027 02:14 | Ay ile Satürn kavuşumu | 6,40° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 20.02.2027 07:57 | Ay ile Jüpiter kavuşumu | 1,09° | en iyi görüş 20.02.2027 06:12: 1,54°, 13° yükseklikte, batı, tam karanlık |
| 20.02.2027 22:43 | Ay ile Mars kavuşumu | 5,33° | en yakın anda görülür; en iyi görüş 20.02.2027 22:43: 5,33°, 45° yükseklikte, güneydoğu, tam karanlık |
| 21.02.2027 09:20 | Mars ile Regulus kavuşumu | 3,99° | en iyi görüş 21.02.2027 01:10: 3,99°, 61° yükseklikte, güney, tam karanlık |
| 04.03.2027 23:33 | Ay ile Venüs kavuşumu | 1,99° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 06.03.2027 09:32 | Ay ile Merkür kavuşumu | 1,11° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 19.03.2027 12:26 | Ay ile Jüpiter kavuşumu (çok yakın) | 0,87° | en iyi görüş 19.03.2027 20:51: 5,18°, 51° yükseklikte, güneydoğu, tam karanlık |
| 19.03.2027 18:43 | Ay ile Mars kavuşumu | 3,89° | en iyi görüş 19.03.2027 20:53: 4,11°, 51° yükseklikte, güneydoğu, tam karanlık |
| 31.03.2027 08:29 | Mars ile Jüpiter kavuşumu | 4,29° | en iyi görüş 30.03.2027 21:49: 4,29°, 66° yükseklikte, güney, tam karanlık |
| 04.04.2027 06:33 | Ay ile Venüs kavuşumu | 2,92° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 05.04.2027 07:23 | Ay ile Merkür kavuşumu | 5,33° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 15.04.2027 17:19 | Ay ile Jüpiter kavuşumu (çok yakın) | 0,92° | en iyi görüş 15.04.2027 21:29: 2,62°, 62° yükseklikte, güney, tam karanlık |
| 16.04.2027 01:44 | Ay ile Mars kavuşumu | 2,98° | en yakın anda görülür; en iyi görüş 16.04.2027 01:44: 2,98°, 23° yükseklikte, batı, tam karanlık |
| 19.04.2027 15:34 | Merkür ile Satürn kavuşumu (çok yakın) | 0,56° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 04.05.2027 11:44 | Ay ile Venüs kavuşumu | 6,03° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 07.05.2027 07:49 | Ay ile Merkür kavuşumu | 3,79° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 07.05.2027 21:40 | Venüs ile Satürn kavuşumu (çok yakın) | 0,60° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 09.05.2027 08:49 | Merkür ile Ülker kavuşumu | 2,67° | görülmez (ufkun altında ya da gündüz; görülebilir anlarda ayrım 6,4°'den büyük ya da Güneş'e yakın) |
| 13.05.2027 00:52 | Ay ile Jüpiter kavuşumu | 1,23° | en yakın anda görülür; en iyi görüş 13.05.2027 00:52: 1,23°, 11° yükseklikte, batı, tam karanlık |
| 13.05.2027 20:04 | Ay ile Mars kavuşumu | 2,98° | en iyi görüş 13.05.2027 22:09: 3,20°, 45° yükseklikte, güneybatı, tam karanlık |
| 15.05.2027 13:28 | Mars ile Regulus kavuşumu | 1,23° | en iyi görüş 15.05.2027 22:13: 1,24°, 46° yükseklikte, güneybatı, tam karanlık |

## 6. Yeniden alınan konum referansları (gizlilik, ev konumunun ilçe düzeyine yuvarlanması)

| Kaynak | Eski (41,0046 K 29,0762 D) | Yeni (41,0 K 29,1 D) | Dosya |
|---|---|---|---|
| Skyfield 1.x + DE421 + Hipparcos, Ay örtmeleri (5 yıldız) | ör. Taygeta 23:21:31 / 23:46:12 UT | 23:21:33 / 23:46:15 (öteki dört: ortme.spec.js); yöntem eski konumda eski değerleri ≤1 sn içinde yeniden üretti | testler/ortme.spec.js |
| Skyfield 1.x + DE421, ISS 2026-10-30 03:58 UT (fikstür OMM) | yükseklik 33,92°, azimut 312,77° | 33,82°, 312,69° | testler/ar.spec.js |
| NOAA WMM-2025 hesaplayıcısı, 2026-10-27 | +6,09° | 6,08942° (+6,09°) | testler/ar.spec.js, arastirma/noaa_wmm_41.0_29.1_2026-10-27.json |
| Heavens-Above PassSummary + orbit (TLE), 7 Kas 2026 | 27 Eki–5 Kas tablosu (14+14 geçiş) | 7–17 Kas: ISS 9 görünür geçiş (±0,05 kadir), Tiangong 1 geçiş (fark 0,28 kadir, 12° alçak geçiş) | testler/uydu.spec.js, testler/veri/ha_2026-11-07_41.0_29.1.json, arastirma/heavens_above/*20261107* |
| Python vektör hesabı (d23 Türksat örneği) | 37.726 km, 40,8°, 160,7° | 37.725 km, 40,8°, 160,8° | arastirma/dersler_v2/d23.json, d23_kaynak.md |
| Heavens-Above ISS tablosu (d3 dersi) | 27 Eki–5 Kas: 14 sabah geçişi, en parlak −3,7 | 10–16 Kas: 9 akşam geçişi, en parlak −3,9 | arastirma/dersler_v2/d3.json, d3_kaynak.md |

USNO ve IOTA-ES/Occult referansları eski konuma bağlı değildi (Kadıköy 40,99/29,03, Frankfurt, Toronto…); dokunulmadı.
Eski commit'lerde eski koordinat ve mahalle adı durmaktadır (git geçmişi yeniden yazılmadı).
