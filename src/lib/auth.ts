import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import { getDB } from "#/db"
import * as schema from "#/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(getDB(), {
    provider: "sqlite",
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: {
    allowedHosts: ["localhost:3000", "localhost:4173"],
    protocol: "http",
    fallback: "http://localhost:3000",
  },
  plugins: [tanstackStartCookies()],
})
