import { observable, action, createTransformer } from 'mobx'
import api from 'api'

export default class {
  @observable data = []

  @action async loadHeroes () {
    if (!this.data.length) {
      const res = await api.fetchHeroesStats()
      this.data.push(...res)
    }
  }

  getHero = createTransformer((id: number) => {
    return this.data.find(item => item.id == id)
  })
}