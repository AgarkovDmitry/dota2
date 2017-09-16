import { observable, action, computed  } from 'mobx'
import api from 'api'

class DataStore {
  @observable _data = []

  @computed get data() {
    return this._data
  }

  @action fetch = (withExtras?: boolean, team_id?: number) => {
    const offset = this._data.length > 0 ? this._data[this._data.length - 1].match_id : undefined
    api.fetchProMatches(offset).then(res => {
      if (withExtras) {
        const promises = [...res, ...this._data.filter(item => !item.isFetched)]
        .filter(
          ({ radiant_team_id, dire_team_id }) => {
            return team_id ? radiant_team_id == team_id || dire_team_id == team_id : true
          }
        )
        .map(
          ({ match_id }) => api.fetchMatchInfo(match_id)
        )

        Promise.all(promises).then(
          response => {
            response.map(match => {
              const index = res.findIndex(({ match_id }) => match_id == (match as any).match_id)
              res[index] = { ...res[index], ...match, isFetched: true }
            })

            this._data.push(...res)
          }
        )
      }
      else this._data.push(...res)
    })
  }

  @action loadMatchExtra = (id: number) => {
    const match = this._data.find(item => item.match_id == id)
    if (!match.isFetched && !match.isFetching) {
      api.fetchMatchInfo(id).then(res => {
        const index = this._data.findIndex(item => item.match_id == res.match_id)
        this._data[index] = { ...this._data[index], ...res, isFetched: true }
      })
    }
  }
}

export default DataStore