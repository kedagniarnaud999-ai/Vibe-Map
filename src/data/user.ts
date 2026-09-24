import { UserPreferences } from '../types';

// Logged-out shell only. Identity fields stay empty: a real name, e-mail and role
// arrive exclusively from a verified Firebase session. The same goes for the travel
// rhythm — a visitor who never picked one is not asked to pretend they did.
export const INITIAL_USER: UserPreferences = {
  id: '',
  name: 'Explorateur Culturel',
  email: '',
  avatar: '',
  role: 'traveler',
  language: 'fr',
  notificationsEnabled: true,
  interests: ['Spiritual Traditions', 'Royal Architecture', 'Textile Arts', 'Oral History', 'Local Gastronomy'],
  savedPlaces: [],
  completedStops: [],
  storiesCount: 0,
  // Aucune distinction n'est décernée par l'application : le mur de badges reste vide.
  badges: []
};
