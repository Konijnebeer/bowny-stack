import { createFileRoute, Link } from "@tanstack/react-router"
import { useGetPostById, useUpdatePost } from "#/features/post/hooks/post.query"
import { FieldGroup } from "#/components/ui/field"
import { Button } from "#/components/ui/button"
import { usePostForm } from "#/features/post/hooks/post.form"
import { toast } from "sonner"
import { Spinner } from "#/components/ui/spinner"
import { createPostSchema, updatePostSchema } from "#/features/post/post.type"

export const Route = createFileRoute("/post/$id/edit")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = Route.useNavigate()
  const getPost = useGetPostById(Number(id))
  const updatePost = useUpdatePost(
    Number(id),
    Route.useRouteContext().queryClient
  )

  const post = getPost.data

  const form = usePostForm({
    defaultValues: {
      title: post.title,
      content: post.content,
    },
    validators: {
      onSubmit: createPostSchema,
    },
    onSubmit: ({ value }) => {
      updatePost.mutate(
        { id: post.id, ...value },
        {
          onSuccess: (data) => {
            toast.success("Post updated successfully")
            navigate({
              to: "/post/$id",
              params: { id: data.id.toString() },
            })
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to update post"
            )
          },
        }
      )
    },
  })

  return (
    <>
      <div className="flex items-end justify-between py-2">
        <Button variant="outline">
          <Link to="/post/$id" params={{ id: post.id.toString() }}>
            Back to post
          </Link>
        </Button>
        <Button
          type="submit"
          form="update-post"
          disabled={updatePost.isPending}
        >
          {updatePost.isPending && <Spinner />}
          {updatePost.isPending ? "Updating..." : "Update Post"}
        </Button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        id="update-post"
      >
        <FieldGroup>
          <form.AppField
            name="title"
            children={(field) => (
              <field.InputField
                label="Title"
                placeholder="Title"
                autocomplete="title"
              />
            )}
          />

          <form.AppField
            name="content"
            children={(field) => (
              <field.TextAreaField
                label="Content"
                placeholder="Content"
                maxCharacters={`${createPostSchema.shape.content.maxLength}`}
                rows={8}
              />
            )}
          />
        </FieldGroup>
      </form>
    </>
  )
}
