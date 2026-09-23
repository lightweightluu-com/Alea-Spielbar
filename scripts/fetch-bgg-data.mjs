// One-off data pipeline: resolves each game in games-source.json against BoardGameGeek's
// public XML API and writes the enriched result to src/games-data.json, which the site reads
// as a static asset at build time (no live API calls from the browser — BGG's API has no CORS
// headers for browser fetch, and 150 rate-limited lookups aren't something a visitor should wait
// on). Re-run manually with `npm run games:fetch` (or `node scripts/fetch-bgg-data.mjs`) if the
// shelf list changes.
//
// Note: BGG's API sits behind Cloudflare bot protection that blocks requests from at least some
// cloud/sandbox IP ranges (confirmed from this repo's own build sandbox — plain fetch, a
// browser-like User-Agent, and a full headless Chromium all got a 401 or an unsolvable JS
// challenge). If this script comes back with 0 matches, that's almost certainly why — try again
// from a normal residential/office network or a CI runner with a less flagged IP, not by
// spoofing headers or fingerprints further.
import { readFileSync, writeFileSync } from 'node:fs'
import { XMLParser } from 'fast-xml-parser'
import { slugify } from './lib/slugify.mjs'

const SEARCH_URL = 'https://boardgamegeek.com/xmlapi2/search'
const THING_URL = 'https://boardgamegeek.com/xmlapi2/thing'
const REQUEST_DELAY_MS = 1200
const THING_BATCH_SIZE = 20

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function toArray(value) {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

/** Fetches with a couple of retries — BGG's API occasionally 202s ("queued") or hiccups under load. */
async function fetchXml(url, attempt = 1) {
  const res = await fetch(url, { headers: { 'User-Agent': 'alea-spielbar-site/1.0 (games catalog build script)' } })
  if (res.status === 202 && attempt <= 5) {
    await sleep(1500)
    return fetchXml(url, attempt + 1)
  }
  if (!res.ok) {
    if (attempt <= 3) {
      await sleep(1500 * attempt)
      return fetchXml(url, attempt + 1)
    }
    throw new Error(`${url} -> HTTP ${res.status}`)
  }
  const text = await res.text()
  return parser.parse(text)
}

function normalize(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

async function searchBgg(name) {
  const url = `${SEARCH_URL}?type=boardgame&query=${encodeURIComponent(name)}`
  const doc = await fetchXml(url)
  const items = toArray(doc?.items?.item)
  if (items.length === 0) return null

  const target = normalize(name)
  const candidates = items.map((item) => {
    const names = toArray(item.name).map((n) => n['@_value'])
    const bestNameMatch = names.some((n) => normalize(n) === target)
    return { id: item['@_id'], year: Number(item.yearpublished?.['@_value'] ?? 0), exact: bestNameMatch, primaryName: names[0] }
  })

  candidates.sort((a, b) => Number(b.exact) - Number(a.exact) || b.year - a.year)
  const best = candidates[0]
  if (!best.exact) return null // avoid confidently attaching a wrong game to an ambiguous title
  return best
}

function stripHtml(html) {
  return html
    .replace(/&#10;/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function fetchThings(ids) {
  const url = `${THING_URL}?stats=1&id=${ids.join(',')}`
  const doc = await fetchXml(url)
  const items = toArray(doc?.items?.item)
  const byId = new Map()
  for (const item of items) {
    const names = toArray(item.name)
    const primary = names.find((n) => n['@_type'] === 'primary') ?? names[0]
    const ratings = item.statistics?.ratings
    byId.set(String(item['@_id']), {
      bggId: String(item['@_id']),
      bggName: primary?.['@_value'] ?? null,
      image: item.image ?? null,
      description: item.description ? stripHtml(String(item.description)).slice(0, 700) : null,
      minPlayers: item.minplayers ? Number(item.minplayers['@_value']) : null,
      maxPlayers: item.maxplayers ? Number(item.maxplayers['@_value']) : null,
      minPlaytime: item.minplaytime ? Number(item.minplaytime['@_value']) : null,
      maxPlaytime: item.maxplaytime ? Number(item.maxplaytime['@_value']) : null,
      complexity: ratings?.averageweight ? Number(ratings.averageweight['@_value']) : null,
      rating: ratings?.average ? Number(ratings.average['@_value']) : null,
      bggUrl: `https://boardgamegeek.com/boardgame/${item['@_id']}`,
    })
  }
  return byId
}

async function main() {
  const source = JSON.parse(readFileSync(new URL('./games-source.json', import.meta.url), 'utf8'))

  const resolved = []
  let matched = 0
  let skipped = 0
  let unmatched = 0

  for (const [index, game] of source.entries()) {
    process.stderr.write(`[${index + 1}/${source.length}] ${game.name} ... `)
    if (game.skip) {
      resolved.push({ ...game, slug: slugify(game.name), bggId: null })
      skipped++
      process.stderr.write('skipped (generic item)\n')
      continue
    }
    try {
      const hit = await searchBgg(game.name)
      if (!hit) {
        resolved.push({ ...game, slug: slugify(game.name), bggId: null })
        unmatched++
        process.stderr.write('no confident match\n')
      } else {
        resolved.push({ ...game, slug: slugify(game.name), bggId: hit.id })
        matched++
        process.stderr.write(`matched BGG #${hit.id} (${hit.primaryName})\n`)
      }
    } catch (err) {
      resolved.push({ ...game, slug: slugify(game.name), bggId: null })
      unmatched++
      process.stderr.write(`error: ${err.message}\n`)
    }
    await sleep(REQUEST_DELAY_MS)
  }

  process.stderr.write(`\nSearch done: ${matched} matched, ${unmatched} unmatched, ${skipped} skipped.\n`)
  process.stderr.write('Fetching game details in batches...\n')

  const idsToFetch = [...new Set(resolved.filter((g) => g.bggId).map((g) => g.bggId))]
  const detailsById = new Map()
  for (let i = 0; i < idsToFetch.length; i += THING_BATCH_SIZE) {
    const batch = idsToFetch.slice(i, i + THING_BATCH_SIZE)
    process.stderr.write(`  batch ${i / THING_BATCH_SIZE + 1}/${Math.ceil(idsToFetch.length / THING_BATCH_SIZE)}...\n`)
    const batchResult = await fetchThings(batch)
    for (const [id, details] of batchResult) detailsById.set(id, details)
    await sleep(REQUEST_DELAY_MS)
  }

  const output = resolved.map((game) => {
    const { skip, bggId, ...rest } = game
    const details = bggId ? detailsById.get(bggId) : null
    return { ...rest, slug: game.slug, ...(details ?? { bggId: null }) }
  })

  writeFileSync(new URL('../src/games-data.json', import.meta.url), JSON.stringify(output, null, 2) + '\n')
  process.stderr.write(`\nWrote src/games-data.json with ${output.length} games (${detailsById.size} enriched with BGG details).\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
