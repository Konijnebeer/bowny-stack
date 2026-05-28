import { Button } from "#/components/ui/button"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/form/example")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="flex items-end justify-between py-2">
        <Button
          variant="outline"
          render={<Link to="/form" />}
          nativeButton={false}
        >
          Back to Examples
        </Button>
      </div>
      <section className="rounded-md border p-4">
        <Outlet />
      </section>
    </>
  )
}
