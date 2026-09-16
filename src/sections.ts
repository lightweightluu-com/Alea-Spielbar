import { icon } from './icons'
import {
  contact,
  events,
  gameCategories,
  hours,
  menuHighlights,
  nav,
  quickFacts,
  steps,
  testimonials,
} from './content'

const tintStyles = {
  brand: {
    card: 'bg-brand/12 border-brand/25',
    chip: 'bg-brand text-ink-deep',
  },
  sage: {
    card: 'bg-sage/12 border-sage/25',
    chip: 'bg-sage text-ink-deep',
  },
  tan: {
    card: 'bg-tan/12 border-tan/25',
    chip: 'bg-tan text-ink-deep',
  },
  surface: {
    card: 'bg-surface border-hairline',
    chip: 'bg-paper/10 text-paper',
  },
} as const

export function renderNav(): string {
  const links = nav
    .map(
      (item) =>
        `<a href="${item.href}" class="text-sm font-medium text-muted transition-colors hover:text-paper">${item.label}</a>`,
    )
    .join('')

  return `
  <header id="site-header" data-reveal-skip class="fixed inset-x-0 top-0 z-50 transition-colors duration-300">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <a href="#home" class="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-paper">
        <span class="flex size-8 items-center justify-center rounded-card-sm bg-brand text-ink-deep">
          ${icon('dice-five', 'size-4')}
        </span>
        Alea<span class="text-brand">.</span>
      </a>
      <nav class="hidden items-center gap-8 lg:flex">${links}</nav>
      <div class="flex items-center gap-3">
        <a
          href="#kontakt"
          class="pressable hidden items-center gap-2 rounded-pill bg-brand px-5 py-2.5 text-sm font-semibold text-ink-deep transition-colors hover:bg-brand-rich lg:inline-flex"
        >
          Tisch reservieren
        </a>
        <button
          id="nav-toggle"
          type="button"
          aria-label="Menü öffnen"
          aria-expanded="false"
          class="pressable inline-flex size-10 items-center justify-center rounded-pill border border-hairline text-paper lg:hidden"
        >
          ${icon('menu', 'size-5 nav-icon-open')}
          ${icon('close', 'hidden size-5 nav-icon-close')}
        </button>
      </div>
    </div>
    <nav
      id="nav-mobile"
      class="mx-6 hidden flex-col gap-1 rounded-card border border-hairline bg-surface p-4 shadow-2xl lg:hidden"
    >
      ${nav
        .map(
          (item) =>
            `<a href="${item.href}" class="rounded-input px-3 py-2.5 text-sm font-medium text-paper hover:bg-surface-2">${item.label}</a>`,
        )
        .join('')}
      <a href="#kontakt" class="pressable mt-2 rounded-pill bg-brand px-4 py-2.5 text-center text-sm font-semibold text-ink-deep">
        Tisch reservieren
      </a>
    </nav>
  </header>`
}

function heroMascot(): string {
  return `
  <svg viewBox="0 0 440 440" class="w-36 sm:w-52 md:w-64 lg:w-full lg:max-w-md" role="img" aria-label="Drei bunte Würfel liegen locker gestreut">
    <g class="die-float-b">
      <rect x="24" y="236" width="150" height="150" rx="32" fill="var(--color-sage)" transform="rotate(10 99 311)" />
      <g fill="var(--color-ink-deep)" transform="rotate(10 99 311)">
        <circle cx="61" cy="273" r="10.5" />
        <circle cx="99" cy="311" r="10.5" />
        <circle cx="137" cy="349" r="10.5" />
      </g>
    </g>
    <g class="die-float-c">
      <rect x="296" y="34" width="104" height="104" rx="24" fill="var(--color-tan)" transform="rotate(6 348 86)" />
      <g fill="var(--color-ink-deep)" transform="rotate(6 348 86)">
        <circle cx="324" cy="62" r="8" />
        <circle cx="372" cy="110" r="8" />
      </g>
    </g>
    <g class="die-float-a">
      <rect x="96" y="76" width="232" height="232" rx="46" fill="var(--color-brand)" transform="rotate(-8 212 192)" />
      <g fill="var(--color-ink-deep)" transform="rotate(-8 212 192)">
        <circle cx="146" cy="126" r="16.5" />
        <circle cx="278" cy="126" r="16.5" />
        <circle cx="212" cy="192" r="16.5" />
        <circle cx="146" cy="258" r="16.5" />
        <circle cx="278" cy="258" r="16.5" />
      </g>
    </g>
    <circle class="twinkle" cx="52" cy="90" r="5" fill="var(--color-paper)" style="animation-delay:.2s" />
    <circle class="twinkle" cx="392" cy="220" r="4" fill="var(--color-tan)" style="animation-delay:.9s" />
    <circle class="twinkle" cx="220" cy="24" r="4" fill="var(--color-sage)" style="animation-delay:1.5s" />
  </svg>`
}

