# Uydu geçişleri – kaynaklı bilgiler (İstanbul)

Erişim tarihi (tüm kaynaklar): 2026-10-27. Ham veriler bu oturumda `curl` ile CelesTrak ve Heavens-Above'dan doğrudan indirildi; diğer sayfalar WebFetch ile okundu. "Kendi hesap" yazan satırlar kaynak değil, indirilen TLE ile Skyfield 1.55 üzerinde yapılan hesaptır.

## 1. Katalog numaraları, CelesTrak adları, TLE

| Nesne | NORAD | CelesTrak adı (OBJECT_NAME) | COSPAR |
|---|---|---|---|
| Tiangong / Tianhe çekirdek modülü | 48274 | `CSS (TIANHE)` | 2021-035A |
| ISS | 25544 | `ISS (ZARYA)` | 1998-067A |
| Hubble | 20580 | `HST` | 1990-037B |

- Not: Heavens-Above Tianhe için `CSS (TIANHE-1)` adını kullanıyor; CelesTrak'ta ad `CSS (TIANHE)`. Kaynak: https://www.heavens-above.com/SatInfo.aspx?satid=48274
- Diğer CSS modülleri `stations` grubunda ayrı nesne: `CSS (WENTIAN)` 53239, `CSS (MENGTIAN)` 54216. Kaynak: https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json

GP API URL'leri çalışıyor (HTTP 200, `content-type: text/plain`). 2026-10-27 ~14:20 UTC'de dönen satırlar:

Kaynak: https://celestrak.org/NORAD/elements/gp.php?CATNR=48274&FORMAT=tle
```
CSS (TIANHE)
1 48274U 21035A   26299.76014724  .00007428  00000+0  89206-4 0  9994
2 48274  41.4690 242.6948 0003157 219.3970 140.6639 15.61173988313716
```
Kaynak: https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle
```
ISS (ZARYA)
1 25544U 98067A   26300.17675415  .00005704  00000+0  11132-3 0  9993
2 25544  51.6336   6.9404 0006948 314.9066  45.1358 15.49073103592213
```
Kaynak: https://celestrak.org/NORAD/elements/gp.php?CATNR=20580&FORMAT=tle
```
HST
1 20580U 90037B   26300.17191739  .00004519  00000+0  13433-3 0  9998
2 20580  28.4738 257.5897 0001966 174.8269 185.2348 15.32094100808823
```
- Aynı veri JSON (OMM) olarak da geliyor: `FORMAT=json` alanları `OBJECT_NAME, OBJECT_ID, EPOCH, MEAN_MOTION, ECCENTRICITY, INCLINATION, RA_OF_ASC_NODE, ARG_OF_PERICENTER, MEAN_ANOMALY, EPHEMERIS_TYPE, CLASSIFICATION_TYPE, NORAD_CAT_ID, ELEMENT_SET_NO, REV_AT_EPOCH, BSTAR, MEAN_MOTION_DOT, MEAN_MOTION_DDOT`. Kaynak: https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json

