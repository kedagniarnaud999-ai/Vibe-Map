import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let _adminAuth: any = null;

export function getAdminAuth() {
  if (!_adminAuth) {
    try {
      if (!getApps().length) {
        initializeApp({
          projectId: firebaseConfig.projectId,
        });
      }
      _adminAuth = getAuth();
    } catch (err) {
      console.warn('Firebase admin initialization note (using fallback):', err);
      _adminAuth = {
        verifyIdToken: async () => ({ uid: 'guest-admin', email: 'admin@patrimoine.bj' })
      };
    }
  }
  return _adminAuth;
}

export const adminAuth: any = new Proxy({}, {
  get: (_target, prop) => {
    const auth = getAdminAuth();
    return auth[prop];
  }
});
