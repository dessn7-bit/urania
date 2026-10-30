# cizim_v6.js — d50–d56 (kuramlar ünitesi) ders çizimlerinin kaynakları

Tarih: 2026-10-30. Her satır: değer | nereden | hesap.
"Ders" = arastirma/dersler_v2/dNN.json metni (30 Ekim 2026'da, düzeltmelerden sonra yeniden okundu; kendi kaynakları dNN_kaynak.md'de); bölüm numaraları 0'dan başlar.
İndirilen veri dosyaları (30 Ekim 2026):
- SPARC-MM = https://astroweb.case.edu/SPARC/MassModels_Lelli2016c.mrt (Lelli, McGaugh, Schombert 2016)
- SPARC-BTFR = https://astroweb.case.edu/SPARC/BTFR_Lelli2016a.mrt (Lelli, McGaugh, Schombert 2016, ApJ 816, L14; "Data Behind Figure 2")
- DESI = https://arxiv.org/html/2503.14738v3 (DESI DR2 Results II, Tablo 5 ve "pivot redshift" paragrafı)
- Page13 = https://arxiv.org/abs/1301.4995 (özet)
- PlanckX = https://arxiv.org/pdf/1807.06211 (Planck 2018 X, denklem 48); Planck13 = https://arxiv.org/pdf/1303.5082 (Planck 2013 XXII, denklem 34 ve sonrası)

