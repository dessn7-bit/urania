# Uydu parlaklığı: standart mag → anlık mag, Heavens-Above referans değerleri, Starlink trenleri

Gözlemci: Fetih Mahallesi, İstanbul — 41.0046°K, 29.0762°D, 0 m, UTC+3.
Erişim tarihi (tüm kaynaklar): 2026-10-27. Heavens-Above ve arXiv/satobs sayfaları `curl` ile ham indirildi; birkaç sayfa WebFetch ile okundu (belirtildi).
"Kendi test" yazan satırlar kaynak değil; indirilen veriler üzerinde yapılan hesaptır (Skyfield 1.55 + de421).
CelesTrak'a bu oturumda hiç istek atılmadı: testte bugün önceki oturumda CATNR ile alınmış TLE'ler kullanıldı (`uydu_kaynaklar.md` §1; epokları Heavens-Above sayfalarındaki epoklarla aynı: ISS 27 Ekim, CSS 26 Ekim).

---

## 1. Standart (içsel) mag → anlık görünür mag

### 1.1 Ortak kısım: uzaklık terimi ve faz açısı tanımı (kaynaklar uyuşuyor)

- **Uzaklık terimi**: `m = m_std + 5·log10(d / 1000 km)` (90° faz açısında).
  - Rob Matson (SeeSat-L, 25 Nisan 2001): "Standard magnitude is defined for 1000 km range; brightness is inversely proportional to range squared … `Mag = Std. mag + 5*LOG(1600/1000)` … A simplified general equation for object at 90-degree phase angle is: `Mag = Std. mag - 15 + 5*LOG(Range)` where Range is in km." Kaynak: https://satobs.org/seesat/Apr-2001/0295.html
  - Karpov & Peloton 2022, Denk. 3: `magpsf = stdmag + F(φ) + 5 log(d / 1000 km) − 2.5 log(τ / 30 s)` (son terim yalnızca ZTF'deki parlama süresi için; bizim için yok). Kaynak: https://arxiv.org/pdf/2202.05719 (s. 8)
  - Mallama (2021–2023): "1000-km magnitude … adjustment of apparent brightness to that standard distance" (ters kare yasası). Kaynak: https://arxiv.org/pdf/2101.00374 , https://arxiv.org/pdf/2111.09735 (§4)
  - satobs FAQ Bölüm 6: "For diffusely reflecting objects … `m ~ -5 * log(Range)`". Kaynak: https://satobs.org/faq/Chapter-06.txt

- **Faz açısı tanımı** (hepsi aynı: Güneş–uydu–gözlemci açısı, uydunun tepesinde ölçülür):
  - satobs FAQ: "the angle between the two lines connecting, respectively, the satellite with the sun and the satellite with the observer." https://satobs.org/faq/Chapter-06.txt
  - Karpov & Peloton: "𝜙, defined as a Sun-satellite-observer angle". https://arxiv.org/pdf/2202.05719
  - Mallama 2021: "An object's phase angle is the arc length between the Sun and the observer as measured at the object. When the phase angle is zero the Sun and observer are aligned as seen from the object, and when it is 180° they are in opposite directions." https://arxiv.org/pdf/2111.09735 (§5)
  - Romero-Colmenares ve ark. 2026 (A&A): "The Sun phase angle Φ is defined as the angle between the Sun, the satellite, and the observer". https://arxiv.org/pdf/2603.21859 (s. 5)

- **"%50 aydınlık" = 90° faz açısı**:
  - Heavens-Above: "Intrinsic brightness (Magnitude) -1.8 (at 1000km distance, 50% illuminated)" / "Maximum brightness (Magnitude) -5.6 (at perigee, 100% illuminated)". https://www.heavens-above.com/SatInfo.aspx?satid=25544 (ham kopya: `heavens_above/ha_satinfo_25544.html`); Tiangong: 0.0 / -4.2 https://www.heavens-above.com/SatInfo.aspx?satid=48274 (`ha_satinfo_48274.html`)
  - Matson (SeeSat-L, 17 Nisan 2001), Heavens-Above'ın bu ifadesini eleştirirken: "'50% illuminated' is a very misleading description since what is really meant is that the observer-to-satellite-to-sun form a 90 degree angle." https://satobs.org/seesat/Apr-2001/0157.html
  - Karpov & Peloton: faz terimi "usually defined in such a way that this term is zero at 𝜙 = 90 degrees (thus, standard magnitude corresponds to apparent magnitude of a satellite at 1000 km distance and 90 degrees phase angle)". https://arxiv.org/pdf/2202.05719
  - Mallama 2021: "In principle the standard magnitude gives the brightness of a half-illuminated satellite at 1000 km distance." https://arxiv.org/pdf/2101.00374

### 1.2 Faz fonksiyonu: literatürde ÜÇ farklı model var

**(A) Lambert (diffüz) küre** — istenen formül; 90°'de normalize:

```
m = m_std + 5·log10(d/1000) − 2.5·log10[ sin φ + (π − φ)·cos φ ]      (φ radyan)
```
(90°'de köşeli parantez = 1 → terim 0; 0°'de = π → −1.243 mag)

- Karpov & Peloton 2022, Denk. 4: "For a diffuse Lambertian sphere, the function is `F(𝜙) = −2.5 log [sin 𝜙 + (π − 𝜙) cos 𝜙]`" (sayfa görüntüsünden okundu). https://arxiv.org/pdf/2202.05719 (s. 8)
- Romero-Colmenares ve ark. 2026, Denk. 5 (p = 1 için): `F0(Φ) = 2/(3·π²) · [(π − Φ)·cos(Φ) + sin(Φ)]`; Denk. 7 aynı diffüz kısım. https://arxiv.org/pdf/2603.21859 (s. 5)
- Krantz, Pearce & Block 2023 (PASP 135:095003), Denk. 2 (Hejduk 2011'e atfen): `m_v = m_Sun − 2.5 log( (2/(3π²))·A·ρ·[(π − θ) cos θ + sin θ] ) + 5 log(R)`; "This model treats the space object as a gray uniform sphere with perfect Lambertian reflectance." https://arxiv.org/pdf/2311.14092 (s. 15)
- Wikipedia "Absolute magnitude": `q(α) = 2/3·((1 − α/180°)·cos α + (1/π)·sin α)`; "A quarter phase (α = 90°) has 1/π as much light as full phase (α = 0°)." https://en.wikipedia.org/wiki/Absolute_magnitude (bölüm "Planets as diffuse spheres")
- Matson 2001: "90-degree phase is not half as bright as full-phase; it's only 31.83% as bright (factor of 1/pi)." https://satobs.org/seesat/Apr-2001/0157.html
- Hejduk 2011 (AMOS) orijinali: bu oturumda açılmadı — yalnızca Krantz'ın atfı üzerinden.

**(B) "Aydınlık kesir" (1 + cos φ)/2** — MMT-9 veritabanı / Mallama / Hainaut & Williams:

```
m = m_std + 5·log10(d/1000) + 2.5·log10(0.5 + 0.5·cos φ) + 0.753     (Mallama'nın düzeltme terimi işaretiyle)
  = m_std + 5·log10(d/1000) − 2.5·log10(1 + cos φ)                    (eşdeğer yazım)
```
- Mallama 2021 (VisorSat), Denk. 1: "C = 2.5 * log10 ( 0.5 + 0.5 cos B ) + 0.753 … the term inside the parentheses represents the fraction of a spherical object that is illuminated by the Sun. The value 0.753 sets the correction to zero for a satellite at B = 90°." https://arxiv.org/pdf/2101.00374
  - Not: Mallama'da C "1000-km mag ile standart mag arasındaki düzeltme". `m_1000 = m_std − C` olduğundan anlık mag'a çevirirken işaret yukarıdaki gibidir (kendi türetme; φ=0'da −0.753, φ=120°'de +0.753).
- Mallama 2020 (OneWeb): "The standard magnitude adjustment for phase angle is 2.5 * log10 ( 0.5 + 0.5 cos B )." https://arxiv.org/pdf/2012.05100
- Hainaut & Williams 2020 (A&A), Denk. 16–17: `f(α) = (1 + cos α)/2`; `M = M_Sun − 2.5 log( f(α) r² p ) + 5 log(R·Δ) + x·χ`. https://arxiv.org/pdf/2003.01992 (s. 7)
- Molczan / Quicksat farkı: "The 'Molczan' magnitude values are based on 50% illumination; the 'Quicksat' values are based on 100% illumination. The difference mathematically is 0.8 magnitude." https://www.satobs.org/brite.html (0.8 ≈ 2.5·log10 2 = 0.753; Lambert modeli olsaydı fark 1.24 olurdu → bu topluluk kesir modeli kullanıyor.)
- Matson bu yaklaşımı yanlış buluyor: "'Illumination fraction' is a term that should never be applied to visual satellite observing". https://satobs.org/seesat/Apr-2001/0295.html

**(C) Heavens-Above'ın fiilen kullandığı model — KAYNAK DEĞİL, KENDİ TEST (tersine mühendislik)**

Heavens-Above formülünü yayınlamıyor. SSS sayfası yalnızca nitel: "The distance, and sun-satellite-observer angle can all be calculated from the orbit. This leaves just the orientation or attitude, which is usually unknown … our magnitude estimates should only be treated as a rough guide". https://www.heavens-above.com/faq.aspx (ham: `heavens_above/ha_faq.html`). Formül orada: bulamadım.

Test: 40 bağımsız Heavens-Above noktası (4 geçiş-detay sayfasındaki 16 satır + 28 özet "en yüksek nokta" satırı, 4 tekrar çıkarıldı), φ 4°–173°, mesafe 389–2370 km. Her noktada Skyfield ile mesafe ve faz açısı hesaplandı (Skyfield mesafesi HA'nınkiyle ±7 km, yükseklik ±0.5° uyumlu) ve m_std = ISS −1.8, CSS 0.0 ile üç model denendi:

| Model | ortalama (model−HA) | RMS | en büyük sapma |
|---|---|---|---|
| (A) Lambert küre | +0.71 | 1.51 | 5.35 |
| (B) (1+cos φ)/2 kesir | +0.36 | 0.72 | 2.61 |
| **(C) doğrusal kesir 1 − φ/180°** | **+0.01** | **0.038** | **0.10** |
| (C) + sönümleme 0.12 mag/hava kütlesi | +0.34 | 0.42 | 0.97 |

(C) modeli:
```
m = m_std + 5·log10(d/1000) − 2.5·log10[ 2·(1 − φ/π) ]     (φ radyan; φ=90° → 0, φ=0 → −0.753)
```
- 40 noktanın 35'i 0.1'e yuvarlanınca HA ile birebir aynı, 5'i 0.1 farklı (yuvarlama gürültüsü düzeyi). Diğer iki model sistematik olarak büyük faz açısında HA'dan çok daha sönük veriyor.
- Sönümleme (atmosferik extinction) terimi eklenince uyum bozuluyor; ufuktaki (yükseklik 0°) noktalarda bile HA sönümleme uygulamıyor (ör. CSS 27 Eki 18:57:59, 0°, 2256 km, HA 3.7 = model 3.71). → **Heavens-Above extinction içermiyor (kendi test).**
- Yorum (kendi): HA "%50 aydınlık" ifadesini harfiyen, aydınlık kesri faz açısıyla doğrusal kabul ederek uyguluyor. Bu (A) ve (B)'den farklı; fiziksel olarak savunulan model (A). Uygulama "HA ile aynı sayıyı göstersin" istiyorsa (C), "fiziksel küre" istiyorsa (A) seçilmeli — karar askıda.
- HA'nın "Maximum brightness (at perigee, 100% illuminated)" değerleri (ISS −5.6, CSS −4.2) bu üç modelin hiçbiriyle perigee mesafesi (415 / 382 km) kullanılarak elde edilemedi (C ile ISS −4.46, CSS −2.84 çıkıyor). Nasıl hesaplandığı: bulamadım (askıda). Matson 2001'de de HA'nın bu iki değerinin "not self-consistent" olduğunu yazmış (https://satobs.org/seesat/Apr-2001/0157.html).
- Test betikleri: `heavens_above/ha_parlaklik_testi.py`, `heavens_above/ha_parlaklik_fit.py` (de421 yolu scratchpad'e bağlı; başka yerde çalıştırmak için yol değişmeli).

### 1.3 Atmosferik sönümleme (extinction)

- Hainaut & Williams 2020: "The term xχ represents the absorption by the atmosphere, where x ≃ 0.12 mag/airmass is the extinction (0.12 is a typical value in the visible filter V …) and χ = 1/cos(z) is the airmass". https://arxiv.org/pdf/2003.01992 (s. 7)
- Mallama: görünür mag tanımı "recorded by a sensor after correction for atmospheric extinction" → yayınlanan standart/1000-km mag'lar extinction'dan arındırılmış; tahmine geri eklemek tahminciye kalmış. https://arxiv.org/pdf/2101.00374 , https://arxiv.org/pdf/2111.09735 (§3)
- satobs FAQ: ufka yakın nesneler "suffer from additional dimming … This is called atmospheric extinction" (nicel değer yok). https://satobs.org/faq/Chapter-06.txt
- Heavens-Above: uygulamıyor (§1.2 kendi test).
- Not (kendi): χ = 1/cos z ufka yakın ıraksar; düşük yükseklikte daha iyi bir hava kütlesi formülü gerekir — bu oturumda kaynaklanmadı (askıda).

---

## 2. Heavens-Above referans değerleri (Fetih, UTC+3)

URL kalıbı (çalışıyor, sayfa başlığı "Fetih (41.0046°N, 29.0762°E)", "(UTC +03:00)"):
- Özet: `https://www.heavens-above.com/PassSummary.aspx?satid=<NORAD>&lat=41.0046&lng=29.0762&loc=Fetih&alt=0&tz=UCTm3`
- Detay: `https://www.heavens-above.com/passdetails.aspx?lat=41.0046&lng=29.0762&loc=Fetih&alt=0&tz=UCTm3&cul=en&satid=<NORAD>&mjd=<MJD>&type=V` (MJD özet sayfasındaki tarih bağlantısından alınıyor)
- Arama dönemi: 27 Ekim 2026 00:00 – 06 Kasım 2026 00:00; "visible only". Sayfa saati 18:33:51 (27 Ekim 06:06 ISS geçişi geçmişte kaldı ama listede).
- Ham HTML: `/home/claude/urania/arastirma/heavens_above/` (ha_iss_passsummary.html, ha_css_passsummary.html, ha_passdetails_*.html, ha_satinfo_*.html, ha_faq.html, ha_starlink*.html, ha_main.html)
- Not: özetteki "Brightness" = "Highest point" anındaki mag (detay sayfalarıyla karşılaştırıldı).

### 2.1 ISS (25544) — yörünge "415 x 424 km, 51.6° (Epoch: 27 October)"
Kaynak: https://www.heavens-above.com/PassSummary.aspx?satid=25544&lat=41.0046&lng=29.0762&loc=Fetih&alt=0&tz=UCTm3

| Tarih | Mag | Başlangıç (saat, yük., az.) | En yüksek | Bitiş |
|---|---|---|---|---|
| 27 Eki | −1.4 | 06:06:05 13° NNW | 06:07:40 16° NNE | 06:09:53 10° NE |
| 28 Eki | −1.0 | 05:20:33 14° NNE | 05:20:33 14° NNE | 05:21:53 10° NE |
| 28 Eki | −2.3 | 06:54:22 10° NW | 06:57:30 33° NNE | 07:00:36 10° E |
| 29 Eki | −1.9 | 06:08:01 16° NNW | 06:09:49 24° NNE | 06:12:40 10° ENE |
| 30 Eki | −1.4 | 05:22:33 19° NNE | 05:22:33 19° NNE | 05:24:38 10° ENE |
| 30 Eki | −3.6 | 06:55:56 10° NW | 06:59:20 80° NNE | 07:02:44 10° ESE |
| 31 Eki | −3.0 | 06:10:07 25° NNW | 06:11:45 49° NNE | 06:15:03 10° ESE |
| 1 Kas | −2.0 | 05:24:45 30° NE | 05:24:45 30° NE | 05:27:13 10° E |
| 1 Kas | −2.8 | 06:57:47 10° WNW | 07:00:54 34° SW | 07:04:00 10° SSE |
| 2 Kas | −3.7 | 06:12:27 40° W | 06:13:25 60° SW | 06:16:45 10° SE |
| 3 Kas | −2.1 | 05:27:15 32° ESE | 05:27:15 32° ESE | 05:29:14 10° ESE |
| 3 Kas | −1.5 | 07:00:52 10° WSW | 07:02:12 12° SW | 07:03:33 10° SSW |
| 4 Kas | −2.1 | 06:15:08 20° SW | 06:15:08 20° SW | 06:17:22 10° S |
| 5 Kas | −0.9 | 05:30:06 12° SSE | 05:30:06 12° SSE | 05:30:25 10° SSE |

### 2.2 Tiangong / CSS (48274) — "382 x 386 km, 41.5° (Epoch: 26 October)"
Kaynak: https://www.heavens-above.com/PassSummary.aspx?satid=48274&lat=41.0046&lng=29.0762&loc=Fetih&alt=0&tz=UCTm3

| Tarih | Mag | Başlangıç | En yüksek | Bitiş |
|---|---|---|---|---|
| 27 Eki | −2.0 | 19:00:03 10° WSW | 19:03:12 68° SSE | 19:05:12 20° E |
| 27 Eki | 1.2 | 20:36:52 10° W | 20:37:24 14° W | 20:37:24 14° W |
| 28 Eki | −2.3 | 19:37:02 10° W | 19:40:13 81° N | 19:40:25 75° NE |
| 29 Eki | −2.1 | 18:37:12 10° W | 18:40:23 88° S | 18:43:24 11° E |
| 29 Eki | 0.2 | 20:14:04 10° W | 20:15:35 26° W | 20:15:35 26° W |
| 30 Eki | −2.2 | 19:14:13 10° W | 19:17:24 80° N | 19:18:34 36° E |
| 31 Eki | −1.4 | 19:51:12 10° W | 19:53:46 52° WSW | 19:53:46 52° WSW |
| 1 Kas | −2.2 | 18:51:20 10° W | 18:54:31 90° WNW | 18:56:48 17° E |
| 1 Kas | 1.1 | 20:28:19 10° W | 20:29:01 15° W | 20:29:01 15° W |
| 2 Kas | −1.5 | 19:28:19 10° W | 19:31:24 49° SSW | 19:32:06 39° SSE |
| 3 Kas | −1.9 | 18:28:23 10° W | 18:31:33 71° SSW | 18:34:43 10° ESE |
| 3 Kas | 0.4 | 20:05:41 10° WSW | 20:07:30 19° SW | 20:07:30 19° SW |
| 4 Kas | −0.5 | 19:05:27 10° W | 19:08:19 31° SSW | 19:10:49 12° SE |
| 5 Kas | 0.9 | 19:43:37 10° WSW | 19:44:49 12° SW | 19:46:02 10° SSW |

### 2.3 Geçiş detay sayfaları (iz boyunca mesafe + mag + Güneş yüksekliği)

CSS 27 Eki (mjd 61340.6688966913) — `ha_passdetails_css_20261027_1900.html`
| Olay | Saat | Yük. | Az. | Mesafe km | Mag | Güneş |
|---|---|---|---|---|---|---|
| Rises | 18:57:59 | 0° | 251° WSW | 2,256 | 3.7 | −10.4° |
| 10° | 19:00:03 | 10° | 249° WSW | 1,404 | 2.1 | −10.8° |
| Max | 19:03:12 | 68° | 165° SSE | 417 | −2.0 | −11.4° |
| Enters shadow | 19:05:12 | 20° | 86° E | 950 | −0.8 | −11.7° |

CSS 29 Eki (mjd 61342.6530491193) — `ha_passdetails_css_20261029_1837.html`
| Rises | 18:35:08 | 0° | 260° W | 2,258 | 4.5 | −6.6° |
|---|---|---|---|---|---|---|
| 10° | 18:37:12 | 10° | 260° W | 1,405 | 2.5 | −7.0° |
| Max | 18:40:23 | 88° | 173° S | 389 | −2.1 | −7.6° |
| Enters shadow | 18:43:24 | 11° | 82° E | 1,338 | −0.1 | −8.1° |

ISS 30 Eki (mjd 61343.1662066465) — `ha_passdetails_iss_20261030_0655.html`
| Exits shadow | 06:55:31 | 8° | 307° NW | 1,680 | −1.3 | −7.5° |
|---|---|---|---|---|---|---|
| 10° | 06:55:56 | 10° | 308° NW | 1,511 | −1.5 | −7.4° |
| Max | 06:59:20 | 80° | 34° NE | 434 | −3.6 | −6.8° |
| Below 10° | 07:02:43 | 10° | 123° ESE | 1,505 | 0.4 | −6.2° |
| Sets | 07:04:49 | 0° | 125° SE | 2,367 | 1.6 | −5.8° |

ISS 1 Kas (mjd 61345.1005282812) — `ha_passdetails_iss_20261101_0524.html`
| Exits shadow | 05:24:45 | 30° | 51° NE | 791 | −2.0 | −24.9° |
|---|---|---|---|---|---|---|
| Below 10° | 05:27:12 | 10° | 93° E | 1,507 | 0.1 | −24.4° |
| Sets | 05:29:26 | 0° | 103° ESE | 2,370 | 1.3 | −24.0° |

Kendi test (Skyfield) ile hesaplanan faz açıları, bu satırlar için: CSS 27 Eki 164.9° / 155.2° / 77.4° / 9.2°; CSS 29 Eki 173.1° / 162.9° / 83.0° / 4.3°; ISS 30 Eki 25.4° / 25.8° / 86.8° / 154.2° / 158.0°; ISS 1 Kas 114.9° / 145.2° / 152.1°. (Uygulamanın birim testinde girdi olarak kullanılabilir: mesafe + φ → (C) modeli → HA mag ±0.05.)

Not: ISS 30 Eki geçişinde sayfa güneş yüksekliğini −5.8°'ye kadar listeliyor; yani HA'nın "−6° eşiği" (uydu_kaynaklar.md §2) geçişin başlangıcı için geçerli, iz boyunca değil (kendi gözlem, HA'dan doğrulanmadı — askıda).

---

## 3. Starlink trenleri: fırlatmadan kaç gün sonra tren / çıplak gözle parlak?

Kesin, resmi bir "N gün" değeri: **bulamadım.** Bulunan sayısal ifadeler:

| Kaynak | İfade (alıntı) | Sayı |
|---|---|---|
| Mallama ve ark. 2024 (Starlink V2 Mini, arXiv 2405.12007) | "Several observers have noted that Mini satellites are especially luminous during their first few days in orbit. For example, R. Lee suggests that a transition takes place about 2 days after launch." | ~2 gün (parlak→sönük geçiş) |
| aynı, Şekil 3 | Görünür mag'ın fırlatmadan sonraki günlere doğrusal uyumu: ~gün 0'da ~2 mag, ~gün 37'de ~8 mag (grafikten okundu, yaklaşık; çok saçılım var: gün 17–25'te 1.5–8 arası noktalar) | ~0.16 mag/gün (kendi okuma) |
| aynı, §4 | 357 km eşiğinin altında ortalama 1000-km mag 4.58, üstünde 7.52 → "93% dimming"; "Height, rather than time, is probably the root cause of the bimodal distribution." | eşik yükseklik 357 km (gün değil) |
| aynı, §5 | "the number of unmitigated orbit-raising satellites at any given time is usually between 0 … and 23 (the greatest number of Minis orbited in one launch)" | — |
| orbitalradar.com sözlük ("Reviewed 2026-09-07") | "Within the first week after a Starlink launch…"; "Within days the line stretches as phasing spreads the batch; within weeks the satellites climb toward their operational shell"; "gone in weeks". https://orbitalradar.com/glossary/starlink-train | ilk 1 hafta |
| Hainaut & Williams 2020 (A&A) | Fırlatma sonrası alçak Starlink'ler "would appear between −2 and −1 mag"; trenler "very short-lived and visible only briefly after sunset or before sunrise". https://arxiv.org/pdf/2003.01992 | gün sayısı yok |
| keeptrack.space (önceki oturum, uydu_kaynaklar.md §4) | "mag ~1-3 in the first days … Best time: the first few evenings after a launch" | "ilk birkaç akşam" |
| Spaceflight Now 2020 (önceki oturum) | Musk hedefi: "make the satellites invisible to the naked eye within a week" | ≤1 hafta (hedef, ölçüm değil) |
| EarthSky 2019 (önceki oturum) | İlk tren fırlatmadan "just short of a day" sonra görüldü; ertesi gece sönükleşmeye başlamıştı | ~1–2 gün (2019, eski tasarım) |
| findstarlink.com | Sayı vermiyor: "over time they spread out … no longer visible as a chain". Arayüzde "Show from: Today / 5 / 9 / 13 / 17 / 20 days ago" seçenekleri var (fırlatmadan 20 güne kadar tahmin yapılıyor demek; görünürlük iddiası değil). https://findstarlink.com/ | — |
| space.com (güncel rehber) | "best seen in the days immediately following a launch" — sayı yok. https://www.space.com/spacex-starlink-satellites-night-sky-visibility-guide.html | — |
| CBC (2019, WebFetch) | "Over the coming days, as they orbit, they will rise to 550 kilometres"; Toronto'da "+6 to +3". https://amp.cbc.ca/news/science/starlink-satellites-1.5151266 | — |
| SpaceX Space Safety (resmî) | "Within days after insertion from the launch vehicle, Starlink satellites begin raising their altitude - the raise timing and raise rate is heavily dependent on the current atmospheric density". https://docs.space-safety.starlink.com/docs/space-safety-articles/constellation_altitudes | yükseltme "günler içinde" başlıyor |

Bulunamayanlar / askıda:
- Sky & Telescope makalesi: sitesi curl'e 403, WebFetch'e hata verdi — okunamadı (bulamadım).
- Jonathan McDowell'in "trenin kaç gün sürdüğü" üzerine sayısal ifadesi: bulamadım.
- Heavens-Above'ın Starlink sayfalarında süreye dair metin yok (yalnızca fırlatma listesi; en yeni: "Starlink G15-15, 23 October 2026 22:48 UTC"). Ham: `heavens_above/ha_starlink.html`, `ha_starlink_launchpasses.html`.

**Uygulama için önemli güncel bilgi (SpaceX resmî, aynı sayfa)**: operasyonel kabuklar artık 485 km/43°, 472.5 km/70°, 462.5 km/97.3°, 463 km/53°; DTC 360 km/53° ve 358.5 km/43°; "Through late 2026 and 2027, Starlink plans to launch future vehicles to the region from 330km to 360km." → Eski kaynaklardaki "550 km'ye çıkar" bilgisi güncel değil; ayrıca Mallama'nın 357 km "parlak/sönük" eşiği yeni 330–360 km kabuklarla örtüşüyor, yani yeni nesil fırlatmalarda "yükseklik eşiği" mantığı artık işe yaramayabilir (kendi çıkarım — askıda).

Kaynaklar arası örtüşen aralık (kendi özet): çıplak gözle parlak tren **~1–2 gün** (R. Lee / EarthSky), "tren olarak bakılmaya değer" **ilk ~1 hafta** (orbitalradar, Musk hedefi, keeptrack "first few evenings"); haftalar içinde dağılıp sönüyor. Uygulamada "fırlatmadan ≤7 gün" filtresi + o anki yüksekliğe göre parlaklık tahmini savunulabilir; ama sabit bir resmi sayı yok.

---

## Özet: bulunan / bulunamayan

Bulundu:
- Uzaklık terimi `5·log10(d/1000)` ve faz açısı tanımı (Güneş–uydu–gözlemci): 4+ bağımsız kaynak.
- Lambert küre formülü `−2.5·log10[sin φ + (π−φ)cos φ]` (90°'de 0): Karpov & Peloton 2022, Romero-Colmenares 2026, Krantz 2023 (Hejduk 2011), Wikipedia, Matson 2001 (1/π oranı).
- Alternatif kesir modeli (1+cos φ)/2: Mallama 2020/2021, Hainaut & Williams 2020, satobs "0.8 mag" farkı.
- Extinction: Hainaut & Williams 0.12 mag/hava kütlesi, χ = 1/cos z.
- Heavens-Above ISS + CSS 10 günlük görünür geçişler (28 geçiş) + 4 detay sayfası; ham HTML kaydedildi.
- Kendi test: HA değerleri doğrusal kesir modeliyle (C) RMS 0.038 mag ile yeniden üretiliyor; HA extinction uygulamıyor; Lambert modeli HA'dan 1.5 mag RMS sapıyor.

Bulunamadı / askıda:
- Heavens-Above'ın kendi formül açıklaması (bulamadım; yalnızca kendi tersine mühendislik).
- HA "Maximum brightness" değerlerinin hesap yöntemi (yeniden üretilemedi).
- Hejduk 2011 orijinal makalesi (açılmadı).
- Starlink treni için resmi/kesin gün sayısı (bulamadım); Sky & Telescope okunamadı; McDowell sayısı bulunamadı.
- Ufka yakın hava kütlesi formülü (kaynaklanmadı).
