# Urania

Kişisel astrofizik defteri: telefona kurulan, çevrimdışı çalışan bir PWA.

- **Gökyüzü** — seçili konum ve an için tüm gök levhası (yıldızlar, takımyıldızlar, gezegenler, Ay evresi, dürbün hedefleri, etkin meteor radyantları), bu gecenin özeti, gezegenlerin en iyi saatleri, 7×50 dürbün hedefleri, IMO meteor takvimi ve yaklaşan olaylar (Ay evreleri, tutulmalar, karşı konumlar, gündönümleri). Kırmızı ışık modu gece görüşünü korur.
- **Bu gecenin planı** — gecenin görülecekleri en iyi saatlerine göre sıralı: yükseklik, saatlik bulut tahmini ve Ay ışığı hesaba katılır; uydu geçişi, Algol ve örtme gibi saati belli olaylar kendi saatinde. Tek dokunuşla takvime.
- **Algol ve Ay örtmeleri** — Algol'ün buradan görülebilecek en sönük anları (AAVSO VSX efemerisi) ve Ay'ın parlak yıldızların, Ülker'in ve gezegenlerin önünden geçişleri (Hipparcos; IOTA-ES ve Skyfield/DE421 ile karşılaştırıldı).
- **Uydular** — ISS, Tiangong ve yeni fırlatılmış Starlink dizilerinin görünür geçişleri (CelesTrak OMM/JSON, SGP4); levhada ve "Gökyüzüne bak"ta.
- **Gökyüzüne bak** — telefonu gökyüzüne tut: yön algılayıcılarıyla o yöndeki yıldızlar, gezegenler ve hedefler; Bul (yön tarifiyle), Hizala, kamera arka planı. Manyetik sapma WMM-2025 ile düzeltilir.
- **Bulut tahmini** — gecenin saatlik bulut oranı ve en açık dönem ([Open-Meteo](https://open-meteo.com/), CC BY 4.0).
- **Defter** — gözlem defteri: ne, ne zaman, neyle, nasıl bir gökte; Ay evresi, yükseklik ve bulut otomatik eklenir; JSON yedek.
- **Deneyler** — kara deliğe yaklaşmak (olay ufku, zaman genişlemesi, gelgit), yörünge atışı (Newton'un topu), yıldızın hayatı (H-R diyagramı), ışığa yakın yolculuk (özel görelilik).
- **Dersler** — gökyüzünü okumaktan evrenin tarihine on bir kaynaklı ders; deftere notlar ve kendini sınama soruları. Dersler sesli dinlenebilir (cihazın Türkçe metin okuma sesi); okunan derslerin soruları ve sayıları Leitner kutularıyla tekrar kartı olur.
- **Hesap** — uzaklık çevirici, kurtulma hızı, Schwarzschild yarıçapı, Kepler III, kadir, ıraklık, Wien, Stefan-Boltzmann.

## Veri ve kaynaklar

Her sabit ve tablo değeri bir kaynaktan gelir; ham araştırma dosyaları (alıntı + URL) `arastirma/` altında, uygulamanın okuduğu sıkı veri `veri/` altındadır ve `araclar/*.py` betikleriyle yeniden üretilir.

- Gök hesapları: [Astronomy Engine](https://github.com/cosinekitty/astronomy) (MIT), testlerde ABD Deniz Rasathanesi (USNO) değerleriyle karşılaştırılır.
- Yıldız ve takımyıldız verisi: [d3-celestial](https://github.com/ofrohn/d3-celestial) (BSD-3).
- Meteor yağmurları: IMO Meteor Shower Calendar.
- Örtme yıldızları: Hipparcos ana kataloğu (ESA 1997, CDS I/239); Algol: AAVSO VSX.
- Uydu yörüngeleri: [CelesTrak](https://celestrak.org/) (2 saatte bir güncellenir; uygulama 12 saat önbellekler, hata alınca 2 saat bekler); SGP4: [satellite.js](https://github.com/shashwatak/satellite-js) 6.0.2 (MIT).
- Sabitler: NIST CODATA 2022, IAU 2012 B2 / 2015 B2–B3; gezegen verisi: NASA Planetary Fact Sheets.
- Yazı tipleri: Spectral ve IBM Plex Sans (SIL OFL).

## Test

```
npm install
npx playwright test
```
