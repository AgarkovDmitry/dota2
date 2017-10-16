import axios from 'axios'

const hostUrl = 'https://api.opendota.com/api'

export default {
  fetchHeroes: () => axios.get(`${hostUrl}/heroStats`).then(res => res.data),
  fetchLeagues: () => axios.get(`${hostUrl}/leagues`).then(res => res.data),
  fetchPlayers: () => axios.get(`${hostUrl}/proPlayers`).then(res => res.data),
  fetchTeams: () => axios.get(`${hostUrl}/teams`).then(res => res.data),
  fetchProMatches: (id?: number) => axios.get(`${hostUrl}/proMatches${id ? `?less_than_match_id=${id}` : ''}`).then(res => res.data),
  fetchMatchInfo: (id: number) => axios.get(`${hostUrl}/matches/${id}`).then(res => res.data),


  fetchTeamMatches: (id: number) => axios.get(`${hostUrl}/teams/${id}/matches`).then(res => res.data)
}