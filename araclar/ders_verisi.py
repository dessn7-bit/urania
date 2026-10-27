"""arastirma/dersler_*.json taslaklarını birleştirip veri/dersler.json'u üretir.
Arayüzün diliyle tutarlı olsun diye 'siz' hitabı 'sen'e çevrilir (yalnız aşağıdaki
listelenmiş kelimeler; içerik değişmez)."""
import json, os, re
K = os.path.join(os.path.dirname(__file__), '..')
HITAP = [
    ('fırlattığınızı düşünün', 'fırlattığını düşün'), ('Formüle bakın', 'Formüle bak'),
    ('baktığınızda', 'baktığında'), ('başınızın', 'başının'), ('durduğunuz', 'durduğun'),
    ('tepenizdeki', 'tependeki'), ('enleminizi', 'enlemini'), ('bulmanıza', 'bulmana'),
    ('enleminiz', 'enlemin'), ('Görebildiğiniz', 'Görebildiğin'), ('gözünüze', 'gözüne'),
    ('görebileceğiniz', 'görebileceğin'), ('göreceğiniz', 'göreceğin'), ('yönteminize', 'yöntemine'),
    ('çıkarırsanız', 'çıkarırsan'), ('ölçerseniz', 'ölçersen'), ('hesaplayabilirsiniz', 'hesaplayabilirsin'),
    ('çevirdiğinizde', 'çevirdiğinde'), ('atarsanız', 'atarsan'), ('sıkıştırırsanız', 'sıkıştırırsan'),
    ('yaparsınız', 'yaparsın'),
]
def cevir(x):
    if isinstance(x, str):
        for a, b in HITAP: x = x.replace(a, b)
        return x
    if isinstance(x, list): return [cevir(i) for i in x]
    if isinstance(x, dict): return {k: (cevir(v) if k not in ('kaynak_url', 'url') else v) for k, v in x.items()}
    return x
dersler = []
for f in ('dersler_1_4.json', 'dersler_5_8.json', 'dersler_9_11.json'):
    if not os.path.exists(os.path.join(K, 'arastirma', f)): continue
    dersler += json.load(open(os.path.join(K, 'arastirma', f), encoding='utf-8'))
dersler = cevir(dersler)
kalan = set(re.findall(r'\b\w+(?:ınız|iniz|unuz|ünüz|sanız|seniz|sınız|siniz)\b', json.dumps(dersler, ensure_ascii=False)))
assert not kalan, kalan
gerekli = ['id', 'baslik', 'ozet', 'bolumler', 'defter_notu', 'sorular', 'kaynaklar']
for d in dersler:
    for g in gerekli: assert d.get(g), (d.get('id'), g)
    for s in d.get('anahtar_sayilar', []): assert s.get('kaynak_url', '').startswith('http'), (d['id'], s)
out = {'not': 'Ders metinleri Urania için yazıldı; her sayı derste bağlantısı verilen kaynakta doğrulandı. '
              'Başlıca kaynaklar NASA, ESA, ESO, IAU, NIST, Planck işbirliği ve Wikipedia.',
       'dersler': dersler}
json.dump(out, open(os.path.join(K, 'veri/dersler.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('dersler:', [d['id'] for d in dersler])
