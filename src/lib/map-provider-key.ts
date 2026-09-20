/**
 * Google Maps is an opt-in layer: it needs a real Maps key, and the repository ships none
 * until one is issued. The Firebase web API key is not a Maps key, so it must never light
 * this layer up. Lives on its own so no screen drags @vis.gl/react-google-maps into its
 * chunk just to ask the question.
 */
const rawKey = (((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? '').trim();

export const googleMapsApiKey = rawKey;

export const hasGoogleMapsKey =
  rawKey.length > 15 &&
  !rawKey.includes('MY_') &&
  rawKey !== 'AIzaSyC7Sjhb4l7AyU69Pi6Nmyf5odSZcIDFfFg';
