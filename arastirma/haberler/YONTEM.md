# Urania "Haberler" sekmesi — haber ekleme yöntemi

This is the standing procedure for adding astronomy news to Urania. The first set was written on 30 October 2026, and a weekly scheduled task follows this file. Kaan reads Turkish and is a curious adult with no physics background. He lives in Istanbul (Anatolian side; the app stores the location only at district level, 41.0 N 29.1 E) and owns 7×50 binoculars.

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
      "tur": "haber" | "arastirma" | "gorev" | "gokyuzu" | "gorsel" | "etkinlik",   // gorsel, etkinlik: v48
      "baslik": "Türkçe başlık, en çok ~90 karakter, merak uyandıran ama abartısız",
      "ozet": ["paragraf 1", "paragraf 2", "..."],   // 350–700 words in total, 4–8 paragraphs (v2, 30 Oct 2026: Kaan found the first set "çok çok kısa"). Tell the story properly: what happened, who did it and how (instrument, method), what exactly was measured (numbers with units), how it fits what we knew before, what is still uncertain, what comes next. Plain Turkish; define every term the first time it appears. The first paragraph must work on its own as the card teaser.
      "neden_onemli": "1–2 cümle: bu neden önemli, neyi değiştiriyor",
      "kesinlik": "kesin" | "ön sonuç" | "tartışmalı",   // definitions: section "Kesinlik" below
      "kesinlik_neden": "hakem" | "aday" | "benzetim" | "tartisma" | "dogrulanmamis",   // v48: REQUIRED whenever kesinlik is not "kesin"
      "istanbul": "optional: what Kaan can see or do from Istanbul (only if true and sourced)",
      "ilgili_dersler": ["d13"],           // existing lesson ids from veri/dersler.json (0–3)
      "makale": { "baslik": "...", "yazarlar": "Soyad vd.", "dergi": "Nature / ApJ / arXiv ön baskı", "url": "https://..." },   // optional; for research items
        // v48, filled by araclar/haber_dogrula.py from Crossref when the paper is in a peer-reviewed journal (do not type by hand):
        //   "doi", "yayin_tarihi" (YYYY-MM-DD), "cilt", "sayfa", "lisans": {"ad": "CC BY 4.0", "url": ...}, "hakemli": true, "arxiv": "2608.02847"
        // optional hints for the matcher: "ilk_yazar" (first author's surname exactly as the journal prints it), "onbaski_baslik"
      "guncellemeler": [ { "tarih": "YYYY-MM-DD", "metin": "Güncelleme (10 Kasım 2026): makale … dergisinde hakemli olarak yayımlandı." } ],   // v48, shown on the card; written by haber_dogrula.py
      "kaynaklar": [ { "ad": "NASA: ...", "url": "https://...", "tarih": "YYYY-MM-DD" } ]   // ≥ 2 independent sources (the primary one first),
      "gorsel": {                          // strongly preferred; omit only if no freely licensed official image exists
        "dosya": "img/haber/<id>.jpg",     // made with: python3 araclar/haber_gorsel.py <id> <image-url>
        "alt": "Türkçe, görme engelli okur için ne görüldüğünü anlatan bir cümle",
        "aciklama": "Türkçe resim altı: görselde ne var, renkler/ölçek ne anlama geliyor (gerçek fotoğraf mı, sanatçı çizimi mi, benzetim mi — MUTLAKA söyle)",
        "kredi": "NASA, ESA, CSA, STScI (kurumun istediği kredi satırı aynen)",
        "lisans": "Kamu malı (NASA) | CC BY 4.0 | CC BY-SA 3.0 IGO …",
        "kaynak_url": "https://… (görselin resmî sayfası)",
        "apod": { "url": "https://science.nasa.gov/image-article/apod-…/", "tarih": "YYYY-MM-DD", "kredi_satiri": "APOD credit line verbatim" }   // only for tur "gorsel"
      },
      "etkinlik": { "yer": "…", "baslangic": "YYYY-MM-DD", "bitis": "YYYY-MM-DD (optional)", "saat": "19.00–22.00", "basvuru": "…", "ucret": "…", "kaynak_url": "https://…", "kaynak_ad": "…" }   // only for tur "etkinlik"
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
- gorsel (v48): "Haftanın görüntüsü" — one APOD picture per week at most, rules in "Haftanın görüntüsü" below. Text: 60–300 words, 1–3 paragraphs, no "neden_onemli" needed.
- etkinlik (v48): a public observing event in Istanbul in the next 30 days, rules in "İstanbul etkinlikleri" below. Text: 60–300 words, 1–3 paragraphs. The app marks it "Geçti" by itself once the (end) date has passed; do not delete it by hand.

