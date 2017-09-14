import * as React from 'react'

import HeroChart from 'components/hero-chart'
import HeroInfo from 'components/hero-info'
const styles = require('./style.scss')

export default ({ team, fetchMatches, matchesLength, history }) => (
  team
  ? <div className={styles.page}>
      <div className={styles.leftBar}>
        <button onClick={fetchMatches}> fetch more {matchesLength}</button>
        <button onClick={() => history.push('/teams')}> teams </button>
      </div>
      <div className={styles.centralContent}>
        <h1 className={styles.centralTitle}>{team.name}({team.winRate}%)</h1>
        <HeroChart team={team}/>
        <HeroInfo id={13} key={12} team={team.team_id}/>
      </div>
      <div className={styles.rightBar}>
      </div>
  </div>
  : null
)