'use strict';
/* Ders çizimleri: cizim.js svg() bir çizimin istisnasını yakalayıp "Çizim hazırlanamadı" gösterir; bu yüzden
   bozulan çizim sayfayı kırmaz ama takım da fark etmezdi. Burada UraniaCizim.kayit'teki HER çizim üretilir
   (normal ve kırmızı modda) ve çıktıda hata izi, NaN/undefined/Infinity ve konsol hatası olmadığı denetlenir.
   Ağ isteği atılmaz: yerel sunucu dışındaki her istek kesilir. */
const { test, expect } = require('@playwright/test');
const { disAgiKes } = require('./yardim');

for (const kirmizi of [false, true]) {
  test(`Tüm ders çizimleri hatasız üretilir${kirmizi ? ' (kırmızı mod)' : ''}`, async ({ page }) => {
    const hatalar = [];
    page.on('pageerror', e => hatalar.push(String(e)));
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') hatalar.push(m.type() + ': ' + m.text()); });
    await disAgiKes(page);
    await page.addInitScript(k => { localStorage.setItem('urania_kirmizi', k ? 'true' : 'false'); }, kirmizi);
    await page.goto('/index.html#ders');
    /* Ders listesi, çizim betikleri yüklendikten sonra çizilir (dersler.js: Promise.all([veri, cizim])) */
    await expect(page.locator('.ders-liste li').first()).toBeVisible();
    const r = await page.evaluate(async () => {
      const C = window.UraniaCizim, D = (await fetch('veri/dersler.json').then(x => x.json())).dersler;
      const sonuc = [], bolumsuz = [];
      for (const t of Object.values(C.kayit)) {
        const d = D.find(x => x.id === t.ders);
        if (!d || !d.bolumler[t.bolum]) bolumsuz.push(t.id);
        let svg = '', html = '';
        try { svg = C.svg(t); html = C.html(t, 1); } catch (e) { svg = 'İSTİSNA ' + e.message; }
        /* Tarayıcının ayrıştırdığı hâli de: öznitelikteki NaN (ör. x="NaN") metinde de görünür */
        const kap = document.createElement('div'); kap.innerHTML = html;
        const oznitelik = [...kap.querySelectorAll('*')].flatMap(e => [...e.attributes].map(a => a.value)).join(' ');
        sonuc.push({ id: t.id, ders: t.ders, svg, metin: kap.textContent, oznitelik, sekil: kap.querySelectorAll('svg *').length });
      }
      return { sonuc, bolumsuz, dosyalar: [...new Set(Object.values(C.kayit).map(t => t.ders))].length };
    });
    expect(r.sonuc.length, 'kayıtlı çizim sayısı').toBeGreaterThan(30);
    expect(r.dosyalar, 'çizimi olan ders sayısı').toBeGreaterThan(10);
    expect(r.bolumsuz, 'dersin olmayan bölümüne bağlı çizim').toEqual([]);
    const kotu = [];
    for (const c of r.sonuc) {
      const hepsi = c.svg + ' ' + c.metin + ' ' + c.oznitelik;
      const m = hepsi.match(/hazırlanamadı|İSTİSNA|\bNaN\b|\bundefined\b|\bnull\b(?=")|-?\bInfinity\b/);
      if (m) kotu.push(c.id + ': "' + m[0] + '" … ' + hepsi.slice(Math.max(0, m.index - 60), m.index + 40));
      else if (c.sekil < 3) kotu.push(c.id + ': neredeyse boş çizim (' + c.sekil + ' öğe)');
    }
    expect(kotu).toEqual([]);
    expect(hatalar).toEqual([]);
  });
}
