import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import Component from './component'

export default compose(
  withRouter,
  inject('store'),
  observer
)(Component)