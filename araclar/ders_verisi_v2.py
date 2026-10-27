"""Ders v2: arastirma/dersler_v2/dNN.json taslaklarını (yoksa mevcut veri/dersler.json'daki dersi)
birleştirip veri/dersler.json'u üniteleriyle üretir. Kullanım: python3 araclar/ders_verisi_v2.py"""
import json, os, re, sys
K = os.path.join(os.path.dirname(__file__), '..')
V2 = os.path.join(K, 'arastirma', 'dersler_v2')
sys.path.insert(0, os.path.join(K, 'araclar'))
from ders_denetim import denetle

UNITELER = [
    {'id': 'gokyuzu', 'ad': 'Gökyüzünü okumak', 'aciklama': 'Gökte yön bulmak, ışığın dili, teleskop ve dürbün.', 'dersler': ['d1', 'd2', 'd12', 'd11']},
    {'id': 'gunes_sistemi', 'ad': 'Güneş Sistemi', 'aciklama': 'Kütleçekim, gezegenler, Ay ve küçük cisimler.', 'dersler': ['d3', 'd9', 'd10', 'd19']},
    {'id': 'yildizlar', 'ad': 'Yıldızlar', 'aciklama': 'Güneş\'ten başlayıp yıldızların doğumu, hayatı ve ölümü.', 'dersler': ['d4', 'd14', 'd5', 'd15', 'd6', 'd16']},
    {'id': 'gezegen_yasam', 'ad': 'Ötegezegenler ve yaşam', 'aciklama': 'Başka yıldızların gezegenleri ve yaşam arayışı.', 'dersler': ['d13', 'd18']},
    {'id': 'evren', 'ad': 'Galaksiler ve evren', 'aciklama': 'Samanyolu\'ndan evrenin tarihine ve geleceğine.', 'dersler': ['d7', 'd8', 'd17']},
]
eski = {d['id']: d for d in json.load(open(os.path.join(K, 'veri/dersler.json'), encoding='utf-8'))['dersler']}
dersler, kaynak = [], {}
for u in UNITELER:
    for i in u['dersler']:
        yol = os.path.join(V2, i + '.json')
        if os.path.exists(yol):
            h, _ = denetle(yol)
            if h:
                print('UYARI: denetimden geçmedi, eski sürüm kalıyor:', i, h[:3]); 
                if i in eski: dersler.append(eski[i]); kaynak[i] = 'eski'
                continue
            d = json.load(open(yol, encoding='utf-8'))
            d['unite'] = u['id']
            dersler.append(d); kaynak[i] = 'v2'
        elif i in eski:
            dersler.append(eski[i]); kaynak[i] = 'eski'
for d in dersler:
    for s in d.get('anahtar_sayilar', []): assert s.get('kaynak_url', '').startswith('http'), (d['id'], s)
out = {'not': 'Ders metinleri Urania için yazıldı; her sayı ve olgu derste bağlantısı verilen kaynaklarla, ayrıca bağımsız bir doğrulama turunda kontrol edildi. '
              'Başlıca kaynaklar NASA, ESA, ESO, IAU, NIST, Planck işbirliği, hakemli makaleler ve Wikipedia.',
       'uniteler': UNITELER, 'dersler': dersler}
json.dump(out, open(os.path.join(K, 'veri/dersler.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(kaynak)
