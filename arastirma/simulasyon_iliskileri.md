# Simülasyon ilişkileri (dersler 5–8 için) — sürüm 2

Sürüm 2 (2026-10-27): OpenStax'in YZ'ye alınma yasağına saygı için bu dosyada OpenStax kullanılmadı. Kaynaklar NASA, ESO, ESA, hakemli makaleler (arXiv), Wikipedia ve E. Mamajek'in tablosu. Her alıntı bu oturumda sayfa çekilerek okundu ve İngilizce aslıyla aynen verildi. Tabloların makine okunur kopyası: `simulasyon_tablolari.json`.

## (a) Kütle–ışıma gücü ilişkisi

Wikipedia, Mass–luminosity relation — https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation
> "where L☉ and M☉ are the luminosity and mass of the Sun and 1 < a < 6. The value a = 3.5 is commonly used for main-sequence stars. This equation and the usual value of a = 3.5 only applies to main-sequence stars with masses 2M☉ < M < 55M☉ and does not apply to red giants or white dwarfs."

Aynı sayfadaki parçalı ilişki (formül görüntüsünün metni):
> L/L☉ ≈ 0.23 (M/M☉)^2.3 (M < 0.43M☉); L/L☉ = (M/M☉)^4 (0.43M☉ < M < 2M☉); L/L☉ ≈ 1.4 (M/M☉)^3.5 (2M☉ < M < 55M☉); L/L☉ ≈ 32000 M/M☉ (M > 55M☉)

Gözlemsel karşılaştırma (Mamajek tablosu, aşağıda): A0V 2,18 M☉ için log L = 1,58, yani L ≈ 38 L☉. Parçalı ilişki 1,4 × 2,18^3,5 ≈ 21 L☉ verir (hesap bu oturumda yapıldı). Simülasyonda gerçek tablo değerleri arasında enterpolasyon, tek bir kuvvet yasasından daha sadıktır.

## (b) Anakol ömrü – kütle

Wikipedia, Main sequence — https://en.wikipedia.org/wiki/Main_sequence
> "τ_MS ≈ 10^10 years [M/M☉][L☉/L] = 10^10 years [M/M☉]^-2.5"

Bu ilişki Mamajek tablosunun kütle ve ışıma gücü değerlerine uygulandı (sonuçlar `simulasyon_tablolari.json` → `anakol_omurleri`). Örnekler (hesap): O5V 1,24×10^6 yıl; A0V 5,73×10^8; G2V 9,77×10^9; K0V 1,93×10^10; M0V 8,24×10^10; M3V 2,28×10^11 yıl. Bu bir yaklaşımdır: yıldızın tüm kütlesinin yakıt olduğu ve ışıma gücünün sabit kaldığı varsayılır.

## (c) Güneş'in anakol ömrü

- Wikipedia, Main sequence (yukarıdaki URL): "The Sun has been a main-sequence star for about 4.5 billion years and it will start to expand rapidly towards a red giant in 6.5 billion years, for a total main-sequence lifetime of roughly 10^10 years."
- NASA, Sun: Facts — https://science.nasa.gov/sun/facts/ : "Scientists predict the Sun is a little less than halfway through its lifetime and will last another 5 billion years or so before it becomes a white dwarf."
- Not: Wikipedia ve NASA'nın kalan süreleri farklı (6,5 ve ~5 milyar yıl); toplam ~10 milyar yılda ikisi de uyumlu.

## (d) Chandrasekhar sınırı

- NASA Imagine the Universe, White Dwarfs (WebFetch ile okundu) — https://imagine.gsfc.nasa.gov/science/objects/dwarfs2.html : "Subrahmanyan Chandrasekhar discovered this limit to be 1.4 times the mass of the Sun."
- Wikipedia, Chandrasekhar limit — https://en.wikipedia.org/wiki/Chandrasekhar_limit : "For small stars this ratio is around 1/2 and the limit is about 1.44 M☉."
- Wikipedia, Stellar evolution — https://en.wikipedia.org/wiki/Stellar_evolution : "the Chandrasekhar limit, which is 1.4 M☉ for a white dwarf composed chiefly of carbon, oxygen, neon, and/or magnesium"

Simülasyon için: 1,4 M☉ (yuvarlak), istenirse 1,44 M☉.

## (e) Sgr A*: kütle ve uzaklık (birincil kaynak)

- GRAVITY Collaboration, A&A (2022), arXiv:2112.07478 — https://arxiv.org/abs/2112.07478 : "Our data are in excellent agreement with general relativity orbits around a single central point mass, M = 4.30 x 10^6 M_sun with a precision of about +-0.25%."
- ESO eso2119 (2021) — https://www.eso.org/public/news/eso2119/ : "...a black hole of mass 4.30 million times that of the Sun. This is the most precise estimate of the mass of the Milky Way's central black hole to date. The researchers also managed to fine-tune the distance to Sagittarius A*, finding it to be 27 000 light-years away."
- GRAVITY Collaboration (2019), arXiv:1904.05721 — https://arxiv.org/abs/1904.05721 : "R0 = 8178 +- 13(stat.) +- 22(sys.) pc" (≈ 26.670 ışık yılı; 1 pc = 3,2616 ışık yılı ile bu oturumda hesaplandı)
- ESO eso2208-eht-mw (2022) — https://www.eso.org/public/news/eso2208-eht-mw/ : "...the black hole, which is four million times more massive than our Sun." / "Because the black hole is about 27 000 light-years away from Earth..."
- Nobel 2020 basın bülteni — https://www.nobelprize.org/prizes/physics/2020/press-release/ : "Around four million solar masses"
- Not: Wikipedia Milky Way bilgi kutusu 4,100 (± 0,034) milyon M☉ verir (farklı bir ölçüm); birincil kaynak olarak GRAVITY 2021 seçildi.

Simülasyon için: M = 4,30×10^6 M☉, d = 27.000 ışık yılı (ya da 8178 pc).

## (f) Tayf sınıflarının yüzey sıcaklıkları (O–M)

Wikipedia, Stellar classification — https://en.wikipedia.org/wiki/Stellar_classification (Harvard sınıflaması tablosu):

| Sınıf | Sıcaklık |
|---|---|
| O | ≥ 33,000 K |
| B | 10,000–33,000 K |
| A | 7,300–10,000 K |
| F | 6,000–7,300 K |
| G | 5,300–6,000 K |
| K | 3,900–5,300 K |
| M | 2,300–3,900 K |

İkinci kaynak (alt sınıf ortalamaları, Mamajek): O5V 41400 K, B0V 31400, A0V 9700, F0V 7220, G0V 5930, G2V 5770, K0V 5270, M0V 3850, M3V 3430 K — https://www.pas.rochester.edu/~emamajek/EEM_dwarf_UBVIJHK_colors_Teff.txt

## Ek tablolar ve referans değerler

`simulasyon_tablolari.json` içinde:
- `anakol_ozellikleri`: Mamajek tablosu (sürüm 2022.04.16); kütle, sıcaklık, yarıçap aynen; ışıma gücü 10^logL hesabı. Tablonun kendi notu: "The adopted mean masses a for a given dwarf subtype are tentative."
- `anakol_omurleri`: (b)'deki ilişki.
- `nihai_son`: Wikipedia (Stellar evolution, White dwarf) ve NASA (Types of Black Holes) alıntılarıyla; sınır anlaşmazlıkları `not` alanında.
- `referans_degerler`: M87* (arXiv:1906.11238, ESO eso1907), Proxima Centauri (NASA, ESO eso1629), R0 (GRAVITY 2019, ESO eso2119), Sgr A* (GRAVITY 2021), Andromeda (NASA).
