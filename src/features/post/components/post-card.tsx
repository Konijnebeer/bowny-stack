import { Link } from "@tanstack/react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"

import type { Post } from "#/features/post/type"

function PostCard({ post }: { post: Post }) {
  return (
    <Link to="/post/$id" params={{ id: post.id.toString() }}>
      <Card className="hover:scale-105 hover:shadow-md">
        <CardHeader>
          <CardTitle>
            <h2>{post.title}</h2>
          </CardTitle>
          <CardDescription>
            <p className="flex items-center gap-2">
              By {post.user.name ? post.user.name : "Unknown"}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            {new Date(post.createdAt).toLocaleDateString("en-UK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export { PostCard }
