# astrofoto — kaynak tablosu

Erişim: 30 Ekim 2026. "Hesap" satırları python3 ile yeniden hesaplandı.

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Yıldız günü 23,9345 saat | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | "Sidereal rotation period (hrs) 23.9345" |
| Gök kayma hızı 15,04″/sn × cos δ | Hesap + ders d24 formülü | 360 × 3600 / (23,9345 × 3600) = 15,0410 |
| 35 mm eşdeğeri: köşegen 43,27 mm (CIPA) | https://en.wikipedia.org/wiki/35_mm_equivalent_focal_length | "Diagonal distance of image area in the 35 mm camera (43.27 mm)" |
| 4:3 karede eşdeğer en 34,6 mm | aynı | "4:3 … f35 = 34.6 f / w" ; hesap 43,27 × 0,8 = 34,616 |
| Telefon varsayımı 24 mm, 4000 × 3000 piksel → 74,4″ / piksel | Ders d24 ("Telefonunun gözü") | "ana kamera 24 mm eşdeğerinde ve fotoğraf 4000 × 3000 piksel"; hesap 74,38 |
| Galaxy S24 ana kamera: 50 MP, 1/1.56", 1,0 µm, f/1.8, 24 mm | https://m.gsmarena.com/samsung_galaxy_s24-review-2663p5.php | "50MP Samsung ISOCELL (S5K)GN3, 1/1.56", 1.0µm, f/1.8, 24mm" |
| Telefon 48–108 MP'lik sensörün 4 ya da 9 pikselini birleştirip 12 MP verir | https://opcug.ca/Photography/CellPhonePhotography2026.pdf | "the phone is doing "pixel binning" to combine grids of 4 or 9 pixels into a single output reading" |
| Nikon Z6III: 35,9 × 23,9 mm, 6048 × 4032 | https://imaging.nikon.com/imaging/lineup/mirrorless/z6_3/ | "35.9 × 23.9 mm CMOS sensor"; "6048 × 4032 (Large: 24.4 M)" |
| Piksel aralığı 5,94 µm; 24 mm'de 51,0″, 50 mm'de 24,5″ | Hesap | 35,9/6048 = 5,936 µm |
| 500 kuralı: t = 500 / eşdeğer odak; 20 mm → 25 sn, 50 mm → 10 sn | https://photographylife.com/500-rule-vs-npf-rule | "shutter speed is equal to 500 ÷ Equivalent Focal Length"; 20 mm 25 s, 50 mm 10 s |
| 500 kuralı "fazla hoşgörülü" | aynı | "too lenient" |
| 500 kuralı film/baskı çağından | Ders d24 (National Parks at Night) | "Kural bir baskı boyutu ve bir göz için kurulmuştu" |
| Basit NPF: (35 × N + 30 × p) / f; p µm, f gerçek odak | https://www.lightstalking.com/npf-rule/ | "{(35 x Aperture) + (30 x pixel pitch)} ÷ focal length"; "not to apply the crop factor" |
| Basit NPF ikinci kaynak | https://petapixel.com/2017/04/07/npf-rule-formula-sharp-star-photos-every-time | "(35 x aperture + 30 x pixel pitch) ÷ focal length = shutter speed in seconds" |
| NPF: Frédéric Michaud, Société Astronomique du Havre | https://www.lightstalking.com/npf-rule/ | "Frédéric Michaud, for the Société Astronòmique du Havre" (adı ekranda yok) |
| NPF 24 mm f/2.8: 11,5 sn; 50 mm f/1.8: 4,8 sn; f/4: 13,3 sn | Hesap | |
| 500 kuralı 20,8 sn → 4,2 px; 16 sn → 3,2 px; 1 px 4,9 sn; δ 41° 6,6 sn; δ 80° 28,5 sn | Ders d24 ve cizim_v3.js d24-yildiz-kaymasi + hesap | "500 kuralının 20,8 saniyesi … yaklaşık 4,2 piksellik"; "16 saniyelik kare sınırı yaklaşık 3,2 piksele" |
| Google gece modu: kare en çok 16 sn | https://research.google/blog/astrophotography-with-night-sight-on-pixel-phones/ | "the per-frame exposure time should not exceed 16 seconds" |
| En çok 15 kare, 4 dakika | aynı | "we limited a single Night Sight image to at most 15 frames with up to 16 seconds per frame" |
| Kareler hizalanıp ortalanır | aynı | "The frames are first aligned … and then averaged" |
| Yığınlamada oran √N | https://en.wikipedia.org/wiki/Signal_averaging | "the signal-to-noise ratio (SNR) increases, ideally in proportion to the square root of the number of repetitions" |
| Foton gürültüsü = √sinyal | https://astropix.com/books/BGDA/CHAPTER8/801.HTM | "This amount of noise is equal to the square root of the signal." |
| Kısa kareler yığınlanarak uzun pozun oranına; kötü kare atılabilir; uzun poz parlakları doyurur | aynı | "it is best to shoot a lot of shorter exposures and stack them to equal the signal-to-noise ratio of a longer exposure. If a single short frame is ruined by poor tracking or an airplane, it is not a terrible loss." |
| Tek kare oranları 14,1 (karanlık) / 6,3 (kent); kentte 5 kare; 16 kare → 25 | Ders d24 uydurma örneği, cizim_v3.js d24-yiginlama + hesap | "400 foton … gökyüzünden 400 … 3600"; 400/√800 = 14,14; 400/√4000 = 6,32 |
| Kent göğü: düşük ISO, kısa pozlar, yığınlama; turuncu renk | https://www.photographytalk.com/light-pollution-and-how-to-work-around-it-in-astrophotography/ | "consider stacking multiple exposures … taking several short exposures and combining them" |
| Yıldız izi: 30 sn × 100 ya da daha fazla kare | https://www.rmg.co.uk/how-photograph-star-trails | "take 100 or more shots at 30 seconds each" |
| Kutup Yıldızı dik açıklığı 89,35° (2022) | https://en.wikipedia.org/wiki/Pole_star | "In 2022 Polaris' mean declination was 89.35 degrees North" |
| Kutup Yıldızı'nın yüksekliği ≈ enlem (İstanbul ~41°) | https://en.wikipedia.org/wiki/Celestial_pole | "its altitude angle is always (nearly) equal to the observer's geographic latitude" |
| 50 dk'da 12,5°; Kutup Yıldızı yayı 6,9 px; ekvator 607 px; 10° yıldız ~106 px | Ders d24 örneği + hesap | 3000 × 15,04 × cos 89,35° / 74,4 = 6,88; 3000 × 15,04 / 74,4 = 606,6 |
| Kadraj 24 mm telefon 71,6° × 56,8° (ekranda yuvarlak 72° × 57°) | Ders d24 + hesap | 2·atan(17,3/24) |
