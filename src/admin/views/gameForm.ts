import { icon } from '../../icons'
import { supabase } from '../supabaseClient'
import { slugify } from '../slugify'

/** Matches the `games` table columns in supabase/schema.sql (snake_case Postgres row shape). */
interface GameFormRow {
  id?: string
  name: string
  language: string | null
  expansions: string[] | null
  slug: string
  bgg_id: string | null
  bgg_name: string | null
  image: string | null
  description: string | null
  min_players: number | null
  max_players: number | null
  min_playtime: number | null
  max_playtime: number | null
  complexity: number | null
  rating: number | null
  bgg_url: string | null
  wikipedia_url: string | null
}

function field(id: string, label: string, inputHtml: string, hint?: string): string {
  return `
  <div class="flex flex-col gap-2">
    <label for="${id}" class="text-sm font-medium text-paper">${label}</label>
    ${inputHtml}
    ${hint ? `<p class="text-xs text-faint">${hint}</p>` : ''}
  </div>`
}

export function renderGameForm(mode: 'new' | 'edit'): string {
  const title = mode === 'new' ? 'Spiel hinzufügen' : 'Spiel bearbeiten'
  return `
  <a href="#/games" class="pressable inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-paper">
    ${icon('arrow-left', 'size-4')} Zurück zur Liste
  </a>

  <h1 class="mt-4 font-display text-2xl font-bold text-paper">${title}</h1>

  <form id="game-form" novalidate class="mt-8 flex max-w-2xl flex-col gap-5">
    ${field('gf-name', 'Name', `<input id="gf-name" name="name" type="text" required class="form-input" />`)}
    ${field('gf-language', 'Sprache', `<input id="gf-language" name="language" type="text" class="form-input" placeholder="z. B. Deutsch" />`)}
    ${field(
      'gf-expansions',
      'Erweiterungen',
      `<input id="gf-expansions" name="expansions" type="text" class="form-input" />`,
      'Kommagetrennt, z. B. „Goldrausch, Winterlandschaft"',
    )}

    ${field(
      'gf-image-file',
      'Coverbild',
      `<input id="gf-image-file" name="imageFile" type="file" accept="image/*" class="form-input" />
       <div id="gf-image-preview" class="mt-1"></div>`,
      'Optional — lasst das Feld leer, um das bestehende Bild zu behalten.',
    )}

    ${field(
      'gf-description',
      'Beschreibung',
      `<textarea id="gf-description" name="description" rows="4" class="form-input resize-none"></textarea>`,
    )}

    <div class="grid grid-cols-2 gap-5">
      ${field('gf-min-players', 'Min. Spieler', `<input id="gf-min-players" name="minPlayers" type="number" min="1" class="form-input" />`)}
      ${field('gf-max-players', 'Max. Spieler', `<input id="gf-max-players" name="maxPlayers" type="number" min="1" class="form-input" />`)}
      ${field('gf-min-playtime', 'Min. Spielzeit (Min.)', `<input id="gf-min-playtime" name="minPlaytime" type="number" min="1" class="form-input" />`)}
      ${field('gf-max-playtime', 'Max. Spielzeit (Min.)', `<input id="gf-max-playtime" name="maxPlaytime" type="number" min="1" class="form-input" />`)}
      ${field(
        'gf-complexity',
        'Schwierigkeitsgrad (1–5)',
        `<input id="gf-complexity" name="complexity" type="number" min="1" max="5" step="0.1" class="form-input" />`,
      )}
      ${field('gf-rating', 'Bewertung (0–10)', `<input id="gf-rating" name="rating" type="number" min="0" max="10" step="0.1" class="form-input" />`)}
    </div>

    ${field('gf-bgg-url', 'BoardGameGeek-Link', `<input id="gf-bgg-url" name="bggUrl" type="url" class="form-input" />`)}
    ${field('gf-wikipedia-url', 'Wikipedia-Link', `<input id="gf-wikipedia-url" name="wikipediaUrl" type="url" class="form-input" />`)}

    <div class="mt-2 flex items-center gap-4">
      <button
        type="submit"
        class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3 font-semibold text-on-accent hover:bg-brand-rich"
      >
        Speichern
      </button>
      <p id="game-form-status" role="status" aria-live="polite" class="text-sm text-muted"></p>
    </div>
  </form>`
}

