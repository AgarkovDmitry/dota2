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
      team: props.store.dataStore.getTeam(props.match.params.id)
    })
  ),
  observer
)(Component)