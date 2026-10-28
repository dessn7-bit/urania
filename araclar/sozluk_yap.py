"""Astro sözlük: veri/sozluk.json'u iki kaynaktan üretir.
  (a) veri/dersler.json'daki her dersin "sozluk" maddeleri (terim, tanim),
  (b) arastirma/sozluk_ek.json: elle seçilmiş, kaynaklı ek terimler ("terimler") ve ders terimlerine
      eklenecek ayarlar ("ayarlar": eş anlamlı, yalnız belli derslerde işaretleme, büyük harf duyarlılığı).
Aynı terim (büyük-küçük harf ve Türkçe İ/ı farkı gözetmeden, parantez içi atılarak) tek maddede birleşir;
tanımlar farklıysa elle seçilmiş tanım, yoksa müfredat sırasında ilk dersin tanımı kalır.
Her terim için metinde eşleşecek düzenli ifade parçaları ("desen") da burada üretilir; sozluk.js bunları
tek bir birleşik ifadede kullanır, derslerde geçtiği yerler ("dersler") aynı desenlerle bulunur.
Dersler genişledikçe yeniden çalıştırılabilir: python3 araclar/sozluk_yap.py"""
import json
import os
import re
import sys

KOK = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
DERS_YOL = os.path.join(KOK, 'veri', 'dersler.json')
EK_YOL = os.path.join(KOK, 'arastirma', 'sozluk_ek.json')
CIKTI_YOL = os.path.join(KOK, 'veri', 'sozluk.json')

UNLU = 'aeıioöuü'
# sozluk.js'teki kucukHarf ile birebir aynı katlama: uzunluk değişmez (konumlar metinle örtüşsün)
KATLA = {'I': 'ı', 'İ': 'i', 'â': 'a', 'Â': 'a', 'î': 'i', 'Î': 'i', 'û': 'u', 'Û': 'u',
         '’': "'", '‘': "'", 'ʼ': "'", '‐': '-', '‑': '-', '–': '-', '—': '-'}


def kucuk(s):
    """Türkçe küçük harf (I→ı, İ→i), şapka ve tırnak/tire katlaması; karakter sayısı korunur."""
    o = []
    for c in s:
        if c in KATLA:
            o.append(KATLA[c])
            continue
        l = c.lower()
        o.append(l if len(l) == 1 else c)
    return ''.join(o)


PARANTEZ = re.compile(r'^(.*?)\s*\(([^()]*)\)\s*$')


def ayir(terim):
    """'Atarca (pulsar)' → ('Atarca', 'pulsar'); parantez yoksa (terim, None)."""
    m = PARANTEZ.match(terim.strip())
    return (m.group(1).strip(), m.group(2).strip()) if m else (terim.strip(), None)


def anahtar(terim):
    taban, _ = ayir(terim)
    return re.sub(r'\s+', ' ', kucuk(taban)).strip()


def sozcuk_mu(s):
    """Parantez içi bir eş anlamlı mı (pulsar, H II bölgesi) yoksa simge mi (λ, z, H0, G)?"""
    return len(s) >= 3 and sum(ch.isalpha() for ch in s) >= 2


# ---- Türkçe sıralama (localeCompare 'tr' ile aynı sırayı verecek kadar) ----
ALFABE = 'abcçdefgğhıijklmnoöpqrsştuüvwxyz'
SIRA = {c: i for i, c in enumerate(ALFABE)}


def sira_anahtari(s):
    k = []
    for c in kucuk(s):
        if c in SIRA:
            k.append(30 + SIRA[c])
        elif c.isdigit():
            k.append(10 + int(c))
        elif c.isspace():
            k.append(0)
        elif c.isalpha():
            k.append(100 + ord(c))
        else:
            k.append(1)
    return (k, s)


TR_ASCII = str.maketrans({'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u'})


def slug(s):
    t = kucuk(ayir(s)[0]).translate(TR_ASCII)
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-')
    return t or 'terim'


# ---- Eşleşme desenleri ----
# Hem Python re hem JavaScript (u bayrağı) aynı biçimi okur: yalnız sözdizimi karakterleri kaçırılır
OZEL = set('\\^$.*+?()[]{}|/')


