import React, { ComponentType, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ScreenId, Place, Story, Actor, UserProfile } from './types';
import { PLACES_DATA } from './data/places';
import { STORIES_DATA } from './data/stories';
import { ACTORS_DATA } from './data/actors';
import { EVENTS_DATA } from './data/events';
import { INITIAL_USER } from './data/user';
import {
  logoutUser,
  restoreSession,
  syncUserProfileToFirestore,
  getPlacesFromFirestore,
  onAuthStateChange,
  SIGNED_OUT_SESSION,
  VerifiedSession
} from './lib/firebase';
import { useI18n } from './lib/i18n';
import {
  localizeActors,
  localizeEvents,
  localizePlaces,
  localizeStories
} from './lib/content';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { PlaceDetailScreen } from './components/screens/PlaceDetailScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { StoryDetailScreen } from './components/screens/StoryDetailScreen';
import { ActorDirectoryScreen } from './components/screens/ActorDirectoryScreen';
import { ActorProfileScreen } from './components/screens/ActorProfileScreen';
import { EventsScreen } from './components/screens/EventsScreen';

/**
 * Screens behind a click that most sessions never take are loaded on demand: the map drags
 * Leaflet, the admin console and guide portal are role-gated, and the confetti screens share a
 * chunk. Everything above is what a first paint genuinely needs.
 */
const lazyScreen = <M extends Record<string, ComponentType<any>>, K extends keyof M>(
  load: () => Promise<M>,
  name: K
) => lazy(() => load().then((mod) => ({ default: mod[name] })));

const MapScreen = lazyScreen(() => import('./components/screens/MapScreen'), 'MapScreen');
const ItineraryBuilderScreen = lazyScreen(
  () => import('./components/screens/ItineraryBuilderScreen'),
  'ItineraryBuilderScreen'
);
const JournalScreen = lazyScreen(() => import('./components/screens/JournalScreen'), 'JournalScreen');
const AssistantScreen = lazyScreen(() => import('./components/screens/AssistantScreen'), 'AssistantScreen');
const UserProfileScreen = lazyScreen(() => import('./components/screens/UserProfileScreen'), 'UserProfileScreen');
const AuthScreen = lazyScreen(() => import('./components/screens/AuthScreen'), 'AuthScreen');
const AdminScreen = lazyScreen(() => import('./components/screens/AdminScreen'), 'AdminScreen');
const GuidePortalScreen = lazyScreen(() => import('./components/screens/GuidePortalScreen'), 'GuidePortalScreen');

