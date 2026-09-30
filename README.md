# Vitra Lightscape — site Astro

Projet étudiant BUT MMI : proposition de concept pour le Vitra Campus (Weil am Rhein).
Site statique en **Astro + CSS**. Le JavaScript sert uniquement aux interactions (menu mobile, apparitions, aperçu).

## En ligne

Le site est publié automatiquement sur **https://goerig-florian.github.io/vitra-lightscape/** à chaque mise à jour de la branche `main` (onglet *Actions* du dépôt pour suivre la publication).

## Récupérer les mises à jour

Une seule fois :

```bash
git clone https://github.com/Goerig-Florian/vitra-lightscape.git
```

Ensuite, à chaque mise à jour :

```bash
git pull
```

## Lancer le projet en local

Prérequis : Node.js 18.20+ (ou 20+).

```bash
npm install      # installe Astro (seule dépendance)
npm run dev      # http://localhost:4321
npm run build    # génère le site dans dist/
npm run preview  # prévisualise dist/
```

Pour publier ailleurs, déposez le contenu de `dist/` sur n'importe quel hébergement statique. Pour un sous-dossier, définissez la variable `BASE_PATH` (voir `astro.config.mjs`).

## Arborescence

```
astro.config.mjs
package.json
photos-sources/            photos originales (non versionnées, déposez-y les 4 fichiers de visite)
.github/workflows/         publication automatique sur GitHub Pages
public/images/             photos optimisées AVIF / WebP / JPEG, 3 à 5 largeurs chacune
scripts/optimize-images.py régénère public/images et src/data/images.json
src/
  assets/logo/vitra-lightscape.svg   logo original, inchangé
  assets/fonts/                      Instrument Sans, Instrument Serif, IBM Plex Mono (OFL, auto-hébergées)
  components/
    Header.astro        navigation (menu repliable sur mobile)
    Logo.astro          logo SVG original, version animée ou statique
    Hero.astro          premier écran
    Concept.astro       I — concept
    Catalogue.astro     II — bâtiments, mise en page de catalogue
    Apercu.astro        III — aperçu jour / ombre / ligne
    Infos.astro         IV — informations pratiques (« Programme à venir »)
    Coda.astro          conclusion, crédits, pied de page
    Photo.astro         <picture> responsive avec dimensions réservées
    SectionLabel.astro  étiquette de section
  data/
    content.ts          tous les textes et informations pratiques
    buildings.ts        bâtiments, architectes, sources vérifiées
    photos.ts           registre des photos, crédits et droits
    images.json         dimensions générées par le script
  layouts/Base.astro    <head>, styles, script
  pages/index.astro     assemblage de la page
  scripts/main.js       interactions
  styles/
    tokens.css          couleurs, typographie, espacements, grille
    base.css            polices, remise à zéro, éléments communs
    sections.css        styles de chaque section
```

## Modifier le contenu

- **Textes et informations pratiques** : `src/data/content.ts`. Quand les dates sont validées, changez `value` et passez `pending` à `false`.
- **Crédits photo** : `src/data/photos.ts`. Remplacez « Équipe Vitra Lightscape » par le nom de la personne qui a pris chaque photo.
- **Ajouter une photo** : copiez l'original dans `photos-sources/`, ajoutez une ligne dans `PHOTOS` de `scripts/optimize-images.py`, lancez `npm run images` (Python 3 + Pillow), puis décrivez-la dans `src/data/photos.ts`.

## Choix techniques

- **Logo** : le SVG original est inséré tel quel, deux fois (une silhouette dans l'ombre, une copie éclairée révélée par un masque). Le flare suit la barre horizontale (y = 83–89 sur 138, soit 62,3 %). L'animation est entièrement en CSS et ne joue qu'une fois. Avec « réduire les animations », le logo s'affiche directement éclairé.
- **Images** : les métadonnées EXIF sont supprimées, les formats sont AVIF, WebP et JPEG avec `srcset`. `width` et `height` sont renseignés et les images secondaires sont en `loading="lazy"`.
- **Sans JavaScript**, tout le contenu reste visible. L'aperçu affiche alors directement l'étape « La ligne ».
- **Accessibilité** : lien d'évitement, navigation clavier, focus visibles, `aria-pressed` sur les étapes, textes alternatifs descriptifs, contrastes AA et plus. Aucune information n'est réservée au survol.
