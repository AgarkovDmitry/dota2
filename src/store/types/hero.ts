import { computed } from 'mobx'

export default class Hero{
  id: number

  name: string

  icon: string
  img: string

  proBans: number
  proPicks: number
  proWins: number

  // 1000_pick: number
  // 1000_win: number
  // 2000_pick: number
  // 2000_win: number
  // 3000_pick: number
  // 3000_win: number
  // 4000_pick: number
  // 4000_win: number
  // 5000_pick: number
  // 5000_win: number

  // primary_attr: string

  // agi_gain: number
  // int_gain: number
  // str_gain: number

  // base_agi: number
  // base_int: number
  // base_str: number

  // base_health: number
  // base_health_regen: number
  // base_mana: number
  // base_mana_regen: number

  // attack_range: number
  // attack_rate: number
  // attack_type: string
  // base_armor: number
  // base_attack_max: number
  // base_attack_min: number
  // cm_enabled: boolean
  // move_speed: number

  // projectile_speed: number
  // roles: Array<string>
  // turn_rate: number

  @computed get proWinRate(): number {
    return parseInt((100 * this.proWins / this.proPicks).toFixed(0))
  }

  constructor(hero) {
    this.id = hero.hero_id

    this.name = hero.localized_name

    this.icon = 'https://api.opendota.com' + hero.icon
    this.img = 'https://api.opendota.com' + hero.img

    this.proBans = hero.pro_ban
    this.proPicks = hero.pro_pick
    this.proWins = hero.pro_win
  }
}