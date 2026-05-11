import { toast } from "sonner"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { FieldGroup } from "#/components/ui/field"
import { Spinner } from "#/components/ui/spinner"

import { createPostSchema, useCreatePost, usePostForm } from "#/features/post"

export const Route = createFileRoute("/post/create")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const createPost = useCreatePost(Route.useRouteContext().queryClient)

  const form = usePostForm({
    defaultValues: {
      title: "",
      content: "",
    },
    validators: {
      onSubmit: createPostSchema,
    },
    onSubmit: ({ value }) => {
      createPost.mutate(
        { data: value },
        {
          onSuccess: (data) => {
            toast.success("Post created successfully")
            navigate({
              to: "/post/$id",
              params: { id: data.id.toString() },
            })
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to create post"
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
          <Link to="/post">Back to Posts</Link>
        </Button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
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
          <Button type="submit" disabled={createPost.isPending}>
            {createPost.isPending && <Spinner />}
            {createPost.isPending ? "Creating..." : "Create Post"}
          </Button>
        </FieldGroup>
      </form>
    </>
  )
}
