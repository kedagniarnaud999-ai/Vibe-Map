import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  getIdTokenResult,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onIdTokenChanged,
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
  orderBy
} from 'firebase/firestore';
import { UserProfile, ItineraryStop, Place, UserRole, GuideApplication } from '../types';

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

const USER_ROLES: readonly UserRole[] = ['traveler', 'guide', 'admin'];

// Firestore keeps these for display only; the authorized role always comes from the ID token claims.
const PROFILE_EDITABLE_FIELDS = [
  'name', 'avatar', 'vibeTag', 'travelStyle', 'language', 'notificationsEnabled',
  'interests', 'savedPlaces', 'completedStops', 'placesCount', 'storiesCount', 'connectionsCount'
] as const;

/**
 * Verified identity helpers
 */
export function getVerifiedUid(): string {
  return auth.currentUser?.uid ?? '';
}

export function getVerifiedEmail(): string {
  return auth.currentUser?.email ?? '';
}

export async function getVerifiedRole(): Promise<UserRole> {
  const user = auth.currentUser;
  if (!user) {
    return 'traveler';
  }

  try {
    const claims = (await getIdTokenResult(user)).claims ?? {};
    const role = claims.role as UserRole;
    return USER_ROLES.includes(role) ? role : 'traveler';
  } catch (error) {
    console.warn('Unable to read the role claims, falling back to traveler:', error);
    return 'traveler';
  }
}

/**
 * Authenticated API client: every non-public route expects the Firebase ID token.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init: { method?: 'GET' | 'POST'; body?: unknown } = {}
): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required');
  }

  const token = await user.getIdToken();
  const response = await fetch(path, {
    method: init.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body)
  });

  if (!response.ok) {
    throw new Error(`API request ${path} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function editableProfileFields(user: Partial<UserProfile>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};

  PROFILE_EDITABLE_FIELDS.forEach((field) => {
    const value = (user as Record<string, unknown>)[field];
    if (value !== undefined) {
      fields[field] = value;
    }
  });

  return fields;
}

function travelerProfile(fbUser: FirebaseUser): UserProfile {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Explorateur Culturel',
    email: fbUser.email || '',
    avatar: fbUser.photoURL || '',
    vibeTag: 'Explorateur Passionné',
    travelStyle: 'Cultural Deep-Dive',
    language: 'fr',
    role: 'traveler',
    notificationsEnabled: true,
    interests: ['Spiritual', 'Historical'],
    savedPlaces: [],
    completedStops: [],
    placesCount: 0,
    storiesCount: 0,
    connectionsCount: 0,
    badges: []
  };
}

/**
 * The client's only picture of "who is connected". `profile-unavailable` exists because a
 * verified Firebase identity can still have an unreadable profile document: reporting it as
 * signed-out used to render the anonymous shell while auth.currentUser stayed live.
 */
export type SessionStatus = 'signed-out' | 'ready' | 'profile-unavailable';

export interface VerifiedSession {
  status: SessionStatus;
  profile: UserProfile | null;
  uid: string;
  email: string;
}

export const SIGNED_OUT_SESSION: VerifiedSession = {
  status: 'signed-out',
  profile: null,
  uid: '',
  email: ''
};

/**
 * Authentication. Sign-in and sign-up can only ever produce a traveler session:
 * guide and admin access require a Firebase custom claim granted by an operator or an admin.
 */
async function sessionOrShell(fbUser: FirebaseUser, displayName?: string): Promise<UserProfile> {
  try {
    return await establishSession(fbUser, displayName);
  } catch (error) {
    console.warn('Profile document unreadable right after sign-in:', error);
    return { ...travelerProfile(fbUser), role: await getVerifiedRole() };
  }
}

export async function loginWithGoogle(): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: await sessionOrShell(result.user) };
  } catch (error: any) {
    return { user: null, error: error?.message || 'Erreur lors de la connexion Google' };
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { user: await sessionOrShell(result.user) };
  } catch (error: any) {
    return { user: null, error: error?.message };
  }
}

export async function registerWithEmail(
  email: string,
  pass: string,
  name: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return { user: await sessionOrShell(result.user, name) };
  } catch (error: any) {
    return { user: null, error: error?.message };
  }
}

export async function establishSession(fbUser: FirebaseUser, displayName?: string): Promise<UserProfile> {
  const role = await getVerifiedRole();
  const stored = await readProfileDoc(fbUser.uid);

  if (stored.state === 'found') {
    return {
      ...stored.profile,
      id: fbUser.uid,
      email: fbUser.email || stored.profile.email,
      name: stored.profile.name || displayName || fbUser.displayName || 'Explorateur Culturel',
      avatar: fbUser.photoURL || stored.profile.avatar,
      role
    };
  }

  const profile: UserProfile = {
    ...travelerProfile(fbUser),
    name: displayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Explorateur Culturel',
    role
  };

  await syncUserProfileToFirestore(profile);
  return profile;
}

export async function logoutUser() {
  try {
    await fbSignOut(auth);
  } catch (e) {
    console.warn('Sign out note:', e);
  }
}

