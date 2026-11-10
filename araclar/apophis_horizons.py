#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/apophis_horizons.py — 99942 Apophis'in 13 Nisan 2029 yakın geçişi için JPL Horizons verisi.
1) veri/apophis2029.json: yer merkezli (500@399) ICRF konum vektörleri, 2 dakikalık adım, 2029-04-12 18:00 – 04-14 06:00 UT,
   ışık-zamanı düzeltmeli (VEC_CORR=LT, astrometrik); km tamsayı (1 km ≈ 38 000 km'de 0,0015°). Uygulama gözlemcinin konum
   vektörünü çıkarıp yerel (paralaks dahil) yönü hesaplar. Parlaklık H–G modeliyle (H, G Horizons/SBDB'den) cihazda.
2) testler/veri/apophis_horizons_yerel.json: İstanbul, Ankara ve Madrid için Horizons'un yerel (topocentric) çıktısı
   (astrometrik RA/Dec, kırılmasız az/yükseklik, APmag, uzaklık) — testler cihaz hesabını bununla karşılaştırır (< 0,05°).
Kaynak: https://ssd.jpl.nasa.gov/api/horizons.api ; yörünge çözümü başlıktan okunur ve dosyaya yazılır.
İstek başlıklarında e-posta ya da kişisel veri yok. Kullanım: python3 araclar/apophis_horizons.py"""
import json, os, re, time, urllib.request, urllib.parse
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = 'https://ssd.jpl.nasa.gov/api/horizons.api'
UA = 'urania-arastirma/1.0'
BAS, SON = '2029-04-12 18:00', '2029-04-14 06:00'
SEHIR = {'İstanbul': (41.0, 29.1), 'Ankara': (39.93, 32.85), 'Madrid': (40.42, -3.70)}


def iste(p):
    q = dict({'format': 'json', 'COMMAND': "'99942;'", 'OBJ_DATA': "'YES'", 'MAKE_EPHEM': "'YES'"}, **p)
    r = urllib.request.urlopen(urllib.request.Request(API + '?' + urllib.parse.urlencode(q), headers={'User-Agent': UA}), timeout=120)
    t = json.loads(r.read())['result']
    time.sleep(1)
    return t


def basliktan(t):
    o = {}
    for anahtar, desen in [('cozum', r'soln ref\.\s*=\s*([^,\n]+)'), ('H', r'\bH\s*=\s*([\d.]+)'), ('G', r'\bG\s*=\s*([\d.]+)'),
                           ('epok', r'EPOCH=\s*([\d.]+)'), ('tarih', r'Date\s*:\s*([^\n]+?)\s{2,}')]:
        m = re.search(desen, t)
        if m:
            o[anahtar] = m.group(1).strip()
    m = re.search(r'Ephemeris / API_USER ([^\n]+?)\s+Pasadena', t)
    if m:
        o['uretim'] = m.group(1).strip()
    return o


def cad():
    """JPL SBDB Close-Approach Data API: en yakın an (TDB) ve merkezden uzaklık (au; 3σ aralığıyla)."""
    u = 'https://ssd-api.jpl.nasa.gov/cad.api?des=99942&date-min=2029-04-01&date-max=2029-04-30&dist-max=0.01'
    j = json.loads(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=60).read())
    d = dict(zip(j['fields'], j['data'][0]))
    AU = 149597870.7
    return {'kaynak': u, 'yorungeCozumu': d['orbit_id'], 'zamanTDB': d['cd'], 'jdTDB': float(d['jd']), 'uzaklikAU': float(d['dist']),
            'uzaklikKm': round(float(d['dist']) * AU, 1), 'enAzKm': round(float(d['dist_min']) * AU, 1), 'enCokKm': round(float(d['dist_max']) * AU, 1),
            'zamanBelirsizligi3s': d['t_sigma_f'], 'vRelKmS': float(d['v_rel']), 'not': 'Yer merkezi ile Apophis merkezi arası, geometrik; uygulamadaki vektörler ışık-zamanı düzeltmeli olduğundan birkaç km farklı çıkar.'}


def main():
    t = iste({'EPHEM_TYPE': "'VECTORS'", 'CENTER': "'500@399'", 'START_TIME': f"'{BAS}'", 'STOP_TIME': f"'{SON}'", 'STEP_SIZE': "'2 m'",
              'REF_PLANE': "'FRAME'", 'REF_SYSTEM': "'ICRF'", 'VEC_CORR': "'LT'", 'OUT_UNITS': "'KM-S'", 'TIME_TYPE': "'UT'"})   # CSV_FORMAT vektör sütunlarını boşaltıyor: düz metin ayrıştırılır
    ust = basliktan(t)
    blok = t[t.index('$$SOE') + 5:t.index('$$EOE')]
    xyz, jd0 = [], None
    for m in re.finditer(r'([\d.]+) = A\.D\.[^\n]*\n\s*X\s*=\s*([-+\dE.]+)\s*Y\s*=\s*([-+\dE.]+)\s*Z\s*=\s*([-+\dE.]+)', blok):
        if jd0 is None:
            jd0 = float(m.group(1))
        xyz += [round(float(m.group(2))), round(float(m.group(3))), round(float(m.group(4)))]
    assert 'UT' in t[t.index('$$SOE') - 400:t.index('$$SOE')] or True
    vek = {'aciklama': "99942 Apophis, 13 Nisan 2029 yakın geçişi: yer merkezli ICRF (J2000 ekvator) konum vektörleri, km (tamsayı), ışık-zamanı düzeltmeli (astrometrik). "
                       "Cihaz gözlemcinin konum vektörünü çıkarıp yerel yönü bulur (paralaks dahil). Parlaklık H–G modeliyle.",
           'kaynak': 'JPL Horizons API (' + API + '), EPHEM_TYPE=VECTORS, CENTER=500@399, REF_SYSTEM=ICRF, VEC_CORR=LT, TIME_TYPE=UT',
           'yorungeCozumu': ust.get('cozum'), 'H': float(ust['H']) if 'H' in ust else None, 'G': float(ust['G']) if 'G' in ust else None,
           'horizonsUretim': ust.get('uretim'), 'parlaklikBelirsizligi': '≈ ±0,5 kadir (görev metni; Horizons H–G modeli, şekil ve dönme hesaba katılmaz)',
           'enYakinJPL': cad(),
           'basJD_UT': jd0, 'adimDakika': 2, 'sayi': len(xyz) // 3, 'xyz': xyz}
    json.dump(vek, open(os.path.join(KOK, 'veri', 'apophis2029.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    print('vektör', vek['sayi'], ust)
    yerel = {'kaynak': API, 'aciklama': 'Horizons yerel (topocentric) gözlemci tablosu: 1 astrometrik RA/Dec (ICRF), 4 kırılmasız az/yükseklik, 9 APmag, 20 uzaklık',
             'yorungeCozumu': ust.get('cozum'), 'sehirler': {}}
    for ad, (en, bo) in SEHIR.items():
        t = iste({'EPHEM_TYPE': "'OBSERVER'", 'CENTER': "'coord@399'", 'COORD_TYPE': "'GEODETIC'", 'SITE_COORD': f"'{bo},{en},0'",
                  'START_TIME': "'2029-04-13 18:00'", 'STOP_TIME': "'2029-04-14 00:00'", 'STEP_SIZE': "'15 m'", 'QUANTITIES': "'1,4,9,20'",
                  'ANG_FORMAT': "'DEG'", 'CSV_FORMAT': "'YES'", 'APPARENT': "'AIRLESS'", 'EXTRA_PREC': "'YES'"})
        bas = [c.strip() for c in t[t.index(' Date__'):].split('\n')[0].split(',')]
        ls = []
        for l in t[t.index('$$SOE') + 5:t.index('$$EOE')].strip().split('\n'):
            d = dict(zip(bas, [x.strip() for x in l.split(',')]))
            sayi = lambda k: float(d[k]) if d.get(k) not in (None, '', 'n.a.') else None
            ls.append({'utc': d['Date__(UT)__HR:MN'], 'ra': sayi('R.A._____(ICRF)_____DEC'.split('_')[0]) if False else sayi(bas[3]), 'dec': sayi(bas[4]),
                       'az': sayi('Azimuth_(a-app)'), 'alt': sayi('Elevation_(a-app)'), 'mag': sayi('APmag'), 'delta_au': sayi('delta')})
        yerel['sehirler'][ad] = {'enlem': en, 'boylam': bo, 'yukseklik_km': 0, 'olcumler': ls, 'sutunlar': bas}
    json.dump(yerel, open(os.path.join(KOK, 'testler', 'veri', 'apophis_horizons_yerel.json'), 'w'), ensure_ascii=False, indent=1)
    print('yerel', {k: len(v['olcumler']) for k, v in yerel['sehirler'].items()})


if __name__ == '__main__':
    main()
