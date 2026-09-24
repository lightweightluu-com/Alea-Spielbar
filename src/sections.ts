import { icon } from './icons'
import {
  contact,
  events,
  gameCategories,
  hours,
  impressum,
  mediaReports,
  menuHighlights,
  nav,
  quickFacts,
  rooms,
  steps,
  voucherValues,
  vouchers,
} from './content'
import { games, previewGames } from './games'
import { gameCard } from './gamePages'

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

function themeToggleButton(): string {
  return `
  <button
    id="theme-toggle"
    type="button"
    aria-label="Zu dunklem Farbschema wechseln"
    aria-pressed="false"
    class="pressable inline-flex size-10 items-center justify-center rounded-pill border border-hairline text-paper"
  >
    ${icon('sun', 'size-[18px] theme-icon-light')}
    ${icon('moon-stars', 'hidden size-[18px] theme-icon-dark')}
  </button>`
}

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
        <img src="/logo-mark.png" alt="Alea Spielbar" class="size-9" width="256" height="256" />
        Alea<span class="text-brand-text">.</span>
      </a>
      <nav class="hidden items-center gap-8 lg:flex">${links}</nav>
      <div class="flex items-center gap-3">
        ${themeToggleButton()}
        <a
          href="#reservieren"
          class="pressable hidden items-center gap-2 rounded-pill bg-brand px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-brand-rich lg:inline-flex"
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
      <a href="#reservieren" class="pressable mt-2 rounded-pill bg-brand px-4 py-2.5 text-center text-sm font-semibold text-on-accent">
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
          ${contact.brandName} im Herzen von Zürich: über 180 Spiele, Cocktails, Craft-Bier und ein Team, das dir in
          Minuten das passende Spiel für den Abend zeigt. Eintritt: CHF 7 pro Person, ganz ohne Zeitlimit.
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
          <a
            href="#reservieren"
            class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 font-semibold text-on-accent transition-colors hover:bg-brand-rich"
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
          <span class="text-brand-text">${icon(fact.icon, 'size-4')}</span>
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
              <span class="flex size-8 shrink-0 items-center justify-center rounded-pill bg-brand font-display text-sm font-bold text-on-accent">
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
  const categoryChips = gameCategories
    .map((cat) => {
      const t = tintStyles[cat.tint]
      return `
      <div class="inline-flex shrink-0 items-center gap-2.5 rounded-pill border p-2 pr-4 ${t.card}">
        <span class="inline-flex size-7 shrink-0 items-center justify-center rounded-pill ${t.chip}">
          ${icon(cat.icon, 'size-3.5')}
        </span>
        <span class="text-sm font-medium text-paper">${cat.title}</span>
      </div>`
    })
    .join('')

  const previewCards = previewGames(10)
    .map((game) => gameCard(game))
    .join('')

  return `
  <section id="spiele" class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div data-reveal class="max-w-[54ch]">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-tan-text">Spielregal</p>
      <h2 class="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Für jede Laune ein Spiel
      </h2>
    </div>
    <div data-reveal class="mt-8 flex gap-3 overflow-x-auto pb-1">
      ${categoryChips}
    </div>
    <div data-reveal class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      ${previewCards}
    </div>
    <div data-reveal class="mt-8">
      <a
        href="#/spiele-liste"
        class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-6 py-3.5 font-semibold text-paper transition-colors hover:border-paper/30 hover:bg-surface-2"
      >
        Alle ${games.length} Spiele anzeigen
        ${icon('arrow-right', 'size-4')}
      </a>
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
              <span class="text-sage-text">${icon(item.icon, 'size-4')}</span>
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
        <span class="inline-flex size-10 items-center justify-center rounded-card-sm bg-brand/15 text-brand-text">
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

function voucherForm(): string {
  const valueFields = voucherValues
    .map(
      (value) => `
      <div class="flex flex-col gap-2">
        <label for="gf-qty-${value}" class="text-sm font-medium text-paper">CHF ${value}</label>
        <input
          id="gf-qty-${value}"
          name="qty-${value}"
          type="number"
          min="0"
          max="20"
          value="0"
          inputmode="numeric"
          data-voucher-value="${value}"
          class="form-input"
        />
      </div>`,
    )
    .join('')

  return `
  <form id="voucher-form" novalidate class="mt-8">
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label for="gf-name" class="text-sm font-medium text-paper">Dein Name</label>
        <input id="gf-name" name="name" type="text" required autocomplete="name" class="form-input" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="gf-email" class="text-sm font-medium text-paper">Deine E-Mail-Adresse</label>
        <input id="gf-email" name="email" type="email" required autocomplete="email" class="form-input" />
      </div>
      <div class="grid grid-cols-3 gap-4 sm:col-span-2">
        ${valueFields}
      </div>
      <div class="flex flex-col gap-2 sm:col-span-2">
        <label for="gf-message" class="text-sm font-medium text-paper">Nachricht <span class="text-faint">(optional)</span></label>
        <textarea id="gf-message" name="message" rows="3" class="form-input resize-none"></textarea>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-4">
      <button
        type="submit"
        class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 font-semibold text-on-accent transition-colors hover:bg-brand-rich"
      >
        Gutschein anfragen
        ${icon('arrow-right', 'size-4')}
      </button>
      <p id="gf-status" role="status" aria-live="polite" class="text-sm text-muted">
        Wählt Anzahl &amp; Wert — wir bestätigen per E-Mail und schicken euch den Gutschein als PDF mit QR-Code.
      </p>
    </div>
  </form>`
}

export function renderGutscheine(): string {
  return `
  <section id="gutscheine" class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div data-reveal class="max-w-[54ch]">
      <span class="inline-flex size-10 items-center justify-center rounded-card-sm bg-tan/15 text-tan-text">
        ${icon('gift', 'size-5')}
      </span>
      <h2 class="mt-5 text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Gutscheine bestellen
      </h2>
      <p class="mt-4 max-w-[60ch] text-balance leading-relaxed text-muted">
        ${vouchers.intro} ${vouchers.delivery} ${vouchers.pickup}
      </p>
    </div>

    <div data-reveal class="mt-10 rounded-card border border-hairline bg-surface p-8 md:p-10">
      ${voucherForm()}
    </div>
  </section>`
}

export function renderMedienberichte(): string {
  const cards = mediaReports
    .map(
      (report) => `
    <div class="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-6">
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-[0.18em] text-tan-text">${report.outlet}</span>
        <span class="text-xs text-faint">${report.date}</span>
      </div>
      <h3 class="font-display text-lg font-semibold text-paper">${report.title}</h3>
      <p class="text-sm leading-relaxed text-muted">${report.summary}</p>
    </div>`,
    )
    .join('')

  return `
  <section id="medienberichte" class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div data-reveal class="max-w-[54ch]">
      <span class="inline-flex size-10 items-center justify-center rounded-card-sm bg-sage/15 text-sage-text">
        ${icon('newspaper', 'size-5')}
      </span>
      <h2 class="mt-5 text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Medienberichte
      </h2>
      <p class="mt-4 max-w-[54ch] text-balance leading-relaxed text-muted">
        Das sagen andere über uns.
      </p>
    </div>
    <div data-reveal class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      ${cards}
    </div>
  </section>`
}

function reservationForm(): string {
  const options = rooms.map((r) => `<option value="${r.id}">${r.name}</option>`).join('')
  const hints = rooms.map((r) => `<span data-anliegen-hint="${r.id}" class="hidden">${r.desc}</span>`).join('')

  return `
  <div id="reservieren" data-reveal class="rounded-card border border-hairline bg-surface p-8 md:p-10">
    <h3 class="font-display text-2xl font-semibold text-paper">Tisch reservieren oder kontaktieren</h3>
    <p class="mt-2 max-w-[54ch] text-sm leading-relaxed text-muted">
      Der Hauptbereich läuft meist ohne Reservation. Für die beiden Spielräume oder alles andere: einfach absenden —
      eure Anfrage geht direkt bei uns ein.
    </p>

    <form id="reservation-form" novalidate class="mt-8">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="rf-name" class="text-sm font-medium text-paper">Dein Name</label>
          <input id="rf-name" name="name" type="text" required autocomplete="name" class="form-input" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="rf-email" class="text-sm font-medium text-paper">Deine E-Mail-Adresse</label>
          <input id="rf-email" name="email" type="email" required autocomplete="email" class="form-input" />
        </div>
        <div class="flex flex-col gap-2 sm:col-span-2">
          <label for="rf-anliegen" class="text-sm font-medium text-paper">Anliegen</label>
          <select id="rf-anliegen" name="anliegen" class="form-input">
            ${options}
          </select>
          <p id="rf-anliegen-hint" class="text-xs text-muted"></p>
          <span class="hidden" id="rf-anliegen-hints">${hints}</span>
        </div>
        <div class="flex flex-col gap-2">
          <label for="rf-date" class="text-sm font-medium text-paper">Datum <span class="text-faint">(optional)</span></label>
          <input id="rf-date" name="date" type="date" class="form-input" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="rf-time" class="text-sm font-medium text-paper">Uhrzeit <span class="text-faint">(optional)</span></label>
          <input id="rf-time" name="time" type="time" class="form-input" />
        </div>
        <div class="flex flex-col gap-2 sm:col-span-2">
          <label for="rf-people" class="text-sm font-medium text-paper">Personenzahl <span class="text-faint">(optional)</span></label>
          <input id="rf-people" name="people" type="number" min="1" max="40" placeholder="z. B. 6" class="form-input" />
        </div>
        <div class="flex flex-col gap-2 sm:col-span-2">
          <label for="rf-message" class="text-sm font-medium text-paper">Deine Nachricht</label>
          <textarea id="rf-message" name="message" rows="4" required class="form-input resize-none"></textarea>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 font-semibold text-on-accent transition-colors hover:bg-brand-rich"
        >
          Absenden
          ${icon('arrow-right', 'size-4')}
        </button>
        <p id="rf-status" role="status" aria-live="polite" class="text-sm text-muted">
          Eure Anfrage geht direkt an uns — wir melden uns per E-Mail zurück.
        </p>
      </div>
    </form>

    <div class="mt-8 flex flex-wrap gap-3 border-t border-hairline pt-6">
      <a href="${contact.mailHref}" class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-4 py-2 text-sm font-medium text-paper hover:bg-surface-2">
        ${icon('envelope-simple', 'size-4')} ${contact.email}
      </a>
      <a href="${contact.discordHref}" target="_blank" rel="noopener noreferrer" class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-4 py-2 text-sm font-medium text-paper hover:bg-surface-2">
        ${icon('discord-logo', 'size-4')} Discord
      </a>
      <a href="${contact.instagramHref}" target="_blank" rel="noopener noreferrer" class="pressable inline-flex items-center gap-2 rounded-pill border border-hairline px-4 py-2 text-sm font-medium text-paper hover:bg-surface-2">
        ${icon('instagram-logo', 'size-4')} Instagram
      </a>
    </div>
  </div>`
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
    <div data-reveal class="max-w-[54ch]">
      <h2 class="text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Kontakt &amp; Reservation
      </h2>
    </div>

    <div data-reveal class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div class="rounded-card border border-hairline bg-surface p-8">
        <span class="inline-flex size-10 items-center justify-center rounded-card-sm bg-sage/15 text-sage-text">
          ${icon('clock', 'size-5')}
        </span>
        <h3 class="mt-5 font-display text-xl font-semibold text-paper">Öffnungszeiten</h3>
        <div class="mt-4">${hoursRows}</div>
      </div>
      <div class="rounded-card border border-hairline bg-surface p-8">
        <span class="inline-flex size-10 items-center justify-center rounded-card-sm bg-brand/15 text-brand-text">
          ${icon('map-pin', 'size-5')}
        </span>
        <h3 class="mt-5 font-display text-xl font-semibold text-paper">So findet ihr uns</h3>
        <p class="mt-4 text-sm leading-relaxed text-paper">${contact.address}</p>
        <p class="mt-1 text-sm leading-relaxed text-muted">${contact.hint}</p>
        <div class="mt-5 overflow-hidden rounded-card-sm border border-hairline">
          <iframe
            src="${contact.mapsEmbedSrc}"
            width="100%"
            height="220"
            style="border:0; display:block"
            loading="lazy"
            allow="fullscreen"
            referrerpolicy="no-referrer-when-downgrade"
            title="Karte: Alea Spielbar, ${contact.address}"
          ></iframe>
        </div>
        <a
          href="${contact.mapsPlaceHref}"
          target="_blank"
          rel="noopener noreferrer"
          class="pressable mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:underline"
        >
          ${icon('navigation-arrow', 'size-4')} Route planen
        </a>
      </div>
    </div>

    <div class="mt-5">${reservationForm()}</div>
  </section>`
}

