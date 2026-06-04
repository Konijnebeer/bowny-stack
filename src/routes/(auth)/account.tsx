import type { ErrorComponentProps } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"

import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"

import {
  accountQueryOptions,
  authClient,
  checkAuth,
  useAccountQuery,
  useAuthStore,
} from "#/features/auth"

export const Route = createFileRoute("/(auth)/account")({
  beforeLoad: async ({ location }) => {
    await checkAuth(location.pathname)
  },
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(accountQueryOptions)
  },
  pendingMs: 300,
  pendingMinMs: 200,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  component: RouteComponent,
})

function PendingComponent() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-end justify-between py-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="mt-2 h-6 w-48" />
    </main>
  )
}

function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="text-center">
        Error loading account information: {error.message}
      </div>
    </main>
  )
}

function RouteComponent() {
  const accountQuery = useAccountQuery()
  const navigate = Route.useNavigate()
  const queryClient = Route.useRouteContext().queryClient

  function handleLogout() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          // Clear the session in the auth store
          useAuthStore.getState().setSession(null)
          // Make sure any data where authorization is required is cleared from the cache
          queryClient.clear()
          navigate({ to: "/login" })
        },
      },
    })
  }

  if (!accountQuery.data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="text-center">No account information found.</div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-end justify-between py-2">
        <h1 className="text-2xl">Account</h1>

        <Button variant="outline" onClick={handleLogout}>
          logout
        </Button>
      </div>
      <p>
        <strong>Name:</strong> {accountQuery.data.user.name}
        <Badge className="ml-2">{accountQuery.data.user.role}</Badge>
      </p>
      <p>
        <strong>Email:</strong> {accountQuery.data.user.email}
      </p>
      <div className="flex gap-4 pt-4">
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(accountQuery.data.user.createdAt).toLocaleDateString(
            "en-UK",
            { year: "numeric", month: "short", day: "numeric" }
          )}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(accountQuery.data.user.updatedAt).toLocaleDateString(
            "en-UK",
            { year: "numeric", month: "short", day: "numeric" }
          )}
        </p>
      </div>
      <p>
        <strong>Id:</strong> {accountQuery.data.user.id}
      </p>
      <pre>{JSON.stringify(accountQuery.data, null, 2)}</pre>
    </main>
  )
}
