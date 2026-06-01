import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"


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
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
