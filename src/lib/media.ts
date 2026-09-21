import { ImageCredit } from '../types';

/**
 * Les visuels du socle documentaire sont hébergés sur Wikimedia Commons et placés
 * sous licence Creative Commons : l'URL est derivee du nom de fichier (l'endpoint
 * Special:FilePath sert la vignette a la largeur demandee) et la credit line doit
 * rester visible a cote de l'image.
 */
export const commonsThumb = (file: string, width = 800): string =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export const commonsPage = (file: string): string =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

export const creditLine = (credit: ImageCredit): string =>
  `${credit.author} · ${credit.license} · Wikimedia Commons`;

/** Monogramme utilise quand une structure de l'annuaire n'a pas de photo. */
export const monogram = (name: string): string => {
  const words = name.trim().split(/\s+/);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
};
