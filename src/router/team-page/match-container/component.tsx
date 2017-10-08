import * as React from 'react'
import { observable, action, computed } from 'mobx'

import Match from 'store/types/match'
import Store from 'store'

const styles = require('./style.scss')

interface Props{
  match: Match
  store: Store
}

export default class MatchContainer extends React.Component<Props, null>{
  @observable isCollapsed: boolean = false

  @action collapse = () => this.isCollapsed = !this.isCollapsed

  @computed get team() {
    return this.props.store.localStore.team
  }

  @computed get match() {
    return this.props.match
  }

  render() {
    return (
      <div className={this.match.winnerTeam.id == this.team ? styles.win : styles.loss}>
        <div onClick={this.collapse} className={styles.clickable}>
          <div>{this.match.league.name}</div>
          <div className={styles.infoContainer}>
            <div className={styles.teamContainer}>
              <div>{this.match.radiantTeam.name}</div>
            </div>
            <div className={styles.titleContainer}>
              <div>{this.match.duration.toLocaleTimeString()}</div>
              <div>{this.match.onsetTime.toLocaleDateString()}</div>
            </div>
            <div className={styles.teamContainer}>
              <div>{this.match.direTeam.name}</div>
            </div>
          </div>
        </div>
        {
          this.isCollapsed
          && <div className={styles.extraInfo}>
            <hr className={styles.divider}/>
            <span>{this.match.radiantTeam.name}</span>
            <div className={styles.imagesContainer}>
            {
              this.match.radiantPicks.map(item => (
                <a href={`https://www.opendota.com/heroes/${item.hero.id}`} key={item.hero.id}>
                  <img src={item.hero.img} width={64} height={36} className={styles.image}/>
                </a>
              ))
            }
            </div>
            <div className={styles.imagesContainer}>
            {
              this.match.radiantBans.map(item => (
                <a href={`https://www.opendota.com/heroes/${item.hero.id}`} key={item.hero.id}>
                  <img src={item.hero.img} width={64} height={36} className={styles.imageBan}/>
                </a>
              ))
            }
            </div>
            <hr className={styles.divider}/>
            <span>{this.match.direTeam.name}</span>
            <div className={styles.imagesContainer}>
            {
              this.match.direPicks.map(item => (
                <a href={`https://www.opendota.com/heroes/${item.hero.id}`} key={item.hero.id}>
                  <img src={item.hero.img} width={64} height={36} className={styles.image}/>
                </a>
              ))
            }
            </div>
            <div className={styles.imagesContainer}>
            {
              this.match.direBans.map(item => (
                <a href={`https://www.opendota.com/heroes/${item.hero.id}`} key={item.hero.id}>
                  <img src={item.hero.img} width={64} height={36} className={styles.imageBan}/>
                </a>
              ))
            }
            </div>
            <hr className={styles.divider}/>
            <a href={`https://www.opendota.com/matches/${this.match.id}`} className={styles.learnMore}> Learn More </a>
          </div>
        }
      </div>
    )
  }
}