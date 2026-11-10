#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/ay_yapilari.py — "Bu gece Ay'da" rehberinin yapı listesi → veri/ay_yapilari.json

Veri: IAU/USGS Gezegen Adlandırma Rehberi (Gazetteer of Planetary Nomenclature), Ay merkez noktaları
  https://asc-planetarynames-data.s3.us-west-2.amazonaws.com/MOON_nomenclature_center_pts.zip
  Meta veri: "Public domain."; atıf: International Astronomical Union (IAU) and United States Geological Survey (USGS).
  Koordinatlar Ay'ın "ortalama Dünya / kutup ekseni" çerçevesinde, doğu boylamı 0–360 (burada −180…180'e çevrilir).

Seçim (görev metni): yalnız yakın yüz, yalnız IAU onaylı ("Adopted by IAU") adlar, 7×50 ile seçilebilecek büyüklükteki
  denizler (Mare), okyanus (Oceanus), göller (Lacus), körfezler (Sinus), bataklıklar (Palus), kraterler ve sıradağlar (Montes).
Boyut eşiği (hesap, açıkça):
  gözün çözme gücü θ_göz = 1′ = 60″ (kaynak: arastirma/ay_rehberi_kaynak.md) ; 7× dürbünde gökte θ = 60″ / 7 = 8,57″
  Ay'ın ortalama uzaklığı d = 384 400 km (NASA Moon Fact Sheet, büyük yarı eksen) ; s = d · θ(radyan) = 384 400 × 8,57 / 206 265 ≈ 15,97 km
  Urania'nın seçimi: bir yapının biçimini tanımak için en kısa görünen ekseni en az 3 çözme öğesi (≈ 47,9 km) olmalı.
  Kısalma: Ay kürede, kenara yakın yapı bir eksende cos(c) kadar kısa görünür; c = yapının ortalama Ay merkezine açısal uzaklığı
  (cos c = cos(enlem) · cos(boylam), librasyon yok sayılır). Yani kısa eksen = çap · cos c ≥ 3 × 15,97 km.
  Sıradağlar için "çap" USGS'nin verdiği uzunluktur.
Canlı rehber: zip, planetarynames.wr.usgs.gov'daki canlı yapı sayfalarının gerisinde kalabiliyor (v47 doğrulamasında 153 yapının
  10'unda çap/konum farkı). Bu yüzden seçilen her yapının canlı sayfası okunur (Diameter, Center Latitude, Center Longitude);
  fark varsa canlı değer kullanılır, zip değeri "zip" alanında kalır, eşik canlı değerle yeniden uygulanır.