def kac(s):
    return ''.join('\\' + c if c in OZEL else c for c in s)


YUMUSA = {'k': 'ğ', 'ç': 'c', 'p': 'b'}


def parca(sozcuk, son):
    """Sözcüğün düzenli ifadesi; son sözcükte ünsüz yumuşaması (delik→deliği, renk→rengi) da eşleşir."""
    e = kac(sozcuk)
    if not son or len(sozcuk) < 3:
        return e
    c = sozcuk[-1]
    if c in YUMUSA:
        yum = 'g' if (c == 'k' and sozcuk[-2] == 'n') else YUMUSA[c]
        return kac(sozcuk[:-1]) + '(?:' + kac(c) + '|' + yum + '(?=[' + UNLU + ']))'
    return e


def bilesik_kok(son_sozcuk):
    """Tamlamanın son sözcüğündeki iyelik ekini at: lekesi→leke, yılı→yıl (çoğul: lekeleri, yılları)."""
    if re.search('s[ıiuü]$', son_sozcuk) and len(son_sozcuk) > 3:
        return son_sozcuk[:-2]
    if re.search('[^' + UNLU + '][ıiuü]$', son_sozcuk) and len(son_sozcuk) > 3:
        return son_sozcuk[:-1]
    return None


def desenler(bicim, haric):
    """Bir biçim için desen parçaları ve eşleşen düz uzunluk (uzun terim önce denensin diye)."""
    k = re.sub(r'\s+', ' ', kucuk(bicim)).strip()
    if len(k) < 2:
        return []
    sozcukler = k.split(' ')
    on = r'\s+'.join(kac(s) for s in sozcukler[:-1])
    on = on + r'\s+' if on else ''

    def bak(duz):
        # haric: "evren" gibi tam sözcük başları; biçimden sonra gelen kısım olumsuz ileri bakış olur
        ls = [h for h in (kucuk(x) for x in haric) if h.startswith(duz) and len(h) > len(duz)]
        return ''.join('(?!' + kac(h[len(duz):]) + ')' for h in ls)

    cikti = [[on + parca(sozcukler[-1], True) + bak(k), len(k)]]
    kok = bilesik_kok(sozcukler[-1]) if len(sozcukler) > 1 else None
    if kok:
        duz = ' '.join(sozcukler[:-1] + [kok])
        cikti.append([on + kac(kok) + 'l', len(duz) + 1])
    return cikti


def bicimler(t):
    """Eşleşecek bütün biçimler: taban, eş anlamlılar, gizli biçimler; 'günberi / günöte' ve
    's-süreci ve r-süreci' gibi birleşik terimler parçalarıyla da."""
    ls = [ayir(t['terim'])[0]] + list(t.get('esanlam', [])) + list(t.get('bicim', []))
    sonuc = []
    for b in ls:
        sonuc.append(b)
        if ' / ' in b or ' ve ' in b:
            sonuc += [x.strip() for x in re.split(r' / | ve ', b) if x.strip()]
    gor, tek = set(), []
    for b in sonuc:
        a = re.sub(r'\s+', ' ', kucuk(b)).strip()
        if a and a not in gor:
            gor.add(a)
            tek.append(b)
    return tek


HARF = r'[^\W\d_]'


def birlesik_ifade(terimler):
    alt = []
    for i, t in enumerate(terimler):
        for d, u in t['desen']:
            alt.append((u, d, i))
    alt.sort(key=lambda x: -x[0])
    kaynak = r'(?<![^\W_])(?:' + '|'.join('(' + d + ')' for _, d, _ in alt) + r")((?:'" + HARF + '+|' + HARF + r'*))(?![^\W_])'
    return re.compile(kaynak), [i for _, _, i in alt]


def ders_metni(d):
    p = [d.get('ozet', '')]
    for b in d.get('bolumler', []):
        p += b.get('paragraflar', [])
        if b.get('ornek'):
            p.append(b['ornek'].get('metin', ''))
        if b.get('akilda'):
            p.append(b['akilda'])
    p += d.get('defter_notu', [])
    return '\n'.join(x for x in p if x)


