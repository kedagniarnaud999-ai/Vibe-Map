import assert from 'node:assert/strict';
import {
  localizeActor,
  localizeEvent,
  localizePlace,
  localizePlaces,
  localizeStory
} from '../src/lib/content';
import { PLACES_DATA } from '../src/data/places';
import type { Actor, CulturalEvent, Place, Story } from '../src/types';

const place: Place = {
  id: 'place-1',
  name: 'Lieu de référence',
  location: 'Bénin',
  category: 'Heritage',
  distanceKm: 1,
  image: 'place.jpg',
  description: 'Description française',
  deepHistory: 'Histoire française',
  badges: ['Badge français'],
  etiquette: [{ title: 'Règle', description: 'Respectez le site.', icon: 'info' }],
  visualGuides: [{ title: 'Repère', description: 'Observez le portail.', image: 'guide.jpg' }],
  verifiedGuideIds: [],
  vocabulary: [{ term: 'Xwé', meaning: 'Sens français' }],
  coordinates: { x: 0, y: 0, lat: 0, lng: 0 }
};

const story: Story = {
  id: 'story-1',
  title: 'Titre français',
  subtitle: 'Sous-titre français',
  category: 'Heritage',
  readMinutes: 1,
  heroImage: 'story.jpg',
  author: { name: 'La rédaction', title: 'Titre auteur français' },
  introduction: 'Introduction française',
  secondParagraph: 'Second paragraphe français',
  symbolsTitle: 'Symboles français',
  symbolsDescription: 'Description des symboles française',
  symbols: [{ id: 'symbol-1', title: 'Symbole français', meaning: 'Sens français' }],
  quote: { text: 'Citation française', author: 'Auteur' },
  conclusion: 'Conclusion française',
  workshopCTA: { title: 'Atelier français', description: 'Description atelier française' },
  relatedStories: [{ id: 'related-1', title: 'Récit associé français', category: 'Heritage', image: 'related.jpg' }]
};

const actor: Actor = {
  id: 'actor-1',
  name: 'Institution',
  role: 'Rôle français',
  location: 'Bénin',
  badgeTitle: 'Badge français',
  quote: 'Citation française',
  bio: 'Biographie française',
  languages: ['Français'],
  expertise: [{ title: 'Expertise française', description: 'Description expertise française', icon: 'info', color: 'primary' }],
  experiences: [],
  reviews: []
};

const event: CulturalEvent = {
  id: 'event-1',
  title: 'Événement français',
  type: 'Festival',
  date: 'Date française',
  location: 'Lieu français',
  image: 'event.jpg',
  accessType: 'Accès français',
  description: 'Description française'
};

const fullPlaceTranslation = {
  description: 'English description',
  deepHistory: 'English history',
  badges: ['English badge'],
  etiquette: [{ title: 'Rule', description: 'Respect the site.' }],
  visualGuides: [{ title: 'Landmark', description: 'Look at the gateway.' }],
  vocabulary: [{ term: 'Xwé', meaning: 'English meaning' }]
};

assert.strictEqual(localizePlace(place, 'fr', fullPlaceTranslation), place);

const localizedPlace = localizePlace(place, 'en', fullPlaceTranslation);
assert.notStrictEqual(localizedPlace, place);
assert.equal(localizedPlace.description, 'English description');
assert.equal(localizedPlace.etiquette[0].title, 'Rule');
assert.equal(localizedPlace.visualGuides[0].description, 'Look at the gateway.');
assert.equal(localizedPlace.vocabulary[0].term, 'Xwé');
assert.equal(localizedPlace.vocabulary[0].meaning, 'English meaning');

assert.strictEqual(
  localizePlace(place, 'en', { ...fullPlaceTranslation, badges: [] }),
  place,
  'a partial English place entry must fall back entirely to French'
);

const temple = PLACES_DATA.find((entry) => entry.id === 'temple-des-pythons');
assert.ok(temple, 'the real Temple of Pythons record must exist');
const localizedTemple = localizePlaces([temple], 'en')[0];
assert.notStrictEqual(
  localizedTemple,
  temple,
  'the default English map must fully translate the Temple of Pythons'
);
assert.equal(localizedTemple.description, 'A sanctuary dedicated to Dangbé, the royal python.');

const localizedStory = localizeStory(story, 'en', {
  title: 'English title',
  subtitle: 'English subtitle',
  introduction: 'English introduction',
  secondParagraph: 'English second paragraph',
  authorTitle: 'English author title',
  symbolsTitle: 'English symbols',
  symbolsDescription: 'English symbols description',
  symbols: [{ title: 'English symbol', meaning: 'English meaning' }],
  quote: 'English quote',
  conclusion: 'English conclusion',
  workshopCta: { title: 'English workshop', description: 'English workshop description' },
  relatedStories: [{ title: 'English related story' }]
});
assert.equal(localizedStory.title, 'English title');
assert.equal(localizedStory.symbols?.[0].title, 'English symbol');
assert.equal(localizedStory.quote?.text, 'English quote');

assert.strictEqual(
  localizeStory(story, 'en', {
    title: 'English title',
    subtitle: 'English subtitle',
    introduction: 'English introduction',
    secondParagraph: 'English second paragraph',
    authorTitle: 'English author title',
    symbols: [],
    relatedStories: [{ title: 'English related story' }]
  }),
  story,
  'a mismatched symbols array must retain the whole French story'
);

const localizedActor = localizeActor(actor, 'en', {
  role: 'English role',
  badgeTitle: 'English badge',
  quote: 'English quote',
  bio: 'English bio',
  languages: ['French'],
  expertise: [{ title: 'English expertise', description: 'English expertise description' }]
});
assert.equal(localizedActor.bio, 'English bio');
assert.equal(localizedActor.expertise[0].title, 'English expertise');

assert.strictEqual(
  localizeActor(actor, 'en', {
    role: 'English role',
    expertise: []
  }),
  actor,
  'a mismatched expertise array must retain the whole French actor'
);

const localizedEvent = localizeEvent(event, 'en', {
  title: 'English event',
  date: 'English date',
  location: 'English location',
  accessType: 'English access',
  description: 'English description'
});
assert.equal(localizedEvent.accessType, 'English access');

assert.strictEqual(localizeEvent(event, 'en'), event);

console.log('Content localization contract passed.');
