"""Ders kaynaklarındaki Wikipedia KOPYASI adreslerini (IPFS yansıları, cavac.at) asıl Wikipedia adresine çevirir.
Kopyalar eski anlık görüntü olabilir ve bazılarında (cavac.at) sayfaya gizlenmiş talimatlar bulundu; okura her
zaman asıl kaynak gösterilir. Kullanım: python3 araclar/kaynak_url_duzelt.py   (arastirma/dersler_v2/*.json ve *_kaynak.md)"""
import glob, os, re
K = os.path.join(os.path.dirname(__file__), '..')
DESEN = [
    (re.compile(r'https://[a-z0-9]+\.ipfs\.4everland\.io/wiki/([^"\s|)]+?)\.html'), r'https://en.wikipedia.org/wiki/\1'),
    (re.compile(r'https://ipfs\.ssi\.eecc\.de/ipns/en\.wikipedia-on-ipfs\.org/wiki/([^"\s|)]+)'), r'https://en.wikipedia.org/wiki/\1'),
    (re.compile(r'https://en\.wikipedia-on-ipfs\.org/wiki/([^"\s|)]+)'), r'https://en.wikipedia.org/wiki/\1'),
    (re.compile(r'https://cavac\.at/cavacopedia/([^"\s|)]+)'), r'https://en.wikipedia.org/wiki/\1'),
]
toplam = 0
for yol in glob.glob(os.path.join(K, 'arastirma/dersler_v2/d*.json')) + glob.glob(os.path.join(K, 'arastirma/dersler_v2/d*_kaynak.md')):
    s = open(yol, encoding='utf-8').read(); s0 = s
    for d, y in DESEN: s, n = d.subn(y, s); toplam += n
    s = s.replace('Cavacopedia (Wikipedia kopyası) – ', 'Wikipedia: ')
    if s != s0: open(yol, 'w', encoding='utf-8').write(s)
print('çevrilen adres:', toplam)
