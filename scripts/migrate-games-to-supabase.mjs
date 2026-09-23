// One-off migration: pushes the currently-committed src/games-data.json into the Supabase
// `games` table. Run this exactly once against a fresh project, after applying
// supabase/schema.sql and before the owner's first login to /admin — otherwise she'd see an
// empty games list instead of the existing 146-game shelf.
//
// Safe to re-run: upserts on `slug`, so running it twice never creates duplicates. It is NOT
// wired into CI and never should be — this is a manual, one-time backfill, not part of the
// ongoing build-time sync (that's scripts/sync-games-from-supabase.mjs, which runs the other
// direction: Supabase -> games-data.json).
//
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-games-to-supabase.mjs
// (or `.env` via a runner like `node --env-file=.env scripts/migrate-games-to-supabase.mjs`).
// Needs the service-role key, not the anon key: bulk-writing to `games` requires bypassing RLS
// (see supabase/schema.sql — `games` has no public write policy by design).
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BATCH_SIZE = 50

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.')
  console.error('See .env.example — this script needs the service-role key, not the anon key.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

/** camelCase Game -> snake_case `games` row. Inverse of the mapping in sync-games-from-supabase.mjs. */
function toRow(game) {
  return {
    name: game.name,
    language: game.language ?? null,
    expansions: game.expansions ?? null,
    slug: game.slug,
    bgg_id: game.bggId ?? null,
    bgg_name: game.bggName ?? null,
    image: game.image ?? null,
    description: game.description ?? null,
    min_players: game.minPlayers ?? null,
    max_players: game.maxPlayers ?? null,
    min_playtime: game.minPlaytime ?? null,
    max_playtime: game.maxPlaytime ?? null,
    complexity: game.complexity ?? null,
    rating: game.rating ?? null,
    bgg_url: game.bggUrl ?? null,
    wikipedia_url: game.wikipediaUrl ?? null,
  }
}

async function main() {
  const games = JSON.parse(readFileSync(new URL('../src/games-data.json', import.meta.url), 'utf8'))
  const rows = games.map(toRow)

  let migrated = 0
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('games').upsert(batch, { onConflict: 'slug' })
    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error.message)
      process.exit(1)
    }
    migrated += batch.length
    process.stderr.write(`  migrated ${migrated}/${rows.length}\n`)
  }

  console.log(`\nDone: upserted ${migrated} games into Supabase.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
