import { observable } from 'mobx'

import DataStore from 'store/data-store'

class LocalStore {
  @observable data: DataStore

  constructor(data: DataStore) {
    this.data = data
  }
}

export default LocalStore