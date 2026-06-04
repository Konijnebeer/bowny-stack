import { and, asc, count, desc, eq, ilike } from "drizzle-orm"
import type { QueryClient } from "@tanstack/react-query"
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { auth, users } from "#/features/auth"

import { getDB } from "#/db"
import type { GetUsersInput, Role } from "#/features/user/schema"
import {
  banServerSchema,
  getUsersInputSchema,
  revokeSessionSchema,
  seedUsersSchema,
  setRoleServerSchema,
  userIdSchema,
} from "#/features/user/schema"
import {
  DOMAINS,
  FIRST_NAMES,
  LAST_NAMES,
  SEED_ROLES,
} from "#/features/user/seed-data"
import { roleMiddleware } from "#/middleware/role"

const PAGE_SIZE = 20

// --- List users ---

const getUsers = createServerFn({ method: "GET" })
  .inputValidator(getUsersInputSchema)
  .middleware([roleMiddleware({ user: ["list"] })])
  .handler(async ({ data }) => {
    const db = getDB()
    const conditions = []

    if (data.searchValue) {
      const pattern = `%${data.searchValue}%`
      conditions.push(
        ilike(data.searchField === "email" ? users.email : users.name, pattern)
      )
    }

    if (data.filterField === "role" && data.filterValue) {
      conditions.push(eq(users.role, data.filterValue))
    }

    const where = conditions.length ? and(...conditions) : undefined

    let orderBy
    if (data.sortBy === "email") {
      orderBy =
        data.sortDirection === "desc" ? desc(users.email) : asc(users.email)
    } else if (data.sortBy === "name") {
      orderBy =
        data.sortDirection === "desc" ? desc(users.name) : asc(users.name)
    } else {
      orderBy = asc(users.createdAt)
    }

    const limit = data.limit ?? PAGE_SIZE
    const offset = data.offset ?? 0

    const [rows, [{ total }]] = await Promise.all([
      db
        .select()
        .from(users)
        .where(where)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(users).where(where),
    ])

    return { users: rows, total }
  })

export const getUsersQueryOptions = (params: GetUsersInput = {}) => ({
  queryKey: ["users", params],
  queryFn: () => getUsers({ data: params }),
  staleTime: 1000 * 60 * 5,
})

export function useGetUsers(params: GetUsersInput = {}) {
  return useQuery(getUsersQueryOptions(params))
}

type InfiniteParams = Omit<GetUsersInput, "offset" | "limit">

export function useGetUsersInfinite(params: InfiniteParams = {}) {
  return useInfiniteQuery({
    queryKey: ["users", "infinite", params],
    queryFn: ({ pageParam }) =>
      getUsers({ data: { ...params, offset: pageParam, limit: PAGE_SIZE } }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.flatMap((p) => p.users).length
      return fetched < lastPage.total ? fetched : undefined
    },
    staleTime: 1000 * 60 * 5,
  })
}

