# cizim_v5d.js — d45, d46, d47, d48, d49 ders çizimlerinin kaynakları

Tarih: 2026-10-30. Her satır: çizim | değer | kaynak/hesap.
"Ders dNN bölüm k" = arastirma/dersler_v2/dNN.json'daki metin (kendi kaynakları dNN_kaynak.md'de). Bölüm dizinleri 0 tabanlıdır.
Ders metinleri son kez 2026-10-30'da, çizimler bitirilirken yeniden okundu; doğrulama ekiplerinin düzelttiği J0030+0451 hata payı (+0,15/−0,14) ve TON 618 (41–66 milyar), Kozmik At Nalı (+5,5/−6,3 milyar) değerleri çizimlere işlendi.
Hesaplar cizim_v5d.js içinde tarayıcıda yapılır; aşağıdaki sonuçlar aynı formüllerle Node'da yeniden hesaplanarak denetlendi.

Ortak sabitler:
- GM☉ = 1,32712440018 × 10²⁰ m³/s² (IAU; NASA Sun Fact Sheet 132.712 × 10⁶ km³/s²: https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html)
- c = 299.792.458 m/s (tanımlı; Ders d49 formüller)
- Güneş yarıçapı 695.700 km (NASA Sun Fact Sheet, aynı adres)
- 1 AB = 1,495978707 × 10⁸ km (https://en.wikipedia.org/wiki/Astronomical_unit)
- 1 kpc = 3,0857 × 10¹⁹ m; 1 pc = 3,2616 ışık yılı (Ders d47 bölüm 6: 26,8 kpc ≈ 87.400 ışık yılı ile tutarlı)
- Schwarzschild yarıçapı r_s = 2GM/c² → 1 Güneş kütlesi için 2,9533 km (https://en.wikipedia.org/wiki/Schwarzschild_radius)
- 1 ışık günü = c × 86.400 s = 2,590 × 10¹⁰ km ≈ 173 AB (Ders d48 formüller)

## d45 · Nötron yıldızları ve atarcalar

| çizim | değer | kaynak/hesap |
|---|---|---|
| d45-ic-yapi (bölüm 6) | yarıçap ≈12 km | Ders d45 bölüm 0 (NICER ile 12–13 km), bölüm 9 (≈12 km), bölüm 10 (1,4 M☉ için ≈12,3 km) |
| d45-ic-yapi | kabuk ≈1 km | Ders d45 bölüm 7: nükleer makarna "yüzeyin yaklaşık bir kilometre altında", iç kabuğun en derin kısmı (bölüm 6). Ölçekli şeritte kabuk 0–1 km çizildi |
| d45-ic-yapi | dış/iç çekirdek sınırı (7 km) | şematik; çizimde "sınırı şematik" yazar, ders bir değer vermez |
| d45-ic-yapi | atmosfer mm–cm; okyanus metreler–onlarca m; katı, sert dış kabuk; nötron damlaması; serbest nötron denizi; makarna | Ders d45 bölüm 6 ve 7. Alt şeridin genişlikleri şematik (çizimde ve açıklamada yazar) |
| d45-ic-yapi | kabuk yoğunluğu ≈10⁹ kg/m³ | Ders d45 bölüm 6 |
| d45-ic-yapi | merkez 6–8 × 10¹⁷ kg/m³; ortalama 3,7–5,9 × 10¹⁷; çekirdek ≈3 × 10¹⁷ | Ders d45 bölüm 6 |
| d45-ic-yapi | basınç ≈3,2 × 10³¹ Pa (iç kabuk) → ≈1,6 × 10³⁴ Pa (merkez) | Ders d45 bölüm 6 |
| d45-kutle-siniri (bölüm 9) | 0,7 (1939) | Ders d45 bölüm 0 ve 9 |
| d45-kutle-siniri | 2,01–2,17 (GW170817); 2,2–2,3 (2026); 2,2–2,9 (Kalogera–Baym 1996); kabaca 3 (NASA) | Ders d45 bölüm 9 |
| d45-kutle-siniri | J0030+0451: 1,44 (+0,15/−0,14) → çubuk 1,30–1,59 | Ders d45 bölüm 10 (düzeltilmiş metin) |
| d45-kutle-siniri | J0348+0432 2,01 ± 0,04; J0740+6620 2,08 ± 0,07; J0952−0607 2,35 ± 0,17 | Ders d45 bölüm 9 |
| d45-kutle-siniri | GW190814 2,59 (büyük olasılıkla kara delik); GW170817 kalıntısı ≈2,74 (çöktü) | Ders d45 bölüm 9 |
| d45-kutle-siniri | kütle boşluğu 2–5 | Ders d45 bölüm 9 |
| d45-hulse-taylor (bölüm 13) | en yakın 746.600 km, en uzak 3,15 milyon km | Ders d45 bölüm 13 |
| d45-hulse-taylor | a = (746.600 + 3.150.000) ÷ 2 = 1.948.300 km; e = (3.150.000 − 746.600) ÷ (3.150.000 + 746.600) = 0,6168 | hesap; ders 0,617 der |
| d45-hulse-taylor | kütleler 1,441 ve 1,387 | Ders d45 bölüm 13 |
| d45-hulse-taylor | her yıldızın yarı büyük ekseni: atarca a × 1,387 ÷ 2,828 = 955.500 km; eş a × 1,441 ÷ 2,828 = 992.800 km; yollar ortak kütle merkezini odak alan, zıt yönlü iki elips | iki cisim problemi (kütle merkezi); hesap |
| d45-hulse-taylor | ölçek: 3,15 milyon km = 340 birim → Güneş yarıçapı 695.700 km = 75,1 birim | hesap; Güneş yarıçapı NASA |
| d45-hulse-taylor | 7,75 saat; en yakın nokta yılda ≈4,2°; yılda ≈3,5 m küçülme; ≈300 milyon yıl | Ders d45 bölüm 13 |

## d46 · Süper kütleli kara delikler

| çizim | değer | kaynak/hesap |
|---|---|---|
| d46-tohum-buyume (bölüm 9) | Salpeter zamanı t_S = 4,5 × 10⁸ yıl × ε ÷ (λ (1 − ε)), λ = 1 | Ders d46 bölüm 8 ve formüller (Shen derlemesi) |
| d46-tohum-buyume | ε = 0,1 → 50 milyon yıl; ε = 0,42 → 325,9 ≈ 330 milyon yıl | hesap; ders 50 ve ≈330 der |
| d46-tohum-buyume | M = M₀ × e^(t ÷ t_S) | Ders d46 formüller (üstel büyüme) |
| d46-tohum-buyume | hafif tohum 100, ağır tohum 10⁵ Güneş kütlesi | Ders d46 bölüm 8 (100 M☉ örneği), bölüm 9 (doğrudan çöküş ≈10⁵) |
| d46-tohum-buyume | J0313–1806: 1,6 milyar Güneş kütlesi; evren ≈680 milyon yaşında | Ders d46 bölüm 9 |
| d46-tohum-buyume | 100 → 1,6 × 10⁹: 50 × ln(1,6 × 10⁷) = 829 ≈ 830 milyon yıl; 10⁵ → 1,6 × 10⁹: 50 × ln(1,6 × 10⁴) = 484 ≈ 480 milyon yıl | hesap (ders: 100 → 10⁹ yaklaşık 800 milyon yıl, aynı formül 806) |
| d46-gelgit-hills (bölüm 11) | gelgit yarıçapı r_t = R* × (M_kd ÷ M*)^(1/3), R* = 695.700 km, M* = 1 | Ders d46 bölüm 11 formülü; Güneş yarıçapı NASA |
| d46-gelgit-hills | olay ufku r_s = 2,9533 km × M_kd | Schwarzschild yarıçapı (yukarıda) |
| d46-gelgit-hills | Hills kütlesi: r_t = r_s → M = (695.700 ÷ 2,9533)^1,5 = 1,14 × 10⁸ | hesap; ders "kabaca 10⁸" (Stone ve ark.) der |
| d46-gelgit-hills | 10 kat kütle → 10^(1/3) = 2,15 kat yarıçap | hesap |
| d46-gelgit-hills | Sgr A* 4,3 × 10⁶; 2011 olayı ≈10⁶ | Ders d46 bölüm 3 ve bölüm 11 |
| d46-kutle-merdiveni (bölüm 13) | Sgr A* 4,3 milyon (S2 yörüngesi) | Ders d46 bölüm 3 |
| d46-kutle-merdiveni | M106 (NGC 4258) 3,9 × 10⁷ (maser) | Ders d46 bölüm 1 ve 14 |
| d46-kutle-merdiveni | Andromeda 1,4 × 10⁸ (+0,65/−0,45 × 10⁸) → çubuk 0,95–2,05 × 10⁸ | Ders d46 bölüm 14 |
| d46-kutle-merdiveni | NGC 5548 (2,58 ± 1,12) × 10⁸ → çubuk 1,46–3,70 × 10⁸; ±%43 = 1,12 ÷ 2,58 | Ders d46 bölüm 2; hesap |
| d46-kutle-merdiveni | M87 2,4 milyar (1994 gaz) ve 6,5 milyar (EHT 2019) | Ders d46 bölüm 1 |
| d46-kutle-merdiveni | OJ 287 ana kara delik 18 milyar (tartışmalı model) | Ders d46 bölüm 12 ve 13 |
| d46-kutle-merdiveni | Kozmik At Nalı 36 milyar, +5,5/−6,3 → çubuk 29,7–41,5 milyar | Ders d46 bölüm 13 (düzeltilmiş metin) |
| d46-kutle-merdiveni | TON 618: 40,7 milyar (C IV) ve 66 milyar (Hβ) | Ders d46 bölüm 13 (düzeltilmiş metin) |
| d46-kutle-merdiveni | King üst sınırı ≈5 × 10¹⁰ | Ders d46 bölüm 13 |

## d47 · Samanyolu

| çizim | değer | kaynak/hesap |
|---|---|---|
| d47-kapteyn (bölüm 1) | Kapteyn 1922: ≈40.000 ışık yılı, Güneş merkeze ≈2000 ışık yılı | Ders d47 bölüm 1 |
| d47-kapteyn | Trumpler sonrası ≈100.000 ışık yılı, Güneş ≈30.000 ışık yılı | Ders d47 bölüm 1 |
| d47-kapteyn | bugün ≈26.700 ışık yılı (GRAVITY, 8178 pc) | Ders d47 bölüm 8 |
| d47-kapteyn | Kapteyn merceğinin Güneş'in çevresine konması | ders metnindeki sis benzetmesinin (bölüm 1) çizimi; açıklamada yorum olduğu yazar. Kalınlıklar şematik |
| d47-anatomi (bölüm 4) | çap ≈87.400 ışık yılı (D25, 26,8 kpc) | Ders d47 bölüm 6 |
| d47-anatomi | ince disk kalınlığı 700–1500 ışık yılı (çizimde 1500) | Ders d47 bölüm 4; Wikipedia Milky Way tablosu 718–1470 ışık yılı (https://en.wikipedia.org/wiki/Milky_Way) |
| d47-anatomi | kalın disk ölçek yüksekliği ≈1000 pc = 3262 ışık yılı (çizgi ±1 ölçek yüksekliği) | Ders d47 bölüm 4 (Freeman derlemesi) |
| d47-anatomi | şişkinlik: merkezin çevresindeki ≈10.000 ışık yılı (yarıçap olarak çizildi; biçim şematik) | Ders d47 bölüm 4; Wikipedia: "The stars in the innermost 10,000 light-years form a bulge" |
| d47-anatomi | küresel kümeler 200.000 ışık yılının ötesine (PAL 4, AM 1) | Ders d47 bölüm 4 |
| d47-anatomi | Güneş merkezden 26.700 ışık yılı; düzlemin 5–30 pc üstünde | Ders d47 bölüm 8 |
| d47-anatomi | ölçek: 87.400 ışık yılı = 340 birim, yatay ve dikey aynı | çizim kararı |
| d47-donme-egrisi (bölüm 10) | gözlenen ≈200–220 km/s bandı (5–19,5 kpc arası çizildi) | Ders d47 bölüm 10 (bandın başlangıcı şematik; iç bölge çizilmedi) |
| d47-donme-egrisi | Gaia 2023 düşüşü: 19,5–26,5 kpc arasında ≈30 km/s; M = 2,06 × 10¹¹ | Ders d47 bölüm 10; Jiao ve ark. 2023 özeti (https://arxiv.org/abs/2309.00048) mutlak hız vermez, yalnız düşüşü verir |
| d47-donme-egrisi | Gaia eğrisi v = √(GM ÷ r), M = 2,06 × 10¹¹: 19,5 kpc'de 213,2, 26,5 kpc'de 182,8 km/s; fark 30,3 km/s | hesap (Ders d47 formül M = v² r ÷ G'nin tersi); düşüş dersle uyuşur |
| d47-donme-egrisi | "yalnız yıldız + gaz" eğrisi: M = 6,43 × 10¹⁰ × 1,15 = 7,39 × 10¹⁰ (yıldızların üst değeri + gazın üst payı %15), v = √(GM ÷ r): 8,178 kpc'de 197, 26,5 kpc'de 110 km/s | Ders d47 bölüm 6 (yıldız kütlesi, gaz payı); hesap. Kaba: bütün kütle merkezde sayıldı, açıklamada yazar |
| d47-donme-egrisi | Güneş 8,178 kpc, ≈210 km/s (200–220 bandının ortası) | Ders d47 bölüm 8 |
| d47-donme-egrisi | 1,54 × 10¹² (2019); 7 kattan fazla fark; yıldızlar 4,6–6,4 × 10¹⁰ | Ders d47 bölüm 10 ve 6 |

## d48 · Kuasarlar ve aktif galaksiler

| çizim | değer | kaynak/hesap |
|---|---|---|
| d48-birlesik-model (bölüm 6) | katmanlar: kara delik + yığılma diski, geniş çizgi bulutları, tozlu simit, iyonlaşma konileri, dar çizgi bulutları, jetler; tip 1 / tip 2 / blazar bakış açıları; Antonucci–Miller elektron aynası | Ders d48 bölüm 5, 6, 9; Shields (https://ned.ipac.caltech.edu/level5/Sept04/Shields/Shields4_7.html). Ölçeksiz |
| d48-boyut-merdiveni (bölüm 5) | 3C 273 kara deliği 886 milyon Güneş kütlesi | Ders d48 bölüm 3 |
| d48-boyut-merdiveni | olay ufku 2,9533 km × 8,86 × 10⁸ = 2,617 × 10⁹ km = 17,5 AB = 0,101 ışık günü | hesap (Schwarzschild yarıçapı) |
| d48-boyut-merdiveni | Neptün yörüngesi 4,495 × 10⁹ km ≈ 30 AB = 0,174 ışık günü | NASA Neptune Fact Sheet (https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html); Ders d48 bölüm 4 "Neptün 30 AB'de" |
| d48-boyut-merdiveni | NGC 5548 geniş çizgi gecikmesi 15,6 ışık günü | Ders d48 bölüm 4 ve 5 (d46 bölüm 2) |
| d48-boyut-merdiveni | geniş çizgi bölgesi 0,1–1 parsek = 119–1191 ışık günü | Ders d48 bölüm 5; Wikipedia Seyfert galaxy ("0.1–1 parsec across"); hesap 1 pc = 3,2616 × 365,25 ışık günü |
| d48-boyut-merdiveni | NGC 1068 dar çizgi bölgesi > 1000 ışık yılı (365.250 ışık günü; okla "daha büyük") | Ders d48 bölüm 5; Wikipedia Seyfert galaxy |
| d48-boyut-merdiveni | 3C 273 jeti ≈200.000 ışık yılı = 7,3 × 10⁷ ışık günü | Ders d48 bölüm 7 |
| d48-boyut-merdiveni | aralık: 7,3 × 10⁷ ÷ 0,101 ≈ 7 × 10⁸ ("yaklaşık 700 milyon kat") | hesap |
| d48-isiktan-hizli (bölüm 8) | görünür hız β_g = β sin θ ÷ (1 − β cos θ) | Ders d48 formüller |
| d48-isiktan-hizli | β = 0,99, θ = 8° → 7,02 | hesap; ders ≈7 der |
| d48-isiktan-hizli | β = 0,99, θ = 60° → 1,70 | hesap |
| d48-isiktan-hizli | β → 1 sınırı: sin θ ÷ (1 − cos θ) = cot(θ/2); 19° → 5,98 ≈ 6; 43° → 2,54 | hesap; M87 6 kat ve 19°, 43° Ders d48 bölüm 8 |
| d48-isiktan-hizli | 3C 273: 9,6 kat; gereken en küçük β: βγ = 9,6 → β = 0,9946 ("yüzde 99,5") | Ders d48 bölüm 8; hesap (en büyük görünür hız βγ, θ = arccos β'da) |

## d49 · Galaksi kümeleri ve kozmik ağ

| çizim | değer | kaynak/hesap |
|---|---|---|
| d49-olcek-merdiveni (bölüm 0) | Samanyolu çapı ≈87.400 ışık yılı | Ders d47 bölüm 6 |
| d49-olcek-merdiveni | Samanyolu–Andromeda ≈800 kpc = 2,61 milyon ışık yılı | Ders d49 bölüm 1; hesap × 3,2616 |
| d49-olcek-merdiveni | Başak Kümesi merkezi 53,8 milyon ışık yılı | Ders d49 bölüm 2 |
| d49-olcek-merdiveni | Çoban Boşluğu yarıçapı 62 Mpc ≈ 200 milyon ışık yılı | Ders d49 bölüm 11 |
| d49-olcek-merdiveni | baryon akustik salınım cetveli ≈150 Mpc = 490 milyon ışık yılı | Ders d49 bölüm 14 |
| d49-olcek-merdiveni | Büyük Duvar en az 500 milyon ışık yılı | Ders d49 bölüm 10 |
| d49-olcek-merdiveni | Laniakea çapı ≈160 Mpc = 522 milyon ışık yılı | Ders d49 bölüm 9; hesap × 3,2616 |
| d49-olcek-merdiveni | Sloan Büyük Duvarı 1,37 milyar ışık yılı | Ders d49 bölüm 10 |
| d49-olcek-merdiveni | Millennium küpü kenarı ≈2 milyar ışık yılı | Ders d49 bölüm 12 |
| d49-olcek-merdiveni | Sloan Büyük Duvarı ÷ Samanyolu = 1,37 × 10⁹ ÷ 87.400 = 15.700 ("on altı bin kat") | hesap |
| d49-pay-hacim (bölüm 10) | madde: lif %50, duvar %25, boşluk %15, küme %10; hacim: boşluk %78, duvar %18, lif %6, küme önemsiz | Ders d49 bölüm 10 (Cautun ve ark. 2014) |
| d49-pay-hacim | hacim sütunu 102'ye ölçeklendi (78 + 18 + 6 = 102, yuvarlama) | hesap; açıklamada yazar |
| d49-pay-hacim | yoğunluk ÷ ortalama ≈ kütle payı ÷ hacim payı: lif 50 ÷ 6 = 8,3; duvar 25 ÷ 18 = 1,39; boşluk 15 ÷ 78 = 0,19 | Ders d49 formüller; hesap |
| d49-sz-etkisi (bölüm 6) | termal SZ tayf biçimi g(x) = x⁴eˣ ÷ (eˣ − 1)² × [x (eˣ + 1) ÷ (eˣ − 1) − 4], x = hν ÷ kT | Carlstrom, Holder ve Reese 2002, denklem 2–3 (https://arxiv.org/abs/astro-ph/0208192) |
| d49-sz-etkisi | T = 2,725 K | Ders d8 (arka plan ışıması) |
| d49-sz-etkisi | sıfır noktası x = 3,830 → ν = 3,830 × kT ÷ h = 217,5 GHz | hesap (h, k SI tanımlı); Ders d49 bölüm 6 "yaklaşık 217 gigahertz"; Carlstrom "~218 GHz" |
| d49-sz-etkisi | arka plan tayfı x³ ÷ (eˣ − 1), ayrı ölçek | Planck yasası (Ders d27 çizimleriyle aynı formül ailesi); genlikler göreli, çizimde ve açıklamada yazar |
