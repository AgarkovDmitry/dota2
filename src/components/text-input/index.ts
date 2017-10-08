import { observer } from 'mobx-react'
import { compose, } from 'recompose'

import Component from './component'

export default compose(
  observer
)(Component)