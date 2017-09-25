import * as React from 'react'

// const styles = require('./style.less')

export default class extends React.Component<any, any>{
  componentDidMount() {
    this.props.dataStore.loadTeams()
  }

  render() {
    const { teams, history } = this.props

    return (
      teams
      ? <div>
        {
          teams.map(team => (
            <div onClick={() => history.push(`/teams/${team.id}`)} key={team.id}>
              { team.name } - { team.rating } - { team.winRate }%
            </div>
          ))
        }
      </div>
      : null
    )
  }
}