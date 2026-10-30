# Urania dersleri v2 — yazım kılavuzu

Okur: meraklı bir yetişkin (Kaan; Türk, İstanbul, astronomiye meraklı, lise matematiği yeter). Dersler uygulamada okunur ve telefonda SESLİ dinlenir.

## Hedef
- Mevcut dersler (veri/dersler.json, d1–d11): içerik 2–3 katına çıkar (2000–3000 kelime bölüm paragrafı), daha anlaşılır olur. Mevcut dersteki doğrulanmış bilgi ve kaynaklar korunur, eksikler tamamlanır, anlatım sadeleşir.
- Yeni dersler (d12–d19): 1800–2800 kelime.

## Şema (tek dosya: arastirma/dersler_v2/dNN.json)
{
  "id": "d12",
  "unite": "gokyuzu" | "gunes_sistemi" | "yildizlar" | "gezegen_yasam" | "evren",
  "yeni": true,                       // yalnız yeni derslerde
  "baslik": "Kısa, merak uyandıran başlık",
  "ozet": "2–3 cümle: bu derste ne öğreneceksin",
  "on_bilgi": ["d2"],                 // varsa önce okunması iyi olan dersler
  "bolumler": [                        // 5–10 bölüm
    { "baslik": "...",
      "paragraflar": ["...", "..."],  // her paragraf ≤150 kelime, düz metin
      "ornek": { "baslik": "Örnek: ...", "metin": "Adım adım, sayılarla çözülmüş örnek. Sonuçta birimi söyle." },   // en az 2 bölümde
      "akilda": "1–2 cümlelik ara özet: bu bölümden aklında kalması gereken" }
  ],
  "formuller": [ { "ad": "...", "ifade": "...", "aciklama": "Her harfin anlamı ve birimi; ne zaman geçerli" } ],
  "anahtar_sayilar": [ { "deger": "...", "aciklama": "...", "kaynak_url": "https://..." } ],   // ≥6, her biri kaynaklı
  "sozluk": [ { "terim": "...", "tanim": "Tek cümle" } ],          // ≥6
  "defter_notu": ["5–10 kısa not, deftere elle yazılacak"],
  "sorular": [ { "soru": "...", "cevap": "Kısa ama gerekçeli cevap" } ],   // ≥6: hatırlama, anlama, hesap, yorum karışık
  "kaynaklar": [ { "ad": "...", "url": "https://..." } ]          // ≥6
}

