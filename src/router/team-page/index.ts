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
      matches: props.matches,
      team: props.teams.data.find(item => item.team_id == props.match.params.id),
      fetchMatches: () => props.matches.fetch(true, props.match.params.id),
      matchesLength: props.matches.data.filter(item => item.dire_team_id == props.match.params.id || item.radiant_team_id == props.match.params.id).length
    })
  ),
  observer
)(Component)