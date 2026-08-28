import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, Place, Story, Actor, UserPreferences } from './types';
import { PLACES_DATA } from './data/places';
import { STORIES_DATA } from './data/stories';
import { ACTORS_DATA } from './data/actors';
import { EVENTS_DATA } from './data/events';
import { INITIAL_USER } from './data/user';
import { syncUserProfileToFirestore, loadUserProfileFromFirestore } from './lib/firebase';

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['home']);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(PLACES_DATA[0]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(STORIES_DATA[0]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(ACTORS_DATA[0]);
  const [user, setUser] = useState<UserPreferences>(INITIAL_USER);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);

  // Initialize onboarding & Firestore state
  useEffect(() => {
    const onboarded = localStorage.getItem('lavibemap_onboarding_completed');
    if (!onboarded) {
      setHasCompletedOnboarding(false);
      setCurrentScreen('onboarding');
    }

    // Try loading persistent profile from Firestore
    loadUserProfileFromFirestore('kedagniarnaud999@gmail.com').then((savedProfile: any) => {
      if (savedProfile) {
        setUser((prev) => ({
          ...prev,
          ...savedProfile,
          savedPlaces: savedProfile.savedPlaces || savedProfile.visitedPlaceIds || prev.savedPlaces
        }));
      }
    }).catch((err) => {
      console.warn('Firestore load profile notice:', err);
    });
  }, []);

  const navigateTo = (screen: ScreenId) => {
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
      const exists = prev.savedPlaces.includes(placeId);
      const updatedPlaces = exists
        ? prev.savedPlaces.filter((id) => id !== placeId)
        : [...prev.savedPlaces, placeId];
      const updatedUser = {
        ...prev,
        savedPlaces: updatedPlaces,
        placesCount: updatedPlaces.length
      };
      // Async sync to Firestore
      syncUserProfileToFirestore(updatedUser as any).catch(console.warn);
      return updatedUser;
    });
  };

  const handleUpdateUser = (updated: Partial<UserPreferences>) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updated };
      syncUserProfileToFirestore(updatedUser as any).catch(console.warn);
      return updatedUser;
    });
  };

  // Header configuration per screen
  const getHeaderConfig = () => {
    switch (currentScreen) {
      case 'place-detail':
        return { show: false };
      case 'story-detail':
        return { show: false };
      case 'actor-profile':
        return { show: false };
      case 'onboarding':
        return { show: false };
      case 'map':
        return {
          show: true,
          title: 'Interactive Cultural Map',
          subtitle: 'Ouidah & Kingdom of Dahomey',
          showBack: true
        };
      case 'library':
        return {
          show: true,
          title: 'Digital Cultural Library',
          subtitle: 'Essays, proverbs & textile decoders',
          showBack: true
        };
      case 'actors':
        return {
          show: true,
          title: 'Verified Cultural Mediators',
          subtitle: 'Scholars, custodians & masters',
          showBack: true
        };
      case 'itinerary-builder':
        return {
          show: true,
          title: 'Weave Your Vibe',
          subtitle: 'AI-assisted cultural sequencing',
          showBack: true
        };
      case 'journal':
        return {
          show: true,
          title: 'My Cultural Passport',
          subtitle: 'Visited sites, stories & badges',
          showBack: true
        };
      case 'events':
        return {
          show: true,
          title: 'Cultural Gatherings',
          subtitle: 'Rituals, festivals & ceremonies',
          showBack: true
        };
      case 'assistant':
        return {
          show: true,
          title: 'Cultural AI Companion',
          subtitle: 'Ask etiquette, Fon words & history',
          showBack: true
        };
      case 'profile':
        return {
          show: true,
          title: 'Traveler Settings',
          subtitle: user.name,
          showBack: true
        };
      default:
        return {
          show: true,
          title: 'La Vibe Map',
          subtitle: 'Ouidah, Benin',
          showBack: false
        };
    }
  };

  const headerConfig = getHeaderConfig();

  // BottomNav visibility
  const showBottomNav =
    currentScreen !== 'onboarding' &&
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
        />
      )}

      {/* Screen Render Container */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {currentScreen === 'onboarding' && (
              <OnboardingScreen onComplete={handleCompleteOnboarding} />
            )}

            {currentScreen === 'home' && (
              <HomeScreen
                places={PLACES_DATA}
                stories={STORIES_DATA}
                actors={ACTORS_DATA}
                onSelectPlace={handleSelectPlace}
                onSelectStory={handleSelectStory}
                onSelectActor={handleSelectActor}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'map' && (
              <MapScreen
                places={PLACES_DATA}
                selectedPlace={selectedPlace}
                onSelectPlace={(p) => setSelectedPlace(p)}
                onOpenPlaceDetail={handleSelectPlace}
              />
            )}

            {currentScreen === 'place-detail' && selectedPlace && (
              <PlaceDetailScreen
                place={selectedPlace}
                actors={ACTORS_DATA}
                onBack={handleBack}
                onSelectActor={handleSelectActor}
                isSaved={user.savedPlaces.includes(selectedPlace.id)}
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
                actors={ACTORS_DATA}
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
                places={PLACES_DATA}
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
                places={PLACES_DATA}
                stories={STORIES_DATA}
                onSelectPlace={handleSelectPlace}
                onSelectStory={handleSelectStory}
              />
            )}

            {currentScreen === 'events' && (
              <EventsScreen events={EVENTS_DATA} />
            )}

            {currentScreen === 'assistant' && (
              <AssistantScreen />
            )}

            {currentScreen === 'profile' && (
              <UserProfileScreen
                user={user}
                onUpdateUser={handleUpdateUser}
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
        />
      )}
    </div>
  );
}
