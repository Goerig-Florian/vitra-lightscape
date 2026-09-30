/**
 * Bâtiments présentés dans le catalogue.
 * Architectes et dates vérifiés sur les pages officielles de Vitra (lien `source`),
 * consultées le 30 septembre 2026.
 *
 * `layout` pilote la composition du catalogue (voir .catalogue dans sections.css).
 * `position` : cadrage de la photo (object-position) sur mobile.
 */

export interface Building {
  n: string;
  name: string;
  author: string;
  year: string;
  note: string;
  photo: string;
  layout: 'wide' | 'tall' | 'offset' | 'band';
  position: string;
  source: string;
}

export const buildings: Building[] = [
  {
    n: '01',
    name: 'VitraHaus',
    author: 'Herzog & de Meuron',
    year: '2010',
    note: 'Douze maisons à pignon, empilées et croisées : la silhouette la plus simple d’une maison, démultipliée.',
    photo: 'vitrahaus',
    layout: 'wide',
    position: '32% 50%',
    source: 'https://www.vitra.com/fr-fr/campus/architecture/architecture-vitrahaus',
  },
  {
    n: '02',
    name: 'Vitra Slide Tower',
    author: 'Carsten Höller, artiste',
    year: '2014',
    note: 'Une tour d’observation de 30,7 mètres dont on redescend par un toboggan en spirale : la ligne devient mouvement.',
    photo: 'slide-tower',
    layout: 'tall',
    position: '55% 30%',
    source: 'https://www.vitra.com/en-un/campus/architecture/architecture-vitra-slide-tower',
  },
  {
    n: '03',
    name: 'Vitra Design Museum',
    author: 'Frank Gehry',
    year: '1989',
    note: 'Tours, rampes et cubes blancs s’emboîtent ; chaque courbe reçoit la lumière à sa manière.',
    photo: 'design-museum',
    layout: 'offset',
    position: '58% 45%',
    source: 'https://www.vitra.com/en-un/campus/architecture/architecture-vitra-design-museum',
  },
  {
    n: '04',
    name: 'Dome',
    author: 'R. Buckminster Fuller, avec Thomas C. Howard',
    year: '1975 — sur le Campus depuis 2000',
    note: 'Une trame géodésique de tubes d’aluminium : la structure dessine elle-même le volume.',
    photo: 'dome',
    layout: 'band',
    position: '38% 55%',
    source: 'https://www.vitra.com/en-un/campus/architecture/architecture-dome',
  },
];
