# Alan 1 — Gökyüzü (Urania v39 denetimi, 2026-10-30)

## Okunan dosyalar
| dosya | satır | tamamı |
|---|---|---|
| gok.js | 541 | evet |
| gozlem.js | 1205 | evet |
| harita.js | 402 | evet |
| bulucu.js | 503 | evet |
| plan.js | 140 | evet |
| hava.js | 116 | evet |
| uydu.js | 302 | evet |
| ortme.js | 241 | evet |
| ortme_isci.js | 14 | evet |
| ar.js | 880 | evet |
| veri/algol.json | 13 | evet |
| veri/meteor.json | 343 | evet |
| veri/hedefler.json | 342 | evet (26 hedefin tamamı Node ile listelendi ve denetlendi) |
| veri/ortme_yildiz.json | 1 (tek satır, 13,9 KB) | evet: 118 yıldızın tamamı Node ile yildizlar.json'a karşı denetlendi |
| veri/takimyildiz.json | 1 (tek satır, 22 KB) | yapı + 88 ad noktasının tamamı Node ile denetlendi; çizgi koordinatları tek tek okunmadı |
| veri/yildizlar.json | 1 (tek satır, 155 KB) | ÖRNEKLEME: 5044 kaydın tamamı sıralama (kadir) için tarandı; 19 parlak yıldızın koordinat/kadiri ve ad çiftlenmesi denetlendi; diğer kayıtlar tek tek okunmadı |
| uygulama.js | 40–219 aralığı | hayır — alanım değil; yalnız U.saat/U.gun/U.konum/U.veri davranışını anlamak için okundu |

