import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer,
  mapProps(
    props => ({
      ...props,
      fetchMatches: () => props.store.dataStore.loadMatchesWithExtras(5, false, { team: props.store.localStore.team })
    })
  ),
  observer
)(Component)