import type {
  UserWithRole,
  SessionWithImpersonatedBy,
} from "better-auth/plugins/admin"
import { create } from "zustand"
import { authClient } from "./lib/auth-client"

export type FullSession = {
  user: UserWithRole & {
    role: "admin" | "user" | "guest"
  }
  session: SessionWithImpersonatedBy
}

interface AuthStore {
  session: FullSession | null | undefined
  setSession: (session: FullSession | null | undefined) => void
  fetchSession: () => Promise<FullSession | null>
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: undefined,
  setSession: (session) => set({ session }),
  fetchSession: async () => {
    try {
      const { data } = await authClient.getSession()
      set({ session: (data as FullSession) ?? null })
      return data as FullSession
    } catch (error) {
      console.error("Failed to fetch session:", error)
      set({ session: null })
    }
    return null
  },
}))
