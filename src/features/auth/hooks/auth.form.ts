import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "#/lib/form-context"
import InputField from "#/components/form/input.field"

export const { useAppForm: useAccountForm, withForm: withAccountForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      InputField,
    },
    formComponents: {},
  })
