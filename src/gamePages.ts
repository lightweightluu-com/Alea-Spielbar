import { icon } from './icons'
import { findGameBySlug, games, playerRangeLabel, playtimeLabel, searchGames, type Game } from './games'

function languageBadge(language: string | null): string {
  if (!language) return ''
  return `<span class="rounded-pill border border-hairline px-3 py-1 text-xs font-medium text-muted">${language}</span>`
}

function gameCardImage(game: Game): string {
  if (game.image) {
    return `<img src="${game.image}" alt="Cover von ${game.name}" loading="lazy" class="aspect-square w-full rounded-card-sm object-cover" />`
  }
  return `
    <div class="flex aspect-square w-full items-center justify-center rounded-card-sm bg-surface-2 text-faint">
      ${icon('image', 'size-8')}
    </div>`
}

function gameCard(game: Game): string {
  const stats = [playerRangeLabel(game), playtimeLabel(game)].filter(Boolean).join(' · ')
  return `
  <a
    href="#/spiele-liste/${game.slug}"
    data-game-card
    class="pressable group flex flex-col gap-3 rounded-card border border-hairline bg-surface p-4 transition-colors hover:border-paper/30"
  >
    ${gameCardImage(game)}
    <div>
      <p class="font-display font-semibold leading-snug text-paper">${game.name}</p>
      <p class="mt-1 text-xs text-muted">${stats || (game.language ?? ' ')}</p>
    </div>
  </a>`
}

function backToSiteLink(): string {
  return `
  <a href="#home" class="pressable inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-paper">
    ${icon('arrow-left', 'size-4')} Zurück zur Startseite
  </a>`
}

export function renderGamesGrid(query: string): string {
  const results = searchGames(query)
  const cards = results.map(gameCard).join('')
  if (results.length) return cards
  return `<p class="col-span-full py-16 text-center text-muted">Kein Spiel gefunden für „${query}". Versucht einen anderen Suchbegriff.</p>`
}

export function renderGamesListPage(query = ''): string {
  return `
  <div class="mx-auto max-w-7xl px-6 pb-24 pt-28 md:pt-32">
    ${backToSiteLink()}

    <div class="mt-8 max-w-[60ch]">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-tan-text">Spielregal</p>
      <h1 class="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Alle Spiele
      </h1>
      <p class="mt-4 leading-relaxed text-muted">
        ${games.length} Spiele stehen bei uns im Regal. Sucht nach einem Titel oder stöbert einfach durch.
      </p>
    </div>

    <div class="mt-8 max-w-md">
      <label for="games-search" class="sr-only">Spiele durchsuchen</label>
      <div class="relative">
        <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
          ${icon('magnifying-glass', 'size-4')}
        </span>
        <input
          id="games-search"
          type="search"
          placeholder="Spiel suchen …"
          value="${query.replace(/"/g, '&quot;')}"
          class="form-input pl-11"
          autocomplete="off"
        />
      </div>
    </div>

    <div id="games-grid" class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      ${renderGamesGrid(query)}
    </div>
  </div>`
}

function statTile(iconName: Parameters<typeof icon>[0], label: string, value: string): string {
  return `
  <div class="flex items-center gap-3">
    <span class="flex size-10 shrink-0 items-center justify-center rounded-card-sm bg-surface-2 text-muted">
      ${icon(iconName, 'size-5')}
    </span>
    <div>
      <p class="text-xs text-muted">${label}</p>
      <p class="font-semibold text-paper">${value}</p>
    </div>
  </div>`
}

function meterBar(label: string, ratio: number): string {
  const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)))
  return `
  <div class="flex items-center justify-between gap-4 text-sm">
    <span class="text-paper">${label}</span>
    <span class="h-2 w-32 overflow-hidden rounded-pill bg-surface-2 sm:w-40">
      <span class="block h-full rounded-pill bg-brand" style="width: ${pct}%"></span>
    </span>
  </div>`
}

export function renderGameDetailPage(slug: string): string {
  const game = findGameBySlug(slug)

  if (!game) {
    return `
    <div class="mx-auto max-w-3xl px-6 pb-24 pt-28 text-center md:pt-32">
      ${backToSiteLink()}
      <h1 class="mt-8 font-display text-2xl font-bold text-paper">Spiel nicht gefunden</h1>
      <p class="mt-3 text-muted">Dieses Spiel kennen wir nicht — vielleicht ist es aus der Liste verschwunden.</p>
      <a href="#/spiele-liste" class="pressable mt-6 inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 font-semibold text-on-accent hover:bg-brand-rich">
        Zur Spieleliste
      </a>
    </div>`
  }

  const players = playerRangeLabel(game)
  const playtime = playtimeLabel(game)
  const hasStats = game.complexity != null || game.rating != null
  const searchFallbackHref = `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${encodeURIComponent(game.name)}`

  return `
  <div class="mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-32">
    <a href="#/spiele-liste" class="pressable inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-paper">
      ${icon('arrow-left', 'size-4')} Zurück zur Spieleliste
    </a>

    <div class="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
      <div class="md:col-span-5 lg:col-span-4">
        ${
          game.image
            ? `<img src="${game.image}" alt="Cover von ${game.name}" class="w-full rounded-card border border-hairline object-cover" />`
            : `<div class="flex aspect-[3/4] w-full items-center justify-center rounded-card border border-hairline bg-surface-2 text-faint">
                 ${icon('image', 'size-12')}
               </div>`
        }
      </div>

      <div class="md:col-span-7 lg:col-span-8">
        <h1 class="text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
          ${game.bggName ?? game.name}
        </h1>
        <div class="mt-3 flex flex-wrap gap-2">
          ${languageBadge(game.language)}
          ${(game.expansions ?? []).map((e) => `<span class="rounded-pill bg-brand/12 px-3 py-1 text-xs font-medium text-brand-text">+ ${e}</span>`).join('')}
        </div>

        ${
          game.description
            ? `<p class="mt-5 max-w-[65ch] leading-relaxed text-muted">${game.description}</p>`
            : `<p class="mt-5 max-w-[65ch] leading-relaxed text-muted">
                 Zu diesem Spiel haben wir noch keine Detailbeschreibung hinterlegt. Es steht aber bei uns im Regal —
                 fragt einfach unser Team oder schaut selbst vorbei.
               </p>`
        }

        <div class="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
          ${players ? statTile('users-three', 'Spieler', players) : ''}
          ${playtime ? statTile('clock', 'Dauer', playtime) : ''}
        </div>

        ${
          hasStats
            ? `
        <div class="mt-8 flex flex-col gap-3 border-t border-hairline pt-6">
          ${game.complexity != null ? meterBar('Komplexität', game.complexity / 5) : ''}
          ${game.rating != null ? meterBar('BGG-Wertung', game.rating / 10) : ''}
        </div>`
            : ''
        }

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="${game.bggUrl ?? searchFallbackHref}"
            target="_blank"
            rel="noopener noreferrer"
            class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-6 py-3.5 font-semibold text-paper hover:border-paper/30 hover:bg-surface-2"
          >
            ${icon('arrow-square-out', 'size-4')}
            ${game.bggUrl ? 'Auf BoardGameGeek ansehen' : 'Auf BoardGameGeek suchen'}
          </a>
          ${
            game.wikipediaUrl
              ? `<a
                  href="${game.wikipediaUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-6 py-3.5 font-semibold text-paper hover:border-paper/30 hover:bg-surface-2"
                >
                  ${icon('arrow-square-out', 'size-4')}
                  Auf Wikipedia ansehen
                </a>`
              : ''
          }
        </div>
      </div>
    </div>
  </div>`
}
