import { computed } from 'mobx'

export default class {
  id: number
  tag: string
  name: string
  wins: number
  losses: number

  @computed get winRate() {
    return (this.wins * 100 / (this.wins + this.losses)).toFixed(2)
  }

  constructor(team) {
    this.id = team.team_id
    this.tag = team.tag
    this.name = team.name
    this.wins = team.wins
    this.losses = team.losses
  }
}