import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import { Slider } from "#/components/ui/slider"

import { useFieldContext } from "#/lib/form-context"

type RangeSliderFieldProps = {
  label: string
  min: number
  max: number
  step?: number
  thumbCollisionBehavior?: "swap" | "push" | "none"
}

export default function RangeSliderField({
  label,
  min,
  max,
  step = 1,
  thumbCollisionBehavior = "swap",
}: RangeSliderFieldProps) {
  const field = useFieldContext<[number, number]>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  // TODO:
  // - Make sure it can just move past the other knob
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label}
        <span className="ml-auto">{field.state.value.join(" - ")}</span>
      </FieldLabel>
      <Slider
        id={field.name}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value as [number, number])}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        min={min}
        max={max}
        step={step}
        thumbCollisionBehavior={thumbCollisionBehavior}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
