import { observable, action, computed } from 'mobx'

import Match from 'store/types/match'
import Hero from 'store/types/hero'

const getWinRateColor = (winRate: number) => {
  if (winRate <= 0.1) return '#E0441D'
  if (winRate <= 0.2) return '#DB631F'
  if (winRate <= 0.3) return '#D68020'
  if (winRate <= 0.4) return '#D29C22'
  if (winRate <= 0.5) return '#CDB523'
  if (winRate <= 0.6) return '#C4C824'
  if (winRate <= 0.7) return '#A5C425'
  if (winRate <= 0.8) return '#88BF26'
  if (winRate <= 0.9) return '#6DBA27'
  if (winRate <= 1.0) return '#54B628'
}

export default class Node {
  hero: Hero
  teamId: number

  click: Function
  styles: any

  @observable matches: Array<Match> = []
  @observable selected: boolean = false

  constructor(hero, teamId, click, styles) {
    this.hero = hero
    this.teamId = teamId
    this.click = click
    this.styles = styles
  }

  @computed get picks() { return this.matches.length }
  @computed get wins() { return this.matches.filter(match => match.didHeroWin(this.hero)).length }
  @computed get winRate() { return this.wins / this.picks }

  @computed get id() { return this.hero.id }
  @computed get name() { return this.hero.name }
  @computed get icon() { return this.hero.icon }

  @computed get r() { return this.picks > 20 ? 35 : 25 + Math.ceil(this.picks / 2) }
  @computed get color() { return getWinRateColor(this.winRate) }
  @computed get array() { return this.selected ? this.r * Math.PI / 8 : 2 * Math.PI * this.r }
  @computed get offset() { return this.selected ? this.r * Math.PI : 0 }
  @computed get class() { return this.selected ? this.styles.selectedHero : this.styles.hero }

  @action removeOldMatches = (matches: Array<Match>) => {
    matches.map(match => {
      const index = this.matches.findIndex(item => item == match)
      if (index > -1)
        this.matches.splice(index, 1)
    })
  }

  @action appendNewMatches = (matches: Array<Match>) => {
    this.matches.push(
      ...matches
      .filter(match =>
        match.teamPicks(this.teamId).find(pick => pick.hero == this.hero)
        && !this.matches.find(item => item == match)
      )
    )
  }

  @action selection = (heroes: Array<Hero>) => {
    this.selected = !!heroes.find(hero => hero == this.hero)
  }
}