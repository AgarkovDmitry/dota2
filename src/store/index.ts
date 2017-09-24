import { action } from 'mobx'

import DataStore from './data-store'

class Store {
  localStore
  dataStore = new DataStore()

  @action setLocalStore(LocalStore, param) {
    this.localStore = new LocalStore(param, this.dataStore)
  }
}

export default Store