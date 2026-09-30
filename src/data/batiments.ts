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
  /** Identifiant partagé avec src/data/plan.json (position sur le plan) */
  id: string;
  name: string;
  author: string;
  year: string;
  modes: Mode[];
}

/**
 * Dans l'ORDRE DU PARCOURS (proposition) : départ du parking visiteurs,
 * VitraHaus, musées, halles de production, Schaudepot et caserne, retour
 * par l'Álvaro-Siza-Promenade et le jardin Oudolf. Voir README.md.
 */
export const batiments: Batiment[] = [
  { id: 'vitrahaus', name: 'VitraHaus', author: 'Herzog & de Meuron', year: '2010', modes: ['facade', 'interieur'] },
  { id: 'ring-ruisseau', name: 'Ring et Ruisseau', author: 'Ronan & Erwan Bouroullec', year: '2018', modes: ['interactif'] },
  { id: 'airstream', name: 'Airstream Kiosk', author: '', year: '1968 / 2011', modes: ['interieur'] },
  { id: 'arret-bus', name: 'Arrêt de bus', author: 'Jasper Morrison', year: '2006', modes: ['interieur'] },
  { id: 'campus-gallery', name: 'Vitra Campus Gallery', author: 'Frank Gehry', year: '2003', modes: ['facade'] },
  { id: 'water-garden', name: 'Water Garden', author: 'Bas Smets', year: '2026', modes: ['interactif'] },
  { id: 'design-museum', name: 'Vitra Design Museum', author: 'Frank Gehry', year: '1989', modes: ['facade'] },
  { id: 'balancing-tools', name: 'Balancing Tools', author: 'Claes Oldenburg & Coosje van Bruggen', year: '1984', modes: ['facade'] },
  { id: 'pavillon-ando', name: 'Pavillon de conférences', author: 'Tadao Ando', year: '1993', modes: ['facade'] },
  { id: 'doshi', name: 'Doshi Retreat', author: 'Balkrishna Doshi, Khushnu Panthaki Hoof, Sönke Hoof', year: '2025', modes: ['interactif'] },
  { id: 'halle-gehry', name: 'Halle de production', author: 'Frank Gehry', year: '1989', modes: ['facade'] },
  { id: 'halle-grimshaw-1981', name: 'Halle de production', author: 'Nicholas Grimshaw', year: '1981', modes: ['facade'] },
  { id: 'halle-sanaa', name: 'Halle de production', author: 'SANAA', year: '2012', modes: ['facade'] },
  { id: 'halle-grimshaw-1983', name: 'Halle de production', author: 'Nicholas Grimshaw', year: '1983', modes: ['facade'] },
  { id: 'schaudepot', name: 'Vitra Schaudepot', author: 'Herzog & de Meuron', year: '2016', modes: ['facade'] },
  { id: 'barragan', name: 'Barragán Gallery', author: 'Vitra Schaudepot', year: '2022', modes: ['interieur'] },
  { id: 'place-prouve', name: 'Place Jean Prouvé', author: 'Vitra Campus', year: '2022', modes: ['interactif'] },
  { id: 'caserne', name: 'Caserne de pompiers', author: 'Zaha Hadid', year: '1993', modes: ['facade', 'interactif'] },
  { id: 'designweg', name: 'Vitra Designweg', author: 'Ronan & Erwan Bouroullec', year: '2021', modes: ['interactif'] },
  { id: 'torre', name: 'Torre Numero Due', author: 'Nathalie Du Pasquier', year: '2021', modes: ['facade'] },
  { id: 'halle-siza', name: 'Halle de production', author: 'Álvaro Siza', year: '1994', modes: ['facade'] },
  { id: 'promenade-siza', name: 'Álvaro-Siza-Promenade', author: 'Álvaro Siza', year: '2014', modes: ['interactif'] },
  { id: 'tour-toboggan', name: 'Vitra Tour-Toboggan', author: 'Carsten Höller', year: '2014', modes: ['facade', 'interactif'] },
  { id: 'khudi-bari', name: 'Khudi Bari', author: 'Marina Tabassum', year: '2024', modes: ['interieur'] },
  { id: 'diogene', name: 'Diogene', author: 'Renzo Piano', year: '2013', modes: ['interieur'] },
  { id: 'umbrella', name: 'Umbrella House', author: 'Kazuo Shinohara', year: '1961 / 2022', modes: ['interieur'] },
  { id: 'station-service', name: 'Station-service', author: 'Jean Prouvé', year: 'ca. 1953 / 2003', modes: ['interieur'] },
  { id: 'dome', name: 'Dôme', author: 'Richard Buckminster Fuller', year: '1975 / 2000', modes: ['interieur'] },
  { id: 'tane', name: 'Tane Garden House', author: 'Tsuyoshi Tane', year: '2023', modes: ['interieur'] },
  { id: 'oudolf', name: 'Oudolf Garten', author: 'Piet Oudolf', year: '2020', modes: ['interactif'] },
  { id: 'blockhaus', name: 'Blockhaus', author: 'Thomas Schütte', year: '2018', modes: ['interieur'] },
];

/** Tracé du mapping sur l'image finale de la vidéo (coordonnées de l'image 1672 × 941) */
export const museeSilhouette: [number, number][] = [
  [632, 545], [640, 470], [682, 445], [682, 338], [760, 335], [772, 314], [872, 322],
  [922, 330], [912, 362], [962, 365], [1016, 378], [1016, 336], [1050, 326], [1148, 322],
  [1150, 432], [1205, 446], [1315, 430], [1305, 470], [1232, 492], [1232, 578],
];
