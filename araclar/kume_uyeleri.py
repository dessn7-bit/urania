#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/kume_uyeleri.py — açık kümelerin en parlak üyeleri (V) SIMBAD'dan, üyelik SIMBAD h_link (kaynaklı üyelik
listeleri) ile → veri/kume_uyeleri.json. Görünürlük hesabının "üye yolu" bunu kullanır.

Servis: SIMBAD TAP aynası https://simbad.cfa.harvard.edu/simbad/sim-tap (ADQL, senkron, JSON). Tablolar:
  basic (oid, main_id, otype, ra, dec), ident (id → oidref), allfluxes (V, B), h_link (child, parent, membership %, link_bibcode).
  h_link: yayımlanmış üyelik kataloglarından gelen "çocuk nesne → üst nesne" bağları; membership yüzde, link_bibcode kaynak
  makalenin ADS bibcode'u (örn. 2018A&A...618A..93C Cantat-Gaudin ve ark. 2018 Gaia DR2 üyeleri).
Kural: bir yıldız üye sayılır ↔ en az bir kaynakta üyelik ≥ 50 %. En parlak 5 üye (V) ve kaynak bibcode'ları yazılır.
Özel durumlar:
  Cr 399 (Brocchi, "Elbise Askısı"): fiziksel küme değil, asterizm; h_link'te üye yok. Desen yıldızları hedef merkezinden 0,6°
    içindeki V < 7,5 yıldızlar olarak koni taramasıyla alınır ve 'asterizm' diye işaretlenir (üyelik kataloğu yoktur).
  M42: "merkezdeki yıldızlar" testi için Orion Bulutsusu Kümesi üyeleri (SIMBAD 'NAME ONC' h_link; Trapezium bu kümenin
    çekirdeğidir: θ¹ Ori C V 5,13 üyelik %92–100, θ¹ Ori D, θ² Ori A/B).
İstek başlıklarında e-posta ya da kişisel veri yok (User-Agent genel). Kullanım: python araclar/kume_uyeleri.py [--cikti veri/kume_uyeleri.json]
"""
import sys, os, json, time, datetime, urllib.request, urllib.parse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAP = 'https://simbad.cfa.harvard.edu/simbad/sim-tap/sync'
UA = 'urania-arastirma/1.0'
ESIK = 50          # üyelik yüzdesi (Urania'nın seçimi: en az bir kaynakta ≥ %50)
EN_COK = 5         # en parlak üye sayısı (görev metni: "en parlak 5 üye")
KONI_YARICAP, KONI_V = 0.6, 7.5   # Cr 399 koni taraması: yarıçap derece, V üst sınırı (Urania'nın seçimi; asterizmin ~70′ çapı ve 7×50 sınırı)

# hedefler.json id → SIMBAD üst nesne kimliği (h_link parent) ; 'koni' = asterizm için koni taraması
KUMELER = [
    ('M45', 'M 45'), ('M44', 'M 44'), ('M6', 'M 6'), ('M7', 'M 7'), ('M11', 'M 11'), ('M35', 'M 35'), ('M36', 'M 36'),
    ('M37', 'M 37'), ('M38', 'M 38'), ('M39', 'M 39'), ('NGC 869', 'NGC 869'), ('NGC 884', 'NGC 884'),
    ('Mel 111', 'Cl Melotte 111'), ('Cr 399', 'koni'),
    ('M42', 'NAME ONC')      # Orion Nebula Cluster (M42'nin merkez kümesi; Trapezium bunun çekirdeği): θ¹ Ori C, D, θ² Ori A, B …
]


def sorgu(adql):
    url = TAP + '?' + urllib.parse.urlencode({'REQUEST': 'doQuery', 'LANG': 'ADQL', 'FORMAT': 'json', 'QUERY': adql})
    istek = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/json'})
    with urllib.request.urlopen(istek, timeout=90) as r:
        j = json.loads(r.read().decode('utf-8'))
    return j.get('data', [])


def uyeler(simbad_id):
    """h_link üyeleri: (ad, V, üyelik, bibcode) satırları; V'si olanlar, en parlaktan."""
    q = ("SELECT TOP 400 b.main_id AS ad, f.V AS v, h.membership AS uyelik, h.link_bibcode AS kaynak "
         "FROM h_link AS h JOIN basic AS b ON b.oid = h.child JOIN ident AS i ON i.oidref = h.parent "
         "LEFT JOIN allfluxes AS f ON f.oidref = b.oid "
         f"WHERE i.id = '{simbad_id}' AND f.V IS NOT NULL ORDER BY v ASC")
    satirlar = sorgu(q)
    yildiz = {}
    for ad, v, uy, kaynak in satirlar:
        ad = ' '.join(str(ad).split())
        if uy is None or uy < ESIK:
            continue
        y = yildiz.setdefault(ad, {'ad': ad, 'V': float(v), 'uyelik': int(uy), 'kaynaklar': []})
        y['uyelik'] = max(y['uyelik'], int(uy))
        if kaynak and kaynak not in y['kaynaklar']:
            y['kaynaklar'].append(kaynak)
    ls = sorted(yildiz.values(), key=lambda y: y['V'])
    return ls, len(satirlar)


