import { createAuthClient } from 'better-auth/react'
// import { env } from "~/env";

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [],
})

export const { signIn, signOut, signUp, useSession } = authClient
