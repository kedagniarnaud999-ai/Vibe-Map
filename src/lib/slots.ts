import { AppLanguage } from '../types';

/**
 * Les creneaux proposes a un voyageur qui reserve une immersion.
 *
 * Un creneau n'est pas l'agenda du mediateur : c'est l'envie exprimee a l'instant de la
 * demande. Il etait enregistre tel quel, en texte anglais (« Tomorrow, 09:00 AM (…) »),
 * si bien qu'une demande posee le 12 novembre disait encore « Tomorrow » le 1er decembre,
 * et ce texte brut se lisait sur un ecran francais. Il part desormais en base comme un
 * instant reel ; le texte visible n'est que de l'affichage.
 */

/** L'heure a laquelle le mediateur attend le visiteur, pas celle du telephone. */
const WAT_TIME_ZONE = 'Africa/Porto-Novo';
const WAT_OFFSET_MS = 60 * 60 * 1000;

/**
 * Les trois choix, par la cle que le selecteur envoie. Le libelle n'est pas ici : il reste
 * litteral dans l'ecran, seul endroit ou `check:i18n` peut le voir.
 */
export const SLOTS = {
  morning: { day: 'next', hour: 9, minute: 0 },
  sunset: { day: 'next', hour: 15, minute: 0 },
  saturday: { day: 'saturday', hour: 10, minute: 0 }
} as const;

export type SlotId = keyof typeof SLOTS;

/** Initialiser l'etat du selecteur hors de ces cles laisse le champ vide a l'ecran et enregistre un horaire que le voyageur n'a jamais choisi. */
export const FIRST_SLOT_ID: SlotId = 'morning';

/** Le jour du voyageur se compte a Porto-Novo : minuit a Paris n'est pas minuit a Ouidah. */
function watDay(now: Date) {
  const shifted = new Date(now.getTime() + WAT_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    date: shifted.getUTCDate(),
    weekday: shifted.getUTCDay()
  };
}

/**
 * Un creneau resolu en instant absolu puis ecrit en ISO. Le prochain samedi est celui de
 * la semaine suivante quand la demande tombe un samedi : un creneau de 10h00 demande a
 * 15h00 ne peut pas designer le jour meme.
 */
export function slotToISO(id: SlotId, askedAt: Date = new Date()): string {
  const slot = SLOTS[id];
  const today = watDay(askedAt);
  const offsetInDays = slot.day === 'next'
    ? 1
    : ((6 - today.weekday + 7) % 7) || 7;
  const wallClock = Date.UTC(today.year, today.month, today.date + offsetInDays, slot.hour, slot.minute);

  return new Date(wallClock - WAT_OFFSET_MS).toISOString();
}

/**
 * Les enregistrements poses avant cette regle portent le jeton anglais saisi a l'epoque.
 * Il n'est pas traduit : il est resolu, contre la date de la demande, seul moment ou
 * « Tomorrow » designait un jour precis.
 */
const LEGACY_TOKENS: Record<string, SlotId> = {
  'Tomorrow, 09:00 AM (Recommended Morning Sanctuary Walk)': 'morning',
  'Tomorrow, 03:00 PM (Afternoon Sunset Walk)': 'sunset',
  'Saturday, 10:00 AM (Weekend Guided Deep Dive)': 'saturday'
};

const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T/;

/**
 * Un instant stocke, rendu dans la langue de l'interface et a l'heure du Benin. Une valeur
 * qui n'est pas un instant est rendue vide : un texte herite se montre, une date ne
 * s'invente pas.
 */
export function formatInstant(instant: string, lang: AppLanguage): string {
  if (!ISO_INSTANT.test(instant) || Number.isNaN(Date.parse(instant))) {
    return '';
  }

  return new Intl.DateTimeFormat(lang, {
    timeZone: WAT_TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(instant));
}

/**
 * Le creneau d'une reservation, dans la langue de l'interface et a l'heure du Benin. Une
 * valeur qu'aucune de ces regles ne permet de resoudre est rendue telle quelle : mieux
 * vaut un texte herdite qu'une date inventee.
 */
export function formatBookingWhen(
  dateTime: string,
  createdAt: string | undefined,
  lang: AppLanguage
): string {
  if (!dateTime) {
    return '';
  }

  const legacyId = ISO_INSTANT.test(dateTime) ? undefined : LEGACY_TOKENS[dateTime];
  const askedAt = createdAt && !Number.isNaN(Date.parse(createdAt)) ? new Date(createdAt) : null;
  const instant = legacyId && askedAt ? slotToISO(legacyId, askedAt) : dateTime;

  // Ni un instant ni un jeton connu : rien a calculer, et rien a inventer.
  return formatInstant(instant, lang) || dateTime;
}