def gecenler(terimler, dersler):
    """Her terimin hangi derslerin metninde geçtiği (sozluk.js'in işaretleyeceği biçimlerle)."""
    ifade, sira = birlesik_ifade(terimler)
    gecti = [set() for _ in terimler]
    for d in dersler:
        asil = ders_metni(d)
        metin = kucuk(asil)
        for m in ifade.finditer(metin):
            g = next(j for j in range(1, len(sira) + 1) if m.group(j) is not None)
            i = sira[g - 1]
            t = terimler[i]
            if t.get('yalniz') and d['id'] not in t['yalniz']:
                continue
            if t.get('buyuk'):
                govde = asil[m.start():m.start() + len(m.group(g))]
                if govde != govde.upper():
                    continue
            gecti[i].add(d['id'])
    return gecti


def sirali_dersler(D):
    ds = D.get('dersler', [])
    if not D.get('uniteler'):
        return ds
    byid = {d['id']: d for d in ds}
    ls = [byid[i] for u in D['uniteler'] for i in u.get('dersler', []) if i in byid]
    ls += [d for d in ds if d not in ls]
    return ls


def ekle_tekil(ls, yeni):
    for x in yeni:
        if x and x not in ls:
            ls.append(x)


def yap(D, EK, uyari=None):
    """D: dersler.json içeriği, EK: sozluk_ek.json içeriği → sozluk.json içeriği (dict)."""
    uyar = uyari if uyari is not None else (lambda m: print('UYARI:', m, file=sys.stderr))
    dersler = sirali_dersler(D)
    terimler, dizin = [], {}

    def bul_ya_da_kur(ad):
        a = anahtar(ad)
        if a not in dizin:
            dizin[a] = len(terimler)
            terimler.append({'terim': None, 'tanim': '', 'esanlam': [], 'bicim': [], 'haric': [], 'yalniz': [],
                             'buyuk': False, 'tanimli': [], 'kaynak': [], 'elle': False})
        return terimler[dizin[a]]

    # (a) derslerin sözlükleri, müfredat sırasıyla: ilk dersin tanımı kalır
    for d in dersler:
        for s in d.get('sozluk', []) or []:
            ad = (s.get('terim') or '').strip()
            if not ad:
                continue
            taban, par = ayir(ad)
            t = bul_ya_da_kur(ad)
            if t['terim'] is None:
                # parantez içi sözcükse eş anlamlıdır (Atarca (pulsar)); simgeyse adda kalır (Dalga boyu (λ))
                t['terim'] = taban if (par and sozcuk_mu(par)) else ad
                t['tanim'] = (s.get('tanim') or '').strip()
            elif t['tanim'] != (s.get('tanim') or '').strip():
                pass   # farklı tanım: ilk dersinki kalır
            if par and sozcuk_mu(par):
                ekle_tekil(t['esanlam'], [par])
            ekle_tekil(t['tanimli'], [d['id']])

    # (b) elle seçilmiş terimler: tanımları önceliklidir
    for e in EK.get('terimler', []):
        ad = (e.get('terim') or '').strip()
        if not ad:
            continue
        t = bul_ya_da_kur(ad)
        if t['terim'] is None:
            t['terim'] = ayir(ad)[0]
        if (e.get('tanim') or '').strip():
            t['tanim'] = e['tanim'].strip()
            t['elle'] = True
        ekle_tekil(t['esanlam'], e.get('esanlam', []))
        ekle_tekil(t['bicim'], e.get('bicim', []))
        ekle_tekil(t['haric'], e.get('haric', []))
        ekle_tekil(t['yalniz'], e.get('yalniz', []))
        t['buyuk'] = t['buyuk'] or bool(e.get('buyuk'))
        ekle_tekil(t['kaynak'], [{'ad': k['ad'], 'url': k['url']} for k in e.get('kaynak', []) if k.get('url')])

    # (c) ders terimlerine ayarlar (tanımı değiştirmez)
    for e in EK.get('ayarlar', []):
        a = anahtar(e.get('terim', ''))
        if a not in dizin:
            uyar('ayar eşleşmedi: ' + e.get('terim', ''))
            continue
        t = terimler[dizin[a]]
        ekle_tekil(t['esanlam'], e.get('esanlam', []))
        ekle_tekil(t['bicim'], e.get('bicim', []))
        ekle_tekil(t['haric'], e.get('haric', []))
        ekle_tekil(t['yalniz'], e.get('yalniz', []))
        t['buyuk'] = t['buyuk'] or bool(e.get('buyuk'))
        ekle_tekil(t['kaynak'], [{'ad': k['ad'], 'url': k['url']} for k in e.get('kaynak', []) if k.get('url')])

    terimler = [t for t in terimler if t['terim'] and t['tanim']]
    # eş anlamlı başka bir terimin adıyla çakışıyorsa söyle (işaretlemede uzun olan kazanır)
    adlar = {anahtar(t['terim']) for t in terimler}
    for t in terimler:
        for e in t['esanlam']:
            if anahtar(e) in adlar and anahtar(e) != anahtar(t['terim']):
                uyar('eş anlamlı başka bir terimin adı: ' + t['terim'] + ' / ' + e)
        t['desen'] = [d for b in bicimler(t) for d in desenler(b, t['haric'])]

    # derslerde geçtiği yerler
    gecti = gecenler(terimler, dersler)
    sira = [d['id'] for d in dersler]
    for t, g in zip(terimler, gecti):
        hepsi = set(g) | set(t['tanimli'])
        t['dersler'] = [i for i in sira if i in hepsi]

    terimler.sort(key=lambda t: sira_anahtari(t['terim']))
    kullanilan, cikti = set(), []
    for t in terimler:
        s = slug(t['terim'])
        k, n = s, 2
        while k in kullanilan:
            k = s + '-' + str(n)
            n += 1
        kullanilan.add(k)
        o = {'terim': t['terim'], 'kimlik': k, 'tanim': t['tanim'], 'esanlam': t['esanlam'], 'dersler': t['dersler'],
             'kaynak': t['kaynak'], 'tanimli': t['tanimli'], 'desen': t['desen']}
        if t['yalniz']:
            o['yalniz'] = t['yalniz']
        if t['buyuk']:
            o['buyuk'] = True
        cikti.append(o)
    return {
        'kaynak': 'Derslerin sözlük bölümleri (veri/dersler.json) ve elle seçilmiş, kaynaklı ek terimler '
                  '(arastirma/sozluk_ek.json; kaynak alıntıları arastirma/sozluk_kaynak.md). '
                  'Üreten: araclar/sozluk_yap.py',
        'ders_adlari': {d['id']: d.get('baslik', d['id']) for d in dersler},
        'terimler': cikti,
    }


def main():
    with open(DERS_YOL, encoding='utf-8') as f:
        D = json.load(f)
    with open(EK_YOL, encoding='utf-8') as f:
        EK = json.load(f)
    S = yap(D, EK)
    with open(CIKTI_YOL, 'w', encoding='utf-8') as f:
        json.dump(S, f, ensure_ascii=False, separators=(',', ':'))
        f.write('\n')
    ders = sum(1 for t in S['terimler'] if t['tanimli'])
    print('veri/sozluk.json: %d terim (%d ders sözlüklerinden, %d yalnız ek listeden)' % (len(S['terimler']), ders, len(S['terimler']) - ders))
    if '--goster' in sys.argv:
        # her terimin ilk eşleşmesini göster (yanlış eşleşmeleri gözle denetlemek için)
        dersler = sirali_dersler(D)
        T = [dict(t) for t in S['terimler']]
        ifade, sira = birlesik_ifade(T)
        for d in dersler:
            asil = ders_metni(d)
            for m in ifade.finditer(kucuk(asil)):
                g = next(j for j in range(1, len(sira) + 1) if m.group(j) is not None)
                print(d['id'], T[sira[g - 1]]['terim'], '←', asil[m.start():m.end()])


if __name__ == '__main__':
    main()
