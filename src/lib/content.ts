import {
  ACTOR_CONTENT_EN,
  EVENT_CONTENT_EN,
  PLACE_CONTENT_EN,
  STORY_CONTENT_EN,
  type ActorContentEn,
  type EventContentEn,
  type PairContentEn,
  type PlaceContentEn,
  type StoryContentEn
} from '../data/content-en';
import type { Actor, AppLanguage, CulturalEvent, Place, Story } from '../types';

const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const hasCompletePairs = (
  source: readonly { title: string; description: string }[],
  translation: readonly PairContentEn[]
) =>
  source.length === translation.length &&
  translation.every((entry) => hasText(entry.title) && hasText(entry.description));

const hasMatchingOptionalText = (source: string | undefined, translation: string | undefined) =>
  source === undefined ? translation === undefined : hasText(translation);

const hasCompletePlaceContent = (place: Place, content: PlaceContentEn | undefined) =>
  content !== undefined &&
  hasText(content.description) &&
  hasMatchingOptionalText(place.deepHistory, content.deepHistory) &&
  content.badges.length === place.badges.length &&
  content.badges.every(hasText) &&
  hasCompletePairs(place.etiquette, content.etiquette) &&
  hasCompletePairs(place.visualGuides, content.visualGuides) &&
  content.vocabulary.length === place.vocabulary.length &&
  content.vocabulary.every(
    (entry, index) => entry.term === place.vocabulary[index].term && hasText(entry.meaning)
  );

const hasCompleteStoryContent = (story: Story, content: StoryContentEn | undefined) =>
  content !== undefined &&
  hasText(content.title) &&
  hasText(content.subtitle) &&
  hasText(content.introduction) &&
  hasText(content.secondParagraph) &&
  hasText(content.authorTitle) &&
  hasMatchingOptionalText(story.symbolsTitle, content.symbolsTitle) &&
  hasMatchingOptionalText(story.symbolsDescription, content.symbolsDescription) &&
  (story.symbols?.length ?? 0) === content.symbols.length &&
  content.symbols.every((symbol) => hasText(symbol.title) && hasText(symbol.meaning)) &&
  hasMatchingOptionalText(story.quote?.text, content.quote) &&
  hasMatchingOptionalText(story.conclusion, content.conclusion) &&
  (story.workshopCTA === undefined
    ? content.workshopCta === undefined
    : content.workshopCta !== undefined &&
      hasText(content.workshopCta.title) &&
      hasText(content.workshopCta.description)) &&
  story.relatedStories.length === content.relatedStories.length &&
  content.relatedStories.every((related) => hasText(related.title));

const hasCompleteActorContent = (actor: Actor, content: ActorContentEn | undefined) =>
  content !== undefined &&
  hasText(content.role) &&
  hasMatchingOptionalText(actor.badgeTitle, content.badgeTitle) &&
  hasMatchingOptionalText(actor.quote, content.quote) &&
  hasMatchingOptionalText(actor.bio, content.bio) &&
  (actor.languages === undefined
    ? content.languages === undefined
    : content.languages !== undefined &&
      actor.languages.length === content.languages.length &&
      content.languages.every(hasText)) &&
  hasCompletePairs(actor.expertise, content.expertise);

const hasCompleteEventContent = (content: EventContentEn | undefined) =>
  content !== undefined &&
  hasText(content.title) &&
  hasText(content.date) &&
  hasText(content.location) &&
  hasText(content.accessType) &&
  hasText(content.description);

export function localizePlace(
  place: Place,
  language: AppLanguage,
  content: PlaceContentEn | undefined = PLACE_CONTENT_EN[place.id]
): Place {
  if (language === 'fr' || !hasCompletePlaceContent(place, content)) return place;

  return {
    ...place,
    description: content.description,
    deepHistory: content.deepHistory,
    badges: [...content.badges],
    etiquette: place.etiquette.map((entry, index) => ({
      ...entry,
      title: content.etiquette[index].title,
      description: content.etiquette[index].description
    })),
    visualGuides: place.visualGuides.map((entry, index) => ({
      ...entry,
      title: content.visualGuides[index].title,
      description: content.visualGuides[index].description
    })),
    vocabulary: place.vocabulary.map((entry, index) => ({
      ...entry,
      meaning: content.vocabulary[index].meaning
    }))
  };
}

export function localizeStory(
  story: Story,
  language: AppLanguage,
  content: StoryContentEn | undefined = STORY_CONTENT_EN[story.id]
): Story {
  if (language === 'fr' || !hasCompleteStoryContent(story, content)) return story;

  return {
    ...story,
    title: content.title,
    subtitle: content.subtitle,
    author: { ...story.author, title: content.authorTitle },
    introduction: content.introduction,
    secondParagraph: content.secondParagraph,
    symbolsTitle: content.symbolsTitle,
    symbolsDescription: content.symbolsDescription,
    symbols: story.symbols?.map((symbol, index) => ({
      ...symbol,
      title: content.symbols[index].title,
      meaning: content.symbols[index].meaning
    })),
    quote: story.quote === undefined ? undefined : { ...story.quote, text: content.quote },
    conclusion: content.conclusion,
    workshopCTA:
      story.workshopCTA === undefined
        ? undefined
        : {
            title: content.workshopCta!.title,
            description: content.workshopCta!.description
          },
    relatedStories: story.relatedStories.map((related, index) => ({
      ...related,
      title: content.relatedStories[index].title
    }))
  };
}

export function localizeActor(
  actor: Actor,
  language: AppLanguage,
  content: ActorContentEn | undefined = ACTOR_CONTENT_EN[actor.id]
): Actor {
  if (language === 'fr' || !hasCompleteActorContent(actor, content)) return actor;

  return {
    ...actor,
    role: content.role,
    badgeTitle: content.badgeTitle,
    quote: content.quote,
    bio: content.bio,
    languages: content.languages === undefined ? undefined : [...content.languages],
    expertise: actor.expertise.map((entry, index) => ({
      ...entry,
      title: content.expertise[index].title,
      description: content.expertise[index].description
    }))
  };
}

export function localizeEvent(
  event: CulturalEvent,
  language: AppLanguage,
  content: EventContentEn | undefined = EVENT_CONTENT_EN[event.id]
): CulturalEvent {
  if (language === 'fr' || !hasCompleteEventContent(content)) return event;

  return {
    ...event,
    title: content.title,
    date: content.date,
    location: content.location,
    accessType: content.accessType,
    description: content.description
  };
}

export const localizePlaces = (places: Place[], language: AppLanguage) =>
  places.map((place) => localizePlace(place, language));

export const localizeStories = (stories: Story[], language: AppLanguage) =>
  stories.map((story) => localizeStory(story, language));

export const localizeActors = (actors: Actor[], language: AppLanguage) =>
  actors.map((actor) => localizeActor(actor, language));

export const localizeEvents = (events: CulturalEvent[], language: AppLanguage) =>
  events.map((event) => localizeEvent(event, language));
