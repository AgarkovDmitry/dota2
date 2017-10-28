import { observable } from 'mobx'

import HeroStore from './hero-store'
import LeagueStore from './league-store'
import TeamStore from './team-store'
import PlayerStore from './player-store'
import MatchStore from './match-store'
import FullMatchStore from './full-match-store'

class Store {
  @observable heroes: HeroStore
  @observable leagues: LeagueStore
  @observable teams: TeamStore
  @observable players: PlayerStore
  @observable matches: MatchStore
  @observable fullMatches: FullMatchStore

  constructor () {
    this.heroes = new HeroStore()
    this.leagues = new LeagueStore()
    this.teams = new TeamStore()
    this.players = new PlayerStore(this.teams.findById)
    this.matches = new MatchStore(this.leagues.findById, this.teams.findById)
    this.fullMatches = new FullMatchStore(this.matches.findById, this.heroes.findById, this.players.findById)
  }
}

export default Store