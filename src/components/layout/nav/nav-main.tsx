import { ChevronRight, File, Folder, House } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/components/ui/collapsible.tsx"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "#/components/ui/sidebar.tsx"

// Example data for file tree and changes
const data = {
  active: "button.tsx",
  tree: [
    {
      name: "src",
      children: [
        {
          name: "components",
          open: true,
          children: [
            {
              name: "ui",
              open: true,
              children: [
                { name: "button.tsx" },
                { name: "card.tsx", state: "U" },
              ],
            },
            { name: "header.tsx" },
            { name: "footer.tsx" },
          ],
        },
        {
          name: "lib",
          children: [{ name: "util.ts" }],
        },
        {
          name: "routes",
          children: [
            {
              name: "blog",
              children: [{ name: "page.tsx" }],
            },
            { name: "page.tsx" },
            { name: "layout.tsx" },
          ],
        },
      ],
    },
    {
      name: "public",
      children: [{ name: "favicon.ico" }, { name: "react.svg" }],
    },
    { name: "package.json" },
    { name: "README.md", state: "M" },
  ],
}

export function NavMain() {
  return (
    <>
      {/* 1. Collapsible sidebar group */}
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <Collapsible
            defaultOpen
            className="group/collapsible"
            render={<SidebarMenuItem />}
          >
            <CollapsibleTrigger
              render={<SidebarMenuButton tooltip="Playground" />}
            >
              <House />
              <span>Houses</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton>
                    <span>House Atreides</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton>
                    <span>House Harkonnen</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton>
                    <span>House Richese</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>

      {/* 2. File tree */}
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Files</SidebarGroupLabel>
        <SidebarMenu>
          {data.tree.map((item, index) => (
            <Tree key={index} node={item} active={data.active} />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}

// Tree for data structure, supports state badge
function Tree({ node, active }: { node: any; active: string }) {
  if (!node) return null
  // Leaf node (file)
  if (!node.children) {
    return (
      <SidebarMenuButton
        isActive={node.name === active}
        className="relative data-[active=true]:bg-transparent"
      >
        <File />
        <span>{node.name}</span>
        {node.state && (
          <SidebarMenuBadge
            className={
              node.state === "M"
                ? "bg-yellow-700 text-white"
                : node.state === "U"
                  ? "bg-lime-800 text-white"
                  : "bg-gray-300 text-black"
            }
          >
            {node.state}
          </SidebarMenuBadge>
        )}
      </SidebarMenuButton>
    )
  }
  // Folder node
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={node.open === true}
      >
        <CollapsibleTrigger render={<SidebarMenuButton />}>
          <ChevronRight className="transition-transform" />
          <Folder />
          <span>{node.name}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {node.children.map((child: any, idx: number) => (
              <Tree key={idx} node={child} active={active} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