## Images
- Use only official, freely licensed images of the actual subject: NASA (public domain, credit required), ESA/Webb, ESA/Hubble, ESO, NOIRLab, IAU, Rubin Observatory (CC BY 4.0), ESA (mostly CC BY-SA 3.0 IGO), JAXA/CNSA only when their terms clearly allow reuse. Read the licence on the image page and copy the required credit exactly.
- NEVER use news-agency photos (AP, Reuters, Getty, AFP), magazine/journal figures (Nature, Science, Sky & Telescope) or images whose licence you can't confirm.
- v48 exception for paper figures: a figure from a paper whose Crossref licence (makale.lisans, content-version "vor") is CC BY may be used with attribution ("Şekil: Soyad vd. 2026, <dergi>, CC BY 4.0"), "kaynak_url" = the DOI link. Only if the figure is the authors' own: if its caption credits another source (an agency image, another paper, an artist), do NOT use it. If no free image exists, omit "gorsel" rather than substituting a generic picture.
- Say honestly what the image is: real photograph/observation, processed data, simulation, or artist's impression ("sanatçı çizimi").
- Download with `python3 araclar/haber_gorsel.py <id> <url>` (writes img/haber/<id>.jpg, ≤ 1200 px, ≤ 250 KB). Prefer the agency's "large"/"screen" JPEG over multi-MB originals.

## Rules (non-negotiable)
- Every fact, number, date and name must be verified against the primary source: the agency or observatory press release (NASA, ESA, ESO, NOIRLab, JPL, JAXA, CNSA, ISRO, TUA), the paper itself (journal or arXiv), or the institution's release. Add at least one independent second source (Science News, Nature News, Sky & Telescope, Space.com, Phys.org, AAS Nova, Quanta Magazine, New Scientist …).
- Never write from memory. If you cannot confirm something, leave it out.
- Write in your own words. Do not copy or translate press-release sentences — EXCEPT texts released under CC BY 4.0 (ESO, ESA/Webb, ESA/Hubble, NOIRLab press releases; see the source list): those may be translated, with the credit the site asks for ("ESO", "ESA/Webb", "ESA/Hubble", "NOIRLab") written in the item, and the translated passage must still be checked against the paper. AAS Nova, TUA and news sites: never copy or translate, link only.
- No hype. "Yaşam bulundu" or "Einstein yanıldı" only if the source literally says so; otherwise say what was actually measured. Mark preprints "ön sonuç" (kesinlik_neden "hakem"). Present contested claims as contested.
- Do NOT use OpenStax or CK-12. Never contact celestrak.org. Do not bypass bot checks. Kaan approved fetching any website without asking.
- No duplicates. Check the existing ids and titles, and the same story under a different title.
- Pick a mix: big discoveries (JWST, ESO, LIGO/Virgo/KAGRA, Rubin Observatory, Gaia, Euclid, solar missions, planetary missions), interesting papers, and anything Turkey-related only from official sources. Aim for 5–10 items per weekly run, roughly one week of news.

