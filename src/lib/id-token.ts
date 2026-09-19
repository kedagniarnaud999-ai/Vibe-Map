import { createPublicKey, verify as verifySignature } from 'node:crypto';
import type { DecodedIdToken } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { getAdminAuth, isFirebaseAdminUnavailableError } from './firebase-admin.ts';

const SIGNING_KEYS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const PROJECT_ID = firebaseConfig.projectId;
const EXPECTED_ISSUER = `https://securetoken.google.com/${PROJECT_ID}`;
const SIGNING_KEY_TTL_MS = 3_600_000;
const FORCED_REFRESH_COOLDOWN_MS = 30_000;
const MAX_UID_LENGTH = 128;

export class InvalidIdTokenError extends Error {
  constructor(message: string) {
    super(`Invalid ID token: ${message}`);
    this.name = 'InvalidIdTokenError';
  }
}

export class IdTokenVerificationUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('ID token verification is unavailable');
    this.name = 'IdTokenVerificationUnavailableError';
    this.cause = cause;
  }
}

export function isVerificationUnavailable(error: unknown): boolean {
  return isFirebaseAdminUnavailableError(error)
    || error instanceof IdTokenVerificationUnavailableError;
}

function decodeJsonSegment(segment: string, label: string): Record<string, unknown> {
  const bytes = Buffer.from(segment, 'base64url');
  if (bytes.toString('base64url') !== segment) {
    throw new InvalidIdTokenError(`${label} is not valid base64url`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new InvalidIdTokenError(`${label} is not valid JSON`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new InvalidIdTokenError(`${label} is not an object`);
  }

  return parsed as Record<string, unknown>;
}

function requireStringClaim(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  if (typeof value !== 'string' || !value) {
    throw new InvalidIdTokenError(`Missing ${key} claim`);
  }

  return value;
}

function requireNumericClaim(payload: Record<string, unknown>, key: string): number {
  const value = payload[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new InvalidIdTokenError(`Missing ${key} claim`);
  }

  return value;
}

function assertStandardClaims(payload: Record<string, unknown>): void {
  const now = Math.floor(Date.now() / 1000);

  if (requireStringClaim(payload, 'iss') !== EXPECTED_ISSUER) {
    throw new InvalidIdTokenError('Mismatched issuer');
  }

  if (requireStringClaim(payload, 'aud') !== PROJECT_ID) {
    throw new InvalidIdTokenError('Mismatched audience');
  }

  if (requireNumericClaim(payload, 'exp') <= now) {
    throw new InvalidIdTokenError('Expired token');
  }

  const notBefore = payload.nbf;
  if (typeof notBefore === 'number' && notBefore > now) {
    throw new InvalidIdTokenError('Token not yet valid');
  }

  requireNumericClaim(payload, 'iat');
  requireNumericClaim(payload, 'auth_time');

  const uid = requireStringClaim(payload, 'sub');
  if (uid.length > MAX_UID_LENGTH) {
    throw new InvalidIdTokenError('Oversized subject');
  }

  const firebasePayload = payload.firebase;
  if (!firebasePayload || typeof firebasePayload !== 'object') {
    throw new InvalidIdTokenError('Missing firebase metadata');
  }
}

interface SigningKeyCache {
  keys: Map<string, string>;
  fetchedAt: number;
}

let signingKeyCache: SigningKeyCache | undefined;

async function fetchSigningKeys(): Promise<Map<string, string>> {
  let response: Response;
  try {
    response = await fetch(SIGNING_KEYS_URL, { headers: { accept: 'application/json' } });
  } catch (error) {
    throw new IdTokenVerificationUnavailableError(error);
  }

  if (!response.ok) {
    throw new IdTokenVerificationUnavailableError(
      new Error(`Signing key directory responded ${response.status}`),
    );
  }

  const body = await response.json().catch((error) => {
    throw new IdTokenVerificationUnavailableError(error);
  }) as Record<string, unknown>;

  const keys = new Map<string, string>();
  for (const [kid, certificate] of Object.entries(body)) {
    if (typeof certificate === 'string' && certificate.includes('BEGIN CERTIFICATE')) {
      keys.set(kid, certificate);
    }
  }

  if (keys.size === 0) {
    throw new IdTokenVerificationUnavailableError(new Error('Signing key directory was empty'));
  }

  return keys;
}

async function getSigningCertificate(kid: string): Promise<string> {
  const now = Date.now();
  if (!signingKeyCache || now - signingKeyCache.fetchedAt > SIGNING_KEY_TTL_MS) {
    signingKeyCache = { keys: await fetchSigningKeys(), fetchedAt: now };
  }

  const cached = signingKeyCache.keys.get(kid);
  if (cached) {
    return cached;
  }

  // Google rotates keys before our TTL ends; one refetch per cooldown absorbs that
  // without letting a forged key id turn every request into a remote fetch.
  if (now - signingKeyCache.fetchedAt < FORCED_REFRESH_COOLDOWN_MS) {
    throw new InvalidIdTokenError('Unknown signing key');
  }

  signingKeyCache = { keys: await fetchSigningKeys(), fetchedAt: now };
  const refreshed = signingKeyCache.keys.get(kid);
  if (!refreshed) {
    throw new InvalidIdTokenError('Unknown signing key');
  }

  return refreshed;
}

/**
 * Signature + registered-claims check against Google's public keys. It cannot honour
 * `revokeRefreshTokens`, so a revoked token still verifies until its own expiry.
 */
export async function verifyIdTokenWithJwks(token: string): Promise<DecodedIdToken> {
  const segments = token.split('.');
  if (segments.length !== 3 || !segments[0] || !segments[1] || !segments[2]) {
    throw new InvalidIdTokenError('Expected three segments');
  }

  const [headerSegment, payloadSegment, signatureSegment] = segments;
  const header = decodeJsonSegment(headerSegment, 'header');
  if (header.alg !== 'RS256') {
    throw new InvalidIdTokenError('Unsupported algorithm');
  }

  const kid = typeof header.kid === 'string' ? header.kid : '';
  if (!kid) {
    throw new InvalidIdTokenError('Missing key id');
  }

  const certificate = await getSigningCertificate(kid);
  let publicKey;
  try {
    publicKey = createPublicKey({ key: certificate, format: 'pem' });
  } catch (error) {
    throw new IdTokenVerificationUnavailableError(error);
  }

  const signature = Buffer.from(signatureSegment, 'base64url');
  const isValid = verifySignature(
    'RSA-SHA256',
    Buffer.from(`${headerSegment}.${payloadSegment}`),
    publicKey,
    signature,
  );

  if (!isValid) {
    throw new InvalidIdTokenError('Signature mismatch');
  }

  const payload = decodeJsonSegment(payloadSegment, 'payload');
  assertStandardClaims(payload);

  return {
    ...payload,
    aud: requireStringClaim(payload, 'aud'),
    auth_time: requireNumericClaim(payload, 'auth_time'),
    exp: requireNumericClaim(payload, 'exp'),
    firebase: payload.firebase as DecodedIdToken['firebase'],
    iat: requireNumericClaim(payload, 'iat'),
    iss: requireStringClaim(payload, 'iss'),
    sub: requireStringClaim(payload, 'sub'),
    uid: requireStringClaim(payload, 'sub'),
  };
}

let adminVerificationUnavailable = false;

export async function verifyIdToken(token: string): Promise<DecodedIdToken> {
  // The Admin SDK is preferred because it also checks revocation; a project that cannot
  // mint server credentials (AI Studio free tier) falls back to public-key verification.
  if (!adminVerificationUnavailable) {
    try {
      return await getAdminAuth().verifyIdToken(token, true);
    } catch (error) {
      if (!isFirebaseAdminUnavailableError(error)) {
        throw error;
      }

      adminVerificationUnavailable = true;
    }
  }

  return verifyIdTokenWithJwks(token);
}
