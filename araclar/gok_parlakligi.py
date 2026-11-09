#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""araclar/gok_parlakligi.py — Falchi ve ark. 2016 atlasından Türkiye ve çevresi için küçük gök parlaklığı ızgarası.

Kaynak veri: World_Atlas_2015.tif (zip içinde), GFZ Data Services, doi:10.5880/GFZ.1.4.2016.001
  (makale: Falchi ve ark. 2016, Science Advances 2:e1600377, doi:10.1126/sciadv.1600377).
  43200 × 17406 piksel, 30 yay saniyesi, float32, döşemeli (128×128), sıkıştırmasız; değer = YAPAY başucu
  parlaklığı, mcd/m² (doğal gök dâhil değil; veri sayfası). Yok-veri: -3.4028234663852886e+38.
  Coğrafi dönüşüm (ModelTiepoint/ModelPixelScale): sol üst köşe (−180°, 85.0541668645°), piksel 0.00833333°.

Çıktı (depoya girer):
  veri/gok_parlakligi.u8.gz — 585 sütun × 210 satır uint8, gzip. Pencere 25.5–45.0° D, 35.5–42.5° K, hücre 2 yay dakikası.
      Satır 0 kuzeyde (42.5°), sütun 0 batıda (25.5°). Hücre değeri: içine düşen 30″ piksellerin DOĞRUSAL ortalaması (mcd/m²).
      Kodlama: yapay parlaklık, doğal göğü (174 µcd/m², makale) kaç KADİR parlattığına göre 0.1 kadir adımlarla:
      kod 0 = veri yok; kod c = 1…254 → L_art = L_doğal × (10^(0.4 × 0.1 × (c − 1)) − 1) mcd/m²  (c = 1: fark yok; c = 254: +25.3 kadir).
      Toplam (doğal + yapay) parlaklıktaki en büyük kodlama hatası 0.05 kadir. Telefon L_art'ı çözer, doğalı ekler, kadire çevirir.
  veri/gok_parlakligi.json — üst veri (sınırlar, boyut, kodlama, kaynak, lisans, üretim tarihi, sağlama).
Ham zip ve tif depoya GİRMEZ (.gitignore).

Kullanım:
  python araclar/gok_parlakligi.py <World_Atlas_2015.zip | World_Atlas_2015.tif> [--cikti veri] [--nokta "Ad;enlem;boylam" ...]
  --nokta ile verilen yerlerin ham 30″ değeri ve 2′ hücre değeri yazdırılır (doğrulama için).
