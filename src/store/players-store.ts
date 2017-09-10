import { observable, action, computed  } from 'mobx'
import api from 'api'

class DataStore {
  @observable _data = []

  @computed get data() {
    return this._data
  }

  @action fetch = () => !this._data.length && api.fetchProPlayers().then(res => this._data.push(...res))
}

export default DataStore