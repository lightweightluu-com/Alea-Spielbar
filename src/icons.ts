import mapPin from '@phosphor-icons/core/assets/regular/map-pin.svg?raw'
import clock from '@phosphor-icons/core/assets/regular/clock.svg?raw'
import calendar from '@phosphor-icons/core/assets/regular/calendar.svg?raw'
import usersThree from '@phosphor-icons/core/assets/regular/users-three.svg?raw'
import beerStein from '@phosphor-icons/core/assets/regular/beer-stein.svg?raw'
import cards from '@phosphor-icons/core/assets/regular/cards.svg?raw'
import gameController from '@phosphor-icons/core/assets/regular/game-controller.svg?raw'
import puzzlePiece from '@phosphor-icons/core/assets/regular/puzzle-piece.svg?raw'
import trophy from '@phosphor-icons/core/assets/regular/trophy.svg?raw'
import sparkle from '@phosphor-icons/core/assets/regular/sparkle.svg?raw'
import star from '@phosphor-icons/core/assets/regular/star.svg?raw'
import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw'
import instagramLogo from '@phosphor-icons/core/assets/regular/instagram-logo.svg?raw'
import discordLogo from '@phosphor-icons/core/assets/regular/discord-logo.svg?raw'
import googleLogo from '@phosphor-icons/core/assets/regular/google-logo.svg?raw'
import envelopeSimple from '@phosphor-icons/core/assets/regular/envelope-simple.svg?raw'
import ticket from '@phosphor-icons/core/assets/regular/ticket.svg?raw'
import martini from '@phosphor-icons/core/assets/regular/martini.svg?raw'
import forkKnife from '@phosphor-icons/core/assets/regular/fork-knife.svg?raw'
import list from '@phosphor-icons/core/assets/regular/list.svg?raw'
import x from '@phosphor-icons/core/assets/regular/x.svg?raw'
import diceFive from '@phosphor-icons/core/assets/bold/dice-five-bold.svg?raw'
import sun from '@phosphor-icons/core/assets/regular/sun.svg?raw'
import moonStars from '@phosphor-icons/core/assets/regular/moon-stars.svg?raw'
import navigationArrow from '@phosphor-icons/core/assets/regular/navigation-arrow.svg?raw'
import checkCircle from '@phosphor-icons/core/assets/regular/check-circle.svg?raw'
import warningCircle from '@phosphor-icons/core/assets/regular/warning-circle.svg?raw'
import spinner from '@phosphor-icons/core/assets/regular/spinner-gap.svg?raw'

const registry = {
  'map-pin': mapPin,
  clock,
  calendar,
  'users-three': usersThree,
  'beer-stein': beerStein,
  cards,
  'game-controller': gameController,
  'puzzle-piece': puzzlePiece,
  trophy,
  sparkle,
  star,
  'arrow-right': arrowRight,
  'instagram-logo': instagramLogo,
  'discord-logo': discordLogo,
  'google-logo': googleLogo,
  'envelope-simple': envelopeSimple,
  ticket,
  martini,
  'fork-knife': forkKnife,
  menu: list,
  close: x,
  'dice-five': diceFive,
  sun,
  'moon-stars': moonStars,
  'navigation-arrow': navigationArrow,
  'check-circle': checkCircle,
  'warning-circle': warningCircle,
  spinner,
} as const

export type IconName = keyof typeof registry

/** Inlines an official Phosphor icon as an SVG string with the given utility classes applied. */
export function icon(name: IconName, className = 'size-5'): string {
  return registry[name].replace('<svg ', `<svg class="${className}" aria-hidden="true" `)
}
