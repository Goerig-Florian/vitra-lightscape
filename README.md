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

1. **Le jour** : premier écran blanc, dans l'esprit de vitra.com.
2. **L'expérience** : mappings, chemin lumineux, visite du soir.
3. **La nuit tombe** : le ciel passe du blanc au bleu nuit au défilement, l'horloge avance de 18:00 à 21:30, puis le logo s'allume.
4. **Les bâtiments** : quatre stations (VitraHaus, Dome, Vitra Design Museum, Vitra Slide Tower).
   - Chaque photo passe du jour à la nuit, puis le mapping se dessine.
   - Le chemin lumineux s'allume le long de la page.
   - Les boutons Jour / Nuit / Lumière permettent aussi de choisir la vue.
5. **Le parcours** : plan schématique du chemin lumineux (5 stations).
6. **Billetterie** : choix d'une soirée et d'un horaire, billets avec règles (les enfants doivent être accompagnés, l'option visite commentée est limitée au nombre de personnes), ajout au panier.
7. **Panier** : tiroir latéral et page `/panier/`. Le panier est conservé dans le navigateur. **Le paiement n'est pas branché** : un message de démonstration s'affiche.

## Modifier le contenu

| Quoi | Fichier |
|---|---|
| Textes | `src/data/content.ts` |
| Bâtiments, intentions, tracés du mapping, plan du parcours | `src/data/stations.ts` |
| Dates, horaires, tarifs (**provisoires**) | `src/data/billetterie.ts` |
| Couleurs, typographie, espacements | `src/styles/tokens.css` |

**Photos.** Déposez les originaux dans `photos-sources/` (non versionnés), puis lancez `npm run images` (Python 3 + Pillow). Chaque vue de jour est recadrée exactement sur sa vue de nuit pour que le fondu soit calé.

## Arborescence

```
.github/workflows/deploy.yml   publication GitHub Pages
public/images/                 photos jour / nuit optimisées (AVIF, WebP, JPEG)
scripts/optimize-images.py     génération des images
src/
  assets/logo/                 logo SVG original (tracés inchangés)
  assets/fonts/                Inter (SIL Open Font License), auto-hébergée
  components/                  Header, Hero, Experience, Dusk, Stations, Station,
                               Parcours, Billetterie, Infos, Footer, CartDrawer, Logo, Photo
  data/                        contenus, stations, billetterie, images.json
  layouts/Base.astro
  pages/index.astro, pages/panier.astro
  scripts/main.js              jour → nuit, mappings, chemin lumineux, navigation
  scripts/cart.js              billetterie et panier
  styles/                      tokens.css, base.css, sections.css
```

## Accessibilité

- Tout le contenu est lisible sans JavaScript : les stations s'affichent alors de nuit, avec le mapping.
- Avec « réduire les animations » : pas de boucles lumineuses. Les stations s'affichent dans l'état final, et les boutons Jour / Nuit / Lumière restent disponibles.
- Navigation au clavier, focus visibles, panier en dialogue modal (Échap pour fermer), textes alternatifs pour les vues de jour et de nuit.
