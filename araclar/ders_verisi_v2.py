"""Ders v2: arastirma/dersler_v2/dNN.json taslaklarını (yoksa mevcut veri/dersler.json'daki dersi)
birleştirip veri/dersler.json'u üniteleriyle üretir. Kullanım: python3 araclar/ders_verisi_v2.py"""
import json, os, re, sys
K = os.path.join(os.path.dirname(__file__), '..')
V2 = os.path.join(K, 'arastirma', 'dersler_v2')
sys.path.insert(0, os.path.join(K, 'araclar'))
from ders_denetim import denetle

UNITELER = [
    {'id': 'gokyuzu', 'ad': 'Gökyüzünü okumak', 'aciklama': 'Gökte yön bulmak, ışığın dili, dürbün, takımyıldızlar, teleskop ve gökyüzü fotoğrafı.', 'dersler': ['d1', 'd2', 'd11', 'd21', 'd12', 'd24']},
    # v5 (30 Ekim 2026, Kaan: "Güneş Sistemi, Samanyolu, kara delikler, nötron yıldızları, kuasarlar… detaylı"): Güneş Sistemi üç üniteye bölündü
    {'id': 'gunes_sistemi', 'ad': 'Güneş Sistemi I: Dünya, Ay ve kayalık gezegenler', 'aciklama': 'Kütleçekim, Güneş Sistemi\'nin doğuşu, Dünya, Ay, zaman ve takvim, Merkür, Venüs ve Mars.', 'dersler': ['d3', 'd34', 'd9', 'd44', 'd10', 'd22', 'd35', 'd36']},
    {'id': 'dev_gezegenler', 'ad': 'Güneş Sistemi II: dev gezegenler ve uyduları', 'aciklama': 'Jüpiter, Satürn ve halkaları, Uranüs ve Neptün; buzlu okyanuslu uydular.', 'dersler': ['d37', 'd38', 'd39', 'd40']},
    {'id': 'kucuk_cisimler', 'ad': 'Güneş Sistemi III: küçük cisimler ve uzay yolculuğu', 'aciklama': 'Cüce gezegenler ve Kuiper kuşağı, asteroitler, kuyruklu yıldızlar, meteorlar ve göktaşları; uzaya çıkmak.', 'dersler': ['d41', 'd19', 'd42', 'd43', 'd23']},
    {'id': 'yildizlar', 'ad': 'Yıldızlar', 'aciklama': 'Güneş\'ten başlayıp yıldızların doğumu, hayatı, kümeleri ve çiftleri.', 'dersler': ['d4', 'd14', 'd5', 'd15']},
    {'id': 'yildiz_olum', 'ad': 'Yıldız ölümleri ve uç nesneler', 'aciklama': 'Beyaz cüceler ve süpernovalar, nötron yıldızları ve pulsarlar, kara delikler, süper kütleli kara delikler.', 'dersler': ['d6', 'd45', 'd16', 'd46']},
    {'id': 'samanyolu', 'ad': 'Samanyolu ve galaksiler', 'aciklama': 'Evimiz Samanyolu, galaksi türleri, kuasarlar ve aktif galaksiler, galaksi kümeleri ve kozmik ağ.', 'dersler': ['d47', 'd7', 'd48', 'd49']},
    {'id': 'evren', 'ad': 'Evren', 'aciklama': 'Evrenin tarihi ve kozmoloji; sonunda astronominin kendi tarihi.', 'dersler': ['d8', 'd17', 'd20']},
    {'id': 'gezegen_yasam', 'ad': 'Ötegezegenler ve yaşam', 'aciklama': 'Başka yıldızların gezegenleri ve yaşam arayışı.', 'dersler': ['d13', 'd18']},
    # v4 (Ekim 2026): fizik bilmeyen biri için fiziğin büyük fikirleri; astronomiyle bağlantılı
    {'id': 'fizik', 'ad': 'Fiziğin büyük fikirleri', 'aciklama': 'Enerji ve entropi, ışık, görelilik, kuantum, Feynman\'ın ışık kuramı, atom çekirdeği ve parçacıklar; fizik bilmeyen biri için.', 'dersler': ['d30', 'd33', 'd25', 'd26', 'd27', 'd28', 'd29', 'd31', 'd32']},
]
# v3 (Ekim 2026) yeni dersler: taslağı henüz yazılmadıysa atlanır (yazım sürerken derleme kırılmasın)
YENI_V3 = {'d%d' % n for n in range(20, 50)}   # v3 (d20–d24), v4 fizik (d25–d33), v5 (d34–d49)
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
                if i not in eski:
                    sys.exit(f'HATA: {i} denetimden geçmedi ve veri/dersler.json içinde eski sürümü yok; ders düşürülmez. {h[:3]}')
                print('UYARI: denetimden geçmedi, eski sürüm kalıyor:', i, h[:3])
                dersler.append(eski[i]); kaynak[i] = 'eski'
                continue
            d = json.load(open(yol, encoding='utf-8'))
            if kimlik_ver(d): json.dump(d, open(yol, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
            d['unite'] = u['id']
            dersler.append(d); kaynak[i] = 'v2'
        elif i in eski:
            dersler.append(eski[i]); kaynak[i] = 'eski'
        elif i in YENI_V3:
            print('NOT: yeni ders henüz yok, atlandı:', i); continue
        else:
            sys.exit(f'HATA: {i} için ne taslak ({yol}) ne de veri/dersler.json içinde eski sürüm var; ders düşürülmez.')
# Kaynak metinler başka dersleri dosya kimliğiyle anar ("11. ders" = d11). Uygulama dersleri ünite sırasıyla
# numaralar ("Ders 4 / 19"), bu yüzden atıflar burada uygulamadaki sıra numarasına çevrilir.
for u in UNITELER: u['dersler'] = [i for i in u['dersler'] if i in kaynak]
SIRA = {d['id']: i + 1 for i, d in enumerate(dersler)}
# Kaynak metinde "d2'de", "d15'teki" gibi dosya kimliği atıfları da var; okura "2. derste" diye gösterilir.
EK_DERS = {'de': 'derste', 'da': 'derste', 'te': 'derste', 'ta': 'derste', 'deki': 'dersteki', 'daki': 'dersteki', 'teki': 'dersteki', 'taki': 'dersteki',
           'den': 'dersten', 'dan': 'dersten', 'ten': 'dersten', 'tan': 'dersten',
           'in': 'dersin', 'ın': 'dersin', 'un': 'dersin', 'ün': 'dersin', 'nin': 'dersin', 'nın': 'dersin', 'nun': 'dersin', 'nün': 'dersin'}
def numarala(x):
    if isinstance(x, str):
        x = re.sub(r'(?<![\d%,.])(\d{1,2})\. ders', lambda m: (str(SIRA['d' + m.group(1)]) if 'd' + m.group(1) in SIRA else m.group(1)) + '. ders', x)
        def kimlik(m):
            k, ek = 'd' + m.group(1), m.group(2)
            if k not in SIRA or ek not in EK_DERS: return m.group(0)
            return str(SIRA[k]) + '. ' + EK_DERS[ek]
        return re.sub(r"(?<![\w/.#-])d(\d{1,2})['’]([a-zçğıöşü]+)", kimlik, x)
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
# Yeni derslerin ünite sınavı soruları (dNN_sinav.json) veri/sinavlar.json'a: aynı id'li soru güncellenir
syol = os.path.join(K, 'veri/sinavlar.json'); S = json.load(open(syol, encoding='utf-8'))
unite_of = {i: u['id'] for u in UNITELER for i in u['dersler']}
# Ünite düzeni değişince eski soruların ünitesi de dersine göre güncellenir; boş kalan ünite silinir
for u in list(S['uniteler']):
    kalan = []
    for q in S['uniteler'][u]:
        hedef_u = unite_of.get(q.get('ders'), u)
        if hedef_u == u: kalan.append(q)
        else: S['uniteler'].setdefault(hedef_u, []).append(q)
    S['uniteler'][u] = kalan
S['uniteler'] = {u['id']: S['uniteler'].get(u['id'], []) for u in UNITELER if S['uniteler'].get(u['id'])}
for i in sorted(YENI_V3 & set(kaynak)):
    yol = os.path.join(V2, i + '_sinav.json')
    if not os.path.exists(yol): print('NOT: sınav sorusu yok:', i); continue
    ls = json.load(open(yol, encoding='utf-8'))
    ls = ls if isinstance(ls, list) else ls.get('sorular', [])
    hedef = S['uniteler'].setdefault(unite_of[i], [])
    # ders ünite değiştirdiyse eski ünitedeki kopyası silinir
    idler = {q['id'] for q in ls}
    for u, l in S['uniteler'].items():
        if u != unite_of[i]: l[:] = [q for q in l if q.get('id') not in idler]
    for q in ls:
        q = numarala(q); q['ders'] = i
        assert 0 <= q['dogru'] < len(q['secenekler']) and 0 <= q['bolum'] < len(next(d for d in dersler if d['id'] == i)['bolumler']), (i, q.get('id'))
        j = next((k for k, x in enumerate(hedef) if x.get('id') == q['id']), None)
        if j is None: hedef.append(q)
        else: hedef[j] = q
json.dump(S, open(syol, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(kaynak)
