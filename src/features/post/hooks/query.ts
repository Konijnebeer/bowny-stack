import { and, desc, eq } from "drizzle-orm"
import type { QueryClient } from "@tanstack/react-query"
import {
  mutationOptions,
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

import { getDB } from "#/db"
import { posts } from "#/features/post/schema"
import type { PostId, UpdatePostInput } from "#/features/post/type"
import {
  createPostSchema,
  postIdSchema,
  updatePostSchema,
} from "#/features/post/type"
import { authMiddleware } from "#/middleware/auth"

// --- Get all ---

const getPosts = createServerFn({
  method: "GET",
}).handler(async () => {
  const db = getDB()

  const posts = await db.query.posts.findMany({
    orderBy: (post) => [desc(post.createdAt)],
  })

  return posts
})

export const getPostsQueryOptions = queryOptions({
  queryKey: ["posts"] as const,
  queryFn: getPosts,
  staleTime: 1000 * 60 * 5, // 5 minutes
})

export function useGetPosts() {
  return useSuspenseQuery(getPostsQueryOptions)
}

// --- Get by ID ---

const getPostById = createServerFn({
  method: "GET",
})
  .validator(postIdSchema)
  .handler(async ({ data }) => {
    const db = getDB()

    const post = await db.query.posts.findFirst({
      where: (post) => eq(post.id, data.id),
    })

    if (!post) throw notFound()

    return post
  })

export const getPostByIdQueryOptions = ({ id }: PostId) =>
  queryOptions({
    queryKey: [...getPostsQueryOptions.queryKey, id] as const,
    queryFn: () => getPostById({ data: { id } }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

export function useGetPostById(id: PostId) {
  return useSuspenseQuery(getPostByIdQueryOptions(id))
}

// --- Create ---

const createPost = createServerFn({
  method: "POST",
})
  .validator(createPostSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context
    const db = getDB()

    const [post] = await db
      .insert(posts)
      .values({
        title: data.title,
        content: data.content,
        userId: session.user.id,
      })
      .returning()

    if (!post) throw new Error("Failed to create post")

    return post
  })

export const createPostMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPostsQueryOptions.queryKey })
    },
  })

export function useCreatePost(queryClient: QueryClient) {
  return useMutation(createPostMutationOptions(queryClient))
}

// --- Update ---

const updatePost = createServerFn({ method: "POST" })
  .validator(updatePostSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context
    const db = getDB()

    const [post] = await db
      .update(posts)
      .set({
        title: data.title,
        content: data.content,
      })
      .where(and(eq(posts.id, data.id), eq(posts.userId, session.user.id)))
      .returning()

    // either didn't exist, or didn't belong to this user
    if (!post) throw new Error("Post not found or unauthorized")

    return post
  })

export const updatePostMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (data: UpdatePostInput) => updatePost({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPostsQueryOptions.queryKey })
    },
  })

export function useUpdatePost(queryClient: QueryClient) {
  return useMutation(updatePostMutationOptions(queryClient))
}

// --- Delete ---

const deletePost = createServerFn({
  method: "POST",
})
  .validator(postIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context
    const db = getDB()

    const [deleted] = await db
      .delete(posts)
      .where(and(eq(posts.id, data.id), eq(posts.userId, session.user.id)))
      .returning()

    if (!deleted) throw new Error("Post not found or unauthorized")

    return deleted
  })

export const deletePostMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (data: PostId) => deletePost({ data }),
    onSuccess: (deletedPost) => {
      queryClient.setQueryData(getPostsQueryOptions.queryKey, (old) =>
        old?.filter((post) => post.id !== deletedPost.id)
      )

      queryClient.removeQueries({
        queryKey: getPostByIdQueryOptions({ id: deletedPost.id }).queryKey,
      })
    },
  })

export function useDeletePost(queryClient: QueryClient) {
  return useMutation(deletePostMutationOptions(queryClient))
}
