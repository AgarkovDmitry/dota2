import { observable, action, computed  } from 'mobx'
import api from 'api'

class DataStore {
  @observable _data = []

  @computed get data() {
    return this._data
    // .sort((a, b) => {
    //   if (a.rating < b.rating) return 1
    //   else if (a.rating > b.rating) return -1
    //   else return 0
    // })
    .map(item =>
      ({ ...item, winRate: ((item.wins) / (item.wins + item.losses) * 100).toFixed(2) })
    )
  }

  @action fetch = () => !this._data.length && api.fetchTeams().then(res => {
    const filtered = res.filter(item => item.rating && item.name)
    this._data.push(...filtered)
  })
}

export default DataStore