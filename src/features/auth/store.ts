import type {
  SessionWithImpersonatedBy,
  UserWithRole,
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
  isLoading: boolean
  setSession: (session: FullSession | null | undefined) => void
  fetchSession: () => Promise<FullSession | null>
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: undefined,
  isLoading: true,
  setSession: (session) => set({ session }),
  fetchSession: async () => {
    set({ isLoading: true })
    try {
      const { data } = await authClient.getSession()
      const sessionData = data as FullSession | null
      set({ session: sessionData, isLoading: false })
      return sessionData
    } catch (error) {
      console.error("Failed to fetch session:", error)
      set({ session: null, isLoading: false })
    }
    return null
  },
}))
