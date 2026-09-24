import { icon } from '../icons'
import { signOut } from './auth'

export type AdminTab = 'games' | 'menu' | 'reservations'

function navLink(href: string, label: string, active: boolean): string {
  const activeClasses = active ? 'bg-surface-2 text-paper' : 'text-muted hover:bg-surface-2 hover:text-paper'
  return `<a href="${href}" class="pressable rounded-pill px-4 py-2 text-sm font-medium ${activeClasses}">${label}</a>`
}

export function renderShell(active: AdminTab, content: string): string {
  return `
  <div class="min-h-screen">
    <header class="border-b border-hairline">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-tan-text">Alea Spielbar</p>
          <p class="font-display text-lg font-bold text-paper">Admin</p>
        </div>
        <nav class="flex flex-wrap items-center gap-2">
          ${navLink('#/games', 'Spiele', active === 'games')}
          ${navLink('#/menu', 'Speisekarte', active === 'menu')}
          ${navLink('#/reservations', 'Reservierungen', active === 'reservations')}
          <button
            id="admin-sign-out"
            type="button"
            class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-4 py-2 text-sm font-medium text-paper hover:bg-surface-2"
          >
            ${icon('sign-out', 'size-4')} Abmelden
          </button>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-6 py-10">${content}</main>
  </div>`
}

export function setupShell(): void {
  document.querySelector<HTMLButtonElement>('#admin-sign-out')?.addEventListener('click', async () => {
    await signOut()
    window.location.hash = '#/login'
  })
}
