import type { NeonHttpDatabase } from "drizzle-orm/neon-http"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { env } from "#/env"
import * as schema from "#/db/schema.ts"

let client: ReturnType<typeof neon>

// Removed async
export function getClient() {
  if (!client) {
    // client = await neon(env.DATABASE_URL!) // No clue why it has await
    client = neon(env.DATABASE_URL)
  }
  return client
}

let db: NeonHttpDatabase<typeof schema>

export function getDB() {
  if (!db) {
    db = drizzle({ client: getClient(), schema })
  }
  return db
}
