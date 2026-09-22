import './style.css'
import { animate } from 'motion'
import {
  ratingCtaPrimary,
  ratingCtaSecondary,
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
import { renderGameDetailPage, renderGamesGrid, renderGamesListPage } from './gamePages'

const THEME_KEY = 'alea-theme'

const app = document.querySelector<HTMLDivElement>('#app')!
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * The header/nav and footer are page chrome shared by every route, so they render once and stay
 * mounted. #home-root and #games-root are siblings inside <main>; the router only ever toggles
 * which one is visible (and (re)fills #games-root's content on the way in) — it never tears down
 * and rebuilds the homepage, so its scroll-reveal state, reservation form input, and rating
 * selection survive a trip to the games catalog and back.
 */
app.innerHTML = [
  renderNav(),
  '<main>',
  '<div id="home-root"></div>',
  '<div id="games-root" class="hidden"></div>',
  '</main>',
  renderFooter(),
].join('')

const homeRoot = document.querySelector<HTMLDivElement>('#home-root')!
const gamesRoot = document.querySelector<HTMLDivElement>('#games-root')!

setupThemeToggle()
setupMobileNav()
setupHeaderScrollState()

/**
 * A tiny hash router for the standalone games catalog (#/spiele-liste, #/spiele-liste/:slug).
 * Every other hash — including the marketing site's plain in-page anchors like #kontakt — falls
 * through to "home" and is left to the browser's native anchor scrolling.
 */
type Route = { kind: 'home' } | { kind: 'games-list' } | { kind: 'game-detail'; slug: string }

function parseRoute(): Route {
  const hash = window.location.hash
  if (hash === '#/spiele-liste') return { kind: 'games-list' }
  const detailMatch = hash.match(/^#\/spiele-liste\/(.+)$/)
  if (detailMatch) return { kind: 'game-detail', slug: decodeURIComponent(detailMatch[1]) }
  return { kind: 'home' }
}

let homeInitialized = false

function renderHomePage(): void {
  homeRoot.innerHTML = [
    renderHero(),
    renderFactsStrip(),
    renderKonzept(),
    renderSpiele(),
    renderEssenTrinken(),
    renderEvents(),
    renderKontakt(),
    renderBewertung(),
  ].join('')

  setupScrollReveal()
  setupReservationForm()
  setupRatingWidget()
  if (!prefersReducedMotion && hasFinePointer) {
    setupMagneticCta()
    setupDiceGreeting()
  }
}

function setupGamesSearch(): void {
  const input = document.querySelector<HTMLInputElement>('#games-search')
  const grid = document.querySelector<HTMLDivElement>('#games-grid')
  if (!input || !grid) return
  input.addEventListener('input', () => {
    grid.innerHTML = renderGamesGrid(input.value)
  })
}

function route(): void {
  const current = parseRoute()

  if (current.kind === 'home') {
    if (!homeInitialized) {
      renderHomePage()
      homeInitialized = true
    }
    homeRoot.classList.remove('hidden')
    gamesRoot.classList.add('hidden')
    const anchor = window.location.hash.slice(1)
    if (anchor) document.getElementById(anchor)?.scrollIntoView()
    return
  }

  homeRoot.classList.add('hidden')
  gamesRoot.classList.remove('hidden')
  if (current.kind === 'games-list') {
    gamesRoot.innerHTML = renderGamesListPage()
    setupGamesSearch()
  } else {
    gamesRoot.innerHTML = renderGameDetailPage(current.slug)
  }
  window.scrollTo(0, 0)
}

window.addEventListener('hashchange', route)
route()

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

/**
 * Star-only rating picker. Clicking a star reveals both a Google-review link and a direct
 * feedback form — always both, regardless of the rating chosen. Routing happy customers to
 * Google and unhappy ones only to a private form ("review gating") is against Google's review
 * policy and actively enforced; the rating only changes which option is emphasized and what the
 * message says, never which options exist.
 */
function setupRatingWidget(): void {
  const starButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-rating-star]'))
  const result = document.querySelector<HTMLDivElement>('#rating-result')
  const resultText = document.querySelector<HTMLParagraphElement>('#rating-result-text')
  const googleCta = document.querySelector<HTMLAnchorElement>('#rating-google-cta')
  const feedbackCta = document.querySelector<HTMLButtonElement>('#rating-feedback-cta')
  const feedbackWrap = document.querySelector<HTMLDivElement>('#rating-feedback-wrap')
  const feedbackForm = document.querySelector<HTMLFormElement>('#feedback-form')
  const feedbackStatus = document.querySelector<HTMLParagraphElement>('#fb-status')
  if (!starButtons.length || !result || !resultText || !googleCta || !feedbackCta || !feedbackWrap || !feedbackForm || !feedbackStatus) {
    return
  }

  let selectedRating = 0

  const paintStars = (rating: number) => {
    starButtons.forEach((button) => {
      const value = Number(button.dataset.ratingStar)
      const filled = button.querySelector('.rating-star-filled')
      const empty = button.querySelector('.rating-star-empty')
      const isFilled = value <= rating
      filled?.classList.toggle('hidden', !isFilled)
      empty?.classList.toggle('hidden', isFilled)
      button.classList.toggle('text-tan-text', isFilled)
      button.classList.toggle('text-faint', !isFilled)
    })
  }

  const messageFor = (rating: number): string => {
    if (rating <= 2) {
      return 'Das tut uns leid! Erzählt uns direkt, was schiefgelaufen ist — wir kümmern uns persönlich darum. Wer mag, kann seine Erfahrung natürlich auch öffentlich auf Google teilen.'
    }
    if (rating === 3) {
      return 'Danke fürs ehrliche Feedback! Was können wir besser machen? Schreibt uns direkt, oder teilt eure Erfahrung öffentlich auf Google.'
    }
    return 'Das freut uns riesig! Eine ehrliche Bewertung auf Google hilft anderen Spielefans, uns zu finden. Ihr könnt uns natürlich auch direkt schreiben.'
  }

  const setCtaEmphasis = (primary: HTMLElement, secondary: HTMLElement) => {
    primary.classList.remove(...ratingCtaSecondary.split(' '))
    primary.classList.add(...ratingCtaPrimary.split(' '))
    secondary.classList.remove(...ratingCtaPrimary.split(' '))
    secondary.classList.add(...ratingCtaSecondary.split(' '))
  }

  const selectRating = (rating: number) => {
    selectedRating = rating
    paintStars(rating)
    starButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.ratingStar) <= rating))
    })

    resultText.textContent = messageFor(rating)
    result.classList.remove('hidden')

    if (rating >= 4) {
      setCtaEmphasis(googleCta, feedbackCta)
    } else {
      setCtaEmphasis(feedbackCta, googleCta)
    }
  }

  starButtons.forEach((button) => {
    const value = Number(button.dataset.ratingStar)
    button.addEventListener('mouseenter', () => paintStars(value))
    button.addEventListener('click', () => selectRating(value))
  })

  document.querySelector<HTMLDivElement>('#rating-stars')?.addEventListener('mouseleave', () => paintStars(selectedRating))

  feedbackCta.addEventListener('click', () => {
    const open = feedbackWrap.classList.toggle('hidden') === false
    feedbackCta.setAttribute('aria-expanded', String(open))
    if (open) {
      feedbackWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      document.querySelector<HTMLInputElement>('#fb-name')?.focus()
    }
  })

  const defaultFeedbackStatus = feedbackStatus.textContent ?? ''

  feedbackForm.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!feedbackForm.reportValidity()) {
      feedbackStatus.textContent = 'Bitte füllt Name, E-Mail und Nachricht aus.'
      return
    }

    const data = new FormData(feedbackForm)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const bodyLines = [`Bewertung: ${selectedRating} von 5 Sternen`, '', message, '', `— ${name} (${email})`]

    const subject = `Feedback über die Website: ${selectedRating} von 5 Sternen`
    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`

    window.location.href = mailto
    feedbackStatus.textContent = 'E-Mail-Programm geöffnet — bitte dort noch auf „Senden" tippen.'
    window.setTimeout(() => {
      feedbackStatus.textContent = defaultFeedbackStatus
    }, 6000)
  })
}