// --- Seed users ---

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const seedUsers = createServerFn({ method: "POST" })
  .inputValidator(seedUsersSchema)
  .middleware([roleMiddleware({ user: ["create"] })])
  .handler(async ({ data }) => {
    const request = getRequest()
    let created = 0

    for (let i = 0; i < data.count; i++) {
      const firstName = randomItem(FIRST_NAMES)
      const lastName = randomItem(LAST_NAMES)
      const domain = randomItem(DOMAINS)
      const suffix = Math.floor(Math.random() * 9000) + 1000
      const name = `${firstName} ${lastName}`
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@${domain}`
      const role = randomItem(SEED_ROLES)

      try {
        await auth.api.createUser({
          headers: request.headers,
          body: { name, email, password: "Password123!", role },
        })
        created++
      } catch {
        // skip email collisions silently
      }
    }

    return { created }
  })

export function useSeedUsers(queryClient: QueryClient) {
  return useMutation({
    mutationFn: (seedCount: number) =>
      seedUsers({ data: { count: seedCount } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "infinite"] })
    },
  })
}

// --- Get user by ID ---

const getUserById = createServerFn({ method: "GET" })
  .inputValidator(userIdSchema)
  .middleware([roleMiddleware({ user: ["get"] })])
  .handler(async ({ data }) => {
    const request = getRequest()
    return auth.api.getUser({
      headers: request.headers,
      query: { id: data.id },
    })
  })

export const getUserQueryOptions = (id: string) => ({
  queryKey: ["users", id],
  queryFn: () => getUserById({ data: { id } }),
  staleTime: 1000 * 60 * 5,
})

export function useGetUser(id: string) {
  return useSuspenseQuery(getUserQueryOptions(id))
}

// --- List user sessions ---

const getUserSessions = createServerFn({ method: "GET" })
  .inputValidator(userIdSchema)
  .middleware([roleMiddleware({ session: ["list"] })])
  .handler(async ({ data }) => {
    const request = getRequest()
    const result = await auth.api.listUserSessions({
      headers: request.headers,
      body: { userId: data.id },
    })
    return result.sessions
  })

export const getUserSessionsQueryOptions = (id: string) => ({
  queryKey: ["users", id, "sessions"],
  queryFn: () => getUserSessions({ data: { id } }),
  staleTime: 0,
})

export function useGetUserSessions(id: string) {
  return useSuspenseQuery(getUserSessionsQueryOptions(id))
}

// --- Revoke single session ---

const revokeSession = createServerFn({ method: "POST" })
  .inputValidator(revokeSessionSchema)
  .middleware([roleMiddleware({ session: ["revoke"] })])
  .handler(async ({ data }) => {
    const request = getRequest()
    return auth.api.revokeUserSession({
      headers: request.headers,
      body: { sessionToken: data.sessionToken },
    })
  })

export function useRevokeSession(id: string, queryClient: QueryClient) {
  return useMutation({
    mutationFn: (sessionToken: string) =>
      revokeSession({ data: { sessionToken, id } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["users", id, "sessions"] }),
  })
}

// --- Revoke all sessions ---

const revokeAllSessions = createServerFn({ method: "POST" })
  .inputValidator(userIdSchema)
  .middleware([roleMiddleware({ session: ["revoke"] })])
  .handler(async ({ data }) => {
    const request = getRequest()
    return auth.api.revokeUserSessions({
      headers: request.headers,
      body: { userId: data.id },
    })
  })

export function useRevokeAllSessions(id: string, queryClient: QueryClient) {
  return useMutation({
    mutationFn: () => revokeAllSessions({ data: { id } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["users", id, "sessions"] }),
  })
}

// --- Set role ---

const setUserRole = createServerFn({ method: "POST" })
  .inputValidator(setRoleServerSchema)
  .middleware([roleMiddleware({ user: ["set-role"] })])
  .handler(async ({ data }) => {
    const request = getRequest()
    return auth.api.setRole({
      headers: request.headers,
      body: { userId: data.id, role: data.role },
    })
  })

export function useSetUserRole(id: string, queryClient: QueryClient) {
  return useMutation({
    mutationFn: (role: Role) => setUserRole({ data: { id, role } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", id] })
      queryClient.invalidateQueries({ queryKey: ["users", "infinite"] })
    },
  })
}

// --- Ban user ---

const banUser = createServerFn({ method: "POST" })
  .inputValidator(banServerSchema)
  .middleware([roleMiddleware({ user: ["ban"] })])
  .handler(async ({ data }) => {
    const request = getRequest()
    return auth.api.banUser({
      headers: request.headers,
      body: {
        userId: data.id,
        banReason: data.banReason,
        banExpiresIn: data.banExpiresIn,
      },
    })
  })

export function useBanUser(id: string, queryClient: QueryClient) {
  return useMutation({
    mutationFn: (input: { banReason?: string; banExpiresIn?: number }) =>
      banUser({ data: { id, ...input } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", id] }),
  })
}

// --- Unban user ---

const unbanUser = createServerFn({ method: "POST" })
  .inputValidator(userIdSchema)
  .middleware([roleMiddleware({ user: ["ban"] })])
  .handler(async ({ data }) => {
    const request = getRequest()
    return auth.api.unbanUser({
      headers: request.headers,
      body: { userId: data.id },
    })
  })

export function useUnbanUser(id: string, queryClient: QueryClient) {
  return useMutation({
    mutationFn: () => unbanUser({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", id] }),
  })
}
