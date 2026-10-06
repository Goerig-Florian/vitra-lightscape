"""
Génère le mapping d'arrière-plan du Reel : des milliers de filaments lumineux très fins qui suivent un champ de courants.
Aucune image externe : tout est calculé ici (graine fixe, résultat identique à chaque exécution).
  - mapping-fin-a.webp : filaments bleus, cyan et violets
  - mapping-fin-b.webp : filaments orange, ambre et dorés
Les deux couches dérivent en sens contraire dans la page /reel/ et se mélangent en « écran ».
Sortie : public/reel/. Usage : python scripts/prepare-reel-mapping.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "reel"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1296, 2304  # 1,2 fois la scène (1080 x 1920) : marge pour la dérive
SS = 2  # sur-échantillonnage : traits très fins


def champ(rng):
    """Angle du courant en chaque point : quelques ondes larges qui se croisent, comme des rubans."""
    comps = []
    for _ in range(5):
        wl = rng.uniform(420, 1500)
        th = rng.uniform(0, np.pi)
        comps.append((2 * np.pi / wl * np.cos(th), 2 * np.pi / wl * np.sin(th), rng.uniform(0, 6.28), rng.uniform(0.7, 1.6)))
    base = rng.uniform(-0.6, 0.6)

    def angle(x, y):
        a = base
        for kx, ky, p, amp in comps:
            a = a + amp * np.sin(kx * x + ky * y + p)
        return a

    def teinte(x, y):
        return 0.5 + 0.5 * np.sin(x * 0.0021 + y * 0.0013 + comps[0][2]) * np.cos(y * 0.0017 - x * 0.0009 + comps[1][2])

    return angle, teinte


def degrade(stops, t):
    t = min(max(t, 0.0), 1.0) * (len(stops) - 1)
    i = min(int(t), len(stops) - 2)
    f = t - i
    return tuple(stops[i][c] * (1 - f) + stops[i + 1][c] * f for c in range(3))


def texture(seed, stops, lignes, longueur):
    rng = np.random.default_rng(seed)
    angle, teinte = champ(rng)
    img = Image.new("RGB", (W * SS, H * SS), (0, 0, 0))
    d = ImageDraw.Draw(img)
    pas = 4.0
    for _ in range(lignes):
        x, y = rng.uniform(-100, W + 100), rng.uniform(-100, H + 100)
        sens = 1 if rng.random() < 0.5 else -1
        n = int(longueur * rng.uniform(0.35, 1.0))
        eclat = rng.uniform(0.35, 1.0)
        largeur = 1 if rng.random() < 0.82 else 2
        base = degrade(stops, teinte(x, y) + rng.normal(0, 0.08))
        px, py = x, y
        for i in range(n):
            a = angle(px, py)
            nx, ny = px + sens * pas * np.cos(a), py + sens * pas * np.sin(a)
            u = i / n
            fond = np.sin(np.pi * u) ** 0.8  # le trait s'amincit et s'éteint aux deux bouts
            c = tuple(int(min(255, v * eclat * fond)) for v in base)
            d.line([(px * SS, py * SS), (nx * SS, ny * SS)], fill=c, width=largeur * SS // 2 + (1 if largeur == 2 else 0))
            px, py = nx, ny
    img = img.resize((W, H), Image.LANCZOS)
    a = np.asarray(img).astype(np.float32)
    lueur = np.asarray(img.filter(ImageFilter.GaussianBlur(2.2))).astype(np.float32)
    large = np.asarray(img.filter(ImageFilter.GaussianBlur(9))).astype(np.float32)
    # quelques particules lumineuses, très petites
    for _ in range(int(lignes * 0.9)):
        x, y = int(rng.uniform(0, W)), int(rng.uniform(0, H))
        v = rng.uniform(0.3, 1.0)
        c = np.array(degrade(stops, rng.random()), dtype=np.float32) * v
        a[max(0, y - 1) : y + 1, max(0, x - 1) : x + 1] = np.maximum(a[max(0, y - 1) : y + 1, max(0, x - 1) : x + 1], c)
    res = np.clip(a * 1.15 + lueur * 0.9 + large * 0.7, 0, 255).astype(np.uint8)
    return Image.fromarray(res)


BLEU = [(20, 50, 255), (40, 130, 255), (70, 210, 255), (130, 100, 255), (60, 170, 255)]
ORANGE = [(255, 95, 20), (255, 150, 40), (255, 205, 80), (255, 70, 110), (255, 175, 60)]

if __name__ == "__main__":
    texture(7, BLEU, 1500, 300).save(OUT / "mapping-fin-a.webp", quality=88, method=6)
    texture(23, ORANGE, 1300, 300).save(OUT / "mapping-fin-b.webp", quality=88, method=6)
    print("ok")
