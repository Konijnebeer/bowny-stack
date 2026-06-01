import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"

import * as schema from "#/db/schema.ts"
import { env } from "#/env"

let client: Database.Database

export function getClient() {
  if (!client) {
    client = new Database(env.DATABASE_URL)
  }
  return client
}

let db: ReturnType<typeof drizzle>

export function getDB() {
  if (!db) {
    db = drizzle(getClient(), { schema })
  }
  return db
}
