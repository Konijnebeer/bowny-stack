import type { ErrorComponentProps } from "@tanstack/react-router"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"

import { getPostByIdQueryOptions } from "#/features/post"

export const Route = createFileRoute("/post/$id")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(
      getPostByIdQueryOptions({ id: Number(params.id) })
    )
  },
  pendingMs: 300,
  pendingMinMs: 200,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  component: Outlet,
})

function PendingComponent() {
  return (
    <div className="flex items-end justify-between py-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>
  )
}

function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <>
      <div className="flex items-end justify-between py-2">
        <Button
          variant="outline"
          render={<Link to="/post" />}
          nativeButton={false}
        >
          Back to Posts
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-lg font-semibold">Error loading post</h1>
        <p>{error.message}</p>
      </div>
    </>
  )
}
