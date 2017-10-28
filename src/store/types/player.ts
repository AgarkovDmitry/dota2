// import { computed } from 'mobx'
import Team from './team'

class _Player{
  id: number
  avatar: string
  avatarfull: string
  avatarmedium: string
  // cheese: number
  countryCode: string
  // fantasyRole: number
  name: string
  // profileurl: string

  team: Team

  constructor(player, getTeam: (number) => Team) {
    this.id = player.account_id
    this.avatar = player.avatar
    this.avatarfull = player.avatarfull
    this.avatarmedium = player.avatarmedium
    this.countryCode = player.countryCode
    this.name = player.name
    this.team = getTeam(player.team_id)
  }
}

declare global{
  class Player extends _Player{ }
}

export default _Player