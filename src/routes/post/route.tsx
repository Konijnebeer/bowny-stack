import { createFileRoute, Outlet } from "@tanstack/react-router"

import { checkAuth } from "#/lib/route-guard"

export const Route = createFileRoute("/post")({
  beforeLoad: async ({ location }) => {
    await checkAuth(location.pathname)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Outlet />
    </main>
  )
}
