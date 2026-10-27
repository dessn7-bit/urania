# Gözlem görevleri (veri/gorevler.json) — kaynak listesi

Tarih: 2026-10-27. Sütunlar: iddia | kaynak URL | kaynaktaki ifade.
İşaretler: [B] = bu oturumda WebFetch ile okundu (alıntı, WebFetch özet modelinin aktardığı metindir; doğrulama ajanı bir kez daha bakmalı); [Ö] = projede daha önce doğrulanmış dosyadan (dosya adı verildi); [H] = hesap; [U] = uygulamanın kendi kodu/verisi; [Y] = yazar yargısı ya da uygulama yönlendirmesi (yeni olgu yok).

Ortak notlar:
- Zorluk (1–3) her görevde [Y]: kaynaktaki parlaklık, ışık kirliliği ve yükseklik ifadelerine dayanan editör yargısı.
- "Gökyüzü sekmesindeki ... listesi" yönlendirmeleri [U]: gozlem.js satır 53–85 (Bu gecenin planı, Gezegenler, Dürbün hedefleri, Meteor yağmurları, Algol'ün kararması, Ay örtmeleri, Uzay istasyonları ve uydular, Yaklaşan olaylar); "Merkür en büyük uzanımda" satırı gok.js satır 313.
- Kültürasyon yükseklikleri [H]: İstanbul enlemi 41° (YAZIM_KILAVUZU.md), dik açıklıklar veri/hedefler.json; δ < 41° için h = 90 − 41 + δ, δ > 41° için h = 90 + 41 − δ. Sonuçlar (python3): M7 14,2°; M6 16,8°; M8 24,6°; M22 25,1°; M11 42,7°; M13 85,5°.
- Kadir değerleri veri/hedefler.json'dan [Ö] (hedefler_dogrulanmis.json, dogrulama_messier.md): M92 6,52; M3 6,39; M36 6,0; M37 5,6; M38 6,4; Alcor 4,01; Mizar 2,22.
- Kent göğünde çıplak göz sınırı [Ö] d11_kaynak.md: S&T Bortle 8 "The naked eye can pick out stars down to magnitude 4.5 at best"; Bortle 9 "4.0 or less" (https://skyandtelescope.org/astronomy-resources/light-pollution-and-astronomy-the-bortle-dark-sky-scale/).
- Karanlık uyumu, kaçamak bakış, dürbünü dayamak, yumruk 10° [Ö]: d11_kaynak.md Bölüm 3–6 (Wikipedia Adaptation/Averted vision, BAA, Nikon, EarthSky sky measurements).
- Türkçe takımyıldız adları veri/takimyildiz.json "ad" [U]; yıldız adları veri/yildizlar.json "adlar" [U].

## ulker — hedef:M45
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Kemerden batıya bak; Hyades ve Ülker | https://science.nasa.gov/solar-system/skywatching/night-sky-network/spot-the-young-stars-of-the-hyades-and-pleiades | "locate Orion's famous “Belt” of three bright stars" ; "look west Orion [sic] to find both the Hyades and the Pleiades" |
| [B] Küçük kepçe biçimli Ülker; çıplak gözle | aynı | "the small, almost dipper-shaped Pleiades star cluster (M45)" ; "even spot them with your unaided eye!" |
| [B] Dürbün ek yıldız gösterir | aynı | "Binoculars will bring out lots of extra stars and details in all three objects." |
| [B][Ö] Binden fazla yıldız; birkaç parlak üye baskın; görece karanlık yerden kolay | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-45 | "over a thousand stars" ; "a handful of its brightest members visually dominate the cluster" ; "is easily spotted with the unaided eye from a relatively dark-sky site." |
| [U] Ülker örtmesi listesi | /home/claude/urania/gozlem.js satır 531 | "Ülker örtmesi ... Ay, Ülker kümesinin önünden geçiyor; yıldızlar birer birer kaybolup belirir." |
| [Y] "kentte dürbün işini kolaylaştırır" | — | NASA ifadesinin "görece karanlık yer" koşulundan çıkarım |

## hiyadlar — gorev:hiyadlar
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Kemerden batı; Aldebaran rehber; V biçimi; çıplak göz; dürbün | https://science.nasa.gov/solar-system/skywatching/night-sky-network/spot-the-young-stars-of-the-hyades-and-pleiades | "distinctive “V’ shape" ; Aldebaran Hyades'e rehber, üye değil (WebFetch özeti) ; "Binoculars will bring out lots of extra stars" |
| [Ö] Aldebaran üye değil, 65 ışık yılı; Hyades ~153 ışık yılı, en yakın açık küme | https://en.wikipedia.org/wiki/Hyades_(star_cluster) | d15_kaynak.md satır 86, 88: "Located about 153 light-years (47 parsecs)" ; "is the nearest open cluster" ; "Aldebaran is unrelated to the Hyades, as it is located much closer to Earth (65 light-years)" |
| [Y] İpucu: V'yi parça parça taramak gerekebilir | — | öneri, olgu değil |

## orion-bulutsusu — hedef:M42
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Kemerin hemen altında | https://science.nasa.gov/?p=29958 | "prominent location just below Orion's belt, M42 can be spotted with the naked eye" |
| [B] Kılıç kemerin güneyinde; M42 kılıcın ortasında | https://astronomy.com/science/phil-harringtons-binocular-universe-meet-the-hunter | "found just south of his more famous three-starred" (belt) |
| [B] Bulutsu kılıcın orta yıldızlarını sarar | https://www.lightandmatter.com/binosky/m42.html | "The Orion Nebula surrounds the middle stars of Orion's sword." |
| [B] Kentte ~15′; ışık kirliliğinde çıplak gözle daha belirgin olabilir | aynı | yazarın kentteki yerinden bulutsu orta yıldız çevresinde yaklaşık 15 yay dakikası (WebFetch özeti) ; "Under light-polluted conditions, the nebulosity may unfortunately be more evident with the naked eye than through binoculars." |
| [B] İlk bakışta biçimsiz bulanıklık; dürbünü daya | https://astronomy.com/science/phil-harringtons-binocular-universe-meet-the-hunter | "might look like a dim, shapeless blur at first." ; "brace your binoculars against a support to get a steadier view." |
| [B] Trapez sıradan dürbünde zor; 16× ve üstü sehpalı dev dürbün | aynı | "Spotting its four stars through typical binoculars can be tough," ; "but it's possible with tripod-mounted 16x and higher giant binoculars." |
| [B] İkinci kaynak: Trapez düşük büyütmede kolay ayrılmaz | https://www.lightandmatter.com/binosky/m42.html | other three "much dimmer, and not easily resolved at low magnification" |

## andromeda — hedef:M31
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Alpheratz, Andromeda dizisi; Mirach'tan μ'ye çizgi | https://earthsky.org/astronomy-essentials/2-ways-to-find-the-andromeda-galaxy | "The constellation Andromeda can be seen as 2 streams of stars extending from 1 side of the Great Square of Pegasus." ; Alpheratz "joins Pegasus to Andromeda." ; "An imaginary line drawn through Mirach to Mu points to the Andromeda galaxy." |
| [B] Kraliçe; Shedar (Schedar) gösterir | aynı | "look northward for the M- or W-shaped constellation Cassiopeia the Queen." ; "It's the constellation's brightest star, and it points to the Andromeda galaxy." (EarthSky "Schedar" yazıyor; uygulama verisinde "Shedar") |
| [B] Bulanık leke; dürbünde daha parlak; kent ışıkları/Ay bastırır | aynı | "The galaxy will appear as a fuzzy patch to the eye." ; "Naturally, it'll appear brighter in binoculars." ; "Bright moonlight or city lights can overwhelm the faint glow of the Andromeda galaxy." |
| [Ö] Orta ışık kirliliğinde çıplak gözle | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/ | d11_kaynak.md: "the galaxy can be seen with the naked eye, even in areas with moderate light pollution." |
| [Ö] "Uzunca" leke | veri/hedefler.json | M31 boyut "178x63′" (SEDS boyutu, dogrulama_messier.md) |
| [Ö] Kaçamak bakış | https://en.wikipedia.org/wiki/Averted_vision | d11_kaynak.md Bölüm 4 |

## arikovani — hedef:M44
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Castor–Regulus çizgisinin ortasının biraz altında | https://www.skyatnightmagazine.com/news/beehive-cluster | "Using binoculars, you'll find M44 slightly below the mid-point of the line joining Castor to Regulus." |
| [B] Çıplak gözle iyi koşullarda; Ay ile yakınlaşmalar sevilen hedef | aynı | "can be seen with the naked eye under good conditions" ; "a popular target for conjunctions with the Moon" |
| [Ö] Çıplak gözle bulanık; dürbün ~20 yıldız | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-44 | d11_kaynak.md: "To the unaided eye, it looks like a blur of light." ; "A pair of binoculars can resolve around 20 stars." |
| [B] Dürbünde düzinelerce yıldız; Yengeç'te soluk bulut | https://www.astronomy.com/astronomy-for-beginners/10-top-spring-binocular-treats/ | "Visible to the naked-eye as a faint cloud floating in Cancer" ; "M44 explodes into dozens of stars through just about any binoculars." |
| [Y] "sönük üyeleri görmek için Ay'sız gece" | — | genel öneri (Ay ışığının sönük cisimlere etkisi: EarthSky M31 satırı) |

## cift-kume — hedef:NGC 869
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Kraliçe'yi bul; iki takımyıldız arasını dürbünle tara | https://earthsky.org/tonight/double-cluster-in-perseus/ | "To locate the Double Cluster, find the W or M shaped constellation Cassiopeia the Queen." ; "Then just scan between the two constellations with your binoculars for two glittering groups of stars." |
| [B] Karanlık kır göğünde çıplak gözle; dürbünde iki küme | aynı | "visible to the unaided eye in a dark country sky." ; "you'll see them as two glorious star clusters." |
| [Ö][H] İstanbul'dan batmaz, en alçak ~8° | https://en.wikipedia.org/wiki/Double_Cluster | d15_kaynak.md satır 128: "The Double Cluster is circumpolar ... from most northern temperate latitudes." ; 41,01 + 57,13 − 90 = 8,1° |

## mizar-alcor — hedef:Mizar
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Sapın kıvrımında Mizar | https://www.astronomy.com/astronomy-for-beginners/10-top-spring-binocular-treats/ | "Marking the bend in the Big Dipper's handle" |
| [B] 11,8′; her dürbünde ayrı | aynı | "A distance of 11.8′ separates the pair, which is wide enough for them to put on a show through any binoculars." |
| [Ö] Mizar–Alcor 11,81′ (SIMBAD konumlarından) | arastirma/dogrulama_messier.md | "Mizar A–Alcor 11.81'" |
| [B] Göz sınavı | https://en.wikipedia.org/wiki/Mizar_and_Alcor | "The Arabs and the ancient Persians used distinguishing Mizar and Alcor as a test of vision." |
| [Ö] Alcor 4,01 kadir; kent göğü sınırı en iyi 4,5 | veri/hedefler.json ; S&T Bortle (d11_kaynak.md) | Alcor "kadir": 4.01 ; "The naked eye can pick out stars down to magnitude 4.5 at best" (Class 8) |
| [Ö] Mizar A–B 14″; sabitleyicili dürbün yetebilir, en küçük teleskop iyi gösterir | https://astronomynow.com/?p=36497 | d15_kaynak.md satır 118: "stabilised versions of this instrument may suffice to resolve Castelli's component, Mizar B" ; "the smallest telescopic aid will show them well" ; dogrulama_messier.md "Mizar A–B 14.4"" |

## kutup-yildizi — yildiz:Polaris
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Kepçenin dış iki yıldızı Dubhe ve Merak Polaris'i gösterir | https://earthsky.org/tonight/use-big-dipper-to-locate-polaris-the-north-star | "An imaginary line drawn from the 2 outermost stars in the bowl of the Big Dipper always points to Polaris." ; "Those stars' names are Dubhe and Merak." |
| [B] Merak'tan Dubhe'ye çiz, açık ağzın ötesine uzat; ilk kolay yıldız Polaris | https://skyandtelescope.org/stargazing-and-observing/big-dipper-spring-sky-sights/ | "draw an imaginary line from Merak to Dubhe and extend it past the open top of the Dipper's bowl" (ilk kolay yıldız Polaris: WebFetch özeti) |
| [B] Göstergeç yıldızlar ~5° | https://earthsky.org/astronomy-essentials/sky-measurements-degrees-arc-minutes-arc-seconds/ | "The end two stars in the bowl, the ones that are used to find Polaris, are about 5 degrees apart." |
| [B] En parlak yıldız değil; ikinci kadir; Küçük Ayı sapının ucu | https://earthsky.org/tonight/use-big-dipper-to-locate-polaris-the-north-star | "Polaris isn't the brightest star in the sky, as is commonly believed." ; "marks the end of the handle of the Little Dipper." |
| [Ö] Polaris ortalama +1,98 | https://en.wikipedia.org/wiki/Apparent_magnitude | d1_kaynak.md: "Polaris: mean +1.98" |
| [B] Küçük Ayı yıldızları kentte zor | https://skyandtelescope.org/stargazing-and-observing/big-dipper-spring-sky-sights/ | Little Dipper stars "are often difficult to find under light-polluted city and suburban skies" |
| [Ö] Kutbun yüksekliği ≈ enlem; Polaris kutba 1°'den yakın | https://en.wikipedia.org/wiki/Celestial_pole | d1_kaynak.md: "its altitude angle is always (nearly) equal to the observer's geographic latitude" ; "within one degree of the bright star Polaris" |
| [Ö] Yumruk ~10° | https://earthsky.org/astronomy-essentials/sky-measurements-degrees-arc-minutes-arc-seconds/ | d11_kaynak.md: "the width of your fist held at arm's length equals about 10 degrees" |

## albireo — hedef:Albireo
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Kuzey Haçı; Deneb tepede; Albireo haçın dibi, kuğunun başı | https://earthsky.org/brightest-stars/albireo-finest-double-star/ | "Cygnus is known for containing an easily recognizable cross shape, known as the Northern Cross." ; "Albireo, meanwhile, marks the base of the Cross or the Head of Cygnus the Swan." |
| [B] Dürbün iki yıldız göstermez; küçük teleskop gösterir; ~30×; altın ve mavi | aynı | "binoculars unfortunately won't show you Albireo as two stars." ; "But any small telescope will" ; "It's best to view them at 30X." ; "a lovely gold and the other a dimmer blue" |
| [Ö] Sabit 10×50 ile kolay ayrılır | https://astronomynow.com/2022/08/02/dont-miss-albireo-a-glorious-colour-contrast-double-star/ | d15_kaynak.md satır 124: "easily be separated, even in a steadily mounted pair of 10 × 50 binoculars" |
| [Ö] Ayrım 34,6″ | arastirma/dogrulama_messier.md | "Albireo A–B 34.6"" (AN 34,3″) |
| [Ö] Korkuluğa dayamak (Nikon "fence") | https://imaging.nikon.com/sport-optics/guide/binoculars/using/using_03/ | d11_kaynak.md: "Supporting your binoculars on a stump, fence or rocks is also effective." |
| [Y] "7×50 elde ayıramazsan normal" | — | iki kaynak arasındaki ayrışmadan çıkarım; 7×50 için yayımlanmış ifade bulunamadı (d15 notu) |

## m13 — hedef:M13
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] ζ'dan üçte iki, η'dan üçte bir | https://en.wikipedia.org/wiki/Star_hopping | d11_kaynak.md: "point an instrument (binocular or telescope) two thirds of the way up from ζ, one third down from η to see M13." |
| [Ö] Dürbünle bulunur | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-13/ | "can be spotted with a pair of binoculars" |
| [B] Küçük bulanık parıltı, parlak çekirdek (M92 ile karşılaştırma) | https://www.astronomy.com/observing/web-extra-13-great-summer-binocular-sights/ | "Like M13, M92 will look like a tiny nebulous glow accented with a brighter central core." |
| [Ö] Karanlık gecede kaçamak bakışla çıplak gözle | https://en.wikipedia.org/wiki/Messier_13 | d15_kaynak.md satır 101: "may be visible to the naked eye with averted vision on dark nights" |
| [H] En yüksek ~85° | — | 90 − 41 + 36,46 = 85,5 |

## m92 — hedef:M92
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] η ve π Herculis; kuzeyde eşkenar üçgen | https://www.astronomy.com/observing/web-extra-13-great-summer-binocular-sights/ | "aim toward Eta (η) and Pi (π) Herculis on the northern side of Hercules' Keystone asterism" ; M92 kuzeyde, bu ikisiyle eşkenar üçgen (WebFetch özeti) |
| [B] Küçük bulanık parıltı, parlak çekirdek | aynı | "Like M13, M92 will look like a tiny nebulous glow accented with a brighter central core." |