Kesinlik etiketleri (çizimlerde çerçeve biçimiyle): düz kalın = gözlemle kesinleşmiş, düz ince = güçlü kanıtlı ama açık sorulu, kesikli = kuram ya da hipotez, noktalı = askıda, kesik-noktalı = spekülasyon. Sözler derslerin kendi sözleridir (d52 ve d56'da "Kuram / hipotez", "Spekülasyon").

## d50 · Karanlık madde

| değer | nereden | hesap |
|---|---|---|
| d50-donme-egrisi (bölüm 1): NGC 3198'in 43 noktası, R (kpc), Vobs, e_Vobs (km/s) | SPARC-MM, "NGC3198" satırları | olduğu gibi |
| uzaklık 13,8 Mpc | SPARC-MM, D sütunu | — |
| görünen madde hızı Vbar | SPARC-MM: Vgas, Vdisk (M/L = 1 için), Vbul = 0 | Vbar = √(|Vgas|·Vgas + 0,5·Vdisk²); 0,5 = Lelli ve ark. 2016 özetindeki M/L = 0,5 (arXiv:1606.09251) |
| Vbar en yüksek 101,3 km/s, 6,74 kpc'de ("yaklaşık 7 kpc") | hesap | yukarıdaki formül |
| 44,08 kpc: ölçülen 149, hesap 64,7 ("65") km/s | SPARC-MM; hesap | √(47,84² + 0,5·61,63²) = 64,7 |
| içerideki kütle görünenin ≈ 5 katı | hesap | (149 ÷ 64,7)² = 5,30 (M ∝ v² r, aynı r) |
| Rubin ve Ford 1975, düz dönme eğrileri | Ders bölüm 1 | — |
| d50-aday-kutleleri (bölüm 3): en hafif aksiyon 1 peV = 10⁻¹⁵ eV | Ders bölüm 3 (Wikipedia: Axion) | — |
| ADMX taramaları: 2,81–3,31 μeV (2020), 4,55–5,42 μeV (2025) → etiket "2,8–5,4 μeV arası, parça parça" | Ders bölüm 8 (düzeltilmiş metin) | simge log₁₀(4 × 10⁻⁶) ≈ −5,4'te |
| nötrino kütleleri toplamı < 0,12 eV | Ders bölüm 4 | log₁₀ 0,12 = −0,92 |
| steril nötrino adayı 7,1 keV; Lyman-alfa ılık sınırı > 4,35 keV | Ders bölüm 9 ve 4 | log₁₀ 7100 = 3,85; log₁₀ 4350 = 3,64 |
| WIMP şeridi 3 GeV – 100 GeV | Ders bölüm 6 (LZ 3–9 GeV, 40 GeV) ve bölüm 5 (≈ 100 GeV) | log₁₀ 3×10⁹ = 9,48; 10¹¹ |
| proton 0,94 GeV | Ders bölüm 2 | log₁₀ 9,4×10⁸ = 8,97 |
| ilkel kara delik penceresi 10⁻¹⁷–10⁻¹⁰ M☉ = 1,1×10⁴⁹ – 1,1×10⁵⁶ eV | Ders bölüm 3 ve 10 (Carr ve ark. 2026) | 1,988×10³⁰ kg × 10⁻¹⁷ ÷ 1,783×10⁻³⁶ kg/eV = 1,1×10⁴⁹ |
| Güneş 1,1×10⁶⁶ eV | hesap | 1,988×10³⁰ ÷ 1,783×10⁻³⁶ |
| ≈ 64 basamak | Ders bölüm 3 örneği | 1,1×10⁴⁹ ÷ 10⁻¹⁵ ≈ 10⁶⁴ |
| "Adayların hepsi: kuram ya da hipotez" | Ders bölüm 14 | — |
| d50-tully-fisher (bölüm 12): 118 galaksi, log Mb ve log Vf | SPARC-BTFR (M/L = 0,5) | olduğu gibi |
| MOND çizgisi v⁴ = G M a0, a0 = 1,2×10⁻¹⁰ m/s² | Ders bölüm 12 formülü | log v(km/s) = ¼ log M(M☉) + ¼ log(6,674×10⁻¹¹ × 1,988×10³⁰ × 1,2×10⁻¹⁰) − 3 = ¼ log M − 0,4495; uydurma yok |
| 5×10¹⁰ M☉ → 168 km/s | Ders bölüm 12 örneği | (7,96×10²⁰)^¼ = 1,68×10⁵ m/s |
| noktalar ortalamada 0,031 dex (≈ %7) yukarıda | hesap (Python, 118 nokta) | ortalama (log Vf − çizgi) = 0,0307; 10^0,0307 = 1,073 |

## d51 · Karanlık enerji

| değer | nereden | hesap |
|---|---|---|
| d51-seyrelme (bölüm 4): Ωm = 0,3153, ΩΛ = 0,6847 | Ders bölüm 4 örneği (Planck 2018) | madde 0,3153 a⁻³; Λ 0,6847 sabit |
| yoğunluk ∝ a^(−3(1+w)) | Ders bölüm 4 (Frieman) | fantom w = −1,5 → 0,6847 a^1,5 |
| eşitlik z ≈ 0,30 (a = 0,770), ≈ 3,5 milyar yıl önce | Ders bölüm 4 örneği; hesap | (2,172)^(1/3) = 1,295; geriye bakış süresi ΛCDM integrali: 3,53 milyar yıl |
| hızlanma z ≈ 0,63 (a = 0,613), ≈ 6,1 milyar yıl önce | Ders bölüm 4 örneği; hesap | (4,343)^(1/3) = 1,631; integral 6,10 milyar yıl |
| d51-120-basamak (bölüm 7): Planck kesmesi 5,2×10⁹⁶ kg/m³ | Ders bölüm 7 örneği (NIST) | 2,176×10⁻⁸ ÷ (1,616×10⁻³⁵)³ |
| ölçülen karanlık enerji 5,84×10⁻²⁷ kg/m³ | Ders bölüm 5 örneği | 0,6847 × 8,52×10⁻²⁷ |
| ≈ 123 basamak | Ders bölüm 7 örneği | 5,2×10⁹⁶ ÷ 5,8×10⁻²⁷ ≈ 9×10¹²² |
| ≈ 55 basamak (Lorentz değişmezliğini koruyan hesap, Martin 2012) | Ders bölüm 7 | nokta: 5,8×10⁻²⁷ × 10⁵⁵ (kat olarak; yoğunluk ölçeği yalnız görsel) |
| yerel karanlık madde 7,13×10⁻²² kg/m³ ("yaklaşık yüz bin kat") | Ders d50 bölüm 2 örneği; d51 bölüm 5 | 0,4 GeV/cm³ × 1,783×10⁻²⁷ kg × 10⁶ |
| d51-desi-w (bölüm 11): DESI DR2 + CMB + DESY5, w0 = −0,752 ± 0,057, wa = −0,86 (−0,20 / +0,23) | DESI Tablo 5 | wa belirsizliği simetrik 0,215 alındı (ortalama) |
| pivot z_p = 0,31, w_p = −0,954 ± 0,024 | DESI, "pivot redshift" paragrafı | — |
| %68 bant | hesap | w(a) = w_p + wa(a_p − a), a_p = 1 ÷ 1,31; w_p ile wa pivotta ilintisiz olduğundan σ² = 0,024² + (a_p − a)² × 0,215². Sağlama: a = 1'de σ = 0,0563 ≈ tablodaki 0,057 |
| 4,2 sigma | DESI Tablo 6 (DESI+CMB+DESY5); Ders bölüm 11 ("2,8 ile 4,2 sigma") | — |
| Unite w0 = −0,861, wa = −0,60 | Ders bölüm 11 örneği (bölüm 12, Camilleri ve ark. 2026 ön baskı) | w(z) = −0,861 − 0,60 (1 − 1 ÷ (1 + z)) |

## d52 · Kara deliklerin kuantum yüzü

| değer | nereden | hesap |
|---|---|---|
| d52-hawking-sicakligi (bölüm 3): T ≈ 6,17×10⁻⁸ K × (M☉ ÷ M) | Ders bölüm 3 | M☉ = 1,988×10³⁰ kg |
| Güneş 62 nK; Sgr A* (4,297×10⁶ M☉) 1,44×10⁻¹⁴ K; M87 (6,5×10⁹ M☉) 9,5×10⁻¹⁸ K; Dünya kütlesi 0,0205 K | Ders bölüm 3 örneği | Dünya kütlesi 5,97×10²⁴ kg (1,988×10³⁰ ÷ 332.900) |
| arka plan 2,725 K; eşik 4,5×10²² kg = Ay'ın %61'i | Ders bölüm 4 örneği (NASA Moon Fact Sheet 7,346×10²² kg) | 6,17×10⁻⁸ ÷ 2,725 × 1,988×10³⁰ |
| bugün biten ilkel kara delik 5×10¹¹ kg, 2,5×10¹¹ K | Ders bölüm 5 örneği (HAWC) | — |
| d52-buharlasma-omru (bölüm 5): ömür ≈ 2,1×10⁶⁷ yıl × (M ÷ M☉)³ | Ders bölüm 5 | — |
| evrenin yaşı 1,38×10¹⁰ yıl → 1,7×10¹¹ kg (basit), 5×10¹¹ kg (HAWC) | Ders bölüm 5 örneği | (1,38×10¹⁰ ÷ 2,1×10⁶⁷)^(1/3) × 1,988×10³⁰ |
| Sgr A* 1,7×10⁸⁷ yıl; 10¹¹ M☉ ≈ 10¹⁰⁰ yıl | Ders bölüm 5 | 2,1×10⁶⁷ × (10¹¹)³ = 2,1×10¹⁰⁰ |
| d52-page-egrisi (bölüm 9): kara delik entropisi S/S0 = (1 − t/τ)^(2/3) | hesap (Page13 varsayımları: M ∝ (1 − t/τ)^(1/3), S ∝ M²) | — |
| Hawking eğrisi = 1,4847 × (1 − S/S0) | Page13 özeti (ışınım entropisi, kara delik entropi kaybının 1,4847 katı) | — |
| Page eğrisi = ikisinin küçüğü; Page zamanı %53,81, tepe 0,5975 | Page13 özeti | sağlama: 1,4847(1 − x) = x → x = 0,5975 → t/τ = 1 − 0,5975^1,5 = 0,538 |
| "ömrün kabaca yarı yolu" | Ders bölüm 9 | — |

## d53 · Kuantum kütleçekim ve sicim kuramı

| değer | nereden | hesap |
|---|---|---|
| d53-uzunluk-merdiveni (bölüm 2): Planck uzunluğu 1,616255×10⁻³⁵ m | Ders bölüm 2 (NIST CODATA 2022) | — |
| proton 8,4075×10⁻¹⁶ m; insan 1,7 m; oran ≈ 5×10¹⁹ | Ders bölüm 2 örneği | — |
| LHC 13,6 TeV → ≈ 1,5×10⁻²⁰ m | Ders bölüm 3 | 197,327 MeV fm ÷ 13,6×10⁶ MeV = 1,45×10⁻⁵ fm |
| Klein 1926: ≈ 10⁻³⁰ cm = 10⁻³² m | Ders bölüm 6 | — |
| Eöt-Wash 2020: en büyük ek boyut < 30 μm | Ders bölüm 6 (arXiv:2002.11761) | — |
| "≈ 15 basamak" | Ders bölüm 3 | 1,45×10⁻²⁰ ÷ 1,616×10⁻³⁵ ≈ 9×10¹⁴ |
| d53-uzunluk-enerji (bölüm 3): E = 197,327 MeV fm ÷ L | Ders bölüm 3 (NIST) | GeV·m olarak 1,97327×10⁻¹⁶ |
| Planck enerjisi 1,22×10¹⁹ GeV ≈ 1,96×10⁹ J (yakıt deposu) | Ders bölüm 2 ve 3 örneği | — |
| LHC'nin ≈ 9×10¹⁴ katı | Ders bölüm 3 örneği | 1,22×10¹⁹ ÷ 13.600 |
| proton boyu → 0,23 GeV | hesap | 0,197327 ÷ 0,84075 = 0,235 GeV |
| en enerjik kozmik ışın (1991) 50 J ≈ 3,1×10¹¹ GeV | Ders bölüm 3 | 50 ÷ 1,602×10⁻¹⁰ J/GeV |
| d53-ek-boyut (bölüm 6): hortum benzetmesi | Ders bölüm 6 (Wikipedia) | kavramsal, ölçeksiz |
| alt şerit: Planck 1,6×10⁻³⁵ m, Klein 10⁻³² m, Eöt-Wash 3×10⁻⁵ m; ≈ 30 basamak | Ders bölüm 6 örneği | 3×10⁻⁵ ÷ 1,6×10⁻³⁵ ≈ 1,9×10³⁰ |

## d54 · Enflasyon ve çoklu evren

| değer | nereden | hesap |
|---|---|---|
| d54-yokus (bölüm 4): eğri biçimi V = (1 − e^(−φ))² | Starobinsky tipi potansiyel; PlanckX'te R² modeli "iç bükey" modellerin örneği; Ders bölüm 6 ("iç bükey modeller öne çıkıyor") | kavramsal, eksenler sayısız |
| yavaş yuvarlanma, salınım, yeniden ısınma | Ders bölüm 4 | — |
| d54-ns-r (bölüm 7): Planck 2018 n_s = 0,9649 ± 0,0042 | Ders bölüm 6 | şerit 0,9607–0,9691 |
| ACT 2025 n_s = 0,974 ± 0,003 | Ders bölüm 6 | şerit 0,971–0,977 |
| r < 0,10 (Planck), r < 0,056 (Planck + BICEP/Keck), r < 0,036 (BICEP/Keck 2021, %95) | Ders bölüm 7 | — |
| BICEP2 r = 0,20 (17 Mart 2014), toz | Ders bölüm 8 | — |
| φ² modeli, N = 50–60: (0,9604; 0,158) → (0,9669; 0,132) | Planck13 denklem 34 sonrası: n_s − 1 ≈ −n(n+2)/φ*², r ≈ 8n²/φ*², φ*² ≈ n(4N+n)/2 | n = 2: n_s = 1 − 4/(2N+1), r = 16/(2N+1) |
| Starobinsky R², N = 50–60: (0,960; 0,0048) → (0,9667; 0,0033) | PlanckX denklem 48: n_s − 1 ≃ −2/N, r ≃ 12/N² | — |
| "φ² modeli elendi" | Ders bölüm 6 (Planck makalesi) | — |
| d54-tegmark (bölüm 10): dört düzey ve etiketler | Ders bölüm 10, 11 ve 14 | kavramsal simgeler |

## d55 · Evrenin başlangıcı ve sonu

| değer | nereden | hesap |
|---|---|---|
| d55-gelecek-takvimi (bölüm 8): bugün 13,8 milyar yıl | Ders bölüm 0 | — |
| 150 milyar yıl; 2 trilyon yıl | Ders bölüm 8 (Krauss ve Starkman 2000, Wikipedia) | — |
| kırmızı cüceler 10¹³ yıl; yıldız oluşumu 10¹⁴ yıl; yozlaşmış çağ 10¹⁴–10⁴⁰ yıl | Ders bölüm 8 | — |
| proton yarılanma ömrü ≥ 10³⁴ yıl (bozunuyorsa) | Ders bölüm 8 | — |
| kara delik çağı 10⁴⁰–10¹⁰⁰; en büyükleri 10¹⁰⁶ yıl | Ders bölüm 9 | — |
| vakum bozunması ≈ 10¹³⁹ yıl, %95 alt sınır 10⁵⁸ yıl | Ders bölüm 12 (Andreassen, Frost, Schwartz 2018) | — |
| demir yıldızlar ≈ 10¹⁵⁰⁰ yıl (çizelge dışında) | Ders bölüm 8 | — |
| d55-olcek-carpani (bölüm 10): ΛCDM geçmiş ve gelecek | Planck 2018 (Ders d51 bölüm 4: Ωm 0,3153, ΩΛ 0,6847; H0 67,36) | a(t) = (Ωm/ΩΛ)^(1/3) sinh^(2/3)(1,5 √ΩΛ H0 t); yaş 13,80 milyar yıl; 1/H0 = 977,8 ÷ 67,36 milyar yıl |
| fantom w = −1,5, H0 = 70, Ωm = 0,3 → Büyük Yırtılma ≈ 22 milyar yıl | Ders bölüm 10 (Caldwell ve ark. 2003) | sayısal integral t = ∫ da / (a H), H = H0 √(0,3 a⁻³ + 0,7 a^1,5): 21,7 milyar yıl; dersin yaklaşık formülü 22,3 |
| çöküş: en büyük boy ≈ 11 milyar yıl sonra, çöküş ≈ 20 milyar yıl sonra | Ders bölüm 11 (Cornell 2025, Tye ve ark.) | eğri şematik: 0–11 milyar yıl kübik Hermite (a(0) = 1, eğim H0, a(11) = 1,45 seçim, eğim 0), sonra 1,45 × sin(π/2 × (20 − t)/9)^(2/3); 1,45 sayı taşımaz |
| d55-kesinlik-haritasi (bölüm 14): satırlar ve maddeler | Ders bölüm 14 | — |

## d56 · Beyaz delikler, solucan delikleri ve zaman yolculuğu

| değer | nereden | hesap |
|---|---|---|
| d56-schwarzschild-haritasi (bölüm 1): dört bölge, ufuklar 45°, tekillik T² − X² = 1 | Ders bölüm 1 (Wikipedia: White hole; Kruskal–Szekeres) | kavramsal; birim ölçeksiz |
| bölge etiketleri: I gözlemle kesinleşmiş, II kuramın sağlam sonucu, III ve IV Spekülasyon | Ders bölüm 1 | — |
| d56-einstein-rosen (bölüm 6): Flamm paraboloidi r(z) = rs + z²/(4 rs) | Flamm 1916 gömme yüzeyi (z = 2√(rs(r − rs))'nin tersi); Ders bölüm 1 ve 6 | rs = 34 birim, ölçeksiz |
| Fuller ve Wheeler 1962: ışık bile geçemeden kapanır | Ders bölüm 6 | — |
| d56-gelecege-yolculuk (bölüm 10): ISS 7,7 km/s, 1 yılda ≈ 0,01 s | Ders bölüm 10 örneği | v²/(2c²) = 3,30×10⁻¹⁰; × 3,156×10⁷ s = 0,0104 s |
| Krikalev 803 günde ≈ 0,02 s | Ders bölüm 10 (Universe Today) | ders örneği 0,023 s |
| CERN 1977 müonları γ = 29,327 → 1 yılda ≈ 28 yıl ileri | d25 bölüm (Wikipedia: Time dilation) | γ − 1 = 28,327 yıl |
| Miller gezegeni: 1 saat = 7 yıl → 1 yılda ≈ 61.000 yıl | Ders bölüm 14 örneği (61.362) | 7 × 365,25 × 24 = 61.362; (61.362 − 1) yıl |
| "Zaman genişlemesi: gözlemle kesinleşmiş" | Ders bölüm 10 | — |
