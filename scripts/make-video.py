"""
Fabrique la vidéo de fond du premier écran : le Vitra Design Museum passe
du jour au coucher de soleil, puis à la nuit.

Usage :  python3 scripts/make-video.py   (Pillow, NumPy et ffmpeg requis)
Sources : photos-sources/20260916_120451.jpg (jour)
          photos-sources/design-museum-nuit.png (visualisation de nuit)
Sorties : public/video/musee-jour-nuit.mp4 / .webm + affiches .jpg

Déroulé (12 s, 30 i/s) :
  0 – 2 s    jour
  2 – 6,5 s  le soleil se couche (étalonnage chaud, ciel orangé puis mauve)
  6,5 – 9,5 s fondu vers la nuit
  9,5 – 12 s nuit (le mapping est ajouté par le site, en SVG)
Un léger recul de caméra (1,06 → 1) se termine à 9,5 s pour que le tracé
du mapping soit calé sur l'image finale.
"""
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos-sources"
OUT = ROOT / "public" / "video"
W, H = 1600, 900
FPS = 30
DUR = 12.0


def smooth(a, b, t):
    x = min(1.0, max(0.0, (t - a) / (b - a)))
    return x * x * (3 - 2 * x)


def load(name, size):
    im = ImageOps.exif_transpose(Image.open(SRC / name)).convert("RGB")
    return np.asarray(im.resize(size, Image.LANCZOS)).astype(np.float32) / 255.0


def main():
    night_img = Image.open(SRC / "design-museum-nuit.png")
    base = night_img.size  # 1672 x 941
    day = load("20260916_120451.jpg", base)
    night = load("design-museum-nuit.png", base)
    h, w = day.shape[:2]

    # Ciel du coucher de soleil (haut orangé → rose → mauve), plus fort en haut
    y = np.linspace(0, 1, h)[:, None]
    sky_top = np.array([0.98, 0.62, 0.36])
    sky_mid = np.array([0.93, 0.50, 0.46])
    sky_low = np.array([0.55, 0.36, 0.52])
    k1 = np.clip(y / 0.35, 0, 1)[..., None]
    k2 = np.clip((y - 0.35) / 0.3, 0, 1)[..., None]
    sky = sky_top * (1 - k1) + sky_mid * k1
    sky = sky * (1 - k2) + sky_low * k2
    sky = np.broadcast_to(sky, (h, w, 3))
    sky_mask = np.clip(1.15 - y * 1.9, 0, 1)[..., None]  # surtout le ciel (haut de l'image)
    luma = day.mean(axis=2, keepdims=True)

    def sunset(amount):
        warm = day * np.array([1.08, 0.86, 0.66])
        warm = warm * (1 - 0.18 * amount)
        tinted = warm * (1 - sky_mask * 0.75) + (sky * (0.55 + 0.6 * luma)) * sky_mask * 0.75
        return day * (1 - amount) + tinted * amount

    def frame_at(t):
        s = smooth(2.0, 6.5, t)
        n = smooth(6.5, 9.5, t)
        img = sunset(s)
        if n > 0:
            dusk = img * (1 - 0.35 * n) * np.array([0.9, 0.85, 1.05])
            img = dusk * (1 - n) + night * n
        img = np.clip(img, 0, 1)
        pil = Image.fromarray((img * 255).astype(np.uint8))
        z = 1.06 - 0.06 * smooth(0.0, 9.5, t)
        cw, ch = w / z, h / z
        x0, y0 = (w - cw) / 2, (h - ch) / 2
        return pil.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch))

    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())
    frames = int(DUR * FPS)
    for i in range(frames):
        frame_at(i / FPS).save(tmp / f"f{i:04d}.png", compress_level=1)
    frame_at(0).save(OUT / "musee-affiche-jour.jpg", quality=82, optimize=True, progressive=True)
    frame_at(DUR).save(OUT / "musee-affiche-nuit.jpg", quality=82, optimize=True, progressive=True)

    common = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", str(tmp / "f%04d.png")]
    subprocess.run(common + ["-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
                             "-movflags", "+faststart", "-an", str(OUT / "musee-jour-nuit.mp4")], check=True)
    subprocess.run(common + ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1",
                             "-pix_fmt", "yuv420p", "-an", str(OUT / "musee-jour-nuit.webm")], check=True)
    shutil.rmtree(tmp)
    for f in sorted(OUT.iterdir()):
        print(f.name, round(f.stat().st_size / 1024), "Ko")


if __name__ == "__main__":
    main()
