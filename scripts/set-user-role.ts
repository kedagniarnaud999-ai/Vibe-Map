import {
  getAdminAuth,
  isFirebaseAdminUnavailableError,
} from '../src/lib/firebase-admin.ts';
import type { UserRole } from '../src/types.ts';

type RequestedRole = UserRole | 'none';

const USER_ROLES: readonly UserRole[] = ['traveler', 'guide', 'admin'];

function isRequestedRole(value: string | undefined): value is RequestedRole {
  return value === 'none' || USER_ROLES.includes(value as UserRole);
}

function isValidUid(uid: string | undefined): uid is string {
  return Boolean(uid && uid === uid.trim() && uid.length <= 128);
}

async function setUserRole(uid: string, role: RequestedRole) {
  const auth = getAdminAuth();
  const user = await auth.getUser(uid);
  const customClaims = { ...(user.customClaims ?? {}) };

  if (role === 'none') {
    delete customClaims.role;
  } else {
    customClaims.role = role;
  }

  await auth.setCustomUserClaims(uid, customClaims);
  await auth.revokeRefreshTokens(uid);
}

const [uid, role] = process.argv.slice(2);

if (!isValidUid(uid) || !isRequestedRole(role)) {
  console.error('Usage: npm run set-user-role -- <uid> <traveler|guide|admin|none>');
  process.exitCode = 1;
} else {
  try {
    await setUserRole(uid, role);
    console.log(`Updated role for ${uid}: ${role}`);
  } catch (error) {
    if (isFirebaseAdminUnavailableError(error)) {
      console.error('Firebase Admin is unavailable. Check the server credentials.');
    } else {
      console.error('Unable to update the user role:', error);
    }
    process.exitCode = 1;
  }
}
