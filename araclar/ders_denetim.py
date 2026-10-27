"""Ders taslağı denetimi (v2): arastirma/dersler_v2/dNN.json dosyalarını şemaya ve
yazım kurallarına göre denetler. Kullanım: python3 araclar/ders_denetim.py [dNN ...]
Hata varsa çıkış kodu 1. Uyarılar düzeltilmeli ama derlemeyi durdurmaz."""
import json, os, re, sys
K = os.path.join(os.path.dirname(__file__), '..')
D = os.path.join(K, 'arastirma', 'dersler_v2')
sys.path.insert(0, os.path.join(K, 'araclar'))

ZORUNLU = ['id', 'baslik', 'unite', 'ozet', 'bolumler', 'formuller', 'anahtar_sayilar', 'sozluk', 'defter_notu', 'sorular', 'kaynaklar']
YASAK_KAYNAK = re.compile(r'openstax', re.I)
SIZ = re.compile(r'\b\w+(?:ınız|iniz|unuz|ünüz|sanız|seniz|sınız|siniz|ınızı|inizi|nuz|nüz)\b')

def kelime(d):
    return sum(len(p.split()) for b in d['bolumler'] for p in b['paragraflar'])

def denetle(yol):
    hatalar, uyarilar = [], []
    try:
        d = json.load(open(yol, encoding='utf-8'))
    except Exception as e:
        return [f'JSON okunamadı: {e}'], []
    for z in ZORUNLU:
        if z not in d: hatalar.append(f'eksik alan: {z}')
    if hatalar: return hatalar, uyarilar
    w = kelime(d)
    yeni = d.get('yeni', False)
    alt = 1800 if yeni else 2000
    if w < alt: hatalar.append(f'bölüm paragrafları {w} kelime; en az {alt}')
    if w > 3600: uyarilar.append(f'{w} kelime; 3600 üstü çok uzun olabilir')
    if not 5 <= len(d['bolumler']) <= 10: hatalar.append(f'{len(d["bolumler"])} bölüm; 5–10 olmalı')
    for i, b in enumerate(d['bolumler']):
        if not b.get('baslik') or not b.get('paragraflar'): hatalar.append(f'bölüm {i}: başlık/paragraf yok')
        if not b.get('akilda'): hatalar.append(f'bölüm {i} ({b.get("baslik")}): "akilda" ara özeti yok')
        for p in b.get('paragraflar', []):
            if len(p.split()) > 170: uyarilar.append(f'bölüm {i}: {len(p.split())} kelimelik paragraf; böl (≤150)')
            if re.search(r'\*\*|^#|^- ', p): hatalar.append(f'bölüm {i}: paragrafta markdown işareti')
        o = b.get('ornek')
        if o is not None and not (o.get('baslik') and o.get('metin')): hatalar.append(f'bölüm {i}: örnek baslik+metin olmalı')
    ornek = sum(1 for b in d['bolumler'] if b.get('ornek'))
    if ornek < 2: hatalar.append(f'{ornek} çalışılmış örnek; en az 2 (sayılarla, adım adım)')
    if len(d['sorular']) < 6: hatalar.append(f'{len(d["sorular"])} soru; en az 6')
    for s in d['sorular']:
        if not (s.get('soru') and s.get('cevap')): hatalar.append('soru/cevap eksik')
    if len(d['sozluk']) < 6: hatalar.append(f'{len(d["sozluk"])} sözlük terimi; en az 6')
    if not 5 <= len(d['defter_notu']) <= 10: hatalar.append('defter_notu 5–10 madde olmalı')
    if len(d['anahtar_sayilar']) < 6: hatalar.append('en az 6 anahtar sayı')
    for s in d['anahtar_sayilar']:
        if not str(s.get('kaynak_url', '')).startswith('http'): hatalar.append(f'anahtar sayı kaynaksız: {s.get("aciklama")}')
    if len(d['kaynaklar']) < 6: hatalar.append('en az 6 kaynak')
    tum = json.dumps(d, ensure_ascii=False)
    if YASAK_KAYNAK.search(tum): hatalar.append('OpenStax kullanılamaz (yapay zekâ kullanımı yasak lisans)')
    siz = sorted(set(SIZ.findall(' '.join(p for b in d['bolumler'] for p in b['paragraflar']))))
    siz = [x for x in siz if x.lower() not in {'yeniniz', 'deniz', 'sonuz', 'ikiniz'}]
    if siz: uyarilar.append(f'"siz" hitabı olabilir (sen kullan): {siz[:8]}')
    # okunuş: sesli okumada çevrilmemiş sembol kalmasın
    try:
        import subprocess
        js = "const {okunus}=require('%s');const d=require('%s');const t=d.bolumler.flatMap(b=>[b.baslik,...b.paragraflar,b.akilda||'',...(b.ornek?[b.ornek.baslik,b.ornek.metin]:[])]).map(okunus).join(' ');const k=[...t].filter(c=>!/[\\p{L}\\p{N}\\s.,;:!?()'\"’‘“”…%%\\-–—]/u.test(c));console.log(JSON.stringify([...new Set(k)]));" % (os.path.join(K, 'okunus.js'), os.path.abspath(yol))
        r = subprocess.run(['node', '-e', js], capture_output=True, text=True, timeout=30)
        kalan = json.loads(r.stdout.strip() or '[]')
        if kalan: uyarilar.append(f'sesli okumada karşılığı olmayan semboller: {kalan} (kelimeyle yaz ya da Claude\'a bildir)')
        # okunuş: sayıdan sonra açılmadan kalan ekli birim ("5 km'de") ve "ya da" okunan birimli eğik çizgi
        js2 = ("const {okunus}=require('%s');const d=require('%s');const m=d.bolumler.flatMap(b=>[b.baslik,...b.paragraflar,b.akilda||'',...(b.ornek?[b.ornek.baslik,b.ornek.metin]:[])]).concat(d.defter_notu||[]);"
               "const ek=new Set(),yd=new Set();m.forEach(x=>{const o=okunus(x);(o.match(/\\d\\s?(?:km|cm|mm|nm|μm|kg|AB|K|dk|sa|sn|Mpc|kpc|pc|W|J|Hz|MHz|THz|MeV|s|m|g|°C?)[²³]?['’][a-zçğıöşü]+/g)||[]).forEach(e=>ek.add(e));"
               "(x.match(/\\S+\\/\\S+/g)||[]).forEach(e=>{if(/ ya da /.test(okunus(e))&&!/^[a-zçğıöşü]{2,}\\/[a-zçğıöşü]{2,}[.,;:)]*$/.test(e))yd.add(e);});});"
               "console.log(JSON.stringify({ek:[...ek],yd:[...yd]}));") % (os.path.join(K, 'okunus.js'), os.path.abspath(yol))
        r2 = subprocess.run(['node', '-e', js2], capture_output=True, text=True, timeout=30)
        o2 = json.loads(r2.stdout.strip() or '{}')
        if o2.get('ek'): uyarilar.append(f'sesli okumada açılmayan ekli birim: {o2["ek"][:8]} (okunus.js birim listesine ekle)')
        if o2.get('yd'): uyarilar.append(f'birimli eğik çizgi "ya da" okunuyor: {o2["yd"][:8]} (okunus.js birim listesine ekle)')
    except Exception as e:
        uyarilar.append(f'okunuş denetimi çalışmadı: {e}')
    return hatalar, uyarilar

if __name__ == '__main__':
    ids = sys.argv[1:] or sorted(f[:-5] for f in os.listdir(D) if re.match(r'd\d+\.json$', f))
    kotu = False
    for i in ids:
        h, u = denetle(os.path.join(D, i + '.json'))
        d = json.load(open(os.path.join(D, i + '.json'), encoding='utf-8')) if not h or 'JSON' not in h[0] else None
        print(f'== {i}: {"TAMAM" if not h else "HATA"}' + (f' ({kelime(d)} kelime)' if d and 'bolumler' in d else ''))
        for x in h: print('  HATA  ', x)
        for x in u: print('  uyarı ', x)
        kotu = kotu or bool(h)
    sys.exit(1 if kotu else 0)
