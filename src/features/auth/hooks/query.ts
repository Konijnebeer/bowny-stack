import { useSuspenseQuery } from "@tanstack/react-query"

import { authClient } from "#/features/auth/lib/auth-client"

async function fetchAccount() {
  const { data, error } = await authClient.getSession()

  if (error) {
    throw new Error(error.message || "Failed to fetch account information")
  }

  return data
}

export const accountQueryOptions = {
  queryKey: ["account"],
  queryFn: fetchAccount,
  staleTime: Infinity,
}

export function useAccountQuery() {
  return useSuspenseQuery(accountQueryOptions)
}