## m3 — hedef:M3
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Arcturus ile Cor Caroli arasında yarı yolda tara | https://www.astronomy.com/astronomy-for-beginners/10-top-spring-binocular-treats/ | "scan slowly back and forth halfway between Arcturus (Alpha Boötis) and Cor Caroli" |
| [B] Dürbün yıldızlarını ayırmaz | aynı | "Although binoculars cannot resolve any of the cluster's hundreds of thousands of stars, it's still a fun object to observe." |
| [B] Sapın kavisi Arcturus'a | https://skyandtelescope.org/stargazing-and-observing/big-dipper-spring-sky-sights/ | "Arc to Arcturus" (sapın kavisini kepçeden uzağa izle; WebFetch özeti) |

## aski — hedef:Cr 399
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Altair Yaz Üçgeni'nin alt yıldızı; Tarazed hemen üstte; Vega'ya doğru üçte bir | https://www.skyatnightmagazine.com/advice/skills/coathanger-asterism/ | "Lock your binoculars onto Altair." ; "In all, you will have shifted your gaze approximately one-third of the distance from Altair to Vega." ; "a group of 10 stars that appear to take the shape of a coathanger" |
| [B] Altı yıldızlık çizgi + dört yıldızlık çengel; en yüksekte ters; çıplak gözle ayrılmamış leke; genellikle dürbün gerekir | https://en.wikipedia.org/wiki/Brocchi%27s_Cluster | "a straight line of six stars with a "hook" of 4 stars on the south side" ; "it will be upside-down" ; "the coathanger can be seen with the naked eye as an unresolved patch of light" ; "binoculars, zoom cameras, or a telescope at very low power are usually needed to view this asterism" |

