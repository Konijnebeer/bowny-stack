import { createFormHook } from "@tanstack/react-form"

import SliderField from "./slider.input"
import RangeSliderField from "./range-slider.input"

import { fieldContext, formContext } from "#/lib/form-context"

export const { useAppForm: useSliderForm, withForm: withSliderForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      SliderField,
      RangeSliderField,
    },
    formComponents: {},
  })
