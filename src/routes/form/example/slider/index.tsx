import { createFileRoute } from "@tanstack/react-router"
import z from "zod"
import { useSliderForm } from "./-code/form"
import { toast } from "sonner"
import { FieldGroup } from "#/components/ui/field"
import { Button } from "#/components/ui/button"

export const Route = createFileRoute("/form/example/slider/")({
  component: RouteComponent,
})

function RouteComponent() {
  const inputSchema = z.object({
    slider: z
      .number()
      .min(0, "Value must be at least 0")
      .max(100, "Value must be at most 100"),
      // TODO: check why there is no error message 
    rangeSlider: z
      .tuple([
        z
          .number()
          .min(10, "Value must be at least 10")
          .max(80, "Value must be at most 80"),
        z
          .number()
          .min(30, "Value must be at least 30")
          .max(100, "Value must be at most 100"),
      ])
      .refine(([min, max]) => max - min >= 10, {
        message: "Values must be at least 10 apart",
      })
      .refine(([min, max]) => max - min <= 50, {
        message: "Values must be at most 50 apart",
      }),
  })

  const form = useSliderForm({
    defaultValues: {
      slider: 50,
      rangeSlider: [25, 75],
    },
    validators: {
      onSubmit: inputSchema,
    },
    onSubmit: ({ value }) => {
      toast.success(JSON.stringify(value))
    },
  })

  console.log("schema", inputSchema.shape.rangeSlider.def.items[0].minValue)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField
          name="slider"
          children={(field) => (
            <field.SliderField
              label="Single Value Slider"
              step={5}
              min={inputSchema.shape.slider.minValue as number}
              max={inputSchema.shape.slider.maxValue as number}
            />
          )}
        />
        <form.AppField
          name="rangeSlider"
          children={(field) => (
            <field.RangeSliderField
              label="Range Slider"
              min={
                inputSchema.shape.rangeSlider.def.items[0].minValue as number
              }
              max={
                inputSchema.shape.rangeSlider.def.items[1].maxValue as number
              }
            />
          )}
        />

        <Button type="submit">Send Form</Button>
      </FieldGroup>
    </form>
  )
}
