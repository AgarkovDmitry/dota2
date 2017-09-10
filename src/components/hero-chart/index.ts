import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer,
  mapProps(
    ({ team, store }) => ({
      info: store.heroesStats(team.team_id),
      heroes: store.heroes.data,
      store
    })
  ),
  observer
)(Component)