## halter — hedef:M27
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Okçuk Altair'in bir yumruk üstünde | https://skyandtelescope.org/astronomy-news/observing-news/this-weeks-sky-at-a-glance-september-4-13/ | "Find little Sagitta, the Arrow, barely a fist at arm's length above it" |
| [B] γ Sagittae'den 3° kuzey | https://astronomynow.com/2022/07/25/observe-the-dramatic-dumbbell-nebula/ | "From gamma, nudge your telescope just three degrees north to land on M27." |
| [B] Büyük ama silik gri parıltı ~0,1°; dürbünde kolay ama iyi karanlık kır göğünde | https://skyandtelescope.org/astronomy-news/observing-news/this-weeks-sky-at-a-glance-september-4-13/ | "a big but subtle gray glow to the human eye, nearly 0.1° wide." ; "It's easy in binoculars or a finderscope through a good, dark, rural sky." |
| [B] Ek bilgi (kullanılmadı, kaynak farkı): AN ışık kirliliğinde iyi göründüğünü söylüyor (teleskop bağlamı) | https://astronomynow.com/2022/07/25/observe-the-dramatic-dumbbell-nebula/ | "shows up well in a light-polluted or moonlit sky" |

## yaban-ordegi — hedef:M11
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Altair'den ~8° δ Aquilae; iki katından biraz fazla; alanı dolduran yarım daire; M11 hemen altında | https://earthsky.org/clusters-nebulae-galaxies/wild-duck-cluster-deep-sky-gem-by-eagles-tail/ | "Delta Aquilae is your first hop, about 8 degrees from Altair." ; "a semicircle of stars that pretty much fills your binocular field" ; "pops out as a hazy star-like object just beneath this semicircle star pattern." |
| [B] Dürbün ya da teleskop gerekir; dört parmak ~8° | aynı | "you'll need binoculars or a telescope to see it." ; dört parmak yaklaşık 8 derece (WebFetch özeti) |
| [H] En yüksek ~43° | — | 90 − 41 − 6,27 = 42,7 |

