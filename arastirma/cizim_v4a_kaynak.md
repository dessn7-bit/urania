# cizim_v4a.js — d29, d31, d32 ders çizimlerinin kaynakları

Tarih: 2026-10-30. Her satır: değer | nereden | hesap.
"Ders" = veri/dersler.json'daki metin (kendi kaynakları arastirma/dersler_v2/dNN.json ve dNN_kaynak.md'de); bölüm numaraları 0'dan başlar.
"AME2020" = https://www-nds.iaea.org/amdc/ame2020/mass_1.mas20.txt (IAEA Atomic Mass Data Center, Atomic Mass Evaluation 2020; "BINDING ENERGY/A" sütunu, keV), 30 Ekim 2026'da indirildi.

## d29 · Feynman'ın dünyası (QED)

| değer | nereden | hesap |
|---|---|---|
| d29-ok-toplami (bölüm 3): ok uzunluğu 0,2 | Ders bölüm 3, "Örnek: Uzunluğu 0,2 olan iki ok" | 0,2² = 0,04 = %4 |
| aynı yön: toplam 0,4, olasılık %16 | Ders bölüm 3 örneği | 0,2 + 0,2 = 0,4; 0,4² = 0,16 |
| zıt yön: toplam 0, olasılık %0 | Ders bölüm 3 örneği | 0,2 − 0,2 = 0 |
| dik açı: toplam ≈ 0,283, olasılık %8 | Ders bölüm 3 örneği | √(0,04 + 0,04) = √0,08 ≈ 0,2828; 0,2828² = 0,08 |
| olasılıklar toplanırsa her durumda %8 | Ders bölüm 3 örneği | 0,04 + 0,04 = 0,08 |
| okların çizim ölçeği 0,2 = 50 birim | çizim kararı | ölçekli; açıklamada söylendi |
| d29-ayna-sarmal (bölüm 5): lamba ve göz aynadan 1 m yukarıda, aralarında 2 m | Ders bölüm 5, "Örnek: Aynanın gerçekten çalışan kısmı ne kadar geniş?" | — |
| dalga boyu 550 nm | Ders bölüm 5 örneği | — |
| fazladan yol eğrisi ΔL(x) | hesap (geometri, ders örneğinin düzeni) | ΔL = √(1 + (1 + x)²) + √(1 + (1 − x)²) − 2√2 metre, x metre cinsinden |
| 1 mm'de 354 nm | Ders bölüm 5 örneği; hesap | ΔL(0,001 m) = 353,55 nm |
| 1 mm'de ibre 0,64 tur | Ders bölüm 5 örneği; hesap | 353,55 ÷ 550 = 0,643 |
| 1,5 mm'de ≈ 795 nm (y ekseni 0–800 nm) | hesap | ΔL(0,0015 m) = 795,5 nm |
| zincir: −1,5 … +1,5 mm, 0,05 mm'lik 61 şerit | çizim kararı | ok yönü = 2π × ΔL(x) ÷ 550 nm (radyan); her ok aynı uzunlukta; toplam ok yatay olacak biçimde döndürüldü |
| ortadaki 1 mm'de (|x| ≤ 0,5 mm) oklar arası açı en çok 58° | hesap | 360° × ΔL(0,5 mm) ÷ 550 nm = 360° × 88,4 ÷ 550 = 57,9° |
| ortadaki 21 okun toplam oka katkısı ≈ %85 | hesap (Python, aynı formül) | ortadaki okların toplamının toplam ok yönündeki izdüşümü ÷ toplam okun boyu = 0,850 (büyüklük oranı 0,98) |
| d29-feynman-diyagrami (bölüm 8): zaman soldan sağa, düz oklu çizgi elektron, dalgalı çizgi foton, köşe | Ders bölüm 8; Fermilab History (ilk yayımlanan diyagram); M. Birse ders notu | — |
| iki elektronun tek foton alışverişi (2 köşe) | Ders bölüm 8, ikinci paragraf | — |
| iki foton alışverişi (4 köşe) "sonraki terim" | Ders bölüm 8, dördüncü paragraf ("daha çok köşesi olan diyagramlar serinin daha ileri terimlerine katkı verir") | çizim, dersteki genel ifadenin bir örneğidir; sayısal katkı verilmedi |
| α ≈ 1/137 | Ders bölüm 8 (CODATA 2022: 1/α ≈ 137,036) | — |

## d31 · Atom çekirdeği