/** Primary (filled) vs. secondary (outline) pill styles — JS swaps these between the two CTAs based on the chosen rating. */
const ratingCtaPrimary =
  'bg-brand text-on-accent hover:bg-brand-rich'
const ratingCtaSecondary =
  'border border-hairline text-paper hover:border-paper/30 hover:bg-surface-2'

function ratingStars(): string {
  return [1, 2, 3, 4, 5]
    .map(
      (n) => `
      <button
        type="button"
        data-rating-star="${n}"
        aria-label="${n} von 5 Sternen"
        aria-pressed="false"
        class="rating-star pressable relative inline-flex size-11 items-center justify-center text-faint transition-colors sm:size-14"
      >
        ${icon('star', 'size-8 rating-star-empty sm:size-10')}
        ${icon('star-fill', 'hidden size-8 rating-star-filled sm:size-10')}
      </button>`,
    )
    .join('')
}

export function renderBewertung(): string {
  return `
  <section id="bewertung" class="mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div data-reveal class="rounded-card border border-hairline bg-felt bg-surface p-10 text-center md:p-16">
      <h2 class="text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
        Wie war euer Abend?
      </h2>
      <p class="mx-auto mt-4 max-w-[46ch] text-balance leading-relaxed text-muted">
        Wählt eure Sterne — wir zeigen euch direkt, wie ihr uns euer Feedback am besten zukommen lasst.
      </p>

      <div id="rating-stars" role="group" aria-label="Sterne-Bewertung" class="mt-8 flex items-center justify-center gap-1 sm:gap-2">
        ${ratingStars()}
      </div>

      <div id="rating-result" class="hidden mt-8">
        <p id="rating-result-text" role="status" aria-live="polite" class="mx-auto max-w-[48ch] text-balance leading-relaxed text-muted"></p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            id="rating-google-cta"
            href="${contact.mapsPlaceHref}"
            target="_blank"
            rel="noopener noreferrer"
            class="pressable inline-flex items-center gap-2 rounded-pill px-6 py-3.5 font-semibold transition-colors"
          >
            ${icon('google-logo', 'size-4')} Auf Google bewerten
          </a>
          <button
            id="rating-feedback-cta"
            type="button"
            aria-expanded="false"
            aria-controls="rating-feedback-wrap"
            class="pressable inline-flex items-center gap-2 rounded-pill px-6 py-3.5 font-semibold transition-colors"
          >
            ${icon('envelope-simple', 'size-4')} Feedback direkt an uns
          </button>
        </div>
      </div>

      <div id="rating-feedback-wrap" class="hidden mt-10 border-t border-hairline pt-8 text-left">
        <h3 class="font-display text-xl font-semibold text-paper">Feedback direkt an uns</h3>
        <p class="mt-2 max-w-[54ch] text-sm leading-relaxed text-muted">
          Schreibt uns, was los war — wir kümmern uns persönlich darum. Öffnet dein E-Mail-Programm mit
          vorausgefüllter Nachricht an ${contact.email}.
        </p>
        <form id="feedback-form" novalidate class="mt-6">
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <label for="fb-name" class="text-sm font-medium text-paper">Dein Name</label>
              <input id="fb-name" name="name" type="text" required autocomplete="name" class="form-input" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="fb-email" class="text-sm font-medium text-paper">Deine E-Mail-Adresse</label>
              <input id="fb-email" name="email" type="email" required autocomplete="email" class="form-input" />
            </div>
            <div class="flex flex-col gap-2 sm:col-span-2">
              <label for="fb-message" class="text-sm font-medium text-paper">Deine Nachricht</label>
              <textarea id="fb-message" name="message" rows="4" required class="form-input resize-none"></textarea>
            </div>
          </div>
          <div class="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              class="pressable inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 font-semibold text-on-accent transition-colors hover:bg-brand-rich"
            >
              Absenden
              ${icon('arrow-right', 'size-4')}
            </button>
            <p id="fb-status" role="status" aria-live="polite" class="text-sm text-muted"></p>
          </div>
        </form>
      </div>
    </div>
  </section>`
}