export async function restoreSession(): Promise<VerifiedSession> {
  const fbUser = auth.currentUser;
  if (!fbUser) {
    return SIGNED_OUT_SESSION;
  }

  const { uid } = fbUser;
  const email = fbUser.email ?? '';

  try {
    return { status: 'ready', profile: await establishSession(fbUser), uid, email };
  } catch (error) {
    console.warn('Session restore error:', error);
    return { status: 'profile-unavailable', profile: null, uid, email };
  }
}

export function onAuthStateChange(callback: (session: VerifiedSession) => void) {
  return onIdTokenChanged(auth, async () => {
    callback(await restoreSession());
  });
}

/**
 * Sync user profile to Firestore & Cloud SQL
 */
export async function syncUserProfileToFirestore(user: UserProfile): Promise<boolean> {
  const uid = getVerifiedUid();
  if (!uid || (user.id && user.id !== uid)) {
    console.warn('Refusing to sync a profile that is not the signed-in user');
    return false;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const editable = editableProfileFields(user);
    const existing = await getDoc(userRef);

    if (existing.exists()) {
      await updateDoc(userRef, {
        ...editable,
        updatedAt: new Date().toISOString()
      });
    } else {
      await setDoc(userRef, {
        ...editable,
        id: uid,
        email: getVerifiedEmail(),
        role: 'traveler',
        badges: user.badges ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    apiFetch('/api/db/users/sync', { method: 'POST', body: editable })
      .catch((e) => console.warn('Cloud SQL user sync background note:', e));

    return true;
  } catch (error) {
    console.warn('Firestore user sync warning:', error);
    return false;
  }
}

/**
 * Resolves the signed-in user's profile document. A missing document is reported as
 * `missing`; a rejected or failed read propagates, because "no profile yet" and "the profile
 * is unreadable" must not end up looking the same to the UI.
 */
async function readProfileDoc(uid: string): Promise<
  { state: 'found'; profile: UserProfile } | { state: 'missing' }
> {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (!docSnap.exists()) {
    return { state: 'missing' };
  }

  return {
    state: 'found',
    profile: {
      ...(docSnap.data() as UserProfile),
      id: uid,
      role: await getVerifiedRole()
    }
  };
}

/**
 * Bookings Management
 */
export interface BookingRecord {
  id?: string;
  travelerUid?: string;
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

export type BookingInput = Pick<
  BookingRecord,
  'actorId' | 'actorName' | 'experienceId' | 'experienceTitle' | 'dateTime' | 'price'
>;

export async function createBookingInFirestore(booking: BookingInput): Promise<string | null> {
  const travelerUid = getVerifiedUid();
  const travelerEmail = getVerifiedEmail();
  if (!travelerUid || !travelerEmail) {
    console.warn('A verified account is required to book an experience');
    return null;
  }

  const travelerName = auth.currentUser?.displayName || 'Voyageur';

  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      travelerUid,
      travelerEmail,
      travelerName,
      // Une demande posée par le voyageur n'est pas une demande acceptée. Écrire
      // `confirmed` ici supprimait tout l'usage du champ : la liste d'administration
      // affichait chaque nouvelle réservation comme déjà traitée, sans moyen de repérer
      // celles qui attendent.
      status: 'pending',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    apiFetch('/api/db/bookings', { method: 'POST', body: { ...booking, travelerName } })
      .catch((e) => console.warn('Cloud SQL booking background sync note:', e));

    return docRef.id;
  } catch (error) {
    console.warn('Firestore booking error:', error);
    return null;
  }
}

export async function getUserBookingsFromFirestore(userEmail: string): Promise<BookingRecord[]> {
  try {
    const q = query(collection(db, 'bookings'), where('travelerEmail', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const results: BookingRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as BookingRecord);
    });
    return results;
  } catch (error) {
    console.warn('Firestore get bookings error:', error);
    return [];
  }
}

export async function getGuideBookingsFromFirestore(actorId: string): Promise<BookingRecord[]> {
  try {
    const q = query(collection(db, 'bookings'), where('actorId', '==', actorId));
    const querySnapshot = await getDocs(q);
    const results: BookingRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as BookingRecord);
    });
    return results;
  } catch (error) {
    console.warn('Firestore get guide bookings error:', error);
    return [];
  }
}

export async function getAllBookingsForAdmin(): Promise<BookingRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    const results: BookingRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as BookingRecord);
    });
    return results;
  } catch (error) {
    console.warn('Firestore admin get bookings error:', error);
    return [];
  }
}

/**
 * Places Management in Firestore & Dual Sync (catalog mutations need the admin claim)
 */
export async function savePlaceToFirestore(place: Place): Promise<boolean> {
  try {
    await setDoc(doc(db, 'places', place.id), {
      ...place,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    apiFetch('/api/db/places', {
      method: 'POST',
      body: {
        id: place.id,
        name: place.name,
        location: place.location,
        category: place.category,
        description: place.description,
        deepHistory: place.deepHistory,
        image: place.image,
        lat: String(place.coordinates.lat),
        lng: String(place.coordinates.lng)
      }
    }).catch((e) => console.warn('Cloud SQL place sync note:', e));

    return true;
  } catch (error) {
    console.warn('Save place error:', error);
    return false;
  }
}

export async function deletePlaceFromFirestore(placeId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'places', placeId));
    return true;
  } catch (e) {
    console.warn('Delete place error:', e);
    return false;
  }
}

