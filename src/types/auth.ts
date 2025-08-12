export interface ExtendedSessionClaims {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  email?: string;
  username?: string;
  metadata?: {
    onboardingComplete?: boolean;
    role?: string;
    preferences?: Record<string, unknown>;
  };
}

export interface ContextUser {
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  fullName: string;
  email?: string;
  username?: string;
}

export interface ContextOrganization {
  orgId: string;
  role?: string;
  permissions?: string[];
}

export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  orgId: string | null;
  user: ContextUser | null;
  organization: ContextOrganization | null;
}

export interface AuditLogUser {
  userId: string;
  userName: string;
  userImage: string;
}

export enum PermissionLevel {
  READ = "read",
  WRITE = "write",
  ADMIN = "admin",
  OWNER = "owner",
}

export enum OrganizationRole {
  MEMBER = "org:member",
  ADMIN = "org:admin",
}

export function hasOrganizationAccess(auth: {
  userId?: string | null;
  orgId?: string | null;
}): auth is { userId: string; orgId: string } {
  return !!auth.userId && !!auth.orgId;
}

export function isAuthenticated(auth: {
  userId?: string | null;
}): auth is { userId: string } {
  return !!auth.userId;
}

export enum AuthErrorType {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  ORGANIZATION_REQUIRED = "ORGANIZATION_REQUIRED",
  INVALID_SESSION = "INVALID_SESSION",
  PERMISSION_DENIED = "PERMISSION_DENIED",
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface RouteConfig {
  path: string;
  requireAuth: boolean;
  requireOrg: boolean;
  permissions?: PermissionLevel[];
  roles?: OrganizationRole[];
}

export interface MiddlewareContext {
  userId?: string;
  orgId?: string;
  sessionId?: string;
  sessionClaims?: ExtendedSessionClaims;
  isPublicRoute: boolean;
  requiresOrg: boolean;
}