export { ratingCtaPrimary, ratingCtaSecondary }

export function renderFooter(): string {
  const year = new Date().getFullYear()
  return `
  <footer class="border-t border-hairline">
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <a href="#home" class="flex items-center gap-2 font-display text-lg font-bold text-paper">
          <img src="/logo-mark.png" alt="Alea Spielbar" class="size-9" width="256" height="256" />
          Alea<span class="text-brand-text">.</span>
        </a>
        <p class="mt-4 max-w-[28ch] text-sm leading-relaxed text-muted">
          Die Spielbar, in der jeder Abend anders gewürfelt wird.
        </p>
        <div class="mt-5 flex gap-3">
          <a href="${contact.instagramHref}" target="_blank" rel="noopener noreferrer" aria-label="Alea Spielbar auf Instagram" class="flex size-9 items-center justify-center rounded-pill border border-hairline text-muted hover:text-paper">
            ${icon('instagram-logo', 'size-4')}
          </a>
          <a href="${contact.discordHref}" target="_blank" rel="noopener noreferrer" aria-label="Alea Spielbar auf Discord" class="flex size-9 items-center justify-center rounded-pill border border-hairline text-muted hover:text-paper">
            ${icon('discord-logo', 'size-4')}
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
          <li><a href="${contact.mailHref}" class="hover:text-paper">${contact.email}</a></li>
          <li><a href="#medienberichte" class="hover:text-paper">Medienberichte</a></li>
          <li><a href="#/impressum" class="hover:text-paper">Impressum</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-hairline px-6 py-6 text-center text-xs text-faint">
      © ${year} ${contact.company} · Zürich
    </div>
  </footer>`
}

