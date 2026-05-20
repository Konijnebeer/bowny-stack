"use client"

import { Rabbit } from "lucide-react"
import * as React from "react"
import { Link } from "@tanstack/react-router"

import { NavMain } from "#/components/layout/nav/nav-main.tsx"
import { NavPosts } from "#/components/layout/nav/nav-posts"
import { NavUser } from "#/components/layout/nav/nav-user.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "#/components/ui/sidebar.tsx"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              {open && (
                <>
                  <Link to="/">
                    <Rabbit />
                    <span className="sr-only">home</span>
                  </Link>
                  <span>Bowney Stack</span>
                </>
              )}
              <SidebarTrigger
                aria-label="Open/Close Sidebar"
                className={open ? "ml-auto" : "pr-3"}
              />
              {/* <SidebarMenuAction
                render={
                }
              /> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavPosts />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
