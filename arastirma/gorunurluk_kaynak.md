# Görünürlük hesabı (v45) — kaynaklar, denklemler, lisanslar, karşılaştırmalar

Tarih: 2026-11-09. Soru: "Bu gece, buradan, 7×50 dürbünle görünür mü?" Cevap dört kaynaklı parçadan kurulur ve her yerde
"yaklaşık" diye işaretlenir. Kod: gorunurluk.js (saf hesap, Node'da da yüklenir), degisen.js (AAVSO VSX), gozlem.js (bağlama),
araclar/gok_parlakligi.py, araclar/hedef_boyut.py, araclar/degisen_verisi.py; testler testler/gorunurluk.spec.js.
Sütunlar: iddia | kaynak | kaynaktaki ifade ya da denklem. [B] = bu oturumda PDF/sayfa okundu; [H] = hesap; [U] = uygulama kodu.
Ezberden sayı yok: her sabit aşağıdaki bir satıra bağlıdır.

## 1. Gök parlaklığı — Falchi ve ark. 2016 atlası

### 1.1 Veri, iki DOI, lisans ve README çelişkisi

| İddia | Kaynak | Kaynaktaki ifade |
|---|---|---|
| Veri seti: "Supplement to: The New World Atlas of Artificial Night Sky Brightness", GFZ Data Services, sürüm 1.1 | DOI **10.5880/GFZ.1.4.2016.001** — https://doi.org/10.5880/GFZ.1.4.2016.001 ; DataCite API (api.datacite.org/dois/10.5880/GFZ.1.4.2016.001) [B] | "The data are stored in a 2.9 Gb geotiff file, on a 30 arcsecond grid. The map reports simulated zenith radiance data in [mcd/m^2]." ; "Note that the maps report artificial light only! The zenith radiance from natural sources such as stars and the Milky Way are not included" |
| Makale | DOI **10.1126/sciadv.1600377** — Falchi F. ve ark., "The new world atlas of artificial night sky brightness", Science Advances 2(6): e1600377, 3 Haziran 2016 (Crossref kaydı) [B] | DataCite ilişkisi: "IsSupplementTo 10.1126/sciadv.1600377" |
| Lisans: CC BY-NC 4.0 | DataCite rightsList: "Creative Commons Attribution Non Commercial 4.0 International", https://creativecommons.org/licenses/by-nc/4.0/legalcode ; veri sayfası sürüm geçmişi [B] | "Version History: 13 November 2019: change of the licence to CC BY NC 4.0 (after end of embargo period)." |
| İndirme: form gerekmedi | https://datapub.gfz.de/download/10.5880.GFZ.1.4.2016.001/ (dizin listesi açık) [B] | World_Atlas_2015.zip 653 MB (2019-11-18), NewWorldAtlas_ArtificialSkyBrightness.kmz 25 MB; zip içinde README.txt (1582 B, 2016-06-15), World_Atlas_2015.tif (3 012 927 014 B), World_Atlas_2015.tpk (387 MB) |
| **Çelişki:** zip içindeki README eski dağıtım yasağını taşıyor | README.txt, 15 Haziran 2016 [B] | "This data is subject to the license agreement specified by Fabio Falchi from ISTIL." ; "As of 15 June 2016, further distribution of these files and commercial use are both generally prohibited. Changes to this policy will be announced via the data access webpage." ; "All uses of this data must cite BOTH of the two following references: 1) http://doi.org/10.5880/GFZ.1.4.2016.001 … 2) http://dx.doi.org/10.1126/sciadv.1600377" |
| Çözüm | yorum | README'nin kendisi değişikliklerin veri erişim sayfasında duyurulacağını söylüyor; sayfa 13 Kasım 2019'da lisansı CC BY-NC 4.0'a çevirdi. Geçerli lisans CC BY-NC 4.0; Urania ticari değildir; türev (2′ ızgara) veri/LICENSE-falchi-atlas.txt ile iki atıf ve değişiklik notuyla dağıtılır. Ham zip/tif depoya girmez. |

### 1.2 Izgara (araclar/gok_parlakligi.py → veri/gok_parlakligi.u8.gz + .json)

| Ne | Değer | Dayanak |
|---|---|---|
| GeoTIFF yapısı | 43200 × 17406 piksel, 128×128 döşeme, float32, sıkıştırmasız; ModelTiepoint (−180°, 85.0541668645°), piksel 0.00833333° = 30″; GDAL_NODATA −3.4028234663852886e+38; GCS_WGS_1984 | TIFF IFD etiketleri (256, 257, 258, 259, 322, 323, 339, 33550, 33922, 34737, 42113) [B] |
| Birim | mcd/m² (yapay başucu parlaklığı) | DataCite açıklaması; sağlama: Ataşehir pikseli 8.12 mcd/m² → doğal 0.174 eklenince 17.79 kadir/yay sn² (ön bilgi 17.8) [H] |
| Pencere | 25.5–45.0° D, 35.5–42.5° K; 2′ hücre; 585 × 210 = 122 850 hücre; hücre = içine düşen 16 adet 30″ pikselin DOĞRUSAL ortalaması | görev metni; [H] |
| Kodlama | uint8; kod 0 = veri yok; kod c = 1…254 → L_art = 0.174 × (10^(0.4 × 0.1 × (c − 1)) − 1) mcd/m² (yapay ışığın doğal göğü kaç kadir parlattığı, 0.1 kadir adım); toplam kadir hatası ≤ 0.05; en büyük kod 63 | [H]; gzip 26 037 bayt (hedef ≈ 30 KB) |
| Doğal gök 174 µcd/m² = 22.0 kadir/yay sn² | Falchi 2016, s. 2 [B] | "We chose 22.0 mag/arcsec2, corresponding to 174 μcd/m2, as a typical brightness of the night sky background during solar minimum activity, excluding stars brighter than magnitude 7, away from Milky Way and from Gegenschein and zodiacal light." ; Tablo 1: "assumed to be 174 μcd/m2" ; özet: "equivalent to 1.7 × 10−4 cd/m2" |
| Dönüşüm cd/m² ↔ kadir/yay sn² | Unihedron (SQM üreticisi) dönüşüm sayfası http://unihedron.com/projects/darksky/magconv.php [B] | "[value in cd/m2] = 10.8×10^4 × 10^(-0.4*[value in mag/arcsec2])" ; "[value in mag/arcsec2] = Log10([value in cd/m2]/108000)/-0.4". Sağlama: 174 µcd/m² → 21.98 (makale 22.0; fark yuvarlamadan) [H] |
| Değişkenlik notu | Falchi 2016, s. 2 [B] | "Natural airglow variations, even during the same night, can cause more than half a magnitude variation in the background sky brightness at unpolluted sites." ; "brighter skies should typically be expected for observations made earlier in the night" (haritalar ~1 a.m. uydu geçişine kalibre) |
| Arayüz metni | [U] | "Bulunduğun yerde göğün tepesi yaklaşık X kadir/yay sn² (yapay ışık modeli, 2014–2015 uydu verisi)." Elle SQM girilirse "(elle girilen değer)"; pencere dışında kaydırıcıdan türetilir (Crumey (53) tersi, sayısal). |
| Bortle sınıfı | görev kuralı | yazılmaz |

### 1.3 Doğrulama noktaları (koordinatlar Nominatim, 2026-11-09)

| Yer | Koordinat | 30″ piksel | 2′ hücre (uygulama) | Ön bilgi (görev) | Lorenz 2025 atlası (görev, doğrulayıcı için) |
|---|---|---|---|---|---|
| Ataşehir (ilçe) | 40.9929, 29.1135 | 8.1205 mcd/m² → 17.79 | kod 42 → 7.42 mcd/m² → **17.88** | ≈ 17.8 | 7b, > 17.80 |
| Şile | 41.1744, 29.6125 | 0.9717 → 19.94 | kod 18 → 0.659 → **20.28** | ≈ 19.9 | 6a, 18.95–19.50 |
| Kilyos (Kumköy) | 41.2453, 29.0371 | 0.9490 → 19.96 | kod 20 → 0.827 → **20.08** | ≈ 19.9 | — |
| Tuz Gölü (Kulu) | 38.8594, 33.2915 | 0.0130 → 21.90 | kod 2 → 0.0168 → **21.88** | — | 3a, 21.51–21.69 |

Not: 30″ pikseller ön bilgiyle 0.1 içinde; 2′ hücre ortalaması Şile gibi küçük parlak yerleşimlerde çevreyle karıştığı için
0.3–0.4 daha karanlık çıkar (doğrusal ortalama; yeniden üretilebilir). Lorenz 2025 Şile bandından (18.95–19.50) daha karanlık:
Falchi 2015 verisidir, Lorenz 2025 daha yeni ve farklı modeldir — fark raporda "askıda" (gerçek SQM ölçümüyle sınanmalı).

## 2. Ay ışığı — Krisciunas & Schaefer 1991, PASP 103, 1033 ("KS91") [B: ADS taraması 1991PASP..103.1033K, 7 sayfa]

Kodda (gorunurluk.js) her denklem numarasıyla yorumlanmıştır. B nanoLambert (nL), V kadir/yay sn², Z başucu uzaklığı (derece), k kadir/hava kütlesi.

| Denk. | İfade (makaleden) | Kodda |
|---|---|---|
| (1) | B = 34.08 exp(20.7233 − 0.92104 V) (Garstang 1989 denk. 27) | `nL`, tersi `nLKadir` |
| (2) | B₀(Z) = B_zen 10^(−0.4 k (X − 1)) X | `B0` |
| (3) | X = (1 − 0.96 sin²Z)^(−0.5) ("scattering air mass") | `X` |
| (14) | X(Z) = [cos Z + 0.025 e^(−11 cos Z)]^(−1) ("extinction air mass", doğrudan görülen cisim için) | `Xs` — hedefin sönümlenmesi k·X(Z) |
| (15) | B_moon = f(ρ) I* 10^(−0.4 k X(Z_m)) [1 − 10^(−0.4 k X(Z))] | `Bmoon` |
| (17) | f_R(ρ) = C_R [1.06 + cos²ρ], C_R = 2.27 × 10⁵ (= 10^5.36) | `fSacilma` |
| (18) | f_M(ρ) = 10^(6.15 − ρ/40) (ρ ≥ 10°) | `fSacilma` |
| (19) | f_M(ρ) = 6.2 × 10⁷ ρ⁻² (ρ < 10°, Schaefer 1991) | `fSacilma` |
| (20) | I* = 10^(−0.4 (3.84 + 0.026 |α| + 4 × 10⁻⁹ α⁴)) | `Iyildiz` |
| (21) | f(ρ) = 10^5.36 [1.06 + cos²ρ] + 10^(6.15 − ρ/40) | `fSacilma` |
| (22) | ΔV = −2.5 log [(B_moon + B₀(Z)) / B₀(Z)] | `deltaV` |

Girdiler: Ay'ın evre açısı α (Astronomy Engine `Illumination('Moon').phase_angle`), Ay–hedef açısı ρ (ufuk koordinatlarından büyük
daire), Z_m ve Z, k. Uygulanmayanlar (makalede sayılan ikincil etkiler): |α| < 7° karşı-konum çarpanı 1.00–1.35, perige/apoje
±0.12 kadir, kırılma. Doğruluk: "8% to 23%". "Model Mauna Kea verisine uydurulmuştur; şehir göğünde yaklaşıktır" (görev) →
arayüzde "yaklaşık"; makale: "the values … only apply to a site with the same median extinction coefficient and mean dark-sky
brightness as the 2800-m level of Mauna Kea".

