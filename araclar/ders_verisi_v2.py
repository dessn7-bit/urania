"""Ders v2: arastirma/dersler_v2/dNN.json taslaklarını (yoksa mevcut veri/dersler.json'daki dersi)
birleştirip veri/dersler.json'u üniteleriyle üretir. Kullanım: python3 araclar/ders_verisi_v2.py"""
import json, os, re, sys
K = os.path.join(os.path.dirname(__file__), '..')
V2 = os.path.join(K, 'arastirma', 'dersler_v2')
sys.path.insert(0, os.path.join(K, 'araclar'))
from ders_denetim import denetle

UNITELER = [
    {'id': 'gokyuzu', 'ad': 'Gökyüzünü okumak', 'aciklama': 'Gökte yön bulmak, ışığın dili, teleskop ve dürbün.', 'dersler': ['d1', 'd2', 'd11', 'd12']},
    {'id': 'gunes_sistemi', 'ad': 'Güneş Sistemi', 'aciklama': 'Kütleçekim, gezegenler, Ay ve küçük cisimler.', 'dersler': ['d3', 'd9', 'd10', 'd19']},
    {'id': 'yildizlar', 'ad': 'Yıldızlar', 'aciklama': 'Güneş\'ten başlayıp yıldızların doğumu, hayatı ve ölümü.', 'dersler': ['d4', 'd14', 'd5', 'd15', 'd6', 'd16']},
    {'id': 'gezegen_yasam', 'ad': 'Ötegezegenler ve yaşam', 'aciklama': 'Başka yıldızların gezegenleri ve yaşam arayışı.', 'dersler': ['d13', 'd18']},
    {'id': 'evren', 'ad': 'Galaksiler ve evren', 'aciklama': 'Samanyolu\'ndan evrenin tarihine ve geleceğine.', 'dersler': ['d7', 'd8', 'd17']},
]
eski = {d['id']: d for d in json.load(open(os.path.join(K, 'veri/dersler.json'), encoding='utf-8'))['dersler']}
dersler, kaynak = [], {}
# Tekrar kartlarının kalıcı kimliği (kid): kartın ilerlemesi bu kimliğe yazılır. İlk atamada eski sıra
# kimliğiyle aynıdır (d1s0, d1n0, d1t0: mevcut ilerleme korunur); sonradan eklenen öğe en büyük numaranın
# bir fazlasını alır. Böylece araya soru eklemek ya da sırayı değiştirmek ilerlemeyi başka karta kaydırmaz.
def kimlik_ver(d):
    degisti = False
    for alan, ek in (('sorular', 's'), ('anahtar_sayilar', 'n'), ('sozluk', 't')):
        ls = d.get(alan) or []
        on = d['id'] + ek
        var = [int(x['kid'][len(on):]) for x in ls if str(x.get('kid', '')).startswith(on) and x['kid'][len(on):].isdigit()]
        sonraki = (max(var) + 1) if var else 0
        for i, x in enumerate(ls):
            if 'kid' in x: continue
            if var: x['kid'] = on + str(sonraki); sonraki += 1
            else: x['kid'] = on + str(i)
            degisti = True
        kids = [x['kid'] for x in ls]
        assert len(kids) == len(set(kids)), (d['id'], alan, 'kid tekrarı')
    return degisti
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
            if kimlik_ver(d): json.dump(d, open(yol, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
            d['unite'] = u['id']
            dersler.append(d); kaynak[i] = 'v2'
        elif i in eski:
            dersler.append(eski[i]); kaynak[i] = 'eski'
# Kaynak metinler başka dersleri dosya kimliğiyle anar ("11. ders" = d11). Uygulama dersleri ünite sırasıyla
# numaralar ("Ders 4 / 19"), bu yüzden atıflar burada uygulamadaki sıra numarasına çevrilir.
SIRA = {d['id']: i + 1 for i, d in enumerate(dersler)}
def numarala(x):
    if isinstance(x, str):
        return re.sub(r'(?<![\d%,.])(\d{1,2})\. ders', lambda m: (str(SIRA['d' + m.group(1)]) if 'd' + m.group(1) in SIRA else m.group(1)) + '. ders', x)
    if isinstance(x, list): return [numarala(v) for v in x]
    if isinstance(x, dict): return {k: (v if k in ('id', 'kaynak_url', 'url') else numarala(v)) for k, v in x.items()}
    return x
dersler = [numarala(d) if kaynak[d['id']] == 'v2' else d for d in dersler]   # eski kayıtlar zaten çevrilmiş
for d in dersler:
    for s in d.get('anahtar_sayilar', []): assert s.get('kaynak_url', '').startswith('http'), (d['id'], s)
out = {'not': 'Ders metinleri Urania için yazıldı; her sayı ve olgu derste bağlantısı verilen kaynaklarla, ayrıca bağımsız bir doğrulama turunda kontrol edildi. '
              'Başlıca kaynaklar NASA, ESA, ESO, IAU, NIST, Planck işbirliği, hakemli makaleler ve Wikipedia.',
       'uniteler': UNITELER, 'dersler': dersler}
json.dump(out, open(os.path.join(K, 'veri/dersler.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(kaynak)
