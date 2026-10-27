# Urania

Kişisel astrofizik defteri: telefona kurulan, çevrimdışı çalışan bir PWA.

- **Gökyüzü** — seçili konum ve an için tüm gök levhası (yıldızlar, takımyıldızlar, gezegenler, Ay evresi, dürbün hedefleri, etkin meteor radyantları), bu gecenin özeti, gezegenlerin en iyi saatleri, 7×50 dürbün hedefleri, IMO meteor takvimi ve yaklaşan olaylar (Ay evreleri, tutulmalar, karşı konumlar, gündönümleri). Kırmızı ışık modu gece görüşünü korur.
- **Deneyler** — kara deliğe yaklaşmak (olay ufku, zaman genişlemesi, gelgit), yörünge atışı (Newton'un topu), yıldızın hayatı (H-R diyagramı), ışığa yakın yolculuk (özel görelilik).
- **Dersler** — gökyüzünü okumaktan evrenin tarihine sekiz kaynaklı ders; deftere notlar ve kendini sınama soruları.
- **Hesap** — uzaklık çevirici, kurtulma hızı, Schwarzschild yarıçapı, Kepler III, kadir, ıraklık, Wien, Stefan-Boltzmann.

## Veri ve kaynaklar

Her sabit ve tablo değeri bir kaynaktan gelir; ham araştırma dosyaları (alıntı + URL) `arastirma/` altında, uygulamanın okuduğu sıkı veri `veri/` altındadır ve `araclar/*.py` betikleriyle yeniden üretilir.

- Gök hesapları: [Astronomy Engine](https://github.com/cosinekitty/astronomy) (MIT), testlerde ABD Deniz Rasathanesi (USNO) değerleriyle karşılaştırılır.
- Yıldız ve takımyıldız verisi: [d3-celestial](https://github.com/ofrohn/d3-celestial) (BSD-3).
- Meteor yağmurları: IMO Meteor Shower Calendar.
- Sabitler: NIST CODATA 2022, IAU 2012 B2 / 2015 B2–B3; gezegen verisi: NASA Planetary Fact Sheets.
- Yazı tipleri: Spectral ve IBM Plex Sans (SIL OFL).

## Test

```
npm install
npx playwright test
```
