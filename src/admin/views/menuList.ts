import { icon } from '../../icons'
import { supabase } from '../supabaseClient'

interface MenuItemRow {
  id: string
  section: string
  category: string
  name: string
  description: string | null
  price: string
  unit: string | null
  featured: boolean
  sort_order: number
}

function menuItemRowHtml(item: MenuItemRow): string {
  return `
  <div class="flex items-center gap-4 border-b border-hairline py-3 last:border-0" data-menu-item-row="${item.id}">
    <div class="min-w-0 flex-1">
      <p class="truncate font-medium text-paper">
        ${item.name}
        ${item.featured ? '<span class="ml-2 rounded-pill bg-brand/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-text">Favorit</span>' : ''}
      </p>
      <p class="truncate text-xs text-muted">${item.price}${item.unit ? ` · ${item.unit}` : ''}${item.description ? ` · ${item.description}` : ''}</p>
    </div>
    <a
      href="#/menu/${item.id}/edit"
      class="pressable inline-flex items-center gap-1.5 rounded-pill border border-hairline px-3 py-1.5 text-xs font-medium text-paper hover:bg-surface-2"
    >
      ${icon('pencil-simple', 'size-3.5')} Bearbeiten
    </a>
    <button
      type="button"
      data-delete-menu-item="${item.id}"
      class="pressable inline-flex items-center gap-1.5 rounded-pill border border-hairline px-3 py-1.5 text-xs font-medium text-brand-text hover:bg-surface-2"
    >
      ${icon('trash', 'size-3.5')} Löschen
    </button>
  </div>`
}

function groupBySectionAndCategory(items: MenuItemRow[]): Map<string, Map<string, MenuItemRow[]>> {
  const sections = new Map<string, Map<string, MenuItemRow[]>>()
  for (const item of items) {
    if (!sections.has(item.section)) sections.set(item.section, new Map())
    const categories = sections.get(item.section)!
    if (!categories.has(item.category)) categories.set(item.category, [])
    categories.get(item.category)!.push(item)
  }
  return sections
}

export function renderMenuList(): string {
  return `
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <h1 class="font-display text-2xl font-bold text-paper">Speise- &amp; Getränkekarte</h1>
      <p class="mt-1 text-sm text-muted">Alle Einträge der öffentlichen Karte — hinzufügen, bearbeiten oder entfernen.</p>
    </div>
    <a
      href="#/menu/new"
      class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-5 py-2.5 font-semibold text-on-accent hover:bg-brand-rich"
    >
      ${icon('plus', 'size-4')} Eintrag hinzufügen
    </a>
  </div>

  <div id="menu-list-status" class="mt-6 text-sm text-muted">Lädt …</div>
  <div id="menu-list-body" class="mt-2 flex flex-col gap-8"></div>`
}

export async function setupMenuList(): Promise<void> {
  const status = document.querySelector<HTMLDivElement>('#menu-list-status')
  const body = document.querySelector<HTMLDivElement>('#menu-list-body')
  if (!status || !body) return

  const { data, error } = await supabase
    .from('menu_items')
    .select('id, section, category, name, description, price, unit, featured, sort_order')
    .order('sort_order')

  if (error) {
    status.textContent = `Fehler beim Laden: ${error.message}`
    return
  }

  const items = (data ?? []) as MenuItemRow[]
  status.textContent = items.length ? `${items.length} Einträge` : ''

  if (!items.length) {
    body.innerHTML = '<p class="py-10 text-center text-muted">Noch keine Einträge — legt oben den ersten an.</p>'
    return
  }

  const sections = groupBySectionAndCategory(items)
  body.innerHTML = [...sections.entries()]
    .map(
      ([section, categories]) => `
    <div>
      <h2 class="font-display text-xl font-bold text-paper">${section}</h2>
      <div class="mt-3 flex flex-col gap-6">
        ${[...categories.entries()]
          .map(
            ([category, categoryItems]) => `
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-[0.18em] text-tan-text">${category}</h3>
            <div class="mt-2 rounded-card border border-hairline bg-surface px-5">
              ${categoryItems.map(menuItemRowHtml).join('')}
            </div>
          </div>`,
          )
          .join('')}
      </div>
    </div>`,
    )
    .join('')

  body.querySelectorAll<HTMLButtonElement>('[data-delete-menu-item]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.deleteMenuItem
      if (!id) return
      const row = body.querySelector<HTMLElement>(`[data-menu-item-row="${id}"]`)
      const name = row?.querySelector('p')?.textContent?.trim() ?? 'diesen Eintrag'
      if (!window.confirm(`„${name}" wirklich löschen?`)) return

      const { error: deleteError } = await supabase.from('menu_items').delete().eq('id', id)
      if (deleteError) {
        window.alert(`Löschen fehlgeschlagen: ${deleteError.message}`)
        return
      }
      row?.remove()
    })
  })
}
