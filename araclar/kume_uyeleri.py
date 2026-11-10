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
v47 çapraz denetim (capraz): SIMBAD'ın birleşik akı tablosu bazı yıldızlarda yanlış (θ² Ori A: SIMBAD 6,39; Hipparcos 4,98,
  BSC 5,08). Her kümenin SIMBAD sırasına göre ilk ADAY üyesi ikinci kataloglarla karşılaştırılır (VizieR CfA aynası):
  Hipparcos I/239/hip_main Vmag (Johnson V, kaynak bayrağı r_Vmag), Yale BSC V/50 Vmag, Tycho-2 I/259 (V = VT − 0,090 (BT − VT),
  I/259 ReadMe not 7). Fark > ESIK_V ise bütün değerler dosyaya yazılır ve gerekçeyle biri seçilir (Urania'nın kuralı:
  bütün kaynakların ortancasına ESIK_V içinde kalan ilk kaynak, Hipparcos > BSC > Tycho-1 > Tycho-2 > SIMBAD sırasıyla;
  tek katalog yanılabilir: θ¹ Ori A'da Hipparcos 4,98, BSC 6,73). Fark ≤ ESIK_V ise SIMBAD değeri kalır. Tycho-1: I/239/tyc_main Vmag (Johnson V).
  Değişen yıldızlar: AAVSO VSX'in VizieR kopyası B/vsx (vsx sitesi Cloudflare doğrulaması istiyor, atlatılmaz), 10″ koni;
  V bandındaki aralığın sönük ucu görünürlük hesabında kullanılır (Vhesap). En parlak 5 üye seçilen V'ye göre yeniden sıralanır.
İstek başlıklarında e-posta ya da kişisel veri yok (User-Agent genel). Kullanım: python araclar/kume_uyeleri.py [--cikti veri/kume_uyeleri.json]
"""
import sys, os, json, time, datetime, urllib.request, urllib.parse, urllib.error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAP = 'https://simbad.cfa.harvard.edu/simbad/sim-tap/sync'
UA = 'urania-arastirma/1.0'
ESIK = 50          # üyelik yüzdesi (Urania'nın seçimi: en az bir kaynakta ≥ %50)
EN_COK = 5         # en parlak üye sayısı (görev metni: "en parlak 5 üye")
ADAY = 15         # çapraz denetlenen aday üye sayısı (SIMBAD sırasıyla; Urania'nın seçimi: yanlış SIMBAD V'li parlak bir üye ilk 5'e girebilsin)
ESIK_V = 0.15     # kadir: bundan büyük farkta iki kaynak da yazılır (görev metni)
VIZ = 'https://vizier.cfa.harvard.edu/viz-bin/asu-tsv'
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
    j = json.loads(oku_tekrar(istek).decode('utf-8'))
    return j.get('data', [])


def oku_tekrar(istek, deneme=5):
    """Ağ kesintisinde artan beklemeyle yeniden dener (2, 4, 8, 16 sn)"""
    for i in range(deneme):
        try:
            with urllib.request.urlopen(istek, timeout=90) as r:
                return r.read()
        except (OSError, urllib.error.URLError) as h:
            if i == deneme - 1:
                raise
            time.sleep(2 ** (i + 1))


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


def viz(kaynak, kos, cikti):
    """VizieR ASU-TSV: tek satır sözlük listesi"""
    q = [('-source', kaynak)] + list(kos.items()) + [('-out', c) for c in cikti]
    istek = urllib.request.Request(VIZ + '?' + urllib.parse.urlencode(q), headers={'User-Agent': UA})
    satir = [l for l in oku_tekrar(istek).decode('utf-8', 'replace').split('\n') if l and not l.startswith('#')]
    time.sleep(0.25)
    if len(satir) < 3:
        return []
    bas = [x.strip() for x in satir[0].split('\t')]
    return [dict(zip(bas, [x.strip() for x in l.split('\t')])) for l in satir[3:] if l.strip()]


def sayi(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def kimlikler(adlar):
    """SIMBAD: ad → {ra, dec, HIP, HR, TYC}"""
    sonuc = {}
    for i in range(0, len(adlar), 20):
        parca = adlar[i:i + 20]
        liste = ', '.join("'" + a.replace("'", "''") + "'" for a in parca)
        q = ("SELECT b.main_id, b.ra, b.dec, i.id FROM basic AS b JOIN ident AS i ON i.oidref = b.oid "
             f"WHERE b.main_id IN ({liste}) AND (i.id LIKE 'HIP %' OR i.id LIKE 'HR %' OR i.id LIKE 'TYC %')")
        for ad, ra, dec, kid in sorgu(q):
            ad = ' '.join(str(ad).split()); y = sonuc.setdefault(ad, {'ra': ra, 'dec': dec})
            k = ' '.join(str(kid).split())
            for on in ('HIP', 'HR', 'TYC'):
                if k.startswith(on + ' '):
                    y[on] = k[len(on) + 1:]
        time.sleep(0.5)
    # IN listesinde boşluklar SIMBAD'daki biçimle birebir olmayabilir: eksikler tek tek
    for a in adlar:
        if a not in sonuc:
            q = ("SELECT b.ra, b.dec, i.id FROM basic AS b JOIN ident AS i ON i.oidref = b.oid JOIN ident AS j ON j.oidref = b.oid "
                 f"WHERE j.id = '{a.replace(chr(39), chr(39) * 2)}' AND (i.id LIKE 'HIP %' OR i.id LIKE 'HR %' OR i.id LIKE 'TYC %')")
            y = {}
            for ra, dec, kid in sorgu(q):
                y.update({'ra': ra, 'dec': dec}); k = ' '.join(str(kid).split())
                for on in ('HIP', 'HR', 'TYC'):
                    if k.startswith(on + ' '):
                        y[on] = k[len(on) + 1:]
            sonuc[a] = y
            time.sleep(0.5)
    return sonuc


def capraz(uyeler_):
    """Her üyeye ikinci katalog V'leri, seçim ve gerekçe, değişkenlik (VSX) ekler."""
    kim = kimlikler([u['ad'] for u in uyeler_])
    for u in uyeler_:
        k = kim.get(u['ad'], {})
        u['Vsimbad'] = u['V']
        kat = {}
        if k.get('HIP'):
            r = viz('I/239/hip_main', {'HIP': k['HIP']}, ['HIP', 'Vmag', 'r_Vmag', 'VarFlag'])
            if r and sayi(r[0].get('Vmag')) is not None:
                kat['Hipparcos'] = {'V': sayi(r[0]['Vmag']), 'kimlik': 'HIP ' + k['HIP'], 'kaynakBayragi': r[0].get('r_Vmag') or None}
        if k.get('HR'):
            r = viz('V/50/catalog', {'HR': k['HR']}, ['HR', 'Vmag'])
            if r and sayi(r[0].get('Vmag')) is not None:
                kat['BSC'] = {'V': sayi(r[0]['Vmag']), 'kimlik': 'HR ' + k['HR']}
        if k.get('TYC'):
            t1, t2, t3 = k['TYC'].split('-')
            r = viz('I/259/tyc2', {'TYC1': t1, 'TYC2': t2, 'TYC3': t3}, ['TYC1', 'BTmag', 'VTmag'])
            if r and sayi(r[0].get('VTmag')) is not None and sayi(r[0].get('BTmag')) is not None:
                vt, bt = sayi(r[0]['VTmag']), sayi(r[0]['BTmag'])
                kat['Tycho-2'] = {'V': round(vt - 0.090 * (bt - vt), 3), 'kimlik': 'TYC ' + k['TYC'], 'VT': vt, 'BT': bt}
        if k.get('TYC'):
            r = viz('I/239/tyc_main', {'TYC': k['TYC'].replace('-', ' ')}, ['TYC', 'Vmag', 'r_Vmag'])
            if r and sayi(r[0].get('Vmag')) is not None:
                kat['Tycho-1'] = {'V': sayi(r[0]['Vmag']), 'kimlik': 'TYC ' + k['TYC'], 'not': 'Tycho-1 Johnson V (I/239/tyc_main T5)'}
        u['kataloglar'] = kat
        u['Vkaynak'] = 'SIMBAD'
        if not kat:
            u['denetim'] = 'ikinci katalogda bulunamadı; SIMBAD değeri kaldı'
        else:
            enbuyuk = max(abs(u['Vsimbad'] - x['V']) for x in kat.values())
            if enbuyuk <= ESIK_V:
                u['denetim'] = f"{', '.join(kat)} ile en çok {enbuyuk:.2f} kadir fark; SIMBAD değeri kaldı"
            else:
                # Urania'nın kuralı: bütün kaynakların ortancası (M); M'ye ESIK_V içinde olan ilk kaynak (Hipparcos > BSC > Tycho-1 > Tycho-2 > SIMBAD).
                # Tek bir kataloğa körü körüne güvenilmez: θ¹ Ori A'da Hipparcos 4,98 (komşu ışığı), BSC 6,73, Tycho-2 6,55.
                hepsi = dict({'SIMBAD': u['Vsimbad']}, **{a: x['V'] for a, x in kat.items()})
                ls = sorted(hepsi.values()); n = len(ls)
                M = ls[n // 2] if n % 2 else (ls[n // 2 - 1] + ls[n // 2]) / 2
                sira = [a for a in ('Hipparcos', 'BSC', 'Tycho-1', 'Tycho-2', 'SIMBAD') if a in hepsi]
                sec = next((a for a in sira if abs(hepsi[a] - M) <= ESIK_V), None)
                belirsiz = sec is None
                if belirsiz:
                    sec = min(sira, key=lambda a: abs(hepsi[a] - M))
                u['V'] = round(hepsi[sec], 3); u['Vkaynak'] = sec; u['fark'] = round(u['Vsimbad'] - u['V'], 3)
                if belirsiz:
                    u['belirsiz'] = True
                u['gerekce'] = ('Kaynaklar ' + ', '.join(f"{a} {v:.2f}" for a, v in hepsi.items()) + f"; en büyük fark {enbuyuk:.2f} > {ESIK_V}. "
                                + f"Ortanca {M:.2f}; " + (f"ortancaya {ESIK_V} içinde kalan ilk kaynak {sec} seçildi" if not belirsiz else f"hiçbiri ortancaya {ESIK_V} içinde değil, en yakını {sec} seçildi (belirsiz)")
                                + " (Urania'nın kuralı: Hipparcos > BSC > Tycho-1 > Tycho-2 > SIMBAD).")
        # değişkenlik: VSX (VizieR B/vsx), 10″
        if k.get('ra') is not None:
            r = viz('B/vsx/vsx', {'-c': f"{k['ra']} {k['dec']:+}", '-c.rs': '10', '-out.add': '_r', '-sort': '_r'}, ['Name', 'Type', 'max', 'n_max', 'f_min', 'min', 'n_min'])
            # en yakın kayıt, parlaklığı yıldızınkiyle uyuşuyorsa (1 kadir içinde; 10″ içinde başka yıldızın kaydı alınmasın)
            r = [x for x in r if sayi(x.get('max')) is not None and abs(sayi(x['max']) - u['V']) < 1.0][:1]
            if r:
                v = r[0]; mx, mn = sayi(v.get('max')), sayi(v.get('min'))
                genlik = None
                if (v.get('f_min') or '').strip() and mx is not None and mn is not None:
                    genlik = mn; mn = round(mx + mn, 3)     # f_min dolu: "min" alanı genlik (B/vsx ReadMe: "Flag to indicate an amplitude")
                d = {'vsx': v.get('Name'), 'tur': v.get('Type'), 'enParlak': mx, 'enSonuk': mn, 'bant': v.get('n_max') or v.get('n_min'),
                     'kaynak': 'AAVSO VSX (VizieR B/vsx)'}
                if genlik is not None:
                    d['genlik'] = genlik
                u['degisen'] = d
                if mn is not None and (v.get('n_min') or '').strip() == 'V':
                    u['Vhesap'] = max(u['V'], mn)
                else:
                    d['not'] = 'aralık V bandında değil ya da sönük uç yok; hesapta seçilen V kullanılır'
    return uyeler_


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
                          'uyeler': sorted(capraz([{'ad': y['ad'], 'V': y['V'], 'uyelik': None, 'kaynaklar': ['SIMBAD koni taraması']} for y in ls[:ADAY]]), key=lambda y: y['V'])[:EN_COK], 'toplam': len(ls)}
        else:
            ls, ham = uyeler(sid)
            aday = capraz(ls[:ADAY])
            aday.sort(key=lambda y: y['V'])
            sonuc[hid] = {'simbad': sid, 'uyeler': aday[:EN_COK], 'toplam': len(ls), 'hamSatir': ham, 'denetlenenAday': len(aday),
                          'uyelikKaynagi': 'SIMBAD h_link, üyelik ≥ %d (kaynak bibcode her yıldızda)' % ESIK}
            if hid == 'M42':
                sonuc[hid]['not'] = 'M42 merkez yıldızları (Orion Bulutsusu Kümesi / Trapezium) — bulutsunun kendisi değil; yıldız testi için'
        u = sonuc[hid]['uyeler']
        print(f"{hid:8s} {len(u)} üye | " + ' ; '.join(f"{y['ad']} V{y['V']:.2f}" + (f" (%{y['uyelik']})" if y.get('uyelik') is not None else '') for y in u))
        time.sleep(1.0)
    veri = {
        'aciklama': 'Açık kümelerin en parlak üyeleri (V, SIMBAD) ve üyelik kaynakları; görünürlük "üye yolu" (en az 3 üye nokta kaynak sınırından parlaksa "görünür (yıldızları seçilir)").',
        'kaynak': {'servis': 'SIMBAD TAP (CfA aynası) ' + TAP, 'uyelik': 'SIMBAD h_link (yayımlanmış üyelik listeleri; bibcode her yıldızda)', 'parlaklik': 'SIMBAD allfluxes.V; v47: Hipparcos (I/239), BSC (V/50), Tycho-2 (I/259) ile çapraz denetim, fark > %.2f kadirde kaynakların ortancasına en yakın güvenilir değer (Hipparcos > BSC > Tycho-1 > Tycho-2 > SIMBAD)' % ESIK_V,
                   'degisen': 'AAVSO VSX, VizieR B/vsx kopyası (10″ koni); görünürlük hesabında V bandındaki aralığın sönük ucu (Vhesap)',
                   'vizier': VIZ, 'tycho2Donusum': 'V = VT - 0.090*(BT-VT) (VizieR I/259 ReadMe, Note 7; ESA SP-1200 Vol. 1 §1.3)',
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
