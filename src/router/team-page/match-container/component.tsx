import * as React from 'react'

const styles = require('./style.scss')

export default ({ match, getHero, team }) => (
  <div className={match.winnerTeam == team ? styles.win : styles.loss}>
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
)
/* 
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
*/