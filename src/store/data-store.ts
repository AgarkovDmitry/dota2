import { observable, action, createTransformer } from 'mobx'
import cacheProxy from 'helpers/cache-proxy'

import Hero from './types/hero'
import League from './types/league'
import Match from './types/match'
import Player from './types/player'
import Team from './types/team'

class Store {
  @observable heroes: Array<Hero> = []
  @observable leagues: Array<League> = []
  @observable players: Array<Player> = []
  @observable teams: Array<Team> = []

  @observable matches: Array<Match> = []
  @observable loadingMatches: boolean = true

  getHero = createTransformer((id: number): Hero => {
    return id ? this.heroes.find(item => item.id == id) : null
  })

  getLeague = createTransformer((id: number): League => {
    return this.leagues.find(item => item.id == id)
  })

  getPlayer = createTransformer((id: number): Player => {
    return this.players.find(item => item.id == id)
  })

  getTeam = createTransformer((id: number): Team => {
    return this.teams.find(item => item.id == id)
  })

  getMatch = createTransformer((id: number): Match => {
    return this.matches.find(item => item.id == id)
  })

  getMatches = createTransformer((filters: any): Array<Match> => {
    const { loaded, team, side, rival, duration, matches, heroes } = filters
    let data: Array<Match> = this.matches

    if (team) {
      if (side) data = data.filter(item => item[side] == side)
      else data = data.filter(item => item.radiantTeam.id == team || item.direTeam.id == team)

      if (rival) data = data.filter(item => item.radiantTeam.id == rival || item.direTeam.id == rival)
    }

    if (duration) data = data.filter(item => item.duration >= duration.min && item.duration < duration.max)

    if (matches) data = data.filter(match => matches.reduce((res, item) => res || match.id == item, false))

    if (loaded) {
      data = data.filter(item => item.withExtra == loaded)

      if (heroes && heroes.length > 0) {
        data = data.filter(match => {
          const werePickedByRadiant = heroes.reduce(
            (result, hero) => result && match.radiantPicks.reduce((a, b) => a || b.hero.id == hero.id, false),
            true
          )
          const werePickedByDire = heroes.reduce(
            (result, hero) => result && match.direPicks.reduce((a, b) => a || b.hero.id == hero.id, false),
            true
          )

          if (team) return match.radiantTeam.id == team ? werePickedByRadiant : werePickedByDire

          return werePickedByRadiant || werePickedByDire
        })
      }
    }

    return data
  })

  @action async loadHeroes (force?: boolean) {
    const data = !this.heroes.length ? await cacheProxy.loadHeroes() : []
    this.heroes.push(...data.map(item => new Hero(item)))
  }

  @action async loadLeagues (force?: boolean) {
    const data = !this.leagues.length ? await cacheProxy.loadLeagues() : []
    this.leagues.push(...data.map(item => new League(item)))
  }

  @action async loadTeams () {
    const data = !this.teams.length ? await cacheProxy.loadTeams() : []
    this.teams.push(...data.map(item => new Team(item)))
  }

  @action async loadPlayers () {
    const data = !this.players.length ? await cacheProxy.loadPlayers() : []
    this.players.push(...data.map(item => new Player(item, this.getTeam)))
  }

  @action async loadMatchesWithExtras (count: number = 5, fromStart: boolean = true, filters: any = {}) {
    this.loadingMatches = true
    await this.loadMatches(count, fromStart)
    const ids = this.getMatches(filters).map(match => match.id)
    await this.loadMatchesExtra(ids)
    this.loadingMatches = false
  }

  @action async loadMatches (count: number = 5, fromStart: boolean = true) {
    const matchesCount = this.matches.length
    let res = await cacheProxy.loadMatches(count, matchesCount > 0 ? this.matches[matchesCount - 1].id : undefined)
    // const resCount = fromStart ? count - matchesCount / 100 : count

    // let res = []
    // for (let i = 0; i < resCount; i++) {
    //   let tempRes = await api.fetchProMatches(
    //     res.length > 0
    //       ? res[res.length - 1].match_id
    //       : matchesCount > 0
    //         ? this.matches[matchesCount - 1].id
    //         : undefined
    //   )
    //   res = [...res, ...tempRes]
    // }

    this.matches.push(
      ...res
        // .filter(item => item.radiant_team_id && item.dire_team_id)
        .filter(item => this.getTeam(item.radiant_team_id) && this.getTeam(item.dire_team_id))
        .map(match => new Match(match, this.getLeague, this.getTeam))
    )
  }

  @action async loadMatchesExtra (ids: Array<number>) {
    const matches = this.matches.filter((item) => ids.includes(item.id) && !item.withExtra)
    // const responces = await Promise.all(matches.map(match => cacheProxy.loadMatchExtra(match.id)))
    const responces = await cacheProxy.loadMatchesExtra(matches.map(match => match.id))
    responces.map(responce => this.getMatch(responce.match_id).loadExtra(responce, this.getHero, this.getPlayer))
  }
}

export default Store