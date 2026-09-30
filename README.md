# Vitra Lightscape

Proposition pour l'appel d'offres du Vitra Campus (projet étudiant BUT MMI) : un parcours nocturne, avec des mappings lumineux qui révèlent l'intention des architectes, et un chemin de lumière qui guide la visite.

Site statique en **Astro + CSS**. Le JavaScript sert aux interactions : passage jour → nuit, chemin lumineux, billetterie et panier.

## En ligne

**https://goerig-florian.github.io/vitra-lightscape/**

Le site est republié automatiquement à chaque mise à jour de la branche `main`. On peut suivre la publication dans l'onglet *Actions* du dépôt.

## Récupérer les mises à jour

```bash
git pull
```

## Lancer en local (facultatif)

```bash
npm install      # une seule fois
npm run dev      # http://localhost:4321
```

## Déroulé de la page

1. **Vidéo de fond** : le Vitra Design Museum passe du jour au coucher de soleil, puis à la nuit.
   - L'horloge suit la vidéo, de 18:00 à 21:30.
   - À la nuit, une vague de lumière douce balaie le musée.
   - Boutons pause et revoir.
2. **L'expérience** (sable → pêche → corail) : les trois modes de mise en lumière (façade, intérieur, interactif) et le chemin lumineux.
3. **Le soleil se couche** : le ciel passe du corail au bleu nuit au défilement, l'horloge avance, le logo s'allume.
4. **Le parcours** (nuit) : carte du Campus de vitra.com. À l'entrée dans la section, le chemin lumineux s'allume d'étape en étape, avec le numéro et le nom du bâtiment en cours. L'index des 31 bâtiments et œuvres suit l'ordre de la visite et se filtre par mode. Survoler un bâtiment allume son repère et son volume sur la carte.
5. **Billetterie** (nuit) : choix d'une soirée, d'un horaire et des billets, puis ajout au panier.
6. **Panier** : tiroir latéral et page `/panier/`. **Le paiement n'est pas branché** (message de démonstration).

## Le parcours : ordre et sources

Une boucle d'environ **2,2 km** à pied, qui part du parking visiteurs et y revient.

| Étapes | Secteur | Pourquoi dans cet ordre |
|---|---|---|
| Départ | Parking visiteurs (nord-ouest) | Sortie piétonne sur l'Álvaro-Siza-Promenade, qui longe le parking jusqu'à la VitraHaus. |
| 1 à 4 | VitraHaus, Ring et Ruisseau, Airstream Kiosk, Arrêt de bus | L'entrée se fait par le parvis de la VitraHaus, puis le long de la Römerstraße. |
| 5 à 10 | Campus Gallery, Water Garden, Design Museum, Balancing Tools, Pavillon Ando, Doshi Retreat | Le pôle musée, puis le jardin de l'est du Campus. |
| 11 à 14 | Halles Gehry, Grimshaw (1981), SANAA, Grimshaw (1983) | On redescend vers le sud par les voies qui séparent les halles. |
| 15 à 20 | Schaudepot, Barragán Gallery, Place Jean Prouvé, Caserne de pompiers, Vitra Designweg, Torre Numero Due | Le pôle sud, autour de la place, jusqu'à l'entrée sud où arrive le Designweg. |
| 21 à 23 | Halle Siza, Álvaro-Siza-Promenade, Vitra Tour-Toboggan | Retour vers le nord par la promenade, le long de la halle Siza. |
| 24 à 31 | Khudi Bari, Diogene, Umbrella House, Station-service, Dôme, Tane Garden House, Oudolf Garten, Blockhaus | Fin de soirée dans le jardin Oudolf, qui débouche sur le parking. |

Cette boucle évite les allers-retours. On ne repasse jamais par le même tronçon, sauf les quelques mètres de la sortie du parking et de courts crochets vers des œuvres situées en bord d'allée.

**La carte.** Le fond est le SVG de la carte interactive de vitra.com : une vue axonométrique, sans nord ni échelle, donc sans coordonnées géographiques. `scripts/make-map.py` en garde le calque de dessin (`public/campus-map.svg`) et fabrique `src/data/carte.json`.

