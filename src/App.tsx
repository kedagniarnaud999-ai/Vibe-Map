import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, Place, Story, Actor, UserPreferences, AppLanguage, UserProfile, UserRole } from './types';
import { PLACES_DATA } from './data/places';
import { STORIES_DATA } from './data/stories';
import { ACTORS_DATA } from './data/actors';
import { EVENTS_DATA } from './data/events';
import { INITIAL_USER } from './data/user';
import { 
  syncUserProfileToFirestore, 
  getPlacesFromFirestore,
  onAuthStateChange,
  getActiveSessionRole,
  setActiveSessionRole,
  isAuthorizedAdmin
} from './lib/firebase';
import { TRANSLATIONS } from './lib/i18n';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MapScreen } from './components/screens/MapScreen';
import { PlaceDetailScreen } from './components/screens/PlaceDetailScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { StoryDetailScreen } from './components/screens/StoryDetailScreen';
import { ActorDirectoryScreen } from './components/screens/ActorDirectoryScreen';
import { ActorProfileScreen } from './components/screens/ActorProfileScreen';
import { ItineraryBuilderScreen } from './components/screens/ItineraryBuilderScreen';
import { JournalScreen } from './components/screens/JournalScreen';
import { EventsScreen } from './components/screens/EventsScreen';
import { AssistantScreen } from './components/screens/AssistantScreen';
import { UserProfileScreen } from './components/screens/UserProfileScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { GuidePortalScreen } from './components/screens/GuidePortalScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['home']);
  const [currentLang, setCurrentLang] = useState<AppLanguage>('fr');
  
  const [places, setPlaces] = useState<Place[]>(PLACES_DATA);
  const [actors, setActors] = useState<Actor[]>(ACTORS_DATA);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(PLACES_DATA[0]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(STORIES_DATA[0]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(ACTORS_DATA[0]);
  
  const [user, setUser] = useState<UserProfile>({
    ...INITIAL_USER,
    role: 'traveler'
  });
  
  const [authTargetRole, setAuthTargetRole] = useState<UserRole>('traveler');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);

  // Initialize onboarding, Firebase Auth & Firestore DB
  useEffect(() => {
    const onboarded = localStorage.getItem('lavibemap_onboarding_completed');
    if (!onboarded) {
      setHasCompletedOnboarding(false);
      setCurrentScreen('onboarding');
    }

    // Default language is French
    const savedLang = localStorage.getItem('lavibemap_language') as AppLanguage;
    if (savedLang) {
      setCurrentLang(savedLang);
    } else {
      setCurrentLang('fr');
      localStorage.setItem('lavibemap_language', 'fr');
    }

    // Listen to Firebase Auth state and respect active persistent role
    const unsubscribeAuth = onAuthStateChange((authUser) => {
      const activeRole = getActiveSessionRole();
      if (authUser) {
        // Enforce role separation: only grant admin if explicit admin session AND email authorized
        const verifiedRole: UserRole = 
          (activeRole === 'admin' && isAuthorizedAdmin(authUser.email))
            ? 'admin'
            : (activeRole === 'guide' ? 'guide' : 'traveler');

        setUser((prev) => ({
          ...prev,
          ...authUser,
          role: verifiedRole,
          language: prev.language || 'fr'
        }));
        return;
      }

      setUser((prev) => ({
        ...INITIAL_USER,
        language: prev.language || 'fr',
        role: activeRole || 'traveler'
      }));
    });

    // Load dynamic and verified places from Firestore & Cloud SQL
    getPlacesFromFirestore().then((dbPlaces) => {
      if (dbPlaces && dbPlaces.length > 0) {
        const merged = [...PLACES_DATA];
        dbPlaces.forEach((dbP) => {
          const idx = merged.findIndex((m) => m.id === dbP.id);
          if (idx >= 0) {
            merged[idx] = dbP;
          } else {
            merged.unshift(dbP);
          }
        });
        setPlaces(merged);
      }
    }).catch(console.warn);

    // Dual-sync places to Cloud SQL
    PLACES_DATA.forEach((p) => {
      fetch('/api/db/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: p.id,
          name: p.name,
          location: p.location,
          category: p.category,
          description: p.description,
          deepHistory: p.deepHistory,
          image: p.image,
          lat: String(p.coordinates?.lat || 6.36),
          lng: String(p.coordinates?.lng || 2.08),
        }),
      }).catch(() => {});
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const handleLanguageChange = (lang: AppLanguage) => {
    setCurrentLang(lang);
    localStorage.setItem('lavibemap_language', lang);
    handleUpdateUser({ language: lang });
  };

  // Switch role with persistent session storage
  const handleRoleChange = (newRole: UserRole) => {
    setActiveSessionRole(newRole);
    setUser((prev) => ({ ...prev, role: newRole }));
    if (newRole === 'admin') {
      navigateTo('admin');
    } else if (newRole === 'guide') {
      navigateTo('guide-portal');
    } else {
      navigateTo('home');
    }
  };

  const navigateTo = (screen: ScreenId) => {
    // Enforce exclusive role access
    if (screen === 'admin' && user.role !== 'admin') {
      if (isAuthorizedAdmin(user.email)) {
        // Authorized administrator can switch into admin session
        setActiveSessionRole('admin');
        setUser((prev) => ({ ...prev, role: 'admin' }));
      } else {
        setAuthTargetRole('admin');
        setScreenHistory((prev) => [...prev, 'auth']);
        setCurrentScreen('auth');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (screen === 'guide-portal' && user.role !== 'guide' && user.role !== 'admin') {
      setAuthTargetRole('guide');
      setScreenHistory((prev) => [...prev, 'auth']);
      setCurrentScreen('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('lavibemap_onboarding_completed', 'true');
    setHasCompletedOnboarding(true);
    setCurrentScreen('home');
    setScreenHistory(['home']);
  };

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    navigateTo('place-detail');
  };

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    navigateTo('story-detail');
  };

  const handleSelectActor = (actor: Actor) => {
    setSelectedActor(actor);
    navigateTo('actor-profile');
  };

  const handleToggleSavePlace = (placeId: string) => {
    setUser((prev) => {
      const exists = prev.savedPlaces?.includes(placeId);
      const updatedPlaces = exists
        ? (prev.savedPlaces || []).filter((id) => id !== placeId)
        : [...(prev.savedPlaces || []), placeId];
      const updatedUser = {
        ...prev,
        savedPlaces: updatedPlaces,
        placesCount: updatedPlaces.length
      };
      syncUserProfileToFirestore(updatedUser as any).catch(console.warn);
      return updatedUser;
    });
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updated };
      syncUserProfileToFirestore(updatedUser as any).catch(console.warn);
      return updatedUser;
    });
  };

  const handlePlaceAddedOrUpdated = (newPlace: Place) => {
    setPlaces((prev) => {
      const idx = prev.findIndex((p) => p.id === newPlace.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newPlace;
        return next;
      }
      return [newPlace, ...prev];
    });
  };

  const handlePlaceDeleted = (placeId: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;

  // Header configuration per screen
  const getHeaderConfig = () => {
    switch (currentScreen) {
      case 'place-detail':
      case 'story-detail':
      case 'actor-profile':
      case 'onboarding':
      case 'auth':
        return { show: false };
      case 'map':
        return {
          show: true,
          title: t.navMap || 'Carte Interactive Google Maps',
          subtitle: 'Sites et sanctuaires réels du Bénin',
          showBack: true
        };
      case 'library':
        return {
          show: true,
          title: 'Bibliothèque Culturelle',
          subtitle: 'Récits, proverbes et symboles royaux',
          showBack: true
        };
      case 'actors':
        return {
          show: true,
          title: t.navActors || 'Médiateurs Culturels Vérifiés',
          subtitle: 'Guides et maîtres de tradition agréés',
          showBack: true
        };
      case 'itinerary-builder':
        return {
          show: true,
          title: 'Tissez Votre Immersion',
          subtitle: 'Séquencement culturel et réservations',
          showBack: true
        };
      case 'journal':
        return {
          show: true,
          title: 'Passeport Culturel',
          subtitle: 'Sites visités et badges initiatiques',
          showBack: true
        };
      case 'events':
        return {
          show: true,
          title: 'Célébrations & Fêtes Traditionnelles',
          subtitle: 'Vodun Days, Gaani et rituels sacrés',
          showBack: true
        };
      case 'assistant':
        return {
          show: true,
          title: t.askAiCompanion || 'Compagnon Culturel IA',
          subtitle: 'Gemini 3.5 Flash & Search Grounding',
          showBack: true
        };
      case 'admin':
        return {
          show: true,
          title: 'Espace Administration du Patrimoine',
          subtitle: 'Supervision des bases, scraping et validation',
          showBack: true
        };
      case 'guide-portal':
        return {
          show: true,
          title: 'Portail Médiateur & Guide',
          subtitle: 'Réservations et catalogue d’expériences',
          showBack: true
        };
      case 'profile':
        return {
          show: true,
          title: t.navProfile || 'Mon Sanctuaire',
          subtitle: user.name,
          showBack: true
        };
      default:
        return {
          show: true,
          title: 'La Vibe Map',
          subtitle: 'Patrimoine & Sanctuaires du Bénin',
          showBack: false
        };
    }
  };

  const headerConfig = getHeaderConfig();

  // BottomNav visibility
  const showBottomNav =
    currentScreen !== 'onboarding' &&
    currentScreen !== 'auth' &&
    currentScreen !== 'story-detail' &&
    currentScreen !== 'actor-profile' &&
    currentScreen !== 'place-detail';

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#2c2926] flex flex-col font-sans selection:bg-[#c14e2f]/20 selection:text-[#c14e2f]">
      {/* Dynamic Header */}
      {headerConfig.show && (
        <Header
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onBack={handleBack}
          title={headerConfig.title}
          subtitle={headerConfig.subtitle}
          showBack={headerConfig.showBack}
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
          user={user}
          onRoleChange={handleRoleChange}
        />
      )}

      {/* Screen Render Container */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="w-full"
          >
            {currentScreen === 'onboarding' && (
              <OnboardingScreen onComplete={handleCompleteOnboarding} />
            )}

            {currentScreen === 'auth' && (
              <AuthScreen
                currentLang={currentLang}
                initialRole={authTargetRole}
                onAuthSuccess={(authenticatedUser) => {
                  setUser(authenticatedUser);
                  setActiveSessionRole(authenticatedUser.role);
                  if (authenticatedUser.role === 'admin') {
                    navigateTo('admin');
                  } else if (authenticatedUser.role === 'guide') {
                    navigateTo('guide-portal');
                  } else {
                    navigateTo('home');
                  }
                }}
                onCancel={() => navigateTo('home')}
              />
            )}

            {currentScreen === 'home' && (
              <HomeScreen
                places={places}
                stories={STORIES_DATA}
                actors={actors}
                onSelectPlace={handleSelectPlace}
                onSelectStory={handleSelectStory}
                onSelectActor={handleSelectActor}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'map' && (
              <MapScreen
                places={places}
                selectedPlace={selectedPlace}
                onSelectPlace={(p) => setSelectedPlace(p)}
                onOpenPlaceDetail={handleSelectPlace}
              />
            )}

            {currentScreen === 'place-detail' && selectedPlace && (
              <PlaceDetailScreen
                place={selectedPlace}
                actors={actors}
                onBack={handleBack}
                onSelectActor={handleSelectActor}
                isSaved={Boolean(user.savedPlaces?.includes(selectedPlace.id))}
                onToggleSave={handleToggleSavePlace}
              />
            )}

            {currentScreen === 'library' && (
              <LibraryScreen
                stories={STORIES_DATA}
                onSelectStory={handleSelectStory}
              />
            )}

            {currentScreen === 'story-detail' && selectedStory && (
              <StoryDetailScreen
                story={selectedStory}
                allStories={STORIES_DATA}
                onBack={handleBack}
                onSelectStory={handleSelectStory}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'actors' && (
              <ActorDirectoryScreen
                actors={actors}
                onSelectActor={handleSelectActor}
              />
            )}

            {currentScreen === 'actor-profile' && selectedActor && (
              <ActorProfileScreen
                actor={selectedActor}
                onBack={handleBack}
              />
            )}

            {currentScreen === 'itinerary-builder' && (
              <ItineraryBuilderScreen
                places={places}
                onSelectPlace={handleSelectPlace}
                onSaveItinerary={() => {
                  setUser((prev) => ({
                    ...prev,
                    storiesCount: prev.storiesCount + 1
                  }));
                }}
              />
            )}

            {currentScreen === 'journal' && (
              <JournalScreen
                user={user}
                places={places}
                stories={STORIES_DATA}
                onSelectPlace={handleSelectPlace}
                onSelectStory={handleSelectStory}
              />
            )}

            {currentScreen === 'events' && (
              <EventsScreen events={EVENTS_DATA} />
            )}

            {currentScreen === 'assistant' && (
              <AssistantScreen currentLang={currentLang} />
            )}

            {currentScreen === 'admin' && (
              <AdminScreen
                currentLang={currentLang}
                userRole={user.role}
                places={places}
                actors={actors}
                events={EVENTS_DATA}
                onPlaceAddedOrUpdated={handlePlaceAddedOrUpdated}
                onPlaceDeleted={handlePlaceDeleted}
                onOpenAuth={(role) => {
                  setAuthTargetRole(role || 'admin');
                  navigateTo('auth');
                }}
                onBackToPublic={() => navigateTo('home')}
              />
            )}

            {currentScreen === 'guide-portal' && (
              <GuidePortalScreen
                user={user}
                currentLang={currentLang}
                actors={actors}
                onOpenAuth={(role) => {
                  setAuthTargetRole(role || 'guide');
                  navigateTo('auth');
                }}
                onBackToPublic={() => navigateTo('home')}
              />
            )}

            {currentScreen === 'profile' && (
              <UserProfileScreen
                user={user}
                currentLang={currentLang}
                onLanguageChange={handleLanguageChange}
                onUpdateUser={handleUpdateUser}
                onOpenAuth={(role) => {
                  setAuthTargetRole(role || 'traveler');
                  navigateTo('auth');
                }}
                onNavigate={navigateTo}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Mobile-First Bottom Navigation */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          currentLang={currentLang}
          userRole={user.role}
        />
      )}
    </div>
  );
}
