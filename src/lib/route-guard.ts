import { redirect } from "@tanstack/react-router"

import { ensureSession } from "#/features/auth"

async function checkAuth(location: string): Promise<void> {
  try {
    console.log("Checking authentication for route:", location)
    //  TODO: check how to not call the server on every route change
    await ensureSession()
  } catch (error) {
    console.error("Authentication check failed:", error)
    throw redirect({ to: "/login", search: { location } })
  }
}
export { checkAuth }
