import type { Session, User } from "better-auth"
import type { QueryClient } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"

import { accountQueryOptions } from "#/features/auth"

async function loadAuth(
  queryClient: QueryClient
): Promise<{ user: User | null; session: Session | null }> {
  const session = await queryClient.ensureQueryData(accountQueryOptions)
  if (!session) return { user: null, session: null }
  return { user: session.user, session: session.session }
}

async function checkAuth(
  queryClient: QueryClient,
  location?: string
): Promise<{ user: User; session: Session }> {
  const session = await queryClient.ensureQueryData(accountQueryOptions)
  if (!session)
    throw redirect({
      to: "/login",
      search: location ? { location } : undefined,
    })
  return { user: session.user, session: session.session }
}

export { checkAuth, loadAuth }
