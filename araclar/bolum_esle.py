"""Ders bölümleri genişletilince (araya yeni bölüm girince) bölüm DİZİNİNE bağlı her şeyi yeni dizine taşır:
ders çizimleri (cizim_*.js: ders: 'dX', bolum: N), ders içi deneyler (dersler.js MINI) ve ünite sınavları
(veri/sinavlar.json: ders, bolum). Eşleme bölüm BAŞLIĞIYLA yapılır: genişletmede mevcut başlıklar aynen kalır.
Kullanım: python3 araclar/bolum_esle.py [önceki_başlıklar.json]
  Varsayılan önceki başlıklar: arastirma/dersler_v2/bolum_basliklari.json (son başarılı eşlemenin anlık görüntüsü; yoksa
  bolum_basliklari_v32.json). Başarılı eşlemeden sonra betik o anki bölüm başlıklarını (veri/dersler.json, BÜTÜN dersler)
  bolum_basliklari.json'a KENDİSİ yazar: ikinci çalıştırma hiçbir şeyi kaydırmaz (değişen dizin 0). Eski v31/v32 dosyaları
  tarihçe olarak durur; elle güncellenmeleri gerekmez.
Önce bütün eşlemeler hesaplanır ve denetlenir (eşlenemeyen başlık, aynı başlığın iki kez geçmesi, bölüm sayısını aşan dizin,
okunamayan MINI girişi → HATA, hiçbir dosya yazılmaz); sonra her dosya geçici dosyaya yazılıp os.replace ile yerine konur.
Satır sonları korunur. Çıktı: değişen dizin sayısı."""
import glob, json, os, re, sys, tempfile
K = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ANLIK = os.path.join(K, 'arastirma', 'dersler_v2', 'bolum_basliklari.json')
ESKI_ANLIK = os.path.join(K, 'arastirma', 'dersler_v2', 'bolum_basliklari_v32.json')

def oku(yol): return open(yol, encoding='utf-8', newline='').read()   # satır sonu olduğu gibi

def yaz(yol, metin):
    """bölünmez yazma: aynı klasörde geçici dosya + os.replace; satır sonuna dokunulmaz (newline='')"""
    fd, gecici = tempfile.mkstemp(dir=os.path.dirname(os.path.abspath(yol)), prefix='.' + os.path.basename(yol) + '.', suffix='.tmp')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8', newline='') as f: f.write(metin)
        os.replace(gecici, yol)
    except BaseException:
        if os.path.exists(gecici): os.remove(gecici)
        raise

def json_metin(veri, indent, ornek):
    """json.dump çıktısı, var olan dosyanın satır sonuyla (CRLF ya da LF)"""
    s = json.dumps(veri, ensure_ascii=False, indent=indent)
    return s.replace('\n', '\r\n') if '\r\n' in ornek else s

MINI_GIRIS = re.compile(r"(\d+)\s*:\s*('[^'\n]*'|\"[^\"\n]*\")")

def esle_hesapla(onceki, yeni):
    esle, hata = {}, []
    for ders, basliklar in onceki.items():
        if ders not in yeni: hata.append(f'{ders} yeni veride yok'); continue
        for b in set(yeni[ders]):
            if yeni[ders].count(b) > 1: hata.append(f'{ders}: "{b}" başlığı iki kez geçiyor; eşleme belirsiz')
        for i, b in enumerate(basliklar):
            if b not in yeni[ders]: hata.append(f'{ders} bölüm {i} "{b}" yeni derste yok (başlık değiştiyse önce bolum_basliklari.json\'da da değiştir)'); continue
            esle[(ders, i)] = yeni[ders].index(b)
    return esle, hata

