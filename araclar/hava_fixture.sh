#!/usr/bin/env bash
# v44 hava kartları: dış servislerin GERÇEK yanıtlarını test fixture'ı olarak kaydeder (testler/veri/hava/).
# Testler ağa çıkmaz; bu betik yalnız fixture yenilemek için elle çalıştırılır. Konum iki ondalık (İstanbul varsayılanı 41.00, 29.10).
# Kullanım: bash araclar/hava_fixture.sh [eumetsat|openmeteo|kp|hepsi]   (varsayılan: hepsi)
# Open-Meteo: ensemble isteği ~16 "çağrı" sayılır (161 senaryo × 1 değişken / 10); günlük ücretsiz sınır 10 000.
set -euo pipefail
cd "$(dirname "$0")/../testler/veri/hava"
UA="urania-fixture/1.0"     # genel ad; e-posta ya da kişisel veri yok
E=41.00; B=29.10
GUN=$(date -u +%F)
ne="${1:-hepsi}"
al() { curl -sS -m 90 -A "$UA" -D "$2.baslik.txt" "$1" -o "$2"; }

if [[ $ne == openmeteo || $ne == hepsi ]]; then
  # past_days=1: içinde bulunulan gece de yanıtta (UTC gece yarısından sonra kaydedilince önceki akşam da gelsin)
  al "https://api.open-meteo.com/v1/forecast?latitude=$E&longitude=$B&hourly=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,relative_humidity_2m,wind_speed_10m,precipitation_probability,precipitation,temperature_2m,dew_point_2m,apparent_temperature,wind_gusts_10m,visibility&timezone=GMT&timeformat=unixtime&forecast_days=7&past_days=1" "om_${GUN}_${E}_${B}.json"
  al "https://api.open-meteo.com/v1/forecast?latitude=$E&longitude=$B&hourly=cloud_cover&models=ecmwf_ifs025,ncep_gfs_seamless,dwd_icon_seamless,ukmo_seamless,meteofrance_seamless,cmc_gem_seamless&timezone=GMT&timeformat=unixtime&forecast_days=3&past_days=1" "mdl_${GUN}_${E}_${B}.json"
  al "https://ensemble-api.open-meteo.com/v1/ensemble?latitude=$E&longitude=$B&hourly=cloud_cover&models=ecmwf_ifs025_ensemble,dwd_icon_seamless_eps,ncep_gefs_seamless,gem_global_ensemble,ukmo_global_ensemble_20km&timezone=GMT&timeformat=unixtime&forecast_days=3&past_days=1" "ens_${GUN}_${E}_${B}.json"
  al "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=$E&longitude=$B&hourly=aerosol_optical_depth,dust&timezone=GMT&timeformat=unixtime&forecast_days=5&past_days=1" "aq_${GUN}_${E}_${B}.json"
fi
if [[ $ne == kp || $ne == hepsi ]]; then
  al "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json" "kp_${GUN}.json"
fi
if [[ $ne == eumetsat || $ne == hepsi ]]; then
  W=https://view.eumetsat.int/geoserver
  for l in mtg_fd/rgb_geocolour mtg_fd/ir105_hrfi msg_fes/clm mtg_fd/h40b; do
    al "$W/$l/ows?service=WMS&version=1.3.0&request=GetCapabilities" "eum_cap_${l/\//_}.xml"
  done
  al "$W/msg_fes/ows?service=WMS&version=1.3.0&request=GetLegendGraphic&format=image%2Fpng&width=640&height=80&layer=clm" eum_clm_lejant.png
  echo "GetMap ve GetFeatureInfo adresleri uygulamanın kurduğu adreslerdir (HavaKart.hesap.haritaUrl / maskeUrl); README_hava.md'deki komutlarla alınır."
fi
# Bedel ve sınır başlıkları (Open-Meteo X-RateLimit-*; belgelenmemiş) ve CORS: ekrana yazılır, başlık dosyaları silinir
grep -iH 'x-ratelimit\|access-control-expose\|access-control-allow-origin' ./*.baslik.txt || true
rm -f ./*.baslik.txt
ls -la
