import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"

import { useFieldContext } from "#/lib/form-context"

type Option = { label: string; value: string }

type SelectFieldProps = {
  label: string
  options: Option[]
  placeholder?: string
}

function SelectField({
  label,
  options,
  placeholder = "Select…",
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const currentLabel = options.find((o) => o.value === field.state.value)?.label

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v)}
      >
        <SelectTrigger id={field.name}>
          <SelectValue placeholder={placeholder}>
            {currentLabel ?? placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export default SelectField