export default function App() {
  const { lang, t } = useI18n();
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['home']);
  
  const [places, setPlaces] = useState<Place[]>(PLACES_DATA);
  const [actors, setActors] = useState<Actor[]>(ACTORS_DATA);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(PLACES_DATA[0]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(STORIES_DATA[0]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(ACTORS_DATA[0]);
  
  const [user, setUser] = useState<UserProfile>({
    ...INITIAL_USER,
    role: 'traveler'
  });
  const [session, setSession] = useState<VerifiedSession>(SIGNED_OUT_SESSION);

  // Cosmetic only: which sign-in card AuthScreen opens on. Never a privilege.
  const [authPortal, setAuthPortal] = useState<'public' | 'admin'>('public');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);

  // Editorial content is served to public screens through strict English overrides:
  // an entry with a missing or partial English record falls back to the whole French object,
  // so a visitor never sees a mixed-language card. AdminScreen and GuidePortalScreen keep
  // the raw French sources below because they edit them.
  const localizedPlaces = useMemo(() => localizePlaces(places, lang), [places, lang]);
  const localizedStories = useMemo(() => localizeStories(STORIES_DATA, lang), [lang]);
  const localizedActors = useMemo(() => localizeActors(actors, lang), [actors, lang]);
  const localizedEvents = useMemo(() => localizeEvents(EVENTS_DATA, lang), [lang]);

  const displayedPlace =
    selectedPlace === null
      ? null
      : localizedPlaces.find((p) => p.id === selectedPlace.id) ?? selectedPlace;
  const displayedStory =
    selectedStory === null
      ? null
      : localizedStories.find((s) => s.id === selectedStory.id) ?? selectedStory;
  const displayedActor =
    selectedActor === null
      ? null
      : localizedActors.find((a) => a.id === selectedActor.id) ?? selectedActor;

  const applySession = (next: VerifiedSession) => {
    setSession(next);
    setUser((prev) =>
      next.status === 'ready' && next.profile
        ? { ...prev, ...next.profile, language: prev.language || 'fr' }
        : { ...INITIAL_USER, language: prev.language || 'fr', role: 'traveler' }
    );
  };

  // Initialize onboarding, Firebase Auth & Firestore DB
  useEffect(() => {
    const onboarded = localStorage.getItem('lavibemap_onboarding_completed');
    if (!onboarded) {
      setHasCompletedOnboarding(false);
      setCurrentScreen('onboarding');
    }

    // The session role is resolved from the Firebase ID token claims, never from storage.
    const unsubscribeAuth = onAuthStateChange(applySession);

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

    // The catalogue is fed by the admin console and server-side scrapes only:
    // POST /api/db/places now requires the admin claim, so a browser-wide seed would 401.

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const openAuth = (portal: 'public' | 'admin') => {
    setAuthPortal(portal);
    setScreenHistory((prev) => [...prev, 'auth']);
    setCurrentScreen('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // A write intent needs more than an auth token: it needs the profile document to be readable,
  // otherwise the shell looks signed-out while the backend would still accept the caller's uid.
  const requireVerifiedIntent = (): boolean => {
    if (session.status === 'ready') {
      return true;
    }
    if (session.status === 'signed-out') {
      openAuth('public');
    }
    return false;
  };

  const retrySession = () => {
    restoreSession().then(applySession).catch(console.warn);
  };

  const handleSignOut = () => {
    logoutUser().then(() => navigateTo('home'));
  };

  const navigateTo = (screen: ScreenId) => {
    // Access follows the verified role; there is no local elevation path anymore.
    if (screen === 'admin' && user.role !== 'admin') {
      openAuth('admin');
      return;
    }

    if (screen === 'guide-portal' && user.role !== 'guide' && user.role !== 'admin') {
      openAuth('public');
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

  const handleToggleSavePlace = async (placeId: string): Promise<boolean> => {
    if (!requireVerifiedIntent()) {
      return false;
    }

    const exists = user.savedPlaces?.includes(placeId);
    const updatedPlaces = exists
      ? (user.savedPlaces || []).filter((id) => id !== placeId)
      : [...(user.savedPlaces || []), placeId];
    const updatedUser = {
      ...user,
      savedPlaces: updatedPlaces,
      placesCount: updatedPlaces.length
    };

    const synced = await syncUserProfileToFirestore(updatedUser);
    if (synced) {
      setUser(updatedUser);
    }
    return synced;
  };

  const handleUpdateUser = async (updated: Partial<UserProfile>): Promise<boolean> => {
    if (session.status !== 'ready') {
      return false;
    }

    const updatedUser = { ...user, ...updated };
    const synced = await syncUserProfileToFirestore(updatedUser);
    if (synced) {
      setUser(updatedUser);
    }
    return synced;
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

  // L'interface suit le provider ; le profil n'en garde qu'une copie pour les autres appareils.
  useEffect(() => {
    if (session.status !== 'ready') return;
    if (user.language === lang) return;
    handleUpdateUser({ language: lang });
  }, [lang, session.status, user.language]);

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
          title: t('Carte Vivante'),
          subtitle: t('Sites et sanctuaires réels du Bénin'),
          showBack: true
        };
      case 'library':
        return {
          show: true,
          title: t('Bibliothèque Culturelle'),
          subtitle: t('Récits, proverbes et symboles royaux'),
          showBack: true
        };
      case 'actors':
        return {
          show: true,
          title: t('Guides & structures'),
          subtitle: t('Adresses officielles et profils guides'),
          showBack: true
        };
      case 'itinerary-builder':
        return {
          show: true,
          title: t('Tissez Votre Immersion'),
          subtitle: t('Séquencement culturel et enregistrement au Passeport'),
          showBack: true
        };
      case 'journal':
        return {
          show: true,
          title: t('Passeport Culturel'),
          subtitle: t('Sites visités et badges initiatiques'),
          showBack: true
        };
      case 'events':
        return {
          show: true,
          title: t('Célébrations & Fêtes Traditionnelles'),
          subtitle: t('Vodun Days, Gaani et rituels sacrés'),
          showBack: true
        };
      case 'assistant':
        return {
          show: true,
          title: t('Compagnon Culturel IA'),
          subtitle: 'Gemini 3.5 Flash & Search Grounding',
          showBack: true
        };
      case 'admin':
        return {
          show: true,
          title: t('Espace Administration du Patrimoine'),
          subtitle: t('Supervision des bases, scraping et validation'),
          showBack: true
        };
      case 'guide-portal':
        return {
          show: true,
          title: t('Portail Médiateur & Guide'),
          subtitle: t('Réservations et catalogue d’expériences'),
          showBack: true
        };
      case 'profile':
        return {
          show: true,
          title: t('Mon Profil'),
          subtitle: user.name,
          showBack: true
        };
      default:
        return {
          show: true,
          title: 'La Vibe Map',
          subtitle: t('Patrimoine & Sanctuaires du Bénin'),
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
          user={user}
        />
      )}

      {/* Signed in, but the profile document could not be read: writes stay blocked. */}
      {session.status === 'profile-unavailable' && (
        <div className="sticky top-0 z-40 bg-[#fbe9d8] border-b border-[#e0b98d] px-4 py-3">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#c14e2f] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#2c2926]">{t('Profil non rattaché')}</p>
              <p className="text-[12px] text-[#5a5a40]">
                {t('Connecté comme {who} : l’identité Firebase est valide mais le profil est illisible. Les réservations, RSVP et enregistrements restent bloqués jusqu’à la relecture du profil.', { who: session.email || session.uid })}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={retrySession}
                className="px-3 py-1.5 rounded-full bg-[#c14e2f] text-white text-[12px] font-bold hover:bg-[#a83f24] transition-colors"
              >
                {t('Réessayer')}
              </button>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-full border border-[#5a5a40]/30 text-[#5a5a40] text-[12px] font-semibold hover:bg-white/60 transition-colors"
              >
                {t('Se déconnecter')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Render Container */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center gap-2 text-xs font-semibold text-[#8c867c]">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('Chargement de l’espace…')}
            </div>
          }
        >
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
                initialPortal={authPortal}
                onAuthSuccess={(authenticatedUser) => {
                  setUser((prev) => ({ ...prev, ...authenticatedUser }));
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
                places={localizedPlaces}
                stories={localizedStories}
                actors={localizedActors}
                events={localizedEvents}
                onSelectPlace={handleSelectPlace}
                onSelectStory={handleSelectStory}
                onSelectActor={handleSelectActor}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'map' && (
              <MapScreen
                places={localizedPlaces}
                selectedPlace={displayedPlace}
                onSelectPlace={(p) => setSelectedPlace(p)}
                onOpenPlaceDetail={handleSelectPlace}
              />
            )}

            {currentScreen === 'place-detail' && displayedPlace && (
              <PlaceDetailScreen
                place={displayedPlace}
                onBack={handleBack}
                isSaved={Boolean(user.savedPlaces?.includes(displayedPlace.id))}
                onToggleSave={handleToggleSavePlace}
              />
            )}

            {currentScreen === 'library' && (
              <LibraryScreen
                stories={localizedStories}
                onSelectStory={handleSelectStory}
              />
            )}

            {currentScreen === 'story-detail' && displayedStory && (
              <StoryDetailScreen
                story={displayedStory}
                allStories={localizedStories}
                onBack={handleBack}
                onSelectStory={handleSelectStory}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'actors' && (
              <ActorDirectoryScreen
                actors={localizedActors}
                onSelectActor={handleSelectActor}
              />
            )}

            {currentScreen === 'actor-profile' && displayedActor && (
              <ActorProfileScreen
                actor={displayedActor}
                onBack={handleBack}
                requireSession={requireVerifiedIntent}
              />
            )}

            {currentScreen === 'itinerary-builder' && (
              <ItineraryBuilderScreen
                places={localizedPlaces}
                onSelectPlace={handleSelectPlace}
                requireSession={requireVerifiedIntent}
                onSaveItinerary={() => {
                  handleUpdateUser({ storiesCount: user.storiesCount + 1 });
                }}
              />
            )}

            {currentScreen === 'journal' && (
              <JournalScreen
                user={user}
                places={localizedPlaces}
                stories={localizedStories}
                onSelectPlace={handleSelectPlace}
                onSelectStory={handleSelectStory}
              />
            )}

            {currentScreen === 'events' && (
              <EventsScreen events={localizedEvents} requireSession={requireVerifiedIntent} />
            )}

            {currentScreen === 'assistant' && (
              <AssistantScreen requireSession={requireVerifiedIntent} />
            )}

            {currentScreen === 'admin' && (
              <AdminScreen
                userRole={user.role}
                places={places}
                actors={actors}
                events={EVENTS_DATA}
                onPlaceAddedOrUpdated={handlePlaceAddedOrUpdated}
                onPlaceDeleted={handlePlaceDeleted}
                onOpenAuth={(role) => openAuth(role === 'admin' ? 'admin' : 'public')}
                onBackToPublic={() => navigateTo('home')}
              />
            )}

            {currentScreen === 'guide-portal' && (
              <GuidePortalScreen
                user={user}
                actors={actors}
                onOpenAuth={(role) => openAuth(role === 'admin' ? 'admin' : 'public')}
                onBackToPublic={() => navigateTo('home')}
              />
            )}

            {currentScreen === 'profile' && (
              <UserProfileScreen
                user={user}
                onUpdateUser={handleUpdateUser}
                onOpenAuth={(role) => openAuth(role === 'admin' ? 'admin' : 'public')}
                onNavigate={navigateTo}
              />
            )}
          </motion.div>
        </AnimatePresence>
        </Suspense>
      </main>

      {/* Persistent Mobile-First Bottom Navigation */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          userRole={user.role}
        />
      )}
    </div>
  );
}
