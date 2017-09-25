import { observable, action } from 'mobx'

import DataStore from './data-store'

class Store {
  @observable localStore = null
  dataStore = new DataStore()

  @action setLocalStore(LocalStore, param) {
    this.localStore = new LocalStore(param, this.dataStore)
  }
}

export default Store