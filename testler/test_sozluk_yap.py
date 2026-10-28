"""araclar/sozluk_yap.py birim testleri. Çalıştır: python3 -m unittest testler/test_sozluk_yap.py"""
import os
import re
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'araclar'))
import sozluk_yap as S  # noqa: E402


def ders(i, sozluk, metin=''):
    return {'id': i, 'baslik': 'Ders ' + i, 'ozet': '', 'bolumler': [{'baslik': 'b', 'paragraflar': [metin]}], 'sozluk': sozluk}


class Birlestirme(unittest.TestCase):
    def setUp(self):
        self.uyarilar = []

    def yap(self, dersler, ek=None, uniteler=None):
        D = {'dersler': dersler}
        if uniteler:
            D['uniteler'] = uniteler
        return S.yap(D, ek or {}, uyari=self.uyarilar.append)

    def bul(self, sonuc, ad):
        ls = [t for t in sonuc['terimler'] if S.anahtar(t['terim']) == S.anahtar(ad)]
        self.assertEqual(len(ls), 1, ad)
        return ls[0]

    def test_buyuk_kucuk_ve_turkce_i_birlesir(self):
        s = self.yap([ders('d1', [{'terim': 'Iraklık', 'tanim': 'Birinci.'}]),
                      ders('d2', [{'terim': 'ıraklık', 'tanim': 'İkinci.'}]),
                      ders('d3', [{'terim': 'IRAKLIK', 'tanim': 'Üçüncü.'}]),
                      ders('d4', [{'terim': 'İnterferometri', 'tanim': 'A.'}]),
                      ders('d5', [{'terim': 'interferometri', 'tanim': 'B.'}])])
        self.assertEqual(len(s['terimler']), 2)
        t = self.bul(s, 'ıraklık')
        self.assertEqual(t['tanim'], 'Birinci.')          # farklı tanım: ilk dersinki
        self.assertEqual(t['tanimli'], ['d1', 'd2', 'd3'])
        self.assertEqual(self.bul(s, 'İNTERFEROMETRİ')['tanimli'], ['d4', 'd5'])
        # Iraklık ile İraklık aynı değil (I → ı, İ → i)
        self.assertNotEqual(S.anahtar('Iraklık'), S.anahtar('İraklık'))

    def test_ilk_ders_mufredat_sirasiyla(self):
        s = self.yap([ders('d1', [{'terim': 'Koma', 'tanim': 'd1 tanımı.'}]), ders('d9', [{'terim': 'koma', 'tanim': 'd9 tanımı.'}])],
                     uniteler=[{'id': 'u', 'dersler': ['d9', 'd1']}])
        t = self.bul(s, 'Koma')
        self.assertEqual(t['tanim'], 'd9 tanımı.')
        self.assertEqual(t['dersler'], ['d9', 'd1'])

    def test_parantez_icindeki_es_anlamli_ya_da_simge(self):
        s = self.yap([ders('d6', [{'terim': 'Atarca (pulsar)', 'tanim': 'Dönen nötron yıldızı.'}]),
                      ders('d16', [{'terim': 'atarca', 'tanim': 'Başka.'}]),
                      ders('d8', [{'terim': 'Kırmızıya kayma (z)', 'tanim': 'z tanımı.'}]),
                      ders('d2', [{'terim': 'Kırmızıya kayma', 'tanim': 'd2 tanımı.'}])])
        a = self.bul(s, 'Atarca')
        self.assertEqual(a['terim'], 'Atarca')
        self.assertEqual(a['esanlam'], ['pulsar'])
        self.assertEqual(a['tanimli'], ['d6', 'd16'])
        k = self.bul(s, 'kırmızıya kayma')
        self.assertEqual(k['terim'], 'Kırmızıya kayma (z)')   # simge adda kalır, eş anlamlı olmaz
        self.assertEqual(k['esanlam'], [])
        self.assertEqual(k['tanimli'], ['d8', 'd2'])

    def test_elle_secilen_tanim_oncelikli(self):
        ek = {'terimler': [{'terim': 'ANAKOL', 'tanim': 'Elle yazılmış tanım.', 'esanlam': ['ana kol'], 'kaynak': [{'ad': 'K', 'url': 'https://ornek.org/a', 'alinti': 'x'}]},
                           {'terim': 'Parsek', 'tanim': 'Yeni terim.', 'kaynak': [{'ad': 'K', 'url': 'https://ornek.org/p'}]}]}
        s = self.yap([ders('d5', [{'terim': 'Anakol', 'tanim': 'Ders tanımı.'}])], ek)
        t = self.bul(s, 'anakol')
        self.assertEqual(t['terim'], 'Anakol')              # ad dersteki gibi kalır
        self.assertEqual(t['tanim'], 'Elle yazılmış tanım.')
        self.assertEqual(t['esanlam'], ['ana kol'])
        self.assertEqual(t['kaynak'], [{'ad': 'K', 'url': 'https://ornek.org/a'}])   # alıntı çıktıya girmez
        self.assertEqual(self.bul(s, 'parsek')['tanimli'], [])

    def test_ayarlar_tanimi_degistirmez_eslesmeyen_uyarir(self):
        ek = {'ayarlar': [{'terim': 'hale', 'yalniz': ['d7'], 'haric': ['halen']}, {'terim': 'Yok böyle', 'esanlam': ['x']}]}
        s = self.yap([ders('d7', [{'terim': 'Hale', 'tanim': 'Galaksiyi saran bölge.'}], 'Hale yıldızları'),
                      ders('d5', [], 'Bu hale gelir, halen sürer.')], ek)
        t = self.bul(s, 'Hale')
        self.assertEqual(t['tanim'], 'Galaksiyi saran bölge.')
        self.assertEqual(t['yalniz'], ['d7'])
        self.assertEqual(t['dersler'], ['d7'])              # d5'teki "hale" sayılmaz
        self.assertTrue(any('Yok böyle' in u for u in self.uyarilar))

    def test_turkce_siralama_ve_tekil_kimlik(self):
        s = self.yap([ders('d1', [{'terim': t, 'tanim': 'x'} for t in ['Çift yıldız', 'Cüce', 'Işık yılı', 'İyon', 'Ufuk', 'Ülker', 'Kara delik', 'Karadelik', 'Ğ']])])
        ad = [t['terim'] for t in s['terimler']]
        self.assertEqual(ad, ['Cüce', 'Çift yıldız', 'Ğ', 'Işık yılı', 'İyon', 'Kara delik', 'Karadelik', 'Ufuk', 'Ülker'])
        k = [t['kimlik'] for t in s['terimler']]
        self.assertEqual(len(k), len(set(k)))
        self.assertIn('isik-yili', k)
        self.assertEqual(S.slug('Kara delik'), 'kara-delik')