## sac-kumesi — hedef:Mel 111
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Regulus ters soru işaretinin (Orak) dibinde; Regulus–Zosma çizgisinin iki katı | https://earthsky.org/tonight/star-hop-from-leo-to-the-coma-star-cluster | "Leo's brightest star – the sparkling blue-white gem Regulus – marks the bottom of an easy-to-see backward question mark" ; Regulus'tan Zosma'ya çizgi, "about twice this distance to locate the cluster." |
| [B] Işık kirliliğinde dürbün gerekebilir | aynı | "might need binoculars to see this loose tangle of stars" |
| [B] Büyük Ayı kuzeyde, Aslan batıda, Çoban doğuda sınırlanan bölge; dürbün birkaç düzine yıldız | https://www.astronomy.com/astronomy-for-beginners/10-top-spring-binocular-treats/ | "bounded by the Big Dipper to the north, Leo to the west, and Boötes to the east." ; "Binoculars immediately resolve the Queen's locks into several dozen stars" |
| [B] 5° kaplar; seyrek; çoğu 5.–6. kadir; banliyöde çıplak gözle görünmeyebilir | https://britastro.org/?p=209415 | "Covering 5 degrees of sky this is a cluster best seen in binoculars." ; "It is very open and quite sparse" ; çoğu 5. ve 6. kadir yıldız (WebFetch özeti) ; "for anyone living in light polluted suburbia the constellation may well be invisible to the naked eye." |

## m7 — hedef:M7
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Lesath'tan Shaula'ya çizgi M7'ye; M6 kısa atlama, ~3° kuzeybatı; güney ufku açık | https://earthsky.org/clusters-nebulae-galaxies/m6-and-m7-deep-sky-gems-by-scorpius-tail/ | "if you draw an imaginary line from Lesath through Shaula, you'll find M7" ; "Just 3 degrees to the northwest is the Butterfly Cluster (M6)." ; "you'll need an unobstructed horizon toward the south to find M6 and M7" |
| [B] Dürbünde haç biçimi, çevresinde seyrek yıldızlar; kentten bile kolay | https://www.lightandmatter.com/binosky/m7.html | "A rich central area containing a prominent cross shape" ; "Very bright, and easily seen even from urban areas." |
| [H] M7 ~14°, M6 ~17° | — | 90 − 41 − 34,84 = 14,2 ; 90 − 41 − 32,24 = 16,8 |

