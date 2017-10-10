import { computed } from 'mobx'

import Pick from './pick'

export default class Draft{
  picks: Array<Pick>
  matchId: number
  win: boolean

  constructor(picks: Array<Pick>, matchId: number, win: boolean) {
    this.picks = picks
    this.matchId = matchId
    this.win = win
  }

  @computed get pairs() {
    return this.picks.sort((a, b) => a.hero.id - b.hero.id).reduce((res, pick, key) => {
      this.picks.filter((item, index) => index > key).map(item => {
        res.push({ target: pick, source: item, team: pick.team })
      })
      return res
    }, [])
  }
}