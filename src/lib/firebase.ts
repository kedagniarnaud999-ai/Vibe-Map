import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { UserProfile, ItineraryStop } from '../types';

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
          travelStyle: user.travelStyle
        })
      });
    } catch (e) {
      console.warn('Cloud SQL user background sync note:', e);
    }

    return true;
  } catch (error) {
    console.warn('Firestore user sync warning (using local fallback):', error);
    return false;
  }
}

/**
 * Load user profile from Firestore or Cloud SQL
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
 * Save mediator booking
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
  status: 'pending' | 'confirmed' | 'completed';
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

/**
 * Get bookings for a user
 */
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

/**
 * Save Event RSVP in Firestore & Cloud SQL
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

    // Dual-sync to Cloud SQL
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

/**
 * Save Itinerary in Firestore & Cloud SQL
 */
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

    // Dual-sync to Cloud SQL
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