## Anlatım kuralları
- "Sen" diye hitap et (siz değil). Kısa, net cümleler. Her yeni terimi ilk geçtiği yerde tanımla.
- Her bölüm: önce gündelik bir bağlam ya da soru, sonra kavram, sonra "neden önemli". Benzetme kullan ama benzetme fiziği yanlış anlatmasın; sınırını söyle.
- Formül varsa sözle açıkla ve çalışılmış örnekle hesapla. Lise matematiği yeter; türetme gerekmez.
- Gözlemle bağ kur: İstanbul'dan (41° K), çıplak gözle ya da 7×50 dürbünle ne görülür? Uydurma gözlem iddiası yok; görünürlük iddiaları da kaynaklı olsun.
- Belirsizlik ve tartışmayı dürüstçe söyle ("yaklaşık", "ölçümler arasında fark var", "henüz bilinmiyor").
- Paragraflarda markdown yok (** # - yok), madde işareti yok. Sayılar Türkçe: ondalık virgül, binlik nokta (1.988, 0,39).
- Sembol kullanabilirsin (× ≈ ° 10³ M☉ km/s ±); uygulama bunları sesli okurken çevirir. Yeni bir sembol kullanacaksan denetim betiği uyarır.
- Takımyıldız adları Türkçe (veri/takimyildiz.json'daki "ad"), uygulamadaki terimler: kadir, sağ açıklık, dik açıklık, yükseklik, azimut, tutulum, ışık yılı, astronomik birim (AB), parsek, Güneş kütlesi (M☉), tayf.
- Kaynakların cümlelerini kopyalama; kendi cümlelerinle yaz (telif). Uzun alıntı yok.

## Kaynak kuralları (Kaan'ın kesin kuralı)
- Hiçbir bilgiyi, sayıyı, tarihi ya da adı bellekten yazma. Önce kaynakta bul (WebSearch/WebFetch), sonra yaz. Bulamadığını yazma; derste "bilinmiyor" de ya da çıkar.
- Tercih: NASA, ESA, ESO, NOIRLab, IAU, NIST, JPL, NOAA, hakemli makaleler (arXiv/ADS), üniversite sayfaları; Wikipedia ikincil kaynak olabilir ama sayıları mümkünse birincil kaynakla çapraz kontrol et (2 kaynak).
- OpenStax KULLANMA (lisansı yapay zekâ kullanımını yasaklıyor).
- Her ders için ayrıca arastirma/dersler_v2/dNN_kaynak.md yaz: derste geçen HER sayı, tarih, ad ve olgusal iddia için satır: iddia | kaynak URL | kaynaktaki ifade (kısa alıntı ya da değer). Doğrulama ajanı bu dosyayla tek tek kontrol edecek.

## Denetim
- Bitirince çalıştır: python3 araclar/ders_denetim.py dNN   (HATA kalmamalı; uyarıları düzelt).

## Müfredat ve kapsam sınırları (tekrar olmasın diye)
Ünite gokyuzu (Gökyüzünü okumak):
- d1 Gökyüzünü okumak: gök küresi, ufuk ve ekvatoral koordinatlar, günlük dönüş, yıldız günü, mevsimler ve tutulum, kutup yıldızı ve enlem, kadir ölçeği, ışık kirliliği (Bortle).
- d2 Işık ve tayf: elektromanyetik tayf, dalga boyu/frekans, foton enerjisi, kara cisim ışıması, Wien, Stefan-Boltzmann, soğurma/salma çizgileri ve element parmak izi, Doppler kaymasının temeli, atmosfer pencereleri.
- d12 (YENİ) Teleskoplar: mercekli ve aynalı teleskop, açıklık ve ışık toplama, ayırma gücü (kırınım sınırı), büyütme ve göz merceği, kundaklar, atmosferin titreşimi ve uyarlamalı optik, radyo ve kızılötesi teleskoplar, interferometri, uzay teleskopları (Hubble, JWST).
- d11 Dürbünle gözlem: 7×50'nin anlamı, çıkış göz bebeği, göz bebeği ve yaş, karanlık uyumu, kırmızı ışık, dürbünü sabitlemek, yıldız atlama ile hedef bulma, mevsimlik dürbün hedefleri (Messier kataloğu), gözlem defteri tutmak.
Ünite gunes_sistemi (Güneş Sistemi):
- d3 Kütleçekim ve yörüngeler: Kepler'in üç yasası, Newton'un kütleçekimi, yörünge hızı, kurtulma hızı, gelgitler (Ay ve Güneş katkısı), Lagrange noktaları kısaca.
- d9 Gezegenler: sekiz gezegen tek tek (yapı, atmosfer, uydu, keşif görevleri), karasal ve dev gezegen ayrımı, Güneş Sistemi'nin oluşumu (öngezegen diski).
- d10 Ay: evreler, yıldızıl ve kavuşum ayı, eş zamanlı dönme ve librasyon, Ay ve Güneş tutulmaları, yüzey (denizler, kraterler), Ay'ın kökeni (dev çarpışma), Apollo ve Artemis.
- d19 (YENİ) Küçük cisimler: asteroitler ve asteroit kuşağı, kuyruklu yıldızlar (çekirdek, koma, iki kuyruk), meteor/meteoroit/göktaşı farkı, meteor yağmurlarının kuyruklu yıldızlarla bağı ve radyant, cüce gezegenler (Plüton'un yeniden sınıflandırılması, IAU 2006), Kuiper kuşağı, Oort bulutu, gezegen savunması (DART).
Ünite yildizlar (Yıldızlar):
- d4 Güneş: iç yapı, çekirdekte füzyon (proton-proton zinciri), ışınım ve konveksiyon bölgeleri, fotosfer, kromosfer, taç, güneş lekeleri ve 11 yıllık döngü, patlamalar ve güneş rüzgârı, kutup ışıkları, güvenli Güneş gözlemi.
- d14 (YENİ) Yıldızlararası ortam ve yıldız doğumu: gaz ve toz, bulutsu türleri (salma, yansıma, karanlık), moleküler bulutlar, Jeans çöküşü (sözel), protoyıldız, T Tauri, öngezegen diskleri, Orion Bulutsusu örneği, yıldız oluşum hızı.
- d5 Yıldızların hayatı: tayf sınıfları, Hertzsprung-Russell diyagramı, anakol, kütle-ışınım ilişkisi, ömür, yıldızın içi dengesi (hidrostatik denge), kırmızı dev evresi.
- d15 (YENİ) Kümeler, çift ve değişen yıldızlar: açık ve küresel kümeler, küme H-R diyagramı ve yaş tayini (dönüm noktası), çift yıldızlar (görsel, tayfsal, örten) ve kütle ölçümü, Algol, değişen yıldız türleri (Sefeidler kısaca; uzaklık ölçümü d17'de), Mira.
- d6 Yıldızların ölümü: düşük kütleli yıldızın sonu (gezegenimsi bulutsu, beyaz cüce, Chandrasekhar sınırı), büyük kütleli yıldızın sonu (demir çekirdek, çöküş süpernovası), Ia süpernovaları, nötron yıldızları ve pulsarlar, ağır elementlerin kökeni (nükleosentez, kilonova), kara deliğin oluşumu (ayrıntı d16'da).
- d16 (YENİ) Kara delikler ve kütleçekim dalgaları: olay ufku ve Schwarzschild yarıçapı, zaman genişlemesi ve gelgit (sözel), yıldız kütleli ve süper kütleli kara delikler, Sgr A* (yıldız yörüngeleri, Nobel 2020), M87* ve Sgr A* görüntüleri (EHT), kütleçekim dalgaları, LIGO/Virgo, GW150914, GW170817.
Ünite gezegen_yasam (Ötegezegenler ve yaşam):
- d13 (YENİ) Ötegezegenler: ilk keşifler (1992 pulsar gezegenleri, 1995 51 Pegasi b), yöntemler (geçiş, dikine hız, doğrudan görüntüleme, mikromercek, astrometri), bugünkü sayılar (NASA Exoplanet Archive), gezegen türleri (sıcak Jüpiter, süper Dünya, mini Neptün), yaşanabilir bölge, TRAPPIST-1, JWST ile atmosfer ölçümü.
- d18 (YENİ) Astrobiyoloji: yaşamın gereksinimleri (sıvı su, enerji, karbon kimyası), Dünya'da yaşamın erken izleri, aşırı ortam canlıları, Mars (geçmiş su, Perseverance), Europa ve Enceladus (yeraltı okyanusları), Titan, biyoimzalar, Drake denklemi, Fermi paradoksu, SETI.
Ünite evren (Galaksiler ve evren):
- d7 Galaksiler: Samanyolu'nun yapısı ve bizim yerimiz, galaksi türleri (Hubble çatalı), Yerel Grup, Andromeda ile gelecekteki birleşme, galaksi çarpışmaları, aktif galaksi çekirdekleri ve kuasarlar, galaksi kümeleri.
- d8 Evrenin tarihi: Büyük Patlama'nın ne olduğu/ne olmadığı, zaman çizelgesi (ilk saniyeler, ilk çekirdekler, yeniden birleşme ve kozmik mikrodalga arka plan, karanlık çağ, ilk yıldızlar ve galaksiler, yeniden iyonlaşma), evrenin yaşı.
- d17 (YENİ) Kozmoloji: kırmızıya kayma, Hubble-Lemaître yasası, kozmik uzaklık merdiveni (ıraklık, Sefeidler, Ia süpernovaları), karanlık madde kanıtları (dönme eğrileri, kütleçekimsel mercek, Mermi Kümesi), karanlık enerji (1998, Nobel 2011), evrenin bileşimi (Planck), Hubble gerilimi, evrenin olası geleceği.

## v3 GENİŞLETME (Ekim 2026, Kaan: "dersler çok kısa"; 1 ve 3 seçildi)

Bu bölüm yukarıdakilerle çelişirse bu bölüm geçerli.

### Mevcut dersler (d1–d19): her ders yaklaşık 2 katı
- Hedef: bölüm paragrafları toplamı 4.500–6.000 kelime (şu an 1.900–3.000). Dolgu yok: yeni bilgi, daha çok açıklama, daha çok "neden", gündelik bağlam, İstanbul'dan gözlem bağlantısı, ek çalışılmış örnekler.
- MEVCUT BÖLÜM BAŞLIKLARI AYNEN KALIR (tek harf değişmez) ve hiçbir mevcut bölüm silinmez. Ders çizimleri, ders içi deneyler ve sınav soruları bölümlere başlıkla yeniden eşlenir (araclar/bolum_esle.py); başlık değişirse eşleme kırılır.
- Yeni bölümleri istediğin yere ekleyebilirsin (toplam 6–16 bölüm). Mevcut bölümlerin paragraflarını genişletebilir, sadeleştirebilirsin; doğrulanmış bilgiyi koru.
- sorular ≥ 10, anahtar_sayilar ≥ 8, sozluk ≥ 12, en az 4 çalışılmış örnek, kaynaklar ≥ 8.
- Mevcut sorular / anahtar_sayilar / sozluk öğelerindeki "kid" alanını SİLME, DEĞİŞTİRME (tekrar kartlarının ilerlemesi ona bağlı). Yeni öğeye kid yazma; derleme betiği verir. Mevcut öğeyi silme; düzeltmen gerekirse metnini düzelt, kid kalsın.
- sozluk terimleri uygulamanın ortak Astro sözlüğüne de gider ve ders metninde terimin geçtiği yer altı noktalı olur: terimi metinde geçtiği yalın biçimiyle yaz ("kırmızı dev", "anakol"), tanım tek açık cümle, kendi sözlerinle, kaynaklı.

### Yeni dersler (d20–d24): 4.500–6.000 kelime, "yeni": true
- d20 Astronominin kısa tarihi (ünite gokyuzu): Babil ve Mısır gözlemleri; Antik Yunan (Eratosthenes'in Dünya'yı ölçmesi, Aristarkhos, Hipparkhos ve kadir/presesyon, Ptolemaios); İslam dünyası (el-Battani, el-Biruni, Uluğ Bey ve Semerkant gözlemevi ile yıldız kataloğu, Takiyüddin ve İstanbul gözlemevi); Kopernik, Tycho Brahe, Kepler, Galileo, Newton; teleskoptan sonra (Herschel, tayfölçüm, Leavitt, Hubble) yalnız kısaca, ayrıntı diğer derslerde. Tarih, ad ve sayıların hepsi kaynaklı; tartışmalı olanlar öyle söylenir.
- d21 Takımyıldızlar ve mevsimlerin gökyüzü (gokyuzu): 88 takımyıldız ve IAU sınırları; takımyıldız ile asterizm (Büyük Kepçe, Yaz Üçgeni) farkı; burçlar ve tutulum (Yılancı; astroloji bilim değildir, neden değil olduğu kısaca ve kaynaklı); yıldız adları (Arapça kökenli adlar, IAU WGSN), Bayer harfleri; İstanbul'dan mevsim mevsim belirgin takımyıldızlar ve onları bulma yolları (yıldız atlama); takımyıldız mitolojisi yalnız kısaca ve kaynaklı. Uygulamadaki Türkçe takımyıldız adlarını kullan (veri/takimyildiz.json).
- d22 Zaman, takvim ve gökyüzü (gokyuzu): güneş günü ile yıldız günü (d1'i tekrarlama, ona dayan), zaman denklemi ve analemma, yerel saat, saat dilimleri ve Türkiye'nin kalıcı UTC+3'ü, UTC, atom saati ve artık saniye (kaldırılma kararı), tropik yıl, Jülyen ve Gregoryen takvimi (Türkiye'de geçiş), Hicri (ay) takvimi ve ay-güneş takvimleri, haftanın günlerinin gök cisimlerinden gelen adları, presesyon.
- d23 Uzaya çıkmak: roketler, yörüngeler ve uzay görevleri (gunes_sistemi): roket ilkesi ve Tsiolkovsky denklemi (sözle + örnek), yörüngeye çıkmak için gereken hız, yörünge türleri (alçak yörünge, yer eşzamanlı, Güneş eşzamanlı), Hohmann aktarımı, kütleçekim yardımı, Uluslararası Uzay İstasyonu, Voyager'lar ve güneşkürenin sınırı, Türkiye'nin uzay çalışmaları (yalnız resmî kaynaklı olgular), uzay çöpü ve Kessler sendromu. d3 (yörünge fiziği) ve d18 (Mars görevleri) ile tekrar etme, onlara gönder.
- d24 Gökyüzünü fotoğraflamak (gokyuzu): telefonla Ay ve parlak gezegenler, dürbün ya da teleskop arkasından fotoğraf (afokal), pozlamanın üç ayarı (ISO, enstantane, diyafram), sabit üçayakla yıldız izi ve yıldızları nokta tutmak için kaba kurallar (sınırlarıyla), RAW, gece modu ve görüntü yığınlama (stacking) mantığı, ışık kirliliğiyle baş etmek, uydu izleri. Ürün önerisi yok; teknik iddialar kaynaklı.
- Her yeni ders için ayrıca arastirma/dersler_v2/dNN_sinav.json yaz: veri/sinavlar.json biçiminde 4 çoktan seçmeli soru ({"id": "dNN-1", "soru", "secenekler"[4], "dogru", "aciklama", "ders": "dNN", "bolum": <0'dan dizin>}); doğru cevap dersin kendi metnine dayanır.

### Araştırma bütçesi ve yöntem
- WebSearch payı paylaşılıyor: ders başına en çok 15 arama. Önce dersin kaynaklar listesindeki ve dNN_kaynak.md'deki URL'leri WebFetch ile oku (bunlar proje dosyasında olduğu için serbest); yeni bilgi için arama yap. WebFetch yalnız kendi aramandan ya da proje dosyalarından gelen URL'lere. Bir alan adı izin hatası verirse ona bir daha gitme.
- dNN_kaynak.md'ye her YENİ iddia için satır ekle (iddia | URL | kaynaktaki ifade). Eski satırlar kalır.
- Bitince: python3 araclar/ders_denetim.py dNN (HATA yok). araclar/ders_verisi_v2.py'yi ÇALIŞTIRMA (koordinatör derler).

## v4 FİZİK ÜNİTESİ (30 Ekim 2026, Kaan: "görelilik, Feynman, kuantuma giriş… fizik bilmeyen birinin anlayacağı dilde"; "fiziğe astronomiye dair ne varsa")

Bu bölüm yukarıdakilerle çelişirse bu bölüm geçerli. Yeni ünite: fizik ("Fiziğin büyük fikirleri"). Ünite sırası: d30, d33, d25, d26, d27, d28, d29, d31, d32. on_bilgi yalnız sırada önce gelen derslere (ve d1–d24'e) işaret eder.

### Okur ve dil
- Okur fizik bilmiyor: lise matematiği hatırı sayılır ölçüde unutulmuş, merakı yüksek bir yetişkin. Her terim ilk geçtiği yerde gündelik sözcüklerle tanımlanır. Formül kullanılabilir ama önce sözle anlatılır, sonra her harfin ne olduğu söylenir, sonra gündelik sayılarla bir örnek gelir.
- Düşünce deneyleri ve benzetmeler serbest; ama benzetmenin nerede çöktüğü de söylenir (ör. "lastik çarşaf" benzetmesinin eksikleri). Ezber cümle değil, "neden böyle" ve "bunu nereden biliyoruz" (hangi deney, hangi yıl, kim) anlatılır.
- Yaygın yanlış anlamalar açıkça düzeltilir (ör. "gözlemci = bilinç" değil; "kuantum her şeyi açıklar" değil; E=mc² "kütle enerjiye dönüşür" ifadesinin inceliği). Yorum tartışmaları (Kopenhag, çok dünyalar vb.) taraf tutmadan, "fizikçiler bu konuda anlaşamıyor" diye verilir.
- Her derste astronomiyle bağ: Güneş'in yanması, yıldız tayfları, GPS uyduları, kara delikler, kozmik ışınlar, kütleçekim dalgaları, evrenin ilk anları gibi. Mevcut derslere (d2, d4, d5, d6, d8, d16, d17) gönderme yap, onları tekrar etme.
- Gündelik bağlam: telefon GPS'i, mikrodalga fırın, LED, güneş paneli, MR, PET taraması, nükleer santral, karbon-14 tarihleme… Yalnız kaynaklı iddialar.
- Türkiye bağlantısı yalnız resmî ya da güvenilir kaynakla (ör. CERN'e Türkiye'nin ortak üyeliği, TENMAK, Türk fizikçiler); uydurma yok.

### Dersler (her biri 4.500–6.000 kelime, 10–16 bölüm, "yeni": true)
- d30 Enerji, ısı ve entropi: yıldızlar ve zamanın oku. Enerjinin korunumu, ısı nedir (moleküllerin titreşimi), sıcaklık ve mutlak sıfır, termodinamiğin yasaları sözle, entropi (düzensizlik değil, olası durum sayısı; Boltzmann), neden sıcak çay soğur da tersine olmaz, zamanın oku, yıldızlar ve yaşam düşük entropili Güneş ışığıyla nasıl beslenir, karadelik entropisi kısaca (d16'ya gönder), evrenin "ısıl ölüm" senaryosu (d17'ye gönder).
- d33 Elektrik, manyetizma ve ışık: Maxwell'in birleştirmesi. Yük ve elektrik alanı, akım ve manyetizma, Faraday'ın indüksiyonu (jeneratör), Maxwell'in denklemleri sözle ve ışığın elektromanyetik dalga olduğunun anlaşılması (hızın hesaptan çıkması), elektromanyetik tayf (d2'ye dayan, tekrar etme), radyo astronomi, Dünya'nın manyetik alanı ve kutup ışıkları, Güneş lekeleri ve manyetizma (d4'e gönder). Işığın hızı sorunu → d25'e köprü.
- d25 Özel görelilik: ışık hızı, zaman ve E=mc². Görelilik ilkesi (Galileo'nun gemisi), ışık hızının herkes için aynı olması (Michelson–Morley), eşzamanlılığın göreliliği, zaman genişlemesi (ışık saati düşünce deneyi), uzunluk kısalması, müonlar (deneysel kanıt), ikizler paradoksu, uzay-zaman, E=mc² ve anlamı (Güneş'in kütle kaybı, d4), hız sınırı. Uygulamadaki "Işığa yakın yolculuk" deneyine gönder (#deney/gorelilik). Lorentz çarpanı bir tablo ve bir örnekle.
- d26 Genel görelilik: kütleçekim eğri uzay-zamandır. Eşdeğerlik ilkesi (asansör), serbest düşüş ve "ağırlıksızlık", uzay-zamanın eğriliği (benzetmeler ve sınırları), Merkür'ün günberi kayması, 1919 tutulması ve ışığın bükülmesi (tarihsel tartışmalarıyla), kütleçekimsel kırmızıya kayma (Pound–Rebka), GPS'in iki göreli düzeltmesi (sayılarla, kaynaklı), kütleçekimsel mercek (d17), kara delikler ve kütleçekim dalgaları kısaca (d16'ya gönder), genel göreliliğin sınırları ve kuantum kütleçekim sorunu.
- d27 Kuantuma giriş I: ışık ve madde, dalga mı parçacık mı? Kara cisim ve Planck'ın kuantumu (d2'ye dayan), fotoelektrik etki ve Einstein (güneş paneli), foton enerjisi ve renk, de Broglie: maddenin dalgası, çift yarık deneyi (tek tek elektronlarla; Tonomura'nın deneyi kaynaklı), dalga fonksiyonu ve olasılık (Born), ölçüm ne demek (bilinç değil, etkileşim), Heisenberg belirsizlik ilkesi (ölçüm hatası değil), kuantum neden gündelik hayatta görünmez.
- d28 Kuantuma giriş II: atomlar, tünelleme ve dolanıklık. Bohr atomu ve tayf çizgileri (d2'ye dayan), elektron bulutu ve orbitaller, Pauli ilkesi ve periyodik tablo, beyaz cüce ve nötron yıldızını tutan dejenerasyon basıncı (d6'ya gönder), kuantum tünelleme ve Güneş'in yanması (d4), spin, süperpozisyon (Schrödinger'in kedisi ne anlatmak ister), dolanıklık, EPR ve Bell deneyleri (2022 Nobel), "ışıktan hızlı mesaj yok", kuantum teknolojileri (lazer, transistör, MR, kuantum bilgisayar: abartısız).
- d29 Feynman'ın dünyası: ışık ve maddenin tuhaf kuramı. Feynman kimdi (kaynaklı kısa yaşam öyküsü; Nobel 1965 Tomonaga ve Schwinger ile), kuantum elektrodinamiği (QED) neyi açıklar, Feynman'ın halka anlattığı "oklar" yöntemi kendi sözlerimizle (bir fotonun camdan yansıması, olasılık genliği, okların toplanması), "ışık her yolu dener" ve neden en kısa süreli yol öne çıkar (aynalar, mercekler, serap), Feynman diyagramları (çizgilerin ne anlama geldiği), QED'in olağanüstü doğruluğu (elektronun manyetik momenti: kaynaklı sayı), Feynman'ın öğretmenliği (Feynman Lectures, Challenger soruşturmasında O-halkası gösterisi). Feynman'ın kitaplarından ALINTI YAPMA; fikirleri kendi sözlerinle anlat, kaynak göster. Ünlü sözler yalnız birincil kaynaktan doğrulanırsa, kısa ve kaynaklı; doğrulanamayan "Feynman şöyle demiş" yok.
- d31 Atom çekirdeği: füzyon, fisyon ve radyoaktif saatler. Çekirdeğin yapısı, güçlü kuvvet, bağlanma enerjisi ve demir tepesi (d6'ya köprü), füzyon (Güneş'te proton-proton zinciri, d4'e gönder; ITER durumu kaynaklı), fisyon ve nükleer santral (Akkuyu: yalnız resmî kaynaklı durum), radyoaktivite türleri, yarılanma ömrü, karbon-14 ve uranyum-kurşun tarihleme (Dünya'nın yaşı, göktaşları), radyasyon ve sağlık: doz birimleri ve gündelik örnekler (muz, uçak yolculuğu, tomografi) kaynaklı.
- d32 Parçacıklar ve Standart Model: evrenin yapı taşları. Atomdan kuarka, leptonlar, dört temel kuvvet ve taşıyıcıları, Higgs alanı ve 2012 keşfi (CERN), nötrinolar (Güneş nötrinoları, salınım, 2015 Nobel), antimadde ve madde-antimadde asimetrisi (d8'e gönder), kozmik ışınlar, parçacık hızlandırıcıları, Standart Model'in açıklayamadıkları (karanlık madde d17, kütleçekim, nötrino kütlesi).

### Ek kurallar
- Her ders için dNN_sinav.json (4 soru) — v3'teki biçim.
- sozluk ≥ 15 (fizik terimleri sözlüğü besler), sorular ≥ 10, anahtar_sayilar ≥ 8, en az 4 çalışılmış örnek, kaynaklar ≥ 8.
- Sayılar: CODATA/NIST, CERN, NASA, Nobel Vakfı (nobelprize.org), Einstein Papers Project, Caltech (Feynman Lectures çevrimiçi okunabilir; alıntı değil, kaynak olarak), hakemli makaleler / arXiv, Wikipedia (önemli değerlerde ikinci kaynakla). OpenStax ve CK-12 YASAK.

## v5 AYRINTILI KONU DERSLERİ (30 Ekim 2026, Kaan: "dersleri ünite ünite ayıralım… Samanyolu, kara delikler, nötron yıldızları, kuasarlar hepsini istiyorum; Güneş Sistemi'ni kuyruklu yıldızlara, gezegenlerin ve uyduların yapılarına kadar detaylı")

Bu bölüm yukarıdakilerle çelişirse bu bölüm geçerli. Mevcut genel dersler (d9 gezegenlere genel bakış, d19 küçük cisimler, d6 yıldız ölümü, d16 kara delikler, d7 galaksiler) yerinde kalır; yeni dersler TEK BİR KONUYU DERİNLEMESİNE işler. Genel derste anlatılanı tekrarlama: ona gönder ("d9'da gördüğün gibi…") ve daha derine in.

### Yeni ünite düzeni (araclar/ders_verisi_v2.py UNITELER)
- gokyuzu: d1, d2, d11, d21, d12, d24
- gunes_sistemi (Güneş Sistemi I: Dünya, Ay ve kayalık gezegenler): d3, d34, d9, d44, d10, d22, d35, d36
- dev_gezegenler (Güneş Sistemi II): d37, d38, d39, d40
- kucuk_cisimler (Güneş Sistemi III): d41, d19, d42, d43, d23
- yildizlar: d4, d14, d5, d15
- yildiz_olum: d6, d45, d16, d46
- samanyolu: d47, d7, d48, d49
- evren: d8, d17, d20
- gezegen_yasam: d13, d18
- fizik: d30, d33, d25, d26, d27, d28, d29, d31, d32
on_bilgi yalnız bu sırada ÖNCE gelen derslere işaret eder (test bunu denetler). Fizik ünitesi en sonda: fizik derslerine "daha ayrıntısı için" diye gönderme yapılabilir ama on_bilgi'ye yazılmaz.

### Her ders (4.500–6.000 kelime, 10–16 bölüm, "yeni": true, dNN_sinav.json 4 soru)
Ortak beklenti: yapı (iç katmanlar, çekirdek, manto, kabuk / atmosfer katmanları ve bileşimi), fiziksel sayılar (kütle, yarıçap, yoğunluk, yüzey çekimi, gün ve yıl uzunluğu, eksen eğikliği, sıcaklıklar, manyetik alan), bunları NASIL bildiğimiz (hangi görev, hangi ölçüm, hangi yıl), açık sorular ve tartışmalar, İstanbul'dan gözlem (çıplak göz / 7×50 dürbün; yalnız kaynaklı ve doğru görünürlük iddiaları; uygulamanın Gökyüzü sekmesine ve ilgili deneylere gönder), en az 4 çalışılmış sayısal örnek, sözlük ≥ 15. Sayılar: NASA Planetary Fact Sheets (nssdc.gsfc.nasa.gov), NASA/JPL görev sayfaları, ESA, JAXA, IAU, hakemli makaleler/arXiv, Wikipedia (önemli değerde ikinci kaynakla). Mevcut derslerdeki sayılarla tutarlı ol (aynı sayıyı farklı verme; fark varsa kaynakları belirt).

- d34 Güneş Sistemi'nin doğuşu: güneş bulutsusu kuramı (Kant–Laplace'tan bugüne), ön-gezegen diski (ALMA HL Tau görüntüsü), kar çizgisi ve kayalık/dev ayrımı, gezegenciklerden gezegene, göç (Grand Tack ve Nice modeli: model olduklarını söyle), Geç Ağır Bombardıman tartışması, göktaşlarından yaş (4,567 milyar yıl, CAI'ler), Dünya'nın suyu nereden geldi (tartışmalı).
- d44 Dünya: bir gezegen olarak: iç yapı (sismik dalgalarla nasıl bildiğimiz; Lehmann 1936), levha tektoniği ve Türkiye'nin depremleri (yalnız kaynaklı genel bilgi: Kuzey Anadolu Fayı), manyetik alan ve dinamo, kutup kayması, atmosferin katmanları ve bileşimi, sera etkisi (255 K → 288 K, d2/d30 ile tutarlı), okyanuslar, Dünya'nın Güneş Sistemi'nde neden eşsiz olduğu, uzaydan Dünya (Soluk Mavi Nokta 1990).
- d35 Merkür ve Venüs: Merkür'ün dev demir çekirdeği, ince kabuk, kutup kraterlerindeki buz, 3:2 dönme-dolanma rezonansı, MESSENGER, BepiColombo (2026 sonu varış durumu kaynaklı); Venüs'ün geriye dönüşü, 92 bar CO₂ atmosfer, kaçak sera etkisi, sülfürik asit bulutları, süper-dönme rüzgârları, volkanizma kanıtları (Magellan, 2023 Maat Mons), Venera iniş araçları, gelecek görevler (DAVINCI, VERITAS, EnVision: durumları tarihli ve kaynaklı), fosfin tartışmasına d18'e gönder. İstanbul'dan Venüs evreleri dürbünle; Merkür'ü görmek.
- d36 Mars: iç yapı (InSight sismometresi, sıvı çekirdek), Olympus Mons ve Tharsis, Valles Marineris, kutup başlıkları (CO₂ ve su buzu), ince atmosfer ve toz fırtınaları, suyun geçmişi (Curiosity, Perseverance, Jezero deltası), Phobos ve Deimos (MMX'e gönder), metan tartışması, Mars'ın manyetik alanını kaybı (MAVEN), insanlı görev zorlukları (abartısız). İstanbul'dan Mars karşı konumu 2027 (d9 ve uygulamayla tutarlı).
- d37 Jüpiter: iç yapı (metalik hidrojen, Juno'nun "seyrelmiş çekirdek" bulgusu), Büyük Kırmızı Leke (küçülmesi, ölçümler), kuşak ve bölgeler, manyetosfer ve radyasyon, halkalar, Shoemaker-Levy 9 çarpışması (1994), Jüpiter'in Güneş Sistemi'ndeki rolü (tartışmalı "kalkan" iddiası dahil), Juno ve Galileo görevleri. Uyduları d40'a bırak; yalnız kısaca. İstanbul'dan dürbünle Galileo uyduları.
- d38 Satürn: yoğunluğu sudan az, iç yapı, altıgen kutup akıntısı, halkalar (yapısı, kalınlığı, yaşı tartışması, halka yağmuru, Cassini'nin "Büyük Final"i 2017), halka boşlukları ve çoban uydular, mevsimler, 2025 halka düzlemi geçişi. Titan ve Enceladus'u d40'a bırak. İstanbul'dan Satürn ve halkalar (7×50 halkayı ayırır mı? yalnız kaynaklı).
- d39 Uranüs ve Neptün: buz devleri (su-amonyak-metan "buz"ları), Uranüs'ün 98° eğikliği ve aşırı mevsimleri, Neptün'ün keşfi (Le Verrier, Adams, Galle 1846: hesapla keşif), rüzgârlar, Büyük Karanlık Leke, eğik ve merkezden kaymış manyetik alanlar, halkalar, Voyager 2 (1986, 1989) tek ziyaret, önerilen Uranüs görevi (tarihli ve kaynaklı), elmas yağmuru hipotezi (deney/kuram, kesin değil). Triton'u d40'a bırak.
- d40 Dev gezegenlerin uyduları: Io (volkanlar, gelgit ısınması), Europa (buz altı okyanus, Europa Clipper: 2030 varış), Ganymede (en büyük uydu, kendi manyetik alanı, JUICE), Callisto, Titan (yoğun azot atmosfer, metan gölleri, Huygens 2005, Dragonfly), Enceladus (gayzerler, Cassini'nin bulguları), Mimas, Iapetus kısaca, Miranda, Triton (geri dolanım, gayzerler, yakalanmış Kuiper cismi), uyduların iç yapısı nasıl çıkarılır (yoğunluk, eylemsizlik momenti, manyetik indüksiyon). d18'deki yaşam tartışmasıyla çakışma: oraya gönder.
- d41 Cüce gezegenler ve Kuiper kuşağı: Plüton (New Horizons 2015, Sputnik Planitia azot buzulları, Charon), 2006 IAU tanımı ve tartışması, Eris, Haumea, Makemake, Ceres (Dawn, parlak tuz lekeleri), Arrokoth (2019), Kuiper kuşağı ve dağınık disk, ayrık cisimler (Sedna), "Dokuzuncu Gezegen" hipotezi (kanıtsız, tartışmalı; Rubin Gözlemevi'nin rolü), haberlerdeki 2026 ED138'e gönderme yapmak serbest (Haberler sekmesi).
- d42 Kuyruklu yıldızlar ve Oort bulutu: çekirdek yapısı ("kirli kartopu" → "buzlu kir topu"), koma, iki kuyruk (toz ve iyon) ve neden Güneş'ten uzağa baktıkları, kısa/uzun dönemli kuyruklu yıldızlar, Oort bulutu (varsayım, doğrudan görülmedi), Halley (1986 Giotto; 2061), Rosetta ve 67P (2014–2016, Philae), ünlü parlak kuyruklu yıldızlar (Hale-Bopp, NEOWISE 2020, Tsuchinshan-ATLAS 2024: kaynaklı), yıldızlararası ziyaretçiler ('Oumuamua, 2I/Borisov, 3I/ATLAS), kuyruklu yıldız parlaklık tahminlerinin neden tutmadığı, İstanbul'dan gözlem.
- d43 Meteorlar ve göktaşları: meteoroid–meteor–göktaşı farkı, meteor yağmurları ve kuyruklu yıldız kaynakları (d19'daki listeyi tekrarlama), ateş topları, Çelyabinsk 2013, Tunguska 1908, göktaşı türleri (kondrit, akondrit, demir), göktaşlarından Güneş Sistemi'nin yaşı, Mars ve Ay göktaşları, Türkiye'deki göktaşları (yalnız kaynaklı; ör. Meteoritical Bulletin kayıtları), krater bilimi (Chicxulub ve dinozorlar, kanıtlarıyla), gezegen savunması (DART 2022, Hera, Apophis 2029 — d19 ile tutarlı), göktaşı bulursan ne yapmalı.
- d45 Nötron yıldızları ve pulsarlar: d6'dan sonra derinleşme. Jocelyn Bell'in 1967 keşfi ve Nobel tartışması (kaynaklı), pulsar mekanizması (deniz feneri), milisaniye pulsarları, Yengeç pulsarı, nötron yıldızının iç yapısı (kabuk, "nükleer makarna", çekirdek bilinmezi), kütle sınırı, magnetarlar ve 2004 SGR 1806-20 patlaması, Hulse–Taylor çift pulsarı (1993 Nobel, kütleçekim dalgası kanıtı), NICER ölçümleri, pulsar zamanlama dizileri (NANOGrav 2023 kütleçekim dalgası arka planı: kesinlik düzeyiyle), hızlı radyo patlamaları bağı (tartışmalı).
- d46 Süper kütleli kara delikler: Yay A* (S2 yıldızı, 2020 Nobel Genzel–Ghez; d16'ya gönder, tekrarlama), M87* ve Sgr A* görüntüleri (EHT 2019, 2022), kara delik kütlesi–galaksi ilişkisi (M–σ), nasıl büyüdükleri ve erken evrende neden bu kadar büyük oldukları (JWST'nin bulguları; tartışmalı), gelgit yırtılma olayları, kara delik birleşmeleri ve LISA, en büyük kara delikler (ölçüm belirsizlikleriyle), S301 haberine bağ (Haberler sekmesi).
- d47 Samanyolu: evimiz olan galaksi: Samanyolu'nu içeriden haritalamak (Herschel, Kapteyn, Shapley, Gaia), yapı (çubuklu sarmal, disk, şişkinlik, hale, kollar), boyut ve yıldız sayısı (belirsizlikleriyle), Güneş'in yeri ve yörüngesi (galaktik yıl), dönme eğrisi ve karanlık madde (d17'ye gönder), Fermi baloncukları, galaktik merkez (d46'ya gönder), uydu galaksiler ve Macellan Bulutları, Gaia-Enceladus birleşmesi, Andromeda ile gelecekteki çarpışma (2025 yeniden hesabıyla belirsizlik — kaynaklı), İstanbul'dan Samanyolu'nu görmek (ışık kirliliği, Bortle; nereye gitmeli — yalnız genel kaynaklı bilgi).
- d48 Kuasarlar ve aktif galaksiler: 3C 273 ve Maarten Schmidt 1963, kuasar = beslenen süper kütleli kara delik, birikim diski ve parlaklık (Eddington sınırı), jetler ve süperluminal yanılsama, birleşik model (Seyfert, blazar, radyo galaksi), en uzak kuasarlar, kuasarlarla evreni ölçmek (Lyman-alfa ormanı), geri besleme ve galaksi evrimi, 3C 273'ü amatör teleskopla görmek (kadir kaynaklı; 7×50 için gerçekçi ol), JWST'nin "küçük kırmızı noktaları" (Haberler sekmesine bağ; tartışmalı).
- d49 Galaksi kümeleri ve kozmik ağ: Yerel Grup, Başak Kümesi, Laniakea (2014), kümelerin kütlesi (Zwicky 1933 ve karanlık madde, sıcak X-ışını gazı, Sunyaev–Zeldovich), Mermi Kümesi (d17'ye gönder, tekrarlama), kütleçekimsel mercekle kütle ölçmek, kozmik ağ: lifler, duvarlar, boşluklar (Çoban boşluğu), sayısal benzetimler (Millennium, IllustrisTNG), DESI ve Euclid haritaları (tarihli, kaynaklı), baryon akustik salınımları sözle.

## v6 EVRENİN BÜYÜK SORULARI: KURAMLAR VE OLASILIKLAR (30 Ekim 2026, Kaan: "evrenle ilgili teoriler, kara delik, kara enerji, madde teorileri, kuantumun etkileri… sicim teorisine kadar, bütün olasılık teorileri, paralel evrenler, beyaz delik düşüncesi")

Ünite kuramlar, fizik ünitesinden SONRA, en sonda: d50, d51, d54, d52, d56, d53, d55. on_bilgi her yere (d1–d49 ve fizik dersleri d25–d33) ve bu ünitede önce gelenlere işaret edebilir.

### En önemli kural: kesinlik etiketi
Bu ünite kanıtlanmış bilgi ile spekülasyonu karıştırmaya çok açık. Her önemli iddianın kesinliğini metinde açıkça söyle; şu dört düzeyi tutarlı kullan ve ilk derste (d50) bir kez tanıt, sonra hep aynı sözlerle an:
- **Gözlemle kesinleşmiş** (ör. evren genişliyor, karanlık maddenin kütleçekim etkisi ölçülüyor),
- **Güçlü kanıtlı ama açık sorulu** (ör. enflasyonun bazı öngörüleri tutuyor; karanlık enerjinin varlığı),
- **Kuram / hipotez: matematiksel olarak tutarlı ama gözlemle desteklenmemiş** (ör. Hawking ışıması — kuramsal olarak sağlam, gözlenmedi; sicim kuramı),
- **Spekülasyon** (ör. çoklu evrenin bazı türleri, beyaz deliklerin gerçekte var olması, geçilebilir solucan delikleri).
Bir fikrin popüler olması ya da ünlü birinin savunması kanıt sayılmaz; bunu söyle. Bilim kurguyla bilimi ayır (Interstellar, Marvel vb. anılabilir ama ne kadarının bilim olduğu kaynaklı söylenir). Eleştirileri adil ver (ör. sicim kuramına "test edilemezlik" eleştirisi; çoklu evrene "bilim mi felsefe mi" tartışması) ve iki tarafı da kaynaklı aktar. Taraf tutma.

### Okur ve dil
Fizik ünitesindeki gibi: fizik bilmeyen meraklı yetişkin; her terim ilk geçtiği yerde tanımlanır; benzetmeler ve sınırları; sayısal örnekler (en az 4); "bunu nereden biliyoruz". Fizik derslerine (d25–d33) ve evren derslerine (d8, d17, d16, d46, d49) dayan, tekrar etme, gönder.

### Dersler (her biri 4.500–6.000 kelime, 10–16 bölüm, "yeni": true, dNN_sinav.json 4 soru, sozluk ≥ 15)
- d50 Karanlık madde: kanıtlar (d17'yi tekrarlama, kısaca topla) ve asıl konu ADAYLAR ve ARAMALAR: WIMP'ler ve yeraltı dedektörleri (XENONnT, LZ: en güncel sonuçlar tarihli), aksiyonlar (ADMX), steril nötrinolar, ilkel kara delikler (LIGO sonrası kısıtlar), sıcak/soğuk/ılık karanlık madde, "kayıp uydu galaksiler" ve "çekirdek–kabuk" sorunları, değiştirilmiş kütleçekim (MOND) ve neden azınlıkta kaldığı (Mermi Kümesi, CMB) ama hâlâ tartışıldığı; Euclid ve Rubin'den beklentiler. Kesinlik ölçeğini bu ders tanıtır.
- d51 Karanlık enerji: 1998 keşfi (Ia süpernovaları, 2011 Nobel; d17'ye gönder), kozmolojik sabit ve Einstein'ın "en büyük hatası" anekdotunun kaynak tartışması, vakum enerjisi ve "10^120 sorunu" (sayının nasıl elde edildiği ve neden tartışmalı olduğu), kuintesans, DESI 2024–2025 "zamanla değişen karanlık enerji" sinyali (anlamlılık düzeyi, ön sonuç olduğu; Haberler sekmesindeki süpernova haberine bağ), evrenin geleceği için ne anlama gelir (d55'e köprü).
- d54 Enflasyon ve çoklu evren: Büyük Patlama'nın ufuk ve düzlük sorunları, kozmik enflasyon (Guth 1980/81, Linde, Starobinsky), kuantum dalgalanmalarının galaksi tohumu olması (kuantumun en büyük ölçekli etkisi; CMB ile doğrulanan öngörüler: Planck), BICEP2 2014 yanlış alarmı (dürüst bir ders), sonsuz enflasyon ve "cep evrenler", çoklu evren türleri (Tegmark'ın dört düzeyi tanıtılır, her biri kesinlik etiketiyle), kuantumun çok dünyalar yorumu (Everett 1957; d27'deki yorum tartışmasına gönder), ince ayar ve antropik ilke, eleştiriler (yanlışlanabilirlik).
- d52 Kara deliklerin kuantum yüzü: Bekenstein entropisi (d30'a gönder), Hawking ışıması (1974/75) ve sıcaklık örnekleri (d16'daki değerlerle tutarlı), kara deliklerin buharlaşması ve süre, bilgi paradoksu, Page eğrisi, ateş duvarı (AMPS 2012), holografik ilke ve AdS/CFT (Maldacena 1997) — sözle, abartısız, "adalar" / Page eğrisi hesapları (2019) kısaca, analog kara deliklerde laboratuvar deneyleri (Steinhauer: neyi gösterip neyi göstermediği), ilkel kara deliklerin buharlaşması aranıyor ama bulunamadı.
- d56 Beyaz delikler, solucan delikleri ve zaman yolculuğu: genel göreliliğin denklemlerinde beyaz delik çözümleri (Schwarzschild'in tam uzantısı), neden kararsız/gözlenmemiş, "kara deliğin beyaz deliğe sıçraması" önerisi (Rovelli ve arkadaşları; döngü kuantum kütleçekimiyle bağ; spekülasyon), GRB 060614 gibi iddiaların durumu (kaynaklı, zayıf), Einstein–Rosen köprüsü (1935), geçilebilir solucan delikleri ve egzotik madde (Morris–Thorne 1988), "ER = EPR" fikri, 2022 Google Sycamore "solucan deliği" deneyinin ne olup ne olmadığı (eleştirileriyle), zaman yolculuğu: geleceğe (görelilik — kesin; d25'e gönder) ve geçmişe (kapalı zaman benzeri eğriler, kronoloji koruma varsayımı, büyükbaba paradoksu), Interstellar'ın bilimi (Kip Thorne).
- d53 Kuantum kütleçekim ve sicim kuramı: neden iki büyük kuram birleşmiyor (d26 ve d28'in sonlarına bağ), Planck ölçekleri (sayılar NIST/CODATA), sicim kuramı (titreşen sicimler, ekstra boyutlar ve neden görmüyoruz, süpersimetri ve LHC'de bulunamaması, M-kuramı, "manzara" sorunu, 10^500 sayısının dayanağı), döngü kuantum kütleçekimi, diğer yaklaşımlar (nedensel kümeler, asimptotik güvenlik — kısaca), test edilebilirlik tartışması (iki tarafı da kaynaklı), deneysel ipuçları (kütleçekim dalgalarıyla Lorentz değişmezliği testleri, masa üstü kütleçekim-dolanıklık deney önerileri).
- d55 Evrenin başlangıcı ve sonu: senaryolar: "Büyük Patlama'dan önce ne vardı?" sorusunun anlamı, Hartle–Hawking sınırsızlık önerisi, sıçrayan evren, konformal döngüsel kozmoloji (Penrose; "Hawking noktaları" iddiası ve eleştirileri), ekpirotik model; son senaryoları: ısıl ölüm (d30'a gönder), Büyük Yırtılma, Büyük Çöküş, vakum bozunması ve Higgs kütlesinin rolü (d32'ye gönder; zaman ölçeğinin belirsizliği), DESI sonuçlarının bu seçenekleri nasıl etkilediği (ön sonuç). Her senaryo kesinlik etiketiyle; zaman ölçekleri sayısal ve kaynaklı.
