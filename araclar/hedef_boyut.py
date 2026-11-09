#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/hedef_boyut.py — veri/hedefler.json'daki 26 dürbün hedefi için OpenNGC'den boyut ve parlaklık.

Kaynak: OpenNGC (Mattia Verga), https://github.com/mattiaverga/OpenNGC — lisans CC BY-SA 4.0 (README).
  Dosyalar: database_files/NGC.csv (NGC/IC nesneleri; M sütunu Messier numarası) ve database_files/addendum.csv
  (NGC/IC dışı nesneler: Mel 111, Cr 399 …). Alanlar: MajAx, MinAx (yay dakikası), B-Mag, V-Mag, SurfBr
  (B bandı, 25 kadir eş-ışık eğrisi içinde ortalama yüzey parlaklığı, kadir/yay sn²; yalnız galaksilerde).
Çıktı: veri/hedef_boyut.json — türetilmiş veri, kendi lisans notuyla (CC BY-SA 4.0, OpenNGC'ye atıf).
  OpenNGC'de olmayan ya da boş kalan alan için veri/hedefler.json'daki değer kullanılır ve kaynağı yazılır
  (kadir: hedefler_dogrulanmis.json / dogrulama_messier.md; boyut: hedefler.json "boyut").
  Yıldızlar (Albireo, Mizar, Alcor) OpenNGC'de yok: nokta kaynak, boyut yok.

Kullanım: python araclar/hedef_boyut.py [--openngc <klasör>] [--cikti veri/hedef_boyut.json]
  --openngc verilmezse NGC.csv ve addendum.csv GitHub'dan (raw.githubusercontent.com) indirilir.
"""
import sys, os, csv, json, re, datetime, urllib.request, tempfile

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HAM = 'https://raw.githubusercontent.com/mattiaverga/OpenNGC/master/database_files/'
UA = 'urania-arastirma/1.0'

# hedefler.json kimliği → OpenNGC adı (M → NGC.csv "M" sütunu; ötekiler Name sütunu)
ESLEME = {
    'M45': ('M', '045'), 'M42': ('M', '042'), 'M31': ('M', '031'), 'M44': ('M', '044'), 'M13': ('M', '013'), 'M8': ('M', '008'),
    'M7': ('M', '007'), 'M6': ('M', '006'), 'M22': ('M', '022'), 'M35': ('M', '035'), 'M36': ('M', '036'), 'M37': ('M', '037'),
    'M38': ('M', '038'), 'M39': ('M', '039'), 'M11': ('M', '011'), 'M27': ('M', '027'), 'M92': ('M', '092'), 'M3': ('M', '003'),
    'M5': ('M', '005'), 'NGC 869': ('Name', 'NGC0869'), 'NGC 884': ('Name', 'NGC0884'),
    'Mel 111': ('Name', 'Mel111'), 'Cr 399': ('Name', 'Cl399'),
    'Albireo': None, 'Mizar': None, 'Alcor': None
}


def indir(ad, klasor):
    yol = os.path.join(klasor, ad)
    if not os.path.exists(yol):
        istek = urllib.request.Request(HAM + ad, headers={'User-Agent': UA})
        with urllib.request.urlopen(istek, timeout=60) as r, open(yol, 'wb') as f:
            f.write(r.read())
    return yol


def sayi(s):
    s = (s or '').strip()
    return float(s) if s else None


def boyut_coz(b):
    """hedefler.json 'boyut' alanı: "110′", "85x60′", "8x5.7′" → (büyük, küçük) yay dakikası."""
    if not b:
        return None, None
    m = re.match(r'^\s*([\d.]+)\s*(?:[x×]\s*([\d.]+))?\s*[′\']?\s*$', b)
    if not m:
        return None, None
    a = float(m.group(1))
    return a, (float(m.group(2)) if m.group(2) else a)


def main(argv):
    klasor = None
    cikti = os.path.join(KOK, 'veri', 'hedef_boyut.json')
    i = 1
    while i < len(argv):
        if argv[i] == '--openngc':
            klasor = argv[i + 1]
            i += 2
        elif argv[i] == '--cikti':
            cikti = argv[i + 1]
            i += 2
        else:
            i += 1
    if klasor is None:
        klasor = tempfile.mkdtemp(prefix='openngc_')
    ngc = {}
    with open(indir('NGC.csv', klasor), encoding='utf-8') as f:
        for r in csv.DictReader(f, delimiter=';'):
            ngc[('Name', r['Name'])] = r
            if r.get('M'):
                ngc[('M', r['M'].zfill(3))] = r
    with open(indir('addendum.csv', klasor), encoding='utf-8') as f:
        for r in csv.DictReader(f, delimiter=';'):
            ngc[('Name', r['Name'])] = r
    with open(os.path.join(KOK, 'veri', 'hedefler.json'), encoding='utf-8') as f:
        hedefler = json.load(f)['hedefler']
    cikis = []
    for h in hedefler:
        anahtar = ESLEME.get(h['id'], 'YOK')
        if anahtar == 'YOK':
            raise SystemExit('eşleme yok: ' + h['id'])
        kayit = {'id': h['id'], 'ad': h['ad'], 'tur': h['tur'], 'kaynak': {}}
        r = ngc.get(anahtar) if anahtar else None
        a, b = boyut_coz(h.get('boyut'))
        if r:
            kayit['openngc'] = r['Name']
            kayit['openngcTur'] = r['Type']
            maj, mn = sayi(r['MajAx']), sayi(r['MinAx'])
            if maj:
                kayit['buyukEksen'] = maj
                kayit['kucukEksen'] = mn if mn else maj
                kayit['kaynak']['boyut'] = 'OpenNGC ' + ('addendum.csv' if anahtar[0] == 'Name' and not r['Name'].startswith(('NGC', 'IC')) else 'NGC.csv') + (' (yalnız büyük eksen; daire kabul)' if not mn else '')
            v, bm = sayi(r['V-Mag']), sayi(r['B-Mag'])
            if v is not None:
                kayit['vKadir'] = v
                kayit['kaynak']['vKadir'] = 'OpenNGC'
            if bm is not None:
                kayit['bKadir'] = bm
                kayit['kaynak']['bKadir'] = 'OpenNGC'
            sb = sayi(r['SurfBr'])
            if sb is not None:
                kayit['yuzeyParlakligiB'] = sb
                kayit['kaynak']['yuzeyParlakligiB'] = 'OpenNGC SurfBr (B bandı, 25 kadir eş-ışık eğrisi içi ortalama)'
        if 'buyukEksen' not in kayit and a:
            kayit['buyukEksen'], kayit['kucukEksen'] = a, b
            kayit['kaynak']['boyut'] = 'veri/hedefler.json "boyut" (OpenNGC\'de yok)'
        if 'vKadir' not in kayit and h.get('kadir') is not None:
            kayit['vKadir'] = h['kadir']
            kayit['kaynak']['vKadir'] = 'veri/hedefler.json "kadir" (hedefler_dogrulanmis.json; OpenNGC\'de boş)'
        if anahtar is None:
            kayit['noktaKaynak'] = True
            kayit['kaynak']['not'] = 'yıldız; OpenNGC kapsamı dışında, boyut uygulanmaz'
        cikis.append(kayit)
    sonuc = {
        'aciklama': 'Dürbün hedeflerinin boyutu ve parlaklığı (görünürlük eşiği hesabı için). Türetilmiş veri; alan kaynakları her kayıtta.',
        'lisans': 'OpenNGC verisi: CC BY-SA 4.0 — Mattia Verga, OpenNGC, https://github.com/mattiaverga/OpenNGC. Bu dosya OpenNGC\'den türetilmiştir ve aynı lisansla (CC BY-SA 4.0) dağıtılır. hedefler.json\'dan alınan değerlerin kaynakları arastirma/hedefler_dogrulanmis.json ve dogrulama_messier.md.',
        'birimler': {'buyukEksen': 'yay dakikası', 'kucukEksen': 'yay dakikası', 'vKadir': 'kadir (V)', 'bKadir': 'kadir (B)', 'yuzeyParlakligiB': 'kadir/yay sn² (B)'},
        'uretim': {'tarih': datetime.date.today().isoformat(), 'arac': 'araclar/hedef_boyut.py'},
        'hedefler': cikis
    }
    with open(cikti, 'w', encoding='utf-8') as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=1)
    print(f'yazıldı: {cikti} ({len(cikis)} hedef)')
    for k in cikis:
        print(f"  {k['id']:8s} {k.get('openngc','-'):8s} boyut {k.get('buyukEksen','-')}×{k.get('kucukEksen','-')}′ V {k.get('vKadir','-')} B {k.get('bKadir','-')} SB {k.get('yuzeyParlakligiB','-')} | {k['kaynak']}")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
