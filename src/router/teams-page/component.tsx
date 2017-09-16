import * as React from 'react'

// const styles = require('./style.less')

export default ({ teams, history }) => (
  teams
  ? <div>
    {
      teams.map(team => (
        <div onClick={() => history.push(`/teams/${team.team_id}`)} key={team.team_id}>
          { team.name } - { team.rating } - { team.wins / (team.wins + team.losses)}%
        </div>
      ))
    }
  </div>
  : null
)