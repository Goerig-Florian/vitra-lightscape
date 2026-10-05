# Vitra Lightscape

Proposition pour l'appel d'offres du Vitra Campus (projet étudiant BUT MMI) : un parcours nocturne, avec des mappings lumineux qui révèlent l'intention des architectes, et un chemin de lumière qui guide la visite.

Site statique en **Astro + CSS**, en Futura comme vitra.com. Le JavaScript sert aux interactions : passage jour → nuit, chemin lumineux, billetterie et panier.

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

Sur écran large (1024 px et plus), un **fil lumineux** vertical court sur le côté gauche : il descend au fil du défilement et allume un point par grand bloc (Accueil, Le soir, Le parcours, Billetterie, Infos), comme le chemin du parcours. Les points sont des liens, au clavier aussi ; le nom du bloc s'affiche au survol, au focus et un instant quand on y arrive (`Rail.astro`).

1. **Vidéo de fond** : le Vitra Design Museum passe du jour au coucher de soleil, puis à la nuit.
   - À la nuit, une vague de lumière douce balaie le musée.
   - À la fin de la vidéo, **un aperçu de trois secondes** : la version mapping de la dernière image de la vidéo (même cadrage) apparaît en fondu, puis s'éteint (un seul bâtiment, mention « visualisation de projet »).
   - Bouton lecture / pause (« Revoir la vidéo » à la fin).
   - Deux boutons, Réserver et Découvrir le parcours, alignés à droite ; au survol (ou au focus clavier), une lumière blanche, comme un néon, fait le tour de leur cadre. Pas d'animation avec « animations réduites ».
2. **Le soleil se couche** : le ciel passe du corail au bleu nuit au défilement, l'horloge avance, le logo s'allume.
3. **La lumière** : la promesse en une phrase et trois verbes (elle souligne, elle s'allume du dedans, elle répond à vos pas), sans montrer le projet. Un seul exemple, en « lampe torche » : la caserne de nuit (la même visualisation que sa fiche), et le mapping n'apparaît que dans le cercle de lumière que l'on déplace (souris ou doigt). Sans action, la torche se promène seule.
4. **Le parcours** (nuit) : page d'accueil du parcours.
   - Chiffres clés : 31 étapes, 2,2 km, environ 35 min de marche (estimation à 4 km/h, hors arrêts), départ du parking visiteurs.
   - La carte du Campus (vitra.com) : le chemin lumineux, en lumière froide, s'allume d'étape en étape à l'entrée dans la section.
   - Au survol d'un numéro (ou au focus clavier), son bâtiment s'éclaire sur la carte et la fiche montre ce bâtiment ; en quittant le numéro, la fiche revient à l'étape choisie, dont le bâtiment reste éclairé. Les 31 photos sont préchargées au premier survol.
   - Un clic (ou Entrée) sur un repère ouvre la fiche du bâtiment : photo de jour, auteur, année, mode de mise en lumière, lien vitra.com. Le bouton « Voir de nuit » fait passer la photo du jour à la nuit par un fondu à teinte de coucher de soleil (30 bâtiments sur 31, le Designweg n'a pas de vue de nuit). Le passage à la nuit ne se lance qu'au clic ; chaque fiche s'ouvre de jour, et l'animation du chemin ne change pas la fiche toute seule. Précédent / suivant (flèches sur la photo).
   - Filtres façade / intérieur / interactif.
5. **Votre soirée** : trois temps (arrivée au crépuscule, chemin lumineux, chaque bâtiment s'éveille), les faits (31 étapes, 2,2 km, environ 35 min, départ), et le secret comme argument : « chaque bâtiment a sa propre écriture lumineuse, elle se découvre sur place ». Le Vitra Design Museum aux faisceaux de lumière blanche, avec les visiteurs sur le chemin lumineux.
6. **Billetterie** (nuit) : choix d'une soirée, d'un horaire et des billets, puis ajout au panier.
7. **Panier** : tiroir latéral et page `/panier/`. **Le paiement n'est pas branché** (message de démonstration).

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
- **Sans zone sur la carte Vitra.** Ring et Ruisseau, Water Garden, Place Jean Prouvé, Barragán Gallery et Álvaro-Siza-Promenade n'ont pas de zone. Leur repère suit la position des points d'intérêt de vitra.com. Ring et Ruisseau, et la promenade, sont décalés de quelques unités pour ne pas recouvrir leurs voisins : repère en pointillé, mention « repère décalé ». La Barragán Gallery est dans le Vitra Schaudepot.
- **Identification.** Toutes les étapes ont été recoupées avec les positions officielles de vitra.com : écart de 1 à 10 unités sur 549, sauf Halle Gehry et Halle Grimshaw 1981 (environ 25, le centre du toit diffère du point choisi par Vitra).

**Les fiches.** Les photos de jour et les liens viennent de la page « Architecture » de vitra.com (`scripts/fetch-photos.py`, `npm run photos`). Les positions officielles des points d'intérêt de cette page ont servi à poser les repères. Elles ont confirmé l'identification des bâtiments, avec 2 à 10 unités d'écart.

Pour mettre à jour le trajet, la carte ou les photos :

```bash
npm run plan     # trajet d'après OpenStreetMap (Python 3, sans dépendance)
npm run carte    # carte et positions dans le repère du SVG Vitra
npm run photos   # photos et liens des fiches (Python 3 + Pillow + curl)
npm run nuit     # visualisations de nuit, depuis photos-nuit/ (Python 3 + Pillow)
npm run police   # police Futura, depuis polices-sources/ (Python 3 + fontTools)
npm run mapping  # visualisations de mapping de la landing, depuis mapping-sources/ (Python 3 + Pillow)
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
scripts/fetch-photos.py        photos et liens des fiches (vitra.com)
scripts/prepare-night.py       visualisations de nuit (originaux dans photos-nuit/, non versionnés)
scripts/prepare-font.py        police Futura sans accents (originaux dans polices-sources/, non versionnés)
scripts/prepare-mapping.py     visualisations de mapping de la landing (originaux dans mapping-sources/, non versionnés)
scripts/source/                SVG d'origine de la carte de vitra.com
scripts/data/osm-route.json    trajet intermédiaire
public/campus-map.svg          fond de carte (calque de dessin du SVG Vitra)
public/photos/                 photos de jour (vitra.com) et visualisations de nuit (<id>-nuit.webp)
public/mapping/                3 images : aperçu de fin de vidéo, caserne avec mapping (lampe torche), musée aux faisceaux (Votre soirée)
src/
  assets/logo/                 logo SVG original (tracés inchangés)
  assets/fonts/futura/         Futura (ParaType), 4 graisses, auto-hébergée (licence : voir CREDITS.md)
  components/                  Header, Hero, Dusk, Lumiere, Parcours, Soiree, Rail,
                               Billetterie, Infos, Footer, CartDrawer, Logo
  data/                        contenus, bâtiments, carte.json, fiches.json, billetterie
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
- Les repères de la carte sont des boutons au clavier (Tab, Entrée). Chaque repère porte une étiquette lisible par un lecteur d'écran (numéro, nom, auteur, année).
- Navigation au clavier, focus visibles, panier en dialogue modal (Échap pour fermer). Les filtres du parcours sont des boutons avec état.
