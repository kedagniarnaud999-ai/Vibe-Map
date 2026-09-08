import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { UserProfile, ItineraryStop, Place, Actor, UserRole } from '../types';

// Configuration from firebase-applet-config.json
const firebaseConfig = {
  projectId: "resonant-dominion-k2sm5",
  appId: "1:116297495645:web:e55a0b002e681a9e7bc9b4",
  apiKey: "AIzaSyC7Sjhb4l7AyU69Pi6Nmyf5odSZcIDFfFg",
  authDomain: "resonant-dominion-k2sm5.firebaseapp.com",
  storageBucket: "resonant-dominion-k2sm5.firebasestorage.app",
  messagingSenderId: "116297495645"
};

const databaseId = "ai-studio-lavibemapcultura-0fe5405c-91a5-4871-88f3-1feed685327a";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Real Authentication Functions
 */
export async function loginWithGoogle(): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    // Default role is traveler - admin must be explicitly set in Firestore profile
    const profile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Explorateur Culturel',
      email: fbUser.email || 'voyageur@patrimoine.bj',
      avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      vibeTag: 'Explorateur Passionné',
      travelStyle: 'Cultural Deep-Dive',
      language: 'fr',
      role: 'traveler', // Never auto-assign admin based on email
      notificationsEnabled: true,
      interests: ['Spiritual', 'Historical', 'Arts'],
      savedPlaces: [],
      completedStops: [],
      placesCount: 0,
      storiesCount: 0,
      connectionsCount: 0,
      badges: [
        { id: '1', title: 'Initiation Vodun', icon: 'Sparkles', unlocked: true, color: '#c14e2f' }
      ]
    };
    await syncUserProfileToFirestore(profile);
    return { user: profile };
  } catch (error: any) {
    console.warn('Google sign-in popup error (using fallback profile):', error);
    return { user: null, error: error?.message || 'Erreur lors de la connexion Google' };
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const existing = await loadUserProfileFromFirestore(res.user.uid);
    if (existing) return { user: existing };
    // Default role is traveler - admin role must be explicitly set in Firestore profile
    const newProfile: UserProfile = {
      id: res.user.uid,
      name: email.split('@')[0] || 'Voyageur',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      vibeTag: 'Explorateur du Bénin',
      travelStyle: 'Cultural Deep-Dive',
      language: 'fr',
      role: 'traveler', // Never auto-assign admin based on email alone
      notificationsEnabled: true,
      interests: ['Spiritual', 'Historical'],
      savedPlaces: [],
      completedStops: [],
      placesCount: 0,
      storiesCount: 0,
      connectionsCount: 0,
      badges: []
    };
    await syncUserProfileToFirestore(newProfile);
    return { user: newProfile };
  } catch (err: any) {
    return { user: null, error: err.message };
  }
}

export async function registerWithEmail(email: string, pass: string, name: string, role: UserRole = 'traveler'): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: UserProfile = {
      id: res.user.uid,
      name: name || email.split('@')[0],
      email: email,
      avatar: role === 'guide' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' 
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      vibeTag: role === 'guide' ? 'Médiateur Traditionnel Agréé' : 'Voyageur Curieux',
      travelStyle: 'Cultural Deep-Dive',
      language: 'fr',
      role: role, // Use the role selected during registration
      guideProfile: role === 'guide' ? {
        certified: true,
        pricing: '20 000 FCFA (~30 €)',
        phone: '+229 97 00 00 00',
        bio: 'Guide passionné du patrimoine vivant et de l’histoire du Bénin.',
        specialties: ['Histoire Royale', 'Rituels Vodun', 'Écotourisme']
      } : undefined,
      notificationsEnabled: true,
      interests: ['Spiritual', 'Historical', 'Nature', 'Arts'],
      savedPlaces: [],
      completedStops: [],
      placesCount: 0,
      storiesCount: 0,
      connectionsCount: 0,
      badges: []
    };
    await syncUserProfileToFirestore(newProfile);
    return { user: newProfile };
  } catch (err: any) {
    return { user: null, error: err.message };
  }
}

export async function logoutUser() {
  try {
    await fbSignOut(auth);
  } catch (e) {
    console.warn('Sign out note:', e);
  }
}

export function onAuthStateChange(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const profile = await loadUserProfileFromFirestore(fbUser.uid);
      if (profile) {
        callback(profile);
      } else {
        // Default role is traveler - admin must be set explicitly in Firestore
        callback({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Voyageur',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          vibeTag: 'Explorateur Passionné',
          travelStyle: 'Cultural Deep-Dive',
          language: 'fr',
          role: 'traveler', // Never auto-assign admin based on email
          notificationsEnabled: true,
          interests: ['Spiritual', 'Historical'],
          savedPlaces: [],
          completedStops: [],
          placesCount: 0,
          storiesCount: 0,
          connectionsCount: 0,
          badges: []
        });
      }
    } else {
      callback(null);
    }
  });
}

/**
 * Sync user profile to Firestore & Cloud SQL
 */
export async function syncUserProfileToFirestore(user: UserProfile): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', user.id || 'default-user');
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Dual-sync to Cloud SQL
    try {
      await fetch('/api/db/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          vibeTag: user.vibeTag,
          travelStyle: user.travelStyle,
          role: user.role
        })
      });
    } catch (e) {
      console.warn('Cloud SQL user sync background note:', e);
    }

    return true;
  } catch (error) {
    console.warn('Firestore user sync warning:', error);
    return false;
  }
}

