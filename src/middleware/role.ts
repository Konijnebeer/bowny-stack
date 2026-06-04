import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"

import type { authClient } from "#/features/auth"
import { auth } from "#/features/auth/lib/auth"

import { authMiddleware } from "./auth"

type Permissions = Parameters<
  typeof authClient.admin.checkRolePermission
>[0]["permissions"]

export function roleMiddleware(
  permissions: Permissions,
  adminPermissions?: Permissions
) {
  return createMiddleware({ type: "function" })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      if (adminPermissions) {
        const adminGranted = await auth.api.userHasPermission({
          body: {
            userId: context.session.user.id,
            permissions: adminPermissions,
          },
        })
        if (adminGranted.success) {
          return await next({
            context: {
              granted: true,
            },
          })
        }
      }

      const granted = await auth.api.userHasPermission({
        body: {
          userId: context.session.user.id,
          permissions,
        },
      })

      if (!granted.success) {
        throw redirect({ to: "/login" })
      }

      return await next({
        context: {
          granted: true,
        },
      })
    })
}
