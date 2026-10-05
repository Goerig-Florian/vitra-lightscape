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
  meta: ['Vitra Campus, Weil am Rhein', '17 & 18 septembre 2027 · 19h00 – 23h00'],
  title: 'Vitra, sous une autre lumière.',
  primary: 'Réserver',
  secondary: 'Découvrir le parcours',
  teaserNote: 'Un aperçu de la soirée · visualisation de projet',
  videoLabel: 'Vidéo d’ambiance : le Vitra Design Museum de Frank Gehry passe du jour au coucher de soleil, puis à la nuit, où la lumière dessine sa silhouette.',
};

export const lumiere = {
  label: 'La lumière',
  title: 'La nuit, la lumière dessine ce que les architectes ont voulu dire.',
  text: 'Des images de lumière se posent sur les façades du Campus et révèlent les lignes, les volumes et les matières de chaque bâtiment.',
  items: [
    { title: 'Elle souligne', text: 'Sur les façades, la lumière trace les lignes et les volumes.' },
    { title: 'Elle s’allume du dedans', text: 'Les vitrages, les toiles et les ouvertures deviennent des lanternes.' },
    { title: 'Elle répond à vos pas', text: 'Ailleurs, on s’approche, on marche, on touche : le bâtiment réagit.' },
  ],
  torch: {
    hint: 'Passez la lumière sur la façade',
    hintTouch: 'Glissez le doigt sur la façade',
    label: 'Aperçu : une façade du Campus s’illumine sous un faisceau de lumière, là où l’on passe la souris ou le doigt.',
    note: 'Visualisation de projet. Un seul exemple : le reste se découvre sur place.',
  },
};

export const soiree = {
  label: 'Votre soirée',
  title: 'Les 17 et 18 septembre 2027, de 19h00 à 23h00.',
  text: 'Une soirée qui accompagne la disparition progressive de la lumière naturelle pour révéler autrement l’architecture du Vitra Campus.',
  programme: [
    { time: '19h00', text: 'Ouverture du site' },
    { time: '19h15 – 19h45', text: 'Animations famille, découverte, premières lumières' },
    { time: 'Vers 19h35', text: 'Coucher du soleil', sun: true },
    { time: '20h00', text: 'Montée des projections', key: true },
    { time: '20h15 – 22h15', text: 'Coeur de Vitra Lightscape', key: true },
    { time: '22h15 – 23h00', text: 'Ambiance plus spectaculaire, fin de parcours' },
    { time: '23h00', text: 'Fermeture' },
  ],
  secret: 'Chaque bâtiment a sa propre écriture lumineuse. Elle se découvre sur place.',
  cta: 'Réserver ma soirée',
  caption: 'Visualisation de projet : le Vitra Design Museum, un soir de parcours.',
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
  nightCredit: 'Visualisation de nuit, projet',
  nightNote: 'Les vues de nuit sont des visualisations de projet, pas des photographies d’une installation existante.',
  source: { label: 'Liste des bâtiments : vitra.com', href: 'https://www.vitra.com/fr-fr/campus/architecture' },
  carte: { label: 'Carte du Campus : vitra.com', href: 'https://www.vitra.com/fr-fr/campus' },
  osm: { label: '(c) contributeurs OpenStreetMap', href: 'https://www.openstreetmap.org/copyright' },
};

export const infos = {
  label: 'Infos pratiques',
  rows: [
    { term: 'Lieu', value: 'Vitra Campus\nCharles-Eames-Strasse 2\n79576 Weil am Rhein, Allemagne' },
    { term: 'Dates', value: 'Vendredi 17 et samedi 18\nseptembre 2027' },
    { term: 'Horaires', value: 'De 19h00 à 23h00\n(entrées échelonnées, provisoire)' },
    { term: 'Accessibilité', value: 'À préciser avec le Campus' },
  ],
  visit: { label: 'Préparer sa venue sur vitra.com', href: 'https://www.vitra.com/fr-fr/campus' },
};

export const footer = {
  mention: 'Projet étudiant BUT MMI, proposition pour le Vitra Campus. Site de présentation, non officiel.',
};
