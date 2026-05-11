import { createFileRoute, Link, Outlet } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"

import { getPostByIdQueryOptions } from "#/features/post"

export const Route = createFileRoute("/post/$id")({
  // TODO: No async needed, check others
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(getPostByIdQueryOptions(Number(params.id)))
  },
  pendingMs: 300,
  pendingMinMs: 200,
  pendingComponent: () => <PostDetailSkeleton />,
  errorComponent: ({ error }) => <PostDetailError error={error} />,
  component: () => <Outlet />,
})

function PostDetailSkeleton() {
  return (
    <div className="flex items-end justify-between py-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>
  )
}

function PostDetailError({ error }: { error: Error }) {
  return (
    <>
      <div className="flex items-end justify-between py-2">
        <Button variant="outline">
          <Link to="/post">Back to Posts</Link>
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-lg font-semibold">Error loading post</h1>
        <p>{error.message}</p>
      </div>
    </>
  )
}
