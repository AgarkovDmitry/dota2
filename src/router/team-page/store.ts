import { observable, action, computed, autorun } from 'mobx'

import D3Team from 'd3/d3-team'

import Match from 'store/types/match'
import Hero from 'store/types/hero'
import League from 'store/types/league'
import Team from 'store/types/team'
import DataStore from 'store/data-store'

class Store {
  @observable data: DataStore
  team: number

  @observable heroes: Array<Hero> = []
  @observable leagues: Array<League> = []
  @observable rivals: Array<Team> = []
  D3Team: D3Team

  constructor(team, data: DataStore) {
    this.team = team
    this.data = data
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
    this.team = id
    this.heroes = []
    this.leagues = []

    this.fetch()
  }

  @action fetch = async() => {
    this.data.loadHeroes()
    this.data.loadTeams()
    this.data.loadLeagues()
    this.data.loadPlayers()
    this.data.loadMatchesWithExtras(5, true, { team: this.team })
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

  @computed get teamMatches(): Array<Match> {
    return this.data.getMatches({ team: this.team, loaded: true })
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
        const picks = match.radiantTeam.id == this.team ? match.radiantPicks : match.direPicks

        return this.heroes.reduce(
          (result, hero) => result && picks.reduce((a, b) => a || b.hero == hero, false),
          true
        )
      })
    }

    if (this.rivals.length > 0) {
      matches = matches.filter(match => {
        const team = match.radiantTeam.id == this.team ? match.direTeam : match.radiantTeam
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
        const team = match.radiantTeam.id == this.team ? match.direTeam : match.radiantTeam
        return !res.find(item => item == team) ? [...res, team] : res
      }, [])
  }
}

export default Store