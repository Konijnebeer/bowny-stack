import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/form")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Outlet />
    </main>
  )
}
