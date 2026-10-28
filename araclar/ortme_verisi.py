"""Ay örtmesi için yıldız listesi: Hipparcos ana kataloğu (ESA 1997, CDS I/239).
Kullanım: python3 araclar/ortme_verisi.py /yol/hip_main.dat
Seçim: tutuluma ±7° içinde (Ay'ın yörünge eğikliği 5,15° + ıraklık ~1° + yarıçap ~0,27°)
ve V ≤ 4,5; Ülker'in parlak üyeleri (V ≤ 5,8) ayrıca eklenir.
Çıktı konumu J2000.0 anına taşınmıştır (Hipparcos dönemi J1991.25, öz hareketle);
öz hareket (mas/yıl, μα* = μα·cosδ) uygulama için ayrıca saklanır.
Adlar: özel ad IAU WGSN kataloğundan (HIP ile; kural gok_verisi.py ile aynı), WGSN adı yoksa d3-celestial
starnames.json (çift ve takma adlar hariç); Bayer/Flamsteed + takımyıldız d3-celestial'dan."""
import json, math, os, sys
K = os.path.join(os.path.dirname(__file__), '..')
adlar = json.load(open(os.path.join(K, 'arastirma/gokyuzu/starnames.json'), encoding='utf-8'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from yildiz_adlari import ad_bulucu   # TAKMA_AD ve ad kuralı gok_verisi.py ile ortak
ad_bul = ad_bulucu(adlar)
ULKER = {17702, 17847, 17499, 17573, 17608, 17531, 17851, 17489, 17579}
EPS = math.radians(23.4392911)  # J2000 tutulum eğikliği (IAU 1980; IERS Conventions)

def tutulum_enlem(ra, dec):
    a, d = math.radians(ra), math.radians(dec)
    return math.degrees(math.asin(math.sin(d) * math.cos(EPS) - math.cos(d) * math.sin(EPS) * math.sin(a)))

out = []
for satir in open(sys.argv[1], encoding='ascii'):
    p = [x.strip() for x in satir.split('|')]
    hip = int(p[1])
    try:
        v, ra, dec = float(p[5]), float(p[8]), float(p[9])
        pmra, pmde = float(p[12] or 0), float(p[13] or 0)
    except ValueError:
        continue
    if not (v <= 4.5 or (hip in ULKER and v <= 5.8)):
        continue
    if abs(tutulum_enlem(ra, dec)) > 7.0:
        continue
    # J1991.25 → J2000.0 (8,75 yıl), doğrusal öz hareket
    t = 8.75
    dec2 = dec + pmde * t / 3.6e6
    ra2 = ra + pmra * t / 3.6e6 / math.cos(math.radians(dec))
    n = adlar.get(str(hip), {})
    ad = ad_bul(hip)
    desig = n.get('desig') or ''
    out.append({'hip': hip, 'ad': ad, 'd': desig, 'c': n.get('c', ''), 'ra': round(ra2 % 360, 6), 'dec': round(dec2, 6),
                'pa': round(pmra, 2), 'pd': round(pmde, 2), 'v': v, 'u': 1 if hip in ULKER else 0})
out.sort(key=lambda x: x['v'])
json.dump({'kaynak': 'Hipparcos ana kataloğu (ESA 1997, CDS I/239); özel adlar IAU WGSN kataloğu (28.10.2026), WGSN adı yoksa ve Bayer adları d3-celestial (BSD-3)',
           'not': 'ra/dec J2000.0 anında (ICRS), pa=μα·cosδ, pd=μδ (mas/yıl)', 'y': out},
          open(os.path.join(K, 'veri/ortme_yildiz.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'yıldız;', sum(1 for x in out if not x['ad'] and not x['d']), 'adsız')
