# Bowny Stack

Bowny Stack is a full-stack web application boilerplate built with TanStack Start (React) with Drizzle ORM, Neon for PostgreSQL, Better Auth for authentication, and ShadCN UI/Base-UI/Tailwind CSS for components. It provides a solid foundation for building modern web applications with a focus on performance, scalability, and developer experience.

# Why Bowny Stack?

The given boiler plate from TanStack CLI is an okay starting point, but lacks a lot in terms of integrating all the extra library options that are available. Bowny Stack aims to give a more complete starting point for developers who want to quickly start building and not configuring.

## Features

Build with type safety and developer experience in mind, Bowny Stack includes the following features:

- **TypeScript**: Fully typed for better developer experience and maintainability.
  All used libraries are TypeScript first, ensuring type safety across the entire stack.
- **Organized by features**: The project is structured in a features folder, where each feature contains its own components, hooks, and server functions.
- **Database & ORM**: Drizzle ORM for seamless database interactions with PostgreSQL, powered by Neon for serverless database hosting.
  All schemas live in their own feature folder, to keep it organized.
- **API & Data**: Server functions and TanStack Query for efficient data fetching and caching.
- **Authentication**: Better Auth for secure and flexible authentication solutions.
  Includes an auth guard for the router and middleware for server functions.
- **UI Components**: ShadCN UI/Base-UI/Tailwind CSS for a modern and customizable design system.
- **Forms & validation**: TanStack Forms for building forms with ease, integrated with Zod for schema validation created from the Drizzle ORM schemas.