/**
 * Load user profile from Firestore
 */
export async function loadUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId || 'default-user');
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Firestore load profile error:', error);
    return null;
  }
}

/**
 * Real-time listener for user profile
 */
export function subscribeToUserProfile(userId: string, callback: (user: UserProfile) => void) {
  const userRef = doc(db, 'users', userId || 'default-user');
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as UserProfile);
    }
  }, (err) => {
    console.warn('User profile snapshot error:', err);
  });
}

/**
 * Bookings Management
 */
export interface BookingRecord {
  id?: string;
  actorId: string;
  actorName: string;
  experienceId: string;
  experienceTitle: string;
  dateTime: string;
  price: string;
  travelerName: string;
  travelerEmail: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
}

export async function createBookingInFirestore(booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>): Promise<string | null> {
  try {
    const bookingsCol = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCol, {
      ...booking,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    // Dual-sync to Cloud SQL
    try {
      await fetch('/api/db/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
    } catch (e) {
      console.warn('Cloud SQL booking background sync note:', e);
    }

    return docRef.id;
  } catch (error) {
    console.warn('Firestore booking error:', error);
    return null;
  }
}

export async function getUserBookingsFromFirestore(userEmail: string): Promise<BookingRecord[]> {
  try {
    const bookingsCol = collection(db, 'bookings');
    const q = query(bookingsCol, where('travelerEmail', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const results: BookingRecord[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as BookingRecord);
    });
    return results;
  } catch (error) {
    console.warn('Firestore get bookings error:', error);
    return [];
  }
}

export async function getGuideBookingsFromFirestore(actorId: string): Promise<BookingRecord[]> {
  try {
    const bookingsCol = collection(db, 'bookings');
    const q = query(bookingsCol, where('actorId', '==', actorId));
    const querySnapshot = await getDocs(q);
    const results: BookingRecord[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as BookingRecord);
    });
    return results;
  } catch (error) {
    console.warn('Firestore get guide bookings error:', error);
    return [];
  }
}

export async function getAllBookingsForAdmin(): Promise<BookingRecord[]> {
  try {
    const bookingsCol = collection(db, 'bookings');
    const querySnapshot = await getDocs(bookingsCol);
    const results: BookingRecord[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as BookingRecord);
    });
    return results;
  } catch (error) {
    console.warn('Firestore admin get bookings error:', error);
    return [];
  }
}

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status });
    return true;
  } catch (e) {
    console.warn('Update booking error:', e);
    return false;
  }
}

/**
 * Places Management in Firestore & Dual Sync
 */
export async function savePlaceToFirestore(place: Place): Promise<boolean> {
  try {
    const placeRef = doc(db, 'places', place.id);
    await setDoc(placeRef, {
      ...place,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Cloud SQL Sync
    try {
      await fetch('/api/db/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: place.id,
          name: place.name,
          location: place.location,
          category: place.category,
          description: place.description,
          deepHistory: place.deepHistory,
          image: place.image,
          lat: String(place.coordinates.lat),
          lng: String(place.coordinates.lng)
        })
      });
    } catch (e) {
      console.warn('Cloud SQL place sync note:', e);
    }
    return true;
  } catch (error) {
    console.warn('Save place error:', error);
    return false;
  }
}

export async function deletePlaceFromFirestore(placeId: string): Promise<boolean> {
  try {
    const placeRef = doc(db, 'places', placeId);
    await deleteDoc(placeRef);
    return true;
  } catch (e) {
    console.warn('Delete place error:', e);
    return false;
  }
}

export async function getAllPlacesFromFirestore(): Promise<Place[]> {
  try {
    const placesCol = collection(db, 'places');
    const snap = await getDocs(placesCol);
    const results: Place[] = [];
    snap.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as Place);
    });
    return results;
  } catch (e) {
    console.warn('Get places error:', e);
    return [];
  }
}

export const getPlacesFromFirestore = getAllPlacesFromFirestore;

/**
 * RSVP and Itinerary Functions
 */
export async function saveEventRSVPToFirestore(eventId: string, eventTitle: string, userEmail: string): Promise<boolean> {
  try {
    const rsvpCol = collection(db, 'rsvps');
    await addDoc(rsvpCol, {
      eventId,
      eventTitle,
      userEmail,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    try {
      await fetch('/api/db/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, eventTitle, userEmail })
      });
    } catch (e) {
      console.warn('Cloud SQL RSVP sync note:', e);
    }

    return true;
  } catch (error) {
    console.warn('Firestore RSVP error:', error);
    return false;
  }
}

export async function getAllRSVPsForAdmin(): Promise<any[]> {
  try {
    const rsvpsCol = collection(db, 'rsvps');
    const snap = await getDocs(rsvpsCol);
    const results: any[] = [];
    snap.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
    return results;
  } catch (e) {
    return [];
  }
}

export async function saveItineraryToFirestore(
  title: string,
  duration: string,
  interests: string[],
  stops: ItineraryStop[],
  userEmail: string
): Promise<string | null> {
  try {
    const itinerariesCol = collection(db, 'savedItineraries');
    const docRef = await addDoc(itinerariesCol, {
      title,
      duration,
      interests,
      stops,
      userEmail,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    try {
      await fetch('/api/db/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          duration,
          interests,
          stops,
          userEmail
        })
      });
    } catch (e) {
      console.warn('Cloud SQL itinerary sync note:', e);
    }

    return docRef.id;
  } catch (error) {
    console.warn('Firestore save itinerary error:', error);
    return null;
  }
}
