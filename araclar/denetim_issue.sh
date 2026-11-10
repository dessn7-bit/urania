#!/usr/bin/env bash
# Haftalık denetimin kayıt (issue) adımı. Her bölüm için bulgu varsa "denetim" etiketli kayıt açar; aynı başlıkta açık kayıt
# varsa ona bu haftanın tablosunu yorum olarak ekler. Bütün özet iş akışı sayfasına (GITHUB_STEP_SUMMARY) da yazılır.
# Kullanım: bash araclar/denetim_issue.sh <klasör>   (GH_TOKEN gerekli; KURU=1 ile yalnız ne yapılacağını yazar)
set -u
KL="${1:-denetim}"
ETIKET="denetim"
[ -z "${KURU:-}" ] && gh label create "$ETIKET" --color 0E8A16 --description "Haftalık denetim bulgusu (araclar/denetim.py)" >/dev/null 2>&1 || true
TARIH=$(date -u +%Y-%m-%d)
ozet="${GITHUB_STEP_SUMMARY:-/dev/null}"
echo "# Haftalık denetim, ${TARIH}" >> "$ozet"
kayit() {   # $1 başlık, $2 gövde dosyası
  if [ -n "${KURU:-}" ]; then echo "KAYIT: $1"; return; fi
  n=$(gh issue list --label "$ETIKET" --state open --search "\"$1\" in:title" --json number,title --jq ".[] | select(.title == \"$1\") | .number" | head -1)
  if [ -n "$n" ]; then gh issue comment "$n" --body-file "$2" >/dev/null && echo "yorum: #$n $1"
  else gh issue create --title "$1" --label "$ETIKET" --body-file "$2" && echo "açıldı: $1"; fi
}
govde() {   # $1 md dosyası → gövde
  { echo "Haftalık denetim, ${TARIH}. Çalışma: ${CALISMA_URL:-}"; echo; cat "$1"; echo; echo "_Kendiliğinden düzeltme yapılmadı. Haftalık haber görevi bu kaydı okuyup Türkçe raporunun \"Denetim\" bölümüne yazar (arastirma/haberler/YONTEM.md)._"; } > "$KL/govde.md"
  echo "$KL/govde.md"
}
calismayan=""
for c in "lychee:${SONUC_LYCHEE:-}" "bağlantı:${SONUC_BAGLANTI:-}" "alıntı:${SONUC_ALINTI:-}" "gök:${SONUC_GOK:-}" "kütüphane:${SONUC_KUTUPHANE:-}"; do
  [ "${c#*:}" = "failure" ] && calismayan="${calismayan}${calismayan:+, }${c%%:*}"
done
for b in baglanti alinti gok kutuphane; do
  if [ -f "$KL/$b.md" ]; then cat "$KL/$b.md" >> "$ozet"; else echo "## $b: bu adım sonuç üretmedi" >> "$ozet"; fi
done
if [ -f "$KL/baglanti_yeni_sayi.txt" ] && [ "$(cat "$KL/baglanti_yeni_sayi.txt")" != "0" ]; then kayit "Denetim: yeni kırık bağlantı" "$(govde "$KL/baglanti.md")"; fi
if [ -f "$KL/alinti_sayi.txt" ] && [ "$(cat "$KL/alinti_sayi.txt")" != "0" ]; then kayit "Denetim: değişen kaynak" "$(govde "$KL/alinti.md")"; fi
if [ -f "$KL/gok_sayi.txt" ] && [ "$(cat "$KL/gok_sayi.txt")" != "0" ]; then kayit "Denetim: Horizons farkı" "$(govde "$KL/gok.md")"; fi
if [ -f "$KL/kutuphane_sonuc.json" ]; then
  python3 -c "import json,sys;[print(x['ad']+' '+x['npm_son']) for x in json.load(open(sys.argv[1])) if x['yeni']]" "$KL/kutuphane_sonuc.json" | while read -r ad surum; do
    kayit "Denetim (bilgi): ${ad} ${surum} çıktı" "$(govde "$KL/kutuphane.md")"
  done
fi
if [ -n "$calismayan" ]; then
  echo "Şu denetim adımları çalışmadı: ${calismayan}. Günlüğe bak: ${CALISMA_URL:-}" > "$KL/calismayan.md"
  kayit "Denetim: adım çalışmadı" "$(govde "$KL/calismayan.md")"
fi
exit 0
