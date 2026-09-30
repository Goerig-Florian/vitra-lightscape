// @ts-check
import { defineConfig } from 'astro/config';

// Site 100 % statique : `npm run build` produit le dossier dist/.
// En local, le site est servi à la racine (http://localhost:4321/).
// Sur GitHub Pages, le workflow .github/workflows/deploy.yml définit
// SITE_URL et BASE_PATH (/vitra-lightscape) automatiquement.
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH || '/',
});
