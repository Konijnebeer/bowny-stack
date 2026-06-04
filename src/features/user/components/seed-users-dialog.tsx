import { useState } from "react"
import type { QueryClient } from "@tanstack/react-query"

import { Button } from "#/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog"
import { Input } from "#/components/ui/input"
import { Spinner } from "#/components/ui/spinner"

import { useSeedUsers } from "#/features/user/hooks/query"

export function SeedUsersDialog({ queryClient }: { queryClient: QueryClient }) {
  const [seedCount, setSeedCount] = useState(10)
  const seedMutation = useSeedUsers(queryClient)

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Seed users
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seed users</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <label className="text-sm font-medium" htmlFor="seed-count">
            Number of users to create
          </label>
          <Input
            id="seed-count"
            type="number"
            min={1}
            max={500}
            value={seedCount}
            onChange={(e) => setSeedCount(Number(e.target.value))}
          />
        </div>
        <DialogFooter showCloseButton>
          <Button
            onClick={() => seedMutation.mutate(seedCount)}
            disabled={seedMutation.isPending}
          >
            {seedMutation.isPending ? (
              <>
                <Spinner />
                Creating…
              </>
            ) : (
              "Create users"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
