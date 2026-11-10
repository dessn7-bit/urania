# v49 kalite kapısı — ilk koşu bulguları ve kararlar (2026-11-10)

## ESLint (eslint.config.js; düz yapılandırma, sourceType script, dosyalar arası global listesi)
Kurallar: no-undef, no-unused-vars, no-dupe-keys, no-unreachable. Kapsam: kök *.js, deney/**, testler/**, araclar/** (lib/ hariç: üçüncü taraf).
İlk koşu: 926 bulgu.
- 815 no-undef: (a) testlerde `page.evaluate` geri çağırmaları tarayıcıda çalışır (window, document …) → testlere tarayıcı globalleri tanıtıldı; (b) uygulama modülleri (Urania, Gok, Gorunurluk, Ses, Tani, … 30 ad) ve lib/ (Astronomy, satellite, Geomag) → URANIA_GLOBAL listesi. Gerçek tanımsız ad yok.
- 111 no-unused-vars: 93'ü bilinçli yok sayılan hata/argüman (`catch (h) { /* açıklama */ }`, `.catch(e => …)`) → kural seçeneği `caughtErrors: 'none', argsIgnorePattern: '^(e|h|_.*)$'` (gerekçe yapılandırmada). Kalan 17 gerçek kullanılmayan ad düzeltildi:
  cizim_gokyuzu.js (ad), cizim_gunes_sistemi.js (i), cizim_v4c.js (çizilmeyen `ust` yolu), cizim_v6.js ve cizim_v7.js (kullanılmayan `tr` yardımcısı), gozlem.js (`canliSayac`, kullanılmayan `sonumlemeK`), havakart.js (`top`), kartlar.js (`gunBasi`), okunus.js (`okBaglam`'ın kullanılmayan ELEMENT argümanı), uygulama.js (`bitti`), testler: ar.spec.js (`olayYolla`), deney3_durbun.spec.js (page), gorunurluk.spec.js (vsxServisi), guvenlik.spec.js (ilk), hata_ayiklama.spec.js (ISTASYON), hava_kart.spec.js (oku).
- no-dupe-keys, no-unreachable: 0.

## html-validate (index.html)
İlk koşu 4 hata, hepsi düzeltildi:
- doctype-style: `<!doctype html>` → `<!DOCTYPE html>`.
- no-inline-style: kırmızı süzgeç SVG'sindeki `style="position:absolute"` → `.suzgec-svg` sınıfı (stil.css).
- unique-landmark ×2: iki `<nav aria-label="Bölümler">` → "Bölümler (üst menü)" ve "Bölümler (alt menü)".

## axe-core (@axe-core/playwright 4.14.0; testler/axe.spec.js)
Etiketler wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa; sekmeler #gok, #deney, #ders, #ders/d10, #defter, #hesap, #haber; normal ve kırmızı mod (14 test).
İlk koşu: 0 ihlal. Sınama: aynı yapılandırma kasıtlı eklenen alt metinsiz görsel ve düşük karşıtlıklı yazıyı yakaladı (image-alt, color-contrast), yani test gerçekten çalışıyor. İstisna listesi boş.

## Boyut sınırı (testler/boyut.spec.js)
Önbellek (sw.js ASSETS) toplamı 8,37 MB / 113 dosya (sınır 12 MB). img/haber'de iki görsel 1200 px'i dikeyde aşıyordu (2026-10-29-kedi-basi-bulutsusu.jpg 762×2000, 2026-11-04-swift-atmosfere-girdi.jpg 1200×1806): uzun kenar 1200 px'e küçültüldü; araclar/haber_gorsel.py artık uzun kenarı sınırlıyor.

## Actions'taki ilk kapı koşusu (run 42823301871)
10 test Actions'ta düştü, yerelde geçiyordu: 6 kırmızı mod piksel testi (yazı kenarında renkli piksel) ve 4 ders çizimi testi ("10°", "1000 km" gibi etiketlerin SVG kenarından 1 px'ten fazla taşması). Neden: GPU'suz Linux koşucusunda Chromium'un yazı yumuşatması/ipuçlaması ve renk profili. Çözüm: yalnız CI'de `--disable-lcd-text --force-color-profile=srgb --font-render-hinting=none` (playwright.config.js). Kapı doğru davrandı: gh-pages'e dokunmadı, "yayın durdu" kaydı (#1) açtı; düzeltme geçince kayıt kendiliğinden kapandı. CI'de yeniden denemeyle geçen 1 test: kod.spec.js "Konum paneli: Enter kaydeder…" (askıda: zamanlamaya duyarlı).

## Bağımsız doğrulama (işi görmemiş ayrı bir ajan) ve düzeltmeler
Sonuç: 0 hata, 7 küçük bulgu, 5 not. Kasıtlı bozuk commit (deneme/bozuk-json, 5b928e5: veri/meteor.json'da fazladan virgül) kapıda a) adımında 17 s'de düştü, sonraki adımlar atlandı, gh-pages ve canlı site değişmedi, kayıt #4 açıldı.
Düzeltilenler:
1. Eşzamanlılık grubu bütün dallarda ortaktı → dal başına (`yayin-kapisi-${{ github.ref }}`).
2. deneme/… dallarındaki düşüşler "yayın durdu" kaydı açıyor, main'in başarısı onları kapatıyordu → deneme dalları "yayın denemesi" etiketi; "kapat" yalnız main'de.
3. Kayıt düşen denetimin adını veriyor ama hangi dosya olduğunu yazmıyordu → a–c çıktısı dosyaya alınır, ilk 40 satırı kayda girer; b ve c, a düşse de çalışır (`!cancelled()`).
4. Kararsız iki test: cevrimdisi "Yeni SURUM" (önbellek install'da açıldığı için bekleme activate'ten önce geçebiliyordu → yeni işçinin `activated` durumu beklenir; 5 tekrarda 5/5 geçti) ve tasarim_deney "Yatay telefon" (CI'de 3/5 koşuda kanvas 363 px > 273 px: ilk karede eski boy → yerleşme beklenir).
5. Haftalık denetim: kayıt açmayan doğrulanamayan bağlantılar özette yoktu → tam liste (tabanda mı, tabanda kırık mıydı) özete eklendi; ham sonuçlar 30 gün "denetim-sonuclari" eki; YONTEM.md'deki "özet her şeyi listeler" cümlesi düzeltildi.
6. Canlı doğrulama yalnız SURUM'a bakıyordu → sw.js ve bu commit'te değişen, ASSETS'teki dosyalar (en çok 25) sha256 ile karşılaştırılır (araclar/kapi_canli.sh).
7. Eski bir koşu yeniden çalıştırılırsa `git push --force` gh-pages'i geri alabilirdi → önce `git ls-remote origin refs/heads/main` bu commit mi diye bakılır; değilse yayın yeni commit'in koşusuna bırakılır.
Notlardan yapılanlar: yayın adımının ve gh-pages gönderiminin düşüşü kayıtta ayrıca adlandırılır; kayıt kapatma adımı düşerse kapı düşmez; `inputs.secim` komuta ortam değişkeniyle geçer; en.wikipedia kalıcı sürüm bağlantısı (`/w/index.php?…&oldid=`) "atlandı" yerine MediaWiki API `revids` ile denetlenir; Horizons saatleri `calendar.timegm` ile (yerel saat dilimine bağlı değil).
Yapılmayan (gerekçeli): kütüphane kaydı sürüm başına ayrı açılır (tasarım gereği); çevrimdışı testin kapsamı dört sekmeyle sınırlı (görev böyle istiyordu).
