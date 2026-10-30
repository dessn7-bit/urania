# paralaks — kaynak tablosu (2026-10-30)

Uzaklıklar, ışık yılı, AB, madeni para uzaklıkları ve Gaia göreli hataları python3 ile yeniden hesaplandı ("hesap" satırları). Not: ESA'nın Gaia DR3 sayfası (cosmos.esa.int/web/gaia/dr3) izin isteği yanıtsız kaldığı için açılamadı; Gaia hassasiyeti Gaia Collaboration'ın (ESA görevi) A&A makalesinden alındı. SIMBAD robots.txt yüzünden açılamadı.

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Parsek: ıraklığın 1 yay saniyesi olduğu uzaklık | https://en.wikipedia.org/wiki/Stellar_parallax | "The parsec (3.26 light-years) is defined as the distance for which the annual parallax is 1 arcsecond." |
| Parsek tanımı (ikinci kaynak) | https://sci.esa.int/web/education/-/35616-stellar-distances | "The distance at which an object has a parallax of one arcsecond." |
| 1 pc = 648.000/π AB ≈ 206.265 AB (fizik.json pc, IAU 2015 B2) | https://arxiv.org/pdf/1510.06262 | fizik.json: pc = 3,085677581491367e16 m; hesap pc/au = 206.264,806 |
| hesap: 1 pc = 3,2616 ışık yılı | (python3, fizik.json pc ve ly) | 3,26156 |
| d (pc) = 1 / p (″) | https://lco.global/spacebook/parallax-and-distance-measurement | "The distance d is measured in parsecs and the parallax angle p is measured in arcseconds." |
| Proxima Centauri ıraklığı 768,0665 ± 0,0499 mas (Gaia DR3); 1,30197 pc; 4,2465 ışık yılı | https://en.wikipedia.org/wiki/Proxima_Centauri | "768.0665±0.0499 mas"; "4.2465 ± 0.0003 ly (1.30197 ± 0 pc)" |
| Proxima ıraklığı (ikinci kaynak) 0,7685 ± 0,0002″, en büyük ıraklıklı yıldız | https://en.wikipedia.org/wiki/Stellar_parallax | "has a parallax of 0.7685 ± 0.0002 arcsec." |
| Proxima 10,43–11,11 kadir | https://en.wikipedia.org/wiki/Proxima_Centauri | "Apparent magnitude (V) 10.43 – 11.11" |
| Proxima yalnız 27° K'nin güneyinden görülür | https://en.wikipedia.org/wiki/Proxima_Centauri | "Because of Proxima Centauri's southern declination, it can only be viewed south of latitude 27° N." |
| 61 Cygni A ıraklığı 285,9949 ± 0,0599 mas; 3,4966 pc; 11,404 ışık yılı | https://en.wikipedia.org/wiki/61_Cygni | "285.9949±0.0599 mas"; "11.404 ± 0.002 ly (3.4966 ± 0.0007 pc)" |
| 61 Cygni "kabul edilen" 287,18 mas (kaynaklar farklı) | https://en.wikipedia.org/wiki/61_Cygni | "close to the currently accepted value of 287.18 mas (yielding 11.36 light-years)" |
| 61 Cygni Gaia 0,28615″ (üçüncü değer; farklılık ekranda belirtildi) | https://arxiv.org/abs/2009.11913 | "61 Cygni, modern (Gaia): 0.28615 ± 0.00006 arcsec" |
| Bessel 1838: 313,6 ± 13,6 mas, ≈ 10,4 ışık yılı; heliometre, Fraunhofer; gözlemler 1837–1838 | https://en.wikipedia.org/wiki/61_Cygni | "313.6 ±13.6" mas … "about 10.4 light-years"; heliometer built by Joseph von Fraunhofer; observations in 1837 and 1838 |
| Bessel 1838 (ikinci kaynak) 0,314 ± 0,020″ | https://arxiv.org/abs/2009.11913 | "61 Cygni, Bessel (1838): 0.314 ± 0.020 arcsec" |
| Piazzi, 61 Cygni'nin büyük öz hareketi | https://en.wikipedia.org/wiki/61_Cygni | d17 dersindeki aktarım: "Giuseppe Piazzi … 61 Cygni'nin büyük bir öz hareketi olduğunu göstermişti" (Wikipedia, 61 Cygni) |
| 61 Cygni 5,20 ve 6,05 kadir | https://en.wikipedia.org/wiki/61_Cygni | "5.20 and 6.05, respectively" |
| hesap: Bessel 0,3136″ → 3,189 pc, 10,40 ışık yılı; bugünkü değerden ≈ %10 büyük açı | (python3) | 3,1888 pc; 10,400 ly; (313,6−286,0)/286,0 = %9,65 |
| Sirius ıraklığı 378,9 ± 1,4 mas; 2,639 pc; 8,61 ışık yılı; −1,46 kadir | https://en.wikipedia.org/wiki/Sirius | "378.9±1.4 mas"; "8.61 ± 0.03 ly (2.639 ± 0.010 pc)"; "−1.46" |
| Sirius 2,64 ± 0,01 pc (van Leeuwen 2007) | https://arxiv.org/html/2411.03267v1 | "The Sirius binary system is one of the closest binaries to Earth at only 2.64±0.01 pc [31]" |
| Vega ıraklığı 130,23 ± 0,36 mas; 7,68 pc; 25,04 ışık yılı | https://en.wikipedia.org/wiki/Vega | "130.23±0.36 mas"; "25.04 ± 0.07 ly (7.68 ± 0.02 pc)" |
| Vega 0,13023 ± 0,00036″ Hipparcos (van Leeuwen 2007) | https://arxiv.org/abs/2009.11913 | "Vega, modern (Hipparcos, van Leeuwen 2007): 0.13023 ± 0.00036 arcsec" |
| von Struve 1837 Vega 0,125 ± 0,055″; 1840'ta 0,261 ± 0,025″ | https://arxiv.org/abs/2009.11913 | "Vega, von Struve (1837): 0.125 ± 0.055 arcsec (tentative result)"; "(later, 1840): 0.261 ± 0.025 arcsec" |
| Gaia ıraklık hatası G<15: 0,02–0,03 mas; G=17: 0,07; G=20: 0,5; G=21: 1,3 mas | https://www.aanda.org/articles/aa/full_html/2021/05/aa39657-20/T3.html | Table 3 "Basic performance statistics for Gaia EDR3": 0.02–0.03 mas (G<15), 0.07 mas (G=17), 0.5 mas (G=20), 1.3 mas (G=21) |
| Gaia sınırı örneği 0,1 mas (seçilmiş örnek değer) → 10.000 pc, 32.616 ışık yılı; hata %20–30 | (python3) | 0,02/0,1 = 0,2; 0,03/0,1 = 0,3 |
| Yerden < 0,01″ çok zor, ~100 pc | https://lco.global/spacebook/parallax-and-distance-measurement | "Parallax angles of less than 0.01 arcsec are very difficult to measure from Earth" … "This limits Earth based telescopes to measuring the distances to stars about 1/0.01 or 100 parsecs away." |
| Yer sınırı (ikinci kaynak) | https://sci.esa.int/web/education/-/35616-stellar-distances | "Parallax angles smaller than about 0.01 arcsecond are very difficult to measure accurately from Earth." |
| 1 lira çapı 26,15 mm | https://en.wikipedia.org/wiki/Coins_of_Turkey | ₺1 Diameter "26.15" mm; introduced "1 January 2009" |
| 1 lira çapı (ikinci kaynak) | https://en.numista.com/6163 | "1 Lira" "2009-2022" Diameter "26.15 mm" |
| hesap: 1 lira Proxima açısıyla 7,02 km, 1″ ile 5,39 km, 61 Cyg 18,9 km, 0,01″ ile 539 km, 0,1 mas ile 53.938 km | (python3: 0,02615 m / (p·π/648000)) | 7,0226 · 5,3938 · 18,860 · 539,38 · 53.938 km |
| Gözün ayırma gücü ≈ 1′ | https://en.wikipedia.org/wiki/Naked_eye | "The angular resolution of the naked eye is about 1′; however, some people have sharper vision than that." |
| hesap: 7× dürbünle 60″/7 ≈ 8,6″ (d12 dersiyle aynı) ; Proxima'nın 11 katı | (python3) | 8,571″; 8,57/0,768 = 11,2 |
| Görüş: iyi yerlerde ~1″, kentte çok daha kötü | https://en.wikipedia.org/wiki/Astronomical_seeing | "A 1.0″ seeing is a good one for average astronomical sites." / "The seeing of an urban environment is usually much worse." |
| Elipsin basıklığı yıldızın yörünge eksenine uzaklığına bağlı (tutulum varsayımı notu) | https://en.wikipedia.org/wiki/Stellar_parallax | "The farther S is removed from Earth's orbital axis, the greater the eccentricity of the path of S." |
| hesap: AB cinsinden Proxima 268.551 AB, Vega 1.583.850 AB | (python3: d × 206.264,806) | 268.550,7 · 1.583.850,2 |
