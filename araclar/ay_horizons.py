#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/ay_horizons.py — "Bu gece Ay'da" doğrulama fixture'ı: JPL Horizons gözlemci tablosu (Ay, 301), yerel (topocentric).
Nicelikler: 2 görünür RA/Dec (tarih ekvatoru), 4 az/yükseklik, 10 aydınlık %, 14 alt gözlemci noktası (librasyon; MOON_ME
çerçevesi), 15 alt Güneş noktası (terminator = alt Güneş boylamı ± 90°), 17 kuzey kutbu konum açısı (NP.ang), 42 yerel saat açısı
(paralaktik açı için). Kaynak: https://ssd.jpl.nasa.gov/api/horizons.api (DE441). Testler ağa çıkmaz; bu dosyayı okur.
Kullanım: python3 araclar/ay_horizons.py   →  testler/veri/ay/horizons_ay.json"""
import json, os, sys, time, urllib.request, urllib.parse
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = 'https://ssd.jpl.nasa.gov/api/horizons.api'
UA = 'urania-arastirma/1.0'
YERLER = {'İstanbul': (41.0, 29.1), 'Ankara': (39.93, 32.85)}
ARALIK = [('2026-11-10 14:00', '2026-11-10 20:00', '2 h'), ('2026-11-17 15:00', '2026-11-17 23:00', '2 h'), ('2026-11-26 18:00', '2026-11-27 02:00', '4 h')]


def iste(enlem, boylam, bas, son, adim):
    p = {'format': 'json', 'COMMAND': "'301'", 'OBJ_DATA': "'NO'", 'MAKE_EPHEM': "'YES'", 'EPHEM_TYPE': "'OBSERVER'",
         'CENTER': "'coord@399'", 'COORD_TYPE': "'GEODETIC'", 'SITE_COORD': f"'{boylam},{enlem},0'",
         'START_TIME': f"'{bas}'", 'STOP_TIME': f"'{son}'", 'STEP_SIZE': f"'{adim}'", 'QUANTITIES': "'2,4,10,14,15,17,42'",
         'ANG_FORMAT': "'DEG'", 'CSV_FORMAT': "'YES'", 'APPARENT': "'AIRLESS'", 'TIME_DIGITS': "'MINUTES'"}
    r = urllib.request.urlopen(urllib.request.Request(API + '?' + urllib.parse.urlencode(p), headers={'User-Agent': UA}), timeout=90)
    t = json.loads(r.read())['result']
    bas_s = t[t.index(' Date__'):].split('\n')[0]
    sutun = [c.strip() for c in bas_s.split(',')]
    satir = t[t.index('$$SOE') + 5:t.index('$$EOE')].strip().split('\n')
    out = []
    for l in satir:
        d = dict(zip(sutun, [x.strip() for x in l.split(',')]))
        out.append(d)
    return sutun, out, t[:t.index('$$SOE')].split('Target body name')[1][:300] if 'Target body name' in t else ''


def main():
    sonuc = {'kaynak': API, 'efemeris': 'DE441 (Horizons)', 'cerceve': 'MOON_ME (Ortalama Dünya / kutup ekseni), doğu boylamı pozitif',
             'nicelikler': '2,4,10,14,15,17,42; APPARENT=AIRLESS (kırılmasız)', 'alinma': time.strftime('%Y-%m-%d'), 'olcumler': []}
    for ad, (en, bo) in YERLER.items():
        for bas, son, adim in ARALIK:
            sutun, ls, _ = iste(en, bo, bas, son, adim)
            for d in ls:
                sonuc['olcumler'].append({'yer': ad, 'enlem': en, 'boylam': bo, 'utc': d['Date__(UT)__HR:MN'], 'ra': float(d['R.A._(a-app)']),
                                          'dec': float(d['DEC_(a-app)']), 'az': float(d['Azi_(a-app)']), 'alt': float(d['Elev_(a-app)']), 'aydinlik': float(d['Illu%']),
                                          'obsLon': float(d['ObsSub-LON']), 'obsLat': float(d['ObsSub-LAT']), 'gunesLon': float(d['SunSub-LON']), 'gunesLat': float(d['SunSub-LAT']),
                                          'npAci': float(d['NP.ang']), 'saatAcisi': float(d['L_Ap_Hour_Ang'])})
            time.sleep(1)
    json.dump(sonuc, open(os.path.join(KOK, 'testler', 'veri', 'ay', 'horizons_ay.json'), 'w'), ensure_ascii=False, indent=1)
    print(len(sonuc['olcumler']), 'ölçüm')


if __name__ == '__main__':
    main()
