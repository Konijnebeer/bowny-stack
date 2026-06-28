import { toast } from "sonner"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"

import { authClient } from "#/lib/auth-client"

import { useDeletePost, useGetPostById } from "#/features/post"

export const Route = createFileRoute("/post/$id/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = Route.useNavigate()
  const queryClient = Route.useRouteContext().queryClient

  const user = Route.useRouteContext().session

  const getPost = useGetPostById({ id: Number(id) })
  const deletePost = useDeletePost(queryClient)

  const post = getPost.data

  function handleDelete() {
    deletePost.mutate(
      { id: Number(id) },
      {
        onSuccess: () => {
          navigate({ to: "/post" })
        },
        onError: (error) => {
          toast.error(`Failed to delete post: ${error.message}`)
        },
      }
    )
  }

  // Throw to trigger error boundary if delete post failed - mutate function can't throw to the error boundary
  if (deletePost.isError) {
    throw new Error(
      deletePost.error instanceof Error
        ? deletePost.error.message
        : "Failed to delete post"
    )
  }

  return (
    <main>
      <div className="flex items-end justify-between py-2">
        <Button
          variant="outline"
          render={<Link to="/post" />}
          nativeButton={false}
        >
          Back to Posts
        </Button>

        <div className="space-x-2">
          {user.id === post.userId && (
            <>
              <Button variant="outline" onClick={handleDelete}>
                Delete Post
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link
                    to="/post/$id/edit"
                    params={{ id: post.id.toString() }}
                  />
                }
              >
                Edit Post
              </Button>
            </>
          )}
        </div>
      </div>

      <h1 className="text-2xl">{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
