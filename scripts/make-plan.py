"""
Calcule le trajet du parcours (scripts/data/osm-route.json) à partir d'OpenStreetMap.

Usage :  python3 scripts/make-plan.py            (interroge l'API Overpass)
         python3 scripts/make-plan.py osm.json   (réutilise un export déjà téléchargé)

Données © contributeurs OpenStreetMap, licence ODbL (https://www.openstreetmap.org/copyright).

- Projection locale en mètres, nord en haut (équirectangulaire autour du Campus :
  l'erreur est négligeable sur 600 m).
- Chaque étape est accrochée à un objet OSM (bâtiment, œuvre, allée). Cinq œuvres
  n'existent pas dans OSM : leur position est APPROCHÉE d'après la description
  publiée par Vitra, et signalée comme telle (`approx`).
- Le chemin lumineux suit le plus court trajet à pied sur le réseau OSM
  (allées, chemins, voies de service du Campus) entre deux étapes consécutives.
"""
import heapq
import json
import math
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "scripts" / "data" / "osm-route.json"

# Cadre du plan (sud, nord, ouest, est)
S, N, W, E = 47.5982, 47.6036, 7.6128, 7.6210
LAT0 = (S + N) / 2
KX = 111320 * math.cos(math.radians(LAT0))
KY = 111200

QUERY = f"""[out:json][timeout:60];
(way({S - 0.001},{W - 0.001},{N + 0.001},{E + 0.001});
 node({S - 0.001},{W - 0.001},{N + 0.001},{E + 0.001})[~"^(name|entrance|tourism)$"~"."];);
out geom;"""

# Parking visiteurs (way 196642512, access=permissive, zone autocars) et départ
PARKING = "way/196642512"
# Entrée : début de l'Álvaro-Siza-Promenade, sur le parvis de la VitraHaus
ENTREE = (47.6029149, 7.6171280)

# Étapes, dans l'ordre du parcours. `osm` : objet OSM ; sinon `approx` : règle écrite.
STOPS = [
    ("vitrahaus", {"osm": "way/196642543"}),
    ("ring-ruisseau", {"approx": "midpoint", "a": "way/196642543", "b": "way/152179010",
                        "note": "Dans le pré devant la VitraHaus (vitra.com) : placé entre la VitraHaus et le Dôme."}),
    ("airstream", {"osm": "way/413185216"}),
    ("arret-bus", {"osm": "way/413185218"}),
    ("campus-gallery", {"osm": "way/196642513"}),
    ("water-garden", {"approx": "at", "a": "node/9422667393",
                       "note": "Devant le Vitra Design Museum (vitra.com) : placé à son entrée principale."}),
    ("design-museum", {"osm": "way/208410276"}),
    ("balancing-tools", {"osm": "node/2069512583"}),
    ("pavillon-ando", {"osm": "way/196642506"}),
    ("doshi", {"osm": "way/1447793972"}),
    ("halle-gehry", {"osm": "way/24218212"}),
    ("halle-grimshaw-1981", {"osm": "way/24218215"}),
    ("halle-sanaa", {"osm": "way/196642508"}),
    ("halle-grimshaw-1983", {"osm": "way/24218219"}),
    ("schaudepot", {"osm": "way/603901815", "shift": (-9, 0)}),
    ("barragan", {"osm": "way/603901815", "shift": (9, 0),
                   "note": "Dans le Vitra Schaudepot (vitra.com)."}),
    ("place-prouve", {"approx": "midpoint", "a": "way/24218258", "b": "node/5731375277",
                       "note": "Place entre la caserne de pompiers et le Schaudepot (vitra.com)."}),
    ("caserne", {"osm": "way/24218258"}),
    ("designweg", {"approx": "way-start", "way": "way/413140061",
                    "note": "Le Designweg longe la Müllheimer Straße depuis le tram 8 jusqu'à l'entrée sud "
                            "du Campus (vitra.com) : placé à son arrivée, au départ de l'Álvaro-Siza-Promenade."}),
    ("torre", {"approx": "nearest-way", "a": "way/24218258", "way": "way/413140061",
                "note": "Sur l'Álvaro-Siza-Promenade, devant un mur de la caserne (vitra.com)."}),
    ("halle-siza", {"osm": "way/24218223"}),
    ("promenade-siza", {"osm": "way/413140061", "on": "middle"}),
    ("tour-toboggan", {"osm": "node/4144721198"}),
    ("khudi-bari", {"osm": "node/12042040410"}),
    ("diogene", {"osm": "node/11412858261"}),
    ("umbrella", {"osm": "way/1230637578"}),
    ("station-service", {"osm": "way/244478102"}),
    ("dome", {"osm": "way/152179010"}),
    ("tane", {"osm": "way/1240296590"}),
    ("oudolf", {"osm": "way/1002015403"}),
    ("blockhaus", {"osm": "way/1191309540"}),
]

