import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"

export type SortDirection = "asc" | "desc"
export type SortBy = "name" | "email" | null

export function SortIcon({
  column,
  sortBy,
  sortDirection,
}: {
  column: "name" | "email"
  sortBy: SortBy
  sortDirection: SortDirection
}) {
  if (sortBy !== column)
    return (
      <ChevronsUpDown className="ml-1 inline size-3.5 text-muted-foreground" />
    )
  if (sortDirection === "asc")
    return <ChevronUp className="ml-1 inline size-3.5" />
  return <ChevronDown className="ml-1 inline size-3.5" />
}