class Desen(unittest.TestCase):
    def eslesen(self, terimler, metin):
        T = [{'terim': a, 'desen': [d for b in S.bicimler({'terim': a, 'esanlam': e}) for d in S.desenler(b, h)]} for a, e, h in terimler]
        ifade, sira = S.birlesik_ifade(T)
        out = []
        for m in ifade.finditer(S.kucuk(metin)):
            g = next(j for j in range(1, len(sira) + 1) if m.group(j) is not None)
            out.append((T[sira[g - 1]]['terim'], metin[m.start():m.end()]))
        return out

    def test_cekim_ekleri_ve_uzun_terim_once(self):
        r = self.eslesen([('Anakol', [], []), ('Kırmızı dev', [], []), ('Sefeid', [], []), ('Sefeid değişeni', [], []),
                          ('Beyaz cüce', [], []), ('Cüce', [], []), ('Kara delik', [], []), ('Güneş lekesi', [], []), ('Işık yılı', [], [])],
                         "Anakoldaki yıldız, kırmızı devler ve Sefeidlerin yanında Sefeid değişeni; beyaz cücenin cüceleri. "
                         "Kara deliği gördü; Güneş lekeleri; 10 ışık yılları ötede. IŞIK YILI")
        self.assertEqual(r, [('Anakol', 'Anakoldaki'), ('Kırmızı dev', 'kırmızı devler'), ('Sefeid', 'Sefeidlerin'),
                             ('Sefeid değişeni', 'Sefeid değişeni'), ('Beyaz cüce', 'beyaz cücenin'), ('Cüce', 'cüceleri'),
                             ('Kara delik', 'Kara deliği'), ('Güneş lekesi', 'Güneş lekeleri'), ('Işık yılı', 'ışık yılları'),
                             ('Işık yılı', 'IŞIK YILI')])

    def test_sozcuk_siniri_ve_haric(self):
        r = self.eslesen([('Evre', [], ['evren']), ('Nova', [], []), ('Kadir', [], [])],
                         "Süpernova bir nova değil; evren ile evreleri ayır. Kadir'in ölçeği, kadirsiz.")
        self.assertEqual(r, [('Nova', 'nova'), ('Evre', 'evreleri'), ('Kadir', "Kadir'in"), ('Kadir', 'kadirsiz')])

    def test_desen_js_ile_uyumlu(self):
        # JavaScript u bayrağında geçersiz kaçışlar (\- \' \ ) olmamalı
        for b in ["Dünya'ya yakın cisim", 'H-R diyagramı', 'Stefan–Boltzmann yasası', 'Tip Ia süpernova', 'Kırmızıya kayma (z)']:
            for d, _ in S.desenler(S.ayir(b)[0], []):
                self.assertIsNone(re.search(r"\\[-' ]", d), d)


if __name__ == '__main__':
    unittest.main()
