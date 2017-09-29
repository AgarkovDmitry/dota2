import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer
)(Component)