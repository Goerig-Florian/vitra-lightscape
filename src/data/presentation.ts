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
}

/**
 * Les trois mockups de la station « Les reels », dans l'ordre : deux Instagram, un TikTok.
 * `video` : chemin de la vidéo dans public/ (laisser vide tant que le reel n'est pas tourné : l'emplacement reste vide).
 */
export const reels = [
  { platform: 'instagram', label: 'Reel Instagram n° 1', sub: 'Teaser : Vitra devient Vitra Lightscape', video: 'reel/teaser-14s-son-720x1280.mp4', poster: 'reel/teaser-14s-poster.jpg' },
  { platform: 'instagram', label: 'Reel Instagram n° 2', sub: 'À venir' },
  { platform: 'tiktok', label: 'TikTok', sub: 'À venir' },
] as { platform: 'instagram' | 'tiktok'; label: string; sub: string; video?: string; poster?: string }[];

export const presentation = {
  label: 'Présentation du projet',
  title: 'Du Campus à la campagne : un seul fil de lumière.',
  text: 'Le parcours relie des bâtiments. Notre campagne relie des visuels. Suivez le chemin, de l’affiche jusqu’au site.',
  stations: [
    { id: 'affiche', label: 'Affiche', title: 'L’affiche', text: 'Le premier signal dans la rue : une façade qui s’allume, une promesse en une image.', ratio: '3 / 4', format: 'Affiche · portrait', posters: true },
    { id: 'reels', label: 'Reels', title: 'Les reels', text: 'Quelques secondes de nuit qui tombe, pour donner envie de venir voir en vrai.', ratio: '9 / 16', format: 'Reel · 9:16', reels: true },
    { id: 'carte', label: 'Carte à gagner', title: 'La carte à gagner', text: 'Un objet à glisser dans la poche : on la reçoit, on la découvre, on tente sa chance.', ratio: '16 / 10', format: 'Carte · paysage' },
    { id: 'magazine', label: 'Magazine', title: 'Le magazine', text: 'Le temps long : le récit du Campus, de son architecture et de la lumière qui la révèle.', ratio: '4 / 3', format: 'Magazine · double page' },
    { id: 'site', label: 'Site web', title: 'Le site', text: 'L’arrivée du chemin : le parcours, la soirée et la billetterie, tout au même endroit.', ratio: '16 / 10', format: 'Site · écran' },
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
