import { observer, inject } from 'mobx-react'
import { compose } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  observer
)(Component)