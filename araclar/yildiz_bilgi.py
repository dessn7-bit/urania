# -*- coding: utf-8 -*-
"""yildiz_bilgi.py — veri/yildizlar.json'daki adı olan yıldızlar için tayf türü, paralaks ve uzaklık, çift/değişen bilgisi.

Kaynaklar (v50):
  - SIMBAD (CDS, Strasbourg) TAP, Harvard aynası: https://simbad.cfa.harvard.edu/simbad/sim-tap/sync  (atıf: CDS/SIMBAD)
    basic (main_id, otype, sp_type, plx_value, plx_err, plx_bibcode), allfluxes (V), ids (HIP, WDS, V* adları), otypedef.
  - Hipparcos ana kataloğu (ESA 1997), VizieR I/239/hip_main, Harvard aynası: https://vizier.cfa.harvard.edu/viz-bin/asu-tsv
    (Vmag, Plx, e_Plx, SpType) — parlaklık karşılaştırması için.
Eşleme: önce konum — yildizlar.json'daki konumun 15 yay saniyesi içindeki, tayf türü bilinen en yakın yıldız; bulunamazsa
0,05° çevresinde V parlaklığı katalog değerine en yakın nesne; o da yoksa (SIMBAD akı tablosunda V yok) 0,02° içindeki en yakın yıldız.
"simbad" alanı SIMBAD ana kimliğinin tek boşluğa indirgenmiş hâlidir (SIMBAD'da "*  47 UMa" çift boşlukludur).
Uzaklık: d [ışık yılı] = (1 pc'nin ışık yılı karşılığı) × 1000 / paralaks [mas]; 1 pc = 648000/π au (IAU 2015 B2),
1 au = 149 597 870 700 m (IAU 2012 B2), ışık yılı = c × 365,25 gün (c = 299 792 458 m/s). Alt ve üst sınır paralaks ± hata ile.
Paralaks hatası paralaksın %10'unu aşıyorsa uzaklık tek sayı değil aralık olarak verilir ("aralik": true).
Kullanım: python araclar/yildiz_bilgi.py   (çıktı: veri/yildiz_bilgi.json; ham yanıtlar --onbellek klasöründe saklanır)
İstek başlığında kişisel bilgi yoktur. İstekler arasında 1 sn beklenir."""
import io, json, math, os, sys, time, urllib.parse, urllib.request, re, datetime, tempfile, hashlib

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIMBAD = 'https://simbad.cfa.harvard.edu/simbad/sim-tap/sync'
VIZIER = 'https://vizier.cfa.harvard.edu/viz-bin/asu-tsv'
UA = {'User-Agent': 'UraniaVeriHazirlama'}
PC_IY = (648000 / math.pi) * 149597870700 / (299792458 * 365.25 * 86400)   # 3,2616 ışık yılı
YARICAP = 0.05          # derece
FARK_ESIK = 0.15        # kadir
ARALIK_ESIK = 0.10      # paralaks hatası / paralaks

def getir(url, veri=None, onbellek=None, gecerli=None):
    if onbellek:   # dosya adı isteğin özetini taşır: sorgu değişirse eski yanıt kullanılmaz
        kok, uz = os.path.splitext(onbellek)
        onbellek = kok + '_' + hashlib.sha1((url + json.dumps(veri, sort_keys=True)).encode()).hexdigest()[:10] + uz
    if onbellek and os.path.exists(onbellek):
        return io.open(onbellek, encoding='utf-8').read()
    istek = urllib.request.Request(url, data=urllib.parse.urlencode(veri).encode() if veri else None, headers=UA)
    for deneme in range(4):   # ağ hatası ya da boş yanıt (VizieR'de geçici olarak görüldü): bekleyip yeniden dene
        try:
            with urllib.request.urlopen(istek, timeout=120) as r:
                m = r.read().decode('utf-8', 'replace')
            if gecerli is None or gecerli(m): break
        except Exception as e:
            if deneme == 3: raise
        time.sleep(8)
    time.sleep(1)
    if onbellek and (gecerli is None or gecerli(m)):
        io.open(onbellek, 'w', encoding='utf-8').write(m)
    return m

def tap(sorgu, onbellek=None):
    m = getir(SIMBAD, {'request': 'doQuery', 'lang': 'adql', 'format': 'tsv', 'query': sorgu}, onbellek)
    if m.lstrip().startswith('<?xml'):
        raise RuntimeError('SIMBAD hata: ' + re.sub(r'\s+', ' ', m)[:400])
    satirlar = [s for s in m.split('\n') if s.strip()]
    bas = satirlar[0].split('\t')
    return [dict(zip(bas, [h.strip().strip('"') for h in s.split('\t')])) for s in satirlar[1:]]

