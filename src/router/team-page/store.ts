import { observable, action, computed, autorun } from 'mobx'

import createChart from 'utils/createChart'

const styles = require('./style.scss')

const getWinRateColor = (winRate) => {
  if (winRate <= 0.3) return '#B0C3D9'
  if (winRate <= 0.5) return '#5E98D9'
  if (winRate <= 0.7) return '#4B69FF'
  if (winRate <= 0.9) return '#8847FF'
  if (winRate <= 1.0) return '#D32CE6'
}

import Match from 'store/types/match'

class Store {
  @observable data: any
  team: number

  @observable selectedHero: number

  constructor(team, data) {
    this.team = team
    this.data = data
    this.selectedHero = 0

    this.data.loadMatchesWithExtras(5, true, { team: team })
    this.data.loadHeroes()
    this.data.loadPlayers()
    this.data.loadTeams()

    autorun(() => {
      const { nodes, links } = this.convertInfo
      createChart(nodes, links)
    })
  }

  @computed get filteredMatches(): Array<Match> {
    return this.data.getMatches({ team: this.team, loaded: true, heroes: this.selectedHero && [this.selectedHero] })
  }

  @action selectHero = (id) => this.selectedHero = (this.selectedHero == id) ? 0 : id


  @computed get heroStat() {
    if (this.selectedHero) {
      let matches = this.filteredMatches
      let heroStats = matches.map(match => {
        const player = match.players.find(player => player.hero_id == this.selectedHero)
        return { account_id: player.account_id, won: match.winnerTeam == this.team }
      })

      let players = heroStats.reduce((a, b) => a.includes(b.account_id) ? a : [...a, b.account_id], [])

      players = players.map(player => heroStats.reduce((res, hero) =>
        hero.account_id == player ? { ...res, wins: res.wins + +hero.won, picks: res.picks + 1 } : res,
        { account_id: player, wins: 0, picks: 0 })
      )

      return players.map(item => {
        const player = this.data.getPlayer(item.account_id)
        return { ...item, ...player, isActual: player.team_id == this.team }
      })
    }
    return []
  }

  @computed get heroBansAgainstTeam () {
    const hero = this.selectedHero
    let matches = this.filteredMatches

    return matches.filter(match => {
      const picks = match.radiantTeam == this.team ? match.radiantBans : match.direBans
      return picks.reduce((a, b) => a || b.hero == hero, false)
    }).length
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

  @computed get convertInfo () {
    const info = this.heroesStats
    const selectedHero = this.selectedHero
    const selectHero = this.selectHero
    const getHero = this.data.getHero

    const nodes = info.nodes.map(item => ({
      label: `${getHero(item.id).name}`,
      r: item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2),
      color: getWinRateColor(item.win / item.pick),
      id: item.id,
      src: getHero(item.id).icon,
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
      color: getWinRateColor(item.win / item.pick),
      width: 3,
      opacity: item.pick * 0.2
    }))

    return { nodes, links }
  }
}

export default Store