## Kesinlik (definitions, v48)
- "kesin": the result is published in a peer-reviewed journal (or is an official agency/mission statement of fact) and the authors present it as a detection/measurement, not a candidate.
- "ön sonuç": one of these reasons, ALWAYS recorded in "kesinlik_neden":
  - "hakem": the ONLY reason is that the paper is not yet peer reviewed (arXiv preprint, conference abstract). This is the only reason that `haber_dogrula.py` removes automatically when the paper appears in a journal.
  - "aday": the source itself calls it a candidate / possible / unconfirmed detection ("candidate", "may have", "if confirmed"). Publication does not change this.
  - "benzetim": the conclusion rests on a simulation or a poorly known parameter.
  - "dogrulanmamis": reported but not yet confirmed by an independent check (e.g. a single-instrument claim, a status not yet ratified).
- "tartışmalı" (kesinlik_neden "tartisma"): researchers openly disagree, or the authors themselves present it as one of several interpretations.
- If you change a label by hand, say why in the weekly report.

## Weekly run (order, v48)
1. **Paper status check (every run, all items):** `python3 araclar/haber_dogrula.py --yaz --rapor /tmp/haber_dogrula.json`.
   - It checks every item with "makale": arXiv API (`id_list`; journal_ref and doi fields; at least 3 s between arXiv requests), then Crossref `works/{doi}`, else `works?query.bibliographic=<title>&query.author=<first author>&rows=5`.
   - Match rule: Crossref type "journal-article", normalized title similarity ≥ 0.9 AND same first-author surname. Anything else counts as unpublished. (Crossref returns unrelated hits for unpublished papers — e.g. for the β Pictoris b radio preprint it returned another VLA paper by the same first author; the rule rejects it.)
   - When published: fills dergi, doi, yayin_tarihi, cilt, sayfa, lisans (Crossref "license" with content-version "vor"; a Creative Commons licence is written as "CC BY 4.0" etc., anything else as "açık lisans değil (yayıncı koşulları)"; a text-and-data-mining ("tdm") licence is NOT a reuse licence), hakemli; switches the link to doi.org; adds the visible note "Güncelleme (<tarih>): makale <dergi> dergisinde hakemli olarak yayımlandı."; changes "ön sonuç" → "kesin" ONLY when kesinlik_neden is "hakem".
   - It sends no e-mail address (User-Agent "urania-haber/1.0 (+https://github.com/dessn7-bit/urania)"), requests are sequential and slow (Crossref 1 s, arXiv 3 s apart). Do not add Crossref's "mailto" parameter.
   - **List every change in the weekly report** (item id, field: before → after) and every "İNCELE" line, and act on them by hand:
     - same first author, different title (from the title search with similarity ≥ 0.5, and from an extra Crossref search for the first author's journal articles since the preprint's month, similarity ≥ 0.3): the journal version may have a new title — open it and decide; if it is the same work, set makale.baslik to the journal title, keep the old one in "onbaski_baslik", add makale.doi, and re-run. Limitation: a journal version whose title changed a lot and whose first author has many papers can still be missed; also check the arXiv abstract page ("journal reference", "DOI") and the agency press release by hand for every unpublished item.
     - "özet metni hâlâ 'hakem değerlendirmesinden geçmedi / ön baskı' diyor": the script never edits the text; rewrite those sentences.
   - Dates: yayin_tarihi is the online publication date; if Crossref has only the issue date it is shown as "(sayı tarihi)"; a month-only date is stored as YYYY-MM (no invented day).
   - Network errors leave the item unchanged and are listed under "hata"; re-run later.
2. **Discover news** from the source list below.
3. **Image of the week** (at most one per week), see below.
4. **Istanbul events check**, see below.
5. Write the items (rules above).
6. **Independent verification before publishing (mandatory):** a separate verifier sub-agent that did NOT write the items reads every new or changed item and checks: (a) every fact, number, date and name against the cited sources; (b) the kesinlik label and kesinlik_neden against the definitions above; (c) image licence and credit line (and for "gorsel" the APOD whitelist rule); (d) that the Turkish is clear for a reader with no physics background. Fix every finding before publishing; nothing is published with an open finding. Write the number of findings (and how many were fixed) in the weekly report.
7. Then "After editing" below.

