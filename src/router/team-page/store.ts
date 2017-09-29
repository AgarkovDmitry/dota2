import { observable, action, computed, autorun } from 'mobx'

import D3Team from 'utils/d3-team'

const styles = require('./style.scss')

import Match from 'store/types/match'

class Store {
  @observable data: any
  team: number

  @observable selectedHeroes: Array<number>
  D3Team: D3Team

  constructor(team, data) {
    this.team = team
    this.data = data
    this.selectedHeroes = []
    this.D3Team = new D3Team()

    this.data.loadMatchesWithExtras(5, true, { team: team })
    this.data.loadHeroes()
    this.data.loadPlayers()
    this.data.loadTeams()

    autorun(() => {
      this.D3Team.render({
        info: this.heroesStats,
        selectedHeroes: this.selectedHeroes,
        selectHero: this.selectHero,
        getHero: this.data.getHero,
        styles
      })
    })
  }

  @computed get filteredMatches(): Array<Match> {
    return this.data.getMatches({ team: this.team, loaded: true, heroes: this.selectedHeroes })
  }

  @action selectHero = (id) => {
    this.selectedHeroes.includes(id)
    ? this.selectedHeroes = this.selectedHeroes.filter(item => item != id)
    : this.selectedHeroes.push(id)
  }

  @computed get heroesStats() {
    let { nodes, links } = this.filteredMatches.reduce((res, match) => {
      const picks = (match.radiantTeam == this.team ? match.radiantPicks : match.direPicks).sort((a, b) => a.hero - b.hero)
      const win = +(match.winnerTeam == this.team)

      const nodes = picks.map(item => ({ id: item.hero, win }) )

      const links = picks.reduce((res, item, index) => {
        let arr = picks.filter((pick, key) => key > index).map(pick => ({
            id: item.hero + '-' + pick.hero,
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
      const index = res.findIndex(node => node.id == item.id )

      if (index == -1) return [...res, { ...item, pick: 1 }]
      else return [
        ...res.filter((item, key) => key < index),
        { ...item, win: res[index].win + item.win, pick: res[index].pick + 1 },
        ...res.filter((item, key) => key > index)
      ]
    }, [])

    links = links.reduce((res, item) => {
      const index = res.findIndex(link => link.id == item.id )

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