import { computed, createTransformer } from 'mobx'

import Match from './match'
import Team from './team'
import PickBan from './pick'
import Draft from './draft'

class _FullMatch {
  match: Match

  // @observable firstbloodTime: number

  // @observable radiantGoldAdv: Array<number>
  // @observable radiantExpAdv: Array<number>

  picksbans: Array<PickBan>
  players: any
  // @observable teamfights: any

  @computed get id(): number {
    return this.match.id
  }

  @computed get radiantTeam() {
    return this.match.radiantTeam
  }

  @computed get direTeam() {
    return this.match.direTeam
  }

  @computed get winnerTeam() {
    return this.match.winnerTeam
  }

  @computed get league() {
    return this.match.league
  }

  @computed get radiantPicks() {
    if (this.picksbans)
      return this.picksbans.filter(item => item.isPick && item.team.id == this.radiantTeam.id)
    else
      return []
  }

  @computed get radiantBans() {
    if (this.picksbans)
      return this.picksbans.filter(item => !item.isPick && item.team.id == this.radiantTeam.id)
    else
      return []
  }

  @computed get direPicks() {
    if (this.picksbans)
      return this.picksbans.filter(item => item.isPick && item.team.id == this.direTeam.id)
    else
      return []
  }

  @computed get direBans() {
    if (this.picksbans)
      return this.picksbans.filter(item => !item.isPick && item.team.id == this.direTeam.id)
    else
      return []
  }

  constructor(match: Match, extra, getHero: (number) => Hero, getPlayer: (number) => Player) {
    this.match = match
    // this.firstbloodTime = match.first_blood_time

    // this.radiantGoldAdv = match.radiant_gold_adv
    // this.radiantExpAdv = match.radiant_xp_adv

    this.picksbans = extra.picks_bans.map(item =>
      new PickBan(item, getHero, getPlayer, this.direTeam, this.radiantTeam, extra.players.find(player =>
        player.hero_id == item.hero_id
      ))
    )
    this.players = extra.players
    // this.teamfights = match.teamfights
  }

  teamPicks = createTransformer((team: Team) => {
    return this.radiantTeam == team ? this.radiantPicks : this.direPicks
  })

  teamDraft = createTransformer((team: Team) => {
    return new Draft(this.teamPicks(team), this.id, this.winnerTeam == team, team)
  })

  didHeroWin = createTransformer((hero: Hero) => {
    const PickBan = this.direPicks.find(PickBan => PickBan.hero.id == hero.id) || this.radiantPicks.find(PickBan => PickBan.hero.id == hero.id)
    if (PickBan)
      return this.winnerTeam.id == PickBan.team.id
    else
      return null
  })
}

declare global {
  class FullMatch extends _FullMatch { }
}

export default _FullMatch