def calistir(onceki_yol=None, sessiz=False):
    onceki_yol = onceki_yol or (ANLIK if os.path.exists(ANLIK) else ESKI_ANLIK)
    onceki = json.load(open(onceki_yol, encoding='utf-8'))
    yeni = {d['id']: [b['baslik'] for b in d['bolumler']] for d in json.load(open(os.path.join(K, 'veri/dersler.json'), encoding='utf-8'))['dersler']}
    esle, hata = esle_hesapla(onceki, yeni)
    degisen = 0

    def yeni_dizin(ders, n, yer):
        """önceki dizin → yeni dizin; önceki başlık dosyasında olmayan ders: dizin olduğu gibi (sınırı yeni derse göre)"""
        nonlocal degisen
        if ders in onceki:
            if (ders, n) not in esle:
                if n >= len(onceki[ders]): hata.append(f'{yer}: {ders} bölüm {n} önceki başlık dosyasında yok ({len(onceki[ders])} bölüm)')
                return n
            y = esle[(ders, n)]
        else:
            y = n
        if ders in yeni and y >= len(yeni[ders]): hata.append(f'{yer}: {ders} bölüm {y} derste yok ({len(yeni[ders])} bölüm)')
        if y != n: degisen += 1
        return y

    yazilacak = []
    # 1) çizimler
    for yol in sorted(glob.glob(os.path.join(K, 'cizim_*.js'))):
        s = oku(yol)
        s2 = re.sub(r"ders: '(d\d+)', bolum: (\d+)", lambda m: f"ders: '{m.group(1)}', bolum: {yeni_dizin(m.group(1), int(m.group(2)), os.path.basename(yol))}", s)
        if s2 != s: yazilacak.append((yol, s2))
    # 2) ders içi deneyler (dersler.js MINI): her giriş korunur; okunamayan giriş sessizce silinmez → HATA
    yol = os.path.join(K, 'dersler.js'); s = oku(yol)
    m = re.search(r"const MINI = \{(.*?)\};", s, re.S)
    if not m: hata.append('dersler.js: MINI bulunamadı')
    else:
        def mini(mm):
            ders, ic = mm.group(1), mm.group(2)
            girdiler = MINI_GIRIS.findall(ic)
            if len(girdiler) != len(re.findall(r':', ic)) or MINI_GIRIS.sub('', ic).strip(' ,\r\n\t'):
                hata.append(f'dersler.js MINI {ders}: okunamayan giriş: {{{ic.strip()}}}')
                return mm.group(0)
            return ders + ': { ' + ', '.join(f"{yeni_dizin(ders, int(a), 'dersler.js MINI')}: {b}" for a, b in girdiler) + ' }'
        ic_yeni = re.sub(r"(d\d+)\s*:\s*\{([^}]*)\}", mini, m.group(1))
        if re.sub(r"(d\d+)\s*:\s*\{([^}]*)\}", '', m.group(1)).strip(' ,\r\n\t'):
            hata.append('dersler.js MINI: ders girişi olarak okunamayan metin var')
        s2 = s[:m.start(1)] + ic_yeni + s[m.end(1):]
        if s2 != s: yazilacak.append((yol, s2))
    # 3) ünite sınavları
    yol = os.path.join(K, 'veri/sinavlar.json'); ham = oku(yol); S = json.loads(ham); sdeg = False
    for ls in S['uniteler'].values():
        for q in ls:
            if 'bolum' in q and q.get('ders'):
                y = yeni_dizin(q['ders'], q['bolum'], f"sinavlar.json {q.get('id')}")
                if y != q['bolum']: q['bolum'] = y; sdeg = True
    if sdeg: yazilacak.append((yol, json_metin(S, 1, ham)))
    if hata: sys.exit('HATA (hiçbir dosya yazılmadı; çizim/sınav/deney yerini kaybedebilir):\n  ' + '\n  '.join(hata))
    for yol, metin in yazilacak: yaz(yol, metin)
    # 4) yeni anlık görüntü: bir sonraki çalıştırma bu başlıklardan eşler (aynı eşleme iki kez uygulanmaz)
    eski_metin = oku(ANLIK) if os.path.exists(ANLIK) else ''
    anlik = json_metin(yeni, 1, eski_metin or oku(ESKI_ANLIK)) + ('\r\n' if '\r\n' in (eski_metin or oku(ESKI_ANLIK)) else '\n')
    if anlik != eski_metin: yaz(ANLIK, anlik)
    if not sessiz: print('eşlendi; değişen dizin sayısı:', degisen, '· önceki başlıklar:', os.path.relpath(onceki_yol, K), '→ yeni anlık görüntü:', os.path.relpath(ANLIK, K))
    return degisen

if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    calistir(sys.argv[1] if len(sys.argv) > 1 else None)
