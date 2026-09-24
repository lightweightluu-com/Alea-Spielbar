// One-off migration: pushes the committed scripts/menu-source.json (transcribed from the old
// Alea_Menu.pdf) into the Supabase `menu_items` table. Run this exactly once against a fresh
// project, after applying supabase/schema.sql and before the owner's first login to /admin —
// otherwise she'd see an empty menu instead of the existing Speise- & Getränkekarte.
//
// Safe to re-run: upserts on `slug` (derived from section/category/name), so running it twice
// never creates duplicates. Not wired into CI — this is a manual, one-time backfill, not part of
// the ongoing build-time sync (that's scripts/sync-menu-from-supabase.mjs, which runs the other
// direction: Supabase -> menu-data.json).
//
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-menu-to-supabase.mjs
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { slugify } from './lib/slugify.mjs'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BATCH_SIZE = 50

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.')
  console.error('See .env.example — this script needs the service-role key, not the anon key.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function toRow(item, index) {
  return {
    section: item.section,
    category: item.category,
    slug: slugify(`${item.section}-${item.category}-${item.name}`),
    name: item.name,
    description: item.description ?? null,
    price: item.price,
    unit: item.unit ?? null,
    featured: item.featured ?? false,
    sort_order: index,
  }
}

async function main() {
  const items = JSON.parse(readFileSync(new URL('./menu-source.json', import.meta.url), 'utf8'))
  const rows = items.map(toRow)

  let migrated = 0
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('menu_items').upsert(batch, { onConflict: 'slug' })
    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error.message)
      process.exit(1)
    }
    migrated += batch.length
    process.stderr.write(`  migrated ${migrated}/${rows.length}\n`)
  }

  console.log(`\nDone: upserted ${migrated} menu items into Supabase.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
