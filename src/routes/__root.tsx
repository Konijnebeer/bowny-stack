import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

import { Header } from "#/components/layout/header"
import { AppSidebar } from "#/components/layout/nav/app-sidebar"
import { ThemeProvider } from "#/components/theme-provider"
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar"
import { Toaster } from "#/components/ui/sonner"
import { TooltipProvider } from "#/components/ui/tooltip"

import appCss from "#/styles.css?url"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: notFound,
})

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Body>
          <Outlet />
        </Body>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

// Component for the body elements
function Body({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Toaster />
          <TooltipProvider>
            <Header />
            {children}
          </TooltipProvider>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

function notFound() {
  return (
    <main className="mx-auto mt-80 flex flex-col items-center justify-center gap-4">
      <h1 className="text-8xl">404</h1>
      <p className="text-2xl">Page not found</p>
    </main>
  )
}
