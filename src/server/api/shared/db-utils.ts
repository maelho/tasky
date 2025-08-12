/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unnecessary-type-assertion */
import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { auditLogs, type Action, type EntityType } from "~/server/db/schema";
import { eq, type SQL } from "drizzle-orm";

export async function validateOrgId(
  ctx: ProtectedTRPCContext,
): Promise<string> {
  const orgId = ctx.auth.orgId;
  if (!orgId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Organization access required",
    });
  }
  return orgId;
}

export function requireOrgAccess(ctx: ProtectedTRPCContext) {
  const orgId = ctx.auth.orgId;
  if (!orgId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Organization access required",
    });
  }
  return { ...ctx, auth: { ...ctx.auth, orgId } };
}

export function validateOrgAccess(
  ctx: ProtectedTRPCContext,
  inputOrgId: string,
): void {
  if (ctx.auth.orgId !== inputOrgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization access denied",
    });
  }
}

export async function createAuditLog(
  ctx: ProtectedTRPCContext,
  params: {
    orgId: string;
    action: Action;
    entityId: number;
    entityType: EntityType;
    entityTitle: string;
  },
) {
  try {
    const userId = ctx.auth.userId;
    const sessionClaims = ctx.auth.sessionClaims;
    const firstName = sessionClaims?.firstName as string | undefined;
    const lastName = sessionClaims?.lastName as string | undefined;
    const imageUrl = sessionClaims?.imageUrl as string | undefined;
    const fullName =
      `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Unknown User";

    await ctx.db.insert(auditLogs).values({
      orgId: params.orgId,
      action: params.action,
      entityId: params.entityId,
      entityType: params.entityType,
      entityTitle: params.entityTitle,
      userId,
      userImage: imageUrl ?? "",
      userName: fullName,
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export async function createOrgAuditLog(
  orgCtx: ProtectedTRPCContext & { auth: { orgId: string } },
  params: {
    action: Action;
    entityId: number;
    entityType: EntityType;
    entityTitle: string;
  },
) {
  await createAuditLog(orgCtx, {
    orgId: orgCtx.auth.orgId,
    ...params,
  });
}

export function createOrgAccessCondition<T extends { orgId: any }>(
  table: T,
  orgId: string,
): SQL {
  return eq(table.orgId as any, orgId);
}

export async function executeInTransaction<T>(
  ctx: ProtectedTRPCContext,
  callback: (tx: any) => Promise<T>,
): Promise<T> {
  return await ctx.db.transaction(callback);
}
