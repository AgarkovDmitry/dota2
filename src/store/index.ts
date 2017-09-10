import { createTransformer } from 'mobx'

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
  heroes = new HeroesStore()
  leagues = new LeaguesStore()
  matches = new MatchesStore()
  players = new PlayersStore()
  teams = new TeamsStore()

  heroesStats = createTransformer((team_id: number) => {
    const filteredMatches = this.matches.data.filter(item => item.dire_team_id == team_id || item.radiant_team_id == team_id)

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
}

export default Store