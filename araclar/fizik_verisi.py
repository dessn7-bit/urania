"""arastirma/ altındaki doğrulanmış kaynak dosyalarından veri/fizik.json'u üretir.
Elle sayı YAZILMAZ: her değer bir araştırma dosyasından, kaynağıyla birlikte gelir.
Tek istisna standart yerçekimi ivmesi g0 (tanım gereği kesin; kaynağı aşağıda)."""
import json, os
K = os.path.join(os.path.dirname(__file__), '..')
A = lambda p: json.load(open(os.path.join(K, 'arastirma', p), encoding='utf-8'))

sab = {x['anahtar']: x for x in A('sabitler.json')['sabitler']}
def S(k, ad=None):
    x = sab[k]; kay = x['kaynaklar'][0]
    kisa = kay['kaynak'].split(' (')[0]
    return {'deger': float(x['deger']), 'birim': x['birim'], 'kaynak': kisa, 'url': kay['url']}

cis = {c['ad_tr']: c for c in A('gezegenler.json')['cisimler']}
dunya = cis['Dünya']
sabitler = {
    'G': S('G'), 'c': S('c'), 'h': S('h'), 'k_B': S('k_B'),
    'sigma': S('sigma_SB'), 'b_wien': S('b_Wien'),
    'au': S('au'), 'pc': S('parsec'), 'ly': S('light_year'),
    'R_gunes': S('R_sun_N'), 'L_gunes': S('L_sun_N'), 'T_gunes': S('Teff_sun_N'), 'GM_gunes': S('GM_sun_N'),
    'M_gunes': S('M_sun'), 'M_dunya': S('M_earth'), 'GM_dunya': S('GM_E_N'),
    'MV_gunes': S('MV_sun'), 'Mbol_gunes': S('Mbol_sun'),
    'R_dunya': {'deger': dunya['ortalama_yaricap_km'] * 1e3, 'birim': 'm', 'kaynak': 'NASA Earth Fact Sheet', 'url': dunya['kaynak_url']},
    'g0': {'deger': 9.80665, 'birim': 'm s^-2', 'kaynak': 'Standart yerçekimi ivmesi (3. CGPM, 1901; tanım)', 'url': 'https://en.wikipedia.org/wiki/Standard_gravity'}
}
# Kurtulma hızı hesabı için cisimler (Güneş ve Plüton dahil)
sira = ['Merkür', 'Venüs', 'Dünya', 'Ay', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton', 'Güneş']
gezegenler = [{'ad': a, 'kutle_kg': cis[a]['kutle_kg'], 'yaricap_km': cis[a]['ortalama_yaricap_km'],
               'kurtulma_kms': cis[a].get('kacis_hizi_km_s'), 'url': cis[a]['kaynak_url']} for a in sira]

tab = A('simulasyon_tablolari.json')
ak = tab['anakol_ozellikleri']; om = tab['anakol_omurleri']
omur = {r[0]: r[3] for r in om['satirlar']}
anakol = {
    'kaynak': 'Mamajek, Mean Dwarf Stellar Color and Teff Sequence', 'url': ak['kaynak_url'],
    'not': 'Ömürler τ ≈ 10¹⁰ yıl × (M/M☉)(L☉/L) yaklaşımıyla hesaplandı; tablodaki kütleler kaynağın kendi notuna göre kesin değil.',
    'omur': {'kaynak': 'Wikipedia: Main sequence (ömür ilişkisi)', 'url': om['kaynak_url']},
    'tablo': [{'tip': r[0], 'kutle': r[1], 'isima': r[2], 'sicaklik': r[3], 'yaricap': r[4], 'omur_yil': omur[r[0]]} for r in ak['satirlar']]
}
ns = tab['nihai_son']
sonlar = {'kaynak': 'Wikipedia: Stellar evolution, White dwarf; NASA', 'url': ns['kaynak_url'], 'not': ns.get('not'),
          'tablo': [{'min': r[1] or 0, 'max': r[2], 'son': r[4]} for r in ns['satirlar']]}
ref = {r['ad']: r for r in tab['referans_degerler']}
def KD(ad, anahtar, etiket):
    r = ref[anahtar]
    return {'ad': etiket, 'kutle_gunes': r['deger'], 'kaynak': ad, 'url': r.get('ikinci_kaynak_url') or r['kaynak_url']}
karadelikler = [
    {'ad': 'Örnek: 10 Güneş kütlesi', 'kutle_gunes': 10, 'kaynak': None, 'url': None},
    KD('ESO eso2119 (Sgr A*)', 'Sgr A* kütlesi', 'Sgr A* (Samanyolu merkezi)'),
    KD('ESO eso1907 (M87*)', 'M87* kütlesi', 'M87*')
]
karadelikler = [k for k in karadelikler]
uzakliklar = [
    {'ad': 'Proxima Centauri', 'isik_yili': ref['Proxima Centauri uzaklığı']['deger'], 'kaynak': 'NASA Sun facts (Proxima)', 'url': ref['Proxima Centauri uzaklığı']['kaynak_url']},
    {'ad': 'Samanyolu merkezi', 'isik_yili': 27000, 'kaynak': 'ESO eso2119 (Sgr A* uzaklığı)', 'url': ref['Galaksi merkezine uzaklık (R0)']['ikinci_kaynak_url']},
    {'ad': 'Andromeda Galaksisi', 'isik_yili': ref['Andromeda uzaklığı']['deger'], 'kaynak': 'NASA (Andromeda)', 'url': ref['Andromeda uzaklığı']['kaynak_url']}
]
out = {'aciklama': 'Urania fizik verisi; araclar/fizik_verisi.py ile arastirma/ dosyalarından üretilir.',
       'sabitler': sabitler, 'gezegenler': gezegenler,
       'gezegenKaynak': {'ad': 'NASA Planetary Fact Sheets', 'url': 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/'},
       'anakol': anakol, 'sonlar': sonlar, 'karadelikler': karadelikler, 'uzakliklar': uzakliklar}
json.dump(out, open(os.path.join(K, 'veri/fizik.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('fizik.json:', len(sabitler), 'sabit,', len(gezegenler), 'cisim,', len(anakol['tablo']), 'anakol satırı')
