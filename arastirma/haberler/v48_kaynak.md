# v48 (10 Kasım 2026) — makale durumu denetimi ve haftanın görüntüsü: kaynaklar

## 1. haber_dogrula.py ilk koşusu (bütün haberler, 21 makale)
Komut: `python3 araclar/haber_dogrula.py --yaz` (canlı Crossref + arXiv; yanıtlar testler/veri/haber_dogrula/ altında, girdi.json koşu öncesi veri).

Elle yapılan iki veri düzeltmesi (koşudan önce, kanıtıyla):
- 2026-11-04-mars-alba-mons-hcl: makale.yazarlar "Mège, Trokhimovskiy vd." → "Trokhimovskiy, Mège vd.". Crossref 10.1126/sciadv.aeb9422 yazar sırası: Trokhimovskiy (sequence "first"), Mège, Korablev, Olsen… Haber metni ikisini "eş baş yazar" diye anıyor; bu değişmedi.
- 2026-10-08-webb-en-uzak-frb: makale.baslik ön baskı başlığından Science'taki başlığa: "A fast radio burst at redshift 2, three billion years after the Big Bang" (Crossref 10.1126/science.adz2675, journal-article, Science, 2026-10-08; ilk yazar Caleb, ikinci Nanayakkara). Ön baskı başlığı makale.onbaski_baslik'ta. arXiv kaydında journal_ref/doi yoktu; ön baskı başlığıyla arama Science sürümünü ilk 5'te bulamadı (başlık değişmiş).

