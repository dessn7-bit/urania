#!/usr/bin/env bash
# Yayın kapısının kayıt (issue) adımı. "ac": düşen denetimi ve test özetini "yayın durdu" etiketli kayda yazar (açık kayıt
# varsa ona yorum ekler). "kapat": yayın yeniden geçince açık "yayın durdu" kayıtlarını not düşerek kapatır.
# GH_TOKEN (iş akışının jetonu) ile gh CLI kullanır. Günlüğe ve kayda kişisel veri yazılmaz; çıktıdan yalnız özet alınır.
set -u
ETIKET="yayın durdu"
SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
KISA="${SHA:0:7}"
gh label create "$ETIKET" --color B60205 --description "Yayın kapısı düştü; gh-pages değişmedi" >/dev/null 2>&1 || true
acik=$(gh issue list --label "$ETIKET" --state open --json number --jq '.[].number' 2>/dev/null || true)
if [ "${1:-}" = "kapat" ]; then
  for n in $acik; do
    gh issue close "$n" --comment "Yayın yeniden geçti: ${KISA}. gh-pages main'e eşitlendi." >/dev/null && echo "kapatıldı: #$n"
  done
  exit 0
fi
dusen=""
for c in "JSON:${SONUC_JSON:-}" "ESLint:${SONUC_ESLINT:-}" "html-validate:${SONUC_HTML:-}" "Playwright:${SONUC_TEST:-}"; do
  ad="${c%%:*}"; s="${c#*:}"
  [ "$s" = "failure" ] && dusen="${dusen}${dusen:+, }${ad}"
done
[ -z "$dusen" ] && dusen="kurulum adımı"
{
  echo "Yayın durdu: main'deki **${KISA}** denetimden geçmedi, canlı site (gh-pages) değiştirilmedi."
  echo
  echo "- Commit: ${KISA} — $(git log -1 --format=%s "$SHA" | head -c 200)"
  echo "- Düşen denetim: ${dusen}"
  echo "- Çalışma: ${CALISMA_URL:-}"
  echo
  if [ -f test-cikti.txt ]; then
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
  echo "Düzeltip main'e yeniden gönderince kapı yeniden çalışır; geçerse bu kayıt kendiliğinden kapanır."
} > kapi_ozet.md
if [ -n "$acik" ]; then
  n=$(echo "$acik" | head -1)
  gh issue comment "$n" --body-file kapi_ozet.md >/dev/null && echo "yorum eklendi: #$n"
else
  gh issue create --title "Yayın durdu: ${KISA} (${dusen})" --label "$ETIKET" --body-file kapi_ozet.md
fi
