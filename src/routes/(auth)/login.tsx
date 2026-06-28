import { useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { FieldGroup } from "#/components/ui/field"
import { Spinner } from "#/components/ui/spinner"

import { authClient } from "#/lib/auth-client"

import {
  accountQueryOptions,
  useAccountForm,
  UserLoginSchema,
} from "#/features/auth"

export const Route = createFileRoute("/(auth)/login")({
  validateSearch: z.object({
    location: z.string().optional(),
  }),
  beforeLoad: async ({ context: { queryClient }, search }) => {
    const session = await queryClient.ensureQueryData(accountQueryOptions)
    if (session) {
      throw redirect({ to: search.location || "/" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { location } = Route.useSearch()
  const queryClient = Route.useRouteContext().queryClient

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useAccountForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: UserLoginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onRequest: () => {
            // show loading
            toast.loading("Logging in...", { id: "sign-in" })
          },
          onSuccess: () => {
            setIsSubmitting(false)
            toast.success("Logged in successfully!", { id: "sign-in" })
            queryClient.refetchQueries(accountQueryOptions)
            navigate({ to: location || "/" })
          },
          onError: (ctx) => {
            setIsSubmitting(false)
            toast.error(ctx.error.message, { id: "sign-in" })
          },
        }
      )
    },
  })
  return (
    <main className="my-auto flex h-screen items-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.InputField
                    label="Email"
                    placeholder="Email"
                    autocomplete="email"
                  />
                )}
              />

              <form.AppField
                name="password"
                children={(field) => (
                  <field.InputField
                    label="Password"
                    placeholder="Password"
                    type="password"
                    autocomplete="password"
                  />
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner />}
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <span>Don't have an account?</span>
          <Button variant="link">
            <Link to="/register">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
