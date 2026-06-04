import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import type { LucideIcon } from "lucide-react"
import { Ghost, ShieldCheck, UserRound } from "lucide-react"
import type * as React from "react"

import { cn } from "#/lib/utils.ts"

import type { Role } from "#/features/user/schema"

const roleBadgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap capitalize transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      role: {
        admin:
          "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
        user: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
        guest:
          "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
      },
    },
    defaultVariants: {
      role: "user",
    },
  }
)

const roleIcon: Record<Role, LucideIcon> = {
  admin: ShieldCheck,
  user: UserRound,
  guest: Ghost,
}

function RoleBadge({
  className,
  role = "user",
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof roleBadgeVariants>) {
  const Icon = roleIcon[role]
  return (
    <span
      data-slot="badge"
      className={cn(roleBadgeVariants({ role }), className)}
      {...props}
    >
      <Icon />
      {children}
    </span>
  )
}

export { RoleBadge, roleBadgeVariants }
