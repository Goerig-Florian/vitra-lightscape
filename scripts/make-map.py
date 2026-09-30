"""
Fabrique la carte du parcours à partir du SVG du Vitra Campus (vitra.com).

Usage :  python3 scripts/make-map.py        (sans dépendance)

Entrées
- scripts/source/vitra-campus-map.svg : carte interactive originale de vitra.com.
- scripts/data/osm-route.json         : ordre des étapes et trajet à pied (make-plan.py,
                                        © contributeurs OpenStreetMap, ODbL).

Sorties
- public/campus-map.svg : le calque de dessin du SVG Vitra (calque 1), sans ses zones interactives.
- src/data/carte.json   : étapes, trajet et parking exprimés dans le repère du SVG.

Le SVG Vitra est une vue axonométrique : pas d'échelle ni de nord. Le trajet OSM y est donc
transposé par une transformation affine, ajustée (moindres carrés) sur les bâtiments que l'on
reconnaît à coup sûr dans les deux sources (voir ANCRES). Les résidus sont affichés à chaque
exécution. Chaque étape est ensuite posée sur son bâtiment dans le SVG (zones interactives du
calque 2, repérées par leur numéro d'ordre dans le fichier). Les étapes sans élément dans le SVG
sont placées par la transformation et marquées « approx ».
"""
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "source" / "vitra-campus-map.svg"
ROUTE = ROOT / "scripts" / "data" / "osm-route.json"
OUT_SVG = ROOT / "public" / "campus-map.svg"
OUT_JSON = ROOT / "src" / "data" / "carte.json"
VIEWBOX = (0, 0, 549.38, 396.4)   # cadre du SVG d'origine (fond)
CADRE = (105, 38, 444, 298)       # partie affichée : le dessin utile
# Le dessin montre des toits : la transformation, ajustée sur leur centre, place le trajet trop
# haut. Décalage vertical (unités du SVG) pour ramener le chemin au niveau du sol.
SOL_DY = 7.0

# Centre (x, y) de chaque zone du calque 2, numérotées dans l'ordre du fichier (1 à 33).
CENTRES = {
    1: (157.2, 221.7), 2: (344.8, 238.0), 3: (428.9, 170.1), 4: (363.2, 250.6), 5: (430.3, 202.6),
    6: (474.7, 219.0), 7: (274.0, 91.9), 8: (441.6, 135.1), 9: (233.8, 247.7), 10: (264.0, 261.6),
    11: (286.9, 285.2), 12: (408.7, 247.2), 13: (398.2, 243.5), 14: (333.3, 266.3), 15: (449.2, 152.0),
    16: (376.0, 268.7), 17: (335.8, 301.3), 18: (362.0, 144.3), 19: (282.2, 209.8), 20: (217.5, 178.2),
    21: (428.4, 267.9), 22: (215.9, 259.0), 23: (178.4, 253.0), 24: (256.2, 300.9), 25: (428.0, 118.8),
    26: (323.0, 244.5), 27: (159.9, 236.4), 28: (452.2, 220.5), 29: (454.5, 101.0), 30: (416.4, 103.8),
    31: (523.6, 73.3), 32: (463.5, 95.7), 33: (379.3, 266.0),
}

# Étape -> zones du calque 2 à allumer, et repère : (x, y) ou None = centre de la première zone.
# `approx` : pas d'élément identifiable dans le SVG, position déduite de la transformation.
CARTE = {
    "vitrahaus": {"zones": [17]},
    "ring-ruisseau": {"approx": True},
    "airstream": {"zones": [11]},
    "arret-bus": {"zones": [24]},
    "campus-gallery": {"zones": [10]},
    "water-garden": {"approx": True, "pos": CENTRES[22]},
    "design-museum": {"zones": [9]},
    "balancing-tools": {"zones": [23]},
    "pavillon-ando": {"zones": [27]},
    "doshi": {"zones": [1]},
    "halle-gehry": {"zones": [19]},
    "halle-grimshaw-1981": {"zones": [20]},
    "halle-sanaa": {"zones": [7]},
    "halle-grimshaw-1983": {"zones": [18]},
    "schaudepot": {"zones": [25], "pos": (420.0, 118.0)},
    "barragan": {"zones": [], "pos": (434.0, 108.0)},
    "place-prouve": {"approx": True, "pos": (452.0, 119.0)},
    "caserne": {"zones": [8], "pos": (443.0, 135.0)},
    "designweg": {"zones": [32]},
    "torre": {"zones": [15], "pos": (455.0, 151.0)},
    "halle-siza": {"zones": [5]},
    "promenade-siza": {"approx": True, "pos": (494.0, 207.0)},
    "tour-toboggan": {"zones": [6]},
    "khudi-bari": {"zones": [12]},
    "diogene": {"zones": [13]},
    "umbrella": {"zones": [2]},
    "station-service": {"zones": [26]},
    "dome": {"zones": [14]},
    "tane": {"zones": [4]},
    "oudolf": {"zones": [16]},
    "blockhaus": {"zones": [21]},
}

# Ancres de la transformation : étape -> zone du calque 2 (bâtiments identifiés avec certitude).
ANCRES = {
    "vitrahaus": 17, "dome": 14, "halle-sanaa": 7, "halle-siza": 5, "halle-gehry": 19,
    "halle-grimshaw-1981": 20, "halle-grimshaw-1983": 18, "tane": 4, "diogene": 13,
    "umbrella": 2, "tour-toboggan": 6, "caserne": 8, "design-museum": 9,
}


