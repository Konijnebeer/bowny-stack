import { createServerFn } from "@tanstack/react-start"
import { notFound } from "@tanstack/react-router"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import type { QueryClient } from "@tanstack/react-query"
import { and, desc, eq } from "drizzle-orm"

import { getDB } from "#/db"
import z from "zod"
import { posts } from "../post.schema"
import { createPostSchema, updatePostSchema } from "../post.type"
import type { UpdatePostInput } from "../post.type"
import { authMiddleware } from "#/middleware/auth"

const db = getDB()

// --- Get all ---

const getPosts = createServerFn({
  method: "GET",
}).handler(async () => {
  return await db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
  })
})

export const getPostsQueryOptions = {
  queryKey: ["posts"],
  queryFn: getPosts,
  staleTime: 1000 * 60 * 5, // 5 minutes
}

export function useGetPosts() {
  return useSuspenseQuery(getPostsQueryOptions)
}

// --- Get by ID ---

const getPostById = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, data.id),
    })
    if (!post) {
      throw notFound()
    }
    return post
  })

export const getPostByIdQueryOptions = (id: number) => ({
  queryKey: ["posts", id],
  queryFn: () => getPostById({ data: { id } }),
  staleTime: 1000 * 60 * 5, // 5 minutes
  enabled: !!id,
})

export function useGetPostById(id: number) {
  return useSuspenseQuery(getPostByIdQueryOptions(id))
}

// --- Create ---

const createPost = createServerFn({
  method: "POST",
})
  .inputValidator(createPostSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context
    const [post] = await db
      .insert(posts)
      .values({
        title: data.title,
        content: data.content,
        userId: session.user.id,
      })
      .returning()

    return post
  })

export const createPostMutationOptions = {
  mutationFn: createPost,
}

export function useCreatePost(queryClient: QueryClient) {
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}

// --- Update ---

// const updatePost = createServerFn({
//   method: 'POST',
// })
//   .inputValidator(updatePostSchema)
//   .middleware([authMiddleware])
//   .handler(async ({ data, context }) => {
//     const { session } = context

//     const post = await db.query.posts.findFirst({
//       where: eq(posts.id, data.id),
//     })

//     if (!post) {
//       throw new Error('Post not found')
//     }
//     if (post.userId !== session.user.id) {
//       throw new Error('Unauthorized')
//     }

//     return await db
//       .update(posts)
//       .set({
//         title: data.title,
//         content: data.content,
//       })
//       .where(eq(posts.id, data.id))
//       .returning()
//   })

const updatePost = createServerFn({ method: "POST" })
  .inputValidator(updatePostSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context

    const [post] = await db
      .update(posts)
      .set({
        title: data.title,
        content: data.content,
      })
      .where(and(eq(posts.id, data.id), eq(posts.userId, session.user.id)))
      .returning()

    if (!post) {
      // either didn't exist, or didn't belong to this user
      throw new Error("Post not found or unauthorized")
    }

    return post
  })

export const updatePostMutationOptions = (
  id: number,
  queryClient: QueryClient
) => ({
  mutationFn: (data: UpdatePostInput) => updatePost({ data }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] })
    queryClient.invalidateQueries({ queryKey: ["posts", id] })
  },
})

export function useUpdatePost(id: number, queryClient: QueryClient) {
  return useMutation(updatePostMutationOptions(id, queryClient))
}

// --- Delete ---

const deletePost = createServerFn({
  method: "POST",
})
  .inputValidator(z.object({ id: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context

    const [deleted] = await db
      .delete(posts)
      .where(and(eq(posts.id, data.id), eq(posts.userId, session.user.id)))
      .returning()

    if (!deleted) {
      throw new Error("Post not found or unauthorized")
    }

    return deleted
  })

export const deletePostMutationOptions = (
  id: number,
  queryClient: QueryClient
) => ({
  mutationFn: () => deletePost({ data: { id } }),
  // TODO: Should be async but then the other success callback does not seem to work, now there is a very small flicker because the query has not been invalidated
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] })
  },
})

export function useDeletePost(id: number, queryClient: QueryClient) {
  return useMutation(deletePostMutationOptions(id, queryClient))
}
