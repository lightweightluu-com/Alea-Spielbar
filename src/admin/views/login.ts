import { signInWithOtp, signInWithPassword } from '../auth'

export function renderLogin(): string {
  return `
  <div class="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-tan-text">Alea Spielbar</p>
    <h1 class="mt-3 font-display text-2xl font-bold text-paper">Admin-Anmeldung</h1>
    <p class="mt-2 text-sm leading-relaxed text-muted">
      Meldet euch mit eurem Passwort an, oder lasst euch einen Magic Link per E-Mail schicken.
    </p>

    <form id="login-form" novalidate class="mt-8 flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="login-email" class="text-sm font-medium text-paper">E-Mail-Adresse</label>
        <input id="login-email" name="email" type="email" required autocomplete="email" class="form-input" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="login-password" class="text-sm font-medium text-paper">
          Passwort <span class="text-faint">(leer lassen für Magic Link)</span>
        </label>
        <input id="login-password" name="password" type="password" autocomplete="current-password" class="form-input" />
      </div>

      <div class="mt-2 flex flex-col gap-3">
        <button
          type="submit"
          data-action="password"
          class="pressable inline-flex items-center justify-center gap-2 rounded-pill bg-brand px-6 py-3 font-semibold text-on-accent hover:bg-brand-rich"
        >
          Mit Passwort anmelden
        </button>
        <button
          type="submit"
          data-action="magic-link"
          class="pressable inline-flex items-center justify-center gap-2 rounded-pill border border-hairline px-6 py-3 font-semibold text-paper hover:bg-surface-2"
        >
          Magic Link senden
        </button>
      </div>

      <p id="login-status" role="status" aria-live="polite" class="mt-1 text-sm text-muted"></p>
    </form>
  </div>`
}

export function setupLogin(onSignedIn: () => void): void {
  const form = document.querySelector<HTMLFormElement>('#login-form')
  const status = document.querySelector<HTMLParagraphElement>('#login-status')
  if (!form || !status) return

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null
    const action = submitter?.dataset.action ?? 'password'

    const data = new FormData(form)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')

    if (!email) {
      status.textContent = 'Bitte gebt eure E-Mail-Adresse ein.'
      return
    }

    if (action === 'magic-link') {
      status.textContent = 'Magic Link wird gesendet …'
      const error = await signInWithOtp(email)
      status.textContent = error
        ? `Fehler: ${error}`
        : 'Magic Link verschickt — schaut in euer Postfach (ggf. auch im Spam-Ordner).'
      return
    }

    if (!password) {
      status.textContent = 'Bitte gebt euer Passwort ein, oder lasst das Feld leer für einen Magic Link.'
      return
    }

    status.textContent = 'Anmeldung läuft …'
    const error = await signInWithPassword(email, password)
    if (error) {
      status.textContent = `Fehler: ${error}`
      return
    }
    onSignedIn()
  })
}
