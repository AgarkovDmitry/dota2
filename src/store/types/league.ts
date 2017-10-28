
class _League {
  id: number
  name: string
  tier: number

  constructor(league) {
    this.id = league.leagueid
    this.name = league.name
    this.tier = league.tier
  }
}

declare global{
  class League extends _League{ }
}

export default _League