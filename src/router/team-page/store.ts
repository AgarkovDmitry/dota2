import { observable, action, computed, autorun } from 'mobx'

import D3Team from 'utils/d3-team'

const styles = require('./style.scss')

import Match from 'store/types/match'
import Hero from 'store/types/hero'
import DataStore from 'store/data-store'

class Store {
  @observable data: DataStore
  team: number

  @observable selectedHeroes: Array<Hero>
  D3Team: D3Team

  constructor(team, data: DataStore) {
    this.team = team
    this.data = data
    this.selectedHeroes = []
    this.D3Team = new D3Team()

    this.fetch()

    autorun(() => {
      if (!this.data.loadingMatches)
        this.D3Team.render({
          selectedHeroes: this.selectedHeroes,
          selectHero: this.selectHero,
          styles
        }, this.filteredMatches, this.team)
    })
  }

  @action setTeam = (id: number) => {
    this.team = id
    this.selectedHeroes = []

    this.fetch()
  }

  @action fetch = async() => {
    this.data.loadHeroes()
    await this.data.loadTeams()
    this.data.loadLeagues()
    this.data.loadPlayers()
    this.data.loadMatchesWithExtras(5, true, { team: this.team })
  }

  @computed get filteredMatches(): Array<Match> {
    return this.data.getMatches({ team: this.team, loaded: true, heroes: this.selectedHeroes })
  }

  @action selectHero = (hero) => {
    this.selectedHeroes.find(item => item.id == hero.id)
    ? this.selectedHeroes = this.selectedHeroes.filter(item => item.id != hero.id)
    : this.selectedHeroes.push(hero)
  }
}

export default Store