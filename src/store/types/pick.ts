import Hero from './hero'
import Team from './team'
import Player from './player'

export default class Pick{
  isPick: boolean
  order: number
  hero: Hero
  team: Team
  player: Player

  constructor(pick, getHero, getPlayer, dire: Team, radiant: Team, player?: any) {
    this.isPick = pick.is_pick,
    this.order = pick.order,
    this.hero = getHero(pick.hero_id),
    this.team = (pick.team) ? dire : radiant
    this.player = player ? getPlayer(player.account_id) : null
  }
}