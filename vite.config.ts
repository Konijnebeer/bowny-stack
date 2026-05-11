import { defineConfig } from "vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"

import neon from "./neon-vite-plugin.ts"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // testing if the bottom 2 help
  // optimizeDeps: {
  //   exclude: ['@tanstack/react-start', '@tanstack/start-server-core'],
  // },
  // ssr: {
  //   optimizeDeps: {
  //     exclude: ['@tanstack/react-start', '@tanstack/start-server-core'],
  //   },
  // },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    neon,
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
