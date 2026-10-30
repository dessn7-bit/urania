# ortme (Örten çift yıldız) — kaynak tablosu

Erişim: 2026-10-30. Sayfalar curl ile indirildi (arXiv PDF'leri pdftotext ile okundu). "Hesap" yazan satırlar kaynak değil; kaynaktaki sayılardan python3 ile yeniden hesaplandı.

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Algol A yarıçapı 2,73 R☉ | https://arxiv.org/abs/1205.0754 | Baron vd. 2012, Tablo 4 "RA (R⊙) … 2.73 ± 0.20" |
| Algol B yarıçapı 3,48 R☉ | https://arxiv.org/abs/1205.0754 | Tablo 4 "RB (R⊙) … 3.48 ± 0.28" |
| İç yörünge eğikliği 98,70° (ekranda 180 − 98,70 = 81,3°) | https://arxiv.org/abs/1205.0754 | Tablo 6 "i (deg) 98.6 [Zavala] 98.70 ± 0.65" |
| Yıldızlar arası 0,0620 AB | https://en.wikipedia.org/wiki/Algol | "axis_unitless = .0620 au … .00215/.0347"; Baron Tablo 6 "a (mas) 2.15 ± 0.05", ıraklık 34,7 mas |
| a = 13,33 R☉ (hesap) | — | 0,0620 × 149.597.870.700 / 695.700.000 = 13,33 (au ve R☉ fizik.json'dan) |
| Algol A 13.000 K, Algol B 4.500 K | https://arxiv.org/abs/1005.0626 | Zavala vd. 2010, Tablo 1 "Teff (K)a 13000 4500 7500", a: Richards (1993) |
| Aynı sıcaklıklar Wikipedia'da | https://en.wikipedia.org/wiki/Algol | infobox "temperature = 13,000 … 4,500" (ref. Zavala) |
| Farklı değerler: 12.550 K, 4.900 K; 2,87 ve 3,43 R☉; a = 13,65 R☉ | https://arxiv.org/abs/1506.01254 | Kolbas vd. 2015 özet "TA = 12 550 ± 120 K, TB = 4900 ± 300 K"; Tablo 5 "Radius 2.87 ± 0.04 3.43 ± 0.01"; metin "aA−B = 13.65 ± 0.07 R⊙" |
| Richards 1993 yarıçapları 2,90 / 3,5 R☉ (karşılaştırma) | https://arxiv.org/abs/1205.0754 | Tablo 4 "Richards et al. (1993) 2.90 ± 0.04 … 3.5 ± 0.1" |
| Dönem 2,867343 gün | https://vsx.aavso.org/index.php?view=detail.top&oid=26202 | "Period 2.867343 d" |
| Yörünge dönemi 2,867328 gün (Baron/Zavala; kullanılmadı, fark ~1 s) | https://arxiv.org/abs/1205.0754 | Tablo 6 "P (days) 2.867328" |
| 2 gün 20,8 saat (hesap) | — | 2,867343 × 24 = 68,82 saat = 2 gün 20,8 saat |
| GCVS: en parlak 2,12, Min I 3,39 V | http://www.sai.msu.su/gcvs/cgi-bin/search.cgi?search=bet+Per | "EA/SD \| 2.12 \| 3.39 \| \|V" |
| VSX: 2,09 – 3,30 V | https://vsx.aavso.org/index.php?view=detail.top&oid=26202 | "Mag. range 2.09 - 3.30 V" |
| İkincil minimum 2,15 V | https://vsx.aavso.org/index.php?view=detail.top&oid=26202 | "Otero, Sebastian Alberto Min II= 2.15 V." |
| Tutulma süresi %14, 9,63 saat | https://vsx.aavso.org/index.php?view=detail.top&oid=26202 | "Rise/eclipse dur. 14% (9.63 h)"; GCVS "M-m/D 14" |
| "yaklaşık 10 saat" tutulma, 2,1 → 3,4 | https://en.wikipedia.org/wiki/Algol | "dips to 3.4 every 2.86 days during the roughly 10-hour-long partial eclipses" |
| İkincil tutulma sığ (yalnız fotoelektrik) | https://en.wikipedia.org/wiki/Algol | "The secondary eclipse … is very shallow and can only be detected photoelectrically." |
| Yansıma etkisi (Stebbins 1910) | https://en.wikipedia.org/wiki/Algol | "The light curve revealed the second minimum and the reflection effect between the two stars." |
| B, A'nın çekimiyle bozulmuş | https://en.wikipedia.org/wiki/Algol | "a much less massive K0 subgiant, which is highly distorted by the more massive star" |
| Algol C, çiftten ΔV = 2,92 kadir sönük | https://arxiv.org/abs/1005.0626 | "magnitude differences in the V (∆V = 2.92) … between the eclipsing pair and component C … Pan et al. (1993)" |
| C katkısı %6,8 (hesap) | — | 10^(−0,4·2,92) = 0,0679 |
| A–B arası ΔV = 3,92 (model 3,75 veriyor; karşılaştırma için) | https://arxiv.org/abs/1005.0626 | "Richards et al. (1988) in the V band (∆V = 3.92)" |
| Model: birincil 1,40 kadir (%72,5), ikincil 0,015 (%1,4), süre 10,1 saat; C eklenince 1,23 kadir (hesap) | — | python3, düzgün disk + Planck 550 nm; tarayıcıda aynı değerler |
| Tutulma sınırı 62,2° (hesap) | — | acos(6,21 / 13,33) = 62,24° |
| Sıyıran örnek: 66° → 0,074 kadir, 5,5 saat (hesap) | — | python3 |
| Eşit yıldızlar: R☉, 5.772 K, GM☉ | https://www.iau.org/common/Uploaded%20files/IAUGA2015-Resolution-B3-recommended-nominal-conversion.pdf | fizik.json üzerinden (IAU 2015 B3) |
| Eşit yıldız dönemi 2,590 gün, derinlik 0,75 kadir = 2,5·log₁₀2 (hesap) | — | P = 2π√(a³/(2GM☉)), a = 10 R☉ |
| Algol, i = 90° → 3,79 kadir; T2 = 13.000 K → iki çukur 0,36 kadir; P = 10 gün → 35,3 saat (hesap) | — | tarayıcı ölçümü, python ile aynı |
| Planck yasası, h, c, k | https://physics.nist.gov/cuu/Constants/ | fizik.json (CODATA 2022) |
| BAA: Almach (γ And) 2,1; tutulma ortasında ε Cas 3,3, α Tri 3,4 | https://britastro.org/2021/observers-challenge-the-eclipses-of-algol | "Algol is of magnitude +2.1, comparable … with gamma Andromedae (mag +2.1) … Around mid-eclipse … epsilon Cassiopeiae (mag +3.3) and alpha Trianguli (mag +3.4)" |
| Algol İstanbul'da neredeyse başucundan geçer | (Ders d15) dik açıklık +40,96° (veri/algol.json, Hipparcos) ve enlem 41,0° | veri/algol.json "dec": 40.955648 |
| Torres vd. 2010: 95 sistemin 94'ü örten çift | https://arxiv.org/abs/0908.2624 | Ders d15 ile aynı; başlık "Accurate masses and radii of normal stars: modern results and applications" (arXiv'de doğrulandı) |
| "Yaklaşan olaylar" listesi Algol'ün sıradaki iki görülebilir minimumunu verir | gozlem.js (algolSatirlar, satır 607–613) | ".slice(0, 2)" ve "Algol en sönük" satırı, Gökyüzü sekmesinde "Yaklaşan olaylar" bölümü |
| Montanari/Goodricke vb. tarih yok | — | deneyde tarih kullanılmadı |
