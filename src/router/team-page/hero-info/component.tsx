import * as React from 'react'
import { computed } from 'mobx'

import Hero from 'store/types/hero'
import LocalStore from '../store'
import DataStore from 'store/data-store'

const styles = require('./style.scss')

export default class HeroInfo extends React.Component<any, null>{
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
    const hero = this.localStore.heroes[0]
    let matches = this.localStore.filteredMatches

    return matches.filter(match => {
      const picks = match.radiantTeam.id == this.localStore.team ? match.direBans : match.radiantBans
      return picks.reduce((res, a) => res || a.hero == hero, false)
    }).length
  }

  @computed get heroStat() {
    if (!this.hero)
      return []

    let picks = this.localStore.filteredMatches.map(match => {
      const pick = match.teamPicks(this.localStore.team).find(pick => pick.hero == this.hero)
      return { player: pick.player, win: match.didHeroWin(this.hero) }
    })

    return picks
      .reduce((a, b) =>
        a.find(item => item == b.player) ? a : [...a, b.player],
        []
      )
      .map(player =>
        picks.reduce((res, pick) =>
          pick.player == player ? { ...res, wins: res.wins + +pick.win, picks: res.picks + 1 } : res,
          { player, wins: 0, picks: 0, isActual: player && player.team && player.team.id == this.localStore.team })
      )
  }

  @computed get hero(): Hero {
    return this.localStore.heroes.length == 1 ? this.localStore.heroes[0] : null
  }

  render () {
    return (
      this.hero &&
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div>
            <h1 className={styles.title}>{this.hero.name}</h1>
            <img src={this.hero.img}/>
          </div>
          <div className={styles.statsContainer}>
            {
              this.heroStat.filter(item => item.player).map(stat => (
                <div className={styles.statContainer} key={stat.player.id}>
                  <div className={styles.playerName}>{stat.player.name}</div>
                  <div className={styles.playerWins}>{stat.wins} / {stat.picks}</div>
                  <div className={styles.playerPercent}>{(100 * stat.wins / stat.picks).toFixed(0)}%</div>
                </div>
              ))
            }
            <div className={styles.statContainer}>
              <div className={styles.statTitle}>Team</div>
              <div className={styles.statBigValue}>{this.wins} / {this.picks}</div>
              <div className={styles.statValue}>{this.winRate}%</div>
              <div className={styles.statValue}>{this.bans}</div>
            </div>
            <div className={styles.statContainer}>
              <div className={styles.statTitle}>General</div>
              <div className={styles.statBigValue}>{this.hero.proWins} / {this.hero.proPicks}</div>
              <div className={styles.statValue}>{this.hero.proWinRate}%</div>
              <div className={styles.statValue}>{this.hero.proBans}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/*
this.localStore.selectedHeroes.length > 0
      ? <div className={styles.mainContainer}>
        <div className={styles.subcontainer}>
          <div className={styles.leftHeroesContainer}>
          {
            this.localStore.selectedHeroes
            .filter((item, key) => !(key % 2))
            .map((hero, key) => (
              <div key={key} className={styles.heroContainer}>
                <img src={hero.img} height={54} width={96} className={styles.heroImage}/>
              </div>
            ))
          }
          </div>
          <div className={styles.contentContainer}>
            { 100 * this.localStore.filteredMatches.reduce((res, item) => res + +(item.winnerTeam.id == this.localStore.team), 0) / this.localStore.filteredMatches.length }%
            (
              { this.localStore.filteredMatches.reduce((res, item) => res + +(item.winnerTeam.id == this.localStore.team), 0)}
              /
              { this.localStore.filteredMatches.length }
            )
          </div>
          <div className={styles.rightHeroesContainer}>
          {
            this.localStore.selectedHeroes
            .filter((item, key) => key % 2)
            .map((hero, key) => (
              <div key={key} className={styles.heroContainer}>
                <img src={hero.img} height={54} width={96} className={styles.heroImage}/>
              </div>
            ))
          }
          </div>
        </div>
      </div>
      : null
        /* this.hero &&
        <div className={styles.container}>
          <div>
            <h1 className={styles.title}>{this.hero.name}</h1>
            <div className={styles.imageWrapper}>
              <img src={this.hero.img}/>
              <div className={styles.imageText}>
              {
                this.heroStat.map(stat => (
                  <div className={styles.statContainer} key={stat.account_id}>
                    <div className={styles.playerName}>{stat.name}</div>
                    <div className={styles.playerResult}>{stat.wins} / {stat.picks}</div>
                    <div className={styles.playerResult}>{(100 * stat.wins / stat.picks).toFixed(0)}%</div>
                  </div>
                ))
              }
              </div>
            </div>
          </div> */

          /* <div className={styles.stats}>
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
*/