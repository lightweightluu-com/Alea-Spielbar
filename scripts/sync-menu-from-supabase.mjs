// Build-time data pipeline: pulls the current `menu_items` table from Supabase and writes it to
// src/menu-data.json — the same pattern as sync-games-from-supabase.mjs, so src/menu.ts needs
// zero changes to consume whichever source last populated this file.
//
// This is what lets the owner manage the Speise- & Getränkekarte through /admin while the public
// site stays a fully static build with zero runtime dependency on Supabase for visitors: she
// edits in the admin UI (writes straight to Supabase), and the next time this script runs — via
// the GitHub Actions deploy workflow, see .github/workflows/deploy.yml — the static site picks
// up her changes.
//
// IMPORTANT: the regenerated file is NOT committed back to the repo by CI. It only affects that
// CI run's `dist/` output — see sync-games-from-supabase.mjs for the full rationale.
//
// Uses the service-role key, not the anon key: `menu_items` has no public read policy (see
// supabase/schema.sql), by design, since the public site never queries Supabase for menu items
// at runtime — only this script does, server-side, at build time.
import { writeFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.')
  console.error('See .env.example — this script needs the service-role key, not the anon key.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

/** snake_case `menu_items` row -> camelCase MenuItem (src/menu.ts). */
function toMenuItem(row) {
  return {
    section: row.section,
    category: row.category,
    slug: row.slug,
    name: row.name,
    description: row.description ?? null,
    price: row.price,
    unit: row.unit ?? null,
    featured: row.featured ?? false,
    sortOrder: row.sort_order ?? 0,
  }
}

async function main() {
  const { data, error } = await supabase.from('menu_items').select('*').order('sort_order')
  if (error) {
    console.error('Failed to fetch menu items from Supabase:', error.message)
    process.exit(1)
  }

  const items = data.map(toMenuItem)
  writeFileSync(new URL('../src/menu-data.json', import.meta.url), JSON.stringify(items, null, 2) + '\n')
  console.log(`Wrote src/menu-data.json with ${items.length} menu items from Supabase.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
