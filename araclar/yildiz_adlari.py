"""Yıldız özel adı kuralı: gok_verisi.py (veri/yildizlar.json) ile ortme_verisi.py (veri/ortme_yildiz.json)
ortak kullanır; iki listede aynı yıldız farklı adla çıkmasın diye kural ve takma ad listesi yalnız burada durur.
Ad HIP ile eşlenir: önce IAU WGSN kataloğu (aynı HIP'te birden çok ad varsa en eski kabul edilen, ör. ε Boo: Izar);
WGSN'de adı olmayan yıldızda d3-celestial adı yalnız şu koşullarla kalır: WGSN o adı başka bir HIP'e vermemiş,
ad d3-celestial'da tek yıldızda geçiyor ve TAKMA_AD listesinde değil."""
import json, os
from collections import Counter
K = os.path.join(os.path.dirname(__file__), '..')

# WGSN adı olmayan takma/yanlış adlar (d3-celestial'dan gelir): Trapezium (küme takma adı), Becklin's Star
# (BN nesnesinin adı, θ1 Ori C'ye yanlış bağlanmış), The Ruby Star (119 Tau), Revenant of the Swan (P Cyg),
# Double Double (ε Lyr; WGSN: Pongaponga), Dsiban (ψ1 Dra B'de; WGSN Dziban ψ1 Dra A, HIP 86614)
# Ad değil tanım olanlar da çıkarılır: "Bidelman's Helium Variable Star", "Polaris Galacticus Borealis",
# "Variabilis Coronae" (Latince "Taç'ın değişeni"), "Persian".
TAKMA_AD = {"Trapezium", "Becklin's Star", "The Ruby Star", "Revenant of the Swan", "Double Double", "Dsiban",
            "Bidelman's Helium Variable Star", "Polaris Galacticus Borealis", "Variabilis Coronae", "Persian"}


def ad_bulucu(names):
    """names: d3-celestial starnames.json (HIP → {name, desig, c}). Döner: hip → özel ad ('' = adsız)."""
    wgsn = json.load(open(os.path.join(K, 'arastirma/iau_wgsn_yildiz_adlari.json'), encoding='utf-8'))['adlar']
    hip_ad, ad_hip = {}, {}
    for r in sorted(wgsn, key=lambda r: r['date']):
        if r['hip']: hip_ad.setdefault(r['hip'], r['name'])
        ad_hip[r['name']] = r['hip']
    say = Counter(v['name'] for v in names.values() if v.get('name'))

    def ad(hip):
        if hip in hip_ad: return hip_ad[hip]
        n = names.get(str(hip), {}).get('name', '')
        if not n or n in TAKMA_AD or say[n] > 1: return ''
        if n in ad_hip and ad_hip[n] not in (None, hip): return ''   # WGSN bu adı başka yıldıza vermiş
        return n
    return ad
