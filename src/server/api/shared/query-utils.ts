/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import {
  and,
  asc,
  desc,
  eq,
  exists,
  sql,
  type AnyColumn,
  type SQL,
} from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

export type SortOrder = "asc" | "desc";

export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export type SortOptions<T extends Record<string, AnyColumn>> = {
  sortBy?: keyof T;
  sortOrder?: SortOrder;
};

export type QueryOptions<T extends Record<string, AnyColumn>> =
  PaginationOptions & SortOptions<T>;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
} as const;

export const MAX_LIMIT = 100;

export const normalizePagination = (
  options: PaginationOptions = {},
): Required<PaginationOptions> => {
  const page = Math.max(1, options.page ?? DEFAULT_PAGINATION.page);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, options.limit ?? DEFAULT_PAGINATION.limit),
  );

  return { page, limit };
};

export const createPaginationClause = (options: PaginationOptions = {}) => {
  const { page, limit } = normalizePagination(options);
  const offset = (page - 1) * limit;

  return {
    limit,
    offset,
  };
};

export const createSortClause = <T extends Record<string, AnyColumn>>(
  table: T,
  options: SortOptions<T> = {},
) => {
  const { sortBy, sortOrder = "desc" } = options;

  if (!sortBy || !(sortBy in table) || !table.createdAt) {
    return table.createdAt ? [desc(table.createdAt)] : [];
  }

  const column = table[sortBy];
  return column ? (sortOrder === "asc" ? [asc(column)] : [desc(column)]) : [];
};

export const buildOrgAccessCondition = <T extends SQLiteTable<any>>(
  table: T,
  orgId: string,
): SQL => {
  const orgIdColumn = (table as any).orgId;
  return eq(orgIdColumn, orgId);
};

export const buildNestedOrgAccessCondition = <U extends SQLiteTable<any>>(
  ctx: ProtectedTRPCContext,
  joinTable: U,
  joinCondition: SQL,
): SQL => {
  const orgId = ctx.auth.orgId!;
  const orgIdColumn = (joinTable as any).orgId;

  return exists(
    ctx.db
      .select()
      .from(joinTable)
      .where(and(joinCondition, eq(orgIdColumn, orgId))),
  );
};

export const combineConditions = (
  ...conditions: (SQL | undefined)[]
): SQL | undefined => {
  const validConditions = conditions.filter((c): c is SQL => c !== undefined);

  if (validConditions.length === 0) return undefined;
  if (validConditions.length === 1) return validConditions[0];

  return and(...validConditions);
};

export const createBaseQuery = <T extends SQLiteTable<any>>(
  ctx: ProtectedTRPCContext,
  table: T,
) => ctx.db.select().from(table);

export const applyWhereClause = (query: any, condition?: SQL) => {
  if (condition) {
    return query.where(condition);
  }
  return query;
};

export const applyOrderBy = (query: any, orderClauses: SQL[]) => {
  if (orderClauses.length > 0) {
    return query.orderBy(...orderClauses);
  }
  return query;
};

export const applyPagination = (
  query: any,
  options: PaginationOptions = {},
) => {
  const { limit, offset } = createPaginationClause(options);
  return query.limit(limit).offset(offset);
};

export const createOptimizedQuery = <T extends SQLiteTable<any>>(
  ctx: ProtectedTRPCContext,
  table: T,
  options: {
    where?: SQL;
    sort?: SortOptions<Record<string, AnyColumn>>;
    pagination?: PaginationOptions;
  } = {},
) => {
  let query = createBaseQuery(ctx, table);

  if (options.where) {
    query = query.where(options.where) as any;
  }

  const sortClauses = createSortClause(table as any, options.sort);
  if (sortClauses.length > 0) {
    query = query.orderBy(...sortClauses) as any;
  }

  if (options.pagination) {
    const { limit, offset } = createPaginationClause(options.pagination);
    query = query.limit(limit).offset(offset) as any;
  }

  return query;
};

export const createCountQuery = <T extends SQLiteTable<any>>(
  ctx: ProtectedTRPCContext,
  table: T,
  condition?: SQL,
) => {
  const query = ctx.db.select({ count: sql<number>`count(*)` }).from(table);
  return condition ? query.where(condition) : query;
};

export const withPaginationMeta = async <T>(
  dataQuery: Promise<T[]>,
  countQuery: Promise<{ count: number }[]>,
  options: PaginationOptions = {},
) => {
  const [data, countResult] = await Promise.all([dataQuery, countQuery]);
  const total = Number(countResult[0]?.count ?? 0);
  const { page, limit } = normalizePagination(options);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export const createBatchQuery = <T extends { id: number }>(
  ctx: ProtectedTRPCContext,
  queries: Promise<T>[],
) => {
  return ctx.db.transaction(async () => {
    return await Promise.all(queries);
  });
};

export const optimizeInClause = <T>(values: T[]): T[] => {
  if (values.length <= 1000) return values;
  return values.slice(0, 1000);
};
