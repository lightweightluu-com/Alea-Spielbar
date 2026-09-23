import './style.css'
import { getSession, onAuthStateChange, requireAuth } from './auth'
import { renderShell, setupShell } from './shell'
import { renderLogin, setupLogin } from './views/login'
import { renderGamesList, setupGamesList } from './views/gamesList'
import { renderGameForm, setupGameForm } from './views/gameForm'
import { renderReservationsList, setupReservationsList } from './views/reservationsList'

const root = document.querySelector<HTMLDivElement>('#admin-app')!

/**
 * Tiny hash router scoped to this admin page only (admin.html is its own Vite entry point —
 * see vite.config.ts — so this never runs alongside, or conflicts with, the public site's
 * router in src/main.ts).
 */
type AdminRoute =
  | { kind: 'login' }
  | { kind: 'games' }
  | { kind: 'game-new' }
  | { kind: 'game-edit'; id: string }
  | { kind: 'reservations' }

function parseRoute(): AdminRoute {
  const hash = window.location.hash
  if (hash === '#/login') return { kind: 'login' }
  if (hash === '#/games/new') return { kind: 'game-new' }
  const editMatch = hash.match(/^#\/games\/([^/]+)\/edit$/)
  if (editMatch) return { kind: 'game-edit', id: decodeURIComponent(editMatch[1]) }
  if (hash === '#/reservations') return { kind: 'reservations' }
  return { kind: 'games' }
}

function navigate(hash: string): void {
  window.location.hash = hash
}

async function route(): Promise<void> {
  const current = parseRoute()

  if (current.kind === 'login') {
    const session = await getSession()
    if (session) {
      navigate('#/games')
      return
    }
    root.innerHTML = renderLogin()
    setupLogin(() => navigate('#/games'))
    return
  }

  const allowed = await requireAuth(navigate)
  if (!allowed) return

  if (current.kind === 'games') {
    root.innerHTML = renderShell('games', renderGamesList())
    setupShell()
    await setupGamesList()
    return
  }

  if (current.kind === 'game-new') {
    root.innerHTML = renderShell('games', renderGameForm('new'))
    setupShell()
    setupGameForm('new', null)
    return
  }

  if (current.kind === 'game-edit') {
    root.innerHTML = renderShell('games', renderGameForm('edit'))
    setupShell()
    setupGameForm('edit', current.id)
    return
  }

  root.innerHTML = renderShell('reservations', renderReservationsList())
  setupShell()
  await setupReservationsList()
}

window.addEventListener('hashchange', route)
onAuthStateChange(() => {
  // A sign-in via magic-link redirect (or sign-out) lands here without a hashchange event of
  // its own — re-run the router so the guard/redirect logic picks up the new session state.
  route()
})
route()
