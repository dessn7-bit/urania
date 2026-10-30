# durbun — kaynak tablosu

Erişim: 30 Ekim 2026. "Hesap" satırları python3 ile yeniden hesaplandı.

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Nikon Action EX 7×50 CF: gerçek alan 6,4° | https://imaging.nikon.com/sport-optics/lineup/binoculars/standard/ex_x35x40x50/ | "Angular field of view (Real/degree) 6.4" |
| Nikon Action EX 7×50 CF: görünür alan 42,7° | aynı | "Angular field of view (Apparent/degree) 42.7" |
| Nikon Action EX 7×50: çıkış göz bebeği 7,1 mm, göreli parlaklık 50,4 | aynı | "Exit pupil (mm) 7.1", "Relative brightness 50.4" |
| Nikon Action EX 10×50 CF: gerçek alan 6,5°, görünür 59,2° | aynı | "6.5", "59.2" |
| Nikon Action EX 10×50: çıkış göz bebeği 5,0 mm | aynı | "Exit pupil (mm) 5.0" |
| ISO 14132-1: tan(görünür/2) = M · tan(gerçek/2) | https://imaging.nikon.com/sport-optics/guide/binoculars/basic/basic_08/ | Ders d11 aynı belgeye dayanır: "ISO 14132-1:2002 standardındaki formül"; hesap: 6,4°, 7× → 42,71° |
| Celestron Cometron 7×50: 6,6° | https://www.celestron.com/products/cometron-7x50 | Ders d11 (Ekim 2026'da bakıldı): "Celestron Cometron 7×50 6,6°" |
| Bresser 7×50 Travel: 6,97° | https://www.bresser.com/p/bresser-7x50-travel-binoculars-1250752 | Ders d11: "Bresser 7×50 Travel 6,97°" |
| Göz merceklerinin çoğunda görünür alan ≈ 50° (Kellner, Ortoskopik, Plössl) | https://skyandtelescope.org/observing/telescope-calculator/ | "For most eyepieces (Kellners, Orthoscopics, or Plössls), this value is about 50 degrees." |
| En yüksek yararlı büyütme ≈ 2 × D (mm) | aynı | "maximum useful magnification is 50 times its aperture in inches" |
| Çıkış göz bebeği 7 mm'den büyükse ışığın hepsi göze girmez | aynı | "If the exit pupil is larger than 7mm, it means your eye probably won't see all the light coming from the eyepiece." |
| Göz bebeği tablosu: 20 y 7,3 · 30 y 6,6 · 40 y 6,2 · 50 y 5,8 · 60 y 5,6 · 70 y 5,2 · 80 y 4,9 mm (gece) | https://en.wikipedia.org/wiki/Exit_pupil | "Average human eye pupil diameter vs. age" — "\| 20 \| 4.7 \| 7.3 \|" … "\| 80 \| 2.3 \| 4.9 \|" (Night sütunu) |
| 7×50'nin çıkış göz bebeği 7,14 mm | aynı | "A set of 7×50 binoculars has an exit pupil just over 7.14 mm" |
| 7 mm referans göz bebeği | Ders d11, d12 formülleri (veri/dersler.json) | "D = 50, d_göz = 7 → ≈ 51 kat"; "d ≈ 7 mm (karanlıktaki göz bebeği)" |
| Bortle 3: çıplak göz 6,6–7,0; 32 cm ayna 16 | https://en.wikipedia.org/wiki/Bortle_scale | Tablo: "Rural sky … 6.6 – 7.0 … 16" |
| Bortle 5: 5,6–6,0; 32 cm ayna 15 | aynı | "Suburban sky … 5.6 – 6.0 … 15" |
| Bortle 8: 4,1–4,5; 32 cm ayna 13 | aynı | "City sky … 4.1 – 4.5 … 13" |
| Bortle 3/5/8 çapraz kontrol | https://skyandtelescope.org/astronomy-resources/light-pollution-and-astronomy-the-bortle-dark-sky-scale/ | "The naked-eye limiting magnitude is 6.6 to 7.0, and a 32-cm reflector will reach to 16th magnitude." · "around 5.6 to 6.0 … about magnitude 14.5 to 15" · "magnitude 4.5 at best … little better than magnitude 13" |
| Gök değerleri 6,8 / 5,8 / 4,3 | Hesap | Aralıkların ortası |
| Kadir farkı Δm = 2,5 log(oran) | Ders d11, d12 formülü (veri/dersler.json) | "Δm = 2,5 × log(oran) … 51 kat → ≈ 4,3 kadir" |
| Sınır kadir kuralı 7,5 + 5 log D (cm) | https://astronomics.com/limiting-magnitude_t.aspx | "An approximate formula for determining the visual limiting magnitude of a telescope is 7.5 + 5 log aperture (in cm)." · "assume very dark skies, trained observers, and excellent atmospheric transparency" |
| 10×50: +9,5 ile +11 kadir | https://en.wikipedia.org/wiki/Binoculars | "10×50 binoculars are limited to an apparent magnitude of +9.5 to +11 depending on sky conditions and observer experience." |
| Elde pratik sınır 10× | aynı | "A magnification of 10x is generally considered the practical limit for observation with handheld binoculars." |
| Rayleigh: θ = 1,22 λ / D | https://en.wikipedia.org/wiki/Angular_resolution | "The factor 1.22 is derived from a calculation of the position of the first dark circular ring"; "λ is the wavelength of light, and D is the diameter of the lens' aperture" |
| 550 nm'de Rayleigh ≈ 138 / D (mm) | Ders d12 (Eckop kaynaklı) + hesap | 1,22 × 550e-9 × 206265 × 1000 = 138,4 |
| Dawes: R = 4,56 / D (inç) ≈ 115,8 / D (mm) | https://en.wikipedia.org/wiki/Dawes%27_limit | "R = 4.56/D … D is the telescope's aperture in inches" |
| Gözün ayırma gücü ≈ 1′ | https://en.wikipedia.org/wiki/Naked_eye | "Angular resolution: about 1 arcminute" |
| Ülker merkezi 56,6008°, 24,1139°; boyut 110′ (1,83°) | veri/hedefler.json (SIMBAD ve SEDS çapraz kontrolü, J2000) | "M45 … ra 56.6008, dec 24.1139 … boyut 110′" |
| Ülker: Wikipedia boyutu 2°; 1.000'den fazla yıldız, en parlak 6–7'si çıplak gözle kolay | https://en.wikipedia.org/wiki/Pleiades | "Apparent dimensions (V) 2°"; "It contains over 1,000 stars, with the brightest six or seven being easily visible to the naked eye." |
| Kemer: Mintaka 83,0017° −0,2991°, Alnilam 84,0534° −1,2019°, Alnitak 85,1897° −1,9426° | veri/yildizlar.json (d3-celestial) | Katalog satırları |
| Mintaka–Alnitak 2,74° | Hesap (katalog konumlarından) | 2,7361° |
| Wikipedia: kemer ~140′ (2,3°) | https://en.wikipedia.org/wiki/Orion%27s_Belt | "spanning an angular size of ~140 ′ (2.3°)" — konumlardan hesapla uyuşmuyor; ikisi de metinde belirtildi |
| Sönük yıldızlar: Gaia DR3 (ESA arşivi TAP, 30 Ekim 2026) | https://gea.esac.esa.int/archive/ | Sorgu: gaiadr3.gaia_source, Ülker 4,3° / G<12 ve 1,35° / G<14,5; kemer aynı |
| G − V = −0,02704 + 0,01424 c − 0,2156 c² + 0,01426 c³ (c = BP−RP), σ 0,03017 | https://gea.esac.esa.int/archive/documentation/GDR3/Data_processing/chap_cu5pho/cu5pho_sec_photSystem/cu5pho_ssec_photRelations.html | Tablo 5.9, geçerlilik −0,5 < BP−RP < 5,0 |
| Katalog tamlık katmanları (0,75° → 14,2; 1,1° → 12,5; 3,6° → 11,2; 4,0° → 7,0) | Hesap (sorgu sınırlarından) | V ≤ G olduğu için G<14,5 V≤14,2'yi tam kapsar |
| Kent→karanlık 2,5 kadir = ağız 3,2 kat | Hesap | 10^(2,5/5) = 3,16 |
| 32 cm ayna: model 12,6 / 14,1 / 15,1 vs Bortle 13 / 15 / 16 (0,4–0,9 kadir) | Hesap | 4,3/5,8/6,8 + 5 log(320/7) |
| 7×50 adımları: 51 kat, 4,3 kadir, 11,0, 8,5, 10,6, %34, 49 mm, 41 mm | Hesap ve tarayıcı (rehber adımları) | (50/7)²=51,0; 6,8+4,23; 1−(5,8/7,143)²=0,34 |
| 80 mm 40×: 1,34° (ISO), 1,25° (kaba), 131 kat, 12,1, 1,73″ | Hesap | 2·atan(tan25°/40) = 1,336° |
| 200 mm 50×: 816 kat, 7,3 kadir, 1,07°, 11,6 / 14,1, 1,2″ | Hesap | |
| Merak–Dubhe gibi d11 örnekleri | — | Kullanılmadı |
