
export default class {
  id: number
  name: string
  tier: number

  constructor(league) {
    this.id = league.leagueid
    this.name = league.name
    this.tier = league.tier
  }
}