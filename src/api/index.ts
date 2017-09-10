import axios from 'axios'

const hostUrl = 'https://api.opendota.com/api'

export default {
    fetchTeams: () => axios.get(`${hostUrl}/teams`).then(res => res.data),
    fetchLeagues: () => axios.get(`${hostUrl}/leagues`).then(res => res.data),

    fetchHeroes: () => axios.get(`${hostUrl}/heroes`).then(res => res.data),
    fetchHeroesStats: () => axios.get(`${hostUrl}/heroStats`).then(res => res.data),

    fetchProPlayers: () => axios.get(`${hostUrl}/proPlayers`).then(res => res.data),
    fetchProMatches: (id?: number) => axios.get(`${hostUrl}/proMatches${id ? `?less_than_match_id=${id}` : ''}`).then(res => res.data),
    fetchMatchInfo: (id: number) => axios.get(`${hostUrl}/matches/${id}`).then(res => res.data),
}