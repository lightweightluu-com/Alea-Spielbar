// Build-time data pipeline: pulls the current `games` table from Supabase and writes it to
// src/games-data.json, exactly like fetch-bgg-data.mjs/fetch-wikipedia-data.mjs already do for
// their respective sources — so src/games.ts and src/gamePages.ts need zero changes to consume
// whichever source last populated this file.
//
// This is what lets the owner manage games through /admin while the public site stays a fully
// static build with zero runtime dependency on Supabase for visitors: she edits in the admin UI
// (writes straight to Supabase), and the next time this script runs — via the GitHub Actions
// deploy workflow, see .github/workflows /deploy.yml — the static site picks up her changes.
//
// IMPORTANT: the regenerated file is NOT committed back to the repo by CI (that would need a
// bot with push access and risks a commit loop). It only affects that CI run's `dist/` output.
// The committed copy of src/games-data.json in git will therefore drift from what's actually
// live — harmless for the deployed site (CI always regenerates fresh), but it does mean a local
// `git clone` + `npm run dev` won't show the latest Supabase content unless you run this script
// locally first (`npm run games:sync`, with SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY set).
//
// Uses the service-role key, not the anon key: `games` has no public read policy (see
// supabase/schema.sql), by design, since the public site never queries Supabase for games at
// runtime — only this script does, server-side, at build time.
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

/** snake_case `games` row -> camelCase Game (src/games.ts:3-20). Inverse of migrate-games-to-supabase.mjs's mapping. */
function toGame(row) {
  return {
    name: row.name,
    language: row.language ?? null,
    ...(row.expansions ? { expansions: row.expansions } : {}),
    slug: row.slug,
    bggId: row.bgg_id ?? null,
    bggName: row.bgg_name ?? null,
    image: row.image ?? null,
    description: row.description ?? null,
    minPlayers: row.min_players ?? null,
    maxPlayers: row.max_players ?? null,
    minPlaytime: row.min_playtime ?? null,
    maxPlaytime: row.max_playtime ?? null,
    complexity: row.complexity ?? null,
    rating: row.rating ?? null,
    bggUrl: row.bgg_url ?? null,
    wikipediaUrl: row.wikipedia_url ?? null,
  }
}

async function main() {
  const { data, error } = await supabase.from('games').select('*').order('name')
  if (error) {
    console.error('Failed to fetch games from Supabase:', error.message)
    process.exit(1)
  }

  const games = data.map(toGame)
  writeFileSync(new URL('../src/games-data.json', import.meta.url), JSON.stringify(games, null, 2) + '\n')
  console.log(`Wrote src/games-data.json with ${games.length} games from Supabase.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
