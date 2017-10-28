class _Pick {
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

declare global {
  class PickBan extends _Pick{}
}

export default _Pick