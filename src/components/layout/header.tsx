import { Link } from "@tanstack/react-router"

import { ModeToggle } from "#/components/mode-toggle"
import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"

import { authClient } from "#/lib/auth-client"

function Header() {
  const { data: session, isPending } = authClient.useSession()

  return (
    <header className="flex items-center gap-4 bg-muted p-4">
      <Button variant="link">
        <Link to="/">Home</Link>
      </Button>
      <Button variant="link">
        <Link to="/post">Posts</Link>
      </Button>
      <div className="ml-auto flex items-center gap-2 justify-self-end">
        {isPending ? (
          <Skeleton className="mx-4 h-4 w-12 bg-background" />
        ) : session ? (
          <Button variant="link">
            <Link to="/account">Account</Link>
          </Button>
        ) : (
          <Button variant="link">
            <Link to="/login">Login</Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </header>
  )
}
export { Header }
