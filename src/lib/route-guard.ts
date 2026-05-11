import { redirect } from "@tanstack/react-router"

import { authClient } from "#/lib/auth-client"

// let expiresAt: string | null = null

async function checkAuth(location: string): Promise<void> {
  console.log("Checking authentication...")
  try {
    await authClient.getSession().then(({ data, error }) => {
      if (error || !data || !data.user) {
        console.log("No valid session found, redirecting to login...")
        throw redirect({ to: "/login", search: { location } })
      }
    })
    console.log("No token, attempting refresh...")

    // await authClient.refreshToken() // Attempt to refresh token if no session
  } catch {
    console.error("Failed to refresh token, redirecting to login")
    throw redirect({ to: "/login", search: { location } })
  }
}

export { checkAuth }
