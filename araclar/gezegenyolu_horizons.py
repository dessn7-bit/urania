"""Gezegen yolu deneyi için bağımsız referans: JPL Horizons'tan duraklama anları ve karşı konum.
Kullanım: python3 araclar/gezegenyolu_horizons.py [--cikti testler/veri/gezegenyolu_horizons.json]

Kaynak: https://ssd.jpl.nasa.gov/api/horizons.api — EPHEM_TYPE=OBSERVER, CENTER='500@399' (yer merkezi),
QUANTITIES='31' (ObsEcLon/ObsEcLat: "Observer-centered IAU76/80 ecliptic-of-date longitude and latitude of the
target centers' apparent position, with light-time, gravitational deflection of light, and stellar aberrations"),
zaman ölçeği UT. Gezegen ve Güneş (10) için aynı sorgu.

Yöntem (her gezegen için):
  1. Günlük adımla tarama: görünen ekliptik boylamın günlük değişiminin işaret değiştirdiği günler (duraklama adayı) ve
     gezegen − Güneş boylam farkının 180°'den geçtiği gün (karşı konum adayı).
  2. Her adayın ±2 günü saatlik adımla yeniden istenir.
  3. Duraklama: boylamın türevinin sıfır olduğu an. Saatlik boylama, türevin işaretinin döndüğü saatin ±36 saatinde ikinci
     dereceden polinom (en küçük kareler) oturtulur; tepe noktası duraklama anıdır. Denetim için saatlik merkezî
     farkın sıfırdan geçtiği an da (doğrusal ara değer) kaydedilir.
  4. Karşı konum: gezegen − Güneş görünen ekliptik boylam farkının 180° olduğu an (almanak tanımı), saatlik değerler
     arasında doğrusal ara değerle.
İstek başlıklarında e-posta ya da kişisel veri yok (User-Agent genel)."""
import argparse, datetime, json, os, time, urllib.parse, urllib.request

UA = 'urania-arastirma/1.0'
API = 'https://ssd.jpl.nasa.gov/api/horizons.api'
K = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
AY = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}
# Önayarların tarih aralıkları (uygulamadaki veri/deney/gezegenyolu.json ile aynı) ve tarama penceresi
GEZEGENLER = [
    {'ad': 'Jupiter', 'kod': '599', 'bas': '2026-11-15', 'son': '2027-05-15'},
    {'ad': 'Mars', 'kod': '499', 'bas': '2026-12-15', 'son': '2027-04-30'},
]


def parametreler(kod, bas, son, adim):
    return {
        'format': 'text', 'COMMAND': "'%s'" % kod, 'OBJ_DATA': "'NO'", 'MAKE_EPHEM': "'YES'",
        'EPHEM_TYPE': "'OBSERVER'", 'CENTER': "'500@399'", 'START_TIME': "'%s'" % bas, 'STOP_TIME': "'%s'" % son,
        'STEP_SIZE': "'%s'" % adim, 'QUANTITIES': "'31'", 'CSV_FORMAT': "'YES'", 'ANG_FORMAT': "'DEG'",
    }


def sorgu_url(kod, bas, son, adim):
    return API + '?' + urllib.parse.urlencode(parametreler(kod, bas, son, adim), safe="'@", quote_via=urllib.parse.quote)


def iste(kod, bas, son, adim):
    url = sorgu_url(kod, bas, son, adim)
    istek = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(istek, timeout=60) as y:
        metin = y.read().decode('utf-8')
    time.sleep(1.0)   # sunucuya nazik ol
    s, e = metin.find('$$SOE'), metin.find('$$EOE')
    if s < 0 or e < 0:
        raise RuntimeError('Horizons yanıtında $$SOE/$$EOE yok: ' + metin[:400])
    satirlar = []
    for ln in metin[s + 5:e].strip().splitlines():
        p = [x.strip() for x in ln.split(',')]
        t = datetime.datetime.strptime(p[0].replace(p[0][5:8], '%02d' % AY[p[0][5:8]]), '%Y-%m-%d %H:%M')
        sayilar = [float(x) for x in p[1:] if x and x.replace('.', '', 1).replace('-', '', 1).isdigit()]
        satirlar.append((t.replace(tzinfo=datetime.timezone.utc), sayilar[0], sayilar[1]))
    return url, satirlar


def acisal_fark(a, b):
    """a − b, (−180, 180] aralığında"""
    return (a - b + 180.0) % 360.0 - 180.0


def iso(t):
    return t.strftime('%Y-%m-%dT%H:%M:%SZ')


def ikinci_derece_tepe(xs, ys):
    """y = a + b x + c x² en küçük kareler; tepe x = −b / 2c"""
    n = len(xs)
    S = [sum(x ** k for x in xs) for k in range(5)]
    T = [sum(y * x ** k for x, y in zip(xs, ys)) for k in range(3)]
    M = [[S[0], S[1], S[2]], [S[1], S[2], S[3]], [S[2], S[3], S[4]]]
    # Cramer
    def det(m):
        return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))
    D = det(M)
    kat = []
    for i in range(3):
        Mi = [r[:] for r in M]
        for j in range(3):
            Mi[j][i] = T[j]
        kat.append(det(Mi) / D)
    a, b, c = kat
    return -b / (2 * c), n


