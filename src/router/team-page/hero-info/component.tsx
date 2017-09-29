import * as React from 'react'
import { computed } from 'mobx'

import Hero from 'store/types/hero'
import LocalStore from '../store'
import DataStore from 'store/data-store'

const styles = require('./style.scss')

export default class HeroInfo extends React.Component<any, any>{
  constructor (props) {
    super(props)
  }

  @computed get localStore(): LocalStore {
    return this.props.store.localStore
  }

  @computed get data(): DataStore {
    return this.props.store.dataStore
  }

  @computed get winRate(): number {
    return this.picks ? parseInt((100 * this.wins / this.picks).toFixed(0)) : 0
  }

  @computed get picks(): number {
    return this.heroStat.reduce((res, a) => res + a.picks, 0)
  }

  @computed get wins(): number {
    return this.heroStat.reduce((res, a) => res + a.wins, 0)
  }

  @computed get bans (): number {
    const hero = this.localStore.selectedHeroes[0]
    let matches = this.localStore.filteredMatches

    return matches.filter(match => {
      const picks = match.radiantTeam == this.localStore.team ? match.direBans : match.radiantBans
      return picks.reduce((res, a) => res || a.hero == hero, false)
    }).length
  }

  @computed get heroStat() {
    if (this.localStore.selectedHeroes[0]) {
      let matches = this.localStore.filteredMatches
      let heroStats = matches.map(match => {
        const player = match.players.find(player => player.hero_id == this.localStore.selectedHeroes[0])
        return { account_id: player.account_id, won: match.winnerTeam == this.localStore.team }
      })

      let players = heroStats.reduce((a, b) => a.includes(b.account_id) ? a : [...a, b.account_id], [])

      players = players.map(player => heroStats.reduce((res, hero) =>
        hero.account_id == player ? { ...res, wins: res.wins + +hero.won, picks: res.picks + 1 } : res,
        { account_id: player, wins: 0, picks: 0 })
      )

      return players.map(item => {
        const player = this.data.getPlayer(item.account_id)
        return { ...item, ...player, isActual: player.team == this.localStore.team }
      })
    }
    return []
  }

  @computed get hero(): Hero {
    return this.localStore.selectedHeroes.length == 1 ? this.data.getHero(this.localStore.selectedHeroes[0]) : null
  }

  render () {
    return (
      <div className={styles.heroContainer} key={'hero-' + this.localStore.selectedHeroes[0]}>
      {
        this.hero &&
        <div className={styles.container}>
          <h1 className={styles.title}>{this.hero.name}</h1>

          <div>
            <div className={styles.headContainer}>
              <div className={styles.statTitle}>Player</div>
              <div className={styles.statValue}>Wins</div>
              <div className={styles.statValue}>Picks</div>
              <div className={styles.statValue}>WR</div>
              <div className={styles.statValue}>Bans</div>
            </div>
            {
              this.heroStat.map(stat => (
                <div className={styles.statContainer} key={stat.account_id}>
                  <div className={styles.statTitle}>{stat.name}</div>
                  <div className={styles.statValue}>{stat.wins}</div>
                  <div className={styles.statValue}>{stat.picks}</div>
                  <div className={styles.statValue}>{(100 * stat.wins / stat.picks).toFixed(0)}%</div>
                </div>
              ))
            }

            <div className={styles.statContainer}>
              <div className={styles.statTitle}>Team</div>
              <div className={styles.statValue}>{this.wins}</div>
              <div className={styles.statValue}>{this.picks}</div>
              <div className={styles.statValue}>{this.winRate}%</div>
              <div className={styles.statValue}>{this.bans}</div>
            </div>
            <div className={styles.statContainer}>
              <div className={styles.statTitle}>All teams</div>
              <div className={styles.statValue}>{this.hero.proWins}</div>
              <div className={styles.statValue}>{this.hero.proPicks}</div>
              <div className={styles.statValue}>{this.hero.proWinRate}%</div>
              <div className={styles.statValue}>{this.hero.proBans}</div>
            </div>
          </div>
        </div>
      }
    </div>
    )
  }
}