import { icon } from '../../icons'
import { supabase } from '../supabaseClient'

interface GameRow {
  id: string
  name: string
  slug: string
  image: string | null
  language: string | null
}

function gameRowHtml(game: GameRow): string {
  const thumb = game.image
    ? `<img src="${game.image}" alt="" class="size-12 shrink-0 rounded-card-sm object-cover" />`
    : `<div class="flex size-12 shrink-0 items-center justify-center rounded-card-sm bg-surface-2 text-faint">${icon('image', 'size-5')}</div>`

  return `
  <div class="flex items-center gap-4 border-b border-hairline py-3 last:border-0" data-game-row="${game.id}">
    ${thumb}
    <div class="min-w-0 flex-1">
      <p class="truncate font-medium text-paper">${game.name}</p>
      <p class="truncate text-xs text-muted">${game.slug}${game.language ? ` · ${game.language}` : ''}</p>
    </div>
    <a
      href="#/games/${game.id}/edit"
      class="pressable inline-flex items-center gap-1.5 rounded-pill border border-hairline px-3 py-1.5 text-xs font-medium text-paper hover:bg-surface-2"
    >
      ${icon('pencil-simple', 'size-3.5')} Bearbeiten
    </a>
    <button
      type="button"
      data-delete-game="${game.id}"
      class="pressable inline-flex items-center gap-1.5 rounded-pill border border-hairline px-3 py-1.5 text-xs font-medium text-brand-text hover:bg-surface-2"
    >
      ${icon('trash', 'size-3.5')} Löschen
    </button>
  </div>`
}

export function renderGamesList(): string {
  return `
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <h1 class="font-display text-2xl font-bold text-paper">Spiele</h1>
      <p class="mt-1 text-sm text-muted">Alle Spiele im Regal — hinzufügen, bearbeiten oder entfernen.</p>
    </div>
    <a
      href="#/games/new"
      class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-5 py-2.5 font-semibold text-on-accent hover:bg-brand-rich"
    >
      ${icon('plus', 'size-4')} Spiel hinzufügen
    </a>
  </div>

  <div id="games-list-status" class="mt-6 text-sm text-muted">Lädt …</div>
  <div id="games-list-body" class="mt-2"></div>`
}

export async function setupGamesList(): Promise<void> {
  const status = document.querySelector<HTMLDivElement>('#games-list-status')
  const body = document.querySelector<HTMLDivElement>('#games-list-body')
  if (!status || !body) return

  const { data, error } = await supabase
    .from('games')
    .select('id, name, slug, image, language')
    .order('name')

  if (error) {
    status.textContent = `Fehler beim Laden: ${error.message}`
    return
  }

  const games = (data ?? []) as GameRow[]
  status.textContent = games.length ? `${games.length} Spiele` : ''
  body.innerHTML = games.length
    ? games.map(gameRowHtml).join('')
    : '<p class="py-10 text-center text-muted">Noch keine Spiele — legt oben das erste an.</p>'

  body.querySelectorAll<HTMLButtonElement>('[data-delete-game]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.deleteGame
      if (!id) return
      const row = body.querySelector<HTMLElement>(`[data-game-row="${id}"]`)
      const name = row?.querySelector('p')?.textContent ?? 'dieses Spiel'
      if (!window.confirm(`„${name}" wirklich löschen?`)) return

      const { error: deleteError } = await supabase.from('games').delete().eq('id', id)
      if (deleteError) {
        window.alert(`Löschen fehlgeschlagen: ${deleteError.message}`)
        return
      }
      row?.remove()
    })
  })
}
