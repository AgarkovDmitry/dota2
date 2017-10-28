import { observable, action, createTransformer } from 'mobx'
import CachedStore from './cached-store'
import api from 'api'

import Team from '../types/team'

export default class HeroStore extends CachedStore{
  @observable data: Team[] = []

  constructor () {
    super('teams', 24)
  }


  @action async load (force?: boolean) {
    if (this.data.length == 0 || force) {
      let { data, isExpired } = await this.readFromLocalStorage()

      if (navigator.onLine && (isExpired || force)) {
        data = await api.fetchTeams()
        this.writeToLocalStorage(data)
      }

      if (data.length > 0) this.data = []

      this.data.push(
        ...data
        .filter(item => item.name)
        .sort((a, b) => b.rating - a.rating)
        .filter((item, key) => key < 200)
        .map(item => new Team(item))
      )
    }
  }

  findById = createTransformer((id: number) => {
    return this.data.find(item => item.id == id)
  })
}