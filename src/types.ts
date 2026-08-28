export type ScreenId = 
  | 'onboarding'
  | 'home'
  | 'map'
  | 'place-detail'
  | 'library'
  | 'story-detail'
  | 'actors'
  | 'actor-profile'
  | 'itinerary-builder'
  | 'journal'
  | 'events'
  | 'assistant'
  | 'profile';

export type Category = 'Spiritual' | 'Historical' | 'Nature' | 'Food' | 'Arts' | 'Heritage';

export interface Place {
  id: string;
  name: string;
  location: string;
  category: Category;
  distanceKm: number;
  image: string;
  description: string;
  deepHistory?: string;
  badges: string[];
  etiquette: {
    title: string;
    description: string;
    icon: string;
  }[];
  audioGuide?: {
    title: string;
    narrator: string;
    duration: string;
    durationSeconds: number;
  };
  visualGuides: {
    title: string;
    description: string;
    image: string;
  }[];
  verifiedGuideIds: string[];
  vocabulary: {
    term: string;
    phonetic: string;
    meaning: string;
  }[];
  coordinates: {
    x: number; // percentage on map
    y: number; // percentage on map
    lat: number;
    lng: number;
  };
}

export interface SymbolDetail {
  id: string;
  title: string;
  meaning: string;
  image: string;
  colorClass: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  heroImage: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  introduction: string;
  secondParagraph: string;
  audioTrack?: {
    title: string;
    subtitle: string;
  };
  symbolsTitle?: string;
  symbolsDescription?: string;
  symbols?: SymbolDetail[];
  quote?: {
    text: string;
    author: string;
  };
  conclusion?: string;
  workshopCTA?: {
    title: string;
    description: string;
  };
  relatedStories: {
    id: string;
    title: string;
    category: string;
    image: string;
  }[];
}

export interface Actor {
  id: string;
  name: string;
  role: string;
  badgeTitle: string;
  rating: number;
  reviewsCount: number;
  location: string;
  experienceYears: number;
  languages: string[];
  avatar: string;
  heroImage?: string;
  quote?: string;
  bio?: string;
  isCollective?: boolean;
  membersCount?: number;
  expertise: {
    title: string;
    description: string;
    icon: string;
    color: string;
  }[];
  experiences: {
    id: string;
    title: string;
    price: string;
    duration: string;
    description: string;
    image?: string;
    isVirtual?: boolean;
  }[];
  reviews: {
    id: string;
    author: string;
    date: string;
    comment: string;
    rating: number;
  }[];
}

export interface CulturalEvent {
  id: string;
  title: string;
  type: 'Festival' | 'Workshop' | 'Ceremony' | 'Concert';
  date: string;
  location: string;
  image: string;
  isFeatured?: boolean;
  isHappeningThisWeek?: boolean;
  accessType: 'Open to Public' | 'Invitation Only' | 'Ticketed';
  description: string;
}

export interface UserPreferences {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  vibeTag: string;
  travelStyle: 'Relaxed' | 'Explorer' | 'Cultural Deep-Dive';
  language: string;
  notificationsEnabled: boolean;
  interests: string[];
  savedPlaces: string[];
  completedStops: string[];
  placesCount: number;
  storiesCount: number;
  connectionsCount: number;
  badges: {
    id: string;
    title: string;
    icon: string;
    unlocked: boolean;
    color: string;
  }[];
}

export type UserProfile = UserPreferences;

export interface ItineraryStop {
  id: string;
  time: string;
  placeId: string;
  title: string;
  description: string;
  insight: string;
  transitTime?: string;
  transitMode?: 'walk' | 'taxi' | 'boat';
  image?: string;
  icon: string;
  color: string;
  verified?: boolean;
}
