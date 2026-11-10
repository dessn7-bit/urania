#!/usr/bin/env bash
# Yayın kapısının kayıt (issue) adımı. "ac": düşen denetimi, a–c çıktılarını ve test özetini kayda yazar (açık kayıt varsa
# ona yorum ekler). main'de etiket "yayın durdu" (haftalık haber işi bunu okur); deneme/… dallarında "yayın denemesi"
# (canlı siteyle ilgisi yok). "kapat": main yeniden yayınlanınca açık "yayın durdu" kayıtlarını not düşerek kapatır.
# GH_TOKEN (iş akışının jetonu) ile gh CLI kullanır. Günlüğe ve kayda kişisel veri yazılmaz; çıktıdan yalnız özet alınır.
set -u
SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
KISA="${SHA:0:7}"
DAL="${GITHUB_REF_NAME:-main}"
if [ "$DAL" = "main" ]; then
  ETIKET="yayın durdu"
  gh label create "$ETIKET" --color B60205 --description "Yayın kapısı düştü; gh-pages değişmedi" >/dev/null 2>&1 || true
else
  ETIKET="yayın denemesi"
  gh label create "$ETIKET" --color FBCA04 --description "Kapı bir deneme dalında düştü; canlı siteyle ilgisi yok" >/dev/null 2>&1 || true
fi
acik=$(gh issue list --label "$ETIKET" --state open --json number --jq '.[].number' 2>/dev/null || true)
if [ "${1:-}" = "kapat" ]; then
  [ "$DAL" = "main" ] || exit 0
  for n in $acik; do
    gh issue close "$n" --comment "Yayın yeniden geçti: ${KISA}. gh-pages main'e eşitlendi." >/dev/null && echo "kapatıldı: #$n"
  done
  exit 0
fi
dusen=""
for c in "JSON:${SONUC_JSON:-}" "ESLint:${SONUC_ESLINT:-}" "html-validate:${SONUC_HTML:-}" "Playwright:${SONUC_TEST:-}" "gh-pages'e gönderim:${SONUC_YAYIN:-}" "Pages dağıtımı:${SONUC_CANLI:-}"; do
  ad="${c%%:*}"; s="${c#*:}"
  [ "$s" = "failure" ] && dusen="${dusen}${dusen:+, }${ad}"
done
[ -z "$dusen" ] && dusen="kurulum adımı"
{
  if [ "$DAL" != "main" ]; then
    echo "Kapı denemesi: **${DAL}** dalındaki **${KISA}** denetimden geçmedi. Bu bir deneme dalıdır; canlı site (gh-pages) bu daldan hiçbir zaman yayınlanmaz."
  elif [ "${SONUC_CANLI:-}" = "failure" ]; then
    echo "Yayın tamamlanmadı: **${KISA}** bütün denetimlerden geçti ve gh-pages güncellendi, ama 20 dakika içinde canlı sitede yeni sürüm görünmedi (GitHub Pages dağıtımı takıldı). Repository → Actions → \"pages build and deployment\" yeniden çalıştırılabilir ya da main'e bir sonraki gönderim yeniden dener."
  else
    echo "Yayın durdu: ${DAL} dalındaki **${KISA}** denetimden geçmedi, canlı site (gh-pages) değiştirilmedi."
  fi
  echo
  echo "- Commit: ${KISA} — $(git log -1 --format=%s "$SHA" | head -c 200)"
  echo "- Düşen denetim: ${dusen}"
  echo "- Çalışma: ${CALISMA_URL:-}"
  echo
  for c in "a) JSON:kapi-json.txt:${SONUC_JSON:-}" "b) ESLint:kapi-eslint.txt:${SONUC_ESLINT:-}" "c) html-validate:kapi-html.txt:${SONUC_HTML:-}"; do
    ad="${c%%:*}"; r="${c#*:}"; dosya="${r%%:*}"; s="${r#*:}"
    if [ "$s" = "failure" ] && [ -f "$dosya" ]; then
      echo "### ${ad} çıktısı (ilk 40 satır)"
      echo '```'
      grep -v '^[[:space:]]*$' "$dosya" | sed "s#$(pwd)/##g" | head -40 | cut -c1-220
      echo '```'
      echo
    fi
  done
  if [ "${SONUC_TEST:-}" = "failure" ] && [ -f test-cikti.txt ]; then
    echo "### Test özeti"
    echo '```'
    grep -E '^[[:space:]]+[0-9]+ (passed|failed|flaky|skipped)' test-cikti.txt | tail -5
    grep -E '^[[:space:]]+[0-9]+\) ' test-cikti.txt | head -30 | cut -c1-220
    echo '```'
    echo
    echo "### İlk hataların ayrıntısı (kısaltılmış)"
    echo '```'
    grep -E -A6 '^[[:space:]]+(Error|expect)' test-cikti.txt | head -60 | cut -c1-220
    echo '```'
  fi
  echo
  if [ "$DAL" = "main" ]; then
    echo "Düzeltip main'e yeniden gönderince kapı yeniden çalışır; geçerse bu kayıt kendiliğinden kapanır."
  else
    echo "Deneme bitince bu kayıt elle kapatılabilir; main'in yayınını etkilemez."
  fi
} > kapi_ozet.md
if [ -n "$acik" ]; then
  n=$(echo "$acik" | head -1)
  gh issue comment "$n" --body-file kapi_ozet.md >/dev/null && echo "yorum eklendi: #$n"
else
  if [ "$DAL" = "main" ]; then baslik="Yayın durdu: main ${KISA} (${dusen})"; else baslik="Kapı denemesi: ${DAL} ${KISA} (${dusen})"; fi
  gh issue create --title "$baslik" --label "$ETIKET" --body-file kapi_ozet.md
fi
