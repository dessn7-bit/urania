"""d3-celestial (BSD-3, Olaf Frohn) verisinden uygulamanın sıkı gök verisini üretir.
Girdi: arastirma/gokyuzu/*.json, arastirma/iau_wgsn_yildiz_adlari.json  Çıktı: veri/yildizlar.json, veri/takimyildiz.json
Koordinatlar J2000; d3-celestial boylamı -180..180 verir, burada 0..360 sağ açıklığa çevrilir.
Yıldız adları (HIP ile eşlenir): önce IAU WGSN kataloğu (aynı HIP'te birden çok ad varsa en eski kabul edilen,
ör. ε Boo: Izar); WGSN'de adı olmayan yıldızda d3-celestial adı yalnız şu koşullarla kalır: WGSN o adı başka
bir HIP'e vermemiş, ad d3-celestial'da tek yıldızda geçiyor ve TAKMA_AD listesinde değil (kural: yildiz_adlari.py)."""
import json, sys, os
K = os.path.join(os.path.dirname(__file__), '..')
g = lambda p: json.load(open(os.path.join(K, 'arastirma/gokyuzu', p), encoding='utf-8'))
ra = lambda x: round(x % 360, 4)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from yildiz_adlari import ad_bulucu   # TAKMA_AD ve ad kuralı ortme_verisi.py ile ortak

stars = g('stars.6.json')['features']
names = g('starnames.json')
ad_bul = ad_bulucu(names)
stars.sort(key=lambda f: f['properties']['mag'])
y, adlar = [], {}
for f in stars:
    m = f['properties']['mag']
    if m > 6.0: continue
    lon, lat = f['geometry']['coordinates']
    bv = f['properties'].get('bv')
    try: bv = round(float(bv), 2)
    except (TypeError, ValueError): bv = None
    n = ad_bul(f['id'])
    if n: adlar[len(y)] = n
    y.append([ra(lon), round(lat, 4), round(m, 2), bv])
json.dump({'kaynak': 'd3-celestial stars.6.json (BSD-3); adlar HIP ile IAU WGSN kataloğundan (exopla.net/star-names/modern-iau-star-names, 28.10.2026), WGSN adı olmayan yıldızlarda d3-celestial starnames.json (çift ve takma adlar çıkarıldı)', 'y': y, 'adlar': adlar},
          open(os.path.join(K, 'veri/yildizlar.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

tr = {}
trp = os.path.join(K, 'arastirma/takimyildiz_tr.json')
if os.path.exists(trp):
    d = json.load(open(trp, encoding='utf-8'))
    tr = {k: v['tr'] for k, v in d['takimyildizlar'].items()}  # Türkçe Vikipedi, Stellarium ile çapraz kontrollü
# Pyxis: Vikipedi "Kumpas"; TÜBİTAK Bilim Çocuk (bilimcocuk.tubitak.gov.tr, 2025/09 PDF: "Pupa, Yelken, Karina, Pusula,
# Altılık gibi denizcilikle ilgili adları") ve Stellarium tr.po ("Mariner Compass"/"Pyxis" → "Pusula") "Pusula" diyor
tr['Pyx'] = 'Pusula'
cons = {f['id']: f for f in g('constellations.json')['features']}
lines = {}
for f in g('constellations.lines.json')['features']:  # Yılan (Ser) iki parça: birleştir
    lines.setdefault(f['id'], []).extend(f['geometry']['coordinates'])
out = []
for k, f in cons.items():
    p = f['properties']
    lon, lat = f['geometry']['coordinates']
    ad = tr.get(k) if isinstance(tr.get(k), str) else (tr.get(k) or {}).get('tr') if isinstance(tr.get(k), dict) else None
    ad = (ad or p.get('tr') or p['name']).replace('\u2005', ' ').replace('\u00a0', ' ')
    out.append({'k': k, 'ad': ad, 'la': p['name'], 'r': int(p.get('rank', 3)), 'm': [ra(lon), lat],
                'c': [[[ra(a), round(b, 3)] for a, b in seg] for seg in lines.get(k, [])]})
json.dump(out, open(os.path.join(K, 'veri/takimyildiz.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('yildiz', len(y), 'adli', len(adlar), 'takimyildiz', len(out))
