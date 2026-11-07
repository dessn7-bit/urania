"""Ders v2: arastirma/dersler_v2/dNN.json taslaklarını (yoksa mevcut veri/dersler.json'daki dersi)
birleştirip veri/dersler.json'u üniteleriyle üretir; derslerin ünite sınavı sorularını (dNN_sinav.json) veri/sinavlar.json'a
işler. Kullanım: python3 araclar/ders_verisi_v2.py
Önce her şey hesaplanır ve denetlenir, sonra yazılır (geçici dosya + os.replace): bir denetim düşerse hiçbir dosya değişmez.
dNN.json'a yalnız kid'siz öğeye yeni kid atanınca yazılır (dosya okunduğundan beri değiştiyse yazılmaz, uyarı verilir).
İçe aktarılınca hiçbir şey çalışmaz (testler numarala / hal / kimlik_ver'i ayrıca sınar): iş main()'de."""
import json, os, re, sys, tempfile
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
    {'id': 'yildiz_olum', 'ad': 'Yıldız ölümleri ve uç nesneler', 'aciklama': 'Beyaz cüceler ve süpernovalar, nötron yıldızları ve atarcalar, kara delikler, süper kütleli kara delikler.', 'dersler': ['d6', 'd45', 'd16', 'd46']},
    {'id': 'samanyolu', 'ad': 'Samanyolu ve galaksiler', 'aciklama': 'Evimiz Samanyolu, galaksi türleri, kuasarlar ve aktif galaksiler, galaksi kümeleri ve kozmik ağ.', 'dersler': ['d47', 'd7', 'd48', 'd49']},
    {'id': 'evren', 'ad': 'Evren', 'aciklama': 'Büyük Patlama kuramı ve kanıtları, kozmik mikrodalga arka plan ışıması, evrenin tarihi ve kozmoloji; sonunda astronominin kendi tarihi.', 'dersler': ['d57', 'd58', 'd8', 'd17', 'd20']},
    {'id': 'gezegen_yasam', 'ad': 'Ötegezegenler ve yaşam', 'aciklama': 'Başka yıldızların gezegenleri ve yaşam arayışı.', 'dersler': ['d13', 'd18']},
    # v4 (Ekim 2026): fizik bilmeyen biri için fiziğin büyük fikirleri; astronomiyle bağlantılı
    {'id': 'fizik', 'ad': 'Fiziğin büyük fikirleri', 'aciklama': 'Enerji ve entropi, ışık, görelilik, kuantum, Feynman\'ın ışık kuramı, atom çekirdeği ve parçacıklar; fizik bilmeyen biri için.', 'dersler': ['d30', 'd33', 'd25', 'd26', 'd27', 'd28', 'd29', 'd31', 'd32']},
    # v6 (30 Ekim 2026, Kaan: "evrenle ilgili teoriler… sicim teorisine kadar, paralel evrenler, beyaz delik"): kuramlar ve olasılıklar
    {'id': 'kuramlar', 'ad': 'Evrenin büyük soruları: kuramlar ve olasılıklar', 'aciklama': 'Karanlık madde ve karanlık enerji, şişme (enflasyon) ve çoklu evren, kara deliklerin kuantum yüzü, beyaz delikler ve solucan delikleri, sicim kuramı ve kuantum kütleçekim, evrenin başı ve sonu; neyin kanıtlı neyin spekülasyon olduğu açıkça.', 'dersler': ['d50', 'd51', 'd54', 'd52', 'd56', 'd53', 'd55']},
]
def yaz(yol, metin):
    """bölünmez yazma: aynı klasörde geçici dosya, sonra os.replace (yarım/boş dosya kalmaz). Metin kipinde yazılır:
    satır sonu eskisi gibi işletim sisteminin satır sonudur."""
    fd, gecici = tempfile.mkstemp(dir=os.path.dirname(os.path.abspath(yol)), prefix='.' + os.path.basename(yol) + '.', suffix='.tmp')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f: f.write(metin)
        os.replace(gecici, yol)
    except BaseException:
        if os.path.exists(gecici): os.remove(gecici)
        raise
