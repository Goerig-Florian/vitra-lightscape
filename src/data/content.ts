/**
 * Textes du site. Modifiez ce fichier pour changer les contenus
 * sans toucher aux composants.
 */

export const nav = [
  { href: '#parcours', label: 'Le parcours' },
  { href: '#billetterie', label: 'Billetterie' },
  { href: '#infos', label: 'Infos' },
];

export const hero = {
  meta: ['Vitra Campus, Weil am Rhein', 'Un parcours lumière, en soirée'],
  title: 'Vitra, sous une autre lumière.',
  lead: 'Quand la nuit tombe, la lumière révèle ce que les architectes ont voulu dire. Un parcours nocturne à travers tout le Vitra Campus.',
  primary: 'Réserver',
  secondary: 'Découvrir le parcours',
  clockFrom: 18 * 60, // 18:00, début de la vidéo
  clockTo: 21 * 60 + 30, // 21:30, fin de la vidéo
  videoLabel: 'Vidéo d’ambiance : le Vitra Design Museum de Frank Gehry passe du jour au coucher de soleil, puis à la nuit, où la lumière dessine sa silhouette.',
};

export const dusk = {
  from: 19 * 60 + 30, // 19:30
  to: 21 * 60 + 30, // 21:30
  line: 'Le soleil se couche sur le Campus.',
  lineNight: 'La nuit tombe. La lumière prend le relais.',
};

export const parcours = {
  label: 'Le parcours',
  title: 'Tout le Campus, sous une autre lumière.',
  text: 'Une boucle à pied à travers tout le Vitra Campus, du parking visiteurs à la VitraHaus, des musées aux halles de production. Un chemin lumineux guide la visite. Touchez un repère pour découvrir le bâtiment.',
  notice: 'L’ordre du parcours et le mode de mise en lumière de chaque bâtiment sont des propositions, à affiner avec le Campus.',
  approx: 'Repère décalé de quelques mètres pour rester lisible.',
  walkNote: 'Durée de marche estimée à 4 km/h, hors arrêts. La durée totale de la soirée reste à préciser.',
  photoCredit: 'Photo : vitra.com',
  source: { label: 'Liste des bâtiments : vitra.com', href: 'https://www.vitra.com/fr-fr/campus/architecture' },
  carte: { label: 'Carte du Campus : vitra.com', href: 'https://www.vitra.com/fr-fr/campus' },
  osm: { label: '© contributeurs OpenStreetMap', href: 'https://www.openstreetmap.org/copyright' },
};

export const infos = {
  label: 'Infos pratiques',
  rows: [
    { term: 'Lieu', value: 'Vitra Campus\nCharles-Eames-Straße 2\n79576 Weil am Rhein, Allemagne' },
    { term: 'Horaires', value: 'En soirée, entrées échelonnées\n(calendrier provisoire)' },
    { term: 'Durée', value: 'À préciser' },
    { term: 'Accessibilité', value: 'À préciser avec le Campus' },
  ],
  visit: { label: 'Préparer sa venue sur vitra.com', href: 'https://www.vitra.com/fr-fr/campus' },
};

export const footer = {
  mention: 'Projet étudiant BUT MMI, proposition pour le Vitra Campus. Site de présentation, non officiel.',
};