def koni(ra, dec, yaricap, v_ust):
    q = ("SELECT TOP 40 b.main_id AS ad, f.V AS v, b.otype AS tur FROM basic AS b JOIN allfluxes AS f ON f.oidref = b.oid "
         f"WHERE CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', {ra}, {dec}, {yaricap})) = 1 AND f.V < {v_ust} ORDER BY v ASC")
    ls = []
    for ad, v, tur in sorgu(q):
        t = str(tur)
        if '*' not in t or t.startswith('Cl') or t.startswith('As'):      # yalnız yıldız türleri (Cl*, As*, G, Neb vb. değil)
            continue
        ls.append({'ad': ' '.join(str(ad).split()), 'V': float(v), 'tur': tur})
    return ls


def main(argv):
    cikti = os.path.join(KOK, 'veri', 'kume_uyeleri.json')
    if '--cikti' in argv:
        cikti = argv[argv.index('--cikti') + 1]
    with open(os.path.join(KOK, 'veri', 'hedefler.json'), encoding='utf-8') as f:
        hedefler = {h['id']: h for h in json.load(f)['hedefler']}
    sonuc = {}
    for hid, sid in KUMELER:
        h = hedefler[hid]
        if sid == 'koni':
            ls = koni(h['ra'], h['dec'], KONI_YARICAP, KONI_V)
            sonuc[hid] = {'simbad': None, 'asterizm': True, 'uyelikKaynagi': f'yok: Cr 399 fiziksel küme değil (asterizm); desen yıldızları SIMBAD koni taraması ({KONI_YARICAP}°, V < {KONI_V}; Urania\'nın seçimi)',
                          'uyeler': [{'ad': y['ad'], 'V': y['V'], 'uyelik': None, 'kaynaklar': ['SIMBAD koni taraması']} for y in ls[:EN_COK]], 'toplam': len(ls)}
        else:
            ls, ham = uyeler(sid)
            sonuc[hid] = {'simbad': sid, 'uyeler': ls[:EN_COK], 'toplam': len(ls), 'hamSatir': ham,
                          'uyelikKaynagi': 'SIMBAD h_link, üyelik ≥ %d (kaynak bibcode her yıldızda)' % ESIK}
            if hid == 'M42':
                sonuc[hid]['not'] = 'M42 merkez yıldızları (Orion Bulutsusu Kümesi / Trapezium) — bulutsunun kendisi değil; yıldız testi için'
        u = sonuc[hid]['uyeler']
        print(f"{hid:8s} {len(u)} üye | " + ' ; '.join(f"{y['ad']} V{y['V']:.2f}" + (f" (%{y['uyelik']})" if y.get('uyelik') is not None else '') for y in u))
        time.sleep(1.0)
    veri = {
        'aciklama': 'Açık kümelerin en parlak üyeleri (V, SIMBAD) ve üyelik kaynakları; görünürlük "üye yolu" (en az 3 üye nokta kaynak sınırından parlaksa "görünür (yıldızları seçilir)").',
        'kaynak': {'servis': 'SIMBAD TAP (CfA aynası) ' + TAP, 'uyelik': 'SIMBAD h_link (yayımlanmış üyelik listeleri; bibcode her yıldızda)', 'parlaklik': 'SIMBAD allfluxes.V',
                   'atif': 'This research has made use of the SIMBAD database, operated at CDS, Strasbourg, France (Wenger et al. 2000, A&AS 143, 9).'},
        'uyelikEsigi': ESIK, 'uretim': {'tarih': datetime.date.today().isoformat(), 'arac': 'araclar/kume_uyeleri.py'},
        'kumeler': sonuc
    }
    with open(cikti, 'w', encoding='utf-8') as f:
        json.dump(veri, f, ensure_ascii=False, indent=1)
    print('yazıldı:', cikti)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
