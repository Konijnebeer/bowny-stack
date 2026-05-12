import { createMiddleware } from "@tanstack/react-start"

import { auth } from "#/lib/auth"

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    console.log("Running auth middleware...")
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      throw new Error("Unauthorized")
    }

    return await next({
      context: {
        session,
        user: session.user,
      },
    })
  }
)
