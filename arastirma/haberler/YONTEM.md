# Urania "Haberler" sekmesi — haber ekleme yöntemi

This is the standing procedure for adding astronomy news to Urania. The first set was written on 30 October 2026, and a weekly scheduled task follows this file. Kaan reads Turkish and is a curious adult with no physics background. He lives in Istanbul (Fetih Mahallesi, Ataşehir) and owns 7×50 binoculars.

## Where the data lives
`veri/haberler.json`:
```json
{
  "guncelleme": "YYYY-MM-DD",
  "haberler": [
    {
      "id": "YYYY-MM-DD-kisa-ad",          // unique, ASCII, lowercase, hyphens; date = original publication date
      "tarih": "YYYY-MM-DD",               // original publication / announcement date
      "eklenme": "YYYY-MM-DD",             // date added to Urania
      "tur": "haber" | "arastirma" | "gorev" | "gokyuzu",
      "baslik": "Türkçe başlık, en çok ~90 karakter, merak uyandıran ama abartısız",
      "ozet": ["paragraf 1", "paragraf 2", "..."],   // 120–260 words in total, plain Turkish; define every term the first time it appears
      "neden_onemli": "1–2 cümle: bu neden önemli, neyi değiştiriyor",
      "kesinlik": "kesin" | "ön sonuç" | "tartışmalı",   // e.g. a preprint not yet peer reviewed = "ön sonuç"
      "istanbul": "optional: what Kaan can see or do from Istanbul (only if true and sourced)",
      "ilgili_dersler": ["d13"],           // existing lesson ids from veri/dersler.json (0–3)
      "makale": { "baslik": "...", "yazarlar": "Soyad vd.", "dergi": "Nature / ApJ / arXiv ön baskı", "url": "https://..." },   // optional; for research items
      "kaynaklar": [ { "ad": "NASA: ...", "url": "https://...", "tarih": "YYYY-MM-DD" } ]   // ≥ 2 independent sources (the primary one first)
    }
  ]
}
```
Newest first. Keep at most 120 items; drop the oldest beyond that.

Types:
- haber: a discovery or announcement.
- arastirma: a specific paper, peer reviewed or arXiv.
- gorev: a space mission event (launch, arrival, result).
- gokyuzu: a newsworthy sky event visible from Istanbul (a bright comet, a nova, an unusual conjunction). The Gökyüzü tab already computes routine events, so only add sky items that are genuinely news.

## Rules (non-negotiable)
- Every fact, number, date and name must be verified against the primary source: the agency or observatory press release (NASA, ESA, ESO, NOIRLab, JPL, JAXA, CNSA, ISRO, TUA), the paper itself (journal or arXiv), or the institution's release. Add at least one independent second source (Science News, Nature News, Sky & Telescope, Space.com, Phys.org, AAS Nova, Quanta Magazine, New Scientist …).
- Never write from memory. If you cannot confirm something, leave it out.
- Write in your own words. Do not copy or translate press-release sentences.
- No hype. "Yaşam bulundu" or "Einstein yanıldı" only if the source literally says so; otherwise say what was actually measured. Mark preprints "ön sonuç". Present contested claims as contested.
- Do NOT use OpenStax or CK-12. Never contact celestrak.org. Do not bypass bot checks. Kaan approved fetching any website without asking.
- No duplicates. Check the existing ids and titles, and the same story under a different title.
- Pick a mix: big discoveries (JWST, ESO, LIGO/Virgo/KAGRA, Rubin Observatory, Gaia, Euclid, solar missions, planetary missions), interesting papers, and anything Turkey-related only from official sources. Aim for 5–10 items per weekly run, roughly one week of news.

## After editing
1. `cd /home/claude/urania && python3 -c "import json;json.load(open('veri/haberler.json'))"`.
2. `npx playwright test testler/haberler.spec.js` must be green.
3. Bump `SURUM` in sw.js by one (urania-vNN → vNN+1).
4. Commit as author "Kaan <dessn7@gmail.com>", with message "Haberler: <tarih> haftası (<n> yeni)", ending with the Co-Authored-By / Claude-Session lines required by the session.
5. Push: `git push origin main` and `git push origin main:gh-pages`.
6. Check that https://dessn7-bit.github.io/urania/sw.js shows the new version.
