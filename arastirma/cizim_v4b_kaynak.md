# cizim_v4b.js — d25 ve d26 ders çizimlerinin kaynakları

Tarih: 2026-10-30. Her satır: değer | nereden | hesap.
"Ders dNN bölüm k" = arastirma/dersler_v2/dNN.json, bolumler[k] (veri/dersler.json ile aynı dizin); dersin kendi kaynakları dNN_kaynak.md'de.
Hesaplar Node ile yapıldı (çizim kodundaki formüllerin aynısı).

## d25-isik-saati (d25 bölüm 5)

| değer | nereden | hesap |
|---|---|---|
| aynalar arası 3 m | Ders d25 bölüm 5, örnek | — |
| tren hızı 0,6 c (%60) | Ders d25 bölüm 5, örnek | — |
| c ≈ 3 × 10⁸ m/s | Ders d25 bölüm 5, örnek ("hesap kolay olsun diye") | — |
| yolcuya göre 10 ns | Ders d25 bölüm 5, örnek | 3 ÷ (3 × 10⁸) = 10⁻⁸ s |
| ışığın eğik yolu 3,75 m | Ders d25 bölüm 5, örnek | 3 ÷ √(1 − 0,6²) = 3,75 |
| trenin ilerlemesi 2,25 m | hesap (dersin denklemi: tren 0,6 × c × t ilerler) | 0,6 × 3,75 = 2,25; Pisagor 3,75² = 3² + 2,25² |
| raya göre 12,5 ns | Ders d25 bölüm 5, örnek | 3,75 ÷ (3 × 10⁸) = 12,5 × 10⁻⁹ s |
| tam tık sonu 25 ns | hesap | 2 × 12,5 |
| oran 1,25 = γ | Ders d25 bölüm 5, örnek | 12,5 ÷ 10; 1 ÷ √(1 − 0,36) = 1,25 |
| ölçek 1 m = 40 birim | çizim kararı; açıklamada "Uzunluklar ölçeklidir" | — |

## d25-lorentz-egrisi (d25 bölüm 6)

| değer | nereden | hesap |
|---|---|---|
| eğri γ = 1 ÷ √(1 − v²/c²) | Ders d25 bölüm 5–6, formüller | v/c 0–0,99556 arası çizildi (γ ≤ 10,6) |
| %10 → 1,005 | Ders d25 bölüm 6 | 1,0050 |
| %50 → 1,155 | Ders d25 bölüm 6 | 1,1547 |
| %86,6 → 2 | Ders d25 bölüm 6 | 1,9998 |
| %90 → 2,29 | Ders d25 bölüm 6 | 2,2942 |
| %99 → 7,09 | Ders d25 bölüm 6 | 7,0888 |
| %99,5 → 10 | Ders d25 bölüm 6 | 10,0125 |
| %99,99 → 70,7 (grafik dışı) | Ders d25 bölüm 6 | 70,7124 |
| yolcu uçağı γ − 1 ≈ 3,5 × 10⁻¹³ (250 m/s) | Ders d25 bölüm 6 | 250² ÷ (2 × 299.792.458²) = 3,48 × 10⁻¹³ |
| Parker sondası γ − 1 ≈ 2 × 10⁻⁷ (192 km/s) | Ders d25 bölüm 6 (JHUAPL) | 192.000² ÷ (2 × c²) = 2,05 × 10⁻⁷ |

## d25-ikizler (d25 bölüm 10)

| değer | nereden | hesap |
|---|---|---|
| uzaklık 4 ışık yılı, hız %80 | Ders d25 bölüm 10, örnek | — |
| Ayşe: gidiş 5 + dönüş 5 = 10 yıl | Ders d25 bölüm 10, örnek | 4 ÷ 0,8 = 5 |
| Can: her bacak 3 yıl, toplam 6 yıl | Ders d25 bölüm 10, örnek (ve bölüm 9 formülü Δτ = √(Δt² − Δx²)) | √(5² − 4²) = 3 |
| 4 yaş fark | Ders d25 bölüm 10, örnek | 10 − 6 |
| ışık 45° | Ders d25 bölüm 9 (ışık yılı ve yıl biriminde ışık hızı 1) | eksenler aynı ölçek (1 = 26 birim) |
| Can'ın çentikleri: her bacakta 3 eşit aralık | hesap | bacak başına öz zaman 3 yıl ÷ 3 |

## d26-asansor (d26 bölüm 2)

| değer | nereden | hesap |
|---|---|---|
| ivme 9,8 m/s² | Ders d26 bölüm 2 | — |
| topun art arda konumları 0 : 1 : 4 | hesap (eşit zaman aralığında düzgün ivmeli düşüş, yol ∝ t²) | t = 0, 1, 2 → 0, 1, 4; şematik |
| 2 m'lik asansörde 10 s'de ≈ 0,3 mm ayrılma | Ders d26 bölüm 2, örnek | 9,81 × 2 × 2 ÷ 6.357.000 = 6,2 × 10⁻⁶ m/s²; ½ × 6,2 × 10⁻⁶ × 10² = 3,1 × 10⁻⁴ m |
| çizim şematik | çizim kararı; açıklamada söylendi | — |

## d26-merkur (d26 bölüm 7)

| değer | nereden | hesap |
|---|---|---|
| gözlenen kayma 574,10″/yüzyıl | Ders d26 bölüm 7 (Tests of general relativity) | — |
| gezegenlerin payı 531,63″ | Ders d26 bölüm 7 | — |
| genel görelilik 42,98″ | Ders d26 bölüm 7 | — |
| kalan ≈ 43″ | Ders d26 bölüm 7 ("geriye yaklaşık 43 kalır") | 574,10 − 531,63 = 42,47; ± 0,65 ve ± 0,69 belirsizliklerle 42,98'e uyar |
| Le Verrier 1859: 38″ | Ders d26 bölüm 7 | — |
| tur başına ≈ 0,1″ | Ders d26 bölüm 7, örnek | 36.525 ÷ 87,969 = 415 tur; 43 ÷ 415 = 0,104 |
| tam tur ≈ 3 milyon yıl | Ders d26 bölüm 7, örnek | 1.296.000 ÷ 43 = 30.140 yüzyıl |
| çubuk ölçekli (574,10″ = 368 birim) | çizim kararı | — |
| yörünge şematik: e = 0,55, adım 35° | çizim kararı; açıklamada "çok abartıldı". Gerçek dışmerkezlik 0,2056 (NASA Mercury Fact Sheet, 2026-10-30'da okundu: https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html), yani çizimdeki basıklık abartılıdır | — |

## d26-gps (d26 bölüm 11)

| değer | nereden | hesap |
|---|---|---|
| yükseklik etkisi +45,85 μs/gün | Ders d26 bölüm 11, formüller (Error analysis for the GPS) | — |
| hız etkisi −7,21 μs/gün | Ders d26 formüller; bölüm 11 "7.214 ns" | — |
| net +38,64 μs/gün | Ders d26 formüller | 45,85 − 7,21 = 38,64 |
| ışık 38,6 μs'de ≈ 11,6 km | Ders d26 bölüm 11, örnek | 38,64 × 10⁻⁶ × 299.792,458 km/s = 11,58 km |
| hata günde ≈ 11 km | Ders d26 bölüm 11 ("kabaca 11 km"; Wikipedia 11,4 km) | — |
| fabrika ayarı 10,23 → 10,22999999543 MHz | Ders d26 bölüm 11 | — |
| çubuklar ölçekli (0–50 μs) | çizim kararı | — |
