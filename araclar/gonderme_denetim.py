"""Ders göndermelerinin ZAMANI ders sırasına uyuyor mu? (denetim 2026-10-30, A3-01 / A5-01 / A6B-24)
Kaynak metinler (arastirma/dersler_v2/dNN.json, dNN_sinav.json) başka dersleri dosya kimliğiyle anar: "d9'da", "(d20)",
"9. derste", "4. ve 11. dersler" (kaynakta "N. ders" = dN dosyası). Okur dersleri uygulamadaki SIRAYLA okur. Bu yüzden:
  - sırada SONRA gelen derse geçmiş anlatımla ("gördün", "gördüğün gibi", "hatırla", "konusuydu" …) gönderme yapılmaz;
  - sırada ÖNCE gelen derse gelecek anlatımla ("göreceksin", "göreceğin gibi", "dönecek" …) gönderme yapılmaz.
Zaman, göndermenin geçtiği yan cümlede (. ! ? ; : ile ayrılan parça) ve göndermeden SONRA gelen fiilde aranır
("d9'da gördüğün gibi"); arada "bu ders…" geçiyorsa fiil bu derse aittir ("(d16) ve bu dersin ilerleyen bölümlerinde
göreceğin" bir sorun değildir). Kaynağı ders kaynağında olmayan eski sınav soruları (d1–d19, yalnız veri/sinavlar.json)
uygulamadaki sıra numarasıyla yazıldığı için ("N. ders" = N. sıradaki ders) ayrıca denetlenir.
Sıra ders_verisi_v2.py'deki UNITELER'den okunur. Gerekçeli istisnalar IZIN listesinde (dar: dosya + hedef + sözcük + metin parçası).
Kullanım: python araclar/gonderme_denetim.py [--json]   (çıkış kodu: sorun varsa 1)"""
import ast, glob, json, os, re, sys
K = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
V2 = os.path.join(K, 'arastirma', 'dersler_v2')

def sira():
    s = open(os.path.join(K, 'araclar', 'ders_verisi_v2.py'), encoding='utf-8').read()
    m = re.search(r'^UNITELER = (\[.*?^\])', s, re.S | re.M)
    ls = [i for u in ast.literal_eval(m.group(1)) for i in u['dersler']]
    return {d: n + 1 for n, d in enumerate(ls)}

# Geçmiş anlatım: okurun o dersi ÖNCEDEN okuduğunu varsayan fiiller. Zamansız ortaçlar ("anlatılan", "ele alınan",
# "konusu") ve geniş zaman ("anlatıyor", "hatırlatır") alınmaz: sıradan bağımsızdırlar.
GECMIS = re.compile(r'\b(gördün|gördüğün|gördük|gördüğümüz|görmüştün|görmüştük|görmüş olman|hatırla(?!t)|hatırlarsın|hatırlıyorsun|'
                    r'anlattık|anlatmıştık|anlattığımız|anlatıldı|anlatılmıştı|öğrendin|öğrendiğin|öğrendik|öğrendiğimiz|öğrenmiştin|'
                    r'konusuydu|inceledin|incelediğin|inceledik|incelemiştik|incelediğimiz|bahsetmiştik|bahsettik|değinmiştik|değindik|'
                    r'değindiğimiz|tanıdın|tanıdığın|tanımıştın|tanıştın|tanıştığın|hesapladın|hesapladığın|hesaplamıştın|ele aldık|'
                    r'ele almıştık|ele alındı|ele alınmıştı|geçmişti|okudun|okuduğun|okumuştun|biliyorsun|bildiğin|ölçtün|ölçtüğün)\w*', re.I)
# Gelecek anlatım. "gelecek" (ad: "uzak gelecek", "gelecekte") bilerek YOK: zaman değil konu bildirir.
GELECEK = re.compile(r'\b(göreceksin|göreceğin|göreceğiz|göreceğimiz|ele alınacak|ele alacağız|anlatılacak|anlatacağız|anlatacağım|'
                     r'inceleyeceksin|inceleyeceğiz|inceleyeceğin|öğreneceksin|öğreneceğin|öğreneceğiz|tanıyacaksın|tanışacaksın|'
                     r'hesaplayacaksın|döneceğiz|döneceksin|dönecek|işlenecek|okuyacaksın|okuyacağın)\w*', re.I)
