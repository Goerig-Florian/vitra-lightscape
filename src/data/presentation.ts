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
}

export const presentation = {
  label: 'Présentation du projet',
  title: 'Du Campus à la campagne : un seul fil de lumière.',
  text: 'Le parcours relie des bâtiments. Notre campagne relie des visuels. Suivez le chemin, de l’affiche jusqu’au site.',
  stations: [
    { id: 'affiche', label: 'Affiche', title: 'L’affiche', text: 'Le premier signal dans la rue : une façade qui s’allume, une promesse en une image.', ratio: '3 / 4', format: 'Affiche · portrait' },
    { id: 'reels', label: 'Reels', title: 'Les reels', text: 'Quelques secondes de nuit qui tombe, pour donner envie de venir voir en vrai.', ratio: '9 / 16', format: 'Reel · 9:16', link: { href: 'reel/', label: 'Voir le teaser et son mockup Instagram' } },
    { id: 'carte', label: 'Carte à gagner', title: 'La carte à gagner', text: 'Un objet à glisser dans la poche : on la reçoit, on la découvre, on tente sa chance.', ratio: '16 / 10', format: 'Carte · paysage' },
    { id: 'magazine', label: 'Magazine', title: 'Le magazine', text: 'Le temps long : le récit du Campus, de son architecture et de la lumière qui la révèle.', ratio: '4 / 3', format: 'Magazine · double page' },
    { id: 'site', label: 'Site web', title: 'Le site', text: 'L’arrivée du chemin : le parcours, la soirée et la billetterie, tout au même endroit.', ratio: '16 / 10', format: 'Site · écran' },
  ] as Station[],
};
