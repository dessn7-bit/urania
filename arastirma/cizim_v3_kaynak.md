# cizim_v3.js — d20–d24 ders çizimlerinin kaynakları

Tarih: 2026-10-28. Her satır: çizim | değer | kaynak/hesap.
"Ders" = veri/dersler.json'daki metin (kendi kaynakları arastirma/dersler_v2/dNN_kaynak.md'de).
"AE" = Astronomy Engine (lib/astronomy.browser.min.js, gok.js'in ΔT ayarıyla Node'da çalıştırıldı); hesap betikleri oturum karalama klasöründeydi, yöntem aşağıda yazılı.
"Katalog" = veri/yildizlar.json (d3-celestial stars.6.json, J2000; adlar IAU WGSN).

Bölüm dizinleri `python3 araclar/ders_verisi_v2.py` sonrası veri/dersler.json'daki güncel dizinlerdir.

## d20 · Astronominin kısa tarihi

| çizim | değer | kaynak/hesap |
|---|---|---|
| d20-zaman-cizelgesi (bölüm 0) | Babil astronomik günlükleri ≈ MÖ 652–61 | Ders bölüm 1 (Wikipedia: Astronomical Diaries) |
| d20-zaman-cizelgesi | Aristarkhos ≈ MÖ 310–230 | Ders bölüm 4 |
| d20-zaman-cizelgesi | Eratosthenes ≈ MÖ 276–194 | Ders bölüm 3 |
| d20-zaman-cizelgesi | Hipparkhos kataloğu ≈ MÖ 135 | Ders bölüm 5 |
| d20-zaman-cizelgesi | Almagest ≈ MS 150 | Ders bölüm 6 |
| d20-zaman-cizelgesi | el-Battani, Rakka gözlemleri 877–918 | Ders bölüm 7 (MacTutor) |
| d20-zaman-cizelgesi | el-Biruni 973–1048 | Ders bölüm 8 |
| d20-zaman-cizelgesi | Uluğ Bey, Zîc-i Sultânî 1437 | Ders bölüm 9 |
| d20-zaman-cizelgesi | De revolutionibus 1543 | Ders bölüm 11 |
| d20-zaman-cizelgesi | Uraniborg 1576–1580 | Ders bölüm 12 |
| d20-zaman-cizelgesi | İstanbul Rasathanesi 1577–1580 (yıkım 22 Ocak 1580) | Ders bölüm 10 (TDV) |
| d20-zaman-cizelgesi | Astronomia nova (Kepler'in birinci yasası) 1609 | Ders bölüm 14 |
| d20-zaman-cizelgesi | Sidereus Nuncius 1610 | Ders bölüm 13 |
| d20-zaman-cizelgesi | Principia 1687 | Ders bölüm 14 |
| d20-zaman-cizelgesi | Kopernik'ten Newton'a 144 yıl | hesap: 1687 − 1543 |
| d20-zaman-cizelgesi | eksen ölçekli (MÖ 700–MS 1700, çentik 300 yıl); yazılar yana açıldı | çizim kararı; açıklamada söylendi |
| d20-eratosthenes (bölüm 3) | gölge açısı 7,2° = 360°/50 | Ders bölüm 3; hesap 360 / 7,2 = 50 |
| d20-eratosthenes | 5000 stadion, 250.000 stadion | Ders bölüm 3; hesap 50 × 5000 |
| d20-eratosthenes | stadion 155–185 m → ≈ 39.000–46.000 km | Ders bölüm 3 örneği (Paris Gözlemevi sözlüğü, Wikipedia: Earth's circumference): 252.000 × 155 = 39.060 km; 250.000 × 185 = 46.250 km |
| d20-eratosthenes | kutup çevresi 40.008 km | Ders bölüm 3 (40.007,863 km) |
| d20-eratosthenes | 7,2° açılar gerçek açıyla çizildi; Dünya'nın boyu ve çubuklar şematik | çizim kararı; açıklamada "şematik" |
| d20-aristarkhos (bölüm 4) | θ = 87°, Güneş/Ay = 1/cos 87° ≈ 19,1 | Ders bölüm 4 örneği; hesap |
| d20-aristarkhos | 86° → 14,3; 88° → 28,7; 89,85° → 382 | Ders bölüm 4 örneği; hesap 1/cos θ (çizimde yeniden hesaplanır) |
| d20-aristarkhos | üçgen 87° ile ölçekli (Dünya–Ay 19,6 birim, Dünya–Güneş 19,6/cos 87°) | hesap |

## d21 · Takımyıldızlar ve mevsimlerin gökyüzü

| çizim | değer | kaynak/hesap |
|---|---|---|
| d21-tutulum-takvimi (bölüm 5) | Güneş'in IAU takımyıldızlarına girişi 2026, TRT: Oğlak 20 Oca 06:00, Kova 16 Şub 16:00, Balıklar 12 Mar 18:00, Koç 19 Nis 06:00, Boğa 14 May 18:00, İkizler 22 Haz 01:00, Yengeç 21 Tem 06:00, Aslan 11 Ağu 05:00, Başak 17 Eyl 06:00, Terazi 31 Eki 18:00, Akrep 23 Kas 21:00, Yılancı 30 Kas 09:00, Yay 18 Ara 17:00 | AE: 2026 boyunca saatlik `Equator(Sun, J2000)` + `Constellation()`; ders bölüm 5'teki tarihlerle birebir aynı |
| d21-tutulum-takvimi | burç (tropik, 30°) girişleri 2026, TRT: Kova 20 Oca 04:44, Balık 18 Şub 18:51, Koç 20 Mar 17:45, Boğa 20 Nis 04:39, İkizler 21 May 03:37, Yengeç 21 Haz 11:25, Aslan 22 Tem 22:13, Başak 23 Ağu 05:19, Terazi 23 Eyl 03:05, Akrep 23 Eki 12:38, Yay 22 Kas 10:23, Oğlak 21 Ara 23:50 | AE: `SearchSunLongitude(k × 30°)`; Akrep 23 Ekim ders bölüm 5 örneğindeki Belçika Kraliyet Gözlemevi tarihiyle aynı |
| d21-tutulum-takvimi | Akrep ≈ 6,5 gün, Başak 44 gün, Yılancı ≈ 18 gün | hesap yukarıdaki girişlerden; ders bölüm 5 |
| d21-tutulum-takvimi | ≈ 1 ay kayma (Koç burcu 20 Mar, Koç takımyıldızı 19 Nis) | ders bölüm 5; yukarıdaki hesap |
| d21-tutulum-takvimi | 28 Ekim çizgisi | ders bölüm 5 örneği |
| d21-kutup-atlama (bölüm 8) | yıldız konumları (Dubhe, Merak, Phecda, Megrez, Alioth, Mizar, Alkaid, Polaris, Caph, Schedar, γ Cas (WGSN: Tiansi), Ruchbah, Segin) | Katalog |
| d21-kutup-atlama | Merak–Dubhe 5,37°, Dubhe–Polaris 28,71°, Polaris–Schedar 32,81° | hesap: katalogdan küresel açı; ders bölüm 8 örneğiyle aynı (5,4 / 28,7 / 32,8) |
| d21-kutup-atlama | dönüş: 15 Ekim 2026 22:00 TRT İstanbul (41,01° K, 28,955° D) yerel yıldız zamanı 22,5519 sa = 338,28° | AE `SiderealTime` + boylam/15; denetim: o an Dubhe yüksekliği 12,9° (ders bölüm 8: "15 Ekim'de kuzeyde 13°"), Schedar 64,0° (ders: 64°) |
| d21-kutup-atlama | 10° ≈ yumruk | ders bölüm 8 (d11) |
| d21-kutup-atlama | izdüşüm kutup merkezli stereografik; kenarda boy büyümesi yüzde birkaç (30°'de sec²15° ≈ 1,07) | hesap; açıklamada söylendi |
| d21-arcturus-spica (bölüm 10) | Alkaid–Arcturus 30,66°, Arcturus–Spica 32,79° | hesap: katalog; ders bölüm 10 (30,7 / 32,8) |
| d21-arcturus-spica | Arcturus −0,05, Spica 0,98 kadir; oran ≈ 2,6 | Katalog; ders bölüm 10 örneği |
| d21-arcturus-spica | doruk: Arcturus 68° (68,2), Spica 37,8° | ders bölüm 10 |
| d21-arcturus-spica | izdüşüm stereografik, merkez SA 200° / DA +22°, kuzey yukarıda, doğu solda; kavis eğrisi çizim (sapın yönünü sürdüren ikinci derece eğri) | çizim kararı; açıklamada söylendi |

## d22 · Zaman, takvim ve gökyüzü

| çizim | değer | kaynak/hesap |
|---|---|---|
| d22-yildiz-gunes-gunu (bölüm 0) | yıldız günü 23 sa 56 dk 4 sn; güneş günü ortalama 24 sa | ders bölüm 0 |
| d22-yildiz-gunes-gunu | günlük yörünge açısı 360/365,256 = 0,986°; × 4 dk/° = 3,94 dk ≈ 3 dk 56 sn | hesap; 365,256 gün NASA Earth Fact Sheet (ders bölüm 8, anahtar sayı d22n7) |
| d22-yildiz-gunes-gunu | çizimde açı 26°'ye büyütüldü | çizim kararı; açıklamada "şematik" |
| d22-zaman-denklemi (bölüm 1) | 2026 eğrisi, 4 günde bir (92 değer) | AE: Greenwich'te (0°, 0°) her gün 12:00 UT'de `HourAngle(Sun)`; ZD = saat açısı × 60 dk (görünür − ortalama) |
| d22-zaman-denklemi | uçlar: 3 Kas +16 dk 27 sn, 11 Şub −14 dk 11 sn, 13 May +3 dk 41 sn, 26 Tem −6 dk 34 sn; sıfırlar 15 Nis, 12–13 Haz, 1 Eyl, 24–25 Ara | AE hesabı (günlük örnek). Ders (Wikipedia) +16 dk 33 sn / −14 dk 6 sn / +3 dk 41 sn / −6 dk 30 sn veriyor; fark birkaç saniye, açıklamada söylendi |
| d22-zaman-denklemi | bileşenler −7,659 sin D ve 9,863 sin(2D + 3,5932), D = 6,24004077 + 0,01720197 × (J2000'den gün) | Wikipedia: Equation of time (WebFetch 2026-10-28, yaklaşık formül). Not: sayfadaki "365 × (y − 2000)" yerine gerçek gün sayısı (2026-01-01 = J2000 + 9497 gün) kullanıldı; böylece toplam AE eğrisinden en çok 0,95 dk sapıyor (365 ile 3,5 dk sapıyordu) |
| d22-zaman-denklemi | genlikler 7,66 ve 9,87 dk | ders bölüm 1 (Wikipedia) |
| d22-analemma (bölüm 2) | İstanbul 41,01° K, 28,955° D; yerel ortalama öğle 10:04:11 UT = 13:04 TRT | ders bölüm 3 (28,955°; 13:04); enlem d1 çiziminden (Wikipedia: Istanbul) |
| d22-analemma | 2026, 5 günde bir Güneş'in yüksekliği ve doğu-batı açısı (asin(cos h × sin(A − 180°))), kırılmasız | AE `Equator` + `Horizon` (refraction yok) |
| d22-analemma | en yüksek 72,42° (21 Haz), en alçak 25,55° (21 Ara), boy ≈ 47°, en ≈ 7,4° (−3,44° 11 Şub … +3,97° 3 Kas) | AE hesabı; ders bölüm 2 (72,4 / 25,6 / 47°) — ders 25,6 yazıyor, hesap 25,55 → çizimde 25,5 |
| d22-analemma | sağdaki kopya yatayda 4 kat büyütüldü | çizim kararı; çizimde ve açıklamada yazılı |

## d23 · Uzaya çıkmak

| çizim | değer | kaynak/hesap |
|---|---|---|
| d23-roket-denklemi (bölüm 1) | yakıt payı = 1 − e^(−Δv/v_e) | ders bölüm 1 (Wikipedia: Tsiolkovsky rocket equation) |
| d23-roket-denklemi | v_e 4,5 km/s, Δv 9,7 km/s → %88,4 | ders bölüm 1 örneği; çizimde yeniden hesaplanır |
| d23-roket-denklemi | v_e 3 km/s, Δv 9,4 km/s → %95,6 | ders bölüm 1 örneği; hesap |
| d23-yorunge-haritasi (bölüm 4) | Dünya yarıçapı 6371 km, GM 398.600 km³/s² | ders bölüm 3–4 (NASA Earth Fact Sheet) |
| d23-yorunge-haritasi | LEO < 2000 km, alt sınır ≈ 180 km; MEO LEO ile GEO arası, Galileo uyduları | ders bölüm 4 (ESA: Types of orbits) |
| d23-yorunge-haritasi | GEO 35.786 km; hız √(GM/42.157) = 3,07 km/s; 1 yıldız günü | ders bölüm 4; hesap |
| d23-yorunge-haritasi | 400 km'de 7,67 km/s | hesap √(GM/6771); ders bölüm 4 örneği |
| d23-yorunge-haritasi | Tiangong 382–386 km, ISS 415–424 km | ders bölüm 10 (Heavens-Above, Ekim 2026) |
| d23-yorunge-haritasi | Hubble 468–471 km | ders bölüm 4 (Heavens-Above) |
| d23-yorunge-haritasi | güneş eşzamanlı 600–800 km; İMECE 680 km | ders bölüm 6 (Wikipedia: Sun-synchronous orbit; TÜBİTAK) |
| d23-yorunge-haritasi | GEO yüksekliği / Dünya yarıçapı ≈ 5,6 | hesap 35.786 / 6371 |
| d23-yorunge-haritasi | üst kesit ölçekli; alt şerit 0–2000 km doğrusal büyütme | çizim kararı; açıklamada yazılı |
| d23-hohmann (bölüm 7) | Dünya 149,598, Mars 227,956 milyon km → 1,524 AB | ders bölüm 7 örneği (NASA fact sheets) |
| d23-hohmann | a = 1,262 AB; süre 0,5 × a^1,5 × 365,256 ≈ 259 gün | ders bölüm 7 örneği; hesap |
| d23-hohmann | Mars'ın dönemi 686,980 gün → 259 günde ≈ 136°, kalkışta önde 180 − 136 ≈ 44° | NASA Mars Fact Sheet "Sidereal orbit period (days) 686.980" (arastirma/gezegenler.json, d3_kaynak.md); hesap |
| d23-hohmann | Dünya varışta 259/365,256 × 360 ≈ 255° | hesap |
| d23-hohmann | elips yarı küçük ekseni b = √(1 × 1,524) AB | hesap (günberi × günöte) |
| d23-hohmann | Δv ≈ 4,3 km/s (LEO → aktarım), ≈ 0,9 km/s (Mars yakalanma) | ders bölüm 7 (Wikipedia: Delta-v budget) |
| d23-hohmann | diziliş ≈ 25,6 ayda bir | ders bölüm 7 (sinodik dönem 779,94 gün) |

## d24 · Gökyüzünü fotoğraflamak

| çizim | değer | kaynak/hesap |
|---|---|---|
| d24-durak (bölüm 1) | diyafram tam durakları f/2, 2,8, 4, 5,6, 8, 11, 16 | ders bölüm 1 (Wikipedia: F-number) |
| d24-durak | enstantane 1/500 … 1/8 (standart dizi, her adım ışığı kabaca iki katına çıkarır) | Wikipedia: Shutter speed (WebFetch 2026-10-28): "1⁄1000 s; 1⁄500 s; 1⁄250 s; 1⁄125 s; 1⁄60 s; 1⁄30 s; 1⁄15 s; 1⁄8 s …" ; "each increment roughly doubles the amount of light" |
| d24-durak | ISO 100 … 6400 (iki katlık adımlar) | ders bölüm 1 (ISO'yu iki katına çıkarmak bir durak); hesap 100 × 2ⁿ |
| d24-durak | f/8 + 1/250 = f/11 + 1/125; ISO 100 → 400 = 2 durak | ders bölüm 1 örneği |
| d24-yildiz-kaymasi (bölüm 7) | piksel ölçeği 74,4″ (24 mm eşdeğer, 4000 piksel) | ders bölüm 2 örneği |
| d24-yildiz-kaymasi | gök kayma hızı 15,04″/s × cos δ | ders bölüm 6 (NASA Earth Fact Sheet, 23,9345 sa) |
| d24-yildiz-kaymasi | δ = 0°, 41°, 80°; k = 1 ve 3 piksel | ders bölüm 6–7 |
| d24-yildiz-kaymasi | 500 kuralı 500/24 = 20,8 sn → 4,2 px; gece modu 16 sn → 3,2 px | ders bölüm 7 ve 11 örnekleri; hesap (çizimde yeniden hesaplanır) |
| d24-yiginlama (bölüm 10) | sinyal-gürültü oranı √N kat (9 → 3, 100 → 10) | ders bölüm 10 (PetaPixel) |
| d24-yiginlama | tek kare: karanlık 400/√800 ≈ 14,1; kent 400/√4000 ≈ 6,3 (dersin uydurma örneği) | ders bölüm 10 örneği; açıklamada "uydurma örnek" denildi |
| d24-yiginlama | kentte (14,1/6,3)² ≈ 5 kare; 16 kare → 25 | ders bölüm 10 örneği; hesap |
