/**
 * Cartes « Lightscape » de la page de présentation : le bâtiment de jour se transforme en sa version mapping.
 *
 * Les fichiers sont dans public/photos/ :
 *   <id>.webp          photo de jour
 *   <id>-mapping.png   visualisation mapping
 * (<id>-nuit.webp existe mais n'est PAS utilisée pour cet effet.)
 *
 * Une carte n'existe que si les DEUX fichiers sont présents : les bâtiments sans -mapping.png sont ignorés.
 * Par défaut la liste est détectée automatiquement, dans l'ordre du parcours. Pour imposer une liste, remplir `MANUEL`.
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { batiments, modes } from './batiments';

/** Nombre maximum de cartes affichées */
export const MAX_CARTES = 10;

/** Liste explicite d'identifiants (laisser vide pour la détection automatique) */
const MANUEL: string[] = [];

/**
 * Textes du classeur, par identifiant : une ou deux phrases sur le bâtiment, à écrire par l'équipe.
 * Ces textes d'architecture sont une première rédaction de l'équipe, à relire. Sans texte propre, le livre affiche le type de mise en lumière envisagé.
 */
export const textes: Record<string, string> = {
  vitrahaus:
    'Douze maisons en forme de pignon, empilées et croisées, composent une seule grande silhouette. Les extrémités vitrées de chaque « maison » ouvrent de larges vues sur le paysage.',
  airstream:
    'Une caravane Airstream de 1968, à la coque d’aluminium poli, transformée en kiosque en 2011. Sa forme arrondie et brillante reflète tout ce qui l’entoure.',
  'arret-bus':
    'Un abri d’une grande simplicité, dessiné par Jasper Morrison en 2006 : un petit volume aux parois transparentes qui se fond dans le paysage.',
  'water-garden':
    'Le paysagiste Bas Smets met l’eau au centre du jardin : on marche autour, on s’y reflète, et les bâtiments voisins s’y dédoublent.',
  'design-museum':
    'Premier bâtiment de Frank Gehry en Europe : des volumes blancs qui s’inclinent et se heurtent, sous des toits en zinc-titane. L’architecture ressemble à une sculpture.',
  'balancing-tools':
    'Cette sculpture géante transforme des outils du quotidien en monument : pince et marteau tiennent en équilibre près de l’entrée du site.',
  'pavillon-ando':
    'Premier bâtiment de Tadao Ando hors du Japon : du béton lisse, des formes géométriques simples et une partie enterrée dans le sol, pour une architecture calme.',
  umbrella:
    'Cette maison japonaise de 1961 a été reconstruite sur le Campus en 2022. Son grand toit, qui rappelle un parapluie, lui donne son nom.',
  'station-service':
    'Jean Prouvé, ingénieur et constructeur, a conçu cette station-service vers 1953. Légère et préfabriquée, elle a été remontée sur le Campus en 2003.',
  oudolf:
    'Piet Oudolf a dessiné ce jardin en 2020 : graminées et vivaces plantées en larges masses, dont les couleurs changent au fil des saisons.',
};

/** Réglages de l'effet (voir LightscapeGallery.astro) */
export const reglages = {
  /** Inclinaison maximale en degrés (0 = carte à plat) */
  tilt: 12,
  /** Largeur de la zone où l'image bascule du jour au mapping, en part de la carte (0,05 = net, 0,5 = très fondu) */
  reveal: 0.18,
};

export interface CarteLightscape {
  id: string;
  name: string;
  author: string;
  year: string;
  /** Numéro dans le parcours (« 07 ») sur le total */
  n: string;
  total: number;
  /** Type de mise en lumière envisagé (proposition) */
  mode: string;
  text: string;
  jour: string;
  mapping: string;
}

const dossier = join(process.cwd(), 'public', 'photos');
const present = (f: string) => existsSync(join(dossier, f));
const rang = (id: string) => {
  const i = batiments.findIndex((b) => b.id === id);
  return i < 0 ? 999 : i;
};

export function cartes(): CarteLightscape[] {
  const ids = MANUEL.length
    ? MANUEL
    : readdirSync(dossier)
        .filter((f) => f.endsWith('-mapping.png'))
        .map((f) => f.slice(0, -'-mapping.png'.length))
        .sort((a, b) => rang(a) - rang(b));

  return ids
    .filter((id) => present(`${id}.webp`) && present(`${id}-mapping.png`))
    .slice(0, MAX_CARTES)
    .map((id) => {
      const b = batiments.find((x) => x.id === id);
      const m = modes[b?.modes[0] ?? 'facade'];
      return {
        id,
        name: b?.name ?? id,
        author: b?.author ?? '',
        year: b?.year ?? '',
        n: String(Math.max(0, rang(id)) + 1).padStart(2, '0'),
        total: batiments.length,
        mode: m.label,
        text: textes[id] ?? m.text,
        jour: `photos/${id}.webp`,
        mapping: `photos/${id}-mapping.png`,
      };
    });
}

/** Mots simples pour les enfants, par type de mise en lumière (le texte propre à un bâtiment passe avant : `textes`) */
const enfants = {
  facade: 'Sa façade s’illumine de grands dessins de lumière.',
  interieur: 'Il s’allume de l’intérieur, comme une énorme lanterne.',
  interactif: 'Approche-toi : la lumière réagit à tes pas !',
};

export interface EmplacementClasseur {
  id: string;
  /** Numéro dans le parcours, « 07 » */
  n: string;
  name: string;
  author: string;
  year: string;
  text: string;
  /** La carte existe-t-elle déjà ? (photo de jour et mapping présents) */
  carte: boolean;
  jour: string;
  mapping: string;
}

/** Un emplacement par bâtiment, dans l'ordre du parcours : la carte est rangée si elle existe, sinon la pochette reste vide */
export function classeur(): EmplacementClasseur[] {
  return batiments.map((b, i) => ({
    id: b.id,
    n: String(i + 1).padStart(2, '0'),
    name: b.name,
    author: b.author,
    year: b.year,
    text: textes[b.id] ?? enfants[b.modes[0] ?? 'facade'],
    carte: present(`${b.id}.webp`) && present(`${b.id}-mapping.png`),
    jour: `photos/${b.id}.webp`,
    mapping: `photos/${b.id}-mapping.png`,
  }));
}
