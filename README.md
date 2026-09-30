# Vitra Lightscape

Proposition pour l'appel d'offres du Vitra Campus (projet étudiant BUT MMI) : un parcours nocturne, avec des mappings lumineux qui révèlent l'intention des architectes, et un chemin de lumière qui guide la visite.

Site statique en **Astro + CSS**. Le JavaScript sert aux interactions : passage jour → nuit, mappings, chemin lumineux, billetterie et panier.

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
   - À la nuit, la lumière dessine la silhouette du musée.
   - Boutons pause et revoir.
2. **L'expérience** (sable) : les trois modes de mise en lumière (façade, intérieur, interactif) et le chemin lumineux.
3. **Premières visualisations** (pêche → corail) : quatre essais de nuit.
4. **Le soleil se couche** : le ciel passe du corail au bleu nuit au défilement, l'horloge avance, le logo s'allume.
5. **Le parcours** (nuit) : chemin lumineux schématique et index des 31 bâtiments et œuvres du Campus, filtrable par mode. Survoler un bâtiment allume son point sur le plan.
6. **Billetterie** (nuit) : choix d'une soirée, d'un horaire et des billets, puis ajout au panier.
7. **Panier** : tiroir latéral et page `/panier/`. **Le paiement n'est pas branché** (message de démonstration).

## Modifier le contenu

| Quoi | Fichier |
|---|---|
| Textes | `src/data/content.ts` |
| Les 31 bâtiments et leur mode de mise en lumière (**proposition**), visualisations | `src/data/batiments.ts` |
| Dates, horaires, tarifs (**provisoires**) | `src/data/billetterie.ts` |
| Couleurs, typographie, espacements | `src/styles/tokens.css` |

**Images et vidéo.** Déposez les originaux dans `photos-sources/` (non versionnés).
- Images : lancez `npm run images` (Python 3 + Pillow).
- Vidéo : lancez `python3 scripts/make-video.py` (Pillow, NumPy et ffmpeg).

## Arborescence

```
.github/workflows/deploy.yml   publication GitHub Pages
public/video/                  vidéo jour → nuit du musée (WebM, MP4) et affiches
public/images/                 visualisations de nuit optimisées (AVIF, WebP, JPEG)
scripts/make-video.py          fabrication de la vidéo
scripts/optimize-images.py     génération des images
src/
  assets/logo/                 logo SVG original (tracés inchangés)
  assets/fonts/                Inter (SIL Open Font License), auto-hébergée
  components/                  Header, Hero, Experience, Visualisations, Dusk, Parcours,
                               Billetterie, Infos, Footer, CartDrawer, Logo, Photo
  data/                        contenus, stations, billetterie, images.json
  layouts/Base.astro
  pages/index.astro, pages/panier.astro
  scripts/main.js              vidéo, coucher de soleil, parcours, navigation
  scripts/cart.js              billetterie et panier
  styles/                      tokens.css, base.css, sections.css
```

## Accessibilité

- Tout le contenu est lisible sans JavaScript.
- Avec « réduire les animations » : la vidéo ne se lance pas toute seule. L'image de nuit s'affiche avec le tracé lumineux, et le bouton Lecture reste disponible.
- La vidéo a des boutons pause et revoir.
- Navigation au clavier, focus visibles, panier en dialogue modal (Échap pour fermer). Les filtres du parcours sont des boutons avec état.
