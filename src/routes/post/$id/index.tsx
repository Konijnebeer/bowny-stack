import { createFileRoute, Link } from "@tanstack/react-router"
import { useDeletePost, useGetPostById } from "#/features/post/hooks/post.query"
import { Button } from "#/components/ui/button"

export const Route = createFileRoute("/post/$id/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const getPost = useGetPostById(Number(id))
  const deletePost = useDeletePost(
    Number(id),
    Route.useRouteContext().queryClient
  )
  const navigate = Route.useNavigate()

  const post = getPost.data

  return (
    <main>
      <div className="flex items-end justify-between py-2">
        <Button variant="outline">
          <Link to="/post">Back to Posts</Link>
        </Button>

        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              deletePost.mutate(undefined, {
                onSuccess: () => {
                  navigate({ to: "/post" })
                },
              })
            }}
          >
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