# Tekrar kartlarının kalıcı kimliği (kid): kartın ilerlemesi bu kimliğe yazılır. İlk atamada eski sıra
# kimliğiyle aynıdır (d1s0, d1n0, d1t0: mevcut ilerleme korunur); sonradan eklenen öğe en büyük numaranın
# bir fazlasını alır. Böylece araya soru eklemek ya da sırayı değiştirmek ilerlemeyi başka karta kaydırmaz.
# Taslakta kid'i olmayan bir öğe, veri/dersler.json'daki önceki sürümde AYNI metinle (soru / değer / terim) varsa
# onun kid'ini geri alır: taslak kid'siz yeniden üretilse de ilerleme kaymaz. Yeni numara, önceki sürümdeki
# numaraların da üstünden verilir (silinmiş bir kartın kid'i başka karta geçmez).
ALANLAR = (('sorular', 's', 'soru'), ('anahtar_sayilar', 'n', 'deger'), ('sozluk', 't', 'terim'))
def kimlik_ver(d, onceki=None):
    degisti = False
    for alan, ek, anahtar in ALANLAR:
        ls = d.get(alan) or []
        on = d['id'] + ek
        def no(k): return int(k[len(on):]) if str(k).startswith(on) and str(k)[len(on):].isdigit() else None
        eski_ls = (onceki or {}).get(alan) or []
        kullanilan = {x['kid'] for x in ls if 'kid' in x}
        eski_kid = {}
        for x in eski_ls:
            if x.get('kid') and x.get(anahtar) and x['kid'] not in kullanilan: eski_kid.setdefault(str(x[anahtar]).strip(), x['kid'])
        var = [n for n in (no(x.get('kid', '')) for x in ls + eski_ls) if n is not None]
        sonraki = (max(var) + 1) if var else 0
        for i, x in enumerate(ls):
            if 'kid' in x: continue
            k = eski_kid.pop(str(x.get(anahtar, '')).strip(), None)
            if k: x['kid'] = k
            elif var: x['kid'] = on + str(sonraki); sonraki += 1
            else: x['kid'] = on + str(i)
            degisti = True
        kids = [x['kid'] for x in ls]
        assert len(kids) == len(set(kids)), (d['id'], alan, 'kid tekrarı')
    return degisti
# Kaynak metinler başka dersleri DOSYA KİMLİĞİYLE anar: "d9'da", "(d20)", "d12'ye", "d2 ve d3'ü", "9. derste",
# "4. ve 11. dersler" (kaynakta "N. ders" = dN dosyası). Uygulama dersleri ünite sırasıyla numaralar ("Ders 4 / 58"),
# bu yüzden okura giden ve sesli okunan her metinde atıflar burada uygulamadaki sıra numarasına çevrilir:
#   "d12'ye göre" → "5. derse göre", "(d20)" → "(40. ders)", "d3'ü" → "7. dersi", "d30'dakilerle" → "43. derstekilerle",
#   "d1 ve d11'deki" → "1. ve 3. derslerdeki", "(d11, d12)" → "(3. ve 5. dersler)", "4. ve 11. dersler" → "24. ve 3. dersler".
# Kimlik alanları (id, kid, url, kaynak_url, on_bilgi, unite, ders) ve "#ders/d12", "cz-d41-…", "d3-celestial" çevrilmez.
SIRA = {}   # ders kimliği → uygulamadaki sıra numarası (main() doldurur)
KIMLIK_ALAN = ('id', 'kid', 'url', 'kaynak_url', 'on_bilgi', 'unite', 'ders')
# "ders" sözcüğünün hâl ekleri (ünlü uyumu "ders"e göre; kaynaktaki ek sayının okunuşuna göreydi: "d12'ye", "d3'ü")
TEKIL = {'yalin': 'ders', 'bulunma': 'derste', 'ayrilma': 'dersten', 'yonelme': 'derse', 'belirtme': 'dersi', 'ilgi': 'dersin', 'vasita': 'dersle'}
COGUL = {'yalin': 'dersler', 'bulunma': 'derslerde', 'ayrilma': 'derslerden', 'yonelme': 'derslere', 'belirtme': 'dersleri', 'ilgi': 'derslerin', 'vasita': 'derslerle'}
HAL = [(r'[dt][ae]n', 'ayrilma'), (r'[dt][ae]', 'bulunma'), (r'n?[ıiuü]n', 'ilgi'), (r'y?l[ae]', 'vasita'), (r'y?[ae]', 'yonelme'), (r'y?[ıiuü]', 'belirtme')]
def hal(ek):
    """kaynakta kesmeden sonraki ek → (hâl, kalan). "-ki" ve ardı ("dakilerle" → bulunma + "kilerle") olduğu gibi kalır
    (-ki'den sonraki ekler hep "ki"ye uyar). Tanınmayan ek → None (atıf çevrilmez, derleme sonunda HATA verir)."""
    for desen, h in HAL:
        m = re.match(desen, ek)
        if m and (m.end() == len(ek) or (ek[m.end():].startswith('ki') and h in ('bulunma', 'ilgi'))): return h, ek[m.end():]
    return None
