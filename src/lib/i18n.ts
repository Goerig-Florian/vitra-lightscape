import { base, url } from './url';
import { dict, type Lang, type Dict } from '../data/i18n';

export type { Lang, Dict };
export const langs: Lang[] = ['fr', 'en', 'de'];

/** Langue de la page, déduite de l'adresse : /en/… anglais, /de/… allemand, sinon français. */
export const getLang = (u: URL): Lang => {
  const rest = u.pathname.slice(base.length - 1).replace(/^\//, '');
  const first = rest.split('/')[0];
  return first === 'en' || first === 'de' ? first : 'fr';
};

export const getT = (u: URL): Dict => dict[getLang(u)];

/** Adresse de l'accueil et du panier dans une langue donnée */
export const homeUrl = (lang: Lang) => url(lang === 'fr' ? '' : `${lang}/`);
export const cartUrl = (lang: Lang) => url(lang === 'fr' ? 'panier/' : `${lang}/panier/`);

/** Remplace {clé} dans un texte */
export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
