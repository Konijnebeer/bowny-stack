import { createFormHook } from "@tanstack/react-form"

import SelectField from "#/components/form/select.field"
import TextAreaField from "#/components/form/text-area.field"

import { fieldContext, formContext } from "#/lib/form-context"

export const { useAppForm: useUserForm, withForm: withUserForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      TextAreaField,
      SelectField,
    },
    formComponents: {},
  })
