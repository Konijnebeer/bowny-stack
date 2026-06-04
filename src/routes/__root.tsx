import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import type { ErrorComponentProps } from "@tanstack/react-router"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

import { Header } from "#/components/layout/header"
import { ThemeProvider } from "#/components/theme-provider"
import { Toaster } from "#/components/ui/sonner"

import { useAuthStore } from "#/features/auth"

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
        title: "Bowny Stack",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => {
    const current = useAuthStore.getState().session
    if (current !== undefined) return

    await useAuthStore.getState().fetchSession()
  },
  shellComponent: RootDocument,
  notFoundComponent: notFoundComponent,
  errorComponent: ErrorComponent,
})

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Toaster />
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <Header />
          <Outlet />
        </ThemeProvider>
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

function notFoundComponent() {
  return (
    <main className="mx-auto mt-80 flex flex-col items-center justify-center gap-4">
      <h1 className="text-8xl">404</h1>
      <p className="text-2xl">Page not found</p>
    </main>
  )
}

function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="mx-auto mt-80 flex flex-col items-center justify-center gap-4">
      <h1 className="text-8xl">Error</h1>
      <p className="text-2xl">{error.message}</p>
    </main>
  )
}