"""
import sys, os, struct, gzip, json, math, zipfile, tempfile, hashlib, datetime
import numpy as np

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')   # Windows konsolu (cp1254) ≈ ve ′ gibi işaretleri yazamıyor

BATI, DOGU, GUNEY, KUZEY = 25.5, 45.0, 35.5, 42.5
ADIM = 2.0 / 60.0                         # 2 yay dakikası
NCOL = int(round((DOGU - BATI) / ADIM))   # 585
NROW = int(round((KUZEY - GUNEY) / ADIM)) # 210
L_DOGAL = 0.174                            # mcd/m²; Falchi ve ark. 2016: 22.0 kadir/yay sn² ↔ 174 µcd/m²
ADIM_KADIR = 0.1                           # kod adımı: toplam gök parlaklığında 0.1 kadir
NODATA = -3.4028234663852886e+38


def tiff_oku(yol):
    """Yalnız bu dosyanın biçimi: II, klasik TIFF, tek IFD, döşemeli float32 sıkıştırmasız."""
    f = open(yol, 'rb')
    assert f.read(2) == b'II', 'little-endian TIFF bekleniyor'
    assert struct.unpack('<H', f.read(2))[0] == 42, 'klasik TIFF bekleniyor'
    ifd = struct.unpack('<I', f.read(4))[0]
    f.seek(ifd)
    n = struct.unpack('<H', f.read(2))[0]
    T = {}
    boy = {1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 11: 4, 12: 8}
    fmt = {1: 'B', 3: 'H', 4: 'I', 11: 'f', 12: 'd', 2: 'c', 7: 'B'}
    for _ in range(n):
        tag, typ, cnt = struct.unpack('<HHI', f.read(8))
        val = f.read(4)
        size = boy[typ] * cnt
        if size > 4:
            off = struct.unpack('<I', val)[0]
            here = f.tell()
            f.seek(off)
            raw = f.read(size)
            f.seek(here)
        else:
            raw = val[:size]
        if typ == 2:
            T[tag] = raw.decode('ascii', 'replace')
        else:
            T[tag] = struct.unpack('<' + fmt[typ] * cnt, raw)
    assert T[259][0] == 1 and T[258][0] == 32 and T[339][0] == 3 and T[277][0] == 1, 'sıkıştırmasız float32 tek bant bekleniyor'
    w, h = T[256][0], T[257][0]
    tw, th = T[322][0], T[323][0]
    sx, sy = T[33550][0], T[33550][1]
    x0, y0 = T[33922][3], T[33922][4]
    nodata = float(T[42113].strip('\x00 ')) if 42113 in T else NODATA
    return dict(f=f, w=w, h=h, tw=tw, th=th, ofs=T[324], say=T[325], sx=sx, sy=sy, x0=x0, y0=y0, nodata=nodata)


def pencere(t):
    """Pencereyi kapsayan 30″ piksel bloğunu döşemelerden okur; (dizi, ilk satır, ilk sütun) döner."""
    c0 = int(math.floor((BATI - t['x0']) / t['sx']))
    c1 = int(math.ceil((DOGU - t['x0']) / t['sx']))
    r0 = int(math.floor((t['y0'] - KUZEY) / t['sy']))
    r1 = int(math.ceil((t['y0'] - GUNEY) / t['sy']))
    A = np.full((r1 - r0, c1 - c0), np.nan, dtype=np.float64)
    tx = (t['w'] + t['tw'] - 1) // t['tw']
    for ty_ in range(r0 // t['th'], (r1 - 1) // t['th'] + 1):
        for tx_ in range(c0 // t['tw'], (c1 - 1) // t['tw'] + 1):
            i = ty_ * tx + tx_
            t['f'].seek(t['ofs'][i])
            raw = t['f'].read(t['say'][i])
            blok = np.frombuffer(raw, dtype='<f4').reshape(t['th'], t['tw']).astype(np.float64)
            rs, cs = ty_ * t['th'], tx_ * t['tw']
            rr0, rr1 = max(rs, r0), min(rs + t['th'], r1)
            cc0, cc1 = max(cs, c0), min(cs + t['tw'], c1)
            A[rr0 - r0:rr1 - r0, cc0 - c0:cc1 - c0] = blok[rr0 - rs:rr1 - rs, cc0 - cs:cc1 - cs]
    A[A <= t['nodata'] * 0.5] = np.nan        # yok-veri (−3.4e38) → NaN
    A[A < 0] = np.nan
    return A, r0, c0


def izgara(t):
    A, r0, c0 = pencere(t)
    rows, cols = np.indices(A.shape)
    lat = t['y0'] - (rows + r0 + 0.5) * t['sy']
    lon = t['x0'] + (cols + c0 + 0.5) * t['sx']
    orow = np.floor((KUZEY - lat) / ADIM).astype(int)
    ocol = np.floor((lon - BATI) / ADIM).astype(int)
    ok = np.isfinite(A) & (orow >= 0) & (orow < NROW) & (ocol >= 0) & (ocol < NCOL)
    top = np.zeros((NROW, NCOL))
    say = np.zeros((NROW, NCOL))
    np.add.at(top, (orow[ok], ocol[ok]), A[ok])
    np.add.at(say, (orow[ok], ocol[ok]), 1)
    ort = np.where(say > 0, top / np.maximum(say, 1), np.nan)
    return ort, say, A, r0, c0


def kodla(L):
    """mcd/m² → uint8: kod = 1 + round(2.5 log10(1 + L/L_doğal) / adım); 0 = veri yok (bkz. dosya başı)."""
    k = np.zeros(L.shape, dtype=np.uint8)
    gec = np.isfinite(L)
    c = np.rint(1 + 2.5 * np.log10(1 + np.where(gec, np.maximum(L, 0), 0) / L_DOGAL) / ADIM_KADIR)
    k[gec] = np.clip(c[gec], 1, 254).astype(np.uint8)
    return k


def coz(kod):
    kod = np.asarray(kod, dtype=float)
    L = L_DOGAL * (10 ** (0.4 * ADIM_KADIR * (kod - 1)) - 1)
    L[kod == 0] = np.nan
    return L


def kadir(L_mcd):
    """Toplam parlaklık → kadir/yay sn². Dönüşüm: Unihedron (SQM) "cd/m² = 10.8×10⁴ × 10^(−0.4 m)";
    doğal gök 0.174 mcd/m² (Falchi 2016: 22.0 kadir/yay sn² ↔ 174 µcd/m²) eklenir."""
    return -2.5 * math.log10((L_mcd + 0.174) / 1000.0 / 108000.0)


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    kaynak = argv[1]
    cikti = 'veri'
    noktalar = []
    i = 2
    while i < len(argv):
        if argv[i] == '--cikti':
            cikti = argv[i + 1]
            i += 2
        elif argv[i] == '--nokta':
            noktalar.append(argv[i + 1])
            i += 2
        else:
            i += 1
    gecici = None
    if kaynak.lower().endswith('.zip'):
        gecici = tempfile.mkdtemp(prefix='atlas_')
        with zipfile.ZipFile(kaynak) as z:
            z.extract('World_Atlas_2015.tif', gecici)
        tif = os.path.join(gecici, 'World_Atlas_2015.tif')
    else:
        tif = kaynak
    t = tiff_oku(tif)
    print(f'TIFF {t["w"]}×{t["h"]}, piksel {t["sx"]:.8f}°, köşe ({t["x0"]}, {t["y0"]}), yok-veri {t["nodata"]:.4g}')
    ort, say, A, r0, c0 = izgara(t)
    kod = kodla(ort)
    print(f'ızgara {NROW} satır × {NCOL} sütun; boş hücre {int((say == 0).sum())}; hücre başına piksel {say[say > 0].min():.0f}–{say.max():.0f}')
    gec = ort[np.isfinite(ort)]
    print(f'yapay parlaklık (mcd/m²): en küçük {gec.min():.5f}, ortanca {np.median(gec):.4f}, en büyük {gec.max():.3f}')
    geri = coz(kod)
    sec = np.isfinite(ort)
    fark = np.abs(np.vectorize(kadir)(geri[sec]) - np.vectorize(kadir)(ort[sec]))
    print(f'kodlama hatası (toplam kadir/yay sn²): en büyük {fark.max():.3f}; en büyük kod {kod.max()}, farklı kod {len(np.unique(kod))}')
    os.makedirs(cikti, exist_ok=True)
    ham = kod.tobytes()
    gz_yol = os.path.join(cikti, 'gok_parlakligi.u8.gz')
    with gzip.GzipFile(gz_yol, 'wb', compresslevel=9, mtime=0) as g:
        g.write(ham)
    sha = hashlib.sha256(ham).hexdigest()
    meta = {
        'aciklama': 'Yapay başucu gök parlaklığı (mcd/m²), Falchi ve ark. 2016 atlasından 2 yay dakikası hücreye (doğrusal ortalama) indirgenmiş. Doğal gök (174 µcd/m² = 22.0 kadir/yay sn², makale) DÂHİL DEĞİL; uygulama ekler.',
        'kaynak': {
            'veri': 'The New World Atlas of Artificial Night Sky Brightness — Supplement (World_Atlas_2015.tif), GFZ Data Services',
            'veri_doi': '10.5880/GFZ.1.4.2016.001',
            'makale': 'Falchi F. ve ark. (2016) Science Advances 2(6): e1600377',
            'makale_doi': '10.1126/sciadv.1600377',
            'lisans': 'CC BY-NC 4.0 (veri sayfası sürüm geçmişi, 13 Kasım 2019); bkz. veri/LICENSE-falchi-atlas.txt'
        },
        'sinirlar': {'bati': BATI, 'dogu': DOGU, 'guney': GUNEY, 'kuzey': KUZEY},
        'adim_derece': ADIM, 'sutun': NCOL, 'satir': NROW,
        'dizilis': 'satır 0 kuzey (42.5°), sütun 0 batı (25.5°); indeks = satır × sütun_sayısı + sütun; uint8',
        'kodlama': {'kod0': 'veri yok', 'formul': 'L_art_mcd = L_dogal_mcd × (10^(0.4 × adim_kadir × (kod − 1)) − 1); kod 1 = yapay ışık yok',
                    'L_dogal_mcd': L_DOGAL, 'adim_kadir': ADIM_KADIR,
                    'aciklama': 'kod, yapay ışığın doğal göğü (22.0 kadir/yay sn²) kaç kadir parlattığıdır (0.1 kadir adım). Toplam kadir hatası ≤ 0.05.'},
        'kaynak_piksel': f'30 yay saniyesi; hücre başına {int(say[say > 0].min())}–{int(say.max())} piksel ortalaması',
        'uretim': {'tarih': datetime.date.today().isoformat(), 'arac': 'araclar/gok_parlakligi.py',
                   'sha256_ham': sha, 'bayt_ham': len(ham), 'bayt_gz': os.path.getsize(gz_yol)}
    }
    with open(os.path.join(cikti, 'gok_parlakligi.json'), 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    print(f'yazıldı: {gz_yol} ({os.path.getsize(gz_yol)} bayt gz, {len(ham)} ham), sha256 {sha[:16]}…')
    for n in noktalar:
        ad, en, boy = n.split(';')
        en, boy = float(en), float(boy)
        r = int(math.floor((KUZEY - en) / ADIM))
        c = int(math.floor((boy - BATI) / ADIM))
        pr = int(math.floor((t['y0'] - en) / t['sy'])) - r0
        pc = int(math.floor((boy - t['x0']) / t['sx'])) - c0
        ham30 = A[pr, pc] if 0 <= pr < A.shape[0] and 0 <= pc < A.shape[1] else float('nan')
        icinde = 0 <= r < NROW and 0 <= c < NCOL
        h2 = coz(np.array([kod[r, c]]))[0] if icinde else float('nan')
        print(f'{ad}: ({en:.4f}, {boy:.4f}) → 30″ piksel {ham30:.4f} mcd/m² = {kadir(ham30):.2f} kadir/yay sn²; '
              f'2′ hücre [{r},{c}] kod {kod[r, c] if icinde else "-"} → {h2:.4f} mcd/m² = {kadir(h2):.2f} kadir/yay sn²')
    if gecici:
        try:
            os.remove(tif)
            os.rmdir(gecici)
        except OSError:
            pass
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