## Sources (tested live on 10 November 2026)
| Source | Working address | Licence / use |
|---|---|---|
| arXiv (astro-ph) | API, NOT RSS (RSS is empty on Saturdays): `https://export.arxiv.org/api/query?search_query=cat:astro-ph.*+AND+submittedDate:[YYYYMMDD0000+TO+YYYYMMDD2359]&sortBy=submittedDate&sortOrder=descending&max_results=200` (page with `start=`). Put entries whose comment field contains "Nature", "Science" or "accepted" first. | Metadata CC0 1.0 ("You are free to use descriptive metadata about arXiv e-prints under the terms of the Creative Commons Universal (CC0 1.0)", arXiv API Terms of Use). Paper texts keep their own licence. Rate: no more than one request every 3 seconds, one connection. |
| NOIRLab (incl. Rubin) | `https://noirlab.edu/public/news/feed/` (RSS) | "Unless specifically noted", images, videos and press-release texts CC BY 4.0 (noirlab.edu/public/copyright): credit must be clear and visible; texts credited to "NOIRLab". Read the image's own credit/licence line: some items are noted otherwise. |
| NASA Chandra | `https://www.nasa.gov/missions/chandra/feed/`, or the Chandra press room feed `https://chandra.harvard.edu/press/xml/` (both 200 on 10 Nov 2026; the old address `https://chandra.harvard.edu/press/press_release.rss` returns 404) | NASA media guidelines (below). |
| ESO | `https://www.eso.org/public/news/feed/` | "Unless specifically noted", images, videos and press-release texts CC BY 4.0 (eso.org/public/outreach/copyright): credit "clear and visible"; texts credited to "ESO". Read the image's own credit/licence line. |
| ESA/Webb | `https://esawebb.org/news/feed/` | Images, videos and web texts CC BY 4.0 (esawebb.org/copyright); each image has its own required credit line, copy it exactly. |
| ESA/Hubble | `https://esahubble.org/news/feed/` | Same as ESA/Webb (esahubble.org/copyright). |
| NASA Science | `https://science.nasa.gov/feed/` | NASA Images and Media Usage Guidelines (nasa.gov/nasa-brand-center/images-and-media): NASA content "generally are not subject to copyright in the United States"; acknowledge NASA; third-party images on NASA pages are marked with their copyright holder and are NOT free. |
| AAS Nova | `https://aasnova.org/feed/` | "© American Astronomical Society. All rights reserved." Link only; never copy or translate text, never use images. Use it to find papers, then work from the paper. |
| TUA (Türkiye Uzay Ajansı) | `https://www.tua.gov.tr/tr/haberler` (no RSS; read the page) | "©2021 Her Hakkı Saklıdır". Link only. |
| Crossref (paper status) | `https://api.crossref.org/works/{doi}` and `…/works?query.bibliographic=…&query.author=…&rows=5` | Used for bibliographic facts (journal, DOI, date, licence). |
| Paper figures | via the DOI | Only if the paper's Crossref licence is CC BY and the figure is the authors' own (see Images). |

