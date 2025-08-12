import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards, type EntityType } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

import { createCrudHandlers } from "../../shared/crud-handler";
import { requireOrgAccess, validateOrgAccess } from "../../shared/db-utils";
import type * as Schema from "./board.schema";

type Board<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

const boardCrud = createCrudHandlers({
  table: boards,
  entityType: "BOARD" as EntityType,
  entityName: "Board",
  orgAccessCondition: (orgId: string) => eq(boards.orgId, orgId),
});

export async function createBoard({ ctx, input }: Board<Schema.TCreateBoard>) {
  requireOrgAccess(ctx);
  validateOrgAccess(ctx, input.orgId);

  return await boardCrud.create(ctx, {
    title: input.title,
    orgId: input.orgId,
  });
}

export async function getBoards({ ctx, input }: Board<Schema.TGetBoards>) {
  validateOrgAccess(ctx, input.orgId);

  const boardResults = await boardCrud.findMany(
    ctx,
    eq(boards.orgId, input.orgId),
  );
  return boardResults ?? null;
}

export async function getBoardById({
  ctx,
  input,
}: Board<Schema.TGetBoardById>) {
  validateOrgAccess(ctx, input.orgId);

  const board = await ctx.db
    .select()
    .from(boards)
    .where(and(eq(boards.id, input.boardId), eq(boards.orgId, input.orgId)))
    .get();

  return board ?? null;
}

export async function deleteBoard({ ctx, input }: Board<Schema.TDeleteBoard>) {
  requireOrgAccess(ctx);

  const board = await boardCrud.delete(ctx, input.boardId);
  return board ?? null;
}

export async function updateBoard({ ctx, input }: Board<Schema.TUpdateBoard>) {
  requireOrgAccess(ctx);

  const board = await boardCrud.update(ctx, input.boardId, {
    title: input.title,
  });

  return board ?? null;
}
