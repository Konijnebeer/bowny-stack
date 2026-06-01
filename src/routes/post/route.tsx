import { createFileRoute, Outlet } from "@tanstack/react-router"

import { checkAuth } from "#/features/auth/lib/route-guard"

export const Route = createFileRoute("/post")({
  beforeLoad: ({ location }) => {
    checkAuth(location.pathname)
  },
  component: RouteComponent,
  // Can also check on the server
  // server: {
  //   middleware: [authMiddleware],
  // },
})

function RouteComponent() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Outlet />
    </main>
  )
}
