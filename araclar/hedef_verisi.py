"""arastirma/hedefler_dogrulanmis.json'dan (SIMBAD/SEDS çapraz kontrollü) veri/hedefler.json'u üretir."""
import json, os
K = os.path.join(os.path.dirname(__file__), '..')
TUR = {'acik_kume': 'Açık küme', 'kuresel_kume': 'Küresel küme', 'bulutsu': 'Bulutsu', 'gezegenimsi': 'Gezegenimsi bulutsu',
       'galaksi': 'Galaksi', 'cift_yildiz': 'Çift yıldız', 'yildiz_kumesi_asterizm': 'Yıldız dizilimi'}
KISA_TUR = {'bulutsu': 'bulutsu', 'gezegenimsi': 'bulutsu', 'galaksi': 'galaksi'}
H = json.load(open(os.path.join(K, 'arastirma/hedefler_dogrulanmis.json'), encoding='utf-8'))
out = []
for h in H:
    import re
    kisa = re.sub(r'^(NGC|Mel|Cr)(\d)', r'\1 \2', h['kisa'])
    en = (h.get('ad_en') or '').split(',')[0].strip()
    if h.get('ad_tr'): ad = h['ad_tr']
    elif en and en != h['kisa']: ad = f"{kisa} ({en})"
    else: ad = kisa
    out.append({'id': h['id'], 'kisa': kisa, 'ad': ad, 'tur': KISA_TUR.get(h['tur'], h['tur']), 'turAd': TUR.get(h['tur'], h['tur']),
                'ra': round(float(h['ra_deg']), 4), 'dec': round(float(h['dec_deg']), 4), 'kadir': h['kadir'],
                'boyut': h.get('boyut'), 'takimyildiz': h['takimyildiz'], 'katalog': kisa if h.get('ad_tr') and h['ad_tr'] != kisa else None})
json.dump({'kaynak': 'SIMBAD (CDS) ve SEDS Messier kataloğu çapraz kontrolü, J2000', 'hedefler': out},
          open(os.path.join(K, 'veri/hedefler.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(out), 'hedef')