export function renderHero(): string {
  return `
  <section id="home" class="relative flex min-h-[100dvh] items-start lg:items-center overflow-hidden pt-16">
    <div class="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-6 py-8 lg:grid-cols-2 lg:gap-8 lg:py-0">
      <div class="order-2 lg:order-1">
        <h1 class="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-5xl md:text-6xl lg:text-7xl">
          Würfle dein Glück.<br />Wähle dein Spiel.
        </h1>
        <p class="mt-5 max-w-[46ch] text-balance text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
          Über 180 Brettspiele, handgemachte Drinks und ein Team, das dir in zwei Minuten das perfekte Spiel für den Abend findet.
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
          <a
            href="#kontakt"
            class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 font-semibold text-ink-deep transition-colors hover:bg-brand-rich"
          >
            Tisch reservieren
            ${icon('arrow-right', 'size-4')}
          </a>
          <a
            href="#spiele"
            class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-6 py-3.5 font-semibold text-paper transition-colors hover:border-paper/30 hover:bg-surface"
          >
            Spiele entdecken
          </a>
        </div>
      </div>
      <div class="order-1 flex justify-center lg:order-2 lg:justify-end">
        ${heroMascot()}
      </div>
    </div>
  </section>`
}

/** Sits directly below the hero, never inside it — see taste-skill's hero-stack discipline. */
export function renderFactsStrip(): string {
  return `
  <div class="border-y border-hairline">
    <ul class="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-3 px-6 py-6 sm:justify-between">
      ${quickFacts
        .map(
          (fact) => `
        <li class="flex items-center gap-2 text-sm text-muted">
          <span class="text-brand">${icon(fact.icon, 'size-4')}</span>
          ${fact.label}
        </li>`,
        )
        .join('')}
    </ul>
  </div>`
}

export function renderKonzept(): string {
  return `
  <section id="konzept" class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
      <div data-reveal class="lg:col-span-6">
        <h2 class="text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
          Wo der Würfel über den Abend entscheidet
        </h2>
        <p class="mt-5 max-w-[54ch] text-balance leading-relaxed text-muted">
          Tisch aussuchen, Spiel aus dem Regal ziehen, loslegen. Unsere Spielpaten setzen sich dazu, wenn eine Regel
          hakt, und verschwinden wieder, sobald der Spielzug läuft. Der Rest ist eure Runde.
        </p>
        <ol class="mt-8 flex flex-col gap-5">
          ${steps
            .map(
              (step, i) => `
            <li class="flex gap-4">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-pill bg-brand font-display text-sm font-bold text-paper">
                ${i + 1}
              </span>
              <div>
                <p class="font-semibold text-paper">${step.title}</p>
                <p class="mt-0.5 text-sm leading-relaxed text-muted">${step.desc}</p>
              </div>
            </li>`,
            )
            .join('')}
        </ol>
      </div>
      <div data-reveal class="lg:col-span-6">
        <img
          src="https://picsum.photos/seed/alea-spielbar-konzept-tische/900/700"
          alt="Gäste sitzen an Holztischen zwischen Spieleregalen in der Alea Spielbar"
          width="900"
          height="700"
          loading="lazy"
          class="aspect-[9/7] w-full rounded-card object-cover"
        />
      </div>
    </div>
  </section>`
}

export function renderSpiele(): string {
  const [featured, ...rest] = gameCategories
  const featuredTint = tintStyles[featured.tint]

  const restCards = rest
    .map((cat) => {
      const t = tintStyles[cat.tint]
      return `
      <div class="flex flex-col justify-between gap-6 rounded-card border p-6 ${t.card}">
        <span class="inline-flex size-10 items-center justify-center rounded-card-sm ${t.chip}">
          ${icon(cat.icon, 'size-5')}
        </span>
        <div>
          <h3 class="font-display text-lg font-semibold text-paper">${cat.title}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">${cat.desc}</p>
        </div>
      </div>`
    })
    .join('')

  return `
  <section id="spiele" class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div data-reveal class="max-w-[54ch]">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-tan">Spielregal</p>
      <h2 class="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Für jede Laune ein Spiel
      </h2>
    </div>
    <div data-reveal class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-2">
      <div class="flex flex-col justify-between gap-8 rounded-card border p-8 md:col-span-2 md:row-span-2 ${featuredTint.card}">
        <span class="inline-flex size-12 items-center justify-center rounded-card-sm ${featuredTint.chip}">
          ${icon(featured.icon, 'size-6')}
        </span>
        <div>
          <h3 class="font-display text-2xl font-semibold text-paper">${featured.title}</h3>
          <p class="mt-3 max-w-[38ch] leading-relaxed text-muted">${featured.desc}</p>
        </div>
      </div>
      ${restCards}
    </div>
  </section>`
}

