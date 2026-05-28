import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import { Slider } from "#/components/ui/slider"

import { useFieldContext } from "#/lib/form-context"

type SliderFieldProps = {
  label: string
  min: number
  max: number
  step?: number
}

export default function SliderField({
  label,
  min,
  max,
  step = 1,
}: SliderFieldProps) {
  const field = useFieldContext<number | undefined>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label}
        <span className="ml-auto">{field.state.value}</span>
      </FieldLabel>
      <Slider
        id={field.name}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value as number)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        min={min}
        max={max}
        step={step}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
