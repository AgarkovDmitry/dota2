import * as React from 'react'
import { observable, action } from 'mobx'

import Match from 'store/types/match'

const styles = require('./style.scss')

interface Props{
  match: Match
  getHero: Function
  team: number
}

export default class MatchContainer extends React.Component<Props, null>{
  @observable isCollapsed: boolean = false

  @action collapse = () => this.isCollapsed = !this.isCollapsed

  render() {
    const { match, getHero, team } = this.props

    return (
      <div className={match.winnerTeam == team ? styles.win : styles.loss}>
        <div onClick={this.collapse} className={styles.clickable}>
          <div>{match.leagueName}</div>
          <div className={styles.infoContainer}>
            <div className={styles.teamContainer}>
              <div>{match.radiantTeamName}</div>
            </div>
            <div className={styles.titleContainer}>
              <div>{match.duration.toLocaleTimeString()}</div>
              <div>{match.onsetTime.toLocaleDateString()}</div>
            </div>
            <div className={styles.teamContainer}>
              <div>{match.direTeamName}</div>
            </div>
          </div>
        </div>
        {
          this.isCollapsed
          && <div className={styles.extraInfo}>
            <hr className={styles.divider}/>
            <span>{match.radiantTeamName}</span>
            <div className={styles.imagesContainer}>
            {
              match.radiantPicks.map(item => (
                <a href={`https://www.opendota.com/heroes/${item.hero}`} key={item.hero}>
                  <img src={getHero(item.hero).img} width={64} height={36} className={styles.image}/>
                </a>
              ))
            }
            </div>
            <div className={styles.imagesContainer}>
            {
              match.radiantBans.map(item => (
                <a href={`https://www.opendota.com/heroes/${item.hero}`} key={item.hero}>
                  <img src={getHero(item.hero).img} width={64} height={36} className={styles.imageBan}/>
                </a>
              ))
            }
            </div>
            <hr className={styles.divider}/>
            <span>{match.direTeamName}</span>
            <div className={styles.imagesContainer}>
            {
              match.direPicks.map(item => (
                <a href={`https://www.opendota.com/heroes/${item.hero}`} key={item.hero}>
                  <img src={getHero(item.hero).img} width={64} height={36} className={styles.image}/>
                </a>
              ))
            }
            </div>
            <div className={styles.imagesContainer}>
            {
              match.direBans.map(item => (
                <a href={`https://www.opendota.com/heroes/${item.hero}`} key={item.hero}>
                  <img src={getHero(item.hero).img} width={64} height={36} className={styles.imageBan}/>
                </a>
              ))
            }
            </div>
            <hr className={styles.divider}/>
            <a href={`https://www.opendota.com/matches/${match.id}`} className={styles.learnMore}> Learn More </a>
          </div>
        }
      </div>
    )
  }
}