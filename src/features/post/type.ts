import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { posts } from "#/features/post/schema"

const baseInsertSchema = createInsertSchema(posts)
const baseSelectSchema = createSelectSchema(posts)

export const postIdSchema = baseSelectSchema.pick({ id: true })

export const createPostSchema = baseInsertSchema
  .omit({ id: true, userId: true, createdAt: true, updatedAt: true })
  .extend({
    title: z.string().min(3, "Title too short").max(100),
    content: z
      .string()
      .min(10, "Content too short")
      .max(5000, "Content too long"),
  })

export const updatePostSchema = createPostSchema
  .partial()
  .extend(postIdSchema.shape)

export type PostId = z.infer<typeof postIdSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type Post = z.infer<typeof baseSelectSchema>