export function renderEssenTrinken(): string {
  return `
  <section class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
      <div data-reveal class="order-2 lg:order-1 lg:col-span-6">
        <img
          src="https://picsum.photos/seed/alea-spielbar-drinks-bar/900/700"
          alt="Bunte Cocktails und ein Bierglas auf der Theke der Alea Spielbar"
          width="900"
          height="700"
          loading="lazy"
          class="aspect-[9/7] w-full rounded-card object-cover"
        />
      </div>
      <div data-reveal class="order-1 lg:order-2 lg:col-span-6">
        <h2 class="text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
          Durst und Hunger? Gedeckt.
        </h2>
        <p class="mt-5 max-w-[54ch] text-balance leading-relaxed text-muted">
          Unsere Bar mixt nach Spielen benannte Cocktails, zapft lokales Craft-Bier und schickt Flammkuchen an den
          Tisch, ohne dass ihr die Runde unterbrechen müsst.
        </p>
        <ul class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          ${menuHighlights
            .map(
              (item) => `
            <li class="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface px-4 py-2 text-sm text-paper">
              <span class="text-sage">${icon(item.icon, 'size-4')}</span>
              ${item.label}
            </li>`,
            )
            .join('')}
        </ul>
      </div>
    </div>
  </section>`
}

export function renderEvents(): string {
  const cards = events
    .map(
      (event) => `
    <div class="flex w-[280px] shrink-0 flex-col gap-5 rounded-card border border-hairline bg-surface p-6 sm:w-[320px]">
      <div class="flex items-center justify-between">
        <span class="inline-flex size-10 items-center justify-center rounded-card-sm bg-brand/15 text-brand">
          ${icon(event.icon, 'size-5')}
        </span>
        <span class="rounded-pill bg-paper/10 px-3 py-1 text-xs font-semibold text-muted">${event.day}</span>
      </div>
      <div>
        <h3 class="font-display text-lg font-semibold text-paper">${event.title}</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">${event.desc}</p>
      </div>
    </div>`,
    )
    .join('')

  return `
  <section id="events" class="py-24 md:py-32">
    <div data-reveal class="mx-auto max-w-7xl px-6">
      <h2 class="text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Mehr als ein Spieleabend
      </h2>
      <p class="mt-4 max-w-[54ch] text-balance leading-relaxed text-muted">
        Jede Woche ein Grund mehr vorbeizukommen — zum Durchscrollen einfach mit dem Finger oder der Maus ziehen.
      </p>
    </div>
    <div data-reveal class="snap-row mt-10 flex gap-5 overflow-x-auto px-6 pb-4 lg:mx-auto lg:max-w-7xl">
      ${cards}
    </div>
  </section>`
}

export function renderKontakt(): string {
  const hoursRows = hours
    .map(
      (row) => `
    <div class="flex items-center justify-between border-b border-hairline py-3 text-sm last:border-0">
      <span class="text-muted">${row.days}</span>
      <span class="font-medium text-paper">${row.time}</span>
    </div>`,
    )
    .join('')

  return `
  <section id="kontakt" class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div data-reveal class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="rounded-card border border-hairline bg-surface p-8">
        <span class="inline-flex size-10 items-center justify-center rounded-card-sm bg-sage/15 text-sage">
          ${icon('clock', 'size-5')}
        </span>
        <h3 class="mt-5 font-display text-xl font-semibold text-paper">Öffnungszeiten</h3>
        <div class="mt-4">${hoursRows}</div>
      </div>
      <div class="rounded-card border border-hairline bg-surface p-8">
        <span class="inline-flex size-10 items-center justify-center rounded-card-sm bg-brand/15 text-brand">
          ${icon('map-pin', 'size-5')}
        </span>
        <h3 class="mt-5 font-display text-xl font-semibold text-paper">So findet ihr uns</h3>
        <p class="mt-4 text-sm leading-relaxed text-paper">${contact.address}</p>
        <p class="mt-1 text-sm leading-relaxed text-muted">${contact.hint}</p>
        <div class="mt-6 flex flex-col gap-3">
          <a href="${contact.phoneHref}" class="flex items-center gap-2 text-sm text-paper hover:text-brand-pale">
            ${icon('phone', 'size-4')} ${contact.phone}
          </a>
          <a href="${contact.mailHref}" class="flex items-center gap-2 text-sm text-paper hover:text-brand-pale">
            ${icon('envelope-simple', 'size-4')} ${contact.email}
          </a>
        </div>
      </div>
    </div>

    <div data-reveal class="mt-16 rounded-card border border-hairline bg-felt bg-surface p-10 text-center md:p-16">
      <h2 class="text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Bereit zu würfeln?
      </h2>
      <p class="mx-auto mt-4 max-w-[42ch] text-balance leading-relaxed text-muted">
        Schreibt uns Datum, Uhrzeit und Personenzahl — wir antworten meist innerhalb weniger Stunden.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href="${contact.mailHref}"
          class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 font-semibold text-ink-deep transition-colors hover:bg-brand-rich"
        >
          Tisch reservieren
          ${icon('arrow-right', 'size-4')}
        </a>
        <a
          href="${contact.phoneHref}"
          class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-6 py-3.5 font-semibold text-paper transition-colors hover:border-paper/30"
        >
          ${icon('phone', 'size-4')} ${contact.phone}
        </a>
      </div>
    </div>
  </section>`
}

