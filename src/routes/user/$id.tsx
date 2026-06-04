import type { ErrorComponentProps } from "@tanstack/react-router"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Skeleton } from "#/components/ui/skeleton"
import { Spinner } from "#/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"

import type { Role } from "#/features/user"
import {
  BanUserDialog,
  getUserQueryOptions,
  getUserSessionsQueryOptions,
  RoleBadge,
  useGetUser,
  useGetUserSessions,
  useRevokeAllSessions,
  useRevokeSession,
  useSetUserRole,
} from "#/features/user"

export const Route = createFileRoute("/user/$id")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(getUserQueryOptions(params.id))
    queryClient.prefetchQuery(getUserSessionsQueryOptions(params.id))
  },
  pendingMs: 300,
  pendingMinMs: 200,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  component: RouteComponent,
})

function PendingComponent() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}

function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="space-y-4 p-6">
      <Button
        variant="outline"
        render={<Link to="/user" />}
        nativeButton={false}
      >
        Back to Users
      </Button>
      <p className="text-center text-muted-foreground">{error.message}</p>
    </div>
  )
}

function RouteComponent() {
  const { id } = Route.useParams()
  const { queryClient } = Route.useRouteContext()
  const { data: user } = useGetUser(id)
  const { data: sessions } = useGetUserSessions(id)
  const setRoleMutation = useSetUserRole(id, queryClient)
  const revokeOne = useRevokeSession(id, queryClient)
  const revokeAll = useRevokeAllSessions(id, queryClient)

  const role = (user.role ?? "user") as Role

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <BanUserDialog
            userId={id}
            isBanned={user.banned ?? false}
            banReason={user.banReason}
            banExpires={user.banExpires}
            queryClient={queryClient}
          />
          <Button
            variant="outline"
            render={<Link to="/user" />}
            nativeButton={false}
          >
            Back
          </Button>
        </div>
      </div>

      {/* User info */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>User info</CardTitle>
          <CardAction>
            <RoleBadge role={role}>{role}</RoleBadge>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow
            label="Joined"
            value={new Date(user.createdAt).toLocaleDateString("en-UK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Role
            </span>
            <div className="flex items-center gap-2">
              {setRoleMutation.isPending && <Spinner />}
              <Select
                value={role}
                onValueChange={(v) => setRoleMutation.mutate(v as Role)}
                disabled={setRoleMutation.isPending}
              >
                <SelectTrigger size="sm" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Active sessions</CardTitle>
          <CardAction>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => revokeAll.mutate()}
              disabled={revokeAll.isPending || sessions.length === 0}
            >
              {revokeAll.isPending && <Spinner />}
              Revoke all
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-4">
          {sessions.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No active sessions.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="max-w-48 truncate text-muted-foreground">
                      {session.userAgent ?? "—"}
                    </TableCell>
                    <TableCell>{session.ipAddress ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(session.createdAt).toLocaleDateString("en-UK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(session.expiresAt).toLocaleDateString("en-UK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => revokeOne.mutate(session.token)}
                        disabled={revokeOne.isPending}
                      >
                        {revokeOne.isPending && <Spinner />}
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}
