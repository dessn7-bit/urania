# gökyüzü verisi – kaynak ve lisans

İndirme: 2026-10-27, `git clone --depth 1 https://github.com/ofrohn/d3-celestial.git`, commit `7e720a3de062059d4c5400a379146a601d9010e0` (2022-07-05).

## Dosyalar

| dosya | öğe sayısı | sha256 |
|---|---|---|
| stars.6.json | 5044 | `0297b8fa3adfbce1dc26566f61c4abcc1df4f29c6a28729ca06b56d1c6d25602` |
| constellations.lines.json | 89 | `294f66bef5d5cf50b1e17f16d2efa1d97a15131612c68dd935adef6e7373e13c` |
| constellations.json | 89 | `ab4ae692027cbc042c0d6791a84456a65eb7c55656107fd00c58ff6e55d4d8b2` |
| messier.json | 110 | `b576a9ef2ff1e3e81af49779c76ceecdf1e2f88b7bd7d21736fa9d590c9cb2b4` |
| dsos.bright.json | 32 | `10a55eb314b74179cf0a457969a76177a609639efc364cc532b44d2e6ffffd45` |

Not: constellations.json ve constellations.lines.json 89 öğe içerir; Serpens (Ser) iki parça (Caput/Cauda) olarak iki kez geçer. Koordinatlar GeoJSON: boylam = RA, -180…180° (RA > 180° olanlar negatif; RA = boylam + 360). J2000.

## Bilinen veri hataları (bu oturumda SIMBAD ile karşılaştırıldı, ayrıntı: ../dogrulama_messier.md)

- dsos.bright.json: NGC 6121 (M4) koordinatı [83.82, -26.533] yanlış (doğrusu RA ≈ 245.90°, yani boylam ≈ -114.10).
- dsos.bright.json: NGC 884 RA 35.13° → SIMBAD 35.58° (0.25° fark).
- messier.json: M44 Dec +19.98° → SIMBAD +19.62° (0.36°); M27 kadir 8.1 → SEDS/OpenNGC 7.4.

## README'de belirtilen veri kaynakları (aynen alıntı, readme.md)

```
* `stars.6.json` Stars down to 6th magnitude \[1\]
* `dsos.bright.json` Some of the brightest showpiece DSOs of my own choosing
* `messier.json` Messier objects \[8\]
* `constellations.json` Constellation data  \[3\] 
* `constellations.lines.json` Constellation lines \[3\]

__Sources__

* \[1\] XHIP: An Extended Hipparcos Compilation; Anderson E., Francis C. (2012) [VizieR V/137D](http://cdsarc.u-strasbg.fr/viz-bin/Cat?V/137D)  
* \[1b\] _Star names & designations:_  
    HD-DM-GC-HR-HIP-Bayer-Flamsteed Cross Index (Kostjuk, 2002) [VizieR IV/27A](http://cdsarc.u-strasbg.fr/viz-bin/Cat?IV/27A)  
 FK5-SAO-HD-Common Name Cross Index (Smith 1996) [VizieR IV/22](http://cdsarc.u-strasbg.fr/viz-bin/Cat?IV/22)  
 General Catalogue of Variable Stars (Samus et.al. 2007-2013) [VizieR B/gcvs](http://cdsarc.u-strasbg.fr/viz-bin/Cat?B/gcvs)  
 Preliminary Version of the Third Catalogue of Nearby Stars (Gliese+ 1991) [VizieR V/70A](http://cdsarc.u-strasbg.fr/viz-bin/Cat?V/70A)  
* \[1c\] [Stellarium skycultures data](https://github.com/Stellarium/stellarium/tree/master/po/stellarium-skycultures)  for star name translations  
* \[2\] [Saguaro Astronomy Club Database version 8.1](http://www.saguaroastro.org/sac-downloads/)  
* \[3\] [IAU Constellation page](http://www.iau.org/public/themes/constellations/), name positions and some line modifications by me, names in other languages from [Wikipedia](https://wiki2.org/en/88_modern_constellations_in_different_languages)  
* \[4\] Catalogue of Constellation Boundary Data; Davenhall A.C., Leggett S.K. (1989) [VizieR VI/49](http://vizier.cfa.harvard.edu/viz-bin/Cat?VI/49)  
* \[5\] [Milky Way Outline Catalog](http://www.skymap.com/milkyway_cat.htm), Jose R. Vieira  
* \[6\] Lots of sources, see [blog](http://armchairastronautics.blogspot.com/p/milky-way-halo.html) [pages](http://armchairastronautics.blogspot.com/p/local-group.html) for complete list  
* \[7\] [Saguaro Astronomy Club Asterisms](http://saguaroastro.org/sac-downloads/) \(scroll down\)  
* \[8\] [Messier Objects with Data](http://messier.seds.org/data.html), H.Frommert/seds.org  
* \[9\] [Keplerian Elements for Approximate Positions of the Major Planets](https://ssd.jpl.nasa.gov/?planet_pos)  
* \[10\] [Stellarium skycultures data](https://github.com/Stellarium/stellarium/tree/master/skycultures/chinese) for traditional Chinese constellations  
  
All data converted to GeoJSON at J2000 epoch, positions converted from 0...24h right ascension to -180...180 degrees longitude as per GeoJSON requirements, so 0...12h becomes 0...180 degrees, and 12...24h becomes -180...0 degrees.  
```

data/readme.md'de messier.json için: "`messier.json` Messier objects"; dsos.bright.json için: "`dsos.bright.json`: hand selected".

## Lisans (LICENSE dosyası aynen; kopyası: LICENSE.d3-celestial.txt)

```
Copyright (c) 2015, Olaf Frohn
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

README son satırı: "Released under [BSD License](LICENSE)". Metin 3 maddeli BSD (BSD-3-Clause) lisansıdır; telif: "Copyright (c) 2015, Olaf Frohn". Dağıtımda bu telif notu ve lisans metni korunmalı.

Ek uyarı: veri dosyalarının kendi alt kaynakları (XHIP/VizieR, SAC, SEDS, IAU, Wikipedia) README'de listeleniyor; bu alt kaynakların lisans koşullarını ayrıca araştırmadım (askıda).