export function renderStimmen(): string {
  const cards = testimonials
    .map(
      (t) => `
    <figure data-reveal class="flex flex-col justify-between gap-6 rounded-card border border-hairline bg-surface p-7">
      <div class="flex gap-1 text-tan">
        ${icon('star', 'size-4')}${icon('star', 'size-4')}${icon('star', 'size-4')}${icon('star', 'size-4')}${icon('star', 'size-4')}
      </div>
      <blockquote class="text-balance leading-relaxed text-paper">&ldquo;${t.quote}&rdquo;</blockquote>
      <figcaption class="flex items-center gap-3">
        <img
          src="https://picsum.photos/seed/${t.seed}/96/96"
          alt=""
          width="48"
          height="48"
          loading="lazy"
          class="size-12 rounded-pill object-cover"
        />
        <div>
          <p class="text-sm font-semibold text-paper">${t.name}</p>
          <p class="text-xs text-faint">${t.role}</p>
        </div>
      </figcaption>
    </figure>`,
    )
    .join('')

  return `
  <section class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div data-reveal class="max-w-[54ch]">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Stimmen aus der Bar</p>
      <h2 class="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Das sagen unsere Gäste
      </h2>
    </div>
    <div class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">${cards}</div>
  </section>`
}

export function renderFooter(): string {
  const year = new Date().getFullYear()
  return `
  <footer class="border-t border-hairline">
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <a href="#home" class="flex items-center gap-2 font-display text-lg font-bold text-paper">
          <span class="flex size-8 items-center justify-center rounded-card-sm bg-brand text-ink-deep">
            ${icon('dice-five', 'size-4')}
          </span>
          Alea<span class="text-brand">.</span>
        </a>
        <p class="mt-4 max-w-[28ch] text-sm leading-relaxed text-muted">
          Die Spielbar, in der jeder Abend anders gewürfelt wird.
        </p>
        <div class="mt-5 flex gap-3">
          <a href="#" aria-label="Alea Spielbar auf Instagram" class="flex size-9 items-center justify-center rounded-pill border border-hairline text-muted hover:text-paper">
            ${icon('instagram-logo', 'size-4')}
          </a>
          <a href="#" aria-label="Alea Spielbar auf Facebook" class="flex size-9 items-center justify-center rounded-pill border border-hairline text-muted hover:text-paper">
            ${icon('facebook-logo', 'size-4')}
          </a>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-paper">Entdecken</h4>
        <ul class="mt-4 flex flex-col gap-3">
          ${nav.map((item) => `<li><a href="${item.href}" class="text-sm text-muted hover:text-paper">${item.label}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-paper">Öffnungszeiten</h4>
        <ul class="mt-4 flex flex-col gap-3">
          ${hours.map((row) => `<li class="text-sm text-muted">${row.days}: <span class="text-paper">${row.time}</span></li>`).join('')}
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-paper">Kontakt</h4>
        <ul class="mt-4 flex flex-col gap-3 text-sm text-muted">
          <li>${contact.address}</li>
          <li><a href="${contact.phoneHref}" class="hover:text-paper">${contact.phone}</a></li>
          <li><a href="${contact.mailHref}" class="hover:text-paper">${contact.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-hairline px-6 py-6 text-center text-xs text-faint">
      © ${year} Alea Spielbar · Leipzig
    </div>
  </footer>`
}
