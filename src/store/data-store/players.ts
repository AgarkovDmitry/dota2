import { observable, action, createTransformer } from 'mobx'
import api from 'api'

export default class {
  @observable data = []

  @action async loadPlayers () {
    if (!this.data.length) {
      const res = await api.fetchProPlayers()
      this.data.push(...res)
    }
  }

  getPlayer = createTransformer((id: number) => {
    return this.data.find(item => item.account_id == id)
  })
}