def fit(src, dst):
    """Transformation affine (a, b, c, d, e, f) par moindres carrés : x' = ax+cy+e, y' = bx+dy+f."""
    def solve(rows, rhs):
        n = len(rows[0])
        ata = [[sum(r[i] * r[j] for r in rows) for j in range(n)] for i in range(n)]
        atb = [sum(r[i] * v for r, v in zip(rows, rhs)) for i in range(n)]
        for i in range(n):  # Gauss
            p = max(range(i, n), key=lambda k: abs(ata[k][i]))
            ata[i], ata[p], atb[i], atb[p] = ata[p], ata[i], atb[p], atb[i]
            for k in range(i + 1, n):
                f = ata[k][i] / ata[i][i]
                ata[k] = [a - f * b for a, b in zip(ata[k], ata[i])]
                atb[k] -= f * atb[i]
        x = [0.0] * n
        for i in reversed(range(n)):
            x[i] = (atb[i] - sum(ata[i][j] * x[j] for j in range(i + 1, n))) / ata[i][i]
        return x

    rows = [(x, y, 1) for x, y in src]
    a, c, e = solve(rows, [p[0] for p in dst])
    b, d, f = solve(rows, [p[1] for p in dst])
    return a, b, c, d, e, f


def main():
    route = json.loads(ROUTE.read_text(encoding="utf-8"))
    osm = {s["id"]: s for s in route["stops"]}

    m = fit([(osm[k]["x"], osm[k]["y"]) for k in ANCRES], [CENTRES[z] for z in ANCRES.values()])

    def tf(x, y):
        return (m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5])

    def sol(x, y):
        return (x, y + SOL_DY)

    print("Résidus de l'ajustement (unités du SVG) :")
    for k, z in ANCRES.items():
        px, py = tf(osm[k]["x"], osm[k]["y"])
        print(f"  {k:22s} {((px - CENTRES[z][0]) ** 2 + (py - CENTRES[z][1]) ** 2) ** 0.5:5.1f}")

    # --- Fond : calque 1 du SVG Vitra, sans les zones interactives du calque 2 ---
    text = SRC.read_text(encoding="utf-8")
    start = text.index('<g data-name="Layer 1">')
    end = text.index('<g id="campusmap_vitracom_svg__Layer_2"')
    body = text[start:end]
    OUT_SVG.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(map(str, VIEWBOX))}">{body}</svg>',
        encoding="utf-8",
    )

    # --- Zones du calque 2 : formes visibles, dans l'ordre du fichier ---
    root = ET.fromstring(text)
    ns = "{http://www.w3.org/2000/svg}"
    layer2 = next(g for g in root.iter(ns + "g") if g.get("id") == "campusmap_vitracom_svg__Layer_2")

    def shapes(el):
        out = []
        for e in el.iter():
            if "invisible" in (e.get("class") or "").split():
                continue
            if e.tag == ns + "path" and e.get("d"):
                out.append(e.get("d"))
            elif e.tag == ns + "polygon" and e.get("points"):
                pts = re.findall(r"-?[\d.]+", e.get("points"))
                xy = list(zip(pts[0::2], pts[1::2]))
                out.append("M" + " L".join(f"{x} {y}" for x, y in xy) + "Z")
        return out

    zones = {i + 1: shapes(el) for i, el in enumerate(layer2)}
    assert len(zones) == 33, len(zones)

    def r1(v):
        return round(v, 1)

    stops = []
    for s in route["stops"]:
        cfg = CARTE[s["id"]]
        ax, ay = sol(*tf(s["ax"], s["ay"]))
        zs = cfg.get("zones", [])
        if "pos" in cfg:
            x, y = cfg["pos"]
        elif zs:
            x, y = CENTRES[zs[0]]
        else:
            x, y = tf(s["x"], s["y"])
        stop = {"id": s["id"], "x": r1(x), "y": r1(y), "ax": r1(ax), "ay": r1(ay), "at": s["at"],
                "approx": bool(cfg.get("approx")), "shapes": [d for z in zs for d in zones[z]]}
        if cfg.get("approx") and s.get("note"):
            stop["note"] = s["note"]
        stops.append(stop)

    nums = re.findall(r"-?[\d.]+", route["route"])
    line = [sol(*tf(float(x), float(y))) for x, y in zip(nums[0::2], nums[1::2])]
    park, ent = route["parking"], route["entree"]
    px, py = sol(*tf(park["x"], park["y"]))
    gx, gy = sol(*tf(park["gx"], park["gy"]))
    ex, ey = sol(*tf(ent["x"], ent["y"]))
    carte = {
        "viewBox": list(CADRE),
        "length": route["length"],
        "route": "M" + " L".join(f"{r1(x)} {r1(y)}" for x, y in line),
        "parking": {"x": r1(px), "y": r1(py), "gx": r1(gx), "gy": r1(gy)},
        "entree": {"x": r1(ex), "y": r1(ey), "at": ent["at"]},
        "stops": stops,
    }
    OUT_JSON.write_text(json.dumps(carte, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(stops)} étapes -> {OUT_JSON.relative_to(ROOT)}, fond -> {OUT_SVG.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
