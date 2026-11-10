# gezegenyolu — kaynak tablosu (erişim 10 Kasım 2026)

Deney: deney/gezegenyolu.js + veri/deney/gezegenyolu.json. Ders bağlantısı: ders 3, bölüm 4 ("Gökte geri giden gezegenler: Dünya Mars'ı sollar"; dersler.js MINI d3: 3). Rehber metinleri dersin bu bölümündeki kaynaklı bilgileri yineler, onlarla çelişmez (arastirma/dersler_v2/d3_kaynak.md, "Yeni bölüm — Gökte geri giden gezegenler").

Kaynak türü: [O] = bu oturumda açılıp okundu (alıntı birebir); [P] = proje dosyasında daha önce doğrulanmış satır (dosya adı verildi); [H] = Astronomy Engine 2.1.19 ile uygulamanın kendi hesabı (deney/gezegenyolu.js; testler/deney3_gezegenyolu.spec.js sınar); [J] = JPL Horizons API, bu oturumda alındı (testler/veri/gezegenyolu_horizons.json, araclar/gezegenyolu_horizons.py).

## Hesap yöntemi

| Konu | Kaynak | Not |
|---|---|---|
| Gezegen konumu: yer merkezli, ışık süresi ve sapınç dâhil | https://github.com/cosinekitty/astronomy (Astronomy Engine, MIT; lib/astronomy.browser.min.js) | `GeoVector(govde, t, true)`; çizim için `Rotation_EQJ_ECL` ile J2000 tutuluma, duraklama ve karşı konum için `Ecliptic()` ile gerçek tarihli tutuluma |
| Duraklama = görünen tutulum boylamının türevinin sıfır olduğu an | [O] Wikipedia Apparent retrograde motion: "the planet being passed will first appear to stop its eastward drift, and then drift back toward the west" | türev ±1 saatlik merkezî farkla, günlük taramada işaret değişimi + 40 adım ikiye bölme |
| Karşı konum = gezegen − Güneş görünen boylam farkı 180° | gok.js `karsiKonum` (aynı almanak tanımı; arastirma/kavusum_kaynak.md) | ikiye bölme |
| İç kavuşum = fark 0° ve gezegen Güneş'in bu yanında | [O] Wikipedia Conjunction (astronomy): "it is in inferior conjunction if on the same side of the Sun" | uzaklık karşılaştırmasıyla |
| Yıldızlar 5 kadire kadar, takımyıldız çizgileri | veri/yildizlar.json, veri/takimyildiz.json (d3-celestial, BSD-3; README) | J2000 sağ açıklık/dik açıklık (derece) → J2000 tutulum |
| Parlaklık (kadir) | Astronomy Engine `Illumination().mag` | sağlama aşağıda |

## JPL Horizons karşılaştırması [J]

Sorgu: https://ssd.jpl.nasa.gov/api/horizons.api — EPHEM_TYPE=OBSERVER, CENTER='500@399', QUANTITIES='31' ("Observer-centered IAU76/80 ecliptic-of-date longitude and latitude of the target centers' apparent position, with light-time, gravitational deflection of light, and stellar aberrations"), CSV, derece, UT. Önce günlük tarama, sonra her olayın ±2 günü saatlik. Duraklama: saatlik boylama ±36 saatte ikinci derece polinom, tepe noktası (doğrusal ara değerle 2–4 dk fark). Karşı konum: Güneş (10) ile boylam farkı 180°, saatlik değerler arasında doğrusal. Alındı: 2026-11-10. Horizons, EOP tahmininin 2027-02-03'te bittiğini ve sonrası için son artık saniyeyi sabit aldığını yazar (etkisi saniye mertebesi).

| Olay | Horizons (UT) | Uygulama (UT) | Fark |
|---|---|---|---|
| Jüpiter durur, geri döner | 2026-12-13 00:55:52 | 2026-12-13 00:59:00 | +0,05 sa (3 dk) |
| Jüpiter durur, doğuya döner | 2027-04-13 02:16:07 | 2027-04-13 02:13:15 | −0,05 sa (3 dk) |
| Jüpiter karşı konum | 2027-02-11 00:28:47 | 2027-02-11 00:28:40 | 0,00 sa (7 sn) |
| Mars durur, geri döner | 2027-01-10 12:56:02 | 2027-01-10 13:01:18 | +0,09 sa (5 dk) |
| Mars durur, doğuya döner | 2027-04-01 14:11:40 | 2027-04-01 14:10:37 | −0,02 sa (1 dk) |
| Mars karşı konum | 2027-02-19 15:50:55 | 2027-02-19 15:51:53 | +0,02 sa (1 dk) |

Görevdeki ön bilgi ("Jüpiter ~13 Aralık 2026 – 13 Nisan 2027; Mars ~11 Ocak – 2 Nisan 2027, karşı konum 19 Şubat 2027") Jüpiter ve karşı konum için doğru; Mars duraklamaları Türkiye saatiyle 10 Ocak 15.56 ve 1 Nisan 17.12 (Horizons), yani birer gün önce. Geri hareket Jüpiter 121,1 gün, Mars 81,1 gün.

## Rehber ve "Gerçek dünyada" metinleri

| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [O] Mars yörüngesinde yön değiştirmez; geri görünmesi Dünya'nın hareketi; Dünya dış gezegenleri sollar | https://science.nasa.gov/image-article/apod-2018-november-8-mars-in-the-loop/ | "But Mars didn't actually reverse the direction of its orbit. Instead, the apparent backwards motion with respect to the background stars is a reflection of the motion of the Earth itself. Retrograde motion can be seen each time Earth overtakes and laps planets orbiting farther from the Sun" |
| [O] 2018 ilmeği Tunç Tezel'in 5–9 gün arayla çektiği karelerden | aynı | "This composite of images spaced some 5 to 9 days apart" ; "Image Credit & Copyright : Tunc Tezel ( TWAN )" |
| [O] Yörünge hızları: Merkür 47,4, Venüs 35,0, Dünya 29,8, Mars 24,1, Jüpiter 13,1, Satürn 9,7 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | "Orbital Velocity (km/s) 47.4 35.0 29.8 1.0* 24.1 13.1 9.7 6.8 5.4 4.7" (d3_kaynak.md satır 237 ile aynı) |
| [O] Geri hareketin ortası karşı konum; gezegen yılın en parlak hâlinde | https://en.wikipedia.org/wiki/Apparent_retrograde_motion | "The center of the retrograde motion occurs at the planet's opposition" ; "the planet appears at its brightest for the year" |
| [O] Geri hareket süreleri ve sinodik dönemler (tablo) | aynı | "Planetary retrograde constants": Mercury 116 / ≈ 22 (19.85-24.19); Venus 584 / 41; Mars 780 / 72; Jupiter 399 / 121; Saturn 378 / 138 |
| [O] İç gezegenler karşı konuma gelmez; geri hareket iç kavuşumda; Güneş parıltısında görülmez; akşam yıldızından sabah yıldızına | aynı | "as they can never be in opposition to the Sun as seen from Earth, their retrograde cycles are tied to their inferior conjunctions with the Sun. They are unobservable in the Sun's glare … they occur in the transition from evening star to morning star." |
| [P] Jüpiter sinodik dönemi 398,88 gün | https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html | d3_kaynak.md: "Synodic period (days) \| 398.88" |
| [P] Karşı konumda gezegen Güneş batarken doğar, bütün gece gökte kalır | ders 3 bölüm 4 | "Güneş'in karşısında olduğu için Mars Güneş batarken doğar, bütün gece gökte kalır" (Sky at Night, d18_kaynak.md) |
| [P] Mars karşı konumu 19 Şubat 2027 | https://skyatnightmagazine.com/advice/skills/mars-opposition | d18_kaynak.md: "reaches opposition on 19 February 2027" (Horizons ile de: 15.51 UT) |
| [P] Mars 2027 Aslan'da, −1,2 kadir | https://nakedeyeplanets.com/mars-oppositions.htm | d18_kaynak.md satır 130: "February 19", "Leo", "-1.2" |
| [P] Mars 2027'de ~101 milyon km | https://earthsky.org/astronomy-essentials/why-is-mars-sometimes-bright-and-sometimes-faint | d18_kaynak.md satır 44: "101 million km" (uygulama 0,678 AB = 101 milyon km) |
| [P] Jüpiter karşı konumu 11 Şubat 2027, Aslan, −2,5 | https://earthsky.org/astronomy-essentials/jupiter-at-opposition/ | d18_kaynak.md satır 59: "February 11, 2027"; "Leo"; "-2.5" (EarthSky 00.21 UT; Horizons 00.29 UT) |
| [P] Dürbün gerekmez; çıplak gözle kolayca görülür | ders 3 bölüm 4 | "Bunun için dürbün bile gerekmez; ikisi de çıplak gözle kolayca görülür." |
| "Mars'ın ilmeğini Ocak–Nisan 2027'de haftada bir bakarak kendin izleyebilirsin." | ders 3 bölüm 4 | "Bu iki gezegeni ocaktan nisana kadar, örneğin haftada bir kez … deftere çizersen" (cümle görev metninde birebir istendi) |

## Adımlardaki sayılar [H]

Uygulamanın hesabı (Türkiye saati; konum 18.00 UT): Mars 10 Ocak – 1 Nisan 2027, 81 gün, 19,5°; 19 Şubat'ta −1,2 kadir, 0,68 AB; 1 Ocak'ta günde 0,11° doğuya, 0,91 AB. Jüpiter 13 Aralık 2026 – 13 Nisan 2027, 121 gün, 10,0°. Satürn 9 Ağustos – 24 Aralık 2027, 136 gün, 6,9°, karşı konum 18 Ekim 2027 (03.31). Venüs 11 Mayıs – 23 Haziran 2028, 43 gün, iç kavuşum 1 Haziran 2028. Merkür 9 Şubat – 3 Mart 2027, 22 gün, iç kavuşum 18 Şubat 2027. Sağlama: Jüpiter karşı konumda −2,56 kadir (EarthSky −2,5); Mars −1,21 (nakedeyeplanets −1,2); Wikipedia tablosuyla Jüpiter 121 = 121, Satürn 136 ↔ 138, Venüs 43 ↔ 41, Merkür 21,8 (19,85–24,19 içinde), Mars 81 ↔ 72 (tablo değeri tek bir sayı; 2027 geri hareketi Horizons'a göre de 81,1 gün).

## Yapılmayan

Gökyüzü levhasında seçili gezegenin ±30 günlük izi (isteğe bağlı madde) eklenmedi.
