/**
 * Textes du site. Modifiez ce fichier pour changer les contenus
 * sans toucher aux composants.
 */

export const nav = [
  { href: '#experience', label: 'L’expérience' },
  { href: '#stations', label: 'Les bâtiments' },
  { href: '#parcours', label: 'Le parcours' },
  { href: '#billetterie', label: 'Billetterie' },
  { href: '#infos', label: 'Infos' },
];

export const hero = {
  meta: ['Vitra Campus, Weil am Rhein', 'Un parcours lumière, en soirée'],
  title: 'Vitra, sous une autre lumière.',
  lead: 'Quand la nuit tombe, la lumière révèle ce que les architectes ont voulu dire. Un parcours nocturne à travers le Vitra Campus, ponctué de mappings projetés sur ses bâtiments.',
  primary: 'Réserver',
  secondary: 'Suivre la lumière',
  caption: 'Vitra Design Museum, Frank Gehry, 1989. Photo de visite de l’équipe.',
};

export const experience = {
  label: 'L’expérience',
  statement: 'Une soirée pour voir le Campus comme ses architectes l’ont pensé.',
  items: [
    {
      n: '01',
      title: 'Des mappings sur les façades',
      text: 'Projetée sur les bâtiments, la lumière souligne leurs lignes, leurs volumes et leurs matières, et traduit en images l’intention de chaque architecte.',
    },
    {
      n: '02',
      title: 'Un chemin lumineux',
      text: 'Un tracé de lumière relie les bâtiments et guide la visite, de station en station, sans plan à consulter.',
    },
    {
      n: '03',
      title: 'Le Campus, une seconde fois',
      text: 'En complément de la visite de jour : on revient le soir pour découvrir les mêmes lieux autrement, seul, entre amis ou en famille.',
    },
  ],
};

export const dusk = {
  from: 18 * 60, // 18:00
  to: 21 * 60 + 30, // 21:30
  line: 'La nuit tombe sur le Campus.',
  sub: 'Continuez à faire défiler : la lumière prend le relais.',
};

export const stationsIntro = {
  label: 'Les bâtiments',
  title: 'Quatre stations, quatre intentions.',
  text: 'À chaque station, le bâtiment passe du jour à la nuit, puis la lumière dessine ce que l’architecte a voulu exprimer.',
  notice:
    'Les vues de nuit et les tracés lumineux sont des visualisations de projet réalisées à partir de nos photos de visite. Ils ne montrent pas une installation existante.',
};

export const parcours = {
  label: 'Le parcours',
  title: 'Suivez la lumière.',
  text: 'Un chemin lumineux relie les bâtiments et rythme la visite. On avance à son rythme, de station en station.',
  notice: 'Tracé schématique. L’ordre et le parcours définitifs restent à concevoir avec le Campus.',
};

export const infos = {
  label: 'Infos pratiques',
  rows: [
    {
      term: 'Lieu',
      value: 'Vitra Campus\nCharles-Eames-Straße 2\n79576 Weil am Rhein, Allemagne',
    },
    { term: 'Horaires', value: 'En soirée, entrées échelonnées\n(calendrier provisoire)' },
    { term: 'Durée', value: 'À préciser' },
    { term: 'Accessibilité', value: 'À préciser avec le Campus' },
  ],
  visit: { label: 'Préparer sa venue sur vitra.com', href: 'https://www.vitra.com/fr-fr/campus' },
};

export const footer = {
  mention:
    'Projet étudiant BUT MMI, proposition pour le Vitra Campus. Site de présentation, non officiel.',
};
