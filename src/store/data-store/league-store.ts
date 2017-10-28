import { observable, action, createTransformer } from 'mobx'
import CachedStore from './cached-store'
import api from 'api'

import League from '../types/league'

export default class HeroStore extends CachedStore{
  @observable data: League[] = []

  constructor () {
    super('leagues', 24)
  }

  @action async load (force?: boolean) {
    if (this.data.length == 0 || force) {
      let { data, isExpired } = await this.readFromLocalStorage()

      if (navigator.onLine && (isExpired || force)) {
        data = await api.fetchLeagues()
        this.writeToLocalStorage(data)
      }

      if (data.length > 0) this.data = []

      this.data.push(
        ...data
        .filter(item => item.tier == 'premium' || item.tier == 'professional')
        .map(item => new League(item))
      )
    }
  }

  findById = createTransformer((id: number) => {
    return this.data.find(item => item.id == id)
  })
}