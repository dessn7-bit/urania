# cizim_v4c.js — d27, d28, d30, d33 ders çizimlerinin kaynakları

Tarih: 2026-10-30. Her satır: çizim | değer | kaynak/hesap.
"Ders dNN bölüm k" = arastirma/dersler_v2/dNN.json'daki metin (kendi kaynakları dNN_kaynak.md'de). Bölüm dizinleri 0 tabanlıdır.
Hesaplar cizim_v4c.js içinde tarayıcıda yapılır; aşağıdaki sayılar aynı formüllerle Node'da yeniden hesaplanarak denetlendi.
Sabitler (SI'da tanımlı, kesin): h = 6,62607015 × 10⁻³⁴ J·s (Ders d27 bölüm 1), k = 1,380649 × 10⁻²³ J/K (Ders d30 bölüm 3),
c = 299.792.458 m/s (Ders d28 bölüm 11 örneği), e = 1,602176634 × 10⁻¹⁹ C (Ders d33 bölüm 1).

## d27 · Kuantuma giriş I

| çizim | değer | kaynak/hesap |
|---|---|---|
| d27-morotesi-felaketi (bölüm 0) | T = 5772 K (Güneş yüzeyi) | Ders d27 bölüm 1 örneği (d2'den) |
| d27-morotesi-felaketi | Planck eğrisi B = 2hc² ÷ λ⁵ ÷ (e^(hc/λkT) − 1) | formül: https://en.wikipedia.org/wiki/Planck%27s_law ; tepeye bölündü (göreli) |
| d27-morotesi-felaketi | Rayleigh–Jeans B = 2ckT ÷ λ⁴ (eş bölüşüm) | formül: https://en.wikipedia.org/wiki/Rayleigh%E2%80%93Jeans_law ; aynı Planck tepesine bölündü |
| d27-morotesi-felaketi | tepe ≈ 502 nm | hesap: Wien, 2,898 × 10⁻³ m·K ÷ 5772 K = 502,0 nm (Wien sabiti Ders d27 bölüm 2 örneği; kodda CODATA 2,897771955 × 10⁻³) |
| d27-morotesi-felaketi | görünür bant 380–700 nm | Ders d33 bölüm 10 örneği |
| d27-morotesi-felaketi | eksen 0–3000 nm, 0–1,6; RJ eğrisi 1,6'da kırpılıp okla "sonsuza gider" | çizim kararı; açıklamada söylendi |
| d27-fotoelektrik (bölüm 3) | iş fonksiyonu 2,3 eV (varsayımsal metal) | Ders d27 bölüm 3 örneği |
| d27-fotoelektrik | cıva çizgileri 546,1, 365,0, 253,5 nm | Ders d27 bölüm 3 örneği (QuarkNet Millikan analizi) |
| d27-fotoelektrik | frekanslar 5,49, 8,21, 11,83 × 10¹⁴ Hz | hesap: f = c ÷ λ |
| d27-fotoelektrik | foton enerjisi 546,1 nm → 2,27 eV (< 2,3: elektron yok) | hesap: h × f ÷ e = 2,270 eV; ders de 2,27 eV |
| d27-fotoelektrik | durdurma gerilimi 1,10 V ve 2,59 V | hesap: h × f ÷ e − 2,3 = 1,097 ve 2,591 V; ders 1,10 ve 2,59 |
| d27-fotoelektrik | eşik ≈ 539 nm (5,56 × 10¹⁴ Hz) | hesap: 2,3 eV ÷ h = 5,561 × 10¹⁴ Hz; c ÷ f = 539,06 nm (ders: 1239,84 ÷ 2,3) |
| d27-fotoelektrik | eğim = h ÷ e | Ders d27 bölüm 3 örneği ("durdurma geriliminin frekansla değişim hızı doğrudan h'yi verir") |
| d27-tek-tek-elektron (bölüm 9) | 8, 270, 2000, 60.000 elektron | Ders d27 bölüm 9 (Tonomura ve ark. 1989) |
| d27-tek-tek-elektron | nokta yerleri | benzetim: yoğunluk ∝ cos²(7π(u − 0,5)) × e^(−((u − 0,5)/0,3)²), sabit tohumlu (1989) mulberry32 ile ret örneklemesi; son karede 90 sütunlu sayım, koyuluk = sayı ÷ en büyük sayı. Şerit sayısı ve zarf şematik; açıklamada "bilgisayarla rastgele seçildi; gerçek fotoğraf değildir" denir |

## d28 · Kuantuma giriş II

| çizim | değer | kaynak/hesap |
|---|---|---|
| d28-pauli-kutulari (bölüm 4) | He 2, Li 3, Ne 10 elektron; 1s'ye 2, 2. düzeye 4 orbital × 2 = 8 | Ders d28 bölüm 4 ve örneği (Wikipedia: Pauli exclusion principle) |
| d28-pauli-kutulari | basamak aralıkları | şematik; açıklamada söylendi |
| d28-tunelleme (bölüm 6) | geçme olasılığı T = 1 ÷ (1 + V₀² sinh²(κa) ÷ (4E(V₀ − E))) | https://en.wikipedia.org/wiki/Rectangular_potential_barrier (wikitext'te T formülü; kaynak metinden okundu) |
| d28-tunelleme | E = V₀ ÷ 2 ("engel yüksekliği enerjinin 2 katı") | çizim kararı; bu durumda T = 1 ÷ cosh²(κa) |
| d28-tunelleme | ince engel κa = 1,5 → T ≈ %18 | hesap: 1 ÷ cosh²(1,5) = 0,1807 |
| d28-tunelleme | iki kat kalın κa = 3 → T ≈ %1 | hesap: 1 ÷ cosh²(3) = 0,00987 |
| d28-tunelleme | ≈18 kat az | hesap: 0,1807 ÷ 0,00987 = 18,3 |
| d28-tunelleme | kuyruk genliği √T; dalga biçimi | √T: olasılık genliğin karesi (Ders d27 bölüm 10, Born kuralı); dalga çizimi şematik |
| d28-gamow-tepesi (bölüm 7) | T = 15 milyon K | https://arxiv.org/pdf/astro-ph/0405568 Tablo 1 (T₆ = 15); ders bölüm 7 "Güneş'in merkezine yakın koşullarda" |
| d28-gamow-tepesi | ısıl enerji kT ≈ 1,3 keV | hesap: 8,617 × 10⁻⁵ eV/K × 1,5 × 10⁷ K = 1,293 keV (ders 15,6 milyon K için 1,3 keV der) |
| d28-gamow-tepesi | Gamow enerjisi E_G = 0,978 × μ × Z₁²Z₂² MeV = 489 keV (p + p, μ = 0,5) | astro-ph/0405568 bölüm 2 |
| d28-gamow-tepesi | eğriler e^(−E/kT), e^(−√(E_G/E)) ve çarpımları, her biri ayrı ölçekli | aynı derleme; ölçekleme çizim kararı, açıklamada söylendi |
| d28-gamow-tepesi | tepe ≈ 5,9 keV | hesap: E₀ = (E_G × (kT)² ÷ 4)^(1/3) = 5,89 keV; derleme Tablo 1: 5,9 keV; ders bölüm 7: 5,9 keV |
| d28-gamow-tepesi | engel 550 keV, çizim kenarının ≈27 katı | Ders d28 bölüm 7; hesap 550 ÷ 20 = 27,5 |

## d30 · Enerji, ısı ve entropi

| çizim | değer | kaynak/hesap |
|---|---|---|
| d30-carnot (bölüm 5) | verim = 1 − T_soğuk ÷ T_sıcak | Ders d30 bölüm 5 |
| d30-carnot | soğuk taraf 298 K (25 °C), örnek 823 K (550 °C) | Ders d30 bölüm 5 örneği |
| d30-carnot | %63,8 (≈%64), atılan en az %36 | hesap: 1 − 298 ÷ 823 = 0,6379; ders 0,638 |
| d30-carnot | eksen 298–1300 K | çizim kararı |
| d30-paralar (bölüm 7) | 4 para: 16 sıralama, sütunlar 1, 4, 6, 4, 1; YYTT…TTYY | Ders d30 bölüm 7 örneği; hesap C(4,k) |
| d30-paralar | 100 para: tam 50 yazı %8,0 | hesap: C(100,50) ÷ 2¹⁰⁰ = 0,0796; ders "%8" |
| d30-paralar | 40–60 arası %96 | hesap: Σ C(100,k) ÷ 2¹⁰⁰, k = 40…60 = 0,9648; ders "%96" |
| d30-paralar | hepsi yazı 1 / 1,27 × 10³⁰ | hesap: 2¹⁰⁰ = 1,268 × 10³⁰; ders aynı |
| d30-foton-akisi (bölüm 12) | Güneş yüzeyi 5772 K, Dünya ≈254 K | Ders d30 bölüm 12 (NASA Earth Fact Sheet: 254 K) |
| d30-foton-akisi | gelen tepe ≈ 500 nm | Ders d30 bölüm 12 ("yaklaşık 500 nm"); Wien hesabı 502 nm |
| d30-foton-akisi | çıkan tepe ≈ 11 μm | hesap: Wien, 2,898 × 10⁻³ m·K ÷ 254 K = 11,4 μm |
| d30-foton-akisi | ≈20 foton; oran 5772 ÷ 254 ≈ 23 | Ders d30 bölüm 12 ve örneği (Chaisson: "yaklaşık 20 kat"); hesap 22,7 |
| d30-foton-akisi | ≈240 W/m² | Ders d30 bölüm 12 örneği: 1361 × (1 − 0,294) ÷ 4 |
| d30-foton-akisi | 1 gelen ok, 20 çıkan ok; dalga boyları ölçeksiz | şematik; açıklamada söylendi |

## d33 · Elektrik, manyetizma ve ışık

| çizim | değer | kaynak/hesap |
|---|---|---|
| d33-faraday (bölüm 6) | itme → akım, durma → akım yok, çekme → ters akım | Ders d33 bölüm 6 (Faraday 1831; "mıknatıs hareketsiz kaldığında … akım da doğmaz") |
| d33-faraday | ibre sapması ±40°, sargı ve alet biçimi | şematik |
| d33-c-dogrusu (bölüm 9) | μ₀ = 1,25663706127 × 10⁻⁶ N/A², ε₀ = 8,8541878188 × 10⁻¹² F/m | Ders d33 bölüm 9 örneği (NIST CODATA 2022) |
| d33-c-dogrusu | c ≈ 299.792 km/s | hesap: 1 ÷ √(μ₀ε₀) = 2,99792 × 10⁸ m/s |
| d33-c-dogrusu | 50 Hz → ≈6000 km | Ders d33 bölüm 10 örneği; hesap c ÷ 50 = 5996 km |
| d33-c-dogrusu | Jansky 20,5 MHz → 14,6 m | Ders d33 bölüm 11; hesap c ÷ 20,5 MHz = 14,62 m |
| d33-c-dogrusu | mikrodalga 2,45 GHz → ≈12 cm | Ders d33 bölüm 10 ve örneği; hesap 0,122 m |
| d33-c-dogrusu | yeşil 550 nm → ≈545 THz | Ders d33 bölüm 10 örneğindeki 550 nm; hesap c ÷ 550 nm = 545,1 × 10¹² Hz |
| d33-c-dogrusu | eksenler: frekans 1–10¹⁶ Hz, dalga boyu 10⁻⁸–10⁸ m, log–log | çizim kararı |
| d33-alan-merdiveni (bölüm 13) | Dünya yüzeyi 0,22–0,67 G | Ders d33 bölüm 13 ve örneği; BGS (2026-10-30'da yeniden okundu): "At the Earth's surface the total intensity varies from 22,000 nanotesla (nT) to 67,000 nT", "1 Gauss = 100,000 nT" |
| d33-alan-merdiveni | buzdolabı mıknatısı ≈100 G (0,01 T) | Ders d33 bölüm 5 ("yaklaşık 10.000 mikrotesla, yani 0,01 tesla") |
| d33-alan-merdiveni | Güneş lekesi ≈3000 G (0,3 T) | Ders d33 bölüm 13 (d4; HAO/UCAR) |
| d33-alan-merdiveni | MR 1,5–3 T = 15.000–30.000 G | Ders d33 bölüm 5 (Radiopaedia); hesap 1 T = 10.000 G |
| d33-alan-merdiveni | leke ÷ Dünya ≈ 4500–14.000 kat | hesap: 3000 ÷ 0,67 = 4478 → 4500; 3000 ÷ 0,22 = 13.636 → 14.000; ders "4500 ile 14.000" |
| d33-alan-merdiveni | leke MR'ın beşte biri ile onda biri | Ders d33 bölüm 13 örneği: 0,3 ÷ 1,5 = 0,2; 0,3 ÷ 3 = 0,1 |
| d33-alan-merdiveni | eksen 0,1–10⁵ G, logaritmik | çizim kararı |