## deniz-kulagi — hedef:M8
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Çaydanlığın emzik yıldızlarından emzik uzunluğunun iki katı yukarı | https://earthsky.org/clusters-galaxies-nebulae/the-lagoon-nebula-messier-8 | WebFetch özeti: emziği oluşturan en sağdaki üç yıldız; dürbünle emziğin uzunluğunun yaklaşık iki katı yukarı, parlak bulanık cisim |
| [B] Dürbünde uzunca; parlak çekirdek, karanlık yarık, açık küme; dolunayın ~3 katı; yeni aya yakın gece | aynı | WebFetch özeti: "hourglass" parlak çekirdek, karanlık yarıkla ayrılmış açık küme; dolunay genişliğinin yaklaşık üç katı ; "Pick a night near new moon" (özet) ; "barely visible to the human eye under good conditions" |
| [Ö] Karanlıkta çıplak gözle soluk, dürbünle kolay | https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-8 | d11_kaynak.md: "faintly visible to the unaided eye in dark skies" ; "easily seen with binoculars or small telescopes." |
| [H] En yüksek ~25° | — | 90 − 41 − 24,39 = 24,6 |

## m22 — hedef:M22
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Kaus Borealis'in 2,5° kuzeydoğusu; ~20′, hafif uzunca | https://www.skyatnightmagazine.com/advice/teapot-asterism | "located 2.5˚ northeast of Kaus Borealis (Lambda (λ) Sagittarii), the star at the top of the Teapot asterism's lid." ; yaklaşık 20 yay dakikası, güneybatı–kuzeydoğu doğrultusunda hafif uzunca (WebFetch özeti) |
| [B] Kirli gökte dürbünle gerçekten kolay tek küresel küme | https://www.lightandmatter.com/binosky/m22.html | "this is the only globular cluster that could honestly be described as easy to observe with binoculars" (kuzey yarımküre, ışık kirliliği olan yerler) |
| [H] En yüksek ~25° | — | 90 − 41 − 23,90 = 25,1 |

## m35 — hedef:M35
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Castor'un ayağının son iki yıldızından kuzeye; 6. kadirden yıldızın batısı | https://www.lightandmatter.com/binosky/m35.html | "Go north from the final two stars of the three that form Castor's foot." ; küme 6. kadir bir yıldızın batısında (WebFetch özeti) |
| [B] Dört üye küçük Büyük Köpek; üçü 8. kadir; etkileyici değil; kirli yerden önerilmez | aynı | "this cluster strikes me as a distinctly unimpressive subject for binoculars." ; ışık kirliliği olan yerden "unless all the other factors are in your favor" (Ay yok, iyi hava, meridyene yakın) |

## m38, m36, m37 — hedef:M38, hedef:M36, hedef:M37
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Elnath'ın 6° kuzeyi; gülen yüz; M38 gamze | https://www.astronomy.com/observing/binocular-universe-winters-first-act/ | Elnath'ın (β Tauri) 6° kuzeyi, "Happy Face" yayı ; "That dimple is actually the open cluster M38." |
| [B] M38: Ay çapının ~2/3'ü, en parlak üyeleri 7. kadir | aynı | WebFetch özeti: yıldızlı alanda bulanık leke, Ay çapının yaklaşık üçte ikisi; en parlak üyeler ancak 7. kadir |
| [B] M36: M38'in 2,3° güneydoğusu; daha küçük, yıldızları daha parlak; yarım düzineden fazla yıldız; koşullara bağlı | aynı | "Just 2.3° southeast of M38, we come to M36." ; "its round, misty glow" ; "local sky conditions" |
| [B] M37: Elnath–θ Aurigae ortasının hemen doğusu; en parlak ama bulması zor; büyük yuvarlak parıltı | aynı | "just east of the halfway point on a line between Elnath in Taurus and Theta (θ) Aurigae." ; en parlak üçü, daha zor bulunur; çoğu dürbünde büyük dairesel parıltı (WebFetch özeti) |
| [Y] Kent göğü yorumu | — | kaynak ışık kirliliğinden söz etmiyor; zorluk katalog kadirlerine (5,6–6,4) dayanan yazar yargısı, metinde açıkça söylendi |

## ay-terminator — cisim:Moon
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Terminatör boyunca bak; en az 7× | https://science.nasa.gov/moon/viewing-tips/ | "Focus particularly along the terminator line between light and dark" ; "Choose binoculars with a magnification of 7 at a minimum." |
| [B] En iyi dönem; dolunay en kötü; Güneş'i yakalayan dağ dorukları | https://www.astronomy.com/observing/observe-the-moon-through-binoculars/ | "The best viewing times are from shortly after New Moon until about 2 days after First Quarter." ; "viewing when the Moon is brightest (Full Moon) is actually the worst time to view it." ; "look for mountaintops protruding high enough to catch sunlight while dark." |
| [Ö] Ay için karanlık uyumu gerekmez; parlak ışık uyumu bozar | https://britastro.org/section_information_/hints-and-tips-for-visual-observing | d11_kaynak.md: "You don't need to be dark adapted to look at bright things like the Moon or planets." ; "your dark adaptation will be lost in an instant." |
| [B] Farklı günlerde bak | https://science.nasa.gov/moon/viewing-tips/ | "Be sure to examine the Moon at many different phases and on different days." |

## ay-denizleri — gorev:ay-denizleri
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Denizler çıplak gözle karanlık; bazalt; demirce zengin, az yansıtıcı | https://en.wikipedia.org/wiki/Lunar_mare | "...and hence appear dark to the naked eye." ; d10_kaynak.md: "large, dark, basaltic plains on Earth's Moon, formed by lava flowing into ancient impact basins" ; "less reflective than the 'highlands' as a result of their iron-rich composition" |
| [B] Deniz adları | aynı | metinde: Mare Tranquillitatis, Mare Serenitatis, Mare Imbrium, Mare Crisium, Oceanus Procellarum |
| [B] Yüz ve tavşan gelenekleri | aynı | "a tradition of an apparent human face pattern in the Moon" ; "Moon rabbit" |
| [B] Mare Imbrium sol üst çeyrek, ikinci büyük deniz | https://www.astronomy.com/observing/observe-the-moon-through-binoculars/ | "Mare Imbrium, the Moon's second-largest mare, lies in the upper-left quadrant." |
| [B] "lunar seas, or maria" | https://science.nasa.gov/moon/viewing-tips/ | "We call these areas the lunar seas, or maria." |

