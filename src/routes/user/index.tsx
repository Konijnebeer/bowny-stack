import { AtSign, Search, User } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "#/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "#/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Spinner } from "#/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"

import { useDebounce } from "#/hooks/use-debounce"

import type {
  Role,
  SortBy,
  SortDirection,
  User as UserType,
} from "#/features/user"
import {
  RoleBadge,
  SeedUsersDialog,
  SortIcon,
  useGetUsersInfinite,
} from "#/features/user"

export const Route = createFileRoute("/user/")({
  component: RouteComponent,
})

const columnHelper = createColumnHelper<UserType>()

function RouteComponent() {
  const [searchValue, setSearchValue] = useState("")
  const [searchField, setSearchField] = useState<"name" | "email">("name")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [sortBy, setSortBy] = useState<SortBy>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const { queryClient } = Route.useRouteContext()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce(searchValue, 300)

  function handleSortToggle(column: "name" | "email") {
    if (sortBy !== column) {
      setSortBy(column)
      setSortDirection("asc")
    } else if (sortDirection === "asc") {
      setSortDirection("desc")
    } else {
      setSortBy(null)
    }
  }

  const queryParams = useMemo(
    () => ({
      ...(debouncedSearch
        ? {
            searchField,
            searchOperator: "contains",
            searchValue: debouncedSearch,
          }
        : {}),
      ...(roleFilter !== "all"
        ? {
            filterField: "role",
            filterOperator: "eq",
            filterValue: roleFilter,
          }
        : {}),
      ...(sortBy ? { sortBy, sortDirection } : {}),
    }),
    [debouncedSearch, searchField, roleFilter, sortBy, sortDirection]
  )

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetUsersInfinite(queryParams)

  const allUsers = useMemo(
    () => data?.pages.flatMap((p) => p.users) ?? [],
    [data]
  )
  const totalUsers = data?.pages[0]?.total ?? 0

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => (
          <button
            type="button"
            onClick={() => handleSortToggle("name")}
            className="flex items-center font-medium hover:text-foreground"
          >
            Name
            <SortIcon
              column="name"
              sortBy={sortBy}
              sortDirection={sortDirection}
            />
          </button>
        ),
        cell: (info) => (
          <Link
            to="/user/$id"
            params={{ id: info.row.original.id }}
            className="font-medium underline-offset-4 hover:underline"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor("email", {
        header: () => (
          <button
            type="button"
            onClick={() => handleSortToggle("email")}
            className="flex items-center font-medium hover:text-foreground"
          >
            Email
            <SortIcon
              column="email"
              sortBy={sortBy}
              sortDirection={sortDirection}
            />
          </button>
        ),
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("role", {
        header: () => (
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as Role | "all")}
          >
            <SelectTrigger
              size="sm"
              className="h-7 w-28 border-0 shadow-none focus-visible:ring-0"
            >
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        ),
        cell: (info) => (
          <RoleBadge role={info.getValue()}>{info.getValue()}</RoleBadge>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Joined",
        cell: (info) => (
          <span className="ml-auto text-right tabular-nums">
            {new Date(info.getValue()).toLocaleDateString("en-UK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      }),
    ],
    [sortBy, sortDirection, roleFilter]
  )

  const table = useReactTable({
    // @ts-expect-error
    data: allUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${totalUsers} users total`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SeedUsersDialog queryClient={queryClient} />

          <Button
            variant="outline"
            render={<Link to="/" />}
            nativeButton={false}
          >
            Back
          </Button>
        </div>
      </div>

      <InputGroup className="max-w-sm">
        <InputGroupAddon align="inline-start">
          <Search className="size-4 text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={`Search by ${searchField}…`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() =>
              setSearchField((prev) => (prev === "name" ? "email" : "name"))
            }
            title={`Switch to search by ${searchField === "name" ? "email" : "name"}`}
          >
            {searchField === "name" ? (
              <User className="size-3.5" />
            ) : (
              <AtSign className="size-3.5" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {isFetchingNextPage && (
              <TableRow>
                <TableCell colSpan={4} className="py-3 text-center">
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />
    </div>
  )
}
