import * as React from 'react'

const styles = require('./style.scss')

export default ({ match, getHero }) => (
  <div className={styles.matchContainer}>
    <div className={styles.teamContainer}>
      <div>{match.radiantTeamName}({match.radiantScore})</div>
      <div>
        {
          match.radiantPicks.map(item => (
            <img src={getHero(item.hero).img} width={40} height={22.5} className={styles.imagePick}/>
          ))
        }
      </div>
      <div>
        {
          match.radiantBans.map(item => (
            <img src={getHero(item.hero).img} width={40} height={22.5} className={styles.imageBan}/>
          ))
        }
      </div>
    </div>
    <div>
      <div>{match.leagueName}</div>
      <div>{match.duration.toLocaleTimeString()}</div>
      <div>{match.onsetTime.toLocaleDateString()}</div>
    </div>
    <div className={styles.teamContainer}>
      <div>{match.direTeamName}({match.direScore})</div>
      <div>
        {
          match.direPicks.map(item => (
            <img src={getHero(item.hero).img} width={40} height={22.5} className={styles.imagePick}/>
          ))
        }
      </div>
      <div>
        {
          match.direBans.map(item => (
            <img src={getHero(item.hero).img} width={40} height={22.5} className={styles.imageBan}/>
          ))
        }
      </div>
    </div>
  </div>
)