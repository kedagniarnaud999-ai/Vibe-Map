import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  vibeTag: text('vibe_tag'),
  travelStyle: text('travel_style'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Cultural Places catalog & visited records
export const places = pgTable('places', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  deepHistory: text('deep_history'),
  image: text('image'),
  lat: text('lat'),
  lng: text('lng'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Mediator & Experience Bookings
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  actorId: text('actor_id').notNull(),
  actorName: text('actor_name').notNull(),
  experienceId: text('experience_id').notNull(),
  experienceTitle: text('experience_title').notNull(),
  dateTime: text('date_time').notNull(),
  price: text('price').notNull(),
  travelerName: text('traveler_name').notNull(),
  travelerEmail: text('traveler_email').notNull(),
  status: text('status').default('confirmed'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Saved Itineraries created by AI
export const savedItineraries = pgTable('saved_itineraries', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  duration: text('duration').notNull(),
  interests: text('interests'),
  userEmail: text('user_email').notNull(),
  stopsJson: text('stops_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Event & Ceremony RSVPs
export const rsvps = pgTable('rsvps', {
  id: serial('id').primaryKey(),
  eventId: text('event_id').notNull(),
  eventTitle: text('event_title').notNull(),
  userEmail: text('user_email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
