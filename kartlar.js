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
      (x.sorular || []).forEach((s, i) => ls.push({ id: x.id + 's' + i, ders: x.id, dersAd: x.baslik, tur: 'soru', on: s.soru, arka: s.cevap }));
      (x.anahtar_sayilar || []).forEach((s, i) => ls.push({ id: x.id + 'n' + i, ders: x.id, dersAd: x.baslik, tur: 'sayi', on: s.aciklama, arka: s.deger, kaynak: s.kaynak_url }));
      (x.sozluk || []).forEach((s, i) => ls.push({ id: x.id + 't' + i, ders: x.id, dersAd: x.baslik, tur: 'terim', on: s.terim, arka: s.tanim }));
    });
    /* Ünite sınavında yanlış yapılan sorular (D.sinavlar yüklüyse) */
    const yan = U.oku('sinavYanlis', {}) || {};
    if (D.sinavlar && D.sinavlar.uniteler) Object.values(D.sinavlar.uniteler).forEach(ls2 => ls2.forEach(q => {
      if (!yan[q.id]) return;
      const d = D.dersler.find(x => x.id === q.ders);
      ls.push({ id: 'sv-' + q.id, ders: q.ders, dersAd: d ? d.baslik : '', tur: 'sinav', on: q.soru, secenekler: q.secenekler, arka: 'ABCD'[q.dogru] + ') ' + q.secenekler[q.dogru] + '. ' + q.aciklama });
    }));
    return ls;
  }
  function kayit() { return U.oku(ANAHTAR, {}) || {}; }
  function gunBasi(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }

  /* Destedeki kartlar: okunmuş derslerinkiler (ya da hepsi) */
  function deste(D, hepsi) {
    const biten = U.oku('dersBitti', {}) || {};
    return tumKartlar(D).filter(k => hepsi || biten[k.ders] || k.tur === 'sinav');
  }
  /* Bugün sorulacaklar: hiç görülmemiş ya da zamanı gelmiş; önce eski kutular */
  function bugunku(D, hepsi, simdi) {
    const r = kayit(), t = simdi || Date.now();
    return deste(D, hepsi).filter(k => !r[k.id] || r[k.id].z <= gunBasi(t) + 86400e3 - 1)
      .sort((a, b) => ((r[a.id] || { k: 0 }).k - (r[b.id] || { k: 0 }).k) || ((r[a.id] || { z: 0 }).z - (r[b.id] || { z: 0 }).z));
  }
  function cevapla(id, bildi, simdi) {
    const r = kayit(), t = simdi || Date.now();
    /* Yeni kart 1. kutudan başlar: bilinirse 2. kutuya (3 gün sonra), bilinemezse 1. kutuda kalır (yarın) */
    const eski = r[id] || { k: 1 };
    const kutu = bildi ? Math.min(ARALIK_GUN.length, eski.k + 1) : 1;
    r[id] = { k: kutu, z: gunBasi(t) + ARALIK_GUN[kutu - 1] * 86400e3, s: t };
    return U.yaz(ANAHTAR, r) ? r[id] : null;
  }
  function ozet(D, hepsi) {
    const r = kayit(), d = deste(D, hepsi);
    const kutular = [0, 0, 0, 0, 0, 0];
    d.forEach(k => { kutular[r[k.id] ? r[k.id].k : 0]++; });
    return { toplam: d.length, bugun: bugunku(D, hepsi).length, kutular };
  }
  function sifirla() { U.yaz(ANAHTAR, {}); }

  window.Kartlar = { ARALIK_GUN, tumKartlar, deste, bugunku, cevapla, ozet, sifirla };
})();
