import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { getPostByIdQueryOptions } from "#/features/post/hooks/post.query"
import { Skeleton } from "#/components/ui/skeleton"
import { Button } from "#/components/ui/button"

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
