import { observable, action, computed, createTransformer, autorun } from 'mobx'

import createChart from 'utils/createChart'

const styles = require('./style.scss')

class Store {
  @observable heroes: any
  @observable matches: any

  team_id: number

  @observable selectedHero: number = 0

  constructor(team_id, { matches, heroes }) {
    this.team_id = team_id
    this.matches = matches
    this.heroes = heroes

    autorun(() => {
      const { nodes, links } = this.convertInfo
      createChart(nodes, links)
    })
  }

  @computed get filteredMatches() {
    let data = this.matches.data

    data = data.filter(item => item.dire_team_id == this.team_id || item.radiant_team_id == this.team_id)
    if (this.selectedHero) data = data.filter(item => {
      const team = item.dire_team_id == this.team_id ? 1 : 0
      return item.picks_bans ? item.picks_bans.reduce((res, item) => res || item.team == team && item.is_pick == true && item.hero_id == this.selectedHero, false) : false
    })

    return data
  }

  @action selectHero = (id) => this.selectedHero = (this.selectedHero == id) ? 0 : id


  @computed get heroesStats() {
    const team = this.team_id
    const filteredMatches = this.filteredMatches.filter(item => item.isFetched)

    let { nodes, links } = filteredMatches.reduce((res, match) => {
      const side = match.dire_team_id == team
      const picks = match.picks_bans.filter(item => item.team == side && item.is_pick == true).sort((a, b) => a.hero_id - b.hero_id)

      const nodes = picks.map(item => ({ id: item.hero_id, win: +(match.radiant_win != side) }) )

      const links = picks.reduce((res, item, index) => {
        let arr = picks.filter((pick, key) => key > index).map(pick => ({
            id: item.hero_id + '-' + pick.hero_id,
            source: item.hero_id,
            target: pick.hero_id,
            win: +(match.radiant_win != team)
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

  getHero = createTransformer((id: number) => {
    return this.heroes.data.find(item => item.id == id)
  })

  @computed get convertInfo () {
    const info = this.heroesStats
    const selectedHero = this.selectedHero
    const selectHero = this.selectHero

    const nodes = info.nodes.map(item => ({
      label: `${this.getHero(item.id).localized_name}`,
      r: item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2),
      color: item.win / item.pick > 0.5 ? 'green' : 'red',
      id: item.id,
      src: `https://api.opendota.com${this.getHero(item.id).icon}`,
      array: item.id == selectedHero ? (item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2)) * Math.PI / 8 : 0,
      offset: item.id == selectedHero ? (item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2)) * Math.PI : 0,
      class: item.id == selectedHero ? styles.selected : '',
      opacity: 1,
      onClick: () => selectHero(item.id)
    }))

    const links = info.links.filter(item => item.pick > 1).map(item => ({
      id: item.id,
      source: nodes.findIndex(node => node.id == item.source),
      target: nodes.findIndex(node => node.id == item.target),
      color: item.win / item.pick > 0.5 ? 'green' : 'red',
      width: 3,
      opacity: item.pick * 0.1,
      label: `${item.win / item.pick * 100}% - ${item.pick} picks`
    }))

    return { nodes, links }
  }
}

export default Store