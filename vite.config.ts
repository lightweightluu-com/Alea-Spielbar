import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      // Two static pages from one build: the public site (index.html) and the owner's
      // password-protected admin UI (admin.html), both deployed as part of the same
      // Cloudflare Pages output — see public/_redirects for the /admin -> /admin.html rewrite.
      input: {
        main: `${root}index.html`,
        admin: `${root}admin.html`,
      },
    },
  },
})
