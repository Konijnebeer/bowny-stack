import { createFormHook } from "@tanstack/react-form"

import InputField from "./input.field"

import { fieldContext, formContext } from "#/lib/form-context"

export const { useAppForm: useInputForm, withForm: withInputForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      InputField,
    },
    formComponents: {},
  })
