import { UserPreferences } from '../types';

export const INITIAL_USER: UserPreferences = {
  name: 'Alexandre Morel',
  email: 'alexandre.travel@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  vibeTag: 'Cultural Seeker',
  travelStyle: 'Explorer',
  role: 'traveler',
  language: 'Français (FR) / English',
  notificationsEnabled: true,
  interests: ['Spiritual Traditions', 'Royal Architecture', 'Textile Arts', 'Oral History', 'Local Gastronomy'],
  savedPlaces: ['temple-of-pythons', 'sacred-forest-kpasse', 'royal-palaces-abomey'],
  completedStops: ['temple-of-pythons'],
  placesCount: 4,
  storiesCount: 7,
  connectionsCount: 3,
  badges: [
    {
      id: 'sacred-initiate',
      title: 'Sacred Initiate',
      icon: 'sparkles',
      unlocked: true,
      color: 'bg-primary'
    },
    {
      id: 'textile-decoder',
      title: 'Symbol Decoder',
      icon: 'puzzle',
      unlocked: true,
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
