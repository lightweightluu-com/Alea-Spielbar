import type { IconName } from './icons'

export const nav = [
  { label: 'Konzept', href: '#konzept' },
  { label: 'Spiele', href: '#spiele' },
  { label: 'Events', href: '#events' },
  { label: 'Kontakt', href: '#kontakt' },
] as const

export const quickFacts: { icon: IconName; label: string }[] = [
  { icon: 'ticket', label: 'CHF 7 Eintritt, ganz ohne Zeitlimit' },
  { icon: 'cards', label: '180+ Spiele im Regal' },
  { icon: 'users-three', label: '2–20 Spieler, auch in privaten Räumen' },
  { icon: 'clock', label: 'Di–So geöffnet, Montag Ruhetag' },
]

export const steps: { title: string; desc: string }[] = [
  {
    title: 'Eintreten',
    desc: 'CHF 7 Spielmiete pro Person, ganz ohne Zeitlimit — egal ob ihr ein Spiel testet oder euch durch mehrere probiert.',
  },
  {
    title: 'Spiel wählen',
    desc: 'Über 180 Titel im Regal, nach Spielerzahl und Dauer sortiert. Ihr dürft auch euer eigenes Brettspiel, Kartendeck oder eure TTRPG-Kampagne mitbringen.',
  },
  {
    title: 'Loslegen',
    desc: 'Regel unklar? Ein Spielpate setzt sich zwei Minuten dazu, dann seid ihr allein.',
  },
]

export const gameCategories: {
  title: string
  desc: string
  icon: IconName
  tint: 'brand' | 'sage' | 'tan' | 'surface'
  featured?: boolean
}[] = [
  {
    title: 'Strategie & Vielspieler',
    desc: 'Von Siedler-Klassikern bis zu modernen Euro-Games mit Tiefgang und langem Nachhall.',
    icon: 'dice-five',
    tint: 'brand',
    featured: true,
  },
  {
    title: 'Party & Casual',
    desc: 'Schnell erklärt, laut gelacht — perfekt für große Runden.',
    icon: 'sparkle',
    tint: 'sage',
  },
  {
    title: 'Klassiker & Familie',
    desc: 'Kniffel, Rommé & Co. für den entspannten Abend.',
    icon: 'cards',
    tint: 'tan',
  },
  {
    title: 'Rollenspiele & Koop',
    desc: 'Pen-&-Paper-Kampagnen in der Hobbit- oder Drachenhöhle, dazu kooperative Spiele mit Fluchtraum-Feeling.',
    icon: 'puzzle-piece',
    tint: 'surface',
  },
]

export const menuHighlights: { icon: IconName; label: string }[] = [
  { icon: 'martini', label: 'Cocktailklassiker: Negroni, Gin Tonic, Aperol Spritz' },
  { icon: 'beer-stein', label: 'Bier Paul vom Fass, dazu Wein & Met' },
  { icon: 'fork-knife', label: 'Grilled Cheese Sandwich — unser Favorit' },
]

export const events: { day: string; title: string; desc: string; icon: IconName }[] = [
  {
    day: 'Jeden 2. Dienstag',
    title: 'MTG Commander Night',
    desc: 'Ab 19 Uhr treffen sich Magic-Fans zum Commander-Format — bringt gerne ein Extra-Deck für Neueinsteiger mit.',
    icon: 'cards',
  },
  {
    day: 'Donnerstags',
    title: 'Blood on the Clocktower',
    desc: 'Sozial-Deduktion im Dorf Rabenholz: Wer ist der Dämon unter euch? Ab 19 Uhr.',
    icon: 'users-three',
  },
  {
    day: 'Sonntags',
    title: 'Mitspieler-Roulette',
    desc: 'Zufällig verloste Spiele und Teams — perfekt, um neue Spiele und neue Leute kennenzulernen.',
    icon: 'sparkle',
  },
  {
    day: '1× im Monat',
    title: 'Quiznight',
    desc: 'Team-Trivia mit wechselnden Themen und Mini-Games, ab 19:30 Uhr.',
    icon: 'trophy',
  },
  {
    day: 'Auf Anfrage',
    title: 'Geburtstag & Gruppen',
    desc: 'Eigener Raum, Snacks und ein Spielpate nur für eure Runde.',
    icon: 'ticket',
  },
]

