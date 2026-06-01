import { createMiddleware } from "@tanstack/react-start"
import { auth } from "#/features/auth/lib/auth"
// import { redirect } from "@tanstack/react-router"

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    console.log("Running auth middleware...")
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      // throw redirect({ to: "/login" })
      throw new Error("Unauthorized")
    }

    return await next({
      context: { session },
    })
  }
)
