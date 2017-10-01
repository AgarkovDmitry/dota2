import Hero from './hero'
import Team from './team'

export default class Pick{
  isPick: boolean
  order: number
  hero: Hero
  team: Team

  constructor(pick, getHero, dire: Team, radiant: Team) {
    this.isPick = pick.is_pick,
    this.order = pick.order,
    this.hero = getHero(pick.hero_id),
    this.team = (pick.team) ? dire : radiant
  }
}