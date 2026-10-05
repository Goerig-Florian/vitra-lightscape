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
import { batiments } from './batiments';

/** Nombre maximum de cartes affichées */
export const MAX_CARTES = 10;

/** Liste explicite d'identifiants (laisser vide pour la détection automatique) */
const MANUEL: string[] = [];

/** Réglages de l'effet (voir LightscapeGallery.astro) */
export const reglages = {
  /** Inclinaison maximale en degrés (0 = pas de tilt) */
  tilt: 7,
  /** Taille maximale du cercle de révélation, en part de la diagonale de la carte (0 à 1,5) */
  reveal: 1,
};

export interface CarteLightscape {
  id: string;
  name: string;
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
    .map((id) => ({
      id,
      name: batiments.find((b) => b.id === id)?.name ?? id,
      jour: `photos/${id}.webp`,
      mapping: `photos/${id}-mapping.png`,
    }));
}
