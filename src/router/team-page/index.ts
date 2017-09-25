import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer,
  mapProps(
    ({ store, match }) => ({
      team: store.dataStore.getTeam(match.params.id),
      id: match.params.id,
      store
    })
  ),
  observer
)(Component)