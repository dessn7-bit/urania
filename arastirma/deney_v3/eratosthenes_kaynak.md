# eratosthenes — kaynak tablosu (2026-10-30)

Hesaplanan değerler (çevre, yüzde hata, WGS 84 meridyen yayları, gölge boyları) python3 ile yeniden hesaplandı; formül ve girdileri "hesap" satırlarında.

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Gölge açısı 7,2° = çemberin 1/50'si (Kleomedes'e göre) | https://en.wikipedia.org/wiki/Eratosthenes | "According to Cleomedes, Eratosthenes then measured the shadow's angle to be about 7.2 degrees" … "which is 1/50 of a full circle" |
| 7,2° = 1/50 (ikinci kaynak) | https://dictionary.obspm.fr/terms/eratosthenes-method/ | "the shadow is cast at an angle of 1/50 of 360°" "or 7.2°, from the vertical." |
| Syene–İskenderiye 5000 stadion | https://dictionary.obspm.fr/terms/eratosthenes-method/ | "The distance from Syene to Alexandria was 5,000 stadia," |
| 5000 stadion, bematistler | https://en.wikipedia.org/wiki/Eratosthenes | "The distance between Alexandria and Syene was reported to be about 5,000 stadia" "as measured by professional bematists." |
| Sonuç 250.000 stadion | https://dictionary.obspm.fr/terms/eratosthenes-method/ | "which when multiplied by 50 gives the measure for the Earth's circumference, 250,000 stadia." |
| 252.000 stadion (başka aktarım) | https://en.wikipedia.org/wiki/Earth%27s_circumference | "estimated that the meridian has a length of 252,000 stadia" |
| Yaz gündönümü öğlesi Syene'de gölge yok | https://en.wikipedia.org/wiki/Eratosthenes | "However, in Syene, rods cast no shadows, and the Sun's rays shone straight down into the city-center well." |
| Varsayım: aynı meridyende iki kent | https://en.wikipedia.org/wiki/Eratosthenes | "The simplified method works by considering two cities along the same meridian" |
| İç ters açılar | https://en.wikipedia.org/wiki/Eratosthenes | "reasoned using alternate interior angles that this angle represented the portion of Earth's curvature" |
| Syene dönencenin ~1° kuzeyinde, İskenderiye'nin 3° doğusunda; hatalar birbirini götürdü | https://en.wikipedia.org/wiki/Eratosthenes | "In fact Syene is 1° north of the Tropic and 3° east of Alexandria." / "two false assumptions which fortuitously cancelled each other out" |
| Hatalar kısmen birbirini götürdü (ikinci kaynak) | https://dictionary.obspm.fr/terms/eratosthenes-method/ | "But the errors tended to cancel each other out, so his estimate was relatively accurate." |
| Stadion 155–185 m, hata −%3 … +%15 | https://dictionary.obspm.fr/terms/eratosthenes-method/ | "The most likely reconstruction puts Eratosthenes' stadium in the range 155-185m," "implying an error of about 3% below or 15% above the true value." |
| Stadion 157,7 m (Firsov) | https://en.wikipedia.org/wiki/Earth%27s_circumference | "A value for the stadion of 157.7 metres has even been posited by L.V. Firsov" |
| Stadion 160 m Messene, 185 m Attika, 191 m Olimpiya, 210 m Ptolemaios | https://en.wikipedia.org/wiki/Eratosthenes | "160 m (520 ft) (Messenian), 177 m (581 ft) (Delphic), 180 m (590 ft) (Pan-Hellenic), 185 m (607 ft) (Attic), 191 m (627 ft) (Olympic) and 210 m (690 ft) (Ptolemaic)." |
| Olimpiya stadionu 176,4 m (öteki kaynakla çelişki: 191 m; ikisi de ekranda belirtildi) | https://en.wikipedia.org/wiki/Earth%27s_circumference | "Olympic stade" (176.4 m) … "this would imply a circumference of 44,100 km (an error of 10%)" |
| Kutuptan geçen çevre 40.007,863 km | https://en.wikipedia.org/wiki/Earth%27s_circumference | "Measured passing through the poles, the circumference is 40,007.863 km (24,859.734 mi)." |
| WGS 84: a = 6.378.137 m, 1/f = 298,257223563 | https://en.wikipedia.org/wiki/World_Geodetic_System | "equatorial radius a = 6378137 m at the equator" / "flattening f = 1⁄298.257223563" |
| hesap: 4 × meridyen yayı(0°–90°) = 40.007,863 km (iki kaynak tutarlı) | (python3, WGS 84) | 40007,8629 km |
| Ortalama yarıçap 6371,000 km (fizik.json R_dunya) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Volumetric mean radius (km) 6371.000" |
| hesap: 1° enlem ekvatorda 110,6 km, kutupta 111,7 km | (python3, WGS 84: M(φ)·π/180) | 110,574 km · 111,694 km |
| Ataşehir 40°59′00″K 29°07′40″D | https://en.wikipedia.org/wiki/Ata%C5%9Fehir | "40°59′00″N 29°07′40″E / 40.98333°N 29.12778°E" |
| Denizli 37°47′00″K 29°05′47″D | https://en.wikipedia.org/wiki/Denizli | "37°47′00″N 29°05′47″E" (37.78333°N 29.09639°E) |
| hesap: Ataşehir–Denizli meridyen yayı 355,27 km; Δφ = 3,2000°; çevre 39.968 km (%0,10 eksik) | (python3, WGS 84, Simpson) | 355,273 km; 355,27 × 360 / 3,2 = 39.968,1 |
| hesap: ekinoks öğlesi gölge açısı = enlem; 1 m sopa: Denizli 77,5 cm, Ataşehir 86,9 cm | (python3: 100·tan φ) | 77,52 · 86,88 cm |
| hesap: 0,1° yanılgı → Δ = 3,3°, çevre 38.757 km (%3,13 eksik); 1 m sopada ≈ 3 mm | (python3) | 38.757,1 km; 3,06 mm |
| Asvan 24°05′20″K 32°53′59″D | https://en.wikipedia.org/wiki/Aswan | "24°05′20″N 32°53′59″E / 24.08889°N 32.89972°E" |
| Eratosthenes, yaklaşık MÖ 240 | https://en.wikipedia.org/wiki/Aswan | "Around 240 BC, Greek polymath Eratosthenes used this information to calculate Earth's circumference." |
| İskenderiye 31°11′51″K 29°53′33″D | https://en.wikipedia.org/wiki/Alexandria | "31°11′51″N 29°53′33″E" (31.19750°N 29.89250°E) |
| hesap: Asvan–İskenderiye Δφ 7,1086°, meridyen yayı 787,74 km, çevre 39.893 km (%0,29 eksik) | (python3, WGS 84) | 787,737 km; 39.893,2 km |
| hesap: 5000 stadion × 160 / 185 / 155 m → 40.000 / 46.250 / 38.750 km; hata −%0,02 / +%15,6 / −%3,14 | (python3, gerçek 40.007,863 km) | −0,0197 · +15,60 · −3,144 % |
| Yöntem Kleomedes'in özetinden biliniyor, kitap kayıp | https://en.wikipedia.org/wiki/Eratosthenes | "According to Cleomedes, …" (d20 dersiyle aynı ifade: "Eratosthenes'in Dünya'yı ölçtüğü kitap kayıp; yöntemini … Kleomedes'in … özetinden biliyoruz") |
