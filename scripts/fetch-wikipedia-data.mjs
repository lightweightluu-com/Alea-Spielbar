// One-off data pipeline: resolves each game in games-source.json against Wikipedia's public REST
// API and writes the enriched result to src/games-data.json, which the site reads as a static
// asset at build time.
//
// This exists as a fallback to fetch-bgg-data.mjs: BoardGameGeek's API sits behind Cloudflare bot
// protection that blocks this build sandbox's IP range outright (401/403 on every request, even
// with a descriptive User-Agent). Wikipedia's REST API has no such block, so it's used here for
// the description + cover image; BGG-specific stats (player/playtime ranges, complexity, rating)
// are left null and can be backfilled later with fetch-bgg-data.mjs from an unblocked network.
//
// Re-run manually with `node scripts/fetch-wikipedia-data.mjs` if the shelf list changes.
import { readFileSync, writeFileSync } from 'node:fs'

const SUMMARY_URL = (lang, title) => `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
const REQUEST_DELAY_MS = 300
const USER_AGENT = 'alea-spielbar-site/1.0 (games catalog build script; contact: lucienryter@gmail.com)'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function fetchSummary(lang, title, attempt = 1) {
  const res = await fetch(SUMMARY_URL(lang, title), { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } })
  if (res.status === 404) return null
  if (res.status === 429 && attempt <= 4) {
    await sleep(2000 * attempt)
    return fetchSummary(lang, title, attempt + 1)
  }
  if (!res.ok) {
    if (attempt <= 3) {
      await sleep(1000 * attempt)
      return fetchSummary(lang, title, attempt + 1)
    }
    throw new Error(`${lang}:${title} -> HTTP ${res.status}`)
  }
  return res.json()
}

function candidateTitles(name, disambiguator) {
  const base = name.replace(/\s*\([^)]*\)\s*/g, '').trim()
  const shortName = name.split(':')[0].trim()
  const spaced = name.replace(/-/g, ' ')
  const titles = [
    `${name} (${disambiguator})`,
    name,
    `${base} (${disambiguator})`,
    base,
    `${shortName} (${disambiguator})`,
    shortName,
    `${spaced} (${disambiguator})`,
    spaced,
  ]
  return [...new Set(titles)]
}

async function trySummary(title, lang) {
  const summary = await fetchSummary(lang, title)
  await sleep(REQUEST_DELAY_MS)
  if (!summary) return null
  if (summary.type === 'disambiguation') return null
  const image = summary.originalimage?.source ?? summary.thumbnail?.source ?? null
  const description = summary.extract ? summary.extract.slice(0, 700).trim() : null
  if (!image && !description) return null
  return {
    image,
    description,
    wikipediaUrl: summary.content_urls?.desktop?.page ?? null,
  }
}

async function resolveInLang(name, lang, disambiguator) {
  for (const title of candidateTitles(name, disambiguator)) {
    const hit = await trySummary(title, lang)
    if (hit) return hit
  }
  return null
}

// A handful of shelf titles don't resolve via the generic "(board game)"/"(Spiel)" candidates
// above (different disambiguator, a colon the shop name drops, or a completely different
// Wikipedia title) but do have an article worth linking. Filled in by hand after inspecting the
// first fetch run's misses.
const NAME_OVERRIDES = {
  Uno: 'Uno (card game)',
  'Brass Birmingham': 'Brass: Birmingham',
  'Codenames Duett': 'Codenames: Duet',
  'Ubongo! Classic': 'Ubongo',
  SET: 'Set (card game)',
  'Skull King': 'Skull King (game)',
  'Dune Imperium': 'Dune: Imperium',
  'Dune Imperium Uprising': 'Dune: Imperium – Uprising',
  'Werwölfe von Düsterwald': 'Die Werwölfe von Düsterwald',
  'Der Fuchs im Wald': 'Der Fuchs im Wald (Spiel)',
}

// Tries the English article first (usually the richer, more complete summary), then falls back
// to the German Wikipedia — many titles in this shelf are German editions with no English article.
async function resolveGame(name) {
  const override = NAME_OVERRIDES[name]
  if (override) {
    const hit = (await trySummary(override, 'en')) ?? (await trySummary(override, 'de'))
    if (hit) return hit
  }
  return (await resolveInLang(name, 'en', 'board game')) ?? (await resolveInLang(name, 'de', 'Spiel'))
}

async function main() {
  const source = JSON.parse(readFileSync(new URL('./games-source.json', import.meta.url), 'utf8'))

  const resolved = []
  let matched = 0
  let unmatched = 0

  for (const [index, game] of source.entries()) {
    process.stderr.write(`[${index + 1}/${source.length}] ${game.name} ... `)
    if (game.skip) {
      resolved.push({ ...game, slug: slugify(game.name), bggId: null })
      process.stderr.write('skipped (generic item)\n')
      continue
    }
    try {
      const hit = await resolveGame(game.name)
      if (!hit) {
        resolved.push({ ...game, slug: slugify(game.name), bggId: null })
        unmatched++
        process.stderr.write('no match\n')
      } else {
        resolved.push({ ...game, slug: slugify(game.name), bggId: null, ...hit })
        matched++
        process.stderr.write('matched\n')
      }
    } catch (err) {
      resolved.push({ ...game, slug: slugify(game.name), bggId: null })
      unmatched++
      process.stderr.write(`error: ${err.message}\n`)
    }
  }

  process.stderr.write(`\nDone: ${matched} matched, ${unmatched} unmatched.\n`)

  writeFileSync(new URL('../src/games-data.json', import.meta.url), JSON.stringify(resolved, null, 2) + '\n')
  process.stderr.write(`Wrote src/games-data.json with ${resolved.length} games (${matched} enriched from Wikipedia).\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
