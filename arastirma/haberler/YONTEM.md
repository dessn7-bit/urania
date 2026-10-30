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
      "ozet": ["paragraf 1", "paragraf 2", "..."],   // 350–700 words in total, 4–8 paragraphs (v2, 30 Oct 2026: Kaan found the first set "çok çok kısa"). Tell the story properly: what happened, who did it and how (instrument, method), what exactly was measured (numbers with units), how it fits what we knew before, what is still uncertain, what comes next. Plain Turkish; define every term the first time it appears. The first paragraph must work on its own as the card teaser.
      "neden_onemli": "1–2 cümle: bu neden önemli, neyi değiştiriyor",
      "kesinlik": "kesin" | "ön sonuç" | "tartışmalı",   // e.g. a preprint not yet peer reviewed = "ön sonuç"
      "istanbul": "optional: what Kaan can see or do from Istanbul (only if true and sourced)",
      "ilgili_dersler": ["d13"],           // existing lesson ids from veri/dersler.json (0–3)
      "makale": { "baslik": "...", "yazarlar": "Soyad vd.", "dergi": "Nature / ApJ / arXiv ön baskı", "url": "https://..." },   // optional; for research items
      "kaynaklar": [ { "ad": "NASA: ...", "url": "https://...", "tarih": "YYYY-MM-DD" } ]   // ≥ 2 independent sources (the primary one first),
      "gorsel": {                          // strongly preferred; omit only if no freely licensed official image exists
        "dosya": "img/haber/<id>.jpg",     // made with: python3 araclar/haber_gorsel.py <id> <image-url>
        "alt": "Türkçe, görme engelli okur için ne görüldüğünü anlatan bir cümle",
        "aciklama": "Türkçe resim altı: görselde ne var, renkler/ölçek ne anlama geliyor (gerçek fotoğraf mı, sanatçı çizimi mi, benzetim mi — MUTLAKA söyle)",
        "kredi": "NASA, ESA, CSA, STScI (kurumun istediği kredi satırı aynen)",
        "lisans": "Kamu malı (NASA) | CC BY 4.0 | CC BY-SA 3.0 IGO …",
        "kaynak_url": "https://… (görselin resmî sayfası)"
      }
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

## Images
- Use only official, freely licensed images of the actual subject: NASA (public domain, credit required), ESA/Webb, ESA/Hubble, ESO, NOIRLab, IAU, Rubin Observatory (CC BY 4.0), ESA (mostly CC BY-SA 3.0 IGO), JAXA/CNSA only when their terms clearly allow reuse. Read the licence on the image page and copy the required credit exactly.
- NEVER use news-agency photos (AP, Reuters, Getty, AFP), magazine/journal figures (Nature, Science, Sky & Telescope) or images whose licence you can't confirm. If no free image exists, omit "gorsel" rather than substituting a generic picture.
- Say honestly what the image is: real photograph/observation, processed data, simulation, or artist's impression ("sanatçı çizimi").
- Download with `python3 araclar/haber_gorsel.py <id> <url>` (writes img/haber/<id>.jpg, ≤ 1200 px, ≤ 250 KB). Prefer the agency's "large"/"screen" JPEG over multi-MB originals.

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
