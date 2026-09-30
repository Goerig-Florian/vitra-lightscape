/**
 * Textes du site et informations pratiques.
 * Modifiez ce fichier pour mettre à jour le contenu sans toucher aux composants.
 */

export const nav = [
  { href: '#concept', label: 'Concept' },
  { href: '#batiments', label: 'Bâtiments' },
  { href: '#experience', label: 'Aperçu' },
  { href: '#infos', label: 'Infos pratiques' },
];

export const hero = {
  kicker: 'Vitra Campus — Weil am Rhein',
  titleStart: 'Vitra, sous une',
  titleAccent: 'autre lumière.',
  lead: 'Une invitation à découvrir les lignes, les matières et l’architecture du Campus autrement.',
  cta: 'Découvrir l’expérience',
};

export const concept = {
  label: 'Le concept',
  statement:
    'Vitra Lightscape imagine une expérience où la lumière devient une porte d’entrée vers l’architecture.',
  follow: 'Elle attire le regard sur les formes du Campus et invite à découvrir ce qu’elles racontent.',
  audienceTitle: 'Pour qui',
  audience:
    'Pour celles et ceux qui ne connaissent pas forcément le design ou l’architecture, et cherchent une sortie culturelle à partager.',
};

export const catalogue = {
  label: 'Points de découverte',
  title: 'Quatre bâtiments à regarder autrement',
  intro:
    'Des repères pour parcourir le Campus et reconnaître ses architectures. Le périmètre de l’installation lumineuse n’est pas encore défini.',
};

export const apercu = {
  label: 'Aperçu',
  title: 'Suivre une ligne, et voir le bâtiment autrement.',
  steps: [
    { key: 'jour', title: 'Le jour', text: 'La façade telle qu’on la découvre en visite.' },
    { key: 'ombre', title: 'L’ombre', text: 'Les détails s’effacent, les volumes restent.' },
    { key: 'ligne', title: 'La ligne', text: 'Une lumière suit les pignons ; le regard la suit.' },
  ],
  disclaimer:
    'Simulation graphique superposée à une photographie de visite de la VitraHaus. Il s’agit d’une intention de scénographie, pas d’une installation existante.',
};

export const infos = {
  label: 'Infos pratiques',
  status: 'Programme à venir',
  statusNote:
    'Aucune réservation n’est ouverte pour le moment. Les informations seront publiées ici dès leur validation.',
  rows: [
    { term: 'Lieu', value: 'Vitra Campus, Weil am Rhein (Allemagne)', pending: false },
    { term: 'Dates', value: 'À confirmer', pending: true },
    { term: 'Horaires', value: 'À venir', pending: true },
    { term: 'Tarifs', value: 'À confirmer', pending: true },
    { term: 'Accès et accessibilité', value: 'À préciser', pending: true },
  ],
  visit: {
    text: 'Le Campus se visite déjà : horaires et accès actuels sur le site officiel.',
    href: 'https://www.vitra.com/fr-fr/campus',
    label: 'Visiter le Campus — vitra.com',
  },
};

export const coda = {
  line: 'Regarder autrement ce qui était déjà là.',
  top: 'Revenir au début',
  mention: 'Projet étudiant — proposition de concept pour le Vitra Campus.',
  disclaimer: 'BUT MMI. Ce site n’est pas un site officiel de Vitra.',
};
