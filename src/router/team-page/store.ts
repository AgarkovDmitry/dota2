import { observable, action, computed, createTransformer } from 'mobx'

import getHeroesStats from 'utils/get-heroes-stats'

const filterMatches = (matches, ids) => {
  return matches.filter(match =>
    ids.reduce((a, b) => a || match.match_id == b, false)
  )
}

class Store {
  @observable heroes: any
  @observable matches: any

  team_id: number

  @observable selectedHero: number = 0

  constructor(team_id, { matches, heroes }) {
    this.team_id = team_id
    this.matches = matches
    this.heroes = heroes
  }

  @computed get filteredMatches() {
    let data = this.matches.data

    data = data.filter(item => item.dire_team_id == this.team_id || item.radiant_team_id == this.team_id)
    if (this.selectedHero) data = data.filter(item => {
      const team = item.dire_team_id == this.team_id ? 1 : 0
      return item.picks_bans.reduce((res, item) => res || item.team == team && item.is_pick == true && item.hero_id == this.selectedHero, false)
    })

    return data
  }

  @action selectHero = (id) => this.selectedHero = (this.selectedHero == id) ? 0 : id

  @computed get heroesStats() {
    const team_id = this.team_id
    const filteredMatches = this.filteredMatches

    const singleHeroStats = this.heroes.data
    .map(hero => getHeroesStats(filteredMatches, [hero.id], team_id))
    .filter(item => item.picks > 0)

    const pairHeroStats = singleHeroStats
    .map((singleHero, index) =>
      singleHeroStats
      .filter((item, key) => key > index)
      .map(hero =>
        getHeroesStats(filterMatches(filteredMatches, singleHero.matches), [...singleHero.heroes, ...hero.heroes], team_id)
      )
      .filter(item => item.picks > 0)
    )
    .filter(item => item.length)
    .reduce((a, b) => [...a, ...b], [])

    return {
      singleHeroStats,
      pairHeroStats
    }
  }

  getHero = createTransformer((id: number) => {
    return this.heroes.data.find(item => item.id == id)
  })

  convertInfo = createTransformer((className: string) => {
    const info = this.heroesStats
    const selectedHero = this.selectedHero
    const selectHero = this.selectHero

    const nodes = info.singleHeroStats.map(item => ({
      label: `${this.getHero(item.heroes[0]).localized_name}`,
      r: item.picks > 20 ? 25 : 25 + 0.5 * item.picks,
      color: item.winRate > 0.5 ? 'green' : 'red',
      id: item.heroes[0],
      src: `https://api.opendota.com${this.getHero(item.heroes[0]).icon}`,
      array: item.heroes[0] == selectedHero ? (item.picks > 20 ? 25 : 25 + 0.5 * item.picks) * Math.PI / 8 : 0,
      offset: item.heroes[0] == selectedHero ? (item.picks > 20 ? 25 : 25 + 0.5 * item.picks) * Math.PI : 0,
      class: item.heroes[0] == selectedHero ? className : '',
      opacity: 1,
      onClick: () => selectHero(item.heroes[0])
    }))

    const links = info.pairHeroStats.map(item => ({
      source: nodes.findIndex(node => node.id == item.heroes[0]),
      target: nodes.findIndex(node => node.id == item.heroes[1]),
      color: item.winRate > 0.5 ? 'green' : 'red',
      width: 3,
      opacity: item.picks * 0.1,
      label: `${item.winRate * 100}% - ${item.picks} picks`
    }))

    return { nodes, links }
  })
}

export default Store