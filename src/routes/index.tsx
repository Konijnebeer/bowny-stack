import { createFileRoute } from "@tanstack/react-router"

import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

export const Route = createFileRoute("/")({ component: RouteComponent })

const features = [
  {
    title: "TypeScript",
    description:
      "Fully typed for better developer experience and maintainability. All used libraries are TypeScript first, ensuring type safety across the entire stack.",
  },
  {
    title: "Organized by features",
    description:
      "The project is structured in a features folder, where each feature contains its own components, hooks, and server functions.",
  },
  {
    title: "Database & ORM",
    description:
      "Drizzle ORM for seamless database interactions with PostgreSQL, powered by Neon for serverless database hosting. All schemas live in their own feature folder, to keep it organized.",
  },
  {
    title: "API & Data",
    description:
      "Server functions and TanStack Query for efficient data fetching and caching.",
  },
  {
    title: "Forms & validation",
    description:
      "TanStack Forms for building forms with ease, integrated with Zod for schema validation created from the Drizzle ORM schemas.",
  },
  {
    title: "Authentication",
    description:
      "Better Auth for secure and flexible authentication solutions. Includes an auth guard for the router and middleware for server functions.",
  },
  {
    title: "UI Components",
    description:
      "ShadCN UI/Base-UI/Tailwind CSS for a modern, accessible, and customizable design system.",
  },
  {
    title: "Hosting",
    description:
      "The project is designed to be hosted on Cloudflare pages, but can be easily adapted to other hosting providers.",
  },
]

function RouteComponent() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-bold">Bowney Stack</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Bowny Stack is a full-stack web application boilerplate built with
        TanStack Start (React), Drizzle ORM, Neon for PostgreSQL, Better Auth
        for authentication, and ShadCN UI/Base-UI/Tailwind CSS for components.
        It provides a solid foundation for building modern web applications with
        a focus on performance, scalability, and developer experience.
      </p>
      <h2 className="mt-10 mb-4 text-2xl font-semibold">Features</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>{feature.description}</CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
