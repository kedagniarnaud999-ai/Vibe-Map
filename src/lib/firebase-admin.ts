import { App, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const ADMIN_APP_NAME = 'vibe-map-admin';

export class FirebaseAdminUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Firebase Admin is unavailable');
    this.name = 'FirebaseAdminUnavailableError';
    this.cause = cause;
  }
}

let adminApp: App | undefined;
let initializationError: FirebaseAdminUnavailableError | undefined;

export function initializeFirebaseAdmin(): App {
  if (adminApp) {
    return adminApp;
  }

  if (initializationError) {
    throw initializationError;
  }

  try {
    if (!firebaseConfig.projectId) {
      throw new Error('Missing Firebase project ID');
    }

    adminApp = getApps().find((app) => app.name === ADMIN_APP_NAME)
      ?? initializeApp({ projectId: firebaseConfig.projectId }, ADMIN_APP_NAME);

    return adminApp;
  } catch (error) {
    initializationError = new FirebaseAdminUnavailableError(error);
    throw initializationError;
  }
}

export function getAdminAuth(): Auth {
  try {
    return getAuth(initializeFirebaseAdmin());
  } catch (error) {
    if (error instanceof FirebaseAdminUnavailableError) {
      throw error;
    }

    throw new FirebaseAdminUnavailableError(error);
  }
}

export function getAdminFirestore(): Firestore {
  try {
    return getFirestore(initializeFirebaseAdmin());
  } catch (error) {
    if (error instanceof FirebaseAdminUnavailableError) {
      throw error;
    }

    throw new FirebaseAdminUnavailableError(error);
  }
}

export function isFirebaseAdminUnavailableError(error: unknown): boolean {
  if (error instanceof FirebaseAdminUnavailableError) {
    return true;
  }

  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false;
  }

  const code = String(error.code);
  return [
    'app/credential-fetch-failed',
    'app/invalid-credential',
    'auth/insufficient-permission',
    'auth/internal-error',
    'auth/invalid-credential',
    'auth/network-request-failed',
  ].includes(code);
}
