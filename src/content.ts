import type { IconName } from './icons'

export const nav = [
  { label: 'Konzept', href: '#konzept' },
  { label: 'Spiele', href: '#spiele' },
  { label: 'Events', href: '#events' },
  { label: 'Kontakt', href: '#kontakt' },
] as const

export const quickFacts: { icon: IconName; label: string }[] = [
  { icon: 'cards', label: '180+ Spiele im Regal' },
  { icon: 'users-three', label: '2–12 Spieler pro Tisch' },
  { icon: 'clock', label: 'Di–So geöffnet, Montag Ruhetag' },
]

export const steps: { title: string; desc: string }[] = [
  { title: 'Tisch wählen', desc: 'Ihr setzt euch hin, wo euch der Blick über das Regal am besten gefällt.' },
  { title: 'Spiel ziehen', desc: 'Nach Spielerzahl, Dauer oder Bauchgefühl sortiert — einfach mitnehmen.' },
  { title: 'Loslegen', desc: 'Regel unklar? Ein Spielpate setzt sich zwei Minuten dazu, dann seid ihr allein.' },
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
    title: 'Kooperativ & Rätsel',
    desc: 'Gemeinsam gegen das Spiel, Fluchtraum-Feeling inklusive.',
    icon: 'puzzle-piece',
    tint: 'surface',
  },
]

export const menuHighlights: { icon: IconName; label: string }[] = [
  { icon: 'martini', label: 'Signature-Cocktails' },
  { icon: 'beer-stein', label: 'Craft-Bier vom Fass' },
  { icon: 'fork-knife', label: 'Flammkuchen & Snacks' },
]

export const events: { day: string; title: string; desc: string; icon: IconName }[] = [
  {
    day: 'Dienstags',
    title: 'Quizabend',
    desc: 'Fünf Runden, ein Pokal, viele Ausreden für die falschen Antworten.',
    icon: 'ticket',
  },
  {
    day: 'Freitags',
    title: 'Turniernacht',
    desc: 'Wechselndes Spiel im K.-o.-Modus, der Sieger kommt aufs Brett an der Wand.',
    icon: 'trophy',
  },
  {
    day: '1× im Monat',
    title: 'Neuheiten-Testabend',
    desc: 'Frisch eingetroffene Spiele vorgestellt, kostenlos mitspielen.',
    icon: 'sparkle',
  },
  {
    day: 'Auf Anfrage',
    title: 'Geburtstag & Gruppen',
    desc: 'Eigener Tisch, Snacks und ein Spielpate nur für eure Runde.',
    icon: 'users-three',
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
    id: 'allgemein',
    name: 'Allgemeine Frage',
    desc: 'Nichts davon trifft es? Schreibt uns einfach, worum es geht.',
  },
]

export const contact = {
  company: 'Alea Spielbar AG',
  address: 'Zschokkestrasse 1, 8037 Zürich',
  hint: 'Bushaltestelle Rosengartenstrasse (33/72/83), 3 Min. ab Bahnhof Hardbrücke.',
  email: 'info@alea-spielbar.ch',
  mailHref: 'mailto:info@alea-spielbar.ch',
  instagramHref: 'https://www.instagram.com/alea.spielbar/',
  discordHref: 'https://alea-spielbar.ch/discord',
  /** No API key needed — Google's plain q= embed format, centered on the real address. */
  mapsEmbedSrc: 'https://www.google.com/maps?q=Alea+Spielbar%2C+Zschokkestrasse+1%2C+8037+Z%C3%BCrich&z=16&output=embed',
  /** The bar's real Google Maps place page — used for both "get directions" and "write a review". */
  mapsPlaceHref:
    'https://www.google.com/maps/place/Alea+Spielbar/@47.3953408,8.5257188,19z/data=!4m6!3m5!1s0x47900b0064bb47cb:0x353368f86edaab5b!8m2!3d47.3953408!4d8.5257188!16s%2Fg%2F11xh1dvwtj',
}
