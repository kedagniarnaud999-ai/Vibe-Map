export type UserRole = 'traveler' | 'guide' | 'admin';
export type AppLanguage = 'fr' | 'en';

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
  | 'profile'
  | 'auth'
  | 'admin'
  | 'guide-portal';

export type Category = 'Spiritual' | 'Historical' | 'Nature' | 'Food' | 'Arts' | 'Heritage' | 'Oral History';

export interface ImageCredit {
  file: string;
  author: string;
  license: string;
}

export interface Place {
  id: string;
  name: string;
  location: string;
  category: Category;
  // Constante de catalogue, sans point de référence : conservée pour les documents Firestore déjà écrits, jamais affichée comme une distance jusqu'au visiteur.
  distanceKm?: number;
  // Dérivée à l'exécution depuis la position GPS réelle du visiteur : absente tant qu'elle n'est pas connue.
  calculatedDistanceKm?: number;
  image: string;
  imageCredit?: ImageCredit;
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
    credit?: ImageCredit;
  }[];
  verifiedGuideIds: string[];
  vocabulary: {
    term: string;
    phonetic?: string;
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
  image?: string;
  imageCredit?: ImageCredit;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  readMinutes: number;
  heroImage: string;
  imageCredit?: ImageCredit;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  introduction: string;
  secondParagraph: string;
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
    category: Category;
    image: string;
  }[];
}

/** Ressource d'accueil réelle : institution publique, fondation ou guichet de site. */
export interface Actor {
  id: string;
  name: string;
  role: string;
  location: string;
  badgeTitle?: string;
  avatar?: string;
  heroImage?: string;
  quote?: string;
  bio?: string;
  languages?: string[];
  experienceYears?: number;
  rating?: number;
  reviewsCount?: number;
  contact?: {
    phone?: string;
    email?: string;
    url?: string;
  };
  expertise: {
    title: string;
    description: string;
    icon: string;
    color: string;
  }[];
  experiences: {
    id: string;
    title: string;
    price?: string;
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
  type: 'Festival' | 'Workshop' | 'Ceremony' | 'Concert' | string;
  date: string;
  location: string;
  image?: string;
  imageCredit?: ImageCredit;
  isFeatured?: boolean;
  isHappeningThisWeek?: boolean;
  accessType: 'Open to Public' | 'Invitation Only' | 'Ticketed' | string;
  description: string;
}

export interface UserPreferences {
  id: string;
  name: string;
  email: string;
  avatar: string;
  vibeTag: string;
  travelStyle: 'Relaxed' | 'Explorer' | 'Cultural Deep-Dive';
  language: string;
  role: UserRole;
  guideProfile?: {
    phone?: string;
    certified?: boolean;
    pricing?: string;
    bio?: string;
    actorId?: string;
    specialties?: string[];
  };
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

export interface GuideApplication {
  id?: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  region: string;
  experienceYears: number;
  languages: string[];
  specialties: string[];
  bio: string;
  idDocumentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

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