BU_DERS = re.compile(r'\bbu ders', re.I)
# kaynakta dosya kimliği: dNN (ekli ya da eksiz) ve "N. ders" / "N. ve M. ders" / "N., M. ve K. ders"
KIMLIK = re.compile(r"(?<![\w/.#-])d(\d{1,2})(?![\d\w-])")
NUMARA = re.compile(r"(?<![\d%,.])((?:\d{1,2}\.,? (?:ve |ile |ya da |veya )?)*)(\d{1,2})\. ders")
# Yan cümle sınırı: . ! ? ; : ve ardından boşluk (ondalık "3.5", sıra sayısı "9. ders" ve "1. adım" bölünmez)
BOL = re.compile(r'(?<=[!?;:])\s+|(?<=[^\d\s]\.)\s+')

# Gerekçeli istisnalar. Her biri: (dosya, hedef ders, sözcük, metinde geçmesi gereken parça, gerekçe). Dar tutulur:
# metin değişirse istisna düşer ve test yeniden bakılmasını ister.
IZIN = [
]

def metinler(x, yol=''):
    if isinstance(x, str): yield yol, x
    elif isinstance(x, list):
        for i, v in enumerate(x): yield from metinler(v, f'{yol}[{i}]')
    elif isinstance(x, dict):
        for k, v in x.items():
            if k in ('id', 'kid', 'url', 'kaynak_url', 'unite', 'on_bilgi', 'ders'): continue
            yield from metinler(v, f'{yol}.{k}' if yol else k)

def hedefler(parca, sira_no=None):
    """parçadaki ders göndermeleri: [(ders, başlangıç, bitiş)]. sira_no verilirse "N. ders" N. SIRADAKİ derstir
    (çevrilmiş eski sınav metni); verilmezse dN dosyasıdır (kaynak metin)."""
    h = [('d' + m.group(1), m.start(), m.end()) for m in KIMLIK.finditer(parca)]
    for m in NUMARA.finditer(parca):
        for n in re.findall(r'\d{1,2}', m.group(1)) + [m.group(2)]:
            h.append((sira_no.get(int(n), '?') if sira_no else 'd' + n, m.start(), m.end()))
    return h

def fiil(desen, parca, bitis):
    """göndermeden SONRA gelen ilk eşleşen fiil; arada "bu ders…" varsa fiil bu derse aittir (None)"""
    m = desen.search(parca, bitis)
    if m and not BU_DERS.search(parca, bitis, m.start()): return m
    return None

def parca_denetle(S, ders, ad, alan, s, sira_no=None):
    sorun = []
    for parca in BOL.split(s):
        for h, bas, bit in hedefler(parca, sira_no):
            if h not in S or h == ders: continue
            gec, gel = fiil(GECMIS, parca, bit), fiil(GELECEK, parca, bit)
            for m, kosul, tur in ((gec, S[h] > S[ders], 'geçmiş anlatım, hedef SONRA'), (gel, S[h] < S[ders], 'gelecek anlatım, hedef ÖNCE')):
                if not (m and kosul): continue
                if any(i[0] == ad and i[1] == h and i[2] == m.group(0) and i[3] in parca for i in IZIN): continue
                sorun.append({'dosya': ad, 'alan': alan, 'ders': ders, 'sira': S[ders], 'hedef': h, 'hedef_sira': S[h],
                              'tur': tur, 'sozcuk': m.group(0), 'metin': parca[:220]})
    return sorun

def denetle():
    S = sira(); sorun = []
    kaynakli = set()
    for yol in sorted(glob.glob(os.path.join(V2, 'd*.json'))):
        ad = os.path.basename(yol); ders = re.match(r'(d\d+)', ad).group(1)
        if ders not in S: continue
        if ad.endswith('_sinav.json'): kaynakli.add(ders)
        for alan, s in metinler(json.load(open(yol, encoding='utf-8'))):
            sorun += parca_denetle(S, ders, ad, alan, s)
    # kaynağı olmayan eski sınav soruları: metin zaten uygulama sırasıyla numaralı
    sira_no = {n: d for d, n in S.items()}
    sv = json.load(open(os.path.join(K, 'veri', 'sinavlar.json'), encoding='utf-8'))
    for u, ls in sv['uniteler'].items():
        for i, q in enumerate(ls):
            ders = q.get('ders')
            if ders not in S or ders in kaynakli: continue
            for alan, s in metinler(q):
                sorun += parca_denetle(S, ders, 'veri/sinavlar.json', f'{u}[{i}].{alan}', s, sira_no)
    return sorun

if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    ls = denetle()
    if '--json' in sys.argv: print(json.dumps(ls, ensure_ascii=False, indent=1))
    else:
        for x in ls: print(f"{x['dosya']} {x['alan']}: {x['ders']}({x['sira']}) → {x['hedef']}({x['hedef_sira']}) {x['tur']} [{x['sozcuk']}] {x['metin']}")
        print('sorun:', len(ls))
    sys.exit(1 if ls else 0)
