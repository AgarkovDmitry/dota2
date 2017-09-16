import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'
const styles = require('./style.scss')

export default compose(
  inject('store', 'matches'),
  withRouter,
  observer,
  mapProps(
    ({ store }) => {
      const { nodes, links } = store.localStore.convertInfo(styles.selected)

      return ({
        nodes,
        links
      })
    }
  ),
  observer
)(Component)