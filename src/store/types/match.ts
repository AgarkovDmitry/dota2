import { observable, action, computed, createTransformer } from 'mobx'

import League from './league'
import Pick from './pick'
import Draft from './draft'
import Team from './team'
import Hero from './hero'

export default class {
  id: number
  duration: Date
  onsetTime: Date

  league: League

  direScore: number
  radiantScore: number

  direTeam: Team
  radiantTeam: Team

  winnerTeam: Team

  // @observable firstbloodTime: number

  // @observable radiantGoldAdv: Array<number>
  // @observable radiantExpAdv: Array<number>

  @observable picksbans: Array<Pick>
  @observable players: any
  // @observable teamfights: any

  @observable withExtra: boolean

  @computed get radiantPicks(): Array<Pick> {
    if (this.picksbans)
      return this.picksbans.filter(item => item.isPick && item.team.id == this.radiantTeam.id)
    else
      return []
  }

  @computed get radiantBans(): Array<Pick> {
    if (this.picksbans)
      return this.picksbans.filter(item => !item.isPick && item.team.id == this.radiantTeam.id)
    else
      return []
  }

  @computed get direPicks(): Array<Pick> {
    if (this.picksbans)
      return this.picksbans.filter(item => item.isPick && item.team.id == this.direTeam.id)
    else
      return []
  }

  @computed get direBans(): Array<Pick> {
    if (this.picksbans)
      return this.picksbans.filter(item => !item.isPick && item.team.id == this.direTeam.id)
    else
      return []
  }

  constructor(match, getLeague, getTeam) {
    // console.log(getTeam(match.dire_team_id))
    this.id = match.match_id
    this.duration = new Date(match.duration * 1000 - 10800000)
    this.onsetTime = new Date(match.start_time * 1000)

    this.league = getLeague(match.leagueid)

    this.direScore = match.dire_score
    this.radiantScore = match.radiant_score

    this.direTeam = getTeam(match.dire_team_id)
    this.radiantTeam = getTeam(match.radiant_team_id)

    this.winnerTeam = match.radiant_win ? this.radiantTeam : this.direTeam

    // this.firstbloodTime = null

    // this.radiantGoldAdv = null
    // this.radiantExpAdv = null

    this.picksbans = null
    this.players = null
    // this.teamfights = null

    this.withExtra = false

  }

  @action async loadExtra (match, getHero, getPlayer) {
    // this.firstbloodTime = match.first_blood_time

    // this.radiantGoldAdv = match.radiant_gold_adv
    // this.radiantExpAdv = match.radiant_xp_adv

    this.picksbans = match.picks_bans.map(item =>
      new Pick(item, getHero, getPlayer, this.direTeam, this.radiantTeam, match.players.find(player =>
        player.hero_id == item.hero_id
      ))
    )
    this.players = match.players
    // this.teamfights = match.teamfights

    this.withExtra = true
  }

  teamPicks = createTransformer((id: number): Array<Pick> => {
    return this.radiantTeam.id == id ? this.radiantPicks : this.direPicks
  })

  teamDraft = createTransformer((id: number): Draft => {
    return new Draft(this.teamPicks(id), this.id, this.winnerTeam.id == id)
  })

  didHeroWin = createTransformer((hero: Hero): boolean => {
    const pick = this.direPicks.find(pick => pick.hero.id == hero.id) || this.radiantPicks.find(pick => pick.hero.id == hero.id)
    if (pick)
      return this.winnerTeam.id == pick.team.id
    else
      return null
  })
}