**Test (yeniden üretim):** Tablo 2 (k = 0.172, Z_m = 60°, V_zen = 21.587 → B_zen = 79.0 nL; ρ Ay ile başucundan geçen büyük
daire boyunca → Z = |60 − ρ|): 4 evre açısı × 5 ayrım = 20 B_moon değeri; kod ile tablo arasındaki en büyük göreli sapma %1.41
(tablo tam sayıya yuvarlı); ΔV(α = 90°, başucu) = −0.88 (tablo −0.88). testler/gorunurluk.spec.js.

### 2.1 Sönümleme katsayısı k

| Bileşen (V bandı, kadir/hava kütlesi) | Değer | Kaynak |
|---|---|---|
| Rayleigh | A_Ray(λ, h) = 9.4977×10⁻³ (1/λ)⁴ [(n−1)_λ/(n−1)_{λ=1}]² exp(−h/7.996), (n−1)_λ/(n−1)_{λ=1} = 0.23465 + 1.076×10²/(146 − λ⁻²) + 0.93161/(41 − λ⁻²), λ µm, h km; λ = 0.55 → **0.1066** deniz düzeyinde | Hayes & Latham 1975, ApJ 197, 593, denk. (1) [B: ADS 1975ApJ...197..593H s. 594] |
| Ozon | **0.016** | Green 1992, ICQ 14, 55 (http://www.icq.eps.harvard.edu/ICQExtinct.html) [B]: "We adopt Schaefer's (1992) value A_oz = 0.016 magnitudes per air mass for the small ozone component". Bu değer 510 nm (gece görüşü) bağlamında verilmiştir; HL75 ozon formülü (2) Gast 1960 kesit tablosunu ister, erişilemedi → V bandı için yaklaşık, **askıda** |
| Aerosol | 1.086 × AOD (550 nm, Open-Meteo/CAMS gece ortalaması; v44) | arastirma/hava_kaynak.md: Δm = 2.5 log10(e) τ ≈ 1.086 τ |
| AOD yokken toplam k | **0.30** | Schaefer 1990, PASP 102, 212, s. 213 [B]: "For good conditions, k_v might be 0.20 magnitude per air mass while more typical weather has a k_v value of 0.30 magnitude per air mass." |

Örnek: AOD 0.2, deniz düzeyi → k = 0.1066 + 0.016 + 0.217 = 0.340. Yükseklik: Rayleigh ölçek yüksekliği 7.996 km (HL75).

## 3. Görme eşiği — Crumey 2014, MNRAS 442, 2600; arXiv 1405.4209 [B: arXiv PDF, 21 sayfa]

Skotopik model (B ≤ 3.426 × 10⁻² cd/m² ≈ 16.2 kadir/yay sn² Unihedron dönüşümüyle; üstü mezopik, hesaplanmaz → "hesaplanamadı").

| Denk. | İfade | Kodda |
|---|---|---|
| (44) | q = 0.6 (B < 0.193 cd/m²) | `Q` |
| (47)–(49) | C = [((r₁B^(−1/4) + r₂)²/A)^(3/5) + (k₁B^(−1/4) + k₂)^(3/5)]^(5/3); r₁ = 6.505×10⁻⁴, r₂ = −8.461×10⁻⁴, k₁ = 7.633×10⁻³, k₂ = −7.174×10⁻³ (10⁻⁵ ≤ B ≤ 3.426×10⁻² cd/m²) | `R1 R2 K1 K2` |
| (53) | ΔI = F (6.505×10⁻⁴ B^(1/4) − 8.461×10⁻⁴ B^(1/2))² (çıplak göz nokta kaynak, lux); sıfır noktası Z = 2.54×10⁻⁶ lux | `esikler` (M = 1), `Z0` |
| (56) | ΔB∞ = F (7.633×10⁻³ B^(3/4) − 7.174×10⁻³ B) | `esikler` → `muSonsuz` |
| (58)–(63) | ΔB = ((ΔI/A)^q + ΔB∞^q)^(1/q); A_R = (r₁B^(−1/4)+r₂)²/(k₁B^(−1/4)+k₂); μ_lim = μ∞ − (2.5/q) log((A_R/A)^q + 1); r_R = 5.21 μ_sky − 76.2 | `yayginSinir`, `alphaTR` |
| (66) | B_a = (δ_min/p)² B / F_t | `esikler` |
| (67) | ΔI_a = (D/δ_max)² ΔI / F_t | `kazanc` |
| (68) | ΔI = (δ_max/D)² F_t F_M F_T F (r₁B_a^(1/4) + r₂B_a^(1/2))² | `esikler` → `m0` |
| (70)–(71) | B_a < 10⁻⁵ cd/m² → eşik sabit: ΔI_cut = ζ (p/D)² F_t F_M F_T F, ζ = 1.150×10⁻⁹ lx | `B_KESIM` |
| (72)–(73) | m_cut = 5 log D − 2.5 log(Z⁻¹ ζ p² F_t F_M F_T F) = 5 log D(cm) + 8.45 − 2.5 log F (p = 7 mm, F_t = 1.33, F_M = 1, F_T = √2) | test: D = 10 cm, F = 2 → 12.70 |
| (77)–(81) | C = φ((R_a/A_a)^q + C_a^q)^(1/q), φ ≡ F_T F_M F; R_a = (r₁/B_a^(1/4) + r₂)²; A_a = M²A; C_a = k₁/B_a^(1/4) + k₂; A_TR = R_a/(M² C_a) | `esikler` |
| (84)–(88) | μ_lim = μ∞ − (2.5/q) log((α_TR/α)^q + 1); μ∞ = μ_sky − 2.5 log(φ C_a); m₀ = μ_sky + 2.5 log(π²/(60⁴180²) · M²/(φ R_a B)); m_lim = m₀ − (2.5/q) log((α/α_TR)^q + 1) | `yayginSinir`, `yayginKadirSinir` |

Dürbün değerleri (görev): D = 50 mm, M = 7, çıkış göz bebeği 7.14 mm, geçirgenlik makalenin değeri F_t = 1.33 ("75 per cent
transmittance"), F_M = 1. **İki gözle bakmanın kazancı:** Crumey §1.6.4 — "theoretical considerations suggested that the factor
on the left should be √2, and if threshold is equal in both eyes then this means the monocular threshold is √2 times the binocular
value. This is the factor that was assumed by Schaefer (1990) (his F_b)"; Schaefer 1990 s. 213: "the difference in sensitivity is a
factor of the square root of two (which corresponds to 0.38 magnitude)" (Pirenne 1943). Model Blackwell'in İKİ GÖZLE yapılan
ölçümlerine dayandığı ("Observers viewed targets using unconstrained (direct or averted) binocular vision") ve dürbünde iki gözle
bakıldığı için F_T = 1 alınır: kazanç ayrıca eklenmez, kayıp da uygulanmaz. (Teleskop için F_T = √2.) Not: Crumey dürbün için
F_T değerini açıkça yazmaz (10×50 örneğinde de belirtmez); F_T = 1, §1.6.4'teki "√2 tek göz içindir" ifadesinden ÇIKARIMDIR.

**Göz bebeği:** Schaefer 1990 denk. (5): D_e = 7 mm exp(−0.5 [A/100]²), A yaş (Kumnick 1954; Kadlecova, Peleska & Vasko 1958).
Yaş sorulmaz; varsayılan A = 40 → 6.46 mm (gösterim 6,5); konum panelinden 2–9 mm girilebilir. Çıkış göz bebeği (7.14) göz
bebeğinden büyükse ışığın bir kısmı boşa gider: (66)–(67) bunu δ_min/δ_max ile hesaba katar.

**Alan katsayısı F:** Crumey: "for illustrative purposes a notional value F = 2 (limit 6.18 mag) could be taken as a typical
overall field factor" (çıplak gözle μ_sky 21.83'te 6.18 kadir; F 1.4–2.4 arası 5.98–6.57). Kodda F = 2. Modeldeki kaynaklı tek
ayar katsayısı budur; AL karşılaştırması (aşağıda) değiştirmeyi gerektirmedi.

**Etiket bandı:** fark = eşik − hedef (kadir). ≥ +0.5 görünür; −0.5 < fark < +0.5 zor; ≤ −0.5 görünmez. ±0.5: atlasın gece içi
havaışığı oynaması (Falchi: yarım kadirden fazla), Ay modelinin %8–23'ü (≈ 0.1–0.25 kadir) ve F aralığının (1.4–2.4 ≈ ±0.3 kadir)
birleşik belirsizliği için Urania'nın seçimi [Y].

**Testler (yeniden üretim):** M33 örneği (§3.1): μ_sky = 21.83 (B = 2×10⁻⁴ cd/m²), F = 1.378, çıplak göz → μ∞ 24.59 (makale 24.59),
m₀ 6.59 (6.59), yarıçap 18.7′ için μ_lim 22.43 (22.43), m_lim 5.94 (5.93), Ricco yarıçapı 37.6′ (37.6); hedef 5.93 kadir, 18.7′
yarıçap → fark 0.00, oran 10^(−0.4·fark) = 1.00. Denk. (73): 12.70. Çıplak göz F = 2: 6.18.

### 3.1 Hedef boyutları ve parlaklıkları — OpenNGC (veri/hedef_boyut.json, araclar/hedef_boyut.py)

| İddia | Kaynak | İfade |
|---|---|---|
| OpenNGC CC BY-SA 4.0 | https://github.com/mattiaverga/OpenNGC README [B] | "OpenNGC is released under CC-BY-SA-4.0 license" |
| Alanlar | database_files/NGC.csv ve addendum.csv (2026-11-09 indirildi) | MajAx, MinAx (yay dk), B-Mag, V-Mag, SurfBr (B bandı, 25 kadir eş-ışık eğrisi içi ortalama) |
| 26 hedefin 21'i OpenNGC'de (19 Messier + NGC 869/884 NGC.csv; Mel 111, Cr 399 addendum) | [B] | M45 OpenNGC NGC.csv'de yok (Mel022 addendum'da var, kullanılmadı: boyut/kadir hedefler.json'dan); M35 ve M22 V-Mag boş → hedefler.json kadiri; Mel 111 kadir boş → hedefler.json 1.8 |
| Albireo, Mizar, Alcor | — | yıldız; nokta kaynak |
| Türetilmiş dosya | veri/hedef_boyut.json | kendi lisans notu (CC BY-SA 4.0 + hedefler.json kaynakları) ve alan başına kaynak |

Yaygın cisim yüzey parlaklığı: μ = m + 2.5 log(α · 3600) (α = π/4 · a · b yay dk²; elips). Kümeler yıldızlara çözülür; model
onları da toplam ışığı yayılmış tek cisim sayar (yaklaşım, [Y]).

### 3.2 Parlak çekirdekli cisimler (M42, M31) — ölçüm

Ortalama yüzey parlaklığı modeli (Z = 30°, Ay yok, k = 0.30, F = 2) "görünür" demek için gereken en parlak başucu göğü:
**M31 20.7 kadir/yay sn², M42 20.3.** Crumey'nin kendi M31 hesabı (§3.1, De Vaucouleurs 1958 profili ile): "with F = 2 the galaxy
should become just visible at approximately μ_sky = 19.2 mag arcsec⁻²" ve "M31 should be an easy naked-eye target for average
observers under moderately dark conditions". Yani ortalama yüzey parlaklığı yaklaşımı M31 için ≈ 1.5 kadir kötümserdir (çekirdek
çok daha parlak); M42 için makalede karşılaştırma yok, AL "kolay" sınıfındadır. Bu kötümserlik koda düzeltme olarak girilmedi
(profil verisi yok; [askıda]); etiket "yaklaşık" ve gerekçe kutusu ortalama yüzey parlaklığını açıkça yazar.

### 3.3 Kalibrasyon — Astronomical League Binocular Messier Program, Appendix A

Kaynak: https://www.astroleague.org/binocular-messier-program-appendix-a/ [B, 2026-11-09]. "Appendix A – 7×35, 7×50, and 10×50
Binoculars"; yalnız dereceler olgu olarak alındı (metin kopyalanmadı): I. Easy (42 cisim), II. Tougher (18), III. Challenge (16).
Bizim 19 Messier hedefimizin **hepsi "Easy"** listesinde (M3, 5, 6, 7, 8, 11, 13, 22, 27, 31, 35, 36, 37, 38, 39, 42, 44, 45, 92).
Derecelerin hangi gök için verildiği sayfada yazmıyor; karşılaştırma birkaç gök düzeyinde yapıldı (Z = 30°, Ay yok, k = 0.30, F = 2):

| Hedef | kadir | boyut (′) | μ_hedef | görünür için gereken gök | @22.0 | @21.0 | @20.0 | @19.0 | @17.9 | AL |
|---|---|---|---|---|---|---|---|---|---|---|
| M45 | 1.2 | 110×110 | 20.0 | 17.3 | G | G | G | G | G | kolay |
| M42 | 4.0 | 90×60 | 22.0 | 20.3 | G | G | Z | Z | X | kolay |
| M31 | 3.44 | 177.8×69.7 | 22.3 | 20.7 | G | G | Z | X | X | kolay |
| M44 | 3.1 | 108.6 | 21.9 | 20.2 | G | G | Z | Z | X | kolay |
| M13 | 5.8 | 16.5 | 20.5 | 18.8 | G | G | G | G | Z | kolay |
| M8 | 5.8 | 45×30 | 22.3 | 21.0 | G | Z | Z | X | X | kolay |
| M7 | 3.3 | 22.2 | 18.7 | 16.4 | G | G | G | G | G | kolay |
| M6 | 4.2 | 15.6 | 18.8 | 16.4 | G | G | G | G | G | kolay |
| M22 | 5.1 | 12.6 | 19.2 | 16.7 | G | G | G | G | G | kolay |
| M35 | 5.3 | 24 | 20.8 | 19.0 | G | G | G | Z | Z | kolay |
| M36 | 6.0 | 7.2 | 18.9 | 16.8 | G | G | G | G | G | kolay |
| M37 | 5.6 | 11.4 | 19.5 | 17.4 | G | G | G | G | G | kolay |
| M38 | 6.4 | 9.6 | 19.9 | 18.5 | G | G | G | G | Z | kolay |
| M39 | 4.6 | 19.5 | 19.7 | 17.2 | G | G | G | G | G | kolay |
| M11 | 5.8 | 9 | 19.2 | 17.1 | G | G | G | G | G | kolay |
| M27 | 7.4 | 6.7 | 20.2 | 19.6 | G | G | G | Z | Z | kolay |
| M92 | 6.52 | 14.4 | 20.9 | 19.7 | G | G | G | Z | X | kolay |
| M3 | 6.39 | 16.2 | 21.1 | 19.8 | G | G | G | Z | X | kolay |
| M5 | 5.95 | 15 | 20.5 | 18.8 | G | G | G | G | Z | kolay |
| NGC 869 | 3.7 | 14.4 | 18.1 | 16.4 | G | G | G | G | G | — |
| NGC 884 | 3.8 | 10.5 | 17.5 | 16.4 | G | G | G | G | G | — |
| Mel 111 | 1.8 | 253.5 | 22.4 | 20.9 | G | G | Z | X | X | — |
| Cr 399 | 3.6 | 70 | 21.5 | 19.6 | G | G | G | Z | X | — |
| Albireo | 3.08 | nokta | — | 16.4 | G | G | G | G | G | — |
| Mizar | 2.22 | nokta | — | 16.4 | G | G | G | G | G | — |
| Alcor | 4.01 | nokta | — | 16.4 | G | G | G | G | G | — |

G = görünür, Z = zor, X = görünmez. Uyum: AL "kolay" 19 cismin 19'u 21.0'da ve 20.0'da görünür ya da zor; 19.0'da 17/19 (M31 ve
M8 görünmez); 17.9 (Ataşehir) göğünde 8/19 görünmez. Yorum: kent dışı/banliyö göğünde (≥ 20) model AL ile uyumlu; kent
merkezinde ayrışma beklenen yönde (yaygın ve sönük cisimler). F'yi 1.4 ya da 2.4 yapmak 20.0'daki uyumu değiştirmedi (19/19);
F = 2 korundu.

## 4. Arayüz

- Dürbün hedefleri ve Bu gecenin planı: her hedefin yanında "görünür / zor / görünmez (yaklaşık)" düğmesi; dokununca gerekçe:
  gök parlaklığı (başucu ve hedef yönü, Ay'ın katkısı), yükseklik ve sönümleme, hedefin yüzey parlaklığı (ya da kadiri) ile eşik,
  fark ve band, kaynak notu. Özet: "Bulunduğun yerde göğün tepesi yaklaşık X …" ve "Bu gece dürbünle görebileceğin en sönük yıldız
  yaklaşık X kadir, çıplak gözle Y (karanlığın ortası, başucu)". Ayarlar (konum paneli): elle SQM, göz bebeği.
- Ders d11 Bölüm 11'e iki paragraf (arastirma/dersler_v2/d11.json; kaynaklar d11_kaynak.md "v45 ekleme").

## 5. Değişen yıldızlar — AAVSO VSX

| İddia | Kaynak | İfade |
|---|---|---|
| Uç | https://vsx.aavso.org/index.php?view=api.object&ident=<ad>&format=json&data=<n>&fromjd=<jd> [B, 2026-11-09 Mira / EG And / UU Aur] | Yanıt: VSXObject { Name, AUID, RA2000, Declination2000, VariabilityType, Period, MaxMag, MinMag, …, Data.Observation[] { JD, Mag, Band ("Vis.", "V", "TG"…), ObsType ("Visual", "CCD", "DSLR"), ValFlag, Uncertainty, ObsCode, ObsName, ObsCountry, ObsAffil, Comments, … } }. Parametreler resmî belgede değil; davranış testler/veri/vsx fixture'larıyla sabitlendi. CORS başlığıyla tarayıcıdan okunabildi. |
| Yalnız vsx.aavso.org | görev | www.aavso.org bot doğrulaması gösteriyor; denenmedi. CSP connect-src'ye yalnız https://vsx.aavso.org eklendi. |
| Kişisel veri | araclar/degisen_verisi.py `temizle`, degisen.js `ozetle` | Fixture'da ve önbellekte yalnız JD, Mag, Band, ObsType, ValFlag, Uncertainty / yalnız ortanca ve sayı; ObsCode, ObsName, ObsCountry, ObsAffil, Comments, Charts, Comp*, CMag, KMag, Id, Name (gözlem düzeyi) atılır; test tarar. |
| Ölçüm tanımı | görev | son 7 günün GÖRSEL tahminleri (Band "Vis." ya da ObsType "Visual"); "<" (daha sönük) sınır kayıtları ve ValFlag T sayılmaz; ortanca ve sayı; 12 saat önbellek (U.yaz 'vsx1_<ad>': yalnız özet — ortanca, sayı, son tahminin JD'si, toplam kayıt sayısı, yıldız adı; ham kayıt ve gözlemci alanı yok). Mira 2026-11-09: 8 görsel tahmin, ortanca 7.2 (fixture). |
| Dürbün Programı listesi | https://mintaka.aavso.org/sites/default/files/BinocularProgramStars-2017_1.csv [B] | 192 satır; 154 koordinatlı; dik açıklık > −30°: 110 yıldız (veri/durbun_degisenleri.json). Sütunlar Name, N/S, AUID, Coords, Const, Type, Period, Mag, Min FOV/Lim Mag, Notes. |
| Atıf | AAVSO Data Usage Guidelines, 1 Ekim 2025 PDF: https://mintaka.aavso.org/sites/default/files/2025-10/Data_Usage_25-10-01.pdf [B] | AID: "We gratefully acknowledge the contributions of the AAVSO observer community, whose [photometric, spectroscopic, solar, exoplanet] data and metadata resources were used in this study and made available through the AAVSO's scientific archives." ; VSX: "Watson, C. L., Henden, A. A., and Price, A., "The International Variable Star Index (VSX)", Society for Astronomical Sciences Annual Symposium, vol. 25, p. 47, 2006." |
| Tür kısaltmaları | GCVS değişken türleri (liste Type sütunu: M, SR*, L*, RCB, RV*, ZAND, E, SDOR) | arayüzde kısaltma gösterilir, Türkçe açıklama yalnız ad düzeyinde ("Mira türü", "yarı düzenli", "düzensiz", "simbiyotik (Z And)", "örten çift", "R CrB türü", "RV Tau türü", "S Dor türü") |

## 6. Askıda kalanlar
- Ozon sönümlemesinin V bandı değeri (0.016, 510 nm bağlamından; HL75 denk. (2) için Gast 1960 kesitleri erişilemedi).
- Parlak çekirdekli cisimlerde (M31, M42) ortalama yüzey parlaklığı kötümserliği (≈ 1.5 kadir M31); profil verisi yok.
- Kümeler için "yaygın tek cisim" yaklaşımı (yıldızlara çözülme hesaba katılmadı).
- Şile 2′ hücresi (20.3) ile Lorenz 2025 bandı (18.95–19.50) farkı ve Tuz Gölü (21.88) ile Lorenz 3a bandı (21.51–21.69) farkı
  (0.2 daha karanlık); gerçek SQM ölçümü yok. Falchi 2015 verisi ile Lorenz 2025 farklı yıl ve farklı modeldir.
- Dürbünde F_T = 1 (iki göz) Crumey §1.6.4'ten çıkarımdır; makale dürbün için F_T'yi açıkça yazmaz.
- Yapay gök parlaklığının başucu uzaklığıyla değişimi doğal gök yasasıyla (KS91 (2)) ölçeklendi; kent göğünde ufka doğru
  artış daha dik olabilir.
- Ay karşı-konum etkisi (|α| < 7°, ×1.00–1.35) uygulanmadı.