### KRİTİK: TLE formatı yeni nesneleri taşıyamıyor
- CelesTrak: "TLE formats will not support objects with catalog numbers above 99999"; 5 haneli numaralar 69999'da tükendi, sonrası için TLE üretilemiyor; OMM formatları (JSON/XML/CSV) 9 haneli numarayı destekliyor. Kaynak: https://celestrak.org/NORAD/documentation/gp-data-formats.php
- İndirilen veride doğrulandı: `last-30-days` grubundaki 284 nesnenin 284'ünün katalog numarası >99999 (en büyük 101195); `starlink` grubunda 500 nesne >99999; `stations` grubunda 4 nesne >99999 (SOYUZ-MS 29 = 100057, PROGRESS-MS 35 = 100712, CREW DRAGON 13 = 100882, DRAGON CRS-35 = 101031). Kaynaklar: https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=json , https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json , https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json
- Sonuç: uygulama TLE değil `FORMAT=json` (OMM) kullanmalı; satellite.js tarafında OMM → satrec dönüşümü gerekir (satellite.js'in bu sürümde OMM desteği bu oturumda doğrulanmadı: askıda).

## 2. Standart / içsel parlaklık (magnitude)

Heavens-Above tanımı: "Intrinsic brightness (Magnitude) … (at 1000km distance, 50% illuminated)" ve "Maximum brightness (Magnitude) … (at perigee, 100% illuminated)".

| Nesne | İçsel mag (1000 km, %50 aydınlık) | Maks. mag (perigee, %100) | Kaynak |
|---|---|---|---|
| ISS | -1.8 | -5.6 | https://www.heavens-above.com/SatInfo.aspx?satid=25544 |
| Tiangong (CSS Tianhe) | 0.0 | -4.2 | https://www.heavens-above.com/SatInfo.aspx?satid=48274 |
| Hubble | 2.2 | -1.1 | https://www.heavens-above.com/SatInfo.aspx?satid=20580 |

İkinci kaynaklar (standart mag değil, gözlemlenen tipik/tepe parlaklık):
- ISS "up to mag -4"; Tiangong "peaks around magnitude -2"; Hubble "up to about mag 1.5" (güney ABD enlemlerinden). Kaynak: https://keeptrack.space/top-10/10-satellites-visible-to-the-naked-eye (sayfa tarihi Jul 31, 2026)
- Tiangong yaklaşık -2.6, ISS -3.8 (Giuseppe Donatiello'ya atfen). Kaynak: https://www.space.com/how-to-see-track-chinese-space-station-tiangong
- Standart mag tanımı farklı kaynaklarda: Rob Matson (SeeSat-L, 1996) "the visual magnitude at 1000km range, 90-deg phase angle a la Ted Molczan" (90° faz açısı = %50 aydınlık diske karşılık gelir). Kaynak: https://satobs.org/seesat/Mar-1996/0321.html
- McCants QUICKSAT.MAG değerlerinin tanımı: bulamadım (yukarıdaki SeeSat mesajında Matson dosyanın değerlerinin "standart mag gibi görünmediğini" söylüyor).
- Heavens-Above: parlaklık tahminleri "only be treated as a rough guide" (yönelim/attitude bilinmediği için). Kaynak: https://www.heavens-above.com/faq.aspx
- Heavens-Above tahmin eşiği: güneş yüksekliği -6° altında olan geçişleri listeliyor. Kaynak: https://www.heavens-above.com/faq.aspx
- Standart mag'dan anlık mag'a dönüşüm formülü (mesafe + faz fonksiyonu): bu oturumda kaynaklı bir formül bulamadım — ayrı araştırma gerekir (askıda).

## 3. CelesTrak grupları, CORS, kullanım kuralları

| GROUP | Sayfadaki ad | Bugün indirilen nesne sayısı | URL |
|---|---|---|---|
| stations | Space Stations | 20 | https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json |
| visual | 100 (or so) Brightest | 155 (TLE formatında sayıldı; JSON isteği iki kez proxy bağlantı kopmasıyla başarısız oldu) | https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle |
| starlink | Starlink | 11 133 (JSON 4.7 MB) | https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json |
| last-30-days | Last 30 Days' Launches | 284 (JSON 120 KB) | https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=json |

- Grup adları CelesTrak indeksinde: https://celestrak.org/NORAD/elements/ (sayfa "Current as of 2026 Oct 27 14:11:42 UTC")
- `stations` içeriği (20): ISS (ZARYA), POISK, CSS (TIANHE), ISS (NAUKA), FREGAT DEB, CSS (WENTIAN), CSS (MENGTIAN), SZ-21 MODULE, DUPLEX, KNACKSAT-2, GXIBA-1, LEOPARD, HMU-SAT2, PROGRESS-MS 34, TIANZHOU-10, SHENZHOU-23 (SZ-23), SOYUZ-MS 29, PROGRESS-MS 35, CREW DRAGON 13, DRAGON CRS-35. Not: ISS'e kenetli araçlar ayrı nesne olarak listeleniyor → uygulamada yinelenen "parlak nokta" gösterilmemeli.
- `visual` içeriği: ağırlıklı roket gövdeleri (SL-3/SL-8/SL-14/SL-16 R/B, CZ-xx R/B, H-2A R/B), ISS (ZARYA), HST, CSS (TIANHE), ENVISAT, SPACEMOBILE-001…010 vb. "100" adına rağmen 155 nesne var.
- `last-30-days` içinde 80 Starlink nesnesi, 3 fırlatma: 2026-225 (26 uydu), 2026-232 (27), 2026-242 (27). Starlink'ler `OBJECT_ID` (COSPAR fırlatma kodu) ile gruplanabiliyor.

CORS:
- `curl -D - -H "Origin: …"` ile GET yanıtında `access-control-allow-origin: *` başlığı DOĞRULANDI (hem `CATNR=25544&FORMAT=tle` hem `GROUP=stations&FORMAT=json`). Kaynak: https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json
- OPTIONS preflight testi: proxy bağlantıyı kopardı, doğrulanamadı. Basit GET (özel başlık yok) preflight gerektirmediği için tarayıcıdan `fetch()` çalışmalı.
- 403 (engel) yanıtlarında CORS başlığı olup olmadığı: test edilmedi (bilerek engel tetiklenmedi) — askıda. Bu önemli: başlık yoksa tarayıcı 403 mesajını okuyamaz, sadece "network error" görür.

Kullanım kuralları (hepsi: https://celestrak.org/NORAD/documentation/gp-data-formats.php , sayfa "Updated 2026 Jun 23"):
- "CelesTrak only checks for new GP data once every 2 hours, so there is no need for you to check more often."
- 2026 Mar 26'dan itibaren "one-download-per-update policy for all users, starting with the Active and Starlink GROUPs": aynı IP ikinci istekte HTTP 403 + "GP data has not updated since your last successful download … Data is updated once every 2 hours."
- Hata limiti: 2 saatte 50 HTTP hatası (301, 403, 404) → IP güvenlik duvarına; günde 1000+ hata → manuel inceleme gerektiren kalıcı engel.
- 100 MB/gün üzeri kullanım → IP firewall'a düşebilir.
- Öneri: indirilen dosyanın zaman damgasını kontrol et, 2 saatten eskiyse yeniden indir; 200 dışı yanıtta dur, tekrar deneme. "There is no need to download the list of active satellites and the list of all Starlink satellites, since the latter is a subset of the former."
- `.com` alan adı 301 ile `.org`'a yönlendiriliyor ve 301'ler hata limitine sayılıyor → her zaman `https://celestrak.org` kullanılmalı.
- 18 SDS GP verisi günde 2-3 kez güncelleniyor.
- PWA çıkarımı (kendi yorum): istekler kullanıcının tarayıcısından, kullanıcının IP'siyle gider; cihaz başına cache (≥2 saat) + 403/404/301'de durma yeterli. Starlink grubu 4.7 MB → telefonda gereksiz; trenler için `last-30-days` (120 KB) yeterli.

## 4. Starlink "trenleri"

- Neden görünür: uydular kendi ışığı olmadan güneş ışığını yansıtır; en iyi gün batımından sonra / gün doğumundan önce; tren "best seen in the days immediately following a launch"; yörünge yükseltmeyle ~550 km'ye çıkıp birbirinden ayrılınca seçilmez olur. Kaynak: https://www.space.com/spacex-starlink-satellites-night-sky-visibility-guide.html (güncelleme Aug 27, 2026)
- Fırlatma sonrası ~300 km'ye bırakılıp kendi itkileriyle 500 km üstüne çıkıyorlar; 357 km altında ortalama görünür mag 2.68, üstünde 6.46 (1000 km'ye normalize: 4.58 vs 7.52, ~%93 sönükleşme); R. Lee'ye göre parlaklık geçişi fırlatmadan ~2 gün sonra. Kaynak: Mallama ve ark. 2024, https://arxiv.org/pdf/2405.12007
- SpaceX: yükseltme sırasında "open book" düşük sürtünme konfigürasyonu; parlaklığı azaltmak için uyduyu güneş vektörü gövde düzleminde olacak şekilde döndürme ("knife-edge"); tam knife-edge olmayan uydular "temporarily visible for one part of an orbit". Musk hedefi: "make the satellites invisible to the naked eye within a week". Kaynak: https://spaceflightnow.com/2020/04/28/spacex-to-debut-satellite-dimming-sunshade-on-starlink-launch-next-month/
- İlk Starlink (2019): fırlatmadan "just short of a day" sonra tren görüldü, "two to three passes each night" beklendi, 25 Mayıs gecesi sönükleşmeye başlamıştı. Kaynak: https://earthsky.org/space/wow-photo-video-spacex-starlink-satellite-train
- "Brightness: mag ~1-3 in the first days … Best time: the first few evenings after a launch"; "Over the following weeks each satellite raises itself to its operational orbit near 550 kilometers"; günümüz fırlatmalarında "twenty-odd satellites". Kaynak: https://keeptrack.space/top-10/10-satellites-visible-to-the-naked-eye
- Eski zincirler dağılınca artık zincir olarak görünmüyor. Kaynak: https://findstarlink.com/
- Trenin kaç gün görünür kaldığına dair kesin, resmi bir sayı: bulamadım. Kaynaklar arasında örtüşen aralık "ilk birkaç gün" (1–~7 gün); kesin değil.
- Grup karşılaştırması: `starlink` = tüm Starlink'ler (11 133, 4.7 MB); `last-30-days` = son 30 günün tüm fırlatmaları (284 nesne, 80'i Starlink). Yeni treni bulmak için `last-30-days` içinde `OBJECT_NAME` "STARLINK" ile başlayan ve `OBJECT_ID` fırlatma kodu en yeni olanlar seçilebilir. Kaynaklar: https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json , https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=json
- Fırlatmadan sonra yeni partinin CelesTrak GP verisine kaç saatte girdiği: bulamadım (askıda). CelesTrak'ta ayrıca "Supplemental Data (SupGP)" bölümü var; içeriği bu oturumda incelenmedi. Kaynak: https://celestrak.org/NORAD/elements/

## 5. Tiangong yörüngesi ve İstanbul

- Eğim: 41.4690° (TLE, epok 2026-10-26 18:14 UTC). Kaynak: https://celestrak.org/NORAD/elements/gp.php?CATNR=48274&FORMAT=tle
- Heavens-Above: "382 x 386 km, 41.5°"; perigee 382 km, apogee 386 km, 15.61173988 tur/gün. Kaynaklar: https://www.heavens-above.com/SatInfo.aspx?satid=48274 , https://www.heavens-above.com/orbit.aspx?satid=48274
- Wikipedia infobox: eğim 41.47°, perigee 386.4 km, apogee 391.8 km, periyot 92.3 dk; metin: "altitude of 340 to 450 kilometres … inclination of 41°". Kaynak: https://en.wikipedia.org/wiki/Tiangong_space_station
- Space.com: eğim "41 to 43 degrees", irtifa "340 to 450 kilometers"; 60°K üstünden görünmez; "between 42.8 degrees south and 42.8 degrees north" tepeden geçebilir. Kaynak: https://www.space.com/how-to-see-track-chinese-space-station-tiangong
- Karşılaştırma: ISS 51.6° / 415×424 km; HST 28.5° / 468×471 km. Kaynaklar: https://www.heavens-above.com/SatInfo.aspx?satid=25544 , https://www.heavens-above.com/SatInfo.aspx?satid=20580
- İstanbul (Kadıköy ~40.99°K) 41.47°'nin hemen altında → yer izi İstanbul'un üstünden geçebilir. Kendi hesap (yukarıdaki TLE, Skyfield, 40.99°K 29.03°D, 27 Eki–6 Kas 2026):
  - Tiangong: 10 günde 47 geçiş >10°, en yüksek kulminasyon 89.8°; görünür (güneş < -6°, uydu güneşte) geçişler akşam ~18:30–19:45 TSİ, kulminasyon 68°, 81°, 88°, 80°, 90°, 49°, 71°, 31°, 12°.
  - ISS: 59 geçiş >10°, maks 84.1°; görünür geçişler sabah ~06:00–07:00 TSİ.
  - HST: 10 geçiş >10°, maks yalnızca 12.0° (güney ufku). Yani HST İstanbul'dan zor hedef; KeepTrack de "decent passes are limited to roughly the latitude of the southern United States and below" diyor.
  - Bu tahminler 10 gün ileriye TLE yayılımıdır; uzak günlerde hata büyür.
