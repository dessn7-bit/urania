#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/degisen_verisi.py — AAVSO Dürbün Programı yıldız listesi → veri/durbun_degisenleri.json; VSX test fixture'ları.

Kaynak liste: https://mintaka.aavso.org/sites/default/files/BinocularProgramStars-2017_1.csv
  Sütunlar: Name, N/S, AUID, Coords (sa dk sn ±° ′ ″, J2000), Const, Type, Period, Mag, Min FOV/ Lim Mag, Notes.
  Uygulamaya yalnız İstanbul'dan görülebilenler (dik açıklık > −30°) alınır. Gözlemci bilgisi bu listede yoktur.
VSX API (yalnız vsx.aavso.org): index.php?view=api.object&ident=<ad>&format=json&data=<n>&fromjd=<jd>
  Fixture'a kişisel veri GİRMEZ: ObsCode, ObsName, ObsCountry, ObsAffil, Comp1/2, Charts, CMag, KMag, Id, Name silinir;
  yalnız JD, Mag, Band, ObsType, ValFlag, Uncertainty kalır. Nesne düzeyinde yalnız ad, AUID, konum, tür, dönem, kadir aralığı.

Kullanım:
  python araclar/degisen_verisi.py [--csv <yol>]                   # liste → veri/durbun_degisenleri.json
  python araclar/degisen_verisi.py --fixture "Mira" "EG And" ...   # VSX'ten son 7 gün → testler/veri/vsx/<ad>.json (temizlenmiş)
