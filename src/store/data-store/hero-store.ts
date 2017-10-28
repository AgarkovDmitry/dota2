import { observable, action, createTransformer } from 'mobx'
import CachedStore from './cached-store'
import api from 'api'

import Hero from '../types/hero'

export default class HeroStore extends CachedStore{
  @observable data: Hero[] = []

  constructor () {
    super('heroes', 3)
  }

  @action async load (force?: boolean) {
    if (this.data.length == 0 || force) {
      let { data, isExpired } = await this.readFromLocalStorage()

      if (navigator.onLine && (isExpired || force)) {
        data = await api.fetchHeroes()
        this.writeToLocalStorage(data)
      }

      if (data.length > 0) this.data = []

      this.data.push(
        ...data
        .map(item => new Hero(item))
      )
    }
  }

  findById = createTransformer((id: number) => {
    return this.data.find(item => item.id == id)
  })
}