def aci(ra1, de1, ra2, de2):
    r = math.radians
    c = math.sin(r(de1)) * math.sin(r(de2)) + math.cos(r(de1)) * math.cos(r(de2)) * math.cos(r(ra1 - ra2))
    return math.degrees(math.acos(max(-1, min(1, c))))

def sayi(x):
    try:
        v = float(x)
        return v if math.isfinite(v) else None
    except (TypeError, ValueError):
        return None

def anlamli(x, hata):
    """Değeri hatasının büyüklüğüne göre yuvarla (hatanın ilk iki anlamlı hanesi düzeyinde)."""
    if hata is None or hata <= 0: return round(x, 1)
    us = math.floor(math.log10(hata)) - 1
    carpan = 10 ** us
    return round(round(x / carpan) * carpan, max(0, -us))

def uzaklik(plx, hata):
    if plx is None or plx <= 0: return None
    d = PC_IY * 1000 / plx
    if hata is None or hata <= 0:
        return {'iy': round(d, 1 if d < 100 else 0), 'aralik': False}
    ust = PC_IY * 1000 / (plx - hata) if plx - hata > 0 else None
    alt = PC_IY * 1000 / (plx + hata)
    yari = ((ust - alt) / 2) if ust else d - alt
    o = {'iy': anlamli(d, yari), 'alt': anlamli(alt, yari), 'ust': anlamli(ust, yari) if ust else None, 'aralik': hata / plx > ARALIK_ESIK}
    return o

