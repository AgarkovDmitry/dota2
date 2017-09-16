import { createTransformer, action } from 'mobx'

import HeroesStore from './heroes-store'
import LeaguesStore from './leagues-store'
import MatchesStore from './matches-store'
import PlayersStore from './players-store'
import TeamsStore from './teams-store'

import getHeroesStats from 'utils/get-heroes-stats'

const filterMatches = (matches, ids) => {
  return matches.filter(match =>
    ids.reduce((a, b) => a || match.match_id == b, false)
  )
}

class Store {
  localStore
  heroes = new HeroesStore()
  leagues = new LeaguesStore()
  matches = new MatchesStore()
  players = new PlayersStore()
  teams = new TeamsStore()

  teamMatches = createTransformer((team_id: number) => {
    return this.matches.data.filter(item => item.dire_team_id == team_id || item.radiant_team_id == team_id)
  })

  heroStat = createTransformer(({ team_id, hero_id }) => {
    let teamMatches = this.teamMatches(team_id)

    let filteredMatches = teamMatches.filter(match => {
      const team = match.dire_team_id == team_id ? 1 : 0
      const picks = match.picks_bans.filter(item => item.team == team && item.is_pick == true)
      return picks.reduce((a, b) => a || b.hero_id == hero_id, false)
    })

    let heroStats = filteredMatches.map(match => {
        const team = match.dire_team_id == team_id ? 1 : 0
        const player = match.players.find(player => player.hero_id == hero_id)
        return { account_id: player.account_id, won: match.radiant_win != team }
    })

    let players = heroStats.reduce((a, b) => a.includes(b.account_id) ? a : [...a, b.account_id], [])

    players = players.map(player => heroStats.reduce((res, hero) =>
      hero.account_id == player ? { ...res, wins: res.wins + +hero.won, picks: res.picks + 1 } : res,
      { account_id: player, wins: 0, picks: 0 })
    )

    return players.map(item => {
      const player = this.getPlayer(item.account_id)
      return { ...item, ...player, isActual: player.team_id == team_id }
    })
  })

  heroBansAgainstTeam = createTransformer(({ team_id, hero_id }) => {
    let teamMatches = this.teamMatches(team_id)

    return teamMatches.filter(match => {
      const team = match.dire_team_id == team_id ? 1 : 0
      const picks = match.picks_bans.filter(item => item.team != team && item.is_pick == false)
      return picks.reduce((a, b) => a || b.hero_id == hero_id, false)
    }).length
  })

  heroesStats = createTransformer((team_id: number) => {
    const filteredMatches = this.teamMatches(team_id)

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
  })

  getHero = createTransformer((id: number) => {
    return this.heroes.data.find(item => item.id == id)
  })

  getPlayer = createTransformer((id: number) => {
    return this.players.data.find(item => item.account_id == id)
  })

  convertInfo = createTransformer(({ info, selectedHero, selectHero, className }) => {
    const nodes = info.singleHeroStats.map(item => ({
      label: `${this.getHero(item.heroes[0]).localized_name}`,
      r: item.picks > 20 ? 25 : 25 + 0.5 * item.picks,
      color: item.winRate > 0.5 ? 'green' : 'red',
      id: item.heroes[0],
      src: `https://api.opendota.com${this.getHero(item.heroes[0]).icon}`,
      width: item.heroes[0] == selectedHero ? 4 : 3,
      array: item.heroes[0] == selectedHero ? (item.picks > 20 ? 25 : 25 + 0.5 * item.picks) * Math.PI / 8 : 0,
      offset: item.heroes[0] == selectedHero ? (item.picks > 20 ? 25 : 25 + 0.5 * item.picks) * Math.PI : 0,
      class: selectedHero ? className : '',
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

  @action setLocalStore(LocalStore, param) {
    this.localStore = new LocalStore(param, { matches: this.matches, heroes: this.heroes })
  }
}

export default Store