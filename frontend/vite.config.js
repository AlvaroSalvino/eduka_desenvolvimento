import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  base: "/static/react/",

  server: {
    host: true,
    port: 8080
  },

  plugins: [
    react()
  ],

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src")
    }
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false
  }
})