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
