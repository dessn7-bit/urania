#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/apod_gorsel.py — "Haftanın görüntüsü" adayları: APOD'un science.nasa.gov'daki kayıtları, kredi beyaz listesiyle süzülür.

APOD artık science.nasa.gov'da (image-article). api.nasa.gov APOD uç noktası KULLANILMAZ (v48'de bozuk: NASA logosu ve
"NASA Science" başlığı döndürüyor; 10 Kasım 2026 denemesinde 500 hata).
Kaynak: https://science.nasa.gov/wp-json/wp/v2/image-article?search=APOD  (yedek: https://science.nasa.gov/feed/?post_type=image-article)

Kural (YONTEM.md "Haftanın görüntüsü"):
  - Kredi satırında "Copyright" ya da kişisel lisans ("License", "Processing & License") geçerse ALINMAZ.
  - Kredi satırındaki HER öğe beyaz listede olmalı (ajans / kurum / görev ekibi). Kişi adı (ör. "Credit: Alejandro Sanz") ya da
    tanınmayan her öğe (yazılım adı dahil) adayı düşürür.
  - Satırda en az bir NASA çekirdek öğesi (NASA, JPL, GSFC …) olmalı; NASA görselleri ABD'de telif konusu değil (NASA Images and
    Media Usage Guidelines). Görev ekipleri ve yükleniciler (STScI, SSI, Caltech, SwRI …) yalnız NASA öğesiyle birlikte geçer.
    LISANS_DOGRULA listesi (ESA, ESO, NOIRLab, NSF, AURA, CSA, DLR, JAXA, Hubble, Webb …): aday kalır ama görselin KENDİ sayfasındaki
    lisans okunmadan kullanılmaz (ör. Cassini görselinde ESA yalnız görev ortağıdır, görselin kredisi NASA/JPL-Caltech/SSI).
