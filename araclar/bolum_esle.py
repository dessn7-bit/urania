"""Ders bölümleri genişletilince (araya yeni bölüm girince) bölüm DİZİNİNE bağlı her şeyi yeni dizine taşır:
ders çizimleri (cizim_*.js: ders: 'dX', bolum: N), ders içi deneyler (dersler.js MINI) ve ünite sınavları
(veri/sinavlar.json: ders, bolum). Eşleme bölüm BAŞLIĞIYLA yapılır: genişletmede mevcut başlıklar aynen kalır.
Kullanım: python3 araclar/bolum_esle.py [önceki_başlıklar.json]   (varsayılan arastirma/dersler_v2/bolum_basliklari_v32.json; v31→v32 eşlemesi 29.10.2026'da uygulandı)
Bir kez çalıştırılır; sonra önceki başlık dosyası güncellenir (aynı eşleme iki kez uygulanmasın)."""
import json, os, re, sys, glob
K = os.path.join(os.path.dirname(__file__), '..')
onceki_yol = sys.argv[1] if len(sys.argv) > 1 else os.path.join(K, 'arastirma/dersler_v2/bolum_basliklari_v32.json')
onceki = json.load(open(onceki_yol, encoding='utf-8'))
yeni = {d['id']: [b['baslik'] for b in d['bolumler']] for d in json.load(open(os.path.join(K, 'veri/dersler.json'), encoding='utf-8'))['dersler']}
esle, hata = {}, []
for ders, basliklar in onceki.items():
    if ders not in yeni: hata.append(f'{ders} yeni veride yok'); continue
    for i, b in enumerate(basliklar):
        if b not in yeni[ders]: hata.append(f'{ders} bölüm {i} "{b}" yeni derste yok'); continue
        esle[(ders, i)] = yeni[ders].index(b)
if hata: sys.exit('HATA (başlık eşlenemedi; çizim/sınav/deney yerini kaybeder):\n  ' + '\n  '.join(hata))
degisen = 0
for yol in glob.glob(os.path.join(K, 'cizim_*.js')):
    s = open(yol, encoding='utf-8').read()
    def r(m):
        global degisen
        if (m.group(1), int(m.group(2))) not in esle: return m.group(0)   # önceki başlık dosyasında olmayan (yeni) ders: dizin olduğu gibi kalır
        y = esle[(m.group(1), int(m.group(2)))]
        if y != int(m.group(2)): degisen += 1
        return f"ders: '{m.group(1)}', bolum: {y}"
    s2 = re.sub(r"ders: '(d\d+)', bolum: (\d+)", r, s)
    if s2 != s: open(yol, 'w', encoding='utf-8').write(s2)
yol = os.path.join(K, 'dersler.js'); s = open(yol, encoding='utf-8').read()
m = re.search(r"const MINI = \{(.*?)\};", s, re.S)
def mini(mm):
    ders, ic = mm.group(1), mm.group(2)
    return ders + ': { ' + ', '.join(f"{esle.get((ders, int(a)), int(a))}: {b}" for a, b in re.findall(r"(\d+): ('[a-z]+')", ic)) + ' }'
yeni_mini = re.sub(r"(d\d+): \{([^}]*)\}", mini, m.group(1))
s = s[:m.start(1)] + yeni_mini + s[m.end(1):]; open(yol, 'w', encoding='utf-8').write(s)
yol = os.path.join(K, 'veri/sinavlar.json'); S = json.load(open(yol, encoding='utf-8'))
for ls in S['uniteler'].values():
    for q in ls:
        if q.get('ders') in onceki and 'bolum' in q:
            y = esle[(q['ders'], q['bolum'])]
            if y != q['bolum']: degisen += 1
            q['bolum'] = y
json.dump(S, open(yol, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('eşlendi; değişen dizin sayısı:', degisen)
