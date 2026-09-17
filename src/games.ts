import gamesData from './games-data.json'

export interface Game {
  name: string
  language: string | null
  expansions?: string[]
  slug: string
  bggId: string | null
  bggName?: string | null
  image?: string | null
  description?: string | null
  minPlayers?: number | null
  maxPlayers?: number | null
  minPlaytime?: number | null
  maxPlaytime?: number | null
  complexity?: number | null
  rating?: number | null
  bggUrl?: string | null
}

export const games: Game[] = gamesData as Game[]

export function findGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug)
}

export function searchGames(query: string): Game[] {
  const q = query.trim().toLowerCase()
  if (!q) return games
  return games.filter((game) => game.name.toLowerCase().includes(q))
}

export function playerRangeLabel(game: Game): string | null {
  if (!game.minPlayers && !game.maxPlayers) return null
  if (game.minPlayers && game.maxPlayers && game.minPlayers !== game.maxPlayers) {
    return `${game.minPlayers}–${game.maxPlayers}`
  }
  return String(game.minPlayers ?? game.maxPlayers)
}

export function playtimeLabel(game: Game): string | null {
  if (!game.minPlaytime && !game.maxPlaytime) return null
  if (game.minPlaytime && game.maxPlaytime && game.minPlaytime !== game.maxPlaytime) {
    return `${game.minPlaytime}–${game.maxPlaytime} Min.`
  }
  return `${game.minPlaytime ?? game.maxPlaytime} Min.`
}