## kopernik — gorev:kopernik
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Mare Imbrium'un hemen altında; yeni aydan ~10 gün sonra | https://www.astronomy.com/observing/observe-the-moon-through-binoculars/ | "Point your binoculars just below Mare Imbrium, and you'll find Copernicus Crater." ; Copernicus için yeni aydan yaklaşık 10 gün sonra (WebFetch özeti) |
| [B] Dolunay dışı evrelerde gölgeler belirgin | https://science.nasa.gov/moon/viewing-tips/ | "The shadows on the surface will be more pronounced, and help distinguish features you might otherwise miss." |
| [B] Procellarum'un neredeyse ortasında; örümcek ağı gibi ışınlar | https://www.skyatnightmagazine.com/advice/worst-time-to-observe-moon-when-full | Copernicus "almost in the middle of Oceanus Procellarum" ; cobweb benzeri ışın deseni (WebFetch özeti) |

## tycho-isinlari — gorev:tycho-isinlari
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Ay'ın alt kenarına yakın | https://www.astronomy.com/observing/observe-the-moon-through-binoculars/ | "Near the Moon's bottom edge, be sure to observe Tycho Crater." |
| [B] Dolunay ışınlar için; dürbünde açıkça; diskin tepesine kadar; çıplak gözle bazıları; Ay alçakken kolay; 2600 km; güney yaylaları | https://www.skyatnightmagazine.com/advice/worst-time-to-observe-moon-when-full | "it's only when the Moon is full that we can truly appreciate the beauty of the magnificent rays" ; "the brightest, longest rays – from Tycho - stand out really clearly." ; "you might be able to glimpse some rays with your naked eye at full Moon." ; 2.600 km'ye kadar ışınlar, güney yaylaları, Ay alçakken çıplak gözle daha kolay (WebFetch özeti) |
| [Ö] Tycho > 85 km | https://science.nasa.gov/moon/facts/ | d10_kaynak.md: "Tycho Crater is more than 52 miles (85 kilometers) wide." |
| [B] Keskin gözle ışın sistemleri | https://science.nasa.gov/moon/viewing-tips/ | "the bright streaks that are ray systems emanating from the Copernicus or Tycho craters." |

## dunya-isigi — gorev:dunya-isigi
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Hilal evrelerinde; karanlık yan soluk parlar; Dünya'dan yansıyan Güneş ışığı | https://science.nasa.gov/moon/moon-phases/ | "when the Moon is in one of its crescent phases" ; "the darkened area of the Moon's nearside shining dimly" ; "the Sun's light reflecting off Earth's surface onto the face of the Moon" |
| [B] Alacakaranlıkta ya da şafakta hilal | https://science.nasa.gov/moon/viewing-tips/ | "During its crescent phase in the twilight or dawn, you can also sometimes see the dark portion of the Moon." |
| [B] Yeni aydan kısa süre sonra ince hilal; dürbünle | https://www.astronomy.com/observing/observe-the-moon-through-binoculars/ | "Point your binoculars at it to see earthshine, which is sunlight that Earth reflects onto the darker part of the Moon." |
| [Ö] Ay'dan Dünya neredeyse dolu | https://science.nasa.gov/moon/moon-phases/ | d10_kaynak.md: "Earth is nearly full from the Moon's perspective (WebFetch özeti)" |

## ay-ortmesi — gorev:ay-ortmesi
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] Hilalde sabitlenmiş dürbünle 4. kadir; neredeyse hepsi için teleskop | http://www.poyntsource.com/IOTAmanual/IOTA_Observers_Manual_all_pages.pdf | arastirma/ortme_esik_tahmin.md (§3.2.1): "during lunar crescent phases with binoculars, if they are steadily held on a tripod or supported firmly in some way. However, a telescope is necessary to observe nearly all occultations." |
| [Ö] Parlak kenarda yalnız ~3,5 kadirden parlaklar | aynı | (§3.1) "Reappearances will occur on the bright limb and only stars of approximately magnitude 3.5 or brighter will be observable." |
| [U] Kaybolma/beliriş; karanlık kenar kolay | /home/claude/urania/gozlem.js satır 77 | "yıldız Ay'ın kenarında bir anda kaybolur, sonra öbür kenarda bir anda belirir ... Karanlık kenardaki olaylar çok daha kolay izlenir." |

## jupiter-uydulari — gorev:jupiter-uydulari
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Yoğun ışık kirliliğinde bile sıradan dürbünle | https://en.wikipedia.org/wiki/Galilean_moons | "readily seen with common binoculars, even under night sky conditions of high light pollution." |
| [B] Gezegenden 2–10 yay dakikası | aynı | "between 2 and 10 arcminutes from Jupiter" |
| [B] Galileo ertesi gece yer değiştirdiklerini fark etti | aynı | "The next night he noticed that they had moved." |
| [Ö] Adlar; 1610 | https://www.nasa.gov/wp-content/uploads/2009/12/moons_of_jupiter_lithograph.pdf | d9_kaynak.md: "1610 — Galileo Galilei and Simon Marius independently discover four moons" ; "Io, Europa, Ganymede, and Callisto." |
| [Ö] Jüpiter en çok −2,94 | https://en.wikipedia.org/wiki/Apparent_magnitude | d1_kaynak.md: "Jupiter: maximum −2.94" |
| [U] Sirius −1,44 | veri/yildizlar.json | Sirius kadir −1.44 (d3-celestial) |

