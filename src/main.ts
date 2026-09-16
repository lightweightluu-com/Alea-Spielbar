import './style.css'
import { animate } from 'motion'
import {
  renderEssenTrinken,
  renderEvents,
  renderFactsStrip,
  renderFooter,
  renderHero,
  renderKonzept,
  renderKontakt,
  renderNav,
  renderSpiele,
  renderStimmen,
} from './sections'

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
  renderStimmen(),
  renderKontakt(),
  '</main>',
  renderFooter(),
].join('')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

setupMobileNav()
setupHeaderScrollState()
setupScrollReveal()
if (!prefersReducedMotion && hasFinePointer) {
  setupMagneticCta()
  setupDiceGreeting()
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
  const cta = document.querySelector<HTMLAnchorElement>('#home a[href="#kontakt"]')
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
