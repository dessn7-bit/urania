# Hava kartları (v44) — kaynaklar, kullanım şartları, eşikler

Erişim: 2026-11-08 (UTC ~18.30–19.40). İstekler genel bir User-Agent ile ("urania-arastirma/1.0", "urania-fixture/1.0"); başlıklarda e-posta ya da kişisel veri yok.
Uygulamanın dış servislere gönderdiği konum iki ondalığa yuvarlanır (~1 km; `havakart.js` `iki()`, `hava.js`).
Şart alıntıları aşağıda kaynak sayfadan aynen (İngilizce); "[DOĞRULANAMADI]" işaretli yerler okunamayan ya da çıkarım olan noktalardır.

## Uygulamada gösterilen kaynak satırları
| Kart | Kaynak satırı (ekranda, verinin altında) | Dayanak |
|---|---|---|
| Şu an gökyüzü (uydu) | "Değiştirilmiş EUMETSAT Meteosat verisi içerir, 2026 (Contains modified EUMETSAT Meteosat data 2026); CC BY 4.0. Görüntü: EUMETView (…); kıyı çizgisi Natural Earth." | EUMETSAT Data Policy madde 6.3 ve 5.1 (aşağıda). Görüntü kırpılıp kıyı çizgisi bindirildiği için "[Contains modified]" seçildi. |
| Tahmin güveni, Şeffaflık ve nem, 7 gece şeridi, bulut | `<a href="https://open-meteo.com/">Hava verisi: Open-Meteo.com</a>` + CC BY 4.0 bağlantısı + "sayım ve özetler Urania'nın hesabı" (her kartta, verinin yanında) | Open-Meteo lisansı: "You must include a link next to any location Open-Meteo data are displayed" ; "provide a link to the licence, and indicate if changes were made" |
| Şeffaflık | "Generated using Copernicus Atmosphere Monitoring Service information 2026. Neither the European Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains. Kaynak: CAMS küresel atmosfer bileşimi tahmini (Copernicus Atmosphere Monitoring Service 2021, CAMS Atmosphere Data Store, DOI: 10.24381/04a0b097), Open-Meteo Air Quality API üzerinden; gece ortalaması ve kadir hesabı Urania'nındır." | CAMS ADS "Citation and attribution" (katalog kaydı + Copernicus cümlesi) + Copernicus lisansı 5.1.1/5.1.3. AOD 550 nm yalnız CAMS küresel bileşim tahmininde var (Avrupa ENSEMBLE değişken listesinde AOD yok; v44 doğrulayıcı bulgusu, ADS katalog kaydından), bu yüzden ürün adı "küresel" yazıldı. |
| Kutup ışığı uyarısı | "Kp tahmini: NOAA Uzay Hava Tahmin Merkezi (SWPC), kamu malı veri; uyarıyı Urania hesaplar, NOAA'nın değildir." | weather.gov/disclaimer: kamu malı; NOAA/NWS'nin onayladığı izlenimi verilmez, logo kullanılmaz |
| Ders d4 (kutup ışıkları) | GFZ Kp kesin değerleri, CC BY 4.0, "GFZ German Research Centre for Geosciences", Matzka ve ark. 2021 | kp.gfz.de/en (d4_kaynak.md) |

