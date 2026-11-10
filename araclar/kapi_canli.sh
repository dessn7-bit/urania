#!/usr/bin/env bash
# Yayın kapısının canlı doğrulaması (v49). Kullanım: kapi_canli.sh <önceki gh-pages sha'sı (boş olabilir)>
# Bu commit'te değişen ve uygulamanın sunduğu dosyaların (sw.js ASSETS listesi + sw.js; en çok 25) canlı sitedeki sha256'sı
# commit'tekiyle aynı olana dek 30 s arayla en çok 40 kez bakar (≈ 20 dk). Depo herkese açık: günlüğe yalnız dosya adı ve
# sürüm yazılır.
set -u
ONCEKI="${1:-}"
SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
TABAN="https://${GITHUB_REPOSITORY_OWNER}.github.io/${GITHUB_REPOSITORY#*/}"
UA="urania-yayin/1.0 (+https://github.com/${GITHUB_REPOSITORY})"
surum=$(grep -o "const SURUM = '[^']*'" sw.js | cut -d"'" -f2)
varliklar=$(sed -n '/^const ASSETS = \[/,/\];/p' sw.js | grep -o "'\./[^']*'" | tr -d "'" | sed 's#^\./##' | grep -v '^$')
degisen=""
[ -n "$ONCEKI" ] && { git cat-file -e "${ONCEKI}^{commit}" 2>/dev/null || git fetch --no-tags --depth=1 origin "$ONCEKI" >/dev/null 2>&1; }
if [ -n "$ONCEKI" ] && git cat-file -e "${ONCEKI}^{commit}" 2>/dev/null; then
  degisen=$(git diff --name-only "$ONCEKI" "$SHA" 2>/dev/null || true)
fi
dosyalar=$( { echo sw.js; echo "$degisen" | grep -Fxf <(echo "$varliklar") || true; } | sort -u | head -25)
echo "canlı karşılaştırılacak: $(echo "$dosyalar" | wc -l) dosya (sürüm ${surum})"
for i in $(seq 1 40); do
  eksik=""
  for f in $dosyalar; do
    yerel=$(sha256sum "$f" | cut -d' ' -f1)
    canli=$(curl -fsS -A "$UA" "${TABAN}/${f}?t=$(date +%s)" 2>/dev/null | sha256sum | cut -d' ' -f1)
    [ "$yerel" = "$canli" ] || eksik="${eksik} ${f}"
  done
  if [ -z "$eksik" ]; then echo "canlı: ${surum}, değişen dosyalar aynı"; exit 0; fi
  sleep 30
done
echo "20 dakikada canlı sitede eşleşmeyen:${eksik}"
exit 1
