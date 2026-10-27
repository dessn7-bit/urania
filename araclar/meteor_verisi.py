"""IMO takvim çıkarımlarından (arastirma/meteor_20xx.json) veri/meteor.json'u üretir.
Zirve anı: IMO Tablo 5'teki Güneş boylamından Astronomy Engine ile hesaplanan an
(araştırma dosyasında IMO'nun verdiği saatle karşılaştırılmış). Türkçe adlar
TÜBİTAK Ulusal Gözlemevi'nin kullandığı biçimde: takımyıldızın Türkçe adı."""
import json, os, glob
K = os.path.join(os.path.dirname(__file__), '..')
TR = {'QUA': 'Quadrantid (Dörtlük)', 'LYR': 'Lyrid (Çalgı)', 'ETA': 'Eta Aquariid (Eta Kova)', 'SDA': 'Güney Delta Aquariid (Delta Kova)',
      'CAP': 'Alfa Capricornid (Oğlak)', 'PER': 'Perseid (Kahraman)', 'DRA': 'Draconid (Ejderha)', 'ORI': 'Orionid (Avcı)',
      'STA': 'Güney Taurid (Boğa)', 'NTA': 'Kuzey Taurid (Boğa)', 'LEO': 'Leonid (Aslan)', 'GEM': 'Geminid (İkizler)', 'URS': 'Ursid (Küçük Ayı)'}
ls, kaynaklar = [], []
for f in sorted(glob.glob(os.path.join(K, 'arastirma/meteor_20*.json'))):
    d = json.load(open(f, encoding='utf-8'))
    kaynaklar += d['kaynaklar'][:1]
    for y in d['yagmurlar']:
        bas, bit = [s.strip() for s in y['aktivite'].split('/')]
        z = y.get('bagimsiz_kontrol_astronomy_engine', {}).get('hesaplanan_an_UT') or (y['maksimum_tarih'] + 'T12:00Z')
        not_ = ' '.join(y.get('ay_kosulu_imo') or [])
        ls.append({'ad': TR.get(y['kod'], y['ad_en']), 'kod': y['kod'], 'baslangic': bas, 'bitis': bit,
                   'zirve_utc': z.replace('Z', ':00Z') if len(z) == 17 else z, 'zhr': y.get('ZHR'),
                   'radyant_ra': y['radyant_maksimumda']['ra_deg'], 'radyant_dec': y['radyant_maksimumda']['dec_deg'],
                   'hiz': y.get('hiz_km_s'), 'kaynak_url': y['kaynak']['url']})
# aynı yağmur aynı zirveyle iki dosyada varsa tekilleştir
gor, tek = set(), []
for m in sorted(ls, key=lambda m: m['zirve_utc']):
    k = (m['kod'], m['zirve_utc'][:10])
    if k in gor: continue
    gor.add(k); tek.append(m)
out = {'kaynak': 'IMO Meteor Shower Calendar ' + ', '.join(sorted({os.path.basename(f)[7:11] for f in glob.glob(os.path.join(K, 'arastirma/meteor_20*.json'))})),
       'kaynak_url': kaynaklar[0]['url'], 'yagmurlar': tek}
json.dump(out, open(os.path.join(K, 'veri/meteor.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(tek), 'yağmur;', out['kaynak'])