export async function getAllPlacesFromFirestore(): Promise<Place[]> {
  try {
    const snap = await getDocs(collection(db, 'places'));
    const results: Place[] = [];
    snap.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as Place);
    });
    return results;
  } catch (error) {
    console.warn('Get places error:', error);
    return [];
  }
}

export const getPlacesFromFirestore = getAllPlacesFromFirestore;

/**
 * RSVP and Itinerary Functions. Ownership comes from the signed-in user, never from a form value.
 */
export async function saveEventRSVPToFirestore(eventId: string, eventTitle: string): Promise<boolean> {
  const userUid = getVerifiedUid();
  const userEmail = getVerifiedEmail();
  if (!userUid || !userEmail) {
    return false;
  }

  try {
    await addDoc(collection(db, 'rsvps'), {
      eventId,
      eventTitle,
      userUid,
      userEmail,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    apiFetch('/api/db/rsvps', { method: 'POST', body: { eventId, eventTitle } })
      .catch((e) => console.warn('Cloud SQL RSVP sync note:', e));

    return true;
  } catch (error) {
    console.warn('Firestore RSVP error:', error);
    return false;
  }
}

export async function getUserRSVPsFromFirestore(userEmail: string): Promise<any[]> {
  try {
    const snap = await getDocs(query(collection(db, 'rsvps'), where('userEmail', '==', userEmail)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Firestore RSVP fetch error:', e);
    return [];
  }
}

export async function getAllRSVPsForAdmin(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'rsvps'));
    const results: any[] = [];
    snap.forEach((docSnap) => results.push({ id: docSnap.id, ...docSnap.data() }));
    return results;
  } catch (e) {
    return [];
  }
}

export async function saveItineraryToFirestore(
  title: string,
  duration: string,
  interests: string[],
  stops: ItineraryStop[]
): Promise<string | null> {
  const userUid = getVerifiedUid();
  const userEmail = getVerifiedEmail();
  if (!userUid || !userEmail) {
    return null;
  }

  try {
    const docRef = await addDoc(collection(db, 'savedItineraries'), {
      title,
      duration,
      interests,
      stops,
      userUid,
      userEmail,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    apiFetch('/api/db/itineraries', {
      method: 'POST',
      body: { title, duration, interests, stops }
    }).catch((e) => console.warn('Cloud SQL itinerary sync note:', e));

    return docRef.id;
  } catch (error) {
    console.warn('Firestore save itinerary error:', error);
    return null;
  }
}

export async function getUserItinerariesFromFirestore(userEmail: string): Promise<any[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'savedItineraries'), where('userEmail', '==', userEmail))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn('Firestore itinerary fetch error:', e);
    return [];
  }
}

/**
 * Guide Accreditation Applications
 */
export type GuideApplicationInput = Omit<
  GuideApplication,
  'id' | 'userId' | 'email' | 'status' | 'submittedAt'
>;

export async function submitGuideApplication(
  application: GuideApplicationInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  const userId = getVerifiedUid();
  const email = getVerifiedEmail();
  if (!userId || !email) {
    return { success: false, error: 'Une connexion vérifiée est requise pour soumettre une demande' };
  }

  try {
    const docRef = await addDoc(collection(db, 'guide_applications'), {
      ...application,
      userId,
      email,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.warn('Submit guide application error:', error);
    return { success: false, error: error?.message || 'Erreur lors de la soumission de la demande' };
  }
}

export async function getMyGuideApplicationsFromFirestore(): Promise<GuideApplication[]> {
  const userId = getVerifiedUid();
  if (!userId) {
    return [];
  }

  try {
    const snap = await getDocs(query(collection(db, 'guide_applications'), where('userId', '==', userId)));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GuideApplication, 'id'>) }));
  } catch (e) {
    console.warn('Error fetching own guide applications:', e);
    return [];
  }
}

export async function getAllGuideApplicationsForAdmin(): Promise<GuideApplication[]> {
  try {
    const snap = await getDocs(query(collection(db, 'guide_applications'), orderBy('submittedAt', 'desc')));
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<GuideApplication, 'id'>)
    }));
  } catch (e) {
    console.warn('Error fetching guide applications:', e);
    return [];
  }
}

/**
 * Only the authenticated admin API may decide: it updates the application and the Firebase
 * role claim together, so a rejected guide loses access once its token is renewed.
 */
export async function decideGuideApplication(
  applicationId: string,
  decision: 'approved' | 'rejected'
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiFetch(`/api/admin/guide-applications/${encodeURIComponent(applicationId)}/decision`, {
      method: 'POST',
      body: { decision }
    });
    return { success: true };
  } catch (error: any) {
    console.warn('Guide application decision error:', error);
    return { success: false, error: error?.message || 'Décision impossible' };
  }
}
