import { z } from "zod"

export const roleSchema = z.enum(["admin", "user", "guest"])

export type Role = z.infer<typeof roleSchema>

export const getUsersInputSchema = z.object({
  searchField: z.string().optional(),
  searchOperator: z.string().optional(),
  searchValue: z.string().optional(),
  filterField: z.string().optional(),
  filterOperator: z.string().optional(),
  filterValue: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
})

export type GetUsersInput = z.infer<typeof getUsersInputSchema>

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: roleSchema,
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.coerce.date().nullable(),
})

export type User = z.infer<typeof userSchema>

// --- Server function input schemas ---

export const seedUsersSchema = z.object({
  count: z.number().min(1).max(500),
})

export const userIdSchema = z.object({
  id: z.string(),
})

export const revokeSessionSchema = z.object({
  sessionToken: z.string(),
  id: z.string(),
})

export const setRoleServerSchema = z.object({
  id: z.string(),
  role: roleSchema,
})

export const banServerSchema = z.object({
  id: z.string(),
  banReason: z.string().optional(),
  banExpiresIn: z.number().optional(),
})

// --- Ban form schemas ---

export const BAN_DURATIONS = [
  { label: "Permanent", value: "permanent" },
  { label: "1 day", value: "86400" },
  { label: "7 days", value: "604800" },
  { label: "30 days", value: "2592000" },
  { label: "1 year", value: "31536000" },
] as const satisfies { label: string; value: string }[]

export const banDurationSchema = z.enum([
  "permanent",
  "86400",
  "604800",
  "2592000",
  "31536000",
])

export type BanDuration = z.infer<typeof banDurationSchema>

export const banUserSchema = z.object({
  banReason: z.string(),
  banDuration: banDurationSchema,
})

export type BanUserInput = z.infer<typeof banUserSchema>
