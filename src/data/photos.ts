/**
 * Registre des photographies et de leurs crédits.
 *
 * Toutes les images du site sont des photographies de visite prises par l'équipe
 * le 16 septembre 2026 au Vitra Campus. Aucune image n'est téléchargée depuis
 * vitra.com ni générée par IA.
 *
 * `id` correspond aux fichiers générés dans public/images/ par
 * scripts/optimize-images.py (ex. "vitrahaus" -> vitrahaus-1200.avif).
 *
 * À COMPLÉTER : remplacer `credit` par le nom de la personne qui a pris
 * chaque photo.
 */

export interface PhotoCredit {
  id: string;
  building: string;
  alt: string;
  credit: string;
  date: string;
  original: string;
  treatment: string;
  rights: string;
}

const DATE = '16 septembre 2026';
const CREDIT = 'Équipe Vitra Lightscape';
const RIGHTS =
  "Photographie originale de l'équipe projet. Droits conservés par son auteur ; pas de réutilisation sans accord.";

export const photos: Record<string, PhotoCredit> = {
  'design-museum': {
    id: 'design-museum',
    building: 'Vitra Design Museum',
    alt: "Le Vitra Design Museum de Frank Gehry, volumes blancs torsadés et toitures en zinc, sous un ciel couvert, reflété dans un bassin au premier plan.",
    credit: CREDIT,
    date: DATE,
    original: '20260916_120451.jpg',
    treatment: 'Aucun recadrage à la source ; cadrages adaptés selon l’écran.',
    rights: RIGHTS,
  },
  vitrahaus: {
    id: 'vitrahaus',
    building: 'VitraHaus',
    alt: 'La VitraHaus : des maisons à pignon grises empilées et décalées, aux façades pignon entièrement vitrées, au-dessus d’un jardin planté.',
    credit: CREDIT,
    date: DATE,
    original: '20260916_093521.jpg',
    treatment: 'Recadrée sur la droite pour retirer les passants.',
    rights: RIGHTS,
  },
  'vitrahaus-detail': {
    id: 'vitrahaus-detail',
    building: 'VitraHaus (détail)',
    alt: 'Détail de la VitraHaus : deux pignons vitrés en porte-à-faux se découpent sur le ciel.',
    credit: CREDIT,
    date: DATE,
    original: '20260916_093521.jpg',
    treatment: 'Détail recadré dans la photographie d’origine.',
    rights: RIGHTS,
  },
  'slide-tower': {
    id: 'slide-tower',
    building: 'Vitra Slide Tower',
    alt: 'La Vitra Slide Tower vue en contre-plongée : trois poteaux obliques, escaliers, plateforme vitrée, horloge circulaire au sommet et toboggan en spirale.',
    credit: CREDIT,
    date: DATE,
    original: '20260916_100053.jpg',
    treatment: 'Aucun recadrage à la source.',
    rights: RIGHTS,
  },
  dome: {
    id: 'dome',
    building: 'Dome',
    alt: 'Le Dome de Buckminster Fuller : coupole géodésique à tubes d’aluminium tendue d’une toile blanche, sur une pelouse, un arbre devant.',
    credit: CREDIT,
    date: DATE,
    original: '20260916_113210.jpg',
    treatment: 'Aucun recadrage à la source.',
    rights: RIGHTS,
  },
  'dome-detail': {
    id: 'dome-detail',
    building: 'Dome (détail)',
    alt: 'Détail du Dome : la trame triangulée des tubes d’aluminium dessine des lignes sur la toile blanche.',
    credit: CREDIT,
    date: DATE,
    original: '20260916_113210.jpg',
    treatment: 'Détail recadré dans la photographie d’origine.',
    rights: RIGHTS,
  },
};
