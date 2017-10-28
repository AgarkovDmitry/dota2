import { observable, action, createTransformer } from 'mobx'
import CachedStore from './cached-store'
import api from 'api'

import Match from '../types/match'

export default class MatchStore extends CachedStore{
  @observable data: Match[] = []
  maxCount: number = 4000
  getLeague: (number) => League
  getTeam: (number) => Team

  constructor (getLeague: (number) => League, getTeam: (number) => Team) {
    super('matches')

    this.getLeague = getLeague
    this.getTeam = getTeam
  }

  @action async load (requestsCount: number = 0, force?: boolean) {
    let { data } = await this.readFromLocalStorage()

    if (navigator.onLine) {
      if (force) {
        data = []
        this.data = []
      }

      let index = 0
      let res = await api.fetchProMatches()

      if (data.length != 0) {
        res = res.filter(item => item.match_id > data[0].match_id)

        if (res.length > 0) {
          while (res.length % 100 == 0 && index < requestsCount) {
            let tres = await api.fetchProMatches()
            tres = tres.filter(item => item.match_id > data[0].match_id)
            res.push(...tres)
            index++
          }

          data.unshift(...res)
        }
      }
      else
        data.push(...res)

      while (index < requestsCount) {
        res = await api.fetchProMatches(data[data.length - 1].match_id)
        data.push(...res)
        index++
      }

      this.writeToLocalStorage(data.sort((a, b) => b.match_id - a.match_id).slice(0, this.maxCount))
    }

    this.data.push(
      ...data
      .filter(item => item.radiant_team_id && item.dire_team_id)
      .filter(item => this.getTeam(item.radiant_team_id) && this.getTeam(item.dire_team_id))
      .map(match => new Match(match, this.getLeague, this.getTeam))
    )
  }

  findById = createTransformer((id: number) => {
    return this.data.find(item => item.id == id)
  })
}