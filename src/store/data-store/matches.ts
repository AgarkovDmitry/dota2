import { observable, action, createTransformer  } from 'mobx'
import api from 'api'

import Match from './match'

export default class {
  @observable data: Array<Match> = []
  @observable isFething: boolean = false

  filteredMatches = createTransformer(({ loaded, league, team, side, rival, duration, matches, heroes }): Array<Match> => {
    let data = this.data

    if (league) data = data.filter(item => item.leagueId == league)

    if (team) {
      if (side) data = data.filter(item => item[side] == team)
      else data = data.filter(item => item.radiantTeam == team || item.direTeam == team)

      if (rival) data = data.filter(item => item.radiantTeam == rival || item.direTeam == rival)
    }

    if (duration) data = data.filter(item => item.duration >= duration.min && item.duration < duration.max)

    if (matches) data = data.filter(match => matches.reduce((res, item) => res || match.id == item, false))

    if (loaded) {
      data = data.filter(item => item.withExtra == loaded)

      if (heroes) {
        data = data.filter(match => {
          const werePickedByRadiant = heroes.reduce(
            (result, hero) => result && match.radiantPicks.reduce((a, b) => a || b.hero == hero, false),
            true
          )
          const werePickedByDire = heroes.reduce(
            (result, hero) => result && match.direPicks.reduce((a, b) => a || b.hero == hero, false),
            true
          )

          if (team) return match.radiantTeam == team ? werePickedByRadiant : werePickedByDire

          return werePickedByRadiant || werePickedByDire
        })
      }
    }

    return data
  })

  @action async loadMatchesWithExtras (count: number = 5, fromStart: boolean = true, filters: object = {}) {
    await this.loadMatches(count, fromStart)
    const ids = this.filteredMatches(filters).map(match => match.id)
    this.loadMatchesExtra(ids)
  }

  @action async loadMatches (count: number = 5, fromStart: boolean = true) {
    const matchesCount = this.data.length
    const resCount = fromStart ? count - matchesCount / 100 : count
    this.isFething = false

    let res = []
    for (let i = 0; i < resCount; i++) {
      let tempRes = await api.fetchProMatches(
        res.length > 0
          ? res[res.length - 1].match_id
          : matchesCount > 0
            ? this.data[matchesCount - 1].id
            : undefined
      )
      res = [...res, ...tempRes]
    }

    this.data.push(...res.map(match => new Match(match)))
    this.isFething = true
  }

  @action async loadMatchExtra (id: number) {
    const matches = this.data.filter((item) => item.id == id)
    matches.map(match => match.loadExtra())
  }

  @action async loadMatchesExtra (ids: Array<number>) {
    const matches = this.data.filter(({ id }) => ids.includes(id))
    matches.map(match => match.loadExtra())
  }
}