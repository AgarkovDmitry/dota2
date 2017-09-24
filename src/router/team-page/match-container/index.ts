import { observer, inject } from 'mobx-react'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  observer,
  mapProps(
    props => ({
      ...props,
      team: props.store.localStore.team,
      getHero: (id) => props.store.localStore.data.heroes.getHero(id)
    })
  ),
  observer
)(Component)