| Haber | Sonuç | Değişen alanlar |
|---|---|---|
| 2026-11-04-mars-alba-mons-hcl | Science Advances, doi:10.1126/sciadv.aeb9422 (benzerlik 1.0, doi) | doi, yayin_tarihi, cilt, sayfa, hakemli, url |
| 2026-11-04-flip-gizli-otegezegen | Nature, doi:10.1038/s41586-026-11213-z (benzerlik 1.0, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli, url |
| 2026-10-29-teghaza-001-mars-goktasi | Science, doi:10.1126/science.adz5646 (benzerlik 1.0, doi) | doi, yayin_tarihi, sayfa, lisans, hakemli |
| 2026-10-28-betelgeuse-eslik-eden-iz | The Astronomical Journal, doi:10.3847/1538-3881/ae953d (benzerlik 1.0, arama) | dergi, doi, yayin_tarihi, cilt, sayfa, lisans, hakemli, arxiv, url, kesinlik, guncellemeler · **kesinlik ön sonuç → kesin** |
| 2026-10-27-beyaz-cuce-cift-halka | Nature Astronomy, doi:10.1038/s41550-026-03004-3 (benzerlik 1.0, doi) | doi, yayin_tarihi, lisans, hakemli, url |
| 2026-10-22-hubble-supernova-ruzgari-yeniden-iyonlasma | Nature Astronomy, doi:10.1038/s41550-026-02999-z (benzerlik 1.0, doi) | dergi, doi, yayin_tarihi, lisans, hakemli, arxiv |
| 2026-10-08-webb-en-uzak-frb | Science, doi:10.1126/science.adz2675 (benzerlik 1.0, doi) | dergi, yayin_tarihi, sayfa, hakemli, arxiv, url |
| 2026-10-08-psr-j0435-uclu-sistem | The Astrophysical Journal Letters, doi:10.3847/2041-8213/aeaa29 (benzerlik 1.0, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli |
| 2026-10-05-mikroblazar-iras-18293 | Astronomy & Astrophysics, doi:10.1051/0004-6361/202661105 (benzerlik 1.0, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli |
| 2026-10-05-hs0209-ikinci-kusak-gezegen | Nature Astronomy, doi:10.1038/s41550-026-02983-7 (benzerlik 1.0, doi) | doi, yayin_tarihi, lisans, hakemli |
| 2026-09-29-toi-561b-yansitici-atmosfer | The Astronomical Journal, doi:10.3847/1538-3881/ae9763 (benzerlik 1.0, doi) | dergi, doi, yayin_tarihi, cilt, sayfa, lisans, hakemli, arxiv |
| 2026-09-28-chime-21cm-hidrojen | The Astrophysical Journal, doi:10.3847/1538-4357/ae9835 (benzerlik 1.0, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli |
| 2026-09-21-gunes-sistemi-omru-batygin | The Astrophysical Journal Letters, doi:10.3847/2041-8213/aea290 (benzerlik 1.0, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli |
| 2026-09-17-hd156295-nabiz-zamanlamasi | The Astrophysical Journal, doi:10.3847/1538-4357/ae93a0 (benzerlik 1.0, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli |
| 2026-09-16-elias-2-24b-en-genc-gezegen | The Astrophysical Journal Letters, doi:10.3847/2041-8213/ae9bb6 (benzerlik 1.0, doi) | dergi, doi, yayin_tarihi, cilt, sayfa, lisans, hakemli, arxiv |
| 2026-09-16-kucuk-kirmizi-noktalar-simulasyon | Nature, doi:10.1038/s41586-026-10985-8 (benzerlik 1.0, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli |
| 2026-09-14-venus-uydusu-gelgit | The Astrophysical Journal, doi:10.3847/1538-4357/ae9d6c (benzerlik 1.0, doi) | dergi, doi, yayin_tarihi, cilt, sayfa, lisans, hakemli, arxiv |
| 2026-09-09-lbt-ilksel-helyum | The Astrophysical Journal, doi:10.3847/1538-4357/ae879b (benzerlik 0.993, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli |
| 2026-08-19-s301-sgra-donus | Nature, doi:10.1038/s41586-026-10894-w (benzerlik 0.926, doi) | doi, yayin_tarihi, cilt, sayfa, lisans, hakemli |
| 2026-09-15-beta-pictoris-b-radyo | yayımlanmış eşleşme yok | — (kesinlik ön sonuç kalır) |
| 2026-09-04-supernova-unite-karanlik-enerji | yayımlanmış eşleşme yok | — (kesinlik ön sonuç kalır) |

## 2. Haftanın görüntüsü: 2026-11-05-enceladus-ters-isik
- APOD 5 Kasım 2026 "Enceladus in Silhouette" https://science.nasa.gov/image-article/apod-2026-november-5-enceladus-in-silhouette/ — kredi satırı "Credit: Cassini Imaging Team, SSI, JPL, ESA, NASA" (Copyright yok; bütün öğeler beyaz listede; ESA lisans denetimi listesinde).
- Görselin kendi sayfası: NASA Photojournal PIA17144 "A Song of Ice and Light" https://science.nasa.gov/photojournal/a-song-of-ice-and-light/ — "Credits: NASA/JPL-Caltech/Space Science Institute"; ESA yalnız görev ortağı: "The Cassini mission is a cooperative project of NASA, ESA (the European Space Agency) and the Italian Space Agency." → NASA görseli, NASA Images and Media Usage Guidelines: "generally are not subject to copyright in the United States".
- İndirilen dosya: Photojournal 1280 sürümü (982×575), `araclar/haber_gorsel.py`.
- Metindeki olgular (ikinci kaynak Photojournal, üçüncü NASA Enceladus sayfası):
  - 1 Kasım 2009, Cassini, Güneş arkadan: Photojournal "captured by NASA's Cassini spacecraft on Nov. 1, 2009. The entire scene is backlit by the Sun".
  - Enceladus 505 km, Pandora 84 km: Photojournal "about 314 miles (505 km) across"; "Pandora, which is about (52 miles, 84 kilometers) wide" (APOD 500 ve 80 km diyor; Photojournal'ın değeri kullanıldı).
  - Pandora'nın gece yüzü Satürn ışığıyla: Photojournal "This view looks toward the night side on Pandora as well, which is lit by dim golden light reflected from Saturn".
  - Doğal renk, dar açılı kamera, ~240.800 km: Photojournal "natural-color image was taken in visible light with the Cassini spacecraft's narrow-angle camera at a distance of approximately 149,600 miles (240,800 kilometers) from Enceladus".
  - Cassini görevi 15 Eylül 2017'de bitti: Photojournal "The Cassini spacecraft ended its mission on Sept. 15, 2017."
  - Jetler 2005'te keşfedildi: NASA Enceladus "In 2005, NASA's Cassini spacecraft discovered that icy water particles and gas gush from the moon's surface"; APOD "Discovered by Cassini in 2005".
  - Tuzlu yeraltı okyanusu bağlantısı: NASA Enceladus "its subsurface saltwater ocean", "Enceladus sprays its ocean out into space"; APOD "likely connected to an ocean beneath the ice shell".
  - E halkası ve en beyaz yüzey: NASA Enceladus "the whitest, most reflective surface in the solar system"; "its spray of icy particles … form Saturn's E ring"; APOD "Saturn's outer, tenuous E ring".

## 3. İstanbul etkinlik kontrolü (10 Kasım 2026)
- İÜ Bilim-Toplum programı: düzenli Salı–Perşembe planetaryum ziyaretleri (10.00, 14.00, 19.00; 19.00 yalnız randevulu); sayfadaki son "Gözlem Geceleri" duyurusu 25 Şubat 2022 tarihli (eski). Önümüzdeki 30 gün için tarihli halka açık gözlem duyurusu yok.
- Kandilli duyuruları: son ilgili duyuru "Kandilli Rasathanesi Halk Günleri (17-18 Ağustos 2026)" (geçmiş). Yeni duyuru yok.
- TÜBİTAK GGE /api/events/active: "28. TÜBİTAK Gökyüzü Gözlem Etkinliği", Afyonkarahisar Emre Gölü, 12–15 Ağustos 2026 (geçmiş, İstanbul dışı).
- Sonuç: etkinlik maddesi yazılmadı.
