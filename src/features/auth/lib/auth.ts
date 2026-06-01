import { betterAuth } from "better-auth"
import { admin as adminPlugin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import { getDB } from "#/db"
import * as schema from "#/db/schema"
import { ac, admin, user, guest } from "#/features/auth/lib/permissions"

export const auth = betterAuth({
  database: drizzleAdapter(getDB(), {
    provider: "pg",
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
  plugins: [
    adminPlugin({
      ac,
      roles: {
        guest,
        admin,
        user,
      },
    }),
    tanstackStartCookies(),
  ],
})
