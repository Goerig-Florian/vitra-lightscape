/**
 * Les bâtiments et œuvres du Vitra Campus.
 * Noms, auteurs et dates : page « Architecture du Vitra Campus » de vitra.com
 * (https://www.vitra.com/fr-fr/campus/architecture), consultée le 30 septembre 2026.
 *
 * `modes` : type de mise en lumière envisagé. PROPOSITION À AFFINER avec l'équipe.
 *   facade     → mapping projeté sur les façades
 *   interieur  → bâtiment éclairé de l'intérieur
 *   interactif → installation qui réagit aux visiteurs
 */

export type Mode = 'facade' | 'interieur' | 'interactif';

export const modes: Record<Mode, { label: string; short: string; text: string }> = {
  facade: {
    label: 'Mapping sur les façades',
    short: 'Façade',
    text: 'Projetée sur les façades, la lumière souligne les lignes, les volumes et les matières, et traduit en images l’intention de l’architecte.',
  },
  interieur: {
    label: 'Éclairé de l’intérieur',
    short: 'Intérieur',
    text: 'Certains bâtiments s’allument du dedans : les vitrages, les toiles et les ouvertures deviennent des lanternes à l’échelle du Campus.',
  },
  interactif: {
    label: 'Installations interactives',
    short: 'Interactif',
    text: 'Ailleurs, la lumière répond aux visiteurs : on s’approche, on marche, on touche, et le bâtiment réagit.',
  },
};

export interface Batiment {
  name: string;
  author: string;
  year: string;
  modes: Mode[];
}

export const batiments: Batiment[] = [
  { name: 'VitraHaus', author: 'Herzog & de Meuron', year: '2010', modes: ['facade', 'interieur'] },
  { name: 'Vitra Design Museum', author: 'Frank Gehry', year: '1989', modes: ['facade'] },
  { name: 'Vitra Campus Gallery', author: 'Frank Gehry', year: '2003', modes: ['facade'] },
  { name: 'Halle de production', author: 'Frank Gehry', year: '1989', modes: ['facade'] },
  { name: 'Dôme', author: 'Richard Buckminster Fuller', year: '1975 / 2000', modes: ['interieur'] },
  { name: 'Airstream Kiosk', author: '', year: '1968 / 2011', modes: ['interieur'] },
  { name: 'Station-service', author: 'Jean Prouvé', year: 'ca. 1953 / 2003', modes: ['interieur'] },
  { name: 'Place Jean Prouvé', author: 'Vitra Campus', year: '2022', modes: ['interactif'] },
  { name: 'Vitra Schaudepot', author: 'Herzog & de Meuron', year: '2016', modes: ['facade'] },
  { name: 'Barragán Gallery', author: 'Vitra Schaudepot', year: '2022', modes: ['interieur'] },
  { name: 'Oudolf Garten', author: 'Piet Oudolf', year: '2020', modes: ['interactif'] },
  { name: 'Tane Garden House', author: 'Tsuyoshi Tane', year: '2023', modes: ['interieur'] },
  { name: 'Water Garden', author: 'Bas Smets', year: '2026', modes: ['interactif'] },
  { name: 'Khudi Bari', author: 'Marina Tabassum', year: '2024', modes: ['interieur'] },
  { name: 'Doshi Retreat', author: 'Balkrishna Doshi, Khushnu Panthaki Hoof, Sönke Hoof', year: '2025', modes: ['interactif'] },
  { name: 'Umbrella House', author: 'Kazuo Shinohara', year: '1961 / 2022', modes: ['interieur'] },
  { name: 'Diogene', author: 'Renzo Piano', year: '2013', modes: ['interieur'] },
  { name: 'Blockhaus', author: 'Thomas Schütte', year: '2018', modes: ['interieur'] },
  { name: 'Ring et Ruisseau', author: 'Ronan & Erwan Bouroullec', year: '2018', modes: ['interactif'] },
  { name: 'Vitra Designweg', author: 'Ronan & Erwan Bouroullec', year: '2021', modes: ['interactif'] },
  { name: 'Torre Numero Due', author: 'Nathalie Du Pasquier', year: '2021', modes: ['facade'] },
  { name: 'Pavillon de conférences', author: 'Tadao Ando', year: '1993', modes: ['facade'] },
  { name: 'Caserne de pompiers', author: 'Zaha Hadid', year: '1993', modes: ['facade', 'interactif'] },
  { name: 'Halle de production', author: 'Álvaro Siza', year: '1994', modes: ['facade'] },
  { name: 'Álvaro-Siza-Promenade', author: 'Álvaro Siza', year: '2014', modes: ['interactif'] },
  { name: 'Vitra Tour-Toboggan', author: 'Carsten Höller', year: '2014', modes: ['facade', 'interactif'] },
  { name: 'Balancing Tools', author: 'Claes Oldenburg & Coosje van Bruggen', year: '1984', modes: ['facade'] },
  { name: 'Halle de production', author: 'SANAA', year: '2012', modes: ['facade'] },
  { name: 'Halle de production', author: 'Nicholas Grimshaw', year: '1981', modes: ['facade'] },
  { name: 'Hall de production', author: 'Nicholas Grimshaw', year: '1983', modes: ['facade'] },
  { name: 'Arrêt de bus', author: 'Jasper Morrison', year: '2006', modes: ['interieur'] },
];

/** Premières visualisations (tests) : vues de nuit réalisées à partir de nos photos */
export const visualisations = [
  { image: 'vitrahaus-nuit', name: 'VitraHaus', author: 'Herzog & de Meuron, 2010', alt: 'Visualisation de nuit de la VitraHaus : pignons vitrés éclairés de l’intérieur sous un ciel bleu nuit.' },
  { image: 'dome-nuit', name: 'Dôme', author: 'R. Buckminster Fuller, 1975 / 2000', alt: 'Visualisation de nuit du Dôme : la toile éclairée de l’intérieur laisse apparaître la trame géodésique.' },
  { image: 'slide-tower-nuit', name: 'Vitra Tour-Toboggan', author: 'Carsten Höller, 2014', alt: 'Visualisation de nuit de la Vitra Tour-Toboggan : plateforme éclairée et toboggan en spirale sous les projecteurs.' },
  { image: 'design-museum-nuit', name: 'Vitra Design Museum', author: 'Frank Gehry, 1989', alt: 'Visualisation de nuit du Vitra Design Museum : façades blanches éclairées depuis le sol, reflétées dans le bassin.' },
];

/** Tracé du mapping sur l'image finale de la vidéo (coordonnées de l'image 1672 × 941) */
export const museeSilhouette: [number, number][] = [
  [632, 545], [640, 470], [682, 445], [682, 338], [760, 335], [772, 314], [872, 322],
  [922, 330], [912, 362], [962, 365], [1016, 378], [1016, 336], [1050, 326], [1148, 322],
  [1150, 432], [1205, 446], [1315, 430], [1305, 470], [1232, 492], [1232, 578],
];
