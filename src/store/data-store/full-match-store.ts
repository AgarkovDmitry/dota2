import { observable, action, createTransformer } from 'mobx'
import CachedStore from './cached-store'
import api from 'api'

import FullMatch from '../types/full-match'

export default class FullMatchStore extends CachedStore{
  @observable data: FullMatch[] = []
  maxCount: number = 50
  getMatch: (number) => Match
  getHero: (number) => Hero
  getPlayer: (number) => Player

  constructor (getMatch, getHero, getPlayer) {
    super('fullMatches')

    this.getMatch = getMatch
    this.getHero = getHero
    this.getPlayer = getPlayer
  }

  @action async load (ids: number[], force?: boolean) {
    let { data } = await this.readFromLocalStorage()

    let responces = await Promise.all(
      ids
      .filter(id => !data.find(match => match.match_id == id) || force)
      .map(id => api.fetchMatchInfo(id))
    )

    data.push(...responces.filter(item => !data.find(match => match.match_id == item.match_id)))

    this.writeToLocalStorage(data.sort((a, b) => b.start_time - a.start_time).slice(0, this.maxCount))

    if (data)
      this.data = []

    this.data.push(
      ...data
      .filter(res => this.data.indexOf(res) == -1)
      .filter(res => this.getMatch(res.match_id))
      .map(res => new FullMatch(this.getMatch(res.match_id), res, this.getHero, this.getPlayer))
    )
  }

  findById = createTransformer((id: number) => {
    return this.data.find(item => item.id == id)
  })
}