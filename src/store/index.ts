import { action } from 'mobx'

import LeaguesStore from './leagues-store'
import TeamsStore from './teams-store'
import DataStore from './data-store'

class Store {
  localStore
  dataStore = new DataStore()
  leagues = new LeaguesStore()
  teams = new TeamsStore()

  @action setLocalStore(LocalStore, param) {
    this.localStore = new LocalStore(param, { data: this.dataStore })
  }
}

export default Store