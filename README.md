# Urania

Kişisel astrofizik defteri: telefona kurulan, çevrimdışı çalışan bir PWA.

- **Gökyüzü** — seçili konum ve an için tüm gök levhası (yıldızlar, takımyıldızlar, gezegenler, Ay evresi, dürbün hedefleri, etkin meteor radyantları), bu gecenin özeti, gezegenlerin en iyi saatleri, 7×50 dürbün hedefleri, IMO meteor takvimi ve yaklaşan olaylar (Ay evreleri, tutulmalar, karşı konumlar, gündönümleri, kavuşumlar: Ay–gezegen, gezegen–gezegen ve gezegen–parlak yıldız/küme yaklaşmaları 6,4° içinde, buradan en iyi görüş anıyla; JPL Horizons ve CycleCalcs ile karşılaştırıldı). Kırmızı ışık modu gece görüşünü korur.
- **Bu gecenin planı** — gecenin görülecekleri en iyi saatlerine göre sıralı: yükseklik, saatlik bulut tahmini ve Ay ışığı hesaba katılır; uydu geçişi, Algol ve örtme gibi saati belli olaylar kendi saatinde. Tek dokunuşla takvime.
- **Algol ve Ay örtmeleri** — Algol'ün buradan görülebilecek en sönük anları (AAVSO VSX efemerisi) ve Ay'ın parlak yıldızların, Ülker'in ve gezegenlerin önünden geçişleri (Hipparcos; IOTA-ES ve Skyfield/DE421 ile karşılaştırıldı).
- **Uydular** — ISS, Tiangong ve yeni fırlatılmış Starlink dizilerinin görünür geçişleri (CelesTrak OMM/JSON, SGP4); levhada ve "Gökyüzüne bak"ta.
- **Gökyüzüne bak** — telefonu gökyüzüne tut: yön algılayıcılarıyla o yöndeki yıldızlar, gezegenler ve hedefler; Bul (yön tarifiyle), Hizala, kamera arka planı. Manyetik sapma WMM-2025 ile düzeltilir.
- **Bulut tahmini** — gecenin saatlik bulut oranı ve en açık dönem, 7 günlük tahmin; Plan'da önümüzdeki 7 gecenin şeridi (iyi / idare eder / kötü ve nedeni) ([Open-Meteo](https://open-meteo.com/), CC BY 4.0).
- **Şu an gökyüzü** — EUMETSAT Meteosat uydu görüntüsü (gerçek renk, kızılötesi, bulut maskesi, yağış), konumun ortada, kıyı çizgisiyle; bulut maskesinden "şu an üstünde: açık / bulutlu" rozeti (EUMETView WMS, CC BY 4.0; görüntüler 20–30 dakika gecikmeli).
- **Tahmin güveni** — Open-Meteo Ensemble'da bu gecenin her saati için kaç senaryonun (ECMWF, ICON, GFS, GEM, UKMO; 161 senaryo) açık gök dediği ve modellerin tek tek tahmini.
- **Şeffaflık ve nem** — CAMS aerosol optik derinliğinden yıldızların sönükleşmesi (≈ 1,086 × AOD kadir), çiğ riski (BAA'nın yaklaşık kuralı), hissedilen sıcaklık, rüzgâr hamlesi, sis ve pus (WMO). Kp tahmini 8'e ulaşırsa kutup ışığı uyarısı (NOAA SWPC). Kaynak ve şartlar: `arastirma/hava_kaynak.md`.
- **Görünürlük (v45)** — her dürbün hedefinin ve plan maddesinin yanında "görünür / zor / görünmez (yaklaşık)"; dokununca gerekçe (gök parlaklığı, Ay'ın katkısı, yükseklik, gereken eşik). Gök parlaklığı Falchi ve ark. 2016 ışık kirliliği atlasının Türkiye penceresinden cihazda okunur (konum hiçbir yere gitmez; elle SQM girilebilir), Ay ışığı Krisciunas & Schaefer 1991 modeli, görme eşiği Crumey 2014 (7×50, iki göz, göz bebeği ayarlanabilir). "Bu gece dürbünle görebileceğin en sönük yıldız yaklaşık X kadir." Dürbün değişenleri: AAVSO Dürbün Programı yıldızları ve Mira için AAVSO VSX'ten son 7 günün görsel tahminlerinin ortancası (gözlemci bilgisi alınmaz). v46: açık kümelerde en parlak üyeler yolu (SIMBAD V, üyelik h_link), M31'de de Vaucouleurs 1958 eş-ışık profili (Crumey yöntemi), M42'de merkez yıldızları testi; veri eksikse "belirsiz". Defter'de "Model ve sen": her dürbün hedefi kaydında gördüm / zor gördüm / göremedim, kayıt anındaki tahmin ve girdileri, uyum kartı ve onaylı kişisel ayar. Kaynaklar ve denklemler: `arastirma/gorunurluk_kaynak.md`.
- **Defter** — gözlem defteri: ne, ne zaman, neyle, nasıl bir gökte; Ay evresi, yükseklik ve bulut otomatik eklenir; JSON yedek.
- **Deneyler** — kara deliğe yaklaşmak (olay ufku, zaman genişlemesi, gelgit), yörünge atışı (Newton'un topu), yıldızın hayatı (H-R diyagramı), ışığa yakın yolculuk (özel görelilik).
- **Dersler** — gökyüzünü okumaktan evrenin tarihine on bir kaynaklı ders; deftere notlar ve kendini sınama soruları. Dersler sesli dinlenebilir (cihazın Türkçe metin okuma sesi; motor Pinakes'ten, telefonda sınanmış kurallarla); semboller ve birimler Türkçe okunuşlarına çevrilir, istenirse dersten derse kesintisiz sürer. Okunan derslerin soruları ve sayıları Leitner kutularıyla tekrar kartı olur; kartlar sesli de çalışılabilir. Gökyüzü sekmesinde "Bu geceyi dinle", "Gökyüzüne bak"ta sesli yön tarifi.
- **Hesap** — uzaklık çevirici, kurtulma hızı, Schwarzschild yarıçapı, Kepler III, kadir, ıraklık, Wien, Stefan-Boltzmann.

## Veri ve kaynaklar

Her sabit ve tablo değeri bir kaynaktan gelir; ham araştırma dosyaları (alıntı + URL) `arastirma/` altında, uygulamanın okuduğu sıkı veri `veri/` altındadır ve `araclar/*.py` betikleriyle yeniden üretilir.

- Gök hesapları: [Astronomy Engine](https://github.com/cosinekitty/astronomy) (MIT), testlerde ABD Deniz Rasathanesi (USNO) değerleriyle karşılaştırılır; kavuşumlar JPL Horizons (6 olay) ve CycleCalcs (Kasım 2026 – Kasım 2027) ile (arastirma/kavusum_kaynak.md). Terim: TÜBA Türkçe Bilim Terimleri Sözlüğü.
- Konum: uygulamanın varsayılan yeri ilçe düzeyinde yuvarlanmıştır (İstanbul, 41,0° K, 29,1° D); telefonun GPS konumu ve elle girilen yer her zaman önceliklidir.
- Yıldız ve takımyıldız verisi: [d3-celestial](https://github.com/ofrohn/d3-celestial) (BSD-3).
- Meteor yağmurları: IMO Meteor Shower Calendar.
- Örtme yıldızları: Hipparcos ana kataloğu (ESA 1997, CDS I/239); görünürlük sınırı Occult'un 5 cm tablosu (Schaefer, Bulder ve Bourgeois 1992 modeli); ΔT: IERS Bulletin A. Algol: AAVSO VSX (JAAVSO CCD minimumlarıyla doğrulandı).
- Uydu parlaklığı: Heavens-Above'ın içsel parlaklıkları; tahmin Heavens-Above değerleriyle 0,1 kadir içinde.
- Uydu yörüngeleri: [CelesTrak](https://celestrak.org/) (2 saatte bir güncellenir; uygulama 12 saat önbellekler, hata alınca 2 saat bekler); SGP4: [satellite.js](https://github.com/shashwatak/satellite-js) 6.0.2 (MIT).
- Sabitler: NIST CODATA 2022, IAU 2012 B2 / 2015 B2–B3; gezegen verisi: NASA Planetary Fact Sheets.
- Hava kartları (v44): EUMETSAT Meteosat görüntüleri (EUMETView WMS; "Contains modified EUMETSAT Meteosat data", CC BY 4.0, Data Policy madde 6.3), Open-Meteo tahmin, ensemble ve hava kalitesi API'leri (CC BY 4.0), CAMS aerosol ("Generated using Copernicus Atmosphere Monitoring Service information"), NOAA SWPC Kp tahmini (kamu malı; NOAA onayı ima edilmez), GFZ Kp kesin değerleri (CC BY 4.0). Dış servise giden konum iki ondalığa yuvarlanır.
- Görünürlük (v45): yapay gök parlaklığı Falchi F. ve ark. (2016), The New World Atlas of Artificial Night Sky Brightness — veri seti GFZ Data Services doi:10.5880/GFZ.1.4.2016.001 (CC BY-NC 4.0; Türkiye penceresi 2′ hücre, `araclar/gok_parlakligi.py`, lisans ve atıf `veri/LICENSE-falchi-atlas.txt`), makale doi:10.1126/sciadv.1600377; Ay ışığı Krisciunas & Schaefer 1991 (PASP 103, 1033); görme eşiği Crumey 2014 (MNRAS 442, 2600); Rayleigh sönümlemesi Hayes & Latham 1975 (ApJ 197, 593); göz bebeği–yaş ve tipik sönümleme Schaefer 1990 (PASP 102, 212); kadir/yay sn² ↔ cd/m² dönüşümü Unihedron (SQM). Hedef boyutları OpenNGC (CC BY-SA 4.0, `veri/hedef_boyut.json`). Değişen yıldızlar: AAVSO Binocular Program listesi ve AAVSO VSX (yalnız vsx.aavso.org; AAVSO Data Usage Guidelines atfı uygulamada).
- Yazı tipleri: Spectral ve IBM Plex Sans (SIL OFL).

## Test

```
npm install
npx playwright test
```

Testler ağa çıkmaz: `playwright.config.js` yerel sunucu dışındaki her isteği kapalı bir vekile yollar; dış servislerin gerçek yanıtları `testler/veri/` altındadır (hava kartları: `testler/veri/hava/`, yenilemek için `bash araclar/hava_fixture.sh`).
