import { createFormHook } from "@tanstack/react-form"

import TextAreaField from "./text-area.field"

import { fieldContext, formContext } from "#/lib/form-context"

export const { useAppForm: useTextAreaForm, withForm: withTextAreaForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextAreaField,
  },
  formComponents: {},
})
