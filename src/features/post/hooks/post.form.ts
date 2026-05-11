import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "#/lib/form-context"
import InputField from "#/components/form/input.field"
import TextAreaField from "#/components/form/text-area.field"

export const { useAppForm: usePostForm, withForm: withPostForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      InputField,
      TextAreaField,
    },
    formComponents: {},
  })
