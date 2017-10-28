import { observable, action, createTransformer } from 'mobx'
import CachedStore from './cached-store'
import api from 'api'

import Player from '../types/player'

export default class HeroStore extends CachedStore{
  @observable data: Player[] = []
  getTeam: (number) => Team

  constructor(getTeam: (number) => Team) {
    super('players', 24)
    this.getTeam = getTeam
  }

  @action async load (force?: boolean) {
    if (this.data.length == 0 || force) {
      let { data, isExpired } = await this.readFromLocalStorage()

      if (navigator.onLine && (isExpired || force)) {
          data = await api.fetchPlayers()
          this.writeToLocalStorage(data)
      }

      if (data.length > 0) this.data = []

      this.data.push(
        ...data
        .filter(item => this.getTeam(item.team_id))
        .map(item => new Player(item, this.getTeam))
      )
    }
  }

  findById = createTransformer((id: number) => {
    return this.data.find(item => item.id == id)
  })
}