import { useState } from "react"
import type { QueryClient } from "@tanstack/react-query"

import { Button } from "#/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog"
import { FieldGroup } from "#/components/ui/field"
import { Spinner } from "#/components/ui/spinner"

import { useUserForm } from "#/features/user/hooks/form"
import { useBanUser, useUnbanUser } from "#/features/user/hooks/query"
import type { BanDuration } from "#/features/user/schema"
import { BAN_DURATIONS, banUserSchema } from "#/features/user/schema"

interface BanUserDialogProps {
  userId: string
  isBanned: boolean
  banReason?: string | null
  banExpires?: Date | null
  queryClient: QueryClient
}

export function BanUserDialog({
  userId,
  isBanned,
  banReason,
  banExpires,
  queryClient,
}: BanUserDialogProps) {
  if (isBanned) {
    return (
      <UnbanDialog
        userId={userId}
        banReason={banReason}
        banExpires={banExpires}
        queryClient={queryClient}
      />
    )
  }
  return <BanDialog userId={userId} queryClient={queryClient} />
}

function BanDialog({
  userId,
  queryClient,
}: {
  userId: string
  queryClient: QueryClient
}) {
  const [open, setOpen] = useState(false)
  const banMutation = useBanUser(userId, queryClient)

  const form = useUserForm({
    defaultValues: {
      banReason: "",
      banDuration: "permanent" as BanDuration,
    },
    validators: { onSubmit: banUserSchema },
    onSubmit: async ({ value }) => {
      await banMutation.mutateAsync({
        banReason: value.banReason.trim() || undefined,
        banExpiresIn:
          value.banDuration === "permanent"
            ? undefined
            : Number(value.banDuration),
      })
      setOpen(false)
    },
  })

  function handleOpenChange(next: boolean) {
    if (!next) form.reset()
    setOpen(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="destructive" />}>
        Ban user
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>Ban user</DialogTitle>
            <DialogDescription>
              The user will be immediately signed out and unable to log in.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <form.AppField
              name="banReason"
              children={(field) => (
                <field.TextAreaField
                  label="Reason"
                  placeholder="Enter a reason…"
                  maxCharacters="500"
                  rows={3}
                />
              )}
            />
            <form.AppField
              name="banDuration"
              children={(field) => (
                <field.SelectField
                  label="Duration"
                  options={BAN_DURATIONS.map((d) => ({
                    label: d.label,
                    value: d.value,
                  }))}
                />
              )}
            />
          </FieldGroup>
          <DialogFooter showCloseButton>
            <Button
              type="submit"
              variant="destructive"
              disabled={banMutation.isPending}
            >
              {banMutation.isPending && <Spinner />}
              Ban user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function UnbanDialog({
  userId,
  banReason,
  banExpires,
  queryClient,
}: {
  userId: string
  banReason?: string | null
  banExpires?: Date | null
  queryClient: QueryClient
}) {
  const [open, setOpen] = useState(false)
  const unbanMutation = useUnbanUser(userId, queryClient)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Unban user
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unban user</DialogTitle>
          <DialogDescription>
            Are you sure? The user will regain access immediately.
            {banReason && (
              <span className="mt-1.5 block">
                Current ban reason:{" "}
                <span className="font-medium text-foreground">{banReason}</span>
              </span>
            )}
            {banExpires && (
              <span className="mt-1.5 block">
                Ban expires:{" "}
                <span className="font-medium text-foreground">
                  {banExpires.toLocaleDateString("en-UK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button
            onClick={() =>
              unbanMutation.mutate(undefined, {
                onSuccess: () => setOpen(false),
              })
            }
            disabled={unbanMutation.isPending}
          >
            {unbanMutation.isPending && <Spinner />}
            Confirm unban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
