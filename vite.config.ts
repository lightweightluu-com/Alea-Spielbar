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
      // Cloudflare Pages output. /admin resolves to admin.html via Cloudflare Pages' own
      // built-in clean-URL asset lookup (exact path, then + ".html", then + "/index.html") —
      // do NOT add a `public/_redirects` rule rewriting /admin -> /admin.html: that creates an
      // infinite redirect loop against this same built-in behavior (Pages 308s admin.html back
      // to /admin, the _redirects rule rewrites /admin to admin.html, repeat).
      input: {
        main: `${root}index.html`,
        admin: `${root}admin.html`,
      },
    },
  },
})