## saturn — cisim:Saturn
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Karşı konumda halkalarla ortalama 0,05 kadir | https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html | ortalama karşı konum görünür kadiri halkalar dahil 0.05 (halkasız 0.7) |
| [Ö] Halka için 20× ve üstü | https://en.wikipedia.org/wiki/Binoculars | d11_kaynak.md: "Only binoculars with very high magnification, 20x or higher, are capable of discerning Saturn's rings" |
| [H][Y] "kentte bile çıplak gözle kolay" | — | 0,05 kadir, kent sınırı ~4,5'ten (S&T Bortle 8) çok parlak |

## titan — gorev:titan
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] 8. kadirin ortası; Satürn'ün yakınında, yer değiştirir | https://www.astronomy.com/observing/the-sky-today-tuesday-june-2-2026/ | "Titan glows at mid-8th magnitude" ; "just northeast of the ringed world" ; ertesi sabah "northwest of the planet" |
| [Ö] Orta boy dürbünle; Galileolar ve Titan dışında uydular sönük | https://en.wikipedia.org/wiki/Binoculars | d9_kaynak.md: "reasonably detectable with medium-size binoculars" ... "Saturn's largest moon Titan" ; "too faint to be seen with most binoculars are the planetary moons, except the Galileans and Titan" |
| [Ö] Kalın atmosferli tek uydu | https://science.nasa.gov/saturn/moons/titan/facts/ | d9_kaynak.md: "Titan is unique in being the only moon with a thick atmosphere." |

## venus-evresi — gorev:venus-evresi
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Güneş'ten ~20°'de hilal; iyi sabitlenmiş dürbünle | https://www.cambridge.org/turnleft/pages/the_planets/mercury_and_venus | Venüs Güneş'ten yaklaşık 20° uzaktayken hilal (WebFetch özeti) ; "can see the crescent shape in your finderscope or well-stabilized binoculars!" |
| [Ö] Venüs evreleri zor dürbün hedefi | https://en.wikipedia.org/wiki/Binoculars | d9_kaynak.md: "Other difficult binocular targets include the phases of Venus and the rings of Saturn." |
| [Ö] Hilalde en çok −4,92 | https://en.wikipedia.org/wiki/Apparent_magnitude | d1_kaynak.md: "Venus: maximum −4.92, when illuminated as a crescent" |
| [Ö] Filtresiz dürbünle Güneş anında ağır hasar | https://science.nasa.gov/eclipses/safety/ | d11_kaynak.md: "Viewing any part of the bright Sun through ... binoculars ... without a special-purpose solar filter ... will instantly cause severe eye injury." |
| [B] Güneş'e yanlışlıkla bakmayacak yerde dur | https://www.cambridge.org/turnleft/pages/the_planets/mercury_and_venus | "must be sure to place yourself in a location where you won't look into the Sun by accident." |

## merkur — cisim:Mercury
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Birkaç on dakika, en büyük uzanım çevresinde bir iki hafta; ufuktan yükseklik önemli; bir hafta içinde bak; çıplak göz + dürbün | https://www.cambridge.org/turnleft/pages/the_planets/mercury_and_venus | "just a few tens of minutes during twilight over just a week or two near greatest elongation." ; "What actually counts is how high above the horizon Mercury is during twilight." ; "within a week or so of elongation" ; "A combination of naked eye and binoculars is best to tease Mercury out from the twilight glow." |
| [U] "en büyük uzanımda" olayı ve sabah/akşam bilgisi | /home/claude/urania/gok.js satır 313 | "TR_AD[c] + ' en büyük uzanımda'" ; "'Sabah gökyüzünde' : 'Akşam gökyüzünde'" |
| [Ö] Güneş güvenliği | https://science.nasa.gov/eclipses/safety/ | yukarıdaki NASA satırı |

## uranus — cisim:Uranus
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] En parlak 5,38; karşı konumda ortalama 5,57 | https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html | "Maximum apparent visual magnitude" 5.38 ; "Mean values at opposition from Earth" "Apparent visual magnitude" 5.57 |
| [Ö] Kirliliksiz gökte çıplak gözle, rahat bulmak için dürbün | https://en.wikipedia.org/wiki/Binoculars | d9_kaynak.md: "Although visible unaided in pollution-free skies, Uranus and Vesta require binoculars for easy detection." |
| [B] Önce haritayı çalış, sonra bölgeyi dürbünle tara; disk için ≥3 inç teleskop ve 150× | https://www.space.com/amp/uranus-neptune-skywatching-september-2020.html | haritayı çalış, sonra "scan that region with binoculars" ; "a tiny, blue-green featureless disk" (150× ve en az üç inçlik teleskopla) |
| [Y] "dürbünde yıldız gibi nokta" | — | disk için 150× gerektiği ifadesinden çıkarım |

## neptun — cisim:Neptune
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] En parlak 7,67 (≈7,7) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html | "Maximum apparent visual magnitude" 7.67 |
| [B] Çıplak göz için çok sönük; iyi dürbünle bulunur; mavi nokta için ≥10 cm ve 200×; Uranüs'ten ~7 kat sönük | https://www.space.com/amp/uranus-neptune-skywatching-september-2020.html | "much too faint to be viewed with the unaided eye." ; "a good pair of binoculars" ; "at least a 4-inch (10 cm) telescope with a magnification of no less than 200-power" ; "about seven times dimmer than Uranus" |
| [Ö] Orta boy dürbünle | https://en.wikipedia.org/wiki/Binoculars | d9_kaynak.md: "the dim outer planets Uranus and Neptune" |

## iss-gecisi — gorev:iss-gecisi
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Uçak ya da çok parlak hareketli yıldız gibi; yanıp sönen ışık yok, yön değiştirmez, uçaktan hızlı | https://www.nasa.gov/spot-the-station/ | "appears similar to an airplane or a very bright star moving across the night sky." ; "does not have flashing lights or change direction" ; "It also moves faster than a typical airplane." |
| [B] Gün doğumu/batımından birkaç saat önce/sonra | aynı | "All International Space Station sightings will occur within a few hours before or after sunrise or sunset." |
| [U] Tiangong daha sönük ama çıplak gözle | /home/claude/urania/gozlem.js satır 81 | "Tiangong daha küçük ve biraz sönük ama ikisi de çıplak gözle ... görülür." |

