import {
  createFileRoute,
  Link,
  type ErrorComponentProps,
} from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"

import { getPostsQueryOptions, PostCard, useGetPosts } from "#/features/post"

export const Route = createFileRoute("/post/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(getPostsQueryOptions)
  },
  pendingMs: 300,
  pendingMinMs: 200,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  component: RouteComponent,
})

function PendingComponent() {
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

function ErrorComponent({ error }: ErrorComponentProps) {
  return <div>Error loading posts: {error.message}</div>
}

function RouteComponent() {
  const posts = useGetPosts()

  const postsData = posts.data

  return (
    <>
      <div className="flex items-end justify-between py-2">
        <h1 className="text-2xl">Posts</h1>

        <Button
          variant="outline"
          render={<Link to="/post/create" />}
          nativeButton={false}
        >
          Create Post
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
