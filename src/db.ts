import { drizzle as drizzleHttp } from "drizzle-orm/neon-http"
import { drizzle as drizzlePool } from "drizzle-orm/neon-serverless"
import { neon, Pool } from "@neondatabase/serverless"

import * as schema from "#/db/schema.ts"
import { env } from "#/env"

let client: ReturnType<typeof neon>

export function getClient() {
  if (!client) {
    client = neon(env.DATABASE_URL)
  }
  return client
}

let poolClient: Pool

export function getPoolClient() {
  if (!poolClient) {
    poolClient = new Pool({ connectionString: env.DATABASE_URL })
  }
  return poolClient
}

let db: ReturnType<typeof drizzleHttp>

export function getDB() {
  if (!db) {
    db = drizzleHttp({ client: getClient(), schema })
  }
  return db
}

let pool: ReturnType<typeof drizzlePool>

export function getPool() {
  if (!pool) {
    pool = drizzlePool({ client: getPoolClient(), schema })
  }
  return pool
}
