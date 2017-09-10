import * as React from 'react'

import HeroChart from 'components/hero-chart'
// const styles = require('./style.less')

export default ({ team, fetchMatches, matchesLength, history }) => (
  team
  ? <div>
    <button onClick={fetchMatches}> fetch more {matchesLength}</button>
    <button onClick={() => history.push('/teams')}> teams </button>
    {team.name} - {team.winRate}%
    <HeroChart team={team}/>
  </div>
  : null
)