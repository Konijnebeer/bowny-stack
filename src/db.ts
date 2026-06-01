import { drizzle as drizzleHttp } from "drizzle-orm/neon-http"
import { drizzle as drizzlePool } from "drizzle-orm/neon-serverless"
import { NeonHttpDatabase } from "drizzle-orm/neon-http"
import { NeonDatabase } from "drizzle-orm/neon-serverless"
import { neon, Pool } from "@neondatabase/serverless"

import * as schema from "#/db/schema.ts"
import { env } from "#/env"

type HttpDB = NeonHttpDatabase<typeof schema>
type PoolDB = NeonDatabase<typeof schema>

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

let db: HttpDB

export function getDB() {
  if (!db) {
    db = drizzleHttp({ client: getClient(), schema }) as HttpDB
  }
  return db
}

let pool: PoolDB

export function getPool() {
  if (!pool) {
    pool = drizzlePool({ client: getPoolClient(), schema })
  }
  return pool
}