## algol — yildiz:Algol
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Karşılaştırma yıldızları: α And 2,07; ε Per 2,89; δ Per 3,03 | https://www.skymania.com/how-to-observe-algol-the-demon-star/ | "nearby stars of fixed brightness, which you can use as comparisons" ; Alpha And 2.07 ; Epsilon Per 2.89 ; Delta Per 3.03 |
| [B] Sönme ve geri parlama ~5 sa 48 dk | aynı | "The stars takes 5h 48m to fade and then the same amount of time to brighten again." |
| [Ö] 2,1'den 3,4'e; ~10 saatlik kısmi tutulma | https://en.wikipedia.org/wiki/Algol | d15_kaynak.md: "normally about 2.1, dipping to 3.4" ; "roughly 10-hour-long partial eclipses" |
| [U] Alpha And = Alpheratz | veri/yildizlar.json | "Alpheratz" kadir 2.07 |

## perseid — meteor:PER
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [B] Kent ışıklarından uzaklaş; telefona bakma; yaslanan sandalye; her yerde görünür; dürbünü kaldır; gece yarısından sonra; parlak Ay zararlı | https://www.jpl.nasa.gov/news/how-to-see-the-best-meteor-showers-of-the-year-tools-tips-and-save-the-dates/ | "get as far away from urban light pollution as possible." ; "Avoid looking at your cell phone or any other light." ; "A reclining chair or ground pad" ; "meteors can appear anywhere overhead." ; "put away the telescope or binoculars." ; "All these showers are best enjoyed in the hours after midnight." ; "Light reflecting off a bright moon can be just as detrimental" |
| [Ö] Radyant Kahraman; saatte 50–100 | https://science.nasa.gov/solar-system/meteors-meteorites/perseids/ | d19_kaynak.md satır 82: radiant Perseus ; 50–100/saat |
| [Ö][H] Perseid radyantı +58°, İstanbul'dan batmaz | https://www.imo.net/files/meteor-shower/cal2026.pdf | d19_kaynak.md: "Perseids ... 48° +58°" ; 58 > 90 − 41 = 49 |
| [U] ZHR açıklaması; kentte küçük bir kısım | /home/claude/urania/gozlem.js satır 68 | "şehirde ve Ay ışığında bunun küçük bir kısmı görülür." |

## geminid — meteor:GEM
| İddia | URL | Kaynaktaki ifade |
|---|---|---|
| [Ö] 21–22 dolayında başlar; saatte 40–50; 3200 Phaethon asteroit ya da olası kaya kuyruklu yıldız; radyant İkizler | https://science.nasa.gov/solar-system/meteors-meteorites/geminids | d19_kaynak.md satır 83: "starts around 9 or 10 p.m." ; "Expect 40 to 50 meteors per hour" ; "3200 Phaethon (an asteroid or a possible "rock comet")" ; "Constellation Gemini" |
| [Ö] ZHR 150 | https://www.imo.net/files/meteor-shower/cal2026.pdf | veri/meteor.json GEM zhr 150 |
| [Ö] ZHR tanımı: tek gözlemci, radyant başucunda | https://en.wikipedia.org/wiki/Zenithal_hourly_rate | d19_kaynak.md: "the number of meteors a single observer would see in an hour of peak activity" ; "if the radiant was at the zenith" |
| [B] Gözlem önerileri | https://www.jpl.nasa.gov/news/how-to-see-the-best-meteor-showers-of-the-year-tools-tips-and-save-the-dates/ | perseid satırındaki alıntılar |

## Bulamadıklarım ve bilerek dışarıda bıraktıklarım

- Türkçe deniz adları (ör. Mare Imbrium'un Türkçesi) ve Oceanus Procellarum'un Ay'daki konumu: kaynakla doğrulamadım; görevde yalnız Latince adlar ve Astronomy'nin "sol üst çeyrek" ifadesi kullanıldı.
- 7×50'nin elde Albireo'yu ayırıp ayıramadığı: yayımlanmış ifade bulamadım (d15 notuyla aynı); görevde iki kaynağın ayrışması verildi.
- 7×50 ile kent göğünde sınır kadir: bulamadım (d11 notuyla aynı). M36/M37/M38, M3, M92 için "kentte zor" yargısı katalog kadirlerine dayanan yazar yargısıdır, metinde böyle söylendi.
- Satürn halkasının 7×50'de "oval/uzunca" görünüp görünmediği: kaynak bulamadım; görev yalnız "20× gerekir" bilgisini veriyor.
- Mars görevi (renk, karşı konum): bu oturumda dürbün/çıplak göz gözlem kaynağı aramadım; görev konmadı.
- M5 (Astronomy 13 great summer binocular sights): WebFetch özetindeki "ν CrB'den 35° güney-güneybatı" ifadesi şüpheli göründü, ikinci kaynakla doğrulayamadım; görev konmadı.
- M39: BinoSky yalnız "Visible from a reasonably dark area, but nothing worth writing home about." diyor, bulma tarifi bulamadım; görev konmadı.
- M6 ayrı görev yapılmadı; M7 görevinin ipucunda (EarthSky "3 degrees to the northwest").
- Sky & Telescope Algol ve Uranüs sayfaları WebFetch'te "client_error" verdi; yerine Skymania ve Space.com kullanıldı.

## Arama sayısı

WebSearch: 22. WebFetch: yalnız bu aramaların sonuç URL'leri ve proje kaynak dosyalarında zaten bulunan URL'ler (Spot the Station için sunucunun verdiği yönlendirme adresi nasa.gov/spot-the-station).
