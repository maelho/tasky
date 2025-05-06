import 'server-only'

import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { cache } from 'react'
import { env } from '~/env'
import { type AppRouter, createCaller } from '~/server/api/root'
import { createTRPCContext } from '~/server/api/trpc'
import { createQueryClient } from './query-client'

import { getAuth } from '@clerk/nextjs/server'
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads,
    clerkAuth: getAuth(new NextRequest(env.NEXT_PUBLIC_APP_URL, { headers: headers() })),
  })
})

const getQueryClient = cache(createQueryClient)
const caller = createCaller(createContext)

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(caller, getQueryClient)
