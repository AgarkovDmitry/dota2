import { observable, action, computed, autorun } from 'mobx'

import D3Team from 'd3/d3-team'

import Match from 'store/types/match'
import Hero from 'store/types/hero'
import League from 'store/types/league'
import Team from 'store/types/team'
import LocalStore from 'store/local-store'
import DataStore from 'store/data-store'

class Store extends LocalStore{
  @observable data: DataStore
  _team: number

  @observable heroes: Array<Hero> = []
  @observable leagues: Array<League> = []
  @observable rivals: Array<Team> = []
  D3Team: D3Team

  @computed get team(): Team {
    return this.data.getTeam(this._team)
  }

  @computed get teamMatches(): Array<Match> {
    return this.data.getMatches({ team: this._team, loaded: true })
  }

  @computed get filteredMatches(): Array<Match> {
    let matches = this.teamMatches

    if (this.leagues.length > 0) {
      matches = matches.filter(match => {
        return this.leagues.find(league => league == match.league)
      })
    }

    if (this.heroes.length > 0) {
      matches = matches.filter(match => {
        const picks = match.radiantTeam.id == this._team ? match.radiantPicks : match.direPicks

        return this.heroes.reduce(
          (result, hero) => result && picks.reduce((a, b) => a || b.hero == hero, false),
          true
        )
      })
    }

    if (this.rivals.length > 0) {
      matches = matches.filter(match => {
        const team = match.radiantTeam.id == this._team ? match.direTeam : match.radiantTeam
        return this.rivals.find(rival => rival == team)
      })
    }

    return matches
  }

  @computed get availableLeagues(): Array<League> {
    return this.teamMatches
      .reduce((res, item) => {
        return !res.find(league => league == item.league) ? [...res, item.league] : res
      }, [])
  }

  @computed get availableRivals(): Array<Team> {
    return this.teamMatches
      .reduce((res, match) => {
        const team = match.radiantTeam.id == this._team ? match.direTeam : match.radiantTeam
        return !res.find(item => item == team) ? [...res, team] : res
      }, [])
  }

  constructor(data: DataStore, payload) {
    super(data)
    this._team = payload
    this.D3Team = new D3Team()

    this.fetch()

    autorun(() => {
      if (!this.data.loadingMatches)
        this.D3Team.render(
          this.heroes,
          this.select,
          this.filteredMatches.map(match => match.teamDraft(this.team))
        )
    })
  }

  @action setTeam = (id: number) => {
    this._team = id
    this.heroes = []
    this.leagues = []

    this.fetch()
  }

  @action fetch = async() => {
    this.data.loadHeroes()
    this.data.loadTeams()
    this.data.loadLeagues()
    this.data.loadPlayers()
    this.data.loadMatchesWithExtras(4, true, { team: this._team })
  }

  @action select = (item: Hero | League | Team) => {
    if (item instanceof Hero) {
      const index = this.heroes.findIndex(hero => hero == item)
      index == -1 ? this.heroes.push(item) : this.heroes.splice(index, 1)
    }

    if (item instanceof League) {
      this.heroes = []
      const index = this.leagues.findIndex(league => league == item)
      index == -1 ? this.leagues.push(item) : this.leagues.splice(index, 1)
    }

    if (item instanceof Team) {
      this.heroes = []
      const index = this.rivals.findIndex(rival => rival == item)
      index == -1 ? this.rivals.push(item) : this.rivals.splice(index, 1)
    }
  }
}

export default Store