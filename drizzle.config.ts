import { defineConfig } from 'drizzle-kit'
import { env } from '~/env'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    // authToken: env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: ['tasky-v2_*'],
})
