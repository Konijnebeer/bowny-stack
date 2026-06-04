import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

import { useAuthStore } from "#/features/auth/store"

import { authClient } from "./auth-client"

const statement = {
  ...defaultStatements,
  post: [
    "view",
    "view:any",
    "create",
    "update",
    "update:any",
    "delete",
    "delete:any",
  ],
} as const

export const ac = createAccessControl(statement)

export const guest = ac.newRole({
  post: ["view", "view:any"],
})

export const user = ac.newRole({
  post: ["view", "view:any", "create", "update"],
})

export const admin = ac.newRole({
  post: [
    "view",
    "view:any",
    "create",
    "update",
    "update:any",
    "delete",
    "delete:any",
  ],
  ...adminAc.statements,
})

export function hasPermission(
  permissions: Parameters<
    typeof authClient.admin.checkRolePermission
  >[0]["permissions"]
): boolean {
  const session = useAuthStore.getState().session
  const role = session?.user.role

  if (!role) return false

  return authClient.admin.checkRolePermission({
    permissions,
    role,
  })
}

export function useHasRole(
  roles: Parameters<typeof authClient.admin.checkRolePermission>[0]["role"][]
): { hasRole: boolean; isLoading: boolean } {
  const isLoading = useAuthStore((s) => s.isLoading)

  const role = useAuthStore((s) => s.session?.user.role)
  const hasRole = !!role && roles.includes(role)

  return { hasRole, isLoading }
}
