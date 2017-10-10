import { observable, action, computed } from 'mobx'

import Draft from 'store/types/draft'
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

  source: number
  target: number

  @observable drafts: Array<Draft> = []

  constructor(source: Hero, target: Hero) {
    this._source = source
    this._target = target
  }

  @computed get picks() { return this.drafts.length }
  @computed get wins() { return this.drafts.filter(draft => draft.win).length }
  @computed get winRate() { return this.wins / this.picks }

  @computed get id() { return this._source.id + '-' + this._target.id }

  @computed get opacity() { return this.picks * 0.2}
  @computed get color() { return getWinRateColor(this.winRate) }

  @action removeOldDrafts = (drafts: Array<Draft>, source: number, target: number) => {
    drafts.map(draft => {
      const index = this.drafts.findIndex(item => item == draft)
      if (index > -1) this.drafts.splice(index, 1)
    })

    if (source == -1 || target == -1)
      this.drafts = []
    else {
      this.source = source
      this.target = target

      drafts.map(draft => {
        const index = this.drafts.findIndex(item => item == draft)
        if (index > -1)
          this.drafts.splice(index, 1)
      })
    }
  }

  @action appendNewDrafts = (drafts: Array<Draft>, source: number, target: number) => {
    this.source = source
    this.target = target

    this.drafts.push(
      ...drafts
      .filter(draft =>
        draft.picks.find(pick => pick.hero == this._source)
        && draft.picks.find(pick => pick.hero == this._target)
        && !this.drafts.find(item => item == draft)
      )
    )
  }
}