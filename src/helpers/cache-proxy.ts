import api from 'api'

const readFromLocalStorage = (key: string): Array<any> => {
  let item = JSON.parse(window.localStorage.getItem(key))

  if (!item)
    return null
  if (new Date().getTime() > item.expiryDate) {
    return null
  }

  return item.data
}

const writeToLocalStorage = (key: string, data: Array<any>, expiryDate?: number) => {
  window.localStorage.setItem(
    key,
    JSON.stringify({
      data,
      expiryDate: expiryDate ? new Date().getTime() + expiryDate * 3600000 : undefined
    })
  )
}

export default {
  async loadHeroes (force?: boolean) {
    const key = 'heroes'
    let data = readFromLocalStorage(key)

    if (!data || force) {
      data = await api.fetchHeroes()
      writeToLocalStorage(key, data, 3)
    }

    return data
  },

  async loadLeagues (force?: boolean) {
    const key = 'leagues'
    let data = readFromLocalStorage(key)

    if (!data || force) {
      data = await api.fetchLeagues()
      data = data.filter(item => item.tier == 'premium' || item.tier == 'professional')
      writeToLocalStorage(key, data, 24)
    }

    return data
  },

  async loadTeams (force?: boolean) {
    const key = 'teams'
    let data = readFromLocalStorage(key)

    if (!data || force) {
      data = await api.fetchTeams()
      data = data
        .filter(item => item.name)
        .sort((a, b) => b.rating - a.rating)
        .filter((item, key) => key < 200)
      writeToLocalStorage(key, data, 24)
    }

    return data
  },

  async loadPlayers (force?: boolean) {
    const key = 'players'
    let data = readFromLocalStorage(key)

    if (!data || force) {
      data = await api.fetchPlayers()
      writeToLocalStorage(key, data, 24)
    }

    return data
  },

  async loadMatches (count: number = 1, match_id?: number, force?: boolean) {
    const MAX_MATCHES = 2000
    const key = 'matches'
    let data = readFromLocalStorage(key)

    if (!navigator.onLine)
      return data

    if (!data || force) {
      data = []

      for (let i = 0; i < count; i++) {
        let res = await api.fetchProMatches(
          i > 0 ? data[data.length - 1].match_id : undefined
        )
        data.push(...res.filter(item => item.radiant_team_id && item.dire_team_id))
      }

      writeToLocalStorage(key, data)
    }
    else {
      if (!match_id) {
        let temp = []

        for (let i = 0; i < count; i++) {
          let res = await api.fetchProMatches(
            i > 0 ? temp[temp.length - 1].match_id : undefined
          )

          res = res.filter(item => item.match_id > data[0].match_id)

          temp.push(...res)

          if (res.length < 100)
            break
        }

        data.unshift(...temp.filter(item => item.radiant_team_id && item.dire_team_id))

        writeToLocalStorage(key, data.filter((item, key) => key < MAX_MATCHES))
      }
      else {
        let temp = []

        for (let i = 0; i < count; i++) {
          let res = await api.fetchProMatches(
            i > 0 ? temp[temp.length - 1].match_id : match_id
          )

          temp.push(...res)
        }

        data.push(...temp.filter(item => item.radiant_team_id && item.dire_team_id))

        writeToLocalStorage(key, data.filter((item, key) => key < MAX_MATCHES))
      }
    }

    return data
  },

  async loadMatchesExtra (ids: Array<number>, force?: boolean) {
    const MAX_MATCHES = 15
    const key = 'matchesExtras'
    let data = readFromLocalStorage(key)
    data = data ? data : []

    if (!navigator.onLine)
      return data

    const res = await Promise.all(
      ids
      .filter(id => !data.find(item => item.match_id == id) || force)
      .map((id) => api.fetchMatchInfo(id))
    )

    data.push(...res)

    writeToLocalStorage(key, data.sort((a, b) => b.start_time - a.start_time).filter((item, key) => key < MAX_MATCHES))
    return data.filter(item => ids.includes(item.match_id))
  }
}