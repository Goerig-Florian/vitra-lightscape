/**
 * Billetterie — DONNÉES PROVISOIRES (proposition pour l'appel d'offres).
 * Dates, horaires et tarifs sont à valider avec le Vitra Campus.
 * Le panier fonctionne dans le navigateur ; aucun paiement n'est branché.
 */

export const provisional = true;

export const notice =
  'Calendrier et tarifs provisoires, proposés pour l’appel d’offres. Le paiement en ligne n’est pas encore branché.';

/** Soirées (format AAAA-MM-JJ) */
export const dates = [
  '2026-11-13', '2026-11-14',
  '2026-11-20', '2026-11-21',
  '2026-11-27', '2026-11-28',
  '2026-12-04', '2026-12-05',
];

/** Horaires d'entrée */
export const slots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

/** Billets (prix en euros) */
export const tickets = [
  { id: 'plein', label: 'Plein tarif', detail: 'Adulte', price: 18 },
  { id: 'reduit', label: 'Tarif réduit', detail: 'Étudiants, moins de 26 ans', price: 12 },
  { id: 'enfant', label: 'Enfant', detail: '6 à 15 ans', price: 6 },
  { id: 'gratuit', label: 'Moins de 6 ans', detail: 'Accompagné d’un adulte', price: 0 },
  { id: 'mediation', label: 'Option visite commentée', detail: 'Par personne, avec un médiateur', price: 6 },
];

export const maxPerType = 10;
