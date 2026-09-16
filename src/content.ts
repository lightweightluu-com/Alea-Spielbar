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
  { icon: 'clock', label: 'Di–So ab 16 Uhr geöffnet' },
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
  tint: 'coral' | 'teal' | 'gold' | 'surface'
  featured?: boolean
}[] = [
  {
    title: 'Strategie & Vielspieler',
    desc: 'Von Siedler-Klassikern bis zu modernen Euro-Games mit Tiefgang und langem Nachhall.',
    icon: 'dice-five',
    tint: 'coral',
    featured: true,
  },
  {
    title: 'Party & Casual',
    desc: 'Schnell erklärt, laut gelacht — perfekt für große Runden.',
    icon: 'sparkle',
    tint: 'teal',
  },
  {
    title: 'Klassiker & Familie',
    desc: 'Kniffel, Rommé & Co. für den entspannten Abend.',
    icon: 'cards',
    tint: 'gold',
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

export const hours: { days: string; time: string }[] = [
  { days: 'Di – Do', time: '16:00 – 00:00' },
  { days: 'Fr – Sa', time: '14:00 – 02:00' },
  { days: 'So', time: '14:00 – 22:00' },
  { days: 'Montag', time: 'Ruhetag' },
]

export const testimonials: { quote: string; name: string; role: string; seed: string }[] = [
  {
    quote:
      'Wir kamen für ein Bier und blieben für Azul. Das Team erklärt Regeln, ohne dass es nach Schule klingt.',
    name: 'Mira K.',
    role: 'Stammgast seit 2019',
    seed: 'alea-guest-mira',
  },
  {
    quote:
      'Beste Location für unseren wöchentlichen Spieleabend. Immer ein Tisch frei, immer ein Geheimtipp parat.',
    name: 'Jonas T.',
    role: 'Spieleabend-Organisator',
    seed: 'alea-guest-jonas',
  },
  {
    quote: 'Als Erstbesucherin war ich in fünf Minuten mittendrin. Kein Spiel wurde mir zu kompliziert erklärt.',
    name: 'Lea B.',
    role: 'Erstbesucherin',
    seed: 'alea-guest-lea',
  },
]

export const contact = {
  address: 'Würfelgasse 7, 04109 Leipzig',
  hint: 'Zwei Minuten von der Tramhaltestelle Augustusplatz.',
  phone: '+49 341 22 33 010',
  phoneHref: 'tel:+493412233010',
  email: 'hallo@alea-spielbar.de',
  mailHref:
    'mailto:hallo@alea-spielbar.de?subject=Tischreservierung&body=Hallo%20Alea-Team%2C%0A%0Aich%20m%C3%B6chte%20gerne%20einen%20Tisch%20reservieren%3A%0ADatum%3A%20%0AUhrzeit%3A%20%0APersonenanzahl%3A%20%0A%0AViele%20Gr%C3%BC%C3%9Fe',
}
