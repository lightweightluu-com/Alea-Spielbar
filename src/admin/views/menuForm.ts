import { icon } from '../../icons'
import { supabase } from '../supabaseClient'
import { slugify } from '../slugify'

/** Matches the `menu_items` table columns in supabase/schema.sql. */
interface MenuFormRow {
  id?: string
  section: string
  category: string
  slug: string
  name: string
  description: string | null
  price: string
  unit: string | null
  featured: boolean
  sort_order: number
}

function field(id: string, label: string, inputHtml: string, hint?: string): string {
  return `
  <div class="flex flex-col gap-2">
    <label for="${id}" class="text-sm font-medium text-paper">${label}</label>
    ${inputHtml}
    ${hint ? `<p class="text-xs text-faint">${hint}</p>` : ''}
  </div>`
}

export function renderMenuForm(mode: 'new' | 'edit'): string {
  const title = mode === 'new' ? 'Eintrag hinzufügen' : 'Eintrag bearbeiten'
  return `
  <a href="#/menu" class="pressable inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-paper">
    ${icon('arrow-left', 'size-4')} Zurück zur Karte
  </a>

  <h1 class="mt-4 font-display text-2xl font-bold text-paper">${title}</h1>

  <form id="menu-form" novalidate class="mt-8 flex max-w-2xl flex-col gap-5">
    <div class="grid grid-cols-2 gap-5">
      ${field(
        'mf-section',
        'Bereich',
        `<input id="mf-section" name="section" type="text" required class="form-input" list="mf-section-options" />
         <datalist id="mf-section-options">
           <option value="Getränke"></option>
           <option value="Cocktails"></option>
           <option value="Spirituosen"></option>
           <option value="Essen"></option>
         </datalist>`,
        'Der Reiter, unter dem der Eintrag erscheint, z. B. „Getränke".',
      )}
      ${field(
        'mf-category',
        'Kategorie',
        `<input id="mf-category" name="category" type="text" required class="form-input" />`,
        'Die Unterüberschrift, z. B. „Wein" oder „Classics".',
      )}
    </div>

    ${field('mf-name', 'Name', `<input id="mf-name" name="name" type="text" required class="form-input" />`)}
    ${field(
      'mf-description',
      'Beschreibung',
      `<textarea id="mf-description" name="description" rows="2" class="form-input resize-none"></textarea>`,
      'Optional — Zutaten, Prozentzahl oder ein Hinweis.',
    )}

    <div class="grid grid-cols-2 gap-5">
      ${field(
        'mf-price',
        'Preis',
        `<input id="mf-price" name="price" type="text" required class="form-input" />`,
        'Freitext, z. B. „16", „5.5 | 8.5" oder „+1".',
      )}
      ${field(
        'mf-unit',
        'Menge',
        `<input id="mf-unit" name="unit" type="text" class="form-input" />`,
        'Optional, z. B. „2 cl" oder „3 | 5 dl".',
      )}
    </div>

    <div class="flex items-center gap-2">
      <input id="mf-featured" name="featured" type="checkbox" class="size-4 rounded border-hairline" />
      <label for="mf-featured" class="text-sm font-medium text-paper">Als Favorit hervorheben</label>
    </div>

    ${field(
      'mf-sort-order',
      'Reihenfolge',
      `<input id="mf-sort-order" name="sortOrder" type="number" class="form-input" />`,
      'Kleinere Zahl erscheint zuerst innerhalb der Kategorie.',
    )}

    <div class="mt-2 flex items-center gap-4">
      <button
        type="submit"
        class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3 font-semibold text-on-accent hover:bg-brand-rich"
      >
        Speichern
      </button>
      <p id="menu-form-status" role="status" aria-live="polite" class="text-sm text-muted"></p>
    </div>
  </form>`
}

function setValue(form: HTMLFormElement, name: string, value: string | number | null | undefined): void {
  const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null
  if (input) input.value = value == null ? '' : String(value)
}

async function loadExisting(form: HTMLFormElement, id: string): Promise<{ error: string | null }> {
  const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).single()
  if (error || !data) return { error: error?.message ?? 'Eintrag nicht gefunden.' }

  const row = data as MenuFormRow
  setValue(form, 'section', row.section)
  setValue(form, 'category', row.category)
  setValue(form, 'name', row.name)
  setValue(form, 'description', row.description)
  setValue(form, 'price', row.price)
  setValue(form, 'unit', row.unit)
  setValue(form, 'sortOrder', row.sort_order)
  const featuredInput = form.elements.namedItem('featured') as HTMLInputElement | null
  if (featuredInput) featuredInput.checked = row.featured

  return { error: null }
}

function parseNumber(value: string): number | null {
  if (!value.trim()) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function setupMenuForm(mode: 'new' | 'edit', menuItemId: string | null): void {
  const form = document.querySelector<HTMLFormElement>('#menu-form')
  const status = document.querySelector<HTMLParagraphElement>('#menu-form-status')
  if (!form || !status) return

  if (mode === 'edit' && menuItemId) {
    loadExisting(form, menuItemId).then((result) => {
      if (result.error) status.textContent = `Fehler: ${result.error}`
    })
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    status.textContent = 'Wird gespeichert …'

    const data = new FormData(form)
    const section = String(data.get('section') ?? '').trim()
    const category = String(data.get('category') ?? '').trim()
    const name = String(data.get('name') ?? '').trim()
    const price = String(data.get('price') ?? '').trim()

    if (!section || !category || !name || !price) {
      status.textContent = 'Bitte füllt Bereich, Kategorie, Name und Preis aus.'
      return
    }

    const base = {
      section,
      category,
      name,
      description: String(data.get('description') ?? '').trim() || null,
      price,
      unit: String(data.get('unit') ?? '').trim() || null,
      featured: (form.elements.namedItem('featured') as HTMLInputElement | null)?.checked ?? false,
      sort_order: parseNumber(String(data.get('sortOrder') ?? '')) ?? 0,
    }

    // Slug is only generated for new entries — editing keeps the existing one untouched.
    const { error } =
      mode === 'edit' && menuItemId
        ? await supabase.from('menu_items').update(base).eq('id', menuItemId)
        : await supabase
            .from('menu_items')
            .insert({ ...base, slug: slugify(`${section}-${category}-${name}-${Date.now()}`) })

    if (error) {
      status.textContent = `Fehler beim Speichern: ${error.message}`
      return
    }

    window.location.hash = '#/menu'
  })
}