Türkçe adlar: arastirma/ay_adlari_tr.json (her ad kaynaklı; kaynağı olmayan Latince kalır).
Kullanım: python3 araclar/ay_yapilari.py [--zip yerel.zip] [--canlisiz]
"""
import sys, os, io, re, json, math, struct, time, zipfile, urllib.request, datetime

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'https://asc-planetarynames-data.s3.us-west-2.amazonaws.com/MOON_nomenclature_center_pts.zip'
UA = 'urania-arastirma/1.0'
GOZ_YAYSN = 60.0          # gözün çözme gücü (yay saniyesi)
BUYUTME = 7               # 7×50
UZAKLIK_KM = 384400.0     # Ay'ın ortalama uzaklığı (NASA Moon Fact Sheet)
OGE = 3                   # Urania'nın seçimi: biçimi tanımak için en az 3 çözme öğesi
TURLER = {'ME': 'deniz', 'OC': 'okyanus', 'LC': 'göl', 'SI': 'körfez', 'PA': 'bataklık', 'AA': 'krater', 'MO': 'sıradağ'}


def dbf_oku(ham):
    n = struct.unpack('<I', ham[4:8])[0]; hl = struct.unpack('<H', ham[8:10])[0]; rl = struct.unpack('<H', ham[10:12])[0]
    alan, o = [], 32
    while ham[o] != 0x0D:
        d = ham[o:o + 32]; alan.append((d[:11].split(b'\0')[0].decode(), d[16])); o += 32
    satir = []
    for i in range(n):
        r = ham[hl + i * rl: hl + (i + 1) * rl]; p = 1; rec = {}
        for ad, uz in alan:
            rec[ad] = r[p:p + uz].decode('utf-8', 'replace').strip(); p += uz
        satir.append(rec)
    return satir


def canli(url):
    """USGS canlı yapı sayfasından çap (km), merkez enlem ve doğu boylamı (°)."""
    for i in range(5):
        try:
            h = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read().decode('utf-8', 'replace')
            break
        except Exception:
            if i == 4:
                raise
            time.sleep(2 ** (i + 1))
    t = re.sub(r'<[^>]*>', ' ', h).replace('&deg;', ' ')
    def al(ad):
        m = re.search(ad + r'\s+(-?[\d.]+)', t)
        return float(m.group(1)) if m else None
    time.sleep(0.4)
    return al('Diameter'), al('Center Latitude'), al('Center Longitude')


def main(argv):
    if '--zip' in argv:
        ham_zip = open(argv[argv.index('--zip') + 1], 'rb').read()
    else:
        ham_zip = urllib.request.urlopen(urllib.request.Request(URL, headers={'User-Agent': UA}), timeout=180).read()
    z = zipfile.ZipFile(io.BytesIO(ham_zip))
    dbf = [n for n in z.namelist() if n.endswith('.dbf')][0]
    meta = [n for n in z.namelist() if n.endswith('.xml')][0]
    useconst = z.read(meta).decode('utf-8', 'replace').split('<useconst>')[1].split('</useconst>')[0].strip()
    rows = dbf_oku(z.read(dbf))
    tr = json.load(open(os.path.join(KOK, 'arastirma', 'ay_adlari_tr.json'), encoding='utf-8'))
    olcek = UZAKLIK_KM * (GOZ_YAYSN / BUYUTME) / 206264.806
    esik = OGE * olcek
    yap = []
    for r in rows:
        if not r['approval'].startswith('Adopted by IAU'):
            continue
        kod = r['code']
        if kod not in TURLER or (kod == 'MO' and not r['name'].startswith('Montes')):
            continue
        lon = float(r['center_lon']); lon = lon - 360 if lon > 180 else lon
        lat = float(r['center_lat']); cap = float(r['diameter'])
        if abs(lon) > 90:
            continue                      # yakın yüz: ortalama Ay merkezine 90°'den yakın
        cosc = math.cos(math.radians(lat)) * math.cos(math.radians(lon))
        if cosc <= 0 or cap * cosc < esik:
            continue
        t = tr.get(r['name'])
        o = {'ad': r['name'], 'tur': TURLER[kod], 'cap': round(cap, 1), 'boylam': round(lon, 3), 'enlem': round(lat, 3),
             'usgs': r['link'].replace('http://', 'https://')}
        if '--canlisiz' not in argv:
            c, en, bo = canli(o['usgs'])
            if c is not None and en is not None and bo is not None:
                bo = bo - 360 if bo > 180 else bo
                if abs(c - cap) > 0.05 or abs(en - lat) > 0.005 or abs(bo - lon) > 0.005:
                    o['zip'] = {'cap': o['cap'], 'enlem': o['enlem'], 'boylam': o['boylam']}
                    o['cap'], o['enlem'], o['boylam'] = round(c, 1), round(en, 3), round(bo, 3)
                    kosc = math.cos(math.radians(en)) * math.cos(math.radians(bo))
                    if abs(bo) > 90 or kosc <= 0 or c * kosc < esik:
                        print('canlı değerle eşik altı, çıkarıldı:', o['ad']); continue
        if t and t.get('tr'):
            o['tr'] = t['tr']; o['trKaynak'] = t['kaynak']
        elif t and t.get('koken'):
            o['koken'] = t['koken']; o['kokenKaynak'] = t['kaynak']
        yap.append(o)
    yap.sort(key=lambda o: -o['cap'])
    veri = {
        'aciklama': "Bu gece Ay'da rehberinin yapıları: yakın yüz, IAU onaylı adlar, 7×50 ile biçimi seçilebilecek büyüklükte.",
        'kaynak': {'veri': URL, 'canli': 'https://planetarynames.wr.usgs.gov/Feature/<id> (zip ile fark varsa canlı değer; zip değeri yapının "zip" alanında)', 'kullanim': useconst, 'atif': 'International Astronomical Union (IAU) and United States Geological Survey (USGS), Gazetteer of Planetary Nomenclature',
                   'cerceve': 'Ay ortalama Dünya / kutup ekseni; doğu boylamı pozitif (−180…180)'},
        'esik': {'gozYaySn': GOZ_YAYSN, 'buyutme': BUYUTME, 'uzaklikKm': UZAKLIK_KM, 'cozmeKm': round(olcek, 2), 'oge': OGE, 'esikKm': round(esik, 1),
                 'hesap': f"{GOZ_YAYSN:.0f}″ / {BUYUTME} = {GOZ_YAYSN / BUYUTME:.2f}″ ; {UZAKLIK_KM:.0f} km × {GOZ_YAYSN / BUYUTME:.2f}″ / 206 265 = {olcek:.2f} km ; "
                          f"Urania'nın seçimi: kısa görünen eksen ≥ {OGE} çözme öğesi = {esik:.1f} km (çap × cos c)"},
        'uretim': {'tarih': datetime.date.today().isoformat(), 'arac': 'araclar/ay_yapilari.py'},
        'yapilar': yap
    }
    json.dump(veri, open(os.path.join(KOK, 'veri', 'ay_yapilari.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    from collections import Counter
    print('canlı sayfayla düzeltilen:', [o['ad'] for o in yap if 'zip' in o])
    print(len(yap), 'yapı', dict(Counter(o['tur'] for o in yap)), 'Türkçe adlı:', sum(1 for o in yap if 'tr' in o), 'eşik', round(esik, 1), 'km')


if __name__ == '__main__':
    main(sys.argv)
