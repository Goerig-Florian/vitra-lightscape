/** Préfixe les chemins internes avec la base du site (utile sur GitHub Pages). */
export const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export const url = (path = '') => base + path.replace(/^\//, '');
