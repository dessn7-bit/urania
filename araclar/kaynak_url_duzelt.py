"""Ders kaynaklarındaki Wikipedia KOPYASI adreslerini asıl Wikipedia adresine (yalnız en.wikipedia.org) çevirir:
IPFS yansıları, cavac.at, wikiwand.com, Kiwix aynaları ve Wikipedia'nın web arşivi anlık görüntüleri (UNT web arşivi,
web.archive.org). Kopyalar eski anlık görüntü olabilir ve bazılarında (cavac.at) sayfaya gizlenmiş talimatlar bulundu;
okura her zaman asıl kaynak gösterilir. Wikipedia DIŞI sitelerin arşiv kopyalarına dokunulmaz (asıl sayfa kalkmış olabilir).
Kullanım: python3 araclar/kaynak_url_duzelt.py   (arastirma/dersler_v2/*.json, *_kaynak.md, arastirma/*.md, cizim_*.js)
İki kez çalıştırılırsa ikincisi 0 değişiklik verir."""
import glob, os, re
K = os.path.join(os.path.dirname(__file__), '..')
WP = r'https://en.wikipedia.org/wiki/\1'
SON = r'([^"\'\s|]+?)(?=["\'\s|]|\)(?:["\'\s|,.;]|$)|$)'   # başlıkta ")" olabilir: "Meridian_(astronomy)"
DESEN = [
    (re.compile(r'https://[a-z0-9]+\.ipfs\.4everland\.io/wiki/' + r'([^"\'\s|]+?)\.html'), WP),
    (re.compile(r'https://ipfs\.ssi\.eecc\.de/ipns/en\.wikipedia-on-ipfs\.org/wiki/' + SON), WP),
    (re.compile(r'https://en\.wikipedia-on-ipfs\.org/wiki/' + SON), WP),
    (re.compile(r'https://cavac\.at/cavacopedia/' + SON), WP),
    # wikiwand.com/en/articles/X, wikiwand.com/en/X, wikiwand.com/EN/X (www. ile ya da değil)
    (re.compile(r'https?://(?:www\.)?wikiwand\.com/(?:en|EN)/(?:articles/)?' + SON), WP),
    # Wikipedia'nın web arşivi anlık görüntüleri: webarchive.library.unt.edu ve web.archive.org
    (re.compile(r'https?://(?:webarchive\.library\.unt\.edu|web\.archive\.org)/(?:web|eot\d+)/\d+[a-z_]*/https?:/{1,2}en\.wikipedia\.org/wiki/' + SON), WP),
    # Kiwix aynası (wiki.krisyotam.com/content/wikipedia_en_all_.../X)
    (re.compile(r'https?://wiki\.krisyotam\.com/content/wikipedia_en_[a-z_]+_\d{4}-\d{2}/' + SON), WP),
]
# Kopya sayfa adları asıl başlığa (Kiwix "1P/Halley" sayfası Wikipedia'da "Halley's Comet" maddesidir)
BASLIK = {'https://en.wikipedia.org/wiki/1P/Halley': "https://en.wikipedia.org/wiki/Halley%27s_Comet",
          'https://en.wikipedia.org/wiki/ocean': 'https://en.wikipedia.org/wiki/Ocean'}
ETIKET = [  # kaynak adındaki kopya notu
    (re.compile(r' \((?:Wikiwand|IPFS kopyası|IPFS yansısı|UNT web arşivi, \d{4})\)'), ''),
    (re.compile(r'Wikipedia \((?:Wikiwand|IPFS kopyası)\)'), 'Wikipedia'),
    (re.compile(r'Cavacopedia \(Wikipedia kopyası\) – '), 'Wikipedia: '),
]
dosyalar = (glob.glob(os.path.join(K, 'arastirma/dersler_v2/d*.json')) + glob.glob(os.path.join(K, 'arastirma/dersler_v2/d*_kaynak.md'))
            + glob.glob(os.path.join(K, 'arastirma/*.md')) + glob.glob(os.path.join(K, 'cizim_*.js')))
toplam = etiket = 0
for yol in dosyalar:
    s = open(yol, encoding='utf-8', newline='').read(); s0 = s
    for d, y in DESEN: s, n = d.subn(y, s); toplam += n
    for a, b in BASLIK.items():
        s, n = re.subn(re.escape(a) + r'(?=["\'\s|)]|$)', b, s); toplam += n
    for d, y in ETIKET: s, n = d.subn(y, s); etiket += n
    if s != s0: open(yol, 'w', encoding='utf-8', newline='').write(s)
print('çevrilen adres:', toplam, '· temizlenen kopya etiketi:', etiket)
