import { Link } from "@tanstack/react-router"

import { ModeToggle } from "#/components/mode-toggle"
import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"

import { authClient } from "#/lib/auth-client"

function Header() {
  const { data: session, isPending } = authClient.useSession()

  return (
    <header className="flex items-center gap-4 bg-muted p-4">
      <Button variant="link" nativeButton={false} render={<Link to="/" />}>
        home
      </Button>
      <Button variant="link" nativeButton={false} render={<Link to="/post" />}>
        Posts
      </Button>
      <div className="ml-auto flex items-center gap-2 justify-self-end">
        {isPending ? (
          <Skeleton className="mx-4 h-4 w-12 bg-background" />
        ) : session ? (
          <Button
            variant="link"
            nativeButton={false}
            render={<Link to="/account" />}
          >
            Account
          </Button>
        ) : (
          <Button
            variant="link"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            Login
          </Button>
        )}
        <ModeToggle />
      </div>
    </header>
  )
}
export { Header }
