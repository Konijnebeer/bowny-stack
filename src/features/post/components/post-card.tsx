import { Link } from "@tanstack/react-router"

import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

import type { Post } from "#/features/post"

function PostCard({ post }: { post: Post }) {
  return (
    <Link to="/post/$id" params={{ id: post.id.toString() }}>
      <Card className="hover:scale-105 hover:shadow-md">
        <CardHeader>
          <CardTitle>
            <h2>{post.title}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export { PostCard }
