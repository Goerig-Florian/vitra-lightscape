/**
 * Billetterie — exploitation et tarifs fixés par l'équipe pour l'appel d'offres.
 * Vitra Lightscape : du vendredi 3 septembre au dimanche 3 octobre 2027, 31 soirées consécutives, de 19h00 à 23h00.
 * Entrées toutes les 30 minutes entre 19h00 et 21h30 (les familles avec de jeunes enfants viennent plutôt à 19h00).
 * Le panier fonctionne dans le navigateur ; aucun paiement n'est branché.
 */

export const provisional = false;

export const notice =
  'Du vendredi 3 septembre au dimanche 3 octobre 2027, 31 soirées consécutives, de 19h00 à 23h00. Entrées toutes les 30 minutes entre 19h00 et 21h30 : les familles avec de jeunes enfants viennent plutôt à 19h00. Le paiement en ligne n’est pas encore branché.';

/** Soirées (format AAAA-MM-JJ) : du 3 septembre au 3 octobre 2027 inclus, soit 31 soirées */
export const dates: string[] = Array.from({ length: 31 }, (_, i) => {
  const d = new Date(Date.UTC(2027, 8, 3 + i));
  return d.toISOString().slice(0, 10);
});

/** Vendredi, samedi et dimanche : tarif « week-end ». Lundi au jeudi : tarif « semaine ». */
export const isWeekend = (iso: string) => {
  const j = new Date(`${iso}T12:00:00Z`).getUTCDay(); // 0 dimanche … 6 samedi
  return j === 5 || j === 6 || j === 0;
};

/** Créneaux d'entrée : toutes les 30 minutes de 19h00 à 21h30 (le site ferme à 23h00) */
export const slots = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

/**
 * Billets (prix en euros, TTC).
 * `prices.sem` : lundi au jeudi · `prices.we` : vendredi au dimanche.
 * `persons` : nombre de personnes couvertes (pour la limite du panier) ; `adult` : compte comme un adulte accompagnateur.
 */
export const tickets = [
  { id: 'plein', label: 'Adulte', detail: 'Plein tarif', prices: { sem: 24.9, we: 29.9 }, persons: 1, adult: true },
  { id: 'reduit', label: 'Réduit / étudiant', detail: 'Sur justificatif', prices: { sem: 19.9, we: 24.9 }, persons: 1, adult: true },
  { id: 'enfant', label: 'Enfant 6–14 ans', detail: 'Accompagné d’un adulte', prices: { sem: 11.9, we: 14.9 }, persons: 1, adult: false },
  { id: 'gratuit', label: 'Moins de 6 ans', detail: 'Gratuit, accompagné d’un adulte', prices: { sem: 0, we: 0 }, persons: 1, adult: false },
  { id: 'famille', label: 'Famille', detail: '2 adultes + jusqu’à 3 enfants', prices: { sem: 59.9, we: 69.9 }, persons: 5, adult: true },
];

export const maxPerType = 10;
