import { toast } from "sonner"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"

import { useDeletePost, useGetPostById } from "#/features/post"
import { checkRolePermission } from "#/features/auth/lib/route-guard"
import { hasPermission } from "#/features/auth/lib/permissions"
import { useAuthStore } from "#/features/auth/store"

export const Route = createFileRoute("/post/$id/")({
  beforeLoad: ({ location }) => {
    checkRolePermission(location.pathname, {
      post: ["view:any"],
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = Route.useNavigate()

  const getPost = useGetPostById(Number(id))
  const deletePost = useDeletePost(Route.useRouteContext().queryClient)

  const post = getPost.data

  const canUpdateOwn = hasPermission({ post: ["update"] })
  const canDeleteOwn = hasPermission({ post: ["delete"] })
  const canUpdateAny = hasPermission({ post: ["update:any"] })
  const canDeleteAny = hasPermission({ post: ["delete:any"] })

  const session = useAuthStore((s) => s.session)
  const isAuthor = session?.user.id === post.userId
  const canEdit = canUpdateAny || (isAuthor && canUpdateOwn)
  const canDelete = canDeleteAny || (isAuthor && canDeleteOwn)

  function handleDelete() {
    deletePost.mutate(Number(id), {
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
        <Button
          variant="outline"
          render={<Link to="/post" />}
          nativeButton={false}
        >
          Back to Posts
        </Button>

        <div className="space-x-2">
          {canDelete && (
            <Button variant="outline" onClick={handleDelete}>
              Delete Post
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link to="/post/$id/edit" params={{ id: post.id.toString() }} />
              }
            >
              Edit Post
            </Button>
          )}
        </div>
      </div>
      <div className="mb-2 flex justify-between gap-4">
        <h1 className="text-2xl">{post.title}</h1>
        <span>By {post.user.name ? post.user.name : "Unknown"}</span>
      </div>
      <p>{post.content}</p>
    </main>
  )
}
