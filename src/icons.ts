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
import facebookLogo from '@phosphor-icons/core/assets/regular/facebook-logo.svg?raw'
import envelopeSimple from '@phosphor-icons/core/assets/regular/envelope-simple.svg?raw'
import phone from '@phosphor-icons/core/assets/regular/phone.svg?raw'
import ticket from '@phosphor-icons/core/assets/regular/ticket.svg?raw'
import martini from '@phosphor-icons/core/assets/regular/martini.svg?raw'
import forkKnife from '@phosphor-icons/core/assets/regular/fork-knife.svg?raw'
import list from '@phosphor-icons/core/assets/regular/list.svg?raw'
import x from '@phosphor-icons/core/assets/regular/x.svg?raw'
import diceFive from '@phosphor-icons/core/assets/bold/dice-five-bold.svg?raw'

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
  'facebook-logo': facebookLogo,
  'envelope-simple': envelopeSimple,
  phone,
  ticket,
  martini,
  'fork-knife': forkKnife,
  menu: list,
  close: x,
  'dice-five': diceFive,
} as const

export type IconName = keyof typeof registry

/** Inlines an official Phosphor icon as an SVG string with the given utility classes applied. */
export function icon(name: IconName, className = 'size-5'): string {
  return registry[name].replace('<svg ', `<svg class="${className}" aria-hidden="true" `)
}