WALK = {"footway", "path", "pedestrian", "service", "living_street", "steps", "cycleway", "track"}
ROADS = {"primary", "secondary", "tertiary", "residential", "unclassified"}


def load():
    if len(sys.argv) > 1:
        return json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))["elements"]
    data = urllib.parse.urlencode({"data": QUERY}).encode()
    req = urllib.request.Request("https://overpass-api.de/api/interpreter", data,
                                 headers={"User-Agent": "vitra-lightscape (projet étudiant)"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode("utf-8"))["elements"]


def xy(lat, lon):
    return ((lon - W) * KX, (N - lat) * KY)


def r1(v):
    return round(v, 1)


def centroid(pts):
    """Centre de gravité d'un polygone (repli : moyenne des sommets)."""
    a = cx = cy = 0.0
    for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]):
        c = x0 * y1 - x1 * y0
        a += c
        cx += (x0 + x1) * c
        cy += (y0 + y1) * c
    if abs(a) < 1e-9:
        return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))
    return (cx / (3 * a), cy / (3 * a))


def main():
    els = load()
    by = {f"{e['type']}/{e['id']}": e for e in els}

    def geom(key):
        e = by[key]
        if e["type"] == "node":
            return [xy(e["lat"], e["lon"])]
        return [xy(p["lat"], p["lon"]) for p in e["geometry"]]

    def point(key):
        g = geom(key)
        return g[0] if len(g) == 1 else centroid(g[:-1] if g[0] == g[-1] else g)

    def inside(pts, m=40):
        return any(-m <= x <= (E - W) * KX + m and -m <= y <= (N - S) * KY + m for x, y in pts)

    # --- Réseau piéton (graphe) -------------------------------------------
    nodes, adj = {}, {}
    for e in els:
        t = e.get("tags", {})
        if e["type"] != "way" or t.get("highway") not in WALK or "geometry" not in e:
            continue
        ids = e["nodes"]
        for nid, p in zip(ids, e["geometry"]):
            nodes[nid] = xy(p["lat"], p["lon"])
        for a, b in zip(ids, ids[1:]):
            d = math.dist(nodes[a], nodes[b])
            adj.setdefault(a, []).append((b, d))
            adj.setdefault(b, []).append((a, d))

    # Bâtiments : on ne traverse pas un bâtiment pour raccorder deux allées
    walls = []
    for e in els:
        if e["type"] == "way" and "building" in e.get("tags", {}) and "geometry" in e:
            g = geom(f"way/{e['id']}")
            walls += [(a, b, min(a[0], b[0]), max(a[0], b[0]), min(a[1], b[1]), max(a[1], b[1]))
                      for a, b in zip(g, g[1:])]

    def o(u, v, w):
        return (v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0])

    def blocked(p, q):
        x0, x1, y0, y1 = min(p[0], q[0]), max(p[0], q[0]), min(p[1], q[1]), max(p[1], q[1])
        return any(o(p, q, a) * o(p, q, b) < 0 and o(a, b, p) * o(a, b, q) < 0
                   for a, b, ax0, ax1, ay0, ay1 in walls
                   if ax1 >= x0 and ax0 <= x1 and ay1 >= y0 and ay0 <= y1)

    lawns = []
    for e in els:
        t = e.get("tags", {})
        if e["type"] == "way" and "geometry" in e and (
                t.get("leisure") in ("garden", "park") or t.get("landuse") in ("grass", "meadow", "village_green")):
            lawns.append(geom(f"way/{e['id']}"))

    def in_poly(p, poly):
        c = False
        for (x0, y0), (x1, y1) in zip(poly, poly[1:]):
            if (y0 > p[1]) != (y1 > p[1]) and p[0] < (x1 - x0) * (p[1] - y0) / (y1 - y0) + x0:
                c = not c
        return c

    # Raccords : allées à moins de 18 m l'une de l'autre (70 m à travers une pelouse),
    # non reliées dans OSM (parvis, prairies non cartographiés). Jamais à travers un
    # bâtiment ; coût majoré pour préférer les vraies allées.
    ids = [n for n in adj if inside([nodes[n]], 60)]
    cell = {}
    for n in ids:
        cell.setdefault((int(nodes[n][0] // 70), int(nodes[n][1] // 70)), []).append(n)
    for n in ids:
        cx0, cy0 = int(nodes[n][0] // 70), int(nodes[n][1] // 70)
        linked = {m for m, _ in adj[n]}
        for i in (-1, 0, 1):
            for j in (-1, 0, 1):
                for m in cell.get((cx0 + i, cy0 + j), []):
                    if m <= n or m in linked:
                        continue
                    d = math.dist(nodes[n], nodes[m])
                    if d <= 2 or d >= 70:
                        continue
                    if d >= 18:
                        mid = ((nodes[n][0] + nodes[m][0]) / 2, (nodes[n][1] + nodes[m][1]) / 2)
                        if not any(in_poly(mid, g) for g in lawns):
                            continue
                    if not blocked(nodes[n], nodes[m]):
                        adj[n].append((m, d * 1.6))
                        adj[m].append((n, d * 1.6))

    def dijkstra(a):
        dist, prev, q = {a: 0}, {}, [(0, a)]
        while q:
            d, n = heapq.heappop(q)
            if d > dist[n]:
                continue
            for m, w in adj[n]:
                nd = d + w
                if nd < dist.get(m, 1e18):
                    dist[m], prev[m] = nd, n
                    heapq.heappush(q, (nd, m))
        return dist, prev

    def seg_dist(p, a, b):
        ax, ay = b[0] - a[0], b[1] - a[1]
        L = ax * ax + ay * ay
        t = 0 if L == 0 else max(0, min(1, ((p[0] - a[0]) * ax + (p[1] - a[1]) * ay) / L))
        return math.dist(p, (a[0] + t * ax, a[1] + t * ay))

    def near(shape, p):
        """Distance d'un nœud à la forme de l'étape (point ou contour de bâtiment)."""
        if len(shape) == 1:
            return math.dist(p, shape[0])
        return min(seg_dist(p, a, b) for a, b in zip(shape, shape[1:]))

    # --- Étapes -----------------------------------------------------------
    stops = []
    for sid, cfg in STOPS:
        if "osm" in cfg:
            g = geom(cfg["osm"])
            p = g[len(g) // 2] if cfg.get("on") == "middle" else point(cfg["osm"])
            shape = [p] if cfg.get("on") else g
            src = cfg["osm"]
        else:
            if cfg["approx"] == "midpoint":
                a, b = point(cfg["a"]), point(cfg["b"])
                p = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
            elif cfg["approx"] == "at":
                p = point(cfg["a"])
            elif cfg["approx"] == "way-start":
                p = geom(cfg["way"])[0]
            else:  # nearest-way : point de l'allée le plus proche de la référence
                ref = point(cfg["a"])
                p = min(geom(cfg["way"]), key=lambda q: math.dist(q, ref))
            shape, src = [p], None
        dx, dy = cfg.get("shift", (0, 0))
        p = (p[0] + dx, p[1] + dy)
        stops.append({"id": sid, "x": r1(p[0]), "y": r1(p[1]), "osm": src,
                      "approx": src is None, "note": cfg.get("note"), "_shape": shape})

    # --- Trajet : parking → entrée → étapes → parking ------------------------
    # Départ et retour : sortie piétonne du parking, sur l'Álvaro-Siza-Promenade
    park = point(PARKING)
    prom = [n for key in ("way/495067072", "way/413140061") for n in by[key]["nodes"]]
    gate = min(prom, key=lambda n: math.dist(nodes[n], park))
    entree = min(adj, key=lambda n: math.dist(nodes[n], xy(*ENTREE)))

    line, cum, marks = [nodes[gate]], [0.0], []

    def walk_to(cur, target):
        dist, prev = dijkstra(cur)
        path = [target]
        while path[-1] != cur:
            path.append(prev[path[-1]])
        for n in reversed(path[:-1]):
            cum.append(cum[-1] + math.dist(line[-1], nodes[n]))
            line.append(nodes[n])
        marks.append(cum[-1])
        return target

    cur = walk_to(gate, entree)
    for s in stops:
        dist, _ = dijkstra(cur)
        # on rejoint l'étape par le point le plus proche à pied, à moins de 15 m d'elle
        cand = [n for n in dist if near(s["_shape"], nodes[n]) < 15]
        if not cand:
            cand = [min(dist, key=lambda n: near(s["_shape"], nodes[n]))]
        cur = walk_to(cur, min(cand, key=lambda n: dist[n] + 0.5 * near(s["_shape"], nodes[n])))
        # point du chemin d'où l'on voit l'étape (relié au repère s'il est à l'écart)
        s["ax"], s["ay"] = r1(nodes[cur][0]), r1(nodes[cur][1])
    walk_to(cur, gate)

    total = cum[-1]
    # marks[0] = entrée ; marks[1 + i] = arrivée à l'étape i ; marks[-1] = retour au parking
    for i, s in enumerate(stops):
        s["at"] = round(marks[1 + i] / total, 4)
        del s["_shape"]
        if s["note"] is None:
            del s["note"]

    d = "M" + " L".join(f"{r1(x)} {r1(y)}" for x, y in line)

    # --- Fond de plan -----------------------------------------------------
    stop_of = {}
    for sid, c in STOPS:
        stop_of.setdefault(c.get("osm"), sid)
    buildings, walks, roads, green, labels = [], [], [], [], []
    for e in els:
        t = e.get("tags", {})
        if e["type"] != "way" or "geometry" not in e:
            continue
        g = geom(f"way/{e['id']}")
        if not inside(g):
            continue
        pts = " ".join(f"{r1(x)},{r1(y)}" for x, y in g)
        if "building" in t:
            b = {"p": pts}
            if f"way/{e['id']}" in stop_of:
                b["stop"] = stop_of[f"way/{e['id']}"]
            buildings.append(b)
        elif t.get("leisure") in ("garden", "park") or t.get("landuse") in ("grass", "meadow", "village_green"):
            green.append(pts)
        elif t.get("highway") in WALK and t.get("service") != "parking_aisle":
            walks.append({"p": pts, "main": t.get("highway") in ("footway", "path", "pedestrian")})
        elif t.get("highway") in ROADS:
            roads.append(pts)
            if t.get("name") in ("Römerstraße", "Müllheimer Straße"):
                for (x0, y0), (x1, y1) in zip(g, g[1:]):
                    if inside([(x0, y0)], -40) and inside([(x1, y1)], -40):
                        labels.append((t["name"], (x0, y0), (x1, y1)))

    # une étiquette par rue, sur son plus long tronçon visible
    best = {}
    for name, a, b in labels:
        if name not in best or math.dist(a, b) > math.dist(*best[name]):
            best[name] = (a, b)
    street_labels = []
    for name, ((x0, y0), (x1, y1)) in best.items():
        ang = math.degrees(math.atan2(y1 - y0, x1 - x0))
        ang = ang - 180 if ang > 90 else ang + 180 if ang < -90 else ang
        street_labels.append({"t": name, "x": r1((x0 + x1) / 2), "y": r1((y0 + y1) / 2), "a": round(ang)})

    parking = " ".join(f"{r1(x)},{r1(y)}" for x, y in geom(PARKING))
    ex, ey = nodes[entree]
    gx, gy = nodes[gate]
    plan = {
        "source": "© contributeurs OpenStreetMap, ODbL",
        "width": r1((E - W) * KX),
        "height": r1((N - S) * KY),
        "length": round(total),
        "parking": {"p": parking, "x": r1(park[0]), "y": r1(park[1]), "gx": r1(gx), "gy": r1(gy)},
        "entree": {"x": r1(ex), "y": r1(ey), "at": round(marks[0] / total, 4)},
        "route": d,
        "stops": stops,
        "buildings": buildings,
        "walks": walks,
        "roads": roads,
        "green": green,
        "labels": street_labels,
    }
    OUT.write_text(json.dumps(plan, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(stops)} étapes, trajet {round(total)} m, {len(buildings)} bâtiments -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
