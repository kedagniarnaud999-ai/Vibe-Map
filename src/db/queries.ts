import { db } from './index.ts';
import { users, places, bookings, savedItineraries, rsvps } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

// Users
export async function getOrCreateUser(uid: string, email: string, name?: string, avatar?: string, vibeTag?: string, travelStyle?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || 'Voyageur Curieux',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        vibeTag: vibeTag || 'Immersion & Spiritualité',
        travelStyle: travelStyle || 'Slow Travel',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          name: name || undefined,
          avatar: avatar || undefined,
          vibeTag: vibeTag || undefined,
          travelStyle: travelStyle || undefined,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query getOrCreateUser failed:', error);
    throw new Error('Database user query failed', { cause: error });
  }
}

export async function getUserProfile(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    return result[0] || null;
  } catch (error) {
    console.error('Database query getUserProfile failed:', error);
    throw new Error('Database profile fetch failed', { cause: error });
  }
}

// Bookings
export async function createBooking(data: {
  actorId: string;
  actorName: string;
  experienceId: string;
  experienceTitle: string;
  dateTime: string;
  price: string;
  travelerName: string;
  travelerEmail: string;
}) {
  try {
    const result = await db.insert(bookings).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database query createBooking failed:', error);
    throw new Error('Database booking creation failed', { cause: error });
  }
}

export async function getBookingsByUser(travelerEmail: string) {
  try {
    return await db.select().from(bookings).where(eq(bookings.travelerEmail, travelerEmail)).orderBy(desc(bookings.createdAt));
  } catch (error) {
    console.error('Database query getBookingsByUser failed:', error);
    throw new Error('Database bookings fetch failed', { cause: error });
  }
}

// Saved Itineraries
export async function createSavedItinerary(data: {
  title: string;
  duration: string;
  interests: string[];
  userEmail: string;
  stops: any[];
}) {
  try {
    const result = await db.insert(savedItineraries).values({
      title: data.title,
      duration: data.duration,
      interests: JSON.stringify(data.interests),
      userEmail: data.userEmail,
      stopsJson: JSON.stringify(data.stops),
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Database query createSavedItinerary failed:', error);
    throw new Error('Database itinerary save failed', { cause: error });
  }
}

export async function getSavedItinerariesByUser(userEmail: string) {
  try {
    return await db.select().from(savedItineraries).where(eq(savedItineraries.userEmail, userEmail)).orderBy(desc(savedItineraries.createdAt));
  } catch (error) {
    console.error('Database query getSavedItinerariesByUser failed:', error);
    throw new Error('Database itineraries fetch failed', { cause: error });
  }
}

// RSVPs
export async function createRSVP(data: {
  eventId: string;
  eventTitle: string;
  userEmail: string;
}) {
  try {
    const result = await db.insert(rsvps).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database query createRSVP failed:', error);
    throw new Error('Database RSVP creation failed', { cause: error });
  }
}

// Places in Database
export async function getAllPlaces() {
  try {
    return await db.select().from(places);
  } catch (error) {
    console.error('Database query getAllPlaces failed:', error);
    return [];
  }
}

export async function upsertPlace(data: {
  id: string;
  name: string;
  location: string;
  category: string;
  description?: string;
  deepHistory?: string;
  image?: string;
  lat?: string;
  lng?: string;
}) {
  try {
    const result = await db.insert(places)
      .values(data)
      .onConflictDoUpdate({
        target: places.id,
        set: {
          name: data.name,
          location: data.location,
          category: data.category,
          description: data.description,
          deepHistory: data.deepHistory,
          image: data.image,
          lat: data.lat,
          lng: data.lng,
        }
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database upsertPlace failed:', error);
    throw new Error('Database place save failed', { cause: error });
  }
}

