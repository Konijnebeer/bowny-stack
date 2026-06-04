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

import {
  authClient,
  useAccountForm,
  useAuthStore,
  UserLoginSchema,
} from "#/features/auth"

export const Route = createFileRoute("/(auth)/login")({
  validateSearch: z.object({
    location: z.string().optional(),
  }),
  // TODO: Fix this, investigate why it does not work
  // beforeLoad: async ({ location }) => {
  //   const session = await authClient.getSession()
  //   console.log(session)
  //   if (session.data) {
  //     console.log('User is already logged in, redirecting...')
  //     console.log(location)
  //     throw redirect({ to: (location as unknown as string) || '/' })
  //   }
  // },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { location } = Route.useSearch()
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
            useAuthStore.getState().setSession(undefined)
            toast.success("Logged in successfully!", { id: "sign-in" })
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
