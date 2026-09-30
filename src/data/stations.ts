/**
 * Stations du parcours : un bâtiment, une paire de photos jour / nuit, un mapping.
 *
 * Informations vérifiées sur les fiches architecture de vitra.com
 * (consultées le 30 septembre 2026, lien `source`).
 *
 * `traces` : tracés du mapping, en pixels de la visualisation de nuit
 * (1672 × 941, ou 941 × 1672 pour la Slide Tower). Pour les ajuster, ouvrez
 * la photo de nuit dans un logiciel d'image et relevez les coordonnées.
 */

type Point = [number, number];

export interface Station {
  id: string;
  n: string;
  name: string;
  author: string;
  year: string;
  intent: string;
  mapping: string;
  image: string; // préfixe : <image>-jour / <image>-nuit
  width: number;
  height: number;
  kind: 'lines' | 'sweep' | 'run';
  traces: Point[][];
  nodes?: Point[];
  alt: { day: string; night: string };
  source: string;
}

export const stations: Station[] = [
  {
    id: 'vitrahaus',
    n: '01',
    name: 'VitraHaus',
    author: 'Herzog & de Meuron',
    year: '2010',
    intent:
      'Les architectes partent de la forme la plus simple qui soit : la maison à toit en pente. Ils l’allongent, l’empilent et la croisent. Douze maisons superposées, dont les pignons vitrés s’ouvrent sur le paysage.',
    mapping:
      'La lumière redessine chaque pignon, l’un après l’autre. Dans l’empilement, on lit enfin la maison archétypale.',
    image: 'vitrahaus',
    width: 1672,
    height: 941,
    kind: 'lines',
    traces: [
      [[500, 232], [500, 136], [648, 38], [797, 136], [797, 282]],
      [[905, 350], [905, 188], [1018, 160], [1128, 272], [1141, 400]],
      [[412, 556], [415, 380], [502, 226], [598, 240], [593, 522]],
      [[323, 598], [331, 518], [366, 462], [408, 470]],
    ],
    alt: {
      day: 'La VitraHaus en journée : maisons à pignon grises empilées et décalées, façades pignon vitrées, jardin au premier plan.',
      night: 'Visualisation de nuit de la VitraHaus : les pignons vitrés sont éclairés de l’intérieur sous un ciel bleu nuit.',
    },
    source: 'https://www.vitra.com/fr-fr/campus/architecture/architecture-vitrahaus',
  },
  {
    id: 'dome',
    n: '02',
    name: 'Dome',
    author: 'R. Buckminster Fuller, avec Thomas C. Howard',
    year: '1975, sur le Campus depuis 2000',
    intent:
      'Fuller cherche une structure légère, rapide à monter et à démonter : des tubes d’aluminium assemblés, dont la géométrie géodésique fait toute la solidité.',
    mapping:
      'La lumière parcourt la trame d’un nœud à l’autre. La structure devient le dessin.',
    image: 'dome',
    width: 1672,
    height: 941,
    kind: 'lines',
    traces: [
      [[355, 432], [478, 440], [606, 437], [770, 437], [900, 440]],
      [[480, 600], [606, 437], [655, 605], [770, 437], [860, 608]],
      [[478, 440], [518, 340], [606, 437], [725, 312], [770, 437]],
      [[518, 340], [680, 270], [725, 312], [836, 262]],
      [[680, 270], [800, 245], [836, 262]],
    ],
    nodes: [
      [355, 432], [478, 440], [606, 437], [770, 437], [518, 340], [725, 312],
      [680, 270], [800, 245], [480, 600], [655, 605], [860, 608],
    ],
    alt: {
      day: 'Le Dome de Buckminster Fuller en journée : coupole géodésique en tubes d’aluminium tendue d’une toile blanche, un arbre devant.',
      night: 'Visualisation de nuit du Dome : la toile est éclairée de l’intérieur et laisse apparaître la trame triangulée.',
    },
    source: 'https://www.vitra.com/en-un/campus/architecture/architecture-dome',
  },
  {
    id: 'design-museum',
    n: '03',
    name: 'Vitra Design Museum',
    author: 'Frank Gehry',
    year: '1989',
    intent:
      'Un manifeste du déconstructivisme : un collage de tours, de rampes et de cubes. Des formes expressives, mais dictées par l’usage : la lumière du jour entre par de grandes verrières.',
    mapping:
      'Une vague de lumière glisse sur les volumes blancs et remet en mouvement ce collage figé.',
    image: 'design-museum',
    width: 1672,
    height: 941,
    kind: 'sweep',
    traces: [
      [
        [632, 545], [640, 470], [682, 445], [682, 338], [760, 335], [772, 314], [872, 322],
        [922, 330], [912, 362], [962, 365], [1016, 378], [1016, 336], [1050, 326], [1148, 322],
        [1150, 432], [1205, 446], [1315, 430], [1305, 470], [1232, 492], [1232, 578],
      ],
    ],
    alt: {
      day: 'Le Vitra Design Museum de Frank Gehry en journée : volumes blancs torsadés et toitures en zinc, reflétés dans un bassin.',
      night: 'Visualisation de nuit du Vitra Design Museum : les façades blanches sont éclairées depuis le sol et se reflètent dans l’eau.',
    },
    source: 'https://www.vitra.com/en-un/campus/architecture/architecture-vitra-design-museum',
  },
  {
    id: 'slide-tower',
    n: '04',
    name: 'Vitra Slide Tower',
    author: 'Carsten Höller, artiste',
    year: '2014',
    intent:
      'Entre art, architecture et jeu : une tour d’observation de 30,7 mètres. On monte par l’escalier pour regarder le Campus, on redescend par un toboggan en spirale de 38 mètres.',
    mapping:
      'Un trait de lumière descend la spirale et rejoue, en boucle, la trajectoire du visiteur.',
    image: 'slide-tower',
    width: 941,
    height: 1672,
    kind: 'run',
    traces: [
      [
        [585, 525], [660, 540], [690, 590], [660, 650], [580, 685], [555, 700], [640, 720],
        [715, 760], [720, 820], [660, 870], [560, 905], [525, 935], [560, 965], [680, 1010],
        [760, 1060], [770, 1100], [730, 1140], [640, 1180], [545, 1230], [495, 1280],
        [470, 1320], [440, 1355],
      ],
    ],
    alt: {
      day: 'La Vitra Slide Tower en journée, en contre-plongée : poteaux obliques, escaliers, plateforme vitrée, horloge et toboggan en spirale.',
      night: 'Visualisation de nuit de la Vitra Slide Tower : la plateforme est éclairée, le toboggan en inox brille sous les projecteurs.',
    },
    source: 'https://www.vitra.com/en-un/campus/architecture/architecture-vitra-slide-tower',
  },
];

/** Arrêts du chemin lumineux (plan schématique) */
export const stops = [
  { n: '01', name: 'VitraHaus', author: 'Herzog & de Meuron', x: 150, y: 330 },
  { n: '02', name: 'Dome', author: 'R. Buckminster Fuller', x: 370, y: 170 },
  { n: '03', name: 'Vitra Design Museum', author: 'Frank Gehry', x: 600, y: 360 },
  { n: '04', name: 'Vitra Slide Tower', author: 'Carsten Höller', x: 830, y: 200 },
  {
    n: '05',
    name: 'Caserne de pompiers',
    author: 'Zaha Hadid, 1993 · station envisagée',
    x: 1050,
    y: 380,
  },
];

/** Construit l'attribut `points` d'une polyline SVG */
export const toPoints = (pts: Point[]) => pts.map((p) => p.join(',')).join(' ');
