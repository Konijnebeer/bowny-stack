import { createFileRoute, Link } from "@tanstack/react-router"
import {
  getPostsQueryOptions,
  useGetPosts,
} from "#/features/post/hooks/post.query"
import { Button } from "#/components/ui/button"
import { PostCard } from "#/features/post/components/post-card"
import { Skeleton } from "#/components/ui/skeleton"

export const Route = createFileRoute("/post/")({
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(getPostsQueryOptions)
  },
  pendingMs: 300,
  pendingMinMs: 200,
  pendingComponent: () => <RoutePending />,
  errorComponent: ({ error }) => <RouteError error={error} />,
  component: RouteComponent,
})

function RoutePending() {
  return (
    <>
      <div className="flex items-end justify-between py-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full" />
        ))}
      </div>
    </>
  )
}

function RouteError({ error }: { error: Error }) {
  return <div>Error loading posts: {error.message}</div>
}

function RouteComponent() {
  const posts = useGetPosts()

  const postsData = posts.data

  return (
    <>
      <div className="flex items-end justify-between py-2">
        <h1 className="text-2xl">Posts</h1>

        <Button variant="outline">
          <Link to="/post/create">Create Post</Link>
        </Button>
      </div>
      {postsData.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {postsData.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  )
}