## Eşikler ve kaynakları
| Ne | Eşik | Kaynak | Not |
|---|---|---|---|
| "Açık" saat / senaryo | bulut < %30 | Uygulamanın v2'den beri kullandığı eşik (bulut cümlesi, gece kararı) | Kaan'ın görev metni ("bulut %30'un altında") |
| Çiğ (dürbün camı buğulanabilir) | sıcaklık − çiy noktası ≤ 2 °C VE bulut < %30 | BAA, "Dealing with dew" (David Arditti, 2021): "after a couple of hours under a clear sky, surfaces will commonly be 1–2°C cooler than the ambient air." ; "If there is little wind then there is little warming conduction to surfaces, hence they cool faster." | Arayüzde "yaklaşık kural" yazılı. |
| Hafif rüzgâr | **eşik konmadı — bulunamadı**; rüzgâr değeri (km/sa) çiğ satırında yanında gösterilir | Çiyi rüzgâr hızına bağlayan resmî bir eşik (Met Office, WMO, NWS) bulunamadı. Met Office Beaufort tablosu "Light air 1–2 m/s, light breeze 2–3 m/s" (çiyle bağı yok); Ritter, Berkelhammer & Beysens 2019 (HESS) yalnız en uygun değer veriyor (~0,5 m/s, eşik değil); Mileta ve ark. (arXiv:0707.2931) "upper limit of order 4 m/s at 10 m" ama birincil kaynağı (Beysens ve ark. 2005) okunmadı. | Görev kuralı: "Bulamazsan eşik koyma" |
| Sis | görüş < 1 km | WMO International Cloud Atlas, "Fog compared with mist" (https://cloudatlas.wmo.int/en/fog-compared-with-mist.html): fog "… less than 1 km"; mist "… do not reduce horizontal visibility to less than 1 km" | |
| Pus | 1 km ≤ görüş ≤ 5 km | WMO-No. 49, Technical Regulations Vol. II, 4.4.2.3: "Mist BR – Reported when visibility is at least 1 000 m but not more than 5 000 m" | Havacılık (METAR) raporlama kuralı; belge WMO sitesinden değil bir ulusal servisteki kopyadan okundu [WMO kendi sitesinden DOĞRULANAMADI]. WMO-No. 8 (CIMO) Bölüm 14: "Mist is to be reported at high humidity values and at a visibility of 1 km or more" (üst sınır vermez). |
| Kutup ışığı uyarısı | önümüzdeki 72 saatte tahmini Kp ≥ 8 | Görev metni (Kaan). Ders d4: Türkiye'den belgelenmiş üç gecede GFZ Kp 7+, 9, 9− | |
| Şeffaflık | eşik YOK; ışık kaybı hesaplanır: Δm = 2,5 × log10(e) × τ ≈ 1,086 × AOD kadir (başucu, hava kütlesi 1) | Optik derinlik tanımı (https://en.wikipedia.org/wiki/Optical_depth): "optical depth … is the natural logarithm of the ratio of incident to transmitted radiant power" → I/I₀ = e^−τ. Kadir (https://en.wikipedia.org/wiki/Apparent_magnitude): "m_x = −2.5 log10(F_x / F_x,0)". Birleşince Δm = −2,5 log10(e^−τ) = 2,5 τ log10 e = 1,0857 τ. AOD: Open-Meteo "Aerosol optical depth at 550 nm of the entire atmosphere" (görsel banda yakın). | Örnek: AOD 0,2 → 0,217 kadir. Ufka doğru hava kütlesiyle artar (kartta yazılı). |

## Ensemble ve model seçimi
- Ensemble modelleri (https://open-meteo.com/en/docs/ensemble-api, 2026-11-08; üye sayıları belgedeki tablodan): `ecmwf_ifs025_ensemble` 51, `dwd_icon_seamless_eps` 40, `ncep_gefs_seamless` 31, `gem_global_ensemble` 21, `ukmo_global_ensemble_20km` 18 → 161 senaryo. Görevdeki örnek adlardan `icon_seamless`, `gfs025`, `gem_global` ve ensemble'daki `ecmwf_ifs025` belgede artık listelenmiyor; güncel adlar kullanıldı.
- Tek modeller (forecast API `models=`): `ecmwf_ifs025`, `ncep_gfs_seamless`, `dwd_icon_seamless`, `ukmo_seamless`, `meteofrance_seamless`, `cmc_gem_seamless` (görevdeki `gfs_seamless`/`icon_seamless`/`gem_seamless` belgede yok; güncel karşılıkları `ncep_`, `dwd_`, `cmc_` önekli).
- Önbellek: ensemble, modeller ve hava kalitesi 3 saat (`havakart.js` S3); hata sonrası 10 dk yeniden sorulmaz; ağ yoksa 48 saate kadar eski kayıt "Çevrimdışı: SS.DD'deki veri" etiketiyle.
- Bedel: Open-Meteo belgesine göre (doküman sayfasının hesaplayıcısı) ensemble isteği ≈ üye sayısı × değişken / 10 = 161 / 10 ≈ 16 çağrı; tek model isteği 1, 7 günlük tahmin (13 değişken) ≈ 1,3, hava kalitesi 1. 3 saatlik önbellekle bir cihaz günde en çok 8 × (16 + 1 + 1,3 + 1) ≈ 155 çağrı: günlük 10 000 sınırının %2'si. Yanıttaki `X-RateLimit-Cost` başlığı okunabiliyorsa tanı kaydına (`havaBedel_<servis>`) yazılır; başlık belgelenmemiş ve tarayıcıya açık olup olmadığı (CORS expose) aşağıda ölçüldü.

## Uydu görüntüsü (EUMETView WMS)
- Uç: https://view.eumetsat.int/geoserver/ows (WMS 1.3.0). GetCapabilities: `<Fees>none</Fees>`, `<AccessConstraints>none</AccessConstraints>`; yanıtlar `access-control-allow-origin: *`.
- Katman başına yetenek belgesi (`/geoserver/<ad alanı>/<katman>/ows?…GetCapabilities`, ~6,5 KB) okunur; en son zaman `<Dimension name="time" default="…">` değerinden alınır ve her isteğe `time=` eklenir. 2026-11-08 ~19.00 UT'de en son zamanlar: geocolour 18.40, IR 10,5 μm 18.40, bulut maskesi 18.30, H40B 18.20 → 20–30 dakika gecikme (kartta yazılı).
- Bulut maskesi lejantı (GetLegendGraphic, testler/veri/hava/eum_clm_lejant.png): mavi "Clear sky over water", yeşil "Clear sky over land", beyaz "Cloud". Lejant piksel renkleri (0,0,255), (0,192,0), (255,255,255); GetFeatureInfo da RED/GREEN/BLUE_BAND döndürür. Katman özeti: "Each pixel is classified as one of the following four types: clear sky over water, clear sky over land, cloud, or not processed (off Earth disc)."
- Önbellek: sunucu görüntüleri `cache-control: max-age=604800` (7 gün) ile gönderir. Uygulama görüntüyü `fetch(…, { cache: 'no-store' })` ile alır (tarayıcının HTTP önbelleğine yazılmaz); sw.js başka kökenden gelen istekleri hiç işlemez ve önbelleğe almaz. Çevrimdışı gösterim için yalnız katman başına son görüntü `urania-uydu-son` Cache API önbelleğinde tutulur (24 saat; sürüm değişince sw.js activate'te silinir).
- Kızılötesi açıklaması (kartta): "Kızılötesi görüntü ışığı değil sıcaklığı ölçer, bu yüzden gece de çalışır: bulut tepeleri yerden ve denizden soğuktur ve bu görüntüde soğuk olan açık renkte çizilir; geceleri bulutlar beyaz, açık gökteki sıcak kara ve deniz koyu görünür." Dayanak: https://en.wikipedia.org/wiki/Weather_satellite ("The thermal or infrared images recorded by sensors called scanning radiometers enable a trained analyst to determine cloud heights and types, to calculate land and surface water temperatures" ; "the difference between the temperature of the warm eye and the surrounding cold cloud tops"); katman: "FCI HRFI IR10.5 μm" (ısıl kızılötesi, 8,7–13,4 μm "thermal imaging" aralığında, aynı sayfa). "Soğuk açık çizilir" gözlemi 2026-11-08 18.40 UT kaydındaki görüntüden (Karadeniz üstündeki bulutlar açık gri, kara ve deniz koyu: testler/veri/hava/eum_harita_kizilotesi.jpg) ve bulut maskesiyle aynı yerlerin örtüşmesinden.

---

# Ek A — Kullanım şartları araştırması (ham notlar, alt ajan raporu, 2026-11-08)


Erişim tarihi (hepsi): **2026-11-08** (UTC ~18:30–19:30). Yöntem: `curl` (User-Agent `urania-arastirma/1.0`, başka başlık yok) + bir kez WebSearch / WebFetch.
Alıntılar kaynak sayfadan **aynen** (İngilizce) alınmıştır. "[DOĞRULANAMADI]" = okuyamadığım / çıkarım olan yer.
api.open-meteo.com, ensemble-api, air-quality-api uçlarına HİÇ istek atılmadı; celestrak.org'a dokunulmadı; Wikipedia kullanılmadı.

---

## 1. EUMETSAT

### 1a. EUMETSAT Data Policy — Madde (Article) 6.3
- Sayfa: https://www.eumetsat.int/legal-framework/data-policy ("Last Updated 28 February 2025")
- Sayfadaki PDF bağlantısı https://www.eumetsat.int/media/45173 → yönlendirme zinciri sonunda gerçek PDF:
  **https://www-cdn.eumetsat.int/files/2026-01/45173%20-%20Data_Policy.pdf** ("EUMETSAT DATA POLICY — Last amended on 25 November 2025", 30 sayfa, PDF ModDate 2026-01-07)

Article 6 "Redistribution and Attribution":
> 1. Users may redistribute all Core Data and Products.
>
> 2. Unless explicitly authorised in specific provisions of this Data Policy [currently Article 10.2, Article 14.3, Article 16.2 and Article 16.4.] or by separate decision of Council, redistribution of the original numerical data of Recommended Data is prohibited. […]
>
> 3. Users are required to include the following attribution to EUMETSAT in relation to EUMETSAT Data and Products, adapted as appropriate: "[Contains modified] EUMETSAT [Meteosat/Metop] [data/product] [Year of publication or distribution]".

Article 5 "Licensing":
> 1. Access to Core Data and Products is granted to all users world-wide on a Free and Unrestricted basis under a CC-BY-4.0 licence, regardless of when and how these are made available to the user.

Annex — "Categorisation of Data and Products", Meteosat-series satırı (tablo, pdftotext çıktısı):
> "Core" Data and Products: All Level 1 Hourly SEVIRI, FCI and IRS data · All SEVIRI, FCI, IRS and LI Derived Products · All SEVIRI, FCI, IRS and LI Advanced Image Products
> "Recommended" Data: All Level 1 SEVIRI, FCI, IRS and LI data with a Latency of more than or equal to 1 hour (Without Charge) · All Level 1 SEVIRI, FCI, IRS and LI data with a Latency of less than 1 hour (may be subject to fees)

Tanımlar (Definitions):
> "Advanced Image Product": the combination of different channels allocating a colour to each channel (i.e. RGB), visualisations of individual channels (e.g. used in Web Map Services) or the mathematical blending of several image layers. These (typically Level 2) products do not contain the original numerical data.

> "Free and Unrestricted" means available Without Charge for any kind of use, re-use and sharing, including redistribution, and with no conditions on use.

> "EUMETSAT Data and Products": all Meteosat Data and Metop Data, all Derived Products and all Advanced Image Products.

Not (çıkarım): EUMETView WMS'ten gelen PNG'ler (RGB GeoColour, tek kanal IR10.5 görselleştirmesi, bulut maskesi, H40B yağış) tanım gereği "Advanced Image Product" ya da "Derived Product" → **Core → CC BY 4.0**. Yalnız <1 saat gecikmeli Level-1 **sayısal** veri (ör. FCI L1c NetCDF) "Recommended"dır; WMS görüntüsü sayısal veri değildir. Bu eşleme benim yorumumdur, EUMETSAT'ın katman bazında yazılı beyanı değildir.

### 1b. EUMETSAT User Portal — "Data registration and licensing" (Core = CC BY 4.0, atıf metni)
- İnsan sayfası (SPA, curl ile boş "Loading..." dönüyor): https://user.eumetsat.int/resources/user-guides/data-registration-and-licensing
- Aynı içerik portalın kendi CMS API'sinden okundu: https://user.eumetsat.int/strapi/api/user-guides?filters[slug]=data-registration-and-licensing (updatedAt 2026-11-04)
- https://www.eumetsat.int/eumetsat-data-licensing de aynı SPA (curl'de içerik yok).

> 'Core': All EUMETSAT data and products declared as 'Core' by the EUMETSAT Council are made available without charge under a CC-BY-4.0 licence. You may share (copy and redistribute the material in any medium or format for any purpose, even commercially) and adapt (remix, transform, and build upon the material for any purpose, even commercially). You must provide attribution and cannot apply additional restrictions. When available, the Digital Object Identifier (DOI) should be mentioned. This category represents the vast majority of EUMETSAT data and products.

> Attribution — You only need to show the following attribution to EUMETSAT when sharing original, or in any way transformed, EUMETSAT Core data and products, adapted as appropriate:
> "[Contains modified] EUMETSAT [Meteosat/Metop] [data/product] [Year of publication or distribution]";
> or
> "This service is based on EUMETSAT [Meteosat/Metop] [data/products] [Year of publication or distribution]."

> To summarise the key points on EUMETSAT Core data and products: What you MAY do: Access and use for any purpose. What you MUST do: Include attribution to EUMETSAT Fee All are free; there is no fee attached to the use of these data.

### 1c. EUMETView (https://view.eumetsat.int)
- Ana sayfa bir Angular SPA; görünür bir "CC BY 4.0" lisans cümlesi **bulamadım** (sayfa metni JS ile yükleniyor). [DOĞRULANAMADI: arayüzde lisans satırı]
- Uygulamanın kendi yapılandırması https://view.eumetsat.int/assets/data/productDecorations.json : 99 ürünün **99'unda `"licence": "free"`** (diğer olası değer koddaki `"licensed"`; "This layer requires a license"). İstenen katmanlar:
  - `EO:EUM:DAT:0913` → `mtg_fd:rgb_geocolour`, `"licence": "free"`, `"downloadDecorations": {"logos": ["logo"]}`, timeFrequency 10 dk
  - `EO:EUM:DAT:0871` → `mtg_fd:ir105_hrfi`, `"licence": "free"`, 10 dk
  - `EO:EUM:DAT:MSG:CLM` → `msg_fes:clm`, `"licence": "free"`, 15 dk
  - `EO:EUM:DAT:1086` → `mtg_fd:h40b`, `"licence": "free"`, 10 dk
- Yardım sayfası https://view.eumetsat.int/assets/data/help/page/help.html :
  > DISCLAIMER The EUMETSAT WMS provides users with the means to view some of the products provided by EUMETSAT. Users who require an operational service, a delivery service with a guaranteed service level and product quality, should use the product services provided through EUMETCast. Legal information Data Policy
  (Bağlantıları eski `…/website/home/AboutUs/LegalInformation/DataPolicy/index.html` adresine gidiyor.)

WMS GetCapabilities (https://view.eumetsat.int/geoserver/ows?service=WMS&version=1.3.0&request=GetCapabilities, 282 KB, 117 `<Layer>`):
- Service: `Title` "EUMETSAT", `Abstract` "EUMETSAT visualizations offering via WMS", **`<Fees>none</Fees>`**, **`<AccessConstraints>none</AccessConstraints>`**
- Katman düzeyinde `Attribution`, lisans, "CC", "copyright" metni **yok** (tüm belgede arandı, 0 eşleşme).
- Yanıt başlığı: `access-control-allow-origin: *`, `access-control-allow-methods: GET, OPTIONS`.
- Katmanlar (Title / time boyutu):
  - `mtg_fd:rgb_geocolour` — "Geo Colour RGB - MTG-I - 0 degree"; time 2024-09-23 … PT10M (okuma anında son 2026-11-08T18:40Z)
  - `mtg_fd:ir105_hrfi` — "FCI HRFI IR10.5 μm Image - MTG-I - 0 degree"; Abstract: "Rectified (level 1c) Meteosat FCI full disk image data in high spatial resolution (1km). …"; PT10M
  - `msg_fes:clm` — "Cloud Mask - MSG - 0 degree"; Abstract: "The Cloud Mask product describes the scene type (either 'clear' or 'cloudy') on a pixel level. …"; time 2020-09-01 … PT15M
  - `mtg_fd:h40b` — "Blended FCI / LEO MW precipitation - MTG - 0 degree"; time 2026-07-23 … PT10M

### 1d. "MTG görüntüsü CC BY 4.0" diyen EUMETSAT sayfası
- Katman/ürün adıyla "bu görüntü CC BY 4.0" diyen ayrı bir EUMETSAT sayfası **bulamadım**. Dayanak: Data Policy Art. 5.1 + Annex (Advanced Image Products ve Derived Products = Core) + User Portal "Core … under a CC-BY-4.0 licence". WebSearch de doğrudan bir beyan döndürmedi (yalnız basın görsellerinde "© EUMETSAT/ESA" kredisi ve <1 saat L1 lisans PDF'leri).

---

## 2. Open-Meteo

### 2a. Lisans — https://open-meteo.com/en/licence (`/en/license` → `/en/licence` yönlendirmesi)
> API data are offered under Attribution 4.0 International (CC BY 4.0)
> […] Attribution: You must give appropriate credit, provide a link to the licence, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
> You must include a link next to any location Open-Meteo data are displayed, for example:
> `<a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>`

Aynı sayfada veri kaynakları listesi (ör. "Atmospheric, ensemble and wave forecasts from European Centre for Medium-Range Weather Forecasts ECMWF ( CC-BY Licence )", "Atmospheric and ensemble forecasts from Canadian Meteorological Centre CMC ( Licence )", "Atmospheric forecasts from UK Met Office ( CC-BY-SA Licence )", "Weather reanalysis, air quality forecasts and elevation data from Copernicus Climate Change Service C3S ( Licence )"). Not: hava kalitesi CAMS'tan geliyor ama bu sayfada "C3S" altında yazılmış.
Atıf önerisi: "Zippenfenig, P. (2023). Open-Meteo.com Weather API [Computer software]. Zenodo. https://doi.org/10.5281/ZENODO.7970649"

### 2b. Şartlar — https://open-meteo.com/en/terms
> Non-Commercial Use — By using the Free API for non-commercial use you agree to following terms: Less than 10'000 API calls per day, 5'000 per hour and 600 per minute. You may only use the free API services for non-commercial purposes. You accept to the CC-BY 4.0 licence, as specified in the licence conditions. We reserve the right to block applications and IP addresses that misuse our service without prior notice.
> Rate limits are applied by IP addresses and application. If you are using providers like Vercel, Netlify, Render, or Google Sheets you might be rate-limited earlier then expected. Consider using Cloudflare Workers, as we apply limits per Cloudflare user.
> […] here are some examples that qualify as non-commercial use: Private or non-profit websites or apps that do not have subscriptions or advertising. Personal home automation purposes. Public research conducted at public institutions. Use in educational content. Voluntary donations, including contributions through a tip jar, are permitted.
> […] the following examples are considered commercial use: Websites or apps that have subscriptions or display advertisements. Commercial products or promotional activities. Undisclosed research at commercial entities.

Tablo (Free / Open-Access API): "Minutely Limit ⚠️ 600 calls / min", "Hourly Limit ⚠️ 5.000 calls / hour", "Daily Limit ⚠️ 10.000 calls / day", "Monthly Limit ⚠️ 300.000 calls / month".
Gizlilik: "For troubleshooting purposes, we keep webserver log files that may contain sensitive information such as geographical coordinates. […] All log files will be deleted after a period of 90 days."

### 2c. Çağrı ağırlığı — https://open-meteo.com/en/pricing (SSS)
> How is one API call defined? Typically, one API call corresponds to one HTTP API request. However, if you select 200 weather variables simultaneously and make extensive use of the API, the number of API calls can increase. Requests for data covering more than 10 weather variables or extending over a period of more than 2 weeks for a single location are considered multiple API calls. To calculate the number of API calls accurately, fractional counts are used. For example, a request for 2 weeks of data with 15 weather variables will be calculated as 1.5 API calls, while 4 weeks of data equals 3.0 API calls.

> Is it necessary to provide attribution to Open-Meteo? Open-Meteo relies on open data that is licenced under Attribution 4.0 International (CC BY 4.0). This licence mandates giving appropriate credit and indicating any modifications made to the data. […] attribution is a requirement under this licence.

Ayrıca: "Historical, climate, ensemble, and satellite radiation APIs require the Professional API Plan or higher." (ücretli plan için; ücretsiz ticari-olmayan uç için değil).

Ensemble dokümanında varsayılan istek için: "Note: This API call is equivalent to 4.0 calls because of factors like long time intervals, the number of locations, variables, or models involved."
Doküman sayfasının kendi tahmin fonksiyonu (open-meteo.com JS paketi `/_app/immutable/chunks/CeeH9qxp.js`, sunucu tarafı formül DEĞİL — [DOĞRULANAMADI: sunucuda aynı mı]):
`gün = forecast_days + past_days`; `n = ensemble ise seçilen modellerin ÜYE SAYILARI toplamı, değilse model sayısı`; `i = hourly + daily + current + minutely_15 değişken sayısı`; `s = i × max(n,1)`; `çağrı = max(1, max(s/10, (gün/14)·(s/10))) × konum sayısı`.
Örnek: ICON-EPS seamless (40 üye) × 1 değişken × 7 gün → 40/10 = **4,0 çağrı** (sayfadaki notla tutarlı). ECMWF IFS ens (51) × 3 değişken → 15,3 çağrı.

**X-RateLimit başlıkları:** okuduğum dört doküman sayfası + pricing + terms + licence içinde "X-RateLimit" ya da "429" geçmiyor → **belgelenmemiş** (API çağrısı yapılmadığı için başlıklar test edilmedi).

### 2d. Ensemble API — https://open-meteo.com/en/docs/ensemble-api
Geçerli `models=` kimlikleri (sayfanın JS'indeki `{value:…}` listesi) ve üye sayısı (sayfanın tablosu + JS üye fonksiyonu):

| kimlik | etiket | üye | bulut (cloud_cover)* |
|---|---|---|---|
| dwd_icon_seamless_eps | DWD ICON EPS Seamless | 40 | var |
| dwd_icon_global_eps / _native | DWD ICON EPS Global | 40 | var |
| dwd_icon_eu_eps / _native | DWD ICON EPS EU | 40 | var |
| dwd_icon_d2_eps / _native | DWD ICON EPS D2 | 20 | var |
| ncep_gefs_seamless | GFS Ensemble Seamless | 31 | var |
| ncep_gefs025 | GFS Ensemble 0.25° | 31 | var |
| ncep_gefs05 | GFS Ensemble 0.5° | 31 | var |
| ncep_aigefs025 | AIGEFS 0.25° | 31 | var (+low/mid/high) |
| ncep_rrfs_conus_ensemble | RRFS CONUS | 5 (tablo) | var |
| ecmwf_ifs025_ensemble | ECMWF IFS 0.25° Ensemble | 51 | var (+low/mid/high) |
| ecmwf_ifs_europe_ensemble | ECMWF IFS 9 km (O1280) Europe | 51 | var |
| ecmwf_aifs025_ensemble | ECMWF AIFS 0.25° Ensemble | 51 | var (+low/mid/high) |
| ecmwf_aifs_europe_ensemble | ECMWF AIFS 31 km (N320) Europe | 51 | var (+low/mid/high) |
| ukmo_global_ensemble_20km | UK MetOffice Global 20km (MOGREPS-G) | 18 | var |
| ukmo_uk_ensemble_2km | UK MetOffice UK 2km (MOGREPS-UK) | 3 | var (+low/mid/high) |
| gem_global_ensemble | GEM Global Ensemble | 21 | var |
| meteoswiss_icon_ch1_ensemble | MeteoSwiss ICON CH1 | 11 | var (+low/mid/high) |
| meteoswiss_icon_ch2_ensemble | MeteoSwiss ICON CH2 | 21 | var (+low/mid/high) |
| google_weathernext2_ensemble | Google WeatherNext 2 Ensemble | 64 | var (+low/mid/high) |
| (bom_access_global_ensemble) | BOM ACCESS-GE | 18 | listede yok; tablo: "no updates since 2025-06-26" |

\* "bulut" sütunu sayfanın JS'indeki model→değişken haritasından (`/_app/immutable/chunks/M-ibrcdH.js`, `T={…}`); düzyazı değil, arayüzün değişken kısıtı. Aynı haritaya göre `visibility` yalnız ncep_gefs*, ukmo_* (ve bom) için var; `wind_gusts_10m` GEM, AIFS, AIGEFS, WeatherNext2 ve ICON-EPS Global'de yok.
**Eski adlar:** Kullanıcının örnekleri (`ecmwf_ifs025`, `icon_seamless`, `gfs025`, `gem_global`) dokümanda artık listelenmiyor; JS üye fonksiyonunda `icon_seamless_eps`, `icon_global_eps`, `icon_eu_eps`, `icon_d2_eps`, `ecmwf_ifs025`, `gem_global`, `cmc_gem_geps` takma adları duruyor ama `gfs025`/`gfs_seamless` yok. Sunucunun eski adları hâlâ kabul edip etmediği [DOĞRULANAMADI — API çağrılmadı]. Yeni adlar kullanılmalı.
Süre: sayfa metni "you can access forecasts for up to 36 days"; parametre tablosu "forecast_days Integer (0-35) No 7 … Up to 35 days of forecast are possible." (sayfa içi çelişki). Tablo: GFS Ensemble 0.5° 35 gün, GEM 16 gün (Pzt+Per 39), ECMWF 15 gün, ICON-EPS 7,5 gün.
Başka not: "Since 6 October 2026, ICON ensembles use native grids with no changes required to existing model names."

### 2e. Forecast API — https://open-meteo.com/en/docs
Tekil (deterministik) `models=` değerleri (sayfa JS listesi): best_match, ecmwf_ifs, ecmwf_ifs025, ecmwf_aifs025_single, cma_grapes_global, bom_access_global (Discontinued 2025-06-26), **ncep_gfs_seamless**, ncep_gfs_global, ncep_rrfs_north_america, ncep_rrfs_conus, ncep_hrrr_conus (Discontinued 2026-11-30), ncep_nbm_conus, ncep_nam_conus (Discontinued 2026-11-01), ncep_aigfs025, ncep_hgefs025_ensemble_mean, **jma_seamless**, jma_msm, jma_gsm, kma_* (Discontinued 2026-03-31), **dwd_icon_seamless**, dwd_icon_global (Discontinued 2026-11-30), dwd_icon_global_native, dwd_aicon_global_native, dwd_icon_eu (Discontinued 2026-11-30), dwd_icon_eu_native, dwd_icon_d2 (Discontinued 2026-11-30), dwd_icon_d2_native, dwd_icon_d2_ruc_native, **cmc_gem_seamless**, cmc_gem_gdps, cmc_gem_rdps, cmc_gem_hrdps, cmc_gem_hrdps_west, **meteofrance_seamless**, meteofrance_arpege_world, meteofrance_arpege_europe, meteofrance_arome_france, meteofrance_arome_france_hd, italia_meteo_arpae_icon_2i, metno_seamless, metno_nordic, knmi_seamless, knmi_harmonie_arome_europe, knmi_harmonie_arome_netherlands, dmi_seamless, dmi_harmonie_arome_europe, **ukmo_seamless**, ukmo_global_deterministic_10km, ukmo_uk_deterministic_2km, meteoswiss_icon_seamless, meteoswiss_icon_ch1, meteoswiss_icon_ch2, geosphere_seamless, geosphere_claef_austria, geosphere_arome_austria (Discontinued 2026-11-04), chmi_aladin_seamless, chmi_aladin_central_europe_2km, chmi_aladin_cz_1km.
→ Kullanıcının `gfs_seamless`, `icon_seamless`, `gem_seamless` adları dokümanda YOK; güncel karşılıkları `ncep_gfs_seamless`, `dwd_icon_seamless`, `cmc_gem_seamless`. `ecmwf_ifs025`, `meteofrance_seamless`, `ukmo_seamless`, `jma_seamless` aynen var. Eski adların sunucuda çalışıp çalışmadığı [DOĞRULANAMADI].
`models`: "String array No auto Manually select one or more weather models. Per default, the best suitable weather models will be combined."
`forecast_days Integer (0-16) No 7 Per default, only 7 days are returned. Up to 16 days of forecast are possible.`
Değişkenler (Hourly Parameter Definition):
- `dew_point_2m` — Instant, °C (°F), "Dew point temperature at 2 meters above ground"
- `apparent_temperature` — Instant, °C (°F), "Apparent temperature is the perceived feels-like temperature combining wind chill factor, relative humidity and solar radiation"
- `wind_gusts_10m` — Preceding hour max, km/h (mph, m/s, knots), "Gusts at 10 meters above ground as a maximum of the preceding hour"
- `visibility` — Instant, meters, "Viewing distance in meters. Influenced by low clouds, humidity and aerosols."
- `cloud_cover` Instant % "Total cloud cover as an area fraction"; `cloud_cover_low` "Low level clouds and fog up to 3 km altitude"; `_mid` "3 to 8 km"; `_high` "from 8 km altitude"

### 2f. Air Quality API — https://open-meteo.com/en/docs/air-quality-api
- `aerosol_optical_depth` — Instant, Dimensionless, "**Aerosol optical depth at 550 nm** of the entire atmosphere to indicate haze."
- `dust` — Instant, μg/m³, "Saharan dust particles close to surface level (10 meter above ground)."
- `forecast_days Integer (0-7) No 5 Per default, 5 days are returned. Up to 7 days of forecast are possible.`; `past_days Integer (0-92)`.
- `domains String No auto Automatically combine both domains auto or specifically select the European cams_europe or global domain cams_global.`
- Kaynak tablosu: CAMS European Air Quality Forecast, Europe 0.1° (~11 km), hourly, 4 days, every 24 h; CAMS Global Atmospheric Composition Forecasts, Global 0.4° (~45 km), 3-hourly, 5 days, every 12 h.
- Atıf ("Citation & Acknowledgement" bölümü, aynen):
  > METEO FRANCE, Institut national de l'environnement industriel et des risques (Ineris), Aarhus University, Norwegian Meteorological Institute (MET Norway), Jülich Institut für Energie- und Klimaforschung (IEK), Institute of Environmental Protection – National Research Institute (IEP-NRI), Koninklijk Nederlands Meteorologisch Instituut (KNMI), Nederlandse Organisatie voor toegepast-natuurwetenschappelijk onderzoek (TNO), Swedish Meteorological and Hydrological Institute (SMHI), Finnish Meteorological Institute (FMI), Italian National Agency for New Technologies, Energy and Sustainable Economic Development (ENEA) and Barcelona Supercomputing Center (BSC) (2022): CAMS European air quality forecasts, ENSEMBLE data. Copernicus Atmosphere Monitoring Service (CAMS) Atmosphere Data Store (ADS). (Updated twice daily).
  > All users of Open-Meteo data must provide a clear attribution to CAMS ENSEMBLE data provider as well as a reference to Open-Meteo.

---

## 3. Copernicus / CAMS

### 3a. Güncel ADS katalog kaydı — CC BY 4.0
- https://ads.atmosphere.copernicus.eu/api/catalogue/v1/collections/cams-europe-air-quality-forecasts → `"license": "CC-BY-4.0"`, link `rel=license` → https://spdx.org/licenses/CC-BY-4.0 ("CC-BY licence"); DOI 10.24381/a4005cee
- …/collections/cams-global-atmospheric-composition-forecasts → `"license": "CC-BY-4.0"`; DOI 10.24381/04a0b097
- Lisans metni (ADS nesne deposu, …/licences/cc-by/cc-byv1_….md): "This dataset is released for use under the CC-BY licence. Highlights and key features of the licence are provided [here](https://creativecommons.org/licenses/by/4.0/). Full legal text is provided [here](https://creativecommons.org/licenses/by/4.0/legalcode)."
- Veri kümesi sayfasının "Citation and attribution" sekmesi (layout JSON'undan, aynen):
  > In addition to the requirements of the applicable license(s), users **must**:
  > - cite the ADS catalogue entry;
  > - provide clear and visible attribution to the Copernicus programme and attribute each data product used;
  >
  > Copernicus Atmosphere Monitoring Service (2020): CAMS European air quality forecasts. Copernicus Atmosphere Monitoring Service (CAMS) Atmosphere Data Store, DOI: 10.24381/a4005cee (Accessed on DD-MMM-YYYY)
  >
  > **Copernicus programme:** [Generated using/Contains modified] Copernicus Atmosphere Monitoring Service information [year]. Neither the European Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains.
  - Global için: "Copernicus Atmosphere Monitoring Service (2021): CAMS global atmospheric composition forecasts. Copernicus Atmosphere Monitoring Service (CAMS) Atmosphere Data Store, DOI: 10.24381/04a0b097 (Accessed on DD-MMM-YYYY)" + aynı Copernicus programme cümlesi.
  - Avrupa kaydında ayrıca ENSEMBLE ve tek tek model (CHIMERE, DEHM, EMEP, EURAD-IM, GEM-AQ, LOTOS-EUROS, MATCH, MOCAGE, SILAM, MONARCH, MINNI) için ayrı atıf cümleleri var.

### 3b. Eski "Licence to Use Copernicus Products" (Version 1.2, November 2019)
- https://apps.ecmwf.int/datasets/licences/copernicus/
> 5.1. All users of Copernicus Products must provide clear and visible attribution to the Copernicus programme. The Licensee will communicate to the public the source of the Copernicus Products by crediting the Copernicus Climate Change and Atmosphere Monitoring Services:
> 5.1.1. Where the Licensee communicates or distributes Copernicus Products to the public, the Licensee shall inform the recipients of the source by using the following or any similar notice: 'Generated using Copernicus Climate Change Service information [Year]' and/or 'Generated using Copernicus Atmosphere Monitoring Service information [Year]'.
> 5.1.2. Where the Licensee makes or contributes to a publication or distribution containing adapted or modified Copernicus Products, the Licensee shall provide the following or any similar notice: 'Contains modified Copernicus Climate Change Service information [Year]'; and/or 'Contains modified Copernicus Atmosphere Monitoring Service information [Year]'
> 5.1.3. Any such publication or distribution covered by clauses 5.1.1 and 5.1.2 shall state that neither the European Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains.
- Not: ADS kaydı artık bu iki CAMS veri kümesi için bu lisansı değil CC-BY-4.0'ı gösteriyor; atıf cümlesi ise aynı kaldı.
- atmosphere.copernicus.eu üzerinde denediğim "how-cite-cams-products" / "data-licence" adresleri 404. ads.atmosphere.copernicus.eu/licences bağlantısı "connection reset" verdi (bot koruması aşılmaya çalışılmadı).

---

## 4. NOAA NWS / SWPC

### 4a. Disclaimer — https://www.weather.gov/disclaimer
(https://www.swpc.noaa.gov/disclaimer → **404**; SWPC'nin 404 sayfasının alt bağlantısı da http://www.weather.gov/disclaimer'a gidiyor.)
> Use of NOAA/NWS Data and Products — The information on National Weather Service (NWS) Web pages are in the public domain, unless specifically noted otherwise, and may be used without charge for any lawful purpose so long as you do not: 1) claim it is your own (e.g., by claiming copyright for NWS information -- see below), 2) use it in a manner that implies an endorsement or affiliation with NOAA/NWS, or 3) modify its content and then present it as official government material. You also cannot present information of your own in a way that makes it appear to be official government information.
> Use of the NWS name ("National Weather Service") and/or visual identifier are protected under trademark law and may not be used without permission from the NWS. Use of the NWS name and/ or visual identifier to identify unaltered NWS content or links to NWS web sites are allowable uses. […] Neither the name nor visual identifier may be used, however, in a manner that implies an endorsement or affiliation with NOAA/NWS.
> […] The user assumes the entire risk related to its use of information on NWS Web pages. NWS is provides such information "as is," and NWS disclaims any and all warranties […]
> As required by 17 U.S.C. § 403, third parties producing copyrighted works consisting predominantly of the material appearing in NWS Web pages must provide notice with such work(s) identifying the NWS material incorporated and stating that such material is not subject to copyright protection.
- Kullanım (abuse) kuralları: "Know your data refresh frequency … Request only the data that you need … If a Web Service isn't available users should limit the number of retries to 1 minute intervals."
- **Zorunlu bir "credit line" cümlesi yok**; yalnızca 17 U.S.C. § 403 bildirimi (eser ağırlıklı olarak NWS malzemesiyse) ve onay/ilişki ima etmeme şartı.

### 4b. https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json (bir kez indirildi, 2026-11-08 19:00:56 GMT)
- Başlıklar: `HTTP/2 200`, `content-type: application/json`, `cache-control: max-age=60`, `last-modified: Sun, 08 Nov 2026 19:00:08 GMT`, **`access-control-allow-origin: *`**, `access-control-allow-methods: PUT, GET, POST, DELETE, OPTIONS`, CloudFront.
- **Yapı: başlık satırlı dizi-dizi DEĞİL; nesne dizisi.** 81 öğe, her biri:
  `{"time_tag":"2026-11-01T00:00:00","kp":4.67,"observed":"observed","noaa_scale":"G1"}`
  - `time_tag`: ISO, saat dilimi eki yok (3 saatlik aralık başı; UTC olduğu varsayılır [belgeyle doğrulanmadı])
  - `kp`: sayı (ör. 4.67, 0.33 — üçte birlik adımlar)
  - `observed`: "observed" (62) / "estimated" (2) / "predicted" (17)
  - `noaa_scale`: null (76) veya "G1" (5) — G ölçeği dizesi
  - Kapsam: 2026-11-01T00 → 2026-11-11T00 (geçmiş ~7 gün + ~3 gün tahmin).
- Eski sürümlerde bu ürünün `[["time_tag","kp","observed","noaa_scale"], [...]]` biçiminde olduğu biliniyor; **bugün okunan biçim nesne dizisi** — ayrıştırıcı ikisini de tolere etmeli.

---

## 5. GFZ Potsdam — Kp
- https://kp.gfz.de/en/ :
  > GFZ provides Kp and its derived indices and the figures on this website with the Creative Commons Attribution 4.0 International (CC BY 4.0) license. Please refer to GFZ German Research Centre for Geosciences as data source. GFZ contributes with Kp to the International Service of Geomagnetic Indices (ISGI) of IAGA. The indices and their provision (including a data publication with DOI) are described in Matzka et al. (2021).
  (bağlantılar: https://creativecommons.org/licenses/by/4.0/ , https://doi.org/10.1029/2020SW002641 , https://doi.org/10.5880/Kp.0001)
- Veri yayını https://doi.org/10.5880/Kp.0001 → https://dataservices.gfz.de/10.5880/kp.0001/geomagnetic-kp-index ; DataCite rights: "Creative Commons Attribution 4.0 International" (CC-BY-4.0), "Open access". Sayfadaki atıf (APA biçimi, aynen):
  > Matzka, J., Bronkalla, O., Tornow, K., Kirsten, E., & Stolle, C. (2021). Geomagnetic Kp index (Version 1.0) [Dataset]. GFZ Data Services. https://doi.org/10.5880/kp.0001
  (Not: meta veride "Kirsten, Elger" — muhtemelen Elger, Kirsten'in ad/soyad karışması; sayfada böyle yazıyor.)
- Makale (aynı sayfanın ilgili kaynak listesinde, aynen):
  > Matzka, J., Stolle, C., Yamazaki, Y., Bronkalla, O., & Morschhauser, A. (2021). The geomagnetic Kp index and derived indices of geomagnetic activity. Space Weather. https://doi.org/10.1029/2020sw002641
- Veri erişimi: https://kp.gfz.de/en/data — Web Service API örneği `https://kp.gfz.de/app/json/?start=…Z&end=…Z&index=Kp[&status=def]`; HTTPS "Kp and ap of the last 30 days, realtime" dosyaları. (Bu uçlar indirilmedi; CORS bilinmiyor.)
- https://www.gfz.de/en/section/geomagnetism/data-products-services/geomagnetic-kp-index → 404.

---

## Doğrulanamayan / açık kalanlar
1. EUMETView arayüzünde görünen bir lisans satırı (SPA) — okunamadı; yapılandırma "free", WMS "Fees none / AccessConstraints none", politika Core = CC BY 4.0.
2. Open-Meteo eski model adlarının (gfs_seamless, icon_seamless, gem_seamless, gem_global, ecmwf_ifs025 [ensemble'da]) sunucuda hâlâ geçerli olup olmadığı — API çağrılmadı.
3. Open-Meteo X-RateLimit başlıkları — belgelenmemiş; test edilmedi.
4. Open-Meteo çağrı-ağırlığı formülü — yalnızca doküman sayfasının JS tahmincisinden; sunucu sayacıyla eşitliği doğrulanmadı.
5. SWPC'ye özgü bir disclaimer sayfası — /disclaimer 404; SWPC weather.gov disclaimer'ına bağlanıyor.

# Ek B — Eşikler ve askıdaki olgular araştırması (ham notlar, alt ajan raporu, 2026-11-08)


Erişim tarihi: tüm kaynaklar 2026-11-08 (curl, User-Agent "urania-arastirma/1.0", ya da WebSearch).
Alıntılar sayfa metninden birebir alındı (HTML etiketleri ayıklandı, `λ⊙ = 283 ◦. 15` gibi PDF yazımları pdftotext çıktısıdır).
celestrak.org ve open-meteo uç noktalarına istek yapılmadı. OpenStax / CK-12 kullanılmadı.

---

## 1. BAA, "Dealing with dew"

URL: https://britastro.org/2021/dealing-with-dew (HTTP 200)
Yazar / tarih (sayfada): "2021 May 15", "David Arditti"

Bulut yokken soğuma / ışınım:
> "But why is our equipment colder than the air? The answer is the radiative transfer of heat. A cloudless sky has a radiative temperature of –20 to –100°C. Objects facing the cold night sky will try to reach radiative equilibrium with it, and cool down as a result. In still air, objects can cool to several degrees below the air temperature. Dark and transparent objects cool faster (hence the term ‘black-body radiation’), while reflective objects such as polished metal or aluminised plastic cool more slowly."

1–2 °C cümlesi:
> "In the UK, humidities of 50% or above, and temperatures between 5 and 15°C, are normal in the daytime. As the psychrometric chart shows, saturation occurs as this air falls to 0–5°C, which regularly occurs at night. Moreover, after a couple of hours under a clear sky, surfaces will commonly be 1–2°C cooler than the ambient air. Under these conditions, dewing is inevitable."

Rüzgâr:
> "The worst conditions typically are encountered on nights of good transparency, after the passing of a cold front, when an absence of high water vapour makes the sky colder. If rain has occurred earlier in the day, then humidity close to the ground will be very high. If there is little wind then there is little warming conduction to surfaces, hence they cool faster. All these factors together often give rise to mist and fog, but heavy dewing will occur first."

Diğer sayısal / ilgili:
> "With good shielding it is only necessary to heat them to a fraction of a degree above the air temperature to prevent dewing; such heating will not cause detectable aberrations or seeing effects."

Not: Makalede rüzgâr için SAYISAL eşik yok ("little wind", "still air").

---

## 2. "Hafif rüzgâr" için sayısal eşik

### 2a. Met Office — Beaufort ölçeği (resmî tanım, çiyle bağlantısı YOK)
URL: https://weather.metoffice.gov.uk/guides/coast-and-sea/beaufort-scale (HTTP 200)
Tablo satırları (sütunlar: Force | Mean Wind Speed Knots | ms-1 | Limits Knots | ms-1 | Wind descriptive terms):
> "0 | 0 | 0 | <1 | <1 | Calm"
> "1 | 2 | 1 | 1-3 | 1-2 | Light air"
> "2 | 5 | 3 | 4-6 | 2-3 | Light breeze"
> "3 | 9 | 5 | 7-10 | 4-5 | Gentle breeze"
Not satırı: > "To convert knots to mph multiply by 1.15, for m/s multiply by 0.514."
→ Light air 1–2 m/s (≈ 3,6–7,2 km/h, TÜRETİLMİŞ: ×3,6), Light breeze 2–3 m/s (≈ 7–11 km/h, TÜRETİLMİŞ).

### 2b. Ritter, Berkelhammer & Beysens 2019, HESS (hakemli; rüzgârı çiye bağlıyor, ama EŞİK değil OPTİMUM)
URL: https://hess.copernicus.org/articles/23/1179/2019/hess-23-1179-2019.html (HTTP 200)
Atıf (sayfada): "Ritter, F., Berkelhammer, M., and Beysens, D.: Dew frequency across the US from a network of in situ radiometers, Hydrol. Earth Syst. Sci., 23, 1179–1197, https://doi.org/10.5194/hess-23-1179-2019, 2019."
> "The high temporal resolution of our data showed that dew duration reaches maximum values ( ∼6 –15 h) for RH∼96 % and for a wind speed of ∼ 0.5 m s - 1 , independent of the ecosystem type."
> "Lastly, the wind speed increases the heat exchange between the cold surface and the air, thus lowering the available energy for condensation and eventually reducing the dew yield. It is also important to note that the two extreme cases where the relative humidity is at 100 % or the wind speed is close to 0 m s −1 are not beneficial for dew formation either. The radiative cooling is lowered or even canceled in the first case (“radiative fog”), and in the second case, some convection is needed to replenish the available water vapor in the boundary layer of the canopy."

### 2c. Mileta, Beysens, Nikolayev, Milimouk — "Fog and dew collection projects in Croatia" (arXiv:0707.2931; konferans bildirisi, hakem durumu sayfada belirtilmiyor)
URL: https://arxiv.org/pdf/0707.2931 (HTTP 200, PDF)
> "There are no striking differences between the sites, which all show larger dew yields for lower wind speeds, with an upper limit of order 4 m/s at 10 m. The average wind speeds where dew forms correspond to rather large speed (1-2 m/s), an order of magnitude higher than found in continental locations, of order 0.1 - 0.2 m/s (Beysens et al. 2005)."

SONUÇ: Rüzgârı çiye bağlayan evrensel resmî bir eşik (Met Office / WMO / NWS) BULUNAMADI. Bulunanlar: (i) Met Office Beaufort tanımı (çiyden bağımsız), (ii) hakemli ölçüm: çiy süresi en uzun ≈0,5 m/s'de (eşik değil optimum; tam durgunluk da elverişsiz), (iii) Hırvatistan kıyı ölçümleri: 10 m'de ≈4 m/s üst sınır, karasal yerlerde çiy 0,1–0,2 m/s'de (ikincil atıf: Beysens et al. 2005, birincil kaynağı okumadım). Not: ölçüm yüksekliği önemli (10 m standart rüzgâr ≠ yüzey yanı rüzgâr).

---

## 3. WMO — sis (fog), pus (mist), kuru pus (haze)

### 3a. International Cloud Atlas — Fog compared with Mist
URL: https://cloudatlas.wmo.int/en/fog-compared-with-mist.html (HTTP 200)
> "The term “fog” is used when microscopic droplets reduce horizontal visibility at the Earth’s surface to less than 1 km, while the term “mist” is used when the droplets do not reduce horizontal visibility to less than 1 km. In practice, mist is considered synonymous with “light fog”."
> "“Fog” forms a whitish veil that covers the landscape, while “mist” generally forms a fairly thin, greyish veil."
(Cloud Atlas'ta mist için ÜST sınır yok. https://cloudatlas.wmo.int/en/mist.html → 404.)

URL: https://cloudatlas.wmo.int/en/fog.html (HTTP 200)
> "Definition : Fog: A suspension of very small, usually microscopic water droplets in the air, reducing visibility at the Earth’s surface."

### 3b. Cloud Atlas — Haze
URL: https://cloudatlas.wmo.int/en/haze.html (HTTP 200)
> "Definition : Haze: A suspension in the air of extremely small, dry particles invisible to the naked eye and sufficiently numerous to give the air an opalescent appearance."
> "As light is scattered by haze particles, distant bright objects or lights seen through the haze appear yellowish or reddish, while dark objects appear bluish."

### 3c. WMO-No. 8 (CIMO Guide), Bölüm 14 — 2018 baskısı ön sürüm (old.wmo.int)
URL: https://old.wmo.int/extranet/pages/prog/www/IMOP/publications/CIMO-Guide/Prelim_2018_ed/8_I_14_en_MR_clean.pdf (HTTP 200)
Bölüm 14.2.2.1:
> "In reports taking into account the atmospheric conditions during the last hour, haze should be distinguished from mist or water fog. With haze, the air is relatively dry, whereas with mist or water fog, there is usually evidence of high humidity in the form of water droplets or rime on grass, leaves, etc. If the station is equipped with measuring instruments, it is fairly safe to assume that the obscurity is haze if the relative humidity is less than a certain percentage, for example 80 %, and if the visibility is within certain limit values, for example, greater than 1 km in the horizontal, and greater than 2 km in the vertical. Mist is to be reported at high humidity values and at a visibility of 1 km or more. In synoptic reporting, fog is regarded as applying to water or ice fogs, generally reducing the horizontal visibility at the Earth’s surface to less than 1 km. Wherever the term “fog” occurs in present weather and past weather codes, it should be read in this sense. In climatological summaries, however, all occasions of visibility of less than 1 km are regarded as fog."
(Not: bu "Prelim 2018 ed." dosyası; güncel 2024 baskısının metniyle karşılaştırılmadı.)

### 3d. 5 km üst sınırı — WMO-No. 49, Technical Regulations Vol. II (havacılık; METAR/SPECI), 2018 baskısı, 2021 güncellemesi
URL (WMO'nun değil, Moğolistan meteoroloji servisinin kopyası): https://amc2.namem.gov.mn/uploads/content/WMO/2-%20WMO-No49_Vol-II_2018-upd-2021_Met-Service_en.pdf (HTTP 200; kapakta "WMO-No. 49 … Volume II – Meteorological Service for International Air Navigation 2018 edition Updated in 2021")
Madde 4.4.2.3 (sayfa 81–82):
> "(b) Obscurations (hydrometeors) Fog FG – Reported when visibility is less than 1 000 m, except when qualified by “MI”, “BC”, “PR” or “VC” (see 4.4.2.6 and 4.4.2.8 below) Mist BR – Reported when visibility is at least 1 000 m but not more than 5 000 m"
> "(c) Obscurations (lithometeors) – The following should be used only when the obscuration consists predominantly of lithometeors and the visibility is 5 000 m or less except “SA” when qualified by “DR” (see 4.4.2.6 below) and volcanic ash. Sand SA Dust (widespread) DU Haze HZ Smoke FU Volcanic ash VA"
DİKKAT: 1–5 km aralığı HAVACILIK raporlama kuralıdır (METAR/SPECI); Cloud Atlas ve CIMO Guide mist için üst sınır vermiyor. WMO Codes Registry (https://codes.wmo.int/49-2/WeatherCausingVisibilityReduction/BR) yalnız "Mist" etiketi veriyor, eşik yok.

---

## 4. W ve Z bozonlarının ömrü

### 4a. en.wikipedia "W and Z bosons"
URL: https://en.wikipedia.org/wiki/W_and_Z_bosons (HTTP 200)
> "All three of these particles are very short-lived, with a half-life of about 3 × 10 −25 s ."
Bilgi kutusu: > "Decay width W: 2.085 ± 0.042 GeV [ 1 ] Z: 2.4955 ± 0.0023 GeV [ 2 ]"
→ Wikipedia "mean lifetime" DEMİYOR; "half-life" diyor. Bilgi kutusunda ömür değil bozunma genişliği var.

### 4b. PDG Summary Tables 2025 (Gauge & Higgs bosons)
URL: https://pdg.lbl.gov/2025/tables/rpp2025-sum-gauge-higgs-bosons.pdf (HTTP 200)
Atıf (PDF): "Citation: S. Navas et al. (Particle Data Group), Phys. Rev. D 110, 030001 (2024) and 2025 update"
> W: "m = 80.3692 ± 0.0133 GeV" … "Full width Γ = 2.14 ± 0.05 GeV (S = 1.7)"
> Z: "Mass m = 91.1880 ± 0.0020 GeV [e]" … "Full width Γ = 2.4955 ± 0.0023 GeV"
PDF'te "lifetime" sözcüğü W/Z için GEÇMİYOR (grep: 0 eşleşme). PDG ömür vermiyor, tam genişlik (Γ) veriyor.

ħ: https://pdg.lbl.gov/2025/reviews/rpp2025-rev-phys-constants.pdf
> "Planck constant, reduced ~ ≡ h/2π 1.054 571 817. . . × 10−34 Js exact∗ = 6.582 119 569. . . × 10 −22 MeV s exact∗"

TÜRETİLMİŞ (alıntı DEĞİL, hesap τ = ħ/Γ): W ≈ 6,582e-22 MeV·s / 2140 MeV ≈ 3,08 × 10⁻²⁵ s (Wikipedia'nın 2,085 GeV'i ile ≈ 3,16 × 10⁻²⁵ s); Z ≈ 6,582e-22 / 2495,5 ≈ 2,64 × 10⁻²⁵ s. ħ/Γ ortalama ömürdür (mean lifetime); yarı ömür = τ·ln2 olurdu (≈ 2,1 × 10⁻²⁵ / 1,8 × 10⁻²⁵ s). Yani Wikipedia'daki "half-life of about 3 × 10⁻²⁵ s" ifadesi aslında ortalama ömre karşılık gelen değerdir — terim tutarsızlığı. Uygulamada "ortalama ömür ≈ 3 × 10⁻²⁵ s (PDG Γ'dan τ = ħ/Γ)" yazmak savunulabilir; "yarı ömür" yazılmamalı.

---

## 5. IMO 2027 Meteor Shower Calendar — Quadrantidler

Duyuru: https://www.imo.net/meteor-shower-calendar-2027/ (HTTP 200)
> "Meteor Shower Calendar 2027 6 July 2026 · Vincent Perlerin The IMO Meteor Shower Calendar 2027 Is Now Available The International Meteor Organization has released its Meteor Shower Calendar 2027, edited by Jürgen Rendtel."
> "Highlights for 2027 include favorable viewing conditions for the Quadrantids, …"

Takvim PDF: https://imo.net/files/meteor-shower/cal2027.pdf (HTTP 200, 28 sayfa; başlık "IMO INFO(3-26) … International Meteor Organization 2027 Meteor Shower Calendar edited by Jürgen Rendtel")
> "The first of the large annual showers, the Quadrantids (010 QUA), peak on January 4 shortly after 03h UT."
> "Quadrantids (010 QUA) Active: December 28–January 12; Maximum: January 4, 03h 25m UT (λ⊙ = 283 ◦. 15), ZHR = 80 (can vary ≈ 60 − 200); Radiant: α = 230◦ , δ = +49◦ ; Radiant drift: see Table 6; V∞ = 41 km/s; r = 2.1 at maximum, 2.5 elsewhere."
> "Gaps in the temporal coverage lead to an uncertainty of about 0 ◦. 1 (i.e. about 2.5 hours) for the peak timing. Checking different data sets, we may conclude that the peak is to be expected near the 283 ◦. 15 reference position."
> "Vaubaillon emphasizes that the stream is slightly shifted towards the Sun in 2027 which might cause enhanced activity. Conditions are perfect concerning the moonlight."
Tablo 5 satırı: > "Quadrantids (010 QUA) Dec 28–Jan 12 Jan 04 283 ◦. 15 230◦ +49◦ 41 2.1 80+"
→ Maksimum 2027-01-04 03:25 UT, λ☉ = 283,15°, belirsizlik ≈ ±0,1° (≈ 2,5 saat). (283 ◦. 15 = 283,15°; PDF'in ondalık yazımı.)

---

## 6. TDK Güncel Türkçe Sözlük + tr.wikipedia yazımları

### 6a. "gök taşı" (ayrı)
URL: https://sozluk.gov.tr/gts?ara=g%C3%B6k%20ta%C5%9F%C4%B1 (HTTP 200, JSON)
> "madde":"gök taşı" … "anlam":"Gezegenlerin arasında hareket eden, tümüyle gaz durumuna geçmeden yeryüzüne ulaşan katı cisim; hava taşı, şimşek taşı, uzay taşı, meteor, meteor taşı, meteorit" … "tam_adi":"isim","kisa_adi":"a." … "tam_adi":"gök bilimi","kisa_adi":"gök b."

### 6b. "göktaşı" (bitişik)
URL: https://sozluk.gov.tr/gts?ara=g%C3%B6kta%C5%9F%C4%B1 (HTTP 200)
> {"error":"Sonuç bulunamadı"}
→ TDK madde başı AYRI: "gök taşı". Bitişik yazım GTS'de yok.

### 6c. tr.wikipedia — Zeldoviç
URL: https://tr.wikipedia.org/wiki/Yakov_Zeldovi%C3%A7 (HTTP 200)
> "<title>Yakov Zeldoviç - Vikipedi"
Bilgi kutusunda doğum adı: "Yakov Borisovich Zeldovich (Я́ков Бори́сович Зельдо́вич)"
→ Madde başlığı "Yakov Zeldoviç" (ç ile) doğrulandı. Ancak aynı sayfada etki adı "Sunyaev-Zeldovich etkisi" (ch ile) geçiyor.

URL: https://tr.wikipedia.org/wiki/Sunyaev-Zeldovich_etkisi (HTTP 200)
> "<title>Sunyaev-Zeldovich etkisi - Vikipedi"
→ tr.wikipedia'da kişi "Zeldoviç", etki "Sunyaev-Zeldovich etkisi" (kısa çizgi, ch). İkisi tutarsız; uygulama hangisini seçerse bilinçli seçmeli.
