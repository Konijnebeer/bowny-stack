import { createFileRoute } from "@tanstack/react-router"
import z from "zod"
import { useTextAreaForm } from "./-code/form"
import { toast } from "sonner"
import { FieldGroup } from "#/components/ui/field"
import { Button } from "#/components/ui/button"

export const Route = createFileRoute("/form/example/text-area/")({
  component: RouteComponent,
})

function RouteComponent() {
  const inputSchema = z.object({
    content: z
      .string()
      .min(10, "Content must be at least 10 characters")
      .max(500, "Content must be less than 500 characters"),
  })

  const form = useTextAreaForm({
    defaultValues: {
      content: "",
    },
    validators: {
      onSubmit: inputSchema,
    },
    onSubmit: ({ value }) => {
      toast.success(JSON.stringify(value))
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField
          name="content"
          children={(field) => (
            <field.TextAreaField
              label="Content"
              placeholder="Content"
              maxCharacters={`${inputSchema.shape.content.maxLength}`}
              rows={8}
            />
          )}
        />
        <Button type="submit">Send Form</Button>
      </FieldGroup>
    </form>
  )
}