AYRAC = r"(?:,\s*| ve | ile | ya da | veya )"
KIMLIK = re.compile(rf"(?<![\w/.#-])(d\d{{1,2}}(?:{AYRAC}d\d{{1,2}})*)(?:['’]([a-zçğıöşü]+)|(?![\w'’-]))")
NUMARA = re.compile(r"(?<![\d%,.])((?:\d{1,2}\.,? (?:ve |ile |ya da |veya )?)*)(\d{1,2})\. ders")
KALINTI = re.compile(r"(?<![\w/.#-])d\d{1,2}(?![\d\w-])")   # çevrilmeden kalan dosya kimliği (test de aynısını arar)
def numarala(x):
    if isinstance(x, str):
        def sira_no(n): return str(SIRA['d' + n]) if 'd' + n in SIRA else n
        # "9. derste", "4. ve 11. dersler", "1., 2. ve 3. derslerde": zincirdeki HER sayı çevrilir
        x = NUMARA.sub(lambda m: re.sub(r'\d{1,2}', lambda k: sira_no(k.group(0)), m.group(1)) + sira_no(m.group(2)) + '. ders', x)
        def kimlik(m):
            ogeler = re.findall(r'd\d{1,2}', m.group(1))
            if any(o not in SIRA for o in ogeler): return m.group(0)
            h = hal(m.group(2)) if m.group(2) else ('yalin', '')
            if h is None: return m.group(0)
            nolar = [str(SIRA[o]) + '.' for o in ogeler]
            if len(nolar) == 1: return nolar[0] + ' ' + TEKIL[h[0]] + h[1]
            ayr = [', ' if a.strip() == ',' else a for a in re.findall(AYRAC, m.group(1))]
            if all(a == ', ' for a in ayr): ayr[-1] = ' ve '   # "(d11, d12)" → "(3. ve 5. dersler)"
            return nolar[0] + ''.join(a + n for a, n in zip(ayr, nolar[1:])) + ' ' + COGUL[h[0]] + h[1]
        return KIMLIK.sub(kimlik, x)
    if isinstance(x, list): return [numarala(v) for v in x]
    if isinstance(x, dict): return {k: (v if k in KIMLIK_ALAN else numarala(v)) for k, v in x.items()}
    return x
def kalintilar(x, yol=''):
    """okura giden / sesli okunan metinde kalan "dNN" (kimlik alanları hariç)"""
    if isinstance(x, str): return [(yol, m.group(0), x[max(0, m.start() - 30):m.end() + 30]) for m in KALINTI.finditer(x)]
    if isinstance(x, list): return [k for i, v in enumerate(x) for k in kalintilar(v, f'{yol}[{i}]')]
    if isinstance(x, dict): return [k for a, v in x.items() if a not in KIMLIK_ALAN for k in kalintilar(v, f'{yol}.{a}')]
    return []
