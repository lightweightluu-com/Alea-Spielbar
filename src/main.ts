import './style.css'
import { animate } from 'motion'
import {
  renderBewertung,
  renderEssenTrinken,
  renderEvents,
  renderFactsStrip,
  renderFooter,
  renderHero,
  renderKonzept,
  renderKontakt,
  renderNav,
  renderSpiele,
} from './sections'
import { contact, rooms } from './content'

const THEME_KEY = 'alea-theme'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = [
  renderNav(),
  '<main>',
  renderHero(),
  renderFactsStrip(),
  renderKonzept(),
  renderSpiele(),
  renderEssenTrinken(),
  renderEvents(),
  renderKontakt(),
  renderBewertung(),
  '</main>',
  renderFooter(),
].join('')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

setupThemeToggle()
setupMobileNav()
setupHeaderScrollState()
setupScrollReveal()
setupReservationForm()
if (!prefersReducedMotion && hasFinePointer) {
  setupMagneticCta()
  setupDiceGreeting()
}

/** Reads/writes the persisted theme choice. Default is light; index.html's inline head script already applied a stored 'dark' before first paint, so this only wires the toggle going forward. */
function setupThemeToggle(): void {
  const toggle = document.querySelector<HTMLButtonElement>('#theme-toggle')
  if (!toggle) return

  const sunIcon = toggle.querySelector('.theme-icon-light')
  const moonIcon = toggle.querySelector('.theme-icon-dark')

  const applyIcons = (dark: boolean) => {
    sunIcon?.classList.toggle('hidden', dark)
    moonIcon?.classList.toggle('hidden', !dark)
    toggle.setAttribute('aria-pressed', String(dark))
    toggle.setAttribute('aria-label', dark ? 'Zu hellem Farbschema wechseln' : 'Zu dunklem Farbschema wechseln')
  }

  applyIcons(document.documentElement.getAttribute('data-theme') === 'dark')

  toggle.addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark'
    const next = dark ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // Private browsing / storage disabled — theme just won't persist across visits.
    }
    applyIcons(next === 'dark')
  })
}

function setupMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('#nav-toggle')
  const panel = document.querySelector<HTMLElement>('#nav-mobile')
  if (!toggle || !panel) return

  const openIcon = toggle.querySelector('.nav-icon-open')
  const closeIcon = toggle.querySelector('.nav-icon-close')

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open))
    panel.classList.toggle('hidden', !open)
    panel.classList.toggle('flex', open)
    openIcon?.classList.toggle('hidden', open)
    closeIcon?.classList.toggle('hidden', !open)
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true')
  })

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false))
  })
}

function setupHeaderScrollState(): void {
  const header = document.querySelector<HTMLElement>('#site-header')
  if (!header) return

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8)
  update()
  window.addEventListener('scroll', update, { passive: true })
}

function setupScrollReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (targets.length === 0) return

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        window.setTimeout(() => el.classList.add('is-visible'), index * 60)
        observer.unobserve(el)
      })
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  )

  targets.forEach((el) => observer.observe(el))
}

/** Subtle magnetic pull on the hero's primary CTA — a decorative, once-per-page touch. */
function setupMagneticCta(): void {
  const cta = document.querySelector<HTMLAnchorElement>('#home a[href="#reservieren"]')
  if (!cta) return

  const strength = 14
  const spring = { type: 'spring', stiffness: 300, damping: 20, mass: 0.4 } as const

  cta.addEventListener('mousemove', (event) => {
    const rect = cta.getBoundingClientRect()
    const relX = event.clientX - rect.left - rect.width / 2
    const relY = event.clientY - rect.top - rect.height / 2
    animate(cta, { x: (relX / rect.width) * strength, y: (relY / rect.height) * strength }, spring)
  })

  cta.addEventListener('mouseleave', () => {
    animate(cta, { x: 0, y: 0 }, spring)
  })
}

/** A quick, motivated wiggle on the hero dice when a visitor first hovers them — reinforces the brand's "roll your luck" idea. */
function setupDiceGreeting(): void {
  const scene = document.querySelector<SVGSVGElement>('#home svg')
  const heroDie = scene?.querySelector<SVGGElement>('.die-float-a')
  if (!scene || !heroDie) return

  let greeted = false
  scene.addEventListener('mouseenter', () => {
    if (greeted) return
    greeted = true
    heroDie.classList.replace('die-float-a', 'die-greet')
    heroDie.addEventListener(
      'animationend',
      () => heroDie.classList.replace('die-greet', 'die-float-a'),
      { once: true },
    )
  })
}

/**
 * The reservation/contact form has no backend, so "submitting" it means opening the visitor's
 * own email client with a prefilled mailto: — the same no-backend pattern the form's helper text
 * promises. We still run real client-side validation first so the mailto only fires on valid input.
 */
function setupReservationForm(): void {
  const form = document.querySelector<HTMLFormElement>('#reservation-form')
  const anliegenSelect = document.querySelector<HTMLSelectElement>('#rf-anliegen')
  const anliegenHint = document.querySelector<HTMLParagraphElement>('#rf-anliegen-hint')
  const status = document.querySelector<HTMLParagraphElement>('#rf-status')
  if (!form || !anliegenSelect || !anliegenHint || !status) return

  const defaultStatus = status.textContent ?? ''

  const updateHint = () => {
    const room = rooms.find((r) => r.id === anliegenSelect.value)
    anliegenHint.textContent = room?.desc ?? ''
  }
  updateHint()
  anliegenSelect.addEventListener('change', updateHint)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!form.reportValidity()) {
      status.textContent = 'Bitte füllt Name, E-Mail und Nachricht aus.'
      return
    }

    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const anliegenId = String(data.get('anliegen') ?? '')
    const anliegenLabel = rooms.find((r) => r.id === anliegenId)?.name ?? anliegenId
    const date = String(data.get('date') ?? '').trim()
    const time = String(data.get('time') ?? '').trim()
    const people = String(data.get('people') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const bodyLines = [
      `Anliegen: ${anliegenLabel}`,
      date && `Datum: ${date}`,
      time && `Uhrzeit: ${time}`,
      people && `Personenzahl: ${people}`,
      '',
      message,
      '',
      `— ${name} (${email})`,
    ].filter((line): line is string => Boolean(line) || line === '')

    const subject = `Anfrage über die Website: ${anliegenLabel}`
    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`

    window.location.href = mailto
    status.textContent = 'E-Mail-Programm geöffnet — bitte dort noch auf „Senden" tippen.'
    window.setTimeout(() => {
      status.textContent = defaultStatus
    }, 6000)
  })
}
