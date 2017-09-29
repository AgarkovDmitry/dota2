import { observable, action } from 'mobx'

import DataStore from './data-store'
import TeamStore from 'router/team-page/store'

class Store {
  @observable localStore: TeamStore = null
  dataStore: DataStore = new DataStore()

  @action setLocalStore(LocalStore, param) {
    this.localStore = new LocalStore(param, this.dataStore)
  }
}

export default Store