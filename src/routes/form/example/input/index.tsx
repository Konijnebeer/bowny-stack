import { createFileRoute } from "@tanstack/react-router"
import z from "zod"
import { useInputForm } from "./-code/form"
import { toast } from "sonner"
import { FieldGroup } from "#/components/ui/field"
import { Button } from "#/components/ui/button"

export const Route = createFileRoute("/form/example/input/")({
  component: RouteComponent,
})

function RouteComponent() {
  const inputSchema = z.object({
    title: z.string().min(1, "Title is required"),
  })

  const form = useInputForm({
    defaultValues: {
      title: "",
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
          name="title"
          children={(field) => (
            <field.InputField
              label="Title"
              placeholder="Title"
              autocomplete="title"
            />
          )}
        />
        <Button type="submit">Send Form</Button>
      </FieldGroup>
    </form>
  )
}
