// Merges the hand-curated complexity ratings in complexity-overrides.json into games-data.json.
// Only fills in games that don't already have a complexity value (e.g. from a future BGG run) —
// never overwrites real API data. Re-run after fetch-wikipedia-data.mjs or fetch-bgg-data.mjs.
import { readFileSync, writeFileSync } from 'node:fs'

const overrides = JSON.parse(readFileSync(new URL('./complexity-overrides.json', import.meta.url), 'utf8'))
delete overrides._comment

const gamesPath = new URL('../src/games-data.json', import.meta.url)
const games = JSON.parse(readFileSync(gamesPath, 'utf8'))

let applied = 0
const updated = games.map((game) => {
  if (game.complexity != null) return game
  const complexity = overrides[game.name]
  if (complexity == null) return game
  applied++
  return { ...game, complexity }
})

writeFileSync(gamesPath, JSON.stringify(updated, null, 2) + '\n')
console.log(`Applied manual complexity rating to ${applied} games.`)
