import { observable, action, computed } from 'mobx'

import DataStore from 'store/data-store'
import Hero from 'store/types/hero'
import League from 'store/types/league'
import Team from 'store/types/team'


class Store{
  @observable data: DataStore
  @observable _team: number
  @observable loading: boolean

  @observable heroes: Hero[] = []
  @observable leagues: League[] = []
  @observable rivals: Team[] = []
  @observable side: string = 'Both'

  @computed get team() {
    return this.data.teams.findById(this._team)
  }

  @computed get teamMatches() {
    return this.data.fullMatches.data
    .filter(item => item.direTeam == this.team || item.radiantTeam == this.team)
  }

  @computed get filteredMatches() {
    let matches = this.teamMatches

    if (this.leagues.length > 0) {
      matches = matches.filter(match => {
        return this.leagues.find(league => league == match.league)
      })
    }

    if (this.heroes.length > 0) {
      matches = matches.filter(match => {
        const picks = match.radiantTeam == this.team ? match.radiantPicks : match.direPicks

        return this.heroes.reduce(
          (result, hero) => result && picks.reduce((a, b) => a || b.hero == hero, false),
          true
        )
      })
    }

    if (this.rivals.length > 0) {
      matches = matches.filter(match => {
        const team = match.radiantTeam == this.team ? match.direTeam : match.radiantTeam
        return this.rivals.find(rival => rival == team)
      })
    }

    if (this.side == 'Radiant')
      matches = matches.filter(match => match.radiantTeam == this.team)
    if (this.side == 'Dire')
      matches = matches.filter(match => match.direTeam == this.team)

    return matches
  }

  @computed get drafts() {
    return this.filteredMatches.map(match => match.teamDraft(this.team))
  }

  get availableSides() {
    return ['Both', 'Radiant', 'Dire']
  }

  @computed get availableLeagues() {
    return this.teamMatches
      .map(match => match.league)
      .filter((league, index, array) => index == array.indexOf(league))
  }

  @computed get availableRivals() {
    return this.teamMatches
      .map(match => match.radiantTeam == this.team ? match.direTeam : match.radiantTeam)
      .filter((team, index, array) => index == array.indexOf(team))
  }

  constructor(data: DataStore, payload) {
    this.data = data
    this._team = payload

    this.fetch()
  }

  @action setTeam = (id: number) => {
    this._team = id
    this.heroes = []
    this.leagues = []

    this.fetch()
  }

  @action fetch = async() => {
    this.loading = true

    await Promise.all([
      this.data.heroes.load(),
      this.data.leagues.load(),
      this.data.teams.load()
    ])
    await this.data.players.load()

    await this.data.matches.load()
    const ids = this.data.matches.data
      .filter(item => item.direTeam && item.radiantTeam)
      .filter(item => item.direTeam == this.team || item.radiantTeam == this.team)
      .map(match => match.id)
    await this.data.fullMatches.load(ids)

    this.loading = false
  }

  @action fetchMore = async() => {
    this.loading = true

    await this.data.matches.load(5)
    const ids = this.data.matches.data
      .filter(item => item.direTeam == this.team || item.radiantTeam == this.team)
      .map(match => match.id)
    await this.data.fullMatches.load(ids)

    this.loading = false
  }

  @action select = (item: Hero | League | Team) => {
    if (item instanceof Hero) {
      const index = this.heroes.indexOf(item)
      index == -1 ? this.heroes.push(item) : this.heroes.splice(index, 1)
    }

    if (item instanceof League) {
      this.heroes = []
      const index = this.leagues.indexOf(item)
      index == -1 ? this.leagues.push(item) : this.leagues.splice(index, 1)
    }

    if (item instanceof Team) {
      this.heroes = []
      const index = this.rivals.indexOf(item)
      index == -1 ? this.rivals.push(item) : this.rivals.splice(index, 1)
    }
  }

  @action selectSide = (item: string) => {
    this.side = item
  }
}

export default Store