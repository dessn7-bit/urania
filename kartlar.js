/* kartlar.js — Tekrar kartları: derslerin soruları ve "akılda tutulacak sayılar".
   Leitner kutuları: bilinen kart bir üst kutuya geçer ve daha seyrek sorulur; bilinemeyen
   kart ilk kutuya döner. Kutu aralıkları (1, 3, 7, 14, 30 gün) bir tasarım seçimidir.
   Yöntem: https://en.wikipedia.org/wiki/Leitner_system — İlerleme yalnız bu cihazda. */
(function () {
  'use strict';
  const U = window.Urania;
  const ARALIK_GUN = [1, 3, 7, 14, 30];
  const ANAHTAR = 'kartlar';

  function tumKartlar(D) {
    const ls = [];
    D.dersler.forEach(x => {
      /* Kalıcı kimlik (kid, araclar/ders_verisi_v2.py atar); yoksa eski sıra kimliği */
      (x.sorular || []).forEach((s, i) => ls.push({ id: s.kid || x.id + 's' + i, ders: x.id, dersAd: x.baslik, tur: 'soru', on: s.soru, arka: s.cevap }));
      (x.anahtar_sayilar || []).forEach((s, i) => ls.push({ id: s.kid || x.id + 'n' + i, ders: x.id, dersAd: x.baslik, tur: 'sayi', on: s.aciklama, arka: s.deger, kaynak: s.kaynak_url }));
      (x.sozluk || []).forEach((s, i) => ls.push({ id: s.kid || x.id + 't' + i, ders: x.id, dersAd: x.baslik, tur: 'terim', on: s.terim, arka: s.tanim }));
    });
    /* Ünite sınavında yanlış yapılan sorular (D.sinavlar yüklüyse) */
    const yan = nesne(U.oku('sinavYanlis', {}));
    if (D.sinavlar && D.sinavlar.uniteler) Object.values(D.sinavlar.uniteler).forEach(ls2 => ls2.forEach(q => {
      if (!yan[q.id]) return;
      const d = D.dersler.find(x => x.id === q.ders);
      ls.push({ id: 'sv-' + q.id, ders: q.ders, dersAd: d ? d.baslik : '', tur: 'sinav', on: q.soru, secenekler: q.secenekler, arka: 'ABCD'[q.dogru] + ') ' + q.secenekler[q.dogru] + '. ' + q.aciklama });
    }));
    return ls;
  }
  /* Depodaki değer yanlış türdeyse (null, dize, dizi) çökmesin: düz nesne olarak oku */
  const nesne = x => (x && typeof x === 'object' && !Array.isArray(x)) ? x : {};
  function kayit() { return nesne(U.oku(ANAHTAR, {})); }
  /* Bir kartın kaydı: kutu 1–5 ve zaman sayısı değilse yok sayılır (kart yeni gibi davranır) */
  function giris(r, id) {
    const e = r[id];
    /* Zamanı en uzun aralıktan (30 gün) çok ilerideyse cihaz saati yanlışken yazılmıştır: kart yeni sayılır */
    return e && typeof e === 'object' && Number.isInteger(e.k) && e.k >= 1 && e.k <= ARALIK_GUN.length && isFinite(e.z) &&
      e.z <= Date.now() + (ARALIK_GUN[ARALIK_GUN.length - 1] + 2) * 86400e3 ? e : null;
  }
  function gunBasi(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  /* N gün sonrasının başı, takvimle (yaz saati geçişinde 23/25 saatlik gün bir gün erken soru doğurmasın) */
  function gunSonra(t, n) { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d.getTime(); }

  /* Destedeki kartlar: okunmuş derslerinkiler (ya da hepsi) */
  function deste(D, hepsi) {
    const biten = nesne(U.oku('dersBitti', {}));
    return tumKartlar(D).filter(k => hepsi || biten[k.ders] || k.tur === 'sinav');
  }
  /* Bugün sorulacaklar: hiç görülmemiş ya da zamanı gelmiş; önce eski kutular */
  function bugunku(D, hepsi, simdi) {
    const r = kayit(), t = simdi || Date.now();
    const e = id => giris(r, id);
    return deste(D, hepsi).filter(k => !e(k.id) || e(k.id).z <= gunBasi(t) + 86400e3 - 1)
      .sort((a, b) => ((e(a.id) || { k: 0 }).k - (e(b.id) || { k: 0 }).k) || ((e(a.id) || { z: 0 }).z - (e(b.id) || { z: 0 }).z));
  }
  function cevapla(id, bildi, simdi) {
    const r = kayit(), t = simdi || Date.now();
    /* Yeni kart 1. kutudan başlar: bilinirse 2. kutuya (3 gün sonra), bilinemezse 1. kutuda kalır (yarın) */
    const eski = giris(r, id) || { k: 1 };
    const kutu = bildi ? Math.min(ARALIK_GUN.length, eski.k + 1) : 1;
    r[id] = { k: kutu, z: gunSonra(t, ARALIK_GUN[kutu - 1]), s: t };
    return U.yaz(ANAHTAR, r) ? r[id] : null;
  }
  function ozet(D, hepsi) {
    const r = kayit(), d = deste(D, hepsi);
    const kutular = [0, 0, 0, 0, 0, 0];
    d.forEach(k => { const e = giris(r, k.id); kutular[e ? e.k : 0]++; });
    return { toplam: d.length, bugun: bugunku(D, hepsi).length, kutular };
  }
  function sifirla() { U.yaz(ANAHTAR, {}); }
  /* Ünite sınavında yeniden yanlış yapılan sorunun kartı: üst kutudaysa 1. kutuya iner (Leitner: bilinemeyen
     kart ilk kutuya döner). Hiç sorulmamış kart "yeni" kalır. true: yazıldı ya da gerek yok. */
  function sinavYanlis(qid, simdi) {
    const id = 'sv-' + qid, e = giris(kayit(), id);
    if (!e || e.k <= 1) return true;
    return !!cevapla(id, false, simdi);
  }

  window.Kartlar = { ARALIK_GUN, tumKartlar, deste, bugunku, cevapla, ozet, sifirla, sinavYanlis };
})();