İstek başlığında e-posta yok. Kullanım: python3 araclar/apod_gorsel.py [--fixture <json>] [--kaydet <json>] [--gun 14]
"""
import sys, re, json, html, urllib.request, urllib.parse, datetime

UA = 'urania-haber/1.0 (+https://github.com/dessn7-bit/urania)'
URL = 'https://science.nasa.gov/wp-json/wp/v2/image-article?' + urllib.parse.urlencode({'search': 'APOD', 'per_page': 20})
# NASA çekirdeği: bunlardan en az biri satırda OLMALI (NASA görseli; NASA Images and Media Usage Guidelines kapsamı)
NASA_CEKIRDEK = ['NASA', 'JPL', 'JPL-Caltech', 'GSFC', 'NASA Goddard', 'Goddard', 'MSFC', 'NASA Ames', 'JSC', 'NASA JSC', 'KSC',
                 'NASA Earth Observatory', 'NASA SDO', 'ISS Expedition Crew']
# NASA görev ekipleri ve yükleniciler: yalnız NASA çekirdeğiyle BİRLİKTE kabul (tek başına kamu malı sayılmaz)
KAMU = NASA_CEKIRDEK + ['STScI', 'SSI', 'Space Science Institute', 'JHUAPL', 'APL', 'SwRI', 'MSSS', 'Caltech', 'USGS', 'NOAA',
        'Cassini Imaging Team', 'Hubble Heritage Team', 'SDO', 'Swift', 'Chandra', 'CXC', 'SAO', 'Univ. Arizona',
        'University of Arizona', 'U. Arizona', 'ASU']
# NASA dışı kurumlar ve ortak görevler: aday kalır ama görselin KENDİ sayfasındaki lisans okunmadan kullanılmaz
LISANS_DOGRULA = ['ESA', 'ESO', 'NOIRLab', 'NSF', 'AURA', 'CSA', 'DLR', 'JAXA', 'FU Berlin', 'ESA/Webb', 'ESA/Hubble', 'SOHO',
                  'Rubin Observatory', 'Hubble', 'Webb']
YASAK = re.compile(r'copyright|licen[cs]e|processing|©', re.I)


def duz(s):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', str(s or ''))).split())


def kredi_satiri(icerik):
    """APOD sayfa metninden kredi satırı: 'Credit[ & Copyright][:] …' ile 'Authors & editors' arası (ilk geçiş).
    → (etiket, satır) ya da (None, None)"""
    t = duz(icerik)
    m = re.search(r'\b(Image Credit(?:\s*&\s*Copyright)?|Credit(?:\s*&\s*Copyright)?|Copyright)\s*:?\s*(.*?)\s*(?:Authors\s*&\s*editors|Explanation|$)', t)
    return (m.group(1), m.group(2).strip()) if m else (None, None)


def ogeler(satir):
    return [o.strip(' .') for o in re.split(r',|;|/|\band\b|&', satir) if o.strip(' .')]


def kredi_uygun(etiket, satir):
    """→ {'uygun': bool, 'neden': str, 'lisans_dogrula': [öğeler]}"""
    if not satir:
        return {'uygun': False, 'neden': 'kredi satırı yok', 'lisans_dogrula': []}
    if YASAK.search(etiket or '') or YASAK.search(satir):
        return {'uygun': False, 'neden': 'kredi satırında "Copyright", lisans ya da kişisel işleme ("Processing") notu var', 'lisans_dogrula': []}
    kamu = {k.lower() for k in KAMU}
    dogrula = {k.lower() for k in LISANS_DOGRULA}
    bayrak = []
    for o in ogeler(satir):
        k = o.lower()
        if k in kamu:
            continue
        if k in dogrula:
            bayrak.append(o)
            continue
        return {'uygun': False, 'neden': f'beyaz listede olmayan öğe: {o!r} (kişi adı ya da tanınmayan kurum)', 'lisans_dogrula': []}
    if not any(o.lower() in {k.lower() for k in NASA_CEKIRDEK} for o in ogeler(satir)):
        if bayrak:
            return {'uygun': True, 'neden': 'NASA öğesi yok; lisansı görselin kendi sayfasından doğrula: ' + ', '.join(bayrak), 'lisans_dogrula': bayrak}
        return {'uygun': False, 'neden': 'NASA öğesi yok: kurum ya da görev ekibi tek başına kamu malı sayılmaz', 'lisans_dogrula': []}
    return {'uygun': True, 'neden': 'bütün öğeler beyaz listede' + (' (lisansı görselin kendi sayfasından doğrula: ' + ', '.join(bayrak) + ')' if bayrak else ''), 'lisans_dogrula': bayrak}


def adaylar(kayitlar):
    ls = []
    for x in kayitlar:
        et, sat = kredi_satiri(x.get('content', {}).get('rendered', ''))
        k = kredi_uygun(et, sat)
        ls.append({'tarih': str(x.get('date', ''))[:10], 'baslik': duz(x.get('title', {}).get('rendered', '')), 'url': x.get('link'),
                   'kredi_etiketi': et, 'kredi': sat, **k})
    return ls


def main(argv):
    if '--fixture' in argv:
        kayitlar = json.load(open(argv[argv.index('--fixture') + 1], encoding='utf-8'))
    else:
        with urllib.request.urlopen(urllib.request.Request(URL, headers={'User-Agent': UA}), timeout=60) as r:
            kayitlar = json.loads(r.read())
        if '--kaydet' in argv:   # fixture küçük kalsın: yalnız gereken alanlar, içerik kredi çevresiyle sınırlı
            kucuk = []
            for x in kayitlar:
                t = duz(x.get('content', {}).get('rendered', ''))
                i = t.find('Credit') if 'Credit' in t else t.find('Copyright')
                kucuk.append({'date': x.get('date'), 'link': x.get('link'), 'title': {'rendered': x.get('title', {}).get('rendered', '')},
                              'content': {'rendered': t[max(0, i - 400):i + 400] if i >= 0 else ''}})
            json.dump(kucuk, open(argv[argv.index('--kaydet') + 1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    ls = adaylar(kayitlar)
    if '--json' in argv:
        print(json.dumps(ls, ensure_ascii=False, indent=1))
        return 0
    for a in ls:
        print(('UYGUN  ' if a['uygun'] else 'ALINMAZ') + f" {a['tarih']} {a['baslik'][:60]} | {a['kredi_etiketi']}: {a['kredi']} | {a['neden']}")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