## Haftanın görüntüsü (image of the week, v48)
- APOD now lives on science.nasa.gov. Do NOT use the api.nasa.gov APOD endpoint: it is broken (on 10 Nov 2026 it answered either HTTP 500 or HTTP 200 with the NASA logo as the image and "NASA Science" as the title, also for past dates).
- Candidates: `python3 araclar/apod_gorsel.py` (reads `https://science.nasa.gov/wp-json/wp/v2/image-article?search=APOD`; fallback feed `https://science.nasa.gov/feed/?post_type=image-article`).
- Take a picture ONLY if every item of its credit line is on the whitelist, the line contains at least one NASA core item (NASA, JPL, JPL-Caltech, GSFC/Goddard, MSFC, Ames, JSC, KSC, NASA Earth Observatory, ISS Expedition Crew) and no "Copyright" (nor "License", "Processing"). Any person's name (e.g. "Credit: Alejandro Sanz", even without the word Copyright), software name or unknown item rejects it. Contractors and mission teams (STScI, SSI, Caltech, SwRI, University of Arizona …) pass only together with a NASA core item: alone they are not public domain.
- Whitelist (kept in `araclar/apod_gorsel.py`): NASA core (above) plus, only together with a NASA core item: STScI, SSI / Space Science Institute, JHUAPL/APL, SwRI, MSSS, Caltech, USGS, NOAA, Cassini Imaging Team, Hubble Heritage Team, SDO, Swift, Chandra, CXC, SAO, University of Arizona, ASU.
- Licence-check list: ESA, ESO, NOIRLab, NSF, AURA, CSA, DLR, JAXA, FU Berlin, ESA/Webb, ESA/Hubble, SOHO, Rubin Observatory, "Hubble", "Webb" — allowed only after reading the licence on the image's OWN page (e.g. the Cassini image of 5 Nov 2026 lists ESA, but its Photojournal page PIA17144 credits "NASA/JPL-Caltech/Space Science Institute": public domain under NASA guidelines).
- Download the image from its official page (Photojournal, agency page) with `araclar/haber_gorsel.py`, not from the APOD page if a better official copy exists.
- The caption and text are OURS, in Turkish; every fact in them is checked against a second source (the image's official page, a NASA mission page). Never translate the APOD explanation.
- At most one "gorsel" item per week (the test checks this by ISO week of "eklenme").

## İstanbul etkinlikleri (weekly check, v48)
Check every week:
- İstanbul Üniversitesi Gözlemevi / Bilim-Toplum program: `https://astronomi.istanbul.edu.tr/bilimtoplum/program.html` (regular Tue–Thu planetarium visits are routine: do not post them; post dated "Gözlem Geceleri" announcements).
- Kandilli Rasathanesi: `https://kandilli.bogazici.edu.tr/duyurular` and `/haberler` (e.g. "Halk Günleri").
- TÜBİTAK Gökyüzü Gözlem Etkinliği: `https://gge.tubitak.gov.tr/` (a JavaScript app; the site's own public data address `https://gge.tubitak.gov.tr/api/events/active` gives the current event as JSON: name, city, site, dates, registration dates). Only Istanbul events, or events Kaan could reasonably join, become items.
If a public observing event in Istanbul falls in the next 30 days, write one "etkinlik" item: place, date, time, how to apply, fee, and the official announcement link (all from the official page; if the fee is not stated write "Duyuruda belirtilmemiş"). Past events are marked "Geçti" by the app automatically. Report the result of this check every week, also when there is nothing ("etkinlik yok").

## After editing
1. `python3 -c "import json;json.load(open('veri/haberler.json'))"` (in the repository root).
2. `npx playwright test testler/haberler.spec.js testler/haber_dogrula.spec.js` must be green.
3. Bump `SURUM` in sw.js by one (urania-vNN → vNN+1).
4. Commit as author "Kaan <dessn7@gmail.com>", with message "Haberler: <tarih> haftası (<n> yeni)", ending with the Co-Authored-By / Claude-Session lines required by the session.
5. **Push ONLY main: `git push origin main`.** Do NOT push gh-pages yourself any more (v49). The "Yayın kapısı" workflow (.github/workflows/yayin.yml) runs on every push to main: (a) every veri/**/*.json parses, (b) ESLint, (c) html-validate on index.html, (d) the whole Playwright suite. Only if all pass, and only if main still points at that commit (an old re-run never moves gh-pages back), does it set gh-pages = main; GitHub Pages publishes gh-pages, and the gate then waits up to 20 minutes until the live site serves the same content as the commit (sw.js and every changed file listed in sw.js ASSETS, compared by sha256). If any check fails, gh-pages is NOT touched and an issue labelled "yayın durdu" is opened with the failing check, the first lines of its output (JSON/ESLint/html-validate) and the test summary; if only the live check fails (GitHub's own Pages deployment got stuck), the issue says so and the next push to main retries. To try something without publishing, push it to a `deneme/<ad>` branch: the gate runs there but never publishes; its failures open "yayın denemesi" issues, not "yayın durdu".
6. **Wait for the gate and write the result in the report.** Either watch the run (`gh run watch` if the gh CLI is available, or the GitHub tools: list the workflow runs of "Yayın kapısı" for the pushed commit and wait until it completes; it takes about 10–15 minutes), or poll https://dessn7-bit.github.io/urania/sw.js (no more than once a minute, at most 40 minutes) until it shows the new SURUM. If the run failed: read the "yayın durdu" issue, fix the cause, commit and push main again; never push gh-pages by hand to get around the gate. Never leave main broken: the weekly job must end with main green, or with the failure clearly reported.
7. Weekly report (v48) must contain: the paper-status changes from step 1 of "Weekly run" (before → after) and the "İNCELE"/"hata" lines; the new items; the image of the week (which picture, its credit line, why it passes the whitelist) or "bu hafta yok"; the Istanbul events check result; the verifier's number of findings and fixes; (v49) the result of the publishing gate (run passed / failed, live SURUM) and the "Denetim" section below.

## Denetim (v49): read the automatic checks and report them to Kaan in Turkish
Kaan never looks at GitHub; the weekly report is how he hears about problems. Every run:
1. Read the OPEN issues labelled **"yayın durdu"** (publishing gate failed) and **"denetim"** (weekly audit, `.github/workflows/denetim.yml`, Saturday 04.00 UTC = 07.00 TSİ, before this job). Use the GitHub tools (list issues by label, read the issue and its latest comment) or `gh issue list --label denetim --state open`.
   The audit's issue titles: "Denetim: yeni kırık bağlantı", "Denetim: değişen kaynak", "Denetim: Horizons farkı", "Denetim (bilgi): <kütüphane> <sürüm> çıktı", "Denetim: adım çalışmadı". Issues are opened only for NEW findings. The run page's summary shows the counts for each check, the new findings, and the full list of links that could not be verified (403/429/timeouts; never counted as working), marked whether they are in the baseline; links that are in the baseline as broken but could not be verified this week are counted separately (not counted as fixed). The raw results (denetim/*.json, *.md) are kept for 30 days as the run's artifact "denetim-sonuclari". Issues from `deneme/…` test branches are labelled "yayın denemesi" and are not about the live site: ignore them.
2. Fix what you can, with sources, in this run:
   - a new broken link: find the page's new address (or an equivalent official source that says the same thing) and replace it in the lesson/news source and in veri/; never link a copy or archive of Wikipedia; if no replacement exists, remove the claim or mark it in the report as unresolved.
   - a changed source ("alinti_yok": the quote is no longer on the page; "tarih_degisti": the page's update date changed): reopen the page, check whether the number or sentence we use changed; fix the data and the arastirma/ quote if it did; then update arastirma/denetim/alinti_taban.json (the page's new date) so the same change is not reported again.
   - a Horizons difference: do not change the tolerance; find out why (library change? app code?) and report; known differences of Astronomy Engine (design accuracy ±1 arcminute) are in arastirma/denetim/gok_taban.json and do not open issues.
   - a new library version: information only. Do NOT update lib/ automatically; mention it, and Kaan decides.
   - "yayın durdu": fix the failing check first (see "After editing" 6).
   Close the issue (with a one-line comment saying what was done) only when it is really fixed.
3. End the Turkish report with a short **"Denetim"** section: number of new broken links (fixed / not fixed), changed sources, Horizons difference (largest difference and whether anything new), new library versions, publishing gate state, and a list of what you could not fix.