export function renderImpressumPage(): string {
  return `
  <section class="mx-auto max-w-3xl px-6 py-24 md:py-32">
    <a href="#home" class="pressable inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:underline">
      ${icon('arrow-left', 'size-4')} Zurück zur Startseite
    </a>
    <h1 class="mt-6 text-balance font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">Impressum</h1>

    <div class="mt-10 flex flex-col gap-8">
      <div>
        <h2 class="font-display text-lg font-semibold text-paper">Firma</h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          ${impressum.company}<br />
          ${impressum.address}
        </p>
      </div>
      <div>
        <h2 class="font-display text-lg font-semibold text-paper">Kontakt</h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          <a href="mailto:${impressum.email}" class="hover:text-paper">${impressum.email}</a>
        </p>
      </div>
      <div>
        <h2 class="font-display text-lg font-semibold text-paper">Handelsregister</h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          UID: ${impressum.uid}<br />
          MWST-Nr.: ${impressum.vat}
        </p>
      </div>
      <div>
        <h2 class="font-display text-lg font-semibold text-paper">Vertretungsberechtigte Personen</h2>
        <ul class="mt-2 text-sm leading-relaxed text-muted">
          ${impressum.representatives.map((name) => `<li>${name}</li>`).join('')}
        </ul>
      </div>
    </div>
  </section>`
}
