// import { computed } from 'mobx'

export default class {
  id: number
  avatar: string
  avatarfull: string
  avatarmedium: string
  // cheese: number
  countryCode: string
  // fantasyRole: number
  name: string
  // profileurl: string

  team: number

  constructor(player) {
    this.id = player.account_id
    this.avatar = player.avatar
    this.avatarfull = player.avatarfull
    this.avatarmedium = player.avatarmedium
    this.countryCode = player.countryCode
    this.name = player.name
    this.team = player.team
  }
}