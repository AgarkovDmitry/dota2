import { observable, action, computed } from 'mobx'
import api from 'api'

import Pick = require('typings/pick')

export default class {
  id: number
  duration: number
  onsetTime: number

  leagueId: number
  leagueName: string

  direScore: number
  radiantScore: number

  direTeam: number
  radiantTeam: number

  direTeamName: number
  radiantTeamName: number

  winnerTeam: number

  @observable firstbloodTime: number

  @observable radiantGoldAdv: Array<number>
  @observable radiantExpAdv: Array<number>

  @observable picksbans: Array<Pick>
  @observable players: any
  @observable teamfights: any

  @observable withExtra: boolean

  @computed get radiantPicks() {
    if (this.picksbans)
      return this.picksbans.filter(item => item.isPick && item.team == this.radiantTeam)
    else
      return []
  }

  @computed get radiantBans() {
    if (this.picksbans)
      return this.picksbans.filter(item => !item.isPick && item.team == this.radiantTeam)
    else
      return []
  }

  @computed get direPicks() {
    if (this.picksbans)
      return this.picksbans.filter(item => item.isPick && item.team == this.direTeam)
    else
      return []
  }

  @computed get direBans() {
    if (this.picksbans)
      return this.picksbans.filter(item => !item.isPick && item.team == this.direTeam)
    else
      return []
  }

  constructor(match) {
    this.id = match.match_id
    this.duration = match.duration
    this.onsetTime = match.start_time

    this.leagueId = match.leagueid
    this.leagueName = match.league_name

    this.direScore = match.dire_score
    this.radiantScore = match.radiant_score

    this.direTeam = match.dire_team_id
    this.radiantTeam = match.radiant_team_id

    this.direTeamName = match.dire_name
    this.radiantTeamName = match.radiant_name

    this.winnerTeam = match.radiant_win ? match.radiant_team_id : match.dire_team_id

    this.firstbloodTime = null

    this.radiantGoldAdv = null
    this.radiantExpAdv = null

    this.picksbans = null
    this.players = null
    this.teamfights = null

    this.withExtra = false
  }

  @action async loadExtra () {
    if (this.withExtra == false) {
      const match = await api.fetchMatchInfo(this.id)

      this.firstbloodTime = match.first_blood_time

      this.radiantGoldAdv = match.radiant_gold_adv
      this.radiantExpAdv = match.radiant_xp_adv

      this.picksbans = match.picks_bans.map(item => ({
        isPick: item.is_pick,
        order: item.order,
        hero: item.hero_id,
        team: (item.team) ? this.direTeam : this.radiantTeam
      }))
      this.players = match.players
      this.teamfights = match.teamfights

      this.withExtra = true
    }
  }
}