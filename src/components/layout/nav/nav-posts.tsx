"use client"

import {
  Eye,
  MoreHorizontalIcon,
  Pencil,
  ReceiptText,
  RefreshCcw,
  Trash2Icon,
} from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { toast } from "sonner"
import { QueryErrorResetBoundary, useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "#/components/ui/alert-dialog"
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#/components/ui/sidebar.tsx"
import { Skeleton } from "#/components/ui/skeleton"

import { useDeletePost, useGetPosts } from "#/features/post"
import { authClient } from "#/lib/auth-client"

function NavPostsLoading() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Posts</SidebarGroupLabel>
      <SidebarMenu>
        {[...Array(5)].map((_, i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuButton>
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavPostsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 py-1.5 text-center text-sm">
          <span className="text-center text-sm text-destructive">
            Error loading user information: {error.message}
          </span>
          <Button variant="outline" size="icon" onClick={reset}>
            <RefreshCcw />
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function NavPosts() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <NavPostsError error={error as Error} reset={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<NavPostsLoading />}>
            <NavPostsSuccess />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export function NavPostsSuccess() {
  const { isMobile } = useSidebar()
  const postQuery = useGetPosts()
  const queryClient = useQueryClient()
  const deletePost = useDeletePost(queryClient)

  const { data: session } = authClient.useSession()

  function handleDelete(id: number) {
    deletePost.mutate(id, {
      onSuccess: () => {
        toast.success("Post deleted successfully")
      },
      onError: (error) => {
        toast.error(`Failed to delete post: ${error.message}`)
      },
    })
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Posts</SidebarGroupLabel>
      <SidebarMenu>
        {postQuery.data?.map((post) => (
          <SidebarMenuItem key={post.id}>
            <SidebarMenuButton
              render={
                <Link to="/post/$id" params={{ id: post.id.toString() }} />
              }
            >
              <ReceiptText />
              <span>{post.title}</span>
            </SidebarMenuButton>
            {session?.user.id === post.userId && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuAction
                      showOnHover
                      className="aria-expanded:bg-muted"
                    />
                  }
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem
                    render={
                      <Link
                        to="/post/$id"
                        params={{ id: post.id.toString() }}
                      />
                    }
                  >
                    <Eye className="text-muted-foreground" />
                    <span>View Post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={
                      <Link
                        to="/post/$id/edit"
                        params={{ id: post.id.toString() }}
                      />
                    }
                  >
                    <Pencil className="text-muted-foreground" />
                    <span>Edit Post</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDelete(post.id)}>
                    <Trash2Icon className="text-muted-foreground" />
                    <span>Delete Post</span>
                  </DropdownMenuItem>
                  {/* TODO: Auto closes on dialog open */}
                  {/* <AlertDialog>
                  <AlertDialogTrigger
                    className="w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2Icon className="text-muted-foreground" />
                      <span>Delete Post</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this post? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(post.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
