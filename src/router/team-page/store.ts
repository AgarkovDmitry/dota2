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
      this.D3Team.render({
        info: this.heroesStats,
        selectedHeroes: this.selectedHeroes,
        selectHero: this.selectHero,
        styles
      })
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

  @computed get heroesStats() {
    let { nodes, links } = this.filteredMatches.reduce((res, match) => {
      const picks = (match.radiantTeam.id == this.team ? match.radiantPicks : match.direPicks).sort((a, b) => a.hero.id - b.hero.id)
      const win = +(match.winnerTeam.id == this.team)

      const nodes = picks.map(item => ({ hero: item.hero, win }) )

      const links = picks.reduce((res, item, index) => {
        let arr = picks.filter((pick, key) => key > index).map(pick => ({
            id: item.hero.id + '-' + pick.hero.id,
            source: item.hero,
            target: pick.hero,
            win
          })
        )

        return [...res, ...arr]
      }, [])

      return {
        nodes: [...res.nodes, ...nodes],
        links: [...res.links, ...links]
      }
    }, {
      nodes: [],
      links: []
    })

    nodes = nodes.reduce((res, item) => {
      const index = res.findIndex(node => node.hero.id == item.hero.id )

      if (index == -1) return [...res, { ...item, pick: 1 }]
      else return [
        ...res.filter((item, key) => key < index),
        { ...item, win: res[index].win + item.win, pick: res[index].pick + 1 },
        ...res.filter((item, key) => key > index)
      ]
    }, [])

    links = links.reduce((res, item) => {
      const index = res.findIndex(link => link.id == item.id)

      if (index == -1) return [...res, { ...item, pick: 1 }]
      else return [
        ...res.filter((item, key) => key < index),
        { ...item, win: res[index].win + item.win, pick: res[index].pick + 1 },
        ...res.filter((item, key) => key > index)
      ]
    }, [])

    return {
      nodes,
      links
    }
  }
}

export default Store