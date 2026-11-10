#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/haber_dogrula.py — haberlerdeki makalelerin yayın durumu denetimi (v48).

veri/haberler.json'da "makale" alanı olan her haber için:
  1. arXiv kimliği varsa (makale.url ya da makale.dergi içinde): arXiv API id_list sorgusu; journal_ref ve doi alanlarına bakılır.
     arXiv kuralı: istekler arasında en az 3 saniye (https://info.arxiv.org/help/api/tou.html).
  2. DOI varsa (makale.doi, makale.url, arXiv'in doi alanı): https://api.crossref.org/works/{doi}
  3. Yoksa ya da DOI eşleşmezse: https://api.crossref.org/works?query.bibliographic=<başlık>&query.author=<ilk yazar>&rows=5
Eşleşme kuralı: Crossref türü "journal-article", normalleştirilmiş başlık benzerliği ≥ 0,9 (difflib oranı) VE ilk yazarın
soyadı aynı. Eşleşmeyen "yayımlanmamış" sayılır (Crossref yayımlanmamış makalede ilgisiz sonuç döndürebilir: aynı yazarın başka
makalesi gibi; kural bunu eler).

Hakemli dergide yayımlanmışsa: makale.dergi, doi, yayin_tarihi, cilt, sayfa, lisans (Crossref "license", content-version "vor"),
hakemli = true doldurulur. Daha önce hakemli olduğu bilinmiyorduysa (kesinlik_neden "hakem" ya da dergi alanı yalnız ön baskı)
habere görünür not eklenir: "Güncelleme (<tarih>): makale <dergi> dergisinde hakemli olarak yayımlandı." Kesinlik "ön sonuç"
YALNIZ kesinlik_neden "hakem" ise (etiket yalnız hakem değerlendirmesi eksik olduğu için verildiyse) "kesin" olur; başka nedenle
verilen etiket (aday tespit, benzetim, tartışma) olduğu gibi kalır (YONTEM.md, "Kesinlik").

İstek başlığında e-posta YOK: User-Agent "urania-haber/1.0 (+https://github.com/dessn7-bit/urania)". İstekler sırayla.
Kullanım:
  python3 araclar/haber_dogrula.py                 # yalnız rapor (dosyaya yazmaz)
  python3 araclar/haber_dogrula.py --yaz           # değişiklikleri veri/haberler.json'a yazar
  seçenekler: --veri <json> --bugun YYYY-MM-DD --rapor <json> --fixture <klasör> (ağsız, kayıtlı yanıtlar) --kaydet <klasör>
"""
import sys, os, re, html, json, time, hashlib, difflib, unicodedata, datetime, urllib.request, urllib.parse
import xml.etree.ElementTree as ET

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'urania-haber/1.0 (+https://github.com/dessn7-bit/urania)'
CROSSREF = 'https://api.crossref.org/works'
ARXIV = 'https://export.arxiv.org/api/query'
ESIK = 0.9
BEKLE = {'crossref': 1.0, 'arxiv': 3.1}
AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
NS = {'a': 'http://www.w3.org/2005/Atom', 'arxiv': 'http://arxiv.org/schemas/atom'}


class Ag:
    """Sıralı, yavaş istek; --fixture ile kayıtlı yanıttan okur, --kaydet ile yanıtları kaydeder."""
    def __init__(self, fixture=None, kaydet=None):
        self.fixture, self.kaydet, self.son = fixture, kaydet, {}
        self.dizin = {}
        if fixture:
            p = os.path.join(fixture, 'dizin.json')
            self.dizin = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}

    @staticmethod
    def ad(url):
        return hashlib.sha1(url.encode('utf-8')).hexdigest()[:16]

    def al(self, url, tur):
        if self.fixture:
            dosya = self.dizin.get(url)
            if not dosya:
                raise KeyError('fixture yok: ' + url)
            return open(os.path.join(self.fixture, dosya), 'rb').read()
        bekle = BEKLE[tur] - (time.time() - self.son.get(tur, 0))
        if bekle > 0:
            time.sleep(bekle)
        for i in range(5):
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r:
                    ham = r.read()
                break
            except urllib.error.HTTPError as h:
                if h.code == 404:
                    ham = b''
                    break
                if i == 4:
                    raise
                time.sleep(2 ** (i + 1))
            except OSError:
                if i == 4:
                    raise
                time.sleep(2 ** (i + 1))
        self.son[tur] = time.time()
        if self.kaydet:
            os.makedirs(self.kaydet, exist_ok=True)
            dosya = self.ad(url) + ('.xml' if tur == 'arxiv' else '.json')
            kayit = ham
            if tur == 'crossref' and ham:      # fixture küçük kalsın: kaynakça listeleri (reference) atılır, eşleşmede kullanılmaz
                try:
                    j = json.loads(ham)
                    ms = j.get('message', {})
                    for x in ms.get('items', [ms]) if isinstance(ms, dict) else []:
                        x.pop('reference', None)
                    kayit = json.dumps(j, ensure_ascii=False).encode('utf-8')
                except ValueError:
                    pass
            open(os.path.join(self.kaydet, dosya), 'wb').write(kayit)
            p = os.path.join(self.kaydet, 'dizin.json')
            d = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
            d[url] = dosya
            json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
        return ham


def duz(s):
    """Başlık / ad normalleştirme: HTML ve LaTeX işaretleri atılır, Yunan harfi adıyla yazılır (β → beta), aksan atılır,
    küçük harf, harf-rakam dışı boşluk."""
    s = re.sub(r'<[^>]+>', ' ', html.unescape(str(s or '')))
    s = re.sub(r'\\(textit|textbf|emph|rm|mathrm)\b', ' ', s).replace('$', ' ').replace('{', ' ').replace('}', ' ').replace('\\', ' ')
    cikti = []
    for c in unicodedata.normalize('NFKD', s):
        if unicodedata.combining(c):
            continue
        ad = unicodedata.name(c, '')
        if ad.startswith('GREEK') and 'LETTER' in ad:
            cikti.append(' ' + ad.split('LETTER ')[-1].split()[0].lower() + ' ')
        elif c in 'ıİ':
            cikti.append('i')
        else:
            cikti.append(c)
    s = ''.join(cikti).lower()
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return ' '.join(s.split())


def benzerlik(a, b):
    return difflib.SequenceMatcher(None, duz(a), duz(b)).ratio()


def ilk_yazar(m):
    """makale.ilk_yazar (varsa) ya da yazarlar alanından: "Soyad, ..." / "Soyad vd." / "X İş Birliği (Soyad vd.)" """
    if m.get('ilk_yazar'):
        return m['ilk_yazar']
    y = str(m.get('yazarlar') or '')
    p = re.search(r'\(([^)]+)\)', y)
    if p:
        y = p.group(1)
    y = re.split(r',| ve | and | vd\.?| et al', y)[0]
    return y.strip()


def arxiv_kimlik(m):
    for alan in (m.get('url', ''), m.get('dergi', ''), m.get('arxiv', '')):
        k = re.search(r'(?:arxiv\.org/(?:abs|pdf)/|arXiv:\s*|ön baskısı:\s*(?:arXiv:)?\s*)(\d{4}\.\d{4,5})', str(alan), re.I)
        if k:
            return k.group(1)
    return None


def doi_bul(m):
    if m.get('doi'):
        return m['doi']
    u = str(m.get('url', ''))
    k = re.search(r'(10\.\d{4,9}/[^\s?#]+)', u)
    if k:
        return k.group(1).rstrip('.')
    k = re.search(r'nature\.com/articles/(s\d{5}-\d{3}-\d{5}-\w)', u)
    if k:
        return '10.1038/' + k.group(1)
    return None


def arxiv_sorgu(ag, kimlik):
    ham = ag.al(ARXIV + '?' + urllib.parse.urlencode({'id_list': kimlik}), 'arxiv')
    try:
        k = ET.fromstring(ham)
    except ET.ParseError:
        return {}
    e = k.find('a:entry', NS)
    if e is None:
        return {}
    g = lambda yol: (e.find(yol, NS).text or '').strip() if e.find(yol, NS) is not None else ''
    return {'baslik': ' '.join(g('a:title').split()), 'journal_ref': g('arxiv:journal_ref'), 'doi': g('arxiv:doi'), 'yorum': g('arxiv:comment')}


def crossref_doi(ag, doi):
    ham = ag.al(CROSSREF + '/' + urllib.parse.quote(doi, safe='/'), 'crossref')
    try:
        return [json.loads(ham)['message']]
    except (ValueError, KeyError):
        return []


def crossref_ara(ag, baslik, yazar):
    q = urllib.parse.urlencode({'query.bibliographic': baslik, 'query.author': yazar, 'rows': 5})
    ham = ag.al(CROSSREF + '?' + q, 'crossref')
    try:
        return json.loads(ham)['message']['items']
    except (ValueError, KeyError):
        return []


def cr_ilk_yazar(x):
    au = x.get('author') or []
    kisiler = [a for a in au if a.get('family')]
    birinci = [a for a in kisiler if a.get('sequence') == 'first']
    a = (birinci or kisiler or [{}])[0]
    return a.get('family', '')


def eslesir(x, baslik, yazar):
    """(eşleşti mi, benzerlik, neden)"""
    if x.get('type') != 'journal-article':
        return False, 0.0, 'tür ' + str(x.get('type'))
    b = max([benzerlik(baslik, t) for t in (x.get('title') or [''])] or [0.0])
    if b < ESIK:
        return False, b, f'başlık benzerliği {b:.2f} < {ESIK}'
    if duz(cr_ilk_yazar(x)) != duz(yazar):
        return False, b, f'ilk yazar {cr_ilk_yazar(x)!r} ≠ {yazar!r}'
    return True, b, 'eşleşti'


def tarih_cr(x):
    for alan in ('published', 'published-online', 'published-print', 'issued'):
        p = (x.get(alan) or {}).get('date-parts') or [[]]
        if p and p[0]:
            q = list(p[0]) + [1, 1]
            return '%04d-%02d-%02d' % tuple(q[:3])
    return None


def lisans_cr(x):
    ls = x.get('license') or []
    # yayımlanmış sürümün (vor) lisansı; yoksa açık (Creative Commons) bir lisans. Metin madenciliği (tdm) lisansı makalenin
    # yeniden kullanım lisansı DEĞİLDİR, alınmaz.
    vor = [l for l in ls if l.get('content-version') == 'vor'] or [l for l in ls if 'creativecommons.org' in l.get('URL', '')]
    if not vor:
        return None
    u = vor[0].get('URL', '')
    k = re.search(r'creativecommons\.org/licenses/([a-z-]+)/(\d\.\d)', u)
    ad = ('CC ' + k.group(1).upper() + ' ' + k.group(2)) if k else 'açık lisans değil (yayıncı koşulları)'
    if 'publicdomain/zero' in u:
        ad = 'CC0 1.0'
    return {'ad': ad, 'url': u}


def tr_tarih(s):
    y, a, g = (int(x) for x in s.split('-'))
    return f'{g} {AYLAR[a - 1]} {y}'


def onceden_hakemli(h):
    m = h['makale']
    if m.get('hakemli'):
        return True
    if h.get('kesinlik_neden') == 'hakem':
        return False
    return not re.match(r'\s*(arXiv|ön baskı)', str(m.get('dergi', '')), re.I)


def denetle(h, ag):
    """→ (sonuç sözlüğü). sonuc: 'yayimlandi' | 'yayimlanmamis'"""
    m = h['makale']
    baslik, yazar = m.get('baslik', ''), ilk_yazar(m)
    iz = []
    ax = arxiv_kimlik(m)
    adaylar_doi = []
    if doi_bul(m):
        adaylar_doi.append(doi_bul(m))
    if ax:
        a = arxiv_sorgu(ag, ax)
        iz.append({'arxiv': ax, 'journal_ref': a.get('journal_ref'), 'doi': a.get('doi'), 'yorum': a.get('yorum')})
        if a.get('doi') and a['doi'] not in adaylar_doi:
            adaylar_doi.append(a['doi'])
    for d in adaylar_doi:
        for x in crossref_doi(ag, d):
            ok, b, neden = eslesir(x, baslik, yazar)
            iz.append({'doi': d, 'benzerlik': round(b, 3), 'neden': neden})
            if ok:
                return {'sonuc': 'yayimlandi', 'cr': x, 'benzerlik': b, 'yol': 'doi', 'iz': iz}
    olasi = []
    for x in crossref_ara(ag, baslik, yazar):
        ok, b, neden = eslesir(x, baslik, yazar)
        if not ok and x.get('type') == 'journal-article' and duz(cr_ilk_yazar(x)) == duz(yazar) and b >= 0.5:
            olasi.append({'doi': x.get('DOI'), 'baslik': (x.get('title') or [''])[0], 'dergi': html.unescape((x.get('container-title') or [''])[0]), 'benzerlik': round(b, 3)})
        iz.append({'arama': x.get('DOI'), 'benzerlik': round(b, 3), 'neden': neden})
        if ok:
            return {'sonuc': 'yayimlandi', 'cr': x, 'benzerlik': b, 'yol': 'arama', 'iz': iz}
    return {'sonuc': 'yayimlanmamis', 'iz': iz, 'olasi': olasi}


def uygula(h, s, bugun):
    """Yayımlanmış makaleyi habere işler; değişiklik listesi döner."""
    m, x = h['makale'], s['cr']
    degis = []
    yeni = {
        'dergi': html.unescape((x.get('container-title') or [m.get('dergi')])[0]),
        'doi': x.get('DOI', '').lower(),
        'yayin_tarihi': tarih_cr(x),
        'cilt': x.get('volume'),
        'sayfa': x.get('article-number') or x.get('page'),
        'lisans': lisans_cr(x),
        'hakemli': True,
    }
    hakemli_once = onceden_hakemli(h)
    ax = arxiv_kimlik(m)
    if ax and not m.get('arxiv'):
        yeni['arxiv'] = ax
    if not re.search(r'doi\.org/', str(m.get('url', ''))):
        yeni['url'] = 'https://doi.org/' + yeni['doi']
    for k, v in yeni.items():
        if v is None:
            if k == 'lisans' and 'lisans' in m:      # önceki koşunun yanlış lisansı kalmasın
                degis.append({'alan': 'makale.lisans', 'once': m['lisans'], 'sonra': None})
                del m['lisans']
            continue
        if m.get(k) != v:
            degis.append({'alan': 'makale.' + k, 'once': m.get(k), 'sonra': v})
            m[k] = v
    if h.get('kesinlik') == 'ön sonuç' and h.get('kesinlik_neden') == 'hakem':
        degis.append({'alan': 'kesinlik', 'once': 'ön sonuç', 'sonra': 'kesin'})
        h['kesinlik'] = 'kesin'
        h.pop('kesinlik_neden', None)
    if not hakemli_once:
        metin = f'Güncelleme ({tr_tarih(bugun)}): makale {yeni["dergi"]} dergisinde hakemli olarak yayımlandı.'
        if any(d['alan'] == 'kesinlik' for d in degis):
            metin += ' Bu yüzden "Ön sonuç" etiketi kaldırıldı.'
        notlar = h.setdefault('guncellemeler', [])
        if not any('hakemli olarak yayımlandı' in n.get('metin', '') for n in notlar):
            notlar.append({'tarih': bugun, 'metin': metin})
            degis.append({'alan': 'guncellemeler', 'once': None, 'sonra': metin})
    return degis


def main(argv):
    arg = lambda ad, vars=None: argv[argv.index(ad) + 1] if ad in argv else vars
    veri = arg('--veri', os.path.join(KOK, 'veri', 'haberler.json'))
    bugun = arg('--bugun', datetime.date.today().isoformat())
    ag = Ag(fixture=arg('--fixture'), kaydet=arg('--kaydet'))
    ham = open(veri, encoding='utf-8').read()
    V = json.loads(ham)
    rapor = {'tarih': bugun, 'denetlenen': 0, 'degisen': [], 'yayimlanmis_degismeyen': [], 'yayimlanmamis': [], 'hata': []}
    for h in V['haberler']:
        if not h.get('makale'):
            continue
        rapor['denetlenen'] += 1
        try:
            s = denetle(h, ag)
        except Exception as e:      # ağ hatası: bu haber değişmez, raporda görünür
            rapor['hata'].append({'id': h['id'], 'hata': str(e)[:200]})
            continue
        if s['sonuc'] == 'yayimlandi':
            d = uygula(h, s, bugun)
            kayit = {'id': h['id'], 'doi': s['cr'].get('DOI'), 'dergi': h['makale']['dergi'], 'benzerlik': round(s['benzerlik'], 3), 'yol': s['yol']}
            if d:
                kayit['degisiklik'] = d
                rapor['degisen'].append(kayit)
            else:
                rapor['yayimlanmis_degismeyen'].append(kayit)
        else:
            rapor['yayimlanmamis'].append({'id': h['id'], 'kesinlik': h.get('kesinlik'), 'iz': s['iz'], 'olasi': s.get('olasi', [])})
    if '--yaz' in argv and rapor['degisen']:
        ind = 1 if ham.startswith('{\n "') else 2
        metin = json.dumps(V, ensure_ascii=False, indent=ind)
        open(veri, 'w', encoding='utf-8').write(metin + ('\n' if ham.endswith('\n') else ''))
    if arg('--rapor'):
        json.dump(rapor, open(arg('--rapor'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"Denetlenen {rapor['denetlenen']} makale · değişen {len(rapor['degisen'])} · yayımlanmış (değişiklik yok) {len(rapor['yayimlanmis_degismeyen'])} · yayımlanmamış {len(rapor['yayimlanmamis'])} · hata {len(rapor['hata'])}")
    for k in rapor['degisen']:
        print(f"- {k['id']}: {k['dergi']} (doi:{k['doi']}, benzerlik {k['benzerlik']})")
        for d in k['degisiklik']:
            print(f"    {d['alan']}: {d['once']!r} → {d['sonra']!r}")
    for k in rapor['yayimlanmamis']:
        print(f"- {k['id']}: yayımlanmış eşleşme yok ({k['kesinlik']})")
        for o in k['olasi']:
            print(f"    İNCELE (aynı ilk yazar, başlık farklı, benzerlik {o['benzerlik']}): {o['dergi']} doi:{o['doi']} {o['baslik']!r}")
    for k in rapor['hata']:
        print(f"- {k['id']}: HATA {k['hata']}")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
