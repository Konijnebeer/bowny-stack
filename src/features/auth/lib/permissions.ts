import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"
import { authClient } from "./auth-client"
import { useAuthStore } from "../store"

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
  const session = useAuthStore((s) => s.session)
  const role = session?.user?.role

  if (!role) return false

  return authClient.admin.checkRolePermission({
    permissions,
    role,
  })
}
