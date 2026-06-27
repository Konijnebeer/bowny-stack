import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { auth } from "#/lib/auth"
import { authClient } from "#/lib/auth-client"

export const ensureSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error("Unauthorized")
    }

    return session
  }
)

async function fetchAccount() {
  const { data, error } = await authClient.getSession()

  if (error) {
    throw new Error(error.message || "Failed to fetch account information")
  }

  return data
}

export const accountQueryOptions = queryOptions({
  queryKey: ["account"] as const,
  queryFn: fetchAccount,
  staleTime: Infinity,
})

export function useAccountQuery() {
  return useSuspenseQuery(accountQueryOptions)
}
