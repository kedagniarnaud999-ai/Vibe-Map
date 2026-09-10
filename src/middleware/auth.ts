import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import {
  getAdminAuth,
  isFirebaseAdminUnavailableError,
} from '../lib/firebase-admin.ts';
import type { UserRole } from '../types.ts';

const USER_ROLES: readonly UserRole[] = ['traveler', 'guide', 'admin'];

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

function getBearerToken(authHeader: string | undefined): string | undefined {
  if (!authHeader?.startsWith('Bearer ')) {
    return undefined;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  return token || undefined;
}

function unauthorized(res: Response, message: string) {
  return res.status(401).json({ error: `Unauthorized: ${message}` });
}

function authorizeRoles(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
  allowedRoles: readonly UserRole[],
) {
  const user = req.user;
  if (!user) {
    return unauthorized(res, 'Missing token');
  }

  if (!allowedRoles.includes(getAuthenticatedRole(req))) {
    return res.status(403).json({ error: 'Forbidden: Insufficient role' });
  }

  return next();
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return unauthorized(res, 'Missing token');
  }

  try {
    req.user = await getAdminAuth().verifyIdToken(token, true);
    return next();
  } catch (error) {
    if (isFirebaseAdminUnavailableError(error)) {
      return res.status(503).json({ error: 'Authentication service unavailable' });
    }

    return unauthorized(res, 'Invalid token');
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (allowedRoles.length === 0) {
    return res.status(500).json({ error: 'Role guard misconfigured' });
  }

  if (req.user) {
    return authorizeRoles(req, res, next, allowedRoles);
  }

  return requireAuth(req, res, () => authorizeRoles(req, res, next, allowedRoles));
};

export const requireAdmin = requireRole('admin');

export function getAuthenticatedUser(req: AuthRequest): DecodedIdToken {
  if (!req.user) {
    throw new Error('Authenticated user is required');
  }

  return req.user;
}

export function getAuthenticatedUid(req: AuthRequest): string {
  return getAuthenticatedUser(req).uid;
}

export function getAuthenticatedEmail(req: AuthRequest): string | undefined {
  return getAuthenticatedUser(req).email;
}

export function getAuthenticatedRole(req: AuthRequest): UserRole {
  const role = getAuthenticatedUser(req).role;
  return USER_ROLES.includes(role as UserRole) ? role as UserRole : 'traveler';
}