- **Ancrage.** Le trajet calculé sur OpenStreetMap (`scripts/make-plan.py` → `scripts/data/osm-route.json`) est transposé dans le repère du SVG par une transformation affine. Elle est ajustée sur 13 bâtiments reconnus à coup sûr dans les deux sources (VitraHaus, Dôme, les quatre halles, Design Museum, Tane, Diogene, Umbrella House, Tour-Toboggan, caserne). Les écarts sont affichés à chaque exécution : 1 à 2 unités pour la plupart, 10 au plus sur 549 de large.
- **Bâtiments.** Chaque étape est posée sur la zone correspondante de la carte Vitra. Ces zones, cliquables chez Vitra, servent ici à allumer le bâtiment quand le chemin y arrive, ou au survol.
- **Trajet.** Il suit l'ordre ci-dessus. Il est décalé vers le bas de 7 unités pour retomber au niveau du sol plutôt qu'au centre des toits.
- **Sans élément sur la carte Vitra.** Ring et Ruisseau, Water Garden, Place Jean Prouvé et Álvaro-Siza-Promenade n'ont pas de zone sur la carte. Leur repère est **approché** : en pointillé, avec la mention « position approchée ». La Barragán Gallery est dans le Vitra Schaudepot. Elle partage donc son volume, avec un repère décalé.
- **Identification.** Les zones sûres (nommées dans le SVG ou confirmées par l'ajustement) : VitraHaus, Dôme, Umbrella House, Tane House, Diogene, Schaudepot, Tour-Toboggan, caserne, Designweg. Plus probables qu'attestées : Khudi Bari, Blockhaus, Station-service, Airstream Kiosk, Arrêt de bus, Campus Gallery, Doshi Retreat, Balancing Tools, Torre Numero Due. **À valider.**

Pour mettre à jour le trajet ou la carte :

```bash
npm run plan     # trajet d'après OpenStreetMap (Python 3, sans dépendance)
npm run carte    # carte et positions dans le repère du SVG Vitra
```

## Modifier le contenu

| Quoi | Fichier |
|---|---|
| Textes | `src/data/content.ts` |
| Les 31 bâtiments, dans l'ordre du parcours, et leur mode de mise en lumière (**proposition**) | `src/data/batiments.ts` |
| Carte, positions et tracé du parcours (généré) | `scripts/make-plan.py` → `scripts/data/osm-route.json` → `scripts/make-map.py` → `src/data/carte.json` |
| Dates, horaires, tarifs (**provisoires**) | `src/data/billetterie.ts` |
| Couleurs, typographie, espacements | `src/styles/tokens.css` |

Pour changer l'ordre du parcours, modifiez la liste `STOPS` de `scripts/make-plan.py` **et** l'ordre de `src/data/batiments.ts`, puis relancez `npm run plan` et `npm run carte`. Les zones et décalages de repères sont dans `CARTE` de `scripts/make-map.py`. La compilation échoue si un bâtiment n'a pas de position.

**Vidéo.** Déposez les originaux dans `photos-sources/` (non versionnés), puis lancez `python3 scripts/make-video.py` (Pillow, NumPy et ffmpeg).

## Arborescence

```
.github/workflows/deploy.yml   publication GitHub Pages
public/video/                  vidéo jour → nuit du musée (WebM, MP4) et affiches
scripts/make-video.py          fabrication de la vidéo
scripts/make-plan.py           trajet du parcours (OpenStreetMap)
scripts/make-map.py            carte et positions dans le repère du SVG Vitra
scripts/source/                SVG d'origine de la carte de vitra.com
scripts/data/osm-route.json    trajet intermédiaire
public/campus-map.svg          fond de carte (calque de dessin du SVG Vitra)
src/
  assets/logo/                 logo SVG original (tracés inchangés)
  assets/fonts/                Inter (SIL Open Font License), auto-hébergée
  components/                  Header, Hero, Experience, Dusk, Parcours,
                               Billetterie, Infos, Footer, CartDrawer, Logo
  data/                        contenus, bâtiments, carte.json, billetterie
  layouts/Base.astro
  pages/index.astro, pages/panier.astro
  scripts/main.js              vidéo, coucher de soleil, parcours, navigation
  scripts/cart.js              billetterie et panier
  styles/                      tokens.css, base.css, sections.css
```

## Historique

- La section « Premières visualisations » (quatre vues de nuit) a été retirée, ainsi que ses images (`public/images/`) et leur script. L'image de partage (`og:image`) est désormais `public/video/musee-affiche-nuit.jpg`.
- Le fond du plan, d'abord dessiné d'après OpenStreetMap, est désormais la carte du Campus de vitra.com.
- Le détourage néon autour du musée, dans le premier écran, a été retiré. Seule reste une vague de lumière douce.

## Accessibilité

- Tout le contenu est lisible sans JavaScript. Le plan s'affiche alors entier.
- Avec « réduire les animations » :
  - la vidéo ne se lance pas toute seule : l'image de nuit s'affiche, et le bouton Lecture reste disponible ;
  - le plan du parcours s'affiche d'un coup, sans animation.
- La vidéo a des boutons pause et revoir. L'animation du parcours a un bouton pause, reprendre et rejouer.
- L'index des étapes est la version texte du plan : ordre de visite, auteurs, dates, modes.
- Navigation au clavier, focus visibles, panier en dialogue modal (Échap pour fermer). Les filtres du parcours sont des boutons avec état.
