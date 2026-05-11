import { createFormHook } from "@tanstack/react-form"

import InputField from "#/components/form/input.field"

import { fieldContext, formContext } from "#/lib/form-context"

export const { useAppForm: useAccountForm, withForm: withAccountForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      InputField,
    },
    formComponents: {},
  })