def duraklama(saatlik):
    t0 = saatlik[0][0]
    h = [(r[0] - t0).total_seconds() / 3600.0 for r in saatlik]
    lon = [saatlik[0][1]]
    for r in saatlik[1:]:
        lon.append(lon[-1] + acisal_fark(r[1], lon[-1] % 360.0))
    d = [None] + [(lon[i + 1] - lon[i - 1]) / 2.0 for i in range(1, len(lon) - 1)] + [None]
    i0 = None
    for i in range(1, len(d) - 2):
        if d[i] * d[i + 1] <= 0:
            i0 = i
            break
    if i0 is None:
        raise RuntimeError('saatlik pencerede türev işaret değiştirmiyor')
    dogrusal = h[i0] + d[i0] / (d[i0] - d[i0 + 1]) * (h[i0 + 1] - h[i0])
    sec = [i for i in range(len(h)) if abs(h[i] - h[i0]) <= 36]
    tepe, n = ikinci_derece_tepe([h[i] - h[i0] for i in sec], [lon[i] for i in sec])
    tepe += h[i0]
    tur = 'geri' if d[i0] > 0 else 'ileri'   # türev + → − : doğuya gidiş durdu, geri hareket başlar
    lon_t = lon[i0] % 360.0
    return {
        'tur': tur,
        'zaman': iso(t0 + datetime.timedelta(hours=tepe)),
        'zaman_dogrusal': iso(t0 + datetime.timedelta(hours=dogrusal)),
        'boylam': round(lon_t, 4),
        'nokta_sayisi': n,
    }


def karsi(saatlik_g, saatlik_s):
    t0 = saatlik_g[0][0]
    f = [acisal_fark(g[1] - s[1], 180.0) for g, s in zip(saatlik_g, saatlik_s)]
    for i in range(len(f) - 1):
        if f[i] <= 0 < f[i + 1] or f[i] >= 0 > f[i + 1]:
            h = i + f[i] / (f[i] - f[i + 1])
            return {'zaman': iso(t0 + datetime.timedelta(hours=h)), 'boylam': round(saatlik_g[i][1], 4)}
    raise RuntimeError('saatlik pencerede karşı konum yok')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cikti', default=os.path.join(K, 'testler/veri/gezegenyolu_horizons.json'))
    a = ap.parse_args()
    out = {
        'kaynak': 'JPL Horizons API (Solar System Dynamics Group, JPL/Caltech)',
        'api': API,
        'alindi': datetime.date.today().isoformat(),
        'betik': 'araclar/gezegenyolu_horizons.py',
        'nicelik': "QUANTITIES='31' ObsEcLon/ObsEcLat: Observer-centered IAU76/80 ecliptic-of-date longitude and latitude "
                   "of the target centers' apparent position, with light-time, gravitational deflection of light, and stellar aberrations",
        'yontem': 'Duraklama: saatlik görünen ekliptik boylama ±36 saatte ikinci derece polinom, tepe noktası. '
                  'Karşı konum: gezegen − Güneş görünen ekliptik boylam farkı 180°, saatlik değerler arasında doğrusal ara değer. '
                  'Zamanlar UT.',
        'sorgu_ornegi': sorgu_url('599', '2026-11-15', '2027-05-15', '1d'),
        'gezegenler': {},
    }
    for g in GEZEGENLER:
        url_g, gun_g = iste(g['kod'], g['bas'], g['son'], '1d')
        url_s, gun_s = iste('10', g['bas'], g['son'], '1d')
        kayit = {'kod': g['kod'], 'tarama': [g['bas'], g['son']], 'sorgular': [url_g, url_s], 'duraklamalar': [], 'saatlik': []}
        # duraklama adayları
        degisim = [acisal_fark(gun_g[i + 1][1], gun_g[i][1]) for i in range(len(gun_g) - 1)]
        adaylar = [gun_g[i + 1][0] for i in range(len(degisim) - 1) if degisim[i] * degisim[i + 1] <= 0]
        for gun in adaylar:
            bas, son = (gun - datetime.timedelta(days=2)).strftime('%Y-%m-%d %H:%M'), (gun + datetime.timedelta(days=2)).strftime('%Y-%m-%d %H:%M')
            url, saatlik = iste(g['kod'], bas, son, '1h')
            d = duraklama(saatlik)
            d['sorgu'] = url
            kayit['duraklamalar'].append(d)
            kayit['saatlik'].append({'pencere': [bas, son], 'satirlar': [[iso(r[0]), r[1]] for r in saatlik]})
        # karşı konum adayı
        fark = [acisal_fark(gg[1] - ss[1], 180.0) for gg, ss in zip(gun_g, gun_s)]
        k = [gun_g[i][0] for i in range(len(fark) - 1) if (fark[i] <= 0 < fark[i + 1]) or (fark[i] >= 0 > fark[i + 1])]
        if k:
            gun = k[0]
            bas, son = (gun - datetime.timedelta(days=1)).strftime('%Y-%m-%d %H:%M'), (gun + datetime.timedelta(days=2)).strftime('%Y-%m-%d %H:%M')
            url_pg, sg = iste(g['kod'], bas, son, '1h')
            url_ps, ss = iste('10', bas, son, '1h')
            kk = karsi(sg, ss)
            kk['sorgular'] = [url_pg, url_ps]
            kayit['karsi_konum'] = kk
            kayit['saatlik_karsi'] = {'pencere': [bas, son], 'satirlar': [[iso(a[0]), a[1], b[1]] for a, b in zip(sg, ss)]}
        out['gezegenler'][g['ad']] = kayit
        print(g['ad'], [(d['tur'], d['zaman'], d['zaman_dogrusal']) for d in kayit['duraklamalar']], kayit.get('karsi_konum', {}).get('zaman'))
    with open(a.cikti, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')


if __name__ == '__main__':
    main()
