import { UserPreferences } from '../types';

// Logged-out shell only. Identity fields stay empty: a real name, e-mail and role
// arrive exclusively from a verified Firebase session.
export const INITIAL_USER: UserPreferences = {
  id: '',
  name: 'Explorateur Culturel',
  email: '',
  avatar: '',
  vibeTag: 'Cultural Seeker',
  travelStyle: 'Explorer',
  role: 'traveler',
  language: 'fr',
  notificationsEnabled: true,
  interests: ['Spiritual Traditions', 'Royal Architecture', 'Textile Arts', 'Oral History', 'Local Gastronomy'],
  savedPlaces: [],
  completedStops: [],
  placesCount: 0,
  storiesCount: 0,
  connectionsCount: 0,
  badges: [
    {
      id: 'sacred-initiate',
      title: 'Sacred Initiate',
      icon: 'sparkles',
      unlocked: false,
      color: 'bg-primary'
    },
    {
      id: 'textile-decoder',
      title: 'Symbol Decoder',
      icon: 'puzzle',
      unlocked: false,
      color: 'bg-secondary'
    },
    {
      id: 'palace-chronicler',
      title: 'Palace Chronicler',
      icon: 'crown',
      unlocked: false,
      color: 'bg-tertiary'
    },
    {
      id: 'lake-voyager',
      title: 'Lake Voyager',
      icon: 'waves',
      unlocked: false,
      color: 'bg-outline'
    }
  ]
};