"""
import sys, os, csv, json, re, datetime, time, urllib.request, urllib.parse, tempfile

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LISTE_URL = 'https://mintaka.aavso.org/sites/default/files/BinocularProgramStars-2017_1.csv'
VSX = 'https://vsx.aavso.org/index.php?view=api.object&format=json'
UA = 'urania-arastirma/1.0'
KISISEL = {'ObsCode', 'ObsName', 'ObsCountry', 'ObsAffil', 'Comments', 'CommentCode', 'Software', 'Comp1', 'Comp2', 'Charts', 'CMag', 'KMag', 'Id', 'MType', 'Airmass'}
# gözlem kaydındaki 'Name' alanı (gözlemciye ait olabilir) da atılır; nesne düzeyindeki 'Name' yıldızın adıdır ve kalır
TUTULAN = {'JD', 'Mag', 'Band', 'ObsType', 'ValFlag', 'Uncertainty'}
NESNE_TUTULAN = {'Name', 'AUID', 'RA2000', 'Declination2000', 'VariabilityType', 'Period', 'MaxMag', 'MinMag', 'Constellation'}


def getir(url, yol=None):
    istek = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(istek, timeout=60) as r:
        veri = r.read()
    if yol:
        with open(yol, 'wb') as f:
            f.write(veri)
    return veri


def koordinat(s):
    m = re.match(r'(\d+) (\d+) ([\d.]+) ([+-]\d+) (\d+) ([\d.]+)', s.strip())
    if not m:
        return None
    ra = (int(m.group(1)) + int(m.group(2)) / 60 + float(m.group(3)) / 3600) * 15
    dec = (abs(int(m.group(4))) + int(m.group(5)) / 60 + float(m.group(6)) / 3600) * (-1 if m.group(4).startswith('-') else 1)
    return round(ra, 5), round(dec, 5)


def kadir_aralik(s):
    """"6.97 - 7.8 V" → (6.97, 7.8, 'V'); "<12.5 - 6.2 p" gibi biçimler de yakalanır."""
    m = re.match(r'\s*<?([\d.]+)\s*-\s*<?([\d.]+)\s*([A-Za-z.]*)', s or '')
    if not m:
        return None
    a, b = float(m.group(1)), float(m.group(2))
    return {'parlak': min(a, b), 'sonuk': max(a, b), 'band': m.group(3) or 'V'}


def liste(csv_yol, cikti):
    if not csv_yol:
        csv_yol = os.path.join(tempfile.mkdtemp(prefix='aavso_'), 'BinocularProgramStars-2017_1.csv')
        getir(LISTE_URL, csv_yol)
    yildizlar = []
    atlanan = 0
    with open(csv_yol, encoding='utf-8-sig') as f:
        for r in csv.DictReader(f):
            k = koordinat(r.get('Coords', ''))
            if not k:
                atlanan += 1
                continue
            if k[1] <= -30:
                continue
            donem = (r.get('Period') or '').strip()
            yildizlar.append({
                'ad': r['Name'].strip(), 'auid': r['AUID'].strip(), 'ra': k[0], 'dec': k[1], 'takimyildiz': r['Const'].strip(),
                'tur': r['Type'].strip(), 'donem': float(donem) if re.match(r'^[\d.]+$', donem) else None,
                'kadir': kadir_aralik(r.get('Mag')), 'yarimkure': r.get('N/S', '').strip()
            })
    yildizlar.sort(key=lambda x: x['ra'])
    sonuc = {
        'aciklama': 'AAVSO Dürbün Programı (Binocular Program) yıldızları; İstanbul\'dan görülebilenler (dik açıklık > −30°). Güncel parlaklık uygulamada AAVSO VSX API\'sinden (vsx.aavso.org) alınır; yalnız son 7 günün görsel tahminlerinin ortancası ve sayısı tutulur, gözlemci bilgisi alınmaz.',
        'kaynak': {'liste': LISTE_URL, 'listeTarihi': '2017 (dosya adı: 2017_1)', 'vsx': 'https://vsx.aavso.org/index.php?view=api.object'},
        'atif': 'We gratefully acknowledge the contributions of the AAVSO observer community, whose photometric data and metadata resources were used in this study and made available through the AAVSO\'s scientific archives. (AAVSO Data Usage Guidelines, 2025-10-01.) VSX: Watson, C. L., Henden, A. A., and Price, A., "The International Variable Star Index (VSX)", Society for Astronomical Sciences Annual Symposium, vol. 25, p. 47, 2006.',
        'uretim': {'tarih': datetime.date.today().isoformat(), 'arac': 'araclar/degisen_verisi.py', 'atlananSatir': atlanan},
        'yildizlar': yildizlar
    }
    with open(cikti, 'w', encoding='utf-8') as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=1)
    print(f'yazıldı: {cikti} — {len(yildizlar)} yıldız (dik açıklık > −30°), koordinatsız/boş satır {atlanan}')
    return 0


def temizle(j):
    """VSX yanıtı → kişisel alanlar silinmiş fixture."""
    o = j.get('VSXObject', j)
    nesne = {k: v for k, v in o.items() if k in NESNE_TUTULAN}
    gozlemler = []
    for g in (o.get('Data') or {}).get('Observation', []) or []:
        yeni = {k: v for k, v in g.items() if k in TUTULAN}
        kalan = set(g.keys()) - TUTULAN - KISISEL - {'Name'}   # gözlem kaydındaki 'Name' her zaman atılır (gözlemciye ait olabilir)
        if kalan:
            print('  bilinmeyen alan(lar) atıldı:', sorted(kalan))
        gozlemler.append(yeni)
    nesne['Data'] = {'Observation': gozlemler}
    return {'VSXObject': nesne}


def fixture(adlar, klasor):
    os.makedirs(klasor, exist_ok=True)
    jd = time.time() / 86400 + 2440587.5 - 7
    for ad in adlar:
        url = f"{VSX}&ident={urllib.parse.quote(ad)}&data=500&fromjd={jd:.1f}"
        ham = json.loads(getir(url).decode('utf-8'))
        temiz = temizle(ham)
        yol = os.path.join(klasor, re.sub(r'[^A-Za-z0-9]+', '_', ad).strip('_') + '.json')
        with open(yol, 'w', encoding='utf-8') as f:
            json.dump(temiz, f, ensure_ascii=False, indent=1)
        n = len(temiz['VSXObject']['Data']['Observation'])
        gorsel = [g for g in temiz['VSXObject']['Data']['Observation'] if g.get('Band') == 'Vis.']
        print(f"{ad}: {n} gözlem, {len(gorsel)} görsel → {yol}")
        # kişisel veri kontrolü: dosyada yasaklı alan adı geçmemeli
        metin = open(yol, encoding='utf-8').read()
        for k in KISISEL:
            assert ('"' + k + '"') not in metin, 'kişisel alan kaldı: ' + k
        time.sleep(1.0)
    return 0


def main(argv):
    if '--fixture' in argv:
        i = argv.index('--fixture')
        return fixture(argv[i + 1:], os.path.join(KOK, 'testler', 'veri', 'vsx'))
    csv_yol = None
    cikti = os.path.join(KOK, 'veri', 'durbun_degisenleri.json')
    i = 1
    while i < len(argv):
        if argv[i] == '--csv':
            csv_yol = argv[i + 1]
            i += 2
        elif argv[i] == '--cikti':
            cikti = argv[i + 1]
            i += 2
        else:
            i += 1
    return liste(csv_yol, cikti)


if __name__ == '__main__':
    sys.exit(main(sys.argv))