def main():
    global SIRA
    eski = {d['id']: d for d in json.load(open(os.path.join(K, 'veri/dersler.json'), encoding='utf-8'))['dersler']}
    dersler, kaynak, kid_yaz = [], {}, []
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
                ham = open(yol, encoding='utf-8').read()
                d = json.loads(ham)
                if kimlik_ver(d, eski.get(i)): kid_yaz.append((yol, ham, json.dumps(d, ensure_ascii=False, indent=2)))
                d['unite'] = u['id']
                dersler.append(d); kaynak[i] = 'v2'
            elif i in eski:
                dersler.append(eski[i]); kaynak[i] = 'eski'
            elif int(i[1:]) >= 20:   # yazımı süren yeni ders (d20 ve sonrası): taslağı henüz yoksa atlanır, derleme kırılmaz
                print('NOT: yeni ders henüz yok, atlandı:', i); continue
            else:
                sys.exit(f'HATA: {i} için ne taslak ({yol}) ne de veri/dersler.json içinde eski sürüm var; ders düşürülmez.')
    for u in UNITELER: u['dersler'] = [i for i in u['dersler'] if i in kaynak]
    SIRA = {d['id']: i + 1 for i, d in enumerate(dersler)}
    dersler = [numarala(d) if kaynak[d['id']] == 'v2' else d for d in dersler]   # eski kayıtlar zaten çevrilmiş
    for d in dersler:
        for s in d.get('anahtar_sayilar', []): assert s.get('kaynak_url', '').startswith('http'), (d['id'], s)
    out = {'not': 'Ders metinleri Urania için yazıldı; her sayı ve olgu derste bağlantısı verilen kaynaklarla, ayrıca bağımsız bir doğrulama turunda kontrol edildi. '
                  'Başlıca kaynaklar NASA, ESA, ESO, IAU, NIST, Planck işbirliği, hakemli makaleler ve Wikipedia.',
           'uniteler': UNITELER, 'dersler': dersler}
    # Derslerin ünite sınavı soruları (dNN_sinav.json) veri/sinavlar.json'a: aynı id'li soru güncellenir. Sınav dosyası
    # HER derste aranır (d59 ve sonrası da; eskiden yalnız d20–d58'e bakılıyordu). d1–d19'un soruları yalnız veri/sinavlar.json'da.
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
    bolum_say = {d['id']: len(d['bolumler']) for d in dersler}
    for i in sorted(kaynak, key=lambda x: int(x[1:])):
        yol = os.path.join(V2, i + '_sinav.json')
        if not os.path.exists(yol):
            if not any(q.get('ders') == i for l in S['uniteler'].values() for q in l): print('NOT: sınav sorusu yok:', i)
            continue
        ls = json.load(open(yol, encoding='utf-8'))
        ls = ls if isinstance(ls, list) else ls.get('sorular', [])
        hedef = S['uniteler'].setdefault(unite_of[i], [])
        # ders ünite değiştirdiyse eski ünitedeki kopyası silinir
        idler = {q['id'] for q in ls}
        for u, l in S['uniteler'].items():
            if u != unite_of[i]: l[:] = [q for q in l if q.get('id') not in idler]
        for q in ls:
            q = numarala(q); q['ders'] = i
            if not (0 <= q['dogru'] < len(q['secenekler']) and 0 <= q['bolum'] < bolum_say[i]):
                sys.exit(f'HATA: {i} sınav sorusu {q.get("id")}: doğru şık ya da bölüm dizini aralık dışında; hiçbir dosya yazılmadı.')
            j = next((k for k, x in enumerate(hedef) if x.get('id') == q['id']), None)
            if j is None: hedef.append(q)
            else: hedef[j] = q
    # Okura giden / sesli okunan metinde dosya kimliği kalmasın (tanınmayan ek ya da olmayan ders: kaynağı düzelt)
    kalan = [(d['id'],) + k for d in dersler for k in kalintilar(d)] + [(q.get('id'),) + k for l in S['uniteler'].values() for q in l for k in kalintilar(q)]
    if kalan:
        sys.exit('HATA: çevrilemeyen ders atfı (hiçbir dosya yazılmadı):\n  ' + '\n  '.join(f'{a} {y}: {m!r} …{c}…' for a, y, m, c in kalan[:30]))
    # Hepsi denetlendi: şimdi yaz. dNN.json'a kid yazılmadan önce dosya okunduğu andaki hâliyle karşılaştırılır
    # (bu arada başka biri düzenlediyse onun değişikliği ezilmez; kid ataması bir sonraki derlemede yapılır).
    for yol, ham, metin in kid_yaz:
        if open(yol, encoding='utf-8').read() != ham: print('UYARI: okunduktan sonra değişti, kid yazılmadı:', yol); continue
        yaz(yol, metin)
    yaz(os.path.join(K, 'veri/dersler.json'), json.dumps(out, ensure_ascii=False, indent=1))
    yaz(syol, json.dumps(S, ensure_ascii=False, indent=1))
    print(kaynak)

if __name__ == '__main__':
    main()
