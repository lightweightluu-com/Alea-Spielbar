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
  wikipediaUrl?: string | null
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

export type Difficulty = 'einsteiger' | 'mittel' | 'erfahren'

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  einsteiger: 'Einsteiger',
  mittel: 'Mittel',
  erfahren: 'Erfahren',
}

export function difficultyOf(game: Game): Difficulty | null {
  if (game.complexity == null) return null
  if (game.complexity <= 2) return 'einsteiger'
  if (game.complexity <= 3) return 'mittel'
  return 'erfahren'
}

export interface GameFilters {
  query?: string
  players?: number | null
  difficulty?: Difficulty | null
}

export function filterGames({ query = '', players = null, difficulty = null }: GameFilters): Game[] {
  const q = query.trim().toLowerCase()
  return games.filter((game) => {
    if (q && !game.name.toLowerCase().includes(q)) return false
    if (players != null) {
      if (game.minPlayers == null || game.maxPlayers == null) return false
      if (players < game.minPlayers || players > game.maxPlayers) return false
    }
    if (difficulty && difficultyOf(game) !== difficulty) return false
    return true
  })
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
