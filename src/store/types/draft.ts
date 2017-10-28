import { computed } from 'mobx'

import Pick from './pick'
import Team from './team'

class _Draft {
  picks: Array<Pick>
  matchId: number
  win: boolean
  team: Team

  constructor(picks: Array<Pick>, matchId: number, win: boolean, team: Team) {
    this.picks = picks
    this.matchId = matchId
    this.win = win
    this.team = team
  }

  @computed get pairs() {
    return this.picks.sort((a, b) => a.hero.id - b.hero.id).reduce((res, pick, key) => {
      this.picks.filter((item, index) => index > key).map(item => {
        res.push({ target: pick, source: item, team: this.team })
      })
      return res
    }, [])
  }
}

declare global{
  class Draft extends _Draft{ }
}

export default _Draft