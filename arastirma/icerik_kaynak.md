# İçerik paketi (v50) — kaynaklar ve kararlar

Erişim tarihi bütün kaynaklar için 13 Kasım 2026.

## 1. Takımyıldız mitleri (`veri/mitler.json`)

- Kaynak: E. M. Berens, *The Myths and Legends of Ancient Greece and Rome* (1880), kamu malı; Project Gutenberg #22381
  (`https://www.gutenberg.org/cache/epub/22381/pg22381.txt`). Kitabın hazır Türkçe çevirisi (epub) elde bulunamadı; bu yüzden
  İngilizce metinden Türkçeye aktarıldı.
- Orion Berens'te yok. Orion ve Ülker (Pleiadlar) için: Thomas Bulfinch, *The Age of Fable* (1855), kamu malı; Project Gutenberg
  #4928 "Bulfinch's Mythology", XXVI. bölüm.
- 21 anlatı: Berens 19, Bulfinch 2. Her kayıtta bölüm başlığı, özgün kitap sayfası (Gutenberg metnindeki `{…}` işaretleri),
  Gutenberg satır aralığı ve bölümün ilk sözcükleri (`ozgun_alinti`) vardır; satır aralıklarının ilk satırları
  `arastirma/mit_kaynak_ozet.json` içindedir.
- Kural: kaynakta olmayan hiçbir şey eklenmedi. "Göğe konulma" yalnız kaynağın açıkça yazdığı dört öyküde geçer: Kallisto
  (Büyük Ayı), Argo, Orion, Pleiadlar. Öteki öykülerde kitap takımyıldızdan söz etmez; arayüz bunu söyler
  ("Kitap bu öyküyü bir takımyıldıza bağlamaz; eşleme Urania'nındır").
- Kaynak bölümü kısa olan yedi anlatı 150 kelimenin altındadır (`kisa: true`): Kallisto, Europa, Nemea aslanı, Kyknos,
  Asklepios, Ganymedes, Hesperidlerin ejderi; Ülker de (Bulfinch) kısadır. Uzatmak için bir şey eklenmedi.
- Kaynakta anlatısı olmadığı için yazılmayanlar: Akrep (Berens'te hiç geçmez; Bulfinch'in Orion bölümünde de yok),
  Kuzey Tacı (Berens'te Ariadne'nin tacı yalnız bir sözle anılır).
- Lir için iki anlatı vardır (Hermes'in liri icadı; Orpheus). Ganymedes hem Kova'ya hem Kartal'a bağlandı.

## 2. Türkçe geleneksel gök adları (`veri/turkce_gok_adlari.json`)

- TDK Güncel Türkçe Sözlük (`https://sozluk.gov.tr/gts?ara=…`): her ad için ilgili maddenin anlam metni birebir alıntılandı.
- Shabnam Hasanlı Garibova (2021), "The Semantic-Structural Changes of Astronomical Names in Medieval Period Turkic Scientific
  Works", *Uluslararası Türkçe Edebiyat Kültür Eğitim (TEKE) Dergisi* 10/3, s. 852–863
  (`https://dergipark.org.tr/tr/pub/teke/article/1000526`). Makale İngilizcedir; DOI bulunamadı.
- Makale *Yetigen* ve *Temür Kaznuk* adlarını Divânu Lügati't-Türk'ten sayar ama hangi gök cismi olduklarını yazmaz
  (yazım "Kaznuk"tur). Bu yüzden Büyük Ayı ve Kutup Yıldızı'na BAĞLANMADI; dosyada `karsiligi_verilmeyen` listesindedir.
  *Ülker*i de makale karşılıksız sayar; M45 eşlemesi TDK'nin "Ülker" maddesinden gelir (kayıtta not var).
- TDK'de bulunamayanlar: sabah yıldızı, tan yıldızı, yediger, akyıldız (bitişik). Gök anlamı olmayanlar alınmadı.

## 3. Dürbün tarifleri (`veri/hedef_tarifleri.json`, `veri/LICENSE-binocularsky.txt`)

- Steve Tonkin, The Binocular Sky (`https://binocularsky.com/`), 50 mm nesne sayfaları; "Location" ve "What You Should See".
  Lisans: site "Everything here is published under a Creative Commons CC BY-NC-SA License" der ve CC BY-NC-SA 3.0'a bağlar.
- 26 hedefin 24'üne tarif eklendi. Sitede sayfası olmayanlar: Mizar, Alcor. M36–M37–M38 ve NGC 869–NGC 884 sitede ortak metin
  taşır. Harita ve görsel alınmadı.
- Yıldız adları: Bayer adının yanına Urania'daki ad parantezle eklendi; eşleme `veri/yildiz_bilgi.json`'daki SIMBAD
  kimliklerinden yapıldı (ör. `* gam Cas` = Tiansi).

## 4. Yıldız bilgisi (`veri/yildiz_bilgi.json`, `araclar/yildiz_bilgi.py`)

- SIMBAD (CDS) TAP, Harvard aynası: tayf türü, paralaks ve hatası, nesne türü, kimlikler (HIP, WDS, değişen yıldız adı).
  Hipparcos ana kataloğu (VizieR I/239, Harvard aynası): V parlaklığı karşılaştırması.
- Eşleme önce konumla yapılır: katalog konumunun 15 yay saniyesi içindeki, tayf türü bilinen en yakın yıldız. (İlk sürümde
  parlaklığa göre seçim Alkalurops'u yanlış bileşene, μ² Boo'ya bağlamıştı; bağımsız doğrulayıcı buldu, düzeltildi.) Seçilen
  bileşenin paralaksı yoksa aynı 15″ içindeki sistem kaydınınki kullanılır (`plxSistem`). SIMBAD'ın birleşik akı tablosunda V
  değeri olmayan yıldızlar da var (ör. Errai, Chalawan, Copernicus); onlarda parlaklık karşılaştırması yapılamaz.
- SIMBAD V ile Hipparcos V arasında 0,15 kadirden büyük fark: dosyadaki `vFarklari` listesi (La Superba, Tiansi, Mekbuda,
  Dhanishta, Dalim, Dolones, Mintaka, Seat).
- Uzaklık: 1 pc = 3,2616 ışık yılı (IAU tanımlarından hesaplanır). Paralaks hatası paralaksın %10'unu aşan 40 yıldızda
  uzaklık aralık olarak gösterilir (ör. Deneb).
- Çift/değişen: SIMBAD nesne türü ve kimlikler (WDS kaydı, "V* …" adı). WDS kaydı görsel çiftleri de içerir; arayüz bunu
  "çift yıldız kataloğunda kayıtlı (WDS)" diye yazar.
