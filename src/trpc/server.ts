import "server-only";

import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { createCaller, type AppRouter } from "~/server/api/root";
import { createRSCContext } from "~/server/api/trpc";

import { createQueryClient } from "./query-client";

const createContext = cache(createRSCContext);
const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
