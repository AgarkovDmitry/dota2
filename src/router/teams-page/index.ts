import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('dataStore'),
  withRouter,
  observer,
  mapProps(
    props => ({
      ...props,
      teams: props.dataStore.teams
      .sort((a, b) => b.rating - a.rating)
      .filter((item, key) => key < 50)
    })
  ),
  observer
)(Component)