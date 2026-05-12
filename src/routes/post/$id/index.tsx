import { toast } from "sonner"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"

import { useDeletePost, useGetPostById } from "#/features/post"

export const Route = createFileRoute("/post/$id/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = Route.useNavigate()

  const getPost = useGetPostById(Number(id))
  const deletePost = useDeletePost(
    Number(id),
    Route.useRouteContext().queryClient
  )

  const post = getPost.data

  function handleDelete() {
    deletePost.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: "/post" })
      },
      onError: (error) => {
        toast.error(`Failed to delete post: ${error.message}`)
      },
    })
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
        <Button variant="outline">
          <Link to="/post">Back to Posts</Link>
        </Button>

        <div className="space-x-2">
          <Button variant="outline" onClick={handleDelete}>
            Delete Post
          </Button>
          <Button variant="outline">
            <Link to="/post/$id/edit" params={{ id: post.id.toString() }}>
              Edit Post
            </Link>
          </Button>
        </div>
      </div>

      <h1 className="text-2xl">{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