| değer | nereden | hesap |
|---|---|---|
| d31-baglanma-egrisi (bölüm 4): eğri, A = 2 … 240 | AME2020 | her A için ölçülmüş (# ile işaretli tahmin olmayan) çekirdekler arasında en yüksek B/A; keV ÷ 1000 = MeV, 3 ondalık |
| döteryum (H-2) 1,11 MeV | AME2020 | 1112,2831 keV |
| helyum-4 7,07 MeV | AME2020; Ders bölüm 3 (HyperPhysics: 28,3 ÷ 4 ≈ 7,1) | 7073,9156 keV |
| nikel-62 8,79 MeV | AME2020 (8794,5555 keV); Ders bölüm 4 (Wikipedia Nickel-62: 8,7945) | — |
| demir-56 8,79 MeV | AME2020 (8790,3563 keV); Ders bölüm 4 (8,7903) | — |
| demir-58 8,792 (eğride A = 58 noktası) | AME2020 (8792,2534 keV); Ders bölüm 4 (8,7922) | — |
| uranyum-238 7,57 MeV | AME2020 | 7570,1262 keV |
| A = 5 ve 8'deki çukurlar (He-5 5,51; Be-8 7,06) | AME2020 | gerçek veri; ölçülmüş ama bağsız çekirdekler |
| füzyon ve fisyon okları tepeye doğru | Ders bölüm 4, ikinci paragraf | şematik ok; konumları sayı taşımaz |
| d31-kobalt-yarilanma (bölüm 10): kobalt-56 yarılanma ömrü 77,3 gün | Ders bölüm 10 (Wikipedia SN 1987A) | — |
| kalan pay eğrisi | Ders bölüm 10 formülü | N/N₀ = 0,5^(t ÷ 77,3) |
| 77,3 / 154,6 / 231,9 / 309,2 gün → 1/2, 1/4, 1/8, 1/16 | hesap | k × 77,3; 0,5^k |
| eksen etiketleri 77, 155, 232, 309 | hesap | 77,3; 154,6; 231,9; 309,2 yuvarlandı |
| 365 günde 4,72 yarılanma ömrü | Ders bölüm 10 örneği; hesap | 365 ÷ 77,3 = 4,722 |
| 1 yılda %3,8 kalır | Ders bölüm 10 örneği (≈ 0,038); hesap | 0,5^4,722 = 0,0379 |
| d31-doz-merdiveni (bölüm 15): muz 0,0001 mSv | Ders bölüm 15 (IPEM; Groningen) | — |
| diş röntgeni 0,01 mSv | Ders bölüm 15 (IPEM) | — |
| göğüs röntgeni 0,02 mSv | Ders bölüm 15 (IPEM, FDA) | — |
| 8 saatlik Atlantik uçuşu 0,08 mSv | Ders bölüm 15 (IPEM) | — |
| kafa tomografisi 1,4–2,0 mSv | Ders bölüm 15 (IPEM 1,4; FDA 2,0) | — |
| doğal radyasyon dünya ortalaması 2,4 mSv/yıl | Ders bölüm 14 (UNSCEAR 2000) | — |
| karın tomografisi 10 mSv | Ders bölüm 15 (FDA) | — |
| radyasyon çalışanı yıllık sınırı 20 mSv (Birleşik Krallık) | Ders bölüm 15 (IPEM) | — |
| Mars gidiş-dönüş 600 mSv | Ders bölüm 15 (IPEM) | — |
| radyasyon hastalığı eşiği 1.000 mSv | Ders bölüm 14 (IPEM) | — |
| aralık 10 milyon kat | hesap | 1000 ÷ 0,0001 = 10⁷ |
| karın tomografisi ≈ 4, çalışan sınırı ≈ 8, Mars ≈ 250 katı yıllık doğal doz | hesap; Mars için Ders bölüm 15 | 10 ÷ 2,4 = 4,2; 20 ÷ 2,4 = 8,3; 600 ÷ 2,4 = 250 |
| eksen 10⁻⁴ … 10³ mSv, logaritmik | çizim kararı | — |

## d32 · Parçacıklar ve Standart Model

| değer | nereden | hesap |
|---|---|---|
| d32-proton-notron (bölüm 1): proton = yukarı + yukarı + aşağı; nötron = yukarı + aşağı + aşağı | Ders bölüm 1 (Wikipedia Quark) | — |
| yükler: yukarı +2/3, aşağı −1/3 | Ders bölüm 1 | — |
| proton +1, nötron 0 | Ders bölüm 1; hesap | 2/3 + 2/3 − 1/3 = 1; 2/3 − 1/3 − 1/3 = 0 |
| kuarkları gluonlar bağlar | Ders bölüm 2 | şematik; ölçeksiz |
| d32-standart-model (bölüm 8): 12 fermiyon, üç kuşak, adlar | Ders bölüm 8 (CERN; Wikipedia Standard Model) | — |
| kuark yükleri +2/3 ve −1/3; elektron, müon, tau −1; nötrinolar 0 | Ders bölüm 1 ve 4 | — |
| taşıyıcılar: gluon güçlü, foton elektromanyetik, W ve Z zayıf; Higgs | Ders bölüm 5 ve 8 (CERN) | — |
| toplam 17 | Ders bölüm 8 | 12 + 4 + 1 |
| d32-kutle-merdiveni (bölüm 15): nötrino < 0,45 eV | Ders bölüm 11 (KIT, KATRIN 2025) | — |
| elektron 0,511 MeV | Ders bölüm 0 ve 4 | — |
| müon 105,7 MeV | Ders bölüm 4 | — |
| proton 938 MeV (temel değil, karşılaştırma) | Ders bölüm 0 | — |
| tau 1,78 GeV | Ders bölüm 4 | — |
| W 80,369 GeV, Z 91,188 GeV (etikette 80,4 ve 91,2) | Ders bölüm 6 (PDG 2024, Wikipedia W and Z bosons) | — |
| Higgs 125,11 GeV (etikette ≈125) | Ders bölüm 7 (ATLAS 2023, Wikipedia Higgs boson) | — |
| üst kuark ≈ 173 GeV | Ders bölüm 1 | — |
| elektron → üst kuark ≈ 340 bin kat | Ders bölüm 15; hesap | 173.000 ÷ 0,511 = 338.552; onbinliğe yuvarlandı |
| nötrino → üst kuark en az 380 milyar kat | Ders bölüm 15 örneği; hesap | 173 × 10⁹ ÷ 0,45 = 3,84 × 10¹¹; ders "en az ~380 milyar" |
| eksen 10⁻² … 10¹² eV, logaritmik | çizim kararı | — |