/** Real opening hours (alea-spielbar.ch/location-oeffnungszeiten), grouped by identical hours. */
export const hours: { days: string; time: string }[] = [
  { days: 'Di, Do, Fr', time: '16:00 – 23:00' },
  { days: 'Mi, Sa', time: '13:00 – 23:00' },
  { days: 'So', time: '13:00 – 20:00' },
  { days: 'Montag', time: 'Geschlossen' },
]

/**
 * The bar's two bookable back rooms (alea-spielbar.ch/reservation). The main floor needs no
 * reservation; these are the actual cases where booking ahead matters, and double as the
 * "Anliegen" options in the contact/reservation form.
 */
export const rooms: { id: string; name: string; desc: string }[] = [
  {
    id: 'hauptbereich',
    name: 'Tisch im Hauptbereich',
    desc: 'Meist ohne Reservation möglich — an Wochenenden oder mit großen Gruppen lieber kurz anfragen.',
  },
  {
    id: 'hobbithoehle',
    name: 'Spielraum „Hobbithöhle“',
    desc: '10 m², ein Tisch für bis zu 8 Personen. CHF 10 / Stunde. Beliebt für Pen-&-Paper-Runden.',
  },
  {
    id: 'drachenhoehle',
    name: 'Spielraum „Drachenhöhle“',
    desc: '23 m², zwei Tische für bis zu 20 Personen. CHF 20 / Stunde.',
  },
  {
    id: 'gutschein',
    name: 'Gutschein bestellen',
    desc: 'Gutscheine zu CHF 20, 50 oder 100 — gültig für Spielmiete, Getränke, Essen und Raummiete. Menge und Werte einfach in der Nachricht angeben, ihr bekommt sie als PDF per Mail.',
  },
  {
    id: 'allgemein',
    name: 'Allgemeine Frage',
    desc: 'Nichts davon trifft es? Schreibt uns einfach, worum es geht.',
  },
]

export const contact = {
  company: 'Alea Spielbar AG',
  /** Public-facing name used in marketing copy — the legal name above stays reserved for the footer's copyright line. */
  brandName: 'Alea Brettspiel Café & Bar',
  address: 'Zschokkestrasse 1, 8037 Zürich',
  hint: 'Bushaltestelle Rosengartenstrasse (33/72/83), 3 Min. ab Bahnhof Hardbrücke.',
  email: 'info@alea-spielbar.ch',
  mailHref: 'mailto:info@alea-spielbar.ch',
  instagramHref: 'https://www.instagram.com/alea.spielbar/',
  discordHref: 'https://alea-spielbar.ch/discord',
  /**
   * No API key needed. Uses Google's current "Share > Embed a map" iframe target directly
   * (skips the legacy `/maps?q=...&output=embed` shortcut, which now just 301-redirects here
   * anyway) — one fewer cross-origin hop for the iframe to clear, which matters in browsers/
   * previews that partition third-party storage per frame. See index.html's CSP meta tag,
   * which explicitly allows this frame-src; a strict default-src with no frame-src exception
   * is the most common reason this exact embed silently renders as "This content is blocked."
   */
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m3!2m1!1sAlea+Spielbar,+Zschokkestrasse+1,+8037+Z%C3%BCrich!6i16',
  /** The bar's real Google Maps place page — used for both "get directions" and "write a review". */
  mapsPlaceHref:
    'https://www.google.com/maps/place/Alea+Spielbar/@47.3953408,8.5257188,19z/data=!4m6!3m5!1s0x47900b0064bb47cb:0x353368f86edaab5b!8m2!3d47.3953408!4d8.5257188!16s%2Fg%2F11xh1dvwtj',
}
