/**
 * Billetterie — DONNÉES PROVISOIRES (proposition pour l'appel d'offres).
 * Dates et horaires d'ouverture : proposition de l'équipe (17 et 18 septembre 2027, 19h00 – 23h00).
 * Horaires d'entrée et tarifs : provisoires, à valider avec le Vitra Campus.
 * Le panier fonctionne dans le navigateur ; aucun paiement n'est branché.
 */

export const provisional = true;

export const notice =
  'Soirées des 17 et 18 septembre 2027, de 19h00 à 23h00. Tarifs et horaires d’entrée provisoires, proposés pour l’appel d’offres. Le paiement en ligne n’est pas encore branché.';

/** Soirées (format AAAA-MM-JJ) : vendredi 17 et samedi 18 septembre 2027 */
export const dates = ['2027-09-17', '2027-09-18'];

/** Horaires d'entrée : le site ouvre à 19h00 et ferme à 23h00 (dernière entrée à 21h30 : proposition à valider) */
export const slots = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

/** Billets (prix en euros) */
export const tickets = [
  { id: 'plein', label: 'Plein tarif', detail: 'Adulte', price: 18 },
  { id: 'reduit', label: 'Tarif réduit', detail: 'Étudiants, moins de 26 ans', price: 12 },
  { id: 'enfant', label: 'Enfant', detail: '6 à 15 ans', price: 6 },
  { id: 'gratuit', label: 'Moins de 6 ans', detail: 'Accompagné d’un adulte', price: 0 },
  { id: 'mediation', label: 'Option visite commentée', detail: 'Par personne, avec un médiateur', price: 6 },
];

export const maxPerType = 10;
