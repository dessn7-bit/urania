# roket — kaynak tablosu (erişim 30 Ekim 2026)

Hesaplar python3 ile yeniden yapıldı (scratchpad/hesap.py). "hesap" satırları kaynaklı girdilerden türetildi.

| İddia / sayı | URL | Kaynaktaki ifade |
|---|---|---|
| Δv = v_e · ln(m₀/m₁); her aşamaya ayrı uygulanır | https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation | ders 23 (veri/dersler.json) bu maddeye dayanır: "denklem her aşamaya ayrı ayrı uygulanır" |
| g₀ = 9,80665 m/s² | https://en.wikipedia.org/wiki/Standard_gravity | veri/fizik.json `g0` (3. CGPM, 1901); ders 23: "g0 = 9,80665 m/s²" |
| v_e = Isp × g₀; 450 s → ≈ 4413 m/s | ders 23 | "450 × 9,80665 ≈ 4413 m/s" (hesap: 4412,99) |
| 4,5 km/s ile 9,7 km/s → kütle oranı ≈ 8,63, yakıt %88,4 | https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation | ders 23 örneği: "kütle oranı = e üssü 2,156 ≈ 8,63 … %88,4'ü yakıt" (hesap 8,633; 0,8842) |
| Ders tek aşama: yakıt 88,4 t, gövde 10 t, yük 1,6 t → Δv 9,69 km/s, oran 8,62 | ders 23 | "o depo kalkış kütlesinin %10'u olsaydı yüke yalnızca %1,6 kalırdı" (hesap: 4,5·ln(100/11,6) = 9,694) |
| 3 km/s ile 9,4 km/s → oran ≈ 23, yakıt %95,6 | ders 23 | "oran e üssü (9,4 / 3) ≈ 23, yakıt payı ≈ %95,6" (hesap 22,96; 0,9564) |
| Isp 306 s (log 2,4856) = 3 km/s; ε 0,972 → Δv 9,40, oran 22,96 | hesap | 3000/9,80665 = 305,91 s; 0,972·98,4 = 95,64 t |
| Ders iki aşama: 5,0 + 4,7 km/s; gövdeler %10 ve %2; yük ≈ %6; "yaklaşık 4 kat" | ders 23 | "birinci aşama 5,0 km/s, ikinci aşama 4,7 km/s … yüke yaklaşık %6 kalır … yükü yaklaşık 4 kat artırır" |
| Kütleler 67,08 / 10 / 14,85 / 2 / 6,07 t; 6,07/1,6 = 3,79 | hesap | e^(5/4,5)=3,0377 → 100/3,0377=32,92; −10 = 22,92; e^(4,7/4,5)=2,8418 → 8,065; −2 = 6,065 |
| Eşit bölüşüm (aynı Isp, aynı yakıt payı, eşit oran) = "kısıtlı aşamalandırma", en iyisi olmayabilir | https://en.wikipedia.org/wiki/Multistage_rocket | "the stages of the rocket system have the same specific impulse, structural ratio, and payload ratio" ; "may not be the ideal approach to yielding an efficient or optimal system" |
| Aşama eklemenin getirisi azalır; gerçek roketler nadiren üçten fazla aşama | https://en.wikipedia.org/wiki/Multistage_rocket | "each increment in number of stages gives less" ; "the main reason why real world rockets seldom use more than three stages" |
| Tek aşama → 2 aşama: 13,82 km/s (6,91+6,91); 3 aşama 15,05 km/s | hesap | r = (100/1,6)^(1/N); ε = 88,4/98,4 |
| Yerden LEO ≈ 9,4 km/s; kayıplar 1,5–2 km/s | https://en.wikipedia.org/wiki/Delta-v_budget | "the delta-v is over six times higher, about 9.4 km/s" ; "typically 1.5–2 km/s for atmospheric drag and gravity drag" |
| LEO → Mars aktarımı 4,3 km/s (tipik, en küçük değil) | https://en.wikipedia.org/wiki/Delta-v_budget | Mars tablosu: "LEO → Mars transfer orbit 4.3" (typical, not minimal) |
| LEO (Kennedy) → Ay yüzeyi 5,93 km/s | https://en.wikipedia.org/wiki/Delta-v_budget | matris: "LEO-Ken → Moon 5.93" |
| Tablo değerleri tutarsız olabilir | https://en.wikipedia.org/wiki/Delta-v_budget | "The figures for LEO to GTO, GTO to GEO, and LEO to GEO are inconsistent." (ders 23 de aynı uyarıyı verir) |
| LEO → GTO 2,43 km/s (300 km → 35.786 km, vis-viva); GTO hedefi 11,83 | hesap; sağlama Wikipedia dipnotu | GM⊕ 398.600,44 km³/s² (IAU, fizik.json), R⊕ 6371 km, GEO yarıçapı 42.164 km (ders 23). 700 km'den aynı hesap 2,32 → dipnot: "giving a delta-v of 2.3 km/s" |
| Merlin 1D Isp 282 s (deniz seviyesi), 311 s (boşluk) | https://en.wikipedia.org/wiki/Falcon_9_Full_Thrust ; https://spaceflight101.com/spacerockets/?p=1457 | Wikipedia: "SL: 282 s (2.77 km/s)", "vac: 311 s (3.05 km/s)" ([needs update] etiketli); Spaceflight101: "282s (SL) 311s (Vac) (M1D Standard)" |
| MVac Isp 348 s | aynı iki kaynak | Wikipedia: "348 s (3.41 km/s)"; Spaceflight101: "348s" |
| Falcon 9 1. aşama kuru ≈ 22,2 t, yakıt 411 t | https://spaceflight101.com/spacerockets/?p=1457 ; https://en.wikipedia.org/wiki/Falcon_9_Full_Thrust | Spaceflight101: "~22,200 kg (est.)", "411,000 kg (According to FAA)"; Wikipedia: "22,200 kg", LOX 287.400 + RP-1 123.500 = 410.900 kg |
| Falcon 9 2. aşama kuru ≈ 4,0 t, yakıt 107,5 t | aynı iki kaynak | Spaceflight101: "4,000 kg (est.)", "107,500 kg (est.)"; Wikipedia: "4,000 kg", 75.200 + 32.300 = 107.500 kg |
| Falcon 9 toplam 549 t (kaynakların aşama toplamı yükle 567,5 t: tutarsızlık) | https://spaceflight101.com/spacerockets/?p=1457 ; Wikipedia | "549,054 kg" ; Wikipedia: "549,000 kg" |
| Falcon 9 LEO yükü 22,8 t, GTO 8,3 t (geri kazanılmadan) | https://en.wikipedia.org/wiki/Falcon_9_Full_Thrust | "Expended 22,800 kg" ; GTO "Expended 8,300 kg" |
| Falcon 9 benzeri: 3,75 + 5,50 = 9,25 km/s; 8,3 t ile 11,72 km/s; NSTAR Isp ile 88,16 | hesap | 1. aşama Isp 296,5 = (282+311)/2 (basitleştirme) |
| RS-25 Isp 452 s (boşluk), 366 s (deniz seviyesi) | https://l3harris.com/all-capabilities/rs-25-engine ; https://en.wikipedia.org/wiki/RS-25 | L3Harris: "Vacuum: 452 sec." "Sea Level: 366 sec."; Wikipedia: "452.3 s" |
| Mekik katı yakıtlı iticisi Isp 268 s (boşluk), 242 s (deniz seviyesi) | https://en.wikipedia.org/wiki/Space_Shuttle_Solid_Rocket_Booster | "242 seconds (2.37 km/s) at sea level" ; "268 seconds (2.63 km/s) in a vacuum" (NASA sunumuna atıflı) |
| NSTAR Isp en çok 3100 s, itki en çok 92 mN; Deep Space 1 ve Dawn | https://ntrs.nasa.gov/api/citations/20080012602/downloads/20080012602.pdf ; https://en.wikipedia.org/wiki/NASA_Solar_Technology_Application_Readiness | NASA/TM-2008-214988 Tablo I: "Max. Specific Impulse, s >4100 >3100", "Max. Thrust, mN 236 92"; Wikipedia: "3100 s at 2.3 kW", "19 mN to 92 mN", "Deep Space 1 … Dawn" |
| 92 mN ≈ 9 gramlık cismin ağırlığı | hesap | 0,092 / 9,80665 = 0,00938 kg |
| Dünya'nın dönüşü: ekvatorda ≈ 0,465 km/s, İstanbul (41,0°) ≈ 0,35 km/s | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | ekvator yarıçapı 6378,137 km, yıldızıl dönüş 23,9345 sa → 0,4651 km/s; × cos 41° = 0,351 (ders 3 ve 23 ile aynı) |
| ISS İstanbul'dan çıplak gözle görülür | https://spotthestation.nasa.gov/ | NASA'nın geçiş tahmin hizmeti; ders 23: "İstanbul'dan görebildiğin iki uzay istasyonu" |
