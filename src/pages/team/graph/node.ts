import { observable, action, computed } from 'mobx'

const styles = require('./style.scss')

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
  click: Function

  @observable drafts: Array<Draft> = []
  @observable selected: boolean = false

  constructor(hero, click) {
    this.hero = hero
    this.click = click
  }

  @computed get picks() { return this.drafts.length }
  @computed get wins() { return this.drafts.filter(draft => draft.win).length }
  @computed get winRate() { return this.wins / this.picks }

  @computed get id() { return this.hero.id }
  @computed get name() { return this.hero.name }
  @computed get icon() { return this.hero.icon }

  @computed get r() { return this.picks > 20 ? 35 : 25 + Math.ceil(this.picks / 2) }
  @computed get color() { return getWinRateColor(this.winRate) }
  @computed get array() { return this.selected ? this.r * Math.PI / 8 : 2 * Math.PI * this.r }
  @computed get offset() { return this.selected ? this.r * Math.PI : 0 }
  @computed get class() { return this.selected ? styles.selectedHero : styles.hero }

  @action removeOldDrafts = (drafts: Array<Draft>) => {
    drafts.map(draft => {
      const index = this.drafts.indexOf(draft)
      if (index > -1)
        this.drafts.splice(index, 1)
    })
  }

  @action appendNewDrafts = (drafts: Array<Draft>) => {
    this.drafts.push(
      ...drafts
      .filter(draft =>
        draft.picks.find(pick => pick.hero == this.hero)
        && !this.drafts.find(item => item == draft)
      )
    )
  }

  @action selection = (heroes: Array<Hero>) => {
    this.selected = !!heroes.find(hero => hero == this.hero)
  }
}