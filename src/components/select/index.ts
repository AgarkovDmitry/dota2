import { observer } from 'mobx-react'
import { compose } from 'recompose'
import onClickOutside from 'react-onclickoutside'

import Component from './component'

export default compose(
  onClickOutside,
  observer
)(Component)