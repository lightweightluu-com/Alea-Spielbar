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
import { slugify } from './lib/slugify.mjs'

const SUMMARY_URL = (lang, title) => `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
const REQUEST_DELAY_MS = 300
const USER_AGENT = 'alea-spielbar-site/1.0 (games catalog build script; contact: lucienryter@gmail.com)'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

function quantityValue(claim) {
  const amount = claim?.[0]?.mainsnak?.datavalue?.value?.amount
  return amount ? Math.round(Number(amount)) : null
}

// Pulls the handful of structured facts Wikidata reliably carries for board games even when the
// Wikipedia article's infobox has no usable image: a free (non-fair-use) photo (P18) and the
// min/max player counts (P1872/P1873). BGG's own weight/complexity rating has no Wikidata
// equivalent, so that field stays null here.
async function wikidataFacts(wikibaseId) {
  if (!wikibaseId) return {}
  const doc = await wikidataGet(WIKIDATA_ENTITY_URL(wikibaseId))
  await sleep(REQUEST_DELAY_MS)
  const claims = doc.entities[wikibaseId]?.claims ?? {}
  const imageFile = claims.P18?.[0]?.mainsnak?.datavalue?.value
  return {
    image: imageFile ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFile)}` : null,
    minPlayers: quantityValue(claims.P1872),
    maxPlayers: quantityValue(claims.P1873),
  }
}

async function trySummary(title, lang) {
  const summary = await fetchSummary(lang, title)
  await sleep(REQUEST_DELAY_MS)
  if (!summary) return null
  if (summary.type === 'disambiguation') return null
  let image = summary.originalimage?.source ?? summary.thumbnail?.source ?? null
  const description = summary.extract ? summary.extract.slice(0, 700).trim() : null
  if (!image && !description) return null
  // Some board-game articles have no lead image (non-free box art doesn't clear Wikipedia's
  // fair-use bar for an infobox), but their Wikidata item still carries a free gameplay photo
  // and structured player-count facts the article prose doesn't expose.
  const facts = await wikidataFacts(summary.wikibase_item)
  return {
    image: image ?? facts.image ?? null,
    description,
    wikipediaUrl: summary.content_urls?.desktop?.page ?? null,
    minPlayers: facts.minPlayers ?? null,
    maxPlayers: facts.maxPlayers ?? null,
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

const WIKIDATA_SEARCH_URL = (q, lang = 'en') =>
  `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=${lang}&format=json&limit=5&type=item`
const WIKIDATA_ENTITY_URL = (id) => `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`
const GAME_DESCRIPTION_RE = /\b(board|card|dice|tile|party|strategy|cooperative|deck-building|role-playing|tabletop)\b.*\bgame\b/i

async function wikidataGet(url, attempt = 1) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } })
  if (res.status === 429 && attempt <= 4) {
    await sleep(2000 * attempt)
    return wikidataGet(url, attempt + 1)
  }
  if (!res.ok) {
    if (attempt <= 3) {
      await sleep(1000 * attempt)
      return wikidataGet(url, attempt + 1)
    }
    throw new Error(`${url} -> HTTP ${res.status}`)
  }
  return res.json()
}

// Last-resort fallback: Wikidata's fuzzy label search often finds an item for a game with no
// (findable) Wikipedia article at all. If the item links to a Wikipedia page, use that page's
// summary as usual; otherwise fall back to the item's own short description and cover image
// (P18), which many board-game items carry even without a full article.
const GAME_DESCRIPTION_RE_DE = /\b(brett|karten|würfel|kartenspiel|brettspiel|würfelspiel|gesellschaftsspiel|partyspiel)/i

async function resolveViaWikidata(name) {
  const [enQuery, deQuery] = await Promise.all([wikidataGet(WIKIDATA_SEARCH_URL(name, 'en')), wikidataGet(WIKIDATA_SEARCH_URL(name, 'de'))])
  await sleep(REQUEST_DELAY_MS)
  const enCandidates = (enQuery.search ?? []).filter(
    (c) => c.description && GAME_DESCRIPTION_RE.test(c.description) && !/video game/i.test(c.description),
  )
  const deCandidates = (deQuery.search ?? []).filter((c) => c.description && GAME_DESCRIPTION_RE_DE.test(c.description))
  const seen = new Set()
  const candidates = [...enCandidates, ...deCandidates].filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)))

  for (const candidate of candidates) {
    const entityDoc = await wikidataGet(WIKIDATA_ENTITY_URL(candidate.id))
    await sleep(REQUEST_DELAY_MS)
    const entity = entityDoc.entities[candidate.id]
    const sitelinks = entity.sitelinks ?? {}

    const wikiSite = sitelinks.enwiki ? 'en' : sitelinks.dewiki ? 'de' : null
    if (wikiSite) {
      const title = sitelinks[`${wikiSite}wiki`].title
      const hit = await trySummary(title, wikiSite)
      if (hit) return hit
    }

    const imageFile = entity.claims?.P18?.[0]?.mainsnak?.datavalue?.value
    const image = imageFile ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFile)}` : null
    const isGerman = GAME_DESCRIPTION_RE_DE.test(candidate.description)
    const description = isGerman ? `${candidate.label} ist ${candidate.description.startsWith('ein') ? '' : 'ein '}${candidate.description}.` : `${candidate.label} is a ${candidate.description}.`
    if (image || description) {
      return {
        image,
        description,
        wikipediaUrl: `https://www.wikidata.org/wiki/${candidate.id}`,
        minPlayers: quantityValue(entity.claims?.P1872),
        maxPlayers: quantityValue(entity.claims?.P1873),
      }
    }
  }
  return null
}

// Tries the English article first (usually the richer, more complete summary), then falls back
// to the German Wikipedia — many titles in this shelf are German editions with no English article
// — and finally to a Wikidata item lookup for games with no Wikipedia coverage at all.
async function resolveGame(name) {
  const override = NAME_OVERRIDES[name]
  if (override) {
    const hit = (await trySummary(override, 'en')) ?? (await trySummary(override, 'de'))
    if (hit) return hit
  }
  const wiki = (await resolveInLang(name, 'en', 'board game')) ?? (await resolveInLang(name, 'de', 'Spiel'))
  if (wiki) return wiki
  return resolveViaWikidata(name.split(':')[0].trim())
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
