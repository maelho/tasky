"use client";

import { useMemo } from "react";
import {
  useAuth as useClerkAuth,
  useOrganization,
  useUser,
} from "@clerk/nextjs";

import type { AuthState, ContextOrganization, ContextUser } from "~/types/auth";

export function useAuth(): AuthState & {
  signOut: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
  getAuthToken: () => Promise<string | null>;
} {
  const {
    isLoaded: isAuthLoaded,
    userId,
    orgId,
    getToken,
    signOut: clerkSignOut,
    has,
  } = useClerkAuth();

  const { user, isLoaded: isUserLoaded } = useUser();
  const {
    organization,
    isLoaded: isOrgLoaded,
    memberships,
  } = useOrganization();

  const isLoaded = isAuthLoaded && isUserLoaded && isOrgLoaded;
  const isSignedIn = Boolean(userId);
  const isLoading = !isLoaded;

  const contextUser = useMemo((): ContextUser | null => {
    if (!user) return null;

    const firstName = user.firstName ?? "";
    const lastName = user.lastName ?? "";
    const fullNameTrimmed = `${firstName} ${lastName}`.trim();
    const displayName =
      fullNameTrimmed === "" ? "Unknown User" : fullNameTrimmed;

    return {
      userId: user.id,
      firstName,
      lastName,
      fullName: displayName,
      imageUrl: user.imageUrl ?? "",
      email: user.primaryEmailAddress?.emailAddress,
      username: user.username ?? undefined,
    };
  }, [user]);

  const contextOrganization = useMemo((): ContextOrganization | null => {
    if (!organization || !orgId) return null;

    const currentMembership = memberships?.data?.find(
      (membership) => membership.organization.id === orgId,
    );

    return {
      orgId: organization.id,
      role: currentMembership?.role,
      permissions: currentMembership?.permissions ?? [],
    };
  }, [organization, orgId, memberships]);

  const signOut = async () => {
    await clerkSignOut();
  };

  const switchOrganization = async (_newOrgId: string) => {
    // Note: setActive is available from useOrganizationList hook, not useOrganization
    // This function would need to be implemented using useOrganizationList or Clerk instance
    console.warn(
      "switchOrganization: Implementation needed with useOrganizationList or Clerk instance",
    );
    // Placeholder implementation - in real usage, you'd need to use:
    // const { setActive } = useOrganizationList();
    // await setActive({ organization: _newOrgId });
  };

  const hasPermission = (permission: string): boolean => {
    if (!isSignedIn) return false;
    return has?.({ permission }) ?? false;
  };

  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await getToken();
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  };

  return {
    isLoaded,
    isSignedIn,
    isLoading,
    userId: userId ?? null,
    orgId: orgId ?? null,
    user: contextUser,
    organization: contextOrganization,
    signOut,
    switchOrganization,
    hasPermission,
    getAuthToken,
  };
}

export function useOrganizationAccess() {
  const { isSignedIn, orgId, organization } = useAuth();

  return {
    hasOrgAccess: isSignedIn && Boolean(orgId),
    currentOrgId: orgId,
    currentOrg: organization,
    requiresOrgSelection: isSignedIn && !orgId,
  };
}

export function useOrganizationRole() {
  const { organization, hasPermission } = useAuth();

  const isAdmin = hasPermission("org:admin");
  const isMember = hasPermission("org:member");
  const isOwner = hasPermission("org:owner");

  return {
    role: organization?.role,
    permissions: organization?.permissions ?? [],
    isAdmin,
    isMember,
    isOwner,
    hasPermission,
  };
}

export function useAuthLoading() {
  const { isLoaded, isLoading } = useAuth();

  return {
    isLoaded,
    isLoading,
    showLoadingSpinner: isLoading,
  };
}
