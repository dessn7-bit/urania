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
