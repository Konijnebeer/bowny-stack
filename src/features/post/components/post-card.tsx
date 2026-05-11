import { Link } from "@tanstack/react-router"

import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

import type { PostsResponse } from "#/features/post/type"

function PostCard({ post }: { post: PostsResponse[number] }) {
  return (
    <Link to="/post/$id" params={{ id: post.id }}>
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
