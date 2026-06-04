import { redirect } from "@tanstack/react-router"

import { useAuthStore } from "#/features/auth/store"

import { authClient } from "./auth-client"

async function checkAuth(location: string): Promise<void> {
  try {
    const result = useAuthStore.getState().session

    if (!result) {
      const session = await useAuthStore.getState().fetchSession()
      if (!session) {
        throw new Error("No active session found")
      }
    }
  } catch (error) {
    console.error("Authentication check failed:", error)
    throw redirect({ to: "/login", search: { location } })
  }
}

async function checkRole(
  location: string,
  requiredRole: Parameters<
    typeof authClient.admin.checkRolePermission
  >[0]["role"][]
): Promise<void> {
  try {
    let session = useAuthStore.getState().session

    if (!session) {
      session = await useAuthStore.getState().fetchSession()
    }

    const role = session?.user.role ?? null
    if (!role) {
      throw new Error("No role found in session")
    }

    if (!requiredRole.includes(role)) {
      throw new Error("Insufficient permissions")
    }
  } catch (error) {
    console.error("Role check failed:", error)
    throw redirect({ to: "/login", search: { location } })
  }
}

async function checkRolePermission(
  location: string,
  permissions: Parameters<
    typeof authClient.admin.checkRolePermission
  >[0]["permissions"]
): Promise<void> {
  try {
    let session = useAuthStore.getState().session

    if (!session) {
      session = await useAuthStore.getState().fetchSession()
    }

    const role = session?.user.role ?? null
    if (!role) {
      throw new Error("No role found in session")
    }

    const canAccess = authClient.admin.checkRolePermission({
      permissions,
      role,
    })

    if (!canAccess) {
      throw new Error("Insufficient permissions")
    }
  } catch (error) {
    console.error("Role permission check failed:", error)
    throw redirect({ to: "/login", search: { location } })
  }
}

export { checkAuth, checkRole, checkRolePermission }
