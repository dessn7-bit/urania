/* cizim_gokyuzu.js — "Gökyüzünü okumak" ünitesinin ders çizimleri (cizim.js kayıtları). */
(function () {
  'use strict';
  const C = window.UraniaCizim; if (!C) return;

  /* d1 · bölüm 3: Kutup Yıldızı'nın yüksekliği enleme eşittir (İstanbul 41°). Yan kesit, ölçeksiz. */
  C.ekle('d1-kutup-enlem', {
    ders: 'd1', bolum: 3, oran: 0.5,
    baslik: 'Kutup Yıldızı\'nın yüksekliği = enlem',
    aciklama: 'İstanbul\'da (41° kuzey) gök kutbu kuzey ufkunun 41° üstündedir. Gök ekvatoru güney ufkundan 90° − 41° = 49° yükselir. Gökyüzü bu eksen çevresinde döner: kutba yakın yıldızlar hiç batmaz. Çizim ölçeksizdir.',
    ciz(S) {
      const R = S.R, cx = 200, cy = 160, r = 120, enlem = 41, rad = Math.PI / 180;
      let s = '';
      s += S.yay(cx, cy, r, 0, 180, { renk: R.soluk, kalin: 1 });                       // gök küresinin ufuk üstü yarısı
      s += S.cizgi(cx - r - 22, cy, cx + r + 22, cy, { renk: R.metin, kalin: 2 });        // ufuk
      s += S.yazi(cx - r - 20, cy + 20, 'Kuzey', { boy: 14, renk: R.soluk });
      s += S.yazi(cx + r + 20, cy + 20, 'Güney', { boy: 14, renk: R.soluk, hiza: 'end' });
      s += S.cizgi(cx, cy, cx, cy - r, { renk: R.soluk, kalin: 1, kesik: '3 4' });
      s += S.yazi(cx, cy - r - 8, 'Başucu', { boy: 13, hiza: 'middle', renk: R.soluk });
      /* hiç batmayanlar: kutup çevresinde 41° yarıçaplı bölge; meridyen kesitinde kuzey ufkundan 82° yüksekliğe */
      s += S.yay(cx, cy, r + 9, 180 - 2 * enlem, 180, { renk: R.iyi, kalin: 4, uc: 'round' });
      s += S.yazi(cx - r - 4, cy - r + 4, 'Hiç batmayanlar', { boy: 13, renk: R.iyi, hiza: 'middle' });
      /* gök kutbu: kuzey ufkundan 41° yukarı */
      const px = cx - r * Math.cos(enlem * rad), py = cy - r * Math.sin(enlem * rad);
      s += S.ok(cx, cy, px, py, { renk: R.vurgu, kalin: 2 });
      s += S.daire(px, py, 4.5, { dolgu: R.yildiz, renk: R.yildiz });
      s += S.yazi(px + 10, py - 6, 'Kutup Yıldızı', { boy: 15, renk: R.metin, kalin: true });
      s += S.yay(cx, cy, 46, 180 - enlem, 180, { renk: R.vurgu, kalin: 1.5 });
      s += S.yazi(cx - 52, cy - 12, '41°', { boy: 16, renk: R.vurgu, kalin: true, hiza: 'end' });
      /* gök ekvatoru: kutba dik, güney ufkundan 49° yukarı */
      const ea = 90 - enlem, ex = cx + r * Math.cos(ea * rad), ey = cy - r * Math.sin(ea * rad);
      s += S.cizgi(cx, cy, ex, ey, { renk: R.mavi, kalin: 1.8, kesik: '6 4' });
      s += S.yazi(ex - 4, ey - 10, 'Gök ekvatoru', { boy: 14, renk: R.mavi, hiza: 'middle' });
      s += S.yay(cx, cy, 70, 0, ea, { renk: R.mavi, kalin: 1.2 });
      s += S.yazi(cx + 76, cy - 22, '49°', { boy: 15, renk: R.mavi });
      s += S.daire(cx, cy, 5, { dolgu: R.metin, renk: R.metin });
      s += S.yazi(cx, cy + 22, 'Sen (İstanbul, 41° K)', { boy: 13, renk: R.soluk, hiza: 'middle' });
      return s;
    }
  });
})();
