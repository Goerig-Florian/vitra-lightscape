/**
 * Textes du site. Modifiez ce fichier pour changer les contenus
 * sans toucher aux composants.
 */

export const nav = [
  { href: '#experience', label: 'L’expérience' },
  { href: '#visualisations', label: 'Visualisations' },
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

export const experience = {
  label: 'L’expérience',
  statement: 'Une soirée pour voir le Campus comme ses architectes l’ont pensé.',
  pathTitle: 'Un chemin lumineux',
  pathText: 'Un tracé de lumière relie les bâtiments et guide la visite, d’une œuvre à l’autre, sans plan à consulter.',
};

export const visualisations = {
  label: 'Premières visualisations',
  title: 'Quatre essais, avant la nuit.',
  text: 'Nos premiers tests de mise en lumière, réalisés à partir de nos photos de visite. Chaque bâtiment du Campus aura sa propre écriture lumineuse.',
  notice: 'Visualisations de projet, pas des photographies d’une installation existante.',
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
  text: 'Trente et une architectures et œuvres, reliées par un chemin lumineux. Filtrez par type de mise en lumière.',
  notice: 'Tracé schématique. L’ordre du parcours et le mode de mise en lumière de chaque bâtiment sont des propositions, à concevoir avec le Campus.',
  source: { label: 'Liste des bâtiments : vitra.com', href: 'https://www.vitra.com/fr-fr/campus/architecture' },
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
