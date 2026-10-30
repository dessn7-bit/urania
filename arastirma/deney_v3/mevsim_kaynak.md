# mevsim (Mevsimler ve Güneş'in yolu) — kaynak tablosu

Erişim: 2026-10-30. "Hesap" yazan satırlar kaynak değil: kaynaktaki sayılardan ve deneyin formüllerinden python3 ile (ve tarayıcıda deneyin kendi fonksiyonlarıyla) yeniden hesaplandı. Uygulamanın gök hesabı (Astronomy Engine, node_modules/astronomy-engine) ikinci denetim olarak kullanıldı.

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Eksen eğikliği 23,44° (varsayılan, hazır durumlar) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Obliquity to orbit (deg) 23.44" |
| Günberi uzaklığı ders d1: 147,095 milyon km; günöte 152,100 milyon km (ortalama değerler) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Perihelion (10^6 km) 147.095", "Aphelion (10^6 km) 152.100" |
| Günberi 3 Ocak 2026, 17.15 UT (= 20.15 Türkiye saati) | https://aa.usno.navy.mil/api/seasons?year=2026 | `{"day": 3, "month": 1, "phenom": "Perihelion", "time": "17:15", "year": 2026}` |
| Günöte 6 Temmuz 2026, 17.30 UT (= 20.30 Türkiye saati) | https://aa.usno.navy.mil/api/seasons?year=2026 | `{"day": 6, "month": 7, "phenom": "Aphelion", "time": "17:30", "year": 2026}` |
| 2026 günberi uzaklığı 147.099.894 km (ekranda 147,10 milyon km) | https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='399'&CENTER='500@10'&EPHEM_TYPE='VECTORS'&START_TIME='2026-01-03%2016:00'&STOP_TIME='2026-01-03%2019:00'&STEP_SIZE='30m'&VEC_TABLE='4'&OUT_UNITS='KM-S'&CSV_FORMAT='YES' | "A.D. 2026-Jan-03 17:00:00.0000, … 1.470998940854877E+08" ve "17:30 … 1.470998940596731E+08" (RG, km; en küçük değer 17.00–17.30 TDB arası) |
| 2026 günöte uzaklığı 152.087.774 km (ekranda 152,09 milyon km) | https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='399'&CENTER='500@10'&EPHEM_TYPE='VECTORS'&START_TIME='2026-07-06%2016:00'&STOP_TIME='2026-07-06%2019:00'&STEP_SIZE='30m'&VEC_TABLE='4'&OUT_UNITS='KM-S'&CSV_FORMAT='YES' | "A.D. 2026-Jul-06 17:30:00.0000, … 1.520877743213644E+08" |
| Uzaklık farkı %3,4, ışık farkı ≈ %7 (hesap) | — | 152.087.774 / 147.099.894 = 1,0339; 1,0339² = 1,0690 (ders d1: "(152,100 ÷ 147,095)² ≈ 1,069") |
| Model uzaklığı 3 Ocak 10.04 UT: 147,1 milyon km (rehber adım 3) | https://aa.usno.navy.mil/faq/sun_approx | "R = 1.00014 – 0.01671 cos g – 0.00014 cos 2g"; hesap 0,983290 AB × 149.597.870,7 km = 147.098.134 km (JPL ile fark 1.800 km) |
| Haziran gündönümü 21 Haziran 2026 08.24 UT (= 11.24 Türkiye saati) | https://aa.usno.navy.mil/api/seasons?year=2026 | `{"day": 21, "month": 6, "phenom": "Solstice", "time": "08:24"}` |
| Aralık gündönümü 21 Aralık 2026 20.50 UT (= 23.50 Türkiye saati) | https://aa.usno.navy.mil/api/seasons?year=2026 | `{"day": 21, "month": 12, "phenom": "Solstice", "time": "20:50"}` |
| Mart ekinoksu 20 Mart 2026 14.46 UT (Ekvator hazır durumu 20 Mart) | https://aa.usno.navy.mil/api/seasons?year=2026 | `{"day": 20, "month": 3, "phenom": "Equinox", "time": "14:46"}` |
| Eylül ekinoksu 23 Eylül 2026 00.05 UT | https://aa.usno.navy.mil/api/seasons?year=2026 | `{"day": 23, "month": 9, "phenom": "Equinox", "time": "00:05"}` |
| Güneş konum formülleri (g, q, L, e, δ, R) | https://aa.usno.navy.mil/faq/sun_approx | "g = 357.529 + 0.98560028 D", "q = 280.459 + 0.98564736 D", "L = q + 1.915 sin g + 0.020 sin 2g", "e = 23.439 – 0.00000036 D", "sin d = sin e sin L", "D = JD – 2451545.0" |
| Formülün doğruluğu ≈ 1 yay dakikası | https://aa.usno.navy.mil/faq/sun_approx | "accurate to about 1 arcminute within two centuries of 2000" |
| 1 Ocak 2026 00.00 UT = JD 2461041,5 (D başlangıcı) | https://ssd.jpl.nasa.gov/api/horizons.api (yukarıdaki sorgu) | "2461044.166666667, A.D. 2026-Jan-03 16:00" → 3 Ocak 00.00 = 2461043,5 → 1 Ocak 00.00 = 2461041,5 |
| Gün doğumu denklemi; kırılma ve disk için −0,833° | https://en.wikipedia.org/wiki/Sunrise_equation | "approximately −0.833° or −50.0 arcminutes"; "The equation above neglects the influence of atmospheric refraction and the non-zero angle subtended by the solar disc." |
| Ufukta kırılma 34 yay dakikası, Güneş yarıçapı 16 yay dakikası | https://en.wikipedia.org/wiki/Equinox | "the atmospheric refraction is assumed to be 34 arcminutes", "the assumed semidiameter (apparent radius) of the Sun is 16 arcminutes" |
| Takvimler doğuşu üst kenarla sayar | https://en.wikipedia.org/wiki/Equinox | "a widespread definition is the time that the top limb of the Sun is level with the horizon" |
| Kırılma + disk ekvatorda gündüzü ≈ 7 dk uzatır (denetim) | https://en.wikipedia.org/wiki/Equinox | "These effects make the day about 14 minutes longer than the night at the equator"; model 20 Mart, 0°: 12 sa 6 dk 40 sn → gündüz − gece = 13 dk 20 sn (tutarlı) |
| İstanbul'da kırılma payı ≈ 9–10 dk (deney metni) (hesap) | — | Model: 21 Haz 14:57:08 → 15:07:34 (+10 dk 26 sn); 20 Mar 11:59:28 → 12:08:18 (+8 dk 50 sn); ders d1 "ekinoks günü gündüz 12 saatten yaklaşık 8 dakika uzun" |
| Kutup dairesi 66,56° (66°33′51,0″) | https://en.wikipedia.org/wiki/Arctic_Circle | "Currently the Arctic Circle is 66°33′51.0″ north of the Equator." (66 + 33/60 + 51/3600 = 66,5642) |
| Kutup dairesinin enlemi eğikliğe bağlı; eğiklik ≈ 41.000 yılda 2° oynar | https://en.wikipedia.org/wiki/Arctic_Circle | "Its latitude depends on Earth's axial tilt, which fluctuates by a margin of some 2° over a 41,000-year period" |
| Kırılma yüzünden gece yarısı Güneşi daireden biraz güneyde de görünür | https://en.wikipedia.org/wiki/Arctic_Circle | "part of the midnight sun is visible, on the night of the northern summer solstice, at a latitude of about 50 minutes of arc … south of the Arctic Circle" |
| Haziran gündönümünde Güneş Yengeç dönencesinde tepede (lejant) | https://en.wikipedia.org/wiki/Tropic_of_Cancer | "the Earth's northernmost circle of latitude where the Sun can be seen directly overhead. This occurs on the June solstice" |
| Konum 41,00° K, 29,08° D (Fetih Mahallesi, Ataşehir) | /home/claude/urania/uygulama.js (yerel) | `VARSAYILAN_KONUM = { ad: 'Fetih Mahallesi, Ataşehir', enlem: 41.0046, boylam: 29.0762 …}` (iki basamağa yuvarlandı) |
| İstanbul 21 Haziran 2026: doğuş 05.32, batış 20.39 → 15 sa 7 dk | https://aa.usno.navy.mil/api/rstt/oneday?date=2026-06-21&coords=41.00,29.08&tz=3 | `"phen": "Rise", "time": "05:32"`, `"phen": "Upper Transit", "time": "13:05"`, `"phen": "Set", "time": "20:39"` |
| İstanbul 21 Aralık 2026: doğuş 08.25, batış 17.38 → 9 sa 13 dk | https://aa.usno.navy.mil/api/rstt/oneday?date=2026-12-21&coords=41.00,29.08&tz=3 | `"phen": "Rise", "time": "08:25"`, `"phen": "Set", "time": "17:38"` |
| timeanddate İstanbul 21 Haziran gündüzü 15 sa 7 dk 50 sn | https://timeanddate.com/sun/@745042 | Ders d1 anahtar sayısı d1n11: "15 sa 7 dk 50 sn … (Aralık gündönümünden 5 sa 55 dk uzun)". Bu oturumda timeanddate sayfası doğrudan açılamadı (site isteği reddetti, yeniden denenmedi); değer dersteki kayıttan alındı |
| KARŞILAŞTIRMA 21 Haziran (hesap) | — | Deney (kırılmayla) 15 sa 7 dk 34 sn · USNO 15 sa 7 dk · timeanddate 15 sa 7 dk 50 sn · Astronomy Engine 15 sa 7 dk 36 sn. Deney timeanddate'ten 16 sn kısa: timeanddate'in konumu biraz farklı (Fatih, 28,95° D) ve deney dik açıklığı gün boyu sabit sayıyor |
| KARŞILAŞTIRMA 21 Aralık (hesap) | — | Deney 9 sa 13 dk 13 sn · USNO 9 sa 13 dk · timeanddate ≈ 9 sa 12 dk 50 sn (15:07:50 − 5:55, ders d1) · Astronomy Engine 9 sa 13 dk 27 sn. Farklar 1 dakikanın altında; ekranda ikisi de "9 sa 13 dk" |
| Geometrik gündüz 21 Haz 14 sa 57 dk, 21 Ara 9 sa 3 dk, 3 Oca 9 sa 9 dk (hesap) | — | cos H₀ = −tan 41° · tan δ; python3: 14:57:08, 9:02:53, 9:08:31 |
| Gündüz farkı yaz–kış ≈ 6 saat (rehber) | — | 14:57 − 9:03 = 5 sa 54 dk; ders d1: "yaklaşık 5 sa 55 dk daha uzundur" |
| Öğle yüksekliği 72,4° ve 25,6° | — | h = 90° − |41° − δ|; 90 − 41 + 23,44 = 72,44; 90 − 41 − 23,44 = 25,56. Ders d1: "yazın yaklaşık 72,4°, kışın yaklaşık 25,6°" |
| 3 Ocak: δ = −22,80°, öğle 26,2°, güç %44 (hesap) | — | USNO formülleriyle D = 9498,919 (3 Ocak 10.04 UT) |
| Güç oranı ≈ 2,2 (sin 72,4° / sin 25,6°) | — | 0,9534 / 0,4315 = 2,21; ders d1: "kış öğlesindekinin yaklaşık 2,2 katı" |
| Güç sin h (yatay yüzeye düşen enerji) | — | Ders d1: "yatay bir yüzeye düşen enerji, Güneş'in yüksekliğinin sinüsüyle orantılıdır" |
| Eğiklik 0 → δ = 0, öğle 49,0°, gündüz 12 sa, güç %75 (hesap) | — | sin 49° = 0,7547 |
| Ekvator 20 Mart: öğle 89,9°, δ = −0,08° (hesap) | — | 20 Mart 10.04 UT, ekinoks anından (14.46 UT) yaklaşık 4,7 saat önce |
| Kutup dairesi 21 Haz: öğle 46,9°, gündüz 23 sa 59 dk; kırılmayla 24 sa (hesap) | — | δ = 23,43999°; cos H₀ = −0,99999…; python3 23:59:26 |
| Eğiklik 40°: öğle 89,0°, gündüz 18 sa 15 dk, kırılmayla 18 sa 32 dk (hesap) | — | python3 ve tarayıcı aynı |
| 1 m sopanın öğle gölgesi 32 cm (Haziran), 2,1 m (Aralık); oran 6,6 (hesap) | — | cot 72,44° = 0,316; cot 25,56° = 2,091; 2,091 / 0,316 = 6,6 |
| Doğuş azimutu yazın kuzeydoğu (lejant) | — | Ders d1: "Haziran gündönümünde Güneş sabah azimutu yaklaşık 57° … akşam azimutu yaklaşık 303°"; model aynı yönleri çiziyor |
| Gün numaraları: 172 = 21 Haziran, 355 = 21 Aralık, 79 = 20 Mart, 3 = 3 Ocak (hesap) | — | `Date.UTC(2026, ay−1, gün)` farkı; tarayıcıda `yilinGunu` testle sınandı |