function setValue(form: HTMLFormElement, name: string, value: string | number | null | undefined): void {
  const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null
  if (input) input.value = value == null ? '' : String(value)
}

async function loadExisting(form: HTMLFormElement, id: string): Promise<{ error: string | null; image: string | null }> {
  const { data, error } = await supabase.from('games').select('*').eq('id', id).single()
  if (error || !data) return { error: error?.message ?? 'Spiel nicht gefunden.', image: null }

  const row = data as GameFormRow
  setValue(form, 'name', row.name)
  setValue(form, 'language', row.language)
  setValue(form, 'expansions', (row.expansions ?? []).join(', '))
  setValue(form, 'description', row.description)
  setValue(form, 'minPlayers', row.min_players)
  setValue(form, 'maxPlayers', row.max_players)
  setValue(form, 'minPlaytime', row.min_playtime)
  setValue(form, 'maxPlaytime', row.max_playtime)
  setValue(form, 'complexity', row.complexity)
  setValue(form, 'rating', row.rating)
  setValue(form, 'bggUrl', row.bgg_url)
  setValue(form, 'wikipediaUrl', row.wikipedia_url)

  if (row.image) {
    const preview = document.querySelector<HTMLDivElement>('#gf-image-preview')
    if (preview) preview.innerHTML = `<img src="${row.image}" alt="" class="h-24 rounded-card-sm object-cover" />`
  }

  return { error: null, image: row.image }
}

async function uploadCoverImage(file: File, slug: string): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${slug}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('game-covers').upload(path, file, { upsert: false })
  if (error) return { url: null, error: error.message }
  const { data } = supabase.storage.from('game-covers').getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

function parseNumber(value: string): number | null {
  if (!value.trim()) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function setupGameForm(mode: 'new' | 'edit', gameId: string | null): void {
  const form = document.querySelector<HTMLFormElement>('#game-form')
  const status = document.querySelector<HTMLParagraphElement>('#game-form-status')
  if (!form || !status) return

  let existingImage: string | null = null

  if (mode === 'edit' && gameId) {
    loadExisting(form, gameId).then((result) => {
      if (result.error) status.textContent = `Fehler: ${result.error}`
      existingImage = result.image
    })
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    status.textContent = 'Wird gespeichert …'

    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    if (!name) {
      status.textContent = 'Bitte gebt einen Namen ein.'
      return
    }
    const slug = slugify(name)

    const imageFile = data.get('imageFile') as File | null
    let image = existingImage
    if (imageFile && imageFile.size > 0) {
      const { url, error: uploadError } = await uploadCoverImage(imageFile, slug)
      if (uploadError) {
        status.textContent = `Bild-Upload fehlgeschlagen: ${uploadError}`
        return
      }
      image = url
    }

    const expansionsRaw = String(data.get('expansions') ?? '').trim()
    const expansions = expansionsRaw ? expansionsRaw.split(',').map((s) => s.trim()).filter(Boolean) : null

    const row: GameFormRow = {
      name,
      slug,
      language: String(data.get('language') ?? '').trim() || null,
      expansions,
      bgg_id: null,
      bgg_name: null,
      image,
      description: String(data.get('description') ?? '').trim() || null,
      min_players: parseNumber(String(data.get('minPlayers') ?? '')),
      max_players: parseNumber(String(data.get('maxPlayers') ?? '')),
      min_playtime: parseNumber(String(data.get('minPlaytime') ?? '')),
      max_playtime: parseNumber(String(data.get('maxPlaytime') ?? '')),
      complexity: parseNumber(String(data.get('complexity') ?? '')),
      rating: parseNumber(String(data.get('rating') ?? '')),
      bgg_url: String(data.get('bggUrl') ?? '').trim() || null,
      wikipedia_url: String(data.get('wikipediaUrl') ?? '').trim() || null,
    }

    const { error } =
      mode === 'edit' && gameId
        ? await supabase.from('games').update(row).eq('id', gameId)
        : await supabase.from('games').insert(row)

    if (error) {
      status.textContent = `Fehler beim Speichern: ${error.message}`
      return
    }

    window.location.hash = '#/games'
  })
}
