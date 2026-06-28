import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { auth } from "#/lib/auth"

const fetchAccount = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders()
  return await auth.api.getSession({ headers })
})

export const accountQueryOptions = queryOptions({
  queryKey: ["account"] as const,
  queryFn: () => fetchAccount(),
  staleTime: Infinity,
})

export function useAccountQuery() {
  return useSuspenseQuery(accountQueryOptions)
}