## Yöntem
- Node'da gok.js, ortme.js, bulucu.js, plan.js doğrudan `require` edildi (geçici klasör `scratchpad/denetim/a1/`, betikler t1–t8.js). Astronomy Engine 2.1.19 (node_modules) ile karşılaştırıldı.
- Tarayıcı: kendi sunucum (port 8141), Chromium `--disable-lcd-text`, `serviceWorkers: 'block'`, dış ağ kesik, CelesTrak için testler/yardim.js fikstürü, Open-Meteo sahte yanıt (açık gök / bozuk JSON), `page.clock.install` ile sabit saat (betikler b1–b4.js). Senaryolar: İstanbul 30 Eki 2026; Tromsø (69,65 K) 21 Ara 2026 ve 21 Haz 2026; Longyearbyen (78,22 K) 21 Ara 2026; 31 Ara→1 Oca 2027 (cihaz America/New_York, bozuk hava JSON'u); 29 Şubat 2028 tarih seçimi (cihaz Asia/Tokyo); AR sensörsüz + sahte deviceorientationabsolute olayları.
- Dış kaynaklar: JPL Horizons API (4 gezegen), AAVSO VSX (Algol), IMO 2026 takvimi PDF'i (Table 5 + metin), IERS Bulletin A (maia.usno.navy.mil, 29 Eki 2026), WGSN adı için web araması. CelesTrak'a istek atılmadı.

### Doğrulanan (bulgu YOK)
- Güneş doğuş/batış ve alacakaranlık (İstanbul 30 Eki 2026): uygulama = AE birebir (batış 18:02, sivil son 18:30, astro son 19:34, astro başı 06:00, doğuş 07:33).
- Gezegen parlaklığı (Mallama–Hilton 2018), 2026-10-30 18:00 UT, uygulama / Horizons APmag: Merkür 2,43 / 2,431 · Venüs −4,10 / −4,097 · Satürn 0,46 / 0,456 · Neptün 7,69 / 7,693. (AE'nin kendi değeri 2,60 / −4,18 / 0,37 / 7,82 — uygulamanınki daha doğru.)
- ΔT: uygulama formülü 2026-10-30 için 69,295 sn; IERS Bulletin A Vol. XXXIX No. 044 (29 Eki 2026): "UT1-UTC = -0.1114 - 0.00042 (MJD - 61349)" — kodun No. 043 formülüyle tutarlı (fark < 0,01 sn).
- Algol: VSX "Epoch: 14 Oct 2016 (HJD 2457675.72)", "Period: 2.867343 d", "2.09 - 3.30 V", "14% (9.63 h)" = veri/algol.json. HJD→JD işaret yönü (JD = HJD − r⊕·n̂/c) doğru.
- Meteor: 2026 kayıtlarının tamamı IMO 2026 Table 5 ile aynı (tarih aralığı, λ☉, radyant, V∞, ZHR; ör. "Quadrantids (010 QUA) Dec 28–Jan 12 Jan 03 283.15 230 +49 41 2.1 80"). zirve_utc anlarında hesaplanan λ☉(J2000) veri ile 0,001° içinde (Perseid hariç: zirve_utc λ 140,00'da, veri 140,05 — IMO "λ☉ = 140.0 − 140.1" verdiği için hata sayılmadı). 2025/2028/2029 türetilmiş takvim ve yıl dönümü (QUA 31 Ara 22 UT ve 1 Oca 02 UT'de etkin) doğru.
- 26 dürbün hedefinin hepsi kendi takımyıldızı sınırında (AE Constellation); 88 takımyıldız ad noktası kendi sınırında; ortme_yildiz.json'daki 118 yıldızın hepsi yildizlar.json'da 0,05° ve 0,3 kadir içinde; yildizlar.json kadire göre sıralı (bulucu.js/ar.js'teki `break` döngüleri buna dayanıyor) — 0 ihlal. "Tiansi" (γ Cas) adı IAU WGSN 2025 onaylı.
- Saat dilimi: cihaz New York / Tokyo iken saatler konumun diliminde (Europe/Istanbul) ve tarih kutusu doğru gece (31 Ara; 29 Şub 2028).
- ufkaCevir = AE Horizon (kırılmasız) 0,001° içinde (Vega, Sirius, Polaris, Capella).
- AR: alfa=0, beta=90 (mutlak) → bakış az 6,10°, alt 0,00° (İstanbul WMM sapması +6,09° doğru yönde uygulanıyor); alfa=90, beta=135 → az 276,09°, alt 45,00°. Euler matrisi W3C R=Rz·Rx·Ry ile elle çarpıldı, aynı.
- Bozuk Open-Meteo JSON'u: "Bulut tahmini alınamadı…" gösterildi, sayfa hatası yok.

## Bulgular

### A1-01 · KRİTİK · gok.js:129
- Açıklama: `g.karanlikYok = !g.sivilSon;` Güneş'in gün boyu −6°'nin ALTINDA kaldığı derin kutup gecesinde (ör. Longyearbyen, Aralık) −6° geçişi olmadığı için `sivilSon` null olur ve uygulama geceyi "karanlık yok" sayar. Sonuç: bütün dürbün hedefleri elenir ve kullanıcıya tam tersi söylenir: "Bu gece gök yeterince kararmıyor (Güneş ufkun 6°'den fazla altına inmiyor)"; karar satırında "tam karanlık yok". Oysa aynı gece astronomik karanlık 15:13–06:37 UT arası sürüyor (`astroSon`/`astroBas` dolu).
- Kanıt: Node: `G.geceAraligi(new Date('2026-12-21T15:00:00Z'), G.gozlemci(78.2232,15.6267,0))` → `{"sivilSon":null,"denizciSon":"…11:52…","astroSon":"2026-12-21T15:13:55Z","astroBas":"2026-12-22T06:37:37Z","karanlikBas":"…15:13…","karanlikSon":"…06:37…","karanlikYok":true}`; Güneş en yüksek −11,1°, en alçak −34,8°; `hedeflerBuGece(...).filter(gorunur).length` = 0. Tarayıcıda (b1.js, Longyearbyen, 2026-12-21 19:00 UT) Dürbün hedefleri: "Bu gece gök yeterince kararmıyor (Güneş ufkun 6°'den fazla altına inmiyor)…"; karar: "… · tam karanlık yok · …".
- Önerilen düzeltme: `karanlikYok`'u Güneş'in −6°'nin altına inip inmediğine göre kur: ör. `g.karanlikYok = !g.karanlikBas || (!g.sivilSon && cisimAltAz('Sun', ogle, gzl).alt > -6)`; ya da `sivilSon` yokken öğlede Güneş −6°'nin altındaysa karanlık var say. Hedef notundaki ve gozlem.js:475'teki cümle de bu duruma göre ayrılmalı.

### A1-02 · KRİTİK · gozlem.js:315
- Açıklama: Karar satırı `if (!(g.batis && g.astroSon)) karanlik = 'tam karanlık yok'` — Güneş'in o gün hiç batmadığı (doğmadığı) kutup gecesinde `batis` null olduğu için, astronomik karanlık saatlerce sürse de "tam karanlık yok" yazar ve "iyi" kararı "idare eder"e düşürülür.
- Kanıt: b1.js, Tromsø (69,6496 K, 18,956 D, Europe/Oslo), saat 2026-12-21T15:00Z, bulut %5: karar = "Bu gece gözlem: idare eder · gece boyunca büyük ölçüde açık · tam karanlık yok · Ay %91…". Aynı gece Node: `astroSon` 21.12 16:56, `astroBas` 22.12 06:28 (Oslo saati), `karanlikYok:false`.
- Önerilen düzeltme: koşul `if (!g.astroSon)` (ya da `!g.karanlikBas || g.karanlikYok`) olsun; kutup gecesi `batis`'in yokluğuyla karıştırılmasın.

### A1-03 · ÖNEMLİ · gozlem.js:317-318
- Açıklama: Ay %25–%40 aydınlıkken `ayAydinlatirMi()` (gozlem.js:281, `ay.oran < 0.4` → false) false döner; `ay.oran < 0.25` da tutmadığı için karar satırı "Ay karanlık saatlerde alçakta ya da ufkun altında" der. Ay karanlığın başında yüksekte olsa bile bu yazılır — yanlış bilgi.
- Kanıt: b2.js, İstanbul, tarih 2026-11-15 seçildi: karar "… · Ay karanlık saatlerde alçakta ya da ufkun altında"; özet "Hilal (büyüyen), %33 aydınlık · … batış 22:38". Node: tam karanlık 19:20'de başlarken Ay 23,5° yükseklikte, 21:50'ye kadar 5°'nin üstünde (`cisimAltAz('Moon', …)` çıktısı: 16:20Z 23,5°, 17:20Z 18,1°, 18:20Z 10,8°, 18:50Z 6,7°).
- Önerilen düzeltme: üçüncü dalı ayrı yaz: Ay karanlık saatlerde gerçekten 5°'nin üstüne çıkıyorsa (oran < 0,4 olsa da) "Ay %33, karanlığın ilk saatlerinde gökte; ışığı zayıf" gibi doğru bir cümle; "alçakta ya da ufkun altında" yalnız örnekleme bunu gösterirse.

### A1-04 · KÜÇÜK · gozlem.js:313 (ve 841)
- Açıklama: Gece hiç yoksa (kutup günü) ya da sivil alacakaranlık sınırı yoksa (derin kutup gecesi) `havaYaz` `havaOzet = 'yok'` yazar; karar satırı nedenini "bulut tahmini yok (yalnız önümüzdeki 3 gün)" diye açıklar. Seçili gün bugün olduğu için gerekçe yanlış.
- Kanıt: b1.js, Tromsø 2026-06-21 21:00Z: karar "Bu gece · bulut tahmini yok (yalnız önümüzdeki 3 gün) · tam karanlık yok · …"; Longyearbyen 2026-12-21: aynı ifade.
- Önerilen düzeltme: `bas/son` yokluğu için ayrı durum (ör. `'gece-yok'`) ve ayrı cümle; kutup gecesinde bulut aralığı olarak `karanlikBas–karanlikSon` (ya da bütün gün) kullanılabilir.

### A1-05 · KÜÇÜK · gozlem.js:389
- Açıklama: Gezegen o gece hiç doğmuyor/batmıyorsa (yüksek enlemde çevrekutupsal) `dogBat` boş kalır, satır "… takımyıldızında ·" diye sondaki ayraçla biter; doğmadığı/batmadığı da söylenmez.
- Kanıt: b1.js, Tromsø 2026-12-21: "Uranüs … 5,6 kadir · Boğa takımyıldızında ·".
- Önerilen düzeltme: `dogBat` boşsa ayraç ekleme; mümkünse "bu gece batmıyor" yaz.

### A1-06 · KÜÇÜK · veri/meteor.json:284, 310
- Açıklama: ZHR metninde kaynak tablosuna iç gönderme kullanıcıya gösteriliyor: "5–10 (Tablo 5: 7)" (Güney Taurid 2027), "≈15 (Tablo 5: 15+)" (Leonid 2027). gozlem.js:487 parantez içini "ZHR (Tablo 5: 7)" diye listeye basıyor; kullanıcı "Tablo 5"in ne olduğunu bilemez.
- Kanıt: meteorSatir'in düzenli ifadesi `/\(.*\)/` → `'ZHR ' + String(m.zhr).replace(/^\S+\s*/, '')` = "ZHR (Tablo 5: 7)". (2028 için türetilen kayıtlar da bu metni miras alıyor.)
- Önerilen düzeltme: metni "5–10 (IMO çizelgesinde 7)" gibi açık yaz.

### A1-07 · KÜÇÜK · ar.js:165, 176
- Açıklama: Masaüstü Chromium'da (153) `DeviceOrientationEvent.requestPermission` var; algılayıcısız cihazda "Pusulayı aç" düğmesi gösterilir ve durum satırı "Pusulayı kullanmak için üstteki "Pusulayı aç"a dokun…" der. Düğmeye basınca "Yön algılayıcı izni verilmedi" çıkar — algılayıcı yokken izin istemeye yönlendirmek yanıltıcı.
- Kanıt: b4.js: `{ rp: 'function', abs: true, btn: true, ua: '…HeadlessChrome/153…' }`; tıklama sonrası `['dokunma', 'Yön algılayıcı izni verilmedi; parmağınla sürükleyerek gezebilirsin.', true]`.
- Önerilen düzeltme: `izinGerekli()` yalnız iOS (ör. `webkitCompassHeading` desteği / dokunmatik cihaz) için doğru dönsün ya da 1,5 sn içinde hiç olay gelmediyse düğme yerine "yön algılayıcısı yanıt vermedi" mesajı gösterilsin.

## Askıda
- Android Chrome'da `requestPermission` artık var: gerçek bir Android telefonda izin istenmeden `deviceorientationabsolute` olaylarının gelip gelmediği (A1-07'nin telefonda da görünüp görünmediği) cihazsız kanıtlanamadı.
- Mira (gok.js:435) GCVS öğeleri (JD 2444839, 331,96 gün) GCVS'ten bu turda indirilmedi; yalnız iç tutarlılık denetlendi (öğeler 10 Mayıs 2024'ü veriyor, kod yorumuyla aynı).
- Uydu geçişleri (SGP4, parlaklık) dış bir kaynakla (Heavens-Above) karşılaştırılmadı: CelesTrak yasağı nedeniyle yalnız 2026-10-27 fikstürü var; bugünkü öğeler olmadan karşılaştırma yapılamaz. Kod okuma ile gölge silindiri, faz açısı ve TEME/EQD Güneş yönü mantıklı.
- Ay örtme anları dış kaynakla (IOTA/Occult) bu turda karşılaştırılmadı (depo testleri Skyfield ile karşılaştırıyor). 21 Ara 2026 Ülker örtmesi Tromsø için listelendi; doğruluğu bağımsız kaynakla sınanmadı.
- Kutup gecesinde (Tromsø) gezegenler için arama penceresi öğleden öğleye 24 saat (gok.js:254); "en iyi" saat sivil alacakaranlığa (öğle) düşebilir. Bunun yanlış öneri ürettiği somut bir örnek bulunamadı.
- Nominatim hatası uygulama.js'te (alanım değil); okunmadı, denenmedi.
