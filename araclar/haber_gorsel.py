"""Haber görseli indirir ve küçültür: python3 araclar/haber_gorsel.py <haber-kimliği> <görsel-url>
img/haber/<kimlik>.jpg yazar (en çok 1200 piksel genişlik, JPEG kalite 82, üst veri silinir; hedef ≤ 250 KB).
YALNIZ serbest lisanslı resmî görseller: NASA (kamu malı), ESA/Webb, ESA/Hubble, ESO, NOIRLab (CC BY 4.0),
ESA (çoğu CC BY-SA 3.0 IGO) ve benzeri; lisansı ve krediyi veri/haberler.json'daki "gorsel" alanına yaz.
Haber ajansı (AP, Reuters, Getty) ve dergi (Nature, Science) görselleri KULLANILMAZ."""
import io, os, subprocess, sys
from PIL import Image
K = os.path.join(os.path.dirname(__file__), '..')
kimlik, url = sys.argv[1], sys.argv[2]
if not kimlik.replace('-', '').isalnum(): sys.exit('kimlik yalnız harf, rakam ve tire')
ham = subprocess.run(['curl', '-sSL', '-m', '60', '--fail', '-A', 'UraniaHaber/1.0', url], capture_output=True)
if ham.returncode: sys.exit('indirilemedi: ' + ham.stderr.decode()[:200])
im = Image.open(io.BytesIO(ham.stdout)); im.load()
if im.mode not in ('RGB', 'L'):
    zemin = Image.new('RGB', im.size, (10, 20, 34))
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); zemin.paste(im, mask=im.split()[-1]); im = zemin
    else: im = im.convert('RGB')
if im.width > 1200: im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
yol = os.path.join(K, 'img', 'haber', kimlik + '.jpg'); os.makedirs(os.path.dirname(yol), exist_ok=True)
for q in (82, 74, 66, 58):
    b = io.BytesIO(); im.convert('RGB').save(b, 'JPEG', quality=q, optimize=True, progressive=True)
    if b.tell() <= 250_000: break
open(yol, 'wb').write(b.getvalue())
print(f'{yol}: {im.width}×{im.height}, {b.tell() // 1024} KB, kalite {q}')
