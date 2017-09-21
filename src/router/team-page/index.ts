import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('teams', 'heroes', 'matches', 'players', 'store'),
  withRouter,
  observer,
  mapProps(
    props => ({
      ...props,
      team: props.teams.data.find(item => item.team_id == props.match.params.id),
      fetchMatches: () => props.matches.fetch(true, props.match.params.id)
    })
  ),
  observer
)(Component)