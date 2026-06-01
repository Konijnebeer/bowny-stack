import { createMiddleware } from "@tanstack/react-start"
import { auth } from "#/features/auth/lib/auth"
import { authMiddleware } from "./auth"
import type { authClient } from "#/features/auth/lib/auth-client"

type Permissions = Parameters<
    typeof authClient.admin.checkRolePermission
  >[0]["permissions"]

export function roleMiddleware(permissions: Permissions) {
  return createMiddleware({ type: "function" })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      const granted = await auth.api.userHasPermission({
        body: {
          userId: context.session.user.id,
          permissions,
        },
      })

      if (!granted) {
        throw new Error("Forbidden")
      }

      return await next()
    })
}
