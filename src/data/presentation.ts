/**
 * Page de présentation du projet (interne, non destinée aux visiteurs).
 * Chaque « station » est un visuel de la campagne : on les relie par le chemin néon, comme les bâtiments du parcours.
 * Pour remplir un cadre : déposer l'image dans public/presentation/ et renseigner `image` (et `alt`).
 */
export interface Station {
  id: string;
  label: string;
  title: string;
  text: string;
  /** Format du cadre (largeur / hauteur), pour réserver la place avant l'arrivée de l'image */
  ratio: string;
  /** Format affiché dans le cadre vide */
  format: string;
  /** Chemin de l'image dans public/ (ex. 'presentation/affiche.webp') */
  image?: string;
  alt?: string;
  /** Lien interne (chemin dans public/ ou page) affiché sous le texte */
  link?: { href: string; label: string };
  /** Station des reels : trois mockups de téléphone alignés (voir `reels`) au lieu d'un cadre */
  reels?: boolean;
  /** Station des affiches : les affiches de `posters`, cliquables pour un affichage plein écran */
  posters?: boolean;
  /** Station des cartes : la galerie de cartes et le clip du booster (LightscapeGallery) */
  cards?: boolean;
}

/**
 * Les trois mockups de la station « Les reels », dans l'ordre : deux Instagram, un TikTok.
 * `video` : chemin de la vidéo dans public/ (laisser vide tant que le reel n'est pas tourné : l'emplacement reste vide).
 */
export const reels = [
  { platform: 'instagram', label: 'Reel Instagram n° 1', sub: 'Teaser : Vitra devient Vitra Lightscape', video: 'reel/teaser-14s-b-lights-720x1280.mp4', poster: 'reel/teaser-14s-b-poster.jpg' },
  { platform: 'instagram', label: 'Reel Instagram n° 2', sub: 'Trailer : découvrir, interagir, s’immerger', video: 'reel/trailer-23s-720x1280.mp4', poster: 'reel/trailer-23s-poster.jpg', caption: ['Découvrir. Interagir. S’immerger.', 'Vivre l’architecture dans la lumière.'], tags: '#Vitra #VitraLightscape', likes: '9,4 K', comments: '187', shares: '812', cadrage: '50% 50%' },
  { platform: 'tiktok', label: 'TikTok', sub: 'À venir' },
] as {
  platform: 'instagram' | 'tiktok';
  label: string;
  sub: string;
  video?: string;
  poster?: string;
  /** légende, mots-clés et compteurs du mockup (fictifs) ; sans valeur, ceux du teaser par défaut */
  caption?: string[];
  tags?: string;
  likes?: string;
  comments?: string;
  shares?: string;
  /** cadrage de la vidéo dans l'écran du téléphone (object-position) */
  cadrage?: string;
  /** ajustement de la vidéo dans l'écran : « cover » (remplit) ou « contain » (entière, avec des bandes) */
  ajuste?: 'cover' | 'contain';
}[];

export const presentation = {
  label: 'Présentation du projet',
  title: 'Du Campus à la campagne : un seul fil de lumière.',
  text: 'Le parcours relie des bâtiments. Notre campagne relie des visuels. Suivez le chemin, de l’affiche jusqu’aux cartes.',
  stations: [
    { id: 'affiche', label: 'Affiche', title: 'L’affiche', text: 'Le premier signal dans la rue : une façade qui s’allume, une promesse en une image.', ratio: '3 / 4', format: 'Affiche · portrait', posters: true },
    { id: 'reels', label: 'Reels', title: 'Les reels', text: 'Quelques secondes de nuit qui tombe, pour donner envie de venir voir en vrai.', ratio: '9 / 16', format: 'Reel · 9:16', reels: true },
    { id: 'cartes', label: 'Cartes à gagner', title: 'Les cartes à gagner', text: 'Le bâtiment se transforme en Vitra Lightscape. Inclinez une carte pour passer du jour à sa version mapping, glissez pour la faire tourner, cliquez pour la retourner.', ratio: '5 / 7', format: 'Cartes', cards: true },
  ] as Station[],
};

/** Les affiches de la campagne (format A, 905 x 1280) : même mise en page, un verbe par affiche. */
export const posters = [
  { src: 'presentation/affiche-ressentir.webp', title: 'Juste ressentir', sub: 'L’espace qui prend vie', alt: 'Affiche « Juste RESSENTIR, l’espace qui prend vie » : des nappes de lumière bleue, orange et jaune sur fond bleu nuit. Vitra Lightscape, 17 et 18 septembre 2027.' },
  { src: 'presentation/affiche-partager.webp', title: 'Juste partager', sub: 'La lumière qui rassemble', alt: 'Affiche « Juste PARTAGER, la lumière qui rassemble » : des silhouettes de visiteurs devant une lumière jaune et bleue. Vitra Lightscape, 17 et 18 septembre 2027.' },
  { src: 'presentation/affiche-explorer.webp', title: 'Juste explorer', sub: 'Le parcours qui se révèle', alt: 'Affiche « Juste EXPLORER, le parcours qui se révèle » : une silhouette en haut d’un grand escalier éclairé de lumière orange et bleue, reflété dans l’eau. Vitra Lightscape, 17 et 18 septembre 2027.' },
];

/** Les affiches en situation (mises en scène) : abribus, tram, couloir. `w` et `h` : dimensions du fichier. */
export const situations = [
  { src: 'presentation/situation-abribus.webp', w: 2000, h: 1780, title: 'Abribus', sub: 'L’affiche dans la rue', alt: 'Abribus en ville : l’affiche Vitra Lightscape « Suivez le chemin, découvrez le parcours lumineux » montre un bâtiment illuminé au bord d’un étang et un chemin de lumière.' },
  { src: 'presentation/situation-tram.webp', w: 2000, h: 1126, title: 'Tramway', sub: 'Habillage du tram, de nuit', alt: 'Tramway de nuit habillé aux couleurs de Vitra Lightscape : « Suivez le chemin vers une expérience unique », avec un bâtiment aux projections vertes et bleues et un trait de lumière bleu qui suit la carrosserie.' },
  { src: 'presentation/situation-couloir.webp', w: 2000, h: 1125, title: 'Couloir de gare', sub: 'Une campagne en cinq affiches', alt: 'Couloir de gare avec cinq affiches lumineuses qui se lisent en suivant le chemin : « Suivez le parcours lumineux », puis le logo Vitra Lightscape et « Vivez une expérience unique ».' },
];

/** Les pages de presse (mises en scène) : DNA et L'Alsace. Même plein écran que les affiches. */
export const presse = [
  { src: 'presentation/presse-dna.webp', w: 1055, h: 1491, title: 'Les Dernières Nouvelles d’Alsace', sub: 'Une du 16 septembre : le Campus change de visage', alt: 'Une de journal, DNA, mardi 16 septembre 2025 : « À Weil am Rhein, le Vitra Campus s’apprête à changer de visage à la nuit tombée », avec une photo des visiteurs sur le chemin éclairé, les infos pratiques et des cartes collector tenues à la main.' },
  { src: 'presentation/presse-alsace.webp', w: 1055, h: 1491, title: 'L’Alsace', sub: 'Une balade lumineuse en famille', alt: 'Page du journal L’Alsace : « Une balade lumineuse en famille pour redécouvrir le Vitra Campus », avec une famille qui marche vers le VitraHaus de nuit, quatre cartes collector et un encadré pratique.' },
];
