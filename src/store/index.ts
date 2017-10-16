import { observable, action } from 'mobx'

import DataStore from './data-store'
import TeamStore from 'pages/team/store'

class Store {
  @observable localStore: TeamStore = null
  dataStore: DataStore = new DataStore()

  @action setLocalStore(LocalStore, payload) {
    this.localStore = new LocalStore(this.dataStore, payload)
  }
}

export default Store