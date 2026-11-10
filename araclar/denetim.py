#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/denetim.py — haftalık denetim (v49; .github/workflows/denetim.yml cumartesi sabahı, haber işinden önce çalıştırır).

Alt komutlar (her biri bir JSON sonuç ve bir Markdown özet yazar; bulgu varsa iş akışı kayıt (issue) açar):
  baglanti-hazirla <klasor>          veri/dersler.json + veri/haberler.json bağlantılarını toplar; Wikipedia ve arXiv ayrı,
                                     ötekiler <klasor>/genel.txt (lychee girdisi). celestrak.org ve en.wikipedia.org dışı
                                     Wikipedia alan adları atlanır (kural).
  baglanti-degerlendir <klasor> <lychee.json>
                                     en.wikipedia.org: MediaWiki API ile 50'şerli toplu sorgu (sayfa var mı, yönlendirme mi);
                                     arXiv: API id_list ile toplu sorgu (istekler arası ≥ 3 sn); ötekiler lychee çıktısından.
                                     Sınıflar: calisiyor / kirik (404, 410, alan adı yok, Wikipedia'da sayfa yok, arXiv'de kayıt yok)
                                     / dogrulanamadi (403, 429, öteki 4xx, 5xx, zaman aşımı, bağlantı hatası — ASLA "çalışıyor"
                                     sayılmaz). Taban listesi (arastirma/denetim/baglanti_taban.json: 2026-10-30 denetiminde
                                     ulaşılamayan 156 URL "askıda" + bilinen ölü/alan adı yok) dışında kalan YENİ kırıklar raporlanır.
  alinti <klasor>                    arastirma/*.json'daki birebir alıntılı kayıtlar: kaynak yeniden açılır, alıntı (normalleştirilmiş
                                     metinle) hâlâ sayfada mı; sayfadaki "son güncelleme" tarihi arastirma/denetim/alinti_taban.json
                                     ile aynı mı.
  horizons-indir <klasor>            Sabit zaman ve cisim ızgarası için JPL Horizons (İstanbul 41,0 K 29,1 D): görünür RA/Dec
                                     (kırılmasız) ve meridyen geçiş anları. İstekler sırayla. Karşılaştırma: node araclar/denetim_gok.js.
  kutuphane <klasor>                 lib/SURUMLER.json ↔ npm'deki son sürüm (yalnız bilgi; kendiliğinden güncelleme YOK).
İstek başlığı: User-Agent "urania-linkcheck/1.0 (+https://github.com/dessn7-bit/urania)"; e-posta ya da kişisel veri yok.
Tarayıcı gibi davranılmaz, bot koruması atlatılmaz; istekler yavaş ve sırayla.
"""
import sys, os, re, io, json, time, html, gzip, hashlib, calendar, subprocess, unicodedata, urllib.request, urllib.parse, urllib.error
import xml.etree.ElementTree as ET

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'urania-linkcheck/1.0 (+https://github.com/dessn7-bit/urania)'
TABAN = os.path.join(KOK, 'arastirma', 'denetim', 'baglanti_taban.json')
ALINTI_TABAN = os.path.join(KOK, 'arastirma', 'denetim', 'alinti_taban.json')
YASAK_ALAN = ('celestrak.org',)
NS = {'a': 'http://www.w3.org/2005/Atom', 'arxiv': 'http://arxiv.org/schemas/atom'}
_son = {}


def bekle(anahtar, sn):
    g = sn - (time.time() - _son.get(anahtar, 0))
    if g > 0:
        time.sleep(g)
    _son[anahtar] = time.time()


def al(url, anahtar='genel', aralik=1.0, zaman_asimi=40, deneme=3):
    """→ (kod, içerik baytları, içerik türü). Kod None: bağlantı hatası / zaman aşımı. 429 (hız sınırı) ya da 503 gelirse
    Retry-After başlığına uyup (yoksa 15, 30, 60 sn) en çok `deneme` kez yeniden dener; sonra kodu olduğu gibi döndürür
    ("doğrulanamadı" sayılır)."""
    for i in range(deneme + 1):
        kod, ham, tur, sonra = _al(url, anahtar, aralik, zaman_asimi)
        if kod not in (429, 503) or i == deneme:
            return kod, ham, tur
        try:
            b = min(300, int(sonra)) if sonra else 15 * 2 ** i
        except ValueError:
            b = 15 * 2 ** i
        time.sleep(b)


def _al(url, anahtar, aralik, zaman_asimi):
    bekle(anahtar, aralik)
    istek = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip'})
    try:
        with urllib.request.urlopen(istek, timeout=zaman_asimi) as r:
            ham = r.read()
            if r.headers.get('Content-Encoding') == 'gzip':
                ham = gzip.decompress(ham)
            return r.status, ham, r.headers.get('Content-Type', ''), None
    except urllib.error.HTTPError as h:
        return h.code, b'', '', h.headers.get('Retry-After') if h.headers else None
    except Exception as h:          # DNS, bağlantı, zaman aşımı
        return None, str(h).encode()[:200], '', None


# ---------------------------------------------------------------- bağlantılar
URL_RE = re.compile(r'https?://[^\s"\'<>\]\\]+')


def _metinler(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, dict):
        for v in o.values():
            yield from _metinler(v)
    elif isinstance(o, list):
        for v in o:
            yield from _metinler(v)


def urller():
    ls = {}
    for dosya in ('veri/dersler.json', 'veri/haberler.json'):
        for s in _metinler(json.load(open(os.path.join(KOK, dosya), encoding='utf-8'))):
            for u in URL_RE.findall(s):
                u = u.rstrip('.,;:')
                if u.count('(') < u.count(')'):
                    u = u[:len(u) - (u.count(')') - u.count('('))]
                ls.setdefault(u, set()).add(dosya)
    return {u: sorted(d) for u, d in ls.items()}


def grupla(ls):
    g = {'wiki': {}, 'wikirev': {}, 'arxiv': {}, 'genel': [], 'atlandi': []}
    for u in ls:
        p = urllib.parse.urlsplit(u)
        host = p.hostname or ''
        if any(host == a or host.endswith('.' + a) for a in YASAK_ALAN):
            g['atlandi'].append({'url': u, 'neden': 'celestrak.org (kural: istek yok)'})
        elif host == 'en.wikipedia.org' and p.path.startswith('/wiki/'):
            g['wiki'][u] = urllib.parse.unquote(p.path[6:]).replace('_', ' ')
        elif host == 'en.wikipedia.org':
            # kalıcı bağlantı (/w/index.php?…&oldid=N): o sürüm MediaWiki API'de revids ile; başlıklı ise başlıkla
            q = urllib.parse.parse_qs(p.query)
            if q.get('oldid', [''])[0].isdigit():
                g['wikirev'][u] = q['oldid'][0]
            elif q.get('title'):
                g['wiki'][u] = q['title'][0].replace('_', ' ')
            else:
                g['atlandi'].append({'url': u, 'neden': 'en.wikipedia.org: sayfa adı ya da sürüm numarası yok'})
        elif host.endswith('wikipedia.org'):
            g['atlandi'].append({'url': u, 'neden': 'yalnız en.wikipedia.org denetlenir (kural)'})
        elif host in ('arxiv.org', 'www.arxiv.org', 'export.arxiv.org'):
            m = re.search(r'/(?:abs|pdf|html)/([0-9]{4}\.[0-9]{4,5}|[a-z\-]+(?:\.[A-Z]{2})?/[0-9]{7})', p.path)
            if m:
                g['arxiv'][u] = m.group(1)
            else:
                g['genel'].append(u)
        else:
            g['genel'].append(u)
    return g


def baglanti_hazirla(kl):
    os.makedirs(kl, exist_ok=True)
    ls = urller()
    g = grupla(ls)
    open(os.path.join(kl, 'genel.txt'), 'w', encoding='utf-8').write('\n'.join(sorted(g['genel'])) + '\n')
    json.dump({'urller': ls, 'gruplar': {k: v for k, v in g.items()}}, open(os.path.join(kl, 'liste.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"bağlantı: {len(ls)} tekil · Wikipedia {len(g['wiki'])} (+{len(g['wikirev'])} kalıcı sürüm) · arXiv {len(g['arxiv'])} · lychee {len(g['genel'])} · atlandı {len(g['atlandi'])}")


def wiki_denetle(basliklar):
    """{url: başlık} → {url: (sinif, ayrinti)} MediaWiki API, 50'şerli."""
    sonuc, ters = {}, {}
    for u, b in basliklar.items():
        ters.setdefault(b.split('#')[0], []).append(u)
    adlar = sorted(ters)
    for i in range(0, len(adlar), 50):
        parca = adlar[i:i + 50]
        q = urllib.parse.urlencode({'action': 'query', 'titles': '|'.join(parca), 'redirects': 1, 'format': 'json', 'formatversion': 2})
        kod, ham, _ = al('https://en.wikipedia.org/w/api.php?' + q, 'wiki', 1.0)
        if kod != 200:
            for b in parca:
                for u in ters[b]:
                    sonuc[u] = ('dogrulanamadi', f'MediaWiki API {kod}')
            continue
        j = json.loads(ham)
        q = j.get('query', {})
        norm = {x['from']: x['to'] for x in q.get('normalized', [])}
        yon = {x['from']: x['to'] for x in q.get('redirects', [])}
        sayfa = {p['title']: p for p in q.get('pages', [])}
        for b in parca:
            t = norm.get(b, b)
            hedef = yon.get(t, t)
            p = sayfa.get(hedef, {})
            for u in ters[b]:
                if p.get('missing') or p.get('invalid'):
                    sonuc[u] = ('kirik', 'Wikipedia: sayfa yok')
                elif t in yon:
                    sonuc[u] = ('calisiyor', 'Wikipedia yönlendirmesi → ' + hedef)
                elif p:
                    sonuc[u] = ('calisiyor', 'Wikipedia')
                else:
                    sonuc[u] = ('dogrulanamadi', 'MediaWiki API yanıtında yok')
    return sonuc


def wikirev_denetle(surumler):
    """{url: oldid} → {url: (sinif, ayrinti)}: MediaWiki API revids (silinmiş/yok sürüm → 'badrevids' → kırık)."""
    sonuc = {}
    ters = {}
    for u, r in surumler.items():
        ters.setdefault(r, []).append(u)
    ids = sorted(ters)
    for i in range(0, len(ids), 50):
        parca = ids[i:i + 50]
        q = urllib.parse.urlencode({'action': 'query', 'revids': '|'.join(parca), 'prop': 'revisions', 'rvprop': 'ids', 'format': 'json', 'formatversion': 2})
        kod, ham, _ = al('https://en.wikipedia.org/w/api.php?' + q, 'wiki', 1.0)
        if kod != 200:
            for r in parca:
                for u in ters[r]:
                    sonuc[u] = ('dogrulanamadi', f'MediaWiki API {kod}')
            continue
        q = json.loads(ham).get('query', {})
        kotu = {str(x.get('revid')) for x in (q.get('badrevids') or {}).values()} if isinstance(q.get('badrevids'), dict) else {str(x.get('revid')) for x in (q.get('badrevids') or [])}
        var = {str(r['revid']) for p in q.get('pages', []) for r in p.get('revisions', [])}
        for r in parca:
            for u in ters[r]:
                if r in var:
                    sonuc[u] = ('calisiyor', 'Wikipedia kalıcı sürüm')
                elif r in kotu:
                    sonuc[u] = ('kirik', 'Wikipedia: sürüm yok')
                else:
                    sonuc[u] = ('dogrulanamadi', 'MediaWiki API yanıtında yok')
    return sonuc


def arxiv_denetle(kimlikler):
    """{url: kimlik} → {url: (sinif, ayrinti)}; arXiv API id_list, istekler arası ≥ 3 sn."""
    sonuc, ters = {}, {}
    for u, k in kimlikler.items():
        ters.setdefault(k, []).append(u)
    ks = sorted(ters)
    for i in range(0, len(ks), 50):
        parca = ks[i:i + 50]
        q = urllib.parse.urlencode({'id_list': ','.join(parca), 'max_results': len(parca)})
        kod, ham, _ = al('https://export.arxiv.org/api/query?' + q, 'arxiv', 3.1)
        bulunan = set()
        if kod == 200:
            try:
                for e in ET.fromstring(ham).findall('a:entry', NS):
                    kid = (e.findtext('a:id', '', NS) or '').rsplit('/abs/', 1)[-1]
                    baslik = (e.findtext('a:title', '', NS) or '').strip()
                    if kid and baslik and baslik != 'Error':
                        bulunan.add(re.sub(r'v\d+$', '', kid))
            except ET.ParseError:
                kod = 'xml'
        for k in parca:
            for u in ters[k]:
                if kod != 200:
                    sonuc[u] = ('dogrulanamadi', f'arXiv API {kod}')
                else:
                    sonuc[u] = ('calisiyor', 'arXiv') if k in bulunan else ('kirik', 'arXiv: kayıt yok')
    return sonuc


def lychee_sinif(kayit):
    """lychee JSON kaydı → (sinif, ayrinti). 403/429 ve belirsiz durumlar 'dogrulanamadi', asla 'calisiyor' değil."""
    st = kayit.get('status') or {}
    kod = st.get('code')
    metin = str(st.get('text', ''))
    if kod in (404, 410):
        return 'kirik', f'HTTP {kod}'
    if kod in (403, 429):
        return 'dogrulanamadi', f'HTTP {kod} (bot koruması ya da hız sınırı olabilir)'
    if isinstance(kod, int):
        return 'dogrulanamadi', f'HTTP {kod}'
    if re.search(r'dns|failed to lookup|name or service not known|no such host|nodename nor servname', metin, re.I):
        return 'kirik', 'alan adı bulunamadı (DNS)'
    if re.search(r'timeout|timed out', metin, re.I):
        return 'dogrulanamadi', 'zaman aşımı'
    return 'dogrulanamadi', metin[:120] or 'bilinmeyen hata'


def lychee_oku(yol):
    """lychee --format json çıktısı → {url: (sinif, ayrinti)}; hata ve zaman aşımı haritaları okunur."""
    if not yol or not os.path.exists(yol):
        return {}, 0
    j = json.load(open(yol, encoding='utf-8'))
    sonuc = {}
    for harita in ('error_map', 'fail_map', 'timeout_map'):
        for ls in (j.get(harita) or {}).values():
            for k in ls:
                s = lychee_sinif(k) if harita != 'timeout_map' else ('dogrulanamadi', 'zaman aşımı')
                sonuc[k['url']] = s
    return sonuc, int(j.get('total') or 0)


def baglanti_degerlendir(kl, lychee_json):
    L = json.load(open(os.path.join(kl, 'liste.json'), encoding='utf-8'))
    g = L['gruplar']
    taban = {x['url']: x for x in json.load(open(TABAN, encoding='utf-8'))['urller']}
    sonuc = {}
    sonuc.update(wiki_denetle(g['wiki']))
    sonuc.update(wikirev_denetle(g.get('wikirev', {})))
    sonuc.update(arxiv_denetle(g['arxiv']))
    ly, toplam = lychee_oku(lychee_json)
    for u in g['genel']:
        sonuc[u] = ly.get(u, ('calisiyor', 'lychee') if toplam else ('dogrulanamadi', 'lychee çıktısı yok'))
    for x in g['atlandi']:
        sonuc[x['url']] = ('atlandi', x['neden'])
    yeni, bilinen, dogrulanamadi = [], [], []
    for u, (s, a) in sorted(sonuc.items()):
        kayit = {'url': u, 'sinif': s, 'ayrinti': a, 'dosyalar': L['urller'].get(u, [])}
        if s == 'kirik':
            (bilinen if u in taban else yeni).append(kayit)
        elif s == 'dogrulanamadi':
            dogrulanamadi.append(dict(kayit, tabanda=u in taban))
    from collections import Counter
    sayac = Counter(s for s, _ in sonuc.values())
    rapor = {'toplam': len(sonuc), 'siniflar': dict(sayac), 'yeni_kirik': yeni, 'bilinen_kirik': bilinen,
             'dogrulanamadi': dogrulanamadi, 'taban': len(taban)}
    json.dump(rapor, open(os.path.join(kl, 'baglanti_sonuc.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    md = [f"## Bağlantılar", f"Toplam {len(sonuc)} tekil bağlantı: " + ', '.join(f'{k} {v}' for k, v in sorted(sayac.items())) + '.',
          f"Taban listesi (askıda): {len(taban)} URL. **Yeni kırık: {len(yeni)}**, bilinen kırık (tabanda): {len(bilinen)}, doğrulanamadı (403/429/zaman aşımı vb., çalışıyor SAYILMAZ): {len(dogrulanamadi)}."]
    if yeni:
        md.append('\n| URL | Neden | Geçtiği dosya |\n|---|---|---|')
        md += [f"| {k['url']} | {k['ayrinti']} | {', '.join(k['dosyalar'])} |" for k in yeni]
    # Doğrulanamayanlar: kayıt açmaz (kırık olduğu kanıtlanmadı) ama özette tam liste durur. Tabanda "kırık" (olu / alan adı
    # yok) olup bu hafta doğrulanamayanlar ayrıca belirtilir: düzelmiş sayılmazlar.
    dis = [k for k in dogrulanamadi if not k['tabanda']]
    eski_kirik = [k for k in dogrulanamadi if k['tabanda'] and taban[k['url']].get('sinif') in ('olu', 'alan-adi-yok')]
    if dogrulanamadi:
        md.append(f"\nDoğrulanamayanların {len(dis)} tanesi taban listesinde yok; {len(eski_kirik)} tanesi tabanda kırık kayıtlıydı (düzelmiş sayılmaz).")
        md.append('\n<details><summary>Doğrulanamayan bağlantıların tam listesi</summary>\n\n| URL | Neden | Tabanda |\n|---|---|---|')
        md += [f"| {k['url']} | {k['ayrinti']} | {taban[k['url']].get('sinif', 'evet') if k['tabanda'] else 'hayır'} |" for k in dogrulanamadi]
        md.append('\n</details>')
    open(os.path.join(kl, 'baglanti.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print('\n'.join(md[:2]))
    open(os.path.join(kl, 'baglanti_yeni_sayi.txt'), 'w').write(str(len(yeni)))


# ---------------------------------------------------------------- alıntılar
ALINTI_ALAN = ('alinti', 'alintilar', 'maksimum_alinti', 'iliski_alinti', 'iliski_baglam_alinti')


def alinti_kayitlari():
    out = []

    def gez(o, f):
        if isinstance(o, dict):
            url = o.get('kaynak_url') or o.get('url')
            for k, v in o.items():
                if k in ALINTI_ALAN and isinstance(url, str) and url.startswith('http'):
                    vs = list(v.values()) if isinstance(v, dict) else (v if isinstance(v, list) else [v])
                    for x in vs:
                        if isinstance(x, str) and len(x.strip()) >= 8:
                            out.append((f, url, x))
                if k == 'ikinci_kaynak_alinti' and isinstance(o.get('ikinci_kaynak_url'), str) and isinstance(v, str):
                    out.append((f, o['ikinci_kaynak_url'], v))
            for v in o.values():
                gez(v, f)
        elif isinstance(o, list):
            for v in o:
                gez(v, f)
    kl = os.path.join(KOK, 'arastirma')
    for f in sorted(os.listdir(kl)):
        if f.endswith('.json'):
            try:
                gez(json.load(open(os.path.join(kl, f), encoding='utf-8')), 'arastirma/' + f)
            except ValueError:
                pass
    return out


def normal(s):
    """Sayfa tasarımı değişikliklerine dayanıklı karşılaştırma: HTML etiketi, aksan, büyük/küçük harf, noktalama ve boşluk
    atılır; yalnız harf ve rakam kalır (ör. "Mass (10<sup>24</sup> kg) 0.33010" → "mass1024kg033010")."""
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s))
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r'[^a-z0-9]+', '', s)


def alinti_imza(a):
    return hashlib.sha1(normal(a).encode()).hexdigest()[:12]


def notsuz(a):
    """Alıntıya bizim eklediğimiz Türkçe açıklamaları at: Türkçe harf içeren ya da "Sayfa:", "sütunlar" ile başlayan parantezler."""
    return re.sub(r'\((?:[^()]*[çğıöşüÇĞİÖŞÜ][^()]*|\s*(?:Sayfa|sütunlar|not)\b[^()]*)\)', ' ', a)


def sozcukler(s):
    """Harf ve rakam dizileri (sayılar harflerden ayrılır): '10^26' → ['10', '26'], 'eff⊙' → ['eff']."""
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s))
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c)).lower()
    return re.findall(r'[a-z]+|[0-9]+', s)


def alinti_var(a, n, sz, bosluk=6):
    """Alıntı sayfada mı: (1) parça parça birebir (yalnız harf/rakam, sıra korunur) ya da (2) sözcükler aynı sırayla ve
    aralarında en çok `bosluk` fazladan sözcükle (dipnot numarası [1], PDF'de satır sonu/alt simge, tablo hücresi ayrımı gibi
    tasarım farklarına dayanıklı). Sayı ya da sözcük değişirse ikisi de tutmaz."""
    a = notsuz(a)
    parcalar = [p for p in re.split(r'…|\.\.\.|\[…\]| / ', a) if len(normal(p)) >= 6]
    if not parcalar:
        return True
    if all(normal(p) in n for p in parcalar):
        return True
    konum = {}
    for i, w in enumerate(sz):
        konum.setdefault(w, []).append(i)
    import bisect
    for p in parcalar:
        ws = sozcukler(p)
        if not ws:
            continue
        bulundu = False
        for bas in konum.get(ws[0], []):
            i, ok = bas, True
            for w in ws[1:]:
                ls = konum.get(w, [])
                j = bisect.bisect_right(ls, i)
                if j == len(ls) or ls[j] - i > bosluk + 1:
                    ok = False
                    break
                i = ls[j]
            if ok:
                bulundu = True
                break
        if not bulundu:
            return False
    return True


def sayfa_metni(ham, tur):
    if 'pdf' in tur or ham[:5] == b'%PDF-':
        try:
            r = subprocess.run(['pdftotext', '-', '-'], input=ham, capture_output=True, timeout=120)
            return r.stdout.decode('utf-8', 'replace') if r.returncode == 0 else None
        except (OSError, subprocess.TimeoutExpired):
            return None
    t = ham.decode('utf-8', 'replace')
    if 'json' in tur or t.lstrip()[:1] in '[{':     # ör. sozluk.gov.tr/gts JSON döndürür (\u kaçışlı)
        try:
            return ' '.join(_metinler(json.loads(t)))
        except ValueError:
            pass
    return re.sub(r'<(script|style)\b.*?</\1>', ' ', t, flags=re.S | re.I)


TARIH_RE = re.compile(r'(?:last\s+updated|page\s+last\s+updated|last\s+modified|updated|son\s+güncelleme)\s*[:\-–]?\s*([A-Z][a-z]{2,9}\.?\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+[A-Z][a-z]{2,9}\.?\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}/\d{1,2}/\d{4})', re.I)


def alinti(kl):
    os.makedirs(kl, exist_ok=True)
    kay = alinti_kayitlari()
    T = json.load(open(ALINTI_TABAN, encoding='utf-8')) if os.path.exists(ALINTI_TABAN) else {}
    taban, dinamik = T.get('kaynaklar', {}), T.get('dinamik', [])
    bilinen = {(x['url'], x['imza']) for x in T.get('bilinen_eksik', [])}
    bilinen_bulgu = []
    gruplar = {}
    for f, u, a in kay:
        gruplar.setdefault(u, []).append((f, a))
    bulgular, dogrulanamadi, tarihler = [], [], {}
    for u in sorted(gruplar):
        host = urllib.parse.urlsplit(u).hostname or ''
        if any(host == a or host.endswith('.' + a) for a in YASAK_ALAN):
            dogrulanamadi.append({'url': u, 'neden': 'celestrak.org (kural)'})
            continue
        kod, ham, tur = al(u, 'alinti:' + host, 2.0, 60)
        if kod in (404, 410):
            bulgular.append({'url': u, 'tur': 'kaynak_kirik', 'ayrinti': f'HTTP {kod}', 'dosyalar': sorted({f for f, _ in gruplar[u]})})
            continue
        if kod != 200:
            dogrulanamadi.append({'url': u, 'neden': f'HTTP {kod}' if kod else 'bağlantı hatası / zaman aşımı'})
            continue
        metin = sayfa_metni(ham, tur)
        if metin is None:
            dogrulanamadi.append({'url': u, 'neden': 'PDF metni çıkarılamadı'})
            continue
        if any(host == d or host.endswith('.' + d) for d in dinamik):
            dogrulanamadi.append({'url': u, 'neden': 'sayfa içeriği betikle yükleniyor (alinti_taban.json "dinamik")'})
            continue
        n, sz = normal(metin), sozcukler(metin)
        for f, a in gruplar[u]:
            if not alinti_var(a, n, sz):
                b = {'url': u, 'tur': 'alinti_yok', 'ayrinti': a[:160], 'dosyalar': [f], 'imza': alinti_imza(a)}
                (bilinen_bulgu if (u, b['imza']) in bilinen else bulgular).append(b)
        m = TARIH_RE.search(re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', metin))))
        if m:
            tarihler[u] = m.group(1)
            if u in taban and taban[u] and taban[u] != m.group(1):
                bulgular.append({'url': u, 'tur': 'tarih_degisti', 'ayrinti': f"sayfa tarihi {taban[u]} → {m.group(1)}", 'dosyalar': sorted({f for f, _ in gruplar[u]})})
    rapor = {'kaynak': len(gruplar), 'alinti': len(kay), 'bulgular': bulgular, 'bilinen': bilinen_bulgu, 'dogrulanamadi': dogrulanamadi, 'tarihler': tarihler}
    json.dump(rapor, open(os.path.join(kl, 'alinti_sonuc.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    md = ['## Kaynak alıntıları', f"{len(gruplar)} kaynak, {len(kay)} alıntı. **Yeni değişen kaynak bulgusu: {len(bulgular)}**; tabanda bilinen (askıda, arastirma/denetim/alinti_taban.json): {len(bilinen_bulgu)}; doğrulanamadı: {len(dogrulanamadi)}."]
    if bulgular:
        md.append('\n| Kaynak | Bulgu | Ayrıntı | Dosya |\n|---|---|---|---|')
        md += [f"| {b['url']} | {b['tur']} | {b['ayrinti'].replace('|', '/')} | {', '.join(b['dosyalar'])} |" for b in bulgular]
    open(os.path.join(kl, 'alinti.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    open(os.path.join(kl, 'alinti_sayi.txt'), 'w').write(str(len(bulgular)))
    print('\n'.join(md[:2]))


# ---------------------------------------------------------------- Horizons
CISIMLER = {'Sun': '10', 'Moon': '301', 'Mercury': '199', 'Venus': '299', 'Mars': '499', 'Jupiter': '599', 'Saturn': '699', 'Uranus': '799', 'Neptune': '899'}
ZAMANLAR = ['2026-01-15 00:00', '2026-04-15 18:00', '2026-07-15 06:00', '2026-10-15 12:00', '2027-01-15 21:00', '2027-06-21 03:00']
GECIS_GUNU = '2026-11-14'
SITE = '29.1,41.0,0'


def horizons(param):
    q = dict({'format': 'text', 'EPHEM_TYPE': "'OBSERVER'", 'CENTER': "'coord@399'", 'COORD_TYPE': "'GEODETIC'", 'SITE_COORD': f"'{SITE}'", 'ANG_FORMAT': "'DEG'", 'TIME_TYPE': "'UT'"}, **param)
    kod, ham, _ = al('https://ssd.jpl.nasa.gov/api/horizons.api?' + urllib.parse.urlencode(q), 'horizons', 1.5, 120)
    if kod != 200:
        raise RuntimeError(f'Horizons {kod}')
    t = ham.decode('utf-8', 'replace')
    return t[t.index('$$SOE') + 5:t.index('$$EOE')].strip().split('\n'), t


def horizons_indir(kl):
    os.makedirs(kl, exist_ok=True)
    out = {'site': {'enlem': 41.0, 'boylam': 29.1, 'yukseklik_km': 0}, 'konum': {}, 'gecis': {}, 'kaynak': 'https://ssd.jpl.nasa.gov/api/horizons.api'}
    tlist = ','.join("'" + z + "'" for z in ZAMANLAR)
    for ad, kod in CISIMLER.items():
        satirlar, _ = horizons({'COMMAND': f"'{kod}'", 'TLIST': tlist, 'TLIST_TYPE': "'CAL'", 'QUANTITIES': "'2'", 'EXTRA_PREC': "'YES'", 'APPARENT': "'AIRLESS'"})
        out['konum'][ad] = []
        for s, z in zip(satirlar, ZAMANLAR):
            p = s.split()
            out['konum'][ad].append({'utc': z, 'ra': float(p[-2]), 'dec': float(p[-1])})
        # Meridyen geçişi: yerel görünür saat açısı (QUANTITIES 42, ondalık saat) 2 dk adımla; eksiden artıya geçtiği iki satır
        # arasında doğrusal aradeğerleme (saat açısı ~15°/sa düzgün değişir; hata saniyenin altında).
        satirlar, _ = horizons({'COMMAND': f"'{kod}'", 'START_TIME': f"'{GECIS_GUNU} 00:00'", 'STOP_TIME': f"'{GECIS_GUNU} 23:59'", 'STEP_SIZE': "'2m'", 'QUANTITIES': "'42'", 'EXTRA_PREC': "'YES'"})
        ns = []
        for s in satirlar:
            p = s.split()
            t = calendar.timegm(time.strptime(p[0] + ' ' + p[1], '%Y-%b-%d %H:%M'))
            ns.append((t, float(p[-1])))
        out['gecis'][ad] = []
        for (t1, h1), (t2, h2) in zip(ns, ns[1:]):
            if h1 < 0 <= h2 and h2 - h1 < 1:
                tg = t1 + (t2 - t1) * (-h1) / (h2 - h1)
                out['gecis'][ad].append(time.strftime('%Y-%m-%dT%H:%M:%S', time.gmtime(tg)) + 'Z')
        print(ad, len(out['konum'][ad]), out['gecis'][ad])
    json.dump(out, open(os.path.join(kl, 'horizons.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


# ---------------------------------------------------------------- kütüphaneler
def kutuphane(kl):
    os.makedirs(kl, exist_ok=True)
    S = json.load(open(os.path.join(KOK, 'lib', 'SURUMLER.json'), encoding='utf-8'))['kutuphaneler']
    sonuc = []
    for ad, k in S.items():
        kod, ham, _ = al('https://registry.npmjs.org/' + urllib.parse.quote(ad, safe='') + '/latest', 'npm', 1.0)
        son = json.loads(ham).get('version') if kod == 200 else None
        sonuc.append({'ad': ad, 'depoda': k['surum'], 'npm_son': son, 'yeni': bool(son and son != k['surum'])})
    json.dump(sonuc, open(os.path.join(kl, 'kutuphane_sonuc.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    yeni = [x for x in sonuc if x['yeni']]
    md = ['## Kütüphaneler', f"**Yeni sürüm: {len(yeni)}** (kendiliğinden güncellenmez)."] + [f"- {x['ad']}: depoda {x['depoda']}, npm'de {x['npm_son'] or 'okunamadı'}" for x in sonuc]
    open(os.path.join(kl, 'kutuphane.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    open(os.path.join(kl, 'kutuphane_sayi.txt'), 'w').write(str(len(yeni)))
    print('\n'.join(md))


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        sys.exit(2)
    {'baglanti-hazirla': lambda: baglanti_hazirla(a[1]),
     'baglanti-degerlendir': lambda: baglanti_degerlendir(a[1], a[2] if len(a) > 2 else None),
     'alinti': lambda: alinti(a[1]),
     'horizons-indir': lambda: horizons_indir(a[1]),
     'kutuphane': lambda: kutuphane(a[1])}[a[0]]()
