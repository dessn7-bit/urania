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


---

# v46 (2026-11-09) — modelin düzeltilmesi ve gözlemle karşılaştırma

## 7. Sorun ve düzeltilen kurallar

v45 modeli Ataşehir göğünde (17,9) M44, M42 ve M31 için "görünmez" derken aynı gece dürbün yıldız sınırını 8,9 kadir veriyordu;
M44'ün en parlak üyeleri 6,3–6,6 kadir (SIMBAD). İki neden: (1) açık kümeler tek yaygın cisim sayılıyordu; (2) parlak çekirdekli
cisimlerde ortalama yüzey parlaklığı kullanılıyordu (v45 raporu M31 için ≈ 1,5 kadir kötümser ölçmüştü).

| Kural | v45 | v46 |
|---|---|---|
| Açık kümeler (hedefler.json türü `acik_kume`: M45, M44, M6, M7, M11, M35, M36, M37, M38, M39, NGC 869, NGC 884, Mel 111; `yildiz_kumesi_asterizm`: Cr 399) | yalnız yaygın ışık yolu | + **üye yolu**: en parlak 5 üyenin V'si (SIMBAD); o gecenin nokta kaynak sınırından (Crumey (68)) parlak üye sayısı ≥ 3 → "görünür (yıldızları seçilir)". Sonuç iki yolun iyisi; gerekçe kutusu yolu yazar. |
| Küresel kümeler (M3, M5, M13, M22, M92) | yaygın | yaygın (7×50'de yıldızlara ayrılmaz; üye yolu eklenmedi) |
| M31 | ortalama yüzey parlaklığı | **profil yolu**: de Vaucouleurs 1958 eş-ışık eğrileri (alan, bütünleşik B), B − V = 0,91 ile V; her iç bölge Crumey (84) sınırıyla karşılaştırılır, en iyi iç bölge sonucu verir (Crumey 2014 §3.1 yöntemi) |
| M42 | ortalama yüzey parlaklığı | + merkez yıldızları testi (Orion Bulutsusu Kümesi üyeleri: θ¹ Ori C V 5,13, θ² Ori B 6,38, θ² Ori A 6,39, θ¹ Ori D 6,70, θ¹ Ori A 6,73) — kümelerle aynı kural |
| M8 | yaygın | yaygın; iç bölge (Kum Saati) için yayımlanmış yüzey parlaklığı ve boyut bulunamadı → yaygın yol "görünmez" derse **"belirsiz: çekirdek verisi yok"** |
| Genel | — | veri eksikse ya da gök modelin kapsamı dışındaysa kesin "görünmez" yazılmaz, **"belirsiz"** + neden |
| Zor bandı | ±0,5 kadir (Urania'nın seçimi) | aynı; üye yolunda "görünür" sınırı görev kuralı gereği fark ≥ 0 (3. parlak üye sınırın üstünde), "zor" −0,5 < fark < 0 (Urania'nın seçimi) |

## 8. Küme üyeleri — kaynaklar (veri/kume_uyeleri.json, araclar/kume_uyeleri.py)

| İddia | Kaynak | İfade / yöntem |
|---|---|---|
| V parlaklıkları | SIMBAD TAP aynası https://simbad.cfa.harvard.edu/simbad/sim-tap (ADQL, `allfluxes.V`) [B, 2026-11-09] | ε Cnc 6,29; 39 Cnc 6,39; 40 Cnc 6,61 (görev metnindeki değerlerle birebir; 40 Cnc üyeliği %75–100 ile geçerli ama parlaklık sırasında 6. olduğu için "en parlak 5" dosyasına girmedi — 4. 35 Cnc 6,56, 5. HD 73598 6,60); θ¹ Ori C 5,13 |
| Üyelik | SIMBAD `h_link` tablosu (child, parent, membership %, link_bibcode): yayımlanmış üyelik kataloglarından bağlar; her yıldızda kaynak makalelerin ADS bibcode'ları saklanır (örn. 2018A&A...618A..93C Cantat-Gaudin ve ark. 2018; 2020A&A...633A..99C Cantat-Gaudin & Anders 2020; 2024A&A...691A..28K Hunt & Reffert; 1997AJ....113.1733H Hillenbrand 1997 ONC; 2007ApJS..172..663S Stauffer 2007 Pleiades; 2001A&A...373..159C Mel 111) | kural: en az bir kaynakta üyelik ≥ %50; aynı yıldızın birden çok kaynağı birleştirilir |
| Cr 399 | h_link'te üye yok; Cr 399 fiziksel küme değil, asterizm | desen yıldızları SIMBAD koni taraması (0,6°, V < 7,5, yalnız yıldız türleri): 4 Vul 5,16; 5 Vul 5,59; HD 182955 5,87; HD 182761 6,29; HD 182422 6,39 — "üyelik" kataloğu yok, dosyada `asterizm: true` ve açıklama |
| M42 merkez yıldızları | SIMBAD `NAME ONC` (Orion Nebula Cluster) h_link üyeleri; Trapezium bu kümenin çekirdeği ('NAME Ori Trapezium' h_link'inde yalnız θ¹ Ori C parlak) | θ¹ Ori C %92–100, θ² Ori B %99, θ² Ori A %80, θ¹ Ori D %99–100, θ¹ Ori A %99 |
| Atıf | SIMBAD: Wenger ve ark. 2000, A&AS 143, 9 | veri dosyasında |

En parlak 5 üye (V): M45 2,87 3,63 3,70 3,87 4,18 · M44 6,29 6,39 6,39 6,56 6,60 · M6 5,60 6,37 6,45 6,75 6,77 · M7 5,85 5,90 5,96 6,05 6,06 ·
M11 8,56 10,51 10,54 10,57 10,77 · M35 7,34 7,38 7,42 8,10 8,14 · M36 8,44 8,79 8,94 8,96 9,09 · M37 9,16 9,32 9,82 10,00 10,27 ·
M38 9,10 9,41 9,44 9,46 9,50 · M39 6,57 6,83 6,83 7,02 7,36 · NGC 869 6,57 6,70 7,69 7,79 7,83 · NGC 884 6,48 6,98 7,69 7,85 7,96 ·
Mel 111 4,34 4,81 4,86 4,94 4,95 · Cr 399 5,16 5,59 5,87 6,29 6,39 · M42 (ONC) 5,13 6,38 6,39 6,70 6,73.
Not: M11, M36, M37, M38'in üyeleri 8,4–9,2 ve sönük; kentte üye yolu yardımcı olmaz, yaygın yol kalır. γ Com (Mel 111) üyeliği
2001 kaynağından; sonucu etkilemez (12, 7, 31, 14 Com üyeleri yeterli).

## 9. M31 profil yolu — kaynaklar (veri/profil_m31.json)

| İddia | Kaynak | İfade |
|---|---|---|
| Eş-ışık eğrisi içi alan A (yay dk²) ve bütünleşik B kadiri m(r) | de Vaucouleurs 1958, ApJ 128, 465, Table 4 "Adopted luminosity profiles and integrated luminosities" [B: ADS taraması 1958ApJ...128..465D s. 476] | 31 satır (B 16,1 … 26,8); örn. B 22,55 → A 1020, m 5,18; B 23,05 → A 2180, m 4,835; m(∞) 4,36 |
| B − V = 0,91 | aynı makale, özet | "B − V = +0.91" (bütünleşik; renk eğimi yok sayıldı — yaklaşım) |
| Yöntem | Crumey 2014 §3.1, Fig. 12 | "Data points show the enclosed area and average surface brightness for successive isophotes … threshold curve Eq. 58 … the target is at threshold" ; "A similar procedure can be applied to M31 using data from De Vaucouleurs (1958). It is found that with F = 2 the galaxy should become just visible at approximately μsky = 19.2 mag arcsec-2" |
| Yeniden üretim | testler/gorunurluk.spec.js | çıplak göz, F = 2, Z = 0, k = 0: profil yolunun eşiğe değdiği gök **19,16** (Crumey 19,2); en iyi iç bölge A = 1020 yay dk² (B 22,55 eş-ışık eğrisi), V 4,27 (B 5,18 — Crumey'nin "5.2" değeri B kadiridir). Aynı koşulda yaygın yol 20,14 ister (fark 0,98 kadir). Crumey'nin "visible area approximately 2100 arcmin²" ifadesi Tablo 4'teki 2a×2b ≈ 54,5′×20′ ≈ 1090 yay dk² alanla değil A = 2180 satırıyla örtüşür; alan tanımı farkı askıda. |
| 7×50, Ataşehir 17,9, 40° (Z = 50°), k = 0,30, göz bebeği 6,5 | hesap (Node, gorunurluk.js) | profil yolu görünür (fark +1,18): seçilen en iyi iç bölge B 19,8 eş-ışık eğrisi → 19,2 yay dk², V 6,03, görünen yüzey 18,6 kadir/yay sn² ↔ bu büyüklükte eşik 19,78 (M = 7 görünen alanı 49 kat büyütür, Crumey (79)–(81)); B 20,3 satırı (36,9 yay dk²) eşik 20,12, fark +1,15 |

## 10. M42 ve M8 — çekirdek

- M42: iç bölge (Huygens bölgesi) için yayımlanmış yüzey parlaklığı ve boyut ölçümü aranmadı/bulunmadı; görev gereği merkez
  yıldızları testi uygulandı (§8). Yaygın yol 17,9'da görünmez der; üye yolu görünür (θ¹ Ori C, θ² Ori A/B, θ¹ Ori D, θ¹ Ori A hepsi 8,9 sınırının
  üstünde) → etiket "görünür (yıldızları seçilir)". Bu etiket bulutsunun kendisini değil merkez yıldızlarını görmeyi anlatır; gerekçe kutusunda yazar.
- M8: iç bölge ölçümü bulunamadı → yaygın yol görünmez dediğinde "belirsiz: çekirdek verisi yok" (askıda).

## 11. Defter "Model ve sen" — yöntem (Urania'nın kendi seçimi, kaynaklı değil)

- Dürbün hedefi (`hedef:`) kaydında isteğe bağlı alan: gördüm / zor gördüm / göremedim (varsayılan boş).
- Kayıt anında model tahmini girdileriyle saklanır (`kayit.model`): etiket, yol, fark, farkHam (ayarsız fark), kayma, gök (başucu, kaynağı),
  hedef yönündeki gök, Ay oranı/yüksekliği/açısı, yükseklik, k, AOD, göz bebeği, F, sürüm. Düzenlemede saat ve hedef değişmezse korunur.
- Karşılaştırma: gördüm ↔ görünür, zor gördüm ↔ zor, göremedim ↔ görünmez; "belirsiz" ve "ufuk" tahminleri karşılaştırılmaz.
  Kart: kaç kayıt karşılaştırıldı, kaç uyuştu, uyuşmayanların listesi.
- Kişisel ayar (≥ 10 karşılaştırmalı kayıt): tek katsayı = kadir kayması δ. −2 … +2 arası 0,1 adımla, etiketle(farkHam + δ) ile gözlem sınıfının
  uyuştuğu kayıt sayısını en çok yapan δ; eşitlikte |δ| küçük olan. Öneri yalnız uyumu artırıyorsa; yalnız "Ayarı uygula" ile `gorKayma`
  anahtarına yazılır; "Ayarı kaldır" siler. Uygulanınca tüm yollarda fark'a eklenir (gerekçe kutusu yazar). Veriler yalnız cihazda; kayıtlar
  mevcut JSON yedeğine girer, eski (v1) yedekler alan eksikliğiyle sorunsuz yüklenir (testli).

## 12. Yeni 26 hedef tablosu (Ay'sız, Z = 30°, k = 0,30, F = 2, göz bebeği 6,5; G görünür, Z zor, X görünmez, B belirsiz) ve v45 farkları

| Hedef | 17,9'da yol | 21,0 | 20,0 | 17,9 | v45 (21/20/17,9) | AL |
|---|---|---|---|---|---|---|
| M45 | üye | G | G | G | GGG | kolay |
| M42 | üye | G | G | G | GZX → değişti | kolay |
| M31 | profil | G | G | G | GZX → değişti | kolay |
| M44 | üye | G | G | G | GZX → değişti | kolay |
| M13 | yaygın | G | G | Z | GGZ | kolay |
| M8 | yaygın | Z | Z | B | ZZX → değişti | kolay |
| M7 | üye | G | G | G | GGG | kolay |
| M6 | üye | G | G | G | GGG | kolay |
| M22 | yaygın | G | G | G | GGG | kolay |
| M35 | üye | G | G | G | GGZ → değişti | kolay |
| M36 | yaygın | G | G | G | GGG | kolay |
| M37 | yaygın | G | G | G | GGG | kolay |
| M38 | yaygın | G | G | Z | GGZ | kolay |
| M39 | üye | G | G | G | GGG | kolay |
| M11 | yaygın | G | G | G | GGG | kolay |
| M27 | yaygın | G | G | Z | GGZ | kolay |
| M92 | yaygın | G | G | X | GGX | kolay |
| M3 | yaygın | G | G | X | GGX | kolay |
| M5 | yaygın | G | G | Z | GGZ | kolay |
| NGC 869 | yaygın | G | G | G | GGG | — |
| NGC 884 | yaygın | G | G | G | GGG | — |
| Mel 111 | üye | G | G | G | GZX → değişti | — |
| Cr 399 | üye | G | G | G | GGX → değişti | — |
| Albireo | nokta | G | G | G | GGG | — |
| Mizar | nokta | G | G | G | GGG | — |
| Alcor | nokta | G | G | G | GGG | — |

AL "kolay" 19 cisim: görünmez olmayan 21,0'da 19/19, 20,0'da 19/19, 17,9'da 17/19 (M92 ve M3, küresel kümeler, görünmez). 7 hedefin
etiketi değişti (M42, M31, M44, M35, Mel 111, Cr 399 kentte görünür; M8 görünmez → belirsiz). Hiçbir hedef v45'e göre kötüleşmedi.
M92 ve M3'ün 17,9'daki "görünmez" farkları −0,52 ve −0,58: ±0,5 bandının hemen dışında (bıçak sırtı); gerekçe kutusu farkı yazar.

## 13. Askıda (v46)
- M8 iç bölge yüzey parlaklığı (yayımlanmış ölçüm bulunamadı) → "belirsiz".
- Crumey'nin M31 "görünür alan ≈ 2100 yay dk²" ifadesi ile Tablo 4 alan tanımı arasındaki fark (bizim 19,16 eşiği 1020 yay dk² satırında).
- M31 profilinde renk eğimi yok sayıldı (tek B − V = 0,91).
- Cr 399 için üyelik kataloğu yok (asterizm); desen yıldızları koni taramasından.
- γ Com'un Mel 111 üyeliği (2001 kaynağı) tartışmalı olabilir; sonucu etkilemiyor.
- Kişisel ayar yöntemi (kadir kayması, uyum sayısını en çoklama) Urania'nın seçimidir, kaynaklı değildir.
