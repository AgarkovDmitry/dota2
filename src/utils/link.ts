import { observable, action, computed } from 'mobx'

import Match from 'store/types/match'
import Hero from 'store/types/hero'

const getWinRateColor = (winRate: number) => {
  if (winRate <= 0.1) return '#FF0000'
  if (winRate <= 0.2) return '#FB3700'
  if (winRate <= 0.3) return '#F76D00'
  if (winRate <= 0.4) return '#F3A200'
  if (winRate <= 0.5) return '#EFD500'
  if (winRate <= 0.6) return '#D1EC00'
  if (winRate <= 0.7) return '#9AE800'
  if (winRate <= 0.8) return '#65E400'
  if (winRate <= 0.9) return '#31E000'
  if (winRate <= 1.0) return '#00DD00'
}

export default class Link {
  _source: Hero
  _target: Hero
  teamId: number

  source: number
  target: number

  @observable matches: Array<Match> = []

  constructor(source: Hero, target: Hero, teamId: number) {
    this._source = source
    this._target = target
    this.teamId = teamId
  }

  @computed get picks() { return this.matches.length }
  @computed get wins() { return this.matches.filter(match => match.didHeroWin(this._source)).length }
  @computed get winRate() { return this.wins / this.picks }

  @computed get id() { return this._source.id + '-' + this._target.id }

  @computed get opacity() { return this.picks * 0.2}
  @computed get color() { return getWinRateColor(this.winRate) }

  @action removeOldMatches = (matches: Array<Match>, source: number, target: number) => {
    if (source == -1 || target == -1)
      this.matches = []
    else {
      this.source = source
      this.target = target

      matches.map(match => {
        const index = this.matches.findIndex(item => item == match)
        if (index > -1)
          this.matches.splice(index, 1)
      })
    }
  }

  @action appendNewMatches = (matches: Array<Match>, source: number, target: number) => {
    this.source = source
    this.target = target

    this.matches.push(
      ...matches
      .filter(match =>
        match.teamPicks(this.teamId).find(pick => pick.hero == this._source)
        && match.teamPicks(this.teamId).find(pick => pick.hero == this._target)
        && !this.matches.find(item => item == match)
      )
    )
  }
}