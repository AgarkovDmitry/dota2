import * as React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

const styles = require('./style.scss')

interface Props{
  match: FullMatch
  team?: Team
}

@inject(({ pageStore }) => ({ team: pageStore.team }))
@observer
export default class MatchContainer extends React.Component<Props, null>{
  @observable isCollapsed: boolean = false

  @action collapse = () => this.isCollapsed = !this.isCollapsed

  render() {
    const match = this.props.match
    const team = this.props.team
    return (
      <div className={match.winnerTeam == team ? styles.win : styles.loss}>
        <div onClick={this.collapse} className={styles.clickable}>
          <div>{match.league.name}</div>
          <div className={styles.infoContainer}>
            <div className={styles.teamContainer}>
              <div>{match.radiantTeam.name}</div>
            </div>
            <div className={styles.titleContainer}>
              <div>{match.match.duration.toLocaleTimeString()}</div>
              <div>{match.match.onsetTime.toLocaleDateString()}</div>
            </div>
            <div className={styles.teamContainer}>
              <div>{match.direTeam.name}</div>
            </div>
          </div>
        </div>
        {
          this.isCollapsed && <div className={styles.extraInfo}>
          <hr className={styles.divider}/>
          <span>{match.radiantTeam.name}</span>
          <div className={styles.imagesContainer}>
          {
            match.radiantPicks.map(item => (
              <a href={`https://www.opendota.com/heroes/${item.hero.id}`} key={item.hero.id}>
                <img src={item.hero.img} width={64} height={36} className={styles.image}/>
              </a>
            ))
          }
          </div>
          <div className={styles.imagesContainer}>
          {
            match.radiantBans.map(item => (
              <a href={`https://www.opendota.com/heroes/${item.hero.id}`} key={item.hero.id}>
                <img src={item.hero.img} width={64} height={36} className={styles.imageBan}/>
              </a>
            ))
          }
          </div>
          <hr className={styles.divider}/>
          <span>{match.direTeam.name}</span>
          <div className={styles.imagesContainer}>
          {
            match.direPicks.map(item => (
              <a href={`https://www.opendota.com/heroes/${item.hero.id}`} key={item.hero.id}>
                <img src={item.hero.img} width={64} height={36} className={styles.image}/>
              </a>
            ))
          }
          </div>
          <div className={styles.imagesContainer}>
          {
            match.direBans.map(item => (
              <a href={`https://www.opendota.com/heroes/${item.hero.id}`} key={item.hero.id}>
                <img src={item.hero.img} width={64} height={36} className={styles.imageBan}/>
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