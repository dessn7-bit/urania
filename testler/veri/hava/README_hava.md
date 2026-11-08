# Hava kartı fixture'ları (v44)

Testler ağa çıkmaz; buradaki dosyalar dış servislerin **gerçek** yanıtlarıdır. Konum İstanbul varsayılanı, iki ondalık: 41.00, 29.10.
Yenilemek: `bash araclar/hava_fixture.sh [eumetsat|openmeteo|kp|hepsi]`.

| Dosya | Servis | Kayıt (UTC) | Not |
|---|---|---|---|
| `eum_cap_*.xml` | EUMETView WMS GetCapabilities (katman başına) | 2026-11-08 19.01 | en son zaman: geocolour 18.40, IR 18.40, clm 18.30, h40b 18.20 |
| `eum_harita_{renk,kizilotesi,maske,yagis}.jpg` | EUMETView GetMap, 800×600, kıyı çizgisi bindirili | 2026-11-08 19.16 | adresler `HavaKart.hesap.haritaUrl` ile kuruldu (bbox 38.50,24.68,43.50,33.52) |
| `eum_gfi_clm_41.00_29.10.json` | GetFeatureInfo, bulut maskesi | 2026-11-08 19.16 | (0,192,0) = karada açık |
| `eum_clm_lejant.png` | GetLegendGraphic, bulut maskesi | 2026-11-08 19.01 | mavi denizde açık, yeşil karada açık, beyaz bulut |
| `aq_2026-11-08_41.00_29.10.json` | Open-Meteo Air Quality (aerosol_optical_depth, dust) | 2026-11-08 19.01 | past_days=1, forecast_days=5 |
| `kp_2026-11-08.json` | NOAA SWPC noaa-planetary-k-index-forecast.json | 2026-11-08 19.01 | nesne dizisi; observed/estimated/predicted |
| `om_2026-11-09_41.00_29.10.json` | Open-Meteo forecast, 13 değişken, 7 gün + past_days=1 | 2026-11-09 00.0x | 8 Kasım akşamı IP'nin günlük sınırı dolmuştu (429); sınır UTC gece yarısı sıfırlanınca kaydedildi, past_days=1 ile 8→9 Kasım gecesi de içinde |
| `mdl_2026-11-09_41.00_29.10.json` | Open-Meteo forecast, `models=` 6 model, cloud_cover | 2026-11-09 00.0x | aynı |
| `ens_2026-11-09_41.00_29.10.json` | Open-Meteo Ensemble, 5 model (161 senaryo), cloud_cover | 2026-11-09 00.0x | aynı |

Testte değiştirilen alanlar (yalnız eşik sınaması için, test dosyasında yazılı): çiy noktası (çiğ), görüş (sis), bir Kp tahmini (uyarı), bulut maskesi rengi (bulutlu rozeti).