def main():
    onb = os.path.join(tempfile.gettempdir(), 'urania_yildiz_bilgi_ham')   # ham yanıtlar depoya girmez
    for a in sys.argv[1:]:
        if a.startswith('--onbellek='): onb = a.split('=', 1)[1]
    os.makedirs(onb, exist_ok=True)
    y = json.load(io.open(os.path.join(KOK, 'veri', 'yildizlar.json'), encoding='utf-8'))
    adli = [(int(i), ad, y['y'][int(i)]) for i, ad in y['adlar'].items()]
    adli.sort()
    # 0) Önce KONUM: katalog konumunun 15 yay saniyesi içindeki, tayf türü bilinen en yakın yıldız (gezegenler hariç).
    #    Yakın çiftlerde parlaklığa göre seçim yanlış bileşeni verebiliyordu (Alkalurops: μ¹ Boo yerine 109″ uzaktaki μ² Boo).
    #    Seçilen bileşenin paralaksı yoksa aynı 15″ içindeki sistem kaydının paralaksı alınır (plxSistem alanı kaynağı söyler).
    YAKIN = 15 / 3600.0
    secim, sistemPlx = {}, {}
    for g in range(0, len(adli), 15):
        grup = adli[g:g + 15]
        kosul = ' OR '.join("CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', %.5f, %.5f, %.5f))=1" % (s[2][0], s[2][1], YAKIN) for s in grup)
        sorgu = ("SELECT b.oid, b.main_id, b.otype, b.sp_type, b.sp_bibcode, b.plx_value, b.plx_err, b.plx_bibcode, b.ra, b.dec, a.V AS vmag "
                 "FROM basic AS b LEFT JOIN allfluxes AS a ON a.oidref = b.oid WHERE " + kosul)
        satirlar = [r for r in tap(sorgu, os.path.join(onb, 'simbad_yakin.tsv')) if sayi(r['ra']) is not None and r['otype'] not in ('Pl', 'Pl?')]
        for i, ad, s in grup:
            uz = lambda r: aci(sayi(r['ra']), sayi(r['dec']), s[0], s[1])
            ls = sorted([r for r in satirlar if uz(r) <= YAKIN], key=uz)
            tayfli = [r for r in ls if r['sp_type']]
            if not tayfli: continue
            secim[i] = tayfli[0]
            if sayi(tayfli[0]['plx_value']) is None:
                for r in ls:
                    if sayi(r['plx_value']) is not None: sistemPlx[i] = r; break
    # 1) Konumla bulunamayanlar: 0,05° çevresinde V parlaklığı katalog değerine en yakın nesne
    adaylar = {}
    kalanlar = [x for x in adli if x[0] not in secim]
    for g in range(0, len(kalanlar), 15):
        grup = kalanlar[g:g + 15]
        kosul = ' OR '.join("CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', %.5f, %.5f, %.3f))=1" % (s[2][0], s[2][1], YARICAP) for s in grup)
        sorgu = ("SELECT b.oid, b.main_id, b.otype, b.sp_type, b.sp_bibcode, b.plx_value, b.plx_err, b.plx_bibcode, b.ra, b.dec, a.V AS vmag "
                 "FROM basic AS b JOIN allfluxes AS a ON a.oidref = b.oid WHERE a.V < 9 AND (" + kosul + ")")
        for r in tap(sorgu, os.path.join(onb, 'simbad_%03d.tsv' % (g // 15))):
            ra, de = sayi(r['ra']), sayi(r['dec'])
            for i, ad, s in grup:
                if ra is not None and aci(ra, de, s[0], s[1]) <= YARICAP:
                    adaylar.setdefault(i, []).append(r)
    for i, ad, s in kalanlar:
        ls = adaylar.get(i, [])
        if not ls: continue
        # V'si katalog parlaklığına en yakın olan; eşitlikte konumu en yakın olan
        ls.sort(key=lambda r: (round(abs(sayi(r['vmag']) - s[2]), 2), aci(sayi(r['ra']), sayi(r['dec']), s[0], s[1])))
        secim[i] = ls[0]
    # 1b) SIMBAD'ın birleşik akı tablosunda (allfluxes) V değeri olmayan yıldızlar: konuma en yakın, gezegen olmayan nesne
    #     (0,02° içinde); parlaklığı Hipparcos'tan gelir. Bu yıldızlarda vSimbad boş kalır.
    kalan = [(i, ad, s) for i, ad, s in adli if i not in secim]
    eslesmeyen = []
    for g in range(0, len(kalan), 15):
        grup = kalan[g:g + 15]
        kosul = ' OR '.join("CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', %.5f, %.5f, 0.02))=1" % (s[2][0], s[2][1]) for s in grup)
        sorgu = ("SELECT b.oid, b.main_id, b.otype, b.sp_type, b.sp_bibcode, b.plx_value, b.plx_err, b.plx_bibcode, b.ra, b.dec, a.V AS vmag "
                 "FROM basic AS b LEFT JOIN allfluxes AS a ON a.oidref = b.oid WHERE " + kosul)
        satirlar = tap(sorgu, os.path.join(onb, 'simbad_akisiz_%03d.tsv' % (g // 15)))
        for i, ad, s in grup:
            ls = [r for r in satirlar if sayi(r['ra']) is not None and r['otype'] not in ('Pl', 'Pl?') and r['sp_type'] and aci(sayi(r['ra']), sayi(r['dec']), s[0], s[1]) <= 0.02]
            if not ls: eslesmeyen.append(ad); continue
            ls.sort(key=lambda r: aci(sayi(r['ra']), sayi(r['dec']), s[0], s[1]))
            secim[i] = ls[0]
    # 2) kimlikler (HIP, WDS, değişen yıldız adı)
    oidler = sorted({r['oid'] for r in secim.values()})
    kimlik = {}
    for g in range(0, len(oidler), 100):
        for r in tap('SELECT oidref, ids FROM ids WHERE oidref IN (%s)' % ','.join(oidler[g:g + 100]), os.path.join(onb, 'ids_%02d.tsv' % (g // 100))):
            kimlik[r['oidref']] = r['ids'].split('|')
    # 3) nesne türü tanımları
    turler = {r['otype']: r for r in tap('SELECT otype, description, path FROM otypedef', os.path.join(onb, 'otypedef.tsv'))}
    # 4) Hipparcos
    hipNo = {}
    for i, r in secim.items():
        for k in kimlik.get(r['oid'], []):
            m = re.match(r'^HIP\s+(\d+)$', k.strip())
            if m: hipNo[i] = int(m.group(1))
    hip = {}
    nolar = sorted(set(hipNo.values()))
    dolu = lambda m: re.search(r'^\s*\d+\t', m, re.M)
    for g in range(0, len(nolar), 40):
        url = VIZIER + '?' + urllib.parse.urlencode({'-source': 'I/239/hip_main', '-out': 'HIP,Vmag,Plx,e_Plx,SpType', '-out.max': 'unlimited', 'HIP': ','.join(str(n) for n in nolar[g:g + 40])})
        m = getir(url, None, os.path.join(onb, 'hip.tsv'), gecerli=dolu)
        if not dolu(m): raise RuntimeError('VizieR boş yanıt verdi (HIP %d…)' % nolar[g])
        for s in m.split('\n'):
            p = s.split('\t')
            if len(p) >= 5 and p[0].strip().isdigit():
                hip[int(p[0])] = {'v': sayi(p[1]), 'plx': sayi(p[2]), 'plxHata': sayi(p[3]), 'tayf': p[4].strip()}
    # 5) birleştir
    cikti, farklar = {}, []
    for i, ad, s in adli:
        r = secim.get(i)
        if not r: continue
        ids = kimlik.get(r['oid'], [])
        plx, ph = sayi(r['plx_value']), sayi(r['plx_err'])
        pk = r
        if plx is None and i in sistemPlx:
            pk = sistemPlx[i]; plx, ph = sayi(pk['plx_value']), sayi(pk['plx_err'])
        t = turler.get(r['otype'], {})
        yol = t.get('path', '')
        o = {'ad': ad, 'simbad': re.sub(r'\s+', ' ', r['main_id']), 'tur': r['otype'], 'turAd': t.get('description', '')}
        if r['sp_type']: o['tayf'] = r['sp_type']
        if plx is not None:
            o['plx'] = plx
            if ph is not None: o['plxHata'] = ph
            if pk['plx_bibcode']: o['plxKaynak'] = pk['plx_bibcode']
            if pk is not r: o['plxSistem'] = re.sub(r'\s+', ' ', pk['main_id'])
            u = uzaklik(plx, ph)
            if u: o['uzaklik'] = u
        o['cift'] = ('**' in [x.strip() for x in yol.split('>')]) or any(k.strip().startswith('WDS ') for k in ids)
        wds = [k.strip() for k in ids if k.strip().startswith('WDS ')]
        if wds: o['wds'] = wds[0]
        # Değişen: SIMBAD'da değişen yıldız adı ("V* …") varsa ya da nesne türü bir değişen sınıfıysa
        dAd = [k.strip() for k in ids if k.strip().startswith('V* ')]
        o['degisen'] = bool(dAd) or 'Variable' in t.get('description', '') or r['otype'] == 'EB*'
        if dAd: o['degisenAd'] = re.sub(r'\s+', ' ', dAd[0][3:])
        vS = sayi(r['vmag'])
        if vS is not None: o['vSimbad'] = vS
        h = hip.get(hipNo.get(i))
        if h:
            o['hip'] = hipNo[i]
            if h['v'] is not None:
                o['vHip'] = h['v']
                if vS is not None and round(abs(vS - h['v']), 3) > FARK_ESIK: farklar.append({'ad': ad, 'simbad': o['simbad'], 'hip': hipNo[i], 'vSimbad': vS, 'vHip': h['v'], 'fark': round(vS - h['v'], 2), 'katalog': s[2]})
            if h['tayf']: o['tayfHip'] = h['tayf']
        cikti[str(i)] = o
    sonuc = {
        'kaynak': 'SIMBAD (CDS, Strasbourg) — tayf türü, paralaks, nesne türü, kimlikler; Hipparcos ana kataloğu (ESA 1997, VizieR I/239) — V parlaklığı karşılaştırması',
        'atif': 'This research has made use of the SIMBAD database, operated at CDS, Strasbourg, France (CDS/SIMBAD), and of the VizieR catalogue access tool.',
        'kaynak_url': ['https://simbad.cfa.harvard.edu/simbad/', 'https://vizier.cfa.harvard.edu/viz-bin/VizieR?-source=I/239'],
        'uretim': datetime.date.today().isoformat(), 'betik': 'araclar/yildiz_bilgi.py',
        'not': 'uzaklik.iy ışık yılı; alt/ust paralaks ± hata ile; aralik: paralaks hatası paralaksın yüzde 10\'undan büyük (uzaklık aralık olarak gösterilir). 1 pc = %.4f ışık yılı.' % PC_IY,
        'eslesmeyen': eslesmeyen, 'vFarklari': sorted(farklar, key=lambda f: -abs(f['fark'])), 'yildizlar': cikti
    }
    io.open(os.path.join(KOK, 'veri', 'yildiz_bilgi.json'), 'w', encoding='utf-8', newline='\n').write(json.dumps(sonuc, ensure_ascii=False, separators=(',', ':')) + '\n')
    print('adli %d, eslesen %d, eslesmeyen %d, HIP %d, V farki > %.2f: %d' % (len(adli), len(cikti), len(eslesmeyen), len(hip), FARK_ESIK, len(farklar)))

if __name__ == '__main__':
    main()
